# Images d’heures à aiguilles

Les 72 images `public/lib/images/tcf/qcm-audit/*horloge*.webp` ainsi que les quatre affichages numériques isolés du thème vocabulaire `heure-horloge` utilisent désormais un cadran analogique en bois. Les noms historiques restent inchangés pour que les fiches enregistrées continuent à fonctionner. Les horaires collectifs et emplois du temps restent des documents, et les anciens cadrans déjà analogiques sont conservés.

Le fond commun `public/lib/images/tcf/clock-assets/cadran-bois-sans-aiguilles.webp` a été créé avec `image_gen`. Les aiguilles sont rendues géométriquement dans Chromium pour garantir les heures : angle des minutes = 6 × minute ; angle des heures = 30 × (heure modulo 12) + 0,5 × minute. L’aiguille des heures avance donc entre les chiffres. Les dimensions de chaque image existante sont conservées.

Pour reproduire les images avec Chromium et ImageMagick installés :

```sh
npm install --prefix /tmp/doc-prof-browser --no-audit --no-fund playwright
node scripts/replace-digital-clocks.mjs /tmp/doc-prof-browser/node_modules/playwright/index.mjs
```

L’inventaire est contrôlé avant écriture (76 fichiers). Les questions, choix, bonnes réponses, transcriptions et audios ne sont pas modifiés. Les anciens alias comportant « numérique » restent acceptés pour la compatibilité ; les libellés visibles du catalogue ont été adaptés.
