# ADR 0021 — Compétition par salle, sans nom ni pseudo

Le propriétaire demande des salles de compétition avec scores, puis précise que les élèves doivent choisir une mascotte, sans nom ni pseudo. Douze nouvelles illustrations sont générées pour ce mode. Un numéro automatique distingue deux joueurs qui choisissent la même image ; aucun champ de nom, texte libre, photo ou adresse d’avatar n’est accepté à l’inscription.

Le moteur commun traite les QCM vérifiables de la sélection. Le serveur conserve le quiz et ses clés, mais chaque participant ne reçoit que la question actuelle, ses propres choix et le classement. La bonne réponse est ajoutée uniquement pendant la correction. Les identifiants de questions et de propositions sont renumérotés pour ne pas transmettre de métadonnées source suggestives. Les activités nécessitant une appréciation humaine restent dans Classe et Solo.

## Autorité et accès

L’API existante reçoit un module `/competition` et une liaison Durable Object, sans modification des recettes ni des tables D1 des fiches. Créer une salle exige `COMPETITION_HOST_KEY`, une clé enseignant distincte, vérifiée côté serveur, jamais intégrée au bundle et jamais remplacée par un cookie de rôle client. Une configuration absente refuse les salles. Les accès historiques à l’application restent à migrer au titre de F22 ; ils ne donnent pas autorité sur une salle.

La création et l’inscription émettent des capacités aléatoires de 256 bits, limitées à une salle et un rôle. Le serveur en conserve les empreintes. Les requêtes les transmettent dans `Authorization`, jamais dans l’URL ; le client ne conserve que ces capacités dans l’onglet, pas la clé enseignant. Les origines sont explicitement autorisées. Les réponses ne sont pas mises en cache.

Une capacité élève ne permet ni les commandes enseignant, ni le vote d’un autre joueur, ni l’envoi de points ou d’un temps déclaré. Le premier choix est définitif ; répéter le même envoi reste sans effet supplémentaire. Les commandes de progression indiquent l’écran et la phase attendus pour empêcher deux onglets de sauter une correction. Les arrivées sont fermées après le départ ; un joueur retiré perd son accès.

## Temps, points et conservation

Le serveur reçoit le corps complet et borné avant l’entrée dans la file de la salle. Une requête lente ne peut donc ni bloquer son alarme, ni dater une réponse à son premier octet. Le temps de lecture est limité à cinq secondes. Une bonne réponse rapporte de 500 à 1 000 points avec bonus de rapidité, ou 1 000 sans bonus/minuteur. Une erreur ou une absence de réponse rapporte zéro. La pause conserve le temps restant et les points ne sont calculés qu’à la correction. Les égalités gardent le même rang.

Chaque salle possède une file de mutations, des alarmes durables et un état conservé au plus deux heures, puis supprimé avec ses capacités. Les gros instantanés sont découpés en chaînes bornées, écrites atomiquement dans le KV SQLite : ils respectent la limite de 128 Kio par valeur. Une version de stockage inconnue est refusée sans être écrasée.

La création est limitée à dix tentatives par minute et par adresse ; l’inscription à 180, avec une seconde borne de 120 par salle. Le limiteur durable utilise une empreinte d’adresse et expire après une minute. Ces bornes ne remplacent pas une protection de plateforme contre une attaque distribuée.

## Sans réseau

Sans aucun lien entre les appareils, une salle ne peut pas synchroniser leurs réponses. Le même moteur propose donc un défi sur un seul appareil : choix de mascottes, passage de l’appareil, départ du chrono après « Je suis prêt », correction après tous les tours, puis classement. La préparation charge les médias complets et les garde en mémoire sous forme de blobs ; le journal local ne contient que les actions, pas les questions ni leurs clés. Un démarrage à froid entièrement hors ligne et l’installation PWA restent hors de cette étape.

## Vérification et activation

Les tests du moteur et de l’API couvrent les rôles, les champs refusés, les temps, les doubles envois, la pause, les anciens résultats, les gros quiz, les limites et la purge. [competition-worker-results.json](competition-worker-results.json) provient du vrai moteur `workerd` via Miniflare : quiz de 60 questions dépassant 128 Kio, points calculés côté serveur et reprise depuis un nouveau processus avec le stockage SQLite.

Le code est validé localement ; aucun déploiement Cloudflare n’est exécuté par ces tests. L’environnement de travail n’a ni accès Cloudflare configuré ni autorisation réseau vers son API. L’activation nécessite le déploiement du Worker et la création de la clé serveur ; elle est distincte du push applicatif sur `main`.
