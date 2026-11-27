# Relecture — Se situer dans le temps (A1 / A2)

Pilote relu le 23 novembre 2026. Dernière mise à jour des lectures A1 le 27 novembre. La validation enseignante reste en attente.

Le générateur propose Grammaire → Se situer dans le temps → Le moment, La durée, La fréquence ou La chronologie, puis A1 — pilote / A2 — pilote selon l’activité.

| Notion | Niveaux | Activités | Offres | Unités sélectionnables | Réalisations |
| --- | --- | ---: | ---: | ---: | ---: |
| Le moment (e2) | A1 | 4 | 5 | 170 | 280 |
| La durée (e3) | A1, A2 | 4 | 7 | 250 | 350 |
| La fréquence (e4) | A1 | 4 | 5 | 200 | 250 |
| La chronologie (e5) | A1, A2 | 6 | 11 | 420 | 560 |
| Total | | 18 | 28 | 1 040 | 1 440 |

La sélection se fait par texte. Les 20 textes A1 proposent quatre questions chacun, dont un QCM et trois réponses courtes. Les 20 textes A2 en proposent trois chacun, pour un total de 140 questions de lecture. Les 50 problèmes d’association contiennent chacun deux phrases à relier. Les 320 lignes sources alimentent 1 040 unités réparties entre les différentes activités.

## Points linguistiques à relire

- Moment : à + heure, en + mois/année/été/automne/hiver, au printemps, le + jour habituel/date. Les deux heures approximatives utilisent vers avec une demande explicite. Les images de calendrier ne déterminent pas une date fictive ; le texte la donne. Les horloges à douze heures nécessitent le contexte matin/après-midi.
- Durée : depuis pour une action encore en cours au repère, pendant pour une durée achevée, pour pour une durée prévue, il y a pour un moment passé. Pour et pendant sont acceptés pour les durées prévues retenues, sans les opposer dans un QCM. Les faits et les temps verbaux sont conservés dans les transformations et les corrections.
- Fréquence : les contextes fixent la fréquence, au lieu de déduire arbitrairement souvent/rarement d’un chiffre. Dix phrases avec jamais conservent ne. Le réglage initial de l’ordre est mixte : 40 phrases positives et 10 négatives. Une restriction explicite peut réduire cette capacité.
- Chronologie : A1 comporte trois actions, A2 quatre actions. Les connecteurs d’ouverture et de clôture sont demandés explicitement dans les QCM. Puis et ensuite sont tous deux acceptés à l’étape intermédiaire, sans être deux choix concurrents. Avant de / après avoir sont limités à A2 ; les infinitifs et participes sont écrits dans les sources. Les relances A1 évitent d’exiger l’infinitif passé dans les réponses modèles.
- Les étapes entières se déplacent au tableau par glisser-déposer, toucher puis destination ou clavier. Elles restent neutres sur papier : leur catégorie technique ne sert pas à leur attribuer une nature grammaticale. Les filtres de nature et de polarité n’y sont pas proposés.
- Les productions, les transformations, les ordres et les échanges ouverts restent guidés par l’enseignant. Un exemple de réponse n’est pas un verdict automatique. La transcription des rôles et les critères n’imposent aucune histoire personnelle à l’élève.

## Sources et médias

Les sept fichiers `scripts/grammar_curriculum/temps-*.tsv` sont les sources à modifier. `python3 scripts/build-grammar-temps.py` produit e2/e3/e4/e5 et le manifeste. `python3 scripts/test-grammar-temps-build.py` vérifie la reconstruction dans un répertoire isolé.

IMG-e2-A1 couvre 50 situations illustrées avec dix images internes réemployées, copiées sans modification sous un chemin SHA-256. Le [manifeste](temps-media-manifest.json) conserve origine, dimensions, texte alternatif, empreinte et usages. Il ne revendique pas 50 images nouvelles.

En A1, chaque texte propose une nouvelle question factuelle sur une information encore peu exploitée, par exemple le délai avant un rendez-vous, le dossier à apporter ou l’heure de réouverture. Quatre visuels TCF existants situent le train, la bibliothèque, le marché et la piscine. Les réponses se trouvent dans les documents. [Sources des questions](../../../scripts/grammar_curriculum/temps-lectures-a1.tsv)

Les 20 lectures A2 réemploient les vingt premières procédures du corpus A2, avec leurs preuves textuelles ; elles ne constituent pas vingt histoires supplémentaires.

## Retrait et sauvegardes

Les quatre banques écrites historiques e2/e3/e4/e5 et l’ancien groupe de communication e2 sont supprimés. Les autres banques écrites, la théorie et les contenus CO restent protégés par les contrôles existants. Les anciennes recettes sans niveau des notions remplacées sont signalées comme retirées. Le propriétaire a différé le nettoyage des fiches enregistrées : aucune inspection ou suppression distante n’a été lancée pour ce lot. La requête de maintenance est seulement tenue en cohérence et testée sur SQLite local.

La [vérification du lot](verification-temps-20261123.json) réunit les mesures. La relecture pédagogique humaine, une impression physique et la recette sur le matériel de classe restent à effectuer.
