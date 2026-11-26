import { pageBlocks } from '@/math/page-model'
import { createRng, shuffle } from '@/math/rng'
import type { MathItem, PageConfig } from '@/math/types'
import { currentLogistiquePublication, logistiquePublication, type LogistiqueUnit } from './approved-banks'
import { isLogistiqueReferenceType, logistiqueType, type LogistiqueType } from './catalog'

function unitItems(unit: LogistiqueUnit): MathItem[] {
  switch (unit.kind) {
    case 'objectifs-apercu':
    case 'theorie':
    case 'glossaire':
      return unit.blocks.map((block, index) => ({
        layout: 'theory',
        prompt: `${unit.id}:${index}`,
        answer: '',
        theoryBlock: block.kind === 'image'
          ? { ...block, src: import.meta.env.BASE_URL + block.src.replace(/^\//, '') }
          : block,
      }))
    case 'maths':
      return [{
        layout: 'text',
        prompt: unit.prompt,
        answer: unit.answer,
        calcAnswer: unit.calculation,
        responseAnswer: unit.answer,
      }]
    case 'verification':
      if (unit.options?.length) {
        return [{ layout: 'select', prompt: unit.prompt, options: [...unit.options], answer: unit.answer }]
      }
      return [{ layout: 'text', prompt: unit.prompt, answer: unit.answer }]
    case 'situation':
      return [{ layout: 'text', prompt: unit.prompt, answer: unit.answer }]
  }
}

function eligibleUnits(type: LogistiqueType, units: readonly LogistiqueUnit[]): LogistiqueUnit[] {
  const matching = units.filter((unit) =>
    unit.module === type.module && unit.kind === type.kind && unit.approvedFor.includes(type.diploma),
  )
  return [...new Map(matching.map((unit) => [unit.id, unit])).values()]
}

export function logistiqueEligibleCount(typeId: string): number {
  const type = logistiqueType(typeId)
  return type ? eligibleUnits(type, currentLogistiquePublication.units).length : 0
}

export function logistiqueDocumentTitle(pages: readonly PageConfig[], evalMode = false): string {
  const types = pages.flatMap((page) => pageBlocks(page).flatMap((block) => {
    const type = logistiqueType(block.exerciseType)
    return type?.domain === page.domain && type.topic === block.topic ? [type] : []
  }))
  const first = types[0]
  if (!first) return 'Logistique'
  const codes = [...new Set(types.map(({ module }) => module))].sort()
  const label = types.every(({ kind }) => kind === first.kind)
    ? first.kind === 'glossaire' ? 'Glossaire' : first.label
    : evalMode ? 'Évaluation' : 'Exercices'
  const list = new Intl.ListFormat('fr-CH').format(codes)
  return `${label} : ${codes.length === 1 ? 'module' : 'modules'} ${list}`
}

export function generateLogistique(
  config: PageConfig,
  seed: number,
  units: readonly LogistiqueUnit[] = logistiquePublication(config.logistiqueBankRevision)?.units ?? [],
) {
  const type = logistiqueType(config.exerciseType)
  if (!type || type.domain !== config.domain || type.topic !== config.topic) {
    return { title: 'Logistique', instruction: 'Sélection indisponible.', items: [], bankQuestionCap: 0 }
  }

  const eligible = eligibleUnits(type, units)
  const reference = isLogistiqueReferenceType(type.id)
  const count = Number.isFinite(config.count) ? Math.max(1, Math.floor(config.count)) : 1
  const selected = reference ? eligible : shuffle(createRng(seed), eligible).slice(0, count)
  return {
    title: logistiqueDocumentTitle([config]),
    instruction: eligible.length
      ? reference ? type.description : type.instruction
      : 'Contenu à compléter pour ce module.',
    items: selected.flatMap(unitItems),
    bankQuestionCap: reference && eligible.length ? undefined : eligible.length,
  }
}
