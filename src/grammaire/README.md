# Grammaire — théorie FALC (SCAI) + exercices

Domaine dédié pour les **fiches de théorie** FALC et les **exercices** liés à chaque sous-thème.

| Fichier / dossier | Rôle |
|---|---|
| `catalog.ts` | Thèmes SCAI + types théorie + types exercices |
| `theory/*.ts` | Contenu FALC français |
| `exercises/` | kinds, sous-thèmes, banques, générateur |
| `exercises/bank/lessons-revised.ts` | 90 banques de 50 phrases, une par sous-thème repris |
| `exercises/bank/lessons-protected.ts` | 7 banques d’introduction conservées et complétées à 50 |
| `exercises/communication-data.json` | 160 situations, dix variantes de CE/PE/PO par thème communicatif |
| `scripts/grammar_curriculum/` | Sources éditoriales et reconstruction des contenus |
| `generate.ts` | Théorie **ou** exercices selon le type |

## UI

1. **Thème** = partie SCAI (ex. Conjuguer au présent)
2. **Sous-thème** = notion (Être, Avoir, -er… / Passé composé… / fiche théorie)
3. **Type** = **Théorie** + exercices du sous-thème (libellés de leçon)

Les 99 fiches de théorie sont conservées dans leur état antérieur au commit `b04247cb`, hors ancien thème Aide-mémoire. La reconstruction des exercices ne les modifie plus. Chaque sous-thème repris a une banque de 50 phrases distinctes avec une seule réponse, trois choix et une variante inline dans le même type d’exercice. Les activités communicatives proposent dix situations par type CE, PE et PO. Les modules particuliers de présentation restent disponibles. Le [rapport de reprise](../../docs/grammaire/README.md) décrit la couverture et la validation.

## Types d’exercice (kinds)

Les types affichés sont les banques disponibles pour le sous-thème. Les anciennes catégories restent reconnues pour les activités d’introduction existantes. Les nouvelles banques regroupent QCM et réponse inline ; la communication ajoute « Lire une situation », « Écrire une phrase utile » et « Dire une phrase utile ».

Les libellés du sélecteur viennent de `GramLesson.label` (ex. « Compléter avec être »).

Le rendu des exercices reprend la mise en page TCF : QCM texte / image / phrase (3 icônes), audios comme la CO (téléchargement, pas de lecteur sur la fiche), documents à lire comme la CE, rédaction comme la PE. Une phrase = une réponse (pas de `suis / m’appelle` sur le même item). Un seul verbe à conjuguer va dans la consigne, sans infinitif entre parenthèses dans la phrase ; sinon l’infinitif (pas les parenthèses) est à la couleur du thème. Le mode libre ouvre le même éditeur que le TCF.

## Mise en forme dans une phrase de théorie

Dans un paragraphe, un exemple, une astuce, une attention ou une case de tableau :

| Balise | Effet |
|---|---|
| `{g}mot{/g}` | gras |
| `{c}mot{/c}` | gras et couleur du thème |
| `{s}mot{/s}` | souligné de la couleur du thème |
| `{ligne}` | un interligne complet à la place du défaut |
| `{ligne/2}` | un demi-interligne à la place du défaut |
| `{ligne/3}` | un tiers d’interligne à la place du défaut |

Entre deux kinds, l’espace par défaut est un quart d’interligne (`ligne/4`). `{ligne}`, `{ligne/2}` et `{ligne/3}` **remplacent** cet espace (ils ne s’ajoutent pas). Ne pas écrire `{ligne/4}` : c’est déjà le défaut.

Deux paragraphes de texte qui se suivent sont fusionnés en un seul (un espace, pas de retour). Pour un interligne plus grand, intercaler `{ligne}` ou `{ligne/2}`. Dans une phrase, `{ligne}` force encore un saut.

Exemple : `J’utilise {c}être{/c}, {g}habiter{/g} et {s}parler{/s}.`  
Ligne vide : `{ kind: 'paragraph', text: '{ligne}' }` ou `…Martigny.{ligne}Je parle français.`

## Bloc tab

Tableau sans bordures. `rows` sépare les lignes, comme pour `table`. Par défaut : 1 tabulation, sans flèche. On n’écrit `tab` et `fleche` que si on en a besoin.

```ts
{ kind: 'tab', rows: [['Verbe', 'Être', 'Nationalité'], ['', 'Habiter à', 'ville']] }
```

Deux tabulations et une flèche :

```ts
{
  kind: 'tab',
  tab: 2,
  fleche: true,
  rows: [['Verbe', 'Être', 'Nationalité'], ['', 'Habiter à', 'ville']],
}
```

## Feuille suivante

