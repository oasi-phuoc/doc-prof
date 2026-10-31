import copy
import unittest

from tcf_qcm_images import desired_form, resolve_image, synchronize


def question(labels, enonce='Où va-t-on ?'):
    return {'type_reponse':'qcm_texte', 'enonce':enonce, 'melanger':True,
            'choix':[{'id':letter,'texte':text,'correct':i==1,'fixe':i==2}
                     for i,(letter,text) in enumerate(zip('abcd',labels))]}


class ImageSemantics(unittest.TestCase):
    def test_dates_money_and_private_homes_stay_text(self):
        for labels, enonce in [(['Lundi','Mardi','Mercredi'],'Quel jour ?'),
                               (['9 euros','10 euros','12 euros'],'Combien ?'),
                               (['Chez Brigitte','Chez Catherine','Au restaurant'],'Où sont-elles ?'),
                               (['10','5','8'],'Quel numéro ?'),
                               (['10','5','8'],'Combien coûtent les tomates ?'),
                               (['Janvier','Mars','Avril'],'Quel mois ?')]:
            self.assertIsNone(desired_form(question(labels,enonce)))

    def test_sentence_meaning_is_not_reduced_to_an_object(self):
        labels=['Le magasin est fermé le lundi.','Le rendez-vous est annulé.','Vous aimez la télévision.']
        self.assertIsNone(desired_form(question(labels,'Que faut-il retenir ?')))
        for label in labels:self.assertIsNone(resolve_image(label))

    def test_classrooms_are_not_flags(self):
        q=question(['Dans la salle du cours de français','Dans la salle du cours d’anglais',
                    'Dans la salle du cours d’histoire'])
        form=desired_form(q)
        self.assertEqual([c['image'].split('/')[-1] for c in form['choix']],
                         ['cours-francais.webp','cours-anglais.webp','cours-histoire.webp'])

    def test_concrete_counts_and_activities(self):
        q=question(['10','5','8'],'Combien de tomates ?')
        self.assertEqual([c['image'].split('/')[-1] for c in desired_form(q)['choix']],
                         ['10-tomates.webp','5-tomates.webp','8-tomates.webp'])
        self.assertIsNotNone(desired_form(question(['6','10','12'],"Combien d’œufs dois-tu acheter ?")))
        q=question(['De prendre le petit déjeuner ensemble','D’aller au cinéma','De faire du sport ensemble'])
        self.assertIsNotNone(desired_form(q))

    def test_all_options_are_required_and_ids_answers_are_preserved(self):
        self.assertIsNone(desired_form(question(['Au cinéma','Chez Catherine','À la piscine'])))
        self.assertIsNone(desired_form(question(['Au cinéma','Dans un cinéma','À la piscine'])))
        q=question(['Au cinéma','Au restaurant','À la piscine'])
        form=desired_form(q)
        for text,image in zip(q['choix'],form['choix']):
            self.assertEqual({k:v for k,v in text.items() if k!='texte'},
                             {k:v for k,v in image.items() if k!='image'})
        result=synchronize(q,form)
        self.assertEqual(synchronize(result,desired_form(result)),result)

    def test_incidental_time_words_do_not_hide_concrete_choices(self):
        self.assertIsNotNone(desired_form(question(['Une pizza','Une quiche','Une soupe'],
                                                 'Quel est le plat du jour ?')))
        self.assertIsNotNone(desired_form(question(['Au cinéma','Au restaurant','À la piscine'],
                                                 'Où allez-vous ce jour-là ?')))

    def test_invalid_active_image_falls_back_to_original_text(self):
        q=question(['Chez Brigitte','Chez Catherine','Au restaurant'])
        original=copy.deepcopy(q['choix'])
        q['formes']={'qcm_texte':{'choix':original,'melanger':False},
                     'lignes':{'reponse_modele':'Chez Brigitte','nb_lignes':1}}
        q['type_reponse']='qcm_image';q['choix']=[{'id':'a','image':'wrong.webp'}]
        result=synchronize(q,None)
        self.assertEqual(result['type_reponse'],'qcm_texte')
        self.assertEqual(result['choix'],original)
        self.assertEqual(result['formes']['lignes']['reponse_modele'],'Chez Brigitte')


if __name__=='__main__':unittest.main()
