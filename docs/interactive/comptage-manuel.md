# Comptage et observations

En mode Classe, « Compter » devient disponible après le signal des cartes et reste accessible jusqu’à la correction. Il ouvre six compteurs, avec boutons de 64 px et saisie de 0 à 99. Les cartes inactives sont désactivées ; pour deux questions audio, le choix de question distingue A–C et D–F.

La saisie refuse les décimales, valeurs négatives, valeurs supérieures à 99 et un total supérieur au nombre de présents renseigné. Les valeurs ne sont jamais corrigées silencieusement. Un total nul sans lecture rapide supprime le comptage. Une lecture rapide seule reste qualitative, sans fabriquer de nombres.

« Montrer à la classe » est désactivé par défaut. Le panneau de saisie reste visible sur l’écran partagé lorsqu’il est ouvert ; il ne contient aucune clé de réponse. Une fois fermé, seuls les comptages explicitement partagés sont projetés, avec « Comptage saisi par l’enseignant ». Les comptages n’avancent pas la phase du jeu et ne créent aucune réponse individuelle.

Le bilan associe chaque saisie à sa question. Les comptages non partagés restent repliés jusqu’à « afficher sur cet écran ». Après une correction réellement révélée, le bilan peut indiquer le nombre de votes sur la bonne carte avec « D’après votre comptage ». Aucun pourcentage global de réussite de la classe n’est calculé ; une question sans comptage n’affiche aucun compteur.

Les marques manuelles Réussi / À revoir / Non évalué et les observations (2 000 caractères maximum, sans noms d’élèves) sont journalisées sur cet appareil. Les marques « À revoir » et lectures « Majorité à revoir » alimentent la reprise des questions difficiles. « Revoir le bilan » permet de retrouver le bilan enregistré après rechargement, avant de lancer une nouvelle série. « Terminer » efface la sauvegarde de cette séance comme auparavant ; l’archivage de plusieurs bilans et les badges restent à compléter.

Vérifications : `votes.test.mjs` couvre les validations, les phases, les données qualitatives et le rejeu du journal. `votes-browser.mjs` couvre desktop/mobile, la saisie, le partage explicite, l’absence de révélation, la reprise, le bilan et les cartes inactives des questions appariées. Résultats : `manual-count-results.json`.
