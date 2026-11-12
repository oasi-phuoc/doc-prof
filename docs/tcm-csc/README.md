# Test TCM CSC

Le domaine **TCM CSC** charge les exercices 1 à 20 et 22 à 24, précédés d’une page d’informations. L’exercice 21 reste réservé. La révision du 12 novembre 2026 produit **seize pages élèves** et **trente-deux pages avec les corrigés**. Les seize pages de configuration séparent désormais les exercices 4–5 du rangement de l’exercice 6 ; les huit calculs de l’exercice 10 tiennent sur une page. Aucun exercice ne déborde sous son pied de page.

La demande initiale provient de `tcmcsc.txt`. Les précisions du propriétaire du 12 novembre remplacent les comparaisons de l’exercice 8 par la décomposition du TCM CFR, exercice 5 ; l’exercice 9 devient la lecture écrite des trois signes `+`, `−` et `=` suivant la présentation du TCM CFR, exercice 6.

| Exercice | Contenu |
|---|---|
| 1 | Cinq nombres entendus distincts de 1 à 100 |
| 2 | Cinq additions ou soustractions : nombre, « plus » ou « moins », nombre ; aucun résultat dans l’audio |
| 3 | 36 nombres dans six colonnes et six lignes de cases carrées de 18 mm ; cinq nombres à entourer |
| 4–5 | Quatre suites par exercice ; 10 px supplémentaires entre lignes et entre nombres ; pour le 4, pas au début de la ligne dans un cadre coloré |
| 6 | Deux rangements de sept entiers entre 0 et 100 |
| 7 | Douze comparaisons de 0 à 100, quatre de chaque signe ; consigne « Coloriez le signe correct » |
| 8 | Deux décompositions identiques au modèle CFR : un nombre à trois chiffres et un à quatre chiffres |
| 9 | Trois signes à nommer : « plus », « moins », « égal » ; signe encadré et trait de réponse sur la même ligne |
| 10 | Quatre additions et quatre soustractions sur une page ; cinq colonnes fixes, cases de 42 × 42 px, retenues de 27 px |
| 11 | Deux additions et deux soustractions à poser ; mêmes cinq colonnes et cases de 42 × 42 px |
| 12–13 | Deux grilles séparées pour reproduire dans le même sens ; puis agrandissement avec deux fois plus de colonnes et de lignes |
| 14 | Trois segments à mesurer ; tableau A, B, C avec cases pour le plus long et le plus court |
| 15 | A, B, C et D peuvent se trouver dans toute la zone ; lettres séparées ; AB en rouge et CD en bleu |
| 16 | Deux questions de logique, chacune dans son cadre avec marge intérieure et espacement entre les questions |
| 17 | Carré, rectangle, cercle et triangle ; deux cadres par ligne sur deux lignes, avec les traits de réponse dans les cadres |
| 18 | Cadre de comptage réduit de moitié : hauteur de 97,5 mm |
| 19–20 | Cases du quadrillage doublées à 16 mm ; six couleurs distinctes ; forme et coordonnées sur la même ligne à gauche, sans nom écrit |
| 22–24 | Trois problèmes et leurs zones de développement au format du brouillon court CFR ; sans grille par défaut, avec bascule individuelle |

Les valeurs changent avec la graine du générateur. En mode libre, les choix et valeurs validés sont conservés. Le sélecteur de problèmes propose **103 contextes** : les trois exemples fournis, 50 additions supplémentaires et 50 soustractions supplémentaires. On peut choisir un autre énoncé, saisir les nombres ou utiliser **Changer les nombres**. Les réponses et les pistes audio sont recalculées à partir des valeurs. Une soustraction négative ou une donnée incompatible signale une erreur au lieu de fabriquer un corrigé.

Le mode libre permet également de choisir explicitement chacune des deux suites graphiques, de modifier les suites numériques, les nombres entendus, la grille, les points, les formes et la figure à reproduire. **Valider les changements** applique ces modifications à l’aperçu et à l’impression. L’icône d’aperçu permet de consulter le corrigé.

Dans l’aperçu du corrigé, les exercices 1, 2 et 3 affichent chacun **cinq lecteurs audio**. Chaque lecteur du 2 lit un calcul complet (« deux plus cinq », « dix moins trois »), sans son résultat. Le 3 propose cinq nombres, sans lecteur supplémentaire pour les silences. Les exercices oraux CFR utilisent également un lecteur par consigne complète. Les grilles d’opérations CSC et CFR ont des bordures entières de 1 px, sans marges négatives ; les retenues sont assombries à l’impression.

L’icône audio télécharge `TCM-CSC_AUDIOS.zip`, contenant trois WAV séparés : nombres de l’exercice 1, calculs de l’exercice 2 et nombres à entourer de l’exercice 3. Chaque piste comprend cinq consignes séparées par six secondes. Les clips sont décodés avant composition ; les MP3 ne sont pas simplement collés. Un échec de chargement est signalé et permet de réessayer. Les mots d’opérateur et leur provenance sont décrits dans [operator-audio.json](operator-audio.json).

