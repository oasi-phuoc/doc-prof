/**
 * Test de placement mathématiques (TCM) — chronologie calquée sur
 * soutien-scolaire `PLACEMENT_MATH_EXERCISES` (38 exercices).
 * Chaque étape réutilise un type déjà présent en algèbre / géométrie.
 */
import type { Difficulty, Domain, PageConfig } from './types'
import { exerciseTypeById } from './catalog'

export const TCM_DOMAIN: Domain = 'tcm'

type TcmBlockSpec = {
  exerciseType: string
  count: number
  columns?: 1 | 2 | 3
}

type TcmStepSpec = {
  /** N° d’exercice dans le TCM (1–38). */
  id: number
  label: string
  blocks: readonly TcmBlockSpec[]
}

/**
 * Recette chronologique TCM → types doc-prof.
 * counts / columns repris des printQuestions / printColumns soutien-scolaire
 * quand disponibles ; géométrie périmètre+aire = 2 blocs.
 */
export const TCM_STEPS: readonly TcmStepSpec[] = [
  { id: 1, label: 'Compter les formes', blocks: [{ exerciseType: 'figures-nommer', count: 2, columns: 2 }] },
  { id: 2, label: 'Comparer (11–99)', blocks: [{ exerciseType: 'nombres-comparer', count: 4, columns: 2 }] },
  { id: 3, label: 'Suites numériques', blocks: [{ exerciseType: 'nombres-suite', count: 2, columns: 2 }] },
  {
    id: 4,
    label: 'Additions et soustractions',
    blocks: [
      { exerciseType: 'addition-ligne', count: 2, columns: 2 },
      { exerciseType: 'soustraction-ligne', count: 2, columns: 2 },
    ],
  },
  {
    id: 5,
    label: 'Opérande manquant',
    blocks: [
      { exerciseType: 'addition-trou', count: 2, columns: 2 },
      { exerciseType: 'soustraction-trou', count: 2, columns: 2 },
    ],
  },
  {
    id: 6,
    label: 'Calcul en colonnes (99–999)',
    blocks: [
      { exerciseType: 'addition-colonne', count: 1, columns: 2 },
      { exerciseType: 'soustraction-colonne', count: 1, columns: 2 },
    ],
  },
  { id: 7, label: 'Dizaines et unités', blocks: [{ exerciseType: 'nombres-position', count: 2, columns: 2 }] },
  { id: 8, label: 'Comparer (101–999)', blocks: [{ exerciseType: 'nombres-comparer', count: 4, columns: 2 }] },
  { id: 9, label: 'Grandes suites', blocks: [{ exerciseType: 'nombres-suite', count: 2, columns: 2 }] },
  {
    id: 10,
    label: 'Calcul mixte',
    blocks: [
      { exerciseType: 'addition-ligne', count: 2, columns: 2 },
      { exerciseType: 'soustraction-ligne', count: 2, columns: 2 },
      { exerciseType: 'multiplication-ligne', count: 2, columns: 2 },
    ],
  },
  { id: 11, label: 'Décomposition', blocks: [{ exerciseType: 'nombres-decompose', count: 2, columns: 1 }] },
  {
    id: 12,
    label: 'Colonnes (1000–9999)',
    blocks: [
      { exerciseType: 'addition-colonne', count: 1, columns: 2 },
      { exerciseType: 'soustraction-colonne', count: 1, columns: 2 },
    ],
  },
  {
    id: 13,
    label: 'Multiplication en colonnes',
    blocks: [{ exerciseType: 'multiplication-colonne', count: 2, columns: 2 }],
  },
  { id: 14, label: 'Division en colonnes', blocks: [{ exerciseType: 'division-colonne', count: 2, columns: 1 }] },
  {
    id: 15,
    label: 'Rectangle',
    blocks: [
      { exerciseType: 'perimetres-rectangle', count: 1, columns: 2 },
      { exerciseType: 'aires-rectangle', count: 1, columns: 2 },
    ],
  },
  { id: 16, label: 'Suites (grands nombres)', blocks: [{ exerciseType: 'nombres-suite', count: 2, columns: 1 }] },
  { id: 17, label: 'Trier des nombres', blocks: [{ exerciseType: 'nombres-ranger', count: 2, columns: 1 }] },
  {
    id: 18,
    label: 'Additions et soustractions décimales',
    blocks: [
      { exerciseType: 'decimaux-add-colonne', count: 2, columns: 2 },
      { exerciseType: 'decimaux-sub-colonne', count: 2, columns: 2 },
    ],
  },
  {
    id: 19,
    label: 'Multiplication décimale',
    blocks: [{ exerciseType: 'decimaux-mul-colonne', count: 2, columns: 2 }],
  },
  {
    id: 20,
    label: 'Division décimale',
    blocks: [{ exerciseType: 'decimaux-div-colonne', count: 2, columns: 1 }],
  },
  { id: 21, label: 'Colorier les fractions', blocks: [{ exerciseType: 'fractions-identifier', count: 4, columns: 2 }] },
  { id: 22, label: 'Lire les fractions', blocks: [{ exerciseType: 'fractions-equivalentes', count: 4, columns: 2 }] },
  {
    id: 23,
    label: 'Conversions de longueur',
    blocks: [{ exerciseType: 'conversions-longueur', count: 8, columns: 2 }],
  },
  {
    id: 24,
    label: 'Calculs décimaux',
    blocks: [
      { exerciseType: 'decimaux-mul-ligne', count: 4, columns: 2 },
      { exerciseType: 'decimaux-div-ligne', count: 4, columns: 2 },
    ],
  },
  {
    id: 25,
    label: 'Parallélogramme',
    blocks: [
      { exerciseType: 'perimetres-parallelogramme', count: 1, columns: 2 },
      { exerciseType: 'aires-parallelogramme', count: 1, columns: 2 },
    ],
  },
  {
    id: 26,
    label: 'Triangle rectangle',
    blocks: [
      { exerciseType: 'perimetres-triangle', count: 1, columns: 2 },
      { exerciseType: 'aires-triangle', count: 1, columns: 2 },
    ],
  },
  {
    id: 27,
    label: 'Losange',
    blocks: [
      { exerciseType: 'perimetres-losange', count: 1, columns: 2 },
      { exerciseType: 'aires-losange', count: 1, columns: 2 },
    ],
  },
  {
    id: 28,
    label: 'Puissances et racines',
    blocks: [
      { exerciseType: 'puissances-calcul', count: 2, columns: 2 },
      { exerciseType: 'puissances-racine', count: 2, columns: 2 },
    ],
  },
  {
    id: 29,
    label: 'Priorité des opérations',
    blocks: [{ exerciseType: 'puissances-priorite', count: 4, columns: 2 }],
  },
  {
    id: 30,
    label: 'Nombres relatifs',
    blocks: [
      { exerciseType: 'relatifs-comparer', count: 4, columns: 2 },
      { exerciseType: 'relatifs-add', count: 4, columns: 2 },
    ],
  },
  {
    id: 31,
    label: 'Fractions',
    blocks: [
      { exerciseType: 'fractions-add', count: 4, columns: 2 },
      { exerciseType: 'fractions-mul', count: 4, columns: 2 },
    ],
  },
  {
    id: 32,
    label: 'Pourcentages et règle de trois',
    blocks: [
      { exerciseType: 'proportion-de', count: 1, columns: 2 },
      { exerciseType: 'proportion-problemes', count: 1, columns: 1 },
    ],
  },
  {
    id: 33,
    label: 'Simplification algébrique',
    blocks: [{ exerciseType: 'expressions-reduire', count: 4, columns: 1 }],
  },
  {
    id: 34,
    label: 'Évaluer des expressions',
    blocks: [{ exerciseType: 'expressions-substituer', count: 2, columns: 1 }],
  },
  {
    id: 35,
    label: 'Résoudre des équations',
    blocks: [{ exerciseType: 'equations-simple', count: 2, columns: 2 }],
  },
  {
    id: 36,
    label: 'Conversions d’unités',
    blocks: [
      { exerciseType: 'conversions-masse', count: 2, columns: 2 },
      { exerciseType: 'conversions-capacite', count: 2, columns: 2 },
    ],
  },
  {
    id: 37,
    label: 'Trapèze',
    blocks: [
      { exerciseType: 'perimetres-trapeze', count: 1, columns: 2 },
      { exerciseType: 'aires-trapeze', count: 1, columns: 2 },
    ],
  },
  {
    id: 38,
    label: 'Cercle',
    blocks: [
      { exerciseType: 'perimetres-cercle', count: 1, columns: 2 },
      { exerciseType: 'aires-disque', count: 1, columns: 2 },
    ],
  },
]

function blockFromSpec(spec: TcmBlockSpec, difficulty: Difficulty = 'moyen') {
  const type = exerciseTypeById[spec.exerciseType]
  if (!type) {
    throw new Error(`TCM : type d’exercice inconnu « ${spec.exerciseType} »`)
  }
  const columns = spec.columns ?? type.preferredColumns ?? 2
  return {
    topic: type.topic,
    exerciseType: type.id,
    difficulty,
    count: spec.count,
    columns: Math.max(1, Math.min(3, columns)) as 1 | 2 | 3,
  }
}

/** Une page A4 = un exercice TCM (éventuellement plusieurs blocs). */
export function buildTcmTestPages(): PageConfig[] {
  return TCM_STEPS.map((step) => {
    const [first, ...rest] = step.blocks.map((b) => blockFromSpec(b))
    if (!first) throw new Error(`TCM : étape ${step.id} sans bloc`)
    return {
      domain: TCM_DOMAIN,
      ...first,
      extraBlocks: rest.length ? rest : undefined,
    }
  })
}

export function isTcmDomain(domain: Domain | undefined): boolean {
  return domain === TCM_DOMAIN
}
