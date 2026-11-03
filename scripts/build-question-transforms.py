#!/usr/bin/env python3
"""Fifty affirmative sentences with two independently checkable question forms."""
import json,re,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'scripts/grammar_curriculum'))
from lexicon import REGULAR,present
rows=[]
for i,(verb,complement) in enumerate(REGULAR):
 pro,person=[('tu',1),('il',2),('elle',2),('nous',3),('vous',4),('ils',5),('elles',5)][i%7]
 form=present(verb)[person]
 affirmative=f'{pro.capitalize()} {form} {complement}.'
 estce=('Est-ce qu’' if re.match('[aeiou]',pro) else 'Est-ce que ')+f'{pro} {form} {complement} ?'
 bridge='-t-' if pro in ('il','elle') and not form.endswith(('t','d')) else '-'
 inversion=form.capitalize()+bridge+pro+' '+complement+' ?'
 rows.append(dict(prompt=affirmative,estce=estce,inversion=inversion))
assert len(rows)==len({row['prompt'] for row in rows})==50
(ROOT/'src/grammaire/exercises/question-transform-data.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n')
# Fifty questions, each with a complete affirmative and negative model answer.
responses=[]
for i,(verb,complement) in enumerate(REGULAR):
 pro,person,reply_pro,reply_person=[('tu',1,'je',0),('il',2,'il',2),('elle',2,'elle',2),('nous',3,'nous',3),('ils',5,'ils',5),('elles',5,'elles',5)][i%6]
 form=present(verb)[person];reply_form=present(verb)[reply_person]
 question=('Est-ce qu’' if re.match('[aeiou]',pro) else 'Est-ce que ')+f'{pro} {form} {complement} ?'
 lead='j’' if reply_pro=='je' and re.match(r'^[aàâeéèêiîoôuùhœ]',reply_form) else reply_pro+' '
 affirmative='Oui, '+lead+reply_form+' '+complement+'.'
 negative_comp=re.sub(r'^(?:un|une|des) ',lambda _: 'd’' if re.match(r'^[aàâeéèêiîoôuùhœ]',complement.split(' ',1)[1]) else 'de ',complement)
 neg='n’' if re.match(r'^[aàâeéèêiîoôuùhœ]',reply_form) else 'ne '
 negative=f'Non, {reply_pro} {neg}{reply_form} pas {negative_comp}.'
 responses.append(dict(prompt=question,affirmative=affirmative,negative=negative))
assert len(responses)==len({row['prompt'] for row in responses})==50
(ROOT/'src/grammaire/exercises/question-response-data.json').write_text(json.dumps(responses,ensure_ascii=False,indent=2)+'\n')
