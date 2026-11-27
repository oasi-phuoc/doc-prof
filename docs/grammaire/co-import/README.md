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
| A1 | 127 | 419 | 62 | 0 |
| A2 | 125 | 155 | 9 | 5 |
| **Total** | **252** | **574** | **71** | **5** |

Les 100 questions déjà présentes ont été conservées. Les 474 nouvelles questions sont rattachées à un passage de la transcription. La banque réutilise les questions TCF lorsque le dialogue correspond et propose des questions rédigées pour les autres pistes. Le [relevé des passages et des réemplois](questions-verification-20261127.json) permet de retrouver chaque réponse ajoutée.

Dans le générateur, les formes **Texte**, **Phrase** et **Image** correspondent au QCM texte, à la réponse sur trait et au QCM illustré. La forme Image est disponible lorsque trois illustrations distinctes correspondent aux choix. Cinq pistes A2 affichent aussi une scène de dialogue, dont quatre nouvelles illustrations et un réemploi. Les scènes et les choix intégrés ont été examinés visuellement et suivent le [référentiel graphique TCF](../../tcf/style-images.md). Le [registre des illustrations](illustrations-co-20261127.json) conserve les sources, les empreintes et les passages associés.

Les questions ont été relues sur les transcriptions recoupées. Les pistes et les images ont été testées dans le navigateur sur un échantillon des deux niveaux, avec les formes disponibles et l’export PDF. L’écoute de validation et l’approbation enseignante restent à faire.

## Vérification

```sh
node scripts/audit-grammar-co-import.cjs
```

Le contrôle vérifie les 252 fichiers et leurs empreintes, les 38 liens du catalogue, les transcriptions, la sélection et la sauvegarde de chaque piste au bon niveau, puis les formes de réponse et les références des images. Les nouvelles questions et le rapport peuvent être régénérés avec `python3 scripts/build-grammar-co-questions.py`.
