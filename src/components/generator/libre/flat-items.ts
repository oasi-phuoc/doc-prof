import { hasFlatRegeneration, liveEditorProfile } from './profiles'
import { hasTcfLockedQuestions } from '@/tcf/libre-questions'
import { buildPage } from '@/math/generate'
import { pageAsConfig, pageBlocks, setPageBlock } from '@/math/page-model'
import type { ExerciseBlock, MathItem, PageConfig } from '@/math/types'

export function worksheetActivityIds(pages: readonly PageConfig[]): Set<string> {
  return new Set(pages.flatMap((page) => pageBlocks(page).flatMap((block) =>
    [block.libreId, block.a5RightLibre?.id].filter((id): id is string => Boolean(id)))))
}

export function arithmeticActivityId(
  block: ExerciseBlock, seed: number, pageIndex: number, blockIndex: number,
  reserved: ReadonlySet<string>, half?: 'left' | 'right',
) {
  if (half === 'right' && block.a5RightLibre) return block.a5RightLibre.id
  if (half !== 'right' && block.libreId) return block.libreId
  const base = block.libreId ?? `addition-${(seed >>> 0).toString(36)}-${pageIndex}-${blockIndex}`
  const proposed = half === 'right' ? `${base.slice(0, 108)}-droite` : base
  let id = proposed
  let suffix = 1
  while (reserved.has(id)) id = `${proposed}-${++suffix}`
  return id
}

export function identifyItems(items: MathItem[], activityId: string): MathItem[] {
  const occupied = new Set(items.flatMap((item) => item.libreId ? [item.libreId] : []))
  return items.map((item, index) => {
    if (item.libreId) return item
    let id = `${activityId.slice(0, 88)}-question-${index + 1}`
    while (occupied.has(id)) id += '-b'
    occupied.add(id)
    return { ...item, libreId: id }
  })
}

export function hasLockedItems(block: ExerciseBlock): boolean {
  return Boolean(block.libreItems?.some(({ libreLocked }) => libreLocked) ||
    block.a5RightLibre?.items.some(({ libreLocked }) => libreLocked) ||
    block.grammarSnapshot?.libreLockedQuestionIds?.length) || hasTcfLockedQuestions(block.tcfExercise)
}

export function trimUnlockedItems(items: MathItem[], count: number): MathItem[] {
  let toRemove = Math.max(0, items.length - count)
  return items.reduceRight<MathItem[]>((kept, item) => {
    if (!item.libreLocked && toRemove > 0) toRemove -= 1
    else kept.push(item)
    return kept
  }, []).reverse()
}

export function rerollFlatActivity(
  page: PageConfig,
  pageIndex: number,
  blockIndex: number,
  seed: number,
  newSeed: number,
  reserved: ReadonlySet<string>,
  target?: string | readonly string[],
  half?: 'left' | 'right',
): PageConfig {
  const block = pageBlocks(page)[blockIndex]
  if (!block || !hasFlatRegeneration(liveEditorProfile(page.domain, block.exerciseType, half ? 'a5-double-landscape' : 'a4-portrait'))) return page
  const right = half === 'right'
  const rightLibre = right ? block.a5RightLibre : undefined
  const activityId = arithmeticActivityId(block, seed, pageIndex, blockIndex, reserved, half)
  const currentItems = right ? rightLibre?.items : block.libreItems
  const instruction = right ? rightLibre?.instruction : block.libreInstruction
  const pageSeed = seed + pageIndex * 7919 + blockIndex * 10007
  const localSeed = right ? block.contentSeedTwin ?? block.contentSeed ?? 0 : block.contentSeed ?? 0
  const old = buildPage(pageAsConfig(page, { ...block, libreItems: currentItems, libreInstruction: instruction }), pageSeed + localSeed, 1, seed)
  const items = identifyItems(currentItems ?? old.items, activityId)
  const targeted = typeof target === 'string' ? new Set([target]) : target ? new Set(target) : null
  const eligible = (item: MathItem) => !item.libreLocked && (targeted
    ? Boolean(item.libreId && targeted.has(item.libreId))
    : !item.logistiqueRetained)
  if (!items.some(eligible)) return page

  const template = pageAsConfig(page, {
    ...block, count: Math.max(items.length * 2, 4), libreItems: undefined, libreInstruction: undefined,
  })
  const generated = buildPage(template, pageSeed + newSeed, 1, seed).items
  const signature = ({ layout, op, a, b, missing, convert, prompt, left, right, sequence, responseAnswer, logique }: MathItem) =>
    JSON.stringify([layout, op, a, b, missing, convert, prompt, left, right, sequence, responseAnswer, logique?.id])
  const signatures = new Set(items.map(signature))
  const fixedSeries = ['tpm-suite', 'tpm-grandes-suites', 'tpm-suites-6'].includes(block.exerciseType)
  let cursor = 0
  const next = items.map((item, index) => {
    if (!eligible(item)) return item
    while (!fixedSeries && cursor < generated.length && signatures.has(signature(generated[cursor]!))) cursor += 1
    const replacement = fixedSeries ? generated[index] : generated[cursor++]
    if (!replacement || signatures.has(signature(replacement))) return item
    signatures.add(signature(replacement))
    return { ...replacement, libreId: `tirage-${(pageSeed >>> 0).toString(36)}-${(newSeed >>> 0).toString(36)}-${index}` }
  })
  if (next.every((item, index) => item === items[index])) return page
  if (right) return setPageBlock(page, blockIndex, {
    a5RightLibre: { id: activityId, items: next, instruction: instruction ?? old.instruction },
  })
  return setPageBlock(page, blockIndex, {
    libreId: activityId,
    libreItems: next,
    libreInstruction: instruction ?? old.instruction,
  })
}
