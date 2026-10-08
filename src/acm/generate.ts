import type { MathItem, PageConfig } from '@/math/types'
import { isAcmType } from './types'

/** Placeholder déterministe (pas de tirage). */
export function tryGenerateAcmBlock(
  config: PageConfig,
): { instruction: string; items: MathItem[] } | null {
  if (!isAcmType(config.exerciseType)) return null
  return {
    instruction: 'Contenu pédagogique à venir.',
    items: [
      {
        layout: 'text',
        prompt: 'Le domaine Activités créatives et manuelles sera bientôt disponible.',
        answer: '',
      },
    ],
  }
}
