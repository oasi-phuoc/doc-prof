"""Compile only the new c1/c2/c3 banks from reviewed, traceable sources."""
import json, re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
SOURCE='scripts/grammar_curriculum/questions-a1-source.json'
data=json.loads((ROOT/SOURCE).read_text())
activities=json.loads((ROOT/'docs/grammaire/implementation/target-registry.json').read_text())['activities']
REV='questions-a1-2026-11-22-v1'
criteria=[{'id':'form','label':'Forme de question demandée respectée.'},{'id':'target','label':'Information recherchée bien ciblée.'},{'id':'meaning','label':'Personnes et faits cohérents.'},{'id':'grammar','label':'Construction, accords et élisions corrects.'},{'id':'communication','label':'Réponse complète et compréhensible.'}]
writing_criteria=[{'id':'form','label':'Forme et construction correctes.'},{'id':'target','label':'Information demandée bien ciblée.'},{'id':'meaning','label':'Sens et référents respectés ; variantes admises.'}]
def base(activity,index,prompt,answers,explanation,**extra):
 return dict(id=f'{activity}-a1-{index+1:02}',prompt=prompt,answers=answers,explanation=explanation,source=dict(path=SOURCE,typeId=activity,position=index),**extra)
def bank(a,units,instructions=None):
 return dict(schemaVersion=1,revision=REV,activityId=a['activityId'],subthemeId=a['runtimeSubthemeId'],topic='gram-questions',level='A1',label=a['label'],objective=a['objectivesByLevel']['A1'],editorialStatus='reviewed',review=dict(reviewer='Codex — revue éditoriale, validation enseignante en attente',date='2026-11-22',humanReview='pending',note='Cibles explicites, modèles non exclusifs et preuves CE vérifiés. Aucune approbation enseignante déclarée.'),presentations=a['plannedPresentationsByLevel']['A1'],instructions=instructions or a['instructionsByPresentation'],units=units)
def opts(answer,others):
 return [{'id':f'option-{i+1}','text':v} for i,v in enumerate([answer]+[v for v in others if v!=answer][:3])]
def role(prompt):
 if ' tu ' in ' '+prompt.lower()+' ' or '-tu ' in prompt:return 'Vous répondez en votre nom, avec « je ».'
 if ' vous ' in ' '+prompt.lower()+' ' or '-vous ' in prompt:return 'Vous répondez au nom du groupe interrogé, avec « nous ».'
 if ' nous ' in ' '+prompt.lower()+' ' or '-nous ' in prompt:return 'Vous faites partie du groupe : répondez avec « nous ».'
 return 'Vous répondez au sujet de la personne ou du groupe mentionné.'
oral=[]
for l in (ROOT/'scripts/grammar_curriculum/questions-a1-oral.tsv').read_text().splitlines():
 if l and not l.startswith('#'):oral.append(l.split('|'))
