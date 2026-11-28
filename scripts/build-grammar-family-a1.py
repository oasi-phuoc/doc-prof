"""Build four family pilots from the selected editorial sources."""
import csv
import hashlib
import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'scripts/grammar_curriculum'
DATE = '2026-11-21'
DEST = 'src/grammaire/curriculum/data/famille.json'
MEDIA_MANIFEST = 'docs/grammaire/implementation/family-media.json'


def read_rows(filename, width):
    rows = list(csv.reader((SOURCE / filename).read_text().splitlines(), delimiter='|'))
    assert all(len(row) == width for row in rows), [(i, len(r)) for i, r in enumerate(rows) if len(r) != width]
    assert len({r[0] for r in rows}) == len(rows)
    return rows


def key(text):
    return set(re.findall(r'[a-zà-ÿ]+', text.lower().replace('___', '')))


def evidence_for(text, prompt, answer):
    # The selected, individually reviewed texts state the tested facts. Retain
    # literal sentences/headers rather than fabricated summaries as evidence.
    sentences = [s.strip() for s in re.split(r'(?<=[.!?])\s+|\n', text) if s.strip()]
    query = key(prompt) - {'est', 'le', 'la', 'les', 'de', 'du', 'des', 'un', 'une', 'qui', 'quel', 'quelle', 'quels', 'à', 'et'}
    terms = key(answer)
    ranked = sorted(enumerate(sentences), key=lambda p: (len(key(p[1]) & terms)*4 + len(key(p[1]) & query), -p[0]), reverse=True)
    selected = [s for _, s in ranked[:2]]
    assert selected and any(key(s) & terms for s in selected), (prompt, answer, selected)
    return selected


def choices(answer, options):
    assert options.count(answer) == 1 and len(set(options)) == len(options)
    return [{'id': f'o{i+1}', 'text': text} for i, text in enumerate(options)]


def make_bank(kind, label, presentations, instructions, units):
    return {'schemaVersion': 1, 'revision': f'famille-{kind}-{DATE}.1',
            'activityId': f'gram-ex-famille-{kind}', 'subthemeId': 'famille', 'topic': 'gram-se-presenter', 'level': 'A1',
            'label': label, 'objective': 'Comprendre et présenter les liens familiaux et les possessifs dans des situations explicites.',
            'editorialStatus': 'reviewed', 'review': {'reviewer': 'Codex — revue linguistique et fonctionnelle',
                'date': DATE, 'humanReview': 'pending', 'note': 'Sources et référents relus ; versions A1 au présent, preuves littérales et trois banques de 20 documents. Validation enseignante en attente.'},
            'presentations': presentations, 'instructions': instructions, 'units': units}


def baby_support():
    [support] = json.loads((ROOT / MEDIA_MANIFEST).read_text())['supports']
    original = 'public' + support['source']['path']
    source = ROOT / original
    data = source.read_bytes() if source.exists() else subprocess.check_output(['git', 'show', 'HEAD:'+original], cwd=ROOT)
    assert hashlib.sha256(data).hexdigest() == support['sha256']
    path = ROOT / ('public' + support['src'])
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.exists():
        assert path.read_bytes() == data, 'Never replace an immutable support'
    else:
        path.write_bytes(data)
    return support


def adapted_readings(filename, legacy_file, kind):
    legacy = {d['slug']: d for d in json.loads((SOURCE / 'family-a1-reading-sources.json').read_text())[legacy_file]}
    rows = read_rows(filename, 2)
    assert len(rows) == 20
    overrides = {
        ('fam-photo', 'dimanche', 4): 'Quelle est la profession d’Ahmed ?',
        ('fam-photo', 'journal', 4): 'Quelle est la profession de Louis ?',
        ('fam-photo', 'blog', 4): 'Qui met la table ?',
        ('fam-email', 'garde', 4): 'Qui vient chercher les enfants ?',
        ('fam-email', 'confirmation-garde', 3): 'Où Marc attend-il les enfants ?',
        ('fam-email', 'retard', 1): 'À quelle heure Chloé et Jules arrivent-ils ?',
        ('fam-email', 'gare', 3): 'Où Adam attend-il Sonia ?',
        ('fam-email', 'train', 2): 'À quelle heure Sonia arrive-t-elle ?',
        ('fam-email', 'absence', 0): 'Qui est absent demain matin ?',
        ('fam-email', 'absence', 1): 'Pourquoi Oscar est-il absent ?',
        ('fam-email', 'absence', 2): 'Qui ramène Oscar à l’école ?',
        ('fam-email', 'absence', 3): 'Vers quelle heure Oscar revient-il ?',
        ('fam-email', 'logement', 1): 'Quand a lieu la visite ?',
    }
    units = []
    for position, (slug, raw_text) in enumerate(rows):
        old = legacy[slug]
        text = raw_text.replace('\\n', '\n')
        uid = f'famille-{kind}-{slug}'
        questions = []
        for index, q in enumerate(old['questions']):
            prompt = overrides.get((kind, slug, index), q['prompt'])
            questions.append({'id': f'{uid}-q{index+1}', 'prompt': prompt, 'answers': [q['answer']],
                              'response': 'choice', 'options': choices(q['answer'], q['options']),
                              'evidence': evidence_for(text, prompt, q['answer']),
                              'explanation': 'Le lien familial, le métier ou l’information sont indiqués dans le document. Le point de vue est celui de la personne nommée.'})
        units.append({'id': uid, 'kind': 'reading', 'prompt': old['title'], 'genre': old['genre'], 'text': text,
                      'answers': [], 'questions': questions, 'explanation': 'Source interne réemployée et adaptée à A1, sans modification du document historique.',
                      'source': {'path': 'scripts/grammar_curriculum/'+filename, 'typeId': 'gram-ex-famille-'+kind,
                                 'position': position, 'partition': 'A1 — adaptation du document historique '+slug}})
    return units


