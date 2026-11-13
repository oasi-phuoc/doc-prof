# Galerie d’images

La rubrique `/images` est accessible par l’icône image du menu supérieur. Elle partage l’accès du créateur de fiches, mais reste une page indépendante : elle ne génère aucune fiche.

- Toutes les images du dépôt sont indexées, y compris les fichiers hors de `public` : 5 825 fichiers au 13 novembre 2026.
- Recherche sans distinction de casse ou d’accents, par mots, libellé et nom de fichier ; filtres combinables par thème, type et collection.
- Les catalogues existants enrichissent les titres et thèmes. Les fichiers non catalogués restent accessibles. Les thèmes complémentaires et certains types sont déduits des noms et dossiers : ce classement peut être affiné sans modifier les images.
- Aperçu agrandi et sélection conservée pendant les changements de filtres et de page.
- Téléchargement individuel dans le format d’origine ; ZIP de sélection ou de tous les résultats du groupe filtré. Le ZIP conserve les dossiers pour éviter les collisions de noms.
- Téléchargement séquentiel, progression, annulation et erreur explicite si un fichier est indisponible. Le navigateur peut écrire directement sur disque s’il dispose du sélecteur de fichier ; sinon un ZIP Blob est proposé. Aucun fichier n’est redimensionné ou recompressé.

`scripts/image-gallery-catalog.mjs` actualise le catalogue avant `npm run dev` et `npm run build`. Pendant une session déjà ouverte, `npm run gallery:index` intègre les nouvelles images. Les fichiers générés sont `src/gallery/catalog.generated.json` et `src/gallery/assets.generated.ts` ; les originaux hors de `public` sont importés comme ressources Vite pour être présents dans le site compilé.

Validation : `npm run test:gallery`, `npm run test:gallery:browser`, TypeScript et compilation Vite. Les contrôles Chromium vérifient l’accès, les filtres, l’aperçu au clavier, les téléchargements individuels et groupés (originaux comparés à l’octet près, archives et CRC validés), l’écriture séquentielle, l’annulation, l’erreur sur fichier manquant, la navigation et l’absence de débordement à 390 et 1 440 px. Les mêmes essais sont exécutés sur la version compilée.
