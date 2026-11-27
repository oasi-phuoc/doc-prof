import type { MathItem } from '@/math/types'

export type SyllableRow = {
  word: string
  parts: string[]
  hitIndex?: number
  hitIndices?: number[]
  imageSrc?: string
  audioSrc?: string
}

export function syllableRows(item: MathItem): SyllableRow[] {
  return item.layout === 'syllable-pronounce' ? item.syllablePronounceRows ?? [] : item.syllableSoundItems ?? []
}

export function replaceSyllableRows(item: MathItem, rows: SyllableRow[]): MathItem {
  if (item.layout === 'syllable-pronounce') {
    return { ...item, syllablePronounceRows: rows.map(({ word, parts, audioSrc }, index) => ({ word, parts, audioSrc, index: index + 1 })),
      answer: rows.map((row, index) => `${index + 1}. ${row.parts.join('-')}`).join(' · ') }
  }
  return { ...item, syllableSoundItems: rows.map((row) => ({ ...row, hitIndex: row.hitIndex ?? -1 })),
    answer: rows.map(({ word, parts, hitIndices }) => hitIndices?.length
      ? `${word} → ${hitIndices.map((index) => parts[index]).join(' · ')}` : word).join(' · ') }
}
