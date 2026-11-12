# Implémentation du curriculum Grammaire — pilotes Être, -er particuliers et récit au passé

Lancement du 11 novembre 2026. Référence G0 : `ff743145ce6724a78cc898789c5aaf36a0004474`.

Le cahier des charges complet est dans [cahier-des-charges-v2.md](cahier-des-charges-v2.md) ; les 424 activités cibles et les décisions sont suivies dans `target-registry.json`. L’option recommandée d’intégration des 43 activités omises est retenue comme hypothèse de construction au lancement ; aucun ancien type n’est supprimé. Les cinq décisions pédagogiques précédentes sont conservées.

## Disponible dans ce lot

Dans **Grammaire → Conjuguer au présent → Être**, choisir **A1 — pilote** sur les types existants :

- **Conjuguer être** : une seule activité, avec le réglage QCM / Lacune ; 50 phrases réemployées, chaque présentation contrôlée séparément.
- **Corriger l’erreur** : 50 phrases erronées, réécriture complète et corrigé.
- **Mots dans l’ordre** : 50 phrases A1, bulles Gattegno et réponse écrite. Les filtres existants sont conservés ; cette première banque A1 ne contient que des phrases affirmatives.
- **Associer les sujets et les formes** : 50 problèmes de trois associations, fondés sur les phrases réemployées et leurs formes conjuguées.

Cette tranche Être représente **200 unités sources/activités et 250 variantes de réponse**. Ce ne sont ni 250 phrases sources inédites ni 250 unités approuvées par un enseignant. Les banques sont au statut `reviewed`, avec `humanReview: pending` ; elles sont accessibles par une sélection pilote explicite, sans les déclarer publiées. Le retour **Banque actuelle** conserve le générateur historique.

### Verbes en -er particuliers — 12 novembre 2026

Dans **Grammaire → Conjuguer au présent → Verbes en -er particuliers**, le réglage **Niveau de grammaire** ajoute :

| Activité | A1 — pilote | A2 — pilote |
| --- | --- | --- |
| Les formes particulières | 50 unités, QCM / Lacune | 50 unités, QCM / Lacune |
| Mots dans l’ordre | 50 phrases | 50 phrases |
| Corriger l’erreur | Banque historique conservée | 50 phrases |
| Transformer une phrase | — | 50 transformations avec sujet imposé |

La banque A1 réemploie les sources existantes. Les **50 contextes A2** sont rédigés individuellement, puis partagés entre les différentes activités ; ils ne se limitent pas à ajouter une même amorce de discours rapporté aux phrases A1. Cette tranche apporte **300 unités d’activité et 400 variantes**, soit **500 unités et 650 variantes** pour l’ensemble des deux pilotes. Aucune banque n’est encore approuvée par un enseignant.

Le verbe donné est coloré et placé après le trait de réponse, y compris en mise en ordre. Les corrections et transformations A2 réservent deux lignes ; la pagination tient compte des explications du corrigé. Les formes ouvertes acceptent les variantes orthographiques usuelles de payer et essayer. Au tableau, les transformations affichent la phrase source et le nouveau sujet ; la réponse est appréciée par l’enseignant.

La [fiche de relecture m5](pilote-m5-relecture.md) présente les 50 contextes A2 et les changements de sujet. Les deux niveaux disposent aussi de snapshots indépendants, et le mode QCM / Lacune est conservé quand l’enseignant change de niveau.

### Imparfait ou passé composé — A2

Dans **Grammaire → Parler du passé → Imparfait ou passé composé**, sélectionner **A2 — pilote** :

| Activité | Banque du pilote |
| --- | --- |
| Choisir le temps du récit | 50 contextes, une activité avec QCM / Lacune |
| Transformer une phrase | 50 scènes à raconter au passé avec `quand` |
| Lire une situation | 20 textes de genres et de situations distincts, 60 questions |
| Écrire une phrase utile | 50 situations, modèle possible et cinq critères enseignant |
| Dire une phrase utile | 50 situations, destinataire et tâche orale, modèle non exclusif |

