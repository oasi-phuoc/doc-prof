export type Decimal = { units: bigint; precision: number }
export type Rational = { numerator: bigint; denominator: bigint }

/** School decimal notation, including Swiss thousands separators; no rounding. */
export function exactDecimal(value: string): Decimal | null {
  if (typeof value !== 'string' || value.length > 80) return null
  let text = value.trim().replaceAll('−', '-')
  const sign = text[0] === '-' ? -1n : 1n
  if (text[0] === '-' || text[0] === '+') text = text.slice(1)
  const match = /^(.*?)(?:[.,](\d{1,6}))?$/.exec(text)
  if (!match) return null
  const integer = match[1]!, fraction = match[2] ?? ''
  if (!/^\d+$/.test(integer) && !/^\d{1,3}(['’\u0020\u00a0\u202f])\d{3}(?:\1\d{3})*$/.test(integer)) return null
  const digits = integer.replace(/['’\u0020\u00a0\u202f]/g, '')
  if (digits.length > 18) return null
  return { units: sign * BigInt(digits + fraction), precision: fraction.length }
}

export function scaledDecimal(value: Decimal, precision: number): bigint {
  return value.units * 10n ** BigInt(precision - value.precision)
}

export function formatDecimal(units: bigint, precision: number): string {
  const digits = (units < 0n ? -units : units).toString().padStart(precision + 1, '0')
  const integer = precision ? digits.slice(0, -precision) : digits
  const fraction = precision ? digits.slice(-precision).replace(/0+$/, '') : ''
  return `${units < 0n ? '−' : ''}${BigInt(integer).toLocaleString('fr-CH')}${fraction ? `,${fraction}` : ''}`
}

function rational(numerator: bigint, denominator: bigint): Rational | null {
  if (!denominator) return null
  if (denominator < 0n) { numerator = -numerator; denominator = -denominator }
  let a = numerator < 0n ? -numerator : numerator, b = denominator
  while (b) [a, b] = [b, a % b]
  return { numerator: numerator / a, denominator: denominator / a }
}

/** Bounded arithmetic grammar. No eval, variables, exponents or executable text. */
export function exactExpression(source: string): Rational | null {
  if (typeof source !== 'string' || source.length > 256) return null
  const text = source.trim().replaceAll('−', '-')
  let position = 0, operations = 0
  const space = () => { while (/\s/.test(text[position] ?? '') && position < text.length) position++ }
  const number = (): Rational | null => {
    space()
    let sign = ''
    if (text[position] === '+' || text[position] === '-') { sign = text[position++]!; space() }
    const match = /^(?:\d{1,3}(?:['’\u0020\u00a0\u202f]\d{3})+|\d+)(?:[.,]\d{1,6})?/.exec(text.slice(position))
    if (!match) return null
    position += match[0].length
    const value = exactDecimal(sign + match[0])
    return value ? rational(value.units, 10n ** BigInt(value.precision)) : null
  }
  const term = (): Rational | null => {
    let left = number()
    if (!left) return null
    while (true) {
      space()
      const operator = text[position]
      if (!operator || !['×', '*', '/', '÷'].includes(operator)) return left
      if (++operations > 16) return null
      position++
      const right = number()
      if (!right) return null
      left = operator === '×' || operator === '*' ? rational(left.numerator * right.numerator, left.denominator * right.denominator) : rational(left.numerator * right.denominator, left.denominator * right.numerator)
      if (!left) return null
    }
  }
  let left = term()
  if (!left) return null
  while (true) {
    space()
    if (position === text.length) return left
    const operator = text[position++]
    if (!['+', '-'].includes(operator ?? '') || ++operations > 16) return null
    const right = term()
    if (!right) return null
    left = rational(left.numerator * right.denominator + (operator === '+' ? 1n : -1n) * right.numerator * left.denominator, left.denominator * right.denominator)
    if (!left) return null
  }
}

export function compareExact(a: Rational, b: Rational): '<' | '=' | '>' {
  const left = a.numerator * b.denominator, right = b.numerator * a.denominator
  return left < right ? '<' : left > right ? '>' : '='
}
