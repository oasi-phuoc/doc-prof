> **Lancement de l’implémentation — 11 novembre 2026.** L’option A (intégrer les activités existantes omises) est retenue comme hypothèse de construction à la demande de démarrer. Les cinq choix pédagogiques précédents sont confirmés ; aucun ancien type n’est retiré. Le nouveau main contient un moteur interactif à réutiliser. L’état réel des lots et les limites sont suivis dans `README.md`.

# Cahier des charges d'implémentation — Grammaire A1, A2 et B1

**Produit :** ClairFLE / doc-prof. **Version :** 2.0 — 11 novembre 2026, Europe/Zurich.  
**Objet :** spécifier les exercices de grammaire, leurs banques, la sélection par niveau, les fiches A4, les corrigés et les activités collectives au tableau.  
**Base technique inspectée :** `origin/main`, commit `23b5990adede460f0198ec52228f9e7a60df7555`.  
**Livrable actuel :** ce cahier des charges et ses annexes ; il ne constitue pas une implémentation du logiciel ni une approbation linguistique de toutes les banques.

## 1. Portée et autorité des spécifications

**PER-01.** Le périmètre pédagogique comprend les 19 thèmes et les 98 notions listés intégralement en annexe A. Chaque combinaison notion/niveau précise son objectif et les familles de formats à couvrir. Les affectations de niveau reprises du plan sont conservées, avec l'ajout A2 explicitement choisi pour la comparaison et le superlatif. Pour les notions avancées, rédiger des tâches guidées et soumettre les exemples à la revue pédagogique ; il n'est pas demandé de démontrer une maîtrise autonome de niveau supérieur au niveau affiché.

**PER-02.** La compréhension orale est entièrement hors chantier : menus, types, aliases, banques, pistes, transcriptions, contrôles, niveaux, tirages et corrigés restent inchangés. Le domaine Gattegno, l'orthographe et les autres domaines ne sont pas remaniés. Les théories valables sont conservées ; la nouvelle offre d'exercices ne justifie pas leur réécriture. Les ressources existantes hors navigation ne sont pas supprimées par nettoyage opportuniste.

**PER-03.** Ce document fixe les contrats fonctionnels et techniques de la cible. Le fichier d'activités définit le découpage opérationnel ; le relevé des 199 types décrit l'existant. Une mesure de source n'est jamais une validation CECRL. En cas d'écart, appliquer les décisions utilisateur consignées au §2 et les contrats de correction, plutôt que le seul nom d'un ancien kind ou d'un conteneur TCF.

**PER-04.** Le cahier des charges ne commande aucune génération d'image, d'audio ou de transcription. Réutiliser les médias existants dont les droits et la pertinence sont établis ; consigner les besoins manquants dans le manifeste média. Une activité dépendant d'un média manquant reste non publiée.

## 2. Décisions confirmées et périmètre de construction

| ID | Décision | Conséquence obligatoire |
|---|---|---|
| DEC-U01 | Un seul type pour une même activité, avec réglage **QCM / Lacune** | Pas de doublon de menu fondé uniquement sur la présentation ; capacités et validation séparées des deux variantes |
| DEC-U02 | En CE, l'enseignant choisit le **nombre de textes**, chacun avec ses questions | Réglage par défaut : un texte ; nombre résultant de questions annoncé ; maximum égal aux supports éligibles |
| DEC-U03 | Les images sont des **supports intégrés** | Aucun type autonome Image ; les obligations I se rattachent à des activités de réponse identifiées |
| DEC-U04 | Comparaison et superlatif : A1 simple, **A2 en contexte avec choix justifiés** | Ajouter des objectifs A2 distincts pour f9, f13 et f14 ; ne pas recopier les mêmes items A1 sous une autre étiquette |
| DEC-U05 | Les autres niveaux du plan sont conservés ; tâches avancées guidées et exemples relus | Aucun élargissement automatique A1/A2/B1 ; distinguer niveau prévu et niveau effectivement publié |
| DEC-U06 — hypothèse de construction | Intégrer aussi les activités actuelles absentes des familles initiales à l’offre graduée, en conservant les IDs et regroupements | Compléter leurs banques au niveau pertinent ; les 43 types totalement omis sont pris en compte dans le registre détaillé |

Les exigences déjà fixées sont maintenues : **50 unités approuvées par activité, niveau et présentation**, **20 textes différents par banque CE** avec au moins 50 questions utilisables, niveau choisi par bloc, protection de la CO et réutilisation des contenus valables. Le volume et le découpage résultants sont calculés dans les annexes, sans multiplier les sources pour gonfler les compteurs.

## 3. Vocabulaire et unités de comptage

| Terme | Définition opérationnelle |
|---|---|
| Notion | Objectif grammatical dans le catalogue pédagogique ; son ID du plan peut différer de l'ID du sous-thème d'exercice |
| Activité / type | Tâche possédant une intention, une consigne et une politique de correction stables, ex. répondre négativement à une question |
| Présentation | Manière de répondre à la même tâche, ex. QCM ou lacune ; changer de présentation ne crée pas automatiquement une nouvelle activité |
| Support | Document, image, schéma ou contexte auquel les questions se rapportent |
| Unité source | Contenu stable réutilisable, avec provenance et révision |
| Variante approuvée | Réalisation d'une unité pour une activité, un niveau et une présentation, avec sa correction ou sa grille validée |
| Banque | Ensemble versionné de sources, supports et variantes sélectionnables pour un contrat donné |
| Recette | Configuration des blocs et graines ; les nouveaux blocs sauvegardés emportent aussi leur sélection canonique figée |
| Séance | État d'utilisation au tableau d'une sélection déjà générée ; il ne produit pas un nouveau tirage |

**COM-01.** Q/L/T/C/O : une unité est une question ou une phrase avec son contrat complet. A : une unité est un problème d'association complet, comportant ses ensembles et ses paires ; cinquante paires isolées ne prouvent pas cinquante problèmes. E/P/S : une unité est une situation avec consigne, contraintes et grille. D : une unité est une question ou une invitation distincte à écrire une question, liée à un document ; les documents se comptent à part.

**COM-02.** Les 20 textes d'une banque CE ont chacun un groupe cohérent de deux à cinq questions ou cibles de questionnement, totalisant au moins 50 unités. Pour « lire et écrire des questions », définir plusieurs informations interrogeables et des critères de réussite : une consigne générique répétée ne crée pas à elle seule cinquante cibles distinctes. Plusieurs formulations grammaticalement pertinentes peuvent répondre à une même cible.

**COM-03.** Les 50 unités sont comptées après contrôle des doublons et approbation humaine. Des changements de prénom, une permutation d'options, cinquante graines ou cinquante impressions d'une même phrase ne suffisent pas. Une même unité source peut alimenter Q et L après validation de chaque variante. A4 et tableau ne doublent jamais le quota.

**COM-04.** Une obligation I est satisfaite par cinquante situations illustrées utilisables dans son activité hôte, sans quota supplémentaire de cinquante images différentes. Ces unités comptent dans la banque de l'hôte, pas dans une activité Image fictive. Le manifeste indique les images effectivement requises, leurs références et les unités qui en dépendent.

**COM-05.** Le nombre d'options d'un QCM fait partie de sa variante approuvée. La cible de 50 ne devient pas automatiquement cinq banques de cinquante pour 2, 3, 4, 5 et 6 options. Le moteur supporte ces cardinalités ; il ne propose pas de réglage pour fabriquer des distracteurs supplémentaires à la demande. De même, les filtres facultatifs peuvent réduire la capacité affichée : ils ne justifient pas de répéter les unités ou d'appliquer au domaine Grammaire les quotas particuliers du domaine Gattegno.

## 4. Utilisateurs et parcours enseignant

**UX-01.** L'enseignant suit : Grammaire → thème → sous-thème → type d'activité → niveau disponible → présentation pertinente → nombre d'unités ou de textes → Générer. Le sélecteur de niveau appartient au bloc : une fiche peut juxtaposer A1 et A2 dans des exercices différents. Il ne modifie pas les blocs voisins.

**UX-02.** Pour une nouvelle activité graduée, le premier niveau publié dans l'ordre A1, A2, B1 est proposé par défaut et enregistré explicitement. Au changement de niveau, garder l'activité et la présentation si elle est disponible ; sinon sélectionner une présentation pertinente et afficher le changement. Aucune présentation ou aucun niveau sans banque prête n'apparaît comme sélectionnable.

**UX-03.** Le réglage QCM/Lacune apparaît uniquement lorsque l'activité et le niveau disposent réellement des deux variantes approuvées. Quand une seule est pertinente, afficher son mode sans faire croire à un choix disponible. Le QCM contient deux à six options vérifiées ; le pilote utilise trois options, sans changer les limites TCF partagées.

**UX-04.** Pour les activités non CE, proposer de 1 à 50 questions/situations, limité à la capacité éligible réelle. Pour la CE, afficher **Nombre de textes**, de 1 à 20 supports éligibles, par défaut 1, et le nombre de questions correspondant à la sélection. Les documents ne sont pas tronqués pour atteindre artificiellement un nombre arbitraire de questions.

**UX-05.** Afficher un objectif pédagogique bref et la capacité disponible. Les états « prévu », « en préparation » et « disponible » sont distincts. Les niveaux en préparation peuvent être expliqués par une indication de disponibilité, mais le générateur ne produit pas de fiche vide pour ces niveaux.

**UX-06.** Charger une ancienne recette sans niveau utilise sa banque historique et ne lui injecte aucun niveau. Montrer son état « banque actuelle / historique » de manière discrète. Passer à une banque graduée est une action explicite qui propose une nouvelle sélection ; elle ne réécrit pas l'ancien document en silence.

**UX-07.** Changer d'aperçu A4, de corrigé ou de tableau ne change ni les questions, ni leur ordre, ni les corrections. Les éditions manuelles sont conservées ; toute action qui les remplace avertit de ce remplacement et permet de revenir en arrière selon les mécanismes du produit.

**UX-08.** Distinguer les paramètres préparés de la sélection appliquée. Si une modification exige une régénération, ne pas sauvegarder une recette qui annonce le nouveau niveau avec le snapshot de l'ancien. L'interface demande de générer ou de revenir aux paramètres appliqués ; les réponses ou éditions ne sont remplacées qu'à cette action explicite.

## 5. Mise en page et conventions des exercices

**REN-01.** La fiche reste au format fixe **210 × 297 mm**. Aperçu et impression utilisent le même rendu de feuille. Une page trop chargée crée une continuation ou demande de répartir les exercices ; elle ne réduit pas automatiquement toute la feuille, ne déborde pas et ne masque pas un texte avec `overflow:hidden`.

**REN-02.** Titres chronologiques « Exercice 1, 2… », consigne sous le titre, numéro simple de chaque question, espace de réponse adapté. Pas de nouvelle boîte décorative autour de chaque question. Les transformations, réponses développées et corrections de phrases ont un trait sous la phrase ou la question ; la lacune reste dans la phrase lorsqu'elle vise un mot.

**REN-03.** Remplacer les points de suspension utilisés comme blancs par des traits de réponse colorés dans les exercices concernés. Conserver les véritables signes de ponctuation dans les textes. La couleur est sémantique, lisible en noir et blanc et liée aux variables du thème.

**REN-04.** Pour les pronoms sujets, l'indice de prénom est placé entre parenthèses, en couleur, après le trait. Lorsque l'indice ♂/♀ est demandé, le genre du personnage est une donnée explicite cohérente avec le texte ; il n'est pas déduit automatiquement d'un prénom. Les mentions « masculin » et « féminin » entre parenthèses sont également en couleur.

**REN-05.** Pour conjuguer une catégorie de verbes, l'infinitif indicatif apparaît entre parenthèses en couleur après le blanc. Il n'est pas ajouté systématiquement aux exercices consacrés uniquement à être, avoir ou aller. Les indices restent séparés de la réponse attendue dans les données et dans le corrigé.

**REN-06.** En CE, garder l'ordre des questions, l'identité du document et les références de correction après pagination. Le professeur peut insérer ou retirer un saut de page après chaque question. Une continuation indique clairement de quel texte elle dépend ; le document reste consultable au tableau. Aucun support n'est abandonné en bas de page sans sa première question si cela empêche la lecture.

**REN-07.** Pour la PE, employer le style de production écrite existant : consigne, aides éventuelles et espace ligné suffisant, répartissable sur plusieurs pages. Une proposition de réponse du corrigé est explicitement un modèle possible. Aucun nombre de mots arbitraire identique n'est imposé à tous les niveaux et toutes les intentions.

## 6. Activités spécialisées à décrire et conserver

### 6.1 Questions fermées — c1

**SPE-01.** Six activités distinctes : poser avec est-ce que ; poser avec inversion ; répondre affirmativement ; répondre négativement ; lire et répondre ; lire et écrire des questions fermées. Chaque activité conserve son identité, ses quotas et ses critères.

Pour transformer : la consigne met **est-ce que** ou **inversion** en gras et en couleur. Chaque item donne seulement une phrase affirmative, suivie du trait de réponse. Exemples : « Tu habites à Sion. » → « Est-ce que tu habites à Sion ? » ou « Habites-tu à Sion ? ». Ne pas répéter la même instruction à chaque phrase.

Pour répondre : donner une vraie question, puis un trait dessous. Le contexte doit fixer la personne qui répond, le référent et la polarité attendue. Une forme de vous ambiguë ne doit pas imposer une réponse unique en je ou nous sans préciser l'interlocuteur. Les réponses sont des phrases complètes, pas seulement oui/non.

En CE, mélanger est-ce que et inversion, ainsi que les réponses affirmatives et négatives fondées sur le document. Ne pas demander de déduire un fait qui ne peut pas être établi à partir du texte.

### 6.2 Questions ouvertes — c2

**SPE-02.** Cinq activités distinctes : pronom interrogatif + est-ce que ; pronom interrogatif + inversion ; répondre à la question ; lire et répondre ; lire et écrire des questions ouvertes.

Une transformation fixe l'information à interroger par le contexte ou une consigne claire, ou accepte toutes les questions pertinentes. Par exemple « Il va à l'école » peut donner « Où est-ce qu'il va ? » si le lieu est ciblé. Ne pas rejeter une autre question grammaticale lorsque rien ne détermine la cible. Les réponses personnelles ou inventées sont évaluées avec une grille, pas comparées à une seule valeur de banque.

### 6.3 Questions avec quel — c3

**SPE-03.** Quatre activités distinctes : poser ; répondre ; lire et répondre ; lire et écrire des questions. L'accord quel/quelle/quels/quelles dépend du nom et du contexte. Le corrigé tient compte des formulations pertinentes, sans transformer une réponse libre en fausse question fermée.

### 6.4 Présentation, famille et présent

**SPE-04.** Ne pas recréer le type supprimé « Compléter le pronom ». Conserver le type affiché **Complétez le pronom**, avec ses variantes pertinentes. Les adjectifs de nationalité conservent la réponse inline et le QCM. Les données d'identité peuvent être fictives ; la réussite grammaticale ne dépend pas de la divulgation d'informations personnelles.

**SPE-05.** Famille : conserver **Déterminants possessifs** fusionné, **Photo de famille** réunissant arbre/photo/récits, **Message et email**, **Faire-part de naissance** et **Écrire sur sa famille** au style PE, placé en bas de liste. La distinction entre déterminants et véritables pronoms possessifs reste correcte dans les contenus. Conserver les aliases des anciens regroupements pour les recettes.

Le faire-part utilise l'image du bébé existante et une colonne de texte à droite. Le support Lucas conserve les trois phrases, chacune sur sa ligne : « Julie et Thomas annoncent la naissance de leur fils Lucas. » ; « Lucas a un frère, Noah, et une sœur, Emma. » ; « Paul et Anne sont leurs grands-parents. » Les variantes nouvelles doivent donner toutes les informations nécessaires et garder les liens familiaux cohérents. Ce texte est un support à préserver ; sa répétition ne constitue pas une banque de cinquante situations.

**SPE-06.** Dans les onze sous-thèmes du présent, conserver **Corriger l'erreur** et **Mots dans l'ordre** ainsi que les aliases historiques. Les partitions a1/a2 des données d'ordre ne sont pas à elles seules une preuve d'approbation CECRL. Le nouveau niveau s'applique aux activités effectivement graduées ; les mots et verbes employés correspondent au sous-thème. Les capacités tiennent compte des filtres de polarité et de catégories déjà présents, sans modifier les banques Gattegno partagées.

## 7. Audit initial et décisions techniques de compatibilité

**AUD-01.** Refaire le relevé au commit exact où commencera le développement et enregistrer la différence avec la référence de ce document. Le relevé présent constate 19 thèmes, 98 documents de théorie, 134 sous-thèmes runtime et 238 types de pratique : 199 hors CO et 39 CO. Il existe 125 banques ordinaires, 6 800 entrées brutes, plus des données spécialisées ; aucune de ces capacités n'est approuvée par niveau dans ce cahier des charges.

**AUD-02.** `assertGrammaireCatalog()` échoue déjà sur `gram-a5-theorie`, référencé par Aller mais absent du tableau des théories. La fiche a4 actuelle couvre conjugaison et destinations. Capturer cet état en G0. Si la fusion est confirmée, la cible est : une référence visible a4 et un resolver d'alias historique a5 → a4, sans réécriture du contenu théorique ni remplacement silencieux des IDs dans les anciennes recettes. Si le contenu correspondant manque réellement, le restaurer depuis la source validée avant de retirer le lien. Ne pas changer seulement le compteur d'un test.

**AUD-03.** Les contrats de CO sont protégés par les IDs/kinds exacts, y compris `nat-co` et les aliases historiques. Certains exercices écrits utilisent un ancien conteneur TCF `competence:'CO'` avec un audio vide ; ce marqueur de rendu ne les transforme pas en compréhension orale. Ni le champ competence, ni la présence ou l'absence d'audio ne constituent la frontière du chantier.

**AUD-04.** Conserver la vérité éditoriale dans les sources des scripts ou un complément versionné que ces scripts préservent. Tout changement d'une banque générée doit être reconstructible ; l'ordre historique ne doit pas être remplacé par un tri de nouveaux IDs pour les recettes anciennes.


## 8. Contrats pédagogiques et éditoriaux

« Doit » conditionne la publication. Garder types, alias et recettes compatibles. Choix confirmés : un type avec variantes Q/L ; tirage CE par textes avec questions ; I support, jamais type autonome.

### PED-01 — Unité, quota, qualité

Le quota est **50 unités distinctes approuvées et sélectionnables par activité/niveau/présentation**. A4 et tableau partagent leurs unités : pas 50 + 50. Réemployer une source en Q/L est permis, mais chaque réalisation doit être validée. Cinquante tirages ou changements de prénom ne créent pas cinquante unités pertinentes.

Chaque unité porte objectif, prérequis, niveau, provenance, consigne, réponse/grille, statut et relecteur. Relire accords, syntaxe, sens, registre et ambiguïtés ; les contrôles de doublons ne suffisent pas. Varier personnes, verbes et contextes adaptés.

Public adolescent : école, stage, mobilité, loisirs, numérique, démarches ; Suisse romande si utile. Donner les informations nécessaires. Autoriser identités/familles fictives sans divulgation personnelle imposée.

