import type { ArithOp, MissingPos } from '@/math/types'

export type InlineCalculation = { a: number; b: number; result: number; op: ArithOp; missing: MissingPos }

export function updateInlineCalculation(
  current: InlineCalculation,
  change: Partial<InlineCalculation>,
): { calculation: InlineCalculation } | { error: string } {
  const next = { ...current, ...change }
  const changingHole = change.missing !== undefined && Object.keys(change).length === 1
  const editingBlank = (next.missing === 'a' && change.a !== undefined) ||
    (next.missing === 'b' && change.b !== undefined)
  if (!changingHole) {
    const { a, b, result, op, missing } = next
    if (missing === 'result' || editingBlank) {
      if (op === '÷' && b === 0) return { error: 'Le diviseur doit être différent de zéro.' }
      next.result = op === '+' ? a + b : op === '−' ? a - b : op === '×' ? a * b : a / b
    } else if (missing === 'a') {
      if (op === '×' && b === 0) return { error: 'Un facteur nul ne permet pas de retrouver un seul nombre.' }
      next.a = op === '+' ? result - b : op === '−' ? result + b : op === '×' ? result / b : result * b
    } else {
      if (op === '×' && a === 0) return { error: 'Un facteur nul ne permet pas de retrouver un seul nombre.' }
      if (op === '÷' && result === 0) return { error: 'Le diviseur ne peut pas être déduit d’un quotient nul.' }
      next.b = op === '+' ? result - a : op === '−' ? a - result : op === '×' ? result / a : a / result
    }
  }
  if (next.op === '÷' && next.b === 0) return { error: 'Le diviseur doit être différent de zéro.' }
  if (next.op === '÷' && next.missing === 'b' && next.result === 0) {
    return { error: 'Le diviseur ne peut pas être déduit d’un quotient nul.' }
  }
  if (next.op === '×' && ((next.missing === 'a' && next.b === 0) || (next.missing === 'b' && next.a === 0))) {
    return { error: 'Un facteur nul ne permet pas de retrouver un seul nombre.' }
  }
  if (![next.a, next.b, next.result].every(Number.isSafeInteger)) {
    return { error: 'Choisissez des valeurs qui donnent un calcul exact avec des nombres entiers.' }
  }
  return { calculation: next }
}
