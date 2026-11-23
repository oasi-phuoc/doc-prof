# Relecture — Parler d’une activité, A1 et A2

23 novembre 2026. Statut : pilote relu par Codex, approbation enseignante en attente. Cette relecture ne vaut pas validation humaine du niveau CECRL.

## Périmètre éditorial

| Notion | Banques | Offres | Unités sélectionnables | Réalisations |
| --- | ---: | ---: | ---: | ---: |
| Faire une activité, A1 | 4 | 5 | 170 | 260 |
| Verbes pronominaux du quotidien, A1 | 3 | 4 | 150 | 200 |
| Pronoms toniques, A1 et A2 | 4 | 6 | 200 | 300 |
| Total | 11 | 15 | 520 | 760 |

Les 170 lignes éditoriales rédigées comprennent 50 contextes de loisirs, 50 références pronominales A1, 50 situations A2 et 20 documents de lecture. Les contextes servent à plusieurs tâches : ils ne sont pas présentés comme 520 histoires inédites. Les 150 unités des gestes du quotidien réemploient trois banques A1 graduées du présent ; leurs sources ne sont ni recopiées ni supprimées.

## Activités et illustration

Les 50 contextes A1 sollicitent **faire du, de la ou de l’** avec des sujets variés, des habitudes, des projets et des intentions de communication. Les productions écrites et orales demandent une seule phrase ; les faits et le sujet sont explicités. Le QCM et la lacune constituent les deux présentations d’une même activité.

L’obligation **IMG-d1-A1** est couverte par 50 situations illustrées utilisant **11 images distinctes** de la bibliothèque existante : vélo, natation, escalade, gymnastique, yoga, jardinage, danse, bricolage, couture, peinture et dessin. Aucun média nouveau n’est généré. Le [manifeste](activite-media-manifest.json) conserve les sources, dimensions, empreintes et unités dépendantes. Les copies adressées par SHA-256 sont identiques aux originaux.

L’image illustre l’activité générale. Les identités, lieux, dates et buts proviennent du texte fictif, jamais d’une inférence sur la personne photographiée. Les situations de gymnastique n’exigent pas de reconnaître une position assise ou un accessoire absent de l’image.

Les 20 documents A1 proposent chacun trois questions, soit 60 questions avec preuves textuelles : une question à choix et deux réponses courtes. Invitations, affiches, courriels, programmes, témoignages, échanges et conseils changent les intentions de lecture. Une absence d’information n’est jamais convertie en réponse négative.

## Gestes du quotidien : une seule source

`daily-bank-aliases.ts` expose les banques graduées `pronominaux` de QCM/lacune, ordre et oral dans le thème des activités. Les unités, tableaux et critères sont clonés ; chaque alias possède son identifiant et une révision liée à la révision canonique. Sa provenance renvoie au fichier gradué `pronominaux.json` et à l’activité partagée. Une modification d’une fiche ne peut pas muter la source canonique.

Ce réemploi préserve les 50 situations de routine déjà relues. Il évite de créer une seconde banque concurrente pour les mêmes verbes pronominaux.

## Pronoms toniques

A1 couvre **moi, toi, lui, elle, nous, vous, eux, elles**, après préposition, dans une réponse d’identification et en reprise détachée. La personne à reprendre est donnée explicitement, y compris le nombre et le genre grammatical lorsque nécessaire ; aucun genre n’est deviné à partir d’un prénom.

A2 combine prépositions, comparaison, personnes coordonnées et changement de point de vue. La phrase et le contexte identifient le référent. Le blanc porte sur le groupe entier lorsqu’une élision intervient : **qu’elle**, **près d’eux**, **à côté d’elle**. Il ne produit donc pas « que elle » ou « de elles ». Une seule option du QCM est correcte. Les transformations gardent le reste des faits et de la phrase.

Les 50 jeux de rôle A2 sont des situations **ouvertes**, avec deux rôles, une question initiale, une relance, un modèle de suite et quatre critères. Aucun modèle n’apparaît sur le support élève. La production reste appréciée par l’enseignant et ne devient pas une correction automatique à réponse unique.

## Retrait et limites

Les trois banques historiques d1/d2/d3 et le groupe de communication d1 sont supprimés. Les nouvelles entrées utilisent les banques graduées. Les recettes historiques sans niveau de ces notions sont retirées par la même politique dans l’application et dans la requête D1 de maintenance ; les recettes graduées et les médias de compréhension orale restent préservés.

Le serveur distant n’est pas nettoyé : la connexion renvoie une erreur de tunnel 403, et aucun jeton administrateur `FICHES_API_TOKEN` n’est disponible dans cette session. La requête SQL et la commande de maintenance sont prêtes pour un environnement disposant de cet accès. Aucun Worker n’est déployé.

Les contrôles de données, d’impression et de jeu figurent dans [le rapport technique](verification-activite-20261123.json). Une relecture enseignante, une impression physique et une recette sur ENI restent à réaliser.
