# Parler des aliments — relecture du pilote A1/A2

Le thème est livré en entier : six notions, sept couples notion/niveau, dix-neuf activités et vingt banques couvrant les vingt-sept offres prévues. Les 970 unités sélectionnables donnent 1 360 variantes de présentation. La validation pédagogique humaine reste en attente.

| Notion | Niveau | Présentations | Unités | Variantes |
| --- | --- | --- | ---: | ---: |
| g1 — articles indéfinis | A1 | QCM, lacune, association | 100 | 150 |
| g2 — articles définis | A1 | QCM, lacune, transformation, correction | 150 | 200 |
| g3 — articles partitifs | A1 | QCM, lacune, situation orale | 100 | 150 |
| g4 — quantités | A1 | QCM, lacune, association, situation, écrit, oral, lecture | 270 | 360 |
| g5 — déterminants indéfinis | A2 | QCM, lacune, transformation, correction | 150 | 200 |
| g6 — articles contractés | A1/A2 | QCM et lacune aux deux niveaux, transformation et correction en A2 | 200 | 300 |

Les sept fichiers TSV contiennent cinquante lignes chacun, soit 350 situations sources. Ces sources sont volontairement réemployées entre mécaniques : les comptes ci-dessus ne prétendent pas représenter 970 histoires indépendantes. Les vingt documents de lecture reprennent vingt situations de g4 et ajoutent un fait de contexte vérifiable. Chaque document comporte trois questions distinctes : produit, quantité et situation, soit soixante questions.

## Décisions linguistiques

- **g1** : les quantités comptables sont explicites dans le texte ; le genre et le nombre du nom sont indiqués. Les associations comportent deux phrases autonomes et deux articles différents.
- **g2** : références déjà identifiées, catégories générales et goûts, y compris « Je n’aime pas le chocolat ». L’élision distingue le h muet de « huile » et le h aspiré de « haricot ». Les transformations des goûts demandent explicitement la généralisation ; elles ne promettent pas de conserver le sens démonstratif initial. La correction d’une élision retire aussi l’espace avant le nom.
- **g3** : portions et matières non dénombrées, puis de/d’ dans une négation générale de quantité. Les explications excluent explicitement les contrastes et les constructions avec être de cette règle de travail. Les modèles de dialogue acceptent les reformulations fidèles aux faits.
- **g4** : nombres sans de, mesures, contenants et expressions suivies de/d’. Le texte impose la quantité pour éviter plusieurs réponses de sens différent. Le produit n’est pas présenté comme un lot défini nécessitant « du/des » après la quantité. Les lacunes disposent de 75 mm pour les groupes longs. Le modèle écrit donne une phrase complète ; l’ajout d’une précision cohérente est facultatif.
- **g5** : chaque, quelques, plusieurs, certain(e)s, tout(e/s) et aucun(e). La famille demandée est imposée : « quelques », « plusieurs » et « certains » peuvent autrement convenir au même contexte. Les transformations évaluent aussi le passage singulier/pluriel du nom et du verbe. Les corrections ciblent une erreur réelle de forme ou d’accord, sans changer de famille. Aucun(e) est employé avec ne, sans pas, dans les cas singuliers proposés.
- **g6 A1** : les huit groupes à/de + le/la/l’/les, avec ou sans contraction. **g6 A2** : quinze cas de du partitif, trente groupes contractés et cinq des indéfinis devant des noms comptables. L’analyse grammaticale se fait dans une phrase complète : une étiquette comme « article partitif » n’est jamais insérée à la place de l’article devant un nom. Les pluriels massifs dont la terminologie varie selon les grammaires sont évités. Les transformations et corrections portent sur les phrases alimentaires ou situationnelles, pas sur les étiquettes d’analyse.

## Illustrations et traçabilité

Les obligations IMG-g1-A1, IMG-g3-A1 et IMG-g4-A1 disposent chacune de cinquante situations illustrées. Le manifeste documente **81 images distinctes**, toutes reprises du catalogue interne, sans génération ni retouche. Les copies immuables sont identiques aux originaux selon SHA-256. Les images servent de repères lexicaux : le texte, et non le nombre d’objets représentés, impose le nombre, le poids ou le contenant. Trois planches finales sont conservées dans le dossier de preuves.

La compote utilise une image TCF alimentaire ; une image de crème ambiguë, une orange de style pixel et une image de plusieurs plats employée comme ustensile ont été écartées. Le sel est illustré par du sel.

## Contrôles et limites

Les tests contrôlent les réponses fermées uniques, les associations à deux réponses distinctes, les 150 intervalles de correction, les recettes figées, les tirages, les capacités, les niveaux, les corrigés ouverts et les empreintes des médias. La recette navigateur parcourt toutes les variantes, côté élève et corrigé, avec contrôle du budget de première page A4. Des PDF réellement produits par Chromium complètent la mesure du DOM.

Les anciennes banques écrites g1 à g6 et le groupe de communication historique g4 sont retirés. Les autres thèmes, les théories et la compréhension orale restent conservés. Aucun accès ni nettoyage des fiches enregistrées, aucun déploiement Worker et aucune fonctionnalité de gamemode ne font partie de cette livraison.

Restent la relecture pédagogique par un enseignant, une impression physique et un essai matériel en classe/ENI. La théorie historique demeure protégée : les banques distinguent le h aspiré du h muet ; une éventuelle précision du texte théorique devra faire l’objet d’une revue dédiée.
