import type { MathItem, PageConfig } from '@/math/types'
import { isTcmCscType } from './types'

/** Placeholder déterministe (pas de tirage). */
export function tryGenerateTcmCscBlock(
  config: PageConfig,
): { instruction: string; items: MathItem[] } | null {
  if (!isTcmCscType(config.exerciseType)) return null
  return {
    instruction: 'Contenu pédagogique à venir.',
    items: [
      {
        layout: 'text',
        prompt: 'Le domaine TCM CSC sera bientôt disponible.',
        answer: '',
      },
    ],
  }
}
