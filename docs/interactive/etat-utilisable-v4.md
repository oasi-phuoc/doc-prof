# État utilisable et réutilisation — V4

Vérification du 11 novembre 2026 sur le code actuel, avec suites de domaine et parcours Chromium. Le cahier V4 décrit encore des travaux à terminer ; cet état couvre les fonctions effectivement présentes.

| Élément existant | Utilisable / réutilisable | Limites connues |
|---|---|---|
| Générateur et fiches v1 | Recettes, banques, rendu imprimable et navigation réutilisés | Huit erreurs de génération repérées dans l’inventaire ; aucun remaniement de banque fait pour les masquer |
| Conversion vers le jeu | 471 variantes sur 2 081, recalculées par l’inventaire | Un tirage par type, deux items, niveau par défaut ; validation de toutes les graines et variantes non acquise |
| Modes Classe et Solo | Vote collectif, protections enseignant ; états et minuteurs conservés par écran, nouvelles tentatives et essais archivés ; Solo automatique | Mécaniques avancées encore à étendre |
| Minuteurs et médias | Minuteur facultatif, battement de 1 à 10 s, pause, reprise et précontrôle des médias | Quotas de consigne et journal d’écoutes disponibles ; hors ligne intégral à venir |
| Interface mobile | Question en gras et encadrée, mascotte agrandie sous les cartes, menu par icônes, immersion | Validation physique sur ENI encore nécessaire |
| Cartes et corrigé enseignant | Six carrés A4 en deux colonnes et trois lignes ; feuille enseignant autonome avec plan identique | Assistant de comparaison disponible ; validation matérielle encore nécessaire |
| État de séance et brouillons | IndexedDB, reprise après fermeture d’onglet, adresse de séance, réglages durables, révisions atomiques et propriétaire unique ; instantanés et purge après sept jours ; brouillons de 24 h | Préréglages, archives et export/import locaux disponibles ; transfert conditionné à la source inchangée ; images temporaires non garanties après rechargement |
| Comptage et bilan | Saisie manuelle validée, partage explicite, observations et marques à revoir | Plusieurs bilans conservés et imprimables ; badges encore ouverts |
| Accès aux fiches enregistrées | Client API et contrôles existants conservés, tests d’intégration avec API simulée | Authentification historique à sécuriser avant fonctions partagées ; pas de certification du serveur réel par ces tests |

## Couverture observée

L’inventaire courant trouve 471 variantes avec au moins une activité : 343 uniquement en QCM source, 15 adaptations numériques, 79 uniquement guidées et 34 mixtes. Répartition : grammaire 152, soutien FR 149, alphabétisation 120, TCF CFR 10, TCF CSC 9, TPF 9, algèbre 8, Gattegno 6, TPM 4, géométrie 2 et TCM CFR 2. Les 1 610 autres variantes demandent des adaptateurs ou une correction de génération. Le jeu signale ces incompatibilités dans la préparation.

Les sources déjà prises en charge et leurs limites sont décrites dans l’[audit de compatibilité](audit-compatibilite.md). L’inventaire conserve les configurations et items témoins pour étendre chaque famille avec des tests fiables. Le moteur, les médias, les cartes, les minuteurs, le plan de réponses et la persistance constituent le socle à garder pour ces extensions.

## Travail des anciennes PR

La [revue des six PR](../maintenance/pr-review-2026-11-10.md) identifie cinq travaux déjà intégrés et une PR 51 contenant encore un patch distinct (banques et rendu de famille / grammaire). Ce contenu est une piste de réutilisation à examiner par fichier ; il n’est pas assimilé à une implémentation achevée du jeu. La fermeture des anciennes PR n’a pas été exécutée par cette session, faute d’accès à l’API GitHub.

## Vérifications récentes

117 tests de domaine passent. Les contrôles axe couvrent 26 vues sans violation détectée automatiquement ; les règles manuelles restent listées. Le routeur léger et les budgets sont vérifiés sur le build. L’étalonnage, la version de palette, le conflit entre onglets et l’impression monochrome sont vérifiés. Les associations audio, complétions et phrases manipulables sont vérifiées sur mobile et desktop, avec reprise et appréciation humaine. Les archives et transferts sont vérifiés avec navigateur vierge, concurrence, annulation, fichiers invalides, effacement et impression PDF. Le lecteur audio est vérifié avec lecture réelle, quotas, autorisation enseignant, pause/reprise, erreur, blocage et rechargement. Les préréglages locaux sont vérifiés avec ordre personnalisé, choix limités, adaptation après changement de fiche, révisions concurrentes et reprise indépendante du préréglage supprimé. Les parcours navigateur vérifient les modes, les protections enseignant, la navigation et les tentatives, la correction dans les cartes, les médias, le mobile, l’impression PDF, les nouvelles graines depuis la bibliothèque, les compteurs, la reprise, les transferts entre onglets, le compactage à 5 000 actions et la conservation du bilan. Les brouillons sont vérifiés avec migration de l’ancienne base et ouverture sans historique. La capture A4 reste identique à la référence. Le typage, la compilation et le lint ont été exécutés sur les étapes correspondantes. Les avertissements préexistants du lint ne valent pas validation de sécurité de la production.

Le [suivi V4](suivi-v4.md) reste le registre des fonctionnalités manquantes. La configuration cloud publiée par le propriétaire est conservée ; aucune nouvelle publication de cette configuration n’est nécessaire pour réutiliser le code.
