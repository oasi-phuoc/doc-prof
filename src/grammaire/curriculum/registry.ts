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
import adjectivePosition from './data/f12.json'
import superlatives from './data/f13.json'
import quantityComparisons from './data/f14.json'
import physicalDescriptions from './data/description-physique.json'
import politeAdvice from './data/f10.json'
import imperatives from './data/f11.json'
import past0 from './data/pc-idee.json'
import past1 from './data/pc-avoir.json'
import past2 from './data/pc-etre.json'
import past3 from './data/imparfait.json'
import past4 from './data/pqp.json'
import past5 from './data/double-aux.json'
import past6 from './data/pc-pronominaux.json'
import past7 from './data/accord-pp.json'
import pronouni1 from './data/i1.json'
import pronouni2 from './data/i2.json'
import pronouni3 from './data/i3.json'
import pronouni5 from './data/i5.json'
import pronouni6 from './data/i6.json'
import pronouni7 from './data/i7.json'
import pronouni8 from './data/i8.json'
import pronouni9 from './data/i9.json'
import avenir0 from './data/futur-proche.json'
import avenir1 from './data/futur-simple.json'
import avenir2 from './data/futur-proche-ou-simple.json'
import avenir3 from './data/futur-anterieur.json'
import avenir4 from './data/hypothese-futur.json'
import faitsj6 from './data/j6.json'
import faitsj7 from './data/j7.json'
import faitsj8 from './data/j8.json'
import faitsj9 from './data/j9.json'
import faitsj10 from './data/j10.json'
import finalk1 from './data/k1.json'
import finalk2 from './data/k2.json'
import finalk3 from './data/k3.json'
import finalk4 from './data/k4.json'
import finalk5 from './data/k5.json'
import finalk6 from './data/k6.json'
import finalk7 from './data/k7.json'
import finalk8 from './data/k8.json'
import finalk9 from './data/k9.json'
import finalk11 from './data/k11.json'
import finalk12 from './data/k12.json'
import finalk13 from './data/k13.json'
import actionj1 from './data/j1.json'
import actionj2 from './data/j2.json'
import actionj3 from './data/j3.json'
import foodg1 from './data/g1.json'
import foodg2 from './data/g2.json'
import foodg3 from './data/g3.json'
import foodg4 from './data/g4.json'
import foodg5 from './data/g5.json'
import foodg6 from './data/g6.json'
import moments from './data/e2.json'
import durations from './data/e3.json'
import frequencies from './data/e4.json'
import chronology from './data/e5.json'
import locations from './data/e1.json'
import directions from './data/e6.json'
import locationArticles from './data/e7.json'
import { banksWithWordExercises } from './word-exercise-banks'
import { activityDailyBanks } from './daily-bank-aliases'
import type { ExerciseType } from '@/math/types'
import { assertGrammarBank } from './validation'
import { isNegativeGrammarOrder, isProtectedGrammarCo, type GrammarBank, type GrammarLevel } from './types'

/** Banques graduées et historique de leurs relectures. */
const originalBanks = [...raw, ...specialEr, ...pastContrast, ...directObjects, ...subjunctive, ...have, ...go, ...regularEr, ...ir, ...reOir, ...modals, ...reflexive, ...simpleNegation, ...otherNegations, ...addressForms, ...greetings, ...politeness, ...subjectPronouns, ...origins, ...identities, ...nationalities, ...families, ...familyCompletion,...closedQuestions,...openQuestions,...quelQuestions,...exclamations,...activities,...tonicPronouns,...locations,...directions,...locationArticles,...moments,...durations,...frequencies,...chronology,...demonstratives,...requests,...acceptances,...decriref4,...decriref5,...decriref6,...decriref7,...decriref8,...comparisons,...adjectivePosition,...superlatives,...quantityComparisons,...physicalDescriptions,...politeAdvice,...imperatives,...past0,...past1,...past2,...past3,...past4,...past5,...past6,...past7,...pronouni1,...pronouni2,...pronouni3,...pronouni5,...pronouni6,...pronouni7,...pronouni8,...pronouni9,...foodg1,...foodg2,...foodg3,...foodg4,...foodg5,...foodg6,...actionj1,...actionj2,...actionj3,...avenir0,...avenir1,...avenir2,...avenir3,...avenir4,...faitsj6,...faitsj7,...faitsj8,...faitsj9,...faitsj10,...finalk1,...finalk2,...finalk3,...finalk4,...finalk5,...finalk6,...finalk7,...finalk8,...finalk9,...finalk11,...finalk12,...finalk13,...activityDailyBanks(reflexive as GrammarBank[])] as GrammarBank[]
export const GRAMMAR_PILOT_BANKS = banksWithWordExercises(originalBanks)
GRAMMAR_PILOT_BANKS.forEach(assertGrammarBank)

export function grammarBanksForType(typeId: string): GrammarBank[] {
  if (isProtectedGrammarCo(typeId)) return []
  return GRAMMAR_PILOT_BANKS.filter(bank=>bank.activityId===typeId)
}
export function grammarBankFor(typeId: string, level: GrammarLevel, revision?: string): GrammarBank | undefined {
  const current = grammarBanksForType(typeId).find((bank) => bank.level === level)
  if (!revision || current?.revision === revision || !current) return current
  return originalBanks.find((bank) => bank.activityId === typeId && bank.level === level && bank.revision === revision)
}
export function defaultGrammarPilot(typeId: string) {
  const bank=grammarBanksForType(typeId)[0]
  if (!bank) return {}
  const negativeOnly = bank.presentations[0] === 'order' && bank.units.every(isNegativeGrammarOrder)
  const mixedByDefault = ['gram-ex-e4-curriculum-o','gram-ex-f3-curriculum-o','gram-ex-pc-pronominaux-curriculum-o'].includes(typeId)
  const phrasePolarity = negativeOnly ? 'negative' as const : mixedByDefault ? 'mixed' as const : undefined
  return {grammarActivityId:bank.activityId,grammarLevel:bank.level,
    grammarPresentation:bank.presentations[0]!,grammarBankRevision:bank.revision,
    ...(phrasePolarity ? { phrasePolarity } : {}),
    ...(bank.presentations.includes('document-set')?{grammarDocumentCount:1}:{})}
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
