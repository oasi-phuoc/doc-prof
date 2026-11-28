import type { FicheQuestion } from '@/francais/fiches-communication'
import type { CompletionFiche } from '@/grammaire/exercises/completion-fiche'
import illustrations from './illustrations.json'
import type { SchoolPicture, SchoolWord } from './types'

const visuals: Readonly<Record<string, { alt: string; caption?: string; hideInRecall?: boolean }>> = illustrations

export function picture(path: string, caption: string, description?: string): SchoolPicture {
  const visual = visuals[path]
  return {
    src: `/lib/images/vie-scolaire/${path}.webp`,
    caption: visual?.caption ?? caption,
    alt: visual?.alt ?? description ?? `Illustration à ajouter. ${caption}`,
    provisional: !visual && !description,
    hideInRecall: visual?.hideInRecall,
  }
}
export function word(label: string, clue: string, image?: SchoolPicture, pending = false): SchoolWord {
  return { label, clue, image: image?.src, pending: image?.hideInRecall || (pending && (image?.provisional ?? true)) }
}
export function choice(prompt: string, answer: string, first: string, second: string, image?: SchoolPicture): FicheQuestion {
  return { prompt, answer, options: [first, answer, second], image: image?.src }
}
export function blank(prompt: string, answer: string, first: string, second: string, explanation: string): CompletionFiche {
  return { prompt, answer, distractors: [first, second], explanation }
}
