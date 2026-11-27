"""Compile the five future notions from authored sources; no media is altered."""
import csv
import json
import re
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
READING_REVISION = 'avenir-2026-11-24-v1'
EXERCISE_REVISION = 'avenir-2026-11-27-v2'
LEVELS = {'futur-proche': 'A1', 'futur-simple': 'A2', 'futur-proche-ou-simple': 'A2',
          'futur-anterieur': 'B1', 'hypothese-futur': 'A2'}
PLANS = {'futur-proche': ['q', 'ce', 'pe', 'po', 't', 's'],
         'futur-simple': ['q', 't', 'e', 'p'],
         'futur-proche-ou-simple': ['q', 'c', 'd', 'p'],
         'futur-anterieur': ['q', 't', 'd', 'e'],
         'hypothese-futur': ['q', 't', 's', 'p']}
OBJECTIVES = {
    'futur-proche': 'Annoncer un projet avec aller au présent + infinitif, y compris les verbes pronominaux.',
    'futur-simple': 'Conjuguer et annoncer une action future, avec les radicaux et terminaisons adaptés au sujet.',
    'futur-proche-ou-simple': 'Former les deux futurs selon la consigne ; expliquer un choix en contexte sans exclure les autres emplois possibles.',
    'futur-anterieur': 'Présenter un fait achevé avant un autre événement futur ; conserver la chronologie, l’auxiliaire et les accords.',
    'hypothese-futur': 'Relier une condition possible au présent après si à une conséquence au futur simple.'}
LABELS = {'futur-proche': 'Annoncer un projet', 'futur-simple': 'Conjuguer au futur simple',
          'futur-proche-ou-simple': 'Former les deux futurs', 'futur-anterieur': 'Former le futur antérieur',
          'hypothese-futur': 'Une condition pour l’avenir'}


def read(sub):
    path = f'scripts/grammar_curriculum/avenir-{sub}-{LEVELS[sub].lower()}.tsv'
    rows = [r for r in csv.reader((ROOT / path).read_text().splitlines(), delimiter='|') if r and not r[0].startswith('#')]
    keys = ['slug', 'context', 'verb', 'prompt', 'answer', 'wrong1', 'wrong2', 'neutral', 'target', 'reason', 'opening', 'follow', 'reply']
    assert len(rows) == 60 and len({r[0] for r in rows}) == 60
    assert all(len(r) == 13 and all(unicodedata.normalize('NFC', s) == s for s in r) for r in rows)
    return [dict(zip(keys, r), path=path, position=i) for i, r in enumerate(rows)]


R = {s: read(s) for s in PLANS}


def aid_for(sub, m):
    return f'gram-ex-{sub}-' + ('qcm-conj' if m == 'q' and sub in ['futur-simple', 'futur-anterieur'] else
        'qcm-verbe' if m == 'q' else 'communication-' + m if m in ['ce', 'pe', 'po'] else 'curriculum-' + m)


def rubric(labels):
    return [dict(id=f'r{i+1}', label=s) for i, s in enumerate(labels)]


def options(values, slug):
    assert len(values) == len(set(values))
    return [dict(id=f'{slug}-choix-{i+1}', text=s) for i, s in enumerate(values)]


def answers(sub, r):
    return [r['answer']] + (['connaitront'] if sub == 'futur-simple' and r['slug'] == 'connaitre' else
                          ['essayerai'] if sub == 'futur-simple' and r['slug'] == 'essayer' else [])


def models(sub, r):
    return [r['prompt'].replace('___', a) for a in answers(sub, r)]


