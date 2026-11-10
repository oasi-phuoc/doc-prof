# ADR 0004 — Graines et répartition des cartes

La version de conversion 2 sépare les graines des distracteurs, des positions, de l’ordre et des reprises avec `deriveSeed`. Les convertisseurs restent déterministes ; seul le contrôleur d’une nouvelle partie tire une graine aléatoire. Le modèle serveur n’est jamais écrasé.

L’identité du contenu utilise un JSON aux clés triées et chaînes normalisées en NFC, puis FNV-1a 32 bits sur les unités UTF-16. Les nombres non finis sont refusés. Vecteurs : chaîne vide → `2166136261`, `a` → `3826002220`, `hello` → `1335831723`. Ce hash ne sert pas à la sécurité. La reprise et la feuille enseignant continuent à vérifier l’empreinte SHA-256 du plan complet.

Après la sélection et la réduction éventuelle des deux questions audio à trois choix, le plan attribue les positions correctes. Pour chaque nombre de choix, les quotas sont ⌊N/n⌋ ou ⌈N/n⌉. Le tirage départage les positions les moins utilisées ; une recherche itérative résout les conflits entre les différents nombres de choix. Cela conserve un écart maximal de 1 et évite trois positions correctes identiques de suite, y compris dans une série mêlant plusieurs nombres de choix. Une limite de préparation empêche une recherche pathologique de bloquer le navigateur. Les IDs, images et textes des choix restent associés ; la clé de réponse ne change pas.

Exceptions sémantiques : Vrai reste A et Faux B ; les références explicites aux lettres restent fixes et passent en compatibilité assistée ; un choix agrégat reconnu (« Aucune de ces réponses », « Toutes les réponses », « Les deux ») est placé en dernier ; un ordre numérique explicitement demandé est conservé. Ces politiques ne participent pas aux quotas des questions mélangées. Le réglage d’ordre croissant dans les presets reste à exposer lorsque les presets seront ajoutés.

Les plans portent la version `plan3` pour distinguer ces positions de celles de l’ancien moteur. Les anciens journaux ne sont pas réécrits. Leur migration et leur inventaire restent à intégrer à F28 ; une partie avec le nouveau plan dispose de son propre journal.

Preuves : `slots.test.mjs`, avec 100 graines pour chacun des nombres de choix de 2 à 6, 100 séries mixtes, une série de 5 000 questions, les politiques d’ordre, les vecteurs de hash, le JSON canonique et la présence de la bonne réponse malgré une longue liste de distracteurs. La feuille enseignant et le jeu utilisent le même plan résolu.
