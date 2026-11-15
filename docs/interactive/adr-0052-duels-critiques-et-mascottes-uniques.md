# ADR 0052 — Mascottes uniques et trois niveaux de dégâts

Ce lot applique la demande du propriétaire du 15 novembre aux duels locaux, à deux ou par équipes. Il remplace les règles de critique et de temps écoulé décrites dans les ADR 0043 et 0046.

## Choix des mascottes et tirage

Une mascotte validée est retirée des choix des deux camps. En équipes, la réservation a lieu avec **Ajouter à l’équipe** ; une simple présélection ne réserve rien. Retirer le joueur libère la mascotte. En duel à deux, le choix direct réserve l’identité pour ce joueur ; l’autre liste l’exclut. La validation du moteur refuse aussi les doublons, y compris entre équipes. Les trente mascottes permettent quinze joueurs par équipe au maximum.

Le tirage initial mélange indépendamment les membres des deux côtés. **Randomiser les matchs** renouvelle l’ordre de préparation. **Randomiser les matchs restants** est disponible entre deux duels lorsqu’au moins deux rencontres restent à jouer. Il conserve les résultats, les membres ayant déjà joué et le nombre de participations ; le nouvel ordre des rencontres restantes change effectivement. La graine et l’action datée permettent de retrouver cet ordre à la reprise.

## Dégâts et expiration

Un seul tirage avant les réponses détermine le niveau de la question :

| Niveau | Probabilité | Bonne réponse | Erreur |
|---|---|---|---|
| Normal | 65 % | −10 % à l’adversaire | −10 % à soi |
| Critique ×2 | 25 % | −20 % à l’adversaire | −20 % à soi |
| Super critique ×3 | 10 % | −30 % à l’adversaire | −30 % à soi |

Les trois catégories sont exclusives. Le premier clic valide le tour ; un clic ancien, une seconde réponse ou un champ de dégâts fourni par une action ne peut ajouter un coup. Le score n’est pas multiplié par le nombre d’effets visuels.

Si personne ne répond avant la fin du minuteur, les deux joueurs perdent **10 %**, quel que soit le critique annoncé. Deux réactions locales indiquent la perte de vie, sans attaque adverse. Un KO asymétrique donne la victoire au survivant ; deux vies à zéro donnent un match nul, sans victoire attribuée. Le tournoi appelle ensuite le binôme suivant. Sans minuteur, aucune expiration n’est ajoutée.

## Arène et animations

Les personnages sont centrés dans leur zone, à l’extérieur du cadre coloré des réponses. Ils mesurent 276 px sur ordinateur et 144 px sur téléphone, soit trois fois les dimensions précédentes ; la barre de vie est dessous. Les deux zones restent côte à côte sur téléphone pour conserver les cartes et commandes dans l’écran. Les mentions d’équipe et de victoires sont retirées du combat et de l’appel du binôme ; le bilan final par équipes conserve ses résultats. Les petits écrans en paysage adaptent la taille disponible.

Chaque attaque conserve la signature de la mascotte. Une variation reproductible par question et par coup change la hauteur de départ, le point touché dans la mascotte et la courbe, vers le haut ou le bas. Le sens suit toujours l’attaquant réel. Le critique ×2 garde ses trois à cinq coups lumineux ; le ×3 combine sept à neuf coups, une charge, une nova orbitale et trois anneaux d’impact. Une erreur ×3 fait tomber neuf objets sur son auteur avec une nova locale et une réaction renforcée. Tous les effets terminent dans le battement minimal d’une seconde, sans arme et avec les animations maintenues.

## Reprise

Les nouveaux journaux de duel utilisent la version 2 : les vies, résultats et critiques sont recalculés depuis les actions. Les anciens journaux version 1 restent conservés, mais ne sont pas rejoués avec des probabilités et pénalités différentes ; l’interface signale que la reprise est indisponible et propose une nouvelle partie. Les réglages historiques d’effets restent strictement vérifiés lorsqu’ils sont présents dans une configuration acceptée ; ils ne remplacent pas la signature de la mascotte.

Les [preuves du duel](duel-results.json), celles des [mascottes et attaques](mascots-effects-results.json) et le [relevé qualité](quality-duel-v2-results.json) consignent les contrôles réellement exécutés. Le jeu reste un duel sur écran commun après préparation des médias ; ce lot ne change pas les salles Internet.
