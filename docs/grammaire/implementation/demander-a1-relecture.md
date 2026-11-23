# Relecture — Demander et proposer (A1)

Date : 23 novembre 2026. Statut : pilote relu techniquement, validation enseignante en attente. Zéro unité approuvée par un enseignant à ce stade.

Accès : Grammaire → Demander et proposer → Déterminants démonstratifs, Pouvoir/devoir/vouloir ou Accepter et refuser → A1 — pilote.

| Notion | Activités | Offres | Unités sélectionnables | Réalisations |
| --- | ---: | ---: | ---: | ---: |
| Démonstratifs (f1) | 3 | 4 | 150 | 200 |
| Pouvoir, devoir, vouloir (f2) | 3 | 4 | 150 | 200 |
| Accepter et refuser (f3) | 7 | 8 | 320 | 410 |
| Total | 13 | 16 | 620 | 810 |

Une lecture est une unité sélectionnable avec trois questions : 20 documents et 60 questions. Une association est un problème de deux phrases/propositions : 100 problèmes et 200 associations. Ces sous-questions ne gonflent pas le nombre d’unités sélectionnables. Les 170 lignes éditoriales sont réemployées entre présentations ; les 620 unités ne sont pas présentées comme 620 histoires originales.

## Points linguistiques

- Démonstratifs : 12 situations avec ce, 12 avec cet, 13 avec cette et 13 avec ces. Le genre et le nombre du nom sont donnés. Une voyelle ne suffit pas à choisir cet : cette image, cette heure et ces hôtels distinguent les cas. Le h muet de hôtel/hôpital/homme et le h aspiré de héros sont explicités. Les phrases commencent par une majuscule. Les corrections ne changent que le déterminant, avec un segment d’erreur canonique contrôlé.
- La théorie f1 comporte une correction ciblée : deux mentions de h sont précisées en h muet. Le reste de la source est conservé. Le [relevé](correction-demonstratifs-h-muet-20261123.json) et le contrôle SHA-256 de la source antérieure limitent précisément cette exception à la protection des théories. Les contenus CO restent inchangés.
- Pouvoir/devoir/vouloir : la forme est choisie selon le sujet et le verbe indiqué. Les situations distinguent permission, proposition d’aide, obligation et souhait. Le présent reste la cible. Vouloir peut être suivi d’un groupe nominal, comme je veux un café, ou d’un infinitif. Les formules plus élaborées de politesse ne constituent pas ici un exercice de conditionnel. Le corpus gradué modal du thème Conjuguer au présent reste conservé : les nouvelles situations travaillent la communication.
- Acceptation/refus : l’intention est donnée par un rôle fictif. Les réponses libres ne doivent pas révéler les goûts, la santé, les horaires ou la situation familiale réels de l’élève. Les contraintes et les réponses aux relances figurent dans les contextes. Les modèles sont non exclusifs et leurs accords peuvent s’adapter au rôle.
- Les QCM de réponse à une proposition n’opposent jamais deux formulations correctes de la même intention. Les variantes libres restent proposées au corrigé et appréciées par l’enseignant. L’ordre des mots comporte 25 phrases positives et 25 négatives, proposées en mode mixte par défaut. Cette répartition ne signifie pas qu’un refus doit nécessairement être une phrase négative.
- Dans les associations, Situation 1 et Situation 2 conservent leur contexte et leurs intentions. Les réponses d’acceptation et de refus ne sont pas interchangeables avec une préférence personnelle. Les deux propositions restent un seul problème au tableau, avec des cibles privées jusqu’à révélation.
- Les productions et les échanges ouverts ne sont pas notés automatiquement. La réponse modèle et les critères restent dans la correction. Les lectures comportent une preuve textuelle pour chaque réponse.

## Sources et contrôle

Les quatre sources `scripts/grammar_curriculum/demander-*.tsv` produisent f1/f2/f3 avec `python3 scripts/build-grammar-demander.py`. Le test de reconstruction travaille dans un répertoire isolé pour ne pas modifier les banques utilisées pendant les essais navigateur.

Aucune obligation d’illustration n’est prévue pour ces trois notions dans la matrice ; aucun nouveau média ni quota d’images n’est revendiqué.

Les trois banques écrites historiques f1/f2/f3 et l’ancien groupe de communication f3 sont retirés. Les autres lignes des banques restantes sont vérifiées inchangées. Les recettes sans niveau des notions migrées restent signalées comme retirées. Le nettoyage des fiches enregistrées est différé par le propriétaire : aucune inspection ou suppression distante n’est lancée. La requête D1 est seulement tenue en cohérence et vérifiée sur SQLite local.

Voir [les vérifications](verification-demander-20261123.json). Relecture pédagogique humaine, impression physique et recette sur le matériel de classe restent à effectuer.
