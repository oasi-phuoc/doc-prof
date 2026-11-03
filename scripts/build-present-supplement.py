#!/usr/bin/env python3
"""Build additional present exercises from the reviewed verb/context lexicon.
The separately authored être/avoir banks remain unchanged.
"""
from pathlib import Path
import ast,json,re,sys
ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'scripts/grammar_curriculum'
sys.path.insert(0,str(SOURCE))
from lexicon import REGULAR,SPECIAL,IR_CONTEXT,RE_CONTEXT,IRREG,ADJECTIVES,present

def assignment(file,name):
 tree=ast.parse((SOURCE/file).read_text())
 return next(ast.literal_eval(node.value) for node in tree.body if isinstance(node,ast.Assign) and any(isinstance(t,ast.Name) and t.id==name for t in node.targets))
reflexives=assignment('banks_verbs.py','REFLEXIVE_BASE')
places=assignment('banks_nominal.py','PLACE_NOUNS')
TARGET=ROOT/'src/grammaire/exercises/present-supplement-data.json'
previous=json.loads(TARGET.read_text())
data={key:previous[key] for key in ('etre','avoir')}
subjects=[('Je',0),('Tu',1),('Il',2),('Elle',2),('Nous',3),('Vous',4),('Ils',5),('Elles',5)]
# Explicit function-word classes; lexical context words otherwise denote nouns.
classes={}
for cat,words in {
 'determinant':'le la les un une des mon ma mes ton ta tes son sa ses notre nos votre vos leur leurs ce cet cette ces l’ d’',
 'preposition':'à au aux de du dans sur sous avec sans pour par en chez près devant derrière avant après depuis malgré vers entre jusqu’ jusqu’au',
 'adverbe':'rapidement souvent toujours parfois déjà encore aujourd’hui demain tôt tard plus très ensemble ici longtemps gratuitement calmement',
 'adjectif':'sept huit six deux trois quatre cinq dix premier première deuxième dernier dernière supérieur nouveau nouvelle nouveaux nouvelles petit petite petits petites grand grande grands grandes léger légère simple noir blanc chaud froid droit droite annuel temporaire',
 'conjonction':'et ou mais que',
 'negation':'ne n’ pas jamais plus',
}.items():
 for word in words.split():classes[word]=cat
for forms in ADJECTIVES:
 for word in forms:classes[word]='adjectif'
infinitives={v for group in (REGULAR,SPECIAL,IR_CONTEXT,RE_CONTEXT,reflexives) for v,_ in group}|set(IRREG)
# d’ is a preposition; l’ is an article. Infinitives in modal complements are verbs.
classes['d’']='preposition'

def vowel(text):return bool(re.match(r'^[aàâäeéèêëiîïoôöuùûühœ]',text,re.I))
def tok(text,category):return {'text':text,'category':category}
def words(text):
 chunks=re.findall(r"[^\s’']+[’']|[^\s’']+",text.replace("'",'’'))
 return [tok(word,'verbe' if word.lower() in infinitives else classes.get(word.lower(),'nom')) for word in chunks]
def join(tokens):
 text=''
 for token in tokens:text+=('' if not text or text.endswith('’') else ' ')+token['text']
 return text+'.'
def subject_tokens(subject,verbform):
 if subject=='Je' and vowel(verbform):subject='J’'
 return [tok(subject,'pronom')]
def reflective(form,person):
 pro=['me','te','se','nous','vous','se'][person]
 return [tok(pro[0]+'’' if vowel(form) and person in (0,1,2,5) else pro,'pronom'),tok(form,'verbe')]
