# Acceptation — première tranche C0/C1/C2/C3/C4

Ce document décrit un prototype fonctionnel, pas la livraison finale de toutes les familles. Les résultats machine sont conservés dans `browser-results.json`, `a4-results.json` et `saved-fiches-results.json` ; les deux derniers parcours nécessitent les instances de test décrites dans le README.

## Scénarios de la cible

- [x] 01. Lancement depuis la bibliothèque et depuis un lien enregistré : API simulée, sans accès aux fiches réelles.
- [x] 02. Lancement du brouillon depuis le véritable bouton du générateur ; graine et items libres conservés.
- [x] 03. Capture de l’aperçu A4 identique octet pour octet à `e268922b`, sur la recette témoin, même après chargement du CSS interactif. Ce contrôle ne couvre pas chaque famille.
- [x] 04. Palette A–F unique à l’écran et sur le kit papier.
- [x] 05. Trois choix restent trois choix ; pas de remplissage artificiel.
- [x] 06. Réflexion avant sélection : cartes lisibles, sélection désactivée.
- [x] 07. Signal explicite « Levez vos cartes ».
- [x] 08. Sélection sans révélation ; boutons natifs clavier et toucher.
- [x] 09. Révélation réservée à l’action explicite enseignant, après discussion.
- [x] 10. Corrigé neutre ; la couleur de la carte ne devient pas un jugement de valeur.
- [x] 11. Séance de dix questions dont six mini-audios ; aucun passage automatique.
- [x] 12. Retour précédent et historique cohérent ; reprise après refresh en phase réflexion.
- [x] 13. Piste associée à la question ; pas d’autoplay ; décodage, lecture et pause vérifiés dans Chromium, sans écoute humaine de toutes les pistes.
- [x] 14. Quatre images en rangée, déplacement par boutons, sans dépendre du glisser-déposer. Essai tactile sur ENI réel à faire.
- [x] 15. Production orale sans score automatique, observation manuelle.
- [x] 16. 788 + 771 = 1 559 et 349² = 121 801 cm² ; rejet d’une unité incohérente.
- [x] 17. Distracteurs uniques, déterministes et corrigé vérifié pour les adaptateurs numériques couverts.
- [x] 18. Parcours contrôlé à 1920×1080, 1366×768 et 1280×800 ; commandes géométrie/oral dans l’écran, sans débordement horizontal.
- [x] 19. Aucun son imposé ; réduction du mouvement et contraste renforcé disponibles.
- [x] 20. Images/audio absents : message explicite, séance poursuivable ; fiche absente et erreurs 401/403/404 gérées.
- [x] 21. Bilan limité aux réponses au tableau et observations humaines ; aucun vote physique inventé.
- [ ] 22. Direction artistique à faire valider par l’utilisateur sur les captures et l’aperçu.

## Qualité et limites

- Installation propre `npm ci` ; nouvelle dépendance de développement : Playwright.
- Suite `npm test` : conversion, calculs, unités, choix, transitions, pause, reprise logique, évaluation manuelle et absence de mutation des données A4.
- `npm run build` : TypeScript et Vite passent. Le build signale la taille importante de bundles déjà présents.
- Le lint global présente une erreur préexistante de Hook conditionnel dans `src/tcf/tagged-picker.tsx`, ainsi que des avertissements anciens. Le nouveau module et ses tests font l’objet d’un contrôle séparé.
- Aucun test physique ENI, essai avec élèves ou audit d’authentification de production n’a été réalisé.
- Presets partagés, statistiques de groupe, modes de score/chrono facultatifs, indices avancés et couverture complète des familles restent hors de cette première tranche.
- L’accès serveur et les secrets frontend préexistants demandent une remédiation avant production : voir `audit-securite.md`.
- L’ancien jeu reste en place jusqu’à la bascule validée ; la branche de prototype ne remplace pas encore l’interface de production.
