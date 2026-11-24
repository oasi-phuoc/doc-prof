"""Compile the complete action theme from authored situations and reading texts.

Illustrations are immutable copies of ten existing catalogue images. Situations
are reused explicitly between mechanics; readings and subject corrections are
adaptations, not additional independent stories. No audio or theory is changed.
"""
import csv
import hashlib
import json
import shutil
import unicodedata
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
REV = 'action-2026-11-24-v1'
MANIFEST = 'docs/grammaire/implementation/action-media-manifest.json'
PLANS = {('j1', 'A1'): ['q', 'ce', 'pe', 'po'],
         ('j1', 'A2'): ['q', 'ce', 'pe', 'po', 't'],
         ('j2', 'A1'): ['q', 'p'], ('j2', 'A2'): ['q', 'p', 'e', 't'],
         ('j3', 'A2'): ['q', 'c', 't', 'p']}
OBJECTIVES = {
    'j1': 'Décrire une action en cours avec être en train de/d’ + infinitif ; à A2, distinguer une habitude de l’action actuelle.',
    'j2': 'Exprimer un fait tout juste achevé avec venir de/d’ + infinitif ; à A2, respecter un repère actuel ou passé explicite.',
    'j3': 'Relier deux faits simultanés de même sujet avec en + participe présent ; repérer un sujet mal rattaché.'}


def read(sub, level):
    path = f'scripts/grammar_curriculum/action-{sub}-{level.lower()}.tsv'
    rows = [r for r in csv.reader((ROOT / path).read_text().splitlines(), delimiter='|')
            if r and not r[0].startswith('#')]
    assert len(rows) == 50 and len({r[0] for r in rows}) == 50
    keys = ['slug', 'anchor', 'context', 'infinitive', 'prompt', 'answer', 'wrong1', 'wrong2', 'neutral', 'follow', 'reply']
    if sub == 'j1' and level == 'A2':
        keys = ['slug', 'context', 'infinitive', 'prompt', 'answer', 'wrong1', 'wrong2', 'habit', 'neutral', 'progressive', 'follow', 'reply', 'target']
    assert all(len(r) == len(keys) and all(unicodedata.normalize('NFC', s) == s for s in r) for r in rows)
    return [dict(zip(keys, r), path=path, position=i) for i, r in enumerate(rows)]


R = {key: read(*key) for key in PLANS}
adaptation_path = 'scripts/grammar_curriculum/action-j3-accord-sujet-a2.json'
adaptations = {a['sourceSituation']: a for a in json.loads((ROOT / adaptation_path).read_text())}
assert len(adaptations) == 10 and set(adaptations) <= {r['slug'] for r in R['j3', 'A2']}


def aid_for(sub, mechanic):
    return f'gram-ex-{sub}-' + ('qcm-verbe' if mechanic == 'q' else
        'communication-' + mechanic if mechanic in ['ce', 'pe', 'po'] else 'curriculum-' + mechanic)


def fill(r, answer=None):
    return r['prompt'].replace('___', r['answer'] if answer is None else answer)


def options(values, slug):
    assert len(set(values)) == len(values)
    return [dict(id=f'{slug}-choix-{i + 1}', text=s) for i, s in enumerate(values)]


def rubric(labels):
    return [dict(id=f'r{i + 1}', label=s) for i, s in enumerate(labels)]


objects, uses = {}, {}