### PED-02 — Contrats des onze familles

| Code | Tâche et données obligatoires | Correction et deux supports |
|---|---|---|
| Q | Énoncé contextualisé ; options distinctes, une réponse exacte. Trois options au pilote ; cible 2–6 via adaptation grammaticale dédiée. | IDs stables, distracteurs tous faux dans ce contexte. Cases/lettres A4 ; seules les cartes proposées sont actives. |
| L | Blanc positionné ; forme ciblée et indice utiles. | Réponse ou variantes approuvées ; tolérance typographique sans accepter une erreur d'accord. Trait/champ A4 ; saisie/étiquettes au tableau. |
| A | Deux ensembles ; relation explicite, paires déterminées. | Paires par IDs ; relation multiple uniquement si annoncée. Colonnes A4 ; liaison par clic/clavier/tactile. |
| O | Tous les mots nécessaires ; consigne si mots parasites. | Ordre(s) accepté(s) validé(s), sinon correction guidée. Mots et ligne A4 ; manipulation avec alternative clavier/clic. |
| T | Départ, transformation, contraintes et sens à conserver. | Formulations approuvées ou validation enseignant. Phrase puis réponse dessous ; reconstruction/saisie au tableau. |
| C | Erreur véritable selon l'objectif ; correction sans inventer des faits. | Phrase entière corrigée, diagnostic, explication. Réécriture A4 ; repérage puis correction au tableau. |
| D | Document, genre/niveau, questions liées par IDs. | Preuve textuelle pour comprendre ; critères pour inventer des questions. A4 paginé ; projection sans réponses dévoilées. |
| E | Situation, intention, destinataire, contraintes et aides adaptées. | Grille et modèle non exclusif ; pas de note automatique. Espace d'écriture A4 ; construction collective au tableau. |
| P | Situation orale, rôles, intention et relances. | Grille humaine : structure cible, pertinence, intelligibilité. Préparation A4 ; déclencheur/relances projetés. |
| S | Dialogue/situation avec contrat déclaré fermé ou ouvert. | Fermé : choix/lacunes contrôlés ; ouvert : grille et variantes. Compléter/jouer sur les deux supports. |
| I | Image, source/droits, alt et informations nécessaires. | Contrat de réponse Q/L/A/E/P explicite. Papier/écran lisibles. Une image seule ne possède pas un corrigé grammatical. |

**Choix actés :** I est un support rattaché à une activité Q/L/A/E/P, sans bouton autonome. Ses 50 situations illustrées utilisables sont contrôlées dans l'activité hôte ; elles n'exigent pas 50 images différentes ou nouvelles. Avant ajout A2 des comparaisons, les onze obligations I accompagnent 488 cellules de réponse ; après cette décision, le registre de base comporte 502 obligations de familles de réponse et les mêmes onze obligations I. Q/L restent variantes d'un type unique, avec validation séparée des réalisations ; ne pas compter deux fois le même quota hôte.

**Médias :** réemployer l'existant ; aucune génération d'image/audio. Consigner les images manquantes dans un manifeste à produire/reprendre plus tard. Une activité dépendant d'une image absente n'est pas prête.

### PED-03 — Banques CE

Chaque banque CE doit avoir **20 textes différents** et **au moins 50 questions utiles** pour son activité/niveau. Exemple : dix textes avec 2 questions, dix avec 3. Compter documents et questions séparément. Le paramètre de tirage est le **nombre de textes** ; les questions liées accompagnent chaque texte choisi. Le quota éditorial demeure distinct du tirage.

Réemployer les documents entre activités exige une revue distincte des questions. Varier genre, intention, situation et organisation : message, courriel, annonce, règlement, notice, description, récit si pertinents. Changer quelques noms ne suffit pas. Relire niveau, densité et longueur sans seuil uniforme arbitraire.

Chaque réponse factuelle a une preuve dans le texte. « Lire et écrire des questions » fournit des informations interrogables et une grille : correction linguistique, pertinence, fidélité au texte. Plusieurs formulations sont admises ; une question grammaticalement correcte mais sans rapport au texte n'est pas validée.

### PED-04 — Activités distinctes à conserver

| Sous-thème | Activités et contraintes |
|---|---|
| c1 — Fermées | Transformer avec est-ce que ; avec inversion ; répondre affirmativement ; négativement ; lire/répondre (est-ce que et inversion, positif/négatif mélangés) ; lire/écrire des questions fermées. Chaque tâche a son compteur. |
| c2 — Ouvertes | Interrogatif + est-ce que ; interrogatif + inversion ; répondre ; lire/répondre ; lire/écrire des questions ouvertes. Cibler l'information par contexte/consigne ou accepter plusieurs questions pertinentes. |
| c3 — Avec quel | Poser ; répondre ; lire/répondre ; lire/écrire des questions. Vérifier quel/quelle/quels/quelles selon le nom. |
| Présent, 11 sous-thèmes | Corriger l'erreur = réécriture entière ; mots dans l'ordre = sources a1/a2 et alias conservés. Publier seulement les niveaux approuvés. Indice infinitif en couleur après le blanc pour catégories de verbes, pas ajouté par défaut pour être/avoir/aller. |
| Identité / pronoms / nationalités | Conserver variantes QCM/lacune et indices. Ne pas recréer le type supprimé « Compléter le pronom » ; conserver « Complétez le pronom ». |
| Famille | Possessifs regroupés ; Photo de famille = arbre/photo/récits variés ; faire-part = image existante + phrases à droite, une par ligne ; Écrire sur sa famille au style PE en bas de liste. Liens de parenté cohérents. |

Mettre est-ce que/inversion en gras couleur dans la consigne, sans instruction répétée dans chaque item. Présenter phrase/question puis trait dessous. Les blancs utilisent des traits colorés, sans remplacer la ponctuation authentique des documents. Prénom/indice à droite du trait ; ♂/♀ quand demandé, à partir d'une donnée explicite, sans déduire le genre d'un prénom ambigu.

Exemples : « Tu habites à Sion. » → « Est-ce que tu habites à Sion ? » / « Habites-tu à Sion ? ». Pour « Où va-t-il ? », consigne/contexte doivent cibler le lieu. « Il faut que tu ___ (venir). » → « viennes » travaille k10 (formation), pas k13 (choix du mode).

### PED-05 — Niveaux : frontières à valider

Décisions confirmées : f9/f13/f14 en A1 simple et A2 contextualisé ; m5 conserve Q/L A1 et Q/L/C/T A2. Les autres niveaux suivent le plan, avec étayage et revue des exemples pour le PC avec être A1, le gérondif A2 et les notions avancées B1. Les relatives A2 ciblent qui/que/où ; le travail systématique de dont se situe dans i8 B1. Aucun ancien type n’est supprimé pour résoudre ces choix.


## 9. Contrat technique d’implémentation

Les exigences ci-dessous décrivent la cible à développer. Elles ne déclarent pas que cette architecture existe déjà. La référence inspectée est `origin/main` au commit `23b5990adede460f0198ec52228f9e7a60df7555`. Aucun fichier de l'application n'a été changé pour rédiger ce cahier des charges.

### T1 — Frontière des chemins de génération

**TECH-01.** Trois chemins sont obligatoires : CO historique, grammaire historique hors CO, grammaire graduée hors CO. Leur sélection est explicite :

1. Déterminer si le type appartient à la CO par les IDs exacts, kinds et alias protégés. Si oui, exécuter la branche CO existante ; les nouveaux paramètres grammaticaux sont ignorés, sans modifier les paramètres CO ni leurs normalisations historiques.
2. Pour un type hors CO, si tous les champs gradués sont absents, exécuter la branche historique avec les mêmes banques, ordre, paramètres et graines que la référence G0.
3. Si le bloc porte une configuration graduée complète et valide, exécuter le nouveau chemin.
4. Si le bloc porte une configuration graduée partielle ou incohérente, afficher une erreur de configuration réparable. Ne pas faire semblant de réussir en revenant silencieusement au chemin historique ou au niveau A1.

La frontière CO repose exclusivement sur les types/kinds/alias recensés. **Ne pas classer une activité selon `TcfExercise.competence`, `audioSrc`, un tableau d’audios ou leur absence** : certaines activités écrites historiques d’identité/provenance utilisent `competence: CO` avec une piste vide. Ce marqueur historique ne les fait pas entrer dans la CO protégée et n’est pas corrigé à l’occasion du nouveau routage. Le simple préfixe `gram-ex-` n'est pas suffisant pour conclure qu'une activité est éligible. Le nouveau registre fournit une liste positive d'activités hors CO. Il est interdit de détourner `difficulty`, `grammarCoLevel`, `grammarCoAudioId` ou un type TCF pour représenter le niveau grammatical.

**TECH-02.** La protection CO comprend au minimum les 38 types `co-theme` actuellement visibles, `gram-ex-a3-nat-co`, les alias `gram-ex-a1-co-audio` et `gram-ex-famille-fam-co`, leurs banques, générateurs, métadonnées, pistes, corrections et contrôles. Le détecteur existant `isGrammarCoType()` ne reconnaît pas `nat-co` au commit inspecté : la nouvelle frontière ne doit donc pas reposer sur lui seul. Ne pas exclure intégralement les sous-thèmes a1, a3 ou famille, qui portent aussi des activités écrites.

### T2 — Modèle canonique, provenance et validation

**TECH-03.** Une unité source, une activité, sa présentation et une sélection générée sont des objets distincts. **Décisions utilisateur : QCM et lacune sont deux présentations d’un même type, sélectionnées par un toggle ; les images sont des supports intégrés, sans type autonome Image.** Le schéma conserve une validation et une capacité propres à chaque présentation, sans créer deux tâches de menu lorsque seul le mode de réponse change. Les anciens IDs distincts éventuels restent des alias compatibles ; les sources ne sont pas dupliquées pour alimenter le toggle. Une même situation source peut alimenter plusieurs présentations, mais chacune reçoit un contrat de réponse et une validation propre. Une image ou un document est un support ; son existence ne suffit pas à valider une question.

Le schéma suivant fixe les concepts et les contraintes. Les noms de fichiers peuvent être adaptés aux conventions du dépôt ; les garanties restent obligatoires.

```ts
type GrammarLevel = 'A1' | 'A2' | 'B1';
type GrammarQuestionPresentation =
  | 'choice' | 'gap' | 'match' | 'order'
  | 'transform' | 'correct' | 'open-written' | 'open-oral';

// Un bloc CE peut mélanger des questions de mécaniques différentes.
type GrammarBlockPresentation =
  | GrammarQuestionPresentation | 'document-set' | 'scenario-set';

type GrammarResponseContract =
  | { kind: 'choice'; options: Array<{ id: string; text?: string; imageId?: string }>;
      correctOptionId: string; explanation: string }
  | { kind: 'gap'; blanks: Array<{ blankId: string; accepted: string[] }>;
      normalization: 'typographic-fr'; explanation: string }
  | { kind: 'match'; left: Array<{ id: string; text: string }>;
      right: Array<{ id: string; text: string }>;
      pairs: Array<[string, string]>; explanation: string }
  | { kind: 'order'; tokens: Array<{ id: string; text: string; category?: string }>;
      acceptedOrders: string[][]; explanation: string }
  | { kind: 'transform'; evaluation: 'approved-list';
      acceptedAnswers: string[]; explanation: string }
  | { kind: 'transform'; evaluation: 'teacher';
      possibleModels: string[]; teacherGuidance: string[]; explanation: string }
  | { kind: 'correct'; errorSpans: Array<{ segmentId: string; start: number; end: number }>;
      acceptedAnswers: string[]; explanation: string }
  | { kind: 'open'; channel: 'written' | 'oral';
      criteria: Array<{ id: string; label: string; observation: string }>;
      possibleModels: string[]; followUpPrompts?: string[] };

interface GrammarSource {
  id: string;                 // créé une fois ; immuable
  revision: string;
  content: StructuredText;    // texte / emphase / indice / blanc ; aucun HTML arbitraire
  supportIds: string[];
  provenance: {
    origin: 'legacy' | 'new';
    path?: string;
    commit?: string;
    legacyTypeId?: string;
    legacyPosition?: number;  // position de migration figée, jamais ID dynamique
  };
}

interface GrammarQuestionVariant {
  id: string;
  sourceId: string;
  activityId: string;
  level: GrammarLevel;
  presentation: GrammarQuestionPresentation;
  objectiveId: string;
  response: GrammarResponseContract;
  documentId?: string;
  prerequisites: string[];
  editorial: { status: 'draft' | 'reviewed' | 'approved'; reviewer?: string;
    reviewedAt?: string; rationale?: string };
}

interface GrammarActivitySpec {
  id: string;
  runtimeSubthemeId: string;
  pedagogicalNotionId: string;
  existingTypeIds: string[];
  targetTypeId: string;
  selectionUnit: 'question' | 'document' | 'situation';
  plannedLevels: GrammarLevel[];
  publishedLevels: GrammarLevel[];
  plannedPresentationsByLevel: Partial<Record<GrammarLevel, GrammarBlockPresentation[]>>;
  publishedPresentationsByLevel: Partial<Record<GrammarLevel, GrammarBlockPresentation[]>>;
  bankRevision: string;
  rubricRequired: boolean;
}
```

**Distinction des présentations :** `GrammarQuestionPresentation` désigne la mécanique d’une question. `GrammarBlockPresentation` désigne le contrat du bloc configuré : une mécanique simple, `document-set` pour une CE regroupant ses supports/questions, ou `scenario-set` pour un ensemble de situations/dialogues. Une CE mixte n’enregistre jamais arbitrairement `gap` ou `choice` comme présentation uniforme du bloc. Ses variantes enfants portent chacune leur vraie mécanique et leur correction. Le toggle QCM/lacune concerne une activité qui expose ces deux variantes approuvées ; il ne transforme pas en QCM tous les items d’un document ou d’un jeu de rôle.

Le canonique généré expose des groupes ordonnés : `groups: Array<{ id: string; kind: 'individual' | 'document' | 'situation'; supportIds: string[]; questionIds: string[] }>` et une collection de questions identifiées. Un groupe document relie une fois son texte à ses questions, même si leurs mécaniques diffèrent. Le snapshot et la séance conservent ces groupes.

`StructuredText` est un arbre de segments sérialisables : texte, mise en évidence, blanc identifié et indice. Les catégories de couleur sont sémantiques ; ne pas enregistrer du HTML ou de classes CSS arbitraires dans les banques. Le rendu des marques existantes doit passer par un adaptateur explicite et contrôlé.

**TECH-04.** Les identifiants sont stables, uniques et attribués à la création ou à une migration figée. Ils ne dépendent ni de la position actuelle dans un tableau, ni de la graine, ni du prénom, ni d'un hash recalculé après chaque correction. Le hash du contenu sert à contrôler une révision, pas à redéfinir l'identité. Un changement éditorial conserve l'identité lorsqu'il corrige la même question ; une nouvelle tâche ou un nouveau sens reçoit une autre identité.

**TECH-05.** Le contrat de publication compte les variantes approuvées par `(activityId, level, presentation)`, et non le nombre de lignes d'une banque brute. Une entrée publiée possède au moins 50 variantes distinctes approuvées, sauf contrat spécifique déjà documenté pour les supports. Pour un bloc CE de présentation `document-set`, le registre conserve séparément les 20 documents, les variantes enfants avec leurs mécaniques et le nombre total de questions approuvées, au moins 50. On ne demande pas 50 documents au nom du quota et on ne prétend pas que chaque document contient tous les formats. Pour `scenario-set`, compter les 50 situations utilisables avec les questions/rôles et critères requis par chaque situation. Un même document utilisé dans deux activités ne devient pas deux textes sources différents.

**TECH-06.** L'accès en production filtre `editorial.status === 'approved'` avant le tirage. Un statut `reviewed` ou `draft` n'est jamais affiché aux élèves par le générateur ordinaire. `plannedLevels` ne pilote pas les boutons actifs ; seuls les niveaux `publishedLevels` dont les présentations sont réellement prêtes le font. Aucun menu ne propose une présentation vide ou un niveau artificiel.

**TECH-07.** Pour toute réponse fermée : aucune option dupliquée après normalisation, exactement une réponse correcte en choix simple, références existantes et correction explicite. Pour l'ordre, identifier séparément les occurrences d'un mot répété ; par exemple deux « de » ne peuvent pas être confondus par une clé fondée sur le seul texte. Pour l'association, le schéma déclare les paires, pas une égalité de positions après mélange. Les variantes acceptables sont rédigées et approuvées ; aucune similarité floue ni décision automatique par modèle linguistique n'est nécessaire.

La normalisation `typographic-fr` se limite à Unicode NFC, aux espaces de bordure, aux séquences d'espaces ordinaires et aux variantes typographiques d'apostrophe explicitement équivalentes. Elle ne supprime ni accents, ni lettres, ni négations. Les règles de casse et de ponctuation finale sont déclarées par activité ; une transformation de phrase ne doit pas accepter une réponse grammaticalement différente au nom d'une tolérance.

Pour C, chaque intervalle d'erreur référence un segment texte canonique par `segmentId`. Les bornes `[start, end)` sont des offsets UTF-16 dans la valeur de ce segment stockée en NFC, avant rendu, sans balisage historique ni HTML. Le validateur vérifie l'existence du segment, les bornes et le mot effectivement visé. Une migration calcule ces positions après conversion en texte structuré, jamais sur une ancienne chaîne contenant des marques de couleur. Les changements de rendu ne déplacent pas la zone d'erreur.

### T3 — Contrat de configuration et de sauvegarde

**TECH-08.** Le format externe `FicheRecipe.version` reste à `1` : les nouveaux champs des blocs sont optionnels dans le schéma global, sérialisables et ignorés par les chemins historiques. Le schéma interne des unités et du snapshot gradué porte sa propre version. Ils deviennent obligatoires pour un nouveau bloc lorsqu’il utilise le chemin gradué, selon les règles ci-dessous.

Champs cohérents à ajouter sur un bloc de grammaire graduée :

```ts
grammarLevel?: 'A1' | 'A2' | 'B1';
grammarActivityId?: string;
grammarPresentation?: GrammarBlockPresentation;
grammarBankRevision?: string;
grammarBlockId?: string;            // stable dans la recette
grammarDocumentCount?: number;      // nombre de textes pour un bloc CE
grammarPageBreakAfterQuestionIds?: string[];
grammarSnapshot?: GrammarFrozenExercise;
```

Pour chaque nouveau bloc gradué, `grammarLevel`, `grammarActivityId`, `grammarPresentation`, `grammarBankRevision` et l’identité stable de bloc sont enregistrés explicitement. Ces champs restent absents sur les blocs historiques non convertis. Le `count` existant reste le nombre demandé pour les tâches sélectionnées à l’unité question/situation. Le réglage CE est le **nombre de textes**, conformément à la décision utilisateur ; il alimente `grammarDocumentCount` et ne se confond pas avec le nombre de questions résultant. La configuration enregistre toujours le niveau, la présentation et la révision réellement générés, pas seulement un choix visuel du menu.

