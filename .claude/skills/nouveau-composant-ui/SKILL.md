---
name: nouveau-composant-ui
description: Crée ou modifie un composant d'interface réutilisable (Button, Field, Select, Toggle, Tabs, Alert, LevelPicker, Sheet, Modal, Toast…) dans src/components/ui avec Tailwind v4 et les jetons du thème du projet. À utiliser dès qu'on demande d'ajouter, créer, styler ou corriger un composant, un bouton, un champ de formulaire, un panneau ou tout élément d'interface, même sans le mot « composant ».
---

# Créer un composant d'interface

Le design du site repose sur peu de composants, très cohérents : bandes claires, texte posé directement sur le fond, un seul bouton d'action. L'objectif est qu'un nouveau composant soit correct (accessible, thémable) dès la première version.

## Étapes

1. Vérifier qu'un composant existant ne couvre pas déjà le besoin (`src/components/ui/`). Préférer une variante ou une propriété à un nouveau composant.
2. Copier `assets/Component.tsx.tpl` et `assets/Component.test.tsx.tpl` dans `src/components/ui/`, retirer `.tpl`, remplacer `__Name__`.
3. Construire avec les **jetons** ci-dessous, jamais avec une couleur hexadécimale.
4. Couvrir les états : normal, survol, focus visible, désactivé, erreur (`aria-invalid` + message relié par `aria-describedby`).
5. Écrire les tests (rendu, interaction clavier, axe).
6. Ajouter le composant à la page de démonstration (`/dev/composants`) pour le voir dans tous ses états.

## Jetons du thème (Tailwind v4, `src/styles/index.css`)

| Usage | Classes |
|---|---|
| Texte | `text-ink`, `text-ink-soft` |
| Filets, bordures | `border-line` |
| Fond de bande | `bg-band` |
| Bleu (texte, liens, intitulés) | `text-brand-700` ; aplats et focus : `brand-500` |
| Bouton principal | `bg-go-700 text-white` (contraste ≈ 4,7:1) |
| Pastels d'exercices | `bg-tint-violet`, `bg-tint-rose`, `bg-tint-orange`, `bg-tint-green` |
| Rayons | `rounded-control` (6 px), `rounded-preview` (16 px) |
| Ombre de feuille A4 | `shadow-paper` (réservée aux feuilles) |
| Polices | `font-display` (titres), `font-sans` (interface), `font-sheet` (feuille imprimée) |

## Règles

- **Cible tactile ≥ 44 px** (`min-h-11`).
- **Focus visible** sur tout élément interactif : contour `brand-500`, décalé.
- **Clavier** : tout se fait sans souris ; ordre de tabulation logique ; Échap ferme les modales.
- **Libellés** : chaque champ a un `<label>` visible ; jamais de placeholder en guise de libellé.
- **Pas de grille de cartes identiques** ni d'ombre décorative : le style repose sur l'air et les bandes.
- **Mouvement** : transitions courtes qui répondent à une action ; respecter `prefers-reduced-motion`.
- **Textes** : aucune chaîne française écrite dans le composant ; elle arrive par props ou par le dictionnaire i18n (voir `texte-interface`).
- **Impression** : les composants de l'application portent `print:hidden` ou sont dans un conteneur qui le porte ; seuls les composants de la feuille (`PrintSheet`, `Consigne`…) s'impriment.

## Pièges fréquents

- Utiliser `outline-none` sans remplacement du focus.
- Régler la couleur avec un hexadécimal « pour aller plus vite » : ajouter plutôt un jeton dans `@theme`.
- Un composant qui décide de sa marge extérieure : laisser la marge au parent.
- Oublier l'état vide et l'état d'erreur.

## Terminé quand

Rendu correct à 360 px et à 1440 px · navigable au clavier · aucune violation axe · test écrit · visible dans la page de démonstration · aucune couleur en dur.
