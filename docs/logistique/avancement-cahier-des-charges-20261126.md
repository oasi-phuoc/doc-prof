# Avancement du cahier des charges Logistique CFC et AFP

**Point de reprise du 26 novembre 2026**

Référence de réalisation dans le [cahier des charges v2.11](cahier-des-charges.md). Révision Doc-Prof de départ `0a23f9287`. Révision EPCAS `ac2ceeae3ba7944fb4d24a7de103d41d3da98e1f`.

## Décisions du responsable

- Conserver la structure des fiches, le gabarit A4 et le générateur existants.
- Partir du parcours standard après retrait de l’ancien écran Logistique.
- Relire et activer directement les contenus exploitables. Conserver le détail des corrections pour les révisions ultérieures.

## Avancement par lot

| Lot | État | Preuves et reprise |
|---|---|---|
| L0 — Existant et inventaire | Réalisé | Les 9 thèmes et 80 modules CFC, les 7 thèmes et 63 modules AFP et les 715 types sont générés depuis la référence EPCAS. 540 déclarations source archivées, parmi lesquelles 149 références historiques exclues. L’[inventaire](inventaire-epcas.generated.json) repère 16 types sans déclaration en CFC et 7 en AFP. |
| L1 — Générateur commun | Pilote actif | Sélecteurs communs, feuille, activités, élève, corrigé, grille, titres, impression, Libre générique et recettes versionnées. Les contrôles de catalogue empêchent les recettes incompatibles avec le diplôme ou mélangeant les diplômes. |
| L1b à L1d — Sélection et formats | Partiel | Le tirage déterministe, les questions ouvertes, les QCM, les calculs et les cas simples sont pris en charge. La sélection individuelle en banque, l’évaluation multi-sous-thèmes au sein d’une activité et les formats avancés demandent encore un raccordement aux contrôles existants. |
| L1e — Pagination et titres | Pilote | Titres automatiques, sauts manuels et découpage automatique initial. Chromium a mesuré au moins 25 px de réserve sur chaque page imprimée des cinq types du 105, dans les deux diplômes avec le format A4 et les réglages par défaut. Étendre la mesure à toutes les combinaisons de formats, réglages et textes longs. |
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
| L2 — Module 308 | Révision `308-v001` active | Cours de 51 blocs, schéma brut–tare–net et 25 termes. Cinq problèmes CFC dont quatre AFP, sept vérifications et six situations CFC dont quatre AFP. Les écarts sur le comptage par pesage et la métrologie suisse figurent dans la [préparation du 308](preparation/308-v001.json). |
| L2 — Module 613 | Révision `613-v001` active | Cours de 35 blocs, schéma des trois flux et 21 termes. Les catégories absentes du Git source sont renseignées par cinq calculs CFC dont quatre AFP et huit vérifications communes. Six situations CFC dont cinq AFP. Le catalogue conserve les années 3 CFC et 2 AFP. [Préparation du 613](preparation/613-v001.json). |
| L2 — Module 805 | Révision `805-v001` active en CFC | Cours de 163 blocs, schéma des styles et du sommaire, 23 termes, cinq calculs, sept vérifications et cinq situations. Cours autonome à l’écrit après exclusion des 85 références visuelles historiques. [Préparation du 805](preparation/805-v001.json). |
| L2 — Module 902 | Révision `902-v001` active en CFC | Cours original de 40 blocs, schéma de résolution, 22 termes, sept calculs, sept vérifications et six études de cas. Le [cours original](preparation/902-v001.md) et les [données éditoriales](preparation/902-v001.json) distinguent les créations de l’archive EPCAS vide. |
| L3c et V2.10 — Visuels | Pilote | Le schéma original du degré de transformation est rangé sous `public/assets/logistique/100/105/commun/`. Le [registre du visuel](pilote-105/visuels/registre.json) conserve l’empreinte, la révision et l’éligibilité. |
| L4 et suivants — Généralisation | À poursuivre | Reprendre les thèmes dans l’ordre du référentiel et mesurer les unités effectivement disponibles par diplôme. Les cibles nominales de banque restent à atteindre. |

## Reprise opérationnelle

1. Terminer le thème 100 avec les modules 109 et 110. Les six sous-modules pilotes 105, 101, 308, 613, 805 et 902 fournissent maintenant des unités actives. La recette complète et la généralisation restent à effectuer. Partir des archives par thème sous [sources-epcas](sources-epcas/), puis convertir les contenus autonomes en unités des cinq types existants.
2. Vérifier les corrigés, la place du contenu dans le référentiel, les écarts AFP/CFC et les dépendances à des médias écartés.
3. Enregistrer une révision de banque et la conserver pour les recettes déjà créées. Les changements de fond du 105 sont consignés dans les [données de préparation](pilote-105/preparation.generated.json) et dans le [dossier éditorial](pilote-105/relecture.md).
4. Vérifier dans les deux diplômes le nombre d’unités disponibles, la génération, le corrigé, l’impression et la réouverture. Reporter dans ce fichier les preuves, les écarts et le prochain module retenu.

## Commandes

- `node scripts/import-logistique-epcas.mjs /chemin/vers/epcas` produit le catalogue et les archives à partir des objets Git de référence.
- `node scripts/prepare-logistique-module.mjs 101-v001` reconstitue la banque du 101 à partir de l’archive et de sa préparation éditoriale. La même commande accepte une révision de la [préparation éditoriale](preparation/), par exemple `104-v001`.
- `node scripts/prepare-logistique-105.mjs` produit les données éditoriales et la banque active du 105.
- `npm run test:logistique` et `npm run test:logistique:browser` vérifient le catalogue, l’éligibilité, le gabarit et les recettes.

## Résultats de recette

- Pilote actif 105 CFC et AFP en Chromium. La théorie restitue 98 blocs, le glossaire 45 entrées et les exercices et leurs corrigés occupent les mêmes rendus que les autres domaines.
- API de fiches avec Worker et D1 locaux. Enregistrement et lecture testés pour les deux diplômes et refus du module 902 en AFP et des recettes mixtes.
- Modules 106 à 108 en Chromium avec les réglages par défaut. Les 30 combinaisons de module, diplôme et type utilisent le gabarit A4. Grille et bascule vers le corrigé vérifiées en mathématiques, schémas et PDF en théorie. La réserve minimale mesurée au pied des pages élève est de 79,64 px. `npm run test:logistique` passe 3 tests sur 3.
- Suite interactive générale lancée pendant la reprise. 564 réussites sur 567. Les trois tests en échec échouent aussi sur la révision de départ. Ils concernent le pool « Nommer les formes », les transcriptions CO et les cotes des triangles.

- Modules 100 à 104, 106 à 108, 308, 613, 805 et 902. L’assemblage vérifie les corrections, l’empreinte des schémas et la présence de contenus dans les cinq types pour chaque diplôme éligible. Le relevé Chromium du pilote ci-dessus s’applique au 105.
