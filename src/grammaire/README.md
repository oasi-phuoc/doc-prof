# Grammaire — théorie FALC (SCAI) + exercices

Domaine dédié pour les **fiches de théorie** FALC et les **exercices** liés à chaque sous-thème.

| Fichier / dossier | Rôle |
|---|---|
| `catalog.ts` | Thèmes SCAI + types théorie + types exercices |
| `theory/*.ts` | Contenu FALC français |
| `exercises/` | kinds, sous-thèmes, banques, générateur |
| `exercises/bank/lessons-revised.ts` | 104 banques de 50 phrases, une par sous-thème repris |
| `exercises/bank/lessons-protected.ts` | 8 banques d’introduction conservées et complétées à 50 |
| `exercises/communication-data.json` | 160 situations, dix variantes de CE/PE/PO par thème communicatif |
| `scripts/grammar_curriculum/` | Sources éditoriales et reconstruction des contenus |
| `generate.ts` | Théorie **ou** exercices selon le type |

## UI

1. **Thème** = partie SCAI (ex. Conjuguer au présent)
2. **Sous-thème** = notion (Être, Avoir, -er… / Passé composé… / fiche théorie)
3. **Type** = **Théorie** + exercices du sous-thème (libellés de leçon)

Les 105 fiches de théorie hors « Entrer en contact » et « Se présenter » ont été réécrites en français facile. La présentation des blocs est conservée. Chaque sous-thème repris a une banque de 50 phrases distinctes avec une seule réponse, trois choix et une variante inline dans le même type d’exercice. Les activités communicatives proposent dix situations par type CE, PE et PO. Les modules particuliers de présentation restent disponibles. Le [rapport de reprise](../../docs/grammaire/README.md) décrit la couverture et la validation.

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

La théorie n’est plus coupée tous les 6 blocs. Tout reste sur une feuille, sauf si vous insérez un bloc page :

```ts
{ kind: 'page' },
```

La suite (tableau, astuce, etc.) commence alors sur la feuille suivante. « Une fiche » dans le panneau ignore ces blocs.

## Déterminisme

Tirage via `createRng(seed)` + `shuffle` ; jamais `Math.random()` dans le générateur.
