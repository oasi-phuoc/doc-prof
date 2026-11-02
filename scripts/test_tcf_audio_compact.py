"""Synthetic PCM integrity checks; no real audio listening is attested."""
import copy
import hashlib
import shutil
import struct
import tempfile
import unittest
import wave
from pathlib import Path

from tcf_audio_compact import CompactAudioError, inspect_pcm, prepare_compact, verify_compact


@unittest.skipUnless(shutil.which('ffmpeg') and shutil.which('ffprobe'), 'ffmpeg et ffprobe requis')
class CompactFlacTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory(prefix='work-compact-flac-')
        self.root = Path(self.temporary.name)
        self.info = {'sample_rate': 8000, 'channels': 1}
        self.frames = b''.join(struct.pack('<h', ((index * 137) % 60000) - 30000) for index in range(24000))
        self.source = self.root / 'source ; $(unexecuted).wav'
        self.write_source()

    def write_source(self):
        with wave.open(str(self.source), 'wb') as writer:
            writer.setparams((self.info['channels'], 2, self.info['sample_rate'], 0, 'NONE', 'not compressed'))
            writer.writeframes(self.frames)

    def tearDown(self):
        self.temporary.cleanup()

    def plans(self):
        return [{'id': 'test', 'start_frame': 6400, 'end_frame': 13600, 'status': 'candidate'}]

    def prepared(self, segments=None):
        segments = self.plans() if segments is None else segments
        run = self.root / ('run-' + str(len(list(self.root.glob('run-*')))))
        run.mkdir()
        decoded = inspect_pcm(self.source, self.info)
        metadata = prepare_compact(self.source, run, self.info, segments, decoded)
        return run, segments, metadata

    def test_streaming_source_hash_matches_pcm_without_source_copy(self):
        decoded = inspect_pcm(self.source, self.info)
        self.assertEqual(decoded['decoded_frames'], 24000)
        self.assertEqual(decoded['decoded_duration'], 3)
        self.assertEqual(decoded['decoded_pcm_sha256'], hashlib.sha256(self.frames).hexdigest())
        run, segments, metadata = self.prepared()
        self.assertEqual(metadata['storage_mode'], 'compact_flac')
        self.assertFalse(list(run.glob('*.wav')))
        self.assertFalse(list(run.glob('*.pcm')))
        self.assertEqual(len(list(run.rglob('*.flac'))), 5)
        audio = segments[0]['audio']
        self.assertEqual(audio['pcm_sha256'], hashlib.sha256(self.frames[6400*2:13600*2]).hexdigest())
        self.assertEqual(audio['frames'], 7200)
        self.assertEqual(audio['encoding'], 'flac')
        self.assertEqual(segments[0]['status'], 'needs_review')
        self.assertTrue((run / segments[0]['waveform']['path']).is_file())
        verify_compact(self.source, self.info, segments, run, metadata['decoded_pcm_sha256'])

    def test_stereo_preserves_each_channel_in_interleaved_pcm(self):
        self.info['channels'] = 2
        self.frames = b''.join(struct.pack('<hh', index % 32000, -index % 31000) for index in range(24000))
        self.write_source()
        run, segments, metadata = self.prepared()
        self.assertEqual(segments[0]['audio']['pcm_sha256'], hashlib.sha256(self.frames[6400*4:13600*4]).hexdigest())
        verify_compact(self.source, self.info, segments, run, metadata['decoded_pcm_sha256'])

    def test_source_edges_are_explicitly_unavailable_windows(self):
        run, segments, metadata = self.prepared([{'id': 'all', 'start_frame': 0, 'end_frame': 24000}])
        windows = segments[0]['windows']
        self.assertEqual(windows['start_before'], {'available': False, 'start_frame': 0, 'end_frame': 0, 'reason': 'source_start'})
        self.assertEqual(windows['end_after'], {'available': False, 'start_frame': 24000, 'end_frame': 24000, 'reason': 'source_end'})
        self.assertEqual(len(list(run.rglob('*.flac'))), 3)
        verify_compact(self.source, self.info, segments, run, metadata['decoded_pcm_sha256'])

    def test_wrong_source_or_candidate_pcm_hash_refuses_integrity(self):
        run, segments, metadata = self.prepared()
        with self.assertRaisesRegex(CompactAudioError, 'source compact modifié'):
            verify_compact(self.source, self.info, segments, run, '0' * 64)
        segments[0]['audio']['pcm_sha256'] = '0' * 64
        with self.assertRaisesRegex(CompactAudioError, 'PCM FLAC différent'):
            verify_compact(self.source, self.info, segments, run, metadata['decoded_pcm_sha256'])

    def test_flac_modified_or_source_changed_during_preparation_is_refused(self):
        run, segments, metadata = self.prepared()
        with (run / segments[0]['audio']['path']).open('ab') as handle:
            handle.write(b'changed')
        with self.assertRaisesRegex(CompactAudioError, 'FLAC de contrôle modifié'):
            verify_compact(self.source, self.info, segments, run, metadata['decoded_pcm_sha256'])
        decoded = inspect_pcm(self.source, self.info)
        decoded['decoded_pcm_sha256'] = '0' * 64
        second = self.root / 'run-changed'
        second.mkdir()
        with self.assertRaisesRegex(CompactAudioError, 'entre inspection'):
            prepare_compact(self.source, second, self.info, self.plans(), decoded)

    def test_many_short_candidates_stream_exact_slices(self):
        segments = [{'id': f'test-{index}', 'start_frame': index*2000, 'end_frame': (index+1)*2000}
                    for index in range(12)]
        run, segments, metadata = self.prepared(segments)
        for item in segments:
            wanted = self.frames[item['start_frame']*2:item['end_frame']*2]
            self.assertEqual(item['audio']['pcm_sha256'], hashlib.sha256(wanted).hexdigest())
        verify_compact(self.source, self.info, segments, run, metadata['decoded_pcm_sha256'])

    def test_no_overwrite_and_no_path_traversal_or_symlinks(self):
        run, segments, metadata = self.prepared()
        with self.assertRaisesRegex(CompactAudioError, 'déjà présent'):
            prepare_compact(self.source, run, self.info, self.plans(), metadata)
        bad = self.root / 'run-bad'
        bad.mkdir()
        plans = self.plans()
        plans[0]['id'] = '../../public/lib/audio/x'
        with self.assertRaisesRegex(CompactAudioError, 'Identifiant'):
            prepare_compact(self.source, bad, self.info, plans, metadata)
        link = self.root / 'work-link'
        link.symlink_to(run, target_is_directory=True)
        with self.assertRaisesRegex(CompactAudioError, 'symbolique'):
            prepare_compact(self.source, link, self.info, self.plans(), metadata)


if __name__ == '__main__':
    unittest.main()
