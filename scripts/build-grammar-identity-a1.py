"""Build only the graded A1 identity banks from individually authored sources.

No legacy, theory, CO or shared TPF source is rewritten. Stable slugs are part
of the editorial source; changing the file order does not change unit IDs.
"""
import csv
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'scripts/grammar_curriculum'
DEST = 'src/grammaire/curriculum/data/a1.json'
DATE = '2026-11-21'
PRESENTATION_FORMS = {
    'être': {'suis', 'es', 'est', 'sommes', 'êtes', 'sont'},
    'avoir': {'ai', 'as', 'a', 'avons', 'avez', 'ont'},
    'habiter': {'habite', 'habites', 'habitons', 'habitez', 'habitent'},
    'parler': {'parle', 'parles', 'parlons', 'parlez', 'parlent'},
    's’appeler': {'m’appelle', 't’appelles', 's’appelle', 'nous appelons', 'vous appelez', 's’appellent'},
}

# These completions deliberately target the five presentation verbs. The richer
# sentences in identity-a1.tsv are retained for the word-order activity.
GAPS = {
    'club-foot': 'J’___ seize ans.^ai^as^a',
    'velo': 'Je ___ membre du club de vélo.^suis^es^est',
    'atelier-photo': 'Tu ___ élève à l’école du Centre.^es^est^êtes',
    'maison-quartier': 'Salma ___ dans le quartier des Fleurs.^habite^habites^habitez',
    'club-lecture': 'Nous ___ italien au club de lecture.^parlons^parlez^parlent',
    'theatre': 'Vous ___ élèves à l’école des Peupliers.^êtes^est^sont',
    'club-natation': 'Je ___ Elias.^m’appelle^t’appelles^s’appelle',
    'tournoi-jeux': 'Tu ___ le pseudonyme Étoile.^as^a^ont',
    'stage-jardin': 'Il ___ stagiaire à la ferme du Lac.^est^es^sommes',
    'stage-gare': 'Vous ___ à l’accueil de la gare.^êtes^est^sont',
    'ecole-musique': 'Tu ___ au cours de musique.^es^est^êtes',
    'stage-vente': 'Nous ___ stagiaires dans le magasin.^sommes^êtes^sont',
    'club-marche': 'Vous ___ dans un groupe de marche.^êtes^est^sont',
    'atelier-ecriture': 'Ils ___ membres du club de lecture.^sont^sommes^êtes',
    'visite-musee': 'Je ___ dans le groupe bleu.^suis^es^est',
    'stage-menuiserie': 'Tu ___ à Vouvry.^habites^habite^habitez',
    'club-cinema': 'Camille ___ une carte du club de cinéma.^a^as^avons',
    'cours-cuisine': 'Nous ___ au cours de cuisine.^sommes^êtes^sont',
    'accueil-internat': 'Vous ___ à Genève.^habitez^habite^habitent',
    'atelier-reparation': 'Ils ___ à Vernayaz.^habitent^habitons^habitez',
    'cours-francais': 'Je ___ élève du cours du matin.^suis^es^est',
    'basket': 'Tu ___ joueur débutant.^es^est^êtes',
    'atelier-radio': 'Elle ___ en classe d’accueil.^est^es^sommes',
    'stage-animalerie': 'Nous ___ stagiaires dans une animalerie.^sommes^êtes^sont',
    'jardin-partage': 'Je ___ disponible le mercredi.^suis^es^est',
    'stage-boulangerie': 'Tu ___ stagiaire en boulangerie.^es^est^êtes',
    'atelier-robotique': 'Nous ___ dans l’équipe de robotique.^sommes^êtes^sont',
    'club-course': 'Vous ___ à Cully.^habitez^habite^habitent',
    'stage-hotel': 'Ils ___ français avec les clients.^parlent^parlons^parlez',
    'atelier-bande-dessinee': 'Je ___ Rania.^m’appelle^t’appelles^s’appelle',
    'equipe-ecologie': 'Tu ___ membre du groupe nature.^es^est^êtes',
    'atelier-couture': 'Elle ___ débutante en couture.^est^es^sommes',
    'stage-librairie': 'Nous ___ à Estavayer.^habitons^habitez^habitent',
    'club-echecs': 'Vous ___ débutante aux échecs.^êtes^est^sont',
    'atelier-percussions': 'Ils ___ membres du groupe de percussion.^sont^sommes^êtes',
    'accueil-camping': 'Je ___ avec ma classe.^suis^es^est',
}

