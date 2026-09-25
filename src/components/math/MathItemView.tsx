import { Fragment, type CSSProperties } from 'react'
import type { CoordShape, MathItem, PhraseCategory, PreviewMode } from '@/math/types'
import { PHRASE_COLORS } from '@/math/phrase-banks'
import { CompositeFigure } from './CompositeFigure'
import { CoordGrid, CoordShapeButton } from './CoordGrid'
import { FractionView, renderMathText } from './FractionView'
import { GattegnoChart } from './GattegnoChart'
import { GeometryFigure } from './GeometryFigure'

function VocabTable({ item }: { item: MathItem }) {
  const rows = Math.max(1, item.vocabRows ?? 3)
  const cols = Math.max(1, item.vocabCols ?? 3)
  const entries = item.vocabEntries ?? []
  const cells = Array.from({ length: rows * cols }, (_, index) => entries[index] ?? null)

  return (
    <div className="vocab-table" style={{ '--vocab-cols': cols } as CSSProperties} aria-label="Mots à apprendre">
      {Array.from({ length: rows }, (_, rowIndex) => {
        const slice = cells.slice(rowIndex * cols, rowIndex * cols + cols)
        return (
          <div className="vocab-table-pair" key={`row-${rowIndex}`}>
            <div className="vocab-table-images">
              {slice.map((entry, colIndex) => (
                <div className="vocab-cell vocab-cell-image" key={`img-${rowIndex}-${colIndex}`}>
                  {entry?.imageSrc ? (
                    <img src={entry.imageSrc} alt="" />
                  ) : (
                    <span className="vocab-cell-empty" aria-hidden />
                  )}
                </div>
              ))}
            </div>
            <div className="vocab-table-words">
              {slice.map((entry, colIndex) => (
                <div className="vocab-cell vocab-cell-word" key={`word-${rowIndex}-${colIndex}`}>
                  {entry?.label ?? ''}
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function VocabMatch({ item, mode }: { item: MathItem; mode: PreviewMode }) {
  const left = item.labels ?? []
  const right = item.options ?? []
  const pairs = item.vocabPairs ?? []
  const byLeft = new Map(pairs.map((pair) => [pair.left, pair.right]))
  const imageMode = item.vocabMatchMode === 'image'
  return (
    <div className="vocab-match" aria-label="Association">
      {item.prompt ? <p className="column-prompt">{item.prompt}</p> : null}
      <div className="vocab-match-grid">
        <div className="vocab-match-col">
          {left.map((value, index) => (
            <div className="vocab-match-item" key={`L-${index}`}>
              <span className="vocab-match-num">{index + 1}.</span>
              {imageMode ? (
                <img className="vocab-match-img" src={value} alt="" />
              ) : (
                <span className="vocab-match-text">{value}</span>
              )}
            </div>
          ))}
        </div>
        <div className="vocab-match-col">
          {right.map((value, index) => (
            <div className="vocab-match-item" key={`R-${index}`}>
              <span className="vocab-match-num">{String.fromCharCode(65 + index)}.</span>
              <span className="vocab-match-text">
                {mode === 'answers'
                  ? `${value}${
                      [...byLeft.entries()].find(([, rightLabel]) => rightLabel === value)
                        ? ` ← ${
                            left.findIndex(
                              (leftValue) => byLeft.get(leftValue) === value,
                            ) + 1
                          }`
                        : ''
                    }`
                  : value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function VocabWrite({ item, mode }: { item: MathItem; mode: PreviewMode }) {
  const show = mode === 'answers'
  const ch = Math.max(4, item.vocabLineCh ?? 12)
  return (
    <div className="vocab-write prompt-stack">
      {item.prompt ? <p className="column-prompt">{item.prompt}</p> : null}
      {item.vocabDictee && show ? <p className="vocab-dictee-answer">{item.vocabDictee}</p> : null}
      <span
        className={`answer-line-field vocab-answer-line${show ? ' filled' : ''}`}
        style={{ width: `${ch}ch`, maxWidth: '100%' }}
      >
        {show ? item.answer : '\u00a0'}
      </span>
    </div>
  )
}

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
  const carries = item.carries ?? item.digitsA?.map(() => '') ?? []
  const partials = item.digitsPartials ?? []
  const hasPartials = partials.length > 0

  type Line =
    | { kind: 'digits'; digits?: string[]; blank?: boolean; carry?: boolean; sign?: string }
    | { kind: 'rule' }

  const lines: Line[] = [
    { kind: 'digits', digits: carries, blank: !show, carry: true },
    { kind: 'digits', digits: item.digitsA, blank: empty },
    { kind: 'digits', digits: item.digitsB, blank: empty, sign: item.op },
    { kind: 'rule' },
  ]
  if (hasPartials) {
    for (const row of partials) {
      lines.push({ kind: 'digits', digits: row, blank: true })
    }
    lines.push({ kind: 'rule' })
  }
  lines.push({ kind: 'digits', digits: item.digitsResult, blank: true })

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
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

function DivisionColumn({ item, mode }: { item: MathItem; mode: PreviewMode }) {
  const show = mode === 'answers'
  const empty = Boolean(item.blankOperands)
  const workRows = item.digitsPartials ?? []
  const remDigits = item.digitsRemainder ?? ['']

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
          <div className="division-reste">
            <span className="division-reste-label">Reste</span>
            <DigitRow digits={remDigits} empty showAnswer={show} answerDigits={remDigits} />
          </div>
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
            <DigitRow digits={item.digitsResult} empty showAnswer={show} answerDigits={item.digitsResult} />
          </div>
        </div>
      </div>
    </div>
  )
}

function SelectPillsRow({ item, mode }: { item: MathItem; mode: PreviewMode }) {
  const options = item.options ?? []
  const selectedSet = new Set(
    (item.labels?.length ? item.labels : item.answer.split(/\s*·\s*|\s*,\s*/)).map((s) => s.trim()).filter(Boolean),
  )
  const stacked = (item.prompt?.length ?? 0) > 28
  return (
    <div className={`select-pills-row${stacked ? ' stacked' : ''}`} aria-label="Choix">
      <span className="select-pills-prompt">{item.prompt}</span>
      <div className="select-pills" role="group">
        {options.map((option) => {
          const selected = mode === 'answers' && selectedSet.has(option)
          return (
            <span key={option} className={`select-pill ${selected ? 'selected' : ''}`}>
              {option}
            </span>
          )
        })}
      </div>
    </div>
  )
}

function LetterGridRow({ item, mode }: { item: MathItem; mode: PreviewMode }) {
  const options = item.options ?? []
  const targets = new Set(
    (item.labels ?? []).map((s) => s.toLowerCase()).filter(Boolean),
  )
  if (targets.size === 0 && item.answer) {
    for (const ch of item.answer) {
      if (/[A-Za-zÀ-ÿ]/.test(ch)) targets.add(ch.toLowerCase())
    }
  }
  return (
    <div className="letter-grid-block" aria-label="Grille de lettres">
      {item.prompt && <p className="column-prompt">{item.prompt}</p>}
      <div className="letter-grid" role="group">
        {options.map((letter, index) => {
          const hit = mode === 'answers' && targets.has(letter.toLowerCase())
          return (
            <span key={`${letter}-${index}`} className={`letter-cell ${hit ? 'selected' : ''}`}>
              {letter}
            </span>
          )
        })}
      </div>
    </div>
  )
}

function EncadrementRow({ item, mode }: { item: MathItem; mode: PreviewMode }) {
  const show = mode === 'answers'
  return (
    <div className="encadrement-row" aria-label="Encadrement">
      <span className={`answer-line-field encadrement-blank ${show ? 'filled' : ''}`}>
        {show ? formatOperand(item.a) : '\u00a0'}
      </span>
      <span className="encadrement-op">&lt;</span>
      <span className="encadrement-mid">{item.prompt}</span>
      <span className="encadrement-op">&lt;</span>
      <span className={`answer-line-field encadrement-blank ${show ? 'filled' : ''}`}>
        {show ? formatOperand(item.b) : '\u00a0'}
      </span>
    </div>
  )
}

function CompareRow({ item, mode }: { item: MathItem; mode: PreviewMode }) {
  const symbols = ['<', '=', '>'] as const
  return (
    <div className="compare-row school" aria-label="Comparer">
      <span className="compare-side left">{renderMathText(item.left ?? '')}</span>
      <div className="compare-choices" role="group" aria-label="Choisissez le symbole correct">
        {symbols.map((sym) => {
          const selected = mode === 'answers' && item.answer === sym
          return (
            <span
              key={sym}
              className={`compare-choice ${selected ? 'selected' : ''}`}
              aria-label={sym}
            >
              <span className="compare-circle">{sym}</span>
            </span>
          )
        })}
      </div>
      <span className="compare-side right">{renderMathText(item.right ?? '')}</span>
    </div>
  )
}

function OrderRow({ item, mode }: { item: MathItem; mode: PreviewMode }) {
  const show = mode === 'answers'
  const given = item.sequence ?? []
  const parts = item.placeParts ?? []
  const sep = item.orderOp === '>' ? '>' : '<'
  const slots = Math.max(parts.length, given.length, 5)
  return (
    <div className="order-block">
      {item.prompt && <p className="column-prompt">{item.prompt}</p>}
      <div className="order-given" aria-label="Nombres à ranger">
        {given.map((term, index) => (
          <span className="order-given-term" key={`${term}-${index}`}>
            {term}
            {index < given.length - 1 ? <span className="order-given-sep">·</span> : null}
          </span>
        ))}
      </div>
      <div className="order-answer-row" aria-label="Réponse">
        {Array.from({ length: slots }, (_, i) => (
          <Fragment key={i}>
            {i > 0 && <span className="order-sep">{sep}</span>}
            <span className={`answer-line-field order-blank ${show ? 'filled' : ''}`}>
              {show ? (parts[i] ?? '\u00a0') : '\u00a0'}
            </span>
          </Fragment>
        ))}
      </div>
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
              <span className={`sequence-term blank ${mode === 'answers' ? 'filled' : ''}`} key={index}>
                {value ?? '\u00a0'}
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
    </div>
  )
}

function formatOperand(n: number | undefined): string {
  if (n == null) return ''
  return String(n).replace('.', ',')
}

function parseBinaryEquation(prompt: string): {
  a: string
  op: string
  b: string
  trailing: 'blank' | 'value' | 'none'
  trailingValue?: string
} | null {
  const trimmed = prompt.trim()
  const withBlank = /^(.+?)\s*([+\-−×÷])\s*(.+?)\s*=\s*□?\s*$/u.exec(trimmed)
  if (!withBlank) return null
  const a = withBlank[1]!.trim()
  const op = withBlank[2]!.replace('-', '−')
  const b = withBlank[3]!.trim()
  if (!a || !b) return null
  // Évite les phrases (« Dans 12, le chiffre… »)
  if (/[a-zA-Zàâäéèêëïîôùûüç]/u.test(a) || /[a-zA-Zàâäéèêëïîôùûüç]/u.test(b)) return null
  const endsBlank = /=\s*□?\s*$/u.test(trimmed) && !/=\s*-?\d/.test(trimmed)
  return { a, op, b, trailing: endsBlank || trimmed.endsWith('=') ? 'blank' : 'none' }
}

function EquationRow({ item, mode }: { item: MathItem; mode: PreviewMode }) {
  const show = mode === 'answers'
  const missing = item.missing ?? 'result'
  const aText = missing === 'a' && !show ? null : formatOperand(item.a)
  const bText = missing === 'b' && !show ? null : formatOperand(item.b)
  const resultShown = missing === 'result' ? (show ? item.answer : null) : formatOperand(item.result) || item.answer

  return (
    <div className="eq-row" aria-label="Calcul">
      <span className="eq-cell eq-num">
        {aText == null ? (
          <span className={`answer-line-field compact ${show ? 'filled' : ''}`}>{show ? formatOperand(item.a) : '\u00a0'}</span>
        ) : (
          aText
        )}
      </span>
      <span className="eq-cell eq-op">{item.op}</span>
      <span className="eq-cell eq-num">
        {bText == null ? (
          <span className={`answer-line-field compact ${show ? 'filled' : ''}`}>{show ? formatOperand(item.b) : '\u00a0'}</span>
        ) : (
          bText
        )}
      </span>
      <span className="eq-cell eq-eq">=</span>
      <span className="eq-cell eq-ans">
        {resultShown == null ? (
          <span className="answer-line-field">{'\u00a0'}</span>
        ) : missing === 'result' ? (
          <span className={`answer-line-field ${show ? 'filled' : ''}`}>{resultShown}</span>
        ) : (
          <span className="filled-answer">{resultShown}</span>
        )}
      </span>
    </div>
  )
}

function ParsedEquationRow({
  a,
  op,
  b,
  answer,
  mode,
}: {
  a: string
  op: string
  b: string
  answer: string
  mode: PreviewMode
}) {
  const show = mode === 'answers'
  const blankA = a === '□'
  const blankB = b === '□'
  return (
    <div className="eq-row" aria-label="Calcul">
      <span className="eq-cell eq-num">
        {blankA ? (
          <span className={`answer-line-field compact ${show ? 'filled' : ''}`}>{show ? answer : '\u00a0'}</span>
        ) : (
          a
        )}
      </span>
      <span className="eq-cell eq-op">{op}</span>
      <span className="eq-cell eq-num">
        {blankB ? (
          <span className={`answer-line-field compact ${show ? 'filled' : ''}`}>{show ? answer : '\u00a0'}</span>
        ) : (
          b
        )}
      </span>
      <span className="eq-cell eq-eq">=</span>
      <span className="eq-cell eq-ans">
        {!blankA && !blankB ? (
          <span className={`answer-line-field ${show ? 'filled' : ''}`}>{show ? answer : '\u00a0'}</span>
        ) : show ? (
          <span className="filled-answer">{answer}</span>
        ) : (
          <span className="answer-line-field">{'\u00a0'}</span>
        )}
      </span>
    </div>
  )
}

/** Découpe une expression algébrique en atomes (chiffres, lettres, opérateurs…). */
export function tokenizeAlgebra(expression: string): string[] {
  const tokens: string[] = []
  const re =
    /√\d+|√|[A-Za-z][²³⁴]?|\d+(?:,\d+)?|[+\-−×÷·=/()]/gu
  let last = 0
  for (const match of expression.matchAll(re)) {
    const start = match.index ?? 0
    if (start > last) {
      const gap = expression.slice(last, start).trim()
      if (gap) tokens.push(gap)
    }
    tokens.push(match[0]!.replace(/-/g, '−'))
    last = start + match[0]!.length
  }
  const tail = expression.slice(last).trim()
  if (tail) tokens.push(tail)
  return tokens
}

function isAlgebraLetter(token: string): boolean {
  return /^[A-Za-z][²³⁴]?$/.test(token)
}

function isAlgebraOp(token: string): boolean {
  return /^[+\-−×÷·=/]$/.test(token)
}

function AlgebraToken({ token }: { token: string }) {
  if (token.startsWith('√') && token.length > 1) {
    return (
      <span className="alg-token alg-sqrt">
        √<span className="alg-sqrt-arg">{token.slice(1)}</span>
      </span>
    )
  }
  if (token === '√') return <span className="alg-token alg-sqrt">√</span>
  if (isAlgebraLetter(token)) {
    const letter = token[0]!
    const sup = token.slice(1)
    return (
      <span className="alg-token alg-letter">
        {letter}
        {sup ? <sup>{sup}</sup> : null}
      </span>
    )
  }
  if (isAlgebraOp(token)) return <span className={`alg-token alg-op${token === '=' ? ' alg-eq' : ''}`}>{token}</span>
  if (/^[()]$/.test(token)) return <span className="alg-token alg-paren">{token}</span>
  return <span className="alg-token alg-num">{token}</span>
}

export function AlgebraRow({
  item,
  mode,
  padLeft = 0,
}: {
  item: MathItem
  mode: PreviewMode
  padLeft?: number
}) {
  const show = mode === 'answers'
  const prompt = item.prompt ?? ''
  const hasEquals = prompt.includes('=')
  const tokens = tokenizeAlgebra(prompt)
  const answerLabel = hasEquals ? `x = ${item.answer}` : item.answer

  return (
    <div className="algebra-stack">
    <div
      className={`algebra-row${hasEquals ? ' has-inline-eq' : ''}`}
      aria-label="Expression algébrique"
    >
      <div
        className="algebra-expr"
        style={{ gridTemplateColumns: `repeat(${padLeft + tokens.length}, minmax(1.1ch, max-content))` }}
      >
        {Array.from({ length: padLeft }, (_, i) => (
          <span className="alg-token alg-pad" key={`pad-${i}`} />
        ))}
        {tokens.map((token, i) => (
          <AlgebraToken key={`${token}-${i}`} token={token} />
        ))}
      </div>
      {!hasEquals && <span className="alg-token alg-eq">=</span>}
      <span className={`answer-line-field algebra-answer ${show ? 'filled' : ''}`}>
        {show ? answerLabel : '\u00a0'}
      </span>
    </div>
    <div className="draft-pad draft-pad-short with-grid" aria-label="Zone de brouillon" />
    </div>
  )
}

function PlaceValueRow({ item, mode }: { item: MathItem; mode: PreviewMode }) {
  const show = mode === 'answers'
  const labels = item.labels ?? []
  const parts = item.placeParts ?? []
  const slots = labels.length > 0 ? labels.length : Math.max(parts.length, 3)
  return (
    <div className="place-value-row" aria-label="Décomposition">
      <span className="place-value-num">{item.prompt}</span>
      <span className="place-value-eq">=</span>
      <div className="place-value-slots">
        {Array.from({ length: slots }, (_, i) => (
          <Fragment key={i}>
            {i > 0 && <span className="place-value-plus">+</span>}
            <div className="place-value-slot">
              <span className={`answer-line-field place-value-line ${show ? 'filled' : ''}`}>
                {show ? (parts[i] ?? '\u00a0') : '\u00a0'}
              </span>
              {labels[i] ? <span className="place-value-label">{labels[i]}</span> : null}
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  )
}

function StackedPrompt({ item, mode }: { item: MathItem; mode: PreviewMode }) {
  const show = mode === 'answers'
  return (
    <div className="prompt-stack">
      <p className="prompt-stack-text">{item.prompt}</p>
      <span className={`answer-line-field ${show ? 'filled' : ''}`}>
        {show ? item.answer : '\u00a0'}
      </span>
    </div>
  )
}

function ConvertRow({ item, mode }: { item: MathItem; mode: PreviewMode }) {
  const show = mode === 'answers'
  const convert = item.convert!
  const answer = item.answer.replace(new RegExp(`\\s*${convert.to.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`), '')
  return (
    <div className="convert-row" aria-label="Conversion">
      <span className="convert-value">{convert.value}</span>
      <span className="convert-unit">{convert.from}</span>
      <span className="convert-eq">=</span>
      <span className={`answer-line-field ${show ? 'filled' : ''}`}>{show ? answer : '\u00a0'}</span>
      <span className="convert-unit">{convert.to}</span>
    </div>
  )
}

function InlinePrompt({ item, mode }: { item: MathItem; mode: PreviewMode }) {
  const prompt = item.prompt ?? ''
  const show = mode === 'answers'

  if (item.op && item.a != null && item.b != null) {
    return <EquationRow item={item} mode={mode} />
  }

  const parsed = parseBinaryEquation(prompt)
  if (parsed) {
    return (
      <ParsedEquationRow a={parsed.a} op={parsed.op} b={parsed.b} answer={item.answer} mode={mode} />
    )
  }

  if (prompt.includes('□') || /\d+\/\d+/.test(prompt)) {
    return (
      <div className="inline-prompt equation">
        {renderMathText(prompt, show ? <FractionView value={item.answer} /> : '\u00a0')}
        {!prompt.includes('□') && (
          <>
            <span className="eq-space" />
            <span className={`answer-line-field ${show ? 'filled' : ''}`}>
              {show ? <FractionView value={item.answer} /> : '\u00a0'}
            </span>
          </>
        )}
      </div>
    )
  }

  const endsWithEq = prompt.trimEnd().endsWith('=')
  const hasEq = prompt.includes('=')
  // Phrase / consigne sans « = » : énoncé au-dessus, trait pleine largeur dessous.
  if (!hasEq) {
    return (
      <div className="prompt-stack">
        <p className="prompt-stack-text">{renderMathText(prompt)}</p>
        <span className={`answer-line-field ${show ? 'filled' : ''}`}>
          {show ? <FractionView value={item.answer} /> : '\u00a0'}
        </span>
      </div>
    )
  }

  // « expr = » : expression à droite d’une colonne commune → = et traits alignés entre questions.
  if (endsWithEq) {
    const expr = prompt.trimEnd().replace(/=\s*$/, '').trimEnd()
    return (
      <div className="inline-prompt equation aligned-eq">
        <span className="eq-text">{renderMathText(expr)}</span>
        <span className="eq-sign">=</span>
        <span className={`answer-line-field ${show ? 'filled' : ''}`}>
          {show ? <FractionView value={item.answer} /> : '\u00a0'}
        </span>
      </div>
    )
  }

  return (
    <div className="inline-prompt equation">
      <span className="eq-text">{renderMathText(prompt)}</span>
      {show && <span className="filled-answer">{item.answer}</span>}
    </div>
  )
}

function ProblemBlock({
  item,
  mode,
  draftGrid = true,
}: {
  item: MathItem
  mode: PreviewMode
  draftGrid?: boolean
}) {
  const show = mode === 'answers'
  return (
    <div className="problem-block">
      <p className="problem-prompt">{item.prompt}</p>
      <div className="problem-field">
        <span className="field-label">Calcul</span>
        <div className={`draft-pad ${draftGrid ? 'with-grid' : 'plain'}`} aria-label="Zone de calcul">
          {show && item.calcAnswer ? (
            <strong className="filled-answer draft-pad-answer">{item.calcAnswer}</strong>
          ) : null}
        </div>
      </div>
      <div className="problem-response-line">
        <span className="response-label">Réponse :</span>
        {show ? (
          <strong className="filled-answer response-value">{item.responseAnswer ?? item.answer}</strong>
        ) : (
          <span className="answer-line-field">{'\u00a0'}</span>
        )}
      </div>
    </div>
  )
}

function EquationCorrectionLines({
  lines,
  operations = [],
}: {
  lines: string[]
  operations?: string[]
}) {
  const PHASES = new Set([
    'Isoler une inconnue',
    'Substituer sa valeur',
    "Chercher l'autre inconnue",
  ])
  const rows = lines.map((line, i) => ({
    line,
    op: (operations[i] ?? '').trim(),
  }))

  const parsed = rows.map(({ line, op }) => {
    const equalIndex = line.indexOf('=')
    const hasEquation = equalIndex > 0
    const isPhase = PHASES.has(line) || /^(I|II|dans I|dans II)$/i.test(line.trim())
    return {
      op,
      hasEquation,
      isPhase: isPhase && !hasEquation,
      lhs: hasEquation ? line.slice(0, equalIndex).trim() : '',
      rhs: hasEquation ? line.slice(equalIndex + 1).trim() : '',
      full: line,
    }
  })

  const maxLhsLen = parsed.reduce(
    (max, r) => (r.hasEquation ? Math.max(max, r.lhs.length) : max),
    0,
  )
  const lhsWidthCh = Math.max(maxLhsLen + 0.5, 2)
  const maxOpLen = parsed.reduce((max, r) => Math.max(max, r.op.length), 0)
  const opWidthCh = Math.max(maxOpLen + 0.5, 3)

  return (
    <table className="equation-correction" aria-label="Correction du développement">
      <tbody>
        {parsed.map(({ hasEquation, isPhase, lhs, rhs, full, op }, i) => (
          <tr key={`${full}-${i}`}>
            <td className="eq-corr-op" style={{ width: `${opWidthCh}ch` }}>
              {op || '\u00a0'}
            </td>
            <td className="eq-corr-body">
              {hasEquation ? (
                <span className="eq-corr-eq">
                  <span className="eq-corr-lhs" style={{ width: `${lhsWidthCh}ch` }}>
                    {lhs}
                  </span>
                  <span className="eq-corr-eq-sign">=</span>
                  <span className="eq-corr-rhs">{rhs}</span>
                </span>
              ) : (
                <span className={isPhase ? 'eq-corr-phase' : 'eq-corr-note'}>{full}</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function EquationBlock({
  item,
  mode,
  draftGrid = true,
}: {
  item: MathItem
  mode: PreviewMode
  draftGrid?: boolean
}) {
  const show = mode === 'answers'
  const unknowns = item.unknowns ?? ['x']
  const values = new Map<string, string>()
  const raw = item.responseAnswer ?? item.answer ?? ''
  for (const part of raw.split(';')) {
    const m = part.trim().match(/^([a-z])\s*=\s*(.+)$/i)
    if (m) values.set(m[1]!.toLowerCase(), m[2]!.trim())
  }

  const promptLines = (item.prompt ?? '').split('\n').filter(Boolean)
  const development = item.development ?? (item.calcAnswer ? item.calcAnswer.split('\n') : [])
  const operations = item.operations ?? []

  return (
    <div className="equation-block">
      {item.systemBrace && promptLines.length >= 2 ? (
        <div className="equation-system" aria-label="Système d’équations">
          <div className="equation-system-labels">
            <span>I</span>
            <span>II</span>
          </div>
          <span className="equation-system-brace" aria-hidden>
            {'{'}
          </span>
          <div className="equation-system-eqs">
            {promptLines.map((line, i) => {
              const tokens = tokenizeAlgebra(line)
              return (
                <div
                  className="algebra-expr equation-line"
                  key={`sys-${i}`}
                  style={{
                    gridTemplateColumns: `repeat(${tokens.length}, minmax(1.1ch, max-content))`,
                  }}
                >
                  {tokens.map((token, ti) => (
                    <AlgebraToken key={`${token}-${ti}`} token={token} />
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="equation-prompt" aria-label="Équation">
          {promptLines.map((line, i) => {
            const tokens = tokenizeAlgebra(line)
            return (
              <div
                className="algebra-expr equation-line"
                key={`eq-${i}`}
                style={{
                  gridTemplateColumns: `repeat(${tokens.length}, minmax(1.1ch, max-content))`,
                }}
              >
                {tokens.map((token, ti) => (
                  <AlgebraToken key={`${token}-${ti}`} token={token} />
                ))}
              </div>
            )
          })}
        </div>
      )}
      <div className="problem-field">
        <span className="field-label">{show ? 'Correction' : 'Développement'}</span>
        <div
          className={`draft-pad ${draftGrid ? 'with-grid' : 'plain'}${show ? ' has-correction' : ''}`}
          aria-label="Zone de développement"
        >
          {show && development.length > 0 ? (
            <EquationCorrectionLines lines={development} operations={operations} />
          ) : null}
        </div>
      </div>
      <div className="equation-answer-lines">
        {unknowns.map((u) => (
          <div className="equation-answer-line" key={u}>
            <span className="response-label">{u} =</span>
            {show ? (
              <strong className="filled-answer response-value">{values.get(u) ?? '\u00a0'}</strong>
            ) : (
              <span className="answer-line-field">{'\u00a0'}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function GeoBlock({
  item,
  mode,
  draftGrid = true,
}: {
  item: MathItem
  mode: PreviewMode
  draftGrid?: boolean
}) {
  const show = mode === 'answers'
  return (
    <div className="geo-block">
      {item.compositeScene ? (
        <CompositeFigure scene={item.compositeScene} />
      ) : (
        <GeometryFigure type={item.figure} dims={item.dims} />
      )}
      {(item.calcAnswer || item.responseAnswer) && !item.propertyLines ? (
        <div className={`draft-pad draft-pad-geo ${draftGrid ? 'with-grid' : 'plain'}`} aria-label="Zone de calcul">
          {show && item.calcAnswer ? (
            <strong className="filled-answer draft-pad-answer">{item.calcAnswer}</strong>
          ) : null}
        </div>
      ) : null}
      <div className="geo-side">
        {item.prompt && <p className="column-prompt">{item.prompt}</p>}
        {item.propertyLines ? (
          <div className="property-lines">
            {item.propertyLines.map((line) => (
              <div className="property-line" key={line.label}>
                <span className="property-label">{line.label} :</span>
                {show ? (
                  <strong className="filled-answer property-answer">{line.answer}</strong>
                ) : (
                  <span className="answer-line-field property-blank">{'\u00a0'}</span>
                )}
              </div>
            ))}
          </div>
        ) : null}
        {(item.calcAnswer || item.responseAnswer) && !item.propertyLines ? (
          <div className="problem-response-line">
            <span className="response-label">Réponse :</span>
            {show ? (
              <strong className="filled-answer response-value">{item.responseAnswer ?? item.answer}</strong>
            ) : (
              <span className="answer-line-field">{'\u00a0'}</span>
            )}
          </div>
        ) : null}
        {!item.calcAnswer && !item.propertyLines && (
          <div className="problem-field">
            {show ? (
              <strong className="filled-answer">{item.answer}</strong>
            ) : (
              <span className="answer-line-field">{'\u00a0'}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function CoordBlock({
  item,
  mode,
  coordEdit,
}: {
  item: MathItem
  mode: PreviewMode
  coordEdit?: {
    selectedKind: CoordShape | null
    placingOrigin?: boolean
    onPlace: (x: number, y: number, kind: CoordShape) => void
    onPlaceOrigin?: (col: number, row: number) => void
    onRemove: (x: number, y: number) => void
  }
}) {
  const show = mode === 'answers'
  const isPlace = item.coordTask === 'place'
  const isConstruct = item.coordTask === 'construct'
  const questions = item.coordQuestions ?? []
  const scene = item.coordScene
  const hasLines = Boolean(scene?.lines?.length)
  const numbered = hasLines || isConstruct
  const displayScene = !scene
    ? scene
    : isConstruct && !show
      ? {
          ...scene,
          marks: scene.marks.filter((mark) => mark.reveal !== 'answer'),
          paths: [],
          lines: [],
        }
      : (isPlace || hasLines) && !show
        ? { ...scene, marks: [] as typeof scene.marks }
        : scene.hideAxes
          ? {
              ...scene,
              showOrigin: show,
              marks: scene.marks.map((mark) => ({
                ...mark,
                showCoord: Boolean(mark.given || show),
              })),
            }
          : scene
  return (
    <div
      className={`coord-block${scene ? ' has-scene' : ''}${hasLines || isConstruct ? ' has-lines' : ''}${
        (hasLines || isConstruct) && questions.length >= 7 ? ' is-dense' : ''
      }${scene ? ' is-centered' : ''}`}
    >
      <CoordGrid
        point={item.point}
        pointImage={item.pointImage}
        showImage={show && Boolean(item.pointImage)}
        scene={displayScene}
        editable={Boolean(coordEdit && (scene?.variant === 'cells' || scene?.variant === 'axes') && !hasLines)}
        placingOrigin={coordEdit?.placingOrigin}
        onPlace={
          coordEdit
            ? (x, y) => {
                if (scene?.variant === 'axes') {
                  coordEdit.onPlace(x, y, 'point')
                  return
                }
                const kind = coordEdit.selectedKind
                if (kind) coordEdit.onPlace(x, y, kind)
              }
            : undefined
        }
        onPlaceOrigin={coordEdit?.onPlaceOrigin}
        onRemove={coordEdit?.onRemove}
      />
      <div className="coord-side">
        {item.prompt && questions.length === 0 ? <p className="column-prompt">{item.prompt}</p> : null}
        {questions.length > 0 ? (
          <div
            className={`coord-questions${numbered ? ' is-lines' : ''}${
              scene?.variant === 'cells' ? ' is-shapes' : ''
            }`}
          >
            {questions.map((question, index) => {
              const isAxesPoint = scene?.variant === 'axes' && !hasLines && !isConstruct
              const isDraw = question.reply === 'draw'
              const isPair =
                question.reply === 'pair' ||
                (isAxesPoint && question.reply !== 'text' && !isDraw) ||
                (!isPlace &&
                  !isConstruct &&
                  !hasLines &&
                  !isDraw &&
                  question.reply !== 'text' &&
                  (scene?.variant === 'cells' || scene?.variant === 'polygon' || scene?.variant === 'polar'))
              const showShape = Boolean(question.kind && question.kind !== 'point')
              return (
                <div
                  className={`coord-question${isDraw ? ' is-draw' : ''}`}
                  key={`${question.prompt}-${index}`}
                >
                  {numbered ? <span className="coord-question-num">{index + 1}.</span> : null}
                  {showShape ? (
                    <span className="coord-question-icon">
                      <CoordShapeButton kind={question.kind!} size={16} />
                    </span>
                  ) : null}
                  <span className="coord-question-label">
                    {isAxesPoint ? `${question.prompt} est en` : question.prompt}
                  </span>
                  {isDraw ? null : isPlace || (isPair && show) ? (
                    <strong className={isPlace ? 'coord-given' : 'filled-answer'}>{question.answer}</strong>
                  ) : isPair ? (
                    <span className="coord-pair">
                      (
                      <span className="answer-line-field compact">{'\u00a0'}</span>
                      <span className="coord-pair-sep">;</span>
                      <span className="answer-line-field compact">{'\u00a0'}</span>
                      )
                    </span>
                  ) : show ? (
                    <strong className="filled-answer">{question.answer}</strong>
                  ) : (
                    <span className={`answer-line-field${question.reply === 'text' ? ' compact' : ''}`}>
                      {'\u00a0'}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="problem-field">
            <span className="field-label">Réponse</span>
            {show ? (
              <strong className="filled-answer">{item.answer}</strong>
            ) : (
              <span className="answer-line-field">{'\u00a0'}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function isDarkPhraseColor(color: string): boolean {
  return color === '#1a1a1a' || color === '#111' || color === '#111111'
}

function PhrasePastille({ category, filled }: { category?: PhraseCategory; filled?: boolean }) {
  const color = category ? PHRASE_COLORS[category] : '#111'
  return (
    <span
      className={`phrase-pastille${filled ? ' filled' : ''}`}
      style={filled ? { backgroundColor: color, borderColor: color } : undefined}
      aria-hidden
    />
  )
}

function PhraseColorBlock({ item, mode }: { item: MathItem; mode: PreviewMode }) {
  const show = mode === 'answers'
  const tokens = item.tokens ?? []
  return (
    <div className="phrase-color-block">
      <div className="phrase-word-row">
        {tokens.map((token, i) => (
          <div className="phrase-word-slot" key={`${token.text}-${i}`}>
            <span className="phrase-word">{token.text}</span>
            <PhrasePastille category={token.category} filled={show} />
          </div>
        ))}
        <span className="phrase-period">.</span>
      </div>
      {show && item.responseAnswer ? (
        <p className="phrase-answer-hint">
          <strong className="filled-answer">{item.responseAnswer}</strong>
        </p>
      ) : null}
    </div>
  )
}

function PhraseOrderBlock({ item, mode }: { item: MathItem; mode: PreviewMode }) {
  const show = mode === 'answers'
  const tokens = item.tokens ?? []
  return (
    <div className="phrase-order-block">
      <div className="phrase-bubble-row">
        {tokens.map((token, i) => {
          const fill = PHRASE_COLORS[token.category]
          const ink = isDarkPhraseColor(fill) ? '#fff' : '#111'
          return (
            <span
              className="phrase-bubble"
              key={`${token.text}-${i}`}
              style={{ backgroundColor: fill, borderColor: '#111', color: ink }}
            >
              {token.text}
            </span>
          )
        })}
      </div>
      {show ? (
        <strong className="filled-answer phrase-order-answer">{item.responseAnswer ?? item.answer}</strong>
      ) : (
        <span className="phrase-write-line" />
      )}
    </div>
  )
}

function PhraseBuildBlock({ item, mode }: { item: MathItem; mode: PreviewMode }) {
  const show = mode === 'answers'
  const pastilles = item.pastilles ?? []
  return (
    <div className="phrase-build-block">
      <p className="phrase-verb-prompt">{item.prompt}</p>
      {show ? (
        <strong className="filled-answer">{item.calcAnswer ? `Verbe : ${item.calcAnswer}` : item.answer}</strong>
      ) : (
        <span className="phrase-write-line" />
      )}
      <div className="phrase-pastille-row">
        {pastilles.map((cat, i) => (
          <PhrasePastille key={`${cat}-${i}`} category={cat} filled />
        ))}
      </div>
    </div>
  )
}

function PhraseWriteBlock({ item }: { item: MathItem }) {
  return (
    <div className="phrase-write-block">
      {item.prompt ? <p className="phrase-write-prompt">{item.prompt}</p> : null}
      <span className="phrase-write-line" />
    </div>
  )
}

export function MathItemView({
  item,
  mode,
  index,
  algebraPadLeft = 0,
  draftGrid = true,
  onToggleDraftGrid,
  coordEdit,
}: {
  item: MathItem
  mode: PreviewMode
  index: number
  /** Cases vides à gauche pour aligner verticalement les atomes entre questions. */
  algebraPadLeft?: number
  /** Zone de brouillon avec grille 4×4 mm (problèmes). */
  draftGrid?: boolean
  onToggleDraftGrid?: () => void
  coordEdit?: {
    selectedKind: CoordShape | null
    placingOrigin?: boolean
    onPlace: (x: number, y: number, kind: CoordShape) => void
    onPlaceOrigin?: (col: number, row: number) => void
    onRemove: (x: number, y: number) => void
  }
}) {
  const isProblem = item.layout === 'text' && Boolean(item.calcAnswer || item.responseAnswer)
  const isEquation = item.layout === 'equation'
  const isGeoCalc = item.layout === 'geo' && Boolean(item.calcAnswer || item.responseAnswer)
  const isDraftPad = isProblem || isEquation || isGeoCalc
  const isStackedText = item.layout === 'text' && !isProblem
  const hideNumber =
    item.layout === 'gattegno-chart' ||
    item.layout === 'phrase-write' ||
    item.layout === 'vocab-table' ||
    item.layout === 'vocab-match'
  return (
    <div className={`exercise-item layout-${item.layout}${isDraftPad ? ' is-problem' : ''}`}>
      {isDraftPad && onToggleDraftGrid ? (
        <button
          type="button"
          className={`no-print draft-grid-chip draft-grid-chip-margin ${draftGrid ? 'on' : 'off'}`}
          onClick={onToggleDraftGrid}
          aria-pressed={draftGrid}
        >
          {draftGrid ? 'Grille' : 'Sans'}
        </button>
      ) : null}
      {item.coordScene || hideNumber ? null : <div className="item-number">{index + 1}.</div>}
      <div className="item-content">
        {(item.layout === 'column' || item.layout === 'column-empty') && <ColumnOp item={item} mode={mode} />}
        {item.layout === 'division-column' && <DivisionColumn item={item} mode={mode} />}
        {item.layout === 'compare' && <CompareRow item={item} mode={mode} />}
        {item.layout === 'encadrement' && <EncadrementRow item={item} mode={mode} />}
        {item.layout === 'select' && <SelectPillsRow item={item} mode={mode} />}
        {item.layout === 'letter-grid' && <LetterGridRow item={item} mode={mode} />}
        {item.layout === 'order' && <OrderRow item={item} mode={mode} />}
        {item.layout === 'sequence' && <SequenceRow item={item} mode={mode} />}
        {item.layout === 'geo' && <GeoBlock item={item} mode={mode} draftGrid={draftGrid} />}
        {item.layout === 'coord' && <CoordBlock item={item} mode={mode} coordEdit={coordEdit} />}
        {item.layout === 'algebra' && <AlgebraRow item={item} mode={mode} padLeft={algebraPadLeft} />}
        {item.layout === 'equation' && <EquationBlock item={item} mode={mode} draftGrid={draftGrid} />}
        {item.layout === 'place-value' && <PlaceValueRow item={item} mode={mode} />}
        {item.layout === 'phrase-color' && <PhraseColorBlock item={item} mode={mode} />}
        {item.layout === 'phrase-order' && <PhraseOrderBlock item={item} mode={mode} />}
        {item.layout === 'phrase-build' && <PhraseBuildBlock item={item} mode={mode} />}
        {item.layout === 'phrase-write' && <PhraseWriteBlock item={item} />}
        {item.layout === 'gattegno-chart' && <GattegnoChart mode={item.chartMode ?? 'labels'} />}
        {item.layout === 'vocab-table' && <VocabTable item={item} />}
        {item.layout === 'vocab-match' && <VocabMatch item={item} mode={mode} />}
        {item.layout === 'vocab-write' && <VocabWrite item={item} mode={mode} />}
        {isProblem && <ProblemBlock item={item} mode={mode} draftGrid={draftGrid} />}
        {item.audioSrc ? (
          <audio className="oral-audio" controls preload="none" src={item.audioSrc}>
            Écoutez l’enregistrement.
          </audio>
        ) : null}
        {isStackedText && !item.convert && <StackedPrompt item={item} mode={mode} />}
        {!isProblem &&
          !isStackedText &&
          item.layout === 'inline' &&
          (item.convert ? <ConvertRow item={item} mode={mode} /> : <InlinePrompt item={item} mode={mode} />)}
      </div>
    </div>
  )
}
