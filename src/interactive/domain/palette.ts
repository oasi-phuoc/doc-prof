export const PALETTE = [
  {
    letter: 'A',
    color: '#F4C84B',
    ink: '#182238',
    symbol: '●',
    shape: 'cercle',
  },
  {
    letter: 'B',
    color: '#CC3456',
    ink: '#FFFFFF',
    symbol: '■',
    shape: 'carré',
  },
  {
    letter: 'C',
    color: '#E98C2F',
    ink: '#182238',
    symbol: '▲',
    shape: 'triangle',
  },
  {
    letter: 'D',
    color: '#2463C5',
    ink: '#FFFFFF',
    symbol: '◆',
    shape: 'losange',
  },
  {
    letter: 'E',
    color: '#188268',
    ink: '#FFFFFF',
    symbol: '★',
    shape: 'étoile',
  },
  {
    letter: 'F',
    color: '#7643D6',
    ink: '#FFFFFF',
    symbol: '✚',
    shape: 'croix',
  },
] as const

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