def spoken_reply(sentence):
    """Explicitly reviewed tu→je / plural vous→nous forms for these dialogues."""
    if re.search(r'\b[Tt]u\b', sentence):
        replacements = {'Tu': 'Je', 'tu': 'je', 'vas': 'vais', 'as': 'ai', 'passes': 'passe',
                        'viendras': 'viendrai', 'réserveras': 'réserverai', 'achèteras': 'achèterai',
                        'te': 'me', 'ta': 'ma', 'ton': 'mon', 'tes': 'mes'}
    elif re.search(r'\b[Vv]ous\b', sentence):
        replacements = {'Vous': 'Nous', 'vous': 'nous', 'allez': 'allons', 'recevez': 'recevons',
                        'utiliserez': 'utiliserons', 'enverrez': 'enverrons', 'préviendrez': 'préviendrons',
                        'votre': 'notre', 'vos': 'nos'}
    else:
        return sentence
    sentence = re.sub(r'\b\w+\b', lambda m: replacements.get(m[0], m[0]), sentence)
    sentence = re.sub(r'\bje (?=[aeéiouh])', 'j’', sentence)
    return re.sub(r'\bJe (?=[aeéiouh])', 'J’', sentence)


def instruction(sub, r):
    if sub == 'futur-proche' or sub == 'futur-proche-ou-simple' and r['target'] == 'near':
        return 'Employez le futur proche : aller au présent + infinitif.'
    if sub in ['futur-simple', 'futur-proche-ou-simple']:
        return 'Employez le futur simple.'
    if sub == 'futur-anterieur':
        return 'Exprimez le fait achevé au futur antérieur ; gardez la seconde action au futur simple.'
    return 'Employez le présent après si de condition et le futur simple dans la conséquence.'


def reason(sub, r):
    common = r['reason']
    if sub == 'futur-proche-ou-simple':
        common = 'Futur proche : aller au présent + infinitif. Futur simple : le verbe porte le radical et la terminaison du futur. ' + common
        common += ' Les deux futurs peuvent convenir dans de nombreux contextes ; la forme est imposée dans les exercices fermés. La distance temporelle seule ne suffit pas à exclure l’autre futur.'
    if sub == 'hypothese-futur':
        common += ' Il s’agit de si conditionnel. D’autres constructions de conséquence sont possibles en français ; le futur simple est ici demandé.'
    return common


def emit(sub, m, units):
    if m == 'q':
        ins = dict(choice='Choisissez le groupe verbal qui respecte le sujet et la construction demandée.',
                   gap='Complétez avec le groupe verbal entier selon le verbe et la construction indiqués.')
        label = LABELS[sub]
    else:
        p = {'ce': 'document-set', 'd': 'document-set', 'pe': 'open-written', 'e': 'open-written',
             'po': 'open-oral', 'p': 'open-oral', 't': 'transform', 'c': 'correct', 's': 'scenario-set'}[m]
        ins = {p: {'ce': 'Lisez chaque document puis répondez aux trois questions à partir des faits du texte.',
                   'd': 'Lisez chaque document et répondez aux trois questions ; justifiez vos réponses à partir du texte.',
                   'pe': 'Annoncez le projet donné au futur proche, dans une phrase complète.',
                   'e': 'Exprimez les faits donnés avec la construction demandée. Le corrigé propose un modèle possible.',
                   'po': 'Annoncez le projet puis répondez à la relance de votre partenaire.',
                   'p': 'Exprimez les faits selon la situation, puis répondez à la relance.',
                   't': 'Reformulez selon la consigne en conservant les faits, les rôles et les repères temporels.',
                   'c': 'Corrigez la formation du futur demandé puis réécrivez toute la phrase.',
                   's': 'Jouez l’échange à deux : répondez selon les faits, puis poursuivez avec la relance.'}[m]}
        label = {'ce': 'Lire une situation', 'd': 'Lire et répondre', 'pe': 'Écrire un projet', 'e': 'Écrire en contexte',
                 'po': 'Annoncer un projet à l’oral', 'p': 'Dire une phrase en contexte', 't': 'Transformer une phrase',
                 'c': 'Corriger l’erreur', 's': 'Jouer une situation'}[m]
    reading = m in ('ce', 'd')
    return dict(schemaVersion=1, revision=READING_REVISION if reading else EXERCISE_REVISION,
        activityId=aid_for(sub, m), subthemeId=sub, topic='gram-avenir', level=LEVELS[sub],
        label=label, objective=OBJECTIVES[sub], editorialStatus='reviewed',
        review=dict(reviewer='Codex — revue linguistique et fonctionnelle', date='2026-11-24' if reading else '2026-11-27', humanReview='pending',
            note='Sources et références relues. Situations partagées entre mécaniques ; documents adaptés avec faits explicites. Modèles ouverts non exclusifs. Aucune approbation enseignante déclarée.'),
        presentations=list(ins), instructions=ins, units=units)


