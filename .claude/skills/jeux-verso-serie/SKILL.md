---
name: jeux-verso-serie
description: >-
  Harmonise les versos des cartes Jeux (grille de cartes) : logo ClairFLE dans
  un cercle, nom de série optionnel, cadre coloré, même taille recto-verso,
  bordure ludique type carte au recto. À utiliser dès qu’on parle de dos de
  carte, série, verso fiche, Vocabulaire, Dominos, Mémory, Loto, Intrus, Tri.
---

# Verso série Jeux (grille de cartes)

## Principe

Pour **tout** le thème « Grille de cartes » (`jeux-cartes`) :

1. **Recto** : bordure pleine ludique (type carte à jouer), même épaisseur `--game-card-frame` (2,2 mm).
2. **Verso** : logo ClairFLE dans un cercle + nom de série (paramètre optionnel) + cadre coloré.
3. **Même taille** recto / verso : grille `minmax(0,1fr)` + `height:100%` + même `--game-card-frame`.
4. **Miroir bord long** : `mirrorRows(recto, cols)`.

## Types concernés

| Type | Verso |
|---|---|
| Mémory, Intrus, Tri, Dominos | `series-back` (logo + série) |
| Loto | identité série dans chaque panneau verso |
| Vocabulaire | mots + logo + série + cadre (`is-series-content`) |
| Devinettes | indices + logo + série + cadre |

UI : toujours « Nom de la série » + « Cadre de série » (`usesSeriesIdentity`).

## Look recto (cartes)

- Bordure solide `--game-card-frame` (pas seulement des pointillés).
- Coins ~3,2 mm, filet intérieur blanc, fond pastel léger.
- Image en `object-fit: contain` ; badges numérotés ; pas d’emojis.
- Classe `.game-board.is-ludic`.

## Fichiers

- `src/jeux/CardGrid.tsx` — `SeriesIdentity`, variantes
- `src/jeux/generate.ts` — `makeSeriesBackCards`, `mirrorRows`, tous les générateurs cartes
- `src/App.css` — `--game-card-frame`, `.is-ludic`, `.is-series-back`, `.is-series-content`
- `GameContentPanel` / `App.tsx` — `usesSeriesIdentity` (tous les `jeux-cartes`)

## Terminé quand

Tous les types grille de cartes : verso logo+série, recto bordure carte, tailles égales, miroir bord long, skill à jour, lint/build OK.
