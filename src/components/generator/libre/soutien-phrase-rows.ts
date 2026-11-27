import type { MathItem } from '@/math/types'

export function countSoundRows(item: MathItem) {
  return item.countSoundItems ?? []
}

export function replaceCountSoundRows(item: MathItem, rows: NonNullable<MathItem['countSoundItems']>): MathItem {
  return { ...item, countSoundItems: rows, answer: rows.map(({ count }) => String(count)).join(' · ') }
}

export function determinantRows(item: MathItem) {
  return item.determinantFills ?? []
}

export function replaceDeterminantRows(item: MathItem, rows: NonNullable<MathItem['determinantFills']>): MathItem {
  return {
    ...item, determinantFills: rows, answer: rows.map(({ sentence }) => sentence).join(' · '),
    libreCorrectionPending: rows.some(({ correctionPending }) => correctionPending) || undefined,
  }
}

export function withDeterminantParts(parts: NonNullable<MathItem['determinantFills']>[number]['parts']) {
  return { parts, sentence: parts.map((part) => 'blank' in part ? part.blank : part.t).join(''), correctionPending: true as const }
}
