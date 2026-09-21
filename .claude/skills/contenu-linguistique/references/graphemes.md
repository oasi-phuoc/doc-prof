# Graphèmes et phonèmes

## Format

```json
{
  "version": 1,
  "graphemes": [
    {
      "id": "a",
      "graphie": "a",
      "phoneme": "/a/",
      "kind": "voyelle",
      "order": 1,
      "difficulty": 1,
      "positions": ["initiale", "medial", "finale"],
      "examples": ["ami", "table", "papa"],
      "pitfalls": []
    }
  ]
}
```

- `kind` : `voyelle`, `consonne`, `semi-voyelle`, `digraphe`, `trigraphe`.
- `order` : ordre de progression **par défaut** ; le/la formateur·trice peut le modifier dans l'interface, il ne doit donc jamais être supposé par un générateur.
- `examples` : mots présents dans le lexique (le contrôle vérifie leur existence).
- `pitfalls` : confusions fréquentes (b/d, p/q, on/an), utilisées pour les exercices de discrimination.

## Règles

- Un graphème = une correspondance. Le « c » de « ça » et celui de « café » sont deux entrées.
- Les lettres muettes et les liaisons ne sont pas des graphèmes ; elles se marquent au niveau du mot (`syllables` et un futur champ `silent`).
- Vérifier les exemples avec une personne francophone avant de fusionner.
