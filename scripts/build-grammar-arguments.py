"""Build the graded offers for S’expliquer et argumenter and Exprimer quelque chose."""

import json
from collections import defaultdict

from grammar_curriculum.arguments_content import (
    ROOT, begins_vowel, capital, concession, connector, double_pronoun, fill, mode, neuter_relative, opinion,
    options, preposition, read_source, rubric, sentence,
)

THEMES = ('gram-argumenter', 'gram-exprimer')
DATE = '2026-11-27'
READING_VERSIONS = {'k3': 2, 'k4': 2, 'k6': 2, 'k12': 2, 'k13': 3}
REGISTRY = ROOT / 'docs/grammaire/implementation/target-registry.json'
DATA = ROOT / 'src/grammaire/curriculum/data'
SITUATIONS = read_source('situations', ('slug', 'proposal', 'cause', 'nominal', 'result', 'contrast',
                                       'overcame', 'action', 'goal'))
PRONOUNS = read_source('k9', ('slug', 'base', 'directive', 'prompt', 'answer', 'wrong1', 'wrong2'))
PREPOSITIONS = read_source('k11', ('slug', 'subject', 'verb', 'preposition', 'infinitive', 'nominal', 'replacement'))
MODES = read_source('modes', ('slug', 'subject', 'verb', 'indicative', 'subjunctive', 'indicative_past',
                              'subjunctive_past', 'action', 'situation'))
LINK_DOCUMENTS = read_source('lectures-liens', ('slug', 'title', 'genre', 'intro', 'question', 'answer', 'evidence'), 20)
MODE_DOCUMENTS = read_source('lectures-modes', ('slug', 'title', 'genre', 'text', 'trigger_sub', 'accomplished',
                                                'event', 'trigger_ind', 'confirmed', 'question', 'answer', 'evidence',
                                                'question_k13', 'answer_k13', 'evidence_k13'), 20)
BY_SLUG = {row['slug']: row for row in SITUATIONS}


def reference(row, activity, level):
    partition = level.lower()
    return dict(id=f'{activity}-{partition}-{row["slug"]}',
                source=dict(path=row['path'], position=row['position'], typeId=activity, partition=partition))


def context_records(subtheme, level):
    if subtheme == 'k1':
        return [opinion(row) for row in SITUATIONS]
    if subtheme in ('k2', 'k3', 'k4', 'k5', 'k6'):
        return [connector(row, subtheme, level) for row in SITUATIONS]
    if subtheme == 'k7':
        return [concession(row) for row in SITUATIONS]
    if subtheme == 'k8':
        return [neuter_relative(row) for row in SITUATIONS]
    if subtheme == 'k9':
        return [double_pronoun(row) for row in PRONOUNS]
    if subtheme == 'k11':
        return [preposition(row, level) for row in PREPOSITIONS]
    return [mode(row, subtheme) for row in MODES]


def completion(ref, record):
    correct = record['answers'][0]
    alternatives = record.get('alternatives', [])
    unit = dict(**ref, kind='completion', prompt=record['prompt'], cue=record['instruction'],
                answers=[correct, *alternatives], options=options(ref['id'], [correct, *record['wrong']]),
                explanation=f'{record["reason"]} Modèle : {fill(record["prompt"], correct)}')
    if 'verb' in record:
        unit['givenVerb'] = record['verb']
    return unit


def transform(ref, record):
    directive = record.get('directive')
    if not directive:
        directive = (f'Reliez les informations avec la construction « {record["connector"]} ». '
                     'Conservez le lien et le sens des faits.')
    answer = record.get('transform_answer', fill(record['prompt'], record['answers'][0]))
    return dict(**ref, kind='transform', prompt=record['facts'], directive=directive,
                answers=[answer], responseLines=2, explanation=record.get('transform_reason', record['reason']))


def correction(ref, record):
    incorrect = record.get('correction_wrong', record['wrong'][0])
    prompt = record['prompt']
    start = prompt.index('___')
    return dict(**ref, kind='correct', prompt=fill(prompt, incorrect), cue=record['instruction'],
                answers=[fill(prompt, record['answers'][0])], explanation=record['reason'],
                error=dict(segmentId='prompt', start=start, end=start + len(incorrect), text=incorrect),
                responseLines=2)


