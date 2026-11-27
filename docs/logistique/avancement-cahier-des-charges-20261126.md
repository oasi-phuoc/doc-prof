# Avancement du cahier des charges Logistique CFC et AFP

**Mis à jour le 27 novembre 2026**

Référence de réalisation dans le [cahier des charges v2.12](cahier-des-charges.md). Révision Doc-Prof de départ `0a23f9287`. Révision EPCAS `ac2ceeae3ba7944fb4d24a7de103d41d3da98e1f`.

## Décisions du responsable

- Conserver la structure des fiches, le gabarit A4 et le générateur existants.
- Partir du parcours standard après retrait de l’ancien écran Logistique.
- Relire et activer directement les contenus exploitables. Conserver le détail des corrections pour les révisions ultérieures.
- Placer Objectifs et aperçu avant Théorie, retirer les mentions de source de la fiche d’aperçu, traiter visuels et mise en page dans le même lot et enchaîner les questions sans saut automatique prématuré.

## Avancement par lot

| Lot | État | Preuves et reprise |
|---|---|---|
| L0 — Existant et inventaire | Réalisé | Les 9 thèmes et 80 modules CFC, les 7 thèmes et 63 modules AFP et les 715 types sont générés depuis la référence EPCAS. 540 déclarations source archivées, parmi lesquelles 149 références historiques exclues. L’[inventaire](inventaire-epcas.generated.json) repère 16 types sans déclaration en CFC et 7 en AFP. |
| L1 — Générateur commun | Pilote actif | Sélecteurs communs, feuille, activités, élève, corrigé, grille, titres, impression, Libre générique et recettes versionnées. Les contrôles de catalogue empêchent les recettes incompatibles avec le diplôme ou mélangeant les diplômes. |
| L1b à L1d — Sélection et formats | Partiel | Le tirage déterministe, les questions ouvertes, les QCM, les calculs et les cas simples sont pris en charge. La sélection individuelle en banque, l’évaluation multi-sous-thèmes au sein d’une activité et les formats avancés demandent encore un raccordement aux contrôles existants. |
| L1e — Pagination et titres | Révisé en V2.12 | Enchaînement des questions dans l’espace disponible, numérotation continue et sauts manuels. La capacité tient compte de la présence de l’en-tête et de la taille du texte. La pagination s’appuie sur une estimation contrôlée en Chromium. Étendre la mesure aux réglages et aux contenus libres atypiques. |
| V2.12 — Objectifs, aperçu et cours illustrés | Révision `logistique-references-v002` | 17 modules actifs préparés, avec 31 nouveaux schémas originaux en complément des 17 déjà publiés. Les anciens types et versions de banque restent accessibles aux recettes historiques. [Registre des figures et des introductions](preparation/references-illustrees-v002.json). |
| L1f — Évaluation | À poursuivre | Les modes communs sont accessibles. Le récit adaptatif, la durée indicative, le barème Bloom et les modèles de nouveau tirage ne sont pas réalisés. |
| L4 — Module 100 | Révision `100-v001` active | Cours original de 17 blocs, schéma du parcours d’un colis, 13 termes, cinq problèmes CFC dont quatre AFP, six questions et quatre situations communes. [Cours](preparation/100-v001.md) et [préparation](preparation/100-v001.json). |
| L2 et L3 — Module 105 | Révision `105-v001` active | Cours commun, 45 termes de glossaire, quatre calculs et quatre vérifications CFC, dont deux et deux en AFP, et deux situations communes. Le résumé réécrit est disponible dans les données éditoriales. L’ancien exercice SGH, dépendant de pictogrammes, demeure archivé. |
| L3 — Module 101 | Révision `101-v001` active | Cours de 42 blocs, schéma original, 16 termes, quatre problèmes CFC dont trois AFP, sept vérifications et quatre situations communes. Le détail des adaptations, dont le corrigé du tonnage de Hambourg, figure dans la [préparation du 101](preparation/101-v001.json). |
| L3 — Module 102 | Révision `102-v001` active | Cours de 73 blocs, schéma original, 25 termes, quatre problèmes CFC dont trois AFP, sept vérifications communes et six situations CFC dont cinq AFP. Le détail des choix et de la distinction entre chaîne logistique et SCM figure dans la [préparation du 102](preparation/102-v001.json). |
| L4 — Module 103 | Révision `103-v001` active | Cours de 36 blocs, schéma des 6B, 15 termes, sept problèmes CFC dont trois AFP, six vérifications et quatre situations communes. Les corrections de durée, de coût et de date figurent dans la [préparation du 103](preparation/103-v001.json). |
| L4 — Module 104 | Révision `104-v001` active | Cours de 48 blocs, schéma négoce et production, 20 termes, cinq problèmes CFC dont quatre AFP, six vérifications communes et cinq situations CFC dont quatre AFP. La [préparation du 104](preparation/104-v001.json) distingue le prix d’achat du coût total de la décision. |
| L4 — Module 106 | Révision `106-v001` active | Cours de 71 blocs, schéma d’orientation des déchets, 14 termes, cinq calculs CFC dont trois AFP, cinq vérifications et quatre situations CFC dont trois AFP. La [préparation du 106](preparation/106-v001.json) actualise les catégories et précise les consignes de tri. |
| L4 — Module 107 | Révision `107-v001` active | Cours de 67 blocs, schéma réduction–réemploi–recyclage, 15 termes, cinq calculs CFC dont trois AFP, cinq vérifications et quatre situations CFC dont trois AFP. La [préparation du 107](preparation/107-v001.json) distingue collecte et recyclage ainsi que recettes brutes et bénéfice. |
| L4 — Module 108 | Révision `108-v001` active | Cours de 50 blocs, schéma de suivi environnemental, 13 termes, cinq calculs CFC dont quatre AFP, cinq vérifications et quatre situations CFC dont trois AFP. La [préparation du 108](preparation/108-v001.json) distingue les cas d’exercice des statistiques de référence. |
| L4 — Module 109 | Révision `109-v001` active | Cours de 40 blocs, schéma de transmission, 15 termes, cinq calculs CFC dont quatre AFP, six vérifications et quatre situations communes. La [préparation du 109](preparation/109-v001.json) actualise la confidentialité, la protection des données et les règles d’accès. |
| L4 — Module 110 | Révision `110-v001` active | Cours de 62 blocs, schéma des mouvements, 16 termes, six calculs CFC dont quatre AFP, six vérifications CFC dont cinq AFP et cinq situations CFC dont quatre AFP. La [préparation du 110](preparation/110-v001.json) clarifie les données de base, le besoin net et les indicateurs. |
| L4 — Module 201 | Révision `201-v001` active | Cours de 29 blocs, schéma de traitement d’une demande, 14 termes, cinq calculs CFC dont trois AFP, six vérifications communes et cinq situations CFC dont quatre AFP. La [préparation du 201](preparation/201-v001.json) distingue acheteur, débiteur, destinataire, chiffre d’affaires et encaissement. |
| L4 — Module 202 | Révision `202-v001` active | Cours de 50 blocs, schéma de préparation d’un contact, 14 termes, cinq calculs CFC dont quatre AFP, six vérifications communes et cinq situations CFC dont quatre AFP. La [préparation du 202](preparation/202-v001.json) relie la tenue et l’hygiène aux tâches et aux consignes du poste. |
| L4 — Module 203 | Révision `203-v001` active | Cours de 46 blocs, fenêtre de Johari et schéma d’accord d’équipe, 14 termes. Sept calculs CFC dont cinq AFP, sept vérifications CFC dont six AFP et cinq situations CFC dont quatre AFP. [Préparation du 203](preparation/203-v001.json). |
| L4 — Module 204 | Révision `204-v001` active | Cours de 31 blocs, schéma de périmètre et matrice des structures de marché, 14 termes. Sept calculs CFC dont quatre AFP, sept vérifications CFC dont six AFP et cinq situations CFC dont quatre AFP. [Préparation du 204](preparation/204-v001.json). |
| L4 — Module 205 | Révision `205-v001` active | Cours de 52 blocs, courbes d’offre et de demande, schémas des quatre P et d’AIDA, 14 termes. Sept calculs CFC dont quatre AFP, sept vérifications CFC dont six AFP et cinq situations CFC dont quatre AFP. [Préparation du 205](preparation/205-v001.json). |
| L4 — Module 206 | Révision `206-v001` active | Cours de 67 blocs, trois schémas sur la transmission, l’écoute et les questions, 14 termes. Sept calculs CFC dont cinq AFP, sept vérifications CFC dont six AFP et cinq situations CFC dont quatre AFP. [Préparation du 206](preparation/206-v001.json). |
| L4 — Module 207 | Révision `207-v001` active | Cours de 22 blocs, deux schémas sur l’offre et la comparaison de fournisseurs, 14 termes. Sept calculs CFC dont cinq AFP, six vérifications CFC dont cinq AFP et cinq situations CFC dont quatre AFP. [Préparation du 207](preparation/207-v001.json). |
| L4 — Module 208 | Révision `208-v001` active | Cours de 69 blocs, trois schémas sur l’entretien, la promotion et les engagements du vendeur et de l’acheteur, 14 termes. Sept calculs CFC dont cinq AFP, sept vérifications CFC dont six AFP et cinq situations CFC dont quatre AFP. [Préparation du 208](preparation/208-v001.json). |
| L4 — Module 209 | Révision `209-v001` active | Cours de 40 blocs, trois schémas sur les réclamations, la garantie et le suivi client, 14 termes. Sept calculs CFC dont cinq AFP, sept vérifications CFC dont six AFP et cinq situations CFC dont quatre AFP. [Préparation du 209](preparation/209-v001.json). |
| L2 — Module 308 | Révision `308-v001` active | Cours de 51 blocs, schéma brut–tare–net et 25 termes. Cinq problèmes CFC dont quatre AFP, sept vérifications et six situations CFC dont quatre AFP. Les écarts sur le comptage par pesage et la métrologie suisse figurent dans la [préparation du 308](preparation/308-v001.json). |
| L2 — Module 613 | Révision `613-v001` active | Cours de 35 blocs, schéma des trois flux et 21 termes. Les catégories absentes du Git source sont renseignées par cinq calculs CFC dont quatre AFP et huit vérifications communes. Six situations CFC dont cinq AFP. Le catalogue conserve les années 3 CFC et 2 AFP. [Préparation du 613](preparation/613-v001.json). |
| L2 — Module 805 | Révision `805-v001` active en CFC | Cours de 163 blocs, schéma des styles et du sommaire, 23 termes, cinq calculs, sept vérifications et cinq situations. Cours autonome à l’écrit après exclusion des 85 références visuelles historiques. [Préparation du 805](preparation/805-v001.json). |
| L2 — Module 902 | Révision `902-v001` active en CFC | Cours original de 40 blocs, schéma de résolution, 22 termes, sept calculs, sept vérifications et six études de cas. Le [cours original](preparation/902-v001.md) et les [données éditoriales](preparation/902-v001.json) distinguent les créations de l’archive EPCAS vide. |
| L3c et V2.10 — Visuels | Pilote | Le schéma original du degré de transformation est rangé sous `public/assets/logistique/100/105/commun/`. Le [registre du visuel](pilote-105/visuels/registre.json) conserve l’empreinte, la révision et l’éligibilité. |
| L4 et suivants — Généralisation | À poursuivre | Reprendre les thèmes dans l’ordre du référentiel et mesurer les unités effectivement disponibles par diplôme. Les cibles nominales de banque restent à atteindre. |
| L4 — Module 301 | Révision `301-v001` active en CFC et AFP | 2 schémas, 12 termes, 6/4 calculs, 6 vérifications et 4/3 situations. Les paires donnent les quantités CFC puis AFP. [Préparation du 301](preparation/301-v001.json). |
| L4 — Module 302 | Révision `302-v001` active en CFC et AFP | 2 schémas, 12 termes, 6/4 calculs, 6 vérifications et 4/3 situations. Les paires donnent les quantités CFC puis AFP. [Préparation du 302](preparation/302-v001.json). |
| L4 — Module 303 | Révision `303-v001` active en CFC et AFP | 2 schémas, 12 termes, 6/4 calculs, 6 vérifications et 4 situations. Les paires donnent les quantités CFC puis AFP. [Préparation du 303](preparation/303-v001.json). |
| L4 — Module 304 | Révision `304-v001` active en CFC et AFP | 2 schémas, 12 termes, 6/4 calculs, 6 vérifications et 4/3 situations. Les paires donnent les quantités CFC puis AFP. [Préparation du 304](preparation/304-v001.json). |
| L4 — Module 305 | Révision `305-v001` active en CFC et AFP | 2 schémas, 12 termes, 6/4 calculs, 6 vérifications et 4/3 situations. Les paires donnent les quantités CFC puis AFP. [Préparation du 305](preparation/305-v001.json). |
| L4 — Module 306 | Révision `306-v001` active en CFC et AFP | 2 schémas, 12 termes, 6/4 calculs, 6 vérifications et 4 situations. Les paires donnent les quantités CFC puis AFP. [Préparation du 306](preparation/306-v001.json). |
| L4 — Module 307 | Révision `307-v001` active en CFC et AFP | 2 schémas, 12 termes, 6/4 calculs, 6 vérifications et 4/3 situations. Les paires donnent les quantités CFC puis AFP. [Préparation du 307](preparation/307-v001.json). |
| L4 — Module 309 | Révision `309-v001` active en CFC et AFP | 2 schémas, 12 termes, 6/4 calculs, 6 vérifications et 4/3 situations. Les paires donnent les quantités CFC puis AFP. [Préparation du 309](preparation/309-v001.json). |
| L4 — Module 310 | Révision `310-v001` active en CFC et AFP | 2 schémas, 12 termes, 6/4 calculs, 6 vérifications et 4 situations. Les paires donnent les quantités CFC puis AFP. [Préparation du 310](preparation/310-v001.json). |
| L4 — Module 311 | Révision `311-v001` active en CFC et AFP | 2 schémas, 12 termes, 6/4 calculs, 6 vérifications et 4/3 situations. Les paires donnent les quantités CFC puis AFP. [Préparation du 311](preparation/311-v001.json). |
| L4 — Module 312 | Révision `312-v001` active en CFC et AFP | 2 schémas, 12 termes, 6/4 calculs, 6 vérifications et 4 situations. Les paires donnent les quantités CFC puis AFP. [Préparation du 312](preparation/312-v001.json). |
| L4 — Module 401 | Révision `401-v001` active en CFC et AFP | 2 schémas, 12 termes, 5/4 calculs, 5 vérifications et 3 situations. Les paires donnent les quantités CFC puis AFP. [Préparation du 401](preparation/401-v001.json). |
| L4 — Module 402 | Révision `402-v001` active en CFC et AFP | 2 schémas, 12 termes, 5/4 calculs, 5 vérifications et 3 situations. Les paires donnent les quantités CFC puis AFP. [Préparation du 402](preparation/402-v001.json). |
| L4 — Module 403 | Révision `403-v001` active en CFC et AFP | 2 schémas, 12 termes, 5/4 calculs, 5 vérifications et 3 situations. Les paires donnent les quantités CFC puis AFP. [Préparation du 403](preparation/403-v001.json). |
| L4 — Module 404 | Révision `404-v001` active en CFC et AFP | 2 schémas, 12 termes, 5/4 calculs, 5 vérifications et 3 situations. Les paires donnent les quantités CFC puis AFP. [Préparation du 404](preparation/404-v001.json). |
| L4 — Module 405 | Révision `405-v001` active en CFC et AFP | 2 schémas, 12 termes, 5/4 calculs, 5 vérifications et 3 situations. Les paires donnent les quantités CFC puis AFP. [Préparation du 405](preparation/405-v001.json). |
| L4 — Module 406 | Révision `406-v001` active en CFC et AFP | 2 schémas, 12 termes, 5/4 calculs, 5 vérifications et 3 situations. Les paires donnent les quantités CFC puis AFP. [Préparation du 406](preparation/406-v001.json). |
| L4 — Module 407 | Révision `407-v001` active en CFC et AFP | 2 schémas, 12 termes, 5/4 calculs, 5 vérifications et 3 situations. Les paires donnent les quantités CFC puis AFP. [Préparation du 407](preparation/407-v001.json). |
| L4 — Module 408 | Révision `408-v001` active en CFC et AFP | 2 schémas, 12 termes, 5/4 calculs, 5 vérifications et 3 situations. Les paires donnent les quantités CFC puis AFP. [Préparation du 408](preparation/408-v001.json). |
| L4 — Module 409 | Révision `409-v001` active en CFC et AFP | 2 schémas, 12 termes, 5/4 calculs, 5 vérifications et 3 situations. Les paires donnent les quantités CFC puis AFP. [Préparation du 409](preparation/409-v001.json). |
| L4 — Module 410 | Révision `410-v001` active en CFC et AFP | 2 schémas, 12 termes, 5/4 calculs, 5 vérifications et 3 situations. Les paires donnent les quantités CFC puis AFP. [Préparation du 410](preparation/410-v001.json). |
| L4 — Module 501 | Révision `501-v001` active en CFC | 2 schémas, 12 termes, 5 calculs, 5 vérifications et 3 situations. Les paires donnent les quantités CFC puis AFP. [Préparation du 501](preparation/501-v001.json). |
| L4 — Module 502 | Révision `502-v001` active en CFC | 2 schémas, 12 termes, 5 calculs, 5 vérifications et 3 situations. Les paires donnent les quantités CFC puis AFP. [Préparation du 502](preparation/502-v001.json). |
| L4 — Module 503 | Révision `503-v001` active en CFC | 2 schémas, 12 termes, 5 calculs, 5 vérifications et 3 situations. Les paires donnent les quantités CFC puis AFP. [Préparation du 503](preparation/503-v001.json). |
| L4 — Module 504 | Révision `504-v001` active en CFC | 2 schémas, 12 termes, 5 calculs, 5 vérifications et 3 situations. Les paires donnent les quantités CFC puis AFP. [Préparation du 504](preparation/504-v001.json). |
| L4 — Module 505 | Révision `505-v001` active en CFC | 2 schémas, 12 termes, 5 calculs, 5 vérifications et 3 situations. Les paires donnent les quantités CFC puis AFP. [Préparation du 505](preparation/505-v001.json). |
| L4 — Module 506 | Révision `506-v001` active en CFC | 2 schémas, 12 termes, 5 calculs, 5 vérifications et 3 situations. Les paires donnent les quantités CFC puis AFP. [Préparation du 506](preparation/506-v001.json). |

