# Relevé des contrôles et des dimensions, référence L0

La [preuve JSON](audit-controles.json) consigne six parcours du générateur existant avec Chromium 156.0.8078.79. La fenêtre mesure 1 366 × 900 px ou 390 × 900 px. Le navigateur utilise une session administrateur synthétique locale. Les mesures concernent le commit `e72ec7c24`, dont la référence complète figure dans l’[inventaire des types](audit-types.md).

| Fiche | Largeur de fenêtre | Variation du cadre à l’ouverture de Libre | Panneaux Réglages et Libre ouverts | Pages PDF en Libre |
|---|---:|---:|---|---:|
| Algèbre, addition | 1 366 px | +1,00 × +1,42 px | Oui | 2 |
| Logistique CFC, 105 Mathématiques | 1 366 px | +1,00 × +1,42 px | Oui | 4 |
| Logistique AFP, 105 Mathématiques | 1 366 px | +1,00 × +1,42 px | Oui | 2 |
| Algèbre, addition | 390 px | 0 × 0 px | Oui | 2 |
| Logistique CFC, 105 Mathématiques | 390 px | 0 × 0 px | Oui | 4 |
| Logistique AFP, 105 Mathématiques | 390 px | 0 × 0 px | Oui | 2 |

Le cadre passe de 519 × 734 px à 520 × 735,42 px à 1 366 px de largeur. L’écart en hauteur dépasse la tolérance initiale de 1 px de l’arbitrage ARB-07. À 390 px, il mesure 308 × 435,59 px dans les deux modes. Le panneau Réglages reste monté à l’ouverture de Libre dans les six cas. Les listes JSON donnent les libellés, le type HTML et l’état activé ou désactivé des contrôles dans chacun des panneaux.

Chaque PDF a une taille de 594,96 × 841,92 pt. Ce relevé donne une référence de pages et de format. Il reste à comparer les sorties normal et Libre, à mesurer les réserves, à fixer la tolérance physique des exercices de mesure et à compléter le relevé par navigateur et format.

L’effet des valeurs de contrôle, les états conditionnels, les autres profils et le parcours Logistique associant plusieurs sous-modules restent à tester. La présence d’un contrôle dans le DOM ne prouve pas sa conformité.
