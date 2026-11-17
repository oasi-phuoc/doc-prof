import {playPrompt} from './domain/presentation'
import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { listFiches } from '@/fiches/api'
import { LoadingScreen } from '@/components/LoadingScreen'
import { domainsForAccount, readAccessAccount } from '@/access'
import { mascotStyle, type MascotKind } from './domain/mascot'
import type { Game, PlayMode } from './domain/types'
import { createGameSource, loadGameSource, renewGameSource, saveGameRun, questionSourceKey, type GameSource } from './game-run'
import { runById } from './local-runs'
import { deriveSeed } from './domain/seeds'
import { canonicalJson, hash } from './domain/seeds'
import { applyPlanOptions, readPlanOptions, type PlanOptions } from './domain/plan-options'
import {sortingSelection} from './domain/word-sorting'
import {memorySelection} from './domain/memory-conversion'
import {lotoSelection} from './domain/loto'
import { presetOptions, type LocalPreset } from './presets'
import { PLAN_CHANGED } from './domain/persistence'
import { convertRecipe } from './domain/convert'
import { excludeQuestions, prepareGame } from './domain/plan'
import { useMediaPreflight } from './media/useMediaPreflight'
import type { ToolbarGuard } from './domain/teacher'
import { patchClassroomPreferences, type ClassroomPreferences } from './preferences'
import { MediaCheck } from './components/MediaCheck'
import { FullPreload } from './components/FullPreload'
import { useFullPreload } from './media/useFullPreload'
import { PreparedMediaContext } from './media/prepared-context'
import {
  type ShapeId,
} from './domain/palette'
import { demoRecipe } from './demo'
import {loadPool} from './pools/storage'
import {poolRecipe,convertPoolRecipe,assertPoolDraw} from './pools/recipe'
// The selector preloads this game entry before validating and opening a pool.
// eslint-disable-next-line react/only-export-components -- This lazy game entry also validates the selector before navigation.
export {checkPoolQuestions} from './pools/recipe'
import {DEFAULT_PLAN_OPTIONS} from './domain/plan-options'
import { readDraftWarning, readInteractiveDraft } from './navigation'
import { loadLocalDraft, localDraftId } from './drafts'
import { SessionView } from './SessionView'
import { loadSession, deleteSession, type Resume } from './domain/persistence'
import { acquireSessionLease } from './session-lease'
import { ClassroomHeader } from './components/ClassroomHeader'
import {
  type TimerSettings,
} from './domain/settings'
import { MODE_KEY } from './legacy-preferences'
import { hasLocalCompetition } from './competition/storage-key'
import { hasDuel } from './duel/storage-key'
import { useReadabilityPreflight } from './layout/useReadabilityPreflight'
import { SetupAction, SetupDialog, SessionSettings } from './components/SetupHub'


