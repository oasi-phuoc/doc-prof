# ADR 0032 — Reconnaissance des formes et propriétés simples

Le jeu reprend `tcm-csc-ex17`, `figures-nommer` et `figures-proprietes`. Chaque forme CSC devient une question indépendante, avec les quatre noms de la fiche comme cartes. La banque générique permet de reconnaître treize formes planes et solides : les trois sous-types de triangles restent signalés. Six familles de propriétés sont vérifiées : carré, rectangle, losange, parallélogramme, cercle et ovale. Chaque ligne devient une question, notamment les côtés égaux, angles droits et axes de symétrie. Le cercle propose bien « une infinité » ; l’ovale non circulaire possède deux axes.

L’adaptateur exige un dessin simple sans mesure ni autre calcul et compare le nom, les lignes de propriétés et le corrigé au contrat relu. Une édition incohérente, des formes CSC répétées, une cote ajoutée ou un sous-type non vérifié sont signalés dans la préparation. La question publique contient uniquement le dessin nu ; aucun nom, corrigé ou propriété résolue n’est ajouté au SVG. Les choix de noms demandent le nom le plus précis pour distinguer, par exemple, carré et rectangle. Les identifiants des mots ne désignent pas leur rang source.

Les cartes, plafonds de choix, graines, ordre personnalisé, corrections et instantanés réutilisent le moteur commun. Les nouvelles parties CSC renouvellent l’ordre des formes. Le générateur générique de formes est indexé : ses dessins restent identiques, tandis que les distracteurs et leurs positions changent avec la graine. Les modèles enregistrés et les fiches imprimées ne sont pas modifiés par la conversion. En Classe, aucune sélection au tableau n’est requise. Le Solo corrige la sélection ou le temps écoulé puis avance automatiquement. Le défi local conserve le dessin et fonctionne sur un appareil après préparation hors ligne ; le contrat de compétition en ligne conserve également la figure publique sans transmettre sa clé avant révélation.

Sur mobile, une question courte avec dessin dispose de suffisamment de hauteur pour montrer la forme entière. Le lecteur de contenus longs reste disponible pour les autres activités. Les tests vérifient séparément la figure, les cartes et les commandes, y compris en 360 × 640.

## Banque de logique à vérifier

L’import `scripts/tmp-import-logique.mjs` indique explicitement que la réponse est inconnue du document élève et pose `correctIndex: 0` par défaut. Les 206 entrées importées ont cette valeur. Une égalité avec ce champ ne prouve donc pas la bonne réponse : les activités `logique` restent signalées avant tout score automatique. Leur impression et leur banque ne sont pas réécrites dans ce lot. Les sous-types de triangles et les propriétés des trapèzes demandent aussi une validation de leurs dessins avant extension.

Huit tests couvrent 900 configurations réelles (trois types, trois niveaux, cent graines), les faits géométriques revus, les éditions invalides, les cartes, les graines, le papier, la reprise et le transport en compétition. Le [parcours navigateur](recognition-results.json) vérifie trois tailles d’écran, la correction dans les cartes, la figure entière, une reprise sur les axes du cercle, le Solo automatique et le défi local hors ligne. Voir le [relevé qualité du lot](quality-recognition-results.json).

```sh
node --test tests/interactive/recognition.test.mjs
npm run test:interactive:recognition
```
