# ADR 0029 — Carrés et rectangles : mesures exactes

Le jeu reprend huit types de fiches de géométrie : périmètre et aire du carré ou du rectangle, côté du carré et largeur du rectangle à retrouver depuis le périmètre ou l’aire. La figure source accompagne la question. Les mesures données restent aussi lisibles dans le texte, notamment sur téléphone.

`domain/geometry.ts` vérifie la consigne, les cotes, les unités et le corrigé numérique avant de construire la question. Les additions, produits, divisions et racines carrées utilisent des entiers de précision fixe. Aucune tolérance flottante ni approximation de racine n’est appliquée. Les nombres affichés ont six décimales au maximum ; les cotes données sont positives et bornées à un milliard. Les aires peuvent dépasser la précision entière native JavaScript et restent calculées exactement. Les résultats arrondis sont signalés comme non pris en charge.

Les unités de longueur admises sont mm, cm, dm, m, dam, hm et km. Une aire porte l’unité au carré ; les six cartes conservent l’unité de la question. Un corrigé numérique sans unité peut reprendre celle de la figure, conformément au carré historique. Une unité fournie doit correspondre. Les divisions non finies, racines non exactes, longueurs contradictoires entre texte et figure, résultats non positifs et corrigés périmés sont rejetés.

Pour une dimension manquante, la consigne source complète conserve le périmètre ou l’aire donnés et l’éventuelle longueur. La figure publique est reconstruite explicitement : `ask` reste présent et sa valeur numérique reste absente. Une source éditée contenant déjà la cote masquée est refusée. La révélation met en évidence la carte correcte ; elle ne remplit pas la cote du dessin et n’ajoute pas une seconde réponse près de la mascotte.

Les distracteurs numériques sont déterministes et distincts. La conversion est classée `assisted`, comme le précédent carré : les propositions sont adaptées à partir d’une réponse recalculée, sans QCM papier d’origine. Les identifiants source et la partie zéro sont conservés ; aucun nouveau schéma de séance n’est nécessaire. Les plafonds de choix, le tri croissant, les nouvelles graines, les instantanés et les modes Classe/Solo réutilisent les contrats existants.

La compétition transportait déjà les figures, mais son parseur refusait les chaînes `unit` et `ask`. Il valide maintenant une liste explicite de champs `FigureDims`, avec unités, enums et bornes numériques ; les champs inconnus et toute cote masquée renseignée sont rejetés. Les vues élèves conservent les données publiques et reçoivent le corrigé uniquement en correction. Le défi local est vérifié après coupure du réseau ; l’activation du Worker Internet reste une tâche distincte.

La conversion ne modifie aucun item, corrigé ou rendu imprimable. Les figures composées, doubles questions périmètre/aire, autres polygones, cercles, volumes et conversions entre unités restent hors de ce lot. Les mélanges ne conservent que les items effectivement compatibles et affichent les raisons pour les autres.

Vérifications : huit tests géométriques couvrent 2 400 configurations réelles (huit types, trois niveaux, cent graines), des cas indépendants de décimaux/grands entiers, les inverses, les incohérences, les graines, la persistance et la compétition. Trois tests renforcent le schéma des figures en compétition. Le [parcours navigateur](geometry-results.json) vérifie Classe, reprise, Solo automatique, tri numérique, unités, masques et compétition locale à 390, 360 et 1 366 pixels ; les contrôles axe passent sur ces vues. Le [relevé de qualité du lot](quality-geometry-main-results.json) consigne les vérifications complémentaires et leurs limites.

```sh
node --test tests/interactive/geometry.test.mjs tests/interactive/competition-core.test.mjs
npm run test:interactive:geometry
```
