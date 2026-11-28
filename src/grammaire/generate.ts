import { normalizeTheoryBlocks, type GrammarTheoryBlock } from '@/francais/grammar-theory'
import type { MathItem, PageConfig } from '@/math/types'
import { buildWordVocab } from './exercises/word-vocab'
import { tryGenerateGrammaireExerciseBlock } from './exercises/generate'
import { isGrammaireExerciseType } from './exercises/types'
import { theoryDocByTypeId } from './theory'
import { falcLessonBlocks } from './theory/falc-lesson'
import { buildGrammarScenario, grammarScenarioFor } from './exercises/parcours'
import { isGrammaireTheoryType } from './types'
import { generateGradedGrammarBlock } from './curriculum/generate'
import { GrammarCurriculumError } from './curriculum/types'

function blockToItem(docTitle: string, block: GrammarTheoryBlock, index: number, falc: boolean): MathItem {
  return {
    layout: 'theory',
    prompt: `${docTitle}-${index}`,
    answer: '',
    theoryBlock: block,
    grammarTheoryFalc: falc || undefined,
  }
}

/** Génère une fiche théorie FALC ou un bloc d’exercices (déterministe). */
export function tryGenerateGrammaireBlock(
  config: PageConfig,
  seed: number,
): { instruction: string; items: MathItem[]; bankQuestionCap?: number } | null {
  const typeId = config.exerciseType
  const vocabulary = buildWordVocab(config, seed)
  if (vocabulary) return vocabulary
  const scenario = grammarScenarioFor(typeId)
  if (scenario) return buildGrammarScenario(scenario, seed)
  try {
    const graded=generateGradedGrammarBlock(config,seed)
    if (graded) return graded
  } catch (error) {
    if (!(error instanceof GrammarCurriculumError)) throw error
    return {instruction:'Vérifiez les paramètres de cet exercice.',items:[{layout:'text',prompt:error.message,answer:''}],bankQuestionCap:0}
  }
  if (isGrammaireExerciseType(typeId)) {
    return tryGenerateGrammaireExerciseBlock(config, seed)
  }
  if (!isGrammaireTheoryType(typeId)) return null
  const doc = theoryDocByTypeId[typeId]
  if (!doc) {
    return {
      instruction: 'Théorie à compléter.',
      items: [
        {
          layout: 'theory',
          prompt: 'empty',
          answer: '',
          theoryBlock: { kind: 'paragraph', text: 'Contenu théorie manquant pour ce type.' },
        },
      ],
    }
  }
  // Les anciennes recettes enregistrent leurs coupes selon les index du gabarit historique.
  const legacyBlocks = normalizeTheoryBlocks(doc.blocks)
  const usesLegacyBreaks = config.tcfPageBreakAfter?.length === legacyBlocks.filter(block => block.kind !== 'page').length
  const falcBlocks = usesLegacyBreaks ? undefined : falcLessonBlocks(doc, config.worksheetPaper)
  const items = (falcBlocks ?? legacyBlocks).reduce<MathItem[]>((result, block) => {
    if (block.kind === 'page') {
      const previous = result[result.length - 1]
      if (previous) previous.theoryPageBreakAfter = true
      return result
    }
    result.push(blockToItem(doc.title, block, result.length, Boolean(falcBlocks)))
    return result
  }, [])
  return {
    instruction: `Théorie — ${doc.title}`,
    items,
  }
}
