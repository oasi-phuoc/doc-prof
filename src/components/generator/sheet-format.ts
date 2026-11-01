import { pageBlocks, setPageBlock } from '@/math/page-model'
import type { ExerciseBlock, PageConfig } from '@/math/types'

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
 * Chaque moitié tire depuis sa propre graine ; le contenu figé partagé
 * (mode libre) est ignoré pour que le refresh d’un côté n’écrase pas l’autre.
 */
export function pageForA5Half(page: PageConfig, half: 'left' | 'right'): PageConfig {
  const blocks = pageBlocks(page)
  let next = page
  blocks.forEach((block, index) => {
    const seed =
      half === 'right'
        ? (block.contentSeedTwin ?? block.contentSeed ?? 0)
        : (block.contentSeed ?? 0)
    next = setPageBlock(next, index, {
      contentSeed: seed,
      calliText: undefined,
      gameEntries: undefined,
      gameText: undefined,
      gameSelectedIds: undefined,
      phraseItems: undefined,
      phraseInstruction: undefined,
      libreItems: undefined,
      libreInstruction: undefined,
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