def ordered(ref, record, subtheme):
    if subtheme == 'k2':
        row = record['source']
        groups = [f'D’abord, {row["cause"]}.', f'Ensuite, {row["result"]}.']
        prompt = 'Placez la situation initiale avant la décision.'
        reason = 'D’abord présente le premier fait. Ensuite annonce le fait qui suit.'
    else:
        model = fill(record['prompt'], record['answers'][0])
        # Keep punctuation and contracted negation in their original token.
        pronouns = record['answers'][0].split(' ')
        left, right = record['prompt'].split('___')
        if left.endswith('’'):
            groups = [left.split()[0], left.split()[1] + pronouns[0], *pronouns[1:], *right.split()]
        else:
            groups = [left.strip(), *pronouns, right.strip()]
        prompt = f'{record["facts"]}\n{record["directive"]}'
        reason = record['reason']
        assert ' '.join(groups) == model
    tokens = [dict(id=f'element-{i}', text=group, category='pronom' if group in
                   ('le', 'la', 'les', 'lui', 'leur', 'y', 'en', 'n’y') else 'verbe')
              for i, group in enumerate(groups, 1)]
    return dict(**ref, kind='order', tokenUnit='clause', prompt=prompt, tokens=tokens,
                answers=[' '.join(groups)], explanation=reason)


def matching(ref, record, subtheme):
    row = record['source']
    if subtheme == 'k1':
        pairs = record['match']
        prompt = f'Proposition : {row["proposal"]}.'
        reason = 'D’accord signale l’approbation. Pas d’accord signale le désaccord.'
    else:
        # Each problem includes a distinct use of the current verb plus an example of the opposite construction.
        counterpart = next(PREPOSITIONS[(row['position'] + step) % len(PREPOSITIONS)]
                           for step in range(1, len(PREPOSITIONS))
                           if PREPOSITIONS[(row['position'] + step) % len(PREPOSITIONS)]['preposition'] != row['preposition'])
        ordered_rows = sorted((row, counterpart), key=lambda item: item['preposition'] != 'à')
        pairs = [(f'{item["subject"]} {item["verb"]} ___ {item["infinitive"]}.',
                  ('d’' if begins_vowel(item['infinitive']) else 'de') if item['preposition'] == 'de' else 'à')
                 for item in ordered_rows]
        prompt = f'Complétez les verbes « {row["verb"]} » et « {counterpart["verb"]} ».'
        reason = 'Chaque verbe régit sa propre préposition. De devient d’ devant une voyelle.'
    return dict(**ref, kind='match', prompt=prompt,
                pairs=[dict(id=f'paire-{i}', left=left, right=right, sourceId=f'{row["slug"]}-{i}')
                       for i, (left, right) in enumerate(pairs, 1)],
                answers=[f'{left} → {right}' for left, right in pairs], explanation=reason)


def production_spec(record, subtheme):
    row = record['source']
    task = {
        'k1': f'{record.get("attitude", "")} Donnez votre avis en citant un fait ou l’objectif de la proposition.',
        'k2': 'Présentez les deux informations à un membre du groupe et employez un connecteur adapté à leur relation.',
        'k3': 'Expliquez la raison de la décision à une personne qui n’était pas présente.',
        'k4': 'Indiquez dans un court message la situation de départ puis sa conséquence.',
        'k5': 'Expliquez à un partenaire pourquoi l’action est prévue. Exprimez le but avec pour ou afin de suivi d’un infinitif.',
        'k6': 'Présentez les deux faits à une personne de votre groupe et mettez-les en contraste.',
        'k7': 'Expliquez à un camarade ce qui s’est produit malgré l’obstacle. Marquez la concession.',
        'k12': 'Décrivez la réaction indiquée à un membre de votre groupe. Employez le subjonctif passé pour le fait accompli.',
        'k13': 'Présentez l’information selon l’expression demandée. Choisissez le mode et le temps appropriés.',
    }[subtheme]
    source = record['facts']
    if subtheme in ('k12', 'k13'):
        task += ' ' + record['directive']
    elif subtheme == 'k2':
        task += ' ' + record['instruction']
    model = record.get('model', fill(record['prompt'], record['answers'][0]))
    follow, reply = {
        'k1': ('De quelle proposition parlez-vous ?', f'De la proposition suivante : {row.get("proposal", "")}.'),
        'k2': ('Quel fait explique la décision ?', sentence(row.get('cause') or 'le fait présenté')),
        'k3': ('Quelle décision est expliquée ?', sentence(row.get('result') or 'la décision annoncée')),
        'k5': ('Quelle action permet de poursuivre cet objectif ?', sentence(row.get('action') or 'l’action annoncée')),
        'k6': ('Quelle situation différente peut-on aussi observer ?', sentence(row.get('contrast') or 'la situation annoncée')),
        'k7': ('Quel obstacle fallait-il surmonter ?', source.split('. ', 1)[0] + '.'),
    }.get(subtheme, ('Quel détail faut-il retenir ?', model))
    if subtheme in ('k2', 'k6') and reply not in source:
        source += '\nAutre information : ' + reply
    return source, task, model, follow, reply


