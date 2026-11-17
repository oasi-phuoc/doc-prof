import type { MathItem, WorksheetBlock, WorksheetPage } from '@/math/types'
import { headingForSlice } from '@/math/page-break-heading'

/** Cut inside audio frames without redrawing choices or changing question indexes. */
export function splitTcfAudioQuestionPages(page: WorksheetPage): WorksheetPage[] | null {
  const hasCuts = page.blocks.some(block => block.items.some(item =>
    item.tcf?.kind === 'audio_cadre' && item.tcf.questions.some(q =>
      q.formModeIndex != null && q.formModeIndex > 1 && block.tcfQuestionPageBreakBefore?.includes(q.formModeIndex))))
  if (!hasCuts) return null
  const pages: WorksheetPage[] = []
  let blocks: WorksheetBlock[] = []
  const flushPage = () => {
    if (!blocks.length) return
    pages.push({ ...page, blocks, items: blocks.flatMap(block => block.items), isContinuation: pages.length > 0 })
    blocks = []
  }
  page.blocks.forEach((block, blockIndex) => {
    let chunk: MathItem[] = [], offset = 0, continued = false
    const flushBlock = () => {
      if (!chunk.length) return
      blocks.push({ ...block, ...headingForSlice(block, continued ? Math.max(1, offset) : 0, block.items),
        items: chunk, itemOffset: offset, sourceBlockIndex: block.sourceBlockIndex ?? blockIndex })
      chunk = []
      continued = true
    }
    block.items.forEach((item, itemIndex) => {
      const frame = item.tcf
      if (frame?.kind === 'audio_cadre') {
        let questions: typeof frame.questions = []
        const appendFrame = () => {
          if (!questions.length) return
          if (!chunk.length) offset = itemIndex
          chunk.push({ ...item, tcf: { ...frame, questions,
            startsInsideAudio: frame.startsInsideAudio || questions[0] !== frame.questions[0] },
            answer: questions.map(q => q.answer).filter(Boolean).join(' · '),
            points: questions.reduce((sum, q) => sum + (q.points ?? 1), 0) })
          questions = []
        }
        frame.questions.forEach(q => {
          if (q.formModeIndex != null && q.formModeIndex > 1 && block.tcfQuestionPageBreakBefore?.includes(q.formModeIndex)) {
            appendFrame(); flushBlock(); flushPage()
          }
          questions.push(q)
        })
        appendFrame()
      } else {
        if (!chunk.length) offset = itemIndex
        chunk.push(item)
      }
      if (block.tcfPageBreakAfter?.[itemIndex] && itemIndex < block.items.length - 1) {
        flushBlock(); flushPage()
      }
    })
    flushBlock()
  })
  flushPage()
  return pages
}
