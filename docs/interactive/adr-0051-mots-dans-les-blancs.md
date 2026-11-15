# ADR 0051 — Déposer un mot dans une phrase à compléter

Le lot M05 transforme un blanc explicite de certaines questions à cartes en zone de dépôt. La phrase, les propositions et le corrigé viennent de la fiche source ; aucune réponse supplémentaire n’est créée.

Les complétions de grammaire à choix, les paires grammaticales et les répliques fermées sont admissibles uniquement si leur texte contient exactement un `___`. Les associations de syllabes gardent le mot complet source et leurs six propositions. Une question ordinaire, plusieurs blancs, un choix avec média ou un texte trop long conservent les cartes habituelles. L’échantillonnage automatique de 450 blancs dans 97 banques ne change pas le statut de relecture pédagogique de ces banques.

Le déplacement fonctionne à la souris et au doigt. L’aperçu sur le blanc ne modifie pas la proposition avant le relâchement ; sortir de la cible, une interruption tactile, Échap ou la perte de focus annule le geste. Les cibles mesurent au moins 44 px. Le clavier et les appuis restent disponibles : en Classe, choisir une carte puis le blanc ; en Solo, toucher une carte répond directement.

En Classe, déposer un mot est facultatif et ne désigne aucun élève au tableau. La proposition ne produit ni sélection individuelle, ni verdict, ni changement de phase. Toucher le blanc rempli retire le mot proposé. La pause, le verrou et la révélation bloquent les modifications. L’enseignant révèle la correction avec les commandes habituelles.

En Solo, le dépôt utilise l’action de sélection existante : correction immédiate, félicitations ou larmes, puis question suivante après le délai réglé. L’absence de réponse à la fin du minuteur reste fausse. La bonne carte reste en couleur et les autres deviennent grises ; aucun corrigé supplémentaire n’est ajouté près de la mascotte. Le blanc conserve la proposition de l’élève et ne remplace pas discrètement une erreur par la réponse attendue.

La métadonnée publique `wordBlank` contient seulement les deux morceaux de la phrase autour du blanc. Elle est dérivée du texte source et exclue de l’empreinte du plan pour conserver les séances antérieures. L’action `WORD_DROP_SET` mémorise uniquement l’identifiant d’un choix proposé en Classe. Le moteur, les événements et les instantanés vérifient la question, le choix, le mode et l’écran courant. La proposition survit à la navigation et à la reprise ; une nouvelle tentative la réinitialise.

Les salles, duels et défis conservent leurs cartes et leurs règles de score existantes. Les fiches imprimées et les modèles enregistrés restent identiques. Le [parcours navigateur](word-drop-results.json) et le [relevé qualité](quality-word-drop-results.json) précisent les contrôles exécutés. Les autres formes de trous, le démarrage à froid hors ligne et la validation sur ENI réel restent ouverts.
