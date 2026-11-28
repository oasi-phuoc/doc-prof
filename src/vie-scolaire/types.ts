import type { GrammarTheoryBlock } from '@/francais/grammar-theory'
import type { FicheQuestion } from '@/francais/fiches-communication'
import type { CompletionFiche } from '@/grammaire/exercises/completion-fiche'
import type { GrammarCoStatement } from '@/grammaire/exercises/co-true-false'

export const VIE_SCOLAIRE_DOMAIN = 'vie-scolaire' as const
export const VIE_SCOLAIRE_FIRST_TOPIC = 'vie-scolaire-reglement'

export type SchoolPicture = { src: string; alt: string; caption: string }
export type SchoolWord = { label: string; clue: string; image?: string; pending?: boolean }
export type SchoolAudio = {
  id: string
  label: string
  bankId: string
  src: string
  transcript: string
  questions: readonly FicheQuestion[]
  statements: readonly GrammarCoStatement[]
}

export type SchoolLesson = {
  id: string
  title: string
  objective: string
  situation: string
  pictures: readonly SchoolPicture[]
  steps: readonly string[]
  example: string | Extract<GrammarTheoryBlock, { kind: 'table' }>
  practice: { prompt: string; answer: string; explanation: string }
  words: readonly SchoolWord[]
  completion: readonly CompletionFiche[]
  read: { title: string; lines: readonly string[]; picture?: SchoolPicture; questions: readonly FicheQuestion[] }
  speak: { prompt: string; model: string; picture?: SchoolPicture }
  write: { prompt: string; model: string; picture?: SchoolPicture }
}

export function isVieScolaireType(typeId: string): boolean {
  return typeId.startsWith('vie-scolaire-')
}

export function isVieScolaireTheoryType(typeId: string): boolean {
  return isVieScolaireType(typeId) && typeId.endsWith('-theorie')
}
