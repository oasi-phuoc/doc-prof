---
name: jeux-verso-serie
description: >-
  Harmonise les versos des cartes Jeux (grille de cartes) : logo ClairFLE,
  nom de série, cadre, tailles recto-verso, fond blanc, bordures personnalisées
  optionnelles (15 styles). À utiliser pour dos de carte, série, bordure perso.
---

# Verso série + bordures personnalisées

## Défaut

- Fond **blanc** au recto.
- Cadre plein `--game-card-frame` (2,2 mm) + logo ClairFLE / série au verso.
- Même taille recto / verso ; `mirrorRows` bord long.

## Bordure personnalisée (option)

- Bouton **Bordure personnalisée** dans les paramètres série.
- Par défaut : **Aucune** (cadre actuel).
- 15 styles (`01`–`15`) avec images **recto** et **verso** exactes :
  `public/lib/images/jeux/borders/border-XX-{recto|verso}.webp`
- Catalogue : `src/jeux/borders.ts` (`GAME_BORDER_STYLES`, `gameBorderSrc`).
- Champ config : `gameBorderId` → `GameBoard.borderId` → overlay `.game-card-border`.

## Types grille de cartes

Vocabulaire, Devinettes, Mémory, Loto, Intrus, Dominos, Tri (`usesSeriesIdentity`).

## Fichiers

- `CardGrid.tsx` — overlay bordure selon face
- `GameContentPanel.tsx` — bouton + grille de choix
- `App.css` — `.has-custom-border`, `.game-border-*`
- `generate.ts` — `withBoardBorder`

## Terminé quand

Fond blanc · 15 bordures sélectionnables · défaut inchangé sans bouton · lint/build OK.
