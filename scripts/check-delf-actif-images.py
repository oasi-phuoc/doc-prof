"""Check complete image task coverage and source-bound DELF Actif activations."""
from collections import Counter
import hashlib
import json
from tcf_context_audit import ROOT, BANKS, digest, semantic_question, source_for, text_form
from tcf_replace_vocabulary_images import checked_images


def read(path):
    return json.loads((ROOT / path).read_text())


def verify():
    directory = 'docs/tcf/delf-actif-20261113'
    installed = {r['exercise_id']: r for r in read(f'{directory}/installation.json')['units']}
    plan = read(f'{directory}/images-a-preparer.json')
    exercises = {e['id']: e for p in BANKS for e in json.loads(p.read_text())}
    rows = {r['key']: r for r in plan['questions']}
    supports = {r['exercise']: r for r in plan['supports']}
    approved = checked_images(read('docs/tcf/images-generees.json'))
    expected_keys = {f'{key}#{i}' for key in installed for i in range(1, len(exercises[key]['questions']) + 1)}
    assert set(rows) == expected_keys and len(rows) == len(plan['questions']) == 1663
    assert set(supports) == set(installed) and len(plan['supports']) == 346
    assert plan['style_reference_commit'] == '48a753d8d6bd095e41968b39da88dbcb331fee11'
    proofs = {}
    active = 0
    for key, record in installed.items():
        ex = exercises[key]
        source, audio = source_for(ex, {})
        support = supports[key]
        assert support['source'] == source and support['source_sha256'] == digest(source), key
        assert support['audio'] == audio == record['audio'], key
        audio_sha = hashlib.sha256((ROOT / 'public' / audio.lstrip('/')).read_bytes()).hexdigest()
        assert audio_sha == support['audio_sha256'] == record['audio_sha256'], key
        for i, q in enumerate(ex['questions'], 1):
            name = f'{key}#{i}'
            row = rows[name]
            assert row['source_sha256'] == digest(source) and row['semantic_sha256'] == digest(semantic_question(q)), name
            assert row['audio_sha256'] == audio_sha and row['audio'] == audio, name
            assert [(c['id'], c['label'], c['correct']) for c in row['choices']] == [(c['id'], c['texte'], bool(c.get('correct'))) for c in text_form(q)['choix']], name
            for c in row['choices']:
                for candidate in c['reuse_candidates']:
                    assert candidate['visual_review_required'] is True
                    assert candidate['path'] in approved and candidate['sha256'] == approved[candidate['path']]['sha256'], name
                    assert not candidate['path'].startswith('/lib/images/vocabulaire/'), name
            form = q.get('formes', {}).get('qcm_image')
            if not form:
                assert row['status'] != 'active_reviewed_trio' and not row['active_images'], name
                continue
            active += 1
            assert row['status'] == 'active_reviewed_trio' and row['visual_review']['note'], name
            register = row['visual_review']['register']
            if register not in proofs:
                proofs[register] = {r['key']: r for r in read(register)['trios']}
            proof = proofs[register][name]
            assert proof['source_sha256'] == row['source_sha256'] and proof['semantic_sha256'] == row['semantic_sha256'], name
            assert proof['source'] == source and proof['question'] == semantic_question(q), name
            assert proof['audio_sha256'] == audio_sha and proof['reason'] and proof['visual_review'], name
            choices = form['choix']
            assert len(choices) == len({c['image'] for c in choices}) == 3, name
            assert [(c['id'], bool(c.get('correct'))) for c in choices] == [(c['id'], bool(c.get('correct'))) for c in text_form(q)['choix']], name
            assert [c['image'] for c in choices] == proof['image_paths'] == [c['path'] for c in row['active_images']], name
            assert [approved[c['image']]['sha256'] for c in choices] == proof['image_sha256'] == [c['sha256'] for c in row['active_images']], name
    counts = dict(Counter(r['status'] for r in rows.values()))
    assert counts == plan['summary']['statuses']
    assert active == counts.get('active_reviewed_trio', 0)
    for name in ['tcf-delf-actif-a2-005-06#5', 'tcf-delf-actif-a2-043-02-01#4']:
        cream = next(c for c in rows[name]['choices'] if 'crème' in c['label'].casefold())
        assert cream['reuse_candidates'] and all('creme-alimentaire' not in c['path'] for c in cream['reuse_candidates']), name
        assert any('extension573-creme-cosmetique' in c['path'] for c in cream['reuse_candidates']), name
    for name in ['tcf-delf-actif-a2-043-04-03#3', 'tcf-delf-actif-a2-044-03-01#6']:
        shop = next(c for c in rows[name]['choices'] if 'pâtisserie' in c['label'].casefold())
        assert shop['reuse_candidates'] and all(not c['path'].endswith('/vocab-patisserie.webp') for c in shop['reuse_candidates']), name
        assert any(c['path'].endswith('/co/bg/patisserie.webp') for c in shop['reuse_candidates']), name
    for level, summary in plan['summary']['by_level'].items():
        assert summary == dict(Counter(r['status'] for r in rows.values() if r['level'] == level))
    drink = next(c for c in rows['tcf-delf-actif-a2-044-01-06#3']['choices'] if 'chocolat' in c['label'].casefold())
    assert drink['reuse_candidates'] and all(not c['path'].endswith('/co834-chocolat-dessine.webp') and 'chocolat-tablette' not in c['path'] for c in drink['reuse_candidates'])
    assert any(c['path'].endswith('/co834-chocolat-chaud-dessine.webp') for c in drink['reuse_candidates'])
    cream = next(c for c in rows['tcf-delf-actif-a2-046-01-04#3']['choices'] if 'crème' in c['label'].casefold())
    assert any('creme-alimentaire' in c['path'] for c in cream['reuse_candidates'])
    assert all('creme-cosmetique' not in c['path'] for c in cream['reuse_candidates'])
    paper = next(c for c in rows['tcf-delf-actif-a2-043-01-03#1']['choices'] if 'feuilles' in c['label'].casefold())
    assert paper['reuse_candidates'] and all(not c['path'].endswith('/vocab-feuilles.webp') for c in paper['reuse_candidates'])
    assert any(c['path'].endswith('/vocab-papiers.webp') for c in paper['reuse_candidates'])
    print(f'346 supports et 1 663 questions suivis ; {active} trios actifs liés à leur relecture, images et MP3 vérifiés.')


if __name__ == '__main__':
    verify()
