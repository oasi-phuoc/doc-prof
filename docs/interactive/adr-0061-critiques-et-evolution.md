# ADR 0061 — Paramètres de combat, énergie ×4 et mascottes adultes

La préparation des duels à deux et par équipes regroupe désormais **Minuteur**, **Vie maximale** et **Chances de critiques** dans « Paramètres de la partie ». La vie maximale va de 10 à 200 points. Les probabilités ×2, ×3 et ×4 sont des pourcentages entiers de 0 à 100 ; leur somme ne peut pas dépasser 100. La part restante correspond aux coups normaux. Une configuration invalide reste visible et bloque la préparation.

Les valeurs initiales sont 100 PV, 25 % de ×2, 10 % de ×3 et 5 % de ×4. Un coup normal retire 10 points, puis 20, 30 ou 40 selon le critique. Augmenter la vie maximale prolonge donc la partie. Le premier clic reste décisif : une réponse juste frappe l’adversaire ; une réponse fausse touche son propre auteur. Une expiration retire toujours 10 points aux deux joueurs, sans critique.

Les paramètres valides se conservent localement dans `settings/duel-parameters-v1`. Les écritures successives sont sérialisées. Une reprise conserve les règles de sa partie, indépendamment des réglages actuels du formulaire. Les journaux de version 4 stockent leur configuration et leurs événements ; les versions 2 et 3 gardent leur vie de 100 et leurs probabilités précédentes, sans ×4. Un journal ancien ne peut pas adopter silencieusement les nouvelles règles.

## Vie et évolution

Le nombre de PV est coloré et gras, sans cartouche noir. Le remplissage est proportionnel au maximum choisi, y compris à 200. Les états fatigué et très fatigué suivent 50 % et 20 % de la vie maximale. La pose énervée reste prioritaire pendant un critique ; la fatigue réapparaît après l’attaque. Victoire et KO gardent leur priorité finale.

Au-delà de 100 PV de maximum, la mascotte utilise une **forme adulte distincte**, avec corps et traits développés. Cette forme dépend de la configuration de la rencontre et reste adulte lorsque les PV redescendent sous 100, puis jusqu’au bilan. Chaque mascotte possède quatorze états adultes : normal, énervé, fatigué, très fatigué, victoire, KO, charge, tir, réflexion, carte levée, discussion, félicitations, larmes et pause. Les six états d’activité restent disponibles dans le registre, même si le duel n’utilise pas toutes les phases du mode Classe.

Vingt nouvelles planches contiennent 420 états adultes et 60 poses de charge/tir des minis. Leurs silhouettes sont isolées par des contours CSS calculés sur les composantes alpha ; les octets des PNG générés restent inchangés. Le contrôle et les empreintes sont dans `evolution-masks.generated.json`. Les planches du combat sont préchargées pour continuer à jouer sans réseau. Elles restent dans le module de duel et ne chargent pas les pages de salles ordinaires.

```sh
npm run mascots:evolution-crops
```

## Critique ×4

Pendant la question, les deux personnages rapprochent leurs mains ou appendices derrière eux. Une sphère d’énergie séparée du dessin pulse et tourne au niveau des mains. L’aura ×4 ajoute une enveloppe plus grande, des orbites croisées, des éclairs et un mouvement de pression distinct du ×2 et du ×3 ; ses couleurs suivent la signature de la mascotte.

Si la réponse est juste, une seconde pose place les mains devant et émet un rayon qui s’élargit depuis ce point vers la victime. Les matières, couleurs, turbulences et particules reprennent l’identité de chacune des trente signatures. La direction s’inverse pour l’autre camp, avec miroir de la pose et origine des mains correspondante. Le ×3 conserve sa chorégraphie locale autour de la victime, sans traversée entre les joueurs.

Si la réponse est fausse, la sphère se resserre et implose sur son propriétaire. Cette scène ne lit aucune position adverse et n’émet aucun rayon d’attaque. Une résolution applique les dégâts une seule fois ; le nombre de particules et d’impacts dessinés ne modifie pas le score.

Une mascotte pouvant être mise KO par le coup courant clignote dans sa couleur avant le clic. Après la réponse, l’avertissement reste sur la véritable victime jusqu’au contact. Les PV affichés restent ceux d’avant le coup jusqu’à l’impact visuel, même lorsque les dégâts dépassent les derniers PV ; le moteur conserve leur valeur exacte dans la résolution. La durée de correction laisse finir toute la scène. Pause, reprise, navigation hors onglet et commandes existantes restent appliquées.

Les effets sont limités à la zone de combat et protègent question, cartes et barres. Les animations demeurent actives selon la demande du propriétaire.

## Vérification et limites

Les [tests de règles et d’images](../../tests/interactive/duel-settings.test.mjs) vérifient les probabilités extrêmes et mixtes, les 200 PV, les dégâts, les journaux anciens et nouveaux, les 480 sprites et les deux directions du rayon. Les [parcours natifs](duel-evolution-results.json) et la [revue visuelle](duel-evolution-proofs/index.html) couvrent le panneau, la sauvegarde, le coup de grâce, les animations et le jeu hors ligne après préchargement. Les [contrôles du lot](quality-duel-evolution-results.json) distinguent les essais exécutés du workflow disponible.

Le duel reste sur un écran commun. Les salles Internet à scores ne deviennent pas des combats à PV synchronisés par cet ajout. Le démarrage à froid sans réseau et la validation sur téléphone physique ou ENI restent à effectuer. Les nouveaux états sont des images animées par le moteur 2D ; ils ne constituent pas des modèles 3D articulés.
