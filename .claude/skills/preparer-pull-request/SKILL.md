---
name: preparer-pull-request
description: >-
  Finalise le travail git sur doc-prof : commit et push. Par défaut push
  direct sur origin/main sans lint/build/aperçu. N’ouvrir une PR que si
  demandé explicitement.
---

# Finaliser (push main)

## Défaut (doc-prof)

Sauf demande explicite contraire :

1. Commit descriptif
2. **Push direct sur `origin/main`** (pas de branche feature, pas de PR)
3. **Ne pas** lancer `lint`, `build`, tests, aperçu A4, screenshots ni démos vidéo
4. L’utilisateur teste lui-même dans l’UI

Raccourci Cursor : `/no-test` (déjà le comportement par défaut ici).

## Si l’utilisateur demande une PR

Alors seulement :

1. Branche `cursor/<nom>-…` si besoin
2. Push de la branche
3. Ouvrir / mettre à jour la PR (corps court : summary + comment vérifier à la main)

Ne pas ajouter de plan de test automatisé ni d’artefacts d’aperçu sauf demande.

## Revue rapide du diff (sans bloquer sur lint/build)

Signaler si évident :

- `Math.random()` / `Date.now()` dans un générateur
- Secrets / clés dans le client
- Contenu copié d’une référence externe

## Terminé quand

Changements commités et poussés sur `origin/main` (ou PR si demandée).
