---
name: nouveau-composant-ui
description: >-
  Crée ou modifie un contrôle du générateur (SelectBox, toggle mode/éval,
  onglets pages, champs en-tête, boutons) dans App.tsx / App.css selon le style
  actuel. À utiliser dès qu'on demande d'ajouter, styler ou corriger un
  composant, bouton, select, panneau ou élément d'interface.
---

# Contrôles d'interface du générateur

L'UI vit surtout dans `src/App.tsx` + `src/App.css` (pas encore une lib `components/ui/` complète). Préférer étendre les patterns existants.

## Patterns à réutiliser

| Besoin | Pattern |
|---|---|
| Liste déroulante | `SelectBox` (Domaine / Thème / Type / Niveau / Questions) |
| Binaire | `.mode-toggle` (Exercice / Évaluation, Institutionnel / Personnalisé, Fiche élève / Corrigé). Le bouton **actif** est à la couleur du thème (`--purple`). |
| Trois choix | `.mode-toggle.is-3` (Voc / Gram / Com, Colonnes 1 / 2 / 3). Pas de toggle Colonnes pour un tableau Gattegno (`isPhraseChart`) : un seul tableau. |
| Pages / exercices | `.mode-toggle.is-tabs` (chiffres centrés). Croix `×` sur l’onglet actif. **+ Page** / **+ Exercice** : `.page-structure-actions`. |
| Couleur du thème | Cercles sous « En-tête et pied de page » (`theme-color-block`). Met à jour `--purple` (et `--lavender` via `color-mix`). |
| Actions | `.button` / `.button.secondary` |
| Champs en-tête | `.custom-header-form` / champs institutionnels dans le panneau |

## Règles

- **Hiérarchie panneau** : Domaine → Thème → Type → **Niveau** (Facile / Moyen / Avancé) → Questions ; pas de grille de cartes de types.
- Cible tactile confortable (~44 px) ; focus visible.
- Libellés visibles (pas de placeholder seul).
- Français, casse de phrase ; skill `texte-interface` pour le wording.
- Ne pas casser le cadre A4 (`.a4-frame`) en ajoutant du layout dans `.sheet-stage`.

## Variables thème (`:root` dans App.css)

`--ink`, `--muted`, `--line`, `--paper`, `--lavender`, `--purple`, `--blue`, `--green`, `--orange`, `--red`, `--rose`, `--cream`

## Étapes

1. Chercher un contrôle existant proche.
2. Ajouter le markup dans le panneau settings de `App.tsx`.
3. Styler dans `App.css` en réutilisant classes (`.select-control`, `.mode-toggle`…).
4. Brancher l'état (page active, seed, header, eval…).
5. `npm run lint` · `npm run build`.

## Terminé quand

Contrôle accessible · cohérent avec les SelectBox existants · sans régression A4.