Les exercices courts distinguent explicitement le fond et l’événement pour fixer le sens demandé. Les 50 scènes peuvent servir plusieurs activités, avec une tâche et une correction propres à chacune ; il ne s’agit pas de 200 histoires inédites. Les 20 lectures sont rédigées séparément : courriel, témoignage, carte, article, annonce, carnet, rapport, forum, entretien, etc. Elles ne reprennent pas un gabarit dont seuls les noms changent. La [fiche de relecture h8](pilote-h8-relecture.md) répertorie ces supports et les scènes.

La lecture possède un champ **Nombre de textes** (1–20). Tous les documents tirés conservent leurs trois questions : un QCM et deux réponses courtes, avec preuves littérales au corrigé. Le nombre historique de questions ne sélectionne pas les textes. Le bouton de saut de page après chaque question enregistre son ID stable ; il ne modifie ni le tirage ni les options. Le support est repris sur les continuations. Les rubriques de production et les preuves de lecture restent sur le corrigé, sans modèle imposé comme réponse unique pour une production libre.

Cette tranche ajoute **310 variantes de réponse** : 100 QCM/lacunes, 50 transformations, 100 productions et 60 questions de lecture. Les trois pilotes totalisent **960 variantes**, avec 20 documents de lecture comptés séparément. Les 220 unités sélectionnables de h8 comprennent 200 questions/situations et 20 documents ; les questions enfants d’un document ne sont pas des documents supplémentaires. Toutes les validations enseignant restent en attente.

Les nouvelles séries vont jusqu’à 50 questions et se répartissent sur plusieurs feuilles A4, avec des marges réservées aux corrigés. La pagination ne relance pas le tirage. Le pilote utilise un nouveau rendu grammatical, compatible avec 2 à 6 propositions, sans modifier les limites TCF.

## Tableau collectif et sauvegardes

Le moteur interactif arrivé sur main depuis l’audit du plan est réutilisé. L’ordre des propositions déjà tiré pour la fiche est conservé au tableau, afin que les lettres A–F correspondent au corrigé papier. **Jouer avec la classe** reprend la sélection du pilote. Les QCM restent fermés ; lacunes et corrections sont guidées par l’enseignant ; les mots se déplacent avec les commandes existantes. L’association est proposée **paire par paire**, avec les mêmes propositions : un problème de trois associations donne trois étapes de jeu. Le déplacement de toutes les paires dans un tableau d’association reste à développer.

Les nouvelles recettes conservent explicitement activité, niveau, présentation et révision. Leur sélection est figée à la sauvegarde/export, avec options, mots et corrigés. Une sélection valide peut être relue sans la révision courante de la banque. Les paramètres incomplets ou snapshots incohérents sont refusés, sans revenir silencieusement à A1 ou à une autre banque. Les blocs voisins ne récupèrent pas le niveau du premier bloc.

Les CE enregistrent aussi `grammarDocumentCount`, leurs groupes document/questions et les options de chaque QCM. Chaque document n’est stocké qu’une fois dans le snapshot ; les supports répétés à l’impression en sont dérivés. Les coupures utilisent `grammarPageBreakAfterQuestionIds`, sans modifier la clé du tirage. Le réassemblage destiné au mode libre déduplique les supports par ID au lieu de remplacer la question précédente par leur répétition. Au tableau, chaque question reprend son texte et son `source.documentId`. Les réponses courtes, transformations et productions conservent une appréciation humaine ; seuls les QCM à solution vérifiée sont fermés.

Les anciennes recettes et la compréhension orale restent sur leurs chemins historiques. Le lien Aller vers la théorie a5 absente est corrigé : a4 reste la fiche visible et l’ancien ID a5 est résolu vers elle, sans réécrire le contenu de théorie.

## Sources et revue

`src/grammaire/curriculum/data/etre.json`, `er-particuliers.json` et `imparfait-ou-pc.json` sont les sources éditoriales des pilotes, et non des sorties TS à régénérer. Les IDs de migration y sont stockés une fois, avec type, chemin et position de provenance ; ils ne sont pas recalculés à chaque tirage. Les associations référencent leurs phrases sources. Les scripts historiques ne doivent pas écraser ces sources complémentaires.

