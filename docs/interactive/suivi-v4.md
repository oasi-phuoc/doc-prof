# Suivi de la mise en œuvre V4

Ce registre complète les anciennes checklists de livraison. Il distingue les fonctions vérifiées, les incréments encore partiels et les contrôles nécessitant le matériel réel. Les demandes récentes du propriétaire prévalent : Classe sans sélection au tableau ; Solo avec correction et suite automatiques ; six mascottes animées et mouvements maintenus même avec la préférence système de réduction des animations ; push de chaque étape validée sur `origin/main`.

## Priorités P0

| Travail | État et preuve | Reste à faire |
|---|---|---|
| Parcours brouillon / fiche enregistrée | Convertisseurs, préparation, sélection ; nouvelles parties à graine renouvelée sans modifier le modèle serveur, reprise identique ; `game-run-results.json` | Étendre les adaptateurs encore classés non compatibles par l’inventaire |
| Moteur Classe / Solo | Navigation, correction, pause, minuterie, bilan ; tests de domaine, Classe et Solo | Garde enseignant, annulation de révélation et navigation conservant tous les états par question |
| F25 diagnostic | Page et rapport local ; tests navigateur et document `diagnostic-eni.md` | Essai sur ENI réel à joindre au pilote |
| F26 cartes et étalonnage | Palette, formes, contraste ; six carrés de 88 mm en deux colonnes et trois lignes A4 ; `mobile-layout-print-results.json` | Assistant d’étalonnage et contraste des contours complets |
| F27 feuille enseignant | Fichier autonome A4, corrigés hors DOM, plan identique, obsolescence et images incorporées ; `teacher-sheet-results.json` | Essai d’impression sur l’équipement de classe |
| F28 persistance | IndexedDB, journal, empreinte du plan, reprise des deux décomptes ; `resume-results.json` | Verrou entre onglets, compaction, gestion des brouillons et autres magasins du §63 |
| F29 médias | Précontrôle, décodeurs, cache, annulation, préchargement suivant et tests | Journal et limites d’écoutes ; extension hors ligne P1 |
| F30 comptage et observations | Compteurs validés, provenance et partage explicite, bilan, marques et notes locales ; `manual-count-results.json` | Badges et archivage de plusieurs bilans |
| F31 oral guidé | Scènes, zoom, relances, modèle et évaluation humaine présents | Recette complète S03 et extension de conversion prouvée |
| F32 routes / chargement / drapeau | Chargement paresseux, routes brouillon, fiche, démo ; diagnostic dédié | Drapeau réconcilié avec la bascule déjà demandée par le propriétaire |
| F33 CI | Suites locales et résultats présents | Pipeline complet, budgets, détection de secrets et accessibilité automatisée |
| F34 mélange équilibré | Graines par usage, identité canonique, quotas équilibrés et séquences maximales de deux ; 100 graines et 5 000 questions dans `slots.test.mjs` ; ADR 0004 | Presets d’ordre croissant et migration des anciens journaux avec F28 |
| F35 tokens et polices | Palette et contrastes de texte testés ; polices locales, chiffres tabulaires, français et budget contrôlés ; `fonts-results.json` et ADR 0005 | Vérification complète des tokens et essai typographique sur ENI |
| F46 lisibilité | Gabarits desktop/mobile testés | Précontrôle automatique des débordements avant lancement |
| S1 / S4 / S5 sécurité | Politique de médias et rendu sûr du jeu ; audit existant | Remise à niveau de l’authentification existante et en-têtes ; ne pas annoncer ces points terminés |

## P1 / P2 encore ouverts

M05–M08 et autres mécaniques, presets locaux puis serveur sécurisé, console enseignant, export/import de séance, préchargement intégral, hors ligne, statistiques d’équipes, thème sombre, pilotes matériels et revue finale de sécurité restent à réaliser ou à étendre. Les fonctions partagées doivent attendre l’authentification serveur. Les suppressions ou refontes de banques imprimables ne font pas partie de cette migration.

## Actions externes connues

- Les fermetures des PR 42, 43, 44, 45 et 52 sont autorisées et justifiées, mais nécessitent l’accès réseau à `api.github.com`. La PR 51 est conservée. Voir `docs/maintenance/pr-review-2026-11-10.md`.
- La sauvegarde du brouillon d’environnement cloud n’est pas confirmée : le backend renvoie `INVALID_ARGUMENT`. L’installation et les tests locaux restent utilisables ; publication de configuration et push Git sont deux opérations distinctes.
- Le test ENI réel, la comparaison avec les cartes physiques et le pilote de classe ne peuvent pas être attestés par les seuls tests Chromium.
