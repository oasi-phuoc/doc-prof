"""Publish the preserved communication situations as illustrated teaching sheets."""

import hashlib
import json
import os
from pathlib import Path

from communications import ALL

ROOT = Path(__file__).resolve().parents[2]
DOCS = ROOT / 'docs/grammaire'


def attach_illustrations():
    registry = DOCS / 'illustrations.json'
    if not registry.exists():
        return {}
    illustrations = json.loads(registry.read_text(encoding='utf-8'))
    variants = {variant['id']: variant for group in ALL for variant in group['variants']}
    assert illustrations.keys() <= variants.keys(), illustrations.keys() - variants.keys()
    for identifier, illustration in illustrations.items():
        file = ROOT / 'public' / illustration['image'].lstrip('/')
        assert file.is_file(), identifier
        assert hashlib.sha256(file.read_bytes()).hexdigest() == illustration['sha256'], identifier
        variants[identifier]['image'] = illustration['image']
    return illustrations


def render_situation(variant, illustration):
    path = Path(os.path.relpath(ROOT / 'public' / variant['image'].lstrip('/'), DOCS)).as_posix()
    alt = illustration.get('title', variant['title'])
    context = variant['text'].split('Voici une phrase utile :', 1)[0].rstrip()
    lines = [f"### {variant['title']}", '', f'![{alt}]({path})', '',
             '**Lire la situation**', '', context, '']
    for i, question in enumerate(variant['questions'], start=1):
        # The source stores the correct answer first. Rotate the visible order for the handout.
        options = question['options'][:]
        offset = i % len(options)
        options = options[offset:] + options[:offset]
        lines.extend([f"{i}. {question['enonce']}", '',
                      '   ' + ' · '.join(f'{letter}. {option}' for letter, option in zip('ABC', options))])
    lines.extend(['', f"**Écrire** — {variant['pe']}", '', f"**Dire** — {variant['po']}", '',
                  '<details>', '<summary>Corrigé et modèle</summary>', ''])
    lines.extend(f"{i}. {question['answer']}" for i, question in enumerate(variant['questions'], start=1))
    lines.extend(['', f"Modèle de production — {variant['model']}", '', '</details>', ''])
    return lines


def write_resources(groups, illustrations):
    inventory = []
    sheets = ['# Fiches de communication illustrées', '',
              f'{len(illustrations)} situations illustrées sur les {sum(len(group["variants"]) for group in groups)} du registre.', '',
              'Chaque fiche propose un texte à lire, cinq questions, une production écrite et une prise de parole.',
              '', 'Les fiches ci-dessous reprennent les situations de la première banque de communication. '
              'Les activités par niveau restent dans le générateur. [Suivi des banques graduées](implementation/README.md)', '']
    for group in groups:
        illustrated = []
        for variant in group['variants']:
            illustration = illustrations.get(variant['id'])
            row = dict(id=variant['id'], description=variant['imageDescription'],
                       status='à générer ultérieurement', usedByExercise=illustration is not None)
            if illustration:
                row.update(status='réemployée et vérifiée' if illustration.get('reused') else 'générée et validée',
                           image=illustration['image'])
                illustrated.extend(render_situation(variant, illustration))
            inventory.append(row)
        if illustrated:
            sheets.extend([f"## {group['goal']}", '', *illustrated])
    (DOCS / 'images-a-preparer.json').write_text(json.dumps(inventory, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    (DOCS / 'fiches-communication-illustrees.md').write_text('\n'.join(sheets), encoding='utf-8')


if __name__ == '__main__':
    write_resources(ALL, attach_illustrations())
