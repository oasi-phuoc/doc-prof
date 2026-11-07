import type { TcfMotImage } from './types'
import { resolveGameImageSrc } from '@/jeux/image-resolve'

const blanks = () => /_{3,}(?:\s*\(\s*(\d+)\s*\))?/g

/** Restaure chaque mot à sa place, puis efface les choix pour recommencer. */
export function resetMotsATrouver(texte: string, mots: TcfMotImage[]): { texte: string; mots: TcfMotImage[] } {
  let index = 0
  return {
    texte: texte.replace(blanks(), (blank, n: string | undefined) => {
      const word = mots[n ? Number(n) - 1 : index]?.mot
      index++
      return word?.trim() ? word : blank
    }),
    mots: Array.from({ length: 5 }, () => ({ mot: '', image: '' })),
  }
}

/** Les numéros et les images suivent l’ordre des blancs, pas l’ordre des clics. */
export function markMotATrouver(texte: string, start: number, end: number, mots: TcfMotImage[]):
  { texte: string; mots: TcfMotImage[]; caret: number } | null {
  if (start < 0 || end > texte.length || start >= end) return null
  const raw = texte.slice(start, end)
  const selected = raw.replace(/^[\s.,;:!?«»"']+|[\s.,;:!?«»"']+$/g, '')
  if (!selected || /_{3,}/.test(selected)) return null
  const existing = [...texte.matchAll(blanks())]
  if (existing.length >= 5 || existing.some((match) => start < match.index! + match[0].length && end > match.index!)) return null
  const lead = raw.indexOf(selected)
  const begin = start + lead
  const stop = begin + selected.length
  const inserted = texte.slice(0, begin) + '_____ (0)' + texte.slice(stop)
  const nextMots: TcfMotImage[] = []
  let oldIndex = 0, cursor = 0, output = '', caret = 0
  for (const match of inserted.matchAll(blanks())) {
    output += inserted.slice(cursor, match.index)
    const isNew = match.index === begin
    const row = isNew ? { mot: selected, image: resolveGameImageSrc(selected) ?? '' }
      : mots[match[1] ? Number(match[1]) - 1 : oldIndex] ?? { mot: '', image: '' }
    if (!isNew) oldIndex++
    nextMots.push({ ...row })
    output += `_____ (${nextMots.length})`
    if (isNew) caret = output.length
    cursor = match.index! + match[0].length
  }
  output += inserted.slice(cursor)
  while (nextMots.length < 5) nextMots.push({ mot: '', image: '' })
  return { texte: output, mots: nextMots, caret }
}
