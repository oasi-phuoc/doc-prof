# ClairFLE — jouer avec la classe

[Suivi V4 et travaux restants](suivi-v4.md) · [Diagnostic de l’écran](diagnostic-eni.md) · [Feuille enseignant](feuille-enseignant.md) · [Jeu mobile et immersion](livraison-mobile-immersion.md)

Mise à jour : [modes Classe/Solo, mobile et six mascottes](livraison-classe-solo-mascottes.md). Cette livraison remplace le rituel avec sélection au tableau décrit ci-dessous : en Classe, le vote est collectif sans clic ; en Solo, correction et passage après cinq secondes sont automatiques. Les menus Mode et Mascotte sont des icônes. La reprise de séance utilise désormais IndexedDB.

Le mode interactif reprend le prototype `35934ad`, fusionné avec le `main` actuel puis adapté aux demandes de classe. Il remplace l’ancien jeu dans le générateur. Les fiches et leur format de sauvegarde v1 restent compatibles.

Depuis le générateur : **Jouer avec la classe**, puis **Commencer la séance**. Depuis la bibliothèque : **Jouer**. `/interactif/demo` propose dix questions de la banque réelle avec un compte autorisé.

## Installation et démarrage

```sh
npm ci --cache /tmp/clairfle-npm-cache --no-audit --no-fund
npm run dev -- --host 0.0.0.0 --port 5180
```

Le cache explicite permet une installation dans les environnements où le dossier personnel est en lecture seule. Node 24.22 et npm 11.9 ont été utilisés. Les variables applicatives sont décrites dans `.env.example` ; ne pas placer de valeur confidentielle dans un fichier versionné.

## Nouveautés du 10 novembre

La préparation vérifie les images et les audios avant le lancement, avec rapport, réessai et exclusion des questions aux médias absents ou invalides sans décocher la sélection. Le jeu utilise maintenant un menu unique, des illustrations rondes dans les marges, les repères à gauche des réponses et deux colonnes pour les questions audio. Les propositions restent visibles après correction. Entrée permet à l’enseignant de faire avancer les étapes hors des saisies et menus. Voir [la livraison médias et Word](livraison-medias-word.md).

## Rituel et réglages

Les six cartes pastel A–F utilisent des lettres et des formes de même taille. La palette se configure en grille de trois colonnes et deux rangées, comme les six cartes imprimées. Dans un écran à deux questions, A–C sont empilés à gauche et D–F à droite. Changer une forme échange sa place avec la forme existante pour conserver six repères distincts.

Le minuteur démarre pendant **Je réfléchis**, à 30 secondes par défaut. Avec un audio, il attend la fin de l’écoute. Il se règle et se désactive avant ou pendant la séance. Il ne révèle rien et ne passe jamais automatiquement à la suite. La pause et le masquage de l’onglet suspendent le minuteur et l’audio.

Pour un même enregistrement, deux questions au maximum sont retenues de façon reproductible parmi les questions cochées. Deux QCM sont projetés ensemble : A–C pour la première question, D–F pour la seconde. S’il y avait plus de trois choix, seuls deux distracteurs source sont conservés avec la bonne réponse ; cette adaptation est indiquée dans la préparation. Aucun faux choix n’est ajouté. Les productions ouvertes restent guidées par l’enseignant.

Les QCM TCF privilégient les variantes en images de la banque, même si la fiche papier avait sélectionné la forme à écrire. Le document à lire est ouvert directement, avec réglage de police. Les images de réponse restent des images au corrigé.

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
