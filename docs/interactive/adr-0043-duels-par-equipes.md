# ADR 0043 — Duels avec vies et tournoi par équipes

La demande du propriétaire ajoute deux choix au trophée Compétition : **Duel à deux** et **Duels par équipes**, sur un écran commun. Chaque joueur choisit une mascotte existante, identifiée par un numéro automatique. Aucun nom ou pseudo n’est demandé.

## Règles

Chaque duel commence à 100 % de vie. Le premier clic valide la question : une bonne réponse retire 10 % à l’adversaire, une mauvaise réponse retire 10 % à son auteur. Une question critique retire 20 % dans les deux cas. La probabilité retenue est de 25 %, annoncée dans la préparation ; le critique est tiré pour la question avant les réponses et signalé aux deux joueurs. Un double clic ou une réponse ancienne ne peut pas appliquer un second coup. À 0 %, le joueur perd et une seule victoire est comptée.

La correction garde la bonne carte en couleur et grise les autres. La préparation propose désormais dix attaques et dix effets d’erreur (ADR 0045). Un coup juste va de la mascotte qui répond à son adversaire ; un critique double le coup. Une erreur fait tomber des objets sur son auteur, avec une réaction plus forte en critique. Aucune arme n’est représentée. Les animations restent actives selon la demande du propriétaire. Le battement de correction est réglable de 1 à 10 secondes, puis la question suivante arrive automatiquement. Le minuteur de réponse peut être désactivé ; un temps écoulé sans clic n’inflige aucun dégât.

La série sélectionnée est mélangée et parcourue par cycles jusqu’à ce qu’une vie tombe à zéro. Cela permet de jouer avec une fiche courte. Les questions manuscrites gardent leur contenu ; ce mécanisme ne fabrique pas de nouveaux opérandes pendant le combat. **Nouvelle partie** revient à la préparation de compétition avec une nouvelle graine de fiche, la même sélection et les mêmes paramètres de génération. Les recettes générées renouvellent leurs questions ; l’ancien journal est conservé séparément.

## Tirage des équipes

Le propriétaire a choisi le **tirage au sort au début**. Les équipes ont le même nombre de membres, de 1 à 30 par côté. Les deux listes sont mélangées avec une graine propre à la partie, puis associées une seule fois. L’ordre est visible avant le départ, conservé pendant le tournoi et reconstitué à la reprise. Chaque membre joue un duel.

Après une victoire et son battement de correction, le prochain binôme est appelé avec 100 % de vie chacun. Le bouton de départ laisse le temps aux deux élèves d’arriver. L’équipe ayant remporté le plus de duels gagne ; une égalité est annoncée sans départage inventé. Arrêter une partie compte seulement les duels achevés.

## Reprise et écran commun

Le journal de l’onglet conserve la graine, les mascottes, les réglages et les actions datées pendant 24 heures au maximum. Les vies, critiques et victoires sont recalculés contre le quiz source ; ni les questions, ni les clés, ni un état de score fourni par le journal ne sont acceptés. Une empreinte SHA-256 lie la reprise au quiz préparé avant le remplacement des médias par leurs adresses temporaires. Une sauvegarde incompatible est préservée et propose une nouvelle partie explicite.

Quitter ou masquer la page met le duel en pause. Les raccourcis sont A–F pour le côté gauche et 1–6 pour le côté droit ; les cartes restent des boutons tactiles. Sur mobile, les zones sont superposées. Le plein écran conserve uniquement son bouton de sortie dans l’en-tête.

Les médias et mascottes sont préparés avant de jouer. La page ouverte peut ensuite continuer sans réseau. Le démarrage et le rechargement entièrement hors ligne, les appareils séparés et le duel synchronisé dans les salles Internet ne sont pas couverts par cette extension locale.

## Vérifications

Dix tests de domaine couvrent les dégâts normaux et critiques, le premier clic, les anciennes réponses, la pause, le temps écoulé, le KO unique, le tirage fixe, l’appel suivant, les égalités et la reprise sans état de score accepté. `duel-browser.mjs` vérifie les deux joueurs, les animations et le plein écran sur trois tailles d’écran, une reprise après retour à la fiche, puis deux duels d’équipes avec le réseau coupé et les phrases Gattegno. Voir `duel-results.json` et le relevé qualité du lot.
