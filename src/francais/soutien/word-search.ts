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

const DIRS: ReadonlyArray<readonly [number, number]> = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
]

/** Majuscules pour la grille (garde les accents ; Æ/Œ → AE/OE, jamais en une cellule). */
export function toGridLetters(word: string): string {
  return word
    .normalize('NFC')
    .replace(/[’']/g, '')
    .replace(/-/g, '')
    .replace(/œ/gi, 'oe')
    .replace(/æ/gi, 'ae')
    .toLocaleUpperCase('fr-FR')
    .replace(/Œ/g, 'OE')
    .replace(/Æ/g, 'AE')
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

/** Remplissage : lettres simples uniquement (pas de ligatures Æ / Œ). */
const FILL =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZÀÂÄÉÈÊËÎÏÔÖÙÛÜÇ'.split('')

/**
 * Construit une grille de mots mêlés déterministe (15×15 par défaut).
 * Directions : horizontal / vertical (2 sens).
 */
export function buildWordSearch(
  rng: Rng,
  sourceWords: readonly string[],
  size = 15,
  count = 12,
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

  const grid: (string | null)[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => null),
  )
  const placements: WordSearchPlacement[] = []
  const placedWords: string[] = []

  for (const word of shuffle(rng, words)) {
    const gridWord = toGridLetters(word)
    if (gridWord.length < 3 || gridWord.length > size) continue
    let placed = false
    const attempts = 80
    for (let a = 0; a < attempts && !placed; a++) {
      const [dRow, dCol] = pick(rng, DIRS)
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
