import { exerciseTypeById } from '@/math/catalog'
import { parseAlphaType } from '@/alphabetisation/kinds'
import { TRANSLATION_PRACTICE_TYPE } from '@/math/guided-practice'
import { grammarScenarioFor } from '@/grammaire/exercises/parcours'

// Les générateurs de ces séries utilisent leurs propres bornes et règles de tirage.
const fixedDifficultyTypes = new Set([
  'nombres-compter-formes', 'nombres-position', 'nombres-decompose', 'nombres-comparer',
  'estimation-dizaine', 'multiples-reconnaitre', 'multiples-diviseurs',
  'fractions-identifier', 'fractions-colorier', 'fractions-lire-figure', 'fractions-vers-decimal',
  'fractions-equivalentes', 'fractions-simplifier', 'fractions-comparer', 'fractions-add', 'fractions-mul', 'fractions-div',
  'decimaux-comparer', 'decimaux-add-colonne', 'decimaux-add-colonne-poser',
  'decimaux-sub-colonne', 'decimaux-sub-colonne-poser', 'decimaux-mul-colonne', 'decimaux-mul-colonne-poser',
  'proportion-notion', 'proportion-de', 'proportion-var', 'proportion-problemes',
  'relatifs-comparer', 'relatifs-add', 'relatifs-mul',
  'puissances-calcul', 'puissances-10', 'puissances-racine', 'puissances-priorite',
  'expressions-substituer', 'expressions-evaluer-2var', 'expressions-evaluer-avances',
  'expressions-produits', 'expressions-reduire', 'expressions-developper', 'expressions-factoriser',
  'equations-systeme', 'equations-systeme-add', 'fonctions-proportion-affine',
  'figures-nommer', 'figures-proprietes', 'figures-patrons-cube', 'figures-tracer-droites',
  'figures-vues-solide', 'figures-angles', 'figures-reproduire', 'figures-agrandir',
  'mesures-segments',
  'aires-composees-quadrillage', 'aires-perimetres-comparer',
  'acm-placeholder', 'sante-placeholder', 'vocabulaire-placeholder',
])

export function supportsActivityDifficulty(type: string, count: number) {
  if (type === TRANSLATION_PRACTICE_TYPE) return true
  return !fixedDifficultyTypes.has(type) && !/^(transformations-|societe-)/.test(type) &&
    (type !== 'conversions-longueur' || count < 2)
}

const fixedQuestionCounts = new Set([
  'mesures-segments', 'acm-placeholder', 'sante-placeholder', 'vocabulaire-placeholder',
  'tpm-rect-peri-aire', 'tpm-para-peri-aire', 'tpm-tri-peri-aire', 'tpm-rhombus-peri-aire',
  'tpm-trap-peri-aire', 'tpm-circle-peri-aire', 'tpm-expressions-evaluer',
  'tcm-cfr-ex18', 'tcm-cfr-ex19', 'tcm-cfr-ex22', 'tcm-cfr-ex23', 'tcm-cfr-ex24',
  'tcm-cfr-ex25', 'tcm-cfr-ex26', 'tcm-cfr-ex27', 'tcm-cfr-ex28',
  'tcm-csc-ex12', 'tcm-csc-ex13', 'tcm-csc-ex18',
])

export function supportsActivityQuestionCount(type: string, min: number, max: number) {
  return max > min && !fixedQuestionCounts.has(type) && !grammarScenarioFor(type) &&
    parseAlphaType(type)?.kind !== 'lire-phrases'
}


const fixedNumberRanges = new Set([
  'nombres-compter-formes', 'nombres-encadrer-100',
  'problemes-addition', 'problemes-soustraction', 'problemes-add-sub', 'problemes-multiplication',
  'problemes-division', 'problemes-melange', 'multiples-diviseurs', 'multiples-pgcd', 'multiples-ppcm',
  'fractions-identifier', 'fractions-colorier', 'fractions-lire-figure', 'fractions-vers-decimal',
  'fractions-equivalentes', 'fractions-simplifier', 'fractions-comparer', 'fractions-add', 'fractions-mul', 'fractions-div',
  'proportion-notion', 'puissances-10', 'puissances-racine', 'puissances-priorite',
  'expressions-substituer', 'expressions-evaluer-2var', 'expressions-evaluer-3var', 'expressions-evaluer-avances',
  'expressions-produits', 'expressions-reduire', 'expressions-developper', 'expressions-factoriser',
  'equations-simple', 'equations-deux-cotes', 'equations-fractions', 'equations-systeme', 'equations-systeme-add',
  'fonctions-regle', 'figures-nommer', 'figures-proprietes', 'figures-patrons-cube', 'figures-angles',
  'figures-reproduire', 'figures-agrandir', 'mesures-segments',
])

export function supportsActivityNumberRange(type: string) {
  return exerciseTypeById[type]?.supportsNumberRange !== false && !/^(transformations-|reperage-)/.test(type) &&
    !/(?:theorie|glossaire)/.test(type) && !fixedNumberRanges.has(type)
}
