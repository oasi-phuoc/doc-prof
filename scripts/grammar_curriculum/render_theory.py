"""Write the revised, authored explanations using the existing visual blocks."""
import json,pathlib,re,hashlib
WORK=pathlib.Path(__file__).resolve().parent;ROOT=WORK.parents[1]
baseline=json.loads((WORK/'theory-source.json').read_text());notions=json.loads((WORK/'notions.json').read_text());protected={'gram-se-presenter','gram-entrer-contact'}

def tables(blocks):
 out=[]
 for block in blocks:
  if block['kind']=='table':out.append(block)
  if block['kind']=='section':out+=tables(block['blocks'])
 return out

def paragraph(text):return {'kind':'paragraph','text':text}
SPACER=paragraph('{ligne/2}')

def blocks(doc,entry):
 use,rules,examples,attention=entry;rules=rules.split('|');models=examples.split('|')
 old_retenir=[b for b in doc['blocks'] if b.get('role')=='retenir'];old_tables=tables(old_retenir)
 # Preserve the table layout while correcting misleading legacy examples.
 for table in old_tables:
  if doc['id']=='i8':table['rows']=[['être fier de','le travail dont il est fier'] if row[0]=='venir de' else row for row in table['rows']]
  if doc['id']=='k10':table['rows']=[['contraste : j’espère que (+ indicatif)',row[1]] if row[0]=='j’espère que' else row for row in table['rows']]
  if doc['id']=='l12':table['rows']=[['après-midi','après-midi ou après-midis','deux pluriels admis'] if row[0]=='après-midi' else row for row in table['rows']]
 explanation=[]
 for rule in rules:explanation.extend([paragraph(rule),SPACER])
 retain=[paragraph(rules[0]),SPACER]
 retain+=old_tables or [{'kind':'table','colHeader':True,'rowHeader':False,'headers':['Je m’entraîne','Exemple'],
                       'rows':[['Modèle '+str(i+1),text] for i,text in enumerate(models)]}]
 retain+=[SPACER,{'kind':'attention','text':attention}]
 return [{'kind':'heading','text':doc['title']},paragraph(use),SPACER,
         {'kind':'section','role':'regarder','blocks':[{'kind':'examples','marker':'puces','items':models}]},
         {'kind':'section','role':'expliquer','blocks':explanation},{'kind':'page'},
         {'kind':'section','role':'retenir','blocks':retain}]

assert {d['id'] for d in baseline['docs'] if d['topic'] not in protected}==set(notions)
bytopic={}
for doc in baseline['docs']:
 if doc['topic'] in protected:continue
 updated=dict(doc)
 if doc['id'] in notions:updated['blocks']=blocks(doc,notions[doc['id']])
 bytopic.setdefault(doc['topic'],[]).append(updated)
for topic,docs in bytopic.items():
 if not any(doc['id'] in notions for doc in docs):continue
 file=ROOT/'src/grammaire/theory'/(topic.removeprefix('gram-')+'.ts');original=file.read_text();name=re.search(r'export const (\w+)',original)[1]
 file.write_text("import type { GrammaireTheoryDoc } from '../types'\n\n/** Théorie réécrite en français facile ; gabarit visuel et identifiants conservés. */\nexport const "+name+': GrammaireTheoryDoc[] = '+json.dumps(docs,ensure_ascii=False,indent=2)+'\n')
for file,digest in json.loads((WORK/'protected-theory-hashes.json').read_text()).items():
 assert hashlib.sha256((ROOT/file).read_bytes()).hexdigest()==digest,file
print(len(notions),'fiches de théorie réécrites,8 fiches protégées inchangées')
