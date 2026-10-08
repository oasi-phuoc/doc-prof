import type { MathItem, PageConfig } from '@/math/types'
import { isSanteType } from './types'

/** Placeholder déterministe (pas de tirage). */
export function tryGenerateSanteBlock(
  config: PageConfig,
): { instruction: string; items: MathItem[] } | null {
  if (!isSanteType(config.exerciseType)) return null
  return {
    instruction: 'Contenu pédagogique à venir.',
    items: [
      {
        layout: 'text',
        prompt: 'Le domaine Sciences et santé sera bientôt disponible.',
        answer: '',
      },
    ],
  }
}
