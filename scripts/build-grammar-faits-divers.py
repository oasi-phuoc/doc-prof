"""Compile the graded facts-divers banks from the reviewed French source files."""

import csv
import json
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCES = Path('scripts/grammar_curriculum')
DATA = ROOT / 'src/grammaire/curriculum/data'
DATE = '2026-11-27'
REVISION = f'faits-divers-{DATE}-v1'
PLANS = {
    ('j6', 'B1'): ('q', 't', 'c', 'd'),
    ('j7', 'B1'): ('q', 't', 'c', 'ce', 'pe', 'po'),
    ('j8', 'A2'): ('q', 's', 'p'),
    ('j8', 'B1'): ('q', 't', 's', 'p'),
    ('j9', 'A2'): ('q', 't'),
    ('j9', 'B1'): ('q', 't', 'e', 'p'),
    ('j10', 'B1'): ('q', 't', 'c', 'e', 'p'),
}
OBJECTIVES = {
    ('j6', 'B1'): 'Passer de l’actif au passif et inversement, en conservant le sens, le temps et les accords.',
    ('j7', 'B1'): 'Rapporter des paroles, des questions et des demandes en adaptant les personnes, les temps et les repères.',
    ('j8', 'A2'): 'Exprimer un souhait ou proposer un conseil au conditionnel présent.',
    ('j8', 'B1'): 'Signaler une information incertaine au conditionnel présent, en attribuant la source et en précisant la vérification à faire.',
    ('j9', 'A2'): 'Relier une condition possible au présent à sa conséquence au futur simple.',
    ('j9', 'B1'): 'Imaginer une autre situation présente avec si + imparfait et le conditionnel présent.',
    ('j10', 'B1'): 'Exprimer un regret, un reproche ou une conséquence non réalisée avec le conditionnel passé.',
}
COMPLETION_LABELS = {
    'j6': 'Former le passif',
    'j7': 'Rapporter une parole',
    'j8': 'Conjuguer au conditionnel',
    'j9': 'Imaginer une condition',
    'j10': 'Former le conditionnel passé',
}
PRESENTATIONS = {
    't': ('transform', 'Transformer une phrase', 'Reformulez selon la consigne.'),
    'c': ('correct', 'Corriger l’erreur', 'Réécrivez la phrase entière en corrigeant la partie signalée.'),
    'd': ('document-set', 'Lire et répondre', 'Lisez le document et répondez aux questions.'),
    'ce': ('document-set', 'Lire une situation', 'Lisez le document et répondez aux questions.'),
    'e': ('open-written', 'Produire à l’écrit', 'Rédigez dans l’espace prévu en suivant la consigne.'),
    'pe': ('open-written', 'Écrire une phrase utile', 'Rapportez la parole à l’écrit.'),
    'p': ('open-oral', 'S’exprimer à l’oral', 'Présentez votre réponse et répondez à la relance.'),
    'po': ('open-oral', 'Dire une phrase utile', 'Rapportez la parole et répondez à la relance.'),
    's': ('scenario-set', 'Jouer une situation', 'Jouez l’échange à deux en suivant les rôles.'),
}
SPEECH_RULES = {
    'simultane': 'Dans cette parole au passé, l’imparfait marque un fait en cours au moment où la personne parlait.',
    'posterieur': 'Le conditionnel présent marque ici un événement prévu après les paroles rapportées au passé.',
    'anterieur': 'Le plus-que-parfait situe le fait avant les paroles rapportées au passé.',
    'repere': 'Le repère se calcule depuis le moment ou le lieu de la parole d’origine.',
    'fermee': 'Une question à laquelle on peut répondre par oui ou non est introduite par si, élidé en s’ devant il ou ils.',
    'ouverte': 'Gardez l’interrogatif adapté et l’ordre d’une phrase indirecte. Qu’est-ce qui et qu’est-ce que deviennent ce qui et ce que.',
    'demande': 'Une demande d’action peut être rapportée avec demander à quelqu’un de + infinitif.',
}
PASSIVE_AUX = {
    'pc': ('a été', 'ont été', 'passé composé'),
    'present': ('est', 'sont', 'présent'),
    'futur': ('sera', 'seront', 'futur simple'),
    'imp': ('était', 'étaient', 'imparfait'),
}
CONDITIONAL_ENDINGS = {
    'je': 'ais', 'tu': 'ais', 'il': 'ait', 'nous': 'ions', 'vous': 'iez', 'ils': 'aient',
}
CONDITIONAL_STEMS = {
    'accueillir': 'accueiller', 'avoir': 'aur', 'devoir': 'devr', 'être': 'ser', 'faire': 'fer',
    'pouvoir': 'pourr', 'recevoir': 'recevr', 'venir': 'viendr', 'vouloir': 'voudr',
}
PAST_AUX = {
    'avoir': 'aur',
    'etre': 'ser',
}
PAST_INTENTIONS = {
    'regret': 'Exprimez le regret ou le souhait non réalisé lié à ce fait passé.',
    'reproche': 'Exprimez le reproche lié à ce fait passé.',
    'hypothese': 'Exprimez la conséquence qui ne s’est pas réalisée.',
}
CRITERIA_FACTS = 'Faits, personnes et repères conservés.'
CRITERIA_ORAL = 'Réponse intelligible et cohérente à la relance.'


