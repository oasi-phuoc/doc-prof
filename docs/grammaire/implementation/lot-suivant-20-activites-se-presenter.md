# Cahier des charges — les 20 prochaines activités de Se présenter

**Date :** 21 novembre 2026, Europe/Zurich.

**Référence :** [cahier des charges v2](cahier-des-charges-v2.md), notamment COM-01 à COM-05, REN-01 à REN-07, SPE-04/05, PED-01 à PED-04 et TECH-03.

**Base inspectée :** `af2607853abf265edab37c4ab59e0c3625b8fd05`.

**Statut au 21 novembre 2026 :** les 20 activités et leurs 24 offres A1 sont implémentées en pilote explicite ; approbation enseignante en attente. Le [bilan de réalisation](avancement-20261121.md) distingue les quotas effectivement livrés des minima du présent contrat. Les sections ci-dessous conservent la spécification de référence.

## 1. Place du lot dans le plan

Le [bilan du 14 novembre](avancement-20261114.md) et le [registre](target-registry.json) recensent 13 offres sur 40 en pilote dans **Se présenter** : les pronoms sujet et la provenance. Les prochaines notions, dans l’ordre pédagogique de l’annexe A, sont l’identité, les nationalités et la famille. Les offres déjà couvertes dans **Entrer en contact** et **Conjuguer au présent** ne sont pas recréées.

Ce lot prépare **20 activités, correspondant à 24 offres A1**, parmi les 27 offres encore prévues dans Se présenter. Une offre est une combinaison activité/niveau/présentation ; QCM et lacune restent deux présentations d’une même activité.

| Périmètre | Activités | Offres | Unités sélectionnables cibles | Variantes de réponse minimales |
| --- | ---: | ---: | ---: | ---: |
| Qui suis-je ? | 10 | 11 | 450 questions/situations + 20 textes | 500 + 50 questions CE |
| Adjectifs de nationalité | 6 | 8 | 300 questions/situations | 400 |
| Parler de sa famille, première tranche | 4 | 5 | 50 questions + 60 textes | 100 + 150 questions CE |
| Total du lot | **20** | **24** | **800 questions/situations + 80 textes = 880** | **1 200** |

Chaque banque CE comporte **20 textes et au moins 50 questions**, réparties en groupes de deux à cinq questions. Trois questions pertinentes par texte constituent une cible de rédaction, soit 60 par banque et au moins 1 240 variantes pour le lot. Ce repère ne justifie ni d’ajouter une question inutile, ni de retirer des questions utiles d’une source réemployée. Les questionnaires historiques complets restent conservés dans leur branche historique.

Les 880 unités ne sont pas 880 histoires inédites : une source peut être réemployée entre tâches, avec une consigne et une correction propres à chacune. Les quatre couples QCM/lacune sont vérifiés séparément. A4 et tableau ne doublent aucun compteur. Aucune unité n’est réputée approuvée du seul fait de figurer dans cette annexe.

## 2. Inventaire des 20 activités

Tous les niveaux ci-dessous sont **A1**. Les IDs du registre sont conservés.

| Repère | Sous-thème | Activité et ID | Présentation | Banque cible |
| --- | --- | --- | --- | --- |
| L20-01 | a1 | Infos personnelles — `gram-ex-a1-infos-perso` | Lacune personnelle ouverte | 50 unités |
| L20-02 | a1 | Compléter avec le verbe — `gram-ex-a1-verbe-pastilles` | QCM / Lacune | 50 unités, 100 variantes |
| L20-03 | a1 | Remettre dans l’ordre — `gram-ex-a1-ordre` | Mots dans l’ordre | 50 unités |
| L20-04 | a1 | Répondre avec une phrase — `gram-ex-a1-repondre-phrase` | Production écrite courte | 50 unités |
| L20-05 | a1 | Écrire la question — `gram-ex-a1-ecrire-question` | Transformation | 50 unités |
| L20-06 | a1 | Remplir un formulaire — `gram-ex-a1-formulaire` | Formulaire écrit | 50 situations |
| L20-07 | a1 | Lire et répondre — `gram-ex-a1-ce-texte` | CE | 20 textes, au moins 50 questions |
| L20-08 | a1 | Présenter une personne — `gram-ex-a1-portrait` | Production écrite | 50 situations |
| L20-09 | a1 | Se présenter à l’oral — `gram-ex-a1-po-images` | Production orale avec supports | 50 situations |
| L20-10 | a1 | Jouer une situation — `gram-ex-a1-curriculum-s` | Situation ouverte | 50 situations |
| L20-11 | a3 | Je suis… (avec image) — `gram-ex-a3-nat-image` | QCM / Lacune | 50 unités, 100 variantes |
| L20-12 | a3 | Mettre au féminin — `gram-ex-a3-nat-feminin` | Transformation | 50 unités |
| L20-13 | a3 | Mettre au masculin — `gram-ex-a3-nat-masculin` | Transformation | 50 unités |
| L20-14 | a3 | Mettre au pluriel — `gram-ex-a3-nat-pluriel` | Transformation | 50 unités |
| L20-15 | a3 | Accorder l’adjectif — `gram-ex-a3-nat-accorder` | QCM / Lacune | 50 unités, 100 variantes |
| L20-16 | a3 | S’exprimer à l’oral — `gram-ex-a3-curriculum-p` | Production orale | 50 situations |
| L20-17 | famille | Déterminants possessifs — `gram-ex-famille-fam-det` | QCM / Lacune | 50 unités, 100 variantes |
| L20-18 | famille | Faire-part de naissance — `gram-ex-famille-fam-faire-part` | CE | 20 textes, au moins 50 questions |
| L20-19 | famille | Photo de famille — `gram-ex-famille-fam-photo` | CE | 20 textes, au moins 50 questions |
| L20-20 | famille | Message et email — `gram-ex-famille-fam-email` | CE | 20 textes, au moins 50 questions |

