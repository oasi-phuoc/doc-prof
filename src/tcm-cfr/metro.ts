/**
 * Plans de métro TCM CFR — grilles lettres × numéros, lignes colorées,
 * gares du Valais central (liste fixée).
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

/** Couleurs imposées : jaune, vert, rouge, bleu, orange, violet, rose, cyan. */
const C = {
  yellow: '#ca8a04',
  green: '#18a66a',
  red: '#dc2626',
  blue: '#2563eb',
  orange: '#c45c12',
  violet: '#7c3aed',
  rose: '#be185d',
  cyan: '#0891b2',
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
 * Plans distincts (A–K × 1–7). Étiquette = première case.
 * Traits : 5 à 10 segments. Gares : Monthey, Vouvry, Martigny,
 * Sion, Sierre, Vétroz, Ardon, Botza, Synecom, Fully, Riddes, Saillon.
 */
export const METRO_MAPS: readonly MetroMap[] = [
  {
    id: 'metro-valais-1',
    cols: [...COLS],
    rows: [...ROWS],
    lines: [
      line('sion_1', 'Sion', C.blue, ['B4', 'C4', 'D4', 'E4', 'F4', 'G4', 'H4']),
      line('sierre_1', 'Sierre', C.red, ['E7', 'E6', 'E5', 'E4', 'E3', 'E2', 'E1']),
      line('martigny_1', 'Martigny', C.green, ['A2', 'B2', 'C2', 'D2', 'E2', 'F2']),
      line('monthey_1', 'Monthey', C.orange, ['C6', 'D5', 'E4', 'F3', 'G2', 'H1']),
      line('fully_1', 'Fully', C.cyan, ['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7']),
      line('riddes_1', 'Riddes', C.violet, ['J7', 'I6', 'H5', 'G4', 'F3', 'E2']),
      line('saillon_1', 'Saillon', C.rose, ['K3', 'J3', 'I3', 'H3', 'G3', 'F3']),
      line('vetroz_1', 'Vétroz', C.yellow, ['A6', 'B6', 'C6', 'D6', 'E6', 'F6']),
    ],
  },
  {
    id: 'metro-valais-2',
    cols: [...COLS],
    rows: [...ROWS],
    lines: [
      line('ardon_2', 'Ardon', C.green, ['A5', 'B5', 'C5', 'D5', 'E5', 'F5', 'G5']),
      line('botza_2', 'Botza', C.blue, ['C7', 'C6', 'C5', 'C4', 'C3', 'C2']),
      line('synecom_2', 'Synecom', C.orange, ['B1', 'C2', 'D3', 'E4', 'F5', 'G6']),
      line('vouvry_2', 'Vouvry', C.rose, ['H7', 'H6', 'H5', 'H4', 'H3', 'H2', 'H1']),
      line('sion_2', 'Sion', C.red, ['K6', 'J6', 'I6', 'H6', 'G6', 'F6']),
      line('sierre_2', 'Sierre', C.cyan, ['K2', 'J2', 'I2', 'H2', 'G2', 'F2', 'E2']),
      line('martigny_2', 'Martigny', C.yellow, ['A3', 'B3', 'C3', 'D3', 'E3', 'F3']),
      line('fully_2', 'Fully', C.violet, ['I1', 'H2', 'G3', 'F4', 'E5', 'D6']),
    ],
  },
  {
    id: 'metro-valais-3',
    cols: [...COLS],
    rows: [...ROWS],
    lines: [
      line('riddes_3', 'Riddes', C.red, ['D7', 'D6', 'D5', 'D4', 'D3', 'D2', 'D1']),
      line('saillon_3', 'Saillon', C.blue, ['A4', 'B4', 'C4', 'D4', 'E4', 'F4', 'G4']),
      line('vetroz_3', 'Vétroz', C.orange, ['B7', 'C6', 'D5', 'E4', 'F3', 'G2']),
      line('monthey_3', 'Monthey', C.green, ['F7', 'F6', 'F5', 'F4', 'F3', 'F2']),
      line('vouvry_3', 'Vouvry', C.cyan, ['F1', 'G2', 'H3', 'I4', 'J5', 'K6']),
      line('ardon_3', 'Ardon', C.rose, ['K2', 'J2', 'I2', 'H2', 'G2', 'F2']),
      line('botza_3', 'Botza', C.yellow, ['A1', 'B1', 'C1', 'D1', 'E1', 'F1']),
      line('synecom_3', 'Synecom', C.violet, ['K7', 'J6', 'I5', 'H4', 'G3', 'F2']),
    ],
  },
  {
    id: 'metro-valais-4',
    cols: [...COLS],
    rows: [...ROWS],
    lines: [
      line('sion_4', 'Sion', C.orange, ['B6', 'C6', 'D6', 'E6', 'F6', 'G6', 'H6']),
      line('sierre_4', 'Sierre', C.blue, ['E7', 'E6', 'E5', 'E4', 'E3', 'E2', 'E1']),
      line('martigny_4', 'Martigny', C.green, ['A3', 'B3', 'C3', 'D3', 'E3', 'F3']),
      line('fully_4', 'Fully', C.rose, ['A6', 'B5', 'C4', 'D3', 'E2', 'F1']),
      line('riddes_4', 'Riddes', C.cyan, ['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7']),
      line('saillon_4', 'Saillon', C.red, ['I7', 'H6', 'G5', 'F4', 'E3', 'D2']),
      line('vetroz_4', 'Vétroz', C.yellow, ['K4', 'J4', 'I4', 'H4', 'G4', 'F4']),
      line('ardon_4', 'Ardon', C.violet, ['K1', 'J2', 'I3', 'H4', 'G5', 'F6']),
    ],
  },
  {
    id: 'metro-valais-5',
    cols: [...COLS],
    rows: [...ROWS],
    lines: [
      line('monthey_5', 'Monthey', C.blue, ['A7', 'B6', 'C5', 'D4', 'E3', 'F2', 'G1']),
      line('vouvry_5', 'Vouvry', C.orange, ['B7', 'C6', 'D5', 'E4', 'F3', 'G2']),
      line('martigny_5', 'Martigny', C.green, ['A2', 'B2', 'C2', 'D2', 'E2', 'F2', 'G2']),
      line('sion_5', 'Sion', C.rose, ['H7', 'H6', 'H5', 'H4', 'H3', 'H2']),
      line('sierre_5', 'Sierre', C.cyan, ['E7', 'F7', 'G7', 'H7', 'I7', 'J7', 'K7']),
      line('fully_5', 'Fully', C.red, ['K7', 'J6', 'I5', 'H4', 'G3', 'F2']),
      line('riddes_5', 'Riddes', C.yellow, ['K3', 'J3', 'I3', 'H3', 'G3', 'F3']),
      line('saillon_5', 'Saillon', C.violet, ['F1', 'F2', 'F3', 'F4', 'F5', 'F6']),
    ],
  },
  {
    id: 'metro-valais-6',
    cols: [...COLS],
    rows: [...ROWS],
    lines: [
      line('vetroz_6', 'Vétroz', C.blue, ['A7', 'B7', 'C7', 'D7', 'E7', 'F7']),
      line('ardon_6', 'Ardon', C.orange, ['K6', 'J6', 'I6', 'H6', 'G6', 'F6']),
      line('botza_6', 'Botza', C.green, ['B1', 'B2', 'B3', 'B4', 'B5', 'B6']),
      line('synecom_6', 'Synecom', C.rose, ['A3', 'B3', 'C3', 'D3', 'E3', 'F3']),
      line('sion_6', 'Sion', C.cyan, ['D1', 'E2', 'F3', 'G4', 'H5', 'I6']),
      line('sierre_6', 'Sierre', C.red, ['K1', 'J1', 'I1', 'H1', 'G1', 'F1']),
      line('martigny_6', 'Martigny', C.yellow, ['K6', 'J5', 'I4', 'H3', 'G2', 'F1']),
      line('fully_6', 'Fully', C.violet, ['G7', 'G6', 'G5', 'G4', 'G3', 'G2']),
    ],
  },
  {
    id: 'metro-valais-7',
    cols: [...COLS],
    rows: [...ROWS],
    lines: [
      line('riddes_7', 'Riddes', C.cyan, ['A6', 'B6', 'C6', 'D6', 'E6', 'F6']),
      line('saillon_7', 'Saillon', C.orange, ['A1', 'B2', 'C3', 'D4', 'E5', 'F6']),
      line('monthey_7', 'Monthey', C.blue, ['F7', 'F6', 'F5', 'F4', 'F3', 'F2', 'F1']),
      line('vouvry_7', 'Vouvry', C.green, ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7']),
      line('sion_7', 'Sion', C.rose, ['K7', 'J7', 'I7', 'H7', 'G7', 'F7']),
      line('sierre_7', 'Sierre', C.red, ['K2', 'J2', 'I2', 'H2', 'G2', 'F2']),
      line('martigny_7', 'Martigny', C.yellow, ['B1', 'C1', 'D1', 'E1', 'F1', 'G1']),
      line('fully_7', 'Fully', C.violet, ['K6', 'J5', 'I4', 'H3', 'G2', 'F1']),
    ],
  },
  {
    id: 'metro-valais-8',
    cols: [...COLS],
    rows: [...ROWS],
    lines: [
      line('ardon_8', 'Ardon', C.blue, ['A5', 'B5', 'C5', 'D5', 'E5', 'F5']),
      line('botza_8', 'Botza', C.orange, ['A7', 'A6', 'A5', 'A4', 'A3', 'A2']),
      line('synecom_8', 'Synecom', C.green, ['C1', 'D2', 'E3', 'F4', 'G5', 'H6']),
      line('vetroz_8', 'Vétroz', C.rose, ['K7', 'K6', 'K5', 'K4', 'K3', 'K2']),
      line('sion_8', 'Sion', C.cyan, ['G7', 'G6', 'G5', 'G4', 'G3', 'G2', 'G1']),
      line('sierre_8', 'Sierre', C.red, ['B1', 'C1', 'D1', 'E1', 'F1', 'G1']),
      line('martigny_8', 'Martigny', C.yellow, ['I1', 'I2', 'I3', 'I4', 'I5', 'I6']),
      line('monthey_8', 'Monthey', C.violet, ['K1', 'J2', 'I3', 'H4', 'G5', 'F6']),
    ],
  },
  {
    id: 'metro-valais-9',
    cols: [...COLS],
    rows: [...ROWS],
    lines: [
      line('fully_9', 'Fully', C.blue, ['B7', 'B6', 'B5', 'B4', 'B3', 'B2', 'B1']),
      line('riddes_9', 'Riddes', C.orange, ['A4', 'B4', 'C4', 'D4', 'E4', 'F4']),
      line('saillon_9', 'Saillon', C.green, ['D7', 'E6', 'F5', 'G4', 'H3', 'I2']),
      line('vouvry_9', 'Vouvry', C.rose, ['K6', 'J6', 'I6', 'H6', 'G6', 'F6']),
      line('monthey_9', 'Monthey', C.cyan, ['K1', 'J1', 'I1', 'H1', 'G1', 'F1']),
      line('sion_9', 'Sion', C.red, ['A1', 'A2', 'A3', 'A4', 'A5', 'A6']),
      line('sierre_9', 'Sierre', C.yellow, ['E1', 'E2', 'E3', 'E4', 'E5', 'E6']),
      line('martigny_9', 'Martigny', C.violet, ['K3', 'J3', 'I3', 'H3', 'G3', 'F3']),
    ],
  },
  {
    id: 'metro-valais-10',
    cols: [...COLS],
    rows: [...ROWS],
    lines: [
      line('vetroz_10', 'Vétroz', C.blue, ['A4', 'B4', 'C4', 'D4', 'E4', 'F4', 'G4']),
      line('ardon_10', 'Ardon', C.orange, ['A7', 'B7', 'C7', 'D7', 'E7', 'F7']),
      line('botza_10', 'Botza', C.green, ['K7', 'J6', 'I5', 'H4', 'G3', 'F2']),
      line('synecom_10', 'Synecom', C.rose, ['K1', 'J1', 'I1', 'H1', 'G1', 'F1']),
      line('sion_10', 'Sion', C.cyan, ['B1', 'B2', 'B3', 'B4', 'B5', 'B6']),
      line('sierre_10', 'Sierre', C.red, ['D1', 'E2', 'F3', 'G4', 'H5', 'I6']),
      line('martigny_10', 'Martigny', C.yellow, ['K3', 'J3', 'I3', 'H3', 'G3', 'F3']),
      line('fully_10', 'Fully', C.violet, ['F7', 'F6', 'F5', 'F4', 'F3', 'F2']),
    ],
  },
  {
    id: 'metro-valais-11',
    cols: [...COLS],
    rows: [...ROWS],
    lines: [
      line('riddes_11', 'Riddes', C.blue, ['A3', 'B3', 'C3', 'D3', 'E3', 'F3']),
      line('saillon_11', 'Saillon', C.orange, ['A7', 'A6', 'A5', 'A4', 'A3', 'A2']),
      line('monthey_11', 'Monthey', C.green, ['C7', 'D6', 'E5', 'F4', 'G3', 'H2']),
      line('vouvry_11', 'Vouvry', C.rose, ['K7', 'J6', 'I5', 'H4', 'G3', 'F2']),
      line('sion_11', 'Sion', C.cyan, ['K1', 'J1', 'I1', 'H1', 'G1', 'F1']),
      line('sierre_11', 'Sierre', C.red, ['E7', 'E6', 'E5', 'E4', 'E3', 'E2']),
      line('martigny_11', 'Martigny', C.yellow, ['K4', 'J4', 'I4', 'H4', 'G4', 'F4']),
      line('fully_11', 'Fully', C.violet, ['B1', 'C1', 'D1', 'E1', 'F1', 'G1']),
    ],
  },
  {
    id: 'metro-valais-12',
    cols: [...COLS],
    rows: [...ROWS],
    lines: [
      line('ardon_12', 'Ardon', C.blue, ['D7', 'D6', 'D5', 'D4', 'D3', 'D2', 'D1']),
      line('botza_12', 'Botza', C.orange, ['A5', 'B5', 'C5', 'D5', 'E5', 'F5']),
      line('synecom_12', 'Synecom', C.green, ['A1', 'B2', 'C3', 'D4', 'E5', 'F6']),
      line('vetroz_12', 'Vétroz', C.rose, ['K7', 'J7', 'I7', 'H7', 'G7', 'F7']),
      line('sion_12', 'Sion', C.cyan, ['K2', 'J2', 'I2', 'H2', 'G2', 'F2']),
      line('sierre_12', 'Sierre', C.red, ['A7', 'B7', 'C7', 'D7', 'E7', 'F7']),
      line('martigny_12', 'Martigny', C.yellow, ['G1', 'G2', 'G3', 'G4', 'G5', 'G6']),
      line('riddes_12', 'Riddes', C.violet, ['K6', 'J5', 'I4', 'H3', 'G2', 'F1']),
    ],
  },
]

export function pickMetroMap(rng: Rng): MetroMap {
  return pick(rng, METRO_MAPS)
}

/** Première case = emplacement du nom (étiquette). */
export function labelCell(line: MetroLine): MetroCell {
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
 * Exactement 5 questions, ordre mélangé, libellés « gare » / « métro de ».
 */
export function generateMetroQuestions(rng: Rng, map: MetroMap): MetroQuestion[] {
  const lines = shuffle(rng, map.lines)
  const crossings = shuffle(rng, allCrossings(map))

  const lineForLabel = lines[0]!
  const crossing =
    crossings[0] ??
    (() => {
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

  const questions: MetroQuestion[] = [
    {
      prompt: `Où se trouve la gare de ${lineForLabel.name} ?`,
      answer: labelCell(lineForLabel),
    },
    {
      prompt: `Dans quelle case se croisent les métros de ${crossing.a.name} et de ${crossing.b.name} ?`,
      answer: crossing.cell,
    },
    {
      prompt: `Quelle gare se trouve dans la case ${labelOf} ?`,
      answer: labeledLine.name,
    },
    {
      prompt: `Par quelles cases passe le métro de ${pathLine.name} ?`,
      answer: formatCellList(pathLine.cells),
    },
    {
      prompt: `Dans quelles cases se trouvent les stations de départ et d'arrivée du métro de ${terminiLine.name} ?`,
      answer: `${start} et ${end}`,
    },
  ]
  return shuffle(rng, questions)
}
