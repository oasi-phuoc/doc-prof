# ADR 0014 — Associations source et phrases manipulables

Décision du 11 novembre 2026 : ajouter trois adaptateurs sans changer les banques ni le rendu papier.

Les associations `audio-order` deviennent une question par enregistrement, avec mots ou images issus des cases source. Les numéros de correspondance doivent former une permutation cohérente ; une piste manquante ou un mot contradictoire est signalé. Au-delà de six propositions, seuls des distracteurs source sont retenus avec la réponse prévue. Deux questions correspondant au même son peuvent partager l’écran de Classe, avec leur corrigé séparé dans les cartes.

Le générateur d’alphabétisation utilise parfois l’audio d’un mot entier quand l’enregistrement de la syllabe manque. Cet état connu devient une activité ouverte avec modèle et appréciation humaine. Une même piste associée à plusieurs mots différents reçoit aussi ce repli : aucun verdict automatique n’est fabriqué.

Les paires `vocab-match` deviennent des micro-questions indépendantes. Les choix proviennent uniquement de la colonne de droite. Une association non univoque devient guidée. Pour les parties de mots, le mot complet doit être vérifiable dans la réponse source et correspondre à la concaténation des deux parties : la question montre ce mot et un blanc, par exemple « Complète “amazone” : ama___ ». Cela adapte l’objectif de la fiche à la lecture des parties. Les réponses déjà utilisées ne sont pas retirées automatiquement ; l’association complète M06 avec élimination et bilan par groupe reste une extension.

Les phrases `phrase-order` de deux à six éléments deviennent manipulables. Les jetons affichés, les libellés source et le modèle doivent être cohérents. Toucher un mot puis une autre place les échange ; les flèches du clavier déplacent le mot ciblé. Annuler revient au dernier déplacement dans cet écran. L’ordre proposé est conservé pendant navigation, rechargement, export et reprise. Les doublons gardent des identifiants distincts. Le modèle n’entre dans le DOM qu’après révélation ; d’autres formulations peuvent être correctes, donc l’évaluation reste humaine. Les phrases plus longues ne sont jamais tronquées.

L’état utilise le champ de permutation existant, validé contre le nombre d’images ou de mots. Aucun changement de schéma de séance n’est nécessaire. Les positions source et graines des convertisseurs déjà présents restent inchangées ; un plan dont le contenu évolue est protégé par son empreinte complète.

Vérification : sept tests supplémentaires, sources réelles du catalogue, cohérence avant/après du rendu de fiche, et parcours mobile / desktop dans [source-adapters-results.json](source-adapters-results.json). Le nouvel inventaire trouve 471 variantes avec activité sur 2 081, contre 190 auparavant. Il s’agit d’un tirage par type et non d’une recette pédagogique exhaustive. La capture A4 de référence reste identique.
