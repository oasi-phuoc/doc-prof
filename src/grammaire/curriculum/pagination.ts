import type { MathItem, WorksheetBlock, WorksheetPage } from '@/math/types'
import { headingForSlice } from '@/math/page-break-heading'

/** Conservative portrait A4 budget, including answer explanations in the corrigé. */
function cost(item: MathItem): number {
  const q=item.grammar
  if (!q) return 0
  if (q.presentation==='match') return 70
  if (q.presentation==='correct') return 38
  if (q.presentation==='order') return 40
  return q.presentation==='choice'?32:23
}
export function splitGradedGrammarPages(page: WorksheetPage): WorksheetPage[] | null {
  if (!page.blocks.some(b=>b.items.some(i=>i.layout==='grammar'))) return null
  const groups:WorksheetBlock[][]=[]
  page.blocks.forEach((block,index)=>{
    const sourceBlockIndex=block.sourceBlockIndex??index
    if (!block.items.some(i=>i.layout==='grammar')) {
      groups.push([{...block,sourceBlockIndex}])
      return
    }
    let start=0,used=0
    const push=(end:number)=>groups.push([{...block,...headingForSlice(block,start,block.items),columns:1,
      sourceBlockIndex,itemOffset:(block.itemOffset??0)+start,items:block.items.slice(start,end)}])
    block.items.forEach((item,i)=>{
      const size=cost(item)
      if (used+size>160 && i>start) {push(i);start=i;used=0}
      used+=size
    })
    if (start<block.items.length) push(block.items.length)
  })
  return groups.map((blocks,index)=>({...page,blocks,items:blocks.flatMap(b=>b.items),
    isContinuation:Boolean(page.isContinuation)||index>0}))
}
