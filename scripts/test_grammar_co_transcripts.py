import copy
import importlib.util
from pathlib import Path
import unittest

spec=importlib.util.spec_from_file_location('grammar_import',Path(__file__).with_name('import-grammar-co-transcriptions.py'))
module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)


class GrammarTranscriptTests(unittest.TestCase):
    def setUp(self):
        self.bank=[dict(status='audio-only',source=dict(sha256='source'),exercise=dict(id='first',
            support=dict(audio='/original.mp3',transcription=''),questions=[]))]
        self.first={'source':dict(status='transcribed',source_sha256='source',text='Bonjour.')}
        self.second={'source':dict(status='transcribed',source_sha256='source',text='Bonjour !')}
        self.decisions={'first':dict(reading='whisper_fr',text_reviewed=True,review_note='Both texts identify the greeting.')}

    def test_original_audio_questions_and_input_are_preserved(self):
        original=copy.deepcopy(self.bank)
        entries,records=module.build_entries(self.bank,self.first,self.second,self.decisions)
        self.assertEqual(self.bank,original)
        self.assertEqual(entries[0]['exercise']['support']['audio'],'/original.mp3')
        self.assertEqual(entries[0]['exercise']['questions'],[])
        self.assertEqual(entries[0]['exercise']['support']['transcription'],'Bonjour !')
        self.assertFalse(records[0]['human_listening_performed'])

    def test_other_recording_cannot_supply_the_transcript(self):
        self.second['source']['source_sha256']='other recording'
        with self.assertRaisesRegex(ValueError,'checksum'):module.build_entries(self.bank,self.first,self.second,self.decisions)

    def test_incomplete_recognition_is_rejected(self):
        self.second['source']['status']='failed'
        with self.assertRaisesRegex(ValueError,'completed'):module.build_entries(self.bank,self.first,self.second,self.decisions)

    def test_unresolved_tokens_and_empty_transcript_are_rejected(self):
        for text in ['','<unk>']:
            self.second['source']['text']=text
            with self.assertRaisesRegex(ValueError,'unresolved'):module.build_entries(self.bank,self.first,self.second,self.decisions)

    def test_existing_transcript_is_not_silently_overwritten(self):
        self.bank[0]['exercise']['support']['transcription']='Previously reviewed text.'
        with self.assertRaisesRegex(ValueError,'existing transcript'):module.build_entries(self.bank,self.first,self.second,self.decisions)

    def test_every_selection_requires_review(self):
        self.decisions['first']['text_reviewed']=False
        with self.assertRaisesRegex(ValueError,'actual text review'):module.build_entries(self.bank,self.first,self.second,self.decisions)


if __name__=='__main__':unittest.main()
