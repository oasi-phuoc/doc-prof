# ADR 0011 — Préréglages locaux et options de plan

Décision du 11 novembre 2026 : mémoriser la préparation dans `presets-local`, sans modifier la fiche serveur. Un préréglage version 2 conserve la sélection par position source, l’ordre, le plafond de choix, le classement numérique, le mode et les durées. Les couleurs et la mascotte restent des préférences de l’appareil. Les mécaniques imposées par question et les propositions ajoutées par l’enseignant ne sont pas encore configurables.

L’ordre peut suivre la fiche, être mélangé avec une graine dédiée ou être personnalisé avec des boutons Monter/Descendre. Le plafond de deux à six choix conserve la bonne réponse et des distracteurs déjà présents. Les choix fixes ou faisant référence les uns aux autres restent complets, avec avertissement. Les nombres sont classés exactement avec `BigInt` ; aucun distracteur n’est inventé.

L’empreinte de la recette et la version de conversion détectent un changement de fiche. Charger un préréglage obsolète propose Ignorer, Mettre à jour ou Dupliquer et adapter. L’adaptation conserve uniquement les positions source encore disponibles. Elle ne compare pas encore individuellement le contenu de toutes les banques externes ; une mise à jour de banque sans changement de recette doit aussi faire évoluer la version de conversion.

Les écritures et suppressions comparent la révision dans une transaction IndexedDB : une modification concurrente impose de recharger la liste. Les versions inconnues sont signalées et conservées. Une suppression demande confirmation. Le contexte de séance contient ses propres options : supprimer le préréglage n’empêche pas de reprendre une partie déjà enregistrée.

Vérification : sept tests de domaine supplémentaires, parcours Chromium sur mobile dans [presets-results.json](presets-results.json), reprise après fermeture, obsolescence, concurrence et conservation d’une version future. Aucun appel d’écriture au serveur. Les suites de Classe, reprise durable et comparaison A4 passent également.
