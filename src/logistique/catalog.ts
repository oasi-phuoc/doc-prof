import type { Domain, ExerciseType, Topic } from '@/math/types'
import curriculum from './curriculum.generated.json'

export const LOGISTIQUE_DOMAINS = [
  { id: 'logistique-afp', label: 'Logistique AFP', diploma: 'AFP' },
  { id: 'logistique-cfc', label: 'Logistique CFC', diploma: 'CFC' },
] as const satisfies readonly { id: Domain; label: string; diploma: string }[]

export type LogistiqueDomain = (typeof LOGISTIQUE_DOMAINS)[number]['id']
export type LogistiqueDiploma = (typeof LOGISTIQUE_DOMAINS)[number]['diploma']

const kinds = [
  { id: 'objectifs-apercu', label: 'Objectifs et aperçu', instruction: '' },
  { id: 'theorie', label: 'Théorie', instruction: '' },
  { id: 'maths', label: 'Mathématiques', instruction: 'Écrivez votre calcul et formulez votre réponse.' },
  { id: 'verification', label: 'Vérification des connaissances', instruction: 'Répondez aux questions.' },
  { id: 'situation', label: 'Mises en situation', instruction: 'Lisez les situations et justifiez vos réponses.' },
  { id: 'glossaire', label: 'Glossaires', instruction: '' },
] as const

export type LogistiqueKind = (typeof kinds)[number]['id']
export type LogistiqueType = ExerciseType & {
  domain: LogistiqueDomain
  diploma: LogistiqueDiploma
  module: string
  kind: LogistiqueKind
}

function prefix(diploma: LogistiqueDiploma) {
  return `log-${diploma.toLowerCase()}`
}

const subthemes = LOGISTIQUE_DOMAINS.flatMap(({ id: domain, diploma }) =>
  curriculum.modules.flatMap(({ code, title, theme, year }) => year[diploma] == null ? [] : [{
    domain,
    diploma,
    code,
    id: `${prefix(diploma)}-sub-${code}`,
    topic: `${prefix(diploma)}-theme-${theme}`,
    label: `${code} — ${title}`,
    year: year[diploma],
  }]),
)

export const logistiqueTopics: Topic[] = LOGISTIQUE_DOMAINS.flatMap(({ id: domain, diploma }) =>
  curriculum.themes.flatMap(({ code, title }) => {
    const id = `${prefix(diploma)}-theme-${code}`
    return subthemes.some((entry) => entry.topic === id) ? [{ domain, id, label: `${code} — ${title}` }] : []
  }),
)

export const logistiqueTypes: LogistiqueType[] = subthemes.flatMap((subtheme) => kinds.map((kind) => ({
  domain: subtheme.domain,
  diploma: subtheme.diploma,
  module: subtheme.code,
  kind: kind.id,
  id: `${prefix(subtheme.diploma)}-${subtheme.code}-${kind.id}`,
  topic: subtheme.topic,
  label: kind.label,
  description: subtheme.label,
  instruction: kind.instruction,
  visual: 'texte',
  preferredColumns: 1,
})))

const typesById = new Map(logistiqueTypes.map((type) => [type.id, type]))

export function isLogistiqueDomain(domain: unknown): domain is LogistiqueDomain {
  return LOGISTIQUE_DOMAINS.some(({ id }) => id === domain)
}

export function logistiqueType(typeId: string) {
  return typesById.get(typeId)
}

export function logistiqueSubthemes(topic: string) {
  return subthemes.filter((subtheme) => subtheme.topic === topic)
}

export function logistiqueModules(domain: LogistiqueDomain) {
  return subthemes.filter((entry) => entry.domain === domain)
}

export function logistiqueTypeForSubtheme(subthemeId: string, previousType: string) {
  const subtheme = subthemes.find(({ id }) => id === subthemeId)
  if (!subtheme) return undefined
  return typesById.get(`${prefix(subtheme.diploma)}-${subtheme.code}-${logistiqueType(previousType)?.kind ?? kinds[0].id}`)
}

export function logistiqueTypeChoices(topic: string, typeId: string) {
  const active = logistiqueType(typeId)
  const code = active?.topic === topic ? active.module : logistiqueSubthemes(topic)[0]?.code
  return logistiqueTypes.filter((type) => type.topic === topic && type.module === code)
}

export function isLogistiqueReferenceType(typeId: string) {
  const kind = logistiqueType(typeId)?.kind
  return kind === 'objectifs-apercu' || kind === 'theorie' || kind === 'glossaire'
}

export function validLogistiqueSelection(type: LogistiqueType, selection: unknown): boolean {
  if (selection === undefined) return true
  if (!selection || typeof selection !== 'object' || Array.isArray(selection) ||
      isLogistiqueReferenceType(type.id) || !('modules' in selection) || !Array.isArray(selection.modules)) return false
  const allowed = new Set(logistiqueModules(type.domain).map(({ code }) => code))
  const modules = selection.modules
  if (modules.length > allowed.size || new Set(modules).size !== modules.length ||
      !modules.every((module) => typeof module === 'string' && allowed.has(module))) return false
  if (!('quantities' in selection) || selection.quantities === undefined) return true
  const quantities = selection.quantities
  if (!quantities || typeof quantities !== 'object' || Array.isArray(quantities)) return false
  return Object.keys(quantities).length === modules.length &&
    Object.entries(quantities).every(([code, quantity]) =>
      modules.includes(code) && typeof quantity === 'number' && Number.isSafeInteger(quantity) && quantity >= 1)
}

export function validLogistiqueGapMode(type: LogistiqueType, mode: unknown): boolean {
  return mode === undefined || (type.kind === 'verification' && (mode === 'sans-liste' || mode === 'avec-liste'))
}

type CataloguePage = {
  domain?: unknown
  exerciseType?: unknown
  topic?: unknown
  extraBlocks?: unknown
}

export function validLogistiqueCataloguePages(pages: readonly CataloguePage[]): boolean {
  const domain = pages.find((page) => isLogistiqueDomain(page.domain))?.domain
  if (!domain) return true
  const validBlock = (block: unknown) => {
    if (!block || typeof block !== 'object' || !('exerciseType' in block) || !('topic' in block)) return false
    const type = typeof block.exerciseType === 'string' ? logistiqueType(block.exerciseType) : undefined
    const view = 'logistiqueTheoryView' in block ? block.logistiqueTheoryView : undefined
    const selection = 'logistiqueSelection' in block ? block.logistiqueSelection : undefined
    const gapMode = 'logistiqueGapMode' in block ? block.logistiqueGapMode : undefined
    return type?.domain === domain && type.topic === block.topic &&
      validLogistiqueSelection(type, selection) &&
      validLogistiqueGapMode(type, gapMode) &&
      (view === undefined || (type.kind === 'theorie' && (view === 'complet' || view === 'resume')))
  }
  return pages.every((page) => page.domain === domain && validBlock(page) &&
    (page.extraBlocks === undefined || (Array.isArray(page.extraBlocks) && page.extraBlocks.every(validBlock))))
}
