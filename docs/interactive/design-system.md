# Interface du jeu en classe

Fond calme, panneaux blancs, texte sombre, accent du thème ClairFLE. Les couleurs pastel servent aux repères des réponses ; la couleur ne représente jamais le jugement juste/faux. Le logo et le bouton de création reprennent le générateur habituel.

La palette unique A–F vit dans `domain/palette.ts`. Les couleurs par défaut sont assez claires pour une encre noire à un contraste d’au moins 7:1. Les lettres et formes SVG ont exactement la même taille déclarée, vérifiée dans le navigateur. Les repères restent lisibles pendant la réflexion. Les formes sont configurables avec un échange qui préserve six formes distinctes.

La grille garde trois colonnes et deux rangées dans le jeu, la palette et le kit papier. Pour deux QCM audio, chaque question occupe une rangée avec son propre énoncé : A–C puis D–F. La piste commune est placée au-dessus. Les cartes de correction présentent la couleur et les repères en bandeau supérieur, avec l’image ou le texte en dessous ; le statut se trouve à droite.

Les commandes de séance et la progression ont leur centre propre, indépendant du titre à gauche. Les boutons icônes portent un nom accessible et un titre. Les étapes utilisent un pictogramme dessiné et un texte, avec une seconde illustration à droite quand deux actions se suivent. L’action de phase est centrée en pied de séance.

Les documents à lire sont ouverts directement avec réglage de taille. Les scènes disposent d’un zoom de 1× à 3×, d’une fermeture par Échap et de commandes clavier. Le contraste renforcé et `prefers-reduced-motion` sont pris en charge. Les contenus longs restent défilables ; aucune règle de hauteur ne les coupe.

## Captures vérifiées

- [Question et cartes pastel](screenshots/02-thinking-1366.png)
- [Préparation et palette configurable](screenshots/08-classroom-setup-1366.png)
- [Document à lire et réponses en images](screenshots/09-reading-1366.png)
- [Correction en image](screenshots/10-image-correction-1366.png)
- [Deux questions audio et six réponses](screenshots/11-paired-audio-1366.png)
- [Deux corrections indépendantes](screenshots/12-paired-correction-1366.png)
- [Géométrie](screenshots/04-geometry-1366.png)
- [Production orale](screenshots/06-oral-1366.png)
- [Cartes A4, deux jeux](screenshots/cartes-classe-a4.pdf)

Les résolutions 1920 et 1280 sont dans le même dossier. Ces captures et événements tactiles automatisés ne remplacent pas la validation sur l’ENI physique de la classe.
