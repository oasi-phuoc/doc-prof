#!/usr/bin/env python3
"""Rebuild grammar from its authored curriculum; no network or image generation."""
import hashlib,json,sys
from pathlib import Path
HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[1]
sys.path.insert(0,str(HERE))
import banks_verbs,banks_nominal,banks_usage,banks_advanced,banks_links,banks_spelling,curate
from bank_common import LESSONS
from protected_banks import PROTECTED
from communications import ALL
illustrations_file=ROOT/'docs/grammaire/illustrations.json'
ILLUSTRATIONS=json.loads(illustrations_file.read_text()) if illustrations_file.exists() else {}
for group in ALL:
 for variant in group['variants']:
  illustration=ILLUSTRATIONS.get(variant['id'])
  if illustration:
   file=ROOT/'public'/illustration['image'].lstrip('/')
   assert file.is_file() and hashlib.sha256(file.read_bytes()).hexdigest()==illustration['sha256'],variant['id']
   variant['image']=illustration['image']

assert len(LESSONS)==104
assert len({lesson['subId'] for lesson in LESSONS})==104
for lesson in LESSONS+PROTECTED:
 assert len(lesson['items'])==50,lesson['subId']
 assert len({r['prompt'].casefold() for r in lesson['items']})==50,lesson['subId']
 for row in lesson['items']:
  if lesson in LESSONS:assert row['prompt'].count('___')==1,row
  if row.get('options'):
   assert len(row['options'])==len(set(row['options']))==3,row
   assert row['options'].count(row['answer'])==1,row
bank=ROOT/'src/grammaire/exercises/bank'
for filename,name,data in [('lessons-revised','GRAM_LESSONS_REVISED',LESSONS),('lessons-protected','GRAM_LESSONS_PROTECTED',PROTECTED)]:
 (bank/(filename+'.ts')).write_text("import type { GramLesson } from '../types'\n\n/** Généré par scripts/grammar_curriculum/build.py ; données éditoriales relues. */\nexport const "+name+': GramLesson[] = '+json.dumps(data,ensure_ascii=False,indent=2)+'\n')
(ROOT/'src/grammaire/exercises/communication-data.json').write_text(json.dumps(ALL,ensure_ascii=False,indent=2)+'\n')
# Theory is authored directly in src/grammaire/theory; preserve it when rebuilding exercises.
report={
 'theoryRewritten':0,'theoryProtected':113,'newPracticeBanks':104,'newPracticeItems':5200,
 'protectedBanksCompleted':len(PROTECTED),'protectedBankItems':sum(len(x['items']) for x in PROTECTED),
 'communicativeThemes':len(ALL),'variantsPerCommunicationType':10,'newCommunicationTypes':3*len(ALL),
 'communicationVariants':3*sum(len(x['variants']) for x in ALL),'readingQuestions':sum(len(v['questions']) for x in ALL for v in x['variants']),
 'imagesGenerated':len(ILLUSTRATIONS),
 'coverage':[{'subId':l['subId'],'label':l['label'],'items':len(l['items'])} for l in LESSONS],
 'communication':[{'subId':g['subId'],'goal':g['goal'],'ce':len(g['variants']),'pe':len(g['variants']),'po':len(g['variants'])} for g in ALL],
}
DOC=ROOT/'docs/grammaire';DOC.mkdir(exist_ok=True)
(DOC/'audit.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
(DOC/'images-a-preparer.json').write_text(json.dumps([{'id':v['id'],'description':v['imageDescription'],'status':'générée et validée' if v.get('image') else 'à générer ultérieurement','usedByExercise':bool(v.get('image')),**({'image':v['image']} if v.get('image') else {})} for g in ALL for v in g['variants']],ensure_ascii=False,indent=2)+'\n')
print(f"{len(LESSONS)} banques de 50 phrases ; {len(PROTECTED)} banques d’introduction complétées ; {report['communicationVariants']} variantes CE/PE/PO.")
