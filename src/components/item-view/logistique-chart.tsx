import type { CSSProperties } from 'react'
import type { LogistiqueExerciseTable } from '@/logistique/tables'
import type { PreviewMode } from '@/math/types'

export function LogistiqueBarChart({ table, mode }: { table: LogistiqueExerciseTable; mode: PreviewMode }) {
  const data = table.rows.map(([label, value]) => ({ label: String(label), value: Number(value) }))
  const scaleStep = Math.max(1, Math.ceil(Math.max(...data.map(({ value }) => value)) / 5))
  const maximum = scaleStep * 5
  const ticks = Array.from({ length: 6 }, (_, index) => index * scaleStep)
  const filled = mode === 'answers' || table.presentation === 'lire-graphique'
  const position = (value: number) => `${value / maximum * 100}%`
  return <figure className="logistique-bar-chart">
    <figcaption><strong>{table.title}</strong> · {table.headers[1]}</figcaption>
    <div className="logistique-chart-grid" style={{ '--chart-columns': data.length } as CSSProperties}>
      <div className="logistique-chart-ticks">
        {ticks.map((tick) => <span key={tick} style={{ bottom: position(tick) }}>{tick}</span>)}
      </div>
      <div className="logistique-chart-plot">
        {ticks.map((tick) => <span key={tick} className="logistique-chart-guide" style={{ bottom: position(tick) }} aria-hidden="true" />)}
        <div className="logistique-chart-bars">
          {data.map(({ label, value }) => <div key={label} className="logistique-chart-column">
            {filled && <span className="logistique-chart-bar" style={{ height: position(value) }}
              data-short={value / maximum <= .15 ? '' : undefined} data-zero={value === 0 ? '' : undefined}>
              {mode === 'answers' && <strong className="logistique-chart-value">{value}</strong>}
            </span>}
          </div>)}
        </div>
      </div>
      <div className="logistique-chart-labels">{data.map(({ label }) => <span key={label}>{label}</span>)}</div>
    </div>
  </figure>
}
