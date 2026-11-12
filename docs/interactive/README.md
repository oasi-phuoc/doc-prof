# ClairFLE — jouer avec la classe

[Fonctions réutilisables](etat-utilisable-v4.md) · [Suivi V4](suivi-v4.md) · [Compétition](guide-competition.md) · [Diagnostic](diagnostic-eni.md) · [Feuille enseignant](feuille-enseignant.md) · [Mobile et cartes carrées](livraison-mobile-question-cartes.md)

Le mode Classe est le mode par défaut : chacun répond avec ses cartes physiques, puis l’enseignant conduit la discussion et révèle la correction. Aucun élève ne sélectionne une réponse au tableau. Le bouton icône Classe/Solo change directement le mode.

Les [protections enseignant](livraison-protections-enseignant.md) ajoutent un maintien optionnel pour révéler, un cadenas conservé après actualisation, une annulation de correction pendant dix secondes et une confirmation avant de passer ou terminer. Les raccourcis de phase s’utilisent avec le focus dans les commandes.

Le compteur de questions ouvre la navigation en Classe. Chaque écran retrouve sa phase et son temps restant ; les images déplacées et les relances affichées sont conservées. « Réessayer cette question » garde l’ancien essai et redistribue les cartes mélangées. Voir [états et tentatives](adr-0009-etats-et-tentatives.md).

Depuis le générateur, « Jouer avec la classe » conserve un brouillon local pendant 24 heures après sa dernière ouverture. Son adresse permet de retrouver la préparation après actualisation, dans le même navigateur. Voir [brouillons locaux](adr-0007-brouillons-locaux.md), notamment les limites des images temporaires et le repli lorsque le stockage est indisponible.

Les parties et réglages se retrouvent après fermeture de l’onglet dans le même navigateur. Une adresse de séance porte son identifiant local ; les modèles serveur sont toujours chargés en lecture seule. Voir [reprise durable](adr-0010-reprise-durable.md).

La préparation peut être enregistrée dans un [préréglage local](adr-0011-prereglages-locaux.md) : sélection, ordre personnalisé ou mélangé, plafond de choix, classement numérique, mode et durées. Une fiche modifiée déclenche une proposition d’adaptation. La reprise d’une partie conserve ses options même si le préréglage a été supprimé.

En Solo, le choix déclenche la correction puis la question suivante après un battement réglable de 1 à 10 secondes (5 par défaut). Le minuteur est facultatif ; s’il est activé, son expiration compte comme une réponse incorrecte. Les productions ouvertes gardent un modèle et une appréciation humaine.

L’icône trophée ouvre la [compétition](guide-competition.md) : code de salle, douze nouvelles mascottes sans nom ni pseudo, scores et classement. Les salles Internet nécessitent l’activation du Worker décrite dans le guide ; le défi sur un appareil commun continue sans réseau après préparation complète des médias. Des appareils sans aucun lien entre eux ne peuvent pas partager une salle synchronisée.

Depuis le générateur : **Jouer avec la classe**, puis **Commencer la séance**. Depuis la bibliothèque : **Jouer**. `/interactif/demo` propose dix questions de la banque réelle avec un compte autorisé.

## Installation et démarrage

```sh
npm ci --cache /tmp/clairfle-npm-cache --no-audit --no-fund
npm run dev -- --host 0.0.0.0 --port 5180
```

Le cache explicite permet une installation dans les environnements où le dossier personnel est en lecture seule. Node 24.22 et npm 11.9 ont été utilisés. Les variables applicatives sont décrites dans `.env.example` ; ne pas placer de valeur confidentielle dans un fichier versionné.

## Préparation et supports

La préparation vérifie les images et les audios avant le lancement, avec rapport, réessai et exclusion des questions aux médias absents ou invalides sans décocher la sélection. Une nouvelle partie renouvelle la graine du générateur en conservant le modèle serveur. Une reprise garde la série en cours. Après correction, la bonne réponse garde sa couleur parmi les cartes et porte une coche ; les autres cartes deviennent grises. La réponse n’est pas répétée près de la mascotte. Voir [correction dans les cartes](livraison-correction-cartes.md), [nouvelles parties](nouvelles-parties.md) et [contrôle des médias](livraison-medias-word.md).

Le [contrôle de lisibilité](adr-0022-lisibilite-mesuree.md) mesure aussi les questions à 1 920 × 1 080 et 1 366 × 768 et signale les textes longs. Pendant le jeu, l’affichage s’adapte à la place disponible ; **Suite** ouvre le texte complet lorsque le défilement est nécessaire. Cette lecture conserve la réponse choisie et la phase.

