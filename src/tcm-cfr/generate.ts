import type { MathItem, PageConfig } from '@/math/types'
import { isTcmCfrType } from './types'

/** Placeholder déterministe (pas de tirage). */
export function tryGenerateTcmCfrBlock(
  config: PageConfig,
): { instruction: string; items: MathItem[] } | null {
  if (!isTcmCfrType(config.exerciseType)) return null
  return {
    instruction: 'Contenu pédagogique à venir.',
    items: [
      {
        layout: 'text',
        prompt: 'Le domaine TCM CFR sera bientôt disponible.',
        answer: '',
      },
    ],
  }
}
