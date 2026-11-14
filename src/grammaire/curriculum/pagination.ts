import type { MathItem, WorksheetBlock, WorksheetPage } from '@/math/types'
import { headingForSlice } from '@/math/page-break-heading'
import { grammarReadingSlices } from './reading-pages'
import { grammarScenarioSlices } from './scenario-pages'

/** Conservative portrait A4 budget, including answer explanations in the corrigé. */
function cost(item: MathItem): number {
  const q=item.grammar
  if (!q) return 0
  if (q.unit.imageSupports?.length) return 160
  if (q.unit.kind==='production') return 160
  const long=q.unit.responseLines===2
  if (q.presentation==='match') return 70
  if (q.presentation==='transform') return 58
  if (q.presentation==='correct') return long?55:38
  if (q.presentation==='order') return long?55:40
  if (q.unit.reference) return 45
  // Contextual cues also consume vertical space when the correction is short.
  if (q.presentation==='gap' && q.unit.cue && (q.unit.explanation.length>90 || q.unit.cue.length>80)) return 45
  // Include the longest spelling explanation in the corrigé, not only the gap.
  if (q.unit.givenVerb) return q.presentation==='choice'?45:34
  // Destination rules can wrap even without an infinitive hint. Reserve room
  // for those extra correction lines on both student and correction pages.
  const explanationExtra=Math.max(0,Math.ceil((q.unit.explanation.length-90)/70))*7
  return (q.presentation==='choice'?32:23)+explanationExtra
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
    const reading=grammarReadingSlices(block,sourceBlockIndex)
    if (reading) {groups.push(...reading.map(slice=>[slice]));return}
    const scenarios=grammarScenarioSlices(block,sourceBlockIndex)
    if (scenarios) {groups.push(...scenarios.map(slice=>[slice]));return}
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
