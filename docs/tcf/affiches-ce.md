# Affiches de compréhension écrite — TCF CSC

Le toggle **Texte / Image** des paramètres CE conserve le même exercice et les mêmes questions. **Image** compose une affiche avec un titre, les informations du document et des illustrations. L’affiche est placée sur sa propre feuille, puis les questions suivent par groupes de trois. Les textes longs sont répartis sur plusieurs affiches pour rester lisibles. Le texte source est conservé intégralement, y compris les horaires, prix, dates, adresses et consignes nécessaires aux réponses.

Les affiches utilisent le composant `CePoster` : elles restent lisibles et sélectionnables dans la fiche, et leurs illustrations peuvent être remplacées en mode libre. Les documents d’association conservent aussi le tableau des personnes et la correspondance des documents.

Les exports WebP de la banque CSC se trouvent dans `public/lib/images/tcf/ce-affiches/`. Le catalogue `src/tcf/content/ce-posters.json` les rend accessibles dans le sélecteur d’images : rechercher le titre du texte ou « Affiches CE ».

Pour les régénérer avec Chromium et ImageMagick disponibles :

```sh
npm install --prefix /tmp/doc-prof-browser --no-audit --no-fund playwright
node scripts/generate-ce-posters.mjs /tmp/doc-prof-browser/node_modules/playwright/index.mjs
```

Le script vérifie le texte affiché avant chaque export, sans dépendre d’un OCR. Seuls les espaces de mise en page sont neutralisés pour comparer les listes HTML. Les mots, chiffres et signes de ponctuation sont comparés au texte source. Les images d’illustration doivent charger correctement pour que l’export aboutisse. La hauteur s’adapte au contenu pour ne rien couper.
