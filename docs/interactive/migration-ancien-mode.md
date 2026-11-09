# Remplacement de l’ancien jeu

La branche du prototype `35934ad` a été fusionnée dans le `main` actuel par un véritable commit de merge. Les évolutions de `main` sont conservées.

Le générateur propose désormais une seule entrée **Jouer avec la classe**, vers `src/interactive`. Le toggle Fiche/Jeu, les scores et chronomètres de l’ancien affichage, ainsi que les imports `GameBoard`, `GameSetupBar` et `GameTimer`, sont retirés. Le dossier `src/components/game-board` et ses styles inutilisés sont supprimés.

`ResultPanel` conserve son aperçu et ses documents d’impression. Les banques imprimables de `src/jeux`, les recettes `FicheRecipe` v1, les fiches enregistrées et les actions d’impression sont conservées. Le nouveau jeu ne modifie pas leurs générateurs.

La généralisation à toutes les familles et les fonctions P1/P2 du cahier V4 restent des travaux distincts. Le retrait du legacy ne vaut pas validation pédagogique ou matérielle de l’ensemble du catalogue.
