---
name: phrase-gattegno
description: >-
  Modèles de phrases Gattegno (un verbe = un modèle), banques de sujets
  (prénoms, déterminant+nom, pronoms), conjugaison, règles du verbe être,
  sens réel en français. À utiliser dès qu’on parle de phrase simple, négation,
  adjectif, préposition, adverbe, déterminants, conjonctions, colorier /
  remettre en ordre / construire une phrase, ou de fiche de grammaire en couleur.
---

# Phrases Gattegno — modèles uniques

Une fiche de phrases n’est **pas** un produit cartésien (Léa / elle / le papa + le même verbe).  
**Un modèle = un verbe / une construction.** Le sujet et le complément varient à l’instanciation ; le verbe ne se répète pas sur la même fiche.

## Fichiers

| Fichier | Rôle |
|---|---|
| `src/francais/phrase-simple-frames.ts` | Modèles phrase simple / négation simple (≥100 `-er`, pas d’« être ») |
| `src/francais/phrase-theme-frames.ts` | Modèles adjectif, préposition, adverbe, conjonctions |
| `src/francais/phrase-sentences.ts` | Sujets (prénoms, GN, pronoms), `framesForTheme`, `instantiateThemeFrame` |
| `src/francais/phrase-conjugate.ts` | Conjugaison du verbe selon le sujet (pronoms) |
| `src/francais/phrase.ts` | Tirage équilibré des sujets (`used` = `frame:${id}`) pour **tous** les thèmes |
| `src/francais/phrase-banks.ts` | Verbes (formes), **15 consignes** d’écriture libre par thème |

## Tous les thèmes passent par les modèles

`pickPhrase` et `typeBuild` appellent `framesForTheme` + `instantiateThemeFrame` pour :

- phrase simple / négation simple
- adjectif / négation + adjectif
- préposition / négation + préposition
- adverbe / négation + adverbe
- déterminants / négation + déterminants
- conjonctions

Ne plus assembler `PEOPLE × prédicats`. Un id de verbe déjà tiré (`frame:${id}`) est exclu du tirage suivant.

**Colorier, remettre en ordre et écrire selon les pastilles partagent le même bassin de verbes** et le **même tirage de sujets**. `framesForTheme` filtre les modèles qui ne collent pas aux pastilles du thème. Un verbe proposé en « construire » peut apparaître en « colorier », et inversement.

## Sujets : trois familles (tirage équilibré)

Après la restructuration par modèles, les prénoms ne doivent plus noyer le tirage. À l’instanciation, `pickBalancedSubject` choisit d’abord une famille (~⅓ chacune), puis un sujet dans cette famille :

| Famille | Exemples | Notes |
|---|---|---|
| **Prénom** | Léa, Noah… (`PROPER`) | Toujours 3e personne du singulier |
| **Groupe nominal** | *le garçon*, *la voisine*, *un ami* (`COMMON`) | Déterminant + nom commun personne |
| **Pronom** | *je, tu, il, elle, nous, vous, ils, elles, on* (`PRONOUN_SUBJECTS`) | Verbe conjugué via `phrase-conjugate.ts` |

Exceptions :

- Thèmes **déterminants** : sujets = `DET_SUBJECTS` (variété de déterminants), pas de pronom.
- Thèmes **adjectif** en placement « sujet » / « les deux » : sujets = `ADJ_SUBJECTS` (déterminant + adjectif + nom).

Le modèle garde la forme 3e sg dans les prédicats ; `instantiateThemeFrame` conjugue si le sujet est un pronom (*Je mange…*, *Nous mangeons…*, *J’aime…*).

## Verbes à préposition

*Habiter*, *aller*, *rester chez*… exigent une préposition (*j’habite à Sion*, *j’habite dans un appartement*). Ils n’apparaissent **jamais** en phrase simple, négation simple, déterminants, adjectif, adverbe ou conjonctions : les pastilles n’ont pas de préposition, l’élève écrirait *habite une maison*.

Ils restent dans les thèmes **préposition** / **négation + préposition**. `frameMatchesTheme` refuse tout modèle dont un complément contient `/preposition` hors de ces thèmes.

## Conjonctions : une seule majuscule

Dans colorier et remettre en ordre, seule la première lettre de la phrase est une majuscule (hors noms propres). Le second sujet est un nom commun personne (*le garçon*, *la sœur*), jamais un prénom : *Léa mange une pomme et le cousin lit un journal.* — pas *et Mila*. Le premier sujet peut être un pronom (*Je mange une pomme et le cousin lit un journal.*).

## Noms propres

Les prénoms (`PROPER` / `PROPER_NAMES` dans `phrase-proper-names.ts`) gardent leur majuscule partout, y compris dans les pastilles « remettre en ordre » (on ne les force pas en minuscules).

Banque : **~15 prénoms par nationalité** (alignée sur le vocabulaire Présenter + japonais), mixte m/f pour l’accord.

## Sens réel

- **Sujet = personne** : prénoms, rôles (papa, élève, voisine…) ou pronoms (*je… elles*, *on*). Jamais *la maison*, *la voiture*, *le livre* comme sujet.
- **Complément qui va avec le verbe** : *Léa voit une voiture* oui ; *la maison voit une voiture* non ; *habite* exige *dans*.
- **Contractions** : *au maître*, *du film*, *près du parc* — jamais *à le* / *de le*.
- **Accord** : *être* + adjectif suit le genre du sujet (*Léa est grande*, *Noah est grand*).
- **Thèmes adjectif** : trois placements — adjectif dans le complément (*Léa mange une pomme rouge*), dans le sujet (*Le petit garçon mange une pomme*), ou les deux (*La petite fille mange une pomme rouge*). Pour *être*, le mode « sujet seul » devient « les deux » (*La petite fille est contente*).

`assertBank` refuse : sujet inanimé, « être » en phrase simple / négation simple, adjectif ou préposition manquant, *habite* sans *dans*, préposition hors thème préposition, deuxième majuscule dans une phrase à conjonction.

## Verbe être

| Thème | « être » |
|---|---|
| Phrase simple, négation simple | **Interdit** (il faut un adjectif ou une préposition) |
| Adjectif / négation + adjectif | Autorisé, formes accordées |
| Préposition / négation + préposition | Autorisé : *est à / dans / chez* |
| Autres thèmes | Pas de modèle *être* dédié |

## Production écrite

`PRODUCTION_PROMPTS_BY_THEME` : **exactement 15 consignes distinctes par thème** (contrôle à l’import). Une fiche « écrire » tire une consigne de ce bassin.

## Ajouter un modèle

1. Nouveau verbe = nouvelle entrée `frame('infinitif', [complément1, complément2, …])` (au moins 2 compléments réels).
2. Présent 3e personne **réel** dans le prédicat (pas *parte*, *sorte*, *s’asseoit*) ; les autres personnes viennent de `phrase-conjugate.ts` / `VERBES`.
3. Si le verbe est irrégulier, ajouter ses formes dans `VERBES` (`phrase-banks.ts`).
4. Recopier le verbe dans le fichier thématique si le thème l’exige (adjectif accordé, préposition naturelle).
5. Pas de second id pour le même verbe (`aller2`, `mettre2`).
6. Contrôler avec `npm run lint` puis `npm run build` (les asserts s’exécutent à l’import).

## Terminé quand

Chaque thème a des verbes uniques sur une fiche ; les sujets mélangent prénoms, GN et pronoms ; les phrases se disent vraiment en français ; « être » suit le tableau ci-dessus ; 15 consignes distinctes par thème en production écrite ; le skill et `CLAUDE.md` restent alignés.
