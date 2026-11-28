import { useMemo, useState } from 'react'
import { logistiqueModules, logistiquePresentationFor, type LogistiqueType } from '@/logistique/catalog'
import { logistiqueModuleCapacities } from '@/logistique/generate'
import { applyLogistiqueStoryChange, initialLogistiqueStory, logistiqueBloomLevels, logistiqueStoryModules, logistiqueStoryVariant,
  logistiqueStorySelectionCompatible, type LogistiqueEvaluation, type LogistiqueStory } from '@/logistique/evaluation'
import type { ExerciseBlock, MathItem, Topic } from '@/math/types'
import { randomSeed } from '@/math/rng'
import { blockPointsTotal, formatPointsLabel } from '@/tpm/test'
import { SelectBox } from './SelectBox'
import { LogistiqueStoryFields } from './LogistiqueStoryFields'

export function LogistiqueEvaluationFields({ type, activeBlock, themes, items, defaultPoints, updatePage }: {
  type: LogistiqueType
  activeBlock: ExerciseBlock
  themes: readonly Pick<Topic, 'id' | 'label'>[]
  items: readonly MathItem[]
  defaultPoints: number
  updatePage: (patch: Partial<ExerciseBlock>) => void
}) {
  const [theme, setTheme] = useState(type.topic)
  const [notice, setNotice] = useState('')
  const modules = useMemo(() => logistiqueModules(type.domain), [type.domain])
  const presentation = logistiquePresentationFor(activeBlock)
  const evaluation: LogistiqueEvaluation = activeBlock.logistiqueEvaluation ?? { mode: 'independantes' }
  const story = evaluation.mode === 'histoire' ? evaluation.story : undefined
  const capacities = useMemo(() =>
    logistiqueModuleCapacities(type, modules.map(({ code }) => code), activeBlock.logistiqueBankRevision, presentation, activeBlock.logistiqueEvaluation),
  [type, modules, activeBlock.logistiqueBankRevision, presentation, activeBlock.logistiqueEvaluation])
  const visible = modules.filter(({ topic }) => topic === theme)
  const selection = activeBlock.logistiqueSelection?.modules ?? [type.module]
  const quantities = activeBlock.logistiqueSelection?.quantities
  const selected = modules.filter(({ code }) => selection.includes(code))
  const cap = selection.reduce((sum, code) => sum + (capacities.get(code) ?? 0), 0)
  const exactCount = quantities && selection.reduce((sum, code) => sum + Math.min(quantities[code]!, capacities.get(code) ?? 0), 0)
  const availableInTheme = visible.filter(({ code }) => (capacities.get(code) ?? 0) > 0).map(({ code }) => code)
  const points = blockPointsTotal(items, activeBlock.pointsPerQuestion ?? defaultPoints)
  const rated = items.filter(({ logistiqueAssessment }) => logistiqueAssessment?.minutes !== undefined)
  const effectiveMinutes = rated.reduce((sum, item) => sum + (item.logistiqueAssessment?.minutes ?? 0), 0)
  const estimatedMinutes = items.length > 0 && rated.length === items.length
    ? Math.ceil((effectiveMinutes + (story ? 2 : 0)) * 1.1) : undefined
  const covered = [...new Set(items.flatMap((item) => {
    const code = item.logistiqueSource?.module ?? item.logistiqueLocalModule
    return code ? [code] : []
  }))].sort()
  const objectives = [...new Set(items.flatMap((item) => item.logistiqueAssessment?.objective ? [item.logistiqueAssessment.objective] : []))]
  const bloom = Object.entries(logistiqueBloomLevels).flatMap(([key, label]) => {
    const questions = items.filter((item) => item.logistiqueAssessment?.bloom === key)
    return questions.length ? [{ label, count: questions.length, points: blockPointsTotal(questions, activeBlock.pointsPerQuestion ?? defaultPoints) }] : []
  })

  function update(codes: string[], allocation?: Record<string, number>) {
    if (story && !logistiqueStorySelectionCompatible(codes, allocation)) {
      setNotice('Choisissez au moins un module de la trame et une question pour chacun des modules retenus.')
      return
    }
    if (activeBlock.libreItems?.some(({ libreLocked }) => libreLocked)) {
      setNotice('Déverrouillez les questions protégées avant de changer la sélection.')
      return
    }
    if (activeBlock.libreItems?.length &&
        !window.confirm('Modifier la sélection remplacera le contenu libre de cette activité. Continuer ?')) return
    setNotice('')
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

  function startStory(codes: string[]) {
    if (type.kind !== 'maths' || !logistiqueStorySelectionCompatible(codes)) return
    if (activeBlock.libreItems?.some(({ libreLocked }) => libreLocked)) {
      setNotice('Déverrouillez les questions protégées avant d’appliquer la trame.')
      return
    }
    const sameStoryQuestions = activeBlock.libreItems?.length === codes.length &&
      codes.every((code) => activeBlock.libreItems!.some((item) =>
        item.logistiqueSource?.revision === 'evaluation-v010' && item.logistiqueSource.module === code))
    if (activeBlock.libreItems?.length && !sameStoryQuestions &&
      !window.confirm('Appliquer cette histoire remplacera les questions actuelles de cette activité. Continuer ?')) return
    setNotice('')
    updatePage({
      logistiqueEvaluation: { ...evaluation, mode: 'histoire', story: evaluation.story ?? initialLogistiqueStory },
      logistiqueSelection: { modules: codes, quantities: Object.fromEntries(codes.map((code) => [code, 1])) },
      logistiqueGapMode: undefined, logistiquePresentation: undefined,
      count: codes.length,
      ...(sameStoryQuestions ? {} : { libreItems: undefined, tcfPageBreakAfter: undefined }),
    })
  }

  function changeStory(next: LogistiqueStory): string | undefined {
    if (!story) return undefined
    const validation = applyLogistiqueStoryChange(story, next, selection, activeBlock.libreItems)
    if (validation.conflict) return validation.conflict
    updatePage({
      logistiqueEvaluation: { ...evaluation, story: next },
      ...(validation.items ? { libreItems: validation.items } : {}),
    })
    return undefined
  }

  return (
    <>
      {type.kind === 'maths' && <SelectBox label="Format de l’évaluation" value={evaluation.mode} onChange={(mode) => {
        if (mode === evaluation.mode) return
        if (mode === 'histoire') {
          if (logistiqueStorySelectionCompatible(selection)) startStory(selection)
          else setNotice('La trame de réception et de préparation utilise les modules 303, 312 et 601.')
        } else {
          setNotice('')
          updatePage({
            logistiqueEvaluation: { ...evaluation, mode: 'independantes' },
            libreItems: activeBlock.libreItems ?? [...items],
            libreInstruction: activeBlock.libreInstruction ?? type.instruction,
          })
        }
      }}>
        <option value="independantes">Questions indépendantes</option>
        <option value="histoire">Histoire suivie</option>
      </SelectBox>}
      {type.kind === 'maths' && !story && !logistiqueStorySelectionCompatible(selection) &&
        <button type="button" className="button small secondary" onClick={() => startStory([...logistiqueStoryModules])}>
          Utiliser la trame de la réception à l’expédition
        </button>}
      {story && <LogistiqueStoryFields story={story} modules={selection} onChange={changeStory} />}
      {story && <button type="button" className="button small secondary" onClick={() => {
        setNotice(changeStory(logistiqueStoryVariant(story, randomSeed())) ?? '')
      }}>Proposer d’autres quantités</button>}
      {notice && <p role="status" className="muted">{notice}</p>}
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
          <button type="button" disabled={!selection.length || Boolean(story)} onClick={() => select([])}>Effacer</button>
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
      <details className="logistique-bank">
        <summary>Bilan de l’activité</summary>
        <p>{items.length} question(s) · {formatPointsLabel(points)}
          {covered.length ? ` · Modules ${covered.join(', ')}` : ''}</p>
        <p>{estimatedMinutes === undefined
          ? `Durée à renseigner pour ${items.length - rated.length} question(s).`
          : `Durée indicative de ${estimatedMinutes} min, lecture commune et marge comprises.`}</p>
        {objectives.length > 0 && <ul>{objectives.map((objective) => <li key={objective}>{objective}</li>)}</ul>}
        {bloom.length > 0 && <ul>{bloom.map((entry) =>
          <li key={entry.label}>{entry.label} · {entry.count} question(s) · {formatPointsLabel(entry.points)}</li>)}</ul>}
        {items.some((item) => !item.logistiqueAssessment?.bloom) && <p className="muted">
          Niveau de Bloom à renseigner pour {items.filter((item) => !item.logistiqueAssessment?.bloom).length} question(s).
        </p>}
        {items.some(({ libreCorrectionPending }) => libreCorrectionPending) && <p role="status">Des corrigés sont à vérifier.</p>}
        <label>
          Total de points visé
          <input type="number" className="pill-input" min={0.5} max={1000} step={0.5} value={evaluation.targetPoints ?? ''}
            onChange={(event) => {
              const targetPoints = event.target.valueAsNumber
              if (!event.target.value || targetPoints > 0 && targetPoints <= 1000 && targetPoints * 2 % 1 === 0) {
                updatePage({ logistiqueEvaluation: { ...evaluation, targetPoints: event.target.value ? targetPoints : undefined } })
              }
            }} />
        </label>
        {evaluation.targetPoints !== undefined && evaluation.targetPoints !== points &&
          <p role="status">Le barème actuel donne {formatPointsLabel(points)} sur {formatPointsLabel(evaluation.targetPoints)} visés.</p>}
        <label>
          Durée visée en minutes
          <input type="number" className="pill-input" min={1} max={480} step={1} value={evaluation.targetMinutes ?? ''}
            onChange={(event) => {
              const targetMinutes = event.target.valueAsNumber
              if (!event.target.value || Number.isInteger(targetMinutes) && targetMinutes >= 1 && targetMinutes <= 480) {
                updatePage({ logistiqueEvaluation: { ...evaluation, targetMinutes: event.target.value ? targetMinutes : undefined } })
              }
            }} />
        </label>
        {evaluation.targetMinutes !== undefined && estimatedMinutes !== undefined && estimatedMinutes > evaluation.targetMinutes &&
          <p role="status">La durée indicative dépasse la cible de {estimatedMinutes - evaluation.targetMinutes} min.</p>}
      </details>
    </>
  )
}
