---
name: section-vitrine
description: >-
  Crée ou modifie une section de la page d'accueil (hero, bande méthode, sujets
  maths, appel à créer une fiche) dans App.tsx / App.css. À utiliser dès qu'on
  parle de landing, vitrine ou page d'accueil.
---

# Page d'accueil

La landing vit dans `App.tsx` (vue non-générateur) + styles `App.css`. Elle mène vers le générateur de fiches maths.

## Structure attendue

- **Hero** : marque / promesse, une phrase, CTA « Créer une fiche », visuel évoquant une feuille A4 (pas une grille de cartes).
- **Méthode / bénéfices** : bandes simples, un message par bande.
- **Pas de section sujets** en cartes si elle a été retirée volontairement — ne pas la réintroduire sans demande.
- **Pied** discret.

## Règles

- Une composition claire au premier écran ; un seul CTA primaire.
- Pas de témoignages ou stats inventés.
- Textes via skill `texte-interface` (vouvoiement, casse de phrase).
- Ne pas coller le design d'un concurrent.

## Terminé quand

Landing cohérente · CTA vers le générateur · textes relus.
