import {
  ALPHABET,
  WORDS_BY_INITIAL,
  countGrapheme,
  otherVowelWords,
  vowelByTopic,
  wordHasGrapheme,
  type VowelBank,
} from './lecture-banks'
import { int, pick, shuffle, type Rng } from '@/math/rng'
import type { Difficulty, MathItem } from '@/math/types'

export type LectureBatch = {
  items: MathItem[]
  instruction: string
  preferredColumns?: number
}

const DISTRACTOR_LETTERS = 'bcdfghjklmnpqrstvwxzBCDFGHIJKLMNPQRSTVWXZ'.split('')

function parseVowelType(typeId: string): { topic: string; kind: string } | null {
  const m = /^(voyelle-[aeiouy])-(entourer|cocher|syllabe|former|lettres|compter)$/.exec(typeId)
  if (!m) return null
  return { topic: m[1]!, kind: m[2]! }
}

function letterGrid(rng: Rng, bank: VowelBank, difficulty: Difficulty): MathItem {
  const size = difficulty === 'facile' ? 16 : difficulty === 'moyen' ? 20 : 24
  const targetCount = difficulty === 'facile' ? 4 : difficulty === 'moyen' ? 5 : 6
  const cells: string[] = []
  for (let i = 0; i < targetCount; i++) {
    cells.push(pick(rng, [bank.letterUpper, bank.letterLower]))
  }
  while (cells.length < size) {
    let d = pick(rng, DISTRACTOR_LETTERS)
    while (d.toLowerCase() === bank.letterLower) d = pick(rng, DISTRACTOR_LETTERS)
    cells.push(d)
  }
  return {
    layout: 'letter-grid',
    prompt: `Entourez les lettres ${bank.letterUpper} ${bank.letterLower}.`,
    options: shuffle(rng, cells),
    answer: `${bank.letterUpper}${bank.letterLower}`,
    labels: [bank.letterLower],
  }
}

function cocherMots(rng: Rng, bank: VowelBank, difficulty: Difficulty): MathItem {
  const nCorrect = difficulty === 'facile' ? 2 : 3
  const nWrong = difficulty === 'avance' ? 3 : 2
  const positives = shuffle(rng, [...bank.words]).filter((w) => wordHasGrapheme(w, bank))
  const negatives = shuffle(rng, otherVowelWords(bank))
  const chosenPos = positives.slice(0, Math.min(nCorrect, positives.length))
  const chosenNeg = negatives.slice(0, Math.min(nWrong, negatives.length))
  const options = shuffle(rng, [...chosenPos, ...chosenNeg])
  return {
    layout: 'select',
    prompt: `Cochez les mots où l’on entend le son ${bank.sound}.`,
    options,
    answer: chosenPos.join(' · '),
    labels: chosenPos,
  }
}

function syllabeSon(rng: Rng, bank: VowelBank): MathItem {
  const compound = pick(rng, bank.compounds)
  const options = shuffle(rng, [...compound.parts])
  const correct = compound.parts.find((p) => wordHasGrapheme(p, bank)) ?? compound.parts[0]!
  return {
    layout: 'select',
    prompt: `Dans « ${compound.word} », quelle syllabe contient le son ${bank.sound} ?`,
    options,
    answer: correct,
  }
}

function formerMot(rng: Rng, bank: VowelBank): MathItem {
  const compound = pick(rng, bank.compounds)
  return {
    layout: 'text',
    prompt: `Associez : ${compound.parts[0]} + ${compound.parts[1]} →`,
    answer: compound.word,
  }
}

function lettresMelangees(rng: Rng, bank: VowelBank, difficulty: Difficulty): MathItem {
  const pool = bank.words.filter((w) => {
    const len = w.replace(/[^a-zA-Zàâäéèêëïîôùûüç]/g, '').length
    if (difficulty === 'facile') return len >= 3 && len <= 4
    if (difficulty === 'moyen') return len >= 4 && len <= 6
    return len >= 5 && len <= 8
  })
  const word = pick(rng, pool.length ? pool : bank.words)
  const letters = shuffle(rng, [...word]).join(' ')
  return {
    layout: 'text',
    prompt: `Lettres mélangées : ${letters} →`,
    answer: word,
  }
}

function compterSon(rng: Rng, bank: VowelBank): MathItem {
  const candidates = bank.words.filter((w) => countGrapheme(w, bank) >= 1)
  const word = pick(rng, candidates.length ? candidates : bank.words)
  const n = countGrapheme(word, bank)
  return {
    layout: 'text',
    prompt: `Combien de fois trouve-t-on la lettre ${bank.letterLower} dans « ${word} » ?`,
    answer: String(n),
  }
}

