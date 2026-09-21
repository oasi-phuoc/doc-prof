# Consignes types

## Format

```json
{
  "version": 1,
  "level": "alpha",
  "verbs": ["entourez", "écrivez", "reliez", "coloriez", "cochez"],
  "consignes": {
    "match-images": { "text": "Reliez le mot et l'image.", "picto": "relier" },
    "syllable-table": { "text": "Lisez.", "picto": "observer" }
  }
}
```

Un fichier par niveau de littératie ou de CECRL (`alpha.json`, `a1.json`, `a2.json`…). Les consignes de l'exercice viennent d'ici via `useConsigne(kind)`.

## Règles d'écriture

- **Un seul verbe d'action** par consigne, à l'impératif (vouvoiement par défaut) ou à l'infinitif selon le réglage de la fiche.
- Phrases courtes (5 à 8 mots en alpha et A1), vocabulaire du niveau.
- **Mêmes verbes d'une fiche à l'autre** : la liste `verbs` fait foi.
- Toujours accompagnée d'un pictogramme (`picto` = clé du registre des pictogrammes).
- Pas de négation ni de double consigne dans une même phrase aux niveaux débutants.
- En pré-alpha, la consigne écrite peut être vide : le pictogramme et la lecture par le/la formateur·trice suffisent.

## Trois formes par consigne

Fournir les trois formes, sinon le réglage de personne ne fonctionnera pas :

```json
"match-images": {
  "vous": "Reliez le mot et l'image.",
  "tu": "Relie le mot et l'image.",
  "infinitif": "Relier le mot et l'image.",
  "picto": "relier"
}
```