def open_task(ref, record, subtheme, presentation):
    source, task, answer, follow, reply = production_spec(record, subtheme)
    oral = presentation != 'open-written'
    criteria = rubric('Construction demandée et lien entre les faits clairement exprimés.', oral)
    explanation = f'{record["reason"]} Les reformulations fidèles sont recevables.'
    if presentation == 'scenario-set':
        opening = 'Quel est votre avis ?' if subtheme == 'k1' else 'Quel est le but de cette action ?'
        return dict(**ref, kind='scenario', contract='open', prompt='Un échange à deux',
                    situation=source, task=task + ' Répondez à la relance puis échangez les rôles.',
                    roles=[dict(id='a', label='Personne A', goal='Formulez la réponse et précisez-la.'),
                           dict(id='b', label='Personne B', goal='Posez les questions puis écoutez la réponse.')],
                    turns=[dict(id='debut', roleId='b', text=opening)], followUps=[follow], writeLines=0, rubric=criteria,
                    answers=[f'Personne B : {opening}\nPersonne A : {answer}\nPersonne B : {follow}\nPersonne A : {reply}'],
                    explanation=explanation)
    if oral:
        task = f'{task} Relance : « {follow} »'
        answer = f'{answer}\nRéponse possible à la relance : {reply}'
    return dict(**ref, kind='production', mode='oral' if oral else 'written', prompt=source, task=task,
                answers=[answer], rubric=criteria, explanation=explanation, writeLines=0 if oral else 4)


def make_question(unit_id, index, prompt, answer, evidence, alternatives=()):
    id_ = f'{unit_id}-q{index}'
    item = dict(id=id_, prompt=prompt, answers=[answer], evidence=evidence,
                response='choice' if alternatives else 'short',
                explanation='Les passages cités permettent de répondre.')
    if alternatives:
        item['options'] = options(id_, [answer, *alternatives])
    return item


def link_reading(doc, ref, subtheme):
    row = BY_SLUG[doc['slug']]
    cause, result, contrast, action = (sentence(row[key]) for key in ('cause', 'result', 'contrast', 'action'))
    goal = f'L’objectif est le suivant : {row["goal"]}.'
    cause_statement = f'{result.removesuffix(".")}, car {row["cause"]}.'
    result_statement = f'C’est pourquoi {row["result"]}.'
    contrast_statement = f'En revanche, {row["contrast"]}.'
    sections = {
        'k2': [doc['intro'], f'{cause} {result} {contrast}', f'{action} {goal}'],
        'k3': [doc['intro'], f'{cause_statement} {action} {goal}'],
        'k4': [doc['intro'], f'{cause} {result_statement} {action} {goal}'],
        'k6': [doc['intro'], f'{cause} {result} {contrast_statement}', f'{action} {goal}'],
    }[subtheme]
    primary = {
        'k2': ('Quel connecteur peut introduire le deuxième de ces deux faits comme conséquence ? '
               f'« {cause} » Puis « {result} »', 'Par conséquent', [cause, result], ['En revanche', 'En effet']),
        'k3': ('Quelle raison est donnée après le mot « car » dans le deuxième paragraphe ?',
               cause, [cause_statement], [result, action]),
        'k4': ('Quelle conséquence est introduite par « C’est pourquoi » ?', result,
               [cause, result_statement], [cause, action]),
        'k6': (f'Quel fait le document met-il en contraste avec « {result} » ?', contrast,
               [result, contrast_statement], [cause, action]),
    }[subtheme]
    secondary = {
        'k2': ('Quel objectif est indiqué ?', capital(row['goal']) + '.', [goal]),
        'k3': ('Quelle autre action a été entreprise pour améliorer la situation ?', action, [action]),
        'k4': ('Quel fait est présenté au début du deuxième paragraphe ?', cause, [cause]),
        'k6': ('Quelle action a été menée pour répondre à la situation ?', action, [action]),
    }[subtheme]
    text = '\n'.join(sections)
    return text, [
        make_question(ref['id'], 1, *primary),
        make_question(ref['id'], 2, *secondary),
        make_question(ref['id'], 3, doc['question'], doc['answer'], [doc['evidence']]),
    ]


def mode_reading(doc, ref, subtheme):
    text = doc['text'].replace('^', '\n')
    if subtheme == 'k12':
        first = (f'Quel mode et quel temps reconnaissez-vous dans « {doc["accomplished"]} » ?',
                 'Subjonctif passé', [doc['accomplished']], ['Indicatif passé composé', 'Subjonctif présent'])
        second = ('Quel fait est déjà accompli au moment de la réaction ?', doc['event'], [doc['accomplished']])
    else:
        first = (f'Quel mode suit l’expression « {doc["trigger_ind"]} » ?',
                 'Indicatif', [doc['trigger_ind'], doc['confirmed']], ['Subjonctif', 'Impératif'])
        second = ('Quelle information le texte présente-t-il comme confirmée ?',
                  capital(doc['confirmed']) + '.', [doc['confirmed']])
    questions = [first, second, (doc['question'], doc['answer'], [doc['evidence']])]
    if subtheme == 'k13':
        questions.append((doc['question_k13'], doc['answer_k13'], [doc['evidence_k13']]))
    return text, [make_question(ref['id'], index, *question)
                  for index, question in enumerate(questions, 1)]


