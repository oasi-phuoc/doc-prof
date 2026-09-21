# Lexique : schéma et import

## Format d'une entrée

```json
{
  "id": "sante.medecin",
  "lemma": "médecin",
  "forms": ["médecin", "médecins"],
  "pos": "nom",
  "gender": "m",
  "level": "A1",
  "syllables": ["mé", "de", "cin"],
  "theme": "sante",
  "imageId": "sante-medecin",
  "definition": "Personne qui soigne les malades.",
  "example": "Je vais chez le médecin.",
  "tags": ["metier", "sante"]
}
```

Un fichier de thème : `{ "version": 1, "theme": "sante", "entries": [ … ] }`.

Champs **obligatoires** : `id`, `lemma`, `forms`, `pos`, `level`, `syllables`, `theme`. Les autres s'enrichissent progressivement.

- `id` : `<theme>.<mot-sans-accent>` ; unique.
- `level` : `A1.1`, `A1`, `A2`, `B1`, `B2`.
- `gender` : `m`, `f` ou `mf` (noms uniquement).
- `syllables` : tableau ; leur concaténation, sans espaces ni apostrophes, doit égaler le lemme (sans espaces ni apostrophes).

## Colonnes attendues dans le fichier Excel ou CSV

Une **feuille par thème** (le nom de la feuille devient le thème). En-têtes exacts, en minuscules et sans accent :

| Colonne | Contenu | Exemple |
|---|---|---|
| `lemme` | mot à l'infinitif ou au singulier | `médecin` |
| `formes` | formes séparées par `;` | `médecin;médecins` |
| `nature` | nom, verbe, adjectif… | `nom` |
| `genre` | `m`, `f` ou vide | `m` |
| `niveau` | `A1.1`, `A1`, `A2`, `B1`, `B2` | `A1` |
| `syllabes` | séparées par `-` | `mé-de-cin` |
| `image` | identifiant d'image (facultatif) | `sante-medecin` |
| `definition` | phrase courte (facultatif) | |
| `exemple` | phrase courte (facultatif) | |

Le script `scripts/import-lexique.ts.tpl` refuse une ligne invalide et écrit un rapport ; il ne corrige jamais en silence.

## Conseils d'enrichissement

Ordre conseillé pour un thème existant : niveau → syllabes → image → exemple → définition. Ne pas bloquer un thème parce qu'il manque des définitions.
