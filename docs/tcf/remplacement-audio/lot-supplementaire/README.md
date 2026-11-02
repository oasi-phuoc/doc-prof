# Collections supplémentaires reçues

Les six collections supplémentaires représentent **428 fichiers audio** : 141 A1, 184 A2 et 103 B1, soit 7 h 25 min 24 s. Avec les 408 premiers fichiers, le catalogue reçu compte **836 entrées de fichiers sources**. Chaque entrée conserve son identifiant, son empreinte et sa provenance. Deux pistes de copyright ont ensuite été retirées des fichiers extraits et du catalogue de traitement, sur instruction explicite. Il reste **426 fichiers supplémentaires à traiter (139 A1, 184 A2, 103 B1)**, soit 834 avec le premier lot. Les autres originaux sont conservés.

Les deux ZIP A1 sont conservés et leurs 141 MP3 sont extraits dans des chemins distincts. Les quatre ZIP A2/B1 dépassaient la limite de transfert de 32 Mio ; les 287 fichiers envoyés individuellement constituent leur livraison exploitable. Les six collections sont désormais récupérées.

Les **428 fichiers** passent le contrôle d’intégrité et disposent d’une transcription automatique avec horodatages natifs. Les deux mentions de copyright sont tracées dans [le registre de retrait](copyright-retire.json). Les autres plans distinguent les annonces de numérotation, les consignes et les paroles utiles. Les plans issus d’une source ayant exactement les mêmes octets sont réutilisables avec une provenance explicite ; chaque nouvelle entrée et chaque original restent conservés.

Au point d’avancement de ce commit : 657 passages candidats sont repérés ; cinq plans demandent encore une correction d’horodatage ou de représentation des expressions prononcées. Des noms, nombres et passages mal reconnus dans les brouillons ASR restent signalés. Aucun contrôle par écoute ni aucune bascule en production n’est déclaré.

- [Sources et provenance](sources.json)
- [État chiffré et blocages](etat.json)
- [Exclusions de consignes et limites explicites](segmentation-overrides.json)
- [Priorités de vérification des transcriptions](transcript-review-priorities.json)

Le dossier de travail est `/workspace/work/tcf-audio-additional-20261102-work`. Les sources individuelles restent également dans `/workspace/attachments`. La bibliothèque de production reste `public/lib/audio/tcf/co/` ; les fichiers de travail ne sont pas une seconde bibliothèque servie.
