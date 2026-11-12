# ADR 0034 — Triangles : dessins et reconnaissance

Les triangles équilatéral, isocèle et rectangle deviennent disponibles dans les questions de noms et de propriétés du jeu, y compris dans les cartes CFR 16–17. Cette étape clôt l’exclusion provisoire décrite dans les ADR 0032 et 0033.

Le dessin équilatéral sans mesures avait deux côtés de 150 unités et une base de 180. Sa base vaut maintenant `240 / √3` pour une hauteur de 120 : ses trois côtés mesurent environ 138,564 unités et ses trois angles valent 60°. Cette correction s’applique aussi aux figures nues imprimées. Les schémas portant des cotes gardent leur disposition et leurs libellés ; ils restent des schémas de calcul.

Les tests mesurent les sommets du SVG réellement rendu. Ils calculent séparément les longueurs, les angles et les axes de réflexion, puis comparent ces résultats aux réponses du jeu. Le triangle rectangle dessiné est scalène ; le triangle quelconque n’a ni côtés égaux, ni angle droit, ni axe de symétrie. La consigne de nom demande le nom le plus précis, pour distinguer un équilatéral d’un isocèle et d’un triangle générique. « Triangle quelconque » n’est pas proposé comme fausse réponse face au nom générique « triangle » de la banque de noms.

| Source | Couverture vérifiée |
|---|---|
| `figures-nommer` | Les 16 formes, dont les quatre variantes de triangles |
| `figures-proprietes` | 10 variantes relues, 39 questions ; les trois variantes de propriétés des trapèzes restent signalées |
| CFR 16 | Trois cartes générées, neuf questions, aucune carte triangulaire exclue |
| CFR 16–17 en choix libre | Dix figures relues, dont les trois triangles spécifiques |

La conversion conserve les contrats exacts des cartes, les références source et les modèles enregistrés. Elle montre uniquement la figure nue avant correction. Une réponse ou propriété altérée, un sous-type inconnu ou une carte mesurée ne peut pas produire un verdict de reconnaissance. Les 206 corrigés inconnus de la banque de logique restent exclus du score automatique.

Les huit tests de reconnaissance couvrent 900 configurations et les six tests CFR en couvrent 600. Quatre nouveaux tests vérifient indépendamment les dessins, les propriétés, les noms sur 100 graines et la conservation des schémas cotés. La suite complète passe avec 251 tests. Le [parcours navigateur](recognition-results.json) vérifie les trois triangles en Classe sur 390 × 844, 1 366 × 768 et 360 × 640, le Solo avec réponse juste, erreur et expiration, ainsi que le défi local hors ligne après préparation. Les formes projetées sont aussi mesurées à leur taille réelle à l’écran ; les contrôles axe passent.

Le [PDF A4](triangles-a4-exemple.pdf) contient la fiche des trois triangles et son corrigé, sans dépassement du pied de page. Les propriétés géométriques des deux pages sont contrôlées dans le navigateur. La fiche témoin addition/carré reste identique à la référence `0addb36d662842040cc8ed64e8b2c0ca81eac810`. Ces contrôles ne remplacent pas un essai sur le matériel de classe.

```sh
node --test tests/interactive/{recognition,cfr-recognition,triangle-recognition}.test.mjs
npm run test:interactive:recognition
```

Voir le [relevé qualité](quality-triangle-recognition-results.json) et le [contrôle d’impression](triangles-print-results.json). Les nouvelles synthèses CSC/CFR restent reportées à la demande du propriétaire ; aucun clip n’est généré ni activé dans cette étape.
