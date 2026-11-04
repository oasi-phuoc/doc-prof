#!/usr/bin/env python3
"""Independently confirm spectral candidates using unchanged waveform thresholds.

The result establishes a shared recording only. It never certifies dialogue cuts,
the correctness of a transcription, listening, or permission to promote an audio.
"""
import argparse
import datetime as dt
import functools
import hashlib
import json
from pathlib import Path
import subprocess

import numpy as np
from scipy.signal import resample_poly

if __package__:
    from .verify_acoustic_matches import (
        COMPARISON_VERSION, RATE, anchor_starts, best_correlation, compare, decode,
    )
else:
    from verify_acoustic_matches import (
        COMPARISON_VERSION, RATE, anchor_starts, best_correlation, compare, decode,
    )


@functools.lru_cache(maxsize=1152)
def decode_coarse(path):
    raw = subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-i', str(path),
                          '-map', '0:a:0', '-vn', '-ac', '1', '-ar', '1000',
                          '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype='<f4')


def classify_internal_edits(result):
    """Keep edited recordings separate from a constant-offset confirmation."""
    anchors = result.get('anchors', [])
    if (result.get('status') == 'signal_not_confirmed' and len(anchors) >= 3 and
            all(a['correlation'] >= .8 for a in anchors) and
            all(b['source_anchor_start'] > a['source_anchor_start']
                for a, b in zip(anchors, anchors[1:]))):
        result = {**result, 'status': 'signal_source_shared_with_internal_edits',
                  'constant_offset_confirmed': False,
                  'replacement_compatibility_validated': False,
                  'requires_explicit_segment_or_assembly_assignment': True}
    return result