banks = []
for sub, mechanics in PLANS.items():
    level = LEVELS[sub]
    for m in mechanics:
        aid, units = aid_for(sub, m), []
        if m in ['ce', 'd']:
            path = f'scripts/grammar_curriculum/avenir-{sub}-lectures-{level.lower()}.json'
            docs = json.loads((ROOT / path).read_text())
            assert len(docs) == 20 and len({d['id'] for d in docs}) == 20
            for i, d in enumerate(docs):
                assert d['sourceSituation'] in {r['slug'] for r in R[sub]}
                text, questions = ' '.join(d['text']), []
                for j, c in enumerate(d['questions']):
                    assert c['evidence'] in text, (sub, d['id'], c['evidence'])
                    q = dict(id=f'{aid}-{d["id"]}-q{j+1}', prompt=c['prompt'], answers=[c['answer']], response=c['response'],
                        evidence=[c['evidence']], explanation='Le texte indique : « ' + c['evidence'] + ' ». Une reformulation fidèle est recevable.')
                    if c['response'] == 'choice':
                        q['options'] = options(c['choices'], q['id'])
                    questions.append(q)
                units.append(dict(id=f'{aid}-{level.lower()}-{d["id"]}', source=dict(path=path, typeId=aid, position=i, partition=level.lower()),
                    kind='reading', prompt=d['title'], genre=d['genre'], text=text, answers=[], questions=questions,
                    explanation='Les trois questions portent sur des informations distinctes explicitement présentes dans le texte.'))
        else:
            for r in R[sub]:
                common = dict(id=f'{aid}-{level.lower()}-{r["slug"]}', source=dict(path=r['path'], typeId=aid, position=r['position'], partition=level.lower()))
                solved, why = models(sub, r), reason(sub, r)
                if m == 'q':
                    unit = dict(**common, kind='completion', prompt=r['prompt'], cue=r['context'] + ' ' + instruction(sub, r) + (' Le sujet fait aussi partie de la lacune.' if sub == 'futur-proche-ou-simple' and r['slug'] in ['billet', 'promesse', 'carnet'] else ''), givenVerb=r['verb'],
                        answers=answers(sub, r), options=options([r['answer'], r['wrong1'], r['wrong2']], r['slug']), explanation=why + ' Modèle : ' + solved[0])
                elif m == 't':
                    unit = dict(**common, kind='transform', prompt=r['neutral'], cue=r['context'] + ' Verbe ciblé : ' + r['verb'] + '.',
                        directive=instruction(sub, r) + (' Reliez les deux faits par quand, dès que ou une fois que ; respectez l’ordre des événements.' if sub == 'futur-anterieur' else
                            ' Reliez la condition et sa conséquence par si, sans présenter la condition comme certaine.' if sub == 'hypothese-futur' else ''),
                        answers=solved, responseLines=2, explanation=why + ' Modèle non exclusif : ' + solved[0])
                elif m == 'c':
                    bad = r['wrong1']
                    start = len(r['prompt'].split('___')[0])
                    unit = dict(**common, kind='correct', prompt=r['prompt'].replace('___', bad), cue=r['context'] + ' ' + instruction(sub, r), answers=solved,
                        error=dict(segmentId='prompt', start=start, end=start+len(bad), text=bad), responseLines=2, explanation=why + ' Modèle : ' + solved[0])
                else:
                    flexible = sub == 'futur-proche-ou-simple'
                    task = ('Annoncez le fait avec le futur de votre choix. Justifiez votre choix.' if flexible else
                            instruction(sub, r) + ' Formulez une phrase complète.')
                    model = solved[0] + ('\nJustification possible : ' + r['reason'] if flexible else '')
                    if m == 's':
                        exchange = 'Personne B : ' + r['opening'] + '\nPersonne A : ' + spoken_reply(model) + '\nPersonne B : ' + r['follow'] + '\nPersonne A : ' + r['reply']
                        unit = dict(**common, kind='scenario', contract='open', prompt='Annoncer un projet' if sub == 'futur-proche' else 'Envisager une condition possible',
                            situation=r['context'], answers=[exchange],
                            roles=[dict(id='a', label='Personne A', goal='Présentez les faits et répondez.'),
                                   dict(id='b', label='Personne B', goal='Posez la question initiale puis la relance.')],
                            turns=[dict(id='debut', roleId='b', text=r['opening'])], task=(
                                'Reliez la condition possible et sa conséquence : si + présent, puis futur simple. Répondez à la relance, puis échangez les rôles.' if sub == 'hypothese-futur' else
                                task + ' Répondez ensuite à la relance. Échangez les rôles.'),
                            followUps=[r['follow']], writeLines=0, rubric=rubric(['Faits et repères conservés.', 'Construction verbale demandée et sujet corrects.', 'Réponse compréhensible et cohérente à la relance.']),
                            explanation='Modèle non exclusif ; les reformulations fidèles aux faits et à la construction sont recevables. ' + why)
                    else:
                        oral = m in ['p', 'po']
                        if oral:
                            task += ' Puis répondez à la relance : « ' + r['follow'] + ' »'
                            model += '\nRéponse à la relance : ' + r['reply']
                        possible = [model]
                        if flexible:
                            possible.append(r['prompt'].replace('___', r['wrong2']) + '\nJustification possible : j’annonce le même fait comme prévu.\nRéponse à la relance : ' + r['reply'])
                        elif not oral:
                            possible = solved
                        unit = dict(**common, kind='production', mode='oral' if oral else 'written', prompt=r['context'] + ('' if flexible else '\nFaits : ' + r['neutral']),
                            answers=possible, task=task, writeLines=0 if oral else 4,
                            rubric=rubric(['Faits, personnes et ordre des événements conservés.',
                                'Futur bien formé et justification pertinente du choix.' if flexible else 'Construction demandée, conjugaison et accords corrects.',
                                'Réponse compréhensible et cohérente à la relance.' if oral else 'Phrase complète et compréhensible.']),
                            explanation='Modèle non exclusif ; les reformulations grammaticales fidèles aux faits et à la consigne sont recevables. ' +
                                ('Les deux futurs sont recevables ici si la justification respecte les faits.' if flexible else why))
                units.append(unit)
        banks.append(emit(sub, m, units))

assert len(banks) == 22 and sum(len(b['presentations']) for b in banks) == 27
units = sum(len(b['units']) for b in banks)
assert units == 1200
variants = sum(len(b['presentations']) * sum(len(u['questions']) if u['kind'] == 'reading' else 1 for u in b['units']) for b in banks)
assert variants == 1620
for sub in PLANS:
    (ROOT / f'src/grammaire/curriculum/data/{sub}.json').write_text(json.dumps([b for b in banks if b['subthemeId'] == sub], ensure_ascii=False, indent=2) + '\n')
print(json.dumps(dict(activities=22, banks=22, offerings=27, units=units, variants=variants, authoredSourceRows=sum(map(len, R.values())), documents=60, readingQuestions=180)))
