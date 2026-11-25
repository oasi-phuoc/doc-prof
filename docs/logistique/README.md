# Logistique CFC et AFP — domaines et logo

## Étape du 24 novembre 2026

Périmètre confirmé par l’utilisateur : **« Domaines et logo uniquement »**. Les deux domaines `logistique-cfc` et `logistique-afp` figurent dans le sélecteur et dans les autorisations. Comme les autres domaines réguliers, ils sont accessibles aux comptes administrateur et full par défaut ; une liste d’accès explicite ou un compte personnel peut les autoriser séparément. Les droits des domaines déjà présents sont conservés.

Chaque domaine affiche son nom et un écran indiquant que ses cours et exercices ne sont pas encore ajoutés. Aucun cours, exercice, thème, banque ou corrigé EPCAS n’est importé ou présenté comme validé. Le passage par ces écrans préserve la fiche en cours ; le retour à son domaine la restitue sans régénération.

L’en-tête du générateur affiche EPCA dans ces deux domaines. Le logo ClairFLE reste affiché ailleurs. Le composant d’en-tête imprimable connaît également le logo EPCA pour les futures fiches logistiques ; cette étape ne propose pas encore d’impression de ces domaines vides.

Le fichier `src/assets/logos/epca.svg` est une transcription vectorielle du visuel fourni dans le message : lettres noires et traverse rouge. Il ne s’agit pas d’un fichier officiel téléchargé. Les logos existants restent conservés.

## État courant — 25 novembre 2026

Les étapes ultérieures ont ajouté les catalogues séparés CFC/AFP, le moteur de banques et le rendu imprimable, puis importé les sources EPCAS dans une archive éditoriale isolée. La référence est épinglée au commit `ac2ceeae3ba7944fb4d24a7de103d41d3da98e1f`. L’import comprend 715 emplacements, 2 013 unités canoniques, 540 pages de source alimentées et 19 éléments en quarantaine. Les 23 emplacements sans source restent vides.

Les unités EPCAS demeurent en `imported-unreviewed`, avec droits `pending`; aucune n’est approuvée ni publiée dans les banques du runtime. Les fiches n’utilisent que les contenus validés selon le diplôme et les droits. Le rapport par banque, les déficits par rapport aux cibles proposées et les champs de validation humaine sont générés par `npm run logistique:report` dans `rapport-importation.md` et `couverture-import.json`.

Cette livraison ne vaut pas validation pédagogique ni autorisation de reproduction. La suite dépend de la revue par une personne responsable, de la confirmation des droits et, si nécessaire, d’un export pédagogique autorisé des variantes AFP qui ne sont pas dans le dépôt source.

## Vérification

- `npm run logistique:report`
- `node --test tests/logistique/*.test.mjs`
- `node node_modules/typescript/bin/tsc --noEmit --project tsconfig.app.json`

Le contrôle navigateur de l’étape initiale ci-dessous reste une preuve des écrans de domaines et de logo, pas une recette des 715 rendus.

### Historique de l’étape initiale — 24 novembre 2026

À cette date, le périmètre confirmé était « Domaines et logo uniquement ». Les écrans des deux domaines étaient volontairement vides et aucun contenu EPCAS n’était importé. Les points ci-dessus remplacent cet état pour décrire le travail ultérieur; le cahier des charges demeure la référence.

## Vérification historique

- `node node_modules/typescript/bin/tsc --noEmit --project tsconfig.app.json`
- `LOGISTIQUE_TEST_URL=http://127.0.0.1:5187 node tests/logistique/domaines-browser.mjs`
- `node --test tests/interactive/fiches-access.test.mjs`

Le contrôle navigateur couvre les deux sélections, l’affichage et le chargement du logo, l’absence de fiche générée dans ces domaines vides, le retour à la fiche précédente, le maintien de ClairFLE ailleurs et les écrans ordinateur/mobile.
