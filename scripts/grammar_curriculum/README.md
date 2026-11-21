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

## Banques graduées de Se présenter — 21 novembre 2026

Ces compilateurs ciblent uniquement les nouveaux fichiers de `src/grammaire/curriculum/data/` :

- `python3 scripts/build-grammar-identity-a1.py` : les 50 contextes d’`identity-a1.tsv`, leurs tâches distinctes et les 20 textes d’`identity-a1-reading.tsv` ; écrit `a1.json`.
- `python3 scripts/build-grammar-nationalities-a1.py` : 50 prédicats complets, 17 nationalités fictives déclarées et les médias existants du manifeste ; écrit `a3.json`.
- `python3 scripts/build-grammar-family-a1.py` : possessifs identifiés une fois dans leur TSV, 20 annonces de naissance et deux adaptations A1 des documents historiques ; écrit `famille.json`. Le bébé est repris sans modification depuis le commit indiqué dans le compilateur, sous un chemin SHA-256 immuable.

Les slugs/IDs des sources restent stables. Une correction livrée exige une nouvelle révision de banque ; les anciennes recettes conservent leur sélection canonique. Les sources historiques, les fichiers CO, la théorie et les formulaires TPF ne sont pas réécrits par ces scripts. Les 29 récits et 29 messages historiques restent conservés ; le pilote choisit et adapte 20 supports de chaque banque.

Après compilation, les contrôles dédiés sont `npm run test:grammar:presentation-extension` et `npm run test:grammar:presentation-extension:browser`. Les capacités, les preuves CE, les contrats personnels/formulaires et les sauvegardes sont vérifiés séparément des rendus A4 et du tableau. Le script `node scripts/update-grammar-presentation-progress.cjs` actualise le registre et le CSV du 21 novembre ; `--verified` n’est utilisé qu’après les contrôles de rendu enregistrés. Il ne réécrit pas les rapports datés ni la référence G0.

`npm run test:grammar:image-urls` contrôle le partage et la libération des URL d’images vérifiées. Les nouvelles banques CE acceptent deux à cinq questions par texte avec au moins 50 questions au total ; le lecteur de snapshots conserve la compatibilité avec les anciens questionnaires plus longs.
