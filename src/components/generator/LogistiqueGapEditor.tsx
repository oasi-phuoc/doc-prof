import { useId, useState } from 'react'
import type { LogistiqueGaps, MathItem } from '@/math/types'
import { editLogistiqueGaps, logistiqueGapDistractors, type LogistiqueGapDraft } from '@/logistique/gaps'

export function LogistiqueGapEditor({ prompt, gaps, onChange }: {
  prompt: string
  gaps: LogistiqueGaps
  onChange: (patch: Partial<MathItem>) => void
}) {
  const id = useId()
  const [draft, setDraft] = useState<{ value: LogistiqueGapDraft; basis: LogistiqueGaps; error?: string }>()
  const local = draft?.basis === gaps ? draft : undefined
  const value = local?.value ?? {
    prompt,
    answers: gaps.answers.join('\n'),
    distractors: logistiqueGapDistractors(gaps).join('\n'),
    showWords: Boolean(gaps.words),
  }

  function update(change: Partial<LogistiqueGapDraft>) {
    const next = { ...value, ...change }
    const result = editLogistiqueGaps(next, gaps)
    if ('error' in result) {
      setDraft({ value: next, basis: gaps, error: result.error })
      return
    }
    setDraft({ value: next, basis: result.patch.logistiqueGaps })
    onChange(result.patch)
  }

  return (
    <div className="logistique-gap-editor">
      <label className="libre-field is-line">
        <span id={`${id}-prompt`}>Texte à trous</span>
        <textarea aria-labelledby={`${id}-prompt`} className="libre-line-input is-textarea" rows={3} value={value.prompt}
          onChange={(event) => update({ prompt: event.target.value })} />
      </label>
      <small className="muted">Écrivez ___ à l’emplacement de chaque blanc.</small>
      <label className="libre-field is-line">
        <span id={`${id}-answers`}>Réponses, une par ligne dans l’ordre des blancs</span>
        <textarea aria-labelledby={`${id}-answers`} className="libre-line-input is-textarea" rows={3} value={value.answers}
          onChange={(event) => update({ answers: event.target.value })} />
      </label>
      <label className="logistique-bank-question">
        <input type="checkbox" checked={value.showWords} onChange={(event) => update({ showWords: event.target.checked })} />
        <span>Afficher la liste de mots</span>
      </label>
      {value.showWords && (
        <label className="libre-field is-line">
          <span id={`${id}-distractors`}>Mots supplémentaires, un par ligne</span>
          <textarea aria-labelledby={`${id}-distractors`} className="libre-line-input is-textarea" rows={2} value={value.distractors}
            onChange={(event) => update({ distractors: event.target.value })} />
        </label>
      )}
      {local?.error && <small role="status" className="access-error">{local.error} La fiche conserve la dernière version valide.</small>}
    </div>
  )
}
