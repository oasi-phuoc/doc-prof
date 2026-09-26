# ClairFLE Maths — générateur de fiches de maths imprimables

Site où des enseignant·e·s composent des fiches de travail A4 imprimables (avec corrigé) : français (grammaire, vocabulaire, communication), algèbre et géométrie. Tirage déterministe par graine, rendu type cahier scolaire (colonnes, fractions, figures cotées, division posée). Le plan des fiches FLE est dans `docs/plan-fiches-FLE.md`.

## Stack et commandes

React + Vite + TypeScript. Styles principaux dans `src/App.css` (variables CSS du thème). Génération pure dans `src/math/` (maths) et `src/francais/` (FLE / phrase / lecture).

- `npm run dev` · `npm run build` · `npm run lint`
- Si un script utile manque, le créer plutôt que le contourner.

## Architecture

| Zone | Rôle |
|---|---|
| `src/math/catalog.ts` | Domaines, thèmes (`topics`), types d'exercices (`exerciseTypes`). Français : thèmes communicatifs + `track` Voc/Gram/Com |
| `src/math/generate.ts` | `buildPage(config, seed)` → `WorksheetPage` (pur, via `rng`) ; délègue au français via `@/francais/*` |
| `src/math/` | Générateurs maths (algèbre, géométrie, repérage, `rng`, `types`, `difficulty`) |
| `src/francais/` | Générateurs et banques FLE : Voc/Gram/Com, Phrase, Lecture, nombres en lettres |
| `src/jeux/` | Fiches-jeux (templates cartes / plateaux / étiquettes) — planning `docs/plan-domaine-jeux.md` |
| `src/math/rng.ts` | `createRng`, `int`, `pick`, `shuffle` — jamais `Math.random()` dans un générateur |
| `src/math/types.ts` | `Layout`, `MathItem`, `PageConfig`, `WorksheetPage`… |
| `src/components/ItemView.tsx` | Rendu d'un item selon `layout` (élève / corrigé) — maths et français |
| `src/components/math/PrintDocumentChrome.tsx` | En-tête institutionnel / personnalisé, pied, points d'éval |
| `src/components/math/GeometryFigure.tsx`, `FractionView.tsx`, `CoordGrid.tsx` | Visuels scolaires |
| `src/App.tsx` | Générateur UI : SelectBox Domaine → Thème → Type, pages, aperçu |
| `src/App.css` | Feuille A4 fixe, layouts école, impression |

## Principes non négociables

1. **La feuille A4 est le produit.** Aperçu (`.a4-frame`) et impression (`.print-only-sheets`) partagent le même `WorksheetSheet`. Taille fixe **210 × 297 mm** : ni agrandissement ni rétrécissement selon le nombre de questions (`overflow: hidden`).
2. **Déterministe d'abord.** Un tirage est une fonction pure de `(PageConfig, seed)` via `createRng(seed)`. Jamais de `Math.random()` / `Date.now()` dans `generate.ts`.
3. **Une fiche = une recette** (config de page + graine), pas seulement un résultat.
4. **Rendu scolaire, pas carte app.** Pas de cadres autour des questions ; numéros simples ; réponses en soulignés (`.answer-line-field` **pleine largeur** par défaut), pas en boîtes. Textes justifiés sauf centrage demandé explicitement.
5. **Lisible en noir et blanc.** La couleur ne porte jamais seule une information.
6. **Rien n'est copié d'une référence externe** (textes, logos, figures). On reprend l'esprit, pas les éléments.
7. **Pied de page en bas de l'A4** (`margin-top: auto` sur `.doc-footer` dans un flex colonne).

## Conventions de code

- TypeScript strict, alias `@/` pour `src/`.
- Styles fiche : classes dans `src/App.css` ; variables `:root` (`--ink`, `--purple`, …). Pas de hex « magiques » nouveaux hors thème déjà présent.
- Nouveau type d'exercice = entrée dans `catalog.ts` + branche dans `generate.ts` + rendu dans `ItemView` si le `layout` n'existe pas encore.
- Une page peut contenir plusieurs types (`extraBlocks`). Titres **Exercice 1, 2…** chronologiques ; consigne sous le titre, sans cadre.
- Français (Suisse romande pour les nombres en lettres : `french-numbers.ts`).

## Quel skill utiliser

| Tâche | Skill |
|---|---|
| Ajouter un type d'exercice maths | `nouvel-exercice` |
| Composer une série multi-pages | `nouvelle-unite` |
| Modifier l'UI du générateur / contrôles | `nouveau-composant-ui` |
| En-tête institutionnel, pied, mode éval | `en-tete-document` |
| Figure SVG cotée ou grille | `illustration-svg` |
| Section de la page d'accueil | `section-vitrine` |
| Textes de l'interface | `texte-interface` |
| Enrichir catalogue thèmes / types | `contenu-catalogue` |
| Relire énoncés et consignes | `relecture-enonce` |
| Phrases Gattegno (modèles uniques, français réel) | `phrase-gattegno` |
| Compréhension écrite A1/A2/B1 (CECRL / FALC) | `comprehension-ecrite` |
| Verso cartes Jeux (logo ClairFLE, série, cadre) | `jeux-verso-serie` |
| Aperçu A4 fixe + impression | `test-impression` |
| Préparer une pull request | `preparer-pull-request` |

## Terminé, c'est quand

Lint et build passent ; l'aperçu reste A4 quelle que soit la densité ; l'impression utilise les mêmes feuilles ; rien n'est copié d'une référence ; la description de la PR liste ce qui a changé et comment le vérifier.
