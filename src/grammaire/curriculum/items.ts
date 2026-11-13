import type {MathItem} from '@/math/types'
import type {GrammarQuestion,GrammarSnapshot} from './types'

export function grammarReadingChild(q: GrammarQuestion) {
  const part=q.readingPart
  return q.unit.kind==='reading' && part?.kind==='question'?q.unit.questions.find(child=>child.id===part.questionId):undefined
}
export function grammarReadingSupport(q: GrammarQuestion,documentNumber:number,continued=false): MathItem {
  return {layout:'grammar',prompt:q.unit.prompt,answer:'',hideItemNumber:true,noPoints:true,
    grammar:{...q,readingPart:{kind:'support',documentNumber,...(continued?{continued:true}:{})}}}
}
export function grammarScenarioSupport(q:GrammarQuestion,scenarioNumber:number,continued=false):MathItem {
  return {layout:'grammar',prompt:q.unit.prompt,answer:'',hideItemNumber:true,noPoints:true,
    grammar:{...q,scenarioPart:{kind:'support',scenarioNumber,...(continued?{continued:true}:{})}}}
}
/** Expansion is deterministic. The frozen recipe retains each document once. */
export function grammarItems(selection:GrammarSnapshot): MathItem[] {
  return selection.questions.flatMap((q,documentIndex):MathItem[]=>{
    if(q.unit.kind==='scenario'&&q.unit.contract==='closed')return [grammarScenarioSupport(q,documentIndex+1),...q.unit.questions.map((child,index):MathItem=>({
      layout:'grammar',prompt:q.unit.prompt,answer:child.answers[0]!,grammar:{...q,scenarioPart:{kind:'question',questionId:child.id,number:index+1}},
    }))]
    if (q.unit.kind!=='reading') return [{layout:'grammar',prompt:q.unit.prompt,answer:q.unit.answers[0]!,grammar:q}]
    return [grammarReadingSupport(q,documentIndex+1),...q.unit.questions.map((child,index):MathItem=>({
      layout:'grammar',prompt:child.prompt,answer:child.answers[0]!,
      grammar:{...q,readingPart:{kind:'question',questionId:child.id,number:index+1}},
    }))]
  })
}