Les points de suspension du titre historique « Je suis… » sont une ponctuation de titre. Dans une phrase à compléter, le blanc est un **trait de réponse coloré `___`**.

## 3. Contrats détaillés — Qui suis-je ?

### L20-01 — Infos personnelles

- **Objectif et consigne :** compléter une présentation courte. « Complétez avec des informations réelles ou fictives adaptées à la situation. »
- **Unité :** contexte utile, phrase avec un blanc, nature de l’information demandée et critères d’évaluation. Exemple : à l’accueil d’un cours, « Je m’appelle ___ (prénom). » La valeur personnelle n’est pas une bonne réponse de banque.
- **Banque :** 50 unités présentant des intentions et contraintes variées : premier contact, cours, stage, club, échange, rencontre en ligne ou mobilité. Changer uniquement le prénom d’une fiche ne crée pas une nouvelle unité.
- **Correction :** appréciation humaine de la pertinence et de la construction grammaticale ; un exemple possible est réservé au corrigé. Aucun prénom, âge, pays ou langue modèle ne sert de valeur exacte obligatoire. Identité fictive toujours autorisée.
- **Rendu :** blanc dans la phrase, indice après le blanc en couleur. Au tableau, saisie ou réponse orale appréciée par l’enseignant ; aucun choix personnel prédéfini ni score automatique.

### L20-02 — Compléter avec le verbe

- **Objectif et consigne :** utiliser les verbes de présentation. « Complétez avec la forme qui convient. » / « Choisissez la forme qui convient. »
- **Unité :** phrase contextualisée, sujet explicite, une seule forme attendue et distracteurs réellement faux. Exemple : « J’___ dix-huit ans. » → « ai ». L’apostrophe reste attachée au corrigé.
- **Banque :** 50 unités réemployées ou nouvelles couvrant s’appeler, être, avoir, habiter et parler. Les sources valables avec venir peuvent être conservées après revue. Varier les personnes, les fonctions communicatives et les informations, sans fabriquer 50 versions d’un même modèle.
- **Correction :** forme conjuguée et explication brève ; une même source alimente les deux présentations après leur validation. Les variantes typographiques tolérées ne doivent pas accepter une erreur d’accord.
- **Rendu :** un seul type avec toggle QCM / Lacune. L’indice infinitif, lorsqu’il est nécessaire, se place après le trait ; la version élève ne révèle pas la forme conjuguée.

### L20-03 — Remettre dans l’ordre

- **Objectif et consigne :** construire une phrase de présentation. « Remettez les mots dans l’ordre et écrivez la phrase. »
- **Unité :** tous les mots nécessaires, tokens avec IDs distincts et catégories Gattegno, phrase complète et ordres acceptés. Exemple : « à / habite / Sion / J’ » → « J’habite à Sion. »
- **Banque :** 50 phrases A1 avec intentions différentes : se nommer, indiquer son âge, sa résidence, sa langue, ses études ou son activité. Les mots et constructions restent dans l’objectif de présentation.
- **Correction :** toutes les séquences naturelles recensées, ou appréciation guidée si plusieurs organisations sont possibles. Les élisions et la ponctuation sont reconstituées correctement ; les mots répétés restent manipulables séparément.
- **Rendu :** bulles et ligne de réponse en A4 ; manipulation par clic, tactile et clavier au tableau. Les filtres proposés reflètent uniquement les capacités réelles de cette banque.

### L20-04 — Répondre avec une phrase

- **Objectif et consigne :** répondre à une question d’identité par une phrase complète. « Répondez avec une phrase. Vous pouvez inventer les informations. »
- **Unité :** question, interlocuteur ou registre utile et intention. Exemple : « Tu habites où ? » → modèle possible « J’habite à Fribourg. » Le nom de ville reste libre.
- **Banque :** 50 questions en situations distinctes ; varier les informations demandées et les destinataires, sans répéter la même question sous 50 noms.
- **Correction :** pertinence, changement correct de personne, verbe et phrase compréhensible. Accepter une réponse personnelle différente du modèle ; préciser si une fiche fictive fournit au contraire des faits à respecter.
- **Rendu :** question puis ligne dessous. Au tableau, le modèle et les critères apparaissent uniquement sur action enseignante.

### L20-05 — Écrire la question

