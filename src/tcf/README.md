# TPF / TCF — tests de français

Banque commune dans `src/tcf/content/{a0-a1,a1-a2,a2-b1}/`. Trois domaines UI :

| Domaine | Id | Titre | Niveaux |
|---|---|---|---|
| TPF | `tpf` | Test de placement de français | A0-A1, A1-A2 **et** A2-B1 |
| TCF CSC | `tcf-csc` | Test de connaissance de français — CSC | A0-A1 seulement |
| TCF CFR | `tcf-cfr` | Test de connaissance de français — CFR | A1-A2 seulement |

Aucun sélecteur de niveau : le domaine fixe les niveaux. L’ancien id `tcf` est migré vers `tpf`.

Le moteur (types `Tcf*`, layout `tcf`, JSON `tcf-…`) reste ici — pas dans `src/math/`.
