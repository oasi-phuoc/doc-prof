# TCM CFR

Test de connaissance de mathématiques — variante institutionnelle CFR (28 exercices).

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
