import { GRAMMAR_PRESENTATIONS, GrammarCurriculumError, type GrammarBank, type GrammarQuestion, type GrammarReadingQuestion, type GrammarSnapshot, type GrammarUnit } from './types'
import { consistentGrammarImages, validGrammarImage } from './image-support'
import { grammarGroups, validGrammarScenario } from './scenario'

const text = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0
const record = (v: unknown): v is Record<string, unknown> => v !== null && typeof v === 'object' && !Array.isArray(v)
const strings = (v: unknown): v is string[] => Array.isArray(v) && v.length > 0 && v.every(text)
const unique = (values: string[]) => new Set(values).size === values.length
const categories = ['pronom','verbe','nom','determinant','adjectif','adverbe','preposition','conjonction','negation','interjection']
const key = (value: string) => value.normalize('NFC').trim().replace(/\s+/g, ' ')
const choices = (v: unknown) => Array.isArray(v) && v.length >= 2 && v.length <= 6 &&
  v.every(c=>record(c) && text(c.id) && text(c.text)) && unique(v.map(c=>c.id)) && unique(v.map(c=>key(c.text)))

function sameChoices(value: unknown, source: Array<{id:string;text:string}>): boolean {
  return choices(value) && (value as typeof source).length===source.length &&
    (value as typeof source).every(c=>source.some(o=>o.id===c.id&&o.text===c.text))
}
export function validGrammarReadingQuestion(value: unknown, document: string): value is GrammarReadingQuestion {
  if (!record(value) || !text(value.id) || !text(value.prompt) || !strings(value.answers) || !text(value.explanation) ||
    !strings(value.evidence) || !value.evidence.every(quote=>document.includes(quote))) return false
  if (value.response==='short') return value.options===undefined
  return value.response==='choice' && choices(value.options) &&
    (value.options as Array<{text:string}>).filter(c=>(value.answers as string[]).some(a=>key(a)===key(c.text))).length===1
}

export function validGrammarUnit(value: unknown): value is GrammarUnit {
  if (!record(value) || !text(value.id) || !text(value.prompt) || !(value.kind==='reading'||value.kind==='scenario'&&value.contract==='closed'?Array.isArray(value.answers)&&value.answers.length===0:strings(value.answers)) ||
    !text(value.explanation) || !record(value.source) || !text(value.source.path) ||
    !text(value.source.typeId) || !Number.isInteger(value.source.position) || Number(value.source.position)<0) return false
  if (value.givenVerb!==undefined && !text(value.givenVerb) || value.cue!==undefined && !text(value.cue) ||
    value.responseLines!==undefined && value.responseLines!==1 && value.responseLines!==2) return false
  if (value.reference!==undefined && (!record(value.reference)||!text(value.reference.text)||
    !['masculine','feminine'].includes(String(value.reference.gender))||!['singular','plural'].includes(String(value.reference.number)))) return false
  if (value.imageSupports!==undefined && (!Array.isArray(value.imageSupports)||!value.imageSupports.length||value.imageSupports.length>3||
    !value.imageSupports.every(validGrammarImage)||!unique(value.imageSupports.map(s=>s.id))||!unique(value.imageSupports.map(s=>s.src)))) return false
  if (value.kind==='scenario') return validGrammarScenario(value)
  if (value.kind==='completion') return choices(value.options) && value.prompt.split('___').length===2 &&
    (value.options as Array<{text:string}>).filter(c=>(value.answers as string[]).some(answer=>key(c.text)===key(answer))).length===1
  if (value.kind==='correct') {
    if (value.error!==undefined) {
      const e=value.error,prompt=value.prompt as string
      if (!record(e)||e.segmentId!=='prompt'||!Number.isInteger(e.start)||!Number.isInteger(e.end)||
        Number(e.start)<0||Number(e.end)<=Number(e.start)||Number(e.end)>prompt.length||!text(e.text)||
        prompt.normalize('NFC')!==prompt||prompt.slice(Number(e.start),Number(e.end))!==e.text) return false
    }
    return (value.answers as string[]).every(answer=>key(answer)!==key(value.prompt as string))
  }
  if (value.kind==='transform') return (text(value.targetSubject) && value.directive===undefined ||
    text(value.directive) && value.targetSubject===undefined) && (value.answers as string[]).every(answer=>key(answer)!==key(value.prompt as string))
  if (value.kind==='order') return Array.isArray(value.tokens) && value.tokens.length>=2 && value.tokens.length<=32 &&
    value.tokens.every(t=>record(t)&&text(t.id)&&text(t.text)&&categories.includes(String(t.category))) && unique(value.tokens.map(t=>t.id)) &&
    new Set(value.tokens.map(t=>t.text)).size>1
  if (value.kind==='match') return Array.isArray(value.pairs) && value.pairs.length>=2 && value.pairs.length<=6 &&
    value.pairs.every(p=>record(p)&&text(p.id)&&text(p.left)&&text(p.right)&&text(p.sourceId)) &&
    unique(value.pairs.map(p=>p.id)) && unique(value.pairs.map(p=>key(p.left))) && unique(value.pairs.map(p=>key(p.right)))
  if (value.kind==='reading') return text(value.genre) && text(value.text) && Array.isArray(value.questions) &&
    value.questions.length>=3 && value.questions.length<=8 && value.questions.every(q=>validGrammarReadingQuestion(q,value.text as string)) &&
    unique(value.questions.map(q=>q.id))
  if (value.kind==='production') return ['written','oral'].includes(String(value.mode)) && text(value.task) &&
    Array.isArray(value.rubric) && value.rubric.length>=3 && value.rubric.length<=8 &&
    value.rubric.every(r=>record(r)&&text(r.id)&&text(r.label)) && unique(value.rubric.map(r=>r.id)) &&
    Number.isInteger(value.writeLines) && Number(value.writeLines)>=(value.mode==='written'?1:0) && Number(value.writeLines)<=10
  return false
}

