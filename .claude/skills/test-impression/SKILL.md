---
name: test-impression
description: >-
  Garantit que la fiche reste une page A4 fixe à l'écran et à l'impression :
  cadre .a4-frame (210×297), overflow hidden, mêmes WorksheetSheet en preview et
  print-only-sheets, pied en bas, N&B. À utiliser après toute modif de rendu /
  CSS d'impression / densité d'exercices, ou dès qu'on parle d'A4, marges, PDF,
  aperçu qui grandit ou rétrécit.
---

# Aperçu A4 fixe et impression

Le produit est la feuille **210 × 297 mm**. Le nombre de questions ne doit **jamais** changer la taille du cadre d'aperçu.

## Règles CSS (source de vérité : `src/App.css`)

```
.a4-frame          → aspect-ratio 210/297, overflow:hidden, container-type
.a4-frame .worksheet-sheet → 210mm × 297mm absolu + scale(100cqw/210mm)
.worksheet-sheet   → height/max-height 297mm, overflow:hidden, flex colonne
.sheet-body        → flex:1 ; overflow:hidden
.doc-footer        → margin-top:auto
@media print       → .print-only-sheets visibles ; .sheet-preview-wrap masqué
```

Interdit :
- `min-height` flexible qui fait grandir la feuille avec le contenu
- `transform: scale(...)` mobile sur `.worksheet-sheet` hors du scale du `.a4-frame`
- Cadres / cartes autour des `.exercise-item`

## Checklist écran

- [ ] Le cadre d'aperçu garde le ratio A4 si on passe de 4 à 20 questions.
- [ ] Trop de contenu → coupé / dense, **pas** d'agrandissement du cadre.
- [ ] Peu de contenu → pied de page toujours en bas de la feuille.
- [ ] Navigation pages = numéros seuls (rail), sans changer la taille A4.
- [ ] Modes Fiche élève / Corrigé : même chrome, mêmes emplacements.

## Checklist impression

- [ ] `@page { size: A4 portrait; margin: 0 }`
- [ ] Les feuilles viennent de `.print-only-sheets` (toutes les pages), pas du seul aperçu.
- [ ] En-tête institutionnel ou personnalisé lisible ; footer en bas.
- [ ] Colonnes, division posée, figures cotées lisibles en N&B.
- [ ] Soulignés de réponse visibles ; pas d'info portée par la seule couleur.

## Script optionnel

Gabarit : `scripts/print-check.ts.tpl` (Playwright PDF). Copier vers `tests/print/` si le projet a Playwright ; sinon validation manuelle Chrome → Imprimer → PDF.

## Rapport

```
Aperçu : cadre fixe A4 ✔/✘
Overflow contenu dense : masqué sans resize ✔/✘
Print : N pages, footer bas, N&B ✔/✘
Action : …
```

## Terminé quand

Aperçu stable · print-only cohérent · aucune règle CSS qui fait varier la hauteur de feuille avec le contenu.