def read_source(name, columns, count=50):
    path = SOURCES / f'faits-{name}.tsv'
    with (ROOT / path).open(encoding='utf-8', newline='') as handle:
        rows = [row for row in csv.reader(handle, delimiter='|') if row and not row[0].startswith('#')]
    assert len(rows) == count, path
    assert len({row[0] for row in rows}) == count, path
    assert all(len(row) == len(columns) and all(unicodedata.is_normalized('NFC', s) for s in row)
               for row in rows), path
    return [dict(zip(columns, row), path=path.as_posix(), position=i) for i, row in enumerate(rows)]


def activity_id(subtheme, mechanic):
    if mechanic == 'q':
        suffix = 'qcm-conj' if subtheme in ('j8', 'j10') else 'qcm-verbe'
    elif mechanic in ('ce', 'pe', 'po'):
        suffix = f'communication-{mechanic}'
    else:
        suffix = f'curriculum-{mechanic}'
    return f'gram-ex-{subtheme}-{suffix}'


def references(activity, level, row):
    partition = level.lower()
    return {
        'id': f'{activity}-{partition}-{row["slug"]}',
        'source': dict(path=row['path'], position=row['position'], typeId=activity, partition=partition),
    }


def first_upper(text):
    return text[0].upper() + text[1:]


def first_lower(text):
    return text[0].lower() + text[1:]


def join_subject(subject, group):
    return subject + ('' if subject.endswith('’') else ' ') + group


def fill(prompt, answer):
    assert prompt.count('___') == 1, prompt
    marker = '___ ' if answer.endswith('’') and '___ ' in prompt else '___'
    return prompt.replace(marker, answer)


def choices(id_, values):
    assert len(values) == len(set(values)), (id_, values)
    return [dict(id=f'{id_}-choix-{i}', text=value) for i, value in enumerate(values, 1)]


def completion(ref, prompt, cue, answer, wrong, reason, verb=None, alternatives=()):
    assert prompt.count('___') == 1
    unit = dict(**ref, kind='completion', prompt=prompt, cue=cue,
                answers=[answer, *alternatives], options=choices(ref['id'], [answer, *wrong]),
                explanation=f'{reason} Modèle : {fill(prompt, answer)}')
    if verb:
        unit['givenVerb'] = verb
    return unit


def transformation(ref, prompt, directive, answer, reason, cue=None):
    unit = dict(**ref, kind='transform', prompt=prompt, directive=directive, answers=[answer],
                responseLines=2, explanation=f'{reason} Modèle possible : {answer}')
    if cue:
        unit['cue'] = cue
    return unit


def correction(ref, prompt, cue, incorrect, answer, reason):
    start = prompt.index('___')
    error = dict(segmentId='prompt', start=start, end=start + len(incorrect), text=incorrect)
    return dict(**ref, kind='correct', prompt=fill(prompt, incorrect), cue=cue, error=error,
                responseLines=2, answers=[answer], explanation=f'{reason} Correction : {answer}')


def rubric(criteria):
    return [dict(id=f'r{i}', label=criterion) for i, criterion in enumerate(criteria, 1)]


def production(ref, prompt, task, answer, criteria, reason, follow=None, reply=None):
    oral = follow is not None
    if oral:
        task = f'{task} Relance : « {follow} »'
        answer = f'{answer}\nRéponse possible à la relance : {reply}'
    return dict(**ref, kind='production', prompt=prompt, mode='oral' if oral else 'written',
                task=task, answers=[answer], writeLines=0 if oral else 4, rubric=rubric(criteria),
                explanation=f'{reason} Les reformulations fidèles à la consigne sont recevables.')


