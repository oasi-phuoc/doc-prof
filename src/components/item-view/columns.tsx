import { Fragment } from 'react'
import type { MathItem, PreviewMode } from '@/math/types'

function DigitRow({
  digits,
  empty,
  showAnswer,
  answerDigits,
  carry,
  decimalPlaces = 0,
  showDecimalComma = false,
}: {
  digits?: string[]
  empty?: boolean
  showAnswer?: boolean
  answerDigits?: string[]
  carry?: boolean
  /** Chiffres après la virgule ; la virgule est dans la case des unités. */
  decimalPlaces?: number
  showDecimalComma?: boolean
}) {
  const cells = digits ?? []
  const unitsIdx =
    showDecimalComma && decimalPlaces > 0 ? cells.length - decimalPlaces - 1 : -1
  return (
    <div className={`digit-row ${carry ? 'carry-row' : ''}`}>
      {cells.map((digit, index) => {
        const shown = empty ? (showAnswer ? answerDigits?.[index] ?? '' : '') : digit
        const showComma = index === unitsIdx && (!empty || showAnswer)
        const isAnswer = Boolean(empty && showAnswer)
        return (
          <span
            className={`digit-cell ${empty && !showAnswer ? 'blank' : ''} ${carry ? 'carry' : ''}${
              showComma ? ' has-comma' : ''
            }${isAnswer ? ' is-answer' : ''}`}
            key={index}
          >
            {shown}
            {showComma ? <span className="digit-comma">,</span> : null}
          </span>
        )
      })}
    </div>
  )
}

export function ColumnOp({ item, mode }: { item: MathItem; mode: PreviewMode }) {
  const empty = item.blankOperands || item.layout === 'column-empty'
  const show = mode === 'answers'
  const carries = item.carries ?? item.digitsA?.map(() => '') ?? []
  const partials = item.digitsPartials ?? []
  const hasPartials = partials.length > 0
  const decimalPlaces = item.decimalPlaces ?? 0

  type Line =
    | {
        kind: 'digits'
        digits?: string[]
        blank?: boolean
        carry?: boolean
        sign?: string
        comma?: boolean
      }
    | { kind: 'rule' }

  const bHasDecimal =
    typeof item.b === 'number' && Math.abs(item.b - Math.round(item.b)) > 1e-9
  const lines: Line[] = [
    { kind: 'digits', digits: carries, blank: !show, carry: true },
    { kind: 'digits', digits: item.digitsA, blank: empty, comma: decimalPlaces > 0 },
    {
      kind: 'digits',
      digits: item.digitsB,
      blank: empty,
      sign: item.op,
      // × entier : pas de virgule ; × décimal (ex. 1,5) : virgule aux unités.
      comma: decimalPlaces > 0 && (item.op !== '×' || bHasDecimal),
    },
    { kind: 'rule' },
  ]
  if (hasPartials) {
    for (const row of partials) {
      lines.push({ kind: 'digits', digits: row, blank: true, comma: false })
    }
    lines.push({ kind: 'rule' })
  }
  lines.push({ kind: 'digits', digits: item.digitsResult, blank: true, comma: decimalPlaces > 0 })

  return (
    <div className={`column-op${hasPartials ? ' has-partials' : ''}`}>
      {item.prompt && <p className="column-prompt">{item.prompt}</p>}
      <div className="column-grid school">
        {lines.map((line, index) => {
          if (line.kind === 'rule') {
            return (
              <div className="column-line rule-line" key={`rule-${index}`}>
                <span className="column-line-sign" aria-hidden />
                <div className="column-rule" />
              </div>
            )
          }
          const shownSign = line.sign && !(empty && !show) ? line.sign : ''
          return (
            <div className={`column-line${line.carry ? ' carry-line' : ''}`} key={`row-${index}`}>
              <span className="column-line-sign">{shownSign}</span>
              <DigitRow
                digits={line.digits}
                empty={line.blank}
                showAnswer={show}
                answerDigits={line.digits}
                carry={line.carry}
                decimalPlaces={decimalPlaces}
                showDecimalComma={Boolean(line.comma)}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function DivisionColumn({ item, mode }: { item: MathItem; mode: PreviewMode }) {
  const show = mode === 'answers'
  const empty = Boolean(item.blankOperands)
  const workRows = item.digitsPartials ?? []
  const decimalPlaces = item.decimalPlaces ?? 0

  return (
    <div className="division-column school">
      {item.prompt && <p className="column-prompt">{item.prompt}</p>}
      <div className="division-board">
        <div className="division-work-side">
          <div className="column-line">
            <span className="column-line-sign" aria-hidden />
            <DigitRow
              digits={item.digitsA}
              empty={empty}
              showAnswer={show}
              answerDigits={item.digitsA}
              decimalPlaces={decimalPlaces}
              showDecimalComma={decimalPlaces > 0}
            />
          </div>
          {workRows.map((row, index) => {
            const isProduct = index % 2 === 0
            return (
              <Fragment key={`work-${index}`}>
                {isProduct ? (
                  <div className="column-line">
                    <span className="column-line-sign">−</span>
                    <DigitRow digits={row} empty showAnswer={show} answerDigits={row} />
                  </div>
                ) : (
                  <>
                    <div className="column-line rule-line">
                      <span className="column-line-sign" aria-hidden />
                      <div className="column-rule" />
                    </div>
                    <div className="column-line">
                      <span className="column-line-sign" aria-hidden />
                      <DigitRow digits={row} empty showAnswer={show} answerDigits={row} />
                    </div>
                  </>
                )}
              </Fragment>
            )
          })}
        </div>
        <div className="division-vbar" aria-hidden />
        <div className="division-answer-side">
          <div className="column-line">
            <DigitRow
              digits={item.digitsB}
              empty={empty}
              showAnswer={show}
              answerDigits={item.digitsB}
            />
          </div>
          <div className="column-line rule-line tight">
            <div className="column-rule" />
          </div>
          <div className="column-line">
            <DigitRow
              digits={item.digitsResult}
              empty
              showAnswer={show}
              answerDigits={item.digitsResult}
              decimalPlaces={decimalPlaces}
              showDecimalComma={decimalPlaces > 0}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
