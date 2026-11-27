"""Editorial transformations for the last two graded grammar themes."""

import csv
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SOURCE = Path('scripts/grammar_curriculum')
VOWEL = 'aàâäæeéèêëiîïoôöœuùûüyÿ'


def read_source(name, fields, expected=50):
    path = SOURCE / f'arguments-{name}.tsv'
    with (ROOT / path).open(encoding='utf-8', newline='') as handle:
        raw = [row for row in csv.reader(handle, delimiter='|') if row and not row[0].startswith('#')]
    assert len(raw) == expected and len({row[0] for row in raw}) == expected, path
    assert all(len(row) <= len(fields) for row in raw), path
    return [dict(zip(fields, row + [''] * (len(fields) - len(row))),
                 position=i, path=path.as_posix()) for i, row in enumerate(raw)]


def capital(text):
    return text[0].upper() + text[1:]


def begins_vowel(text):
    return text[0].lower() in VOWEL


def fill(prompt, answer):
    marker = '___ ' if answer.endswith('’') and '___ ' in prompt else '___'
    return prompt.replace(marker, answer, 1)


def options(marker, values):
    assert len(set(values)) == len(values), (marker, values)
    return [dict(id=f'{marker}-choix-{i}', text=value) for i, value in enumerate(values, 1)]


def rubric(criterion, oral):
    return [dict(id='faits', label='Informations et personnes de la situation respectées.'),
            dict(id='construction', label=criterion),
            dict(id='message', label='Réponse claire à la question et à la relance.' if oral
                 else 'Message complet et compréhensible pour son destinataire.')]


def lessons_row(source, prompt, answer, wrong1, wrong2, instruction, reason, **extra):
    return dict(source=source, prompt=prompt, answers=[answer], wrong=[wrong1, wrong2],
                instruction=instruction, reason=reason, **extra)


def conjunction(word, clause, upper=False):
    if word.endswith(' que') and begins_vowel(clause):
        word = word[:-1] + '’'
    return capital(word) if upper else word


def sentence(clause):
    return f'{capital(clause)}.'


def join_facts(*clauses):
    return ' '.join(map(sentence, clauses))


