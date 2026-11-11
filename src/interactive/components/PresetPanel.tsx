import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { listLocalPresets, saveLocalPreset, deleteLocalPreset, presetOptions, type LocalPreset, type PresetInput } from '../presets'
import { CONVERSION_VERSION } from '../domain/seeds'
import { positionOf, type PlanOptions } from '../domain/plan-options'
import type { Game, PlayMode } from '../domain/types'
import type { TimerSettings } from '../domain/settings'

export function PresetPanel({ sourceKey, contentHash, questions, selected, options, timer, mode, onOptions, onApply, activePresetId }: {
  sourceKey: string; contentHash: string; questions: Game['questions']; selected: string[]; options: PlanOptions; timer: TimerSettings; mode: PlayMode
  onOptions: (options: PlanOptions) => void; onApply: (preset: LocalPreset) => void
  activePresetId?: string
}) {
  const [items, setItems] = useState<LocalPreset[]>([])
  const [unavailable, setUnavailable] = useState(0)
  const [chosen, setChosen] = useState(activePresetId ?? '')
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [stale, setStale] = useState<LocalPreset | null>(null)
  const [deleting, setDeleting] = useState<LocalPreset | null>(null)
  const modal = useRef<HTMLDialogElement>(null)
  const modalTitle = useId()
  const refresh = useCallback(async () => { const next = await listLocalPresets(sourceKey); setItems(next.presets); setUnavailable(next.unavailable) }, [sourceKey])
  useEffect(() => { let active = true; void listLocalPresets(sourceKey).then((next) => { if (active) { setItems(next.presets); setUnavailable(next.unavailable); const picked = next.presets.find((entry) => entry.presetId === activePresetId); setName((name) => name || picked?.name || ''); if (activePresetId && !picked) setChosen('') } }, (error: unknown) => { if (active) setMessage(error instanceof Error ? error.message : 'Préréglages indisponibles.') }); return () => { active = false } }, [sourceKey, activePresetId])
  useEffect(() => {
    if (!stale && !deleting) return
    const previous = document.activeElement
    modal.current?.showModal()
    modal.current?.querySelector<HTMLButtonElement>('[data-ci-cancel]')?.focus()
    return () => { if (previous instanceof HTMLElement && previous.isConnected) previous.focus() }
  }, [stale, deleting])
  const input = (entry?: LocalPreset): PresetInput => ({ sourceKey, contentHashAtSave: contentHash, name: entry?.name ?? name.trim(), selectedQuestionIds: entry ? entry.selectedQuestionIds.filter((id) => questions.some((q) => positionOf(q) === id)) : selected,
    options: entry ? { ...presetOptions(entry), customOrder: entry.customOrder.filter((id) => questions.some((q) => positionOf(q) === id)) } : options,
    timer: entry ? { enabled: entry.timer.enabled, seconds: entry.timer.defaultSec, feedbackSeconds: entry.timer.feedbackSec } : timer, playMode: entry?.playMode ?? mode })
  const run = (work: () => Promise<void>) => { setBusy(true); setMessage(''); void work().catch((error: unknown) => setMessage(error instanceof Error ? error.message : 'Action impossible.')).finally(() => setBusy(false)) }
  const current = items.find((entry) => entry.presetId === chosen)
  const save = (copy = false) => run(async () => {
    const next = input()
    if (copy && current && next.name === current.name) next.name = `${next.name.slice(0, 73)} · copie`
    const saved = await saveLocalPreset(next, copy ? undefined : current)
    onApply(saved); setChosen(saved.presetId); setName(saved.name); await refresh(); setMessage('Préréglage enregistré sur cet appareil.')
  })
  const load = () => {
    if (!current) return
    setMessage('')
    if (current.contentHashAtSave !== contentHash || current.conversionVersion !== CONVERSION_VERSION) { setStale(current); return }
    onApply(current); setName(current.name); setMessage('Préréglage chargé.')
  }
  const adapt = (copy: boolean) => {
    if (!stale) return
    run(async () => {
      const next = input(stale)
      if (copy) next.name = `${next.name.slice(0, 73)} · copie`
      const saved = await saveLocalPreset(next, copy ? undefined : stale)
      onApply(saved); setChosen(saved.presetId); setName(saved.name); setStale(null); await refresh(); setMessage('Préréglage adapté à la fiche actuelle.')
    })
  }
  const selectedQuestions = questions.filter((q) => selected.includes(positionOf(q)))
  const ordered = [...new Set([...options.customOrder.filter((key) => selected.includes(key)), ...selectedQuestions.map(positionOf)])]
  const move = (index: number, delta: number) => { const next = [...ordered]; const target = index + delta; if (target < 0 || target >= next.length) return; [next[index], next[target]] = [next[target]!, next[index]!]; onOptions({ ...options, customOrder: next, orderMode: 'custom' }) }
  return <section className="ci-panel ci-no-print ci-presets">
    <h2>Préparer et mémoriser une séance</h2>
    <div className="ci-preset-options"><label>Ordre des questions<select aria-label="Ordre des questions" value={options.orderMode} onChange={(event) => onOptions({ ...options, orderMode: event.target.value as PlanOptions['orderMode'] })}><option value="source">Ordre de la fiche</option><option value="shuffled">Mélanger à chaque partie</option><option value="custom">Ordre personnalisé</option></select></label>
      <label>Nombre maximal de choix<select aria-label="Nombre maximal de choix" value={options.maxChoices} onChange={(event) => onOptions({ ...options, maxChoices: Number(event.target.value) as PlanOptions['maxChoices'] })}>{[2, 3, 4, 5, 6].map((n) => <option value={n} key={n}>{n} choix maximum</option>)}</select></label>
      <label><input type="checkbox" checked={options.numericOrder} onChange={(event) => onOptions({ ...options, numericOrder: event.target.checked })} />Ranger les nombres par ordre croissant</label></div>
    {options.orderMode === 'custom' && <ol className="ci-preset-order">{ordered.map((key, index) => <li key={key}><span>{questions.find((q) => positionOf(q) === key)?.prompt}</span><div><button type="button" aria-label={`Monter la question ${index + 1}`} disabled={index === 0} onClick={() => move(index, -1)}>↑</button><button type="button" aria-label={`Descendre la question ${index + 1}`} disabled={index === ordered.length - 1} onClick={() => move(index, 1)}>↓</button></div></li>)}</ol>}
    <p>{selected.length} question(s) sélectionnée(s) · {mode === 'class' ? 'Classe' : 'Solo'} · {timer.enabled ? `${timer.seconds} s de réflexion` : 'sans minuteur'} · battement de {timer.feedbackSeconds} s.</p>
    <div className="ci-preset-form"><label>Préréglages enregistrés<select aria-label="Préréglages enregistrés" value={chosen} disabled={busy} onChange={(event) => { setChosen(event.target.value); const entry = items.find((item) => item.presetId === event.target.value); setName(entry?.name ?? '') }}><option value="">Nouveau préréglage</option>{items.map((entry) => <option key={entry.presetId} value={entry.presetId}>{entry.name}</option>)}</select></label><button type="button" disabled={busy || !current} onClick={load}>Charger le préréglage</button><button type="button" disabled={busy} onClick={() => run(refresh)}>Actualiser la liste</button>
      <label>Nom du préréglage<input type="text" maxLength={80} value={name} onChange={(event) => setName(event.target.value)} /></label><button type="button" disabled={busy || !name.trim()} onClick={() => save()}>Enregistrer le préréglage</button><button type="button" disabled={busy || !name.trim()} onClick={() => save(true)}>Enregistrer une copie</button><button type="button" disabled={busy || !current} onClick={() => { if (current) { setMessage(''); setDeleting(current) } }}>Supprimer le préréglage</button></div>
    <p>Couleurs et mascotte : réglages de cet appareil.</p>
    {message && !stale && !deleting && <p role="status">{message}</p>}{unavailable > 0 && <p role="status">{unavailable} préréglage(s) indisponible(s) sont conservés sans modification.</p>}
    {(stale || deleting) && <dialog ref={modal} className="ci-teacher-confirm" aria-labelledby={modalTitle} onCancel={(event) => { event.preventDefault(); if (!busy) { setStale(null); setDeleting(null) } }}>
      <h2 id={modalTitle}>{stale ? 'La fiche a changé' : 'Supprimer ce préréglage ?'}</h2>
      <p>{stale ? `« ${stale.name} » a été enregistré pour une autre version de cette fiche ou du moteur. ${stale.selectedQuestionIds.filter((id) => !questions.some((q) => positionOf(q) === id)).length} question(s) ne sont plus disponibles.` : `« ${deleting?.name} » sera supprimé de cet appareil.`}</p>
      {message && <p role="alert">{message}</p>}
      <div className="ci-toolbar"><button type="button" data-ci-cancel disabled={busy} onClick={() => { setStale(null); setDeleting(null) }}>{stale ? 'Ignorer ce préréglage' : 'Annuler'}</button>{stale ? <><button type="button" disabled={busy} onClick={() => adapt(false)}>Mettre à jour</button><button type="button" disabled={busy} onClick={() => adapt(true)}>Dupliquer et adapter</button></> : <button type="button" disabled={busy} onClick={() => deleting && run(async () => { await deleteLocalPreset(deleting); setDeleting(null); setChosen(''); setName(''); await refresh(); setMessage('Préréglage supprimé.') })}>Confirmer la suppression</button>}</div>
    </dialog>}
  </section>
}
