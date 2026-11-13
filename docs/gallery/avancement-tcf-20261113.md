# Extension du catalogue TCF — 13 novembre 2026

L’inventaire général existe déjà dans `src/gallery/catalog.generated.json` et est reconstruit par `scripts/image-gallery-catalog.mjs`. Les classements précis et les correspondances avec les anciens fichiers sont dans `classement-tcf-20261113.json`.

Les cinq types sont Action, Animal, Végétal, Métier et Maladie. Les maladies, symptômes et douleurs sont répartis en sous-thèmes. Les champignons alimentaires sont rangés avec les légumes dans le groupe culinaire ; les sous-thèmes précisent leur nature.

Les originaux sont conservés et restent téléchargeables sous « Version antérieure » lorsqu’une correspondance TCF contrôlée existe. Les images prévues ou générées en attente de contrôle ne remplacent aucun original.

| Type | Sujets prévus | Disponibles et contrôlés | Nouvelles images | Réemplois TCF | Restants |
|---|---:|---:|---:|---:|---:|
| Action | 84 | 84 | 83 | 1 | 0 |
| Animal | 231 | 151 | 137 | 14 | 80 |
| Végétal | 208 | 154 | 139 | 15 | 54 |
| Métier | 171 | 144 | 124 | 20 | 27 |
| Maladie | 100 | 98 | 93 | 5 | 2 |

Les nombres ci-dessus portent sur les concepts de ce lot et non sur la totalité des fichiers de la galerie. La liste de sujets est extensible : elle ne prétend pas épuiser les espèces, métiers ou maladies existants.

Style : peinture numérique semi-réaliste douce du commit `48a753d8`, contours fins, sujets entiers, paysage 4:3, aucun montant ou date. Les métiers des derniers lots reprennent la première version d’architecture retenue dans `docs/tcf/choix-versions-metiers-20261113.json`. Les références effectivement fournies sont consignées pour chaque création.

Le dépôt contient les WebP diffusés, les prompts, les références et les empreintes. Les PNG sources des créations de ce lot sont conservés dans l’environnement de travail, au chemin consigné dans chaque fiche ; ils ne sont pas versionnés. Les WebP sont encodés sans découpe ni redimensionnement.

Le service d’images a refusé la poursuite avec HTTP 429 `usage_limit_reached`. Réinitialisation annoncée : 2026-11-14T14:30:55+01:00 (heure de Zurich). Les productions manquantes et échecs sont conservés pour la reprise.

Santé : Maladies et affections : 58/60 ; Symptômes : 15/15 ; Douleurs et parties du corps : 25/25.

L’[inventaire CSV des 631 sujets contrôlés](catalogue-tcf-controle-20261113.csv) donne les libellés, types, fichiers, réemplois et empreintes. La [liste des 163 sujets restants](images-restantes-20261113.md) distingue les productions à faire des corrections visuelles.

La liste complète des sujets et statuts est dans `extension-tcf-20261113.json` ; les noms par famille sont dans `sujets-tcf-20261113.json`. `generation-file-sujets-20261113.json` est la file de reprise, reconstruite avec `scripts/prepare-gallery-subject-jobs.py` après ce rapport. Aucune image en attente ou rejetée ne doit être activée sans contrôle visuel.
