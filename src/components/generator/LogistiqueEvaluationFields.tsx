import { useMemo, useState } from 'react'
import { logistiqueModules, logistiquePresentationFor, logistiquePresentationLabels, type LogistiqueType } from '@/logistique/catalog'
import { logistiqueModuleCapacities } from '@/logistique/generate'
import { allocateLogistiquePoints, applyLogistiqueStoryChange, initialLogistiqueStory, logistiqueBloomLevels, logistiqueDifficultyLabels, logistiqueDuration,
  logistiqueStoryQuestions, logistiqueStoryTemplates, logistiqueStoryVariant,
  logistiqueStorySelectionCompatible, type LogistiqueEvaluation, type LogistiqueStory } from '@/logistique/evaluation'
import { logistiqueItemPresentation } from '@/logistique/libre'
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
  const pointsPerQuestion = activeBlock.pointsPerQuestion ?? defaultPoints
  const points = blockPointsTotal(items, pointsPerQuestion)
  const pointProposal = items.length && evaluation.targetPoints !== undefined && evaluation.targetPoints !== points
    ? allocateLogistiquePoints(items, evaluation.targetPoints, pointsPerQuestion) : undefined
  const duration = logistiqueDuration(items, evaluation, type.diploma)
  const minutesGap = evaluation.targetMinutes === undefined || !items.length ? 0 : duration.total - evaluation.targetMinutes
  const covered = [...new Set(items.map((item) => item.logistiqueSource?.module ?? item.logistiqueLocalModule ?? type.module))].sort()
  const missingModules = selection.filter((code) => !covered.includes(code))
  const objectives = [...new Set(items.map((item) => item.logistiqueAssessment?.objective?.trim()).filter(Boolean))]
  const missingObjectives = items.filter((item) => !item.logistiqueAssessment?.objective?.trim()).length
  const distributions = [
    { label: 'Formats', group: (item: MathItem) => {
      const key = logistiqueItemPresentation(item)
      return key ? logistiquePresentationLabels[key] : item.calcAnswer !== undefined ? 'Calcul' : 'Réponse ouverte'
    } },
    { label: 'Difficulté', group: ({ logistiqueAssessment }: MathItem) =>
      logistiqueAssessment?.difficulty ? logistiqueDifficultyLabels[logistiqueAssessment.difficulty] : 'À renseigner' },
    { label: 'Niveau de Bloom', group: ({ logistiqueAssessment }: MathItem) =>
      logistiqueAssessment?.bloom ? logistiqueBloomLevels[logistiqueAssessment.bloom] : 'À renseigner' },
  ].map(({ label, group }) => {
    const byLabel = new Map<string, MathItem[]>()
    for (const item of items) {
      const key = group(item)
      const questions = byLabel.get(key)
      if (questions) questions.push(item)
      else byLabel.set(key, [item])
    }
    return { label, groups: [...byLabel.entries()] }
  })
  const timeFields = [
    { key: 'readingMinutes', label: 'Lecture des supports et consignes en minutes', estimate: duration.reading },
    { key: 'reviewMinutes', label: 'Marge de relecture en minutes', estimate: duration.review },
  ] as const

  function update(codes: string[], allocation?: Record<string, number>) {
    const requested = story ? Object.fromEntries(codes.map((code) => [code, 1])) : allocation
    if (story && !logistiqueStorySelectionCompatible(codes, requested, story)) {
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
      logistiqueSelection: { modules: codes, quantities: requested },
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

  function startStory(codes: string[], initial = evaluation.story ?? initialLogistiqueStory) {
    if (type.kind !== 'maths' || !logistiqueStorySelectionCompatible(codes, undefined, initial)) return
    if (activeBlock.libreItems?.some(({ libreLocked }) => libreLocked)) {
      setNotice('Déverrouillez les questions protégées avant d’appliquer la trame.')
      return
    }
    const switching = (evaluation.story?.template ?? 'reception') !== (initial.template ?? 'reception')
    if (switching && (evaluation.story?.introductionLocked || Object.values(evaluation.story?.passages ?? {}).some(({ locked }) => locked))) {
      setNotice('Déverrouillez l’introduction et les transitions protégées avant de changer de trame.')
      return
    }
    const nextStory = switching ? initial : evaluation.story ?? initial
    const questions = logistiqueStoryQuestions(nextStory, codes)
    const sameStoryQuestions = activeBlock.libreItems?.length === questions.length && questions.every((question) =>
      activeBlock.libreItems!.some((item) => item.logistiqueSource?.id === question.logistiqueSource?.id))
    if (activeBlock.libreItems?.length && !sameStoryQuestions &&
      !window.confirm('Appliquer cette histoire remplacera les questions actuelles de cette activité. Continuer ?')) return
    setNotice('')
    updatePage({
      logistiqueEvaluation: { ...evaluation, mode: 'histoire', story: nextStory },
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
          const available = Object.values(logistiqueStoryTemplates).find(({ initial }) =>
            logistiqueStorySelectionCompatible(selection, undefined, initial) && initial.template === evaluation.story?.template)
            ?? Object.values(logistiqueStoryTemplates).find(({ initial }) => logistiqueStorySelectionCompatible(selection, undefined, initial))
          if (available) startStory(selection, available.initial)
          else setNotice('Choisissez ci-dessous une trame qui propose les modules liés.')
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
      {type.kind === 'maths' && !story && Object.entries(logistiqueStoryTemplates).map(([id, template]) => (
        <button key={id} type="button" className="button small secondary"
          onClick={() => startStory([...template.modules], template.initial)}>
          Utiliser la trame {template.label.toLocaleLowerCase('fr')}
        </button>
      ))}
      {story && <SelectBox label="Trame de l’évaluation" value={story.template ?? 'reception'} onChange={(value) => {
        if (value === (story.template ?? 'reception')) return
        const template = logistiqueStoryTemplates[value === 'inventaire' ? 'inventaire' : 'reception']
        startStory([...template.modules], template.initial)
      }}>
        {Object.entries(logistiqueStoryTemplates).map(([id, { label }]) => <option key={id} value={id}>{label}</option>)}
      </SelectBox>}
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
            {!story && <div className="mode-toggle is-2" role="group" aria-label="Répartition des questions">
              <button type="button" aria-pressed={!quantities} className={!quantities ? 'active' : ''}
                onClick={() => quantities && update(selection)}>Total</button>
              <button type="button" aria-pressed={Boolean(quantities)} className={quantities ? 'active' : ''}
                onClick={() => quantities || update(selection, Object.fromEntries(selection.map((code) => [code, 1])))}>
                Par module
              </button>
            </div>}
            <ul className="logistique-selection-list" aria-label="Modules retenus">
              {selected.map(({ code, label }) => {
                const available = capacities.get(code) ?? 0
                return (
                  <li key={code}>
                    <span>{label}</span>
                    {quantities && !story && <input className="pill-input" type="number" min={1} max={available}
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
        {items.length > 0 && <p>Durée indicative de {duration.total} min, lecture et relecture comprises.</p>}
        {items.length > 0 && missingModules.length > 0 && <p className="muted">Modules retenus sans question dans le tirage actuel · {missingModules.join(', ')}.</p>}
        {objectives.length > 0 && <ul aria-label="Objectifs couverts">{objectives.map((objective) => <li key={objective}>{objective}</li>)}</ul>}
        {missingObjectives > 0 && <p className="muted">Objectif à renseigner pour {missingObjectives} question(s).</p>}
        {distributions.map(({ label, groups }) => groups.length > 0 && <div key={label}>
          <b>{label}</b>
          <ul aria-label={label}>{groups.map(([key, questions]) => <li key={key}>
            {key} · {questions.length} question(s) · {formatPointsLabel(blockPointsTotal(questions, pointsPerQuestion))}
          </li>)}</ul>
        </div>)}
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
        {pointProposal && ('conflict' in pointProposal ? <p role="status">{pointProposal.conflict}</p> :
          <button type="button" className="button small secondary" onClick={() => updatePage({ libreItems: pointProposal.items })}>
            Répartir les points modifiables
          </button>)}
        {timeFields.map(({ key, label, estimate }) => <label key={key}>
          {label}
          <input type="number" className="pill-input" min={0} max={120} step={0.5} value={evaluation[key] ?? ''}
            placeholder={String(estimate)} onChange={(event) => {
              const minutes = event.target.valueAsNumber
              if (!event.target.value || Number.isInteger(minutes * 2) && minutes >= 0 && minutes <= 120) {
                updatePage({ logistiqueEvaluation: { ...evaluation, [key]: event.target.value ? minutes : undefined } })
              }
            }} />
        </label>)}
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
        {minutesGap !== 0 && <p role="status">{minutesGap > 0
          ? `La durée indicative dépasse la cible de ${minutesGap} min.` : `Il reste ${-minutesGap} min dans la durée visée.`}</p>}
      </details>
    </>
  )
}
