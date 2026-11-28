import { isA5DoubleFormat, pageForA5Half } from '@/components/generator/sheet-format'
import { identifyItems, worksheetActivityIds } from '@/components/generator/libre/flat-items'
import type { FicheRecipe } from '@/fiches/recipe'
import { pageAsConfig, pageBlocks, setPageBlock } from '@/math/page-model'
import { createRng, shuffle } from '@/math/rng'
import type { ExerciseBlock, MathItem, PageConfig } from '@/math/types'
import { isLogistiqueDomain, isLogistiqueReferenceType, logistiquePresentationFor, logistiqueType } from './catalog'
import { applyLogistiqueStoryChange, logistiqueStoryVariant, validLogistiqueStory, type LogistiqueStory } from './evaluation'
import { generateLogistique, logistiqueQuestionItems } from './generate'
import { validLogistiquePages } from './recipe'
import { logistiqueWordingMode } from './wording'

export function canReuseLogistiqueEvaluation(recipe: Pick<FicheRecipe, 'evalMode' | 'pages'>): boolean {
  return recipe.evalMode && recipe.pages.length > 0 && recipe.pages.every(({ domain }) => isLogistiqueDomain(domain)) &&
    recipe.pages.some((page) => pageBlocks(page).some(({ exerciseType }) => !isLogistiqueReferenceType(exerciseType)))
}

function originalQuestions(page: PageConfig, block: ExerciseBlock, seed: number) {
  return block.libreItems ?? generateLogistique(pageAsConfig(page, block), seed + (block.contentSeed ?? 0)).items
}

function newIndependentQuestions(block: ExerciseBlock, items: MathItem[], seed: number) {
  const type = logistiqueType(block.exerciseType)
  if (!type) return { items, replaced: 0, limited: items.length }
  const codes = [...new Set(items.flatMap((item) => item.logistiqueSource ? [item.logistiqueSource.module] : []))]
  const sourceIds = new Set(items.map(({ logistiqueSource }) => logistiqueSource?.id))
  const promptKey = (item: MathItem) => item.prompt?.normalize('NFKC').replace(/\s+/g, ' ').trim().toLowerCase()
  const printed = new Set(items.map(promptKey))
  const pool = shuffle(createRng(seed), logistiqueQuestionItems(type, codes, block.logistiqueBankRevision,
    logistiquePresentationFor(block), logistiqueWordingMode(block, type.diploma)))
  let replaced = 0
  let limited = 0
  const next = items.map((previous) => {
    const source = previous.logistiqueSource
    if (previous.libreLocked || previous.logistiqueLocalModule) return previous
    const index = pool.findIndex((candidate) => candidate.logistiqueSource?.module === source?.module &&
      !sourceIds.has(candidate.logistiqueSource?.id) && !printed.has(promptKey(candidate)) &&
      (candidate.logistiqueTable?.presentation !== 'cas-mixte' || candidate.points === previous.points) &&
      (!previous.logistiqueAssessment?.objective || previous.logistiqueAssessment.objective === candidate.logistiqueAssessment?.objective) &&
      (!previous.logistiqueAssessment?.bloom || previous.logistiqueAssessment.bloom === candidate.logistiqueAssessment?.bloom) &&
      (!previous.logistiqueAssessment?.difficulty || previous.logistiqueAssessment.difficulty === candidate.logistiqueAssessment?.difficulty))
    if (index < 0) {
      limited++
      return previous
    }
    const [candidate] = pool.splice(index, 1)
    printed.add(promptKey(candidate!))
    replaced++
    return {
      ...candidate!, libreId: previous.libreId, points: previous.points, noPoints: previous.noPoints,
      logistiqueAssessment: previous.logistiqueAssessment?.pointsLocked || previous.logistiqueAssessment?.minutes !== undefined
        ? { ...candidate!.logistiqueAssessment, pointsLocked: previous.logistiqueAssessment.pointsLocked,
          minutes: previous.logistiqueAssessment.minutes } : candidate!.logistiqueAssessment,
    }
  })
  return { items: next, replaced, limited }
}

const storyQuantities = ['expected', 'received', 'held', 'ordered'] as const

function newStoryQuestions(story: LogistiqueStory, modules: string[], sets: MathItem[][], seed: number) {
  let conflict: string | undefined
  for (let attempt = 0; attempt < 6; attempt++) {
    const proposed = logistiqueStoryVariant(story, seed + 1_001 * attempt)
    // Essaie d’abord une variante complète, puis des changements partiels compatibles avec les protections.
    for (let mask = 15; mask > 0; mask--) {
      const candidate = { ...story }
      storyQuantities.forEach((key, bit) => { if (mask & (1 << bit)) candidate[key] = proposed[key] })
      if (!validLogistiqueStory(candidate) || storyQuantities.every((key) => candidate[key] === story[key])) continue
      const results = sets.map((items) => applyLogistiqueStoryChange(story, candidate, modules, items))
      const blocked = results.find((result) => result.conflict)?.conflict
      conflict ??= blocked
      if (!blocked && results.some(({ items }, i) => items?.some((item, j) => item !== sets[i]![j]))) {
        return { story: candidate, sets: results.map(({ items }, i) => items ?? sets[i]!) }
      }
    }
  }
  return { conflict: conflict ?? 'La banque ne propose pas de variante compatible avec ce récit.' }
}

