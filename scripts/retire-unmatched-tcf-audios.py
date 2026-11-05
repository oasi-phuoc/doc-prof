#!/usr/bin/env python3
"""Retire exactly the 297 legacy files selected by the user and their dependent exercises."""
import argparse
import datetime as dt
import hashlib
import json
from pathlib import Path
import subprocess


def read(path):return json.loads(Path(path).read_text())
def sha(path):return hashlib.sha256(Path(path).read_bytes()).hexdigest()
def write(path,data):Path(path).write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repo',type=Path,default=Path(__file__).resolve().parents[1])
    parser.add_argument('--apply',action='store_true')
    args=parser.parse_args();repo=args.repo;docs=repo/'docs/tcf/remplacement-audio'
    report_path=docs/'retrait-297-references-20261104.json'
    if report_path.exists():
        report=read(report_path);targets={r['old_ref']:r for r in report['audios']}
    else:
        known={r['old_ref'] for r in read(docs/'identites-sources-unifiees.json')['references']}
        targets={r['old_ref']:dict(old_ref=r['old_ref'],sha256=r['audio_sha256'],
            original_exercise_ids=r['exercise_ids'],bytes=(repo/'public'/r['old_ref'].lstrip('/')).stat().st_size)
            for r in read(docs/'rapprochement-432/transcriptions.json')['sources'] if r['old_ref'] not in known}
        if len(targets)!=297:raise ValueError('The user selected exactly the historical list of 297 references')
        report=dict(schema_version=1,created_at=dt.datetime.now(dt.timezone.utc).isoformat(),
            reason='Suppression explicite des 297 anciennes références sans original retrouvé, demandée par l’utilisateur.',
            source_commit=subprocess.check_output(['git','rev-parse','HEAD'],cwd=repo,text=True).strip(),
            status='planned',audios=list(targets.values()),removed_exercises=[])
    changes=[];removed=[];active_refs=set()
    for bank in sorted((repo/'src/tcf/content').glob('*/co.json')):
        before=read(bank);after=[]
        for exercise in before:
            refs=exercise['support'].get('audios') or [exercise['support'].get('audio')]
            hit=[ref for ref in refs if ref in targets]
            if hit:
                if any(ref not in targets for ref in refs):
                    raise ValueError('A mixed exercise needs explicit passage review: '+exercise['id'])
                removed.append(dict(bank=str(bank.relative_to(repo)),id=exercise['id'],
                    audio_refs=refs,question_count=len(exercise.get('questions',[]))))
            else:after.append(exercise);active_refs.update(ref for ref in refs if ref)
        if before!=after:changes.append((bank,after))
    if active_refs.intersection(targets):raise ValueError('A retained exercise still uses a retired recording')
    for ref,record in targets.items():
        file=repo/'public'/ref.lstrip('/')
        if not file.resolve().is_relative_to((repo/'public/lib/audio/tcf/co').resolve()):raise ValueError('Unexpected deletion destination')
        if file.exists() and sha(file)!=record['sha256']:raise ValueError('Legacy file changed since inventory: '+ref)
        if not file.exists() and report['status']!='applied':raise ValueError('Missing file before retirement: '+ref)
    if report['status']=='applied' and removed:raise ValueError('Retired exercises were reintroduced')
    if report['status']!='applied':report['removed_exercises']=removed
    summary=dict(legacy_files_retired=len(targets),previously_active_legacy_refs=len({r for e in report['removed_exercises'] for r in e['audio_refs']}),
        previously_replaced_legacy_refs=len(targets)-len({r for e in report['removed_exercises'] for r in e['audio_refs']}),
        exercises_removed=len(report['removed_exercises']),questions_removed=sum(e['question_count'] for e in report['removed_exercises']),
        mixed_exercises_changed=0,retained_active_audio_refs=len(active_refs),
        received_original_files_deleted=0,grammar_original_files_deleted=0,new_corrected_audio_files_deleted=0,
        original_bytes_retired=sum(r['bytes'] for r in targets.values()))
    report['summary']=summary
    if args.apply and report['status']!='applied':
        # Complete the dependency checks before making any mutation. Git retains the
        # exact pre-removal bytes at source_commit; no second public library is made.
        for bank,after in changes:write(bank,after)
        for name in ['audio-durations.json','co-reviewed-pools.json']:
            file=repo/'src/tcf/content'/name;data=read(file)
            write(file,{key:value for key,value in data.items() if key not in targets})
        for ref in targets:(repo/'public'/ref.lstrip('/')).unlink()
        report.update(status='applied',applied_at=dt.datetime.now(dt.timezone.utc).isoformat(),
            rollback='Restore the listed paths and exercise objects from source_commit in git; historical transcriptions remain in rapprochement-432.')
        write(report_path,report)
    print(json.dumps(dict(**summary,applied=report['status']=='applied'),ensure_ascii=False))


if __name__=='__main__':main()
