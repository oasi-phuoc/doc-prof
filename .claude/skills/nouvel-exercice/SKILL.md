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

1. **Thème** (`topic` id) et **domaine** (`français` | `algèbre` | `géométrie`).
2. **Ce que l'élève fait sur le papier** (calculer, poser, comparer, mesurer sur figure…). En français : le type appartient à un thème communicatif + un `track` Voc / Gram / Com.
3. **Layout** : réutiliser un `Layout` existant (`inline`, `column`, `column-empty`, `division-column`, `text`, `compare`, `sequence`, `geo`, `coord`…) autant que possible.
4. **Paramètres implicites** : bornes de nombres selon `PageConfig.difficulty`, `preferredColumns`, `figure` éventuelle.
5. **Corrigé** : champ `answer` + données de rendu (chiffres, retenues, dims, steps…).

## Niveau (Facile / Moyen / Avancé)

Champ `difficulty` sur `PageConfig` (`src/math/difficulty.ts` + SelectBox **Niveau** sous le type).

| Niveau | Calculs simples (+ −) | Problèmes | Équations |
|---|---|---|---|
| Facile | opérandes 1–100 | texte A1, une opération | linéaires simples, sans puissance |
| Moyen | 1–1000 | texte A2 + donnée piège inutile | fractions / deux côtés |
| Avancé | 1–10 000 | texte B1, plusieurs opérations | fractions + puissances / racines |

Toujours lire `config.difficulty` dans `generate.ts` / `algebra.ts` (via `pairAdd`, `makeWordProblem`, `generateEquations`…).

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
- **Trait de réponse = pleine largeur par défaut** (`display: block; width: 100%`). Partout : texte, calculs après `=`, algèbre, géométrie, problèmes. Ne pas utiliser `med` / `wide` / `slim`.
- Exception uniquement : `.answer-line-field.compact` pour un **trou local** (suite, case de division, opérande manquant dans une équation).
- **Expressions algébriques** : grille de brouillon de 3 lignes sous l’expression (6 lignes en 2 colonnes).
- **Périmètre, aire, volume** : grille de 3 lignes sous la figure, cotes en couleur du thème. Deux types par forme (calculer la mesure, retrouver une cote).
- **Texte / écrire en chiffres ou en lettres** : layout `text` → énoncé au-dessus, trait pleine largeur dessous (`.prompt-stack`).
- **Calculs avec `=`** : énoncé à gauche, trait qui **occupe le reste de la ligne** à droite du `=` (`.eq-row` / `.inline-prompt.equation`).
- Mode `answers` remplit les mêmes emplacements sans changer la mise en page.
- Points d'éval : total dans la consigne / en-tête, pas par question.
- **Alignement du texte** : `text-align: justify` par défaut pour les énoncés, consignes et textes de fiche. Centrer **uniquement** si c’est explicitement demandé (ex. titre centré).

## Espacement fiche (harmonisé)

Variables CSS dans `:root` (`src/App.css`) — ne pas hardcoder d'autres paddings sur `.exercise-item` :

| Variable | Valeur | Rôle |
|---|---|---|
| `--ex-pad-y` | `8px` | Padding vertical de chaque question |
| `--ex-pad-x` | `2px` | Padding horizontal de chaque question |
| `--ex-num-gap` | `8px` | Espace numéro ↔ contenu |
| `--ex-grid-gap` | `12px 16px` | Espacement grille d'exercices |
| `--ex-prompt-gap` | `6px` | Espace énoncé ↔ trait de réponse |
| `--ex-answer-h` | `1.35em` | Hauteur utile du trait de réponse |

Règles :
- `.exercise-item` utilise uniquement `padding: var(--ex-pad-y) var(--ex-pad-x)` et `gap: var(--ex-num-gap)`.
- `.answer-line-field` et `.write-line` : **toujours** `width: 100%` sauf `.compact`.
- Ne pas réintroduire `min-height` fixe ni cadres autour des questions.

## Gabarits

Voir `assets/` pour un squelette de branche générateur et de test de déterminisme.

## Terminé quand

Type visible dans les SelectBox Thème → Type · générateur déterministe · rendu élève/corrigé · page A4 non déformée · lint/build OK.
