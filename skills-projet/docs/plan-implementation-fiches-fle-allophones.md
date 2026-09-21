# Plan d'implémentation v2 — fiches de FLE imprimables pour apprenant·e·s allophones

Version 2.1 · 21 septembre 2026 · **remplace la v1** · ajout du §15 (skills et conventions du projet)
Base technique : React + Vite + Tailwind CSS v4 (build de production OK, branche `v0/setup-react-tailwind`)
Inspiration visuelle : capture de landing page fournie (mise en page, typographie, couleurs, espacements). **Aucun texte, logo ou illustration de la référence n'est repris** : tout le contenu ci-dessous est original.

---

## Ce qui change par rapport à la v1

Le public est désormais précisé : **des personnes allophones qui doivent apprendre le français**. Cela transforme le produit plus que l'apparence.

| Sujet | v1 (enseignement général) | v2 (FLE, allophones) |
|---|---|---|
| Axe principal des fiches | Matière + degré scolaire | **Niveau de littératie + niveau CECRL + thème de vie** |
| Catalogue | Langue et maths | Graphisme, phonie-graphie, lexique imagé, grammaire, documents du quotidien, compréhension, production |
| Images | Décoratives | **Porteuses de sens** : mots-images, pictogrammes de consigne, documents fictifs |
| Contenus | Quelques banques de données | **Chantier de contenus linguistiques** au même rang que le code (lexique, graphèmes, consignes, images) |
| Qualité | Tests de code | + **garde-fou de niveau** : le site signale les mots qui dépassent le niveau visé |
| Écriture | Une police lisible | Bâton / cursive, lignage, modèles pointillés, très grandes tailles |
| Registre | Neutre | **Adulte et respectueux** (adultes par défaut), prénoms fictifs variés, aucun stéréotype |
| Feuille de route | Générique | Départ sur pré-alpha → A1 (le plus déterministe), puis A2 → B2 |

Le design (bandes, titres légers, bleu et vert, illustrations plates au trait) reste inchangé dans son esprit ; seuls les contenus des illustrations et les textes changent.

**Ajout v2.1** : le §15 décrit un ensemble de **skills** (instructions réutilisables pour Claude Code) et un fichier `CLAUDE.md`, livrés dans `skills-projet.zip`. Chaque nouveau contenu (exercice, composant, illustration, section, thème de lexique, unité) part ainsi d'un gabarit et d'une checklist, au lieu d'être réexpliqué à chaque fois.

---

## Sommaire

1. En bref et principes directeurs
2. Hypothèses et décisions à trancher
3. Direction visuelle (inspiration → traduction)
4. Architecture technique
5. Chantier « contenus linguistiques »
6. Catalogue des exercices et des unités
7. Parcours et écrans du générateur
8. Impression : spécifications
9. Lisibilité et accessibilité
10. Qualité, tests, déploiement
11. Données, licences, confidentialité
12. Feuille de route par phases
13. Risques
14. Première semaine : actions concrètes
15. Skills et conventions du projet
- Annexe A — Textes originaux proposés pour la page d'accueil
- Annexe B — Extraits de code de départ

---

## 1. En bref et principes directeurs

**Deux publics à ne pas confondre.**
- **Utilisateurs du site** : formateurs et formatrices de français langue étrangère (professionnel·le·s, bénévoles, associations).
- **Destinataires des fiches** : apprenant·e·s allophones, surtout adultes, de niveaux très hétérogènes (du pré-alpha au B2).

Si les apprenant·e·s doivent aussi travailler eux-mêmes sur écran, c'est un mode « élève numérique » à prévoir plus tard (hors MVP).

**Objectif.** En quelques minutes, un·e formateur·trice compose une fiche de FLE propre, adaptée au niveau de lecture et d'écriture de son groupe, imprimable en A4, avec son corrigé.

**Le produit, c'est la feuille A4.** Le site sert à en fabriquer de bonnes.

Neuf principes :

1. **Le papier prime sur l'écran.** Ce qui sort de l'imprimante est ce qui compte.
2. **Déterministe d'abord, IA ensuite.** Tableaux de syllabes, mots-images, conjugaisons, textes à trous, grilles : du code et des données relues, sans risque d'erreur inventée. L'IA n'intervient que pour ce que le code ne fait pas (textes de lecture), et toujours avec relecture.
3. **Une fiche = une recette + des retouches.** Paramètres, graine aléatoire et modifications manuelles : régénérable, duplicable, partageable par lien.
4. **Local-first.** Pas de compte au départ.
5. **Aucune donnée personnelle sur les apprenant·e·s.** Aucun nom réel dans les exemples : prénoms fictifs et variés.
6. **Registre adulte et respectueux.** Images, thèmes et ton adaptés à des adultes ; option de registre pour adolescent·e·s ou enfants plus tard.
7. **L'image porte le sens.** Chaque consigne a son pictogramme, chaque mot nouveau son image quand c'est possible.
8. **Le niveau est une contrainte vérifiée.** Consignes et textes n'utilisent que le vocabulaire du niveau ; le site signale les écarts.
9. **Ajouter un type d'exercice = ajouter un dossier.** Registre modulaire.

---

## 2. Hypothèses et décisions à trancher

Les valeurs par défaut permettent de démarrer sans bloquer. Elles sont faciles à changer si le modèle de données reste agnostique.

| Décision | Proposition par défaut | Quand trancher |
|---|---|---|
| Nom du site et domaine | À définir (placeholder `[Nom]`) | Avant la phase 2 |
| Apprenant·e·s | Adultes par défaut ; registre d'images « adulte » ou « neutre » | Phase 0 |
| Axes de niveau | **Littératie** (pré-alpha, alpha, post-alpha, lecteur-scripteur) **et** CECRL (A1.1, A1, A2, B1, B2) — subdivisions à confirmer selon les usages du terrain | Phase 0 |
| Référentiels optionnels | CECRL, fide (scénarios), préparation aux tests de type TCF : un référentiel = un fichier de données, jamais codé en dur | Phase 4 |
| Langue des consignes | Français simple + pictogramme ; aide en langue d'origine = option ultérieure (voir §6.9) | Phase 0 |
| Tutoiement / vouvoiement des consignes | Vouvoiement par défaut (adultes), réglable | Phase 0 |
| Écriture | Bâton par défaut ; cursive et « les deux » en option | Phase 3 |
| Contexte de vie | Suisse romande (thèmes du quotidien locaux), avec jeux de données remplaçables | Phase 4 |
| MVP | Pré-alpha → A1, puis A2 | Phase 0 |
| Audio | Script lu par le/la formateur·trice (dans le corrigé) au MVP ; QR code + fichier audio en phase ultérieure | Phase 9 |
| Compte utilisateur | Non au MVP | Avant la phase 7 |
| IA | Non au MVP ; optionnelle | Avant la phase 9 |
| Modèle économique | Gratuit pendant le MVP ; décider ensuite | Avant la phase 7 |
| Langage | TypeScript | Immédiat |
| Hébergement | Vercel, Netlify ou Cloudflare Pages | Phase 1 |

---

## 3. Direction visuelle (inspiration → traduction)

### 3.1 Ce que la référence apporte

- **Rythme par bandes** : sections alternant fond blanc et fond gris-bleu très clair, avec beaucoup d'air (environ 100 px verticaux).
- **Colonne étroite centrée** pour l'introduction ; **deux colonnes texte / illustration** en alternance.
- **Titre d'accroche léger**, grand, gris foncé, sur deux lignes.
- **Petit intitulé bleu** au-dessus de chaque titre.
- **Un appel à l'action** répété (bouton vert vif).
- **Illustrations plates au trait** : contour foncé régulier, remplissages pastel (violet, rose, orange, vert), pas de dégradé, pastilles circulaires en pointillé reliées entre elles (motif « orbite »).
- **Pied de page discret**.
- Texte courant petit, gris moyen, interligne très généreux.

### 3.2 Traduction pour ce projet

| On retient | On adapte | On ne reprend pas |
|---|---|---|
| Bandes blanc / gris-bleu clair | Mêmes bandes ; chaque bande montre une **vraie fiche de FLE** générée par le moteur | Le découpage par public de la référence |
| Alternance texte / illustration | Les « illustrations » sont des **aperçus de fiches A4 réels** et des schémas d'interface dessinés sur mesure | Toute illustration ou icône de la référence |
| Titre léger, grand, deux lignes | Même principe, police propre au projet | Textes, intitulés, formulations |
| Petit intitulé bleu | Conservé en **casse de phrase**, seulement quand il informe | Un intitulé sur chaque section par automatisme |
| Bouton vert vif | Vert plus profond pour le contraste | Le champ e-mail « liste d'attente » |
| Motif d'orbite en pointillé | Une **fiche A4 au centre**, entourée de pastilles d'exercices (relier, écrire, entourer, syllabes, colorier, écouter) | Les avatars |

