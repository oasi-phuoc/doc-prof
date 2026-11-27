import { useMemo, useState } from 'react'
import { logistiqueModules, type LogistiqueType } from '@/logistique/catalog'
import { logistiqueModuleCapacities } from '@/logistique/generate'
import type { ExerciseBlock, Topic } from '@/math/types'
import { SelectBox } from './SelectBox'

export function LogistiqueEvaluationFields({ type, activeBlock, themes, updatePage }: {
  type: LogistiqueType
  activeBlock: ExerciseBlock
  themes: readonly Pick<Topic, 'id' | 'label'>[]
  updatePage: (patch: Partial<ExerciseBlock>) => void
}) {
  const [theme, setTheme] = useState(type.topic)
  const modules = useMemo(() => logistiqueModules(type.domain), [type.domain])
  const capacities = useMemo(() =>
    logistiqueModuleCapacities(type, modules.map(({ code }) => code), activeBlock.logistiqueBankRevision, activeBlock.logistiqueGapMode),
  [type, modules, activeBlock.logistiqueBankRevision, activeBlock.logistiqueGapMode])
  const visible = modules.filter(({ topic }) => topic === theme)
  const selection = activeBlock.logistiqueSelection?.modules ?? [type.module]
  const quantities = activeBlock.logistiqueSelection?.quantities
  const selected = modules.filter(({ code }) => selection.includes(code))
  const cap = selection.reduce((sum, code) => sum + (capacities.get(code) ?? 0), 0)
  const exactCount = quantities && selection.reduce((sum, code) => sum + Math.min(quantities[code]!, capacities.get(code) ?? 0), 0)
  const availableInTheme = visible.filter(({ code }) => (capacities.get(code) ?? 0) > 0).map(({ code }) => code)

  function update(codes: string[], allocation?: Record<string, number>) {
    if (activeBlock.libreItems?.length &&
        !window.confirm('Modifier la sélection remplacera le contenu libre de cette activité. Continuer ?')) return
    updatePage({
      logistiqueSelection: { modules: codes, quantities: allocation },
      libreItems: undefined,
      tcfPageBreakAfter: undefined,
    })
  }

  function select(codes: string[]) {
    update(codes, quantities && Object.fromEntries(codes.map((code) => [code, quantities[code] ?? 1])))
  }

  function toggle(code: string) {
    select(selection.includes(code) ? selection.filter((entry) => entry !== code) : [...selection, code])
  }

  return (
    <>
      <SelectBox label="Thème" value={theme} onChange={setTheme}>
        {themes.map(({ id, label }) => <option key={id} value={id}>{label}</option>)}
      </SelectBox>
      <SelectBox label="Sous-thème" multipleValues={selection} onChange={toggle}>
        {visible.map(({ code, label }) => (
          <option key={code} value={code} disabled={!selection.includes(code) && !capacities.get(code)}>
            {label}
          </option>
        ))}
      </SelectBox>
      <div className="mode-toggle-block">
        <div className="mode-toggle is-2">
          <button type="button" disabled={availableInTheme.every((code) => selection.includes(code))}
            onClick={() => select([...new Set([...selection, ...availableInTheme])])}>Tout le thème</button>
          <button type="button" disabled={!selection.length} onClick={() => select([])}>Effacer</button>
        </div>
        {selection.length ? (
          <>
            <div className="mode-toggle is-2" role="group" aria-label="Répartition des questions">
              <button type="button" aria-pressed={!quantities} className={!quantities ? 'active' : ''}
                onClick={() => quantities && update(selection)}>Total</button>
              <button type="button" aria-pressed={Boolean(quantities)} className={quantities ? 'active' : ''}
                onClick={() => quantities || update(selection, Object.fromEntries(selection.map((code) => [code, 1])))}>
                Par module
              </button>
            </div>
            <ul className="logistique-selection-list" aria-label="Modules retenus">
              {selected.map(({ code, label }) => {
                const available = capacities.get(code) ?? 0
                return (
                  <li key={code}>
                    <span>{label}</span>
                    {quantities && <input className="pill-input" type="number" min={1} max={available}
                      disabled={!available} aria-label={`Nombre de questions du module ${code}`}
                      value={quantities[code]} onChange={(event) => {
                        const quantity = Math.min(available, Math.max(1, Math.floor(Number(event.target.value) || 1)))
                        if (quantity !== quantities[code]) update(selection, { ...quantities, [code]: quantity })
                      }} />}
                    <button type="button" className="button small secondary"
                      aria-label={`Retirer le module ${code}`} onClick={() => toggle(code)}>×</button>
                    {quantities && quantities[code]! > available &&
                      <small className="muted">{available} questions disponibles dans le module.</small>}
                  </li>
                )
              })}
            </ul>
            <small className="muted" role="status">
              {cap} questions disponibles{exactCount === undefined ? '' : ` · ${exactCount} retenues`}
            </small>
          </>
        ) : <small className="muted" role="status">Sélectionnez au moins un sous-thème.</small>}
      </div>
    </>
  )
}
