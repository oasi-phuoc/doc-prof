---
name: preparer-pull-request
description: >-
  Prépare une pull request : lint, build, contrôle déterminisme / A4 / copies,
  rédaction du corps de PR. À utiliser quand on dit préparer, ouvrir ou
  finaliser une PR.
disable-model-invocation: true
---

# Préparer une pull request

Lancer explicitement (`/preparer-pull-request`).

## Vérifications

Dans l'ordre :

1. `npm run lint`
2. `npm run build`

Si des tests Vitest existent pour le générateur : les lancer aussi.

## Revue du diff

Signaler / bloquer :

- `Math.random()` ou `Date.now()` dans `src/math/generate.ts` (ou helper de tirage).
- Feuille A4 qui redevient fluide (`min-height` content-driven, scale mobile hors `.a4-frame`).
- Cadres / boîtes de réponse réintroduits à la place des soulignés.
- Texte, logo ou figure **copiés** d'une référence externe.
- Secrets / clés dans le client.

Si le rendu fiche a changé → skill `test-impression`.  
Si consignes / problèmes ont changé → skill `relecture-enonce`.

## Corps de PR

```markdown
## Summary
- …

## Test plan
- [ ] npm run lint && npm run build
- [ ] Aperçu A4 stable (peu / beaucoup de questions)
- [ ] Impression PDF : en-tête, footer bas, corrigé
- [ ] …
```

## Terminé quand

Checks verts · description claire · pas de secret · A4 respecté.
