import type { ExerciseType } from '@/math/types'
import type { TcfNiveau } from './types'

type ComprehensionTask = {
  competence: 'CO' | 'CE'
  placementLevel: TpfComprehensionLevel
  ids: readonly string[]
  questionPoints: readonly number[]
}

type ProductionTask = {
  competence: 'PE' | 'PO'
  points: number
}

type PlacementTask = (ComprehensionTask | ProductionTask) & {
  typeId: string
  label: string
  niveau: TcfNiveau
  instruction: string
}

const UNDERSTANDING_LEVELS = [
  {
    suffix: 'a1',
    label: 'A1',
    niveau: 'A0-A1',
    questionPoints: [1, 1, 1, 1, 1],
    co: ['tcf-reussir-delf-a1-27-01', 'tcf-ss-a1-s24-co-3', 'tcf-ss-a1-s44-co-1'],
    ce: ['tcf-a1-tpa-ce-1', 'delf-a1v-ce-006', 'delf-a1s-ce-004'],
  },
  {
    suffix: 'a2-1',
    label: 'A2.1',
    niveau: 'A1-A2',
    questionPoints: [1, 1, 1, 1, 2],
    co: ['tcf-a2j-s1-co-3', 'tcf-ss-a2-s14-co-2', 'tcf-delf-actif-a2-021-01'],
    ce: ['tcf-a2-sa-ce-2', 'delf-a2j-ce-037', 'delf-a2r-ce-046'],
  },
  {
    suffix: 'a2-2',
    label: 'A2.2',
    niveau: 'A1-A2',
    questionPoints: [1, 1, 1, 2, 2],
    co: ['tcf-ss-a2-s38-co-2', 'tcf-ss-a2-s25-co-4', 'tcf-ss-a2-s25-co-3'],
    ce: ['tcf-a2p-s1-ce-4', 'delf-a2j-ce-050', 'delf-a2r-ce-024'],
  },
  {
    suffix: 'b1',
    label: 'B1',
    niveau: 'A2-B1',
    questionPoints: [1, 1, 1, 2, 2],
    co: ['tcf-delf-actif-b1-034-01', 'tcf-ss-b1-s4-co-2', 'tcf-ss-b1-s1-co-4'],
    ce: ['tcf-b1-ce-ados-internet', 'tcf-b1-ce-ateliers-citoyens', 'tcf-b1-ce-candidature-hotel'],
  },
] as const

export type TpfComprehensionLevel = (typeof UNDERSTANDING_LEVELS)[number]['label']

function comprehensionTasks(competence: 'CO' | 'CE'): PlacementTask[] {
  return UNDERSTANDING_LEVELS.map(({ suffix, label, niveau, co, ce, questionPoints }) => ({
    typeId: `tpf-${competence.toLowerCase()}-${suffix}`,
    competence,
    label: `${competence} · ${label}`,
    placementLevel: label,
    niveau,
    ids: competence === 'CO' ? co : ce,
    instruction: competence === 'CO'
      ? 'Écoutez le document, puis répondez aux questions.'
      : 'Lisez le document, puis répondez aux questions.',
    questionPoints,
  }))
}

export const TPF_PLACEMENT_TASKS: readonly PlacementTask[] = [
  ...comprehensionTasks('CO'),
  ...comprehensionTasks('CE'),
  { typeId: 'tpf-pe-formulaire', competence: 'PE', label: 'Formulaire', niveau: 'A0-A1', points: 5, instruction: 'Lisez la situation et complétez le formulaire.' },
  { typeId: 'tpf-pe-texte-court', competence: 'PE', label: 'Texte court · 40 à 50 mots', niveau: 'A1-A2', points: 8, instruction: 'Écrivez de 40 à 50 mots.' },
  { typeId: 'tpf-pe-redaction', competence: 'PE', label: 'Rédaction · 60 à 80 mots', niveau: 'A2-B1', points: 12, instruction: 'Rédigez de 60 à 80 mots.' },
  { typeId: 'tpf-po-entretien', competence: 'PO', label: 'Entretien dirigé', niveau: 'A0-A1', points: 5, instruction: 'Répondez aux questions de l’examinateur et parlez de vous.' },
  { typeId: 'tpf-po-lecture', competence: 'PO', label: 'Lecture à voix haute', niveau: 'A2-B1', points: 4, instruction: 'Lisez le texte à voix haute, du début à la fin.' },
  { typeId: 'tpf-po-trois-themes', competence: 'PO', label: 'Questions sur trois thèmes', niveau: 'A1-A2', points: 5, instruction: 'Posez une question à l’examinateur sur chacun des trois thèmes.' },
  { typeId: 'tpf-po-argumentation', competence: 'PO', label: 'Argumentation', niveau: 'A2-B1', points: 5, instruction: 'Dites si vous êtes pour ou contre. Justifiez votre avis avec deux raisons et donnez un exemple concret.' },
  { typeId: 'tpf-po-description-dialogue', competence: 'PO', label: 'Description d’image et dialogue', niveau: 'A1-A2', points: 6, instruction: 'Décrivez l’image, puis jouez la scène avec l’examinateur.' },
]

const taskById = new Map(TPF_PLACEMENT_TASKS.map((task) => [task.typeId, task]))

export function tpfPlacementTask(typeId: string): PlacementTask | undefined {
  return taskById.get(typeId)
}

export const TPF_PLACEMENT_TYPES: ExerciseType[] = TPF_PLACEMENT_TASKS.map((task) => ({
  id: task.typeId,
  topic: `tcf-${task.competence.toLowerCase()}`,
  label: task.label,
  instruction: task.instruction,
  description: task.label,
  visual: 'texte',
  preferredColumns: 1,
}))
