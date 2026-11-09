# Acceptation — évolution du jeu en classe

Les résultats machine sont versionnés dans `browser-results.json`, `classroom-results.json`, `a4-results.json` et `saved-fiches-results.json`. Les tests n’utilisent aucune bibliothèque réelle ni donnée élève.

## Demandes de classe

- [x] Six teintes pastel ; lettres et formes noires de même taille ; contraste texte des valeurs par défaut supérieur à 7:1.
- [x] Couleurs et formes configurables, persistées séparément des fiches ; grille A–B–C / D–E–F identique à l’écran et aux cartes imprimées.
- [x] Minuteur réglable avant et pendant la séance, 30 secondes par défaut, démarrage en réflexion.
- [x] Avec un audio, attente de la fin de lecture puis décompte ; aucun changement automatique de phase à l’expiration.
- [x] Pause et onglet masqué suspendent le minuteur et l’audio ; la position de lecture reste conservée.
- [x] Pictogrammes des étapes ; deux actions distinctes au signal ; correction et statut juste/à retravailler séparés.
- [x] Bonne réponse à gauche dans une carte à bandeau coloré, statut à droite ; les réponses en images restent en images.
- [x] Commandes Passer, Pause et Quitter sous forme d’icônes accessibles centrées ; bouton précédent retiré ; progression et action principale centrées.
- [x] Logo identique au générateur ; bouton Créer des fiches ; icônes contraste, plein écran et fiches ; mentions de prototype retirées.
- [x] Deux questions au maximum par même enregistrement, choix déterministe à partir des questions sélectionnées.
- [x] Deux QCM audio simultanés, une seule piste au-dessus, trois choix source par question, sélections et corrections indépendantes.
- [x] Conservation systématique de la bonne réponse lorsque des distracteurs source sont retirés ; adaptation expliquée dans la préparation.
- [x] Variantes en images TCF CE/CO reprises même si la forme papier sélectionnée était à écrire.
- [x] Document à lire ouvert directement, taille de texte ajustable et pleine largeur des réponses.
- [x] Écrans de classe vérifiés à 1366×768, 1920×1080 et 1280×800, plus absence de débordement horizontal à 390 px.
- [x] Ancien moteur et anciennes entrées retirés, banques de jeux imprimables conservées.

## Non-régression

- [x] Lancement depuis le générateur, recette et items libres conservés.
- [x] Fiche enregistrée et lien direct : API simulée, sans écriture réelle.
- [x] Aperçu A4 témoin identique octet pour octet au main `af544f26`, après chargement du CSS interactif ; taille 210×297 mm et découpage préservés.
- [x] Choix bloqués avant le signal ; correction rendue uniquement sur commande enseignant ; navigation manuelle.
- [x] Reprise après actualisation en réflexion, sans sélection ni corrigé révélés.
- [x] Calculs et aire de carré vérifiés, unités incohérentes rejetées, distracteurs distincts et déterministes.
- [x] Production orale guidée et évaluation humaine, sans score automatique inventé.
- [x] Médias manquants et fiches absentes : erreur compréhensible et séance poursuivable ; cas 401/403/404.
- [x] Bilan limité aux réponses au tableau et observations humaines.

## Limites de la livraison

La validation sur un véritable ENI et avec les élèves reste à faire. Les gestes tactiles sont simulés dans Chromium. Les tests de bibliothèque utilisent une API interceptée et ne prouvent pas la sécurité d’une instance de production.

Le cahier V4 reste une cible plus large : adaptateurs de toutes les familles, associations/classements/grilles, presets et console enseignant, équipes et statistiques de groupe, précontrôle complet des médias et remédiation de l’authentification ne sont pas annoncés terminés. L’inventaire recalcule la compatibilité exacte du catalogue actuel et expose les formats non couverts.

Le build conserve un avertissement sur la taille du bundle principal existant. Le Hook conditionnel TCF qui bloquait le lint a été corrigé ; les avertissements anciens hors module interactif restent visibles.
