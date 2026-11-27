import { fmt } from '@/math/column-arith'
import type { MathItem } from '@/math/types'
import { parseFrNumber } from '@/tpm/libre-parse'
import { recalcTpmLibreItem } from '@/tpm/libre-recalc'

const TYPES = new Set(['nombres-suite', 'tpm-suite', 'tpm-grandes-suites', 'tpm-suites-6', 'tcm-csc-ex04', 'tcm-csc-ex05'])

function sequenceTerms(item: MathItem) {
  const previous = item.answer.split(/\s*;\s*/)
  return (item.sequence ?? []).map((term, index) => term === '□'
    ? previous[item.blankIndexes?.indexOf(index) ?? -1] ?? '' : term)
}

function stepInFamily(value: number, minimum: number, maximum: number, multiple: number, skip: number) {
  const scaled = Math.round(value / multiple)
  return value >= minimum && value <= maximum && Math.abs(value - scaled * multiple) < 0.000001 && scaled % skip !== 0
}

function sequenceError(type: string, index: number, start: number, step: number, length: number) {
  const end = start + step * (length - 1)
  if (type.startsWith('tcm-csc-')) {
    if (!Number.isInteger(start) || !Number.isInteger(step) || step === 0 || Math.min(start, end) < 0 || Math.max(start, end) > 100) {
      return 'La suite doit progresser régulièrement avec des entiers entre 0 et 100.'
    }
    return undefined
  }
  if (type === 'tpm-suite') {
    if (!Number.isInteger(start) || start < 1 || !Number.isInteger(step) || step < 2 || step > 10 || end > 100) {
      return 'Choisissez un premier terme positif et un pas entier de 2 à 10. Le dernier terme doit rester inférieur ou égal à 100.'
    }
    return undefined
  }
  if (type === 'tpm-grandes-suites') {
    const maximum = index === 0 ? 999 : 9999
    if (!Number.isInteger(start) || start < 1 || end > maximum ||
      !stepInFamily(step, index === 0 ? 100 : 200, index === 0 ? 200 : 400, 5, 20)) {
      return `Le pas doit être un multiple de 5 hors centaines rondes. Le dernier terme doit rester inférieur ou égal à ${maximum}.`
    }
    return undefined
  }
  if (type === 'tpm-suites-6') {
    if (index === 0 && (!Number.isInteger(start) || start < 10_000 || end > 99_999 || !stepInFamily(step, 500, 900, 5, 20))) {
      return 'Gardez les termes entre 10 000 et 99 999 avec un pas de 500 à 900, multiple de 5 hors centaines rondes.'
    }
    if (index !== 0 && (start < 0 || end > 9.990001 || !stepInFamily(step, .05, .95, .05, 2))) {
      return 'Gardez les termes entre 0 et 9,99 avec un pas de 0,05 à 0,95, hors dixièmes ronds.'
    }
    return undefined
  }
  if (start < 0 || step <= 0 || end > 999_999) return 'Indiquez un premier terme positif ou nul et un pas positif.'
  return undefined
}

export function numberSequence(item: MathItem, type: string, index: number) {
  if (item.layout !== 'sequence' || !TYPES.has(type)) return undefined
  const terms = sequenceTerms(item)
  const start = parseFrNumber(terms[0] ?? '')
  const following = parseFrNumber(terms[1] ?? '')
  if (start === null || following === null) return undefined
  const blanks = item.blankIndexes ?? []
  return {
    terms, start, step: Number((following - start).toFixed(6)), blanks,
    validate: (first: number, delta: number) => sequenceError(type, index, first, delta, terms.length),
    apply: (first: number, delta: number, blankIndexes = blanks) => {
      const sequence = Array.from({ length: terms.length }, (_, position) => fmt(first + position * delta))
      const updated = { ...item, sequence, blankIndexes, answer: blankIndexes.map((position) => sequence[position]).join(' ; ') }
      return type.startsWith('tcm-csc-') ? recalcTpmLibreItem(updated, type) : updated
    },
  }
}
