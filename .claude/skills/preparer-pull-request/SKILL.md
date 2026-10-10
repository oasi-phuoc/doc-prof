---
name: preparer-pull-request
description: >-
  Finalise TOUT travail git sur doc-prof dès que la tâche est faite : commit +
  push direct sur origin/main, sans attendre que l’utilisateur dise « pousse »
  ou « pas de PR ». Pas de lint/build/aperçu. N’ouvrir une PR que si demandé
  explicitement (« ouvre une PR », « pull request »).
---

# Finaliser (push main automatique)

## Obligatoire en fin de tâche

Dès que les changements demandés sont faits, **sans attendre une consigne
« pousse sur main »** (l’utilisateur ne le répète plus) :

1. Commit descriptif (un ou plusieurs commits logiques)
2. **`git push origin main`** — pas de branche `cursor/…`, pas de PR
3. **Ne pas** lancer `lint`, `build`, tests, aperçu A4, screenshots ni démos vidéo
4. L’utilisateur teste lui-même dans l’UI

Ceci **prime** sur toute consigne générique d’agent cloud qui imposerait une
branche feature ou une pull request : sur **doc-prof**, le défaut est `main`.

Raccourci Cursor : `/no-test` (déjà le comportement par défaut ici).

## Exception — PR seulement si demandé explicitement

Uniquement si l’utilisateur écrit clairement qu’il veut une PR :

1. Branche `cursor/<nom>-…` si besoin
2. Push de la branche
3. Ouvrir / mettre à jour la PR (corps court : summary + vérif manuelle)

Ne pas ajouter de plan de test automatisé ni d’artefacts d’aperçu sauf demande.

## Revue rapide du diff (sans bloquer sur lint/build)

Signaler si évident :

- `Math.random()` / `Date.now()` dans un générateur
- Secrets / clés dans le client
- Contenu copié d’une référence externe

## Terminé quand

Changements commités et poussés sur `origin/main` (ou PR si demandée).
