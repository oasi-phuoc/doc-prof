import type { MathItem, WorksheetPage } from '@/math/types'
import { headingForSlice } from '@/math/page-break-heading'
import { ceArtFor } from './ce-art'
import { isAssociationAnnonce } from './association-documents'

/** Même coupure que le bouton Page avant la première question ; false l’annule. */
export function paginateCePosters(sheet: WorksheetPage): WorksheetPage[] | null {
  const artworkOf = (item: MathItem | undefined) => {
    const tcf = item?.tcf
    return tcf?.kind === 'support' && tcf.ceFormat === 'image' && tcf.exercise.competence === 'CE' ? ceArtFor(tcf.exercise) : undefined
  }
  if (sheet.domain !== 'tcf-csc' || !sheet.blocks.some(block => artworkOf(block.items[0]))) return null
  const pages: WorksheetPage[] = []
  for (const [sourceIndex, block] of sheet.blocks.entries()) {
    const support = block.items[0], tcf = support?.tcf, artwork = artworkOf(support)
    let fullItems = block.items
    if (artwork && tcf?.kind === 'support' && tcf.exercise.type_exercice === 'annonce' && isAssociationAnnonce(tcf.exercise)) {
      fullItems = [{ ...support, noPoints: true, points: 0 }, { ...support, tcf: { kind: 'ce_association_answers', exercise: tcf.exercise } }]
    }
    const breaks = Array.from({ length: fullItems.length }, (_, i) => block.tcfPageBreakAfter?.[i] ?? Boolean(artwork && i === 0))
    let start = 0
    for (let end = 0; end < fullItems.length; end++) {
      if (!breaks[end] && end < fullItems.length - 1) continue
      const items = fullItems.slice(start, end + 1)
      const poster = Boolean(artwork && start === 0 && items.length === 1)
      const next = { ...block, ...headingForSlice(block, start, fullItems), items, itemOffset: start, sourceBlockIndex: block.sourceBlockIndex ?? sourceIndex, tcfPageBreakAfter: breaks }
      pages.push({ ...sheet, blocks: [next], items, cePosterSheet: poster, cePosterLandscape: Boolean(poster && artwork && artwork.width > artwork.height), isContinuation: pages.length > 0 })
      start = end + 1
    }
  }
  return pages
}
