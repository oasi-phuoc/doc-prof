import { frenchBank, parseFrenchType, type FrChoice, type FrHole } from './francais-banks'
import { pick, shuffle, type Rng } from './rng'
import type { MathItem, WorksheetDocument } from './types'

export type FrancaisBlockResult = {
  items: MathItem[]
  instruction?: string
  document?: WorksheetDocument
}

function hole(row: FrHole): MathItem {
  return { layout: 'text', prompt: row.prompt, answer: row.answer }
}

function choice(row: FrChoice): MathItem {
  return { layout: 'select', prompt: row.prompt, options: row.options, answer: row.answer }
}

function take<T>(list: T[], count: number, rng: Rng): T[] {
  if (list.length === 0) return []
  const mixed = shuffle(rng, list)
  const out: T[] = []
  for (let i = 0; i < count; i++) out.push(mixed[i % mixed.length]!)
  return out
}

export function tryGenerateFrancaisBlock(typeId: string, count: number, rng: Rng): FrancaisBlockResult | null {
  const parsed = parseFrenchType(typeId)
  if (!parsed) return null
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
  if (parsed.kind === 'trous') {
    return { items: take(bank.gramHoles, count, rng).map(hole) }
  }
  if (parsed.kind === 'conjuguer') {
    return { items: take(bank.gramConj, count, rng).map(hole) }
  }
  if (parsed.kind === 'choisir' && parsed.track === 'gram') {
    return { items: take(bank.gramChoices, count, rng).map(choice) }
  }
  if (parsed.kind === 'orale') {
    const doc = pick(rng, bank.oral)
    const questions = take(doc.questions, Math.min(count, doc.questions.length), rng)
    return {
      items: questions.map(choice),
      instruction: 'Écoutez le dialogue. Répondez aux questions.',
      document: {
        kind: 'oral',
        title: doc.title,
        text: doc.transcript,
        audioSrc: doc.audioSrc,
      },
    }
  }
  if (parsed.kind === 'ecrite') {
    const doc = pick(rng, bank.written)
    const questions = take(doc.questions, Math.min(count, doc.questions.length), rng)
    return {
      items: questions.map(choice),
      instruction: 'Lisez le texte. Répondez aux questions.',
      document: {
        kind: 'written',
        title: doc.title,
        text: doc.text,
      },
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
