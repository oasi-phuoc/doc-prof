import { useState } from 'react'
import { logistiqueMatchContent, validLogistiquePairs, type LogistiquePair } from '@/logistique/matching'
import type { MathItem } from '@/math/types'

export function LogistiqueMatchingEditor({ pairs, definitions, onChange }: {
  pairs: LogistiquePair[]
  definitions: string[]
  onChange: (patch: Partial<MathItem>) => void
}) {
  const [draft, setDraft] = useState<{ source: LogistiquePair[]; pairs: LogistiquePair[] }>()
  const values = draft?.source === pairs ? draft.pairs : pairs.length ? pairs : [{ left: '', right: '' }, { left: '', right: '' }]

  function apply(next: LogistiquePair[], previous: LogistiquePair[] = values) {
    if (!validLogistiquePairs(next)) {
      setDraft({ source: pairs, pairs: next })
      return
    }
    setDraft(undefined)
    // Conserve l’ordre imprimé quand un libellé est retouché, en suivant sa paire.
    const changed = new Map(pairs.map(({ right }, i) => [right,
      next[previous.findIndex((pair) => pair.right === right)]?.right ?? next[i]?.right]))
    const requested = definitions.flatMap((right) => {
      const value = changed.get(right)
      return value && next.some((pair) => pair.right === value) ? [value] : []
    })
    const choices = [...new Set([...requested, ...next.map(({ right }) => right)])]
    const ordered = choices.every((right, i) => right === next[i]?.right)
    onChange({ ...logistiqueMatchContent(next, ordered ? [...choices.slice(1), choices[0]!] : choices), libreCorrectionPending: true })
  }

  return <details className="logistique-table-editor">
    <summary>Modifier les associations</summary>
    {values.map((pair, index) => <fieldset key={index}>
      <legend>Paire {index + 1}</legend>
      <label className="libre-field is-line">
        <span>Terme {index + 1}</span>
        <input className="libre-line-input" aria-label={`Terme ${index + 1}`} value={pair.left} maxLength={52}
          onChange={(event) => apply(values.with(index, { ...pair, left: event.target.value }))} />
      </label>
      <label className="libre-field is-line">
        <span>Définition {index + 1}</span>
        <textarea className="libre-line-input is-textarea" aria-label={`Définition ${index + 1}`} rows={2} value={pair.right} maxLength={100}
          onChange={(event) => apply(values.with(index, { ...pair, right: event.target.value }))} />
      </label>
      {values.length > 2 && <button type="button" className="button small secondary" aria-label={`Retirer la paire ${index + 1}`}
        onClick={() => apply(values.toSpliced(index, 1), values.toSpliced(index, 1))}>Retirer cette paire</button>}
    </fieldset>)}
    {values.length < 6 && <button type="button" className="button small secondary"
      onClick={() => apply([...values, { left: '', right: '' }])}>Ajouter une paire</button>}
    {draft?.source === pairs && <small className="access-error" role="status">
      Renseignez des termes et définitions distincts pour appliquer les changements.
    </small>}
  </details>
}
