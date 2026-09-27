import type { MathItem } from '@/math/types'
import { defaultCalliText, parseCalliLines } from './defaults'
import {
  DEFAULT_CALLI_FONT,
  DEFAULT_CALLI_SIZE,
  calliFontById,
  calliSizeById,
  type CalliFontId,
  type CalliSizeId,
} from './fonts'

export type CalligraphieBatch = {
  items: MathItem[]
  instruction: string
  preferredColumns?: number
}

/** Capacité selon la taille (bande plus haute → moins d’entrées). */
function maxEntries(mode: 'same-line' | 'copy-below', sizeId: string): number {
  const size = calliSizeById(sizeId)
  if (mode === 'copy-below') {
    if (size.id === 'grand') return 3
    if (size.id === 'petit') return 5
    return 4
  }
  if (size.id === 'grand') return 8
  if (size.id === 'petit') return 12
  return 10
}

export function isCalligraphieType(typeId: string): boolean {
  return typeId.startsWith('calli-')
}

function isCopyBelowType(typeId: string): boolean {
  return typeId === 'calli-4-lignes' || typeId === 'calli-3-lignes'
}

export function tryGenerateCalligraphieBatch(
  typeId: string,
  calliText?: string,
  calliFont?: string,
  calliSize?: string,
): CalligraphieBatch | null {
  if (!isCalligraphieType(typeId)) return null

  const fontId = calliFontById(calliFont).id as CalliFontId
  const sizeId = calliSizeById(calliSize).id as CalliSizeId
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
            entries: entries.slice(0, maxEntries('copy-below', sizeId)),
            fontId: fontId ?? DEFAULT_CALLI_FONT,
            sizeId: sizeId ?? DEFAULT_CALLI_SIZE,
          },
        },
      ],
    }
  }

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
          entries: entries.slice(0, maxEntries('same-line', sizeId)),
          fontId: fontId ?? DEFAULT_CALLI_FONT,
          sizeId: sizeId ?? DEFAULT_CALLI_SIZE,
        },
      },
    ],
  }
}
