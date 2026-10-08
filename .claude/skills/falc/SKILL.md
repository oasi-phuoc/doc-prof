---
name: falc
description: >-
  Cadre FALC (Facile à Lire et à Comprendre) : principes, règles de rédaction
  et de mise en page, frontières avec comprehension-ecrite. À utiliser pour
  la théorie FALC, la rédaction accessible, ou l’alignement de contenus
  ClairFLE sur ce cadre — pas pour les banques Com CECRL (voir
  comprehension-ecrite).
---

# Cadre FALC (Facile à Lire et à Comprendre)

Skill **cadre** : définit l’esprit et les règles utiles à ClairFLE.  
Ce n’est **pas** une certification, ni une copie d’un référentiel externe.  
Les règles ci-dessous reprennent des **pratiques courantes** de rédaction accessible, formulées de façon pédagogique pour l’équipe.

> **Théorie à enrichir** — Phuoc Van (et l’équipe) peuvent compléter les sections marquées « À compléter » sans réécrire le cadre.

## Quand utiliser ce skill

Utiliser `falc` dès qu’on :

- définit, approfondit ou aligne la **théorie FALC** du projet ;
- rédige ou relit un texte pour le rendre **plus accessible** (consignes, notices, contenus élèves, aides) ;
- décide d’une **mise en page** lisible (phrases courtes, aération, ordre des infos) ;
- clarifie ce qui est **FALC au sens large** vs ce qui est **spécifique FLE / CECRL**.

**Ne pas** utiliser `falc` à la place de :

| Besoin | Skill |
|---|---|
| Textes / questions Com · compréhension écrite A1–A2–B1, banques, fourchettes de mots | `comprehension-ecrite` |
| Libellés UI enseignant·e | `texte-interface` |
| Relire un énoncé maths (vouvoiement, clarté scolaire) | `relecture-enonce` |
| Push sur `main` | `preparer-pull-request` |

### Frontière avec `comprehension-ecrite`

| | `falc` (ce skill) | `comprehension-ecrite` |
|---|---|---|
| Objet | Cadre **général** de clarté / accessibilité | Règles **opérationnelles** des textes Com FLE |
| Public cible du contenu | Toute personne qui lit avec difficulté ; application ClairFLE large | Apprenant·e·s FLE A1 / A2 / B1 |
| Niveaux | Niveaux d’**application** FALC (ci-dessous) | Niveaux **CECRL** (`facile`→A1, etc.) |
| Banques / code | Pas de banque ici | `comprehension-ecrite.ts` + banques |

En pratique :

- Pour **créer / corriger un texte Com**, suivre d’abord `comprehension-ecrite` (longueur, structures, questions).
- Pour **expliquer pourquoi** une formulation est plus claire, ou pour **tout contenu hors Com** (consignes, notices, soutiens, textes accessibles), s’appuyer sur `falc`.
- Les deux sont **compatibles** : `comprehension-ecrite` cite déjà l’esprit FALC (« info essentielle d’abord ») ; ce skill porte le **cadre**, sans dupliquer les tableaux CECRL.

---

## 1. Qu’est-ce que le FALC (cadre projet)

**FALC** = **Facile à Lire et à Comprendre**.

Objectif ClairFLE : produire des écrits (et des mises en page) que le plus grand nombre peut **lire**, **comprendre** et **utiliser** sans effort inutile — y compris des personnes en situation de handicap intellectuel, des lecteurs peu habitués, des débutant·e·s en français, ou des élèves en difficulté de lecture.

Principes directeurs (esprit, non exhaustif) :

1. **Une idée à la fois** — une phrase = une information principale.
2. **L’essentiel d’abord** — qui, quoi, quand, où, puis le détail.
3. **Mots connus** — préférer le vocabulaire courant ; expliquer un mot difficile s’il est indispensable.
4. **Phrases courtes et directes** — ordre sujet–verbe–complément quand c’est possible.
5. **Cohérence** — même mot pour la même chose (éviter les synonymes qui embrouillent).
6. **Mise en page qui aide** — aération, titres clairs, listes si utile, contraste lisible.
7. **Respect** — ton digne ; pas de langage infantilisant ni de simplification qui déforme le sens.

### À compléter — Théorie / définition élargie

<!-- Emplacement pour la théorie officielle ou interne que Phuoc Van ajoutera. -->

- [ ] Historique et enjeux du FALC (projet / institution)
- [ ] Publics concernés (détail)
- [ ] Lien éventuel avec d’autres cadres d’accessibilité (sans citation verbatim externe)
- [ ] Vocabulaire métier ClairFLE lié au FALC

*(Remplacer cette liste par le contenu théorique validé.)*

---

## 2. Règles de rédaction (cadre)

### Faire

- Phrases **courtes** ; une idée principale par phrase.
- Ordre **clair** : information importante en premier.
- Mots **simples** et **concrets** ; répéter le même terme pour la même chose.
- Verbes à la **voix active** quand c’est naturel.
- Temps et formes **habituels** (présent, passé composé basique, etc.) selon le public.
- Exemples **concrets** si une notion est abstraite.
- Listes à puces pour des étapes ou des choix.
- Expliquer ou illustrer un mot rare **juste après** sa première apparition, si on ne peut pas l’éviter.

### Ne pas faire

