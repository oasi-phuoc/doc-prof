import type {WorksheetBlock,WorksheetPage} from '@/math/types'
import {headingForSlice} from '@/math/page-break-heading'

/** Keep a picture row and its handwriting line together; leave extra room for dense clues. */
export function splitPhraseImagePages(page:WorksheetPage):WorksheetPage[]|null {
  if(!page.blocks.some(block=>block.items.some(item=>item.layout==='phrase-images')))return null
  const pages:WorksheetPage[]=[],pending:WorksheetBlock[]=[]
  const flush=()=>{if(pending.length){const blocks=pending.splice(0);pages.push({...page,blocks,items:blocks.flatMap(block=>block.items),isContinuation:pages.length>0})}}
  page.blocks.forEach((block,index)=>{
    if(!block.items.length||!block.items.every(item=>item.layout==='phrase-images')){pending.push({...block,sourceBlockIndex:index});return}
    flush()
    const capacity=block.items.some(item=>(item.phraseImages?.length??0)>6||item.phraseImageLabels&&item.phraseImages?.some(clue=>clue.label.length>12))?2:3
    for(let offset=0;offset<block.items.length;offset+=capacity){const items=block.items.slice(offset,offset+capacity);pages.push({...page,items,blocks:[{...block,...headingForSlice(block,offset,block.items),items,itemOffset:offset,sourceBlockIndex:index}],isContinuation:pages.length>0})}
  })
  flush();return pages.length>1?pages:null
}