## Reprise opérationnelle

1. Les onze modules du thème 100 et les neuf modules du thème 200 disposent des six types en CFC et AFP. Les thèmes 300 et 400 sont actifs dans les deux diplômes et le thème 500 en CFC. Poursuivre avec les modules 601 à 612 et 614 à 616. Le module 613 est déjà actif. Les cibles nominales de contenu et la recette complète restent à atteindre. Partir des [archives par thème](sources-epcas/), préparer les six types et vérifier visuels et composition ensemble avant publication.
2. Vérifier les corrigés, la place du contenu dans le référentiel, les écarts AFP/CFC et les dépendances à des médias écartés.
3. Enregistrer une révision de banque et la conserver pour les recettes déjà créées. Les changements de fond du 105 sont consignés dans les [données de préparation](pilote-105/preparation.generated.json) et dans le [dossier éditorial](pilote-105/relecture.md).
4. Vérifier dans les deux diplômes le nombre d’unités disponibles, la génération, le corrigé, l’impression et la réouverture. Reporter dans ce fichier les preuves, les écarts et le prochain module retenu.

## Commandes

- `node scripts/import-logistique-epcas.mjs /chemin/vers/epcas` produit le catalogue et les archives à partir des objets Git de référence.
- `node scripts/prepare-logistique-module.mjs 101-v001` reconstitue la banque du 101 à partir de l’archive et de sa préparation éditoriale. La même commande accepte une révision de la [préparation éditoriale](preparation/), par exemple `104-v001`.
- `node scripts/prepare-logistique-105.mjs` reproduit la révision historique du 105.
- `node scripts/prepare-logistique-illustrated-publication.mjs` reconstitue les objectifs, aperçus et théories de la V2.12. Pour les nouveaux modules, le compilateur standard sépare ces contenus à partir des champs source ou des textes éditoriaux `objectives` et `overview`. Les illustrations se déclarent dans `visuals` avec leurs ancrages et empreintes.
- `npm run test:logistique` et `npm run test:logistique:browser` vérifient le catalogue, l’éligibilité, le gabarit et les recettes.

