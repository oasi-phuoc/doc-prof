import { isIndependentListProfile, liveEditorProfile, usesIndependentHalves } from './libre/profiles'
import { pageBlocks, setPageBlock } from '@/math/page-model'
import type { ExerciseBlock, PageConfig, WorksheetPage } from '@/math/types'
import { isLogistiqueDomain } from '@/logistique/catalog'
import { isGrammaireTheoryType } from '@/grammaire/types'

/** Format de la feuille imprimable. */
export type SheetFormat = 'a4-portrait' | 'a5-double-landscape'

export const SHEET_FORMAT_LABELS: Record<SheetFormat, string> = {
  'a4-portrait': 'Portrait A4',
  'a5-double-landscape': 'Paysage — double A5',
}

export function isA5DoubleFormat(format: SheetFormat | undefined): boolean {
  return format === 'a5-double-landscape'
}

export type A5WorksheetPair = { configIndex: number; left?: WorksheetPage; right?: WorksheetPage }

export function pairA5Worksheets(left: WorksheetPage[], right: WorksheetPage[]): A5WorksheetPair[] {
  const groups = new Map<number, { left: WorksheetPage[]; right: WorksheetPage[] }>()
  function add(sheets: WorksheetPage[], side: 'left' | 'right') {
    sheets.forEach((sheet, index) => {
      const config = sheet.configIndex ?? index
      const group = groups.get(config) ?? { left: [], right: [] }
      group[side].push(sheet)
      groups.set(config, group)
    })
  }
  add(left, 'left')
  add(right, 'right')
  return [...groups].sort(([a], [b]) => a - b).flatMap(([configIndex, group]) =>
    Array.from({ length: Math.max(group.left.length, group.right.length) }, (_, index) => ({
      configIndex, left: group.left[index], right: group.right[index],
    })))
}

/**
 * Prépare une PageConfig pour une moitié A5.
 * Les tirages utilisent la graine de leur moitié. Les fiches libres de
 * Logistique reproduisent leurs questions et leurs médias sur les deux moitiés.
 */
export function pageForA5Half(page: PageConfig, half: 'left' | 'right'): PageConfig {
  const blocks = pageBlocks(page)
  const logistics = isLogistiqueDomain(page.domain)
  let next: PageConfig = blocks.some(block => isGrammaireTheoryType(block.exerciseType))
    ? { ...page, grammarTheoryPaper: 'a5' }
    : page
  blocks.forEach((block, index) => {
    const profile = liveEditorProfile(page.domain, block.exerciseType, 'a5-double-landscape', block.grammarPresentation)
    // Les deux exemplaires d’un document grammatical personnalisé utilisent sa sélection enregistrée.
    const useTwinSeed = half === 'right' && !(profile === 'grammaire-graduee' && block.grammarSnapshot?.editedInLibre)
    const seed = (useTwinSeed ? block.contentSeedTwin : undefined) ?? block.contentSeed ?? 0
    const independent = usesIndependentHalves(profile)
    /** Une référence a le même contenu dans les deux exemplaires. */
    const sharedReference = profile === 'theorie'
    const sharedPhrase = profile === 'phrase' && block.verbGroup === 'libre'
    const sharedLegacyQuestions = logistics && !block.libreId
    const rightLibre = independent && half === 'right' ? block.a5RightLibre : undefined
    const keepCustomized = independent && half === 'left' && (isIndependentListProfile(profile)
      ? Boolean(block.libreItems?.length) : block.libreItems?.some(({ libreId }) => libreId))
    next = setPageBlock(next, index, {
      contentSeed: seed,
      calliText: undefined,
      gameEntries: undefined,
      gameText: undefined,
      gameSelectedIds: undefined,
      phraseItems: sharedPhrase ? block.phraseItems : undefined,
      phraseInstruction: sharedPhrase ? block.phraseInstruction : undefined,
      libreId: rightLibre?.id ?? (keepCustomized ? block.libreId : undefined),
      libreItems: rightLibre?.items ?? (keepCustomized || sharedReference || sharedLegacyQuestions ? block.libreItems : undefined),
      libreInstruction: rightLibre?.instruction ?? (keepCustomized || sharedReference || sharedLegacyQuestions ? block.libreInstruction : undefined),
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
