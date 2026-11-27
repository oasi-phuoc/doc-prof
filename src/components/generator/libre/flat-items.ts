import { buildPage } from '@/math/generate'
import { pageAsConfig, pageBlocks, setPageBlock } from '@/math/page-model'
import type { ExerciseBlock, MathItem, PageConfig } from '@/math/types'

export function additionActivityId(block: ExerciseBlock, seed: number, pageIndex: number, blockIndex: number) {
  return block.libreId ?? `addition-${(seed >>> 0).toString(36)}-${pageIndex}-${blockIndex}`
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
  return Boolean(block.libreItems?.some(({ libreLocked }) => libreLocked))
}

export function trimUnlockedItems(items: MathItem[], count: number): MathItem[] {
  let toRemove = Math.max(0, items.length - count)
  return items.reduceRight<MathItem[]>((kept, item) => {
    if (!item.libreLocked && toRemove > 0) toRemove -= 1
    else kept.push(item)
    return kept
  }, []).reverse()
}

export function rerollAddition(
  page: PageConfig,
  pageIndex: number,
  blockIndex: number,
  seed: number,
  newSeed: number,
  targetId?: string,
): PageConfig {
  const block = pageBlocks(page)[blockIndex]
  if (page.domain !== 'algèbre' || block?.exerciseType !== 'addition-ligne') return page
  const activityId = additionActivityId(block, seed, pageIndex, blockIndex)
  const pageSeed = seed + pageIndex * 7919 + blockIndex * 10007
  const old = buildPage(pageAsConfig(page, block), pageSeed + (block.contentSeed ?? 0), 1, seed)
  const items = identifyItems(block.libreItems ?? old.items, activityId)
  const eligible = (item: MathItem) => !item.libreLocked && (!targetId || item.libreId === targetId)
  if (!items.some(eligible)) return page

  const template = pageAsConfig(page, {
    ...block, count: Math.max(block.count * 2, 4), libreItems: undefined, libreInstruction: undefined,
  })
  const generated = buildPage(template, pageSeed + newSeed, 1, seed).items
  const prompts = new Set(items.map(({ prompt }) => prompt))
  let cursor = 0
  const next = items.map((item, index) => {
    if (!eligible(item)) return item
    while (cursor < generated.length && prompts.has(generated[cursor]?.prompt)) cursor += 1
    const replacement = generated[cursor++]
    if (!replacement) return item
    prompts.add(replacement.prompt)
    return { ...replacement, libreId: `tirage-${(pageSeed >>> 0).toString(36)}-${(newSeed >>> 0).toString(36)}-${index}` }
  })
  if (next.every((item, index) => item === items[index])) return page
  return setPageBlock(page, blockIndex, {
    libreId: activityId,
    libreItems: next,
    libreInstruction: block.libreInstruction ?? old.instruction,
  })
}
