import type { ReactNode } from 'react'

const FRAC_TOKEN = /^(?:[-−]?(?:[A-Za-z]|\d+))\s*\/\s*([-−]?\d+)$/

function displaySigned(part: string): string {
  return part.replace(/-/g, '−')
}

/** Fraction empilée (barre horizontale) : numérateur / dénominateur en nœuds React. */
export function FractionStack({
  num,
  den,
  className = '',
  ariaLabel,
}: {
  num: ReactNode
  den: ReactNode
  className?: string
  ariaLabel?: string
}) {
  return (
    <span className={`fraction-stack ${className}`} aria-label={ariaLabel}>
      <span className="fraction-num">{num}</span>
      <span className="fraction-bar" />
      <span className="fraction-den">{den}</span>
    </span>
  )
}

/** Affiche une fraction empilée (barre horizontale), ou du texte si ce n’est pas une fraction. */
export function FractionView({ value, className = '' }: { value: string; className?: string }) {
  const trimmed = value.trim()
  const match = FRAC_TOKEN.exec(trimmed)
  if (!match) return <span className={className}>{displaySigned(value)}</span>
  const slash = trimmed.indexOf('/')
  const num = displaySigned(trimmed.slice(0, slash).trim())
  const den = displaySigned(trimmed.slice(slash + 1).trim())
  return (
    <FractionStack
      className={className}
      ariaLabel={`${num} sur ${den}`}
      num={num}
      den={den}
    />
  )
}

/** Zone de réponse fraction : barre centrée (couleur thème), cases pour num et den — sans trait dessous. */
export function FractionAnswerBlank({ className = '' }: { className?: string }) {
  return (
    <span className={`fraction-stack fraction-answer-blank ${className}`} aria-label="Fraction à compléter">
      <span className="fraction-num">
        <span className="frac-write-slot">{'\u00a0'}</span>
      </span>
      <span className="fraction-bar" />
      <span className="fraction-den">
        <span className="frac-write-slot">{'\u00a0'}</span>
      </span>
    </span>
  )
}

export function looksLikeFraction(value: string): boolean {
  return /[-−]?\d+\s*\/\s*[-−]?\d+/.test(value.trim())
}

/** Parse un prompt contenant éventuellement des fractions `n/d`, `-n/d`, `x/d`, `□/d` et des □. */
export function renderMathText(
  text: string,
  blankContent?: ReactNode,
): ReactNode[] {
  const parts = text.split(/(□\/\d+|[-−]?\d+\/□|[-−]?[A-Za-z]\/\d+|[-−]?\d+\/[-−]?\d+|□)/g)
  return parts.map((part, index) => {
    if (!part) return null
    if (part === '□') {
      return (
        <span className="frac-write-slot frac-write-slot-inline" key={index}>
          {blankContent ?? '\u00a0'}
        </span>
      )
    }
    if (/^□\/\d+$/.test(part)) {
      const den = part.slice(2)
      return (
        <span className="fraction-stack" key={index} aria-label={`trou sur ${den}`}>
          <span className="fraction-num">
            <span className="frac-write-slot">{blankContent ?? '\u00a0'}</span>
          </span>
          <span className="fraction-bar" />
          <span className="fraction-den">{den}</span>
        </span>
      )
    }
    if (/^[-−]?\d+\/□$/.test(part)) {
      const num = displaySigned(part.slice(0, part.indexOf('/')))
      return (
        <span className="fraction-stack" key={index} aria-label={`${num} sur trou`}>
          <span className="fraction-num">{num}</span>
          <span className="fraction-bar" />
          <span className="fraction-den">
            <span className="frac-write-slot">{blankContent ?? '\u00a0'}</span>
          </span>
        </span>
      )
    }
    if (/^[-−]?(?:[A-Za-z]|\d+)\/[-−]?\d+$/.test(part)) {
      return <FractionView key={index} value={part} />
    }
    return <span key={index}>{part}</span>
  })
}
