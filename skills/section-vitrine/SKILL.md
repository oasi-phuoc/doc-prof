---
name: section-vitrine
description: Crée ou modifie une section de la page d'accueil du site (hero, bande d'introduction, rangée texte + illustration, bande d'appel final, pied de page) selon la direction visuelle du projet (bandes blanc / gris-bleu clair, titres légers, un seul bouton d'action). À utiliser dès qu'on demande de construire, ajuster ou rédiger une partie de la landing page, de la vitrine ou de la page d'accueil, même sans mention de « section ».
---

# Sections de la page d'accueil

La vitrine s'inspire du rythme d'une landing page de référence (bandes, air, alternance texte / image) **sans en reprendre ni les textes, ni les illustrations, ni la palette exacte**. Chaque section montre une vraie fiche générée par le moteur plutôt qu'un dessin décoratif.

## Structure

- **Bandes** qui alternent fond blanc et fond `bg-band`. Composants `Band` et `Row` (gabarit dans `assets/Section.tsx.tpl`).
- Conteneur `max-w-[1120px]`, marges `px-6` (mobile) et `px-10` (bureau), padding vertical `py-16` (mobile) et `py-24` (bureau).
- **Rangée texte / image** : 12 colonnes, texte sur 5, image sur 6, une colonne libre entre les deux ; on inverse l'ordre une fois sur deux.
- **Hero** : titre léger sur deux lignes, sous-titre court, un bouton principal et un lien secondaire, et à droite une **fiche A4 réelle** légèrement inclinée entourée de pastilles d'exercices en pointillé.
- **Intro** : colonne étroite centrée (titre + un court paragraphe), suivie d'un grand aperçu.
- **Appel final** : une phrase, un bouton.
- **Pied de page** : discret, petit texte gris.

## Typographie et couleur

- Titre du hero : `font-display font-light`, 48 px (36 px sur mobile), interligne 1,15, couleur `text-ink`.
- Titres de rangée : 32 px, poids léger à normal.
- Texte courant : 17 px, interligne 1,75, `text-ink-soft`, 65 caractères de large au maximum.
- **Petit intitulé bleu** (`text-brand-700`) au-dessus d'un titre : en casse de phrase, seulement quand il apporte une information (« Comment ça marche »). Pas d'intitulé par automatisme, pas de capitales espacées.
- Un seul bouton primaire par écran, en `bg-go-700`.

## Ce qu'il ne faut pas faire

- Une grille de cartes identiques avec icône, titre et texte.
- Une animation d'entrée sur chaque section : une seule, sur le hero.
- Reprendre une phrase, un mot d'accroche ou une illustration de la référence.
- Un champ e-mail « liste d'attente » : l'outil est utilisable directement.
- Des chiffres ou témoignages inventés.

## Rédaction

Passer par le skill `texte-interface` pour les textes. Les textes de départ sont dans l'annexe A du plan ; les adapter, ne pas les figer. Vouvoiement, phrases courtes, un verbe d'action.

## Étapes

1. Lire l'annexe A et la maquette du §3.8 du plan (`docs/plan-implementation-fiches-fle-allophones.md`).
2. Créer la section avec `Band` / `Row` ; placer l'illustration ou l'aperçu de fiche dans `media`.
3. Vérifier à 360 px, 768 px, 1440 px : aucun défilement horizontal, texte lisible, image qui ne déborde pas.
4. Vérifier le contraste et la navigation clavier.
5. Contrôler qu'aucun texte n'est repris d'une référence (lecture attentive).

## Terminé quand

Rythme de bandes respecté · un seul appel à l'action visible par écran · responsive vérifié · accessible au clavier · textes originaux relus.
