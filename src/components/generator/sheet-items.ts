import type { MathItem, WorksheetPage } from '@/math/types'
import type { TcfExercise } from '@/tcf/types'

export type SheetBlockItems = {
  items: MathItem[]
  instruction: string
}

/**
 * Items d’un exercice sur toutes les feuilles issues de la même page
 * (y compris les « suite » après un saut manuel).
 * Sans coupure, renvoie la feuille principale seulement.
 */
export function blockItemsForConfig(
  worksheets: readonly WorksheetPage[],
  configIndex: number,
  blockIndex: number,
): SheetBlockItems | null {
  const parts: Array<{ offset: number; items: MathItem[]; instruction: string; continuation: boolean }> = []
  worksheets.forEach((sheet, index) => {
    if ((sheet.configIndex ?? index) !== configIndex) return
    const block =
      sheet.blocks.find((entry, i) => (entry.sourceBlockIndex ?? i) === blockIndex) ??
      sheet.blocks[blockIndex]
    if (!block) return
    parts.push({
      offset: block.itemOffset ?? 0,
      items: block.items,
      instruction: block.instruction,
      continuation: Boolean(sheet.isContinuation) || (block.itemOffset ?? 0) > 0,
    })
  })
  if (parts.length === 0) return null
  const split = parts.some((part) => part.continuation)
  if (!split) {
    const main = parts[0]!
    return { items: main.items, instruction: main.instruction }
  }
  parts.sort((a, b) => a.offset - b.offset)
  // Graded CE repeats its support on continuation sheets. Numeric offsets alone
  // would overwrite the preceding question with that repeated support.
  if (parts.every(part=>part.items.every(item=>item.grammar?.unit.kind==='reading'))) {
    const seen=new Set<string>(),items:MathItem[]=[]
    for (const part of parts) for (const item of part.items) {
      const q=item.grammar!,p=q.readingPart
      const key=q.id+':'+(p?.kind==='question'?p.questionId:'support')
      if (seen.has(key)) continue
      seen.add(key);items.push(item)
    }
    return {items,instruction:parts.find(part=>part.instruction.trim())?.instruction??''}
  }
  const items: MathItem[] = []
  let instruction = parts[0]!.instruction
  for (const part of parts) {
    if (part.offset === 0 && part.instruction.trim()) instruction = part.instruction
    for (let i = 0; i < part.items.length; i++) {
      items[part.offset + i] = part.items[i]!
    }
  }
  return { items: items.filter((item) => item != null), instruction }
}

/** Exercice affiché (item support), y compris s’il est sur la première feuille d’une suite. */
export function tcfExerciseOnConfig(
  worksheets: readonly WorksheetPage[],
  configIndex: number,
): TcfExercise | undefined {
  for (let index = 0; index < worksheets.length; index++) {
    const sheet = worksheets[index]!
    if ((sheet.configIndex ?? index) !== configIndex) continue
    for (const block of sheet.blocks) {
      for (const item of block.items) {
        const tcf = item.tcf
        if (tcf?.kind === 'support') return tcf.exercise
      }
    }
  }
  return undefined
}