# A2 reporting clauses introduce a second present-tense proposition. Their words
# are annotated explicitly and keep the target verb and its original context.
prefixes=[
 [('Ma','determinant'),('sœur','nom'),('explique','verbe'),('que','conjonction')],
 [('Tu','pronom'),('sais','verbe'),('que','conjonction')],
 [('Le','determinant'),('professeur','nom'),('remarque','verbe'),('que','conjonction')],
 [('Nous','pronom'),('voyons','verbe'),('que','conjonction')],
 [('Mon','determinant'),('collègue','nom'),('raconte','verbe'),('que','conjonction')],
 [('Je','pronom'),('confirme','verbe'),('que','conjonction')],
 [('La','determinant'),('responsable','nom'),('précise','verbe'),('que','conjonction')],
 [('Vous','pronom'),('savez','verbe'),('que','conjonction')],
 [('Mon','determinant'),('père','nom'),('comprend','verbe'),('que','conjonction')],
 [('Mes','determinant'),('amis','nom'),('disent','verbe'),('que','conjonction')],
]
contexts={
 'er':REGULAR,'er-particuliers':SPECIAL,'ir':IR_CONTEXT,'re-oir':RE_CONTEXT,
 'modaux':[(('pouvoir','devoir','vouloir')[i%3],v+' '+comp) for i,(v,comp) in enumerate(REGULAR)],
 'pronominaux':reflexives,'a8':REGULAR,'a9':REGULAR,
 'aller-destination':[('aller',('aux' if g=='p' else 'à l’' if vowel(noun) else 'au' if g=='m' else 'à la')+('' if vowel(noun) and g!='p' else ' ')+noun) for noun,g in places],
}
for sub,rows in contexts.items():
 assert len(rows)==50,(sub,len(rows))
 bank={'a1':[],'a2':[],'corrections':[]}
 for i,(verb,complement) in enumerate(rows):
  subject,person=subjects[(i*3)%8]
  forms=present(verb);form=forms[person]
  finite=reflective(form,person) if sub=='pronominaux' else [tok(form,'verbe')]
  if sub in ('a8','a9'):
   neg='pas' if sub=='a8' else ['jamais','plus','pas encore','pas souvent'][i%4]
   finite=[tok('n’' if vowel(form) else 'ne','negation'),*finite,*[tok(w,'negation' if w in ('pas','plus','jamais') else 'adverbe') for w in neg.split()]]
  ordered=subject_tokens(subject,finite[0]['text'])+finite+words(complement)
  inf=(('s’' if vowel(verb) else 'se ')+verb) if sub=='pronominaux' else verb
  bank['a1'].append(dict(tokens=ordered,answer=join(ordered),verb=inf))
  prefix=[tok(text,category) for text,category in prefixes[i%len(prefixes)]]
  embedded=[dict(t) for t in ordered];embedded[0]['text']=embedded[0]['text'].lower()
  if vowel(embedded[0]['text']):prefix[-1]['text']='qu’'
  extended=prefix+embedded
  bank['a2'].append(dict(tokens=extended,answer=join(extended),verb=inf))
  # A distinct form of the same verb creates exactly one conjugation error.
  wrong=[dict(t) for t in ordered]
  replacement=next(f for f in forms if f!=form)
  target=next(j for j,t in enumerate(wrong) if t['category']=='verbe')
  wrong[target]['text']=replacement
  # Recompute apostrophe choices so the only error remains agreement with the subject.
  if sub=='pronominaux':
   wrong[target-1]['text']=(['m’','t’','s’','nous','vous','s’'][person] if vowel(replacement) else ['me','te','se','nous','vous','se'][person])
  elif sub in ('a8','a9'):wrong[target-1]['text']='n’' if vowel(replacement) else 'ne'
  wrong[0]['text']='J’' if subject=='Je' and vowel(wrong[1]['text']) else subject
  hint='' if sub=='aller-destination' else f' ({inf})'
  bank['corrections'].append(dict(prompt=join(wrong)+'\n___'+hint,answer=join(ordered),verb=inf))
 assert all(len(bank[level])==50 for level in bank)
 assert len({row['answer'] for level in ('a1','a2') for row in bank[level]})==100,sub
 data[sub]=bank
for verb in ('etre','avoir'):
 for level in data[verb]:
  for row in data[verb][level]:row['verb']='être' if verb=='etre' else 'avoir'
TARGET.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
print('11 sous-thèmes : 550 corrections et 1100 phrases à remettre dans l’ordre.')
