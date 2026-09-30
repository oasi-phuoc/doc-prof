import type { GlossaryFigureId } from '@/math/glossary-banks'

/** Schémas scolaires N&B / trait pour le glossaire maths. */
export function GlossaryFigure({ id }: { id: GlossaryFigureId }) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }
  return (
    <svg className="glossary-figure" viewBox="0 0 64 48" role="img" aria-hidden>
      {id === 'nombre' || id === 'chiffre' ? (
        <text x="32" y="30" textAnchor="middle" fontSize="18" fontWeight="700" fill="currentColor">
          {id === 'chiffre' ? '7' : '128'}
        </text>
      ) : null}
      {id === 'addition' || id === 'somme' || id === 'terme' ? (
        <text x="32" y="30" textAnchor="middle" fontSize="14" fontWeight="700" fill="currentColor">
          3 + 5 = 8
        </text>
      ) : null}
      {id === 'soustraction' || id === 'difference' ? (
        <text x="32" y="30" textAnchor="middle" fontSize="14" fontWeight="700" fill="currentColor">
          9 − 4 = 5
        </text>
      ) : null}
      {id === 'multiplication' || id === 'produit' ? (
        <text x="32" y="30" textAnchor="middle" fontSize="14" fontWeight="700" fill="currentColor">
          3 × 4 = 12
        </text>
      ) : null}
      {id === 'division' || id === 'quotient' ? (
        <text x="32" y="30" textAnchor="middle" fontSize="14" fontWeight="700" fill="currentColor">
          12 ÷ 3 = 4
        </text>
      ) : null}
      {id === 'egal' ? (
        <text x="32" y="30" textAnchor="middle" fontSize="20" fontWeight="700" fill="currentColor">
          =
        </text>
      ) : null}
      {id === 'compare' ? (
        <text x="32" y="30" textAnchor="middle" fontSize="16" fontWeight="700" fill="currentColor">
          2 &lt; 5 &gt; 1
        </text>
      ) : null}
      {id === 'pair-impair' ? (
        <text x="32" y="30" textAnchor="middle" fontSize="12" fontWeight="700" fill="currentColor">
          4 pair · 7 impair
        </text>
      ) : null}
      {id === 'point' ? <circle cx="32" cy="24" r="2.4" fill="currentColor" /> : null}
      {id === 'droite' ? <line x1="6" y1="24" x2="58" y2="24" {...common} /> : null}
      {id === 'segment' ? (
        <g>
          <line x1="14" y1="24" x2="50" y2="24" {...common} />
          <circle cx="14" cy="24" r="2" fill="currentColor" />
          <circle cx="50" cy="24" r="2" fill="currentColor" />
        </g>
      ) : null}
      {id === 'demi-droite' ? (
        <g>
          <line x1="16" y1="24" x2="58" y2="24" {...common} />
          <circle cx="16" cy="24" r="2" fill="currentColor" />
        </g>
      ) : null}
      {id === 'angle' ? (
        <g>
          <line x1="14" y1="36" x2="50" y2="36" {...common} />
          <line x1="14" y1="36" x2="40" y2="10" {...common} />
        </g>
      ) : null}
      {id === 'angle-droit' ? (
        <g>
          <line x1="14" y1="38" x2="50" y2="38" {...common} />
          <line x1="14" y1="38" x2="14" y2="10" {...common} />
          <path d="M14 30 H22 V38" {...common} />
        </g>
      ) : null}
      {id === 'angle-aigu' ? (
        <g>
          <line x1="14" y1="38" x2="52" y2="38" {...common} />
          <line x1="14" y1="38" x2="46" y2="14" {...common} />
        </g>
      ) : null}
      {id === 'angle-obtus' ? (
        <g>
          <line x1="10" y1="34" x2="54" y2="34" {...common} />
          <line x1="28" y1="34" x2="12" y2="12" {...common} />
        </g>
      ) : null}
      {id === 'perpendiculaire' ? (
        <g>
          <line x1="8" y1="24" x2="56" y2="24" {...common} />
          <line x1="32" y1="6" x2="32" y2="42" {...common} />
          <path d="M32 24 H38 V30" {...common} />
        </g>
      ) : null}
      {id === 'parallele' ? (
        <g>
          <line x1="10" y1="16" x2="54" y2="16" {...common} />
          <line x1="10" y1="32" x2="54" y2="32" {...common} />
        </g>
      ) : null}
      {id === 'triangle' ? <polygon points="32,8 54,40 10,40" {...common} /> : null}
      {id === 'carre' ? <rect x="16" y="10" width="32" height="32" {...common} /> : null}
      {id === 'rectangle' ? <rect x="10" y="14" width="44" height="24" {...common} /> : null}
      {id === 'cercle' ? (
        <g>
          <circle cx="32" cy="24" r="16" {...common} />
          <line x1="32" y1="24" x2="48" y2="24" {...common} />
          <circle cx="32" cy="24" r="1.6" fill="currentColor" />
        </g>
      ) : null}
      {id === 'milieu' ? (
        <g>
          <line x1="10" y1="24" x2="54" y2="24" {...common} />
          <circle cx="10" cy="24" r="2" fill="currentColor" />
          <circle cx="54" cy="24" r="2" fill="currentColor" />
          <circle cx="32" cy="24" r="2.4" fill="currentColor" />
        </g>
      ) : null}
      {id === 'axe-symetrie' ? (
        <g>
          <polygon points="20,10 32,24 20,38" {...common} />
          <polygon points="44,10 32,24 44,38" {...common} />
          <line x1="32" y1="6" x2="32" y2="42" stroke="currentColor" strokeWidth={1.2} strokeDasharray="3 2" />
        </g>
      ) : null}
    </svg>
  )
}
