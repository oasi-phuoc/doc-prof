import type { MathItem, PreviewMode } from '@/math/types'
import { GeometryFigure } from './GeometryFigure'

function DigitRow({
  digits,
  empty,
  showAnswer,
  answerDigits,
}: {
  digits?: string[]
  empty?: boolean
  showAnswer?: boolean
  answerDigits?: string[]
}) {
  const cells = digits ?? []
  return (
    <div className="digit-row">
      {cells.map((digit, index) => {
        const shown = empty ? (showAnswer ? answerDigits?.[index] ?? '' : '') : digit
        return (
          <span className={`digit-cell ${empty && !showAnswer ? 'blank' : ''}`} key={index}>
            {shown}
          </span>
        )
      })}
    </div>
  )
}

function ColumnOp({ item, mode }: { item: MathItem; mode: PreviewMode }) {
  const empty = item.blankOperands || item.layout === 'column-empty'
  const show = mode === 'answers'
  return (
    <div className="column-op">
      {item.prompt && <p className="column-prompt">{item.prompt}</p>}
      <div className="column-grid">
        <span className="column-op-sign">{empty && !show ? '' : item.op}</span>
        <div className="column-digits">
          <DigitRow digits={item.digitsA} empty={empty} showAnswer={show} answerDigits={item.digitsA} />
          <DigitRow digits={item.digitsB} empty={empty} showAnswer={show} answerDigits={item.digitsB} />
          <div className="column-rule" />
          <DigitRow
            digits={item.digitsResult}
            empty
            showAnswer={show}
            answerDigits={item.digitsResult}
          />
        </div>
      </div>
    </div>
  )
}

function DivisionColumn({ item, mode }: { item: MathItem; mode: PreviewMode }) {
  const show = mode === 'answers'
  const empty = Boolean(item.blankOperands)
  return (
    <div className="division-column">
      {item.prompt && <p className="column-prompt">{item.prompt}</p>}
      <div className="division-box">
        <div className="division-dividend">
          {empty && !show ? <span className="answer-blank wide" /> : item.dividend}
        </div>
        <div className="division-right">
          <div className="division-divisor">
            {empty && !show ? <span className="answer-blank" /> : item.divisor}
          </div>
          <div className="division-quotient">
            {show ? item.answer : <span className="answer-blank wide" />}
          </div>
        </div>
      </div>
    </div>
  )
}

function CompareRow({ item, mode }: { item: MathItem; mode: PreviewMode }) {
  return (
    <div className="compare-row">
      <span>{item.left}</span>
      <span className="compare-slot">{mode === 'answers' ? item.answer : <span className="answer-blank slim" />}</span>
      <span>{item.right}</span>
    </div>
  )
}

function SequenceRow({ item, mode }: { item: MathItem; mode: PreviewMode }) {
  const blanks = new Set(item.blankIndexes ?? [])
  const answers = item.answer.split(' ; ')
  let blankAt = 0
  return (
    <div className="sequence-block">
      {item.prompt && <p className="column-prompt">{item.prompt}</p>}
      <div className="sequence-row">
        {(item.sequence ?? []).map((term, index) => {
          const isBlank = term === '□' || blanks.has(index)
          if (isBlank) {
            const value = mode === 'answers' ? answers[blankAt++] ?? '' : null
            return (
              <span className="sequence-term blank" key={index}>
                {value ?? <span className="answer-blank slim" />}
              </span>
            )
          }
          return (
            <span className="sequence-term" key={index}>
              {term}
            </span>
          )
        })}
      </div>
      {mode === 'answers' && item.layout === 'sequence' && !item.blankIndexes?.length && (
        <div className="answer">Correction : <b>{item.answer}</b></div>
      )}
    </div>
  )
}

function InlinePrompt({ item, mode }: { item: MathItem; mode: PreviewMode }) {
  const prompt = item.prompt ?? ''
  if (prompt.includes('□')) {
    const parts = prompt.split('□')
    return (
      <div className="inline-prompt with-blanks">
        {parts.map((part, index) => (
          <span key={index}>
            {part}
            {index < parts.length - 1 && (
              <span className="inline-blank">{mode === 'answers' ? item.answer : '____'}</span>
            )}
          </span>
        ))}
      </div>
    )
  }
  return (
    <div className="inline-prompt">
      <strong>{prompt}</strong>
      {mode === 'answers' ? (
        <div className="answer">
          Correction : <b>{item.answer}</b>
        </div>
      ) : (
        <div className="answer-line" />
      )}
    </div>
  )
}

export function MathItemView({ item, mode, index }: { item: MathItem; mode: PreviewMode; index: number }) {
  return (
    <div className={`exercise-item layout-${item.layout}`}>
      <div className="item-number">{index + 1}</div>
      <div className="item-content">
        {item.figure && <GeometryFigure type={item.figure} />}
        {(item.layout === 'column' || item.layout === 'column-empty') && <ColumnOp item={item} mode={mode} />}
        {item.layout === 'division-column' && <DivisionColumn item={item} mode={mode} />}
        {item.layout === 'compare' && <CompareRow item={item} mode={mode} />}
        {item.layout === 'sequence' && <SequenceRow item={item} mode={mode} />}
        {(item.layout === 'inline' || item.layout === 'text' || item.layout === 'select' || item.layout === 'place-value') && (
          <InlinePrompt item={item} mode={mode} />
        )}
        {mode === 'answers' &&
          (item.layout === 'column' ||
            item.layout === 'column-empty' ||
            item.layout === 'division-column' ||
            item.layout === 'compare') && (
            <div className="answer">
              Correction : <b>{item.answer}</b>
            </div>
          )}
      </div>
    </div>
  )
}
