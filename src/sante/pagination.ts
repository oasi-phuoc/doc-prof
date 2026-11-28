import type { WorksheetBlock, WorksheetPage } from '@/math/types'
import { splitTcfAudioQuestionPages } from '@/tcf/audio-question-pages'

function withSantePageBreaks(block: WorksheetBlock): WorksheetBlock {
  const supportIndex = block.items.findIndex((item) => item.tcf?.kind === 'support')
  const support = block.items[supportIndex]?.tcf
  if (support?.kind === 'support' && support.exercise.competence === 'CE') {
    const questionsOnFirstPage = support.exercise.niveau === 'A2-B1' ? 1 : 2
    const cutAfter = supportIndex + questionsOnFirstPage
    if (cutAfter < block.items.length - 1) {
      return { ...block, tcfPageBreakAfter: block.items.map((_, index) => index === cutAfter) }
    }
  }
  if (support?.kind === 'support' && support.exercise.competence === 'CO') {
    const frame = block.items.find((item) => item.tcf?.kind === 'audio_cadre')?.tcf
    const nextIndex = frame?.kind === 'audio_cadre' ? frame.questions[4]?.formModeIndex : undefined
    if (nextIndex != null) return { ...block, tcfQuestionPageBreakBefore: [nextIndex] }
  }
  return block
}

/** Une activité Santé garde son document et ses questions même si elle s’étend sur deux feuilles. */
export function paginateSanteWorksheet(worksheet: WorksheetPage): WorksheetPage[] {
  const pages = worksheet.blocks.flatMap((source, sourceBlockIndex) => {
    const block = withSantePageBreaks({ ...source, sourceBlockIndex })
    const page = { ...worksheet, blocks: [block], items: block.items }
    return splitTcfAudioQuestionPages(page, true) ?? [page]
  })
  return pages.map((page, index) => ({ ...page, isContinuation: index > 0 }))
}
