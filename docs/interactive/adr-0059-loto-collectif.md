# ADR 0059 — Loto collectif avec objectifs

La préparation d’une fiche **Jeux › Loto** propose **Loto : grille collective**, avec l’objectif **Une ligne** ou **Grille complète**. Cette variante M12 réutilise les associations image–mot vérifiées du lot animateur. Les associations habituelles restent le réglage par défaut ; les fiches papier et modèles serveur restent identiques.

## Déroulement

Une grille interactive comporte deux à six mots repérés A–F. Chaque image tirée pose une question ; les mots, positions, lettres et couleurs de la grille restent fixes pendant ses tirages. L’ordre des images utilise une graine distincte et ne répète pas de tirage. Les grandes banques conservent toutes leurs associations dans plusieurs grilles. Les options d’ordre mélangé ou personnalisé gardent les tirages d’une même grille ensemble.

En **Classe**, tous votent avec leurs cartes physiques. L’enseignant conduit la discussion et révèle la bonne réponse. La case correcte devient alors cochable ; elle avance l’objectif seulement après sa validation explicite par l’enseignant. La cocher ou la décocher réutilise les appréciations `success` et `unassessed` de la séance. Le verrou et la pause interdisent les modifications. Une correction seule ne produit ni case réussie ni score individuel.

En **Solo**, choisir la bonne case la coche. Une mauvaise réponse ou une expiration ne coche aucune case. Le tirage suivant arrive après le battement réglé de 1 à 10 secondes ; le minuteur de réflexion est facultatif et porte sur chaque tirage. Un mot déjà tiré ne peut pas devenir une réponse à un autre tirage, mais choisir un mot futur par erreur ne consomme pas ce mot.

L’objectif « Une ligne » valide une rangée horizontale complète ; « Grille complète » exige toutes les cases. Le nombre de colonnes est fixé dans les données et reste identique à l’écran, même lorsque l’affichage adapte la police. Une grille de quatre cases utilise deux colonnes ; cinq ou six utilisent trois colonnes. Une dernière rangée incomplète se valide avec toutes ses cases existantes. Atteindre l’objectif conserve les tirages suivants pour continuer à travailler les mots ; l’enseignant peut terminer la séance avec la commande habituelle.

## Sélection, reprise et bilan

La préparation sélectionne des grilles entières, avec tous leurs tirages. Un ancien préréglage ne sélectionnant qu’une partie des questions est étendu aux membres de ses grilles. Le plafond de choix ne supprime aucune case. Si une image indispensable est indisponible et écartée, les tirages de sa grille sont écartés ensemble, avec un signalement, afin de préserver un objectif réalisable.

Les cases cochées sont dérivées des réponses Solo corrigées ou des appréciations explicites de l’enseignant. Aucun nouvel état de plateau parallèle ni format de journal n’est nécessaire. Les marques, options, objectifs et tirages se retrouvent à la navigation, au rechargement et à la reprise. Réessayer un tirage archive son résultat précédent et remet sa marque à zéro ; les autres cases restent conservées. Les lettres de la grille gardent leurs positions.

Le bilan présente les cases cochées et l’objectif de chaque grille, séparément des associations classiques. La feuille enseignant conserve les bonnes lettres. Les images sont utilisables dans une page préchargée sans réseau ; aucune écriture au serveur de fiches n’est ajoutée.

## Sources et limites

Les grilles interactives sont construites depuis le lot animateur, avec les groupes de six existants. Elles ne remplacent pas les combinaisons des grilles élèves imprimées. Les images partagées, les mots répétés, les paires non vérifiées ou les libellés dépassant 24 caractères conservent les questions source avec un signalement, sans association inventée ni texte tronqué. Les autres grilles M12, les salles synchronisées et le démarrage à froid hors ligne restent ouverts. Désactiver cette option retrouve les associations compatibles avec les duels et la compétition.

Les [tests de domaine](../../tests/interactive/loto.test.mjs) vérifient 200 configurations, les objectifs, les gardes, les sélections, les graines, les cases fixes, les reprises et la fidélité du papier. Les [résultats natifs](loto-results.json), la [revue visuelle](loto-proofs/index.html) et le [relevé qualité](quality-loto-results.json) consignent les contrôles réellement exécutés. Les essais sur téléphone physique et ENI restent à effectuer.
