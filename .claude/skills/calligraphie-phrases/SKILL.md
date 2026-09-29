---
name: calligraphie-phrases
description: >-
  Génère et valide les phrases de calligraphie (10 par mot, A1/A2/B1) :
  authentiques, uniques, cohérentes, françaises, une ligne max. À utiliser dès
  qu’on parle de phrases calligraphie, banque Voc phrase, régénération de
  phrases cursives, ou qualité des modèles d’écriture.
---

# Phrases calligraphie

Les phrases servent de **modèle d’écriture cursive** (bande 4 lignes) et de
banque `sentences.phrase` côté Voc. Elles doivent se dire vraiment en français.

## Fichiers

| Fichier | Rôle |
|---|---|
| `scripts/regen-calligraphie-phrases.py` | Régénère `sentences.phrase` (10 × A1/A2/B1) |
| `src/francais/vocab-banks/fr-*.ts` | Banques Voc (champ `phrase` uniquement) |
| `src/calligraphie/generate.ts` | Tirage fiche : **un mot = une phrase**, sans doublon |
| `src/calligraphie/defaults.ts` | Compteurs taille, `MAX_CALLI_LINE_CHARS` |

## Règles non négociables

1. **Sens réel** : la phrase parle du référent du mot, pas du « mot » lui-même.
   - Oui : `Léa mange une pomme.` / `La pomme est sur la table.`
   - Non : `J’écoute le mot pomme.` / `Je vois pomme.` / `Pour réussir, j’utilise la pomme.`
2. **Rôles variés** : pour chaque mot, les 10 phrases mélangent
   - **sujet** (`La pomme tombe.`)
   - **complément** (`Léa mange une pomme.`)
   - **questions** (`Où est la pomme ?` / `Tu veux une pomme ?`)
3. **Pas de gabarit clone** : interdit la même ossature pour tous les mots
   (`Elle va devenir ___`, `Je pense que ___`). Construction **et** place du
   mot varient d’un index à l’autre ; rotation par id de mot.
4. **Français correct** : articles, accords, contractions (`du`, `au`, `des`).
5. **Unique** : 10 phrases distinctes par niveau ; pas de quasi-doublon.
6. **Une ligne cursive** : ≤ `MAX_CALLI_LINE_CHARS` (50) caractères, espaces compris.
7. **Niveaux** :
   - **A1 · Simple** : présent, structures courtes, questions simples.
   - **A2 · Moyen** : passé composé / futur proche / questions au passé.
   - **B1 · Avancé** : subordonnée courte encore lisible sur une ligne.
8. **Densité banque** : **10 phrases × A1 × A2 × B1** pour **chaque mot** de
   **chaque sous-thème** de **chaque thème**.
9. **Fiche** : un mot Voc = une seule entrée ; mode Libre tire dans **toutes**
   les banques ; les ajouts manuels peuvent dépasser le nombre par défaut
   (Phrases : Petit 6 / Moyen 5 / Grand 4 · Mots : plus de blocs, hauteur = 1 bande 4 lignes).

## Catégories (générateur)

- nom concret (fruit, vêtement, pièce…) — sujet / complément / questions
- adjectif (description, couleur, nationalité)
- personne / métier / parenté
- verbe d’action (cuisine…)
- expression figée (`à point`, `au bout de`…)

## Lancer la régénération

```bash
python3 scripts/regen-calligraphie-phrases.py
npm run lint && npm run build
```

Le script **ne touche pas** à `trous` ni `dictee`.

## Importer un document corrigé

Document source : `scripts/data/calligraphie-phrases-corrigees.txt`  
(format `##### FICHIER … #####` / `=== id | label | subgroup ===` / `--- A1|A2|B1 ---`).

```bash
python3 scripts/import-calligraphie-phrases.py
# optionnel — enrichir les preds Gattegno (phrase-simple) depuis les A1
python3 scripts/enrich-gattegno-from-calli.py
npm run lint && npm run build
```

L’import remplace uniquement `sentences.phrase` (pas `trous` / `dictee`).  
La calligraphie ne tire que les phrases ≤ `MAX_CALLI_LINE_CHARS` (50) ; les B1 plus longues restent disponibles pour le Voc.

## Terminé quand

- 10 × 3 niveaux par mot, ≤ 50 caractères (espaces compris), sens réel
- Sujet + complément + questions représentés
- Générer (Libre / thème) : mots distincts, ajouts possibles au-delà du défaut
- Skill et `CLAUDE.md` alignés