Pour publier une banque après revue enseignant : enregistrer la personne, la date et la décision dans `review`, puis passer `review.humanReview` et `editorialStatus` à `approved`. Ne pas déclarer l’approbation à partir d’un simple comptage automatique. Les variantes QCM sont relues avec leurs distracteurs ; les variantes ouvertes sont contrôlées avec leurs solutions ou critères.

## Vérifications reproductibles

- `npm run test:grammar:baseline` : 735 sorties à graines fixes, types actuels et alias CO ; empreintes de 256 fichiers CO/audio. Le script refuse d’écraser la référence G0 existante.
- `npm run test:grammar:levels` : 960 variantes, niveaux A1/A2, tirages et filtres, capacité réelle, snapshots, recettes, blocs supplémentaires, révisions archivées, propositions 2–6, pagination et adaptation au tableau.
- `node node_modules/typescript/bin/tsc -b --pretty false` : contrôle TypeScript.
- Démarrer Vite sur le port 5183, puis `npm run test:grammar:browser` : parcours réels Être A1, -er particuliers A1/A2 et imparfait/passé composé A2 dans Chrome, QCM/Lacune, 50 questions sur chaque présentation, élève/corrigé, absence de débordement et lancement de la séance. `GRAMMAR_TEST_URL` et `GRAMMAR_QA_DIR` permettent de choisir le serveur et le dossier de preuves.

Résultats du lot : [verification.json](verification.json). Les scénarios du cahier des charges restent des critères à exécuter lors des lots concernés ; ce premier lot ne prétend pas les avoir tous réalisés.

## Suite de l’implémentation

G0 est capturé ; le socle G1 et le raccordement au tableau sont engagés. G2 comporte les tranches Être A1, -er particuliers A1/A2 et imparfait/passé composé A2. Restent notamment les autres notions pilotes (COD, subjonctif), les lectures multi-textes avec leurs 20 supports, les productions et rubriques enseignant, les supports images, l’ensemble des nouvelles activités et les autres extensions A2/B1. Les 98 notions / 123 couples notion-niveau du registre sont des cibles, pas une couverture livrée.

Aucun audio, transcription, banque CO ou contenu des autres domaines n’est modifié par ce lot.

Les commits TCF et interactifs arrivés jusqu’à `9fccae6f` ont été intégrés par rebase ; les références G0 sont toujours identiques après cette intégration. Si un filtre ne laisse aucune unité disponible, le lancement du jeu affiche le diagnostic et conserve la fiche au lieu de créer une séance vide.

Le 12 novembre 2026, les contrôles TypeScript, G0, 250 variantes du pilote, sept tests des adaptateurs interactifs et Chrome (élève/corrigé/tableau) passent sur cette version fusionnée.

La tranche m5 porte le contrôle ciblé à 650 variantes et ajoute huit parcours d’impression A1/A2, plus le lancement réel d’une transformation au tableau. Le test historique `scripts/test-grammar-curriculum.cjs` demeure obsolète : il attend 99 fiches visibles et l’ancienne identité de plusieurs théories. Le catalogue en expose déjà 98 avec l’alias sauvegardé a5 → a4 avant cette tranche ; aucun fichier de théorie n’est modifié ici. Cette divergence est consignée séparément des vérifications G0 et des tests ciblés, sans déclarer ce test global réussi.

Le lot h8 a été vérifié avec les 960 variantes, les 19 présentations dans Chrome (1 920 questions imprimées élève/corrigé), les groupes de lecture, les coupures réversibles, les preuves et révisions archivées, le réassemblage des continuations, les sept tests des adaptateurs existants et TypeScript. Les banques sont relues par l’assistant ; aucune approbation enseignante n’est déclarée.

Les commits arrivés jusqu’à `a4a97144` ont été intégrés par rebase. Après intégration, G0, les 960 variantes, TypeScript, Chrome h8 et les 15 tests des adaptateurs/géométrie passent.