- **Objectif et consigne :** demander une information de présentation. « Écrivez une question pour obtenir l’information indiquée. »
- **Unité :** réponse de départ, information ciblée et personne à interroger. Exemple : réponse « Je m’appelle Lina. », cible « prénom », échange entre camarades → « Comment tu t’appelles ? » ou « Comment t’appelles-tu ? »
- **Banque :** 50 unités avec cibles variées : prénom, âge, résidence, langue, activité, pays ou coordonnées fictives. Le registre et le nombre d’interlocuteurs sont explicites lorsqu’ils influent sur la question.
- **Correction :** plusieurs formulations pertinentes admises. Utiliser une grille humaine lorsque la liste des formulations ne peut être exhaustive ; une question correcte ne doit pas être rejetée pour sa seule différence avec le modèle.
- **Rendu :** réponse source et cible, puis trait dessous ; consigne commune à l’exercice. Le mécanisme ne devient pas une activité de questions fermées si la cible appelle une information ouverte.

### L20-06 — Remplir un formulaire

- **Objectif et consigne :** renseigner les champs utiles d’un formulaire contextualisé. « Complétez le formulaire. Vous pouvez utiliser une identité fictive. »
- **Unité :** organisme ou destinataire, motif, champs nommés et identifiés, champs obligatoires, aides de format et grille. Un formulaire entier constitue une situation ; ses six champs ne comptent pas pour six unités du quota.
- **Banque :** 50 situations distinctes. Auditer les 43 supports bruts signalés dans le registre avant réemploi : inscription à un cours, bibliothèque, club, activité, stage, échange, atelier, service ou événement. Les besoins d’information et l’organisation des champs doivent varier avec l’usage réel.
- **Correction :** respect de la consigne, champs requis remplis et formats lisibles. Les valeurs personnelles restent libres. Lorsqu’une fiche fictive est fournie, vérifier aussi leur fidélité à cette fiche. Aucun âge ou prénom modèle ne devient obligatoire pour une réponse personnelle.
- **Rendu :** véritable formulaire avec libellés et espaces associés, répartissable sur plusieurs pages. Au tableau, champs consultables et construction collective. Les supports TPF partagés ne sont pas réécrits globalement.

### L20-07 — Lire et répondre

- **Objectif et consigne :** comprendre une présentation et retrouver les informations explicites. « Lisez le document, puis répondez aux questions. »
- **Banque :** 20 textes rédigés ou réemployés après revue, de genres et d’organisations variés ; voir la matrice du §6. Au moins 50 questions utiles, deux à cinq par document.
- **Questions :** identité, résidence, activité, langues, destinataire et intention selon ce que dit le document. Questions fermées et réponses courtes peuvent coexister ; aucune information personnelle absente ne doit être inventée pour répondre.
- **Correction :** réponse, variantes et passage justificatif exact. Les référents de je/tu/il/elle et de l’expéditeur sont vérifiés. La nationalité ne se déduit pas du prénom, de la langue ou du lieu de résidence.
- **Rendu :** choix du nombre de textes, toutes leurs questions conservées, bouton de saut après chaque question et rappel du support sur continuation. Un conteneur historique marqué CO avec audio vide ne transforme pas cette lecture en activité audio.

### L20-08 — Présenter une personne

- **Objectif et consigne :** présenter une personne fictive en trois à cinq phrases. « Présentez cette personne à partir de sa fiche. »
- **Unité :** portrait existant, fiche de faits explicites, destinataire, tâche et aides utiles. Exemple de faits : prénom, âge, résidence et langues ; le genre grammatical nécessaire est indiqué dans les données.
- **Banque :** 50 situations avec des besoins et des profils variés. Un portrait peut servir plusieurs situations ; permuter uniquement ses prénom et âge ne suffit pas à constituer la banque.
- **Correction :** modèle non exclusif et grille : fidélité aux faits, sujet et verbe, phrases compréhensibles, réalisation de la tâche. Ne pas noter l’apparence ou des faits inférés de l’image.
- **Rendu :** portrait et fiche lisibles, espace PE ligné adapté à trois à cinq phrases. Au tableau, le support reste visible pendant la construction collective.

### L20-09 — Se présenter à l’oral

- **Objectif et consigne :** produire une courte présentation guidée. « Présentez-vous. Vous pouvez utiliser les informations des supports ou inventer une identité. »
- **Unité :** situation, destinataire, supports visuels existants utiles, trois à cinq informations à transmettre et relance. L’image sert de déclencheur ; elle ne porte pas seule une information nécessaire invisible en noir et blanc.
- **Banque :** 50 situations : arrivée dans un groupe, première journée de stage, atelier, club, échange, visioconférence ou rencontre. L’intention et la relance varient réellement ; il ne suffit pas de changer le décor d’une consigne identique.
- **Correction :** pertinence, structures de présentation et intelligibilité, appréciées par l’enseignant. Le modèle est une possibilité ; aucune comparaison automatique à un discours unique.
- **Rendu :** fiche de préparation A4 ; supports et relance projetés au tableau, modèle masqué avant révélation. Aucun nouvel enregistrement audio n’est requis.

### L20-10 — Jouer une situation

- **Objectif et consigne :** se présenter et demander une information dans un échange court. « Jouez la situation en suivant votre rôle. »
- **Unité :** contrat ouvert, situation, deux rôles nommés, objectif de chacun, informations utiles, amorces et relance. Exemple : un nouveau membre se présente au responsable d’un club, qui vérifie sa langue et son activité préférée.
- **Banque :** 50 échanges distincts par leur intention et les informations à échanger ; les rôles ne sont pas un même dialogue dont seuls les noms changent.
- **Correction :** grille humaine : rôle tenu, demande pertinente, réponse compréhensible et structures ciblées. Dialogue modèle non exclusif au corrigé ; les amorces ne préremplissent pas toutes les réponses.
- **Rendu :** cartes de rôle sobres en A4 et affichage des rôles au tableau. Les brouillons, révélations et relances se conservent pendant la séance ; la navigation ne déclenche aucun nouveau tirage.

