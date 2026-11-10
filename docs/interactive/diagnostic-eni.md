# Diagnostic de l’écran — F25

Depuis la préparation du jeu, le lien **Diagnostic de l’écran** ouvre `/interactif/diagnostic` dans un autre onglet. La fiche préparée reste ouverte. L’accès utilise le même contrôle que les autres routes interactives ; la page ne consulte aucune fiche enregistrée.

La page relève l’agent utilisateur, les dimensions, le rapport de pixels, les pointeurs déclarés, les API présentes, les préférences de l’appareil et l’état réseau annoncé par le navigateur. Une capacité présente est séparée du résultat de son test.

Tests proposés :

- Stockage : écriture puis lecture dans une base temporaire dédiée, supprimée après le contrôle ; les séances existantes ne sont pas lues ni modifiées. Quota et utilisation sont des estimations du navigateur.
- Son : bref signal à faible volume après un geste. Le navigateur confirme le démarrage, l’enseignant vérifie l’écoute ; aucune permission micro n’est demandée.
- Maintien éveillé et plein écran : demande explicite, refus affiché et libération du verrou en quittant la page.
- Réactivité : dix contacts, mesure jusqu’à la prochaine trame ; indicateur navigateur et non mesure de latence matérielle complète.
- Paume : nombre de contacts simultanés effectivement observés, avec gestion des annulations et pertes de capture.
- Six aplats : même palette et mêmes formes que les cartes ; flèches pour changer de carte et plein écran sur geste.
- Polices : espaces U+202F / U+00A0, unités et chiffres tabulaires à comparer visuellement.

Le rapport Markdown est copiable ou téléchargeable sous `diagnostic-eni.md`. Il ne contient ni cookie, ni secret, ni fiche, ni donnée d’élève, et n’est envoyé à aucun serveur. Il conserve « non testé » pour chaque action non effectuée. Le navigateur peut refuser le presse-papiers ; la zone de texte permet la copie manuelle.

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium node tests/interactive/diagnostic-browser.mjs
```

Les tests automatisés simulent dix touchers et deux contacts simultanés, vérifient le vrai stockage local, le démarrage audio, le rapport téléchargé, la route directe et les API indisponibles. Un rapport généré dans Chromium de test ne constitue pas une validation sur l’ENI réel. Pour cette dernière, ouvrir cette page sur l’appareil de classe et conserver son rapport avec les observations de l’enseignant.
