import type { MathItem, PageConfig } from '@/math/types'
import { isVocabulaireType } from './types'

/** Placeholder déterministe (pas de tirage). */
export function tryGenerateVocabulaireBlock(
  config: PageConfig,
): { instruction: string; items: MathItem[] } | null {
  if (!isVocabulaireType(config.exerciseType)) return null
  return {
    instruction: 'Contenu pédagogique à venir.',
    items: [
      {
        layout: 'text',
        prompt: 'Le domaine Vocabulaire sera bientôt disponible.',
        answer: '',
      },
    ],
  }
}
