# ADR 0038 — Devinettes et intrus des jeux imprimables

Les fiches **Jeux › Devinettes** et **Jeux › Intrus** peuvent alimenter une séance en Classe, Solo ou compétition. La conversion reprend les mots, indices et corrigés du générateur ; elle ne reprend pas la disposition des cartes papier.

## Devinettes

Chaque numéro de carte relie le mot du recto à son indice au verso, y compris après miroir ou réorganisation des cartes. L’indice s’affiche dans la question. Deux à six mots de la même planche servent de réponses, avec leurs images lorsqu’elles existent. Le bon mot est conservé dans chaque tirage et dans les plafonds de choix. Le mélange est déterministe et les nouvelles parties renouvellent l’ordre et les alternatives.

Une carte vide ou sans indice n’invente pas de question. La formule de secours « Décrivez ce mot sans dire son nom. » est une consigne de production orale, pas une devinette : elle est signalée comme indice à compléter. Un même indice rattaché à plusieurs mots distincts devient une activité guidée ; ses réponses modèles sont conservées et aucun verdict automatique n’est attribué. Un mot sans alternative suit également ce parcours. L’association des deux faces exige des numéros présents, uniques et concordants.

## Intrus

Les trois à six mots d’un groupe deviennent les cartes de réponse ; les planches courantes en fournissent cinq. Le générateur conserve désormais `intrusAnswer`, le mot qu’il avait lui-même choisi lors du tirage. Ce champ est une donnée source, sans rendu papier. La conversion exige qu’il corresponde exactement à un seul des mots du groupe. Elle ne cherche pas à déduire la bonne réponse du thème, de l’orthographe ou du nom d’une image.

Les anciennes planches figées en mode libre peuvent ne pas contenir ce corrigé. Elles sont signalées et demandent une régénération depuis leur modèle ; les autres questions utilisables sont conservées. Les mots répétés, les groupes incomplets, les corrigés étrangers au groupe et les planches non validées sont refusés. Aucune règle d’explication n’est inventée lorsque la source fournit seulement le mot intrus.

## Jeu et conservation

Ces questions reprennent les contrôles existants : Classe collective sans sélection au tableau, Solo avec correction et enchaînement automatiques, minuteur facultatif, choix et ordre personnalisés, feuille enseignant, sauvegarde et reprise. Le corrigé reste séparé des données de projection et des vues des élèves en compétition. La bonne carte garde sa couleur à la correction, les autres deviennent grises.

Les devinettes et intrus sont des questions indépendantes. Choisir un mot ne le retire donc pas des questions suivantes. Les images du défi local sont préparées avant le jeu sans réseau. Aucun modèle enregistré n’est réécrit sur le serveur.

Sur petit téléphone, les cartes qui contiennent une image et un mot réservent la hauteur du libellé et adaptent l’image à l’espace restant. La grille conserve ses six cartes pendant la réflexion sur 360 × 640, avec la mascotte et les commandes visibles. La question courte « Quel est le mot ? » garde l’indice de la fiche et une espace insécable avant son point d’interrogation.

Huit tests de domaine comparent 600 configurations réelles sur le thème des fruits, les trois difficultés et cent graines par famille. Ils contrôlent les liens des deux faces, les indices ambigus ou absents, les corrigés manquants, les images remplacées, les plafonds, les nouvelles graines, la persistance, la feuille enseignant et le corrigé privé en compétition. Ces tests vérifient la fidélité aux sources ; ils ne constituent pas une relecture pédagogique de tous les thèmes.

Le [parcours navigateur](printable-riddles-results.json) couvre les deux familles sur mobile et ordinateur, les trois modes et la reprise. Il compare aussi le rendu A4 réel d’une planche Intrus avec et sans le nouveau champ de corrigé. Les contrôles du lot sont consignés dans le [relevé qualité](quality-riddles-results.json).

```sh
node --test tests/interactive/printable-riddles.test.mjs
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:interactive:riddles
```

Le tri M08, le retournement des cartes M11 et les autres familles non prises en charge restent ouverts. Les nouvelles synthèses audio restent reportées.
