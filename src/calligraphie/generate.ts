import type { Difficulty, MathItem } from '@/math/types'
import { createRng, pick, shuffle, type Rng } from '@/math/rng'
import {
  defaultVocabSubgroup,
  vocabLevelFromDifficulty,
  vocabLearnWordsFor,
  type VocabLevel,
  type VocabWordEntry,
} from '@/francais/vocab-learn'
import {
  DEFAULT_CALLI_PHRASE_COUNT,
  DEFAULT_CALLI_WORD_COUNT,
  MAX_CALLI_LINE_CHARS,
  defaultCalliText,
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

/** Capacité selon la taille (bande plus haute → moins d’entrées). */
export function maxCalliEntries(mode: 'same-line' | 'copy-below', sizeId: string): number {
  const size = calliSizeById(sizeId)
  if (mode === 'copy-below') {
    if (size.id === 'grand') return 3
    if (size.id === 'petit') return 5
    return 4
  }
  // Mots (6 lignes) : 9 par défaut en taille moyenne.
  if (size.id === 'grand') return 9
  if (size.id === 'petit') return 12
  return 9
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

function phrasesForWord(word: VocabWordEntry, level: VocabLevel): string[] {
  const pool = word.sentences?.phrase?.[level] ?? []
  return pool
    .map((p) => p.trim())
    .filter((p) => p.length > 0 && p.length <= MAX_CALLI_LINE_CHARS)
}

function pickPhraseForWord(rng: Rng, word: VocabWordEntry, level: VocabLevel): string {
  const preferred = phrasesForWord(word, level)
  if (preferred.length) return pick(rng, preferred)
  // Repli : autres niveaux, puis phrase courte fabriquée.
  for (const lvl of ['a1', 'a2', 'b1'] as VocabLevel[]) {
    if (lvl === level) continue
    const alt = phrasesForWord(word, lvl)
    if (alt.length) return pick(rng, alt)
  }
  const label = word.label.trim()
  const fallback = `Voici ${label}.`
  return fallback.length <= MAX_CALLI_LINE_CHARS ? fallback : label.slice(0, MAX_CALLI_LINE_CHARS)
}

function bankWords(topic: string, subgroupId?: string): VocabWordEntry[] {
  const frTopic = frTopicFromCalliTopic(topic)
  if (!frTopic) return []
  const subgroup = subgroupId || defaultVocabSubgroup(frTopic)
  return vocabLearnWordsFor(frTopic, subgroup)
}

/** Tire de nouveaux mots / phrases selon le thème (déterministe via seed). */
export function reshuffleCalliContent(seed: number, input: CalliReshuffleInput): string {
  const rng = createRng(seed)
  const phrases = isCalliPhrasesType(input.exerciseType)
  const sizeId = calliSizeById(input.calliSize).id
  const mode = phrases ? 'copy-below' : 'same-line'
  const maxN = maxCalliEntries(mode, sizeId)
  const current = parseCalliLines(input.calliText)
  const n = Math.min(
    maxN,
    Math.max(
      phrases ? DEFAULT_CALLI_PHRASE_COUNT : DEFAULT_CALLI_WORD_COUNT,
      input.countHint ?? current.length,
      phrases ? DEFAULT_CALLI_PHRASE_COUNT : DEFAULT_CALLI_WORD_COUNT,
    ),
  )

  if (isCalliLibreTopic(input.topic)) {
    // Libre : on garde les champs saisis ; s’ils sont vides, démo.
    if (current.length > 0) return joinCalliLines(current.slice(0, maxN))
    return defaultCalliText(input.exerciseType)
  }

  const words = bankWords(input.topic, input.vocabSubgroup)
  if (!words.length) {
    return current.length ? joinCalliLines(current.slice(0, maxN)) : defaultCalliText(input.exerciseType)
  }

  const level = vocabLevelFromDifficulty(input.difficulty)
  // Un mot Voc = une seule entrée sur la fiche (pas de doublon d’item).
  const uniqueById = new Map<string, (typeof words)[number]>()
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
    // Évite deux fois la même phrase sur la feuille.
    if (usedPhrases.has(phrase)) {
      const alts = phrasesForWord(w, level).filter((p) => !usedPhrases.has(p))
      if (alts.length) phrase = pick(rng, alts)
    }
    usedPhrases.add(phrase)
    lines.push(phrase)
  }
  return joinCalliLines(lines)
}

/** Contenu initial quand on change de thème / type. */
export function initialCalliText(input: CalliReshuffleInput, seed = 1): string {
  return reshuffleCalliContent(seed, input)
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
  const phrases = isCalliPhrasesType(typeId)

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
            entries: entries.slice(0, maxCalliEntries('copy-below', sizeId)),
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
          entries: entries.slice(0, maxCalliEntries('same-line', sizeId)),
          fontId: fontId ?? DEFAULT_CALLI_FONT,
          sizeId: sizeId ?? DEFAULT_CALLI_SIZE,
        },
      },
    ],
  }
}