## 4. Contrats détaillés — Adjectifs de nationalité

Pour les six activités, le pays de nationalité et le genre/nombre grammatical du personnage sont des **données explicites**. Un drapeau, un prénom, une apparence ou une résidence ne prouvent pas seuls une nationalité. Écrire les adjectifs avec une minuscule. Les mentions entre parenthèses « masculin » et « féminin » sont en couleur et restent lisibles en noir et blanc.

### L20-11 — Je suis… (avec image)

- **Consigne :** « Complétez avec l’adjectif de nationalité. » / « Choisissez l’adjectif de nationalité. »
- **Unité :** support pays existant, fiche explicite du personnage, sujet et blanc inline. Exemple : fiche « nationalité : Italie ; personnage féminin », « Je suis ___ (féminin). » → « italienne ».
- **Banque :** 50 situations illustrées avec variation des contextes et des accords. Réemployer les médias pertinents du manifeste de présentation ; 50 unités n’exigent pas 50 images nouvelles.
- **Correction :** adjectif correspondant à la nationalité fournie et accord exact. Les distracteurs sont distincts et faux dans ce contexte. Les formes épicènes ne produisent pas deux options identiques.
- **Rendu :** un seul type, QCM / Lacune ; indice après le blanc. Copie média immuable, référence source et alternative textuelle non révélatrice de l’adjectif à produire.

### L20-12 — Mettre au féminin

- **Consigne :** « Réécrivez la phrase au féminin. »
- **Unité :** phrase masculine, sujet féminin d’arrivée explicite et éléments à conserver. Exemple : « Il est italien. » → « Elle est italienne. »
- **Banque :** 50 unités ; couvrir des changements réguliers, consonnes doublées, changements de terminaison et formes épicènes. Les phrases apportent des contextes variés, sans multiplier les seuls noms propres.
- **Correction :** phrase entière, sujet et adjectif accordés ; les autres informations restent cohérentes. Une forme épicène reste identique sans être présentée comme une erreur.
- **Rendu :** phrase source et trait dessous ; éventuel indice « féminin » en couleur. Les éléments du modèle restent dans le corrigé.

### L20-13 — Mettre au masculin

- **Consigne :** « Réécrivez la phrase au masculin. »
- **Unité :** phrase féminine et sujet masculin d’arrivée déterminé. Exemple : « Elle est grecque. » → « Il est grec. »
- **Banque :** 50 unités avec diversité de formes et de contextes, incluant les formes identiques aux deux genres. Une réutilisation de source avec L20-12 reste tracée comme telle.
- **Correction :** phrase complète, accord et fidélité au sens. Aucun prénom ambigu n’impose à lui seul un masculin ; l’indice est explicite.
- **Rendu :** source puis ligne de réponse ; mention « masculin » en couleur lorsqu’elle est affichée. Au tableau, mêmes source, cible et critères que sur papier.

### L20-14 — Mettre au pluriel

- **Consigne :** « Réécrivez la phrase au pluriel en gardant le genre indiqué. »
- **Unité :** source singulière et groupe d’arrivée explicite. Exemple : « Elle est française. » → « Elles sont françaises. » Pour un groupe mixte, l’information est donnée ; elle n’est pas déduite des prénoms.
- **Banque :** 50 unités couvrant masculin et féminin pluriels, être, pronoms et adjectifs dont la graphie change ou reste identique au masculin pluriel.
- **Correction :** sujet, verbe et adjectif ; maintien des informations compatibles avec le changement demandé. Éviter les compléments singuliers qui deviendraient incohérents après transformation.
- **Rendu :** phrase source, cible de genre/nombre et trait de réponse dessous. Les indices n’affichent pas la terminaison attendue.

### L20-15 — Accorder l’adjectif

- **Consigne :** « Accordez l’adjectif de nationalité. » / « Choisissez l’adjectif correctement accordé. »
- **Unité :** référent explicite, genre/nombre, adjectif de départ si nécessaire et blanc dans la phrase. Exemple : « Elles sont ___ (canadien ; féminin pluriel). » → « canadiennes ».
- **Banque :** 50 unités couvrant les quatre accords ; varier les sujets et situations. Vous précise une personne ou plusieurs, et le genre grammatical utile. Répartition des formes documentée lors de la relecture.
- **Correction :** accord justifié par le référent ; pas d’options équivalentes. Les deux modes ont une correction vérifiée distinctement, issue de la même unité.
- **Rendu :** toggle QCM / Lacune avec **trait inline**, indice en couleur à droite ; aucune deuxième activité de menu pour la lacune.

### L20-16 — S’exprimer à l’oral

