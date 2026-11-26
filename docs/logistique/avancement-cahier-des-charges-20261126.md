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
| L2 et L3 — Module 105 | Révision `105-v001` active | Cours commun, 45 termes de glossaire, quatre calculs et quatre vérifications CFC, dont deux et deux en AFP, et deux situations communes. Le résumé réécrit est disponible dans les données éditoriales. L’ancien exercice SGH, dépendant de pictogrammes, demeure archivé. |
| L3c et V2.10 — Visuels | Pilote | Le schéma original du degré de transformation est rangé sous `public/assets/logistique/100/105/commun/`. Le [registre du visuel](pilote-105/visuels/registre.json) conserve l’empreinte, la révision et l’éligibilité. |
| L4 et suivants — Généralisation | À poursuivre | Reprendre les thèmes dans l’ordre du référentiel et mesurer les unités effectivement disponibles par diplôme. Les cibles nominales de banque restent à atteindre. |

## Reprise opérationnelle

1. Continuer avec 101 et 102, communs aux deux parcours. Partir des archives par thème sous [sources-epcas](sources-epcas/), puis convertir les contenus autonomes en unités des cinq types existants.
2. Vérifier les corrigés, la place du contenu dans le référentiel, les écarts AFP/CFC et les dépendances à des médias écartés.
3. Enregistrer une révision de banque et la conserver pour les recettes déjà créées. Les changements de fond du 105 sont consignés dans les [données de préparation](pilote-105/preparation.generated.json) et dans le [dossier éditorial](pilote-105/relecture.md).
4. Vérifier dans les deux diplômes le nombre d’unités disponibles, la génération, le corrigé, l’impression et la réouverture. Reporter dans ce fichier les preuves, les écarts et le prochain module retenu.

## Commandes

- `node scripts/import-logistique-epcas.mjs /chemin/vers/epcas` produit le catalogue et les archives à partir des objets Git de référence.
- `node scripts/prepare-logistique-105.mjs` produit les données éditoriales et la banque active du 105.
- `npm run test:logistique` et `npm run test:logistique:browser` vérifient le catalogue, l’éligibilité, le gabarit et les recettes.

## Résultats de recette

- Pilote actif 105 CFC et AFP en Chromium. La théorie restitue 98 blocs, le glossaire 45 entrées et les exercices et leurs corrigés occupent les mêmes rendus que les autres domaines.
- API de fiches avec Worker et D1 locaux. Enregistrement et lecture testés pour les deux diplômes et refus du module 902 en AFP et des recettes mixtes.
- Suite interactive générale lancée pendant la reprise. 564 réussites sur 567. Les trois tests en échec échouent aussi sur la révision de départ. Ils concernent le pool « Nommer les formes », les transcriptions CO et les cotes des triangles.