export function assertGrammarBank(bank: GrammarBank): void {
  const fail = () => { throw new GrammarCurriculumError('GRAMMAR_BANK_INVALID',`Banque grammaticale invalide : ${bank.activityId}.`) }
  if (bank.schemaVersion!==1 || !text(bank.revision) || !text(bank.activityId) || !['A1','A2','B1'].includes(bank.level) ||
    !Array.isArray(bank.units) || bank.units.length<(bank.presentations.includes('document-set')?20:50) || !bank.units.every(validGrammarUnit) || !unique(bank.units.map(u=>u.id))) fail()
  if (bank.presentations.includes('document-set') && bank.units.reduce((n,u)=>n+(u.kind==='reading'?u.questions.length:0),0)<50) fail()
  if (!unique([...bank.units.map(u=>u.id),...bank.units.flatMap(u=>u.kind==='reading'||u.kind==='scenario'&&u.contract==='closed'?u.questions.map(q=>q.id):[])])) fail()
  if(!consistentGrammarImages(bank.units))fail()
  const meanings=bank.units.map(u=>key(u.kind==='reading'?u.text:u.kind==='scenario'?u.situation+'|'+u.turns.map(t=>t.text).join('|'):u.kind==='order'?u.answers[0]!:u.kind==='match'?u.pairs.map(p=>p.left).sort().join('|'):u.prompt))
  if (!unique(meanings) || !bank.presentations.length || bank.presentations.some(p=>!text(bank.instructions[p]))) fail()
  for (const p of bank.presentations) if (bank.units.some(u=>
    p==='choice'||p==='gap' ? u.kind!=='completion' : p==='document-set'?u.kind!=='reading':p==='scenario-set'?u.kind!=='scenario':
      p==='open-written'||p==='open-oral'?u.kind!=='production'||u.mode!==(p==='open-written'?'written':'oral'):u.kind!==p)) fail()
  if (bank.editorialStatus==='approved' && bank.review.humanReview!=='approved') fail()
}

