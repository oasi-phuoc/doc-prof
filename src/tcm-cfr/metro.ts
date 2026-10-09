/**
 * Plans de métro TCM CFR — grilles lettres × numéros, lignes colorées,
 * noms de lieux suisses romands (pas de Santo*).
 */
import { pick, shuffle, type Rng } from '@/math/rng'

export type MetroCell = string // ex. "E6"

export type MetroLine = {
  id: string
  name: string
  color: string
  cells: MetroCell[]
}

export type MetroMap = {
  id: string
  cols: string[]
  rows: number[]
  lines: MetroLine[]
}

export type MetroQuestion = {
  prompt: string
  answer: string
}

const COLS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'] as const
const ROWS = [1, 2, 3, 4, 5, 6, 7] as const

/** Palette lisible en N&B (traits distincts) et hors violet seul. */
const C = {
  blue: '#2563eb',
  cyan: '#0891b2',
  green: '#18a66a',
  lime: '#65a30d',
  orange: '#c45c12',
  red: '#dc2626',
  rose: '#be185d',
  purple: '#7c3aed',
  gold: '#ca8a04',
  teal: '#0f766e',
} as const

function line(
  id: string,
  name: string,
  color: string,
  cells: MetroCell[],
): MetroLine {
  return { id, name, color, cells }
}

/**
 * Cinq plans distincts (A–K × 1–7). L’étiquette d’une ligne = première case.
 * Les croisements sont les cellules partagées entre deux lignes.
 */
export const METRO_MAPS: readonly MetroMap[] = [
  {
    id: 'metro-lac-leman',
    cols: [...COLS],
    rows: [...ROWS],
    lines: [
      line('geneve', 'Genève', C.rose, ['B4', 'C4', 'D4', 'E4', 'F4', 'G4', 'H4']),
      line('lausanne', 'Lausanne', C.blue, ['E7', 'E6', 'E5', 'E4', 'E3', 'E2', 'E1']),
      line('montreux', 'Montreux', C.cyan, ['C6', 'D5', 'E4', 'F3', 'G2']),
      line('nyon', 'Nyon', C.orange, ['A2', 'B2', 'C2', 'D2', 'E2', 'F2']),
      line('vevey', 'Vevey', C.green, ['G1', 'G2', 'G3', 'G4', 'G5']),
      line('sion', 'Sion', C.red, ['J7', 'I6', 'H5', 'G4', 'F3']),
      line('fribourg', 'Fribourg', C.purple, ['J2', 'I2', 'H2', 'G2', 'F2', 'E2']),
      line('berne', 'Berne', C.gold, ['K5', 'J5', 'I5', 'H5', 'G5', 'F5']),
    ],
  },
  {
    id: 'metro-arc-jurassien',
    cols: [...COLS],
    rows: [...ROWS],
    lines: [
      line('neuchatel', 'Neuchâtel', C.blue, ['A5', 'B5', 'C5', 'D5', 'E5', 'F5']),
      line('bienne', 'Bienne', C.orange, ['C7', 'C6', 'C5', 'C4', 'C3', 'C2']),
      line('yverdon', 'Yverdon', C.green, ['B1', 'C2', 'D3', 'E4', 'F5', 'G6']),
      line('montreux-j', 'Montreux', C.rose, ['H7', 'H6', 'H5', 'H4', 'H3']),
      line('basel', 'Bâle', C.red, ['K6', 'J6', 'I6', 'H6', 'G6', 'F6']),
      line('zurich', 'Zurich', C.cyan, ['K3', 'J3', 'I3', 'H3', 'G3', 'F3', 'E3']),
      line('lucerne', 'Lucerne', C.gold, ['A3', 'B3', 'C3', 'D3', 'E3']),
      line('sierre', 'Sierre', C.purple, ['I1', 'H2', 'G3', 'F4', 'E5']),
    ],
  },
  {
    id: 'metro-plateau',
    cols: [...COLS],
    rows: [...ROWS],
    lines: [
      line('berne2', 'Berne', C.red, ['D7', 'D6', 'D5', 'D4', 'D3', 'D2', 'D1']),
      line('fribourg2', 'Fribourg', C.blue, ['A4', 'B4', 'C4', 'D4', 'E4', 'F4', 'G4']),
      line('lausanne2', 'Lausanne', C.orange, ['B6', 'C5', 'D4', 'E3', 'F2']),
      line('geneve2', 'Genève', C.green, ['F7', 'F6', 'F5', 'F4', 'F3']),
      line('montreux2', 'Montreux', C.cyan, ['G1', 'H2', 'I3', 'J4', 'K5']),
      line('sion2', 'Sion', C.rose, ['K2', 'J2', 'I2', 'H2', 'G2', 'F2']),
      line('neuchatel2', 'Neuchâtel', C.gold, ['A6', 'B6', 'C6', 'D6', 'E6']),
      line('bienne2', 'Bienne', C.purple, ['H7', 'I6', 'J5', 'K4']),
    ],
  },
  {
    id: 'metro-valais-vaud',
    cols: [...COLS],
    rows: [...ROWS],
    lines: [
      line('sion3', 'Sion', C.orange, ['B6', 'C6', 'D6', 'E6', 'F6', 'G6', 'H6']),
      line('sierre2', 'Sierre', C.blue, ['E7', 'E6', 'E5', 'E4', 'E3']),
      line('montreux3', 'Montreux', C.green, ['A3', 'B3', 'C3', 'D3', 'E3', 'F3']),
      line('vevey2', 'Vevey', C.rose, ['A5', 'B4', 'C3', 'D2', 'E1']),
      line('nyon2', 'Nyon', C.cyan, ['G1', 'G2', 'G3', 'G4', 'G5', 'G6']),
      line('lausanne3', 'Lausanne', C.red, ['I7', 'H6', 'G5', 'F4', 'E3']),
      line('geneve3', 'Genève', C.gold, ['K4', 'J4', 'I4', 'H4', 'G4', 'F4']),
      line('yverdon2', 'Yverdon', C.purple, ['K1', 'J2', 'I3', 'H4', 'G5']),
    ],
  },
  {
    id: 'metro-suisse-romande',
    cols: [...COLS],
    rows: [...ROWS],
    lines: [
      line('geneve4', 'Genève', C.blue, ['A6', 'B5', 'C4', 'D3', 'E2']),
      line('lausanne4', 'Lausanne', C.orange, ['B7', 'C6', 'D5', 'E4', 'F3', 'G2']),
      line('fribourg3', 'Fribourg', C.green, ['A2', 'B2', 'C2', 'D2', 'E2', 'F2', 'G2']),
      line('berne3', 'Berne', C.rose, ['H7', 'H6', 'H5', 'H4', 'H3', 'H2']),
      line('neuchatel3', 'Neuchâtel', C.cyan, ['C7', 'D7', 'E7', 'F7', 'G7', 'H7']),
      line('bienne3', 'Bienne', C.red, ['K6', 'J5', 'I4', 'H3', 'G2']),
      line('basel2', 'Bâle', C.gold, ['K3', 'J3', 'I3', 'H3', 'G3']),
      line('lucerne2', 'Lucerne', C.purple, ['F1', 'F2', 'F3', 'F4', 'F5']),
      line('zurich2', 'Zurich', C.lime, ['K5', 'J5', 'I5', 'H5', 'G5', 'F5', 'E5']),
    ],
  },
]

