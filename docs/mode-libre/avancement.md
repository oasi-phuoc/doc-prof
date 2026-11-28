# Suivi de la refonte du mode Libre

**Mise à jour le 28 novembre 2026**

Le mode Libre est réservé au format A4. Les chiffres de raccordement en double A5 figurant dans l’historique décrivent les versions antérieures. Les contrôles actuels de ce format portent sur l’aperçu, l’impression, l’ouverture des recettes existantes et la conservation du contenu lors du passage d’A4 à double A5.

Les commandes de composition du repérage et leurs zones interactives s’activent avec le panneau Libre. Trois recettes historiques de double A5 vérifient la fermeture du panneau, l’absence de commande d’édition et la conservation des formes, des points et des questions dans le document imprimable.

- [Cahier des charges validé — V1.2](cahier-des-charges.md)
- [Référence du code consulté pour la publication](https://github.com/oasi-phuoc/doc-prof/commit/c24a995b76c68c284b2614e113120cdb2873ba81)
- [Cahier des charges Logistique V2.13](../logistique/cahier-des-charges.md) et [suivi Logistique](../logistique/avancement-cahier-des-charges-20261126.md)

## Prérequis Cloudflare

Le 26 novembre, le Worker `clairfle-fiches` a répondu HTTP 200 à `/health`, avec les vérifications d’accès administrateur et de schéma positives. D1 enregistre les trois migrations `0001_fiches.sql`, `0002_personal_accounts.sql` et `0003_admin_accounts.sql`. La requête préalable CORS depuis le site a répondu HTTP 204.

La recette en production a vérifié 22 réponses HTTP sur deux comptes synthétiques, dont un avec les droits Logistique AFP et CFC. Elle couvre la création par l’administrateur, le rejet d’un formulaire incomplet ou invalide, la connexion, le refus d’un doublon, les droits, l’enregistrement et l’isolation des fiches, le retrait d’un domaine et la révocation des sessions. Le nettoyage des deux comptes et des fiches de recette a été vérifié. Les suites locales du serveur et du script de déploiement ont également passé 18 tests. Le parcours et les commandes de vérification figurent dans la [documentation des comptes](../comptes/installation.md).

Dans Chrome, la recette du site de production a vérifié la connexion administrateur, l’ouverture de **Comptes enseignants**, la création depuis **Créer le compte** (HTTP 201) et la connexion du compte créé depuis **Mon compte** (HTTP 200). Le compte synthétique de ce test a également été supprimé.

## Avancement par lot

| Lot | État | Preuve ou étape suivante |
|---|---|---|
| Prérequis comptes | Validé en production | Recette Cloudflare, contrôle D1 et tests des comptes ci-dessus. |
| Cahier des charges | V1.2 validée | Exigences, arbitrages et critères de réception approuvés et publiés. |
| L0 — Inventaire exécutable | En cours | Référence de reprise `561d0a0`. [4 086 contextes](audit-types.md), [13 comparaisons écran et PDF](audit-controles.md) et [7 recettes témoins](audit-recettes.md). La reprise `03ec309` porte l’inventaire à 4 141 contextes. Les 15 erreurs de génération observées sont corrigées. Cinq variantes produisent zéro unité. Poursuivre les vérifications des profils, des droits individuels et des effets des réglages. |
| L1 — Générateur et contrats d’état | En cours | Panneau unique, géométrie, listes identifiées et verrous vérifiés sur l’Algèbre. Historique et reprise locale par compte et par fiche. Étendre les preuves aux autres profils et aux droits individuels. |
| L2 — Pilotes | En cours | Calcul en ligne, CE avec support commun et CO 1 avec QCM illustrés. Édition et correction testées sur les trois pilotes. Étendre les preuves de reprise et de verrouillage par forme. |
| L3 — Mathématiques et tests | En cours | Calculs en ligne, opérations posées, conversions, repérage, comparaison, tri, leçons et glossaires de mathématiques, choix dans la banque de Logique. Raccorder les autres familles mathématiques et les activités restantes des évaluations TPM / TCM. |
| L4 — Autres profils imprimables | En cours | Calligraphie, cartes, variantes Gattegno équipées de leur éditeur et ensemble des contextes générables de Soutien FR raccordés en A4. Poursuivre les lectures et activités d’Alphabétisation. |
| L5 — Grammaire et TCF/TPF | En cours | Théorie et édition de données des dix présentations graduées. CE, CO, PE et PO raccordées en A4. Poursuivre les profils historiques de grammaire, les médias et verrous des activités graduées et la preuve de chaque forme et barème TCF/TPF. |
| L6 — Société et Logistique AFP/CFC | En cours | Édition des références structurées et questions simples en A4. Conservation des références modifiées au passage en double A5. Poursuivre les formats structurés, les activités mixtes et la mesure papier sur les autres modules. |
| L7 — Cas d’échec et ergonomie avancée | En cours | Reprise, isolation, conflit entre onglets et quota vérifiés. Sélection et espacements par activité sur les calculs, préférences d’espacement pour les profils compatibles. Poursuivre les médias et les autres contrôles de présentation. |
| L8 — Réception complète | À lancer après la couverture | Critères de réception, preuves par contexte, accessibilité, performances et revue. |

À chaque lot, inscrire le commit vérifié, les commandes et leurs résultats, les liens vers les preuves et les éventuels cas bloqués. L’état « validé » correspond à une condition de sortie démontrée.

### Panneau d’activité et réglages applicables

La bascule conserve le même panneau de gauche. Le mode Libre ajoute l’édition, l’historique et les réglages repliables de présentation des questions, de mise en page et d’en-tête. Les formats de réponse, sauts de page et commandes de grille du bloc actif apparaissent dans ce panneau. L’aperçu garde la même largeur dans les deux modes. Sur téléphone, la bascule Édition / Aperçu conserve l’activité en cours.

En mode simple, une liste à une seule valeur disparaît et les réglages de quantité ou de difficulté suivent les capacités du générateur. Les plages numériques, les modèles de calligraphie et la personnalisation du contenu des jeux sont accessibles dans le mode Libre. Les bornes et les niveaux des types de mathématiques ont été comparés sur trois graines fixes, avec le même contexte de génération. Les réglages de contenu et de présentation qui dépendent d’un support sont affichés selon les unités effectivement rendues.

`tests/mode-libre/layout-browser.mjs` couvre huit largeurs en A4 et deux en double A5, de 320 à 1 920 px. Le parcours vérifie le maintien du panneau, la visibilité des réglages selon l’activité, l’application des options d’impression et d’en-tête et leur annulation. `tests/mode-libre/structured-browser.mjs` vérifie aussi les sauts de page et l’import d’images initiés dans le panneau.

L’inventaire de la version intégrée `e500ef9e` compte 4 272 contextes, dont 4 233 générables avec les pilotes, 36 masqués et trois domaines en attente de contenu. Il compte 852 contextes générables à raccorder en A4 et 2 134 en double A5. Les suites unitaires de métadonnées, de génération et de droits totalisent 47 réussites. Les dix recettes témoins conservent le contenu et les données libres après réouverture.

### Références mathématiques en A4

Les 23 leçons et les deux glossaires d’algèbre et de géométrie utilisent le panneau Libre. Les leçons exposent le titre, l’objectif, le vocabulaire, les étapes, l’exemple et le schéma. Le glossaire permet de modifier les notions, leurs définitions, les exemples, les schémas et l’ordre. La quantité de notions est bornée par la banque et conserve les entrées personnalisées. Les fiches de référence ne portent pas de barème et les options de difficulté sont masquées.

Le scénario `tests/mode-libre/native-browser.mjs` vérifie sur la leçon d’addition et le glossaire de géométrie la mise à jour de la fiche, l’import et le rétablissement du schéma, l’annulation, la quantité et le contenu destiné à l’impression.

### Retrait de contenu dans les théories

Le panneau Libre propose le retrait d’un bloc principal ou d’un élément à l’intérieur d’une section. Une activité garde au moins un bloc principal. Les théories de mathématiques permettent aussi de retirer l’objectif, l’exemple, les mots et les étapes. Les sections vides sont retirées de la fiche et de l’impression. Les sauts manuels restent associés aux blocs conservés. Les actions de retrait de parties sont réservées aux types de théorie.

`node tests/mode-libre/structured-browser.mjs` couvre l’Algèbre, la Géométrie, la Grammaire, la Logistique AFP et CFC, Société et Sciences et santé. Le parcours de Grammaire vérifie le retrait avant un saut de page, l’annulation, le rétablissement et la recette après enregistrement et réouverture. Le PDF témoin présente les blocs conservés sur deux pages A4. Les témoins de glossaire vérifient la portée de la commande. L’inventaire raccorde les 12 théories de Sciences et santé et relève 483 contextes en attente sur 4 420, sans erreur de génération.

### Phrases à lire en Alphabétisation

Les 15 récits donnent accès à la consigne et au texte de chaque phrase dans le panneau Libre. Le nombre de phrases suit le récit choisi. La fiche présente le texte à lire, y compris lorsqu’elle est associée à des activités notées.

Le parcours Chromium vérifie un récit généré, une ancienne recette, l’annulation et la mise à jour du texte imprimable. L’inventaire relève 468 contextes A4 à raccorder sur 4 420 et aucune erreur de génération.

### Dictées de mots et de syllabes en Alphabétisation

Le panneau Libre permet de modifier les éléments dictés et leur consigne. Le réglage de quantité suit la capacité de la banque. Un changement de quantité conserve les éléments déjà modifiés. La fiche élève garde les lignes d’écriture et les mots attendus apparaissent au corrigé.

Le parcours Chromium couvre une dictée de syllabes et une dictée de mots issue d’un récit. Il vérifie le corrigé, la saisie vide, la quantité et l’annulation. L’inventaire raccorde 24 contextes et relève 444 contextes A4 en attente sur 4 420, sans erreur de génération.

### Symétries axiales et centrales en A4

Les quatre exercices de symétrie sur repère donnent accès aux sommets, à l’axe ou au centre Ω, à la taille et à la graduation du repère dans le panneau Libre. L’édition au clavier et le placement sur le repère recalculent le sujet et le corrigé. Une valeur hors du repère conserve la dernière figure applicable. Les contrôles avancés restent dans le panneau Libre.

`node tests/mode-libre/transformations-browser.mjs` vérifie les quatre variantes, le maintien de la figure à l’ouverture, l’ajout et le retrait par clic, l’annulation, la correction et la largeur réelle du repère imprimé à 0,6 mm près.

L’inventaire sur `0974f642` raccorde les quatre variantes. Sur 4 269 contextes de sélection, il reste 580 profils à raccorder en A4 et aucune erreur de génération n’est relevée.

### Périmètres des figures simples en A4

Les 17 types de périmètres donnent accès aux cotes connues, au périmètre donné lorsqu’une cote est à trouver, à l’unité et à la valeur de π. Les exercices mixtes et ceux sur les quadrilatères permettent aussi de choisir une figure. Les modifications recalculent la figure, l’énoncé et le corrigé. Les cotes en cours de saisie s’appliquent ensemble dès qu’elles forment une figure valide.

Le test `node tests/mode-libre/figure-measures-browser.mjs` couvre le calcul du périmètre, la cote inconnue, le changement d’unité et de figure, le rejet d’un triangle dégénéré, le verrou, l’annulation et le passage en double A5. Les 153 tirages automatiques comparés à `54fcc3b3` gardent les mêmes figures et résultats. L’inventaire sur `ebb8c54b` compte 523 contextes A4 à raccorder sur 4 269. Il ne relève aucune erreur de génération.

### Aires des figures simples en A4

Les 17 types d’aires partagent le panneau des mesures. Les champs disponibles suivent la figure et la question posée. Une aire donnée recalcule la cote cherchée, et l’unité s’affiche au carré pour l’aire et en unité de longueur pour une cote. Le navigateur vérifie le côté décimal d’un carré, la hauteur d’un triangle, le rayon d’un disque et le rejet d’une hauteur incompatible avec un losange. Les 153 tirages automatiques comparés à `13091c87` gardent leurs figures et leurs résultats.

L’inventaire sur `32a4f080` relève 506 raccordements A4 en attente sur 4 269 contextes et aucune erreur de génération.

### Volumes des solides en A4

Les 12 types de volumes reprennent les champs de cotes, l’unité, la valeur de π et le volume donné lorsque l’exercice demande une cote. Le choix du solide est disponible pour les exercices mixtes et les prismes à faces quadrilatères. Le navigateur vérifie le calcul de l’arête du cube, la hauteur du cône, le volume de la sphère et le rejet d’un volume nul. Les 108 tirages automatiques comparés à `32a4f080` gardent les mêmes données et résultats.

L’inventaire relève 494 raccordements A4 en attente sur 4 269 contextes et aucune erreur de génération. Les 14 recettes témoins se réécrivent et se rouvrent avec leur contenu. Les quatre nouveaux témoins couvrent l’axe choisi et les périmètres, aires et volumes personnalisés avec leur verrou.

### Repérage des formes et des points en A4

Les cinq variantes de lecture, de placement et de composition reprennent les formes ou les points affichés quand leur composition manuelle commence. Le réglage de quantité garde les éléments existants. Les commandes de dimensions refusent une réduction qui retirerait un élément déjà placé.

`node tests/mode-libre/reperage-browser.mjs` vérifie le maintien du tirage des cinq variantes, l’ajout et le retrait de formes, le changement de quantité, le déplacement de l’origine et l’annulation. La recette des symétries est aussi repassée avec le ciblage du repère de l’activité active.

### Réutilisation des éditeurs mathématiques dans le TPM

Le panneau du TPM permet de modifier ses 46 exercices de mesures, ses 11 variantes de repérage et de symétrie et ses 25 références mathématiques. Les types de leçons produisent désormais leur fiche de théorie et le barème les exclut. Les 117 blocs des sujets standard comparés au relevé précédent gardent leur contenu.

Le navigateur vérifie l’aire d’un rectangle, le repérage, la symétrie, la modification d’une leçon et celle d’une notion de glossaire dans le TPM. L’inventaire de `5635e356` compte 407 raccordements A4 en attente sur 4 269 contextes et aucune erreur de génération.

### Écoute de mots en Soutien FR et Alphabétisation

Le panneau Libre permet de changer les mots des activités d’écoute avec QR et des activités d’écoute illustrées. La banque fournit les médias associés et le son de la leçon détermine la coche proposée dans le corrigé. La case reste modifiable pour une prononciation particulière. Un changement de quantité ou de colonnes conserve les mots personnalisés et leurs médias.

Les parcours Chromium vérifient un exemple en Soutien FR et un en Alphabétisation. Ils couvrent la saisie invalide, le QR, l’import d’image, la correction et l’annulation. Les quatre tests de conversion en jeu interactif passent. Le relevé comporte 4 269 contextes, dont 160 raccordés pour l’écoute de mots. Il reste 664 contextes A4 à raccorder et le relevé ne signale aucune erreur de génération.

```sh
node tests/mode-libre/native-browser.mjs
node --test tests/interactive/sound-check.test.mjs
node scripts/audit-mode-libre.mjs /tmp/doc-prof-libre-ecoute-audit types
```

### Lettres mélangées dans les phrases de Soutien FR

Le panneau permet de modifier le texte avant et après le blanc, le mot attendu, l’ordre des lettres et l’illustration. Les lettres sont recalculées après un changement de mot. Une permutation invalide conserve la dernière version imprimable. Le navigateur vérifie le sujet, le corrigé, l’import d’image, le changement de quantité et l’annulation. Le PDF témoin contient une page élève et une page de corrigé au format A4, toutes deux avec la phrase et les lettres modifiées.

L’inventaire raccorde les 40 contextes de cette famille. Le relevé de 4 269 contextes compte 624 raccordements A4 en attente et aucune erreur de génération.

### Syllabes à relier en Soutien FR

Le panneau Libre permet de modifier les deux parties de chaque paire et de mélanger la partie droite. La quantité suit la capacité du tirage. Changer la quantité ou le nombre de colonnes conserve les paires modifiées. Le corrigé associe chaque occurrence dans sa colonne, y compris lorsqu’une même syllabe figure deux fois. Le navigateur vérifie ces correspondances, la saisie incomplète et l’annulation.

L’inventaire raccorde les 40 contextes de cette famille. Le relevé de 4 269 contextes compte 584 raccordements A4 en attente et aucune erreur de génération.

### Mots mêlés en Soutien FR

Le panneau Libre permet de choisir les mots et les sens autorisés, de recomposer la grille et de déplacer chaque mot. Le corrigé se recalcule à partir des positions. Une position incompatible ou une liste avec un doublon conserve la dernière grille valide. Le parcours Chromium couvre aussi une ancienne recette sans positions enregistrées, la modification des mots et l’annulation.

Les 40 contextes de mots mêlés terminent le raccordement des activités générables de Soutien FR en A4. Après intégration des quatre symétries, l’inventaire de `feeff150` relève 4 269 contextes de sélection, dont 540 à raccorder en A4 dans les autres domaines. Il ne relève aucune erreur de génération.

## Panneau unique et addition A4

Le commit `03ec309`, basé sur `6cd8c38`, intègre les réglages et les éditeurs spécialisés dans le panneau gauche du mode Libre. L’en-tête et le pied de page utilisent le même emplacement. La bascule Édition / Aperçu apparaît jusqu’à 550 px et rend le focus au dernier champ utilisé.

Le test Chromium couvre sept largeurs en A4 et deux en double A5 sur la fiche Algèbre. Il vérifie la géométrie, le contenu à l’ouverture et à la fermeture, les menus du rôle partiel et l’absence de débordement horizontal global. Les PDF comparés à 1 366 px conservent leur texte, leur pagination et leurs dimensions.

L’addition en ligne A4 recalcule le corrigé à la saisie. La quantité augmente en gardant les questions éditées et une réduction demande confirmation. Une saisie invalide conserve la dernière valeur appliquée. Les boutons d’impression et d’enregistrement proposent cette valeur, et l’annulation rend le focus au champ. Le brouillon durable, les autres profils, l’édition directe du double A5 et les sorties consignées au §9.5 restent à recevoir.

Les générateurs des phrases à remettre en ordre acceptent les noms composés. L’association de syllabes retourne une activité vide lorsque sa banque de mots est épuisée. La relance de l’inventaire sur `03ec309` couvre 4 141 contextes, sans erreur de génération. L’activation de cinq variantes sans unité reste à traiter.

```sh
node scripts/audit-mode-libre.mjs /tmp/doc-prof-libre-l1 types
node tests/mode-libre/layout-browser.mjs
node tests/logistique/generator-browser.mjs
node --test tests/logistique/generation.test.mjs tests/interactive/fiches-access.test.mjs
node_modules/.bin/tsc -b
node_modules/.bin/vite build --outDir /tmp/doc-prof-libre-l1-dist --emptyOutDir
npm run lint
```

Les dix parcours Mode Libre et les deux parcours Logistique sur fixture passent. Les suites Logistique et accès totalisent 16 tests réussis. TypeScript, Vite et le lint passent. La compilation émet des avertissements de taille des bundles et signale les médias interactifs absents du checkout partiel.

## Révisions, reprise et pilotes

La révision `3e93ba5` ajoute jusqu’à 50 niveaux d’annulation, le verrou des calculs et un brouillon IndexedDB par compte enseignant et par fiche. La recette Chromium vérifie la restauration d’une saisie invalide, le choix entre deux versions créées dans plusieurs onglets et l’isolation entre deux comptes. La récupération automatique s’appuie sur l’identifiant stable du compte enseignant.

La révision `89211f7` raccorde la compréhension écrite et les QCM illustrés CO 1 du TPF et des deux TCF. Une modification du support demande de vérifier les corrigés liés. L’import d’une image cible un choix. Le parcours de sauvegarde et de réouverture a été testé sur une API simulée dans Chromium. Les validations communes de format sont partagées avec le Worker.

La révision `db12f47` raccorde les additions, soustractions, multiplications et divisions en ligne, avec leurs variantes à trou. Les tests vérifient le recalcul, la conservation de la dernière valeur valide et le refus d’un diviseur nul. Les essais de calligraphie, de cartes recto-verso et de Gattegno vérifient la stabilité à l’ouverture et la modification en direct.

```sh
node tests/mode-libre/layout-browser.mjs
node tests/mode-libre/draft-browser.mjs
node tests/mode-libre/structured-browser.mjs
node tests/mode-libre/arithmetic-browser.mjs
node --test tests/mode-libre/arithmetic.test.mjs tests/mode-libre/metadata.test.mjs
```

## Double A5 et contenus structurés

Le double A5 utilise les éditeurs directs de la Grammaire graduée, de la compréhension orale de Grammaire et des activités CE, CO, PE et PO du TPF et des deux TCF. Les exemplaires d’un même support reprennent le contenu personnalisé. Les modèles de phrases de Gattegno, les mots illustrés et les mots à compléter reprennent aussi leurs données personnalisées dans les deux exemplaires. La comparaison et le rangement des tests mathématiques peuvent être modifiés indépendamment par moitié.

L’en-tête compact de Grammaire et du TCF laisse plus de place au contenu sur une demi-feuille. La mesure surveille les différentes pages physiques de l’activité, y compris les deux moitiés. Un dépassement est signalé dans le panneau Libre. Le témoin TCF vérifie la modification du support et l’état des corrigés, l’apparition du message après l’ajout d’un texte long, puis les deux exemplaires sans chevauchement à l’impression après rétablissement du texte court.

L’inventaire de `43548de0` relève 962 contextes nouvellement raccordés en double A5. Il reste 1 172 contextes à raccorder dans ce format et 852 en A4. Les chiffres décrivent les profils raccordés. Les preuves navigateur et PDF portent sur les scénarios exécutés.

La révision `d90588a` permet de modifier chaque moitié A5 des calculs en ligne. Le navigateur vérifie la conservation de l’autre moitié, le verrou lors d’un tirage local et le contenu destiné à l’impression. La validation des recettes distingue les deux listes d’occurrences et leurs identifiants.

Les essais sur les mots illustrés et les mots à compléter partent de la liste visible. Le changement de colonnes en Alphabétisation garde les mots édités. Les essais Grammaire et Logistique modifient le contenu structuré, y compris un tableau après un saut de page. Pour le module Logistique 101, le passage de Résumé à Complet demande une confirmation lorsque la référence a été modifiée. Les deux diplômes conservent la grille de calcul et la séparation du sujet et du corrigé. Un exercice de Société et l’état sans contenu de Soutien FR sont également testés.

La suite des banques de Logistique génère les 858 types. La recette navigateur des cours vérifie les 80 modules CFC et les 63 modules AFP, ainsi que les mises en page des exercices des modules 105 et 110. Les suites unitaires Calcul, Métadonnées, Logistique et Accès totalisent 26 réussites.

```sh
node tests/mode-libre/native-browser.mjs
node tests/logistique/published-browser.mjs
node --test tests/mode-libre/arithmetic.test.mjs tests/mode-libre/metadata.test.mjs tests/logistique/generation.test.mjs tests/interactive/fiches-access.test.mjs
```

## Couverture et recettes du 27 novembre

L’inventaire sur `123af49` compte 4 141 contextes de sélection, dont 4 097 générables et 5 sans unité. Le registre attribue un profil d’édition directe à 2 356 contextes en A4 et à 8 en double A5. Il reste 1 741 contextes générables à raccorder en A4 et 4 089 en double A5 dans l’inventaire par format. La présence d’un profil indique son raccordement logiciel. Les essais ci-dessous établissent les parcours vérifiés.

- Les 13 comparaisons de l’audit Algèbre et Logistique AFP/CFC gardent le contenu, le PDF et les dimensions du cadre à l’ouverture de Libre. Les trois effets vérifiés sont le nombre de questions, l’absence du contrôle audio en addition et le recalcul du premier opérande.
- Les dix recettes témoins passent après réécriture et réouverture. Elles comprennent les recettes historiques Logistique AFP et CFC et le verrou de la demi-feuille droite en double A5.
- Les tests des calculs vérifient le reste de la division posée, la conversion de longueur et l’isolement des espacements entre deux activités. La sélection filtrée conserve toutes les questions sur le papier. Le verrouillage et le tirage de la sélection s’annulent chacun en une opération.
- Les essais navigateur vérifient la modification d’une cellule, la casse et la correction de la grille, la portée d’un fichier image et le refus d’un SVG importé. Ils vérifient également le choix d’une figure en Logique, l’instantané d’une question de grammaire et le rattachement de la question à la piste audio après suppression d’une autre piste.
- Le test de quota IndexedDB conserve à la fois la révision précédente sur l’appareil et la nouvelle saisie dans la fiche ouverte quand l’écriture échoue. Les suites de Grammaire vérifient les contrats et la pagination sur 601 offres.

Les essais complémentaires du repère vérifient un seul éditeur de questions, la conservation des droites et une largeur SVG imprimée à moins de 0,6 mm de la largeur déclarée. Les suites Worker en base SQLite locale vérifient la conservation du double A5 et de ses verrous après lecture et écriture client, le rejet des identifiants dupliqués et l’isolation entre deux enseignants dotés de droits Logistique AFP et CFC distincts.

Les nouveaux parcours Chromium vérifient les syllabes saisies dans un mot, l’édition des associations de grammaire, l’ordre des tokens, la production écrite, les dialogues, les textes à corriger et la conservation d’un document modifié lors de l’ajout d’un second. Ils vérifient aussi le verrou d’une question de calcul Logistique CFC sur la moitié droite et un tirage ciblé qui laisse la moitié gauche intacte.

La pagination du résumé AFP 101 en double A5 utilise une estimation adaptée à sa largeur et à la hauteur réellement disponible. La recette imprime les deux moitiés et contrôle les 25 px de réserve après chargement des images.

La référence intégrée `a066a4c` reprend les changements de `39ccacf` sur `main`. Son inventaire couvre 4 141 contextes, dont 4 097 générables. La résolution annonce un profil pour 2 937 contextes en A4 et 1 569 en double A5. Il reste 1 160 contextes A4 et 2 528 contextes double A5 à raccorder. Les dix recettes et les treize comparaisons écran/PDF réussissent. Le délai de l’addition atteint 21,37 ms au 95ᵉ centile sur 24 saisies de la même fiche dans Chromium, avec les valeurs et le focus vérifiés à chaque saisie.

Les essais sur les tests mathématiques vérifient le refus d’un nombre supérieur à 100 dans la comparaison CSC et le refus d’un doublon dans le tri CFR. Le navigateur recalcule le signe et le tri dès la saisie, avec le nombre d’unités et le sens du tri du sujet. L’essai des préférences vérifie qu’une activité nouvelle d’un enseignant reprend l’espacement compatible, qu’une recette rouverte garde son espacement enregistré et que le réglage reste isolé du second compte.

Les essais du TCF vérifient la sélection et l’import local d’une image en reconnaissance d’objets, l’état du corrigé d’un formulaire incomplet et l’édition d’un thème de production orale. Le sujet de production orale garde les questions de l’examinateur dans le corrigé. La validation de la recette vérifie les identifiants des situations et refuse un média attaché à une URL de session. Le navigateur vérifie aussi une modification syllabique confinée à la moitié droite du double A5.

L’inventaire de `01d9c5e` retrouve 4 097 contextes générables et 1 089 profils A4 à raccorder, ainsi que 2 328 profils double A5 à raccorder. Les treize comparaisons écran/PDF conservent la pagination, les dimensions et le contenu à l’ouverture de Libre. Le délai de l’addition atteint un 95ᵉ centile de 93,27 ms sur ce relevé.

Le relevé initial de la pagination des 143 cours complets de Logistique en double A5 comptait 52 cas sous la réserve de 25 px. Les tableaux et les listes dépassant la hauteur disponible sont répartis à l’impression. Le test unitaire sur le module 305 vérifie la conservation de chaque ligne dans l’ordre, la répétition des en-têtes et la présence du tableau entier dans l’éditeur. Un deuxième relevé après découpe des tableaux avait isolé quatre cas de listes longues dans les modules 105 et 410.

Le contrôle après découpe des listes couvre les 143 cours complets et 2 700 pages. Chaque moitié mesure 148,5 × 210 mm à la tolérance du test. La réserve minimale après décodage des images est de 38,0 px. Les résumés A4 et les PDF des quatre modules illustrés 101, 306, 407 et 409 restent vérifiés pour les deux diplômes.

```sh
node tests/logistique/double-a5-browser.mjs
node tests/logistique/published-browser.mjs 101 306 407 409
```

Les associations audio de Soutien FR et d’Alphabétisation utilisent les mots et médias de la banque de la leçon. Le navigateur vérifie le remplacement d’un mot, la conservation du focus, le déplacement d’une piste, la mise à jour du numéro dans son corrigé et l’isolement de la seconde moitié. La quantité supplémentaire est limitée aux associations distinctes disponibles. Les cinq déclarations qui ne peuvent composer une série ne sont pas proposées à la création et restent documentées pour les anciennes recettes. Ce relevé intermédiaire totalise 4 136 contextes, 4 097 générables et aucun résultat vide dans les sélecteurs.

Le verrou d’une unité graduée protège ses choix, ses données et, quand elle en contient, son document ou son dialogue avec leurs sous-questions. La recette vérifie le nouveau tirage d’une unité déverrouillée et l’annulation jusqu’à la sélection précédente. L’édition du CO thématique réutilise le niveau et l’enregistrement de la banque de Grammaire. La modification de l’énoncé affiche son état de correction et le verrou bloque la régénération du support lié.

Les essais de numération couvrent l’écriture en lettres, la position d’un chiffre et l’encadrement. Les suites recalculent les termes masqués à partir du premier terme et du pas. Les essais vérifient le refus d’un pas incompatible avec l’exercice CSC et la conservation des trous du sujet.

```sh
node scripts/audit-mode-libre.mjs /tmp/doc-prof-libre types
node scripts/audit-mode-libre.mjs /tmp/doc-prof-libre recettes
node scripts/audit-mode-libre.mjs /tmp/doc-prof-libre controles
node tests/mode-libre/arithmetic-browser.mjs
node tests/mode-libre/native-browser.mjs
node tests/mode-libre/structured-browser.mjs
node tests/mode-libre/draft-browser.mjs
node scripts/test-grammar-contracts.cjs
node scripts/test-grammar-pagination.cjs
```