La théorie n’est plus coupée tous les 6 blocs. Les boutons « Page » à droite des sections « Je regarde », « J’explique » et « Je retiens » permettent de placer la suite sur une nouvelle feuille. Les blocs page déjà présents dans les données définissent les coupures initiales :

```ts
{ kind: 'page' },
```

La suite commence alors sur la feuille suivante. Les coupures peuvent être activées ou retirées dans l’aperçu.

## Déterminisme

Tirage via `createRng(seed)` + `shuffle` ; jamais `Math.random()` dans le générateur.

## Lecture et compréhension dans « Parler de sa famille »

- **Photo de famille** regroupe les anciennes activités d’arbre, de photo et de récit : 20 documents uniques, avec cinq questions chacun, sur les liens de parenté et les métiers.
- **Message et email** propose 20 messages et emails reçus ou envoyés, avec cinq questions chacun.
- Les documents sont conservés dans `exercises/family-reading-data.json` et `exercises/family-message-data.json`. Le rendu CE offre QCM et réponse écrite par question, ainsi qu’un bouton de saut de page avant chaque question. Les sauts conservent le document tiré, les numéros et les autres exercices de la fiche.
- **Compréhension orale** conserve les audios existants. **Écrire sur sa famille** reste en dernière position, au format PE.

## Compléments pour tous les sous-thèmes du présent

Chacun des onze sous-thèmes propose **Corriger l’erreur** (50 phrases à réécrire) et **Mots dans l’ordre** (banques A1 et A2 réunies). Les mots mélangés utilisent les pastilles de couleur Gattegno et une ligne pour réécrire la phrase ; le corrigé montre la phrase complète. Pour l’ordre, les paramètres permettent de choisir la forme affirmative, négative ou mixte, ainsi que les catégories facultatives ; le plafond de questions suit les filtres choisis. Les catégories qui regroupent plusieurs verbes affichent l’infinitif en couleur après la ligne de réponse. Les banques sont dans `exercises/present-supplement-data.json` ; `scripts/build-present-supplement.py` reconstruit les groupes à partir du lexique et conserve les banques être/avoir rédigées séparément. Le générateur du curriculum ne les réécrit pas.

## Poser une question : questions fermées, ouvertes et avec quel

Chaque type hors CE contient **50 questions ou phrases**. Chaque sous-thème dispose de **20 textes CE rédigés séparément**, avec des genres et situations variés, et non de variantes d’un même gabarit. Les trois banques ne partagent pas leurs textes (60 textes au total).

**Questions fermées**, dans l’ordre :

1. Poser des questions avec est-ce que.
2. Poser des questions avec l’inversion.
3. Réponse affirmative.
4. Réponse négative.
5. Lire un texte (CE) : questions avec est-ce que et inversion, réponses affirmatives et négatives mélangées.
6. Lire un texte et écrire des questions : l’élève invente des questions fermées sur le texte.

**Questions ouvertes**, dans l’ordre :

1. Pronom interrogatif + est-ce que.
2. Pronom interrogatif + inversion.
3. Répondre à la question.
4. Lire un texte (CE) : répondre aux questions ouvertes.
5. Lire un texte et écrire des questions : inventer des questions ouvertes.

**Questions avec quel**, dans l’ordre :

1. Poser des questions avec quel.
2. Répondre à la question avec quel.
3. Lire un texte (CE) : répondre aux questions avec quel, quelle, quels ou quelles.
4. Lire un texte et écrire des questions avec ces formes.

Les constructions sont indiquées dans la consigne en gras couleur thème. Chaque question ou phrase est suivie d’une ligne de réponse. Les modèles du corrigé restent masqués sur la fiche élève. Pour les questions personnelles et les questions inventées, le corrigé est un exemple possible. Les six types CE offrent un bouton de saut de page avant chaque question.

Les lectures sont dans `question-reading-data.json`, `question-open-reading-data.json` et `question-quel-reading-data.json` sous `exercises/`. Les banques de transformation et de réponses sont dans les fichiers `question-*-data.json`. `scripts/build-question-transforms.py` reconstruit les questions fermées ; les autres données sont rédigées directement en JSON. **La phrase exclamative** reste un thème distinct juste après « Poser une question ».

## Taille des banques du présent

Tous les types hors CE de « Conjuguer au présent » contiennent 50 questions ou situations, y compris « Écrire une phrase utile » et « Dire une phrase utile » des verbes modaux. Leur source est `exercises/modal-production-data.json`, reconstruite par `scripts/build-modal-production.py`. La lecture des verbes modaux dispose de 20 textes originaux dans `exercises/modal-reading-data.json`, avec QCM ou réponse écrite et sauts de page. Les autres thèmes de communication conservent leurs banques existantes.
