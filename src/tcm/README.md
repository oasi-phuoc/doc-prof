# TCM — Test de connaissance de mathématiques

Miroir de `src/tcf/` : domaine à part, **pas** dans `src/math/`.

| Fichier | Rôle |
|---|---|
| `test.ts` | Recette multi-pages, consignes, helpers UI (`isTcmDomain`, points…) |
| `items.ts` | `tryGenerateTcmItems` — tous les générateurs `tcm-*` (dispatch depuis `math/generate.ts`) |
| `conversions.ts` | Exercices conversions |
| `equations.ts` | Équations |
| `evaluer.ts` | Évaluer des expressions |
| `priorite.ts` | Priorité des opérations |
| `proportion-kg.ts` | Proportionnalité |
| `reduire.ts` | Réduire des expressions |
| `index.ts` | Réexports |

## Variantes ACM (env)

Les ids d’accès `tcm-csc` et `tcm-cfr` (libellés UI **ACM CSC** / **ACM CFR**) réutilisent la même recette TCM via `isTcmDomain`, et préremplissent le niveau de classe CSC / CFR. Pas d’id `acm` distinct dans le code — Phuoc Van a exposé `tcm-csc` / `tcm-cfr` dans les env.

Imports : `@/tcm/test`, `@/tcm/items`, `@/tcm/evaluer`, ou `@/tcm`.
