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

- `python3 scripts/build-grammar-family-completion-a1.py` : les 50 contextes de `family-a1-situations.tsv`, réemployés pour 50 problèmes d’association complets, 50 tâches orales et 50 tâches écrites ; écrit uniquement `famille-completion.json`.
- `python3 scripts/build-grammar-identity-a1.py` : les 50 contextes d’`identity-a1.tsv`, leurs tâches distinctes et les 20 textes d’`identity-a1-reading.tsv` ; écrit `a1.json`.
- `python3 scripts/build-grammar-nationalities-a1.py` : 50 prédicats complets, 17 nationalités fictives déclarées et les médias existants du manifeste ; écrit `a3.json`.
- `python3 scripts/build-grammar-family-a1.py` : possessifs identifiés une fois dans leur TSV, 20 annonces de naissance et deux adaptations A1 des documents historiques ; écrit `famille.json`. Le bébé est repris sans modification depuis le commit indiqué dans le compilateur, sous un chemin SHA-256 immuable.

Les slugs/IDs des sources restent stables. Une correction livrée exige une nouvelle révision de banque ; les anciennes recettes conservent leur sélection canonique. Les sources historiques, les fichiers CO, la théorie et les formulaires TPF ne sont pas réécrits par ces scripts. Les 29 récits et 29 messages historiques restent conservés ; le pilote choisit et adapte 20 supports de chaque banque.

Après compilation, les contrôles dédiés sont `npm run test:grammar:presentation-extension` et `npm run test:grammar:presentation-extension:browser`. Les capacités, les preuves CE, les contrats personnels/formulaires et les sauvegardes sont vérifiés séparément des rendus A4 et du tableau. Le script `node scripts/update-grammar-presentation-progress.cjs` actualise le registre et le CSV du 21 novembre ; `--verified` n’est utilisé qu’après les contrôles de rendu enregistrés. Il ne réécrit pas les rapports datés ni la référence G0.

La clôture du thème du 22 novembre utilise `npm run test:grammar:family-completion`, son parcours `:browser` et `node scripts/update-grammar-family-progress.cjs --verified`. Ce dernier conserve les rapports datés précédents et écrit le CSV du 22 novembre. La reconstruction des quatre premières activités de famille reste indépendante et ne remplace pas les trois nouvelles banques.

`npm run test:grammar:image-urls` contrôle le partage et la libération des URL d’images vérifiées. Les nouvelles banques CE acceptent deux à cinq questions par texte avec au moins 50 questions au total ; le lecteur de snapshots conserve la compatibilité avec les anciens questionnaires plus longs.

## Questions et retrait de la branche remplacée — 22 novembre 2026

`python3 scripts/build-grammar-questions-a1.py` écrit exclusivement `curriculum/data/c1.json`, `c2.json` et `c3.json`. Les sources corrigées sont `questions-a1-source.json` et `questions-a1-oral.tsv`. Les 22 activités donnent 24 présentations, 920 unités sélectionnables et 1 500 variantes. Les 60 documents sont utilisés dans six banques de lecture/écriture ; les 50 contextes oraux sont partagés entre trois tâches.

Les anciennes banques des notions migrées sont supprimées du code applicatif, sur demande explicite du propriétaire. Le constructeur historique filtre `retired-subthemes.json` pour ne pas les recréer. Les compléments du présent et modaux ne doivent plus être reconstruits dans l’ancien dossier ; leur base courante est dans `curriculum/data/`. La reconstruction Famille lit seulement ses 40 supports utiles dans `family-a1-reading-sources.json`. Les tests de comparaison historique utilisent Git en lecture seule.

Contrôles : `npm run test:grammar:questions`, `npm run test:grammar:questions:browser`, puis `node scripts/update-grammar-questions-progress.cjs --verified` une fois les preuves obtenues. Les fiches distantes n’ont pas encore pu être nettoyées à cause du blocage réseau 403 ; voir le [rapport de retrait](../../docs/grammaire/implementation/retrait-banques-20261122.md).

## La phrase exclamative — 23 novembre 2026

`python3 scripts/build-grammar-exclamation.py` compile les 50 scènes de `exclamation-a1.tsv` et les 50 scènes de `exclamation-a2.tsv` dans `curriculum/data/c4.json` : sept banques, neuf offres A1/A2, 350 unités et 450 variantes. Les sources sont réemployées entre les activités ; il ne s’agit pas de 350 situations originales. Les alternatives comme/que/qu’ sont admises sans mettre deux bonnes réponses dans un QCM. Les modèles gardent l’apostrophe attachée au mot suivant.

Contrôles : `npm run test:grammar:exclamation` et `npm run test:grammar:exclamation:browser`. Après ces preuves, `node scripts/update-grammar-exclamation-progress.cjs --verified` actualise le registre, le CSV du 23 novembre et les types gradués disponibles. Les niveaux d’une activité partagée sont regroupés dans ses métadonnées, sans écraser A1 par A2.

L’ancienne banque c4 est retirée. `node scripts/build-retired-grammar-sql.cjs` reconstruit la liste de notions dans la requête D1 depuis `retired-subthemes.json`. Le contrôle de pools écrit `current-pools-verification.json` ; `--evidence=docs/grammaire/implementation/exclamation-20261123-proofs/pools.json` conserve une preuve datée supplémentaire sans réécrire celle du thème précédent. La suppression distante reste soumise à l’accès effectif au serveur, bloqué 403 lors du dernier essai.


### Parler du passé — 24 novembre 2026

Les huit fichiers `passe-*.tsv` portent 400 situations relues. `passe-pqp-lectures-b1.json` contient vingt documents et soixante cibles de questionnement. `python3 scripts/build-grammar-passe.py` compile les huit nouvelles banques sans réécrire `imparfait-ou-pc.json`.

Les sources sont réemployées explicitement : h1/h2 partagent les faits avec avoir ; h6 A2 forme le groupe verbal et B1 analyse la construction ; h9 A2 reprend des cas simples avec avoir/être. Les modèles d’écrit et de questions restent non exclusifs. La validation pédagogique humaine est en attente.

`npm run test:grammar:passe` vérifie les variantes, recettes, filtres et intervalles de correction puis reconstruit les banques dans un répertoire isolé. `npm run test:grammar:passe:browser` utilise un aperçu de production sur le port 5188 et conserve les mesures et PDF dans `docs/grammaire/implementation/passe-20261124-proofs`.


### Les pronoms — 24 novembre 2026

Les huit fichiers `pronoms-*.tsv` contiennent 400 situations relues. `pronoms-i9-lectures-b1.json` développe vingt situations i9 en vingt documents de trois cibles de questionnement chacun. `python3 scripts/build-grammar-pronoms.py` compile les huit banques sans réécrire la banque COD `i4.json`.

Les variantes réemploient les mêmes situations. Les lacunes avec dont donnent les deux faits et conservent l’ordre des mots restants. Les productions et questions ouvertes admettent les reformulations fidèles. Les reprises neutres concernées acceptent cela et ça. La validation pédagogique humaine est en attente.

`npm run test:grammar:pronoms` vérifie réponses, référents, recettes, capacités et intervalles de correction, puis reconstruit les banques en isolation. `npm run test:grammar:pronoms:browser` attend un aperçu de production sur le port 5189 et écrit les preuves dans `docs/grammaire/implementation/pronoms-20261124-proofs`.
