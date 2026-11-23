# Mise en forme des fichiers CE et CO

Préférence du propriétaire, 23 novembre 2026 : textes et transcriptions lisibles sur des lignes d’environ 60 à 80 caractères dans les fichiers JSON ; objets de réponse compacts ; un choix par ligne. Cette présentation concerne les fichiers source, pas les retours à la ligne imprimés.

Appliquer le format après une modification des banques :

```sh
npm run format:comprehension
npm run test:comprehension:json
```

Le formateur traite les six fichiers CE/CO des niveaux A0-A1, A1-A2 et A2-B1, ainsi que la banque CO de grammaire. Le fichier CE A2-B1 est actuellement vide et reste vide. Aucun exercice, enregistrement, choix ou modèle n’est supprimé.

## Un seul enregistrement

Un texte long devient un tableau de fragments. Les espaces de liaison sont conservés au début des fragments suivants, afin de restituer le texte exact :

```json
"transcription": [
  "Bonjour, voici le début du message et sa première information.",
  " La suite du message conserve son espace de liaison."
]
```

Les éventuels retours à la ligne originaux du texte restent encodés par `\n`. Les retours ajoutés pour éditer le JSON ne créent aucun paragraphe dans le document affiché. La longueur visée est de 80 caractères avec l’indentation ; une dernière ligne courte ou un mot indivisible peut faire exception. Les mots ne sont jamais découpés.

Le champ `support.texte` d’une CE suit la même règle. Les lecteurs reconstruisent les fragments avant validation ou utilisation.

## Plusieurs pistes

Le tableau extérieur reste aligné sur les pistes. Chaque piste possède son propre texte ou tableau de fragments :

```json
"audios": ["/piste-1.mp3", "/piste-2.mp3"],
"transcription": [
  ["Premier document.", " Suite du premier document."],
  ["Deuxième document.", " Suite du deuxième document."]
]
```

Il ne faut pas réunir les textes de plusieurs pistes en un seul texte. Le lecteur restitue le format utilisé par l’application : une chaîne pour une piste, une chaîne par piste pour plusieurs enregistrements.

## Réponses

```json
"lignes": { "nb_lignes": 2, "reponse_modele": "Un modèle de réponse." },
"qcm_texte": { "melanger": true, "choix": [
  { "id": "a", "texte": "Première réponse", "correct": true },
  { "id": "b", "texte": "Deuxième réponse" },
  { "id": "c", "texte": "Troisième réponse" }
] }
```

Les variantes `qcm_image` suivent la même présentation. Les identifiants, propriétés de correction, images, annotations, modèles et associations aux pistes restent conservés.

## Lecture par les outils

Le lecteur partagé est `src/tcf/editorial-json.mjs`. Les chargements TCF et CO de grammaire reconstruisent les textes avant d’exposer les exercices. Les scripts Node utilisent `parseEditorialJson` ; les outils Python disposent du lecteur équivalent dans `scripts/audio_replacement/editorial_json.py`. Les anciens textes stockés dans une chaîne restent acceptés.

La preuve de conservation est enregistrée dans [format-json-ce-co-20261123.json](format-json-ce-co-20261123.json). Pour cette migration, les tests comparent les valeurs décodées aux banques du commit de référence : textes, espaces, paragraphes, questions, modèles et ordre des pistes sont identiques. Les éditions ultérieures restent possibles : après relance du formateur, les contrôles vérifient que la mise en forme conserve les nouvelles valeurs. Le rapport distingue cette conservation de la correspondance avec la base initiale. Le contrôle historique de la CO de grammaire reste actif : seul l’ajout du lecteur de fragments et cette mise en forme sans modification de contenu sont autorisés par cette transition.
