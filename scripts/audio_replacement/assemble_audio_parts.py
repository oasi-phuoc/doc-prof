#!/usr/bin/env python3
"""Join reviewed useful passages while retaining every source boundary proof.

Useful ordered question lists can remain one support without spoken exercise
numbers. The composed PCM must equal the concatenated lossless passage PCM.
This operation never attests listening or changes a production resource.
"""
import argparse
import hashlib
import html
import json
import os
from pathlib import Path
import subprocess
import sys

sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from tcf_audio_boundaries import sha256,verify_integrity,safe_work
from tcf_audio_compact import _decode,inspect_pcm
from tcf_audio_replacement import encode_mp3,probe


def read(path):return json.loads(Path(path).read_text(encoding='utf-8'))


def assemble(manifest_path,out):
    manifest_path=Path(manifest_path);manifest=read(manifest_path);root=manifest_path.parent
    verify_integrity(manifest,root)
    info=manifest['source'];files=[root/s['audio']['path'] for s in manifest['segments']]
    out=safe_work(out);out.mkdir(parents=True,exist_ok=True)
    flac=out/'joined.flac';mp3=out/'joined.mp3'
    args=['ffmpeg','-nostdin','-v','error','-n']
    for file in files:args+=['-i',str(file)]
    inputs=''.join(f'[{i}:a:0]' for i in range(len(files)))
    args+=['-filter_complex',inputs+f'concat=n={len(files)}:v=0:a=1[out]','-map','[out]',
           '-map_metadata','-1','-c:a','flac','-compression_level','5',str(flac)]
    if not flac.exists():subprocess.run(args,check=True,capture_output=True)
    expected=hashlib.sha256();frames=0
    for file,segment in zip(files,manifest['segments']):
        if sha256(file)!=segment['audio']['sha256']:raise ValueError('Source passage changed')
        for block in _decode(file,info):expected.update(block)
        frames+=segment['audio']['frames']
    actual=inspect_pcm(flac,info)
    if actual['decoded_pcm_sha256']!=expected.hexdigest() or actual['decoded_frames']!=frames:
        raise ValueError('Joined PCM differs from the ordered source passages')
    if not mp3.exists():encode_mp3(flac,mp3)
    metadata=probe(mp3,decode=True)
    row={'id':manifest['segments'][0]['id'].rsplit('-d',1)[0]+'-joined',
         'file':str(mp3),'sha256':sha256(mp3),'derived_from_flac_sha256':sha256(flac),
         'pcm_sha256':actual['decoded_pcm_sha256'],'frames':frames,'probe':metadata,
         'transcription':' '.join(s['transcript'] for s in manifest['segments']),
         'name':'Série de phrases sans annonces de numérotation',
         'tags':['long' if metadata['duration']>45 else 'moyen' if metadata['duration']>15 else 'court'],
         'status':'needs_review','listening_performed':False,'production_modified':False,
         'source_sha256':info['sha256'],'part_manifest':str(manifest_path),
         'part_manifest_sha256':sha256(manifest_path),'parts':[
             {'id':s['id'],'source_start_seconds':s['start_seconds'],'source_end_seconds':s['end_seconds'],
              'frames':s['audio']['frames'],'flac_sha256':s['audio']['sha256']} for s in manifest['segments']]}
    (out/'manifest.json').write_text(json.dumps(row,ensure_ascii=False,indent=2)+'\n')
    controls=''.join(f'<li><a href="{html.escape(os.path.relpath(root/"review-mp3.html",out),quote=True)}#{html.escape(s["id"])}">Passage {i+1} et ses quatre frontières</a></li>' for i,s in enumerate(manifest['segments']))
    (out/'review.html').write_text('<!doctype html><html lang="fr"><meta charset="utf-8"><title>Série sans numérotation</title>'
        '<h1>Série sans annonces de numérotation</h1><p>Candidat à écouter en entier. Les contrôles des frontières de chaque passage restent nécessaires.</p>'
        '<audio controls src="joined.mp3"></audio><p>'+html.escape(row['transcription'])+'</p><ul>'+controls+'</ul>')
    return row


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--work',type=Path,default=Path('/workspace/work/tcf-audio-replacement'))
    args=parser.parse_args();work=args.work/'refinement-work';records=read(work/'prepared-refinements.json');rows=[]
    for source in records:
        if source['assembly']:
            row=assemble(source['manifest'],work/'assemblies'/source['source_id'].replace(':','-'))
            row['source_id']=source['source_id'];rows.append(row)
    (work/'assembled-candidates.json').write_text(json.dumps({'schema_version':1,'assemblies':rows},ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'assemblies':len(rows),'all_pcm_exact':True,'listening_performed':False}))


if __name__=='__main__':main()
