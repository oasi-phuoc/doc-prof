# ADR 0062 — Fractions exactes dans les pools du jeu

Six types d’algèbre rejoignent le jeu : numérateur et dénominateur, fractions équivalentes à compléter, simplification, addition et soustraction, multiplication, division. Avec les comparaisons déjà disponibles, les sept types du thème **Fractions** sont proposés dans le choix des exercices. Ils peuvent être mélangés avec les autres types et domaines d’un pool.

## Vérifier l’exercice avant de créer les cartes

L’adaptateur est limité aux six types et à leurs formats d’énoncé explicites. Il analyse les fractions écrites, recalcule la valeur par entiers `BigInt` et vérifie le corrigé source. Aucun texte n’est exécuté. Les numérateurs et dénominateurs saisis sont bornés à dix-huit chiffres ; les dénominateurs doivent être strictement positifs.

Une question de numérateur utilise celui de la fraction écrite, avant simplification : dans `6/9`, le numérateur demandé reste `6`. Les équivalences doivent avoir exactement un entier manquant et une solution unique. `0/3 = 0/□` est donc écarté. Les simplifications et calculs exigent un corrigé réduit ; les réponses entières et la notation source réduite `3/1` sont conservées.

La division traite la seconde fraction entière : `1/2 ÷ 3/4 = 2/3`. Elle ne réutilise pas la lecture linéaire de plusieurs barres de fraction. Les différences négatives et les résultats nuls sont acceptés ; les dénominateurs nuls, divisions par zéro, corrections contradictoires ou incomplètement simplifiées sont signalés et exclus.

## Six valeurs différentes et tri exact

Les cartes conservent la notation du corrigé source. Leurs distracteurs viennent d’erreurs de calcul usuelles, d’une inversion ou de changements proches du numérateur/dénominateur. Chaque proposition est réduite avant déduplication : `1/2` et `2/4` ne peuvent pas être proposées comme deux réponses concurrentes.

Les identifiants rationnels portent leur numérateur et dénominateur réduits. Le tri croissant compare leurs produits croisés, sans arrondi ni conversion en virgule flottante. Les identifiants des anciens entiers et décimaux gardent leur traitement et leurs plans. Le plafond de deux à six choix conserve toujours la bonne réponse.

La question reste à compléter pendant la correction. La bonne réponse apparaît dans sa carte, les autres sont grisées. Les modes Classe, Solo, duels et compétition réutilisent leur moteur de réponses et de sauvegarde. Les questions de salle passent par le parseur existant qui remplace les identifiants internes ; la clé reste privée jusqu’à la correction.

Les fractions s’affichent verticalement, numérateur au-dessus du dénominateur et barre horizontale : questions, cartes des deux joueurs, compétition et lecture agrandie. Les cases inconnues gardent leur place dans la fraction. La valeur textuelle reste disponible pour l’accessibilité et la copie ; les énoncés, corrigés, identifiants et sauvegardes restent identiques. Les dates, adresses et textes ordinaires ne sont pas transformés.

Les mascottes des duels et tournois sont réduites selon l’espace disponible. Une réserve au-dessus de chaque personnage accueille les auras, y compris le ×4, sous la bande de question. La barre de vie reste alignée sur la mascotte, avec le nombre en couleur. Les mouvements et la taille relative des différents niveaux d’aura sont conservés.

## Source et catalogue

Le rendu des fiches imprimables et leurs générateurs ne sont pas modifiés. Les nouvelles parties changent la graine et gardent les types et réglages sélectionnés. Les six types ne proposent pas le réglage générique de plage de nombres : leurs générateurs choisissent leurs numérateurs et dénominateurs indépendamment de cette plage. Le catalogue des pools est reconstruit et certifié avec les générateurs réels, sur trois graines et les seize positions de source.

Les figures à colorier ou à lire, les calculs fractionnaires TPM composés, les expressions libres et les autres fractions hors de ces formats demandent encore leurs adaptateurs. Les anciens exercices de comparaison gardent leur conversion.

## Preuves

Les [tests de domaine](../../tests/interactive/fractions.test.mjs) couvrent 2 100 configurations réelles, les cas limites, les incohérences, les cartes, les plafonds et le tri, les nouvelles graines, la persistance et les vues de compétition. Le [parcours navigateur](../../tests/interactive/fractions-browser.mjs) vérifie le choix direct depuis les pools sans service de fiches, les corrections Classe et la reprise, les réponses et délais Solo, et un défi local sans réseau.

Les [résultats](fractions-results.json), [captures](fraction-proofs/index.html) et [contrôles exécutés](quality-fractions-results.json) consignent les vérifications de ce lot ; ils ne valent pas validation matérielle sur ENI ni activation d’un serveur de production.
