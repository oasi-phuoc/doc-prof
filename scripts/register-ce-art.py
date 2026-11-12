#!/usr/bin/env python3
"""Intègre une image réellement générée, après contrôle visuel documenté."""
import argparse,hashlib,json,shutil,subprocess
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def read(path):return json.loads((ROOT/path).read_text())
def save(path,value):(ROOT/path).write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n')
def main():
 p=argparse.ArgumentParser();p.add_argument('--id',required=True);p.add_argument('--source',required=True);p.add_argument('--review',required=True);p.add_argument('--preserve-original',action='store_true',help='Register the generated PNG without conversion.');args=p.parse_args()
 source=Path(args.source).resolve()
 allowed={Path('/workspace/generated_images'),ROOT/'public/lib/images/tcf/ce-art-generated'}
 if source.parent not in allowed or source.suffix!='.png' or not source.is_file():raise SystemExit('Fichier PNG généré requis dans le dossier de génération ou le catalogue CE.')
 if len(args.review)<60:raise SystemExit('Consigner les faits et les éléments visuels vérifiés.')
 bank=read('src/tcf/content/a0-a1/ce.json');ex=next(e for e in bank if e['id']==args.id);formats=read('src/tcf/content/ce-document-formats.json')
 if formats[args.id]['engine']!='imagegen':raise SystemExit('Ce script est réservé aux illustrations générées.')
 target=ROOT/'public/lib/images/tcf/ce-art-generated'/f"{args.id}{'.png' if args.preserve_original else '.webp'}";target.parent.mkdir(parents=True,exist_ok=True)
 if args.preserve_original:
  if source!=target:shutil.copyfile(source,target)
 else:subprocess.run(['convert','-limit','thread','1',str(source),'-quality','92',str(target)],check=True)
 dimensions=subprocess.check_output(['identify','-format','%w %h',str(target)],text=True).split();width,height=map(int,dimensions)
 if min(width,height)<1000:raise SystemExit('Résolution trop faible pour le document CE.')
 if args.preserve_original and width*3!=height*4:raise SystemExit('Le document PNG doit être en paysage 4:3.')
 row={'id':args.id,'label':ex.get('scene') or ex.get('theme'),'src':'/lib/images/tcf/ce-art-generated/'+target.name,'sourceKey':json.dumps({k:ex[k] for k in ['support','scene','theme'] if k in ex},ensure_ascii=False,separators=(',',':')),**formats[args.id],'fontFamily':'Géométrique sans empattement, référence URW Gothic','width':width,'height':height,'review':args.review,'sourceSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'sha256':hashlib.sha256(target.read_bytes()).hexdigest()}
 if args.preserve_original:row['originalBytesPreserved']=True
 art=[a for a in read('src/tcf/content/ce-art.json') if a['id']!=args.id]+[row];save('src/tcf/content/ce-art.json',art)
 status=read('docs/tcf/ce-art-status.json');status['pending']=[d for d in status['pending'] if d['id']!=args.id];status['readyCount']=len(art);status['pendingCount']=len(status['pending']);status.pop('generationBlocker',None);status['generationState']='Terminé ; tous les documents CE sont intégrés.' if not status['pending'] else 'En cours, selon l’ordre des documents donné par l’utilisateur.';save('docs/tcf/ce-art-status.json',status)
 print(json.dumps({'id':args.id,'width':width,'height':height,'ready':len(art),'pending':len(status['pending'])},ensure_ascii=False))
if __name__=='__main__':main()
