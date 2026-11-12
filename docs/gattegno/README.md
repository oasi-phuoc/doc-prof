# Audit et banques Gattegno

Les sept thèmes sont **Simple**, **Déterminants**, **Verbes pronominaux**, **Adjectif**, **Préposition**, **Adverbe** et **Conjonctions**. Les tableaux de référence restent séparés. Chaque exercice propose **Positive / Négative / Mixte** ; les recettes historiques de négation sont migrées vers le thème correspondant avec la forme négative sélectionnée. Les quatre formats partagent les mêmes phrases pour une même graine et les mêmes réglages.

## Révision éditoriale du 12 novembre 2026

La banque passe de **5 476 à 19 513 constructions distinctes**, après dédoublonnage entre thèmes. Un sujet différent ou une mise à la forme négative ne compte pas comme une nouvelle construction. Le comptage porte sur l’infinitif, le complément complet et l’éventuelle seconde action. Le [point de départ](expansion-baseline.json) est le commit `9fccae6f` ; le [rapport d’enrichissement](editorial-expansion.json) conserve les effectifs avant/après de chaque thème et groupe. Les 27 choix déjà alimentés ont au moins doublé ; les verbes pronominaux du deuxième groupe, auparavant absents de la sélection, sont maintenant disponibles.

Les nouveaux compléments sont rédigés pour un verbe et une situation précis, avec leurs adjectifs accordés et leurs prépositions. Douze domaines du quotidien sont couverts : alimentation, logement, vêtements et achats, formation, travail et démarches, déplacements, santé, relations, culture et loisirs, nature, numérique, sport. Les listes de production écrite passent de **15 à 30 consignes par thème**.

Exemples de révision :

- **Mémoire** : « Je ne me souviens pas du rendez-vous » et « Je ne me rappelle pas la date du rendez-vous ». *Se rappeler quelque chose* et *se souvenir de quelque chose* conservent leur construction respective.
- **Compléments précis** : *montrer son abonnement*, *fermer le sac*, *débarquer du bateau*, *visiter le musée avec un guide* ; les emplois isolés comme *visite avec un guide* sont complétés.
- **Possessifs** : *j’emporte mon sac*, *nous nous réunissons avec nos collègues*, *je m’offre un livre pour mon anniversaire*. Les possessifs des prédicats relus renvoient au sujet ; une référence à un tiers est formulée explicitement.
- **Adverbes et gestes** : *connaît bien* ; *se tait quelques instants* ; *se sèche les mains mouillées* ; *se réchauffe les jambes froides*.
- **Coordinations** : les deux actions sont choisies dans un même domaine, avec des infinitifs distincts même après retrait de *se/s’*. Les paires complètes sont conservées ; les compléments des deux propositions ne sont plus croisés librement.
- **Catégories et vocabulaire** : distinction entre article partitif et préposition contractée ; remplacement de compléments trop vagues ; conservation des compléments nécessaires lorsqu’une catégorie est exclue.

La relecture porte sur les modèles sources et les règles qui les combinent. Les contrôles automatiques vérifient les propriétés décrites ci-dessous ; ils ne constituent pas une preuve générale du sens de toute phrase française produite.

## Groupes de verbes

Le générateur propose **1er**, **2e**, **3e** et **Mixte**. La classification retire le préfixe pronominal avant de déterminer le groupe. Les banques internes `er` et `autres` sont des regroupements historiques, indépendants des groupes affichés.

Le deuxième groupe comporte désormais onze modèles simples : *finir*, *choisir*, *remplir*, *réussir*, *nourrir*, *applaudir*, *réunir*, *rafraîchir*, *salir*, *agrandir*, *assouplir*. La banque pronominale propose notamment *se rafraîchir*, *se réjouir*, *se réunir*, *se dégourdir*, *se choisir*. Un réglage de groupe s’applique aux deux verbes d’une coordination. **Mixte** réunit les trois groupes sur la fiche.

