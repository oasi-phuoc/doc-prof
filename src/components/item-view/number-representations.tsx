import { fmt } from '@/math/column-arith'
import type { MathItem } from '@/math/types'

export function NumberLinePractice({ line }: { line: NonNullable<MathItem['numberLine']> }) {
  const { start, step, intervals, target, labelAt } = line
  const secondLabel = fmt(start + step * labelAt)
  return (
    <div
      className="math-number-line"
      style={{ gridTemplateColumns: `repeat(${intervals + 1}, minmax(0, 1fr))` }}
      role="img"
      aria-label={`Droite graduée. Le premier trait indique ${fmt(start)}. Le trait numéro ${labelAt + 1} indique ${secondLabel}. Quel nombre indique le trait numéro ${target + 1} ?`}
    >
      {Array.from({ length: intervals + 1 }, (_, i) => (
        <span key={i} className="math-number-tick" aria-hidden="true">
          <span className="math-number-tick-pointer">{i === target ? '↓' : ''}</span>
          <span className="math-number-tick-mark" />
          <span className="math-number-tick-label">{i === 0 ? fmt(start) : i === labelAt ? secondLabel : ''}</span>
        </span>
      ))}
    </div>
  )
}

export function FunctionValueTable({ pairs }: { pairs: NonNullable<MathItem['functionPairs']> }) {
  return (
    <table className="math-function-values" aria-label="Tableau de valeurs">
      <tbody>
        <tr><th scope="row">x</th>{pairs.map(({ x }) => <td key={x}>{fmt(x)}</td>)}</tr>
        <tr><th scope="row">y</th>{pairs.map(({ x, y }) => <td key={x}>{fmt(y)}</td>)}</tr>
      </tbody>
    </table>
  )
}
