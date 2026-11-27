# Recettes enregistrées, référence L0

L’inventaire du commit `e72ec7c24` couvre la génération et les contrôles de lecture. La [lecture client](../../src/fiches/recipe.ts) accepte la recette version 1, valide la graine et les pages, migre les anciens identifiants TPM et TPF et normalise certaines configurations historiques Gattegno et Grammaire. Elle conserve `libreMode` et `libreSnapshot` et valide les pages de l’instantané. Les remplacements d’images chargés par le parseur viennent de `/lib/images/`. À l’écriture, les pages et l’instantané sont figés via les fonctions de Grammaire et de Logistique.

Le [Worker de fiches](../../api/fiches/src/index.ts) lit la recette version 1 avec 1 à 60 pages et un instantané Libre de 60 pages au maximum. La limite actuelle du corps est de 800 000 unités de chaîne JavaScript, mesurées après `request.text()`. Le Worker vérifie également les droits du compte et les domaines Logistique autorisés. La validation client applique la limite de 60 pages aux pages principales et vérifie la structure des pages de l’instantané. L’écart sur la limite de l’instantané constitue un cas à tester en reprise et en synchronisation.

| Cas | Preuve | État |
|---|---|---|
| Ancienne banque Logistique sans contenu du 100 | Génération de la révision `logistique-initiale` | Testé |
| Déterminisme, séparation AFP/CFC et gel de la publication | Suite `tests/logistique/generation.test.mjs` | Testé |
| Sauvegarde d’une fiche et droits de domaine | Suite `tests/interactive/fiches-access.test.mjs` | Testé au niveau API |
| Anciens identifiants TPM et TPF, normalisations Gattegno et Grammaire | Lecture des chemins de migration | À rouvrir avec des recettes historiques |
| Recette Libre avec modifications, ancien instantané et médias, reprise du brouillon | Lecture du format et des limites de taille | À vérifier de bout en bout |

La compilation TypeScript et le build Vite 8.3.0 passent sur le commit de référence, avec un avertissement de taille de bundle. Commande exécutée avec Node v24.22.3.

```sh
./node_modules/.bin/tsc -b
./node_modules/.bin/vite build --outDir /tmp/doc-prof-libre-l0-dist --emptyOutDir
```

Les deux suites ci-dessous passent 10 tests sur 10 après correction d’une fixture. Le premier passage avait relevé que le test du module 100 supposait sa banque courante vide. La fixture indique maintenant explicitement la révision historique qu’elle vérifie.

```sh
node --test tests/logistique/generation.test.mjs tests/interactive/fiches-access.test.mjs
```

## Reprise du 27 novembre 2026

La [preuve JSON](audit-recettes.json) couvre sept recettes témoins au commit `561d0a0` avec la graine `20261126`. Le script passe chaque fixture par le lecteur de recettes v1, la réécrit avec le constructeur de recettes et compare les items à la réouverture. Les sept cas passent, dont les migrations TCM vers TPM et TCF vers TPF, un thème négatif Gattegno, une compréhension orale de Grammaire et les deux anciens formats de Calligraphie. Le témoin Libre préserve le calcul édité, sa réponse calculée, son instantané et la référence de remplacement d’image.

```sh
node scripts/audit-mode-libre.mjs /tmp/doc-prof-mode-libre recettes
node --test tests/logistique/generation.test.mjs tests/interactive/fiches-access.test.mjs
```

Les 16 tests Logistique et droits d’accès passent sur cette révision. Le contrôle TypeScript, la compilation Vite et le lint passent également. Vite relève la taille de certains bundles et des médias interactifs absents du checkout partiel. Le lint signale des avertissements existants. La couverture des recettes reste à étendre aux autres schémas et aux réouvertures via le navigateur, ainsi qu’aux médias persistés et au brouillon multi-onglets.