Les [carrés et rectangles](adr-0029-mesures-geometriques.md) proposent périmètres, aires et dimensions manquantes, avec figure, mesures lisibles et unités sur les cartes. Les corrigés sont recalculés exactement ; les résultats arrondis et les figures non prises en charge sont signalés en préparation.

Les [triangles et parallélogrammes](adr-0030-triangles-et-parallelogrammes.md) proposent aussi périmètres, aires, côtés et hauteurs à retrouver. Les triangles impossibles et les corrigés arrondis sont signalés ; les cotes cherchées restent masquées sur le dessin après correction.

## Rituel et réglages

Les six cartes pastel A–F utilisent des lettres et des formes de même taille. La palette se configure en trois colonnes et deux rangées ; l’impression produit des carrés de 88 mm sur deux colonnes et trois lignes A4. Dans un écran à deux questions, A–C sont empilés à gauche et D–F à droite. Changer une forme échange sa place avec la forme existante pour conserver six repères distincts.

La [page de comparaison des cartes](adr-0015-cartes-et-etalonnage.md), `/interactif/cartes`, affiche de grands échantillons et mémorise la comparaison visuelle effectuée par l’enseignant. Couleurs, formes, contrastes et version sont partagés avec l’impression. Le mode économie d’encre ajoute six motifs distincts. Une palette modifiée nécessite une nouvelle comparaison.

Le minuteur vaut 30 secondes par défaut. En Classe, avec un audio, il attend la fin de l’écoute et la suite reste manuelle ; en Solo, il démarre à l’affichage de la question. Il se règle et se désactive avant ou pendant la séance. La pause et le masquage de l’onglet suspendent le minuteur et l’audio. Sur mobile, la question est agrandie et encadrée, puis les cartes sont suivies de la mascotte et du minuteur centrés.

Le [compteur audio](adr-0012-ecoutes-audio.md) respecte la limite explicite de la consigne. Pause et reprise comptent comme un seul passage ; les écoutes consommées et les autorisations supplémentaires de l’enseignant sont conservées dans le journal. Une erreur avant lecture ne compte pas. Un blocage de plus de huit secondes propose un réessai.

En Classe, pour un même enregistrement, deux questions au maximum sont retenues de façon reproductible parmi les questions cochées. Deux QCM sont projetés ensemble : A–C pour la première question, D–F pour la seconde. S’il y avait plus de trois choix, seuls deux distracteurs source sont conservés avec la bonne réponse ; cette adaptation est indiquée dans la préparation. En Solo, toutes les questions sélectionnées et leurs choix sont conservés, un écran par question.

Les QCM TCF privilégient les variantes en images de la banque, même si la fiche papier avait sélectionné la forme à écrire. Le document à lire est ouvert directement, avec réglage de police. Les images de réponse restent des images au corrigé.

Les [nouveaux adaptateurs](adr-0014-associer-et-ordonner.md) couvrent aussi les associations audio, les paires de vocabulaire et les phrases courtes à ordonner. Ils conservent les alternatives source et proposent une appréciation humaine lorsque la réponse n’est pas unique ou que l’audio est un repli sur un mot entier. Les phrases se déplacent au toucher ou au clavier, avec annulation et reprise de l’ordre proposé.

Le choix de mascotte propose six images animées : Esprit feuille, Hibou, Pieuvre, Hérisson, Lapin lunaire et Dragon. Les animations restent actives selon la demande du propriétaire. Le mode immersif masque les commandes du menu, avec un bouton de sortie et le lecteur audio nécessaire au jeu.

## Suivi local

Le [comptage manuel](comptage-manuel.md) est facultatif et étiqueté comme une saisie de l’enseignant. Les observations et les marques à revoir restent locales. La [protection entre onglets](reprise-concurrence.md), les [instantanés](adr-0006-instantanes-de-seance.md) et la [purge après sept jours](retention-locale.md) protègent les journaux. Les polices sont [hébergées localement](adr-0005-polices-locales.md). La feuille enseignant utilise le même plan résolu que la projection.

La préparation liste plusieurs parties et bilans de la fiche. Les [archives et transferts](adr-0013-archives-et-transferts.md) permettent export JSON, import avec aperçu, suppression et effacement des données locales du jeu. Le fichier conserve état, comptages et observations ; la fiche d’origine reste nécessaire. Terminer ou lancer une nouvelle partie conserve le bilan précédent. L’impression du bilan inclut les observations enregistrées.

## Vérification reproductible

```sh
npm test
npm run build
npm run lint
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium node tests/interactive/duplex-browser.mjs
node scripts/interactive-budgets.mjs # après npx vite build --manifest
node scripts/interactive-secrets.mjs
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:interactive:browser
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:interactive:classroom
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:interactive:media
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:interactive:competition
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:interactive:numeracy
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:interactive:arithmetic
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:interactive:ordering
npm ci --prefix api/fiches --no-audit --no-fund
npm run typecheck:api
npm run test:interactive:competition-worker
```

