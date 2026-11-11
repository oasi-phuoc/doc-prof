# Acceptation — évolution du jeu en classe

Les résultats machine sont versionnés dans `browser-results.json`, `classroom-results.json`, `a4-results.json` et `saved-fiches-results.json`. Les tests n’utilisent aucune bibliothèque réelle ni donnée élève.

## Demandes de classe

- [x] Six teintes pastel ; lettres et formes noires de même taille ; contraste texte des valeurs par défaut supérieur à 7:1.
- [x] Couleurs et formes configurables, persistées séparément des fiches ; mêmes repères A–F à l’écran et à l’impression ; six cartes carrées en deux colonnes et trois lignes A4.
- [x] Minuteur réglable avant et pendant la séance, 30 secondes par défaut, démarrage en réflexion.
- [x] En Classe avec un audio, attente de la fin de lecture puis décompte ; aucun changement automatique de phase à l’expiration. En Solo, choix ou expiration déclenchent la correction et la suite automatique.
- [x] Pause et onglet masqué suspendent le minuteur et l’audio ; la position de lecture reste conservée.
- [x] Pictogrammes des étapes ; deux actions distinctes au signal ; correction et statut juste/à retravailler séparés.
- [x] Bonne réponse conservée en couleur dans les cartes, autres propositions grises, sans doublon en marge ; les réponses en images restent en images.
- [x] Commandes Passer, Pause et Quitter sous forme d’icônes accessibles centrées ; bouton précédent retiré ; progression et action principale centrées.
- [x] Logo identique au générateur ; bouton Créer des fiches ; icônes contraste, plein écran et fiches ; mentions de prototype retirées.
- [x] Deux questions au maximum par même enregistrement, choix déterministe à partir des questions sélectionnées.
- [x] En Classe, deux QCM audio simultanés, une seule piste au-dessus, trois choix source par question et corrections indépendantes ; aucun choix individuel au tableau. En Solo, un écran par question.
- [x] Conservation systématique de la bonne réponse lorsque des distracteurs source sont retirés ; adaptation expliquée dans la préparation.
- [x] Variantes en images TCF CE/CO reprises même si la forme papier sélectionnée était à écrire.
- [x] Document à lire ouvert directement, taille de texte ajustable et pleine largeur des réponses.
- [x] Écrans de classe vérifiés à 1366×768, 1920×1080 et 1280×800, plus absence de débordement horizontal à 390 px.
- [x] Ancien moteur et anciennes entrées retirés, banques de jeux imprimables conservées.

## Non-régression

- [x] Lancement depuis le générateur, recette et items libres conservés.
- [x] Fiche enregistrée et lien direct : API simulée, sans écriture réelle.
- [x] Aperçu A4 témoin identique octet pour octet au main `af544f26`, après chargement du CSS interactif ; taille 210×297 mm et découpage préservés.
- [x] En Classe, aucune sélection au tableau et correction rendue uniquement sur commande enseignant ; navigation manuelle. En Solo, sélection pendant la réflexion puis correction automatique.
- [x] Reprise après actualisation en réflexion, sans sélection ni corrigé révélés.
- [x] Calculs et aire de carré vérifiés, unités incohérentes rejetées, distracteurs distincts et déterministes.
- [x] Production orale guidée et évaluation humaine, sans score automatique inventé.
- [x] Médias manquants et fiches absentes : erreur compréhensible et séance poursuivable ; cas 401/403/404.
- [x] Bilan Classe limité aux activités, comptages manuels et observations humaines ; bilan Solo fondé sur les réponses réellement données.

## Limites de la livraison

La validation sur un véritable ENI et avec les élèves reste à faire. Les gestes tactiles sont simulés dans Chromium. Les tests de bibliothèque utilisent une API interceptée et ne prouvent pas la sécurité d’une instance de production.

Le cahier V4 reste une cible plus large : adaptateurs de toutes les familles, états conservés par question et nouvelles tentatives, associations/classements/grilles, presets et console enseignant, équipes et statistiques de groupe, limites d’écoutes et remédiation de l’authentification restent à compléter. L’inventaire recalcule la compatibilité exacte du catalogue actuel et expose les formats non couverts.

Le build conserve un avertissement sur la taille du bundle principal existant. Le Hook conditionnel TCF qui bloquait le lint a été corrigé ; les avertissements anciens hors module interactif restent visibles.

## Complément du 10 novembre — médias et Word

- [x] Contrôle des URL uniques, quatre requêtes parallèles, huit secondes, décodage et six statuts distincts.
- [x] Cache, réessai, exclusion explicite et sélection de l’enseignant préservée ; annulation des contrôles devenus inutiles.
- [x] Préchargement du seul écran suivant, sans priorité liée à la bonne réponse.
- [x] Cartes inclinées pastel, badges verticaux à gauche, palette en tableau aligné et formes étendues.
- [x] Menu unique coloré, lecteur audio intégré, icône timer à droite du contraste et quitter à droite des fiches.
- [x] Illustrations rondes originales dans les marges, timer sous réflexion et deux colonnes de questions numérotées.
- [x] Toutes les propositions conservées à la correction ; bonne réponse mise en évidence dans les cartes et autres propositions grises, sans doublon près de la mascotte.
- [x] Entrée pour les phases autorisées lorsque le focus est dans les commandes ; protections de saisie/menu/audio, répétitions automatiques et composition ignorées.

Voir [la livraison médias et Word](livraison-medias-word.md). La limitation historique concernant le précontrôle est levée pour le plan sélectionné ; le hors-ligne et le journal/limites d’écoutes restent ouverts.

## Complément — protections enseignant

- [x] Maintien de 600 ms activable avant la séance, au pointeur et avec Entrée ou Espace ; appuis courts et gestes annulés sans révélation.
- [x] Cadenas qui bloque commandes, réglages et audio, conservé après actualisation ; sortie du plein écran disponible.
- [x] Rétractation pendant dix secondes, sans prolongation au rechargement ; retour à la discussion et aucun double résultat.
- [x] Confirmations avant passage sans correction et fin anticipée ; Annuler et Échap sans changement de question, focus restitué.
- [x] Confirmation explicite pour les deux questions d’un écran audio ; fin anticipée conservant les résultats et marquant les autres activités passées.
- [x] Lecture des séances de schéma 1 ou 2 et nouvelles écritures de schéma 3 ; compactage et purge vérifiés.
- [x] Mode Solo automatique conservé ; commandes et cartes dans l’écran à 360 × 640, 390 × 700 et 1366 × 768.

Voir [les résultats](teacher-protections-results.json), [la livraison](livraison-protections-enseignant.md) et le [guide enseignant actualisé](guide-enseignant.md).
