#!/usr/bin/env python3
"""Import reviewed, byte-bound grammar CO transcripts; preserve recordings and questions."""
import argparse
import copy
import datetime as dt
import hashlib
import json
from pathlib import Path
import re


def read(path):
    return json.loads(Path(path).read_text())


def digest(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def build_entries(bank, primary, secondary, decisions, plain=None):
    """Pure validation/import; decisions record text review, never human listening."""
    revised=copy.deepcopy(bank);records=[];plain=plain or {}
    ids={entry['exercise']['id'] for entry in bank}
    if set(decisions)!=ids:
        raise ValueError('Review every grammar recording, with no missing or unknown exercise id')
    for entry in revised:
        exercise=entry['exercise'];key=exercise['id'];source_sha=entry['source']['sha256']
        decision=decisions[key];first=primary.get(source_sha);second=secondary.get(source_sha)
        if not first or not second or first.get('status')!='transcribed' or second.get('status')!='transcribed':
            raise ValueError('Two completed recognitions are required: '+key)
        if first['source_sha256']!=source_sha or second['source_sha256']!=source_sha:
            raise ValueError('Recording checksum mismatch: '+key)
        if not decision.get('text_reviewed') or not decision.get('review_note','').strip():
            raise ValueError('Record the actual text review: '+key)
        third=plain.get(source_sha)
        if third and (third.get('status')!='transcribed' or third.get('source_sha256')!=source_sha):
            raise ValueError('Invalid supplementary recognition: '+key)
        reading=decision['reading']
        if reading not in ('parakeet','whisper_fr','whisper_plain_fr','editorial'):
            raise ValueError('Unknown transcript selection: '+key)
        selected={'parakeet':first,'whisper_fr':second,'whisper_plain_fr':third}
        if reading!='editorial' and not selected[reading]:
            raise ValueError('Selected recognition is missing: '+key)
        text=decision.get('text') if reading=='editorial' else selected[reading]['text']
        if not isinstance(text,str) or not text.strip() or '<unk>' in text:
            raise ValueError('Empty or unresolved selected transcript: '+key)
        text=re.sub(r'[ \t]+',' ',text).strip()
        if exercise['support'].get('transcription') and exercise['support']['transcription']!=text:
            raise ValueError('An existing transcript differs; preserve and review explicitly: '+key)
        exercise['support']['transcription']=text
        entry['status']='transcribed'
        entry['transcriptionReview']=dict(status='automatic_cross_check_and_text_review',
            sourceSha256=source_sha,reading=reading,humanListening=False)
        records.append(dict(exercise_id=key,source_sha256=source_sha,audio=exercise['support']['audio'],
            selected_text=text,reading=reading,review_note=decision['review_note'],
            unresolved_points=decision.get('unresolved_points',[]),
            parakeet_text=first['text'],whisper_french_text=second['text'],
            supplementary_whisper_plain_text=third['text'] if third else None,
            human_listening_performed=False))
    return revised,records


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repo',type=Path,default=Path(__file__).resolve().parents[1])
    parser.add_argument('--work',type=Path,required=True)
    parser.add_argument('--decisions',type=Path,required=True)
    args=parser.parse_args();repo=args.repo;work=args.work
    bank_path=repo/'src/grammaire/exercises/co-bank.json';bank=read(bank_path)
    primary={d['source_sha256']:d for p in (work/'parakeet').glob('*.json')
             if (d:=read(p)).get('status')=='transcribed'}
    secondary={d['source_sha256']:d for p in (work/'whisper-fr').glob('*.json')
               if (d:=read(p)).get('status')=='transcribed'}
    plain={d['source_sha256']:d for p in (work/'whisper-plain-fr').glob('*.json')
           if (d:=read(p)).get('status')=='transcribed'}
    decisions=read(args.decisions)
    if len(bank)!=127:raise ValueError('Re-inventory before importing a changed recording set')
    for entry in bank:
        audio=repo/'public'/entry['exercise']['support']['audio'].lstrip('/')
        if digest(audio)!=entry['source']['sha256']:raise ValueError('Original recording changed: '+str(audio))
    revised,records=build_entries(bank,primary,secondary,decisions,plain)
    # Every mutation other than the transcript, its review and source status is forbidden.
    for before,after in zip(bank,revised):
        check=copy.deepcopy(after);check['status']=before['status']
        check['exercise']['support']['transcription']=before['exercise']['support']['transcription']
        if 'transcriptionReview' in before:check['transcriptionReview']=before['transcriptionReview']
        else:check.pop('transcriptionReview',None)
        if check!=before:raise ValueError('Unexpected question or recording mutation')
    docs=repo/'docs/grammaire/co-import';inventory=read(docs/'sources.json')
    inventory.update(status='original_audio_with_transcripts',transcribed_sources=len(records),
        transcriptions_and_questions='Transcriptions ajoutées à la demande du 4 novembre 2026 ; questions conservées en attente.',
        transcription_method='Two local recognition engines plus recorded text review; no human listening claim')
    for source in inventory['sources']:source['transcription_status']='transcribed_cross_checked_draft'
    report=dict(schema_version=1,created_at=dt.datetime.now(dt.timezone.utc).isoformat(),
        summary=dict(recordings=len(records),transcripts_integrated=len(records),independent_recognitions=2,
            supplementary_plain_decodings=sum(bool(r['supplementary_whisper_plain_text']) for r in records),
            entries_with_unresolved_points=sum(bool(r['unresolved_points']) for r in records),
            recordings_modified=0,questions_added=0,human_listening_performed=False),
        primary_parameters=next(iter(primary.values()))['parameters'],
        secondary_parameters=next(iter(secondary.values()))['parameters'],transcriptions=records)
    if plain:report['supplementary_parameters']=next(iter(plain.values()))['parameters']
    for path,data in [(bank_path,revised),(docs/'sources.json',inventory),(docs/'transcriptions.json',report)]:
        path.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(report['summary'],ensure_ascii=False))


if __name__=='__main__':main()
