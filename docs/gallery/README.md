# Galerie d’images

La rubrique `/images` est accessible par l’icône image du menu supérieur. Elle partage l’accès du créateur de fiches, mais reste une page indépendante : elle ne génère aucune fiche.

- Toutes les images du dépôt sont indexées, y compris les fichiers hors de `public`. Le nombre actuel est celui du catalogue généré ; il augmente avec les lots contrôlés. Les artefacts temporaires du dossier `work/` sont exclus.
- Recherche sans distinction de casse, d’accents ou d’apostrophes typographiques, par mots, libellé et nom de fichier ; filtres combinables par thème, type et collection.
- Les catalogues existants enrichissent les titres et thèmes. Les fichiers non catalogués restent accessibles. Les thèmes complémentaires et certains types sont déduits des noms et dossiers : ce classement peut être affiné sans modifier les images.
- Aperçu agrandi et sélection conservée pendant les changements de filtres et de page.
- Téléchargement individuel dans le format d’origine ; ZIP de sélection ou de tous les résultats du groupe filtré. Le ZIP conserve les dossiers pour éviter les collisions de noms.
- Téléchargement séquentiel, progression, annulation et erreur explicite si un fichier est indisponible. Le navigateur peut écrire directement sur disque s’il dispose du sélecteur de fichier ; sinon un ZIP Blob est proposé. Aucun fichier n’est redimensionné ou recompressé.

`scripts/image-gallery-catalog.mjs` actualise le catalogue avant `npm run dev` et `npm run build`. Pendant une session déjà ouverte, `npm run gallery:index` intègre les nouvelles images. Les fichiers générés sont `src/gallery/catalog.generated.json` et `src/gallery/assets.generated.ts` ; les originaux hors de `public` sont importés comme ressources Vite pour être présents dans le site compilé.

L’extension TCF propose les types **Action**, **Animal**, **Végétal**, **Métier** et **Maladie**, avec des sous-thèmes pour les fruits, légumes, familles animales, professions, symptômes et zones douloureuses. Le thème **Style TCF validé** isole les images contrôlées. Les anciennes illustrations restent disponibles sous **Version antérieure** lorsqu’un remplacement a été approuvé. Leurs fichiers sont conservés.

L’[avancement du lot](avancement-tcf-20261113.md) détaille les quantités et ce qui reste à produire. La liste des sujets est dans `sujets-tcf-20261113.json`, le suivi dans `extension-tcf-20261113.json`, et les correspondances vérifiées dans `classement-tcf-20261113.json`. Les fiches `generation-20261113/*.json` conservent les prompts, références, statuts, sources et empreintes. Une génération en attente de contrôle visuel n’est pas publiée. `scripts/register-gallery-tcf.py` encode les seules images approuvées en WebP sans recadrage ni redimensionnement ; `scripts/report-gallery-tcf.py` actualise le rapport et vérifie les empreintes.

Validation : `npm run test:gallery`, `npm run test:gallery:browser`, TypeScript et compilation Vite. Les contrôles Chromium vérifient l’accès, les filtres, l’aperçu au clavier, les téléchargements individuels et groupés (originaux comparés à l’octet près, archives et CRC validés), l’écriture séquentielle, l’annulation, l’erreur sur fichier manquant, la navigation et l’absence de débordement à 390 et 1 440 px. Les mêmes essais sont exécutés sur la version compilée.
