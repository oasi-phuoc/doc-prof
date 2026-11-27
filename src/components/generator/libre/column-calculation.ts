import { columnItem, divisionColumnItem, twoDigitMulItem } from '@/math/column-arith'
import type { MathItem } from '@/math/types'

function fitsDecimals(number: number, places: number): boolean {
  const scaled = number * 10 ** places
  return Math.abs(scaled - Math.round(scaled)) < 1e-7
}

export function updateColumnCalculation(item: MathItem, exerciseType: string, a: number, b: number):
  { item: MathItem } | { error: string } {
  const op = item.op
  if (!op || !Number.isFinite(a) || !Number.isFinite(b) || a < 0 || b < 0) {
    return { error: 'Saisissez deux nombres positifs ou nuls.' }
  }
  if (op === '−' && a < b) return { error: 'Le premier nombre doit être au moins égal au second.' }
  if (op === '÷' && b === 0) return { error: 'Le diviseur doit être différent de zéro.' }
  const twoDigits = exerciseType.startsWith('multiplication-2chiffres')
  const maxDigitsB = op === '×' && !twoDigits ? 9 : 99
  if ((op === '×' || op === '÷') && (!Number.isInteger(b) || b > maxDigitsB || (twoDigits && b < 10))) {
    return { error: twoDigits ? 'Saisissez un multiplicateur à deux chiffres.' : `Saisissez un entier entre ${op === '÷' ? 1 : 0} et ${maxDigitsB}.` }
  }
  const decimal = exerciseType.startsWith('decimaux-') || Boolean(item.decimalPlaces &&
    (op !== '÷' || !Number.isInteger(item.a ?? item.dividend)))
  const places = decimal ? 3 : 0
  if (!fitsDecimals(a, places) || !fitsDecimals(b, places)) {
    return { error: decimal ? 'Saisissez au plus trois décimales.' : 'Saisissez un nombre entier.' }
  }
  const result = op === '+' ? a + b : op === '−' ? a - b : op === '×' ? a * b : a / b
  if (!Number.isFinite(result)) return { error: 'Le résultat dépasse la capacité de la grille.' }
  if (op === '÷' && decimal && !fitsDecimals(result, places)) {
    return { error: 'Choisissez une division dont le quotient est exact avec au plus trois décimales.' }
  }
  const empty = item.layout === 'column-empty' || Boolean(item.blankOperands)
  const built = op === '÷' ? divisionColumnItem(a, b, empty, decimal ? undefined : 0)
    : twoDigits ? twoDigitMulItem(a, b, empty)
      : columnItem(op, a, b, result, empty)
  if (Math.max(built.digitsA?.length ?? 0, built.digitsResult?.length ?? 0) > 9) {
    return { error: 'Le calcul dépasse les neuf colonnes de la grille.' }
  }
  return { item: { ...item, ...built, libreError: undefined } }
}
