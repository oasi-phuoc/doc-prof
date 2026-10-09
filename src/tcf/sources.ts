import { TCF_SCENARIOS, TCF_SCENARIO_AUTRE } from './catalog'
import type { TcfCompetence, TcfExercise } from './types'

type TcfGroup = { id: string; label: string }

/** PE : thèmes d’exercices (type de texte à produire). */
export const TCF_PE_GROUPS: readonly TcfGroup[] = [
  { id: 'formulaire', label: 'Formulaire' },
  { id: 'dialogue', label: 'Dialogue' },
  { id: 'message', label: 'Message' },
  { id: 'email', label: 'E-mail' },
]

/** PO : parties de l’épreuve orale (dans l’ordre du test). */
export const TCF_PO_GROUPS: readonly TcfGroup[] = [
  { id: 'entretien', label: 'Entretien dirigé' },
  { id: 'questions', label: 'Poser des questions' },
  { id: 'image', label: 'Image et interaction' },
  { id: 'interaction', label: 'Jeux de rôle' },
]

/** Groupes du sélecteur : thèmes (PE), parties (PO) ou scénarios (CO, CE). */
export function tcfGroups(competence: TcfCompetence): readonly TcfGroup[] {
  if (competence === 'PE') return TCF_PE_GROUPS
  if (competence === 'PO') return TCF_PO_GROUPS
  return [...TCF_SCENARIOS, TCF_SCENARIO_AUTRE]
}

export function tcfGroupId(ex: TcfExercise): string {
  switch (ex.type_exercice) {
    case 'formulaire':
      return 'formulaire'
    case 'dialogue_a_completer':
      return 'dialogue'
    case 'email_reponse':
      return 'email'
    case 'question_texte':
      return ex.support.email ? 'email' : 'message'
    case 'sms_reponse':
    case 'image_question':
      return 'message'
    case 'entretien':
      return 'entretien'
    case 'trois_themes':
    case 'mots_theme':
      return 'questions'
    case 'image_interaction':
    case 'image_unique':
    case 'sequence_4_images':
      return 'image'
    case 'dialogue':
      return 'interaction'
    default:
      return ex.scenario && TCF_SCENARIOS.some((s) => s.id === ex.scenario) ? ex.scenario : TCF_SCENARIO_AUTRE.id
  }
}

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

/** Exercices regroupés (thème PE, partie PO, scénario CO/CE), triés par scène. */
export function tcfScenarioGroups(exercises: readonly TcfExercise[]): TcfScenarioGroup[] {
  const competence = exercises[0]?.competence
  if (!competence) return []
  const sorted = [...exercises].sort((a, b) => tcfScene(a).localeCompare(tcfScene(b), 'fr'))
  const labels = tcfExerciseLabels(sorted)
  return tcfGroups(competence)
    .map((g) => ({
      id: g.id,
      label: g.label,
      items: sorted.filter((ex) => tcfGroupId(ex) === g.id).map((exercise) => ({ exercise, label: labels.get(exercise.id)! })),
    }))
    .filter((g) => g.items.length > 0)
}
