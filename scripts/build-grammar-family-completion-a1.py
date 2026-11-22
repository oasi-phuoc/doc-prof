"""Finish the three A1 family activities from 50 explicit fictional situations."""
import csv
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = 'scripts/grammar_curriculum/family-a1-situations.tsv'
DEST = 'src/grammaire/curriculum/data/famille-completion.json'
DATE = '2026-11-22'


def de(name):
    return ('d’' if re.match('[aeiouhàâéèêëîïôöùûüœ]', name.lower()) else 'de ') + name


def bank(activity, label, presentation, instruction, units):
    return {'schemaVersion': 1, 'revision': f'famille-{presentation}-{DATE}.1',
            'activityId': activity, 'subthemeId': 'famille', 'topic': 'gram-se-presenter', 'level': 'A1',
            'label': label, 'objective': 'Présenter une famille fictive et identifier les liens depuis un point de vue explicite.',
            'editorialStatus': 'reviewed', 'review': {'reviewer': 'Codex — relecture linguistique et fonctionnelle',
                'date': DATE, 'humanReview': 'pending',
                'note': '50 contextes familiaux explicites partagés entre trois tâches distinctes. Aucun fait personnel imposé. Modèles non exclusifs pour les productions. Approbation enseignante en attente.'},
            'presentations': [presentation], 'instructions': {presentation: instruction}, 'units': units}


def main():
    rows = list(csv.reader((ROOT / SOURCE).read_text().splitlines(), delimiter='|'))
    assert len(rows) == 50 and all(len(row) == 9 for row in rows)
    assert len({r[0] for r in rows}) == len({r[2] for r in rows}) == 50
    matches, oral, written = [], [], []
    ids = ['gram-ex-famille-curriculum-a', 'gram-ex-famille-curriculum-p', 'gram-ex-famille-fam-pe']
    genres = {'album', 'message', 'email', 'invitation', 'portrait'}
    for position, (slug, reference, facts, raw_pairs, occasion, oral_task, follow_up, written_task, genre) in enumerate(rows):
        pairs = [p.split('~') for p in raw_pairs.split(';')]
        assert 3 <= len(pairs) <= 5 and all(len(p) == 2 and p[0] in facts for p in pairs)
        assert len({p[0] for p in pairs}) == len({p[1] for p in pairs}) == len(pairs)
        assert genre in genres
        profile = f'Famille {de(reference)}\n{facts}\n{occasion}'
        model = f'Voici la famille {de(reference)}. ' + ' '.join(f'{relation.capitalize()} s’appelle {name}.' for name, relation in pairs) + ' ' + occasion
        source = lambda activity: {'path': SOURCE, 'typeId': activity, 'position': position,
                                  'partition': 'A1 — famille fictive ; contexte partagé, tâche propre à chaque activité'}
        uid = f'famille-associer-{slug}'
        matches.append({'id': uid, 'kind': 'match', 'prompt': profile + f'\nQuel est le lien de chaque personne avec {reference} ?',
                        'pairs': [{'id': f'{uid}-p{i+1}', 'left': name, 'right': relation, 'sourceId': uid} for i, (name, relation) in enumerate(pairs)],
                        'answers': [' ; '.join(f'{name} → {relation}' for name, relation in pairs)],
                        'explanation': f'Point de vue : {reference}. Les liens directs et les chemins de parenté reposent sur ces faits : {facts}',
                        'source': source(ids[0])})
        criteria = [{'id': 'liens', 'label': 'Liens conformes aux faits de la fiche.'},
                    {'id': 'referents', 'label': 'Personnes et référents clairement identifiés.'},
                    {'id': 'possessifs', 'label': 'Pronoms et déterminants possessifs cohérents.'},
                    {'id': 'comprehensible', 'label': 'Phrases simples et compréhensibles.'},
                    {'id': 'tache', 'label': 'Destinataire et intention de la tâche respectés.'}]
        for mode, activity, task, target in [('oral', ids[1], oral_task, oral), ('written', ids[2], written_task, written)]:
            answer = model
            if mode == 'written' and genre in {'message', 'email', 'invitation'}:
                answer = 'Bonjour,\n' + model + '\nÀ bientôt.'
            target.append({'id': f'famille-{mode}-{slug}', 'kind': 'production', 'mode': mode,
                           'prompt': (f'Famille {de(reference)} : {facts} {occasion}' if mode == 'written' else profile), 'task': task,
                           'answers': [answer], 'rubric': criteria, 'writeLines': 6 if mode == 'written' else 0,
                           'explanation': ('Modèle possible, non exclusif. Relance pour l’enseignant : ' + follow_up if mode == 'oral' else 'D’autres formulations sont recevables. Respecter les faits de la fiche et le destinataire.'),
                           'source': source(activity)})
    banks = [bank(ids[0], 'Associer les liens de parenté', 'match', 'Lisez les faits. Associez chaque personne à son lien avec la personne de référence.', matches),
             bank(ids[1], 'S’exprimer à l’oral', 'open-oral', 'Présentez la famille fictive selon la situation. Utilisez les faits de la fiche.', oral),
             bank(ids[2], 'Écrire sur sa famille', 'open-written', 'Écrivez le texte demandé à partir de la famille fictive. Aucune information personnelle n’est demandée.', written)]
    (ROOT / DEST).write_text(json.dumps(banks, ensure_ascii=False, indent=2) + '\n')
    print(f'Famille A1 : 3 activités, 150 unités, {sum(len(u["pairs"]) for u in matches)} liens explicites ; 50 contextes partagés, aucun média généré.')


if __name__ == '__main__':
    main()
