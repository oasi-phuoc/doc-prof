# Implémentation du curriculum Grammaire — premier lot

Lancement du 11 novembre 2026. Référence G0 : `ff743145ce6724a78cc898789c5aaf36a0004474`.

Le cahier des charges complet est dans [cahier-des-charges-v2.md](cahier-des-charges-v2.md) ; les 424 activités cibles et les décisions sont suivies dans `target-registry.json`. L’option recommandée d’intégration des 43 activités omises est retenue comme hypothèse de construction au lancement ; aucun ancien type n’est supprimé. Les cinq décisions pédagogiques précédentes sont conservées.

## Disponible dans ce lot

Dans **Grammaire → Conjuguer au présent → Être**, choisir **A1 — pilote** sur les types existants :

- **Conjuguer être** : une seule activité, avec le réglage QCM / Lacune ; 50 phrases réemployées, chaque présentation contrôlée séparément.
- **Corriger l’erreur** : 50 phrases erronées, réécriture complète et corrigé.
- **Mots dans l’ordre** : 50 phrases A1, bulles Gattegno et réponse écrite. Les filtres existants sont conservés ; cette première banque A1 ne contient que des phrases affirmatives.
- **Associer les sujets et les formes** : 50 problèmes de trois associations, fondés sur les phrases réemployées et leurs formes conjuguées.

Cela représente **200 unités sources/activités et 250 variantes de réponse**. Ce ne sont ni 250 phrases sources inédites ni 250 unités approuvées par un enseignant. Les banques sont au statut `reviewed`, avec `humanReview: pending` ; elles sont accessibles par une sélection pilote explicite, sans les déclarer publiées. Le retour **Banque actuelle** conserve le générateur historique.

Les nouvelles séries vont jusqu’à 50 questions et se répartissent sur plusieurs feuilles A4, avec des marges réservées aux corrigés. La pagination ne relance pas le tirage. Le pilote utilise un nouveau rendu grammatical, compatible avec 2 à 6 propositions, sans modifier les limites TCF.

## Tableau collectif et sauvegardes

Le moteur interactif arrivé sur main depuis l’audit du plan est réutilisé. **Jouer avec la classe** reprend la sélection du pilote. Les QCM restent fermés ; lacunes et corrections sont guidées par l’enseignant ; les mots se déplacent avec les commandes existantes. L’association est proposée **paire par paire**, avec les mêmes propositions : un problème de trois associations donne trois étapes de jeu. Le déplacement de toutes les paires dans un tableau d’association reste à développer.

Les nouvelles recettes conservent explicitement activité, niveau, présentation et révision. Leur sélection est figée à la sauvegarde/export, avec options, mots et corrigés. Une sélection valide peut être relue sans la révision courante de la banque. Les paramètres incomplets ou snapshots incohérents sont refusés, sans revenir silencieusement à A1 ou à une autre banque. Les blocs voisins ne récupèrent pas le niveau du premier bloc.

Les anciennes recettes et la compréhension orale restent sur leurs chemins historiques. Le lien Aller vers la théorie a5 absente est corrigé : a4 reste la fiche visible et l’ancien ID a5 est résolu vers elle, sans réécrire le contenu de théorie.

## Sources et revue

`src/grammaire/curriculum/data/etre.json` est la source éditoriale du pilote, et non une sortie TS à régénérer. Les IDs de migration y sont stockés une fois, avec type, chemin et position de provenance ; ils ne sont pas recalculés à chaque tirage. Les associations référencent leurs phrases sources. Les scripts historiques ne doivent pas écraser cette source complémentaire.

Pour publier une banque après revue enseignant : enregistrer la personne, la date et la décision dans `review`, puis passer `review.humanReview` et `editorialStatus` à `approved`. Ne pas déclarer l’approbation à partir d’un simple comptage automatique. Les variantes QCM sont relues avec leurs distracteurs ; les variantes ouvertes sont contrôlées avec leurs solutions ou critères.

## Vérifications reproductibles

- `npm run test:grammar:baseline` : 735 sorties à graines fixes, types actuels et alias CO ; empreintes de 256 fichiers CO/audio. Le script refuse d’écraser la référence G0 existante.
- `npm run test:grammar:levels` : 250 variantes, tirages et filtres, capacité réelle, snapshots, recettes, blocs supplémentaires, révisions archivées, propositions 2–6, pagination et adaptation au tableau.
- `node node_modules/typescript/bin/tsc -b --pretty false` : contrôle TypeScript.
- Démarrer Vite sur le port 5183, puis `npm run test:grammar:browser` : parcours réel dans Chrome, QCM/Lacune, 50 questions sur chaque présentation, élève/corrigé, absence de débordement et lancement de la séance. `GRAMMAR_TEST_URL` et `GRAMMAR_QA_DIR` permettent de choisir le serveur et le dossier de preuves.

Résultats du lot : [verification.json](verification.json). Les scénarios du cahier des charges restent des critères à exécuter lors des lots concernés ; ce premier lot ne prétend pas les avoir tous réalisés.

## Suite de l’implémentation

G0 est capturé ; le socle G1 et le raccordement au tableau sont engagés. G2 comporte seulement cette première tranche verticale Être A1. Restent notamment les autres notions pilotes (-er particuliers, imparfait/passé composé, COD, subjonctif), les lectures multi-textes avec leurs 20 supports, les productions et rubriques enseignant, les supports images, l’ensemble des nouvelles activités et les extensions A2/B1. Les 98 notions / 123 couples notion-niveau du registre sont des cibles, pas une couverture livrée.

Aucun audio, transcription, banque CO ou contenu des autres domaines n’est modifié par ce lot.
