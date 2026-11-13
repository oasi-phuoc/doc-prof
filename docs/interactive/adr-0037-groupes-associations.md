# ADR 0037 — Associations progressives par groupes

Les associations des fiches **Vocabulaire** et **Mémory** utilisent désormais des groupes de six paires au maximum. Le modèle à neuf paires forme deux groupes de six et trois. Sept paires forment deux groupes de cinq et deux pour éviter une dernière question sans alternative. Le contenu et le recto verso des fiches restent inchangés.

Après la correction d’une paire, son mot devient indisponible pour les autres images du même groupe. La carte reste grisée à sa place : les lettres, couleurs, formes et références de la feuille enseignant ne changent pas. En Classe, les élèves continuent à voter collectivement avec leurs cartes ; aucune sélection au tableau n’est requise. En Solo, le moteur refuse aussi une sélection envoyée directement sur un mot déjà associé. Une erreur ou une expiration consomme la paire après affichage de sa correction ; le mot choisi à tort reste disponible pour sa propre image. Une question passée ne consomme aucun mot.

Les mots disponibles sont calculés à partir des corrections déjà révélées et de l’historique existant. Les autres groupes restent indépendants, y compris lorsque deux fiches emploient le même vocabulaire. Navigation, sélection partielle et ordre personnalisé sont conservés. Une rétractation ou une nouvelle tentative retire la correction courante et libère sa paire ; les essais antérieurs restent archivés. Aucune nouvelle donnée de sauvegarde n’est nécessaire. Le bilan Solo donne les paires réussies sur les paires sélectionnées, par exercice et groupe. Le bilan Classe compte les paires abordées, sans déduire de résultat individuel.

Une association automatique exige une image et un mot distincts dans la source. Les images partagées, les mots répétés et les remplacements d’image ambigus restent guidés avec appréciation humaine. Les numéros de paire, les champs de groupe et les choix sont validés ; le corrigé reste séparé des données publiques.

En compétition, seuls les tours précédents déjà corrigés rendent des mots indisponibles. Le premier joueur local ne change donc pas les choix du second joueur pendant la question courante. Le serveur refuse un mot déjà utilisé, même si une requête contourne le bouton désactivé. Les références des groupes sont anonymisées, leurs champs limités et leurs paires vérifiées. Le [test du vrai Worker](competition-worker-results.json) vérifie aussi le redémarrage avec stockage SQLite : le mot déjà associé reste indisponible, sa soumission reçoit HTTP 400 et la paire suivante rapporte les points attendus sans dévoiler sa réponse avant correction.

Sur téléphone, l’illustration utilise l’espace restant après le titre et les lignes de cartes. Les lignes de réponse gardent au moins 44 px. Cette disposition corrige le débordement observé pendant la réflexion sur 360 × 640, tout en conservant la mascotte et le minuteur sous les cartes. Le bouton d’agrandissement affiche l’image complète ; le zoom augmente réellement sa taille, Échap ferme la fenêtre et rend le focus au bouton d’origine.

Sept nouveaux tests vérifient 800 tirages de deux à neuf paires, les groupes, les questions passées, la rétractation, les tentatives, les plafonds et ordres personnalisés, la reprise durable et les protections en compétition. Ils complètent les huit tests des sources imprimables. La suite de domaine passe avec 274 tests. Les parcours [image–mot](printable-pairs-results.json), [compétition](competition-results.json) et le Worker réel sont vérifiés. Voir le [relevé qualité](quality-matching-results.json).

Ce lot complète le regroupement et la disponibilité progressive M06 pour ces deux familles imprimables. Les autres familles d’associations restent à étendre. Le retournement de deux cartes M11 reste ouvert ; la fiche Mémory sert ici de source aux associations image–mot. Les nouvelles synthèses audio restent reportées.

```sh
node --test tests/interactive/matching.test.mjs tests/interactive/printable-pairs.test.mjs
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:interactive:printable-pairs
npm run test:interactive:competition-worker
```
