import type { MathItem, PageConfig } from '@/math/types'
import { getAcmActivity } from './catalog'

export function tryGenerateAcmBlock(
  config: PageConfig,
): { title: string; instruction: string; items: MathItem[] } | null {
  const activity = getAcmActivity(config.exerciseType)
  if (!activity) return null

  return {
    title: activity.title,
    instruction: activity.description,
    items: [{
      layout: 'acm',
      acm: activity,
      answer: '',
      hideItemNumber: true,
      noPoints: true,
    }],
  }
}
