"""Check exact time geometry and the distinction between clocks and durations."""
import unittest

from render_tcf_clocks import angles, point
from tcf_visual_durations import exact_duration_seconds


class ClockGeometryTests(unittest.TestCase):
    def test_hour_hand_advances_between_numbers(self):
        self.assertEqual(angles(3, 30), (105, 180))
        self.assertEqual(angles(10, 35), (317.5, 210))
        self.assertEqual(angles(12, 45), (22.5, 270))
        self.assertEqual(angles(23, 59), (359.5, 354))

    def test_twelve_hour_display_keeps_the_same_geometry(self):
        self.assertEqual(angles(7, 15), angles(19, 15))

    def test_clockwise_coordinate_system(self):
        for degrees, expected in [(0, (640, 380)), (90, (740, 480)),
                                  (180, (640, 580)), (270, (540, 480))]:
            with self.subTest(degrees=degrees):
                actual = point(degrees, 100)
                self.assertAlmostEqual(actual[0], expected[0])
                self.assertAlmostEqual(actual[1], expected[1])

    def test_invalid_times_are_rejected(self):
        for hour, minute in [(-1, 0), (24, 0), (10, 60), (10, -1)]:
            with self.assertRaises(ValueError):
                angles(hour, minute)

    def test_durations_preserve_hours_and_minutes(self):
        for label, seconds in [('Une heure trente', 5400), ('1 h 34', 5640),
                               ('Deux heures dix', 7800), ('125 minutes', 7500),
                               ('Une demi-heure', 1800), ('Deux minutes trente', 150)]:
            with self.subTest(label=label):
                self.assertEqual(exact_duration_seconds(label), seconds)

    def test_calendar_times_and_unquantified_scopes_are_not_durations(self):
        for label in ['À 2 h', 'Toute la représentation', 'L’entracte uniquement',
                      'Deux jours', '1 h 75', '13 heures']:
            with self.subTest(label=label):
                self.assertIsNone(exact_duration_seconds(label))


if __name__ == '__main__':
    unittest.main()
