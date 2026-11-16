# Fractions équivalentes dans les deux sens — 16 novembre 2026

Les nouvelles séries mélangent l’amplification et la réduction du numérateur et du dénominateur, en conservant la valeur de la fraction. Par exemple : `2/3 = □/12` et `8/12 = □/3`. La case peut aussi porter sur le dénominateur : `8/12 = 2/□`.

Toute série d’au moins deux questions contient les deux sens, avec un écart maximal d’une question entre eux et un ordre mélangé. Pour une seule question, le sens dépend du tirage. Les facteurs restent compris entre 2 et 5 ; les réponses attendues sont des entiers positifs exacts. La réduction demandée peut être partielle : elle n’impose pas une fraction irréductible.

La description du type « Fractions équivalentes » présente les deux possibilités. Les fiches, leurs corrigés et les jeux utilisent le même générateur ; les réponses des jeux sont vérifiées par l’adaptateur de fractions exactes.

## Vérification

- Les **onze tests de fractions** passent, dont les 2 100 configurations des sept types, les égalités par produits croisés, 200 séries de tailles variées, les deux emplacements de la case et les corrections dans les jeux.
- Dans Chromium, sur des écrans de 1 440 et 390 pixels, une série de huit questions contient quatre amplifications et quatre réductions. Les cases restent vides sur la fiche élève ; les huit réponses du corrigé satisfont les égalités. Après régénération, les questions changent et les deux sens restent présents. La régénération revient à la fiche élève avant l’ouverture du nouveau corrigé.
- Le PDF de contrôle comporte deux pages A4 : la fiche et son corrigé. Les fractions restent empilées et les réponses du corrigé imprimé sont exactes.
- TypeScript, la compilation de production et les budgets de chargement passent. Les derniers commits de `main`, jusqu’à `9814814e`, sont conservés.

[Résultats du navigateur](fractions-equivalentes-20261116-browser.json) · [Fiche et corrigé PDF](fractions-equivalentes-20261116.pdf).
