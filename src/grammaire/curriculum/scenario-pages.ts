import type { WorksheetBlock } from '@/math/types'
import { headingForSlice } from '@/math/page-break-heading'
import { grammarScenarioChild } from './scenario'
import { grammarScenarioSupport } from './items'

/** Closed dialogues repeat their roles and source turns on continuation sheets. */
export function grammarScenarioSlices(block:WorksheetBlock,sourceBlockIndex:number):WorksheetBlock[]|null {
  if(!block.items.some(i=>i.grammar?.unit.kind==='scenario'))return null
  const result:WorksheetBlock[]=[]
  let first=true
  for(let start=0;start<block.items.length;) {
    const item=block.items[start]!,q=item.grammar
    if(!q||q.unit.kind!=='scenario')return null
    if(q.unit.contract==='open') {
      result.push({...block,...headingForSlice(block,first?0:start||1,block.items),columns:1,sourceBlockIndex,itemOffset:(block.itemOffset??0)+start,items:[item]})
      first=false;start++;continue
    }
    if(q.scenarioPart?.kind!=='support')return null
    let end=start+1
    while(end<block.items.length&&block.items[end]!.grammar?.scenarioPart?.kind==='question')end++
    const children=block.items.slice(start+1,end)
    const supportCost=70+q.unit.turns.length*3+(q.unit.imageSupports?.length?45:0)
    let pending:typeof children=[],used=supportCost,offset=start,continued=false
    const push=()=>{
      if(!pending.length)return
      result.push({...block,...headingForSlice(block,first?0:offset||1,block.items),columns:1,sourceBlockIndex,itemOffset:(block.itemOffset??0)+offset,
        items:[grammarScenarioSupport(q,q.scenarioPart!.kind==='support'?q.scenarioPart!.scenarioNumber:1,continued),...pending]})
      first=false;continued=true;pending=[];used=supportCost
    }
    children.forEach((entry,index)=>{
      const child=entry.grammar?grammarScenarioChild(entry.grammar):undefined,cost=child?.response==='choice'?50:35
      if(used+cost>(first?160:180)&&pending.length){push();offset=start+index}
      pending.push(entry);used+=cost
      if(child&&block.grammarPageBreakAfterQuestionIds?.includes(child.id)){push();offset=start+index+1}
    })
    push();start=end
  }
  return result
}
