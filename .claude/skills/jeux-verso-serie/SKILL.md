---
name: jeux-verso-serie
description: >-
  Harmonise les versos des cartes Jeux : logo ClairFLE dans un cercle, nom de
  série (paramètre), cadre coloré, alignement recto-verso bord long, look
  ludique au recto. À utiliser dès qu’on parle de dos de carte, série, verso
  fiche, reconnaissance de jeu, logo ClairFLE sur cartes, vocabulaire verso.
---

# Verso série Jeux (logo + nom + cadre)

## Principe

Chaque verso de carte Jeux porte une **identité de série** reconnaissable :

- Cadre coloré (`--series-frame`)
- Logo ClairFLE dans un cercle
- Nom de série (paramètre enseignant·e)
- Contenu pédagogique en plus si besoin (mot, indices)

Variantes :

- **Dos identification** (`variant: 'series-back'`) : cercle logo + `text` = nom de série + `frameColor`.
- **Dos contenu brandé** (`seriesLabel` + `frameColor` sur `word` / `clue`) : même logo + série **et** le contenu pédagogique.
- **Paramètres UI** : `gameSeriesName` · `gameBackColor` (défaut `#0f6b5c`).
- **Pas de `Math.random()`** : ordre verso = `mirrorRows(recto, cols)` pour impression **bord long**.

## Quand l’appliquer

| Type | Verso |
|---|---|
| Mémory, Intrus, Tri | `series-back` (identification seule) |
| Loto (verso grilles) | même identité (logo + série) dans le panneau |
| Vocabulaire | mots + logo + nom de série + cadre (`is-series-content`) |
| Devinettes | indices + logo + nom de série + cadre |
| Dominos (une face) | pas de verso duplex |

Toujours exposer les champs « Nom de la série » + « Cadre de série » pour ces types (`usesSeriesIdentity`).

## Alignement impression

1. Même `cols` × `rows` recto et verso.
2. Même classes de grille (`.game-card-grid`, gap, padding carte).
3. `mirrorRows(cards, cols)` avant de générer les dos.
4. Cartes : `height: 100%`, `min-height: 0`, grille `minmax(0,1fr)` — **même hauteur/largeur** des deux côtés (`.game-board.is-cards`, `.is-memory`, `.is-devinettes`, etc.).

## Look ludique (recto)

- Bords en pointillés de découpe (`.game-card`), coins un peu plus ronds.
- Fond pastel léger (`--jeux-soft` / accent) **sans** porter seul l’info (N&B OK).
- Image en `object-fit: contain` dans un puits arrondi.
- Badges numérotés lisibles ; pas d’emojis.
- Classe `.game-board.is-ludic` sur les grilles concernées.

## Fichiers

- Rendu : `src/jeux/CardGrid.tsx` (`SeriesIdentity`, `series-back`, `is-series-content`)
- Génération : `src/jeux/generate.ts` (`makeSeriesBackCards`, `mirrorRows`, `vocab`, `devinettes`)
- Styles : `src/App.css` (`.game-card.is-series-back`, `.is-series-content`, `.game-series-*`, `.game-board.is-ludic`, `.is-cards`)
- UI : `GameContentPanel` — champs « Nom de la série » + cadre (`usesSeriesIdentity`)
- Types : `gameSeriesName` / `gameBackColor` ; `seriesLabel` / `frameColor` sur `GameCard`

## Terminé quand

Tous les dos duplex partagent logo + série + cadre · contenu pédagogique conservé quand il existe · recto/verso mêmes dimensions · miroir bord long · skill à jour · lint/build OK.
