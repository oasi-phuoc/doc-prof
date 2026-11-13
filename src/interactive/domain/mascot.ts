import type { CSSProperties } from 'react'

const oldSheet = (id: string) => ({ src: `/lib/images/interactive/${id}-mascot.webp`, columns: 3, rows: 2, offset: 0 })
const atlas = (name: string, row: number) => ({ src: `/lib/images/interactive/mascots-${name}.png`, columns: 6, rows: 6, offset: row * 6 })
export const MASCOTS = [
  { id: 'leaf', label: 'Esprit feuille', sheet: oldSheet('leaf') },
  { id: 'owl', label: 'Hibou', sheet: oldSheet('owl') },
  { id: 'octopus', label: 'Pieuvre', sheet: oldSheet('octopus') },
  { id: 'hedgehog', label: 'Hérisson', sheet: oldSheet('hedgehog') },
  { id: 'rabbit', label: 'Lapin lunaire', sheet: oldSheet('rabbit') },
  { id: 'dragon', label: 'Dragon', sheet: oldSheet('dragon') },
  { id: 'rat', label: 'Rat', sheet: atlas('zodiac-a', 0) },
  { id: 'ox', label: 'Bœuf', sheet: atlas('zodiac-a', 1) },
  { id: 'tiger', label: 'Tigre', sheet: atlas('zodiac-a', 2) },
  { id: 'snake', label: 'Serpent', sheet: atlas('zodiac-a', 3) },
  { id: 'horse', label: 'Cheval', sheet: atlas('zodiac-a', 4) },
  { id: 'goat', label: 'Chèvre', sheet: atlas('zodiac-a', 5) },
  { id: 'monkey', label: 'Singe', sheet: atlas('zodiac-b', 0) },
  { id: 'rooster', label: 'Coq', sheet: atlas('zodiac-b', 1) },
  { id: 'dog', label: 'Chien Shiba', sheet: atlas('zodiac-b', 2) },
  { id: 'boar', label: 'Sanglier', sheet: atlas('zodiac-b', 3) },
  { id: 'panda', label: 'Panda', sheet: atlas('zodiac-b', 4) },
  { id: 'fox', label: 'Renard', sheet: atlas('zodiac-b', 5) },
  { id: 'tanuki', label: 'Tanuki', sheet: atlas('nature', 0) },
  { id: 'otter', label: 'Loutre', sheet: atlas('nature', 1) },
  { id: 'koala', label: 'Koala', sheet: atlas('nature', 2) },
  { id: 'turtle', label: 'Tortue', sheet: atlas('nature', 3) },
  { id: 'axolotl', label: 'Axolotl', sheet: atlas('nature', 4) },
  { id: 'leopard', label: 'Panthère des neiges', sheet: atlas('nature', 5) },
  { id: 'crane', label: 'Grue', sheet: atlas('spirits', 0) },
  { id: 'cat', label: 'Chat porte-bonheur', sheet: atlas('spirits', 1) },
  { id: 'koi', label: 'Carpe koï', sheet: atlas('spirits', 2) },
  { id: 'red-panda', label: 'Panda roux', sheet: atlas('spirits', 3) },
  { id: 'penguin', label: 'Manchot', sheet: atlas('spirits', 4) },
  { id: 'kitsune', label: 'Kitsune', sheet: atlas('spirits', 5) },
] as const
export type MascotKind = typeof MASCOTS[number]['id']
export const MASCOT_POSES = ['thinking', 'cards-up', 'discussion', 'correct', 'incorrect', 'pause'] as const
export type MascotPose = typeof MASCOT_POSES[number]
export const MASCOT_IMAGES = [...new Set(MASCOTS.map(mascot => mascot.sheet.src))]

export function mascotStyle(kind: MascotKind, resolve: (source: string) => string = source => source): CSSProperties {
  const {sheet} = MASCOTS.find(mascot => mascot.id === kind) ?? MASCOTS[0]
  const style: Record<string,string> = { '--ci-mascot-image': `url('${resolve(sheet.src)}')`, '--ci-mascot-size': `${sheet.columns * 100}% ${sheet.rows * 100}%` }
  for (const [index,pose] of MASCOT_POSES.entries()) {
    const frame = sheet.offset + index
    style[`--ci-${pose}-x`] = `${(frame % sheet.columns) * 100 / (sheet.columns - 1)}%`
    style[`--ci-${pose}-y`] = `${Math.floor(frame / sheet.columns) * 100 / (sheet.rows - 1)}%`
  }
  return style as CSSProperties
}
