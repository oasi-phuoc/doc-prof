import { createRng, shuffle } from '@/math/rng'
import type { GrammarPresentation, GrammarQuestion, GrammarUnit } from './types'

/** Per-unit substream shared by banks and technical fixtures; no rendering draws. */
export function createGrammarQuestion(unit:GrammarUnit,presentation:GrammarPresentation,seed:number):GrammarQuestion {
  let hash=seed|0
  for (const c of unit.id) hash=Math.imul(hash^c.charCodeAt(0),16777619)
  const local=createRng(hash>>>0),question:GrammarQuestion={id:unit.id,presentation,unit}
  if (unit.kind==='completion'&&presentation==='choice')question.options=shuffle(local,unit.options)
  if (unit.kind==='order') {
    question.tokens=shuffle(local,unit.tokens)
    if (question.tokens.every((t,i)=>t.text===unit.tokens[i]!.text))question.tokens.push(question.tokens.shift()!)
  }
  if(unit.kind==='match')question.rightOptions=shuffle(local,unit.pairs.map(p=>({id:p.id,text:p.right})))
  if(unit.kind==='reading')question.readingOptions=Object.fromEntries(unit.questions.filter(c=>c.response==='choice').map(c=>[c.id,shuffle(local,c.options!)]))
  if(unit.kind==='scenario'&&unit.contract==='closed')question.scenarioOptions=Object.fromEntries(unit.questions.filter(c=>c.response==='choice').map(c=>[c.id,shuffle(local,c.options!)]))
  return question
}