export function isGrammarQuestion(q: unknown): q is GrammarQuestion {
  if (!record(q) || !validGrammarUnit(q.unit) || q.id!==q.unit.id) return false
  const u=q.unit
  if (q.presentation==='scenario-set') {
    if(u.kind!=='scenario'||q.readingPart!==undefined)return false
    if(u.contract==='open')return q.scenarioPart===undefined&&q.scenarioOptions===undefined
    if(!record(q.scenarioOptions))return false
    const closed=u.questions.filter(c=>c.response==='choice')
    if(Object.keys(q.scenarioOptions).length!==closed.length||!closed.every(c=>sameChoices((q.scenarioOptions as Record<string,unknown>)[c.id],c.options!)))return false
    const p=q.scenarioPart
    return p===undefined||record(p)&&(p.kind==='support'?
      Number.isInteger(p.scenarioNumber)&&Number(p.scenarioNumber)>=1&&Number(p.scenarioNumber)<=50&&(p.continued===undefined||typeof p.continued==='boolean'):
      p.kind==='question'&&u.questions.some((c,i)=>c.id===p.questionId&&p.number===i+1))
  }
  if(q.scenarioPart!==undefined||q.scenarioOptions!==undefined)return false
  if (q.presentation==='document-set') {
    if (u.kind!=='reading' || !record(q.readingOptions)) return false
    const choiceQuestions=u.questions.filter(child=>child.response==='choice')
    if (Object.keys(q.readingOptions).length!==choiceQuestions.length || !choiceQuestions.every(child=>sameChoices((q.readingOptions as Record<string,unknown>)[child.id],child.options!))) return false
    if (q.readingPart===undefined) return true
    const part=q.readingPart
    return record(part) && (part.kind==='support'?
      Number.isInteger(part.documentNumber)&&Number(part.documentNumber)>=1&&Number(part.documentNumber)<=20&&(part.continued===undefined||typeof part.continued==='boolean'):
      part.kind==='question' && u.questions.some((child,index)=>child.id===part.questionId&&part.number===index+1))
  }
  if (q.readingPart!==undefined) return false
  if (q.presentation==='open-written'||q.presentation==='open-oral') return u.kind==='production'&&u.mode===(q.presentation==='open-written'?'written':'oral')
  if (q.presentation==='choice') return u.kind==='completion' && choices(q.options) &&
    JSON.stringify((q.options as Array<{id:string}>).map(c=>c.id).sort())===JSON.stringify(u.options.map(c=>c.id).sort()) &&
    (q.options as Array<{id:string;text:string}>).every(c=>u.options.some(o=>o.id===c.id&&o.text===c.text))
  if (q.presentation==='gap') return u.kind==='completion'
  if (q.presentation==='correct') return u.kind==='correct'
  if (q.presentation==='transform') return u.kind==='transform'
  if (q.presentation==='order') return u.kind==='order' && Array.isArray(q.tokens) && q.tokens.length===u.tokens.length &&
    q.tokens.every(t=>record(t)&&text(t.id)&&text(t.text)) && unique(q.tokens.map(t=>t.id)) &&
    q.tokens.every(t=>u.tokens.some(o=>o.id===t.id&&o.text===t.text&&o.category===t.category))
  if (q.presentation==='match') return u.kind==='match' && choices(q.rightOptions) &&
    (q.rightOptions as Array<{id:string;text:string}>).length===u.pairs.length &&
    (q.rightOptions as Array<{id:string;text:string}>).every(c=>u.pairs.some(p=>p.id===c.id&&p.right===c.text))
  return false
}

/** Validate imported snapshots without depending on the current bank revision. */
export function isGrammarSnapshot(v: unknown): v is GrammarSnapshot {
  const valid=record(v) && v.schemaVersion===1 && text(v.activityId) && ['A1','A2','B1'].includes(String(v.level)) &&
    (GRAMMAR_PRESENTATIONS as string[]).includes(String(v.presentation)) && text(v.bankRevision) &&
    typeof v.seed==='number' && Number.isFinite(v.seed) && text(v.requestKey) && text(v.instruction) && typeof v.pilot==='boolean' &&
    Array.isArray(v.questions) && v.questions.length>0 && v.questions.length<=50 && v.questions.every(isGrammarQuestion) &&
    v.questions.every(q=>q.presentation===v.presentation) && unique(v.questions.map(q=>q.id))
  if (!valid || !record(v)) return false
  const units=(v.questions as GrammarQuestion[]).map(q=>q.unit)
  if(!consistentGrammarImages(units)||!unique([...units.map(u=>u.id),...units.flatMap(u=>u.kind==='reading'||u.kind==='scenario'&&u.contract==='closed'?u.questions.map(c=>c.id):[])]))return false
  if (v.presentation!=='document-set'&&v.presentation!=='scenario-set') return true
  const questions=v.questions as GrammarQuestion[]
  const groups=grammarGroups(questions,v.presentation)!
  return (v.presentation!=='document-set'||questions.length<=20) && questions.every(q=>q.readingPart===undefined&&q.scenarioPart===undefined) && unique(groups.flatMap(g=>g.questionIds)) &&
    Array.isArray(v.groups) && v.groups.length===groups.length && v.groups.every((group,index)=>record(group)&&group.id===groups[index]!.id&&group.kind===groups[index]!.kind&&
      JSON.stringify(group.supportIds)===JSON.stringify(groups[index]!.supportIds)&&JSON.stringify(group.questionIds)===JSON.stringify(groups[index]!.questionIds))
}
