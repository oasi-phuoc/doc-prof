#!/usr/bin/env python3
"""Resumable exact FLAC/MP3 candidates and boundary controls, outside production."""
import argparse
import datetime as dt
import html
import json
import math
from pathlib import Path
import shutil
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from tcf_audio_boundaries import prepare, safe_work, sha256, verify_integrity
from encode_candidate_mp3 import encode_source
from share_work_artifacts import WorkArtifactStore


def read(path):
    return json.loads(Path(path).read_text())


def atomic(path, data):
    temporary = path.with_suffix('.tmp')
    temporary.write_text(json.dumps(data, ensure_ascii=False, indent=2)+'\n')
    temporary.replace(path)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--work', type=Path, required=True)
    parser.add_argument('--catalogue', type=Path, required=True)
    parser.add_argument('--plan-index', type=Path, required=True)
    parser.add_argument('--share-root', type=Path, action='append', default=[])
    parser.add_argument('--source-id', action='append', default=[])
    args = parser.parse_args()
    root = safe_work(args.work/'staged-boundaries-work')
    root.mkdir(parents=True, exist_ok=True)
    sources = {r['source_id']:r for r in read(args.catalogue)['sources']}
    plans = read(args.plan_index)['sources']
    selected = set(args.source_id) if args.source_id else set(sources)
    if selected - set(sources):
        raise ValueError('Unknown source selection')
    progress_path, mp3_path = root/'batch-progress.json', root/'mp3-index.json'
    prepared = {r['source_id']:r for r in read(progress_path)['sources']} if progress_path.exists() else {}
    mp3s = {r['source_id']:r for r in read(mp3_path)['sources']} if mp3_path.exists() else {}
    sharing = WorkArtifactStore([*args.share_root, root], root/'storage-sharing.jsonl')
    sharing.seed()

    def save():
        now = dt.datetime.now(dt.timezone.utc).isoformat()
        rows = list(prepared.values())
        complete = all(r['source_id'] in prepared and prepared[r['source_id']].get('plan_sha256') == sha256(r['plan_path'])
                       and r['source_id'] in mp3s and
                       mp3s[r['source_id']]['boundary_manifest_sha256']==sha256(prepared[r['source_id']]['manifest'])
                       for r in plans)
        common = {'schema_version':1,'updated_at':now,'listening_performed':False,
                  'validated_segments':0,'production_modified':False}
        atomic(progress_path, {**common,'source_count':len(plans),'selected_this_run':len(selected),'processed':len(rows),'complete':complete,
            'plan_index':str(args.plan_index),'plan_index_sha256':sha256(args.plan_index),
            'prepared_sources':sum(r['status']=='needs_review' for r in rows),
            'prepared_segments':sum(r.get('segments',0) for r in rows if r['status']=='needs_review'),
            'blocked_sources':sum(r['status']=='blocked' for r in rows),'sources':rows})
        atomic(mp3_path, {**common,'source_count':len(mp3s),
                         'mp3_count':sum(len(r['segments']) for r in mp3s.values()),'sources':list(mp3s.values())})
        links = []
        for row in rows:
            if row.get('manifest'):
                page = Path(row['manifest']).parent/'review-mp3.html'
                links.append('<li><a href="'+html.escape(str(page.relative_to(root)),quote=True)+'">'+
                             html.escape(row['source_id'])+'</a></li>')
        (root/'review-index.html').write_text('<!doctype html><meta charset="utf-8"><title>Contrôle des audios</title>'
            '<h1>Audios préparés : écoute et transcription à contrôler</h1><p>Aucune écoute n’est attestée.</p><ul>'+
            ''.join(links)+'</ul>')

    # Exact-byte reference drafts usually share existing generated artifacts;
    # prepare them first, then process shorter original recordings before long ones.
    ordered = sorted(plans,key=lambda r:(r['classification_method']!='reference_draft_plan_exact_source_bytes_no_listening',
                                         sources[r['source_id']]['duration_seconds']))
    for plan in ordered:
        sid = plan['source_id']
        if sid not in selected:
            continue
        source = sources[sid]
        if source['sha256'] != plan['source_sha256'] or sha256(source['source_file']) != source['sha256']:
            raise ValueError('Original checksum mismatch')
        plan_sha = sha256(plan['plan_path'])
        previous = prepared.get(sid)
        if previous and previous.get('manifest') and not previous.get('plan_sha256'):
            previous_manifest=read(previous['manifest'])
            if read(Path(previous['manifest']).parent/previous_manifest['plan']['path'])==read(plan['plan_path']):
                previous['plan_sha256']=plan_sha
        if previous and previous.get('plan_sha256')==plan_sha and previous['status']=='needs_review':
            manifest = read(previous['manifest'])
            verify_integrity(manifest,Path(previous['manifest']).parent)
            if sid in mp3s and mp3s[sid]['boundary_manifest_sha256']==sha256(previous['manifest']):
                if any(sha256(r['file'])!=r['sha256'] for r in mp3s[sid]['segments']):
                    raise ValueError('An earlier MP3 candidate has changed')
                continue
            manifest_path = Path(previous['manifest'])
        else:
            if plan['plan_integrity'] != 'passed':
                prepared[sid]={'source_id':sid,'status':'blocked','reason':plan.get('blocker','Plan not passed')}
                save()
                continue
            # Conservative reserve for this source and temporary encoder output.
            content=read(plan['plan_path'])
            useful_seconds=sum(content['words'][r['last_word']]['end']-
                               content['words'][r['first_word']]['start']+.5 for r in content['segments'])
            # The full PCM is streamed in RAM, never written. Reserve the worst
            # case for the selected lossless ranges, four 2 s controls per range,
            # encoder headers and a 320 kbit/s MP3, plus the fixed spare space.
            estimated=math.ceil((useful_seconds+8*len(content['segments']))*
                source['sample_rate']*source['channels']*2*1.03+
                useful_seconds*40000+len(content['segments'])*32768)
            if shutil.disk_usage(root).free < max(64*1024**2,estimated+32*1024**2):
                save()
                raise RuntimeError('Disk reserve reached; every original and prepared version has been retained')
            manifest_path=prepare(Path(source['source_file']),Path(plan['plan_path']),root,compact=True)
            manifest=read(manifest_path)
            verify_integrity(manifest,manifest_path.parent)
        row={'source_id':sid,'source_sha256':source['sha256'],'plan_path':plan['plan_path'],
             'plan_sha256':plan_sha,'status':'needs_review','manifest':str(manifest_path),
             'segments':len(manifest['segments']),
             'integrity':'verified_exact_pcm_source_and_all_flac_slices',
             'bytes':sum(x.stat().st_size for x in manifest_path.parent.rglob('*') if x.is_file())}
        if previous and previous.get('manifest')!=str(manifest_path):
            row['previous_version_preserved']=previous
        prepared[sid]=row
        sharing.add_manifest(manifest_path)
        save()
        mp3s[sid]=encode_source(row,mp3s.get(sid))
        sharing.add_manifest(manifest_path)
        save()
        print(json.dumps({'source_id':sid,'prepared_sources':len(prepared),
            'prepared_segments':sum(r.get('segments',0) for r in prepared.values()),
            'free_bytes':shutil.disk_usage(root).free,'listening_performed':False}),flush=True)
    save()


if __name__ == '__main__':
    main()
