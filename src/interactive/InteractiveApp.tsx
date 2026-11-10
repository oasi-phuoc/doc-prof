import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { listFiches } from '@/fiches/api'
import { domainsForAccount, readAccessAccount } from '@/access'
import type { FicheRecipe } from '@/fiches/recipe'
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
import { sessionKey } from './domain/persistence'
import { PrintCards } from './components/PrintCards'
import { PaletteSettings } from './components/PaletteSettings'
import { CardBadge } from './components/CardBadge'
import { ClassroomHeader } from './components/ClassroomHeader'
import {
  DEFAULT_TIMER,
  validSeconds,
  type TimerSettings,
} from './domain/settings'
import './interactive.css'
import './projection.css'

type Source = { recipe: FicheRecipe; name: string }
const COLORS_KEY = 'clairfle.interactive.palette.v2'
const SHAPES_KEY = 'clairfle.interactive.shapes.v1'
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
    return { enabled: value.enabled, seconds: validSeconds(value.seconds) }
  return DEFAULT_TIMER
}
function returnToFiches() {
  window.history.pushState({}, '', '/fiches')
  window.dispatchEvent(new PopStateEvent('popstate'))
}

export default function InteractiveApp() {
  const [source, setSource] = useState<Source | null>(() =>
    window.location.pathname === '/interactif/demo'
      ? { recipe: demoRecipe(), name: 'Les cartes de la classe' }
      : readInteractiveDraft(),
  )
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
  const [playing, setPlaying] = useState(false)
  const [selection, setSelected] = useState<string[] | null>(null)
  const [excludeUnavailable, setExcludeUnavailable] = useState(true)
  const [fullscreenMessage, setFullscreenMessage] = useState('')
  useEffect(() => {
    if (source) return
    const id = savedIdFromPath()
    if (!id) return
    let active = true
    listFiches()
      .then((fiches) => {
        if (!active) return
        const fiche = fiches.find((f) => f.id === id)
        if (fiche) setSource({ recipe: fiche.recipe, name: fiche.name })
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
  const selected = useMemo(
    () => selection ?? game?.questions.map((q) => q.id) ?? [],
    [selection, game],
  )
  const selectedGame = useMemo(
    () => (game ? prepareGame(game, selected) : null),
    [game, selected],
  )
  const media = useMediaPreflight(selectedGame, !playing)
  const activeGame = useMemo(
    () =>
      selectedGame && excludeUnavailable
        ? excludeQuestions(selectedGame, media.excluded)
        : selectedGame,
    [selectedGame, excludeUnavailable, media.excluded],
  )
  let canResume = false
  try {
    canResume = !!activeGame && !!sessionStorage.getItem(sessionKey(activeGame))
  } catch {
    /* Optional. */
  }
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
    contrast,
    onContrast: () => setContrast((c) => !c),
    onFiches: returnToFiches,
    timer,
    onTimer: changeTimer,
    onFullscreen: () => {
      setFullscreenMessage('')
      const request = document.fullscreenElement
        ? document.exitFullscreen?.()
        : document.documentElement.requestFullscreen?.()
      if (request)
        void request.catch(() =>
          setFullscreenMessage(
            'Utilisez la touche F11 de votre clavier pour le plein écran.',
          ),
        )
      else
        setFullscreenMessage(
          'Utilisez la touche F11 de votre clavier pour le plein écran.',
        )
    },
  }
  return (
    <div className={`ci-app${contrast ? ' ci-high-contrast' : ''}`}>
      {!playing && <ClassroomHeader {...header} />}
      {fullscreenMessage && (
        <p className="ci-notice ci-no-print" role="status">
          {fullscreenMessage}
        </p>
      )}
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
                      Chacun réfléchit, puis lève sa carte. Un élève choisit au
                      tableau. Vous gardez la main sur la correction.
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
                          setSelected(game.questions.map((q) => q.id))
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
                                        ? [...new Set([...selected, ...ids])]
                                        : selected.filter(
                                            (id) => !ids.includes(id),
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
                                        ? [...selected, q.id]
                                        : selected.filter((id) => id !== q.id),
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
                    <button
                      className="ci-primary ci-launch"
                      disabled={!activeGame.questions.length || !media.complete}
                      onClick={() => setPlaying(true)}
                    >
                      {canResume
                        ? 'Reprendre la séance'
                        : 'Commencer la séance'}{' '}
                      <span aria-hidden="true">→</span>
                    </button>
                    {canResume && (
                      <button
                        className="ci-fresh-start"
                        disabled={!media.complete}
                        onClick={() => {
                          try {
                            sessionStorage.removeItem(sessionKey(activeGame))
                          } catch {
                            /* Optional. */
                          }
                          setPlaying(true)
                        }}
                      >
                        Recommencer à zéro
                      </button>
                    )}
                  </section>
                  <aside className="ci-panel">
                    <h2>Le rituel de la classe</h2>
                    <ol className="ci-ritual">
                      <li>Je réfléchis.</li>
                      <li>Au signal, je lève ma carte.</li>
                      <li>Un élève choisit au tableau.</li>
                      <li>Nous discutons de la réponse.</li>
                      <li>L’enseignant révèle la correction.</li>
                    </ol>
                    <p>
                      Les votes sur cartes ne sont pas enregistrés. Aucun
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
                        30 secondes par défaut. Avec un document audio, le
                        décompte commence à la fin de l’écoute. Vous choisissez
                        toujours quand continuer.
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
                <PrintCards colors={colors} shapes={shapes} />
              </main>
            )}
          </>
        )
      )}
    </div>
  )
}
