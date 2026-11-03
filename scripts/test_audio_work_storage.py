"""Storage sharing must retain every path and may never cross source recordings."""
import hashlib
import os
from pathlib import Path
import tempfile
import unittest
from audio_replacement.share_work_artifacts import WorkArtifactStore


class WorkStorageTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix='work-storage-')
        self.root = Path(self.temp.name) / 'staged-boundaries-work'
        self.root.mkdir()
        self.store = WorkArtifactStore([self.root], self.root / 'sharing.jsonl')
        self.digest = hashlib.sha256(b'generated-only').hexdigest()

    def tearDown(self):
        self.temp.cleanup()

    def candidate(self, name):
        path = self.root / name
        path.write_bytes(b'generated-only')
        return path

    def test_identical_working_files_retain_both_paths_and_bytes(self):
        first, second = self.candidate('one.flac'), self.candidate('two.flac')
        self.store.share(first, 'a'*64, self.digest)
        self.store.share(second, 'a'*64, self.digest)
        self.assertTrue(first.exists() and second.exists())
        self.assertTrue(os.path.samefile(first, second))
        self.assertEqual(second.read_bytes(), b'generated-only')

    def test_distinct_sources_and_original_paths_are_never_shared(self):
        first, second = self.candidate('one.flac'), self.candidate('two.flac')
        self.store.share(first, 'a'*64, self.digest)
        self.store.share(second, 'b'*64, self.digest)
        self.assertFalse(os.path.samefile(first, second))
        source = Path(self.temp.name) / 'original.mp3'
        source.write_bytes(b'generated-only')
        with self.assertRaises(ValueError):
            self.store.share(source, 'a'*64, self.digest)

    def test_corrupted_canonical_does_not_replace_an_intact_candidate(self):
        first, second = self.candidate('one.flac'), self.candidate('two.flac')
        self.store.share(first, 'a'*64, self.digest)
        first.write_bytes(b'corrupted')
        with self.assertRaisesRegex(ValueError, 'Canonical'):
            self.store.share(second, 'a'*64, self.digest)
        self.assertEqual(second.read_bytes(), b'generated-only')


if __name__ == '__main__':
    unittest.main()
