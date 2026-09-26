import { frenchBank, parseFrenchType, type FrChoice, type FrHole } from './francais-banks'
import { pick, shuffle, type Rng } from '@/math/rng'
import type { Difficulty, MathItem, WorksheetDocument } from '@/math/types'
import { comprehensionLevelFromDifficulty as writtenLevelFromDifficulty } from './comprehension-ecrite'
import { writtenDocsFor } from './comprehension-ecrite-banks'
import {
  comprehensionLevelFromDifficulty as oralLevelFromDifficulty,
  oralDocsFor,
  type FrOralChoice,
} from './comprehension-orale'
import { resolveVocabEntries } from './vocab-learn'
import { tryGenerateVocabBlock } from './vocab-generate'
import { theoryByTypeId } from './grammar-theory-banks'
import type { GrammarTheoryBlock } from './grammar-theory'

export type FrancaisBlockResult = {
  items: MathItem[]
  instruction?: string
  document?: WorksheetDocument
  /** Taille de la banque de questions du document tiré (CO / CE). */
  bankQuestionCap?: number
}

export type FrancaisGenOptions = {
  vocabRows?: number
  vocabCols?: number
  vocabSelected?: string[]
  vocabSubgroup?: string
  vocabCustomEntries?: import('./vocab-learn').VocabWordEntry[]
  vocabLineCh?: number
  difficulty?: Difficulty
  topic?: string
}

function hole(row: FrHole): MathItem {
  return { layout: 'text', prompt: row.prompt, answer: row.answer }
}

function choice(row: FrChoice): MathItem {
  return { layout: 'select', prompt: row.prompt, options: row.options, answer: row.answer }
}

function qcmChoice(
  row: FrChoice & { optionImages?: string[]; imagesAvailable?: boolean },
  rng?: Rng,
): MathItem {
  const options = rng ? shuffle(rng, row.options) : row.options
  const images = row.optionImages
  const optionImages =
    images && images.length === row.options.length && rng
      ? options.map((opt) => images[row.options.indexOf(opt)]!)
      : images
  return {
    layout: 'select',
    selectVariant: 'oral',
    prompt: row.prompt,
    options,
    answer: row.answer,
    optionImages,
    imagesAvailable: Boolean(row.imagesAvailable && optionImages?.length === 3),
    answerMode: 'qcm',
  }
}

function oralChoice(row: FrOralChoice, rng?: Rng): MathItem {
  return qcmChoice(row, rng)
}

function take<T>(list: T[], count: number, rng: Rng): T[] {
  if (list.length === 0) return []
  const mixed = shuffle(rng, list)
  const out: T[] = []
  for (let i = 0; i < count; i++) out.push(mixed[i % mixed.length]!)
  return out
}

function takeUnique<T>(list: T[], count: number, rng: Rng): T[] {
  if (list.length === 0 || count <= 0) return []
  return shuffle(rng, list).slice(0, Math.min(count, list.length))
}

function clampVocabDim(value: number | undefined, fallback: number, max: number): number {
  if (value == null || !Number.isFinite(value)) return fallback
  return Math.max(1, Math.min(max, Math.round(value)))
}

