"""Compile the remaining pronoun banks; keep the existing COD curriculum intact."""
import csv,json,unicodedata
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];REV='pronoms-2026-11-24-v1'
LEVELS={s:'A2' for s in ['i1','i2','i3','i5','i6','i7']}|{'i8':'B1','i9':'B1'}
PLANS={'i1':['q','a','t'],'i2':['q','t','c'],'i3':['q','t','e'],'i5':['q','t','c'],'i6':['q','t','s'],'i7':['q','t','c'],'i8':['q','t','c','e'],'i9':['q','t','e','d']}
LABELS={'i1':'Relier avec qui, que ou où','i2':'Reprendre avec un pronom possessif','i3':'Désigner avec un pronom démonstratif','i5':'Reprendre un destinataire : lui ou leur','i6':'Exprimer une présence, une absence ou un ensemble','i7':'Reprendre un complément avec en ou y','i8':'Construire une relative avec dont','i9':'Employer les relatifs composés'}
OBJECTIVES={'i1':'Relier deux propositions par qui, que/qu’ ou où selon le rôle du relatif.','i2':'Remplacer un groupe possessif par un pronom complet en conservant le possesseur, le genre et le nombre de l’objet.','i3':'Reprendre un nom connu par celui/celle/ceux/celles, ou un fait par ce/cela, avec les compléments nécessaires.','i5':'Distinguer COI et COD selon le verbe ; reprendre le destinataire par lui/leur sans modifier les rôles.','i6':'Distinguer personne et chose, présence et absence, totalité et distribution individuelle.','i7':'Employer en/y avec un référent explicite ; conserver quantités, négation, temps et place du pronom.','i8':'Relier deux faits avec dont pour un complément en de, une relation nominale ou une partie d’ensemble, sans reprise redondante.','i9':'Former préposition + lequel, avec les contractions et l’accord de l’antécédent ; conserver les constructions données.'}
def read(sub):
 path=f'scripts/grammar_curriculum/pronoms-{sub}-{LEVELS[sub].lower()}.tsv'
 rows=[r for r in csv.reader((ROOT/path).read_text().splitlines(),delimiter='|') if r and not r[0].startswith('#')]
 assert len(rows)==50 and len({r[0] for r in rows})==50
 assert all(len(r)==(11 if sub=='i6' else 8) and all(unicodedata.normalize('NFC',s)==s for s in r) for r in rows)
 return [dict(zip(['slug','context','prompt','answer','wrong1','wrong2','neutral','reason','opening','follow','reply'],r),path=path,position=i) for i,r in enumerate(rows)]
R={s:read(s) for s in LEVELS}
def fill(p,a):
 before,after=p.split('___');after=after.lstrip()
 return before+a+('' if a.endswith('’') or not after or after[0] in '.,;:!?' else ' ')+after
def model(r):return fill(r['prompt'],r['answer'])
def alternatives(r):return [r['answer']]+(['ça' if r['answer']=='cela' else 'Ça'] if r['answer'] in ['cela','Cela'] else [])
def opts(r):
 vals=[r['answer'],r['wrong1'],r['wrong2']];assert len(set(vals))==3 and sum(v in alternatives(r) for v in vals)==1
 return [dict(id=r['slug']+f'-choix-{i+1}',text=x) for i,x in enumerate(vals)]
