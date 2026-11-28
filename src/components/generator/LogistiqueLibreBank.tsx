import { useMemo, useState } from 'react'
import { logistiqueModules, type LogistiqueType } from '@/logistique/catalog'
import { logistiqueQuestionItems } from '@/logistique/generate'
import { availableLogistiqueQuestions, selectLogistiqueLot } from '@/logistique/libre'
import type { LogistiqueWordingMode } from '@/logistique/wording'
import { randomSeed } from '@/math/rng'
import type { LogistiquePresentation, MathItem } from '@/math/types'
import { LogistiqueTableView } from '@/components/item-view/logistique-table'
import { SelectBox } from './SelectBox'

const PAGE_SIZE = 6

function searchText(value: string) {
  return value.normalize('NFD').replace(/\p{Mark}/gu, '').toLowerCase().trim()
}

export function LogistiqueLibreBank({ type, revision, presentation, wording, items, onAdd, onReroll }: {
  type: LogistiqueType
  revision?: string
  presentation?: LogistiquePresentation
  wording?: LogistiqueWordingMode
  items: readonly MathItem[]
  onAdd: (items: MathItem[]) => void
  onReroll?: () => void
}) {
  const [module, setModule] = useState(type.module)
  const [query, setQuery] = useState('')
  const [checked, setChecked] = useState<string[]>([])
  const [limit, setLimit] = useState(PAGE_SIZE)
  const [quantity, setQuantity] = useState(1)
  const [notice, setNotice] = useState('')
  const modules = useMemo(() => logistiqueModules(type.domain), [type.domain])
  const bank = useMemo(() => logistiqueQuestionItems(type, [module], revision, presentation, wording), [type, module, revision, presentation, wording])
  const available = useMemo(() => availableLogistiqueQuestions(bank, items), [bank, items])
  const selected = available.filter((item) => checked.includes(item.logistiqueSource!.id))
  const label = modules.find(({ code }) => code === module)?.label ?? module
  const words = searchText(query).split(/\s+/).filter(Boolean)
  const matches = available.filter((item) => {
    const searchable = searchText(`${label} ${item.prompt ?? ''}`)
    return words.every((word) => searchable.includes(word))
  })
  const lotSize = Math.max(1, Math.min(quantity, available.length))

  function add(added: MathItem[]) {
    if (!added.length) return
    onAdd(added.map((item) => ({ ...item, logistiqueRetained: true })))
    setChecked([])
    setNotice(added.length === 1 ? '1 question ajoutée.' : `${added.length} questions ajoutées.`)
  }

  return (
    <details className="quad-libre-block logistique-bank">
      <summary>Banque de questions</summary>
      <SelectBox label="Module de la banque" value={module} onChange={(code) => {
        setModule(code)
        setLimit(PAGE_SIZE)
        setChecked([])
        setNotice('')
      }}>
        {modules.map(({ code, label }) => <option key={code} value={code}>{label}</option>)}
      </SelectBox>
      <label className="libre-field is-line">
        <span>Rechercher une question</span>
        <input className="libre-line-input" type="search" value={query} onChange={(event) => {
          setQuery(event.target.value)
          setLimit(PAGE_SIZE)
        }} />
      </label>
      <small className="muted">{matches.length} résultat{matches.length === 1 ? '' : 's'} · {available.length} disponibles dans le module</small>
      {matches.length > 0 && (
        <ul className="libre-item-list" aria-label="Résultats de la banque">
          {matches.slice(0, limit).map((item) => {
            const id = item.logistiqueSource!.id
            return (
              <li key={id} className="libre-item-card">
                <label className="logistique-bank-question">
                  <input type="checkbox" checked={checked.includes(id)} onChange={(event) => {
                    const active = event.target.checked
                    setChecked((current) => active ? [...current, id] : current.filter((value) => value !== id))
                  }} />
                  <span>{item.prompt}</span>
                </label>
                <details>
                  <summary>Corrigé</summary>
                  {item.logistiqueTable && <LogistiqueTableView table={item.logistiqueTable} mode="answers" />}
                  {item.calcAnswer && <p>{item.calcAnswer}</p>}
                  <p>{item.answer}</p>
                </details>
              </li>
            )
          })}
        </ul>
      )}
      {limit < matches.length && <button type="button" className="button small secondary"
        onClick={() => setLimit(limit + PAGE_SIZE)}>Voir plus de questions</button>}
      <button type="button" className="button small secondary" disabled={!selected.length}
        onClick={() => add(selected)}>Ajouter la sélection ({selected.length})</button>
      <div className="logistique-bank-lot">
        <label className="libre-field is-line">
          <span>Quantité du lot</span>
          <input type="number" className="pill-input" min={1} max={Math.max(1, available.length)}
            value={lotSize} onChange={(event) => setQuantity(Math.max(1, Math.floor(Number(event.target.value) || 1)))} />
        </label>
        <button type="button" className="button small secondary" disabled={!available.length}
          onClick={() => add(selectLogistiqueLot(available, lotSize, randomSeed()))}>Ajouter un lot</button>
      </div>
      {onReroll && <button type="button" className="button small secondary" onClick={onReroll}>
        Régénérer les questions tirées
      </button>}
      {notice && <small role="status">{notice}</small>}
    </details>
  )
}