export function tryGenerateFrancaisBlock(
  typeId: string,
  count: number,
  rng: Rng,
  options?: FrancaisGenOptions,
): FrancaisBlockResult | null {
  const parsed = parseFrenchType(typeId)
  if (!parsed) return null

  if (parsed.kind === 'mots') {
    const rows = clampVocabDim(options?.vocabRows, 3, 6)
    const cols = clampVocabDim(options?.vocabCols, 3, 4)
    const entries = resolveVocabEntries(
      parsed.topic,
      options?.vocabSelected,
      rows,
      cols,
      options?.vocabSubgroup,
      options?.vocabCustomEntries,
    )
    return {
      items: [
        {
          layout: 'vocab-table',
          prompt: 'Mots à apprendre',
          answer: entries.map((entry) => entry.label).join(', '),
          vocabEntries: entries,
          vocabRows: rows,
          vocabCols: cols,
        },
      ],
      instruction: 'Observez les images et apprenez les mots.',
    }
  }

  if (parsed.kind.startsWith('theorie-') && parsed.track === 'gram') {
    const doc = theoryByTypeId(typeId)
    if (!doc) return null
    const items: MathItem[] = doc.blocks.map((block: GrammarTheoryBlock, index) => ({
      layout: 'theory' as const,
      answer: '',
      prompt: block.kind === 'heading' ? block.text : undefined,
      theoryBlock: block,
      labels: [`${doc.id}-${index}`],
    }))
    return {
      items,
      instruction: `Théorie — ${doc.title}`,
    }
  }

  const vocab = tryGenerateVocabBlock(typeId, parsed.topic, count, rng, {
    vocabSelected: options?.vocabSelected,
    vocabSubgroup: options?.vocabSubgroup,
    vocabCustomEntries: options?.vocabCustomEntries,
    vocabLineCh: options?.vocabLineCh,
    difficulty: options?.difficulty,
  })
  if (vocab) return vocab

  const bank = frenchBank(parsed.topic)
  if (!bank) return null

  if (parsed.kind === 'completer') {
    return { items: take(bank.vocHoles, count, rng).map(hole) }
  }
  if (parsed.kind === 'choisir' && parsed.track === 'voc') {
    return { items: take(bank.vocChoices, count, rng).map(choice) }
  }
  if (parsed.kind === 'intrus') {
    return { items: take(bank.vocIntrus, count, rng).map(choice) }
  }
  if (parsed.kind === 'trous' && parsed.track === 'gram') {
    return { items: take(bank.gramHoles, count, rng).map(hole) }
  }
  if (parsed.kind === 'conjuguer') {
    return { items: take(bank.gramConj, count, rng).map(hole) }
  }
  if (parsed.kind === 'choisir' && parsed.track === 'gram') {
    return { items: take(bank.gramChoices, count, rng).map(choice) }
  }
  if (parsed.kind === 'orale') {
    const level = oralLevelFromDifficulty(options?.difficulty)
    const pool = oralDocsFor(parsed.topic, level)
    if (pool.length > 0) {
      const doc = pick(rng, pool)
      const bankCap = doc.questions.length
      const questions = takeUnique(doc.questions, count, rng)
      return {
        items: questions.map((q) => oralChoice(q, rng)),
        instruction: 'Écoutez l’enregistrement. Répondez aux questions (QCM).',
        document: {
          kind: 'oral',
          title: doc.title,
          text: doc.transcript,
          audioSrc: doc.audioSrc,
        },
        bankQuestionCap: bankCap,
      }
    }
    if (bank.oral.length === 0) return null
    const doc = pick(rng, bank.oral)
    const bankCap = doc.questions.length
    const questions = takeUnique(doc.questions, count, rng)
    return {
      items: questions.map((q) => oralChoice({ ...q, imagesAvailable: false }, rng)),
      instruction: 'Écoutez l’enregistrement. Répondez aux questions (QCM).',
      document: {
        kind: 'oral',
        title: doc.title,
        text: doc.transcript,
        audioSrc: doc.audioSrc,
      },
      bankQuestionCap: bankCap,
    }
  }
  if (parsed.kind === 'ecrite') {
    const level = writtenLevelFromDifficulty(options?.difficulty)
    const pool = writtenDocsFor(parsed.topic, level)
    const doc = pick(rng, pool)
    const bankCap = doc.questions.length
    const questions = takeUnique(doc.questions, count, rng)
    return {
      items: questions.map((q) => qcmChoice(q, rng)),
      instruction: 'Lisez le texte. Répondez aux questions.',
      document: {
        kind: 'written',
        title: doc.title,
        text: doc.text,
      },
      bankQuestionCap: bankCap,
    }
  }
  if (parsed.kind === 'dialogue') {
    return { items: take(bank.dialogue, count, rng).map(hole) }
  }
  return null
}

export function tryGenerateFrancais(typeId: string, rng: Rng, index: number): MathItem | null {
  const block = tryGenerateFrancaisBlock(typeId, index + 1, rng)
  return block?.items[index] ?? null
}
