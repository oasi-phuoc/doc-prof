import { pageBlocks } from '@/math/page-model'
import { createRng, shuffle, type Rng } from '@/math/rng'
import type { LogistiqueGapMode, MathItem, PageConfig } from '@/math/types'
import { currentLogistiquePublication, logistiquePublication, type LogistiqueUnit } from './approved-banks'
import { isLogistiqueReferenceType, logistiquePhotoPath, logistiqueType, validLogistiqueGapMode, validLogistiqueSelection, type LogistiqueType } from './catalog'

function withAssetBase<T extends { src: string }>(figure: T): T {
  return { ...figure, src: import.meta.env.BASE_URL + figure.src.replace(/^\//, '') }
}

function unitItems(unit: LogistiqueUnit, view: PageConfig['logistiqueTheoryView'], wordsRng?: Rng): MathItem[] {
  const logistiqueSource = { id: unit.id, module: unit.module, revision: unit.revision }
  switch (unit.kind) {
    case 'objectifs-apercu':
    case 'theorie':
    case 'glossaire':
      return (unit.kind === 'theorie' && view === 'resume' ? unit.summaryBlocks ?? [] : unit.blocks).map((block, index) => ({
        layout: 'theory',
        prompt: `${unit.id}:${index}`,
        answer: '',
        theoryBlock: block.kind === 'image' ? withAssetBase(block)
          : block.kind === 'image-row' ? { ...block, cells: block.cells.map(withAssetBase) }
            : block,
      }))
    case 'maths':
      return [{
        logistiqueSource,
        layout: 'text',
        prompt: unit.prompt,
        answer: unit.answer,
        calcAnswer: unit.calculation,
        responseAnswer: unit.answer,
      }]
    case 'verification':
      if (unit.gaps) {
        const answers = [...unit.gaps.answers]
        const words = wordsRng ? shuffle(wordsRng, [...answers, ...(unit.gaps.distractors ?? [])]) : undefined
        return [{ logistiqueSource, layout: 'text', prompt: unit.prompt, answer: unit.answer, logistiqueGaps: { answers, words } }]
      }
      if (unit.options?.length) {
        return [{ logistiqueSource, layout: 'select', prompt: unit.prompt, options: [...unit.options], answer: unit.answer }]
      }
      return [{ logistiqueSource, layout: 'text', prompt: unit.prompt, answer: unit.answer }]
    case 'situation':
      return [{ logistiqueSource, layout: 'text', prompt: unit.prompt, answer: unit.answer }]
  }
}

function eligibleUnits(type: LogistiqueType, units: readonly LogistiqueUnit[], modules = [type.module], gapMode?: LogistiqueGapMode): LogistiqueUnit[] {
  const codes = new Set(modules)
  const matching = units.filter((unit) =>
    codes.has(unit.module) && unit.kind === type.kind && unit.approvedFor.includes(type.diploma) &&
    (unit.kind !== 'verification' || Boolean(unit.gaps) === Boolean(gapMode)),
  )
  return [...new Map(matching.map((unit) => [unit.id, unit])).values()]
}

export function logistiqueEligibleCount(typeId: string): number {
  const type = logistiqueType(typeId)
  return type ? eligibleUnits(type, currentLogistiquePublication.units).length : 0
}

export function logistiqueModuleCapacities(type: LogistiqueType, modules: string[], revision?: string, gapMode?: LogistiqueGapMode) {
  const counts = new Map(modules.map((code) => [code, 0]))
  for (const unit of eligibleUnits(type, logistiquePublication(revision)?.units ?? [], modules, gapMode)) {
    counts.set(unit.module, (counts.get(unit.module) ?? 0) + 1)
  }
  return counts
}

export function logistiqueQuestionItems(type: LogistiqueType, modules: string[], revision?: string, gapMode?: LogistiqueGapMode): MathItem[] {
  if (!validLogistiqueSelection(type, { modules }) || !validLogistiqueGapMode(type, gapMode)) return []
  const wordsRng = gapMode === 'avec-liste' ? createRng(20261127) : undefined
  return eligibleUnits(type, logistiquePublication(revision)?.units ?? [], modules, gapMode)
    .flatMap((unit) => unitItems(unit, undefined, wordsRng))
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
    const retained = block.libreItems?.flatMap(({ logistiqueSource, logistiqueRetained }) =>
      logistiqueRetained && logistiqueSource ? [logistiqueSource.module] : []) ?? []
    return [{ type, modules: [...selected, ...retained] }]
  }))
  const first = activities[0]?.type
  const codes = [...new Set(activities.flatMap(({ modules }) => modules))].sort()
  if (!first || !codes.length) return 'Logistique'
  const label = activities.every(({ type }) => type.kind === first.kind)
    ? first.kind === 'glossaire' ? 'Glossaire' : first.label
    : evalMode ? 'Évaluation' : 'Exercices'
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
  if (!type || type.domain !== config.domain || type.topic !== config.topic ||
      !validLogistiqueSelection(type, config.logistiqueSelection) ||
      !validLogistiqueGapMode(type, config.logistiqueGapMode)) {
    return { title: 'Logistique', instruction: 'Sélection indisponible.', items: [], bankQuestionCap: 0 }
  }

  const modules = config.logistiqueSelection?.modules ?? [type.module]
  const quantities = config.logistiqueSelection?.quantities
  const gapMode = config.logistiqueGapMode
  const eligible = eligibleUnits(type, units, modules, gapMode)
  const reference = isLogistiqueReferenceType(type.id)
  const count = Number.isFinite(config.count) ? Math.max(1, Math.floor(config.count)) : 1
  const candidates = excludedIds?.size ? eligible.filter(({ id }) => !excludedIds.has(id)) : eligible
  const rng = createRng(seed)
  const selected = reference ? eligible : quantities
    ? modules.flatMap((code) => shuffle(rng, candidates.filter((unit) => unit.module === code)).slice(0, quantities[code]))
    : shuffle(rng, candidates).slice(0, count)
  return {
    title: logistiqueDocumentTitle([config]),
    instruction: eligible.length
      ? reference ? type.description
        : gapMode === 'sans-liste' ? 'Complétez les textes.'
          : gapMode === 'avec-liste' ? 'Complétez les textes avec les mots proposés. Utilisez chaque proposition une seule fois. Il peut rester des mots.'
            : type.instruction
      : modules.length ? 'Contenu à compléter pour cette sélection.' : 'Sélectionnez au moins un sous-thème.',
    items: selected.flatMap((unit) => unitItems(unit, config.logistiqueTheoryView, gapMode === 'avec-liste' ? rng : undefined)),
    bankQuestionCap: reference && eligible.length ? undefined : eligible.length,
  }
}
