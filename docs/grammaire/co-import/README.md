# Audios de compréhension orale — Grammaire

**127 audios originaux, 20 thèmes, tous A1.** Les fichiers sont dans `public/lib/audio/grammaire/co/<theme>/pisteNNN.mp3`. Chaque fichier est identique à celui envoyé (SHA-256 contrôlé), sans découpe ni conversion. L’inventaire [sources.json](sources.json) conserve les identifiants d’envoi, durées, empreintes, chemins et destinations.

## Utilisation

Dans le thème/sous-thème convenu, choisir **Compréhension orale**, puis la piste dans le menu **Audio**. Le réglage **A1 / A2** est propre à l’exercice et sauvegardé avec la piste sélectionnée. Tous les enregistrements actuels sont A1. A2 est désactivé jusqu’à l’ajout de ses propres audios ; aucune recette A2 ne tire un audio A1 à la place.

Se présenter et Famille réutilisent les sous-thèmes existants. Les 18 autres lots sont classés dans leurs contextes dédiés sous les parties convenues : temps, décrire, demander/proposer, conseiller, activités, présent, aliments, espace et questions. La table complète est dans `src/grammaire/exercises/co-themes.ts`.

Chaque piste est liée au support CO du rendu TCF. **Les 127 transcriptions ont été ajoutées à la demande du 4 novembre 2026.** Les questions restent vides et leur nombre est masqué. Les anciennes recettes identité/famille sont reconnues et migrées vers le type commun.

## Transcriptions et questions

Deux moteurs locaux, Parakeet et Whisper en français, ont traité chaque original. Une lecture supplémentaire de Whisper sans jetons d’horodatage a permis de retrouver des débuts de dialogues omis. Les textes ont été relus et corrigés par comparaison, notamment les nombres et les mots français reconnus en anglais. Les annonces parlées de page et d’exercice restent transcrites pour correspondre aux originaux de grammaire.

Le rapport [transcriptions.json](transcriptions.json) conserve, pour chaque identifiant et empreinte audio, le texte retenu, les reconnaissances brutes, les corrections et les points incertains. Les graphies de certains noms propres et une source à la fin tronquée restent signalées. Ce travail est une transcription automatique recoupée et relue ; aucune écoute humaine n’est attestée. Les découpes des versions TCF sont suivies séparément.

La banque est `src/grammaire/exercises/co-bank.json`. Chaque entrée correspond à une piste :

- `theme`, `level` et `exercise.id` identifient sa destination et sa sélection ;
- `exercise.support.audio` contient le chemin de l’enregistrement ;
- `exercise.support.transcription` contient le texte lié à l’original ;
- `exercise.questions` est un tableau vide à compléter au format TCF ;
- `status` vaut `transcribed` ; `transcriptionReview` décrit le contrôle effectué sans attestation d’écoute ;
- les originaux, les identifiants de sélection et les recettes sauvegardées sont conservés.

Les trois formats de réponse (QCM texte, réponse sur trait et QCM images) sont ceux du rendu TCF. Ils apparaîtront pour les questions renseignées. Les images à préparer ou à réutiliser pourront être consignées dans [images-a-preparer.json](images-a-preparer.json). Aucune image n’a été générée.

## Vérification

```sh
node scripts/audit-grammar-co-import.cjs
```

Le contrôle vérifie les 127 fichiers et empreintes, les 20 liens du catalogue, l’accès à chaque piste, le rendu de l’audio et de sa transcription, le niveau A1, l’absence de question ajoutée, la sauvegarde de la sélection et l’absence de repli A2 vers A1. L’import reproductible est `scripts/import-grammar-co-transcriptions.py` ; il refuse les empreintes divergentes et toute modification collatérale des questions ou fichiers audio.
