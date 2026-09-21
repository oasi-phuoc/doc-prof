---
name: nouvel-exercice
description: Crée un nouveau type d'exercice pour les fiches de FLE, de bout en bout (dossier dans src/features/exercises, schéma Zod, générateur pur à graine, rendu apprenant·e et corrigé, tests, enregistrement au registre). À utiliser dès qu'on demande d'ajouter, créer ou implémenter un exercice, un type de fiche ou un générateur (relier, texte à trous, mots mêlés, tableau de syllabes, conjugaison, dictée, classer, colorier, remettre en ordre…), même si le mot « exercice » n'est pas prononcé ou si la demande est formulée comme « fais-moi une fiche de… ».
---

# Créer un type d'exercice

Un exercice est un module autonome du registre (`src/features/exercises/registry.ts`). Ce skill fournit des gabarits qui respectent déjà les règles du projet, pour que le temps soit consacré au contenu pédagogique et non à la plomberie.

## Avant de coder

Lire `CLAUDE.md` et un exercice déjà terminé (par exemple `syllable-table/`) pour en imiter les conventions plutôt que les réinventer. Puis fixer, en une phrase chacun :

1. **Niveaux visés** (pré-alpha, alpha, post-alpha, lecteur) et compétence (graphisme, phonie-graphie, lexique, grammaire…).
2. **Ce que l'apprenant·e fait sur le papier** (entourer, relier, écrire, cocher…) : cela détermine le pictogramme de consigne et l'espace de réponse.
3. **Données nécessaires** (lexique, graphèmes, images, documents fictifs). Si elles manquent, s'arrêter et passer d'abord par le skill `contenu-linguistique` : un générateur ne doit jamais contenir de vocabulaire en dur.
4. **Paramètres** réglables par le/la formateur·trice, avec bornes.
5. **Corrigé** : ce qu'il affiche (réponses, script d'écoute, liste de lecture).

Si plus de deux points sont flous, poser la question ; sinon décider et noter l'hypothèse dans le message final.

## Étapes

1. Créer `src/features/exercises/<kind>/` (kebab-case) à partir des gabarits de `assets/` : `definition.ts.tpl`, `Render.tsx.tpl`, `definition.test.ts.tpl`. Retirer le suffixe `.tpl` et remplacer `__kind__` (kebab), `__Kind__` (Pascal), `__LABEL__` (libellé français affiché).
2. Écrire le **schéma Zod** des paramètres : bornes explicites (`min`, `max`), valeurs par défaut sensées. Le formulaire de réglages est généré à partir de ce schéma.
3. Écrire `generate` en respectant le contrat ci-dessous.
4. Écrire le rendu (`Render`) : consigne + pictogramme, items, espace de réponse, mode `teacher` pour le corrigé.
5. Enregistrer la définition dans `registry.ts`.
6. Écrire les tests (déterminisme, 1000 graines, avertissements).
7. Lancer `npm run lint && npm run typecheck && npm test`, puis les skills `test-impression` (rendu papier) et `relecture-linguistique` (consignes et contenus).

## Contrat du générateur

- **Pur** : mêmes `(params, rng, ctx)` donnent le même résultat. Utiliser uniquement `rng` (voir `src/lib/rng.ts`) ; pas de `Math.random()`, pas de date, pas d'ordre d'objet non déterministe.
- **Contenu venant du contexte** (`ctx`) : lexique, graphèmes, images, niveau visé. Filtrer par niveau avant de tirer.
- **Sans doublon** tant que la réserve le permet ; sinon, renvoyer un avertissement clair dans `warnings` (par exemple « 5 mots disponibles pour 8 cases »), sans planter.
- **Corrigé dans `answers`**, même longueur et même ordre que `items`.
- Aucune chaîne française de consigne en dur : elle vient de `src/content/consignes/`.

## Contrat du rendu

- Racine : `<section className="exercise" data-kind="…">` pour que la pagination et `break-inside: avoid` fonctionnent.
- Consigne courte + pictogramme (obligatoire en pré-alpha et alpha), un seul verbe d'action.
- Espaces de réponse dimensionnés avec `--write-line` (la hauteur suit la densité de la fiche) ; jamais plus petits que l'écriture attendue.
- Lisible en noir et blanc ; pas de texte posé sur une image ou un fond coloré.
- Le mode `teacher` affiche le corrigé sans changer la mise en page de l'exercice.

## Interface de référence

Adapter à `src/features/exercises/types.ts` s'il diffère (le code réel fait foi) :

```ts
interface ExerciseDefinition<P> {
  kind: string;
  label: string;
  skills: string[];
  levels: ("pre-alpha" | "alpha" | "post-alpha" | "lecteur")[];
  icon: React.FC;
  paramsSchema: ZodType<P>;
  defaults: P;
  generate(params: P, rng: Rng, ctx: GenerationContext): {
    items: unknown[];
    answers: unknown[];
    warnings?: string[];
  };
  Render: React.FC<{ block: Block; data: unknown; mode: "student" | "teacher" }>;
}
```

## Pièges fréquents

- Tirer avec `Array.sort(() => rng() - 0.5)` : biaisé. Utiliser `shuffle`.
- Oublier les formes accordées (pluriel, féminin) : passer par `forms` du lexique.
- Générer un énoncé sans solution ou avec plusieurs solutions.
- Dépasser la page : prévoir un nombre d'items maximal compatible avec une page A4 à la densité choisie.
- Mots hors niveau dans les phrases-modèles : passer le contrôle de niveau.

## Terminé quand

Formulaire de paramètres validé · `generate` pur et testé · rendu apprenant·e et corrigé · lisible en noir et blanc · consigne relue · exercice visible au bon niveau dans le sélecteur · test d'impression fait.