EXTRA_ORAL = [
    'Je dessine des personnages.', 'Je cherche une bande dessinée.',
    'Je joue dans l’équipe des juniors.', 'J’apprends l’allemand.',
    'Je suis stagiaire en cuisine.', 'Je répète le jeudi.',
    'Mon école est à Sion.', 'Je pars de Vevey.',
    'Je photographie les animaux.', 'Je propose un jeu de société.',
    'Je lis des romans.', 'Mon école s’appelle l’école des Peupliers.',
    'Je suis dans le groupe des débutants.', 'Mon pseudonyme est Étoile.',
    'Je travaille à la ferme du Lac.', 'Je suis le cours de salsa.',
    'J’apprends à utiliser un ordinateur.', 'Je travaille au service des voyageurs.',
    'Je parle allemand et français.', 'Je suis apprentie fleuriste.',
    'Je joue de la guitare.', 'Je suis dans la classe A1 du matin.',
    'Mon nom de famille est Martin.', 'Je pars de la gare de Sion.',
    'Mon loisir préféré est la lecture.', 'Je suis dans le groupe bleu.',
    'J’apprends la menuiserie.', 'J’aime les films d’aventure.',
    'Je prépare de la soupe.', 'Je viens de Genève.',
    'Je suis membre de l’association Roue Libre.', 'Je suis le cours du matin.',
    'Je suis joueur débutant.', 'Je suis en classe d’accueil.',
    'Je m’occupe des animaux.', 'Je suis débutante en ski.',
    'Mon projet est une maison en carton.', 'Je suis disponible le mercredi.',
    'J’arrive à six heures.', 'Je prépare une écharpe.',
    'Notre projet est un robot.', 'J’habite à Cully.',
    'Je parle français au travail.', 'Mon personnage est une exploratrice.',
    'Je choisis le ramassage des déchets.', 'Je prépare un sac.',
    'J’aime les récits de voyage.', 'Je suis débutante aux échecs.',
    'Je joue du tambour.', 'Je voyage avec ma classe.',
]

VERBS = {
    'habite': ('habite', 'Ville'), 'a': ('ai', 'Âge'), 'suit': ('suis', 'Cours'),
    'parle': ('parle', 'Langues'), 'travaille': ('travaille', 'Travail'),
    'apprend': ('apprends', 'Apprentissage'), 'est': ('suis', 'Activité ou groupe'),
    'prépare': ('prépare', 'Préparation'), 'chante': ('chante', 'Activité'),
    'étudie': ('étudie', 'Études'), 'aime': ('aime', 'Goûts'),
    'participe': ('participe', 'Participation'), 'lit': ('lis', 'Lecture'),
    'joue': ('joue', 'Pratique'), 'nage': ('nage', 'Pratique'),
    'utilise': ('utilise', 'Nom utilisé'), 'fait': ('fais', 'Activité'),
    'plante': ('plante', 'Activité au jardin'), 'danse': ('danse', 'Pratique'),
    'commence': ('commence', 'Début d’activité'), 'accueille': ('accueille', 'Rôle'),
    'part': ('pars', 'Départ'), 'écrit': ('écris', 'Écriture'),
    'visite': ('visite', 'Visite'), 'vient': ('viens', 'Provenance ou présence'),
    'vit': ('vis', 'Logement'), 'répare': ('répare', 'Activité'),
    's’entraîne': ('m’entraîne', 'Entraînement'), 'présente': ('présente', 'Présentation'),
    's’occupe': ('m’occupe', 'Activité'), 'construit': ('construis', 'Projet'),
    'arrive': ('arrive', 'Arrivée'), 'fabrique': ('fabrique', 'Projet'),
    'court': ('cours', 'Pratique'), 'dessine': ('dessine', 'Dessin'),
    'ramasse': ('ramasse', 'Action'), 'rejoint': ('rejoins', 'Participation'),
    'range': ('range', 'Activité'), 'dort': ('dors', 'Séjour'),
    'voyage': ('voyage', 'Voyage'),
    'découvre': ('découvre', 'Découverte'), 'marche': ('marche', 'Pratique'),
}

RUBRIC = [
    {'id': 'tache', 'label': 'La réponse fournit l’information demandée.'},
    {'id': 'langue', 'label': 'Les personnes et les verbes sont cohérents.'},
    {'id': 'liberte', 'label': 'Une identité fictive différente est recevable.'},
    {'id': 'faits', 'label': 'Si la fiche est utilisée, ses faits sont respectés.'},
]
PORTRAIT_RUBRIC = [
    {'id': 'faits', 'label': 'Les informations de la fiche sont respectées.'},
    {'id': 'langue', 'label': 'Le sujet et les verbes sont accordés.'},
    {'id': 'texte', 'label': 'Trois à cinq phrases présentent la personne.'},
    {'id': 'sens', 'label': 'Le texte est compréhensible.'},
]
SCENARIO_RUBRIC = [
    {'id': 'roles', 'label': 'Les rôles et leurs intentions sont respectés.'},
    {'id': 'reponse', 'label': 'Les réponses correspondent aux questions.'},
    {'id': 'langue', 'label': 'Les structures de présentation sont correctes.'},
    {'id': 'sens', 'label': 'L’échange est compréhensible.'},
]


