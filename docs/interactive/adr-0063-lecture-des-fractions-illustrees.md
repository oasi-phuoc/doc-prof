# ADR 0063 — Lire les fractions illustrées

Les exercices **TPM → Lire les fractions** et **TCM CFR → 13 — Lire les fractions** rejoignent le choix direct des exercices. Ils peuvent se mélanger avec les autres domaines d’un pool, sans créer de fiche. Le catalogue certifié passe de 694 à 696 types ; l’inventaire observe désormais 757 variantes avec une activité sur 2 150.

Le jeu conserve la forme et les parties coloriées de chaque tirage : rectangle, carré, triangle, disque, demi-disque, quart de disque et hexagone. Le même composant SVG que les fiches trace les partitions ; le remplissage du jeu est plus contrasté pour la projection. Aucun générateur, rendu ou réglage des fiches imprimables n’est modifié.

L’adaptateur vérifie une seule figure, le mode lecture, le nombre de parts autorisé pour sa forme et la concordance exacte du corrigé. Les triangles et hexagones sont limités à leurs découpages en parts égales. Un découpage inconnu, une figure multiple ou un corrigé contradictoire produit une raison explicite et ne devient pas une question automatique.

La question demande « Quelle fraction est coloriée ? ». Les six propositions ont des valeurs mathématiques distinctes, comprises entre zéro et un. La notation du corrigé source est conservée, même si elle n’est pas réduite. Les propositions fractionnaires sont verticales ; le tri croissant et les plafonds de deux à six choix comparent les valeurs exactement, sans arrondi.

Classe conserve la révélation enseignante et la correction dans les cartes. Solo conserve le choix immédiat, le délai facultatif et le battement automatique. La figure et ses cartes se retrouvent après reprise ; une nouvelle partie renouvelle la graine du pool sans modifier son modèle. La feuille enseignant reçoit une description de la forme et de ses parties coloriées dans les notes.

Les défis locaux, duels et salles transportent seulement la forme connue et un tableau de parties visibles. Aucun SVG arbitraire, balise de correction ou champ de réponse n’est accepté dans cette représentation. Le serveur remplace les identifiants source et conserve sa clé privée jusqu’à la correction. La figure est décrite aussi pour les lecteurs d’écran.

Le dessin est chargé dans un module différé pour respecter le budget des salles. Le précontrôle et les préparations hors connexion attendent ce module avant de déclarer le jeu prêt. L’identité du préchargement inclut ce besoin. Une indication animée garde sa place pendant le chargement ; sur les téléphones, sa taille est adaptée pour rester entière. Sur les écrans courts, elle se place à côté de la question, comme en duel paysage court, au-dessus des mascottes et de leurs auras.

## Compatibilité du serveur des salles

Le Worker annonce `fraction-figures-v1` dans les fonctionnalités de `GET /competition/status`. Avant de créer une salle contenant ces figures, le client vérifie cette prise en charge, sans envoyer de clé. Un ancien serveur qui supprimerait ce nouveau champ ne peut donc pas créer une partie privée de son illustration : un message demande sa mise à jour. Les anciens exercices gardent leur protocole de création.

Une mise à jour du Worker existant est nécessaire pour utiliser cette activité dans les salles de production. Elle ne demande ni nouvelle variable Vercel, ni nouvelle clé, ni migration de stockage. Les contrôles utilisent le Worker réel dans `workerd` avec SQLite local ; aucun déploiement de production n’est effectué par ce lot.

## Contrôles et limites

Les [tests de domaine](../../tests/interactive/fraction-figures.test.mjs) parcourent 600 configurations source et tous les découpages autorisés, y compris les limites zéro et un. Ils comptent les parties dessinées, vérifient les aires des polygones, les cartes distinctes, la reprise, les nouvelles graines et le refus des données incohérentes. Le [parcours navigateur](../../tests/interactive/fraction-figures-browser.mjs) couvre les mélanges de domaines, Classe, Solo, le défi local et les duels. Les résultats et captures sont rassemblés dans le [relevé du lot](quality-fraction-figures-results.json).

Les activités de coloriage et les figures multiples restent à adapter. Les calculs composés TPM, le démarrage à froid hors connexion et les essais sur un téléphone ou un ENI physique restent ouverts.
