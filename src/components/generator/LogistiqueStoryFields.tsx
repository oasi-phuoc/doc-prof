import { useState } from 'react'
import { logistiqueStoryIntro, logistiqueStoryModules, validLogistiqueStory, type LogistiqueStory } from '@/logistique/evaluation'

const quantities = [
  ['expected', 'Quantité annoncée'],
  ['received', 'Quantité reçue'],
  ['held', 'Quantité bloquée'],
  ['ordered', 'Quantité demandée par le client'],
] as const

export function LogistiqueStoryFields({ story, modules, onChange }: {
  story: LogistiqueStory
  modules: readonly string[]
  onChange: (story: LogistiqueStory) => string | undefined
}) {
  const [draft, setDraft] = useState<{ basis: LogistiqueStory; value: LogistiqueStory; error: string }>()
  const local = draft?.basis === story ? draft : undefined
  const value = local?.value ?? story

  function update(patch: Partial<LogistiqueStory>) {
    const next = { ...value, ...patch }
    const error = !validLogistiqueStory(next)
      ? 'Renseignez l’entreprise et la marchandise. Les quantités doivent être des entiers positifs ou nuls et la quantité bloquée doit tenir dans la réception.'
      : onChange(next)
    setDraft(error ? { basis: story, value: next, error } : undefined)
  }

  return (
    <details className="logistique-bank">
      <summary>Données et passages de l’histoire</summary>
      <label>
        Entreprise de la trame
        <input className="pill-input" value={value.company} maxLength={70}
          onChange={(event) => update({ company: event.target.value })} />
      </label>
      <label>
        Marchandise suivie
        <input className="pill-input" value={value.article} maxLength={70}
          onChange={(event) => update({ article: event.target.value })} />
      </label>
      {quantities.map(([key, label]) => <label key={key}>
        {label}
        <input className="pill-input" type="number" min={0} max={1_000_000} step={1}
          value={Number.isNaN(value[key]) ? '' : value[key]}
          onChange={(event) => update({ [key]: event.target.valueAsNumber })} />
      </label>)}
      {local && <button type="button" className="button small secondary" onClick={() => setDraft(undefined)}>
        Reprendre les dernières données valides
      </button>}
      <label>
        Introduction de l’histoire
        <textarea className="libre-line-input is-textarea" rows={3} maxLength={500}
          value={value.introduction ?? ''} placeholder={logistiqueStoryIntro({ ...story, introduction: undefined })}
          onChange={(event) => update({ introduction: event.target.value })} />
      </label>
      <label className="logistique-bank-question">
        <input type="checkbox" checked={Boolean(value.introductionLocked)}
          onChange={(event) => update({ introductionLocked: event.target.checked })} />
        Protéger l’introduction
      </label>
      {logistiqueStoryModules.filter((code) => modules.includes(code)).map((code) => {
        const passage = value.passages?.[code]
        function updatePassage(patch: { text?: string; locked?: boolean }) {
          update({ passages: { ...value.passages, [code]: { text: passage?.text ?? '', locked: passage?.locked, ...patch } } })
        }
        return <details key={code}>
          <summary>Passage du module {code}</summary>
          <label>
            Transition du module {code}
            <textarea className="libre-line-input is-textarea" rows={2} maxLength={500}
              placeholder="Transition automatique"
              value={passage?.text ?? ''} onChange={(event) => updatePassage({ text: event.target.value })} />
          </label>
          <label className="logistique-bank-question">
            <input type="checkbox" checked={Boolean(passage?.locked)}
              onChange={(event) => updatePassage({ locked: event.target.checked })} />
            Protéger la transition du module {code}
          </label>
        </details>
      })}
      {local && <p role="alert" className="access-error">{local.error}</p>}
    </details>
  )
}
