# ADR 0044 — Précharger toute une séance Classe ou Solo

Le bouton **Précharger toute la séance**, dans la préparation, charge les images, les pistes audio simples, tous les extraits des pistes composées et les 30 mascottes. L’enseignant peut ensuite couper la connexion et jouer dans la page ouverte. Cette extension réalise le préchargement manuel F40 du cahier V4 ; elle n’ajoute ni service worker ni démarrage à froid hors ligne.

## Préparation et limites

Le précontrôle habituel conserve ses exclusions de questions aux médias absents ou illisibles. Le préchargement porte sur la sélection effectivement retenue. Il déduplique les adresses et traite quatre fichiers en parallèle. Chaque réponse est lue intégralement, avec un délai de huit secondes par fichier, un plafond de 32 Mio par fichier et de 128 Mio pour le lot. Le type, le décodage et les images de grammaire adressées par SHA-256 sont vérifiés avant de publier le lot.

La progression affiche le nombre de fichiers terminés et le poids réel téléchargé. **Prêt à jouer sans connexion** apparaît seulement après validation de tous les fichiers. Une erreur, un dépassement ou l’annulation libère les adresses temporaires déjà créées. L’échec ne bloque pas le parcours normal avec connexion ; le lancement reste désactivé pendant le préchargement en cours. L’utilisateur peut réessayer ou libérer explicitement un lot prêt.

## Plans et sauvegardes inchangés

Les médias restent en mémoire dans l’onglet. Un contexte de rendu traduit les références sources vers les adresses temporaires ; les questions, leurs identifiants, les clés, la graine et les journaux ne sont pas réécrits. Le lecteur conserve les quotas et les événements d’écoute : préparer un audio ne consomme pas d’écoute.

Le contrôle et le préchargement de l’écran suivant utilisent aussi les fichiers préparés. Revenir à la préparation après expiration du cache de précontrôle reste possible sans réseau. Le zoom, les images de grammaire avec vérification de contenu, les 30 choix de mascotte et l’incorporation des images dans la feuille enseignant utilisent ce même lot. Les contrôles de lisibilité hors écran reçoivent également le contexte de médias.

La validité du lot dépend des ressources publiques nécessaires, indépendamment de l’ordre des cartes et du corrigé. Une bascule Classe / Solo, un nouveau texte ou une nouvelle graine utilisant les mêmes fichiers peut garder le lot. Une sélection demandant d’autres ressources l’invalide et libère l’ancien lot. Quitter la page le libère aussi. La sauvegarde ne contient aucune adresse `blob:` ; reprendre après rechargement nécessite de préparer de nouveau les médias avec une connexion.

## Vérifications

Dix tests de domaine couvrent les ressources publiques et les alternatives fausses, les extraits composés, les 30 mascottes, les tailles réelles, les quatre travailleurs, les limites déclarées et diffusées, les erreurs de type, les réponses vides, l’annulation et les réponses tardives, les références de grammaire, l’expiration du cache et la libération des ressources. Les suites existantes des médias et séquences audio sont conservées.

`full-preload-browser.mjs` utilise des fichiers image et audio existants et une situation technique de grammaire explicitement hors banque publiée. Il vérifie Classe et Solo sur trois tailles d’écran, avec une coupure réseau après préparation : lecture effective des nombres et d’une addition, zoom, changement de mascotte, correction, bilan, reprise et feuille enseignant autonome. Le parcours est intégré à l’orchestrateur commun. Voir `full-preload-results.json` et `quality-full-preload-results.json` pour les contrôles réellement exécutés.

## Conservation locale après fermeture

Une fois le préchargement complet, **Conserver les médias sur cet appareil** permet de stocker volontairement un seul lot dans IndexedDB. Il reste disponible sept jours dans le même navigateur. Le contrôle retire les lots expirés à la prochaine ouverture. La préparation permet d’effacer ce lot et l’effacement global des données du jeu le retire aussi.

Le lot contient les fichiers déjà décodés et leurs adresses publiques. La limite de 128 Mio s’applique à l’ensemble et celle de 32 Mio à chaque fichier. Un lot peut inclure uniquement des médias publics provenant de ClairFLE. Les documents, les plans, les corrigés et les informations de connexion suivent leurs parcours propres.

À l’ouverture du jeu, le navigateur peut activer le lot lorsque sa connexion est coupée. Avec une connexion détectée, les adresses ordinaires sont utilisées par défaut et **Utiliser les médias conservés** permet de basculer pour la visite. Une fiche enregistrée peut encore demander une connexion pour être ouverte. Le test Chromium conserve l’accès à l’application locale et coupe les requêtes de médias après fermeture. L’ouverture de l’application entièrement hors ligne reste une étape séparée.
