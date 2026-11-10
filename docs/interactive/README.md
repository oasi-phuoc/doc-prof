# ClairFLE — jouer avec la classe

[Fonctions réutilisables](etat-utilisable-v4.md) · [Suivi V4](suivi-v4.md) · [Diagnostic](diagnostic-eni.md) · [Feuille enseignant](feuille-enseignant.md) · [Mobile et cartes carrées](livraison-mobile-question-cartes.md)

Le mode Classe est le mode par défaut : chacun répond avec ses cartes physiques, puis l’enseignant conduit la discussion et révèle la correction. Aucun élève ne sélectionne une réponse au tableau. Le bouton icône Classe/Solo change directement le mode.

En Solo, le choix déclenche la correction puis la question suivante après un battement réglable de 1 à 10 secondes (5 par défaut). Le minuteur est facultatif ; s’il est activé, son expiration compte comme une réponse incorrecte. Les productions ouvertes gardent un modèle et une appréciation humaine.

Depuis le générateur : **Jouer avec la classe**, puis **Commencer la séance**. Depuis la bibliothèque : **Jouer**. `/interactif/demo` propose dix questions de la banque réelle avec un compte autorisé.

## Installation et démarrage

```sh
npm ci --cache /tmp/clairfle-npm-cache --no-audit --no-fund
npm run dev -- --host 0.0.0.0 --port 5180
```

Le cache explicite permet une installation dans les environnements où le dossier personnel est en lecture seule. Node 24.22 et npm 11.9 ont été utilisés. Les variables applicatives sont décrites dans `.env.example` ; ne pas placer de valeur confidentielle dans un fichier versionné.

## Préparation et supports

La préparation vérifie les images et les audios avant le lancement, avec rapport, réessai et exclusion des questions aux médias absents ou invalides sans décocher la sélection. Une nouvelle partie renouvelle la graine du générateur en conservant le modèle serveur. Une reprise garde la série en cours. Après correction, la bonne réponse garde sa couleur parmi les cartes et porte une coche ; les autres cartes deviennent grises. La réponse n’est pas répétée près de la mascotte. Voir [correction dans les cartes](livraison-correction-cartes.md), [nouvelles parties](nouvelles-parties.md) et [contrôle des médias](livraison-medias-word.md).

## Rituel et réglages

Les six cartes pastel A–F utilisent des lettres et des formes de même taille. La palette se configure en trois colonnes et deux rangées ; l’impression produit des carrés de 88 mm sur deux colonnes et trois lignes A4. Dans un écran à deux questions, A–C sont empilés à gauche et D–F à droite. Changer une forme échange sa place avec la forme existante pour conserver six repères distincts.

Le minuteur vaut 30 secondes par défaut. En Classe, avec un audio, il attend la fin de l’écoute et la suite reste manuelle ; en Solo, il démarre à l’affichage de la question. Il se règle et se désactive avant ou pendant la séance. La pause et le masquage de l’onglet suspendent le minuteur et l’audio. Sur mobile, la question est agrandie et encadrée, puis les cartes sont suivies de la mascotte et du minuteur centrés.

En Classe, pour un même enregistrement, deux questions au maximum sont retenues de façon reproductible parmi les questions cochées. Deux QCM sont projetés ensemble : A–C pour la première question, D–F pour la seconde. S’il y avait plus de trois choix, seuls deux distracteurs source sont conservés avec la bonne réponse ; cette adaptation est indiquée dans la préparation. En Solo, toutes les questions sélectionnées et leurs choix sont conservés, un écran par question.

Les QCM TCF privilégient les variantes en images de la banque, même si la fiche papier avait sélectionné la forme à écrire. Le document à lire est ouvert directement, avec réglage de police. Les images de réponse restent des images au corrigé.

Le choix de mascotte propose six images animées : Esprit feuille, Hibou, Pieuvre, Hérisson, Lapin lunaire et Dragon. Les animations restent actives selon la demande du propriétaire. Le mode immersif masque les commandes du menu, avec un bouton de sortie et le lecteur audio nécessaire au jeu.

## Suivi local

Le [comptage manuel](comptage-manuel.md) est facultatif et étiqueté comme une saisie de l’enseignant. Les observations et les marques à revoir restent locales. La [protection entre onglets](reprise-concurrence.md), les [instantanés](adr-0006-instantanes-de-seance.md) et la [purge après sept jours](retention-locale.md) protègent les journaux. Les polices sont [hébergées localement](adr-0005-polices-locales.md). La feuille enseignant utilise le même plan résolu que la projection.

## Vérification reproductible

```sh
npm test
npm run build
npm run lint
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:interactive:browser
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:interactive:classroom
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:interactive:media
```

Chromium système évite tout téléchargement supplémentaire. À défaut, installer Chromium avec Playwright. `test:interactive:a4` compare à un checkout témoin sur le port 5181 (`A4_BASELINE_URL`). Le témoin de cette livraison est `726a9ec5`, le `main` avant ces ajustements. `test:interactive:saved` utilise une instance sur 5182 démarrée avec `VITE_FICHES_API_URL=http://127.0.0.1:5182/__test_api` ; l’API est interceptée, aucune fiche réelle n’est modifiée.

Les tests navigateur avec horloge simulée valident le minuteur ; la suite de démonstration vérifie également une lecture réelle dans Chromium. Les événements tactiles simulés ne constituent pas un essai sur ENI physique.

Voir [acceptation](checklist-acceptation.md), [architecture](architecture.md), [audit](audit-compatibilite.md), [sécurité](audit-securite.md), [livraison](livraison-classe.md) et [captures](design-system.md). Le cahier V4 décrit une cible plus large : les fonctions P1/P2 et toutes les familles du catalogue ne sont pas annoncées terminées.
