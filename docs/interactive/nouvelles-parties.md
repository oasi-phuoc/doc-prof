# Nouvelles parties et reprises

La fiche enregistrée sur le serveur reste un modèle : ses pages, types d’exercice, limites numériques, nombre de questions, consignes, médias et questions rédigées ne sont pas modifiés par le jeu. Le client charge ce modèle avec l’API existante en lecture seule.

À la première ouverture d’une fiche enregistrée, puis à chaque « Nouvelle partie », l’interface tire une graine pour la partie avec `crypto.getRandomValues`. Les générateurs existants renouvellent les exercices dans les limites du modèle. Dix additions entre 1 et 10 restent dix additions entre 1 et 10 ; certaines additions peuvent naturellement se retrouver d’une série à l’autre. Les questions et documents saisis manuellement restent fixes. Aucun contenu rédactionnel supplémentaire n’est inventé.

« Reprendre la séance » conserve la graine de la partie et son journal IndexedDB. La graine et les positions sélectionnées sont mémorisées dans le stockage de session de l’onglet ; un rechargement conserve donc exactement la même série. « Nouvelle partie » depuis la préparation ou le bilan renouvelle la graine. « Terminer » prépare une nouvelle série pour le prochain lancement. La reprise des seules questions difficiles garde les questions à revoir.

Les réglages du minuteur sont indépendants du tirage. Le compte à rebours est facultatif, en Classe comme en Solo. Sans minuteur en Solo, le choix déclenche la correction ; pour une production ouverte, « Voir le modèle » permet de terminer la réflexion. Le battement automatique après correction reste réglable de 1 à 10 secondes.

Validation : tests de domaine `game-run.test.mjs`, parcours de fiche serveur simulée `game-run-browser.mjs` (aucune écriture serveur), et `untimed-browser.mjs` pour le Solo sans limite et l’absence de réponse répétée sous les cartes.
