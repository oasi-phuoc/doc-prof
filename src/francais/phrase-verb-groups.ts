import type { PhraseVerbGroup } from '@/math/types'

/** Infinitives are classified independently of the historical storage bank. */
const SECOND_GROUP = new Set([
  'finir', 'choisir', 'remplir', 'réussir', 'nourrir', 'applaudir', 'réunir',
  'rafraîchir', 'salir', 'agrandir', 'assouplir', 'réfléchir', 'réjouir', 'dégourdir',
])

export function phraseVerbGroupOf(verb: string): Exclude<PhraseVerbGroup, 'libre' | 'mixte'> {
  const base = verb.replace(/^(?:se |s[’'])/, '')
  if (SECOND_GROUP.has(base)) return 'ir'
  return base.endsWith('er') && base !== 'aller' ? 'er' : 'autres'
}
