# ADR 0036 — Associations image–mot des jeux imprimables

Les fiches **Jeux › Vocabulaire** et **Jeux › Mémory** peuvent alimenter les questions du mode jeu. Le vocabulaire fournit neuf associations dans le modèle courant et le Mémory en fournit quatre. Chaque question affiche l’image et propose les mots de la fiche. Le recto verso imprimable reste inchangé.

L’association repose sur le numéro de paire enregistré dans les cartes. Pour le vocabulaire, l’image du recto retrouve le mot du verso portant le même numéro, même après miroir ou changement d’ordre. Pour le Mémory, les deux cartes sont sur le recto ; les dos de série et la case vide ne créent pas de questions. Aucun mot n’est déduit du nom du fichier image.

Les cartes de réponse contiennent deux à six mots source distincts, avec une sélection déterministe des alternatives lorsque la planche en contient davantage. Leurs identifiants dépendent du mot et ne correspondent pas à la position de l’image. Les remplacements d’images sont appliqués une seule fois. Si une image correspond à plusieurs mots source, ou si aucune alternative n’est disponible, l’activité devient guidée avec appréciation humaine. Une planche incohérente, des numéros répétés ou absents, une paire incomplète ou une édition non validée sont signalés dans la préparation.

Ces questions reprennent les mécanismes existants : Classe collective, Solo avec correction et passage automatique, sélection et ordre des questions, reprise durable, et transport des images et choix en compétition. La correction colore uniquement la bonne carte et grise les autres. Le défi local prépare les médias avant la mise hors ligne ; le contrôle compare le contenu exact de l’image locale avec celui de la fiche source. Il ne modifie pas le modèle enregistré sur le serveur.

Sur téléphone, la zone de question laisse assez de place à l’image et à son titre. L’image est centrée et sa hauteur s’adapte à l’écran. Les contrôles vérifient que l’image entière, les réponses et les commandes ne se coupent ni ne se recouvrent.

Il s’agit d’une extension des micro-questions d’association M06. Les choix restent indépendants à chaque question : l’élimination des paires déjà trouvées et les groupes de six restent ouverts. Le retournement de deux cartes et la recherche de leur jumelle M11 ne sont pas implémentés par ce lot.

Huit tests couvrent 600 configurations réelles sur le thème des fruits, les trois difficultés, les numéros des paires, les cartes réordonnées, les données incomplètes, les remplacements ambigus, les plafonds de choix, les nouvelles graines et la conservation des sources. Le [parcours navigateur](printable-pairs-results.json) vérifie Classe et reprise sur trois tailles d’écran, Solo juste/faux/expiration, et défi local à deux mascottes sans réseau après préparation. Les parcours existants de lisibilité et d’adaptateurs source ont aussi été relancés. Les autres thèmes ne sont pas déclarés relus pédagogiquement par ces tests.

L’inventaire courant contient 714 variantes convertibles sur 2 112, dont les deux familles de jeux ajoutées. Les limites restantes sont conservées dans le [suivi V4](suivi-v4.md). Voir le [relevé qualité du lot](quality-printable-pairs-results.json).

```sh
node --test tests/interactive/printable-pairs.test.mjs
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:interactive:printable-pairs
```
