import { fmt } from '@/math/column-arith'
import type { MathItem } from '@/math/types'
import { RasterDiagram } from '@/components/math/RasterDiagram'

export function MeasurementScale({ scale }: { scale: NonNullable<MathItem['measureScale']> }) {
  const ticks = Array.from({ length: 9 }, (_, index) => index)
  const { kind, unit, step, tick } = scale
  const angle = (i: number) => Math.PI * (1 - i / 8)
  const point = (i: number, radius: number) => ({
    x: 130 + radius * Math.cos(angle(i)),
    y: 128 - radius * Math.sin(angle(i)),
  })
  const tip = point(tick, 67)
  // Valeurs des repères dans le texte de remplacement, sans donner la réponse.
  const label = `Échelle en ${unit}. De 0 à ${fmt(step * 8)}, huit intervalles égaux. Repère indiqué après ${tick} intervalles.`
  if (kind === 'capacity') {
    return (
      <div className="math-scale">
        <RasterDiagram viewBox="0 0 260 158" role="img" aria-label={label}>
          <path d="M96 15 L96 143 H162 V15" fill="none" stroke="currentColor" strokeWidth="2" />
          <rect x="97" y={136 - tick * 14} width="64" height={tick * 14} fill="#bedbe8" />
          <line x1="97" x2="162" y1={136 - tick * 14} y2={136 - tick * 14} stroke="currentColor" strokeWidth="2" />
          {ticks.map(i => (
            <g key={i}>
              <line x1={i % 2 ? 153 : 146} x2="164" y1={136 - i * 14} y2={136 - i * 14} stroke="currentColor" />
              {i % 2 === 0 && <text x="173" y={140 - i * 14} fontSize="10">{fmt(step * i)}</text>}
            </g>
          ))}
          <text x="173" y="13" fontSize="10">{unit}</text>
        </RasterDiagram>
      </div>
    )
  }
  return (
    <div className="math-scale">
      <RasterDiagram viewBox="0 0 260 158" role="img" aria-label={label}>
        <path d="M39 128 A91 91 0 0 1 221 128" fill="#f9efd9" stroke="currentColor" strokeWidth="2" />
        {ticks.map(i => {
          const inner = point(i, i % 2 ? 85 : 78)
          const outer = point(i, 91)
          const printed = point(i, 108)
          return (
            <g key={i}>
              <line x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} stroke="currentColor" strokeWidth={i % 2 ? 1 : 2} />
              {i % 2 === 0 && <text x={printed.x} y={printed.y + 3} textAnchor="middle" fontSize="11">{fmt(step * i)}</text>}
            </g>
          )
        })}
        <line x1="130" y1="128" x2={tip.x} y2={tip.y} stroke="currentColor" strokeWidth="2.5" />
        <circle cx="130" cy="128" r="4" fill="currentColor" />
        <text x="130" y="149" textAnchor="middle" fontSize="12">{unit}</text>
      </RasterDiagram>
    </div>
  )
}