def read_rows(filename, width):
    rows = list(csv.reader((SOURCE / filename).read_text().splitlines(), delimiter='|'))
    assert all(len(r) == width for r in rows), [(i, len(r)) for i, r in enumerate(rows) if len(r) != width]
    assert len({r[0] for r in rows}) == len(rows)
    return rows


def person_facts(name, facts):
    labels, first = [], []
    for fact in facts:
        assert fact.startswith(name), (name, fact)
        body = fact[len(name):].lstrip()
        # A full fictional name can be used once in the source.
        if name == 'Rayan' and body.startswith('Martin '):
            body = body[len('Martin '):]
        verb, rest = body.split(' ', 1)
        present, label = VERBS[verb]
        value = rest.rstrip('.')
        if verb == 'habite':
            value = re.sub(r'^(à|en) ', '', value)
        if verb not in ['habite', 'a', 'parle', 'est', 'utilise']:
            irregular = {'suit': 'suivre', 'apprend': 'apprendre', 'lit': 'lire', 'fait': 'faire',
                         'accueille': 'accueillir', 'part': 'partir', 'écrit': 'écrire', 'vient': 'venir',
                         'vit': 'vivre', 'construit': 'construire', 'court': 'courir', 'rejoint': 'rejoindre',
                         'dort': 'dormir', 'découvre': 'découvrir'}
            infinitive = irregular.get(verb, verb[:-1]+'er' if verb.endswith('e') else None)
            assert infinitive, verb
            value = infinitive+' '+value
        labels.append(f'{label} : {value}')
        rest = re.sub(r'\b(son|sa|ses)\b', lambda m: {'son': 'mon', 'sa': 'ma', 'ses': 'mes'}[m[0]], rest)
        start = 'J’' if present[0] in 'aâeéèêiîoôuûh' else 'Je '
        first.append(start + present + ' ' + rest)
    return labels, first


def bank(kind, label, presentations, units, instructions):
    return {'schemaVersion': 1, 'revision': f'a1-{kind}-{DATE}.1',
            'activityId': f'gram-ex-a1-{kind}', 'subthemeId': 'a1', 'topic': 'gram-se-presenter',
            'level': 'A1', 'label': label,
            'objective': 'Se présenter, demander une information et présenter une identité réelle ou fictive.',
            'editorialStatus': 'reviewed',
            'review': {'reviewer': 'Codex — revue linguistique et fonctionnelle', 'date': DATE,
                       'humanReview': 'pending', 'note': '50 contextes rédigés individuellement, partagés entre tâches ; 20 lectures distinctes. Approbation enseignante en attente.'},
            'presentations': presentations, 'instructions': instructions, 'units': units}


