# Livraison du prototype v3 — premier jalon

Branche : `feature/clairfle-interactive-v3`, base `e268922b`.

## Contenu livré

Inventaire C0 des 2 061 types réels (2 093 variantes avec les domaines TCF CSC/CFR), design C1, première tranche des modèles et adaptateurs C2, moteur de séance C3 et entrées générateur/bibliothèque C4. Dix questions de démonstration couvrent les quatre cas prioritaires, dont six mini-audios. Le nouveau module est autonome, sans import de l’ancien moteur de jeu.

Cartes A–F, choix après signal, discussion puis révélation explicite, navigation manuelle, pause, reprise, observation humaine des productions ouvertes, bilan sans statistiques inventées et kit A4 imprimable sont fonctionnels. Les éléments non compatibles restent expliqués dans la préparation.

## Vérification

- `npm ci` : installation propre réussie, verrou mis à jour pour Playwright.
- `npm test` : **12 tests passés**, avec initialisation Vite et ports locaux autorisés dans l’environnement cloud.
- `npm run build` : TypeScript et Vite réussis ; avertissement sur la taille de bundles existants.
- Lint ciblé du nouveau module, des tests et du script d’inventaire : aucun problème.
- `npm run lint` global : erreur préexistante de Hook conditionnel dans `src/tcf/tagged-picker.tsx:107` ; ce fichier n’est pas modifié par ce jalon.
- Chromium : parcours à 1920×1080, 1366×768 et 1280×800, médias, sélection, révélation manuelle, pause, reprise, manipulation et bilan.
- Cartes imprimables : deux feuilles A4 pour deux jeux, six cartes par feuille.
- Aperçu A4 témoin : capture identique octet pour octet à la base, y compris après chargement du CSS interactif.
- Bibliothèque et lien enregistré : API simulée, cas 401/403/404, fiche absente, médias absents et restriction de domaine. Aucune écriture dans une bibliothèque réelle.

## Avant la suite

Faire valider la direction visuelle avec les captures et le prototype, puis étendre les adaptateurs par familles avec leurs tests. Le catalogue n’est pas déclaré intégralement jouable. Les huit erreurs de génération observées sont documentées sans réécriture des banques.

La remise à niveau de l’authentification préexistante, le retrait de l’ancien jeu, les presets partagés et l’essai sur un ENI physique restent à faire. Voir l’audit de sécurité ; ce jalon ne prétend pas avoir sécurisé la production.
