"""Offline replacement tests use temporary fixtures and synthetic audio only.

The fabricated review records below test the evidence schema. They do not attest
that any person listened to a production dialogue or to these synthetic tones.
"""
import copy
import hashlib
import json
import shutil
import struct
import subprocess
import sys
import tempfile
import unittest
import wave
from pathlib import Path
from unittest import mock

import tcf_audio_boundaries as boundaries
import tcf_audio_replacement as replacement


SCRIPT = Path(__file__).with_name('tcf_audio_replacement.py')
OLD = '/lib/audio/tcf/co/ecole/ancien.mp3'
OTHER = '/lib/audio/tcf/co/ecole/autre.mp3'
NEW = '/lib/audio/tcf/co/ecole/accueil.mp3'


def write_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


def tree_hashes(root):
    return {str(path.relative_to(root)): hashlib.sha256(path.read_bytes()).hexdigest()
            for path in root.rglob('*') if path.is_file()}


@unittest.skipUnless(shutil.which('ffmpeg') and shutil.which('ffprobe'), 'ffmpeg et ffprobe requis')
class AudioReplacementTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory(prefix='work-tcf-replacement-test-')
        self.root = Path(self.temporary.name)
        self.repo = self.root / 'repo'
        self.work = self.root / 'work'
        self.repo.mkdir()
        self.work.mkdir()
        self.old_file = self.repo / ('public' + OLD)
        self.other_file = self.repo / ('public' + OTHER)
        self.old_file.parent.mkdir(parents=True)
        self.tone(self.old_file, 440)
        self.tone(self.other_file, 660)
        self.unvalidated_candidate = self.work / 'incoming-unvalidated.mp3'
        self.tone(self.unvalidated_candidate, 880)
        self.mono = {
            'id': 'existing-a1-exercise', 'niveau': 'A0-A1', 'competence': 'CO',
            'type_exercice': 'complet', 'scene': 'Ancienne scène', 'tags': ['court'],
            'support': {'audio': OLD, 'transcription': 'Ancienne transcription.'},
            'questions': [{'enonce': 'Que dit-on ?', 'audio': 1,
                           'type_reponse': 'lignes', 'reponse_modele': 'Bonjour.'}],
        }
        self.multi = {
            'id': 'existing-a2-exercise', 'niveau': 'A1-A2', 'competence': 'CO',
            'type_exercice': 'complet', 'tags': ['moyen'],
            'support': {'audios': [OTHER, OLD],
                        'transcription': ['Ne pas modifier.', 'Ancienne transcription.']},
            'questions': [{'enonce': 'Question 1', 'audio': 1, 'type_reponse': 'lignes'},
                          {'enonce': 'Question 2', 'audio': 2, 'type_reponse': 'lignes'}],
        }
        self.bank = self.repo / 'src/tcf/content'
        for folder, exercises in [('a0-a1', [self.mono]), ('a1-a2', [self.multi]), ('a2-b1', [])]:
            for competence in ('ce', 'co', 'pe', 'po'):
                write_json(self.bank / folder / f'{competence}.json',
                           exercises if competence == 'co' else [])
        write_json(self.bank / 'audio-durations.json', {OLD: 1.0, OTHER: 1.0})
        write_json(self.bank / 'co-reviewed-pools.json',
                   {OLD: {'tag': 'court', 'questions': 1}, OTHER: {'tag': 'moyen', 'questions': 2}})
        write_json(self.repo / 'scripts/historical-audit.json', {'audio': OLD, 'archive': True})
        self.mapping_path = self.root / 'mapping.json'
        self.mapping = {'version': 1, 'replacements': [{
            'dialogue_id': 'dialogue-existant', 'old_refs': [OLD], 'new_ref': NEW,
            'staged_file': str(self.unvalidated_candidate), 'transcription': 'Bonjour, madame.',
            'tags': ['accueil'],
        }]}
        self.save_mapping()

    def tearDown(self):
        self.temporary.cleanup()

    @staticmethod
    def tone(path, frequency):
        subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-n', '-f', 'lavfi',
                        '-i', f'sine=frequency={frequency}:duration=1', '-c:a', 'libmp3lame',
                        '-b:a', '96k', str(path)], check=True, capture_output=True)

    def save_mapping(self):
        write_json(self.mapping_path, self.mapping)

    def invoke(self, *extra):
        return subprocess.run([sys.executable, str(SCRIPT), '--repo', str(self.repo),
                               '--work-dir', str(self.work), *map(str, extra)],
                              capture_output=True, text=True)

    def planned(self, *extra, prepare=False):
        return replacement.run(self.repo, self.work, self.mapping_path,
                               recipe_exports=extra, prepare=prepare)

    def validated_candidate(self):
        """Fabricate unmistakably synthetic evidence to exercise acceptance gates."""
        source = self.work / 'synthetic-original.wav'
        with wave.open(str(source), 'wb') as writer:
            writer.setparams((1, 2, 8000, 0, 'NONE', 'not compressed'))
            writer.writeframes(b''.join(struct.pack('<h', ((n * 137) % 60000) - 30000)
                                        for n in range(24000)))
        plan_path = self.work / 'synthetic-word-plan.json'
        write_json(plan_path, boundaries.example()['plan'])
        path = boundaries.prepare(source, plan_path, self.work)
        manifest = boundaries.read_json(path)
        review = boundaries.review_template(manifest, boundaries.sha256(path))
        review['reviewer'] = 'TEST SYNTHÉTIQUE — aucune écoute humaine réelle'
        review['attestation'] = boundaries.ATTESTATION
        for item in manifest['segments']:
            evidence = review['segments'][item['id']]
            for key, entry in evidence['listening'].items():
                if key == 'full' or item['windows'][key]['available']:
                    entry.update(human_listening=True, listened_at=boundaries.now(),
                                 notes='Observation fabriquée pour le test synthétique.')
                else:
                    entry.update(not_applicable=True, checked_at=boundaries.now(),
                                 notes='Bord de source synthétique constaté.')
            evidence['transcription'] = {'human_checked': True, 'checked_at': boundaries.now(),
                                         'text': item['transcript']}
            evidence['checks'] = dict.fromkeys(boundaries.CHECKS, True)
        review_path = self.work / 'synthetic-review.json'
        write_json(review_path, review)
        validated = boundaries.validate(path, review_path)
        self.mapping['replacements'][0].update(
            staged_file=str(path.parent / manifest['segments'][0]['audio']['path']),
            validated_manifest=str(validated))
        self.save_mapping()
        return validated

    def test_default_plan_has_no_production_writes_and_cannot_promote(self):
        before = tree_hashes(self.repo)
        completed = self.invoke()
        self.assertEqual(completed.returncode, 0, completed.stderr)
        result = json.loads(completed.stdout)
        self.assertIs(result['prepared'], False)
        self.assertIs(result['promotion_ready'], False)
        self.assertTrue(result['blockers'])
        self.assertTrue(Path(result['plan']).is_file())
        self.assertTrue((Path(result['run_dir']) / 'inventory.json').is_file())
        self.assertEqual(tree_hashes(self.repo), before)

    def test_plan_with_mapping_stays_dry_and_lists_both_shared_owners(self):
        before = tree_hashes(self.repo)
        result = self.planned()
        inventory = (Path(result['run_dir']) / 'inventory.json').read_text(encoding='utf-8')
        self.assertIn(self.mono['id'], inventory)
        self.assertIn(self.multi['id'], inventory)
        self.assertIn(replacement.sha256(self.old_file), inventory)
        self.assertIs(result['prepared'], False)
        self.assertEqual(tree_hashes(self.repo), before)

    def test_unsafe_new_url_roots_and_traversal_are_fatal(self):
        for target in ['/lib/audio/parallel/accueil.mp3',
                       '/lib/audio/tcf/co/../../outside.mp3',
                       '/lib/audio/tcf/co/%2e%2e/outside.mp3',
                       '/lib/audio/tcf/co/accueil.mp3?obsolete=1',
                       'https://elsewhere.invalid/audio.mp3']:
            self.mapping['replacements'][0]['new_ref'] = target
            self.save_mapping()
            with self.subTest(target=target):
                completed = self.invoke('--mapping', self.mapping_path)
                self.assertEqual(completed.returncode, 2, completed.stdout + completed.stderr)
        self.assertFalse((self.repo / 'public/lib/audio/parallel').exists())

    def test_work_inside_production_is_rejected(self):
        unsafe = self.repo / 'public/lib/audio/tcf/co/work-promotion'
        completed = subprocess.run([sys.executable, str(SCRIPT), '--repo', str(self.repo),
                                   '--work-dir', str(unsafe)], capture_output=True, text=True)
        self.assertEqual(completed.returncode, 2, completed.stdout + completed.stderr)
        self.assertFalse(unsafe.exists())

    def test_one_to_many_and_duplicate_old_reference_are_rejected(self):
        self.mapping['replacements'][0]['new_ref'] = [NEW, '/lib/audio/tcf/co/ecole/deux.mp3']
        self.save_mapping()
        self.assertEqual(self.invoke('--mapping', self.mapping_path).returncode, 2)
        self.mapping['replacements'][0]['new_ref'] = NEW
        duplicate = copy.deepcopy(self.mapping['replacements'][0])
        duplicate.update(dialogue_id='autre-dialogue', new_ref='/lib/audio/tcf/co/ecole/deux.mp3')
        self.mapping['replacements'].append(duplicate)
        self.save_mapping()
        self.assertEqual(self.invoke('--mapping', self.mapping_path).returncode, 2)

    def test_lfs_pointer_and_corrupt_audio_are_not_integrity_valid(self):
        pointer = self.old_file.parent / 'pointer.mp3'
        pointer.write_text('version https://git-lfs.github.com/spec/v1\noid sha256:' + '0' * 64 + '\nsize 123\n')
        corrupt = self.old_file.parent / 'corrupt.mp3'
        corrupt.write_bytes(b'this is not an audio container')
        result = self.planned()
        inventory = json.loads((Path(result['run_dir']) / 'inventory.json').read_text())
        text = json.dumps(inventory)
        self.assertIn('pointer.mp3', text)
        self.assertIn('corrupt.mp3', text)
        self.assertIs(result['promotion_ready'], False)
        # Neither byte string may be silently copied into a prepared transaction.
        self.assertFalse((Path(result['run_dir']) / 'staged').exists())

    def test_missing_boundary_evidence_blocks_prepare_and_preserves_old_files(self):
        before = tree_hashes(self.repo)
        completed = self.invoke('--mapping', self.mapping_path, '--prepare')
        self.assertEqual(completed.returncode, 2, completed.stdout + completed.stderr)
        if completed.stdout:
            self.assertIs(json.loads(completed.stdout)['prepared'], False)
        self.assertEqual(tree_hashes(self.repo), before)

    def test_prepare_remaps_shared_refs_transcripts_indexes_and_preserves_ids(self):
        self.validated_candidate()
        before = tree_hashes(self.repo)
        result = self.planned(prepare=True)
        self.assertIs(result['prepared'], True)
        self.assertIs(result['promotion_ready'], False)  # no remote D1 evidence or final-MP3 listening
        run = Path(result['run_dir'])
        staged = run / 'staged'
        mono = json.loads((staged / 'src/tcf/content/a0-a1/co.json').read_text())[0]
        multi = json.loads((staged / 'src/tcf/content/a1-a2/co.json').read_text())[0]
        self.assertEqual(mono['id'], self.mono['id'])
        self.assertEqual(multi['id'], self.multi['id'])
        self.assertEqual(mono['support']['audio'], NEW)
        self.assertEqual(mono['support']['transcription'], 'Bonjour, madame.')
        self.assertEqual(multi['support']['audios'], [OTHER, NEW])
        self.assertEqual(multi['support']['transcription'], ['Ne pas modifier.', 'Bonjour, madame.'])
        self.assertEqual([q['audio'] for q in multi['questions']], [1, 2])
        durations = json.loads((staged / 'src/tcf/content/audio-durations.json').read_text())
        reviewed = json.loads((staged / 'src/tcf/content/co-reviewed-pools.json').read_text())
        self.assertNotIn(OLD, durations)
        self.assertIn(NEW, durations)
        self.assertNotIn(OLD, reviewed)
        self.assertIn(NEW, reviewed)
        self.assertTrue((staged / ('public' + NEW)).is_file())
        self.assertFalse((staged / ('public' + OLD)).exists())
        self.assertTrue((run / 'rollback-manifest.json').is_file())
        backup_files = [path for path in (run / 'backups').rglob('*') if path.is_file()]
        self.assertTrue(any(replacement.sha256(path) == replacement.sha256(self.old_file)
                            for path in backup_files))
        self.assertEqual(tree_hashes(self.repo), before)
        self.assertFalse((staged / 'scripts/historical-audit.json').exists())

    def test_recipe_exports_cover_serialized_json_nested_blocks_and_snapshots(self):
        self.validated_candidate()
        recipe = {'version': 1, 'pages': [{
            'domain': 'tcf', 'exerciseType': 'tcf-co-1', 'tcfAudioSlots': [OLD, None],
            'extraBlocks': [{'exerciseType': 'tcf-co-3', 'tcfExercise': copy.deepcopy(self.mono)}],
            'libreItems': [{'tcf': {'kind': 'support', 'exercise': copy.deepcopy(self.mono)}}],
        }], 'libreSnapshot': [{'domain': 'tcf-cfr', 'exerciseType': 'tcf-co-1',
                              'tcfAudioSlots': [OLD]}]}
        export = self.root / 'd1-export.json'
        write_json(export, [{'results': [{'id': 'existing-fiche-id', 'recipe': json.dumps(recipe),
                                         'updated_at': '2026-01-01T00:00:00.000Z'}]}])
        original = export.read_bytes()
        result = self.planned(export, prepare=True)
        delta_path = Path(result['run_dir']) / 'recipe-deltas.json'
        self.assertTrue(delta_path.is_file())
        deltas = json.loads(delta_path.read_text())
        text = json.dumps(deltas, ensure_ascii=False)
        self.assertIn('existing-fiche-id', text)
        self.assertIn('tcfAudioSlots', text)
        self.assertIn('extraBlocks', text)
        self.assertIn('libreItems', text)
        self.assertIn('libreSnapshot', text)
        self.assertIn(NEW, text)
        self.assertEqual(export.read_bytes(), original)

    def test_tampered_validated_candidate_cannot_be_prepared(self):
        self.validated_candidate()
        staged = Path(self.mapping['replacements'][0]['staged_file'])
        with staged.open('ab') as handle:
            handle.write(b'tampered after validation')
        before = tree_hashes(self.repo)
        completed = self.invoke('--mapping', self.mapping_path, '--prepare')
        self.assertEqual(completed.returncode, 2, completed.stdout + completed.stderr)
        self.assertEqual(tree_hashes(self.repo), before)

    def test_runtime_literals_are_protected_but_audit_history_is_separate(self):
        source = self.repo / 'src/another-feature.ts'
        source.write_text(f'export const sharedAudio = {json.dumps(OLD)}\n')
        result = self.planned()
        directory = Path(result['run_dir'])
        inventory = json.loads((directory / 'inventory.json').read_text())
        categories = {item['file']: item['category'] for item in inventory['extra_references']}
        self.assertEqual(categories['src/another-feature.ts'], 'runtime-source')
        self.assertEqual(categories['scripts/historical-audit.json'], 'archive-or-tooling')
        plan = json.loads((directory / 'plan.json').read_text())
        self.assertTrue(any(item['file'] == 'src/another-feature.ts'
                            for item in plan['protected_references']))
        self.assertFalse(any(item['file'] == 'scripts/historical-audit.json'
                             for item in plan['protected_references']))

    def test_mapping_transcript_and_tags_must_match_the_validated_segment(self):
        self.validated_candidate()
        for field, value in [('transcription', 'Texte qui ne correspond pas.'),
                             ('tags', ['autre-scenario'])]:
            original = copy.deepcopy(self.mapping)
            self.mapping['replacements'][0][field] = value
            self.save_mapping()
            with self.subTest(field=field):
                completed = self.invoke('--mapping', self.mapping_path, '--prepare')
                self.assertEqual(completed.returncode, 2, completed.stdout + completed.stderr)
                self.assertIs(json.loads(completed.stdout)['prepared'], False)
            self.mapping = original
            self.save_mapping()

    def test_audio_symlink_target_is_not_hashed_or_probed(self):
        link = self.old_file.parent / 'external-link.mp3'
        link.symlink_to(self.unvalidated_candidate)
        real_sha256 = replacement.sha256
        real_probe = replacement.probe
        def guarded_sha256(path):
            self.assertFalse(Path(path).is_symlink(), 'A symlink target must not be read for hashing')
            return real_sha256(path)
        def guarded_probe(path, *args, **kwargs):
            self.assertFalse(Path(path).is_symlink(), 'A symlink target must not be probed')
            return real_probe(path, *args, **kwargs)
        with mock.patch.object(replacement, 'sha256', side_effect=guarded_sha256), \
                mock.patch.object(replacement, 'probe', side_effect=guarded_probe):
            inventory = replacement.inventory(self.repo)
        row = next(item for item in inventory['files'] if item['path'].endswith('external-link.mp3'))
        self.assertEqual(row['integrity'], 'invalid')
        self.assertNotIn('sha256', row)

    def test_bank_symlink_is_rejected_before_json_read(self):
        link = self.bank / 'a2-b1/co.json'
        link.unlink()
        external = self.work / 'external-bank.json'
        write_json(external, [])
        link.symlink_to(external)
        real_read_json = replacement.read_json
        def guarded_read(path):
            self.assertFalse(Path(path).is_symlink(), 'A symlink bank must not be read')
            return real_read_json(path)
        with mock.patch.object(replacement, 'read_json', side_effect=guarded_read):
            with self.assertRaises(replacement.ReplacementError):
                replacement.inventory(self.repo)


