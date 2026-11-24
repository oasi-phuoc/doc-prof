import type { MathItem, WorksheetBlock, WorksheetPage } from '@/math/types'
import { headingForSlice } from '@/math/page-break-heading'
import { grammarReadingSupport, grammarScenarioSupport } from './items'

/** Stable keys cover simple questions, open tasks and document/dialogue children. */
export function grammarPageBreakQuestionId(item: MathItem): string | undefined {
  const q=item.grammar
  if (!q) return undefined
  const part=q.readingPart??q.scenarioPart
  return part ? part.kind==='question'?part.questionId:undefined : q.id
}

function repeatedSupport(block: WorksheetBlock, start: number): MathItem[] {
  const next=block.items[start]?.grammar,part=next?.readingPart??next?.scenarioPart
  if (!next||part?.kind!=='question') return []
  const support=block.items.slice(0,start).reverse().find(item=>{
    const q=item.grammar,p=q?.readingPart??q?.scenarioPart
    return q?.id===next.id&&p?.kind==='support'
  })?.grammar
  if (support?.readingPart?.kind==='support') return [grammarReadingSupport(support,support.readingPart.documentNumber,true)]
  if (support?.scenarioPart?.kind==='support') return [grammarScenarioSupport(support,support.scenarioPart.scenarioNumber,true)]
  return []
}

/** Keep the whole exercise together, even when it exceeds A4. Only user cuts split it. */
export function splitGradedGrammarPages(page: WorksheetPage): WorksheetPage[] | null {
  if (page.domain!=='grammaire') return null
  const groups: WorksheetBlock[][]=[]
  let current: WorksheetBlock[]=[]
  for (const [blockIndex,block] of page.blocks.entries()) {
    const isExercise=block.exerciseType.startsWith('gram-ex-')
    const cuts=isExercise?block.items.flatMap((item,index)=>{
      const id=grammarPageBreakQuestionId(item)
      const selected=item.grammar ? id&&block.grammarPageBreakAfterQuestionIds?.includes(id) : block.tcfPageBreakAfter?.[index]
      return selected?[index+1]:[]
    }):[]
    let start=0
    for (const end of [...new Set([...cuts,block.items.length])]) {
      if (end<=start) continue
      const items=[...repeatedSupport(block,start),...block.items.slice(start,end)]
      current.push({...block,...headingForSlice(block,start,block.items),sourceBlockIndex:block.sourceBlockIndex??blockIndex,
        itemOffset:(block.itemOffset??0)+start,items})
      if (cuts.includes(end)) {groups.push(current);current=[]}
      start=end
    }
  }
  if (current.length) groups.push(current)
  if (groups.length<=1) return null
  return groups.map((blocks,index)=>({...page,blocks,items:blocks.flatMap(b=>b.items),
    isContinuation:Boolean(page.isContinuation)||index>0}))
}