assert len(oral)==50 and all(len(r)==7 for r in oral)
for sub in ['c1','c2','c3']:
 banks=[]
 for a in [a for a in activities if a['runtimeSubthemeId']==sub]:
  aid=a['activityId'];kind=aid.removeprefix(f'gram-ex-{sub}-');units=[];instructions=dict(a['instructionsByPresentation'])
  if kind=='curriculum-p':
   instructions={'open-oral': 'Jouez les deux rôles. Posez une question sur l’information demandée, répondez avec les faits de la fiche, puis poursuivez l’échange.'}
   for i,(slug,situation,facts,target,closed,opened,quel) in enumerate(oral):
    question={'c1':closed,'c2':opened,'c3':quel}[sub];form={'c1':'fermée (est-ce que ou inversion)','c2':'ouverte, avec un mot interrogatif','c3':'avec quel, quelle, quels ou quelles'}[sub]
    units.append(base(aid,i,f'{situation}\nA demande, B informe. Faits pour B : {facts}',[question+'\n'+('Oui. ' if sub=='c1' else '')+facts.split('. ',1)[0]+'.'], 'Acceptez les formulations équivalentes fondées sur les faits de la fiche.',kind='production',mode='oral',task=f'A : demandez {target} avec une question {form}. B : répondez selon les faits. Puis posez une autre question et échangez les rôles.',rubric=criteria,writeLines=0))
  elif 'reading-' in kind:
   write=kind.endswith('-write');docs=data[{'c1':'question-reading-data','c2':'question-open-reading-data','c3':'question-quel-reading-data'}[sub]]
   form={'c1':'closed','c2':'open','c3':'quel'}[sub]
   instructions={'document-set': ('Lisez le texte. Écrivez une question '+{'c1':'fermée avec est-ce que ou l’inversion','c2':'ouverte avec un mot interrogatif','c3':'avec quel, quelle, quels ou quelles'}[sub]+' sur chaque information indiquée. Plusieurs formulations sont possibles.') if write else 'Lisez le texte, puis répondez aux questions par des phrases complètes.'}
   for i,doc in enumerate(docs):
    children=[]
    for j,q in enumerate(doc['questions']):
     evidence=q['evidence'] if isinstance(q['evidence'],list) else [q['evidence']]
     assert all(e in doc['text'] for e in evidence),(sub,doc['slug'],evidence)
     prompts=[q['prompt']]
     if sub=='c1':prompts.append(q['inversion'])
     prompt=q['prompt'] if sub!='c1' or j%2==0 else q['inversion']
     information=' ; '.join(evidence)
     children.append(dict(id=f'{aid}-a1-{doc["slug"]}-q{j+1}',prompt=('Information à interroger : « '+information+' »') if write else prompt,answers=prompts if write else [q['answer']],explanation=('D’autres formulations pertinentes sont recevables.' if write else 'La réponse complète reprend les faits du document ; les reformulations équivalentes sont recevables.'),evidence=evidence,response='short',**({'writingTask':dict(information=information,form=form,rubric=writing_criteria)} if write else {})))
    units.append(base(aid,i,doc['title'],[],'Les cinq informations ont des preuves littérales dans le document.',kind='reading',genre=doc['genre'],text=doc['text'],questions=children))
  elif sub=='c1':
   for i,r in enumerate(data['question-transform-data'] if kind in ['question-est-ce-que','question-inversion','curriculum-complete','curriculum-o'] else data['question-response-data']):
    if kind in ['question-est-ce-que','question-inversion']:
     method='est-ce que' if kind=='question-est-ce-que' else 'inversion';ans=r['estce' if method=='est-ce que' else 'inversion']
     units.append(base(aid,i,r['prompt'],[ans],'La question conserve le sujet et les informations. Respectez les élisions, les traits d’union et le point d’interrogation.',kind='transform',directive=instructions['transform'],directiveDisplay='heading',responseLines=1))
    elif kind in ['response-affirmative','response-negative']:
     ans=r['affirmative' if kind=='response-affirmative' else 'negative'];question=r['prompt' if i%2==0 else 'inversion'];units.append(base(aid,i,question,[ans],'La réponse complète respecte le rôle indiqué et la polarité demandée. Les reformulations équivalentes sont recevables.',kind='transform',directive=instructions['transform'],directiveDisplay='heading',cue='Jeu de rôle fictif. '+role(question),responseLines=2))
    elif kind=='curriculum-complete':
     ans=r['estce'];bad1=ans.replace('Est-ce que ','Est-ce ').replace('Est-ce qu’','Est-ce ');bad2=ans.replace('Est-ce que ','Est-ce qui ').replace('Est-ce qu’','Est-ce qui ');bad3=ans[:-1]+'.'
     units.append(base(aid,i,'Phrase de départ : '+r['prompt']+'\nQuestion avec est-ce que : ___',[ans],'Est-ce que + sujet + verbe. Élidez que devant une voyelle et terminez par « ? ».',kind='completion',options=opts(ans,[bad1,bad2,bad3])))
    elif kind=='curriculum-o':
     ans=r['estce'] if i%2==0 else r['inversion'];words=ans.removesuffix(' ?').split(' ')
     # Keep apostrophes and inversion hyphens intact; classify tokens in context.
     def category(w,j):
      w=w.lower()
      if w=='est-ce':return 'adverbe'
      if w=='que':return 'conjonction'
      if w in ['tu','il','elle','nous','vous','ils','elles'] or w.startswith('qu’'):return 'pronom'
      if '-' in w or j==(3 if ans.startswith('Est-ce que ') else 2 if ans.startswith('Est-ce qu’') else 0):return 'verbe'
      if w in ['le','la','les','un','une','des','du','ma','mon','ses','son']:return 'determinant'
      if w in ['à','au','aux','avec','chez','de','devant','en','près','pour','jusqu’au']:return 'preposition'
      if w in ['droite','demain','lundi']:return 'adverbe'
      if w in ['léger','simple','prêts','disponible']:return 'adjectif'
      return 'nom'
     units.append(base(aid,i,'Formez une question fermée.',[ans],'Proposition d’ordre ; une autre organisation naturelle conservant les mots et la méthode est appréciée par l’enseignant.',kind='order',cue='Méthode : '+('est-ce que' if i%2==0 else 'inversion')+'.',tokens=[dict(id=f'mot-{j+1}',text=w,category=category(w,j)) for j,w in enumerate(words)]))
    else:raise ValueError(kind)
  elif sub in ['c2','c3']:
   rows=data['question-open-transform-data' if sub=='c2' else 'question-quel-data']
   for i,r in enumerate(rows):
    if kind in ['question-open-est-ce-que','question-open-inversion','question-quel']:
     ans=r['question'] if sub=='c3' else r['estce' if kind.endswith('est-ce-que') else 'inversion']
     directive='Information à demander : '+r['target']+('. Nom interrogé : « '+r['target']+' », '+r['agreement']+'.' if sub=='c3' else '.')
     if sub=='c2' and ans.startswith('Qui prépare') or sub=='c2' and ans.startswith('Qui sonne'):directive+=' Qui est le sujet : on n’ajoute pas de pronom après le verbe.'
     units.append(base(aid,i,r['prompt'],[ans],'La question cible '+r['target']+'. Le sujet et les autres informations restent cohérents. Les formulations équivalentes respectant la méthode sont recevables.',kind='transform',directive=directive,responseLines=2))
    elif kind in ['question-open-response','question-quel-response']:
     question=r['question'] if sub=='c3' else r['estce' if i%2==0 else 'inversion']
     units.append(base(aid,i,'Fiche de faits : '+r['prompt']+'\n'+role(question)+'\nQuestion : '+question,[r['reply']],'Modèle possible fondé sur la fiche. Acceptez toute phrase complète équivalente ; aucune donnée personnelle n’est exigée.',kind='production',mode='written',task='Répondez à la question avec les faits de la fiche, par une phrase complète.',rubric=criteria,writeLines=2))
    elif kind=='curriculum-complete':
     ans=r['interrogative'] if sub=='c2' else r['form'].capitalize() if r['frame'].startswith('___') else r['form'];other=['Où','Quand','Comment','Pourquoi'] if sub=='c2' else ['Quel','Quelle','Quels','Quelles'] if ans[0].isupper() else ['quel','quelle','quels','quelles']
     units.append(base(aid,i,'Fait : '+r['prompt']+'\n'+r['frame'],[ans],('Le mot interrogatif vise '+r['target']+'.' if sub=='c2' else 'Le déterminant interrogatif s’accorde avec « '+r['target']+' » : '+r['agreement']+'.'),kind='completion',cue='Information à demander : '+r['target']+'.'+(' Nom '+r['agreement']+'.' if sub=='c3' else ''),options=opts(ans,other)))
    else:raise ValueError(kind)
  assert len(units)==(20 if 'reading-' in kind else 50),(aid,len(units))
  if sub=='c1' and kind=='curriculum-complete':instructions={'choice':'Choisissez la question fermée correctement écrite avec [[em]]est-ce que[[/em]], y compris sa ponctuation.'}
  if sub=='c1' and kind=='curriculum-o':instructions={'order':'Remettez les mots dans l’ordre pour former une question fermée, selon la méthode indiquée. Écrivez la question avec son point d’interrogation.'}
  if sub=='c2' and kind=='curriculum-complete':instructions={'choice':'Choisissez le groupe interrogatif correspondant à l’information demandée.','gap':'Complétez avec le groupe interrogatif correspondant à l’information demandée.'}
  if sub=='c3' and kind=='curriculum-complete':instructions={'choice':'Choisissez [[em]]quel, quelle, quels ou quelles[[/em]] selon le nom indiqué.','gap':'Complétez avec [[em]]quel, quelle, quels ou quelles[[/em]] selon le nom indiqué.'}
  banks.append(bank(a,units,instructions))
 path=ROOT/f'src/grammaire/curriculum/data/{sub}.json';path.write_text(json.dumps(banks,ensure_ascii=False,indent=2)+'\n');print(sub,len(banks),'banks',sum(len(b['units']) for b in banks),'units')
