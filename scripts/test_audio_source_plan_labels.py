"""Ensure recording labels are excluded without confusing spoken numbers with labels."""
from pathlib import Path
import sys
import unittest
sys.path.insert(0,str(Path(__file__).parent/'audio_replacement'))
from prepare_source_plans import classify


def words(text):
    return [{'text':token,'start':index*.3,'end':index*.3+.25,'kind':'dialogue'}
            for index,token in enumerate(text.split())]


class SourceLabelTest(unittest.TestCase):
    def test_numbered_situations_are_separate_dialogues_without_announcements(self):
        data=words('Exercice 1. Situation numéro 1 Bonjour madame. Situation numéro 2 Merci monsieur.')
        segments,excluded,*_=classify(data)
        self.assertEqual([' '.join(w['text'] for w in data[s['first_word']:s['last_word']+1])
                          for s in segments],['Bonjour madame.','Merci monsieur.'])
        self.assertTrue(all(data[i]['kind']!='dialogue' for r in excluded
                            for i in range(r['first_word'],r['last_word']+1)))

    def test_bus_number_is_kept_inside_the_useful_speech(self):
        data=words('Le bus numéro 5 arrive dans dix minutes.')
        segments,excluded,*_=classify(data)
        self.assertEqual(len(segments),1)
        self.assertEqual(excluded,[])
        self.assertEqual(segments[0]['first_word'],0)
        self.assertEqual(segments[0]['last_word'],len(data)-1)

    def test_english_asr_spelling_of_activity_does_not_pollute_a_cut(self):
        data=words('Activity 13 Bonjour madame.')
        segments,*_=classify(data)
        self.assertEqual(data[segments[0]['first_word']]['text'],'Bonjour')


if __name__=='__main__':unittest.main()