def scenario(ref, situation, title, speakers, opening, task, answer, follow, reply, criteria, reason):
    speaker, partner = speakers
    exchange = f'{partner} : {opening}\n{speaker} : {answer}\n{partner} : {follow}\n{speaker} : {reply}'
    return dict(**ref, kind='scenario', contract='open', prompt=title, situation=situation,
                roles=[dict(id='speaker', label=speaker, goal='Formulez la première réponse et répondez à la relance.'),
                       dict(id='partner', label=partner, goal='Posez la question puis poursuivez avec la relance.')],
                turns=[dict(id='debut', roleId='partner', text=opening)],
                task=f'{task} Répondez à la relance puis échangez les rôles.',
                answers=[exchange], followUps=[follow], writeLines=0, rubric=rubric(criteria),
                explanation=f'{reason} Le dialogue proposé est un modèle possible.')


def reading_bank(subtheme, activity, sources):
    columns = ('slug', 'genre', 'title', 'text', 'q1', 'a1', 'w1', 'w2', 'p1',
               'q2', 'a2', 'p2', 'q3', 'a3', 'p3')
    units = []
    for row in read_source(f'{subtheme}-lectures', columns, count=20):
        assert row['slug'] in sources, row['slug']
        text = row['text'].replace('^', '\n')
        ref = references(activity, 'B1', row)
        questions = []
        for index in ('1', '2', '3'):
            quote = row[f'p{index}']
            assert quote in text, (row['slug'], quote)
            id_ = f'{ref["id"]}-q{index}'
            answer = row[f'a{index}']
            question = dict(id=id_, prompt=row[f'q{index}'], answers=[answer], evidence=[quote],
                            response='choice' if index == '1' else 'short',
                            explanation='Une reformulation fidèle est recevable.' if index != '1' else 'Ce détail est donné dans le document.')
            if index == '1':
                question['options'] = choices(id_, [answer, row['w1'], row['w2']])
            questions.append(question)
        units.append(dict(**ref, kind='reading', genre=row['genre'], prompt=row['title'], text=text,
                          answers=[], questions=questions, responseLines=1,
                          explanation='Les réponses sont justifiées par des passages précis du document.'))
    return units


def passive_unit(mechanic, ref, row):
    suffixes = {'ms': '', 'fs': 'e', 'mp': 's', 'fp': 'es'}
    agreement_labels = {'ms': 'masculin singulier', 'fs': 'féminin singulier',
                        'mp': 'masculin pluriel', 'fp': 'féminin pluriel'}
    agreement = row['agreement']
    singular, plural, tense = PASSIVE_AUX[row['tense']]
    auxiliary = plural if agreement.endswith('p') else singular
    stem = row['participle']
    forms = {key: stem if key == 'mp' and stem.endswith('s') else stem + ending
             for key, ending in suffixes.items()}
    wrong_participle = next(part for key, part in forms.items()
                            if key[1] == agreement[1] and part != forms[agreement])
    answer = f'{auxiliary} {forms[agreement]}'
    by_agent = f'par {first_lower(row["agent"])}'
    prompt = f'{row["patient"]} ___ {by_agent} {row["complement"]}.'
    active = f'{row["agent"]} {row["active_verb"]} {first_lower(row["patient"])} {row["complement"]}.'
    passive = fill(prompt, answer)
    reason = (f'Au {tense}, le passif se construit ici avec « {auxiliary} » et le participe accordé avec '
              f'« {first_lower(row["patient"])} » ({agreement_labels[agreement]}).')
    cue = f'Employez la forme passive au {tense}.'
    if mechanic == 'q':
        wrong_auxiliary = singular if auxiliary == plural else plural
        return completion(ref, prompt, cue, answer,
                          [f'{auxiliary} {wrong_participle}', f'{wrong_auxiliary} {forms[agreement]}'],
                          reason, row['verb'])
    if mechanic == 'c':
        return correction(ref, prompt, cue, f'{auxiliary} {wrong_participle}', passive, reason)
    if row['position'] % 2 == 0:
        return transformation(ref, active, 'Mettez à la forme passive. Gardez le temps, l’agent et le complément.',
                              passive, reason)
    return transformation(ref, passive, 'Mettez à la forme active. Gardez le temps et indiquez qui agit.',
                          active, f'Le complément d’agent devient le sujet. Le verbe reste au {tense}.')


