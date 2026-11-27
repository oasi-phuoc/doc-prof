import { columnItem, divisionColumnItem, fmt, fmtOperand, inlineOp } from './column-arith'
import type { NumberRange } from './difficulty'
import { int, pick, type Rng } from './rng'
import type { ArithOp, MathItem } from './types'

export function freeArithmeticType(typeId: string): ArithOp | undefined {
  const ordinary = /^(addition|soustraction|multiplication|division)-(?:ligne|trou|colonne(?:-poser)?|2chiffres(?:-poser)?)$/.exec(typeId)
  if (ordinary) return ({ addition: '+', soustraction: '−', multiplication: '×', division: '÷' } as const)[ordinary[1] as 'addition']
  const decimal = /^decimaux-(add|sub|mul|div)-(?:ligne|colonne(?:-poser)?)$/.exec(typeId)
  return decimal ? ({ add: '+', sub: '−', mul: '×', div: '÷' } as const)[decimal[1] as 'add'] : undefined
}

function decimalDivisorCore(value: number): number {
  while (value % 2 === 0) value /= 2
  while (value % 5 === 0) value /= 5
  return value
}

export function tryGenerateFreeArithmetic(
  typeId: string, rng: Rng, count: number, range: NumberRange,
): MathItem[] | undefined {
  const op = freeArithmeticType(typeId)
  if (!op) return undefined
  const [pa, pb] = [range.places ?? 1, range.secondPlaces ?? 1]
  const sa = 10 ** pa
  const sb = 10 ** pb
  const loA = Math.max(0, Math.ceil(range.min * sa - 1e-9))
  const loB = Math.max(op === '÷' ? 1 : 0, Math.ceil(range.min * sb - 1e-9))
  const hiA = Math.floor(range.max * sa + 1e-9)
  const hiB = Math.floor(range.max * sb + 1e-9)
  const firstMin = op === '−' ? Math.max(loA, Math.ceil(loB * sa / sb)) : loA
  const incompatible: MathItem = {
    layout: 'text',
    prompt: 'La plage et les précisions choisies ne permettent pas ce calcul. Élargissez la plage de valeurs.',
    answer: '',
  }
  if (hiA < firstMin || hiB < loB || !Number.isSafeInteger(hiA) || !Number.isSafeInteger(hiB) ||
      (op === '×' && !Number.isSafeInteger(hiA * hiB))) return [incompatible]

  const items: MathItem[] = []
  for (let i = 0; i < count; i++) {
    let aUnits = int(rng, firstMin, hiA)
    let bUnits = int(rng, loB, op === '−' ? Math.min(hiB, Math.floor(aUnits * sb / sa)) : hiB)
    let divisionPlaces = 0
    if (op === '÷') {
      let exact = false
      for (let attempt = 0; attempt < 150; attempt++) {
        bUnits = attempt === 149 ? loB : int(rng, loB, hiB)
        const core = decimalDivisorCore(bUnits)
        const min = Math.ceil(loA / core)
        const max = Math.floor(hiA / core)
        if (min > max) continue
        aUnits = int(rng, min, max) * core
        const quotient = (aUnits / sa) / (bUnits / sb)
        const places = Array.from({ length: 7 }, (_, j) => j).find(j => {
          const units = Math.round(quotient * 10 ** j)
          return Number.isSafeInteger(units) && BigInt(aUnits) * BigInt(sb) * 10n ** BigInt(j) === BigInt(units) * BigInt(bUnits) * BigInt(sa)
        })
        if (places === undefined) continue
        divisionPlaces = places
        exact = true
        break
      }
      if (!exact) return [incompatible]
    }
    const a = aUnits / sa
    const b = bUnits / sb
    const common = Math.max(sa, sb)
    const result = op === '+' ? (aUnits * (common / sa) + bUnits * (common / sb)) / common
      : op === '−' ? (aUnits * (common / sa) - bUnits * (common / sb)) / common
      : op === '×' ? aUnits * bUnits / (sa * sb)
      : Math.round((a / b) * 10 ** divisionPlaces) / 10 ** divisionPlaces
    const places: [number, number] = [pa, pb]
    const empty = typeId.endsWith('-poser')
    let item: MathItem
    if (typeId.includes('-colonne') || typeId.includes('-2chiffres')) {
      if (op === '÷') {
        const shiftedPlaces = Math.max(0, pa - pb)
        const work = divisionColumnItem(aUnits / 10 ** shiftedPlaces * 10 ** Math.max(0, pb - pa), bUnits, empty, Math.max(shiftedPlaces, divisionPlaces))
        const original = `${fmtOperand(a, pa)} ÷ ${fmtOperand(b, pb)}`
        item = {
          ...work, a, b, result, dividend: a, divisor: b,
          prompt: pb > 0 ? `${original} → ${fmtOperand(a * sb, shiftedPlaces)} ÷ ${bUnits}` : original,
          answer: fmt(result),
        }
      } else {
        item = columnItem(op, a, b, result, empty, places, typeId.includes('-2chiffres'))
      }
    } else {
      const missing = typeId.endsWith('-trou') ? pick(rng, ['a', 'b'] as const) : 'result'
      item = inlineOp(op, a, b, result, missing, places)
    }
    items.push({ ...item, freeOperandPlaces: places })
  }
  return items
}
