# Suivi de la refonte du mode Libre

**Mise à jour le 27 novembre 2026**

Le mode Libre est réservé au format A4. Les chiffres de raccordement en double A5 figurant dans l’historique décrivent les versions antérieures. Les contrôles actuels de ce format portent sur l’aperçu, l’impression, l’ouverture des recettes existantes et la conservation du contenu lors du passage d’A4 à double A5.

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
| L3 — Mathématiques et tests | En cours | Calculs en ligne, opérations posées, conversions, repérage, comparaison, tri et choix dans la banque de Logique. Raccorder les autres familles mathématiques et les activités restantes des évaluations TPM / TCM. |
| L4 — Autres profils imprimables | En cours | Calligraphie, cartes, variantes Gattegno équipées de leur éditeur, mots illustrés et à compléter, grilles et découpage syllabiques, dictées et lecture de phrases de Soutien FR. Poursuivre les listes et associations restantes. |
| L5 — Grammaire et TCF/TPF | En cours | Théorie et édition de données des dix présentations graduées. CE, CO, PE et PO raccordées en A4. Poursuivre les profils historiques de grammaire, les médias et verrous des activités graduées et la preuve de chaque forme et barème TCF/TPF. |
| L6 — Société et Logistique AFP/CFC | En cours | Édition des références structurées en A4 et double A5. Édition indépendante des questions simples sur les deux moitiés. Poursuivre les formats structurés, les activités mixtes et la mesure papier sur les autres modules. |
| L7 — Cas d’échec et ergonomie avancée | En cours | Reprise, isolation, conflit entre onglets et quota vérifiés. Sélection et espacements par activité sur les calculs, préférences d’espacement pour les profils compatibles. Poursuivre les médias et les autres contrôles de présentation. |
| L8 — Réception complète | À lancer après la couverture | Critères de réception, preuves par contexte, accessibilité, performances et revue. |

À chaque lot, inscrire le commit vérifié, les commandes et leurs résultats, les liens vers les preuves et les éventuels cas bloqués. L’état « validé » correspond à une condition de sortie démontrée.

### Panneau d’activité et réglages applicables

La bascule conserve le même panneau de gauche. Le mode Libre ajoute l’édition, l’historique et les réglages repliables de présentation des questions, de mise en page et d’en-tête. Les formats de réponse, sauts de page et commandes de grille du bloc actif apparaissent dans ce panneau. L’aperçu garde la même largeur dans les deux modes. Sur téléphone, la bascule Édition / Aperçu conserve l’activité en cours.

En mode simple, une liste à une seule valeur disparaît et les réglages de quantité ou de difficulté suivent les capacités du générateur. Les plages numériques, les modèles de calligraphie et la personnalisation du contenu des jeux sont accessibles dans le mode Libre. Les bornes et les niveaux des types de mathématiques ont été comparés sur trois graines fixes, avec le même contexte de génération. Les réglages de contenu et de présentation qui dépendent d’un support sont affichés selon les unités effectivement rendues.

`tests/mode-libre/layout-browser.mjs` couvre huit largeurs en A4 et deux en double A5, de 320 à 1 920 px. Le parcours vérifie le maintien du panneau, la visibilité des réglages selon l’activité, l’application des options d’impression et d’en-tête et leur annulation. `tests/mode-libre/structured-browser.mjs` vérifie aussi les sauts de page et l’import d’images initiés dans le panneau.

L’inventaire de la version intégrée `e500ef9e` compte 4 272 contextes, dont 4 233 générables avec les pilotes, 36 masqués et trois domaines en attente de contenu. Il compte 852 contextes générables à raccorder en A4 et 2 134 en double A5. Les suites unitaires de métadonnées, de génération et de droits totalisent 47 réussites. Les dix recettes témoins conservent le contenu et les données libres après réouverture.

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
