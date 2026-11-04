#!/usr/bin/env python3
"""Apply an explicit, reversible audio/question patch after source and text checks."""
import argparse
import hashlib
import json
from pathlib import Path
import re
import shutil
import unicodedata


def read(path):return json.loads(Path(path).read_text())
def sha(path):return hashlib.sha256(Path(path).read_bytes()).hexdigest()
def normal(text):return re.sub(r'[^a-z0-9]+',' ',''.join(c for c in unicodedata.normalize('NFD',text.lower()) if unicodedata.category(c)!='Mn')).strip()


def validate_exercise(exercise,facts):
    questions=exercise['questions'];support=exercise['support']
    if len(questions)!=len(facts):raise ValueError('Review every question in a changed exercise')
    refs=support.get('audios') or [support['audio']]
    for q,fact in zip(questions,facts):
        if fact['question']!=q['enonce']:raise ValueError('Question differs from its review')
        choices=q['choix'];correct=[c['texte'] for c in choices if c.get('correct')]
        if len(choices)!=3 or len(correct)!=1 or len({normal(c['texte']) for c in choices})!=3:
            raise ValueError('Invalid QCM choices')
        if correct[0]!=fact['correct_answer'] or q['formes']['lignes']['reponse_modele']!=correct[0]:
            raise ValueError('QCM and inline answers differ')
        index=q.get('audio',1)-1
        if index<0 or index>=len(refs):raise ValueError('Invalid question audio index')
        texts=support['transcription'];text=texts[index] if isinstance(texts,list) else texts
        if not fact['evidence'] or any(normal(quote) not in normal(text) for quote in fact['evidence']):
            raise ValueError('Evidence is absent from the selected audio transcript')


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repo',type=Path,default=Path(__file__).resolve().parents[1])
    parser.add_argument('--patch',type=Path,required=True)
    parser.add_argument('--apply',action='store_true')
    args=parser.parse_args();repo=args.repo;patch=read(args.patch)
    bank_path=repo/patch['bank'];bank=read(bank_path);byid={e['id']:e for e in bank}
    for row in patch['exercises']:
        if row['before']['id']!=row['after']['id']:raise ValueError('Exercise id changed')
        if byid[row['before']['id']] not in [row['before'],row['after']]:raise ValueError('Exercise changed since review')
        validate_exercise(row['after'],row['facts'])
    for row in patch['audios']:
        source=Path(row['source_work_file']);destination=repo/'public'/row['destination'].lstrip('/')
        if not destination.resolve().is_relative_to((repo/'public/lib/audio/tcf/co').resolve()):raise ValueError('Unexpected audio destination')
        if sha(source)!=row['sha256'] or not row['technical_checks_passed'] or row['human_listening_performed']:
            raise ValueError('Missing source integrity evidence or false listening attestation')
        if destination.exists() and sha(destination)!=row['sha256']:raise ValueError('Destination contains other bytes')
    if args.apply:
        durations_path=repo/'src/tcf/content/audio-durations.json';durations=read(durations_path)
        for row in patch['audios']:
            target=repo/'public'/row['destination'].lstrip('/');target.parent.mkdir(parents=True,exist_ok=True)
            if not target.exists():shutil.copyfile(row['source_work_file'],target)
            if sha(target)!=row['sha256']:raise ValueError('Copied audio differs')
            durations[row['destination']]=row['duration_seconds']
        replacement={r['after']['id']:r['after'] for r in patch['exercises']}
        bank=[replacement.get(e['id'],e) for e in bank]
        bank_path.write_text(json.dumps(bank,ensure_ascii=False,indent=2)+'\n')
        durations_path.write_text(json.dumps(durations,ensure_ascii=False,indent=2)+'\n')
        patch['status']='applied_automatic_technical_checks_and_text_review'
        patch['production_modified']=True
        args.patch.write_text(json.dumps(patch,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(dict(exercises=len(patch['exercises']),audio_files=len(patch['audios']),
        reviewed_questions=sum(len(r['facts']) for r in patch['exercises']),applied=args.apply,human_listening_performed=False)))


if __name__=='__main__':main()