**TECH-09.** Lorsqu’une fiche graduée est sauvegardée ou exportée, son exercice canonique généré est figé dans `grammarSnapshot` : version de schéma, IDs et révisions sources, consigne, supports retenus, questions et réponses, ordre des options, présentation et ordre des questions. Le snapshot contient uniquement les supports et questions sélectionnés, pas toute la banque. Il est validé au chargement comme les autres données de recette. Les images sont référencées par des chemins stables autorisés et des empreintes de contenu, sans blobs binaires ni URL temporaires. Le snapshot persistant est produit lors de la sauvegarde/export ; les changements de vue utilisent l’exercice canonique déjà résolu en mémoire. Ne pas charger toutes les archives de banques pour afficher une seule fiche.

Ce gel rend la fiche sauvegardée reproductible même si une banque évolue. Une ancienne révision de banque n'a donc pas besoin d'être chargée depuis le réseau pour afficher une fiche déjà figée. Le professeur doit déclencher explicitement « Régénérer avec la banque actuelle » pour remplacer ce snapshot ; l'action affiche ce qui sera remplacé et respecte la gestion des modifications libres.

Les références des **images graduées** sont immuables : utiliser un chemin versionné ou fondé sur l'empreinte, et conserver les anciennes révisions tant qu'elles sont référencées par des fiches. Pour reprendre une image partagée existante, une copie versionnée dans les médias de grammaire graduée est permise après vérification de sa source ; ne pas déplacer ni remplacer l'original partagé ou CO. Une empreinte seule, enregistrée à côté d'un chemin écrasable, ne garantit pas cette fidélité. À la lecture, une divergence de contenu est signalée ; ne pas afficher silencieusement une nouvelle image à la place de celle de la fiche sauvegardée. Les snapshots ne contiennent toujours pas de blobs binaires.

Avant la première génération, `grammarSnapshot` peut être absent : une configuration valide et une révision disponible permettent de générer. Une fiche déjà générée et sauvegardée ne doit pas perdre son snapshot au rechargement ou à un simple changement de vue. Si le snapshot manque et que la révision n'est plus disponible, afficher « Révision de banque indisponible » et proposer une régénération explicite ; ne pas charger la dernière banque en silence.

Le contrôle de disponibilité actuelle s'applique aux **nouveaux tirages**. Un snapshot valide d'une fiche déjà sauvegardée reste affichable même si l'activité ou la révision n'est plus publiée dans le registre courant ; son rendu utilise ses données figées et le schéma supporté. Une nouvelle génération exige en revanche une offre actuelle valide. La compatibilité promise est celle du nouveau lecteur avec les anciennes recettes ; elle ne garantit pas qu'une ancienne version du logiciel comprend les nouveaux champs et snapshots malgré le maintien du numéro externe de recette à 1.

**TECH-10.** `libreItems`, `libreSnapshot` et les contenus édités gardent leur priorité existante. Changer de niveau, de présentation, de filtre ou de banque invalide le tirage, mais ne détruit pas une édition manuelle sur un simple clic de sélection. La régénération qui la remplace est une action explicite, annulable selon les mécanismes du produit. Un changement d'onglet A4/corrigé/tableau ne régénère jamais.

### T4 — API, capacités, hasard et filtres

**TECH-11.** Prévoir des fonctions pures ou équivalentes aux contrats suivants :

```ts
resolveGrammarRoute(block): 'co-legacy' | 'grammar-legacy' | 'grammar-graded';
validateGrammarConfig(block, registry): ValidationResult;
getGrammarAvailability(activityId, blockPresentation, level, filters): {
  selectionUnit: 'question' | 'document' | 'situation';
  eligibleSelectionCount: number;
  approvedQuestionCount: number;
  eligibleQuestionCount: number;
  eligibleDocumentCount?: number;
  childPresentations: GrammarQuestionPresentation[];
  published: boolean;
};
generateGrammarExercise(request, bank, rng): Result<CanonicalGrammarExercise>;
freezeGrammarExercise(exercise): GrammarFrozenExercise;
renderGrammarA4(exercise, { correction, layout }): WorksheetBlocks;
createGrammarSession(exercise): GrammarSessionState;
```

Les fonctions de capacité et de génération appliquent **exactement les mêmes filtres** dans le même ordre logique. `eligibleSelectionCount` se mesure selon l’unité déclarée : questions pour une tâche simple, documents pour une CE, situations pour un bloc de scénarios ; `eligibleQuestionCount` reste distinct. Pour `document-set`/`scenario-set`, la disponibilité vérifie le groupe et toutes les variantes enfants nécessaires, sans exiger une fausse présentation unique sur les questions. Le bloc est indisponible si un de ses supports ou éléments indispensables manque. Toute sélection porte sur le niveau, l'activité et la présentation approuvés, puis sur les paramètres réellement proposés. Les filtres historiques du présent (polarité, catégories de mots) ne sont pas supprimés ni réinterprétés en niveau CECRL ; un adaptateur explicite les applique dans la nouvelle branche lorsqu'ils restent pertinents.

**TECH-12.** Le tirage s'effectue sans remplacement dans le pool éligible. Même recette, même révision, même configuration et même graine produisent les mêmes IDs, ordre de questions, mélanges d'options/tokens et corrigés. Utiliser des flux pseudoaléatoires dérivés séparément pour la sélection des questions et les mélanges de chaque question ; changer le mélange d'une question ne doit pas sélectionner une autre banque ou un autre document. Le sous-flux de mélange est dérivé d'une clé stable de question, pas de l'index de rendu après pagination.

La sélection canonique précède la pagination et le rendu. A4, corrigé et tableau consomment cette même sélection. Les boutons précédent/suivant, les sauts de page, le redimensionnement et la révélation n'ont aucun accès au tirage aléatoire.

**TECH-13.** La capacité affichée correspond au pool éligible après tous les filtres. Le quota de 50 concerne la banque de base approuvée ; une combinaison facultative de filtres peut réduire la capacité. L'interface borne le nombre demandé au plafond affiché. Si une recette importée demande davantage que la capacité actuelle et ne possède pas de snapshot exploitable, renvoyer une erreur avec le plafond réel ; ne pas répéter des questions, désactiver un filtre ou changer de niveau pour remplir le nombre.

**TECH-14.** Le réglage visible des activités CE est **« Nombre de textes »**, de 1 au nombre de supports éligibles (au maximum 20 pour la banque cible), par défaut 1. L’API reçoit ce nombre de documents. Chaque document est sélectionné sans remplacement avec son groupe cohérent de questions approuvées ; afficher également le nombre de questions résultant. La banque conserve 20 textes différents et au moins 50 questions approuvées, normalement 2 à 5 par texte. Choisir 20 textes n’implique donc pas 20 questions. Le contrôle global « nombre de questions » n’est pas présenté comme un second quota contradictoire pour ce bloc CE. Les sauts de page restent possibles après chaque question, même si le choix initial porte sur les textes.

Les activités « lire et répondre » et « lire et écrire des questions » ont des variantes et critères distincts même si elles réutilisent un support. Un document réutilisé demeure une source unique ; ses questions et grilles sont approuvées pour chaque activité et niveau.

### T5 — Rendu grammatical 2–6 options et contrat A4

**TECH-15.** Créer un adaptateur et un rendu de grammaire graduée propres. Recommandation : ajouter une charge utile `grammar` et un `layout: 'grammar'` à `MathItem`, discriminés et utilisés uniquement par le nouveau chemin, avec des composants `GrammarQuestion` / `GrammarSupport`. Les primitives visuelles existantes peuvent être réutilisées. Il est interdit d'envoyer cinq ou six options vers `gramItemsToTcfExercise` ou de changer globalement les validateurs TCF afin de contourner leur plafond actuel.

Le contrat grammatical doit accepter 2 à 6 choix réels approuvés, avec lettres A–F. Le pilote peut utiliser trois choix ; la mécanique doit être testée pour 2, 3, 4, 5 et 6 sans tronquer. Une activité à trois options ne reçoit aucune option D/E/F artificielle. Les lettres affichées sont calculées après le mélange et pointent vers les IDs des options ; le corrigé et le tableau utilisent cette association figée. Les couleurs de carte ne codent pas la justesse.

**TECH-16.** Les réponses libres sont des surfaces de rédaction ou des interactions guidées, pas des QCM déguisés. A4 montre les traits ou l'espace adaptés. La correction montre les solutions acceptées, une explication ou une grille selon le contrat. PE/PO et jeux de rôles ouverts ne reçoivent ni bonne réponse personnelle imposée ni note automatique. Pour l'ordre et l'association, le support A4 reste réalisable au stylo, avec un espace de réponse et une numérotation lisible.

**TECH-17.** Les blancs fonctionnels sont stockés comme segments identifiés et rendus sous forme de traits de réponse. Le marqueur source `___` peut être adapté à ces segments lors de la migration. Ne pas remplacer les véritables ellipses d'une citation, d'un message ou d'une ponctuation expressive. L'emphase des indices, des accords et des prénoms est conservée ; une consigne particulière à une activité figure une fois au bon niveau plutôt que dans chaque énoncé.

**TECH-18.** Pagination CE : stocker les sauts de page de la nouvelle branche par IDs de questions (`grammarPageBreakAfterQuestionIds`), non par index instable de la banque. L'interface affiche un bouton de saut pour chaque question, sur la fiche élève et sa structure. Le saut réorganise les éléments déjà générés, sans choisir un nouveau texte ni renuméroter à partir de 1. À la suite, rappeler le titre ou l'identifiant du document auquel les questions se rapportent. Un document long peut se poursuivre ; aucune question ou option n'est tronquée pour tenir sur une seule feuille.

Les règles existantes `tcfPageBreakAfter`, `sourceBlockIndex` et `itemOffset` continuent de servir aux fiches historiques. Le nouvel adaptateur fournit une correspondance explicite vers la structure des feuilles sans modifier leur sens pour TCF/CO. `splitGrammarReadingPages` reste fonctionnel pour les lectures existantes ; un changement partagé doit être couvert par leurs références de sortie.

**TECH-19.** Élève et corrigé partagent exactement les IDs, numéros, options et pages logiques. Leur mise en page peut différer pour laisser la place aux corrections, mais aucune réponse ne doit se rattacher à une autre question. Les espaces de rédaction PE doivent respecter le style de production écrite demandé et la longueur attendue. Les illustrations et textes familiaux spéciaux restent rattachés à leurs activités plutôt qu'à un détecteur heuristique de longueur de phrase.

### T6 — Moteur de séance collective

**TECH-20.** La séance démarre depuis un exercice canonique déjà généré et figé. Le moteur de séance n'appelle pas la banque et ne régénère jamais. Un élève manipule au tableau ; les autres utilisent leurs cartes physiques. Le système n'invente ni lecture automatique des cartes, ni compte de votes, ni comptes élèves.

État minimal :

```ts
type GrammarSessionState = {
  schemaVersion: 1;
  exercise: GrammarFrozenExercise;
  currentQuestionId: string;
  questions: Record<string, {
    revealed: boolean;
    draftResponse?: SerializableResponse;
    teacherObservation?: 'à revoir' | 'réussi' | 'non observé';
  }>;
  status: 'active' | 'finished';
};
```

Transitions : `START`, `SET_DRAFT`, `REVEAL`, `HIDE_CORRECTION`, `NEXT`, `PREVIOUS`, `GO_TO_QUESTION`, `RESET_DRAFT`, `FINISH`, `RESUME`. `REVEAL` est une action distincte de la saisie d'une réponse ; la réponse élève ne révèle pas immédiatement le corrigé. `NEXT` n'efface pas les réponses des questions précédentes. Revenir à une question conserve son brouillon et son état de révélation ; « masquer le corrigé » permet une nouvelle discussion. Réinitialiser un brouillon ne change pas les options, le document ou l'ordre des tokens affiché.

**TECH-21.** Le moteur prend en charge choix, complétion, association et ordre, avec clic et clavier équivalents au glisser-déposer tactile. Les transformations/corrections permettent une réponse écrite ou une reconstruction lorsqu'elle est prévue dans la présentation approuvée. Les productions ouvertes affichent déclencheur, consigne et grille enseignant ; l'observation de l'enseignant est facultative et ne devient pas un score calculé.

Les six lettres/couleurs de carte ont une association fixe pour toute la séance et tous les thèmes. Les options absentes sont désactivées. La lettre et le texte restent toujours visibles afin de fonctionner en noir et blanc et sans discrimination des couleurs. Le support d'un texte peut rester consultable pendant qu'une question est affichée. Le changement de question ne fait pas disparaître la référence au support.

**TECH-22.** Conserver la séance au minimum tant que l'exercice reste ouvert dans l'application. Une reprise après navigation interne ne tire pas de nouvelles questions. Si une sauvegarde de séance est implémentée, elle contient uniquement la sélection figée, progression et brouillons utiles ; aucune donnée personnelle d'élève n'est requise. Ne pas promettre une reprise inter-appareils ou une synchronisation de classe dans cette version.

### T7 — Erreurs, validation et disponibilité des médias

**TECH-23.** Les erreurs bloquantes portent un code stable exploitable par les tests et un message français utile. Minimum :

| Code | Condition | Comportement attendu |
|---|---|---|
| `GRAMMAR_CONFIG_INVALID` | Champs gradués partiels, niveau ou présentation incohérents | Bloquer le tirage ; conserver la configuration pour correction |
| `GRAMMAR_ACTIVITY_UNAVAILABLE` | Activité/niveau non publié | Expliquer l'offre disponible ; ne pas substituer un niveau |
| `GRAMMAR_CAPACITY_EXCEEDED` | Nombre demandé supérieur au pool éligible | Afficher le maximum réel ; proposer la modification explicite du nombre |
| `GRAMMAR_BANK_REVISION_MISSING` | Révision demandée absente et pas de snapshot valide | Proposer la banque actuelle sans l'appliquer automatiquement |
| `GRAMMAR_SNAPSHOT_INVALID` | Snapshot incomplet, incohérent ou non supporté | Préserver le fichier chargé ; diagnostic et régénération explicite |
| `GRAMMAR_MEDIA_MISSING` | Image indispensable absente | Rendre le diagnostic enseignant ; activité non publiable tant que non résolue |
| `GRAMMAR_MEDIA_REVISION_MISMATCH` | Contenu différent de l'empreinte d'image enregistrée | Préserver la fiche et signaler la révision indisponible ; ne pas substituer l'image sans action explicite |
| `GRAMMAR_BANK_INVALID` | Distracteurs, références, réponse ou identifiants invalides | Échec de validation du build de banque ; aucune publication |

Un média décoratif absent peut afficher un emplacement et son alternative ; un média nécessaire à la réponse ne peut pas être remplacé par un symbole qui rend la question insoluble. Les sources de médias sont des références locales autorisées et traçables. La nouvelle banque graduée hors CO ne contient pas de piste audio. Aucun traitement des fichiers audio ou transcriptions ne fait partie de la migration.

### T8 — Migration reproductible et protection de l'existant

**TECH-24.** Les scripts de migration produisent un manifeste indiquant fichiers sources, commit de reprise, IDs hérités, nouvelles identités et transformations effectuées. Réexécuter la migration à données identiques ne change ni les IDs ni l'ordre de l'ancienne banque. Les corrections graduées sont enregistrées dans les sources éditoriales ou dans un complément durable reconnu par le générateur ; elles ne se limitent jamais à un fichier TS généré.

L'ancienne branche conserve ses références. Une correction de contenu gradué ne modifie pas automatiquement une ancienne recette. Si le propriétaire demande de mettre à jour une fiche historique, la transformation est explicite et la fiche figée d'origine reste récupérable. La compatibilité est mesurée contre les références G0 réellement capturées ; ne pas prétendre reconstituer tous les contenus d'anciennes versions non archivées.

**TECH-25.** L'anomalie existante `aller-destination → gram-a5-theorie` absent doit être traitée séparément au début de G0/G1. Vérifier la fusion éventuelle dans a4 et les usages de `gram-a5-theorie` dans les anciennes recettes. Une suppression du lien ou un changement de compteur n'est pas une migration suffisante si une ancienne recette ne peut plus être restituée. Le correctif futur doit être documenté et couvert par une recette témoin ; ce cahier des charges ne l'applique pas.

**TECH-26.** Les helpers communs aux autres domaines, notamment les catégories/polarités partagées avec Gattegno, sont des dépendances, pas une autorisation de modifier leurs banques ou critères. Chaque changement partagé doit annoncer ses consommateurs et prouver l'absence d'effet sur leurs sorties de référence. Les modules entièrement CO restent inchangés ; les fichiers partagés peuvent recevoir une branche additive, avec snapshots spécifiques de leurs branches CO/historiques.

### T9 — Preuves techniques exigées avant livraison

**TECH-27.** Le dossier de livraison doit inclure les références exécutables et les résultats, pas seulement une liste de tests souhaités :

- Inventaire G0 : commit, source des banques et agrégateurs, 199 types hors CO observés, CO visible et alias, recettes et médias témoins. Les compteurs sont recalculés au lancement si main a changé ; le nombre n'est pas figé comme assertion intemporelle.
- Empreintes de tous les fichiers dédiés CO et des médias référencés ; comparaison avant/après le lot. Pour les fichiers partagés : mêmes sorties structurées aux graines de référence, mêmes paramètres et parcours.
- Recettes sans champs gradués : avant/après identiques pour les questions, ordre, réponses, options et pagination manuelle. Inclure mode libre, blocs supplémentaires, textes CE et anciens alias `ordre-a1` / `ordre-a2`.
- Nouvelles recettes : sérialisation/chargement préservent tous les nouveaux champs et le snapshot ; une évolution de la banque ne change pas la fiche sauvegardée ; une régénération explicite donne une nouvelle sélection traçable.
- Contrats de banques : unicité des IDs, références valides, réponses cohérentes, présentation approuvée, minimum 50 par cellule réellement publiée et documents comptés séparément. Le contrôle automatique ne prétend pas remplacer la revue des phrases.
- Déterminisme : mêmes données/graine/configuration → même exercice canonique ; rendu et pagination sans nouveau tirage ; ordre des options et corrigé alignés pour 2, 3, 4, 5 et 6 choix.
- Capacités : filtres simultanés, pool vide, demande supérieure au plafond, absence de doublons et absence d'élargissement silencieux.
- CE : plusieurs documents, supports longs, saut manuel après chacune des positions possibles d'un exemple, continuation, retour arrière et corrigé aligné. La question et son document restent reliés après fractionnement en feuilles.
- Tableau : toutes les transitions de T6 ; aucune révélation spontanée ; brouillon conservé au retour ; ordre/association accessibles au clavier ; vote physique jamais traité comme une donnée captée automatiquement.
- Rendus : A4 élève/corrigé, textes et indices colorés, impression N&B, images et longs mots ; écran 1366×768 et 1920×1080, tactile et clic. Aucun contenu tronqué ni résultat dépendant uniquement d'une couleur.

Chaque preuve mentionne le commit, la recette ou fixture, la commande ou procédure, le résultat et les limites. Les erreurs déjà présentes avant la refonte sont consignées séparément ; elles ne sont ni attribuées au nouveau code ni masquées par une modification d'assertion.

## 10. Réalisation, recette et livraison

### 10.1 Contrat des annexes et couverture