def rubric(labels):return [dict(id=f'r{i+1}',label=s) for i,s in enumerate(labels)]
def aid_for(s,m):return f'gram-ex-{s}-'+('qcm-verbe' if m=='q' else 'curriculum-'+m)
def base(aid,level,r):return dict(id=f'{aid}-{level.lower()}-{r["slug"]}',source=dict(path=r['path'],typeId=aid,position=r['position'],partition=level.lower()))
def bank(s,m,units,instructions=None):
 ins=instructions or {
  'q':{'choice':{
   'i1':'Choisissez le relatif qui respecte la construction donnée.',
   'i2':'Choisissez le pronom possessif complet qui garde le possesseur et l’objet indiqués.',
   'i3':'Choisissez le démonstratif qui reprend le nom ou le fait selon la situation.',
   'i5':'Reprenez le complément indiqué par le pronom adapté au verbe et au nombre.',
   'i6':'Choisissez le pronom indéfini qui respecte les faits et la construction.',
   'i7':'Choisissez en ou y selon le complément à reprendre ; les autres pronoms servent de contraste.',
   'i8':'Choisissez la relative avec dont qui conserve les faits sans reprise redondante.',
   'i9':'Choisissez la forme de lequel, avec sa préposition et l’accord de l’antécédent.',
  }[s],'gap':{
   'i1':'Écrivez qui, que/qu’ ou où selon la construction donnée.',
   'i2':'Écrivez le pronom possessif complet, avec sa préposition si nécessaire.',
   'i3':'Écrivez le démonstratif qui respecte le référent et la forme demandés.',
   'i5':'Écrivez le pronom qui reprend le complément indiqué ; distinguez COD et COI.',
   'i6':'Écrivez un pronom indéfini adapté aux faits et à la construction.',
   'i7':'Complétez avec en ou y, sans changer la quantité ni le reste de la phrase.',
   'i8':'Écrivez toute la relative avec dont, sans répéter le complément repris. Gardez les autres mots dans l’ordre de la phrase de départ.',
   'i9':'Écrivez une forme de lequel avec sa préposition et l’accord nécessaire.',
  }[s]},
  'a':{'match':'Associez chaque phrase au relatif qui convient à sa construction.'},
  't':{'transform':'Réécrivez en conservant les faits et les référents, selon la reprise demandée.'},
  'c':{'correct':'Corrigez la reprise du complément indiqué et réécrivez la phrase entière.'},
  'e':{'open-written':'Rédigez une phrase selon les faits et la construction demandés. Le corrigé donne un modèle possible.'},
  's':{'scenario-set':'Jouez l’échange : demandez une information, répondez selon les faits puis poursuivez avec la relance.'},
 }[m]
 label=LABELS[s] if m=='q' else {'a':'Associer','t':'Transformer une phrase','c':'Corriger l’erreur','e':'Écrire avec un pronom en contexte','s':'Jouer une situation','d':'Lire et écrire des questions'}[m]
 return dict(schemaVersion=1,revision=REV,activityId=aid_for(s,m),subthemeId=s,topic='gram-pronoms',level=LEVELS[s],label=label,objective=OBJECTIVES[s],editorialStatus='reviewed',review=dict(reviewer='Codex — revue linguistique et fonctionnelle',date='2026-11-24',humanReview='pending',note='Situations et références relues ; réemploi explicite entre mécaniques. Modèles ouverts non exclusifs. Aucune approbation pédagogique humaine déclarée.'),presentations=list(ins),instructions=ins,units=units)
