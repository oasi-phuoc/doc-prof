import { useState } from 'react'
import { TCF_COMPETENCES } from './catalog'
import { tcfBank } from './loader'
import type { TcfCompetence, TcfNiveau } from './types'

/**
 * Générateur de test : compétences + nombre d’exercices par compétence.
 * Tirage sans doublon dans la banque ; la graine reste celle de la fiche.
 */
export function TcfTestPanel({
  niveau,
  onGenerate,
}: {
  niveau: TcfNiveau
  onGenerate: (competences: TcfCompetence[], parCompetence: number) => void
}) {
  const [competences, setCompetences] = useState<TcfCompetence[]>(['CE', 'CO', 'PE', 'PO'])
  const [parCompetence, setParCompetence] = useState(2)

  function toggle(id: TcfCompetence) {
    setCompetences((current) =>
      current.includes(id) ? current.filter((c) => c !== id) : TCF_COMPETENCES.map((c) => c.id).filter((c) => c === id || current.includes(c)),
    )
  }

  return (
    <div className="quad-libre-block tcf-test-panel">
      <b>Composer un test ({niveau})</b>
      <div className="tcf-row is-wrap" role="group" aria-label="Compétences du test">
        {TCF_COMPETENCES.map((c) => (
          <label key={c.id} className="tcf-choix-fixe">
            <input type="checkbox" checked={competences.includes(c.id)} onChange={() => toggle(c.id)} />
            {c.id} ({tcfBank(niveau, c.id).length})
          </label>
        ))}
      </div>
      <label className="tcf-field is-number">
        <span>Exercices par compétence</span>
        <input
          className="pill-input"
          type="number"
          min={1}
          max={10}
          value={parCompetence}
          onChange={(event) => setParCompetence(Math.max(1, Math.min(10, Math.round(Number(event.target.value) || 1))))}
        />
      </label>
      <button
        type="button"
        className="tcf-btn"
        disabled={competences.length === 0}
        onClick={() => onGenerate(competences, parCompetence)}
      >
        Générer le test
      </button>
      <small className="muted">
        Une page par exercice, sans doublon. Remplace les pages actuelles ; le corrigé reprend le même ordre.
      </small>
    </div>
  )
}
