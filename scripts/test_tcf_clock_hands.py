"""Check exact time geometry and the distinction between clocks and durations."""
import unittest

from render_tcf_clocks import angles, point


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


if __name__ == '__main__':
    unittest.main()
