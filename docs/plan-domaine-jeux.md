# Domaine Jeux — planning ClairFLE (avant implémentation)

Objectif : ajouter un domaine **Jeux** dans le générateur (après **Phrase**), pour produire des fiches-jeux FLE imprimables A4.  
Principe : **le template fixe la forme** (grille, couleurs, découpe) ; **l’enseignant·e ne saisit que le contenu** (mots, images, phrases). Pas d’en-tête institutionnel ni de pied d’évaluation sur ces fiches.

Ce document remplace le brouillon « templates cartes / jeux » et aligne le travail sur l’architecture ClairFLE (`catalog` → générateur déterministe → rendu A4 → impression).

---

## 1. Place dans le produit

| Élément | Décision |
|---|---|
| Domaine UI | `jeux`, option **Jeux** juste après **Phrase** |
| Course en-tête | « Français » (comme Phrase / Lecture) |
| Chrome document | **aucun** en-tête institutionnel / personnalisé, **aucun** footer points — feuille jeu pleine page |
| Orientation | Portrait **ou** paysage selon le template (CSS `@page` + classe feuille) |
| Corrigé | En général **pas** de mode corrigé (cartes découpables). Exceptions possibles plus tard (ex. vrai/faux recto-verso) |
| Mode évaluation | Désactivé / masqué dans l’UI pour ce domaine |

Sélecteur typique : **Domaine → Famille (thème) → Template (type)** puis panneau de contenu.

---

## 2. Architecture cible

### 2.1 Catalogue (déjà le pattern ClairFLE)

- `Domain = … \| 'jeux'`
- **Thèmes** = familles de templates (`jeux-cartes`, `jeux-structures`, `jeux-etiquettes`)
- **Types** = templates concrets (`jeux-vocabulaire`, `jeux-memory`, …)
- Labels / descriptions / consignes dans `src/math/catalog.ts`

### 2.2 Schéma de template (moteur générique)

Chaque type pointe vers un schéma (pas un composant React ad hoc par jeu) :

```ts
type GameTemplate = {
  id: string                 // = exerciseType id
  family: 'cartes' | 'structures' | 'etiquettes'
  label: string
  orientation: 'portrait' | 'landscape'
  grid: { cols: number; rows: number }
  fields: GameField[]        // ce que l’utilisateur saisit
  cardCount: number          // cartes imprimées (après génération éventuelle)
  duplex?: boolean           // recto / verso
  maxTextLen?: number
}
```

Le formulaire de saisie et le rendu A4 sont dérivés de ce schéma.

### 2.3 Contenu utilisateur vs graine

| Source | Usage |
|---|---|
| **Saisie enseignant·e** (V1) | Mots, phrases, images locales — état dans `PageConfig` (ou bloc dédié) |
| **Graine (`seed`)** | Uniquement pour les étapes **aléatoires déterministes** : mélange mémory, tirage loto, ordre des étiquettes, etc. via `createRng(seed)` — jamais `Math.random()` |

### 2.4 Fichiers prévus

| Zone | Rôle |
|---|---|
| `docs/plan-domaine-jeux.md` | Ce planning |
| `src/math/types.ts` | `Domain`, layouts jeu (`card-grid`, …), champs config |
| `src/math/catalog.ts` | Thèmes + types Jeux |
| `src/jeux/templates.ts` | Schémas `GameTemplate` |
| `src/jeux/generate.ts` | `tryGenerateJeuxBatch` (contenu → cartes / pages) |
| `src/jeux/CardGrid.tsx` | Grille générique famille A |
| `src/jeux/PageA4Game.tsx` | Conteneur A4 orientation, sans chrome scolaire |
| `src/components/ItemView.tsx` | Branche(s) layout jeu |
| `src/App.tsx` / `App.css` | SelectBox Jeux, panneau saisie, styles print |
| `src/math/generate.ts` | Délègue au module `src/jeux/` |

---

## 3. Familles de templates

### Famille A — Grille de cartes (`jeux-cartes`)

Composant de base : `<CardGrid>` (colonnes / lignes, taille carte, recto-verso).

| Template | Id type | Spécificité | Caps V1 |
|---|---|---|---|
| Vocabulaire | `jeux-vocabulaire` | 1 image + 1 mot / carte | 12 cartes (3×4) |
| Vrai / Faux | `jeux-vrai-faux` | Affirmation ; fonds vert / rouge fixes ; pas d’image | 8 cartes |
| Devinettes | `jeux-devinettes` | Recto mot, verso 3 indices | 6 cartes (duplex) |
| Mémory | `jeux-memory` | Saisie N paires → duplication 2N + mélange seed | 6 paires → 12 cartes |
| Loto | `jeux-loto` | Grilles joueurs + paquet animateur (tirage seed) | 24 mots max, 2 grilles 3×3 |
| Intrus | `jeux-intrus` | Groupes de 4 (3 + 1 intrus) | 4 groupes |
| Dominos | `jeux-dominos` | Enchaînement (chaque moitié a une paire) | 8 dominos |
| Tri / catégories | `jeux-tri` | Cartes-mots + étiquettes catégories | 12 mots, 3 catégories |

