# Catalogue d’images — Actions inédites, lot 01 (10 images)

> **État : à générer.** Cette liste est un cahier de production, pas la preuve que les images existent. Catalogue de référence : [références par type](references-visuelles-par-type-20261123.md). Vérification des verbes : index `src/francais/phrase-action-pictures.generated.json` (242 entrées consultées le 23 novembre 2026). Vérifier aussi les fichiers réellement présents avant chaque génération pour éviter les doublons hors de cet index.

## Consignes communes

- **10 images distinctes, 1 verbe différent par image**, une seule action principale lisible ; ne jamais créer une planche de dix scènes comme fichier de catalogue.
- Format image **4:3 paysage** ; peinture numérique semi-réaliste détaillée, modelés doux, contours fins, couleurs naturelles chaleureuses, arrière-plan peint et sobre, sans texte ni typographie.
- Comparer les résultats aux références visuelles de `docs/tcf/style-images.md`, notamment `co834-club-musique-dessine.webp` et `co834-club-photo-dessine.webp`. Éviter photo, 3D, gros contours BD, personnages coupés.
- Cible envisagée : `public/lib/images/tcf/catalogue/actions/` ; conserver des noms de fichiers en minuscules sans accents, un WebP par illustration.
- Après génération : **contrôler réellement chaque image**, renseigner titre et mots-clés uniquement d’après ce qui est visible, empreinte du fichier et état de revue dans `docs/gallery/audit-mots-cles-tcf-20261117.json`. Régénérer le catalogue avec `node scripts/image-gallery-catalog.mjs` et vérifier la recherche, conformément à `.claude/skills/catalogue-images/SKILL.md`.
- Ajouter ensuite les images validées au catalogue ; ne pas ajouter de liens d’images qui n’existent pas.

## Lot 01

| N° | Verbe | Fichier cible | Illustration prévue | État |
|---:|---|---|---|---|
| 1 | **Visser** | `actions/visser-une-vis.webp` | Une personne fixe une vis avec un tournevis dans une planche en bois ; vis, tournevis et main visibles, geste crédible. | À générer |
| 2 | **Dévisser** | `actions/devisser-une-vis.webp` | Une personne retire une vis d'une charnière avec un tournevis ; montrer clairement le desserrage. | À générer |
| 3 | **Éplucher** | `actions/eplucher-une-pomme-de-terre.webp` | Une personne épluche une pomme de terre avec un économe ; pelures visibles dans un bol. | À générer |
| 4 | **Peser** | `actions/peser-des-fruits.webp` | Une personne pose des pommes sur une balance de cuisine ; geste et balance lisibles, aucun chiffre lisible. | À générer |
| 5 | **Balayer** | `actions/balayer-le-sol.webp` | Une personne pousse des miettes avec un balai vers une pelle posée au sol. | À générer |
| 6 | **Passer l’aspirateur** | `actions/passer-l-aspirateur.webp` | Une personne passe l’aspirateur sur un tapis ; tuyau et tête d'aspiration visibles. | À générer |
| 7 | **Repasser** | `actions/repasser-une-chemise.webp` | Une personne repasse une chemise sur une planche à repasser ; fer tenu correctement. | À générer |
| 8 | **Percer** | `actions/percer-une-planche.webp` | Une personne utilise une perceuse pour percer une planche solidement posée sur un établi ; mains et foret visibles. | À générer |
| 9 | **Brancher** | `actions/brancher-une-lampe.webp` | Une personne branche la fiche électrique d'une lampe dans une prise murale ; geste lisible, sans danger manifeste. | À générer |
| 10 | **Trier** | `actions/trier-des-dechets.webp` | Une personne trie des bouteilles et papiers dans deux bacs distincts, sans logos ni textes. | À générer |

## Critères de réception

- Les dix fichiers existent et sont des images indépendantes ; chaque geste est immédiatement compréhensible, sans ambiguïté avec un autre verbe.
- Aucune action déjà illustrée n'a été dupliquée involontairement ; les dix verbes diffèrent entre eux.
- La cohérence du style a été vérifiée visuellement, le registre de mots-clés a été mis à jour après inspection et le catalogue régénéré.
- Un **lot 02 de dix nouveaux verbes** ne doit être constitué qu’après une nouvelle vérification des entrées existantes, en excluant celles du lot 01.
