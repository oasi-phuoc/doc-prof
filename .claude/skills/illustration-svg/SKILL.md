---
name: illustration-svg
description: >-
  Dessine ou corrige une figure géométrie cotée, une grille de repérage ou un
  motif SVG scolaire (GeometryFigure, CoordGrid) lisible en N&B. À utiliser dès
  qu'on parle de figure, côtés, cotes, triangle, trapèze, parallélogramme,
  repérage, SVG pédagogique.
---

# Figures SVG scolaires

Deux composants pivots :

- `src/components/math/GeometryFigure.tsx` — formes cotées (rectangle, triangle, trapèze, parallélogramme, solides schématiques…).
- `src/components/math/CoordGrid.tsx` — repérage dans le plan.

## Règles

- Contour foncé régulier, **pas de dégradé**, pas d'ombre, texte de cote en `currentColor`.
- Cotes **lisibles en N&B** ; jamais une info portée par la seule couleur.
- Dimensions depuis `FigureDims` (`length`, `width`, `base`, `top`, `bottom`, `triangleKind`…).
- Triangles : varier `equilateral` | `isosceles` | `scalene` | `right` via le générateur.
- **Ne pas copier** une figure d'un site tiers : même esprit scolaire, géométrie recalculée.

## Étapes

1. Confirmer la `Figure` dans `types.ts` et les dims produites par `generate.ts`.
2. Étendre le switch de `GeometryFigure` (paths + labels).
3. Styles labels : `.geometry-figure .dim-label` dans `App.css`.
4. Vérifier en mode élève (figure seule) et corrigé (si annotations).
5. Contrôle A4 : la figure ne doit pas faire déborder la feuille (largeur ~170 px typique).

## Terminé quand

Figure cotée correcte · N&B · dims cohérentes avec la réponse · pas de copie externe.
