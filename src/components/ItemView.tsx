import { Fragment, type CSSProperties, type ReactNode } from 'react'
import type { CoordShape, MathItem, PhraseCategory, PreviewMode } from '@/math/types'
import { PHRASE_COLORS } from '@/francais/phrase-banks'
import { CompositeFigure } from './math/CompositeFigure'
import { CoordGrid, CoordShapeButton } from './math/CoordGrid'
import { FractionView, renderMathText } from './math/FractionView'
import { GattegnoChart } from './math/GattegnoChart'
import { GeometryFigure } from './math/GeometryFigure'
import { GlossaryFigure } from './math/GlossaryFigure'
import type { GlossaryFigureId } from '@/math/glossary-banks'
import { CardGrid } from '@/jeux/CardGrid'
import type { GameBoard } from '@/jeux/types'
import { CalligraphyView } from './math/CalligraphyView'

function VocabTable({ item }: { item: MathItem }) {
  const rows = Math.max(1, item.vocabRows ?? 3)
  const cols = Math.max(1, item.vocabCols ?? 3)
  const entries = item.vocabEntries ?? []
  const cells = Array.from({ length: rows * cols }, (_, index) => entries[index] ?? null)
  const themeLetters = item.labels ?? []
  const highlight = themeLetters.length > 0

  return (
    <div
      className={`vocab-table${highlight ? ' vocab-table--theme-letters' : ''}`}
      style={{ '--vocab-cols': cols, '--vocab-rows': rows } as CSSProperties}
      aria-label="Mots à apprendre"
    >
      {cells.map((entry, index) => (
        <div className="vocab-card" key={`card-${index}`}>
          <div className="vocab-card-image">
            {entry?.imageSrc ? (
              <img src={entry.imageSrc} alt="" />
            ) : (
              <span className="vocab-card-empty" aria-hidden />
            )}
          </div>
          <div className="vocab-card-word">
            {entry?.label
              ? highlight
                ? highlightThemeLetters(entry.label, themeLetters)
                : entry.label
              : ''}
          </div>
        </div>
      ))}
    </div>
  )
}

