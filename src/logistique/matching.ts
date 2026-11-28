import type { MathItem } from '@/math/types'

export type LogistiquePair = { left: string; right: string }

export function validLogistiquePairs(pairs: unknown): pairs is LogistiquePair[] {
  if (!Array.isArray(pairs) || pairs.length < 2 || pairs.length > 6 || !pairs.every((pair) => pair &&
    typeof pair.left === 'string' && pair.left.trim() && pair.left.length <= 52 &&
    typeof pair.right === 'string' && pair.right.trim() && pair.right.length <= 100)) return false
  return new Set(pairs.map(({ left }) => left.trim().toLocaleLowerCase('fr'))).size === pairs.length &&
    new Set(pairs.map(({ right }) => right.trim().toLocaleLowerCase('fr'))).size === pairs.length
}

export function sliceLogistiqueMatch(item: MathItem, start: number, end: number): MathItem {
  const pairs = item.vocabPairs?.slice(start, end) ?? []
  const choices = (item.options ?? []).filter((option) => pairs.some(({ right }) => right === option))
  const ordered = choices.every((option, index) => pairs[index]?.right === option)
  return {
    ...item,
    logistiqueSubquestionOffset: start,
    ...logistiqueMatchContent(pairs, ordered ? [...choices.slice(1), ...choices.slice(0, 1)] : choices),
  }
}

export function logistiqueMatchContent(pairs: LogistiquePair[], choices: string[]): Pick<MathItem, 'vocabPairs' | 'labels' | 'options' | 'answer'> {
  return {
    vocabPairs: pairs,
    labels: pairs.map(({ left }) => left),
    options: choices,
    answer: pairs.map(({ left, right }) => `${left} → ${right}`).join('\n'),
  }
}

export function validLogistiqueMatching(item: MathItem): boolean {
  const pairs = item.vocabPairs
  if (item.logistiqueMatching !== true || item.layout !== 'vocab-match' ||
      (item.logistiqueGaps || item.logistiqueChoice || item.logistiqueTable || item.logistiqueResponseLines)) return false
  if (item.logistiqueLocalModule && item.libreCorrectionPending && Array.isArray(pairs) && pairs.length === 0) {
    return Array.isArray(item.labels) && !item.labels.length && Array.isArray(item.options) && !item.options.length && item.answer === ''
  }
  if (!validLogistiquePairs(pairs)) return false
  return Array.isArray(item.labels) && item.labels.length === pairs.length && pairs.every(({ left }, index) => item.labels?.[index] === left) &&
    Array.isArray(item.options) && item.options.length === pairs.length && pairs.every(({ right }) => item.options?.includes(right)) &&
    item.answer === logistiqueMatchContent(pairs, []).answer
}
