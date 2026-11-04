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
| `src/francais/phrase-themes.ts` | Ordre des thèmes combinés, formes Positive / Négative / Mixte, migration des anciens ids |
| `src/francais/phrase-reflexive-frames.ts` | 61 constructions pronominales relues, dont des variantes simples |
| `src/francais/phrase-combinations.ts` | Quotas des 16 combinaisons, prédicats complets et coordinations |
| `src/francais/phrase-reflexive-supplement.ts` | Actions pronominales supplémentaires avec compléments naturels |
| `src/francais/phrase-options.ts` | Sélection des prédicats complets selon les catégories autorisées |
| `src/francais/phrase-negation.ts` | Négation, clitiques, articles et élisions |
| `src/francais/phrase-conjugate.ts` | Conjugaison du verbe selon le sujet (pronoms) |
| `src/francais/phrase.ts` | Tirage équilibré des sujets (`used` = `frame:${id}`) pour **tous** les thèmes |
| `src/francais/phrase-banks.ts` | Verbes (formes), **15 consignes** d’écriture libre par thème |

## Thèmes combinés et formes

Le menu affiche Simple, Déterminants, Verbes pronominaux, Adjectif, Préposition, Adverbe et Conjonctions. Chaque thème a quatre formats et un réglage **Positive / Négative / Mixte**. Les anciens ids `phrase-negation-*` restent lisibles pour les recettes sauvegardées, mais ne constituent plus des thèmes du menu. Leur migration conserve la forme négative.

`phrasePolarity` appartient à l’exercice. Mixte équilibre les deux formes dès deux phrases. Les quatre formats doivent tirer les mêmes phrases avant toute opération de mélange des mots. Ne pas tirer à nouveau une phrase pour « construire » ni consommer un tirage supplémentaire de consigne avant de construire la banque.

Le nombre de phrases d’une fiche est plafonné aux modèles distincts disponibles. La banque de référence conserve **100 phrases distinctes par thème, forme et groupe**, sans inventer des ids comme `mettre2`. Voir `docs/gattegno/README.md` et `scripts/audit-gattegno.cjs` pour les contrôles exhaustifs et les exemples corrigés.

`phraseCategories` conserve les quatre réglages **Avec / Sans** pour adverbes, prépositions, conjonctions et adjectifs. Une valeur absente autorise la catégorie selon le thème ; `false` l’exclut. Sélectionner des prédicats complets, jamais retirer arbitrairement un mot ou un complément obligatoire. L’exclusion de la catégorie centrale d’un thème utilise les modèles simples. Les pronominaux conservent leurs constructions et leurs variantes simples rédigées. La négation *ne… pas* reste disponible sans les autres adverbes. Les consignes d’écriture doivent respecter ces choix. Le plafond des questions utilise la banque filtrée.

## Quotas des combinaisons

Tous les thèmes ont, pour chacun des deux groupes de verbes, 50 constructions simples, 50 pour chaque catégorie seule (adjectif, adverbe, préposition, conjonction), puis 25 pour chacune des 11 combinaisons de deux, trois ou quatre catégories : 525 au total, plus leurs formes négatives. `combinationContexts` fournit ces quotas contrôlables ; `combinationFrames` les ajoute aux constructions existantes sans perte. Les contextes sont regroupés par véritable infinitif, pas par ids artificiels. `frameForContext` résout les prédicats et le second infinitif avant le tirage des sujets.

Les enrichissements autorisent les quatre catégories dans tous les thèmes selon les réglages. Les anciennes banques de base gardent leurs contraintes historiques. Les prépositions nécessaires restent attachées à leur action. Les 16 masques doivent être accessibles via les options, et pas seulement apparaître dans un rapport. Contrôler avec `node scripts/audit-gattegno-combinations.cjs --write`.

## Tous les thèmes passent par les modèles

`pickPhrase` appelle `framesForTheme` + `instantiateThemeFrame` avant de répartir les mêmes phrases dans les quatre formats, pour :

- phrase simple / négation simple
- adjectif / négation + adjectif
- préposition / négation + préposition
- adverbe / négation + adverbe
- déterminants / négation + déterminants
- conjonctions
- verbes pronominaux

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

*Habiter*, *aller*, *rester chez*… exigent une préposition (*j’habite à Sion*, *j’habite dans un appartement*). Ils ne doivent jamais apparaître sans leur préposition : l’élève écrirait *habite une maison*. Dans les banques de base, ils sont réservés au thème Préposition ; les enrichissements les autorisent dans les autres thèmes seulement avec leur complément prépositionnel complet.

`frameMatchesTheme` conserve la séparation des banques de base. La sélection des enrichissements vérifie les catégories de chaque contexte complet selon les paramètres. Les constructions pronominales conservent elles aussi leurs compléments prépositionnels naturels.

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

## Négation et pronoms réfléchis

`tagged` sépare les pronoms réfléchis des verbes (*me* / *lave*, *m’* / *habille*). `withNegation` place *ne* avant les clitiques et *pas* après le verbe, rétablit *Je* devant *ne/n’*, et transforme les articles indéfinis/partitifs en *de/d’* sauf avec un attribut de *être*. Une clause coordonnée est traitée séparément. Les mots *ne* et *pas* restent des adverbes négatifs dans le code couleur existant. Les h aspirés de la banque sont explicitement pris en compte.

Dans les conjonctions, chaque proposition conserve son propre id verbal (`rightId` pour la seconde). Ne pas tirer une conjonction causale/adversative au hasard entre deux faits sans lien logique. La banque additive emploie *et*.

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
