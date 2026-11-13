# ADR 0041 — Transcriptions après les écoutes en compétition

Le réglage **Proposer la transcription après les réponses** est disponible dans la préparation des compétitions qui contiennent un texte d’écoute. Sa valeur initiale reprend celle de la préparation Classe / Solo. Il s’applique à la nouvelle salle ou au nouveau défi ; reprendre un ancien défi conserve ses réglages.

## Texte privé et correction publique

L’export de quiz conserve les transcriptions uniquement sur demande explicite. Elles restent à côté du corrigé dans le quiz privé, jamais dans la question projetée. Désactiver l’option évite de les envoyer au serveur. Le serveur valide leur type, leur longueur maximale de 30 000 caractères et la présence d’une piste audio.

La vue des participants ne contient un texte que pendant la correction de la **dernière question du quiz utilisant cette écoute**. Une question liée placée plus loin bloque donc la publication, même si un autre enregistrement apparaît entre-temps. Le mode local attend le dernier joueur ; les écrans de transmission de l’appareil n’exposent ni question ni texte. Des versions contradictoires restent masquées. Les extraits composés sont identifiés par leur séquence complète.

Les anciennes salles et les anciens journaux sans réglage de transcription restent compatibles et gardent les textes masqués. Le journal local ne stocke ni transcription ni état de la fenêtre de lecture. La reprise reconstitue l’éligibilité à partir du quiz et de la progression.

## Lecture et temps de correction

L’icône livre apparaît dans les commandes de correction. Lorsqu’il ouvre le texte, l’enseignant met la salle en pause ; la fenêtre attend cette pause effective. Fermer la lecture laisse la partie en pause : l’enseignant choisit **Reprendre** pour conserver le temps restant. Un élève peut lire le texte déjà publié, sans arrêter le temps pour les autres. Une nouvelle question ferme sa fenêtre.

Le dialogue conserve les paragraphes, accepte Échap et rend le focus au livre. La lecture et le classement restent des fenêtres distinctes. Les commandes de pause / reprise portant sur une question devenue obsolète sont refusées par le serveur ; les anciennes commandes sans contexte restent acceptées. Le défi local vérifie aussi que sa question n’a pas déjà changé ou expiré avant la pause.

## Vérifications

Huit tests de domaine et deux compléments API couvrent l’export explicite, les champs publics, les questions non contiguës, les tours locaux, les erreurs de données, les anciennes options, les extraits composés, les scores, le battement et la reprise. Le parcours `npm run test:interactive:competition-transcripts` utilise deux enregistrements TCF existants, deux navigateurs élèves et trois tailles d’écran ; le défi local se joue sans réseau après préparation. Le contrôle `competition-worker.mjs` vérifie aussi le stockage et la restauration des textes privés avec le véritable moteur `workerd` et SQLite.

Les résultats se trouvent dans `competition-transcripts-results.json`, `competition-worker-results.json` et `quality-competition-transcripts-results.json`. Ils valident le code et les services locaux de test, sans déploiement Cloudflare de production.

## Suite

Le démarrage à froid hors ligne de tous les médias, les autres mécaniques et l’activation du service Internet de production restent suivis séparément. Aucune synthèse audio n’est ajoutée par ce lot.
