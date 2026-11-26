# Cahier des charges — Refonte transversale du mode Libre de Doc-Prof

- **Version 1.2 — 26 novembre 2026**
- **Dépôt** [oasi-phuoc/doc-prof](https://github.com/oasi-phuoc/doc-prof)
- **Référence de l’audit V1.1** Arbre Git `a6070b6df1468e995103c434f1e85f04099b9c3d` indiqué dans le document source.
- **Source consultée pour la publication** `c24a995b76c` (préfixe du commit de référence consigné dans le suivi d’avancement). Le lot L0 fixe sa référence exécutable.
- **Document associé** [Cahier des charges Logistique CFC/AFP V2.11](../logistique/cahier-des-charges.md)
- **Statut** Spécification validée. Les rapports d’exécution et les mesures de référence relèvent de L0.

La V1.2 précise l’édition en direct, les changements de banque ou de quantité, les sorties élève/corrigé, les règles de reprise et la compatibilité des recettes existantes. Elle place l’identité des unités, les verrous et la reprise du brouillon dans le socle technique. Le tableau des arbitrages (§17) indique les décisions de produit et les vérifications techniques à mener en L0 et dans les lots concernés.

[Exigences](#1-objectif-et-exigences-impératives) · [Architecture](#9-architecture-technique-cible) · [Plan de réalisation](#11-plan-de-réalisation) · [Tests de réception](#12-tests-obligatoires-et-critères-de-réception) · [Arbitrages](#17-arbitrages-avant-mise-en-œuvre) · [Suivi d’avancement](avancement.md)

## 1. Objectif et exigences impératives

Le mode Libre donne au formateur un paramétrage détaillé de l’activité qu’il voit déjà dans le générateur. Il reprend les contrôles applicables du mode normal et permet d’éditer le contenu, les corrections et la présentation avec un aperçu réactif. Chaque contrôle affiché a un effet démontrable dans son contexte.

| ID | Exigence impérative |
|---|---|
| LIB-01 | En ouvrant Libre, remplacer le panneau de paramètres d’activité par le panneau Libre dans la zone gauche. Un seul panneau de paramètres d’activité est monté à la fois. |
| LIB-02 | Au bureau, Libre occupe la largeur disponible à gauche. À fenêtre, format, contenu et zoom identiques, le cadre de l’aperçu conserve sa largeur, sa hauteur et son échelle du mode normal. Les dimensions physiques imprimées sont vérifiées séparément. |
| LIB-03 | Réutiliser la route, la barre d’outils, les sélecteurs, le style, la gestion des feuilles/activités, le rendu, l’impression et le parcours de sauvegarde existants. |
| LIB-04 | Tous les réglages applicables du panneau normal restent accessibles dans Libre, une fois par effet et portée, avec la valeur de travail courante. |
| LIB-05 | Permettre l’édition des valeurs, énoncés, consignes, supports, réponses, choix, leurres, critères et points selon les structures métier de l’exercice. |
| LIB-06 | Chaque type actif et variante structurelle résout un profil exhaustif. Le partage d’un éditeur exige un contrat commun et des différences explicitement couvertes. |
| LIB-07 | Afficher uniquement les réglages effectifs dans le contexte courant. Une exigence active dont le réglage reste sans effet doit être raccordée au générateur, au rendu ou à la persistance avant réception. |
| LIB-08 | Présenter l’aide descriptive dans des info-bulles accessibles au clavier, à la souris et au tactile. Conserver en clair les libellés, unités, erreurs, alertes et consignes utiles. |
| LIB-09 | Rendre modifiables les espacements, marges internes pertinentes, dimensions des zones de réponse, images et éléments visuels compatibles avec le profil et le format papier. |
| LIB-10 | Préserver les fonctions disponibles, les droits, les anciennes recettes, les banques originales et les particularités de chaque domaine, dont les modes Exercice et Évaluation. |
| LIB-11 | Présenter un état explicite pour les domaines, types et banques indisponibles. Seuls les contenus et éditeurs opérationnels entrent dans le parcours de génération. |
| LIB-12 | Limiter le chantier aux fiches imprimables et à leurs éditeurs. Les jeux interactifs, le catalogue audio et la gestion des comptes sont hors périmètre. |
| LIB-13 | Appliquer automatiquement les modifications valides dans les deux panneaux. Préserver localement une saisie temporairement invalide avec une indication claire et garder le dernier état cohérent dans l’aperçu. |
| LIB-14 | Protéger les unités verrouillées et leurs dépendances contre la régénération. Permettre le verrouillage individuel et en série sur les profils régénérables. |
| LIB-15 | Récupérer automatiquement la dernière révision durable de travail après rechargement ou fermeture accidentelle. Le brouillon de récupération reste distinct de la sauvegarde définitive. |
| LIB-16 | Annuler et rétablir les opérations d’édition de manière atomique. Hiérarchiser les actions, y compris au clavier et sur écran étroit, selon les critères de §15–16. |
| LIB-17 | Limiter les changements visuels aux panneaux de paramètres et aux raccords indispensables. Comparer la barre globale, la navigation, l’apparence et les dimensions de la fiche ainsi que les parcours d’impression et de sauvegarde à la référence L0. |

La V1.1 consigne quatre choix confirmés par le responsable du projet : périmètre visuel strict, application directe, verrouillage contre le nouveau tirage et récupération automatique du brouillon. La V1.2 intègre les validations du 26 novembre 2026 sur la réception Logistique, les sorties et sauvegardes, les verrous, les évaluations personnalisées, les brouillons, les images, l’affichage mobile et les préférences (§17).

## 2. Audit statique de référence

### 2.1 Constats et points à vérifier sur la branche cible

Le tableau reprend les constats de l’audit V1.1 et les observations de préparation. L’emplacement exact des sources, les comportements et les compteurs doivent être confirmés au commit retenu pour L0. Les rapports L0 figeront les preuves à ce commit.

| ID | Source | Constat de référence et vérification L0 |
|---|---|---|
| A01 | [GeneratorPage.tsx](../../src/components/generator/GeneratorPage.tsx) | Le panneau normal et le résultat sont montés avant le panneau Libre additionnel. Vérifier le remplacement conditionnel du panneau d’activité et l’unicité du résultat. |
| A02 | [App.css](../../src/App.css), [A4Frame.tsx](../../src/components/generator/A4Frame.tsx) | La feuille s’adapte à la largeur du cadre. L’audit historique relève des bases desktop de 300 px pour les paramètres et 560 px pour le résultat. Mesurer la géométrie réellement rendue à chaque point de rupture. |
| A03 | [SettingsPanel.tsx](../../src/components/generator/SettingsPanel.tsx) | Les groupes de sélection, calligraphie, soutien, colonnes, coordonnées et grilles ont des règles propres. Inventorier les réglages et conserver leurs composants et actions réutilisables. |
| A04 | [LibreSidePanel.tsx](../../src/components/generator/LibreSidePanel.tsx) | L’éditeur résulte de branches par domaine et type. Détecter les chevauchements et les activités dépourvues de profil adapté. |
| A05 | [GenericLibreEditor.tsx](../../src/components/generator/GenericLibreEditor.tsx) | L’éditeur générique travaille surtout sur du texte et sur les options existantes. Qualifier précisément les types textuels compatibles, puis couvrir leurs opérations et leur validation. |
| A06 | [TpmLibreEditor.tsx](../../src/components/generator/TpmLibreEditor.tsx), [libre-recalc.ts](../../src/tpm/libre-recalc.ts) | Les opérations, suites, fractions, problèmes, figures, coordonnées et plans ont des données et recalculs spécialisés. Les vérifier dans chaque profil de maths concerné. |
| A07 | [PhraseLibreEditor.tsx](../../src/francais/PhraseLibreEditor.tsx) | Plusieurs variantes Gattegno ont déjà un parseur. Établir la couverture de SVC, tableaux, tokens et catégories et vérifier le corrigé associé. |
| A08 | [TcfExerciseEditor.tsx](../../src/tcf/TcfExerciseEditor.tsx) | TCF et certaines pratiques de Grammaire partagent des éditeurs de supports. Vérifier séparément les variantes et snapshots des banques graduées. |
| A09 | [WorksheetImage.tsx](../../src/components/WorksheetImage.tsx), [recipe.ts](../../src/fiches/recipe.ts) | L’audit relève des remplacements indexés par source et des imports locaux temporaires. Vérifier la préservation des anciens remplacements globaux et la nouvelle portée par occurrence. |
| A10 | [GeneratorPage.tsx](../../src/components/generator/GeneratorPage.tsx), [usePageConfig.ts](../../src/components/generator/usePageConfig.ts), [useGenerateActions.ts](../../src/components/generator/useGenerateActions.ts) | La dernière version validée alimente certains aperçus, avec des exceptions de mise à jour en direct. Inventorier la saisie, l’application, la fermeture, la génération et la sauvegarde par voie d’entrée. |
| A11 | [WorksheetSheet.tsx](../../src/components/generator/WorksheetSheet.tsx), [TopbarTools.tsx](../../src/components/generator/TopbarTools.tsx) | L’audit relie `exerciseGapPx` au rendu TCM CSC. Mesurer l’effet et identifier la portée réelle des autres espacements. |
| A12 | [QuestionsColumnsFields.tsx](../../src/components/generator/QuestionsColumnsFields.tsx), [DomainThemeTypeFields.tsx](../../src/components/generator/DomainThemeTypeFields.tsx) | Les conditions de visibilité dépendent des domaines, formats et banques. Cartographier l’effet réel et distinguer aide descriptive, erreur et consigne pédagogique. |
| A13 | [A4Frame.tsx](../../src/components/generator/A4Frame.tsx), [useQuestionsOverflow.ts](../../src/components/generator/useQuestionsOverflow.ts) | L’échelle est calculée par observation du cadre. Vérifier aussi pied, pages multiples, demi-feuilles, supports tardifs et groupes insécables. |
| A14 | [catalogue Logistique](../../src/logistique/catalog.ts), [paramétrage commun](../../src/components/generator/generator-derived.ts), [suivi Logistique](../logistique/avancement-cahier-des-charges-20261126.md) | La référence de publication raccorde déjà Logistique AFP et CFC au générateur commun. Établir les capacités des modules raccordés, puis étendre leurs profils selon le cahier des charges Logistique V2.11. |
| A15 | [access.ts](../../src/access.ts), [catalog.ts](../../src/math/catalog.ts), [generator-derived.ts](../../src/components/generator/generator-derived.ts) | Les listes de domaines, droits et types générés évoluent. Calculer le nombre de domaines et de contextes accessibles sur le commit L0. La valeur 21 de la V1.1 est un repère historique. |
| A16 | [recipe.ts](../../src/fiches/recipe.ts), [API des fiches](../../api/fiches/src/index.ts) | Le checkout de préparation comporte deux parseurs limités aux recettes v1 et une limite API de `800_000` sur la longueur de la chaîne JSON reçue. Confirmer ces contraintes sur la cible et les inclure dans la stratégie de migration et de médias. |

### 2.2 État de la préparation et limites de preuve

La publication a été préparée dans une copie isolée de la branche distante à jour, dont le commit est consigné dans le suivi. Les erreurs TypeScript observées sur la copie de travail initiale concernaient des fichiers de Grammaire manquants dans cette copie. Le lot L0 établit l’état du code sur sa propre référence et mesure la couverture des paramètres, des rendus, des variantes et des droits. Les emplacements et compteurs de la V1.1 guident l’inventaire.

## 3. Structure de la fenêtre et parcours utilisateur

### 3.1 Deux états du même générateur

| Zone | Mode normal | Mode Libre |
|---|---|---|
| Panneau d’activité à gauche | Paramètres rapides de l’activité | Paramètres de l’activité, contenu et présentation adaptés au profil |
| Résultat à droite sur écran large | Aperçu de la feuille active | Même composant, cadre, échelle, zoom et mode élève/corrigé |
| Actions documentaires | Barre, navigation feuilles/activités, impression et sauvegarde existantes | Mêmes actions, routées vers l’état de travail courant |

Au bureau, le mode Libre utilise l’espace restant à gauche (par exemple `flex: 1 1 0; min-width: 0` si le conteneur le permet). Le cadre de l’aperçu conserve sa géométrie du mode normal aux points de rupture retenus. Le panneau gauche peut défiler indépendamment. Les tableaux larges défilent dans leur propre conteneur. Les outils d’en-tête et de pied occupent le panneau gauche ou une superposition existante compatible avec la largeur disponible.

Sur écran étroit, conserver la disposition responsive de référence lorsqu’elle permet l’usage des deux zones. Ajouter une bascule « Édition / Aperçu » aux largeurs où la disposition courante gêne l’accès à l’éditeur ou à la fiche. Le seuil est établi en L1 à partir des mesures L0. La bascule conserve feuille, activité, saisie, zoom et position et rend le focus à la zone active. Les mesures d’acceptation concernent séparément cadre visible, défilement global, accessibilité des actions et dimensions du PDF.

### 3.2 Organisation compacte du panneau Libre

| Zone | Contenu | Visibilité |
|---|---|---|
| Bandeau | Titre, fermeture, état de travail, feuille et activité courantes | Toujours |
| Activité | Domaine, thème, type, niveau, variante, quantité et banque | Seulement pour les contrôles applicables |
| Contenu | Consigne, unités, édition, ajout, suppression, déplacement, accès à la banque | Zone principale lorsqu’elle contient un élément éditable |
| Présentation | Colonnes, réponse, espaces, médias, grilles, sauts, typographie locale | Selon capacités, réglages avancés repliables |
| Barème/corrigé | Points, bonnes réponses, critères et état de vérification | Dans l’unité ou son groupe de correction |
| Actions du panneau | Annuler, rétablir, régénérer, verrouiller et actions en série | Selon la portée et les capacités |

La liste donne un extrait de chaque unité et les états utiles. Une seule unité développée par défaut est une proposition ergonomique. Les actions au clavier et tactiles restent accessibles avec le focus dans la liste. Les sections n’exigent pas de navigation sur un autre écran.

### 3.3 Ouverture, édition en direct et fermeture

1. Ouvrir Libre avec le contenu actuellement affiché, sa graine, le mode élève/corrigé et la position active. La bascule seule laisse le contenu et l’ordre identiques.
2. Appliquer automatiquement une valeur valide à l’état de travail. Les changements de contenu recalculent le corrigé selon le profil. Les changements de présentation actualisent le rendu. Les opérations de tirage explicites suivent §9.5 et §15.2.
3. Conserver une saisie incomplète ou invalide dans son champ et afficher une indication locale. L’aperçu continue de représenter la dernière valeur appliquée. Les sorties utilisent la politique de validité de §9.5 et l’arbitrage ARB-03.
4. Fermer et rouvrir Libre, changer de feuille ou revenir à une activité conserve les modifications appliquées, les saisies transitoires et les identifiants. Un choix de remplacement est proposé quand une transition est destructrice ou incompatible.
5. Annuler/rétablir restaure l’ensemble des données liées à l’opération, y compris correction, présentation, médias et verrous. La sauvegarde définitive reste une action du parcours existant. Le brouillon local est traité selon §15.5.

## 4. Principe fondamental : aucun paramètre inutile

### 4.1 Classification obligatoire des paramètres

| État | Définition | Comportement UI |
|---|---|---|
| Applicable et effectif | Le réglage produit un effet observable et valide dans le contexte actuel. | Affiché au bon endroit, une seule fois. |
| Applicable sous condition | Le réglage n'a un effet que pour une variante, un contenu ou un mode précis. | Masqué tant que la condition est fausse ; apparaît lorsque vraie. |
| Avancé mais effectif | Effet réel, usage moins fréquent. | Section avancée repliable, pas supprimé. |
| Temporairement indisponible | Action pertinente mais impossible momentanément (chargement, sélection requise, erreur). | Masquer si inutile ; si nécessaire à la compréhension d'un état, afficher une action désactivée et raison courte. |
| Imposé | Valeur fixe par le format ou règle métier (par ex. grille des maths logistiques). | Pas de contrôle trompeur ; information compacte si utile. |
| Non applicable / non raccordé / sans effet | Le type ne consomme pas le champ, ou le résultat reste inchangé. | Ne pas afficher dans aucun des deux panneaux. Corriger le raccord si la fonctionnalité est requise. |

Un réglage ne doit pas être conservé uniquement parce qu'un champ existe dans `ExerciseBlock`, ni masqué uniquement parce que sa valeur par défaut est fréquente. Aucun « réglage factice » : une variation de valeur doit être traçable jusqu'au générateur, au payload, au rendu, au barème ou à la persistance. Ne pas considérer comme sans effet une option qui agit uniquement sur la prochaine génération ; la présenter alors comme telle, sans altérer les valeurs actuelles en silence.

### 4.2 Règles concrètes de visibilité

| Réglage | Condition d'apparition |
|---|---|
| Niveau, difficulté | Le type possède plusieurs niveaux/variantes distinctes réellement accessibles. |
| Nombre de questions | Le type peut faire varier son nombre d'unités ; sinon ne pas afficher un nombre non modifiable comme input. |
| Colonnes | Le renderer accepte plusieurs répartitions ; pas de sélecteur pour un support indivisible de largeur fixe. |
| Sous-thème, banque, série | Plusieurs choix éligibles, respect des autorisations et filtres réellement consommés. |
| Points | Mode Évaluation et activité notée ; ne pas proposer de points pour une théorie ou une page de consignes non notée. |
| Format QCM/lignes/texte | Unités compatibles et conversion validée ; ne jamais fabriquer des propositions artificielles pour un calcul, une dictée ou une question non compatible. |
| Nombre et longueur des lignes | Présence d'une zone de réponse manuscrite correspondante. |
| Largeur des blancs inline | Existence de blancs inline dans le contenu ou action explicite d'en ajouter. |
| Leurres et banque de mots | Exercice avec choix/banque de mots ; si mode sans aide, masquer les leurres. |
| Audio, QR, transcription | Exercice utilisant effectivement de l'audio. Ne pas exposer le remplacement de QR comme une image ordinaire. |
| Géométrie, axes, quadrillage, cotes | Payload et rendu concernés ; ne pas afficher les réglages de repérage sur une question purement textuelle. |
| Images, taille, placement | Uniquement pour les types pouvant afficher des médias ; réglages d'une image seulement lorsqu'elle existe ou est sélectionnée. Le bouton Ajouter image reste visible si le type supporte une illustration facultative. |
| Grille de calcul | Calculs et problèmes qui l'utilisent ; règles obligatoires (logistique) non désactivables. |
| Espacement des questions | Présence de plusieurs unités ou d'une marge interne explicitement rendue ; pas de slider pour un espacement qui ne s'applique nulle part. |
| Espacement entre activités | Plusieurs activités ou création de blocs prévue ; préciser la portée. |
| Saut de page | Bloc/question séparables et pagination qui consomme réellement ce paramètre. |
| Cartes, recto/verso | Type de grille qui possède ce rendu, pas un exercice de texte ordinaire. |

En cas de sélection de plusieurs questions, afficher les contrôles communs compatibles ; si les valeurs diffèrent, état « valeurs différentes ». Modifier en lot seulement ce que toutes les unités sélectionnées supportent. Ne jamais écraser les autres réglages ni les valeurs d'une variante cachée ; les conserver si elles restent valides, sinon migration explicite. Un contrôle masqué ne doit pas laisser de valeur parasite influencer un autre type d'exercice.

### 4.3 Audit d'efficacité des contrôles

Pour chaque contrôle visible, relever son identifiant stable, sa portée, son contexte, son champ de stockage, ses contraintes, le composant d’entrée, le consommateur et l’effet attendu. Vérifier au moins deux valeurs valides quand le réglage l’autorise, et l’absence du contrôle dans un contexte où il est inapplicable. Pour une action sans valeur, vérifier une exécution et un cas d’exclusion ou d’indisponibilité quand il existe. Fixer la graine pour séparer l’effet du tirage. Mesurer la géométrie pour les styles, le total pour les points et l’aller-retour pour la persistance. Associer chaque contexte au test d’effet correspondant selon §10.3.

## 5. Interface épurée et aide contextuelle

- Réutiliser les contrôles, boutons, couleurs, polices et conventions de Doc-Prof. Pas de redesign général. Les libellés restent courts, explicites et en français ; les unités (px, mm, points, lignes) restent visibles.
- Supprimer les descriptions répétitives sous les options, les phrases d'introduction inutiles, les compteurs redondants, les encadrés décoratifs et les sous-titres qui répètent un libellé. Remplacer les textes explicatifs par une info-bulle accessible attachée au libellé/contrôle, pas à tout le panneau.
- Délai de survol proposé : 600 ms, sortie au départ de la souris ; délai évitant les clignotements lors du passage d'un contrôle à l'autre. Au clavier : afficher au focus selon une logique accessible ; Escape ferme l'aide ; sur tactile, icône d'aide discrète ou ouverture au toucher explicite. L'aide ne masque pas le champ actif et ne change pas la mise en page. Utiliser `aria-describedby` et une implémentation compatible avec les éléments existants. Ne pas dépendre uniquement de l'attribut HTML `title`.
- Les textes d'erreur, avertissements de débordement, erreur de saisie ou corrigé à vérifier, limite de banque, absence de résultat, permissions et instructions réellement nécessaires restent visibles, au plus près du problème. Les consignes pédagogiques imprimées ne sont pas des textes d'aide UI et ne doivent pas être supprimées.
- Sections repliables : utiliser l'état ouvert par défaut pour l'essentiel (activité et contenu), avancé pour les réglages plus fins. Éviter les cartes imbriquées et les lignes inutilement hautes. Aligner les champs liés (quantité/colonnes, hauteur/largeur, points/lignes) quand la largeur le permet.
- Ne pas afficher en permanence trente champs de présentation pour une question simple. Un contrôle de niveau bloc et un remplacement local de niveau question ne doivent pas ressembler à deux réglages concurrents : libellé « Hériter / Personnaliser » et action de restauration. Afficher les changements sans surcharger les questions non sélectionnées.
- Garder une navigation claire : numéro de feuille, numéro d'activité, recherche/filtre dans la banque si disponible ; sélection et liste des éléments avec réordonnancement. Le panneau peut être large, mais le texte des champs longs doit rester confortable à lire.

## 6. Édition commune du contenu et de la présentation

### 6.1 Portées des paramètres

| Portée | Paramètres typiques |
|---|---|
| Fiche/document | Titre, mode, en-tête/pied, police générale, marges, format physique, numérotation, impression du corrigé ; utiliser les contrôles documentaires existants. |
| Feuille | Sélection, ordre, sauts, propriétés de mise en page compatibles. |
| Activité/bloc | Consigne, banque, niveau, difficulté, quantité, colonnes, format par défaut, points par question, espacements verticaux/horizontaux, taille d'image/grille par défaut. |
| Question/unité | Énoncé, réponse(s), choix, données, position des blancs, barème individuel, lignes, illustration, largeur, padding local, saut avant/après, verrouillage contre la régénération si le type est régénérable. |
| Support/sous-question | Documents, tableau, image et légende, repères, audio, relation avec les questions, réponse et points distincts. |

Priorité : surcharge question > réglage bloc > valeur par défaut du profil, sauf contrainte imposée. Ne jamais modifier des styles globaux du document pour changer une seule question. Les dimensions de la fiche et le zoom d'aperçu sont indépendants des espaces imprimables. Le panneau affiche la portée du réglage et permet « Réinitialiser » au niveau approprié.

### 6.2 Composition et édition des questions

- Ajouter, supprimer (avec protection contre perte), déplacer, dupliquer une question, sélectionner dans une banque ou tirer un lot lorsque possible. Conserver les identifiants d'origine et des occurrences ; une duplication possède un nouvel ID local. Ne pas créer automatiquement une quantité supérieure à la capacité réelle de la banque.
- Éditer une consigne et les énoncés, les choix et bonnes réponses par ID, les réponses libres, synonymes autorisés et critères de correction. Le nombre d'items et les points suivent la liste réelle. Les ensembles avec document/cas et sous-questions gardent leurs liens.
- Éditer les valeurs numériques à travers des champs typés (entier/décimal/unité/signe/position manquante). Recalculer les réponses et étapes via les fonctions métier existantes. Ne pas réutiliser une réponse ancienne après modification de données. Permettre une correction manuelle justifiée pour un problème ouvert ou un texte personnalisé ; si contradiction détectée, signaler et empêcher l’utilisation d’un corrigé incohérent.
- Pour les supports structurés, éditer directement les lignes, colonnes, cellules, champs, repères, catégories, tokens ou paires. Les modifications d'ordre préservent les réponses et les références. Aucune concaténation en texte brut qui détruit un rendu spécialisé.
- Pour les théories, glossaires et pages de consignes : éditeur par blocs structurés (titres, paragraphes, listes, tableaux, figures, termes), sans forcer un couple question/réponse. Autoriser les modifications locales ; ne pas modifier la source institutionnelle. Ne pas inventer un corrigé pour une fiche de référence.
- Les évaluations standard appliquent l’ordre, le nombre d’unités et le barème de leur format. Une modification de ces règles passe par la création explicite d’une fiche personnalisée, identifiable dans l’interface et à la réouverture. Les contenus et les règles du format standard restent disponibles.

### 6.3 Espacements et dimensions

| Paramètre | Effet à implémenter ou vérifier |
|---|---|
| Espacement entre activités | Distance verticale entre deux blocs, jamais ajouté au-dessus du premier de la page. Migrer `exerciseGapPx` sans modifier les anciens rendus TCM CSC. |
| Espacement entre questions | `row-gap` ou équivalent dans le conteneur réel du bloc ; ajustement sans changer la taille des caractères. |
| Espacement entre colonnes | `column-gap`, uniquement pour mises en page multicolonnes. |
| Padding de question | Marges intérieures d'une question/encadré, indépendantes du gap entre questions. |
| Espacement énoncé/réponse | Distance entre texte/support et zone de réponse. |
| Lignes de réponse | Nombre de lignes, interligne/hauteur, longueur si utile, numérotées ou simples ; respect du format de question. |
| Grille de calcul | Hauteur/nombre de rangées, taille des carreaux si déjà supportée ou ajoutée de façon fiable, trait de réponse séparé ; ne pas autoriser une grille impossible à écrire. |
| Image et support | Largeur, hauteur maximale, position, distance texte/image, légende, alignement ; proportions conservées sauf recadrage explicite. |
| Tableaux/cartes | Padding de cellule, hauteur de ligne, bordures et proportions seulement si la géométrie le permet ; respecter recto/verso. |
| Typographie locale | Taille et interligne dans les rendus qui peuvent les appliquer sans casser la lisibilité ; ne pas confondre échelle UI et feuille. |

Les plages numériques exactes sont à mesurer selon les formats existants ; éviter des maxima arbitraires qui produisent un contenu impossible. Proposer valeurs par défaut et réinitialisation. Toute modification de taille ou d'espacement déclenche la vérification de pagination ; aucune compression silencieuse de la fiche. Les unités sont explicites et cohérentes (CSS px à 96 dpi pour distances écran/logiques, mm pour dimensions imprimées). Les espacements ne sont pas dessinés comme des bandes visibles sur la fiche.

### 6.4 Images et supports

Réutiliser le sélecteur de galerie existant (`VocabImagePicker`, `WorksheetImageProvider`) et le système de chargement de fichiers, en les étendant aux profils concernés. Permettre ajouter, remplacer, enlever, réinitialiser, redimensionner, recadrer sans distorsion, choisir la disposition (au-dessus, à côté ou en dessous si compatible), ajouter légende/texte alternatif et définir élève/corrigé. L'édition doit viser une occurrence identifiée par document/activité/question/rôle média, non uniquement le chemin de fichier. Une action « remplacer partout » peut être proposée séparément si elle est réellement utile. L'image reste associée à la question après changement d'ordre, pagination, sauvegarde et réouverture.

Pour un QCM visuel ou une association images-termes, chaque choix/pair a son propre ID, son média et sa correction ; ne pas afficher une légende révélant la réponse. Pour des schémas géométriques, graphes et repères, privilégier la modification des données structurées et le rendu vectoriel plutôt que le remplacement libre d'une image qui casserait la solution. Les QR audio sont générés à partir de leur vraie source, pas traités comme une photographie. Les images locales doivent être sauvegardables via un mécanisme compatible avec les recettes, droits et limites API existants ; si non disponible dans une étape intermédiaire, signaler explicitement avant sauvegarde, ne pas promettre une conservation inexistante. Valider type, taille, dimensions et contenu des fichiers ; pas de scripts SVG non fiables, pas d'URL externe arbitraire. Respecter les règles de la bibliothèque originale logistique du CDC V2.11.

## 7. Matrice d'audit des domaines et modèles d'édition

Les profils ci-dessous sont des modèles fonctionnels cibles. « Existant » signifie code d'éditeur ou branche constatés, pas couverture testée. Les types générés dynamiquement doivent être développés en lignes concrètes dans le rapport L0. Un modèle partagé est autorisé seulement si chaque type conserve les champs qui lui sont propres.

| Domaine | Sources / types | Modèle existant ou écart principal | Profil cible |
|---|---|---|---|
| ACM | `acm-placeholder` | Catalogue à venir | Indisponible, aucun paramètre factice |
| Algèbre | Tous les thèmes §8.1 | TpmLibreEditor et calculs spécialisés selon contexte | Profils opérations, tableaux, nombres, suites, fractions, expressions, problèmes, équations, glossaire |
| Alphabétisation | `alpha-{bankId}-{kind}`, §8.3 | Réutilisations Soutien et fallback possible | Éditeurs lettres, syllabes, images, audio, grilles, mots, phrases |
| Calligraphie | `calli-mots`, `calli-phrases`, alias §8.7 | Champs modèles + paramètres séparés | Modèles, ordre, écriture, bandes, police et taille |
| Gattegno | Six variantes par thème + trois tableaux | PhraseLibreEditor partiel | SVC, tokens, pastilles, ordre, construction, images, rédaction, tableaux |
| Géométrie | §8.2 | TpmLibreEditor, CoordLibreSettings et CoordQuestionsLibreEditor | Figures paramétriques, coordonnées, transformations, conversions, glossaire |
| Grammaire | Théorie, banques anciennes et structurées, CO, §8.5 | TcfExerciseEditor pour certaines pratiques ; snapshots dédiés | Théorie, toutes présentations structurées, supports, audio, modèles texte |
| Grilles de cartes | Six templates §8.7 | GameContentPanel | Cartes éditables, groupes, recto/verso, contenus et mise en page |
| Logistique CFC | 80 sous-modules × 5 types annoncés par le CDC | Générateur commun et pilotes 101/105 sur la référence de publication | Profils communs, composition multi-modules et formats par capacité du catalogue |
| Logistique AFP | 63 sous-modules × 5 types annoncés par le CDC | Générateur commun et pilotes 101/105 sur la référence de publication | Capacités communes, banques et validation AFP distinctes |
| Logique | Huit kinds §8.8 | Contenus graphiques ; fallback texte insuffisant à vérifier | Sélecteur de modèles + édition graphique et solution structurée |
| Sciences et santé | `sante-placeholder` | Catalogue à venir | Indisponible, pas d'options fictives |
| Société | 12 théories + 14 activités Suisse §8.8 | Théorie et lignes simples ; édition structurée à compléter | Texte structuré, paires, questions et réponses, tableaux/illustrations |
| Soutien FR | 17 kinds par son §8.4 | Deux éditeurs dédiés mots/compléter, autres à contrôler | Chaque kind a un profil complet, réutilisable avec Alphabétisation si équivalent |
| Vocabulaire | `vocabulaire-placeholder` | Catalogue régulier à venir ; des types lexicaux existent dans le code partagé | Pas de faux exercice ; auditer les anciens types/recettes réellement accessibles |
| TCF CSC | Slots et variantes §8.6 | TcfExerciseEditor | CE, CO, PE, PO, consignes ; règles CSC conservées |
| TCF CFR | Idem | TcfExerciseEditor | Même famille, contraintes CFR spécifiques |
| TCM CSC | §8.9 | TpmLibreEditor et payload `cscTask` | Profils test CSC et éditeurs visuels/audio spécialisés |
| TCM CFR | §8.9 | TpmLibreEditor | Profils test CFR et barèmes existants |
| TPF | §8.6 | TcfExerciseEditor | Toutes compétences, variantes et niveaux éligibles |
| TPM | §8.1–2 et §8.9 | TpmLibreEditor et recalcul | Tests maths, consignes et catalogues mathématiques réutilisés |

Les alias historiques `français`, identifiants de recettes anciens, thèmes historiques et types retirés sont à classer séparément. Ils ne doivent pas réapparaître dans le menu uniquement pour satisfaire un compteur ; les recettes valides doivent rester lisibles et éditables si leur structure est supportée.

## 8. Inventaire détaillé des familles et des paramètres par type

### 8.1 Algèbre — entrées statiques du catalogue

Notation : préfixe + suffixes listés = IDs exacts (par ex. `nombres-chiffres`). Les contrôles communs §6 s'ajoutent uniquement s'ils sont applicables.

| Préfixe et suffixes | Édition spécifique attendue |
|---|---|
| `nombres-` : chiffres, lettres | Nombre, écriture en lettres/chiffres, correction dérivée, plage de génération si effective |
| `nombres-` : compter-formes | Types, quantités, cibles/leurres, positions, taille et comptage calculé |
| `nombres-` : position, decompose | Chiffres, rangs, décomposition, cases à compléter, résultat |
| `nombres-` : comparer, encadrer-10, encadrer-100, pair, ranger | Valeurs, relation, ordre, bornes, parité, correction automatique |
| `nombres-suite` | Termes, pas, valeurs masquées, longueur, ordre, cases |
| `addition-` et `soustraction-` : ligne, trou, colonne, colonne-poser, comparer, tableau, tableau-entetes, decompose, tableau-melange | Opérandes, signe, inconnu, résultat/retenues/emprunts, grille, en-têtes et cellules ; variantes distinctes, champs de calcul inutiles masqués |
| `estimation-` : dizaine, centaine, somme, difference | Valeurs, précision, règle d'arrondi, résultat attendu |
| `multiplication-` : ligne, trou, colonne, colonne-poser, 2chiffres, 2chiffres-poser | Facteurs, position inconnue, produits partiels, grille et résultat |
| `division-` : ligne, trou, colonne, colonne-poser | Dividende, diviseur non nul, quotient/reste, étapes, grille, règles de validité |
| `problemes-` : addition, soustraction, add-sub, multiplication, division, melange | Texte, gabarit, données, unités, question, calculs/étapes, trait de réponse, illustration |
| `multiples-` : reconnaitre, diviseurs, pgcd, ppcm | Nombres, choix/ensembles, diviseurs, résultats validés |
| `fractions-` : identifier, equivalentes, simplifier, comparer, add, mul, div | Numérateur/dénominateur, signe, figure/parties si applicable, relation, simplification et correction |
| `decimaux-` : comparer, add-colonne, add-colonne-poser, sub-colonne, sub-colonne-poser, mul-colonne, mul-colonne-poser, div-colonne, div-colonne-poser, mul-ligne, div-ligne | Opérandes décimaux, précision, alignement, virgule, grille, résultat, reste et étapes si pertinents |
| `proportion-` : notion, de, var, problemes | Valeurs, taux, base, montant, unité, énoncé et hypothèses ; calcul direct/inverse |
| `relatifs-` : comparer, add, mul | Signes, opérandes, relation, résultat |
| `puissances-` : calcul, 10, racine, priorite | Base/exposant, radicande, expression, parenthèses et résultat valide |
| `expressions-` : substituer, evaluer-2var, evaluer-3var, evaluer-avances, produits, reduire, developper, factoriser | Expression structurée, variables, valeurs partagées, coefficients, puissances/fractions, correction algébrique et réponses équivalentes |
| `equations-` : simple, deux-cotes, fractions, systeme, systeme-add | Membres, inconnues, coefficients, contraintes, solutions, étapes et grille |
| `glossaire-algebre-mots` | Termes, définitions, exemples, ordre, mode référence/exercice selon capacités |

### 8.2 Géométrie

| Identifiants/familles | Édition spécifique |
|---|---|
| `figures-nommer`, `figures-proprietes` | Type de figure, orientation/dimensions compatibles, étiquettes, propriétés et réponse |
| `conversions-` : longueur, aire, volume, capacite, masse, temps | Valeur, unité source/cible, facteurs de conversion, correction |
| `perimetres-` : carre, rectangle, triangle, parallelogramme, losange, trapeze, quadrilatere, cercle ; mêmes huit suffixes suivis de `-manquant` ; melange, composees | Figures, côtés/diamètre/rayon, unités, cote inconnue, combinaisons, valeur de π, formule et résultat ; grille et trait si applicable |
| `aires-` : carre, rectangle, triangle, parallelogramme, losange, trapeze, quadrilatere, disque ; mêmes huit suffixes suivis de `-manquant` ; melange | Base, hauteur, diagonales/rayon et inconnues selon figure ; unités d'aire, cohérence géométrique, résultat |
| `volumes-` : cube, pave, quadrilatere, cylindre, cone, sphere ; cube-manquant, pave-manquant, quadrilatere-manquant, cylindre-manquant, cone-manquant ; melange | Dimensions 3D, unités, inconnues, rendu/cotes et correction |
| `reperage-` : lire, placer, cadrans-lire, cadrans-placer, cadrans-libre, droites, construire | Origine, axes, graduation, taille des carreaux, points/formes, positions, étiquettes, questions et solutions ; conserver interaction de coordonnées |
| `transformations-` : axiale-figure, centrale-figure, axiale-placer, centrale-placer | Figure, axe ou centre, coordonnées, transformation, image et solution calculées |
| `glossaire-geometrie-mots` | Termes, définitions, figures et exemples |

Ne pas offrir un redimensionnement d'illustration qui modifie les longueurs physiques d'un exercice de mesure sans recalcul. Les figures construites sont modifiées à partir de données vérifiables ; préserver les proportions mathématiques et les contraintes des axes.

### 8.3 Alphabétisation — 15 kinds lettre/son et 11 kinds spéciaux

Source : [letter-kinds.ts](https://github.com/oasi-phuoc/doc-prof/blob/main/src/alphabetisation/letter-kinds.ts), [kinds.ts](https://github.com/oasi-phuoc/doc-prof/blob/main/src/alphabetisation/kinds.ts), [catalog.ts](https://github.com/oasi-phuoc/doc-prof/blob/main/src/alphabetisation/catalog.ts). Les kinds spéciaux ne sont pas tous disponibles dans chaque thème : reprendre le filtre du catalogue. Les thèmes, lettres, sons, banques et histoires sont générés ; ne pas confondre 26 kinds avec le nombre d'entrées réelles.

| Kind | Profil spécifique |
|---|---|
| `mots` | Mot, image, audio, ordre, nombre de colonnes |
| `lettres-maj`, `lettres-min` | Lettre cible, cases, leurres, casse, dimensions de grille, positions correctes |
| `souligner-maj`, `souligner-min` | Mots, lettre/positions à souligner, casse, encadrés |
| `ecouter`, `ecouter-image` | Audio, mots/images, présence du son, réponses, QR, disposition |
| `syllabe-son-qr`, `syllabe-son` | Mot, syllabes, position du son, audio ou image selon variante, correction |
| `syllabes-cv`, `syllabes-long` | Syllabes exactes, ordre, grille, quantité et colonnes |
| `syllabes-prononcer` | Mots, découpage syllabique, support audio/images si prévu |
| `associer-syllabe`, `associer-audio`, `associer-image` | Séries, audio/QR, options, associations par ID et ordre de correction |
| `lire-grille`, `lire-cursive` | Cellules, texte, casse/script/cursive selon format, ordre et tailles |
| `entourer` | Cible, éléments, leurres, emplacements exacts |
| `former` | Parties, paires, solutions, zones d'écriture |
| `classer` | Catégories, mots, correspondances, colonnes |
| `dictee-mots` | Mots/syllabes, audio si prévu, traits et correction |
| `lire-phrases`, `ordre-phrases` | Phrases, texte suivi ou tokens ordonnés, solution, zones de réponse selon kind |
| `alphabet-ordre`, `alphabet-suivant`, `alphabet-initiale` | Lettres, position, ordre, casse et réponses acceptées |

### 8.4 Soutien FR — 17 kinds par banque phonétique

Source : [soutien/kinds.ts](https://github.com/oasi-phuoc/doc-prof/blob/main/src/francais/soutien/kinds.ts). Conserver le rattachement son/graphème et les filtres de niveau réellement utilisés.

| Kind | Profil spécifique |
|---|---|
| `mots` | Liste mots/images, audio, banque, sélection individuelle ; reprendre SoutienMotsLibreEditor |
| `lettres` | Cible, grille, casse, leurres, réponse |
| `syllabes` | Cellules et syllabes, ordre, dimensions |
| `relier` | Parties gauche/droite, paires, mélange et solution |
| `completer` | Article, texte avant/après, blanc, mot, image et solution ; reprendre SoutienCompleterLibreEditor |
| `ecouter`, `ecouter-image` | Audio, mots/images, réponse phonétique, QR |
| `syllabe-son` | Mot, syllabes, son et index correct |
| `lettres-phrase` | Phrase, mot/lettre cible et positions |
| `determinants` | Nom, genre/nombre, déterminants proposés, réponses |
| `dictee` | Liste, audio, réponse attendue, zones d'écriture |
| `compter` | Mot, occurrence(s), comptage attendu |
| `ordre` | Tokens, ordre mélangé et phrase correcte |
| `lire` | Texte/phrases, ordre, présentation de lecture |
| `associer-audio`, `associer-image` | Séries, options, correspondances, audio/QR, images |
| `mots-meles` | Liste de mots, grille, directions autorisées, positions, génération cohérente de la solution |

### 8.5 Grammaire — théorie, anciens kinds et banques graduées

Sources : [catalog.ts](https://github.com/oasi-phuoc/doc-prof/blob/main/src/grammaire/catalog.ts), [exercises/kinds.ts](https://github.com/oasi-phuoc/doc-prof/blob/main/src/grammaire/exercises/kinds.ts), [catalog-exercises.ts](https://github.com/oasi-phuoc/doc-prof/blob/main/src/grammaire/exercises/catalog-exercises.ts), [curriculum/types.ts](https://github.com/oasi-phuoc/doc-prof/blob/main/src/grammaire/curriculum/types.ts). Les 19 thèmes principaux sont déclarés, avec sous-thèmes, théorie, pratiques et banques graduées ; l'inventaire réel doit suivre les filtres de `typeChoicesForBlock` et les niveaux éligibles, y compris les nouveaux types de banques et CO thématiques. Ne pas réactiver les types retirés.

| Kinds / présentations | Édition spécifique |
|---|---|
| Théorie (`*-theorie` et types de documents réellement présents) | Blocs de cours, tableaux, exemples, titres, images, notes, sauts |
| `communication-ce`, `question-reading-ce`, `question-reading-write`, `ce-texte`, `fam-recit`, `fam-faire-part`, `fam-email`, `fam-photo` | Document, situation, images, questions, réponses, choix, lignes, preuves et critères ; conserver les groupes |
| `communication-pe`, `communication-po`, `ecrire`, `repondre-phrase`, `ecrire-question`, `portrait`, `po-images`, `fam-pe` | Situation, consigne, modèle, contraintes, images, lignes si écrit, critères si oral |
| `question-est-ce-que`, `question-inversion`, `response-affirmative`, `response-negative`, `question-open-est-ce-que`, `question-open-inversion`, `question-open-response`, `question-quel`, `question-quel-response` | Phrase source, transformation, sujet/temps/forme, réponse, variantes acceptables |
| `corriger-erreur`, `corriger` | Texte erroné, segment à corriger, correction, justification |
| `qcm-conj`, `qcm-verbe` | Verbe, sujet, temps, options/leurres, réponse par ID, ordre |
| `fill-conj`, `pluriel`, `singulier`, `negatif`, `affirmatif`, `transformer`, `infos-perso`, `verbe-pastilles` | Segments, blancs, consigne, transformations, réponse(s), mode QCM/texte si compatible |
| `associer`, `ordre` | Paires ou tokens, catégories, ordre correct, mélange |
| `formulaire` | Champs, libellés, données à fournir, critères, support |
| `co-audio`, `co-theme`, `nat-co`, `fam-co` | Banque audio, enregistrement, transcription/corrigé réservé, questions, choix, liens audio |
| `nat-image`, `nat-feminin`, `nat-masculin`, `nat-pluriel`, `nat-accorder` | Image/pays, genre/nombre, forme attendue, options ou blanc |
| `prov-pays`, `prov-prep`, `prov-verbe`, `prov-phrases` | Pays, verbe, préposition, énoncé, forme et réponse |
| `fam-det`, `fam-pronoms-1`, `fam-pronoms-2` | Relation familiale, déterminants/pronoms, phrases, blanc et réponse |
| Présentations graduées `choice`, `gap`, `correct`, `order`, `match`, `transform` | Éditer les structures canoniques de GrammarUnit/GrammarQuestion, pas seulement le prompt du MathItem ; réponses, tokens, paires, directive et IDs stables |
| Présentations graduées `document-set`, `scenario-set`, `open-written`, `open-oral` | Document ou scénario parent, supports, sous-questions, rubriques, critères, champs, zones d'écriture, regroupement et pagination |

Les profils doivent tenir compte des unités `personal-gap`, `form`, `reading`, `production` et autres unions réellement présentes. Vérifier `grammarSnapshot`, `grammarPageBreakAfterQuestionIds`, `grammarBankRevision`, niveau, présentation, activité et groupes dans les recettes. Le champ corrigé ne doit pas rester un texte générique si le renderer utilise une structure différente. Conserver la sélection par banque et les fonctions de tirage.

### 8.6 TPF, TCF CSC et TCF CFR — compétences et supports

Source : [tcf/catalog.ts](https://github.com/oasi-phuoc/doc-prof/blob/main/src/tcf/catalog.ts), [TcfExerciseEditor.tsx](https://github.com/oasi-phuoc/doc-prof/blob/main/src/tcf/TcfExerciseEditor.tsx). Le catalogue distingue les slots numérotés et les types de supports. Les slots CE 1–4, CO 1–5, PE 1–4, ainsi que les entrées PE/PO et aliases, doivent être résolus par niveau/domaine selon les règles existantes ; ne pas rendre visibles les entrées historiques ou masquées par `tcfSlotShownInMenu`.

| Famille / IDs de supports inspectés | Édition spécifique |
|---|---|
| `tcf-consignes` | Page non notée, texte, titre, informations de test ; pas de QCM fictif |
| CE : `tcf-ce-sms`, `tcf-ce-email`, `tcf-ce-annonce` et slots `tcf-ce-ex-*` | Support structuré, expéditeur/destinataire si pertinent, texte, image, questions QCM/lignes, réponses, nombre de questions, points et sauts |
| CO : `tcf-co-images`, `tcf-co-six-courts`, `tcf-co-trois-moyens`, `tcf-co-complet`, `tcf-co-association` et slots `tcf-co-ex-*` | Audio(s), image(s), association, transcription, durée/ordre, options, bonnes réponses, barème ; sélectionner seulement les formats réellement compatibles |
| PE : `tcf-pe-formulaire`, `tcf-pe-texte-images`, `tcf-pe-image`, `tcf-pe-sms`, `tcf-pe-email`, `tcf-pe-question`, `tcf-pe-dialogue` et slots `tcf-pe-ex-*` | Formulaire, texte à trous, images, messages, situation, répliques, lignes, limites de mots, correction et critères |
| PO : `tcf-po-mots-theme`, `tcf-po-entretien`, `tcf-po-trois-themes`, `tcf-po-image-interaction`, `tcf-po-sequence`, `tcf-po-image`, `tcf-po-dialogue` | Thèmes, entretien, séquences, images et ordre, tâches et critères d'évaluation, supports ; pas de lignes manuscrites inutiles |

Conserver les présentations CE texte/image, les modes de réponse (QCM texte/image, lignes), les points détaillés, les audio slots, les dialogues, les nombres de mots et règles propres à chaque niveau. Tester chaque variante `support.kind` réellement disponible, non seulement le slot. Les éditeurs de supports existants ne doivent pas être réduits à un simple textarea.

### 8.7 Gattegno, Calligraphie, Grilles de cartes

| Type | Édition spécifique |
|---|---|
| Gattegno : `${topic}-svc` | Phrase, tokens, sujet/verbe/complément et correction ; éditeur à compléter |
| `${topic}-colorier` | Tokens, catégorie/couleur, ordre, réponse |
| `${topic}-ordre` | Tokens à remettre en ordre, phrase correcte, catégories |
| `${topic}-construire` | Verbe, pastilles, catégories, exemple et réponse |
| `${topic}-images` | Images par catégorie, ordre, texte et réponse |
| `${topic}-ecrire` | Consigne, réponse modèle, lignes |
| `phrase-tableau-categories`, `phrase-tableau-mots`, `phrase-tableau-vide` | Colonnes/catégories, libellés, cellules, couleurs et contenu ; pas de QCM artificiel |
| `calli-mots`, `calli-phrases` (+ alias `calli-6-lignes`, `calli-4-lignes`) | Texte modèle, ordre, ajout/suppression, police cursive, taille, bandes et réglages d'écriture compatibles |
| `jeux-vocabulaire` | Cartes terme/image, recto/verso, ordre, tailles et bordures |
| `jeux-devinettes` | Indices, réponse, image, disposition |
| `jeux-memory` | Paires, images/mots, ordre et verso |
| `jeux-loto` | Grilles, cellules, images/mots et correspondances |
| `jeux-intrus` | Groupes, intrus, catégorie, correction |
| `jeux-dominos` | Couples, enchaînement valide, contenus et disposition recto/verso |

Les thèmes Gattegno actifs sont construits par `PHRASE_THEME_DEFS` ; les thèmes négatifs historiques sont normalisés en polarité selon le code. Ne pas multiplier artificiellement les entrées. Jeux et Calligraphie partagent leurs types entre thèmes ; leurs modèles conservent les différences de contenu. Le format des cartes imprimées et leur alignement recto-verso doivent rester identiques avant/après ouverture Libre si aucun réglage n'a changé.

### 8.8 Logique, Société, domaines en attente

| IDs | Profil spécifique |
|---|---|
| `logique-suite-graphique`, `logique-rotation` | Suite, formes, orientation, règle, propositions et bonne réponse |
| `logique-intrus`, `logique-case-intrus` | Ensemble de formes/cases, intrus, critères et solution |
| `logique-matrice`, `logique-case-manquante` | Cellules, formes, position manquante, choix, solution |
| `logique-assemblage`, `logique-cube` | Sélection/édition du modèle graphique selon capacités réelles, pièces/orientations, choix et solution validée ; si géométrie non éditable, ne pas exposer un contrôle fictif, compléter l'éditeur structuré avant livraison |
| `societe-suisse-theorie-` + situation, reperes, regions, cantons-1, cantons-2, eaux, dates, etat, democratie, federalisme, pouvoirs, droits | 12 fiches, éditeur de blocs théoriques et tableaux |
| `societe-suisse-ex-` + cantons, chefs-lieux, sigles, serie-2, villes, lacs, cours-eau, regions, dates, resume, pouvoirs, competences, devoirs, democratie | 14 activités, paires question/réponse, textes à trous, données et critères, ordre, images si compatibles |
| `acm-placeholder`, `sante-placeholder`, `vocabulaire-placeholder` | Contenu à venir ; état vide explicite, pas d'éditeur trompeur. |

### 8.9 Tests mathématiques — TPM, TCM CSC et TCM CFR

TPM réutilise également les thèmes Algèbre/Géométrie via `tpmTopics`. Les 34 entrées statiques spécifiques `tpm-info` constatées sont ci-dessous, en plus des thèmes partagés. L'éditeur de consignes est distinct ; les formats de test et barèmes doivent être respectés.

| IDs TPM (préfixe `tpm-`) | Profil cible |
|---|---|
| consignes | Page d'information non notée |
| comparer, ranger, decompose-99, decompose-9999 | Comparaison, tri, décomposition, nombres |
| suite, grandes-suites, suites-6 | Suites et trous |
| operations, quatre-ops, add-sub-col-3, add-sub-col-4, mul-div-col, dec-add-sub, mul-mixte, div-mixte, ops-decimales, relatifs-ops | Opérations, grilles, signes, valeurs et recalcul |
| rect-peri-aire, para-peri-aire, tri-peri-aire, rhombus-peri-aire, trap-peri-aire, circle-peri-aire | Figure et deux résultats, unités, deux zones de calcul si prévues |
| frac-color, frac-read, fractions-mixte | Fraction et figure, données et résultat |
| puissances-mixte, priorite-ops, expressions-reduire, expressions-evaluer, equations | Expressions, variables, solutions et grilles |
| conversions-mixte, proportion-kg | Unités, taux, proportion et correction |

TCM CSC (source [catalogue](https://github.com/oasi-phuoc/doc-prof/blob/main/src/tcm-csc/catalog.ts)) : les numéros d'ID et d'affichage ne sont pas toujours identiques ; préserver la table de correspondance. `tcm-csc-consignes` + 24 activités identifiées ci-dessous.

| Suffixe `tcm-csc-ex` | Profil cible |
|---|---|
| 01, 02, 03 | Audio de nombres/calculs, valeurs, choix à entourer, réponses, QR et barèmes |
| 04, 05 | Suites avec ou sans indication |
| 06, 25, 07, 08, 09 | Tri croissant/décroissant, comparaison, décomposition, signes |
| 10, 11 | Opérations posées/à poser, grilles, nombres, correction |
| 12, 13 | Reproduction/agrandissement, formes, quadrillages, facteur |
| 14, 15 | Longueurs, points à relier, mesures et tracés exacts |
| 16, 17, 18 | Suites graphiques, formes, comptage, tailles et cibles |
| 19, 20 | Lecture/placement de coordonnées |
| 22, 23, 24 | Problèmes contextualisés, données, énoncé, grille, résultat |

TCM CFR (source [catalogue](https://github.com/oasi-phuoc/doc-prof/blob/main/src/tcm-cfr/catalog.ts)) : `tcm-cfr-consignes` et 28 IDs `tcm-cfr-ex01` à `tcm-cfr-ex28`.

| Suffixe `tcm-cfr-ex` | Profil cible |
|---|---|
| 01, 02 | Audio de nombres/multiplications, réponse et source |
| 03, 04, 05, 06 | Tri, décimaux, décomposition, nom des opérations |
| 07, 08, 09, 10 | Opérations posées/à poser, grilles et correction |
| 11, 12, 13, 21 | Fractions en lettres, colorier, lire, décimaux |
| 14, 15 | Problèmes à étapes, énoncé, données, calculs et réponse |
| 16, 17, 18 | Nom/propriétés de formes, symétrie |
| 19, 20 | Mesure de segments, conversion d'unités |
| 22, 23, 24, 25, 26 | Périmètre/aire et côté manquant, cotes et résultats |
| 27, 28 | Repérage cadran I et plan de métro, axes, points/gares, questions et solutions |

Ne pas modifier le barème standard du test ou l'ordre officiel par un simple changement visuel. Les modifications locales sont conservées dans une fiche personnalisée ; tester tout exercice dont le nombre de questions ou la notation est imposé. Les documents audio et leurs corrections doivent rester synchronisés avec les valeurs affichées ; si un changement nécessite un nouvel audio non disponible, signaler l'incompatibilité plutôt que produire une fiche trompeuse.

### 8.10 Logistique AFP/CFC

Les exigences du CDC Logistique V2.11 demeurent applicables. Les deux domaines sont des domaines ordinaires, sans écran spécial. Théorie (complète, résumé, aide-mémoire), glossaire et trois familles d'exercices utilisent les profils transversaux. Autoriser la sélection de plusieurs modules, composition par lot/manuelle, sélection par format, édition et ajout d'images. Pour chaque format (QCM, texte à trous avec/sans mots, tableau/date, associations, identification d'images, schémas, graphiques, analyse, problème, cas), fournir le modèle structuré correspondant. Les 30 formats ne constituent pas 30 types visibles dans chaque sous-module : ils sont des capacités selon le contenu réel. Le calcul garde obligatoirement grille et trait de réponse ; les contenus longs respectent les sauts et 25 px de réserve au pied. Logo EPCA et nom du diplôme uniquement sur la fiche selon le CDC, pas dans la barre de fenêtre. Ne pas approuver automatiquement les banques non validées pour rendre les tests verts.

## 9. Architecture technique cible

### 9.1 Registre de capacités et source unique des paramètres

Créer un registre de profils résolu à partir de `domain`, `exerciseType`, variante, contenu effectivement généré, mode, droits et contraintes du format. Le même registre alimente le paramétrage normal, le mode Libre, la validation et les tests. Il ne remplace pas les catalogues existants et ne duplique pas leurs titres ou règles métier. Les profils sont composés de capacités réutilisables ; les types sont associés explicitement, sans fallback générique permissif.

Exemple de contrat indicatif, à adapter aux types de l'application :

```ts
type ControlScope = 'document' | 'page' | 'block' | 'item' | 'support'
type ControlEffect = 'presentation' | 'content' | 'generation' | 'scoring' | 'persistence'
type ControlDefinition<C> = {
  id: string
  scope: ControlScope
  label: string
  help?: string
  effect: ControlEffect
  advanced?: boolean
  isApplicable: (context: C) => boolean
  // Valeurs, validation et écriture utilisent les contrats existants.
  // Décrire aussi le consommateur et l'assertion de test.
}
type EditorProfile = {
  id: string
  // La résolution doit être unique pour une activité donnée.
  capabilities: readonly string[]
  controls: readonly string[]
  // L'adaptateur sait lire, modifier, valider et restituer le payload réel.
}
```

Ne pas mettre des composants React, fonctions ou sélecteurs dans les recettes sérialisées. Les profils servent à configurer l'interface ; l'état persistant conserve uniquement les données métier et réglages. Une capacité non implémentée n'est pas rendue visible. Une activité active sans profil compatible est un échec de couverture, pas un succès grâce à un éditeur vide. Les placeholders et anciens types retirés ont un statut explicite.

Proposer des dossiers `src/components/generator/libre/` et éventuellement `src/components/generator/activity-controls/`, selon les conventions du dépôt :

```text
src/components/generator/
  LibreSidePanel.tsx          # shell gauche, composition, actions
  SettingsPanel.tsx           # shell normal existant
  libre/
    registry.ts              # résolution des profils/capacités
    controls.ts              # déclarations des contrôles et pertinence
    state.ts                 # brouillon, validation, annulation
    adapters/                # adapters par famille de payload
    editors/                 # modèles spécialisés réutilisables
    tests/                   # couverture, validation, fixtures
```

Cette arborescence est une proposition, pas une obligation de créer des wrappers inutiles. Réutiliser les fichiers et composants actuels, les déplacer seulement si cela améliore réellement leur maintenance. Éviter un nouveau monolithe de 3 000 lignes ou un second modèle de données complet. Les fonctions de recalcul, parsers, pickers et moteurs de génération restent les références métier.

### 9.2 Points d'intégration

| Fichier ou zone | Intervention |
|---|---|
| `GeneratorPage.tsx` | Un seul panneau gauche et un seul résultat. Résoudre le mode sans branche parallèle logistique. Préserver l'activité active, feuilles et réglages. |
| `SettingsPanel.tsx`, `DomainThemeTypeFields.tsx`, `QuestionsColumnsFields.tsx` | Extraire des groupes de contrôles partagés, appliquer les capacités et info-bulles ; ne pas copier les mêmes callbacks dans Libre. |
| `LibreSidePanel.tsx`, `GenericLibreEditor.tsx`, `TpmLibreEditor.tsx`, éditeurs spécialisés | Résoudre un profil unique, compléter les champs manquants, éliminer le fallback inadapté. |
| `generator-block-context.ts`, `generator-derived.ts`, `page-helpers.ts` | Centraliser les dérivations nécessaires, capacité/quantité/points ; gérer les variantes et migrations. |
| `usePageConfig.ts`, `usePageNavigation.ts`, `useGenerateActions.ts` | Appliquer les changements atomiquement, maintenir les IDs et le brouillon, éviter les régénérations involontaires ; préserver les mécanismes de recalcul. |
| `PageStructureTabs.tsx`, `TopbarTools.tsx`, `FooterSidePanel.tsx`, `ResultPanel.tsx` | Réutiliser les actions et sélectionner les bons contrôles sans créer de troisième colonne ni doublon ; supprimer l'aide statique sous les réglages. |
| `WorksheetSheet.tsx`, `ItemView.tsx` et renderers | Rendre les valeurs modifiées, appliquer les espacements aux bons conteneurs, gérer les médias et les formats dans les deux modes élève/corrigé. |
| `A4Frame.tsx`, `App.css`, `worksheet-typography.css`, `sheet-format.ts` | Conserver la taille de l'aperçu et la dimension physique ; CSS ciblée, responsive et impression, sans effets globaux inutiles. |
| `useQuestionsOverflow.ts` et mécanismes existants de pagination | Mesurer les pages/activités réellement rendues, attendre médias/polices ; détecter ou traiter les débordements, garder les sauts explicites. |
| `WorksheetImage.tsx`, `VocabImagePicker.tsx`, `jeux/image` | Identité d'occurrence, upload sécurisé, conservation des médias, association à la question ; garder les usages existants. |
| `src/math/types.ts`, `src/fiches/recipe.ts`, API et stockage des fiches | Types additifs et migration versionnée, restauration exacte, validation côté serveur, limites et accès. |
| `src/logistique/*` | Raccord au générateur commun et profils selon le cahier des charges logistique ; pas de nouvelle UI spécifique. |

### 9.3 État, identifiants et recettes

La révision de travail appliquée et les valeurs transitoires forment deux états distincts. Le brouillon persistant est une copie de récupération, la sauvegarde définitive est un instantané explicite. À l’ouverture, utiliser le contenu affiché, y compris les variantes et copies de banque, avec sa graine et ses révisions. Les actions mettent à jour le payload métier du bloc, puis dérivent le rendu et le corrigé. Les données hors de la portée de l’action restent identiques.

- Introduire des IDs stables pour les occurrences de blocs, unités et médias, en gardant l'ID de source et la révision de banque. Les anciens index sont migrés de manière déterministe ; les points, sauts et images restent attachés à la bonne occurrence après insertion/suppression/déplacement.
- Persister les valeurs de présentation applicables, le contenu local, les réponses et médias, ainsi que la distinction entre version standard et personnalisée. Pour les champs existants (`libreItems`, `phraseItems`, `coordQuestionsLibre`, `grammarSnapshot`, `tcfExercise`, etc.), définir une stratégie de lecture et de migration ; ne pas créer de doublon de payload qui peut diverger.
Préserver les recettes, formats, corrections et images historiques. Une question personnalisée conserve son contenu à la réouverture lorsque la banque évolue. Valider les schémas et les droits côté API. Le contrat de lecture et d’écriture de §9.7 s’applique avant toute migration de recette ou de stockage.
Pour un média local durable, auditer la taille effective des recettes, les limites et les droits d’accès avant de choisir un stockage. Traiter le brouillon et la fiche enregistrée selon les deux parcours de §9.7. Vérifier le rechargement, les échecs de stockage, la suppression et les références manquantes.
- Proposer une restauration individuelle vers l'original lorsque la source est disponible ; conserver une copie de référence suffisante pour l'annulation. Si une donnée n'est plus disponible, message clair, jamais substitution silencieuse.

### 9.4 Rendu, pagination et précision

Le rendu reste `ResultPanel` → `WorksheetSheet` / `ItemView` / composants spécialisés, selon les chemins déjà en place. Ne pas rendre un second aperçu propre à Libre. Les fonctions de génération/calcul ne s'exécutent pas pour chaque changement purement visuel. Adapter les CSS variables à la portée du bloc ou de l'item ; éviter les styles globaux qui font varier toutes les feuilles. Préserver les dimensions imprimées exactes (notamment exercices de mesure et cartes recto-verso). Un nouveau paramètre de taille n'est accepté qu'après preuve de sa consommation par aperçu et impression.

La pagination doit réagir aux valeurs valides appliquées en direct et tenir compte des polices, images, tableaux et blocs multiples. Conserver les sauts de page existants et les groupes insécables ; si la capacité du paginateur est insuffisante, la compléter selon les exigences déjà prévues pour les contenus longs plutôt que rogner la feuille. Pour Logistique, réserve minimale de 25 px logiques au-dessus du pied de page conformément au CDC V2.11. Pour les autres domaines, conserver les réserves existantes et éviter tout chevauchement ; généraliser une réserve commune uniquement après validation de la non-régression des gabarits. Les deux demi-feuilles A5 sont testées séparément. Si une question ne peut être fractionnée et dépasse seule la page, proposer une réduction de taille autorisée ou une autre disposition, jamais un contenu coupé en silence.

### 9.5 Contrat des opérations et des sorties

L’état de travail appliqué est la source commune de l’aperçu, de l’impression, du corrigé et de la sauvegarde. Une action valide produit une révision et met à jour ensemble le contenu, les réponses, le barème et les valeurs qui en dépendent. L’état des champs transitoires, les préférences d’interface et la dernière version enregistrée sont conservés à leur portée propre. Une seule transaction d’historique correspond à une action logique, y compris une modification en série.

| Opération | Effet sur la révision appliquée | Conditions de réception |
|---|---|---|
| Ouvrir/fermer Libre, changer de feuille ou de sélection | Aucun nouveau tirage. Le panneau lit la révision de travail et les saisies locales de l’activité. | Contenu, ordre, correction, graine, verrous et médias suivent leurs unités et leur feuille. |
| Modifier un réglage de présentation | Mettre à jour le rendu et, si nécessaire, la pagination à partir du même contenu. | Graine, contenu, corrigé, ordre et identité stables. |
| Modifier une donnée, un énoncé, un support ou une réponse | Appliquer une valeur valide et recalculer les dépendances quand le profil le permet. Lorsqu’une correction ouverte doit être revue, signaler le groupe concerné. | L’aperçu élève reflète le texte appliqué. Le corrigé affiche son état réel. Une erreur de champ conserve la dernière valeur appliquée et la saisie visible. |
| Augmenter la quantité | Conserver les unités existantes et générer seulement les unités supplémentaires recherchées dans la capacité réelle du profil. | Dédupliquer selon la règle du profil, conserver les verrous et expliquer un manque de choix. |
| Réduire la quantité | Conserver l’ordre relatif des unités restantes. Prévisualiser ou demander une décision si la réduction touche du contenu personnalisé ou verrouillé. | Aucun retrait silencieux d’un verrou. La quantité affichée correspond aux unités effectivement présentes. |
| Modifier banque, difficulté ou type | Appliquer les options qui peuvent migrer sans perte. Pour une incompatibilité, proposer de garder le contenu actuel, de remplacer le périmètre concerné ou d’annuler le changement. | Le périmètre supprimé, les verrous affectés et les réglages imposés sont connus avant l’application. |
| Régénérer depuis n’importe quel point d’entrée | Appliquer la même règle aux actions de l’unité, de la sélection, du bloc et aux raccourcis existants. Les unités verrouillées et les groupes dépendants protégés sont exclus du tirage. | Un retour asynchrone portant sur une révision obsolète est ignoré. Annuler restaure exactement le tirage précédent. |
| Imprimer, exporter ou enregistrer | Capturer une révision appliquée cohérente au début de l’action. Traiter l’invalidité par sortie selon la matrice ci-dessous. | Le contenu émis correspond à la révision indiquée, même si l’utilisateur poursuit l’édition. |

Appliquer la politique suivante par sortie. Si la demande d’impression inclut le corrigé et que celui-ci reste à vérifier, expliquer le blocage et proposer explicitement « Imprimer la fiche élève seule » lorsque le sujet est complet et imprimable. L’utilisateur choisit cette sortie. Une erreur doit renvoyer au bloc ou au champ concerné. La sauvegarde définitive conserve l’état « Corrigé à vérifier » et les unités concernées pour la réouverture.

Lorsqu’un champ contient une saisie temporairement invalide, indiquer le champ et la dernière valeur valide proposée. L’impression ou l’enregistrement de la dernière révision valide requiert une confirmation explicite et reste soumis aux autres règles d’éligibilité de la sortie. En cas d’annulation, revenir au champ concerné. La saisie reste dans le brouillon après l’action. Si le corrigé est aussi à vérifier, préciser la révision et la sortie proposées dans la même confirmation.

| État | Sortie élève | Sortie corrigé | Sauvegarde définitive |
|---|---|---|---|
| Révision cohérente, champ transitoire invalide | Proposer l’impression avec la dernière valeur valide affichée. Imprimer après confirmation. | Appliquer la même confirmation si le corrigé de la dernière révision appliquée est valide. | Proposer l’enregistrement de la dernière révision valide. Après confirmation, enregistrer cette révision et conserver la saisie dans le brouillon de récupération. |
| Correction ouverte à confirmer ou réponse manquante | Autoriser si le sujet élève est complet et imprimable. | Retenir la version corrigée concernée jusqu’à vérification. | Autoriser l’enregistrement avec l’état « Corrigé à vérifier ». Conserver les données et le motif de cet état par unité. Appliquer le même blocage du corrigé après réouverture jusqu’à vérification. |
| Support obligatoire absent ou débordement bloquant | Retenir la sortie affectée et indiquer le contenu concerné. | Appliquer la même règle au rendu corrigé, qui peut avoir une pagination différente. | Autoriser la sauvegarde d’un contenu incomplet seulement si l’ouverture ultérieure conserve fidèlement le problème signalé et permet sa correction. |
| Média indispensable absent ou stocké uniquement en mémoire | Signaler le problème si le média est indisponible pour le rendu. | Même contrôle dans le rendu corrigé. | Retenir la sauvegarde si le média n’a pas de représentation durable et autorisée dans la fiche. Le brouillon restitue les données encore récupérables. |

### 9.6 Identité, concurrence et reprise

- Attribuer une identité d’occurrence stable dès l’entrée dans l’état de travail pour les blocs, unités, choix, sous-questions et rôles média qui en ont besoin. Distinguer l’ID de banque, sa révision et l’ID local. Deux occurrences issues de la même source restent distinctes.
- Les recettes historiques dérivent des IDs déterministes à la lecture du document et de sa structure existante. Persister ces IDs dès l’écriture suivante compatible. Une insertion, un changement de page, une duplication ou un mélange de choix préserve toutes les références qui concernent les unités restantes. Une copie reçoit un nouvel ID et démarre déverrouillée. La durabilité de ses références média suit ARB-06.
- Pour chaque opération asynchrone, comparer sa révision et sa cible au moment du retour. Un tirage devenu obsolète, un rendu antérieur ou un retour de lecture d’image tardif ne peut remplacer la révision courante. Les transformations d’un support et de ses sous-questions sont atomiques.
- Isoler les brouillons avec l’identifiant stable du compte autorisé et l’identité de la fiche. Une fiche sans sauvegarde possède son propre ID local durable. Après déconnexion, la reprise est disponible lors d’une reconnexion au même compte sur cet appareil. Tester l’ouverture de deux nouvelles fiches, la déconnexion, le changement de compte et les droits insuffisants. Pour tout parcours où l’identité de compte est indisponible, définir le mécanisme d’isolement avant d’activer la reprise dans ce contexte.
- Attribuer un identifiant de révision et un parent à chaque instantané durable. Deux onglets qui divergent sur une même fiche conservent leurs révisions récupérables. Présenter les révisions disponibles avec leur date et leur contexte, puis laisser le formateur choisir celle à reprendre. Le choix ouvre une révision et les autres restent disponibles jusqu’à décision explicite. À la restauration, valider la version, la portée et les références média avant d’afficher la confirmation. Un échec de stockage préserve le dernier instantané durable et l’état de travail en mémoire.

### 9.7 Recettes, API et médias durables

Inventorier les lecteurs et écrivains sur la branche cible, dont l’ouverture locale, l’API des fiches et les migrations. Rechercher les parseurs qui reconstruisent la recette et les champs qu’ils peuvent filtrer. Une extension additive reste en v1 uniquement si les lecteurs et écrivains concernés préservent intégralement les données et leur sens. Si une nouvelle version est nécessaire, vérifier d’abord la lecture des versions prises en charge des deux côtés, puis activer l’écriture de la nouvelle version après la recette de compatibilité. Une version inconnue donne une erreur récupérable qui préserve la fiche enregistrée et le brouillon.

Si le client et le Worker sont mis à jour séparément, tester les deux combinaisons de versions pendant la transition. Avant activation de la nouvelle écriture, vérifier que chaque client encore servi ouvre les recettes qu’il peut recevoir. Documenter le retour à la version précédente une fois des recettes enrichies enregistrées, y compris le comportement d’une ancienne interface devant une version plus récente.

| Média | Brouillon de récupération | Fiche enregistrée |
|---|---|---|
| Média de bibliothèque | Référence stable et transformation par occurrence. | Même référence à validité contrôlée, avec compatibilité des remplacements historiques. |
| Image importée localement | Blob durable ou représentation équivalente et métadonnées validées dans le stockage de reprise. Les URL temporaires sont recréées à la réouverture. | Enregistrer une référence privée durable avec la fiche. Restituer l’image, son rattachement et son cadrage sur tout autre appareil disposant des droits d’ouverture de cette fiche. |
| Support audio ou QR | ID de source et relations avec les questions et la transcription. | Préserver le chemin métier, les droits et la cohérence source/QR/correction. |

Vérifier les limites effectives au client et au Worker, le coût d’un upload incomplet, l’isolement par propriétaire et les droits de lecture après réouverture. Une référence inconnue ou inaccessible doit être traitée comme un média manquant. Tester l’échec d’upload, l’abandon et la suppression de la dernière référence avant de définir le nettoyage. La recette de persistance s’effectue sur des fixtures et un environnement de test adapté. Une éventuelle opération Cloudflare de production requiert l’autorisation correspondant à cette opération.

## 10. Lot L0 — Audit exhaustif exécutable (prérequis de l'implémentation)

L0 établit un inventaire reproductible et une référence de comportement avant toute refonte, à partir d’un checkout à jour, propre ou isolé. Consigner le commit, l’arbre Git, les versions des catalogues et banques, le statut initial des fichiers et les dépendances nécessaires. Une copie en retard ou contenant des modifications de travail peut servir à repérer des pistes. Les constats d’acceptation se rapportent au commit L0.

### 10.1 Inventaire des types réellement sélectionnables

1. Figer le commit et les dépendances. Exécuter le build, le contrôle TypeScript, les suites existantes pertinentes et les parcours écran/PDF. Relever les échecs avec commande, sortie et impact. Pour un obstacle qui empêche de générer une référence, consigner la condition de reprise sur la cible.
2. Énumérer dynamiquement les domaines de `ACCESS_DOMAIN_OPTIONS` par droits réels, sur des fixtures autorisées. Parcourir les sources de thèmes, sous-thèmes et `typeChoicesForBlock`, y compris lettre/son, banques graduées, niveaux et slots TCF. Résoudre ARB-01 pour la référence Logistique avant d’en figer la couverture.
3. Développer toutes les variantes d'un type qui modifient son schéma, ses contrôles ou son rendu (ex. QCM texte/image, avec/sans aide, CO audio, formes de géométrie, deux variantes d'évaluation). Pour les variantes de simples données (graine, mot ou valeur numérique), tester les limites et un échantillon déterministe, pas chaque nombre possible.
4. Inventorier séparément : type sélectionnable/générable ; type sélectionnable mais banque vide/non approuvée ; placeholder ; type historique/restauration de recette ; type non accessible par droits. Les entrées masquées ne sont pas artificiellement publiées. Dédupliquer par clé contextuelle, pas seulement par ID (même ID peut avoir des capacités différentes selon domaine/format).
5. Rendre une activité de référence (élève et corrigé si applicable) ; ouvrir Libre, identifier l'éditeur et lister les contrôles visibles des deux modes. Les banques non approuvées restent exclues du runtime ; tester le contrat avec fixtures validées hors publication.
6. Rattacher chaque contrôle à son test d’effet via §4.3 et §10.3. Vérifier le champ effectivement consommé, le rendu, le corrigé et l’aller-retour de la recette pour les données modifiables de chaque profil.
7. Produire les rapports détaillés et fixer la baseline visuelle/dimensionnelle. Relancer ces rapports après chaque lot.

### 10.2 Format de livrables d'audit

`docs/mode-libre/audit-types.json` et `audit-types.md` : une ligne par contexte de type (domaine/thème/sous-thème/type/variante/format/niveau pertinent), ID, source, état, éditeur actuel, profil cible, schéma de payload, capacités, paramètres existants, paramètres manquants, champs ignorés, preuve de génération, statut et anomalies. `audit-controles.json` et `audit-controles.md` : une ligne par contrôle et contexte, portée, champ, valeur initiale, valeurs tests, effet attendu/mesuré, présence en mode normal/Libre, condition de visibilité, preuve, état (OK / à corriger / à masquer / à implémenter / non applicable motivé). `audit-recettes.md` : migrations et cas représentatifs, y compris anciens IDs. `preuves/` : captures et résultats de tests, sans données personnelles.

Exemples de lignes (cas à tester, pas résultats déjà mesurés) :

| Type | Contrôle | Attendu | Vérification |
|---|---|---|---|
| `addition-ligne` | Valeur opérande A | Modifie l'énoncé et la réponse calculée | A=17 puis 29 ; B inchangé |
| `addition-ligne` | Sélecteur d'audio | Absent | Contrôle non présent en normal/Libre |
| `reperage-lire` | Taille de carreau | Modifie le repère sans changer les coordonnées | Mesure en mm + correction identique |
| `tcf-co-ex-1` | Choix d'audio | Effet sur le support et les questions éligibles | Vérifier variante réelle et ID audio |
| `societe-suisse-theorie-cantons-1` | Points par question | Absent | Document non noté |
| `logistique-cfc` / maths | Grille | Toujours présente, hauteur réglable si compatible | Test élève et corrigé, pas de bouton de suppression |
| Tous profils avec plusieurs items | Gap vertical | Modifie la distance réelle entre questions | Mesure DOM et rendu PDF, échelle constante |

Produire automatiquement les rapports et compteurs. La réception exige que chaque contexte actif et générable résolve exactement un profil, que chaque contrôle visible ait une preuve de son effet et qu’aucune régression bloquante subsiste. Calculer séparément les dénominateurs des contextes actifs et des contrôles réellement visibles. Les placeholders, cas non autorisés, banques vides, recettes historiques et tests bloqués restent dans le rapport avec motif. Une preuve bloquée compte comme manquante jusqu’à sa résolution ou à une dérogation explicitement validée.

### 10.3 Matrice, preuves et couverture

La clé de contexte inclut uniquement les dimensions qui modifient l’accès, le schéma, les contrôles, les règles ou le rendu : domaine, type, variante, niveau, format, mode et droits selon le profil. Conserver les liens vers les thèmes, banques et entrées qui partagent une clé comportementale. Calculer séparément le nombre d’entrées déclarées au catalogue, d’activités autorisées et générables, d’états indisponibles et de chemins de réouverture historiques. L’inventaire donne un résultat pour chaque entrée, y compris les exclusions motivées.

| Preuve | Ensemble à couvrir | Réutilisation acceptable |
|---|---|---|
| Résolution du profil, statut de disponibilité et génération de référence | Chaque contexte actif et chaque exclusion réellement observée. Fixer la graine, consigner les fixtures. | Réutiliser le même exécuteur. Produire un résultat explicite pour chaque contexte. |
| Application d’un contrôle et cas négatif | Chaque contrôle visible dans son contexte d’effet. Vérifier deux valeurs valides si le contrôle le permet, l’absence quand la condition est fausse et les dépendances utiles. | Partager une preuve d’intégration uniquement si adaptateur, consommateur, validation et effet sont identiques. Chaque contexte conserve l’assertion de raccordement au contrat partagé. |
| Recettes et relations métier | Une fixture par schéma de recette ou de payload encore pris en charge, plus les variantes qui modifient la lecture, les médias, les droits ou le corrigé. | Réutiliser les cas équivalents avec justification calculable et liens de preuve. |
| Géométrie et PDF | Chaque famille de rendu, chaque format physique et chaque différence de pagination, support, barème ou zoom susceptible de modifier le résultat. | Mutualiser les tests de géométrie lorsque le même rendu et les mêmes contraintes s’appliquent. Conserver le rattachement par contexte. |

Les rapports indiquent le commit, les commandes exécutées avec leur résultat, les versions des outils, les tailles de fenêtre, le navigateur, la graine, les fixtures, le statut et le lien vers la preuve. Les résultats ont les états `réussi`, `échoué`, `bloqué` et `non applicable` avec motif pour les deux derniers. Un test bloqué reste visible parmi les cas à recevoir. Conserver des mesures de référence reproductibles sur écran et en PDF, avec les polices et médias du cas chargés. Une comparaison PDF porte sur les pages, le texte ou la géométrie utiles, en écartant les métadonnées volatiles du fichier.

## 11. Plan de réalisation

| Lot | Travail | Condition de sortie |
|---|---|---|
| L0 | Référence cible, inventaire exécutable, état initial des recettes, contrôles, mesures écran/PDF et tests existants | Commit et données figés, rapports reproductibles, conclusions séparées par statut, dépendance Logistique identifiée. |
| L1 | Structure à deux panneaux, paramètres partagés et registre de capacités. Définir la révision appliquée, les IDs, les commandes d’édition, le contrat de verrouillage, l’historique et les interfaces de reprise. | Géométrie et droits vérifiés. Une édition pilote traverse le contrat de bout en bout avec les tests de base de sécurité des données. Les arbitrages prérequis du socle sont résolus. |
| L2 | Trois parcours pilotes dans le générateur existant : calcul recalculé automatiquement, QCM illustré, document avec sous-questions. Généraliser ensuite les éditeurs communs texte, trous, tableaux, associations, documents et théorie. | Édition en direct, correction, annulation, verrous et brouillon vérifiés sur les pilotes. Les recettes historiques s’ouvrent et les sorties sont cohérentes selon §9.5. |
| L3 | Étendre les contrats validés à mathématiques, géométrie, logique, TPM et TCM. | Valeurs typées, recalcul, figures et précision papier. Les évaluations standard suivent ARB-09. |
| L4 | Couvrir alphabétisation, soutien FR, Gattegno, calligraphie et cartes imprimables. | Toutes les variantes actives raccordées avec contrôles et preuves, y compris audio/images, écritures et cartes recto/verso. |
| L5 | Couvrir Grammaire et TCF/TPF. | Supports et sous-questions cohérents, variantes, niveaux, snapshots, banques et barèmes vérifiés. |
| L6 | Couvrir Société, états indisponibles et anciens types. Traiter Logistique AFP/CFC dans un lot dédié selon le CDC V2.11, à partir du générateur commun. | Capacité par format réellement disponible, droits et statut éditorial préservés. Les résultats de recette AFP et CFC sont rattachés à L8. |
| L7 | Durcir le stockage des médias, la reprise multi-onglets, les cas de quota, la pagination et les actions en série. Valider les réglages avancés. | Preuves de restauration, d’isolation des comptes et de compatibilité client/Worker, y compris scénarios d’échec. Mesures écran/PDF sur les contenus stables. |
| L8 | Recette finale de couverture, accessibilité, performances, compatibilité et documentation. | Matrices complètes, preuves rattachées aux critères de réception, validation Logistique AFP/CFC et revue de la PR dédiée. |

Les lots peuvent se chevaucher lorsque leur contrat est stable. Les identités, les opérations et le format de travail sont communs dès L1. L2 prouve leur cohérence sur des parcours complets avant de multiplier les adaptateurs. Les anciens éditeurs restent disponibles jusqu’à la validation de leur remplaçant. Une mise en production, si demandée, relève d’une action séparée.

## 12. Tests obligatoires et critères de réception

| ID | Test |
|---|---|
| UI-01 | Ouvrir Libre : `SettingsPanel` normal absent, panneau Libre unique à gauche, résultat unique à droite ; fermeture inverse sans perte. |
| UI-02 | Mesurer `A4Frame` avant/après à 1024, 1366, 1440 et 1920 px (selon breakpoints réels) : même largeur et hauteur à la tolérance de rendu près (proposée : 1 px), même échelle ; test portrait et double A5. |
| UI-03 | À 320, 390 et 768 px, vérifier l’accès à l’éditeur et à l’aperçu ainsi que l’absence de débordement horizontal global. Vérifier la disposition existante aux largeurs où elle reste utilisable et la bascule aux largeurs où elle est nécessaire. La bascule préserve l’activité, le zoom, la saisie et le retour de focus. |
| UI-04 | Défilement indépendant, accès aux actions, ouverture de l'en-tête/pied sans troisième colonne ; aucun overlay d'aide dans le PDF. |
| UI-05 | Absence de paragraphes d'aide statiques sous les réglages ; info-bulle après délai, clavier/focus/Escape, tactile, pas de déplacement du layout. Les erreurs restent visibles. |
| CAP-01 | Tous types actifs/variantes ont exactement un profil ; aucun fallback vide ni deux éditeurs concurrents. |
| CAP-02 | Comparer les contrôles applicables normal/Libre : même disponibilité et valeurs ; aucun doublon. |
| CAP-03 | Pour chaque contrôle visible, modifier deux valeurs valides et vérifier l'effet réel, puis un contexte négatif où il est absent. Couverture automatique par matrice. |
| CAP-04 | Un paramètre conditionnel apparaît/disparaît lorsque la variante change, sans modifier d'autres données ; un contrôle imposé n'est pas présenté comme modifiable. |
| CAP-05 | Vérifier les quantités limites, banque vide, niveau unique, une seule colonne imposée, mode non noté et absence de média/audio. |
| EDIT-01 | Ouvrir Libre sans modifier : aucune différence de contenu, ordre, numérotation, correction, graine, dimensions ou PDF rendu. |
| EDIT-02 | Modifier un énoncé et une réponse dans chaque famille ; vérifier le payload réellement consommé, pas seulement le champ de formulaire. |
| EDIT-03 | Ajouter, supprimer, dupliquer et déplacer les unités selon capacités ; IDs, points, sauts, médias et corrections suivent l'occurrence. |
| EDIT-04 | Modifier des options QCM, leurres, paires, cellules et positions de trous ; solution valide, aucune fuite dans fiche élève. |
| EDIT-05 | Éditer un document/cas avec plusieurs sous-questions ; garder les liens, supports, ordre et correction. |
| EDIT-06 | Éditer une théorie ou un glossaire : paragraphes, listes, tableaux, images ; aucun barème fictif ni conversion en question/réponse. |
| EDIT-07 | Appliquer en direct, annuler, rétablir, fermer, changer d'activité avec brouillon, rouvrir, régénérer localement ; aucun changement silencieux de contenu non concerné. |
| MATH-01 | Calculs directs/inverses, fractions, arrondis, conversions, décimaux, division non nulle, équations et géométrie : recalcul indépendant et erreurs explicites. |
| MATH-02 | Mesures imprimées, quadrillages, axes et coordonnées : précision physique et cohérence graphique/corrigé. |
| AUDIO-01 | Changer source audio ou valeur dictée ; cohérence audio/QR/réponse, pas de source manquante ignorée. |
| MEDIA-01 | Ajouter/remplacer/supprimer une image autorisée ; tester taille, position, légende, affichage élève/corrigé et recadrage. |
| MEDIA-02 | Deux occurrences de la même source : modification locale isolée ; déplacement et sauvegarde conservent l'association ; tester ancien override global. |
| MEDIA-03 | Upload local puis rechargement/rouverture de la fiche ; média valide accessible, erreur claire si manquant ; limites et validation des fichiers. |
| LAYOUT-01 | Modifier gap questions/activités, padding, colonnes, lignes de réponse ; mesurer l'effet au bon niveau, vérifier absence d'effet sur d'autres blocs. |
| LAYOUT-02 | Tester longs textes, images hautes, tableaux, plusieurs blocs, sauts manuels, double A5 ; aucun chevauchement ou rognage. |
| LAYOUT-03 | Logistique : réserve de 25 px au-dessus du pied, grille obligatoire, titres et logo corrects ; autres domaines identiques à la baseline lorsqu'aucune valeur ne change. |
| SCORE-01 | Points individuels, points par question et barèmes composites ; total exact après édition, aucun double comptage et respect des tests standard. |
| SAVE-01 | Aller-retour sauvegarde/lecture avec état de travail appliqué, paramètres, médias, contenu et correction, même affichage après changement de banque. |
| SAVE-02 | Anciennes recettes de toutes les familles disponibles, migration déterministe, droits et erreurs contrôlées. |
| REG-01 | Exécuter build, typecheck, lint et suites existantes ; pas de régression des modes normaux, impressions, audio, cartes, Grammaire et tests. |
| PERF-01 | Activités longues et nombreux items : pas de régénération complète pour un champ visuel, pas de perte du focus à la saisie, panneau réactif ; mesurer baseline et écarts. |
| SEC-01 | Autorisations inchangées, aucune modification des banques, contenu et médias validés, aucune fuite de données privées. |

Les tests unitaires couvrent le registre, adaptateurs, valeurs par défaut, recalculs et migrations. Les tests d'intégration couvrent la modification jusqu'au rendu et à la recette. Les tests navigateur couvrent les deux modes, les dimensions et les actions. Les preuves PDF/print vérifient les pages complètes et demi-pages, pas seulement une capture de l'interface. Pour les types partageant un même profil, exécuter les tests de compatibilité sur tous les IDs éligibles et les tests approfondis de chaque différence fonctionnelle. Ne pas créer de suites factices qui se contentent de vérifier des noms de champs ou d'ignorer des tests en échec.

## 13. Exemples de panneau cible (spécification, pas nouvelle UI)

### 13.1 Opération en colonnes

Ouvrir une fiche qui contient plusieurs additions. Modifier un opérande valide actualise le résultat et les retenues. Un signe seul reste dans le champ, avec le dernier résultat appliqué dans l’aperçu. Modifier la hauteur de grille conserve les opérandes et le barème. Verrouiller une addition conserve ses données, sa correction et son média pendant le nouveau tirage des autres. Vérifier aussi une ancienne recette de ce type et le rendu avant/après sans édition.

### 13.2 QCM avec illustration

Ouvrir deux questions distinctes qui utilisent la même image. Remplacer, recadrer puis déplacer la deuxième occurrence conserve la première, l’ordre des choix et la correction par ID. Supprimer le dernier choix correct place le corrigé dans un état explicite traité par ARB-03. Annuler la suppression restaure le choix et son média. Vérifier l’aperçu élève, le corrigé, la reprise du brouillon et la réouverture de la fiche sauvegardée.

### 13.3 Théorie longue

Modifier un tableau puis déplacer un paragraphe en fin de page. L’aperçu préserve l’ordre des sections et signale tout groupe trop haut pour la zone imprimable. Mesurer le PDF avec une image chargée tardivement et vérifier les deux demi-feuilles en double A5 lorsque le format est disponible. Les contrôles conviennent à une théorie non notée.

### 13.4 Compréhension avec document partagé

Ouvrir une compréhension structurée avec questions rattachées au même support. Modifier le texte et vérifier quelles réponses sont désormais à confirmer. Le tirage du support traite ses questions comme un groupe dépendant selon ARB-04. Éditer une question indépendante préserve les autres groupes, les points et les sauts. Vérifier une banque graduée ou un slot TCF réel.

### 13.5 Composition multi-modules de Logistique

Si la référence L0 inclut la Logistique V2.11, composer une fiche de deux sous-modules avec théorie, exercice à données et cas. Vérifier le rattachement de chaque contenu au module, les contrôles des seuls formats applicables, la grille du calcul, la réserve en pied et les variantes AFP/CFC autorisées. Tester avec des contenus approuvés ou des fixtures hors publication.

## 14. Définition de terminé et livrables d’implémentation

- [ ] Figer une référence cible à jour et produire les rapports L0 avant la refonte. Joindre le CDC Logistique V2.11 et consigner les arbitrages applicables aux lots concernés.
- [ ] Ne pas créer de nouvelle route, de nouvelle interface logistique ou de nouveau moteur d'impression.
- [ ] Le mode Libre remplace le panneau normal, occupe le reste à gauche ; aperçu inchangé à droite.
- [ ] Réutiliser les paramètres normaux et les éditeurs spécialisés, compléter les écarts par type. Chaque type réellement actif a un profil et des preuves.
- [ ] Tous les contrôles sont pertinents, sans doublon, réellement connectés ; retirer les réglages sans effet du normal et du Libre. Ne jamais cacher un défaut requis au lieu de le réparer.
- [ ] Aide uniquement contextuelle (info-bulles) sauf alertes, erreurs et consignes nécessaires. Le panneau est compact, hiérarchisé et utilisable au clavier et sur mobile.
- [ ] Édition des questions, données, corrections, supports, images, points, espaces et dimensions applicables ; contraintes métier respectées.
- [ ] Conservation des recettes, médias et corrections, migration non destructive, pas de régénération ou modification involontaire.
- [ ] Vérifier mise à jour en direct, annulation/rétablissement, verrouillage, reprise locale et sorties élève/corrigé selon §9.5. Vérifier les règles de concurrence et l’isolement des comptes.
- [ ] Tous les boutons et réglages respectent les règles ergonomiques et les tests de §15–16 ; aucune modification visuelle hors des deux panneaux.
- [ ] Tests complets de couverture, de comportements, de présentation, de sauvegarde, de pagination et de non-régression ; résultats réels documentés.
- [ ] Respecter le CDC Logistique V2.11 pour les deux domaines une fois sa référence confirmée. Appliquer la présente spécification à l’interface du panneau et le CDC Logistique aux règles métier et au rendu propres au domaine. Consigner tout conflit explicite dans ARB-01.

Livrer le code, les tests, les rapports exécutés, les preuves de rendu et la documentation de maintenance dans une PR dédiée à l’implémentation. Joindre les écarts préexistants, décisions et résultats non vérifiés avec leur statut. Les contraintes de fidélité de la fiche, d’effet des paramètres et de couverture des activités actives restent impératives. Les seuils ergonomiques et de mesure proposés suivent ARB-07.


## 15. Compléments ergonomiques et fonctionnels — version 1.1

### 15.1 Composition des deux panneaux et hiérarchie des actions

Le panneau normal reste la version rapide ; Libre reprend les mêmes contrôles applicables et expose les détails. Les mêmes composants et conventions visuelles doivent servir dans les deux modes. Il ne s'agit pas d'introduire un design system concurrent.

| Groupe | Panneau normal | Mode Libre |
|---|---|---|
| Activité | Sélecteurs et réglages essentiels | Mêmes valeurs, mêmes sélecteurs, sans répétition |
| Contenu | Quantité, banque et options de génération pertinentes | Liste compacte, sélection, édition de l'unité, consigne et supports |
| Présentation | Réglages de base existants et efficaces | Réglages de base + détails repliables, surcharges par unité |
| Correction/barème | Options globales pertinentes | Réponses, critères, points et état de cohérence dans l'unité |
| Actions | Générer ou régénérer lorsque nécessaire | Annuler/rétablir, ajouter, verrouiller, régénérer selon capacités |

Bandeau d'actions compact dans le panneau seulement ; ne pas ajouter de barre d'outils globale. La liste des unités affiche numéro, extrait de l'énoncé et états réellement utiles (verrou, erreur, média si présent). Développer une unité à la fois par défaut, mémoriser l'ouverture des sections par profil. Les activités simples ne doivent pas recevoir des onglets vides. Si un groupe ne contient aucun contrôle applicable, il disparaît intégralement.

### 15.2 Système de boutons, champs et interactions

| Action | Présentation recommandée | Effet et garde-fous |
|---|---|---|
| Générer / Régénérer | Bouton avec libellé explicite, unique pour la portée | Tirer seulement les unités concernées et non verrouillées ; ne pas confondre génération et actualisation visuelle |
| Ajouter une question | Bouton texte + icône près de la liste | Choix manuel, banque ou variante, seulement si autorisé |
| Annuler / Rétablir | Deux icônes dans le bandeau du panneau | Désactivées si historique vide, nom accessible et info-bulle |
| Verrouiller | Cadenas ouvert/fermé sur l'unité régénérable | État visible même sans survol ; action réversible |
| Dupliquer, remplacer, restaurer | Menu contextuel « … » près de l'unité | Aucune action hors portée ; nouvel ID pour une copie |
| Supprimer | Menu contextuel, confirmation seulement si perte significative | Annulable ; suppression en série avec résumé de portée |
| Déplacer | Poignée de déplacement si pertinent, alternatives clavier/monter/descendre | Numérotation, correction, médias et verrous suivent l'ID |
| Réinitialiser | Action discrète près du réglage modifié | Restaure l'héritage ou la valeur initiale explicitement ; pas de remise à zéro générale |
| Fermer Libre | Action de fermeture existante, dans le panneau | Retour au normal sans validation obligatoire ni perte |

- Distinguer visuellement action principale, secondaire et destructive avec les styles existants. Un seul bouton principal par contexte ; ne pas mettre tous les boutons en couleur forte. Les icônes ambiguës ont un libellé texte ou une aide accessible. Les menus ne contiennent que les actions réellement disponibles.
- Les libellés des actions sont des verbes précis et stables dans les deux modes. Ne pas utiliser la même icône pour supprimer, réinitialiser ou régénérer. Prévoir états survol, focus, pressé, chargement, désactivé et erreur. Pas de double exécution lors d'un double clic ou d'une touche répétée.
- Contrôles : interrupteur pour une option binaire immédiatement applicable, cases pour sélection multiple, boutons segmentés pour quelques valeurs exclusives, liste déroulante pour un ensemble long, champ numérique avec unité et bornes pour une valeur exacte. Un curseur peut compléter le champ pour les espacements, sans créer deux valeurs indépendantes. Ne pas afficher de sélecteur à choix unique imposé.
- Les champs sont alignés, les unités accolées, les champs courts regroupés par sens, les longues zones de texte à largeur adaptée. Utiliser les espacements, polices et couleurs du produit ; éviter les bordures et cartes empilées. Libellés visibles, placeholders non utilisés comme seuls libellés. Aucune aide statique répétitive sous les champs.
- Garder le focus, la sélection du texte et la position de défilement lors d'un changement. Un slider ou une saisie rapide peut déclencher un rendu coalescé ; le résultat valide final doit toujours apparaître automatiquement. Aucun délai de validation manuelle. Une génération longue est une action distincte annulable lorsque le moteur le permet ; ignorer les résultats asynchrones devenus obsolètes.
- Paramètres purement visuels et édition des valeurs existantes : effet direct. Quantité : ajouter ou retirer uniquement les unités nécessaires, conserver les questions restantes et respecter les verrous. Banque, difficulté, changement de type : si la modification implique un nouveau tirage incompatible ou détruit du contenu, proposer un choix explicite de remplacement ; sinon appliquer automatiquement en conservant le contenu compatible. La confirmation d'une opération destructive n'est pas une validation générale.
- Les paramètres cachés ne laissent pas d'effet parasite ; les préférences compatibles sont retrouvées lors du retour à une variante. Les erreurs restent localisées et accessibles ; aucun toast à chaque frappe. Le menu « … » ne doit pas devenir un tiroir de réglages indispensables.

### 15.3 Sélection et modification en série

Pour les exercices comportant de nombreuses unités, proposer une sélection multiple à la demande : toutes, visibles après filtre, ou sélection manuelle. Afficher le nombre sélectionné et distinguer explicitement « toutes les questions de l'activité » de « questions visibles ». Une action en série vise uniquement les IDs sélectionnés, pas la feuille entière.

- Actions compatibles : régler les points, lignes de réponse, espacements, tailles d'images, verrouillage et présentation ; déplacer ou supprimer lorsque possible. Si valeurs mixtes, indiquer « Plusieurs valeurs » sans écrire une valeur implicite. Les réglages non communs restent masqués.
- Recherche locale des questions par numéro/texte et filtre « verrouillées » ou « à vérifier » uniquement lorsque le volume le justifie. Filtrer la liste d'édition ne doit ni filtrer la fiche imprimée ni changer la sélection sans indication.
- Autoriser l'insertion depuis la banque avec recherche et aperçu si cette banque existe. Aucun changement dans la banque source. Une duplication est volontaire ; le générateur évite les doublons involontaires.
- Une opération en série est une transaction unique dans l'historique. Prévenir avant une suppression importante ou une réinitialisation de plusieurs unités. Réutiliser les contrôles existants avant d'en créer de nouveaux.

### 15.4 Verrouillage et historique (décision confirmée)

Le verrou protège l’unité et ses dépendances lors du tirage : énoncé, données, réponse, choix, médias, sous-questions et barème local. Lorsqu’une question dépend d’un support partagé, son verrou protège le support et tout le groupe dépendant contre la régénération. Une unité verrouillée reste éditable manuellement et son nouveau contenu reste protégé. Une copie a sa propre identité et démarre déverrouillée.

- Régénération individuelle, sélectionnée ou de l'activité : ne remplacer que les unités déverrouillées concernées. Conserver leurs positions relatives selon le profil ; préserver la correction des unités verrouillées. Si toutes sont verrouillées, ne pas présenter une régénération active sans effet.
- Réduction de quantité sous le nombre d'unités verrouillées : ne pas supprimer de verrou silencieusement ; proposer une quantité compatible ou demander quels verrous retirer. Si un filtre ou type est incompatible, indiquer le conflit et conserver le contenu jusqu'à un choix explicite.
- Annuler/rétablir les modifications de contenu, paramètres, corrections, ordre, médias, points, verrous et opérations en série. Regrouper une frappe continue ou un glissement en une opération logique ; une nouvelle modification après annulation invalide la branche de rétablissement. La navigation de l'éditeur et l'ouverture des info-bulles ne créent pas d'historique.
- Raccourcis proposés : Ctrl/Cmd+Z, Ctrl/Cmd+Maj+Z (et Ctrl+Y lorsque pertinent). Respecter l'annulation native dans les champs de texte ; éviter de capter les raccourcis globaux hors panneau. Historique borné selon mémoire et taille des médias ; proposition initiale : 50 opérations logiques, à mesurer. Conserver au moins l'état restaurable du brouillon indépendamment de l'historique.

### 15.5 Récupération du brouillon (décision confirmée)

Créer une copie de récupération de l’état de travail après modification. Utiliser la persistance existante si elle couvre la reprise par fiche et compte, les révisions atomiques et les médias. Sinon, choisir un stockage local durable adapté, par exemple IndexedDB. Appliquer les règles d’identité et de reprise de §9.6.

- Enregistrer une révision atomique comprenant activité/feuille active, contenu, corrections, paramètres, médias, verrous, saisies en cours et métadonnées de version. Déclencher la persistance après un court délai de stabilisation et sur les événements de cycle de vie disponibles ; ne pas dépendre seulement de la fermeture de l'onglet.
- Après fermeture accidentelle/rechargement, restaurer la dernière révision durable compatible, sans nouveau tirage. Indiquer discrètement « Brouillon récupéré » avec possibilité de retrouver l'état enregistré précédent. Le dernier caractère non persisté lors d'un arrêt brutal peut être perdu : ne pas promettre une garantie absolue. La restauration ne crée pas une nouvelle fiche définitive.
- Si plusieurs onglets divergent sur la même fiche, rendre le conflit visible et garder les révisions récupérables. Si le quota est atteint, le stockage indisponible, une révision illisible ou un média absent, préserver le travail en mémoire et signaler précisément l’échec. Confirmer la persistance après réussite effective.
- Garder le brouillon dans le navigateur de l’appareil, par compte et par fiche, jusqu’à l’enregistrement complet du travail ou à son abandon explicite. Un enregistrement de la dernière révision appliquée qui laisse une saisie transitoire à traiter conserve le brouillon. Au retour sur le même compte et appareil, la reprise est disponible après une période d’inactivité. Les incidents ou suppressions du stockage navigateur suivent le traitement prévu ci-dessus. Définir le nettoyage après enregistrement ou abandon et le traitement des conflits selon ARB-05.

### 15.6 Cohérence, préférences et contrôle de la fiche

- Réponses calculables : recalcul automatique déterministe et mise à jour des étapes, unités, graphiques et barèmes. Réponses ouvertes : si l'énoncé ou le support change, afficher « Corrigé à vérifier » lorsque la validité n'est pas démontrable. L'enseignant peut confirmer le corrigé concerné après vérification, sans bouton de validation générale.
- QCM : une réponse correcte requise (ou plusieurs si mode multiple), IDs de choix conservés au mélange ; associations : paires complètes ; tableaux : cellules et valeurs liées cohérentes ; documents et audio : dépendances contrôlées. Ne pas laisser une incohérence partir dans un corrigé présenté comme fiable.
- Barème : recalculer les totaux après ajout, suppression ou modification. Respecter les tests à barème imposé ; ne pas afficher de réglage qui viole le profil standard. Les modifications du barème et de la présentation restent séparées.
- Présentation : signaler dans le panneau les unités qui débordent, les supports absents et les corrections à vérifier. Donner accès directement à l’unité concernée. Appliquer la politique de sortie de §9.5 dans le parcours existant.
- Préférences : mémoriser les derniers réglages utiles et compatibles pour les nouvelles activités et les sections ouvertes par compte et par profil. Une fiche ouverte conserve les valeurs de sa recette. Après les essais formateur, évaluer le besoin de préréglages nommés. Si cette option est retenue, prévoir l’application explicite et la vérification de compatibilité.

### 15.7 Accessibilité et confort d'utilisation

Navigation clavier complète, ordre de tabulation naturel, focus visible, libellé accessible pour chaque icône et état du verrou annoncé autrement que par la couleur. L’aide est accessible au survol, au clavier et sur écran tactile. Elle ne déplace pas le panneau. Escape ferme les menus et rend le focus au déclencheur. Le délai de 600 ms et la cible tactile de 44 px lorsque possible sont des valeurs proposées, à vérifier sur les composants existants. Tester l’absence de défilement horizontal global et d’éléments d’édition imprimés.

## 16. Recette complémentaire V1.1 et V1.2

| ID | Scénario et résultat attendu |
|---|---|
| LIVE-01 | Modifier quantité, contenu, réponse, point, espacement et image lorsque pertinents. L’aperçu et le corrigé se mettent à jour à partir de la valeur appliquée. |
| LIVE-02 | Saisir une valeur incomplète, invalide puis valide. Le focus, la saisie et le dernier rendu appliqué sont conservés et le message disparaît quand la valeur devient valide. |
| LIVE-03 | Fermer et rouvrir Libre, changer de feuille et revenir. Préserver les IDs, le contenu et les saisies transitoires sans nouveau tirage. |
| LIVE-04 | Enchaîner 20 changements rapides et deux générations asynchrones avec retours inversés. La dernière révision valide prévaut et les médias correspondent à leur unité. |
| LIVE-05 | Demander deux unités de plus, puis une de moins. Vérifier unités intactes, ordres, barèmes, limites de banque et traitement d’un retrait potentiellement destructeur. |
| LOCK-01 | Verrouiller 3 unités sur 10, régénérer le bloc et comparer données, réponses, points et médias des 3 protégées. |
| LOCK-02 | Tout verrouiller, réduire la quantité sous le nombre de verrous puis changer de banque incompatible. Vérifier conflit explicite, possibilité d’annuler et état précédent restauré. |
| LOCK-03 | Déplacer, dupliquer, modifier et rouvrir une unité verrouillée. La source conserve son identité et son verrou. La copie a son propre ID et démarre déverrouillée. |
| LOCK-04 | Verrouiller une question liée à un support partagé, puis régénérer l’activité depuis le panneau et depuis la commande existante. Vérifier que le support et l’ensemble des questions du groupe sont protégés à chaque fois. |
| HIST-01 | Annuler/rétablir une valeur numérique et son corrigé, une suppression avec média et une édition en série. Vérifier la restauration atomique. |
| HIST-02 | Une saisie continue et un déplacement produisent chacun une opération logique. Une nouvelle édition après annulation invalide la branche de rétablissement. |
| DRAFT-01 | Fermer l’onglet après persistance et rouvrir. Comparer données, corrections, paramètres, médias locaux, verrous, saisie transitoire et activité active. |
| DRAFT-02 | Simuler quota, stockage bloqué, révision invalide et média absent. Vérifier le message, l’instantané durable précédent et la révision de travail en mémoire. |
| DRAFT-03 | Ouvrir deux onglets et créer des révisions divergentes. Vérifier que le formateur peut identifier et choisir une révision et que l’autre reste disponible. Tester le changement de compte sur le même poste et l’isolement de deux fiches nouvelles. La sauvegarde définitive reste celle de l’action explicite. |
| DRAFT-04 | Simuler une longue inactivité, puis se reconnecter au même compte depuis l’appareil d’origine. Vérifier la reprise jusqu’à l’enregistrement complet ou l’abandon explicite. Ouvrir depuis un second appareil et vérifier la différence entre brouillon local et fiche enregistrée. |
| BATCH-01 | Sélectionner des unités de types mixtes et filtrer la liste. Une action en série touche seulement les IDs sélectionnés et les réglages compatibles. |
| UX-01 | Inventorier les actions. Un contrôle par effet et portée, libellés cohérents et aide accessible. |
| UX-02 | Modifier une valeur, remplacer une image, changer un espacement, verrouiller et régénérer depuis le panneau. Mesurer opérations et retours utilisateur. |
| UX-03 | Utiliser clavier seul, tactile et fenêtre étroite. Vérifier le retour du focus, l’accès aux actions et l’absence d’aide imprimée. |
| UX-04 | Comparer les deux modes à contenu identique. La barre, la navigation, la présentation de la fiche et sa géométrie correspondent à la référence. |
| CHECK-01 | Modifier un énoncé ouvert ou supprimer la bonne réponse d’un QCM. Demander d’imprimer la fiche avec corrigé. Si le sujet élève est complet, vérifier que l’interface explique le blocage du corrigé et propose l’impression de la fiche élève seule après une action explicite. |
| CHECK-02 | Modifier une valeur valide (par exemple 12) en saisie incomplète (par exemple « - »), puis demander l’impression et l’enregistrement. Vérifier que 12 est annoncé, que la sortie exige une confirmation et que « - » reste dans le brouillon après confirmation. Tester l’annulation, le retour du focus et le même parcours avec un corrigé à vérifier. |
| SCORE-02 | Dans une évaluation standard, demander une modification de l’ordre, du nombre d’unités ou du barème imposé. Créer explicitement une fiche personnalisée et vérifier son identification, le calcul du nouveau barème et la réouverture des deux fiches. |
| SAVE-03 | Faire passer la même recette historique puis enrichie par les lecteurs/écrivains du client et du Worker cible. Comparer les champs métier, les IDs, l’apparence et les erreurs de version. |
| SAVE-04 | Enregistrer une fiche contenant une image importée. Ouvrir la fiche sur le même navigateur et sur un second appareil autorisé, puis comparer l’image, son rattachement et le cadrage. Tester un autre compte sans accès et un upload échoué. En cas d’échec, vérifier que la dernière version enregistrée reste accessible et que le brouillon permet de reprendre le travail. |
| SAVE-05 | Enregistrer une fiche valide côté élève dont le corrigé est à vérifier. Réouvrir la fiche, retrouver l’état et les unités concernées, puis vérifier le blocage du corrigé et la possibilité de confirmer la correction. |
| PREF-01 | Modifier un réglage que le profil mémorise. Vérifier sa reprise pour une nouvelle activité compatible, son isolation par compte et profil, et la préservation des valeurs lors de la réouverture d’une fiche existante. Noter lors des essais formateur le besoin éventuel de préréglages nommés. |

Mesurer séparément l’édition simple, le recalcul d’une question structurée et la pagination d’une fiche longue. Pour l’édition simple, le point de départ est la réception d’une valeur valide. Le point d’arrivée est le premier rendu de l’aperçu qui inclut cette valeur. L’objectif proposé est inférieur à 150 ms au 95e percentile sur l’environnement fixé en ARB-07. Les parcours formateur couvrent au minimum un calcul, une activité structurée avec support et une fiche longue. Consigner les erreurs, actions inutiles et problèmes de compréhension avec exemples reproductibles.

## 17. Arbitrages avant mise en œuvre

Les décisions ci-dessous ont été validées le 26 novembre 2026. Le calendrier indique quand établir les preuves et préciser les paramètres techniques. Le guide d’implémentation relie chaque décision aux profils, parcours et tests concernés.

| ID | Sujet | Décision ou proposition | Statut et jalon |
|---|---|---|---|
| ARB-01 | Référence et réception Logistique | Intégrer Logistique AFP/CFC dans un lot dédié à partir du générateur commun. Sa validation fait partie de la réception finale de la refonte. Figer la branche cible à jour et vérifier la révision du CDC Logistique, V2.11 à la publication. | **Confirmé** pour la réception. Référence avant L0 et contrôle de version avant L6. |
| ARB-02 | Disposition en fenêtre étroite | Garder la disposition actuelle là où elle est utilisable. Ajouter une bascule « Édition / Aperçu » lorsque l’espace devient insuffisant. Restaurer la position et le focus au retour. | **Confirmé.** Seuil à établir en L1. |
| ARB-03 | Sortie en présence d’une incohérence | Si l’impression inclut un corrigé à vérifier, expliquer le blocage et proposer d’imprimer la fiche élève seule quand le sujet est complet. Autoriser l’enregistrement avec « Corrigé à vérifier » et conserver cet état à la réouverture. Si un champ contient une saisie invalide, proposer la dernière valeur valide après confirmation explicite et conserver la saisie dans le brouillon. | **Confirmé**, règles de sortie à appliquer dès L1 et à vérifier en L2. |
| ARB-04 | Verrous, groupes et duplication | Un verrou protège le groupe complet lorsqu’une question dépend d’un support partagé. Une copie reçoit une nouvelle identité et démarre déverrouillée. | **Confirmé**, à appliquer dès L1. |
| ARB-05 | Identité et conservation des brouillons locaux | Conserver le brouillon sur l’appareil par compte jusqu’à l’enregistrement complet ou l’abandon explicite, y compris après une période d’inactivité. En cas de divergence entre onglets, conserver les révisions et laisser le formateur choisir celle à reprendre. Identifier le mécanisme d’isolement sur les parcours avec accès partagé. | **Règles retenues.** Contrat en L1, cas d’échec et conflits vérifiés en L7. |
| ARB-06 | Images importées en sauvegarde définitive | Les images suivent la fiche enregistrée sur les appareils autorisés. Le brouillon conserve ses images localement jusqu’à sauvegarde. Valider le stockage privé durable, les limites, les droits et le traitement des médias orphelins. | **Disponibilité confirmée.** Contrat en L1, stockage définitif avant SAVE-04. |
| ARB-07 | Mesures de réception | Fixer navigateur, matériel, tailles de fenêtre, polices et jeux d’essai en L0. Partir de 1 px de tolérance écran, 600 ms d’aide, 50 actions d’historique et 150 ms au P95 pour l’édition simple. Fixer les seuils à partir des mesures et consigner les écarts motivés. Définir une tolérance physique distincte pour les PDF d’exercices de mesure. | **Méthode retenue.** Seuils à mesurer en L0 et à vérifier en recette. |
| ARB-08 | Préférences avancées | Mémoriser les derniers réglages utiles et compatibles avec le profil, en préservant les valeurs des fiches ouvertes. Évaluer l’intérêt des préréglages nommés et des filtres avancés après les essais formateur. | **Confirmé.** Évaluation des options en L7. |
| ARB-09 | Dérogations aux évaluations standard | Permettre de créer une fiche personnalisée pour modifier l’ordre, le nombre d’unités ou le barème imposé. Identifier l’état personnalisé à l’écran, à la réouverture et dans les rapports. Documenter les règles standard de chaque profil. | **Confirmé**, à appliquer avant la réception de chaque profil d’évaluation. |

**Périmètre de réception.** Les panneaux de paramètres et le mode Libre couvrent les domaines actifs de la référence validée. Les adaptations internes servent cette édition et les compatibilités requises. La validation du chantier porte sur la cohérence des fiches, l’intégrité des sauvegardes, l’accessibilité et les preuves de non-régression. Toute mise en production avec modification du Worker, du stockage ou de D1 fait l’objet d’une opération autorisée distincte.
