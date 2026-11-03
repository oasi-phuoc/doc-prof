"""Synthetic waveform checks; they do not certify any listening or word boundary."""
import unittest
from unittest.mock import patch
import numpy as np
from audio_replacement.verify_acoustic_matches import RATE,anchor_starts,compare


class SignalAnchorTests(unittest.TestCase):
    def test_exam_with_a_long_middle_pause_still_has_three_real_signal_anchors(self):
        rng=np.random.default_rng(17)
        old=np.zeros(30*RATE)
        old[3*RATE:10*RATE]=rng.normal(0,.1,7*RATE)
        old[22*RATE:29*RATE]=rng.normal(0,.1,7*RATE)
        starts=anchor_starts(old,3*RATE)
        self.assertEqual(len(starts),3)
        self.assertTrue(all(np.var(old[first:first+3*RATE])>.0001 for first in starts))
        source=np.r_[rng.normal(0,.1,2*RATE),old,rng.normal(0,.1,RATE)]
        with patch('audio_replacement.verify_acoustic_matches.decode',side_effect=[old,source]):
            result=compare('old','source')
        self.assertEqual(result['status'],'signal_source_confirmed')
        self.assertAlmostEqual(result['source_offset_seconds'],2,places=4)
        self.assertEqual(len(result['anchors']),3)
        self.assertFalse(result['listening_performed'])
        self.assertFalse(result['clean_boundaries_validated'])

    def test_unrelated_recording_is_not_confirmed(self):
        rng=np.random.default_rng(25)
        old=rng.normal(0,.1,4*RATE);source=rng.normal(0,.1,8*RATE)
        with patch('audio_replacement.verify_acoustic_matches.decode',side_effect=[old,source]):
            self.assertEqual(compare('old','source')['status'],'signal_not_confirmed')

    def test_a_word_too_short_for_separated_anchors_does_not_raise_or_confirm(self):
        old=np.ones(RATE//5)*.1;source=np.ones(3*RATE)*.1
        with patch('audio_replacement.verify_acoustic_matches.decode',side_effect=[old,source]):
            self.assertEqual(compare('old','source')['status'],'signal_not_confirmed')


if __name__=='__main__':unittest.main()