def speech_unit(mechanic, ref, row):
    reason = SPEECH_RULES[row['rule']]
    answer = fill(row['prompt'], row['answer'])
    if mechanic == 'q':
        alternatives = row['alternatives'].split('~') if row['alternatives'] else ()
        return completion(ref, row['prompt'], row['context'], row['answer'], [row['w1'], row['w2']], reason,
                          alternatives=alternatives)
    if mechanic == 'c':
        return correction(ref, row['prompt'], row['context'], row['w1'], answer, reason)
    if mechanic == 't':
        return transformation(ref, row['context'], 'Rapportez cette parole au discours indirect. Gardez le sens et les repères.',
                              answer, reason)
    oral = mechanic == 'po'
    criteria = (CRITERIA_FACTS, 'Discours indirect et changements de personne, de temps ou de repère adaptés.',
                CRITERIA_ORAL if oral else 'Phrase complète et compréhensible pour la personne destinataire.')
    return production(ref, row['context'],
                      'Rapportez cette parole au discours indirect à une personne qui ne l’a pas entendue.',
                      answer, criteria, reason, row['follow'] if oral else None, row['reply'])


def conditional_sentence(row, level):
    verb, person = row['verb'], row['person']
    prefix = ''
    if verb.startswith('se '):
        prefix, verb = 'se ', verb.removeprefix('se ')
    if verb.startswith('s’'):
        prefix, verb = 's’', verb.removeprefix('s’')
    stem = CONDITIONAL_STEMS.get(verb, verb.removesuffix('e') if verb.endswith('re') else verb)
    answer = prefix + stem + CONDITIONAL_ENDINGS[person]
    other = 'il' if person != 'il' else 'ils'
    wrong = [prefix + stem + CONDITIONAL_ENDINGS[other], prefix + stem + ('ons' if person != 'nous' else 'a')]
    if level == 'B1':
        subject = row['subject']
    else:
        subject = {'je': 'J’' if answer.startswith('a') else 'Je', 'nous': 'Nous', 'tu': 'Tu', 'vous': 'Vous'}[person]
    prompt = f'{join_subject(subject, "___")} {row["complement"]}.'
    return prompt, answer, wrong


def conditional_unit(mechanic, level, ref, row):
    prompt, answer, wrong = conditional_sentence(row, level)
    model = fill(prompt, answer)
    if level == 'A2':
        alternate = [answer.replace('préférer', 'préfèrer')] if row['verb'] == 'préférer' else []
        advice = row['intent'] == 'conseil'
        intention = 'un conseil' if advice else 'un souhait ou une préférence'
        cue = f'{row["context"]} Exprimez {intention} au conditionnel présent.'
        source = f'{row["context"]}\nIdée à exprimer : {row["complement"]}.'
        task = f'Exprimez {intention} avec le verbe « {row["verb"]} » au conditionnel présent.'
        speakers = ('Personne qui conseille', 'Personne conseillée') if advice else ('Personne qui exprime son souhait', 'Interlocuteur')
        opening = 'Que me conseillez-vous ?' if advice and row['person'] == 'vous' else (
            'Que me conseilles-tu ?' if advice else 'Que souhaitez-vous faire ou obtenir ?')
        reason = f'Ici, le conditionnel présent permet d’exprimer {intention}.'
        criterion = 'Conseil ou souhait exprimé au conditionnel présent.'
    else:
        alternate = []
        cue = f'{row["context"]} Signalez que l’information est incertaine avec le conditionnel présent.'
        source = f'{row["context"]}\nInformation à vérifier : {row["subject"]} (« {row["verb"]} ») {row["complement"]}.'
        task = 'Rapportez l’information à la rédaction en indiquant sa source et son statut incertain. Employez le conditionnel présent.'
        speakers = ('Journaliste', 'Collègue de la rédaction')
        opening = 'Que sait-on pour l’instant ?'
        model = f'D’après la source, {first_lower(model)} Cette information reste à vérifier.'
        reason = 'Dans ce compte rendu, le conditionnel signale qu’une source avance une information encore non confirmée.'
        criterion = 'Information attribuée à la source, au conditionnel présent.'
    if mechanic == 'q':
        return completion(ref, prompt, cue, answer, wrong, reason, row['verb'], alternate)
    if mechanic == 't':
        return transformation(ref, source, task, model, reason)
    criteria = (CRITERIA_FACTS, criterion, CRITERIA_ORAL)
    if mechanic == 's':
        title = 'Conseiller ou exprimer un souhait' if level == 'A2' else 'Vérifier une information'
        return scenario(ref, source, title, speakers, opening, task, model, row['follow'], row['reply'], criteria, reason)
    return production(ref, source, task, model, criteria, reason, row['follow'], row['reply'])


