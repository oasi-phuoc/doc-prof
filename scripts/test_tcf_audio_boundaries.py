"""Synthetic signal tests only; these do not attest any human audio listening."""
import copy
import datetime as dt
import json
import math
import shutil
import struct
import tempfile
import unittest
import wave
from pathlib import Path

from tcf_audio_boundaries import (ATTESTATION, CHECKS, BoundaryError, example, make_windows,
                                  now, plan_segments, prepare, read_json, review_template,
                                  safe_artifact, safe_work, sha256, validate, validate_review,
                                  verify_integrity, write_json)


class WordBoundaryPlanTests(unittest.TestCase):
    def setUp(self):
        self.plan = example()['plan']

    def test_glued_numbering_is_excluded_without_a_silence(self):
        segment = plan_segments(self.plan, 3, 8000)[0]
        self.assertEqual((segment['start_frame'], segment['end_frame']), (6400, 13600))
        self.assertEqual(segment['actual_margins_ms'], [0, 0])
        self.assertEqual(segment['transcript'], 'Bonjour, madame.')
        self.assertEqual(segment['status'], 'candidate')

    def test_margins_stop_at_neighbor_speech_instead_of_taking_the_number(self):
        self.plan['words'][1]['end'] = .77
        self.plan['words'][4]['start'] = 1.74
        segment = plan_segments(self.plan, 3, 8000)[0]
        self.assertEqual((segment['start_frame'], segment['end_frame']), (6160, 13920))
        self.assertAlmostEqual(segment['actual_margins_ms'][0], 30)
        self.assertAlmostEqual(segment['actual_margins_ms'][1], 40)

    def test_subsample_gap_cannot_be_rounded_into_a_word(self):
        self.plan['words'][1]['end'] = .80001
        self.plan['words'][2]['start'] = .80002
        with self.assertRaisesRegex(BoundaryError, 'échantillon'):
            plan_segments(self.plan, 3, 8000)

    def test_joined_token_must_be_realigned_and_announcements_cannot_be_selected(self):
        self.plan['words'][2]['text'] = 'Document2.Bonjour'
        with self.assertRaisesRegex(BoundaryError, 'fusionné'):
            plan_segments(self.plan, 3, 8000)
        self.plan = example()['plan']
        self.plan['segments'][0]['first_word'] = 1
        with self.assertRaisesRegex(BoundaryError, 'numérotation'):
            plan_segments(self.plan, 3, 8000)

    def test_decimal_frequency_and_time_are_not_fused_announcements(self):
        for value in ('103.2', '12:30', '09/03/2024'):
            plan = copy.deepcopy(self.plan)
            plan['words'][2]['text'] = value
            plan['segments'][0]['transcript'] = value + ' madame.'
            with self.subTest(value=value):
                self.assertEqual(plan_segments(plan, 3, 8000)[0]['first_word_text'], value)

    def test_overlapping_words_and_reused_ranges_are_ambiguous(self):
        self.plan['words'][2]['start'] = .79
        with self.assertRaisesRegex(BoundaryError, 'chevauché'):
            plan_segments(self.plan, 3, 8000)
        self.plan = example()['plan']
        other = copy.deepcopy(self.plan['segments'][0])
        other['id'] = 'autre-dialogue'
        self.plan['segments'].append(other)
        with self.assertRaisesRegex(BoundaryError, 'partagés'):
            plan_segments(self.plan, 3, 8000)

    def test_invalid_numbers_indices_transcript_ids_and_margins_are_rejected(self):
        for value in (True, float('nan'), float('inf'), -1):
            plan = copy.deepcopy(self.plan)
            plan['words'][2]['start'] = value
            with self.subTest(value=value), self.assertRaises(BoundaryError):
                plan_segments(plan, 3, 8000)
        for key, value in [('first_word', True), ('first_word', -1), ('last_word', 99),
                           ('transcript', 'Bonjour, monsieur.'), ('id', '../../public/lib/audio/x'),
                           ('margin_after_ms', 1000), ('margin_before_ms', -1)]:
            plan = copy.deepcopy(self.plan)
            plan['segments'][0][key] = value
            with self.subTest(key=key, value=value), self.assertRaises(BoundaryError):
                plan_segments(plan, 3, 8000)

    def test_known_uncertainty_is_carried_into_candidate(self):
        self.plan['segments'][0]['boundary_uncertainty'] = ['Début à confirmer.']
        self.plan['words'][2]['confidence'] = .5
        self.assertEqual(len(plan_segments(self.plan, 3, 8000)[0]['uncertainties']), 2)

    def test_uncertain_neighbor_timestamps_also_block_the_boundary(self):
        self.plan['words'][1]['uncertain'] = True
        self.plan['words'][4]['confidence'] = .3
        segment = plan_segments(self.plan, 3, 8000)[0]
        self.assertEqual(len(segment['uncertainties']), 2)
        self.assertIn('indice 1', segment['uncertainties'][0])
        self.assertIn('indice 4', segment['uncertainties'][1])

    def test_decimal_timestamps_at_exact_samples_are_not_false_subsample_gaps(self):
        for boundary, rate in [(.07, 44100), (.009, 48000)]:
            plan = {'schema_version': 1, 'words': [
                {'text': 'Deux.', 'start': 0, 'end': boundary, 'kind': 'announcement'},
                {'text': 'Bonjour.', 'start': boundary, 'end': .5, 'kind': 'dialogue'}],
                'segments': [{'id': 'bord', 'name': 'Bord', 'tags': ['test'], 'first_word': 1,
                              'last_word': 1, 'transcript': 'Bonjour.'}]}
            with self.subTest(boundary=boundary, rate=rate):
                self.assertEqual(plan_segments(plan, 1, rate)[0]['start_frame'], round(boundary * rate))

    def test_contexts_at_source_edges_are_empty_without_invented_frames(self):
        windows = make_windows(0, 24000, 24000, 8000)
        self.assertEqual(windows['start_before'], (0, 0))
        self.assertEqual(windows['end_after'], (24000, 24000))
        self.assertEqual(windows['start_after'], (0, 16000))
        self.assertEqual(windows['end_before'], (8000, 24000))


