#!/usr/bin/env python3
"""Record real generated images and encode site assets without altering their composition."""
from __future__ import annotations
import argparse,hashlib,json,subprocess
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
REGISTRY=ROOT/'docs/tcf/images-generees.json'

def digest(path):return hashlib.sha256(path.read_bytes()).hexdigest()
def load():return json.loads(REGISTRY.read_text()) if REGISTRY.exists() else {'schema_version':1,'scope':'CE prioritaire ; CO limité aux sources préparées selon la réponse de l’utilisateur ; grammaire : reprise du style','images':[],'activated_questions':[],'pending':[]}
def save(data):REGISTRY.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
def main():
 parser=argparse.ArgumentParser();parser.add_argument('action',choices=['record','review']);parser.add_argument('--id',required=True);parser.add_argument('--source');parser.add_argument('--target');parser.add_argument('--note',default='');parser.add_argument('--prompt',default='');args=parser.parse_args();data=load()
 if args.action=='record':
  source=Path(args.source).resolve();target=(ROOT/'public'/args.target.lstrip('/')).resolve()
  if source.parent!=Path('/workspace/generated_images') or not source.is_file():raise SystemExit('An actual generated PNG is required')
  if not target.is_relative_to(ROOT/'public/lib/images'):raise SystemExit('Target must be a site image')
  if target.exists():raise SystemExit('Refusing to overwrite an existing asset')
  target.parent.mkdir(parents=True,exist_ok=True)
  subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-i',str(source),'-c:v','libwebp','-quality','90','-compression_level','6','-frames:v','1',str(target)],check=True)
  row={'id':args.id,'path':args.target,'source_png':str(source),'source_sha256':digest(source),'sha256':digest(target),'bytes':target.stat().st_size,'status':'generated_pending_visual_review','review_note':'','prompt':args.prompt}
  if any(r['id']==args.id for r in data['images']):raise SystemExit('Duplicate image id')
  data['images'].append(row)
 else:
  row=next(r for r in data['images'] if r['id']==args.id)
  if not args.note.strip():raise SystemExit('A concrete visual review is required')
  row['status']='visually_reviewed';row['review_note']=args.note
 save(data);print(json.dumps({'id':row['id'],'path':row['path'],'status':row['status'],'bytes':row['bytes']},ensure_ascii=False))
if __name__=='__main__':main()
