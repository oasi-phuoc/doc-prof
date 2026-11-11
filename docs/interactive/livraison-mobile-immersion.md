# Jeu mobile, immersion et battement entre questions

Demandes du propriétaire : le mode est un poussoir comme le contraste, les mascottes se choisissent en images, le jeu tient dans la hauteur disponible, et le plein écran masque les commandes de navigation.

- **Mode Classe / Solo** : un clic change de mode ; aucun menu. La position enfoncée correspond à Solo. Classe est le défaut d’un nouvel onglet ; le mode est conservé lors d’une reprise dans le même onglet.
- **Mascottes** : six boutons images, trois colonnes et deux rangées ; choix appliqué au clic, panneau fermé automatiquement. Les noms restent accessibles aux lecteurs d’écran. Pas de texte ni de bouton Fermer dans la galerie.
- **Minuteur** : panneau centré et borné à la fenêtre. Réflexion et battement sont réglables séparément ; le battement entre les questions Solo va de 1 à 10 secondes, avec 5 par défaut. Les anciens réglages sans ce champ reprennent la valeur par défaut. Un changement du battement pendant la correction recommence le décompte avec la nouvelle durée.
- **Jeu lancé** : Créer des fiches est réservé à la préparation. La question, les cartes, l’étape, le minuteur et la commande principale sont disposés dans la hauteur mobile disponible. Un document long se lit dans sa propre zone de défilement ; le bilan reste défilable dans la fenêtre.
- **Plein écran** : seul son bouton de sortie reste visible dans la barre ; le lecteur audio, lorsqu’il est nécessaire à la question, est conservé sans être remonté. Si le navigateur intégré ne propose pas l’API plein écran, la même disposition immersive fonctionne dans la fenêtre du navigateur.

Le journal conserve la durée et le temps restant du battement. Les durées de correction de 1 à 10 secondes sont validées à la lecture des sauvegardes ; une durée invalide ne devient pas un passage immédiat.

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium node tests/interactive/mobile-play-browser.mjs
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium node tests/interactive/mobile-browser.mjs
```

`mobile-play-results.json` vérifie 360×640, 390×700 et 430×800, les battements réels de 1 et 10 secondes, les limites du panneau, le masquage des menus, la conservation du même lecteur audio et le repli sans API native. `mobile-results.json` vérifie également la grille de six images, la correspondance des portraits et le retrait des titres doubles. Ces mesures navigateur ne remplacent pas un essai sur le téléphone réel du propriétaire.
