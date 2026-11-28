# Cahier des charges — Logistique CFC et Logistique AFP dans Doc-Prof

**Version 2.14 — 28 novembre 2026**
**Produit cible :** [Doc-Prof / ClairFLE](https://github.com/oasi-phuoc/doc-prof)
**Source pédagogique :** [EPCAS Logistique](https://github.com/oasi-phuoc/epcas) — contenus pédagogiques originaux de l’auteur du projet ; EnterSite est une entreprise fictive créée pour enseigner la logistique, parcours CFC et AFP.
**Statut :** spécification de réalisation ; les contenus exploitables sont activés après relecture de réalisation selon le §0. Ce document ne constitue ni une migration déjà exécutée, ni une validation des banques, ni une modification des dépôts.

## 0. Cadrage d’implémentation — reprise depuis le générateur commun

Les décisions de reprise du 26 novembre 2026 priment sur les exemples et propositions incompatibles des sections suivantes. Les deux domaines alimentent le générateur Doc-Prof existant. La structure des fiches et l’interface sont celles de la révision de départ `0a23f9287` : mêmes composants, emplacement des contrôles, composition des feuilles et activités, aperçu A4, en-tête et pied communs, édition, enregistrement et impression. Les sélecteurs existants affichent les valeurs du catalogue Logistique. Les variations visibles dans la fiche portent sur les données, dont le titre, les énoncés, les corrections, les illustrations et les champs institutionnels prévus par le gabarit.

| Sujet | Décision applicable à la reprise |
|---|---|
| État initial | La révision de départ contenait les deux domaines vides et leur logo. L’import de 2 013 unités et les composants cités au §2.5 ne figurent pas dans ce checkout. Les chiffres du §2.5 sont historiques et doivent être recalculés. La bifurcation provisoire, les autorisations spécifiques et les tests de cet écran sont retirés avant le raccordement. |
| Catalogue | Relever les codes, titres et années du commit EPCAS `ac2ceeae3ba7944fb4d24a7de103d41d3da98e1f`. Vérifier 9/7 thèmes, 80/63 modules et six types par module, soit 858 entrées Doc-Prof. La présence au catalogue et la disponibilité à la génération sont deux conditions indépendantes. Une banque indisponible ne génère aucun exemple de substitution. |
| Droits et validation | Le responsable demande l’activation directe après la relecture de réalisation. Aucun accord pédagogique supplémentaire ne bloque les unités exploitables. Le réalisateur vérifie la cohérence du contenu et du corrigé, attribue par unité les diplômes éligibles et active la révision. Le responsable peut corriger la banque ensuite. Les unités effectivement manquantes, dépendantes d’un support indisponible ou dont le corrigé reste indéterminé sont identifiées avec leur motif. Les tests isolés continuent d’utiliser des données de test. |
| Contrat de rendu | Adapter les objets métier vers les éléments de fiche déjà pris en charge par `buildPage`, `WorksheetSheet` et `ItemView`. Un format est recevable quand son énoncé et son corrigé tiennent dans le gabarit commun. Les formats qui exigent une nouvelle interface restent en attente d’un arbitrage de périmètre. |
| Objectifs et aperçu | Présenter les objectifs et l’aperçu dans un type de fiche de lecture placé avant Théorie dans le sélecteur existant. Retirer les mentions de source de l’aperçu imprimé et garder la provenance dans le dossier éditorial. Appliquer aux modules déjà actifs et à chaque nouvelle publication. |
| Illustration et composition | Concevoir les visuels à partir des passages à expliquer, les légender et régler la composition de la fiche dans le même lot. Enchaîner les questions d’un exercice, en gardant les énoncés et zones de réponse ensemble. Utiliser la place disponible avant de continuer sur la page suivante, avec une numérotation continue et la réserve prévue au §8.5. |
| Évaluation et Libre | Les modes, gestes et réglages déjà disponibles sont la référence de la première livraison. Les demandes V2.9 de sélection multiple, de sélection en banque, de scénario adaptatif et de nouveaux outils d’édition restent des besoins à tracer. Leur réalisation est conditionnée à leur compatibilité avec les contrôles existants ou à une décision explicite sur l’extension de l’interface. |
| Pagination et sauvegarde | Conserver le format physique et les chemins communs de sauvegarde et d’impression. Tester les cas limites avec contenus longs, corrigés et sauts existants. La réserve de 25 px du §8.5 est un critère de réception pour la logistique. Les changements nécessaires au moteur de pagination doivent être mesurés et soumis à un contrôle A4 des domaines existants. |
| Élargissement | Mettre en service les unités exploitables au fil des lots. Commencer par 105 dans les deux diplômes. Les cibles de banque sont calculées sur les unités distinctes éligibles, après déduplication et relecture. Le [suivi d’avancement](avancement-cahier-des-charges-20261126.md) indique à chaque lot la couverture, la révision, les preuves et le travail restant. |

La v2.13 précise la présentation de la théorie. Dans ce type, le réglage des colonnes cède la place au choix **Complet** ou **Résumé**. Le résumé suit les notions et les termes techniques du cours complet. Il reformule pour les 15–21 ans, explique les gestes par des exemples concrets et conserve les conditions d’application, les dimensions et les consignes de sécurité.

Reprendre chacun des 80 modules chapitre par chapitre. Insérer les images en couleur, les mises en scène et les schémas à côté des notions qu’ils expliquent. Donner une légende qui indique quoi observer et reprendre les repères utiles dans le résumé. Pour les objets d’une même famille, adopter un angle et une lumière comparables. Comparer notamment les formats EUR et CHEP et les engins de manutention. Dans le 101, présenter Chasser, Transformer et Consommer en trois cases légendées. Illustrer les pyramides de Gizeh, les routes de l’ambre et de la soie, le ravitaillement des armées napoléoniennes et les repères datés, puis montrer l’évolution du registre papier au suivi informatisé. Identifier les reconstitutions historiques comme telles. Vérifier l’aperçu et le PDF de chaque version publiée.

Le texte source reste archivé au commit EPCAS fixé. Les corrections linguistiques, les corrections métier identifiées et les exclusions d’items sont consignées avec le contenu d’origine. Les générateurs de révisions maintiennent la séparation AFP/CFC. Cette décision remplace les clauses antérieures d’attente d’accord pédagogique externe et autorise la résolution documentée des anomalies de fond constatées pendant la relecture.

La preuve du pilote comprend le parcours de génération commun, les sorties élève et corrigé, la grille de calcul et son trait de réponse, le retour d’une recette enregistrée, les droits distincts des deux diplômes et une comparaison du gabarit avec un domaine existant. Le franchissement de cette étape technique et l’autorisation de diffuser les contenus sont suivis dans le README du lot.

## 1. Objectif et décisions de périmètre

Créer dans Doc-Prof deux domaines distincts, **Logistique CFC** et **Logistique AFP**, sur le modèle exact de la navigation et du générateur de Grammaire : Domaine → Thème → Sous-thème → Type. Le produit final est une fiche pédagogique imprimable, et non une plateforme d'apprentissage en ligne. Le formateur sélectionne un sous-module, configure sa fiche, la prévisualise, la modifie si nécessaire, la sauvegarde et imprime la fiche élève et, pour les exercices, son corrigé.

| ID | Exigence |
|---|---|
| PER-01 | Formation suisse de logisticien·ne CFC (années 1 à 3) et AFP (années 1 à 2), en français. Reprendre les 80 codes CFC et les 63 codes AFP selon leur éligibilité réelle, y compris les contenus communs. Deux domaines au même niveau que Grammaire, jamais un seul domaine avec un filtre diplôme obligatoire. |
| PER-02 | CFC : `contentFull`, `contentSummary`. AFP : variantes `contentFullAfp`, `contentSummaryAfp` lorsqu’elles existent ; à défaut, contenu commun explicitement hérité et validé pour AFP. Respecter le niveau de chaque question structurée. Pas de copie automatique de tous les exercices CFC vers AFP. |
| PER-03 | Six types par sous-thème dans cet ordre. Objectifs et aperçu, Théorie, Mathématiques, Vérification des connaissances, Mises en situation, Glossaires. |
| PER-04 | Importer fidèlement les cours complets, objectifs, aperçus et toutes les questions CFC et AFP existantes exploitables avec leurs corrigés. Archiver les anciens glossaires comme références et reconstruire intégralement les glossaires pédagogiques (§5.5). Compléter les banques d’exercices sans écraser les sources. |
| PER-05 | Réutiliser le design, les contrôles, les gabarits, l'aperçu A4, l'éditeur libre et la sauvegarde de Doc-Prof ; aucune application séparée. |
| PER-06 | Exclure les comptes EPCAS, classes, données personnelles, progression, notes, évaluations à blanc en ligne, suivi, PWA, Supabase et API de synchronisation EPCAS. Aucun espace apprenti, aucun mode interactif au tableau à développer pour cette livraison. |
| PER-07 | Inclure les connaissances théoriques ICT 801–809 en CFC et 801–804, 808–809 en AFP. Exclure la banque spécifique d'exercices Office pratiques, fichiers Word/Excel natifs et vidéos de correction ; seuls des exercices imprimables de connaissances ou de raisonnement numérique sont prévus. |
| PER-08 | Ne pas changer le comportement des autres domaines, des recettes existantes, des comptes ou des banques de Grammaire. Pas d'appel à EPCAS en production. |

Les objectifs, quotas, filtres de difficulté, politique d'accès et découpage en lots proposés plus loin sont des choix de conception à valider, non des règles officielles des diplômes. Si une question dépasse les connaissances du sous-module, la réviser ou la déplacer explicitement plutôt que la publier sous un mauvais code.

| ID | Exigence complémentaire |
|---|---|
| PER-09 | Les deux domaines utilisent un moteur commun, des banques versionnées et des identifiants distincts. Une unité commune n'est stockée qu'une fois lorsque texte, correction, droits et niveau d'exigence sont identiques. Une adaptation AFP est une unité dérivée, validée séparément. |
| PER-10 | Le périmètre reste la création de fiches papier/PDF et de corrigés. Les scénarios professionnels sont des exercices sur papier et ne remplacent ni la formation pratique supervisée ni les prescriptions de sécurité. |
| PER-11 | **Impératif :** CFC et AFP sont deux domaines ordinaires du générateur actuel, exactement comme les autres domaines ajoutés précédemment. Même page, même structure de paramètres d’activité, mêmes composants, mêmes modes Exercice/Évaluation, mode Libre, feuilles, blocs, aperçu, impression et sauvegarde. Aucun écran, panneau autonome, moteur de rendu, barre d’outils ou gabarit A4 parallèle. |
| PER-12 | En mode Évaluation, sélectionner plusieurs sous-thèmes simultanément (101 + 102 + autres, y compris d’autres thèmes du même diplôme), puis tirer des questions de leurs banques combinées ou fixer une quantité par sous-thème. |
| PER-13 | En mode Libre, ajouter des lots de questions par type et sous-thème(s), choisir directement chaque question de banque, combiner les deux méthodes, ordonner et modifier localement les exercices, sans changer de page ni perdre le corrigé. |
| PER-14 | Textes à compléter : deux présentations, écriture inline sans liste ou écriture inline avec banque de mots et leurres facultatifs. Questions compatibles : trois présentations (QCM, lignes de réponse numérotées, lignes de réponse simples). Maths : grille de calcul existante et trait de réponse obligatoires. |
| PER-15 | Seul l’en-tête de la fiche imprimable change de marque : logo EPCA en lieu et place du logo État du Valais et « Logistique CFC » ou « Logistique AFP » en lieu et place de « Classe d’accueil ». Barre d’application, logo ClairFLE, style de paramétrage et reste du gabarit commun inchangés. |
| PER-16 | Le mode Libre des deux domaines permet de créer une question locale de toutes pièces, d’éditer librement chaque énoncé et chaque corrigé (et les données propres à son format), de conserver ou restaurer l’original et de prévisualiser le résultat dans la fiche existante. Les modifications sont propres à la fiche ; aucune mutation implicite des banques. |
| PER-17 | Toute question, problème ou sous-question pertinente peut recevoir facultativement une ou plusieurs illustrations locales ou issues des ressources autorisées, via les mécanismes d’édition et de média existants. Ajouter, remplacer, redimensionner, positionner et retirer les images sans changer de gabarit ; conserver images, réglages et corrections lors de l’impression et de la réouverture. |


| ID | Exigence complémentaire V2.3 |
|---|---|
| PER-18 | Étendre le catalogue interne des formats de question aux tableaux de données et de dates à compléter, aux associations image–terme et image–définition, à l’identification et à la description écrite d’images, aux schémas et documents à annoter et aux autres formats du §5.2 ter. Ces formats sont accessibles dans les activités pertinentes et dans le panneau Libre existant, jamais comme nouveaux types principaux ou nouvelle page. |
| PER-19 | Chaque format possède un contrat de données, un corrigé, un rendu élève/corrigé, des réglages de mise en page, un comptage des unités et des points, des possibilités d’édition individuelle et de sauvegarde. Les formats incompatibles avec une unité ou le diplôme ne sont pas proposés pour cette unité. |

| ID | Exigence complémentaire V2.4 |
|---|---|
| PER-20 | **Obligation éditoriale pour chaque sous-module et chaque diplôme :** le résumé est une réécriture pédagogique à partir de la théorie complète de référence, et non la simple reprise du champ résumé EPCAS. Il couvre toutes les notions et tous les termes techniques essentiels du cours applicable au diplôme. |
| PER-21 | Les résumés s’adressent à des jeunes de 15 à 18 ans qui commencent leur premier apprentissage. Employer un français professionnel, clair, précis, accessible et non infantilisant. Garder les termes métier nécessaires ; simplifier leur explication, jamais leur sens ni le niveau de compétence attendu. |
| PER-22 | Chaque résumé fait l’objet d’un inventaire des notions essentielles et d’une matrice de correspondance avec la théorie complète, le glossaire et les exercices. Une omission essentielle, une erreur technique ou l’absence de validation bloque sa publication. La théorie complète d’origine est conservée et reste consultable indépendamment. |

| ID | Exigence complémentaire V2.5 |
|---|---|
| PER-23 | Enrichir systématiquement la théorie complète de chaque sous-module CFC et AFP avec les illustrations réellement nécessaires à la compréhension : photographies métier, dessins techniques, schémas explicatifs, représentations d’objets, séquences d’actions, graphiques, documents professionnels annotés. Créer tous les visuels pédagogiques nécessaires spécialement pour Doc-Prof ; aucune image EPCAS ou EnterSite ne doit être reprise. |
| PER-24 | Intégrer les visuels au plus près du passage expliqué, de préférence dans un encadré pédagogique légendé ; adapter la disposition à l’image et au contenu (pleine largeur, côte à côte, vignettes ou planche). Ne pas imposer de position ou de quantité uniforme. Réutiliser exclusivement les gabarits, composants et pagination communs de Doc-Prof ; aucune nouvelle interface ou page spécifique. |
| PER-25 | Chaque visuel est lié à une section et à une notion, avec objectif pédagogique, provenance, droits, révision et validation par diplôme. Le cours complet textuel de référence est conservé ; l’ajout d’illustrations ne doit pas supprimer des notions ou altérer les faits. Les résumés réécrits conservent les visuels essentiels à leur compréhension, selon les exigences V2.4. |

| PER-26 | EnterSite est une entreprise fictive créée par l’auteur du projet, non un éditeur ni un référentiel officiel indépendant. L’auteur confirme avoir rédigé la théorie et autorise sa reprise, son adaptation, sa synthèse et son utilisation dans Doc-Prof, ses banques et ses fiches. Consigner cette autorisation ; ne pas bloquer les textes originaux concernés pour une autorisation supplémentaire. |
| PER-27 | Aucun visuel pédagogique existant provenant d’EPCAS ou d’EnterSite ne doit être importé, copié, affiché, référencé à distance ou réutilisé dans les banques, cours, glossaires, évaluations ou corrigés. Créer une bibliothèque originale dédiée, mutualisable CFC/AFP. Les logos institutionnels déjà prévus et les ajouts locaux de l’enseignant hors images exclues ne sont pas concernés. |

| ID | Exigence impérative V2.7 |
|---|---|
| PER-28 | Théorie complète : reprendre le texte original applicable au diplôme dans son intégralité, sans enrichissement textuel, résumé, reformulation stylistique ni ajout de contenu. Relire et corriger les fautes d’orthographe, d’accord, de grammaire manifeste, de ponctuation et de typographie, sans changer le sens. Conserver les données et les termes métier. Les anomalies de fond sont signalées et soumises à validation, jamais corrigées silencieusement. |
| PER-29 | Glossaires : reconstruire entièrement les entrées de chaque sous-module CFC et AFP à partir du cours complet applicable ; les anciens glossaires ne sont que des références de contrôle. Rédiger les définitions en français professionnel clair, adapté aux apprentis de 15–18 ans. Couvrir toutes les notions et tous les termes techniques essentiels, avec exemples, synonymes ou sigles lorsque pertinents. |
| PER-30 | Les illustrations originales restent ajoutées à la théorie complète conformément à la V2.5–V2.6 ; elles sont des blocs visuels distincts du texte source corrigé, et leurs légendes ne constituent pas un enrichissement du corps rédactionnel. Le résumé et l’aide-mémoire restent des productions distinctes. |

**Règle de lecture de la version 2.7 :** elle remplace intégralement les versions 1.0, 2.0, 2.1, 2.2, 2.3, 2.4, 2.5 et 2.6 et consolide le cahier précédent. Les exigences impératives d’interface, de sélection, de formats et d’en-tête introduites en V2.1 priment sur toute proposition antérieure incompatible et sur les choix de l’implémentation provisoire. Les exigences V2.2 relatives à l’édition individuelle, aux corrections et aux illustrations complètent ces obligations sans les assouplir. Toute exigence générique est applicable aux deux domaines ; les particularités CFC et AFP sont indiquées explicitement. Les exigences V2.3 élargissent les formats par question, sans modifier les cinq types, les règles de sélection, les quotas, ni les obligations d’interface et de grille mathématique. Les exigences V2.4 rendent obligatoire la réécriture et le contrôle de couverture des résumés théoriques selon le §4, pour les deux diplômes. Elles ne réduisent pas les objectifs pédagogiques. La V2.5 impose l’enrichissement visuel raisonné du cours complet selon le §4.6–4.8, sans réduire les exigences antérieures. La V2.6 confirme l’autorisation de réutilisation et d’adaptation des textes originaux de l’auteur et interdit la reprise des images EPCAS/EnterSite ; cette décision prime sur toute formulation antérieure relative à la conservation des anciennes figures. La V2.7 impose la reprise textuelle fidèle du cours complet avec correction linguistique limitée, sans enrichissement rédactionnel, et la reconstruction intégrale des glossaires. Elle prime sur toute formulation contraire ; l’enrichissement visuel V2.5–V2.6 et la réécriture des résumés V2.4 restent obligatoires. Les objectifs chiffrés sont des cibles de réalisation, non des contenus déjà disponibles.

| ID | Exigence impérative V2.9 — conception des évaluations |
|---|---|
| PER-31 | Dans les deux domaines, privilégier la conception d'évaluations dans le générateur existant : sélection mixte (tirage automatique et choix/remplacement manuel), deux formats narratifs (histoire suivie ou questions indépendantes), barème proposé selon Bloom et estimation automatique de la durée. |
| PER-32 | En mode Histoire, contextualiser les questions dans une trame professionnelle cohérente rédigée en « vous » ; ajuster automatiquement les passages et données dépendantes après toute modification pertinente. Le mode Libre permet de modifier manuellement tous les passages, y compris après une adaptation automatique, et de protéger les modifications. |
| PER-33 | Réutiliser le système commun de sauvegarde et de modèles de fiches, sans créer de bibliothèque parallèle. Enregistrer soit une évaluation à l'identique, soit une configuration réutilisable permettant un nouveau tirage explicite. |
| PER-34 | Respecter le cahier des charges de refonte du mode Libre : aperçu actualisé sans bouton Valider, annuler/rétablir, verrouillage, récupération des brouillons, réglages pertinents uniquement. La taille de l'A4, l'identité EPCA de la fiche, les six types de catalogue et le reste de l'interface restent inchangés. |

**Règle de lecture V2.9 :** les nouvelles exigences complètent V2.8 et prévalent sur les formulations antérieures incompatibles relatives à l'ergonomie, à l'édition de scénario et à la conception d'évaluations. Aucune modification de périmètre des cours, des quotas de banques, des droits, de la pagination ou de l'exclusion des images historiques. Les choix chiffrés et mécanismes proposés au §3.11 restent ajustables.

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
| Types historiques EPCAS (5 par sous-thème) | 400 | 315 | 715 |
| Types Doc-Prof V2.12 (6 par sous-thème) | 480 | 378 | 858 |
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

### 2.5 Écart constaté dans l’implémentation en cours (25 novembre 2026)

Une nouvelle inspection en lecture seule de la branche `main` de Doc-Prof (arbre Git `a6070b6df1468e995103c434f1e85f04099b9c3d`) confirme que les deux domaines sont déjà présents. Le [README logistique](https://github.com/oasi-phuoc/doc-prof/blob/main/docs/logistique/README.md) rapporte un import éditorial de 715 emplacements, 2 013 unités canoniques, 540 pages source alimentées et 19 éléments en quarantaine, avec droits `pending` et état `imported-unreviewed` ; il ne s’agit pas de banques approuvées. Ces chiffres sont ceux du rapport du dépôt, non un nouveau comptage indépendant.

| Constat dans le code actuel | Action impérative V2.1 |
|---|---|
| [`GeneratorPage.tsx`](https://github.com/oasi-phuoc/doc-prof/blob/main/src/components/generator/GeneratorPage.tsx) conserve un état `logistiqueDomain`, `logistiqueSelection`, `logistiqueResult` et `logistiquePreviewMode` séparé et importe `LogistiqueDomainSettings`/`LogistiqueDomainResult`. | Supprimer la bifurcation de l’expérience utilisateur une fois le raccordement réalisé ; utiliser les mêmes `pages`, blocs, sélection, mode de fiche, aperçu et actions que les autres domaines. Préserver les données et les droits existants. |
| [`DomainShell.tsx`](https://github.com/oasi-phuoc/doc-prof/blob/main/src/logistique/DomainShell.tsx) crée un panneau de catalogue et de réglages spécifique. | Transférer les réglages utiles dans le panneau `SettingsPanel` / `DomainThemeTypeFields` / `QuestionsColumnsFields` commun, sans recopier les contrôles. Le catalogue logistique reste une source de données, pas un second écran. |
| [`PrintableDocument.tsx`](https://github.com/oasi-phuoc/doc-prof/blob/main/src/logistique/PrintableDocument.tsx) et `branding.css` introduisent un rendu et des règles d’impression spécifiques ; la grille de maths commune n’est pas utilisée par son rendu `calculation`. | Remplacer ce chemin par `WorksheetSheet`, les layouts et la pagination communs ; adapter les payloads en données rendables. Retirer les règles d’impression parallèles et les styles devenus inutiles après vérification de leurs usages. |
| [`Header.tsx`](https://github.com/oasi-phuoc/doc-prof/blob/main/src/components/generator/Header.tsx) substitue actuellement EPCA au logo de la barre de l’application pour les domaines logistiques. | Revenir à l’en-tête de fenêtre commun ClairFLE. EPCA doit exclusivement identifier la fiche imprimable. |
| [`PrintDocumentChrome.tsx`](https://github.com/oasi-phuoc/doc-prof/blob/main/src/components/math/PrintDocumentChrome.tsx) sait déjà choisir `EPCA_LOGO_SRC`, mais affiche `config.schoolName` tel quel. | Garder la résolution du logo et résoudre aussi le libellé imprimé selon le domaine de la feuille. Tester après changement de domaine et sauvegarde. |
| `src/math/catalog.ts` possède encore des chemins logistiques provisoires (dont un rejet du catalogue) ; `domains.ts` expose `worksheetDomainFor` avec repli vers un autre domaine. | Brancher les vrais catalogues dans le registre standard, sans repli vers Algèbre ni vers un autre domaine ; retirer les contournements obsolètes après migration et tests. |
| `src/logistique/generate.ts` résout actuellement une seule banque et le snapshot v1 contient un seul `submoduleId`/`bankRevision`. | Étendre le moteur et le snapshot pour la sélection multi-sous-thèmes et les lots, en conservant l’éligibilité, les révisions et les contrôles de droits. |
| `GenericLibreEditor.tsx` permet l’édition d’items existants, mais ne constitue pas un sélecteur de banque. | Ajouter le choix en banque au mode Libre existant et garder l’édition des items, sans page dédiée. |

Le logo local `src/assets/logos/epca.svg` existe déjà ; le README précise qu’il est une transcription du visuel fourni, et non un fichier officiel téléchargé. Réutiliser ce fichier ou le visuel EPCA fourni et validé, sans inventer un autre logo. Les fichiers métiers `catalog.ts`, `registry.ts`, `types.ts`, `generate.ts`, les scripts et données importées restent à valoriser. Ne pas supprimer ou réimporter le contenu éditorial pour résoudre un problème d’interface. Vérifier l’état réel de la branche de travail avant de modifier ces points ; les constats ci-dessus sont un état du code consulté, pas une recette exécutée.

## 3. Catalogue et expérience formateur

### 3.1 Correspondance des entités

| EPCAS | Doc-Prof | Identifiant cible (exemple) |
|---|---|---|
| `curriculumBlocks`, `block-100` | Thème : 100 — Foundation | `log-cfc-theme-100` |
| `Module`, `mod-101` | Sous-thème : 101 — Histoire de la logistique | `log-cfc-sub-101` |
| `objectifs-apercu` | Objectifs et aperçu | `log-cfc-101-objectifs-apercu` |
| `theorie` | Théorie | `log-cfc-101-theorie` |
| `maths` | Mathématiques | `log-cfc-101-maths` |
| `verification` | Vérification des connaissances | `log-cfc-101-verification` |
| `situation` | Mises en situation | `log-cfc-101-situation` |
| `glossaire` | Glossaires | `log-cfc-101-glossaire` |

Les identifiants sont stables, indépendants des libellés et uniques dans tous les domaines. Les codes numériques et les intitulés EPCAS restent affichés ; les thèmes sont classés de 100 à 900, les sous-thèmes par ordre du référentiel. L'année CFC est une métadonnée/facultativement un filtre, jamais un niveau A1/A2/B1 ni une seconde arborescence. Afficher les 80 sous-thèmes CFC ou les 63 sous-thèmes AFP selon le domaine choisi, sans filtre d’année par défaut. L’année AFP est 1 ou 2 uniquement ; le même code peut relever d’une autre année en CFC.

**Identifiants AFP et séparation des domaines.** Le préfixe `log-afp-` reproduit la convention `log-cfc-` (ex. `log-afp-theme-100`, `log-afp-sub-105`, `log-afp-105-maths`). Les six types ont exactement les mêmes libellés et le même ordre dans les deux domaines. Le code source `mod-105` est commun, mais les IDs de catalogue, les recettes et les vues d'éligibilité sont propres au diplôme. Les entrées AFP inexistantes ne doivent pas pouvoir être résolues par URL, recette, API ou édition manuelle.

```text
Domaine : Logistique CFC (logistique-cfc)
  100 – Foundation
    105 – Marchandises
      Objectifs et aperçu | Théorie | Mathématiques | Vérification des connaissances | Mises en situation | Glossaires
  ... 9 thèmes / 80 sous-thèmes
Domaine : Logistique AFP (logistique-afp)
  100 – Foundation
    105 – Marchandises
      Objectifs et aperçu | Théorie | Mathématiques | Vérification des connaissances | Mises en situation | Glossaires
  ... 7 thèmes / 63 sous-thèmes
```

### 3.2 Parcours de génération (même ergonomie que Grammaire)

1. Ouvrir le générateur existant et choisir le domaine « Logistique CFC » ou « Logistique AFP ».
2. Choisir le thème, puis un sous-thème du thème actif, puis l’un des six types.
3. Afficher les réglages pertinents au type ; masquer ceux de Grammaire, FLE, TCF, audio, jeux et tableau qui ne sont pas applicables.
4. Configurer, générer, prévisualiser la fiche élève et basculer sur le corrigé lorsque pertinent.
5. Utiliser les contrôles existants pour les feuilles, blocs, en-tête, pied, police, colonnes, espace de rédaction, édition libre, impression et sauvegarde.
6. Régénérer un bloc ou une fiche avec une nouvelle graine ; sauvegarder la sélection et ses données pour que la réouverture soit fidèle.

Règles UI : le changement de thème choisit un sous-thème valide et conserve le type si disponible ; le changement de sous-thème conserve le type, remet à zéro une sélection de questions incompatible et plafonne la quantité. Le passage au type suivant reste dans le sous-thème. Les options indisponibles restent identifiables mais désactivées avec une raison claire (« contenu à valider », « banque en cours de rédaction »). Aucun placeholder ne peut être généré comme cours validé. Un changement de filtre qui invalide un bloc existant demande une confirmation si des modifications libres seraient perdues.

### 3.3 Réglages par type

| Type | Réglages spécifiques | Sortie |
|---|---|---|
| Objectifs et aperçu | Lecture du module | Objectifs et aperçu sans mention de source imprimée |
| Théorie | Complet ou Résumé pédagogique retravaillé. Exemples, figures et tableaux placés au passage concerné. | Document structuré, sans double corrigé ; le résumé approuvé couvre toutes les notions essentielles de la théorie complète |
| Mathématiques | Quantité, difficulté, familles de calcul, source originale/nouvelle/toutes, espace de calcul, points (facultatif) | Problèmes + corrigé détaillé |
| Vérification | Quantité, difficulté, formes de questions, niveau de Bloom, notions, source, espace de réponse, mélange des options | Questions + corrigé correspondant |
| Mises en situation | Nombre de cas, difficulté, thèmes de cas, documents supports, espace de rédaction | Cas et sous-questions + grille de correction |
| Glossaires | Tous les termes / sélection ; ordre alphabétique / pédagogique ; affichage des exemples ; versions à compléter, associations et cartes imprimables si compatibles | Fiche terme-définition ; corrigé seulement si version à compléter |

Valeurs initiales proposées : 10 questions de vérification, 6 problèmes de maths et 2 cas ; toujours adaptées au stock éligible. Aucune limite fictive, aucun recyclage silencieux d'items. La quantité en situation compte les cas (non les sous-questions). Le mode « tous » de théorie et glossaire n'utilise pas de tirage. Aucun générateur d'IA à la volée : les exercices sont issus de banques versionnées ou de gabarits numériques déterministes validés.

### 3.4 Changement de domaine et composition de fiches

- Conserver les préférences de présentation compatibles lors du passage AFP/CFC (police, marges, orientation, pied et champs d’en-tête non imposés). Résoudre automatiquement le logo et le nom d’établissement d’après le diplôme de la fiche, conformément au §8.4. Recalculer la liste des thèmes, sous-thèmes, types, filtres et quantités. Une sélection devenue invalide est remplacée par la première option valide ou laissée vide avec explication ; aucun bloc existant n'est converti en silence.
- Une fiche peut combiner plusieurs blocs et sous-thèmes du **même diplôme**, par exemple théorie 105, vérification 105, maths 105 et situation 303. Réutiliser les onglets et la structure multi-blocs existants ; préserver les identités de chaque bloc. En évaluation et en mode Libre, la sélection multi-sous-thèmes décrite ci-dessous est obligatoire. Maintenir les documents AFP et CFC séparés pour cette livraison afin de garantir un en-tête univoque et des banques éligibles ; aucun mélange automatique des diplômes.
- Ajouter une configuration de départ réutilisable « Révision professionnelle » : 3 QCM à 4 propositions, 3 calculs de difficultés croissantes et 15 questions ouvertes, sous réserve du stock filtré. Cette configuration compose des blocs existants ; ce n'est ni un sixième type ni un module de gestion d'examens.
- Afficher des compteurs réels par banque : disponibles, sélectionnés, difficulté, provenance (origine, nouvelle, commune, adaptée). Si un filtre n'a pas de résultat, expliquer pourquoi et proposer de modifier le filtre.
- Le logo EPCA et la mention « Logistique CFC » ou « Logistique AFP » sont imposés automatiquement dans l’en-tête de la **fiche**, y compris le corrigé. Conserver les couleurs, la typographie et l’identité de la fenêtre du générateur. Conserver le gabarit et les champs nom, prénom, classe, date existants ; aucune collecte de données élèves supplémentaire. Voir §8.4.

### 3.5 Maintien strict du générateur et du paramétrage d’activité actuels

**Cette section est une exigence de réception, pas une simple recommandation graphique.** Le changement de domaine doit être aussi naturel que le passage de Grammaire à Mathématiques ou TCF. Il ne doit pas donner l’impression d’entrer dans une autre application.

| ID | Exigence impérative |
|---|---|
| UI-01 | Conserver la page `/generateur` et le shell habituel : barre supérieure, panneau latéral de paramètres, onglets feuilles/activités, aperçu A4, panneau Libre, actions et réglages habituels. Aucun écran « Catalogue logistique » autonome ni nouvelle route. |
| UI-02 | Réutiliser `SelectBox`, les contrôles de quantité, difficulté, colonnes, points, formats de réponse et styles de paramètres existants. Les champs logistiques s’insèrent dans les mêmes groupes et au même niveau hiérarchique. Aucun jeu de boutons ou de cartes spécifique pour remplacer le sélecteur de type. |
| UI-03 | Le domaine actif est `activePage.domain` ou son équivalent canonique ; aucune sélection de domaine parallèle qui maintient une autre fiche active en arrière-plan. Le type actif appartient à un `ExerciseBlock` normal. Les onglets feuille/activité fonctionnent pour les deux domaines. |
| UI-04 | Conserver le sélecteur « Mode de la fiche : Exercice / Évaluation » et le mode Libre existant ; le Libre n’est pas un troisième mode d’évaluation ni un sixième type. Le mode Évaluation continue de gérer titre, points, nombre d’items et total par document. |
| UI-05 | Conserver les fonctionnalités communes applicables : ajouter, dupliquer, déplacer, supprimer une activité/feuille, générer, régénérer, aperçu élève/corrigé, impression, PDF, enregistrement, réouverture, édition libre, en-tête/pied, mise en page. Toute option non pertinente est masquée comme pour les autres domaines ; ne pas masquer les fonctionnalités communes simplement parce que le domaine est logistique. |
| UI-06 | Aucun changement de marque de la barre supérieure ni des couleurs d’interface du fait du diplôme. Aucun CSS d’impression autonome. Le logo EPCA appartient exclusivement au document imprimé et à son aperçu. |
| UI-07 | Un contenu indisponible est indiqué via les messages et états existants ; le compteur affiche les unités réellement autorisées et approuvées. Aucun contournement des validations pour permettre une démonstration sur des données non approuvées. Utiliser des fixtures originales de test. |

Réutiliser le style actuel plutôt que refaire visuellement à l’identique dans des composants distincts. Une extension interne d’un composant commun est acceptable ; une page ou un panneau de résultat entièrement distinct ne l’est pas. La responsabilité métier de sélection et d’adaptation des unités peut rester dans `src/logistique/`.

### 3.6 Mode Évaluation : sélection multi-sous-thèmes dans une même activité

**EVAL-01 — Sélection.** Lorsque l’enseignant active Évaluation dans Logistique AFP ou CFC, le champ Sous-thème du paramétrage d’activité accepte une sélection multiple. Le thème sert de filtre de navigation ; changer de thème ne supprime pas les sous-thèmes déjà cochés. Afficher les codes et libellés des éléments retenus, permettre retrait individuel et effacement explicite. Prévoir le choix de tous les sous-thèmes éligibles du thème courant (pas de sélection implicite de tout le programme). En Exercice ordinaire, conserver le comportement de sélection simple existant ; le mode Libre reste capable d’ajouter des activités issues de plusieurs sous-thèmes. Les six types sont identiques en CFC et AFP.

**EVAL-02 — Banque combinée.** Pour un type sélectionné, réunir les banques correspondant aux sous-thèmes retenus, au diplôme et aux filtres (difficulté, notions, forme, provenance). Calculer la capacité sur les IDs canoniques uniques éligibles ; une question commune associée à plusieurs sous-thèmes ne doit pas être tirée deux fois. Conserver son rattachement et les révisions. Les questions et corrigés des différents sous-modules peuvent ainsi être tirés dans une seule activité, sans devoir créer manuellement une activité par sous-module.

**EVAL-03 — Répartition des quantités.** Par défaut proposé : quantité totale, tirage sans remise dans la banque combinée. Proposer également une quantité explicite par sous-thème pour garantir une couverture déterminée ; une répartition équilibrée peut être proposée dans les limites du stock. L’enseignant sait si « 10 questions » signifie 10 au total ou 10 dans chaque module. Ne jamais appliquer la multiplication en silence. La répartition par sous-thème n’ajoute pas de nouvelle page et utilise les contrôles existants du panneau. Conserver le choix et les quantités dans la recette.

| Configuration exemple | Résultat attendu |
|---|---|
| CFC, 101 + 102, Vérification, 10 au total | Une activité de 10 questions différentes issues de la banque combinée, selon les filtres. |
| AFP, 101 + 102, Vérification, 5 + 5 | Exactement 5 questions éligibles AFP du 101 et 5 du 102, si le stock le permet. |
| CFC, 101 + 102 + 105 + 308, Mathématiques, 3 au total | Trois problèmes issus de l’ensemble autorisé, tous avec grille et trait de réponse. |
| AFP, tentative de sélectionner 501 ou une question CFC exclusive | Sélection impossible ; rejet également au niveau moteur/recette, pas seulement dans l’interface. |
| 101 contient 3 questions, 102 en contient 12, demande de 5 + 5 | Signaler le manque de 2 dans 101 ; laisser l’enseignant ajuster. Ne pas transférer automatiquement le déficit sur 102 en mode quotas explicites. |

**EVAL-04 — Composition multi-types.** Dans le document existant, ajouter une activité « Vérification » de 10 questions 101/102, une activité « Mathématiques » de 3 problèmes 105/308 et une activité « Mises en situation » d’un cas. Les paramètres sont propres à chaque activité ; modifier la sélection du bloc actif ne change pas les autres. Les cas restent liés à leurs sous-questions et supports. Le format d’évaluation et le total de points restent ceux du moteur commun. La numérotation suit les conventions de la fiche actuelle, sans recommencer artificiellement à chaque changement de module. Le code source de chaque unité est toujours conservé ; son affichage sur la fiche élève reste facultatif, pour éviter de révéler une réponse.

**EVAL-05 — Cas limites.** Tester sélection vide, module sans banque, filtre sans résultat, banque partiellement disponible, module de plusieurs thèmes, retrait d’un sous-thème, retour Exercice/Évaluation, changement AFP/CFC, droits insuffisants et double ajout. Le retrait d’un sous-thème ne réécrit pas silencieusement une fiche déjà générée : informer de l’écart entre configuration et contenu et appliquer les règles existantes de régénération/confirmation. Un document sauvegardé doit conserver précisément le tirage et les points d’origine.

### 3.7 Mode Libre : composition depuis les banques et choix individuel

Le mode Libre doit conserver son emplacement, son panneau, ses contrôles et ses possibilités d’édition actuels (`LibreSidePanel`, `GenericLibreEditor`, contrôles par activité). Le compléter pour les deux domaines, sans ouvrir un écran de composition autonome. La banque de questions est la source des éléments ajoutés, les éléments présents sur la fiche constituent la sélection éditable.

| ID | Fonction attendue |
|---|---|
| LIB-01 | **Ajout par lot :** choisir le type (Vérification, Mathématiques, Mises en situation, éventuellement glossaire/théorie), un ou plusieurs sous-thèmes, les filtres, puis une quantité totale ou par sous-thème ; ajouter les items au bloc sélectionné s’il est compatible, sinon créer une activité normale du type correspondant. Ajouter 10 questions du 101/102 puis 3 maths doit être possible sans quitter le mode Libre. |
| LIB-02 | **Choix individuel :** parcourir et rechercher les questions disponibles (code, titre, mots de l’énoncé, type, difficulté). Afficher énoncé, provenance/module, format et éventuelle référence de support ; permettre de consulter le corrigé dans le panneau enseignant. Cocher une ou plusieurs unités, ajouter au document et visualiser l’état sélectionné. Choisir une question précise n’implique aucun tirage aléatoire. |
| LIB-03 | **Combinaison :** mélanger lots et questions manuelles dans une même activité compatible et dans un document multi-activités. Conserver l’ordre d’insertion ou le modifier via les mécanismes existants ; retirer, remplacer, déplacer et dupliquer une activité/feuille selon les règles communes. L’ajout ne remplace jamais le contenu existant sans action explicite. |
| LIB-04 | Prévenir les doublons : exclure les IDs déjà retenus du tirage suivant par défaut, signaler les doublons inter-modules et distinguer les instances d’un gabarit numérique. Une réutilisation volontaire doit être explicite et ne pas augmenter les compteurs éditoriaux. |
| LIB-05 | Autoriser l’édition locale habituelle de la consigne, de l’énoncé, de la correction, des options, des lignes et des points ; pour un calcul, toute modification des données exige de revoir le résultat ; pour un texte à trous, maintenir la correspondance des trous et solutions. Un changement local ne modifie jamais la banque canonique. Conserver l’original et la version locale dans le snapshot. |
| LIB-06 | Une question manuelle peut être verrouillée contre la régénération du lot ; régénérer les unités tirées ne supprime pas les questions choisies à la main. Prévoir une action explicite de remplacement d’une question. Les questions associées à un cas ne sont pas arrachées à leur contexte et à leur support. |
| LIB-07 | Les seules questions disponibles au choix et au tirage sont celles approuvées pour le diplôme et les droits du compte. Les filtres de recherche n’altèrent pas la sélection déjà ajoutée. Indiquer le nombre disponible, sélectionné et restant ; conserver l’ordre, les corrections, les modes et les éditions après sauvegarde/réouverture. |

Exemple de recette de réception, à effectuer en AFP et en CFC avec banques de test approuvées : ouvrir une fiche en Évaluation, passer en Libre, choisir 101 et 102, ajouter 10 vérifications, puis 3 mathématiques d’un ou plusieurs modules éligibles ; rechercher une question précise et l’ajouter ; remplacer une autre question, réordonner les activités, éditer une consigne, basculer en corrigé, sauvegarder, rouvrir et imprimer. Les éléments manuels, les variantes chiffrées, la numérotation, les espaces de réponse et les points doivent être identiques.

### 3.8 Mode Libre : éditeur individuel complet des questions et des réponses (V2.2)

**Principe obligatoire.** Le mode Libre n’est pas uniquement un sélecteur de banques. Il est aussi l’outil de rédaction et de personnalisation des fiches du formateur. Reprendre le panneau Libre actuel, ses cartes d’items, champs, styles, contrôles et comportements, notamment `LibreSidePanel.tsx` et `GenericLibreEditor.tsx`. Ajouter les champs propres aux formats logistiques de manière progressive et contextuelle. Aucun nouvel écran, éditeur indépendant, gabarit, route ou système de sauvegarde. Le même éditeur fonctionne en Exercice et en Évaluation, en CFC comme en AFP. Une activité peut contenir des items importés, tirés, sélectionnés manuellement ou créés localement.

#### 3.8.1 Cycle de vie d’une question dans le document

| ID | Exigence fonctionnelle |
|---|---|
| EDIT-01 | Chaque question visible dans l’aperçu est identifiable dans le panneau Libre par son numéro, son activité, son code de sous-module et son origine (banque ou création locale). Sélectionner l’item permet de modifier uniquement celui-ci. Préserver l’identité de l’item lors des déplacements, même entre pages. |
| EDIT-02 | Autoriser la modification indépendante de la consigne de l’activité et du texte complet de la question, y compris plusieurs paragraphes, listes et données utiles, selon les possibilités de mise en forme déjà offertes par Doc-Prof. Le champ ne doit pas tronquer un problème long à une seule ligne. |
| EDIT-03 | Donner accès au corrigé de chaque question dans le panneau enseignant : modifier la réponse attendue, les réponses alternatives, les explications, les étapes de calcul et les critères de correction selon le format. Modifier une réponse ne doit pas modifier involontairement son énoncé, et inversement. |
| EDIT-04 | Proposer « Ajouter une question libre » dans l’activité existante, même si la banque est vide, sans exiger un tirage préalable. Choisir le sous-module éligible et le format compatible avec le type de l’activité ; saisir l’énoncé et le corrigé. Si le type est différent, créer une activité standard, jamais une sixième catégorie. Les questions locales sont des créations de fiche, non des éléments approuvés de la banque. |
| EDIT-05 | Autoriser dupliquer, supprimer, déplacer, remplacer depuis la banque, verrouiller et restaurer la version de départ d’une question. Une duplication reçoit un identifiant d’instance distinct ; une restauration ne doit pas supprimer d’autres questions. Confirmer une action destructive lorsque des modifications non enregistrées seraient perdues. |
| EDIT-06 | L’aperçu et le corrigé se mettent à jour après édition valide, sans régénération des autres items. Réutiliser la gestion d’état et, si disponible, l’annulation/rétablissement commune. Un changement de mode, de format ou de filtre ne doit pas effacer les éditions ou les images en silence. |
| EDIT-07 | Conserver l’origine et la révision canonique d’une question de banque, ainsi que sa version locale modifiée. Une nouvelle question locale reçoit un ID propre à la recette, sans faux ID de banque. L’édition, la duplication et la suppression d’instances ne modifient ni les banques AFP/CFC ni les statistiques éditoriales. |
| EDIT-08 | Enregistrer un brouillon avec une correction incomplète est permis si le système de recettes le permet ; signaler précisément l’item « corrigé à compléter / à vérifier ». Ne jamais présenter une réponse ancienne devenue incohérente comme validée. Avant l’impression du corrigé, demander la résolution des erreurs bloquantes ; l’impression élève sans correction peut rester disponible avec avertissement explicite à l’enseignant. |

#### 3.8.2 Champs d’édition adaptés à chaque format

| Format | Énoncé et paramètres librement éditables | Corrigé éditable / contrôles |
|---|---|---|
| QCM simple ou multiple | Texte, propositions, ajout/retrait/réordre, choix simple ou multiple | Sélection des bonnes propositions par identifiant stable, justification ; au moins une bonne réponse, une seule en QCM simple. |
| Réponse sur lignes numérotées | Question, nombre de réponses attendues, nombre de lignes utiles par réponse si le rendu le permet | Réponses attendues par numéro, alternatives, critères et points ; distinguer une réponse en plusieurs lignes de plusieurs réponses distinctes. |
| Réponse sur lignes simples | Question, nombre de lignes ou espace de rédaction | Réponse modèle, variantes acceptables, justification, critères et points. |
| Texte à compléter inline | Texte, insertion/suppression/modification des trous, largeur des traits, mode avec ou sans banque de mots, mots et leurres | Associer chaque trou à une ou plusieurs réponses admises ; contrôler le nombre et l’ordre des trous et les leurres. Aucun mot correct supprimé de la liste aidée. |
| Vrai/faux, association, ordre (si compatibles) | Affirmations, éléments, paires, propositions et ordre d’affichage | Vérité, justification, paires ou ordre attendu ; pas de correspondance perdue lorsque les éléments sont déplacés. |
| Mathématiques | Énoncé, nombres, unités, tableau de données, hauteur de la grille dans les limites communes, libellé du trait de réponse | Formule, étapes de calcul, valeur, unité, précision et interprétation. Grille et trait de réponse restent obligatoires ; recalcul validé ou confirmation manuelle de la solution après modification des données. |
| Mises en situation | Titre, contexte, mission, annexes, ordre et texte des sous-questions, format de chaque sous-question | Réponse et critères par sous-question, points et éventuelles dépendances entre calculs ; préserver les données communes nécessaires à toutes les questions. |
| Glossaire à compléter | Termes, définitions, exemples, trous et sélection locale | Termes/définitions attendus, alternatives et correspondances ; ne pas modifier le glossaire canonique. |

Une modification de format ne doit pas inventer automatiquement des distracteurs ni convertir un corrigé ouvert en QCM sans choix valides. Proposer la conversion uniquement lorsque la structure est compatible, avec prévisualisation et validation des nouveaux champs ; sinon garder l’original et expliquer l’incompatibilité. La théorie de référence reste éditable via les mécanismes de théorie existants, sans être transformée artificiellement en question.

#### 3.8.3 Cohérence du corrigé et des points

- En mode Évaluation, modifier les points par question ou sous-question dans les contrôles existants ; recalculer le total à partir des instances réellement présentes. Les critères de correction et points partiels doivent rester cohérents avec ce barème.
- Après modification de l’énoncé, des données d’un problème, des trous, des propositions ou des supports nécessaires à la résolution, invalider la confirmation du corrigé concerné si la réponse n’est plus garantie. Proposer un recalcul uniquement pour un gabarit numérique compatible et validé ; sinon l’enseignant revoit le corrigé manuellement.
- Conserver le même numéro, la même instance, les mêmes données et les mêmes médias en passant de l’aperçu élève au corrigé. Les champs de correction et les réponses ne sont jamais imprimés dans le document élève.
- Un item modifié localement ou créé à la main ne bénéficie pas automatiquement de l’approbation de sa source. Marquer la modification dans l’éditeur, pas par un bandeau administratif supplémentaire sur la fiche élève.

### 3.9 Mode Libre : images et illustrations associées aux questions (V2.2)

L’image est une option de personnalisation de l’item, et non un type d’exercice supplémentaire. Elle doit pouvoir illustrer une question de connaissance, un calcul, une mise en situation ou une sous-question, sans être obligatoire ni être ajoutée à toutes les questions. Exemples : photographie d’un emballage, schéma coté d’un carton, plan fictif d’entrepôt, document de livraison, graphique ou pictogramme pédagogique. Le support doit être pertinent, lisible et respecter les droits de réutilisation.

| ID | Exigence fonctionnelle |
|---|---|
| IMG-01 | Depuis la carte de la question active dans le mode Libre, proposer « Ajouter une image ». Réutiliser en priorité les contrôles d’images, le sélecteur de ressources et les composants de rendu déjà présents dans Doc-Prof (vérifier notamment `WorksheetImage` et le mécanisme d’`imageOverrides`). Ne pas créer un éditeur de médias indépendant. |
| IMG-02 | Permettre l’ajout depuis un fichier de l’enseignant (import local) et, si le sélecteur commun le permet, la sélection dans la galerie/ressources du projet ou des images déjà autorisées de la banque. Le recours à une URL distante n’est pas nécessaire à la livraison ; si une fonction commune existe, la sécuriser et figer une ressource pérenne avant sauvegarde. |
| IMG-03 | Afficher la miniature, permettre remplacement, suppression, ajout d’une autre image et réordonnancement. Lier chaque image à l’ID d’instance de la question, ou au support partagé d’un cas si explicitement choisi, jamais au seul index de la liste. Ne pas effacer les illustrations des autres questions. |
| IMG-04 | Proposer les réglages de taille, alignement et placement compatibles avec les outils actuels : au-dessus ou sous l’énoncé, et à côté si le gabarit et la largeur disponibles le permettent. Conserver les proportions par défaut ; permettre un recadrage non destructif si l’outil existant le permet. Éviter toute position libre qui pourrait recouvrir le texte ou sortir de la feuille. |
| IMG-05 | Prévoir une légende facultative et une description alternative ; pour un schéma coté ou une illustration utilisée comme donnée, préserver les mesures, repères et détails nécessaires. Les images illustratives peuvent être supprimées ; si une image indispensable à la résolution disparaît, marquer la question et son corrigé à vérifier. |
| IMG-06 | Par défaut, le support de l’énoncé est identique en élève et corrigé. Autoriser une image réservée au corrigé (par exemple schéma annoté ou solution) uniquement via une visibilité explicite ; elle ne doit jamais être rendue dans la version élève, y compris dans son PDF. Ne pas afficher une légende qui révèle involontairement la réponse. |
| IMG-07 | Le rendu doit employer la feuille et les composants de mise en page existants. L’image participe au calcul de hauteur et à la pagination, sans recouvrir la grille mathématique, les propositions, les traits inline ni les lignes de réponse. Si elle est indispensable, conserver le lien clair entre question et image en cas de changement de page, selon les règles des annexes communes. |
| IMG-08 | Toute image locale et ses réglages sont sauvegardés avec la fiche ou référencés par une ressource immuable durable et autorisée ; réouverture dans une nouvelle session, duplication, export/import de recette si disponible, sauvegarde et impression doivent conserver le contenu. Une URL `blob:` temporaire ou un chemin absolu du poste ne suffit pas. |
| IMG-09 | Vérifier le contenu et le type réel des fichiers, refuser fichiers corrompus ou formats non supportés, fixer des limites de taille et dimensions adaptées au système existant ; assainir SVG si autorisé ou convertir en image sûre. Afficher des erreurs claires sans effacer l’illustration précédente. Garder la qualité d’impression ; ne pas écraser les données d’un schéma par une compression excessive. |
| IMG-10 | Les médias privés de l’enseignant restent liés à sa fiche et aux autorisations existantes. Aucun ajout automatique à la galerie publique, à la banque canonique, aux autres fiches ou au dépôt Git. Distinguer les droits et la provenance des médias de banque et des ajouts locaux ; ne pas utiliser de véritables données personnelles sur les documents d’exercice. |

#### 3.9.1 Recette fonctionnelle de référence

Dans une évaluation AFP ou CFC contenant les sous-modules 101, 102 et 105 : sélectionner une question de banque, modifier son énoncé et son corrigé ; créer un QCM local, changer une proposition correcte ; ajouter un problème de volume rédigé par l’enseignant, lui associer un schéma coté, vérifier son résultat, ajuster l’image puis conserver la grille et le trait de réponse existants. Ajouter une image à une sous-question de cas, puis une illustration réservée au corrigé. Déplacer les items, dupliquer une question illustrée, supprimer l’image de la copie seulement, verrouiller les éditions, sauvegarder et rouvrir la fiche. Les images, leurs réglages, les questions, les corrections, les points, la pagination et l’en-tête EPCA doivent être fidèles. Vérifier les deux PDF : élève et corrigé.

Les choix précis de contrôles (bouton, carte repliable, galerie intégrée), formats d’image, limites d’import et stratégie de stockage sont des décisions techniques proposées à adapter aux capacités réelles du projet ; l’édition locale des questions et réponses et la possibilité d’ajouter des illustrations restent obligatoires. Aucun service de génération d’images par IA n’est requis.

### 3.10 Catalogue de formats et choix par activité ou par question (V2.3)

**FMT-UI-01.** Maintenir Domaine → Thème → Sous-thème → Type et les commandes habituelles du panneau de paramétrage des activités. Ajouter, dans les réglages internes du type, le contrôle « Format de question » dans le même style que les sélecteurs existants de Grammaire/TCF. Choix « Tous les formats compatibles », format unique, ou sélection de plusieurs formats (facultativement quotas par format). Les cinq catégories principales ne changent pas. Un format indisponible indique la raison et la capacité approuvée réelle ; ne jamais générer de question fictive pour le rendre disponible.

**FMT-UI-02.** En mode Évaluation, combiner les filtres par diplôme, sous-thème(s), type, format, difficulté et origine. Exemple : dans une activité de vérification, tirer six questions ouvertes et quatre questions visuelles réparties sur 101, 102 et 105 ; ajouter une activité de trois problèmes de mathématiques. Les quotas par sous-thème et par format sont des contraintes conjointes : si leur combinaison est impossible, signaler le déficit et permettre une modification des paramètres, sans diminuer les quantités en silence.

**FMT-UI-03.** En mode Libre, chaque question possède son propre choix de format compatible et un éditeur adapté : cellules, trous, propositions, textes, images, zones, liens et réponses. Autoriser la création locale, la sélection manuelle et le tirage de lots pour tous les formats. Changer la présentation ne change pas le contenu canonique ; si une conversion requiert une nouvelle consigne ou correction, demander une adaptation explicite, conserver l’original et marquer le corrigé à revoir. Préserver les instances verrouillées. Le mode Libre conserve sa position et son organisation actuelles.

**FMT-UI-04.** Réutiliser les réglages de police, taille d’image, colonnes, espaces de réponse, hauteur de grille et sauts de page existants. Les nouveaux réglages n’apparaissent que pour les formats concernés. Aucun nouvel écran de gestion des exercices, aucun éditeur externe obligatoire. Les formats visuels sont des exercices papier : l’élève relie, écrit, coche, numérote ou annote sur la fiche ; pas de glisser-déposer ou d’interaction numérique apprenant à développer.

### 3.11 Conception intuitive des évaluations AFP et CFC (V2.9)

#### 3.11.1 Parcours commun et deux formats

**EV9-01 — Configuration rapide.** Dans le mode Évaluation actuel, sélectionner le diplôme, les modules concernés, le format narratif et les quantités souhaitées. Proposer les paramètres courants dans le panneau existant ; ranger les critères fins (quotas Bloom, répartition des points, filtres de provenance, contraintes de scénario) dans des sections repliables. Garder le choix multi-sous-thèmes du §3.6 et la composition multi-types par activités du document. Ne pas introduire un sixième type de catalogue, un assistant obligatoire, une page séparée ou un nouvel aperçu.

| Format | Comportement |
|---|---|
| Histoire suivie | Une introduction professionnelle, des étapes logiques reliées par des connecteurs et des questions intégrées naturellement dans un même récit. Utiliser « vous », avec un contexte fictif EnterSite par défaut proposé, personnalisable. |
| Questions indépendantes | Tirage dans les banques approuvées selon les critères sélectionnés, sans narration globale ni transitions imposées. Chaque question est autonome ou conserve son propre mini-cas, son support et ses sous-questions. |

Le mode Histoire est proposé par défaut pour une nouvelle évaluation ; le choix de l'enseignant est conservé. Les deux formats utilisent le même mécanisme de sélection mixte et les mêmes réglages de durée, de points, de correction, de sauvegarde et d'impression. Le passage d'un format à l'autre conserve autant que possible les questions, les valeurs, les corrigés, les barèmes et les modifications manuelles ; conserver une version réversible, sans supprimer silencieusement la narration ou les dépendances. Signaler les éléments incompatibles avant remplacement.

**EV9-02 — Sélection mixte obligatoire.** Tirer une première proposition dans les banques autorisées ; permettre de remplacer, ajouter, supprimer, déplacer ou rédiger une question, puis de verrouiller les éléments à conserver. Les questions choisies manuellement sont protégées par défaut contre le tirage global (proposition d'ergonomie, déverrouillable). Offrir les actions « Remplacer » et « Choisir dans la banque » à l'échelle de la question ; « Régénérer » à l'échelle voulue, sans toucher aux éléments protégés. Aucun doublon involontaire, aucun élargissement silencieux du diplôme, des modules ni des quotas. Si les contraintes ne sont pas réalisables, afficher ce qui manque et conserver l'état courant.

**EV9-03 — Réglages de composition.** Choisir les nombres de QCM, questions ouvertes, problèmes mathématiques et cas, ainsi que les autres formats existants pertinents. Exemple de préréglage facultatif : 3 QCM à 4 choix, 3 problèmes de maths (facile, moyen, difficile), 15 questions ouvertes. Les quantités sont librement modifiables ; les cas complets et leurs sous-questions ne sont pas comptés deux fois. Une évaluation peut contenir un seul format ou plusieurs activités. Les connaissances théoriques sont évaluées par des questions, non par l'insertion automatique des réponses du cours. Un support de référence n'est fourni que sur décision de l'enseignant.

#### 3.11.2 Scénario cohérent et adaptation automatique avec contrôle manuel

**EV9-04 — Narration structurée.** Créer un contexte initial, des étapes, des transitions, des missions et des annexes reliées à des identifiants stables. Chaque question retenue possède un rattachement à une étape et indique les données qu'elle utilise. Les étapes suivent les compétences réellement retenues (réception, contrôle, stockage, expédition, etc., selon les modules) ; ne pas forcer une question hors contexte. Varier les situations et éviter les répétitions artificielles. La narration ne doit jamais révéler la réponse d'une question ni ajouter une notion non enseignée.

**EV9-05 — Ajustement automatique.** Lors d'un remplacement, ajout, retrait, déplacement ou changement d'une donnée structurée, déterminer les passages et questions affectés. Mettre à jour les transitions, noms, quantités, unités, références de documents, chronologie et corrigés dépendants à partir d'une source unique pour chaque donnée partagée. Préférer les modifications locales, sans réécriture globale inutile. Vérifier l'éligibilité, les annexes, la solvabilité des calculs et la cohérence de la suite. Si une adaptation fiable est impossible, conserver l'état antérieur ou proposer un brouillon clairement signalé, jamais un résultat présenté comme contrôlé. Aucun remplacement automatique de contenu verrouillé.

**EV9-06 — Édition manuelle complète.** Dans le mode Libre, rendre éditables le titre, l'introduction, chaque paragraphe narratif, transition, mission, consigne, question, réponse, annexe compatible et donnée du scénario. Autoriser ajout, suppression, duplication et réorganisation. Toute modification ordinaire se reflète immédiatement dans l'aperçu A4, sans bouton Valider. Les champs transitoirement invalides restent éditables, avec un message ciblé ; ne pas détruire le dernier état exploitable. Prévoir, pour chaque passage, une protection contre la réécriture automatique (activable également après une modification manuelle), une restauration de la formulation antérieure et une commande « Ajuster les passages liés ». L'enseignant garde la décision éditoriale finale. L'action Annuler/Rétablir porte sur une modification cohérente, y compris ses répercussions sur le récit et le corrigé.

**EV9-07 — Priorité aux choix de l'enseignant.** Par défaut proposé, protéger les passages reformulés manuellement jusqu'à déverrouillage explicite ; signaler les conflits entre un passage protégé et une donnée modifiée. Ne pas réécrire un texte verrouillé ni modifier silencieusement une réponse verrouillée ; proposer un remplacement compatible ou expliquer le conflit. Si une réponse ouverte éditée ne peut être vérifiée automatiquement, indiquer « Corrigé à vérifier » et permettre sa modification. En cas de contradiction bloquante (donnée indispensable manquante, corrigé mathématique invalide, annexe absente), empêcher l'impression en tant qu'évaluation finalisée jusqu'à résolution. La sauvegarde de brouillon reste possible. Une simple modification stylistique n'impose pas une nouvelle validation de tout le document.

**EV9-08 — Architecture sans IA obligatoire.** Respecter le principe de banques validées, versionnées et de gabarits déterministes du §3.3. Préparer à l'avance des trames réutilisables, des variantes de transitions, des emplacements typés et des questions compatibles par notion et diplôme. Les données partagées et leurs dépendances permettent la contextualisation et le recalcul sans génération libre de faits métier. Le moteur assemble et adapte ces éléments ; l'édition libre permet les reformulations non couvertes. En l'absence d'une combinaison compatible, l'indiquer et offrir une autre question ou une adaptation manuelle ; ne pas simuler une correction fiable de texte arbitraire. Un recours futur à l'IA générative à la volée nécessiterait une décision distincte, des contrôles et une validation pédagogique ; il n'est pas imposé ni autorisé implicitement par cette révision.

Exemple : « Vous commencez votre journée chez EnterSite. Une livraison est attendue au quai. » Après remplacement d'un problème portant sur la masse des colis par un problème portant sur les quantités livrées, ajuster le passage de réception et les renvois au bon de livraison, puis recalculer les réponses concernées ; ne pas réécrire les étapes indépendantes. L'enseignant peut ensuite reformuler la transition, la protéger et continuer à remplacer d'autres questions.

#### 3.11.3 Barème selon Bloom et difficulté réelle

**EV9-09.** Chaque unité évaluable et sous-question possède un niveau de Bloom validé, un niveau de difficulté distinct, un barème proposé et des critères de correction. Ne pas déduire Bloom uniquement d'un verbe ou du format. Une question difficile AFP demeure dans le programme AFP. Les points augmentent en principe avec les exigences cognitives, mais tiennent aussi compte du nombre de réponses attendues, des étapes de raisonnement, de l'autonomie, des critères observables et du temps de réalisation.

| Bloom | Exemple de tâche | Fourchette indicative modifiable |
|---|---|---:|
| Mémoriser | Nommer une notion | 1–2 pts |
| Comprendre | Expliquer une différence | 2–3 pts |
| Appliquer | Résoudre un calcul contextualisé | 3–4 pts |
| Analyser | Interpréter des écarts | 4–6 pts |
| Évaluer | Comparer et justifier un choix | 5–8 pts |
| Créer | Proposer une organisation argumentée | 6–10 pts |

Ces fourchettes sont des propositions pédagogiques propres au projet, non une règle de la taxonomie ni du référentiel suisse. Les barèmes existants validés constituent un point de départ. Permettre l'édition par question, sous-question et critère, ainsi que le verrouillage de points. Afficher le total réel et les sous-totaux en direct ; ne pas écraser un barème manuel lors d'un nouveau tirage d'un autre item. Les points partiels doivent s'additionner exactement au maximum annoncé. Si l'enseignant fixe un total cible, proposer une sélection ou une redistribution explicite des seuls points non verrouillés, avec contrôle de faisabilité et de granularité (entiers ou demi-points proposés). Ne pas masquer un écart ni attribuer arbitrairement des points à une consigne non évaluée. L'élève voit les points par question selon les réglages existants ; le corrigé précise le détail des critères et les variantes acceptables.

#### 3.11.4 Durée et équilibre pédagogique

**EV9-10.** Estimer la durée totale en additionnant le temps de lecture des supports communs (une seule fois), des consignes, le temps de réponse par question et une marge facultative de relecture. Prévoir une estimation par item et par diplôme, indépendante du barème. Les estimations initiales sont des valeurs pédagogiques à calibrer avec les retours d'usage, pas des durées mesurées. Exemple indicatif : QCM simple 1 minute, question ouverte courte 2–3 minutes, calcul à plusieurs étapes 4–6 minutes ; ajouter les temps propres aux cas et annexes. Autoriser l'édition du temps estimé par item, de la marge et de la durée cible. Afficher une estimation et un écart à la cible en temps réel, sans chronométrer l'élève ni enregistrer ses résultats. Si une durée cible est saisie, proposer de modifier la sélection non verrouillée plutôt que tronquer silencieusement l'évaluation.

**EV9-11.** Fournir dans le panneau enseignant une synthèse compacte : nombre de questions, points, durée estimée, couverture des modules et notions, répartition par format, difficulté et Bloom (en nombre et en points). Afficher les écarts significatifs aux objectifs et les questions dont le corrigé est à revoir. La couverture est calculée à partir des identifiants d'objectifs et non d'une simple ressemblance textuelle. Une alerte de déséquilibre informe sans bloquer une décision pédagogique volontaire. Un contrôle avant impression vérifie la cohérence des supports, du barème, du récit, des corrigés et de la pagination ; aucun tableau pédagogique interne ne figure sur la fiche élève par défaut.

#### 3.11.5 Ergonomie et réutilisation

**EV9-12.** Utiliser les composants et styles du panneau commun. Actions fréquentes visibles : générer, remplacer, verrouiller, ajouter, annuler/rétablir ; actions secondaires dans les menus contextuels (dupliquer, restaurer, déplacer, supprimer). Éditeur narratif par passage repliable, recherche dans la banque, filtres pertinents et compteurs fiables. Info-bulles à délai pour les icônes, libellés accessibles au clavier et sur écran tactile, messages d'erreur près du champ. Aucun contrôle sans effet ; aucun changement de taille de feuille, de chrome ou d'interface générale. Masquer les réglages de trame dans le format sans histoire. Réutiliser l'organisation du mode Libre refondu plutôt que recréer un panneau spécifique.

**EV9-13.** Dans le mécanisme commun de fiches et modèles enregistrés, distinguer la réouverture à l'identique (toutes les questions, données, passages, annexes, barèmes, corrigés et verrouillages) et la réutilisation de configuration (mêmes filtres, structure, objectifs, quotas, temps cible et présentation, nouveau tirage à la demande). Les modèles peuvent retenir des questions ou passages imposés explicitement ; ne pas écraser l'original en générant une nouvelle évaluation. Si un modèle ne peut plus être reproduit avec les banques disponibles, expliquer la situation. Aucun nouveau système de comptes, de notes, de classes ou de publication en ligne.

**EV9-14.** Utiliser le mécanisme commun de récupération des brouillons de la refonte Libre : sauvegarde automatique locale ou mécanisme existant approprié, état de sauvegarde fiable, réouverture exacte et choix de restaurer ou abandonner un brouillon. Respecter l'isolation des comptes et les droits, gérer quota, interruption et conflits entre sessions ; ne pas annoncer une sauvegarde réussie avant confirmation. Les documents enregistrés restent distincts du brouillon. Tester le rechargement après une modification narrative et un recalcul.

**EV9-15 — Variantes d'évaluation (proposition complémentaire).** Prévoir la génération facultative de versions A/B/C et d'une évaluation de rattrapage depuis un même modèle, en conservant modules, objectifs, formats, difficulté, répartition Bloom, barème et durée comparables, dans la limite du stock. Chaque version possède son propre corrigé figé et un identifiant imprimable ; conserver les dépendances narratives et éviter de prétendre à une équivalence psychométrique non démontrée. Si le stock ne suffit pas, signaler l'écart plutôt que le masquer. Cette option peut être livrée après le socle obligatoire, sans nouvelle page.

## 4. Fiches de théorie : spécifications éditoriales et rendu

**TH-01.** Reprendre textuellement et intégralement les contenus complets CFC et les variantes AFP applicables, avec les seules corrections linguistiques autorisées au §4.9. Aucun enrichissement rédactionnel, aucune simplification ni reformulation du corps du cours complet. Les nouveaux visuels originaux et leurs légendes restent des blocs distincts. Archiver séparément les résumés source existants. Produire pour chaque diplôme un nouveau résumé pédagogique retravaillé à partir du cours complet, en suivant les obligations TH-04 et TH-08 à TH-16. Ne pas imposer de simplification FALC ni de niveau FLE. Pour AFP, appliquer les règles de résolution et d’adaptation du §6.4. Reprendre les objectifs et l'aperçu sous forme de blocs intégrés. Conserver les titres et leur ordre, définitions, règles, exemples, listes, tableaux, formules, références et avertissements. L'enseignant doit pouvoir produire une fiche intégrale ou une sélection de sections, sans perdre les éléments nécessaires à la compréhension.

**TH-02.** Utiliser les styles de théorie existants de Doc-Prof (`layout: 'theory'`, `GrammarTheoryBlock` dans `src/francais/grammar-theory.ts`) lorsque compatibles : paragraphes, titres, sections, règles, tableaux, exemples, notes, encadrés, sauts. Ajouter des blocs neutres réutilisables pour les médias légendés, les formules ou schémas techniques qui ne sont pas pris en charge, sans casser Grammaire. Le modèle visuel peut reprendre les trois sections de Grammaire (« Je regarde », « J'explique », « Je retiens ») quand cela est pertinent ; ne pas restructurer artificiellement un chapitre technique long.

**TH-03.** Convertir le Markdown EPCAS de manière structurée (AST ou parseur dédié, pas de suppression globale par regex). Conserver les niveaux de titres, caractères accentués, emphases, séparateurs, tableaux textuels et liens pédagogiques pertinents. Transformer les références d’images, balises `:::figure` et légendes en fiches de besoin visuel ; ne pas copier les anciens fichiers ni les afficher dans Doc-Prof. Préserver les informations pédagogiques indispensables présentes dans les légendes, sans réutiliser les images. Interpréter les balises de notes élève comme zone vierge facultative ; ne jamais importer de notes d'élève réelles. Toute syntaxe non reconnue apparaît dans le rapport d'import et bloque la validation du bloc concerné.

**TH-04.** Pour le mode Résumé, prendre obligatoirement la théorie complète résolue et validée pour le diplôme comme base de rédaction. Le résumé EPCAS disponible, natif ou hérité, est un document de comparaison, jamais un résultat prêt à publier sans réécriture et contrôle. Reconstituer les notions essentielles absentes de l’ancien résumé, reformuler les passages difficiles et organiser les explications de façon progressive ; ne pas ajouter de notions métier non attestées. Distinguer « exemples pédagogiques » et faits. Aucune compression qui supprime une consigne de sécurité, une condition d'application ou une unité. Pour les chapitres sans texte source complet (notamment 100 et 902 selon le registre initial), documenter la lacune et demander le cours original ou une autorisation explicite de rédiger un nouveau cours distinct. Ne pas fabriquer un cours complet ni un résumé à partir d’une source absente ; une création ultérieure approuvée reste distincte de la reprise textuelle.

**TH-05.** Illustrations : produire exclusivement de nouveaux visuels pédagogiques originaux pour le projet, avec provenance de création, texte alternatif, dimensions et empreinte. Ne copier aucune image EPCAS/EnterSite, notamment depuis `public/` ou les pièces jointes. Un schéma original doit être lisible en noir et blanc ; préciser les cotes, sens des flux et unités. Vérifier les tableaux et captures ICT pour qu'ils restent lisibles à l'impression. Les informations critiques ne sont jamais indiquées uniquement par la couleur.

**TH-06. Aide-mémoire et variantes de présentation.** Proposer une sélection de notions essentielles, formules, unités, exemples courts et vocabulaire, avec liens aux sections sources. Une fiche de théorie personnalisée conserve l'ordre des chapitres et signale les extraits. Une théorie à compléter peut être proposée comme présentation facultative de Théorie, avec blancs liés à des notions approuvées et corrigé issu des mêmes blocs ; ne pas transformer automatiquement un texte technique sensible en exercice à trous. Le mode Théorie complet/résumé/aide-mémoire ne reçoit pas de points.

**TH-07. Spécificités AFP.** Le cours complet AFP reprend fidèlement son texte source résolu, natif ou hérité. La progression explicative, les exemples concrets et les adaptations rédactionnelles AFP concernent le résumé, le glossaire et les exercices, pas le corps du cours complet. Un résumé CFC ne devient pas automatiquement la théorie complète AFP. Une adaptation doit être fondée sur les objectifs AFP et non une simple réduction arbitraire de la longueur ; conserver intégralement les conditions, limites et règles de prévention applicables. Chaque chapitre et notion a une référence et un statut de validation AFP.

### 4.1 Public cible et contrat de rédaction des résumés (V2.4 — impératif)

**TH-08 — Public et niveau de langue.** Le public de référence est constitué de jeunes de 15 à 18 ans en début de premier apprentissage de logisticien·ne. Le texte doit être compréhensible sans connaissances professionnelles préalables autres que les prérequis identifiés du module. Cela ne signifie pas limiter toutes les années au niveau de première année : les notions et approfondissements attendus de chaque année et diplôme restent présents et sont expliqués à leur juste niveau. Le ton est celui d'un manuel professionnel de formation initiale, respectueux et jamais enfantin. Ne pas assimiler AFP à un niveau de français inférieur au CFC.

**TH-09 — Exhaustivité des notions essentielles.** La cible est la couverture de 100 % des notions essentielles du cours complet applicable au diplôme, non la conservation de 100 % des phrases. Lire intégralement chaque section, y compris tableaux, légendes, encadrés, formules, conditions et exceptions. Identifier les objectifs, concepts, termes métier, classifications, différences entre concepts proches, fonctions, principes, étapes, règles, unités, formules, limites et précautions nécessaires à la compréhension et aux exercices. Tous les termes techniques nécessaires doivent apparaître explicitement dans le résumé avec une définition ou une explication accessible à leur première occurrence. Ne pas reléguer un terme indispensable au seul glossaire. Une répétition, une anecdote secondaire ou un détail non essentiel peut être condensé ou omis si la décision est justifiée dans la matrice de couverture. Aucun pourcentage fixe de réduction ni nombre maximal de pages ne prime sur la couverture.

**TH-10 — Précision du vocabulaire.** Conserver les appellations métier exactes, abréviations, sigles et symboles du cours. Développer les sigles à leur première apparition si leur signification est attestée ; conserver ensuite l'usage professionnel. Expliquer le terme avec des mots courants, une phrase courte et, si utile, un exemple concret. Ne pas substituer un mot approximatif à un terme technique. Distinguer les notions proches (par exemple masse et volume, stock réel et stock théorique lorsque ces notions sont traitées). Ne pas supprimer les unités, hypothèses, conditions, limites ou distinctions importantes. En cas d'incertitude sur une définition source, signaler le point à vérifier ; ne pas inventer une définition officielle.

**TH-11 — Reformulation pédagogique obligatoire.** Réécrire les phrases longues ou abstraites, expliciter les pronoms et les liens de cause à effet, introduire les concepts avant de les utiliser, structurer une idée principale par paragraphe. Préférer les verbes concrets et la voix active lorsque cela clarifie l'explication. Une phrase complexe peut être divisée en plusieurs phrases. Employer le vocabulaire métier de façon cohérente ; éviter le jargon non expliqué, les tournures inutilement administratives, les métaphores trompeuses, le langage familier, les diminutifs et les formulations infantilisantes. Ne pas imposer une longueur de phrase mécanique ou un niveau CECRL. Le résumé est un véritable support d'apprentissage, pas une liste de mots-clés ni une suite de phrases copiées.

**TH-12 — Construction du contenu.** Conserver la logique et les grandes rubriques du cours complet ; réordonner localement une explication si nécessaire pour rendre explicites les prérequis, en conservant la correspondance avec la source. Chaque section comprend selon sa nature : une idée centrale, les termes et définitions essentiels, le fonctionnement ou le principe expliqué, les conditions et limites, un exemple concret si utile. Utiliser les tableaux pour comparer ou classer, les listes pour les étapes ou catégories, les schémas autorisés pour les relations, et les encadrés « À retenir » pour synthétiser. Ces blocs utilisent exclusivement les rendus et réglages actuels de Doc-Prof. Ne pas rendre obligatoire une illustration ou un tableau artificiel pour chaque notion.

**TH-13 — Exemples et sécurité.** Donner lorsque pertinent un exemple métier original, fictif et clairement identifiable comme illustration pédagogique (réception, inventaire, documents, emballages, flux, etc.). Les données numériques et les unités doivent être vérifiées. L'exemple ne doit ni introduire une règle nouvelle sans source ni remplacer la définition générale. Conserver intégralement le sens des avertissements, conditions d'application et mesures de prévention nécessaires ; les expliquer sans les transformer en instructions pratiques non supervisées. Toute divergence avec la source est documentée et soumise à validation.

**TH-14 — Trois documents distincts.** La théorie complète reste la référence détaillée, le résumé retravaillé est un cours synthétique autonome permettant d'apprendre toutes les notions essentielles, l'aide-mémoire est une fiche de révision plus condensée. L'aide-mémoire ne remplace jamais le résumé. Aucun changement de la théorie source ou de la banque ne doit être effectué implicitement par la réécriture. Les trois variantes sont disponibles via le sélecteur Théorie existant, avec les mêmes réglages de feuille, de sections et d'impression. Pas de nouvelle catégorie ni de nouvelle interface.

### 4.2 Méthode éditoriale obligatoire par sous-module et diplôme

1. Résoudre le cours complet applicable (CFC natif, AFP natif ou héritage commun à vérifier). Identifier son commit, champ source et révision ; préserver le texte source autorisé dans l'archive éditoriale. Un cours complet manquant, non autorisé, tronqué ou en conflit bloque la publication du résumé correspondant. Traiter la création d'un cours absent selon le processus éditorial existant, puis rédiger le résumé de cette nouvelle référence validée.
2. Lire le cours complet en entier, pas seulement l'aperçu, le glossaire, les premières sections ou le résumé existant. Inventorier les titres, objectifs, termes techniques, définitions, distinctions, formules, conditions et supports utiles. Assigner un identifiant stable à chaque notion. Marquer explicitement son caractère essentiel ou complémentaire et justifier les omissions envisagées. La classification des notions essentielles est contrôlée par le formateur, pas par la seule fréquence des mots.
3. Comparer le résumé EPCAS existant à cet inventaire ; repérer les omissions, formulations trop complexes, incohérences et répétitions. Ne pas prendre ce résumé comme unique source, ni utiliser sa longueur comme cible.
4. Rédiger un nouveau résumé cohérent et progressif en français professionnel accessible. Expliciter chaque terme indispensable à sa première apparition, préserver ses usages ultérieurs, réorganiser les explications localement, intégrer des exemples originaux vérifiés si utiles. Les termes, faits et distinctions restent ancrés dans la théorie complète. Réécrire réellement, ne pas se limiter à la mise en gras ou à l'ajout de quelques mots au texte source.
5. Relire dans les deux sens : théorie complète vers résumé (aucune notion essentielle oubliée), puis résumé vers théorie complète (aucune affirmation non justifiée, contradiction ou erreur de sens). Contrôler les définitions, unités, exemples, figures, règles et exceptions. Mettre en cohérence le glossaire, les questions et les corrigés ; tout exercice portant sur une notion complémentaire absente du résumé est signalé avec renvoi au cours complet, ou la notion est ajoutée au résumé si elle est essentielle. Ne pas modifier arbitrairement le référentiel pour s'adapter à une question existante.
6. Produire une preuve imprimable dans le gabarit actuel et vérifier la lisibilité réelle : progression, titres, paragraphes, densité, tableaux, légendes, sauts de page et rendu en niveaux de gris. Ajuster la mise en page sans réduire excessivement la police ou supprimer des notions pour faire tenir le contenu en une page.
7. Faire valider le fond métier et la qualité pédagogique par le responsable désigné, pour le diplôme concerné. Enregistrer la matrice de couverture et les révisions. Si les deux diplômes partagent le même cours complet et que le même résumé satisfait intégralement les objectifs des deux, mutualiser la révision avec deux validations indépendantes ; sinon produire des versions distinctes. Réviser le résumé et sa couverture dès que le cours de référence ou ses objectifs changent. Une fiche déjà sauvegardée reste figée à sa révision.

### 4.3 Structure rédactionnelle recommandée

| Bloc | Contenu attendu |
|---|---|
| Titre et objectifs | Code, intitulé du module, diplôme/année en métadonnées, objectifs réellement couverts. |
| Introduction | Situation ou rôle de la notion dans le métier, expliqué en quelques phrases. |
| Sections thématiques | Notions dans un ordre compréhensible, définitions professionnelles, fonctionnement, différences, conditions et exemples utiles. |
| Termes techniques | Mise en évidence mesurée à la première occurrence ; définition simple et précise dans le corps du texte. |
| Tableaux et figures | Comparaisons, classifications, relations, étapes ou valeurs lorsque plus clairs que du texte ; légendes et unités conservées. |
| À retenir | Synthèse des points importants par section ou en fin de cours ; ne remplace pas les explications. |
| Glossaire et liens | Termes alignés avec le glossaire canonique et renvois aux sections du cours complet lorsque nécessaire. |

Ce plan est un modèle rédactionnel adaptable, non un nouveau gabarit de page. Éviter de multiplier artificiellement les encadrés ou de répéter une même définition à chaque rubrique.

**Exemple original de reformulation (illustratif, non extrait d'EPCAS ; à vérifier contre le module concerné avant intégration).** Terme métier : « tare ». Une formulation dense pourrait être : « La tare correspond à la masse du contenant indépendamment de son contenu et intervient dans la détermination de la masse nette à partir de la masse brute. » Formulation pédagogique : « La **tare** est la masse de l'emballage ou du contenant vide. La **masse brute** comprend le produit et son emballage. La **masse nette** correspond à la masse du produit seul. Pour trouver la masse nette, on soustrait la tare de la masse brute. Exemple : si un carton rempli pèse 12 kg et que le carton vide pèse 2 kg, la masse nette est de 10 kg. » Les termes, la distinction et la relation de calcul restent présents ; seule la formulation devient plus accessible. L'exemple n'est pas une citation ni un contenu officiel.

### 4.4 Matrice de couverture et seuil de réception des résumés

Pour chaque couple `(diplôme, code)`, produire un registre éditorial indépendant des textes imprimés. Exemple de colonnes (données illustratives) :

| ID notion | Section source | Terme ou notion | Priorité | Référence résumé | Glossaire | Décision et validation |
|---|---|---|---|---|---|---|
| N-001 | Section source à identifier | Tare | Essentielle | Définition + exemple, bloc à identifier | ID à renseigner | À vérifier sur le cours source |
| N-002 | Section source à identifier | Masse brute / masse nette | Essentielle | Distinction et relation, bloc à identifier | IDs à renseigner | À vérifier sur le cours source |
| N-003 | Section source à identifier | Exemple historique secondaire | Complémentaire | Condensé ou omis | Non applicable si justifié | Motif et validation requis |

Le registre réel contient les IDs de chaque notion, la référence exacte du cours complet (champ, section, révision et empreinte), son diplôme d'application, le ou les blocs du résumé qui la traitent, les termes techniques attendus, les liens au glossaire et aux exercices, la décision éditoriale, le statut et la validation. Les éléments complémentaires omis sont identifiés et motivés ; une notion essentielle ne peut pas être déclarée couverte par un titre seul, un renvoi au glossaire ou une simple occurrence de mot sans explication suffisante.

**Indicateur bloquant :** couverture = nombre de notions essentielles dont le traitement dans le résumé est effectivement validé / nombre de notions essentielles identifiées et validées dans le cours complet. Cible 100 %. Une matrice vide ou incomplète est un blocage, jamais un résultat de 100 %. Le contrôle automatique vérifie les liens, révisions, statuts et présences lexicales ; la revue humaine vérifie le sens, l'exactitude et l'accessibilité. Un résumé non relu, non couvert ou dont la référence est obsolète ne peut être proposé comme résumé approuvé. Les statuts du cours complet, du résumé et de l'aide-mémoire restent distincts.

### 4.5 Critères de qualité linguistique et pédagogique

| Critère obligatoire | Vérification attendue |
|---|---|
| Fidélité | Le sens, les faits, les objectifs, les conditions et les distinctions sont préservés ; chaque affirmation métier peut être rattachée à la référence. |
| Couverture | Tous les termes et notions essentiels du cours applicable au diplôme sont expliqués ; aucun oubli masqué par un glossaire seul. |
| Compréhension | Un jeune débutant peut comprendre le terme à partir du texte et expliquer la notion avec ses propres mots ; les prérequis sont explicités. |
| Professionnalisme | Vocabulaire technique exact, ton respectueux et adulte, orthographe et syntaxe soignées ; aucune formulation enfantine ou excessivement familière. |
| Progression | Du principe de base vers les détails et applications attendus ; les connaissances avancées sont expliquées, pas effacées. |
| Concision utile | Suppression des répétitions et détails secondaires motivés ; aucune longueur fixe imposée ; paragraphes courts et structurés. |
| Cohérence | Même définition et même terminologie dans le résumé, le glossaire et les corrigés, sauf nuance contextuelle documentée. |
| Rendu | Fiche lisible dans la structure existante, images et tableaux pertinents, aucune coupure incohérente ni réduction artificielle du texte. |

La grille est vérifiée pour chacun des 143 sous-thèmes de catalogue (80 CFC + 63 AFP), même en présence d'une révision canonique mutualisée. Ces critères portent sur les résumés complets du module ; les sélections de chapitres personnalisées restent possibles mais sont indiquées comme extraits et ne sont pas comptées comme résumés exhaustifs.

### 4.6 Illustrations pédagogiques de la théorie complète (V2.5 — impératif)

**THV-01 — Principe.** Pour chaque théorie complète applicable à un diplôme, lire l’ensemble du cours et recenser les passages dont la compréhension bénéficie d’une représentation visuelle. L’objectif est de permettre à un jeune de 15–18 ans en premier apprentissage d’associer un terme technique à une réalité professionnelle : objet, relation, organisation, situation ou processus. Un visuel apporte une explication ou un repère identifiable ; il ne sert pas uniquement à décorer. Le contenu textuel complet reste disponible, sans réduction. La version source archivée demeure intacte ; la version illustrée est une révision éditoriale traçable.

**THV-02 — Choix et création.** Partir des textes complets, des notions et des objectifs de chaque diplôme. Recenser les renvois aux anciennes figures uniquement pour identifier l’information à représenter. Ne reprendre aucune image EPCAS ou EnterSite, même si elle est lisible et que sa réutilisation serait autorisée. Générer une nouvelle illustration originale ou construire un schéma, graphique, tableau, document fictif ou dessin vectoriel original à partir de la notion enseignée, sans reproduire les anciennes images. Les visuels doivent représenter fidèlement le métier et les connaissances effectivement enseignées. Ne pas ajouter de photographie générique d'entrepôt à chaque page. Une notion peut nécessiter plusieurs visuels complémentaires ; une notion purement abstraite peut être mieux servie par un tableau ou une explication textuelle. Aucune obligation artificielle d'une image par paragraphe ou par page.

| Famille de visuel | Utilité pédagogique | Exemple de support (à vérifier contre le cours) |
|---|---|---|
| Photographie ou dessin réaliste | Reconnaître un objet ou un environnement professionnel | Emballages, supports de charge, zones de stockage |
| Illustration comparative | Distinguer des notions proches | Marchandise fragile / périssable, types de stockage, masse brute / nette / tare |
| Schéma technique légendé | Comprendre des parties, dimensions ou relations | Dimensions d'un colis, structure d'un support, unités de volume |
| Séquence d’illustrations d’une action | Comprendre une succession de tâches observables | Lecture d'un bon de livraison, comptage, consignation d'un écart, échange d'information |
| Diagramme de flux | Identifier les étapes et liens d’un processus | Flux de marchandises et d'informations, chaîne d'approvisionnement |
| Plan simplifié | Situer les fonctions d’un espace | Zones de réception, stockage, préparation et expédition, plan fictif |
| Frise chronologique | Situer des événements ou évolutions | Jalons historiques de la logistique |
| Tableau comparatif / graphique | Comprendre des données, tendances ou critères | Écarts de stock, délais, comparaison de modes de transport |
| Document professionnel annoté | Identifier les champs utiles et leurs fonctions | Bon de livraison fictif, étiquette, fiche article, extrait de tableau d'inventaire |
| Capture ou schéma d’interface | Comprendre les informations affichées | Extrait ICT autorisé, anonymisé et versionné ; aucune donnée de compte réelle |

**THV-03 — Exactitude et sécurité.** Les proportions, unités, textes, flèches, relations et légendes doivent être vérifiés. Les illustrations concernant des risques, des engins, des produits réglementés ou des opérations dangereuses privilégient la reconnaissance, la prévention, les signaux et les limites de compétence, sans tutoriel de manipulation dangereuse ni simulation de manœuvre. Faire valider tout visuel sensible par une personne qualifiée ; préciser lorsqu'un dessin est schématique ou non à l'échelle. Ne pas présenter une image générée ou une scène fictive comme preuve documentaire ou photo officielle. Les textes techniques et cotes d'un dessin créé doivent être contrôlés, idéalement ajoutés en éléments éditables. Aucune erreur visuelle tolérée au motif que le texte est correct.

**THV-04 — Langue et légendes.** Employer les termes techniques exacts en français, cohérents avec le cours, le glossaire et les corrigés. Prévoir un titre ou une légende courte, éventuellement des repères numérotés et une phrase « À observer » ou « À retenir » quand cela aide réellement. Les visuels doivent être professionnels, accessibles, non infantilisants ; privilégier une représentation claire et lisible plutôt qu'un style décoratif imposé. Une figure contenant du texte dans une autre langue reçoit une adaptation autorisée ou une légende explicative en français. Le texte alternatif explique l'information utile, sans remplacer une figure indispensable.

**THV-10 — Bibliothèque originale commune (V2.6).** Créer une bibliothèque d’illustrations dédiée à Doc-Prof pour les théories complètes, les résumés, les glossaires, les exercices et leurs corrigés. Utiliser la génération d’images pour les représentations réalistes et scènes professionnelles, et la construction originale SVG/diagramme/tableau pour les données précises, cotes, flèches, légendes et graphiques. Choisir une identité visuelle cohérente, un style professionnel, des fonds sobres et des textes français lisibles. Les représentations d’EnterSite sont fictives et ne doivent pas être présentées comme des documents d’une entreprise réelle. Les illustrations générées ne sont pas des preuves photographiques. Les contenus sensibles restent centrés sur la reconnaissance et la prévention. La même ressource peut être utilisée pour plusieurs supports et diplômes si ses associations et validations sont correctes ; adapter au besoin la légende, l’échelle ou la version élève/corrigé.

**THV-11 — Production et contrôle.** Pour chaque besoin, rédiger une fiche de création : notion, objectif, sujet, éléments indispensables, éléments à éviter, type de visuel, format, contexte fictif, légende et disposition. Générer ou construire le fichier, vérifier son exactitude technique, corriger toute anomalie, enregistrer méthode/outil de création, révision et empreinte, puis intégrer au bloc de théorie ou à la question. Les figures comportant des données précises privilégient des éléments vectoriels contrôlables ; ne pas faire confiance aux valeurs ou textes générés automatiquement sans vérification. Valider en aperçu A4 et à l’impression. Aucune génération d’image à la volée dans le générateur de fiches ; les visuels sont produits en amont, puis intégrés à la bibliothèque. Un outil de génération précis n’est pas imposé.

### 4.7 Placement et composition dans les fiches de théorie

**THV-05 — Encadré illustré par défaut.** Utiliser les blocs de théorie et encadrés existants, avec bordure discrète et marges internes cohérentes. Placer la figure à proximité immédiate du paragraphe, de la définition ou de l'exemple correspondant. Pour une photo qui reste lisible à cette taille, placer l’image et sa légende dans un encadré à droite du passage associé. Le paragraphe coule à gauche puis reprend la pleine largeur sous l’encadré. Appliquer cette disposition au cours complet et au résumé quand le paragraphe et la largeur disponibles s’y prêtent. Les annotations techniques, les tableaux comparatifs et les frises gardent une largeur adaptée à leur lecture. Ne pas utiliser la couleur comme seul code de lecture.

| Disposition | Quand l'utiliser | Règle de rendu |
|---|---|---|
| Photo encadrée avec habillage du texte | Photo lisible à côté de son explication | La légende suit la photo dans le cadre. Le texte retrouve toute la largeur sous l’encadré. |
| Encadré centré | Paragraphe trop bref, photo à agrandir ou réglage de feuille trop étroit | Image proportionnée, titre et légende regroupés à la pagination. |
| Encadré pleine largeur | Schéma dense, plan, tableau, graphique ou document annoté | Taille de lecture suffisante, annotations et légende visibles |
| Planche comparative de 2 à 4 vignettes | Plusieurs objets ou catégories à distinguer | Échelle relative cohérente lorsqu'elle est significative ; libellé sous chaque vignette |
| Séquence numérotée | Une succession d'actions ou d'étapes à comprendre | Ordre explicite, une courte légende par étape, continuité visuelle |
| Figure avec repères et explication | Parties d'un objet ou zones d'un plan | Repères stables et correspondance non ambiguë dans la légende |
| Illustration intégrée sans cadre | Petit pictogramme ou repère déjà pris en charge par le style commun | Seulement si plus naturel et lisible ; aucune décoration superflue |

**THV-06 — Règles A4.** Réutiliser le moteur de théorie et `WorksheetSheet`, les styles typographiques, marges, encadrés et sauts de page existants. Préserver le rapport largeur/hauteur, ne jamais étirer ou rogner une information essentielle. Dimensionner les légendes et annotations pour la lecture imprimée, y compris en niveaux de gris. Résolution cible proposée pour photos raster : environ 300 ppp à leur taille imprimée lorsque la source le permet ; préférer le vectoriel pour schémas et pictogrammes. La lisibilité réelle prévaut sur le seuil indicatif. Un titre, une figure et sa légende forment un groupe de pagination ; si le groupe ne tient pas, le déplacer ou le scinder logiquement en plusieurs figures légendées, sans dépasser la page ni créer de grands blancs inutiles. Les séquences longues peuvent se poursuivre avec numéros et titre de continuation. Les documents très détaillés peuvent être fournis en annexe numérotée avec renvoi explicite, uniquement lorsque le format intégré ne suffit pas.

**THV-07 — Paramétrage et sauvegarde.** Dans les réglages existants de Théorie, conserver la sélection des sections et proposer l'affichage des illustrations complémentaires, si compatible avec les contrôles actuels. Les figures indispensables à la compréhension restent incluses par défaut et ne peuvent être retirées silencieusement : signaler leur caractère indispensable et fournir une alternative explicative validée si elles sont masquées. Lorsque l'éditeur Libre de théorie existant le permet, étendre ses contrôles communs pour ajouter, remplacer, repositionner ou redimensionner localement une figure, éditer sa légende et choisir un encadré adapté, sans changer le cours canonique. Les modifications restent dans la fiche sauvegardée, à l'instar des images de questions (§3.9). La présence d'images n'ajoute aucun point et ne modifie pas les cinq types d'activité. La fiche élève et le support de théorie sont imprimés avec l'en-tête EPCA déjà spécifié au §8.4.

### 4.8 Inventaire, couverture visuelle et validation

**THV-08 — Plan d'illustration par sous-module et diplôme.** Établir le plan après lecture de la théorie complète et en parallèle de la matrice des notions essentielles (§4.4). Chaque notion ou section est classée `required`, `helpful` ou `not-needed` selon son besoin visuel, avec justification. Pour les figures nécessaires, une référence validée est obligatoire. Les figures utiles sont sélectionnées selon leur apport et les possibilités du gabarit. L'absence de visuel peut être justifiée lorsque le texte ou le tableau suffit ; ne pas imposer un quota de visuels.

| Thème | Exemples de pistes visuelles à examiner (non exhaustifs) |
|---|---|
| 100 — Foundation | Chronologies, flux, catégories de marchandises, schémas de masses et dimensions, représentations de tri |
| 200 — Customer Service | Situations de communication professionnelles, canaux, diagrammes de service, documents fictifs |
| 300 — Procurement Management | Flux d'approvisionnement, réception et identification, bons de livraison annotés, comparaisons de supports de charge |
| 400 — Logistics | Types de stockage, plans simplifiés, adressage, catégories de matériel, pictogrammes de prévention |
| 500 — Production (CFC) | Diagrammes de transformation, flux, tableaux de contrôle qualité |
| 600 — Support and Distribution | Emballages, modes de transport, suivi d'un envoi, documents fictifs de distribution |
| 700 — FICO | Tableau d'inventaire, écarts et graphiques d'indicateurs ; coûts et rentabilité dans les codes CFC concernés |
| 800 — ICT | Interfaces autorisées et anonymisées, identifiants, représentations de données et tableaux |
| 900 — Integrate (CFC) | Diagrammes de projet, chronologies et supports de cas intégrés |

Ces pistes sont des propositions de rédaction, pas un inventaire des figures réellement présentes dans EPCAS ni de nouveaux objectifs officiels. Le choix final se fonde sur le cours applicable au code et au diplôme. Pour le pilote 105, vérifier notamment si les notions de fragilité, périssabilité, dimensions, volume, masse volumique et états de la matière nécessitent des comparaisons visuelles ou schémas ; ne retenir que ce que confirme le cours. Pour les 80 sous-modules CFC et 63 AFP, analyser tous les chapitres, mutualiser les visuels lorsqu'ils sont identiques et approuvés pour les deux diplômes, maintenir des associations et validations distinctes si le contexte ou la légende diffèrent.

**THV-09 — Traçabilité et réception.** Tenir un registre des références visuelles source exclues, des besoins à couvrir, des nouveaux visuels créés et validés, et des besoins non couverts. Pour chacune : code/diplôme, notion, section, ID stable, objectif, source et licence/droit, révision/hash, fichier, dimensions, type, légende/alt, disposition, importance et état de validation. Réutiliser les images essentielles dans le résumé retravaillé lorsqu'elles améliorent la compréhension ; l'aide-mémoire peut n'en garder que les repères prioritaires. Vérifier les liens avec glossaires et exercices, sans révéler dans ces derniers des réponses au-delà des consignes prévues. Une figure indispensable manquante, erronée ou non autorisée bloque la publication de la révision illustrée concernée ; le rapport indique le motif et le travail restant. Le contrôle automatique des références ne remplace pas la validation de fond par le formateur.

### 4.9 Reprise textuelle fidèle et correction linguistique du cours complet (V2.7 — impératif)

**THC-01 — Source.** Pour chacun des 80 sous-modules CFC et 63 AFP, résoudre le champ complet selon §6.4. Archiver le texte brut, son empreinte, la version et la provenance. La version destinée à Doc-Prof conserve tous les titres, sous-titres, paragraphes, listes, exemples, tableaux, chiffres, unités, formules et leur ordre. La transformation en blocs du gabarit existant est une opération de rendu, non de rédaction.

**THC-02 — Correction autorisée.** Relire intégralement chaque cours complet. Corriger les coquilles, accents, orthographe lexicale, conjugaisons, accords, erreurs grammaticales évidentes, espaces typographiques et ponctuation fautive, en respectant le français de Suisse et les conventions métier. Protéger les noms propres (dont EnterSite), références, sigles, code informatique, unités, symboles et termes spécialisés contre les corrections automatiques abusives. Ne pas uniformiser arbitrairement les variantes correctes.

**THC-03 — Interdictions.** Ne pas ajouter de paragraphes, définitions, exemples, règles, anecdotes, exercices ou explications au texte complet ; ne pas supprimer de répétitions, simplifier les phrases, changer le niveau de langue, réorganiser le cours ou compléter un passage de sa propre initiative. Une erreur factuelle, une contradiction, une formule douteuse, une règle de sécurité incertaine ou une ambiguïté de sens est consignée séparément. Ne jamais modifier les valeurs, unités, prescriptions ou faits métier sous couvert de correction orthographique. Soumettre le point au responsable ; bloquer le passage ou la publication concernée si nécessaire. Une rectification de fond explicitement approuvée est une révision distincte, jamais une correction linguistique implicite.

**THC-04 — Illustrations.** Maintenir l'enrichissement visuel §4.6–4.8 : nouveaux schémas, dessins et illustrations générés pour Doc-Prof, positionnés à proximité du texte, préférablement en encadré. Les figures et leurs légendes sont des blocs distincts, sans réécriture des paragraphes. Les anciennes images restent exclues. Les anciens renvois visuels peuvent être raccordés techniquement à une nouvelle figure sans changer les notions ; une référence dont la reconstruction fidèle est impossible reste signalée.

**THC-05 — Traçabilité et contrôle.** Produire pour chaque code/diplôme une comparaison textuelle normalisée (hors mise en page et médias), le journal des changements (emplacement, avant/après, catégorie, motif, statut de revue) et une liste séparée des anomalies de fond. Vérifier l'égalité de l'ordre des sections et la conservation des nombres, formules et termes protégés ; tout écart non autorisé est bloquant. Une source sans faute peut être publiée sans changement textuel après relecture. Aucun texte absent ne doit être remplacé par un cours inventé sans décision explicite.

**THC-06 — Séparation des documents.** La théorie complète corrigée devient la référence pour la rédaction du résumé pédagogique, l'aide-mémoire, le nouveau glossaire et les banques. Le résumé reste entièrement retravaillé conformément à la V2.4 ; il n'est pas une copie abrégée mécaniquement. Les modifications du glossaire ou du résumé ne modifient jamais rétroactivement le cours complet.

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

Rattacher chaque problème de mathématiques ajouté ou repris à une section précise de la théorie du même module. Le calcul doit servir une décision, un contrôle ou une mesure du métier expliqués dans cette section. Donner les hypothèses et les unités utiles dans l’énoncé. Dans le corrigé, nommer la méthode, montrer les étapes et interpréter le résultat lorsque la situation le demande. La relecture des problèmes déjà publiés applique les mêmes critères. Le rattachement est conservé dans les données éditoriales de la banque.

### 5.2 Vérification des connaissances

Cible indicative de 50 unités : 20 questions ouvertes, 10 QCM à quatre propositions (simples ou multiples explicitement signalés), 5 vrai/faux justifiés, 5 textes à trous, 5 associations, 5 classements/ordonnancements, comparaisons ou analyses de documents. Adapter à la nature du module ; les formes sont des réglages internes, pas des types supplémentaires. Chaque unité doit inclure un énoncé autonome, une notion ciblée, une difficulté, une réponse attendue, une explication, les variantes acceptables ou critères d'appréciation, et éventuellement des points et références.

- QCM : une seule bonne réponse sauf mention explicite « plusieurs réponses » ; distracteurs plausibles, non ambigus, sans indice de longueur ou de position systématique. Conserver les réponses par ID stable après mélange.
- Vrai/faux : une proposition claire et une justification au corrigé ; éviter les doubles négations et les questions piégeuses.
- Questions ouvertes : préciser la quantité de réponses demandées (« citez deux… »). Accepter les formulations équivalentes, donner un modèle et des critères, pas une phrase obligatoire.
- Associations/ordre : identifiants distincts, absence d'indices de mise en page, une solution non ambiguë ou variantes explicites. Pour les procédures dont l'ordre dépend du contexte, définir les conditions ou préférer une question ouverte.
- Textes à trous : un trou correspond à une réponse identifiée, variantes orthographiques justifiées. Éviter de tester uniquement le vocabulaire si le cours vise le raisonnement.
- Document/illustration : fournir toutes les informations nécessaires, reproduire correctement les tableaux et images autorisés, et rattacher les questions à une preuve du support.

**Taxonomie de Bloom (proposition éditoriale).** En CFC, viser par banque de 50 : 10 mémoriser, 15 comprendre, 10 appliquer, 8 analyser, 5 évaluer, 2 créer. En AFP : 15 mémoriser, 15 comprendre, 12 appliquer, 5 analyser, 2 évaluer, 1 créer lorsque pertinent. Il s'agit de cibles, pas de niveaux réglementaires ; adapter et documenter en fonction du programme. Les questions difficiles AFP évaluent le transfert de compétences AFP, jamais des notions réservées CFC. Le filtre Bloom est indépendant de la difficulté. Utiliser un verbe d'action mesurable et un critère de réponse ; les niveaux sont renseignés pour chaque unité, sans classification automatique non vérifiée.

### 5.2 bis — Présentations des réponses et textes à compléter (obligatoires)

Le **type** reste « Vérification des connaissances » (ou la sous-question d’une situation / l’entraînement de glossaire). Le **format pédagogique** de l’unité (question ouverte, QCM, texte à trous…) et sa **présentation sur la fiche** sont deux informations différentes. Les sélecteurs de présentation reprennent le style des contrôles existants de Grammaire et TCF, dans le panneau de paramètres de l’activité et, lorsque compatible, par question dans le mode Libre. Aucun sixième type ni nouveau rendu de page.

#### A. Textes à compléter : deux modes

| Mode | Rendu fiche élève | Rendu corrigé |
|---|---|---|
| Sans liste de mots | Un texte suivi comportant de vrais traits d’écriture **inline** à la place des mots manquants ; l’élève écrit dans la phrase. Aucune liste d’aide. | Même texte, mots attendus réinsérés dans les blancs selon le style de correction existant. |
| Avec liste de mots | Même texte et mêmes blancs inline ; liste des mots à utiliser, mélangée, avec leurres facultatifs. Les mots restent dans une liste d’aide séparée, jamais un QCM à chaque blanc. | Même texte complété ; la liste d’aide demeure identifiable et les mots inutilisés peuvent être signalés selon le rendu existant. |

Exemple original pour le 105 : « Une marchandise fragile doit être protégée contre les ________. Le ________ représente l’espace occupé. » Corrigé : « chocs », « volume ». En mode avec liste, afficher par exemple « masse — volume — chocs — prix ». En mode sans liste, afficher exactement le même texte et les mêmes traits, sans aide.

**GAP-01.** Le texte peut contenir une ou plusieurs phrases, paragraphes et plusieurs trous. Chaque trou a un identifiant stable, une ou plusieurs réponses acceptées, une largeur d’écriture adaptée, un ordre stable et une référence au segment du texte. Préserver les espaces, ponctuation, accents et retours. Utiliser les conventions du rendu inline existant (dont `inlineBlankPx` et `src/tcf/inline-blank` lorsque compatibles), pas des underscores textuels figés ni des champs HTML à remplir sur le PDF. Les traits restent imprimables, sans coupure du mot ou du blanc à la marge.

**GAP-02.** En mode liste, inclure chaque réponse attendue, ou le nombre d’occurrences nécessaire si un mot doit être utilisé plusieurs fois. Les leurres sont optionnels (0 ou quantité configurable dans les limites de la banque validée), plausibles mais incorrects pour tous les trous concernés, non ambigus, distincts et de forme grammaticale cohérente. Aucun leurre généré au hasard depuis un autre chapitre, aucun synonyme valide présenté comme leurre. Si les leurres validés manquent, afficher la capacité réelle ; ne pas inventer à la volée. Mélanger l’ordre avec la graine ; sauvegarder l’ordre et les leurres effectivement présentés. Préciser la règle d’utilisation unique ou multiple des mots dans la consigne.

**GAP-03.** Basculer entre les deux modes ne change ni le texte, ni les trous, ni le corrigé de la question sélectionnée. La liste et les leurres sont retirés en mode sans liste, y compris du PDF élève. Les réponses attendues n’apparaissent jamais dans le texte élève. Une modification manuelle du texte vérifie le nombre de trous, les solutions, les variantes et la liste. Pour les points, une unité peut comporter plusieurs trous évalués ; répartir les points explicitement sans compter à la fois le texte et ses trous.

#### B. Questions de connaissances : trois formats de réponse

| Présentation | Rendu imprimable |
|---|---|
| QCM | Énoncé et choix A/B/C/D (quatre propositions par défaut pour les nouveaux QCM), selon le composant existant de Grammaire/TCF. Cases et styles habituels, une ou plusieurs bonnes réponses selon consigne. |
| Lignes numérotées | Énoncé suivi de lignes de réponse numérotées 1., 2., 3., etc., une réponse distincte par ligne. Le nombre de lignes correspond à la quantité de réponses demandées ; la numérotation des réponses est distincte de celle des questions. |
| Lignes simples | Énoncé suivi de traits de réponse non numérotés, avec nombre de lignes réglable, pour définition, explication, justification ou rédaction. Aucun préfixe A/B/C ni numérotation interne. |

Exemples : « Citez trois propriétés des marchandises » appelle trois lignes numérotées ; « Expliquez pourquoi le contrôle de réception est important » appelle des lignes simples ; une question fermée dotée de distracteurs vérifiés peut être présentée en QCM. Les sous-questions d’une mise en situation utilisent les mêmes formats lorsque compatibles.

**ANS-01.** Utiliser les rendus et styles existants de Grammaire/TCF (dont les layouts de question et de lignes). Ajouter seulement la capacité manquante au composant commun si les lignes numérotées ne sont pas déjà réutilisables. Le choix de présentation ne modifie pas l’identifiant canonique, le niveau pédagogique ni l’énoncé en silence. Les formats autorisés sont déclarés par unité et validés à l’avance. Le sélecteur affiche les trois présentations compatibles avec l’unité sélectionnée ; les formats non compatibles sont désactivés ou exclus du tirage avec explication. Une question ouverte ne devient QCM que si des choix et une correction à choix sont approuvés ; ne pas fabriquer de distracteurs au moment de générer. Une question exigeant trois éléments ne doit pas être convertie en un QCM à réponse unique qui supprime deux éléments.

**ANS-02.** En lignes numérotées, stocker le nombre de réponses attendues et préciser si l’ordre est imposé. Les formulations équivalentes restent admises. En lignes simples, le réglage de longueur de réponse correspond aux besoins de rédaction. En QCM, mélanger par ID stable et conserver le choix correct après mélange. Le corrigé utilise les conventions existantes : bonne(s) proposition(s) marquée(s), modèle de réponse/critères pour les lignes, justification lorsqu’elle existe. Conserver les mêmes numéros, énoncés et ordre en mode élève/corrigé.

**ANS-03.** La quantité sélectionnable dépend du stock éligible au format demandé. Les trois formats constituent des présentations des unités, pas trois questions distinctes à compter dans les quotas. Les associations, ordonnancements et autres formats déjà spécifiés en V2.0 restent possibles lorsqu’ils sont pertinents ; ne pas remplacer les trois formats demandés par ces activités. Le mode Texte à compléter conserve ses deux modes indépendants. Les formats de calcul du §5.3 ne sont pas remplacés par les lignes génériques.

### 5.2 ter — Catalogue étendu des formats de questions et d’activités (V2.3)

Le catalogue suivant constitue la spécification fonctionnelle des formats à prendre en charge dans les deux domaines. Il complète les obligations du §5.2 bis ; les exemples sont originaux et illustratifs, non des citations du support EPCAS. V = Vérification des connaissances ; M = Mathématiques ; S = Mises en situation ; G = Glossaires ; T = Théorie (uniquement entraînement à partir de la théorie). Les rattachements sont indicatifs : un format est proposé uniquement si la notion et les données le permettent. Ne pas multiplier artificiellement les unités canoniques pour atteindre les quotas.

#### A. Registre des formats

| ID stable proposé | Format / consigne type | Fiche élève | Corrigé attendu | Types |
|---|---|---|---|---|
| F01 `choice-single` | QCM à réponse unique | Choix A–D, une case par choix | Bonne proposition et justification | V,S,G |
| F02 `choice-multiple` | Cochez toutes les bonnes réponses | Cases multiples, consigne explicite | Ensemble exact des choix corrects | V,S,G |
| F03 `true-false` | Vrai ou faux, avec ou sans justification | Deux cases par affirmation, lignes si justification | Verdict et explication | V,S |
| F04 `numbered-lines` | Citez / énumérez N éléments | N lignes numérotées | N éléments attendus et variantes | V,S,G |
| F05 `plain-lines` | Expliquez, définissez, justifiez | Lignes simples adaptées à la rédaction | Réponse modèle et critères | V,S,G |
| F06 `inline-gap-free` | Complétez le texte sans aide | Traits d’écriture au sein des phrases | Texte complété, réponses alternatives | T,V,S,G |
| F07 `inline-gap-bank` | Complétez avec les mots proposés | Mêmes blancs inline et liste de mots avec leurres facultatifs | Texte complété et mots non utilisés | T,V,S,G |
| F08 `table-gaps` | Complétez le tableau de données | Tableau avec cellules préremplies et cellules vierges | Tableau entièrement complété | V,M,S,G |
| F09 `date-table` | Complétez les dates, durées ou échéances | Tableau chronologique, format de date indiqué | Dates, durées et méthode si calcul | V,M,S |
| F10 `comparison-table` | Comparez deux produits, notions ou solutions | Tableau de critères, cases à remplir | Caractéristiques et comparaisons attendues | V,S,G |
| F11 `classify-table` | Classez les éléments par catégorie | Liste et colonnes de classement vierges | Classement complet, catégories justifiées | V,S,G |
| F12 `matching-text` | Reliez les termes aux définitions | Deux colonnes mélangées, points de liaison | Paires identifiées et traits de liaison | V,S,G |
| F13 `matching-image-term` | Reliez chaque image au terme correspondant | Images identifiées et liste de termes mélangée | Paires image–terme | V,S,G |
| F14 `matching-image-definition` | Reliez les images aux définitions | Images et définitions dans deux colonnes | Paires image–définition | V,S,G |
| F15 `image-identification` | Nommez ce que représente chaque image | Image, trait sous ou à côté ; liste d’aide facultative | Nom précis, synonymes acceptés | V,S,G |
| F16 `image-description` | Décrivez ou définissez ce que montre l’image | Image et lignes simples ou numérotées | Définition, fonction, description ou critères | V,S,G |
| F17 `image-choice` | Cochez l’image correspondant au terme | Plusieurs images en choix, taille homogène | Image correcte et justification | V,S,G |
| F18 `image-classification` | Classez les images | Images numérotées, catégories à compléter | Correspondance image–catégorie | V,S,G |
| F19 `diagram-labels` | Légendez le schéma ou le plan | Repères numérotés, traits ou zones, liste facultative | Schéma légendé et correspondances | T,V,S,G |
| F20 `diagram-observation` | Repérez les anomalies / éléments dans l’image | Image, zones à entourer ou repères à noter | Image annotée et explication | V,S |
| F21 `ordering` | Remettez les étapes dans l’ordre | Étapes mélangées, cases de numérotation | Séquence et variantes autorisées | V,S |
| F22 `timeline` | Replacez les événements dans le temps | Frise, dates ou événements à inscrire | Frise complétée | V,S |
| F23 `flowchart-gaps` | Complétez le processus | Schéma de flux avec cases vides | Étapes et liens attendus | T,V,S |
| F24 `document-reading` | Analysez le document professionnel | Annexe (bon, fiche, tableau, étiquette) et sous-questions | Réponses justifiées par le document | V,M,S |
| F25 `chart-reading` | Lisez et interprétez le graphique | Graphique avec légende, unités, questions | Valeurs et interprétations | V,M,S |
| F26 `chart-completion` | Complétez le graphique à partir des données | Données et axes ou graphique partiellement vide | Graphique complété et tolérances | M,S |
| F27 `find-correct-errors` | Repérez et corrigez les erreurs | Texte, tableau ou document contenant des erreurs ; espace de correction | Erreurs repérées et corrections | V,M,S |
| F28 `decision-justify` | Choisissez une solution et justifiez | Options ou contexte, lignes de justification | Décisions acceptées et critères argumentés | V,S |
| F29 `calculation` | Résolvez le problème | Énoncé, éventuel support, grille de calcul et trait de réponse | Formule, étapes, résultat et unité | M,S |
| F30 `case-mixed` | Traitez une situation professionnelle | Contexte et sous-questions de formats variés | Corrigé par sous-question et barème | S |

Les deux présentations des textes à trous peuvent partager le même contenu canonique ; idem pour les réponses avec et sans aide d’une identification visuelle, si les deux sont validées. Les variantes de présentation ne sont pas des unités originales supplémentaires. Le format F30 est un conteneur de cas, pas une famille de question atomique. Le registre technique peut factoriser des formats partageant un même contrat (ex. association de texte ou d’images), à condition que leurs présentations et filtres restent distinguables.

#### B. Tableaux de données et de dates — contrat obligatoire

- Un tableau contient des en-têtes, des lignes et colonnes stables, des cellules de données fournies et des cellules à compléter explicitement identifiées. Les cellules de réponse peuvent contenir un texte, un nombre, une unité, une date, une durée, une catégorie ou une formule ; les contraintes et variantes acceptées sont typées. Une cellule vide de mise en page n’est pas une question. Permettre une banque d’éléments ou de mots facultative avec leurres vérifiés lorsque pertinent.
- Exemple de données de stock (308) :

| Article | Quantité prévue | Quantité reçue | Écart : reçu − prévu |
|---|---:|---:|---:|
| Cartons A | 24 | 22 | ____ |
| Cartons B | 15 | ____ | +3 |
| Cartons C | ____ | 18 | 0 |

Corrigé : −2, 18, 18 respectivement. L’énoncé fixe la convention de signe. Les calculs disposent de la grille habituelle et du trait de réponse requis pour les problèmes mathématiques, y compris si la réponse finale figure aussi dans une cellule ; ne pas attribuer deux fois les points au même résultat.

- Exemple de dates (406) : fournir des dates fictives d’entrée et de sortie, demander de compléter les durées en jours ou une date manquante avec une convention de comptage explicite. Pour une lecture de dates de lots, fournir les règles du cas et éviter les échéances légales implicites. Dates affichées au format suisse `JJ.MM.AAAA`, année explicite, calcul calendaire reproductible, test des fins de mois et années bissextiles. Une valeur source fournie ne doit jamais devenir un blanc par hasard.
- Mode Libre : ajouter/supprimer/réordonner lignes et colonnes ; modifier en-têtes, largeur et hauteur, cellules données, cellules à compléter, réponse de chaque cellule, unité et barème. Avertir avant de supprimer une cellule contenant une réponse. Prévoir la reprise d’en-têtes en cas de pagination ; interdire de couper une ligne au milieu d’une cellule de réponse. Les tableaux larges utilisent les solutions de mise en page existantes ou sont découpés en parties lisibles, sans réduire abusivement la police.

#### C. Exercices visuels — association, identification, définition

**VIS-01 — Association.** Prévoir deux modes distincts : images à relier à des termes ; images à relier à des définitions ou fonctions. Chaque image reçoit un ID stable, chaque cible un ID stable, chaque paire une correspondance explicite. Afficher des points de liaison et des espaces adaptés aux traits tracés à la main ; option de réponse par lettres/chiffres lorsque les listes sont trop longues. Mélanger les colonnes indépendamment avec la graine, sans perdre les paires. Rendu corrigé avec liens ou tableau de paires lisible ; aucune ligne de solution en mode élève. Si plusieurs associations sont possibles, préciser la consigne et les réponses acceptées ; ne pas imposer artificiellement une correspondance univoque.

**VIS-02 — Identification.** Exemple pour 602 : présenter des illustrations originales distinctes d’un carton, d’une caisse en bois et d’un emballage de protection ; demander leur nom. Prévoir le trait d’écriture directement sous ou à côté de chaque image, ou une liste d’aide avec leurres facultatifs. Une version QCM image est également possible avec des choix validés. Ne pas afficher la légende révélant le nom attendu.

**VIS-03 — Définition / description.** Sur les mêmes images, une unité distincte peut demander « Expliquez la fonction de cet emballage » plutôt que son nom. Prévoir une ou plusieurs lignes d’écriture, numérotées si plusieurs éléments sont demandés. Le corrigé donne fonction, caractéristiques, réponses équivalentes et critères ; une description ne se réduit pas obligatoirement à un mot exact. Si l’image seule ne permet pas de distinguer deux objets, ajouter une information utile sans donner la solution ou bloquer l’exercice.

**VIS-04 — Schéma, repérage et annotation.** Support doté de repères stables (A, B, C ou numéros) ou zones normalisées ; exemple : identifier les zones de réception, stockage et expédition sur un plan d’entrepôt fictif. L’élève écrit la légende ou entoure le repère ; le corrigé montre les annotations, la liste des repères ou les zones attendues. Les positions sont relatives à l’image, jamais des pixels fixes liés à la taille d’aperçu ; elles suivent les dimensions et le redimensionnement. Préserver le contraste et la lisibilité en niveaux de gris. Ne pas dépendre uniquement de la couleur.

**VIS-05 — Ressources.** Les illustrations sont intégrées aux données pédagogiques et aux snapshots, avec droits validés, empreinte, taille et texte alternatif adapté au rôle. Une image-réponse, annotation de correction ou nom de fichier ne révèle pas la solution dans le rendu élève. Les images de choix sont comparables et sans indices parasites ; leur remplacement ou recadrage invalide la validation si la notion représentée change. En Libre, ajouter/remplacer/ordonner les images, associer les cibles, modifier les définitions, repères et corrigés, régler les dimensions et prévisualiser les deux versions. Si un support indispensable manque, bloquer la génération correspondante, sans substituer une image aléatoire.

#### D. Formats d’analyse et de raisonnement

Les frises, classements, ordres, schémas de flux, graphiques et documents à lire utilisent des supports structurés réutilisables. Les valeurs d’un graphique et sa légende doivent être cohérentes avec les données canoniques. Un bon de livraison fictif peut alimenter plusieurs sous-questions sans être répété ; chaque référence au support est explicite. Les documents à corriger distinguent l’erreur intentionnelle d’une erreur de rédaction et définissent les corrections acceptées. Les scénarios de décision et questions ouvertes prévoient une grille de critères, sans imposer une unique rédaction. Toute activité de calcul conserve l’espace de brouillon quadrillé et le trait de réponse du §5.3 bis, y compris dans un document ou un cas mixte. Les exercices restent théoriques et imprimables ; pour les questions de sécurité professionnelle, les supports et corrections privilégient prévention et règles validées, sans remplacer la formation supervisée.

#### E. Couverture éditoriale et comptage

Pour chaque sous-module et diplôme, documenter les formats pertinents, unités approuvées par format, variantes disponibles et lacunes. Diversifier les banques existantes avec des tableaux, des visuels et des supports lorsqu’ils apportent une réelle valeur pédagogique. Ne pas imposer 30 formats à chaque sous-module, ni de quota par format supplémentaire sans validation. Les objectifs de 50 vérifications, 30 maths et 20 situations restent inchangés ; les sous-questions, cellules, trous, paires et repères ne gonflent pas artificiellement ces compteurs. En évaluation, définir les points par cellule, paire, trou, repère ou critère si le format le nécessite ; sommer une seule fois, avec règle explicite de points partiels. Une même unité tirable sous plusieurs présentations compte une seule fois dans la capacité globale filtrée.

### 5.3 Mathématiques appliquées à la logistique

Créer au moins 30 problèmes distincts par sous-thème et diplôme lorsque pertinent (10 faciles, 10 moyens, 10 avancés, hors simples variantes numériques), réparties entre calcul direct, problème contextualisé, calcul inverse, interprétation de tableau et problème à étapes. Un gabarit numérique validé déclare variables, domaines admissibles, unités, formule, contraintes, précision, méthode de correction et exemples tests. Les valeurs proviennent de plages réalistes ; toutes les variantes satisfont les contraintes physiques et métier. Les questions de calcul ne sont jamais mélangées au hasard à d'autres modules sans lien.

Contenus transversaux à employer selon les sous-thèmes : conversions SI, pourcentages directs et inverses, proportionnalité, fractions, quantités, masse brute/nette/tare, volumes et densités, surfaces, capacité palette, taux d'occupation, stocks et écarts, rendement, délais, vitesse/distance/temps, coûts CHF, marges et rentabilité, tableaux de données, analyse ABC. Ne pas supposer de tarif, capacité réglementaire ou taux d'imposition actuel : fournir l'hypothèse dans l'énoncé ou une source datée validée.

**Contrat corrigé numérique :** données utiles → formule symbolique → conversion des unités → substitution → calcul intermédiaire → résultat final avec unité et précision → interprétation lorsque demandée. Définir l'arrondi dans l'énoncé (centime, dixième, entier inférieur/supérieur selon le problème). Les résultats financiers utilisent des règles d'arrondi explicites ; pour des unités indivisibles, distinguer capacité maximale (arrondi inférieur) et besoin minimal (arrondi supérieur). Calculer avec une précision suffisante avant l'arrondi final. Ne jamais accepter un résultat juste avec une unité incompatible. Les cas multi-étapes définissent la dépendance entre réponses et une éventuelle tolérance de suivi d'erreur.

### 5.3 bis — Rendu des problèmes mathématiques : grille de calcul obligatoire

**CAL-01.** Chaque problème mathématique, dans les deux domaines et dans tous les modes (Exercice, Évaluation, Libre), utilise **la grille de calcul/brouillon actuelle de Mathématiques** suivie du trait de réponse actuel. Aucune simple zone de lignes à la place de la grille. Rendu attendu : numéro et énoncé → grille quadrillée permettant de poser les calculs → trait de réponse, avec unité indiquée seulement si la consigne le justifie. Les calculs inclus dans une mise en situation suivent la même règle.

**CAL-02.** Réutiliser le support de grille des `MathItem`, `isDraftPadExercise`, `problemDraftGrids`, `DraftGridControls`, `WorksheetSheet` et le layout de problèmes commun après vérification de leurs contrats. En logistique, la présence de grille est imposée par le type/format mathématique ; une commande générale « masquer les brouillons » ne doit pas la supprimer de ces problèmes. Le contrôle peut ajuster les dimensions de la grille dans les limites existantes, mais pas la désactiver. Ne pas créer une grille propre au CSS logistique.

**CAL-03.** Prévoir assez de cases pour les étapes du calcul. Si l’espace manque, utiliser les mêmes règles de pagination que les problèmes Mathématiques, sans réduire abusivement la grille ou la police. La version élève possède un trait vide et la version corrigée le résultat, les unités et le raisonnement selon le rendu commun. Les points et la numérotation suivent le document ; la grille n’est pas une question supplémentaire. Les deux versions partagent le même problème, données, grille et trait de réponse.

**CAL-04.** Contrôler le rendu de tous les problèmes, y compris les questions importées initialement `source-question` : après conversion éditoriale, un problème numérique approuvé ne peut être publié comme simple bloc de texte sans grille. Les variantes et modifications manuelles restent recalculées ou marquées à vérifier.

### 5.4 Mises en situation professionnelles

Une situation est une unité indivisible de sélection contenant un contexte, un rôle, une mission, des données utiles, éventuellement une annexe, 3 à 8 sous-questions (selon difficulté et diplôme) et un corrigé par sous-question. Varier entreprises fictives, tailles, modes de transport, aléas, flux, interlocuteurs et contraintes, sans utiliser de véritables données personnelles. Exemples : réception non conforme, priorisation, communication avec le client, choix de stockage, contrôle d'un bon de livraison, analyse d'inventaire, décision de distribution, préparation d'une expédition, optimisation de coût.

Prévoir cas guidés (identifier, lire, calculer), cas autonomes (analyser et justifier) et cas complexes (arbitrer et proposer). Un cas ne peut dépendre d'une annexe non disponible. Lorsque plusieurs décisions sont possibles, le corrigé donne une réponse modèle, les conditions de validité et une grille de critères observables. Ne pas imposer une unique réponse pour les situations de jugement. Pour les consignes de sécurité, privilégier identification des risques, mesures de prévention et procédures validées, sans inventer de règle ou de capacité d'engin. Un choix dangereux ne doit jamais être présenté comme une réponse correcte.

**Rédaction des nouveaux cas.** Employer « Vous » et un récit suivi avec des connecteurs (d'abord, ensuite, cependant, enfin). Le contexte doit être autonome, réaliste, fictif et imprimable. Les missions existantes reposant sur une visite virtuelle, une entreprise formatrice ou un lien EnterSite absent doivent être converties en cas autonome avec annexe, ou mises en attente. Garder la trace de l'original. En CFC, cible proposée : 5 cas faciles × 3 questions, 10 moyens × 5, 5 avancés × 8 (105 sous-questions par sous-thème). En AFP, cible proposée : 5 cas faciles × 3, 10 moyens × 4, 5 avancés × 6 (85 sous-questions par sous-thème), avec davantage de guidage et une progression vers l'autonomie. Adapter ces répartitions si les objectifs pédagogiques justifient une autre structure. Les sous-questions ne comptent pas dans les 20 cas. Volume indicatif : 8 400 sous-questions CFC, 5 355 AFP, soit 13 755 occurrences au total, hors unités principales.

**Documents supports.** Prévoir les types réutilisables : bon de commande, bulletin de livraison, facture fictive, fiche de stock, liste de picking, inventaire, étiquette, tableau de production, planning, rapport de non-conformité, graphiques, plans et annexes techniques autorisées. Les valeurs sont cohérentes entre documents, questions et corrigés. Les documents ne contiennent ni identifiants personnels réels ni données de production. Les scénarios AFP utilisent au besoin des documents allégés ou un extrait fidèle, sans masquer des informations indispensables.

### 5.5 Glossaires

**GL-01 — Reconstruction intégrale (V2.7).** Refaire tous les glossaires des 80 sous-modules CFC et 63 AFP, y compris ceux déjà alimentés. Ne pas simplement importer ou corriger les anciens tableaux. Archiver les anciennes entrées pour comparaison, contrôle de couverture et traçabilité ; elles ne constituent pas la banque publiée. Les nouveaux glossaires sont rédigés à partir de la théorie complète applicable et corrigée (§4.9), en cohérence avec le résumé et les exercices.

**GL-02 — Inventaire.** Lire toutes les sections, tableaux, formules et notions du cours ; relever le vocabulaire métier essentiel, les sigles, unités, classifications, objets, méthodes et concepts effectivement enseignés. Comparer avec l’ancien glossaire pour repérer les omissions. Justifier les termes écartés (doublon, hors sujet, non applicable au diplôme). Inclure tous les termes nécessaires même si la cible indicative de 15–30 entrées est dépassée ; aucun remplissage artificiel. Une source manquante ou une définition incertaine est signalée, non inventée.

**GL-03 — Rédaction.** Chaque entrée comporte un terme exact, une définition autonome, claire et précise en français professionnel accessible aux 15–18 ans, une référence au chapitre/notion et son statut de validation par diplôme. Développer les sigles attestés. Ajouter si utile un exemple métier original court, des synonymes exacts, une distinction avec un terme proche, une unité ou une illustration originale. Ne pas infantiliser, utiliser de définition circulaire ni introduire de règle ou notion non attestée. Conserver les conditions et nuances indispensables. Les exemples et définitions nouvelles appartiennent au glossaire, non au corps du cours complet.

**GL-04 — Cohérence et mutualisation.** Une même notion peut partager une définition canonique entre plusieurs sous-modules et diplômes, avec rattachements et approbations séparés. Préserver les sens différents d'un même terme dans des entrées distinctes. AFP et CFC conservent le vocabulaire exigé par leurs objectifs respectifs ; ne pas transformer l'AFP en version enfantine. Harmoniser les définitions avec le résumé et les réponses attendues, sans réécrire silencieusement la théorie complète.

**GL-05 — Présentation.** Dans le type Glossaires actuel, proposer la fiche de référence terme/définition, la sélection des termes, l’ordre alphabétique ou pédagogique et l’affichage facultatif des exemples et nouveaux visuels. Maintenir les variantes existantes prévues : termes à compléter, définitions à compléter, associations texte/texte et image/terme ou image/définition, identification ou description illustrée, cartes imprimables si compatibles. Toute variante d’entraînement possède un corrigé dérivé des mêmes entrées et ne crée pas de sixième type. Utiliser le mode Libre et le moteur A4 communs.

**GL-06 — Illustration.** Les images pédagogiques sont nouvelles, issues de la bibliothèque originale Doc-Prof ; aucun ancien fichier EPCAS/EnterSite. Ajouter une illustration lorsqu'elle permet d'identifier ou de distinguer un objet ou une notion. Ne pas imposer d’image à chaque définition.

**GL-07 — Réception.** Produire une matrice par code/diplôme : terme, identifiant de notion, référence source, définition nouvelle, exemple facultatif, statut, décision de partage, anciens termes rapprochés ou exclus et raison. La cible est 100 % des termes techniques essentiels identifiés, pas un quota fixe de mots. Tester la recherche, les sélections, le rendu et le corrigé, les révisions et la réouverture. Un ancien glossaire simplement recopié n'est pas un livrable conforme.

Exemple original de structure, à vérifier contre le cours concerné :

| Terme | Définition pédagogique | Exemple professionnel facultatif |
|---|---|---|
| Tare | Masse de l’emballage ou du contenant vide. | Un contenant vide pèse 2 kg. |
| Traçabilité | Possibilité de retrouver l’origine et les mouvements d’une marchandise grâce aux informations enregistrées. | Retrouver un lot à l’aide de sa référence. |

### 5.6 Différenciation pédagogique et partage des contenus

| Dimension | AFP | CFC |
|---|---|---|
| Théorie | Socle professionnel et applications directement liées aux objectifs AFP ; résumé réécrit et exhaustif des notions essentielles AFP | Couverture complète du référentiel CFC et approfondissements attestés ; résumé réécrit et exhaustif des notions essentielles CFC |
| Vérification | Consigne explicite, vocabulaire accompagné si nécessaire, exemples de terrain, raisonnement progressif | Définitions, analyse, comparaison, argumentation, transfert entre notions |
| Maths | Données clairement identifiables, conversions et calculs métier guidés puis autonomes | Problèmes à étapes, calculs inverses, comparaison d'hypothèses, analyse d'indicateurs |
| Situations | Mission concrète, contexte court, supports simples, étapes guidées puis choix justifié | Cas plus complexes, documents croisés, arbitrages et solutions argumentées |
| Glossaire | Termes nécessaires à la pratique AFP, définitions claires et exemples | Vocabulaire professionnel complet et nuances techniques |

Ne pas confondre AFP avec « facile » ou un niveau de français A1/A2. Les trois difficultés existent dans les deux formations, selon les connaissances attendues dans chacune. Ne pas retirer une compétence AFP réellement prévue pour rendre une fiche plus simple. Les exercices communs conservent la même précision et le même corrigé, sous réserve d'une double validation d'éligibilité.

**Exemple original de différenciation — 105 Marchandises :** AFP : un carton de 60 × 40 × 30 cm ; calculer son volume en litres à partir des dimensions, puis expliquer pourquoi une indication « fragile » doit être respectée. Corrigé : 72 L ; la fragilité nécessite des précautions adaptées. CFC : deux cartons de mêmes dimensions, de masses 12 kg et 18 kg ; comparer leurs masses volumiques moyennes calculées sur le volume extérieur, puis expliquer pourquoi cette valeur apparente ne permet pas de conclure sur la densité du matériau contenu. Corrigé : 12/0,072 ≈ 166,7 kg/m³ et 18/0,072 = 250 kg/m³ ; les volumes extérieurs comprennent le contenu, l'emballage et les espaces vides. Les chiffres sont des exemples inventés, non des exercices récupérés.

#### 5.6.1 Formulation des questions en français clair

Le mode **Normal** du CFC utilise un français direct et des consignes cohérentes avec la situation de travail. Les paramètres de l’activité permettent de choisir **Normal** ou **FALC** lorsque la banque contient des formulations dans les deux modes. En AFP, le générateur utilise automatiquement la formulation FALC relue quand elle est disponible.

La formulation FALC sépare les données, la tâche et les étapes de réponse par des phrases courtes. Elle conserve les termes techniques nécessaires. Elle peut expliquer un terme de contexte quand sa définition ne fait pas partie de l’acquis évalué. Les deux versions gardent le même exercice, les données et unités, les documents, le corrigé et le barème. Les variantes de formulation partagent le même identifiant et le même tirage.

Les révisions de banque précédentes restent disponibles pour les fiches enregistrées. Changer de formulation garde les corrections et les énoncés modifiés manuellement dans Libre. La recette conserve le choix de l’activité, y compris en double A5. Pour chaque nouveau lot, contrôler le français et la cohérence pédagogique, les deux formulations, la lisibilité des documents imprimés et le nombre de questions traitées par diplôme dans le suivi.

### 5.7 Méthode d'enrichissement par sous-module

1. Résoudre le contenu de référence pour le diplôme, inventorier les objectifs et les notions (identifiants stables), corriger uniquement la langue du cours complet (§4.9), reconstruire le glossaire (§5.5), réécrire et contrôler le résumé conformément au §4, repérer les questions existantes et les éventuelles restrictions de niveau.
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

### 6.1 bis — Migration textuelle et exclusion des médias historiques (V2.6)

- Conserver les textes originaux, leurs identifiants, les tableaux textuels, formules, objectifs, définitions et corrigés autorisés. Garder la provenance et la trace de la déclaration de l’auteur ; vérifier séparément les éléments tiers éventuels.
- Ne transférer aucun fichier image EPCAS/EnterSite, aucune miniature, URL distante, data URI, image incorporée dans une pièce jointe, ni référence exploitable au runtime. Inventorier les anciens renvois et légendes sous forme de métadonnées éditoriales uniquement ; ne pas recopier les fichiers dans l’archive Doc-Prof. La source Git originale reste intacte.
- Rechercher les anciennes ressources déjà importées dans Doc-Prof : produire un inventaire, retirer les références du pipeline et des nouvelles banques, puis supprimer les copies inutilisées après contrôle des dépendances. Ne pas effacer les données des autres domaines, les logos institutionnels ou les fiches historiques sauvegardées. Ne pas réécrire les anciennes recettes en silence.
- Si une figure contient une information indispensable (mesures, repères, données, énoncé), ne pas perdre cette information : reconstruire un support original cohérent avec les données textuelles vérifiables ; en cas d’information insuffisante, demander une précision et bloquer uniquement l’unité dépendante jusqu’à validation. Aucun visuel de substitution aléatoire.

### 6.2 Exemple réel d'erreur à corriger avant publication

Dans `DEMO_101_MATHS_FULL`, exercice « Port de Hambourg », la source donne 93,9 Mt en 2019, soit une hausse de 3 % par rapport à 2018. La source propose 93,9 × 0,97 = 91,083 Mt, mais il s'agit d'un calcul inverse : 93,9 ÷ 1,03 ≈ **91,165 Mt**, ou **91,2 Mt** si l'on choisit l'arrondi au dixième. Le corrigé d'origine est conservé dans le journal ; la réponse pédagogique est corrigée, la précision est indiquée et le formateur valide. Contrôler aussi les totaux, tableaux, unités et réponses de synthèse de toutes les autres questions. Ce constat démontre qu'une simple copie des corrigés est insuffisante.

### 6.3 États et rapport d'import

États distincts : `imported-unreviewed`, `draft`, `reviewed`, `approved`, `blocked`, `not-applicable`, `retired`. Seul `approved` alimente par défaut le générateur normal. Une prévisualisation administrative peut consulter les brouillons si la fonction est prévue, clairement signalée, sans les inclure dans un tirage ordinaire. `not-applicable` exige une justification pédagogique signée et ne peut compter comme une banque complète sans dérogation. La révision d'un contenu approuvé crée une nouvelle version ; la version approuvée précédente reste reproductible.

Le rapport doit produire par sous-module et type : quantité brute source, questions extraites, corrigés appariés, originaux importés, doublons (avec correspondance), problèmes de syntaxe, réponses à revoir, médias manquants, éléments bloqués, nouveaux items rédigés, approuvés, objectif cible, déficit. Chaque candidat source doit être réconcilié dans exactement un statut final, sans perte silencieuse. Produire JSON machine-readable et synthèse Markdown (CSV facultatif). Les chiffres sont issus d'un script et non d'un compteur saisi à la main.

### 6.4 Résolution exacte des variantes AFP

La source EPCAS expose `getLessonBody(lesson, level, mode)` dans `lesson-content.ts`. En CFC, utiliser exclusivement la version CFC. En AFP, le comportement de référence utilise `contentFullAfp ?? contentFull` et `contentSummaryAfp ?? contentSummary` séparément. Dans EPCAS, `attachmentsAfp` absent signifie héritage des pièces CFC ; ce comportement est documenté pour comprendre la source mais ne doit pas être reproduit pour les images dans Doc-Prof. Les pièces jointes visuelles des deux diplômes sont exclues de la migration. Une chaîne vide ou un placeholder AFP est un problème de qualité à examiner, pas une autorisation implicite d'inventer un cours. Le contenu AFP peut être hérité pour le complet et spécifique pour le résumé (ou l'inverse) : valider la cohérence des deux versions source. Cette résolution décrit l'import, pas le résultat éditorial : le résumé Doc-Prof est obligatoirement réécrit à partir du cours complet applicable, avec couverture et validation AFP propres (§4).

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
| Référence à une ancienne image EPCAS/EnterSite, présente ou manquante | Exclure le fichier et son URL du rendu ; conserver le besoin pédagogique, créer un support original et valider le bloc dépendant avant publication. |

Pour une future extraction de données distantes, fournir un export **strictement pédagogique** des modules, leçons, variantes textuelles, questions et métadonnées de publication, sans fichiers d’images EPCAS/EnterSite, sans comptes ni historiques. Conserver les révisions de provenance. Comparer les textes Git et exportés avant toute fusion ; les règles de `curriculum-lesson-merge.ts` peuvent signaler des versions sauvegardées obsolètes. Ne pas créer une connexion Supabase dans Doc-Prof, ne pas importer l'objet AppState complet, ni exécuter de code distant non vérifié. Toute variante publiée non disponible reste une limite documentée.

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
public/assets/logistique/ # bibliothèque originale, par thème et sous-module (§7.2 bis)
docs/logistique/          # cahier des charges, couverture et preuves
```

La structure est une proposition, les conventions existantes de Doc-Prof priment. Ne pas créer une copie de `src/grammaire` ; factoriser les utilitaires génériques uniquement lorsqu'un test de non-régression protège leur comportement. Ne pas faire une seule banque géante ni charger tous les médias ou les banques des deux diplômes au démarrage : segmenter et charger à la demande ou via le mécanisme du build adapté ; valider que le changement de sélection ne génère pas une course asynchrone.

### 7.2 bis — Arborescence obligatoire de la bibliothèque d’images logistique (V2.10)

**IMG10-01 — Emplacement dédié.** Toutes les illustrations pédagogiques livrées avec les banques Logistique AFP et CFC sont rangées sous `public/assets/logistique/`, indépendamment des ressources des autres domaines. Le dossier suit exactement les codes du catalogue : thème (module parent), puis sous-thème (sous-module), puis portée pédagogique. Le préfixe `public/assets/` reprend la proposition du §7.2 ; vérifier sa compatibilité avec le build réel de Doc-Prof avant implémentation, mais conserver le dossier `logistique` et la hiérarchie par code. Ne pas déplacer les logos institutionnels ni les images des autres domaines.

```text
public/assets/logistique/
├── 100/
│   ├── 101/
│   │   ├── commun/       # ressources identiques, validées AFP et CFC
│   │   │   └── log-101-notion-illustration-v001.webp
│   │   ├── cfc/          # ressources exclusivement CFC
│   │   └── afp/          # ressources exclusivement AFP
│   ├── 102/
│   │   ├── commun/
│   │   ├── cfc/
│   │   └── afp/
│   └── ...              # autres sous-modules effectivement présents
├── 200/
│   └── ...              # codes issus du catalogue réel
├── ...                  # autres thèmes du catalogue
└── _communes/           # exception : ressources transversales sans module propriétaire naturel
```

L’arborescence ci-dessus est illustrative ; créer les dossiers à partir du catalogue réel, seulement lorsqu’ils contiennent des ressources. Ne pas créer un dossier AFP pour un sous-module réservé au CFC. Ne pas ajouter de dossiers séparés par théorie, résumé, glossaire ou exercice : une même image doit pouvoir alimenter ces usages sans être dupliquée. Les usages et les formats de visuel sont des métadonnées, pas des copies physiques.

**IMG10-02 — Nommage.** Employer des noms descriptifs en minuscules ASCII, avec tirets, sans espaces ni accents : `log-<code-sous-module>-<notion>-<type-visuel>-v<revision>.<extension>` ; ajouter un discriminant stable si nécessaire. Exemple de nom de fichier, non une attribution réelle au cours 101 : `log-101-notion-schema-v001.svg`. Pour une ressource transversale : `log-commun-<notion>-<type-visuel>-v001.svg`. Bannir les noms génériques `image1.png`, les noms dépendant de l’ordre des questions et les noms de fichiers dupliqués sans justification.

**IMG10-03 — Mutualisation.** Une image identique en contenu et en portée validée pour les deux diplômes existe physiquement une seule fois dans `commun/`. Si elle est utile à plusieurs modules, le registre référence le même identifiant et chemin canonique depuis les autres modules. Utiliser `_communes/` uniquement lorsqu’aucun sous-module propriétaire naturel n’existe ; consigner les codes concernés. Un contrôle d’empreinte SHA-256 détecte les doublons binaires ; les doublons visuels proches sont signalés à la revue. Une différence pédagogique réelle entre CFC et AFP justifie une variante identifiée et validée séparément. Ne jamais étendre automatiquement l’éligibilité d’un visuel au diplôme AFP.

**IMG10-04 — Registre et résolution.** Étendre le registre de figures prévu au §10.2 aux images de tous les types de fiches. Générer un index d’exécution segmenté par sous-module si nécessaire. Pour chaque ressource : ID stable, révision immuable, chemin relatif exact sous `public/assets/logistique/`, empreinte, format, dimensions, taille, thème/sous-module propriétaire, modules associés, diplômes autorisés, notions, usages (théorie, résumé, aide-mémoire, glossaire, vérification, mathématiques, situation, évaluation), légende, texte alternatif, provenance de création, statut et date de validation. Le contenu pédagogique référence l’ID et la révision via le mécanisme commun de médias ; pas de chemins bricolés dans les énoncés ni de dépendance à EPCAS. Les chemins du système de fichiers ne sont pas confondus avec les URL publiques : résoudre celles-ci selon le chemin de base de déploiement.

**IMG10-05 — Production et qualité.** Produire les images originales avant publication des banques ; conserver les fichiers de travail, prompts de création et sources éditables nécessaires hors du dossier public, selon la stratégie documentaire du projet, en les reliant au registre. Aucun ancien visuel EPCAS ou EnterSite, aucun média non validé dans la bibliothèque publiée. Préférer SVG assaini pour les schémas cotés, plans et graphiques ; WebP ou PNG de qualité suffisante pour les illustrations matricielles. Vérifier la lisibilité à la taille réelle imprimée, sans déformation, et optimiser les octets sans compromettre cette qualité. Les seuils de dimensions, poids et résolution sont à fixer d’après les gabarits réels et la chaîne de rendu ; ne pas imposer un recadrage destructeur ni une conversion systématique. Interdire scripts, références externes actives et chemins hors répertoire. Une image nécessaire à la compréhension manquante bloque la publication ou l’impression de l’item concerné, avec diagnostic explicite.

**IMG10-06 — Persistance et images personnelles.** Une révision publiée est immuable tant qu’une fiche enregistrée peut la référencer ; une correction produit une nouvelle révision. La réouverture d’une fiche ne doit pas changer silencieusement ses images. Les images importées par un enseignant en mode Libre relèvent du stockage durable et des droits d’accès existants (§7.4 ter, §8.3) : elles ne sont pas publiées automatiquement dans le dossier statique du dépôt ni exposées aux autres comptes. L’ajout d’une image locale à une fiche ne modifie pas la banque. Le retrait ou nettoyage d’une ressource nécessite un inventaire des références des banques, fiches, modèles et versions ; si l’absence de dépendance ne peut être prouvée, conserver ou archiver la révision de manière résoluble. Les fichiers publics ne doivent contenir ni données personnelles ni éléments dont la diffusion publique serait interdite ; si les conditions de diffusion imposent un accès restreint, utiliser le mécanisme protégé du projet avec la même classification logique.

**IMG10-07 — Ergonomie et performances.** Dans le panneau existant de sélection d’images, proposer en priorité les ressources du ou des sous-modules actifs, filtrées selon le diplôme et le contexte ; permettre une recherche par notion et un accès aux ressources transversales approuvées. Les mêmes ressources sont utilisables en mode Libre, avec les réglages locaux d’image et l’aperçu immédiat définis dans les cahiers des charges. Aucun nouveau panneau autonome. Ne charger à la demande que les vignettes nécessaires ; charger les images définitives avant pagination et export, et préserver la réserve de 25 px au-dessus du pied de page. Respecter la visibilité élève/corrigé et le verrouillage des questions.

### 7.3 Points d'intégration réels

| Fichier / zone existante | Intervention attendue |
|---|---|
| `src/math/types.ts` | Ajouter les domaines stables `logistique-cfc` et `logistique-afp`, types d'options et snapshot ciblés ; réutiliser `MathItem`, `PageConfig`, `WorksheetPage` et layouts existants. |
| `src/math/catalog.ts` | Brancher les thèmes et types des deux domaines ; valeurs initiales, recherche du type, éligibilité des grilles de problèmes. Retirer les exceptions provisoires qui empêchent le parcours commun. |
| `src/math/generate.ts` | Ajouter une délégation `tryGenerateLogistiqueBlock` au dispatcher `buildPage`. Aucun tirage dans les composants. |
| `src/access.ts` | Ajouter les deux domaines dans les options d’accès existantes, avec permissions indépendantes ; vérifier admin/full/partial et comptes personnels. Proposition : pilote admin, accès autorisé par configuration à la publication ; aucun changement silencieux des droits des autres domaines. |
| `GeneratorPage.tsx`, `Header.tsx`, `DomainShell.tsx`, `PrintableDocument.tsx`, `branding.css` | Réintégrer les deux domaines dans le parcours standard ; supprimer le shell, le résultat et l’impression parallèles une fois leurs usages migrés et les données protégées. Rétablir ClairFLE dans la fenêtre. Garder la marque EPCA seulement dans le chrome imprimable. |
| `LibreSidePanel.tsx`, `GenericLibreEditor.tsx`, `DraftGridControls.tsx` | Réutiliser le mode Libre et les contrôles de grille ; ajouter sélection par lot/individu, création et édition locale des questions et corrigés par format, gestion d’images par instance ; empêcher la suppression de la grille logistique. |
| `src/components/WorksheetImage.tsx`, mécanisme `imageOverrides` et contrôles média existants (à confirmer dans la révision d’implémentation) | Réutiliser import/sélection, rendu d’images et réglages de dimensionnement ; étendre la liaison stable question–média, visibilité élève/corrigé, stockage durable et pagination sans nouvelle interface. |
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

### 7.4 bis — Extension des contrats de sélection et de présentation

Étendre les contrats existants (`PageConfig`, `ExerciseBlock`, `MathItem`, `WorksheetPage`, snapshots et recettes) de manière additive. Les noms ci-dessous sont des propositions ; les conventions du dépôt priment. L’implémentation ne doit pas constituer un deuxième modèle de document ni une deuxième sauvegarde indépendante.

```ts
type LogisticsSelection = {
  submoduleIds: string[]       // un ou plusieurs IDs du même diplôme
  allocation: { kind: 'total'; count: number; balanced?: boolean }
            | { kind: 'per-submodule'; counts: Record<string, number> }
  manualUnitIds?: string[]    // sélection explicite, dans l’ordre demandé
}
type LogisticsPresentation =
  | { kind: 'choice' }
  | { kind: 'numbered-lines'; expectedCount: number }
  | { kind: 'plain-lines'; lines: number }
  | { kind: 'inline-gap'; wordList: false; blankWidth?: number }
  | { kind: 'inline-gap'; wordList: true; distractorCount: number; blankWidth?: number }
  | { kind: 'calculation'; grid: true; answerLine: true }
type LogisticsSelectedItem = {
  unitId: string; revision: string; submoduleId: string; bankRevision: string
  instanceId: string; origin: 'draw' | 'manual'; locked?: boolean
  presentation?: LogisticsPresentation
  // payload, correction, points, options/leurres mélangés, supports,
  // valeurs instanciées et modifications locales figés via le snapshot commun
}
```

La configuration active garde la sélection ordonnée des sous-thèmes, la stratégie de quantité, les filtres, la graine par bloc et la présentation de chaque item. Le snapshot multi-banques garde toutes les révisions et les références aux supports, sans supposer un seul `submoduleId` ni une seule révision de banque. Un même ID canonique peut avoir plusieurs rattachements ; ne compter qu’une unité dans un tirage combiné. En mode par sous-thème, affecter explicitement un rattachement et réserver l’unité pour éviter le double comptage. Stocker les résultats de sélection effectivement générés, pas seulement les paramètres du tirage. Prévoir une migration non destructive des snapshots v1 mono-module vers une liste contenant un seul sous-module ; préserver leurs contenus et corrigés figés.

Valider côté moteur, recettes et accès API : liste non vide, IDs du bon diplôme, type admissible, quantité positive et capacité, formats compatibles, IDs de choix et de trous, liste de mots/leurres valides, nombre de lignes, grille obligatoire. Les `source-question` importées restent conservées dans les sources éditoriales ; avant publication, les adapter en items structurés compatibles avec les rendus communs et leurs corrections. Ne pas les afficher comme Markdown brut dans une page parallèle. Le moteur logistique peut produire un résultat métier intermédiaire ; un adaptateur le convertit en `MathItem[]` et métadonnées de blocs que le dispatcher et le rendu commun savent consommer.

### 7.4 ter — Contrat des éditions libres et des médias par instance

Étendre le snapshot commun et les structures existantes, sans créer un stockage de fiches parallèle. Exemple de contrat conceptuel à adapter aux unions discriminées actuelles et aux références médias communes :

```ts
type LocalItemOrigin =
  | { kind: 'bank'; canonicalId: string; revision: string; bankRevision: string }
  | { kind: 'local' }
type LocalQuestionImage = {
  attachmentId: string; instanceId: string; assetRef: string; contentHash: string
  visibility: 'student-and-answers' | 'answers-only'
  role: 'illustration' | 'required-support'
  caption?: string; alt?: string
  placement: 'above' | 'below' | 'beside'
  width?: number; alignment?: 'left' | 'center' | 'right'
  order: number
}
type LocalQuestionEdit = {
  instanceId: string; origin: LocalItemOrigin; submoduleId: string
  typeId: string; edited: boolean; locked: boolean
  correctionState: 'confirmed' | 'needs-review' | 'incomplete'
  attachments: LocalQuestionImage[]
  // Énoncé, payload typé, correction, points et présentation sont
  // conservés dans l’item/snapshot commun, avec l’original de banque si applicable.
}
```

Ce schéma est indicatif : `assetRef`, métadonnées, unités de dimension et états sont à raccorder aux mécanismes effectivement utilisés par le dépôt. Séparer l’ID canonique de l’ID d’instance de fiche et l’ID d’association image-question de l’identité de la ressource média. Deux copies peuvent référencer le même binaire immutable tout en possédant des réglages d’image différents. Une duplication d’item crée de nouveaux IDs d’instance et d’association. Une suppression retire l’association locale ; ne pas supprimer un fichier partagé encore référencé. Une réorganisation ne réattribue pas les images par index. Préserver l’original de banque, les éditions effectives et le statut du corrigé, sans stocker de données dupliquées inutilement.

Valider les contraintes propres aux formats, les liens entre sous-questions et supports, le diplôme, les droits de lecture des ressources, leur type et taille, et les points. Les brouillons locaux sont distingués des banques approuvées : ils ne passent pas par les tirages ordinaires, ne comptent pas dans les quotas et ne sont pas publiés automatiquement. Toute conversion d’un ancien snapshot conserve les images préexistantes et n’exige pas de les réimporter ; un snapshot sans média doit continuer à s’ouvrir. Aucune ressource temporaire ni dépendance à l’état actuel d’une galerie modifiable ne peut être l’unique référence d’une image sauvegardée.

### 7.4 quater — Contrats extensibles des formats (V2.3)

Le registre de formats expose pour chacun : identifiant, libellé, catégories compatibles, validateurs du payload et du corrigé, options de présentation, adaptateur vers les items du rendu commun, éditeur Libre et comptage des points. Factoriser les contrats plutôt que recopier trente composants. Exemple conceptuel (adapter aux types existants, pas un modèle de fiche parallèle) :

```ts
type FormatRef = { formatId: string; revision: string }
type AnswerValue =
  | { kind: 'text'; accepted: string[]; criteria?: string[] }
  | { kind: 'number'; value: number; unit?: string; tolerance: number }
  | { kind: 'date'; isoDate: string }
  | { kind: 'category'; acceptedIds: string[] }
type TableCell = { id: string; rowId: string; columnId: string } &
  ({ role: 'given'; text: string } |
   { role: 'blank'; answer: AnswerValue; points?: number })
type TablePayload = {
  columns: { id: string; label: string }[]; rowIds: string[]; cells: TableCell[]
}
type MatchNode = { id: string } &
  ({ kind: 'text'; text: string } | { kind: 'image'; assetRef: string })
type MatchingPayload = {
  left: MatchNode[]; right: MatchNode[];
  pairs: { leftId: string; rightId: string; points?: number }[]
}
type VisualTarget = {
  id: string; assetRef: string;
  anchor?: { x: number; y: number }; // coordonnées normalisées 0..1
  answer: AnswerValue; points?: number
}
```

Les corrections canoniques et les données effectivement imprimées sont dérivées d’une même source, mais la projection élève exclut les réponses des cellules, paires, repères et mots cachés. Les tableaux, images et repères référencent des IDs stables d’instance et de support ; les IDs de lignes, colonnes et cellules ne dépendent pas de l’ordre. Les réponses ouvertes d’image-description disposent de critères et variantes au même titre que les réponses ouvertes textuelles. Les ordonnancements, classifications et graphiques disposent de contrats analogues (données source, ordre instancié, réponses par ID, valeurs et unités, critères). Les versions anciennes sans ces champs restent compatibles.

Le snapshot commun conserve la sélection, les formats effectifs, l’ordre mélangé, les données et corrections de chaque cellule/pair/repère, les supports immuables, les paramètres et les éditions locales. Pas de recalcul silencieux au chargement. Les validations refusent les ID inconnus, les cellules de réponse sans correction, les paires orphelines, dates invalides, repères hors image, valeurs numériques incohérentes et supports indisponibles. Les éditions locales invalides restent sauvegardables en brouillon selon les règles V2.2, mais le corrigé incohérent n’est pas exportable comme validé. Les réponses de la banque ne sont pas modifiées par le mode Libre.

### 7.4 quinquies — Contrat des résumés et de la couverture pédagogique (V2.4)

Les noms suivants sont indicatifs ; adapter les structures aux contrats déjà présents sans créer un moteur de théorie parallèle. Le résumé retravaillé est une variante éditoriale de la théorie du module, non un nouvel exercice ni un nouveau type.

```ts
type EssentialConceptCoverage = {
  conceptId: string
  sourceSectionIds: string[]
  technicalTerms: string[]
  priority: 'essential' | 'complementary'
  summaryBlockIds: string[]
  glossaryIds: string[]
  relatedExerciseIds: string[]
  decision: 'covered' | 'condensed' | 'omitted' | 'pending'
  rationale?: string
  reviewStatus: 'pending' | 'validated' | 'blocked'
}
type TheorySummaryRevision = {
  id: string
  revision: string
  diploma: 'CFC' | 'AFP'
  submoduleCode: string
  fullTheoryId: string
  fullTheoryRevision: string
  fullTheoryHash: string
  sourceSummaryRef?: string
  summaryBlockIds: string[]
  coverage: EssentialConceptCoverage[]
  status: EditorialStatus
  review?: { reviewerId: string; reviewedAt: string; notes?: string }
}
```

Le cours complet, le résumé source archivé, le résumé retravaillé et l'aide-mémoire ont des références et révisions distinctes. Les blocs du résumé utilisent les structures de rendu de théorie existantes. Le générateur résout uniquement une variante approuvée pour le diplôme et la révision demandés ; il ne fabrique aucun résumé à la volée. Une révision mutualisée conserve les approbations par diplôme. Les recettes sauvegardées figent le texte et les supports sélectionnés ou des références immuables ; une mise à jour ne change jamais rétroactivement une fiche. Le validateur vérifie les références, les termes essentiels et les décisions de couverture, les droits et la cohérence des statuts. Il ne déduit pas automatiquement une approbation pédagogique d'un score lexical.

### 7.4 sexies — Contrat des figures pédagogiques de théorie (V2.5)

Réutiliser les références médias et structures de théorie existantes ; étendre les blocs communs de manière additive, sans moteur d'impression spécifique. Exemple conceptuel, noms à adapter :

```ts
type TheoryVisualNeed = {
  conceptId: string; sectionId: string
  importance: 'required' | 'helpful' | 'not-needed'
  rationale: string; figureIds: string[]
  status: 'pending' | 'validated' | 'blocked'
}
type TheoryFigure = {
  id: string; revision: string; sectionId: string; conceptIds: string[]
  assetRefs: string[]; assetHashes: string[]
  kind: 'photo' | 'drawing' | 'comparison' | 'sequence' | 'diagram' |
    'plan' | 'timeline' | 'chart' | 'document' | 'interface'
  title?: string; caption: string; alt: string; learningPurpose: string
  placement: 'below' | 'beside' | 'full-width' | 'comparison-grid' | 'sequence' | 'inline'
  framed: boolean; width?: number; alignment?: 'left' | 'center' | 'right'
  importance: 'required' | 'helpful'
  source: Provenance[]; eligibleLevels: ('CFC' | 'AFP')[]
  reviewByLevel: Partial<Record<'CFC' | 'AFP', { status: EditorialStatus; revision: string }>>
}
```

Une figure se rattache à un bloc de texte ou une section stable, jamais seulement au numéro de page. Plusieurs figures peuvent partager le même fichier immutable ; les légendes, tailles, placements et approbations restent propres à leurs associations. Conserver l'ordre des éléments de planche/séquence et les repères. Révisions du cours complet, figures et plan de couverture visuelle sont reliés ; une modification sémantique du cours entraîne une relecture des associations concernées. Figer la révision des médias et les réglages dans les recettes ; une modification de la banque ou de la galerie ne change pas une fiche ancienne. Vérifier les droits, l'intégrité et la disponibilité des fichiers avant publication ; les imports locaux suivent la validation de médias déjà prévue au §7.4 ter. Aucun service de génération d'images à la volée n'est requis ; les créations originales sont préparées et revues éditorialement avant mise en banque.

### 7.4 septies — Contrat de conception des évaluations (V2.9)

Étendre les contrats existants, sans créer un second moteur. Modèle conceptuel à adapter aux types partagés : `EvaluationConfig` (diplôme, modules, mode narratif, activités, quotas, cible points/durée, règles de tirage et identifiants retenus) ; `EvaluationSnapshot` (révision de la configuration, graine, versions des banques et trames, instances, état de verrouillage, barèmes, estimation, corrigés et supports) ; `NarrativePassage` (ID, étape, texte généré, éventuelle surcharge manuelle, protection, dépendances) ; `ScenarioData` (ID de donnée, valeur typée, unité, provenance, règles et références) ; `EvaluationItemMeta` (Bloom validé, difficulté, objectifs, critères/points proposés et appliqués, durée indicative, surcharge manuelle, lien d'étape). Les noms sont indicatifs, les invariants sont obligatoires.

Les relations question/support/donnée/passage/correction utilisent des IDs stables. La modification d'une donnée est une transaction réversible : calculer les dépendances affectées, valider le résultat candidat, détecter les conflits avec les protections, puis appliquer atomiquement les changements compatibles. Les cycles de dépendance ou références orphelines doivent être rejetés. Les mises à jour de l'aperçu ne déclenchent jamais un tirage aléatoire implicite. Les métadonnées pédagogiques, barèmes et temps réellement appliqués sont conservés au niveau de l'instance, sans mutation de la banque. Pour une création manuelle, permettre le renseignement des métadonnées et signaler les champs non renseignés dans le bilan. Ne pas inventer de classification Bloom fiable pour du texte arbitraire.

Un modèle sauvegardé contient les contraintes réutilisables, les éventuelles instances explicitement imposées et la version de schéma ; un document figé contient les données effectivement imprimées. Réutiliser les mécanismes de sérialisation et de stockage communs. Les recettes antérieures sans ces champs se rouvrent à l'identique, sans narration ajoutée par migration. Les instantanés complets, y compris textes modifiés, sont prioritaires sur la réinterprétation d'un ancien tirage.

### 7.5 Sécurité, accès et compatibilité

Les deux domaines ont des autorisations indépendantes dans le système Doc-Prof existant : un compte autorisé AFP seulement ne doit pas pouvoir créer, sauvegarder ou ouvrir une fiche CFC non autorisée. Tester les recettes mixtes si cette fonctionnalité est supportée. Une vue partagée ne confère pas l'accès à tout le stock CFC. Ne pas modifier les règles des comptes d'autres domaines. Le contenu imprimé doit afficher le diplôme et le code du sous-thème ; le mode élève ne doit pas contenir les corrigés dans le PDF. Une correction pédagogique n'est pas une garantie de confidentialité d'un fichier client : conserver la séparation d'accès du produit sans promettre une protection DRM. Assainir HTML/Markdown et chemins de médias ; refuser les URLs actives ou scripts injectés. Ne pas exposer de secrets ni de données EPCAS dans les exports, logs ou tests.

## 8. Génération, impression et sauvegarde

### 8.1 Tirage reproductible et sélection

- GEN-01 : le générateur reçoit le domaine/diplôme, le type, le ou les codes de sous-modules, les filtres, la stratégie de quantité, les IDs manuels éventuels, la graine et les versions des banques. Il ne dépend ni de l'heure ni de `Math.random()`. Utiliser les utilitaires `createRng`, `shuffle` et `pick` existants ; définir un ordre stable des unités avant le tirage.
- GEN-02 : tirer sans remise. Pour une fiche comportant plusieurs blocs du même type et sous-module, éviter les doublons entre blocs tant que la banque le permet. Un cas complet compte comme une unité, ses sous-questions gardent leur ordre. Le nombre de questions disponibles reflète le filtre et le statut approuvé.
- GEN-03 : ne jamais compléter une banque insuffisante par une banque hors sélection ou par des doublons ; en mode quotas par sous-thème, ne pas reporter le déficit sur un autre sous-thème sans accord explicite. Plafonner, afficher le nombre réel et laisser l'enseignant élargir les filtres. Une banque vide ne génère pas de page blanche ni de texte fictif.
- GEN-04 : pour les problèmes paramétriques, conserver les variables instanciées, le résultat, la formule et la solution détaillée. Échantillonner des combinaisons admissibles, éviter des variantes identiques et limiter les tentatives en cas de contraintes impossibles.
- GEN-05 : la théorie et les glossaires de référence sont déterministes sans tirage aléatoire ; les sections retenues gardent leur ordre. Le glossaire d'entraînement facultatif peut mélanger les entrées sélectionnées.
- GEN-06 : les boutons Générer et Régénérer reprennent les comportements de Doc-Prof. Une régénération locale ne modifie pas les autres blocs ni leurs corrigés. En mode libre, changement d'énoncé, d'option ou de valeur exige une mise à jour cohérente du corrigé ; marquer le bloc « à vérifier » si l'édition rend la solution incertaine.

### 8.2 Feuilles, pagination et mise en page

| ID | Critère de rendu |
|---|---|
| PDF-01 | Même feuille A4 fixe de 210 × 297 mm, même chrome institutionnel, mêmes réglages d'échelle typographique, même aperçu et même moteur d'impression que Doc-Prof. Pas de deuxième système CSS d'impression. |
| PDF-02 | Respect de l'en-tête, pied, numéros de pages, choix de police, couleurs de thème et titre personnalisé. Titre automatique de la fiche : « Mathématiques : module 101 » (même convention AFP/CFC), selon §8.6. Le diplôme figure dans l’en-tête EPCA. Le titre personnalisé reste prioritaire. |
| PDF-03 | En-tête des tableaux répété si nécessaire ; titres jamais isolés en fin de page ; images dimensionnées sans distorsion ; formules lisibles, symboles et unités corrects. |
| PDF-04 | Laisser suffisamment de place pour écrire à la main : QCM compact, traits inline avec/sans liste, lignes numérotées ou simples, grille de calcul Mathématiques et trait de réponse obligatoires pour chaque problème, espace variable pour les cas. Ne pas réduire la police pour tout faire tenir sur une feuille. |
| PDF-05 | Énoncé et support indispensables sur la même page ou un renvoi clair à l'annexe. Un cas long peut s'étendre sur plusieurs pages avec titre de continuation ; ne pas couper une sous-question ou sa zone de réponse de façon incohérente. |
| PDF-06 | Une colonne par défaut pour les théories, cas, problèmes longs et tableaux ; deux colonnes uniquement pour unités courtes compatibles et selon les réglages existants. Si le format double A5 est proposé, valider sa pagination ou le désactiver explicitement pour les contenus incompatibles. |
| PDF-07 | Version élève sans réponses, sans indices involontaires, sans textes cachés encore imprimés ; version corrigé avec les mêmes identifiants, ordre, numéros et variantes que la fiche élève. Impression du corrigé facultative, jamais une nouvelle génération. |
| PDF-08 | En mode points, total calculé sur les unités réellement sélectionnées, sous-questions additionnées sans double comptage, points partiels définis. Théorie et glossaire de référence ne reçoivent aucun barème. |
| PDF-09 | Aucun débordement, chevauchement, tableau rogné, page vide non demandée, en-tête superposé, image manquante ou coupure de texte. Contrôler en couleur et en niveaux de gris. |
| PDF-10 | Figures de théorie intégrées près du texte concerné, encadrées par défaut ou avec disposition adaptée (§4.7), proportions respectées, titre et légende solidaires, repères lisibles, repli vertical si nécessaire ; même pagination et en-tête que les fiches existantes. |

Les rendus doivent réutiliser `WorksheetSheet`, les layouts existants et le moteur de pagination. Un nouveau layout est autorisé uniquement s'il représente un besoin non couvert, avec tests et compatibilité de sauvegarde. Le PDF est produit par le parcours d'impression existant ; pas de nouvelle dépendance de génération PDF par défaut.

### 8.3 Recettes et compatibilité

Sauvegarder le domaine et le diplôme (cohérents), le thème, tous les sous-thèmes par activité, le type, les filtres, les quotas, les sélections manuelles ordonnées et verrouillages, les modes de présentation et choix/leurres, les paramètres de grille, la graine, les paramètres d’impression, les sélections de chapitres/termes, les points et les modifications libres selon le contrat `FicheRecipe`. Introduire un snapshot logistique versionné : IDs canoniques, version de banque, données instanciées, correction, supports et empreintes. Pour théorie et glossaire, figer les blocs et entrées ou garantir une révision immuable accessible. Tester l'ouverture après mise à jour ou retrait d'une banque. Une recette dont la révision manque doit être signalée et ne doit jamais être reconstruite avec un autre corrigé en silence. Vérifier l'intégrité, les limites de taille, la validation côté API et le contrôle d'accès existant. Les fiches Grammaire et des autres domaines enregistrées avant ce chantier doivent s'ouvrir à l'identique.

**Complément V2.2 — fidélité des éditions libres et médias.** La recette sauvegarde la sélection, les nouveaux items locaux, les versions effectivement modifiées des énoncés et corrections, formats, trous, options, barèmes, états de contrôle, verrouillage et associations d’images par instance. Le stockage binaire réutilise le mécanisme de médias existant ou une extension compatible de celui-ci ; vérifier les limites de la recette et du serveur avant de choisir la représentation. Ne pas gonfler systématiquement les recettes avec des copies base64 multiples. Figer les fichiers et leur empreinte ou garantir leur disponibilité immuable avec contrôle d’accès ; préserver les dimensions, ordre, alignement, recadrage éventuel, légendes et visibilité. Attendre la disponibilité des images avant le calcul final des sauts de page et l’impression ; en cas d’échec, signaler le support manquant au formateur, bloquer la sortie d’un item qui en dépend et permettre réparation. Le PDF élève exclut les images réservées au corrigé. La suppression d’une fiche ne supprime pas les ressources référencées ailleurs. Les exports de recettes existants doivent être testés avec les nouveaux médias et signaler toute dépendance non incluse, plutôt que promettre une réouverture fidèle impossible.

**Complément V2.9 — évaluations.** Enregistrer le format narratif, la structure, les passages et leurs surcharges manuelles, leurs verrouillages et dépendances, les données instanciées, la couverture, les barèmes par critère, les durées estimées et la durée cible, les éventuelles variantes et leurs corrections. Réouvrir sans régénération implicite. La réutilisation de modèle constitue une nouvelle action explicite. Respecter la réserve de pagination V2.8 ; les transitions ne peuvent rester isolées en bas de page. Le document élève et le corrigé proviennent du même instantané. Voir §3.11 et §7.4 septies.

### 8.4 En-tête de la fiche : personnalisation EPCA limitée au document

| Domaine de la fiche | Logo dans l’emplacement institutionnel existant | Libellé à l’emplacement de « Classe d’accueil » |
|---|---|---|
| Logistique CFC | EPCA | Logistique CFC |
| Logistique AFP | EPCA | Logistique AFP |
| Tous les autres domaines | Logo actuel, dont État du Valais selon la configuration habituelle | Libellé habituel / configuration enregistrée |

**BRAND-01.** Dans `InstitutionalDocumentHeader` de `PrintDocumentChrome.tsx`, résoudre le logo et le nom affiché d’après le **domaine réel de la feuille/document** (pas le menu actif, le dernier bloc consulté ou une valeur globale persistante). `EPCA_LOGO_SRC` et `logistiqueDomainLabel()` existent déjà et peuvent être réutilisés. L’en-tête de la fenêtre (`Header.tsx`) doit rester identique à celui des autres domaines, avec son logo ClairFLE. Les logos restent des ressources locales. L’aperçu A4 et le PDF doivent afficher exactement la même identité. L’asset EPCA fourni est recadré, conserve ses proportions et doit rester lisible en noir et blanc et en couleur ; ne pas déformer le logo ni créer un nouveau bandeau.

**BRAND-02.** Les deux substitutions sont automatiques, non facultatives, en mode Exercice, Évaluation, Libre, version élève et corrigé, sur chaque en-tête prévu par le gabarit existant. Si l’enseignant masque volontairement l’en-tête via l’option commune, respecter cette option. Les positions, tailles, marges, police, ordre des champs et disposition de l’en-tête restent inchangés. Ne pas ajouter de second en-tête, bandeau rouge, bloc de révision, ou titre d’application spécifique sur la fiche. Les autres réglages d’en-tête/pied (année scolaire, cours, titre, nom/prénom/date, référence, etc.) conservent leur fonctionnement. Les autres lignes institutionnelles n’ont pas de nouveau texte imposé par la demande ; les laisser configurables et faire valider un éventuel libellé EPCA plutôt qu’inventer une affiliation administrative.

**BRAND-03.** La personnalisation est dérivée au rendu, sans écraser la configuration État du Valais / Classe d’accueil des autres domaines. Passage CFC → AFP → Grammaire → CFC : afficher le bon logo et libellé à chaque fois, sans contamination des préférences ni du logo de la fenêtre. Une recette sauvegardée puis rouverte affiche l’identité du diplôme sauvegardé. Vérifier aussi le document multipage, le corrigé et l’impression en lot.

### 8.5 Pagination automatique et réserve de 25 px avant le pied de page (V2.8 — impératif)

**PAG-01 — Limite physique.** Chaque page du document conserve le gabarit actuel de Doc-Prof, son format papier, ses marges, son en-tête et son pied de page. Réutiliser `WorksheetSheet`, la mesure des contenus, la pagination commune et le parcours d’impression existants. Ne pas créer de rendu logistique parallèle ni de CSS d’impression global concurrent.

**PAG-02 — Réserve obligatoire.** Dans les deux domaines logistiques, prévoir au minimum **25 px CSS entre le bord inférieur du dernier contenu imprimable et le bord supérieur du pied de page** sur chaque page, soit environ 6,61 mm à 96 px/pouce. Cette réserve est comprise dans la zone utile, sans déplacement du pied ni modification des marges institutionnelles. Elle n’est pas matérialisée par un trait, une couleur ou un encadré imprimé. Mesurer en coordonnées de mise en page non zoomées, pas en pixels d’écran dépendants du zoom ou du DPR. Si le moteur possède déjà un espacement supérieur, le conserver ; ne pas ajouter inutilement une seconde réserve. En cas de chrome masqué, appliquer par cohérence la réserve avant la limite inférieure de la zone de contenu existante (choix de conception proposé).

**PAG-03 — Mesure.** Déterminer la limite de contenu à partir de la géométrie réelle du gabarit : `limite = hautPiedDePage - 25`, dans un repère commun en pixels CSS. Inclure marges, espacements, bordures, encadrés, légendes, lignes de réponse et grilles de calcul dans la mesure. Ne pas utiliser un nombre fixe de caractères ou de lignes par page. Attendre la disponibilité des polices et des médias avant la pagination définitive. Si le contenu suivant excède la limite, le répartir ou le déplacer selon les règles ci-dessous. L’aperçu et l’impression utilisent les mêmes blocs paginés ; vérifier les dimensions effectives du PDF.

**PAG-04 — Coupures sémantiques.**

| Contenu | Règle de coupure |
|---|---|
| Théorie complète ou résumée, aide-mémoire | Continuer naturellement entre paragraphes ou lignes ; conserver au moins deux lignes de paragraphe de chaque côté d’une coupure lorsque possible ; ne jamais supprimer, répéter ou reformuler le texte pour le faire tenir. |
| Titres et sous-titres | Ne jamais les isoler en fin de page ; les garder avec le premier paragraphe ou au moins ses premières lignes. |
| Listes | Couper de préférence entre items ; conserver la numérotation et les puces, sans perte de contenu. |
| Figures, légendes et encadrés | Conserver image et légende ensemble ; déplacer le bloc entier s’il tient sur une page neuve. Pour un encadré long, couper entre éléments cohérents ; éviter de réduire les visuels au point de les rendre illisibles. |
| Tableaux et glossaires | Répéter l’en-tête du tableau sur les pages suivantes ; couper entre lignes lorsque possible ; garder terme et définition ensemble, sauf définition exceptionnellement trop longue, avec continuation explicite. |
| Questions, QCM et réponses | Enchaîner les questions du même exercice sur la page tant qu’elles tiennent, avec une numérotation continue en cas de suite. Garder énoncé, propositions et zone de réponse ensemble lorsque le bloc tient sur une page. Respecter les sauts explicites. |
| Mathématiques | Grille de calcul et trait de réponse obligatoires ; déplacer le problème entier s’il tient sur une nouvelle page ; pour un problème exceptionnellement long, organiser des continuations explicites sans réduire arbitrairement la grille ni supprimer le trait de réponse. |
| Mises en situation | Couper entre sous-questions ou supports cohérents, conserver le contexte et les renvois ; numérotation continue. |

**PAG-05 — Cas longs.** Un bloc plus haut que la zone utile d’une page neuve doit posséder une stratégie de fragmentation adaptée (paragraphe, lignes de tableau, sous-questions, sous-sections). Ne pas générer de pages vides en boucle, ne pas masquer le débordement par `overflow: hidden`, ne pas réduire automatiquement toute la police. Si une figure indivisible ne peut pas être rendue lisiblement dans le gabarit, signaler le problème et permettre sa correction avant impression. Les données et le texte demeurent intacts.

**PAG-06 — Recalcul et édition libre.** Recalculer après modification de texte, choix de chapitres/termes, ajout ou remplacement de question, édition de corrigé, changement de police, taille, colonnes, marges, grille, images, légendes, formats ou changement de mode élève/corrigé. Réutiliser les sauts de page manuels existants en mode Libre ; s’ils ne couvrent pas un bloc textuel, étendre le mécanisme commun sans nouvelle interface. Un saut manuel ne dispense pas du contrôle automatique des débordements. Ancrer les sauts manuels à des identifiants stables et les enregistrer dans la recette ; ne pas figer des coordonnées en pixels qui deviendraient fausses après édition.

**PAG-07 — Cohérence.** Respecter la numérotation réelle des pages et les conventions existantes d’en-tête/pied sur les continuations. Le corrigé peut avoir un nombre de pages différent, mais garde l’ordre et les identifiants des questions. Ne pas insérer de pages vides artificielles. Les domaines non logistiques conservent leur comportement actuel. Vérifier les formats déjà autorisés, notamment A4 et, si compatible, double A5.

### 8.6 Titres automatiques des fiches (V2.8 — impératif)

Le champ titre du gabarit institutionnel existant reçoit automatiquement le libellé du type de fiche suivi du numéro du module EPCAS sélectionné (sous-thème Doc-Prof), et non le code du thème parent. La convention est identique pour les deux diplômes.

| Type / version | Titre automatique pour le sous-module 101 |
|---|---|
| Objectifs et aperçu | Objectifs et aperçu : module 101 |
| Théorie complète | Théorie : module 101 |
| Théorie résumée | Théorie résumée : module 101 |
| Aide-mémoire | Aide-mémoire : module 101 |
| Glossaire de référence ou à compléter | Glossaire : module 101 |
| Mathématiques | Mathématiques : module 101 |
| Vérification des connaissances | Vérification des connaissances : module 101 |
| Mises en situation | Mises en situation : module 101 |

**TITLE-01.** Utiliser les codes réels de la sélection du document, dédupliqués, et non le sous-thème actuellement ouvert dans le panneau UI. Pour un même type sur plusieurs modules, convention proposée : « Vérification des connaissances : modules 101 et 102 », ou « Théorie : modules 101, 102 et 103 ». Pour des activités de types différents, convention proposée : « Évaluation : modules 101, 102 et 103 » en mode Évaluation et « Exercices : modules 101 et 102 » en mode Exercice/Libre ; si un seul module, conserver le singulier. Pour un seul type en évaluation, le titre du type reste applicable sauf personnalisation explicite. Les codes sont ordonnés numériquement pour le titre sans modifier l’ordre des questions. Les titres longs se replient naturellement selon le gabarit existant, et leur hauteur réelle intervient dans le calcul de pagination.

**TITLE-02.** L’en-tête comporte déjà « Logistique CFC » ou « Logistique AFP » et le logo EPCA ; ne pas ajouter le diplôme au titre automatique ni créer un second bandeau. L’intitulé détaillé du module peut rester dans le corps de la théorie ou de l’activité selon le gabarit, sans remplacer le titre demandé. Le titre est un champ visible de la fiche, distinct du nom de fichier ; ne pas imposer les deux-points dans un nom de fichier incompatible avec certains systèmes.

**TITLE-03.** Conserver le champ de personnalisation actuel : mise à jour automatique lors des changements de sélection, type, version ou mode tant que le titre est en état automatique ; une saisie manuelle n’est jamais écrasée sans action explicite de l’utilisateur. Une remise à zéro permet de retrouver le titre automatique via le contrôle existant ou son extension minimale. Ne pas laisser le titre par défaut « Évaluation » du générateur masquer la convention logistique. Sauvegarder le titre et son état automatique/personnalisé dans la recette, en respectant la compatibilité des recettes anciennes. La version corrigée conserve le même titre de base et le marquage corrigé déjà prévu par le gabarit.

## 9. Annexe pédagogique — matrice complète des 80 codes (CFC et AFP)

Les titres ci-dessous correspondent au catalogue EPCAS inspecté. Les trois colonnes de droite constituent des **axes de rédaction proposés** à recouper avec la théorie, les objectifs et les corrigés du sous-module : elles ne sont pas des objectifs officiels nouvellement attestés. Chaque axe doit être développé en questions originales variées, puis vérifié par le formateur. La théorie complète est à reprendre textuellement et les glossaires sont à reconstruire pour chacune des 80 lignes ; les 3 banques sont à compléter séparément selon la section 5. Les cas et calculs utilisent des données fictives ou explicitement sourcées. Les années CFC et AFP correspondent aux séquences Git par défaut ; « — » signifie hors catalogue AFP. Chaque ligne commune représente deux vues et deux validations de niveau. La colonne AFP indique un axe de différenciation proposé ; les axes de vérification, maths et situations des trois colonnes centrales sont à décliner à partir des objectifs AFP réels, et non à copier intégralement.

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
| L1 — Socle et remise en conformité | Réintégrer les deux domaines déjà amorcés dans le générateur standard, catalogue 9 thèmes/80 sous-thèmes CFC et 7 thèmes/63 sous-thèmes AFP, six types, contrats partagés, navigation, droits indépendants et sauvegarde. | Aucun shell/rendu parallèle actif ; logo EPCA seulement dans les fiches, intitulés corrects ; routes et recettes existantes intactes. |
| L1b — Paramétrage, Évaluation et Libre | Multi-sous-thèmes, lots, choix manuel, trois formats de réponse, deux modes inline, grille de calcul et trait de réponse. | Parcours complet 101+102 dans les deux diplômes avec fixtures approuvées de test, preuves A4 élève/corrigé et réouverture exacte. |
| L1c — Édition libre complète et illustrations | Création locale, édition des énoncés et corrigés par format, état à vérifier, médias par instance, réglages de rendu et sauvegarde durable. | Recette §3.9.1 réussie en AFP/CFC, preuves élève/corrigé, tests EDIT et IMG §11.1 quater ; aucune mutation des banques ni nouveau parcours UI. |
| L1e — Pagination et titres (V2.8) | Étendre le moteur commun : réserve de 25 px, fragmentation sémantique, sauts automatiques/manuels et titres automatiques personnalisables. | Tests PAG-T01–07 et TITLE-T01–04, preuves PDF multipages AFP/CFC et non-régression. |
| L1d — Formats structurés et visuels (V2.3) | Registre des formats, tableaux de données/dates, associations textuelles et visuelles, identification/définition d’images, schémas, frises, graphiques, documents et cas mixtes ; intégration au panneau commun, Libre et sauvegarde. | Fixtures représentatives pour chaque format, capacité filtrée réelle, preuves A4 élève/corrigé, tests FMT §11.1 quinquies ; aucune nouvelle page ni perte des exigences V2.1–V2.2. |
| L1f — Conception des évaluations (V2.9) | Deux formats, sélection mixte, trames et adaptation automatique, édition narrative manuelle protégée, barème Bloom, temps estimé, synthèse, modèles et brouillons dans l’interface commune. | Pilote AFP/CFC, tests EV9-T01–15, preuves élève/corrigé, sauvegarde et non-régression. Variantes A/B/C facultatives après le socle. |
| L2 — Pilotes | 105 (pilote de bout en bout CFC/AFP), 101 (source riche), 308 (quantités), 613 (lacunes communes, années différentes), 805 (CFC uniquement et ICT illustré), 902 (CFC uniquement et source absente). | Génération des six types, import fidèle et correction auditée, pagination, snapshots. Le 902 est créé à partir d’études de cas originales et suit la validation directe du §0. |
| L3 — Import global | Extraction fidèle des cours complets, archivage des anciens résumés et glossaires, import des questions et corrigés de tous les modules. | Rapport d'appariement et de doublons, inventaire des médias, aucune perte silencieuse ; contenu non relu non publié. |
| L3a — Relecture linguistique des cours complets (V2.7) | Reprendre textuellement les cours applicables CFC/AFP, contrôler l'orthographe, les accords, la grammaire manifeste et la typographie ; signaler les erreurs de fond. | Comparaisons avant/après, journal des corrections linguistiques, conservation des sections et données, liste des sources manquantes ou points à valider ; tests THC. |
| L3b — Réécriture pédagogique des résumés (V2.4) | Reprendre intégralement chaque cours complet applicable, inventorier les notions essentielles, réécrire les résumés des 80 CFC et 63 AFP en français professionnel accessible aux 15–18 ans ; harmoniser glossaires et exercices. | Pilote 105 validé dans les deux diplômes avant généralisation ; matrice par code/diplôme, couverture essentielle 100 %, comparaison avant/après, preuves A4, approbations indépendantes et tests THR §11.1 sexies. Aucun résumé source simplement recopié ou approuvé automatiquement. |
| L3c — Illustration pédagogique des théories complètes (V2.5) | Analyser chaque cours complet, exclure toutes les anciennes images, créer les figures originales nécessaires et intégrer encadrés, schémas, comparaisons et séquences dans les blocs de théorie communs ; reprendre les visuels essentiels dans les résumés. | Pilote 105 dans les deux diplômes, registre des besoins/figures pour les 143 occurrences, validation métier et droits, preuves A4 couleur et niveaux de gris, tests THV §11.1 septies. Aucun visuel indispensable manquant ni moteur parallèle. |
| L3d — Reconstruction intégrale des glossaires (V2.7) | Inventorier et rédiger à nouveau les glossaires pour les 143 occurrences CFC/AFP, harmoniser avec les résumés et exercices, valider les définitions et illustrations utiles. | Matrices de couverture, anciens glossaires archivés, définitions nouvelles et approuvées par diplôme, preuves de rendu et d'entraînement, tests GL. |
| L4 — Enrichissement par thème | 100, 200, 300, 400, 500, 600, 700, 800, 900 ; lots éditoriaux séparés et traçables. | Pour chaque thème et diplôme éligible : matrices de compétences, banques complétées, corrigés validés, preuves de rendu et statut par sous-module ; partage canonique et adaptation AFP auditée. |
| L5 — Recette finale | Tests unitaires, intégration, navigateur, PDF, sauvegarde, droits, performance et non-régression. | Rapport de recette, aucun défaut bloquant, revue formateur des banques, dérogations documentées. |
| L6 — Publication | Activer les accès autorisés après validation ; versionner les banques et documents. | PR revue et validée, documentation, notes de version, procédure de désactivation/rollback ; pas de déploiement sans autorisation. |

Livrables : code source et tests, manifeste d'import et journal de corrections, banque par sous-module, sources éditoriales reproductibles, matrice de couverture, registre médias, exemples PDF élève/corrigé et captures de recette, README de maintenance, guide formateur succinct, rapport de validation et état des dérogations. Conserver ce cahier des charges dans `docs/logistique/cahier-des-charges.md`. Les lots sont des dépendances de réalisation, pas un calendrier contractuel ni une promesse de durée.

### 10.1 Ordre de traitement et preuves attendues

1. Lot L0 : produire le manifeste des deux diplômes, enregistrer les SHA effectivement utilisés et les SHA des médias. Confronter les codes à `levels.ts` et établir le déficit par catégorie avant génération de nouvelles questions.
2. Lots L1/L1b/L1c : architecture commune, suppression des parcours parallèles après raccordement, sélecteurs, types, contrôles d’accès, contrat d’enregistrement, évaluation multi-sous-thèmes, mode Libre, formats et en-tête EPCA ; édition individuelle complète, création locale et illustrations durables. Livrer ces exigences avant de généraliser les banques. Tous les types apparaissent mais les banques non validées restent non tirables. Protéger le comportement initial de Grammaire par des tests et une base de comparaison.
3. Lot L2 : réaliser le pilote 105 dans **les deux domaines** avant tout import massif ; produire une fiche complète, une fiche résumée, un glossaire, une fiche de connaissances, une fiche de maths, une situation et leurs corrigés applicables par diplôme. Tester variantes héritées et spécifiques avec fixtures synthétiques. Pour les résumés, valider la réécriture pédagogique, la matrice de couverture exhaustive des notions essentielles et la lisibilité dans les deux diplômes avant généralisation. Les autres codes pilotes servent à éprouver les cas limites et non à retarder la correction du pilote principal.
4. Lots L3/L3a/L3b/L3c/L3d/L4 : importer et relire linguistiquement le texte complet sans enrichissement rédactionnel, illustrer la théorie complète, réécrire les résumés conformément au §4 et reconstruire les glossaires (§5.5), puis enrichir les codes communs une première fois au niveau canonique, puis contrôler et adapter les deux diplômes ; traiter les 17 codes CFC exclusifs sans créer de vues AFP. Prioriser les banques manquantes 100/613 (les deux) et 901/902 (CFC). Livrer par thème, avec rapports et tests reproductibles.
5. Lots L5/L6 : contrôler le rendu des 858 types, en tenant compte des exceptions approuvées ; vérifier les anciennes recettes, les accès et les performances. Soumettre une pull request ; aucune modification ni publication sur EPCAS et aucun déploiement de production sans autorisation.

**Complément V2.10 — organisation des images (lot L3c).** Dès L0, relever la structure réelle des thèmes/sous-modules et les conventions de médias et de déploiement de Doc-Prof. Avant le pilote L2, préparer le registre, le résolveur et le contrôle d’intégrité de l’arborescence. Lors de L3c et de la production des banques, déposer chaque nouveau visuel dans son emplacement canonique et contrôler l’éligibilité, l’empreinte et la lisibilité. L5 vérifie la persistance des médias dans les recettes et la non-régression des autres domaines. Livrer un inventaire par code avec les images attendues, produites, validées, partagées et manquantes ; ne pas créer de dossiers fictifs ni déclarer des visuels produits avant leur création.

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
  couverture-theorie/{cfc,afp}/<code>.json
  couverture-visuelle/{cfc,afp}/<code>.json
  registre-figures.json     # registre étendu à tous les visuels (§7.2 bis)
  preuves/{cfc,afp}/<code>/<type>/
  validation/rapport-recette.md
  avancement.md
```

Pour chaque type publiable : recette JSON de preuve, révision des banques, graine, capture d'aperçu et PDF de fiche élève, corrigé si applicable, résultat automatisé de contrôle des débordements et résultat de revue. Les noms des fichiers contiennent le diplôme et le code. Les données de test sont fictives. Ne pas stocker de gros médias redondants dans Git ; respecter les conventions du projet. Un script de contrôle CI doit refuser une modification de banque approuvée non accompagnée d'une révision, un ID dupliqué ou une rupture de contrat.

## 11. Tests et critères de réception

### 11.1 Tests automatiques minimaux

| ID | Test / résultat attendu |
|---|---|
| CAT-01 | Exactement 9 thèmes, 80 sous-thèmes et 480 types CFC, 7 thèmes, 63 sous-thèmes et 378 types AFP, 858 entrées, 143 sous-thèmes de catalogue ; IDs uniques ; distinction thème 100/sous-thème 100 ; années 34/30/16 et 27/36 conformes au registre figé. |
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
| REC-01 | Sauvegarde/réouverture des six types, d'une fiche mixte et d'une fiche modifiée en libre ; tester après révision de la banque et hors connexion si le comportement existant le prévoit. |
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
| AFP-11 | Rapport de couverture : 143 vues de sous-module, 858 types Doc-Prof, compteurs séparés par niveau, unités canoniques uniques et occurrences partagées réconciliées ; 23 catégories statiques manquantes recensées. |
| AFP-12 | Les PDF AFP ne contiennent pas de contenu CFC exclusif ni de mention de 3e année AFP ; les PDF CFC ne reprennent pas de variantes AFP à leur insu. |

### 11.1 ter — Tests bloquants V2.1 : interface, Évaluation, Libre, formats et marque

| ID | Test / résultat attendu |
|---|---|
| UI-01 | Comparer Grammaire, Mathématiques, TCF, CFC et AFP : même route, structure du générateur, panneaux, onglets, sélecteurs, contrôles, actions, aperçu et édition libre. Aucun écran de catalogue autonome ni deuxième moteur d’impression. Vérifier la structure DOM/composants et pas uniquement la ressemblance visuelle. |
| UI-02 | Ouvrir les deux domaines, ajouter/dupliquer/réordonner/supprimer des activités, générer/régénérer, basculer élève/corrigé et mode Exercice/Évaluation, sauvegarder et imprimer. Vérifier que les mêmes chemins de code communs sont empruntés. |
| EVAL-01 | Dans les deux diplômes, sélectionner 101 et 102 et tirer 10 questions au total ; puis fixer 5 par code. Tester plusieurs thèmes et maintien des sélections. Vérifier l’origine, les révisions, la quantité et les corrigés. |
| EVAL-02 | Banque insuffisante, absence de banque, sélection vide, doublon canonique, format indisponible, retrait de code et accès AFP à 501 : aucun tirage hors sélection, aucune duplication, aucun report implicite des quotas. |
| EVAL-03 | Une évaluation à plusieurs activités et types (10 vérifications, 3 maths, 1 cas) conserve les sélections propres aux blocs, numérotation, sous-questions et total des points corrects. Modifier un bloc sans modifier les autres. |
| LIB-01 | Ajouter 10 questions du 101/102 par lot, puis 3 maths, puis choisir une question par ID depuis la banque ; rechercher, filtrer, consulter le corrigé et ajouter sans quitter le Libre. Vérifier absence de perte et d’ajout implicite. |
| LIB-02 | Réordonner, supprimer, remplacer, modifier localement, verrouiller une question manuelle et régénérer le lot ; la banque source reste inchangée et les questions manuelles verrouillées sont conservées. |
| LIB-03 | Vérifier éligibilité/approbation/droits, cas indissociables des supports et corrections ; rejeter format incompatible, question exclusive CFC en AFP et ID inconnu côté moteur et API. |
| GAP-01 | Même texte et mêmes trous dans les deux modes : sans liste, avec liste, avec et sans leurres. Les traits inline sont imprimables ; toutes les réponses figurent dans la liste aidée, aucun leurre valide par erreur, aucun indice en mode sans liste. |
| GAP-02 | Texte multi-paragraphes, trous multiples, accents, mots réutilisés, largeur variable, passage à la page suivante. Recalcul des points et correction exacte, liste déterministe et conservée après réouverture. |
| ANS-01 | Comparer QCM, lignes numérotées (exactement 3 pour « Citez trois… ») et lignes simples sans numéro. Tester format par activité et modification d’une unité compatible en Libre ; vérifier le corrigé et l’ordre des choix. |
| ANS-02 | Ne pas transformer un texte à trous en réponse sous le texte, ni un problème en question à lignes seules. Les autres formats validés restent disponibles selon pertinence. |
| CAL-01 | Chaque problème de maths des deux diplômes, y compris dans un cas et après édition Libre, affiche la grille de calcul de Mathématiques et le trait final de réponse. Les commandes globales ne peuvent pas supprimer la grille logistique. Vérifier l’espace et le rendu PDF. |
| BRAND-01 | CFC : EPCA + « Logistique CFC » ; AFP : EPCA + « Logistique AFP » à la place des deux éléments habituels. Exactement le même gabarit de fiche et les mêmes champs. Contrôle dans aperçu, PDF, corrigé et multipage. |
| BRAND-02 | La barre de fenêtre reste ClairFLE dans les deux domaines. Passage CFC → AFP → Grammaire/Mathématiques : État du Valais et libellés d’origine sont restaurés pour les autres domaines ; aucun changement global de logo, palette ni CSS. |
| REC-03 | Sauvegarder/réouvrir une recette multi-sous-thèmes, mixte, avec QCM, lignes simples/numérotées, textes inline dans les deux modes, leurres, grilles, choix manuels et modifications ; simuler une nouvelle révision de banque. Identité, ordre, données, corrigés et en-tête strictement conservés. Tester migration de snapshot logistique mono-module v1. |
| REG-02 | Exécuter les tests des autres domaines, notamment Grammaire/TCF (blancs et QCM), Mathématiques (grilles), chrome institutionnel, accès et recettes. Vérifier que les styles et le rendu des fiches existantes ne changent pas. |

Utiliser des banques synthétiques originales explicitement autorisées pour les tests techniques si les données importées sont encore en attente de validation. Ne pas approuver les unités EPCAS en masse simplement pour rendre les tests exécutables. Ajouter aux preuves les captures comparatives du panneau standard (bureau et mobile), des fiches élève/corrigé dans chaque format, des en-têtes AFP/CFC et d’une fiche non logistique, ainsi que les résultats de réouverture.

### 11.1 quater — Tests bloquants V2.2 : édition individuelle et illustrations

Exécuter chaque test dans les deux domaines, en Exercice et en Évaluation lorsque pertinent, avec le panneau Libre et le rendu communs. Utiliser des fixtures et illustrations originales autorisées. Produire des preuves de sauvegarde/réouverture et de rendu A4, pas uniquement des tests de composants.

| ID | Test / résultat attendu |
|---|---|
| EDIT-T01 | Modifier l’énoncé et le corrigé séparément d’une question tirée et d’une question sélectionnée manuellement ; vérifier aperçu, corrigé, statut local, identité d’instance et empreinte inchangée de la banque canonique. |
| EDIT-T02 | Créer une question locale dans une activité même sans banque approuvée ; vérifier qu’elle est sauvegardable mais absente des tirages et compteurs de banque. Dupliquer, remplacer, déplacer, verrouiller, restaurer et supprimer sans effet sur les autres items. |
| EDIT-T03 | Éditer un QCM : ajout, suppression, mélange et changement de bonne option ; vérifier correspondance stable, absence de réponse révélée, rejet d’une configuration incohérente. Tester choix simple et multiple. |
| EDIT-T04 | Modifier réponses, lignes simples/numérotées, trous, mots et leurres ; vérifier corrigés exacts, nombre de traits et compatibilité des formats. Tester un texte et un corrigé longs. |
| EDIT-T05 | Modifier une donnée chiffrée, recalculer si gabarit compatible, sinon marquer le corrigé à revoir ; modifier les étapes, résultat et unité. Vérifier que la grille et le trait de réponse sont toujours présents. Tester une sous-question de cas et son barème. |
| EDIT-T06 | Enregistrer un brouillon incomplet, rouvrir et corriger ; empêcher l’export d’un corrigé incohérent, conserver l’option élève avec avertissement si prévue. Recalculer les points après ajout, modification, suppression et déplacement. |
| IMG-T01 | Ajouter un fichier image valide et choisir une ressource existante lorsque disponible ; ajouter deux images au même item, légender, redimensionner, aligner, remplacer et supprimer. Les autres items restent intacts. |
| IMG-T02 | Associer une image à une question de banque modifiée, une création locale, un calcul et une sous-question de situation. Déplacer, insérer et renuméroter des items ; vérifier les liens par ID stable et la conservation des supports partagés. |
| IMG-T03 | Dupliquer un item illustré ; changer la taille ou supprimer l’image de la copie. L’original conserve son association et son rendu ; le binaire partagé reste accessible. |
| IMG-T04 | Enregistrer une fiche illustrée, fermer et rouvrir dans une nouvelle session, réviser la banque source, tester export/import si disponible. Vérifier l’empreinte des images, paramètres, énoncés, corrigés et ordre ; aucune dépendance à une URL `blob:` périmée. |
| IMG-T05 | Imprimer élève/corrigé en A4 : image au-dessus, dessous et à côté si compatible, image large/haute, schéma coté, cas multipage, grille de calcul et trait de réponse. Aucun chevauchement, débordement ou rognage ; attendre le chargement des médias avant le rendu final. |
| IMG-T06 | Ajouter une image réservée au corrigé et contrôler qu’elle n’apparaît ni dans l’aperçu ni dans le PDF élève. Supprimer un support indispensable et vérifier l’alerte et la mise à revoir du corrigé. |
| IMG-T07 | Fichier invalide, trop volumineux, format non autorisé, média inaccessible et tentative d’accès hors droits : erreur claire, pas de fuite ni perte de l’édition précédente ; l’API valide également les références. |
| REG-T03 | Rouvrir les fiches anciennes sans illustration et avec les mécanismes d’image existants (Grammaire, TCF, Mathématiques) ; vérifier l’absence de régression de rendu, d’accès, d’édition et de stockage. |

Critère de sortie du lot L1c : aucune erreur bloquante sur les tests ci-dessus et recette fonctionnelle complète §3.9.1 démontrée dans les deux diplômes. Ne pas considérer l’ajout d’une image dans un écran parallèle ou la seule modification d’un texte sans corrigé comme une réalisation suffisante.

### 11.1 quinquies — Tests bloquants V2.3 : formats par question

| ID | Test / résultat attendu |
|---|---|
| FMT-T01 | Les six types et leurs formats internes utilisent le panneau standard des deux domaines. |
| FMT-T02 | Tirage multi-sous-thèmes et multi-formats avec quotas compatibles et incompatibles ; disponibilité réelle dédupliquée, déficit explicite, aucun mélange AFP/CFC. |
| FMT-T03 | Tableau mixte texte/nombres : modifier et déplacer lignes/colonnes, afficher cases vides exactes, produire corrigé complet, enregistrer et rouvrir. |
| FMT-T04 | Tableau de dates : format JJ.MM.AAAA, dates manquantes, durées, fin de mois, année bissextile, correction stable et convention d’arrondi/comptage. |
| FMT-T05 | Associer images à termes puis à définitions ; mélanger les deux colonnes, vérifier paires et corrigé, absence de liaison révélée en version élève. |
| FMT-T06 | Identifier une image avec et sans banque de mots ; tester leurres, variantes et absence de légende révélant la réponse. |
| FMT-T07 | Décrire ou définir une image avec lignes de réponse ; vérifier critères, édition locale, changement de format compatible et sauvegarde. |
| FMT-T08 | QCM images, classement visuel, schéma à légender et observation : choix distincts, repères stables après redimensionnement, contraste, correction visible uniquement côté corrigé. |
| FMT-T09 | Frise, ordre, schéma de flux, document professionnel, graphique à lire/compléter et correction d’erreurs : vérifier cohérence support/question/solution. |
| FMT-T10 | Problèmes mathématiques avec tableau, graphique ou image et sous-question de cas : grille de calcul et trait de réponse toujours présents, calcul exact, points non dupliqués. |
| FMT-T11 | Chaque format disponible peut être sélectionné individuellement ou ajouté par lot en Libre ; création locale, édition, réorganisation et verrouillage sans mutation de banque. |
| FMT-T12 | Même graine et paramètres : mêmes formats, paires, choix, données et réponses ; réouverture après changement de banque et d’ordre des questions à l’identique. |
| FMT-T13 | PDF A4 élève et corrigé : tableaux longs, images multiples, lignes de liaison, repères, cases de rédaction, sauts de page ; aucune coupure illisible, correction prématurée ni débordement. |
| FMT-T14 | Détection des cellules non corrigées, paires ambiguës/orphelines, images manquantes, repères invalides, dates impossibles et incohérences de points ; état explicite plutôt qu’une fiche incorrecte. |
| FMT-T15 | Tests de non-régression des formats existants de Grammaire, TCF, vocabulaire et Mathématiques ; mêmes paramètres, rendu, sauvegarde et comportement d’impression. |

Les preuves couvrent chaque format du registre par fixture contrôlée, et des fiches mixtes AFP/CFC séparées dans le véritable générateur. Les tests techniques ne valent pas approbation pédagogique des banques. Réussir L1d avant de considérer les nouveaux formats opérationnels et avant leur production massive.

### 11.1 sexies — Tests bloquants V2.4 : résumés théoriques retravaillés

| ID | Test / preuve attendue |
|---|---|
| THR-01 | Chaque code éligible dispose d'un cours complet résolu et d'un résumé retravaillé distinct du résumé source archivé ; un cours manquant ou non autorisé bloque le résumé. |
| THR-02 | Matrice non vide, inventaire des sections du cours complet et références de notions valides. Détecter une section essentielle omise, une référence erronée et un terme non expliqué. |
| THR-03 | Couverture validée de 100 % des notions essentielles par diplôme ; aucune approbation si une notion essentielle est absente, en attente ou bloquée. Les omissions complémentaires sont motivées. |
| THR-04 | Revue comparative humaine : sens des termes, distinctions, unités, formules, conditions et limites conservés ; aucun ajout métier non justifié ni contradiction. |
| THR-05 | Revue pédagogique humaine : phrases claires, progression explicite, termes techniques définis, français professionnel adapté à un apprenti débutant de 15–18 ans sans langage enfantin. Vérifier un extrait dense avant/après. |
| THR-06 | Vérifier cohérence du résumé, glossaire et corrigés ; les notions complémentaires évaluées hors résumé sont signalées ou reclassées après revue. |
| THR-07 | Fixtures AFP natif, hérité et différent : référence complète correcte, couverture et approbation indépendantes ; aucune introduction de modules exclusivement CFC dans AFP. |
| THR-08 | Modifier une révision du cours complet : le résumé dépendant devient à revoir et ne peut être publié comme à jour sans revalidation ; les fiches sauvegardées restent reproductibles. |
| THR-09 | Sélecteur Complet / Résumé / Aide-mémoire dans le générateur commun, sections et impression inchangées ; les extraits personnalisés sont distingués du résumé intégral. |
| THR-10 | Contrôler les preuves A4 des résumés pilotes et de chaque résumé publiable : titres, tableaux, figures, taille de police, absence de coupure et débordement. Ne pas supprimer du contenu essentiel pour respecter une longueur de fiche. |
| THR-11 | Les rapports comptent les 80 résumés CFC et 63 AFP attendus, distinguent les révisions mutualisées des occurrences de catalogue, et séparent réécrit, contrôlé, approuvé et bloqué. Aucune validation déduite du seul nombre de mots ou d'un score automatique. |

La recette linguistique n'est pas automatisable intégralement : les contrôles de présence et de cohérence doivent être complétés par une validation de fond et de compréhension, sans inventer de résultats de tests auprès d'apprentis.

### 11.1 septies — Tests bloquants V2.5 : illustrations pédagogiques de théorie

| ID | Test / résultat attendu |
|---|---|
| THV-T01 | Inventaire de besoins visuels par section/notion des 80 codes CFC et 63 codes AFP ; chaque décision de non-illustration est motivée. Les décomptes distinguent figures uniques et associations. |
| THV-T02 | Chaque besoin indispensable dispose d'une figure correcte, autorisée et approuvée pour le diplôme ; un besoin indispensable manquant bloque la révision illustrée. |
| THV-T03 | Revue métier des illustrations : objets, relations, termes, légendes, dimensions, unités, dates et repères exacts ; schémas fictifs/non à l'échelle signalés si pertinent. Aucune opération dangereuse présentée comme tutoriel. |
| THV-T04 | Import textuel avec renvoi à une figure EPCAS : aucun fichier/URL source ne migre au runtime ; besoin recensé, nouvelle figure originale hashée, provenance de création et lien à la bonne section et notion. |
| THV-T05 | Rendu dans `WorksheetSheet` avec les composants communs, encadré par défaut et variantes pleine largeur, côte à côte, planche, séquence ; aucune UI ou CSS d'impression parallèle. |
| THV-T06 | Tester image haute, large, petite, figure dense et planche de plusieurs éléments à proximité d'un saut de page ; légendes, titres et repères restent solidaires et lisibles, sans rognage ni déformation. |
| THV-T07 | Vérifier chaque figure indispensable en A4 couleur et niveaux de gris ; contraste, taille des annotations, qualité réelle, échelle cohérente pour les comparaisons. |
| THV-T08 | En mode Théorie, sélectionner une section : ses visuels associés suivent ; retirer une illustration optionnelle n'affecte pas les notions essentielles. Aucune figure obligatoire omise silencieusement. |
| THV-T09 | Réutiliser un visuel commun avec légendes/placements propres à AFP et CFC ; les droits, l'éligibilité et les validations sont indépendants ; aucune figure spécifique CFC ne fuit vers AFP. |
| THV-T10 | Sauvegarder, rouvrir et imprimer une fiche illustrée après changement de version de la galerie ; même figure, même texte, même ordre et même mise en page. Tester les modifications locales sans mutation du canon. |
| THV-T11 | Résumé réécrit : vérifier le maintien des figures essentielles retenues et leur cohérence avec les définitions et notions couvertes ; l'aide-mémoire reste distinct. |
| THV-T12 | Anciennes fiches sans figures et autres domaines : aucune régression ; logo EPCA limité à la fiche logistique, barre ClairFLE inchangée. |

Le rapport de recette comporte au minimum les PDF du pilote 105 dans les deux diplômes (cours complet illustré et résumé), les cas de disposition représentatifs et l'état de validation de chaque figure. La conformité visuelle et pédagogique requiert un contrôle humain ; une simple présence de fichiers images ne vaut pas réception.

### 11.1 octies — Tests bloquants V2.6 : textes autorisés et visuels originaux

| ID | Test / résultat attendu |
|---|---|
| ORIG-01 | Manifeste documentant l’autorisation de l’auteur sur ses textes, révision et périmètre ; transition `pending` vers `permitted-reuse` justifiée pour les contenus couverts, sans approbation pédagogique automatique ni extension aux tiers. |
| ORIG-02 | Audit des banques, fichiers et références d’images : zéro image EPCAS/EnterSite dans les nouveaux supports de CFC et AFP, y compris URL, miniature, pièce jointe et média de corrigé ; les logos institutionnels restent intacts. |
| ORIG-03 | Fixture avec ancienne figure indispensable : le besoin est identifié, aucune image source ne s’affiche, le bloc est bloqué si les données nécessaires manquent, puis débloqué après validation de la nouvelle figure. |
| ORIG-04 | Chaque illustration canonique possède une provenance de création originale, une empreinte, un objectif, une légende et une validation technique/pédagogique ; vérifier les chiffres, unités et repères. |
| ORIG-05 | Bibliothèque originale mutualisée : même ressource compatible dans une théorie, un glossaire et un exercice des deux diplômes ; références et snapshots stables, aucune réponse révélée involontairement. |
| ORIG-06 | Contrôle A4 élève/corrigé, couleur/niveaux de gris et mode Libre : nouvelles figures nettes, sans débordement, en encadré ou disposition adaptée, sans changement de l’interface ni des anciens documents des autres domaines. |

### 11.1 nonies — Tests bloquants V2.7 : fidélité textuelle et reconstruction des glossaires

| ID | Résultat attendu |
|---|---|
| THC-T01 | Pour chaque diplôme/code, résolution de la version complète et archivage brut avec empreinte ; aucune variante AFP inventée. |
| THC-T02 | Comparaison source/rendu : titres, ordre, contenu, tableaux, unités et chiffres conservés ; uniquement corrections linguistiques justifiées et changements de rendu/médias distincts. |
| THC-T03 | Fixtures de coquilles, accords, accents et sigles : corrections valides, termes techniques protégés, aucun changement de sens ou ajout rédactionnel. |
| THC-T04 | Une anomalie métier ou formule suspecte est signalée séparément ; pas de correction de fond silencieuse. Une source absente reste bloquée jusqu'à décision explicite. |
| THC-T05 | Relecture et journal disponibles pour les 143 occurrences, y compris partage canonique ; visuels originaux intégrés sans altération du corps du texte. |
| GL-T01 | Glossaires entièrement reconstruits à partir des cours complets applicables ; anciennes entrées archivées et comparées, pas simplement recopiées. |
| GL-T02 | Couverture de 100 % des termes techniques essentiels identifiés par code/diplôme, références vérifiables et exclusions justifiées ; aucune cible quantitative artificielle. |
| GL-T03 | Définitions claires et professionnelles, sigles exacts, distinctions nécessaires, exemples vérifiés, cohérence résumé/exercices ; validation séparée AFP/CFC. |
| GL-T04 | Entrées canoniques mutualisables sans confusion des sens ou diplômes ; révisions et snapshots reproductibles. |
| GL-T05 | Fiches de référence et formats d'entraînement existants, édition libre, corrections et illustrations originales lisibles à l'A4 et conservées à la réouverture. |

La réussite technique des tests ne remplace pas la relecture humaine des corrections linguistiques et des nouveaux glossaires.

### 11.1 decies — Tests bloquants V2.8 : pagination et titres

| ID | Test / résultat attendu |
|---|---|
| PAG-T01 | Théorie complète longue, résumé et glossaire sur plusieurs pages en CFC et AFP ; chaque page respecte une distance réelle de 25 px CSS minimum entre contenu et pied, sans perte ni duplication. |
| PAG-T02 | Contenu exactement à la limite, puis légèrement au-delà : passage à la page suivante sans chevauchement, réserve mesurée à chaque page, pas de page vide. |
| PAG-T03 | Titre en bas de page, paragraphes longs, listes, figures et légendes, encadrés et tableaux multipages : coupures sémantiques et répétition des en-têtes de tableaux. |
| PAG-T04 | QCM, questions ouvertes, cas et problèmes de maths : grille et trait de réponse préservés, continuité des numéros, aucun élément indispensable rogné. |
| PAG-T05 | Modifier en Libre un texte, une image, une légende, la police, une grille et un saut manuel ; pagination recalculée, sauvegarde et réouverture fidèles. |
| PAG-T06 | Tester le rendu après chargement tardif des polices/images, zoom navigateur, changement de format autorisé, mode élève/corrigé et chrome masqué ; réserve indépendante du zoom, sortie stable. |
| PAG-T07 | Vérifier les PDF réels et l’aperçu page par page, mesure de la réserve à l’échelle d’impression et contrôle visuel ; absence de régression sur les autres domaines. |
| TITLE-T01 | Les sept libellés de §8.6 sont exacts pour 101 et pour d’autres codes, dans les deux diplômes ; thème 100 distinct du sous-module 100. |
| TITLE-T02 | Sélections 101+102, 101+102+103, activités mixtes et évaluations : titre dédupliqué et cohérent avec les activités effectivement générées. |
| TITLE-T03 | Modifier le titre manuellement, régénérer, changer de sous-module puis restaurer le titre automatique ; aucune perte de titre personnalisé, restauration exacte après sauvegarde. |
| TITLE-T04 | Titre long sur plusieurs lignes, document multipage et corrigé : respect du gabarit commun, hauteur d’en-tête mesurée, EPCA et diplôme corrects, réserve de 25 px intacte. |

### 11.1 undecies — Tests bloquants V2.9 : conception des évaluations

Exécuter les tests sur les deux diplômes avec des fixtures approuvées, puis sur le pilote réel lorsque les banques sont validées. Les temps et barèmes des fixtures sont des données de test, non des observations d'élèves.

| ID | Résultat attendu |
|---|---|
| EV9-T01 | Générer une évaluation multi-modules en mode Histoire puis en questions indépendantes ; mêmes contrôles et limites du diplôme, aucune narration imposée dans le second format. |
| EV9-T02 | Tirer des questions puis en choisir, remplacer, ajouter et supprimer manuellement ; respecter quotas, supports, verrouillages et absence de doublons involontaires. |
| EV9-T03 | Remplacer une question dans une histoire ; adapter les passages et références liés sans réécrire une étape indépendante. |
| EV9-T04 | Modifier manuellement introduction, transition, mission et question après adaptation ; aperçu immédiat et édition conservée au rechargement. |
| EV9-T05 | Modifier une donnée partagée ; mettre à jour les références, résultats et corrigés dépendants ; détecter annexe manquante, incohérence et impossibilité de recalcul. |
| EV9-T06 | Protéger un passage reformulé et une question ; régénération compatible les préserve ; conflit explicite si la modification exige de les réécrire. |
| EV9-T07 | Annuler/rétablir une adaptation de scénario restaure en une opération passages, données, corrigés et barèmes affectés. |
| EV9-T08 | Vérifier les métadonnées Bloom distinctes de la difficulté, les points proposés modifiables, le total et les sous-totaux exacts, les critères de correction et protections. |
| EV9-T09 | Cible de points impossible avec des points verrouillés : écart visible, aucune redistribution silencieuse. |
| EV9-T10 | Vérifier le temps estimé : lecture commune comptée une fois, temps d'items et marge, recalcul après remplacement, durée cible impossible signalée. |
| EV9-T11 | Bilan enseignant exact par module, format, objectif et Bloom ; couverture et états de correction lisibles ; pas de métadonnées de correction sur la fiche élève. |
| EV9-T12 | Sauvegarder et rouvrir une évaluation figée après modification de banque ; identité du récit et corrigé ; nouveau tirage depuis un modèle sans écrasement de l'original. |
| EV9-T13 | Simuler une fermeture après modification du récit et récupération du brouillon ; vérifier isolation des comptes, erreur de stockage et absence de faux état « sauvegardé ». |
| EV9-T14 | Contrôler clavier/tactile, visibilité conditionnelle des réglages, absence de bouton Valider obligatoire, A4 et chrome inchangés, pagination avec réserve 25 px ; anciens domaines et recettes sans régression. |
| EV9-T15 | Cas incompatible ou insuffisance de banque : aucun faux scénario valide ; permettre un remplacement compatible ou correction manuelle, conserver le travail et bloquer seulement la finalisation invalide. |

Test additionnel si l'option EV9-15 est réalisée : les versions A/B/C respectent les contraintes communes annoncées, chaque corrigé correspond à sa version, les écarts sont visibles et aucune équivalence mesurée n'est revendiquée sans preuve. Vérifier aussi que la génération d'une variante n'altère pas les autres.

### 11.1 duodecies — Tests bloquants V2.10 : bibliothèque d’images par module

| ID | Vérification | Résultat attendu |
|---|---|---|
| IMG10-T01 | Contrôler chaque chemin et code par rapport au catalogue | Toutes les ressources logistique sont correctement rangées ; aucune association de code inexistante. |
| IMG10-T02 | Générer une fiche AFP puis CFC utilisant le même visuel | Même ID, révision et binaire si la ressource est commune et approuvée. |
| IMG10-T03 | Sélectionner une ressource exclusivement CFC depuis AFP | Ressource non proposée et non tirée ; aucune fuite de contenu par défaut. |
| IMG10-T04 | Réutiliser un visuel dans deux modules et plusieurs types de fiches | Références multiples vers un seul fichier canonique. |
| IMG10-T05 | Lancer les validations de registre et d’empreintes | Chemins absents, révisions incohérentes, doublons injustifiés et métadonnées obligatoires manquantes détectés. |
| IMG10-T06 | Générer, modifier, sauvegarder et rouvrir une fiche après publication d’une nouvelle révision | L’ancienne fiche conserve le visuel, la révision et ses paramètres. |
| IMG10-T07 | Importer une image personnelle en mode Libre | Persistance après réouverture, pas de publication statique ni de partage non autorisé. |
| IMG10-T08 | Supprimer une association ou tenter le nettoyage d’un média encore utilisé | Le binaire reste disponible pour toute fiche ou banque qui le référence. |
| IMG10-T09 | Vérifier aperçu et impression/PDF sur les deux diplômes | Images lisibles, chargées, légendes cohérentes, pas de débordement ni de contenu corrigé dans la fiche élève. |
| IMG10-T10 | Déployer sous le chemin de base configuré et ouvrir une activité sans images | URLs résolues correctement ; pas de chargement global inutile ni de régression des autres domaines. |
| IMG10-T11 | Contrôler provenance, accès et sécurité des médias | Aucun ancien visuel EPCAS/EnterSite, média non validé, fichier personnel public ou SVG actif non autorisé. |

### 11.2 Recette navigateur et impression

Reprendre les procédures et outils existants de Doc-Prof, notamment `.claude/skills/nouvel-exercice/SKILL.md`, `.claude/skills/test-impression/SKILL.md`, le README du générateur et les preuves du chantier Grammaire. Tester sur navigateur de bureau et mobile les sélecteurs, la navigation clavier, les libellés français, l'aperçu, la sauvegarde et le passage élève/corrigé. Vérifier les six types sur les modules pilotes, puis générer une preuve automatique de chaque entrée de catalogue publiable (au moins une fiche élève et un corrigé lorsqu'applicable). Compléter par des cas extrêmes : texte long, tableau multipage, image technique, formule, nombreux items, annexe, mode points et édition libre. Contrôler toutes les pages des preuves ciblées et tout débordement détecté automatiquement. Un PDF généré ne prouve pas à lui seul la lisibilité.

### 11.3 Validation pédagogique et définition de terminé

Pour chaque sous-module et chacune des cinq entrées :

- [ ] Intitulé, rattachement au thème, diplôme et année corrects ; variante ou héritage approuvé pour le diplôme.
- [ ] Théorie complète reprise textuellement, relue et corrigée linguistiquement seulement ; journal des changements, anomalies de fond et éventuelles lacunes documentés ; résumé réellement réécrit à partir du cours complet, français professionnel accessible aux 15–18 ans, tous les termes techniques et notions essentiels expliqués ; matrice de couverture 100 % validée pour le diplôme, glossaire et exercices cohérents ; aide-mémoire distinct.
- [ ] Théorie complète enrichie de figures pertinentes, encadrées ou placées selon le passage expliqué ; plan de couverture visuelle validé, aucune figure indispensable manquante, légendes exactes, ressources autorisées et preuves de lisibilité A4 pour le diplôme (§4.6–4.8).
- [ ] Glossaire entièrement reconstruit, toutes les notions essentielles couvertes, définitions professionnelles accessibles et validées par diplôme, anciens glossaires archivés pour comparaison.
- [ ] Questions existantes recensées, reprises avec leurs corrigés ou rejet motivé ; aucune perte silencieuse.
- [ ] Vérification, maths et situations enrichies jusqu'aux cibles approuvées ou dérogation explicite.
- [ ] Tous les calculs, critères de réponses ouvertes, supports et sources contrôlés ; règles métier sensibles vérifiées.
- [ ] Aucune question redondante ou hors sujet comptée artificiellement dans les quotas.
- [ ] Droits de réutilisation et de publication confirmés, médias accessibles et données fictives ou autorisées.
- [ ] Tirage reproductible, fiche et corrigé cohérents, édition et sauvegarde fonctionnelles, impression sans débordement.
- [ ] Énoncés et réponses librement éditables par item, création locale disponible, corrections et points cohérents, banque canonique inchangée ; images facultatives par question/sous-question, conservées après sauvegarde et correctement imprimées selon leur visibilité.
- [ ] Revue formateur nominative/datée ou identifiant de validation, révision et preuves enregistrées.

Critère global : tous les tests bloquants V2.1 et V2.2 de maintien de structure, d’évaluation multi-sous-thèmes, de mode Libre, de formats imprimés et d’identité institutionnelle, ainsi que d’édition individuelle et de gestion des images, doivent être réussis en plus des tests de formats V2.3 et de réécriture des résumés V2.4 (§11.1 sexies) et d’illustration pédagogique V2.5 (§11.1 septies), d’origine V2.6 (§11.1 octies) et de fidélité textuelle/reconstruction du glossaire V2.7 (§11.1 nonies). 80 sous-modules CFC sur 80 et 63 sous-modules AFP sur 63 couverts, 858 entrées de catalogue présentes, tous les contenus applicables approuvés et utilisables ; chaque exception justifiée et acceptée par le responsable. Les statuts « importé », « relu » et « approuvé » restent distincts. Un simple menu complet ou une banque générée automatiquement ne constitue pas une livraison pédagogique complète.

## 12. Maintenance, gouvernance et décisions à confirmer

### 12.1 Gouvernance des contenus

Conserver le SHA source et les révisions de banque ; un import ultérieur produit un diff (ajouts, modifications, suppressions, corrections concurrentes). Ne jamais écraser une banque validée sans revue ; une suppression amont est une proposition de retrait, pas une suppression automatique des fiches enregistrées. Maintenir un registre des erreurs et des corrections avec leur impact. Les questions originales Doc-Prof ont leur propre provenance et sont séparées des contenus importés. Pour les obligations légales, normes techniques, prescriptions de sécurité et logiciels évolutifs : conserver source/date/version, vérifier auprès de références compétentes et revalider quand le contenu évolue. Ne pas présenter les exemples fictifs comme des données réelles.

**Décision de l’auteur (V2.6, 25 novembre 2026).** EnterSite est une entreprise fictive créée par l’auteur pour contextualiser la formation logistique. La théorie a été rédigée par lui et il autorise sa réutilisation, adaptation et intégration dans Doc-Prof. Enregistrer cette déclaration dans le manifeste et attribuer `permitted-reuse` aux textes originaux qu’elle couvre ; un contenu encore marqué `pending` uniquement faute de cette autorisation peut être régularisé par une migration tracée. Ne pas assimiler cette autorisation à une renonciation générale au droit d’auteur, ni à une licence publique sur les dépôts. Ne pas l’étendre automatiquement à des éléments tiers éventuels (citations, documents externes, questions dont la provenance est différente). Les textes autorisés restent soumis à la revue pédagogique et aux contrôles de corrections. Aucune ancienne image EPCAS/EnterSite n’est reprise, indépendamment de son statut de droits. Les nouveaux visuels sont créés pour Doc-Prof, avec provenance `project-original` lorsque justifiée ; vérifier les conditions de l’outil de création et les éventuels éléments tiers. L’autorisation éditoriale de réutilisation ne remplace pas les permissions techniques des comptes.

### 12.2 Tableau de pilotage éditorial

Produire un fichier de suivi (JSON/CSV et résumé Markdown) avec : thème, code, année, type, SHA source, statut théorie complète/résumé source/résumé retravaillé/aide-mémoire, révision du cours complet, nombre de notions essentielles identifiées et validées, couverture du résumé, notions manquantes, termes non expliqués, état de la revue pédagogique, nombre original, nombre importé, nombre corrigé, nombre bloqué, nombre ajouté, nombre approuvé, cible, déficit, objectifs non couverts, média manquant, besoins visuels indispensables recensés/couverts/bloqués, références anciennes exclues, nouvelles figures à créer/créées/validées par diplôme, responsable, dernière revue et lien vers les preuves. Compteurs déduits des banques, pas d'estimations présentées comme réalisées. Publier par lots approuvés, sans supprimer le catalogue des sous-modules en attente.

### 12.3 Décisions proposées (à valider, non bloquantes pour documenter)

| Sujet | Proposition retenue |
|---|---|
| Noms des domaines | « Logistique CFC » (`logistique-cfc`) et « Logistique AFP » (`logistique-afp`), distincts dans le sélecteur. |
| Périmètre ICT | Théorie et exercices papier 801–809 CFC ; 801–804 et 808–809 AFP ; fichiers pratiques Office et vidéos exclus. |
| Quantités | 50 vérifications + 30 maths + 20 situations par sous-module, avec dérogation pédagogique pour les cas peu quantitatifs. |
| Difficulté | Facile, moyen, avancé ; année facultative comme filtre de catalogue ; aucun niveau FLE. |
| Accès | Pilote admin, puis autorisations selon le système Doc-Prof existant. |
| Glossaire | Reconstruction intégrale obligatoire ; fiche de référence et option d’entraînement dans le même type. |
| Théorie complète | Reprise textuelle fidèle, correction linguistique seule, nouveaux visuels distincts ; aucune réécriture ni enrichissement rédactionnel. |
| Origine | Git comme référence initiale ; compléter par export pédagogique CFC/AFP autorisé uniquement si fourni. |
| Validation | Revue pédagogique avant mise à disposition ; publication progressive par lots avec état visible. |
| Répartition multi-sous-thèmes | Par défaut proposé : quantité totale tirée dans l’union des banques ; quotas explicites disponibles, répartition équilibrée facultative. |
| Choix Libre | Ajout dans l’activité active si compatible, sinon ajout d’une activité standard ; sélection manuelle verrouillable. Créations et éditions propres à la fiche, jamais à la banque. |
| Images par question | Import local et réutilisation des ressources autorisées, taille/placement selon les contrôles existants, visibilité explicite du corrigé ; stockage durable, formats et limites à fixer après inspection de la stack actuelle. |
| Figures de théorie | Encadré pédagogique près du texte par défaut ; disposition adaptée au contenu ; pas de quota arbitraire. Formats, dimensions cibles et ressources exactes à valider selon le cours, les droits et le gabarit commun. |
| Identité EPCA | Logo et libellés sur la fiche imposés par le responsable ; autres lignes institutionnelles conservées configurables, à préciser si nécessaire. |

**Décisions V2.9 :** le responsable a choisi la sélection mixte, la proposition de points guidée par Bloom, les deux formats (histoire suivie et questions indépendantes aléatoires), la durée estimée, la réutilisation du système existant de modèles, l'adaptation automatique du récit et la liberté de modifier manuellement tout passage ensuite. Les fourchettes de points, les durées initiales, le mode Histoire par défaut, la protection automatique des passages édités, le préréglage de composition, la présentation de la synthèse et les variantes A/B/C restent des propositions ajustables. La stratégie déterministe à trames validées conserve l'exclusion antérieure d'une IA à la volée ; la couverture des adaptations dépendra des trames et questions effectivement validées.

### 12.4 Hors livraison de ce document

Ce cahier des charges repose sur l'inspection des fichiers Git indiqués au §2. Il n'a pas exécuté les générateurs ni évalué individuellement toutes les réponses. Les banques cloud et les variantes AFP enregistrées uniquement en production n’ont pas été consultées. Le fichier Git statique prévoit l’héritage mais ne contient pas de champs AFP spécifiques renseignés dans son constructeur. La couverture AFP définitive reste donc conditionnée à la validation du contenu commun et à la récupération des variantes autorisées éventuelles. Les axes de rédaction, objectifs de volume, accès pilote et règles de publication proposés doivent être confirmés. Aucun code n'a été modifié, aucune banque n'a été enrichie ou approuvée à ce stade. La réalisation commence par L0 puis L1 ; ne pas présenter la migration comme accomplie.


## 13. Consignes de réalisation à transmettre à Codex / agent de développement

Ce document est le cahier des charges de référence, à placer dans `docs/logistique/cahier-des-charges.md`. Lire les conventions du dépôt cible (`CLAUDE.md`, skills locaux, tests existants) avant de choisir les points d'intégration. Travailler sur une branche dédiée, avec commits réversibles, changements limités au périmètre, pull request et preuves. Utiliser le dépôt EPCAS en lecture seule. Ne pas exécuter de scripts source non inspectés, copier de secrets ou transférer de comptes.

**Mission :** intégrer deux domaines Logistique CFC et Logistique AFP dans Doc-Prof, au même niveau que Grammaire. Respecter la matrice de 80 codes dont 63 communs et 17 exclusifs CFC. Chaque sous-module éligible présente exactement les six types dans l'ordre imposé. Réutiliser l'interface, le moteur, les rendus, la sauvegarde et l'impression ; ne pas créer deux applications ni deux moteurs. Les contenus CFC et AFP doivent être résolus, contrôlés, enrichis, versionnés et approuvés séparément, avec partage canonique des unités identiques. Réaliser le pilote 105 dans les deux domaines, puis généraliser. Respecter les cibles de 50 vérifications, 30 problèmes distincts et 20 situations par sous-module et diplôme, sauf dérogation validée. Réutiliser toutes les questions exploitables existantes avec leurs corrigés, sans doublons ni perte d'information. Le volume nominal est de 14 300 occurrences, pas 14 300 contenus nécessairement distincts. Ne jamais déclarer un lot terminé si une banque manque de corrigés, une éligibilité est incertaine ou la validation formateur est absente.

**Priorité V2.1 — remise en conformité du parcours existant :** ne pas poursuivre le développement d’un `DomainShell` autonome ou d’un `PrintableDocument` spécifique. Reprendre les banques et le catalogue déjà importés, les raccorder au parcours standard `PageConfig`/`ExerciseBlock`/`WorksheetSheet` et conserver le style de paramétrage des activités. Les deux domaines sont des domaines réguliers, au même titre que Grammaire, Mathématiques et TCF. Aucun nouvel écran, aucune nouvelle page A4, aucune barre d’interface spécifique. Implémenter l’Évaluation multi-sous-thèmes (101/102 et davantage), le tirage par lot avec quantités explicites, la sélection manuelle de chaque unité dans le mode Libre, les deux modes de texte à compléter, les trois présentations de réponses et la grille Mathématiques avec trait de réponse obligatoire. Le seul changement de marque est sur le document : EPCA à la place de l’État du Valais, « Logistique AFP » ou « Logistique CFC » à la place de « Classe d’accueil ». Ne pas modifier le logo ClairFLE de la fenêtre. Faire réussir tous les tests §11.1 ter avant d’étendre massivement les banques. Ne pas remplacer la validation éditoriale, ni les droits de réutilisation, par une approbation automatique.

**Priorité complémentaire V2.2 — éditeur Libre et images :** le mode Libre standard doit servir à rédiger et modifier intégralement les questions et leurs réponses, et pas seulement à sélectionner une banque. Autoriser la création d’une question locale, les modifications de tous les champs spécifiques à chaque format, la restauration de l’original et le verrouillage des éditions. Les questions ajoutées à la fiche peuvent recevoir des images facultatives, issues d’un fichier local ou des ressources autorisées, avec réglages de taille, alignement, placement, légende et visibilité. Lier ces médias à des IDs d’instance stables, jamais à un index ; préserver la grille et le trait de réponse des mathématiques. Garantir le même aperçu A4, le même panneau Libre et le même moteur d’impression/sauvegarde. Conserver les corrections et médias après réouverture, ne jamais publier les modifications locales dans la banque, empêcher la divulgation des solutions dans la fiche élève. Réaliser le lot L1c et les tests §11.1 quater avant l’enrichissement massif. Aucune nouvelle page, aucun moteur de rendu parallèle et aucune intégration d’un service d’IA d’images ne sont demandés.

**Priorité complémentaire V2.3 — formats de question :** implémenter le registre §5.2 ter avec les contrôles standard de sélection et d’édition du §3.10, les contrats §7.4 quater, le lot L1d et les tests §11.1 quinquies. Les tableaux de données et dates à compléter, l’association image–terme et image–définition, l’identification écrite et la définition/description d’images sont des exigences explicites. Intégrer également les formats complémentaires pertinents de classement, repérage, schéma, graphique, ordre, frise, document et cas. Réutiliser en priorité les rendus d’association, tableaux, images, lignes et grilles des domaines existants après inspection ; ajouter les capacités manquantes au moteur commun. Les formats sont choisis par activité ou question, dans les six types, avec données et corrections complètes, éditions locales, snapshots et validation par diplôme. Ne pas transformer automatiquement une question en format incompatible ; ne pas compter les variantes de présentation comme des questions nouvelles. Les nouveaux formats doivent rester utilisables sur papier et en PDF, sans nouveau parcours UI ni abandon des exigences précédentes.

**Priorité complémentaire V2.4 — rédaction pédagogique des théories résumées :** ne jamais livrer le champ `contentSummary` ou `contentSummaryAfp` tel quel comme résumé approuvé. Lire intégralement la théorie complète résolue pour chaque diplôme ; inventorier toutes les notions et tous les termes techniques essentiels, puis rédiger un vrai cours synthétique, progressif et compréhensible pour des jeunes de 15 à 18 ans en premier apprentissage. Garder les termes métier exacts, expliquer leur sens avec des formulations simples et professionnelles, conserver les conditions, distinctions, règles et unités, ajouter des exemples originaux vérifiés si utiles. Ne pas infantiliser, imposer un niveau FLE, réduire arbitrairement la longueur ou supprimer une notion nécessaire. Archiver les sources autorisées, conserver la théorie complète séparément, et distinguer le résumé de l'aide-mémoire. Mettre en cohérence glossaires, questions et corrigés. Réaliser le lot L3b, la matrice de couverture §4.4 et les tests THR §11.1 sexies ; viser 100 % des notions essentielles validées par diplôme, et obtenir la revue pédagogique avant publication. Commencer par le module 105 en AFP et CFC dans le gabarit actuel, puis traiter les 143 occurrences de catalogue. Aucun nouveau parcours UI ni résumé généré à la volée.

**Priorité complémentaire V2.5 — illustration pédagogique de la théorie complète :** lire chaque cours complet applicable, établir le plan des besoins visuels et enrichir le support par des images, dessins, schémas, comparaisons, documents et séquences explicatives pertinents. Conserver le texte complet de référence autorisé ; exclure toutes les anciennes figures EPCAS/EnterSite et créer les nouveaux visuels originaux nécessaires, selon les exigences V2.6. Utiliser de préférence les encadrés existants, à proximité du passage expliqué, avec légende et termes métier ; adapter le format (pleine largeur, côte à côte, planche ou séquence) à la lisibilité. Aucune décoration systématique, aucun quota d'images, aucune nouvelle interface ni moteur d'impression. Assurer la validation métier, la provenance, les droits, la couverture des besoins indispensables et la lisibilité A4, y compris en niveaux de gris ; conserver les figures essentielles dans les résumés réécrits. Réaliser le pilote 105 en CFC et AFP, le lot L3c, les contrats §7.4 sexies et les tests THV-T §11.1 septies avant généralisation. Les illustrations liées à des activités dangereuses servent à la prévention et à la reconnaissance, jamais à un tutoriel opérationnel. Ne pas déclarer les figures réalisées ou approuvées si elles ne le sont pas.

**Priorité complémentaire V2.6 — textes originaux et bibliothèque visuelle neuve :** enregistrer l’autorisation de l’auteur concernant ses textes théoriques, ne pas les bloquer pour une demande de droits redondante, distinguer cette autorisation de la validation pédagogique. EnterSite est une entreprise fictive, pas une source éditoriale tierce. Ne récupérer aucune image EPCAS/EnterSite, y compris les variantes AFP, pièces jointes et références distantes. Construire une bibliothèque originale à partir des notions textuelles ; générer les illustrations pertinentes et dessiner les schémas précis en vectoriel. Réutiliser les nouveaux visuels entre théories, résumés, glossaires, exercices et corrigés lorsqu’ils conviennent. Traiter les renvois anciens et supports dépendants selon §6.1 bis, produire les figures selon THV-10/11 et réussir les tests V2.6. Les nouveaux médias sont intégrés à l’avance, pas générés à chaque fiche. Ne pas reprendre les images anciennes même sous prétexte de remplir un quota. Ne pas modifier les logos ni le fonctionnement des autres domaines. Conserver les obligations V2.1–V2.5, sauf les clauses de réemploi des anciennes images explicitement remplacées.

**Priorité complémentaire V2.7 — texte complet fidèle et glossaires refaits :** conserver intégralement le texte original applicable au diplôme, sans enrichissement rédactionnel ni reformulation. Corriger uniquement les erreurs linguistiques avérées et consigner chaque modification. Signaler les anomalies de fond et les sources absentes ; ne jamais inventer ou modifier silencieusement des connaissances métier. Conserver les nouveaux visuels originaux en blocs distincts près du texte. Réécrire le résumé comme prévu en V2.4. Refaire intégralement les glossaires à partir du cours complet corrigé, en utilisant les anciennes entrées uniquement comme repères de contrôle ; couvrir tous les termes techniques essentiels, rédiger des définitions accessibles et professionnelles, harmoniser les exercices et les résumés. Exécuter les lots L3a et L3d et les tests THC-T01–05 et GL-T01–05. Cette exigence prime sur les formulations antérieures incompatibles ; aucune nouvelle UI.

**Priorité complémentaire V2.8 — pagination et titres :** appliquer §§8.5–8.6 au rendu commun, conserver une réserve minimale de 25 px CSS au-dessus du pied de page sur chaque page, paginer le contenu réel sans perte, maintenir les sauts manuels et les enregistrer. Utiliser les titres du type « Théorie : module 101 » et « Glossaire : module 101 » dans le champ actuel ; gérer les sélections multiples et conserver les personnalisations. Exécuter le lot L1e et les tests PAG/TITLE. Cette convention remplace les anciens exemples de titres automatiques incompatibles.

**Priorité complémentaire V2.9 — conception des évaluations :** appliquer §3.11, §7.4 septies, le complément §8.3, le lot L1f et les tests EV9-T01–15. Réutiliser le mode Évaluation, les paramètres et le mode Libre communs. Le mode Histoire assemble une trame suivie en « vous », ajuste automatiquement les dépendances et laisse modifier chaque passage manuellement, avec protection et annulation ; le mode Questions indépendantes tire des questions autonomes. Les deux permettent la sélection mixte, le barème Bloom ajustable, la durée indicative et la sauvegarde/modèle communs. Aucun ajout de sixième type, de page autonome, de système de notes ni de génération libre d'IA à la volée. Réaliser L1f après le socle de sélection et d'édition et avant la recette finale ; valider les trames sur les pilotes des deux diplômes avant généralisation. Ne pas déclarer les fonctionnalités implémentées, les estimations calibrées ou les banques validées sans preuve.

**Priorité complémentaire V2.10 — bibliothèque de médias :** appliquer §7.2 bis et IMG10-T01–11. Isoler les illustrations dans `public/assets/logistique/` par thème puis sous-module, mutualiser AFP/CFC et les usages par identifiant canonique, conserver les révisions nécessaires aux fiches sauvegardées. Les imports personnels du mode Libre restent dans le stockage protégé. Valider le chemin de base de déploiement et le registre avant création massive. La structure détaillée et les conventions de nommage sont des choix de conception ; la séparation du dossier Logistique et le rangement par module sont imposés. Ne pas créer de nouvelles images à la génération des fiches.

**Contrat de compte rendu à chaque lot :** commit de référence, fichiers modifiés, contenus importés, originaux conservés, corrigés rectifiés, créations, partages, adaptations, approbations par diplôme, déficits, cas bloqués, commandes de test et résultats, captures/PDF et prochaines dépendances. Présenter séparément les tests techniques, les relectures pédagogiques automatiques et la validation enseignante. Si une source autorisée ou une décision pédagogique manque, documenter le blocage et poursuivre uniquement les travaux qui n'en dépendent pas. Ne pas générer de fausse donnée officielle ni réduire le périmètre sans l'indiquer.

**Définition de la livraison :** deux domaines accessibles selon droits, 16 thèmes de catalogue, 143 sous-thèmes de catalogue et 858 types, les six catégories exploitables pour chaque entrée applicable, fiches élève/corrigé déterministes et sauvegardables, couverture par notion et par diplôme, documentation et preuve de non-régression. La réception finale est conditionnée aux approbations et droits requis, non à un simple nombre de fichiers créés.

## 14. Historique de version

La version 2.11 intègre la reprise dans le générateur commun, la validation éditoriale directe demandée par le responsable et le suivi continu par lot du §0.

- V1.0 : cahier initial CFC transmis par le responsable du projet.
- V2.0 : consolidation des exigences précédentes et extension intégrale AFP ; distinction des catalogues, années et droits, inventaire des 63 codes AFP, matrice enrichie pour les 80 codes, résolution des variantes et héritages, dimensionnement, différenciation, modèle partagé et tests croisés. Les quotas, formats optionnels (aide-mémoire, théorie à compléter, cartes), répartition Bloom, scénario pilote et personnalisation EPCA sont des décisions proposées à confirmer. Aucun code des dépôts n'a été modifié dans le cadre de cette rédaction.
- V2.1 : exigences impératives du 25 novembre 2026 : intégration stricte à la structure actuelle des activités, réintégration du shell et du rendu provisoires, évaluation multi-sous-thèmes, mode Libre avec lots et sélection individuelle, textes à compléter inline avec/sans banque de mots et leurres, trois formats de réponse, grille de calcul et trait de réponse, identité EPCA limitée à la fiche. Les quotas de la V2.0 et la matrice CFC/AFP restent inchangés. Les exemples de répartition, stratégies de sélection et noms de types techniques sont des propositions d’implémentation ; les exigences d’interface et de rendu énoncées par le responsable sont impératives. Aucune modification du code ni validation de banque effectuée pendant cette révision documentaire.

- V2.2 : extension du mode Libre dans les deux domaines : rédaction et modification individuelle des questions, réponses et corrigés, création locale, contrôle des changements, illustrations facultatives par question ou sous-question, ajout/remplacement/réglages/visibilité, persistance et tests de rendu. Les exigences V2.1, la structure commune, les quotas et la matrice AFP/CFC sont conservés. Les contrats techniques, modalités de stockage, formats autorisés et limites de médias restent des propositions à confirmer selon les composants existants. Révision documentaire uniquement ; aucun code modifié ni banque validée.

- V2.3 : extension du registre interne à 30 formats (dont les présentations et cas conteneurs), tableaux de données et de dates, associations visuelles, identification/définition d’images, schémas et documents ; contrôles par activité et question, contrats typés, édition Libre, sauvegarde, lot L1d et quinze tests bloquants. Les exemples, noms techniques et rattachements sont des propositions de conception, à valider avec le référentiel pédagogique et les composants existants. Aucun changement de quota, de catégorie, de marque ou de structure UI ; révision documentaire uniquement.

- V2.4 : obligation de reprendre la théorie complète applicable et de réécrire chaque résumé en français professionnel accessible à des jeunes de 15–18 ans en premier apprentissage ; maintien intégral des notions et du vocabulaire technique essentiels, définitions reformulées, distinction cours complet/résumé/aide-mémoire, alignement glossaire et exercices, matrice de couverture, lot L3b et onze tests de réception. Les structures de données, la présentation rédactionnelle et les exemples originaux sont des propositions à adapter ; le résultat éditorial et la couverture essentielle sont impératifs. Toutes les exigences V2.1–V2.3 sont maintenues. Révision documentaire uniquement, sans réécriture effective des cours ni validation pédagogique.

- V2.5 : enrichissement visuel obligatoire des théories complètes CFC/AFP, inventaire des besoins par notion, visuels pertinents conservés ou ajoutés, encadrés légendés et dispositions adaptées dans le gabarit actuel, validation des droits et de l’exactitude, réutilisation des figures essentielles dans les résumés, contrat de données, lot L3c et douze tests de réception. Le choix précis des visuels et leur nombre sont déterminés par la lecture des cours et la validation pédagogique ; aucun visuel n’a été créé ni importé lors de cette révision documentaire. Toutes les exigences V2.1–V2.4 restent applicables.

- V2.6 : clarification de la propriété des textes théoriques et de leur autorisation de réutilisation dans Doc-Prof ; EnterSite est une entreprise fictive de l’auteur. Exclusion totale des images pédagogiques EPCAS/EnterSite des nouvelles fiches et banques ; bibliothèque originale générée/construite pour les deux diplômes, inventaire des besoins et contrôle de provenance, tests ORIG-01 à ORIG-06. Aucun visuel produit, aucune migration ni modification GitHub réalisée lors de cette révision documentaire.

- V2.7 : reprise textuelle intégrale de la théorie complète avec correction linguistique limitée, journal des modifications et signalement séparé des anomalies de fond ; maintien de la création des visuels originaux et des résumés retravaillés. Reconstruction complète des glossaires CFC/AFP, couverture des termes essentiels, définitions professionnelles accessibles, lots L3a/L3d et dix tests de réception. Révision documentaire uniquement : aucune correction effective des cours ni rédaction des glossaires ou modification GitHub réalisée.

- V2.8 : pagination automatique des contenus longs, réserve obligatoire de 25 px CSS avant le pied de page, règles de fragmentation et recalcul, sauts manuels persistants, titres automatiques par type et code de sous-module, lot L1e et onze tests bloquants. Les conventions de titres mixtes et le comportement avec chrome masqué sont des choix proposés. Aucune modification du code ni exécution des tests de rendu lors de cette révision documentaire.

- V2.9 : conception des évaluations AFP/CFC, sélection mixte, histoire suivie et tirage indépendant, ajustement automatique des passages et édition manuelle protégée, barème Bloom modifiable, durée estimée, bilan pédagogique, modèles et récupération de brouillons dans le système commun ; lot L1f et quinze tests bloquants. Les variantes A/B/C et préréglages restent proposés. Révision documentaire uniquement, sans modification des dépôts, exécution des tests ni validation des banques ou des temps.

- V2.10 : arborescence dédiée aux images logistique par thème et sous-module, mutualisation AFP/CFC et usages, conventions de nommage, registre et contrôle d’intégrité, qualité et persistance, onze tests bloquants. Chemin de base repris de V2.9, à vérifier sur le dépôt lors de l’implémentation ; sous-dossiers de portée et noms proposés. Les exigences V2.9 et antérieures sont conservées. Révision documentaire uniquement : aucun fichier image créé et aucun code, dossier GitHub ou stockage distant modifié.
