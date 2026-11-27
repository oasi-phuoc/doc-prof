# Audios de compréhension orale — Grammaire

**252 audios originaux : 127 A1 et 125 A2, répartis dans 38 thèmes/sous-thèmes.** Les 24 lots A2 partagent 23 destinations, « Activités de loisir » et « Centres d’intérêt » étant réunis. Les fichiers A1 restent dans `public/lib/audio/grammaire/co/<theme>/pisteNNN.mp3` ; les nouveaux A2 sont dans `public/lib/audio/grammaire/co/<theme>/a2/piste_NNN.mp3`, sans collision avec les noms A1. Chaque fichier est identique à celui envoyé (SHA-256 contrôlé), sans découpe ni conversion. L’inventaire [sources.json](sources.json) conserve les identifiants d’envoi, durées, empreintes, chemins et destinations.

## Utilisation

Dans le thème/sous-thème convenu, choisir **Compréhension orale**, puis la piste dans le menu **Audio**. Le réglage **A1 / A2** est propre à l’exercice et sauvegardé avec la piste sélectionnée. Seuls les niveaux possédant leurs propres enregistrements sont activés. Le niveau par défaut est A1 si disponible, sinon A2. Aucune recette A2 ne tire un audio A1 à la place, et inversement.

Se présenter et Famille réutilisent les sous-thèmes existants. Les autres lots sont classés dans leurs contextes dédiés sous les parties convenues : temps, décrire, demander/proposer, conseiller, activités, présent, aliments, espace, questions, faits divers, argumentation et entrer en contact. Les corrections A2 convenues sont conservées : « Centres d’intérêt » avec les loisirs, « Ville ou campagne » dans argumenter, « Prendre soin de soi » dans conseiller, « Entretien d’embauche » et « S’intégrer dans l’entreprise » dans demander/proposer. La table complète est dans `src/grammaire/exercises/co-themes.ts`.

Chaque piste est liée au rendu CO du TCF et possède sa transcription et ses questions. Les anciennes recettes identité/famille sont reconnues et migrées vers le type commun.

## Transcriptions et questions

Deux moteurs locaux, Parakeet et Whisper en français, ont traité les 127 originaux A1 et les 125 originaux A2. Une lecture supplémentaire de Whisper sans jetons d’horodatage a permis de retrouver des débuts de dialogues omis. Les textes ont été relus et corrigés par comparaison, notamment les nombres et les mots français reconnus en anglais. Les annonces parlées de page et d’exercice restent transcrites pour correspondre aux originaux de grammaire.

Le 5 novembre, les 125 pistes A2 ont été comparées entre les deux moteurs et relues. Vingt-deux ont reçu une reconnaissance supplémentaire. Les débuts omis, passages anglais parasites, erreurs de segmentation, orthographe et accords ont été corrigés à partir des lectures disponibles. Les [34 réserves A2 ont ensuite été reprises](revue-34-points-20261105.json) avec Whisper Turbo sur chaque original et huit extractions ciblées. Dix points factuels sont recoupés ; 23 graphies de noms non épelés sont explicitement documentées comme conventions éditoriales, sans prétendre certifier une orthographe officielle. Le téléphone de la piste 078 est rétabli en 06 07 06 07 00. La piste 136 ne permet pas de restituer un numéro complet : la transcription le signale, les chiffres manquants ne sont pas inventés et ne peuvent pas devenir une réponse attendue. Aucun audio n’a été modifié.

Le rapport [transcriptions.json](transcriptions.json) conserve, pour chaque identifiant et empreinte audio, le texte retenu, les reconnaissances brutes, les corrections et les points incertains. Les conventions orthographiques et la limite du numéro de téléphone de la piste 136 restent signalées. Ce travail est une transcription automatique recoupée et relue ; aucune écoute humaine n’est attestée. Les découpes des versions TCF sont suivies séparément.

La banque `src/grammaire/exercises/co-bank.json` conserve les identifiants, enregistrements, transcriptions et recettes sauvegardées. Chaque entrée identifie son thème et son niveau. Le statut `complete` indique que les questions sont disponibles dans le générateur. Le champ `transcriptionReview` documente les contrôles de la transcription.

## Formats disponibles au 27 novembre 2026

| Niveau | Pistes | QCM texte et réponse sur trait | Questions avec QCM image | Scènes de support |
| --- | ---: | ---: | ---: | ---: |
| A1 | 127 | 431 | 176 | 2 |
| A2 | 125 | 188 | 63 | 13 |
| **Total** | **252** | **619** | **239** | **15** |

Les 100 questions initiales ont été relues et associées à leur passage. Vingt pistes A2 qui avaient une seule question en ont maintenant deux. Les ajouts portent notamment sur les consignes de visite, les billets pendant les travaux, la procédure de retour et le contenu d’un message sur un forum. Les questions qui demandaient d’identifier certains noms non épelés portent désormais sur un fait du dialogue. Le [relevé des passages et des réemplois](questions-verification-20261127.json) documente les 607 questions de cette première passe. Le [complément Word](complement-word-20261127.md) a ajouté 12 questions A1.

Whisper large-v3 en français a recoupé des passages ciblés des pistes A1 005, 013, 016 et 116. La comparaison des voix dans la piste 005 attribue les 25 ans à Paolo et les 35 ans à Nicole. La piste 016 confirme le nombre d’enfants, qui devient la réponse attendue. La commande de deux tartes aux fraises de la piste 116 apparaît dans les trois reconnaissances disponibles.

Dans le générateur, les formes **Texte**, **Phrase** et **Image** correspondent au QCM texte, à la réponse sur trait et au QCM illustré. Les 619 questions proposent les deux premières formes et 239 proposent la forme Image. Quinze pistes disposent d’une scène de support. Le [registre des illustrations](illustrations-co-20261127.json) conserve les empreintes et passages associés. Dix trios sont en attente dans le [suivi des choix illustrés](images-a-preparer.json).

Les questions ont été relues sur les transcriptions recoupées. Lors de la première passe, les pistes et les images ont été testées dans le navigateur sur un échantillon des deux niveaux, avec les formes disponibles et l’export PDF. Les 252 pistes ont été décodées intégralement sans erreur. L’écoute de validation et l’approbation enseignante restent à faire.

La scène du conseil professionnel donné à Stéphane a été remplacée après comparaison des personnages. Les 252 pistes et leurs formats figurent aussi dans le catalogue audio de l’application.

## Vérification

```sh
node scripts/audit-grammar-co-import.cjs
```

Le contrôle vérifie les 252 fichiers et leurs empreintes, les 38 liens du catalogue, les transcriptions, la sélection et la sauvegarde de chaque piste au bon niveau, puis les formes de réponse et les références des images. Le script `scripts/build-grammar-co-questions.py` documente la construction de la première passe à partir des transcriptions. La banque active comprend aussi les ajouts Word ultérieurs.
