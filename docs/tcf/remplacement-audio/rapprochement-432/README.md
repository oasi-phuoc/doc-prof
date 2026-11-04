# Reprise des 432 références audio

Les **432 fichiers actuellement servis ont été retranscrits directement**, avec leurs empreintes et leurs mots horodatés. La recherche initiale a couvert les **834 réceptions DELF conservées**, soit **644 fichiers sources aux octets distincts**. Les réceptions qui partagent les mêmes octets restent toutes conservées.

**26 fichiers disposent aussi d’une seconde transcription imposée en français**, dont les 22 sorties contenant des fragments en anglais ou des tokens inconnus et les cas de liaison à contrôler. Les deux reconnaissances sont conservées côte à côte ; une sortie plus courte n’efface pas un passage reconnu par l’autre moteur.

**135 des 432 références sont maintenant rapprochées d’une source.** Les quatre premiers candidats et les 131 découpes retrouvées dans les 127 originaux A1 de grammaire sont tous préparés. Le registre des sources couvre **1 021 références sur 1 318**, dont **1 021 avec candidat préparé**. Pour les **297 sans source retrouvée**, le fichier actuel dispose de sa transcription de repli. Un résultat de recherche négatif ne prouve pas l’absence du passage dans toute autre collection.

L’[extension aux 127 originaux](extension-127/README.md) conserve ces preuves séparément ; les 127 transcriptions sont maintenant intégrées à la banque de grammaire, avec les fichiers originaux conservés. Le corpus consulté compte **961 réceptions actives**, soit 834 du corpus DELF et 127 originaux de grammaire, représentant 771 fichiers aux octets distincts.

| Référence actuelle | Source retrouvée | Candidat préparé |
|---|---|---|
| `47-école-chercher-livre-de-mathématiques.mp3` | `piste_009.mp3` | Dialogue complet du livre de mathématiques, première lecture. |
| `ecole-4.mp3` | `9782090351958_38_CO_ex36.mp3` | Nouvel assemblage des six annonces scolaires, sans annonces de numérotation. |
| `une-bonne-cuisine-se.mp3` | `09035197_27_DELF_EMISSION_A9.mp3` | Document complet sur les labels alimentaires, avec l’introduction absente du fichier actuel. |
| `tiens-jacqueline-comment-vas-1.mp3` | `09035196_04_DELF_CO_E2.mp3` | Conversation de Laura et Ophélie sur le départ au Mexique ; le nom du fichier actuel est trompeur. |

Les trois confirmations à décalage constant conservent **au moins trois ancres à corrélation ≥ 0,8 et un écart de décalage ≤ 40 ms**. Pour le livre de mathématiques, les pics les plus forts provenaient de deux lectures différentes : la recherche teste un même décalage sur les trois ancres, qui atteignent alors chacune plus de 0,95. Aucun seuil n’a été abaissé.

L’ancien fichier des annonces scolaires était déjà un montage. Trois ancres fortes retrouvent la même source dans l’ordre, avec des décalages différents. Cette identité de source est consignée séparément d’une correspondance à décalage constant. Les six FLAC préparés ont été assemblés ; le PCM du résultat correspond exactement à leur concaténation et le MP3 a été décodé intégralement. Le corpus compte désormais **14 assemblages**, en plus de 1 679 découpes issues des originaux reçus et de deux coupes de fichiers actuels de repli.

## Écarts constatés et corrections appliquées

Une reconnaissance indépendante, imposée en français, confirme les trois décalages suivants dans `tcf-a1-sem1-co-2` :

- `les-situations-du-quotidien-3-2.mp3` contient le restaurant d’entreprise ouvrant à 11 h 30 ; ses questions demandent pourtant le prix des cerises et la quantité achetée.
- `les-situations-du-quotidien-3-3.mp3` contient l’achat de cerises à 6,40 € le kilo, pour 500 g ; ses questions portent sur une visite chez le médecin du travail.
- `les-situations-du-quotidien-3-4.mp3` contient aussi l’achat de cerises ; ses questions demandent une robe en taille 38.

Ces trois décalages sont corrigés dans la banque. Le bon enregistrement des cerises est réutilisé. Les originaux médical et d’essayage attendus n’ayant pas été retrouvés, le message reçu DELF A1 piste 090 et le dialogue reçu de la piste 105 de grammaire les remplacent ; leurs questions correspondent désormais à ces autres enregistrements authentiques. Aucune identité de source avec les anciens fichiers n’est revendiquée. Le groupe comporte quatre questions restaurant, trois cerises, cinq médecin et dix essayage.

Dans `tcf-ss-a1-s44-co-4`, l’ancienne transcription et les deux questions s’arrêtaient à « Page 99, exercice 4 ». Le fichier contient pourtant ensuite une demande de tickets de métro à Bordeaux, avec le conseil de prendre un passe pour la journée ou un carnet de dix tickets. Les deux questions de numérotation sont remplacées par quatre questions sur ce contenu ; la version sans annonce pédagogique est installée.

Dans `ecole-4.mp3`, deux lectures automatiques du fichier actuel indiquent **23 avril** et **salle B-116**, alors que la banque porte « 3 avril » et « P16 ». L’adresse électronique et certains noms propres restent à vérifier à l’écoute ; aucune orthographe n’est inventée.

## Fichiers et reprise

- [État chiffré](etat.json).
- [Transcriptions directes des 432 références](transcriptions.json), avec variantes de banque, secondes reconnaissances disponibles, mots et temps estimés.
- [Correspondances et quatre candidats préparés](correspondances.json).
- [Corrections à préparer](corrections-a-preparer.json) : les trois décalages de liaison, leurs deux reconnaissances concordantes et les quatre questions métro appliquées, à la place des deux questions de numérotation.
- [Preuves et tentatives de comparaison du signal](preuves-signal.json).
- [Contrôles sur 48 références connues](controles-positifs.json) : les 48 sources correctes sont retrouvées en première position et leurs confirmations de signal sont conservées.

Le travail reproductible se trouve dans `/workspace/work/tcf-audio-reconciliation-20261104`. Les modèles locaux ont été rétablis depuis les distributions officielles ; l’archive Parakeet et les trois fichiers Whisper sont vérifiés par SHA-256. Aucun audio n’a été envoyé à un service externe.

Les empreintes spectrales servent à proposer des sources ; elles ne valident pas un remplacement. Le filtre de recherche à 1 kHz ne peut que rejeter un candidat et son résultat n’est pas présenté comme une comparaison complète à 8 kHz. Les rapprochements retenus reposent sur les ancres à 8 kHz. Les textes automatiques, leurs alertes lexicales et les temps TDT de 80 ms restent des brouillons à relire.

**Aucune écoute humaine n’est déclarée.** Les [corrections appliquées](../corrections-appliquees-20261104.json) installent quatorze audios dans sept exercices, avec 57 questions relues. Elles corrigent aussi le répondeur, les rôles de Flo et Manon et les banques insuffisantes des cinq règles, de Christian et de Nina. Les anciennes sélections audio sont reconnues par des alias ; les fichiers antérieurs sont conservés. La relecture et l’écoute globales, les autres banques insuffisantes et la poursuite de la bascule restent à effectuer. Les 432 transcriptions de ce dossier décrivent le jeu historique de références avant ces corrections.
