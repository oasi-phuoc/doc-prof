# Mascottes visibles sous la question

La réduction est renforcée dans les duels à deux et par équipes : plafond de 160 px, dimensions adaptées à la hauteur disponible et largeur réduite sur téléphone. Des réserves au-dessus **et au-dessous** de chaque personnage accueillent les auras et les mouvements de réaction, avant les cartes de réponse. Les barres de vie gardent une hauteur lisible.

Les deux personnages se font face dans les états normaux, critiques, fatigués, de charge, de tir et de fin de duel. Le personnage de droite est retourné vers son adversaire. L’orientation s’applique à l’image dans un conteneur distinct des animations ; les numéros et les barres de vie restent à l’endroit. Les mini-mascottes reçoivent maintenant la même information de côté que les adultes.

Sur les écrans courts en paysage, les deux commandes discrètes occupent les coins et libèrent leur ancienne rangée pour le combat. La bande de question garde une limite de hauteur pour laisser apparaître les personnages et les douze cartes. Les questions longues restent accessibles par défilement dans cette bande. Les animations restent actives, y compris avec la préférence système de réduction des mouvements.

Le [parcours dédié](../../tests/interactive/duel-clearance-browser.mjs) contrôle les formes mini et adulte, les critiques ×3/×4, une question sur plusieurs lignes et la réaction après une erreur. Il échantillonne 22 instants des animations, vérifie au moins 20 px entre l’aura et chaque bande voisine et garde les réponses dans l’écran avec des cibles d’au moins 44 px. L’orientation est vérifiée aussi pour les trente mascottes et les différents états dans les tests de composants.

Les [mesures](duel-clearance-results.json) et [captures](duel-clearance-proofs/index.html) couvrent les fenêtres Chromium 1 366 × 768, 1 024 × 600, 390 × 844 et 640 × 360. Elles ne remplacent pas un essai sur le téléphone ou le tableau de la classe.
