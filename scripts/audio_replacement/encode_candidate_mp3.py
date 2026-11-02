#!/usr/bin/env python3
"""Encode exact prepared FLAC candidates as MP3; keep both and all review evidence."""
import argparse
import datetime as dt
import json
from pathlib import Path
import re
import sys

sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from tcf_audio_boundaries import CHECKS, sha256
from tcf_audio_replacement import encode_mp3, probe


def read(path):
    return json.loads(Path(path).read_text(encoding='utf-8'))


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--work',type=Path,default=Path('/workspace/work/tcf-audio-replacement'))
    args=parser.parse_args()
    root=args.work/'staged-boundaries-work'
    progress=read(root/'batch-progress.json')
    output=root/'mp3-index.json'
    existing=read(output)['sources'] if output.exists() else []
    byid={row['source_id']:row for row in existing}
    def save():
        rows=list(byid.values())
        summary={'schema_version':1,'updated_at':dt.datetime.now(dt.timezone.utc).isoformat(),
                 'source_count':len(rows),'mp3_count':sum(len(row['segments']) for row in rows),
                 'listening_performed':False,'validated_segments':0,'production_modified':False,
                 'sources':rows}
        temporary=output.with_suffix('.tmp')
        temporary.write_text(json.dumps(summary,ensure_ascii=False,indent=2)+'\n');temporary.replace(output)
    for source in progress['sources']:
        if source['status']!='needs_review':
            continue
        manifest_path=Path(source['manifest']);manifest=read(manifest_path)
        previous=byid.get(source['source_id'])
        if previous and previous['boundary_manifest_sha256']==sha256(manifest_path):
            continue
        source_row={'source_id':source['source_id'],'manifest_path':str(manifest_path),
                    'boundary_manifest_sha256':sha256(manifest_path),'segments':[]}
        if previous:
            source_row['previous_version_preserved']=previous
        for segment in manifest['segments']:
            flac=manifest_path.parent/segment['audio']['path']
            if sha256(flac)!=segment['audio']['sha256']:
                raise ValueError('Le candidat FLAC a changé : '+str(flac))
            mp3=flac.with_name('candidate.mp3')
            if not mp3.exists():
                encode_mp3(flac,mp3)
            info=probe(mp3,decode=True)
            if info['codec']!='mp3':
                raise ValueError('MP3 attendu : '+str(mp3))
            title=re.split(r'(?<=[.!?])\s+',segment['transcript'],maxsplit=1)[0]
            title=' '.join(title.split()[:18])
            duration=info['duration']
            length='court' if duration<=15 else 'moyen' if duration<=45 else 'long'
            row={'id':segment['id'],'name':title,'name_status':'proposed_from_transcript',
                 'tags':list(dict.fromkeys(segment['tags']+[length])),
                 'length_tag_status':'duration_based_provisional',
                 'transcription':segment['transcript'],'file':str(mp3),'sha256':sha256(mp3),
                 'derived_from_flac_sha256':segment['audio']['sha256'],
                 'source_start_seconds':segment['start_seconds'],'source_end_seconds':segment['end_seconds'],
                 'probe':info,'status':'needs_review','listening_performed':False}
            source_row['segments'].append(row)
            review={'version':1,'dialogue_id':segment['id'],'audio_sha256':row['sha256'],
                    'reviewer':'','human_listening':False,'listened_at':'','notes':'',
                    'transcription_checked':False,'transcription':segment['transcript'],
                    'checks':dict.fromkeys(CHECKS,False),
                    'instruction':'Renseigner seulement après écoute effective de ce MP3 exact et contrôle de ses frontières.'}
            template=mp3.with_name('final-review-template.json')
            if not template.exists():
                template.write_text(json.dumps(review,ensure_ascii=False,indent=2)+'\n')
        review_page=(manifest_path.parent/'review.html').read_text()
        for segment in manifest['segments']:
            review_page=review_page.replace(segment['audio']['path'],segment['audio']['path'].replace('candidate.flac','candidate.mp3'))
        (manifest_path.parent/'review-mp3.html').write_text(review_page,encoding='utf-8')
        byid[source['source_id']]=source_row
        save()
        print(json.dumps({'source_id':source['source_id'],'mp3_candidates':len(source_row['segments'])}),flush=True)
    save()


if __name__=='__main__':
    main()
