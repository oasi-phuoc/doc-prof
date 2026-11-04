import importlib.util
from pathlib import Path
import unittest

spec=importlib.util.spec_from_file_location('candidates',Path(__file__).parent/'audio_replacement/publish_grammar_tcf_candidates.py')
module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)


class GrammarTcfCandidateTests(unittest.TestCase):
    def test_five_rules_never_collapse_to_one_candidate(self):
        cuts=[dict(id=i) for i in range(1,6)]
        selected=[module.select_cut(dict(old_ref=f'/vie-quotidienne-objet-4-{i}.mp3'),cuts,'piste067.mp3')['id'] for i in range(1,6)]
        self.assertEqual(selected,[1,2,3,4,5])

    def test_ambiguous_or_unknown_rule_reference_is_rejected(self):
        with self.assertRaises(ValueError):module.select_cut(dict(old_ref='/unknown.mp3'),[{}]*5,'piste067.mp3')
        with self.assertRaises(ValueError):module.select_cut(dict(old_ref='/other.mp3'),[{},{}],'piste005.mp3')

    def test_headers_removed_but_useful_numbers_preserved(self):
        self.assertEqual(module.useful_text('Page 99. Exercice 4.\nUn carnet de 10 tickets.',169),'Un carnet de 10 tickets.')
        self.assertEqual(module.useful_text('Leçon 2. Document A.\nJ’ai 25 ans.',16),'J’ai 25 ans.')

    def test_incomplete_closing_is_not_completed(self):
        self.assertEqual(module.useful_text('Page 33. Exercice 1.\nUn jardin. Nous sommes ouverts…',44),'Un jardin.')


if __name__=='__main__':unittest.main()
