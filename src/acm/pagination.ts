import type { WorksheetPage } from '@/math/types'

// Keep two rows on A4. Long instructions and photo briefs need wider columns.
const MAX_PHOTO_STEPS = 6
const MAX_DETAILED_STEPS = 4

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
    if (!activity?.stepImages || activity.stepImages.length !== activity.steps.length) {
      return [{ ...worksheet, blocks: [source], items: source.items }]
    }

    const illustrations = activity.stepImages
    const detailed = illustrations.some((visual) => 'brief' in visual) ||
      activity.steps.some((step) => step.length > 160)
    const maxSteps = detailed ? MAX_DETAILED_STEPS : MAX_PHOTO_STEPS
    if (activity.steps.length <= maxSteps) return [{ ...worksheet, blocks: [source], items: source.items }]

    const pageCount = Math.ceil(activity.steps.length / maxSteps)
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