const PresetPanel = lazy(() => import('./components/PresetPanel').then(module => ({default: module.PresetPanel})))
const SessionArchive = lazy(() => import('./components/SessionArchive').then(module => ({default: module.SessionArchive})))
const PrintCards = lazy(() => import('./components/PrintCards').then(module => ({default: module.PrintCards})))
const TeacherSheet = lazy(() => import('./components/TeacherSheet').then(module => ({default: module.TeacherSheet})))
const PaletteSettings = lazy(() => import('./components/PaletteSettings').then(module => ({default: module.PaletteSettings})))
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
  const poolId = new URLSearchParams(window.location.search).get('pool')
  const savedId = savedIdFromPath()
  const demo = window.location.pathname === '/interactif/demo'
  const requestedSession = new URLSearchParams(window.location.search).get('s')
  const [source, setSource] = useState<Source | null>(() => {
    if (poolId || demo || draftId !== null || savedId) return null
    const value = readInteractiveDraft()
    return value ? createGameSource(value, 'draft') : null
  })
  const [error, setError] = useState(() =>
    !source && !poolId && !demo && !savedId && draftId === null
      ? 'Choisissez les exercices de votre pool pour préparer une partie.'
      : '',
  )
  const [loading, setLoading] = useState(!source && (!!poolId || demo || !!savedId || draftId !== null))
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
  const [setupPanel, setSetupPanel] = useState<'content' | 'settings' | 'history' | 'print' | null>(() => new URLSearchParams(window.location.search).get('panel') === 'history' ? 'history' : null)
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
    if (!poolId && !demo && !savedId && draftId === null) return
    let active = true
    const load = async () => {
      const kind = poolId ? 'pool' : demo ? 'demo' : draftId !== null ? 'draft' : 'saved'
      const id = poolId ?? (demo ? 'demo' : draftId ?? savedId!)
      const pool=kind==='pool'?await loadPool(id):undefined
      const poolOptions=pool?{...DEFAULT_PLAN_OPTIONS,orderMode:pool.config.shuffle?'shuffled' as const:'source' as const}:undefined
      const fiche = kind === 'saved' ? (await listFiches()).find((f) => f.id === id) : undefined
      if (kind === 'saved' && !fiche) throw new Error('Cette fiche est introuvable ou inaccessible pour votre compte.')
      const value = pool?{recipe:poolRecipe(pool.config,pool.seed),name:pool.name}:demo ? { recipe: demoRecipe(), name: 'Les cartes de la classe' } : kind === 'draft' ? await loadLocalDraft(id) : { recipe: fiche!.recipe, name: fiche!.name }
      if (!requestedSession) return loadGameSource(value, kind, id, poolOptions)
      const run = await runById(requestedSession)
      const next = createGameSource(value, kind, id, poolOptions)
      if (!run) return { ...next, storageWarning: 'Cette sauvegarde est introuvable ou expirée. Vous pouvez commencer une nouvelle partie.' }
      if (run.source.reference.kind !== kind || run.source.reference.id !== id) throw new Error('Cette séance appartient à une autre source. Ouvrez son adresse d’origine.')
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
            e instanceof Error ? e.message : 'La source de la partie est indisponible.',
          )
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [source, poolId, draftId, savedId, demo, requestedSession])
  const allowed = new Set(domainsForAccount(readAccessAccount()))
  const forbidden = source?.recipe.pages.some(
    (page) => !allowed.has(page.domain),
  )
  const game = useMemo(
    () => {
      if (!source || forbidden) return null
      const converted = source.reference?.kind==='pool'?convertPoolRecipe(source.recipe,source.name):convertRecipe(source.recipe, source.name)
      const replayed = source.replay ? { ...converted, id: `${converted.id}-replay-${source.replay}`, seed: deriveSeed({ originalSeed: source.recipe.seed, sourceKey: source.sourceKey, purpose: 'replay', attempt: source.replay }) } : converted
      return applyPlanOptions(replayed, source.options)
    },
    [source, forbidden],
  )
  const selectedSources = useMemo(() => game?lotoSelection(selection??game.questions.map(questionSourceKey),game):[], [selection, game])
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
  const preload = useFullPreload(activeGame, media.manager)
  const readabilityPlan = useMemo(() => activeGame ? { id: activeGame.id, questions: activeGame.questions, rounds: activeGame.rounds } : null, [activeGame])
  const readabilityOptions = useMemo(() => ({ mode, colors, shapes, timer, mascot, contrast }), [mode, colors, shapes, timer, mascot, contrast])
  const readability = useReadabilityPreflight(readabilityPlan, readabilityOptions, !playing && !competitionOpen && media.complete, preload.resolve)
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
  const changePlanOptions = (options: PlanOptions) => {
    clearPreparedSession()
    let nextSelection=selection
    if(game&&!!options.wordSorting!==!!source?.options.wordSorting){
      if(nextSelection!==null)nextSelection=sortingSelection(nextSelection,game.questions,!!options.wordSorting)
      options={...options,customOrder:sortingSelection(options.customOrder,game.questions,!!options.wordSorting)}
    }
    if(game&&!!options.memory!==!!source?.options.memory){
      if(nextSelection!==null)nextSelection=memorySelection(nextSelection,game,!!options.memory)
      options={...options,customOrder:memorySelection(options.customOrder,game,!!options.memory)}
    }
    if(nextSelection!==selection)setSelected(nextSelection)
    setSource((source) => source ? { ...source, options: readPlanOptions(options), presetId: undefined } : source)
  }
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
    let next=renewGameSource(source,selection)
    if(source.reference?.kind==='pool'){
      let valid=false
      for(let attempt=0;attempt<16;attempt++){
        try{assertPoolDraw(next.recipe,convertPoolRecipe(next.recipe,next.name));valid=true;break}catch{next=renewGameSource(source,selection)}
      }
      if(!valid){setPreferencesWarning('Impossible de renouveler tous les exercices avec ces réglages. Modifiez le pool pour continuer.');return}
    }
    setPlaying(false)
    setSource(next)
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
    if (!pendingStart || !activeGame || !media.complete || !resumeChecked || !readability.complete || preload.phase === 'loading') return
    let active = true
    void Promise.resolve().then(() => {
      if (!active) return
      const requested = window.history.state?.clairfleOpenSession
      if (requested) { const next = { ...window.history.state }; delete next.clairfleOpenSession; window.history.replaceState(next, '', window.location.href) }
      setPendingStart(false)
      if (activeGame.questions.length && (!requested || saved && !resumeWarning)) setPlaying(true)
    })
    return () => { active = false }
  }, [pendingStart, activeGame, media.complete, resumeChecked, saved, resumeWarning, readability.complete, preload.phase])
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
    homeHref:poolId?'/interactif':undefined,
    onCompetition: activeGame && media.complete && readability.complete && preload.phase !== 'loading' ? () => { if (!hasLocalCompetition(activeGame.id) && !hasDuel(activeGame.id, 'duel') && !hasDuel(activeGame.id, 'teams')) newPart(false); setCompetitionOpen(true) } : undefined,
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
    <PreparedMediaContext value={preload.resolve}>
    <div className={`ci-app${contrast ? ' ci-high-contrast' : ''}${playing ? ' ci-playing' : ''}${fullscreen ? ' ci-immersive' : ''}`} data-mascot={mascot} style={mascotStyle(mascot,preload.resolve)}>
      {preferencesWarning && <p className="ci-notice" role="status">{preferencesWarning} Le jeu reste utilisable.</p>}
      {!playing && <ClassroomHeader {...header} compact />}
      {loading ? (
        <main className="ci-container">
          <LoadingScreen variant="panel" title="Préparation de la séance" description="Votre activité arrive…" />
        </main>
      ) : error || forbidden ? (
        <main className="ci-container">
          <h1>Préparer une séance</h1>
          <p role="alert">
            {forbidden
              ? `Votre compte ne permet pas de jouer ${poolId?'ce pool':'cette fiche'}.`
              : error}
          </p>
          <a className="ci-primary" href={poolId?'/interactif':'/generateur'}>
            {poolId?'Choisir des exercices':'Ouvrir le générateur'}
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
              <main className="ci-container ci-setup-home">
                <div className="ci-setup-welcome ci-no-print">
                  <p className="ci-eyebrow">Votre partie</p>
                  <h1>{game.title}</h1>
                  <p>{activeGame.questions.length} question{activeGame.questions.length > 1 ? 's' : ''} · {mode === 'class' ? 'Classe' : 'Solo'} · {timer.enabled ? `${timer.seconds} s` : 'Sans minuteur'}</p>
                </div>
                <div className="ci-no-print">
                  {draftWarning && <p role="status">{draftWarning}</p>}
                  {source?.storageWarning && <p role="status">{source.storageWarning}</p>}
                  {resumeWarning && <p role="status">{resumeWarning}</p>}
                  {readability.error && <p role="status">{readability.error}</p>}
                  {media.error && <p role="alert">{media.error}</p>}
                  {resumeWarning === PLAN_CHANGED && <button onClick={() => newPart(false)}>Recommencer avec une nouvelle partie</button>}
                  {(!media.complete || !readability.complete || !resumeChecked || pendingStart) && <LoadingScreen variant="inline" title="Préparation de la partie…" />}
                  {canResume && saved && <p>Partie en cours du {new Date(saved.record.updatedAt).toLocaleString('fr-CH')}.</p>}
                  <div className="ci-setup-start">
                    <button
                      className="ci-primary ci-launch"
                      disabled={!activeGame.questions.length || !media.complete || !resumeChecked || !readability.complete || pendingStart || resumeWarning === PLAN_CHANGED || preload.phase === 'loading'}
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
                        disabled={!media.complete || preload.phase === 'loading'}
                        onClick={() => newPart(true)}
                      >
                        Nouvelle partie
                      </button>
                      <button className="ci-fresh-start" onClick={() => { void deletePreparedSession(activeGame, mode).then(() => setResumeResult({ key: resumeKey, saved: null, warning: '' })).catch((error: unknown) => setResumeResult({ key: resumeKey, saved, warning: error instanceof Error ? error.message : 'Impossible de supprimer la sauvegarde.' })) }}>Supprimer la sauvegarde</button>
                      </>
                    )}
                  </div>
                  <div className="ci-setup-actions">
                    <SetupAction icon="folder" title="Contenu" detail={`${activeGame.questions.length} questions sélectionnées`} onClick={() => setSetupPanel('content')} />
                    <SetupAction icon="timer" title="Préparer la séance" detail="Mode, chrono, mascotte et options" onClick={() => setSetupPanel('settings')} />
                    <SetupAction opensDialog={false} icon="trophy" title="Compétition" detail="Duel, équipes ou salle en ligne" disabled={!header.onCompetition} onClick={() => header.onCompetition?.()} />
                    <SetupAction icon="console" title="Parties et bilans" detail="Reprendre ou retrouver une séance" onClick={() => setSetupPanel('history')} />
                  </div>
                  <button type="button" onClick={() => setSetupPanel('print')}><span aria-hidden="true">▤</span>Supports à imprimer</button>
                </div>
                {setupPanel === 'content' && <SetupDialog title="Contenu" onClose={() => setSetupPanel(null)} wide>
                  <div className="ci-setup-links"><a href="/interactif">Choisir un nouveau pool d’exercices</a><a href="/fiches">Ouvrir une fiche</a>{poolId && <a href={`/interactif?edit=${poolId}`}>Modifier les exercices du pool</a>}</div>
                  <h3>Questions de cette partie</h3>
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
                            {pageQuestions.filter((q,index)=>!q.lotoBoard||pageQuestions.findIndex(other=>other.lotoBoard?.groupId===q.lotoBoard!.groupId)===index).map((q) => (
                              <label key={q.id}>
                                <input
                                  type="checkbox"
                                  checked={selected.includes(q.id)}
                                  onChange={(e) =>
                                    changeSelection(
                                      e.target.checked
                                        ? [...new Set([...selectedSources,...(q.lotoBoard?.sourceKeys??[questionSourceKey(q)])])]
                                        : selectedSources.filter((key) => !(q.lotoBoard?.sourceKeys??[questionSourceKey(q)]).includes(key)),
                                    )
                                  }
                                />
                                <span>
                                  <b>
                                    {q.lotoBoard?`Loto · grille ${q.lotoBoard.number}/${q.lotoBoard.total}`:`${game.questions.indexOf(q) + 1}. ${playPrompt(q.prompt)}`}
                                  </b>
                                  <small>
                                    {q.lotoBoard?`${q.lotoBoard.cells.length} cases · tous les tirages de cette grille`:q.mode === 'choice'
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
                        Aucune question compatible dans cette sélection. Les
                        éléments à adapter sont indiqués ci-dessous.
                      </p>
                    )}
                  <details className="ci-settings-extra"><summary>Images et audios à vérifier</summary>
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
                  </details>
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
                  <button type="button" className="ci-primary" onClick={() => setSetupPanel(null)}>Valider la sélection</button>
                </SetupDialog>}
                {setupPanel === 'settings' && <SetupDialog title="Préparer la séance" onClose={() => setSetupPanel(null)}>
                  <SessionSettings {...header}>
                    {activeGame.questions.some(question => activeGame.corrections[question.id]?.transcript) && <div className="ci-setup-guard"><label><input type="checkbox" checked={showTranscripts} onChange={(event) => {
                      setShowTranscripts(event.target.checked); savePreferences({ showTranscripts: event.target.checked })
                    }} />Proposer la transcription après les réponses</label><p>En Classe et en Solo, le texte de l’écoute devient accessible une fois toutes ses questions corrigées. La lecture suspend le passage automatique à la question suivante.</p></div>}
                    {mode === 'class' && <div className="ci-setup-guard"><label><input type="checkbox" checked={toolbarGuard === 'hold-to-reveal'} onChange={(event) => {
                      const next = event.target.checked ? 'hold-to-reveal' : 'none'
                      setToolbarGuard(next); savePreferences({ toolbarGuard: next })
                    }} />Maintenir le bouton pour révéler</label><p>Un appui de 600 ms évite une correction affichée par erreur. Fonctionne aussi avec Entrée ou Espace.</p></div>}
                    <details className="ci-settings-extra"><summary>Couleurs et symboles des cartes</summary><PaletteSettings colors={colors} shapes={shapes} onColors={changeColors} onShapes={changeShapes} /></details>
                    <details className="ci-settings-extra"><summary>Ordre des questions et préréglages</summary>
                {source && <PresetPanel key={source.reference ? `${source.reference.kind}:${source.reference.id}` : source.sourceKey} sourceKey={source.reference ? `${source.reference.kind}:${source.reference.id}` : source.sourceKey} contentHash={String(hash(canonicalJson(source.template)))} questions={game.questions} selected={selectedSources} options={source.options} timer={timer} mode={mode} onOptions={changePlanOptions} onApply={applyPreset} activePresetId={source.presetId} paletteVersion={paletteVersion} />}
                    </details>
                    <details className="ci-settings-extra"><summary>Jouer sans connexion</summary>
                    <FullPreload phase={preload.phase} progress={preload.progress} error={preload.error} disabled={!media.complete || !activeGame.questions.length} onStart={preload.start} onCancel={preload.release} onRelease={preload.release} />
                    </details>
                    <button type="button" aria-pressed={fullscreen} onClick={header.onFullscreen}>{fullscreen ? 'Quitter le plein écran' : 'Plein écran'}</button>
                  </SessionSettings>
                </SetupDialog>}
                {setupPanel === 'history' && <SetupDialog title="Parties et bilans" onClose={() => setSetupPanel(null)}>
                {source?.reference && <SessionArchive reference={source.reference} template={source.template} title={source.name} onOpen={(run) => { const url = new URL(window.location.href); url.searchParams.set('s', run.sessionId); window.history.pushState({ ...window.history.state, clairfleOpenSession: run.sessionId }, '', url); window.dispatchEvent(new PopStateEvent('popstate')) }} onErased={() => { window.history.pushState({}, '', '/generateur'); window.dispatchEvent(new PopStateEvent('popstate')) }} />}
                  {!source?.reference && <p>Les parties de démonstration n’ont pas d’historique. Choisissez un pool ou une fiche pour conserver vos bilans.</p>}
                </SetupDialog>}
                {setupPanel === 'print' && <SetupDialog title="Supports à imprimer" onClose={() => setSetupPanel(null)}>
                <TeacherSheet game={activeGame} colors={colors} shapes={shapes} disabled={!media.complete} lastSignature={teacherSheetExport} onExport={setTeacherSheetExport} />
                <PrintCards colors={colors} shapes={shapes} />
                <p className="ci-no-print"><a href="/interactif/cartes" target="_blank" rel="noreferrer">Comparer les cartes avec cet écran</a> · <a href="/interactif/diagnostic" target="_blank" rel="noreferrer">Diagnostic de l’écran</a></p>
                </SetupDialog>}
              </main>
            )}
          </>
        )
      )}
    </div>
    </PreparedMediaContext>
  )
}
