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
 * 4 lignes coudées (non droites) à 10 cellules ; autres traits 6–8 cellules.
 * Gares : Monthey, Vouvry, Martigny, Sion, Sierre, Vétroz, Ardon, Botza,
 * Synecom, Fully, Riddes, Saillon.
 */
export const METRO_MAPS: readonly MetroMap[] = [
  {
    id: 'metro-valais-1',
    cols: [...COLS],
    rows: [...ROWS],
    lines: [
      line('monthey_1', 'Monthey', C.blue, ['B7', 'C6', 'D5', 'E5', 'F5', 'G5', 'H5', 'I6', 'J7', 'K7']),
      line('vouvry_1', 'Vouvry', C.orange, ['A4', 'B4', 'C4', 'D4', 'E4', 'F4']),
      line('martigny_1', 'Martigny', C.green, ['A1', 'B2', 'C3', 'D3', 'E3', 'F3', 'G3', 'H4', 'I5', 'J6']),
      line('sion_1', 'Sion', C.rose, ['B2', 'C2', 'D2', 'E2', 'F2', 'G2', 'H2']),
      line('sierre_1', 'Sierre', C.cyan, ['K1', 'J2', 'I3', 'H3', 'G3', 'F3', 'E3', 'D4', 'C5', 'B6']),
      line('vetroz_1', 'Vétroz', C.red, ['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7']),
      line('ardon_1', 'Ardon', C.yellow, ['A7', 'B6', 'C5', 'D5', 'E5', 'F5', 'G5', 'H4', 'I3', 'J2']),
      line('botza_1', 'Botza', C.violet, ['C7', 'C6', 'C5', 'C4', 'C3', 'C2']),
    ],
  },
  {
    id: 'metro-valais-2',
    cols: [...COLS],
    rows: [...ROWS],
    lines: [
      line('vouvry_2', 'Vouvry', C.blue, ['B2', 'C3', 'D4', 'E5', 'F5', 'G5', 'H5', 'I5', 'J6', 'K7']),
      line('martigny_2', 'Martigny', C.orange, ['K6', 'J6', 'I6', 'H6', 'G6', 'F6']),
      line('sion_2', 'Sion', C.green, ['J6', 'I6', 'H6', 'G6', 'F5', 'E4', 'D3', 'C2', 'B2', 'A2']),
      line('sierre_2', 'Sierre', C.rose, ['A5', 'B5', 'C5', 'D5', 'E5', 'F5', 'G5']),
      line('vetroz_2', 'Vétroz', C.cyan, ['B1', 'C2', 'D3', 'E4', 'F4', 'G4', 'H4', 'I4', 'J5', 'K6']),
      line('ardon_2', 'Ardon', C.red, ['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7']),
      line('botza_2', 'Botza', C.yellow, ['J7', 'I6', 'H5', 'G4', 'F4', 'E4', 'D4', 'C4', 'B5', 'A6']),
      line('synecom_2', 'Synecom', C.violet, ['K3', 'J3', 'I3', 'H3', 'G3', 'F3', 'E3']),
    ],
  },
  {
    id: 'metro-valais-3',
    cols: [...COLS],
    rows: [...ROWS],
    lines: [
      line('martigny_3', 'Martigny', C.blue, ['J1', 'I1', 'H1', 'G2', 'F3', 'E4', 'D5', 'C5', 'B5', 'A5']),
      line('sion_3', 'Sion', C.orange, ['D7', 'D6', 'D5', 'D4', 'D3', 'D2', 'D1']),
      line('sierre_3', 'Sierre', C.green, ['A4', 'B4', 'C4', 'D5', 'E6', 'F7', 'G7', 'H7', 'I6', 'J5']),
      line('vetroz_3', 'Vétroz', C.rose, ['B1', 'C1', 'D1', 'E1', 'F1', 'G1', 'H1', 'I1']),
      line('ardon_3', 'Ardon', C.cyan, ['A2', 'B2', 'C2', 'D3', 'E4', 'F5', 'G6', 'H6', 'I6', 'J6']),
      line('botza_3', 'Botza', C.red, ['F2', 'F3', 'F4', 'F5', 'F6', 'F7']),
      line('synecom_3', 'Synecom', C.yellow, ['A3', 'B4', 'C5', 'D6', 'E6', 'F6', 'G6', 'H5', 'I4', 'J3']),
      line('fully_3', 'Fully', C.violet, ['A7', 'B7', 'C7', 'D7', 'E7', 'F7', 'G7', 'H7']),
    ],
  },
  {
    id: 'metro-valais-4',
    cols: [...COLS],
    rows: [...ROWS],
    lines: [
      line('sion_4', 'Sion', C.blue, ['B7', 'C6', 'D5', 'E5', 'F5', 'G5', 'H5', 'I6', 'J7', 'K7']),
      line('sierre_4', 'Sierre', C.orange, ['A4', 'B4', 'C4', 'D4', 'E4', 'F4']),
      line('vetroz_4', 'Vétroz', C.green, ['A1', 'B2', 'C3', 'D3', 'E3', 'F3', 'G3', 'H4', 'I5', 'J6']),
      line('ardon_4', 'Ardon', C.rose, ['B2', 'C2', 'D2', 'E2', 'F2', 'G2', 'H2']),
      line('botza_4', 'Botza', C.cyan, ['K1', 'J2', 'I3', 'H3', 'G3', 'F3', 'E3', 'D4', 'C5', 'B6']),
      line('synecom_4', 'Synecom', C.red, ['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7']),
      line('fully_4', 'Fully', C.yellow, ['A7', 'B6', 'C5', 'D5', 'E5', 'F5', 'G5', 'H4', 'I3', 'J2']),
      line('riddes_4', 'Riddes', C.violet, ['C7', 'C6', 'C5', 'C4', 'C3', 'C2']),
    ],
  },
  {
    id: 'metro-valais-5',
    cols: [...COLS],
    rows: [...ROWS],
    lines: [
      line('monthey_5', 'Monthey', C.blue, ['B2', 'C3', 'D4', 'E5', 'F5', 'G5', 'H5', 'I5', 'J6', 'K7']),
      line('vouvry_5', 'Vouvry', C.orange, ['K6', 'J6', 'I6', 'H6', 'G6', 'F6']),
      line('martigny_5', 'Martigny', C.green, ['J6', 'I6', 'H6', 'G6', 'F5', 'E4', 'D3', 'C2', 'B2', 'A2']),
      line('sion_5', 'Sion', C.rose, ['A5', 'B5', 'C5', 'D5', 'E5', 'F5', 'G5']),
      line('sierre_5', 'Sierre', C.cyan, ['B1', 'C2', 'D3', 'E4', 'F4', 'G4', 'H4', 'I4', 'J5', 'K6']),
      line('vetroz_5', 'Vétroz', C.red, ['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7']),
      line('ardon_5', 'Ardon', C.yellow, ['J7', 'I6', 'H5', 'G4', 'F4', 'E4', 'D4', 'C4', 'B5', 'A6']),
      line('botza_5', 'Botza', C.violet, ['K3', 'J3', 'I3', 'H3', 'G3', 'F3', 'E3']),
    ],
  },
  {
    id: 'metro-valais-6',
    cols: [...COLS],
    rows: [...ROWS],
    lines: [
      line('vouvry_6', 'Vouvry', C.blue, ['J1', 'I1', 'H1', 'G2', 'F3', 'E4', 'D5', 'C5', 'B5', 'A5']),
      line('martigny_6', 'Martigny', C.orange, ['D7', 'D6', 'D5', 'D4', 'D3', 'D2', 'D1']),
      line('sion_6', 'Sion', C.green, ['A4', 'B4', 'C4', 'D5', 'E6', 'F7', 'G7', 'H7', 'I6', 'J5']),
      line('sierre_6', 'Sierre', C.rose, ['B1', 'C1', 'D1', 'E1', 'F1', 'G1', 'H1', 'I1']),
      line('vetroz_6', 'Vétroz', C.cyan, ['A2', 'B2', 'C2', 'D3', 'E4', 'F5', 'G6', 'H6', 'I6', 'J6']),
      line('ardon_6', 'Ardon', C.red, ['F2', 'F3', 'F4', 'F5', 'F6', 'F7']),
      line('botza_6', 'Botza', C.yellow, ['A3', 'B4', 'C5', 'D6', 'E6', 'F6', 'G6', 'H5', 'I4', 'J3']),
      line('synecom_6', 'Synecom', C.violet, ['A7', 'B7', 'C7', 'D7', 'E7', 'F7', 'G7', 'H7']),
    ],
  },
  {
    id: 'metro-valais-7',
    cols: [...COLS],
    rows: [...ROWS],
    lines: [
      line('martigny_7', 'Martigny', C.blue, ['B7', 'C6', 'D5', 'E5', 'F5', 'G5', 'H5', 'I6', 'J7', 'K7']),
      line('sion_7', 'Sion', C.orange, ['A4', 'B4', 'C4', 'D4', 'E4', 'F4']),
      line('sierre_7', 'Sierre', C.green, ['A1', 'B2', 'C3', 'D3', 'E3', 'F3', 'G3', 'H4', 'I5', 'J6']),
      line('vetroz_7', 'Vétroz', C.rose, ['B2', 'C2', 'D2', 'E2', 'F2', 'G2', 'H2']),
      line('ardon_7', 'Ardon', C.cyan, ['K1', 'J2', 'I3', 'H3', 'G3', 'F3', 'E3', 'D4', 'C5', 'B6']),
      line('botza_7', 'Botza', C.red, ['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7']),
      line('synecom_7', 'Synecom', C.yellow, ['A7', 'B6', 'C5', 'D5', 'E5', 'F5', 'G5', 'H4', 'I3', 'J2']),
      line('fully_7', 'Fully', C.violet, ['C7', 'C6', 'C5', 'C4', 'C3', 'C2']),
    ],
  },
  {
    id: 'metro-valais-8',
    cols: [...COLS],
    rows: [...ROWS],
    lines: [
      line('sion_8', 'Sion', C.blue, ['B2', 'C3', 'D4', 'E5', 'F5', 'G5', 'H5', 'I5', 'J6', 'K7']),
      line('sierre_8', 'Sierre', C.orange, ['K6', 'J6', 'I6', 'H6', 'G6', 'F6']),
      line('vetroz_8', 'Vétroz', C.green, ['J6', 'I6', 'H6', 'G6', 'F5', 'E4', 'D3', 'C2', 'B2', 'A2']),
      line('ardon_8', 'Ardon', C.rose, ['A5', 'B5', 'C5', 'D5', 'E5', 'F5', 'G5']),
      line('botza_8', 'Botza', C.cyan, ['B1', 'C2', 'D3', 'E4', 'F4', 'G4', 'H4', 'I4', 'J5', 'K6']),
      line('synecom_8', 'Synecom', C.red, ['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7']),
      line('fully_8', 'Fully', C.yellow, ['J7', 'I6', 'H5', 'G4', 'F4', 'E4', 'D4', 'C4', 'B5', 'A6']),
      line('riddes_8', 'Riddes', C.violet, ['K3', 'J3', 'I3', 'H3', 'G3', 'F3', 'E3']),
    ],
  },
  {
    id: 'metro-valais-9',
    cols: [...COLS],
    rows: [...ROWS],
    lines: [
      line('monthey_9', 'Monthey', C.blue, ['J1', 'I1', 'H1', 'G2', 'F3', 'E4', 'D5', 'C5', 'B5', 'A5']),
      line('vouvry_9', 'Vouvry', C.orange, ['D7', 'D6', 'D5', 'D4', 'D3', 'D2', 'D1']),
      line('martigny_9', 'Martigny', C.green, ['A4', 'B4', 'C4', 'D5', 'E6', 'F7', 'G7', 'H7', 'I6', 'J5']),
      line('sion_9', 'Sion', C.rose, ['B1', 'C1', 'D1', 'E1', 'F1', 'G1', 'H1', 'I1']),
      line('sierre_9', 'Sierre', C.cyan, ['A2', 'B2', 'C2', 'D3', 'E4', 'F5', 'G6', 'H6', 'I6', 'J6']),
      line('vetroz_9', 'Vétroz', C.red, ['F2', 'F3', 'F4', 'F5', 'F6', 'F7']),
      line('ardon_9', 'Ardon', C.yellow, ['A3', 'B4', 'C5', 'D6', 'E6', 'F6', 'G6', 'H5', 'I4', 'J3']),
      line('botza_9', 'Botza', C.violet, ['A7', 'B7', 'C7', 'D7', 'E7', 'F7', 'G7', 'H7']),
    ],
  },
  {
    id: 'metro-valais-10',
    cols: [...COLS],
    rows: [...ROWS],
    lines: [
      line('vouvry_10', 'Vouvry', C.blue, ['B7', 'C6', 'D5', 'E5', 'F5', 'G5', 'H5', 'I6', 'J7', 'K7']),
      line('martigny_10', 'Martigny', C.orange, ['A4', 'B4', 'C4', 'D4', 'E4', 'F4']),
      line('sion_10', 'Sion', C.green, ['A1', 'B2', 'C3', 'D3', 'E3', 'F3', 'G3', 'H4', 'I5', 'J6']),
      line('sierre_10', 'Sierre', C.rose, ['B2', 'C2', 'D2', 'E2', 'F2', 'G2', 'H2']),
      line('vetroz_10', 'Vétroz', C.cyan, ['K1', 'J2', 'I3', 'H3', 'G3', 'F3', 'E3', 'D4', 'C5', 'B6']),
      line('ardon_10', 'Ardon', C.red, ['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7']),
      line('botza_10', 'Botza', C.yellow, ['A7', 'B6', 'C5', 'D5', 'E5', 'F5', 'G5', 'H4', 'I3', 'J2']),
      line('synecom_10', 'Synecom', C.violet, ['C7', 'C6', 'C5', 'C4', 'C3', 'C2']),
    ],
  },
  {
    id: 'metro-valais-11',
    cols: [...COLS],
    rows: [...ROWS],
    lines: [
      line('martigny_11', 'Martigny', C.blue, ['B2', 'C3', 'D4', 'E5', 'F5', 'G5', 'H5', 'I5', 'J6', 'K7']),
      line('sion_11', 'Sion', C.orange, ['K6', 'J6', 'I6', 'H6', 'G6', 'F6']),
      line('sierre_11', 'Sierre', C.green, ['J6', 'I6', 'H6', 'G6', 'F5', 'E4', 'D3', 'C2', 'B2', 'A2']),
      line('vetroz_11', 'Vétroz', C.rose, ['A5', 'B5', 'C5', 'D5', 'E5', 'F5', 'G5']),
      line('ardon_11', 'Ardon', C.cyan, ['B1', 'C2', 'D3', 'E4', 'F4', 'G4', 'H4', 'I4', 'J5', 'K6']),
      line('botza_11', 'Botza', C.red, ['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7']),
      line('synecom_11', 'Synecom', C.yellow, ['J7', 'I6', 'H5', 'G4', 'F4', 'E4', 'D4', 'C4', 'B5', 'A6']),
      line('fully_11', 'Fully', C.violet, ['K3', 'J3', 'I3', 'H3', 'G3', 'F3', 'E3']),
    ],
  },
  {
    id: 'metro-valais-12',
    cols: [...COLS],
    rows: [...ROWS],
    lines: [
      line('sion_12', 'Sion', C.blue, ['J1', 'I1', 'H1', 'G2', 'F3', 'E4', 'D5', 'C5', 'B5', 'A5']),
      line('sierre_12', 'Sierre', C.orange, ['D7', 'D6', 'D5', 'D4', 'D3', 'D2', 'D1']),
      line('vetroz_12', 'Vétroz', C.green, ['A4', 'B4', 'C4', 'D5', 'E6', 'F7', 'G7', 'H7', 'I6', 'J5']),
      line('ardon_12', 'Ardon', C.rose, ['B1', 'C1', 'D1', 'E1', 'F1', 'G1', 'H1', 'I1']),
      line('botza_12', 'Botza', C.cyan, ['A2', 'B2', 'C2', 'D3', 'E4', 'F5', 'G6', 'H6', 'I6', 'J6']),
      line('synecom_12', 'Synecom', C.red, ['F2', 'F3', 'F4', 'F5', 'F6', 'F7']),
      line('fully_12', 'Fully', C.yellow, ['A3', 'B4', 'C5', 'D6', 'E6', 'F6', 'G6', 'H5', 'I4', 'J3']),
      line('riddes_12', 'Riddes', C.violet, ['A7', 'B7', 'C7', 'D7', 'E7', 'F7', 'G7', 'H7']),
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
