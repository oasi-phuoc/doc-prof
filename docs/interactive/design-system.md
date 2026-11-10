# Interface du jeu en classe

Fond calme, panneaux blancs, texte sombre, accent du thème ClairFLE. Les couleurs pastel servent aux repères des réponses ; la couleur ne représente jamais le jugement juste/faux. Le logo et le bouton de création reprennent le générateur habituel.

La palette unique A–F vit dans `domain/palette.ts`. Les couleurs par défaut sont assez claires pour une encre noire à un contraste d’au moins 7:1. Les lettres et formes SVG ont exactement la même taille déclarée, vérifiée dans le navigateur. Les repères restent lisibles pendant la réflexion. Les formes sont configurables avec un échange qui préserve six formes distinctes.

La grille garde trois colonnes et deux rangées sur ordinateur, dans la palette et le kit papier ; le jeu mobile utilise deux colonnes pour tenir dans le viewport. Pour deux QCM audio, chaque question occupe une colonne avec son propre numéro : A–C empilés à gauche et D–F à droite. La piste commune est placée dans le menu supérieur. Les repères sont placés à gauche de chaque proposition, lettre en haut et symbole en bas. À la correction, les propositions restent visibles. En Solo, le choix sélectionné porte le signe de justesse ; une réponse fausse fait apparaître la bonne réponse dans la marge gauche, avec le statut à droite. En Classe, aucune réponse individuelle n’est sélectionnée au tableau.

Les commandes de séance et la progression ont leur centre propre, indépendant du titre à gauche. Les boutons icônes portent un nom accessible et un titre. Les étapes utilisent des illustrations originales rondes à fond blanc dans les marges, avec une seconde illustration à droite quand deux actions se suivent. L’action de phase est centrée en pied de séance.

Les documents à lire sont ouverts directement avec réglage de taille. Les scènes disposent d’un zoom de 1× à 3×, d’une fermeture par Échap et de commandes clavier. Le contraste renforcé est pris en charge. Les mascottes, confettis et larmes gardent leurs mouvements même avec `prefers-reduced-motion`, selon la demande explicite du propriétaire. Les contenus longs restent défilables.

DM Sans et Fraunces sont hébergées localement, avec leurs licences SIL OFL 1.1. Un sous-ensemble d’Inter fournit les chiffres tabulaires et les espaces insécables du jeu, sans changer les lettres ni les fiches A4. Les trois WOFF2 restent sous 150 Kio. Voir les [sources, licences et commandes de fabrication](../../public/fonts/interface/README.md) et l’[ADR 0005](adr-0005-polices-locales.md). La racine HTML est en français.

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

Voir [les modifications du Word et le précontrôle](livraison-medias-word.md), avec la capture [des médias absents](screenshots/13-media-missing.png).
