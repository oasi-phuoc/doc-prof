import type { Domain, ExerciseBlock, ExerciseType, LogistiqueQuestionImage, LogistiqueResponseLines, Topic } from '@/math/types'
import curriculum from './curriculum.generated.json'
import { validLogistiqueGaps } from './gaps'
import { isLogistiqueTablePresentation, validLogistiqueExerciseTable } from './tables'
import { logistiqueStorySelectionCompatible, validLogistiqueAssessment, validLogistiqueEvaluation } from './evaluation'

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

export function logistiquePresentationFor(block: Pick<ExerciseBlock, 'logistiquePresentation' | 'logistiqueGapMode'>) {
  return block.logistiquePresentation ?? block.logistiqueGapMode
}

export function validLogistiquePresentation(type: LogistiqueType, presentation: unknown): boolean {
  if (isLogistiqueTablePresentation(presentation)) return type.kind === 'verification' || type.kind === 'situation' ||
    (type.kind === 'maths' && (presentation === 'tableau-donnees' || presentation === 'tableau-dates'))
  if (presentation === 'qcm' || presentation === 'lignes-simples' || presentation === 'lignes-numerotees') {
    return type.kind === 'verification'
  }
  return validLogistiqueGapMode(type, presentation)
}

function validResponseLines(value: unknown): value is LogistiqueResponseLines {
  if (!value || typeof value !== 'object') return false
  const lines = value as LogistiqueResponseLines
  if (lines.kind === 'simple') return Number.isInteger(lines.count) && lines.count >= 1 && lines.count <= 8
  return lines.kind === 'numbered' && Array.isArray(lines.answers) && lines.answers.length >= 2 && lines.answers.length <= 8 &&
    lines.answers.every((text) => typeof text === 'string') &&
    (lines.ordered === undefined || typeof lines.ordered === 'boolean')
}

export function logistiquePhotoPath(src: unknown, diploma?: LogistiqueDiploma): src is string {
  if (typeof src !== 'string') return false
  const path = /^\/assets\/logistique\/\d{3}\/\d{3}\/(commun|afp|cfc)\/[a-z0-9-]+-photo-v\d+\.webp$/.exec(src)
  return Boolean(path && (!diploma || path[1] === 'commun' || path[1] === diploma.toLowerCase()))
}

function validLogistiqueQuestionImage(image: unknown, diploma: LogistiqueDiploma): image is LogistiqueQuestionImage {
  if (!image || typeof image !== 'object' || Array.isArray(image)) return false
  const { src, alt, caption, placement, visibility, width } = image as Partial<LogistiqueQuestionImage>
  return logistiquePhotoPath(src, diploma) &&
    typeof alt === 'string' && alt.length <= 180 &&
    typeof caption === 'string' && caption.length <= 160 &&
    (width === 100 || width === 140 || width === 180) &&
    (placement === 'avant' || placement === 'apres' || placement === 'droite') &&
    (visibility === 'both' || visibility === 'answers')
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
    const presentation = 'logistiquePresentation' in block ? block.logistiquePresentation : undefined
    const evaluation = 'logistiqueEvaluation' in block ? block.logistiqueEvaluation : undefined
    const items = 'libreItems' in block && Array.isArray(block.libreItems) ? block.libreItems : []
    return type?.domain === domain && type.topic === block.topic &&
      validLogistiqueSelection(type, selection) &&
      validLogistiqueGapMode(type, gapMode) &&
      validLogistiquePresentation(type, presentation) &&
      (gapMode === undefined || presentation === undefined) &&
      (evaluation === undefined || (!isLogistiqueReferenceType(type.id) && validLogistiqueEvaluation(evaluation) &&
        (evaluation.mode !== 'histoire' || (type.kind === 'maths' && gapMode === undefined && presentation === undefined &&
          logistiqueStorySelectionCompatible(
            (selection as ExerciseBlock['logistiqueSelection'])?.modules ?? [type.module],
            (selection as ExerciseBlock['logistiqueSelection'])?.quantities))))) &&
      items.every((item) =>
        (item?.logistiqueAssessment === undefined || (!isLogistiqueReferenceType(type.id) &&
          validLogistiqueAssessment(item.logistiqueAssessment))) &&
        (item?.logistiqueNarrative === undefined || (!isLogistiqueReferenceType(type.id) &&
          typeof item.logistiqueNarrative === 'string' && item.logistiqueNarrative.length <= 1100)) &&
        (item?.logistiqueLocalModule === undefined || (!isLogistiqueReferenceType(type.id) &&
          !item.logistiqueSource && typeof item.libreId === 'string' &&
          typeof item.prompt === 'string' && typeof item.answer === 'string' &&
          (item.layout === 'text' || (type.kind !== 'maths' && item.layout === 'select' &&
            Array.isArray(item.options) && item.options.length >= 2 && item.options.length <= 12 &&
            item.options.every((option: unknown) => typeof option === 'string'))) &&
          subthemes.some(({ code, diploma }) =>
            code === item.logistiqueLocalModule && diploma === type.diploma))) &&
        (item?.logistiqueImage === undefined || validLogistiqueQuestionImage(item.logistiqueImage, type.diploma)) &&
        (item?.logistiqueResponseLines === undefined || (type.kind === 'verification' && item.layout === 'text' &&
          !item.logistiqueGaps && !item.logistiqueTable && validResponseLines(item.logistiqueResponseLines))) &&
        (item?.logistiqueTable === undefined || (
          !item.logistiqueGaps && validLogistiqueExerciseTable(item.logistiqueTable) &&
          validLogistiquePresentation(type, item.logistiqueTable.presentation))) &&
        (item?.logistiqueGaps === undefined || (type.kind === 'verification' && validLogistiqueGaps(item.prompt, item.logistiqueGaps)))) &&
      (view === undefined || (type.kind === 'theorie' && (view === 'complet' || view === 'resume')))
  }
  return pages.every((page) => page.domain === domain && validBlock(page) &&
    (page.extraBlocks === undefined || (Array.isArray(page.extraBlocks) && page.extraBlocks.every(validBlock))))
}
