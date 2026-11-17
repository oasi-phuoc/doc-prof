---
name: catalogue-images
description: Nommer et indexer les illustrations de Clair FLE à partir de leur contenu visuel, lors de leur génération, réemploi ou correction dans le catalogue du projet doc-prof.
---

# Noms et recherche des illustrations

L’utilisateur demande des noms et mots-clés fondés sur le contenu de chaque image. Appliquer cette règle à toute nouvelle génération, réutilisation ou modification du catalogue.

- Examiner le fichier final avant de rédiger son nom et ses mots-clés. Le prompt décrit une intention ; il ne prouve pas le contenu du résultat.
- Donner un titre français court et descriptif : « Citadine verte devant une maison », « Deux femmes à l’accueil d’un musée ». Ajouter un qualificatif utile pour distinguer les variantes.
- Décrire les sujets visibles, leurs catégories usuelles, actions, couleurs, nombres utiles et éléments du décor. Ajouter des synonymes français pertinents. Exemple de la citadine : voiture, citadine, automobile, vert, verte, véhicule, transport, rue, maison, arbre, extérieur, avec décor.
- Ne pas importer dans les mots-clés les thèmes de cours, niveaux, collections, identifiants d’exercices, questions, distracteurs ou transcriptions associés au réemploi. Une voiture utilisée pour un exercice sur une fête n’a pas le mot-clé « fête » si aucune fête n’est visible.
- N’attribuer aucune nationalité, identité, profession ou autre caractéristique non établie par le visuel ou un contexte explicite pertinent. Pour les dialogues, appliquer aussi les règles de concordance audio/image et d’interlocuteurs du projet ; signaler toute écoute non effectuée.
- Les métadonnées de provenance et de classement peuvent être conservées séparément. Elles ne doivent pas élargir la recherche visuelle.
- Enregistrer le titre, les mots-clés, le chemin et l’empreinte du fichier dans le registre de métadonnées visuelles du catalogue. Une modification des pixels invalide la revue précédente. Ne pas déclarer une revue visuelle à partir du seul nom de fichier.
- Les noms affichés et ceux des téléchargements doivent être lisibles. Lors d’un renommage physique, mettre à jour toutes les références et les alias nécessaires aux fiches déjà enregistrées.
- Régénérer le catalogue avec `node scripts/image-gallery-catalog.mjs`, puis contrôler que les recherches attendues trouvent l’image et qu’un terme provenant uniquement d’un exercice ne la trouve pas.

Conserver le style TCF, le format et les critères de diversité définis dans `docs/tcf/style-images.md`. La génération d’images suit le skill imagegen disponible dans la session.
