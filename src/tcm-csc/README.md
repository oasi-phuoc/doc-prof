# TCM CSC

Variante institutionnelle CSC du test maths.

| Fichier | Rôle |
|---|---|
| `catalog.ts` | Thèmes + type consignes + placeholder |
| `test.ts` | `buildTcmCscTestPages` (page Informations) |
| `generate.ts` | `tryGenerateTcmCscBlock` |
| `informations` partagée | `src/tcm/informations.ts` (même structure que TCM / CFR) |

## Notes

- Id env / code : `tcm-csc` (libellé UI **TCM CSC**)
- Page 1 = Informations (sans contrôles Questions / Colonnes)
- Exercices CSC à préparer ; plus tard, *des* exercices TCM pourront être repris
- Distinct du domaine **ACM** (`src/acm/`, Activités créatives et manuelles)
