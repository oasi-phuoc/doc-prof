# Logistique CFC et AFP — domaines et logo

## Étape du 24 novembre 2026

Périmètre confirmé par l’utilisateur : **« Domaines et logo uniquement »**. Les deux domaines `logistique-cfc` et `logistique-afp` figurent dans le sélecteur et dans les autorisations. Comme les autres domaines réguliers, ils sont accessibles aux comptes administrateur et full par défaut ; une liste d’accès explicite ou un compte personnel peut les autoriser séparément. Les droits des domaines déjà présents sont conservés.

Chaque domaine affiche son nom et un écran indiquant que ses cours et exercices ne sont pas encore ajoutés. Aucun cours, exercice, thème, banque ou corrigé EPCAS n’est importé ou présenté comme validé. Le passage par ces écrans préserve la fiche en cours ; le retour à son domaine la restitue sans régénération.

L’en-tête du générateur affiche EPCA dans ces deux domaines. Le logo ClairFLE reste affiché ailleurs. Le composant d’en-tête imprimable connaît également le logo EPCA pour les futures fiches logistiques ; cette étape ne propose pas encore d’impression de ces domaines vides.

Le fichier `src/assets/logos/epca.svg` est une transcription vectorielle du visuel fourni dans le message : lettres noires et traverse rouge. Il ne s’agit pas d’un fichier officiel téléchargé. Les logos existants restent conservés.

## Suite éventuelle

Le [cahier des charges fourni](cahier-des-charges.md) reste la référence pour une étape d’import distincte : catalogue CFC/AFP, contenus, corrigés, éligibilité, relecture et preuves. Sa copie est conservée sans modification. Le dépôt EPCAS a seulement été consulté en lecture seule au commit `ac2ceeae3ba7944fb4d24a7de103d41d3da98e1f` ; ses cours, comptes et données ne font pas partie de cette livraison.

## Vérification

- `node node_modules/typescript/bin/tsc --noEmit --project tsconfig.app.json`
- `LOGISTIQUE_TEST_URL=http://127.0.0.1:5187 node tests/logistique/domaines-browser.mjs`
- `node --test tests/interactive/fiches-access.test.mjs`

Le contrôle navigateur couvre les deux sélections, l’affichage et le chargement du logo, l’absence de fiche générée dans ces domaines vides, le retour à la fiche précédente, le maintien de ClairFLE ailleurs et les écrans ordinateur/mobile.