- **Consigne :** « Présentez les personnes de la fiche et dites leur nationalité. »
- **Unité :** destinataire, fiche d’une ou plusieurs personnes, nationalités et genres/nombres explicites, tâche et relance. Exemple : présenter deux nouvelles camarades à un groupe et répondre à une question sur leur résidence.
- **Banque :** 50 situations réellement différentes par leur besoin de présentation et les accords employés. Un support peut être réemployé avec une nouvelle intention clairement décrite.
- **Correction :** grille humaine : faits fidèles, être et adjectif accordés, pronoms cohérents, intelligibilité. Modèle possible au corrigé ; pas de nationalité inférée de l’apparence.
- **Rendu :** fiche de préparation A4 et support projetable ; relance enseignante distincte de la réponse attendue. Une image n’est requise que si la tâche en dépend effectivement.

## 5. Contrats détaillés — Parler de sa famille

### L20-17 — Déterminants possessifs

- **Consigne :** « Complétez avec le déterminant possessif qui convient. » / « Choisissez le déterminant possessif qui convient. »
- **Unité :** possesseur explicitement identifié, nom possédé, genre/nombre utiles et un blanc. Exemple : « Possesseur : je. ___ frère habite à Sion. » → « Mon ». La consigne impose le possessif ; plusieurs possesseurs ne doivent pas rester possibles.
- **Banque :** 50 unités fusionnées, avec mon/ma/mes, ton/ta/tes, son/sa/ses, notre/nos, votre/vos, leur/leurs. Inclure les cas vocaliques usuels après revue, sans confondre le genre du possesseur et celui du nom.
- **Correction :** possesseur, accord avec le nom et explication. Ce sont des déterminants devant un nom ; ne pas les nommer pronoms possessifs ni introduire le mien/la mienne dans ce contrat.
- **Rendu :** un seul type **Déterminants possessifs**, toggle QCM / Lacune, trait inline. Conserver les aliases `gram-ex-famille-fam-pronoms-1` et `gram-ex-famille-fam-pronoms-2` pour les anciennes recettes.

### L20-18 — Faire-part de naissance

- **Consigne :** « Lisez le faire-part, puis répondez aux questions. »
- **Banque :** 20 annonces de naissance différentes par leur destinataire, organisation et contenu utile ; deux à cinq questions chacune, au moins 50 au total. Rester dans le genre du faire-part tout en variant ses formes : carte, message, courriel ou annonce courte. La matrice du §6 donne des intentions, pas un gabarit à décliner.
- **Support obligatoire :** image du bébé existante à gauche ; à droite, chaque phrase sur sa ligne. Le support Lucas conserve exactement ces trois phrases :

  > Julie et Thomas annoncent la naissance de leur fils Lucas.

  > Lucas a un frère, Noah, et une sœur, Emma.

  > Paul et Anne sont leurs grands-parents.

- **Correction :** questions dont les liens de parenté sont explicitement établis, avec preuves. Une question dépendant d’un référent ambigu comme « leurs » doit préciser ce référent dans le contexte ou être reformulée ; ne pas imposer une déduction de filiation absente du support.
- **Rendu :** questions sous les deux colonnes, sauts possibles après chaque question, support repris sur continuation. Un média non disponible bloque les unités qui en dépendent, sans substituer une image sans rapport.

### L20-19 — Photo de famille

- **Consigne :** « Lisez le document, puis répondez aux questions. » L’observation d’une photo ou d’un arbre est mentionnée lorsque ce support est effectivement présent.
- **Banque :** 20 documents distincts regroupant descriptions, récits, légendes de photo, arbres commentés et autres formats pertinents. Les 20 textes et 100 questions bruts recensés dans le registre sont des candidats au réemploi, à relire ; leur capacité brute n’est pas une approbation.
- **Couverture :** père, mère, fils, fille, frère, sœur, grand-père, grand-mère, oncle, tante, cousin, cousine, **neveu** et nièce. Les métiers et activités donnent des informations de compréhension variées, sans stéréotype lié au genre.
- **Correction :** point de vue de référence nommé, liens cohérents et preuves. « La sœur de mon père » permet « ma tante » ; deux personnes de même nom ou le placement dans une image ne suffisent pas à établir un lien. Chaque document comporte deux à cinq questions, au moins 50 dans la banque.
- **Rendu :** nom unique **Photo de famille** ; arbre/photo/récit sont des supports. Les IDs historiques `gram-ex-famille-fam-arbre` et `gram-ex-famille-fam-recit` restent résolus. Vérifier le routage actuel avant migration ; conserver les recettes et contenus historiques. Saut de page après chaque question.

### L20-20 — Message et email

- **Consigne :** « Lisez le message ou l’email, puis répondez aux questions. »
- **Banque :** 20 messages ou courriels envoyés/reçus, avec variété des intentions et de l’organisation : invitation, nouvelle, demande, organisation, remerciement, information ou présentation familiale. Auditer les 20 textes et 100 questions bruts existants avant de compléter les manques.
- **Support :** expéditeur, destinataire, objet si pertinent, corps et signature cohérents. Les coordonnées sont fictives ; l’élève ne doit pas fournir ses propres coordonnées pour comprendre le texte.
- **Correction :** auteur, destinataire, intention, faits et liens familiaux prouvés. Changer l’expéditeur peut changer la référence de mon/ta/sa : vérifier chaque question et son passage justificatif.
- **Rendu :** nom **Message et email**, format CE, choix du nombre de textes et saut après chaque question. Deux à cinq questions par texte, au moins 50 par banque ; aucune troncature à 50 lors du tirage de tous les documents.