def compare_at_offset(old_file, source_file, offset, radius_seconds=1):
    """Disambiguate repeated readings with a fingerprint seed, then prove all anchors.

    A seed never confirms anything by itself. All selected anchors still need
    correlation >= .8 and a common offset within 40 ms, at 8 kHz.
    """
    old, source = decode(str(old_file)), decode(str(source_file))
    width = min(len(old), 3*RATE, max(RATE//2, len(old)//4))
    starts = anchor_starts(old, width) if width else []
    anchors = []
    for first in starts:
        expected = round(offset*RATE)+first
        lower = max(0, expected-round(radius_seconds*RATE))
        upper = min(len(source), expected+round(radius_seconds*RATE)+width)
        value = best_correlation(source[lower:upper], old[first:first+width]) if upper>lower else None
        if value is None:
            continue
        index, score = value
        absolute = index+lower
        anchors.append(dict(old_anchor_start=first/RATE, anchor_seconds=width/RATE,
                            source_anchor_start=absolute/RATE, correlation=round(score, 6),
                            source_offset_seconds=(absolute-first)/RATE))
    strong = [a for a in anchors if a['correlation']>=.8]
    spread = max(a['source_offset_seconds'] for a in strong)-min(a['source_offset_seconds'] for a in strong) if strong else None
    same = len(strong)>=min(3,len(starts)) and len(strong)>=2 and spread<=.04
    return dict(status='signal_source_confirmed' if same else 'signal_not_confirmed',
                method='fingerprint seed disambiguates repeated readings; separated 8kHz waveform anchors, unchanged correlation and offset thresholds',
                comparison_version=3, sample_rate=RATE, anchors=anchors,
                fingerprint_offset_hint_seconds=offset, local_search_radius_seconds=radius_seconds,
                offset_spread_seconds=spread, old_duration_decoded=len(old)/RATE,
                source_duration_decoded=len(source)/RATE,
                source_offset_seconds=float(np.median([a['source_offset_seconds'] for a in strong])) if same else None,
                listening_performed=False, clean_boundaries_validated=False)


def compare_candidate(old_file, source_file):
    """Reject a failing mandatory first anchor before the full three-anchor check.

    This gate can only reject, never confirm. The original comparison performs
    every confirmation, with its correlation and offset thresholds unchanged.
    """
    old = decode(str(old_file))
    width = min(len(old), 3*RATE, max(RATE//2, len(old)//4))
    if width:
        first = anchor_starts(old, width)[0]
        coarse = best_correlation(decode_coarse(str(source_file)),
                                  resample_poly(old[first:first+width], 1, 8))
        if coarse is not None and coarse[1] < .35:
            return dict(status='coarse_signal_candidate_rejected', comparison_version=COMPARISON_VERSION,
                        reason='discovery_only_1khz_anchor_correlation_below_0.35',
                        coarse_anchor_correlation=round(coarse[1], 6),
                        full_8khz_comparison_performed=False, listening_performed=False,
                        clean_boundaries_validated=False)
        source = decode(str(source_file))
        value = best_correlation(source, old[first:first+width])
        if value is None or value[1] < .8:
            return dict(status='signal_not_confirmed', comparison_version=COMPARISON_VERSION,
                        reason='mandatory_first_anchor_below_confirmation_threshold',
                        first_anchor_correlation=round(value[1], 6) if value else None,
                        first_anchor_start=first/RATE, listening_performed=False,
                        clean_boundaries_validated=False)
    return classify_internal_edits(compare(str(old_file), str(source_file)))


def digest(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--discovery', type=Path, required=True)
    parser.add_argument('--refs-json', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--top', type=int, default=3)
    parser.add_argument('--minimum-votes', type=int, default=8)
    args = parser.parse_args()
    repo = Path(__file__).resolve().parents[2]
    if args.output.resolve().is_relative_to(repo):
        raise ValueError('Write comparison evidence outside the repository')
    refs = {r['old_ref']: r for r in json.loads(args.refs_json.read_text())}
    discovery = json.loads(args.discovery.read_text())
    prior = json.loads(args.output.read_text()) if args.output.exists() else {}
    evidence = {(r['old_ref'], r['source_sha256']): r for r in prior.get('evidence', [])}
    checked_files = {}
    def require_hash(path, expected):
        key = str(path)
        if key not in checked_files:
            checked_files[key] = digest(path)
        if checked_files[key] != expected:
            raise ValueError('Audio bytes differ from discovery inventory: '+key)
    def save():
        data = dict(schema_version=1, updated_at=dt.datetime.now(dt.timezone.utc).isoformat(),
                    purpose='Shared-recording evidence, not listening or approved dialogue cuts',
                    comparison_version=COMPARISON_VERSION, listening_performed=False,
                    production_modified=False, evidence=list(evidence.values()))
        temporary = args.output.with_suffix('.tmp')
        temporary.write_text(json.dumps(data, ensure_ascii=False, indent=2)+'\n')
        temporary.replace(args.output)
    for match in discovery['matches']:
        if match['old_ref'] not in refs:
            continue
        ref = refs[match['old_ref']]
        require_hash(ref['current_file'], ref['sha256'])
        if ref['sha256'] != match['old_sha256']:
            raise ValueError('Current inventory and fingerprint inventory differ')
        for candidate in match['candidates'][:args.top]:
            if candidate['landmark_votes'] < args.minimum_votes:
                continue
            key = ref['old_ref'], candidate['source_sha256']
            require_hash(candidate['source_file'], candidate['source_sha256'])
            if key in evidence:
                if evidence[key]['old_sha256'] != ref['sha256']:
                    raise ValueError('Earlier waveform evidence has different current bytes')
                evidence[key] = classify_internal_edits(evidence[key])
                earlier = evidence[key]
                if (earlier['status']=='coarse_signal_candidate_rejected' and
                        earlier.get('coarse_anchor_correlation',0)>=.35):
                    del evidence[key]
            if (candidate['landmark_votes']>=100 and
                    evidence.get(key,{}).get('status') not in ('signal_source_confirmed','signal_source_shared_with_internal_edits') and
                    evidence.get(key,{}).get('offset_disambiguation_version')!=2):
                # The globally best peak for each anchor may come from different
                # repeated readings. Test each observed offset coherently.
                hints=[candidate['approximate_source_offset_seconds']]
                hints += [a['source_offset_seconds'] for a in evidence.get(key,{}).get('anchors',[])
                          if a['correlation']>=.8]
                hints=list(dict.fromkeys(round(hint,4) for hint in hints))
                for hint in hints:
                    result=compare_at_offset(ref['current_file'],candidate['source_file'],hint)
                    if result['status']=='signal_source_confirmed':break
                if result['status']=='signal_source_confirmed':
                    previous=evidence.get(key)
                    evidence[key]=dict(old_ref=ref['old_ref'],old_sha256=ref['sha256'],
                        source_id=candidate['source_id'],source_sha256=candidate['source_sha256'],
                        source_file=candidate['source_file'],receipt_aliases=candidate['receipt_aliases'],
                        discovery_landmark_votes=candidate['landmark_votes'],seeded_retry_performed=True,
                        offset_disambiguation_version=2,**result)
                    if previous:evidence[key]['previous_comparison_preserved']=previous
                    save()
                elif key in evidence:
                    evidence[key]['seeded_retry_performed']=True
                    evidence[key]['offset_disambiguation_version']=2
            if key not in evidence:
                result = dict(old_ref=ref['old_ref'], old_sha256=ref['sha256'],
                              source_id=candidate['source_id'], source_sha256=candidate['source_sha256'],
                              source_file=candidate['source_file'], receipt_aliases=candidate['receipt_aliases'],
                              discovery_landmark_votes=candidate['landmark_votes'])
                result.update(compare_candidate(ref['current_file'], candidate['source_file']))
                if (candidate['landmark_votes']>=100 and result['status']!='signal_source_confirmed'):
                    offsets=list(dict.fromkeys(round(a['source_offset_seconds'],4)
                        for a in result.get('anchors',[]) if a['correlation']>=.8))
                    for hint in offsets:
                        aligned=compare_at_offset(ref['current_file'],candidate['source_file'],hint)
                        if aligned['status']=='signal_source_confirmed':
                            before=result.copy();result.update(aligned)
                            result['previous_comparison_preserved']=before
                            break
                evidence[key] = result
                if candidate['landmark_votes']>=100:
                    evidence[key]['seeded_retry_performed']=True
                    evidence[key]['offset_disambiguation_version']=2
                save()
                print(json.dumps({k: result.get(k) for k in
                      ['old_ref', 'source_id', 'status', 'source_offset_seconds']}, ensure_ascii=False), flush=True)
            if evidence[key]['status'] in ('signal_source_confirmed', 'signal_source_shared_with_internal_edits'):
                break
    save()


if __name__ == '__main__':
    main()
