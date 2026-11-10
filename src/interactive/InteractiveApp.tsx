import { lazy, Suspense, useEffect, useMemo, useState, type CSSProperties } from 'react'
import { listFiches } from '@/fiches/api'
import { domainsForAccount, readAccessAccount } from '@/access'
import { MASCOTS, type MascotKind } from './domain/mascot'
import type { Game, PlayMode } from './domain/types'
import { createGameSource, renewGameSource, saveGameRun, questionSourceKey, type GameSource } from './game-run'
import { convertRecipe } from './domain/convert'
import { excludeQuestions, prepareGame } from './domain/plan'
import { useMediaPreflight } from './media/useMediaPreflight'
import { MediaCheck } from './components/MediaCheck'
import {
  PALETTE,
  SHAPES,
  defaultShapes,
  inkForColor,
  type ShapeId,
} from './domain/palette'
import { demoRecipe } from './demo'
import { readInteractiveDraft } from './navigation'
import { SessionView } from './SessionView'
import { loadSession, deleteSession, type Resume } from './domain/persistence'
import { acquireSessionLease } from './session-lease'
import { PrintCards } from './components/PrintCards'
import { TeacherSheet } from './components/TeacherSheet'
import { PaletteSettings } from './components/PaletteSettings'
import { CardBadge } from './components/CardBadge'
import { ClassroomHeader } from './components/ClassroomHeader'
import {
  DEFAULT_TIMER,
  validSeconds,
  validFeedbackSeconds,
  type TimerSettings,
} from './domain/settings'
import './interactive.css'
import './projection.css'

