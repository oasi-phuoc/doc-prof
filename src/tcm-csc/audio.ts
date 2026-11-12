import type { MathItem, WorksheetPage } from '@/math/types'
import { concatPlaylistsWithGap } from '@/tcm-cfr/audio-nombres'
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

export function cscAudioGroups(sheets: WorksheetPage[]) {
  return [1, 2, 3].flatMap((number) => {
    const type = `tcm-csc-ex${String(number).padStart(2, '0')}`
    const parts = sheets.flatMap(sheet=>sheet.blocks.filter(block=>block.exerciseType===type).flatMap(block=>cscAudioPrompts(type,block.items) ?? []))
    return parts.length ? [{ number, parts, name: `TCM-CSC_EXERCICE-${String(number).padStart(2, '0')}_${['NOMBRES', 'CALCULS', 'ENTOURER'][number - 1]}.wav` }] : []
  })
}
export async function buildCscAudioZip(sheets: WorksheetPage[]): Promise<Blob> {
  const groups = cscAudioGroups(sheets)
  if (!groups.length) throw new Error('Aucun audio CSC n’est présent dans cette fiche.')
  const files = []
  for (const group of groups) files.push({ name: group.name, data: cscDeniseRecordingsReady() ? await renderCscDeniseAudio(planCscDeniseAudio(group.number, group.parts)) : await concatPlaylistsWithGap(group.parts) })
  return zipStoreBlob(files)
}
export async function downloadCscAudios(sheets: WorksheetPage[]) {
  const blob = await buildCscAudioZip(sheets), url = URL.createObjectURL(blob)
  try { const link = document.createElement('a'); link.href = url; link.download = 'TCM-CSC_AUDIOS.zip'; document.body.append(link); link.click(); link.remove() }
  finally { setTimeout(() => URL.revokeObjectURL(url), 10_000) }
}
