import type { MathItem } from '@/math/types'
import { defaultCalliText, parseCalliLines } from './defaults'

export type CalligraphieBatch = {
  items: MathItem[]
  instruction: string
  preferredColumns?: number
}

/** Capacité approximative pour rester sur une A4 (en-tête + pied). */
const MAX_SAME_LINE = 12
const MAX_COPY_BELOW = 5

export function isCalligraphieType(typeId: string): boolean {
  return typeId.startsWith('calli-')
}

export function tryGenerateCalligraphieBatch(
  typeId: string,
  calliText?: string,
): CalligraphieBatch | null {
  if (!isCalligraphieType(typeId)) return null

  const raw = parseCalliLines(calliText)
  const fallback = parseCalliLines(defaultCalliText(typeId))
  const entries = (raw.length > 0 ? raw : fallback).map((t) => t.slice(0, 80))

  if (typeId === 'calli-3-lignes') {
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
            ruleLines: 3,
            entries: entries.slice(0, MAX_COPY_BELOW),
          },
        },
      ],
    }
  }

  // calli-5-lignes (défaut)
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
          ruleLines: 5,
          entries: entries.slice(0, MAX_SAME_LINE),
        },
      },
    ],
  }
}