**LIV-01.** Le registre joint est la cible opérationnelle : une activité possède un ID stable, les anciens types/aliases reliés, les niveaux prévus, les présentations attendues, les objectifs et les quotas. Il ne contient aucune approbation inventée. Les champs de validation restent inconnus jusqu'à la revue et ne sont pas remplis à partir d'un compteur brut.

Les 499 cellules du plan initial deviennent **513 obligations de planification** après ajout des trois objectifs A2 de comparaison : 502 obligations de familles de réponse et 11 obligations de support image. Les 11 obligations I sont intégrées aux banques hôtes ; elles ne créent ni bouton de type Image ni quota supplémentaire de questions. Le registre détaillé décompose aussi les activités réelles : ses compteurs finaux figurent dans le bilan de couverture en annexe, plutôt que d'assimiler 513 familles à 513 entrées de menu.

**LIV-02.** Pour les types actuels, conserver tous les IDs et aliases. Un type se voit affecter les niveaux de sa notion où ses familles sont prévues. Pour une activité déjà couverte à un niveau mais pas à un autre, ne pas lui étendre automatiquement tous les formats : par exemple C/T pour m5 restent A2. Pour une activité entièrement absente des familles initiales, appliquer DEC-U06. La revue pédagogique peut corriger une affectation manifestement inadéquate avec une note explicite et une mise à jour versionnée du registre ; elle ne supprime pas silencieusement le type historique.

**LIV-03.** Lorsque plusieurs types distincts satisfont une famille, chacun garde son propre contrat de 50 unités : les activités lire/répondre, lire/écrire, répondre affirmativement, répondre négativement ou remplir un formulaire ne sont pas fusionnées par une simple lettre de format. Lorsque seule la réponse QCM/Lacune change au sein d'une même activité, conserver une entrée et deux variantes. Les nouvelles activités génériques ne sont ajoutées que pour les familles manquantes : ne pas créer en plus un doublon « Transformer » si les transformations spécifiques couvrent déjà l'objectif.

### 10.2 Lots exécutables

| Lot | Travaux | Sortie obligatoire |
|---|---|---|
| G0 — Référence et audit | Actualiser le commit ; capturer sources, recettes, CO, médias et rendus ; confirmer les correspondances et les capacités ; isoler l'anomalie Aller | Manifestes, fixtures exécutables, mesures et erreurs de départ documentées ; aucun contenu réécrit pendant le gel |
| G1a — Données et compatibilité | Schéma canonique, unités/variantes et révisions ; route CO/historique/graduée ; sérialisation v1 ; correction/alias Aller validé | Anciennes recettes et sorties protégées identiques ; nouvelle configuration validée et sauvegardable |
| G1b — Générateur et A4 | Registre, niveaux par bloc, toggle, quantités CE/non CE, capacités, rendu grammatical propre, corrigé et pagination | Même sélection sur fiche/corrigé ; 2–6 options sans troncature ; CE multi-documents et sauts par question |
| G1bis — Tableau | Séance figée, navigation, brouillons, révélation enseignant, clic/clavier/tactile, cartes A–F, production ouverte | Tous les états et mécaniques techniques validés, sans fausse capture de votes ni score de réponse libre |
| G2 — Pilote vertical | Être, -er particuliers, imparfait/PC, COD, subjonctif ; banques et variantes du registre, exemples et revue des unités | Toutes les activités de ces notions retenues dans le pilote sont utilisables A4/tableau ; charge réelle mesurée |
| G3 — A1 | Livraison par thèmes, réemploi puis compléments, validation de toutes les unités et des supports | Statuts et capacités A1 publiés exacts ; banques insuffisantes clairement non publiées |
| G4 — A2 | Réemploi contextualisé ; comparaison/superlatif A2 ; CE/PE/PO et tâches guidées | Différence pédagogique réelle par rapport à A1 ; preuves et variantes ouvertes validées |
| G5 — B1 | Chronologie, pronoms complexes, argumentation et modes ; justifications et productions | Tâches avancées guidées, corrections et grilles cohérentes avec le niveau annoncé |
| G6 — Révisions | Composer des parcours à partir des banques déjà prêtes ; objectifs et activités de parcours distincts | Quotas supplémentaires suivis dans un registre séparé ; aucune inflation des niveaux de toutes les notions simples |
| G7 — Livraison vérifiée | Régressions, A4/corrigé/tableau, médias, sauvegardes, guide enseignant et bilan de couverture | Preuves fournies pour les activités publiées, limites déclarées et versions documentées |

Les banques peuvent être rédigées parallèlement après validation d'un échantillon et du schéma du pilote. La publication suit l'état réel de chaque activité. Une première activité complète doit servir à tester le parcours entier avant la rédaction massive de toutes les banques.

Le pilote conserve cinq notions, mais son volume final dépend de la décomposition et de DEC-U06 ; utiliser le compteur du registre, pas l'ancien chiffrage de 26 familles. Ajouter des essais techniques de situation/dialogue et de support image si ces contrats ne sont pas couverts par les banques pilotes, sans prétendre que leurs banques de 50 sont terminées.

### 10.3 Source éditoriale, revue et publication

**LIV-04.** Pour chaque activité/niveau/présentation : examiner la source existante → choisir un échantillon représentatif → rédiger l'objectif et les critères → approuver l'échantillon → réemployer/corriger/compléter → relire toutes les unités → valider les deux supports → publier. L'approbation de trois exemples ne vaut pas approbation des cinquante.

**LIV-05.** Les contrôles automatiques couvrent le schéma, les références, doublons exacts, quotas, réponses/options, déterminisme, sérialisation et états. La revue humaine couvre sens, français naturel, ambiguïtés, niveau, pertinence pour adolescents et variété réelle. Les deux preuves sont requises. Une banque ne devient pas approuvée parce qu'un script la produit sans erreur.

**LIV-06.** L'édition des banques s'effectue par les sources et scripts du dépôt. Un CMS, des comptes élèves, un correcteur par IA, une caméra de votes, de nouveaux audios et une bibliothèque d'images générées ne font pas partie du chantier. Les outils existants d'édition libre de fiches restent disponibles ; ils ne remplacent pas la revue du corpus source.

**LIV-07.** Le circuit de commit/publication suit les instructions du propriétaire applicables au lancement. Ce cahier des charges n'ajoute pas de workflow PR obligatoire ni de demande de permission pour les tâches déjà autorisées. La revue pédagogique des contenus est un critère de qualité du lot, distinct de l'autorisation technique de travailler ou de pousser le dépôt. La remise du présent document reste une livraison documentaire.

### 10.4 Définition de « terminé »

Pour chaque activité publiée :

- ID, aliases, objectif, niveau et présentations définis dans le registre versionné.
- Au moins 50 unités approuvées par niveau/présentation ; pour CE, 20 textes et au moins 50 questions, avec preuve ou grille.
- Instructions spécifiques, informations nécessaires et corrigés complets ; réponses ouvertes validées humainement.
- Capacités réelles après filtres ; aucun doublon ou élargissement silencieux pour remplir un tirage.
- A4, corrigé, continuations et tableau cohérents sur les mêmes unités.
- Images requises présentes, traçables et lisibles ; aucun média indispensable factice.
- Recettes historiques et CO inchangées ; nouvelles sauvegardes reproductibles après évolution des banques.
- Résultats de tests et de revue enregistrés, guide enseignant et limites à jour.

### 10.5 Mesure de charge

Le nombre de variantes à produire ne vaut pas nombre de phrases inédites. Mesurer pendant le pilote le réemploi, les créations, les distracteurs, les corrections, la revue humaine, les documents et les rendus. Estimer ensuite les lots avec les unités manquantes **approuvées**, pas avec le seul nombre de lignes générées. Aucun calendrier en jours n'est garanti avant cette mesure. Les révisions G6 s'ajoutent au périmètre du registre initial.

### 10.6 Exigences complémentaires vérifiables

**LIV-08.** Une sélection de 20 documents comportant cinq questions chacun peut produire 100 questions et plusieurs feuilles. Elle ne doit pas être tronquée à 50 au titre du compteur non CE. Le nombre de textes reste le paramètre de sélection ; la pagination est une conséquence de ce contenu.

**LIV-09.** Les cartes gardent une association lettre/couleur unique pour tous les thèmes. Définir les six couleurs par variables du thème et produire une légende imprimable identique à la projection. Lettre et contenu restent lisibles en noir et blanc ; aucune couleur n'encode seule la correction ou le genre.

**LIV-10.** Les IDs et schémas techniques servent aux sources, recettes et diagnostics. Le parcours enseignant expose l'objectif, les modes disponibles et les limites utiles ; il n'affiche pas les IDs de migration, types TCF internes ou phases G0–G7 comme des choix d'exercice.


## 11. Scénarios de recette et traçabilité


P0 bloque la publication ; P1 bloque la déclaration « prête A4 et tableau ». Consigner cas, révision, recette/graine, résultat et preuve. Langue/variété : revue humaine. Lecture : **Étant donné → Quand → Alors**.

| ID | Priorité | Étant donné | Quand | Alors |
|---|---|---|---|---|
| REC-P01 | P0 | 49 unités approuvées | Publication | Quota 50 incomplet. |
| REC-P02 | P0 | 10 unités, 50 tirages | Comptage | Capacité = 10 unités. |
| REC-P03 | P0 | 50 L correctes, 12 Q ambigus | Validation Q | Ces Q ne comptent pas ; L reste validable. |
| REC-P04 | P0 | Q à trois options | Projection | A/B/C actives, aucun D/E/F artificiel. |
| REC-P05 | P0 | Deux options correctes | Revue Q | Item corrigé ou rejeté avant publication. |
| REC-P06 | P0 | Mauvais accord, typographie acceptable | Correction L | La normalisation ne valide pas l'erreur grammaticale. |
| REC-P07 | P0 | Plusieurs ordres acceptables | Réponse O | Variantes validées acceptées ou validation guidée. |
| REC-P08 | P0 | Phrase correcte | Revue C | Rejet comme erreur à corriger. |
| REC-P09 | P0 | 20 textes ne variant que les noms | Revue CE | Variété insuffisante, banque non approuvée. |
| REC-P10 | P0 | 20 textes, 40 questions | Livraison CE | Quota incomplet ; 50 questions validées requises. |
| REC-P11 | P0 | Question factuelle CE | Revue du corrigé | Preuve localisable dans le document. |
| REC-P12 | P0 | Question inventée, correcte et pertinente | Validation CE | Acceptée selon grille, même différente du modèle. |
| REC-P13 | P0 | Réponse E/P/S ouverte | Révélation | Grille/modèles possibles, aucune note automatique. |
| REC-P14 | P0 | Image nécessaire absente | Publication | Activité non déclarée prête. |
| REC-P15 | P0 | Trois tâches distinctes de c1 | Vérification quotas | Trois compteurs, pas 50 unités globales. |
| REC-P16 | P0 | Support familial | Revue | Aucun lien de parenté/génération contradictoire. |
| REC-P17 | P1 | Activité est-ce que/inversion | Rendu | Terme valorisé en consigne, trait sous chaque phrase. |
| REC-P18 | P1 | Saut de page CE avant question | Rendu A4/corrigé | Numéro, support accessible et correction alignés. |
| REC-P19 | P1 | Séance, réponse, retour en arrière | Navigation | Pas de nouveau tirage ni de révélation prématurée. |
| REC-P20 | P1 | Tactile indisponible | Ordre/association | Clavier/clic permettent la même tâche. |
| REC-P21 | P0 | Niveau prévu non validé | Consultation du menu | Pas présenté comme publié. |
| REC-P22 | P0 | Recette sans niveau/ancien alias | Chargement | Pas d'A1 injecté ni d'activité changée en silence. |

### Recette fonctionnelle et technique complémentaire

| ID | Priorité | Étant donné | Quand | Alors |
|---|---|---|---|---|
| REC-T01 | P0 | Recettes historiques sans aucun champ gradué, y compris mode libre, extraBlocks, CE et aliases | Charger et générer avant/après la refonte avec les graines de référence | Même sélection, ordre, options, réponses et pagination ; aucun niveau injecté |
| REC-T02 | P0 | Types co-theme, co-audio, fam-co et nat-co, avec leurs paramètres et aliases | Passer par les nouvelles fonctions de résolution et changer les paramètres nonCO | Branche CO historique inchangée ; mêmes sorties et paramètres A1/A2/audio ; empreintes dédiées identiques |
| REC-T03 | P0 | Exercice écrit de provenance ou nationalité dont le conteneur historique indique competence CO avec audio vide | Déterminer son périmètre | Il reste dans la grammaire écrite selon son ID ; aucun filtrage sur competence/audioSrc |
| REC-T04 | P0 | Une activité avec 50 variantes L approuvées et une variante Q en préparation | Composer l'offre publiée | L est disponible ; Q reste désactivée ; pas de nouveau type de menu ni de banque Q factice |
| REC-T05 | P0 | QCM grammaticaux à 2, 3, 4, 5 et 6 options et un TCF historique à 4 options | Mélanger, afficher, imprimer et révéler | Toutes les options grammaticales sont conservées et corrigées par ID ; les limites TCF restent inchangées |
| REC-T06 | P0 | Nouvelle recette avec niveau, activité, présentation, révision et snapshot de plusieurs documents | Sauvegarder, exporter, importer et recharger | Tous les champs et la sélection figée restent identiques ; aucune archive distante requise |
| REC-T07 | P0 | Une nouvelle version de banque après sauvegarde d'une fiche | Réouvrir la fiche puis utiliser explicitement Régénérer avec la banque actuelle | Avant l'action la fiche est inchangée ; après l'action une nouvelle sélection versionnée peut remplacer l'ancienne, sans perte silencieuse d'édition |
| REC-T08 | P0 | Même configuration, banque et graine ; changement de vue ou de pagination | Générer puis naviguer dans A4/corrigé/tableau | Mêmes IDs, supports, questions, ordres et corrections ; aucun nouveau tirage de rendu |
| REC-T09 | P0 | Filtres qui réduisent une banque de 50 à 12 unités et recette demandant 20 | Évaluer la capacité puis générer | Maximum12 annoncé et erreur explicite ; aucune répétition, suppression de filtre ou substitution de niveau |
| REC-T10 | P0 | 20 textes approuvés comportant chacun cinq questions | Choisir20textes puis générer | 20textes et100questions, avec pagination ; aucune troncature à50 ni nouveau tirage par page |
| REC-T11 | P0 | Une CE multi-documents et un saut placé après chaque position d'un exemple | Afficher fiche et corrigé, retirer puis remettre le saut | Même question liée au même support, numérotation continue et corrigé correct ; continuations lisibles sans débordement |
| REC-T12 | P0 | Séance active avec brouillons et plusieurs états de révélation | Répondre, révéler, masquer, avancer, revenir, réinitialiser un brouillon et reprendre | Aucune révélation automatique ; options inchangées ; brouillons et révélations conservés selon les transitions |
| REC-T13 | P1 | Association et ordre avec plusieurs occurrences du même mot | Répondre au doigt, au clic et au clavier | Même tâche accessible ; occurrences identifiées séparément ; correction par IDs et variantes approuvées |
| REC-T14 | P0 | L'anomalie Aller du commit de référence et une recette gram-a5-theorie | Appliquer le correctif documenté de fusion/alias après audit | Catalogue cohérent, ancienne recette restituable, contenu validé conservé ; aucun simple changement de compteur |
| REC-T15 | P0 | Mêmes sources éditoriales, table de migration et versions d'outils | Compiler les banques deux fois puis corriger une unité sans la déplacer sémantiquement | Sorties identiques avant correction ; ID stable et révision traçable après correction ; ordre historique inchangé |
| REC-T16 | P1 | Pronoms, nationalités et catégories de verbes avec indices explicites | Afficher et imprimer en couleur puis en noir et blanc | Traits inline, prénom/genre et infinitif au bon endroit ; indices lisibles sans dépendre seulement de couleur |
| REC-T17 | P1 | Activités famille et leurs anciens aliases | Consulter le menu, afficher le faire-part Lucas et la PE | Déterminants regroupés ; Photo de famille et Message et email conservés ; image et trois phrases à droite ; PE en bas et style ligné |
| REC-T18 | P0 | Configuration graduée partielle, activité non publiée ou snapshot invalide | Valider/importer la recette | Code d'erreur précis et message français ; fichier conservé ; aucun retour silencieux au niveau A1/legacy |
| REC-T19 | P0 | Obligation image avec activité hôte et50situations, puis média requis absent | Calculer la couverture et tenter la publication | Aucun type Image ni doublequota ; l'absence du média bloque la disponibilité de la tâche qui en dépend |
| REC-T20 | P1 | Fiche A4 longue et séance avec options, consignes et mots longs | Imprimer et utiliser en1366x768,1920x1080,tactile et N&B | Format210x297mm, continuités correctes, lisibilité et zéro contenu masqué ; lettre/texte identifient toujours la carte |
| REC-T21 | P0 | Les objectifs A1 et A2 de comparaison et les notions avancées B1 | Relire les banques et la disponibilité | Objectifs A2 distincts et contextualisés ; reste des niveaux conservé ; avancés guidés et exemples revus ; aucun quota approuvé déduit du libellé |
| REC-T22 | P0 | Les199types nonCO, leurs aliases et le registre cible | Vérifier les correspondances et le périmètre retenu | Aucun ID orphelin ou supprimé ; activité distincte non absorbée par un compteur de format ; extension ou maintienhistorique selon DEC-U06 |
| REC-T23 | P0 | Édition manuelle et paramètres préparés différents de la sélection appliquée | Changer de niveau/présentation puis sauvegarder sans régénérer | Choix explicite générer ou annuler ; aucune recette annonçant un niveau différent de son snapshot ; aucune perte d'édition |
| REC-T24 | P0 | Livraison d'un thème avec sources, revue, tests et médias | Déclarer le lot terminé | Preuves datées et versionnées, guide et limites ; aucune image/audio généré ni CMS/compteélève imposé ; publication selon instructions du propriétaire |
| REC-T25 | P0 | Snapshot gradué avec image référencée et empreinte de contenu | Une nouvelle révision d'image est publiée ou l'ancien chemin est remplacé | La révision immuable enregistrée reste disponible ; sinon diagnostic d'image absente/divergente, sans substitution silencieuse ; originaux CO inchangés |
| REC-T26 | P1 | Phrase erronée en segments NFC avec accents et mise en évidence | Pointer puis rendre l'erreur après conversion du balisage historique | Le segment et l'intervalle UTF16 demi-ouvert visent le mot prévu ; aucun décalage dû aux marques de couleur ou au rendu |

Les résultats sont à renseigner lors du développement. Ces scénarios sont des critères de recette, pas des tests applicatifs déjà exécutés pendant la rédaction du cahier des charges. `TRACABILITE_EXIGENCES.csv` relie les exigences aux vérifications.

## Annexe A — Les 19 thèmes et 98 notions, niveaux et objectifs

La table suivante couvre 123 couples notion/niveau. Q/L sont des présentations d’une même activité lorsqu’elles partagent le même objectif ; I est une obligation de support intégrée. Les familles indiquent un minimum de couverture, décomposé dans le registre des activités.

### Entrer en contact — `gram-entrer-contact`