## Résultats de recette

### Thèmes 300 à 600 — Publications

- Modules 301 à 303, soit 36 contextes module, diplôme et type vérifiés en Chromium A4. Réserve minimale au pied de 79,64 px. Les aperçus occupent une page, les cours illustrés produisent un PDF et les suites de calcul gardent les numéros.

- La recette du 302 a révélé que quatre problèmes courts pouvaient dépasser la réserve. Le calcul de pagination compte désormais la hauteur minimale du bloc de calcul. La suite de génération passe six tests.
- Modules 304 à 312, soit 96 contextes module, diplôme et type vérifiés en Chromium A4. Réserve minimale au pied de 53,14 px. Les aperçus occupent une page, les cours illustrés produisent un PDF et les suites de calcul gardent les numéros.
- Modules 401 à 410, soit 120 contextes module, diplôme et type vérifiés en Chromium A4. Réserve minimale au pied de 79,64 px. Les aperçus occupent une page, les cours illustrés produisent un PDF et les suites de calcul gardent les numéros.
- Modules 501 à 506, soit 36 contextes module, diplôme et type vérifiés en Chromium A4. Réserve minimale au pied de 79,64 px. Les aperçus occupent une page, les cours illustrés produisent un PDF et les suites de calcul gardent les numéros.

### Thème 200 — Déploiement du 27 novembre

