import type { WorksheetPage } from '@/math/types'
import { concatPlaylistsWithGap } from '@/tcm-cfr/audio-nombres'
import { zipStoreBlob } from '@/lib/zip-store'

export function cscAudioGroups(sheets: WorksheetPage[]) {
  return [1, 2, 3].flatMap((number) => {
    const type = `tcm-csc-ex${String(number).padStart(2, '0')}`
    const parts = sheets.flatMap((sheet) => sheet.blocks.filter((block) => block.exerciseType === type).flatMap((block) => block.items.map((item) => item.audioParts ?? []).filter((parts) => parts.length)))
    return parts.length ? [{ number, parts, name: `TCM-CSC_EXERCICE-${String(number).padStart(2, '0')}_${['NOMBRES', 'CALCULS', 'ENTOURER'][number - 1]}.wav` }] : []
  })
}
export async function buildCscAudioZip(sheets: WorksheetPage[]): Promise<Blob> {
  const groups = cscAudioGroups(sheets)
  if (!groups.length) throw new Error('Aucun audio CSC n’est présent dans cette fiche.')
  const files = []
  for (const group of groups) files.push({ name: group.name, data: await concatPlaylistsWithGap(group.parts) })
  return zipStoreBlob(files)
}
export async function downloadCscAudios(sheets: WorksheetPage[]) {
  const blob = await buildCscAudioZip(sheets), url = URL.createObjectURL(blob)
  try { const link = document.createElement('a'); link.href = url; link.download = 'TCM-CSC_AUDIOS.zip'; document.body.append(link); link.click(); link.remove() }
  finally { setTimeout(() => URL.revokeObjectURL(url), 10_000) }
}
