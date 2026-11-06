import { useEffect, useRef, useState } from 'react'
import { ACCESS_DOMAIN_OPTIONS } from '@/access'
import { applyType, clearLibreContentFreeze } from '@/components/generator/page-helpers'
import { DIFFICULTY_OPTIONS } from '@/math/difficulty'
import { exerciseTypeById } from '@/math/catalog'
import type { Difficulty, Domain, ExerciseBlock } from '@/math/types'

/** Menu du jeu, à droite du bouton Fiche / Jeu. Pas de nombre de questions. */
export function GameSetupBar({
  domain,
  domains,
  topic,
  topics,
  topicLabel,
  exerciseType,
  exercises,
  difficulty,
  showValues,
  block,
  subthemes,
  subthemeId,
  letters,
  letterId,
  letterLabel,
  sounds,
  soundId,
  onDomain,
  onTopic,
  onExercise,
  onChange,
  onSubtheme,
  onLetter,
  onSound,
}: {
  domain: Domain
  domains: Domain[]
  topic: string
  topics: Array<{ id: string; label: string }>
  topicLabel: string
  exerciseType: string
  exercises: Array<{ id: string; label: string }>
  difficulty: Difficulty
  /** Algèbre et géométrie : valeurs libres à la place du niveau. */
  showValues: boolean
  block: ExerciseBlock
  subthemes: Array<{ id: string; label: string }>
  subthemeId?: string
  letters: Array<{ id: string; label: string }>
  letterId?: string
  letterLabel: string
  sounds: Array<{ id: string; label: string }>
  soundId?: string
  onDomain: (domain: Domain) => void
  onTopic: (topic: string) => void
  onExercise: (patch: Partial<ExerciseBlock>) => void
  onChange: (patch: Partial<ExerciseBlock>) => void
  onSubtheme: (id: string) => void
  onLetter: (id: string) => void
  onSound: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const close = (event: MouseEvent) => {
      if (!boxRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('click', close)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('click', close)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div className="game-menu-wrap" ref={boxRef}>
      <button
        type="button"
        className={`topbar-icon-btn${open ? ' active' : ''}`}
        aria-label="Paramètres du jeu"
        title="Paramètres du jeu"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
          <path fill="currentColor" d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z" />
        </svg>
      </button>
      {open ? (
        <div className="game-menu" role="menu" aria-label="Paramètres du jeu">
          <p className="settings-menu-heading">Paramètres</p>
          <div className="game-setup">
            <label>
              Domaine
              <select value={domain} onChange={(event) => onDomain(event.target.value as Domain)}>
                {ACCESS_DOMAIN_OPTIONS.filter((item) => domains.includes(item.id)).map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            {topics.length > 0 ? (
              <label>
                {topicLabel}
                <select value={topic} onChange={(event) => onTopic(event.target.value)}>
                  {topics.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
            {subthemes.length > 0 ? (
              <label>
                Sous-thème
                <select
                  value={subthemeId ?? subthemes[0]!.id}
                  onChange={(event) => onSubtheme(event.target.value)}
                >
                  {subthemes.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
            {letters.length > 0 ? (
              <label>
                {letterLabel}
                <select
                  value={letterId ?? letters[0]!.id}
                  onChange={(event) => onLetter(event.target.value)}
                >
                  {letters.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
            {sounds.length > 1 ? (
              <label>
                Son
                <select value={soundId ?? sounds[0]!.id} onChange={(event) => onSound(event.target.value)}>
                  {sounds.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
            {exercises.length > 1 ? (
              <label>
                Exercice
                <select
                  value={exerciseType}
                  onChange={(event) => {
                    const type = exerciseTypeById[event.target.value]
                    if (!type) return
                    onExercise({ ...clearLibreContentFreeze(), ...applyType(type, block) })
                  }}
                >
                  {exercises.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
            {showValues ? (
              <div className={`game-values${block.numberLibre ? ' is-on' : ''}`}>
                <button
                  type="button"
                  className={`game-values-btn${block.numberLibre ? ' active' : ''}`}
                  aria-pressed={!!block.numberLibre}
                  title="Saisir les valeurs à la place du niveau"
                  onClick={() =>
                    onChange({
                      ...clearLibreContentFreeze(),
                      numberLibre: !block.numberLibre,
                      numberMin: block.numberMin ?? 1,
                      numberMax: block.numberMax ?? 100,
                    })
                  }
                >
                  Valeurs
                </button>
                {block.numberLibre ? (
                  <>
                    <label>
                      De
                      <input
                        type="number"
                        inputMode="decimal"
                        step={block.numberDecimals ? 0.1 : 1}
                        value={block.numberMin ?? 1}
                        onChange={(event) =>
                          onChange({
                            ...clearLibreContentFreeze(),
                            numberLibre: true,
                            numberMin: Number(event.target.value),
                          })
                        }
                      />
                    </label>
                    <label>
                      À
                      <input
                        type="number"
                        inputMode="decimal"
                        step={block.numberDecimals ? 0.1 : 1}
                        value={block.numberMax ?? 100}
                        onChange={(event) =>
                          onChange({
                            ...clearLibreContentFreeze(),
                            numberLibre: true,
                            numberMax: Number(event.target.value),
                          })
                        }
                      />
                    </label>
                  </>
                ) : null}
              </div>
            ) : (
              <label>
                Niveau
                <select
                  value={difficulty}
                  onChange={(event) =>
                    onChange({
                      ...clearLibreContentFreeze(),
                      difficulty: event.target.value as Difficulty,
                    })
                  }
                >
                  {DIFFICULTY_OPTIONS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}
