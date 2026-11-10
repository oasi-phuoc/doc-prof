# Question mobile et cartes carrées

Sur mobile, la question est présentée en premier dans un cadre contrasté, en gras et avec une taille de 28 à 34 px pour une question seule. Les questions audio appariées gardent leur retrait de numérotation et utilisent 22 à 28 px. Les cartes occupent l’espace disponible, puis la mascotte et le minuteur sont centrés dessous.

Les illustrations d’étape ont une taille doublée par rapport au précédent gabarit mobile (72 à 108 px). Les portraits de correction passent de 52 à 104 px. Les légendes visibles « Je réfléchis », etc., sont retirées ; le nom accessible de l’étape reste présent. La pause utilise également une mascotte agrandie. Les animations restent actives selon la demande du propriétaire.

Une expiration en Solo affiche « Temps écoulé ». La règle de correction reste identique : sans sélection avant l’expiration, la réponse est fausse. Le compte à rebours demeure facultatif et le battement entre les questions conserve son réglage de 1 à 10 secondes.

La planche imprimable contient six carrés de 88 × 88 mm, disposés sur deux colonnes et trois lignes, avec une gouttière de 5 mm, sur une page A4 portrait. Les lettres, couleurs et formes correspondent toujours à la palette choisie. Deux jeux produisent exactement deux pages. Le mode économie d’encre est conservé. Aucun style des fiches générées n’est modifié.

Validation : `mobile-layout-print-browser.mjs` vérifie l’ordre des éléments, les tailles réelles, la question en gras, l’absence de légende visible, le message d’expiration, les limites du viewport et le PDF A4. `mobile-browser.mjs` vérifie également la numérotation sur plusieurs lignes. `mobile-play-browser.mjs` couvre les minuteurs et l’immersion. Résultats : `mobile-layout-print-results.json`. Planche : [cartes carrées A4](screenshots/cartes-classe-a4.pdf).
