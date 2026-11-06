import { ACCESS_DOMAIN_OPTIONS } from '@/access'
import { applyType, clearLibreContentFreeze } from '@/components/generator/page-helpers'
import { DIFFICULTY_OPTIONS } from '@/math/difficulty'
import { exerciseTypeById } from '@/math/catalog'
import type { Difficulty, Domain, ExerciseBlock } from '@/math/types'

/** Réglages du mode jeu, dans le menu « … » à droite. */
export function GameSetupBar({
  domain,
  domains,
  topic,
  topics,
  exerciseType,
  exercises,
  difficulty,
  showValues,
  block,
  onDomain,
  onTopic,
  onExercise,
  onChange,
}: {
  domain: Domain
  domains: Domain[]
  topic: string
  topics: Array<{ id: string; label: string }>
  exerciseType: string
  exercises: Array<{ id: string; label: string }>
  difficulty: Difficulty
  /** Algèbre et géométrie : bouton Valeurs à la place du niveau. */
  showValues: boolean
  block: ExerciseBlock
  onDomain: (domain: Domain) => void
  onTopic: (topic: string) => void
  onExercise: (patch: Partial<ExerciseBlock>) => void
  onChange: (patch: Partial<ExerciseBlock>) => void
}) {
  return (
    <div className="game-setup" role="group" aria-label="Choix de l’exercice">
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
          Thème
          <select value={topic} onChange={(event) => onTopic(event.target.value)}>
            {topics.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      {exercises.length > 0 ? (
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
  )
}
