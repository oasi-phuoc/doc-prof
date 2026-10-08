import type { MathItem, PageConfig } from '@/math/types'
import { isSocieteType } from './types'

/** Placeholder déterministe (pas de tirage). */
export function tryGenerateSocieteBlock(
  config: PageConfig,
): { instruction: string; items: MathItem[] } | null {
  if (!isSocieteType(config.exerciseType)) return null
  return {
    instruction: 'Contenu pédagogique à venir.',
    items: [
      {
        layout: 'text',
        prompt: 'Le domaine Société sera bientôt disponible.',
        answer: '',
      },
    ],
  }
}
