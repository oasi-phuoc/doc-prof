# ADR 0053 — Jeu épuré et paysage sur téléphone

Demandes du propriétaire du 15 novembre 2026, après l’ADR 0052. Les barres de vie sont désormais verticales, à l’extérieur des deux mascottes, avec leur valeur numérique à l’intérieur et sans symbole pour cent. Les compteurs de duel/question, l’aide au premier clic et la pastille de dégâts normale disparaissent. Le minuteur est centré entre Pause et Arrêter. Les calculs complets perdent seulement le suffixe de présentation « = ? » ; la source et son corrigé restent intacts.

Classe, Solo et compétition regroupent leurs réglages dans **Options du jeu** pendant la partie. Le plein écran conserve toujours une sortie visible. La préparation et les bilans gardent leurs commandes. Pause reste disponible en Solo ; en Classe, elle est accessible dans les options, pour préserver les commandes de correction sur les petits écrans.

Le démarrage et la reprise d’un duel sur téléphone demandent le paysage lorsque les API du navigateur le permettent. Le minuteur attend la rotation. En cas de refus ou d’absence de cette API, une invitation propose la rotation manuelle ou la poursuite en portrait. La sortie libère uniquement le plein écran et le verrou acquis par ce parcours. Les tests Chromium avec API contrôlée ne constituent pas une validation sur Android ou iOS physique.

Deux nouvelles planches originales ajoutent une expression énervée aux trente personnages, sans modifier les indices de leurs six poses historiques. Le niveau ×2 porte une aura énergétique ; le ×3 une aura plus ample et l’expression énervée. Ces premières auras sont une étape intermédiaire : le cahier d’animations reçu ensuite demande leur remplacement par soixante compositions propres aux mascottes.

Validation : 426 tests unitaires, compilation et lint ; parcours natifs paysage, Classe/Solo avec glisser-déposer, duels, trente mascottes dans les deux directions, compétition locale/Internet et console enseignant, dont les petits écrans 390 et 360 px. Voir `duel-landscape-results.json`. Les images de preuve du paysage sont nouvelles ; les captures historiques des autres parcours ne sont pas remplacées par des captures prises à une autre phase d’animation.
