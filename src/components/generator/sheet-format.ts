import { isIndependentListProfile, liveEditorProfile, usesIndependentHalves } from './libre/profiles'
import { pageBlocks, setPageBlock } from '@/math/page-model'
import type { ExerciseBlock, PageConfig } from '@/math/types'
import { isLogistiqueDomain } from '@/logistique/catalog'

/** Format de la feuille imprimable. */
export type SheetFormat = 'a4-portrait' | 'a5-double-landscape'

export const SHEET_FORMAT_LABELS: Record<SheetFormat, string> = {
  'a4-portrait': 'Portrait A4',
  'a5-double-landscape': 'Paysage — double A5',
}

export function isA5DoubleFormat(format: SheetFormat | undefined): boolean {
  return format === 'a5-double-landscape'
}

/**
 * Prépare une PageConfig pour une moitié A5.
 * Les tirages utilisent la graine de leur moitié. Les fiches libres de
 * Logistique reproduisent leurs questions et leurs médias sur les deux moitiés.
 */
export function pageForA5Half(page: PageConfig, half: 'left' | 'right'): PageConfig {
  const blocks = pageBlocks(page)
  const logistics = isLogistiqueDomain(page.domain)
  let next = page
  blocks.forEach((block, index) => {
    const seed =
      half === 'right'
        ? (block.contentSeedTwin ?? block.contentSeed ?? 0)
        : (block.contentSeed ?? 0)
    const profile = liveEditorProfile(page.domain, block.exerciseType, 'a5-double-landscape')
    const independent = usesIndependentHalves(profile)
    /** Une référence a le même contenu dans les deux exemplaires. */
    const sharedReference = profile === 'theorie'
    const rightLibre = independent && half === 'right' ? block.a5RightLibre : undefined
    const keepCustomized = independent && half === 'left' && (isIndependentListProfile(profile)
      ? Boolean(block.libreItems?.length) : block.libreItems?.some(({ libreId }) => libreId))
    next = setPageBlock(next, index, {
      contentSeed: seed,
      calliText: undefined,
      gameEntries: undefined,
      gameText: undefined,
      gameSelectedIds: undefined,
      phraseItems: undefined,
      phraseInstruction: undefined,
      libreId: rightLibre?.id ?? (keepCustomized ? block.libreId : undefined),
      libreItems: rightLibre?.items ?? (keepCustomized || sharedReference || (logistics && !block.libreId) ? block.libreItems : undefined),
      libreInstruction: rightLibre?.instruction ?? (keepCustomized || sharedReference || (logistics && !block.libreId) ? block.libreInstruction : undefined),
    })
  })
  return next
}

/**
 * Prépare un refresh sur une moitié A5 sans faire bouger l’autre.
 * Si la jumelle n’existait pas encore, on fige d’abord le tirage courant
 * sur la moitié non ciblée.
 */
export function patchBlockSeedForHalf(
  block: ExerciseBlock,
  half: 'left' | 'right',
  nextSeed: number,
): Partial<ExerciseBlock> {
  const current = block.contentSeed ?? 0
  if (half === 'right') {
    return { contentSeedTwin: nextSeed }
  }
  if (block.contentSeedTwin == null) {
    return { contentSeed: nextSeed, contentSeedTwin: current }
  }
  return { contentSeed: nextSeed }
}