@unittest.skipUnless(shutil.which('ffmpeg') and shutil.which('ffprobe'), 'ffmpeg et ffprobe requis')
class SyntheticAudioPreparationTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory(prefix='work-tcf-boundaries-')
        self.work = Path(self.temporary.name)
        self.source = self.work / 'original ; $(unexecuted).wav'
        self.source_frames = b''.join(struct.pack('<h', ((index * 137) % 60000) - 30000) for index in range(24000))
        with wave.open(str(self.source), 'wb') as writer:
            writer.setparams((1, 2, 8000, 0, 'NONE', 'not compressed'))
            writer.writeframes(self.source_frames)
        self.plan = example()['plan']
        self.plan_path = self.work / 'input-plan.json'
        write_json(self.plan_path, self.plan)

    def tearDown(self):
        self.temporary.cleanup()

    def prepared(self):
        path = prepare(self.source, self.plan_path, self.work)
        return path, read_json(path)

    def test_compact_manifest_verifies_exact_flac_and_rejects_changed_boundaries(self):
        path = prepare(self.source, self.plan_path, self.work, compact=True)
        manifest = read_json(path)
        self.assertEqual(manifest['decoded_source']['storage_mode'], 'compact_flac')
        self.assertEqual(manifest['segments'][0]['audio']['frames'], 7200)
        self.assertFalse((path.parent / 'source-pcm.wav').exists())
        verify_integrity(manifest, path.parent)
        changed = copy.deepcopy(manifest)
        changed['segments'][0]['start_frame'] += 1
        with self.assertRaisesRegex(BoundaryError, 'start_frame'):
            verify_integrity(changed, path.parent)
        changed = copy.deepcopy(manifest)
        changed['segments'][0]['windows']['end_after']['end_frame'] -= 1
        with self.assertRaisesRegex(BoundaryError, 'Fenêtre'):
            verify_integrity(changed, path.parent)

    def synthetic_evidence(self, manifest, digest):
        """Fabricate explicit schema evidence for tests, never for actual audio."""
        review = review_template(manifest, digest)
        review['reviewer'] = 'TEST SYNTHÉTIQUE — aucune écoute humaine réelle'
        review['attestation'] = ATTESTATION
        timestamp = now()
        for item in manifest['segments']:
            evidence = review['segments'][item['id']]
            for key, entry in evidence['listening'].items():
                if key == 'full' or item['windows'][key]['available']:
                    entry.update(human_listening=True, listened_at=timestamp, notes='Observation synthétique de test.')
                else:
                    entry.update(not_applicable=True, checked_at=timestamp, notes='Bord source synthétique constaté.')
            evidence['transcription'] = {'human_checked': True, 'checked_at': timestamp, 'text': item['transcript']}
            evidence['checks'] = dict.fromkeys(CHECKS, True)
        return review

    def test_pcm_cut_is_exact_and_review_template_never_claims_listening(self):
        path, manifest = self.prepared()
        self.assertEqual(manifest['status'], 'needs_review')
        item = manifest['segments'][0]
        with wave.open(str(path.parent / item['audio']['path']), 'rb') as reader:
            self.assertEqual(reader.getnframes(), 7200)
            self.assertEqual(reader.getsampwidth(), 2)
            self.assertEqual(reader.readframes(7200), self.source_frames[6400*2:13600*2])
        template = read_json(path.parent / 'review-template.json')
        for entry in template['segments'][item['id']]['listening'].values():
            self.assertIs(entry['human_listening'], False)
        with self.assertRaisesRegex(BoundaryError, 'vérificateur'):
            validate_review(manifest, template, sha256(path))
        self.assertTrue((path.parent / 'review.html').is_file())
        self.assertTrue((path.parent / item['waveform']['path']).is_file())
        verify_integrity(manifest, path.parent)

    def test_candidate_plan_has_no_audio_and_cannot_be_validated(self):
        path = prepare(self.source, self.plan_path, self.work, candidate_only=True)
        manifest = read_json(path)
        self.assertEqual(manifest['status'], 'candidate')
        self.assertNotIn('audio', manifest['segments'][0])
        with self.assertRaisesRegex(BoundaryError, 'needs_review'):
            verify_integrity(manifest, path.parent)

    def test_complete_explicit_test_evidence_produces_separate_validation_record(self):
        path, manifest = self.prepared()
        evidence = self.synthetic_evidence(manifest, sha256(path))
        evidence_path = self.work / 'synthetic-review.json'
        write_json(evidence_path, evidence)
        output = validate(path, evidence_path)
        result = read_json(output)
        self.assertEqual(result['status'], 'validated')
        self.assertEqual(read_json(path)['status'], 'needs_review')
        self.assertEqual(result['validation']['human_evidence'], evidence)
        self.assertNotEqual(path, output)

    def test_one_missing_listening_or_false_quality_check_refuses_validation(self):
        path, manifest = self.prepared()
        evidence = self.synthetic_evidence(manifest, sha256(path))
        identifier = manifest['segments'][0]['id']
        for key in (*manifest['segments'][0]['windows'], 'full'):
            invalid = copy.deepcopy(evidence)
            invalid['segments'][identifier]['listening'][key]['human_listening'] = False
            with self.subTest(window=key), self.assertRaises(BoundaryError):
                validate_review(manifest, invalid, sha256(path))
        invalid = copy.deepcopy(evidence)
        invalid['segments'][identifier]['checks']['last_word_complete'] = False
        with self.assertRaisesRegex(BoundaryError, 'incomplet'):
            validate_review(manifest, invalid, sha256(path))

    def test_changed_transcript_stale_manifest_or_automated_boolean_are_insufficient(self):
        path, manifest = self.prepared()
        evidence = self.synthetic_evidence(manifest, sha256(path))
        identifier = manifest['segments'][0]['id']
        invalid = copy.deepcopy(evidence)
        invalid['segments'][identifier]['transcription']['text'] = 'Bonjour, monsieur.'
        with self.assertRaisesRegex(BoundaryError, 'transcription'):
            validate_review(manifest, invalid, sha256(path))
        with self.assertRaisesRegex(BoundaryError, 'manifeste exact'):
            validate_review(manifest, evidence, '0' * 64)
        invalid = copy.deepcopy(evidence)
        invalid['segments'][identifier]['listening']['full'] = {'listened': True}
        with self.assertRaises(BoundaryError):
            validate_review(manifest, invalid, sha256(path))

    def test_positive_checks_do_not_override_uncertainty(self):
        self.plan['segments'][0]['boundary_uncertainty'] = ['Consonne initiale douteuse.']
        self.plan_path.write_text(json.dumps(self.plan), encoding='utf-8')
        path, manifest = self.prepared()
        evidence = self.synthetic_evidence(manifest, sha256(path))
        with self.assertRaisesRegex(BoundaryError, 'incertitude'):
            validate_review(manifest, evidence, sha256(path))

    def test_modified_wav_plan_source_or_metadata_cannot_pass_integrity(self):
        path, manifest = self.prepared()
        audio = path.parent / manifest['segments'][0]['audio']['path']
        with audio.open('ab') as handle:
            handle.write(b'changed')
        with self.assertRaisesRegex(BoundaryError, 'modifié'):
            verify_integrity(manifest, path.parent)
        path, manifest = self.prepared()
        manifest['segments'][0]['start_frame'] += 1
        with self.assertRaisesRegex(BoundaryError, 'métadonnée'):
            verify_integrity(manifest, path.parent)
        path, manifest = self.prepared()
        (path.parent / 'plan.json').write_text('{}', encoding='utf-8')
        with self.assertRaisesRegex(BoundaryError, 'Plan modifié'):
            verify_integrity(manifest, path.parent)
        path, manifest = self.prepared()
        with self.source.open('ab') as handle:
            handle.write(b'changed')
        with self.assertRaisesRegex(BoundaryError, 'Source modifiée'):
            verify_integrity(manifest, path.parent)

    def test_source_edges_require_explicit_na_instead_of_impossible_listening(self):
        self.plan = {'schema_version': 1, 'words': [
            {'text': 'Bonjour.', 'start': 0, 'end': 3, 'kind': 'dialogue'}],
            'segments': [{'id': 'bord', 'name': 'Bord', 'tags': ['test'], 'first_word': 0,
                          'last_word': 0, 'transcript': 'Bonjour.'}]}
        self.plan_path.write_text(json.dumps(self.plan), encoding='utf-8')
        path, manifest = self.prepared()
        item = manifest['segments'][0]
        self.assertIs(item['windows']['start_before']['available'], False)
        self.assertIs(item['windows']['end_after']['available'], False)
        evidence = self.synthetic_evidence(manifest, sha256(path))
        validate_review(manifest, evidence, sha256(path))
        evidence['segments']['bord']['listening']['start_before']['human_listening'] = True
        with self.assertRaisesRegex(BoundaryError, 'bord source'):
            validate_review(manifest, evidence, sha256(path))

    def test_review_events_must_postdate_preparation(self):
        path, manifest = self.prepared()
        evidence = self.synthetic_evidence(manifest, sha256(path))
        identifier = manifest['segments'][0]['id']
        evidence['segments'][identifier]['listening']['full']['listened_at'] = '2020-01-01T00:00:00+00:00'
        with self.assertRaises(BoundaryError):
            validate_review(manifest, evidence, sha256(path))

    def test_window_with_rewritten_hash_still_must_contain_expected_source_frames(self):
        path, manifest = self.prepared()
        window = manifest['segments'][0]['windows']['start_before']
        artifact = path.parent / window['path']
        with wave.open(str(artifact), 'rb') as reader:
            params = reader.getparams()
            frames = reader.readframes(reader.getnframes())
        with wave.open(str(artifact), 'wb') as writer:
            writer.setparams(params)
            writer.writeframes(b'\0' * len(frames))
        window['sha256'] = sha256(artifact)
        with self.assertRaisesRegex(BoundaryError, 'PCM contrôle différent'):
            verify_integrity(manifest, path.parent)

    def test_outputs_reject_production_paths_traversal_and_symlink_workdirs(self):
        for directory in ('/workspace/doc-prof/public/lib/audio/tcf/co/work-x', '/workspace/doc-prof/scripts'):
            with self.subTest(directory=directory), self.assertRaises(BoundaryError):
                safe_work(directory)
        symlink = self.work / 'work-link'
        symlink.symlink_to(self.work, target_is_directory=True)
        with self.assertRaisesRegex(BoundaryError, 'symbolique'):
            safe_work(symlink)
        for relative in ('../../public/lib/audio/x.wav', '/tmp/x.wav', '..\\x.wav'):
            with self.subTest(relative=relative), self.assertRaises(BoundaryError):
                safe_artifact(self.work, relative)


if __name__ == '__main__':
    unittest.main()