**Un seul point fort visuel** : la fiche A4 réelle, légèrement inclinée, dans le hero. Par exemple une fiche « mots-images » avec pictogrammes de consigne. Tout le reste reste calme.

### 3.3 Palette

Vives pour les aplats et illustrations, plus sombres pour le texte et les boutons (contraste AA visé, à vérifier avec un outil dédié).

| Rôle | Nom | Hex | Usage |
|---|---|---|---|
| Texte principal | `ink` | `#2B2F3A` | Titres, corps |
| Texte secondaire | `ink-soft` | `#4A5060` | Paragraphes, légendes |
| Filet | `line` | `#E3E7EE` | Bordures, séparateurs |
| Bande claire | `band` | `#F4F7FB` | Fond des sections alternées |
| Bleu de marque | `brand-500` | `#2D7FE6` | Logo, illustrations, focus |
| Bleu texte | `brand-700` | `#1A67D2` | Intitulés, liens (≈ 5:1) |
| Vert vif | `go-400` | `#5BC236` | Illustrations, pastilles |
| Vert bouton | `go-700` | `#2A8417` | Bouton principal, texte blanc (≈ 4,7:1) |
| Pastel violet | `tint-violet` | `#F1DDFB` (trait `#B44FD8`) | Pastilles d'exercices |
| Pastel rose | `tint-rose` | `#FBD5E0` (trait `#E5486F`) | Idem |
| Pastel orange | `tint-orange` | `#FCE3C8` (trait `#F0993A`) | Idem |
| Pastel vert | `tint-green` | `#D9F5CC` (trait `#4CB82A`) | Idem |
| Trait d'illustration | `stroke` | `#3F4451` | Contours 2 px |

**Sur les fiches imprimées** : la couleur ne porte jamais seule une information. « Colorie en rouge » s'accompagne d'un libellé ou d'un échantillon étiqueté. Toute fiche doit rester utilisable en noir et blanc.

### 3.4 Typographie

**Interface et vitrine**
- Titres : `Outfit` (géométrique, graisses 300 à 500).
- Texte : `Figtree`, 17 px, interligne 1,75, moins de 70 caractères par ligne.
- Échelle : hero 48/1,15 (mobile 36) · h2 32/1,2 · h3 22/1,3 · texte 17/1,75 · légende 14/1,5.
- Polices auto-hébergées (`@fontsource-variable/outfit`, `@fontsource-variable/figtree`).

