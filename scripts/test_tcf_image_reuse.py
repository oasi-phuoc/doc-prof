"""Regressions for misleading aliases discovered during the image migration."""
import unittest

from tcf_replace_vocabulary_images import compatible_reuse


class SemanticReuseTests(unittest.TestCase):
    def check_target(self, answer, filename, label):
        target = '/lib/images/tcf/qcm-audit/' + filename
        return compatible_reuse(answer, target, {target: {'label': label}})

    def test_dishes_do_not_replace_whole_ingredients(self):
        for answer, filename in [('Du poulet', 'co306-pates-poulet-dessine.webp'),
                                 ('Du fromage', 'co306-pates-fromage-dessine.webp'),
                                 ('La crème', 'co306-creme-medicale-dessine.webp')]:
            with self.subTest(answer=answer):
                self.assertFalse(self.check_target(answer, filename, answer))

    def test_airplane_interior_does_not_replace_an_airplane(self):
        self.assertFalse(self.check_target('Un avion', 'passagers-d-avion.webp', 'Un avion'))
        self.assertTrue(self.check_target('Dans un avion', 'passagers-d-avion.webp', 'Un avion'))

    def test_concert_does_not_replace_generic_stadium(self):
        self.assertFalse(self.check_target('Un stade', 'co57-concert-stade.webp', 'Au stade'))

    def test_singular_and_plural_subjects_are_preserved(self):
        self.assertFalse(self.check_target('Une pomme', 'pommes.webp', 'Des pommes'))
        self.assertFalse(self.check_target('Des robes', 'robe.webp', 'Une robe rouge'))
        self.assertTrue(self.check_target('Les poires', 'poires.webp', 'Des poires'))

    def test_bouquet_contains_multiple_flowers(self):
        self.assertTrue(self.check_target('Des fleurs', 'co834-bouquet-fleurs-dessine.webp', 'Un bouquet de fleurs'))

    def test_reviewed_group_and_generic_activity_scenes(self):
        self.assertTrue(self.check_target('Les voyageurs', 'co57-voyage.webp', 'Un voyage'))
        self.assertTrue(self.check_target('Des concerts', 'co834-concert-dessine.webp', 'Un concert'))
        self.assertTrue(self.check_target('Des cours de cuisine', 'co306-cours-cuisine-dessine.webp', 'Un cours de cuisine'))
        self.assertFalse(self.check_target('Des maisons', 'co57-voyage.webp', 'Un voyage'))

    def test_unreviewed_target_is_rejected(self):
        self.assertFalse(compatible_reuse('Un chat', '/lib/images/tcf/qcm-audit/chat.webp', {}))


if __name__ == '__main__':
    unittest.main()