def connector(row, kind, level):
    cause, result = row['cause'], row['result']
    field = row['position']
    if kind == 'k2' and level == 'A2':
        relation = field % 5
        if relation == 0:
            correct = conjunction('parce que', cause)
            out = (f'{capital(result)} ___ {cause}.', correct, 'pour que', 'bien que',
                   'Reliez la décision à sa cause.', 'Parce que introduit la cause de la décision.', (result, cause))
        elif relation == 1:
            out = (f'{capital(result)}, ___ {row["contrast"]}.', 'mais', 'parce que', 'pour que',
                   'Marquez le contraste entre les deux faits.', 'Mais met ici deux décisions en contraste.', (result, row['contrast']))
        elif relation == 2:
            out = (f'{sentence(cause)} ___, {result}.', 'Donc', 'Pourtant', 'D’abord',
                   'Introduisez la conséquence du premier fait.', 'Donc introduit la conséquence.', (cause, result))
        elif relation == 3:
            out = (f'{sentence(cause)} ___, {result}.', 'Ensuite', 'Pourtant', 'En effet',
                   'Indiquez ce qui se passe après le premier fait.', 'Ensuite place la décision après le premier fait.', (cause, result))
        else:
            out = (f'{capital(result)} ___ {row["action"]}.', 'et', 'pour que', 'bien que',
                   'Ajoutez une deuxième information sans indiquer de cause.', 'Et permet d’ajouter un deuxième fait.', (result, row['action']))
    elif kind == 'k2':
        relation = field % 4
        if relation == 0:
            out = (f'{sentence(cause)} ___, {result}.', 'Par conséquent', 'En revanche', 'Par exemple',
                   'Présentez la conséquence du fait précédent.', 'Par conséquent annonce le résultat du fait précédent.', (cause, result))
        elif relation == 1:
            out = (f'{sentence(result)} ___, {cause}.', 'En effet', 'En revanche', 'Par conséquent',
                   'Justifiez la décision par le deuxième fait.', 'En effet introduit ici une justification.', (result, cause))
        elif relation == 2:
            out = (f'{sentence(result)} ___, {row["contrast"]}.', 'En revanche', 'Par conséquent', 'En effet',
                   'Mettez les deux faits en contraste.', 'En revanche signale un contraste entre deux faits.', (result, row['contrast']))
        else:
            out = (f'{sentence(result)} ___, {row["action"]}.', 'De plus', 'C’est pourquoi', 'En revanche',
                   'Ajoutez un autre fait sans le présenter comme une conséquence.', 'De plus ajoute un argument ou une information.', (result, row['action']))
    elif kind == 'k3':
        if field % 3 == 0 or row['nominal'].startswith('grâce'):
            nominal = row['nominal']
            prep = next(prep for prep in ('à cause de', 'à cause du', 'à cause des', 'à cause d’',
                                         'grâce à', 'grâce au', 'grâce aux')
                        if nominal == prep or nominal.startswith(prep + ' ') or prep.endswith('’') and nominal.startswith(prep))
            suffix = nominal[len(prep):].lstrip()
            direction = 'positive (favorable)' if prep.startswith('grâce') else 'négative (qui pose un problème)'
            if prep.endswith('’'):
                directive = f'Indiquez une cause {direction}. Écrivez l’expression avec son élision.'
            else:
                directive = f'Indiquez une cause {direction} avec le groupe de mots donné.'
            out = (f'{capital(result)} ___ {suffix}.', prep, 'afin de', 'pour que',
                   directive, f'« {nominal} » indique la cause de la décision.', (result, cause))
        elif field % 3 == 1:
            out = (f'{capital(result)}, ___ {cause}.', 'car', 'malgré', 'pour que',
                   'Introduisez la cause avec une conjonction de coordination.', 'La conjonction car introduit ici une cause.', (result, cause))
        else:
            prep = conjunction('parce que', cause)
            out = (f'{capital(result)} ___ {cause}.', prep, 'afin de', 'même si',
                   'Introduisez une cause dans une phrase subordonnée.', 'Parce que relie une action à sa cause.', (result, cause))
    elif kind == 'k4':
        intensifiers = {
            'porte': 'le bouton était si haut', 'courrier': 'le guichet fermait si tôt',
            'horaire': 'le texte était si petit', 'gilets': 'les gilets étaient si grands',
            'colis': 'le camion était si haut', 'photos': 'la salle du haut était si difficile à trouver',
            'chariot': 'les caisses étaient si lourdes', 'meubles': 'la porte du petit local était si étroite',
            'ramassage': 'la rue était si étroite', 'salle': 'la salle était si petite',
        }
        if row['slug'] in intensifiers:
            correct = 'qu’' if begins_vowel(result) else 'que'
            return lessons_row(row, f'{capital(intensifiers[row["slug"]])} ___ {result}.',
                               correct, 'mais', 'parce que',
                               'Terminez la construction si + adjectif ou adverbe + que.',
                               'Si marque un degré élevé. Que introduit la conséquence.', facts=join_facts(cause, result),
                               connector='si… que')
        connectors = ('Donc', 'Alors', 'C’est pourquoi')
        correct = connectors[field % len(connectors)]
        out = (f'{sentence(cause)} ___{"," if correct != "C’est pourquoi" else ""} {result}.',
               correct, 'Malgré', 'Pourtant', 'Présentez la conséquence de la situation initiale.',
               f'« {correct} » introduit le résultat qui découle du fait précédent.', (cause, result))
    elif kind == 'k5':
        goal = row['goal']
        correct = ('afin d’' if begins_vowel(goal) else 'afin de') if field % 2 else 'pour'
        out = (f'{capital(row["action"])} ___ {goal}.', correct, 'parce que', 'bien que',
               'Introduisez le but de l’action avant le verbe à l’infinitif.',
               'Le groupe à l’infinitif exprime le but. La même personne fait l’action et vise le résultat.',
               (row['action'],))
    else:
        if level == 'A2':
            word = ('mais', 'alors que', 'tandis que')[field % 3]
            correct = conjunction(word, row['contrast'])
            out = (f'{capital(result)}, ___ {row["contrast"]}.', correct, 'pour que', 'parce que',
                   'Mettez en contraste les deux comportements.', 'Le lien souligne une différence entre les deux faits.',
                   (result, row['contrast']))
        else:
            choice = concession(row) if field % 3 != 1 else None
            if choice and choice['answers'][0] in ('Malgré', 'Pourtant'):
                return choice
            out = (f'{sentence(result)} ___, {row["contrast"]}.', 'En revanche', 'Par conséquent', 'En effet',
                   'Comparez les deux situations en soulignant leur différence.',
                   'En revanche met en évidence un contraste entre les deux situations.', (result, row['contrast']))

    prompt, correct, bad, other, instruction, reason, facts = out
    source_text = join_facts(*facts)
    if kind == 'k5':
        source_text += f'\nObjectif : {row["goal"]}.'
    alternatives = []
    if kind == 'k5':
        alternatives.append(('afin d’' if begins_vowel(row['goal']) else 'afin de') if correct == 'pour' else 'pour')
    elif kind == 'k4':
        alternatives = {
            'Donc': ['Alors', 'Par conséquent'], 'Alors': ['Donc', 'Par conséquent'], 'C’est pourquoi': [],
        }[correct]
    elif kind == 'k6' and level == 'A2':
        alternatives = [conjunction(w, row['contrast']) for w in ('mais', 'alors que', 'tandis que')
                        if conjunction(w, row['contrast']) != correct]
    return lessons_row(row, prompt, correct, bad, other, instruction, reason, facts=source_text,
                       alternatives=alternatives, connector=correct)


