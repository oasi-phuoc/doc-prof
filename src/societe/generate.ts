import type { MathItem, PageConfig } from '@/math/types'
import { SOCIETE_DOMAIN, SOCIETE_PLACEHOLDER } from './catalog'

export function tryGenerateSocieteBlock(
  config: PageConfig,
): { title: string; instruction: string; items: MathItem[] } | null {
  if (config.domain !== SOCIETE_DOMAIN) return null
  return {
    title: SOCIETE_PLACEHOLDER.label,
    instruction: SOCIETE_PLACEHOLDER.instruction,
    items: [{
      layout: 'text',
      prompt: SOCIETE_PLACEHOLDER.description,
      answer: '',
      noPoints: true,
    }],
  }
}
