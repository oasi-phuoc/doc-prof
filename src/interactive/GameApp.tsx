import { lazy, Suspense, useCallback, useEffect, useMemo, useState, type CSSProperties } from 'react'
import { listFiches } from '@/fiches/api'
import { LoadingScreen } from '@/components/LoadingScreen'
import { domainsForAccount, readAccessAccount } from '@/access'
import type { MascotKind } from './domain/mascot'
import type { Game, PlayMode } from './domain/types'
import { createGameSource, loadGameSource, renewGameSource, saveGameRun, questionSourceKey, type GameSource } from './game-run'
import { runById } from './local-runs'
import { deriveSeed } from './domain/seeds'
import { canonicalJson, hash } from './domain/seeds'
import { applyPlanOptions, readPlanOptions, type PlanOptions } from './domain/plan-options'
import { PresetPanel } from './components/PresetPanel'
import { SessionArchive } from './components/SessionArchive'
import { presetOptions, type LocalPreset } from './presets'
import { PLAN_CHANGED } from './domain/persistence'
import { convertRecipe } from './domain/convert'
import { excludeQuestions, prepareGame } from './domain/plan'
import { useMediaPreflight } from './media/useMediaPreflight'
import type { ToolbarGuard } from './domain/teacher'
import { patchClassroomPreferences, type ClassroomPreferences } from './preferences'
import { MediaCheck } from './components/MediaCheck'
import {
  PALETTE,
  inkForColor,
  type ShapeId,
} from './domain/palette'
import { demoRecipe } from './demo'
import { readDraftWarning, readInteractiveDraft } from './navigation'
import { loadLocalDraft, localDraftId } from './drafts'
import { SessionView } from './SessionView'
import { loadSession, deleteSession, type Resume } from './domain/persistence'
import { acquireSessionLease } from './session-lease'
import { PrintCards } from './components/PrintCards'
import { TeacherSheet } from './components/TeacherSheet'
import { PaletteSettings } from './components/PaletteSettings'
import { CardBadge } from './components/CardBadge'
import { ClassroomHeader } from './components/ClassroomHeader'
import {
  validSeconds,
  type TimerSettings,
} from './domain/settings'
import { MODE_KEY } from './legacy-preferences'
import { hasLocalCompetition } from './competition/storage-key'
import { useReadabilityPreflight } from './layout/useReadabilityPreflight'
import { ReadabilityCheck } from './components/ReadabilityCheck'


type Source = GameSource
const CompetitionSetup = lazy(() => import('./competition/CompetitionPage').then((module) => ({ default: module.CompetitionSetup })))
function savedIdFromPath(): string | null {
  if (window.location.pathname === '/interactif') return null
  try {
    return (
      decodeURIComponent(
        window.location.pathname.slice('/interactif/'.length),
      ) || null
    )
  } catch {
    return null
  }
}
function returnToFiches() {
  window.history.pushState({}, '', '/fiches')
  window.dispatchEvent(new PopStateEvent('popstate'))
}

async function deletePreparedSession(game: Game, mode: PlayMode): Promise<void> {
  let mutation = Promise.resolve()
  const controller = new AbortController()
  const lease = await acquireSessionLease(game.id, { signal: controller.signal, onYield: () => mutation })
  if (lease.status !== 'owned') {
    await lease.release()
    throw new Error('La sauvegarde ne peut pas être effacée pendant que cette partie est ouverte dans un autre onglet, ou sans protection entre onglets.')
  }
  try {
    mutation = (async () => { const latest = await loadSession(game, mode); await deleteSession(game, latest?.record) })()
    await mutation
  } finally { await lease.release(); controller.abort() }
}

