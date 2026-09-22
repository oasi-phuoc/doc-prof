import type { ReactNode } from 'react'

/** Affiche une fraction empilée, ou du texte si ce n’est pas une fraction. */
export function FractionView({ value, className = '' }: { value: string; className?: string }) {
  const trimmed = value.trim()
  const match = /^(-?\d+)\s*\/\s*(-?\d+)$/.exec(trimmed)
  if (!match) return <span className={className}>{value}</span>
  return (
    <span className={`fraction-stack ${className}`} aria-label={trimmed}>
      <span className="fraction-num">{match[1]}</span>
      <span className="fraction-bar" />
      <span className="fraction-den">{match[2]}</span>
    </span>
  )
}

/** Parse un prompt contenant éventuellement des fractions `n/d` et des □. */
export function renderMathText(
  text: string,
  blankContent?: ReactNode,
): ReactNode[] {
  const parts = text.split(/(□|\d+\/\d+)/g)
  return parts.map((part, index) => {
    if (part === '□') {
      return (
        <span className="answer-box" key={index}>
          {blankContent ?? '\u00a0'}
        </span>
      )
    }
    if (/^\d+\/\d+$/.test(part)) {
      return <FractionView key={index} value={part} />
    }
    return <span key={index}>{part}</span>
  })
}
