# ADR 0006 — Instantanés et compactage du journal

Les principes ci-dessous restent applicables. Depuis les [protections enseignant](adr-0008-commandes-et-retractation.md), les nouvelles écritures utilisent le schéma 3 ; les instantanés de schéma 2 décrits dans cet ADR restent lisibles.

Le schéma de séance 2 ajoute un instantané validé de l’état et l’identifiant du dernier événement compacté. Les anciens journaux de schéma 1 restent lisibles, sans réécriture lors de la lecture. Leur première nouvelle écriture utilise le schéma 2. Un ancien moteur refuse ainsi un nouveau schéma plutôt que de reprendre un journal compacté comme une partie vide.

Le contrôleur compacte après la 5 000e action du segment et à chaque modification d’un bilan terminé. L’instantané conserve la phase, la progression, les choix en Solo, les verdicts déjà produits, les comptages manuels, les marques et les observations. Le temps restant demeure dans le champ de minuterie existant. Les événements du segment sont retirés ; aucun texte de question ni clé de correction n’est ajouté. Les événements postérieurs sont rejoués depuis l’instantané. Les doublons du nouveau segment et celui de la frontière de compactage sont ignorés ; les anciennes fenêtres restent protégées par les révisions atomiques.

Le lecteur vérifie les champs, les limites, les identifiants du plan, les choix actifs, les comptages, les marques et la cohérence d’un bilan terminé. Une donnée inconnue ou corrompue est refusée et conservée pour diagnostic. La restauration ne recalcule pas les verdicts : elle garde l’état effectivement enregistré. Les états copiés sont indépendants des objets en mémoire.

Vérifications : `checkpoint.test.mjs` couvre Classe, Solo, pause, comptage, bilan, observations, données corrompues et déduplication. `checkpoint-browser.mjs` injecte un ancien journal de 4 999 actions, effectue la suivante par l’interface, recharge la discussion sans révélation et termine la partie. Dans cette fixture, le journal passe de 356 569 à 534 caractères JSON avant de poursuivre normalement. Les tests de comptage, de concurrence et des deux minuteurs restent verts. Résultats : `checkpoint-results.json`.
