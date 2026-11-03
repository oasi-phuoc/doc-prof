# Contenus éditoriaux de grammaire

Lancer `python scripts/grammar_curriculum/build.py` depuis la racine du dépôt. Le script n’utilise ni réseau, ni modèle de génération, ni fichier d’image.

- `notions.json` conserve les explications de la réécriture annulée, à titre d’archive.
- `theory-source.json` conserve la théorie antérieure, utilisée pour vérifier la restauration. La théorie se modifie directement dans `src/grammaire/theory/` ; les générateurs ne la réécrivent plus.
- `lexicon.py` contient les formes françaises et les contextes rédigés.
- `banks_*.py` construisent les banques par notion ; `curate.py` ajoute les cas particuliers relus.
- `protected-source.json` conserve les sept banques d’introduction, complétées par `protected_banks.py`.
- `communications.py` contient les 160 situations et leurs questions/modèles.
- `build.py` écrit uniquement les banques d’exercices, les situations et les rapports dans `docs/grammaire/`.

Les changements éditoriaux se font dans ces sources, puis le générateur et `node scripts/test-grammar-curriculum.cjs` sont relancés. Les anciennes banques Word/cumulées ne sont plus utilisées.