function alphabetClasser(rng: Rng, difficulty: Difficulty): MathItem {
  const n = difficulty === 'facile' ? 4 : difficulty === 'moyen' ? 5 : 6
  const letters = shuffle(rng, [...ALPHABET]).slice(0, n)
  const sorted = [...letters].sort()
  return {
    layout: 'order',
    prompt: 'Classez ces lettres par ordre alphabétique.',
    sequence: letters,
    placeParts: sorted,
    answer: sorted.join(' '),
    orderOp: '<',
  }
}

function alphabetSuivant(rng: Rng): MathItem {
  const idx = int(rng, 0, ALPHABET.length - 2)
  const letter = ALPHABET[idx]!
  const next = ALPHABET[idx + 1]!
  const distractors = shuffle(rng, ALPHABET.filter((l) => l !== next && l !== letter)).slice(0, 3)
  return {
    layout: 'select',
    prompt: `Quelle lettre vient juste après ${letter} ?`,
    options: shuffle(rng, [next, ...distractors]),
    answer: next,
  }
}

function alphabetInitiale(rng: Rng): MathItem {
  const letter = pick(
    rng,
    ALPHABET.filter((l) => (WORDS_BY_INITIAL[l]?.length ?? 0) > 0),
  )
  const examples = WORDS_BY_INITIAL[letter] ?? []
  const sample = pick(rng, examples)
  return {
    layout: 'text',
    prompt: `Écrivez un mot qui commence par la lettre ${letter}.`,
    answer: sample,
  }
}

function generateOne(typeId: string, rng: Rng, difficulty: Difficulty): MathItem | null {
  if (typeId === 'alphabet-classer') return alphabetClasser(rng, difficulty)
  if (typeId === 'alphabet-suivant') return alphabetSuivant(rng)
  if (typeId === 'alphabet-initiale') return alphabetInitiale(rng)

  const parsed = parseVowelType(typeId)
  if (!parsed) return null
  const bank = vowelByTopic[parsed.topic]
  if (!bank) return null

  switch (parsed.kind) {
    case 'entourer':
      return letterGrid(rng, bank, difficulty)
    case 'cocher':
      return cocherMots(rng, bank, difficulty)
    case 'syllabe':
      return syllabeSon(rng, bank)
    case 'former':
      return formerMot(rng, bank)
    case 'lettres':
      return lettresMelangees(rng, bank, difficulty)
    case 'compter':
      return compterSon(rng, bank)
    default:
      return null
  }
}

const INSTRUCTIONS: Record<string, string> = {
  'alphabet-classer': 'Classez les lettres par ordre alphabétique.',
  'alphabet-suivant': 'Coloriez la pastille de la lettre qui suit.',
  'alphabet-initiale': 'Écrivez un mot qui commence par la lettre demandée.',
}

function instructionFor(typeId: string, bank?: VowelBank): string {
  if (INSTRUCTIONS[typeId]) return INSTRUCTIONS[typeId]!
  const parsed = parseVowelType(typeId)
  if (!parsed || !bank) return 'Complétez chaque exercice.'
  switch (parsed.kind) {
    case 'entourer':
      return `Entourez toutes les lettres ${bank.letterUpper} ${bank.letterLower}.`
    case 'cocher':
      return `Cochez les mots où l’on entend le son ${bank.sound}.`
    case 'syllabe':
      return `Indiquez la syllabe qui contient le son ${bank.sound}.`
    case 'former':
      return 'Associez les parties et écrivez le mot formé.'
    case 'lettres':
      return 'Remettez les lettres dans l’ordre pour former le mot.'
    case 'compter':
      return `Comptez combien de fois apparaît la lettre ${bank.letterLower}.`
    default:
      return 'Complétez chaque exercice.'
  }
}

function preferredColumnsFor(typeId: string): number {
  if (typeId.endsWith('-entourer') || typeId.endsWith('-cocher') || typeId.endsWith('-lettres')) return 1
  if (typeId.startsWith('alphabet-classer') || typeId.endsWith('-former') || typeId.endsWith('-compter'))
    return 1
  return 2
}

export function tryGenerateLectureBatch(
  typeId: string,
  count: number,
  rng: Rng,
  difficulty: Difficulty,
): LectureBatch | null {
  const isAlphabet = typeId.startsWith('alphabet-')
  const parsed = parseVowelType(typeId)
  if (!isAlphabet && !parsed) return null
  const bank = parsed ? vowelByTopic[parsed.topic] : undefined
  const items: MathItem[] = []
  for (let i = 0; i < count; i++) {
    const item = generateOne(typeId, rng, difficulty)
    if (!item) return null
    items.push(item)
  }
  return {
    items,
    instruction: instructionFor(typeId, bank),
    preferredColumns: preferredColumnsFor(typeId),
  }
}

export function isLectureExercise(typeId: string): boolean {
  return typeId.startsWith('alphabet-') || Boolean(parseVowelType(typeId))
}
