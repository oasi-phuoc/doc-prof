# Relecture — La comparaison, A1 et A2

Date : 23 novembre 2026. Statut : pilote ; validation enseignante en attente. Cette tranche termine les dix offres prévues pour f9 et porte le thème Décrire à 31 offres sur 63.

Accès : Grammaire → Décrire → La comparaison → A1 — pilote ou A2 — pilote. Quatre activités par niveau : Comparer une qualité (QCM/lacune), Transformer une phrase, Produire à l’écrit et S’exprimer à l’oral.

| Niveau | Banques | Offres | Unités sélectionnables | Réalisations |
| --- | ---: | ---: | ---: | ---: |
| A1 | 4 | 5 | 200 | 250 |
| A2 | 4 | 5 | 200 | 250 |
| Total | 8 | 10 | 400 | 500 |

Les deux TSV comprennent 50 situations A1 et 50 situations A2. Chaque situation est réemployée entre Q/L/T/E/P : les 400 unités sélectionnables ne constituent pas 400 histoires originales. Les niveaux peuvent reprendre un domaine de vie, avec des faits et des tâches différents. Aucun quota n’est établi à partir de graines, de permutations de réponses ou de changements de prénoms.

## Progression et langue

- A1 : comparer deux éléments avec plus, aussi ou moins… que. Prix, durée, distance, température, dimensions, ancienneté et critères de qualité explicitement définis. Les formes comparatives complètes comprennent l’accord de l’adjectif : plus grande, moins légère, aussi difficiles…
- A2 : comparer trois possibilités, tenir compte de plusieurs informations et, en production, choisir une possibilité qui respecte les conditions. Les limites de prix, de temps ou de dimensions sont données. Les comparaisons articulent souvent deux qualités avec mais ou et, sans prétendre qu’un objet est universellement préférable.
- Bon : meilleur, meilleure, meilleurs, meilleures ; aussi bon et moins bon gardent bon. Mauvais : pire / plus mauvais sont admis lorsque le contexte convient. Une variante recevable n’est jamais proposée comme fausse option.
- Les notes de goût, de confort, de calme, de difficulté ou de solidité appartiennent à des tests et récits fictifs. Leur sens est précisé. L’élève ne doit pas deviner une préférence personnelle, une propriété d’une image ou une appréciation sur un camarade.
- Les QCM ont trois options et une seule clé. Les lacunes donnent la comparaison complète au corrigé et réservent un trait de 55 mm en A1, de 90 mm en A2 pour les groupes plus longs. Les transformations conservent les faits et indiquent les éléments et adjectifs à employer.
- Les productions et transformations restent évaluées par l’enseignant. Les modèles sont non exclusifs ; les faits, les accords, le choix et sa justification constituent les critères. L’écrit réserve deux lignes en A1 et six en A2. Les échanges comportent une relance liée aux données. En A2, les faits restent dans le panneau de lecture du tableau ; la question ou la consigne apparaît séparément. Le défilement du texte reste accessible au clavier sur petit écran.

## Intégration et sources

`scripts/build-grammar-comparaison.py` compile seulement f9 à partir des deux sources `comparaison-f9-a1.tsv` et `comparaison-f9-a2.tsv`. La reconstruction de contrôle compare les octets dans un répertoire temporaire. Elle ne régénère pas les autres banques pendant les essais navigateur.

Les quatre types sont disponibles dans le pool avec leurs paramètres grammaticaux par défaut A1. Le niveau A2 se choisit dans le générateur et se conserve lors du passage de cette sélection au tableau. Le sélecteur de difficulté générique du pool ne constitue pas actuellement un sélecteur de niveau grammatical.

L’ancienne banque écrite f9 est supprimée ; les autres lignes sont comparées à la version antérieure. Le CO et les théories restent protégés. Le nettoyage des fiches enregistrées demeure différé à la demande du propriétaire. La requête D1 est seulement alignée localement ; aucun script de consultation ou de suppression des fiches distantes, aucun déploiement Worker.

Aucune obligation I ne concerne f9 dans le registre. Aucun média n’est ajouté ou généré. Les modifications de métadonnées d’images récupérées sur main sont conservées.

À poursuivre dans Décrire : place de l’adjectif f12 (8 offres), superlatif f13 (10), comparaison des quantités et activités f14 (8), description physique (6), soit 32 offres. Approbation enseignante, impression physique et recette ENI restent à effectuer.