| Notion / ID pédagogique | Sous-thème code | Niveau | Familles | Objectif |
|---|---|---|---|---|
| Tu et vous (`b1`) | `b1` | A1 | Q, A, S, P | Choisir le bon registre selon la personne, saluer poliment |
| Les salutations (`b2`) | `b2` | A1 | A, O, S, P | Saluer en début/fin de rencontre, compléter un échange |
| Les remerciements (`b3`) | `b3` | A1 | Q, A, S, P | Remercier et répondre selon la situation |

### Se présenter — `gram-se-presenter`

| Notion / ID pédagogique | Sous-thème code | Niveau | Familles | Objectif |
|---|---|---|---|---|
| Qui suis-je ? (`a1`) | `a1` | A1 | L, O, E, P, S | Utiliser s'appeler, avoir, être, habiter, parler ; se présenter en 3–5 phrases |
| Pronoms sujet (`a2`) | `a2` | A1 | Q, L, A, T | Associer personnes et pronoms, accorder le sujet et le verbe |
| Adjectifs de nationalité (`a3`) | `a3` | A1 | Q, L, T, P | Choisir et accorder masculin/féminin, singulier/pluriel |
| Dire sa provenance (`a6`) | `a6` | A1 | Q, L, A, P | Employer venir de / du / des / d' et un pays |
| Parler de sa famille (`famille`) | `famille` | A1 | A, L, D, E, P | Présenter liens de parenté et possessifs, décrire sa famille sans imposer d'informations personnelles |

### Conjuguer au présent — `gram-present`

| Notion / ID pédagogique | Sous-thème code | Niveau | Familles | Objectif |
|---|---|---|---|---|
| Être (`m2`) | `etre` | A1 | Q, L, A, O | Conjuguer les 6 personnes et compléter une phrase simple |
| Avoir (`m3`) | `avoir` | A1 | Q, L, A, O | Âge, possession, besoin, expressions usuelles au présent |
| Aller (`a4`) | `aller-destination` | A1 | Q, L, T, P | Conjuguer aller, exprimer une destination avec à/au/aux |
| Verbes en -er (`m4`) | `er` | A1 | Q, L, O, T | Accorder les terminaisons régulières avec le sujet |
| Verbes en -er particuliers (`m5`) | `er-particuliers` | A1 | Q, L | Reconnaître les alternances usuelles |
| Verbes en -er particuliers (`m5`) | `er-particuliers` | A2 | Q, L, C, T | Justifier et corriger les changements de radical et graphies selon les verbes |
| Verbes en -ir (`m6`) | `ir` | A1 | Q, L | Distinguer finir et quelques formes fréquentes |
| Verbes en -ir (`m6`) | `ir` | A2 | Q, L, T, C | Conjuguer et comparer plusieurs modèles en -ir dans une situation |
| Verbes en -re et -oir (`m7`) | `re-oir` | A1 | Q, L | Conjuguer les verbes fréquents dans des phrases courtes |
| Verbes en -re et -oir (`m7`) | `re-oir` | A2 | Q, L, T, C | Réutiliser les modèles irréguliers selon le contexte |
| Verbes modaux (`modaux`) | `modaux` | A1 | Q, L, S, P | Conjuguer au présent et exprimer possibilité, obligation, souhait |
| Verbes pronominaux (`pronominaux`) | `pronominaux` | A1 | L, O, T, P | Conjuguer se lever, se laver, s'appeler avec le bon pronom |
| Négation ne…pas (`a8`) | `a8` | A1 | L, T, C, O | Passer d'une phrase affirmative à une négative simple |
| Autres négations (`a9`) | `a9` | A1 | Q, L | Repérer jamais, plus, rien, personne dans des cas simples |
| Autres négations (`a9`) | `a9` | A2 | Q, L, T, C | Différencier les négations par le sens, corriger leur placement |

### Poser une question — `gram-questions`

| Notion / ID pédagogique | Sous-thème code | Niveau | Familles | Objectif |
|---|---|---|---|---|
| Questions fermées (`c1`) | `c1` | A1 | Q, O, T, D, P | Reconnaître intonation, est-ce que, inversion ; transformer simplement |
| Questions ouvertes (`c2`) | `c2` | A1 | Q, L, T, D, P | Choisir comment/qui/où/quand/pourquoi ; répondre brièvement |
| Questions avec quel (`c3`) | `c3` | A1 | Q, L, T, D, P | Accorder quel/quelle/quels/quelles, poser une question |

### Phrase exclamative — `gram-exclamation`

| Notion / ID pédagogique | Sous-thème code | Niveau | Familles | Objectif |
|---|---|---|---|---|
| La phrase exclamative (`c4`) | `c4` | A1 | Q, O, P | Reconnaître exclamation et ponctuation, compléter une formule |
| La phrase exclamative (`c4`) | `c4` | A2 | Q, T, C, P | Reformuler une phrase neutre pour exprimer surprise ou émotion |

### Parler d'une activité — `gram-activite`

| Notion / ID pédagogique | Sous-thème code | Niveau | Familles | Objectif |
|---|---|---|---|---|
| Faire une activité (`d1`) | `d1` | A1 | Q, L, I, E, P | Employer faire du/de la/de l' + activité, parler de loisirs |
| Verbes pronominaux (`d2`) | `d2` | A1 | Q, O, L, P | Associer pronom réfléchi et action quotidienne, remettre dans l'ordre |
| Pronoms toniques (`d3`) | `d3` | A1 | Q, L | Employer moi, toi, lui, elle, nous, vous, eux, elles |
| Pronoms toniques (`d3`) | `d3` | A2 | Q, L, T, S | Combiner pronom tonique, comparaison et préposition en contexte |

### Se situer dans l'espace — `gram-espace`

| Notion / ID pédagogique | Sous-thème code | Niveau | Familles | Objectif |
|---|---|---|---|---|
| Prépositions de lieu (`e1`) | `e1` | A1 | I, Q, A, L, P | Décrire dessus/dessous/devant/derrière/entre avec image |
| Autres prépositions et adverbes de lieu (`e6`) | `e6` | A1 | I, L, P | Se repérer par près de/loin de/à côté de |
| Autres prépositions et adverbes de lieu (`e6`) | `e6` | A2 | I, L, T, S, P | Donner des indications plus précises dans un trajet ou une description |
| Articles contractés (lieu) (`e7`) | `e7` | A1 | Q, L, A, C | Aller au/aux, venir du/des : choisir la bonne contraction |

### Se situer dans le temps — `gram-temps`

| Notion / ID pédagogique | Sous-thème code | Niveau | Familles | Objectif |
|---|---|---|---|---|
| Le moment (`e2`) | `e2` | A1 | I, Q, L, P | Heure, jour, date, mois, saisons et expressions temporelles |
| La durée (`e3`) | `e3` | A1 | Q, L | Employer depuis/pendant/pour/il y a dans des cas simples |
| La durée (`e3`) | `e3` | A2 | Q, L, T, C, S | Interpréter et choisir la préposition avec chronologie et temps verbaux |
| La fréquence (`e4`) | `e4` | A1 | A, O, L, P | Toujours, souvent, parfois, rarement, jamais ; décrire une habitude |
| La succession (`e5`) | `e5` | A1 | O, P | D'abord, puis, ensuite, enfin dans une courte séquence |
| La succession (`e5`) | `e5` | A2 | O, T, D, E, P | Organiser un récit ou une procédure avec des liens chronologiques |

### Demander et proposer — `gram-demander`

| Notion / ID pédagogique | Sous-thème code | Niveau | Familles | Objectif |
|---|---|---|---|---|
| Déterminants démonstratifs (`f1`) | `f1` | A1 | Q, L, A, C | Choisir ce/cet/cette/ces à partir du nom |
| Pouvoir, devoir, vouloir (`f2`) | `f2` | A1 | Q, L, S, P | Construire demande et obligation courantes |
| Accepter et refuser (`f3`) | `f3` | A1 | A, O, S, P | Répondre à une proposition avec formules adaptées |

### Décrire — `gram-decrire`

| Notion / ID pédagogique | Sous-thème code | Niveau | Familles | Objectif |
|---|---|---|---|---|
| La météo (`f4`) | `f4` | A1 | I, A, L, P | Employer il fait/il y a/il pleut avec des images |
| C'est / il est / il y a (`f5`) | `f5` | A1 | Q, L, T, C | Identifier, présenter, décrire avec la bonne expression |
| Déterminants possessifs (`f6`) | `f6` | A1 | Q, L, A, T | Mon/ma/mes, ton/ta/tes, son/sa/ses selon le nom |
| Adjectifs qualificatifs (`f7`) | `f7` | A1 | Q, L, T, E, P | Accorder genre et nombre pour décrire |
| Les professions (`f8`) | `f8` | A1 | Q, L, S, P | Dire métier ou fonction avec être, et identifier la forme adaptée |
| La comparaison (`f9`) | `f9` | A1 | Q, L, T, E, P | Comparer personnes/objets avec plus/aussi/moins…que |
| La comparaison (`f9`) | `f9` | A2 | Q, L, T, E, P | Comparer plusieurs options en contexte ; choisir les structures plus/aussi/moins…que et justifier une préférence avec des informations données |
| La place de l'adjectif (`f12`) | `f12` | A1 | O, Q | Placer des adjectifs usuels avant/après le nom |
| La place de l'adjectif (`f12`) | `f12` | A2 | O, Q, C, T | Choisir la place selon le sens lorsque l'adjectif varie |
| Le superlatif (`f13`) | `f13` | A1 | Q, L, T, E, P | Construire le plus/le moins dans des situations concrètes |
| Le superlatif (`f13`) | `f13` | A2 | Q, L, T, E, P | Employer le superlatif pour choisir parmi plusieurs possibilités ; préciser le groupe de comparaison et justifier le choix en contexte |
| Comparer un nom ou un verbe (`f14`) | `f14` | A1 | Q, L, T, E | Plus de/moins de/autant de ; comparer deux activités ou quantités |
| Comparer un nom ou un verbe (`f14`) | `f14` | A2 | Q, L, T, E | Comparer des quantités et des activités en contexte avec plus de/moins de/autant de ou plus/moins/autant ; formuler un choix justifié |
| Description physique (`description-physique`) | `description-physique` | A1 | I, A, L, E, P | Associer détails et visuels, décrire sans jugement discriminant |

### Conseiller quelqu'un — `gram-conseiller`

| Notion / ID pédagogique | Sous-thème code | Niveau | Familles | Objectif |
|---|---|---|---|---|
| Devoir/pouvoir au conditionnel (`f10`) | `f10` | A2 | Q, L, S, E, P | Dire tu devrais / vous pourriez dans une situation de conseil poli |
| L'impératif (`f11`) | `f11` | A1 | O, L, P | Reconnaître et construire une consigne très simple |
| L'impératif (`f11`) | `f11` | A2 | O, L, T, C, P | Distinguer impératif affirmatif/négatif, pronoms et politesse |

### Parler des aliments — `gram-aliments`

| Notion / ID pédagogique | Sous-thème code | Niveau | Familles | Objectif |
|---|---|---|---|---|
| Articles indéfinis (`g1`) | `g1` | A1 | Q, L, A, I | Un/une/des dans des phrases simples sur des objets/aliments |
| Articles définis (`g2`) | `g2` | A1 | Q, L, T, C | Le/la/l'/les, connu ou général |
| Articles partitifs (`g3`) | `g3` | A1 | Q, L, I, S | Du/de la/de l' pour quantité non dénombrée |
| Les quantités (`g4`) | `g4` | A1 | A, L, I, S, P | Un kilo de, beaucoup de, un verre de dans des commandes simples |
| Déterminants indéfinis (`g5`) | `g5` | A2 | Q, L, T, C | Quelques, plusieurs, certains, chaque, tout selon le contexte |
| Articles contractés (quantité et lieu) (`g6`) | `g6` | A1 | Q, L | Choisir au/du/des, reconnaître contractions simples |
| Articles contractés (quantité et lieu) (`g6`) | `g6` | A2 | Q, L, T, C | Distinguer contractions et partitifs dans le contexte |

### Parler du passé — `gram-passe`

| Notion / ID pédagogique | Sous-thème code | Niveau | Familles | Objectif |
|---|---|---|---|---|
| Le passé composé (idée) (`h1`) | `pc-idee` | A1 | Q, A, L, O | Identifier une action terminée, formes fréquentes |
| Passé composé avec avoir (`h2`) | `pc-avoir` | A1 | Q, L, T, C | Former auxiliaire + participe passé régulier et fréquent |
| Passé composé avec être (`h3`) | `pc-etre` | A1 | Q, L | Identifier principaux verbes de mouvement et accords simples |
| Passé composé avec être (`h3`) | `pc-etre` | A2 | Q, L, T, C, E | Maîtriser davantage de verbes et accords en contexte |
| L'imparfait (`h4`) | `imparfait` | A2 | Q, L, T, E, P | Décrire habitude, situation ou décor passé |
| Le plus-que-parfait (`h5`) | `pqp` | B1 | Q, L, T, D, E | Situer une action antérieure à un autre passé, récit chronologique |
| Verbes à double auxiliaire (`h6`) | `double-aux` | A2 | Q, L | Distinguer monter/sortir/passer selon la construction |
| Verbes à double auxiliaire (`h6`) | `double-aux` | B1 | Q, L, C, T | Justifier le choix selon sens et transitivité dans un récit |
| Pronominaux au passé composé (`h7`) | `pc-pronominaux` | A2 | L, O, T, C | Former sujet + pronom + être + participe, accords usuels |
| Imparfait ou passé composé (`h8`) | `imparfait-ou-pc` | A2 | Q, L, T, D, E, P | Distinguer fond et événement dans un court récit |
| Accord du participe passé (`h9`) | `accord-pp` | A2 | Q, L | Accords usuels avec être et cas simples bien contextualisés |
| Accord du participe passé (`h9`) | `accord-pp` | B1 | Q, L, C, T, E | Cas avec avoir et COD antéposé, pronominaux selon programme |

### Les pronoms — `gram-pronoms`

| Notion / ID pédagogique | Sous-thème code | Niveau | Familles | Objectif |
|---|---|---|---|---|
| Pronoms relatifs (`i1`) | `i1` | A2 | Q, L, A, T | Relier deux propositions par qui, que, où ; dont seulement si déjà introduit |
| Pronoms possessifs (`i2`) | `i2` | A2 | Q, L, T, C | Remplacer nom connu : le mien/la tienne/les leurs |
| Pronoms démonstratifs (`i3`) | `i3` | A2 | Q, L, T, E | Celui/celle/ceux/celles et ce/cela selon contexte |
| Pronoms COD (`i4`) | `i4` | A2 | Q, L, T, C, D | Remplacer le/la/les/l' sans ambiguïté de référent |
| Pronoms COI (`i5`) | `i5` | A2 | Q, L, T, C | Employer lui/leur, comparer au COD |
| Pronoms indéfinis (`i6`) | `i6` | A2 | Q, L, T, S | Quelqu'un/personne/quelque chose/tout selon le sens |
| En et y (`i7`) | `i7` | A2 | Q, L, T, C | Remplacer lieu et complément en/de avec référent explicite |
| Le relatif dont (`i8`) | `i8` | B1 | Q, L, T, C, E | Relier une phrase comportant de + nom avec dont |
| Relatifs composés (`i9`) | `i9` | B1 | Q, L, T, D, E | Lequel/laquelle/auxquels/duquel après préposition |

### Parler d'une action — `gram-action`

| Notion / ID pédagogique | Sous-thème code | Niveau | Familles | Objectif |
|---|---|---|---|---|
| Présent progressif (`j1`) | `j1` | A1 | I, Q, L, P | Dire une action en cours : être en train de |
| Présent progressif (`j1`) | `j1` | A2 | Q, L, T, P | Mettre une action en contraste avec une habitude |
| Passé récent (`j2`) | `j2` | A1 | Q, L, P | Venir de + infinitif dans une phrase simple |
| Passé récent (`j2`) | `j2` | A2 | Q, L, T, E, P | Situer un événement immédiat par rapport à un autre |
| Gérondif (`j3`) | `j3` | A2 | Q, L, T, C, P | Associer deux actions simultanées avec en + participe présent |

### Parler de l'avenir — `gram-avenir`

| Notion / ID pédagogique | Sous-thème code | Niveau | Familles | Objectif |
|---|---|---|---|---|
| Futur proche (`j4`) | `futur-proche` | A1 | Q, L, T, S, P | Aller au présent + infinitif pour projet immédiat |
| Futur simple (`j5`) | `futur-simple` | A2 | Q, L, T, E, P | Conjuguer et annoncer une action future en contexte |
| Futur proche ou futur simple (`o1`) | `futur-proche-ou-simple` | A2 | Q, L, C, D, P | Choisir en fonction de la situation et du contexte |
| Futur antérieur (`o2`) | `futur-anterieur` | B1 | Q, L, T, D, E | Situer une action accomplie avant une autre action future |
| Hypothèse sur le futur (`o3`) | `hypothese-futur` | A2 | Q, L, T, S, P | Construire si + présent, futur dans une situation plausible |

### Parler des faits divers — `gram-faits`

| Notion / ID pédagogique | Sous-thème code | Niveau | Familles | Objectif |
|---|---|---|---|---|
| Forme passive (`j6`) | `j6` | B1 | Q, L, T, C, D | Passer actif/passif en conservant sens, temps et accord |
| Discours direct et indirect (`j7`) | `j7` | B1 | Q, T, C, D, E, P | Rapporter paroles et demandes avec changements nécessaires |
| Conditionnel (emploi) (`j8`) | `j8` | A2 | Q, L, S, P | Formuler souhait ou conseil dans une situation familière |
| Conditionnel (emploi) (`j8`) | `j8` | B1 | Q, T, S, P | Nuancer prudence et information incertaine |
| Hypothèse avec si (`j9`) | `j9` | A2 | Q, L, T | Exprimer une situation réelle ou probable |
| Hypothèse avec si (`j9`) | `j9` | B1 | Q, T, E, P | Exprimer hypothèse irréelle avec si + imparfait/conditionnel |
| Conditionnel passé (`j10`) | `j10` | B1 | Q, L, T, C, E, P | Exprimer regret, reproche ou hypothèse non réalisée au passé |

### S'expliquer et argumenter — `gram-argumenter`

| Notion / ID pédagogique | Sous-thème code | Niveau | Familles | Objectif |
|---|---|---|---|---|
| Approuver et désapprouver (`k1`) | `k1` | A2 | Q, A, S, E, P | Être d'accord / ne pas être d'accord avec justification courte |
| Les connecteurs (`k2`) | `k2` | A2 | Q, L, O | Et, mais, parce que, donc, ensuite ; phrases simples |
| Les connecteurs (`k2`) | `k2` | B1 | Q, T, D, E, P | Organiser un avis structuré avec connecteurs variés |

### Exprimer quelque chose — `gram-exprimer`

