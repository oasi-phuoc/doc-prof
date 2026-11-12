# ADR 0035 — Propriétés des trapèzes

Les trois variantes de trapèzes du générateur de propriétés deviennent jouables : rectangle, isocèle et quelconque. Leurs treize questions complètent les trente-neuf questions déjà disponibles. Les treize figures du générateur `figures-proprietes` produisent désormais cinquante-deux questions sans exclusion.

| Dessin | Paires de côtés parallèles | Angles droits | Axes de symétrie | Côtés non parallèles |
|---|---|---|---|---|
| Trapèze rectangle | 1 | 2 | 0 | Longueurs différentes |
| Trapèze isocèle | 1 | 0 | 1 | Longueurs égales |
| Trapèze quelconque | 1 | 0 | 0 | Longueurs différentes |

Les tests utilisent les sommets du SVG réellement rendu pour calculer les parallélismes, les angles droits, les longueurs des côtés et les axes de réflexion. Le contrôle des axes reflète tous les sommets autour des directions candidates passant par le centre du polygone. Les dessins existants sont cohérents ; aucune modification du rendu géométrique imprimable n’est nécessaire dans cette étape.

Les propriétés textuelles reçoivent des questions adaptées. « 1 paire » répond à une question sur les paires de côtés parallèles, avec des choix exprimés dans la même unité. La relation « égaux » du trapèze isocèle répond à « Comment sont les deux côtés non parallèles de cette figure ? », avec « différents » comme alternative. Les autres nombres et noms reprennent les mécanismes existants.

Le nom le plus précis est demandé. Les variantes de propriétés conservent leurs noms spécifiques ; les questions de noms génériques gardent leurs propositions source. Les propriétés, leur ordre et le corrigé complet doivent correspondre au contrat relu. Une édition incohérente, un sous-type inconnu ou des mesures ajoutées restent signalés avant tout score automatique. Les 206 corrigés inconnus de la banque de logique demeurent exclus.

Quatre nouveaux tests couvrent la géométrie indépendante, cent graines, les éditions invalides et le transport des réponses en Classe, Solo et compétition. Les huit tests généraux vérifient toujours neuf cents configurations, désormais avec les treize figures. La suite complète passe avec 255 tests. Le [parcours de reconnaissance](recognition-results.json) comprend les trapèzes aux trois tailles d’écran, une réponse Solo correcte, une erreur, une expiration et le défi local à deux mascottes après mise hors ligne. Le [contrôle de la consigne finale](trapezoid-text-results.json) vérifie aussi son affichage et axe en 390 × 844, 1 366 × 768 et 360 × 640.

Les références source, les graines, les choix, la correction dans les cartes et la conservation des modèles enregistrés sont maintenus. L’inventaire reste à 712 variantes convertibles sur 2 111 : cette étape complète une famille déjà comptée. Les autres familles, les essais matériels et les travaux d’authentification du suivi V4 restent ouverts. Les nouvelles synthèses audio restent reportées.

```sh
node --test --test-concurrency=1 tests/interactive/{recognition,trapezoid-recognition}.test.mjs
npm run test:interactive:recognition
```

Voir le [relevé qualité du lot](quality-trapezoid-recognition-results.json).
