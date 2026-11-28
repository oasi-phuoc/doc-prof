import type { MathItem, WorksheetPage } from '@/math/types'
import { headingForSlice } from '@/math/page-break-heading'
import { ceArtFor } from './ce-art'
import { isAssociationAnnonce } from './association-documents'

/** Séparer par défaut le document illustré de ses questions et conserver les coupures manuelles. */
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
    const offset = block.itemOffset ?? 0
    const breaks = Array.from(
      { length: Math.max(offset + fullItems.length, block.tcfPageBreakAfter?.length ?? 0) },
      (_, i) => block.tcfPageBreakAfter?.[i] ?? (i === 0 && artwork != null && fullItems.length > 1),
    )
    let start = 0
    for (let end = 0; end < fullItems.length; end++) {
      if (!breaks[offset + end] && end < fullItems.length - 1) continue
      const items = fullItems.slice(start, end + 1)
      const itemOffset = offset + start
      const dedicatedArtwork = start === 0 && end === 0 ? artwork : undefined
      const next = {
        ...block,
        ...headingForSlice(block, itemOffset, fullItems),
        ...(itemOffset === 0 && block.pointsWeights && !artwork ? { pointsWeights: block.pointsWeights } : {}),
        items,
        itemOffset,
        sourceBlockIndex: block.sourceBlockIndex ?? sourceIndex,
        tcfPageBreakAfter: breaks,
      }
      pages.push({
        ...sheet,
        blocks: [next],
        items,
        isContinuation: Boolean(sheet.isContinuation) || pages.length > 0,
        ...(dedicatedArtwork ? {
          cePosterSheet: true,
          cePosterLandscape: dedicatedArtwork.width > dedicatedArtwork.height,
        } : {}),
      })
      start = end + 1
    }
  }
  return pages
}
