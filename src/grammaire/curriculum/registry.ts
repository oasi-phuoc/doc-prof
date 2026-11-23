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
import addressForms from './data/b1.json'
import greetings from './data/b2.json'
import politeness from './data/b3.json'
import subjectPronouns from './data/a2.json'
import origins from './data/a6.json'
import identities from './data/a1.json'
import nationalities from './data/a3.json'
import families from './data/famille.json'
import familyCompletion from './data/famille-completion.json'
import closedQuestions from './data/c1.json'
import openQuestions from './data/c2.json'
import quelQuestions from './data/c3.json'
import exclamations from './data/c4.json'
import activities from './data/d1.json'
import tonicPronouns from './data/d3.json'
import demonstratives from './data/f1.json'
import requests from './data/f2.json'
import acceptances from './data/f3.json'
import decriref4 from './data/f4.json'
import decriref5 from './data/f5.json'
import decriref6 from './data/f6.json'
import decriref7 from './data/f7.json'
import decriref8 from './data/f8.json'
import comparisons from './data/f9.json'
import moments from './data/e2.json'
import durations from './data/e3.json'
import frequencies from './data/e4.json'
import chronology from './data/e5.json'
import locations from './data/e1.json'
import directions from './data/e6.json'
import locationArticles from './data/e7.json'
import { activityDailyBanks } from './daily-bank-aliases'
import type { ExerciseType } from '@/math/types'
import { assertGrammarBank } from './validation'
import { isProtectedGrammarCo, type GrammarBank, type GrammarLevel } from './types'

/** Editorial pilot only; publication requires a recorded teacher review. */
export const GRAMMAR_PILOT_BANKS = [...raw, ...specialEr, ...pastContrast, ...directObjects, ...subjunctive, ...have, ...go, ...regularEr, ...ir, ...reOir, ...modals, ...reflexive, ...simpleNegation, ...otherNegations, ...addressForms, ...greetings, ...politeness, ...subjectPronouns, ...origins, ...identities, ...nationalities, ...families, ...familyCompletion,...closedQuestions,...openQuestions,...quelQuestions,...exclamations,...activities,...tonicPronouns,...locations,...directions,...locationArticles,...moments,...durations,...frequencies,...chronology,...demonstratives,...requests,...acceptances,...decriref4,...decriref5,...decriref6,...decriref7,...decriref8,...comparisons,...activityDailyBanks(reflexive as GrammarBank[])] as GrammarBank[]
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
    ...(['gram-ex-e4-curriculum-o','gram-ex-f3-curriculum-o'].includes(typeId)?{phrasePolarity:'mixed' as const}:{}),
    ...(bank.presentations.includes('document-set')?{grammarDocumentCount:1}:{})} : {}
}

export const isNewGrammarPilotType = (typeId: string): boolean => typeId.includes('-curriculum-')

/** New blocks use the graded base for migrated notions. The retirement policy
 * rejects their former level-less recipes instead of using an old generator. */
export const grammarUsesGradedDefault = (typeId:string):boolean => grammarBanksForType(typeId).length>0

export const GRAMMAR_NEW_PILOT_TYPES: ExerciseType[] = GRAMMAR_PILOT_BANKS.filter((bank,index,banks)=>
  isNewGrammarPilotType(bank.activityId) && banks.findIndex(b=>b.activityId===bank.activityId)===index).map(bank=>({
  id:bank.activityId,topic:bank.topic??'gram-present',label:bank.label,description:bank.objective,
  instruction:bank.instructions[bank.presentations[0]!]!,visual:'texte' as const,preferredColumns:1,
}))
