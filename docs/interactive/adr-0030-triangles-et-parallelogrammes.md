# ADR 0030 — Mesures des triangles et parallélogrammes

Le jeu reprend huit types supplémentaires : périmètre et aire du triangle ou du parallélogramme, côté manquant depuis le périmètre et hauteur manquante depuis l’aire. Cette extension complète les carrés et rectangles de l’ADR 0029 sans changer les banques ni le rendu imprimé.

Les mesures visibles déterminent le résultat, calculé exactement en entiers de précision fixe. Pour le triangle, l’aire vaut base × hauteur ÷ 2 ; pour le parallélogramme, base × hauteur. La recherche d’un côté utilise le périmètre donné et les côtés connus ; la hauteur utilise l’aire donnée et la base. Les cotes affichées, les unités, la consigne complète et les deux champs de corrigé doivent être cohérents. Les mêmes sept unités et limites de précision que l’ADR 0029 s’appliquent.

Les trois côtés d’un triangle doivent respecter strictement l’inégalité triangulaire, y compris quand le troisième côté vient d’être calculé. Le schéma générique du triangle est repris ; les variantes de dessin explicitement rectangle, équilatéral ou isocèle demandent encore une adaptation de leurs cotes et masques. Les champs étrangers à la formule sont refusés.

Certaines fiches sources arrondissent l’aire du triangle à deux décimales : une base et une hauteur de 1,3 cm donnent ainsi un corrigé source de 0,85 cm². Le jeu signale ce tirage comme incompatible, car l’aire exacte est 0,845 cm². La recherche inverse depuis ce corrigé arrondi est également refusée. Aucun tirage ni corrigé imprimable n’est réécrit pour le rendre compatible.

La question conserve la figure et les données utiles en texte, notamment les deux côtés connus du triangle. Une cote cherchée reste marquée « ? » sans valeur numérique dans les données publiques, avant et après correction. Seule la bonne carte reste colorée. Les six cartes portent des unités cohérentes ; elles utilisent les distracteurs numériques déterministes et la compatibilité `assisted`. Tri croissant, nombre de cartes limité, ordre personnalisé, nouvelles graines et reprise réutilisent les mécanismes existants.

Les contextes courts accompagnant une figure sont affichés comme mesures compactes ; les documents plus longs gardent leur lecteur et ses réglages. Les données déjà dans la consigne inverse ne sont pas répétées. Si seule la question nécessite une lecture complète, l’adaptation conserve la grille de cartes courtes. Les lignes du mode défilant réservent la place des boutons de lecture pour empêcher le chevauchement des cartes. Le parcours contrôle chaque carte, son badge, son emplacement dans l’écran et l’absence de chevauchement, au-delà de la seule taille du conteneur.

Le schéma de compétition de l’ADR 0029 accepte déjà ces figures et leurs cotes manquantes. Le défi local sur un appareil est vérifié après coupure du réseau ; l’activation de la compétition Internet reste distincte. Les losanges, trapèzes, cercles, figures composées, doubles calculs et conversions entre unités restent à adapter.

Huit tests supplémentaires couvrent 2 400 configurations réelles (huit types, trois niveaux, cent graines), avec un oracle rationnel indépendant du corrigé source. Ils vérifient les cas exacts, les arrondis et triangles dégénérés refusés, les décimaux, grands entiers, sept unités, cotes masquées, cartes, graines, impression source, persistance et transport en compétition. Le [parcours navigateur](polygon-measures-results.json) vérifie Classe, Solo automatique, reprise et compétition locale sur mobile et ordinateur. Le [relevé de qualité du lot](quality-polygon-measures-results.json) précise les vérifications complémentaires et leurs limites.

```sh
node --test tests/interactive/polygon-measures.test.mjs
npm run test:interactive:polygons
```
