export type FractionPart = string | { numerator: string; denominator: string }

/** Display only. The source text, stable IDs and answer key are unchanged. */
export function fractionParts(text: string): FractionPart[] {
  const parts: FractionPart[] = [], pattern = /(?<![\d/.,'’])([+−-]?\d{1,18}|□)\s*\/\s*(\d{1,18}|□)(?![\d/]|[.,'’]\d)/gu
  let at = 0
  for (const match of text.matchAll(pattern)) {
    if (match.index > at) parts.push(text.slice(at, match.index))
    parts.push({ numerator: match[1]!, denominator: match[2]! })
    at = match.index + match[0].length
  }
  if (at < text.length) parts.push(text.slice(at))
  return parts
}

/** Restrict notation to explicit fraction questions, leaving dates, URLs and
 * ordinary prose alone. Competition retains this same public prompt. */
export function isFractionQuestion(prompt: string): boolean {
  const text = prompt.trim()
  if (/^Dans [ +−\d/-]+, le (?:numérateur|dénominateur) est(?:…|\?)?$/u.test(text)) return fractionParts(text).some(part => typeof part !== 'string')
  const body = text.replace(/^(?:Simplifie|Compare)\s*:\s*/u, '')
  return /^[\d\s.,'’+−\-×÷*/=□<>?]+$/u.test(body) && /[=□<>]/u.test(body) && fractionParts(body).some(part => typeof part !== 'string')
}