def reading_bank(bank):
    subtheme, level, activity = bank['subthemeId'], bank['level'], bank['activityId']
    units = []
    for source in MODE_DOCUMENTS if subtheme in ('k12', 'k13') else LINK_DOCUMENTS:
        ref = reference(source, activity, level)
        if subtheme in ('k12', 'k13'):
            text, questions = mode_reading(source, ref, subtheme)
        else:
            text, questions = link_reading(source, ref, subtheme)
        assert all(quote in text for question in questions for quote in question['evidence']), ref['id']
        units.append(dict(**ref, kind='reading', prompt=source['title'], genre=source['genre'], text=text,
                          answers=[], questions=questions, responseLines=1,
                          explanation='Chaque réponse s’appuie sur un passage précis du document.'))
    return units


def activity_plan():
    data = json.loads(REGISTRY.read_text(encoding='utf-8'))
    activities = {item['activityId']: item for item in data['activities']}
    notions = {(item['pedagogicalNotionId'], item['level']): item for item in data['notionLevels']}
    grouped = defaultdict(list)
    for offer in data['offerings']:
        sub = offer['pedagogicalNotionId']
        if offer['themeId'] in THEMES and sub != 'k10':
            grouped[offer['activityId'], offer['level']].append(offer)
    return grouped, activities, notions


INSTRUCTIONS = {
    'choice': 'Choisissez la forme ou l’expression qui correspond à la consigne.',
    'gap': 'Complétez selon la situation et la consigne.',
    'match': 'Associez chaque élément de gauche à l’élément correspondant.',
    'scenario-set': 'Jouez l’échange à deux selon les rôles et les relances.',
    'open-written': 'Rédigez une réponse adaptée à la situation.',
    'open-oral': 'Répondez à l’oral puis répondez à la relance.',
    'transform': 'Réécrivez le texte selon la consigne.',
    'correct': 'Corrigez le passage signalé puis réécrivez l’énoncé.',
    'order': 'Remettez les éléments dans l’ordre et écrivez le résultat.',
    'document-set': 'Lisez chaque document et répondez aux questions.',
}


def build():
    plan, activities, notions = activity_plan()
    by_subtheme = defaultdict(list)
    for (activity, level), offers in plan.items():
        first = offers[0]
        subtheme, topic = first['pedagogicalNotionId'], first['themeId']
        notion = notions[subtheme, level]
        presentations = [offer['presentation'] for offer in offers]
        primary = presentations[0]
        version = READING_VERSIONS.get(subtheme, 1) if primary == 'document-set' else 1
        bank = dict(schemaVersion=1, revision=f'arguments-{DATE}-v{version}', activityId=activity, subthemeId=subtheme,
                    topic=topic, level=level, label=activities[activity]['label'],
                    objective=first.get('objective') or notion['label'], editorialStatus='reviewed',
                    review=dict(reviewer='Codex — revue linguistique et fonctionnelle', date=DATE,
                                humanReview='pending',
                                note='Les documents sont partagés entre banques avec des questions propres à chaque objectif.'),
                    presentations=presentations, instructions={p: INSTRUCTIONS[p] for p in presentations})
        if primary == 'document-set':
            bank['units'] = reading_bank(bank)
        else:
            units = []
            for record in context_records(subtheme, level):
                ref = reference(record['source'], activity, level)
                if primary in ('choice', 'gap'):
                    unit = completion(ref, record)
                elif primary == 'transform':
                    unit = transform(ref, record)
                elif primary == 'correct':
                    unit = correction(ref, record)
                elif primary == 'order':
                    unit = ordered(ref, record, subtheme)
                elif primary == 'match':
                    unit = matching(ref, record, subtheme)
                else:
                    unit = open_task(ref, record, subtheme, primary)
                units.append(unit)
            bank['units'] = units
        by_subtheme[subtheme].append(bank)
    assert len(by_subtheme) == 12 and sum(len(offers) for offers in plan.values()) == 73
    for subtheme, banks in by_subtheme.items():
        (DATA / f'{subtheme}.json').write_text(json.dumps(banks, ensure_ascii=False, indent=2) + '\n',
                                             encoding='utf-8')
    print(json.dumps(dict(activities=len({activity for activity, _ in plan}), banks=len(plan), offerings=73,
                          units=sum(len(b['units']) for banks in by_subtheme.values() for b in banks))))


if __name__ == '__main__':
    build()
