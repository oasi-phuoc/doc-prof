# Compétition avec mascottes

Depuis la préparation d’un pool ou d’une fiche, sélectionnez les questions, réglez le minuteur et le battement de correction, puis touchez l’icône trophée **Compétition**. Une nouvelle compétition renouvelle le tirage des exercices générés en conservant la sélection, les limites et les durées. Les questions écrites manuellement gardent leur contenu. Seuls les QCM dont la réponse est vérifiable participent au classement ; les activités guidées restent disponibles en Classe et Solo.

## Salle sur Internet

L’enseignant crée la salle avec son accès aux salles, puis partage le code à six chiffres ou le QR. Les élèves ouvrent `/interactif/rejoindre`, saisissent le code et choisissent une image parmi 30 mascottes animées communes aux modes Classe et Solo. Aucun compte élève, nom, pseudo ou texte libre n’est demandé. Un numéro automatique distingue les mascottes identiques.

La liste des participants s’affiche avant le départ. L’enseignant peut retirer une inscription, commencer, mettre en pause, révéler la correction ou terminer après confirmation. Les inscriptions ferment au départ. Pendant la question, chaque élève choisit une seule carte sur son appareil ; la correction apparaît quand tous ont répondu ou à la fin du temps. La bonne carte reste en couleur et les cinq autres deviennent grises. Le classement est consultable pendant la correction, puis affiché à la fin.

Une bonne réponse rapporte de 500 à 1 000 points avec le bonus de rapidité, ou 1 000 points sans bonus ou sans minuteur. Une réponse fausse ou le temps écoulé rapporte zéro. Les égalités gardent le même rang. Le temps et les points sont calculés par le serveur. Une interruption Internet suspend l’envoi des réponses sur l’appareil concerné ; la page tente de se reconnecter, mais le temps de la salle continue tant que l’enseignant ne la met pas en pause.

À la première création sur un appareil, l’enseignant saisit sa clé. Un accès signé, valable 30 jours, permet ensuite de créer les parties suivantes directement depuis ClairFLE, y compris après fermeture ou dans un autre onglet du même navigateur. La clé privée elle-même n’est pas mémorisée. **Oublier mon accès enseignant** efface cet accès de l’appareil ; le formulaire revient aussi si l’autorisation expire ou si la clé serveur change. Chaque appareil ou profil de navigateur doit être autorisé séparément. Si le stockage du navigateur est indisponible, la création reste possible mais l’accès ne peut pas être conservé.

L’accès à une salle précise reste distinct : un rechargement dans le même onglet retrouve son autorisation enseignant ou élève. Les salles et leurs accès expirent au plus tard deux heures après leur création. Fermer l’onglet peut faire perdre l’accès à cette salle, même si l’appareil peut encore en créer une nouvelle.

Si l’option **Proposer la transcription après les réponses** est activée, l’icône livre apparaît après la dernière question liée à une écoute. L’enseignant peut ouvrir le texte pour mettre la correction en pause, puis fermer la lecture et choisir **Reprendre**. Les élèves peuvent lire le texte publié sur leur appareil ; leur lecture n’arrête pas la salle et se ferme quand la question suivante arrive. Le même réglage est disponible pour le défi local.

## Sans aucun réseau entre appareils

Les appareils séparés ne peuvent pas synchroniser leurs réponses sans moyen de communication. Choisissez **Sur cet appareil** pour jouer sur un appareil commun que les joueurs se passent à tour de rôle.

Préparez le défi pendant que la fiche est accessible, attendez le chargement complet des images, des audios et des mascottes, puis ajoutez une mascotte par joueur. La connexion peut ensuite être coupée. L’écran **À toi !** masque la question et les choix précédents ; **Je suis prêt** affiche la question et démarre le temps personnel. La correction attend tous les tours. Les points sont calculés localement et le classement reste sur cet appareil.

