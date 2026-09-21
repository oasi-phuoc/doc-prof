---
name: contenu-linguistique
description: Ajoute, importe, corrige ou valide les données linguistiques du site (src/content) - lexique thématique avec niveaux et syllabes, table graphème-phonème, consignes types, documents du quotidien fictifs, images pédagogiques et leurs licences. Inclut l'import Excel ou CSV vers JSON. À utiliser dès qu'on parle de vocabulaire, de thème, de liste de mots, de syllabes, de graphèmes, de consignes, de banque d'images ou d'importer un fichier Excel, même si la demande ne dit pas « contenu ».
---

# Contenus linguistiques

Les générateurs ne contiennent aucun vocabulaire : tout vient de `src/content/`. La qualité des fiches dépend donc de la qualité de ces données. Ce skill sert à les ajouter vite **et** correctement.

## Où va quoi

| Donnée | Emplacement | Détails |
|---|---|---|
| Lexique par thème | `src/content/lexique/<theme>.json` | `references/lexique.md` |
| Graphèmes et phonèmes | `src/content/graphemes/graphemes.json` | `references/graphemes.md` |
| Consignes types par niveau | `src/content/consignes/<niveau>.json` | `references/consignes.md` |
| Images pédagogiques | `src/content/images/<theme>/<id>.svg` + `images.json` | section « Images » ci-dessous |
| Documents du quotidien fictifs | `src/content/scenarios/<id>.json` | section « Documents fictifs » |
| Provenance et licences | `src/content/SOURCES.md` | une ligne par jeu de données |

Lire uniquement la référence utile à la tâche.

## Processus commun

1. **Identifier le niveau** de chaque entrée (littératie et CECRL) : une donnée sans niveau est inutilisable par le garde-fou.
2. **Saisir ou importer** (script `scripts/import-lexique.ts.tpl` pour un fichier Excel ou CSV : une feuille par thème).
3. **Valider** : `npm run check:content`. Corriger toutes les erreurs ; ne pas contourner la validation.
4. **Consigner la source** et la licence dans `src/content/SOURCES.md`.
5. **Incrémenter la version** du fichier modifié (`"version"` en tête).
6. **Faire relire** par une personne (voir le skill `relecture-linguistique`) avant de fusionner.

## Règles de fond

- **Les syllabes sont saisies, pas calculées.** La syllabation du français est irrégulière ; un algorithme approximatif produit des erreurs visibles sur la fiche. Vérification automatique : la concaténation des syllabes doit redonner le mot.
- **`forms` couvre les formes accordées** (pluriel, féminin) pour que le contrôle de niveau reconnaisse « médecins » comme « médecin ».
- Chaque mot a un **thème** ; un mot utile à plusieurs thèmes est répété avec un identifiant différent plutôt qu'avec des thèmes multiples.
- **Un mot, un niveau** : en cas de doute entre deux niveaux, choisir le plus bas.
- **Exemples** : phrases courtes, présent, vocabulaire du niveau, prénoms fictifs et variés, aucune donnée réelle.
- Éviter les références culturelles opaques et les exemples qui excluent (aliments, fêtes, vêtements, familles) : rester neutre.

## Images

Chaque image a dans `images.json` : `id`, `words` (mots associés), `theme`, `style`, `source`, `license`, `author`, `addedAt`.

- **SVG de préférence** (net à l'impression, recolorisable, léger) ; sinon bitmap ≥ 300 dpi à la taille imprimée.
- Style cohérent avec la série ; images d'adultes ou neutres ; aucun texte dans l'image.
- **Test « quel mot voit-on ? »** : montrer l'image sans le mot à une personne ; si elle hésite, remplacer l'image. Une image ambiguë est pire qu'aucune image.
- Licence vérifiée et notée. Refuser toute image dont la licence interdit l'usage commercial ou impose une condition non respectable, sauf décision explicite.
- Nom de fichier : `<theme>-<mot>.svg`, en minuscules, sans accent.

## Documents fictifs

Gabarits de documents du quotidien (horaire, plan, étiquette, facture simple, annonce, formulaire, rendez-vous, message de l'école) **entièrement fictifs** :

- aucun logo, aucune mise en page copiant une institution réelle ;
- noms, adresses, numéros, montants inventés (numéros clairement fictifs) ;
- un composant React paramétrable par gabarit, avec un fichier JSON de variantes ;
- niveau de lecture indiqué et vérifié avec le garde-fou.

## Terminé quand

`check:content` vert · niveaux renseignés · syllabes cohérentes · images référencées présentes · sources et licences notées · version incrémentée · relecture faite.
