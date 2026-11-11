# TCM CSC

Le test complet demandé dans `tcmcsc.txt` est maintenant implémenté. Voir le [guide et les preuves](../../docs/tcm-csc/README.md) pour les 23 exercices, l’exercice 21 réservé, les 103 modèles de problèmes, le mode libre et les trois pistes audio.

Variante institutionnelle CSC du test maths.

| Fichier | Rôle |
|---|---|
| `catalog.ts` | Informations et 23 types d’exercices |
| `test.ts` | Recette des quinze pages et barème par défaut |
| `items.ts`, `generate.ts` | Tirages déterministes et réutilisation des générateurs |
| `problem-bank.ts`, `problems.ts` | 103 contextes à nombres variables |
| `recalculate.ts` | Recalcul et validation du mode libre |
| `audio.ts` | Trois WAV groupés dans un ZIP |
| `../tpm/informations.ts` | Page d’informations partagée avec TPM / CFR |

## Notes

- Id env / code : `tcm-csc` (libellé UI **TCM CSC**)
- Page 1 = Informations (sans contrôles Questions / Colonnes)
- L’exercice 21 est réservé ; les exercices 22–24 conservent leurs numéros
- Distinct du domaine **ACM** (`src/acm/`, Activités créatives et manuelles)
