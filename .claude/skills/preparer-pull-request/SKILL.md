---
name: preparer-pull-request
description: Prépare une pull request propre - exécute lint, types, tests, contrôle des contenus et build, cherche les secrets et les couleurs en dur, vérifie qu'aucun texte n'est copié d'une référence, et rédige la description de la PR avec ce qui a changé et comment le vérifier. À utiliser quand on dit de préparer, ouvrir, finaliser ou relire une pull request, une PR ou une fusion.
disable-model-invocation: true
---

# Préparer une pull request

Ce skill est à lancer explicitement (`/preparer-pull-request`) : il ne doit pas se déclencher tout seul, car il aboutit à une action visible par d'autres.

## Vérifications automatiques

Exécuter dans l'ordre, s'arrêter à la première erreur et la corriger à la source (ne pas contourner) :

1. `npm run lint`
2. `npm run typecheck`
3. `npm test`
4. `npm run check:content`
5. `npm run build`

## Vérifications par recherche dans le code modifié

Regarder le diff (`git diff main...HEAD`) et signaler :

- **Secrets** : clés d'API, jetons, mots de passe ; toute variable `VITE_*` qui contient un secret. Bloquant.
- **Aléatoire non contrôlé** : `Math.random()` ou `Date.now()` dans un générateur. Bloquant.
- **Couleurs en dur** : hexadécimaux dans les composants au lieu des jetons du thème.
- **Chaînes françaises en dur** dans les composants au lieu du dictionnaire.
- **Texte, logo ou illustration copiés d'une référence externe** : relire les textes ajoutés ; en cas de doute, reformuler.
- **Fichiers volumineux** ou images sans licence notée dans `src/content/SOURCES.md`.
- **Données personnelles** dans les exemples (vrais noms, numéros, adresses).

## Si le rendu de la fiche a changé

Lancer le skill `test-impression` et joindre le PDF de référence mis à jour. Si des textes destinés aux apprenant·e·s ont changé, lancer `relecture-linguistique`.

## Description de la PR

Utiliser ce gabarit :

```
## Ce qui change
[2 à 4 lignes, en langage simple]

## Pourquoi
[le besoin ou la phase du plan concernée]

## Comment vérifier
1. […]
2. […]

## Impression
[PDF joint ou « rendu de fiche inchangé »]

## Contenus
[fichiers de src/content modifiés, sources et licences notées, ou « aucun »]

## Points d'attention
[choix discutables, dette, suites prévues]
```

## Terminé quand

Les cinq commandes passent · aucun secret ni aléatoire non contrôlé · aucun texte copié · description complète · captures ou PDF joints si l'interface ou le rendu a changé.