CONCESSION_SUBJ = {
    'cour': 'la cour soit inondée', 'porte': 'le bouton soit trop haut', 'fuite': 'une fuite ait mouillé le plafond',
    'sacs': 'les sacs soient presque identiques', 'horaire': 'le texte soit trop petit',
    'tournoi': 'le terrain soit détrempé', 'ascenseur': 'l’ascenseur soit en panne',
    'eau': 'la conduite doive être changée', 'colis': 'le camion soit trop haut',
    'foret': 'la tempête ait fait tomber des branches', 'equipage': 'plusieurs personnes n’aient pas reçu le planning',
    'meubles': 'la porte du petit local soit étroite', 'gants': 'les gants d’une apprentie aient pris l’eau',
}
CONCESSION_OTHER_CAUSE = {
    'bibliobus': ('le choix de livres était réduit', 'le petit choix de livres'),
    'vitrine': ('les objets n’avaient pas tous d’étiquette', 'les étiquettes manquantes'),
    'atelier': ('l’atelier avait peu de matériel', 'le manque de matériel'),
    'badge': ('la livraison était en retard', 'le retard de livraison'),
    'graines': ('les outils habituels manquaient', 'le manque d’outils'),
}


def concession(row):
    cause = row['cause']
    nominal = row['nominal']
    if row['slug'] in CONCESSION_OTHER_CAUSE:
        cause, group = CONCESSION_OTHER_CAUSE[row['slug']]
    else:
        expansions = {'à cause du ': 'le ', 'à cause des ': 'les ', 'à cause d’': '', 'à cause de ': ''}
        prefix = next(p for p in expansions if nominal.startswith(p))
        group = expansions[prefix] + nominal[len(prefix):]
    result = row['overcame'].replace(' quand même', '').replace(' tout de même', '')
    if row['slug'] == 'badge':
        result = 'les visiteurs ont été accueillis'
    if row['slug'] == 'bibliobus':
        result = 'les lecteurs ont trouvé des ouvrages qui leur convenaient'
    if row['slug'] == 'graines':
        result = 'les enfants ont planté les graines'
    if row['slug'] in CONCESSION_SUBJ:
        obstacle = CONCESSION_SUBJ[row['slug']]
        prompt = f'___ {obstacle}, {result}.'
        correct = conjunction('bien que', obstacle, upper=True)
        bad, other = 'Même si', 'Malgré'
        reason = 'Bien que se construit avec le subjonctif.'
        cue = 'Reliez l’obstacle au résultat inattendu en tenant compte du mode verbal.'
    elif row['position'] % 3 == 0:
        prompt = f'___ {group}, {result}.'
        correct, bad, other = 'Malgré', 'Parce que', 'Alors que'
        reason = 'Malgré introduit un groupe nominal qui présente un obstacle.'
        cue = 'Présentez l’obstacle exprimé par le groupe nominal.'
    elif row['position'] % 3 == 1:
        prompt = f'___ {cause}, {result}.'
        correct, bad, other = 'Même si', 'Bien que', 'Malgré'
        reason = 'Même si introduit un fait à l’indicatif.'
        cue = 'Reliez l’obstacle au résultat inattendu en tenant compte du mode verbal.'
    else:
        prompt = f'{sentence(cause)} ___, {result}.'
        correct, bad, other = 'Pourtant', 'Par conséquent', 'En effet'
        reason = 'Pourtant marque un résultat inattendu malgré l’obstacle.'
        cue = 'Présentez le résultat inattendu malgré l’obstacle.'
    return lessons_row(row, prompt, correct, bad, other, cue, reason,
                       facts=join_facts(cause, result), connector=correct,
                       alternatives=['Cependant', 'Néanmoins'] if correct == 'Pourtant' else [])


