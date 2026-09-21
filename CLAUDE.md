# [Nom] — générateur de fiches de FLE imprimables

Site où des formateurs·trices de français langue étrangère composent des fiches de travail A4 imprimables (avec corrigé) pour des apprenant·e·s allophones, du pré-alpha au B2.
Le plan complet est dans `docs/plan-implementation-fiches-fle-allophones.md` : le consulter avant toute décision d'architecture, de design ou de contenu.

## Stack et commandes

React + Vite + TypeScript, Tailwind CSS v4 (plugin `@tailwindcss/vite`, thème dans `src/styles/index.css`), Zustand, React Hook Form + Zod, Dexie (IndexedDB), Vitest, Playwright.

- `npm run dev` · `npm run build` · `npm run lint` · `npm run typecheck` · `npm test` · `npm run check:content`
- Si un de ces scripts n'existe pas encore, le créer plutôt que le contourner.

## Principes non négociables

1. **La feuille A4 est le produit.** Aperçu et impression utilisent le même rendu (`PrintSheet`).
2. **Déterministe d'abord.** Un générateur est une fonction pure de `(params, rng, ctx)`. Jamais de `Math.random()`, jamais de `Date.now()` dans un générateur.
3. **Une fiche = une recette** (paramètres + graine + retouches), pas seulement un résultat.
4. **Aucune donnée personnelle sur les apprenant·e·s.** Prénoms fictifs et variés dans tous les exemples.
5. **Le niveau est vérifié.** Tout texte affiché à un·e apprenant·e passe par le contrôle de niveau (`src/lib/level-check.ts`).
6. **La couleur ne porte jamais seule une information** ; toute fiche reste lisible en noir et blanc.
7. **Aucun secret dans le code client.** Jamais de clé dans une variable `VITE_*` ; les appels d'IA passent par une fonction serverless.
8. **Rien n'est copié d'une référence externe** (textes, logos, illustrations). On reprend l'esprit d'une inspiration, pas ses éléments.

## Conventions de code

- TypeScript strict, alias `@/` pour `src/`.
- Styles : classes Tailwind avec les **jetons du thème** (`text-ink`, `bg-band`, `bg-go-700`, `rounded-control`…). Aucune couleur hexadécimale en dur dans un composant.
- Composants d'interface dans `src/components/ui/`, pictogrammes dans `src/components/pictograms/`, illustrations de vitrine dans `src/components/illustrations/`.
- Un type d'exercice = un dossier dans `src/features/exercises/<kind>/`, enregistré dans `registry.ts`.
- Toutes les chaînes affichées passent par le dictionnaire i18n ; français sans exception au départ.

## Conventions de contenu

- Français, vouvoiement, casse de phrase, écriture inclusive avec point médian (« apprenant·e·s »).
- Un verbe d'action par consigne ; mêmes verbes d'une fiche à l'autre.
- Données linguistiques dans `src/content/` avec licence et source dans `src/content/SOURCES.md`.

## Quel skill utiliser

| Tâche | Skill |
|---|---|
| Ajouter un type d'exercice | `nouvel-exercice` |
| Composer une unité (séquence de fiches) | `nouvelle-unite` |
| Créer ou modifier un composant d'interface | `nouveau-composant-ui` |
| Dessiner une illustration, un pictogramme, un motif | `illustration-svg` |
| Créer ou modifier une section de la page d'accueil | `section-vitrine` |
| Écrire ou relire les textes de l'interface | `texte-interface` |
| Ajouter ou importer lexique, graphèmes, consignes, documents fictifs | `contenu-linguistique` |
| Relire une fiche ou un jeu de contenus (niveau, consignes, neutralité) | `relecture-linguistique` |
| Vérifier qu'une fiche s'imprime bien en A4 | `test-impression` |
| Préparer une pull request | `preparer-pull-request` |

## Terminé, c'est quand

Lint, types, tests et `check:content` passent ; la fiche s'imprime correctement (skill `test-impression`) ; les textes ont été relus ; rien n'est copié d'une référence ; la description de la PR liste ce qui a changé et comment le vérifier.
