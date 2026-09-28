import type { Difficulty, MathItem } from '@/math/types'
import { createRng, pick, shuffle, type Rng } from '@/math/rng'
import {
  vocabAllWordsFor,
  vocabLevelFromDifficulty,
  vocabLearnWordsFor,
  type VocabLevel,
  type VocabWordEntry,
} from '@/francais/vocab-learn'
import { VOCAB_TOPIC_BANKS } from '@/francais/vocab-registry'
import {
  MAX_CALLI_LINE_CHARS,
  defaultCalliPhraseCount,
  defaultCalliText,
  defaultCalliWordCount,
  hardMaxCalliEntries,
  isCalliPhrasesType,
  joinCalliLines,
  parseCalliLines,
} from './defaults'
import {
  DEFAULT_CALLI_FONT,
  DEFAULT_CALLI_SIZE,
  calliFontById,
  calliSizeById,
  type CalliFontId,
  type CalliSizeId,
} from './fonts'
import { frTopicFromCalliTopic, isCalliLibreTopic } from './topics'

export type CalligraphieBatch = {
  items: MathItem[]
  instruction: string
  preferredColumns?: number
}

export type CalliReshuffleInput = {
  exerciseType: string
  topic: string
  difficulty?: Difficulty
  calliText?: string
  calliFont?: string
  calliSize?: string
  vocabSubgroup?: string
  /** Nombre de champs souhaité (sinon dérivé du texte / défauts). */
  countHint?: number
}

/** @deprecated Prefer defaultCalliWordCount / hardMaxCalliEntries. */
export function maxCalliEntries(mode: 'same-line' | 'copy-below', sizeId: string): number {
  if (mode === 'copy-below') return defaultCalliPhraseCount(sizeId)
  return defaultCalliWordCount(sizeId)
}

export function isCalligraphieType(typeId: string): boolean {
  return (
    typeId === 'calli-mots' ||
    typeId === 'calli-phrases' ||
    typeId === 'calli-6-lignes' ||
    typeId === 'calli-4-lignes' ||
    typeId === 'calli-5-lignes' ||
    typeId === 'calli-3-lignes' ||
    (typeId.startsWith('calli-') && (typeId.endsWith('-mots') || typeId.endsWith('-phrases')))
  )
}

/** Tous les mots Voc de toutes les banques (mode Libre). */
export function allCalliVocabWords(): VocabWordEntry[] {
  return VOCAB_TOPIC_BANKS.flatMap((topic) => topic.subgroups.flatMap((g) => g.words))
}

function phrasesForWord(word: VocabWordEntry, level: VocabLevel): string[] {
  const pool = word.sentences?.phrase?.[level] ?? []
  return pool
    .map((p) => p.trim())
    .filter((p) => p.length > 0 && p.length <= MAX_CALLI_LINE_CHARS)
}

function pickPhraseForWord(rng: Rng, word: VocabWordEntry, level: VocabLevel): string {
  const preferred = phrasesForWord(word, level)
  if (preferred.length) return pick(rng, preferred)
  for (const lvl of ['a1', 'a2', 'b1'] as VocabLevel[]) {
    if (lvl === level) continue
    const alt = phrasesForWord(word, lvl)
    if (alt.length) return pick(rng, alt)
  }
  const label = word.label.trim()
  const fallback = `Léa aime ${label}.`
  return fallback.length <= MAX_CALLI_LINE_CHARS ? fallback : label.slice(0, MAX_CALLI_LINE_CHARS)
}

function bankWords(topic: string, subgroupId?: string): VocabWordEntry[] {
  if (isCalliLibreTopic(topic)) {
    return allCalliVocabWords()
  }
  const frTopic = frTopicFromCalliTopic(topic)
  if (!frTopic) return []
  // Sous-thème choisi, sinon tout le thème.
  if (subgroupId) return vocabLearnWordsFor(frTopic, subgroupId)
  return vocabAllWordsFor(frTopic)
}

function targetCount(input: CalliReshuffleInput, phrases: boolean): number {
  const sizeId = calliSizeById(input.calliSize).id
  const mode = phrases ? 'copy-below' : 'same-line'
  const hard = hardMaxCalliEntries(mode, sizeId)
  const def = phrases ? defaultCalliPhraseCount(sizeId) : defaultCalliWordCount(sizeId)
  const current = parseCalliLines(input.calliText).length
  const hint = input.countHint ?? 0
  // Conserve les lignes ajoutées au-delà du défaut ; sinon repart du défaut.
  const desired = Math.max(def, current, hint)
  return Math.min(hard, Math.max(def, desired))
}

/** Tire de nouveaux mots / phrases (déterministe via seed). */
export function reshuffleCalliContent(seed: number, input: CalliReshuffleInput): string {
  const rng = createRng(seed)
  const phrases = isCalliPhrasesType(input.exerciseType)
  const n = targetCount(input, phrases)
  const words = bankWords(input.topic, input.vocabSubgroup)

  if (!words.length) {
    return defaultCalliText(input.exerciseType, input.calliSize)
  }

  const level = vocabLevelFromDifficulty(input.difficulty)
  const uniqueById = new Map<string, VocabWordEntry>()
  for (const w of shuffle(rng, words)) {
    if (!uniqueById.has(w.id)) uniqueById.set(w.id, w)
    if (uniqueById.size >= n) break
  }
  const pickedWords = [...uniqueById.values()]

  if (!phrases) {
    return joinCalliLines(pickedWords.map((w) => w.label))
  }

  const usedPhrases = new Set<string>()
  const lines: string[] = []
  for (const w of pickedWords) {
    let phrase = pickPhraseForWord(rng, w, level)
    if (usedPhrases.has(phrase)) {
      const alts = phrasesForWord(w, level).filter((p) => !usedPhrases.has(p))
      if (alts.length) phrase = pick(rng, alts)
    }
    usedPhrases.add(phrase)
    lines.push(phrase)
  }
  return joinCalliLines(lines)
}

/** Contenu initial quand on change de thème / type / taille. */
export function initialCalliText(input: CalliReshuffleInput, seed = 1): string {
  // Ignore le texte précédent : repart du nombre par défaut pour la taille.
  return reshuffleCalliContent(seed, { ...input, calliText: undefined, countHint: undefined })
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
  const fallback = parseCalliLines(defaultCalliText(typeId, sizeId))
  const entries = (raw.length > 0 ? raw : fallback).map((t) => t.slice(0, 80))
  const phrases = isCalliPhrasesType(typeId)
  const hard = hardMaxCalliEntries(phrases ? 'copy-below' : 'same-line', sizeId)

  if (phrases) {
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
            entries: entries.slice(0, hard),
            fontId: fontId ?? DEFAULT_CALLI_FONT,
            sizeId: sizeId ?? DEFAULT_CALLI_SIZE,
          },
        },
      ],
    }
  }

  return {
    instruction: 'Recopiez chaque ligne en écriture cursive sur la même bande.',
    preferredColumns: 1,
    items: [
      {
        layout: 'calligraphy',
        answer: entries.join(' / '),
        prompt: '',
        calligraphy: {
          mode: 'same-line',
          ruleLines: 6,
          entries: entries.slice(0, hard),
          fontId: fontId ?? DEFAULT_CALLI_FONT,
          sizeId: sizeId ?? DEFAULT_CALLI_SIZE,
        },
      },
    ],
  }
}
