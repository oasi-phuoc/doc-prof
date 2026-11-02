#!/usr/bin/env python3
"""Activate only complete, visually reviewed CE sets; CO remains pending explicit scope."""
from __future__ import annotations
import hashlib,json,unicodedata
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def read(p):return json.loads((ROOT/p).read_text())
def write(p,d):(ROOT/p).write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
def norm(s):return ''.join(c for c in unicodedata.normalize('NFD',s.casefold().replace('’',"'")) if unicodedata.category(c)!='Mn')
def main():
 plan=read('docs/tcf/images-a-generer.json');registry=read('docs/tcf/images-generees.json');overrides=read('scripts/tcf-qcm-image-visual-overrides.json')
 images={r.get('asset_id',r['id']):r for r in registry['images'] if r['status']=='visually_reviewed'}
 priority={(r['exercise'],r['question']) for m in plan['visual_review_mappings'] if m.get('replacement') is None for r in m['references']}
 banks={};activated={(r['bank'],r['exercise'],r['question']):r for r in registry['activated_questions']}
 for proposal in plan['questions']:
  key=(proposal['bank'],proposal['exercise'],proposal['question'])
  if not proposal['bank'].endswith('/ce.json') or (proposal['exercise'],proposal['question']) not in priority:continue
  data=banks.setdefault(proposal['bank'],read(proposal['bank']))
  exercise=next(e for e in data if e['id']==proposal['exercise']);question=exercise['questions'][proposal['question']-1]
  if question['enonce']!=proposal['enonce']:raise ValueError('Question changed since audit: '+str(key))
  choices=question.get('choix',question.get('formes',{}).get('qcm_texte',{}).get('choix',[]))
  if [(c['id'],c['texte'],c.get('correct',False)) for c in choices]!=[(c['id'],c['texte'],c['correct']) for c in proposal['choices']]:raise ValueError('Choices changed since audit: '+str(key))
  output=[]
  for c in proposal['choices']:
   generated=images.get(c.get('asset'));path=generated['path'] if generated else c.get('existing_image')
   if not path:break
   file=ROOT/'public'/path.lstrip('/')
   if not file.is_file():break
   if generated and hashlib.sha256(file.read_bytes()).hexdigest()!=generated['sha256']:raise ValueError('Reviewed image bytes changed')
   output.append({'id':c['id'],'image':path,'correct':c['correct']})
  if len(output)!=3 or len({c['image'] for c in output})!=3:continue
  question.setdefault('formes',{})['qcm_image']={'melanger':True,'choix':output}
  activated[key]={'bank':key[0],'exercise':key[1],'question':key[2],'enonce':proposal['enonce'],'images':[c['image'] for c in output],'status':'active_after_visual_review'}
  proposal['status']='active après génération et contrôle visuel des trois propositions'
  for c,img in zip(proposal['choices'],output):
   for m in overrides['mappings']:
    if norm(m['question'])==norm(proposal['enonce']) and norm(m['label'])==norm(c['texte']):m.update(replacement=img['image'],reason='Nouvelle image générée et contrôlée : '+images.get(c.get('asset'),{}).get('review_note','image existante déjà auditée'))
 for file,data in banks.items():write(file,data)
 registry['activated_questions']=list(activated.values());registry['co_generation_scope']='pending_user_reply_on_617_prepared_references'
 for asset in plan['assets']:
  if asset['id'] in images:asset.update(status='générée et contrôlée visuellement',generated_path=images[asset['id']]['path'])
 plan['summary']['generated_reviewed_assets']=len(images);plan['summary']['activated_ce_questions_this_batch']=len(activated)
 write('docs/tcf/images-generees.json',registry);write('docs/tcf/images-a-generer.json',plan);write('scripts/tcf-qcm-image-visual-overrides.json',overrides)
 print(f'{len(images)} illustrations validées ; {len(activated)} variantes CE activées ; CO en attente de clarification de périmètre.')
if __name__=='__main__':main()
