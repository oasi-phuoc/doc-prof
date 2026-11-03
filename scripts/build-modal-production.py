#!/usr/bin/env python3
"""Fifty situations targeting permission, obligation and wishes in the present."""
from pathlib import Path
import json,sys
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'scripts/grammar_curriculum'))
from lexicon import REGULAR
rows=[]
for i,(verb,complement) in enumerate(REGULAR):
 action=verb+' '+complement
 if i%3==0:
  prompt=f'Vous demandez l’autorisation de {action}. Formulez votre demande avec pouvoir.'
  answer='Est-ce que je peux '+action+' ?'
 elif i%3==1:
  prompt=f'Vous avez l’obligation de {action}. Exprimez cette obligation avec devoir.'
  answer='Je dois '+action+'.'
 else:
  prompt=f'Votre souhait est de {action}. Exprimez ce souhait avec vouloir.'
  answer='Je veux '+action+'.'
 prompt=prompt.replace('de écouter','d’écouter').replace('de arriver','d’arriver').replace('de aimer','d’aimer').replace('de aider','d’aider').replace('de étudier','d’étudier').replace('de expliquer','d’expliquer').replace('de inviter','d’inviter').replace('de emprunter','d’emprunter').replace('de apporter','d’apporter').replace('de utiliser','d’utiliser').replace('de observer','d’observer').replace('de organiser','d’organiser')
 rows.append(dict(prompt=prompt,answer=answer))
assert len(rows)==len({row['prompt'] for row in rows})==50
(ROOT/'src/grammaire/exercises/modal-production-data.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n')
