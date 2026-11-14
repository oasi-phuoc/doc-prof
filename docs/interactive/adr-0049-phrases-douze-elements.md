# ADR 0049 — Remettre en ordre jusqu’à douze éléments

Ce lot poursuit M07 et la demande du propriétaire de déplacer les mots dans des zones. Les phrases de sept à douze éléments rejoignent les activités guidées du jeu, sans raccourcir leur contexte ni fabriquer une réponse. Les formats source `phrase-order` et `order` avec consigne explicite de phrase utilisent le même adaptateur.

## Source et appréciation

Chaque occurrence reste distincte, y compris deux mots identiques. Le convertisseur vérifie le même ensemble de mots dans la proposition et le corrigé, ainsi que la cohérence du modèle. Les liaisons des interrogations matérialisées, comme `-t-il`, sont conservées. Une liste incohérente, plus de douze éléments, un élément de plus de 120 caractères ou un total de plus de 1 200 caractères produit une incompatibilité explicite. Aucun mot n’est supprimé pour rendre la phrase compatible.

Le §54 de V4 prévoit deux à six éléments pour M07 avec prédiction A–F, puis un découpage au-delà. Cette extension concerne la manipulation de la phrase complète avec appréciation humaine : elle ne crée ni douze cartes de vote ni prédiction. Les autres ordres possibles ne sont pas évalués automatiquement. Le modèle reste privé avant la révélation ; l’enseignant peut ensuite marquer **Acquis** ou **À retravailler**. Les compétitions à score automatique excluent ces activités ouvertes.

## Manipulation et lecture

Les grandes phrases occupent quatre colonnes sur ordinateur et trois sur mobile. La mesure de lisibilité ajuste chaque mot à sa case, sans descendre sous 14 px sur mobile ou 18 px sur ordinateur. Les textes libres exceptionnellement longs peuvent revenir à la ligne ; **Lire tous les mots** conserve un accès intégral à la proposition et à la consigne. Ce lecteur ne contient pas le modèle privé.

Un glissement insère le mot à la place visée. Deux appuis sélectionnent un mot puis sa destination ; le tactile active directement le bouton de sélection après capture du pointeur, sans dépendre du clic de compatibilité parfois omis par Chromium. Les boutons d’agrandissement des images gardent leur fonction. L’annulation, les flèches du clavier, Échap, les dépôts hors des zones et le verrou enseignant utilisent le moteur de déplacement existant.

Après révélation, la proposition est présentée en texte à côté du modèle, avec les apostrophes et liaisons réunies. Sur mobile, cette présentation réserve la place à l’appréciation humaine. Le menu de séance tient sur une ligne à 360 px et le mode immersif garde uniquement la sortie du plein écran.

## Persistance et limites

Les douze indices passent par `IMAGE_ORDER_SET`, sa validation de permutation et les journaux existants. Navigation, reprise et instantanés conservent l’ordre. L’annulation locale et le geste en cours ne deviennent pas des données persistantes. La recette source et le rendu imprimable restent inchangés. Si une ancienne séance utilisait un plan sans ces phrases, la protection d’obsolescence demande une nouvelle préparation ; son journal n’est pas migré silencieusement.

Le préchargement permet la manipulation dans une page déjà ouverte sans connexion ; le démarrage à froid hors ligne reste ouvert. Le classement par rang, les séquences d’images, les règles M11/M12 et le pilote physique ENI ne sont pas déclarés achevés par ce lot. Voir les [preuves du parcours](long-word-order-results.json) et le [relevé qualité](quality-long-word-order-results.json).
