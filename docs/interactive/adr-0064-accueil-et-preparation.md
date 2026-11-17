# Accueil et préparation du mode jeu

Date : 17 novembre 2026.

L’accueil `/interactif` propose trois boutons : **Exercices ou fiche**, **Préparer la séance** et **Parties et bilans**. Le catalogue des types d’exercices s’ouvre dans une fenêtre ; les sélections, quantités, plages de nombres et recherches restent en place après sa fermeture. L’édition d’un pool existant ouvre directement cette fenêtre. Les fiches enregistrées restent accessibles depuis le choix des contenus.

Une fois le contenu préparé, l’accueil de la partie affiche son titre, le nombre de questions, le mode et un bouton de lancement. Les autres actions ouvrent la sélection des questions, les réglages, les archives ou les supports à imprimer. La compétition dispose de son propre bouton et conserve ses parcours de duel, d’équipes et de salle.

Le mode Classe/Solo, le chrono désactivable, le battement, la mascotte et le contraste sont réunis dans **Préparer la séance**. Les couleurs des cartes, l’ordre, les préréglages et le préchargement hors connexion sont des rubriques repliées. Le choix de mascotte utilise les images et se replie après validation. Les réglages de cet appareil restent enregistrés dans le stockage existant.

Les blocs de rituel et de lisibilité ont disparu de l’accueil. Le contrôle automatique de l’affichage, les vérifications des médias et les conditions de lancement sont conservés. Une erreur ou un avertissement utile reste visible ; le détail des médias et des incompatibilités est accessible depuis le choix des contenus.

Les fenêtres utilisent le dialogue natif : arrière-plan inactif, navigation clavier contenue, fermeture par Échap ou le bouton de fermeture, retour du focus au bouton d’origine et défilement intérieur sur mobile. Les confirmations des archives restent des dialogues distincts. L’impression remet la fenêtre des supports en flux normal pour conserver les cartes A4 recto verso. L’interface pendant les questions reste celle du jeu existant.

Validation : `node tests/interactive/setup-home-browser.mjs` couvre les accueils et fenêtres à 360, 390 et 1 366 px, le maintien des réglages et des sélections, les préréglages, les bilans, leurs confirmations, l’accès aux compétitions et quatre pages A4 recto verso. Le test existant `npm run test:interactive:pools` parcourt aussi les pools de trois domaines, le préchargement, le jeu hors connexion, la reprise durable et la progression automatique en Solo.
