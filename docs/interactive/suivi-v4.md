# Suivi de la mise en œuvre V4

Ce registre complète les anciennes checklists de livraison. Il distingue les fonctions vérifiées, les incréments encore partiels et les contrôles nécessitant le matériel réel. Les demandes récentes du propriétaire prévalent : Classe sans sélection au tableau ; Solo avec correction et suite automatiques ; six mascottes animées et mouvements maintenus même avec la préférence système de réduction des animations ; push de chaque étape validée sur `origin/main`.

## Priorités P0

| Travail | État et preuve | Reste à faire |
|---|---|---|
| Parcours brouillon / fiche enregistrée | Convertisseurs, préparation, sélection ; brouillon local par adresse et rechargement ; graine renouvelée dès le clic bibliothèque sans modifier le modèle serveur ; `drafts-results.json`, `game-run-results.json` | Étendre les adaptateurs encore classés non compatibles par l’inventaire |
| Moteur Classe / Solo | Correction dans les cartes, protections enseignant ; navigation conservant phases, minuteurs, relances et images ; nouvelles tentatives et essais archivés ; `navigation-results.json`, `teacher-protections-results.json`, tests de domaine, Classe et Solo | Étendre les mécaniques avancées et leurs états spécifiques |
| F25 diagnostic | Page et rapport local ; tests navigateur et document `diagnostic-eni.md` | Essai sur ENI réel à joindre au pilote |
| F26 cartes et étalonnage | Palette, formes, contraste ; six carrés de 88 mm en deux colonnes et trois lignes A4 ; `mobile-layout-print-results.json` | Assistant d’étalonnage et contraste des contours complets |
| F27 feuille enseignant | Fichier autonome A4, corrigés hors DOM, plan identique, obsolescence et images incorporées ; `teacher-sheet-results.json` | Essai d’impression sur l’équipement de classe |
| F28 persistance | Références de source, graine et sélection durables ; reprise après fermeture d’onglet et accès par identifiant ; réglages migrés et fusionnés atomiquement ; minuteurs par écran et tentative, verrou et révisions ; schémas 1–4, compactage et purge ; préréglages locaux avec obsolescence et révisions ; `presets-results.json`, `durable-run-results.json`, `resume-results.json`, `navigation-results.json`, `session-lease-results.json`, `checkpoint-results.json`, `retention-results.json`, `drafts-results.json` | Archivage de plusieurs bilans et outils d’export/import/effacement ; extensions des préréglages aux nouvelles mécaniques |
| F29 médias | Précontrôle, décodeurs, cache, annulation, préchargement suivant et tests | Journal et limites d’écoutes ; extension hors ligne P1 |
| F30 comptage et observations | Compteurs validés, provenance et partage explicite, bilan, marques et notes locales ; `manual-count-results.json` | Badges et archivage de plusieurs bilans |
| F31 oral guidé | Scènes, zoom, relances, modèle et évaluation humaine présents | Recette complète S03 et extension de conversion prouvée |
| F32 routes / chargement / drapeau | Chargement paresseux, routes brouillon, fiche, démo ; diagnostic dédié | Drapeau réconcilié avec la bascule déjà demandée par le propriétaire |
| F33 CI | Suites locales et résultats présents | Pipeline complet, budgets, détection de secrets et accessibilité automatisée |
| F34 mélange équilibré | Graines par usage, identité canonique, quotas équilibrés et séquences maximales de deux ; 100 graines et 5 000 questions dans `slots.test.mjs` ; ordre source, mélangé, personnalisé et numérique croissant ; ADR 0004 et 0011 | Étendre ces politiques aux nouvelles mécaniques |
| F35 tokens et polices | Palette et contrastes de texte testés ; polices locales, chiffres tabulaires, français et budget contrôlés ; `fonts-results.json` et ADR 0005 | Vérification complète des tokens et essai typographique sur ENI |
| F46 lisibilité | Gabarits desktop/mobile testés | Précontrôle automatique des débordements avant lancement |
| S1 / S4 / S5 sécurité | Politique de médias et rendu sûr du jeu ; audit existant | Remise à niveau de l’authentification existante et en-têtes ; ne pas annoncer ces points terminés |

## P1 / P2 encore ouverts

M05–M08 et autres mécaniques, extensions des préréglages puis stockage serveur sécurisé, console enseignant, export/import de séance, préchargement intégral, hors ligne, statistiques d’équipes, thème sombre, pilotes matériels et revue finale de sécurité restent à réaliser ou à étendre. Les fonctions partagées doivent attendre l’authentification serveur. Les suppressions ou refontes de banques imprimables ne font pas partie de cette migration.

## Actions externes connues

- Les fermetures des PR 42, 43, 44, 45 et 52 sont autorisées et justifiées, mais nécessitent l’accès réseau à `api.github.com`. La PR 51 est conservée. Voir `docs/maintenance/pr-review-2026-11-10.md`.
- Le propriétaire a publié l’environnement cloud puis chargé un nouveau brouillon. La reprise utilise cet environnement ; les commits applicatifs ne modifient et ne publient pas sa configuration.
- Le test ENI réel, la comparaison avec les cartes physiques et le pilote de classe ne peuvent pas être attestés par les seuls tests Chromium.