def main():
    baby = baby_support()
    det = []
    possessives = read_rows('family-a1-possessives.tsv', 6)
    assert len(possessives) == 50
    for i, (slug, owner, prompt, answer, bad1, bad2) in enumerate(possessives):
        uid = 'famille-fam-det-'+slug
        vowel = re.match(r'^___ (amie|histoire)\b', prompt) is not None
        explanation = f'Possesseur {owner} : on emploie {answer.lower()} devant ce nom.'
        if vowel:
            explanation += ' Devant amie ou histoire, le féminin singulier commence par une voyelle ou un h muet : mon, ton ou son.'
        det.append({'id': uid, 'kind': 'completion', 'prompt': prompt, 'answers': [answer],
                    'agreementHint': 'possesseur : '+owner, 'options': choices(answer, [answer, bad1, bad2]),
                    'explanation': explanation,
                    'source': {'path': 'scripts/grammar_curriculum/family-a1-possessives.tsv', 'typeId': 'gram-ex-famille-fam-det', 'position': i}})
    birth = []
    rows = read_rows('family-a1-births.tsv', 7)
    assert len(rows) == 20
    for i, (slug, genre, title, raw_text, *raw_questions) in enumerate(rows):
        uid = 'famille-faire-part-'+slug
        text = raw_text.replace('\\n', '\n')
        questions = []
        for n, raw in enumerate(raw_questions):
            prompt, answer, evidence, bad1, bad2 = raw.split('^')
            assert evidence in text, (slug, evidence)
            questions.append({'id': f'{uid}-q{n+1}', 'prompt': prompt, 'answers': [answer],
                              'response': 'choice', 'options': choices(answer, [answer, bad1, bad2]),
                              'evidence': [evidence], 'explanation': 'L’annonce donne cette information ou ce lien familial explicitement.'})
        birth.append({'id': uid, 'kind': 'reading', 'genre': genre, 'prompt': title, 'text': text, 'answers': [],
                      'questions': questions, 'supportLayout': 'image-left', 'imageSupports': [baby],
                      'explanation': 'L’illustration accompagne l’annonce ; les réponses reposent sur le texte.',
                      'source': {'path': 'scripts/grammar_curriculum/family-a1-births.tsv', 'typeId': 'gram-ex-famille-fam-faire-part', 'position': i}})
    photo = adapted_readings('family-a1-reading.tsv', 'family-reading-data', 'fam-photo')
    messages = adapted_readings('family-a1-messages.tsv', 'family-message-data', 'fam-email')
    banks = [make_bank('fam-det', 'Déterminants possessifs', ['choice', 'gap'],
                      {'choice': 'Choisissez le déterminant possessif selon le possesseur indiqué.', 'gap': 'Complétez avec le déterminant possessif selon le possesseur indiqué.'}, det)]
    for kind, label, units, instruction in [
        ('fam-faire-part', 'Faire-part de naissance', birth, 'Lisez le faire-part, puis répondez aux questions.'),
        ('fam-photo', 'Photo de famille', photo, 'Lisez le document, puis répondez aux questions.'),
        ('fam-email', 'Message et email', messages, 'Lisez le message ou l’email, puis répondez aux questions.'),
    ]:
        banks.append(make_bank(kind, label, ['document-set'], {'document-set': instruction}, units))
    (ROOT / DEST).write_text(json.dumps(banks, ensure_ascii=False, indent=2)+'\n')
    print('Family A1: four activities, five offerings; 50 possessives, 60 texts, 260 reading questions, one restored existing baby image.')


if __name__ == '__main__':
    main()