def opinion(row):
    approve = row['position'] % 2 == 0
    answer = 'd’accord' if approve else 'en désaccord'
    reverse = 'en désaccord' if approve else 'd’accord'
    attitude = 'Vous soutenez cette proposition.' if approve else 'Vous vous opposez à cette proposition.'
    suggestion = f'Proposition : {row["proposal"]}.'
    future = f'Le but est de {row["goal"]}.' if not begins_vowel(row['goal']) else f'Le but est d’{row["goal"]}.'
    supporting = f'{suggestion}\n{sentence(row["cause"])} {future}'
    model = (f'Je suis d’accord avec cette proposition. {future}' if approve else
             f'Je ne suis pas d’accord avec cette proposition. Je préférerais d’abord discuter d’autres solutions pour {row["goal"]}.')
    manner = ('d’' if begins_vowel(row['goal']) else 'de ') + row['goal']
    return lessons_row(row, 'Je suis ___ avec cette proposition.', answer, reverse, 'en charge',
                       f'{suggestion} {attitude}', 'L’expression choisie doit correspondre à la position indiquée.',
                       facts=supporting, model=model, attitude=attitude,
                       match=[
                           (f'Approuver : {row["proposal"]}', f'Je suis d’accord. Cela peut aider à {row["goal"]}.'),
                           (f'Désapprouver : {row["proposal"]}', f'Je ne suis pas d’accord. Cherchons une autre façon {manner}.'),
                       ])


NEUTRAL_RULES = (
    ('ce qui', 'Ce qui', '___ explique la décision, c’est le fait suivant : {fact}.',
     'Voici le point qui explique la décision : {fact}.', 'Le relatif est sujet du verbe « explique ».'),
    ('ce que', 'Ce que', '___ l’on propose, c’est de {fact}.',
     'Voici le contenu de la proposition : {fact}.', 'Le relatif est complément direct de « propose ».'),
    ('ce dont', 'Ce dont', '___ on parle, c’est de la proposition suivante : {fact}.',
     'Les personnes parlent de cette proposition : {fact}.', 'Parler de se reprend avec ce dont.'),
)


def neuter_relative(row):
    answer, capital_answer, pattern, base, rationale = NEUTRAL_RULES[row['position'] % len(NEUTRAL_RULES)]
    fact = row['cause'] if answer == 'ce qui' else row['proposal']
    distractors = [capital(other) for other, *_ in NEUTRAL_RULES if other != answer]
    return lessons_row(row, pattern.format(fact=fact), capital_answer, *distractors,
                       'Choisissez le pronom relatif neutre selon la fonction dans la proposition.', rationale,
                       facts=base.format(fact=fact), directive='Reformulez en commençant par le pronom relatif neutre adapté : ce qui, ce que ou ce dont.')


def double_pronoun(row):
    reason = ('Y précède en. La quantité et la négation éventuelles restent en place.' if row['answer'] == 'y en' else
              'Le, la ou les précède lui ou leur. Les pronoms se placent devant le verbe qui les régit.')
    return lessons_row(row, row['prompt'], row['answer'], row['wrong1'], row['wrong2'],
                       f'{row["base"]} {row["directive"]}', reason, facts=row['base'], directive=row['directive'])


