"""Register visually approved PNGs, optionally preserving their original bytes.

Usage: python scripts/register_tcf_reviewed_images.py reviewed-items.json
The input must contain only images whose visual review has been completed.
"""
import hashlib,json,shutil,subprocess,sys
from pathlib import Path
from PIL import Image
root=Path(__file__).resolve().parents[1]
commit='48a753d8d6bd095e41968b39da88dbcb331fee11'
reference='/lib/images/tcf/qcm-audit/co834-boissons-dessinees.webp'
p=root/'docs/tcf/images-generees.json';data=json.loads(p.read_text())
items=json.loads(Path(sys.argv[1]).read_text())
for item in items:
 assert not any(r['id']==item['id'] for r in data['images']),item['id']
 suffix='.png' if item.get('preserve_original') else '.webp'
 dest=root/'public/lib/images/tcf/qcm-audit'/(item['id']+suffix)
 assert not dest.exists() or (item.get('preserve_original') and dest.resolve()==Path(item['source']).resolve()),item['id']
for item in items:
 key=item['id'];src=Path(item['source']);suffix='.png' if item.get('preserve_original') else '.webp';target='/lib/images/tcf/qcm-audit/'+key+suffix;dest=root/'public'/target.lstrip('/')
 assert not any(r['id']==key for r in data['images']),key
 if item.get('preserve_original'):
  with Image.open(src) as im:assert im.format=='PNG' and im.width*3==im.height*4
  if src.resolve()!=dest.resolve():
   assert not dest.exists(),dest
   shutil.copyfile(src,dest)
 else:
  assert not dest.exists(),dest
  subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-i',str(src),'-c:v','libwebp','-quality','90','-compression_level','6','-frames:v','1',str(dest)],check=True)
 with Image.open(dest) as im:w,h=im.size
 assert w*3==h*4
 row=dict(id=key,label=item['label'],path=target,prompt=item['prompt'],source_png=str(src),source_sha256=hashlib.sha256(src.read_bytes()).hexdigest(),sha256=hashlib.sha256(dest.read_bytes()).hexdigest(),bytes=dest.stat().st_size,width=w,height=h,aspect_ratio='4:3',status='visually_reviewed',domain='ce-co',batch='reprise-20261106-objets-inclus',style_reference_commit=commit,style_references=[reference],reference_images=[reference],review_note=item.get('review_note','Sujet entier et sens contrôlés visuellement, proportions crédibles, peinture douce sur fond crème, aucun texte ni élément parasite.'),style_review=dict(status='aligned',reference_commit=commit,references=[reference]))
 if 'clock_time' in item:
  row['clock_time']=item['clock_time']
  row['reference_images']=['/lib/images/tcf/qcm-audit/co834-horloge-1800-dessinee.webp',reference]
 if 'reference_images' in item:
  row['reference_images']=item['reference_images']
  row['style_references']=item['reference_images']
  row['style_review']['references']=item['reference_images']
 if 'style_references' in item:
  row['style_references']=item['style_references']
  row['style_review']['references']=item['style_references']
 if 'generation_recovery_note' in item:row['generation_recovery_note']=item['generation_recovery_note']
 if item.get('preserve_original'):row['original_bytes_preserved']=True
 for key in ['subject_colour','counting_number','counting_subject','generation_stage']:
  if key in item:row[key]=item[key]
 data['images'].append(row)
p.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
print('Images enregistrées :',len(json.loads(Path(sys.argv[1]).read_text())))
