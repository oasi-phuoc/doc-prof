"""Synthetic discovery regressions; no listening validation is implied."""
import hashlib
import json
from pathlib import Path
import subprocess
import tempfile
import unittest
from unittest.mock import patch

import numpy as np

from audio_replacement.fingerprint_sources import (
    RATE, cache_landmarks, decode, discover, landmarks, make_index, unique_sources,
)
from audio_replacement.verify_recording_discovery import classify_internal_edits, compare_candidate, compare_at_offset


def synthetic_recording(seed, seconds=14):
    rng = np.random.default_rng(seed)
    sample_count = int(RATE*seconds)
    samples = np.zeros(sample_count, dtype=np.float32)
    for start in range(0, sample_count, 1600):
        count = min(1600, sample_count-start)
        t = np.arange(count)/RATE
        frequencies = rng.choice(np.arange(220, 3000, 75), size=4, replace=False)
        tone = sum(np.sin(2*np.pi*f*t+rng.uniform(0, 6.28)) for f in frequencies)
        samples[start:start+count] = tone*np.hanning(count)*.08
    return samples


class FingerprintTests(unittest.TestCase):
    def test_seed_disambiguates_repeated_recording_but_still_requires_three_anchors(self):
        recording = synthetic_recording(33)
        source = np.concatenate([recording, np.zeros(2*RATE), recording])
        module='audio_replacement.verify_recording_discovery.'
        with patch(module+'decode', side_effect=lambda name: recording if name=='old' else source):
            result=compare_at_offset('old','source',16)
        self.assertEqual(result['status'],'signal_source_confirmed')
        self.assertEqual(len(result['anchors']),3)
        self.assertAlmostEqual(result['source_offset_seconds'],16,places=3)
        self.assertFalse(result['listening_performed'])

    def test_fingerprint_offset_cannot_confirm_unrelated_audio(self):
        old=synthetic_recording(33);source=synthetic_recording(93)
        module='audio_replacement.verify_recording_discovery.'
        with patch(module+'decode', side_effect=lambda name: old if name=='old' else source):
            result=compare_at_offset('old','source',0)
        self.assertEqual(result['status'],'signal_not_confirmed')

    def test_edited_recording_is_not_a_validated_replacement(self):
        result = classify_internal_edits(dict(status='signal_not_confirmed', anchors=[
            dict(correlation=.98, source_anchor_start=5),
            dict(correlation=.99, source_anchor_start=34),
            dict(correlation=.97, source_anchor_start=72)]))
        self.assertEqual(result['status'], 'signal_source_shared_with_internal_edits')
        self.assertFalse(result['replacement_compatibility_validated'])
        self.assertTrue(result['requires_explicit_segment_or_assembly_assignment'])

    def test_weak_or_reordered_anchors_cannot_confirm_edited_source(self):
        for scores, times in [([.98,.79,.99],[4,30,60]),([.99]*3,[30,4,60]),([.99]*2,[4,30])]:
            result = classify_internal_edits(dict(status='signal_not_confirmed', anchors=[
                dict(correlation=score, source_anchor_start=timestamp) for score,timestamp in zip(scores,times)]))
            self.assertEqual(result['status'], 'signal_not_confirmed')

    def test_weak_mandatory_anchor_cannot_confirm_or_require_other_correlations(self):
        module = 'audio_replacement.verify_recording_discovery.'
        samples = synthetic_recording(9)
        with patch(module+'decode', return_value=samples), \
             patch(module+'decode_coarse', return_value=samples), \
             patch(module+'best_correlation', return_value=(0, .79)), \
             patch(module+'compare') as full:
            result = compare_candidate('synthetic-old', 'synthetic-source')
        self.assertEqual(result['status'], 'signal_not_confirmed')
        self.assertFalse(result['listening_performed'])
        full.assert_not_called()

    def test_strong_first_anchor_still_requires_original_full_comparison(self):
        module = 'audio_replacement.verify_recording_discovery.'
        samples = synthetic_recording(9)
        with patch(module+'decode', return_value=samples), \
             patch(module+'decode_coarse', return_value=samples), \
             patch(module+'best_correlation', return_value=(0, .99)), \
             patch(module+'compare', return_value={'status': 'signal_not_confirmed'}) as full:
            result = compare_candidate('synthetic-old', 'synthetic-source')
        self.assertEqual(result['status'], 'signal_not_confirmed')
        full.assert_called_once()

    def test_coarse_rejection_is_never_presented_as_full_waveform_comparison(self):
        module = 'audio_replacement.verify_recording_discovery.'
        samples = synthetic_recording(9)
        with patch(module+'decode', return_value=samples) as high_resolution, \
             patch(module+'decode_coarse', return_value=samples), \
             patch(module+'best_correlation', return_value=(0, .1)), \
             patch(module+'compare') as full:
            result = compare_candidate('synthetic-old', 'synthetic-source')
        self.assertEqual(result['status'], 'coarse_signal_candidate_rejected')
        self.assertFalse(result['full_8khz_comparison_performed'])
        self.assertFalse(result['listening_performed'])
        self.assertEqual(high_resolution.call_count, 1)
        full.assert_not_called()

    def test_gain_noise_and_cut_offset_recover_recording_without_transcript(self):
        sources = [synthetic_recording(seed) for seed in (11, 37, 93)]
        index = make_index([landmarks(s) for s in sources])
        query = sources[1][17337:81337]*.3
        query += np.random.default_rng(4).normal(0, 1e-5, len(query))
        ranked = discover(landmarks(query), index, keep=3)
        self.assertEqual(ranked[0]['source_index'], 1)
        self.assertAlmostEqual(ranked[0]['approximate_source_offset_seconds'], 17337/RATE, delta=.2)
        self.assertEqual(ranked[0]['status'], 'fingerprint_candidate_not_waveform_confirmed')

    def test_mp3_reencoding_preserves_discovery(self):
        source = synthetic_recording(141)
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder)/'synthetic-cut.mp3'
            subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-f', 'f32le',
                            '-ar', str(RATE), '-ac', '1', '-i', '-', '-c:a', 'libmp3lame',
                            '-b:a', '32k', str(path)], input=source[12117:84117].tobytes(), check=True)
            index = make_index([landmarks(synthetic_recording(19)), landmarks(source)])
            ranked = discover(landmarks(decode(path)), index)
            self.assertEqual(ranked[0]['source_index'], 1)
            self.assertGreater(ranked[0]['landmark_votes'], 20)

    def test_silence_does_not_create_evidence(self):
        empty = landmarks(np.zeros(RATE*4, dtype=np.float32))
        self.assertEqual(len(empty), 0)
        self.assertEqual(discover(empty, make_index([landmarks(synthetic_recording(9))])), [])

    def test_changed_bytes_cannot_reuse_cached_fingerprint(self):
        with tempfile.TemporaryDirectory() as folder:
            directory = Path(folder)
            source = directory/'source.mp3'
            source.write_bytes(b'synthetic inventory bytes')
            expected = hashlib.sha256(source.read_bytes()).hexdigest()
            from audio_replacement.fingerprint_sources import VERSION
            cache = directory/(expected+'-'+VERSION+'.npz')
            np.savez_compressed(cache, landmarks=np.empty((0, 2), dtype=np.uint32))
            source.write_bytes(b'changed bytes')
            with self.assertRaisesRegex(ValueError, 'differ from inventory'):
                cache_landmarks(source, expected, directory)

    def test_receipt_aliases_are_kept_when_analysis_is_shared(self):
        with tempfile.TemporaryDirectory() as folder:
            paths = [Path(folder)/'first.json', Path(folder)/'second.json']
            for path, source_id in zip(paths, ('first:001', 'second:006')):
                path.write_text(json.dumps({'sources': [dict(source_id=source_id, sha256='same-bytes')]}))
            sources = unique_sources(paths)
            self.assertEqual(len(sources), 1)
            self.assertEqual(sources[0]['receipt_aliases'], ['first:001', 'second:006'])


if __name__ == '__main__':
    unittest.main()