- Phrases à **plusieurs subordonnées** empilées.
- **Métaphores**, ironie, jeux de mots, doubles sens.
- **Jargon** non expliqué, sigles non développés.
- **Synonymes** successifs pour la même chose (« l’élève / l’apprenant / le jeune »).
- Formulations **négatives doubles** ou ambigües (« ne… que », litotes).
- Blocs de texte **denses** sans respiration.
- Présenter une simplification comme une **certification FALC** ou une norme officielle du projet (sauf si validé ailleurs).

### Checklist rédaction rapide

- [ ] Une idée par phrase ?
- [ ] Info essentielle en premier ?
- [ ] Même mot pour la même chose ?
- [ ] Pas de métaphore / jargon opaque ?
- [ ] Sens conservé (pas de simplification trompeuse) ?

### À compléter — Théorie / lexique & grammaire

<!-- Emplacement pour listes de mots à préférer / éviter, exemples contrastés, etc. -->

- [ ] Tableau « préférer / éviter » (exemples ClairFLE)
- [ ] Règles de négation, de questions, de consignes
- [ ] Cas particuliers (nombres, dates, consignes maths / FLE)

*(À compléter.)*

---

## 3. Mise en page et présentation

Objectifs : **aider le regard**, **séparer les idées**, **ne pas surcharger**.

### Faire

- Titres et sous-titres **explicites**.
- Paragraphes **courts** ; une idée par paragraphe quand c’est pertinent.
- **Aération** : espaces entre blocs ; éviter les murs de texte.
- Listes pour les étapes, les règles, les options.
- Police et taille **lisibles** sur fiche A4 (contraste fort, surtout N&B).
- Images / pictogrammes **utiles** (clarifient le sens) — la couleur ne porte jamais seule l’info (principe ClairFLE).
- Alignement et numérotation **stables** (exercices 1, 2… ; consignes sous le titre).

### Ne pas faire

- Fond chargé, motifs qui gênent la lecture.
- Trop de styles (gras + italique + souligné partout).
- Encadrer chaque phrase « pour faire joli » si ça ne structure pas.
- Couper une phrase ou une étape entre deux pages sans nécessité.
- Compacter le contenu pour « caser » plus d’items au détriment de la lisibilité (feuille A4 fixe : voir aussi `test-impression`).

### À compléter — Théorie / mise en page ClairFLE

<!-- Emplacement pour gabarits, exemples de fiches, règles typographiques projet. -->

- [ ] Gabarits FALC (consigne, notice, aide élève…)
- [ ] Règles typo / CSS projet (`App.css`) à respecter en mode accessible
- [ ] Exemples avant / après (captures ou fragments)

*(À compléter.)*

---

## 4. Niveaux d’application (indicatif)

Le FALC n’est **pas** un barème CECRL. Pour ClairFLE, on peut distinguer des **degrés d’application** selon le support :

| Degré | Usage typique | Intensité des règles |
|---|---|---|
| **A — Strict** | Notices, aides, consignes pour public en grande difficulté de lecture | Phrases très courtes, vocabulaire minimal, mise en page très aérée |
| **B — Standard** | Contenu pédagogique accessible « par défaut » | Règles des sections 2–3 ; une idée / phrase ; mots courants |
| **C — Adapté FLE** | Textes Com / supports FLE (A1–B1) | Suivre **`comprehension-ecrite`** pour longueur & structures ; garder l’esprit FALC (clarté, info d’abord) |

Choisir le degré **selon le public et le type de fiche**, pas selon un score inventé.

### À compléter — Théorie / niveaux & validation

- [ ] Critères de passage A → B → C (équipes, validation humaine)
- [ ] Exemples détaillés par degré
- [ ] Lien éventuel avec mode évaluation / points (si pertinent)

*(À compléter.)*

---

## 5. Alignement contenus ClairFLE

Quand on aligne un contenu existant sur ce cadre :

1. Identifier le **degré** (A / B / C).
2. Relire avec la checklist rédaction + mise en page.
3. Si c’est un texte **Com**, appliquer aussi `comprehension-ecrite`.
4. Si c’est une **consigne maths / FLE** générique, croiser avec `relecture-enonce` ou `texte-interface` selon le destinataire (élève vs enseignant·e).
5. Ne **pas** inventer de mentions « certifié FALC » dans l’UI ou les fiches.

### À compléter — Théorie / process projet

- [ ] Qui valide un texte « conforme cadre FALC » ?
- [ ] Où stocker les exemples validés (docs / banques)
- [ ] Roadmap contenu théorique

*(À compléter.)*

---

## 6. Sources et limites

- Pas de **citations verbatim** d’un référentiel externe dans ce skill.
- Pas de prétention à une **homologation** ou un label officiel via ClairFLE.
- En cas de doute juridique / institutionnel : documenter dans les sections « À compléter », ne pas improviser.

### À compléter — Références internes

- [ ] Liens vers docs projet (chemins relatifs une fois existants)
- [ ] Notes d’atelier / décisions d’équipe

*(À compléter.)*

---

## Terminé quand

- Cadre (principes, rédaction, mise en page, faire / ne pas faire, degrés) **lisible et utilisable**.
- Sections **À compléter** laissées nettes pour la théorie à venir.
- Frontière avec `comprehension-ecrite` **explicite**.
- Aucune certification / copie de référence externe présentée comme officielle.
