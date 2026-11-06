import { ACCESS_DOMAIN_OPTIONS } from '@/access'
import { applyType, clearLibreContentFreeze } from '@/components/generator/page-helpers'
import { DIFFICULTY_OPTIONS } from '@/math/difficulty'
import { exerciseTypeById } from '@/math/catalog'
import type { Difficulty, Domain, ExerciseBlock } from '@/math/types'

/** Listes compactes du mode jeu : domaine, thème, exercice, niveau. */
export function GameSetupBar({
  domain,
  domains,
  topic,
  topics,
  exerciseType,
  exercises,
  difficulty,
  block,
  onDomain,
  onTopic,
  onExercise,
  onDifficulty,
}: {
  domain: Domain
  domains: Domain[]
  topic: string
  topics: Array<{ id: string; label: string }>
  exerciseType: string
  exercises: Array<{ id: string; label: string }>
  difficulty: Difficulty
  block: ExerciseBlock
  onDomain: (domain: Domain) => void
  onTopic: (topic: string) => void
  onExercise: (patch: Partial<ExerciseBlock>) => void
  onDifficulty: (patch: Partial<ExerciseBlock>) => void
}) {
  return (
    <div className="game-setup" aria-label="Choix de l’exercice">
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
      <label>
        Niveau
        <select
          value={difficulty}
          onChange={(event) =>
            onDifficulty({
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
    </div>
  )
}