def main():
    rows = read_rows('identity-a1.tsv', 12)
    assert len(rows) == len(EXTRA_ORAL) == 50
    media = json.loads((ROOT / 'docs/grammaire/implementation/presentation-media.json').read_text())
    portraits = {g: next(s for s in media['supports'] if s['id'] == 'grammar-presentation-' + who)
                 for g, who in [('f', 'femme'), ('m', 'homme')]}
    units = {k: [] for k in ['infos-perso', 'verbe-pastilles', 'ordre', 'repondre-phrase',
                            'ecrire-question', 'formulaire', 'ce-texte', 'portrait', 'po-images', 'curriculum-s']}
    for position, row in enumerate(rows):
        slug, context, name, gender, gap_data, tagged, personal, question, raw_facts, form_title, raw_fields, oral_task = row
        assert gender in portraits
        template, information, personal_model = personal.split('^')
        reply = template.replace('___', personal_model)
        facts = raw_facts.split('^')
        labels, first_person = person_facts(name, facts)
        full_name = name + (' Martin' if name == 'Rayan' else '')
        profile = f'Personnage fictif : {full_name} ({"féminin" if gender == "f" else "masculin"}).\n' + '\n'.join(labels)
        first_model = ' '.join([f'Je m’appelle {name}.', *first_person, EXTRA_ORAL[position]])
        for kind, target in units.items():
            if kind == 'ce-texte':
                continue
            uid = f'a1-{kind}-{slug}'
            source = {'path': 'scripts/grammar_curriculum/identity-a1.tsv', 'typeId': f'gram-ex-a1-{kind}',
                      'position': position, 'partition': f'A1 — contexte {slug}, source rédigée'}
            u = {'id': uid, 'prompt': context, 'answers': [reply],
                 'explanation': 'Exemple possible ; les informations réelles ou fictives restent libres.', 'source': source}
            if kind == 'infos-perso':
                u.update(kind='personal-gap', prompt=context+'\n'+template, information=information,
                         task='Complétez avec vos informations ou une identité fictive.', answers=[personal_model], rubric=RUBRIC)
            elif kind == 'verbe-pastilles':
                gap, answer, bad1, bad2 = GAPS.get(slug, gap_data).split('^')
                assert len({answer, bad1, bad2}) == 3
                infinitives = [verb for verb, forms in PRESENTATION_FORMS.items() if answer in forms]
                assert len(infinitives) == 1, (slug, answer)
                u.update(kind='completion', prompt=context+'\n'+gap, answers=[answer],
                         givenVerb=infinitives[0],
                         explanation=f'On conjugue {infinitives[0]} avec le sujet de la phrase : {answer}.',
                         options=[{'id': f'o{i+1}', 'text': t} for i, t in enumerate([answer, bad1, bad2])])
            elif kind == 'ordre':
                tokens = []
                for i, word in enumerate(tagged.split()):
                    text, category = word.rsplit('/', 1)
                    if text in ['seize', 'vingt', 'dix-neuf', 'six']:
                        category = 'determinant'
                    tokens.append({'id': f'{uid}-t{i+1}', 'text': text.replace('_', ' '), 'category': category})
                sentence = ' '.join(t['text'] for t in tokens).replace('’ ', '’') + '.'
                assert sentence == gap_data.split('^')[0].replace('___', gap_data.split('^')[1]), (slug, sentence)
                u.update(kind='order', prompt='Construire une phrase de présentation : '+context, cue=context,
                         tokens=tokens, answers=[sentence], explanation='Les mots forment cette phrase. Une autre organisation naturelle est appréciée par l’enseignant.')
            elif kind == 'repondre-phrase':
                u.update(kind='production', mode='written', prompt=context+'\n'+question,
                         task='Répondez par une phrase complète. Vous pouvez inventer les informations.', rubric=RUBRIC, writeLines=1)
            elif kind == 'ecrire-question':
                who = 'le binôme avec vous (deux personnes)' if slug == 'atelier-robotique' else 'votre camarade avec tu'
                u.update(kind='transform', prompt=reply, cue=context, answers=[question],
                         directive=f'Interrogez {who}. Information à demander : {information}. Plusieurs formulations sont possibles.',
                         explanation='Modèle possible de question pertinente ; les autres formulations correctes sont appréciées par l’enseignant.')
            elif kind == 'formulaire':
                fields = []
                for i, field in enumerate(raw_fields.split('~')):
                    label, model = field.split('=', 1)
                    fmt = 'email' if 'email' in label.lower() else 'number' if model.isdigit() else 'text'
                    fields.append({'id': f'{uid}-f{i+1}', 'label': label, 'required': True, 'format': fmt, 'model': model})
                    if fmt == 'number':
                        fields[-1]['hint'] = 'En chiffres.'
                u.update(kind='form', prompt=form_title, task=context+' Complétez ce formulaire avec des informations réelles ou fictives.',
                         fields=fields, rubric=RUBRIC, answers=[' ; '.join(f['label']+' : '+f['model'] for f in fields)])
            elif kind == 'portrait':
                u.update(kind='production', mode='written', prompt=context+'\n'+profile,
                         task='Présentez cette personne en trois à cinq phrases.',
                         answers=[' '.join(facts)], rubric=PORTRAIT_RUBRIC, writeLines=5, imageSupports=[portraits[gender]],
                         explanation='Modèle possible ; d’autres formulations fidèles à la fiche sont acceptées.')
            elif kind == 'po-images':
                u.update(kind='production', mode='oral', prompt=context+'\n'+profile,
                         task=oral_task+' Vous pouvez utiliser la fiche ou inventer une identité. Pour poursuivre : '+question,
                         answers=[first_model], rubric=RUBRIC, writeLines=0, imageSupports=[portraits[gender]])
            elif kind == 'curriculum-s':
                role_facts=f'Personnage fictif : {full_name} ({"féminin" if gender == "f" else "masculin"}).\n{information.capitalize()} : {personal_model}.'
                role_goal=oral_task.partition(' et ')[2]
                assert role_goal, oral_task
                role_goal=role_goal[0].upper()+role_goal[1:]
                u.update(kind='scenario', contract='open', situation=context+'\n'+role_facts,
                         prompt='Rencontre : '+form_title,
                         roles=[{'id': 'participant', 'label': 'Vous', 'goal': role_goal},
                                {'id': 'accueil', 'label': 'Votre interlocuteur', 'goal': 'Demander : '+information+'.'}],
                         turns=[{'id': 'accueil-1', 'roleId': 'accueil', 'text': 'Bonjour ! Présentez-vous.'},
                                {'id': 'participant-1', 'roleId': 'participant', 'text': 'À vous de vous présenter.'}],
                         task='Jouez les rôles. Présentez-vous et répondez à la demande de votre interlocuteur. Une identité fictive est possible.',
                         rubric=SCENARIO_RUBRIC, followUps=[question], writeLines=2,
                         answers=[f'Vous : Je m’appelle {name}. '+EXTRA_ORAL[position]+'\nVotre interlocuteur : '+question+'\nVous : '+reply])
            target.append(u)
    docs = read_rows('identity-a1-reading.tsv', 7)
    assert len(docs) == 20
    for position, (slug, genre, title, raw_text, q1, q2, q3) in enumerate(docs):
        uid = 'a1-ce-'+slug
        text = raw_text.replace('\\n', '\n')
        questions = []
        for index, raw in enumerate([q1, q2, q3]):
            prompt, answer, evidence, *wrong = raw.split('^')
            assert evidence in text, (slug, evidence)
            q = {'id': f'{uid}-q{index+1}', 'prompt': prompt, 'answers': [answer],
                 'evidence': [evidence], 'explanation': 'La réponse reprend l’information indiquée dans le document.',
                 'response': 'choice' if wrong else 'short'}
            if wrong:
                assert len(wrong) == 2 and len({answer, *wrong}) == 3
                q['options'] = [{'id': f'o{i+1}', 'text': v} for i, v in enumerate([answer, *wrong])]
            questions.append(q)
        units['ce-texte'].append({'id': uid, 'kind': 'reading', 'prompt': title, 'genre': genre,
                                 'text': text, 'answers': [], 'questions': questions,
                                 'explanation': 'Document de lecture, sans audio ; repérage des faits explicites.',
                                 'source': {'path': 'scripts/grammar_curriculum/identity-a1-reading.tsv',
                                            'typeId': 'gram-ex-a1-ce-texte', 'position': position}})
    definitions = [
        ('infos-perso', 'Infos personnelles', ['gap'], {'gap': 'Complétez avec vos informations ou une identité fictive.'}),
        ('verbe-pastilles', 'Compléter avec le verbe', ['choice', 'gap'], {'choice': 'Choisissez la forme du verbe qui convient.', 'gap': 'Complétez avec la forme du verbe qui convient.'}),
        ('ordre', 'Remettre dans l’ordre', ['order'], {'order': 'Remettez les mots dans l’ordre et écrivez la phrase.'}),
        ('repondre-phrase', 'Répondre avec une phrase', ['open-written'], {'open-written': 'Répondez par une phrase complète. Vous pouvez inventer les informations.'}),
        ('ecrire-question', 'Écrire la question', ['transform'], {'transform': 'Écrivez une question pour obtenir l’information indiquée.'}),
        ('formulaire', 'Remplir un formulaire', ['open-written'], {'open-written': 'Complétez le formulaire. Vous pouvez utiliser une identité fictive.'}),
        ('ce-texte', 'Lire et répondre', ['document-set'], {'document-set': 'Lisez le document, puis répondez aux questions.'}),
        ('portrait', 'Présenter une personne', ['open-written'], {'open-written': 'Présentez la personne en trois à cinq phrases à partir de la fiche.'}),
        ('po-images', 'Se présenter à l’oral', ['open-oral'], {'open-oral': 'Présentez-vous dans la situation. Une identité fictive est possible.'}),
        ('curriculum-s', 'Jouer une situation', ['scenario-set'], {'scenario-set': 'Jouez la situation en suivant votre rôle. Vous pouvez inventer une identité.'}),
    ]
    banks = [bank(k, label, presentations, units[k], instructions) for k, label, presentations, instructions in definitions]
    (ROOT / DEST).write_text(json.dumps(banks, ensure_ascii=False, indent=2)+'\n')
    print(f'Identity A1: {len(banks)} activities, {sum(len(b["presentations"]) for b in banks)} offerings; 50 situations, 20 distinct readings.')


if __name__ == '__main__':
    main()
