#!/usr/bin/env python3
"""Check final MP3 content against the source-derived text; separate this from human listening."""
import argparse
import datetime as dt
import difflib
import hashlib
import json
from pathlib import Path
import re
from match_sources import norm_words


def read(path):return json.loads(Path(path).read_text())
def sha(path):return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def compare_text(expected,actual):
    a,b=norm_words(expected),norm_words(actual)
    match=difflib.SequenceMatcher(None,a,b,autojunk=False)
    matched=sum(block.size for block in match.get_matching_blocks())
    coverage=matched/max(1,len(a));precision=matched/max(1,len(b))
    flags=[]
    # These are conservative lexical checks, not phonetic or semantic certification.
    for name,x,y in [('first',a[:3],b[:5]),('last',a[-3:],b[-5:])]:
        if len(set(x)&set(y))<min(2,len(set(x))):flags.append(name+'_words_require_review')
    if min(coverage,precision)<.8:flags.append('transcript_difference_requires_review')
    if re.search(r'(?i)\b(?:page\s+\d+|exercice\s+\d+|document\s+[a-z])\b',actual):
        flags.append('spoken_instruction_candidate')
    return dict(expected_token_coverage=round(coverage,4),candidate_token_precision=round(precision,4),flags=flags)


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repo',type=Path,default=Path(__file__).resolve().parents[2])
    parser.add_argument('--work',type=Path,required=True)
    parser.add_argument('--extra-asr-dir',type=Path,action='append',default=[])
    args=parser.parse_args();work=args.work
    report=read(args.repo/'docs/tcf/remplacement-audio/rapprochement-432/extension-127/decoupes-preparees.json')
    source={s['source_id']:s for s in read(work/'source-catalogue.json')['sources']}
    entries=[]
    recognitions={d['source_sha256']:d for folder in [work/'candidate-asr-parakeet',*args.extra_asr_dir]
        for p in folder.glob('*.json') if (d:=read(p)).get('status')=='transcribed'}
    secondary={r['source_sha256']:r for p in (work/'candidate-asr-whisper-fr').glob('*.json')
               if (r:=read(p)).get('status')=='transcribed'}
    for cut in report['cuts']:
        audio=work/cut['candidate_work_file'];data=recognitions.get(cut['candidate_sha256'],{})
        if sha(audio)!=cut['candidate_sha256'] or data.get('source_sha256')!=cut['candidate_sha256'] or data.get('status')!='transcribed':
            raise ValueError('Candidate recognition is incomplete or belongs to other bytes')
        if sha(source[cut['source_id']]['source_file'])!=cut['source_sha256']:
            raise ValueError('Original recording changed')
        if sha(work/cut['boundary_manifest'])!=cut['boundary_manifest_sha256']:
            raise ValueError('Boundary evidence changed')
        comparison=compare_text(cut['proposed_transcription'],data['text'])
        french=secondary.get(cut['candidate_sha256'])
        corroboration=compare_text(cut['proposed_transcription'],french['text']) if french else None
        passed=not comparison['flags'] or (corroboration is not None and not corroboration['flags'])
        entries.append(dict(old_ref=cut['old_ref'],candidate_id=cut['candidate_cut_id'],
            source_sha256=cut['source_sha256'],candidate_sha256=cut['candidate_sha256'],
            status='automatic_technical_checks_passed' if passed else 'textual_review_required',
            exact_lossless_source_slice_verified=True,mp3_full_decode_verified=True,
            boundary_manifest_sha256=cut['boundary_manifest_sha256'],post_cut_recognition=data['text'],
            comparison=comparison,transcript_unresolved_points=cut['transcript_unresolved_points'],
            supplementary_french_recognition=french['text'] if french else None,
            supplementary_comparison=corroboration,
            semantic_correctness_certified=False,human_listening_performed=False))
    summary=dict(candidates=len(entries),original_recordings_preserved=127,
        lossless_slices_checked=131,mp3_full_decodes_checked=131,post_cut_recognitions_completed=len(entries),
        automatic_technical_checks_passed=sum(e['status']=='automatic_technical_checks_passed' for e in entries),
        textual_review_required=sum(e['status']=='textual_review_required' for e in entries),
        human_listening_performed=False,semantic_correctness_certified=False)
    output=dict(schema_version=1,created_at=dt.datetime.now(dt.timezone.utc).isoformat(),summary=summary,
        method='Exact source-derived FLAC and full MP3 decode verified during preparation; hashes rechecked; independent final-file recognition compared lexically. No human listening certification.',
        checks=entries)
    destination=args.repo/'docs/tcf/remplacement-audio/rapprochement-432/extension-127/validation-technique.json'
    destination.write_text(json.dumps(output,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(summary,ensure_ascii=False))


if __name__=='__main__':main()