type Source = GameSource
const COLORS_KEY = 'clairfle.interactive.palette.v2'
const SHAPES_KEY = 'clairfle.interactive.shapes.v1'
const MODE_KEY = 'clairfle.interactive.mode.v1'
const MASCOT_KEY = 'clairfle.interactive.mascot.v1'
const TIMER_KEY = 'clairfle.interactive.timer.v1'
function readSetting(key: string): unknown {
  try {
    return JSON.parse(localStorage.getItem(key) ?? 'null')
  } catch {
    return null
  }
}
function saveSetting(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* Preferences are optional. */
  }
}
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
function loadColors(): string[] {
  const value = readSetting(COLORS_KEY)
  return Array.isArray(value) &&
    value.length === 6 &&
    value.every((c) => typeof c === 'string' && /^#[0-9a-f]{6}$/i.test(c))
    ? value
    : PALETTE.map((c) => c.color)
}
function loadShapes(): ShapeId[] {
  const value = readSetting(SHAPES_KEY)
  return Array.isArray(value) &&
    value.length === 6 &&
    new Set(value).size === 6 &&
    value.every((s) => SHAPES.some((shape) => shape.id === s))
    ? value
    : [...defaultShapes]
}
function loadTimer(): TimerSettings {
  const value = readSetting(TIMER_KEY)
  if (
    value &&
    typeof value === 'object' &&
    'enabled' in value &&
    'seconds' in value &&
    typeof value.enabled === 'boolean' &&
    typeof value.seconds === 'number' &&
    Number.isFinite(value.seconds)
  )
    return { enabled: value.enabled, seconds: validSeconds(value.seconds), feedbackSeconds: validFeedbackSeconds('feedbackSeconds' in value && typeof value.feedbackSeconds === 'number' ? value.feedbackSeconds : NaN) }
  return DEFAULT_TIMER
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

const DiagnosticPage = lazy(() => import('./DiagnosticPage'))
export default function InteractiveApp() {
  if (window.location.pathname.replace(/\/+$/, '') === '/interactif/diagnostic') return <Suspense fallback={<p role="status">Chargement du diagnostic…</p>}><DiagnosticPage colors={loadColors()} shapes={loadShapes()} /></Suspense>
  return <GameApp />
}

function GameApp() {
  const [source, setSource] = useState<Source | null>(() => {
    const demo = window.location.pathname === '/interactif/demo'
    const value = demo ? { recipe: demoRecipe(), name: 'Les cartes de la classe' } : readInteractiveDraft()
    return value ? createGameSource(value, demo ? 'demo' : 'draft') : null
  })
  const [error, setError] = useState(() =>
    !source && !savedIdFromPath()
      ? 'Ouvrez une fiche puis choisissez « Jouer avec la classe ».'
      : '',
  )
  const [loading, setLoading] = useState(!source && !!savedIdFromPath())
  const [colors, setColors] = useState(loadColors)
  const [shapes, setShapes] = useState(loadShapes)
  const [timer, setTimer] = useState(loadTimer)
  const [contrast, setContrast] = useState(false)
  const [mascot, setMascot] = useState<MascotKind>(() => MASCOTS.find((item) => item.id === readSetting(MASCOT_KEY))?.id ?? 'leaf')
  const [mode, setMode] = useState<PlayMode>(() => {
    try { return sessionStorage.getItem(MODE_KEY) === 'solo' ? 'solo' : 'class' } catch { return 'class' }
  })
  const [playing, setPlaying] = useState(false)
  const [selection, setSelected] = useState<string[] | null>(() => source?.selectedKeys ?? null)
  const [pendingStart, setPendingStart] = useState(false)
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
    const id = savedIdFromPath()
    if (!id) return
    let active = true
    listFiches()
      .then((fiches) => {
        if (!active) return
        const fiche = fiches.find((f) => f.id === id)
        if (fiche) {
          const next = createGameSource({ recipe: fiche.recipe, name: fiche.name }, 'saved', fiche.id)
          setSource(next)
          setSelected(next.selectedKeys)
        }
        else
          setError(
            'Cette fiche est introuvable ou inaccessible pour votre compte.',
          )
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
  }, [source])
  const allowed = new Set(domainsForAccount(readAccessAccount()))
  const forbidden = source?.recipe.pages.some(
    (page) => !allowed.has(page.domain),
  )
  const game = useMemo(
    () =>
      source && !forbidden ? convertRecipe(source.recipe, source.name) : null,
    [source, forbidden],
  )
  const selectedSources = useMemo(() => selection ?? game?.questions.map(questionSourceKey) ?? [], [selection, game])
  const selected = useMemo(() => game?.questions.filter((question) => selectedSources.includes(questionSourceKey(question))).map((question) => question.id) ?? [], [selectedSources, game])
  const selectedGame = useMemo(
    () => (game ? prepareGame(game, selected, mode) : null),
    [game, selected, mode],
  )
  const media = useMediaPreflight(selectedGame, !playing)
  const activeGame = useMemo(
    () =>
      selectedGame && excludeUnavailable
        ? excludeQuestions(selectedGame, media.excluded)
        : selectedGame,
    [selectedGame, excludeUnavailable, media.excluded],
  )
  const resumeKey = activeGame?.id ?? ''
  const [resumeResult, setResumeResult] = useState<{ key: string; saved: Resume | null; warning: string } | null>(null)
  const resumeChecked = resumeResult?.key === resumeKey
  const saved = resumeChecked ? resumeResult.saved : null
  const resumeWarning = resumeChecked ? resumeResult.warning : ''
  useEffect(() => {
    let active = true
    if (!activeGame || playing) return
    void loadSession(activeGame, mode).then(
      (value) => { if (active) setResumeResult({ key: resumeKey, saved: value, warning: '' }) },
      (error: unknown) => { if (active) setResumeResult({ key: resumeKey, saved: null, warning: error instanceof Error ? error.message : 'Sauvegarde indisponible.' }) },
    )
    return () => { active = false }
  }, [activeGame, playing, mode, resumeKey])
  const canResume = !!saved && !saved.state.finished
  const newPart = (autoStart: boolean) => {
    if (!source) return
    setPlaying(false)
    setSource(renewGameSource(source, selection))
    setResumeResult(null)
    setPendingStart(autoStart)
  }
  useEffect(() => {
    if (!pendingStart || !activeGame || !media.complete || !resumeChecked) return
    let active = true
    void Promise.resolve().then(() => { if (active) { setPendingStart(false); if (activeGame.questions.length) setPlaying(true) } })
    return () => { active = false }
  }, [pendingStart, activeGame, media.complete, resumeChecked])
  const changeColors = (next: string[]) => {
    setColors(next)
    saveSetting(COLORS_KEY, next)
  }
  const changeShapes = (next: ShapeId[]) => {
    setShapes(next)
    saveSetting(SHAPES_KEY, next)
  }
  const changeTimer = (next: TimerSettings) => {
    setTimer(next)
    saveSetting(TIMER_KEY, next)
  }
  const header = {
    mascot,
    onMascot: (next: MascotKind) => { setMascot(next); saveSetting(MASCOT_KEY, next) },
    mode,
    onMode: (next: PlayMode) => {
      setMode(next)
      try { sessionStorage.setItem(MODE_KEY, next) } catch { /* Optional preference. */ }
    },
    fullscreen,
    playing,
    contrast,
    onContrast: () => setContrast((c) => !c),
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
  return (
    <div className={`ci-app${contrast ? ' ci-high-contrast' : ''}${playing ? ' ci-playing' : ''}${fullscreen ? ' ci-immersive' : ''}`} data-mascot={mascot}>
      {!playing && <ClassroomHeader {...header} />}
      {loading ? (
        <main className="ci-container">
          <p role="status">Préparation de la séance…</p>
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
                onExit={() => setPlaying(false)}
                onFinish={() => newPart(false)}
                onNewPart={() => newPart(true)}
                mediaManager={media.manager}
                header={header}
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
                          setSelected(null)
                        }
                      >
                        Tout sélectionner
                      </button>
                      <button onClick={() => setSelected([])}>
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
                                    setSelected(
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
                                    setSelected(
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
                    <p className="ci-run-note">Une nouvelle partie renouvelle les tirages du générateur, avec les mêmes types, limites et durées. Les questions saisies manuellement sont conservées ; une reprise garde la partie en cours.</p>
                    {resumeWarning && <p role="status">{resumeWarning}</p>}
                    {canResume && saved && <p>Reprendre la séance du {new Date(saved.record.updatedAt).toLocaleString('fr-CH')} (question {saved.state.index + 1} sur {activeGame.rounds?.length ?? activeGame.questions.length}) ?</p>}
                    <button
                      className="ci-primary ci-launch"
                      disabled={!activeGame.questions.length || !media.complete || !resumeChecked || pendingStart}
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
                  </aside>
                </div>
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
                <p className="ci-no-print"><a href="/interactif/diagnostic" target="_blank" rel="noreferrer">Diagnostic de l’écran</a></p>
              </main>
            )}
          </>
        )
      )}
    </div>
  )
}
