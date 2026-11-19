import type { MathItem, WorksheetPage } from '@/math/types'
import { concatPlaylistsWithGap, spokenJunctionSeconds } from '@/tcm-cfr/audio-nombres'
import { zipStoreBlob } from '@/lib/zip-store'
import { recalculateCsc } from './recalculate'
import { cscNumberParts } from './items'
import { cscDeniseRecordingsReady } from './denise-recordings'
import { planCscDeniseAudio, renderCscDeniseAudio } from './denise-audio'

/** One prompt is one number or one complete operation, never its fragments. */
export function cscAudioPrompts(type: string, items: readonly MathItem[]): string[][] | undefined {
  if (!/^tcm-csc-ex0[123]$/.test(type)) return undefined
  if (type.endsWith('03')) return items.flatMap(item=>{
    if (item.cscTask?.kind!=='number-grid') throw new Error('Grille de nombres invalide.')
    const canonical=recalculateCsc(item,type)
    if (!canonical || canonical.libreError) throw new Error('Les nombres à entendre doivent être validés.')
    return item.cscTask.heard.map(cscNumberParts)
  })
  return items.map(item=>{
    if (type.endsWith('01')) {
      const value=Number(item.answer)
      if (!Number.isInteger(value) || value<1 || value>100) throw new Error('Nombre entendu invalide.')
      return cscNumberParts(value)
    }
    if (item.cscTask?.kind!=='calculation-audio') throw new Error('Calcul oral CSC : les deux nombres et le signe sont nécessaires.')
    const canonical=recalculateCsc(item,type)
    if (!canonical || canonical.libreError) throw new Error('Calcul oral CSC invalide : vérifiez les deux nombres et le signe.')
    return canonical.audioParts ?? []
  })
}

const CSC_LISTEN_FILES = [
  { type: 3, sheet: 1, slug: 'ENTOURER' },
  { type: 1, sheet: 2, slug: 'NOMBRES' },
  { type: 2, sheet: 3, slug: 'CALCULS' },
] as const

export function cscAudioGroups(sheets: WorksheetPage[]) {
  return CSC_LISTEN_FILES.flatMap(({ type, sheet, slug }) => {
    const typeId = `tcm-csc-ex${String(type).padStart(2, '0')}`
    const blocks = sheets.flatMap(sheetPage => sheetPage.blocks.filter(block => block.exerciseType === typeId))
    const parts = blocks.flatMap(block => cscAudioPrompts(typeId, block.items) ?? [])
    const rate = blocks.find(block => block.deniseRate === '-35%' || block.deniseRate === '-50%' || block.deniseRate === '-25%')?.deniseRate
    return parts.length ? [{ number: sheet, type, parts, rate, name: `TCM-CSC_EXERCICE-${String(sheet).padStart(2, '0')}_${slug}.wav` }] : []
  })
}
export async function buildCscAudioZip(sheets: WorksheetPage[], options: { signal?: AbortSignal; onProgress?: (done: number, total: number) => void } = {}): Promise<Blob> {
  const groups = cscAudioGroups(sheets)
  if (!groups.length) throw new Error('Aucun audio CSC n’est présent dans cette fiche.')
  const files = []
  for (const group of groups) {
    const groupOptions = { ...options, onProgress: (done: number, total: number) => options.onProgress?.(files.length + done / total, groups.length) }
    files.push({ name: group.name, data: cscDeniseRecordingsReady() ? await renderCscDeniseAudio(planCscDeniseAudio(group.type, group.parts, group.rate), groupOptions) : await concatPlaylistsWithGap(group.parts, undefined, { ...groupOptions, trimJunctionSeconds: spokenJunctionSeconds(group.parts.flat()) }) })
  }
  return zipStoreBlob(files, undefined, options.signal)
}
export async function downloadCscAudios(sheets: WorksheetPage[], options: { signal?: AbortSignal; onProgress?: (done: number, total: number) => void } = {}) {
  const blob = await buildCscAudioZip(sheets, options)
  options.signal?.throwIfAborted()
  const url = URL.createObjectURL(blob)
  try { const link = document.createElement('a'); link.href = url; link.download = 'TCM-CSC_AUDIOS.zip'; document.body.append(link); link.click(); link.remove() }
  finally { setTimeout(() => URL.revokeObjectURL(url), 10_000) }
}
