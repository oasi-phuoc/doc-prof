# Générateur UI (`src/components/generator/`)

Découpage de l’ancien monolithe `App.tsx` pour le développement.

| Fichier | Rôle |
|---|---|
| `GeneratorPage.tsx` | Page générateur : état pages/seed, panneau paramètres gauche, aperçu A4 |
| `TopbarTools.tsx` | Icônes haut : couleur (pastille), pied de page, mode libre, déconnexion |
| `FooterSidePanel.tsx` | Panneau droit en-tête / pied de page |
| `LibreSidePanel.tsx` | Panneau droit édition manuelle (tous domaines) |
| `GenericLibreEditor.tsx` | Éditeur générique consigne + questions |
| `WorksheetSheet.tsx` | Rendu d’une feuille A4 (élève / corrigé) |
| `SelectBox.tsx` | Liste déroulante du panneau |
| `Header.tsx` | Barre de marque ClairFLE |
| `Landing.tsx` / `AccessPage.tsx` | Accueil et mot de passe |
| `theme.ts` | Couleur thème (localStorage + helpers HSL) |
| `page-helpers.ts` | `applyType`, grilles brouillon, modes oraux… |
| `routing.ts` | Routes `/`, `/acces`, `/generateur` |
| `FormesPalette.tsx`, `VocabAddWordRow.tsx`, `TabRemoveButton.tsx` | Contrôles ciblés |

`src/App.tsx` ne fait plus que le routage.
