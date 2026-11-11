# Précontrôle des médias et ajustements Word — 10 novembre 2026

Base : `726a9ec5`, avec les quatre nouveaux commits TCF de main intégrés avant développement. Les réglages de classe, recettes v1, banques et feuilles A4 restent conservés.

## Préparer les médias (F29)

La préparation vérifie les médias du plan réellement retenu : chaque URL est contrôlée une seule fois, avec quatre contrôles parallèles et un délai global de huit secondes par média. Un GET partiel précède le décodage de l’image ou la lecture des métadonnées audio. Un serveur qui refuse la requête partielle est essayé par GET normal.

Les statuts sont distincts : disponible, lent, absent (404/410), bloqué, invalide et délai dépassé. Un fichier HTML renvoyé à la place d’une image est refusé ; les fichiers volumineux sont signalés. Les questions aux médias absents, bloqués ou invalides sont écartées par défaut du lancement, en conservant les cases cochées par l’enseignant. Un réessai rétablit automatiquement les questions dont le média est réparé. Les lenteurs et délais dépassés ne retirent pas une question en silence.

Le cache par URL dure cinq minutes, avec réessai explicite. Un changement de sélection annule les contrôles devenus inutiles ; leurs résultats tardifs ne peuvent pas modifier le nouveau plan. Les URL partagées conservent la liste exacte des questions concernées. Pendant le jeu, seul l’écran suivant est préchargé ; toutes ses réponses sont traitées de la même manière, sans consulter les corrigés.

Origines : même origine par défaut, liste blanche explicite pour une éventuelle banque distante, `blob:` de l’origine courante et images/audios `data:` de deux Mio maximum. Les autres schémas et redirections sont bloqués. Les limites portent sur les octets réels, y compris le texte Unicode encodé. La politique s’applique aussi au rendu si l’enseignant choisit de conserver une question en échec.

Les restrictions CSP/CORS ou une coupure réseau peuvent produire le même échec d’accès : le rapport ne prétend pas distinguer leur cause. Un contrôle positif n’est pas une garantie de disponibilité pendant toute la séance. Le préchargement intégral, le mode hors ligne, le journal des écoutes et les limites d’écoutes du §62.3 restent des travaux distincts.

## Toutes les demandes du Word

- Accueil : les cartes retrouvent leur disposition inclinée en gardant les teintes pastel.
- Repères : lettre en haut, symbole en bas ; le bloc est placé à gauche de chaque réponse.
- Palette : tableau de deux rangées et trois colonnes, contrôles alignés ; choix étendu au pentagone, cœur, hexagone, ovale et lune, avec six formes distinctes.
- Menu unique en haut : créer des fiches, progression, passer/pause, lecteur audio, contraste, réglage du minuteur, plein écran, mes fiches, quitter. Les boutons du menu sont colorés ; le bouton de création reprend le dégradé et le texte blanc de « Jouer avec la classe ».
- Audio : lecteur arrondi teinté dans le menu, sans texte « Écouter le document » ni cadre extérieur rempli.
- Phases : quatre illustrations originales dans le style des scènes TCF, affichées dans des cercles blancs. Réflexion, carte levée et discussion à gauche ; choix au tableau à droite pendant le vote.
- Minuteur sous l’image de réflexion ; textes d’état et bouton de réinitialisation retirés. Le réglage se fait par une icône du menu à droite du contraste.
- Deux questions : deux colonnes, numéros locaux 1 et 2 en gras et couleur, puis trois réponses empilées sous chaque énoncé.
- Correction : toutes les réponses restent visibles. Le choix sélectionné porte le signe juste/faux ; si faux, la bonne réponse est dans la marge gauche et le signe faux dans la marge droite. Les résultats sont numérotés séparément quand les deux questions ont des verdicts différents.
- Entrée sur le clavier : avance les phases autorisées, y compris après le choix au tableau, sans sauter une sélection manquante. Les saisies, menus, réglages et commandes audio conservent leur usage normal ; maintien de touche et composition sont ignorés. La révélation reste une action volontaire de l’enseignant.

Les quatre WebP de production représentent environ 620 Ko. Les PNG de génération ne sont pas ajoutés à l’application. Les images et les repères ne sont pas copiés d’une source externe.

## Vérification

- 31 tests unitaires : moteur, conversion, contraste, progression enseignant, filtrage sans substitution, politique d’URL, six statuts, délai/annulation, repli HTTP, cache et parallélisme.
- Chromium : disposition et rituel aux trois résolutions 1366×768, 1920×1080 et 1280×800 ; téléphone 390×844 ; toucher simulé, timer, images, deux verdicts, raccourci Entrée et protections de saisie/menu.
- Précontrôle dans un navigateur : fichier partagé absent, réessai après réparation, cache entre sélections, annulation lors du retrait de questions, faux format HTML et origine non admise ; aucune requête envoyée à cette origine.
- Bibliothèque et liens directs avec API simulée ; erreurs d’accès et médias absents ; aucune écriture réelle.
- A4 témoin : capture identique octet pour octet à main `726a9ec5`, recette du brouillon et dimensions fixes conservées.
- TypeScript et build réussis ; lint sans erreur, avec 79 avertissements anciens. Le poids du bundle principal reste signalé par Vite.

Résultats versionnés : `classroom-results.json`, `media-results.json`, `saved-fiches-results.json`, `a4-results.json`. Captures : `screenshots/09-reading-1366.png`, `11-paired-audio-1366.png`, `12-paired-correction-1366.png` et `13-media-missing.png`.

Cette livraison poursuit le cahier V4. Les autres P0/P1/P2, l’authentification serveur, les familles encore non adaptées et l’essai sur un véritable ENI ne sont pas annoncés terminés.
