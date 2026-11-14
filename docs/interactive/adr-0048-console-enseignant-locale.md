# ADR 0048 — Console enseignant dans une seconde fenêtre

Le §57.3 du cahier V4 prévoit une console locale P1 sur le même navigateur et le même appareil. En mode Classe, l’icône d’écran **Ouvrir la console enseignant** ouvre une fenêtre explicitement marquée **Enseignant — ne pas projeter**. L’enseignant la place sur son écran en affichage étendu et conserve la projection sur l’ENI. Le plein écran de la projection continue de masquer les commandes du menu.

## Projection seule autorité

La console ne charge pas de fiche, ne prend aucun verrou de séance et n’écrit aucune sauvegarde. Elle reçoit un instantané privé de l’écran courant : corrigés, modèles complets, transcriptions explicitement liées et relances. La lettre, la forme et la couleur de la bonne carte correspondent aux positions de la tentative courante, y compris pour les deux questions audio A–C / D–F et les nouvelles tentatives mélangées.

La communication utilise `BroadcastChannel`, sur un nom contenant un identifiant aléatoire de l’instance de projection et un second UUID éphémère. L’adresse de la console ne contient que ces identifiants dans son fragment, sans corrigé ni recette. Le lien `opener` est supprimé. Ces identifiants ne sont pas une authentification distante : le périmètre reste le même navigateur, la même origine et le même appareil.

Les commandes ont un protocole limité et validé ; aucune action arbitraire du reducer ni état de remplacement n’est accepté. Une révision monotone, un identifiant de commande et les vérifications de phase, d’écran, de verrou et de propriété évitent d’appliquer deux fois une commande ou de l’appliquer à une question qui a changé. La projection passe les actions admises par son reducer et sa sauvegarde existants. Elle rediffuse ensuite l’état réel. Les panneaux ouverts sur la projection suspendent les commandes de la console.

## Commandes et protections

La console propose le signal des cartes, la discussion, la révélation, la question suivante, la pause, le cadenas, la navigation, les relances et les appréciations humaines des activités ouvertes. Les autres réponses des élèves assis restent inconnues ; aucun score individuel n’en est déduit.

Si le maintien est activé, la projection mesure elle-même les 600 ms. Un relâchement, une annulation tactile, la perte de focus, une fermeture ou un changement d’état annule le geste. Le protocole refuse une révélation directe qui contournerait ce maintien. **Masquer à nouveau** conserve la fenêtre existante de dix secondes.

**Passer**, **Nouvelle tentative** et **Terminer la séance** ouvrent une confirmation dans la console. La projection suspend son minuteur et son audio pendant cette confirmation. Le contrôleur exige l’ouverture de la confirmation correspondante avant d’accepter l’action ; annuler, fermer la console ou changer de question retire cette attente sans modifier les résultats. Les états de ces dialogues ne sont pas enregistrés dans les événements de séance.

## Fermeture et disponibilité

Fermer la console laisse la séance fonctionner. La rouvrir génère un nouveau canal si nécessaire, sans changer la question, la tentative ou le temps restant. Quitter ou recharger la projection ferme son ancien canal ; une console sans nouvelles depuis 4,5 secondes suspend ses commandes. La fin de séance retire les corrigés de la console et renvoie au bilan de la projection.

Une fenêtre bloquée ou l’absence de `BroadcastChannel` produit un message avec repli vers la feuille enseignant de la préparation. L’ouverture initiale des fenêtres demande une connexion ; une fois les deux fenêtres ouvertes et les médias préparés, leurs commandes locales fonctionnent sans réseau. Le démarrage à froid hors ligne reste ouvert, conformément à la décision D10. La console sur tablette ou sur un autre appareil reste un travail P2 distinct.

## Validation

Sept tests de domaine couvrent le protocole, les charges mal formées, les révisions, les doublons, les positions et couleurs, les modèles privés, les phases retrouvées, les maintiens annulés, les confirmations et la fermeture. Le [parcours navigateur](teacher-console-results.json) utilise de vraies fenêtres Chromium sur trois tailles d’écran, sans écriture vers l’API de fiches. Le [relevé qualité](quality-teacher-console-results.json) consigne les contrôles exécutés. L’essai physique avec écran étendu et ENI reste nécessaire.
