import { int, pick, shuffle, type Rng } from '@/math/rng'

export type WordSearchPlacement = {
  word: string
  /** Mot en majuscules (grille). */
  gridWord: string
  row: number
  col: number
  dRow: number
  dCol: number
}

export type WordSearchPuzzle = {
  size: number
  grid: string[][]
  words: string[]
  placements: WordSearchPlacement[]
}

export const WORD_SEARCH_DIRECTIONS = {
  droite: [0, 1],
  gauche: [0, -1],
  bas: [1, 0],
  haut: [-1, 0],
} as const

export type WordSearchDirection = keyof typeof WORD_SEARCH_DIRECTIONS
export const DEFAULT_WORD_SEARCH_DIRECTIONS = Object.keys(WORD_SEARCH_DIRECTIONS) as WordSearchDirection[]
export const WORD_SEARCH_WORD_COUNT = 12

/** Majuscules pour la grille : sans accents ni ligatures (Æ/Œ → AE/OE). */
export function toGridLetters(word: string): string {
  return word
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // accents / diacritiques
    .replace(/[’'`´ˆ¨˜¯¸]/g, '')
    .replace(/-/g, '')
    .replace(/œ/gi, 'oe')
    .replace(/æ/gi, 'ae')
    .toLocaleUpperCase('fr-FR')
    .replace(/Œ/g, 'OE')
    .replace(/Æ/g, 'AE')
    .replace(/[^A-Z]/g, '')
}

function canPlace(
  grid: (string | null)[][],
  size: number,
  letters: string,
  row: number,
  col: number,
  dRow: number,
  dCol: number,
): boolean {
  for (let i = 0; i < letters.length; i++) {
    const r = row + dRow * i
    const c = col + dCol * i
    if (r < 0 || c < 0 || r >= size || c >= size) return false
    const cell = grid[r]![c]
    if (cell != null && cell !== letters[i]) return false
  }
  return true
}

function placeWord(
  grid: (string | null)[][],
  letters: string,
  row: number,
  col: number,
  dRow: number,
  dCol: number,
): void {
  for (let i = 0; i < letters.length; i++) {
    grid[row + dRow * i]![col + dCol * i] = letters[i]!
  }
}

/** Remplissage : lettres latines simples uniquement (pas d’accents ni ligatures). */
const FILL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

/**
 * Construit une grille de mots mêlés déterministe (15×15 par défaut).
 * Directions : horizontal / vertical (2 sens).
 */
export function buildWordSearch(
  rng: Rng,
  sourceWords: readonly string[],
  size = 15,
  count = WORD_SEARCH_WORD_COUNT,
): WordSearchPuzzle {
  const picked = shuffle(rng, [...sourceWords])
    .map((w) => w.trim())
    .filter((w) => w.length >= 3 && toGridLetters(w).length <= size)
    .slice(0, count)

  const words = picked.length >= 4 ? picked : [...picked]
  while (words.length < Math.min(count, sourceWords.length)) {
    const extra = pick(rng, [...sourceWords])
    if (!words.includes(extra)) words.push(extra)
    else break
  }

  return placeWords(rng, words, size, DEFAULT_WORD_SEARCH_DIRECTIONS)!
}

function placeWords(
  rng: Rng,
  words: readonly string[],
  size: number,
  directions: readonly WordSearchDirection[],
  fixed: readonly WordSearchPlacement[] = [],
): WordSearchPuzzle | null {
  const vectors = directions.map((direction) => WORD_SEARCH_DIRECTIONS[direction])
  const grid: (string | null)[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => null),
  )
  const placements: WordSearchPlacement[] = []
  const placedWords: string[] = []
  const fixedWords = new Set<string>()
  for (const { word, row, col, dRow, dCol } of fixed) {
    const gridWord = toGridLetters(word)
    if (!words.includes(word) || fixedWords.has(word) ||
        !Number.isInteger(row) || !Number.isInteger(col) ||
        !vectors.some(([dr, dc]) => dr === dRow && dc === dCol) ||
        !canPlace(grid, size, gridWord, row, col, dRow, dCol)) return null
    placeWord(grid, gridWord, row, col, dRow, dCol)
    placements.push({ word, gridWord, row, col, dRow, dCol })
    fixedWords.add(word)
    placedWords.push(word)
  }

  for (const word of shuffle(rng, words.filter((candidate) => !fixedWords.has(candidate)))) {
    const gridWord = toGridLetters(word)
    if (gridWord.length < 3 || gridWord.length > size) continue
    let placed = false
    const attempts = 80
    for (let a = 0; a < attempts && !placed; a++) {
      const [dRow, dCol] = pick(rng, vectors)
      const maxR = dRow === 0 ? size - 1 : dRow === 1 ? size - gridWord.length : gridWord.length - 1
      const maxC = dCol === 0 ? size - 1 : dCol === 1 ? size - gridWord.length : gridWord.length - 1
      const minR = dRow === -1 ? gridWord.length - 1 : 0
      const minC = dCol === -1 ? gridWord.length - 1 : 0
      if (maxR < minR || maxC < minC) continue
      const row = int(rng, minR, maxR)
      const col = int(rng, minC, maxC)
      if (!canPlace(grid, size, gridWord, row, col, dRow, dCol)) continue
      placeWord(grid, gridWord, row, col, dRow, dCol)
      placements.push({ word, gridWord, row, col, dRow, dCol })
      placedWords.push(word)
      placed = true
    }
  }

  const filled: string[][] = grid.map((line) =>
    line.map((cell) => cell ?? pick(rng, FILL)),
  )

  return {
    size,
    grid: filled,
    words: placedWords,
    placements,
  }
}

export function buildEditedWordSearch(
  rng: Rng,
  words: string[],
  size: number,
  directions: WordSearchDirection[],
  fixed?: readonly WordSearchPlacement[],
): WordSearchPuzzle | null {
  const spellings = words.map(toGridLetters)
  if (!Number.isInteger(size) || size < 3 || !directions.length ||
      directions.some((direction) => !Object.hasOwn(WORD_SEARCH_DIRECTIONS, direction)) ||
      !words.length || words.length > WORD_SEARCH_WORD_COUNT || new Set(spellings).size !== words.length ||
      spellings.some((word) => word.length < 3 || word.length > size)) return null
  for (let attempt = 0; attempt < 5; attempt++) {
    const puzzle = placeWords(rng, words, size, directions, fixed)
    if (!puzzle) return null
    if (puzzle.words.length === words.length) return { ...puzzle, words }
  }
  return null
}

export function findWordSearchPositions(words: string[], grid: string[][], hitCells: string[]): WordSearchPlacement[] {
  const hits = new Set(hitCells)
  return words.flatMap((word) => {
    const gridWord = toGridLetters(word)
    const letters = [...gridWord]
    if (letters.length < 3) return []
    for (const [row, line] of grid.entries()) {
      for (const [col, cell] of line.entries()) {
        if (cell !== letters[0] || !hits.has(`${row},${col}`)) continue
        for (const [dRow, dCol] of Object.values(WORD_SEARCH_DIRECTIONS)) {
          const matches = letters.every((letter, index) => {
            const r = row + index * dRow
            const c = col + index * dCol
            return grid[r]?.[c] === letter && hits.has(`${r},${c}`)
          })
          if (matches) return [{ word, gridWord, row, col, dRow, dCol }]
        }
      }
    }
    return []
  })
}

/** Ensemble des cellules (r,c) couvertes par les placements. */
export function wordSearchHitCells(
  placements: readonly WordSearchPlacement[],
): Set<string> {
  const hits = new Set<string>()
  for (const p of placements) {
    for (let i = 0; i < p.gridWord.length; i++) {
      hits.add(`${p.row + p.dRow * i},${p.col + p.dCol * i}`)
    }
  }
  return hits
}