def image(name, aid, uid):
    path = f'/lib/images/vocabulaire/actions/{name}.webp'
    p = ROOT / 'public' / path.lstrip('/')
    data = p.read_bytes()
    sha = hashlib.sha256(data).hexdigest()
    w, h = Image.open(p).size
    src = f'/lib/images/grammaire/curriculum/sha256/{sha}.webp'
    out = ROOT / 'public' / src.lstrip('/')
    out.parent.mkdir(parents=True, exist_ok=True)
    if out.exists():
        assert out.read_bytes() == data
    else:
        shutil.copyfile(p, out)
    obj = dict(id='action-' + name, src=src, sha256=sha, width=w, height=h,
        alt='Illustration de l’action : ' + name.replace('-', ' ') + '. Les rôles et les détails viennent du texte.',
        source=dict(path=path, manifest=MANIFEST, rights='permitted-reuse',
            note='Image interne réemployée sans modification et relue visuellement. Illustration lexicale de l’action ; personne grammaticale, nombre, objet et moment sont définis par le texte, pas déduits de l’image.'))
    objects[name] = obj
    uses.setdefault(name, []).append(dict(activityId=aid, unitId=uid))
    return obj


def target(sub, level, r):
    if sub == 'j1':
        return ('Exprimez l’habitude au présent simple.' if level == 'A2' and r['target'] == 'habit'
                else 'Insistez sur l’action en cours avec être en train de/d’ + infinitif.')
    if sub == 'j2':
        return 'Employez venir de/d’ + infinitif, avec venir ' + ('à l’imparfait pour le repère passé.' if r['anchor'] == 'past' else 'au présent pour le repère actuel.')
    return 'Employez le gérondif du verbe indiqué pour relier les faits de même sujet.'


def explanation(sub, level, r):
    if sub == 'j1':
        return ('Être s’accorde avec le sujet ; en train de/d’ est suivi d’un infinitif. '
                'Le présent simple peut aussi décrire une action actuelle : on choisit ici la forme explicitement demandée. '
                if level == 'A2' else 'Être s’accorde avec le sujet ; en train de/d’ est suivi d’un infinitif. ')
    if sub == 'j2':
        return ('Le fait est tout juste achevé par rapport au repère ' + ('passé : venir est à l’imparfait.' if r['anchor'] == 'past' else 'actuel : venir est au présent.') +
                ' De s’élide en d’ devant une voyelle ; le verbe suivant reste à l’infinitif. Le passé composé du fait source est grammatical, mais on travaille ici venir de.')
    return 'Le gérondif se forme avec en + participe présent. Dans la construction travaillée, son sujet est celui du verbe principal. Les faits sont simultanés ; tout en peut aussi exprimer une concession.'


def bank(sub, level, m, units):
    if m == 'q':
        label = {'j1': 'Décrire une action en cours', 'j2': 'Exprimer le passé récent', 'j3': 'Relier avec un gérondif'}[sub]
        instructions = dict(choice='Choisissez le groupe verbal qui respecte la forme demandée, le sujet et le repère de chaque situation.',
                            gap='Complétez avec le groupe verbal entier, selon la forme demandée et le verbe indiqué.')
    else:
        label = {'ce': 'Lire une situation', 'pe': 'Écrire une action en contexte', 'po': 'Décrire une action à l’oral',
                 'e': 'Écrire un fait tout juste achevé', 'p': 'Dire une phrase en contexte', 't': 'Transformer une phrase', 'c': 'Corriger l’erreur'}[m]
        presentation = {'ce': 'document-set', 'pe': 'open-written', 'po': 'open-oral', 'e': 'open-written', 'p': 'open-oral', 't': 'transform', 'c': 'correct'}[m]
        instructions = {presentation: {
            'ce': 'Lisez chaque document et répondez aux trois questions à partir des informations du texte.',
            'pe': 'Décrivez la situation en respectant les faits et la forme demandée. Le corrigé propose un modèle possible.',
            'po': 'Décrivez la situation puis répondez à la relance de votre partenaire.',
            'e': 'Exprimez le fait tout juste achevé avec venir de/d’ et respectez le repère indiqué.',
            'p': 'Exprimez les faits avec la construction demandée puis répondez à la relance.',
            't': 'Reformulez les faits selon la consigne, sans modifier les rôles ni le repère temporel.',
            'c': 'Corrigez la construction du gérondif ou son rattachement au sujet, puis réécrivez la phrase entière.'}[m]}
    return dict(schemaVersion=1, revision=REV, activityId=aid_for(sub, m), subthemeId=sub, topic='gram-action', level=level,
        label=label, objective=OBJECTIVES[sub], editorialStatus='reviewed',
        review=dict(reviewer='Codex — revue linguistique et fonctionnelle', date='2026-11-24', humanReview='pending',
            note='Situations et références relues. Réemploi explicite entre mécaniques et lectures ; les modèles ouverts ne sont pas exclusifs. Aucune approbation pédagogique humaine déclarée.'),
        presentations=list(instructions), instructions=instructions, units=units)