def preposition(row, level):
    subject, verb, core, infinitive = (row[key] for key in ('subject', 'verb', 'preposition', 'infinitive'))
    answer = 'd’' if core == 'de' and begins_vowel(infinitive) else core
    wrong = 'à' if core == 'de' else ('d’' if begins_vowel(infinitive) else 'de')
    prompt = f'{subject} {verb} ___ {infinitive}.'
    meaning = f'Le verbe « {verb} » se construit ici avec {core} devant l’infinitif.'
    direct = f'Complétez la construction du verbe « {verb} » avec l’infinitif indiqué.'
    facts = f'{subject} {verb}. Action envisagée : {infinitive}.'
    order = 'Réunissez les informations dans une phrase. Respectez la préposition du verbe.'
    compiled = lessons_row(row, prompt, answer, wrong, 'pour', direct, meaning, facts=facts, directive=order)
    if level == 'B1' and row['replacement']:
        nominal = row['nominal']
        prefix = next(part for part in ('à ', 'au ', 'aux ', 'de ', 'du ', 'des ', 'd’') if nominal.startswith(part))
        answer = prefix.strip()
        noun = nominal[len(prefix):]
        wrong = 'avec' if core == 'à' else 'à'
        compiled.update(prompt=f'{subject} {verb} ___ {noun}.', answers=[answer], wrong=[wrong, 'sans'],
                        instruction='Complétez le groupe nominal avec la préposition régie par le verbe. Faites la contraction ou l’élision si nécessaire.',
                        reason=f'Le groupe « {nominal} » respecte le régime du verbe.',
                        correction_wrong=wrong)
        replacement = row['replacement']
        reflexives = ('s’', 'se ', 'me ', 'te ', 'nous ', 'vous ')
        reflexive = next((part for part in reflexives if verb.startswith(part)), '')
        if reflexive:
            stem = verb[len(reflexive):]
            joint = {'s’': 's’', 'se ': 's’', 'me ': 'm’', 'te ': 't’', 'nous ': 'nous ', 'vous ': 'vous '}[reflexive]
            pronoun_group = f'{joint}{replacement}'
        else:
            stem, pronoun_group = verb, replacement
        compiled.update(
            facts=f'{subject} {verb} {row["nominal"]}.',
            directive='Remplacez le groupe introduit par la préposition par y ou en. Gardez le sujet et le temps.',
            transform_answer=f'{subject} {pronoun_group} {stem}.',
            transform_reason=f'Le groupe « {row["nominal"]} » se reprend ici par {replacement}.',
        )
    return compiled


TRIGGERS_PAST = (
    'Le groupe se réjouit', 'On s’étonne', 'La personne responsable apprécie',
    'On est soulagé', 'On ne s’attendait pas à ce',
)
TRIGGERS_MODES = (
    ('Le groupe doute', True), ('Le service confirme', False), ('Il est possible', True),
    ('On est certain', False), ('La personne responsable souhaite', True), ('Il est évident', False),
)


def mode(row, kind):
    subject, action = row['subject'], row['action']
    past = kind == 'k12' or row['indicative'] == row['subjunctive'] or row['position'] % 5 >= 3
    if kind == 'k12':
        trigger, subj = TRIGGERS_PAST[row['position'] % len(TRIGGERS_PAST)], True
    else:
        trigger, subj = TRIGGERS_MODES[row['position'] % len(TRIGGERS_MODES)]
        if past and trigger.endswith('souhaite'):
            trigger = 'La personne responsable regrette'
    key = 'subjunctive' if subj else 'indicative'
    other = 'indicative' if subj else 'subjunctive'
    ending = '_past' if past else ''
    expected, bad = row[key + ending], row[other + ending]
    assert expected != bad
    clause_link = 'qu’' + subject if begins_vowel(subject) else 'que ' + subject
    prompt = f'{trigger} {clause_link} ___ {action}.'
    key_name = 'subjonctif' if subj else 'indicatif'
    time = 'L’action est antérieure à la réaction ou à l’annonce.' if past else 'Il s’agit de la situation au moment où l’on parle.'
    reason = f'« {trigger} que » appelle ici le {key_name}.'
    if past:
        reason += ' Le temps composé situe l’action avant le moment dont on parle.'
    if kind == 'k12':
        lead = f'{row["situation"]} {time} Complétez au subjonctif passé.'
    else:
        lead = f'{row["situation"]} {time} Choisissez le mode d’après l’expression introductrice.'
    directive = f'Reformulez avec « {trigger} que ». Conservez les faits et le repère temporel.'
    knowledge = 'Information envisagée' if subj and kind == 'k13' and not trigger.endswith('regrette') else 'Fait'
    facts = f'{row["situation"]}\n{knowledge} : {subject} {row["indicative" + ending]} {action}.\n{time}'
    return lessons_row(row, prompt, expected, bad, row['verb'], lead, reason,
                       facts=facts, directive=directive, verb=row['verb'])