| Notion / ID pédagogique | Sous-thème code | Niveau | Familles | Objectif |
|---|---|---|---|---|
| Exprimer la cause (`k3`) | `k3` | A2 | Q, L, T, E, P | Parce que, car, grâce à, à cause de dans les situations concrètes |
| Exprimer la conséquence (`k4`) | `k4` | A2 | Q, L, T, D, E | Donc, alors, c'est pourquoi, si…que selon la progression |
| Exprimer le but (`k5`) | `k5` | A2 | Q, L, T, S, P | Pour + infinitif, afin de + infinitif |
| Exprimer l'opposition (`k6`) | `k6` | A2 | Q, L, T | Mais, alors que, tandis que dans des exemples clairs |
| Exprimer l'opposition (`k6`) | `k6` | B1 | Q, T, D, E, P | Pourtant, en revanche, malgré une contrainte d'argumentation |
| Exprimer la concession (`k7`) | `k7` | B1 | Q, L, T, C, E, P | Bien que, même si, malgré, pourtant avec choix du mode adapté |
| Pronoms relatifs neutres (`k8`) | `k8` | B1 | Q, L, T, C | Ce qui, ce que, ce dont avec antécédent propositionnel |
| Doubles pronoms (`k9`) | `k9` | B1 | Q, L, O, T, C | Donner un objet à quelqu'un : le lui, la leur, y en, ordre et négation |
| Subjonctif (emplois principaux) (`k10`) | `k10` | B1 | Q, L, T, C, E | Volonté, sentiment, nécessité et doute ; reconnaître et conjuguer |
| Verbes avec préposition (`k11`) | `k11` | A2 | Q, L, A | À ou de + infinitif après verbes usuels |
| Verbes avec préposition (`k11`) | `k11` | B1 | Q, L, T, C | Choisir selon régence et reformuler avec pronoms |
| Subjonctif passé (`k12`) | `k12` | B1 | Q, L, T, D, E | Construire et employer le subjonctif passé après un déclencheur valide |
| Subjonctif ou indicatif ? (`k13`) | `k13` | B1 | Q, L, C, T, D, E | Choisir le mode selon certitude, doute et structures déclencheuses |

## Annexe B — Registre opérationnel et compteurs

| Mesure | Cible du cahier des charges |
|---|---:|
| Thèmes | 19 |
| Notions | 98 |
| Couples notion/niveau | 123 |
| Obligations initiales après décisions | 513 |
| Obligations de familles de réponse | 502 |
| Obligations de support image intégrées | 11 |
| IDs de types existants conservés | 199 |
| Activités graduées cibles | 424 |
| Nouvelles activités génériques pour les familles manquantes | 225 |
| Couples activité/niveau | 476 |
| Cellules activité/niveau/présentation | 601 |
| Variantes utilisables nominales, à raison de 50 par cellule | 30050 |
| Cellules CE (20 textes chacune, réemploi autorisé) | 36 |
| Activités dans les cinq notions pilotes | 23 |
| Cellules du pilote après décomposition | 31 |

Ces cibles ne sont pas des capacités approuvées. Elles résultent du découpage concret du registre, et non du nombre de phrases nouvelles : une source peut être réemployée après validation des variantes. Les activités génériques utilisent les mêmes moteurs ; leur nombre ne signifie pas autant de composants à développer. Les quotas image sont compris dans leurs activités hôtes. Les 20 documents d’une CE peuvent être réutilisés pour plusieurs activités avec questions et critères validés séparément.

### Activités à implémenter ou adapter

Chaque ligne du tableau est une activité, pas une présentation. Tous les IDs existants sont maintenus. Les nouveaux IDs sont réservés dans le registre joint et devront être stables dès leur première publication. Les tableaux CSV/JSON contiennent les contrats, niveaux, sources, consignes par présentation et quotas détaillés.

### Entrer en contact — activités

| Sous-thème | Activité | ID de type / activité | Niveaux et présentations | Origine |
|---|---|---|---|---|
| b1 | Compléter tu / vous | `gram-ex-b1-fill-conj` | A1: gap | Existant |
| b1 | Choisir tu ou vous | `gram-ex-b1-qcm-verbe` | A1: choice, gap | Existant |
| b2 | Choisir la salutation | `gram-ex-b2-qcm-verbe` | A1: choice, gap | Existant |
| b2 | Écrire une salutation | `gram-ex-b2-ecrire` | A1: open-written | Existant |
| b3 | Compléter merci / s’il vous plaît | `gram-ex-b3-fill-conj` | A1: gap | Existant |
| b3 | Remercier et répondre | `gram-ex-b3-qcm-verbe` | A1: choice, gap | Existant |
| b1 | Associer | `gram-ex-b1-curriculum-a` | A1: match | À ajouter |
| b1 | Jouer une situation | `gram-ex-b1-curriculum-s` | A1: scenario-set | À ajouter |
| b1 | S’exprimer à l’oral | `gram-ex-b1-curriculum-p` | A1: open-oral | À ajouter |
| b2 | Associer | `gram-ex-b2-curriculum-a` | A1: match | À ajouter |
| b2 | Mots dans l’ordre | `gram-ex-b2-curriculum-o` | A1: order | À ajouter |
| b2 | Jouer une situation | `gram-ex-b2-curriculum-s` | A1: scenario-set | À ajouter |
| b2 | S’exprimer à l’oral | `gram-ex-b2-curriculum-p` | A1: open-oral | À ajouter |
| b3 | Associer | `gram-ex-b3-curriculum-a` | A1: match | À ajouter |
| b3 | Jouer une situation | `gram-ex-b3-curriculum-s` | A1: scenario-set | À ajouter |
| b3 | S’exprimer à l’oral | `gram-ex-b3-curriculum-p` | A1: open-oral | À ajouter |

### Se présenter — activités

| Sous-thème | Activité | ID de type / activité | Niveaux et présentations | Origine |
|---|---|---|---|---|
| famille | Déterminants possessifs | `gram-ex-famille-fam-det` | A1: choice, gap | Existant |
| famille | Faire-part de naissance | `gram-ex-famille-fam-faire-part` | A1: document-set | Existant |
| famille | Photo de famille | `gram-ex-famille-fam-photo` | A1: document-set | Existant |
| famille | Message et email | `gram-ex-famille-fam-email` | A1: document-set | Existant |
| famille | Écrire sur sa famille | `gram-ex-famille-fam-pe` | A1: open-written | Existant |
| a1 | Infos personnelles | `gram-ex-a1-infos-perso` | A1: gap | Existant |
| a1 | Compléter avec le verbe | `gram-ex-a1-verbe-pastilles` | A1: gap, choice | Existant |
| a1 | Remettre dans l’ordre | `gram-ex-a1-ordre` | A1: order | Existant |
| a1 | Répondre avec une phrase | `gram-ex-a1-repondre-phrase` | A1: open-written | Existant |
| a1 | Écrire la question | `gram-ex-a1-ecrire-question` | A1: transform | Existant |
| a1 | Remplir un formulaire | `gram-ex-a1-formulaire` | A1: open-written | Existant |
| a1 | Lire et répondre | `gram-ex-a1-ce-texte` | A1: document-set | Existant |
| a1 | Présenter une personne | `gram-ex-a1-portrait` | A1: open-written | Existant |
| a1 | Se présenter à l’oral | `gram-ex-a1-po-images` | A1: open-oral | Existant |
| a2 | Complétez le pronom | `gram-ex-a2-qcm-verbe` | A1: choice, gap | Existant |
| a3 | Je suis… (avec image) | `gram-ex-a3-nat-image` | A1: choice, gap | Existant |
| a3 | Mettre au féminin | `gram-ex-a3-nat-feminin` | A1: transform | Existant |
| a3 | Mettre au masculin | `gram-ex-a3-nat-masculin` | A1: transform | Existant |
| a3 | Mettre au pluriel | `gram-ex-a3-nat-pluriel` | A1: transform | Existant |
| a3 | Accorder l’adjectif | `gram-ex-a3-nat-accorder` | A1: choice, gap | Existant |
| a6 | Je viens de… (avec image) | `gram-ex-a6-prov-pays` | A1: choice, gap | Existant |
| a6 | Choisir la préposition | `gram-ex-a6-prov-prep` | A1: choice, gap | Existant |
| a6 | Conjuguer venir | `gram-ex-a6-prov-verbe` | A1: choice, gap | Existant |
| a6 | Écrire deux phrases | `gram-ex-a6-prov-phrases` | A1: open-written | Existant |
| a1 | Jouer une situation | `gram-ex-a1-curriculum-s` | A1: scenario-set | À ajouter |
| a2 | Associer | `gram-ex-a2-curriculum-a` | A1: match | À ajouter |
| a2 | Transformer une phrase | `gram-ex-a2-curriculum-t` | A1: transform | À ajouter |
| a3 | S’exprimer à l’oral | `gram-ex-a3-curriculum-p` | A1: open-oral | À ajouter |
| a6 | Associer | `gram-ex-a6-curriculum-a` | A1: match | À ajouter |
| a6 | S’exprimer à l’oral | `gram-ex-a6-curriculum-p` | A1: open-oral | À ajouter |
| famille | Associer | `gram-ex-famille-curriculum-a` | A1: match | À ajouter |
| famille | S’exprimer à l’oral | `gram-ex-famille-curriculum-p` | A1: open-oral | À ajouter |

### Conjuguer au présent — activités

| Sous-thème | Activité | ID de type / activité | Niveaux et présentations | Origine |
|---|---|---|---|---|
| etre | Corriger l’erreur | `gram-ex-etre-corriger-erreur` | A1: correct | Existant |
| etre | Conjuguer être | `gram-ex-etre-qcm-conj` | A1: choice, gap | Existant |
| etre | Mots dans l’ordre | `gram-ex-etre-ordre` | A1: order | Existant |
| avoir | Corriger l’erreur | `gram-ex-avoir-corriger-erreur` | A1: correct | Existant |
| avoir | Conjuguer avoir | `gram-ex-avoir-qcm-conj` | A1: choice, gap | Existant |
| avoir | Mots dans l’ordre | `gram-ex-avoir-ordre` | A1: order | Existant |
| aller-destination | Corriger l’erreur | `gram-ex-aller-destination-corriger-erreur` | A1: correct | Existant |
| aller-destination | Indiquer la destination | `gram-ex-aller-destination-qcm-verbe` | A1: choice, gap | Existant |
| aller-destination | Mots dans l’ordre | `gram-ex-aller-destination-ordre` | A1: order | Existant |
| er | Corriger l’erreur | `gram-ex-er-corriger-erreur` | A1: correct | Existant |
| er | Conjuguer en -er | `gram-ex-er-qcm-conj` | A1: choice, gap | Existant |
| er | Mots dans l’ordre | `gram-ex-er-ordre` | A1: order | Existant |
| er-particuliers | Corriger l’erreur | `gram-ex-er-particuliers-corriger-erreur` | A2: correct | Existant |
| er-particuliers | Les formes particulières | `gram-ex-er-particuliers-qcm-conj` | A1: choice, gap ; A2: choice, gap | Existant |
| er-particuliers | Mots dans l’ordre | `gram-ex-er-particuliers-ordre` | A1: order ; A2: order | Existant |
| ir | Corriger l’erreur | `gram-ex-ir-corriger-erreur` | A2: correct | Existant |
| ir | Conjuguer en -ir | `gram-ex-ir-qcm-conj` | A1: choice, gap ; A2: choice, gap | Existant |
| ir | Mots dans l’ordre | `gram-ex-ir-ordre` | A1: order ; A2: order | Existant |
| re-oir | Corriger l’erreur | `gram-ex-re-oir-corriger-erreur` | A2: correct | Existant |
| re-oir | Conjuguer en -re et -oir | `gram-ex-re-oir-qcm-conj` | A1: choice, gap ; A2: choice, gap | Existant |
| re-oir | Mots dans l’ordre | `gram-ex-re-oir-ordre` | A1: order ; A2: order | Existant |
| modaux | Lire une situation | `gram-ex-modaux-communication-ce` | A1: document-set | Existant |
| modaux | Écrire une phrase utile | `gram-ex-modaux-communication-pe` | A1: open-written | Existant |
| modaux | Dire une phrase utile | `gram-ex-modaux-communication-po` | A1: open-oral | Existant |
| modaux | Corriger l’erreur | `gram-ex-modaux-corriger-erreur` | A1: correct | Existant |
| modaux | Conjuguer les trois verbes | `gram-ex-modaux-qcm-conj` | A1: choice, gap | Existant |
| modaux | Mots dans l’ordre | `gram-ex-modaux-ordre` | A1: order | Existant |
| pronominaux | Corriger l’erreur | `gram-ex-pronominaux-corriger-erreur` | A1: correct | Existant |
| pronominaux | Conjuguer avec le pronom | `gram-ex-pronominaux-qcm-conj` | A1: choice, gap | Existant |
| pronominaux | Mots dans l’ordre | `gram-ex-pronominaux-ordre` | A1: order | Existant |
| a8 | Corriger l’erreur | `gram-ex-a8-corriger-erreur` | A1: correct | Existant |
| a8 | Former la négation | `gram-ex-a8-qcm-verbe` | A1: choice, gap | Existant |
| a8 | Mots dans l’ordre | `gram-ex-a8-ordre` | A1: order | Existant |
| a9 | Corriger l’erreur | `gram-ex-a9-corriger-erreur` | A2: correct | Existant |
| a9 | Choisir une autre négation | `gram-ex-a9-qcm-verbe` | A1: choice, gap ; A2: choice, gap | Existant |
| a9 | Mots dans l’ordre | `gram-ex-a9-ordre` | A1: order ; A2: order | Existant |
| etre | Associer | `gram-ex-etre-curriculum-a` | A1: match | À ajouter |
| avoir | Associer | `gram-ex-avoir-curriculum-a` | A1: match | À ajouter |
| aller-destination | Transformer une phrase | `gram-ex-aller-destination-curriculum-t` | A1: transform | À ajouter |
| aller-destination | S’exprimer à l’oral | `gram-ex-aller-destination-curriculum-p` | A1: open-oral | À ajouter |
| er | Transformer une phrase | `gram-ex-er-curriculum-t` | A1: transform | À ajouter |
| er-particuliers | Transformer une phrase | `gram-ex-er-particuliers-curriculum-t` | A2: transform | À ajouter |
| ir | Transformer une phrase | `gram-ex-ir-curriculum-t` | A2: transform | À ajouter |
| re-oir | Transformer une phrase | `gram-ex-re-oir-curriculum-t` | A2: transform | À ajouter |
| modaux | Jouer une situation | `gram-ex-modaux-curriculum-s` | A1: scenario-set | À ajouter |
| pronominaux | Transformer une phrase | `gram-ex-pronominaux-curriculum-t` | A1: transform | À ajouter |
| pronominaux | S’exprimer à l’oral | `gram-ex-pronominaux-curriculum-p` | A1: open-oral | À ajouter |
| a8 | Transformer une phrase | `gram-ex-a8-curriculum-t` | A1: transform | À ajouter |
| a9 | Transformer une phrase | `gram-ex-a9-curriculum-t` | A2: transform | À ajouter |

### Poser une question — activités

| Sous-thème | Activité | ID de type / activité | Niveaux et présentations | Origine |
|---|---|---|---|---|
| c1 | Poser des questions avec est-ce que | `gram-ex-c1-question-est-ce-que` | A1: transform | Existant |
| c1 | Poser des questions avec l’inversion | `gram-ex-c1-question-inversion` | A1: transform | Existant |
| c1 | Réponse affirmative | `gram-ex-c1-response-affirmative` | A1: transform | Existant |
| c1 | Réponse négative | `gram-ex-c1-response-negative` | A1: transform | Existant |
| c1 | Lire un texte (CE) | `gram-ex-c1-question-reading-ce` | A1: document-set | Existant |
| c1 | Lire un texte et écrire des questions | `gram-ex-c1-question-reading-write` | A1: document-set | Existant |
| c2 | Pronom interrogatif + est-ce que | `gram-ex-c2-question-open-est-ce-que` | A1: transform | Existant |
| c2 | Pronom interrogatif + inversion | `gram-ex-c2-question-open-inversion` | A1: transform | Existant |
| c2 | Répondre à la question | `gram-ex-c2-question-open-response` | A1: open-written | Existant |
| c2 | Lire un texte (CE) | `gram-ex-c2-question-reading-ce` | A1: document-set | Existant |
| c2 | Lire un texte et écrire des questions | `gram-ex-c2-question-reading-write` | A1: document-set | Existant |
| c3 | Poser des questions avec quel | `gram-ex-c3-question-quel` | A1: transform | Existant |
| c3 | Répondre à la question avec quel | `gram-ex-c3-question-quel-response` | A1: open-written | Existant |
| c3 | Lire un texte (CE) | `gram-ex-c3-question-reading-ce` | A1: document-set | Existant |
| c3 | Lire un texte et écrire des questions | `gram-ex-c3-question-reading-write` | A1: document-set | Existant |
| c1 | Choisir la forme correcte | `gram-ex-c1-curriculum-complete` | A1: choice | À ajouter |
| c1 | Mots dans l’ordre | `gram-ex-c1-curriculum-o` | A1: order | À ajouter |
| c1 | S’exprimer à l’oral | `gram-ex-c1-curriculum-p` | A1: open-oral | À ajouter |
| c2 | Compléter la forme | `gram-ex-c2-curriculum-complete` | A1: choice, gap | À ajouter |
| c2 | S’exprimer à l’oral | `gram-ex-c2-curriculum-p` | A1: open-oral | À ajouter |
| c3 | Compléter la forme | `gram-ex-c3-curriculum-complete` | A1: choice, gap | À ajouter |
| c3 | S’exprimer à l’oral | `gram-ex-c3-curriculum-p` | A1: open-oral | À ajouter |

### Phrase exclamative — activités

| Sous-thème | Activité | ID de type / activité | Niveaux et présentations | Origine |
|---|---|---|---|---|
| c4 | Former une exclamation | `gram-ex-c4-qcm-verbe` | A1: choice, gap ; A2: choice, gap | Existant |
| c4 | Mots dans l’ordre | `gram-ex-c4-curriculum-o` | A1: order | À ajouter |
| c4 | S’exprimer à l’oral | `gram-ex-c4-curriculum-p` | A1: open-oral ; A2: open-oral | À ajouter |
| c4 | Transformer une phrase | `gram-ex-c4-curriculum-t` | A2: transform | À ajouter |
| c4 | Corriger l’erreur | `gram-ex-c4-curriculum-c` | A2: correct | À ajouter |

### Parler d'une activité — activités

| Sous-thème | Activité | ID de type / activité | Niveaux et présentations | Origine |
|---|---|---|---|---|
| d1 | Lire une situation | `gram-ex-d1-communication-ce` | A1: document-set | Existant |
| d1 | Écrire une phrase utile | `gram-ex-d1-communication-pe` | A1: open-written | Existant |
| d1 | Dire une phrase utile | `gram-ex-d1-communication-po` | A1: open-oral | Existant |
| d1 | Parler de ses activités | `gram-ex-d1-qcm-verbe` | A1: choice, gap | Existant |
| d2 | Les gestes du quotidien | `gram-ex-d2-qcm-conj` | A1: choice, gap | Existant |
| d3 | Choisir le pronom tonique | `gram-ex-d3-qcm-verbe` | A1: choice, gap ; A2: choice, gap | Existant |
| d2 | Mots dans l’ordre | `gram-ex-d2-curriculum-o` | A1: order | À ajouter |
| d2 | S’exprimer à l’oral | `gram-ex-d2-curriculum-p` | A1: open-oral | À ajouter |
| d3 | Transformer une phrase | `gram-ex-d3-curriculum-t` | A2: transform | À ajouter |
| d3 | Jouer une situation | `gram-ex-d3-curriculum-s` | A2: scenario-set | À ajouter |

