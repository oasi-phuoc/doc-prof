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
6. **Une ligne cursive** : ≤ `MAX_CALLI_LINE_CHARS` (36) caractères.
7. **Niveaux** :
   - **A1 · Simple** : présent, structures courtes, questions simples.
   - **A2 · Moyen** : passé composé / futur proche / questions au passé.
   - **B1 · Avancé** : subordonnée courte encore lisible sur une ligne.
8. **Densité banque** : **10 phrases × A1 × A2 × B1** pour **chaque mot** de
   **chaque sous-thème** de **chaque thème**.
9. **Fiche** : un mot Voc = une seule entrée ; mode Libre tire dans **toutes**
   les banques ; les ajouts manuels peuvent dépasser le nombre par défaut
   (Petit 10 / Moyen 9 / Grand 8 mots).

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

## Terminé quand

- 10 × 3 niveaux par mot, ≤ 36 caractères, sens réel
- Sujet + complément + questions représentés
- Générer (Libre / thème) : mots distincts, ajouts possibles au-delà du défaut
- Skill et `CLAUDE.md` alignés