- `logistique-203-204-v001` ajoute 24 contextes générables en comptant les deux diplômes et les six types. Couverture active de 114 types sur 480 en CFC et 102 sur 378 en AFP. Chromium a contrôlé les 24 parcours A4, les aperçus d’une page, les cours illustrés en PDF et les suites de calculs élève et corrigé numérotées dans l’ordre. Réserve minimale au pied de 79,64 px. `npm run test:logistique` donne 5 réussites.

- `logistique-205-206-v001` ajoute 24 contextes générables. Couverture active de 126 types sur 480 en CFC et 114 sur 378 en AFP. Chromium a vérifié les 24 parcours A4, dont les nouveaux schémas et la numérotation continue des calculs, avec une réserve minimale au pied de 79,64 px. Les 5 tests de génération passent.

- `logistique-207-208-209-v001` termine l’activation des six types du thème 200 dans les deux diplômes. Chromium a vérifié les 36 parcours du lot en A4, dont les objectifs et aperçus sur une page, les schémas intégrés au PDF de théorie et la numérotation des calculs. Réserve minimale de 58,80 px et 5 tests de génération réussis.
- Le thème 200 compte neuf modules actifs dans les deux diplômes. Les trois lots du jour ajoutent sept modules, 18 schémas et 84 parcours A4 vérifiés. Le relevé de génération confirme 144 types actifs sur 480 en CFC et 132 sur 378 en AFP. Les tirages de la publication `logistique-references-v002` sont reproductibles avec leur révision d’origine.