## 6. Matrice éditoriale des quatre banques CE

Les entrées suivantes sont **80 briefs de rédaction ou d’audit**, pas 80 textes produits. Chaque brief doit aboutir à un document autonome avec auteur/destinataire si utile, intention, organisation propre et deux à cinq questions fondées sur ses informations. Les textes existants pertinents peuvent remplir ces briefs après revue ; on adapte le brief à une bonne source plutôt que de réécrire gratuitement un texte valable.

Pour chaque document, préparer une fiche : ID stable, genre, intention, contexte, faits, organisation, notions, source/révision, questions, preuves et statut de revue. Comparer les documents d’une banque après retrait des prénoms et nombres : s’ils ne diffèrent plus que par quelques valeurs, les retravailler. L’éventuelle répétition de formules usuelles (« Bonjour », « À bientôt ») n’est pas à elle seule un doublon.

| N° | Identité — L20-07 | Naissance — L20-18 | Photo de famille — L20-19 | Message et email — L20-20 |
| --- | --- | --- | --- | --- |
| 01 | Message d’un nouvel élève à sa classe : langues et attentes | Carte Lucas : parents, frère, sœur et grands-parents | Légende d’un portrait de trois générations et leurs métiers | Invitation d’une tante à un repas : personnes et organisation |
| 02 | Carte de correspondant : résidence et centres d’intérêt | SMS du père à sa sœur : naissance et lien de tante explicite | Récit d’un repas où le narrateur présente son oncle et sa tante | Courriel d’un cousin qui se présente à une nouvelle correspondante |
| 03 | Portrait de bénévole dans le bulletin d’un club | Courriel des parents aux grands-parents : première visite | Arbre commenté avec père, mère, fils et fille | Message d’un parent organisant une visite aux grands-parents |
| 04 | Entretien court entre une stagiaire et son tuteur | Annonce d’une grande sœur présentant son petit frère | Page d’album sur les cousins et les cousines | Courriel annonçant un nouveau travail et donnant des nouvelles familiales |
| 05 | Présentation sur le forum d’un atelier de dessin | Mot d’un grand frère présentant sa petite sœur | Description d’un dimanche chez les grands-parents | Remerciement familial après une invitation |
| 06 | Fiche de membre accompagnée d’une note d’accueil | Carte des parents annonçant des jumeaux, liens explicités | Entretien court avec un grand-père sur ses petits-enfants | Demande d’aide pour préparer un anniversaire |
| 07 | Lettre d’arrivée chez une famille d’accueil | Courriel à des collègues : naissance et composition de la famille | Portrait d’une tante et des enfants de son frère | Message d’un frère qui confirme son heure d’arrivée |
| 08 | Annonce pour trouver un partenaire de conversation | Message des grands-parents présentant leur petite-fille | Récit d’une cousine qui rencontre son neveu | Courriel d’une sœur qui présente son bébé à la famille |
| 09 | Brève autobiographie dans un journal de classe | Annonce de parents éloignés indiquant une future rencontre | Carte légendée de proches vivant dans plusieurs villes | Invitation d’un grand-parent à une journée commune |
| 10 | Présentation d’un duo pour un projet scolaire | Carte jointe à une photo : bébé, parents et fratrie nommés | Présentation d’une famille recomposée, liens tous explicités | Message de deux cousins préparant une sortie |
| 11 | Profil de sportif amateur et petit message au club | Petit texte du livre de naissance : première rencontre familiale | Message joint à une photo où la narratrice se situe | Courriel d’accueil pour un membre de la famille en visite |
| 12 | Mot d’accueil d’un animateur de bibliothèque | Annonce familiale au format questions/réponses | Carnet d’une visite chez une nièce et ses parents | Demande de nouvelles d’un oncle absent d’une réunion |
| 13 | Carte de présentation pour un échange de classe | Message d’une tante qui relaie l’annonce des parents | Description d’une fête réunissant deux branches de famille | Réponse à une invitation : présents et absents nommés |
| 14 | Courriel à une association pour proposer son aide | Courriel d’un oncle présentant son neveu nouveau-né | Présentation d’un couple et des métiers de leurs enfants | Courriel d’un père qui explique le programme du week-end |
| 15 | Page de carnet racontant une première rencontre | Faire-part organisé autour de la fratrie qui accueille le bébé | Court dialogue où une personne explique son arbre | Message d’une grand-mère accompagnant une photo légendée |
| 16 | Petite annonce de recherche d’un binôme de cours | Carte annonçant une fille et nommant les deux grands-mères | Portrait d’un foyer avec deux sœurs aux activités différentes | Mot d’un enfant à une tante après un séjour |
| 17 | Présentation collective de trois membres d’un groupe | Annonce d’un garçon avec date et lien des visiteurs explicités | Récit d’une visite d’un cousin et de sa fille | Courriel pour organiser l’accueil d’une cousine |
| 18 | Note personnelle destinée au responsable d’un stage | Message bref complété par une liste de liens familiaux | Page de journal scolaire consacrée à une famille et ses activités | Message de remerciement pour des photos de famille |
| 19 | Article court présentant une nouvelle voisine | Courriel annonçant la naissance et demandant une réponse de visite | Arbre accompagné d’une notice distinguant neveu et petit-fils | Courriel donnant des nouvelles de plusieurs proches, référents explicites |
| 20 | Présentation orale transcrite dans un livret d’accueil, utilisée en lecture | Carte de bienvenue au bébé signée par des proches dont les liens sont donnés | Récit d’une journée de travail de deux membres d’une famille | Message d’organisation d’un appel familial à distance |

