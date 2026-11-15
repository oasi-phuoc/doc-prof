# ADR 0050 — Trier les mots dans des colonnes grammaticales

Ce lot poursuit M08 : une phrase Gattegno complète peut devenir un tableau de catégories manipulable. Dans **Préparer et mémoriser une séance**, l’option **Trier les mots dans des colonnes** remplace les questions mot par mot par une activité par phrase. Elle reste facultative et n’agit pas sur les fiches imprimables. Le parcours à cartes et son évaluation automatique restent disponibles en désactivant l’option.

## Catégories et source

Chaque occurrence garde sa position d’origine : les deux « la » de « Il la regarde dans la cour » peuvent donc être classés séparément comme pronom et déterminant. Les catégories viennent uniquement des étiquettes de la banque, vérifiées avec le corrigé de la fiche. Les inversions, apostrophes, locutions et mots interrogatifs conservent leur contexte et leurs liaisons.

L’adaptateur regroupe seulement les ensembles complets et cohérents d’une phrase. Il conserve tous les éléments, jusqu’à la limite source existante de 64, et toutes les catégories présentes, y compris au-delà de six. Une incohérence ou un ensemble incomplet produit un motif visible et conserve les questions d’origine. Aucun classement n’est déduit de l’orthographe d’un mot.

Les mots publics restent sans étiquette grammaticale. Les colonnes portent les noms et un repère de couleur des catégories ; cela n’indique pas où un mot doit aller. Les catégories attendues par occurrence restent dans le corrigé privé et n’entrent pas dans les journaux.

## Manipulation

Un mot se glisse dans une colonne ou dans **Mots à classer**. Le classement ne change qu’au dépôt ; un relâchement hors du tableau, une interruption tactile, Échap ou la perte de focus annule le geste. L’alternative consiste à choisir un mot puis la catégorie, par deux appuis ou avec les boutons au clavier. Le numéro rappelle la place du mot dans la phrase. **Annuler le classement** restaure le déplacement précédent.

Les commandes restent accessibles avec des cibles d’au moins 44 px sur mobile. Les tableaux denses se parcourent dans la zone de l’activité, avec accès au clavier et lecture intégrale de la phrase et des catégories. La vue mobile ne prétend pas faire tenir sans défilement les 64 éléments et dix catégories possibles. Le plein écran conserve sa commande de sortie.

Le verrou, la pause et la révélation désactivent la manipulation. En Classe, l’activité reste collective, sans sélection obligatoire d’un élève au tableau. En Solo, les placements restent modifiables pendant le temps de réflexion ; la correction suit le délai existant ou l’action de consultation sans minuteur, puis l’avancement automatique habituel.

## Correction

Après révélation, le tableau indique le nombre d’éléments bien classés et ceux laissés à classer. **Voir le classement proposé** conserve la trace de chaque choix, avec ses numéros et son état. **Lire le classement** ouvre la clé complète ; Échap rend le focus au bouton. Le lecteur suspend aussi l’avancement Solo.

Ce résultat partiel décrit la proposition collective ou ouverte. Il ne devient pas un score individuel automatique : l’appréciation **Acquis / À retravailler** est conservée. Les salles et duels à score automatique continuent d’utiliser les questions à cartes ; le tableau guidé est exclu de leur charge publique. La console enseignant locale accepte ce nouveau type et garde le corrigé privé avant sa révélation.

## Sauvegarde et compatibilité

L’action `WORD_SORT_SET` porte l’identifiant de la question, l’écran courant et une liste de catégories choisies ou de valeurs nulles. Le moteur, la relecture des événements et les instantanés valident la longueur, les catégories autorisées et la portée de l’écran. Les placements restent indépendants entre phrases et survivent à la navigation et à la reprise. Une nouvelle tentative repart sans classement.

L’option est conservée dans les préréglages locaux, la préparation, la référence de séance et les transferts existants. Le changement de présentation conserve les phrases sélectionnées : choisir une occurrence puis passer au tableau sélectionne la phrase entière, annoncée dans le réglage ; revenir aux cartes rétablit les occurrences de ces phrases.

Les anciens réglages sans cette option restent valides. La métadonnée privée ajoutée aux questions mot par mot est dérivée de leur clé existante et exclue de leur empreinte pour ne pas invalider les séances déjà enregistrées. Le nouveau tableau et ses véritables clés sont, eux, inclus dans l’empreinte de leur propre plan.

Les [preuves du navigateur](word-sorting-results.json) et le [relevé qualité](quality-word-sorting-results.json) précisent les contrôles réellement exécutés. Les autres sources de tri, un score de tableau partagé entre appareils, le démarrage à froid hors ligne et le pilote physique ENI restent ouverts.
