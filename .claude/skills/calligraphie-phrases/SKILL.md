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
| `src/calligraphie/defaults.ts` | `MAX_CALLI_LINE_CHARS` (une seule ligne cursive) |

## Règles non négociables

1. **Sens réel** : la phrase parle du référent du mot, pas du « mot » lui-même.
   - Oui : `Léa porte un blouson.`
   - Non : `J’écoute le mot blouson.` / `Je vois blouson.` / `Voici âgé.`
2. **Pas de gabarit clone** : interdit d’avoir la même ossature pour tous les
   mots d’une liste (`Elle va devenir ___`, `Je pense que ___ aide à…`).
   Chaque index 0…9 doit varier la construction **et** la place du mot.
3. **Français correct** : articles, accords, contractions (`du`, `au`, `des`).
   Adjectif → s’accorde / se place naturellement ; verbe → conjugaison réelle.
4. **Unique** : les 10 phrases d’un niveau sont distinctes ; pas de quasi-doublon.
5. **Une ligne cursive** : ≤ `MAX_CALLI_LINE_CHARS` (36) caractères.
6. **Niveaux** :
   - **A1 · Simple** : présent, structures courtes.
   - **A2 · Moyen** : passé composé / futur proche / complément léger.
   - **B1 · Avancé** : subordonnée courte encore lisible sur une ligne.
7. **Une occurrence du mot-cible par fiche** : `reshuffleCalliContent` tire des
   mots distincts ; jamais deux phrases du même item Voc sur la même feuille.

## Catégories (générateur)

Le script choisit des patrons selon le sous-groupe / la nature du mot :

- nom concret (vêtement, fruit, pièce, transport…)
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

- 10 phrases × 3 niveaux par mot, toutes ≤ 36 caractères
- Aucun patron « Je vois / Voici / C’est / le mot … »
- Générer une fiche Juste phrases : mots tous différents, phrases cohérentes
- Skill et `CLAUDE.md` alignés
