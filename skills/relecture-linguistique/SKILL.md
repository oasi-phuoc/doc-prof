---
name: relecture-linguistique
description: Relit et contrôle une fiche de FLE, une série de consignes ou un jeu de contenus avant publication - niveau de langue (pré-alpha à B2), cohérence des verbes de consigne, vouvoiement ou tutoiement, prénoms fictifs, neutralité culturelle, pertinence des images et pictogrammes, lisibilité. À utiliser dès qu'on demande de relire, vérifier, valider, corriger ou « passer en revue » une fiche, un exercice, des consignes, un lexique ou un texte destiné à des apprenant·e·s.
---

# Relecture linguistique et pédagogique

Une fiche peut être techniquement parfaite et pédagogiquement inutilisable : trop de mots hors niveau, consignes qui changent de verbe, image ambiguë. Cette relecture cherche ces problèmes **avant** qu'une personne ne les découvre en classe.

**Ne rien modifier en silence.** Produire d'abord un rapport, appliquer ensuite les corrections que la personne valide (ou les évidentes : coquilles, accents).

## Ce qu'il faut contrôler

1. **Niveau.** Exécuter le contrôle de niveau (`wordsAboveLevel`) sur tous les textes affichés à l'apprenant·e : consignes, phrases, textes. Signaler les mots au-dessus du niveau et les mots inconnus. Distinguer ce qui est voulu (mot à apprendre) de ce qui est involontaire.
2. **Consignes.** Un seul verbe d'action ; verbes issus de la liste du niveau ; mêmes verbes d'une fiche à l'autre ; phrases courtes ; pas de double consigne ni de négation aux niveaux débutants ; pictogramme cohérent avec le verbe.
3. **Personne.** Vouvoiement, tutoiement ou infinitif : un seul choix sur toute la fiche.
4. **Exemples.** Prénoms fictifs et variés ; aucune donnée réelle ; pas de stéréotype (rôles, métiers, familles) ; pas de référence culturelle opaque ou excluante (fêtes, aliments, vêtements).
5. **Images et pictogrammes.** Chaque image correspond sans ambiguïté au mot ; style cohérent ; rien qui ne se lise plus en noir et blanc.
6. **Exactitude.** Orthographe, accords, genre des noms, conjugaisons, syllabation. En cas de doute sur une règle, le dire plutôt que d'affirmer.
7. **Lisibilité papier.** Taille adaptée au niveau, espaces de réponse suffisants, pas de texte sur fond coloré, un type de tâche par exercice, un exemple résolu en premier item quand c'est prévu.
8. **Corrigé.** Complet, cohérent avec l'énoncé, script d'écoute présent si l'exercice est oral.

## Format du rapport

Toujours ce gabarit, une ligne par problème, du plus grave au moins grave :

```
## Résumé
[2 phrases : verdict global et nombre de problèmes par gravité]

## Problèmes
| Gravité | Où | Problème | Correction proposée |
|---|---|---|---|
| Bloquant | Ex. 2, item 4 | « conséquence » : mot B2 dans une fiche A1 | Remplacer par « résultat » |
| À corriger | Consigne Ex. 1 | Deux verbes (« lisez et entourez ») | Séparer en deux consignes |
| Suggestion | En-tête | Prénom « Jean » répété trois fois | Varier les prénoms |

## Ce qui va bien
[1 à 3 points à conserver]
```

Gravités : **Bloquant** (empêche l'usage ou fausse l'apprentissage), **À corriger** (gêne réelle), **Suggestion** (amélioration facultative).

## Après le rapport

Appliquer les corrections validées, relancer le contrôle de niveau et `npm run check:content`, puis indiquer ce qui a changé.

## Limites à assumer

Le contrôle de niveau ne remplace pas un œil humain : les formes conjuguées et accordées dépendent de la qualité de `forms`, et les mots grammaticaux très courants doivent exister dans le lexique de base. Signaler ces limites quand elles expliquent un faux positif.
