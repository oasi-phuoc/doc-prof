import type { LogistiqueUnit } from '../approved-banks'
import draftModules from './acquis-v008.json'

const kinds = ['verification', 'situation', 'maths'] as const
const revision = 'acquis-v008'

export function logistiqueAcquisitionExercises(previous: readonly LogistiqueUnit[]): LogistiqueUnit[] {
  const courses = new Map(previous.flatMap((unit) => unit.kind === 'theorie' ? [[unit.module, unit] as const] : []))
  return Object.entries(draftModules).flatMap(([module, drafts]) => {
    const course = courses.get(module)
    if (!course) throw new Error(`Cours introuvable pour les exercices ${module}`)
    const headings = new Set(course.blocks.flatMap((block) => block.kind === 'heading' ? [block.text] : []))
    return kinds.flatMap((kind) => drafts[kind].map<LogistiqueUnit>(([theorySection, prompt, answer, calculation], index) => {
      const id = `log-${module}-${kind}-${revision}-${index + 1}`
      if (!theorySection || !headings.has(theorySection) || !prompt?.trim() || !answer?.trim()) {
        throw new Error(`Exercice ou rattachement au cours incomplet : ${id}`)
      }
      const entry = { id, module, revision, approvedFor: course.approvedFor, theorySection, prompt, answer }
      if (kind !== 'maths') return { ...entry, kind }
      if (!calculation?.trim()) throw new Error(`Calcul du corrigé manquant : ${id}`)
      return { ...entry, kind, calculation }
    }))
  })
}
