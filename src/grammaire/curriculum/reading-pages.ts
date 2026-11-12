import type {WorksheetBlock} from '@/math/types'
import {headingForSlice} from '@/math/page-break-heading'
import {grammarReadingChild,grammarReadingSupport} from './items'

/** A document and its questions stay linked, including on continuation sheets. */
export function grammarReadingSlices(block:WorksheetBlock,sourceBlockIndex:number): WorksheetBlock[] | null {
  if (!block.items.some(i=>i.grammar?.unit.kind==='reading')) return null
  const result:WorksheetBlock[]=[]
  let first=true
  for (let start=0;start<block.items.length;) {
    const support=block.items[start]!,q=support.grammar
    if (!q || q.unit.kind!=='reading' || q.readingPart?.kind!=='support') return null
    let end=start+1
    while (end<block.items.length && block.items[end]!.grammar?.readingPart?.kind==='question') end++
    const questions=block.items.slice(start+1,end)
    const supportCost=80+Math.max(0,q.unit.text.split(/\s+/).length-100)*.25+(q.unit.imageSupports?.length?45:0)
    let pending:typeof questions=[],used=supportCost,offset=start,continued=false
    const push=()=>{
      if (!pending.length) return
      result.push({...block,...headingForSlice(block,first?0:offset||1,block.items),columns:1,sourceBlockIndex,
        itemOffset:(block.itemOffset??0)+offset,
        items:[grammarReadingSupport(q,q.readingPart!.kind==='support'?q.readingPart!.documentNumber:1,continued),...pending]})
      first=false;continued=true;pending=[];used=supportCost
    }
    questions.forEach((item,index)=>{
      const child=item.grammar?grammarReadingChild(item.grammar):undefined
      const cost=child?.response==='choice'?65:50
      // Continuations have no exercise heading and retain the same font size.
      if (used+cost>(first?160:180) && pending.length) {push();offset=start+index}
      pending.push(item);used+=cost
      if (child && block.grammarPageBreakAfterQuestionIds?.includes(child.id)) {push();offset=start+index+1}
    })
    push();start=end
  }
  return result
}
