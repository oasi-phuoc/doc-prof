# Modes Classe / Solo, mobile et mascottes

Cette évolution applique les demandes du propriétaire intervenues après le cahier V4 : le mode Classe n’a plus de sélection au tableau ; le mode Solo corrige et avance automatiquement. Ces comportements remplacent les exigences antérieures de sélection au tableau et de révélation exclusivement manuelle pour le parcours Solo.

## Utilisation

Deux boutons icônes, à côté du contraste, ouvrent les choix **Mode de jeu** et **Mascotte**. Leur nom reste accessible au clavier et aux lecteurs d’écran ; les panneaux se ferment par Échap, par leur bouton ou au clic extérieur. Les options n’affichent aucun texte dans la barre fermée.

- **Classe**, par défaut : réflexion, signal pour lever les cartes, discussion, révélation enseignant, question suivante. Les cartes à l’écran ne demandent aucun clic. La correction montre la bonne réponse, sans inventer de verdict individuel pour les votes physiques.
- **Solo** : une question par écran, choix possible dès son affichage ; le compte à rebours démarre immédiatement, même avec un audio. Un choix affiche sa correction immédiatement. Une absence de réponse dans le temps est fausse. Après cinq secondes de correction, la question suivante commence ; la dernière mène au bilan. La pause et l’onglet masqué suspendent les deux décomptes. Le minuteur est obligatoire en Solo, sa durée reste réglable (30 secondes par défaut). Les activités ouvertes montrent leur modèle sans note automatique.

En Solo, toutes les questions audio sélectionnées sont conservées individuellement, avec tous leurs choix source. Le regroupement des deux QCM audio sur six cartes reste réservé à Classe. Changer de mode ouvre le plan et la sauvegarde correspondants.

## Mascottes

Six choix mémorisés localement : **Esprit feuille**, **Hibou**, **Pieuvre**, **Hérisson**, **Lapin lunaire**, **Dragon asiatique**. Chaque personnage a six poses : réflexion, vote, discussion, juste, faux et pause. Les six planches WebP ont été générées pour cette évolution ; les poses sont affichées par coordonnées CSS dans la même planche, sans téléchargement d’un fichier par état.

Une réponse juste en Solo affiche la mascotte qui félicite et une explosion de confettis ; une réponse fausse affiche la mascotte triste et des larmes animées. Chaque pose bouge : réflexion et pause respirent, le vote se soulève, la discussion se balance, la joie sautille et la tristesse oscille avec ses larmes. Les confettis et les larmes durent quelques secondes. Sur demande explicite du propriétaire, les mascottes et leurs effets restent animés indépendamment du réglage `prefers-reduced-motion`. Le verdict reste écrit indépendamment de l’animation. Le Dragon asiatique de la planche du zodiaque est intégré ; les onze autres animaux restent des propositions visuelles soumises au propriétaire.

## Mobile et numérotation

Le logo et l’action principale de chaque écran partagent la première ligne (Jouer avec la classe dans le générateur, Créer des fiches dans le jeu). Les options sont en dessous. La flèche de création est retirée. Illustration et minuteur sont centrés horizontalement ; les résultats Solo précèdent les réponses pour rester visibles. Les titres doubles utilisent une colonne dédiée au numéro et une colonne de texte alignée à gauche : toutes les lignes d’une question ont le même retrait.

## Sauvegarde locale : incrément de F28

Les séances utilisent maintenant IndexedDB `clairfle-interactive`, magasin `sessions`, plutôt que d’écraser les choix à la reprise. Chaque action acceptée est écrite en série ; un identifiant évite de rejouer deux fois un événement. La reprise conserve la phase, les choix, la pause, la correction déjà déclenchée et l’historique. Une empreinte SHA-256 du plan, incluant la conversion et les corrections, refuse une reprise sur un contenu différent. Aucune clé de réponse ni contenu de question n’est enregistré dans le journal. Les modes ont des plans et sauvegardes distincts.

La préparation propose Reprendre, Recommencer ou Supprimer. Les sauvegardes expirent après sept jours. Un stockage bloqué ou une version inconnue donne un message et permet le jeu sans écraser la sauvegarde illisible.

Les décomptes de réflexion et de correction sont maintenant sauvegardés avec leur temps restant, leur durée, leur phase et l’identifiant de l’écran. Les écritures de minuteur sont regroupées sur 300 ms et vidées à la sortie, au masquage et sur `pagehide`. La reprise réutilise ce temps uniquement si écran, phase et durée correspondent ; le temps passé hors de l’application ne consomme pas le décompte. Un changement de durée repart sur la nouvelle durée. Le mode Solo est mémorisé dans l’onglet pour permettre une reprise après actualisation ; un nouvel onglet utilise Classe par défaut.

Ce travail ne termine pas F28 : les anciens instantanés `sessionStorage` sont conservés mais ne sont pas migrés ; le verrou entre onglets, la compaction au bilan et les autres magasins du §63 restent à réaliser. Le journal est plafonné à 5 000 événements ; au plafond, la séance continue avec un avertissement de sauvegarde. Il n’y a pas de synchronisation serveur.

## Vérifications

Depuis `/workspace/doc-prof`, avec Vite sur le port 5180 :

```sh
npm test
npx tsc -b
npx vite build
npm run lint
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:interactive:browser
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:interactive:classroom
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:interactive:media
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium node tests/interactive/solo-browser.mjs
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium node tests/interactive/mobile-browser.mjs
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium node tests/interactive/resume-browser.mjs
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium node tests/interactive/mascot-browser.mjs
```

Les scénarios Solo couvrent la bonne réponse, l’absence de réponse, le délai de cinq secondes, les deux pauses, l’audio, les animations et le bilan. Les scénarios mobiles couvrent 360, 390 et 700 px, l’alignement des en-têtes, l’accès aux options, les six mascottes, la mémorisation et le retrait du texte sur plusieurs lignes. Les gestes et les horloges sont simulés dans Chromium ; aucun essai sur ENI ou téléphone physique n’est revendiqué.

Le scénario `resume-browser.mjs` interrompt une réflexion puis une correction Solo après environ deux secondes, recharge la page et vérifie la reprise des seules trois secondes restantes, en conservant la pause, le mode et le verdict. Les instantanés sans minuteur de la première version restent lisibles. Un minuteur invalide est refusé sans écraser la sauvegarde.

La vérification des mascottes affiche les six personnages dans leurs six poses et mesure les transformations produites par le moteur d’animation du navigateur. Les 36 poses bougent, les six planches se décodent, et les confettis/larmes restent actifs avec la préférence de réduction du mouvement activée, conformément à la demande du propriétaire.