Une naissance limite naturellement les genres possibles : la diversité repose aussi sur la voix, le destinataire, l’intention et la structure. Les 20 annonces ne doivent pas être le même paragraphe avec seulement un bébé différent. Pour la famille, les professions et activités constituent de vrais faits questionnables, sans remplacer l’objectif de parenté.

## 7. Dépendances à résoudre avant les banques complètes

### 7.1 Réponse personnelle et formulaire

Le modèle canonique courant possède une complétion fermée avec options et réponses, et une production ouverte générique. Deux contrats doivent être représentés explicitement pour ce lot, sans détourner une liste de bonnes réponses :

| Contrat | Données indispensables | Politique de correction | Sauvegarde et rendu |
| --- | --- | --- | --- |
| Lacune personnelle | Phrase structurée, ID du blanc, information attendue, contexte, grille, modèles non exclusifs | Évaluation humaine ; aucune valeur personnelle exacte ni options obligatoires | Conserver le mode gap, la place du blanc, les indices et la grille ; modèles réservés au corrigé |
| Formulaire | Situation, destinataire, champs avec IDs, libellés, ordre, type d’information, caractère obligatoire et aides de format ; éventuelle fiche fictive | Champs personnels libres ou fidélité aux faits fournis selon le contrat ; grille humaine | Conserver l’identité et l’ordre des champs, les aides et les espaces de réponse ; vraie disposition formulaire |

L’extension de schéma doit distinguer ces mécaniques des réponses fermées. Les nouveaux snapshots conservent leur contenu canonique ; les snapshots v1 déjà sauvegardés restent lisibles. Une version nouvelle, si nécessaire, dispose d’un lecteur explicite ; aucun ancien snapshot n’est converti silencieusement en QCM ou en paragraphe libre. La banque expose seulement les présentations dont le rendu et la correction sont prêts.

### 7.2 Médias et reprise de l’existant

- Réemployer le [manifeste de présentation](presentation-media.json), avec contrôle de pertinence, source, droits, dimensions, alternative textuelle et SHA-256. Le drapeau du Japon rejeté dans ce manifeste reste exclu tant qu’un support correct n’a pas été vérifié.
- Les portraits et supports oraux ne permettent aucune déduction de genre ou de nationalité non donnée. Une alternative textuelle décrit l’information utile sans écrire la forme grammaticale à compléter.
- **Bébé :** le chemin historique `public/lib/images/documents/famille/bebe.webp` n’est plus présent dans la base inspectée. Le contenu existe dans le commit `a49ee23d85707ef103300090350373e6731f882a` : 6 194 octets, SHA-256 `576ff826e945a47a819053f34a9cee7b0b553d36a37dabca25faa98d7aa5b0b0`. Prévoir sa reprise après vérification visuelle et de provenance, sous un chemin immuable ; cette annexe ne restaure pas le fichier et ne certifie pas ses droits.
- Le faire-part courant n’affiche pas cette image ; Photo de famille emploie actuellement des portraits textuels, tandis que la lecture de récits existe dans une autre branche historique. Réconcilier ces états avec le registre lors de la migration, en préservant les anciennes recettes et les changements amont.
- Consigner tout média manquant dans le manifeste, avec les unités bloquées. Ne pas générer de nouvelle image, de piste ou de transcription pour combler un manque.

### 7.3 Échantillon vertical puis extension

Avant de rédiger toutes les banques, préparer un échantillon couvrant : une lacune personnelle, une complétion QCM/lacune, un formulaire, une transformation ouverte, une production avec image, un scénario ouvert et une CE à plusieurs documents. Vérifier le parcours génération → A4 → corrigé → sauvegarde → tableau. Les exemples techniques ne remplissent pas les quotas des banques complètes.

## 8. Ordre de réalisation proposé

| Étape | Activités | Dépendances et résultat attendu |
| --- | --- | --- |
| A — Identité, réponses courtes et formulaire | L20-01 à L20-06 | Étendre les deux contrats ouverts, auditer les sources, relire 50 unités par activité, valider les sept offres et leurs sauvegardes |
| B — Identité en contexte | L20-07 à L20-10 | Réemployer les médias et le scénario ouvert ; fournir 20 textes CE et 150 situations, avec corrigés et grilles |
| C — Nationalités | L20-11 à L20-16 | Vérifier les supports pays et les indices ; fournir six banques de 50 unités, huit offres et les quatre accords |
| D — Famille, première tranche | L20-17 à L20-20 | Auditer aliases et documents ; reprendre le bébé ; fournir 50 possessifs et trois banques de 20 textes |

À chaque étape, distinguer **préparé**, **relu par l’assistant / pilote explicite**, **approuvé par un enseignant** et **publié**. Le statut pilote n’est pas une approbation pédagogique. Les activités et niveaux déjà disponibles restent utilisables pendant l’extension ; ne pas afficher une offre vide en remplacement.

## 9. Recette du lot et preuves attendues

