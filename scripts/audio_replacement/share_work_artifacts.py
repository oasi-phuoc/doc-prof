#!/usr/bin/env python3
"""Share immutable, byte-identical generated files without removing any path.

Original recordings, backups, manifests and images are never candidates. A
source checksum is part of the key: two distinct recordings cannot be merged.
Refinements must always create a new run, never modify an existing audio file.
"""
from __future__ import annotations
import argparse
import json
import os
from pathlib import Path
import stat
import sys
import uuid

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from tcf_audio_boundaries import safe_artifact, safe_work, sha256


class WorkArtifactStore:
    def __init__(self, roots, journal):
        self.roots = [safe_work(Path(root)) for root in roots]
        if any(root.name != 'staged-boundaries-work' for root in self.roots):
            raise ValueError('Only generated staged-boundaries-work directories may be shared')
        self.journal = Path(journal)
        self.index = {}
        self.shared_files = 0
        self.reclaimed_bytes = 0

    def share(self, path, source_sha, expected_sha):
        path = Path(path).absolute()
        if (path != path.resolve() or not any(path.is_relative_to(root) for root in self.roots)
                or path.suffix not in ('.flac', '.mp3') or len(source_sha) != 64):
            raise ValueError('Generated audio path and source checksum required')
        current = path.stat()
        if not stat.S_ISREG(current.st_mode) or sha256(path) != expected_sha:
            raise ValueError('Generated artifact checksum changed: ' + str(path))
        key = (source_sha, expected_sha, path.suffix)
        canonical = self.index.get(key)
        if canonical is None:
            self.index[key] = path
            return
        if canonical == path or os.path.samefile(path, canonical):
            return
        previous = canonical.stat()
        if previous.st_dev != current.st_dev or previous.st_mode != current.st_mode:
            return
        # Recheck the canonical bytes immediately before replacing the directory
        # entry; stale or externally changed artifacts must never be propagated.
        if sha256(canonical) != expected_sha:
            raise ValueError('Canonical artifact checksum changed: ' + str(canonical))
        temporary = path.with_name('.share-' + uuid.uuid4().hex)
        try:
            os.link(canonical, temporary)
            if path.stat().st_ino != current.st_ino or sha256(path) != expected_sha:
                raise ValueError('Artifact changed while sharing: ' + str(path))
            os.replace(temporary, path)
        finally:
            if temporary.exists():
                temporary.unlink()
        reclaimed = current.st_blocks * 512 if current.st_nlink == 1 else 0
        self.shared_files += 1
        self.reclaimed_bytes += reclaimed
        self.journal.parent.mkdir(parents=True, exist_ok=True)
        with self.journal.open('a', encoding='utf-8') as handle:
            handle.write(json.dumps({'source_sha256': source_sha, 'artifact_sha256': expected_sha,
                'path_retained': str(path), 'shared_with': str(canonical),
                'reclaimed_bytes': reclaimed, 'all_paths_and_bytes_preserved': True}) + '\n')

    def add_manifest(self, manifest_path):
        manifest_path = Path(manifest_path)
        manifest = json.loads(manifest_path.read_text())
        if manifest.get('status') != 'needs_review':
            return
        source_sha = manifest['source']['sha256']
        for segment in manifest['segments']:
            entries = [segment['audio'], *segment['windows'].values()]
            for entry in entries:
                if entry.get('available', True):
                    self.share(safe_artifact(manifest_path.parent, entry['path']), source_sha, entry['sha256'])
            mp3 = safe_artifact(manifest_path.parent, segment['audio']['path']).with_name('candidate.mp3')
            if mp3.is_file():
                self.share(mp3, source_sha, sha256(mp3))

    def seed(self):
        for root in self.roots:
            for manifest in sorted(root.glob('run-*/manifest.json')):
                self.add_manifest(manifest)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', type=Path, action='append', required=True)
    parser.add_argument('--journal', type=Path, required=True)
    args = parser.parse_args()
    store = WorkArtifactStore(args.root, args.journal)
    store.seed()
    print(json.dumps({'shared_files': store.shared_files, 'reclaimed_bytes': store.reclaimed_bytes,
                      'originals_modified': False, 'paths_removed': 0}))


if __name__ == '__main__':
    main()
