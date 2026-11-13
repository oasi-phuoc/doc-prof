# Extension du catalogue TCF — 13 novembre 2026

L’inventaire général existe déjà dans `src/gallery/catalog.generated.json` et est reconstruit par `scripts/image-gallery-catalog.mjs`. Les classements précis et les correspondances avec les anciens fichiers sont dans `classement-tcf-20261113.json`.

Les cinq types sont Action, Animal, Végétal, Métier et Maladie. Les maladies, symptômes et douleurs sont répartis en sous-thèmes. Les champignons alimentaires sont rangés avec les légumes dans le groupe culinaire ; les sous-thèmes précisent leur nature.

Les originaux sont conservés et restent téléchargeables sous « Version antérieure » lorsqu’une correspondance TCF contrôlée existe. Les images prévues ou générées en attente de contrôle ne remplacent aucun original.

| Type | Sujets prévus | Disponibles et contrôlés | Nouvelles images | Réemplois TCF | Restants |
|---|---:|---:|---:|---:|---:|
| Action | 84 | 84 | 83 | 1 | 0 |
| Animal | 231 | 83 | 69 | 14 | 148 |
| Végétal | 208 | 83 | 68 | 15 | 125 |
| Métier | 171 | 88 | 68 | 20 | 83 |
| Maladie | 100 | 74 | 69 | 5 | 26 |

Les nombres ci-dessus portent sur les concepts de ce lot et non sur la totalité des fichiers de la galerie. La liste de sujets est extensible : elle ne prétend pas épuiser les espèces, métiers ou maladies existants.

Style : peinture numérique semi-réaliste douce du commit `48a753d8`, contours fins, sujets entiers, paysage 4:3, aucun montant ou date. Chaque publication conserve le prompt, les références, le PNG source et les empreintes. Les fichiers sont encodés en WebP sans découpe ou redimensionnement.

La liste exacte de tous les sujets, statuts et productions manquantes est dans `extension-tcf-20261113.json` ; les noms par famille sont dans `sujets-tcf-20261113.json`.