Gardez la page ouverte pour continuer sans connexion. Un démarrage à froid entièrement hors ligne ou un rechargement hors ligne ne sont pas garantis par cette version. Le journal du défi conserve ses actions dans l’onglet, pendant deux heures au maximum ; il n’embarque ni les questions ni leur corrigé. Quitter le défi le met en pause. Avec une connexion pour préparer de nouveau les médias, l’icône trophée puis **Reprendre le défi local** retrouve la même série, les mascottes et les réponses. **Nouvelle compétition**, au bilan, renouvelle le tirage et propose une liste de joueurs vide. Une sauvegarde incompatible est préservée et demande un redémarrage explicite.

## Duel et équipes sur le même écran

Choisissez **Préparer un duel**, puis une mascotte différente pour chaque côté. Le panneau **Paramètres de la partie** regroupe minuteur, vie maximale (jusqu’à 200) et chances des critiques ×2, ×3 et ×4. Chaque taux va de 0 à 100 % ; leur somme est limitée à 100 %. Le premier clic décide : juste, l’adversaire perd les points ; faux, le joueur les perd lui-même. Les dégâts sont de 10, 20, 30 ou 40 points. Le premier à zéro perd.

Chaque mascotte possède quatre niveaux d’attaque automatiques : eau pour la carpe koï, flammes pour le kitsune, encre pour la pieuvre, par exemple. Leur aperçu permet d’essayer chaque niveau et une erreur. Les critiques ajoutent une enveloppe d’énergie animée autour du personnage, dans les couleurs de sa signature ; le ×3 est plus grand et accompagné d’éclairs. Même à faible vie, le personnage prend sa pose énervée pendant le critique, puis retrouve sa fatigue après l’attaque. Les coups normaux et doubles suivent des trajectoires variables vers l’adversaire ; le triple se forme dans son espace. Une erreur déclenche la signature de son propre auteur sur lui-même, sans attaque de l’adversaire. Les dégâts ne sont appliqués qu’une fois, quel que soit le nombre de mouvements animés.

Au-delà de 100 PV de maximum, les [formes adultes](adr-0061-critiques-et-evolution.md) restent évoluées jusqu’à la fin de la rencontre, avec les mêmes états et réactions. Le ×4 charge une sphère dans les mains, lance un rayon adapté à la mascotte si la réponse est juste, ou implose sur son auteur si elle est fausse. Un coup potentiellement fatal fait clignoter sa victime dans sa propre couleur. Les PV sont colorés et gras, sans cartouche noir.

Le minuteur est facultatif ; sans clic à la fin du temps, les deux joueurs perdent 10 points, sans critique. Un double KO donne un match nul. Réglez la correction de 1 à 10 secondes : les questions s’enchaînent automatiquement, en répétant la série sélectionnée jusqu’à une victoire. La durée d’une animation peut prolonger une correction trop courte, sans modifier le réglage choisi. Les cartes restent tactiles ; au clavier, utilisez A–F pour le côté gauche et 1–6 pour le côté droit. Sur téléphone, le plein écran tente de passer en paysage si le navigateur l’autorise ; sinon une invitation propose de tourner l’appareil. Les deux camps gardent une disposition côte à côte, avec les barres de vie sur les côtés et les nombres seuls dans les barres.

**Créer les équipes** permet d’ajouter le même nombre de mascottes de chaque côté, sans répéter une identité. Les binômes et leur ordre sont tirés au sort au départ. **Randomiser les matchs** renouvelle les rencontres avant le départ ; **Randomiser les matchs restants** renouvelle celles qui restent à jouer. Après chaque duel, les deux mascottes suivantes sont appelées avec la vie maximale configurée ; **Commencer le duel** lance leur rencontre. L’équipe qui a le plus de victoires gagne. Le tournoi peut finir à égalité.

