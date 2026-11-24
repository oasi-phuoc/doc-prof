import type { MathItem, WorksheetBlock, WorksheetPage } from '@/math/types'
import { headingForSlice } from '@/math/page-break-heading'
import { grammarReadingSlices } from './reading-pages'
import { grammarScenarioSlices } from './scenario-pages'

/** Conservative portrait A4 budget, including answer explanations in the corrigé. */
function cost(item: MathItem): number {
  const q=item.grammar
  if (!q) return 0
  // Future clauses keep their temporal facts and full corrections together.
  if(/^gram-ex-(?:futur-proche|futur-simple|futur-proche-ou-simple|futur-anterieur|hypothese-futur)-/.test(q.unit.source.typeId))return 160
  // Full verbal groups, explicit time anchors and their corrections stay together.
  if(/^gram-ex-j[123]-/.test(q.unit.source.typeId))return 160
  if(/^gram-ex-g[1-6]-/.test(q.unit.source.typeId))return q.unit.kind==='completion'&&!q.unit.imageSupports?.length&&!(q.unit.source.typeId==='gram-ex-g6-qcm-verbe'&&q.unit.source.partition==='a2')?80:160
  if(/^gram-ex-(?:pc-idee|pc-avoir|pc-etre|imparfait|pqp|double-aux|pc-pronominaux|accord-pp)-(?:qcm-|curriculum-)/.test(q.unit.source.typeId))return q.unit.kind==='completion'&&['gram-ex-pc-avoir-qcm-conj','gram-ex-imparfait-qcm-conj'].includes(q.unit.source.typeId)?80:160
  if(/^gram-ex-i[12356789]-/.test(q.unit.source.typeId))return q.unit.kind==='completion'&&!/^gram-ex-i[89]-/.test(q.unit.source.typeId)?80:160
  // Advice roles, imperative cues and full corrections stay together on A4.
  if(/^gram-ex-f1[01]-/.test(q.unit.source.typeId))return 160
  // Three-candidate facts, decision criteria and illustrated portraits retain
  // their full correction and answer area on the first A4 sheet too.
  if(/^gram-ex-(?:f13|f14|description-physique)-/.test(q.unit.source.typeId))return 160
  // A2 order corrections retain the context and the full meaning explanation.
  if(q.unit.source.typeId.startsWith('gram-ex-f12-'))return q.unit.kind==='correct'||q.unit.kind==='transform'||q.unit.kind==='order'&&q.unit.source.partition==='a2'?160:80
  // A2 compares multiple options and criteria; reserve a full A4 block.
  if(q.unit.source.typeId.startsWith('gram-ex-f9-'))return q.unit.kind==='completion'&&q.unit.source.partition==='a1'?80:160
  // Descriptions keep contextual pairs, illustrations and open rubrics together.
  if(/^gram-ex-f[45678]-/.test(q.unit.source.typeId)) {
    if(q.unit.imageSupports?.length||q.unit.kind==='production'||q.unit.kind==='match'||q.unit.kind==='transform'&&q.unit.source.typeId!=='gram-ex-f7-curriculum-t')return 160
    return 80
  }
  // Contextual requests and two-situation associations need full corrections on A4.
  if(q.unit.source.typeId.startsWith('gram-ex-f3-'))return 160
  if(/^gram-ex-f[12]-/.test(q.unit.source.typeId)) {
    if(q.unit.kind==='production'||q.unit.kind==='match')return 160
    return 80
  }
  // Temporal contexts, clauses and full rubrics need space in both student and correction layouts.
  if(/^gram-ex-e[2345]-/.test(q.unit.source.typeId)) {
    if(q.unit.imageSupports?.length||q.unit.kind==='production'||q.unit.kind==='transform'||q.unit.kind==='order'&&q.unit.tokenUnit==='clause')return 160
    return q.unit.kind==='match'?120:80
  }
  // A2 tonic references need the context, the target group and a full corrected sentence.
  // Full contexts and alternative directions need one A4 block per transformation.
  if(q.unit.source.typeId==='gram-ex-e6-curriculum-t')return 160
  if(q.unit.source.typeId==='gram-ex-e7-curriculum-a')return 120
  if(q.unit.source.typeId.startsWith('gram-ex-d3-')&&q.unit.source.partition==='a2')return q.presentation==='transform'?160:80
  if(q.unit.source.typeId.startsWith('gram-ex-c4-')&&q.unit.kind!=='production')return q.presentation==='gap'?60:80
  if(q.unit.source.typeId==='gram-ex-c1-curriculum-complete'||q.unit.source.typeId==='gram-ex-c1-curriculum-o')return 80
  if(['gram-ex-c2-curriculum-complete','gram-ex-c3-curriculum-complete'].includes(q.unit.source.typeId))return q.presentation==='choice'?70:55
  if (q.unit.kind==='form') return 160
  // The correction includes a non-exclusive model and the full teacher rubric.
  if (q.unit.kind==='personal-gap') return 160
  if (q.unit.kind==='completion'&&q.unit.prompt.includes('\n')) return q.presentation==='choice'?50:40
  if (q.unit.imageSupports?.length) return 160
  if (q.unit.kind==='production') return 160
  const long=q.unit.responseLines===2
  if (q.presentation==='match') {
    if(q.unit.source.typeId==='gram-ex-famille-curriculum-a')return 120
    const longSet=q.unit.kind==='match' && q.unit.pairs.length>=3 && q.unit.pairs.reduce((n,p)=>n+p.left.length,0)>260
    return longSet?90:70
  }
  if (q.presentation==='transform') return 58
  if (q.presentation==='correct') return long?55:38
  if (q.presentation==='order') return long?55:q.unit.cue?(q.unit.cue.length>50?60:50):40
  if (q.unit.reference) return 45
  if (q.unit.countryGender) return q.presentation==='choice'?40:35
  // Register and context cues need room even when no infinitive is supplied.
  if (q.unit.cue) {
    if (q.presentation==='choice') return 45
    if (q.presentation==='gap') return q.unit.explanation.length>90 || q.unit.cue.length>80 ? 45 : 34
  }
  // Include the longest spelling explanation in the corrigé, not only the gap.
  if (q.unit.givenVerb) return q.presentation==='choice'?45:34
  // Destination rules can wrap even without an infinitive hint. Reserve room
  // for those extra correction lines on both student and correction pages.
  const explanationExtra=Math.max(0,Math.ceil((q.unit.explanation.length-90)/70))*7
  return (q.presentation==='choice'?40:28)+explanationExtra
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
