import { displayVocabLabel } from '@/francais/display-vocab-label'
import type { MathItem } from '@/math/types'
import { shuffle, type Rng } from '@/math/rng'
import { soutienAudioFor } from './audio'
import type { SoutienVowelBank } from './banks'
import type { SoutienGenerateOptions } from './generate-options'
import { soutienImageFor } from './images'
import { lessonWordsBySound, lessonWordsForText, wordHasLessonLetter } from './phoneme'
import { syllabifyFr } from './syllabify-fr'
import { type1WordPool } from './type1-words'
import { AUDIO_ORDER_CLIPS } from './gen-kind-helpers'

export type AudioOrderKind = 'associer-syllabe' | 'associer-audio' | 'associer-image'
export type AudioOrder = NonNullable<MathItem['audioOrder']>
export type AudioOrderChoice = { word: string; audioSrc: string; imageSrc?: string }

export function audioOrderKind(kind: string | undefined): kind is AudioOrderKind {
  return kind === 'associer-syllabe' || kind === 'associer-audio' || kind === 'associer-image'
}

export function audioOrderLetterKey(word: string) {
  return displayVocabLabel(word).normalize('NFC').trim().toLocaleLowerCase('fr')
}

export function shortAudioSyllable(word: string, bank: SoutienVowelBank): AudioOrderChoice | undefined {
  const syllable = syllabifyFr(displayVocabLabel(word)).find((part) =>
    [...part].filter((letter) => /\p{L}/u.test(letter)).length <= 3 && wordHasLessonLetter(part, bank))
  if (!syllable) return undefined
  const audioSrc = soutienAudioFor(syllable) ?? soutienAudioFor(word)
  return audioSrc ? { word: syllable, audioSrc } : undefined
}

/** Garder l’ordre des banques afin de préserver les tirages des recettes antérieures. */
export function audioOrderWordPool(
  bank: SoutienVowelBank, mode: AudioOrder['mode'], options?: Pick<SoutienGenerateOptions, 'type1Words' | 'excludeWords'>,
) {
  const source = mode === 'images' ? [...(options?.type1Words ?? []), ...type1WordPool(bank)] : [
    ...bank.audioPairs.map(({ word }) => word),
    ...bank.wordSearchWords,
    ...lessonWordsForText(bank),
    ...lessonWordsBySound(bank),
    ...bank.words,
    ...type1WordPool(bank),
  ]
  const seen = new Set((options?.excludeWords ?? []).map((word) => word.toLowerCase()))
  const words: string[] = []
  for (const word of source) {
    const key = word.toLowerCase()
    if (seen.has(key) || !soutienAudioFor(word) || (mode === 'images' && !soutienImageFor(word))) continue
    seen.add(key)
    words.push(word)
  }
  return words
}

export function audioOrderChoices(bank: SoutienVowelBank, kind: AudioOrderKind,
  options?: Pick<SoutienGenerateOptions, 'type1Words' | 'excludeWords'>): AudioOrderChoice[] {
  const choices = new Map<string, AudioOrderChoice>()
  const mode = kind === 'associer-image' ? 'images' : 'words'
  const words = kind === 'associer-syllabe' ? type1WordPool(bank) : audioOrderWordPool(bank, mode, options)
  for (const raw of words) {
    const audioSrc = soutienAudioFor(raw)
    const choice = kind === 'associer-syllabe' ? shortAudioSyllable(raw, bank) : audioSrc ? {
      word: displayVocabLabel(raw), audioSrc, imageSrc: mode === 'images' ? soutienImageFor(raw) : undefined,
    } : undefined
    if (!choice) continue
    const key = audioOrderLetterKey(choice.word)
    if (!choices.has(key)) choices.set(key, choice)
  }
  return [...choices.values()]
}

export function withAudioOrder(item: MathItem, audioOrder: AudioOrder): MathItem {
  return { ...item, audioOrder, answer: audioOrder.clips.map(({ word }, index) => `${index + 1} → ${word}`).join(' · ') }
}

const defaultChoices = new WeakMap<SoutienVowelBank, Map<AudioOrderKind, number>>()

export function defaultAudioOrderCapacity(bank: SoutienVowelBank, kind: AudioOrderKind): number {
  const counts = defaultChoices.get(bank) ?? new Map<AudioOrderKind, number>()
  const saved = counts.get(kind)
  if (saved !== undefined) return saved
  const count = Math.min(3, Math.floor(audioOrderChoices(bank, kind).length / AUDIO_ORDER_CLIPS))
  counts.set(kind, count)
  defaultChoices.set(bank, counts)
  return count
}

export function addAudioOrderSeries(previous: MathItem[], count: number, bank: SoutienVowelBank, kind: AudioOrderKind,
  rng: Rng, options?: Pick<SoutienGenerateOptions, 'type1Words' | 'excludeWords'>): MathItem[] | null {
  if (count <= previous.length) return previous.slice(0, count)
  const used = new Set(previous.flatMap(({ audioOrder }) => audioOrder?.clips.map(({ word }) => audioOrderLetterKey(word)) ?? []))
  const candidates = shuffle(rng, audioOrderChoices(bank, kind, options).filter(({ word }) => !used.has(audioOrderLetterKey(word))))
  if (candidates.length < (count - previous.length) * AUDIO_ORDER_CLIPS) return null
  const mode = kind === 'associer-image' ? 'images' : 'words'
  return [...previous, ...Array.from({ length: count - previous.length }, (_, index) => {
    const rows = candidates.slice(index * AUDIO_ORDER_CLIPS, (index + 1) * AUDIO_ORDER_CLIPS)
    const clips = rows.map(({ word, audioSrc }) => ({ word, audioSrc }))
    const slots = shuffle(rng, rows.map(({ word, imageSrc }, position) => ({
      correctNum: position + 1, ...(mode === 'images' ? { imageSrc } : { word }),
    })))
    return withAudioOrder({ layout: 'audio-order', answer: '', themeGraphemes: [...bank.graphemes] }, { mode, clips, slots })
  })]
}
