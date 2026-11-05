import { Fragment, type ReactNode } from 'react'

/** Icône sonnerie (consignes CO : [[bell]]). */
function InstructionBellIcon() {
  return (
    <svg
      className="tcf-bell-icon"
      viewBox="0 0 24 24"
      width="1.15em"
      height="1.15em"
      aria-hidden
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22zm8-6v-5a8 8 0 1 0-16 0v5l-2 2v1h20v-1l-2-2z"
      />
    </svg>
  )
}

type ListLine = { marker: string; rest: string; em: boolean }

const EM_ITEM =
  /^\[\[em\]\](\d{1,3}[.)]|\(\d{1,3}\)|[•·]|[-–—])\[\[\/em\]\]\s*([\s\S]*)$/
const PLAIN_NUM = /^(\d{1,3}[.)]|\(\d{1,3}\))\s+([\s\S]*)$/
const PLAIN_BULLET = /^([•·]|[-–—])\s+([\s\S]*)$/

/** Ligne qui commence par une puce ou une numérotation (`1.` , `(2)`, `[[em]]3.[[/em]]`). */
export function parseListLine(line: string): ListLine | null {
  const em = EM_ITEM.exec(line)
  if (em) return { marker: em[1], rest: em[2], em: true }
  const num = PLAIN_NUM.exec(line)
  if (num) return { marker: num[1], rest: num[2], em: false }
  const bullet = PLAIN_BULLET.exec(line)
  if (bullet) return { marker: bullet[1], rest: bullet[2], em: false }
  return null
}

/** Marqueurs `[[em]]` et `[[bell]]` dans une consigne ou un texte. */
function renderInline(text: string): ReactNode {
  if (!text.includes('[[')) return text
  const parts: ReactNode[] = []
  const re = /\[\[em\]\]([\s\S]*?)\[\[\/em\]\]|\[\[bell\]\]/g
  let last = 0
  let match: RegExpExecArray | null
  let key = 0
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index))
    if (match[0] === '[[bell]]') {
      parts.push(<InstructionBellIcon key={`bell-${key++}`} />)
    } else {
      parts.push(
        <span className="det-choice" key={`em-${key++}`}>
          {match[1]}
        </span>,
      )
    }
    last = match.index + match[0].length
  }
  if (last < text.length) parts.push(text.slice(last))
  return <>{parts}</>
}

/**
 * Consigne ou texte : les lignes numérotées ou à puces deviennent une liste
 * à taquet (numéro à droite, texte aligné, retour à la ligne sous le texte).
 */
export function renderSheetCopy(text: string): ReactNode {
  const determinant = 'Complétez avec les déterminants '
  if (text.startsWith(determinant) && !text.includes('[[')) {
    return (
      <>
        {determinant}
        <span className="det-choice">l’</span>, <span className="det-choice">le</span>,{' '}
        <span className="det-choice">la</span> ou <span className="det-choice">les</span>.
      </>
    )
  }
  const lines = text.split('\n')
  const parsed = lines.map(parseListLine)
  if (!parsed.some(Boolean)) return renderInline(text)

  const out: ReactNode[] = []
  let i = 0
  let key = 0
  while (i < lines.length) {
    if (!parsed[i]) {
      const start = i
      while (i < lines.length && !parsed[i]) i += 1
      const chunk = lines.slice(start, i).join('\n')
      if (chunk.trim()) {
        out.push(
          <span className="sheet-copy-line" key={`t-${key++}`}>
            {renderInline(chunk)}
          </span>,
        )
      }
      continue
    }
    const items: ListLine[] = []
    while (i < lines.length && parsed[i]) {
      items.push(parsed[i]!)
      i += 1
    }
    out.push(
      <span className="sheet-num-list" key={`l-${key++}`}>
        {items.map((item, j) => (
          <span className="sheet-num-li" key={j}>
            <span className={`sheet-num-marker${item.em ? ' det-choice' : ''}`}>{item.marker}</span>
            <span className="sheet-num-text">{renderInline(item.rest)}</span>
          </span>
        ))}
      </span>,
    )
  }
  return <Fragment>{out}</Fragment>
}

export function SheetCopy({ text }: { text: string }) {
  return <>{renderSheetCopy(text)}</>
}
