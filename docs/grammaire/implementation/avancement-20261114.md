# Avancement du curriculum Grammaire — 14 novembre 2026

Référence : [cahier des charges v2](cahier-des-charges-v2.md) et [registre détaillé](target-registry.json). Base de cette tranche : `a49a9297`. Les banques sont accessibles en **pilote explicite**, avec **approbation enseignante en attente**.

## Dernière tranche — Se présenter A1

| Notion | Activités | Offres | Unités sélectionnables | Variantes |
| --- | ---: | ---: | ---: | ---: |
| Pronoms sujet | 3 | 4 | 150 | 200 |
| Dire sa provenance | 6 | 9 | 300 | 450 |
| Ajout total | 9 | 13 | 450 | 650 |

**Se présenter dispose de 13 offres sur 40 en pilote.** Les pronoms proposent complétion QCM/lacune, association et remplacement du sujet. La provenance propose reconnaissance du pays en image, choix de la préposition, conjugaison de venir, association, production écrite à deux images et oral contextualisé.

Les 50 complétions de pronoms sont réemployées et clarifiées ; les 50 transformations ont des sujets nominaux et directives explicites. Les 50 contextes de provenance sont partagés entre tâches : les 450 unités ne sont pas 450 nouveaux scénarios. Les associations conservent trois réponses distinctes et les références de leurs sources.

Les médias comprennent **20 fichiers existants réemployés : 17 pays et trois références de personnages**. Chaque copie est immuable et contrôlée par SHA-256. Aucun média n’est généré. L’image historique du Japon est écartée pour couleurs inversées ; sa correction reste à faire. La nationalité est donnée explicitement dans les fiches fictives. Les modèles ouverts restent dans le corrigé avec appréciation enseignante.

Dans le choix de préposition, le genre est en couleur à droite du trait, aussi au tableau. Relectures : [pronoms](a2-a1-relecture.md), [provenance](a6-a1-relecture.md), [manifeste des images](presentation-media.json).

Les thèmes **Entrer en contact (19/19)** et **Conjuguer au présent (72/72)** restent complets en pilote. Leurs relectures et vérifications antérieures restent tracées dans [README](README.md) et [verification.json](verification.json).

## Couverture cumulée

| Mesure | Pilotes disponibles | Cible | Sans banque pilote |
| --- | ---: | ---: | ---: |
| Notions | 19 | 98 | 79 |
| Couples notion/niveau | 23 | 123 | 100 |
| Activités distinctes | 89 | 424 | 335 |
| Offres activité/niveau/présentation | 122 | 601 | 479 |

**4 760 unités sélectionnables et 6 130 variantes**, dont **60 documents et 180 questions de lecture** inchangés. Les documents sont inclus dans les unités sélectionnables, leurs questions dans les variantes ; ces colonnes ne s’additionnent pas.

Le [CSV des 601 offres](reste-a-faire-20261114.csv) donne l’action restante pour chacune : approbation enseignante des 122 pilotes ou préparation des 479 autres offres.

## Offres par thème

| Thème | Pilotes | Cible | À préparer |
| --- | ---: | ---: | ---: |
| Se présenter | 13 | 40 | 27 |
| Conjuguer au présent | 72 | 72 | 0 |
| Parler du passé | 6 | 49 | 43 |
| Parler de l'avenir | 0 | 27 | 27 |
| Décrire | 0 | 63 | 63 |
| Entrer en contact | 19 | 19 | 0 |
| Poser une question | 0 | 24 | 24 |
| Phrase exclamative | 0 | 9 | 9 |
| Parler d'une activité | 0 | 15 | 15 |
| Se situer dans l'espace | 0 | 18 | 18 |
| Se situer dans le temps | 0 | 28 | 28 |
| Demander et proposer | 0 | 16 | 16 |
| Conseiller quelqu'un | 0 | 16 | 16 |
| Parler des aliments | 0 | 27 | 27 |
| Les pronoms | 7 | 41 | 34 |
| Parler d'une action | 0 | 24 | 24 |
| Parler des faits divers | 0 | 35 | 35 |
| S'expliquer et argumenter | 0 | 15 | 15 |
| Exprimer quelque chose | 5 | 63 | 58 |

## Contrôles de cette tranche

Les 13 offres passent dans Chromium : 1 300 unités élève/corrigé et 400 affichages d’images, sans débordement ; six lancements au tableau. Les essais techniques de média, dont les erreurs et l’attente avant impression, passent. La hauteur des illustrations appariées est ajustée sans retirer de ligne d’écriture.

Les ajouts TCF/catalogues jusqu’à `683c7bdf` sont intégrés. TypeScript, la compilation, G0 (735 sorties / 256 fichiers protégés), les 6 130 variantes, les contrats et les tests ciblés passent après intégration. Le navigateur reste tracé sur `a49a9297` ; aucun contrôle global des 122 offres sur une même base n’est déclaré.

## Suite du cahier des charges

1. Terminer Se présenter : identité/informations personnelles fictives (11 offres), nationalités (8) et famille (8), soit 27 offres. Réemployer les portraits, documents et autres supports adaptés aux contrats.
2. Compléter les autres thèmes A1 puis les extensions A2/B1 avec des différences pédagogiques réelles.
3. Généraliser les dialogues/situations et remplir les onze obligations I des autres notions avec les médias existants. Les essais techniques et les supports de provenance ne soldent pas ces obligations.
4. Compléter la manipulation de toutes les associations dans un tableau : l’interface actuelle propose les paires successivement.
5. Faire relire et approuver les unités et supports par un enseignant avant publication pédagogique.
6. Composer les révisions G6 puis achever la recette G7 des niveaux, supports, sauvegardes, A4, tableau et guide.

La divergence antérieure du test global de théorie (99 fiches attendues, 98 fiches actuelles avec alias a5 → a4) reste distincte. Les audios et banques CO historiques ne sont pas modifiés par cette tranche. Le statut précis des contrôles et leurs bases est conservé dans [verification.json](verification.json).
