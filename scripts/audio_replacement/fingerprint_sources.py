#!/usr/bin/env python3
"""Find recording candidates independently of transcripts; never validates a replacement.

Spectral landmarks are only a shortlist. A separate waveform comparison must
confirm the recording, and listening must still confirm cuts and exercise content.
All outputs live outside the repository. Sources and served audio are read only.
"""
import argparse
import collections
import concurrent.futures
import hashlib
import itertools
import json
from pathlib import Path
import subprocess
import time

import numpy as np
from scipy.ndimage import maximum_filter
from scipy.signal import stft

RATE = 8000
HOP = 128
VERSION = 'spectral-landmarks-v1'
DISCOVERY_VERSION = 'uniform-1000-landmarks-v1'


def decode(path):
    result = subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-i', str(path),
                             '-map', '0:a:0', '-vn', '-ac', '1', '-ar', str(RATE),
                             '-f', 'f32le', '-'], capture_output=True, check=True)
    return np.frombuffer(result.stdout, dtype='<f4')


def landmarks(samples):
    """Return (packed frequency-pair/time-delta hash, anchor frame) rows."""
    if len(samples) < 512:
        return np.empty((0, 2), dtype=np.uint32)
    _, _, spectrum = stft(samples, fs=RATE, nperseg=512, noverlap=512-HOP,
                          boundary=None, padded=False)
    power = np.abs(spectrum)
    maximum = float(power.max(initial=0))
    if maximum < 1e-8:
        return np.empty((0, 2), dtype=np.uint32)
    local = maximum_filter(power, size=(7, 7), mode='constant')
    mask = (power == local) & (power > maximum * .003)
    mask[:10] = False
    mask[245:] = False
    frequencies, frames = np.nonzero(mask)
    if not len(frames):
        return np.empty((0, 2), dtype=np.uint32)
    # Cap local density; loud music and long voiced vowels must not dominate.
    order = np.lexsort((-power[frequencies, frames], frames // 16))
    counts = collections.Counter()
    peaks = []
    for index in order:
        group = int(frames[index]) // 16
        if counts[group] < 4:
            counts[group] += 1
            peaks.append((int(frames[index]), int(frequencies[index]) // 2))
    peaks.sort()
    rows = []
    for i, (first, frequency) in enumerate(peaks):
        paired = 0
        for last, next_frequency in peaks[i+1:i+45]:
            delta = last-first
            if delta > 112:
                break
            if delta < 6 or abs(next_frequency-frequency) < 2:
                continue
            key = (frequency << 14) | (next_frequency << 7) | (delta // 2)
            rows.append((key, first))
            paired += 1
            if paired == 6:
                break
    return np.asarray(rows, dtype=np.uint32).reshape((-1, 2))


def cache_landmarks(path, expected_sha256, directory):
    cache = directory / (expected_sha256 + '-' + VERSION + '.npz')
    actual = hashlib.sha256(Path(path).read_bytes()).hexdigest()
    if actual != expected_sha256:
        raise ValueError('Source audio bytes differ from inventory: ' + str(path))
    if cache.exists():
        with np.load(cache, allow_pickle=False) as data:
            return data['landmarks']
    rows = landmarks(decode(path))
    directory.mkdir(parents=True, exist_ok=True)
    temporary = cache.with_suffix('.tmp.npz')
    np.savez_compressed(temporary, landmarks=rows)
    temporary.replace(cache)
    return rows


def make_index(source_rows):
    index = collections.defaultdict(list)
    for source_index, rows in enumerate(source_rows):
        for key, first in rows:
            index[int(key)].append((source_index, int(first)))
    return index


def neighboring_keys(key):
    f1, f2, delta = key >> 14, (key >> 7) & 127, key & 127
    for a, b, c in itertools.product((-1, 0, 1), repeat=3):
        if 0 <= f1+a < 128 and 0 <= f2+b < 128 and 0 <= delta+c < 128:
            yield ((f1+a) << 14) | ((f2+b) << 7) | (delta+c)


def discover(rows, index, keep=12):
    if len(rows) > 1000:
        rows = rows[np.linspace(0, len(rows)-1, 1000, dtype=int)]
    votes = collections.Counter()
    for key, first in rows:
        for variant in neighboring_keys(int(key)):
            positions = index.get(variant, ())
            if len(positions) > 500:
                continue
            for source_index, frame in positions:
                # +/- one neighboring bucket is pooled below. This tolerance
                # is for discovery; it never relaxes waveform confirmation.
                bucket = round((frame-int(first)) / 8)
                votes[(source_index, bucket)] += 1
    best = {}
    for (source_index, bucket), count in votes.items():
        score = count + votes.get((source_index, bucket-1), 0) + votes.get((source_index, bucket+1), 0)
        if score > best.get(source_index, (0, 0))[0]:
            best[source_index] = (score, bucket)
    ranked = sorted(best.items(), key=lambda x: x[1][0], reverse=True)[:keep]
    return [dict(source_index=i, landmark_votes=score,
                 approximate_source_offset_seconds=round(bucket*8*HOP/RATE, 3),
                 status='fingerprint_candidate_not_waveform_confirmed')
            for i, (score, bucket) in ranked]


def unique_sources(catalogues):
    by_hash = {}
    for filename in catalogues:
        for source in json.loads(Path(filename).read_text())['sources']:
            key = source['sha256']
            if key not in by_hash:
                by_hash[key] = {**source, 'receipt_aliases': []}
            by_hash[key]['receipt_aliases'].append(source['source_id'])
    return list(by_hash.values())


def write_json(path, value):
    temporary = path.with_suffix(path.suffix+'.tmp')
    temporary.write_text(json.dumps(value, ensure_ascii=False, indent=2)+'\n')
    temporary.replace(path)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--catalogue', type=Path, action='append', required=True)
    parser.add_argument('--refs-json', type=Path, required=True,
                        help='JSON array of current audio inventory objects')
    parser.add_argument('--work', type=Path, required=True)
    parser.add_argument('--threads', type=int, default=3)
    parser.add_argument('--keep', type=int, default=12)
    parser.add_argument('--output-name', default='fingerprint-candidates.json')
    args = parser.parse_args()
    repo = Path(__file__).resolve().parents[2]
    work = args.work.resolve()
    if work == repo or work.is_relative_to(repo):
        raise ValueError('Use a work directory outside the repository')
    if Path(args.output_name).name != args.output_name:
        raise ValueError('Output name must be a filename')
    work.mkdir(parents=True, exist_ok=True)
    sources = unique_sources(args.catalogue)
    refs = json.loads(args.refs_json.read_text())
    write_json(work/'fingerprint-source-index.json', dict(version=VERSION, sources=sources))
    start = time.monotonic()
    def process(source):
        return cache_landmarks(source['source_file'], source['sha256'], work/'source-fingerprints')
    source_rows = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=args.threads) as pool:
        for i, rows in enumerate(pool.map(process, sources), 1):
            source_rows.append(rows)
            if i % 32 == 0 or i == len(sources):
                print(json.dumps(dict(stage='source_index', sources=i, total=len(sources),
                                      seconds=round(time.monotonic()-start))), flush=True)
    index = make_index(source_rows)
    del source_rows
    results = []
    destination = work / args.output_name
    previous = json.loads(destination.read_text()) if destination.exists() else {}
    prior = {x['old_ref']: x for x in previous.get('matches', [])}
    catalogue_signature = hashlib.sha256(json.dumps([
        (s['sha256'], s['source_id'], s['receipt_aliases']) for s in sources]).encode()).hexdigest()
    for i, ref in enumerate(refs, 1):
        earlier = prior.get(ref['old_ref'])
        if (earlier and earlier.get('old_sha256') == ref['sha256'] and
                previous.get('version') == VERSION and
                previous.get('discovery_version') == DISCOVERY_VERSION and
                previous.get('kept_candidates') == args.keep and
                previous.get('catalogue_signature') == catalogue_signature):
            result = earlier
        else:
            rows = cache_landmarks(ref['current_file'], ref['sha256'], work/'current-fingerprints')
            candidates = discover(rows, index, args.keep)
            for candidate in candidates:
                source = sources[candidate.pop('source_index')]
                candidate.update(source_id=source['source_id'], source_sha256=source['sha256'],
                                 source_file=source['source_file'], receipt_aliases=source['receipt_aliases'])
            result = dict(old_ref=ref['old_ref'], old_sha256=ref['sha256'],
                          fingerprint_landmarks=len(rows), candidates=candidates)
        results.append(result)
        write_json(destination, dict(version=VERSION, discovery_version=DISCOVERY_VERSION,
                   catalogue_signature=catalogue_signature,
                   kept_candidates=args.keep,
                   purpose='Recording discovery only; requires independent waveform confirmation and listening',
                   source_entries=sum(len(s['receipt_aliases']) for s in sources), unique_source_files=len(sources),
                   listening_performed=False, production_modified=False, matches=results))
        print(json.dumps(dict(stage='discovery', refs=i, total=len(refs), old_ref=ref['old_ref'],
                              top_votes=result['candidates'][0]['landmark_votes'] if result['candidates'] else 0)), flush=True)


if __name__ == '__main__':
    main()