### Publication V2.12

- Chromium a imprimé les objectifs et aperçus sur une page pour les 32 couples module et diplôme actifs. Les théories ont conservé les figures et leurs légendes. Les 31 nouveaux schémas ont passé le contrôle de débordement des libellés.
- Les 96 combinaisons de module, diplôme et type d’exercice évaluées avec les réglages A4 par défaut ont conservé au moins 36,55 px avant le pied de page. Les modules 105 et 110 ont donné des suites de questions numérotées sans reprise à 1 dans la fiche élève et le corrigé. La suite de génération couvre aussi un saut manuel explicite.
- Le 110 reste lisible en A4 avec une taille de texte de 20 px. En double A5, le même exercice conserve le gabarit et tient à raison d’une question par demi-feuille. Le corrigé descend à 16,8 px de réserve dans ce cas. La cible de 25 px reste à vérifier sur le double A5.
- Le PDF du 105 obtenu à partir d’une fenêtre de 390 px mesure 594,96 × 841,92 pt. L’aperçu du module occupe une page et la théorie illustrée, 14 pages.
- `node --test tests/logistique/generation.test.mjs tests/interactive/fiches-access.test.mjs` donne 12 réussites. La recette Chromium de sauvegarde simulée et de réouverture passe. TypeScript, lint et build Vite passent avec avertissements.
- Couverture active de la V2.12. 102 types sur 480 en CFC et 90 sur 378 en AFP. Les cibles nominales et la recette de tous les réglages et contenus libres restent à poursuivre.