Après la préparation complète, les duels peuvent continuer sans réseau sur l’écran commun. Quitter met la partie en pause ; **Reprendre la partie** retrouve les vies et l’ordre du tirage dans le même onglet, pendant 24 heures au maximum, avec une connexion pour recharger les médias. **Nouvelle partie** revient au choix de compétition, renouvelle la graine des exercices générés en conservant la sélection et les paramètres, puis permet un nouveau tirage des binômes et des critiques. Les questions écrites manuellement gardent leur contenu. Ces duels locaux n’utilisent pas de code de salle. Voir les [règles et limites](adr-0043-duels-par-equipes.md).

## Activation par l’administrateur

Le code des salles est prêt et testé localement avec le moteur Cloudflare. Ce lot ne déploie pas le service externe. Tant que le serveur n’est pas activé, l’interface l’indique et laisse le défi local disponible.

Sur une machine autorisée à administrer le Worker existant :

```sh
cd api/fiches
npm ci --no-audit --no-fund
npx wrangler login
npx wrangler secret put COMPETITION_HOST_KEY
npm run deploy
```

Saisir une nouvelle clé aléatoire d’au moins 16 caractères (32 ou davantage conseillé) dans l’invite Wrangler. La transmettre aux seuls enseignants par le canal habituel de l’établissement. Ne pas la placer dans une variable `VITE_`, un fichier versionné ou une URL.

Avant le déploiement, vérifier que `COMPETITION_ORIGINS` dans `api/fiches/wrangler.toml` contient les origines exactes du site autorisé, séparées par des virgules, sans chemin final. La valeur actuelle autorise `https://doc-prof.vercel.app`. La liaison `COMPETITION_ROOMS` et la migration SQLite `competition-v1` créent le stockage des salles ; conserver les liaisons D1 et les secrets déjà utilisés pour les fiches. Aucune migration de table de fiches n’est requise pour ce mode.

L’adresse publique du Worker existant est déjà intégrée au code. Aucune nouvelle variable Vercel n’est nécessaire pour utiliser cette adresse :

```text
https://clairfle-fiches.phuoc-van.workers.dev/competition
```

Si une variable est déjà définie, elle garde la priorité : `VITE_COMPETITION_API_URL`, puis `VITE_FICHES_API_URL` suivi de `/competition`, puis l’adresse intégrée. Si Wrangler affiche une autre adresse pour le Worker existant, renseigner `VITE_COMPETITION_API_URL` dans **Vercel → Settings → Environment Variables** avec cette adresse et `/competition`, puis reconstruire et redéployer le site. Ces URL sont publiques et ne doivent contenir aucune clé. Le point `GET /competition/status`, appelé depuis une origine autorisée, ne signale les salles disponibles que lorsque la configuration serveur est complète.

Après cette activation initiale, ouvrir une fiche, toucher le trophée **Compétition**, puis **Salle en ligne**. L’enseignant saisit sa clé une première fois sur l’appareil ; les créations suivantes utilisent l’accès conservé pendant 30 jours. Les élèves rejoignent avec le code ou le QR et choisissent une mascotte. Un accès Internet est nécessaire pour synchroniser des appareils distincts. Le Worker doit être déployé dans sa nouvelle version pour émettre ces accès ; un ancien serveur continue d’accepter la clé, mais demande encore sa saisie à chaque création.

Pour vérifier le code avant activation :

```sh
npm run typecheck:api
node --test --test-concurrency=1 tests/interactive/competition-*.test.mjs
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:interactive:competition
npm run test:interactive:competition-worker
```

Les parcours ouvrent un enseignant et deux navigateurs élèves contre le routeur réel en local. Le test Worker utilise `workerd` et le stockage SQLite, vérifie un quiz de 60 questions dépassant 128 Kio et restaure les scores après redémarrage. Ils n’envoient aucune donnée au service de production. Voir [architecture et accès](adr-0021-salles-et-mascottes.md), [résultats navigateur](competition-results.json) et [résultats Worker](competition-worker-results.json).
