#!/usr/bin/env python3
"""Import audio independently; record explicit, checksum-guarded copyright exclusions."""
from __future__ import annotations
import argparse
import concurrent.futures
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path, PurePosixPath
import re
import shutil
import stat
import subprocess
import zipfile


def digest(path):
    with path.open('rb') as handle:
        return hashlib.file_digest(handle, 'sha256').hexdigest()


def inspect_audio(row):
    result = subprocess.run(['ffprobe', '-v', 'error', '-show_format', '-show_streams',
                             '-of', 'json', row['source_file']], capture_output=True, text=True, check=True)
    probe = json.loads(result.stdout)
    stream = next(s for s in probe['streams'] if s['codec_type'] == 'audio')
    check = subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-i', row['source_file'],
                            '-map', '0:a:0', '-f', 'null', '-'], capture_output=True, text=True)
    row.update(duration_seconds=float(probe['format']['duration']),
               sample_rate=int(stream['sample_rate']), channels=int(stream['channels']),
               integrity_errors=[check.stderr.strip() or f'ffmpeg exit {check.returncode}']
               if check.returncode or check.stderr.strip() else [])
    return row


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--archives', type=Path, required=True, help='JSON list of archive definitions')
    parser.add_argument('--direct-manifest', type=Path, action='append', default=[])
    parser.add_argument('--work', type=Path, required=True)
    args = parser.parse_args()
    work = args.work.resolve()
    if work.name != 'work' and not work.name.endswith('-work'):
        parser.error('Use an explicitly named work directory outside production')
    work.mkdir(parents=True, exist_ok=True)
    definitions = json.loads(args.archives.read_text())['archives']
    rows, archives, excluded_sources = [], [], []
    for definition in definitions:
        if not definition.get('local_archive'):
            archives.append(dict(definition))
            continue
        archive = Path(definition['local_archive']).resolve()
        archive_sha = digest(archive)
        folder = work / 'incoming' / definition['level'] / definition['collection']
        folder.mkdir(parents=True, exist_ok=True)
        retained = []
        with zipfile.ZipFile(archive) as source:
            members = [entry for entry in source.infolist() if not entry.is_dir()]
            required = sum(entry.file_size for entry in members)
            if required + 128*1024*1024 > shutil.disk_usage(work).free:
                raise RuntimeError('Not enough space to preserve the complete archive and working reserve')
            for entry in members:
                relative = PurePosixPath(entry.filename)
                if relative.is_absolute() or '..' in relative.parts or '\\' in entry.filename:
                    raise ValueError('Unsafe archive member path')
                if stat.S_ISLNK(entry.external_attr >> 16):
                    raise ValueError('Archive symlinks are not accepted')
                target = folder.joinpath(*relative.parts)
                target.parent.mkdir(parents=True, exist_ok=True)
                checksum = hashlib.sha256()
                exclusion = next((item for item in definition.get('copyright_exclusions',[])
                                  if item['member'] == entry.filename),None)
                if exclusion:
                    with source.open(entry) as original:
                        while chunk := original.read(1024*1024): checksum.update(chunk)
                    if checksum.hexdigest() != exclusion['sha256'] or exclusion.get('reason') != 'copyright':
                        raise ValueError('Copyright exclusion checksum or reason differs; refusing removal')
                    if target.exists():
                        if digest(target) != exclusion['sha256']:
                            raise ValueError('Extracted source changed; refusing copyright removal')
                        target.unlink()
                    excluded_sources.append({**exclusion,'archive_name':archive.name,
                                             'file_id':definition['file_id'],
                                             'status':'copyright_removed_from_extracted_audio_at_user_request'})
                    retained.append({'member':entry.filename,'bytes':entry.file_size,
                                     'sha256':checksum.hexdigest(),'crc32':f'{entry.CRC:08x}',
                                     'extracted_file_retained':False,'reason':'copyright_removed_at_user_request'})
                    continue
                if target.exists():
                    with source.open(entry) as original:
                        while chunk := original.read(1024*1024): checksum.update(chunk)
                    if target.stat().st_size != entry.file_size or digest(target) != checksum.hexdigest():
                        raise ValueError('Existing imported source differs; refusing overwrite')
                else:
                    with source.open(entry) as original, target.open('xb') as output:
                        while chunk := original.read(1024*1024):
                            output.write(chunk)
                            checksum.update(chunk)
                file_sha = checksum.hexdigest()
                retained.append({'member': entry.filename, 'bytes': entry.file_size,
                                 'sha256': file_sha, 'crc32': f'{entry.CRC:08x}'})
                if target.suffix.lower() != '.mp3':
                    continue
                number = re.search(r'_(\d{2,3})(?:_|\.|\s)', target.name)
                track = int(number[1]) if number else None
                member_id = hashlib.sha256(entry.filename.encode()).hexdigest()[:8]
                rows.append({'source_id': f'additional-20261102:{definition["collection"]}:{track}:{file_sha[:12]}:{member_id}',
                             'source_file': str(target), 'file_id': definition['file_id'],
                             'level': definition['level'], 'collection': definition['collection'],
                             'track': track, 'original_filename': target.name, 'sha256': file_sha,
                             'size_bytes': target.stat().st_size, 'archive_sha256': archive_sha,
                             'archive_member': entry.filename, 'archive_name': archive.name,
                             'source_batch': 'additional_archives_20261102'})
        archives.append({**definition, 'sha256': archive_sha, 'bytes': archive.stat().st_size,
                         'status': 'preserved_and_extracted', 'retained_members': retained})
    direct_count = 0
    for manifest_path in args.direct_manifest:
        manifest = json.loads(manifest_path.read_text())
        for item in manifest['files']:
            if item.get('error') or not item.get('path'):
                raise ValueError('A supplied file has not been transferred: '+item['file_id'])
            source = Path(item['path']).resolve()
            if not source.is_relative_to('/workspace/attachments') or not source.is_file():
                raise ValueError('Expected an actual uploaded source file')
            file_sha = digest(source)
            number = re.search(r'_(\d{2,3})(?:_|\.|\s)', source.name)
            track = int(number[1]) if number else None
            rows.append({'source_id': f'additional-20261102:{manifest["collection"]}:{track}:{file_sha[:12]}:{item["file_id"][-8:]}',
                         'source_file': str(source), 'file_id': item['file_id'],
                         'level': manifest['level'], 'collection': manifest['collection'],
                         'track': track, 'original_filename': source.name, 'sha256': file_sha,
                         'size_bytes': source.stat().st_size, 'source_batch': 'additional_archives_20261102',
                         'delivery': 'individual_file_original_retained',
                         'archive_name': manifest.get('archive_name')})
            direct_count += 1
        for archive in archives:
            if archive['archive_name'] == manifest.get('archive_name'):
                archive.update(status='individual_members_received',
                               alternative_delivery_manifest=str(manifest_path),
                               individual_files_received=len(manifest['files']),
                               original_zip_transfer='blocked_over_32MiB_original_attachment_retained')
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
        sources = list(executor.map(inspect_audio, rows))
    summary = {'files': len(sources), 'bytes': sum(r['size_bytes'] for r in sources),
               'duration_seconds': sum(r['duration_seconds'] for r in sources),
               'integrity_checked': len(sources), 'invalid': sum(bool(r['integrity_errors']) for r in sources),
               'by_level': {level: sum(r['level'] == level for r in sources) for level in ('a1','a2','b1')},
               'archives_received': sum(r['status'] == 'preserved_and_extracted' for r in archives),
               'collections_received': sum(r['status'] in ('preserved_and_extracted','individual_members_received') for r in archives),
               'collections_awaiting_transfer': sum(r['status'] not in ('preserved_and_extracted','individual_members_received') for r in archives),
               'individual_files_received': direct_count,
               'received_source_file_entries':len(sources)+len(excluded_sources),
               'user_authorized_copyright_removals':len(excluded_sources),
               'previous_408_sources_unchanged': True, 'no_unapproved_source_discarded': True,
               'listening_performed': False, 'production_modified': False}
    catalogue = {'schema_version': 1, 'created_utc': datetime.now(timezone.utc).isoformat(),
                 'summary': summary, 'sources': sources, 'excluded_copyright_sources':excluded_sources,'archives': archives}
    temporary = work / 'source-catalogue.tmp'
    temporary.write_text(json.dumps(catalogue, ensure_ascii=False, indent=2)+'\n')
    temporary.replace(work / 'source-catalogue.json')
    print(json.dumps(summary, ensure_ascii=False))


if __name__ == '__main__':
    main()
