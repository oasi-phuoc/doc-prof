---
name: illustration-svg
description: Dessine ou ajoute une illustration de vitrine, un pictogramme de consigne (entourer, colorier, écrire, relier, cocher…), une pastille d'exercice ou un motif décoratif en SVG dans le style du projet (plat, contour régulier, pastels). À utiliser dès qu'on demande une illustration, une icône, un pictogramme, un visuel pour la page d'accueil, un motif ou un badge, même si la demande ne mentionne pas SVG.
---

# Illustrations et pictogrammes SVG

Le projet a un style unique : plat, contour foncé régulier, remplissages pastel, aucun dégradé. Il y a deux familles à ne pas mélanger :

- **Pictogrammes de consigne** : petits (≈ 48 px), sur la fiche imprimée, doivent rester lisibles en noir et blanc.
- **Illustrations de vitrine** : grandes, sur le site seulement, personnages adultes et divers.

Les images pédagogiques des mots (banque d'images des fiches) relèvent du skill `contenu-linguistique`, pas de celui-ci.

## Règles de style

- `viewBox="0 0 96 96"` pour les pictogrammes, affichés à 48 px : `strokeWidth={4}` donne un contour visuel de 2 px.
- Contour `var(--color-stroke)`, `strokeLinecap="round"`, `strokeLinejoin="round"`, `fill="none"` sur le groupe, remplissage pastel via les jetons (`--color-tint-violet`, `-rose`, `-orange`, `-green`).
- **Pas de dégradé, pas d'ombre, pas de texte dans le SVG** (le texte est traduisible et accessible en HTML).
- Formes simples : une idée par pictogramme, 3 à 6 éléments maximum.
- Pictogrammes de consigne : même pastille circulaire de fond et mêmes proportions pour tout le jeu, de façon à ce qu'ils forment une famille.
- Personnages (vitrine) : adultes, corps et âges variés, tenues neutres, aucun stéréotype ; jamais de personnage de marque ou de licence.
- **Ne rien décalquer ni redessiner à l'identique d'une référence externe** : on s'inspire d'un style, on ne copie pas une œuvre.

## Étapes

1. Décrire en une phrase ce que le dessin doit faire comprendre (pour un pictogramme : l'action de l'apprenant·e, par exemple « entourer une lettre »).
2. Copier `assets/Pictogram.tsx.tpl` vers `src/components/pictograms/Picto<Nom>.tsx`, remplacer `__Name__`.
3. Dessiner dans le cadre `96 × 96` ; garder au moins 6 unités de marge dans la pastille.
4. Exporter le composant dans `src/components/pictograms/index.ts` et l'ajouter au registre par clé (`entourer`, `colorier`…), utilisée par `Consigne`.
5. Contrôler : à 24 px, en niveaux de gris, en inversé. Si l'idée n'est plus lisible, simplifier.
6. Ajouter à la page de démonstration des pictogrammes.

## Jeu de pictogrammes de consigne à couvrir

entourer · colorier · écrire · relier · cocher · souligner · barrer · observer · écouter · parler · numéroter · compléter · classer · associer · coller · découper

Chaque pictogramme montre l'**outil ou le geste**, pas la notion abstraite (un crayon qui trace un cercle pour « entourer », des ciseaux pour « découper »).

## Accessibilité

- Pictogramme décoratif (à côté d'une consigne écrite) : `aria-hidden`, pas de `title`.
- Pictogramme porteur de sens seul : `role="img"` et `<title>` en français.
- Ne jamais coder une information uniquement par la couleur du pastel.

## Terminé quand

Lisible à 24 px et en niveaux de gris · même style que le reste du jeu · exporté dans le registre · visible dans la page de démonstration · aucune source externe reproduite.
