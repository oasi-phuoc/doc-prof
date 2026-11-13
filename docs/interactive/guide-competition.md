# Compétition avec mascottes

Depuis la préparation d’une fiche, sélectionnez les questions, réglez le minuteur et le battement de correction, puis touchez l’icône trophée **Compétition**. Une nouvelle compétition renouvelle le tirage des exercices générés en conservant la sélection, les limites et les durées. Les questions écrites manuellement gardent leur contenu. Seuls les QCM dont la réponse est vérifiable participent au classement ; les activités guidées restent disponibles en Classe et Solo.

## Salle sur Internet

L’enseignant crée la salle avec son accès aux salles, puis partage le code à six chiffres ou le QR. Les élèves ouvrent `/interactif/rejoindre`, saisissent le code et choisissent une image parmi 30 mascottes animées communes aux modes Classe et Solo. Aucun compte élève, nom, pseudo ou texte libre n’est demandé. Un numéro automatique distingue les mascottes identiques.

La liste des participants s’affiche avant le départ. L’enseignant peut retirer une inscription, commencer, mettre en pause, révéler la correction ou terminer après confirmation. Les inscriptions ferment au départ. Pendant la question, chaque élève choisit une seule carte sur son appareil ; la correction apparaît quand tous ont répondu ou à la fin du temps. La bonne carte reste en couleur et les cinq autres deviennent grises. Le classement est consultable pendant la correction, puis affiché à la fin.

Une bonne réponse rapporte de 500 à 1 000 points avec le bonus de rapidité, ou 1 000 points sans bonus ou sans minuteur. Une réponse fausse ou le temps écoulé rapporte zéro. Les égalités gardent le même rang. Le temps et les points sont calculés par le serveur. Une interruption Internet suspend l’envoi des réponses sur l’appareil concerné ; la page tente de se reconnecter, mais le temps de la salle continue tant que l’enseignant ne la met pas en pause.

Un rechargement dans le même onglet retrouve l’accès à la salle. La clé enseignant n’est pas mémorisée ; seule une autorisation limitée à cette salle et à ce rôle reste dans l’onglet. Les salles et leurs accès expirent au plus tard deux heures après leur création. Fermer l’onglet peut faire perdre cet accès.

Si l’option **Proposer la transcription après les réponses** est activée, l’icône livre apparaît après la dernière question liée à une écoute. L’enseignant peut ouvrir le texte pour mettre la correction en pause, puis fermer la lecture et choisir **Reprendre**. Les élèves peuvent lire le texte publié sur leur appareil ; leur lecture n’arrête pas la salle et se ferme quand la question suivante arrive. Le même réglage est disponible pour le défi local.

## Sans aucun réseau entre appareils

Les appareils séparés ne peuvent pas synchroniser leurs réponses sans moyen de communication. Choisissez **Sur cet appareil** pour jouer sur un appareil commun que les joueurs se passent à tour de rôle.

Préparez le défi pendant que la fiche est accessible, attendez le chargement complet des images, des audios et des mascottes, puis ajoutez une mascotte par joueur. La connexion peut ensuite être coupée. L’écran **À toi !** masque la question et les choix précédents ; **Je suis prêt** affiche la question et démarre le temps personnel. La correction attend tous les tours. Les points sont calculés localement et le classement reste sur cet appareil.

Gardez la page ouverte pour continuer sans connexion. Un démarrage à froid entièrement hors ligne ou un rechargement hors ligne ne sont pas garantis par cette version. Le journal du défi conserve ses actions dans l’onglet, pendant deux heures au maximum ; il n’embarque ni les questions ni leur corrigé. Quitter le défi le met en pause. Avec une connexion pour préparer de nouveau les médias, l’icône trophée puis **Reprendre le défi local** retrouve la même série, les mascottes et les réponses. **Nouvelle compétition**, au bilan, renouvelle le tirage et propose une liste de joueurs vide. Une sauvegarde incompatible est préservée et demande un redémarrage explicite.

## Duel et équipes sur le même écran

