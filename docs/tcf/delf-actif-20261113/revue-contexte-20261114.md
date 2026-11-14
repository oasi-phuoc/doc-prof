# Relecture contextuelle des 1 021 questions — 14 novembre 2026

Périmètre figé sur le commit `55677f813` : les 1 021 questions qui attendaient une relecture de contexte, sur 323 supports. Ce périmètre ne comprend pas les 236 trios déjà actifs ni les 134 candidats déjà concrets.

La revue des questions est terminée. Chaque décision résulte de la lecture du support complet et des trois réponses, avec citation source et contraintes. Aucune nouvelle écoute humaine n’est attestée. Une candidature visuelle n’est pas un trio illustré ou approuvé. Aucune image n’a été générée ou activée pendant cette revue.

Les **1 021 questions** sont examinées : 208 A1, 363 A2 et 450 B1. Il reste **zéro question** à relire dans ce périmètre. La revue retient **376 candidatures** à vérifier visuellement et **645 questions à conserver en texte**.

| Niveau | Questions relues | Candidatures visuelles | Texte | Questions corrigées |
|---|---:|---:|---:|---:|
| A1 | 208 | 110 | 98 | 4 |
| A2 | 363 | 162 | 201 | 14 |
| B1 | 450 | 104 | 346 | 23 |
| Total | 1 021 | 376 | 645 | 41 |

Les **41 corrections sont appliquées** aux banques. Elles éliminent notamment les seuils imbriqués « plus de 80 / plus de 20 / plus de 50 », les ajouts non dits dans la source comme « le week-end », les réponses de catégories différentes comme texture et longueur des cheveux, des leurres anachroniques et des formulations qui attribuaient un oubli ou un prêt sans preuve. Les bonnes réponses gardent leur identifiant ; leur modèle écrit est mis à jour quand leur formulation change.

Le [journal des corrections](corrections-contexte-20261114.json) conserve chaque avant/après, sa citation, sa justification et les empreintes de la transcription et du MP3. Le générateur du plan reprend les décisions individuelles seulement si la source, l’audio et la question relue sont encore identiques ; il refuse une preuve périmée.

Le [registre JSON](revue-contexte-20261114.json) conserve les sources, empreintes, trois réponses originales et relues, citations et décisions individuelles. La revue ne porte pas sur les 642 autres questions du plan, déjà classées ou illustrées. Après cette revue : vérifier la catégorisation des audios pour élargir les banques de scénarios avec les dialogues appropriés, puis reprendre les images.

```sh
python3 scripts/prepare-delf-actif-images.py
python3 scripts/check-delf-actif-images.py
python3 scripts/check-delf-actif-context-review.py --audit-only
```