banks = []
for (sub, level), mechanics in PLANS.items():
    for m in mechanics:
        aid, units = aid_for(sub, m), []
        if m == 'ce':
            path = f'scripts/grammar_curriculum/action-j1-lectures-{level.lower()}.json'
            docs = json.loads((ROOT / path).read_text())
            assert len(docs) == 20
            for i, d in enumerate(docs):
                assert d['sourceSituation'] in {r['slug'] for r in R[sub, level]}
                text, questions = ' '.join(d['text']), []
                for j, c in enumerate(d['questions']):
                    assert c['evidence'] in text
                    child = dict(id=f'{aid}-{level.lower()}-{d["id"]}-q{j + 1}', prompt=c['prompt'], answers=[c['answer']],
                        response=c['response'], evidence=[c['evidence']], explanation='Le document indique : « ' + c['evidence'] + ' ». Une reformulation fidèle est recevable.')
                    if c['response'] == 'choice':
                        child['options'] = options(c['choices'], child['id'])
                    questions.append(child)
                units.append(dict(id=f'{aid}-{level.lower()}-{d["id"]}', source=dict(path=path, typeId=aid, position=i, partition=level.lower()),
                    kind='reading', prompt=d['title'], genre=d['genre'], text=text, answers=[], questions=questions,
                    explanation='Les réponses s’appuient sur des faits distincts explicitement donnés dans le document.'))
        else:
            for r in R[sub, level]:
                common = dict(id=f'{aid}-{level.lower()}-{r["slug"]}', source=dict(path=r['path'], typeId=aid, position=r['position'], partition=level.lower()))
                sentence, cue, reason = fill(r), r['context'] + ' ' + target(sub, level, r), explanation(sub, level, r)
                contrast = sub == 'j1' and level == 'A2'
                model = r['habit'] + ' ' + r['progressive'] if contrast else sentence
                facts = r['habit'] + ' ' + r['neutral'] if contrast else r['neutral']
                if m == 'q':
                    unit = dict(**common, kind='completion', prompt=r['prompt'], cue=cue, givenVerb=r['infinitive'], answers=[r['answer']],
                        options=options([r['answer'], r['wrong1'], r['wrong2']], r['slug']), explanation=reason + ' Modèle : ' + sentence)
                    if sub == 'j1' and level == 'A1':
                        unit['imageSupports'] = [image(r['anchor'], aid, common['id'])]
                elif m == 't':
                    directive = ('Gardez l’habitude au présent simple et reformulez l’action actuelle avec être en train de/d’ + infinitif. Écrivez les deux phrases.' if contrast else
                        'Reliez les deux faits avec le gérondif du verbe indiqué. Gardez le sujet commun et le verbe principal.' if sub == 'j3' else target(sub, level, r))
                    transformation_cue = (r['context'] + ' Conservez les deux actions des faits.' if contrast else
                                          r['context'] + ' Verbe à employer : ' + r['infinitive'] + '.')
                    unit = dict(**common, kind='transform', prompt=facts, cue=transformation_cue, directive=directive,
                        answers=[model], responseLines=2, explanation=reason + ' Modèle possible : ' + model + ' Les reformulations fidèles sont recevables.')
                elif m == 'c':
                    if r['slug'] in adaptations:
                        a = adaptations[r['slug']]
                        prompt, bad, model, reason = a['wrongSentence'], a['errorText'], a['correctSentence'], a['explanation']
                        start = prompt.index(bad)
                        common['source'] = dict(path=adaptation_path, typeId=aid, position=list(adaptations).index(r['slug']), partition='a2')
                    else:
                        prompt, bad = fill(r, r['wrong1']), r['wrong1']
                        start = len(r['prompt'].split('___')[0])
                    unit = dict(**common, kind='correct', prompt=prompt, cue=r['context'], answers=[model],
                        error=dict(segmentId='prompt', start=start, end=start + len(bad), text=bad), responseLines=2,
                        explanation=reason + ' Modèle possible : ' + model)
                else:
                    oral = m in ['p', 'po']
                    task = ('Opposez l’habitude et l’action actuelle : présent simple pour l’habitude, être en train de/d’ pour l’action actuelle. Écrivez deux phrases.' if contrast else target(sub, level, r) + ' Formulez une phrase complète.')
                    if oral:
                        task = task.replace('Écrivez', 'Dites') + ' Puis répondez à la relance : « ' + r['follow'] + ' »'
                        model += '\nRéponse à la relance : ' + r['reply']
                    production_prompt = r['context'] + '\nFaits : ' + facts
                    if sub == 'j3':
                        production_prompt += '\nVerbe au gérondif : ' + r['infinitive'] + '.'
                    unit = dict(**common, kind='production', mode='oral' if oral else 'written', prompt=production_prompt,
                        task=task, answers=[model], writeLines=0 if oral else 4,
                        rubric=rubric(['Faits, rôles et repère temporel conservés.',
                            'Construction demandée et conjugaison correctes ; sujet commun pour le gérondif.' if sub == 'j3' else 'Construction demandée, conjugaison et infinitif corrects.',
                            'Phrase compréhensible et réponse cohérente à la relance.' if oral else 'Phrase complète et compréhensible.']),
                        explanation='Modèle non exclusif ; les autres formulations qui respectent les faits et la consigne sont recevables. ' + reason)
                units.append(unit)
        banks.append(bank(sub, level, m, units))

