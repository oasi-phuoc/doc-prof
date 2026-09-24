---
name: phrase-gattegno
description: >-
  Modèles de phrases Gattegno (un verbe = un modèle), banques de sujets
  personnes, règles du verbe être, sens réel en français. À utiliser dès qu’on
  parle de phrase simple, négation, adjectif, préposition, adverbe, déterminants,
  conjonctions, colorier / remettre en ordre / construire une phrase, ou de
  fiche de grammaire en couleur.
---

# Phrases Gattegno — modèles uniques

Une fiche de phrases n’est **pas** un produit cartésien (Léa / elle / le papa + le même verbe).  
**Un modèle = un verbe / une construction.** Le sujet et le complément varient à l’instanciation ; le verbe ne se répète pas sur la même fiche.

## Fichiers

| Fichier | Rôle |
|---|---|
| `src/math/phrase-simple-frames.ts` | Modèles phrase simple / négation simple (≥100 `-er`, pas d’« être ») |
| `src/math/phrase-theme-frames.ts` | Modèles adjectif, préposition, adverbe, conjonctions |
| `src/math/phrase-sentences.ts` | Sujets personnes, `framesForTheme`, `instantiateThemeFrame`, contrôles |
| `src/math/phrase.ts` | Tirage (`used` = `frame:${id}`) pour **tous** les thèmes |
| `src/math/phrase-banks.ts` | Verbes (formes), consignes d’écriture libre |

## Tous les thèmes passent par les modèles

`pickPhrase` et `typeBuild` appellent `framesForTheme` + `instantiateThemeFrame` pour :

- phrase simple / négation simple
- adjectif / négation + adjectif
- préposition / négation + préposition
- adverbe / négation + adverbe
- déterminants / négation + déterminants
- conjonctions

Ne plus assembler `PEOPLE × prédicats`. Un id de verbe déjà tiré (`frame:${id}`) est exclu du tirage suivant.

## Sens réel

- **Sujet = personne** : prénoms, rôles (papa, élève, voisine…) ou *Il* / *Elle*. Jamais *la maison*, *la voiture*, *le livre* comme sujet.
- **Complément qui va avec le verbe** : *Léa voit une voiture* oui ; *la maison voit une voiture* non ; *habite* exige *dans*.
- **Contractions** : *au maître*, *du film*, *près du parc* — jamais *à le* / *de le*.
- **Accord** : *être* + adjectif suit le genre du sujet (*Léa est grande*, *Noah est grand*).

`assertBank` refuse : sujet inanimé, « être » en phrase simple / négation simple, adjectif ou préposition manquant, *habite* sans *dans*.

## Verbe être

| Thème | « être » |
|---|---|
| Phrase simple, négation simple | **Interdit** (il faut un adjectif ou une préposition) |
| Adjectif / négation + adjectif | Autorisé, formes accordées |
| Préposition / négation + préposition | Autorisé : *est à / dans / chez* |
| Autres thèmes | Pas de modèle *être* dédié |

## Ajouter un modèle

1. Nouveau verbe = nouvelle entrée `frame('infinitif', [complément1, complément2, …])` (au moins 2 compléments réels).
2. Présent 3e personne **réel** (pas *parte*, *sorte*, *s’asseoit*).
3. Recopier le verbe dans le fichier thématique si le thème l’exige (adjectif accordé, préposition naturelle).
4. Pas de second id pour le même verbe (`aller2`, `mettre2`).
5. Contrôler avec `npm run lint` puis `npm run build` (les asserts s’exécutent à l’import).

## Terminé quand

Chaque thème a des verbes uniques sur une fiche ; les phrases se disent vraiment en français ; « être » suit le tableau ci-dessus ; le skill et `CLAUDE.md` restent alignés.
