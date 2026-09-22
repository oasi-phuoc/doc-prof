---
name: contenu-catalogue
description: >-
  Ajoute ou corrige des thèmes et types dans src/math/catalog.ts (labels,
  consignes, preferredColumns, figures). À utiliser dès qu'on parle de catalogue,
  thème, type d'exercice, domaine algèbre/géométrie, sans toucher encore au
  générateur — ou pour aligner les libellés du sélecteur.
---

# Catalogue maths

Source de vérité : `src/math/catalog.ts` (+ types dans `types.ts`).

## Contenu d'un type

```ts
t(
  'id-kebab',
  'topicId',
  'Libellé court',
  'Description pour l’enseignant·e.',
  'Consigne élève (vouvoiement, un verbe).',
  'ligne' | 'trou' | 'colonne' | 'colonne-vide' | 'texte' | 'geo' | 'suite',
  { preferredColumns?: number; figure?: Figure },
)
```

## Règles

- `topic` doit exister dans `topics` (même `domain`).
- `instruction` : une action, français scolaire clair (voir `relecture-enonce`).
- `preferredColumns` : 1 pour problèmes / division / géométrie dense ; 2 pour colonnes simples.
- Ne pas dupliquer un id existant.
- Après ajout catalogue seul, le type apparaît dans l’UI mais **reste inerte** tant que `generate.ts` n’a pas de branche → enchaîner `nouvel-exercice`.

## Thèmes actuels (repère)

Algèbre : nombres, addition, soustraction, estimation, multiplication, division, problèmes, multiples, fractions, décimaux, proportionnalité, relatifs, puissances, expressions, équations.  
Géométrie : figures, conversions, périmètres, aires, volumes, repérage, transformations.

## Terminé quand

Entrées cohérentes · visibles dans SelectBox · consignes relues.