assert len(banks) == 19
assert len({b['activityId'] for b in banks}) == 13
assert sum(len(b['presentations']) for b in banks) == 24
assert sum(len(b['units']) for b in banks) == 890
variants = sum(len(b['presentations']) * sum(len(u['questions']) if u['kind'] == 'reading' else 1 for u in b['units']) for b in banks)
assert variants == 1220
for sub in ['j1', 'j2', 'j3']:
    (ROOT / f'src/grammaire/curriculum/data/{sub}.json').write_text(json.dumps([b for b in banks if b['subthemeId'] == sub], ensure_ascii=False, indent=2) + '\n')
host = next(b for b in banks if b['subthemeId'] == 'j1' and b['level'] == 'A1' and b['presentations'] == ['choice', 'gap'])
manifest = dict(obligations=[dict(obligationId='IMG-j1-A1', hostActivityId=host['activityId'], level='A1', reviewedIllustratedSituations=50,
    distinctImages=len(objects), unitIds=[u['id'] for u in host['units']], humanReview='pending')], distinctImages=len(objects), humanReview='pending',
    images=[dict(**obj, uses=uses[name]) for name, obj in objects.items()],
    note='50 situations hôtes illustrées avec 10 images du catalogue, cinq usages par image. Supports lexicaux : les rôles et détails demandés viennent du texte. Réemploi sans génération, édition ni modification des originaux.')
(ROOT / MANIFEST).parent.mkdir(parents=True, exist_ok=True)
(ROOT / MANIFEST).write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
print(json.dumps(dict(activities=13, banks=19, offerings=24, units=890, variants=variants, sourceRows=250, readingDocuments=40, readingQuestions=120, subjectCorrectionAdaptations=10, images=len(objects))))