def si_clause(condition):
    if condition.startswith(('il ', 'ils ')):
        return f'S’{condition}'
    return f'Si {condition}'


def hypothesis_unit(mechanic, level, ref, row):
    possible = level == 'A2'
    condition = row['present'] if possible else row['imperfect']
    answer = row['future'] if possible else row['conditional']
    different_tense = row['conditional'] if possible else row['future']
    prompt = f'{si_clause(condition)}, {row["result"]}.'
    model = fill(prompt, answer)
    reason = ('La condition est possible : si + présent, suivi ici du futur simple dans la conséquence.'
              if possible else 'La condition est contraire à la situation actuelle : si + imparfait, puis conditionnel présent.')
    task = ('Reliez les deux faits avec si, au présent dans la condition et au futur simple dans la conséquence.'
            if possible else 'Imaginez la conséquence de cette condition contraire aux faits. Employez si + imparfait et le conditionnel présent.')
    if mechanic == 'q':
        cue = 'La condition peut se réaliser. Employez le futur simple dans la conséquence.' if possible else (
            f'{row["reality"]} Employez le conditionnel présent dans la conséquence.')
        return completion(ref, prompt, cue, answer, [different_tense, row['verb']], reason, row['verb'])
    result = first_upper(row['result']).replace('’___', '’ ___').replace('___', f'({row["verb"]})')
    source = f'Condition envisagée : {first_upper(row["present"])}.\nConséquence à exprimer : {result}.'
    if not possible:
        source = f'Fait réel : {row["reality"]}\n{source}'
    if mechanic == 't':
        return transformation(ref, source, task, model, reason)
    oral = mechanic == 'p'
    task = f'{task} Présentez cette situation à un camarade.'
    criteria = (CRITERIA_FACTS, 'Imparfait après si et conditionnel présent dans la conséquence.',
                CRITERIA_ORAL if oral else 'Phrase complète et distinction claire entre réalité et hypothèse.')
    return production(ref, source, task, model, criteria, reason, row['follow'] if oral else None, row['reply'])


def past_conditional_unit(mechanic, ref, row):
    intent = row['intent']
    person = row['person']
    stem = PAST_AUX[row['auxiliary']]
    auxiliary = stem + CONDITIONAL_ENDINGS[person]
    answer = f'{auxiliary} {row["participle"]}'
    other_person = 'il' if person != 'il' else 'ils'
    wrong_auxiliary = stem + CONDITIONAL_ENDINGS[other_person]
    opposite_stem = 'ser' if stem == 'aur' else 'aur'
    wrong = [f'{wrong_auxiliary} {row["participle"]}', f'{opposite_stem}{CONDITIONAL_ENDINGS[person]} {row["participle"]}']
    subject = row['subject']
    ending = f' {row["complement"]}.' if row['complement'] else '.'
    if intent == 'hypothese':
        assert row['condition']
        # Pronouns are lower-case inside the sentence; personal names keep their accents and capital.
        subject = first_lower(subject) if subject.split(' ')[0] in ('Je', 'Tu', 'Il', 'Elle', 'Nous', 'Vous', 'Ils', 'Elles', 'Le', 'La', 'Les') or subject.startswith('L’') else subject
        prompt = f'{si_clause(row["condition"])}, {join_subject(subject, "___")}{ending}'
    else:
        prompt = f'{join_subject(subject, "___")}{ending}'
    reason = (f'Le conditionnel passé est formé ici avec {("avoir" if stem == "aur" else "être")} '
              'au conditionnel présent et le participe passé.')
    if stem == 'ser':
        reason += ' Le participe s’accorde avec le sujet.'
    if intent == 'hypothese':
        reason += ' Le plus-que-parfait après si présente une autre possibilité dans le passé.'
    task = f'{PAST_INTENTIONS[intent]} Employez le conditionnel passé.'
    cue = f'{row["reality"]} {task}'
    model = fill(prompt, answer)
    if mechanic == 'q':
        return completion(ref, prompt, cue, answer, wrong, reason, row['verb'])
    if mechanic == 'c':
        return correction(ref, prompt, cue, wrong[0], model, reason)
    clue = f'Idée à exprimer avec « {row["verb"]} » : {row["complement"]}.'
    if intent == 'hypothese':
        clue += f' Condition : {first_upper(row["condition"])}.'
    source = f'{row["reality"]}\n{clue}'
    if mechanic == 't':
        return transformation(ref, source, task, model, reason)
    oral = mechanic == 'p'
    task = f'{task} Adressez votre réponse à un camarade qui connaît l’événement.'
    criteria = (CRITERIA_FACTS, 'Auxiliaire au conditionnel et participe passé correctement accordé.',
                CRITERIA_ORAL if oral else 'Regret, reproche ou hypothèse clairement exprimé.')
    return production(ref, source, task, model, criteria, reason, row['follow'] if oral else None, row['reply'])


