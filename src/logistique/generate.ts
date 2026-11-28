import { pageBlocks } from '@/math/page-model'
import { createRng, shuffle, type Rng } from '@/math/rng'
import type { LogistiquePresentation, MathItem, PageConfig } from '@/math/types'
import { currentLogistiquePublication, logistiquePublication, type LogistiqueUnit } from './approved-banks'
import { logistiqueVerdicts } from './choices'
import { logistiqueMatchContent } from './matching'
import { completeLogistiqueGlossaryItem } from './glossary'
import { logistiqueStoryModules, logistiqueStoryQuestions, logistiqueStorySelectionCompatible, validLogistiqueEvaluation,
  type LogistiqueEvaluation } from './evaluation'
import {
  isLogistiqueReferenceType, logistiquePhotoPath, logistiquePresentationFor, logistiqueType,
  validLogistiquePresentation, validLogistiqueSelection, type LogistiqueType,
} from './catalog'

function withAssetBase<T extends { src: string }>(figure: T): T {
  return { ...figure, src: import.meta.env.BASE_URL + figure.src.replace(/^\//, '') }
}

function unitItems(unit: LogistiqueUnit, view: PageConfig['logistiqueTheoryView'],
  presentation?: LogistiquePresentation, presentationRng?: Rng): MathItem[] {
  const logistiqueSource = { id: unit.id, module: unit.module, revision: unit.revision }
  switch (unit.kind) {
    case 'objectifs-apercu':
    case 'theorie':
      return (unit.kind === 'theorie' && view === 'resume' ? unit.summaryBlocks ?? [] : unit.blocks).map((block, index) => {
        return {
          layout: 'theory',
          prompt: `${unit.id}:${index}`,
          answer: '',
          theoryBlock: block.kind === 'image' ? withAssetBase(block)
            : block.kind === 'image-row' ? { ...block, cells: block.cells.map(withAssetBase) }
              : block,
        }
      })
    case 'glossaire':
      return unit.blocks.map((theoryBlock, index) => completeLogistiqueGlossaryItem({
        layout: 'theory', prompt: `${unit.id}:${index}`, answer: '', theoryBlock,
      }, unit.module, unit.illustrations))
    case 'maths':
      return [{
        logistiqueSource,
        layout: 'text',
        prompt: unit.prompt,
        answer: unit.answer,
        calcAnswer: unit.calculation,
        responseAnswer: unit.answer,
        ...(unit.table ? { logistiqueTable: unit.table } : {}),
      }]
    case 'verification':
      if (unit.pairs) {
        const pairs = [...unit.pairs]
        const definitions = pairs.map(({ right }) => right)
        const shuffled = presentationRng ? shuffle(presentationRng, definitions) : definitions
        const choices = shuffled.every((definition, index) => definition === definitions[index])
          ? [...shuffled.slice(1), shuffled[0]!] : shuffled
        return [{ logistiqueSource, layout: 'vocab-match', prompt: unit.prompt, logistiqueMatching: true,
          ...logistiqueMatchContent(pairs, choices) }]
      }
      if (unit.choice) {
        const options = unit.choice.kind === 'true-false' ? [...logistiqueVerdicts] : [...unit.options ?? []]
        return [{ logistiqueSource, layout: 'select', prompt: unit.prompt, answer: unit.answer,
          options: unit.choice.kind === 'multiple' && presentationRng ? shuffle(presentationRng, options) : options,
          logistiqueChoice: unit.choice }]
      }
      if (unit.table) {
        return [{ logistiqueSource, layout: 'text', prompt: unit.prompt,
          answer: unit.table.questions?.map(({ answer }) => answer).join('\n') ?? unit.answer, logistiqueTable: unit.table }]
      }
      if (unit.gaps) {
        const answers = [...unit.gaps.answers]
        const distractors = [...(unit.gaps.distractors ?? [])]
        const words = presentationRng ? shuffle(presentationRng, [...answers, ...distractors]) : undefined
        return [{ logistiqueSource, layout: 'text', prompt: unit.prompt, answer: unit.answer, logistiqueGaps: { answers, words, distractors } }]
      }
      if (unit.options?.length) {
        const options = presentationRng ? shuffle(presentationRng, [...unit.options]) : [...unit.options]
        return [{ logistiqueSource, layout: 'select', prompt: unit.prompt, options, answer: unit.answer }]
      }
      return [{ logistiqueSource, layout: 'text', prompt: unit.prompt, answer: unit.answer,
        ...(unit.numberedAnswers ? { logistiqueResponseLines: {
          kind: 'numbered', answers: [...unit.numberedAnswers], ordered: unit.orderedAnswers,
        } } : presentation === 'lignes-simples' ? { logistiqueResponseLines: { kind: 'simple', count: 2 } } : {}),
      }]
    case 'situation':
      return [{ logistiqueSource, layout: 'text', prompt: unit.prompt,
        answer: unit.table?.questions?.map(({ answer }) => answer).join('\n') ?? unit.answer,
        ...(unit.table ? { logistiqueTable: unit.table } : {}),
      }]
  }
}

function hasPresentation(unit: LogistiqueUnit, presentation?: LogistiquePresentation): boolean {
  if ('table' in unit && unit.table) return unit.table.presentation === presentation
  if (unit.kind === 'verification' && unit.gaps) return presentation === 'sans-liste' || presentation === 'avec-liste'
  if (unit.kind === 'verification') {
    if (unit.pairs) return presentation === 'associer-textes'
    if (unit.choice) return presentation === (unit.choice.kind === 'multiple' ? 'qcm-multiple' : 'vrai-faux')
    if (presentation === 'qcm') return Boolean(unit.options?.length && unit.options.includes(unit.answer))
    if (presentation === 'lignes-numerotees') return Boolean(unit.numberedAnswers?.length)
    if (presentation === 'lignes-simples') return !unit.options?.length && !unit.numberedAnswers?.length
  }
  return presentation === undefined
}

function eligibleUnits(type: LogistiqueType, units: readonly LogistiqueUnit[], modules = [type.module], presentation?: LogistiquePresentation): LogistiqueUnit[] {
  const codes = new Set(modules)
  const matching = units.filter((unit) =>
    codes.has(unit.module) && unit.kind === type.kind && unit.approvedFor.includes(type.diploma) &&
    hasPresentation(unit, presentation),
  )
  return [...new Map(matching.map((unit) => [unit.id, unit])).values()]
}

export function logistiqueEligibleCount(typeId: string): number {
  const type = logistiqueType(typeId)
  return type ? eligibleUnits(type, currentLogistiquePublication.units).length : 0
}

export function logistiqueModuleCapacities(
  type: LogistiqueType, modules: string[], revision?: string, presentation?: LogistiquePresentation,
  evaluation?: LogistiqueEvaluation,
) {
  if (evaluation?.mode === 'histoire' && type.kind === 'maths') {
    return new Map(modules.map((code) => [code, logistiqueStoryModules.some((module) => module === code) ? 1 : 0]))
  }
  const counts = new Map(modules.map((code) => [code, 0]))
  for (const unit of eligibleUnits(type, logistiquePublication(revision)?.units ?? [], modules, presentation)) {
    counts.set(unit.module, (counts.get(unit.module) ?? 0) + 1)
  }
  return counts
}

export function logistiqueQuestionItems(type: LogistiqueType, modules: string[], revision?: string, presentation?: LogistiquePresentation): MathItem[] {
  if (!validLogistiqueSelection(type, { modules }) || !validLogistiquePresentation(type, presentation)) return []
  const presentationRng = presentation === 'avec-liste' || presentation === 'qcm' || presentation === 'qcm-multiple' ||
    presentation === 'associer-textes' ? createRng(20261127) : undefined
  return eligibleUnits(type, logistiquePublication(revision)?.units ?? [], modules, presentation)
    .flatMap((unit) => unitItems(unit, undefined, presentation, presentationRng))
}

export function logistiqueQuestionPhotos(type: LogistiqueType, modules: string[], revision?: string) {
  const publication = logistiquePublication(revision)
  type Photo = { src: string; alt: string; caption: string }
  const catalogues = new Map<string, Photo[]>()
  for (const unit of publication?.units ?? []) {
    if (!modules.includes(unit.module) || unit.kind !== 'theorie' || !unit.approvedFor.includes(type.diploma)) continue
    const photos = unit.blocks.flatMap((block) => block.kind === 'image' ? [block] : block.kind === 'image-row' ? block.cells : [])
    const valid = photos.filter(({ src }) => logistiquePhotoPath(src, type.diploma))
      .map(({ src, alt, caption }) => ({ src, alt, caption }))
    catalogues.set(unit.module, [...new Map(valid.map((photo) => [photo.src, photo])).values()])
  }
  return catalogues
}

export function logistiqueHasSummary(typeId: string, revision?: string): boolean {
  const type = logistiqueType(typeId)
  const publication = logistiquePublication(revision)
  return type?.kind === 'theorie' && Boolean(publication && eligibleUnits(type, publication.units)
    .some((unit) => unit.kind === 'theorie' && unit.summaryBlocks?.length))
}

export function logistiqueDocumentTitle(pages: readonly PageConfig[], evalMode = false, includeSelection = true): string {
  const activities = pages.flatMap((page) => pageBlocks(page).flatMap((block) => {
    const type = logistiqueType(block.exerciseType)
    if (type?.domain !== page.domain || type.topic !== block.topic) return []
    const selected = (includeSelection && block.logistiqueSelection?.modules) || [type.module]
    const retained = block.libreItems?.flatMap(({ logistiqueSource, logistiqueRetained, logistiqueLocalModule }) => {
      const code = logistiqueLocalModule ?? (logistiqueRetained ? logistiqueSource?.module : undefined)
      return code ? [code] : []
    }) ?? []
    return [{ type, modules: [...selected, ...retained], summary: block.logistiqueTheoryView === 'resume' }]
  }))
  const first = activities[0]?.type
  const codes = [...new Set(activities.flatMap(({ modules }) => modules))].sort()
  if (!first || !codes.length) return 'Logistique'
  let label = evalMode ? 'Évaluation' : 'Exercices'
  if (activities.every(({ type }) => type.kind === first.kind)) {
    label = first.label
    if (first.kind === 'glossaire') label = 'Glossaire'
    if (first.kind === 'theorie' && activities.every(({ summary }) => summary)) label = 'Théorie résumée'
  }
  const list = new Intl.ListFormat('fr-CH').format(codes)
  return `${label} : ${codes.length === 1 ? 'module' : 'modules'} ${list}`
}

export function generateLogistique(
  config: PageConfig,
  seed: number,
  units: readonly LogistiqueUnit[] = logistiquePublication(config.logistiqueBankRevision)?.units ?? [],
  excludedIds?: ReadonlySet<string>,
) {
  const type = logistiqueType(config.exerciseType)
  const presentation = logistiquePresentationFor(config)
  if (!type || type.domain !== config.domain || type.topic !== config.topic ||
      !validLogistiqueSelection(type, config.logistiqueSelection) ||
      !validLogistiquePresentation(type, presentation)) {
    return { title: 'Logistique', instruction: 'Sélection indisponible.', items: [], bankQuestionCap: 0 }
  }

  const modules = config.logistiqueSelection?.modules ?? [type.module]
  const quantities = config.logistiqueSelection?.quantities
  const count = Number.isFinite(config.count) ? Math.max(1, Math.floor(config.count)) : 1
  const evaluation = config.logistiqueEvaluation
  if (evaluation?.mode === 'histoire') {
    if (type.kind !== 'maths' || presentation !== undefined || !validLogistiqueEvaluation(evaluation) ||
        !evaluation.story || !logistiqueStorySelectionCompatible(modules, quantities)) {
      return { title: logistiqueDocumentTitle([config], true), instruction: 'La sélection doit correspondre à la trame de réception et de préparation.', items: [], bankQuestionCap: 0 }
    }
    const items = logistiqueStoryQuestions(evaluation.story, modules)
      .filter((item) => !excludedIds?.has(item.logistiqueSource!.id))
    return {
      title: logistiqueDocumentTitle([config], true), instruction: type.instruction,
      items: quantities ? items : items.slice(0, count), bankQuestionCap: modules.length,
    }
  }
  const eligible = eligibleUnits(type, units, modules, presentation)
  const reference = isLogistiqueReferenceType(type.id)
  const candidates = excludedIds?.size ? eligible.filter(({ id }) => !excludedIds.has(id)) : eligible
  const rng = createRng(seed)
  const selected = reference ? eligible : quantities
    ? modules.flatMap((code) => shuffle(rng, candidates.filter((unit) => unit.module === code)).slice(0, quantities[code]))
    : shuffle(rng, candidates).slice(0, count)
  return {
    title: logistiqueDocumentTitle([config]),
    instruction: eligible.length
      ? reference ? type.description
        : presentation === 'sans-liste' || presentation === 'avec-liste' ? 'Complétez les textes.' : type.instruction
      : modules.length ? 'Contenu à compléter pour cette sélection.' : 'Sélectionnez au moins un sous-thème.',
    items: selected.flatMap((unit) => unitItems(unit, config.logistiqueTheoryView, presentation,
      presentation === 'avec-liste' || presentation === 'qcm' || presentation === 'qcm-multiple' || presentation === 'associer-textes' ? rng : undefined)),
    bankQuestionCap: reference && eligible.length ? undefined : eligible.length,
  }
}