function VocabMatch({ item, mode }: { item: MathItem; mode: PreviewMode }) {
  const left = item.labels ?? []
  const right = item.options ?? []
  const pairs = item.vocabPairs ?? []
  const byLeft = new Map(pairs.map((pair) => [pair.left, pair.right]))
  const imageMode = item.vocabMatchMode === 'image'
  const syllableMode = item.vocabMatchMode === 'syllables'
  const graphemes = item.themeGraphemes ?? []

  if (syllableMode) {
    return (
      <div className="vocab-match vocab-match--syllables" aria-label="Relier les syllabes">
        {item.prompt ? <p className="column-prompt">{item.prompt}</p> : null}
        <table className="syllable-match-table">
          <tbody>
            {left.map((leftPart, index) => {
              const rightPart = right[index] ?? ''
              const matchLeft =
                mode === 'answers'
                  ? left.find((l) => byLeft.get(l) === rightPart)
                  : undefined
              const matchNum =
                matchLeft != null ? left.findIndex((l) => l === matchLeft) + 1 : 0
              return (
                <tr key={`sm-${index}`}>
                  <td className="syllable-match-num">{index + 1}.</td>
                  <td className="syllable-match-left">
                    {highlightThemeLetters(leftPart, graphemes)}
                  </td>
                  <td className="syllable-match-dot" aria-hidden>
                    ●
                  </td>
                  <td className="syllable-match-gap" aria-hidden />
                  <td className="syllable-match-dot" aria-hidden>
                    ●
                  </td>
                  <td className="syllable-match-right">
                    <span className="syllable-match-right-text">
                      {highlightThemeLetters(rightPart, graphemes)}
                    </span>
                    {mode === 'answers' && matchNum > 0 ? (
                      <span className="syllable-match-key"> ← {matchNum}</span>
                    ) : null}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }

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

function ReadPhrasesBlock({ item }: { item: MathItem }) {
  const phrases = item.readPhrases ?? []
  const graphemes = item.themeGraphemes ?? []
  return (
    <div className="read-phrases-block" aria-label="Phrases à lire">
      <table className="read-phrases-table">
        <tbody>
          {phrases.map((phrase, index) => (
            <tr key={`rp-${index}`}>
              <td className="read-phrases-num">{index + 1}.</td>
              <td className="read-phrases-text">
                {highlightThemeLetters(phrase, graphemes)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function CountSoundBlock({ item, mode }: { item: MathItem; mode: PreviewMode }) {
  const rows = item.countSoundItems ?? []
  const show = mode === 'answers'
  return (
    <div className="count-sound-block" aria-label="Compter le son">
      <table className="count-sound-table">
        <tbody>
          {rows.map((row, index) => (
            <Fragment key={`csr-${index}`}>
              <tr className="count-sound-prompt-row">
                <td className="count-sound-num" rowSpan={2}>
                  {index + 1}.
                </td>
                <td className="count-sound-prompt-cell">
                  <span className="count-sound-prompt">
                    J’entends{' '}
                    <span className={`count-sound-blank${show ? ' filled' : ''}`}>
                      {show ? String(row.count) : '\u00a0'}
                    </span>{' '}
                    fois le son.
                  </span>
                </td>
              </tr>
              <tr className="count-sound-phrase-row">
                <td className="count-sound-phrase-cell">
                  <div className="count-sound-phrase-wrap">
                    <p className="count-sound-phrase">{row.phrase}</p>
                  </div>
                </td>
              </tr>
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function DicteeGridBlock({ item, mode }: { item: MathItem; mode: PreviewMode }) {
  const words = item.dicteeWords ?? []
  const show = mode === 'answers'
  /** 4 lignes × 2 colonnes : gauche 1–4, droite 5–8. */
  const rows = [0, 1, 2, 3].map((r) => ({
    left: { n: r + 1, word: words[r] },
    right: { n: r + 5, word: words[r + 4] },
  }))
  return (
    <div className="dictee-grid-block" aria-label="Dictée">
      {item.prompt ? <p className="column-prompt">{item.prompt}</p> : null}
      <table className="dictee-grid-table">
        <tbody>
          {rows.map((row, ri) => (
            <tr key={`dg-${ri}`}>
              <td className="dictee-grid-num">{row.left.n}.</td>
              <td className="dictee-grid-line-cell">
                <span className={`dictee-write-line${show && row.left.word ? ' filled' : ''}`}>
                  {show && row.left.word ? row.left.word : '\u00a0'}
                </span>
              </td>
              <td className="dictee-grid-gutter" aria-hidden />
              <td className="dictee-grid-num">{row.right.n}.</td>
              <td className="dictee-grid-line-cell">
                <span className={`dictee-write-line${show && row.right.word ? ' filled' : ''}`}>
                  {show && row.right.word ? row.right.word : '\u00a0'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function DeterminantFillBlock({ item, mode }: { item: MathItem; mode: PreviewMode }) {
  const rows = item.determinantFills ?? []
  const graphemes = item.themeGraphemes ?? []
  const show = mode === 'answers'
  return (
    <div className="determinant-fill-block" aria-label="Déterminants">
      <p className="column-prompt determinant-fill-prompt">
        Complétez avec les déterminants{' '}
        <span className="det-choice">l’</span>, <span className="det-choice">le</span>,{' '}
        <span className="det-choice">la</span> ou <span className="det-choice">les</span>.
      </p>
      <table className="determinant-fill-table">
        <tbody>
          {rows.map((row, index) => (
            <tr key={`det-${index}`}>
              <td className="determinant-fill-num">{index + 1}.</td>
              <td className="determinant-fill-text">
                {row.parts.map((part, pi) => {
                  if ('blank' in part) {
                    return (
                      <span
                        key={`b-${pi}`}
                        className={`determinant-blank${show ? ' filled' : ''}`}
                      >
                        {show ? part.blank : '\u00a0'}
                      </span>
                    )
                  }
                  const content = highlightThemeLetters(part.t, graphemes)
                  return part.u ? (
                    <span key={`t-${pi}`} className="determinant-underline">
                      {content}
                    </span>
                  ) : (
                    <span key={`t-${pi}`}>{content}</span>
                  )
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function PhraseScrambleBlock({ item, mode }: { item: MathItem; mode: PreviewMode }) {
  const rows = item.phraseScrambles ?? []
  const graphemes = item.themeGraphemes ?? []
  const show = mode === 'answers'
  return (
    <div className="phrase-scramble-block" aria-label="Mot dans la phrase">
      {item.prompt ? <p className="column-prompt">{item.prompt}</p> : null}
      <table className="phrase-scramble-table">
        <tbody>
          {rows.map((row, index) => {
            const blankCh = Math.max(6, Math.min(14, row.word.length + 2))
            return (
              <tr key={`ps-${index}-${row.word}`}>
                <td className="phrase-scramble-num">{index + 1}.</td>
                <td className="phrase-scramble-image">
                  {row.imageSrc ? (
                    <img src={row.imageSrc} alt="" />
                  ) : (
                    <span className="vocab-card-empty" aria-hidden />
                  )}
                </td>
                <td className="phrase-scramble-text">
                  <span className="phrase-scramble-sentence">
                    {highlightThemeLetters(row.before, graphemes)}
                    <span
                      className={`phrase-scramble-blank${show ? ' filled' : ''}`}
                      style={{ width: `${blankCh}ch` }}
                    >
                      {show ? row.word : '\u00a0'}
                    </span>
                    {highlightThemeLetters(row.after, graphemes)}{' '}
                    <span className="phrase-scramble-letters">({row.letters})</span>
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function SyllableSoundBlock({ item, mode }: { item: MathItem; mode: PreviewMode }) {
  const rows = item.syllableSoundItems ?? []
  const cols = Math.max(1, item.letterGridCols ?? 3)
  const show = mode === 'answers'
  return (
    <div className="syllable-sound-block" aria-label="Syllabe du son">
      {item.prompt ? <p className="column-prompt">{item.prompt}</p> : null}
      <div
        className="syllable-sound-grid"
        style={{ '--ss-cols': cols } as CSSProperties}
      >
        {rows.map((row, index) => (
          <div className="syllable-sound-card" key={`ss-${index}-${row.word}`}>
            <div className="syllable-sound-image">
              {row.imageSrc ? (
                <img src={row.imageSrc} alt="" />
              ) : (
                <span className="vocab-card-empty" aria-hidden />
              )}
            </div>
            <div className="syllable-sound-foot">
              <span className="syllable-sound-num">{index + 1}.</span>
              <table className="syllable-mini-table" aria-label={`${row.parts.length} syllabes`}>
                <tbody>
                  <tr>
                    {row.parts.map((part, pIdx) => {
                      const hit = show && pIdx === row.hitIndex
                      return (
                        <td
                          key={`${row.word}-${pIdx}`}
                          className={hit ? 'is-hit' : undefined}
                        >
                          {hit ? part : '\u00a0'}
                        </td>
                      )
                    })}
                  </tr>
                </tbody>
              </table>
              {show ? <span className="syllable-sound-word">{row.word}</span> : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ListenCheckBlock({ item, mode }: { item: MathItem; mode: PreviewMode }) {
  const words = item.options ?? []
  const images = item.optionImages ?? []
  const withImages = images.length > 0 && images.length === words.length
  const positives = new Set((item.labels ?? []).map((w) => w.toLowerCase()))
  const cols = Math.max(1, item.letterGridCols ?? (withImages ? 5 : 3))
  const show = mode === 'answers'
  return (
    <div
      className={`listen-check-block${withImages ? ' listen-check-block--images' : ''}`}
      aria-label="Entendre le son"
    >
      {item.prompt ? <p className="column-prompt">{item.prompt}</p> : null}
      <div
        className={`listen-check-grid${withImages ? ' listen-check-grid--images' : ''}`}
        style={{ '--lc-cols': cols } as CSSProperties}
      >
        {words.map((word, index) => {
          const hit = positives.has(word.toLowerCase())
          if (withImages) {
            return (
              <div className="listen-check-image-cell" key={`lci-${index}-${word}`}>
                <div className="listen-check-image">
                  {images[index] ? (
                    <img src={images[index]} alt="" />
                  ) : (
                    <span className="vocab-card-empty" aria-hidden />
                  )}
                </div>
                <div className="listen-check-image-foot">
                  <span className="listen-check-num">{index + 1}.</span>
                  <span
                    className={`listen-check-box${show && hit ? ' checked' : ''}`}
                    aria-hidden
                  >
                    {show && hit ? '✓' : ''}
                  </span>
                  {show ? <span className="listen-check-caption">{word}</span> : null}
                </div>
              </div>
            )
          }
          return (
            <div className="listen-check-cell" key={`lc-${index}-${word}`}>
              <span className="listen-check-num">{index + 1}.</span>
              <span
                className={`listen-check-box${show && hit ? ' checked' : ''}`}
                aria-hidden
              >
                {show && hit ? '✓' : ''}
              </span>
              <span className={`listen-check-line${show ? ' filled' : ''}`}>
                {show ? word : '\u00a0'}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function SyllableCompleteBlock({ item, mode }: { item: MathItem; mode: PreviewMode }) {
  const rows = item.syllableCompletes ?? []
  const cols = Math.max(1, item.vocabCols ?? 2)
  const show = mode === 'answers'
  return (
    <div className="syllable-complete-block" aria-label="Compléter les mots">
      {item.prompt ? <p className="column-prompt">{item.prompt}</p> : null}
      <div
        className="syllable-complete-grid"
        style={{ '--sc-cols': cols } as CSSProperties}
      >
        {rows.map((row, index) => {
          const blankCh = Math.max(2, Math.min(6, row.blank.length + 1))
          return (
            <div className="syllable-complete-card" key={`sc-${index}-${row.word}`}>
              <div className="syllable-complete-image">
                {row.imageSrc ? (
                  <img src={row.imageSrc} alt="" />
                ) : (
                  <span className="vocab-card-empty" aria-hidden />
                )}
              </div>
              <div className="syllable-complete-text">
                <span className="syllable-complete-article">{row.article}</span>{' '}
                {row.before ? <span className="syllable-complete-affix">{row.before}</span> : null}
                <span
                  className={`syllable-complete-blank${show ? ' filled' : ''}`}
                  style={{ width: `${blankCh}ch` }}
                >
                  {show ? row.blank : '\u00a0'}
                </span>
                <span className="syllable-complete-affix">{row.after}</span>
                {show ? (
                  <span className="syllable-complete-full">
                    {' '}
                    ({row.article} {row.word})
                  </span>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

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
        return (
          <span
            className={`digit-cell ${empty && !showAnswer ? 'blank' : ''} ${carry ? 'carry' : ''}${
              showComma ? ' has-comma' : ''
            }`}
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

function ColumnOp({ item, mode }: { item: MathItem; mode: PreviewMode }) {
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

function DivisionColumn({ item, mode }: { item: MathItem; mode: PreviewMode }) {
  const show = mode === 'answers'
  const empty = Boolean(item.blankOperands)
  const workRows = item.digitsPartials ?? []
  const remDigits = item.digitsRemainder ?? ['']
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

function SelectPillsRow({ item, mode }: { item: MathItem; mode: PreviewMode }) {
  const options = item.options ?? []
  const selectedSet = new Set(
    (item.labels?.length ? item.labels : item.answer.split(/\s*·\s*|\s*,\s*/)).map((s) => s.trim()).filter(Boolean),
  )
  const answerMode = item.answerMode ?? 'qcm'
  const isOral = item.selectVariant === 'oral'

  if (isOral && answerMode === 'text') {
    return (
      <div className="oral-answer-stack" aria-label="Réponse libre">
        <p className="oral-qcm-prompt">{item.prompt}</p>
        <span className={`answer-line-field ${mode === 'answers' ? 'filled' : ''}`}>
          {mode === 'answers' ? item.answer : '\u00a0'}
        </span>
      </div>
    )
  }

  if (isOral && answerMode === 'images' && item.optionImages?.length === options.length) {
    const letters = ['A', 'B', 'C']
    return (
      <div className="oral-answer-stack oral-qcm-images" aria-label="Choix images">
        <p className="oral-qcm-prompt">{item.prompt}</p>
        <div className="oral-qcm-options images" role="group">
          {options.map((option, index) => {
            const selected = mode === 'answers' && selectedSet.has(option)
            const src = item.optionImages?.[index]
            return (
              <div key={`${option}-${index}`} className={`oral-qcm-option ${selected ? 'selected' : ''}`}>
                {src ? <img className="oral-qcm-img" src={src} alt={option} /> : null}
                <span className="oral-qcm-option-label">{option}</span>
                <span className="oral-qcm-check">
                  {letters[index] ?? String(index + 1)}{' '}
                  <span className={`oral-qcm-box ${selected ? 'checked' : ''}`} aria-hidden>
                    {selected ? '✓' : ''}
                  </span>
                </span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (isOral) {
    const letters = ['A', 'B', 'C']
    return (
      <div className="oral-answer-stack" aria-label="Choix">
        <p className="oral-qcm-prompt">{item.prompt}</p>
        <div className="oral-qcm-options" role="group">
          {options.map((option, index) => {
            const selected = mode === 'answers' && selectedSet.has(option)
            return (
              <div key={`${option}-${index}`} className={`oral-qcm-option ${selected ? 'selected' : ''}`}>
                <span className="oral-qcm-option-text">{option}</span>
                <span className="oral-qcm-check">
                  {letters[index] ?? String(index + 1)}{' '}
                  <span className={`oral-qcm-box ${selected ? 'checked' : ''}`} aria-hidden>
                    {selected ? '✓' : ''}
                  </span>
                </span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (item.selectVariant === 'cards') {
    const letters = ['A', 'B', 'C']
    return (
      <div className="voc-qcm-stack" aria-label="Choix">
        {item.prompt ? <p className="voc-qcm-prompt">{item.prompt}</p> : null}
        <div className="voc-qcm-cards" role="group">
          {options.slice(0, 3).map((option, index) => {
            const selected = mode === 'answers' && selectedSet.has(option)
            return (
              <div key={`${option}-${index}`} className={`voc-qcm-card${selected ? ' selected' : ''}`}>
                <span className="voc-qcm-card-text">{option}</span>
                <span className="voc-qcm-card-check">
                  {letters[index] ?? String(index + 1)}{' '}
                  <span className={`oral-qcm-box ${selected ? 'checked' : ''}`} aria-hidden>
                    {selected ? '✓' : ''}
                  </span>
                </span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

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

function TheoryBlockView({ item }: { item: MathItem }) {
  const block = item.theoryBlock
  if (!block) return null
  if (block.kind === 'heading') {
    return <h3 className={`theory-heading${block.sub ? ' is-sub' : ''}`}>{block.text}</h3>
  }
  if (block.kind === 'paragraph') {
    return <p className="theory-paragraph">{block.text}</p>
  }
  if (block.kind === 'note') {
    return <p className="theory-note">{block.text}</p>
  }
  if (block.kind === 'rule') {
    return (
      <div className="theory-rule">
        <p className="theory-paragraph">{block.text}</p>
        {block.examples?.length ? (
          <ul className="theory-examples">
            {block.examples.map((ex, index) => (
              <li key={`${ex.correct}-${index}`}>
                <span className="theory-ex-ok">{ex.correct}</span>
                {ex.wrong ? (
                  <>
                    {' '}
                    <span className="theory-ex-bad" aria-label="à éviter">
                      (pas : {ex.wrong})
                    </span>
                  </>
                ) : null}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    )
  }
  if (block.kind === 'list') {
    return (
      <div className="theory-list-block">
        {block.title ? <p className="theory-list-title">{block.title}</p> : null}
        <ul className="theory-list">
          {(block.items ?? []).map((entry, index) => (
            <li key={`${entry}-${index}`}>{entry}</li>
          ))}
        </ul>
      </div>
    )
  }
  if (block.kind === 'table') {
    const headers = block.headers ?? []
    const rows = block.rows ?? []
    return (
      <table className="theory-table">
        {headers.some(Boolean) ? (
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th key={`${header}-${index}`}>{header}</th>
              ))}
            </tr>
          </thead>
        ) : null}
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={`${rowIndex}-${cellIndex}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    )
  }
  return null
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
  const isTable = item.letterGridVariant === 'table'
  const cols = Math.max(1, item.letterGridCols ?? (isTable ? 10 : 8))

  if (isTable) {
    const rows: string[][] = []
    for (let i = 0; i < options.length; i += cols) {
      rows.push(options.slice(i, i + cols))
    }
    return (
      <div className="letter-grid-block letter-grid-block--table" aria-label="Grille de lettres">
        {item.prompt && <p className="column-prompt">{item.prompt}</p>}
        <table className="letter-table">
          <tbody>
            {rows.map((row, rIdx) => (
              <tr key={`r-${rIdx}`}>
                {row.map((letter, cIdx) => {
                  const isLower =
                    letter.length === 1 &&
                    letter === letter.toLowerCase() &&
                    letter !== letter.toUpperCase()
                  const hit = mode === 'answers' && targets.has(letter.toLowerCase())
                  return (
                    <td key={`${rIdx}-${cIdx}-${letter}`}>
                      <span
                        className={[
                          'letter-table-cell',
                          isLower ? 'letter-table-cell--lower' : 'letter-table-cell--upper',
                          hit ? 'selected' : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      >
                        {letter}
                      </span>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="letter-grid-block" aria-label="Grille de lettres">
      {item.prompt && <p className="column-prompt">{item.prompt}</p>}
      <div className="letter-grid" role="group" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
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

/** Met en évidence les graphèmes cibles (voyelle du thème) dans une syllabe. */
function highlightThemeLetters(text: string, graphemes: readonly string[]): ReactNode[] {
  const needles = [...graphemes]
    .filter(Boolean)
    .sort((a, b) => b.length - a.length)
  if (needles.length === 0) return [text]

  const lowerNeedles = needles.map((g) => g.toLowerCase())
  const out: ReactNode[] = []
  let i = 0
  let key = 0
  while (i < text.length) {
    const rest = text.slice(i)
    const restLower = rest.toLowerCase()
    let matched: string | null = null
    for (let n = 0; n < lowerNeedles.length; n++) {
      const needle = lowerNeedles[n]!
      if (restLower.startsWith(needle)) {
        matched = rest.slice(0, needle.length)
        break
      }
    }
    if (matched) {
      out.push(
        <span key={`v-${key++}`} className="syllable-vowel">
          {matched}
        </span>,
      )
      i += matched.length
    } else {
      out.push(
        <span key={`c-${key++}`} className="syllable-cons">
          {text[i]}
        </span>,
      )
      i += 1
    }
  }
  return out
}

function SyllableTableBlock({ item }: { item: MathItem }) {
  const options = item.options ?? []
  const graphemes = item.labels ?? []
  const cols = Math.max(1, item.letterGridCols ?? 5)
  const rows: string[][] = []
  for (let i = 0; i < options.length; i += cols) {
    rows.push(options.slice(i, i + cols))
  }

  const renderTable = (variant: 'script' | 'playwrite') => (
    <table
      className={`syllable-table syllable-table--${variant}`}
      aria-label={variant === 'script' ? 'Syllabes en script' : 'Syllabes en écriture Playwrite'}
    >
      <tbody>
        {rows.map((row, rIdx) => (
          <tr key={`${variant}-r-${rIdx}`}>
            {row.map((syllable, cIdx) => (
              <td key={`${variant}-${rIdx}-${cIdx}-${syllable}`}>
                <span className="syllable-table-cell">
                  {highlightThemeLetters(syllable, graphemes)}
                </span>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )

  return (
    <div className="syllable-table-block" aria-label="Lecture de syllabes">
      {item.prompt && <p className="column-prompt">{item.prompt}</p>}
      {renderTable('script')}
      {renderTable('playwrite')}
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
    /√\d+|√|[A-Za-z]\/\d+|\d+\/\d+|[A-Za-z][²³⁴]?|\d+(?:,\d+)?|[+\-−×÷·=/()]/gu
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
  if (/^(?:[A-Za-z]|\d+)\/\d+$/.test(token)) {
    return (
      <span className="alg-token alg-frac">
        <FractionView value={token} />
      </span>
    )
  }
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
                    {renderMathText(lhs)}
                  </span>
                  <span className="eq-corr-eq-sign">=</span>
                  <span className="eq-corr-rhs">{renderMathText(rhs)}</span>
                </span>
              ) : (
                <span className={isPhase ? 'eq-corr-phase' : 'eq-corr-note'}>
                  {renderMathText(full)}
                </span>
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
  const columns = item.coordColumns
  const scene = item.coordScene
  const hasLines = Boolean(scene?.lines?.length)
  const numbered = hasLines || (isConstruct && questions.length > 0)
  const displayScene = !scene
    ? scene
    : isConstruct && !show
      ? {
          ...scene,
          marks: scene.marks.filter((mark) => mark.reveal !== 'answer'),
          // Seulement les traits explicitement « always » (figures de transformations).
          // Les tracés de « Construire » restent au corrigé.
          paths: (scene.paths ?? []).filter((path) => path.reveal === 'always'),
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
      {columns || questions.length > 0 || (!isConstruct && Boolean(item.prompt || item.answer)) ? (
      <div className="coord-side">
        {columns ? (
          <div className="coord-transform-cols">
            <div className="coord-transform-col">
              <b>{columns.leftTitle}</b>
              <ul>
                {columns.left.map((row) => (
                  <li key={`L-${row.label}`}>{row.text}</li>
                ))}
              </ul>
            </div>
            <div className="coord-transform-col">
              <b>{columns.rightTitle}</b>
              <ul>
                {columns.right.map((row) => (
                  <li key={`R-${row.label}`}>
                    <span className="coord-transform-label">{row.label}</span>
                    {show ? (
                      <strong className="filled-answer">{row.answer}</strong>
                    ) : (
                      <span className="coord-pair">
                        (
                        <span className="answer-line-field compact">{'\u00a0'}</span>
                        <span className="coord-pair-sep">;</span>
                        <span className="answer-line-field compact">{'\u00a0'}</span>
                        )
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
        {item.prompt && questions.length === 0 && !columns && !isConstruct ? (
          <p className="column-prompt">{item.prompt}</p>
        ) : null}
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
        ) : !columns && !isConstruct ? (
          <div className="problem-field">
            <span className="field-label">Réponse</span>
            {show ? (
              <strong className="filled-answer">{item.answer}</strong>
            ) : (
              <span className="answer-line-field">{'\u00a0'}</span>
            )}
          </div>
        ) : null}
      </div>
      ) : null}
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
      style={
        filled
          ? {
              backgroundColor: color,
              borderColor: color,
              WebkitPrintColorAdjust: 'exact',
              printColorAdjust: 'exact',
            }
          : undefined
      }
      aria-hidden
    />
  )
}

function PhraseAnswerSlot({
  show,
  answer,
}: {
  show: boolean
  answer?: string
}) {
  return (
    <div className="phrase-answer-slot">
      {show && answer ? (
        <strong className="filled-answer phrase-slot-answer">{answer}</strong>
      ) : (
        <span className="phrase-write-line" aria-hidden={!show} />
      )}
    </div>
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
    </div>
  )
}

function PhraseOrderBlock({ item, mode }: { item: MathItem; mode: PreviewMode }) {
  const show = mode === 'answers'
  const tokens = item.tokens ?? []
  const orderedLabels = item.labels ?? []
  const categoryOf = (text: string): PhraseCategory =>
    tokens.find((t) => t.text === text)?.category ?? 'nom'
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
              style={{
                backgroundColor: fill,
                borderColor: '#111',
                color: ink,
                WebkitPrintColorAdjust: 'exact',
                printColorAdjust: 'exact',
              }}
            >
              {token.text}
            </span>
          )
        })}
      </div>
      {show && orderedLabels.length > 0 ? (
        <div className="phrase-bubble-row phrase-order-answer" aria-label="Corrigé">
          {orderedLabels.map((text, i) => {
            const fill = PHRASE_COLORS[categoryOf(text)]
            const ink = isDarkPhraseColor(fill) ? '#fff' : '#111'
            return (
              <span
                className="phrase-bubble"
                key={`ans-${text}-${i}`}
                style={{
                  backgroundColor: fill,
                  borderColor: '#111',
                  color: ink,
                  WebkitPrintColorAdjust: 'exact',
                  printColorAdjust: 'exact',
                }}
              >
                {text}
              </span>
            )
          })}
        </div>
      ) : (
        <PhraseAnswerSlot show={show} answer={item.responseAnswer ?? item.answer} />
      )}
    </div>
  )
}

function PhraseBuildBlock({ item, mode }: { item: MathItem; mode: PreviewMode }) {
  const show = mode === 'answers'
  const pastilles = item.pastilles ?? []
  const answer = item.responseAnswer ?? (item.answer && !item.answer.includes(' · ') ? item.answer : undefined)
  return (
    <div className="phrase-build-block">
      <p className="phrase-verb-prompt">{item.prompt}</p>
      <PhraseAnswerSlot show={show} answer={answer} />
      <div className="phrase-pastille-row">
        {pastilles.map((cat, i) => (
          <PhrasePastille key={`${cat}-${i}`} category={cat} filled />
        ))}
      </div>
    </div>
  )
}

function PhraseWriteBlock({ item, mode }: { item: MathItem; mode: PreviewMode }) {
  const show = mode === 'answers'
  const lines = Math.max(1, item.writeLines ?? 1)
  const answers = (item.responseAnswer ?? item.answer ?? '')
    .split(/\n/)
    .map((line) => line.trim())
    .filter(Boolean)
  return (
    <div className="phrase-write-block">
      {item.prompt ? <p className="phrase-write-prompt">{item.prompt}</p> : null}
      {lines === 1 ? (
        <PhraseAnswerSlot show={show} answer={answers[0]} />
      ) : (
        <ol className="phrase-write-lines">
          {Array.from({ length: lines }, (_, index) => (
            <li key={index}>
              <PhraseAnswerSlot show={show} answer={answers[index]} />
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

export function ItemView({
  item,
  mode,
  index,
  algebraPadLeft = 0,
  draftGrid = true,
  onToggleDraftGrid,
  oralAnswerMode,
  onCycleOralAnswerMode,
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
  oralAnswerMode?: 'qcm' | 'text' | 'images'
  onCycleOralAnswerMode?: () => void
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
  const isOralSelect = item.layout === 'select' && item.selectVariant === 'oral'
  const resolvedOralMode = oralAnswerMode ?? item.answerMode ?? 'qcm'
  const oralItem = isOralSelect ? { ...item, answerMode: resolvedOralMode } : item
  const oralModeLabel =
    resolvedOralMode === 'text' ? 'Texte' : resolvedOralMode === 'images' ? 'Images' : 'QCM'
  const hideNumber =
    item.layout === 'gattegno-chart' ||
    item.layout === 'phrase-write' ||
    item.layout === 'vocab-table' ||
    item.layout === 'vocab-match' ||
    item.layout === 'syllable-complete' ||
    item.layout === 'syllable-table' ||
    item.layout === 'listen-check' ||
    item.layout === 'syllable-sound' ||
    item.layout === 'phrase-scramble' ||
    item.layout === 'determinant-fill' ||
    item.layout === 'dictee-grid' ||
    item.layout === 'count-sound' ||
    item.layout === 'read-phrases' ||
    item.layout === 'theory' ||
    item.layout === 'glossary' ||
    item.layout === 'card-grid' ||
    item.layout === 'calligraphy'
  return (
    <div
      className={`exercise-item layout-${item.layout}${isDraftPad ? ' is-problem' : ''}${
        isOralSelect ? ' is-oral' : ''
      }`}
    >
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
      {isOralSelect && onCycleOralAnswerMode ? (
        <button
          type="button"
          className={`no-print draft-grid-chip draft-grid-chip-margin oral-mode-chip ${
            resolvedOralMode === 'qcm' ? 'on' : 'off'
          }`}
          onClick={onCycleOralAnswerMode}
          aria-label={`Mode de réponse : ${oralModeLabel}. Cliquer pour changer.`}
          title={
            item.imagesAvailable
              ? 'QCM → texte libre → images'
              : 'QCM → texte libre (images indisponibles pour cette question)'
          }
        >
          {oralModeLabel}
        </button>
      ) : null}
      {item.coordScene || hideNumber ? null : <div className="item-number">{index + 1}.</div>}
      <div className="item-content">
        {(item.layout === 'column' || item.layout === 'column-empty') && <ColumnOp item={item} mode={mode} />}
        {item.layout === 'division-column' && <DivisionColumn item={item} mode={mode} />}
        {item.layout === 'compare' && <CompareRow item={item} mode={mode} />}
        {item.layout === 'encadrement' && <EncadrementRow item={item} mode={mode} />}
        {item.layout === 'select' && <SelectPillsRow item={oralItem} mode={mode} />}
        {item.layout === 'theory' && <TheoryBlockView item={item} />}
        {item.layout === 'glossary' && item.glossary ? (
          <div className="glossary-card">
            <div className="glossary-figure-wrap">
              <GlossaryFigure id={item.glossary.figure as GlossaryFigureId} />
            </div>
            <div className="glossary-text">
              <p className="glossary-term">{item.glossary.term}</p>
              <p className="glossary-definition">{item.glossary.definition}</p>
            </div>
          </div>
        ) : null}
        {item.layout === 'letter-grid' && <LetterGridRow item={item} mode={mode} />}
        {item.layout === 'syllable-table' && <SyllableTableBlock item={item} />}
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
        {item.layout === 'phrase-write' && <PhraseWriteBlock item={item} mode={mode} />}
        {item.layout === 'gattegno-chart' && <GattegnoChart mode={item.chartMode ?? 'labels'} />}
        {item.layout === 'vocab-table' && <VocabTable item={item} />}
        {item.layout === 'vocab-match' && <VocabMatch item={item} mode={mode} />}
        {item.layout === 'vocab-write' && <VocabWrite item={item} mode={mode} />}
        {item.layout === 'syllable-complete' && (
          <SyllableCompleteBlock item={item} mode={mode} />
        )}
        {item.layout === 'listen-check' && <ListenCheckBlock item={item} mode={mode} />}
        {item.layout === 'syllable-sound' && (
          <SyllableSoundBlock item={item} mode={mode} />
        )}
        {item.layout === 'phrase-scramble' && (
          <PhraseScrambleBlock item={item} mode={mode} />
        )}
        {item.layout === 'determinant-fill' && (
          <DeterminantFillBlock item={item} mode={mode} />
        )}
        {item.layout === 'dictee-grid' && (
          <DicteeGridBlock item={item} mode={mode} />
        )}
        {item.layout === 'count-sound' && (
          <CountSoundBlock item={item} mode={mode} />
        )}
        {item.layout === 'read-phrases' && <ReadPhrasesBlock item={item} />}
        {item.layout === 'card-grid' && item.gameBoard ? (
          <CardGrid board={item.gameBoard as GameBoard} />
        ) : null}
        {item.layout === 'calligraphy' && item.calligraphy ? (
          <CalligraphyView item={item} />
        ) : null}
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
