import type { GrammarTheoryBlock } from '@/francais/grammar-theory'
import type { TcfExercise } from '@/tcf/types'

export type SanteLevel = 'A1' | 'A2' | 'B1'

export type SanteActivity = {
  id: string
  topic: string
  label: string
  level: SanteLevel
  instruction?: string
  sourceId?: string
  questionIndexes?: readonly number[]
  grammarCoSource?: 'medecin'
  theory?: GrammarTheoryBlock[]
  exercise?: TcfExercise
}

/** Type d’exercice du domaine Sciences et santé. */
export function isSanteType(typeId: string): boolean {
  return typeId.startsWith('sante-')
}
