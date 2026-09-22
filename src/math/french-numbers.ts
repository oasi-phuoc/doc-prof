const UNITS = [
  'zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf',
  'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize',
]

/** Écriture suisse romande : septante, huitante, nonante. */
export function numberToFrench(n: number): string {
  if (n < 0 || n > 9999 || !Number.isInteger(n)) return String(n)
  if (n < 17) return UNITS[n]!
  if (n < 20) return `dix-${UNITS[n - 10]}`
  if (n < 70) {
    const tens = Math.floor(n / 10)
    const unit = n % 10
    const tensWord = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante'][tens]!
    if (unit === 0) return tensWord
    if (unit === 1 && tens !== 8) return `${tensWord} et un`
    return `${tensWord}-${UNITS[unit]}`
  }
  if (n < 80) return n === 70 ? 'septante' : n === 71 ? 'septante et un' : `septante-${UNITS[n - 70]}`
  if (n < 90) return n === 80 ? 'huitante' : n === 81 ? 'huitante et un' : `huitante-${UNITS[n - 80]}`
  if (n < 100) return n === 90 ? 'nonante' : n === 91 ? 'nonante et un' : `nonante-${UNITS[n - 90]}`
  if (n < 1000) {
    const hundreds = Math.floor(n / 100)
    const rest = n % 100
    const head = hundreds === 1 ? 'cent' : `${UNITS[hundreds]} cent${rest === 0 && hundreds > 1 ? 's' : ''}`
    return rest === 0 ? head : `${hundreds === 1 ? 'cent' : `${UNITS[hundreds]} cent`} ${numberToFrench(rest)}`
  }
  const thousands = Math.floor(n / 1000)
  const rest = n % 1000
  const head = thousands === 1 ? 'mille' : `${numberToFrench(thousands)} mille`
  return rest === 0 ? head : `${head} ${numberToFrench(rest)}`
}