def build():
    passive = read_source('j6', ('slug', 'tense', 'agent', 'active_verb', 'patient', 'verb',
                                 'participle', 'agreement', 'complement'))
    speech = read_source('j7', ('slug', 'context', 'prompt', 'answer', 'w1', 'w2', 'rule', 'follow', 'reply', 'alternatives'))
    conditional_a2 = read_source('j8-a2', ('slug', 'context', 'intent', 'person', 'verb', 'complement', 'follow', 'reply'))
    conditional_b1 = read_source('j8-b1', ('slug', 'context', 'subject', 'person', 'verb', 'complement', 'follow', 'reply'))
    hypothesis = read_source('j9', ('slug', 'reality', 'present', 'imperfect', 'result', 'verb', 'future', 'conditional', 'follow', 'reply'))
    past = read_source('j10', ('slug', 'intent', 'reality', 'subject', 'person', 'auxiliary', 'verb',
                               'participle', 'complement', 'condition', 'follow', 'reply'))
    rows_by_plan = {
        ('j6', 'B1'): passive, ('j7', 'B1'): speech, ('j8', 'A2'): conditional_a2, ('j8', 'B1'): conditional_b1,
        ('j9', 'A2'): hypothesis, ('j9', 'B1'): hypothesis, ('j10', 'B1'): past,
    }
    banks = {}
    for (subtheme, level), mechanics in PLANS.items():
        rows = rows_by_plan[subtheme, level]
        for mechanic in mechanics:
            activity = activity_id(subtheme, mechanic)
            if mechanic in ('ce', 'd'):
                units = reading_bank(subtheme, activity, {row['slug'] for row in rows})
            else:
                units = []
                for row in rows:
                    ref = references(activity, level, row)
                    if subtheme == 'j6':
                        unit = passive_unit(mechanic, ref, row)
                    elif subtheme == 'j7':
                        unit = speech_unit(mechanic, ref, row)
                    elif subtheme == 'j8':
                        unit = conditional_unit(mechanic, level, ref, row)
                    elif subtheme == 'j9':
                        unit = hypothesis_unit(mechanic, level, ref, row)
                    else:
                        unit = past_conditional_unit(mechanic, ref, row)
                    units.append(unit)
            if mechanic == 'q':
                label = COMPLETION_LABELS[subtheme]
                instructions = {
                    'choice': 'Choisissez la forme qui convient selon la situation et la consigne.',
                    'gap': 'Complétez le texte selon la situation et la consigne.',
                }
            else:
                presentation, label, instruction = PRESENTATIONS[mechanic]
                instructions = {presentation: instruction}
            bank = dict(schemaVersion=1, revision=REVISION, activityId=activity, subthemeId=subtheme,
                        topic='gram-faits', level=level, label=label, objective=OBJECTIVES[subtheme, level],
                        editorialStatus='reviewed', presentations=list(instructions), instructions=instructions,
                        review=dict(reviewer='Codex — revue linguistique et fonctionnelle', date=DATE,
                                    humanReview='pending',
                                    note='Les situations sont partagées entre activités. Les productions ont un modèle possible.'),
                        units=units)
            banks.setdefault(subtheme, []).append(bank)
    for subtheme, subtheme_banks in banks.items():
        (DATA / f'{subtheme}.json').write_text(json.dumps(subtheme_banks, ensure_ascii=False, indent=2) + '\n',
                                             encoding='utf-8')
    flattened = [bank for subtheme_banks in banks.values() for bank in subtheme_banks]
    print(json.dumps(dict(activities=len({bank['activityId'] for bank in flattened}), banks=len(flattened),
                          offerings=sum(len(bank['presentations']) for bank in flattened),
                          units=sum(len(bank['units']) for bank in flattened))))


if __name__ == '__main__':
    build()
