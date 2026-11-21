"""Six graded nationality activities; existing country images, no media creation."""
import csv
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATE = '2026-11-21'
DEST = 'src/grammaire/curriculum/data/a3.json'

COUNTRIES = [
    ('france', 'France', 'français', 'française'), ('suisse', 'Suisse', 'suisse', 'suisse'),
    ('belgique', 'Belgique', 'belge', 'belge'), ('chine', 'Chine', 'chinois', 'chinoise'),
    ('portugal', 'Portugal', 'portugais', 'portugaise'), ('maroc', 'Maroc', 'marocain', 'marocaine'),
    ('canada', 'Canada', 'canadien', 'canadienne'), ('vietnam', 'Vietnam', 'vietnamien', 'vietnamienne'),
    ('mexique', 'Mexique', 'mexicain', 'mexicaine'), ('italie', 'Italie', 'italien', 'italienne'),
    ('espagne', 'Espagne', 'espagnol', 'espagnole'), ('allemagne', 'Allemagne', 'allemand', 'allemande'),
    ('autriche', 'Autriche', 'autrichien', 'autrichienne'), ('ukraine', 'Ukraine', 'ukrainien', 'ukrainienne'),
    ('iran', 'Iran', 'iranien', 'iranienne'), ('etats-unis', 'États-Unis', 'américain', 'américaine'),
    ('pays-bas', 'Pays-Bas', 'néerlandais', 'néerlandaise'),
]

# First person / third singular / third plural / full complement. Each activity
# keeps the whole meaningful predicate, including its required prepositions.
CLAUSES = [
    ('participe', 'participe', 'participent', 'au cours de dessin'),
    ('consulte', 'consulte', 'consultent', 'des livres à la bibliothèque'),
    ('joue', 'joue', 'jouent', 'dans une équipe de football'),
    ('discute', 'discute', 'discutent', 'avec un partenaire de conversation'),
    ('travaille', 'travaille', 'travaillent', 'dans une cuisine'),
    ('chante', 'chante', 'chantent', 'dans une chorale'),
    ('prépare', 'prépare', 'préparent', 'un échange de classe'),
    ('roule', 'roule', 'roulent', 'à vélo le dimanche'),
    ('photographie', 'photographie', 'photographient', 'les oiseaux du parc'),
    ('organise', 'organise', 'organisent', 'une soirée de jeux'),
    ('lis', 'lit', 'lisent', 'des romans au club de lecture'),
    ('joue', 'joue', 'jouent', 'dans une pièce de théâtre'),
    ('nage', 'nage', 'nagent', 'à la piscine du quartier'),
    ('choisis', 'choisit', 'choisissent', 'un pseudonyme pour le tournoi'),
    ('plante', 'plante', 'plantent', 'des légumes à la ferme'),
    ('danse', 'danse', 'dansent', 'la salsa le vendredi'),
    ('utilise', 'utilise', 'utilisent', 'un ordinateur au cours'),
    ('renseigne', 'renseigne', 'renseignent', 'les voyageurs à la gare'),
    ('accueille', 'accueille', 'accueillent', 'les visiteurs du festival'),
    ('découvre', 'découvre', 'découvrent', 'la poterie'),
    ('joue', 'joue', 'jouent', 'de la guitare'),
    ('réalise', 'réalise', 'réalisent', 'une expérience en classe'),
    ('range', 'range', 'rangent', 'les rayons du magasin'),
    ('marche', 'marche', 'marchent', 'avec le groupe du dimanche'),
    ('écris', 'écrit', 'écrivent', 'des histoires pour un atelier'),
    ('visite', 'visite', 'visitent', 'un musée avec la classe'),
    ('apprends', 'apprend', 'apprennent', 'la menuiserie'),
    ('regarde', 'regarde', 'regardent', 'des films au ciné-club'),
    ('cuisine', 'cuisine', 'cuisinent', 'une soupe avec un partenaire'),
    ('séjourne', 'séjourne', 'séjournent', 'dans un internat'),
    ('répare', 'répare', 'réparent', 'des vélos avec une association'),
    ('suis', 'suit', 'suivent', 'un cours de français le matin'),
    ('m’entraîne', 's’entraîne', 's’entraînent', 'au basket'),
    ('présente', 'présente', 'présentent', 'une émission de radio'),
    ('soigne', 'soigne', 'soignent', 'les animaux'),
    ('commence', 'commence', 'commencent', 'un cours de ski'),
    ('construis', 'construit', 'construisent', 'une maquette en carton'),
    ('cultive', 'cultive', 'cultivent', 'des fleurs au jardin partagé'),
    ('arrive', 'arrive', 'arrivent', 'à la boulangerie à six heures'),
    ('tricote', 'tricote', 'tricotent', 'une écharpe'),
    ('fabrique', 'fabrique', 'fabriquent', 'un petit robot'),
    ('cours', 'court', 'courent', 'près du lac'),
    ('réserve', 'réserve', 'réservent', 'une chambre à la réception'),
    ('dessine', 'dessine', 'dessinent', 'une exploratrice'),
    ('ramasse', 'ramasse', 'ramassent', 'les déchets dans le parc'),
    ('couds', 'coud', 'cousent', 'un sac en tissu'),
    ('classe', 'classe', 'classent', 'des récits de voyage'),
    ('apprends', 'apprend', 'apprennent', 'les règles des échecs'),
    ('joue', 'joue', 'jouent', 'du tambour'),
    ('voyage', 'voyage', 'voyagent', 'avec un groupe de classe'),
]


