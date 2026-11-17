# Réglages de mise en page TCF — 17 novembre 2026

Les réglages suivants sont disponibles dans TCF CSC, TCF CFR et TPF.

- **Audio complet :** le bouton de page dans la marge de chaque question à partir de la deuxième permet de commencer cette question sur une nouvelle feuille. Une autre activation annule la coupure. Les fragments conservent leur bandeau audio, les numéros, les choix, les modes de réponse et les points ; le titre et le total de l’exercice apparaissent sur la première feuille.
- **CE :** un nouveau tirage utilise par défaut cinq questions, dans la limite du support. « Nombre de questions » permet de choisir davantage de questions jusqu’au total disponible. Les éditions et sélections explicites sont conservées.
- **Paramètres → Police de la fiche :** choix entre le style classique actuel, DM Sans proche d’Arial, et le style géométrique Didact Gothic, proche de Century Gothic. Ce choix se trouve avec la taille du texte et est enregistré avec la fiche.
- **Paramètres de l’activité → Police du texte CE :** choix indépendant entre Classique, Géométrique, Marelle et Playwrite. Ce réglage s’applique au document de lecture au format Texte. Le titre d’exercice et les questions suivent la police globale. Les titres et illustrations déjà intégrés dans une image CE appartiennent à cette image.
- **Cadre CE :** les cadres des SMS, courriels, annonces et documents d’association suivent la couleur du thème, y compris la séparation d’en-tête des courriels.

Le choix global de police, celui du document CE et les coupures internes sont conservés dans la recette enregistrée. Les anciennes recettes restent lisibles. Les polices sont embarquées localement ; Didact Gothic est fournie avec sa licence libre et son empreinte dans `public/fonts/worksheet`.

Les banques, fichiers audio et illustrations ne sont pas modifiés par cette reprise. Le suivi des images reste à 273 trios historiques et 380 candidats DELF Actif ; les autres tâches restent dans le [bilan du cahier des charges](bilan-cahier-des-charges-20261111.md).

## Vérification

- 21 tests passent : réglages, conservation des réponses et des points, coupures anciennes et nouvelles, recettes enregistrées, droits d’accès et pagination des transcriptions.
- Quatre parcours Chromium passent : CSC, CFR et TPF sur ordinateur, puis CSC sur mobile. Les deux polices de fiche et les quatre polices CE sont chargées et vérifiées ; changer le thème met à jour le cadre. Les coupures sont annulables, y compris celles des anciennes fiches.
- Enregistrement et réouverture de la recette vérifiés avec une API simulée ; aucun enregistrement sur le serveur de production n’est effectué par ces essais.
- Les vues élève et corrigé sont contrôlées en impression, sans chevauchement des questions avec le pied de page et sans boutons de réglage imprimés.
- TypeScript, compilation de production, plafonds de poids, 2 460 variantes QCM, banque TCF et catalogue des jeux passent.
- Les 19 tests des catalogues image et audio passent après la fusion des trois dernières modifications de `main`. Leurs changements de jeux et de fractions sont conservés. Le catalogue compte 697 types de jeu.

Les réglages de police et leurs styles sont chargés avec les fiches ; les polices de l’interface et les sept plafonds de poids restent inchangés. Les résultats détaillés sont dans [la preuve navigateur](reglages-mise-en-page-20261117-browser.json) et [le relevé de vérification](verification-reglages-mise-en-page-20261117.json).
