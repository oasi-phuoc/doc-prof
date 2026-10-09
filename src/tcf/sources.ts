import { TCF_SCENARIOS, TCF_SCENARIO_AUTRE, tcfScenarioLabel } from './catalog'
import type { TcfExercise } from './types'

/** Scène de l’exercice ; à défaut, dernière partie du thème (« Test blanc · série 1 · Au marché »). */
export function tcfScene(ex: TcfExercise): string {
  const scene = ex.scene?.trim()
  if (scene) return scene
  const fromTheme = ex.theme?.split('·').pop()?.trim()
  return fromTheme || ex.id
}

/** Libellés du sélecteur : la scène, numérotée quand elle se répète (« À la plage - 2 »). */
export function tcfExerciseLabels(exercises: readonly TcfExercise[]): Map<string, string> {
  const totals = new Map<string, number>()
  for (const ex of exercises) totals.set(tcfScene(ex), (totals.get(tcfScene(ex)) ?? 0) + 1)
  const seen = new Map<string, number>()
  const labels = new Map<string, string>()
  for (const ex of exercises) {
    const scene = tcfScene(ex)
    const n = (seen.get(scene) ?? 0) + 1
    seen.set(scene, n)
    labels.set(ex.id, (totals.get(scene) ?? 0) > 1 ? `${scene} - ${n}` : scene)
  }
  return labels
}

export type TcfScenarioGroup = {
  id: string
  label: string
  items: Array<{ exercise: TcfExercise; label: string }>
}

/** Exercices regroupés par scénario (ordre de `TCF_SCENARIOS`), triés par scène. */
export function tcfScenarioGroups(exercises: readonly TcfExercise[]): TcfScenarioGroup[] {
  const known = new Set(TCF_SCENARIOS.map((s) => s.id))
  const scenarioOf = (ex: TcfExercise) => (ex.scenario && known.has(ex.scenario) ? ex.scenario : TCF_SCENARIO_AUTRE.id)
  const sorted = [...exercises].sort((a, b) => tcfScene(a).localeCompare(tcfScene(b), 'fr'))
  const labels = tcfExerciseLabels(sorted)
  return [...TCF_SCENARIOS, TCF_SCENARIO_AUTRE]
    .map((s) => ({
      id: s.id,
      label: tcfScenarioLabel(s.id),
      items: sorted.filter((ex) => scenarioOf(ex) === s.id).map((exercise) => ({ exercise, label: labels.get(exercise.id)! })),
    }))
    .filter((g) => g.items.length > 0)
}
