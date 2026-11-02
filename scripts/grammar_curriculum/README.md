# Contenus éditoriaux de grammaire

Lancer `python scripts/grammar_curriculum/build.py` depuis la racine du dépôt. Le script n’utilise ni réseau, ni modèle de génération, ni fichier d’image.

- `notions.json` contient les explications réécrites : usage, règles, exemples et attention.
- `theory-source.json` conserve les métadonnées et les tableaux de départ nécessaires à une reconstruction. Les deux thèmes protégés ne sont jamais réécrits.
- `lexicon.py` contient les formes françaises et les contextes rédigés.
- `banks_*.py` construisent les banques par notion ; `curate.py` ajoute les cas particuliers relus.
- `protected-source.json` conserve les huit banques d’introduction, complétées par `protected_banks.py`.
- `communications.py` contient les 160 situations et leurs questions/modèles.
- `build.py` écrit les fichiers du moteur et les rapports dans `docs/grammaire/`.

Les changements éditoriaux se font dans ces sources, puis le générateur et `node scripts/test-grammar-curriculum.cjs` sont relancés. Les anciennes banques Word/cumulées ne sont plus utilisées.
