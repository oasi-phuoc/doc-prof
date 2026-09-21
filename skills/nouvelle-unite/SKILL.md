---
name: nouvelle-unite
description: Compose une unité, c'est-à-dire une séquence de fiches générées d'un coup autour d'un objectif (unité phonique pour un graphème, unité thématique, unité document du quotidien, unité de révision) à partir des exercices existants du registre. À utiliser dès qu'on demande une série de fiches, un cahier, une leçon complète, un parcours, une progression ou « toutes les fiches pour le son [a] / le thème [santé] », même sans le mot « unité ».
---

# Créer une unité (séquence de fiches)

Une unité ne crée pas de nouveaux exercices : elle **assemble** des exercices du registre selon une progression pédagogique. C'est ce qui permet de produire en un clic un petit cahier cohérent au lieu d'une fiche isolée.

## Modèle

```ts
type UnitTemplate = {
  id: string;                      // "unite-phonique"
  label: string;                   // libellé affiché
  levels: Literacy[];              // niveaux de littératie compatibles
  paramsSchema: ZodType;           // ex. { grapheme: string; theme?: string }
  steps: {
    kind: string;                  // clé du registre d'exercices
    role: "reconnaitre" | "manipuler" | "produire" | "evaluer";
    paramsFrom: (unit: UnitParams) => unknown; // paramètres de l'exercice
    seedOffset: number;            // graine dérivée : graine de l'unité + décalage
  }[];
  pageBudget: number;              // nombre de pages visé
};
```

Une unité produit une **liste de blocs** (`Block[]`) répartie sur des fiches ; elle se stocke comme n'importe quelle fiche : recette + graine.

## Étapes

1. Choisir le type d'unité et lire la séquence correspondante dans `references/unite-phonique.md` (autres types : à créer sur le même modèle).
2. Vérifier que **chaque `kind` de la séquence existe** dans le registre. Si un exercice manque, ne pas l'inventer ici : passer par le skill `nouvel-exercice`, ou retirer l'étape en le signalant.
3. Écrire le `UnitTemplate` dans `src/features/units/<id>.ts` et l'enregistrer dans `src/features/units/registry.ts`.
4. Dériver **une graine par étape** à partir de la graine de l'unité (`seed + seedOffset`) : régénérer l'unité change tout, régénérer un exercice change seulement celui-là.
5. Respecter le **budget de pages** : viser 1 exercice à 3 exercices courts par page selon la densité ; ne jamais couper un exercice entre deux pages.
6. Tester : l'unité se génère pour trois valeurs de paramètres, le nombre de pages est celui attendu, un même jeu de paramètres et de graine redonne la même unité.
7. Lancer les skills `test-impression` et `relecture-linguistique` sur l'unité complète.

## Principes de progression

- Aller du **plus guidé au plus libre** : reconnaître → manipuler → produire → évaluer.
- **Une compétence mise en avant par page**, un type de tâche par exercice.
- Répéter le même **mot-cible** ou le même graphème sous des formes différentes (répétition avec variation) plutôt que d'ajouter du vocabulaire nouveau à chaque exercice.
- Terminer par une **auto-évaluation « Je peux… »** (cases à cocher), formulée pour l'apprenant·e.
- Le corrigé de l'unité regroupe tous les corrigés, avec les scripts d'écoute pour le/la formateur·trice.

## Terminé quand

Tous les `kind` existent · une graine par étape · budget de pages respecté · unité reproductible · test d'impression sur l'unité entière · relecture faite.
