# Test TCM CSC

Le domaine **TCM CSC** charge un test de quinze pages élèves : une page d’informations puis les exercices 1 à 20 et 22 à 24. L’exercice 21 est réservé, conformément à la réponse du propriétaire du 11 novembre 2026. Avec les corrigés, l’impression produit trente pages A4. La mise en page est contrôlée pour que les exercices restent au-dessus du pied de page.

La demande provient du fichier `tcmcsc.txt` fourni dans le chat. Pour l’exercice 8, la précision « deux par signe » est appliquée : deux `<`, deux `>` et deux `=`, avec des entiers jusqu’à 999. L’exercice 9 demande de compléter les signes `+`, `−` et `=` dans des égalités exactes.

| Exercice | Contenu |
|---|---|
| 1 | Cinq nombres entendus distincts de 1 à 100 |
| 2 | Cinq additions ou soustractions entendues, résultat entre 0 et 100 |
| 3 | Grille de trente nombres de 0 à 100, cinq nombres à entourer |
| 4–5 | Suites de cinq termes entre 0 et 100, avec puis sans aide |
| 6 | Deux rangements de sept entiers entre 0 et 100 |
| 7–8 | Six comparaisons, deux de chaque signe ; bornes 100 puis 999 |
| 9 | Six signes à compléter : deux additions, deux soustractions et deux égalités |
| 10 | Quatre additions à gauche et quatre soustractions à droite ; progression 2 + 1 chiffres, 2 + 2, 2 + 2, 3 + 3 |
| 11 | Deux additions et deux soustractions à poser ; nombres à deux puis trois chiffres |
| 12–13 | Deux grilles séparées pour reproduire dans le même sens ; puis agrandissement avec deux fois plus de colonnes et de lignes |
| 14 | Trois segments à mesurer ; tableau A, B, C avec cases pour le plus long et le plus court |
| 15 | Quatre points ; AB à relier en rouge et CD en bleu |
| 16 | Deux suites graphiques de la banque de logique |
| 17 | Une question comprenant quatre formes à nommer |
| 18 | Un seul cadre de comptage, sur une colonne pleine, de 195 mm de haut, soit 2,5 fois le maximum habituel de 78 mm |
| 19–20 | Lire puis placer six formes ; questions sur une colonne à gauche du quadrillage |
| 22–24 | Par défaut : Nadia et Julie, le bus Martigny–Sion, puis les perles de Patricia |

Les valeurs changent avec la graine du générateur. En mode libre, les choix et valeurs validés sont conservés. Le sélecteur de problèmes propose **103 contextes** : les trois exemples fournis, 50 additions supplémentaires et 50 soustractions supplémentaires. On peut choisir un autre énoncé, saisir les nombres ou utiliser **Changer les nombres**. Les réponses et les pistes audio sont recalculées à partir des valeurs. Une soustraction négative ou une donnée incompatible signale une erreur au lieu de fabriquer un corrigé.

Le mode libre permet également de choisir explicitement chacune des deux suites graphiques, de modifier les suites numériques, les nombres entendus, la grille, les points, les formes et la figure à reproduire. **Valider les changements** applique ces modifications à l’aperçu et à l’impression. L’icône d’aperçu permet de consulter le corrigé.

L’icône audio télécharge `TCM-CSC_AUDIOS.zip`, contenant trois WAV séparés : nombres de l’exercice 1, calculs de l’exercice 2 et nombres à entourer de l’exercice 3. Chaque piste comprend cinq consignes séparées par six secondes. Les clips sont décodés avant composition ; les MP3 ne sont pas simplement collés. Un échec de chargement est signalé et permet de réessayer. Les mots d’opérateur et leur provenance sont décrits dans [operator-audio.json](operator-audio.json).

Le barème par défaut vaut 79 points et se modifie dans le générateur. Les grilles comprenant plusieurs réponses regroupent leurs points dans un même bloc. Les fiches TCM CFR et TPM gardent leurs types et leurs générateurs.

## Vérification

- [Exemple A4 élèves et corrigés](tcm-csc-exemple.pdf).
- [Résultats navigateur](browser-results.json) : génération depuis le menu, trois WAV réellement décodés, impression, géométrie et sélection en mode libre.
- `tests/interactive/tcm-csc.test.mjs` : 100 graines, bornes et calculs, trois exemples initiaux, 103 contextes, cohérence des coordonnées et des figures, déterminisme et données invalides.

```sh
node --test tests/interactive/tcm-csc.test.mjs
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:tcm-csc:browser
```

La vérification A4 est réalisée dans Chromium ; un essai sur l’imprimante de classe reste nécessaire pour les mesures physiques des segments.
