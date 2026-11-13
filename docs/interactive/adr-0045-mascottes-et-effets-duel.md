# ADR 0045 — Trente mascottes communes et effets dirigés du duel

Les choix d’effets décrits ici sont remplacés par les [attaques automatiques propres aux mascottes](adr-0046-attaques-des-mascottes.md), selon la demande suivante du propriétaire. Les preuves de ce jalon restent conservées.

La demande du propriétaire porte le choix à **30 mascottes** au total. Les six existantes sont conservées, et 24 nouvelles illustrations originales ont été générées avec six poses chacune : réflexion, carte levée, discussion, réussite, larmes et pause. Les dix animaux manquants du zodiaque japonais complètent le Lapin et le Dragon ; quatorze autres animaux complètent la collection. Voir `mascots-generation.json` pour les quatre planches, leurs lignes et leurs empreintes.

## Une collection dans tous les modes

Classe, Solo, duel, tournoi et salles de compétition utilisent le même registre et les mêmes six poses animées. La sélection affiche les images et les noms accessibles, sans texte libre. Le menu Classe reste en trois colonnes et défile pour atteindre les trente choix. Les anciennes préférences et les douze identifiants historiques de compétition restent valides.

Les six anciennes textures et les quatre nouvelles planches sont préchargées pour les modes sans réseau après préparation. Les coordonnées de chaque pose sont explicites ; les 180 cellules sont distinctes. La compétition utilise aussi les poses de réussite et de larmes, au lieu d’une autre collection de portraits. Les animations restent actives selon la préférence exprimée par le propriétaire.

## Dix attaques et dix effets d’erreur à essayer

La préparation d’un duel propose dix choix d’attaque : Croissant, Double entaille, Tourbillon, Feuilles, Pétales, Vague, Spirale, Griffes, Coup de vent et Onde de choc. Des aperçus permettent de jouer l’effet du joueur 1 ou du joueur 2, et de prévisualiser un critique. Le rendu utilise des formes courbes ou des particules, sans arme ni trait rectiligne lumineux traversant l’écran.

Un coup correct part de la mascotte qui a répondu vers l’adversaire. Les positions réelles des portraits déterminent la direction : gauche / droite sur grand écran, haut / bas sur téléphone en portrait. Un critique produit deux coups et la réaction renforcée prévue dans le duel.

Les dix propositions ont aussi des mouvements distincts : balayage en arc, arcs croisés, rotation rapide, feuilles oscillantes, danse de pétales, vague montante, trajet en vrille, marques de griffes soudaines, élan avec recul et impulsions grandissantes. Leurs trajectoires suivent la disposition des joueurs ; les courbes rentrent vers l’écran sur téléphone. Le critique rejoue le coup et son éclat d’impact avec un décalage de 160 ms.

Une mauvaise réponse déclenche exclusivement un effet local sur son auteur. Les dix propositions sont Cailloux, Seau d’eau, Livres, Coussins, Pommes, Pommes de pin, Flocons, Plumes, Bulles et Petit nuage. Le critique augmente le nombre d’objets et la réaction ; aucune attaque n’est attribuée à l’adversaire. Un temps écoulé sans réponse reste sans dégât ni effet d’impact.

Les deux identifiants d’effets choisis sont conservés dans la configuration du journal local. Les journaux antérieurs sans ces champs restent lisibles et utilisent Croissant / Cailloux. Les règles de vie, les critiques, les victoires et le tirage initial des binômes restent calculés par le même moteur ; la prévisualisation ne modifie aucun score.

## Vérifications

Les tests de domaine couvrent les trente identités, les 180 cellules, les dix textures, les vingt presets, les directions, la séparation attaque / erreur, la validation et la reprise des anciens et nouveaux journaux. Les parcours `mascot-browser`, `mascots-effects-browser` et `duel-browser` vérifient les mouvements, les choix et les effets sur mobile et ordinateur, avec la préférence système de réduction des mouvements et le jeu local après coupure réseau. Voir `mascots-effects-results.json` et le relevé qualité pour les vérifications exécutées.
