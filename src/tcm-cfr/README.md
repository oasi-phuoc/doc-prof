# TCM CFR

Test de connaissance de mathématiques — variante institutionnelle CFR (29 exercices affichés, 28 types).

| Fichier | Rôle |
|---|---|
| `catalog.ts` | Thèmes + 28 types `tcm-cfr-ex01`…`ex28` + consignes |
| `test.ts` | Recette multi-pages (`buildTcmCfrTestPages`), barèmes |
| `items.ts` | Générateurs déterministes |
| `audio-nombres.ts` | Composition d’audios 1–1000 (+ `fois.mp3`) |
| `metro.ts` | 5 plans de métro (lieux suisses) |
| `symetrie.ts` | 10 modèles de symétrie axiale |
| `generate.ts` | Réexport vers `math/generate.ts` |

## Notes

- Id env / code : `tcm-cfr` (libellé UI **TCM CFR**)
- Sélection du domaine → charge automatiquement toutes les pages du test
- Audios nombres : `public/lib/audio/nombre/{1..100}.mp3` + `cent` / `mille` + `fois.mp3`
- Distinct du domaine **TCM** (`src/tcm/`) et de **TCM CSC**

## Paramètres du repère (exercice affiché 29)

Les paramètres de l’activité permettent de choisir un ou deux carrés par unité et un maximum de 3 à 30 sur chaque axe. Le quadrillage conserve une surface de 144 × 144 mm ; seuls le nombre de cases et leur taille changent. Chaque unité porte son trait de graduation. Modifier ces réglages régénère les points et les questions du bloc, y compris depuis un tirage enregistré.

Le triangle de l’exercice affiché 25 est construit avec une base plus courte que les deux autres côtés, une hauteur extérieure exacte et un dessin proportionnel aux mesures. Les grilles de calcul gardent leurs fonds légers dans le PDF, même si l’impression des fonds est désactivée.