def plural(a):
    return a if a.endswith(('s', 'x')) else a+'s'


def infinitive(singular):
    irregular = {'lit': 'lire', 'choisit': 'choisir', 'accueille': 'accueillir',
                 'écrit': 'écrire', 'apprend': 'apprendre', 'découvre': 'découvrir',
                 'suit': 'suivre', 'construit': 'construire', 'court': 'courir', 'coud': 'coudre'}
    if singular in irregular:
        return irregular[singular]
    assert singular.endswith('e'), singular
    return singular[:-1]+'er'


def main():
    rows = list(csv.reader((ROOT/'scripts/grammar_curriculum/identity-a1.tsv').read_text().splitlines(), delimiter='|'))
    assert len(rows) == len(CLAUSES) == 50
    manifest = json.loads((ROOT/'docs/grammaire/implementation/presentation-media.json').read_text())
    media = {s['id'].removeprefix('grammar-presentation-'): s for s in manifest['supports']}
    definitions = [
        ('nat-image', 'Je suis… (avec image)', ['choice', 'gap'], {'choice': 'Choisissez l’adjectif de nationalité du personnage.', 'gap': 'Complétez avec l’adjectif de nationalité du personnage.'}),
        ('nat-feminin', 'Mettre au féminin', ['transform'], {'transform': 'Réécrivez toute la phrase au féminin.'}),
        ('nat-masculin', 'Mettre au masculin', ['transform'], {'transform': 'Réécrivez toute la phrase au masculin.'}),
        ('nat-pluriel', 'Mettre au pluriel', ['transform'], {'transform': 'Réécrivez toute la phrase au pluriel en gardant le genre indiqué.'}),
        ('nat-accorder', 'Accorder l’adjectif', ['choice', 'gap'], {'choice': 'Choisissez l’adjectif de nationalité correctement accordé.', 'gap': 'Accordez l’adjectif de nationalité et complétez la phrase.'}),
        ('curriculum-p', 'S’exprimer à l’oral', ['open-oral'], {'open-oral': 'Présentez les personnes de la fiche et dites leur nationalité et leur activité.'}),
    ]
    banks = []
    for kind, label, presentations, instructions in definitions:
        bank = {'schemaVersion': 1, 'revision': f'a3-{kind}-{DATE}.1', 'activityId': 'gram-ex-a3-'+kind,
                'subthemeId': 'a3', 'topic': 'gram-se-presenter', 'level': 'A1', 'label': label,
                'objective': 'Employer un adjectif de nationalité et l’accorder avec un référent explicite.',
                'editorialStatus': 'reviewed', 'review': {'reviewer': 'Codex — revue linguistique et fonctionnelle',
                'date': DATE, 'humanReview': 'pending', 'note': '50 contextes partagés avec l’identité ; nationalités attribuées explicitement à des personnages fictifs, jamais inférées de leur prénom.'},
                'presentations': presentations, 'instructions': instructions, 'units': []}
        for i, (row, clause) in enumerate(zip(rows, CLAUSES)):
            slug, context, name, gender = row[:4]
            country_key, country, m, f = COUNTRIES[i % len(COUNTRIES)]
            first, singular, many, complement = clause
            uid = f'a3-{kind}-{slug}'
            gender_label = 'féminin' if gender == 'f' else 'masculin'
            adjective = f if gender == 'f' else m
            u = {'id': uid, 'prompt': '', 'answers': [], 'explanation': '',
                 'source': {'path': 'scripts/build-grammar-nationalities-a1.py', 'typeId': bank['activityId'],
                            'position': i, 'partition': 'A1 — nationalité fictive déclarée ; contexte '+slug}}
            if kind == 'nat-image':
                first_subject = 'j’' if first[0] in 'aâeéèêiîoôuûh' else 'je '
                u.update(kind='completion', prompt=f'Je suis ___ et {first_subject}{first} {complement}.',
                         cue='La carte représente le pays de nationalité du personnage fictif.',
                         agreementHint=f'{name} {"♀" if gender == "f" else "♂"} ; {gender_label}',
                         answers=[adjective], imageSupports=[media[country_key]],
                         explanation=f'Pays de nationalité indiqué : {country}. Accord au {gender_label} singulier : {adjective}.')
                wrong = [(c[3] if gender == 'f' else c[2]) for c in COUNTRIES if c[0] != country_key][:2]
                u['options'] = [{'id': f'o{n+1}', 'text': a} for n, a in enumerate([adjective, *wrong])]
            elif kind in ['nat-feminin', 'nat-masculin', 'nat-pluriel']:
                if kind == 'nat-feminin':
                    source, answer, target = f'Il est {m} et {singular} {complement}.', f'Elle est {f} et {singular} {complement}.', 'elle (féminin singulier)'
                elif kind == 'nat-masculin':
                    source, answer, target = f'Elle est {f} et {singular} {complement}.', f'Il est {m} et {singular} {complement}.', 'il (masculin singulier)'
                else:
                    pronoun, plural_pronoun = ('Elle', 'Elles') if gender == 'f' else ('Il', 'Ils')
                    source, answer = f'{pronoun} est {adjective} et {singular} {complement}.', f'{plural_pronoun} sont {plural(adjective)} et {many} {complement}.'
                    target = f'{plural_pronoun.lower()} ({gender_label} pluriel)'
                u.update(kind='transform', prompt=source, answers=[answer], directive='Sujet demandé : '+target+'.',
                         explanation='Le sujet, être, l’adjectif de nationalité et le deuxième verbe s’accordent avec le sujet demandé. Le sens de la phrase est conservé.')
            elif kind == 'nat-accorder':
                form = i % 4
                pronoun, verb, adj, hint, action = [
                    ('Il', 'est', m, 'masculin singulier', singular), ('Elle', 'est', f, 'féminin singulier', singular),
                    ('Ils', 'sont', plural(m), 'masculin pluriel', many), ('Elles', 'sont', plural(f), 'féminin pluriel', many)][form]
                variants = list(dict.fromkeys([adj, m, f, plural(m), plural(f)]))
                for error in [m+'e', f+'e', m+'ss']:
                    if len(variants) >= 3:
                        break
                    if error not in variants:
                        variants.append(error)
                u.update(kind='completion', prompt=f'{pronoun} {verb} ___ et {action} {complement}.',
                         agreementHint=f'{m} ; {hint}', answers=[adj],
                         cue=f'Pays de nationalité déclaré : {country}.',
                         options=[{'id': f'o{n+1}', 'text': a} for n, a in enumerate(variants[:3])],
                         explanation=f'L’adjectif s’accorde avec {pronoun.lower()} ({hint}) : {adj}.')
            else:
                form = i % 4
                hint = ['masculin singulier', 'féminin singulier', 'masculin pluriel', 'féminin pluriel'][form]
                pronoun = ['Il', 'Elle', 'Ils', 'Elles'][form]
                adj = [m, f, plural(m), plural(f)][form]
                be = 'est' if form < 2 else 'sont'
                action = singular if form < 2 else many
                u.update(kind='production', mode='oral', prompt=f'Fiche fictive : {slug.replace("-", " ")} ({hint}).\nPays de nationalité : {country}.\nActivité : {infinitive(singular)} {complement}.',
                         task='Présentez le personnage ou le groupe. Dites sa nationalité et son activité. Pour poursuivre, présentez une autre personne fictive de votre choix.',
                         answers=[f'{pronoun} {be} {adj} et {action} {complement}.'], writeLines=0,
                         rubric=[{'id': 'nationalite', 'label': 'La nationalité correspond au pays indiqué.'},
                                 {'id': 'accord', 'label': 'Le sujet, être, l’adjectif et l’activité sont accordés.'},
                                 {'id': 'sens', 'label': 'L’activité de la fiche est respectée.'},
                                 {'id': 'oral', 'label': 'La présentation est compréhensible ; d’autres formulations sont possibles.'}],
                         imageSupports=[media[country_key]],
                         explanation='Modèle non exclusif. La nationalité et le genre sont des données de la fiche fictive ; ils ne sont pas déduits d’une apparence ou d’un prénom.')
            bank['units'].append(u)
        banks.append(bank)
    (ROOT/DEST).write_text(json.dumps(banks, ensure_ascii=False, indent=2)+'\n')
    print('Nationalities A1: six activities, eight offerings, 300 units; 17 existing country supports reused.')


if __name__ == '__main__':
    main()
