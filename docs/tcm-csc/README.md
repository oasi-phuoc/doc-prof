# Test TCM CSC

Le domaine **TCM CSC** charge les exercices 1 à 20 et 22 à 24, précédés d’une page d’informations. L’exercice 21 reste réservé. La révision du 12 novembre 2026 produit **seize pages élèves**, dont une page de suite pour les grandes grilles de l’exercice 10, et **trente-deux pages avec les corrigés**. Les quinze pages de configuration conservent leurs numéros dans le générateur. Aucun exercice ne déborde sous son pied de page.

La demande initiale provient de `tcmcsc.txt`. Les précisions du propriétaire du 12 novembre remplacent les comparaisons de l’exercice 8 par la décomposition du TCM CFR, exercice 5 ; l’exercice 9 devient la lecture écrite des trois signes `+`, `−` et `=` suivant la présentation du TCM CFR, exercice 6.

| Exercice | Contenu |
|---|---|
| 1 | Cinq nombres entendus distincts de 1 à 100 |
| 2 | Cinq additions ou soustractions : nombre, « plus » ou « moins », nombre ; aucun résultat dans l’audio |
| 3 | 36 nombres dans six colonnes et six lignes de cases carrées de 18 mm ; cinq nombres à entourer |
| 4–5 | Quatre suites par exercice ; pour le 4, pas au début de la ligne dans un cadre coloré |
| 6 | Deux rangements de sept entiers entre 0 et 100 |
| 7 | Douze comparaisons de 0 à 100, quatre de chaque signe ; consigne « Coloriez le signe correct » |
| 8 | Deux décompositions identiques au modèle CFR : un nombre à trois chiffres et un à quatre chiffres |
| 9 | Trois signes à nommer : « plus », « moins », « égal » ; signe encadré et trait de réponse sur la même ligne |
| 10 | Quatre additions et quatre soustractions sur deux pages ; cinq colonnes fixes, cases de 56 × 56 px, retenues de 36 px |
| 11 | Deux additions et deux soustractions à poser ; mêmes cinq colonnes et grandes cases |
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

L’icône audio télécharge `TCM-CSC_AUDIOS.zip`, contenant trois WAV séparés : nombres de l’exercice 1, calculs de l’exercice 2 et nombres à entourer de l’exercice 3. Chaque piste comprend cinq consignes séparées par six secondes. Les clips sont décodés avant composition ; les MP3 ne sont pas simplement collés. Un échec de chargement est signalé et permet de réessayer. Les mots d’opérateur et leur provenance sont décrits dans [operator-audio.json](operator-audio.json).

Le barème par défaut vaut 82 points et se modifie dans le générateur. Les grilles comprenant plusieurs réponses regroupent leurs points dans un même bloc. Les fiches TCM CFR et TPM gardent leurs types et leurs générateurs.

## Jeu interactif

Les dictées de nombres et calculs oraux (exercices 1 et 2), les opérations posées avec résultat manquant (10) et les problèmes (22 à 24) peuvent être repris dans le jeu Classe ou Solo. Les problèmes gardent leur énoncé et leurs valeurs ; une nouvelle partie d’un modèle généré renouvelle les nombres en conservant le contexte. Les éditions libres restent associées au texte validé. Les 103 contextes sont vérifiés, avec des propositions numériques déterministes et une correction affichée uniquement dans les cartes après révélation.

Une incohérence entre énoncé, nombres et corrigé, ou une ancienne égalité enregistrée admettant plusieurs signes, est signalée pendant la préparation. Les autres exercices CSC demandent encore une adaptation au jeu. Voir [le contrat et les vérifications](../interactive/adr-0023-problemes-csc.md).

## Vérification

Le [relevé du 12 novembre](revision-20261112.json) consigne les nouvelles consignes, les dimensions, les 220 tests et les vérifications d’impression et d’audio.

- [Exemple A4 élèves et corrigés](tcm-csc-exemple.pdf).
- [Résultats navigateur](browser-results.json) : génération depuis le menu, trois WAV réellement décodés, impression, géométrie et sélection en mode libre.
- `tests/interactive/tcm-csc.test.mjs` : 100 graines, bornes et calculs, trois exemples initiaux, 103 contextes, cohérence des coordonnées et des figures, déterminisme et données invalides.

```sh
node --test tests/interactive/tcm-csc.test.mjs
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:tcm-csc:browser
```

La vérification A4 est réalisée dans Chromium ; un essai sur l’imprimante de classe reste nécessaire pour les mesures physiques des segments.
