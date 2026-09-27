import type { MathItem } from '@/math/types'
import { defaultCalliText, parseCalliLines } from './defaults'

export type CalligraphieBatch = {
  items: MathItem[]
  instruction: string
  preferredColumns?: number
}

/** Capacité approximative pour rester sur une A4 (en-tête + pied). */
const MAX_SAME_LINE = 11
const MAX_COPY_BELOW = 5

export function isCalligraphieType(typeId: string): boolean {
  return typeId.startsWith('calli-')
}

function isCopyBelowType(typeId: string): boolean {
  return typeId === 'calli-4-lignes' || typeId === 'calli-3-lignes'
}

export function tryGenerateCalligraphieBatch(
  typeId: string,
  calliText?: string,
): CalligraphieBatch | null {
  if (!isCalligraphieType(typeId)) return null

  const raw = parseCalliLines(calliText)
  const fallback = parseCalliLines(defaultCalliText(typeId))
  const entries = (raw.length > 0 ? raw : fallback).map((t) => t.slice(0, 80))

  if (isCopyBelowType(typeId)) {
    return {
      instruction: 'Recopiez chaque phrase en écriture cursive.',
      preferredColumns: 1,
      items: [
        {
          layout: 'calligraphy',
          answer: entries.join(' / '),
          prompt: '',
          calligraphy: {
            mode: 'copy-below',
            ruleLines: 4,
            entries: entries.slice(0, MAX_COPY_BELOW),
          },
        },
      ],
    }
  }

  // calli-6-lignes (et ancien id calli-5-lignes)
  return {
    instruction: 'Recopiez chaque mot en écriture cursive sur la même ligne.',
    preferredColumns: 1,
    items: [
      {
        layout: 'calligraphy',
        answer: entries.join(' / '),
        prompt: '',
        calligraphy: {
          mode: 'same-line',
          ruleLines: 6,
          entries: entries.slice(0, MAX_SAME_LINE),
        },
      },
    ],
  }
}
