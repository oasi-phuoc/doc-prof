# Catalogue des audios

Le bouton en forme de casque, immédiatement à gauche du catalogue des images, ouvre `/audios`. L’accès suit celui du créateur de fiches et de la galerie des images.

## Utilisation

- Rechercher un mot ou une expression, avec ou sans accents, puis combiner les filtres thème, type d’audio, collection, niveau et contenu associé.
- Écouter une piste, afficher sa transcription et ses questions, télécharger son fichier d’origine ou son document Word.
- Sélectionner plusieurs pistes, éventuellement sur plusieurs pages ou avec plusieurs filtres. La sélection reste conservée lorsque la recherche change.
- Télécharger la sélection, les résultats ou un thème en ZIP. L’option « Inclure un fichier Word par audio » est activée par défaut.

Le Word contient la transcription enregistrée dans les banques, les consignes, **toutes les questions préparées et leurs formes de réponse**. Les choix illustrés sont dans des tableaux, avec les images intégrées, les lettres et les cases à cocher vides. Les choix en texte, les réponses écrites et les associations sont également conservés. Les corrigés et réponses modèles sont regroupés à la fin. Le document reste utilisable après le téléchargement sans connexion aux images du site.

[Exemple Word téléchargé pendant le test navigateur](exemple-audio-questions.docx).

## Données disponibles

L’index du 27 novembre 2026 contient **9 079 fichiers audio** servis depuis `public/lib/audio`, répartis entre TCF, grammaire, vocabulaire, soutien français, syllabes et nombres. Il recense :

- 5 101 pistes avec un texte de transcription renseigné ;
- 1 434 pistes avec des questions préparées ;
- 6 869 questions et 15 882 formes de réponse.

Les textes et les questions proviennent des banques existantes. L’absence d’une transcription ou d’une question rattachée est indiquée dans la page et le document Word. Aucune nouvelle reconnaissance vocale, synthèse audio ou question pédagogique n’est créée par le catalogue.

Les banques TCF sont lues intégralement, avant tout tirage de fiche. Pour les supports à plusieurs pistes, les transcriptions et les questions sont reliées à leur piste précise. Les remplacements audio suivent les correspondances utilisées par les fiches ; une ancienne piste physique reste identifiable et ne reçoit pas le texte de sa remplaçante. Les 346 supports DELF Actif nouvellement installés sont également indexés avec leurs 1 663 questions et leurs transcriptions. Le détail de cet ajout est dans [le compte rendu de l’import](../tcf/delf-actif-20261113/README.md). Les préparations non installées ne sont pas présentées comme disponibles.

Les **806 pistes TCF renommées** ont un titre rédigé d’après la situation, l’action ou le sujet de leur transcription. La reprise du 27 novembre a ajouté 263 titres, dont douze extraits encore numérotés et 21 pistes dont le titre était partagé par des situations distinctes. « Piste 54 — 2 » apparaît désormais comme « Les lectures universitaires avant de dormir ». Le titre est utilisé dans le catalogue, le sélecteur TCF et les téléchargements de la bibliothèque. Les fiches et les lecteurs identifient les enregistrements par leur adresse audio. [Registre des titres](../../src/tcf/content/audio-titles.json).

La catégorie **Réussir DELF A1** contient 44 extraits aux noms de fichiers descriptifs, avec 135 questions et 38 variantes illustrées. Elle est disponible dans le filtre Thème. [Suivi du lot Réussir DELF A1](../tcf/reussir-delf-a1-20261127/README.md).

## Régénération et limites

`npm run audio:index` reconstruit l’index et les détails par collection. La même génération précède `npm run dev` et `npm run build`. Les détails sont chargés à la demande, avec une version liée à leur contenu. Les lecteurs ne préchargent pas les enregistrements.

`python3 scripts/audio-catalog-spoken-texts.py` permet, si nécessaire, de retrouver les textes exacts des phrases de soutien à partir des modèles du générateur historique et des fichiers déjà présents. Ce script ne génère aucun son. Ses métadonnées sont enregistrées dans le dépôt ; Python n’est pas requis pour la génération Node habituelle.

Le ZIP utilise les dossiers d’origine. Pour les pistes renommées, le MP3 et le Word prennent le même nom descriptif et, en cas de collision, le même suffixe distinct. Les pistes et documents sont préparés successivement. Quand le navigateur permet l’enregistrement direct sur disque, l’archive est écrite au fur et à mesure. Sinon, le téléchargement habituel utilise une limite de 512 Mio et invite à choisir des groupes plus petits au-delà. L’annulation interrompt la préparation. Une image annoncée comme disponible mais impossible à récupérer fait échouer le Word avec un message d’erreur.

## Vérification

```sh
npm run test:audio-catalog
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:audio-catalog:browser
```

Les tests contrôlent notamment la couverture de toutes les questions TCF, les liens par piste, les formes de réponse et les vrais fichiers OOXML. Le parcours navigateur lit un enregistrement réel, vérifie les octets des téléchargements, les images intégrées dans le Word, le ZIP, l’enregistrement progressif, le repli du sélecteur de fichier, les erreurs, l’annulation, la navigation et l’accessibilité à 390 et 1 440 px.

Résultats : [navigateur](browser-results.json), [contrôles du lot](quality-results.json), captures [mobile](screenshots/catalogue-390.png) et [ordinateur](screenshots/catalogue-1440.png).
