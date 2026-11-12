import { GrammarCurriculumError, type GrammarBank, type GrammarQuestion, type GrammarSnapshot, type GrammarUnit } from './types'

const text = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0
const record = (v: unknown): v is Record<string, unknown> => v !== null && typeof v === 'object' && !Array.isArray(v)
const strings = (v: unknown): v is string[] => Array.isArray(v) && v.length > 0 && v.every(text)
const unique = (values: string[]) => new Set(values).size === values.length
const categories = ['pronom','verbe','nom','determinant','adjectif','adverbe','preposition','conjonction','negation','interjection']
const key = (value: string) => value.normalize('NFC').trim().replace(/\s+/g, ' ')
const choices = (v: unknown) => Array.isArray(v) && v.length >= 2 && v.length <= 6 &&
  v.every(c=>record(c) && text(c.id) && text(c.text)) && unique(v.map(c=>c.id)) && unique(v.map(c=>key(c.text)))

export function validGrammarUnit(value: unknown): value is GrammarUnit {
  if (!record(value) || !text(value.id) || !text(value.prompt) || !strings(value.answers) ||
    !text(value.explanation) || !record(value.source) || !text(value.source.path) ||
    !text(value.source.typeId) || !Number.isInteger(value.source.position) || Number(value.source.position)<0) return false
  if (value.givenVerb!==undefined && !text(value.givenVerb) ||
    value.responseLines!==undefined && value.responseLines!==1 && value.responseLines!==2) return false
  if (value.kind==='completion') return choices(value.options) && value.prompt.split('___').length===2 &&
    (value.options as Array<{text:string}>).filter(c=>(value.answers as string[]).some(answer=>key(c.text)===key(answer))).length===1
  if (value.kind==='correct') return value.answers.every(answer=>key(answer)!==key(value.prompt as string))
  if (value.kind==='transform') return text(value.targetSubject) && value.answers.every(answer=>key(answer)!==key(value.prompt as string))
  if (value.kind==='order') return Array.isArray(value.tokens) && value.tokens.length>=2 && value.tokens.length<=32 &&
    value.tokens.every(t=>record(t)&&text(t.id)&&text(t.text)&&categories.includes(String(t.category))) && unique(value.tokens.map(t=>t.id)) &&
    new Set(value.tokens.map(t=>t.text)).size>1
  if (value.kind==='match') return Array.isArray(value.pairs) && value.pairs.length>=2 && value.pairs.length<=6 &&
    value.pairs.every(p=>record(p)&&text(p.id)&&text(p.left)&&text(p.right)&&text(p.sourceId)) &&
    unique(value.pairs.map(p=>p.id)) && unique(value.pairs.map(p=>key(p.left))) && unique(value.pairs.map(p=>key(p.right)))
  return false
}

export function assertGrammarBank(bank: GrammarBank): void {
  const fail = () => { throw new GrammarCurriculumError('GRAMMAR_BANK_INVALID',`Banque grammaticale invalide : ${bank.activityId}.`) }
  if (bank.schemaVersion!==1 || !text(bank.revision) || !text(bank.activityId) || !['A1','A2','B1'].includes(bank.level) ||
    !Array.isArray(bank.units) || bank.units.length<50 || !bank.units.every(validGrammarUnit) || !unique(bank.units.map(u=>u.id))) fail()
  const meanings=bank.units.map(u=>key(u.kind==='order'?u.answers[0]!:u.kind==='match'?u.pairs.map(p=>p.left).sort().join('|'):u.prompt))
  if (!unique(meanings) || !bank.presentations.length || bank.presentations.some(p=>!text(bank.instructions[p]))) fail()
  for (const p of bank.presentations) if (bank.units.some(u=>
    p==='choice'||p==='gap' ? u.kind!=='completion' : u.kind!==p)) fail()
  if (bank.editorialStatus==='approved' && bank.review.humanReview!=='approved') fail()
}

export function isGrammarQuestion(q: unknown): q is GrammarQuestion {
  if (!record(q) || !validGrammarUnit(q.unit) || q.id!==q.unit.id) return false
  const u=q.unit
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
  return record(v) && v.schemaVersion===1 && text(v.activityId) && ['A1','A2','B1'].includes(String(v.level)) &&
    ['choice','gap','correct','order','match','transform'].includes(String(v.presentation)) && text(v.bankRevision) &&
    typeof v.seed==='number' && Number.isFinite(v.seed) && text(v.requestKey) && text(v.instruction) && typeof v.pilot==='boolean' &&
    Array.isArray(v.questions) && v.questions.length>0 && v.questions.length<=50 && v.questions.every(isGrammarQuestion) &&
    v.questions.every(q=>q.presentation===v.presentation) && unique(v.questions.map(q=>q.id))
}
