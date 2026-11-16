import { clampFracDenom } from '../../math/fraction-shapes'
import type { ShapeKind } from '@/components/math/FractionShape'

export type FractionFigure = { kind: Exclude<ShapeKind, 'grid'>; colored: boolean[] }
export const FRACTION_FIGURE_FEATURE = 'fraction-figures-v1'
const kinds = new Set(['rect', 'square', 'triangle', 'circle', 'semicircle', 'quartercircle', 'hexagon'])

/** Only the visible partitions cross the room boundary, with no answer flag,
 * arbitrary SVG, event handler, or unsupported subdivision. */
export function validFractionFigure(value: unknown): value is FractionFigure {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const figure = value as Record<string, unknown>
  return Object.keys(figure).length === 2 && typeof figure.kind === 'string' && kinds.has(figure.kind) &&
    Array.isArray(figure.colored) && figure.colored.length >= 1 && figure.colored.length <= 20 &&
    Array.from(figure.colored).every(part => typeof part === 'boolean') &&
    clampFracDenom(figure.kind as ShapeKind, figure.colored.length) === figure.colored.length
}

const names: Record<FractionFigure['kind'], string> = { rect: 'Rectangle', square: 'Carré', triangle: 'Triangle', circle: 'Disque', semicircle: 'Demi-disque', quartercircle: 'Quart de disque', hexagon: 'Hexagone' }
export function fractionFigureDescription(figure: FractionFigure): string {
  const count = figure.colored.filter(Boolean).length
  const colored = count ? `${count} ${count > 1 ? 'coloriées' : 'coloriée'}` : 'aucune coloriée'
  return `${names[figure.kind]} partagé en ${figure.colored.length} ${figure.colored.length > 1 ? 'parts égales' : 'part'}, dont ${colored}.`
}
