import { createRng, shuffle } from '@/math/rng'
import type { ExerciseBlock, MathItem, PageConfig } from '@/math/types'
import { grammarBankFor } from './registry'
import { GrammarCurriculumError, isProtectedGrammarCo, type GrammarBank, type GrammarSnapshot, type GrammarUnit } from './types'
import { isGrammarSnapshot } from './validation'
import { grammarItems } from './items'
import { createGrammarQuestion } from './questions'
import { grammarGroups } from './scenario'

export function hasGrammarSettings(block: ExerciseBlock): boolean {
  return ['grammarLevel','grammarActivityId','grammarPresentation','grammarBankRevision','grammarSnapshot','grammarPreview','grammarDocumentCount','grammarPageBreakAfterQuestionIds']
    .some(key=>(block as unknown as Record<string,unknown>)[key]!==undefined)
}

export function grammarRequestKey(block: ExerciseBlock): string {
  return JSON.stringify({activity:block.grammarActivityId,type:block.exerciseType,level:block.grammarLevel,
    presentation:block.grammarPresentation,revision:block.grammarBankRevision,count:grammarSelectionCount(block),
    documentCount:block.grammarPresentation==='document-set'?block.grammarDocumentCount:undefined,
    preview:block.grammarPreview===true,polarity:block.phrasePolarity??'positive',
    excluded:Object.entries(block.phraseCategories??{}).filter(([,value])=>value===false).map(([key])=>key).sort()})
}
export function grammarSelectionCount(block: ExerciseBlock): number {
  return block.grammarPresentation==='document-set' ? block.grammarDocumentCount??0 : block.count
}
function eligible(bank: GrammarBank, block: ExerciseBlock): GrammarUnit[] {
  if (block.grammarPresentation!=='order') return bank.units
  const optional=['adjectif','adverbe','preposition','conjonction'] as const
  const units=bank.units.filter(u=>u.kind==='order' && !optional.some(category=>
    block.phraseCategories?.[category]===false && u.tokens.some(t=>t.category===category)))
  const negative=(u: GrammarUnit) => u.kind==='order' && u.tokens.some(t=>t.category==='negation')
  const polarity=block.phrasePolarity??'positive'
  if (polarity==='mixed') {
    if (!units.some(negative) || !units.some(u=>!negative(u))) return []
    return units
  }
  return units.filter(u=>negative(u)===(polarity==='negative'))
}
export function grammarEligibleCount(block: ExerciseBlock): number {
  const bank=block.grammarLevel?grammarBankFor(block.exerciseType,block.grammarLevel):undefined
  return bank ? eligible(bank,block).length : 0
}

function invalid(message: string): never { throw new GrammarCurriculumError('GRAMMAR_CONFIG_INVALID',message) }

export function generateGrammarSelection(block: ExerciseBlock, seed: number): GrammarSnapshot {
  if (isProtectedGrammarCo(block.exerciseType)) invalid('La compréhension orale conserve ses paramètres actuels.')
  const count=grammarSelectionCount(block), documents=block.grammarPresentation==='document-set'
  if (!block.grammarLevel || !block.grammarActivityId || !block.grammarPresentation || !block.grammarBankRevision ||
    block.grammarActivityId!==block.exerciseType || !Number.isSafeInteger(count) || count<1 || count>(documents?20:50) || !Number.isFinite(seed))
    invalid(`Choisissez une activité, un niveau et un mode de réponse grammaticaux disponibles (${documents?'1 à 20 textes':'1 à 50 questions'}).`)
  const key=grammarRequestKey(block)
  if (block.grammarSnapshot!==undefined) {
    if (!isGrammarSnapshot(block.grammarSnapshot)) throw new GrammarCurriculumError('GRAMMAR_SNAPSHOT_INVALID','La sélection grammaticale sauvegardée est invalide. Conservez le fichier et régénérez explicitement cet exercice.')
    const s=block.grammarSnapshot
    if (s.activityId!==block.grammarActivityId || s.level!==block.grammarLevel || s.presentation!==block.grammarPresentation || s.bankRevision!==block.grammarBankRevision)
      invalid('Les paramètres et la sélection sauvegardée diffèrent. Régénérez cet exercice pour appliquer le changement.')
    if (s.seed===seed && s.requestKey===key && s.questions.length===count) return s
  }
  const bank=grammarBankFor(block.exerciseType,block.grammarLevel)
  if (!bank || !bank.presentations.includes(block.grammarPresentation))
    throw new GrammarCurriculumError('GRAMMAR_ACTIVITY_UNAVAILABLE','Ce niveau ou ce mode de réponse n’est pas encore disponible pour cette activité.')
  if (bank.revision!==block.grammarBankRevision)
    throw new GrammarCurriculumError('GRAMMAR_BANK_REVISION_MISSING','Cette révision de banque n’est plus disponible. Choisissez explicitement la banque actuelle pour régénérer.')
  const pilot=bank.editorialStatus!=='approved'
  if (pilot && block.grammarPreview!==true)
    throw new GrammarCurriculumError('GRAMMAR_ACTIVITY_UNAVAILABLE','Cette banque est un pilote. Sélectionnez le niveau pilote pour la relire avant diffusion.')
  const pool=eligible(bank,block)
  if (count>pool.length) throw new GrammarCurriculumError('GRAMMAR_CAPACITY_EXCEEDED',
    `Ces paramètres permettent ${pool.length} ${documents?'texte':'question'}${pool.length===1?'':'s'}. Réduisez le nombre ou modifiez explicitement les filtres.`)
  const rng=createRng(seed)
  let selected=shuffle(rng,pool).slice(0,count)
  if (block.grammarPresentation==='order' && block.phrasePolarity==='mixed') {
    const isNegative=(u:GrammarUnit)=>u.kind==='order'&&u.tokens.some(t=>t.category==='negation')
    const a=shuffle(rng,pool.filter(u=>!isNegative(u))), n=shuffle(rng,pool.filter(isNegative))
    const negatives=Math.min(n.length,Math.ceil(block.count/2))
    selected=shuffle(rng,[...n.slice(0,negatives),...a.slice(0,block.count-negatives)])
    if (selected.length!==block.count) throw new GrammarCurriculumError('GRAMMAR_CAPACITY_EXCEEDED','Ce tirage mixte ne contient pas assez de phrases dans chaque forme.')
  }
  const questions=selected.map(unit=>createGrammarQuestion(unit,block.grammarPresentation!,seed))
  return {schemaVersion:1,activityId:bank.activityId,level:bank.level,presentation:block.grammarPresentation,
    bankRevision:bank.revision,seed,requestKey:key,instruction:bank.instructions[block.grammarPresentation]!,pilot,questions,
    ...(documents||block.grammarPresentation==='scenario-set'?{groups:grammarGroups(questions,block.grammarPresentation)}:{})}
}

export function generateGradedGrammarBlock(config: PageConfig, seed: number): { instruction:string;items:MathItem[];bankQuestionCap:number } | null {
  if (config.domain!=='grammaire' || isProtectedGrammarCo(config.exerciseType)) return null
  if (!hasGrammarSettings(config) && !config.exerciseType.includes('-curriculum-')) return null
  const selection=generateGrammarSelection(config,seed)
  return {instruction:selection.instruction,items:grammarItems(selection),bankQuestionCap:grammarEligibleCount(config)||selection.questions.length}
}