export default function GameApp({ initialPreferences, initialWarning }: { initialPreferences: ClassroomPreferences; initialWarning: string }) {
  const draftId = localDraftId()
  const savedId = savedIdFromPath()
  const demo = window.location.pathname === '/interactif/demo'
  const requestedSession = new URLSearchParams(window.location.search).get('s')
  const [source, setSource] = useState<Source | null>(() => {
    if (demo || draftId !== null || savedId) return null
    const value = readInteractiveDraft()
    return value ? createGameSource(value, 'draft') : null
  })
  const [error, setError] = useState(() =>
    !source && !demo && !savedId && draftId === null
      ? 'Ouvrez une fiche puis choisissez « Jouer avec la classe ».'
      : '',
  )
  const [loading, setLoading] = useState(!source && (demo || !!savedId || draftId !== null))
  const [draftWarning] = useState(readDraftWarning)
  const [colors, setColors] = useState(initialPreferences.colors)
  const [shapes, setShapes] = useState(initialPreferences.shapes)
  const [paletteVersion, setPaletteVersion] = useState(initialPreferences.paletteVersion ?? 1)
  const [timer, setTimer] = useState(initialPreferences.timer)
  const [showTranscripts, setShowTranscripts] = useState(initialPreferences.showTranscripts ?? true)
  const [contrast, setContrast] = useState(initialPreferences.contrast)
  const [mascot, setMascot] = useState<MascotKind>(initialPreferences.mascot)
  const [preferencesWarning, setPreferencesWarning] = useState(initialWarning)
  const [mode, setMode] = useState<PlayMode>(() => {
    try { return sessionStorage.getItem(MODE_KEY) === 'solo' ? 'solo' : 'class' } catch { return 'class' }
  })
  const [playing, setPlaying] = useState(false)
  const [competitionOpen, setCompetitionOpen] = useState(false)
  const [toolbarGuard, setToolbarGuard] = useState<ToolbarGuard>(initialPreferences.toolbarGuard)
  const [selection, setSelected] = useState<string[] | null>(() => source?.selectedKeys ?? null)
  const [selectionModified, setSelectionModified] = useState(false)
  const [pendingStart, setPendingStart] = useState(() => !!requestedSession && window.history.state?.clairfleOpenSession === requestedSession)
  useEffect(() => { if (source) saveGameRun(source, selection) }, [source, selection])
  const [excludeUnavailable, setExcludeUnavailable] = useState(true)
  const [fullscreen, setFullscreen] = useState(false)
  useEffect(() => {
    const changed = () => setFullscreen(!!document.fullscreenElement)
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape' && !document.fullscreenElement) setFullscreen(false) }
    document.addEventListener('fullscreenchange', changed)
    document.addEventListener('keydown', escape)
    return () => { document.removeEventListener('fullscreenchange', changed); document.removeEventListener('keydown', escape) }
  }, [])
  const [teacherSheetExport, setTeacherSheetExport] = useState('')
  useEffect(() => {
    if (source) return
    if (!demo && !savedId && draftId === null) return
    let active = true
    const load = async () => {
      const kind = demo ? 'demo' : draftId !== null ? 'draft' : 'saved'
      const id = demo ? 'demo' : draftId ?? savedId!
      const fiche = kind === 'saved' ? (await listFiches()).find((f) => f.id === id) : undefined
      if (kind === 'saved' && !fiche) throw new Error('Cette fiche est introuvable ou inaccessible pour votre compte.')
      const value = demo ? { recipe: demoRecipe(), name: 'Les cartes de la classe' } : kind === 'draft' ? await loadLocalDraft(id) : { recipe: fiche!.recipe, name: fiche!.name }
      if (!requestedSession) return loadGameSource(value, kind, id)
      const run = await runById(requestedSession)
      const next = createGameSource(value, kind, id)
      if (!run) return { ...next, storageWarning: 'Cette sauvegarde est introuvable ou expirée. Vous pouvez commencer une nouvelle partie.' }
      if (run.source.reference.kind !== kind || run.source.reference.id !== id) throw new Error('Cette séance appartient à une autre fiche. Ouvrez son adresse d’origine.')
      return { ...next, recipe: { ...next.recipe, seed: run.source.seed }, selectedKeys: run.source.selectedKeys, replay: run.source.replay, options: readPlanOptions(run.source.options), presetId: run.source.presetId, resolvedKeys: run.source.resolvedKeys, restoredMode: run.mode, restoredTimer: run.source.timer, sessionId: run.sessionId, restoredGameId: run.gameId }
    }
    void load()
      .then((next) => {
        if (!active) return
        setSource(next)
        setSelected(next.selectedKeys)
        if (next.restoredMode) { setMode(next.restoredMode); try { sessionStorage.setItem(MODE_KEY, next.restoredMode) } catch { /* Optional cache. */ } }
        if (next.restoredTimer) setTimer(next.restoredTimer)
      })
      .catch((e) => {
        if (active)
          setError(
            e instanceof Error ? e.message : 'La fiche est indisponible.',
          )
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [source, draftId, savedId, demo, requestedSession])
  const allowed = new Set(domainsForAccount(readAccessAccount()))
  const forbidden = source?.recipe.pages.some(
    (page) => !allowed.has(page.domain),
  )
  const game = useMemo(
    () => {
      if (!source || forbidden) return null
      const converted = convertRecipe(source.recipe, source.name)
      const replayed = source.replay ? { ...converted, id: `${converted.id}-replay-${source.replay}`, seed: deriveSeed({ originalSeed: source.recipe.seed, sourceKey: source.sourceKey, purpose: 'replay', attempt: source.replay }) } : converted
      return applyPlanOptions(replayed, source.options)
    },
    [source, forbidden],
  )
  const selectedSources = useMemo(() => selection ?? game?.questions.map(questionSourceKey) ?? [], [selection, game])
  const selected = useMemo(() => game?.questions.filter((question) => selectedSources.includes(questionSourceKey(question))).map((question) => question.id) ?? [], [selectedSources, game])
  const selectedGame = useMemo(
    () => (game ? prepareGame(game, selected, mode) : null),
    [game, selected, mode],
  )
  const media = useMediaPreflight(selectedGame, !playing)
  const activeGame = useMemo(() => {
    if (!selectedGame) return null
    if (source?.resolvedKeys && !selectionModified) return excludeQuestions(selectedGame, new Set(selectedGame.questions.filter((q) => !source.resolvedKeys!.includes(questionSourceKey(q))).map((q) => q.id)))
    return excludeUnavailable ? excludeQuestions(selectedGame, media.excluded) : selectedGame
  }, [selectedGame, excludeUnavailable, media.excluded, source, selectionModified])
  const readabilityPlan = useMemo(() => activeGame ? { id: activeGame.id, questions: activeGame.questions, rounds: activeGame.rounds } : null, [activeGame])
  const readabilityOptions = useMemo(() => ({ mode, colors, shapes, timer, mascot, contrast }), [mode, colors, shapes, timer, mascot, contrast])
  const readability = useReadabilityPreflight(readabilityPlan, readabilityOptions, !playing && !competitionOpen && media.complete)
  const resumeKey = activeGame?.id ?? ''
  const [resumeResult, setResumeResult] = useState<{ key: string; saved: Resume | null; warning: string } | null>(null)
  const resumeChecked = resumeResult?.key === resumeKey
  const saved = resumeChecked ? resumeResult.saved : null
  const resumeWarning = resumeChecked ? resumeResult.warning : ''
  useEffect(() => {
    let active = true
    if (!activeGame || playing) return
    void loadSession(activeGame, mode, selectionModified ? undefined : requestedSession ?? source?.sessionId).then(
      (value) => { if (active) setResumeResult({ key: resumeKey, saved: value, warning: '' }) },
      (error: unknown) => { if (active) setResumeResult({ key: resumeKey, saved: null, warning: error instanceof Error ? error.message : 'Sauvegarde indisponible.' }) },
    )
    return () => { active = false }
  }, [activeGame, playing, mode, resumeKey, requestedSession, source?.sessionId, selectionModified])
  const clearPreparedSession = () => {
    if (playing) return
    setSelectionModified(true)
    const url = new URL(window.location.href); url.searchParams.delete('s'); window.history.replaceState(window.history.state, '', url)
  }
  const changeSelection = (next: string[] | null) => { clearPreparedSession(); setSelected(next) }
  const changePlanOptions = (options: PlanOptions) => { clearPreparedSession(); setSource((source) => source ? { ...source, options: readPlanOptions(options), presetId: undefined } : source) }
  const applyPreset = (preset: LocalPreset) => {
    clearPreparedSession()
    setSource((source) => source ? { ...source, options: presetOptions(preset), presetId: preset.presetId, sessionId: undefined, restoredGameId: undefined } : source)
    setSelected(preset.selectedQuestionIds)
    setMode(preset.playMode)
    try { sessionStorage.setItem(MODE_KEY, preset.playMode) } catch { /* Optional cache. */ }
    changeTimer({ enabled: preset.timer.enabled, seconds: preset.timer.defaultSec, feedbackSeconds: preset.timer.feedbackSec })
  }
  const canResume = !!saved && !saved.state.finished
  const newPart = (autoStart: boolean) => {
    if (!source) return
    setPlaying(false)
    setSource(renewGameSource(source, selection))
    setSelectionModified(false)
    const url = new URL(window.location.href); url.searchParams.delete('s'); window.history.replaceState(window.history.state, '', url)
    setResumeResult(null)
    setPendingStart(autoStart)
  }
  const sessionReady = useCallback((sessionId: string) => {
    setSelectionModified(false)
    const url = new URL(window.location.href)
    url.searchParams.set('s', sessionId)
    window.history.replaceState(window.history.state, '', url)
  }, [])
  const retryDifficult = (ids: string[]) => {
    if (!source || !activeGame) return
    setPlaying(false)
    setSource({ ...source, replay: source.replay + 1, sessionId: undefined, restoredGameId: undefined, resolvedKeys: undefined })
    setSelected(activeGame.questions.filter((q) => ids.includes(q.id)).map(questionSourceKey))
    const url = new URL(window.location.href); url.searchParams.delete('s'); window.history.replaceState(window.history.state, '', url)
    setResumeResult(null); setPendingStart(true)
  }
  useEffect(() => {
    if (!pendingStart || !activeGame || !media.complete || !resumeChecked || !readability.complete) return
    let active = true
    void Promise.resolve().then(() => {
      if (!active) return
      const requested = window.history.state?.clairfleOpenSession
      if (requested) { const next = { ...window.history.state }; delete next.clairfleOpenSession; window.history.replaceState(next, '', window.location.href) }
      setPendingStart(false)
      if (activeGame.questions.length && (!requested || saved && !resumeWarning)) setPlaying(true)
    })
    return () => { active = false }
  }, [pendingStart, activeGame, media.complete, resumeChecked, saved, resumeWarning, readability.complete])
  const changeColors = (next: string[]) => {
    setColors(next)
    savePreferences({ colors: next })
  }
  const changeShapes = (next: ShapeId[]) => {
    setShapes(next)
    savePreferences({ shapes: next })
  }
  const changeTimer = (next: TimerSettings) => {
    clearPreparedSession()
    setTimer(next)
    savePreferences({ timer: next })
  }
  const savePreferences = (patch: Partial<ClassroomPreferences>) => { void patchClassroomPreferences(patch, initialPreferences).then((next) => setPaletteVersion(next.paletteVersion ?? 1), (error: unknown) => setPreferencesWarning(error instanceof Error ? error.message : 'Réglages non enregistrés.')) }
  const header = {
    onCompetition: activeGame && media.complete && readability.complete ? () => { if (!hasLocalCompetition(activeGame.id)) newPart(false); setCompetitionOpen(true) } : undefined,
    toolbarGuard,
    mascot,
    onMascot: (next: MascotKind) => { setMascot(next); savePreferences({ mascot: next }) },
    mode,
    onMode: (next: PlayMode) => {
      clearPreparedSession()
      setMode(next)
      try { sessionStorage.setItem(MODE_KEY, next) } catch { /* Optional preference. */ }
    },
    fullscreen,
    playing,
    contrast,
    onContrast: () => { setContrast(!contrast); savePreferences({ contrast: !contrast }) },
    onFiches: returnToFiches,
    timer,
    onTimer: changeTimer,
    onFullscreen: () => {
      if (fullscreen) {
        setFullscreen(false)
        if (document.fullscreenElement) void document.exitFullscreen().catch(() => setFullscreen(!!document.fullscreenElement))
      } else {
        setFullscreen(true)
        try { void document.documentElement.requestFullscreen?.().catch(() => { /* Immersive layout remains available without native fullscreen. */ }) }
        catch { /* Native fullscreen is optional in embedded mobile browsers. */ }
      }
    },
  }
  if (competitionOpen && activeGame && !media.complete) return <div className="ci-app"><LoadingScreen title="Préparation de la compétition" description="Vos questions et leurs médias se préparent." /></div>
  if (competitionOpen && activeGame) return <Suspense fallback={<LoadingScreen title="Ouverture de la compétition" />}><CompetitionSetup key={activeGame.id} game={activeGame} timer={timer} colors={colors} shapes={shapes} showTranscripts={showTranscripts} onNewPart={() => newPart(false)} onExit={() => setCompetitionOpen(false)} /></Suspense>
  return (
    <div className={`ci-app${contrast ? ' ci-high-contrast' : ''}${playing ? ' ci-playing' : ''}${fullscreen ? ' ci-immersive' : ''}`} data-mascot={mascot}>
      {preferencesWarning && <p className="ci-notice" role="status">{preferencesWarning} Le jeu reste utilisable.</p>}
      {!playing && <ClassroomHeader {...header} />}
      {loading ? (
        <main className="ci-container">
          <LoadingScreen variant="panel" title="Préparation de la séance" description="Votre activité arrive…" />
        </main>
      ) : error || forbidden ? (
        <main className="ci-container">
          <h1>Préparer une séance</h1>
          <p role="alert">
            {forbidden
              ? 'Votre compte ne permet pas de jouer cette fiche.'
              : error}
          </p>
          <a className="ci-primary" href="/generateur">
            Ouvrir le générateur
          </a>
        </main>
      ) : (
        game &&
        activeGame && (
          <>
            {playing ? (
              <SessionView
                key={activeGame.id}
                game={activeGame}
                colors={colors}
                shapes={shapes}
                timer={timer}
                showTranscripts={showTranscripts}
                onExit={() => setPlaying(false)}
                onFinish={() => newPart(false)}
                onNewPart={() => newPart(true)}
                mediaManager={media.manager}
                header={header}
                source={source?.reference ? { reference: source.reference, sourceKey: source.sourceKey, seed: source.recipe.seed, replay: source.replay, selectedKeys: selectedSources, resolvedKeys: activeGame.questions.map(questionSourceKey), timer, options: source.options, presetId: source.presetId } : undefined}
                onSessionReady={sessionReady}
                onRetryDifficult={retryDifficult}
              />
            ) : (
              <main className="ci-container">
                <div className="ci-intro ci-no-print">
                  <div>
                    <p className="ci-eyebrow">Ensemble, en classe</p>
                    <h1>
                      Une question.
                      <br />
                      Toute la classe participe.
                    </h1>
                    <p className="ci-lead">
                      Chacun réfléchit, puis lève sa carte. Toute la classe participe.
                      Vous gardez la main sur la correction.
                    </p>
                  </div>
                  <div className="ci-mini-cards" aria-hidden="true">
                    {PALETTE.map((card, i) => (
                      <div
                        key={card.letter}
                        style={
                          {
                            '--card-color': colors[i],
                            '--card-ink': inkForColor(colors[i]!),
                          } as CSSProperties
                        }
                      >
                        <CardBadge letter={card.letter} shape={shapes[i]!} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="ci-setup-grid ci-no-print">
                  <section className="ci-panel">
                    <p className="ci-eyebrow">Votre séance</p>
                    <h2>{game.title}</h2>
                    <p>
                      {activeGame.questions.length} question
                      {activeGame.questions.length > 1 ? 's' : ''} retenue
                      {activeGame.questions.length > 1 ? 's' : ''} ·{' '}
                      {activeGame.rounds?.length ?? 0} écran(s) · sans
                      classement
                    </p>
                    <div className="ci-toolbar">
                      <button
                        onClick={() =>
                          changeSelection(null)
                        }
                      >
                        Tout sélectionner
                      </button>
                      <button onClick={() => changeSelection([])}>
                        Tout désélectionner
                      </button>
                    </div>
                    <div className="ci-question-list">
                      {[
                        ...new Set(game.questions.map((q) => q.source.page)),
                      ].map((page) => {
                        const pageQuestions = game.questions.filter(
                          (q) => q.source.page === page,
                        )
                        const ids = pageQuestions.map((q) => q.id)
                        const keys = pageQuestions.map(questionSourceKey)
                        return (
                          <fieldset key={page}>
                            <legend>
                              <label>
                                <input
                                  type="checkbox"
                                  aria-label={`Sélectionner la page ${page + 1}`}
                                  checked={ids.every((id) =>
                                    selected.includes(id),
                                  )}
                                  onChange={(e) =>
                                  changeSelection(
                                      e.target.checked
                                        ? [...new Set([...selectedSources, ...keys])]
                                        : selectedSources.filter(
                                            (key) => !keys.includes(key),
                                          ),
                                    )
                                  }
                                />
                                Page {page + 1}
                              </label>
                            </legend>
                            {pageQuestions.map((q) => (
                              <label key={q.id}>
                                <input
                                  type="checkbox"
                                  checked={selected.includes(q.id)}
                                  onChange={(e) =>
                                    changeSelection(
                                      e.target.checked
                                        ? [...selectedSources, questionSourceKey(q)]
                                        : selectedSources.filter((key) => key !== questionSourceKey(q)),
                                    )
                                  }
                                />
                                <span>
                                  <b>
                                    {game.questions.indexOf(q) + 1}. {q.prompt}
                                  </b>
                                  <small>
                                    {q.mode === 'choice'
                                      ? `${q.choices.length} choix${q.choices.some((c) => c.image) ? ' en images' : ''}`
                                      : 'Évaluation par l’enseignant'}
                                    {q.audio ? ' · audio' : ''}
                                    {selected.includes(q.id) &&
                                    !selectedGame?.questions.some(
                                      (retained) => retained.id === q.id,
                                    )
                                      ? ' · autre question de ce document retenue'
                                      : ''}
                                    {excludeUnavailable &&
                                    media.excluded.has(q.id)
                                      ? ' · média indisponible, question écartée'
                                      : ''}
                                  </small>
                                </span>
                              </label>
                            ))}
                          </fieldset>
                        )
                      })}
                    </div>
                    {!game.questions.length && (
                      <p>
                        Aucune question compatible dans cette fiche. Les
                        éléments à adapter sont indiqués ci-dessous.
                      </p>
                    )}
                    {selectedGame && (
                      <MediaCheck
                        plan={selectedGame}
                        assets={media.assets}
                        results={media.results}
                        complete={media.complete}
                        error={media.error}
                        exclude={excludeUnavailable}
                        excludedCount={
                          selectedGame.questions.length -
                          activeGame.questions.length
                        }
                        onExclude={setExcludeUnavailable}
                        onRetry={media.retry}
                      />
                    )}
                    {media.complete && <ReadabilityCheck questions={activeGame.questions} {...readability} />}
                    {(!media.complete || !readability.complete || !resumeChecked || pendingStart) && <LoadingScreen variant="inline" title={mode === 'solo' ? 'Préparation du mode Solo…' : 'Préparation du mode Classe…'} />}
                    <p className="ci-run-note">Une nouvelle partie renouvelle les tirages du générateur, avec les mêmes types, limites et durées. Les questions saisies manuellement sont conservées ; une reprise garde la partie en cours.</p>
                    {draftWarning && <p role="status">{draftWarning}</p>}
                    {source?.storageWarning && <p role="status">{source.storageWarning}</p>}
                    {resumeWarning && <p role="status">{resumeWarning}</p>}
                    {resumeWarning === PLAN_CHANGED && <button onClick={() => newPart(false)}>Recommencer avec une nouvelle partie</button>}
                    {canResume && saved && <p>Reprendre la séance du {new Date(saved.record.updatedAt).toLocaleString('fr-CH')} (question {saved.state.index + 1} sur {activeGame.rounds?.length ?? activeGame.questions.length}) ?</p>}
                    <button
                      className="ci-primary ci-launch"
                      disabled={!activeGame.questions.length || !media.complete || !resumeChecked || !readability.complete || pendingStart || resumeWarning === PLAN_CHANGED}
                      onClick={() => { if (saved?.state.finished) newPart(true); else setPlaying(true) }}
                    >
                      {pendingStart ? 'Préparation de la nouvelle partie…' : saved?.state.finished ? 'Nouvelle partie' : canResume ? 'Reprendre la séance' : 'Commencer la séance'}{' '}
                      <span aria-hidden="true">→</span>
                    </button>
                    {saved?.state.finished && <button className="ci-fresh-start" onClick={() => setPlaying(true)}>Revoir le bilan</button>}
                    {canResume && (
                      <>
                      <button
                        className="ci-fresh-start"
                        disabled={!media.complete}
                        onClick={() => newPart(true)}
                      >
                        Nouvelle partie
                      </button>
                      <button className="ci-fresh-start" onClick={() => { void deletePreparedSession(activeGame, mode).then(() => setResumeResult({ key: resumeKey, saved: null, warning: '' })).catch((error: unknown) => setResumeResult({ key: resumeKey, saved, warning: error instanceof Error ? error.message : 'Impossible de supprimer la sauvegarde.' })) }}>Supprimer la sauvegarde</button>
                      </>
                    )}
                  </section>
                  <aside className="ci-panel">
                    <h2>{mode === 'class' ? 'Le rituel de la classe' : 'Le parcours solo'}</h2>
                    {mode === 'solo' ? <p>{timer.enabled ? 'Choisis une réponse avant la fin du compte à rebours. Sans réponse, la question est comptée comme fausse.' : 'Le minuteur est désactivé : choisis une réponse à ton rythme.'} La correction s’affiche pendant {timer.feedbackSeconds} seconde(s), puis la question suivante démarre. Les activités ouvertes restent sans note automatique.</p> : <ol className="ci-ritual">
                      <li>Je réfléchis.</li>
                      <li>Au signal, je lève ma carte.</li>

                      <li>Nous discutons de la réponse.</li>
                      <li>L’enseignant révèle la correction.</li>
                    </ol>}
                    <p>
                      Les votes sur cartes ne sont pas captés automatiquement. Un comptage manuel est facultatif. Aucun
                      téléphone élève n’est nécessaire.
                    </p>
                    <div className="ci-setup-timer">
                      <label>
                        <input
                          type="checkbox"
                          checked={timer.enabled}
                          onChange={(e) =>
                            changeTimer({ ...timer, enabled: e.target.checked })
                          }
                        />{' '}
                        Activer le minuteur
                      </label>
                      <label>
                        Temps de réflexion (secondes){' '}
                        <input
                          type="number"
                          min="5"
                          max="600"
                          value={timer.seconds}
                          onChange={(e) =>
                            changeTimer({
                              ...timer,
                              seconds: validSeconds(Number(e.target.value)),
                            })
                          }
                        />
                      </label>
                      <p>
                        {mode === 'solo' ? '30 secondes par défaut, ou sans limite si le minuteur est désactivé. La correction et la suite sont automatiques après le choix.' : '30 secondes par défaut. Avec un document audio, le décompte commence à la fin de l’écoute. Vous choisissez toujours quand continuer.'}
                      </p>
                    </div>
                    {activeGame.questions.some(question => activeGame.corrections[question.id]?.transcript) && <div className="ci-setup-guard"><label><input type="checkbox" checked={showTranscripts} onChange={(event) => {
                      setShowTranscripts(event.target.checked); savePreferences({ showTranscripts: event.target.checked })
                    }} />Proposer la transcription après les réponses</label><p>En Classe et en Solo, le texte de l’écoute devient accessible une fois toutes ses questions corrigées. La lecture suspend le passage automatique à la question suivante.</p></div>}
                    {mode === 'class' && <div className="ci-setup-guard"><label><input type="checkbox" checked={toolbarGuard === 'hold-to-reveal'} onChange={(event) => {
                      const next = event.target.checked ? 'hold-to-reveal' : 'none'
                      setToolbarGuard(next); savePreferences({ toolbarGuard: next })
                    }} />Maintenir le bouton pour révéler</label><p>Un appui de 600 ms évite une correction affichée par erreur. Fonctionne aussi avec Entrée ou Espace.</p></div>}
                  </aside>
                </div>
                {source && <PresetPanel key={source.reference ? `${source.reference.kind}:${source.reference.id}` : source.sourceKey} sourceKey={source.reference ? `${source.reference.kind}:${source.reference.id}` : source.sourceKey} contentHash={String(hash(canonicalJson(source.template)))} questions={game.questions} selected={selectedSources} options={source.options} timer={timer} mode={mode} onOptions={changePlanOptions} onApply={applyPreset} activePresetId={source.presetId} paletteVersion={paletteVersion} />}
                {source?.reference && <SessionArchive reference={source.reference} template={source.template} title={source.name} onOpen={(run) => { const url = new URL(window.location.href); url.searchParams.set('s', run.sessionId); window.history.pushState({ ...window.history.state, clairfleOpenSession: run.sessionId }, '', url); window.dispatchEvent(new PopStateEvent('popstate')) }} onErased={() => { window.history.pushState({}, '', '/generateur'); window.dispatchEvent(new PopStateEvent('popstate')) }} />}
                <section className="ci-panel ci-no-print">
                  <PaletteSettings
                    colors={colors}
                    shapes={shapes}
                    onColors={changeColors}
                    onShapes={changeShapes}
                  />
                </section>
                {!!activeGame.issues.length && (
                  <details className="ci-panel ci-no-print">
                    <summary>
                      {activeGame.issues.length} élément(s) à vérifier avant de
                      jouer
                    </summary>
                    <ul>
                      {activeGame.issues.map((issue, i) => (
                        <li key={i}>
                          <b>{issue.source}</b> : {issue.reason}
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
                <TeacherSheet game={activeGame} colors={colors} shapes={shapes} disabled={!media.complete} lastSignature={teacherSheetExport} onExport={setTeacherSheetExport} />
                <PrintCards colors={colors} shapes={shapes} />
                <p className="ci-no-print"><a href="/interactif/cartes" target="_blank" rel="noreferrer">Comparer les cartes avec cet écran</a> · <a href="/interactif/diagnostic" target="_blank" rel="noreferrer">Diagnostic de l’écran</a></p>
              </main>
            )}
          </>
        )
      )}
    </div>
  )
}
