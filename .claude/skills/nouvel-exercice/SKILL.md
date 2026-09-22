---
name: nouvel-exercice
description: >-
  Ajoute un type d'exercice maths de bout en bout (entrée catalog.ts, branche
  déterministe dans generate.ts, layout MathItemView si besoin, colonnes /
  préférences). À utiliser dès qu'on demande d'ajouter, créer ou implémenter un
  exercice, un type de fiche, un générateur (addition en colonnes, fractions,
  périmètre, division posée, suites, problèmes…), même sans le mot « exercice ».
---

# Créer un type d'exercice maths

Un type d'exercice = une entrée dans `src/math/catalog.ts` + une branche dans `src/math/generate.ts` + un rendu via un `layout` existant (ou nouveau) dans `MathItemView.tsx`.

## Avant de coder

Lire `CLAUDE.md` et un type proche dans `catalog.ts` / `generate.ts`. Fixer en une phrase chacun :

1. **Thème** (`topic` id) et **domaine** (`algèbre` | `géométrie`).
2. **Ce que l'élève fait sur le papier** (calculer, poser, comparer, mesurer sur figure…).
3. **Layout** : réutiliser un `Layout` existant (`inline`, `column`, `column-empty`, `division-column`, `text`, `compare`, `sequence`, `geo`, `coord`…) autant que possible.
4. **Paramètres implicites** : bornes de nombres, `preferredColumns`, `figure` éventuelle.
5. **Corrigé** : champ `answer` + données de rendu (chiffres, retenues, dims, steps…).

## Étapes

1. Ajouter l'entrée avec l'helper `t(...)` dans `exerciseTypes` (`catalog.ts`) : `id`, `topic`, `label`, `description`, `instruction`, `visual`, extras (`preferredColumns`, `figure`).
2. Dans `generate.ts`, brancher sur `config.exerciseType` (ou le motif déjà utilisé) pour produire des `MathItem[]` via `rng` uniquement (`int`, `pick`, `shuffle` de `src/math/rng.ts`).
3. Si le `layout` n'existe pas : l'ajouter dans `types.ts`, le rendu dans `MathItemView.tsx`, les styles dans `App.css` (école, N&B).
4. Vérifier densité A4 : `preferredColumns` et `count` par défaut compatibles avec une page fixe (voir skill `test-impression`).
5. `npm run lint` puis `npm run build`. Contrôler aperçu élève + corrigé.

## Contrat du générateur

- **Pur** : mêmes `(PageConfig, seed)` → même `WorksheetPage`. Uniquement `createRng(seed)`.
- Chaque item a un `answer` string utilisable en mode `answers`.
- Opérateurs unicode scolaires : `+`, `−`, `×`, `÷` (pas `-` ASCII pour la soustraction affichée).
- Décimaux affichés avec virgule (`fmt`).
- Figures : dims réalistes + `triangleKind` aléatoire si triangle ; ne pas copier de SVG externe.

## Contrat du rendu

- Numéro simple (pas de pastille / cadre).
- Réponses élèves : `.answer-line-field` (souligné), pas de boîte.
- Mode `answers` remplit les mêmes emplacements sans changer la mise en page.
- Points d'éval : `QuestionPoints` seulement si `evalMode`.

## Gabarits

Voir `assets/` pour un squelette de branche générateur et de test de déterminisme.

## Terminé quand

Type visible dans les SelectBox Thème → Type · générateur déterministe · rendu élève/corrigé · page A4 non déformée · lint/build OK.
