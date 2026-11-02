"""Verify retention, collision handling and containment using tiny synthetic audio."""
import hashlib
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
import zipfile

SCRIPT = Path(__file__).parent / 'audio_replacement/import_archives.py'


class ArchiveImportTest(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix='audio-import-test-')
        self.root = Path(self.temp.name)
        self.audio = self.root/'tone.mp3'
        subprocess.run(['ffmpeg','-v','error','-f','lavfi','-i','sine=frequency=440:duration=0.12',
                        '-c:a','libmp3lame',str(self.audio)],check=True)

    def tearDown(self):
        self.temp.cleanup()

    def archive(self, collection, member='shared_001.mp3'):
        path = self.root/(collection+'.zip')
        with zipfile.ZipFile(path,'w') as output:
            output.write(self.audio,member)
        return {'file_id':'test-'+collection,'level':'a1','collection':collection,
                'archive_name':path.name,'local_archive':str(path),'status':'downloaded'}

    def run_import(self, archives):
        manifest = self.root/'archives.json'
        manifest.write_text(json.dumps({'archives':archives}))
        return subprocess.run([sys.executable,str(SCRIPT),'--archives',str(manifest),
                               '--work',str(self.root/'batch-work')],capture_output=True,text=True)

    def test_same_filename_and_same_bytes_are_retained_in_both_collections(self):
        archives = [self.archive('first'),self.archive('second')]
        before = {r['local_archive']:hashlib.sha256(Path(r['local_archive']).read_bytes()).hexdigest() for r in archives}
        result = self.run_import(archives)
        self.assertEqual(result.returncode,0,result.stderr)
        catalogue = json.loads((self.root/'batch-work/source-catalogue.json').read_text())
        self.assertEqual(len(catalogue['sources']),2)
        self.assertEqual(len({s['source_id'] for s in catalogue['sources']}),2)
        self.assertEqual(len({s['source_file'] for s in catalogue['sources']}),2)
        for row in catalogue['sources']:
            self.assertEqual(Path(row['source_file']).read_bytes(),self.audio.read_bytes())
        for path,digest in before.items():
            self.assertEqual(hashlib.sha256(Path(path).read_bytes()).hexdigest(),digest)

    def test_existing_different_source_is_never_overwritten(self):
        archives = [self.archive('first')]
        self.assertEqual(self.run_import(archives).returncode,0)
        catalogue = json.loads((self.root/'batch-work/source-catalogue.json').read_text())
        imported = Path(catalogue['sources'][0]['source_file'])
        imported.write_bytes(b'previous bytes must remain')
        result = self.run_import(archives)
        self.assertNotEqual(result.returncode,0)
        self.assertEqual(imported.read_bytes(),b'previous bytes must remain')
        self.assertIn('refusing overwrite',result.stderr)

    def test_each_source_receipt_gets_a_plan_even_when_bytes_are_identical(self):
        self.assertEqual(self.run_import([self.archive('first'),self.archive('second')]).returncode,0)
        catalogue = self.root/'batch-work/source-catalogue.json'
        sources = json.loads(catalogue.read_text())['sources']
        asr = self.root/'asr'
        asr.mkdir()
        for index, source in enumerate(sources):
            document = {'status':'transcribed','source_id':source['source_id'],
                        'source_sha256':source['sha256'],'word_timing_method':'synthetic test only',
                        'words':[{'word':'Bonjour','start':0.01,'end':0.04,'chunk_index':0,'native_token_indices':[0]},
                                 {'word':'madame','start':0.06,'end':0.09,'chunk_index':0,'native_token_indices':[1]}],
                        'chunks':[{'start':0,'tokens':['Bonjour',' madame'],
                                   'timestamps':[0.01,0.06],'durations':[0.03,0.03]}]}
            (asr/f'{index}.json').write_text(json.dumps(document))
        output = self.root/'work-plans'
        result = subprocess.run([sys.executable,str(SCRIPT.with_name('prepare_source_plans.py')),
                                 '--catalogue',str(catalogue),'--asr-dir',str(asr),
                                 '--overrides',str(self.root/'no-overrides.json'),
                                 '--output-dir',str(output)],capture_output=True,text=True)
        self.assertEqual(result.returncode,0,result.stderr)
        plans = json.loads((output/'segmentation-index.json').read_text())
        self.assertEqual({r['source_id'] for r in plans['sources']},{r['source_id'] for r in sources})

    def test_archive_path_traversal_is_rejected(self):
        result = self.run_import([self.archive('unsafe','../outside.mp3')])
        self.assertNotEqual(result.returncode,0)
        self.assertIn('Unsafe archive member path',result.stderr)
        self.assertFalse((self.root/'batch-work/incoming/a1/outside.mp3').exists())

    def test_explicit_copyright_removal_does_not_remove_other_equal_bytes(self):
        definition=self.archive('book','copyright_000.mp3')
        with zipfile.ZipFile(definition['local_archive'],'a') as output:
            output.write(self.audio,'dialogue_001.mp3')
        self.assertEqual(self.run_import([definition]).returncode,0)
        definition['copyright_exclusions']=[{'member':'copyright_000.mp3',
            'sha256':hashlib.sha256(self.audio.read_bytes()).hexdigest(),'reason':'copyright'}]
        result=self.run_import([definition])
        self.assertEqual(result.returncode,0,result.stderr)
        catalogue=json.loads((self.root/'batch-work/source-catalogue.json').read_text())
        self.assertEqual([s['original_filename'] for s in catalogue['sources']],['dialogue_001.mp3'])
        self.assertFalse((self.root/'batch-work/incoming/a1/book/copyright_000.mp3').exists())
        self.assertEqual((self.root/'batch-work/incoming/a1/book/dialogue_001.mp3').read_bytes(),self.audio.read_bytes())
        self.assertTrue(Path(definition['local_archive']).is_file())

    def test_copyright_removal_requires_exact_source_checksum(self):
        definition=self.archive('book','copyright_000.mp3')
        self.assertEqual(self.run_import([definition]).returncode,0)
        definition['copyright_exclusions']=[{'member':'copyright_000.mp3','sha256':'0'*64,'reason':'copyright'}]
        result=self.run_import([definition])
        self.assertNotEqual(result.returncode,0)
        self.assertEqual((self.root/'batch-work/incoming/a1/book/copyright_000.mp3').read_bytes(),self.audio.read_bytes())


if __name__ == '__main__':
    unittest.main()
