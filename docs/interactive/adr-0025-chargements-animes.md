# ADR 0025 — Écrans de chargement ClairFLE

Les textes isolés « Chargement… » sont remplacés par un écran centré avec le logo ClairFLE, un anneau et des points animés, une barre indéterminée et un message correspondant à la destination. Le créateur, la bibliothèque, le jeu, les cartes, le diagnostic et la compétition partagent ce composant. Le chargement des données ou d’une séance utilise une variante en panneau ; les changements de mode et les audios utilisent un indicateur compact.

Le HTML initial contient déjà le visuel et sa feuille de style critique. Il s’affiche avant JavaScript, sans média ni banque de fiches à charger pour dessiner le logo. Vite regroupe la feuille dans le CSS de l’entrée ; les budgets par route restent contrôlés.

L’animation accompagne seulement une attente réelle. Une page disponible s’ouvre immédiatement, sans délai artificiel. Une erreur de données conserve les messages et le bouton de nouvelle tentative existants. Un retour arrière quitte l’écran ; une réponse tardive ne rouvre pas la destination abandonnée.

Le statut est annoncé poliment aux lecteurs d’écran, le décor reste masqué et aucun pourcentage fictif n’est annoncé. Les mouvements utilisent `transform` et `opacity`. Les éléments animés suivent le choix du propriétaire de conserver les animations, y compris avec la préférence système de réduction des mouvements. Le chargement est masqué à l’impression.

Le [parcours navigateur](loading-results.json) retient volontairement les vrais modules et requêtes pour vérifier le démarrage avant JavaScript, les six destinations, l’attente de bibliothèque, l’échec avec nouvelle tentative et un retour arrière pendant le chargement. Les vues de 390 × 844 et 1 366 × 768 restent centrées, sans débordement horizontal ; axe ne détecte pas de violation sur les écrans vérifiés.

- [Démarrage sur téléphone](screenshots/loading-start-390.png).
- [Ouverture du jeu sur téléphone](screenshots/loading-game-390.png).
- [Ouverture du jeu sur ordinateur](screenshots/loading-game-1366.png).

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:interactive:loading
```
