---
name: jeux-verso-serie
description: >-
  Harmonise les versos des cartes Jeux : logo ClairFLE dans un cercle, nom de
  série (paramètre), cadre coloré, alignement recto-verso bord long, look
  ludique au recto. À utiliser dès qu’on parle de dos de carte, série, verso
  fiche, reconnaissance de jeu, logo ClairFLE sur cartes.
---

# Verso série Jeux (logo + nom + cadre)

## Principe

Toute carte dont le **verso** sert à identifier le jeu (et non à porter un contenu pédagogique image↔mot) utilise le même dos :

```
┌──────────────────┐
│    ┌────────┐    │  cadre coloré (--series-frame)
│    │ ClairFLE│   │  logo dans un cercle
│    └────────┘    │
│   Nom de série   │  texte paramètre enseignant·e
└──────────────────┘
```

- **Contenu** (`variant: 'series-back'`) : cercle logo + `text` = nom de série + `frameColor`.
- **Paramètres** : `gameSeriesName` (libellé) · `gameBackColor` (couleur du cadre, défaut `#0f6b5c`).
- **Pas de `Math.random()`** : ordre verso = `mirrorRows(recto, cols)` pour impression **bord long**.

## Quand l’appliquer

| Type | Verso |
|---|---|
| Mémory, Intrus, Tri | `series-back` (identification de la fiche) |
| Loto (verso grilles) | même identité (logo + série) dans le panneau |
| Vocabulaire, Devinettes | verso = **contenu** (mot / indices) — ne pas remplacer ; même grille et tailles que le recto |
| Dominos (une face) | pas de verso duplex |

## Alignement impression

1. Même `cols` × `rows` recto et verso.
2. Même classes de grille (`.game-card-grid`, gap, padding carte).
3. `mirrorRows(cards, cols)` avant de générer les dos.
4. Cartes : `height: 100%`, `min-height: 0`, grille `minmax(0,1fr)` — **même hauteur/largeur** des deux côtés.

## Look ludique (recto)

- Bords en pointillés de découpe (`.game-card`), coins un peu plus ronds.
- Fond pastel léger (`--jeux-soft` / accent) **sans** porter seul l’info (N&B OK).
- Badges numérotés lisibles ; pas d’emojis.

## Fichiers

- Rendu : `src/jeux/CardGrid.tsx` (`series-back`)
- Génération : `src/jeux/generate.ts` (`makeSeriesBackCards`, `mirrorRows`)
- Styles : `src/App.css` (`.game-card.is-series-back`, `.game-series-*`, `.game-board.is-ludic`)
- UI : `GameContentPanel` — champs « Nom de la série » + cadre
- Types : `gameSeriesName` sur `ExerciseBlock` / `JeuxGenerateOptions`

## Terminé quand

Tous les dos « identification » partagent logo + série + cadre · recto/verso mêmes dimensions · miroir bord long · skill à jour · lint/build OK.
