# Relevé des contrôles et des dimensions, lot L0

Le [relevé JSON](audit-controles.json) couvre 13 parcours sur le commit `561d0a0`, avec Chromium 156.0.8078.79 et une hauteur de fenêtre de 900 px. Les essais utilisent un accès administrateur synthétique local. Ils couvrent l’addition en ligne et le module 105 de Logistique AFP et CFC. Le script compare les contrôles visibles, le contenu de l’aperçu, le format, le nombre de pages et le texte extrait des PDF du parcours normal et du mode Libre.

| Fiche | Largeurs de fenêtre | Écart du cadre à l’ouverture de Libre | Identité du contenu à la fermeture |
|---|---|---|---|
| Algèbre A4 | 320, 390, 768 px | 0 × 0 px | 3 sur 3 |
| Algèbre A4 | 1 024, 1 366, 1 440, 1 920 px | +1,00 × +1,42 px | 4 sur 4 |
| Logistique AFP et CFC A4 | 390 px | 0 × 0 px | 2 sur 2 |
| Logistique AFP et CFC A4 | 1 366 px | +1,00 × +1,42 px | 2 sur 2 |
| Algèbre double A5 | 390 et 1 366 px | 0 × 0 px et +1,00 × +0,70 px | 0 sur 2 |

Les deux panneaux restent montés dans les 13 parcours. L’aperçu conserve le texte des questions à l’ouverture de Libre. Le texte extrait, le nombre de pages et les dimensions PDF concordent entre les deux modes dans les 13 cas. Les mesures sont de 594,96 × 841,92 pt pour les PDF A4 portrait et de 841,92 × 594,96 pt pour les PDF double A5. Le relevé double A5 signale que le texte de l’aperçu diffère après fermeture. La variation en hauteur de 1,42 px de l’A4 au bureau dépasse la tolérance écran initiale de 1 px.

### Effet des réglages sur l’addition à 1 366 px

| Contrôle | Observation |
|---|---|
| Nombre de questions | Les valeurs 2 et 3 laissent huit questions visibles lors du relevé immédiat, en mode normal et Libre. |
| Audio | Le sélecteur est absent, conformément au cas négatif attendu. |
| Premier opérande | Les valeurs 17 et 29 ne se reflètent pas dans le corrigé pendant la saisie ni après la sortie du champ dans ce parcours. |

Pour reproduire le relevé sur le code de référence, utiliser le script avec Chromium, `pdfinfo` et `pdftotext`. La variable `CHROMIUM_PATH` peut indiquer un autre binaire Chromium. La navigation et le tirage de chaque fiche utilisent les actions du générateur. Les comparaisons se font à l’intérieur de chaque tirage.

```sh
node scripts/audit-mode-libre.mjs /tmp/doc-prof-mode-libre controles
```

La validation par contrôle et par variante reste à étendre, de même que les mesures physiques des exercices de précision, les pages avec supports longs et les parcours sur d’autres navigateurs.
