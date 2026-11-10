# Feuille de séance enseignant — F27

Le bouton **Télécharger la feuille enseignant** de la préparation génère `clairfle-enseignant.html`. Il contient les corrigés : **ENSEIGNANT — NE PAS PROJETER**. Ouvrir ce fichier puis utiliser Imprimer, au format A4. Aucune fenêtre secondaire ni aucun serveur n’est nécessaire à sa création ou à son impression.

La feuille utilise le plan réellement retenu, après sélection et exclusion des médias : numéros globaux, énoncés abrégés à 80 caractères, lettre, nom de couleur, valeur de couleur et forme de la bonne carte, texte et image de réponse, explication et relances disponibles. Les activités ouvertes conservent leur modèle et n’obtiennent aucune bonne carte inventée. Les notes vides laissent de la place à une annotation manuscrite.

Pour deux questions audio, les mêmes positions A–C / D–F que la projection sont reprises. Les tracés des formes proviennent du même registre vectoriel que l’écran et les cartes imprimées. Le `planId` SHA-256 de la séance figure dans le pied de page.

Les images correctes sont incorporées dans le fichier, sous les mêmes règles d’origine que le jeu : quatre chargements parallèles, huit secondes, deux Mio par image et vingt Mio au total. Si une image manque, le fichier le signale et conserve les repères de carte. Le document généré ne contient aucun script et n’effectue aucune requête réseau à l’ouverture ; les textes source sont échappés.

Une modification du plan, des couleurs ou des formes signale que la feuille précédente est obsolète. Cette référence est conservée pendant la préparation et la séance courantes ; le pied de page permet de vérifier aussi les fichiers déjà enregistrés. Les corrigés ne sont jamais montés dans le DOM de la préparation ou du jeu pour fabriquer cette feuille : ils sont uniquement placés dans le fichier téléchargé après action explicite.

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium node tests/interactive/teacher-sheet-browser.mjs
```

Le test compare le plan du fichier et celui de la séance, décode les images incorporées, vérifie les positions B / E de deux QCM audio, produit un PDF A4 depuis le document et vérifie l’alerte d’obsolescence. Les résultats sont conservés dans `teacher-sheet-results.json`.
