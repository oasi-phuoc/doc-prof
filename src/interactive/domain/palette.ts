export const PALETTE = [
  {
    letter: 'A',
    color: '#F6E5A2',
    ink: '#182238',
    symbol: '●',
    shape: 'cercle',
  },
  {
    letter: 'B',
    color: '#F2C3D0',
    ink: '#182238',
    symbol: '■',
    shape: 'carré',
  },
  {
    letter: 'C',
    color: '#F7D3B1',
    ink: '#182238',
    symbol: '▲',
    shape: 'triangle',
  },
  {
    letter: 'D',
    color: '#BFD7F2',
    ink: '#182238',
    symbol: '◆',
    shape: 'losange',
  },
  {
    letter: 'E',
    color: '#BDE3D5',
    ink: '#182238',
    symbol: '★',
    shape: 'étoile',
  },
  {
    letter: 'F',
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
] as const
export type ShapeId = (typeof SHAPES)[number]['id']
export const defaultShapes: ShapeId[] = SHAPES.map((s) => s.id)

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
