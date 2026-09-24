import {
  CHART_WORD_SAMPLES,
  PHRASE_COLORS,
  PHRASE_CATEGORY_LABELS,
} from '@/math/phrase-banks'

type ChartMode = 'labels' | 'words' | 'outline'

function Cell({
  category,
  mode,
  className = '',
  label,
}: {
  category: keyof typeof PHRASE_COLORS
  mode: ChartMode
  className?: string
  label?: string
}) {
  const color = PHRASE_COLORS[category]
  const text =
    mode === 'outline'
      ? ''
      : mode === 'words'
        ? CHART_WORD_SAMPLES[category]
        : (label ?? PHRASE_CATEGORY_LABELS[category].toUpperCase())
  return (
    <div
      className={`gattegno-cell ${className}${mode === 'words' ? ' is-words' : ''}${mode === 'outline' ? ' is-outline' : ''}`}
      style={{ borderColor: color, color: mode === 'words' ? 'var(--ink)' : 'var(--ink)' }}
    >
      {text ? <span>{text}</span> : <span className="gattegno-empty">&nbsp;</span>}
    </div>
  )
}

/** Tableau Gattegno — grammaire en couleur (structure pédagogique). */
export function GattegnoChart({ mode = 'labels' }: { mode?: ChartMode }) {
  return (
    <div className={`gattegno-chart mode-${mode}`} aria-label="Tableau grammaire en couleur">
      <div className="gattegno-row top">
        <div className="gattegno-pronoms-wrap">
          <Cell category="pronom" mode={mode} className="gattegno-pronoms" />
          <span className="gattegno-bridge brown" aria-hidden />
        </div>
        <Cell category="adverbe" mode={mode} className="gattegno-adverbes" />
      </div>

      <div className="gattegno-row middle">
        <div className="gattegno-left-stack">
          <Cell category="interjection" mode={mode} className="gattegno-interjections" label="INTERJECTIONS" />
          <div className="gattegno-noms-adj">
            <Cell category="nom" mode={mode} className="gattegno-noms" />
            <Cell category="adjectif" mode={mode} className="gattegno-adjectifs" />
          </div>
          <div className="gattegno-det-wrap">
            <Cell category="determinant" mode={mode} className="gattegno-determinants" />
            <span className="gattegno-bridge yellow" aria-hidden />
          </div>
          <div className="gattegno-prep-wrap">
            <Cell category="preposition" mode={mode} className="gattegno-prepositions" />
            {mode === 'labels' ? (
              <span className="gattegno-det-prep">DÉTERMINANTS PRÉPOSITIONNELS</span>
            ) : null}
          </div>
        </div>
        <div className="gattegno-right-stack">
          <Cell category="verbe" mode={mode} className="gattegno-verbes" />
          <div className="gattegno-conj-row">
            <Cell
              category="conjonction"
              mode={mode}
              className="gattegno-conj"
              label={mode === 'labels' ? 'CONJONCTIONS DE COORDINATION' : undefined}
            />
            <Cell
              category="conjonction"
              mode={mode}
              className="gattegno-conj"
              label={mode === 'labels' ? 'CONJONCTIONS DE SUBORDINATION' : undefined}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
