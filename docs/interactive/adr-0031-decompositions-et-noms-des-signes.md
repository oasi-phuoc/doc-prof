# ADR 0031 — Décompositions et noms des signes CSC

Le jeu reprend les décompositions en valeurs de position de cinq types : `nombres-decompose`, `tpm-decompose-99`, `tpm-decompose-9999`, `tcm-cfr-ex05` et le nouvel exercice `tcm-csc-ex08`. Une question correspond à chaque case de la fiche, des milliers aux unités suivant la longueur du nombre. Le nombre et la position restent dans la question ; le résultat attendu est la valeur complète du terme, par exemple 4 000 pour les milliers de 4 070. Une position nulle donne bien une réponse 0.

Avant conversion, l’adaptateur vérifie un entier de deux à quatre chiffres, l’ordre exact des libellés français, chaque terme et l’addition du corrigé. Il refuse les chiffres seuls à la place des valeurs, les termes déplacés même si leur somme reste juste, les libellés contradictoires et les décompositions décimales. Il conserve les identifiants source et un index `part` par case. Les six choix numériques utilisent les distracteurs déterministes existants et sont classés `assisted`. Les cases des autres positions ne sont pas résolues dans la question publique.

Le nouvel exercice CSC 9 conserve le signe affiché et propose les trois noms vérifiés « plus », « moins » et « égal ». Le signe, son texte source et son corrigé doivent correspondre au lexique fermé `CSC_SIGN_NAMES` ; une édition incohérente est signalée. Ce classement utilise les trois cartes et un verdict automatique. Les anciennes égalités CSC enregistrées avec des signes à compléter restent prises en charge.

Les nouvelles questions réutilisent le plan, le tri numérique, les plafonds de cartes, la sélection, les graines, les instantanés et la compétition. Aucun format de sauvegarde supplémentaire n’est créé. Une nouvelle partie renouvelle les nombres des modèles générés sans modifier le modèle serveur. Une reprise conserve les questions courantes et la correction. Le mode Classe reste collectif ; le Solo corrige puis poursuit automatiquement. Le défi local fonctionne sur un appareil après préparation, y compris après coupure du réseau.

Huit tests couvrent 1 500 configurations de décomposition (cinq types, trois niveaux, cent graines), cent graines de noms de signes, les zéros, incohérences, cartes, nouvelles parties, fiches imprimées inchangées, reprise et transport en compétition. Le [parcours navigateur](place-value-results.json) vérifie les trois tailles d’écran, les corrections, une reprise sur la réponse 0, le Solo automatique et la compétition locale. La [qualité du lot](quality-place-value-results.json) consigne les autres vérifications et leurs limites.

```sh
node --test tests/interactive/place-value.test.mjs
npm run test:interactive:place-value
```
