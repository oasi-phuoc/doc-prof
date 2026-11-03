#!/usr/bin/env python3
"""Signal evidence for source candidates; this does not attest listening or clean cuts."""
import argparse
import datetime as dt
import functools
import hashlib
import json
from pathlib import Path
import subprocess
import numpy as np
from scipy.signal import correlate

RATE = 8000
COMPARISON_VERSION = 2

@functools.lru_cache(maxsize=6)
def decode(path):
    raw = subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-i', path,
                          '-map', '0:a:0', '-vn', '-ac', '1', '-ar', str(RATE),
                          '-f', 'f32le', '-'], check=True, capture_output=True).stdout
    return np.frombuffer(raw, dtype='<f4').astype(np.float64)

def best_correlation(source, query):
    n = len(query)
    if n < RATE//4 or len(source) < n:
        return None
    query = query-query.mean()
    qe = float(np.dot(query, query))
    if qe < 1e-8:
        return None
    corr = correlate(source, query, mode='valid', method='fft')
    sums = np.r_[0., np.cumsum(source)]
    energies = np.r_[0., np.cumsum(source*source)]
    var = np.maximum(energies[n:]-energies[:-n]-(sums[n:]-sums[:-n])**2/n, 0.)
    denom = np.sqrt(qe*var)
    corr = np.divide(corr, denom, out=np.zeros_like(corr), where=denom > 1e-12)
    index = int(np.argmax(corr))
    return index, float(corr[index])


def anchor_starts(old, width):
    """Choose actual signal windows when the middle of an exam is a long pause.

    This only locates matching evidence. Silence never defines a dialogue cut.
    Keep the separated anchors and the same correlation/offset thresholds.
    """
    targets=[max(0,min(len(old)-width,int(len(old)*fraction)-width//2)) for fraction in (.2,.5,.8)]
    options=sorted(set(targets+[round((len(old)-width)*i/60) for i in range(61)]))
    sums=np.r_[0.,np.cumsum(old)]
    squares=np.r_[0.,np.cumsum(old*old)]
    energy={first:max(0.,float(squares[first+width]-squares[first] -
                   (sums[first+width]-sums[first])**2/width)) for first in options}
    floor=max(1e-8,max(energy.values(),default=0)*.02)
    useful=[first for first in options if energy[first]>=floor]
    if not useful:
        return sorted(set(targets))
    selected=[]
    for target in targets:
        candidates=sorted(useful,key=lambda first:(abs(first-target),-energy[first]))
        choice=next((first for first in candidates if all(abs(first-other)>=min(width//2,max(1,(len(old)-width)//2))
                                                        for other in selected)),None)
        if choice is not None:
            selected.append(choice)
    return sorted(set(selected))

def compare(old_file, source_file):
    old, source = decode(old_file), decode(source_file)
    # Separated anchors can demonstrate shared waveform and constant offset.
    width = min(len(old),3*RATE,max(RATE//2,len(old)//4))
    if width == 0:
        return {'status':'signal_not_confirmed','comparison_version':COMPARISON_VERSION,
                'reason':'empty_decoded_old_signal','anchors':[],
                'listening_performed':False,'clean_boundaries_validated':False}
    starts = anchor_starts(old,width)
    rows = []
    for first in starts:
        query = old[first:first+width]
        value = best_correlation(source, query)
        if value is not None:
            index, score = value
            rows.append({'old_anchor_start': first/RATE, 'anchor_seconds': len(query)/RATE,
                         'source_anchor_start': index/RATE, 'correlation': round(score, 6),
                         'source_offset_seconds': (index-first)/RATE})
    strong = [row for row in rows if row['correlation'] >= .8]
    spread = (max(row['source_offset_seconds'] for row in strong)-
              min(row['source_offset_seconds'] for row in strong)) if strong else None
    same = len(strong) >= min(3, len(starts)) and len(strong) >= 2 and spread <= .04
    return {'status': 'signal_source_confirmed' if same else 'signal_not_confirmed',
            'method': 'three separated non-silent 8kHz PCM waveform anchors, normalized FFT correlation',
            'comparison_version': COMPARISON_VERSION,
            'sample_rate': RATE, 'anchors': rows, 'offset_spread_seconds': spread,
            'old_duration_decoded': len(old)/RATE, 'source_duration_decoded': len(source)/RATE,
            'source_offset_seconds': float(np.median([row['source_offset_seconds'] for row in strong])) if same else None,
            'listening_performed': False, 'clean_boundaries_validated': False}

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--work', type=Path, default=Path('/workspace/work/tcf-audio-replacement'))
    parser.add_argument('--limit', type=int, default=0)
    parser.add_argument('--min-lexical-score', type=float, default=.75)
    parser.add_argument('--top-candidates',type=int,default=2)
    parser.add_argument('--refs-file',type=Path,help='JSON list of current audio refs to compare')
    parser.add_argument('--retry-unconfirmed',action='store_true',help='Recheck older failed comparisons with signal-bearing anchors')
    args = parser.parse_args()
    matches = json.loads((args.work/'source-dialogue-candidates.json').read_text())
    current = json.loads((args.work/'current-dialogue-index.json').read_text())
    byref = {row['old_ref']: row for row in current['dialogues']}
    output = args.work/'acoustic-source-evidence.json'
    previous = json.loads(output.read_text()) if output.exists() else {'evidence': []}
    evidence = {(row['old_ref'], row['source_id']): row for row in previous['evidence']}
    if not 1<=args.top_candidates<=24:
        raise ValueError('top-candidates must be between 1 and 24')
    refs=set(json.loads(args.refs_file.read_text())) if args.refs_file else None
    candidates = [(row, candidate) for row in matches['matches'] if refs is None or row['old_ref'] in refs
                  for candidate in row['candidates'][:args.top_candidates]
                  if candidate['score'] >= args.min_lexical_score]
    candidates.sort(key=lambda pair: pair[1]['source_file'])
    processed = 0
    def save():
        result = {'schema_version': 1, 'updated_at': dt.datetime.now(dt.timezone.utc).isoformat(),
                  'summary': {'compared': len(evidence),
                              'signal_confirmed': sum(row.get('status') == 'signal_source_confirmed' for row in evidence.values()),
                              'listening_performed': False, 'production_modified': False},
                  'evidence': list(evidence.values())}
        temporary = output.with_suffix('.tmp')
        temporary.write_text(json.dumps(result, ensure_ascii=False, indent=2)+'\n')
        temporary.replace(output)
    for row, candidate in candidates:
        key = row['old_ref'], candidate['source_id']
        earlier=evidence.get(key)
        if earlier and (not args.retry_unconfirmed or earlier['status']=='signal_source_confirmed' or
                        earlier.get('comparison_version',1)>=COMPARISON_VERSION):
            continue
        old = byref[row['old_ref']]
        result = {'old_ref': row['old_ref'], 'old_sha256': old['sha256'],
                  'source_id': candidate['source_id'], 'source_sha256': candidate['source_sha256'],
                  'source_file': candidate['source_file'], 'lexical_score': candidate['score']}
        try:
            result.update(compare(old['current_file'], candidate['source_file']))
        except Exception as error:
            result.update(status='comparison_failed', error=str(error))
        if earlier:
            result['previous_comparison_preserved']=earlier
        evidence[key] = result
        processed += 1
        save()
        print(json.dumps({k:result.get(k) for k in ['old_ref','source_id','status','source_offset_seconds']},ensure_ascii=False), flush=True)
        if args.limit and processed >= args.limit:
            break
    save()

if __name__ == '__main__':
    main()
