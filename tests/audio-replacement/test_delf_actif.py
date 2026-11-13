"""Regression checks for actual import failures: labels, aliases and stale review."""
import copy
import json
from pathlib import Path
import sys
import tempfile
import unittest
sys.path.insert(0,str(Path(__file__).resolve().parents[2]/'scripts/audio_replacement'))
import delf_actif_import as importer

class SourceParsing(unittest.TestCase):
    def test_track_31_without_space_is_not_lost(self):
        units={u['key']:u for u in importer.pdf_units('b1')}
        self.assertIn('b1:031',units)
        self.assertEqual(len(units['b1:031']['reference_parts']),6)
        self.assertNotIn('Corrigés',units['b1:031']['transcription'])

    def test_exam_answer_keys_do_not_duplicate_documents(self):
        for level,count in [('a1',8),('a2',14),('b1',3)]:
            units=importer.pdf_units(level)
            for track in {'a1':range(49,53),'a2':range(43,47),'b1':range(38,42)}[level]:
                rows=[u for u in units if u['track']==track]
                self.assertEqual(len(rows),count,(level,track))
                self.assertEqual(len({u['key'] for u in rows}),count)

    def test_spoken_attention_and_labels(self):
        self.assertEqual(importer.speech('Attention : le train part !'),'Attention : le train part !')
        self.assertEqual(importer.speech('La mère : Bonjour.\nLe garçon : Merci.'),'Bonjour. Merci.')
        self.assertEqual(importer.speech('Journaliste- Bonjour.\nHugo - Merci.'),'Bonjour. Merci.')
        self.assertEqual(importer.body('les questions, écoutez le document puis répondez.\nBonjour Léo.','a2',17),'Bonjour Léo.')

    def test_hours_are_never_equated_across_different_values(self):
        self.assertNotEqual(importer.words('seize heures quinze'),importer.words('une heure quinze'))
        self.assertNotEqual(importer.words('moins cinq degrés'),importer.words('cinq degrés'))
        self.assertNotEqual(importer.words('3,5 litres'),importer.words('35 litres'))
        self.assertEqual(importer.best_quote_match('à 17h00','Rendez-vous à 17h devant la gare.')['score'],1)

    def test_parallel_listens_keep_original_inventory(self):
        units={u['key']:u for u in json.loads((importer.DOCS/'preparation.json').read_text())['units']}
        for n in range(1,7):
            alias=units[f'a2:009:{n:02d}'];primary=units[f'a2:008:{n:02d}']
            self.assertEqual(alias['parallel_reference_only'],'a2:008')
            # The second PDF version omits the article in "tous véhicules".
            # Its meaning and all numerical facts match the first reading.
            def variant(text):return ' '.join(importer.words(text)).replace('tous les vehicules','tous vehicules')
            self.assertEqual(variant(alias['transcription']),variant(primary['transcription']))
        received=json.loads((importer.DOCS/'receptions.json').read_text())
        self.assertEqual(received['received_audio_files'],140)

class ReviewGate(unittest.TestCase):
    def test_any_changed_bytes_transcript_or_question_rejects_a_stale_review(self):
        with tempfile.TemporaryDirectory() as tmp:
            path=Path(tmp)/'audio.mp3';path.write_bytes(b'a reviewed fixture')
            unit=dict(key='a1:999:01',level='a1',source_sha256='raw',transcription='Le bus part samedi.')
            item=dict(key=unit['key'],title='Le départ',theme='transports',questions=[dict(enonce='Quand part le bus ?',choices=['Samedi','Lundi','Jeudi'],evidence_quote='samedi'),dict(enonce='Quel véhicule part ?',choices=['Le bus','Le train','Le bateau'],evidence_quote='Le bus')])
            cut=dict(source_sha256='raw',path=str(path),sha256=importer.sha(path),duration_seconds=9)
            approval=dict(decision='ready_for_tcf',human_audio_listening_performed=False,audio_sha256=cut['sha256'],transcription_sha256=importer.content_sha(unit['transcription']),questions_sha256=importer.content_sha(item),final_recognition_engines=['test-fixture'])
            importer.check_ready(unit,item,cut,approval)
            altered=copy.deepcopy(item);altered['questions'][0]['choices'][0]='Dimanche'
            with self.assertRaises(AssertionError):importer.check_ready(unit,altered,cut,approval)
            with self.assertRaises(AssertionError):importer.check_ready(dict(unit,transcription='Le bus part lundi.'),item,cut,approval)
            path.write_bytes(b'unreviewed bytes')
            with self.assertRaises(AssertionError):importer.check_ready(unit,item,cut,approval)

    def test_tcf_qcm_contains_one_correct_choice_and_inline_form(self):
        unit=dict(key='b1:031',level='b1',transcription='Je suis sûr que ça se passera bien.')
        item=dict(title='Une intention',theme='communication',questions=[dict(enonce='Quelle attitude exprime la personne ?',choices=['La certitude','Le doute','La colère'])])
        exercise=importer.make_exercise(unit,item,'/lib/audio/tcf/co/example.mp3')
        q=exercise['questions'][0]
        self.assertEqual(exercise['niveau'],'A2-B1')
        self.assertEqual(sum(bool(c.get('correct')) for c in q['choix']),1)
        self.assertEqual(q['formes']['lignes']['reponse_modele'],'La certitude')
        self.assertNotIn('qcm_image',q['formes'])

if __name__=='__main__':unittest.main()