La banque pronominale source comporte **71 modèles** : 48 dans `er`, 23 dans `autres`, avec respectivement 565 et 347 prédicats complets avant ajout des combinaisons. Les pronoms réfléchis et les verbes reçoivent des pastilles distinctes. Un même modèle verbal ne se répète pas sur une fiche ; la quantité demandée reste plafonnée au nombre de verbes disponibles, et non au nombre de phrases de la banque.

## Quotas des combinaisons

Chaque thème et chaque banque source historique dispose de **1 050 constructions de référence**, contre 525 auparavant. Les [combinaisons](combinations.json) présentent les phrases affirmatives et négatives pour les 16 cas :

| Catégories présentes | Nombre par cas | Cas | Total |
|---|---:|---:|---:|
| Aucune : phrases simples | 100 | 1 | 100 |
| Adjectif, adverbe, préposition ou conjonction seul | 100 | 4 | 400 |
| Deux catégories | 50 | 6 | 300 |
| Trois catégories | 50 | 4 | 200 |
| Les quatre catégories | 50 | 1 | 50 |

Les sept thèmes et les deux banques historiques représentent **14 banques**, soit **14 700 références affirmatives et 14 700 négatives**. Les six thèmes non pronominaux partagent des familles de constructions ; ces références ne sont donc pas toutes distinctes entre thèmes. Le total distinct de 19 513 constructions inclut aussi les autres modèles sources conservés et enrichis.

Les paires coordonnées utilisent *et*. Chaque proposition conserve son propre infinitif, son sujet et sa conjugaison. Les adjectifs sont accordés avec les noms qu’ils qualifient ; les adverbes sont choisis selon le verbe. Les prépositions nécessaires ne sont jamais retirées pour fabriquer artificiellement une phrase simple.

## Références et filtres

[audit.json](audit.json) contient **200 phrases distinctes par thème, forme et banque historique**, soit **5 600 références** : 2 800 affirmatives et 2 800 négatives. Prénoms, groupes nominaux et pronoms sont représentés.

Chaque exercice propose quatre réglages **Avec / Sans** : adverbes, prépositions, conjonctions et adjectifs. « Avec » autorise la catégorie ; « Sans » l’exclut. Les filtres choisissent des prédicats complets : *s’occuper du jardin* est exclu sans prépositions, tandis que *Je me lève le matin* reste disponible. Les mots négatifs *ne/n’* et *pas* restent disponibles sans les autres adverbes. Sans la catégorie centrale du thème, les modèles simples sont proposés.

Les réglages restent indépendants entre exercices et se conservent dans les recettes et changements de format. Les textes saisis en mode libre sont préservés. Les contrôles existants de négation, élision, contractions, h aspiré, accords et migration des anciennes recettes sont conservés.

## Vérifications reproductibles

```sh
npm run test:gattegno
npm run test:gattegno:browser
```

Les trois audits parcourent les prédicats, les personnes disponibles, les formes positives et négatives, les groupes réels, les 16 réglages de catégories et les quatre formats. Ils contrôlent aussi les quantités, l’absence de doublons, les possessifs, les deux propositions, les recettes et l’indépendance des blocs. L’audit éditorial mesure le doublement par rapport au point de départ et vérifie les domaines des paires coordonnées.

Le [parcours navigateur](browser-results.json) couvre les sept thèmes et quatre formats à 390 et 1 366 pixels, les pronominaux du deuxième groupe, les exclusions de catégories, la régénération, les corrigés et huit pages A4 sans débordement. Des [captures](screenshots/fiche-1366.png) et un [PDF de fiches et corrigés](fiches-et-corriges.pdf) permettent de revoir le résultat.

Les rapports se régénèrent avec :

```sh
node scripts/audit-gattegno.cjs --write
node scripts/audit-gattegno-combinations.cjs --write
node scripts/audit-gattegno-editorial.cjs --write
```

Sans `--write`, les contrôles s’exécutent sans réécrire les rapports. Les audits et le parcours navigateur font partie du workflow de qualité.
