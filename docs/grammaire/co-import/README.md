# Audios de compréhension orale — Grammaire

**252 audios originaux : 127 A1 et 125 A2, répartis dans 38 thèmes/sous-thèmes.** Les 24 lots A2 partagent 23 destinations, « Activités de loisir » et « Centres d’intérêt » étant réunis. Les fichiers A1 restent dans `public/lib/audio/grammaire/co/<theme>/pisteNNN.mp3` ; les nouveaux A2 sont dans `public/lib/audio/grammaire/co/<theme>/a2/piste_NNN.mp3`, sans collision avec les noms A1. Chaque fichier est identique à celui envoyé (SHA-256 contrôlé), sans découpe ni conversion. L’inventaire [sources.json](sources.json) conserve les identifiants d’envoi, durées, empreintes, chemins et destinations.

## Utilisation

Dans le thème/sous-thème convenu, choisir **Compréhension orale**, puis la piste dans le menu **Audio**. Le réglage **A1 / A2** est propre à l’exercice et sauvegardé avec la piste sélectionnée. Seuls les niveaux possédant leurs propres enregistrements sont activés. Le niveau par défaut est A1 si disponible, sinon A2. Aucune recette A2 ne tire un audio A1 à la place, et inversement.

Se présenter et Famille réutilisent les sous-thèmes existants. Les autres lots sont classés dans leurs contextes dédiés sous les parties convenues : temps, décrire, demander/proposer, conseiller, activités, présent, aliments, espace, questions, faits divers, argumentation et entrer en contact. Les corrections A2 convenues sont conservées : « Centres d’intérêt » avec les loisirs, « Ville ou campagne » dans argumenter, « Prendre soin de soi » dans conseiller, « Entretien d’embauche » et « S’intégrer dans l’entreprise » dans demander/proposer. La table complète est dans `src/grammaire/exercises/co-themes.ts`.

Chaque piste est liée au support CO du rendu TCF. **Les 127 transcriptions A1 sont conservées et les 125 transcriptions A2 sont intégrées.** Les questions restent vides et leur nombre est masqué. Les anciennes recettes identité/famille sont reconnues et migrées vers le type commun.

## Transcriptions et questions

Deux moteurs locaux, Parakeet et Whisper en français, ont traité les 127 originaux A1 et les 125 originaux A2. Une lecture supplémentaire de Whisper sans jetons d’horodatage a permis de retrouver des débuts de dialogues omis. Les textes ont été relus et corrigés par comparaison, notamment les nombres et les mots français reconnus en anglais. Les annonces parlées de page et d’exercice restent transcrites pour correspondre aux originaux de grammaire.

Le 5 novembre, les 125 pistes A2 ont été comparées entre les deux moteurs et relues. Vingt-deux ont reçu une reconnaissance supplémentaire. Les débuts omis, passages anglais parasites, erreurs de segmentation, orthographe et accords ont été corrigés à partir des lectures disponibles. Les [34 réserves A2 ont ensuite été reprises](revue-34-points-20261105.json) avec Whisper Turbo sur chaque original et huit extractions ciblées. Dix points factuels sont recoupés ; 23 graphies de noms non épelés sont explicitement documentées comme conventions éditoriales, sans prétendre certifier une orthographe officielle. Le téléphone de la piste 078 est rétabli en 06 07 06 07 00. La piste 136 ne permet pas de restituer un numéro complet : la transcription le signale, les chiffres manquants ne sont pas inventés et ne peuvent pas devenir une réponse attendue. Aucun audio n’a été modifié.

Le rapport [transcriptions.json](transcriptions.json) conserve, pour chaque identifiant et empreinte audio, le texte retenu, les reconnaissances brutes, les corrections et les points incertains. Les conventions orthographiques et la limite du numéro de téléphone de la piste 136 restent signalées. Ce travail est une transcription automatique recoupée et relue ; aucune écoute humaine n’est attestée. Les découpes des versions TCF sont suivies séparément.

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

Le contrôle vérifie les 252 fichiers et empreintes, les 38 liens du catalogue, l’accès à chaque piste, le rendu du bon audio, son niveau A1 ou A2, la conservation des transcriptions A1, la liaison des 125 transcriptions A2 à leurs originaux et l’absence de question ajoutée, la sauvegarde de la sélection et l’absence de repli entre les niveaux.
