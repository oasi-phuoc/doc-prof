import type { GrammarQuestion, GrammarSnapshot, GrammarUnit } from './types'

const text=(v:unknown):v is string=>typeof v==='string'&&v.trim().length>0
const record=(v:unknown):v is Record<string,unknown>=>!!v&&typeof v==='object'&&!Array.isArray(v)
const unique=(v:string[])=>new Set(v).size===v.length
const key=(v:string)=>v.normalize('NFC').trim().replace(/\s+/g,' ')
export function validGrammarScenario(v:Record<string,unknown>): boolean {
  if (!text(v.situation)||!Array.isArray(v.roles)||v.roles.length<2||v.roles.length>4||
    !v.roles.every(r=>record(r)&&text(r.id)&&text(r.label)&&text(r.goal))||!unique(v.roles.map(r=>r.id))||
    !Array.isArray(v.turns)||v.turns.length<1||v.turns.length>10||
    !v.turns.every(t=>record(t)&&text(t.id)&&text(t.text)&&v.roles instanceof Array&&v.roles.some(r=>r.id===t.roleId))||!unique(v.turns.map(t=>t.id))) return false
  if (v.contract==='open') return text(v.task)&&Array.isArray(v.rubric)&&v.rubric.length>=3&&v.rubric.length<=8&&
    v.rubric.every(r=>record(r)&&text(r.id)&&text(r.label))&&unique(v.rubric.map(r=>r.id))&&
    Array.isArray(v.followUps)&&v.followUps.length>=1&&v.followUps.length<=5&&v.followUps.every(text)&&
    Number.isInteger(v.writeLines)&&Number(v.writeLines)>=0&&Number(v.writeLines)<=6&&
    v.turns.every(t=>t.questionId===undefined&&!t.text.includes('___'))&&v.questions===undefined
  if (v.contract!=='closed'||!Array.isArray(v.questions)||!v.questions.length||v.questions.length>6||
    !v.questions.every(q=>record(q)&&text(q.id)&&Array.isArray(q.answers)&&q.answers.length>0&&q.answers.every(text)&&text(q.explanation))||
    !unique(v.questions.map(q=>q.id))) return false
  for (const q of v.questions) {
    if (v.turns.filter(t=>t.questionId===q.id).length!==1) return false
    if (q.response==='gap') {if(q.options!==undefined)return false;continue}
    if (q.response!=='choice'||!Array.isArray(q.options)||q.options.length<2||q.options.length>6||
      !q.options.every((o:unknown)=>record(o)&&text(o.id)&&text(o.text))||
      !unique(q.options.map((o:{id:string})=>o.id))||!unique(q.options.map((o:{text:string})=>key(o.text)))||
      q.options.filter((o:{text:string})=>q.answers.some((a:string)=>key(a)===key(o.text))).length!==1) return false
  }
  return v.turns.every(t=>t.questionId===undefined?!t.text.includes('___'):
    v.questions instanceof Array&&v.questions.some(q=>q.id===t.questionId)&&t.text.split('___').length===2)
}

export function grammarScenarioChild(q:GrammarQuestion) {
  const part=q.scenarioPart
  return q.unit.kind==='scenario'&&q.unit.contract==='closed'&&part?.kind==='question'?
    q.unit.questions.find(c=>c.id===part.questionId):undefined
}
export function grammarScenarioContext(u:Extract<GrammarUnit,{kind:'scenario'}>):string {
  return [u.prompt,u.situation,...u.roles.map(r=>`${r.label} : ${r.goal}`),
    ...u.turns.map(t=>`${u.roles.find(r=>r.id===t.roleId)!.label} : ${t.text}`)].join('\n')
}
export function grammarGroups(questions:GrammarQuestion[],presentation:GrammarSnapshot['presentation']):GrammarSnapshot['groups'] {
  if (presentation!=='document-set'&&presentation!=='scenario-set') return undefined
  return questions.map(q=>({id:q.id,kind:presentation==='document-set'?'document':'situation',supportIds:[q.id],
    questionIds:q.unit.kind==='reading'||q.unit.kind==='scenario'&&q.unit.contract==='closed'?q.unit.questions.map(c=>c.id):[q.id]}))
}
