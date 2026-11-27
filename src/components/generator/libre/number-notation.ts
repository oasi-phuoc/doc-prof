import { numberToFrench } from '@/francais/french-numbers'
import type { MathItem } from '@/math/types'
import { parseFrNumber } from '@/tpm/libre-parse'
import { recalcTpmLibreItem } from '@/tpm/libre-recalc'

export const NUMBER_PLACES = ['unités', 'dizaines', 'centaines', 'milliers'] as const
type NumberPlace = typeof NUMBER_PLACES[number]
type NumberQuestion = {
  value: string
  place?: NumberPlace
  validate: (number: number) => string | undefined
  apply: (number: number, place?: NumberPlace) => MathItem
}

function integerRange(minimum: number, maximum: number) {
  return (value: number) => {
    if (!Number.isInteger(value) || value < minimum || value > maximum) {
      return `Saisissez un entier de ${minimum.toLocaleString('fr-CH')} à ${maximum.toLocaleString('fr-CH')}.`
    }
    return undefined
  }
}

export function numberQuestion(item: MathItem, type: string): NumberQuestion | undefined {
  switch (type) {
    case 'nombres-chiffres':
    case 'nombres-lettres':
    case 'nombres-pair': {
      const inDigits = type === 'nombres-chiffres'
      const parity = type === 'nombres-pair'
      return {
        value: inDigits ? item.answer : item.prompt ?? '',
        validate: integerRange(0, 999_999),
        apply: (number) => ({
          ...item,
          prompt: inDigits ? numberToFrench(number) : String(number),
          answer: parity ? number % 2 === 0 ? 'pair' : 'impair' : inDigits ? String(number) : numberToFrench(number),
        }),
      }
    }
    case 'nombres-position': {
      const found = /^Dans (.+?), le chiffre des (unités|dizaines|centaines|milliers) est$/.exec(item.prompt ?? '')
      const place = NUMBER_PLACES.find((value) => value === found?.[2])
      if (!found || !place || parseFrNumber(found[1]!) === null) return undefined
      return {
        value: found[1]!, place, validate: integerRange(10 ** NUMBER_PLACES.indexOf(place), 9999),
        apply: (number, next = place) => ({
          ...item,
          prompt: `Dans ${number.toLocaleString('fr-CH')}, le chiffre des ${next} est`,
          answer: String(Math.floor(number / 10 ** NUMBER_PLACES.indexOf(next)) % 10),
        }),
      }
    }
    case 'nombres-decompose':
    case 'tpm-decompose-99':
    case 'tpm-decompose-9999': {
      const validate = integerRange(type === 'tpm-decompose-9999' ? 1000 : 11, type === 'tpm-decompose-99' ? 99 : 9999)
      return {
        value: item.prompt ?? '',
        validate: (number) => validate(number) ?? (type === 'tpm-decompose-9999' &&
          Math.floor(number / 100) % 10 !== 0 && Math.floor(number / 10) % 10 !== 0
          ? 'Le chiffre des centaines ou celui des dizaines doit être zéro.' : undefined),
        apply: (number) => recalcTpmLibreItem({ ...item, prompt: String(number) }, type),
      }
    }
    case 'nombres-encadrer-10':
    case 'nombres-encadrer-100': {
      const step = type === 'nombres-encadrer-10' ? 10 : 100
      const validate = integerRange(step + 1, 999_999)
      return {
        value: item.prompt ?? '',
        validate: (number) => validate(number) ?? (number % step === 0 ? `Saisissez un nombre entre deux multiples de ${step}.` : undefined),
        apply: (number) => {
          const a = Math.floor(number / step) * step
          const b = a + step
          return { ...item, prompt: String(number), a, b, answer: `${a} < ${number} < ${b}` }
        },
      }
    }
    default:
      return undefined
  }
}
