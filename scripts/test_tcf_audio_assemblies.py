"""Synthetic assembly integrity; these tests do not attest any listening."""
import hashlib
import json
from pathlib import Path
import shutil
import struct
import tempfile
import unittest
import wave

from tcf_audio_boundaries import prepare,read_json
from tcf_audio_compact import _decode
from audio_replacement.assemble_audio_parts import assemble


@unittest.skipUnless(shutil.which('ffmpeg') and shutil.which('ffprobe'),'ffmpeg required')
class AudioAssemblyTests(unittest.TestCase):
    def test_only_useful_passages_are_joined_and_source_checks_remain_required(self):
        with tempfile.TemporaryDirectory(prefix='work-assembly-test-') as folder:
            root=Path(folder);source=root/'source.wav'
            with wave.open(str(source),'wb') as writer:
                writer.setparams((1,2,8000,0,'NONE','not compressed'))
                writer.writeframes(b''.join(struct.pack('<h',((i*149)%60000)-30000) for i in range(24000)))
            words=[{'text':word,'start':start,'end':end,'kind':kind} for word,start,end,kind in
                   [('Un.',.1,.4,'announcement'),('Bonjour.',.8,1.1,'dialogue'),
                    ('Deux.',1.4,1.6,'announcement'),('Merci.',1.9,2.2,'dialogue')]]
            segments=[{'id':'part-'+str(i),'first_word':index,'last_word':index,
                       'name':'Useful passage','tags':['test'],'transcript':words[index]['text']}
                      for i,index in enumerate((1,3))]
            plan=root/'plan.json';plan.write_text(json.dumps({'schema_version':1,'words':words,'segments':segments}))
            manifest=prepare(source,plan,root,compact=True);data=read_json(manifest)
            result=assemble(manifest,root/'joined-work')
            digest=hashlib.sha256()
            for part in data['segments']:
                for block in _decode(manifest.parent/part['audio']['path'],data['source']):digest.update(block)
            self.assertEqual(result['pcm_sha256'],digest.hexdigest())
            self.assertEqual(result['transcription'],'Bonjour. Merci.')
            self.assertEqual(len(result['parts']),2)
            self.assertFalse(result['listening_performed'])
            self.assertLess(result['probe']['duration'],2)
            altered=manifest.parent/data['segments'][0]['audio']['path']
            with altered.open('ab') as handle:handle.write(b'changed')
            with self.assertRaises(ValueError):assemble(manifest,root/'other-work')


if __name__=='__main__':unittest.main()