class JsonPointerTests(unittest.TestCase):
    def test_json_pointer_escapes_keys_for_reversible_deltas(self):
        before = {'a/b': {'x~y': OLD}}
        after = {'a/b': {'x~y': NEW}}
        self.assertEqual(replacement.deltas(before, after),
                         [{'op': 'replace', 'path': '/a~1b/x~0y', 'old': OLD, 'value': NEW}])

    def test_d1_evidence_checks_unique_ids_and_exact_export_hash(self):
        """Schema-only fake evidence does not assert a real remote database export."""
        with tempfile.TemporaryDirectory(prefix='work-tcf-db-test-') as temporary:
            root = Path(temporary)
            export = root / 'export.json'
            proof = root / 'synthetic-db-evidence.json'
            row = {'id': 'same-fiche', 'recipe': {'version': 1, 'pages': []},
                   'updated_at': '2026-01-01T00:00:00.000Z'}
            for rows in ([row], [row, copy.deepcopy(row)]):
                payload = [{'results': rows}]
                write_json(export, payload)
                _, delta = replacement.patch_export(payload, [])
                evidence = {'version': 1, 'kind': 'cloudflare-d1-remote-export',
                            'database': 'clairfle-fiches', 'complete': True,
                            'reviewer': 'TEST SYNTHÉTIQUE — aucun export distant réel',
                            'total_rows': len(rows), 'export_file': str(export),
                            'export_sha256': replacement.sha256(export),
                            'exported_at': replacement.now()}
                write_json(proof, evidence)
                entries = [{'input': str(export), 'deltas': delta}]
                if len(rows) == 1:
                    accepted = replacement.verify_db_evidence(proof, entries)
                    self.assertIs(accepted['remote_contact_by_tool'], False)
                    export.write_text('[]\n')
                    with self.assertRaises(replacement.ReplacementError):
                        replacement.verify_db_evidence(proof, entries)
                else:
                    with self.assertRaisesRegex(replacement.ReplacementError, 'dupliqu'):
                        replacement.verify_db_evidence(proof, entries)


if __name__ == '__main__':
    unittest.main()
