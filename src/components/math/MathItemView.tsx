import type { MathItem, PreviewMode } from '@/math/types'
import { CoordGrid } from './CoordGrid'
import { FractionView, renderMathText } from './FractionView'
import { GeometryFigure } from './GeometryFigure'
import { QuestionPoints } from './PrintDocumentChrome'

function DigitRow({
  digits,
  empty,
  showAnswer,
  answerDigits,
  carry,
}: {
  digits?: string[]
  empty?: boolean
  showAnswer?: boolean
  answerDigits?: string[]
  carry?: boolean
}) {
  const cells = digits ?? []
  return (
    <div className={`digit-row ${carry ? 'carry-row' : ''}`}>
      {cells.map((digit, index) => {
        const shown = empty ? (showAnswer ? answerDigits?.[index] ?? '' : '') : digit
        return (
          <span className={`digit-cell ${empty && !showAnswer ? 'blank' : ''} ${carry ? 'carry' : ''}`} key={index}>
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
  const showCarries = Boolean(item.carries?.some(Boolean))
  return (
    <div className="column-op">
      {item.prompt && <p className="column-prompt">{item.prompt}</p>}
      <div className="column-grid school">
        <div className="column-sign-col">
          {showCarries && <span className="carry-spacer" />}
          <span className="column-op-sign">{empty && !show ? '' : item.op}</span>
        </div>
        <div className="column-digits">
          {showCarries && (
            <DigitRow
              digits={item.carries}
              empty={!show}
              showAnswer={show}
              answerDigits={item.carries}
              carry
            />
          )}
          <DigitRow digits={item.digitsA} empty={empty} showAnswer={show} answerDigits={item.digitsA} />
          <DigitRow digits={item.digitsB} empty={empty} showAnswer={show} answerDigits={item.digitsB} />
          <div className="column-rule" />
          <DigitRow digits={item.digitsResult} empty showAnswer={show} answerDigits={item.digitsResult} />
        </div>
      </div>
    </div>
  )
}

function DivisionColumn({ item, mode }: { item: MathItem; mode: PreviewMode }) {
  const show = mode === 'answers'
  const empty = Boolean(item.blankOperands)
  const steps = item.divisionSteps ?? []
  const workRows = Math.max(4, steps.length * 2)
  return (
    <div className="division-column french">
      {item.prompt && <p className="column-prompt">{item.prompt}</p>}
      <div className="division-posee">
        <div className="division-left">
          <div className="division-dividend-row">
            {empty && !show ? <span className="answer-line-field wide">{'\u00a0'}</span> : item.dividend}
          </div>
          <div className="division-work">
            {show
              ? steps.map((step, i) => (
                  <div className="div-step" key={i}>
                    <div className="div-bring">{step.bringDown}</div>
                    <div className="div-prod">− {step.product}</div>
                    <div className="div-rule" />
                    <div className="div-rem">{step.remainder}</div>
                  </div>
                ))
              : Array.from({ length: workRows }, (_, i) => <div className="div-work-line" key={i} />)}
          </div>
        </div>
        <div className="division-right">
          <div className="division-divisor">
            {empty && !show ? <span className="answer-line-field">{'\u00a0'}</span> : item.divisor}
          </div>
          <div className="division-quotient">
            {show ? (
              <strong>
                {item.quotient}
                {item.remainder ? ` r ${item.remainder}` : ''}
              </strong>
            ) : (
              <span className="answer-line-field wide">{'\u00a0'}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function CompareRow({ item, mode }: { item: MathItem; mode: PreviewMode }) {
  const symbols = ['<', '=', '>'] as const
  return (
    <div className="compare-row school">
      <span className="compare-side">{renderMathText(item.left ?? '')}</span>
      <div className="compare-choices" role="group" aria-label="Comparer">
        {symbols.map((sym) => {
          const selected = mode === 'answers' && item.answer === sym
          return (
            <span key={sym} className={`compare-choice ${selected ? 'selected' : ''}`}>
              <span className="compare-box">{selected ? '✓' : ''}</span>
              <span>{sym}</span>
            </span>
          )
        })}
      </div>
      <span className="compare-side">{renderMathText(item.right ?? '')}</span>
    </div>
  )
}

function SequenceRow({ item, mode }: { item: MathItem; mode: PreviewMode }) {
  const blanks = new Set(item.blankIndexes ?? [])
  const answers = item.answer.split(' ; ')
  let blankAt = 0
  const isOrder = Boolean(item.prompt?.includes('petit'))
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
                {value ?? <span className="answer-line-field slim">{'\u00a0'}</span>}
              </span>
            )
          }
          return (
            <span className="sequence-term" key={index}>
              {renderMathText(term)}
            </span>
          )
        })}
      </div>
      {isOrder && (
        <div className="sequence-answer-line">
          <span className="field-label">Ordre :</span>
          {mode === 'answers' ? <strong className="filled-answer">{item.answer}</strong> : <span className="write-line long" />}
        </div>
      )}
    </div>
  )
}

function InlinePrompt({ item, mode }: { item: MathItem; mode: PreviewMode }) {
  const prompt = item.prompt ?? ''
  const show = mode === 'answers'
  if (prompt.includes('□') || /\d+\/\d+/.test(prompt)) {
    return (
      <div className="inline-prompt equation">
        {renderMathText(prompt, show ? <FractionView value={item.answer} /> : '\u00a0')}
        {!prompt.includes('□') && (
          <>
            <span className="eq-space" />
            <span className={`answer-line-field ${show ? 'filled' : ''}`}>{show ? <FractionView value={item.answer} /> : '\u00a0'}</span>
          </>
        )}
      </div>
    )
  }
  const needsBox = !prompt.trimEnd().endsWith('=') && !prompt.includes('=')
  return (
    <div className="inline-prompt equation">
      <span className="eq-text">{renderMathText(prompt)}</span>
      {(prompt.trimEnd().endsWith('=') || needsBox) && (
        <span className={`answer-line-field med ${show ? 'filled' : ''}`}>
          {show ? <FractionView value={item.answer} /> : '\u00a0'}
        </span>
      )}
      {show && prompt.trimEnd().endsWith('=') === false && needsBox === false && (
        <span className="filled-answer">{item.answer}</span>
      )}
    </div>
  )
}

function ProblemBlock({ item, mode }: { item: MathItem; mode: PreviewMode }) {
  const show = mode === 'answers'
  return (
    <div className="problem-block">
      <p className="problem-prompt">{item.prompt}</p>
      <div className="problem-fields">
        <div className="problem-field">
          <span className="field-label">Calcul</span>
          {show && item.calcAnswer ? (
            <strong className="filled-answer">{item.calcAnswer}</strong>
          ) : (
            <>
              <span className="write-line" />
              <span className="write-line" />
            </>
          )}
        </div>
        <div className="problem-field">
          <span className="field-label">Réponse</span>
          {show ? (
            <strong className="filled-answer">{item.responseAnswer ?? item.answer}</strong>
          ) : (
            <span className="answer-line-field wide">{'\u00a0'}</span>
          )}
        </div>
      </div>
    </div>
  )
}

function GeoBlock({ item, mode }: { item: MathItem; mode: PreviewMode }) {
  const show = mode === 'answers'
  return (
    <div className="geo-block">
      <GeometryFigure type={item.figure} dims={item.dims} />
      <div className="geo-side">
        {item.prompt && <p className="column-prompt">{item.prompt}</p>}
        {(item.calcAnswer || item.responseAnswer) && (
          <div className="problem-fields compact">
            <div className="problem-field">
              <span className="field-label">Calcul</span>
              {show && item.calcAnswer ? (
                <strong className="filled-answer">{item.calcAnswer}</strong>
              ) : (
                <span className="write-line" />
              )}
            </div>
            <div className="problem-field">
              <span className="field-label">Réponse</span>
              {show ? (
                <strong className="filled-answer">{item.responseAnswer ?? item.answer}</strong>
              ) : (
                <span className="answer-line-field med">{'\u00a0'}</span>
              )}
            </div>
          </div>
        )}
        {!item.calcAnswer && (
          <div className="problem-field">
            {show ? (
              <strong className="filled-answer">{item.answer}</strong>
            ) : (
              <span className="answer-line-field med">{'\u00a0'}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function CoordBlock({ item, mode }: { item: MathItem; mode: PreviewMode }) {
  const show = mode === 'answers'
  return (
    <div className="coord-block">
      <CoordGrid point={item.point} pointImage={item.pointImage} showImage={show && Boolean(item.pointImage)} />
      <div className="coord-side">
        {item.prompt && <p className="column-prompt">{item.prompt}</p>}
        <div className="problem-field">
          <span className="field-label">Réponse</span>
          {show ? (
            <strong className="filled-answer">{item.answer}</strong>
          ) : (
            <span className="answer-line-field med">{'\u00a0'}</span>
          )}
        </div>
      </div>
    </div>
  )
}

export function MathItemView({
  item,
  mode,
  index,
  points,
  showPoints,
}: {
  item: MathItem
  mode: PreviewMode
  index: number
  points?: number
  showPoints?: boolean
}) {
  const isProblem = item.layout === 'text' && Boolean(item.calcAnswer || item.responseAnswer)
  return (
    <div className={`exercise-item layout-${item.layout}`}>
      <div className="item-number">
        {index + 1}.
        {showPoints && points != null ? <QuestionPoints points={points} /> : null}
      </div>
      <div className="item-content">
        {(item.layout === 'column' || item.layout === 'column-empty') && <ColumnOp item={item} mode={mode} />}
        {item.layout === 'division-column' && <DivisionColumn item={item} mode={mode} />}
        {item.layout === 'compare' && <CompareRow item={item} mode={mode} />}
        {item.layout === 'sequence' && <SequenceRow item={item} mode={mode} />}
        {item.layout === 'geo' && <GeoBlock item={item} mode={mode} />}
        {item.layout === 'coord' && <CoordBlock item={item} mode={mode} />}
        {isProblem && <ProblemBlock item={item} mode={mode} />}
        {!isProblem &&
          (item.layout === 'inline' ||
            item.layout === 'text' ||
            item.layout === 'select' ||
            item.layout === 'place-value') && <InlinePrompt item={item} mode={mode} />}
      </div>
    </div>
  )
}
