# ADR 0058 — Mémory avec cartes retournées

La préparation des fiches **Jeux › Vocabulaire** et **Jeux › Mémory** propose l’option **Mémory : cartes retournées**. Elle réutilise les associations image–mot vérifiées par les numéros de paire imprimés. Les associations habituelles restent le réglage par défaut. Les fiches papier et les modèles serveur sont conservés.

## Plateau et validation

Chaque plateau contient deux ou trois paires, soit quatre ou six cartes repérées A–F avec les couleurs et formes de l’appareil. Une banque de quatre paires produit deux plateaux de deux paires ; une banque de neuf en produit trois de trois paires. Le partage est équilibré et conserve toutes les associations. Le plafond des choix QCM ne retire aucune carte du Mémory. Activer l’option regroupe la sélection par plateau ; la désactiver retrouve ses questions source.

En **Classe**, l’enseignant retourne les deux cartes proposées collectivement. Elles restent neutres jusqu’au bouton **Valider la paire**. Une paire juste reste découverte et cochée ; une paire fausse reste visible pour l’observation jusqu’au retournement d’une autre carte. **Annuler le choix** referme une proposition non validée sans ajouter d’essai. La correction globale et le passage suivant restent conduits par l’enseignant. Aucun résultat individuel n’est déduit du travail de la classe.

En **Solo**, la deuxième carte déclenche la vérification. Une erreur compte une fois et les deux faces se referment au choix d’une autre carte. La dernière paire trouvée déclenche la correction, la mascotte de réussite et le battement réglé de 1 à 10 secondes. Le minuteur de réflexion reste facultatif et porte sur le plateau entier. Toutes les paires retrouvées donnent un plateau réussi, même après des erreurs ; un plateau incomplet à l’expiration du temps est à revoir. Les essais et erreurs sont affichés séparément de ce résultat.

Les boutons fonctionnent au doigt, à la souris, par Tab et Entrée/Espace. Les lettres A–F fonctionnent quand le focus est dans le plateau. La face cachée n’ajoute ni image ni mot au DOM ou à son nom accessible. Après correction, un numéro commun identifie les deux faces de chaque paire, sans liste de réponses en double.

## Reprise et données

Les actions `MEMORY_FLIP`, `MEMORY_CHECK` et `MEMORY_CANCEL` identifient l’écran, la question et la tentative. Pause, verrou, correction, écran quitté et ancienne tentative interdisent les écritures. Les cartes trouvées, les faces ouvertes et les compteurs passent par la sauvegarde existante ; les états sont copiés et validés lors de la reprise ou de la compaction. Une nouvelle tentative archive le précédent plateau, remet ses compteurs à zéro et mélange les positions de façon reproductible.

Le journal conserve seulement les identifiants des cartes et les compteurs, sans faces, fichiers temporaires ni table des bonnes paires. Le validateur refuse les paires trouvées incohérentes, les compteurs impossibles et les résultats Solo incompatibles avec le plateau. Les préréglages et adresses de séance mémorisent l’option. Les anciens plans sans cette option gardent leur identité.

Les mots répétés, images partagées, associations non vérifiées ou libellés dépassant 120 caractères conservent leurs questions source avec un signalement. Aucune association n’est déduite du nom de fichier. Le moteur accepte jusqu’à 1 000 essais par plateau.

## Vérification et limites

Les [tests de domaine](../../tests/interactive/memory.test.mjs) couvrent les deux banques réelles sur cent configurations, la conservation du papier, les graines, les sélections, les préréglages, les validations Classe/Solo et les sauvegardes. Les [parcours natifs](memory-results.json), la [revue visuelle](memory-proofs/index.html) et le [relevé qualité](quality-memory-results.json) précisent les vérifications exécutées.

Le plateau et ses commandes sont inclus dans le jeu chargé ; les faces utilisent les médias préchargés. Le jeu dans une page déjà préparée fonctionne sans réseau. Le démarrage à froid hors ligne, les autres familles de paires, les plateaux Mémory synchronisés entre appareils et les règles complètes du Loto M12 restent ouverts. Les salles et duels continuent d’utiliser les questions à choix existantes ; activer le Mémory ne transforme pas ces nouveaux plateaux en questions de compétition.
