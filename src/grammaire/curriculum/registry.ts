import raw from './data/etre.json'
import type { ExerciseType } from '@/math/types'
import { assertGrammarBank } from './validation'
import { isProtectedGrammarCo, type GrammarBank, type GrammarLevel } from './types'

/** Editorial pilot only; publication requires a recorded teacher review. */
export const GRAMMAR_PILOT_BANKS = raw as GrammarBank[]
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
    grammarPresentation:bank.presentations[0]!,grammarBankRevision:bank.revision,grammarPreview:true} : {}
}

export const GRAMMAR_NEW_PILOT_TYPES: ExerciseType[] = GRAMMAR_PILOT_BANKS.filter(bank=>bank.activityId==='gram-ex-etre-curriculum-a').map(bank=>({
  id:bank.activityId,topic:'gram-present',label:bank.label,description:bank.objective,
  instruction:bank.instructions.match!,visual:'texte' as const,preferredColumns:1,
}))