Chromium système évite tout téléchargement supplémentaire. À défaut, installer Chromium avec Playwright. `test:interactive:a4` compare à un checkout témoin sur le port 5181 (`A4_BASELINE_URL`). Le témoin de cette livraison est `726a9ec5`, le `main` avant ces ajustements. `test:interactive:saved` utilise une instance sur 5182 démarrée avec `VITE_FICHES_API_URL=http://127.0.0.1:5182/__test_api` ; l’API est interceptée, aucune fiche réelle n’est modifiée.

Les tests navigateur avec horloge simulée valident le minuteur ; la suite de démonstration vérifie également une lecture réelle dans Chromium. Les événements tactiles simulés ne constituent pas un essai sur ENI physique.

`npm run test:interactive:all` démarre et ferme ses serveurs sur 5180, 5181 et 5182, puis exécute les parcours, axe et la comparaison A4. Ces ports doivent être libres. Pour une autre instance principale, utiliser `INTERACTIVE_CI_PORT` et `INTERACTIVE_CI_BASELINE_PORT` ; les API simulées gardent 5182, le serveur de compétition des tests utilise 5193 et la mesure du build utilise 5192. Le checkout doit contenir la référence C0 ; aucun second checkout ni fichier d’environnement n’est créé. La CI sous Node 24 exécute les mêmes commandes. Voir [qualité et chargement](adr-0016-qualite-et-chargement.md) pour le périmètre des audits et les limites encore ouvertes.

Voir [acceptation](checklist-acceptation.md), [architecture](architecture.md), [audit](audit-compatibilite.md), [sécurité](audit-securite.md), [livraison](livraison-classe.md) et [captures](design-system.md). Le cahier V4 décrit une cible plus large : les fonctions P1/P2 et toutes les familles du catalogue ne sont pas annoncées terminées.

Les cartes A4 s’impriment désormais en [recto verso](adr-0017-cartes-recto-verso.md), avec six carrés sur chaque face et les mêmes repères des deux côtés. Le réglage par défaut est le bord long ; le même bord doit être choisi dans la fenêtre d’impression.

Les exercices d’[écoute des sons](adr-0018-ecouter-les-sons.md) sont proposés mot par mot avec cartes Oui / Non, en gardant le son, les pistes, les images et les réponses de la fiche.

Le [test TCM CSC](../tcm-csc/README.md) comprend 23 exercices imprimables et trois pistes audio ; l’exercice 21 reste réservé. Les signes à compléter, les opérations posées et les problèmes rejoignent le jeu Classe / Solo. Les [103 contextes de problèmes](adr-0023-problemes-csc.md) conservent leurs énoncés et leurs nombres, avec des propositions numériques vérifiées ; les nouvelles parties des modèles générés renouvellent leurs valeurs.

Dans le générateur, les [formats CO et corrigés CE](../tcf/formats-et-corriges.md) conservent les boutons Texte / Image / Phrase sur les tests assemblés et les coches imprimables, même sans arrière-plans.

Les [nombres et calculs oraux](adr-0024-sequences-audio.md) lisent tous leurs extraits en une piste complète, avec les contrôles d’écoute existants. Les [chargements animés](adr-0025-chargements-animes.md) accompagnent l’ouverture des pages, des fiches et du jeu, dès le démarrage initial.

Les [comparaisons et suites numériques](adr-0026-comparaisons-et-suites.md) proposent les signes `<`, `=` et `>` ou une question par case manquante. Les nombres de la fiche et son aide sont conservés ; la case demandée est encadrée, les autres blancs restent masqués et la correction apparaît uniquement dans les cartes. Entiers, décimaux et fractions sont vérifiés exactement ; les suites doivent avoir un pas constant. Ces activités fonctionnent aussi en compétition.

Les [calculs à trou, divisions et décimaux](adr-0027-calculs-a-trou-et-decimaux.md) gardent l’équation de la fiche et sa case manquante. Les résultats décimaux sont exacts, les calculs ambigus ou incohérents sont signalés, et le jeu conserve ses parcours Classe, Solo et compétition. Les fractions non décimales, les quotients arrondis et les divisions avec reste demandent encore une adaptation.

L’[ordre des nombres et des lettres](adr-0028-classements-et-phrases.md) propose une question par position avec les éléments source comme cartes, tout en montrant la liste complète. Les phrases courtes à remettre en ordre réutilisent les mots manipulables et la validation humaine. Les classements stricts avec nombres répétés et les phrases trop longues sont signalés avant de jouer.
