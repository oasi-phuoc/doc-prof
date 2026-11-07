# Objets et quantités des QCM TCF

## Reprise du 6 novembre 2026 — CO OBJET

Les **130 emplacements d’images principales des 26 banques CO OBJET** ont été harmonisés au style peint validé du commit `48a753d8`, en paysage 4:3 : nouvelles illustrations ou réutilisations relues. Le stylo de la piste 55-1 est bien bleu, comme dans l’audio. Les objets sont isolés sur fond crème ; les images de lieux conservent leur décor. Les identifiants, textes et audios sont conservés, ainsi que les fichiers originaux du vocabulaire. Une correction du corrigé est consignée : « voiture » est entendue même dans une phrase négative et vaut OUI pour la reconnaissance lexicale.

Le [rapport de reprise](../../../../../../docs/tcf/reprise-images-20261106.json) donne les correspondances et empreintes. La plupart des nouvelles images partagées CE/CO sont dans `../../qcm-audit/`. Le contrôle `python3 scripts/check-tcf-object-images.py` vérifie encore les 130 fichiers originaux et les 202 usages historiques, tout en acceptant uniquement les remplacements audités.

## Tirage objet du 7 novembre 2026

Le catalogue `src/tcf/object-images.json` regroupe 211 concepts illustrés. Le tag `objet` est calculé depuis la transcription de la piste exacte : au moins trois concepts distincts admissibles. Les synonymes et noms composés ne multiplient pas artificiellement les objets. Les 107 pistes éligibles sont répertoriées dans `docs/tcf/objets-tirage-20261107.json`. Le tirage utilise trois concepts nommés et deux absents, puis mélange les cinq positions. Les banques historiques restent disponibles pour les fiches enregistrées.

## Lot historique des douze objets et quantités


Les objets isolés sont rangés ici, sur **fond blanc uni opaque**, sans décor. Le dossier voisin `bg/` est réservé aux lieux et décors.

Les 12 images ont été entièrement régénérées : 5, 8 et 10 tomates ; 6, 10 et 12 œufs ; 3, 6 et 10 DVD ; les cornichons ; le hamburger et ses frites ; le disque volant. Les neuf quantités ont été recomptées visuellement. Tous les objets sont entiers, distincts et sans chevauchement dans les images à compter.

Style BD semi-réaliste en couleur, contours fins, ombres légères, sans texte, nombre imprimé, personnage, logo ou signature. Les noms de fichiers sont conservés et les choix des QCM pointent vers ce dossier.

Les correspondances sont dans [`scripts/tcf-qcm-image-registry.json`](../../../../../../scripts/tcf-qcm-image-registry.json) ; `manifest.json` conserve les briefs et les validations.
