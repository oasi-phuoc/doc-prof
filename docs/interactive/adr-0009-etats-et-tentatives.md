# ADR 0009 — États conservés par écran et nouvelles tentatives

Le schéma de séance 4 conserve un état pour chaque écran visité : phase, choix Solo, date de révélation, tentative, indices affichés, ordre des images et fin d’écoute. Les deux questions d’un même écran audio partagent la phase et le minuteur ; leurs choix, relances et images gardent des identifiants distincts. Les champs courants restent des miroirs pour les composants existants, validés contre l’état de l’écran dans les instantanés.

La navigation restaure l’état enregistré, sans révéler une question encore vierge. Un retour sur une correction la laisse révélée et conserve sa date d’origine. Les décomptes sont enregistrés séparément par écran et tentative ; un événement tardif d’un autre écran ou d’une ancienne tentative est ignoré. Le focus rejoint l’énoncé à l’arrivée.

« Réessayer cette question » archive les résultats, votes et marques de l’essai précédent, puis remet uniquement cet écran en réflexion. Les cartes mélangées utilisent une graine de reprise et un cycle déterministe des positions ; la bonne change de place à chaque tentative. Les politiques fixes, vrai/faux, numériques et agrégées restent respectées. Les identifiants des choix et le corrigé source ne changent pas. Le bilan compte seulement le dernier résultat actif ; les essais précédents se consultent séparément. La feuille enseignant reste celle de la tentative initiale, ce qui est indiqué avant relance.

Le compteur de questions ouvre une navigation modale en Classe ; la nouvelle tentative se trouve dans cette fenêtre. Aucun bouton « Précédente » n’est réintroduit dans le menu. Le Solo garde son parcours automatique. Le bilan Classe peut rouvrir la séance pour revoir les questions.

Les schémas 1 à 3 restent lisibles. Un ancien journal rejoué reconstruit les états à partir des actions. Pour un ancien instantané sans états détaillés, seules les corrections prouvées par l’historique sont restituées comme révélées ; les autres questions restent sans correction. La migration ne réécrit rien à la lecture. Les écritures et compactages utilisent le schéma 4 ; les versions suivantes sont refusées et conservées.

Vérifications : 86 tests de domaine ; parcours `navigation-browser.mjs`, Classe, reprise des minuteurs, compactage, conservation locale et mobile. Voir [résultats](navigation-results.json), [mobile](screenshots/navigation-retry-390.png) et [ordinateur](screenshots/navigation-retry-1366.png).
