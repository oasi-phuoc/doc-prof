"""Recover existing phrase-bank texts without importing or running speech synthesis.

Only pure template functions from the original generator are evaluated. Existing
filenames are matched against their exact generated text; no audio is created.
The generated metadata is committed, so normal Node builds do not need Python.
"""
import ast
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
source = ROOT / 'scripts/generate-soutien-phrase-audios.py'
tree = ast.parse(source.read_text())
functions = {'slug', 'is_feminine', 'starts_vowel', 'art_indef', 'art_def', 'with_art', 'pick_bonus', 'phrases_for', 'load_lecture_by_phoneme', 'load_vowel_words'}
nodes = [node for node in tree.body if isinstance(node, ast.FunctionDef) and node.name in functions or isinstance(node, ast.Assign) and any(getattr(target, 'id', '') in {'NAMES', 'SOUND_BONUS'} for target in node.targets)]
scope = {'ROOT': ROOT, 'Path': Path, 're': re}
exec(compile(ast.Module(body=nodes, type_ignores=[]), str(source), 'exec'), scope)
lecture, vowels = scope['load_lecture_by_phoneme'](), scope['load_vowel_words']()
out = {}
for phoneme in sorted(set(lecture) | set(vowels)):
    for word in dict.fromkeys(vowels.get(phoneme, []) + lecture.get(phoneme, [])):
        for index in range(32):
            for text in scope['phrases_for'](word.strip(), phoneme, index):
                name = '/lib/audio/soutien/phrases/' + scope['slug'](text) + '.mp3'
                if (ROOT / ('public' + name)).is_file():
                    out.setdefault(name, set()).add(text)
target = ROOT / 'src/audio-catalog/spoken-texts.generated.json'
target.write_text(json.dumps({key: sorted(values) for key, values in sorted(out.items())}, ensure_ascii=False, separators=(',', ':')) + '\n')
print(f'{len(out)} textes de pistes existantes retrouvés ; aucune synthèse exécutée.')