### Se situer dans l'espace — activités

| Sous-thème | Activité | ID de type / activité | Niveaux et présentations | Origine |
|---|---|---|---|---|
| e1 | Lire une situation | `gram-ex-e1-communication-ce` | A1: document-set | Existant |
| e1 | Écrire une phrase utile | `gram-ex-e1-communication-pe` | A1: open-written | Existant |
| e1 | Dire une phrase utile | `gram-ex-e1-communication-po` | A1: open-oral | Existant |
| e1 | Situer un objet | `gram-ex-e1-qcm-verbe` | A1: choice, gap | Existant |
| e6 | Préciser le lieu ou la direction | `gram-ex-e6-qcm-verbe` | A1: choice, gap ; A2: choice, gap | Existant |
| e7 | Contracter à et de | `gram-ex-e7-qcm-verbe` | A1: choice, gap | Existant |
| e1 | Associer | `gram-ex-e1-curriculum-a` | A1: match | À ajouter |
| e6 | S’exprimer à l’oral | `gram-ex-e6-curriculum-p` | A1: open-oral ; A2: open-oral | À ajouter |
| e6 | Transformer une phrase | `gram-ex-e6-curriculum-t` | A2: transform | À ajouter |
| e6 | Jouer une situation | `gram-ex-e6-curriculum-s` | A2: scenario-set | À ajouter |
| e7 | Associer | `gram-ex-e7-curriculum-a` | A1: match | À ajouter |
| e7 | Corriger l’erreur | `gram-ex-e7-curriculum-c` | A1: correct | À ajouter |

### Se situer dans le temps — activités

| Sous-thème | Activité | ID de type / activité | Niveaux et présentations | Origine |
|---|---|---|---|---|
| e2 | Lire une situation | `gram-ex-e2-communication-ce` | A1: document-set | Existant |
| e2 | Écrire une phrase utile | `gram-ex-e2-communication-pe` | A1: open-written | Existant |
| e2 | Dire une phrase utile | `gram-ex-e2-communication-po` | A1: open-oral | Existant |
| e2 | Situer dans le temps | `gram-ex-e2-qcm-verbe` | A1: choice, gap | Existant |
| e3 | Exprimer une durée | `gram-ex-e3-qcm-verbe` | A1: choice, gap ; A2: choice, gap | Existant |
| e4 | Dire la fréquence | `gram-ex-e4-qcm-verbe` | A1: choice, gap | Existant |
| e5 | Organiser les étapes | `gram-ex-e5-qcm-verbe` | A1: choice, gap ; A2: choice, gap | Existant |
| e3 | Transformer une phrase | `gram-ex-e3-curriculum-t` | A2: transform | À ajouter |
| e3 | Corriger l’erreur | `gram-ex-e3-curriculum-c` | A2: correct | À ajouter |
| e3 | Jouer une situation | `gram-ex-e3-curriculum-s` | A2: scenario-set | À ajouter |
| e4 | Associer | `gram-ex-e4-curriculum-a` | A1: match | À ajouter |
| e4 | Mots dans l’ordre | `gram-ex-e4-curriculum-o` | A1: order | À ajouter |
| e4 | S’exprimer à l’oral | `gram-ex-e4-curriculum-p` | A1: open-oral | À ajouter |
| e5 | Mots dans l’ordre | `gram-ex-e5-curriculum-o` | A1: order ; A2: order | À ajouter |
| e5 | S’exprimer à l’oral | `gram-ex-e5-curriculum-p` | A1: open-oral ; A2: open-oral | À ajouter |
| e5 | Transformer une phrase | `gram-ex-e5-curriculum-t` | A2: transform | À ajouter |
| e5 | Lire et répondre | `gram-ex-e5-curriculum-d` | A2: document-set | À ajouter |
| e5 | Produire à l’écrit | `gram-ex-e5-curriculum-e` | A2: open-written | À ajouter |

### Demander et proposer — activités

| Sous-thème | Activité | ID de type / activité | Niveaux et présentations | Origine |
|---|---|---|---|---|
| f1 | Choisir ce, cet, cette, ces | `gram-ex-f1-qcm-verbe` | A1: choice, gap | Existant |
| f2 | Demander et proposer | `gram-ex-f2-qcm-conj` | A1: choice, gap | Existant |
| f3 | Lire une situation | `gram-ex-f3-communication-ce` | A1: document-set | Existant |
| f3 | Écrire une phrase utile | `gram-ex-f3-communication-pe` | A1: open-written | Existant |
| f3 | Dire une phrase utile | `gram-ex-f3-communication-po` | A1: open-oral | Existant |
| f3 | Accepter ou refuser | `gram-ex-f3-qcm-verbe` | A1: choice, gap | Existant |
| f1 | Associer | `gram-ex-f1-curriculum-a` | A1: match | À ajouter |
| f1 | Corriger l’erreur | `gram-ex-f1-curriculum-c` | A1: correct | À ajouter |
| f2 | Jouer une situation | `gram-ex-f2-curriculum-s` | A1: scenario-set | À ajouter |
| f2 | S’exprimer à l’oral | `gram-ex-f2-curriculum-p` | A1: open-oral | À ajouter |
| f3 | Associer | `gram-ex-f3-curriculum-a` | A1: match | À ajouter |
| f3 | Mots dans l’ordre | `gram-ex-f3-curriculum-o` | A1: order | À ajouter |
| f3 | Jouer une situation | `gram-ex-f3-curriculum-s` | A1: scenario-set | À ajouter |

### Décrire — activités

| Sous-thème | Activité | ID de type / activité | Niveaux et présentations | Origine |
|---|---|---|---|---|
| description-physique | Lire une situation | `gram-ex-description-physique-communication-ce` | A1: document-set | Existant |
| description-physique | Écrire une phrase utile | `gram-ex-description-physique-communication-pe` | A1: open-written | Existant |
| description-physique | Dire une phrase utile | `gram-ex-description-physique-communication-po` | A1: open-oral | Existant |
| description-physique | Décrire une personne | `gram-ex-description-physique-qcm-verbe` | A1: choice, gap | Existant |
| f4 | Décrire la météo | `gram-ex-f4-qcm-verbe` | A1: choice, gap | Existant |
| f5 | Identifier ou décrire | `gram-ex-f5-qcm-verbe` | A1: choice, gap | Existant |
| f6 | Indiquer à qui cela appartient | `gram-ex-f6-qcm-verbe` | A1: choice, gap | Existant |
| f7 | Accorder l’adjectif | `gram-ex-f7-qcm-verbe` | A1: choice, gap | Existant |
| f8 | Nommer une profession | `gram-ex-f8-qcm-verbe` | A1: choice, gap | Existant |
| f9 | Comparer une qualité | `gram-ex-f9-qcm-verbe` | A1: choice, gap ; A2: choice, gap | Existant |
| f12 | Placer l’adjectif | `gram-ex-f12-qcm-verbe` | A1: choice, gap ; A2: choice, gap | Existant |
| f13 | Former le superlatif | `gram-ex-f13-qcm-verbe` | A1: choice, gap ; A2: choice, gap | Existant |
| f14 | Comparer une quantité | `gram-ex-f14-qcm-verbe` | A1: choice, gap ; A2: choice, gap | Existant |
| f4 | Associer | `gram-ex-f4-curriculum-a` | A1: match | À ajouter |
| f4 | S’exprimer à l’oral | `gram-ex-f4-curriculum-p` | A1: open-oral | À ajouter |
| f5 | Transformer une phrase | `gram-ex-f5-curriculum-t` | A1: transform | À ajouter |
| f5 | Corriger l’erreur | `gram-ex-f5-curriculum-c` | A1: correct | À ajouter |
| f6 | Associer | `gram-ex-f6-curriculum-a` | A1: match | À ajouter |
| f6 | Transformer une phrase | `gram-ex-f6-curriculum-t` | A1: transform | À ajouter |
| f7 | Transformer une phrase | `gram-ex-f7-curriculum-t` | A1: transform | À ajouter |
| f7 | Produire à l’écrit | `gram-ex-f7-curriculum-e` | A1: open-written | À ajouter |
| f7 | S’exprimer à l’oral | `gram-ex-f7-curriculum-p` | A1: open-oral | À ajouter |
| f8 | Jouer une situation | `gram-ex-f8-curriculum-s` | A1: scenario-set | À ajouter |
| f8 | S’exprimer à l’oral | `gram-ex-f8-curriculum-p` | A1: open-oral | À ajouter |
| f9 | Transformer une phrase | `gram-ex-f9-curriculum-t` | A1: transform ; A2: transform | À ajouter |
| f9 | Produire à l’écrit | `gram-ex-f9-curriculum-e` | A1: open-written ; A2: open-written | À ajouter |
| f9 | S’exprimer à l’oral | `gram-ex-f9-curriculum-p` | A1: open-oral ; A2: open-oral | À ajouter |
| f12 | Mots dans l’ordre | `gram-ex-f12-curriculum-o` | A1: order ; A2: order | À ajouter |
| f12 | Corriger l’erreur | `gram-ex-f12-curriculum-c` | A2: correct | À ajouter |
| f12 | Transformer une phrase | `gram-ex-f12-curriculum-t` | A2: transform | À ajouter |
| f13 | Transformer une phrase | `gram-ex-f13-curriculum-t` | A1: transform ; A2: transform | À ajouter |
| f13 | Produire à l’écrit | `gram-ex-f13-curriculum-e` | A1: open-written ; A2: open-written | À ajouter |
| f13 | S’exprimer à l’oral | `gram-ex-f13-curriculum-p` | A1: open-oral ; A2: open-oral | À ajouter |
| f14 | Transformer une phrase | `gram-ex-f14-curriculum-t` | A1: transform ; A2: transform | À ajouter |
| f14 | Produire à l’écrit | `gram-ex-f14-curriculum-e` | A1: open-written ; A2: open-written | À ajouter |
| description-physique | Associer | `gram-ex-description-physique-curriculum-a` | A1: match | À ajouter |

### Conseiller quelqu'un — activités

| Sous-thème | Activité | ID de type / activité | Niveaux et présentations | Origine |
|---|---|---|---|---|
| f10 | Lire une situation | `gram-ex-f10-communication-ce` | A2: document-set | Existant |
| f10 | Écrire une phrase utile | `gram-ex-f10-communication-pe` | A2: open-written | Existant |
| f10 | Dire une phrase utile | `gram-ex-f10-communication-po` | A2: open-oral | Existant |
| f10 | Donner un conseil poli | `gram-ex-f10-qcm-conj` | A2: choice, gap | Existant |
| f11 | Donner une consigne | `gram-ex-f11-qcm-conj` | A1: choice, gap ; A2: choice, gap | Existant |
| f10 | Jouer une situation | `gram-ex-f10-curriculum-s` | A2: scenario-set | À ajouter |
| f11 | Mots dans l’ordre | `gram-ex-f11-curriculum-o` | A1: order ; A2: order | À ajouter |
| f11 | S’exprimer à l’oral | `gram-ex-f11-curriculum-p` | A1: open-oral ; A2: open-oral | À ajouter |
| f11 | Transformer une phrase | `gram-ex-f11-curriculum-t` | A2: transform | À ajouter |
| f11 | Corriger l’erreur | `gram-ex-f11-curriculum-c` | A2: correct | À ajouter |

### Parler des aliments — activités

| Sous-thème | Activité | ID de type / activité | Niveaux et présentations | Origine |
|---|---|---|---|---|
| g1 | Choisir un, une ou des | `gram-ex-g1-qcm-verbe` | A1: choice, gap | Existant |
| g2 | Choisir le, la, l’ ou les | `gram-ex-g2-qcm-verbe` | A1: choice, gap | Existant |
| g3 | Choisir un partitif | `gram-ex-g3-qcm-verbe` | A1: choice, gap | Existant |
| g4 | Lire une situation | `gram-ex-g4-communication-ce` | A1: document-set | Existant |
| g4 | Écrire une phrase utile | `gram-ex-g4-communication-pe` | A1: open-written | Existant |
| g4 | Dire une phrase utile | `gram-ex-g4-communication-po` | A1: open-oral | Existant |
| g4 | Exprimer une quantité | `gram-ex-g4-qcm-verbe` | A1: choice, gap | Existant |
| g5 | Préciser une quantité indéfinie | `gram-ex-g5-qcm-verbe` | A2: choice, gap | Existant |
| g6 | Partitif ou article contracté | `gram-ex-g6-qcm-verbe` | A1: choice, gap ; A2: choice, gap | Existant |
| g1 | Associer | `gram-ex-g1-curriculum-a` | A1: match | À ajouter |
| g2 | Transformer une phrase | `gram-ex-g2-curriculum-t` | A1: transform | À ajouter |
| g2 | Corriger l’erreur | `gram-ex-g2-curriculum-c` | A1: correct | À ajouter |
| g3 | Jouer une situation | `gram-ex-g3-curriculum-s` | A1: scenario-set | À ajouter |
| g4 | Associer | `gram-ex-g4-curriculum-a` | A1: match | À ajouter |
| g4 | Jouer une situation | `gram-ex-g4-curriculum-s` | A1: scenario-set | À ajouter |
| g5 | Transformer une phrase | `gram-ex-g5-curriculum-t` | A2: transform | À ajouter |
| g5 | Corriger l’erreur | `gram-ex-g5-curriculum-c` | A2: correct | À ajouter |
| g6 | Transformer une phrase | `gram-ex-g6-curriculum-t` | A2: transform | À ajouter |
| g6 | Corriger l’erreur | `gram-ex-g6-curriculum-c` | A2: correct | À ajouter |

### Parler du passé — activités

| Sous-thème | Activité | ID de type / activité | Niveaux et présentations | Origine |
|---|---|---|---|---|
| pc-idee | Raconter un fait terminé | `gram-ex-pc-idee-qcm-verbe` | A1: choice, gap | Existant |
| pc-avoir | Le passé composé avec avoir | `gram-ex-pc-avoir-qcm-conj` | A1: choice, gap | Existant |
| pc-etre | Le passé composé avec être | `gram-ex-pc-etre-qcm-conj` | A1: choice, gap ; A2: choice, gap | Existant |
| imparfait | Conjuguer à l’imparfait | `gram-ex-imparfait-qcm-conj` | A2: choice, gap | Existant |
| pqp | Former le plus-que-parfait | `gram-ex-pqp-qcm-conj` | B1: choice, gap | Existant |
| double-aux | Choisir avoir ou être | `gram-ex-double-aux-qcm-verbe` | A2: choice, gap ; B1: choice, gap | Existant |
| pc-pronominaux | Raconter un geste passé | `gram-ex-pc-pronominaux-qcm-verbe` | A2: choice, gap | Existant |
| imparfait-ou-pc | Lire une situation | `gram-ex-imparfait-ou-pc-communication-ce` | A2: document-set | Existant |
| imparfait-ou-pc | Écrire une phrase utile | `gram-ex-imparfait-ou-pc-communication-pe` | A2: open-written | Existant |
| imparfait-ou-pc | Dire une phrase utile | `gram-ex-imparfait-ou-pc-communication-po` | A2: open-oral | Existant |
| imparfait-ou-pc | Choisir le temps du récit | `gram-ex-imparfait-ou-pc-qcm-verbe` | A2: choice, gap | Existant |
| accord-pp | Accorder le participe passé | `gram-ex-accord-pp-qcm-verbe` | A2: choice, gap ; B1: choice, gap | Existant |
| pc-idee | Associer | `gram-ex-pc-idee-curriculum-a` | A1: match | À ajouter |
| pc-idee | Mots dans l’ordre | `gram-ex-pc-idee-curriculum-o` | A1: order | À ajouter |
| pc-avoir | Transformer une phrase | `gram-ex-pc-avoir-curriculum-t` | A1: transform | À ajouter |
| pc-avoir | Corriger l’erreur | `gram-ex-pc-avoir-curriculum-c` | A1: correct | À ajouter |
| pc-etre | Transformer une phrase | `gram-ex-pc-etre-curriculum-t` | A2: transform | À ajouter |
| pc-etre | Corriger l’erreur | `gram-ex-pc-etre-curriculum-c` | A2: correct | À ajouter |
| pc-etre | Produire à l’écrit | `gram-ex-pc-etre-curriculum-e` | A2: open-written | À ajouter |
| imparfait | Transformer une phrase | `gram-ex-imparfait-curriculum-t` | A2: transform | À ajouter |
| imparfait | Produire à l’écrit | `gram-ex-imparfait-curriculum-e` | A2: open-written | À ajouter |
| imparfait | S’exprimer à l’oral | `gram-ex-imparfait-curriculum-p` | A2: open-oral | À ajouter |
| pqp | Transformer une phrase | `gram-ex-pqp-curriculum-t` | B1: transform | À ajouter |
| pqp | Lire et répondre | `gram-ex-pqp-curriculum-d` | B1: document-set | À ajouter |
| pqp | Produire à l’écrit | `gram-ex-pqp-curriculum-e` | B1: open-written | À ajouter |
| double-aux | Corriger l’erreur | `gram-ex-double-aux-curriculum-c` | B1: correct | À ajouter |
| double-aux | Transformer une phrase | `gram-ex-double-aux-curriculum-t` | B1: transform | À ajouter |
| pc-pronominaux | Mots dans l’ordre | `gram-ex-pc-pronominaux-curriculum-o` | A2: order | À ajouter |
| pc-pronominaux | Transformer une phrase | `gram-ex-pc-pronominaux-curriculum-t` | A2: transform | À ajouter |
| pc-pronominaux | Corriger l’erreur | `gram-ex-pc-pronominaux-curriculum-c` | A2: correct | À ajouter |
| imparfait-ou-pc | Transformer une phrase | `gram-ex-imparfait-ou-pc-curriculum-t` | A2: transform | À ajouter |
| accord-pp | Corriger l’erreur | `gram-ex-accord-pp-curriculum-c` | B1: correct | À ajouter |
| accord-pp | Transformer une phrase | `gram-ex-accord-pp-curriculum-t` | B1: transform | À ajouter |
| accord-pp | Produire à l’écrit | `gram-ex-accord-pp-curriculum-e` | B1: open-written | À ajouter |

### Les pronoms — activités

