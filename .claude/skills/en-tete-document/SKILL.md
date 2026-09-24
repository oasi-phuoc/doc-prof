---
name: en-tete-document
description: >-
  Configure ou modifie l'en-tête institutionnel / personnalisé, le pied de page
  A4 et le mode évaluation (points) via PrintDocumentChrome. À utiliser dès qu'on
  parle d'en-tête, logo école, CSC/CFR, footer, points, grille d'évaluation.
---

# En-tête, pied et évaluation

Composants : `src/components/math/PrintDocumentChrome.tsx` · styles `.doc-*` dans `App.css`.

## Modes

| Mode | Composant | Contenu |
|---|---|---|
| Institutionnel | `InstitutionalDocumentHeader` | École, année, org, niveau/classe, cours, lignes Nom/Prénom/Date, grille notes si éval |
| Personnalisé | `CustomDocumentHeader` | Logo texte, titre, sous-titre |
| Pied | `DocumentFooter` | Texte libre + « page i / n », collé en bas via flex |

## Évaluation

- `evalMode` + `pointsPerQuestion` dans `App.tsx`.
- Total = `items.length * pointsPerQuestion` passé à l'en-tête.
- `QuestionPoints` à côté du numéro d'item.

## Règles

- Pied **toujours en bas** de l'A4 (`margin-top: auto`), jamais sous le dernier exercice seulement.
- Grille d'éval lisible N&B (filets noirs).
- Niveaux classe : `CLASS_LEVELS` / `CLASS_NUMBERS` / `COURSES` — étendre là, pas en dur dans le JSX.
- Logo institutionnel : `logoSrc` (chemin, URL ou image chargée). Défaut : blason du Valais (`/lib/logos/etat-du-valais.webp`), remplaçable comme les autres champs.

## Terminé quand

En-tête cohérent · footer bas · points visibles seulement en mode éval · print OK.
