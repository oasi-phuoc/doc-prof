import type { ExerciseType, Topic } from '@/math/types'
import { SCHOOL_LESSONS } from './lecons'
import { VIE_SCOLAIRE_DOMAIN, isVieScolaireType } from './types'

export const SCHOOL_KINDS = [
  ['theorie', 'Théorie', 'Lisez la fiche.'],
  ['lexique', 'Vocabulaire illustré', 'Lisez les mots et leur définition.'],
  ['pratique', 'Phrases à compléter', 'Complétez les phrases.'],
  ['ce', 'Compréhension écrite', 'Lisez le document. Répondez aux questions.'],
  ['co', 'Compréhension orale', 'Écoutez deux fois. Répondez aux questions.'],
  ['po', 'Production orale', 'Préparez vos idées. Jouez la situation à deux.'],
  ['pe', 'Production écrite', 'Écrivez le message demandé.'],
] as const

export type SchoolKind = typeof SCHOOL_KINDS[number][0]

export const SCHOOL_TOPICS: Topic[] = SCHOOL_LESSONS.map((lesson) => ({
  id: `vie-scolaire-${lesson.id}`,
  label: `${lesson.level} · ${lesson.title}`,
  domain: VIE_SCOLAIRE_DOMAIN,
}))

export const SCHOOL_EXERCISE_TYPES: ExerciseType[] = SCHOOL_LESSONS.flatMap((lesson) =>
  SCHOOL_KINDS.map(([kind, label, instruction]) => ({
    id: `vie-scolaire-${lesson.id}-${kind}`,
    topic: `vie-scolaire-${lesson.id}`,
    label,
    description: lesson.objective,
    instruction,
    visual: 'texte',
    preferredColumns: kind === 'lexique' ? 2 : 1,
    preferredCount: kind === 'lexique' ? Math.min(lesson.words.length, 6) : kind === 'pratique' ? lesson.completion.length : 1,
    maxCount: kind === 'lexique' ? Math.min(lesson.words.length, 6) : kind === 'pratique' ? lesson.completion.length : 1,
    supportsNumberRange: false,
  })),
)

export function isSchoolKind(typeId: string, kind: SchoolKind): boolean {
  return isVieScolaireType(typeId) && typeId.endsWith(`-${kind}`)
}