### Famille B — Jeu structuré (`jeux-structures`)

| Template | Id type | Notes |
|---|---|---|
| 7 familles | `jeux-sept-familles` | En-tête thème + 4 sous-cartes / famille |
| Plateau | `jeux-plateau` | Paysage, cases numérotées, lien paquet questions (réutilise A) |
| Dé / roue | `jeux-de-roue` | Patron fixe (SVG) ; zones texte limitées |

### Famille C — Texte à manipuler (`jeux-etiquettes`)

| Template | Id type | Notes |
|---|---|---|
| Bandes-mots | `jeux-bandes-mots` | Découpe auto d’une phrase saisie |
| Phrases à reconstituer | `jeux-phrases-texte` | Variante : une bande = une phrase (texte multi-phrases) |

---

## 4. Saisie et images

- Formulaire **généré** depuis `fields` du schéma (pas de contrôles de police / couleur / position).
- Validation : `maxTextLen`, formats image `jpg` / `png` / `svg` / `webp`.
- Images : lecture locale → data URL dans l’état de page ; ratio fixe template ; `object-fit: cover` ; pas de redimensionnement libre (recentrage optionnel plus tard).
- Aperçu A4 synchronisé avec la saisie (même `WorksheetSheet` / feuille jeu).

---

## 5. Impression A4

- Feuille fixe 210×297 mm (ou 297×210 en paysage) ; `overflow: hidden` — **même règle produit** que les autres domaines.
- `@media print` : masquer l’UI générateur ; n’imprimer que les feuilles jeu.
- En-têtes / pieds navigateur : notice courte avant impression (« désactiver en-têtes et pieds dans la boîte d’impression »).
- **Décision V1** : impression navigateur (comme le reste de ClairFLE). PDF client = option ultérieure si les réglages navigateur restent trop fragiles.

---

## 6. Design

- Palette **par famille** (variables CSS dédiées `--jeux-*`), distincte du violet scolaire des fiches exercices.
- Décor figé dans le template : coins arrondis, pointillés de découpe, pictos — non éditables.
- Lisibilité N&B : la couleur (ex. vert/rouge vrai-faux) est **doublée** d’un libellé ou symbole (« V » / « F »).

---

## 7. Décisions tranchées (ex-« points à trancher »)

| Question | Décision V1 |
|---|---|
| PDF client vs print navigateur | **Print navigateur** + notice ; PDF plus tard si besoin |
| Sauvegarde des fiches | **Session locale** (état React + seed) ; pas de compte utilisateur |
| Limites mots / cartes | Table §3 (caps par template) ; ajustables après premiers essais print |
| Contenu initial | Saisie enseignant·e ; branchement ultérieur possible sur banques Voc des thèmes français |
| En-tête / footer / éval | **Absents** sur les feuilles jeu |

---

## 8. Ordre d’implémentation

### Phase 0 — Socle catalogue + UI ✅

Domaine `jeux`, thèmes, types, option après Phrase, sans chrome scolaire.

### Phase 1 — Moteur A4 jeu ✅

`CardGrid`, layout `card-grid`, schémas `templates.ts`, `tryGenerateJeuxBatch`.

### Phase 2 — Templates simples ✅

Vocabulaire, Vrai/Faux, Devinettes (saisie texte ; zone image vide en attendant l’upload).

### Phase 3 — Génération automatique ✅

Mémory (duplication + shuffle seed), Loto, Intrus.

### Phase 4 — Images (à venir)

Upload sur Vocabulaire, puis généralisation famille A.

### Phase 5 — Templates liés ✅

Dominos, Tri/catégorisation.

### Phase 6 — Famille C ✅

Bandes-mots, Phrases à reconstituer.

### Phase 7 — Famille B ✅ (version compacte portrait)

7 familles, Plateau, Dé/roue — raffinements paysage / patrons SVG ensuite.

---

## 9. Critères « terminé » par vague

- Lint + build OK.
- Aperçu A4 fixe (portrait ou paysage selon template), pas de scale selon le contenu.
- Impression = mêmes feuilles que l’aperçu.
- Tirages (mémory, loto, …) reproductibles à graine égale.
- Aucun élément copié d’une référence externe.
- Domaine Jeux utilisable sans contrôles maths (colonnes, difficulté, points) non pertinents.

---

## 10. Hors scope V1

- Compte utilisateur / sauvegarde cloud.
- Export PDF garanti hors navigateur.
- Éditeur libre de mise en page (drag de cartes, polices custom).
- Jeux numériques interactifs (uniquement fiches imprimables).
