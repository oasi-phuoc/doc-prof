/**
 * Plans de métro TCM CFR — grilles lettres × numéros, lignes colorées,
 * noms de lieux suisses romands.
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
 * Plans distincts (A–K × 1–7). L’étiquette d’une ligne = première case.
 * Les premières cases sont espacées pour limiter les chevauchements de noms.
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
      line('neuchatel2', 'Neuchâtel', C.gold, ['A1', 'B1', 'C1', 'D1', 'E1']),
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
      line('berne3', 'Berne', C.rose, ['H6', 'H5', 'H4', 'H3', 'H2']),
      line('neuchatel3', 'Neuchâtel', C.cyan, ['E7', 'F7', 'G7', 'H7', 'I7']),
      line('bienne3', 'Bienne', C.red, ['K6', 'J5', 'I4', 'H3', 'G2']),
      line('basel2', 'Bâle', C.gold, ['K3', 'J3', 'I3', 'H3', 'G3']),
      line('lucerne2', 'Lucerne', C.purple, ['F1', 'F2', 'F3', 'F4', 'F5']),
      line('zurich2', 'Zurich', C.lime, ['K5', 'J5', 'I5', 'H5', 'G5', 'F5', 'E5']),
    ],
  },
  // —— 10 situations supplémentaires ——
  {
    id: 'metro-riviera',
    cols: [...COLS],
    rows: [...ROWS],
    lines: [
      line('vevey3', 'Vevey', C.blue, ['A7', 'B7', 'C7', 'D7', 'E7']),
      line('montreux4', 'Montreux', C.orange, ['K6', 'J6', 'I6', 'H6', 'G6', 'F6']),
      line('nyon3', 'Nyon', C.green, ['B1', 'B2', 'B3', 'B4', 'B5']),
      line('geneve5', 'Genève', C.rose, ['A3', 'B3', 'C3', 'D3', 'E3', 'F3']),
      line('lausanne5', 'Lausanne', C.cyan, ['D1', 'E2', 'F3', 'G4', 'H5']),
      line('sion4', 'Sion', C.red, ['K1', 'J1', 'I1', 'H1', 'G1']),
      line('sierre3', 'Sierre', C.gold, ['K4', 'J3', 'I2', 'H1']),
      line('fribourg4', 'Fribourg', C.purple, ['G7', 'G6', 'G5', 'G4', 'G3']),
    ],
  },
  {
    id: 'metro-jura-sud',
    cols: [...COLS],
    rows: [...ROWS],
    lines: [
      line('delémont', 'Delémont', C.teal, ['A6', 'B6', 'C6', 'D6', 'E6']),
      line('porrentruy', 'Porrentruy', C.orange, ['A1', 'B2', 'C3', 'D4', 'E5']),
      line('bienne4', 'Bienne', C.blue, ['F7', 'F6', 'F5', 'F4', 'F3', 'F2']),
      line('neuchatel4', 'Neuchâtel', C.green, ['H1', 'H2', 'H3', 'H4', 'H5', 'H6']),
      line('yverdon3', 'Yverdon', C.rose, ['K7', 'J7', 'I7', 'H7', 'G7']),
      line('lausanne6', 'Lausanne', C.red, ['K2', 'J2', 'I2', 'H2', 'G2']),
      line('berne4', 'Berne', C.gold, ['C1', 'D1', 'E1', 'F1', 'G1']),
      line('basel3', 'Bâle', C.purple, ['K5', 'J4', 'I3', 'H2']),
    ],
  },
  {
    id: 'metro-leman-est',
    cols: [...COLS],
    rows: [...ROWS],
    lines: [
      line('aigle', 'Aigle', C.blue, ['A5', 'B5', 'C5', 'D5', 'E5', 'F5']),
      line('bex', 'Bex', C.orange, ['A7', 'A6', 'A5', 'A4', 'A3']),
      line('monthey', 'Monthey', C.green, ['C1', 'D2', 'E3', 'F4', 'G5']),
      line('sion5', 'Sion', C.rose, ['K7', 'K6', 'K5', 'K4', 'K3']),
      line('sierre4', 'Sierre', C.cyan, ['G7', 'G6', 'G5', 'G4', 'G3', 'G2']),
      line('martigny', 'Martigny', C.red, ['B1', 'C1', 'D1', 'E1', 'F1']),
      line('montreux5', 'Montreux', C.gold, ['I1', 'I2', 'I3', 'I4', 'I5']),
      line('vevey4', 'Vevey', C.purple, ['K1', 'J2', 'I3', 'H4', 'G5']),
    ],
  },
  {
    id: 'metro-centre',
    cols: [...COLS],
    rows: [...ROWS],
    lines: [
      line('fribourg5', 'Fribourg', C.blue, ['B7', 'B6', 'B5', 'B4', 'B3', 'B2']),
      line('berne5', 'Berne', C.orange, ['A4', 'B4', 'C4', 'D4', 'E4', 'F4']),
      line('thun', 'Thoune', C.green, ['D7', 'E6', 'F5', 'G4', 'H3']),
      line('interlaken', 'Interlaken', C.rose, ['K6', 'J6', 'I6', 'H6', 'G6']),
      line('lucerne3', 'Lucerne', C.cyan, ['K1', 'J1', 'I1', 'H1', 'G1', 'F1']),
      line('zurich3', 'Zurich', C.red, ['A1', 'A2', 'A3', 'A4', 'A5']),
      line('olten', 'Olten', C.gold, ['E1', 'E2', 'E3', 'E4', 'E5']),
      line('bienne5', 'Bienne', C.purple, ['K3', 'J3', 'I3', 'H3', 'G3']),
    ],
  },
  {
    id: 'metro-ouest',
    cols: [...COLS],
    rows: [...ROWS],
    lines: [
      line('geneve6', 'Genève', C.blue, ['A7', 'B6', 'C5', 'D4', 'E3']),
      line('annemasse', 'Annemasse', C.orange, ['K7', 'J7', 'I7', 'H7', 'G7']),
      line('nyon4', 'Nyon', C.green, ['A2', 'B2', 'C2', 'D2', 'E2', 'F2', 'G2']),
      line('morges', 'Morges', C.rose, ['C7', 'C6', 'C5', 'C4', 'C3']),
      line('lausanne7', 'Lausanne', C.cyan, ['F7', 'F6', 'F5', 'F4', 'F3', 'F2']),
      line('renens', 'Renens', C.red, ['H1', 'H2', 'H3', 'H4', 'H5']),
      line('yverdon4', 'Yverdon', C.gold, ['K2', 'J2', 'I2', 'H2', 'G2']),
      line('neuchatel5', 'Neuchâtel', C.purple, ['K5', 'J4', 'I3', 'H2']),
    ],
  },
  {
    id: 'metro-alpin',
    cols: [...COLS],
    rows: [...ROWS],
    lines: [
      line('sion6', 'Sion', C.blue, ['A4', 'B4', 'C4', 'D4', 'E4', 'F4', 'G4']),
      line('brig', 'Brigue', C.orange, ['A7', 'B7', 'C7', 'D7', 'E7']),
      line('visp', 'Viège', C.green, ['K6', 'J5', 'I4', 'H3', 'G2']),
      line('zermatt', 'Zermatt', C.rose, ['K1', 'J1', 'I1', 'H1', 'G1']),
      line('sierre5', 'Sierre', C.cyan, ['B1', 'B2', 'B3', 'B4', 'B5']),
      line('martigny2', 'Martigny', C.red, ['D1', 'E2', 'F3', 'G4', 'H5']),
      line('montreux6', 'Montreux', C.gold, ['K3', 'J3', 'I3', 'H3', 'G3']),
      line('aigle2', 'Aigle', C.purple, ['F7', 'F6', 'F5', 'F4', 'F3']),
    ],
  },
  {
    id: 'metro-trois-lacs',
    cols: [...COLS],
    rows: [...ROWS],
    lines: [
      line('neuchatel6', 'Neuchâtel', C.blue, ['A3', 'B3', 'C3', 'D3', 'E3', 'F3']),
      line('bienne6', 'Bienne', C.orange, ['A7', 'A6', 'A5', 'A4', 'A3', 'A2']),
      line('morat', 'Morat', C.green, ['C7', 'D6', 'E5', 'F4', 'G3']),
      line('yverdon5', 'Yverdon', C.rose, ['K7', 'J6', 'I5', 'H4', 'G3']),
      line('fribourg6', 'Fribourg', C.cyan, ['K1', 'J1', 'I1', 'H1', 'G1', 'F1']),
      line('berne6', 'Berne', C.red, ['E7', 'E6', 'E5', 'E4', 'E3']),
      line('lausanne8', 'Lausanne', C.gold, ['K4', 'J4', 'I4', 'H4', 'G4']),
      line('estavayer', 'Estavayer', C.purple, ['B1', 'C1', 'D1', 'E1', 'F1']),
    ],
  },
  {
    id: 'metro-genevois',
    cols: [...COLS],
    rows: [...ROWS],
    lines: [
      line('geneve7', 'Genève', C.blue, ['D7', 'D6', 'D5', 'D4', 'D3', 'D2', 'D1']),
      line('carouge', 'Carouge', C.orange, ['A5', 'B5', 'C5', 'D5', 'E5']),
      line('meyrin', 'Meyrin', C.green, ['A1', 'B2', 'C3', 'D4', 'E5', 'F6']),
      line('vernier', 'Vernier', C.rose, ['K7', 'J7', 'I7', 'H7', 'G7']),
      line('nyon5', 'Nyon', C.cyan, ['K2', 'J2', 'I2', 'H2', 'G2', 'F2']),
      line('lausanne9', 'Lausanne', C.red, ['A7', 'B7', 'C7', 'D7', 'E7']),
      line('gland', 'Gland', C.gold, ['G1', 'G2', 'G3', 'G4', 'G5']),
      line('coppet', 'Coppet', C.purple, ['K5', 'J4', 'I3', 'H2']),
    ],
  },
  {
    id: 'metro-est-vaudois',
    cols: [...COLS],
    rows: [...ROWS],
    lines: [
      line('lausanne10', 'Lausanne', C.blue, ['A6', 'B6', 'C6', 'D6', 'E6', 'F6']),
      line('pully', 'Pully', C.orange, ['B1', 'B2', 'B3', 'B4', 'B5']),
      line('lutry', 'Lutry', C.green, ['D1', 'E2', 'F3', 'G4', 'H5']),
      line('cully', 'Cully', C.rose, ['K6', 'J6', 'I6', 'H6', 'G6']),
      line('vevey5', 'Vevey', C.cyan, ['K1', 'J1', 'I1', 'H1', 'G1']),
      line('montreux7', 'Montreux', C.red, ['A3', 'B3', 'C3', 'D3', 'E3']),
      line('aigle3', 'Aigle', C.gold, ['F7', 'F6', 'F5', 'F4', 'F3', 'F2']),
      line('villeneuve', 'Villeneuve', C.purple, ['K3', 'J3', 'I3', 'H3', 'G3']),
    ],
  },
  {
    id: 'metro-transjurane',
    cols: [...COLS],
    rows: [...ROWS],
    lines: [
      line('bienne7', 'Bienne', C.blue, ['A5', 'B5', 'C5', 'D5', 'E5', 'F5', 'G5']),
      line('neuchatel7', 'Neuchâtel', C.orange, ['A1', 'B1', 'C1', 'D1', 'E1']),
      line('chaux', 'La Chaux-de-Fonds', C.green, ['A7', 'B6', 'C5', 'D4', 'E3']),
      line('locle', 'Le Locle', C.rose, ['K7', 'J7', 'I7', 'H7', 'G7']),
      line('yverdon6', 'Yverdon', C.cyan, ['K1', 'J2', 'I3', 'H4', 'G5']),
      line('fribourg7', 'Fribourg', C.red, ['F1', 'F2', 'F3', 'F4', 'F5', 'F6']),
      line('berne7', 'Berne', C.gold, ['K4', 'J4', 'I4', 'H4', 'G4']),
      line('mouteir', 'Moutier', C.purple, ['C7', 'C6', 'C5', 'C4', 'C3']),
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
