import type { MathItem, WorksheetBlock, WorksheetPage } from '@/math/types'
import { headingForSlice } from '@/math/page-break-heading'
import { parseAssociationDocuments } from './association-documents'
import { ceIllustratedPassages } from './ce-illustrations'

/** Les affiches occupent leur propre feuille ; les questions gardent leurs index d’origine. */
export function paginateCePosters(sheet: WorksheetPage): WorksheetPage[] | null {
  if (sheet.domain !== 'tcf-csc' || !sheet.blocks.some((block) => block.items.some((item) => item.tcf?.kind === 'support' && item.tcf.ceFormat === 'image'))) return null
  const pages: WorksheetPage[] = []
  const push = (block: WorksheetBlock, items: MathItem[], offset: number, sourceIndex: number) => {
    const next = { ...block, ...headingForSlice(block, offset, block.items), items, itemOffset: offset, sourceBlockIndex: block.sourceBlockIndex ?? sourceIndex }
    pages.push({ ...sheet, blocks: [next], items, isContinuation: pages.length > 0 })
  }
  for (const [sourceIndex, block] of sheet.blocks.entries()) {
    const support = block.items[0]
    const tcf = support?.tcf
    if (tcf?.kind !== 'support' || tcf.ceFormat !== 'image' || tcf.exercise.competence !== 'CE'
      || (tcf.exercise.type_exercice === 'annonce' && parseAssociationDocuments(tcf.exercise.support.texte))) {
      push(block, block.items, 0, sourceIndex)
      continue
    }
    const chunks = ceIllustratedPassages(tcf.exercise.support.texte, '', 160).map((passage) => passage.text)
    const texts: string[] = []
    for (const chunk of chunks) {
      if (!texts.length || texts[texts.length - 1].length + chunk.length > 420) texts.push(chunk)
      else texts[texts.length - 1] += `\n\n${chunk}`
    }
    if (!texts.length) texts.push(tcf.exercise.support.texte)
    texts.forEach((text, i) => push(block, [{ ...support, tcf: { ...tcf, cePosterText: text, cePosterPart: { index: i + 1, total: texts.length } } }], i === 0 ? 0 : 1, sourceIndex))
    let items: MathItem[] = [], offset = 1
    for (let i = 1; i < block.items.length; i++) {
      items.push(block.items[i])
      if (items.length >= 3 || block.tcfPageBreakAfter?.[i] || i === block.items.length - 1) {
        push(block, items, offset, sourceIndex)
        offset = i + 1
        items = []
      }
    }
  }
  return pages
}
