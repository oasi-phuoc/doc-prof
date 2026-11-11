# ADR 0023 — Signes et problèmes CSC dans le jeu

Les exercices CSC 9 et 22 à 24 utilisent leurs métadonnées imprimables pour créer des questions de jeu. L’exercice 9 propose les trois signes `+`, `−` et `=`. Les problèmes proposent des cartes numériques ; le document et la question conservent leur contexte, leurs nombres et leur unité dans l’énoncé. Les opérations posées de l’exercice 10 réutilisent l’adaptation arithmétique existante.

La conversion recalcule le problème depuis son identifiant de banque et ses nombres, puis compare l’énoncé et le corrigé avec la fiche. Une modification non validée, un identifiant inconnu, des nombres incompatibles ou un résultat périmé produisent un motif d’incompatibilité. Un signe manquant avec un second opérande nul est également refusé : `+` et `−` seraient tous les deux justes.

Les distracteurs numériques utilisent la graine de jeu et la politique existante. Une nouvelle partie d’un modèle CSC généré renouvelle ses nombres, conserve les trois contextes et laisse la recette enregistrée intacte. Les données saisies librement restent associées à leur texte. Les corrections sont conservées hors des données projetées et utilisent les états Classe et Solo existants.

Huit tests couvrent 100 graines réelles du générateur, les 103 contextes et leurs bornes, les éditions incohérentes, les signes ambigus, les nouvelles parties et les verdicts Solo. Le parcours [source-adapters-results.json](source-adapters-results.json) vérifie sur téléphone et ordinateur le document source, les cartes, la révélation et le grisage des mauvaises réponses, sans écriture serveur. Voir les captures [mobile](screenshots/csc-problem-390.png) et [ordinateur](screenshots/csc-problem-1366.png).

L’inventaire recalculé observe 636 variantes jouables sur 2 103, dont cinq types CSC. Les autres exercices CSC, notamment l’écoute de plusieurs clips, la reproduction et les coordonnées, demandent encore leurs adaptateurs. L’inventaire n’atteste pas l’ensemble des variantes et des niveaux.
