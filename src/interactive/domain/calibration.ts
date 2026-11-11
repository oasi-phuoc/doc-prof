import { canonicalJson, hash } from './seeds'
import { inkForColor, type ShapeId } from './palette'

export type PaletteCalibration = { paletteVersion: number; paletteHash: string; confirmedAt: number }
export function paletteFingerprint(colors: string[], shapes: ShapeId[]): string { return `palette-${hash(canonicalJson({ colors: colors.map((color) => color.toUpperCase()), shapes }))}` }
export function luminance(color: string): number {
  const channels = [1, 3, 5].map((index) => parseInt(color.slice(index, index + 2), 16) / 255).map((channel) => channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4)
  return .2126 * channels[0]! + .7152 * channels[1]! + .0722 * channels[2]!
}
export function contrastRatio(a: string, b: string): number { const x = luminance(a), y = luminance(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05) }
export function paletteContrast(colors: string[]) { return colors.map((color) => ({ text: contrastRatio(color, inkForColor(color)), outer: contrastRatio('#182238', '#F7F8FC'), selection: Math.max(contrastRatio(color, '#FFFFFF'), contrastRatio(color, '#182238')) })) }
export function calibrationMatches(colors: string[], shapes: ShapeId[], version: number, value?: PaletteCalibration): boolean { return !!value && value.paletteVersion === version && value.paletteHash === paletteFingerprint(colors, shapes) }
