import { fractionParts } from '../domain/fraction-notation'
import './fractions.css'

export function FractionText({ text, enabled = true }: { text: string; enabled?: boolean }) {
  if (!enabled) return <>{text}</>
  return <>{fractionParts(text).map((part, index) => typeof part === 'string' ? part : <span className="ci-fraction" key={index}>
    <span className="ci-sr-only">{part.numerator}/{part.denominator}</span>
    <span className="ci-fraction-digits" aria-hidden="true" data-numerator={part.numerator} data-denominator={part.denominator}/>
  </span>)}</>
}
