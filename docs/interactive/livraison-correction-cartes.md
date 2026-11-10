# Correction directement dans les cartes

Après révélation en Classe ou correction automatique en Solo, la bonne carte garde sa couleur configurée, avec une bordure et une coche. Les autres cartes deviennent grises, y compris leurs images et repères. En Solo, le mauvais choix sélectionné garde sa croix. L’ordre et le contenu des propositions sont conservés.

Le bloc « Bonne réponse » dans la marge, près de la mascotte sur mobile, a été retiré. Les productions ouvertes conservent leur modèle et leur appréciation humaine. Avant la révélation, aucune carte ne porte de style ou de libellé indiquant la bonne réponse.

Une question à six choix donne une carte en couleur et cinq grises. Deux questions audio appariées gardent chacune leur bonne réponse en couleur, soit deux cartes en couleur et quatre grises.

Vérifications : `tests/interactive/card-feedback-browser.mjs`, suites Classe, Solo et disposition mobile. Les tests couvrent les réponses textuelles et illustrées, les deux modes et une palette sombre personnalisée. Voir [résultats](card-feedback-results.json), [mobile](screenshots/card-feedback-390.png) et [ordinateur](screenshots/card-feedback-1366.png).