DIRECTIVES={
 'i1':'Réunissez les deux phrases par qui, que/qu’ ou où. Conservez les faits et la construction indiquée.',
 'i2':'Remplacez le groupe possessif par un pronom possessif complet, avec la préposition nécessaire. Gardez le possesseur et l’objet.',
 'i3':'Reprenez le nom ou le fait avec le pronom démonstratif demandé dans la situation. Gardez les compléments et la distance indiquée.',
 'i5':'Remplacez le complément indiqué par un pronom. Gardez le temps, la négation, les rôles et le reste de la phrase.',
 'i6':'Reformulez avec un pronom indéfini qui conserve les personnes, les choses et la quantité indiquées. Adaptez la construction et l’accord.',
 'i7':'Remplacez le complément indiqué par en ou y. Conservez le temps, la négation, les quantités et le reste des faits.',
 'i8':'Réunissez les deux faits avec dont, sans répéter le complément repris par en, un possessif ou un autre groupe.',
 'i9':'Réunissez les deux faits avec une forme de lequel et la préposition nécessaire. Accordez le relatif avec l’antécédent indiqué.',
}
banks=[]
for s,mechanics in PLANS.items():
 for m in mechanics:
  if m=='d':continue
  aid=aid_for(s,m);units=[]
  for i,r in enumerate(R[s]):
   common=base(aid,LEVELS[s],r);sentence=model(r);models=[fill(r['prompt'],a) for a in alternatives(r)];explanation=r['reason']+' Modèle : '+sentence
   if m=='q':u=dict(**common,kind='completion',prompt=r['prompt'],cue='Faits à relier : '+r['neutral'] if s=='i8' else r['context'],answers=alternatives(r),options=opts(r),explanation=explanation)
   elif m=='a':
    other=next(R[s][(i+k)%50] for k in range(1,50) if R[s][(i+k)%50]['answer']!=r['answer'])
    u=dict(**common,kind='match',prompt='Deux constructions indépendantes.',pairs=[dict(id=r['slug']+f'-paire-{j+1}',left=x['context']+' '+x['prompt'],right=x['answer'],sourceId=x['path']+':'+x['slug']) for j,x in enumerate([r,other])],answers=[sentence+'\n'+model(other)],explanation='Associez chaque relatif à son rôle dans sa phrase ; que s’élide devant une voyelle.')
   elif m=='t':u=dict(**common,kind='transform',prompt=r['neutral'],cue=r['context'],answers=models,directive=DIRECTIVES[s],responseLines=2,explanation=explanation+' Les autres formulations qui respectent les faits et la consigne sont appréciées par l’enseignant.')
   elif m=='c':
    bad=r['wrong1'];before,after=r['prompt'].split('___');start=len(before);extra=1 if r['answer'].endswith('’') and after.lstrip() and after.lstrip()[0] not in '.,;:!?' else 0
    u=dict(**common,kind='correct',prompt=fill(r['prompt'],bad),cue=r['context'],answers=models,error=dict(segmentId='prompt',start=start,end=start+len(bad)+extra,text=bad+(' ' if extra else '')),responseLines=2,explanation=explanation)
   elif m=='e':
    task=DIRECTIVES[s]+' Écrivez une phrase complète ; vous pouvez ajouter une précision cohérente.'
    u=dict(**common,kind='production',prompt=r['context']+'\nFaits : '+r['neutral'],answers=models,mode='written',task=task,writeLines=4,rubric=rubric(['Faits et référents conservés.','Pronom et construction demandés ; genre, nombre et préposition adaptés.','Phrase complète et compréhensible.']),explanation='Modèle non exclusif ; d’autres formulations fidèles aux faits et à la consigne sont recevables. '+r['reason'])
   else:
    u=dict(**common,kind='scenario',contract='open',prompt='Donner une information avec un pronom indéfini',situation=r['context'],answers=['Personne A : '+sentence+'\nPersonne B : '+r['follow']+'\nPersonne A : '+r['reply']],roles=[dict(id='a',label='Personne A',goal='Répondez selon les faits de la situation.'),dict(id='b',label='Personne B',goal='Posez la question initiale puis la relance.')],turns=[dict(id='debut',roleId='b',text=r['opening'])],task='Répondez avec un pronom indéfini adapté aux faits, puis répondez à la relance. Échangez ensuite les rôles.',followUps=[r['follow']],writeLines=0,rubric=rubric(['Personnes, choses et quantité conformes aux faits.','Pronom, négation et accord adaptés.','Réponse compréhensible et cohérente à la relance.']),explanation='Exemple non exclusif ; les autres formulations fidèles aux faits sont recevables.')
   units.append(u)
  banks.append(bank(s,m,units))

aid=aid_for('i9','d');units=[]
for i,d in enumerate(json.loads((ROOT/'scripts/grammar_curriculum/pronoms-i9-lectures-b1.json').read_text())):
 assert d['sourceSituation'] in {r['slug'] for r in R['i9']};text=' '.join(d['text']);children=[]
 for j,t in enumerate(d['targets']):
  assert t['evidence'] in text
  children.append(dict(id=aid+'-'+d['id']+f'-q{j+1}',prompt='Information à interroger : '+t['information']+'.',answers=[t['model']],evidence=[t['evidence']],response='short',writingTask=dict(information=t['information'],form='open',rubric=rubric(['Question grammaticale et préposition adaptée.','Information demandée bien ciblée.','Fidélité aux faits et aux référents du document.'])),explanation='Modèle de question possible ; les formulations grammaticales qui ciblent la même information sont recevables.'))
 units.append(dict(id=aid+'-b1-'+d['id'],source=dict(path='scripts/grammar_curriculum/pronoms-i9-lectures-b1.json',typeId=aid,position=i,partition='b1'),kind='reading',prompt=d['title'],genre=d['genre'],text=text,answers=[],questions=children,explanation='Les relatives précisent les référents. Les questions portent sur trois informations distinctes ; les modèles ne sont pas exclusifs.'))
banks.append(bank('i9','d',units,{'document-set':'Lisez le document et repérez les référents des relatifs. Écrivez ensuite une question ouverte pour chaque information indiquée.'}))
assert len(banks)==26
for s in PLANS:(ROOT/f'src/grammaire/curriculum/data/{s}.json').write_text(json.dumps([b for b in banks if b['subthemeId']==s],ensure_ascii=False,indent=2)+'\n')
print(json.dumps(dict(activities=26,banks=26,offerings=sum(len(b['presentations']) for b in banks),units=sum(len(b['units']) for b in banks),variants=sum(sum(len(u['questions']) if u['kind']=='reading' else 1 for u in b['units'])*len(b['presentations']) for b in banks),authoredSourceRows=400,readingDocuments=20,writingTargets=60)))
