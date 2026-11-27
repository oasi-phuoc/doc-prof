import { createRng, shuffle } from '@/math/rng'
import type { MathItem } from '@/math/types'

export type SyllablePair = NonNullable<MathItem['vocabPairs']>[number]

function groups<T>(items: readonly T[], columns: number): readonly (readonly T[])[] {
  if (columns !== 2) return [items]
  const middle = Math.ceil(items.length / 2)
  return [items.slice(0, middle), items.slice(middle)]
}

export function syllableMatchOrder(item: MathItem): number[] {
  const pairs = item.vocabPairs ?? []
  const columns = item.letterGridCols ?? 1
  const byColumn = groups(pairs.map((pair, index) => ({ ...pair, index })), columns)
  return groups(item.options ?? [], columns).flatMap((options, column) => {
    const available = [...(byColumn[column] ?? [])]
    return options.map((part) => {
      const match = available.findIndex(({ right }) => right === part)
      return match === -1 ? -1 : available.splice(match, 1)[0]!.index
    })
  })
}

export function withSyllablePairs(item: MathItem, pairs: SyllablePair[], columns: number, order?: number[], seed = 1): MathItem {
  const indices = pairs.map((_, index) => index)
  const nextOrder = order?.length === pairs.length && order.every((index) => index >= 0)
    ? order
    : groups(indices, columns).flatMap((batch, column) => shuffle(createRng(seed + column), [...batch]))
  return {
    ...item,
    vocabPairs: pairs,
    labels: pairs.map(({ left }) => left),
    options: nextOrder.map((index) => pairs[index]!.right),
    letterGridCols: columns,
    letterGridVariant: columns === 2 ? 'table' : undefined,
    answer: pairs.map(({ left, right }) => `${left} + ${right} → ${left}${right}`).join(' · '),
  }
}
