# ADR 0020 — Cohérence des verdicts sauvegardés

La validation des instantanés contrôlait le type des verdicts Solo sans comparer leur valeur à la réponse choisie. Un fichier importé pouvait donc modifier un verdict et les totaux du bilan de manière cohérente tout en gardant une réponse erronée. Trois tests reproduisent le problème avant correction.

Chaque tentative non passée est désormais vérifiée contre le corrigé du plan reconstruit : un QCM Solo exige le verdict correspondant au choix enregistré, et le temps écoulé sans choix exige `false`. Les activités guidées et le mode Classe restent sans verdict automatique. Un verdict absent ou contradictoire est refusé avant toute écriture. La sélection affichée pendant une correction doit aussi être celle de la tentative, même pour les anciens instantanés sans états par écran.

Les versions de format restent inchangées : tous les états produits par le moteur respectent déjà ces invariants. Les instantanés incohérents sont conservés avec le message d’erreur existant. Les tests vérifient l’absence de mutation, les reprises valides, les anciens formats et l’import d’un bilan dont les totaux ont été falsifiés avec le verdict. Il s’agit d’une validation de cohérence avec le plan, pas d’une signature d’authenticité ni d’une protection contre toute modification locale.
