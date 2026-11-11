export const PALETTE = [
  {
    letter: 'A',
    name: 'Jaune',
    color: '#F6E5A2',
    ink: '#182238',
    symbol: '●',
    shape: 'cercle',
  },
  {
    letter: 'B',
    name: 'Rose',
    color: '#F2C3D0',
    ink: '#182238',
    symbol: '■',
    shape: 'carré',
  },
  {
    letter: 'C',
    name: 'Orange',
    color: '#F7D3B1',
    ink: '#182238',
    symbol: '▲',
    shape: 'triangle',
  },
  {
    letter: 'D',
    name: 'Bleu',
    color: '#BFD7F2',
    ink: '#182238',
    symbol: '◆',
    shape: 'losange',
  },
  {
    letter: 'E',
    name: 'Vert',
    color: '#BDE3D5',
    ink: '#182238',
    symbol: '★',
    shape: 'étoile',
  },
  {
    letter: 'F',
    name: 'Violet',
    color: '#D6C9F1',
    ink: '#182238',
    symbol: '✚',
    shape: 'croix',
  },
] as const

export const SHAPES = [
  { id: 'circle', label: 'Cercle' },
  { id: 'square', label: 'Carré' },
  { id: 'triangle', label: 'Triangle' },
  { id: 'diamond', label: 'Losange' },
  { id: 'star', label: 'Étoile' },
  { id: 'cross', label: 'Croix' },
  { id: 'pentagon', label: 'Pentagone' },
  { id: 'heart', label: 'Cœur' },
  { id: 'hexagon', label: 'Hexagone' },
  { id: 'oval', label: 'Ovale' },
  { id: 'moon', label: 'Lune' },
] as const
export type ShapeId = (typeof SHAPES)[number]['id']
/** Shared vector paths for screen, physical cards and teacher printouts. */
export const SHAPE_PATHS = {
  triangle: 'm12 2 11 20H1Z',
  diamond: 'm12 1 11 11-11 11L1 12Z',
  star: 'm12 1 3.4 7 7.6 1.1-5.5 5.4 1.3 7.5L12 18.4 5.2 22l1.3-7.5L1 9.1 8.6 8Z',
  cross: 'M8 1h8v7h7v8h-7v7H8v-7H1V8h7Z',
  pentagon: 'm12 1 11 8-4 13H5L1 9Z',
  hexagon: 'M6 2h12l6 10-6 10H6L0 12Z',
  heart: 'M12 22 2 12C-5 3 7-3 12 5 17-3 29 3 22 12Z',
  moon: 'M17 2a10 10 0 1 0 5 15A11 11 0 0 1 17 2Z',
} as const

export const defaultShapes: ShapeId[] = [
  'circle',
  'square',
  'triangle',
  'diamond',
  'star',
  'cross',
]

/** Keep letters readable when a teacher changes the shared palette. */
export function inkForColor(color: string): string {
  const channels = [1, 3, 5].map(
    (i) => parseInt(color.slice(i, i + 2), 16) / 255,
  )
  const linear = channels.map((v) =>
    v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4,
  )
  const luminance =
    0.2126 * linear[0]! + 0.7152 * linear[1]! + 0.0722 * linear[2]!
  return luminance > 0.179 ? '#000000' : '#FFFFFF'
}
