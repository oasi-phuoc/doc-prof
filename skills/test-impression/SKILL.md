---
name: test-impression
description: Vérifie qu'une fiche ou une unité s'imprime correctement en A4 - génère le PDF avec Playwright, contrôle le nombre de pages, les débordements de marge, les coupures d'exercices, le chargement des polices, le rendu en noir et blanc, et guide le test sur une vraie imprimante. À utiliser après toute modification du rendu de la feuille, d'un exercice, du lignage, des polices ou du CSS d'impression, et dès qu'on parle d'impression, de PDF, de marges, de coupures de page ou de débordement.
---

# Test d'impression

Le produit est la feuille imprimée. Un aperçu correct à l'écran ne garantit rien : marges de l'imprimante, coupures de page et polices peuvent tout changer. Ce test attrape les problèmes **avant** qu'un·e formateur·trice ne les voie sur papier.

## Étapes

1. **Lancer l'application** (`npm run dev`) et repérer l'URL d'une fiche à imprimer (recette dans l'URL, ou vue d'impression dédiée).
2. **Exécuter le script** `scripts/print-check.ts.tpl` (copié dans `tests/print/print-check.ts`) :
   `npx tsx tests/print/print-check.ts "<url>" --pages 2`
   Dépendances : `npm i -D @playwright/test pdf-lib tsx` puis `npx playwright install chromium`.
3. **Lire le rapport** : nombre de pages, éléments qui dépassent la zone imprimable, exercices coupés, polices non chargées.
4. **Corriger** la cause à la source (CSS d'impression, taille de bloc, nombre d'items), pas en ajoutant des marges au hasard.
5. **Refaire le test** jusqu'à zéro alerte, puis mettre à jour la référence dans `tests/print-baselines/`.
6. **Vérifier à la main** avec la checklist ci-dessous, au moins une fois par phase du plan.

## Ce que le script contrôle

- Le PDF est produit en A4, `printBackground: true`, taille de page CSS respectée.
- **Nombre de pages** égal à celui attendu (`--pages`).
- **Débordement horizontal** : aucun élément ne dépasse de la zone imprimable (marge de sécurité de 12 mm).
- **Exercices coupés** : un `.exercise` ne doit pas franchir une limite de page.
- **Polices** : toutes chargées avant l'impression (`document.fonts.ready`), aucune police de secours inattendue.

## Checklist manuelle (PDF et papier)

- [ ] Marges régulières, rien de coupé sur les bords.
- [ ] Aucune coupure au milieu d'un exercice ; titre d'exercice jamais seul en bas de page.
- [ ] Polices correctes (Andika ou celle choisie), tailles conformes à la densité.
- [ ] Lignes d'écriture nettes et de la bonne hauteur ; espaces de réponse assez grands.
- [ ] **Noir et blanc** : la fiche reste utilisable, aucune information portée par la seule couleur.
- [ ] Images et pictogrammes nets à l'impression.
- [ ] Le corrigé commence sur une nouvelle page et n'apparaît pas dans la version apprenant·e.
- [ ] **Test sur une vraie imprimante de bureau**, papier standard : zones non imprimables, lisibilité, densité de l'encre.
- [ ] Contrôle dans Chrome, Firefox, Safari et Edge (« Enregistrer en PDF »).

## Rapport à donner

```
Fiche : <nom ou URL> · Navigateur : Chromium
Pages : 2 (attendu 2) ✔
Débordements : aucun ✔
Exercices coupés : Ex. 3 (page 1 → 2) ✘  → cause probable : hauteur > espace restant, ajouter break-inside: avoid
Polices : Andika chargée ✔
Prochaine action : …
```

## Pièges fréquents

- Tester en aperçu écran sans `emulateMedia({ media: "print" })`.
- Corriger un débordement en réduisant la taille du texte : ce n'est pas un réglage de fiche pour un public en apprentissage de la lecture.
- Oublier d'attendre le chargement des polices : le PDF utilise alors une police de secours.
- Se fier à la seule impression PDF : l'imprimante réelle a des marges non imprimables.

## Terminé quand

Zéro alerte sur le script · checklist cochée · PDF de référence mis à jour · test papier fait pour les changements de fond.
