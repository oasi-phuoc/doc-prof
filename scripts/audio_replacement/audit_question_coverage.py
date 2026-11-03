#!/usr/bin/env python3
"""Read-only question structure and coverage against prepared audio candidates.

Lexical absence in an ASR draft is a review flag, never proof that an answer is
wrong. This audit does not certify semantic correctness, listening or a migration.
"""
import argparse
import collections
import datetime as dt
import json
from pathlib import Path
import re
from match_sources import content_tokens


def read(path):
    return json.loads(Path(path).read_text())


def choice_issues(question):
    issues=[]
    variants={'default':question}
    variants.update({name:form for name,form in question.get('formes',{}).items()
                     if name in ('qcm_texte','qcm_image')})
    for name,variant in variants.items():
        choices=variant.get('choix')
        if not isinstance(choices,list):
            continue
        if len(choices)!=3:
            issues.append(name+':expected_three_choices')
        if sum(bool(c.get('correct')) for c in choices)!=1:
            issues.append(name+':expected_one_correct_choice')
        values=[c.get('texte') or c.get('image') for c in choices]
        if len(set(values))!=len(values):
            issues.append(name+':repeated_choices')
    return issues


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repo',type=Path,default=Path(__file__).resolve().parents[2])
    parser.add_argument('--mapping',type=Path,required=True)
    parser.add_argument('--work',type=Path,action='append',required=True)
    parser.add_argument('--out',type=Path,required=True)
    args=parser.parse_args()
    mapping={r['old_ref']:r for r in read(args.mapping)['proposals']}
    deliveries={}
    for work in args.work:
        for row in read(work/'staged-boundaries-work/mp3-index.json')['sources']:
            for item in row['segments']:
                deliveries[item['sha256']]=item
        assembly=work/'refinement-work/assembled-candidates.json'
        if assembly.exists():
            for item in read(assembly)['assemblies']:
                deliveries[item['sha256']]=item
    uses=collections.defaultdict(list)
    questions={}
    for bank in sorted((args.repo/'src/tcf/content').glob('*/co.json')):
        for exercise in read(bank):
            support=exercise.get('support',{})
            refs=support.get('audios') or [support.get('audio')]
            for ai,ref in enumerate(refs,1):
                if ref not in mapping:
                    continue
                selected=[]
                unassigned=False
                for qi,question in enumerate(exercise.get('questions',[])):
                    if len(refs)>1 and question.get('audio') not in (None,ai):
                        continue
                    key=exercise['id']+':'+str(qi)
                    selected.append(key)
                    unassigned=unassigned or (len(refs)>1 and question.get('audio') is None)
                    prompt=question.get('enonce','')
                    issues=choice_issues(question)
                    if not re.search(r'(?i)\b(?:qui|que|quoi|quels?|quelles?|lequel|laquelle|où|quand|comment|pourquoi|combien)\b|qu[’\']|est-ce',prompt):
                        issues.append('interrogative_form_to_review')
                    questions.setdefault(key,{'exercise_id':exercise['id'],'question_index_0based':qi,
                        'prompt':prompt,'type_reponse':question.get('type_reponse'),
                        'choices':question.get('choix',[]),'structural_review_flags':issues,
                        'answer_correctness_certified':False})
                uses[ref].append({'exercise_id':exercise['id'],'audio_index_1based':ai,
                    'audio_scope':'single_audio' if len(refs)==1 else
                        'multi_audio_includes_unassigned_questions_require_review' if unassigned else
                        'multi_audio_explicit_question_indices',
                    'questions':selected})
    audios=[]
    for ref,row in mapping.items():
        delivery=deliveries[row['candidate_sha256']]
        duration=delivery['probe']['duration']
        category='court' if duration<=15 else 'moyen' if duration<=45 else 'long'
        minimum={'court':2,'moyen':4,'long':8}[category]
        keys=list(dict.fromkeys(key for use in uses[ref] for key in use['questions']))
        distinct={questions[key]['prompt'].strip().casefold() for key in keys}
        available=content_tokens(row['proposed_transcription'])
        facts=[]
        for key in keys:
            correct=[c.get('texte') for c in questions[key]['choices'] if c.get('correct') and c.get('texte')]
            missing=sorted(set().union(*(content_tokens(answer)-available for answer in correct))) if correct else []
            if missing:
                facts.append({'question_key':key,'current_correct_answers':correct,
                    'unretrieved_asr_tokens':missing,'status':'review_only_asr_absence_does_not_prove_wrong_answer'})
        audios.append({'old_ref':ref,'source_id':row['source_id'],'source_batch':row['source_batch'],
            'candidate_id':row['candidate_cut_id'],'candidate_sha256':row['candidate_sha256'],
            'duration_seconds':duration,'duration_category_provisional':category,
            'minimum_questions_requested':minimum,'distinct_question_prompts':len(distinct),
            'question_bank_below_requested_minimum':len(distinct)<minimum,
            'question_keys':keys,'uses':uses[ref],'answer_fact_review_flags':facts,
            'transcription_status':'automatic_draft_requires_listening','listening_performed':False})
    issue_counts=collections.Counter(flag for question in questions.values() for flag in question['structural_review_flags'])
    summary={'prepared_audio_refs':len(audios),'existing_question_entries':len(questions),
        'distinct_exercises':len({q['exercise_id'] for q in questions.values()}),
        'structural_flags':dict(issue_counts),
        'audio_refs_below_requested_question_minimum':sum(r['question_bank_below_requested_minimum'] for r in audios),
        'questions_with_lexical_answer_review_flags':len({flag['question_key'] for row in audios for flag in row['answer_fact_review_flags']}),
        'semantic_correctness_certified':False,'listening_performed':False,'production_modified':False}
    result={'schema_version':1,'generated_at':dt.datetime.now(dt.timezone.utc).isoformat(),
        'purpose':'mechanical structure/coverage audit only; semantic correctness requires source review',
        'summary':summary,'questions':questions,'audios':audios}
    args.out.parent.mkdir(parents=True,exist_ok=True)
    args.out.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(summary,ensure_ascii=False))


if __name__=='__main__':main()