Choisissez **Préparer un duel**, puis une mascotte pour chaque côté. Chaque joueur commence à 100 % de vie. Le premier clic décide : juste, l’adversaire perd 10 % ; faux, le joueur perd lui-même 10 %. Les questions **Critique !** infligent 20 % et arrivent au hasard, environ une fois sur quatre. Les formes animées et la réaction de la mascotte indiquent le coup. Le premier à 0 % perd. La préparation propose dix attaques et dix effets d’erreur à prévisualiser dans les deux sens. Un coup juste part de sa mascotte vers l’adversaire ; une erreur fait tomber les objets choisis sur soi-même. Les effets sélectionnés sont conservés à la reprise.

Le minuteur est facultatif ; sans clic à la fin du temps, personne ne perd de vie. Réglez la correction de 1 à 10 secondes : les questions s’enchaînent automatiquement, en répétant la série sélectionnée jusqu’à une victoire. Les cartes restent tactiles ; au clavier, utilisez A–F pour le côté gauche et 1–6 pour le côté droit. Sur téléphone les deux zones sont l’une sous l’autre.

**Créer les équipes** permet d’ajouter le même nombre de mascottes de chaque côté. Les binômes et leur ordre sont tirés au sort au départ. Après chaque duel, les deux mascottes suivantes sont appelées avec 100 % de vie ; **Commencer le duel** lance leur rencontre. L’équipe qui a le plus de victoires gagne. Le tournoi peut finir à égalité.

Après la préparation complète, les duels peuvent continuer sans réseau sur l’écran commun. Quitter met la partie en pause ; **Reprendre la partie** retrouve les vies et l’ordre du tirage dans le même onglet, pendant 24 heures au maximum, avec une connexion pour recharger les médias. **Nouvelle partie** revient au choix de compétition, renouvelle la graine des exercices générés en conservant la sélection et les paramètres, puis permet un nouveau tirage des binômes et des critiques. Les questions écrites manuellement gardent leur contenu. Ces duels locaux n’utilisent pas de code de salle. Voir les [règles et limites](adr-0043-duels-par-equipes.md).

## Activation par l’administrateur

Le code des salles est prêt et testé localement avec le vrai moteur Cloudflare. Aucun déploiement Cloudflare n’a été effectué depuis cet environnement : aucun accès Cloudflare n’y est configuré et son API n’est pas accessible. Tant que le serveur n’est pas activé, l’interface l’indique et laisse le défi local disponible.

Sur une machine autorisée à administrer le Worker existant :

```sh
cd api/fiches
npm ci --no-audit --no-fund
npx wrangler secret put COMPETITION_HOST_KEY
npm run deploy
```

Saisir une nouvelle clé aléatoire d’au moins 16 caractères (32 ou davantage conseillé) dans l’invite Wrangler. La transmettre aux seuls enseignants par le canal habituel de l’établissement. Ne pas la placer dans une variable `VITE_`, un fichier versionné ou une URL.

Avant le déploiement, vérifier que `COMPETITION_ORIGINS` dans `api/fiches/wrangler.toml` contient les origines exactes du site autorisé, séparées par des virgules, sans chemin final. La valeur actuelle autorise `https://doc-prof.vercel.app`. La liaison `COMPETITION_ROOMS` et la migration SQLite `competition-v1` créent le stockage des salles ; conserver les liaisons D1 et les secrets déjà utilisés pour les fiches. Aucune migration de table de fiches n’est requise pour ce mode.

Le site utilise par défaut `VITE_FICHES_API_URL` suivi de `/competition`. Pour un serveur distinct, configurer `VITE_COMPETITION_API_URL` avec l’URL complète se terminant par `/competition`, puis reconstruire le site. Cette URL est publique et ne doit contenir aucune clé. Le point `GET /competition/status`, appelé depuis une origine autorisée, ne signale les salles disponibles que lorsque la configuration serveur est complète.

Pour vérifier le code avant activation :

```sh
npm run typecheck:api
node --test --test-concurrency=1 tests/interactive/competition-*.test.mjs
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:interactive:competition
npm run test:interactive:competition-worker
```

Les parcours ouvrent un enseignant et deux navigateurs élèves contre le routeur réel en local. Le test Worker utilise `workerd` et le stockage SQLite, vérifie un quiz de 60 questions dépassant 128 Kio et restaure les scores après redémarrage. Ils n’envoient aucune donnée au service de production. Voir [architecture et accès](adr-0021-salles-et-mascottes.md), [résultats navigateur](competition-results.json) et [résultats Worker](competition-worker-results.json).
