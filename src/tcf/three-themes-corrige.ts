import type { WorksheetPage } from '@/math/types'
import type { TcfPoTroisThemes } from './types'

/** Utilise les thèmes réellement tirés, dans le même ordre que les images. */
export function threeThemesOf(page: WorksheetPage | undefined): TcfPoTroisThemes[] {
  if (!page) return []
  const items = page.blocks?.length ? page.blocks.flatMap((block) => block.items) : page.items
  return items.flatMap((item) => item.tcf?.kind === 'support' && item.tcf.exercise.type_exercice === 'trois_themes'
    ? [item.tcf.exercise]
    : [])
}
