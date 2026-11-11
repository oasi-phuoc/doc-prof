# ADR 0022 — Mesurer les textes avant projection

F46 (§59.4 et §69) demande un contrôle de lisibilité dans la préparation. La sélection résolue est désormais rendue hors écran à 1 920 × 1 080 et 1 366 × 768, ainsi qu’à la taille courante d’un téléphone. Chaque mesure utilise un document HTML dans une iframe de même origine, sans scripts, invisible et non focalisable. Copier les styles dans un simple conteneur de largeur fixe aurait conservé les media queries et les unités `vw` / `vh` de la fenêtre principale ; l’iframe possède le viewport attendu.

La projection réutilise `QuestionStage`, le menu, les cartes et les marges de la séance. Le lecteur et le compteur y sont statiques ; aucune piste n’est lue. Les polices et les images sont attendues avant mesure. Seuls l’énoncé, le contexte, les propositions et les médias publics sont rendus : aucune clé de correction n’est fournie. L’examen ne modifie ni la recette, ni les questions, ni leur ordre, ni les résultats. Les rapports restent en mémoire et sont invalidés par une nouvelle sélection, un nouveau tirage ou des réglages modifiés. Une campagne annulée détruit ses rendus ; une campagne indisponible ou dépassant trente secondes signale l’échec et permet le lancement avec vérification manuelle.

## Adaptations pendant le jeu

Le même moteur mesure les conteneurs réels avec `ResizeObserver`, après chargement des polices et images et lors d’un redimensionnement. Il conserve l’affichage courant lorsqu’il tient. Sinon :

1. Il borne la scène disponible et cherche par dichotomie la plus grande police qui tient entre la cible existante et son plancher. Les formats courts et les polices déjà inférieures aux propositions du §59.2 ne sont pas davantage réduits ; les choix et la question d’un écran sont traités uniformément.
2. Il essaie les propositions en liste verticale, sans changer leurs lettres, formes, couleurs ou identifiants.
3. Il préserve une zone bornée avec indicateur **Suite**. La question et la liste se parcourent au clavier. Chaque proposition dispose du même bouton de lecture lorsque le groupe exige ce repli. Le texte complet s’ouvre dans une fenêtre de lecture avec défilement interne, Échap et retour du focus. Le texte des cartes n’est pas un élément interactif imbriqué dans leur bouton de réponse. Lire une proposition ne la sélectionne pas et ne révèle aucune correction.

La préparation liste les questions nécessitant les paliers 2 ou 3, les résolutions concernées, et propose de raccourcir les textes dans la fiche. Le lancement attend la fin du contrôle. La fiche imprimée garde son rendu. Le minuteur du jeu suit ses règles habituelles pendant la lecture, comme pendant le zoom d’une image ; la pause reste disponible.

## Vérification et limites

[readability-results.json](readability-results.json) couvre les courts énoncés, les longs choix et une longue question à 1 920 × 1 080, 1 366 × 768, 390 × 844 et 360 × 640. Les assertions contrôlent l’accès au texte complet, les commandes dans le viewport, l’absence de sélection lors de la lecture, le clavier, le focus et axe. Les parcours existants vérifient aussi les questions jumelées, les médias et les différentes phases.

Cette mesure navigateur ne certifie ni la lecture depuis le fond de la classe ni l’impression physique. Les modèles de production ouverte et les contenus de nouveaux adaptateurs doivent être ajoutés à ces essais lors de leur extension. Les planchers historiques des écrans à deux questions et du mobile restent ceux des dernières demandes du propriétaire ; la matrice typographique V4 constitue une cible à vérifier sur l’ENI, pas une raison de miniaturiser davantage les textes.