| Sous-thème | Activité | ID de type / activité | Niveaux et présentations | Origine |
|---|---|---|---|---|
| i1 | Choisir qui, que ou où | `gram-ex-i1-qcm-verbe` | A2: choice, gap | Existant |
| i2 | Employer le pronom possessif | `gram-ex-i2-qcm-verbe` | A2: choice, gap | Existant |
| i3 | Employer celui ou celle | `gram-ex-i3-qcm-verbe` | A2: choice, gap | Existant |
| i4 | Lire une situation | `gram-ex-i4-communication-ce` | A2: document-set | Existant |
| i4 | Écrire une phrase utile | `gram-ex-i4-communication-pe` | A2: open-written | Existant |
| i4 | Dire une phrase utile | `gram-ex-i4-communication-po` | A2: open-oral | Existant |
| i4 | Remplacer le COD | `gram-ex-i4-qcm-verbe` | A2: choice, gap | Existant |
| i5 | Remplacer le COI | `gram-ex-i5-qcm-verbe` | A2: choice, gap | Existant |
| i6 | Employer un pronom indéfini | `gram-ex-i6-qcm-verbe` | A2: choice, gap | Existant |
| i7 | Choisir en ou y | `gram-ex-i7-qcm-verbe` | A2: choice, gap | Existant |
| i8 | Employer dont | `gram-ex-i8-qcm-verbe` | B1: choice, gap | Existant |
| i9 | Accorder le relatif composé | `gram-ex-i9-qcm-verbe` | B1: choice, gap | Existant |
| i1 | Associer | `gram-ex-i1-curriculum-a` | A2: match | À ajouter |
| i1 | Transformer une phrase | `gram-ex-i1-curriculum-t` | A2: transform | À ajouter |
| i2 | Transformer une phrase | `gram-ex-i2-curriculum-t` | A2: transform | À ajouter |
| i2 | Corriger l’erreur | `gram-ex-i2-curriculum-c` | A2: correct | À ajouter |
| i3 | Transformer une phrase | `gram-ex-i3-curriculum-t` | A2: transform | À ajouter |
| i3 | Produire à l’écrit | `gram-ex-i3-curriculum-e` | A2: open-written | À ajouter |
| i4 | Transformer une phrase | `gram-ex-i4-curriculum-t` | A2: transform | À ajouter |
| i4 | Corriger l’erreur | `gram-ex-i4-curriculum-c` | A2: correct | À ajouter |
| i5 | Transformer une phrase | `gram-ex-i5-curriculum-t` | A2: transform | À ajouter |
| i5 | Corriger l’erreur | `gram-ex-i5-curriculum-c` | A2: correct | À ajouter |
| i6 | Transformer une phrase | `gram-ex-i6-curriculum-t` | A2: transform | À ajouter |
| i6 | Jouer une situation | `gram-ex-i6-curriculum-s` | A2: scenario-set | À ajouter |
| i7 | Transformer une phrase | `gram-ex-i7-curriculum-t` | A2: transform | À ajouter |
| i7 | Corriger l’erreur | `gram-ex-i7-curriculum-c` | A2: correct | À ajouter |
| i8 | Transformer une phrase | `gram-ex-i8-curriculum-t` | B1: transform | À ajouter |
| i8 | Corriger l’erreur | `gram-ex-i8-curriculum-c` | B1: correct | À ajouter |
| i8 | Produire à l’écrit | `gram-ex-i8-curriculum-e` | B1: open-written | À ajouter |
| i9 | Transformer une phrase | `gram-ex-i9-curriculum-t` | B1: transform | À ajouter |
| i9 | Lire et répondre | `gram-ex-i9-curriculum-d` | B1: document-set | À ajouter |
| i9 | Produire à l’écrit | `gram-ex-i9-curriculum-e` | B1: open-written | À ajouter |

### Parler d'une action — activités

| Sous-thème | Activité | ID de type / activité | Niveaux et présentations | Origine |
|---|---|---|---|---|
| j1 | Lire une situation | `gram-ex-j1-communication-ce` | A1: document-set ; A2: document-set | Existant |
| j1 | Écrire une phrase utile | `gram-ex-j1-communication-pe` | A1: open-written ; A2: open-written | Existant |
| j1 | Dire une phrase utile | `gram-ex-j1-communication-po` | A1: open-oral ; A2: open-oral | Existant |
| j1 | Une action en cours | `gram-ex-j1-qcm-verbe` | A1: choice, gap ; A2: choice, gap | Existant |
| j2 | Une action juste terminée | `gram-ex-j2-qcm-verbe` | A1: choice, gap ; A2: choice, gap | Existant |
| j3 | Former le gérondif | `gram-ex-j3-qcm-verbe` | A2: choice, gap | Existant |
| j1 | Transformer une phrase | `gram-ex-j1-curriculum-t` | A2: transform | À ajouter |
| j2 | S’exprimer à l’oral | `gram-ex-j2-curriculum-p` | A1: open-oral ; A2: open-oral | À ajouter |
| j2 | Transformer une phrase | `gram-ex-j2-curriculum-t` | A2: transform | À ajouter |
| j2 | Produire à l’écrit | `gram-ex-j2-curriculum-e` | A2: open-written | À ajouter |
| j3 | Transformer une phrase | `gram-ex-j3-curriculum-t` | A2: transform | À ajouter |
| j3 | Corriger l’erreur | `gram-ex-j3-curriculum-c` | A2: correct | À ajouter |
| j3 | S’exprimer à l’oral | `gram-ex-j3-curriculum-p` | A2: open-oral | À ajouter |

### Parler de l'avenir — activités

| Sous-thème | Activité | ID de type / activité | Niveaux et présentations | Origine |
|---|---|---|---|---|
| futur-proche | Lire une situation | `gram-ex-futur-proche-communication-ce` | A1: document-set | Existant |
| futur-proche | Écrire une phrase utile | `gram-ex-futur-proche-communication-pe` | A1: open-written | Existant |
| futur-proche | Dire une phrase utile | `gram-ex-futur-proche-communication-po` | A1: open-oral | Existant |
| futur-proche | Annoncer un projet | `gram-ex-futur-proche-qcm-verbe` | A1: choice, gap | Existant |
| futur-simple | Conjuguer au futur simple | `gram-ex-futur-simple-qcm-conj` | A2: choice, gap | Existant |
| futur-proche-ou-simple | Former les deux futurs | `gram-ex-futur-proche-ou-simple-qcm-verbe` | A2: choice, gap | Existant |
| futur-anterieur | Former le futur antérieur | `gram-ex-futur-anterieur-qcm-conj` | B1: choice, gap | Existant |
| hypothese-futur | Une condition pour l’avenir | `gram-ex-hypothese-futur-qcm-verbe` | A2: choice, gap | Existant |
| futur-proche | Transformer une phrase | `gram-ex-futur-proche-curriculum-t` | A1: transform | À ajouter |
| futur-proche | Jouer une situation | `gram-ex-futur-proche-curriculum-s` | A1: scenario-set | À ajouter |
| futur-simple | Transformer une phrase | `gram-ex-futur-simple-curriculum-t` | A2: transform | À ajouter |
| futur-simple | Produire à l’écrit | `gram-ex-futur-simple-curriculum-e` | A2: open-written | À ajouter |
| futur-simple | S’exprimer à l’oral | `gram-ex-futur-simple-curriculum-p` | A2: open-oral | À ajouter |
| futur-proche-ou-simple | Corriger l’erreur | `gram-ex-futur-proche-ou-simple-curriculum-c` | A2: correct | À ajouter |
| futur-proche-ou-simple | Lire et répondre | `gram-ex-futur-proche-ou-simple-curriculum-d` | A2: document-set | À ajouter |
| futur-proche-ou-simple | S’exprimer à l’oral | `gram-ex-futur-proche-ou-simple-curriculum-p` | A2: open-oral | À ajouter |
| futur-anterieur | Transformer une phrase | `gram-ex-futur-anterieur-curriculum-t` | B1: transform | À ajouter |
| futur-anterieur | Lire et répondre | `gram-ex-futur-anterieur-curriculum-d` | B1: document-set | À ajouter |
| futur-anterieur | Produire à l’écrit | `gram-ex-futur-anterieur-curriculum-e` | B1: open-written | À ajouter |
| hypothese-futur | Transformer une phrase | `gram-ex-hypothese-futur-curriculum-t` | A2: transform | À ajouter |
| hypothese-futur | Jouer une situation | `gram-ex-hypothese-futur-curriculum-s` | A2: scenario-set | À ajouter |
| hypothese-futur | S’exprimer à l’oral | `gram-ex-hypothese-futur-curriculum-p` | A2: open-oral | À ajouter |

### Parler des faits divers — activités

| Sous-thème | Activité | ID de type / activité | Niveaux et présentations | Origine |
|---|---|---|---|---|
| j6 | Former le passif | `gram-ex-j6-qcm-verbe` | B1: choice, gap | Existant |
| j7 | Lire une situation | `gram-ex-j7-communication-ce` | B1: document-set | Existant |
| j7 | Écrire une phrase utile | `gram-ex-j7-communication-pe` | B1: open-written | Existant |
| j7 | Dire une phrase utile | `gram-ex-j7-communication-po` | B1: open-oral | Existant |
| j7 | Rapporter une parole | `gram-ex-j7-qcm-verbe` | B1: choice, gap | Existant |
| j8 | Conjuguer au conditionnel | `gram-ex-j8-qcm-conj` | A2: choice, gap ; B1: choice, gap | Existant |
| j9 | Imaginer une condition | `gram-ex-j9-qcm-verbe` | A2: choice, gap ; B1: choice, gap | Existant |
| j10 | Former le conditionnel passé | `gram-ex-j10-qcm-conj` | B1: choice, gap | Existant |
| j6 | Transformer une phrase | `gram-ex-j6-curriculum-t` | B1: transform | À ajouter |
| j6 | Corriger l’erreur | `gram-ex-j6-curriculum-c` | B1: correct | À ajouter |
| j6 | Lire et répondre | `gram-ex-j6-curriculum-d` | B1: document-set | À ajouter |
| j7 | Transformer une phrase | `gram-ex-j7-curriculum-t` | B1: transform | À ajouter |
| j7 | Corriger l’erreur | `gram-ex-j7-curriculum-c` | B1: correct | À ajouter |
| j8 | Jouer une situation | `gram-ex-j8-curriculum-s` | A2: scenario-set ; B1: scenario-set | À ajouter |
| j8 | S’exprimer à l’oral | `gram-ex-j8-curriculum-p` | A2: open-oral ; B1: open-oral | À ajouter |
| j8 | Transformer une phrase | `gram-ex-j8-curriculum-t` | B1: transform | À ajouter |
| j9 | Transformer une phrase | `gram-ex-j9-curriculum-t` | A2: transform ; B1: transform | À ajouter |
| j9 | Produire à l’écrit | `gram-ex-j9-curriculum-e` | B1: open-written | À ajouter |
| j9 | S’exprimer à l’oral | `gram-ex-j9-curriculum-p` | B1: open-oral | À ajouter |
| j10 | Transformer une phrase | `gram-ex-j10-curriculum-t` | B1: transform | À ajouter |
| j10 | Corriger l’erreur | `gram-ex-j10-curriculum-c` | B1: correct | À ajouter |
| j10 | Produire à l’écrit | `gram-ex-j10-curriculum-e` | B1: open-written | À ajouter |
| j10 | S’exprimer à l’oral | `gram-ex-j10-curriculum-p` | B1: open-oral | À ajouter |

### S'expliquer et argumenter — activités

| Sous-thème | Activité | ID de type / activité | Niveaux et présentations | Origine |
|---|---|---|---|---|
| k1 | Donner son avis | `gram-ex-k1-qcm-verbe` | A2: choice, gap | Existant |
| k2 | Lire une situation | `gram-ex-k2-communication-ce` | B1: document-set | Existant |
| k2 | Écrire une phrase utile | `gram-ex-k2-communication-pe` | B1: open-written | Existant |
| k2 | Dire une phrase utile | `gram-ex-k2-communication-po` | B1: open-oral | Existant |
| k2 | Relier et organiser les idées | `gram-ex-k2-qcm-verbe` | A2: choice, gap ; B1: choice, gap | Existant |
| k1 | Associer | `gram-ex-k1-curriculum-a` | A2: match | À ajouter |
| k1 | Jouer une situation | `gram-ex-k1-curriculum-s` | A2: scenario-set | À ajouter |
| k1 | Produire à l’écrit | `gram-ex-k1-curriculum-e` | A2: open-written | À ajouter |
| k1 | S’exprimer à l’oral | `gram-ex-k1-curriculum-p` | A2: open-oral | À ajouter |
| k2 | Mots dans l’ordre | `gram-ex-k2-curriculum-o` | A2: order | À ajouter |
| k2 | Transformer une phrase | `gram-ex-k2-curriculum-t` | B1: transform | À ajouter |

### Exprimer quelque chose — activités

| Sous-thème | Activité | ID de type / activité | Niveaux et présentations | Origine |
|---|---|---|---|---|
| k3 | Lire une situation | `gram-ex-k3-communication-ce` | A2: document-set | Existant |
| k3 | Écrire une phrase utile | `gram-ex-k3-communication-pe` | A2: open-written | Existant |
| k3 | Dire une phrase utile | `gram-ex-k3-communication-po` | A2: open-oral | Existant |
| k3 | Donner une cause | `gram-ex-k3-qcm-verbe` | A2: choice, gap | Existant |
| k4 | Donner une conséquence | `gram-ex-k4-qcm-verbe` | A2: choice, gap | Existant |
| k5 | Exprimer un objectif | `gram-ex-k5-qcm-verbe` | A2: choice, gap | Existant |
| k6 | Opposer deux idées | `gram-ex-k6-qcm-verbe` | A2: choice, gap ; B1: choice, gap | Existant |
| k7 | Exprimer une concession | `gram-ex-k7-qcm-verbe` | B1: choice, gap | Existant |
| k8 | Employer ce qui, ce que, ce dont | `gram-ex-k8-qcm-verbe` | B1: choice, gap | Existant |
| k9 | Placer deux pronoms | `gram-ex-k9-qcm-verbe` | B1: choice, gap | Existant |
| k10 | Employer le subjonctif | `gram-ex-k10-qcm-conj` | B1: choice, gap | Existant |
| k11 | Choisir à ou de | `gram-ex-k11-qcm-verbe` | A2: choice, gap ; B1: choice, gap | Existant |
| k12 | Former le subjonctif passé | `gram-ex-k12-qcm-conj` | B1: choice, gap | Existant |
| k13 | Choisir le mode du verbe | `gram-ex-k13-qcm-verbe` | B1: choice, gap | Existant |
| k3 | Transformer une phrase | `gram-ex-k3-curriculum-t` | A2: transform | À ajouter |
| k4 | Transformer une phrase | `gram-ex-k4-curriculum-t` | A2: transform | À ajouter |
| k4 | Lire et répondre | `gram-ex-k4-curriculum-d` | A2: document-set | À ajouter |
| k4 | Produire à l’écrit | `gram-ex-k4-curriculum-e` | A2: open-written | À ajouter |
| k5 | Transformer une phrase | `gram-ex-k5-curriculum-t` | A2: transform | À ajouter |
| k5 | Jouer une situation | `gram-ex-k5-curriculum-s` | A2: scenario-set | À ajouter |
| k5 | S’exprimer à l’oral | `gram-ex-k5-curriculum-p` | A2: open-oral | À ajouter |
| k6 | Transformer une phrase | `gram-ex-k6-curriculum-t` | A2: transform ; B1: transform | À ajouter |
| k6 | Lire et répondre | `gram-ex-k6-curriculum-d` | B1: document-set | À ajouter |
| k6 | Produire à l’écrit | `gram-ex-k6-curriculum-e` | B1: open-written | À ajouter |
| k6 | S’exprimer à l’oral | `gram-ex-k6-curriculum-p` | B1: open-oral | À ajouter |
| k7 | Transformer une phrase | `gram-ex-k7-curriculum-t` | B1: transform | À ajouter |
| k7 | Corriger l’erreur | `gram-ex-k7-curriculum-c` | B1: correct | À ajouter |
| k7 | Produire à l’écrit | `gram-ex-k7-curriculum-e` | B1: open-written | À ajouter |
| k7 | S’exprimer à l’oral | `gram-ex-k7-curriculum-p` | B1: open-oral | À ajouter |
| k8 | Transformer une phrase | `gram-ex-k8-curriculum-t` | B1: transform | À ajouter |
| k8 | Corriger l’erreur | `gram-ex-k8-curriculum-c` | B1: correct | À ajouter |
| k9 | Mots dans l’ordre | `gram-ex-k9-curriculum-o` | B1: order | À ajouter |
| k9 | Transformer une phrase | `gram-ex-k9-curriculum-t` | B1: transform | À ajouter |
| k9 | Corriger l’erreur | `gram-ex-k9-curriculum-c` | B1: correct | À ajouter |
| k10 | Transformer une phrase | `gram-ex-k10-curriculum-t` | B1: transform | À ajouter |
| k10 | Corriger l’erreur | `gram-ex-k10-curriculum-c` | B1: correct | À ajouter |
| k10 | Produire à l’écrit | `gram-ex-k10-curriculum-e` | B1: open-written | À ajouter |
| k11 | Associer | `gram-ex-k11-curriculum-a` | A2: match | À ajouter |
| k11 | Transformer une phrase | `gram-ex-k11-curriculum-t` | B1: transform | À ajouter |
| k11 | Corriger l’erreur | `gram-ex-k11-curriculum-c` | B1: correct | À ajouter |
| k12 | Transformer une phrase | `gram-ex-k12-curriculum-t` | B1: transform | À ajouter |
| k12 | Lire et répondre | `gram-ex-k12-curriculum-d` | B1: document-set | À ajouter |
| k12 | Produire à l’écrit | `gram-ex-k12-curriculum-e` | B1: open-written | À ajouter |
| k13 | Corriger l’erreur | `gram-ex-k13-curriculum-c` | B1: correct | À ajouter |
| k13 | Transformer une phrase | `gram-ex-k13-curriculum-t` | B1: transform | À ajouter |
| k13 | Lire et répondre | `gram-ex-k13-curriculum-d` | B1: document-set | À ajouter |
| k13 | Produire à l’écrit | `gram-ex-k13-curriculum-e` | B1: open-written | À ajouter |

## Annexe C — Fichiers de travail et statut

- `REGISTRE_ACTIVITES.json` : contrats canoniques, choix, niveaux, présentations, supports hôtes et bilans.
- `ACTIVITES_CIBLES.csv` : une ligne par activité, anciens IDs/aliases et comportement attendu.
- `OFFRES_PAR_NIVEAU.csv` : une ligne par activité/niveau/présentation avec quota, objectif, sources, phase et validation à effectuer.
- `CORRESPONDANCE_199_TYPES.csv` : relevé exhaustif de l’existant, capacités brutes et statut de reprise.
- `MATRICE_123_NOTIONS_NIVEAUX.csv` : niveaux, objectifs et familles après les décisions A2.
- `MEDIA_A_PREPARER.csv` : obligations de supports illustrés ; références et droits à vérifier, aucune génération demandée.
- `RECETTE_ACCEPTATION.csv` et `TRACABILITE_EXIGENCES.csv` : cas et liens de vérification.
- `DECISIONS_CONFIRMEES.json` : décisions utilisateur retenues et date.

Tous les statuts approuvés et résultats d’exécution restent inconnus avant implémentation et revue. Une valeur vide dans les CSV signifie « non vérifié », jamais zéro validé. Les exigences du présent document sont complètes pour lancer les lots G0/G1 et le pilote ; les textes, distracteurs, supports et banques complets restent les contenus à produire, relire et implémenter. Aucun code, audio ou transcription de l’application n’a été modifié lors de cette rédaction.
