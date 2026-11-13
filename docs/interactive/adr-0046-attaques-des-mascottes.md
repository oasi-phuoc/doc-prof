# ADR 0046 — Une attaque automatique par mascotte

La demande du propriétaire remplace le sélecteur de dix coups : chaque mascotte doit avoir sa propre attaque. Le choix de mascotte détermine désormais l’effet, sa couleur, son mouvement, son amplitude et son rythme. La carpe koï envoie un **jet d’eau** ; le kitsune produit un **tourbillon de flammes**. Les trente identités possèdent un motif SVG distinct, sans arme ni téléchargement supplémentaire.

## Préparation et duel

La préparation conserve les choix de mascottes et affiche seulement leurs attaques, avec un bouton pour les essayer. En équipes, l’aperçu suit le membre en cours de sélection. Pendant une rencontre, l’attaque est calculée à partir de la mascotte du membre qui vient de répondre juste ; elle ne dépend pas du premier membre de son équipe. La direction suit les positions réelles : droite/gauche ou bas/haut sur téléphone en portrait.

Un critique produit un enchaînement propre à la mascotte de trois à cinq coups et impacts, une aura autour des deux mascottes et vingt particules lumineuses thématiques. Les coups brillent dans les couleurs de la mascotte : bleu et blanc pour l’eau, orange et or pour les flammes. Les attaques sont accélérées pour que l’ensemble finisse dans le battement minimal d’une seconde. Les dégâts restent de 10 % ou 20 % ; cette adaptation visuelle ne change ni la priorité du premier clic, ni les critiques, ni le tirage des binômes, ni les victoires.

Une erreur ne lance aucune attaque adverse : des objets tombent uniquement sur son auteur. L’un des dix effets existants est choisi automatiquement à partir du tour et de la mascotte, de façon reproductible. Le critique double le nombre d’objets et renforce la réaction. Un temps écoulé sans réponse ne crée ni dégât ni impact.

## Sauvegardes

Les nouveaux journaux conservent les mascottes et les actions, sans réglage d’effets. Les journaux antérieurs avec `config.effects` restent validés et rejoués avec les mêmes vies et résultats ; ce champ historique ne pilote plus le rendu. Reprendre retrouve ainsi l’attaque de chaque mascotte. Les images des trente mascottes sont déjà préchargées ; les motifs d’attaque sont du SVG inclus dans le code du duel, disponible dans la page ouverte sans réseau.

## Vérifications

Les tests de domaine vérifient les trente correspondances, l’unicité de leur géométrie après retrait des couleurs, la séparation attaque/erreur, la variété automatique reproductible et la reprise des journaux historiques. Les parcours navigateur vérifient les trente attaques dans les deux sens, leur mouvement et leur cible, l’absence de sélecteur, le jet d’eau et les flammes animés avec la préférence système de réduction des mouvements, les critiques, la reprise et le tournoi avec des membres différents. Voir `mascots-effects-results.json`, `duel-results.json` et `quality-signature-attacks-results.json` pour les contrôles réellement exécutés.
