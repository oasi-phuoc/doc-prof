# Mascottes du jeu collectif

Les fichiers `leaf-mascot.webp`, `owl-mascot.webp`, `octopus-mascot.webp`, `hedgehog-mascot.webp`, `rabbit-mascot.webp` et `dragon-mascot.webp` sont des illustrations originales générées pour ClairFLE. Le dragon reprend le modèle asiatique choisi par le propriétaire.

Chaque planche contient six poses sur une grille de trois colonnes et deux rangées : réflexion, vote, discussion ; joie, tristesse, pause. `Mascot.tsx` et `projection.css` sélectionnent la pose et lui donnent un mouvement adapté. `ResultFeedback.tsx` ajoute les confettis et les larmes.

Sur demande du propriétaire, ces mouvements restent actifs avec le réglage système de réduction des animations. Les quatre anciens portraits WebP sont conservés pour la compatibilité des anciennes versions et ne sont plus utilisés par le moteur actuel.