### Lots précédents

- Pilote actif 105 CFC et AFP en Chromium. La théorie restitue 98 blocs, le glossaire 45 entrées et les exercices et leurs corrigés occupent les mêmes rendus que les autres domaines.
- API de fiches avec Worker et D1 locaux. Enregistrement et lecture testés pour les deux diplômes et refus du module 902 en AFP et des recettes mixtes.
- Modules 106 à 108 en Chromium avec les réglages par défaut. Les 30 combinaisons de module, diplôme et type utilisent le gabarit A4. Grille et bascule vers le corrigé vérifiées en mathématiques, schémas et PDF en théorie. La réserve minimale mesurée au pied des pages élève est de 79,64 px. `npm run test:logistique` passe 3 tests sur 3.
- Modules 100, 109 et 110 en Chromium avec les réglages par défaut. Les 30 combinaisons de module, diplôme et type utilisent le gabarit A4. Grille et bascule vers le corrigé vérifiées en mathématiques, schémas et PDF en théorie. La réserve minimale mesurée au pied des pages élève est de 39,95 px. `npm run test:logistique` passe 3 tests sur 3 et la compilation TypeScript réussit.
- Modules 201 et 202 en Chromium avec les réglages par défaut. Les 20 combinaisons de module, diplôme et type utilisent le gabarit A4. Grille, bascule vers le corrigé, schémas et PDF vérifiés. La réserve minimale mesurée au pied des pages élève est de 79,64 px. `npm run test:logistique` passe 3 tests sur 3.
- Publication `logistique-201-202-v001`. Le tirage contrôlé sur les 715 types donne 85 types actifs sur 400 en CFC et 75 sur 315 en AFP. Les contenus tirés des anciens modules sont identiques à ceux de `logistique-109-110-v001` avec la même graine. Les recettes figées conservent leur publication.
- Suite interactive générale lancée pendant la reprise. 564 réussites sur 567. Les trois tests en échec échouent aussi sur la révision de départ. Ils concernent le pool « Nommer les formes », les transcriptions CO et les cotes des triangles.

- Modules 100 à 104, 106 à 110, 201, 202, 308, 613, 805 et 902. L’assemblage vérifie les corrections, l’empreinte des schémas et la présence de contenus dans les cinq types pour chaque diplôme éligible. Le relevé Chromium du pilote ci-dessus s’applique au 105.
