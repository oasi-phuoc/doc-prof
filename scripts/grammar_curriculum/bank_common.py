import re,unicodedata
from lexicon import *
LESSONS=[]

def vowel(word):return bool(re.match(r'^[aàâäeéèêëiîïoôöuùûüyhœ]',word,re.I))

def distinct(values):return list(dict.fromkeys(values))

def item(prompt,answer,options,**extra):
 options=distinct([answer]+list(options))
 if len(options)<3:raise ValueError('Fewer than three distinct forms '+repr((prompt,answer,options)))
 if prompt.count('___')!=1:raise ValueError('Exactly one response required '+prompt)
 return dict(prompt=prompt,answer=answer,options=options[:3],**extra)

def sentence(subject,form,complement,verb=None,leading=''):
 if leading and subject in ('Je','Tu','Nous','Vous','Les voisins','Les voisines'):subject=subject[0].lower()+subject[1:]
 begin=('J’' if subject[0].isupper() else 'j’') if subject.lower()=='je' and vowel(form) else subject+' '
 return leading+begin+'___'+(' ('+verb+')' if verb else '')+(' '+complement if complement else '')+'.'

def add(sub,label,instruction,items,kind='qcm-verbe'):
 seen=set();unique=[]
 for row in items:
  key=re.sub(r'\s+',' ',row['prompt'].lower()).replace('’',"'")
  if key not in seen:unique.append(row);seen.add(key)
 if len(unique)<50:raise ValueError(f'{sub}: only{len(unique)}distinct sentences')
 LESSONS.append(dict(subId=sub,kindId=kind,label=label,instruction=instruction,items=unique[:50]))

def noun_article(noun,gender,plural=False,kind='def'):
 if kind=='indef':return 'des' if plural else 'un' if gender=='m' else 'une'
 if kind=='demo':return 'ces' if plural else 'cette' if gender=='f' else 'cet' if vowel(noun) else 'ce'
 return 'les' if plural else 'l’' if vowel(noun) else 'le' if gender=='m' else 'la'

def noun_phrase(frame,noun,determiner='___'):
 result=frame.replace('{d}',determiner).replace('{n}',noun)
 if determiner.endswith('’'):result=result.replace(determiner+' '+noun,determiner+noun)
 return result

def present_bank(sub,label,contexts,verb=None):
 rows=[]
 for i,source in enumerate(contexts):
  v,complement=(verb,source) if verb else source
  subject,person=SUBJECTS[(i*3)%len(SUBJECTS)];forms=present(v);answer=forms[person]
  rows.append(item(sentence(subject,answer,complement,None if verb else v),answer,forms))
 add(sub,label,'Conjuguez '+(verb or 'le verbe indiqué')+' au présent.',rows,'qcm-conj')

def reflexive(v,person,form):
 pron=('me','te','se','nous','vous','se')[person]
 return pron[0]+'’'+form if pron in ('me','te','se') and vowel(form) else pron+' '+form

def past_forms(v,tense='pc',aux='avoir',gender='m',plural=False):
 forms=present(aux) if tense=='pc' else imparfait(aux) if tense=='pqp' else future(aux) if tense=='fa' else future(aux,True)
 participle=pp(v)
 if aux=='être':participle+=('e' if gender=='f' and not participle.endswith('e') else '')+('s' if plural else '')
 return [a+' '+participle for a in forms]

def plural_noun(noun):
 for singular,plural,gender in NOUNS:
  if noun==singular:return plural
 if noun.endswith(('s','x','z')):return noun
 if noun.endswith(('eau','au','eu')) and noun not in ('pneu','bleu'):return noun+'x'
 if noun.endswith('al') and noun not in ('bal','carnaval','festival'):return noun[:-2]+'aux'
 return noun+'s'
