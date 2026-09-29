import type { ReactNode } from 'react'

const FRAC_TOKEN = /^(?:-?(?:[A-Za-z]|\d+))\s*\/\s*(-?\d+)$/

/** Affiche une fraction empilée (barre horizontale), ou du texte si ce n’est pas une fraction. */
export function FractionView({ value, className = '' }: { value: string; className?: string }) {
  const trimmed = value.trim()
  const match = FRAC_TOKEN.exec(trimmed)
  if (!match) return <span className={className}>{value}</span>
  const slash = trimmed.indexOf('/')
  const num = trimmed.slice(0, slash).trim()
  const den = trimmed.slice(slash + 1).trim()
  return (
    <span className={`fraction-stack ${className}`} aria-label={`${num} sur ${den}`}>
      <span className="fraction-num">{num}</span>
      <span className="fraction-bar" />
      <span className="fraction-den">{den}</span>
    </span>
  )
}

/** Parse un prompt contenant éventuellement des fractions `n/d`, `x/d`, `□/d` et des □. */
export function renderMathText(
  text: string,
  blankContent?: ReactNode,
): ReactNode[] {
  const parts = text.split(/(□\/\d+|\d+\/□|[A-Za-z]\/\d+|\d+\/\d+|□)/g)
  return parts.map((part, index) => {
    if (!part) return null
    if (part === '□') {
      return (
        <span className="answer-line-field compact" key={index}>
          {blankContent ?? '\u00a0'}
        </span>
      )
    }
    if (/^□\/\d+$/.test(part)) {
      const den = part.slice(2)
      return (
        <span className={`fraction-stack`} key={index} aria-label={`trou sur ${den}`}>
          <span className="fraction-num">
            <span className="answer-line-field compact">{blankContent ?? '\u00a0'}</span>
          </span>
          <span className="fraction-bar" />
          <span className="fraction-den">{den}</span>
        </span>
      )
    }
    if (/^\d+\/□$/.test(part)) {
      const num = part.slice(0, part.indexOf('/'))
      return (
        <span className={`fraction-stack`} key={index} aria-label={`${num} sur trou`}>
          <span className="fraction-num">{num}</span>
          <span className="fraction-bar" />
          <span className="fraction-den">
            <span className="answer-line-field compact">{blankContent ?? '\u00a0'}</span>
          </span>
        </span>
      )
    }
    if (/^(?:[A-Za-z]|\d+)\/\d+$/.test(part)) {
      return <FractionView key={index} value={part} />
    }
    return <span key={index}>{part}</span>
  })
}
