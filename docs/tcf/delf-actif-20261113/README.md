# Import DELF Actif — 13 novembre 2026

Les trois nouvelles collections A1, A2 et B1 sont ajoutées au périmètre de travail. Les documents fournis sont des sources pédagogiques, pas des instructions d’exécution.

## État de la préparation

- **140 originaux reçus et entièrement décodés** : 53 A1, 46 A2 et 41 B1. Les quatre pistes A2 initialement trop volumineuses ont été fournies à nouveau sous la limite de transfert. Aucun fichier ne reste bloqué pour ce motif.
- Les trois PDF originaux et leurs textes extraits sont conservés dans `sources/`. Les réceptions, identifiants de fichiers, durées, formats et SHA-256 sont dans [receptions.json](receptions.json).
- La reconnaissance initiale intégrale des 140 sources est archivée dans `reconnaissances-origine-parakeet.json.gz`. Une seconde reconnaissance imposée en français et des alignements locaux servent à vérifier les divergences ; aucune écoute humaine n’est attestée.
- **351 unités préparées**, dont six renvoient aux autres lectures des mêmes messages A2 ; **345 unités distinctes prévues**. Les pistes 11.1/11.2 A1 et 8/9 A2 sont rapprochées à l’intérieur de leur collection : tous les originaux restent conservés, sans multiplier les mêmes questions.
- **344 extraits MP3 préparés et entièrement décodés** dans le dossier de travail. Un montage de courtes formules A2 reste à finaliser. Les séries thématiques conservent leurs phrases, avec retrait des numéros et lettres d’exercice. Les situations indépendantes ont leur propre fichier.
- **120 supports A1 / 466 questions** et **153 supports A2 / 649 questions** rédigés. Chaque question comporte trois réponses distinctes et une citation justificative. Le contrôle des citations et de la formulation interrogative passe. La banque B1 reste à rédiger.

**Ces compteurs décrivent la préparation. L’installation de ces nouveaux extraits dans les banques actives n’est pas encore effectuée.** Elle suit la comparaison des MP3 finaux, la relecture des divergences et les contrôles de couverture des questions. Les anciens audios TCF ne sont pas supprimés ou remplacés par cet ajout.

## Contrôles et reprise

`scripts/audio_replacement/delf_actif_import.py` prépare les unités, rapproche les mots horodatés, encode les candidats, vérifie les citations et produit la comparaison des reconnaissances finales. Il se lance dans l’environnement ASR indiqué par `scripts/audio_replacement/asr-requirements.lock.txt`. Les sources et caches de travail se trouvent dans `/workspace/work/delf-actif-20261113/`.

Les modifications de découpe créent de nouveaux fichiers : elles n’écrasent pas un MP3 en cours de reconnaissance. Les modèles et sources restent liés à leurs empreintes. Les seuils de similarité orientent la relecture ; ils ne certifient pas à eux seuls la justesse des réponses ni une écoute humaine.

Les différences de transcription déjà réexaminées sont dans [corrections-transcriptions.json](corrections-transcriptions.json). La signature Vanessa du message A1 52 est confirmée sur une lecture locale par un deuxième moteur ; la graphie d’un prénom non épelé reste une convention éditoriale. Aucune question ne porte sur cette signature.

Les variantes QCM image des nouveaux supports seront préparées après stabilisation des questions. Aucune image manquante n’est annoncée comme disponible.
