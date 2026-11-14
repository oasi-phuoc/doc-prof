import raw from './data/etre.json'
import specialEr from './data/er-particuliers.json'
import pastContrast from './data/imparfait-ou-pc.json'
import directObjects from './data/i4.json'
import subjunctive from './data/k10.json'
import have from './data/avoir.json'
import go from './data/aller-destination.json'
import regularEr from './data/er.json'
import ir from './data/ir.json'
import reOir from './data/re-oir.json'
import modals from './data/modaux.json'
import reflexive from './data/pronominaux.json'
import simpleNegation from './data/a8.json'
import otherNegations from './data/a9.json'
import type { ExerciseType } from '@/math/types'
import { assertGrammarBank } from './validation'
import { isProtectedGrammarCo, type GrammarBank, type GrammarLevel } from './types'

/** Editorial pilot only; publication requires a recorded teacher review. */
export const GRAMMAR_PILOT_BANKS = [...raw, ...specialEr, ...pastContrast, ...directObjects, ...subjunctive, ...have, ...go, ...regularEr, ...ir, ...reOir, ...modals, ...reflexive, ...simpleNegation, ...otherNegations] as GrammarBank[]
GRAMMAR_PILOT_BANKS.forEach(assertGrammarBank)

export function grammarBanksForType(typeId: string): GrammarBank[] {
  if (isProtectedGrammarCo(typeId)) return []
  return GRAMMAR_PILOT_BANKS.filter(bank=>bank.activityId===typeId)
}
export function grammarBankFor(typeId: string, level: GrammarLevel): GrammarBank | undefined {
  return grammarBanksForType(typeId).find(bank=>bank.level===level)
}
export function defaultGrammarPilot(typeId: string) {
  const bank=grammarBanksForType(typeId)[0]
  return bank ? {grammarActivityId:bank.activityId,grammarLevel:bank.level,
    grammarPresentation:bank.presentations[0]!,grammarBankRevision:bank.revision,grammarPreview:true,
    ...(bank.presentations.includes('document-set')?{grammarDocumentCount:1}:{})} : {}
}

export const isNewGrammarPilotType = (typeId: string): boolean => typeId.includes('-curriculum-')

export const GRAMMAR_NEW_PILOT_TYPES: ExerciseType[] = GRAMMAR_PILOT_BANKS.filter((bank,index,banks)=>
  isNewGrammarPilotType(bank.activityId) && banks.findIndex(b=>b.activityId===bank.activityId)===index).map(bank=>({
  id:bank.activityId,topic:bank.topic??'gram-present',label:bank.label,description:bank.objective,
  instruction:bank.instructions[bank.presentations[0]!]!,visual:'texte' as const,preferredColumns:1,
}))