export function reuseLogistiqueEvaluation(recipe: FicheRecipe, seed: number):
  { recipe: FicheRecipe; notice: string } | { error: string } {
  if (!canReuseLogistiqueEvaluation(recipe) || !validLogistiquePages(recipe.pages)) {
    return { error: 'La configuration ou la révision de banque de cette évaluation est indisponible.' }
  }
  let replaced = 0
  let limited = 0
  let stories = 0
  const conflicts = new Set<string>()
  const double = isA5DoubleFormat(recipe.sheetFormat)
  const occupied = worksheetActivityIds(recipe.pages)
  function activityId(base: string) {
    let id = base
    while (occupied.has(id)) id += '-b'
    occupied.add(id)
    return id
  }
  const pages = recipe.pages.map((page, pageIndex) => {
    const leftBlocks = double ? pageBlocks(pageForA5Half(page, 'left')) : pageBlocks(page)
    const rightBlocks = double ? pageBlocks(pageForA5Half(page, 'right')) : []
    return pageBlocks(page).reduce<PageConfig>((current, block, blockIndex) => {
      if (isLogistiqueReferenceType(block.exerciseType)) return current
      const oldSeed = recipe.seed + pageIndex * 7919 + blockIndex * 10007
      const newSeed = seed + pageIndex * 7919 + blockIndex * 10007
      const left = leftBlocks[blockIndex]!
      const right = rightBlocks[blockIndex]
      const sameHalves = right && left.libreItems === right.libreItems && left.libreInstruction === right.libreInstruction &&
        (left.libreItems !== undefined || left.contentSeed === right.contentSeed)
      const sets = [originalQuestions(page, left, oldSeed), ...(right && !sameHalves ? [originalQuestions(page, right, oldSeed)] : [])]
      const evaluation = block.logistiqueEvaluation
      let updated: MathItem[][]
      let changedEvaluation = evaluation
      if (evaluation?.mode === 'histoire' && evaluation.story) {
        const modules = block.logistiqueSelection?.modules ?? [logistiqueType(block.exerciseType)!.module]
        const variant = newStoryQuestions(evaluation.story, modules, sets, newSeed)
        if (!variant.sets) {
          conflicts.add(variant.conflict!)
          return current
        }
        updated = variant.sets
        changedEvaluation = { ...evaluation, story: variant.story }
        stories++
      } else {
        const draws = sets.map((items, index) => newIndependentQuestions(block, items, newSeed + index * 1999))
        limited += draws.reduce((count, draw) => count + draw.limited, 0)
        const count = draws.reduce((total, draw) => total + draw.replaced, 0)
        if (!count) return current
        replaced += count
        updated = draws.map((draw) => draw.items)
      }
      if (!double) return setPageBlock(current, blockIndex, { libreItems: updated[0], logistiqueEvaluation: changedEvaluation })
      const id = block.libreId ?? activityId(`log-modele-${pageIndex}-${blockIndex}`)
      const rightId = block.a5RightLibre?.id ?? activityId(`log-modele-${pageIndex}-${blockIndex}-droite`)
      return setPageBlock(current, blockIndex, {
        libreId: id, libreItems: identifyItems(updated[0]!, id), libreInstruction: left.libreInstruction,
        a5RightLibre: { id: rightId, items: identifyItems(updated[1] ?? updated[0]!, rightId), instruction: right?.libreInstruction ?? left.libreInstruction },
        logistiqueEvaluation: changedEvaluation,
      })
    }, page)
  })
  if (!replaced && !stories) {
    const reason = [...conflicts].join(' ') || 'Aucune question modifiable ne dispose d’un autre choix compatible dans la banque.'
    return { error: `Le nouveau tirage est indisponible. ${reason}` }
  }
  const notice = [
    replaced ? `${replaced} question${replaced === 1 ? '' : 's'} renouvelée${replaced === 1 ? '' : 's'}.` : '',
    stories ? `${stories} trame${stories === 1 ? ' actualisée' : 's actualisées'}.` : '',
    limited ? `${limited} question${limited === 1 ? ' conservée' : 's conservées'} faute d’autre choix compatible.` : '',
    ...conflicts,
  ].filter(Boolean).join(' ')
  return { recipe: { ...recipe, pages, libreMode: false, libreSnapshot: null }, notice }
}
