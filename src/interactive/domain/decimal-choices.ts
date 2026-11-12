import { createRng, shuffle } from '@/math/rng'

import { formatDecimal } from './exact-math'

/** One fixed-point scale per question keeps IDs, labels and numeric sorting exact. */
export function decimalChoices(value: bigint, precision: number, step: bigint, correctText: string, seed: number, signed = false) {
  const offsets = [step, -step, 1n, -1n, 10n, -10n, 2n, -2n, 100n, -100n, step * 2n, -step * 2n, 3n, 4n, 5n]
  const values = [...new Set([value, ...offsets.map((offset) => value + offset), ...(signed ? [-value] : [])])].filter((n) => signed || value < 0n || n >= 0n)
  const rng = createRng(seed)
  const candidates = shuffle(rng, [value, ...shuffle(rng, values.filter((n) => n !== value)).slice(0, 5)])
  return { correctId: `n${value}`, choices: candidates.map((n) => ({ id: `n${n}`, text: n === value ? correctText : formatDecimal(n, precision) })) }
}
