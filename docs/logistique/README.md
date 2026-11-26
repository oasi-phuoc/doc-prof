# Logistique AFP et CFC

Le [cahier des charges consolidé](cahier-des-charges.md) reprend la v2.10 fournie et les décisions de la v2.11 et précise le cadrage de la reprise au §0. Le gabarit de fiche, le générateur et les actions communes servent de référence de recette.

## Références

- Doc-Prof au départ de la reprise : `0a23f9287`.
- Contenus Git EPCAS : `ac2ceeae3ba7944fb4d24a7de103d41d3da98e1f`.
- L’ancien écran de préfiguration et ses preuves restent consultables dans l’historique au commit `767525134`.

## État du raccordement

Le générateur commun propose les neuf thèmes et 80 modules du CFC, ainsi que les sept thèmes et 63 modules de l’AFP. Chaque module présente les cinq types attendus. La génération, les titres, le corrigé, la grille de calcul et les sauts manuels passent par les feuilles standard. Les recettes enregistrent la révision de la banque et contrôlent le diplôme à la lecture. L’en-tête de la fiche utilise le visuel EPCA déjà fourni et le libellé du diplôme.

La [banque active](../../src/logistique/approved-banks.ts) fournit les onze modules du thème Fondations (100 à 110), ainsi que les modules 201, 202, 308 et 613 dans les deux diplômes et les modules 805 et 902 en CFC. Les modules ou types sans contenu exploitable portent l’indication « à compléter ». Le [suivi d’avancement](avancement-cahier-des-charges-20261126.md) décrit les révisions, la couverture et le travail restant.

## Sources et pilote

- L’[inventaire source](inventaire-epcas.generated.json) couvre les 80 codes. Il compte 16 emplacements sans déclaration en CFC et 7 en AFP. Les déclarations AFP présentes dans ce registre sont des candidatures à l’héritage.
- Les [sources archivées](sources-epcas/) et les [sources du 105](pilote-105/sources-epcas.json) contiennent 540 pages pédagogiques du Git de référence, avec leurs versions complètes et résumées et leurs corrigés lorsqu’ils existent. L’import a exclu 149 références historiques et consigné leurs emplacements. L’archive demeure la référence de travail pour l’adaptation des prochains modules.
- Le [dossier du 105](pilote-105/relecture.md) contient le projet de résumé, le glossaire reconstruit, les corrections proposées, la couverture par section et les points à arbitrer. Le Git inspecté ne fournit pas la validation pédagogique du CFC ou de l’AFP ni les éventuelles variantes publiées hors Git.
- Les modules actifs utilisent la pagination automatique et disposent chacun d’un schéma original. Le suivi distingue les fonctions démarrées, validées sur le pilote et à généraliser.

L’extraction se reproduit avec `node scripts/import-logistique-epcas.mjs /chemin/vers/le/depot/epcas`. Le script lit les objets Git du commit fixé et analyse les déclarations statiques.

## Contrôles

- `npm run test:logistique` contrôle les effectifs, l’ordre des types, l’éligibilité, la déduplication et les révisions de recettes.
- `npm run test:logistique:browser` démarre un Vite local et contrôle le parcours des deux diplômes en Chromium, dont les dimensions du gabarit, la grille, le corrigé, le PDF et la réouverture d’une recette. La seconde vérification parcourt les cinq types de la banque active du 105 en CFC et AFP et mesure la réserve au pied sur chaque page imprimée.
