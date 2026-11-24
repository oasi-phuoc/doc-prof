# Cahier des charges — Logistique CFC et Logistique AFP dans Doc-Prof

**Version 2.0 consolidée — 24 novembre 2026**  
**Produit cible :** [Doc-Prof / ClairFLE](https://github.com/oasi-phuoc/doc-prof)  
**Source pédagogique :** [EPCAS Logistique](https://github.com/oasi-phuoc/epcas) — référentiel EnterSite, parcours CFC et AFP d’EPCA Sion.  
**Statut :** spécification de réalisation ; les exigences et les objectifs chiffrés proposés devront être validés par le responsable pédagogique. Ce document ne constitue ni une migration déjà exécutée, ni une validation des banques, ni une modification des dépôts.

## 1. Objectif et décisions de périmètre

Créer dans Doc-Prof deux domaines distincts, **Logistique CFC** et **Logistique AFP**, sur le modèle exact de la navigation et du générateur de Grammaire : Domaine → Thème → Sous-thème → Type. Le produit final est une fiche pédagogique imprimable, et non une plateforme d'apprentissage en ligne. Le formateur sélectionne un sous-module, configure sa fiche, la prévisualise, la modifie si nécessaire, la sauvegarde et imprime la fiche élève et, pour les exercices, son corrigé.

| ID | Exigence |
|---|---|
| PER-01 | Formation suisse de logisticien·ne CFC (années 1 à 3) et AFP (années 1 à 2), en français. Reprendre les 80 codes CFC et les 63 codes AFP selon leur éligibilité réelle, y compris les contenus communs. Deux domaines au même niveau que Grammaire, jamais un seul domaine avec un filtre diplôme obligatoire. |
| PER-02 | CFC : `contentFull`, `contentSummary`, `attachments`. AFP : variantes `contentFullAfp`, `contentSummaryAfp`, `attachmentsAfp` lorsqu’elles existent ; à défaut, contenu commun explicitement hérité et validé pour AFP. Respecter le niveau de chaque question structurée. Pas de copie automatique de tous les exercices CFC vers AFP. |
| PER-03 | Cinq types par sous-thème, dans l'ordre : Théorie, Mathématiques, Vérification des connaissances, Mises en situation, Glossaires. Pas de sous-catégories de type supplémentaires dans le sélecteur principal. |
| PER-04 | Importer les cours, objectifs, aperçus, glossaires et toutes les questions CFC et AFP existantes exploitables avec leurs corrigés. Compléter les lacunes sans écraser les sources. |
| PER-05 | Réutiliser le design, les contrôles, les gabarits, l'aperçu A4, l'éditeur libre et la sauvegarde de Doc-Prof ; aucune application séparée. |
| PER-06 | Exclure les comptes EPCAS, classes, données personnelles, progression, notes, évaluations à blanc en ligne, suivi, PWA, Supabase et API de synchronisation EPCAS. Aucun espace apprenti, aucun mode interactif au tableau à développer pour cette livraison. |
| PER-07 | Inclure les connaissances théoriques ICT 801–809 en CFC et 801–804, 808–809 en AFP. Exclure la banque spécifique d'exercices Office pratiques, fichiers Word/Excel natifs et vidéos de correction ; seuls des exercices imprimables de connaissances ou de raisonnement numérique sont prévus. |
| PER-08 | Ne pas changer le comportement des autres domaines, des recettes existantes, des comptes ou des banques de Grammaire. Pas d'appel à EPCAS en production. |

Les objectifs, quotas, filtres de difficulté, politique d'accès et découpage en lots proposés plus loin sont des choix de conception à valider, non des règles officielles des diplômes. Si une question dépasse les connaissances du sous-module, la réviser ou la déplacer explicitement plutôt que la publier sous un mauvais code.

| ID | Exigence complémentaire |
|---|---|
| PER-09 | Les deux domaines utilisent un moteur commun, des banques versionnées et des identifiants distincts. Une unité commune n'est stockée qu'une fois lorsque texte, correction, droits et niveau d'exigence sont identiques. Une adaptation AFP est une unité dérivée, validée séparément. |
| PER-10 | Le périmètre reste la création de fiches papier/PDF et de corrigés. Les scénarios professionnels sont des exercices sur papier et ne remplacent ni la formation pratique supervisée ni les prescriptions de sécurité. |

**Règle de lecture de la version 2.0 :** elle remplace intégralement la version 1.0 et consolide le cahier précédent. Toute exigence générique est applicable aux deux domaines ; les particularités CFC et AFP sont indiquées explicitement. Les objectifs chiffrés sont des cibles de réalisation, non des contenus déjà disponibles.

## 2. Analyse de l'existant et référence technique

### 2.1 Sources inspectées (versions de référence)

- Doc-Prof, branche `main`, commit [`66f9b9f510e3f082e5502cb5d62627e166880ed8`](https://github.com/oasi-phuoc/doc-prof/commit/66f9b9f510e3f082e5502cb5d62627e166880ed8) : [architecture du projet](https://github.com/oasi-phuoc/doc-prof/blob/main/CLAUDE.md), [Grammaire](https://github.com/oasi-phuoc/doc-prof/blob/main/src/grammaire/README.md), [catalogue](https://github.com/oasi-phuoc/doc-prof/blob/main/src/grammaire/catalog.ts), [contrats de banque](https://github.com/oasi-phuoc/doc-prof/blob/main/src/grammaire/curriculum/types.ts), [générateur Grammaire](https://github.com/oasi-phuoc/doc-prof/blob/main/src/grammaire/generate.ts), [générateur UI](https://github.com/oasi-phuoc/doc-prof/blob/main/src/components/generator/README.md), [recettes](https://github.com/oasi-phuoc/doc-prof/blob/main/src/fiches/recipe.ts), [cahier des charges Grammaire](https://github.com/oasi-phuoc/doc-prof/blob/main/docs/grammaire/implementation/cahier-des-charges-v2.md).
- EPCAS, branche `main`, commit [`ac2ceeae3ba7944fb4d24a7de103d41d3da98e1f`](https://github.com/oasi-phuoc/epcas/commit/ac2ceeae3ba7944fb4d24a7de103d41d3da98e1f) : [curriculum.ts](https://github.com/oasi-phuoc/epcas/blob/main/src/lib/curriculum.ts), [levels.ts](https://github.com/oasi-phuoc/epcas/blob/main/src/lib/levels.ts), [types.ts](https://github.com/oasi-phuoc/epcas/blob/main/src/lib/types.ts), [demo-data.ts](https://github.com/oasi-phuoc/epcas/blob/main/src/lib/demo-data.ts), [MarkdownLite](https://github.com/oasi-phuoc/epcas/blob/main/src/components/MarkdownLite.tsx), [lesson-content.ts](https://github.com/oasi-phuoc/epcas/blob/main/src/lib/lesson-content.ts), [curriculum-lesson-merge.ts](https://github.com/oasi-phuoc/epcas/blob/main/src/lib/curriculum-lesson-merge.ts), [question-templates.ts](https://github.com/oasi-phuoc/epcas/blob/main/src/lib/question-templates.ts).

Doc-Prof est une application React/Vite/TypeScript. Le domaine Grammaire utilise un catalogue de thèmes, des sous-thèmes, des banques canoniques, des rendus partagés, un tirage déterministe (`createRng(seed)`, `shuffle`), des recettes enregistrées et des snapshots pour reproduire les fiches. EPCAS est une application Next.js distincte ; il ne faut pas recopier ses composants React de navigation ni ses mécanismes de stockage.

### 2.2 Inventaire de départ constaté

| Élément | Quantité observée |
|---|---:|
| Blocs / thèmes | 9 |
| Modules / sous-thèmes CFC | 80 |
| Répartition par année CFC (séquence Git par défaut) | 34 / 30 / 16 |
| Types de catalogue à prévoir | 400 |
| Entrées `filledByModule` présentes | 78 |
| Entrées avec champs théorie | 78 |
| Entrées avec champs glossaire et situation | 77 chacune |
| Entrées avec champs maths et vérification | 76 chacune |

Ces décomptes portent sur la présence de champs dans le registre statique, pas sur la qualité ni sur le nombre réel de questions valides. Le code 100 « Introduction aux modules » et le 902 « Les études de cas » n'ont pas d'entrée `filledByModule`. Le 613 n'a pas de maths ni de vérification dans ce registre ; le 901 n'a que les objectifs, l'aperçu et la théorie. Les autres pages peuvent contenir des lacunes internes : le rapport d'import doit les détecter. Le sous-module 100 doit être distingué du thème 100, malgré le même code numérique.

Le dépôt contient du contenu par défaut. Les éventuelles modifications publiées dans Supabase par un formateur, les pièces jointes non versionnées et les banques locales ne sont pas accessibles par cette lecture Git. Un export pédagogique CFC/AFP autorisé, sans données utilisateur, pourra être utilisé pour les compléter. Ne pas déclarer les contenus cloud migrés sans preuve.

### 2.3 Inventaire AFP vérifié dans EPCAS

Vérification complémentaire du commit EPCAS de référence `ac2ceeae3ba7944fb4d24a7de103d41d3da98e1f` : [levels.ts](https://github.com/oasi-phuoc/epcas/blob/ac2ceeae3ba7944fb4d24a7de103d41d3da98e1f/src/lib/levels.ts), [curriculum.ts](https://github.com/oasi-phuoc/epcas/blob/ac2ceeae3ba7944fb4d24a7de103d41d3da98e1f/src/lib/curriculum.ts), [lesson-content.ts](https://github.com/oasi-phuoc/epcas/blob/ac2ceeae3ba7944fb4d24a7de103d41d3da98e1f/src/lib/lesson-content.ts). Le blob `curriculum.ts` inspecté est `8168aedbbc6c1031a66f59462f70176790afb40f`.

| Indicateur | CFC | AFP | Ensemble des deux catalogues |
|---|---:|---:|---:|
| Thèmes visibles | 9 | 7 | 16 entrées de thèmes |
| Sous-thèmes | 80 | 63 | 143 entrées (80 codes distincts) |
| 1re année | 34 | 27 | 61 |
| 2e année | 30 | 36 | 66 |
| 3e année | 16 | — | 16 |
| Types de catalogue (5 par sous-thème) | 400 | 315 | 715 |
| Théorie : déclaration source présente | 78 | 62 | 140 occurrences par diplôme |
| Glossaire : déclaration source présente | 77 | 62 | 139 occurrences par diplôme |
| Situation : déclaration source présente | 77 | 62 | 139 occurrences par diplôme |
| Maths : déclaration source présente | 76 | 61 | 137 occurrences par diplôme |
| Vérification : déclaration source présente | 76 | 61 | 137 occurrences par diplôme |
| Catégories sans déclaration source | 16 | 7 | 23 occurrences par diplôme |

Les 63 codes AFP sont un sous-ensemble des 80 codes CFC. Les 17 codes réservés CFC sont : `501–506`, `604`, `612`, `702–705`, `805–807`, `901–902`. Les thèmes 500 Production et 900 Integrate n'ont donc pas de sous-thème AFP et ne doivent pas être affichés dans le catalogue AFP. Les trous numériques de la séquence sont normaux et ne doivent pas être comblés avec des codes fictifs.

Dans le constructeur statique `buildCurriculumLessons()` de ce blob, les champs `contentFullAfp`, `contentSummaryAfp` et `attachmentsAfp` ne sont pas renseignés : le code EPCAS prévoit cependant leur existence dans le modèle `Lesson` et l'édition par niveau. Les 62/61 déclarations recensées pour AFP sont donc des **contenus communs potentiellement héritables**, et non des variantes AFP spécifiques déjà rédigées ou approuvées. L'export éventuel des variantes publiées en production doit être demandé au responsable ; ce document ne suppose pas qu'elles existent ni qu'elles soient absentes de Supabase.

Le code 100 (les cinq catégories) et le 613 (maths et vérification) constituent les lacunes structurelles AFP identifiées. Les lacunes internes sont à détecter par audit. Ne pas importer le contenu CFC de 901/902 pour fabriquer des entrées AFP supplémentaires.

### 2.4 Inventaire des corrigés et réconciliation

Un comptage exploratoire des constantes Markdown complètes dans le blob Git (hors questions structurées et cloud) a détecté 388 blocs de réponse en vérification, 311 en maths et 730 en situation : 1 429 balises de début `:::reponse` ou `:::solution`. Ce chiffre n'est ni un nombre de questions distinctes ni un nombre de réponses justes, ni un stock AFP. Le script d'audit doit compter les unités pédagogiques réelles, rattacher les sous-questions aux cas, identifier les blocs à réponses multiples, dédupliquer entre sources et produire des chiffres par diplôme. Ne pas additionner les contenus hérités comme des nouveaux originaux.

## 3. Catalogue et expérience formateur

### 3.1 Correspondance des entités

| EPCAS | Doc-Prof | Identifiant cible (exemple) |
|---|---|---|
| `curriculumBlocks`, `block-100` | Thème : 100 — Foundation | `log-cfc-theme-100` |
| `Module`, `mod-101` | Sous-thème : 101 — Histoire de la logistique | `log-cfc-sub-101` |
| `theorie` | Théorie | `log-cfc-101-theorie` |
| `maths` | Mathématiques | `log-cfc-101-maths` |
| `verification` | Vérification des connaissances | `log-cfc-101-verification` |
| `situation` | Mises en situation | `log-cfc-101-situation` |
| `glossaire` | Glossaires | `log-cfc-101-glossaire` |
| `objectifs`, `apercu` | Sections intégrées à la fiche Théorie | Pas de type séparé |

Les identifiants sont stables, indépendants des libellés et uniques dans tous les domaines. Les codes numériques et les intitulés EPCAS restent affichés ; les thèmes sont classés de 100 à 900, les sous-thèmes par ordre du référentiel. L'année CFC est une métadonnée/facultativement un filtre, jamais un niveau A1/A2/B1 ni une seconde arborescence. Afficher les 80 sous-thèmes CFC ou les 63 sous-thèmes AFP selon le domaine choisi, sans filtre d’année par défaut. L’année AFP est 1 ou 2 uniquement ; le même code peut relever d’une autre année en CFC.

**Identifiants AFP et séparation des domaines.** Le préfixe `log-afp-` reproduit la convention `log-cfc-` (ex. `log-afp-theme-100`, `log-afp-sub-105`, `log-afp-105-maths`). Les cinq types ont exactement les mêmes libellés et le même ordre dans les deux domaines. Le code source `mod-105` est commun, mais les IDs de catalogue, les recettes et les vues d'éligibilité sont propres au diplôme. Les entrées AFP inexistantes ne doivent pas pouvoir être résolues par URL, recette, API ou édition manuelle.

```text
Domaine : Logistique CFC (logistique-cfc)
  100 – Foundation
    105 – Marchandises
      Théorie | Mathématiques | Vérification des connaissances | Mises en situation | Glossaires
  ... 9 thèmes / 80 sous-thèmes
Domaine : Logistique AFP (logistique-afp)
  100 – Foundation
    105 – Marchandises
      Théorie | Mathématiques | Vérification des connaissances | Mises en situation | Glossaires
  ... 7 thèmes / 63 sous-thèmes
```

### 3.2 Parcours de génération (même ergonomie que Grammaire)

1. Ouvrir le générateur existant et choisir le domaine « Logistique CFC » ou « Logistique AFP ».
2. Choisir le thème, puis un sous-thème du thème actif, puis l'un des cinq types.
3. Afficher les réglages pertinents au type ; masquer ceux de Grammaire, FLE, TCF, audio, jeux et tableau qui ne sont pas applicables.
4. Configurer, générer, prévisualiser la fiche élève et basculer sur le corrigé lorsque pertinent.
5. Utiliser les contrôles existants pour les feuilles, blocs, en-tête, pied, police, colonnes, espace de rédaction, édition libre, impression et sauvegarde.
6. Régénérer un bloc ou une fiche avec une nouvelle graine ; sauvegarder la sélection et ses données pour que la réouverture soit fidèle.

Règles UI : le changement de thème choisit un sous-thème valide et conserve le type si disponible ; le changement de sous-thème conserve le type, remet à zéro une sélection de questions incompatible et plafonne la quantité. Le passage au type suivant reste dans le sous-thème. Les options indisponibles restent identifiables mais désactivées avec une raison claire (« contenu à valider », « banque en cours de rédaction »). Aucun placeholder ne peut être généré comme cours validé. Un changement de filtre qui invalide un bloc existant demande une confirmation si des modifications libres seraient perdues.

### 3.3 Réglages par type

| Type | Réglages spécifiques | Sortie |
|---|---|---|
| Théorie | Complet / Résumé / Aide-mémoire ; sélection de chapitres ; inclure objectifs, exemples, figures, tableaux, encadré à retenir | Document structuré, sans double corrigé |
| Mathématiques | Quantité, difficulté, familles de calcul, source originale/nouvelle/toutes, espace de calcul, points (facultatif) | Problèmes + corrigé détaillé |
| Vérification | Quantité, difficulté, formes de questions, niveau de Bloom, notions, source, espace de réponse, mélange des options | Questions + corrigé correspondant |
| Mises en situation | Nombre de cas, difficulté, thèmes de cas, documents supports, espace de rédaction | Cas et sous-questions + grille de correction |
| Glossaires | Tous les termes / sélection ; ordre alphabétique / pédagogique ; affichage des exemples ; versions à compléter, associations et cartes imprimables si compatibles | Fiche terme-définition ; corrigé seulement si version à compléter |

Valeurs initiales proposées : 10 questions de vérification, 6 problèmes de maths et 2 cas ; toujours adaptées au stock éligible. Aucune limite fictive, aucun recyclage silencieux d'items. La quantité en situation compte les cas (non les sous-questions). Le mode « tous » de théorie et glossaire n'utilise pas de tirage. Aucun générateur d'IA à la volée : les exercices sont issus de banques versionnées ou de gabarits numériques déterministes validés.

### 3.4 Changement de domaine et composition de fiches

- Conserver les préférences de présentation compatibles lors du passage AFP/CFC (police, marges, orientation, en-tête, pied). Recalculer la liste des thèmes, sous-thèmes, types, filtres et quantités. Une sélection devenue invalide est remplacée par la première option valide ou laissée vide avec explication ; aucun bloc existant n'est converti en silence.
- Une fiche peut combiner plusieurs blocs et sous-thèmes du **même diplôme**, par exemple théorie 105, vérification 105, maths 105 et situation 303. Réutiliser les onglets et la structure multi-blocs existants ; préserver les identités de chaque bloc. Pour une fiche comparative AFP/CFC, si le moteur accepte plusieurs domaines dans un document, demander une action explicite et identifier le diplôme de chaque bloc ; ne jamais proposer un mélange automatique. Si le moteur ne le permet pas, maintenir des documents séparés, sans réarchitecture hors périmètre.
- Ajouter une configuration de départ réutilisable « Révision professionnelle » : 3 QCM à 4 propositions, 3 calculs de difficultés croissantes et 15 questions ouvertes, sous réserve du stock filtré. Cette configuration compose des blocs existants ; ce n'est ni un sixième type ni un module de gestion d'examens.
- Afficher des compteurs réels par banque : disponibles, sélectionnés, difficulté, provenance (origine, nouvelle, commune, adaptée). Si un filtre n'a pas de résultat, expliquer pourquoi et proposer de modifier le filtre.
- Prévoir le logo EPCA comme option d'en-tête propre aux deux domaines (autorisation à vérifier), avec palette noir/anthracite, rouge et blanc proposée. Ne pas remplacer le logo ni les couleurs des autres domaines. Le diplôme, le code et le titre doivent rester visibles dans les fiches et les corrigés. Champs facultatifs nom, prénom, classe, date ; aucune collecte de données élèves supplémentaire.

## 4. Fiches de théorie : spécifications éditoriales et rendu

**TH-01.** Reprendre les contenus complets et résumés CFC et les variantes AFP validées sans simplification FALC imposée. Pour AFP, appliquer les règles de résolution et d’adaptation du §6.4. Reprendre les objectifs et l'aperçu sous forme de blocs intégrés. Conserver les titres et leur ordre, définitions, règles, exemples, listes, tableaux, formules, références et avertissements. L'enseignant doit pouvoir produire une fiche intégrale ou une sélection de sections, sans perdre les éléments nécessaires à la compréhension.

**TH-02.** Utiliser les styles de théorie existants de Doc-Prof (`layout: 'theory'`, `GrammarTheoryBlock` dans `src/francais/grammar-theory.ts`) lorsque compatibles : paragraphes, titres, sections, règles, tableaux, exemples, notes, encadrés, sauts. Ajouter des blocs neutres réutilisables pour les médias légendés, les formules ou schémas techniques qui ne sont pas pris en charge, sans casser Grammaire. Le modèle visuel peut reprendre les trois sections de Grammaire (« Je regarde », « J'explique », « Je retiens ») quand cela est pertinent ; ne pas restructurer artificiellement un chapitre technique long.

**TH-03.** Convertir le Markdown EPCAS de manière structurée (AST ou parseur dédié, pas de suppression globale par regex). Conserver les niveaux de titres, caractères accentués, emphases, séparateurs, tableaux, liens, images, balises `:::figure` et légendes. Interpréter les balises de notes élève comme zone vierge facultative ; ne jamais importer de notes d'élève réelles. Toute syntaxe non reconnue apparaît dans le rapport d'import et bloque la validation du bloc concerné.

**TH-04.** Pour le mode Résumé, reprendre le résumé du diplôme disponible ou explicitement hérité, le vérifier contre le cours complet ; compléter uniquement avec des notions attestées. Distinguer « exemples pédagogiques » et faits. Aucune compression qui supprime une consigne de sécurité, une condition d'application ou une unité. Pour les nouveaux chapitres 100 (CFC et AFP) et 902 (CFC uniquement) : écrire une première version à partir d'objectifs et sources autorisés, puis faire relire ; ne pas inventer de contenu officiel.

**TH-05.** Illustrations : importer uniquement celles qui sont pertinentes, autorisées et nécessaires, avec source, licence/droit d'usage, texte alternatif, dimensions et empreinte. Ne pas reprendre automatiquement l'ensemble de `public/`. Un schéma original doit être lisible en noir et blanc ; préciser les cotes, sens des flux et unités. Vérifier les tableaux et captures ICT pour qu'ils restent lisibles à l'impression. Les informations critiques ne sont jamais indiquées uniquement par la couleur.

**TH-06. Aide-mémoire et variantes de présentation.** Proposer une sélection de notions essentielles, formules, unités, exemples courts et vocabulaire, avec liens aux sections sources. Une fiche de théorie personnalisée conserve l'ordre des chapitres et signale les extraits. Une théorie à compléter peut être proposée comme présentation facultative de Théorie, avec blancs liés à des notions approuvées et corrigé issu des mêmes blocs ; ne pas transformer automatiquement un texte technique sensible en exercice à trous. Le mode Théorie complet/résumé/aide-mémoire ne reçoit pas de points.

**TH-07. Spécificités AFP.** Le cours AFP privilégie les compétences opérationnelles attestées : termes expliqués, exemples concrets, séquences courtes, consignes explicites, schémas et tableaux lisibles. Un résumé CFC ne devient pas automatiquement la théorie complète AFP. Une adaptation doit être fondée sur les objectifs AFP et non une simple réduction arbitraire de la longueur ; conserver intégralement les conditions, limites et règles de prévention applicables. Chaque chapitre et notion a une référence et un statut de validation AFP.

## 5. Banque de questions : objectifs de couverture

### 5.1 Dimensionnement proposé (minimum à atteindre par sous-thème)

| Famille | Cible par sous-thème et diplôme | CFC (80) | AFP (63) | Total catalogue (143) |
|---|---:|---:|---:|---:|
| Vérification des connaissances | 50 questions distinctes | 4 000 | 3 150 | 7 150 |
| Mathématiques | 30 problèmes distincts (hors variantes numériques) | 2 400 | 1 890 | 4 290 |
| Mises en situation | 20 cas distincts | 1 600 | 1 260 | 2 860 |
| **Unités principales tirables** | **100** | **8 000** | **6 300** | **14 300** |
| Théorie | 1 cours complet + 1 résumé + 1 aide-mémoire | 240 | 189 | 429 |
| Glossaires | 15 à 30 termes si pertinent | 1 200–2 400 | 945–1 890 | 2 145–4 290 |

Objectif nominal : **14 300 occurrences d’unités tirables** dans les deux catalogues (8 000 CFC, 6 300 AFP) (questions + problèmes + cas) avant de compter les sous-questions des cas. Ce n'est pas un quota imposé par le référentiel ni un décompte de l'existant. Les originaux valides comptent dans le minimum. Ne pas supprimer un excédent : les originaux sont tous conservés après contrôle. Les cas ne sont pas comptés plusieurs fois selon leurs sous-questions. Les variantes numériques d’un même problème ne comptent pas comme de nouveaux problèmes distincts. Un contenu commun validé pour les deux diplômes contribue à chacun des quotas de disponibilité, mais ne compte qu’une fois dans le stock canonique unique. Les rapports distinguent ces métriques. Les unités dérivées doivent présenter une adaptation pédagogique réelle et pas seulement un changement de diplôme dans le titre. Pour les modules peu quantitatifs, créer des calculs professionnels réellement liés au sujet (délais, budgets, quantités, statistiques, indicateurs, etc.) lorsque justifiés ; si la cible est artificielle, consigner une dérogation approuvée avec le nombre réel et les raisons. Aucun remplissage hors sujet. Pour 100 (les deux diplômes) et 902 (CFC uniquement), proposer une couverture transversale conforme au rôle de ces modules, avec objectifs explicitement validés.

Pour chaque banque, établir une matrice : objectif de cours → notion → forme → difficulté → identifiants des unités. Chaque notion essentielle possède au moins une question de compréhension et une question d'application quand pertinent. Répartition cible : 40 % fondamentaux, 40 % application, 20 % approfondissement (ajustable selon le module). Tous les objectifs sont couverts, pas seulement les notions les plus faciles à générer.

### 5.2 Vérification des connaissances

Cible indicative de 50 unités : 20 questions ouvertes, 10 QCM à quatre propositions (simples ou multiples explicitement signalés), 5 vrai/faux justifiés, 5 textes à trous, 5 associations, 5 classements/ordonnancements, comparaisons ou analyses de documents. Adapter à la nature du module ; les formes sont des réglages internes, pas des types supplémentaires. Chaque unité doit inclure un énoncé autonome, une notion ciblée, une difficulté, une réponse attendue, une explication, les variantes acceptables ou critères d'appréciation, et éventuellement des points et références.

- QCM : une seule bonne réponse sauf mention explicite « plusieurs réponses » ; distracteurs plausibles, non ambigus, sans indice de longueur ou de position systématique. Conserver les réponses par ID stable après mélange.
- Vrai/faux : une proposition claire et une justification au corrigé ; éviter les doubles négations et les questions piégeuses.
- Questions ouvertes : préciser la quantité de réponses demandées (« citez deux… »). Accepter les formulations équivalentes, donner un modèle et des critères, pas une phrase obligatoire.
- Associations/ordre : identifiants distincts, absence d'indices de mise en page, une solution non ambiguë ou variantes explicites. Pour les procédures dont l'ordre dépend du contexte, définir les conditions ou préférer une question ouverte.
- Textes à trous : un trou correspond à une réponse identifiée, variantes orthographiques justifiées. Éviter de tester uniquement le vocabulaire si le cours vise le raisonnement.
- Document/illustration : fournir toutes les informations nécessaires, reproduire correctement les tableaux et images autorisés, et rattacher les questions à une preuve du support.

**Taxonomie de Bloom (proposition éditoriale).** En CFC, viser par banque de 50 : 10 mémoriser, 15 comprendre, 10 appliquer, 8 analyser, 5 évaluer, 2 créer. En AFP : 15 mémoriser, 15 comprendre, 12 appliquer, 5 analyser, 2 évaluer, 1 créer lorsque pertinent. Il s'agit de cibles, pas de niveaux réglementaires ; adapter et documenter en fonction du programme. Les questions difficiles AFP évaluent le transfert de compétences AFP, jamais des notions réservées CFC. Le filtre Bloom est indépendant de la difficulté. Utiliser un verbe d'action mesurable et un critère de réponse ; les niveaux sont renseignés pour chaque unité, sans classification automatique non vérifiée.

### 5.3 Mathématiques appliquées à la logistique

Créer au moins 30 problèmes distincts par sous-thème et diplôme lorsque pertinent (10 faciles, 10 moyens, 10 avancés, hors simples variantes numériques), réparties entre calcul direct, problème contextualisé, calcul inverse, interprétation de tableau et problème à étapes. Un gabarit numérique validé déclare variables, domaines admissibles, unités, formule, contraintes, précision, méthode de correction et exemples tests. Les valeurs proviennent de plages réalistes ; toutes les variantes satisfont les contraintes physiques et métier. Les questions de calcul ne sont jamais mélangées au hasard à d'autres modules sans lien.

Contenus transversaux à employer selon les sous-thèmes : conversions SI, pourcentages directs et inverses, proportionnalité, fractions, quantités, masse brute/nette/tare, volumes et densités, surfaces, capacité palette, taux d'occupation, stocks et écarts, rendement, délais, vitesse/distance/temps, coûts CHF, marges et rentabilité, tableaux de données, analyse ABC. Ne pas supposer de tarif, capacité réglementaire ou taux d'imposition actuel : fournir l'hypothèse dans l'énoncé ou une source datée validée.

**Contrat corrigé numérique :** données utiles → formule symbolique → conversion des unités → substitution → calcul intermédiaire → résultat final avec unité et précision → interprétation lorsque demandée. Définir l'arrondi dans l'énoncé (centime, dixième, entier inférieur/supérieur selon le problème). Les résultats financiers utilisent des règles d'arrondi explicites ; pour des unités indivisibles, distinguer capacité maximale (arrondi inférieur) et besoin minimal (arrondi supérieur). Calculer avec une précision suffisante avant l'arrondi final. Ne jamais accepter un résultat juste avec une unité incompatible. Les cas multi-étapes définissent la dépendance entre réponses et une éventuelle tolérance de suivi d'erreur.

### 5.4 Mises en situation professionnelles

Une situation est une unité indivisible de sélection contenant un contexte, un rôle, une mission, des données utiles, éventuellement une annexe, 3 à 8 sous-questions (selon difficulté et diplôme) et un corrigé par sous-question. Varier entreprises fictives, tailles, modes de transport, aléas, flux, interlocuteurs et contraintes, sans utiliser de véritables données personnelles. Exemples : réception non conforme, priorisation, communication avec le client, choix de stockage, contrôle d'un bon de livraison, analyse d'inventaire, décision de distribution, préparation d'une expédition, optimisation de coût.

Prévoir cas guidés (identifier, lire, calculer), cas autonomes (analyser et justifier) et cas complexes (arbitrer et proposer). Un cas ne peut dépendre d'une annexe non disponible. Lorsque plusieurs décisions sont possibles, le corrigé donne une réponse modèle, les conditions de validité et une grille de critères observables. Ne pas imposer une unique réponse pour les situations de jugement. Pour les consignes de sécurité, privilégier identification des risques, mesures de prévention et procédures validées, sans inventer de règle ou de capacité d'engin. Un choix dangereux ne doit jamais être présenté comme une réponse correcte.

**Rédaction des nouveaux cas.** Employer « Vous » et un récit suivi avec des connecteurs (d'abord, ensuite, cependant, enfin). Le contexte doit être autonome, réaliste, fictif et imprimable. Les missions existantes reposant sur une visite virtuelle, une entreprise formatrice ou un lien EnterSite absent doivent être converties en cas autonome avec annexe, ou mises en attente. Garder la trace de l'original. En CFC, cible proposée : 5 cas faciles × 3 questions, 10 moyens × 5, 5 avancés × 8 (105 sous-questions par sous-thème). En AFP, cible proposée : 5 cas faciles × 3, 10 moyens × 4, 5 avancés × 6 (85 sous-questions par sous-thème), avec davantage de guidage et une progression vers l'autonomie. Adapter ces répartitions si les objectifs pédagogiques justifient une autre structure. Les sous-questions ne comptent pas dans les 20 cas. Volume indicatif : 8 400 sous-questions CFC, 5 355 AFP, soit 13 755 occurrences au total, hors unités principales.

**Documents supports.** Prévoir les types réutilisables : bon de commande, bulletin de livraison, facture fictive, fiche de stock, liste de picking, inventaire, étiquette, tableau de production, planning, rapport de non-conformité, graphiques, plans et annexes techniques autorisées. Les valeurs sont cohérentes entre documents, questions et corrigés. Les documents ne contiennent ni identifiants personnels réels ni données de production. Les scénarios AFP utilisent au besoin des documents allégés ou un extrait fidèle, sans masquer des informations indispensables.

### 5.5 Glossaires

Importer toutes les lignes de glossaire de la version résolue pour le diplôme : terme technique, définition, lien (si autorisé), exemples ou synonymes pertinents. Transformer les tableaux EPCAS en entrées structurées ; ne pas perdre une définition à cause d'une colonne vide. Dédupliquer les variantes de casse en préservant les sens distincts. Définition claire, précise et contextualisée, acronymes développés (FIFO, etc. si présents dans le cours), unités correctement écrites. Référencer le chapitre d'origine. Un terme partagé peut référencer une définition canonique tout en conservant un usage local différent. Produire une fiche de référence et facultativement un exercice à compléter avec les mêmes termes ; ne pas créer de sixième type. Pour les glossaires sans contenu, dresser la liste depuis la théorie, puis faire valider.

### 5.6 Différenciation pédagogique et partage des contenus

| Dimension | AFP | CFC |
|---|---|---|
| Théorie | Socle professionnel et applications directement liées aux objectifs AFP | Couverture complète du référentiel CFC et approfondissements attestés |
| Vérification | Consigne explicite, vocabulaire accompagné si nécessaire, exemples de terrain, raisonnement progressif | Définitions, analyse, comparaison, argumentation, transfert entre notions |
| Maths | Données clairement identifiables, conversions et calculs métier guidés puis autonomes | Problèmes à étapes, calculs inverses, comparaison d'hypothèses, analyse d'indicateurs |
| Situations | Mission concrète, contexte court, supports simples, étapes guidées puis choix justifié | Cas plus complexes, documents croisés, arbitrages et solutions argumentées |
| Glossaire | Termes nécessaires à la pratique AFP, définitions claires et exemples | Vocabulaire professionnel complet et nuances techniques |

Ne pas confondre AFP avec « facile » ou un niveau de français A1/A2. Les trois difficultés existent dans les deux formations, selon les connaissances attendues dans chacune. Ne pas retirer une compétence AFP réellement prévue pour rendre une fiche plus simple. Les exercices communs conservent la même précision et le même corrigé, sous réserve d'une double validation d'éligibilité.

**Exemple original de différenciation — 105 Marchandises :** AFP : un carton de 60 × 40 × 30 cm ; calculer son volume en litres à partir des dimensions, puis expliquer pourquoi une indication « fragile » doit être respectée. Corrigé : 72 L ; la fragilité nécessite des précautions adaptées. CFC : deux cartons de mêmes dimensions, de masses 12 kg et 18 kg ; comparer leurs masses volumiques moyennes calculées sur le volume extérieur, puis expliquer pourquoi cette valeur apparente ne permet pas de conclure sur la densité du matériau contenu. Corrigé : 12/0,072 ≈ 166,7 kg/m³ et 18/0,072 = 250 kg/m³ ; les volumes extérieurs comprennent le contenu, l'emballage et les espaces vides. Les chiffres sont des exemples inventés, non des exercices récupérés.

### 5.7 Méthode d'enrichissement par sous-module

1. Résoudre le contenu de référence pour le diplôme, inventorier les objectifs et les notions (identifiants stables), repérer les questions existantes et les éventuelles restrictions de niveau.
2. Examiner le corrigé et le rattachement de chaque original ; conserver les éléments valides, corriger avec journal, mettre en quarantaine les ambiguïtés.
3. Construire la matrice de couverture notion × catégorie × difficulté × Bloom × diplôme. Identifier les notions essentielles non couvertes avant de remplir les quotas.
4. Rédiger les unités manquantes et leurs corrections ensemble. Contrôler l'autonomie des supports et la diversité des raisonnements. Comparer les nouvelles unités avec les banques voisines et avec le diplôme correspondant.
5. Revoir chaque unité et chaque vue d'éligibilité (AFP/CFC) indépendamment ; lancer tests et génération d'épreuves PDF. Enregistrer le déficit réel et les dérogations.
6. Publier seulement les révisions approuvées. Les drafts générés ou relus automatiquement ne valent pas validation enseignante. Ne jamais appeler un service d'IA pendant la génération de fiche.

## 6. Migration des contenus et corrigés : procédure obligatoire

### 6.1 Extraction non destructive

1. Figer les deux commits de travail, créer un manifeste d'import et inventorier toutes les entités. Utiliser `buildCurriculumModules()` et `buildCurriculumLessons()` via un script TypeScript isolé exécuté sur une copie de travail vérifiée ou un parseur AST. Éviter `eval` de texte distant et les expressions régulières comme unique parser du fichier de 1,6 Mo.
2. Construire les deux vues du catalogue en filtrant `Module.levels` pour chaque diplôme ; utiliser les deux séquences par défaut de `levels.ts` comme métadonnées, vérifier les années et les écarts entre séquence et éligibilité. Extraire le `filledByModule` via les fonctions du catalogue, repérer les placeholders `Contenu à importer`, `Contenu résumé à compléter`, les champs vides ou incohérents. Vérifier l'intégralité des titres, blocs et ordres.
3. Extraire `objectifs`, `apercu`, `theorie`, `glossaire`, `situation`, `maths`, `verification`. Les leçons suivent `lesson-{code}-{slug}`. Le contenu complet résolu pour le diplôme est la source principale ; les résumés d'exercices peuvent fournir des réponses de contrôle mais ne deviennent pas des questions supplémentaires.
4. Repérer les blocs `:::reponse`, `:::réponse`, `:::solution` et leur fermeture `:::` à l'aide de la syntaxe réelle de `MarkdownLite.tsx`. Rattacher chaque bloc à son énoncé et à sa mission parent. Traiter les cas avec plusieurs sous-questions, réponses séparées, tableaux, médias et textes « réponse individuelle ». Les blocs non appariés, multiples ou tronqués exigent une revue manuelle. Retirer de la fiche élève les introductions d'autocorrection (« révéler la solution ») et les pieds contenant des réponses.
5. Inventorier aussi `demo-data.ts` (exercices structurés et questions d'évaluations, lorsque rattachables à un sous-module et autorisées). Les payloads QCM, multi, vrai/faux, math, open, matching, ordering, fill_blank sont mappés vers les contrats cibles. Une question sans module explicite n'est pas affectée arbitrairement ; la placer en quarantaine. Ne pas importer les comptes ni les tentatives. Respecter `levels` lorsqu’il existe sur les payloads ou leurs questions parentes ; ne pas étendre une question réservée CFC à AFP. Le stock cloud éventuel est un import ultérieur explicite, à partir d’un export pédagogique autorisé des deux niveaux, sans données personnelles.
6. Pour chaque élément source, conserver texte brut, provenance, position, hash, réponse originale et statut. Une correction validée est enregistrée séparément avec raison et date. Détecter doublons entre questions Markdown et payloads, mais garder la liste des références sources. Ne pas perdre de question simplement parce que sa forme est atypique.
7. Importer dans un dossier de sources éditoriales isolé, produire les données runtime via compilation déterministe, puis valider. Un import répété au même SHA doit donner les mêmes IDs et les mêmes empreintes. Aucun écrasement des unités enrichies, corrigées ou déjà approuvées lors d'une mise à jour.

### 6.2 Exemple réel d'erreur à corriger avant publication

Dans `DEMO_101_MATHS_FULL`, exercice « Port de Hambourg », la source donne 93,9 Mt en 2019, soit une hausse de 3 % par rapport à 2018. La source propose 93,9 × 0,97 = 91,083 Mt, mais il s'agit d'un calcul inverse : 93,9 ÷ 1,03 ≈ **91,165 Mt**, ou **91,2 Mt** si l'on choisit l'arrondi au dixième. Le corrigé d'origine est conservé dans le journal ; la réponse pédagogique est corrigée, la précision est indiquée et le formateur valide. Contrôler aussi les totaux, tableaux, unités et réponses de synthèse de toutes les autres questions. Ce constat démontre qu'une simple copie des corrigés est insuffisante.

### 6.3 États et rapport d'import

États distincts : `imported-unreviewed`, `draft`, `reviewed`, `approved`, `blocked`, `not-applicable`, `retired`. Seul `approved` alimente par défaut le générateur normal. Une prévisualisation administrative peut consulter les brouillons si la fonction est prévue, clairement signalée, sans les inclure dans un tirage ordinaire. `not-applicable` exige une justification pédagogique signée et ne peut compter comme une banque complète sans dérogation. La révision d'un contenu approuvé crée une nouvelle version ; la version approuvée précédente reste reproductible.

Le rapport doit produire par sous-module et type : quantité brute source, questions extraites, corrigés appariés, originaux importés, doublons (avec correspondance), problèmes de syntaxe, réponses à revoir, médias manquants, éléments bloqués, nouveaux items rédigés, approuvés, objectif cible, déficit. Chaque candidat source doit être réconcilié dans exactement un statut final, sans perte silencieuse. Produire JSON machine-readable et synthèse Markdown (CSV facultatif). Les chiffres sont issus d'un script et non d'un compteur saisi à la main.

### 6.4 Résolution exacte des variantes AFP

La source EPCAS expose `getLessonBody(lesson, level, mode)` dans `lesson-content.ts`. En CFC, utiliser exclusivement la version CFC. En AFP, le comportement de référence utilise `contentFullAfp ?? contentFull` et `contentSummaryAfp ?? contentSummary` séparément. `attachmentsAfp` absent signifie héritage des pièces CFC ; un tableau AFP explicitement vide ne doit pas être remplacé par les pièces CFC. Une chaîne vide ou un placeholder AFP est un problème de qualité à examiner, pas une autorisation implicite d'inventer un cours. Le contenu AFP peut être hérité pour le complet et spécifique pour le résumé (ou l'inverse) : valider la cohérence des deux versions.

| Situation source | Action |
|---|---|
| Module CFC exclusif | Créer seulement le catalogue CFC, même si des textes non spécifiques existent. |
| Module commun, champ AFP non renseigné | Référence au champ CFC avec provenance `inherited-cfc` ; approbation AFP indépendante. |
| Champ AFP fourni et identique au CFC | Une révision canonique commune avec deux décisions d'éligibilité et les deux provenances. |
| Champ AFP fourni et différent | Importer comme variante AFP spécifique ; ne pas écraser le CFC. |
| Champ AFP vide, placeholder, tronqué ou incompatible avec un résumé | Bloquer le champ concerné, journaliser le conflit et demander validation ou adaptation. |
| Question source marquée uniquement CFC | Ne pas l'exposer en AFP. |
| Question source marquée AFP et CFC | Vérifier le rattachement, les corrigés, les objectifs et l'éligibilité aux deux. |
| Question sans niveau explicite | Examiner les parents et la notion ; aucun élargissement automatique vers AFP. |
| Pièce jointe, image ou lien externe non autorisé ou manquant | Bloquer le bloc dépendant, remplacer uniquement par un document original ou autorisé et validé. |

Pour une future extraction de données distantes, fournir un export **strictement pédagogique** des modules, leçons, variantes, pièces autorisées, questions et métadonnées de publication, sans comptes ni historiques. Conserver les révisions de provenance. Comparer les textes Git et exportés avant toute fusion ; les règles de `curriculum-lesson-merge.ts` peuvent signaler des versions sauvegardées obsolètes. Ne pas créer une connexion Supabase dans Doc-Prof, ne pas importer l'objet AppState complet, ni exécuter de code distant non vérifié. Toute variante publiée non disponible reste une limite documentée.

### 6.5 Rapports de rapprochement et de partage

Le manifeste d'import est indexé par `(révision source, identifiant leçon, champ source, position, diplôme cible)`. Le rapport doit donner : contenu partagé, hérité en attente de revue, spécifique AFP, spécifique CFC, adapté depuis une unité commune, original par diplôme, bloqué ou non applicable ; nombre de références et nombre d'unités uniques. Pour un même identifiant source, conserver un lien vers les unités dérivées par diplôme. Le différentiel de versions ne modifie pas une fiche sauvegardée. Aucune validation AFP automatique à partir du statut approuvé CFC, ni inversement.

## 7. Contrats de données et architecture technique

### 7.1 Structures canoniques (proposition à adapter aux types partagés)

```ts
type DiplomaLevel = 'CFC' | 'AFP'
type LogistiqueDomain = 'logistique-cfc' | 'logistique-afp'
type DiplomaYear = { level: 'AFP'; year: 1 | 2 } | { level: 'CFC'; year: 1 | 2 | 3 }
type LogistiqueType = 'theorie' | 'maths' | 'verification' | 'situation' | 'glossaire'
type Difficulty = 'facile' | 'moyen' | 'avance'
type EditorialStatus = 'imported-unreviewed' | 'draft' | 'reviewed' | 'approved' | 'blocked' | 'not-applicable' | 'retired'
type Provenance = {
  origin: 'epcas' | 'original-doc-prof'
  repo?: string; commit?: string; path: string
  lessonId?: string; sourcePosition?: string; sourceHash?: string
  rights: 'permitted-reuse' | 'project-original' | 'pending'
  sourceField?: string; resolution?: 'native-cfc' | 'native-afp' | 'inherited-cfc' | 'adapted' | 'original'
  derivedFrom?: { id: string; revision: string }
}
type Submodule = DiplomaYear & {
  id: string; code: string; themeId: string; title: string
  domain: LogistiqueDomain; objectives: string[]
  typeIds: Record<LogistiqueType, string>
}
type BaseUnit = {
  id: string; submoduleId: string; revision: string
  objectiveIds: string[]; difficulty: Difficulty; prompt: string
  bloomLevel: 1 | 2 | 3 | 4 | 5 | 6
  eligibleLevels: DiplomaLevel[]
  reviewByLevel: Partial<Record<DiplomaLevel, { status: EditorialStatus; revision: string; reviewerId?: string; reviewedAt?: string }>>
  explanation: string; source: Provenance[]; status: EditorialStatus
  points?: number; tags: string[]; supports?: MediaRef[]
}
type Correction =
  | { kind: 'choice'; options: {id:string; text:string}[]; correctIds: string[] }
  | { kind: 'boolean'; answer: boolean; justification: string }
  | { kind: 'open'; model: string; accepted?: string[]; criteria: Criterion[] }
  | { kind: 'numeric'; value: number; unit: string; tolerance: number;
      precision: string; formula: string; steps: string[] }
  | { kind: 'matching'; pairs: {leftId:string; rightId:string}[] }
  | { kind: 'ordering'; orderedIds: string[]; alternatives?: string[][] }
  | { kind: 'gap'; blanks: {id:string; answers:string[]}[] }
type Scenario = BaseUnit & {
  context: string; role: string; mission: string; supportIds: string[]
  questions: (BaseUnit & { correction: Correction; responseLines: number })[]
}
```

Extrait conceptuel : `MediaRef`, `Criterion`, `TheoryDoc`, `GlossaryEntry`, `Bank`, gabarits numériques et structures d'affichage sont à formaliser au développement. Utiliser des unions discriminées et les schémas de validation adaptés à la stack existante. Les modèles de correction sont indépendants de la mise en page, les données élèves et corrigés sont dérivés de la même unité. Les questions ouvertes disposent de critères évaluables ; un barème par critère est requis si le mode points est utilisé. Une entrée de banque contient `schemaVersion`, `revision`, `submoduleId`, `type`, `units` et métadonnées de revue. Les identifiants source ne dépendent pas du texte édité, du tirage ou de l'index affiché ; garder un registre de correspondance pour les imports.

### 7.2 Arborescence cible (à créer dans Doc-Prof)

```text
src/logistique/
  catalog.ts               # thèmes, sous-thèmes, 5 types
  types.ts                 # contrats, métadonnées, corrections
  generate.ts              # délégation déterministe
  registry.ts              # résolution des banques, versions, éligibilité
  validation.ts            # intégrité et contrôles pédagogiques formels
  recipe.ts                # snapshots, restauration, versionnement
  theory/                  # documents structurés complets/résumés
  glossary/                # termes par sous-module
  banks/
    canonical/100/101/     # unités versionnées, partagées si identiques
    eligibility/cfc/      # index par sous-module et catégorie
    eligibility/afp/      # index séparé, avec variantes propres
    ...                    # segmentation par bloc et sous-module
  pagination.ts            # groupes, cas, tableaux, espaces
scripts/logistique/
  import-epcas.*           # extraction de la source figée
  compile-banks.*          # construction reproductible
  validate-banks.*         # audit, doublons, corrections numériques
  source/                  # données éditoriales, manifestes, journal
  tests/                   # fixtures import, calcul, rendu, recettes
public/assets/logistique/ # uniquement ressources validées
docs/logistique/          # cahier des charges, couverture et preuves
```

La structure est une proposition, les conventions existantes de Doc-Prof priment. Ne pas créer une copie de `src/grammaire` ; factoriser les utilitaires génériques uniquement lorsqu'un test de non-régression protège leur comportement. Ne pas faire une seule banque géante ni charger tous les médias ou les banques des deux diplômes au démarrage : segmenter et charger à la demande ou via le mécanisme du build adapté ; valider que le changement de sélection ne génère pas une course asynchrone.

### 7.3 Points d'intégration réels

| Fichier / zone existante | Intervention attendue |
|---|---|
| `src/math/types.ts` | Ajouter les domaines stables `logistique-cfc` et `logistique-afp`, types d'options et snapshot ciblés ; réutiliser `MathItem`, `PageConfig`, `WorksheetPage` et layouts existants. |
| `src/math/catalog.ts` | Brancher les thèmes et types du domaine ; valeurs initiales et recherche du type. |
| `src/math/generate.ts` | Ajouter une délégation `tryGenerateLogistiqueBlock` au dispatcher `buildPage`. Aucun tirage dans les composants. |
| `src/access.ts` | Ajouter les deux domaines dans les options d’accès existantes, avec permissions indépendantes ; vérifier admin/full/partial et comptes personnels. Proposition : pilote admin, accès autorisé par configuration à la publication ; aucun changement silencieux des droits des autres domaines. |
| `src/components/generator/generator-derived.ts` et `generator-block-context.ts` | Dériver sous-thèmes, types, quantité disponible, contexte et points ; idéalement une interface commune au modèle Grammaire, sans coupler les données. |
| `DomainThemeTypeFields.tsx`, `usePageNavigation.ts`, `usePageConfig.ts`, `SettingsPanel.tsx`, `QuestionsColumnsFields.tsx` | Réutiliser les sélecteurs et les contrôles ; ajouter seulement les options logistique nécessaires et gérer changement de thème/type, filtres et état sauvegardé. |
| `useGenerateActions.ts`, `page-helpers.ts` | Génération, régénération de bloc, nouvelle graine, plafonnement, validation des options et conservation de l'état libre. |
| `WorksheetSheet.tsx`, `ItemView.tsx`, `item-view/*`, `worksheet-typography.css`, `PrintDocumentChrome.tsx` | Rendu élève/corrigé partagé, tableaux et documents supports, pagination, en-tête, pieds. Étendre les blocs de théorie et de glossaire de façon additive. |
| `src/fiches/recipe.ts`, `src/fiches/api.ts`, `SavedFichesPage.tsx`, API fiches | Sérialisation, validation, restauration, liste et accès aux recettes ; pas de nouvelle base EPCAS. Vérifier le contrat API/D1 et les limites de taille avant toute migration serveur. |

Les noms exacts des nouvelles fonctions sont indicatifs. Vérifier tous les `switch`, listes autorisées, routes, types d'édition libre, import/export de recettes et autorisations où `Domain` est discriminé. Ne pas ajouter le domaine aux activités interactives, jeux ou examens d'autres familles par effet de bord.

### 7.4 Contrats de partage, banque et rendu

Un seul moteur `tryGenerateLogistiqueBlock(config, seed)` résout le domaine et le diplôme, puis le sous-module, le type, la version et les filtres. Une banque d'exécution est une vue approuvée du stock canonique ; ne jamais charger une banque CFC comme secours d'une banque AFP vide. Les IDs d'unités communes sont neutres, par exemple `log-105-ver-0001` ; les variantes éditoriales utilisent un nouvel ID (par exemple `log-afp-105-ver-0042`) lié à `derivedFrom`. Les IDs de catalogue restent systématiquement préfixés par diplôme. Un ID source ou canonique n'est jamais déduit de la position de l'item dans le fichier. Enregistrer un registre d'alias/ancien ID au besoin, sans réutiliser un ID retiré.

```ts
type BankView = {
  schemaVersion: number
  domain: LogistiqueDomain
  diploma: DiplomaLevel
  submoduleId: string
  type: LogistiqueType
  revision: string
  units: { canonicalId: string; revision: string; objectiveIds: string[] }[]
}
type LogistiqueSnapshot = {
  schemaVersion: number
  domain: LogistiqueDomain
  diploma: DiplomaLevel
  submoduleId: string
  typeId: string
  bankRevision: string
  seed: number
  units: { id: string; revision: string; payload: unknown; correction?: Correction }[]
  supportHashes: Record<string, string>
}
```

`payload` est à remplacer par les unions discriminées validées (théorie, glossaire, question, calcul instancié, scénario) ; `unknown` est ici un emplacement conceptuel, non un contrat permissif à livrer. Les références de supports, valeurs calculées, ordre des propositions, sous-questions, numérotation et barèmes sont figés dans le snapshot ou dans une révision immuable. La validité `domain ↔ diploma ↔ submoduleId ↔ typeId ↔ année` est contrôlée à la génération, lors de la sauvegarde, à la restauration et à l'API. La vue doit vérifier aussi `reviewByLevel[diploma]` à la révision sélectionnée et les droits. Un export de recette doit conserver ces identifiants ; un client ne doit pas contourner une restriction par modification manuelle du JSON.

Modèles complémentaires à formaliser : `TheoryDoc` (blocs, mode, sections, références de notions, provenance, version, éligibilité) ; `GlossaryEntry` (terme, définition, exemple, synonymes, abréviation, source, validation par niveau) ; `NumericTemplate` (variables, unités, contraintes et fonction de correction pure) ; `ProfessionalDocument` (champs, tableaux, références, format imprimable, données fictives). Les documents et médias communs sont adressés par référence/empreinte. Interdire un doublon dans une banque même si deux sources renvoient vers la même unité canonique.

### 7.5 Sécurité, accès et compatibilité

Les deux domaines ont des autorisations indépendantes dans le système Doc-Prof existant : un compte autorisé AFP seulement ne doit pas pouvoir créer, sauvegarder ou ouvrir une fiche CFC non autorisée. Tester les recettes mixtes si cette fonctionnalité est supportée. Une vue partagée ne confère pas l'accès à tout le stock CFC. Ne pas modifier les règles des comptes d'autres domaines. Le contenu imprimé doit afficher le diplôme et le code du sous-thème ; le mode élève ne doit pas contenir les corrigés dans le PDF. Une correction pédagogique n'est pas une garantie de confidentialité d'un fichier client : conserver la séparation d'accès du produit sans promettre une protection DRM. Assainir HTML/Markdown et chemins de médias ; refuser les URLs actives ou scripts injectés. Ne pas exposer de secrets ni de données EPCAS dans les exports, logs ou tests.

## 8. Génération, impression et sauvegarde

### 8.1 Tirage reproductible et sélection

- GEN-01 : le générateur reçoit le type, le code du sous-module, les filtres, le nombre d'unités, la graine et la version de banque. Il ne dépend ni de l'heure ni de `Math.random()`. Utiliser les utilitaires `createRng`, `shuffle` et `pick` existants ; définir un ordre stable des unités avant le tirage.
- GEN-02 : tirer sans remise. Pour une fiche comportant plusieurs blocs du même type et sous-module, éviter les doublons entre blocs tant que la banque le permet. Un cas complet compte comme une unité, ses sous-questions gardent leur ordre. Le nombre de questions disponibles reflète le filtre et le statut approuvé.
- GEN-03 : ne jamais compléter une banque insuffisante par une autre banque ou par des doublons. Plafonner, afficher le nombre réel et laisser l'enseignant élargir les filtres. Une banque vide ne génère pas de page blanche ni de texte fictif.
- GEN-04 : pour les problèmes paramétriques, conserver les variables instanciées, le résultat, la formule et la solution détaillée. Échantillonner des combinaisons admissibles, éviter des variantes identiques et limiter les tentatives en cas de contraintes impossibles.
- GEN-05 : la théorie et les glossaires de référence sont déterministes sans tirage aléatoire ; les sections retenues gardent leur ordre. Le glossaire d'entraînement facultatif peut mélanger les entrées sélectionnées.
- GEN-06 : les boutons Générer et Régénérer reprennent les comportements de Doc-Prof. Une régénération locale ne modifie pas les autres blocs ni leurs corrigés. En mode libre, changement d'énoncé, d'option ou de valeur exige une mise à jour cohérente du corrigé ; marquer le bloc « à vérifier » si l'édition rend la solution incertaine.

### 8.2 Feuilles, pagination et mise en page

| ID | Critère de rendu |
|---|---|
| PDF-01 | Même feuille A4 fixe de 210 × 297 mm, même chrome institutionnel, mêmes réglages d'échelle typographique, même aperçu et même moteur d'impression que Doc-Prof. Pas de deuxième système CSS d'impression. |
| PDF-02 | Respect de l'en-tête, pied, numéros de pages, choix de police, couleurs de thème et titre personnalisé. Nom du document par défaut : « CFC – 101 – Histoire de la logistique – Mathématiques » ou « AFP – 101 – Histoire de la logistique – Mathématiques » selon le domaine. |
| PDF-03 | En-tête des tableaux répété si nécessaire ; titres jamais isolés en fin de page ; images dimensionnées sans distorsion ; formules lisibles, symboles et unités corrects. |
| PDF-04 | Laisser suffisamment de place pour écrire à la main : QCM compact, lignes adaptées aux réponses ouvertes, quadrillage/brouillon pour les calculs, espace variable pour les cas. Ne pas réduire la police pour tout faire tenir sur une feuille. |
| PDF-05 | Énoncé et support indispensables sur la même page ou un renvoi clair à l'annexe. Un cas long peut s'étendre sur plusieurs pages avec titre de continuation ; ne pas couper une sous-question ou sa zone de réponse de façon incohérente. |
| PDF-06 | Une colonne par défaut pour les théories, cas, problèmes longs et tableaux ; deux colonnes uniquement pour unités courtes compatibles et selon les réglages existants. Si le format double A5 est proposé, valider sa pagination ou le désactiver explicitement pour les contenus incompatibles. |
| PDF-07 | Version élève sans réponses, sans indices involontaires, sans textes cachés encore imprimés ; version corrigé avec les mêmes identifiants, ordre, numéros et variantes que la fiche élève. Impression du corrigé facultative, jamais une nouvelle génération. |
| PDF-08 | En mode points, total calculé sur les unités réellement sélectionnées, sous-questions additionnées sans double comptage, points partiels définis. Théorie et glossaire de référence ne reçoivent aucun barème. |
| PDF-09 | Aucun débordement, chevauchement, tableau rogné, page vide non demandée, en-tête superposé, image manquante ou coupure de texte. Contrôler en couleur et en niveaux de gris. |

Les rendus doivent réutiliser `WorksheetSheet`, les layouts existants et le moteur de pagination. Un nouveau layout est autorisé uniquement s'il représente un besoin non couvert, avec tests et compatibilité de sauvegarde. Le PDF est produit par le parcours d'impression existant ; pas de nouvelle dépendance de génération PDF par défaut.

### 8.3 Recettes et compatibilité

Sauvegarder le domaine et le diplôme (cohérents), le thème, le sous-thème, le type, les filtres, la graine, les paramètres d'impression, les sélections de chapitres/termes, les points et les modifications libres selon le contrat `FicheRecipe`. Introduire un snapshot logistique versionné : IDs canoniques, version de banque, données instanciées, correction, supports et empreintes. Pour théorie et glossaire, figer les blocs et entrées ou garantir une révision immuable accessible. Tester l'ouverture après mise à jour ou retrait d'une banque. Une recette dont la révision manque doit être signalée et ne doit jamais être reconstruite avec un autre corrigé en silence. Vérifier l'intégrité, les limites de taille, la validation côté API et le contrôle d'accès existant. Les fiches Grammaire et des autres domaines enregistrées avant ce chantier doivent s'ouvrir à l'identique.

## 9. Annexe pédagogique — matrice complète des 80 codes (CFC et AFP)

Les titres ci-dessous correspondent au catalogue EPCAS inspecté. Les trois colonnes de droite constituent des **axes de rédaction proposés** à recouper avec la théorie, les objectifs et les corrigés du sous-module : elles ne sont pas des objectifs officiels nouvellement attestés. Chaque axe doit être développé en questions originales variées, puis vérifié par le formateur. La théorie et les glossaires sont à reprendre pour chacune des 80 lignes ; les 3 banques sont à compléter séparément selon la section 5. Les cas et calculs utilisent des données fictives ou explicitement sourcées. Les années CFC et AFP correspondent aux séquences Git par défaut ; « — » signifie hors catalogue AFP. Chaque ligne commune représente deux vues et deux validations de niveau. La colonne AFP indique un axe de différenciation proposé ; les axes de vérification, maths et situations des trois colonnes centrales sont à décliner à partir des objectifs AFP réels, et non à copier intégralement.

### 9.1 — 100 Foundation (11 sous-modules)

| Code — Sous-thème | Année CFC | Année AFP | Vérification : axes | Maths : axes | Situations : axes | Adaptation AFP proposée |
|---|---:|---:|---|---|---|---|
| 100 — Introduction aux modules | 1 | 1 | Rôle des modules, compétences et liens entre flux | Durées de formation, répartition de tâches, lecture de planning | Repérer le bon module, organiser une révision, parcours d'une marchandise | Identifier le bon module à partir d’une tâche simple ; planifier une courte révision. |
| 101 — Histoire de la logistique | 1 | 1 | Évolution, routes et jalons, chaîne logistique | Chronologies, variations, pourcentages de trafic | Comparer logistique historique et actuelle, évolution de modes de transport | Repérer des dates sur une frise, calculer un écart, comparer deux activités historiques et actuelles. |
| 102 — Structure de la logistique | 1 | 1 | Mondialisation, acteurs, processus, réseaux | Part de flux, distances, délais et comparaisons | Cartographier la chaîne d'un produit, analyser une interruption de flux | Identifier les acteurs d’un flux illustré, lire des quantités simples, repérer une interruption. |
| 103 — Tâches et objectifs | 1 | 1 | Objectifs, tâches, qualité, coût, délai | Taux de service, volumes, temps, objectifs chiffrés | Prioriser des commandes, arbitrer entre coût et qualité | Associer tâche et objectif, compter des commandes traitées, choisir une priorité justifiée. |
| 104 — Flux de marchandises | 1 | 1 | Flux physiques et informationnels, étapes et interfaces | Débits, quantités, taux de remplissage, durées | Suivre une livraison, repérer une rupture, organiser les flux | Remettre en ordre les étapes, lire les quantités, signaler un écart de flux. |
| 105 — Marchandises | 1 | 1 | Catégories, caractéristiques, contraintes de manipulation | Masse brute/nette/tare, volume, densité, lots | Classer des marchandises, choisir une manutention appropriée | Classer les propriétés, convertir masse ou volume, expliquer les précautions adaptées à un carton. |
| 106 — Élimination des déchets CH | 1 | 2 | Tri, filières, responsabilités suisses | Masse par catégorie, taux de tri, coûts | Organiser un tri à l'entrepôt, gérer des déchets non conformes | Identifier une filière à partir d’un guide fourni, additionner les masses et organiser un tri. |
| 107 — Élimination des déchets, continuum | 1 | 2 | Réduction, réemploi, recyclage, traitement | Quantités évitées, taux de valorisation, coûts | Réduire les déchets d'emballage, comparer deux filières | Distinguer réemploi et recyclage, calculer un taux simple, proposer une réduction d’emballage. |
| 108 — Élimination des déchets globale | 1 | 2 | Flux internationaux, impacts et enjeux | Comparer statistiques, proportions, évolution | Évaluer une chaîne de traitement, proposer des améliorations | Lire une carte ou un tableau simplifié, comparer deux quantités, expliquer une amélioration. |
| 109 — Protection des données et sécurité de l'information | 1 | 1 | Confidentialité, accès, menaces, mesures de protection | Capacités de stockage, durées, statistiques d'incidents | Courriel suspect, accès indu, perte d'un document ; procédures validées | Reconnaître les données à protéger, lire une capacité ou un délai, signaler un accès anormal. |
| 110 — Définition de la gestion d'entrepôt | 1 | 1 | Fonctions de l'entrepôt, stock, processus et objectifs | Capacité, occupation, mouvements | Choisir une organisation simple, gérer les entrées/sorties | Identifier les zones de stock, compter les places libres, traiter un mouvement simple. |

### 9.2 — 200 Customer Service (9 sous-modules)

| Code — Sous-thème | Année CFC | Année AFP | Vérification : axes | Maths : axes | Situations : axes | Adaptation AFP proposée |
|---|---:|---:|---|---|---|---|
| 201 — Le client | 1 | 1 | Besoins, attentes, satisfaction, client interne/externe | Taux de satisfaction, délais, commandes | Clarifier un besoin, traiter une demande client | Distinguer client interne/externe, lire une durée, reformuler une demande. |
| 202 — L'attitude personnelle / apparence | 1 | 1 | Attitude professionnelle, présentation, comportement | Horaires, durée de service, indicateurs simples contextualisés | Accueillir un client, réagir à une remarque, comportement professionnel | Reconnaître une attitude professionnelle et une consigne d’accueil ; gérer un horaire. |
| 203 — La gestion de soi | 1 | 1 | Organisation, priorités, objectifs, stress | Planning, temps disponibles, charge et marge | Prioriser plusieurs tâches, gérer un retard | Classer des tâches, calculer le temps disponible, organiser une journée. |
| 204 — Le marché | 1 | 2 | Offre, demande, concurrence, segmentation | Parts de marché, évolution, comparaisons de prix | Étudier une offre, identifier les besoins d'un segment | Identifier offre et demande, comparer deux prix et expliquer un choix. |
| 205 — Le marketing | 1 | 2 | Outils marketing, produit, prix, distribution, communication | Remises, budgets, résultats d'une action | Proposer une action adaptée, comparer des offres | Reconnaître les éléments d’une offre, calculer une remise, proposer une information client. |
| 206 — La communication | 1 | 2 | Émetteur/récepteur, canal, écoute, obstacles | Délais de réponse, volume de demandes, taux d'erreurs | Transmettre une consigne, clarifier un malentendu | Identifier émetteur et destinataire, calculer un délai, reformuler un message. |
| 207 — Pre-Sale-Service | 2 | 2 | Conseil, information, devis et besoins avant vente | Devis, délais, frais, quantités | Renseigner un client, comparer des solutions avant commande | Recueillir les besoins, comparer deux devis simples, renseigner le client. |
| 208 — At-Sale-Service | 2 | 2 | Prise de commande, vente, informations contractuelles | Prix, remise, quantités, total de commande | Vérifier une commande, gérer une indisponibilité | Vérifier une commande, calculer son total, expliquer une indisponibilité. |
| 209 — Le service après-vente | 2 | 2 | Réclamation, retour, garantie selon conditions, suivi | Taux de retours, remboursement, délai, coût | Traiter une réclamation, organiser un retour et son suivi | Identifier une réclamation, calculer un remboursement selon données, documenter le retour. |

### 9.3 — 300 Procurement Management (12 sous-modules)

| Code — Sous-thème | Année CFC | Année AFP | Vérification : axes | Maths : axes | Situations : axes | Adaptation AFP proposée |
|---|---:|---:|---|---|---|---|
| 301 — La logistique d'approvisionnement | 1 | 1 | Besoins, fournisseurs, flux, approvisionnement | Besoins nets, délais, volumes, fréquence | Organiser un approvisionnement, réagir à une rupture | Reconnaître la chaîne fournisseur, calculer un besoin simple, réagir à un manque. |
| 302 — L'achat de marchandises | 1 | 1 | Processus d'achat, offre, commande, critères | Prix unitaires, remises, frais, comparaison d'offres | Choisir un fournisseur, vérifier un devis et une commande | Lire deux offres, calculer quantité × prix, justifier le choix selon critères fournis. |
| 303 — La réception des marchandises | 1 | 1 | Étapes de réception, documents, contrôle | Débit de réception, temps, quantités | Réceptionner une livraison, gérer une anomalie | Identifier les étapes de réception, compter les colis, signaler une non-conformité. |
| 304 — L'identification de la livraison | 1 | 1 | Documents, référence, traçabilité, identification | Quantités, lots, rapprochement chiffré | Identifier un envoi mal étiqueté, rapprocher documents et livraison | Rapprocher références et étiquettes, compter les lots, signaler une erreur. |
| 305 — Déchargement des marchandises | 1 | 1 | Organisation, risques, moyens, consignes validées | Temps, masse, capacités fournies, cycles | Préparer une zone, identifier les risques et choisir un moyen adapté | Identifier les risques sur un plan, lire des durées, demander une intervention autorisée. |
| 306 — Contrôle des supports de charge | 1 | 1 | Supports, défauts, contrôles, critères | Dimensions, masse, nombre de supports, taux de défauts | Trier des palettes, traiter un support non conforme | Reconnaître un défaut de support sur une photo, calculer un taux, signaler le défaut. |
| 307 — Contrôle sommaire et traitement des dommages | 1 | 1 | Inspection, constat, documentation, traitement | Taux d'avarie, quantités, estimation du coût | Identifier un dommage, rédiger un constat, décider du traitement | Distinguer dommage visible et écart, compter les colis concernés, compléter un constat. |
| 308 — Les contrôles de quantités | 1 | 1 | Comptage, écarts, unités, contrôle | Quantités livrées/commandées, écarts, conditionnements | Contrôler un bon de livraison, signaler un manque ou excédent | Calculer les quantités livrées/manquantes, rapprocher documents, signaler les écarts. |
| 309 — Le contrôle de la qualité | 1 | 2 | Critères, conformité, méthodes, traçabilité | Taux de non-conformité, échantillons, lecture de mesures | Vérifier un lot, isoler une non-conformité, documenter le résultat | Comparer une mesure à un critère fourni, compter les non-conformes, documenter. |
| 310 — La préparation à la mise en stock | 2 | 2 | Identification, conditionnement, préparation, documents | Nombre d'emplacements, volumes, temps | Préparer un lot, attribuer des emplacements, traiter les exceptions | Identifier les informations de mise en stock, compter les emplacements, compléter la fiche. |
| 311 — Les concepts de l'approvisionnement | 2 | 2 | Modes d'approvisionnement, besoins, contraintes, risques | Fréquences, coûts, délais, quantités de réapprovisionnement | Comparer les politiques d'achat et de livraison | Distinguer deux modes d’approvisionnement étudiés, comparer fréquence et quantité, justifier. |
| 312 — Données de stockage | 2 | 2 | Données articles, unités, emplacements, fiabilité | Stock disponible, seuils, différences, indicateurs | Corriger une fiche article, rapprocher stock et données | Lire une fiche article, calculer stock après mouvement, repérer une donnée erronée. |

### 9.4 — 400 Logistics (10 sous-modules)

| Code — Sous-thème | Année CFC | Année AFP | Vérification : axes | Maths : axes | Situations : axes | Adaptation AFP proposée |
|---|---:|---:|---|---|---|---|
| 401 — Le rôle du stockage | 1 | 1 | Fonctions, utilité et arbitrages du stockage | Quantités, durée, capacité, couverture | Déterminer pourquoi stocker, réagir à un retard fournisseur | Identifier la fonction du stock, calculer une quantité disponible, expliquer une rupture. |
| 402 — Les genres de stockage | 1 | 1 | Types d'entrepôts et usages, critères de choix | Capacité, distances, coûts comparés | Choisir un genre de stockage selon les produits et flux | Reconnaître les genres de stockage enseignés, comparer les places disponibles, choisir selon critères. |
| 403 — Les formes de stockage | 1 | 1 | Formes physiques, supports, accessibilité | Surfaces, volumes, places palettes, occupation | Comparer rayonnages et stockage au sol avec données fournies | Lire un plan simple, calculer une surface ou des places, comparer deux formes de stockage. |
| 404 — Les prescriptions de stockage | 1 | 1 | Conditions, compatibilité, signalisation et règles validées | Seuils, mesures, capacité déclarée | Repérer les écarts de stockage, proposer des mesures conformes | Lire des prescriptions fournies, repérer un écart, signaler une situation non conforme. |
| 405 — Dangers dans l'entrepôt | 1 | 1 | Risques, prévention, signalisation, comportement | Statistiques d'incidents, taux, lecture de limites données | Analyse de risques, réaction face à une situation dangereuse | Reconnaître les dangers et mesures de prévention, lire des statistiques d’incidents, alerter. |
| 406 — Les principes de stockage | 2 | 2 | FIFO/FEFO/LIFO si enseignés, rotation, emplacements | Durées, rotation, dates, capacités | Choisir une règle de sortie, éviter une péremption | Appliquer la règle de sortie étudiée sur des dates fournies, comparer des durées. |
| 407 — Les moyens de transport | 2 | 2 | Moyens internes/externes, choix, contraintes | Charge, distance, temps, coûts | Choisir un moyen pour déplacer un produit, justifier le choix | Reconnaître les moyens de transport, comparer des durées/coûts donnés, expliquer le choix. |
| 408 — L'organisation de l'entrepôt | 2 | 2 | Zones, adressage, flux, organisation | Surfaces, parcours, occupation, productivité | Optimiser un plan d'entrepôt, limiter les trajets | Lire un plan de zones, calculer une distance simple, repérer un trajet inutile. |
| 409 — Les engins de manutention | 2 | 2 | Types, critères, contrôles et sécurité | Masse, cycles, lecture de capacité fournie | Choisir un engin à partir de documents validés, identifier les limites | Identifier les familles d’engins et les restrictions, lire un document, signaler un risque ; pas de conduite simulée. |
| 410 — Les dispositifs de convoyage | 2 | 2 | Types de convoyeurs, flux, avantages et limites | Débit, cadence, temps, taux d'utilisation | Sélectionner un dispositif, analyser un goulot d'étranglement | Reconnaître les dispositifs, lire une cadence, repérer un ralentissement et le signaler. |

### 9.5 — 500 Production (6 sous-modules)

| Code — Sous-thème | Année CFC | Année AFP | Vérification : axes | Maths : axes | Situations : axes | Adaptation AFP proposée |
|---|---:|---:|---|---|---|---|
| 501 — La production | 2 | — | Types de production, ressources, transformation | Quantités, rendement, cadence | Comparer des modes de production, identifier des ressources | Réservé CFC ; absent du catalogue AFP. |
| 502 — La logistique de production | 2 | — | Approvisionnement interne, stocks, coordination | Besoins, temps, quantités, couverture | Alimenter une ligne, gérer une rupture de matière | Réservé CFC ; absent du catalogue AFP. |
| 503 — L'organisation de la production | 2 | — | Implantation, processus, organisation du travail | Capacité, temps de cycle, charge, cadence | Organiser un poste, repérer un goulot | Réservé CFC ; absent du catalogue AFP. |
| 504 — Le flux de matériel | 3 | — | Circulation, flux poussés/tirés si enseignés, pertes | Débits, encours, trajets, délais | Améliorer un flux, analyser les causes d'attente | Réservé CFC ; absent du catalogue AFP. |
| 505 — Planification et contrôle de la production (PCP) | 3 | — | Planification, ressources, ordres, contrôle | Besoins, capacité, ordonnancement, écarts | Adapter un planning après aléa, comparer charge et capacité | Réservé CFC ; absent du catalogue AFP. |
| 506 — L'assurance qualité dans la production | 3 | — | Contrôle, prévention, traçabilité, amélioration | Rendement, taux de défaut, rebuts, coûts | Analyser un défaut, décider d'actions correctives | Réservé CFC ; absent du catalogue AFP. |

### 9.6 — 600 Support and Distribution (16 sous-modules)

| Code — Sous-thème | Année CFC | Année AFP | Vérification : axes | Maths : axes | Situations : axes | Adaptation AFP proposée |
|---|---:|---:|---|---|---|---|
| 601 — La préparation de commandes | 2 | 2 | Étapes, picking, contrôle, documents | Quantités, lignes, temps, taux d'erreurs | Préparer des commandes, gérer un écart | Lire une liste de préparation, calculer les quantités, repérer un écart de commande. |
| 602 — Les emballages | 2 | 2 | Fonctions, matériaux, protection, choix | Dimensions, volume, masse, coût, remplissage | Choisir un emballage adapté, limiter les déchets | Associer matériau et fonction, calculer volume/coût, choisir un emballage selon critères. |
| 603 — L'arrimage des marchandises | 2 | 2 | Principes, risques, moyens, lecture de prescriptions | Masse, forces ou capacité avec données et formules validées | Repérer les défauts, sélectionner une solution selon documents autorisés | Reconnaître les risques et signalements sur support validé, lire des valeurs fournies ; pas d’instruction pratique dangereuse. |
| 604 — Les systèmes de distribution | 2 | — | Canaux, réseaux, distribution directe/indirecte | Coûts, volumes, délais, taux de service | Choisir un réseau de distribution et justifier | Réservé CFC ; absent du catalogue AFP. |
| 605 — Mode d'envoi postal | 2 | 2 | Types d'envois, adressage, services | Masse, dimensions, délais et tarifs fournis | Choisir un envoi, préparer l'étiquette et vérifier les critères | Lire un tarif fictif et des dimensions, calculer le prix, choisir le service selon critères. |
| 606 — Le transport routier | 2 | 2 | Organisation, documents, contraintes, risques | Distance, vitesse, durée, charge et coût | Comparer deux itinéraires ou offres avec contraintes fournies | Identifier les documents routiers étudiés, calculer une durée/distance, comparer deux offres. |
| 607 — Le transport ferroviaire | 2 | 2 | Organisation, wagons, avantages et limites | Masse, capacité, distance, délais | Choisir une solution ferroviaire, comparer des alternatives | Reconnaître les caractéristiques ferroviaires, lire des capacités, comparer deux délais. |
| 608 — Le transport aérien | 2 | 2 | Fret, délais, documents, contraintes | Masse, volume, poids facturable si formule fournie, coût | Comparer fret aérien et autre mode selon urgence | Reconnaître les contraintes du fret aérien, comparer masses/délais fournis, choisir un service. |
| 609 — Navigation | 2 | 2 | Transport maritime/fluvial, ports, unités, flux | Tonnage, conteneurs, durée, coûts | Organiser une expédition, analyser des contraintes de délai | Identifier ports et unités étudiées, lire un tonnage et des délais, comparer deux envois. |
| 610 — Le transport combiné | 2 | 2 | Intermodalité, ruptures de charge, coordination | Distances par segment, temps, coût total | Planifier une chaîne combinée, analyser une correspondance | Remettre les segments en ordre, additionner les durées, identifier une correspondance. |
| 611 — La préparation de commandes (approfondissement) | 2 | 2 | Stratégies de picking, optimisation, contrôle | Productivité, parcours, taux d'erreurs, temps | Optimiser la préparation de plusieurs commandes | Lire plusieurs listes de préparation, comparer temps et quantités, expliquer une organisation. |
| 612 — La planification des transports | 3 | — | Planification, contraintes, ressources, coordination | Tournées, durée, distance, capacité, coût | Adapter une tournée à des aléas et contraintes | Réservé CFC ; absent du catalogue AFP. |
| 613 — CPD — Qualité de service dans la distribution | 3 | 2 | Critères de qualité, indicateurs, réclamations | Taux de service, retards, taux de conformité | Analyser des défauts de livraison, proposer des mesures ; maths/vérification à créer | Identifier les critères de qualité, calculer taux de retard simple, signaler une réclamation. |
| 614 — CPD — Possibilités de dépôt | 3 | 2 | Options de dépôt, critères, contraintes | Capacité, distances, horaires, coûts | Choisir un dépôt adapté, gérer une option indisponible | Comparer horaires et distances de dépôts, calculer un délai, choisir selon critères. |
| 615 — CPD — Préparer les envois postaux | 3 | 2 | Préparation, contrôle, tri, documents | Volumes, masses, capacités, coûts donnés | Organiser une préparation d'envois et traiter les anomalies | Reconnaître les étapes, compter colis et masses, vérifier une liste de préparation. |
| 616 — CPD — Processus dans les centres de distribution | 3 | 2 | Étapes, tri, flux et contrôle | Cadences, débit, charge, taux d'erreurs | Optimiser un processus de tri, gérer un pic de volume | Lire un tableau de tri, calculer une cadence simple, identifier un écart et le signaler. |

### 9.7 — 700 FICO (5 sous-modules)

| Code — Sous-thème | Année CFC | Année AFP | Vérification : axes | Maths : axes | Situations : axes | Adaptation AFP proposée |
|---|---:|---:|---|---|---|---|
| 701 — L'inventaire | 2 | 2 | Types d'inventaire, écart, méthode, fiabilité | Stock théorique/réel, valorisation, écarts | Préparer un inventaire, analyser les écarts | Compter un stock, calculer l’écart réel/théorique, compléter une fiche d’inventaire. |
| 702 — Les coûts de stockage | 3 | — | Charges fixes/variables, coûts directs/indirects | Coûts par unité, période, surface, taux | Comparer deux organisations de stockage | Réservé CFC ; absent du catalogue AFP. |
| 703 — Les coûts du personnel | 3 | — | Types de coûts, temps, productivité | Heures, coût horaire, charges selon hypothèses | Calculer le budget d'une équipe, comparer des horaires | Réservé CFC ; absent du catalogue AFP. |
| 704 — Stockage — Les indicateurs logistiques | 3 | — | Définition et interprétation des KPI, limites | Rotation, durée, occupation, service, productivité | Analyser un tableau d'indicateurs, définir des améliorations | Réservé CFC ; absent du catalogue AFP. |
| 705 — La rentabilité de l'entrepôt | 3 | — | Recettes, coûts, résultat, rentabilité | Seuil de rentabilité, marge, coûts unitaires | Comparer des scénarios d'exploitation, justifier un choix | Réservé CFC ; absent du catalogue AFP. |

### 9.8 — 800 ICT (9 sous-modules)

| Code — Sous-thème | Année CFC | Année AFP | Vérification : axes | Maths : axes | Situations : axes | Adaptation AFP proposée |
|---|---:|---:|---|---|---|---|
| 801 — L'identification des marchandises | 1 | 1 | Identifiants, codes, traçabilité et lecture | Quantités de codes/lots, taux de lecture et d'erreur | Diagnostiquer une erreur d'identification, organiser la traçabilité | Associer identifiants et marchandises, compter les erreurs, repérer un problème de traçabilité. |
| 802 — Le transport (ICT) | 2 | 2 | Données transport, outils, suivi, échanges | Horodatage, délais, distances, indicateurs | Interpréter un suivi, traiter une incohérence de données | Lire un suivi d’expédition, calculer un retard, transmettre une anomalie. |
| 803 — Logiciel d'exploitation | 1 | 1 | Fonctions du logiciel, processus, données et contrôle | Quantités, écarts, temps, indicateurs extraits | Corriger une donnée, rapprocher opérations et système | Reconnaître les fonctions du logiciel, calculer un écart de stock, identifier une donnée incohérente. |
| 804 — Fondation Microsoft 365 | 1 | 1 | Outils, collaboration, stockage, permissions | Capacités numériques, temps, volumes et taux | Choisir un outil, partager un document, réagir à un accès incorrect | Identifier l’outil Microsoft 365 adapté, lire une capacité, repérer un partage inapproprié. |
| 805 — Word Microsoft 365 | 2 | — | Mise en forme, styles, tableaux, sections, documents | Marges, dimensions, unités, pagination et temps | Concevoir sur papier un document professionnel structuré, repérer des erreurs | Réservé CFC ; absent du catalogue AFP. |
| 806 — Excel Microsoft 365 | 3 | — | Cellules, références, fonctions, tableaux, graphiques | Calculs de formules, données, pourcentages, indicateurs et ABC si enseignés | Interpréter un tableau et corriger des formules sur papier | Réservé CFC ; absent du catalogue AFP. |
| 807 — PowerPoint Microsoft 365 | 3 | — | Structure, lisibilité, supports, présentation | Durées, proportions, données graphiques | Planifier une présentation logistique, analyser la lisibilité | Réservé CFC ; absent du catalogue AFP. |
| 808 — OneNote Microsoft 365 | 2 | 2 | Organisation, sections, pages, partage et notes | Répartition du temps, volumes de notes, statistiques pertinentes | Structurer un dossier de procédures, organiser les notes collaboratives | Organiser des notes en pages et sections, calculer des durées, retrouver une consigne. |
| 809 — Poste de contrôle | 2 | 2 | Fonctions, données, interfaces et contrôle | Débit, temps, écarts, indicateurs | Analyser les informations d'un poste de contrôle, signaler une anomalie | Lire des indicateurs simples, calculer un écart, signaler une anomalie. |

### 9.9 — 900 Integrate (2 sous-modules)

| Code — Sous-thème | Année CFC | Année AFP | Vérification : axes | Maths : axes | Situations : axes | Adaptation AFP proposée |
|---|---:|---:|---|---|---|---|
| 901 — Planifier et évaluer les projets logistiques | 3 | — | Objectifs, étapes, ressources, risques et évaluation | Budgets, délais, écarts, capacité, indicateurs | Planifier un projet, gérer un aléa, évaluer les résultats ; 3 banques et glossaire à créer | Réservé CFC ; absent du catalogue AFP. |
| 902 — Les études de cas | 3 | — | Synthèse des compétences validées, liens entre modules | Calculs transversaux à étapes, coût/service/stock/transport | Études de cas intégrées et documentées ; contenu à construire et valider | Réservé CFC ; absent du catalogue AFP. |

### 9.10 Répartition synthétique des catalogues

| Thème | CFC | AFP | Codes AFP |
|---|---:|---:|---|
| 100 Foundation | 11 | 11 | 100–110 |
| 200 Customer Service | 9 | 9 | 201–209 |
| 300 Procurement Management | 12 | 12 | 301–312 |
| 400 Logistics | 10 | 10 | 401–410 |
| 500 Production | 6 | 0 | Aucun |
| 600 Support and Distribution | 16 | 14 | 601–603, 605–611, 613–616 |
| 700 FICO | 5 | 1 | 701 |
| 800 ICT | 9 | 6 | 801–804, 808–809 |
| 900 Integrate | 2 | 0 | Aucun |
| **Total** | **80** | **63** | **63 codes communs** |

Les intitulés et les années des 80 lignes constituent la référence d'acceptation du catalogue. Une mise à jour du référentiel peut modifier ces chiffres après audit ; les changements doivent être justifiés et approuvés avant modification des identifiants ou des recettes.

## 10. Plan de réalisation et livrables

| Lot | Périmètre | Livrable / condition de sortie |
|---|---|---|
| L0 — Audit | Figer les SHA, extraction, droits, inventaire des 715 entrées (400 CFC + 315 AFP) et sauvegarde des références. | Manifeste de provenance, état des lacunes, rapport de couverture initial, liste des risques ; pas de modification d'EPCAS. |
| L1 — Socle | Deux domaines, catalogue 9 thèmes/80 sous-thèmes CFC et 7 thèmes/63 sous-thèmes AFP, cinq types, contrats partagés, navigation, droits indépendants et sauvegarde. | Domaines pilotes admin ; types indisponibles signalés ; toutes les routes et anciennes recettes intactes. |
| L2 — Pilotes | 105 (pilote de bout en bout CFC/AFP), 101 (source riche), 308 (quantités), 613 (lacunes communes, années différentes), 805 (CFC uniquement et ICT illustré), 902 (CFC uniquement et source absente). | Génération des cinq types, import fidèle et correction auditée, pagination, snapshots ; 902 reste bloqué tant que ses nouveaux contenus ne sont pas approuvés. |
| L3 — Import global | Extraction des textes, résumés, glossaires, questions et corrigés de tous les modules. | Rapport d'appariement et de doublons, inventaire des médias, aucune perte silencieuse ; contenu non relu non publié. |
| L4 — Enrichissement par thème | 100, 200, 300, 400, 500, 600, 700, 800, 900 ; lots éditoriaux séparés et traçables. | Pour chaque thème et diplôme éligible : matrices de compétences, banques complétées, corrigés validés, preuves de rendu et statut par sous-module ; partage canonique et adaptation AFP auditée. |
| L5 — Recette finale | Tests unitaires, intégration, navigateur, PDF, sauvegarde, droits, performance et non-régression. | Rapport de recette, aucun défaut bloquant, revue formateur des banques, dérogations documentées. |
| L6 — Publication | Activer les accès autorisés après validation ; versionner les banques et documents. | PR revue et validée, documentation, notes de version, procédure de désactivation/rollback ; pas de déploiement sans autorisation. |

Livrables : code source et tests, manifeste d'import et journal de corrections, banque par sous-module, sources éditoriales reproductibles, matrice de couverture, registre médias, exemples PDF élève/corrigé et captures de recette, README de maintenance, guide formateur succinct, rapport de validation et état des dérogations. Conserver ce cahier des charges dans `docs/logistique/cahier-des-charges.md`. Les lots sont des dépendances de réalisation, pas un calendrier contractuel ni une promesse de durée.

### 10.1 Ordre de traitement et preuves attendues

1. Lot L0 : produire le manifeste des deux diplômes, enregistrer les SHA effectivement utilisés et les SHA des médias. Confronter les codes à `levels.ts` et établir le déficit par catégorie avant génération de nouvelles questions.
2. Lot L1 : architecture commune, sélecteurs, types, contrôles d'accès et contrat d'enregistrement. Tous les types apparaissent mais les banques non validées restent non tirables. Protéger le comportement initial de Grammaire par des tests et une base de comparaison.
3. Lot L2 : réaliser le pilote 105 dans **les deux domaines** avant tout import massif ; produire une fiche complète, une fiche résumée, un glossaire, une fiche de connaissances, une fiche de maths, une situation et leurs corrigés applicables par diplôme. Tester variantes héritées et spécifiques avec fixtures synthétiques. Les autres codes pilotes servent à éprouver les cas limites et non à retarder la correction du pilote principal.
4. Lots L3/L4 : importer et enrichir les codes communs une première fois au niveau canonique, puis contrôler et adapter les deux diplômes ; traiter les 17 codes CFC exclusifs sans créer de vues AFP. Prioriser les banques manquantes 100/613 (les deux) et 901/902 (CFC). Livrer par thème, avec rapports et tests reproductibles.
5. Lots L5/L6 : contrôler le rendu des 715 types, en tenant compte des exceptions approuvées ; vérifier les anciennes recettes, les accès et les performances. Soumettre une pull request ; aucune modification ni publication sur EPCAS et aucun déploiement de production sans autorisation.

### 10.2 Structure des preuves et suivi

```text
docs/logistique/
  cahier-des-charges.md
  README.md
  architecture.md
  inventaire-epcas.json
  rapport-importation.md
  journal-corrections.jsonl
  registre-sources-et-droits.md
  couverture/{cfc,afp}/<code>.json
  preuves/{cfc,afp}/<code>/<type>/
  validation/rapport-recette.md
  avancement.md
```

Pour chaque type publiable : recette JSON de preuve, révision des banques, graine, capture d'aperçu et PDF de fiche élève, corrigé si applicable, résultat automatisé de contrôle des débordements et résultat de revue. Les noms des fichiers contiennent le diplôme et le code. Les données de test sont fictives. Ne pas stocker de gros médias redondants dans Git ; respecter les conventions du projet. Un script de contrôle CI doit refuser une modification de banque approuvée non accompagnée d'une révision, un ID dupliqué ou une rupture de contrat.

## 11. Tests et critères de réception

### 11.1 Tests automatiques minimaux

| ID | Test / résultat attendu |
|---|---|
| CAT-01 | Exactement 9 thèmes, 80 sous-thèmes et 400 types CFC ; 7 thèmes, 63 sous-thèmes et 315 types AFP ; 715 entrées, 143 sous-thèmes de catalogue ; IDs uniques ; distinction thème 100/sous-thème 100 ; années 34/30/16 et 27/36 conformes au registre figé. |
| CAT-02 | Aucun module CFC exclusif dans AFP ; aucune variante AFP dans une vue CFC ; héritages AFP approuvés explicitement ; aucun type pratique Office importé dans les deux domaines. |
| IMP-01 | Réconciliation 100 % des candidats source par identifiant ; chaque question acceptée a un corrigé, chaque rejet une justification, tous les placeholders recensés. |
| IMP-02 | Réexécuter l'import à SHA identique produit les mêmes IDs et fichiers canoniques ; les corrections et enrichissements ne disparaissent pas. |
| IMP-03 | Fixtures : balise de solution accentuée/non accentuée, tableau, question à plusieurs sous-questions, réponse individuelle, bloc sans fermeture, média manquant, résumé redondant, doublon structuré/Markdown. |
| BANK-01 | Chaque banque respecte le schéma, identifiants uniques, liens aux objectifs, provenance, statut, réponses non vides, options distinctes et critères cohérents. |
| BANK-02 | Contrôle des quotas et de la couverture par notion/type/difficulté ; calcul des déficits à partir des seuls items approuvés ; dérogations approuvées séparément. |
| MATH-01 | Recalcul indépendant de chaque corrigé numérique, y compris inverse de pourcentage, conversion, arrondi, unité, capacité entière et cas limites. Reproduire le test Hambourg 101. |
| MATH-02 | Pour chaque gabarit, exemples connus, bornes, valeurs interdites, invariants et campagne sur au moins 100 graines ; résultat du générateur égal à la référence dans la précision requise. |
| GEN-01 | Même recette et graine → même contenu, même ordre, même corrigé ; changement de graine → sélection différente quand la banque le permet ; aucune duplication involontaire. |
| GEN-02 | Demande 0, maximum, maximum+1, filtre sans résultat, changement de sous-thème, banque indisponible : états contrôlés et messages clairs. |
| CASE-01 | Sous-questions d'un cas indissociables de leurs supports ; points et numéros cohérents ; tous les critères de correction et données imprimables. |
| REC-01 | Sauvegarde/réouverture des cinq types, d'une fiche mixte et d'une fiche modifiée en libre ; tester après révision de la banque et hors connexion si le comportement existant le prévoit. |
| REC-02 | Les recettes anciennes des autres domaines conservent leur contenu et correction ; rejet propre des recettes invalides et interdiction d'accès aux fiches non autorisées. |
| SEC-01 | Pas de données d'élèves, secrets, clés ni comptes EPCAS ; validation des URLs/médias et échappement des contenus importés ; contrôles d'accès côté UI et API existante. |
| PERF-01 | Chargement initial ne récupérant pas toutes les banques et médias ; tester navigation sur réseau lent, changement rapide de sous-thème, erreur de chargement, sélection volumineuse ; mesurer contre un état initial de Doc-Prof. |
| REG-01 | `npm run build`, `npm run lint`, tests existants Grammaire, contrats et impression exécutés ; aucune nouvelle erreur ni régression ; relever séparément les défauts préexistants. |

### 11.1 bis — Tests spécifiques aux deux domaines

| ID | Test / résultat attendu |
|---|---|
| AFP-01 | Vérifier exactement les 17 codes exclus ; thèmes 500 et 900 absents d'AFP ; 604, 612, 702–705, 805–807 non résolubles par URL/recette AFP. |
| AFP-02 | Vérifier la différence d'année sur 106 (CFC 1 / AFP 2), 309 (CFC 1 / AFP 2) et 613 (CFC 3 / AFP 2) ; aucune 3e année AFP. |
| AFP-03 | Fixtures de résolution : variantes absentes, égales, différentes, résumé seul, complet seul, texte vide, placeholder, pièces AFP vides, contenu en conflit ; provenance et statuts correctement calculés. |
| AFP-04 | Une unité commune approuvée CFC seulement est exclue de la vue AFP ; approbation AFP ultérieure augmente le stock AFP sans dupliquer le contenu canonique. |
| AFP-05 | Une révision AFP adaptée ne modifie ni la banque CFC ni ses snapshots ; une révision commune modifiée déclenche la revue des deux vues, sans écrasement automatique. |
| AFP-06 | Dans un même thème/sous-thème (ex. 105), les deux domaines ont des IDs distincts ; changement de domaine réinitialise les paramètres incompatibles et conserve les blocs sauvegardés. |
| AFP-07 | Tirage AFP avec filtre vide ou quota excessif : aucun repli CFC ; message explicite et capacité réelle. |
| AFP-08 | Sauvegarde et réouverture des 5 catégories dans chaque domaine ; même correction et même diplôme après mise à jour de la banque ; rejeter les recettes incohérentes domaine/diplôme/type. |
| AFP-09 | Autorisation AFP seule, CFC seule, les deux et aucune : navigation, sauvegarde, accès direct et API conformes ; aucun changement de permissions des domaines existants. |
| AFP-10 | Générer un rendu élève et corrigé pour 105 dans les deux domaines : même ergonomie, libellé de diplôme exact, pas de contenu hors programme, différences pédagogiques justifiées. |
| AFP-11 | Rapport de couverture : 143 vues de sous-module, 715 types, compteurs séparés par niveau, unités canoniques uniques et occurrences partagées réconciliées ; 23 catégories statiques manquantes recensées. |
| AFP-12 | Les PDF AFP ne contiennent pas de contenu CFC exclusif ni de mention de 3e année AFP ; les PDF CFC ne reprennent pas de variantes AFP à leur insu. |

### 11.2 Recette navigateur et impression

Reprendre les procédures et outils existants de Doc-Prof, notamment `.claude/skills/nouvel-exercice/SKILL.md`, `.claude/skills/test-impression/SKILL.md`, le README du générateur et les preuves du chantier Grammaire. Tester sur navigateur de bureau et mobile les sélecteurs, la navigation clavier, les libellés français, l'aperçu, la sauvegarde et le passage élève/corrigé. Vérifier les cinq types sur les modules pilotes, puis générer une preuve automatique de chaque entrée de catalogue publiable (au moins une fiche élève et un corrigé lorsqu'applicable). Compléter par des cas extrêmes : texte long, tableau multipage, image technique, formule, nombreux items, annexe, mode points et édition libre. Contrôler toutes les pages des preuves ciblées et tout débordement détecté automatiquement. Un PDF généré ne prouve pas à lui seul la lisibilité.

### 11.3 Validation pédagogique et définition de terminé

Pour chaque sous-module et chacune des cinq entrées :

- [ ] Intitulé, rattachement au thème, diplôme et année corrects ; variante ou héritage approuvé pour le diplôme.
- [ ] Théorie complète et résumé relus ; objectifs et glossaire couverts.
- [ ] Questions existantes recensées, reprises avec leurs corrigés ou rejet motivé ; aucune perte silencieuse.
- [ ] Vérification, maths et situations enrichies jusqu'aux cibles approuvées ou dérogation explicite.
- [ ] Tous les calculs, critères de réponses ouvertes, supports et sources contrôlés ; règles métier sensibles vérifiées.
- [ ] Aucune question redondante ou hors sujet comptée artificiellement dans les quotas.
- [ ] Droits de réutilisation et de publication confirmés, médias accessibles et données fictives ou autorisées.
- [ ] Tirage reproductible, fiche et corrigé cohérents, édition et sauvegarde fonctionnelles, impression sans débordement.
- [ ] Revue formateur nominative/datée ou identifiant de validation, révision et preuves enregistrées.

Critère global : 80 sous-modules CFC sur 80 et 63 sous-modules AFP sur 63 couverts, 715 entrées de catalogue présentes, tous les contenus applicables approuvés et utilisables ; chaque exception justifiée et acceptée par le responsable. Les statuts « importé », « relu » et « approuvé » restent distincts. Un simple menu complet ou une banque générée automatiquement ne constitue pas une livraison pédagogique complète.

## 12. Maintenance, gouvernance et décisions à confirmer

### 12.1 Gouvernance des contenus

Conserver le SHA source et les révisions de banque ; un import ultérieur produit un diff (ajouts, modifications, suppressions, corrections concurrentes). Ne jamais écraser une banque validée sans revue ; une suppression amont est une proposition de retrait, pas une suppression automatique des fiches enregistrées. Maintenir un registre des erreurs et des corrections avec leur impact. Les questions originales Doc-Prof ont leur propre provenance et sont séparées des contenus importés. Pour les obligations légales, normes techniques, prescriptions de sécurité et logiciels évolutifs : conserver source/date/version, vérifier auprès de références compétentes et revalider quand le contenu évolue. Ne pas présenter les exemples fictifs comme des données réelles.

Le caractère public des dépôts ne suffit pas à autoriser la redistribution des contenus EnterSite/ASFL-SVBL et des illustrations. Valider les droits de reproduction et d'adaptation, notamment pour les documents imprimés et les médias servis publiquement. Si les droits ne sont pas établis, garder le contenu bloqué, demander une autorisation ou rédiger une ressource originale qui n'en reproduit pas l'expression protégée.

### 12.2 Tableau de pilotage éditorial

Produire un fichier de suivi (JSON/CSV et résumé Markdown) avec : thème, code, année, type, SHA source, statut théorie/résumé, nombre original, nombre importé, nombre corrigé, nombre bloqué, nombre ajouté, nombre approuvé, cible, déficit, objectifs non couverts, média manquant, responsable, dernière revue et lien vers les preuves. Compteurs déduits des banques, pas d'estimations présentées comme réalisées. Publier par lots approuvés, sans supprimer le catalogue des sous-modules en attente.

### 12.3 Décisions proposées (à valider, non bloquantes pour documenter)

| Sujet | Proposition retenue |
|---|---|
| Noms des domaines | « Logistique CFC » (`logistique-cfc`) et « Logistique AFP » (`logistique-afp`), distincts dans le sélecteur. |
| Périmètre ICT | Théorie et exercices papier 801–809 CFC ; 801–804 et 808–809 AFP ; fichiers pratiques Office et vidéos exclus. |
| Quantités | 50 vérifications + 30 maths + 20 situations par sous-module, avec dérogation pédagogique pour les cas peu quantitatifs. |
| Difficulté | Facile, moyen, avancé ; année facultative comme filtre de catalogue ; aucun niveau FLE. |
| Accès | Pilote admin, puis autorisations selon le système Doc-Prof existant. |
| Glossaire | Fiche de référence et option d'entraînement dans le même type. |
| Origine | Git comme référence initiale ; compléter par export pédagogique CFC/AFP autorisé uniquement si fourni. |
| Validation | Revue pédagogique avant mise à disposition ; publication progressive par lots avec état visible. |

### 12.4 Hors livraison de ce document

Ce cahier des charges repose sur l'inspection des fichiers Git indiqués au §2. Il n'a pas exécuté les générateurs ni évalué individuellement toutes les réponses. Les banques cloud et les variantes AFP enregistrées uniquement en production n’ont pas été consultées. Le fichier Git statique prévoit l’héritage mais ne contient pas de champs AFP spécifiques renseignés dans son constructeur. La couverture AFP définitive reste donc conditionnée à la validation du contenu commun et à la récupération des variantes autorisées éventuelles. Les axes de rédaction, objectifs de volume, accès pilote et règles de publication proposés doivent être confirmés. Aucun code n'a été modifié, aucune banque n'a été enrichie ou approuvée à ce stade. La réalisation commence par L0 puis L1 ; ne pas présenter la migration comme accomplie.


## 13. Consignes de réalisation à transmettre à Codex / agent de développement

Ce document est le cahier des charges de référence, à placer dans `docs/logistique/cahier-des-charges.md`. Lire les conventions du dépôt cible (`CLAUDE.md`, skills locaux, tests existants) avant de choisir les points d'intégration. Travailler sur une branche dédiée, avec commits réversibles, changements limités au périmètre, pull request et preuves. Utiliser le dépôt EPCAS en lecture seule. Ne pas exécuter de scripts source non inspectés, copier de secrets ou transférer de comptes.

**Mission :** intégrer deux domaines Logistique CFC et Logistique AFP dans Doc-Prof, au même niveau que Grammaire. Respecter la matrice de 80 codes dont 63 communs et 17 exclusifs CFC. Chaque sous-module éligible présente exactement les cinq types dans l'ordre imposé. Réutiliser l'interface, le moteur, les rendus, la sauvegarde et l'impression ; ne pas créer deux applications ni deux moteurs. Les contenus CFC et AFP doivent être résolus, contrôlés, enrichis, versionnés et approuvés séparément, avec partage canonique des unités identiques. Réaliser le pilote 105 dans les deux domaines, puis généraliser. Respecter les cibles de 50 vérifications, 30 problèmes distincts et 20 situations par sous-module et diplôme, sauf dérogation validée. Réutiliser toutes les questions exploitables existantes avec leurs corrigés, sans doublons ni perte d'information. Le volume nominal est de 14 300 occurrences, pas 14 300 contenus nécessairement distincts. Ne jamais déclarer un lot terminé si une banque manque de corrigés, une éligibilité est incertaine ou la validation formateur est absente.

**Contrat de compte rendu à chaque lot :** commit de référence, fichiers modifiés, contenus importés, originaux conservés, corrigés rectifiés, créations, partages, adaptations, approbations par diplôme, déficits, cas bloqués, commandes de test et résultats, captures/PDF et prochaines dépendances. Présenter séparément les tests techniques, les relectures pédagogiques automatiques et la validation enseignante. Si une source autorisée ou une décision pédagogique manque, documenter le blocage et poursuivre uniquement les travaux qui n'en dépendent pas. Ne pas générer de fausse donnée officielle ni réduire le périmètre sans l'indiquer.

**Définition de la livraison :** deux domaines accessibles selon droits, 16 thèmes de catalogue, 143 sous-thèmes de catalogue et 715 types, les cinq catégories exploitables pour chaque entrée applicable, fiches élève/corrigé déterministes et sauvegardables, couverture par notion et par diplôme, documentation et preuve de non-régression. La réception finale est conditionnée aux approbations et droits requis, non à un simple nombre de fichiers créés.

## 14. Historique de version

- V1.0 : cahier initial CFC transmis par le responsable du projet.
- V2.0 : consolidation des exigences précédentes et extension intégrale AFP ; distinction des catalogues, années et droits, inventaire des 63 codes AFP, matrice enrichie pour les 80 codes, résolution des variantes et héritages, dimensionnement, différenciation, modèle partagé et tests croisés. Les quotas, formats optionnels (aide-mémoire, théorie à compléter, cartes), répartition Bloom, scénario pilote et personnalisation EPCA sont des décisions proposées à confirmer. Aucun code des dépôts n'a été modifié dans le cadre de cette rédaction.
