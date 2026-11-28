import type { WorksheetPage } from '@/math/types'

// Two rows leave room for the worksheet heading, materials and footer on A4.
const MAX_ILLUSTRATED_STEPS = 6

export function paginateAcmWorksheet(worksheet: WorksheetPage): WorksheetPage[] {
  const hasIllustrations = worksheet.blocks.some(({ items }) => {
    const activity = items[0]?.acm
    return activity?.stepImages && activity.stepImages.length === activity.steps.length
  })
  if (!hasIllustrations) return [worksheet]

  const pages = worksheet.blocks.flatMap((block, sourceBlockIndex) => {
    const source = { ...block, sourceBlockIndex }
    const item = block.items[0]
    const activity = item?.acm
    if (!activity?.stepImages || activity.stepImages.length !== activity.steps.length ||
        activity.steps.length <= MAX_ILLUSTRATED_STEPS) {
      return [{ ...worksheet, blocks: [source], items: source.items }]
    }

    const illustrations = activity.stepImages
    const pageCount = Math.ceil(activity.steps.length / MAX_ILLUSTRATED_STEPS)
    const stepsPerPage = Math.ceil(activity.steps.length / pageCount)
    return Array.from({ length: pageCount }, (_, index) => {
      const offset = index * stepsPerPage
      const end = offset + stepsPerPage
      const title = index ? `${activity.title} (suite)` : activity.title
      const items = [{
        ...item,
        acmStepOffset: offset,
        acm: { ...activity, title, steps: activity.steps.slice(offset, end), stepImages: illustrations.slice(offset, end) },
      }]
      const section = { ...source, title, items, instruction: index ? '' : source.instruction }
      return { ...worksheet, blocks: [section], items }
    })
  })
  return pages.map((page, index) => ({ ...page, isContinuation: index > 0 }))
}
