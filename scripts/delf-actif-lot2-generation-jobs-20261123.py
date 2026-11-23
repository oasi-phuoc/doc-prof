"""Print ready generation jobs; never generate or approve an image automatically."""
import argparse,hashlib,json
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('--prefix',default='/tmp/tcf-delf-lot2-100-20261123');p.add_argument('--count',type=int,default=8);p.add_argument('--kind',choices=['new','retakes'],default='new');a=p.parse_args();root=Path(__file__).resolve().parents[1]
def read(s):return json.loads(Path(a.prefix+'-'+s+'.json').read_text())
g={x['id']:x for x in read('generation')};q=read('queue');qby={x['id']:x for x in q};seen=read('seen-images');retakes=read('retakes');need={Path(p).stem for t in read('targets') for p in t['paths'] if '/qcm-delf2-' in p};jobs=[]
# A reviewed reuse can replace a seed without requiring a redundant new image.
reuse_file=root/'docs/tcf/delf-actif-20261113/reemploi-21-journaux-20261123.json'
if reuse_file.exists():
 manifest={x['path']:x for x in json.loads((root/'docs/tcf/images-generees.json').read_text())['images']}
 for reuse in json.loads(reuse_file.read_text())['retained_reuses']:
  ident=reuse['replaced_pending_id'];path=reuse['path'];source=root/'public'/path.lstrip('/')
  assert manifest[path]['status']=='visually_reviewed'
  assert hashlib.sha256(source.read_bytes()).hexdigest()==reuse['sha256']==manifest[path]['sha256']
  if ident not in g:
   g[ident]={'id':ident,'source':str(source),'seed_reviewed':True,'reused_from':path}
   seen[ident]=reuse['sha256']
if a.kind=='retakes':
 for stem,prompt in retakes.items():
  id='qcm-delf2-'+stem
  if id not in g:continue
  r=dict(g[id]);previous=r['source'];style=r.get('style_refs') or qby[id]['refs'];r.update(prompt=prompt,refs=[previous],style_refs=style,retake_reason=prompt,status='pending_generation',seed_reviewed=False);r.pop('needs_retake',None)
  if stem in ['yacht','ferry','voilier-course','satellite','montgolfiere']:
   r.update(type=qby[id]['type'],label=qby[id]['label'],desc=qby[id]['desc']);r['refs'].extend(qby[id]['refs'][:1])
  jobs.append(r)
else:
 for item in q:
  if item['id'] not in need or item['id'] in g:continue
  seed=item.get('seed');r=dict(item)
  if seed:
   parent=g.get(seed)
   if not parent or parent.get('needs_retake') or seed.removeprefix('qcm-delf2-') in retakes or not parent.get('seed_reviewed'):continue
   if seen.get(seed)!=hashlib.sha256(Path(parent['source']).read_bytes()).hexdigest():continue
   r['refs']=[parent['source']]+r['refs'][:1]
   if parent.get('reused_from'):r['seed_reuse']=parent['reused_from']
  jobs.append(r)
for job in jobs:
 job['prompt']='Generate ONLY the specific target described below in ONE image file. Do not illustrate future alternatives or variants as a contact sheet, collage, split screen, inset sequence or additional panels. If the target explicitly requires a pair of objects or activities, show only that requested pair. '+job['prompt']
print(json.dumps(jobs[:max(0,a.count)],ensure_ascii=False,indent=2))
