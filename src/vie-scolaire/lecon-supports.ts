import type { FicheQuestion } from '@/francais/fiches-communication'
import type { CompletionFiche } from '@/grammaire/exercises/completion-fiche'
import type { SchoolPicture, SchoolWord } from './types'

export function picture(path: string, caption: string, description?: string): SchoolPicture {
  return { src: `/lib/images/vie-scolaire/${path}.webp`, caption, alt: description ?? `Illustration à ajouter. ${caption}` }
}
export function word(label: string, clue: string, image?: SchoolPicture, pending = false): SchoolWord {
  return { label, clue, image: image?.src, pending }
}
export function choice(prompt: string, answer: string, first: string, second: string, image?: SchoolPicture): FicheQuestion {
  return { prompt, answer, options: [first, answer, second], image: image?.src }
}
export function blank(prompt: string, answer: string, first: string, second: string, explanation: string): CompletionFiche {
  return { prompt, answer, distractors: [first, second], explanation }
}