Les contrôles ci-dessous sont **à exécuter pendant l’implémentation**. Cette livraison documentaire ne déclare aucun résultat applicatif.

| ID | Priorité | Action ou situation | Résultat attendu et preuve |
| --- | --- | --- | --- |
| ACC-L20-01 | P0 | Comparer les 20 IDs au registre, aux niveaux et aux recettes historiques | 20 activités A1, 24 offres, aucune suppression d’ID ; tableau de correspondance daté |
| ACC-L20-02 | P0 | Auditer les 16 banques non CE et les quatre banques CE | 50 unités distinctes par activité non CE, deux présentations relues pour les quatre QCM/lacune ; 20 textes et au moins 50 questions par CE ; provenance et revue par unité |
| ACC-L20-03 | P0 | Répondre à une lacune personnelle avec plusieurs identités fictives correctes | Toutes sont recevables selon la grille ; aucun choix imposé ni échec fondé sur un prénom/âge modèle ; papier et tableau concordants |
| ACC-L20-04 | P0 | Remplir deux formulaires aux champs différents, puis sauvegarder/recharger | Champs, ordre, contraintes et données fictives conservés ; formulaire réellement rendu ; aucune altération des formulaires TPF partagés |
| ACC-L20-05 | P0 | Changer QCM/Lacune pour L20-02, 11, 15 et 17 | Même activité et même source ; correction de chaque variante ; options distinctes ; trait inline ; aucune fuite de réponse côté élève |
| ACC-L20-06 | P1 | Manipuler ordre, élisions et occurrences répétées | Tous les mots présents, IDs distincts, phrase correcte et alternative clavier/clic/tactile ; aperçu et corrigé cohérents |
| ACC-L20-07 | P0 | Traiter les quatre accords, les épicènes, vous et les possessifs | Référents explicites, réponses justifiées, aucune inférence depuis un prénom ou une image ; indices colorés encore lisibles en noir et blanc |
| ACC-L20-08 | P0 | Sélectionner 1, plusieurs puis 20 textes dans chaque CE | Documents et totalité de leurs questions conservés, numérotation et preuves correctes ; aucune troncature au compteur non CE de 50 |
| ACC-L20-09 | P0 | Insérer/retirer un saut après chaque position d’un document long | Même sélection, questions toujours liées à leur document, continuations lisibles, A4 fixe sans contenu masqué ; fiche et corrigé vérifiés |
| ACC-L20-10 | P0 | Charger les images requises, puis simuler absence ou divergence | Copie immuable vérifiée ; diagnostic utile et unités dépendantes bloquées si nécessaire ; faire-part Lucas en deux colonnes, trois phrases à droite |
| ACC-L20-11 | P0 | Construire une réponse libre, jouer les rôles et utiliser les relances au tableau | Grille et modèles non exclusifs sous contrôle enseignant, pas de score automatique ; navigation sans nouveau tirage ni révélation involontaire |
| ACC-L20-12 | P0 | Recharger anciens et nouveaux snapshots après révision des banques | Restitution du contenu figé et des médias enregistrés ; nouvelle sélection seulement à la régénération explicite |
| ACC-L20-13 | P0 | Vérifier la frontière historique/CO/théorie sur la base de développement actualisée | Régressions attribuées au lot identifiées ; aucun changement CO ou théorie imputable à ce lot ; écarts amont et divergence historique de théorie enregistrés séparément |
| ACC-L20-14 | P0 | Déclarer une offre disponible ou approuvée | Preuves datées avec commit, versions de banques, revue réelle, capacités et limites ; aucun compteur augmenté par la seule rédaction du cahier |

Relire notamment la naturalité du français, la variété des intentions, le niveau A1 et la cohérence des référents. Les contrôles de schéma et de doublons exacts ne suffisent pas. Les preuves de lecture restent au corrigé ; les réponses libres sont évaluées avec leur grille.

## 10. Clôture du lot et suite

Le lot est terminé sur le plan applicatif lorsque ses 24 offres ont leurs banques, médias nécessaires, rendus, sauvegardes et preuves de recette, avec un statut pédagogique fidèle à la revue réellement obtenue. Mettre alors à jour le registre, le bilan et le guide ; ne pas réécrire rétroactivement les anciens rapports de vérification.

Après ces 20 activités restent trois activités de famille, soit trois offres A1 :

1. **Associer** — `gram-ex-famille-curriculum-a` : 50 problèmes complets de liens familiaux, paires non ambiguës.
2. **S’exprimer à l’oral** — `gram-ex-famille-curriculum-p` : 50 situations guidées, familles fictives possibles.
3. **Écrire sur sa famille** — `gram-ex-famille-fam-pe` : 50 situations, grille et modèle non exclusif, style PE ligné ; ce type reste **tout en bas de la liste**.

Leur position dans la suite de production ne change pas les types historiques déjà accessibles. Une fois cette tranche famille achevée, poursuivre les autres thèmes dans l’ordre du cahier des charges, dont **Poser une question** et ses activités spécialisées.

Ces trois activités de famille et la suite des questions sont détaillées dans le [deuxième lot, activités 21 à 40](lot-21-40-famille-questions.md). Les deux lots constituent une préparation documentaire ; leur mise en œuvre conserve les étapes de validation décrites ci-dessus.