**Fiches imprimées (spécifique FLE)**
- `Andika` (licence OFL) par défaut : conçue pour l'apprentissage de la lecture, lettres bien distinctes (a/g/q, I/l).
- Option `Atkinson Hyperlegible`.
- Écriture cursive et modèles de tracé : candidates à évaluer, **licence à vérifier avant tout ajout**.
- Tailles : **standard** 12 pt · **grand** 14 pt · **très grand** 16 pt · **alpha** 20 pt pour les mots et 28 pt ou plus pour lettres et syllabes-modèles (valeurs de départ, à valider par des essais d'impression avec de vrais apprenant·e·s).
- Interlignes et espaces de réponse plus larges à mesure que la taille augmente.

### 3.5 Grille, espacement, formes

- Conteneur max **1120 px**, marges 24 px (mobile) / 40 px (bureau).
- Bandes : `py-24` bureau, `py-16` mobile.
- Rangées : 12 colonnes, texte sur 5, image sur 6, une colonne de respiration.
- Rayons : 6 px (boutons, champs), 16 px (grands aperçus). **Pas de grille de cartes identiques** : texte et image posés directement sur la bande, comme dans la référence.
- Ombre : une seule, douce, réservée aux feuilles A4 (papier qui flotte).

### 3.6 Composants

`src/components/ui/` : `Button` (primaire, secondaire, texte), `Field`, `Select`, `Segmented`, `Stepper`, `Toggle`, `Tabs`, `Accordion`, `Modal`, `Toast`, `Sheet` (feuille A4), `Badge` d'exercice (pastille pastel + icône), `LevelPicker` (littératie + CECRL), `Alert` (garde-fou de niveau).
Chaque composant : focus visible, cible tactile ≥ 44 px, états désactivé et erreur.

### 3.7 Illustrations

Deux séries **distinctes** à ne pas mélanger :

1. **Illustrations de la vitrine** (site) : plates, contour 2 px, pastels. Personnages **adultes, divers, sans stéréotype**, dans des situations de vie quotidienne (courses, rendez-vous, transports, travail). Inventaire : hero (fiche A4 + orbite), réglages, modification, impression, bibliothèque, motif de pied de page. En SVG React, couleurs pilotées par les jetons.
2. **Banque d'images pédagogiques** (fiches) : voir §5.4.

### 3.8 Maquette de la page d'accueil

```
┌──────────────────────────────────────────────────────────────┐
│ [Logo]                              Exemples   [Créer une fiche] │  en-tête fin, blanc
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Titre d'accroche léger,            ╭ ─ ─ ─ ─ ─ ╮           │
│  sur deux lignes                    │  ●   ┌───┐  ●│  hero    │
│                                     │      │A4 │   │  (fiche  │
│  Sous-titre court.                  │  ●   │FLE│  ●│  réelle) │
│  [Créer une fiche]  Voir exemples   │      └───┘   │           │
│                                     ╰ ─ ─ ● ─ ─ ─ ╯           │
├──────────────────────────────────────────────────────────────┤  bande claire
│              Petit intitulé bleu                             │
│         Titre centré, colonne étroite                        │
│         Paragraphe d'introduction                            │
│                  [ aperçu large : éditeur + feuille ]        │
├──────────────────────────────────────────────────────────────┤  blanc
│  Intitulé                             ┌──────────┐           │
│  Titre                                │ aperçu   │           │
│  Paragraphe                           │ fiche    │           │
│                                       └──────────┘           │
├──────────────────────────────────────────────────────────────┤  bande claire
│  ┌──────────┐                          Intitulé              │
│  │ aperçu   │                          Titre                 │
│  └──────────┘                          Paragraphe            │
├──────────────────────────────────────────────────────────────┤  blanc (répéter 1 à 2 fois)
│                 Bande d'appel final                          │
│                  [Créer une fiche]                           │
├──────────────────────────────────────────────────────────────┤
│  © année · [Nom]                     Contact · Mentions       │  pied discret
└──────────────────────────────────────────────────────────────┘
```

Rangées suggérées : réglage selon le niveau · images et consignes claires · modification sur la page · impression et bibliothèque. Textes proposés en annexe A.

### 3.9 Mouvement

Sobre : une animation d'entrée (le hero), des transitions qui répondent à une action. `prefers-reduced-motion` respecté.

---

## 4. Architecture technique

### 4.1 Stack

| Besoin | Choix | Remarque |
|---|---|---|
| Build | Vite | En place |
| Style | Tailwind CSS v4 via `@tailwindcss/vite` | Configuration dans le CSS (`@theme`), variante `print:` |
| Routage | React Router | `/`, `/creer`, `/fiches`, `/fiches/:id`, `/exemples`, `/aide` |
| État | Zustand | Léger, facile à persister |
| Formulaires | React Hook Form + Zod | Le schéma valide aussi les fichiers importés |
| Persistance locale | IndexedDB via Dexie | `localStorage` est trop limité |
| Glisser-déposer | dnd-kit | Réorganiser les exercices |
| Tests | Vitest, Testing Library, Playwright, axe | Voir §10 |
| Prérendu vitrine | `vite-react-ssg` (à évaluer) | Référencement de la page d'accueil |
| Conversion de contenus | Script Node (`xlsx` → JSON) | Import des lexiques existants (§5.1) |

**Aucune clé d'API dans une variable `VITE_*`** : tout ce qui commence par `VITE_` est public dans le code envoyé au navigateur.

### 4.2 Structure des dossiers

```
src/
  app/                    routeur, fournisseurs, layout
  components/
    ui/                   Button, Field, LevelPicker, Alert, Sheet…
    illustrations/        SVG React de la vitrine
    pictograms/           pictogrammes de consigne (SVG React)
  features/
    landing/
    builder/              réglages, aperçu, barre d'outils, store
    library/
    exercises/
      registry.ts
      syllable-table/     tableaux de syllabes et pseudo-mots
      match-images/       relier mots et images
      fill-blanks/        texte à trous
      …                   un dossier par type d'exercice
    units/                séquences complètes (unité phonique, thématique…)
    print/                PrintSheet, en-tête, lignage, CSS d'impression
    export/
  lib/                    rng, schémas, i18n, contrôle de niveau
  content/
    lexique/              un fichier JSON par thème
    graphemes/            correspondances graphème–phonème
    consignes/            consignes types par niveau
    images/               banque d'images (SVG + métadonnées)
    scenarios/            situations de vie (documents fictifs)
    SOURCES.md            provenance et licence de chaque jeu de données
  styles/                 index.css (thème), print.css
scripts/
  import-lexique.ts       Excel/CSV → JSON validé
  check-content.ts        contrôle des données
```

### 4.3 Modèle de données

La fiche stocke la **recette**, pas seulement le résultat.

```ts
type Literacy = "pre-alpha" | "alpha" | "post-alpha" | "lecteur";
type Cefr = "A1.1" | "A1" | "A2" | "B1" | "B2";

type Worksheet = {
  id: string;
  schemaVersion: 2;
  meta: {
    title: string;
    level: { literacy: Literacy; cefr?: Cefr };
    skill:
      | "graphisme" | "phonie-graphie" | "lexique" | "grammaire"
      | "comprehension-ecrite" | "comprehension-orale"
      | "production-ecrite" | "production-orale" | "documents";
    theme?: string;          // clé du lexique : "sante", "logement", "travail"…
    canDo: string;           // « Je peux… » : objectif formulé pour l'apprenant·e
    frameworkRef?: string;   // ex. "CECRL:A1" ou code de scénario
    createdAt: string;
    updatedAt: string;
  };
  layout: {
    orientation: "portrait" | "landscape";
    density: "standard" | "large" | "xlarge" | "alpha";
    scriptStyle: "baton" | "cursive" | "both";
    letterCase: "lower" | "upper" | "mixed";
    ruling: "none" | "lines" | "grid5" | "seyes";
    consigne: { person: "vous" | "tu" | "infinitif"; pictograms: boolean };
    syllables: "off" | "marks" | "colors";
    imageStyle: "adult" | "neutral";
    colorMode: "color" | "grayscale" | "lowInk";
    header: { name: boolean; date: boolean; groupName: boolean; score: boolean };
  };
  blocks: Block[];
};

type Block = {
  id: string;
  kind: string;             // clé du registre d'exercices
  params: unknown;          // validé par le schéma Zod du type d'exercice
  seed: number;             // « régénérer » = nouvelle graine
  overrides?: Record<string, unknown>; // retouches manuelles
};
```

Conséquences : partage par lien sans serveur (recette compressée avec `lz-string`), duplication triviale, migrations via `schemaVersion`.

### 4.4 Registre d'exercices

```ts
interface ExerciseDefinition<P> {
  kind: string;
  label: string;                    // « Tableau de syllabes », « Relier mots et images »…
  skills: string[];                 // compétences où il est proposé
  levels: Literacy[];               // niveaux de littératie adaptés
  icon: React.FC;
  paramsSchema: ZodType<P>;
  defaults: P;
  generate(params: P, rng: Rng, ctx: GenerationContext): { items: unknown[]; answers: unknown[]; warnings?: string[] };
  Render: React.FC<{ block: Block; data: unknown; mode: "student" | "teacher" }>;
}
```

- `generate` est **pure** : mêmes `(params, rng, ctx)` → même résultat.
- `ctx` fournit le lexique, les graphèmes et les images chargés, ainsi que le niveau visé.
- `warnings` alimente le garde-fou de niveau et les cas impossibles (banque trop petite, par exemple).
- Le corrigé est `answers`, affiché en mode `teacher`.
- Aucun `Math.random()` dans les générateurs : uniquement le `rng` à graine.

### 4.5 Rendu de la fiche

Composant `PrintSheet` unique, à l'écran et à l'impression (même DOM, mêmes styles) :

- Une `.sheet` = une page A4.
- En-tête : titre, objectif « Je peux… », lignes vides (nom, date, groupe), cadre de note optionnel.
- Corps : blocs d'exercices avec pictogramme de consigne.
- Pied : niveau, thème, numéro de page.
- Corrigé sur pages séparées, masqué en version apprenant·e.

### 4.6 Pagination

1. **Phase 3** : aperçu continu avec repères de page tous les 297 mm ; impression avec `break-inside: avoid` et `break-after: page`.
2. **Phase 6** : pagination mesurée (blocs répartis selon leur hauteur réelle, `ResizeObserver`) pour que l'aperçu soit identique à l'impression. À comparer avec Paged.js avant de développer sa propre solution.

### 4.7 Persistance et partage

- MVP : IndexedDB (fiches, brouillon, préférences).
- Export/import : fichier `.json` validé par Zod.
- Partage : lien contenant la recette compressée.
- Plus tard, si comptes : Supabase ou Firebase ; le modèle étant sérialisable, seule une couche de synchronisation est à ajouter.

### 4.8 Export

| Format | Approche | Phase |
|---|---|---|
| Impression | `window.print()` + CSS d'impression | 3 |
| PDF | « Enregistrer en PDF » depuis l'impression ; option ultérieure : rendu serveur Chromium | 3, puis 7 |
| Word (.docx) | Bibliothèque `docx`, export simplifié | 7 |
| Fichier `.json` | Sauvegarde et partage de recette | 7 |

Éviter `@react-pdf/renderer` en premier choix : second arbre de rendu à maintenir.

### 4.9 IA générative (optionnelle)

- Fonction serverless : paramètres en entrée (niveau, thème, longueur, **vocabulaire autorisé**), sortie JSON validée par schéma.
- Clé côté serveur uniquement ; limitation de débit ; pas de données personnelles dans les journaux.
- Le texte généré passe **obligatoirement** par le garde-fou de niveau (§5.6) et arrive dans l'éditeur avec un bandeau « à relire ».
- Conjugaisons, règles et tables restent **hors IA** (fichiers vérifiés).
- L'application reste entièrement utilisable sans IA.

### 4.10 Internationalisation

Interface en français, `<html lang="fr-CH">`, toutes les chaînes dans un dictionnaire central. L'ajout ultérieur de consignes ou de glossaires dans d'autres langues (dont écritures de droite à gauche) demandera la prise en charge de `dir="rtl"` et de polices adaptées (voir §6.9).

---

## 5. Chantier « contenus linguistiques »

C'est le cœur de la qualité. Il avance **en parallèle du code**, avec ses propres critères de qualité et sa relecture.

### 5.1 Lexique thématique

Un fichier JSON par thème (famille, corps et santé, logement, travail, transports, administration, courses, école des enfants…).

```json
{
  "id": "sante.medecin",
  "lemma": "médecin",
  "forms": ["médecin", "médecins"],
  "pos": "nom",
  "gender": "m",
  "level": "A1",
  "syllables": ["mé", "de", "cin"],
  "theme": "sante",
  "imageId": "img-medecin",
  "definition": "Personne qui soigne les malades.",
  "example": "Je vais chez le médecin.",
  "tags": ["metier", "sante"]
}
```

- Import depuis les **lexiques existants en Excel ou CSV** via `scripts/import-lexique.ts` (une feuille = un thème), avec rapport d'erreurs.
- Champs indispensables dès le départ : `lemma`, `forms`, `level`, `syllables`, `theme`. Les autres (définition, exemple, image) sont enrichis progressivement.
- Les syllabes sont **saisies dans les données**, pas calculées : la syllabation du français est irrégulière et un algorithme approximatif produirait des erreurs visibles.

### 5.2 Graphèmes et phonèmes

`content/graphemes/` : tableau des correspondances (graphie, phonème, catégorie voyelle/consonne, position, exemples, difficulté). Sert aux unités phoniques, aux tableaux de syllabes et aux pseudo-mots. Ordre de progression **modifiable** par le/la formateur·trice.

### 5.3 Consignes et pictogrammes

- Banque de consignes types par niveau : phrases courtes, un seul verbe d'action, verbes constants d'une fiche à l'autre.
- Réglages : « vous », « tu » ou infinitif.
- Pictogrammes de consigne dessinés sur mesure, même style et même badge circulaire : entourer, colorier, écrire, relier, cocher, souligner, barrer, observer, écouter, parler, numéroter, compléter, classer, associer, coller, découper.
- **Mode pré-alpha/alpha** : le pictogramme est obligatoire, la consigne écrite est très courte ou lue par le/la formateur·trice.

### 5.4 Banque d'images

Pour chaque image : `id`, mot(s) associé(s), thème, style, source, **licence**, auteur, date d'ajout.

- **SVG de préférence** (net à l'impression, recolorisable, léger).
- Images **adultes et culturellement neutres** : vérifier notamment les scènes de repas, de vêtements, de fêtes, de famille et de santé, afin de ne pas exclure ou stéréotyper.
- Style cohérent sur toute la banque (un même dessinateur ou une même série).
- Une image ambiguë est pire qu'aucune image : chaque image est testée sur « quel mot y voit-on ? ».
- Sources possibles : dessins originaux, banques libres. Vérifier chaque licence (certaines interdisent l'usage commercial ou imposent le partage à l'identique) et l'inscrire dans `SOURCES.md`.

### 5.5 Documents du quotidien (fictifs)

Gabarits de documents réalistes mais **entièrement fictifs** : horaires de transport, plan, étiquette de produit, facture simple, annonce, formulaire, carte de rendez-vous, message à l'école, ordonnance-type sans marque réelle.
- Aucun logo, aucune mise en page copiant une institution réelle, aucune donnée réelle.
- Chaque gabarit est un composant React paramétrable (noms fictifs, dates, montants).

### 5.6 Garde-fou de niveau

Un contrôle qui compare tout texte de la fiche (consignes, phrases, textes) au lexique autorisé pour le niveau visé.
- Mots au-dessus du niveau, ou inconnus : **surlignés dans l'éditeur** avec le message « 3 mots dépassent le niveau A1 » et l'action « Voir les mots ».
- Liste blanche par fiche (mots que le/la formateur·trice veut introduire volontairement).
- Utilisé aussi pour valider les sorties de l'IA avant affichage.
- Limites à assumer : formes conjuguées et accordées à couvrir via `forms`, noms propres à ignorer.

### 5.7 Relecture et versionnage

- Chaque jeu de données passe par une relecture humaine avant fusion.
- `check-content.ts` (en CI) contrôle : doublons, niveaux manquants, syllabes incohérentes (leur concaténation doit redonner le mot), images référencées mais absentes, licence manquante.
- Chaque fichier de contenu porte un numéro de version.

---

## 6. Catalogue des exercices et des unités

Priorité **MVP** (pré-alpha → A1, déterministe) → **v2** (A2 à B1) → **v3** (B1 à B2, IA, audio).

### 6.1 Graphisme et écriture (pré-alpha, alpha)

| Exercice | Priorité | Génération |
|---|---|---|
| Tracés et graphismes (lignes, boucles, ponts, spirales) | MVP | Motifs SVG paramétrables |
| Lettres à repasser (pointillé) et à copier | MVP | Contours de lettres en pointillé, tailles et lignage réglables |
| Écrire son prénom, son adresse, sa date de naissance (modèles) | MVP | Cadres de copie avec lignage |
| Copier des mots et des syllabes sur lignes | MVP | Listes issues du lexique |
| Sens et ordre du tracé (flèches) | v3 | Nécessite des données de tracé lettre par lettre |

### 6.2 Phonie-graphie et lecture

| Exercice | Priorité | Génération |
|---|---|---|
| Tableau de syllabes et de pseudo-mots par graphème | MVP | Tirage à graine dans les tables de graphèmes |
| Entourer la lettre / le graphème dans une liste de mots | MVP | Mots du lexique contenant le graphème |
| Relier syllabes pour former un mot | MVP | Mots syllabés du lexique |
| Discrimination visuelle (trouver l'intrus, deux lettres proches) | MVP | Paires de lettres et de mots proches |
| Remettre les lettres ou les syllabes dans l'ordre | MVP | Mélange contrôlé |
| Mots mêlés et grilles | v2 | Placement dans une grille |
| Dictée de syllabes, mots et phrases (avec lignage) | v2 | Lignes vides + script pour le/la formateur·trice |
| Lecture de phrases avec syllabes colorées ou marquées | v2 | Utilise `syllables` du lexique |

### 6.3 Lexique

| Exercice | Priorité | Génération |
|---|---|---|
| Relier mots et images | MVP | Paires du thème, niveau filtré |
| Étiqueter une image (mots donnés ou non) | MVP | Image + zones de réponse |
| Classer dans un tableau (catégories du thème) | MVP | Listes par catégorie |
| Mots-images à compléter (lettre manquante) | MVP | Mot masqué aléatoirement selon règles |
| Fiche « mots du thème » (image, mot, article, exemple) | MVP | Depuis le lexique |
| Jeu de cartes à découper (mots/images, memory) | v2 | Mise en page de cartes |
| Définitions et synonymes | v3 | Banque de définitions |

### 6.4 Grammaire et conjugaison

| Exercice | Priorité | Génération |
|---|---|---|
| Articles (le/la/un/une/des) avec images | MVP | Lexique avec genre |
| Masculin / féminin, singulier / pluriel | v2 | Formes du lexique |
| Tableau de conjugaison à compléter (être, avoir, aller, verbes en -er) | v2 | Tables JSON vérifiées |
| Phrase à remettre dans l'ordre (étiquettes rectangulaires) | v2 | Phrases-modèles par niveau |
| Négation, questions, prépositions de lieu | v2 | Gabarits de phrases |
| Passé composé, futur proche, connecteurs | v3 | Tables + gabarits |

### 6.5 Compréhension

| Exercice | Priorité | Génération |
|---|---|---|
| Lire un document du quotidien et répondre (vrai/faux, QCM, cocher) | v2 | Gabarits §5.5 |
| Texte à trous avec banque de mots | v2 | Phrases-banque ou texte fourni |
| Texte court + questions | v3 | Texte fourni par le/la formateur·trice, ou IA relue |
| Compréhension orale (script pour la lecture à voix haute) | v2 | Script dans le corrigé |
| Compréhension orale avec QR code et audio | v3 | Fichier audio hébergé + QR imprimé |

### 6.6 Production

| Exercice | Priorité | Génération |
|---|---|---|
| Remplir un formulaire fictif | v2 | Gabarits §5.5 |
| Écrire une phrase à partir d'une image et de mots donnés | v2 | Cadres de production guidée |
| Compléter un dialogue | v2 | Dialogues-modèles par niveau |
| Écrire un court message (modèle + trous) | v3 | Gabarits par situation |
| Production libre encadrée (critères) | v3 | Cadre + grille d'auto-évaluation |

### 6.7 Unités (séquences complètes)

Une unité est un **ensemble de fiches générées d'un coup** autour d'un objectif.

| Unité | Contenu type | Priorité |
|---|---|---|
| **Unité phonique** | Pour un graphème choisi : galerie de mots-images, entourer la lettre, syllabes, relier, dictée, phrases, mots mêlés… (environ 12 à 16 exercices en gabarit) | MVP |
| **Unité thématique** | Mots du thème + relier + classer + phrases modèles + production courte | v2 |
| **Unité document** | Un document du quotidien + compréhension + vocabulaire + production | v2 |
| **Unité de révision** | Sélection d'exercices sur plusieurs graphèmes ou thèmes | v3 |

### 6.8 Transversal

Lignes d'écriture (interlignes réglables) · quadrillage 5 mm · réglure scolaire · cases à cocher · cadre de dessin · tableau à cellules de hauteur fixe · barre de progression / auto-évaluation « Je peux… ».

### 6.9 Aide en langue d'origine (v3, à cadrer)

Certains publics bénéficient de consignes ou de mots-clés dans leur langue, d'autres formateurs·trices préfèrent une approche 100 % français. À traiter comme **option**, jamais par défaut :
- Traductions **relues par des humains** (pas de traduction automatique brute).
- Prise en charge de l'écriture de droite à gauche (`dir="rtl"`), de polices adaptées (familles Noto par écriture) et d'un aperçu vérifié.
- Périmètre limité : consignes et glossaire, pas le contenu des exercices.

---

## 7. Parcours et écrans du générateur

### 7.1 Parcours en 6 étapes (séquence réelle)

1. **Niveau** : littératie et CECRL (`LevelPicker`).
2. **Compétence et thème** : liste guidée + « Je peux… » suggéré (modifiable).
3. **Exercice ou unité** : pastilles proposées selon le niveau et la compétence.
4. **Options** : nombre d'items, difficulté, images oui/non, banque de mots, exemple résolu, syllabation.
5. **Mise en page** : taille, écriture (bâton/cursive), lignage, pictogrammes, en-tête, couleur.
6. **Vérifier et imprimer** : garde-fou de niveau, corrigé, impression.

L'aperçu se met à jour à chaque réglage.

### 7.2 Écran principal (bureau)

```
┌────────────────────────────────────────────────────────────────────┐
│ [Logo]  Mes fiches   Exemples          [Corrigé ○]  [Imprimer ▾]   │
├───────────────┬────────────────────────────────────┬───────────────┤
│ Réglages      │      ┌──────────────────────┐      │ Exercices     │
│ 1 Niveau      │      │ Nom : ____  Date : __│      │ ┌───────────┐ │
│ 2 Compétence  │      │ Je peux : …          │      │ │ Ex. 1  ⋮⋮ │ │
│ 3 Exercice    │      │                      │      │ │ Ex. 2  ⋮⋮ │ │
│ 4 Options     │      │ [Ex. 1 ..........]   │      │ └───────────┘ │
│ 5 Mise en     │      │ [Ex. 2 ..........]   │      │ [+ Ajouter]   │
│   page        │      └──────────────────────┘      │               │
│               │        page 1 / 2                  │ Propriétés    │
│ ⚠ 3 mots      │                                    │ de l'exercice │
│ dépassent A1  │                                    │               │
│ [Régénérer]   │                                    │               │
└───────────────┴────────────────────────────────────┴───────────────┘
```

- Colonne gauche : réglages globaux (accordéon) + alertes de niveau.
- Centre : feuille A4 mise à l'échelle, zoom, repères de page.
- Colonne droite : liste réordonnable des exercices + propriétés (nombre d'items, régénérer, verrouiller un item, dupliquer, supprimer).
- **Mobile** : onglets « Réglages » / « Aperçu », barre d'action fixe en bas.

### 7.3 Édition sur la page

- Clic sur une consigne, une phrase ou un item : édition directe.
- Les mots hors niveau sont surlignés pendant la saisie.
- Annuler/rétablir sur toute la fiche.
- Interrupteur **Corrigé** : bascule entre version apprenant·e et version formateur·trice (script d'écoute inclus).

### 7.4 États vides et erreurs

- Aucune fiche : proposer 3 modèles de départ (une unité phonique, une fiche de mots-images, un texte à trous).
- Banque trop petite pour la demande : message qui explique et propose la correction (réduire le nombre d'items, élargir le thème).
- Image manquante pour un mot : la fiche affiche un cadre à dessiner plutôt qu'une image incorrecte, avec un avertissement.
- Import invalide : message précis (« champ `blocks[2].kind` inconnu »).

---

## 8. Impression : spécifications

### 8.1 Règles

- A4 portrait par défaut, paysage possible.
- `@page { size: A4; margin: 0 }` ; marge gérée par le padding de la `.sheet` (**≥ 12 mm** de zone de sécurité).
- Habillage de l'application masqué (`print:hidden`).
- `print-color-adjust: exact` pour conserver aplats, pictogrammes et images.
- Un exercice ne se coupe pas entre deux pages (`break-inside: avoid`).
- Le corrigé commence toujours sur une nouvelle page.

### 8.2 Spécifique à l'écriture manuscrite

- **Lignage** au choix : aucun, lignes simples, quadrillage 5 mm, réglure scolaire (à valider selon les usages du terrain). Dessiné en CSS (`repeating-linear-gradient`) ou SVG, net à l'impression.
- Hauteur des lignes proportionnelle à la taille choisie ; en mode **alpha**, lignes larges (valeur de départ ≥ 12 mm, à ajuster par essais).
- Modèles à repasser en pointillé, avec espace de copie juste à côté.
- Zones de réponse suffisamment grandes ; jamais de champ de réponse plus petit que l'écriture attendue.

### 8.3 Images

- SVG en priorité ; si des bitmaps sont utilisés, ≥ 300 dpi à la taille imprimée.
- Contours nets et contrastés, lisibles en noir et blanc.

### 8.4 Modes d'encre

Couleur · niveaux de gris · économie d'encre (contours seuls).

### 8.5 Matrice de tests d'impression

À chaque changement de rendu : PDF depuis Chrome, Firefox, Safari, Edge ; comparer coupures, marges, polices, couleurs, alignement des lignes. Garder des références dans `tests/print-baselines/`. **Faire aussi un test sur une vraie imprimante de bureau**, sur papier standard, pour vérifier zones non imprimables et lisibilité.

---

## 9. Lisibilité et accessibilité

**Site (interface)**
- WCAG 2.2 niveau AA : contrastes, navigation clavier, focus visible, libellés de champs, erreurs reliées aux champs.
- Aperçu de la feuille accessible pour les lecteurs d'écran (version texte).
- `prefers-reduced-motion` et `prefers-color-scheme` respectés ; la feuille reste toujours blanche.

**Fiches (papier) pour un public en apprentissage de la lecture**
- Police lisible par défaut, taille et interligne réglables.
- Consignes courtes, **un verbe d'action par consigne**, mêmes verbes d'une fiche à l'autre.
- Pictogrammes systématiques en pré-alpha et alpha.
- Peu d'éléments par page : au moins une zone de respiration entre exercices ; pas plus d'un type de tâche par exercice.
- Exemple résolu **en premier item** de chaque exercice (option).
- Syllabation marquée ou colorée en option, avec légende.
- Ne jamais mettre de texte sur une image ou un fond coloré qui gêne la lecture.
- Éviter les métaphores, l'humour culturel et les références locales opaques dans les textes.
- Option pour les personnes dyslexiques : espacement accru et police adaptée (à valider avec des retours de formateurs·trices).

---

## 10. Qualité, tests, déploiement

### 10.1 Tests

| Niveau | Outil | Ce qu'on vérifie |
|---|---|---|
| Unitaires | Vitest | Chaque `generate` : déterminisme, bornes, corrigé cohérent |
| Propriétés | Vitest (boucle de graines) | Sur 1000 graines : pas de doublon inattendu, pas d'énoncé invalide |
| Contenus | `check-content.ts` en CI | Doublons, syllabes, images, niveaux, licences |
| Composants | Testing Library | Formulaires, édition en ligne, réordonnancement |
| Accessibilité | axe dans Playwright | Aucune violation critique sur les pages clés |
| Visuels | Playwright (`page.pdf()`, captures) | Régressions de mise en page et d'impression |
| Terrain | Séance avec des formateurs·trices et des apprenant·e·s | La fiche imprimée est comprise sans explication |

### 10.2 Performance

Première page utile < 2 s sur connexion moyenne ; découpage par route ; SVG plutôt que bitmaps ; polices auto-hébergées avec `font-display: swap` ; éditeur chargé en différé depuis la vitrine ; banque d'images chargée par thème, pas en bloc.

### 10.3 Intégration et déploiement

- Fusionner `v0/setup-react-tailwind` dans `main` par une pull request dès que le socle est validé, puis branches courtes (`feat/…`).
- CI (GitHub Actions) : installation, lint, types, tests, contrôle des contenus, build.
- Prévisualisation par pull request ; production sur `main`.
- Analytique respectueuse (par exemple Plausible), sans cookies.

---

## 11. Données, licences, confidentialité

- **Aucune donnée personnelle sur les apprenant·e·s**, à indiquer clairement. Public potentiellement vulnérable : n'introduire ni collecte, ni suivi, ni identifiant.
- **Exemples fictifs** : prénoms variés et inventés, aucune donnée réelle dans les documents du quotidien.
- **Contexte suisse** : loi fédérale sur la protection des données (nLPD, en vigueur depuis le 1er septembre 2023). Faire relire mentions légales, CGU et confidentialité avant le lancement public ; ce plan n'est pas un avis juridique.
- **Contenus** : ne réutiliser que des textes, images et listes dont la licence le permet ; provenance dans `content/SOURCES.md`.
- **Polices** : Outfit, Figtree, Andika, Atkinson Hyperlegible sont sous licence libre (OFL) ; vérifier toute police ajoutée (surtout cursive scolaire).
- **Pictogrammes et images** : dessins originaux privilégiés ; toute banque externe vérifiée (usage commercial, partage à l'identique, attribution).
- **Documents fictifs** : ne pas imiter les logos ni la mise en page exacte d'une administration.
- **Fiches produites** : préciser dans les CGU qui peut réutiliser les fiches générées.

---

## 12. Feuille de route par phases

Durées indicatives, en jours de travail effectif pour une personne ; elles varient selon l'expérience et la disponibilité.

| Phase | Contenu | Durée | Critères d'acceptation |
|---|---|---|---|
| **0 — Cadrage** | Décisions du §2 ; choisir **5 fiches modèles** à obtenir en sortie (ex. unité phonique, mots-images, tableau de syllabes, texte à trous A1, document du quotidien A2) ; nom du site | 0,5–1 j | Décisions dans `docs/decisions.md` ; 5 fiches modèles décrites sur papier |
| **1 — Fondations** | Nettoyer le socle, `@theme`, polices, ESLint/Prettier, routeur, layout, composants UI, CI, prévisualisation, **installation de `CLAUDE.md` et des skills (§15)** | 2–3 j | Build vert ; page de démonstration des composants ; déploiement automatique |
| **2 — Vitrine** | Page d'accueil selon §3.8, illustrations SVG, hero avec fiche réelle (aperçu du moteur), pied de page, mentions | 2–3 j | Lighthouse ≥ 90 (perf, accessibilité) ; responsive 360 → 1440 px ; aucun texte repris de la référence |
| **3 — Moteur de fiche** | Modèle de données, `PrintSheet`, en-tête, lignage, CSS d'impression A4, registre, **1 exercice de bout en bout : tableau de syllabes / pseudo-mots** (peu de données requises) avec corrigé | 4–6 j | Fiche imprimée en A4 sans coupure aberrante sur Chrome et Firefox ; corrigé sur page séparée |
| **4 — Contenus v1** *(en parallèle, continu)* | Lexique de 3 à 5 thèmes (import Excel→JSON), table de graphèmes, consignes types, jeu de pictogrammes, 100 à 150 images, `check-content.ts` | 8–12 j étalés | Contrôle des contenus vert en CI ; relecture humaine faite ; `SOURCES.md` complet |
| **5 — Générateurs v1** | Exercices MVP des §6.1 à 6.3 (graphisme, phonie-graphie, lexique), unité phonique | 6–9 j | Chaque générateur : tests de déterminisme et de propriétés verts ; contenu relu |
| **6 — Éditeur et UX** | Parcours en 6 étapes, aperçu en direct, édition sur la page, glisser-déposer, annuler/rétablir, garde-fou de niveau, pagination mesurée, mobile | 5–7 j | Parcours complet au clavier ; aperçu = impression sur la matrice de tests |
| **7 — Bibliothèque et export** | IndexedDB, liste/recherche/duplication, import/export JSON, lien de partage, Word simplifié, (option) PDF serveur | 4–6 j | Une fiche sauvegardée se rouvre à l'identique ; import invalide refusé avec message clair |
| **8 — Générateurs v2** | Grammaire, conjugaison, documents du quotidien, compréhension, production (§6.4 à 6.6), unités thématique et document | 8–12 j | Idem phase 5 ; garde-fou de niveau actif sur tous les textes |
| **9 — IA et audio (optionnel)** | Fonction serverless, sortie validée par le garde-fou, relecture obligatoire ; QR + audio | 4–7 j | Aucune clé côté client ; l'application fonctionne sans l'IA |
| **10 — Qualité et lancement** | Audit accessibilité, **pilote avec 3 à 5 formateurs·trices et un groupe d'apprenant·e·s**, corrections, analytique, mentions légales | 4–6 j | Chaque formateur·trice produit et imprime une fiche sans aide ; aucun bloquant restant |

**Chemin le plus court vers une première version utile : phases 0 → 1 → 3 → 4 (partielle) → 5 (partielle) → 6 (partielle).** La vitrine (phase 2) peut suivre ou avancer en parallèle.

### Définition de « terminé » pour chaque exercice

1. Formulaire de paramètres validé par le schéma.
2. `generate` pur, avec graine, testé (déterminisme et propriétés).
3. Rendu apprenant·e **et** rendu corrigé (avec script d'écoute si besoin).
4. Lisible en noir et blanc, taille et lignage réglables.
5. Pictogramme de consigne et libellé français relus, verbes cohérents.
6. Garde-fou de niveau appliqué à tous les textes affichés.
7. Ajouté au registre et visible dans le sélecteur pour les bons niveaux.
8. Test d'impression réalisé.

---

## 13. Risques

| Risque | Effet | Parade |
|---|---|---|
| Écart entre aperçu et impression | Fiches à refaire | Même DOM ; matrice de tests ; pagination mesurée ; test sur imprimante réelle |
| Erreurs linguistiques (syllabes, conjugaisons, genre) | Perte de crédibilité, apprentissage faussé | Données saisies et relues, `check-content.ts`, pas d'IA pour les tables de référence |
| Images ambiguës ou culturellement inadaptées | Incompréhension, malaise | Test « quel mot voit-on ? », style neutre, retours du terrain |
| Contenu qui dépasse le niveau | Fiches trop difficiles | Garde-fou de niveau, liste blanche explicite |
| Chantier de contenus sous-estimé | Retard | Le traiter comme une phase à part entière ; commencer par 3 à 5 thèmes |
| Périmètre qui gonfle (tous niveaux, toutes compétences) | Aucune version livrée | MVP pré-alpha → A1 ; un exercice fini avant d'en commencer un autre |
| Licences (images, polices, textes) | Problème juridique | `SOURCES.md`, dessins propres, polices OFL |
| Clé d'IA exposée | Coûts, abus | Serverless uniquement ; jamais de `VITE_*` pour un secret |
| Stockage local perdu | Perte de fiches | Export JSON mis en avant ; comptes plus tard |
| Ressemblance excessive avec la référence visuelle | Propriété intellectuelle | Palette, polices, illustrations et textes propres : on reprend l'esprit, pas les éléments |
| Traduction approximative (aide en langue d'origine) | Erreurs de sens | Relecture humaine obligatoire, périmètre limité |

---

## 14. Première semaine : actions concrètes

1. Ouvrir une pull request de `v0/setup-react-tailwind` vers `main` et activer le déploiement de prévisualisation.
2. Ajouter `@tailwindcss/vite` si absent, coller le bloc `@theme` de l'annexe B, installer les polices auto-hébergées. **Extraire `skills-projet.zip` à la racine du dépôt** (`CLAUDE.md` + `.claude/skills/`) et copier ce plan dans `docs/`.
3. Mettre en place ESLint, Prettier, `tsc --noEmit` et un workflow CI.
4. Décrire sur papier les **5 fiches modèles** (phase 0) : c'est ce qui définira précisément les premiers exercices.
5. Créer `src/features/print/PrintSheet.tsx` : feuille A4, en-tête à lignes vides, lignage, CSS d'impression.
6. Implémenter **un** exercice complet : tableau de syllabes / pseudo-mots (schéma, générateur à graine, rendu apprenant·e / corrigé, tests).
7. Préparer `content/graphemes/` (voyelles et consonnes du premier lot) et écrire le script `import-lexique.ts` sur un seul thème.
8. Imprimer la fiche en PDF sur deux navigateurs **et sur papier**, corriger marges et coupures.
9. Faire tester la fiche imprimée par un·e collègue formateur·trice et noter ses remarques dans `docs/retours.md`.

---

## 15. Skills et conventions du projet

### 15.1 Pourquoi

Le plan fixe beaucoup de règles (jetons de couleur, générateurs purs à graine, consignes courtes, contrôle de niveau, impression A4…). Sans mémoire de ces règles, chaque nouvelle tâche demande de les réexpliquer, et les écarts s'accumulent. Deux outils règlent le problème :

- **`CLAUDE.md`** (à la racine du dépôt) : le contexte **toujours chargé** : stack, commandes, principes non négociables, conventions, et quel skill utiliser pour quelle tâche.
- **Skills** : des dossiers `SKILL.md` chargés **à la demande**. Le fichier commence par un en-tête (`name`, `description`) qui indique quand l'utiliser ; le corps contient la procédure, les règles, les pièges et, au besoin, des gabarits (`assets/`), des documents de référence (`references/`) et des scripts (`scripts/`).

Résultat attendu : pour créer un contenu, on part d'un gabarit qui respecte déjà les règles, et le temps est consacré au contenu pédagogique, pas à la plomberie.

### 15.2 Installation

1. Extraire `skills-projet.zip` **à la racine du dépôt** : on obtient `CLAUDE.md`, `.claude/skills/` et `docs/`.
2. Valider par un commit : les skills de projet sont partagés avec toute personne qui clone le dépôt.
3. Claude Code charge les skills de projet depuis `.claude/skills/<nom>/SKILL.md` ; le nom du dossier devient aussi une commande (`/nouvel-exercice`).
4. Les gabarits portent le suffixe `.tpl` pour ne pas être compilés ni analysés par le lint ; on les copie et on retire le suffixe.

Le format `SKILL.md` suit un standard ouvert (« Agent Skills »). Si le travail continue dans un outil qui ne lit pas `.claude/skills/` (par exemple l'éditeur v0 qui a créé la branche de départ), coller le contenu du `SKILL.md` concerné dans la demande, ou le joindre comme fichier ; vérifier la prise en charge dans l'outil utilisé.

### 15.3 Catalogue des skills fournis

| Skill | Se déclenche quand… | Ce qu'il apporte | Gabarits et outils inclus |
|---|---|---|---|
| `nouvel-exercice` | on ajoute un type d'exercice ou un générateur | Cadrage en 5 points, contrat du générateur (pur, graine, sans doublon, avertissements), contrat du rendu, pièges, « terminé quand » | `definition.ts`, `Render.tsx`, `definition.test.ts` |
| `nouvelle-unite` | on veut une série de fiches, un cahier, une progression | Modèle `UnitTemplate`, graine dérivée par étape, budget de pages, principes de progression | Séquence de l'unité phonique (12 à 14 étapes) |
| `nouveau-composant-ui` | on crée ou modifie un composant d'interface | Jetons du thème, focus, clavier, cible ≥ 44 px, états, pièges | `Component.tsx`, `Component.test.tsx` (avec axe) |
| `illustration-svg` | on dessine un pictogramme, une illustration, un motif | Règles de style (plat, contour, pastels), jeu de 16 pictogrammes de consigne, accessibilité, test à 24 px et en gris | `Pictogram.tsx` |
| `section-vitrine` | on construit ou modifie la page d'accueil | Rythme de bandes, colonnes 5/6, typographie, interdits (cartes, animations partout, textes de la référence) | `Band` et `Row` |
| `texte-interface` | on écrit ou relit une chaîne affichée | Vouvoiement, casse de phrase, inclusif, vocabulaire du projet, forme des erreurs | Exemples de messages |
| `contenu-linguistique` | on parle de lexique, syllabes, graphèmes, consignes, images, import Excel | Où va quoi, règles de fond, licences, images (test « quel mot voit-on ? »), documents fictifs | Import Excel → JSON validé, références de schéma |
| `relecture-linguistique` | on relit ou valide une fiche, des consignes, un lexique | Huit contrôles (niveau, consignes, personne, exemples, images, exactitude, lisibilité, corrigé) et rapport en tableau par gravité | Gabarit de rapport |
| `test-impression` | le rendu de la feuille change, ou on parle de PDF, marges, coupures | Procédure, script Playwright, checklist manuelle et test sur imprimante réelle | `print-check.ts` (pages, débordements, exercices coupés, polices) |
| `preparer-pull-request` | on prépare une PR (lancé à la main : `disable-model-invocation`) | Cinq commandes de vérification, recherche de secrets, d'aléatoire non contrôlé, de couleurs en dur et de textes copiés, description type | Gabarit de description de PR |

### 15.4 Arborescence livrée

```
CLAUDE.md
docs/
  plan-implementation-fiches-fle-allophones.md
.claude/skills/
  nouvel-exercice/          SKILL.md · assets/ (3 gabarits)
  nouvelle-unite/           SKILL.md · references/unite-phonique.md
  nouveau-composant-ui/     SKILL.md · assets/ (2 gabarits)
  illustration-svg/         SKILL.md · assets/Pictogram.tsx.tpl
  section-vitrine/          SKILL.md · assets/Section.tsx.tpl
  texte-interface/          SKILL.md
  contenu-linguistique/     SKILL.md · references/ (3) · scripts/import-lexique.ts.tpl
  relecture-linguistique/   SKILL.md
  test-impression/          SKILL.md · scripts/print-check.ts.tpl
  preparer-pull-request/    SKILL.md
```

### 15.5 Modules dont les gabarits dépendent

Les gabarits supposent l'existence de quelques modules du plan. Le code réel fait toujours foi : en cas d'écart, le skill demande d'adapter le gabarit au code plutôt que l'inverse.

| Module attendu | Créé en phase |
|---|---|
| `src/lib/rng.ts` (`mulberry32`, `shuffle`, `randInt`) | 3 |
| `src/features/exercises/types.ts` et `registry.ts` | 3 |
| `src/features/print/` (`PrintSheet`, `Consigne`, `useConsigne`) | 3 |
| `src/test/fixtures.ts` (`makeTestContext`) | 3 |
| `src/lib/level-check.ts` | 4 |
| `src/components/pictograms/` et son registre | 2 à 4 |
| Scripts `check:content`, `typecheck` dans `package.json` | 1 et 4 |
| Page de démonstration `/dev/composants` | 1 |

### 15.6 Faire vivre les skills

- **Règle des deux corrections** : si la même erreur est corrigée deux fois, on l'ajoute au skill concerné (piège, règle ou ligne de checklist).
- **Gabarits alignés sur le code** : quand `ExerciseDefinition`, `PrintSheet` ou le thème changent, mettre à jour les gabarits `.tpl` dans le même commit.
- **Revue à chaque fin de phase** : supprimer ce qui est obsolète, ajouter ce qui a servi trois fois.
- **Descriptions volontairement « insistantes »** : le déclenchement d'un skill repose sur sa description ; il faut y lister les mots et situations qui doivent l'activer (déjà fait dans les skills fournis). Si un skill ne se déclenche pas quand il le devrait, enrichir sa description.
- **Corps court** : viser moins de 500 lignes par `SKILL.md` ; au-delà, déplacer le détail dans `references/`.
- **Test rapide d'un skill** : lui soumettre 2 ou 3 demandes réalistes et vérifier que la procédure est suivie (voir le tableau ci-dessous). Le skill `skill-creator` d'Anthropic peut aider à en écrire et à en tester de nouveaux.
- **Un skill ne remplace pas la relecture humaine** : les skills réduisent les oublis, pas la responsabilité du contenu.

Demandes de test suggérées :

| Skill | Demande réaliste |
|---|---|
| `nouvel-exercice` | « Ajoute un exercice pour remettre les mots d'une phrase dans l'ordre, niveau A1. » |
| `nouvelle-unite` | « Crée l'unité phonique pour le son [a], niveau alpha. » |
| `nouveau-composant-ui` | « Crée un composant de choix du niveau avec deux listes : littératie et CECRL. » |
| `illustration-svg` | « Dessine le pictogramme de consigne "découper". » |
| `section-vitrine` | « Ajoute la rangée sur l'impression et la bibliothèque, image à gauche. » |
| `texte-interface` | « Rédige les messages d'erreur d'import d'une fiche. » |
| `contenu-linguistique` | « Importe ce fichier Excel de vocabulaire, une feuille par thème. » |
| `relecture-linguistique` | « Relis cette fiche A1 sur le thème du logement. » |
| `test-impression` | « Vérifie que cette fiche de deux pages s'imprime bien. » |
| `preparer-pull-request` | « /preparer-pull-request » |

### 15.7 Skills à créer plus tard

À écrire au début de la phase concernée, quand les besoins réels sont connus (avec le skill `skill-creator`) :

| Skill à venir | Phase | Sujet |
|---|---|---|
| `export-word` | 7 | Conversion des blocs en `.docx` simplifié, limites connues |
| `migration-schema` | dès le premier changement de `schemaVersion` | Écrire une migration, tester l'ouverture d'anciennes fiches |
| `fonction-ia-serverless` | 9 | Fonction côté serveur, sortie JSON validée, contrôle de niveau, limites de débit |
| `audio-qr` | 9 | Fichier audio, QR imprimé, script pour le/la formateur·trice |
| `aide-langue-origine` | après le MVP | Consignes et glossaire traduits, écritures de droite à gauche, relecture humaine |
| `mode-alpha` | 5 à 6 | Réglages d'écriture (bâton, cursive, lignage, modèles en pointillé) |

---

## Annexe A — Textes originaux proposés pour la page d'accueil

Ton : vouvoiement, phrases courtes, verbes d'action, écriture inclusive avec point médian, aucun jargon.

**En-tête** : lien « Exemples » · bouton « Créer une fiche »

**Hero**
- Titre : « Des fiches de français prêtes à imprimer, du pré-alpha au B2. »
- Sous-titre : « Choisissez le niveau et le thème, ajustez les exercices, puis imprimez la fiche avec son corrigé. »
- Boutons : « Créer une fiche » · « Voir des exemples »

**Bande d'introduction**
- Intitulé : « Comment ça marche »
- Titre : « Du niveau de votre groupe à la feuille A4, sans mise en page. »
- Texte : « Vous indiquez le niveau de lecture et ce que vos apprenant·e·s doivent savoir faire. Le site compose les exercices avec des images et des consignes simples, prépare le corrigé et met la page en forme. »

**Rangée 1 — Réglages**
- Titre : « Réglez la fiche selon le niveau. »
- Texte : « Niveau de lecture, thème, taille des caractères, écriture bâton ou cursive, lignage : chaque réglage se voit tout de suite sur la page. »

**Rangée 2 — Images et consignes**
- Titre : « Des images et des consignes claires. »
- Texte : « Chaque consigne est courte et accompagnée d'un pictogramme. Les mots sont choisis dans le vocabulaire du niveau, et le site vous signale ceux qui le dépassent. »

**Rangée 3 — Modification directe**
- Titre : « Modifiez directement sur la feuille. »
- Texte : « Changez une consigne, remplacez un mot, régénérez un seul exercice. Le reste de la fiche ne bouge pas. »

**Rangée 4 — Impression et bibliothèque**
- Titre : « Imprimez, puis retrouvez vos fiches. »
- Texte : « Fiche pour les apprenant·e·s, corrigé pour vous, marges adaptées à l'imprimante. Vos fiches restent dans votre navigateur : dupliquez-les, envoyez-les par lien. »

**Bande finale**
- Titre : « Votre prochaine fiche est à quelques réglages. »
- Bouton : « Créer une fiche »

**Pied de page** : « © 2026 [Nom] · Contact · Mentions légales · Confidentialité »

**Messages d'interface de base**
- Impression : « Imprimer » · sous-menu : « Fiche apprenant·e », « Corrigé », « Les deux »
- Sauvegarde : « Fiche enregistrée »
- État vide : « Aucune fiche pour l'instant. Partez d'un modèle ou créez-en une. »
- Garde-fou : « 3 mots dépassent le niveau A1. » · action « Voir les mots » · action secondaire « Les garder pour cette fiche »
- Image manquante : « Aucune image pour ce mot. Un cadre à dessiner a été ajouté. »

---

## Annexe B — Extraits de code de départ

### B.1 `vite.config.ts`

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

### B.2 `src/styles/index.css` (thème Tailwind v4)

```css
@import "tailwindcss";
@import "@fontsource-variable/outfit";
@import "@fontsource-variable/figtree";
@import "@fontsource/andika/400.css";
@import "@fontsource/andika/700.css";

@theme {
  --font-display: "Outfit Variable", ui-sans-serif, system-ui, sans-serif;
  --font-sans: "Figtree Variable", ui-sans-serif, system-ui, sans-serif;
  --font-sheet: "Andika", "Atkinson Hyperlegible", ui-sans-serif, sans-serif;

  --color-ink: #2b2f3a;
  --color-ink-soft: #4a5060;
  --color-line: #e3e7ee;
  --color-band: #f4f7fb;
  --color-stroke: #3f4451;

  --color-brand-500: #2d7fe6;
  --color-brand-700: #1a67d2;
  --color-go-400: #5bc236;
  --color-go-700: #2a8417;

  --color-tint-violet: #f1ddfb;
  --color-tint-rose: #fbd5e0;
  --color-tint-orange: #fce3c8;
  --color-tint-green: #d9f5cc;

  --radius-control: 0.375rem;
  --radius-preview: 1rem;
  --shadow-paper: 0 10px 30px rgb(43 47 58 / 0.12);
}

html {
  font-family: var(--font-sans);
  color: var(--color-ink);
}

body {
  background: #fff;
  line-height: 1.75;
}

h1, h2, h3 {
  font-family: var(--font-display);
  color: var(--color-ink);
}
```

### B.3 `src/styles/print.css`

```css
@page {
  size: A4 portrait;
  margin: 0;
}

.sheet {
  width: 210mm;
  min-height: 297mm;
  padding: 14mm 15mm;
  background: #fff;
  font-family: var(--font-sheet);
  /* tailles pilotées par la densité de la fiche */
  --sheet-font: 12pt;
  --write-line: 9mm;
}

.sheet[data-density="large"]  { --sheet-font: 14pt; --write-line: 10mm; }
.sheet[data-density="xlarge"] { --sheet-font: 16pt; --write-line: 11mm; }
.sheet[data-density="alpha"]  { --sheet-font: 20pt; --write-line: 13mm; }

.sheet { font-size: var(--sheet-font); }

/* lignage : lignes simples */
.ruled-lines {
  min-height: var(--write-line);
  background-image: repeating-linear-gradient(
    to bottom,
    transparent 0,
    transparent calc(var(--write-line) - 1px),
    #3f4451 calc(var(--write-line) - 1px),
    #3f4451 var(--write-line)
  );
}

.exercise {
  break-inside: avoid;
}

.sheet + .sheet {
  break-before: page;
}

@media print {
  html, body {
    background: #fff;
  }

  .sheet {
    margin: 0;
    box-shadow: none;
  }

  * {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
```

À l'écran, la classe `shadow-paper` s'applique à la feuille ; dans l'application, envelopper l'habillage (en-tête, panneaux) avec `print:hidden`.

### B.4 Générateur à graine (`src/lib/rng.ts`)

```ts
export type Rng = () => number;

export function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const randInt = (rng: Rng, min: number, max: number) =>
  Math.floor(rng() * (max - min + 1)) + min;

export function shuffle<T>(rng: Rng, input: readonly T[]): T[] {
  const a = [...input];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
```

### B.5 Premier exercice : tableau de syllabes

```ts
// src/features/exercises/syllable-table/definition.ts
import { z } from "zod";
import { shuffle, type Rng } from "@/lib/rng";

export const paramsSchema = z.object({
  consonants: z.array(z.string().min(1)).min(1),
  vowels: z.array(z.string().min(1)).min(1),
  mode: z.enum(["cv", "vc"]).default("cv"),
  rows: z.number().int().min(2).max(10),
  cols: z.number().int().min(2).max(6),
});
export type Params = z.infer<typeof paramsSchema>;

export function generate(params: Params, rng: Rng) {
  const { consonants, vowels, mode, rows, cols } = params;
  const needed = rows * cols;

  const pool = consonants.flatMap((c) =>
    vowels.map((v) => (mode === "cv" ? c + v : v + c))
  );

  const warnings: string[] = [];
  if (pool.length < needed) {
    warnings.push(
      `Seulement ${pool.length} syllabes possibles pour ${needed} cases : certaines se répètent.`
    );
  }

  // Tirage sans doublon tant que la réserve le permet, puis complétion.
  const picked: string[] = shuffle(rng, pool).slice(0, needed);
  while (picked.length < needed) {
    picked.push(pool[Math.floor(rng() * pool.length)]);
  }

  const grid = Array.from({ length: rows }, (_, r) =>
    picked.slice(r * cols, (r + 1) * cols)
  );

  // Pas de « réponse » à corriger : le corrigé sert de liste de lecture au formateur.
  return { items: grid, answers: grid, warnings };
}
```

### B.6 Tests

```ts
import { describe, expect, it } from "vitest";
import { mulberry32 } from "@/lib/rng";
import { generate } from "./definition";

const params = {
  consonants: ["m", "l", "r", "t"],
  vowels: ["a", "i", "o", "u"],
  mode: "cv",
  rows: 4,
  cols: 4,
} as const;

describe("tableau de syllabes", () => {
  it("donne le même résultat avec la même graine", () => {
    expect(generate(params, mulberry32(7))).toEqual(generate(params, mulberry32(7)));
  });

  it("n'a aucun doublon quand la réserve est suffisante", () => {
    for (let seed = 0; seed < 1000; seed++) {
      const flat = generate(params, mulberry32(seed)).items.flat();
      expect(new Set(flat).size).toBe(flat.length);
    }
  });

  it("signale une réserve trop petite", () => {
    const small = { ...params, consonants: ["m"], vowels: ["a", "i"], rows: 3, cols: 3 };
    expect(generate(small, mulberry32(1)).warnings?.length).toBeGreaterThan(0);
  });
});
```

### B.7 Garde-fou de niveau (`src/lib/level-check.ts`)

```ts
export type Level = "A1.1" | "A1" | "A2" | "B1" | "B2";
const ORDER: Level[] = ["A1.1", "A1", "A2", "B1", "B2"];

export type Lexeme = { lemma: string; forms: string[]; level: Level };

/** Construit un index « forme → niveau » à partir du lexique. */
export function buildIndex(lexicon: Lexeme[]): Map<string, Level> {
  const index = new Map<string, Level>();
  for (const lx of lexicon) {
    for (const form of [lx.lemma, ...lx.forms]) {
      const key = form.toLowerCase();
      const known = index.get(key);
      // en cas de doublon, on garde le niveau le plus bas
      if (!known || ORDER.indexOf(lx.level) < ORDER.indexOf(known)) {
        index.set(key, lx.level);
      }
    }
  }
  return index;
}

/** Renvoie les mots du texte qui dépassent le niveau visé ou sont inconnus. */
export function wordsAboveLevel(
  text: string,
  target: Level,
  index: Map<string, Level>,
  allowlist: ReadonlySet<string> = new Set()
): { word: string; reason: "above" | "unknown" }[] {
  const tokens = text
    .toLowerCase()
    .replace(/[’']/g, " ")
    .split(/[^\p{L}-]+/u)
    .filter(Boolean);

  const flagged: { word: string; reason: "above" | "unknown" }[] = [];
  for (const word of new Set(tokens)) {
    if (allowlist.has(word)) continue;
    const level = index.get(word);
    if (!level) flagged.push({ word, reason: "unknown" });
    else if (ORDER.indexOf(level) > ORDER.indexOf(target))
      flagged.push({ word, reason: "above" });
  }
  return flagged;
}
```

Limites connues : les mots grammaticaux très courants (articles, pronoms, prépositions) doivent figurer dans le lexique de base ; les noms propres et les prénoms fictifs sont à placer dans la liste blanche par défaut.
