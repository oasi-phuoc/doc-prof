# Avancement du curriculum Grammaire — 21 novembre 2026

Références : [cahier des charges v2](cahier-des-charges-v2.md), [lot de 20 activités](lot-suivant-20-activites-se-presenter.md) et [registre détaillé](target-registry.json). Base de développement : `a5f66fb99`. Les banques sont accessibles en **pilote explicite**, avec **approbation enseignante en attente**.

## Tranche réalisée — identité, nationalités et famille A1

| Notion | Activités | Offres | Unités sélectionnables | Variantes |
| --- | ---: | ---: | ---: | ---: |
| Qui suis-je ? | 10 | 11 | 470 | 560 |
| Adjectifs de nationalité | 6 | 8 | 300 | 400 |
| Parler de sa famille, premiers types | 4 | 5 | 110 | 360 |
| Ajout total | **20** | **24** | **880** | **1 320** |

Les 880 unités comprennent **800 questions/situations et 80 documents**, avec **320 questions de lecture**. Chaque activité courte possède 50 unités ; chacune des quatre banques CE possède 20 textes et 60 ou 100 questions. Les documents sont inclus dans les unités sélectionnables, leurs questions dans les variantes : ces colonnes ne s’additionnent pas.

Dans **Grammaire → Se présenter**, choisir le sous-thème puis **A1 — pilote**. Le retour **Banque actuelle** retrouve les sources historiques. Les quatre activités QCM/lacune conservent un seul type et deux présentations. **Nombre de textes** choisit des documents complets, sans tronquer leurs questions à 50. Les sauts de page par ID, les preuves et les continuations du support sont conservés.

Les nouvelles lacunes personnelles et les formulaires ont des contrats canoniques dédiés. Les champs possèdent un ID, un libellé, une contrainte, un format et un modèle réservé au corrigé. Une identité fictive correcte reste recevable ; le tableau confie ces réponses à l’enseignant. Les portraits, eux, respectent les faits de leur fiche. Les jeux de rôle possèdent des rôles, intentions et relances adaptés à la situation.

Les nationalités couvrent les quatre accords, les formes épicènes, le pluriel et les élisions. Les indices de genre sont explicites et colorés ; le nom ou l’image ne servent pas à deviner la nationalité. Les possessifs couvrent les quinze formes et le cas mon/ton/son devant un nom féminin commençant par une voyelle ou un h muet. L’infinitif donné apparaît après le trait de réponse.

## Sources, réemploi et médias

Les 50 situations d’identité servent neuf tâches différentes ; les 50 prédicats de nationalité servent les six activités de la notion. Ce réemploi est déclaré : les compteurs ne représentent pas 880 histoires nouvelles. Les 20 lectures d’identité et les 20 faire-part sont rédigés séparément. Les 20 textes Photo de famille et les 20 Message et email adaptent les faits de sources historiques au niveau A1 ; les banques historiques de 29 supports chacune restent conservées.

Le bébé historique est copié sans modification depuis `a49ee23d85707ef103300090350373e6731f882a`, sous un chemin immuable SHA-256. Le faire-part Lucas conserve exactement les trois phrases demandées, une par ligne, à droite de l’image. Les autres supports réemploient les fichiers de présentation déjà tracés. Aucune image ni aucun audio n’est généré. La galerie retrouve les libellés des manifestes ; son index global n’est pas reconstruit à partir du checkout partiel.

Les images vérifiées partagent une URL temporaire entre aperçu et impression ; elle est libérée après le dernier affichage. Les octets divergents ou absents produisent un diagnostic et empêchent l’impression dépendante du média. Les recettes conservent toujours le chemin immuable et son empreinte.

Relectures exhaustives : [identité](a1-a1-extension-relecture.md), [nationalités](a3-a1-extension-relecture.md), [famille](famille-a1-extension-relecture.md). Provenance du bébé : [manifeste](family-media.json). Reconstruction : [sources éditoriales](../../../scripts/grammar_curriculum/README.md).

## Couverture cumulée

| Mesure | Pilotes disponibles | Cible | Sans banque pilote |
| --- | ---: | ---: | ---: |
| Notions | 22 | 98 | 76 |
| Couples notion/niveau | 26 | 123 | 97 |
| Activités distinctes | 109 | 424 | 315 |
| Offres activité/niveau/présentation | 146 | 601 | 455 |

Le registre contient **5 640 unités sélectionnables et 7 450 variantes**, dont **140 documents et 500 questions de lecture**. Aucune unité n’est encore approuvée par un enseignant. Le [CSV des 601 offres](reste-a-faire-20261121.csv) distingue les 146 pilotes à faire approuver des 455 offres à préparer.

**Se présenter atteint 37/40 offres** ; restent l’association, l’oral et la PE de famille. **Entrer en contact (19/19)** et **Conjuguer au présent (72/72)** restent complets en pilote. Le détail des autres thèmes reste celui du [bilan du 14 novembre](avancement-20261114.md).

## Vérification et limites

Les résultats datés sont consignés dans [verification-20261121.json](verification-20261121.json). Le nouveau lot passe ses 24 offres en impression A4 fixe, soit 2 640 réponses élève/corrigé, et 13 lancements au tableau. Les contrôles portent aussi sur les modèles masqués, les champs des formulaires, les indices colorés et la disposition du faire-part.

Les 13 offres existantes de pronoms et de provenance passent aussi : 1 300 réponses imprimées et six lancements au tableau. La hauteur des illustrations appariées est ajustée à 28 mm pour conserver les trois lignes d’écriture. Les cinq essais techniques de situations/images, trois lancements au tableau, les fichiers absents/divergents et l’attente avant impression passent. Les 7 450 variantes, TypeScript, les contrats de sauvegarde, les tests ciblés du tableau et les trois reconstructions déterministes passent également. Aucun contrôle global de l’ensemble des 146 offres au navigateur n’est déclaré.

Les trois ajouts TCF jusqu’à `99db92b0b` sont intégrés par rebase sans conflit. TypeScript, les 7 450 variantes, le test du nouveau lot et les contrats sont revérifiés après intégration. Les contrôles navigateur restent tracés sur la base de développement `a5f66fb99` ; les commits intégrés ne modifient ni les composants, ni la grammaire, ni les scripts ou tests concernés.

La comparaison de référence de cette tranche porte sur les **735 sorties historiques de `a5f66fb99`**, ainsi que sur les **256 fichiers protégés** : elles sont conservées. Le test G0 plus ancien possède déjà 66 écarts sur cette base, liés notamment à des évolutions de famille, de CO et de PE ; G0 n’est ni réenregistré ni déclaré passant. La divergence de théorie historique (99 fiches attendues, 98 actuelles et alias a5 → a4) reste distincte.

La relecture par l’assistant et les contrôles techniques ne remplacent pas une revue enseignante du français, du niveau et des usages en classe. Le statut reste `reviewed`, `humanReview: pending`, `pilot_preview`.

## Suite prévue

1. Implémenter le [lot 21 à 40](lot-21-40-famille-questions.md) : les trois activités restantes de famille, les questions fermées et ouvertes, puis la première activité avec quel.
2. Terminer les autres activités avec quel, les autres thèmes A1 et les extensions A2/B1.
3. Compléter les onze obligations I distinctes des supports déjà réemployés, les manipulations d’associations, les révisions G6 et la recette globale G7.
4. Faire approuver les banques et les supports par un enseignant avant publication pédagogique.
