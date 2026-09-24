import {
  CHART_CONJ_COORD,
  CHART_CONJ_SUB,
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
  words,
}: {
  category: keyof typeof PHRASE_COLORS
  mode: ChartMode
  className?: string
  label?: string
  words?: string
}) {
  const color = PHRASE_COLORS[category]
  const text =
    mode === 'outline'
      ? ''
      : mode === 'words'
        ? (words ?? CHART_WORD_SAMPLES[category])
        : (label ?? PHRASE_CATEGORY_LABELS[category].toUpperCase())
  return (
    <div
      className={`gattegno-cell ${className}${mode === 'words' ? ' is-words' : ''}${mode === 'outline' ? ' is-outline' : ''}`}
      style={{ borderColor: color }}
    >
      {text ? <span>{text}</span> : <span className="gattegno-empty">&nbsp;</span>}
    </div>
  )
}

/** Tableau Gattegno — grammaire en couleur (structure pédagogique). */
export function GattegnoChart({ mode = 'labels' }: { mode?: ChartMode }) {
  return (
    <div className={`gattegno-chart mode-${mode}`} aria-label="Tableau grammaire en couleur">
      <div className="gattegno-grid">
        <Cell category="pronom" mode={mode} className="gattegno-pronoms" />
        <Cell category="adverbe" mode={mode} className="gattegno-adverbes" />
        <Cell
          category="interjection"
          mode={mode}
          className="gattegno-interjections"
          label="INTERJECTIONS"
        />
        <Cell category="nom" mode={mode} className="gattegno-noms" />
        <Cell category="adjectif" mode={mode} className="gattegno-adjectifs" />
        <Cell category="verbe" mode={mode} className="gattegno-verbes" />
        <Cell category="determinant" mode={mode} className="gattegno-determinants" />
        <div className="gattegno-junction" aria-hidden />
        <Cell category="preposition" mode={mode} className="gattegno-prepositions" />
        <Cell
          category="conjonction"
          mode={mode}
          className="gattegno-conj gattegno-conj-coord"
          label="CONJONCTIONS DE COORDINATION"
          words={CHART_CONJ_COORD}
        />
        <Cell
          category="conjonction"
          mode={mode}
          className="gattegno-conj gattegno-conj-sub"
          label="CONJONCTIONS DE SUBORDINATION"
          words={CHART_CONJ_SUB}
        />
      </div>
    </div>
  )
}