export function pickMetroMap(rng: Rng): MetroMap {
  return pick(rng, METRO_MAPS)
}

/** Première case = emplacement du nom (étiquette). */
function labelCell(line: MetroLine): MetroCell {
  return line.cells[0]!
}

function findIntersections(a: MetroLine, b: MetroLine): MetroCell[] {
  const setB = new Set(b.cells)
  return a.cells.filter((c) => setB.has(c))
}

type Crossing = { a: MetroLine; b: MetroLine; cell: MetroCell }

function allCrossings(map: MetroMap): Crossing[] {
  const out: Crossing[] = []
  for (let i = 0; i < map.lines.length; i++) {
    for (let j = i + 1; j < map.lines.length; j++) {
      const a = map.lines[i]!
      const b = map.lines[j]!
      for (const cell of findIntersections(a, b)) {
        out.push({ a, b, cell })
      }
    }
  }
  return out
}

function formatCellList(cells: MetroCell[]): string {
  return cells.join(', ')
}

/**
 * Exactement 5 questions (types fixes), tirage déterministe des lignes / cases.
 */
export function generateMetroQuestions(rng: Rng, map: MetroMap): MetroQuestion[] {
  const lines = shuffle(rng, map.lines)
  const crossings = shuffle(rng, allCrossings(map))

  const lineForLabel = lines[0]!
  const crossing = crossings[0] ?? (() => {
    // Repli théorique : deux lignes qui partagent au moins la première case d’une autre
    const a = map.lines[0]!
    const b = map.lines[1]!
    return { a, b, cell: a.cells.find((c) => b.cells.includes(c)) ?? a.cells[0]! }
  })()

  const labeledLine = pick(rng, map.lines)
  const labelOf = labelCell(labeledLine)

  const pathLine = lines[1] ?? lines[0]!
  const terminiLine = lines[2] ?? lines[0]!
  const start = terminiLine.cells[0]!
  const end = terminiLine.cells[terminiLine.cells.length - 1]!

  return [
    {
      prompt: `Dans quelle case se trouve le nom de métro ${lineForLabel.name} ?`,
      answer: labelCell(lineForLabel),
    },
    {
      prompt: `Dans quelle case se croisent les métros ${crossing.a.name} et ${crossing.b.name} ?`,
      answer: crossing.cell,
    },
    {
      prompt: `Quel nom de métro se trouve dans la case ${labelOf} ?`,
      answer: labeledLine.name,
    },
    {
      prompt: `Par quelles cases passe le métro ${pathLine.name} ?`,
      answer: formatCellList(pathLine.cells),
    },
    {
      prompt: `Dans quelles cases se trouvent les stations de départ et d'arrivée du métro ${terminiLine.name} ?`,
      answer: `${start} et ${end}`,
    },
  ]
}