Le barème par défaut vaut 82 points et se modifie dans le générateur. Les grilles comprenant plusieurs réponses regroupent leurs points dans un même bloc. Les fiches TCM CFR et TPM gardent leurs types et leurs générateurs.

## Jeu interactif

Les dictées de nombres et calculs oraux (exercices 1 et 2), les décompositions (8), les noms des signes (9), les opérations posées avec résultat manquant (10) et les problèmes (22 à 24) peuvent être repris dans le jeu Classe ou Solo. Les problèmes gardent leur énoncé et leurs valeurs ; une nouvelle partie d’un modèle généré renouvelle les nombres en conservant le contexte. Les éditions libres restent associées au texte validé. Les 103 contextes sont vérifiés, avec des propositions numériques déterministes et une correction affichée uniquement dans les cartes après révélation.

Une incohérence entre énoncé, nombres et corrigé, ou une ancienne égalité enregistrée admettant plusieurs signes, est signalée pendant la préparation. Les suites (4–5), le rangement (6) et les comparaisons (7) réutilisent aussi leurs adaptateurs existants. L’exercice 17 propose maintenant une question par forme, avec les quatre noms comme choix ; voir [la reconnaissance des formes](../interactive/adr-0032-reconnaissance-des-formes.md). Les autres exercices CSC demandent encore une adaptation au jeu. Voir les [décompositions et noms des signes](../interactive/adr-0031-decompositions-et-noms-des-signes.md). Voir [le contrat et les vérifications](../interactive/adr-0023-problemes-csc.md).

## Vérification

### Prises Denise demandées — préparation, génération encore bloquée

Le [prompt des neuf enregistrements](prompt-audios-denise.md) est désormais conservé dans le dépôt. `scripts/generate-tcm-csc-denise.py` prépare deux consignes, les cinq lettres françaises et les mots « plus » (/plys/) et « moins », avec **fr-FR-DeniseNeural, −25 %, volume normal, mono 24 kHz, MP3 96 kb/s**, puis un ZIP de neuf fichiers. Il ne remplace jamais la voix demandée par une autre.

```sh
python -m pip install 'edge-tts>=7.2,<8'
python scripts/generate-tcm-csc-denise.py --dry-run
# Après autorisation du service Microsoft dans les paramètres réseau :
python scripts/generate-tcm-csc-denise.py --output /tmp/tcm-csc-denise --install
```

La génération et l’installation sont séparées par `--install`. Les neuf prises doivent toutes être décodables, audibles et au bon format avant activation. Elles utilisent un dossier dédié ; les anciens nombres et opérateurs partagés restent disponibles. Le manifeste `src/tcm-csc/denise-recordings.json` reste actuellement à **`not_generated`** : les téléchargements existants continuent donc de fonctionner selon leur montage historique.

Le nouveau montage est préparé : consigne une fois, cinq secondes de silence réel, bip TCF existant, questions A à E, sept secondes entre les questions, sept secondes et bip avant une deuxième écoute strictement identique. Il réutilise les nombres variables et n’ajoute jamais le résultat d’un calcul. Les marges silencieuses des clips sont retirées avant insertion des pauses ; le résultat est un WAV mono 24 kHz. Ce montage demande cinq questions et ne sera activé qu’après disponibilité des neuf fichiers validés.

**Blocage confirmé :** le proxy sortant refuse `speech.platform.bing.com` avec un CONNECT 403. Aucun des neuf MP3 ni leur ZIP n’a été généré dans cette reprise. Les [contrôles navigateur du montage](denise-montage-test-20261112.json) utilisent uniquement des signaux synthétiques de test ; ils ne constituent ni des prises Denise ni une validation humaine de prononciation. Le contrôle vérifie les trois exercices, une pause exacte de cinq secondes, neuf pauses exactes de sept secondes, deux bips et dix lettres par piste, malgré les marges silencieuses ajoutées aux signaux d’entrée.

Tests : `node --test tests/interactive/csc-denise-audio.test.mjs tests/interactive/tcm-csc.test.mjs` et, avec Vite sur le port 5189, `node tests/interactive/csc-denise-audio-browser.mjs`.

Le [complément audio et impression](audio-grilles-20261112.json) consigne les cinq lecteurs et les grilles réduites, avec des [exemples CFR imprimés](tcm-cfr-grilles-exemple.pdf). Le [relevé initial du 12 novembre](revision-20261112.json) consigne les nouvelles consignes, les dimensions, les 220 tests et les vérifications d’impression et d’audio.

- [Exemple A4 élèves et corrigés](tcm-csc-exemple.pdf).
- [Résultats navigateur](browser-results.json) : génération depuis le menu, trois WAV réellement décodés, impression, géométrie et sélection en mode libre.
- `tests/interactive/tcm-csc.test.mjs` : 100 graines, bornes et calculs, trois exemples initiaux, 103 contextes, cohérence des coordonnées et des figures, déterminisme et données invalides.

```sh
node --test tests/interactive/tcm-csc.test.mjs
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:tcm-csc:browser
```

La vérification A4 est réalisée dans Chromium ; un essai sur l’imprimante de classe reste nécessaire pour les mesures physiques des segments.
