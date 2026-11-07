import type { WorksheetPage } from '@/math/types'
import { blockPointsTotal } from '@/tpm/test'
import { tcfSlotByTypeId, tcfTypeByTypeId } from './catalog'
import type { TcfCompetence } from './types'

export type TcfCompetencePoints = Record<TcfCompetence, number>
const empty = (): TcfCompetencePoints => ({ CE: 0, CO: 0, PE: 0, PO: 0 })

/** Additionne chaque item noté une fois, y compris après les sauts de page. */
export function withTcfInformationTotals(sheets: WorksheetPage[], defaultPoints = 1): WorksheetPage[] {
  const totals = new Map<string, TcfCompetencePoints>()
  for (const sheet of sheets) {
    if (sheet.domain !== 'tcf-csc' && sheet.domain !== 'tcf-cfr') continue
    const points = totals.get(sheet.domain) ?? empty()
    totals.set(sheet.domain, points)
    for (const block of sheet.blocks) {
      const competence = (tcfSlotByTypeId[block.exerciseType] ?? tcfTypeByTypeId[block.exerciseType])?.competence
      if (!competence) continue
      points[competence] += blockPointsTotal(block.items, block.pointsPerQuestion ?? defaultPoints)
    }
  }
  return sheets.map((sheet) => {
    const points = totals.get(sheet.domain)
    if (!points || !sheet.items.some((item) => item.tcf?.kind === 'informations')) return sheet
    const rounded = Object.fromEntries(Object.entries(points).map(([key, value]) => [key, Math.round(value * 100) / 100])) as TcfCompetencePoints
    const blocks = sheet.blocks.map((block) => ({ ...block, items: block.items.map((item) =>
      item.tcf?.kind === 'informations' ? { ...item, tcf: { ...item.tcf, pointsByCompetence: rounded } } : item,
    ) }))
    return { ...sheet, blocks, items: blocks.flatMap((block) => block.items) }
  })
}
