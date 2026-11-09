# ClairFLE — studio de la classe

Première livraison C0/C1 et tranche C2/C3/C4 du cahier des charges v3. Le nouveau module se trouve dans `src/interactive/`. Il n’importe aucun composant de l’ancien jeu. La bascule finale et l’extension à toutes les familles restent à réaliser après revue de ce prototype.

## Essayer

```sh
npm ci
npm run dev -- --host 0.0.0.0 --port 5180
```

Avec un compte autorisé, ouvrir `/interactif/demo` : dix questions issues des générateurs existants (addition 788 + 771, une seconde addition, carré de 349 cm, six mini-audios, quatre scènes autour du vélo). Les deux questions numériques de référence sont des items du mode libre. Les audios et les scènes proviennent de la banque réelle, sans nouveaux médias générés.

Depuis le générateur : **Jouer avec la classe**, puis **Commencer la séance**. Depuis la bibliothèque : **Jouer**. Le brouillon reste dans l’historique du navigateur ; un lien enregistré se recharge via l’API de fiches existante.

Le module utilise la graine et les items édités de la recette v1. Il ne modifie ni cette recette ni le générateur A4. Pas de serveur de séance, de compte élève ou de collecte de votes physiques.

## Vérifier

```sh
npm test
npm run interactive:inventory
npm run build
npm run lint
npx playwright install chromium
npm run test:interactive:browser
```

Dans l’environnement cloud, Chromium système est utilisé avec `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium`. Les tests Vite et Chromium nécessitent l’autorisation des ports/processus locaux dans cet environnement restreint. Playwright est l’unique nouvelle dépendance de développement ; aucun nouveau paquet runtime.

`test:interactive:a4` compare l’aperçu à une instance de la version de référence sur le port 5181 (variables `A4_BASELINE_URL`, `INTERACTIVE_TEST_URL`). `test:interactive:saved` utilise une instance sur 5182 démarrée avec `VITE_FICHES_API_URL=http://127.0.0.1:5182/__test_api` ; l’API est entièrement interceptée par le test, sans écriture dans la bibliothèque.

Voir [acceptation](checklist-acceptation.md), [architecture](architecture.md), [audit](audit-compatibilite.md), [sécurité](audit-securite.md) et [captures](design-system.md).
