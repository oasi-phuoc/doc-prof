"""Boundary revisions and resumable candidate batches retain evidence and receipts."""
import copy
import json
import math
from pathlib import Path
import shutil
import struct
import subprocess
import sys
import tempfile
import unittest
import wave

from tcf_audio_boundaries import example, sha256
from audio_replacement.export_plan_word_views import word_view
from audio_replacement.review_plan_ranges import revise


class RangeRevisionTests(unittest.TestCase):
    def test_review_preserves_native_times_and_existing_dialogue_ids(self):
        plan=example()['plan']
        plan['provenance']={'source_sha256':'a'*64}
        before=copy.deepcopy(plan)
        change={'plan_path':'prior-plan.json','plan_sha256':'a'*64,
                'reason':'Remove announcement, keep the complete greeting.',
                'ranges':[{'id':plan['segments'][0]['id'],'first_word':2,'last_word':3}]}
        result=revise(plan,change)
        self.assertEqual(plan,before)
        self.assertEqual([(w['start'],w['end']) for w in result['words']],
                         [(w['start'],w['end']) for w in plan['words']])
        self.assertEqual(result['segments'][0]['id'],plan['segments'][0]['id'])
        self.assertFalse(result['provenance']['listening_performed'])
        change['ranges'].append({'first_word':3,'last_word':4})
        with self.assertRaisesRegex(ValueError,'overlap'):
            revise(plan,change)

    def test_matching_view_uses_plan_groups_and_cannot_be_mistaken_for_raw_asr(self):
        with tempfile.TemporaryDirectory(prefix='work-plan-view-') as folder:
            plan=example()['plan'];plan['provenance']={'source_sha256':'a'*64}
            path=Path(folder)/'plan.json';path.write_text(json.dumps(plan))
            row={'source_id':'separate-receipt','source_sha256':'a'*64,'plan_path':str(path)}
            source={'sha256':'a'*64,'duration_seconds':3,'sample_rate':8000}
            result=word_view(row,source)
            self.assertEqual(result['source_id'],'separate-receipt')
            self.assertEqual([w['word'] for w in result['words']],[w['text'] for w in plan['words']])
            self.assertEqual(result['status'],'plan_matching_view')
            self.assertEqual(result['plan_sha256'],sha256(path))
            source['sha256']='b'*64
            with self.assertRaisesRegex(ValueError,'checksums'):
                word_view(row,source)


@unittest.skipUnless(shutil.which('ffmpeg') and shutil.which('ffprobe'),'ffmpeg required')
class ResumableCandidateTests(unittest.TestCase):
    def test_two_receipts_with_same_bytes_are_both_prepared_without_claiming_listening(self):
        with tempfile.TemporaryDirectory(prefix='work-batch-test-') as folder:
            root=Path(folder);source=root/'original.wav'
            with wave.open(str(source),'wb') as handle:
                handle.setparams((1,2,8000,0,'NONE',''))
                handle.writeframes(b''.join(struct.pack('<h',int(12000*math.sin(i*.2))) for i in range(24000)))
            checksum=sha256(source)
            sources=[];plans=[]
            for sid in ('receipt-one','receipt-two'):
                plan=example()['plan'];plan['segments'][0]['id']=sid+'-d1'
                path=root/(sid+'.json');path.write_text(json.dumps(plan))
                sources.append({'source_id':sid,'source_file':str(source),'sha256':checksum,
                                'duration_seconds':3,'sample_rate':8000,'channels':1})
                plans.append({'source_id':sid,'source_sha256':checksum,'plan_path':str(path),
                              'plan_integrity':'passed','classification_method':'textual_test'})
            catalogue=root/'catalogue.json';catalogue.write_text(json.dumps({'sources':sources}))
            index=root/'index.json';index.write_text(json.dumps({'sources':plans}))
            script=Path(__file__).parent/'audio_replacement/batch_prepare.py'
            base=[sys.executable,str(script),'--work',str(root),'--catalogue',str(catalogue),'--plan-index',str(index)]
            first=subprocess.run(base+['--source-id','receipt-one'],capture_output=True,text=True)
            self.assertEqual(first.returncode,0,first.stderr)
            progress_path=root/'staged-boundaries-work/batch-progress.json'
            progress=json.loads(progress_path.read_text())
            self.assertEqual(progress['source_count'],2)
            self.assertFalse(progress['complete'])
            second=subprocess.run(base,capture_output=True,text=True)
            self.assertEqual(second.returncode,0,second.stderr)
            progress=json.loads(progress_path.read_text())
            mp3=json.loads((progress_path.parent/'mp3-index.json').read_text())
            self.assertTrue(progress['complete'])
            self.assertEqual({r['source_id'] for r in progress['sources']},{'receipt-one','receipt-two'})
            self.assertEqual(mp3['mp3_count'],2)
            self.assertFalse(progress['listening_performed'])
            self.assertEqual(progress['validated_segments'],0)
            self.assertEqual(sha256(source),checksum)
            self.assertEqual(len(list(progress_path.parent.glob('run-*'))),2)
            third=subprocess.run(base,capture_output=True,text=True)
            self.assertEqual(third.returncode,0,third.stderr)
            self.assertEqual(len(list(progress_path.parent.glob('run-*'))),2)
            source.write_bytes(b'changed')
            failed=subprocess.run(base,capture_output=True,text=True)
            self.assertNotEqual(failed.returncode,0)
            self.assertIn('checksum mismatch',failed.stderr)


if __name__=='__main__':
    unittest.main()
