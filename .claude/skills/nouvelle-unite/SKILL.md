---
name: nouvelle-unite
description: >-
  Compose une série de pages de fiches maths (plusieurs PageConfig dans le
  générateur) autour d'un objectif (même thème, progression addition→problèmes,
  évaluation multi-pages). À utiliser dès qu'on demande une série, un cahier,
  une leçon complète, un parcours ou « toutes les fiches pour… ».
---

# Série multi-pages

Une « unité » ici = plusieurs entrées dans l'état `pages: PageConfig[]` de `App.tsx`, chacune produisant une `WorksheetPage` via `buildPage`.

## Étapes

1. Clarifier l'objectif (ex. « additions posées puis problèmes », « périmètres rectangle/triangle/trapèze »).
2. Choisir des `exerciseType` déjà dans `catalog.ts` ; ne pas inventer de types hors catalogue (sinon skill `nouvel-exercice` d'abord).
3. Définir pour chaque page : `domain` + un ou plusieurs blocs (`exerciseType`, `count`, `columns` ; français : `track` Voc/Gram/Com). Plusieurs types sur la même A4 via `extraBlocks`. Les titres **Exercice 1, 2, 3…** sont chronologiques sur toute la fiche.
4. Densité : viser le remplissage d'**une** A4 par page sans overflow destructeur ; préférer une page de plus plutôt que densifier au détriment de la lisibilité.
5. Mode éval : `evalMode` + `pointsPerQuestion` cohérents sur toute la série si c'est une évaluation.
6. En-tête : même `headerStyle` / champs institutionnels pour toute la série.
7. Vérifier navigation rail (numéros 1, 2, 3…) et impression de **toutes** les pages (`.print-only-sheets`).

## Progression type

| Objectif | Enchaînement suggéré |
|---|---|
| Maîtrise opératoire | ligne → trou → colonne → problèmes |
| Géométrie mesure | figures (nommer) → périmètres → aires |
| Évaluation | 1 page calcul mixte + 1 page problèmes, points activés |

## Terminé quand

Chaque page A4 stable · types existants · consignes cohérentes · print de N pages OK.
