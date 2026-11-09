# Livraison du jeu en classe — 9 novembre 2026

## Base et intégration

Le prototype `35934ad` est intégré par le merge `50e25528` avec le `main` courant `af544f26`. Les modifications récentes de `main` sont conservées ; aucun remplacement par l’ancien état du prototype.

## Fonctionnalités livrées

- Cartes pastel A–F, lettres et formes de même taille, repères configurables et palette persistée. Grille de trois colonnes et deux rangées également utilisée par le kit papier.
- Minuteur activable et réglable, 30 secondes par défaut, démarrage en réflexion ou après la fin de l’audio ; pause et visibilité de l’onglet prises en compte. Aucune expiration ne change de phase.
- Étapes illustrées, commandes icônes centrées, progression et action principale centrées, bouton précédent retiré. Logo commun et accès direct à la création de fiches.
- Deux QCM maximum pour un même audio, retenus de façon déterministe parmi la sélection. Projection simultanée, un seul lecteur, cartes A–C puis D–F, deux sélections et deux verdicts indépendants. Les réductions de choix sont annoncées et conservent la bonne réponse et des distracteurs source.
- Variantes TCF en images prioritaires même depuis une fiche à écrire ; images conservées au corrigé. Documents à lire ouverts directement avec réglage de taille. Zoom et erreurs explicites pour les images.
- Carte de correction avec bandeau pastel et réponse dessous ; bonne réponse à gauche, statut à droite. Productions ouvertes évaluées par l’enseignant.
- Ancien moteur supprimé du générateur, sans toucher aux banques de jeux imprimables, aux recettes v1 ni aux composants de feuille A4.
- Cahier V4 et documentation actualisés ; instructions d’installation et de démarrage réutilisables dans le README.

## Vérifications

- Installation verrouillée `npm ci` réussie avec cache temporaire autorisé.
- **17 tests unitaires réussis** : conversion, déterminisme, choix et unités, historique, révélations, double sélection audio, images TCF, non-mutation A4 et contraste des teintes par défaut.
- TypeScript et build Vite réussis. Le bundle principal préexistant reste volumineux et produit un avertissement de taille.
- Lint global : **zéro erreur**, 79 avertissements existants. Le Hook conditionnel TCF qui empêchait le contrôle global a été corrigé. Module interactif et tests ciblés sans avertissement.
- Suite classe Chromium : **1366×768, 1920×1080, 1280×800**, toucher simulé, minuteur à horloge contrôlée, documents, images, deux QCM audio, corrections indépendantes et reprise. Téléphone **390×844**, contraste et absence de débordement horizontal.
- Démonstration historique : calcul, géométrie, lecture audio réelle, production orale, pause/reprise, bilan et kit A4.
- A4 témoin : capture identique octet pour octet au main `af544f26`, y compris après chargement du CSS interactif ; recette du brouillon conservée.
- Bibliothèque : API simulée, lien direct, fiche supprimée, erreurs 401/403/404, médias absents et restriction de domaine. Aucune écriture ni manipulation de fiches réelles.

Résultats détaillés dans `classroom-results.json`, `browser-results.json`, `a4-results.json` et `saved-fiches-results.json`. Captures dans `screenshots/`.

## Limites explicites

Ce travail satisfait les demandes de classe ci-dessus et poursuit la cible V4. Il ne constitue pas la livraison de toutes ses fonctions P1/P2. L’inventaire actuel observe **190 variantes convertibles sur 2 081** : 143 QCM, 15 adaptations numériques et 32 activités guidées. Le catalogue et certains rendus de grammaire ont évolué depuis le prototype. Huit erreurs de génération préexistantes restent documentées ; les familles non couvertes affichent leur motif.

Restent notamment les adaptateurs de toutes les familles, associations/classements/grilles, presets et console enseignant, équipes et statistiques de groupe, précontrôle exhaustif des médias et remise à niveau de l’authentification. Les contrôles serveur existants sont conservés mais l’audit de sécurité décrit encore les secrets et accès frontend préexistants à remplacer.

Aucun ENI physique, essai avec élèves ou audit de production n’a été réalisé. Le tactile est simulé dans Chromium. Aucun brouillon d’environnement cloud n’est publié par cette livraison ; les instructions reproductibles sont versionnées dans le dépôt.
