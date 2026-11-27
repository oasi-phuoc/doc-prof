import type { MathItem, PreviewMode } from '../../math/types'

type GraphPractice = NonNullable<MathItem['graphPractice']>

function TemperatureGraph({ pairs, yStep, showLine }: Omit<GraphPractice, 'task'> & { showLine: boolean }) {
  const levels = Array.from({ length: 13 }, (_, i) => i)
  const spacing = 22
  const x = (index: number) => 37 + spacing * index
  const y = (value: number) => 126 - 8 * value
  const left = x(0)
  const right = x(pairs.length - 1)
  const bottom = y(0)
  const top = y(12)
  return (
    <svg
      viewBox="0 0 177 158"
      role="img"
      className="math-temperature-graph"
      aria-label="Graphique des températures en degrés Celsius suivant l’heure"
    >
      <text x={left} y="13">Température (°C)</text>
      {levels.map((n) => (
        <g key={n}>
          <line className={n % yStep === 0 ? "math-graph-grid" : "math-graph-grid is-minor"} x1={left} y1={y(n)} x2={right} y2={y(n)} />
          {n % yStep === 0 && <text x={left - 6} y={y(n)} dy="0.32em" textAnchor="end">{n}</text>}
        </g>
      ))}
      {pairs.map(({ x: hour }, i) => (
        <g key={hour}>
          <line className="math-graph-grid" x1={x(i)} y1={top} x2={x(i)} y2={bottom} />
          <text x={x(i)} y={bottom + 13} textAnchor="middle">{hour}</text>
        </g>
      ))}
      <path className="math-graph-axes" d={`M${left},${top - 7}V${bottom}H${right + 8}`} />
      <text x={right + 10} y={bottom + 13}>Heure</text>
      {showLine && (
        <g className="math-graph-series">
          <polyline points={pairs.map(({ y: value }, i) => `${x(i)},${y(value)}`).join(' ')} />
          {pairs.map(({ x: hour, y: value }, i) => <circle key={hour} cx={x(i)} cy={y(value)} r="2.5" />)}
        </g>
      )}
    </svg>
  )
}

export function TableAndGraph({
  graph, prompt, mode,
}: { graph: GraphPractice; prompt: string; mode: PreviewMode }) {
  const show = mode === 'answers'
  const { pairs, task, yStep } = graph
  return (
    <div className="math-table-and-graph">
      <p className="prompt-stack-text">{prompt}</p>
      <TemperatureGraph pairs={pairs} yStep={yStep} showLine={show || task === 'read'} />
      <table className="math-function-values" aria-label="Tableau des températures">
        <tbody>
          <tr><th scope="row">Heure (h)</th>{pairs.map(({ x }) => <td key={x}>{x}</td>)}</tr>
          <tr>
            <th scope="row">Temp. (°C)</th>
            {pairs.map(({ x, y }) => <td key={x}>{show || task === 'plot' ? y : <span aria-label="À remplir">…</span>}</td>)}
          </tr>
        </tbody>
      </table>
    </div>
  )
}
