import { mathTheoryLessons, mathTheoryTopic } from './theory-lessons'
import { isMathProblemHelpType } from './problem-help'
import { splitLogistiquePages, type LogistiquePageLayout } from '@/logistique/pagination'
import { isLogistiqueDomain, isLogistiqueReferenceType, logistiqueType } from '@/logistique/catalog'
import { generateLogistique, logistiqueDocumentTitle } from '@/logistique/generate'
import { isLogistiqueStoryQuestion } from '@/logistique/evaluation'
import { completeLogistiqueGlossaryItem } from '@/logistique/glossary'
import { validLogistiquePages } from '@/logistique/recipe'
import { paginateCePosters } from '@/tcf/ce-poster-pages'
import { splitTcfAudioQuestionPages } from '@/tcf/audio-question-pages'
import { splitCscColumnPages } from '@/tcm-csc/pagination'
import { ceArtFor } from '@/tcf/ce-art'
import { withTcfInformationTotals } from '@/tcf/information-totals'
import { tpfPlacementTask } from '@/tcf/tpf-placement'
/**
 * Orchestrateur de fiches : buildPage / buildWorksheets.
 * Tirage maths purs → `./generate-items` ; colonnes → `./column-arith`.
 */
import { tryGenerateAlgebraBatch } from './algebra'
import { defaultPage, exerciseTypeById, topicById } from './catalog'
import { numberRangeFrom } from './difficulty'
import { generateConstruire } from './coord-construire'
import { generateDroites } from './coord-droites'
import { tryGenerateReperage } from './coord-reperage'
import { generateTransformations, isTransformationExercise } from './coord-transformations'
import { tryGenerateSoutienBatch } from '@/francais/soutien/generate'
import { parseSoutienType } from '@/francais/soutien/kinds'
import { parseAlphaType } from '@/alphabetisation/kinds'
import { mathGlossaryBank } from './glossary-banks'
import { alphaPhraseOrderItem, tryGenerateAlphabetisationBatch } from '@/alphabetisation/generate'
import { tryGenerateLectureBatch } from '@/francais/lecture'
import { tryGeneratePhraseBatch } from '@/francais/phrase'
import { phraseImageWordFields } from '@/francais/phrase-image-words'
import {splitPhraseImagePages} from '@/francais/phrase-image-pages'
import { tryGenerateCalligraphieBatch } from '@/calligraphie/generate'
import { tryGenerateJeuxBatch } from '@/jeux/generate'
import { pageAsConfig, pageBlocks } from './page-model'
import { isTpmDomain, TPM_MAX_SCORE } from '@/tpm/test'
import { generateTpmInformations } from '@/tpm/informations'
import { resolveTcfExercise, tryGenerateTcfBlock } from '@/tcf/generate'
import { isTcfAudioDomain, isTcfConsignesType, isTpfFamilyDomain } from '@/tcf/catalog'
import { splitMultiDocumentAnnonce } from '@/tcf/split-documents'
import { collectCorrigeAudioSrcs } from '@/tcf/download-audios'
import { grammarScenarioFor, paginateGrammarScenario } from '@/grammaire/exercises/parcours'
import { tryGenerateGrammaireBlock } from '@/grammaire/generate'
import { isGrammaireTheoryType } from '@/grammaire/types'
import { splitGradedGrammarPages } from '@/grammaire/curriculum/pagination'
import { tryGenerateAcmBlock } from '@/acm/generate'
import { paginateAcmWorksheet } from '@/acm/pagination'
import { tryGenerateLogiqueBlock } from '@/logique/generate'
import { tryGenerateSanteBlock } from '@/sante/generate'
import { paginateSanteWorksheet } from '@/sante/pagination'
import { tryGenerateSocieteBlock } from '@/societe/generate'
import { isSocieteTheoryType } from '@/societe/types'
import { schoolA5Breaks, tryGenerateVieScolaireBlock } from '@/vie-scolaire/generate'
import { isVieScolaireTheoryType } from '@/vie-scolaire/types'
import { isTcmCfrConsignesType, TCM_CFR_MAX_SCORE } from '@/tcm-cfr/test'
import { tryGenerateTcmCscBlock } from '@/tcm-csc/generate'
import { isTcmCscConsignesType, TCM_CSC_MAX_SCORE } from '@/tcm-csc/test'
import { tryGenerateVocabulaireBlock } from '@/vocabulaire/generate'
import { isGrammarTheoryType } from '@/francais/grammar-theory'
import { sanitizeItemNumberNoise } from './column-arith'
import { createRng, shuffle } from './rng'
import type {
  AlgebraGiven,
  ExerciseBlock,
  MathItem,
  PageConfig,
  WorksheetBlock,
  WorksheetDocument,
  WorksheetPage,
} from './types'
import { generateItems } from './generate-items'
import { headingForSlice } from './page-break-heading'

/** CE instructions multi-docs → un bloc Exercice par document. */
function expandTcfInstructionDocuments(page: PageConfig, seed: number): PageConfig {
  if (!isTcfAudioDomain(page.domain)) return page
  const blocks = pageBlocks(page)
  const out: ExerciseBlock[] = []
  let changed = false
  blocks.forEach((block, index) => {
    const local = block.contentSeed ?? 0
    const rng = createRng(seed + index * 10007 + local)
    const ex = resolveTcfExercise(pageAsConfig(page, block), rng)
    if (page.domain === 'tcf-csc' && block.tcfCeFormat === 'image' && ex?.competence === 'CE' && ceArtFor(ex)) {
      out.push(block)
      return
    }
    const parts = ex ? splitMultiDocumentAnnonce(ex) : null
    if (!parts) {
      out.push(block)
      return
    }
    changed = true
    for (const part of parts) {
      out.push({
        ...block,
        tcfExercise: part,
        tcfBankId: part.id,
        tcfFormModes: undefined,
      })
    }
  })
  if (!changed) return page
  const [first, ...extra] = out
  if (!first) return page
  return {
    ...page,
    ...first,
    domain: page.domain,
    extraBlocks: extra.length ? extra : undefined,
  }
}

function buildSingleBlock(
  config: PageConfig,
  seed: number,
  worksheetSeed = seed,
): {
  title: string
  instruction: string
  items: MathItem[]
  givens?: AlgebraGiven[]
  document?: WorksheetDocument
  bankQuestionCap?: number
  tcfQuestionPageBreakBefore?: number[]
} {
  if (isLogistiqueDomain(config.domain)) return generateLogistique(config, seed)
  const rng = createRng(seed)
  const topic = topicById[config.topic]
  const type = exerciseTypeById[config.exerciseType]
  const difficulty = config.difficulty ?? 'moyen'
  const fallbackTitle = type?.label ?? topic?.label ?? 'Exercices'
  const theoryTopic = mathTheoryTopic(config.exerciseType)
  if (theoryTopic && (config.domain === 'algèbre' || config.domain === 'géométrie' || isTpmDomain(config.domain))) {
    const { continuation = [], ...lesson } = mathTheoryLessons[theoryTopic]!
    const title = topicById[theoryTopic]?.label ?? lesson.title
    return {
      title,
      instruction: title,
      items: [lesson, ...continuation].map((part) => ({
        layout: 'theory',
        mathTheory: { ...part, topic: theoryTopic },
        answer: '',
        noPoints: true,
      })),
    }
  }
  if (config.exerciseType === 'tpm-consignes') {
    return {
      title: 'Informations',
      instruction: type?.instruction ?? 'Lisez les consignes avant de commencer le test.',
      items: generateTpmInformations('tpm', TPM_MAX_SCORE),
    }
  }
  if (isTcmCscConsignesType(config.exerciseType)) {
    return {
      title: 'Informations',
      instruction: type?.instruction ?? 'Lisez les consignes avant de commencer le test.',
      items: generateTpmInformations('tcm-csc', TCM_CSC_MAX_SCORE),
    }
  }
  const tcf = tryGenerateTcfBlock(config, rng)
  if (tcf) {
    return { title: fallbackTitle, instruction: tcf.instruction, items: tcf.items }
  }
  const grammaire = tryGenerateGrammaireBlock(config, seed)
  if (grammaire) {
    return {
      title: fallbackTitle,
      instruction: grammaire.instruction,
      items: grammaire.items,
      bankQuestionCap: grammaire.bankQuestionCap,
    }
  }
  const vocabulaire = tryGenerateVocabulaireBlock(config)
  if (vocabulaire) {
    return {
      title: fallbackTitle,
      instruction: vocabulaire.instruction,
      items: vocabulaire.items,
    }
  }
  const societe = tryGenerateSocieteBlock(config, rng)
  if (societe) {
    return {
      title: fallbackTitle,
      instruction: societe.instruction,
      items: societe.items,
    }
  }
  const school = tryGenerateVieScolaireBlock(config, rng)
  if (school) return { title: fallbackTitle, ...school }
  const sante = tryGenerateSanteBlock(config, rng)
  if (sante) {
    return {
      title: fallbackTitle,
      instruction: sante.instruction,
      items: sante.items,
    }
  }
  const acm = tryGenerateAcmBlock(config)
  if (acm) {
    return {
      title: acm.title,
      instruction: acm.instruction,
      items: acm.items,
    }
  }
  const logique = tryGenerateLogiqueBlock(config, seed)
  if (logique) {
    return {
      title: fallbackTitle,
      instruction: logique.instruction,
      items: logique.items,
    }
  }
  const tcmCsc = tryGenerateTcmCscBlock(config, seed)
  if (tcmCsc) {
    return {
      title: fallbackTitle,
      instruction: tcmCsc.instruction,
      items: tcmCsc.items,
    }
  }
  if (isTcmCfrConsignesType(config.exerciseType)) {
    return {
      title: 'Informations',
      instruction: type?.instruction ?? 'Lisez les consignes avant de commencer le test.',
      items: generateTpmInformations('tcm-cfr', TCM_CFR_MAX_SCORE),
    }
  }
  if (config.exerciseType === 'reperage-droites') {
    const droites = generateDroites(config, rng)
    return { title: fallbackTitle, instruction: droites.instruction, items: droites.items }
  }
  if (config.exerciseType === 'reperage-construire') {
    const construire = generateConstruire(config, rng)
    return { title: fallbackTitle, instruction: construire.instruction, items: construire.items }
  }
  if (isTransformationExercise(config.exerciseType)) {
    const tr = generateTransformations(config, rng)
    return { title: fallbackTitle, instruction: tr.instruction, items: tr.items }
  }
  const glossaryBank = mathGlossaryBank(config.exerciseType)
  if (glossaryBank) {
    const count = Math.max(1, Math.min(config.count || 8, glossaryBank.length))
    const picked = shuffle(rng, [...glossaryBank]).slice(0, count)
    return {
      title: fallbackTitle,
      instruction: type?.instruction ?? 'Lisez chaque mot, sa définition et le schéma.',
      items: picked.map((entry) => ({
        layout: 'glossary' as const,
        prompt: entry.term,
        glossary: {
          sourceId: entry.id,
          term: entry.term,
          definition: entry.definition,
          figure: entry.figure,
        },
        noPoints: true,
        answer: entry.definition,
      })),
    }
  }
  const reperage = tryGenerateReperage(config, rng)
  if (reperage) {
    return { title: fallbackTitle, instruction: reperage.instruction, items: reperage.items }
  }
  const soutien = tryGenerateSoutienBatch(config.exerciseType, config.count, rng, difficulty, {
    soutienMotsLibre: config.soutienMotsLibre,
    soutienMotsEntries: config.soutienMotsEntries,
    columns: config.columns,
    soutienCompleterLibre: config.soutienCompleterLibre,
    soutienCompleterEntries: config.soutienCompleterEntries,
    excludeWords: config.soutienExcludeWords,
    type1Words: config.soutienType1Words,
    type5Words: config.soutienType5Words,
    level: config.soutienLevel,
  })
  if (soutien) {
    return {
      title: fallbackTitle,
      instruction: soutien.instruction ?? type?.instruction ?? 'Complétez.',
      items: soutien.items,
      bankQuestionCap: soutien.bankQuestionCap,
    }
  }
  const alphabetisation = tryGenerateAlphabetisationBatch(
    config.exerciseType,
    config.count,
    rng,
    difficulty,
    {
      soutienMotsLibre: config.soutienMotsLibre,
      soutienMotsEntries: config.soutienMotsEntries,
      columns: config.columns,
      soutienCompleterLibre: config.soutienCompleterLibre,
      soutienCompleterEntries: config.soutienCompleterEntries,
      excludeWords: config.soutienExcludeWords,
      type1Words: config.soutienType1Words,
      type5Words: config.soutienType5Words,
      level: config.soutienLevel,
    },
  )
  if (alphabetisation) {
    return {
      title: fallbackTitle,
      instruction: alphabetisation.instruction ?? type?.instruction ?? 'Complétez.',
      items: alphabetisation.items,
      bankQuestionCap: alphabetisation.bankQuestionCap,
    }
  }
  const lecture = tryGenerateLectureBatch(config.exerciseType, config.count, rng, difficulty)
  if (lecture) {
    return {
      title: fallbackTitle,
      instruction: lecture.instruction ?? type?.instruction ?? 'Complétez.',
      items: lecture.items,
    }
  }
  const phrase = tryGeneratePhraseBatch(
    config.exerciseType,
    config.count,
    rng,
    difficulty,
    config.verbGroup ?? 'er',
    config.phrasePolarity,
    config.phraseCategories,
    config.phraseImageLabels,
    config.phraseSentenceType,
    config.phraseVoice,
    config.phraseImageShownCategories,
  )
  if (phrase) {
    const libre =
      config.verbGroup === 'libre' &&
      Array.isArray(config.phraseItems) &&
      config.phraseItems.length > 0
    return {
      title: fallbackTitle,
      instruction: libre
        ? (config.phraseInstruction ?? phrase.instruction ?? type?.instruction ?? 'Complétez.')
        : (phrase.instruction ?? type?.instruction ?? 'Complétez.'),
      items: libre ? config.phraseItems!.map(item => item.layout === 'phrase-images' ? { ...item, ...phraseImageWordFields(config.phraseImageLabels, config.phraseImageShownCategories) } : item) : phrase.items,
      bankQuestionCap: libre ? undefined : phrase.bankQuestionCap,
    }
  }
  const algebra = tryGenerateAlgebraBatch(config.exerciseType, config.count, rng, difficulty)
  if (algebra) {
    return {
      title: fallbackTitle,
      instruction: algebra.instruction ?? type?.instruction ?? 'Calculez.',
      items: algebra.items,
      givens: algebra.givens,
    }
  }
  const jeux = tryGenerateJeuxBatch(config.exerciseType, rng, {
    gameEntries: config.gameEntries,
    gameBackColor: config.gameBackColor,
    gameTopic: config.gameTopic,
    gameSeriesName: config.gameSeriesName,
    gameBorderId: config.gameBorderId,
    gameBorderRectoId:
      config.gameBorderRectoId !== undefined
        ? config.gameBorderRectoId
        : config.gameBorderId,
    gameBorderVersoId:
      config.gameBorderVersoId !== undefined
        ? config.gameBorderVersoId
        : config.gameBorderId,
    gameFontSize: config.gameFontSize,
    gameAlpha: config.gameAlpha,
  })
  if (jeux) {
    return {
      title: fallbackTitle,
      instruction: jeux.instruction,
      items: jeux.items,
    }
  }
  const calligraphie = tryGenerateCalligraphieBatch(
    config.exerciseType,
    config.calliText,
    config.calliFont,
    config.calliSize,
  )
  if (calligraphie) {
    return {
      title: fallbackTitle,
      instruction: calligraphie.instruction,
      items: calligraphie.items,
    }
  }
  const cfrOrder = config.exerciseType === 'tcm-cfr-ex03' && config.orderAscending != null
    ? `Écrivez les nombres ${config.orderAscending ? 'du plus petit au plus grand' : 'du plus grand au plus petit'}.`
    : null
  const generated = generateItems(
    config.exerciseType,
    Math.min(config.count, type?.maxCount ?? config.count),
    rng,
    difficulty,
    numberRangeFrom(config),
    config.quadLibre ? config.quadShapes : undefined,
    worksheetSeed,
    config.orderAscending,
    { coordRange: config.coordRange, coordUnitSquares: config.coordUnitSquares, realMapId: config.realMapId },
  )
  const tpmCompareLine = config.domain === 'tpm' && config.exerciseType === 'nombres-comparer'
  return {
    title: fallbackTitle,
    instruction: tpmCompareLine
      ? 'Comparez les nombres. Écrivez <, = ou >.'
      : cfrOrder ?? type?.instruction ?? 'Calculez, complète ou simplifiez chaque expression.',
    items: tpmCompareLine
      ? generated.map((item) => ({ ...item, cscTask: { kind: 'compare-line' as const } }))
      : generated,
  }
}

/** Valeurs des lettres depuis les items libre TPM ex. 33 (évaluer). */
function givensFromEvaluerLibre(items: MathItem[]): AlgebraGiven[] | undefined {
  const it = items.find(
    (item) => item.labels?.includes('evaluer') && item.unknowns && item.unknowns.length > 0,
  )
  if (!it?.unknowns || !it.problemVars) return undefined
  const givens = it.unknowns
    .map((letter) => {
      const value = it.problemVars![letter]
      return value == null ? null : { letter, value }
    })
    .filter((g): g is AlgebraGiven => g != null)
  return givens.length > 0 ? givens : undefined
}

/** Page « Informations » d’un test (TPM / CFR / CSC / TPF / TCF) : ni numéro d’exercice ni points. */
function isInfoPageType(typeId: string): boolean {
  return (
    typeId === 'tpm-consignes' ||
    isTcmCfrConsignesType(typeId) ||
    isTcmCscConsignesType(typeId) ||
    isTcfConsignesType(typeId)
  )
}

export function buildPage(
  config: PageConfig,
  seed: number,
  startExercise = 1,
  worksheetSeed = seed,
  logistiqueEvaluation = true,
): WorksheetPage {
  // CE « Lire des instructions » : 1 document = 1 exercice (pas 2 docs dans le même).
  const page: PageConfig = config.domain === 'société'
    ? defaultPage('société')
    : expandTcfInstructionDocuments(config, seed)
  const blocksIn = pageBlocks(page)
  let exerciseCursor = startExercise
  const built: WorksheetBlock[] = blocksIn.map((block, index) => {
    const single = pageAsConfig(page, block)
    if (!logistiqueEvaluation && isLogistiqueDomain(page.domain)) {
      single.logistiqueSelection = undefined
      single.logistiqueEvaluation = undefined
    }
    const local = block.contentSeed ?? 0
    const result = buildSingleBlock(single, seed + index * 10007 + local, worksheetSeed)
    const logistics = logistiqueType(block.exerciseType)
    const logisticsQuestions = logistics?.domain === page.domain && !isLogistiqueReferenceType(block.exerciseType)
    const isMathTheory = Boolean(mathTheoryTopic(block.exerciseType))
    const isTheory = isMathTheory || isLogistiqueReferenceType(block.exerciseType) || isGrammarTheoryType(block.exerciseType) || isGrammaireTheoryType(block.exerciseType) || isSocieteTheoryType(block.exerciseType) || isVieScolaireTheoryType(block.exerciseType)
    const isJeux = block.exerciseType.startsWith('jeux-')
    const isTpmConsignes = isInfoPageType(block.exerciseType)
    // Une feuille « suite » ne doit pas figer seulement sa tranche : sinon le mode
    // libre efface la page des premières questions.
    const libreIsPartialSlice =
      (isTpfFamilyDomain(page.domain) || block.exerciseType === 'tcm-cfr-ex28') &&
      Boolean(block.tcfPageBreakAfter?.some((on, i) => on && i < result.items.length - 1) || block.tcfQuestionPageBreakBefore?.some(index => index > 1)) &&
      Array.isArray(block.libreItems) &&
      block.libreItems.length > 0 &&
      block.libreItems.length < result.items.length
    const libre =
      !libreIsPartialSlice && Array.isArray(block.libreItems) && (logisticsQuestions || block.libreItems.length > 0)
        ? {
            items: block.libreItems,
            instruction: block.libreInstruction ?? result.instruction,
          }
        : null
    let exerciseIndex = 0
    if (!isTpmConsignes) {
      if (block.exerciseNo != null) {
        exerciseIndex = block.exerciseNo
        exerciseCursor = Math.max(exerciseCursor, block.exerciseNo + 1)
      } else {
        exerciseIndex = exerciseCursor++
      }
    }
    const hasStandaloneQuestions = logisticsQuestions && result.items.length === 0 &&
      libre?.items.some((item) => item.logistiqueLocalModule ||
        single.logistiqueEvaluation?.story && isLogistiqueStoryQuestion(item.logistiqueSource?.revision)) &&
      validLogistiquePages([single])
    const rawItems = isLogistiqueDomain(page.domain) && result.items.length === 0 && !hasStandaloneQuestions
      ? result.items : (libre?.items ?? result.items)
    const glossaryBank = mathGlossaryBank(block.exerciseType)
    const alphaKind = page.domain === 'alphabetisation' ? parseAlphaType(block.exerciseType)?.kind : undefined
    const items = rawItems.map((item) => {
      const sanitized = sanitizeItemNumberNoise(item as Record<string, unknown>) as MathItem
      const clean = sanitized.logistiqueNarrative && single.logistiqueEvaluation?.mode !== 'histoire'
        ? { ...sanitized, logistiqueNarrative: undefined } : sanitized
      if (clean.mathTheory) {
        return { ...clean, mathTheory: { ...clean.mathTheory, stepNumbering: block.mathTheoryStepNumbering } }
      }
      if (clean.layout === 'letter-grid') {
        if (alphaKind === 'lire-grille' || alphaKind === 'lire-cursive') {
          return { ...clean, letterGridPurpose: 'reading' as const, noPoints: true,
            letterGridFont: clean.letterGridFont ?? (alphaKind === 'lire-cursive' ? 'cursive' : 'script') }
        }
        if (alphaKind === 'entourer') return { ...clean, letterGridPurpose: 'circle' as const }
      }
      if (alphaKind === 'lire-phrases' && clean.layout === 'text') {
        const sentence = clean.prompt ?? clean.answer
        return { ...clean, prompt: sentence, answer: sentence, readingText: true as const, noPoints: true }
      }
      if (alphaKind === 'ordre-phrases' && clean.layout === 'order') {
        const words = clean.sequence ?? clean.placeParts ?? clean.answer.split(/\s+/).filter(Boolean)
        return { ...clean, ...alphaPhraseOrderItem(clean.answer, words) }
      }
      if (clean.sionMap && block.sionMapBackground) {
        return { ...clean, sionMap: { ...clean.sionMap, background: block.sionMapBackground } }
      }
      if (logistics?.kind === 'glossaire' && !clean.logistiqueGlossaryEntry) return completeLogistiqueGlossaryItem(clean, logistics.module)
      if (glossaryBank && clean.glossary) {
        const entry = clean.glossary
        const sourceId = entry.sourceId ?? glossaryBank.find(({ term }) => term === entry.term)?.id
        return { ...clean, glossary: { ...entry, sourceId }, noPoints: true }
      }
      return block.tcfCeTextFont && clean.tcf?.kind === 'support' && clean.tcf.exercise.competence === 'CE'
        ? { ...clean, tcf: { ...clean.tcf, ceTextFont: block.tcfCeTextFont } }
        : clean
    })
    const libreGivens = givensFromEvaluerLibre(rawItems)
    const corrigeAudios = collectCorrigeAudioSrcs(items, result.document?.audioSrc)
    // En CE TPF, garder le document et les trois premières questions sur la même feuille.
    const placementReadingBreaks = tpfPlacementTask(block.exerciseType)?.competence === 'CE' && items.length > 4
      ? items.map((_, index) => index === 3)
      : undefined
    const schoolBreaks = page.worksheetPaper === 'a5' && page.domain === 'vie-scolaire'
      ? schoolA5Breaks(block.exerciseType, items.length, block.columns)
      : undefined
    const tcfPageBreakAfter =
      block.tcfPageBreakAfter ??
      (isGrammaireTheoryType(block.exerciseType) ? undefined : page.tcfPageBreakAfter) ??
      placementReadingBreaks ??
      schoolBreaks ??
      (isTheory ? items.map((item) => Boolean(item.theoryPageBreakAfter)) : undefined)
    return {
      exerciseIndex,
      title: isTpmConsignes
        ? 'Informations'
        : isMathTheory
          ? result.title
          : isTheory
            ? ((libre?.instruction ?? result.instruction)?.replace(/^Théorie — /, '') || `Théorie`)
            : isJeux
              ? (exerciseTypeById[block.exerciseType]?.label ?? `Jeu ${exerciseIndex}`)
              : (block.sheetTitle ?? tpfPlacementTask(block.exerciseType)?.label ?? `Exercice ${exerciseIndex}`),
      instruction: libre?.instruction ?? result.instruction,
      // Filet anti bruit binaire (7,2700000000000005) sur toutes les fiches.
      items,
      columns: config.domain === 'gattegno' ? 1 : block.columns,
      questionGapPx: block.questionGapPx,
      columnGapPx: block.columnGapPx,
      exerciseType: block.exerciseType,
      pointsPerQuestion: block.pointsPerQuestion,
      givens: libreGivens ?? result.givens,
      document: result.document,
      problemDraftGrids: block.problemDraftGrids,
      problemHelp: isMathProblemHelpType(block.exerciseType) ? block.problemHelp : undefined,
      formulaireLetterGrid: block.formulaireLetterGrid,
      geoFigureHelp: block.geoFigureHelp,
      deniseRate: block.deniseRate,
      inlineBlankPx: block.inlineBlankPx,
      oralAnswerModes: block.oralAnswerModes,
      tcfFormModes: block.tcfFormModes,
      tcfPageBreakAfter,
      tcfQuestionPageBreakBefore: block.tcfQuestionPageBreakBefore ?? result.tcfQuestionPageBreakBefore,
      bankQuestionCap: result.bankQuestionCap,
      grammarPageBreakAfterQuestionIds: block.grammarPageBreakAfterQuestionIds,
      corrigeAudios: corrigeAudios.length ? corrigeAudios : undefined,
    }
  })
  const first = built[0]
  const topic = topicById[config.topic]
  const type = exerciseTypeById[config.exerciseType]
  const isTheoryPage =
    mathTheoryTopic(config.exerciseType) || isGrammarTheoryType(config.exerciseType) || isGrammaireTheoryType(config.exerciseType)
  const isTpmConsignesPage = isInfoPageType(config.exerciseType)
  return {
    ...config,
    title: isLogistiqueDomain(config.domain) ? logistiqueDocumentTitle([config], false, logistiqueEvaluation) : isTpmConsignesPage
      ? 'Informations'
      : isTheoryPage
        ? (first?.title ?? type?.label ?? 'Théorie')
        : built.length > 1
          ? (topic?.label ?? 'Exercices')
          : (type?.label ?? topic?.label ?? 'Exercices'),
    instruction: first?.instruction ?? type?.instruction ?? 'Complétez.',
    items: built.flatMap((block) => block.items),
    blocks: built,
    givens: first?.givens,
  }
}

/** Mots déjà tirés en types 1 (vocab) et 5 (compléter) sur toute la série. */
function collectSoutienReservedWords(pages: PageConfig[], seed: number): {
  reserved: string[]
  type1Words: string[]
  type5Words: string[]
} {
  const reserved = new Set<string>()
  const type1Words: string[] = []
  const type1Seen = new Set<string>()
  const type5Words: string[] = []
  const type5Seen = new Set<string>()
  pages.forEach((page, pageIndex) => {
    const pageSeed = seed + pageIndex * 7919
    pageBlocks(page).forEach((block, blockIndex) => {
      const kind =
        parseSoutienType(block.exerciseType)?.kind ??
        parseAlphaType(block.exerciseType)?.kind
      if (kind !== 'mots' && kind !== 'completer') return
      const single = pageAsConfig(page, block)
      const local = block.contentSeed ?? 0
      const result = buildSingleBlock(single, pageSeed + blockIndex * 10007 + local, seed)
      for (const item of result.items) {
        if (kind === 'mots' && item.layout === 'vocab-table') {
          for (const entry of item.vocabEntries ?? []) {
            const label = entry.label?.trim()
            if (!label) continue
            reserved.add(label.toLowerCase())
            if (!type1Seen.has(label.toLowerCase())) {
              type1Seen.add(label.toLowerCase())
              type1Words.push(label)
            }
          }
        }
        if (kind === 'completer' && item.layout === 'syllable-complete') {
          for (const row of item.syllableCompletes ?? []) {
            const word = row.word?.trim()
            if (!word) continue
            reserved.add(word.toLowerCase())
            if (!type5Seen.has(word.toLowerCase())) {
              type5Seen.add(word.toLowerCase())
              type5Words.push(word)
            }
          }
        }
      }
    })
  })
  return { reserved: [...reserved], type1Words, type5Words }
}

function theoryPageSlices(items: MathItem[], breaks?: boolean[], continueOnNextPage = true): MathItem[][] {
  const segments: MathItem[][] = [[]]
  items.forEach((item, index) => {
    if (item.theoryBlock?.kind === 'page') {
      if (continueOnNextPage) segments.push([])
      return
    }
    segments[segments.length - 1]!.push(item)
    if (index < items.length - 1 && (breaks?.[index] ?? item.theoryPageBreakAfter)) segments.push([])
  })
  return segments.filter(slice => slice.length > 0)
}

export function buildWorksheets(pages: PageConfig[], seed: number, defaultPoints = 1, logisticsLayout?: LogistiquePageLayout): WorksheetPage[] {
  let exerciseNo = 1
  const out: WorksheetPage[] = []
  const { reserved, type1Words, type5Words } = collectSoutienReservedWords(pages, seed)
  const pagesWithExclude =
    reserved.length > 0 || type1Words.length > 0 || type5Words.length > 0
      ? pages.map((page) => ({
          ...page,
          soutienExcludeWords: reserved.length > 0 ? reserved : page.soutienExcludeWords,
          soutienType1Words: type1Words.length > 0 ? type1Words : page.soutienType1Words,
          soutienType5Words: type5Words.length > 0 ? type5Words : page.soutienType5Words,
        }))
      : pages

  pagesWithExclude.forEach((page, index) => {
    const worksheet = buildPage(page, seed + index * 7919, exerciseNo, seed, logisticsLayout?.evaluation)
    const scoredBlocks = worksheet.blocks.filter((block) => !isInfoPageType(block.exerciseType))
    if (scoredBlocks.length) {
      exerciseNo = Math.max(...scoredBlocks.map((block) => block.exerciseIndex)) + 1
    }

    const hasFullPageContent = (block: WorksheetBlock) =>
      block.problemHelp || Boolean(grammarScenarioFor(block.exerciseType)) ||
      block.items.some((item) => item.mathTheory || item.grammarTheoryFalc) ||
      (worksheet.blocks.length > 1 && isGrammaireTheoryType(block.exerciseType))
    if (worksheet.blocks.some(hasFullPageContent)) {
      let continuation = false
      const append = (blocks: WorksheetBlock[]) => {
        if (blocks.length === 0) return
        const sheet = {
          ...worksheet,
          blocks,
          items: blocks.flatMap((block) => block.items),
          configIndex: index,
          isContinuation: continuation,
        }
        const schoolActivities = page.domain === 'vie-scolaire' && !blocks.some(hasFullPageContent)
          ? splitTcfAudioQuestionPages(sheet, true)
          : null
        out.push(...(schoolActivities?.map((part, index) => ({ ...part, isContinuation: continuation || index > 0 })) ?? [sheet]))
        continuation = true
      }
      let preceding: WorksheetBlock[] = []
      worksheet.blocks.forEach((block, sourceBlockIndex) => {
        if (!hasFullPageContent(block)) {
          preceding.push({ ...block, sourceBlockIndex })
          return
        }
        append(preceding)
        preceding = []
        const scenario = grammarScenarioFor(block.exerciseType)
        if (scenario) {
          const stages = paginateGrammarScenario(block, scenario)
          for (const stage of stages.length ? stages : [block]) append([{ ...stage, sourceBlockIndex }])
          return
        }
        if (isGrammaireTheoryType(block.exerciseType) || block.items.some(item => item.grammarTheoryFalc)) {
          let itemOffset = 0
          for (const items of theoryPageSlices(block.items, block.tcfPageBreakAfter, page.continueOnNextPage)) {
            append([{
              ...block,
              sourceBlockIndex,
              itemOffset,
              items,
            }])
            itemOffset += items.length
          }
          return
        }
        const capacity = block.problemHelp && block.exerciseType === 'problemes-donnees-utiles' ? 2 : 1
        for (let offset = 0; offset < block.items.length; offset += capacity) {
          const end = offset + capacity
          append([{
            ...block,
            ...headingForSlice(block, offset, block.items),
            sourceBlockIndex,
            itemOffset: offset,
            document: offset === 0 ? block.document : undefined,
            items: block.items.slice(offset, end),
            problemDraftGrids: block.problemDraftGrids?.slice(offset, end),
          }])
        }
      })
      append(preceding)
      return
    }

    const isCom =
      page.exerciseType.includes('-com-orale') || page.exerciseType.includes('-com-ecrite')
    const isTheory =
      isGrammarTheoryType(page.exerciseType) || isGrammaireTheoryType(page.exerciseType)
    const isJeuxDuplex =
      page.exerciseType === 'jeux-vocabulaire' ||
      page.exerciseType === 'jeux-devinettes' ||
      page.exerciseType === 'jeux-memory' ||
      page.exerciseType === 'jeux-intrus' ||
      page.exerciseType === 'jeux-dominos'
    // Jeux recto-verso : une feuille A4 par grille (recto puis verso).
    // Pas « suite » : ce sont deux faces d’une même fiche, pas un débordement.
    if (isJeuxDuplex && worksheet.items.length >= 2) {
      const block = worksheet.blocks[0]
      worksheet.items.forEach((item, part) => {
        const side = part === 0 ? 'Recto' : 'Verso'
        out.push({
          ...worksheet,
          title: `${worksheet.title} — ${side}`,
          instruction: '',
          items: [item],
          blocks: block
            ? [
                {
                  ...block,
                  title: side,
                  instruction: '',
                  items: [item],
                },
              ]
            : worksheet.blocks,
          configIndex: index,
          isContinuation: false,
        })
      })
      return
    }
    // Loto : paires (page grilles + verso thème), puis lot animateur.
    if (page.exerciseType === 'jeux-loto' && worksheet.items.length > 0) {
      const block = worksheet.blocks[0]
      const pushSheet = (item: (typeof worksheet.items)[number], side: string) => {
        out.push({
          ...worksheet,
          title: side ? `${worksheet.title} — ${side}` : worksheet.title,
          instruction: '',
          items: [item],
          blocks: block
            ? [{ ...block, title: side || block.title, instruction: '', items: [item] }]
            : worksheet.blocks,
          configIndex: index,
          isContinuation: false,
        })
      }
      let i = 0
      while (i < worksheet.items.length) {
        const cur = worksheet.items[i]!
        const next = worksheet.items[i + 1]
        const kind = cur.gameBoard?.kind
        if (kind === 'loto-page' && next?.gameBoard?.kind === 'loto-back') {
          pushSheet(cur, 'Recto')
          pushSheet(next, 'Verso')
          i += 2
          continue
        }
        pushSheet(cur, kind === 'loto-call' ? 'Lot animateur' : '')
        i += 1
      }
      return
    }
    const phraseImagePages=splitPhraseImagePages(worksheet,{firstPageHasHeader:out.length===0})
    if(phraseImagePages){out.push(...phraseImagePages.map(sheet=>({...sheet,configIndex:index})));return}
    const cscPages = splitCscColumnPages(worksheet)
    if (cscPages) {
      out.push(...cscPages.map(sheet=>({...sheet,configIndex:index})))
      return
    }
    if (isLogistiqueDomain(page.domain)) {
      const sheets = splitLogistiquePages(worksheet, { ...logisticsLayout, firstPageHasHeader: out.length === 0 })
      out.push(...sheets.map((sheet) => ({ ...sheet, configIndex: index })))
      return
    }
    const gradedPages=splitGradedGrammarPages(worksheet)
    if (gradedPages) {
      out.push(...gradedPages.map(sheet=>({...sheet,configIndex:index})))
      return
    }

    if (page.domain === 'acm') {
      out.push(...paginateAcmWorksheet(worksheet).map((sheet) => ({ ...sheet, configIndex: index })))
      return
    }

    if (page.domain === 'santé') {
      out.push(...paginateSanteWorksheet(worksheet).map((sheet) => ({ ...sheet, configIndex: index })))
      return
    }

    const audioQuestionPages = page.domain === 'société' || page.domain === 'vie-scolaire'
      ? splitTcfAudioQuestionPages(worksheet, true)
      : isTpfFamilyDomain(page.domain) ? splitTcfAudioQuestionPages(worksheet) : null
    if (audioQuestionPages) {
      out.push(...audioQuestionPages
        .flatMap(sheet => paginateCePosters(sheet) ?? [sheet])
        .map(sheet => ({ ...sheet, configIndex: index })))
      return
    }
    const cePosterPages = paginateCePosters(worksheet)
    if (cePosterPages) {
      out.push(...cePosterPages.map((sheet) => ({ ...sheet, configIndex: index })))
      return
    }

    // TPF / TCF, et le plan de métro CFR : sauts de page après certaines questions.
    if (isTpfFamilyDomain(page.domain) || worksheet.blocks.some((block) => block.exerciseType === 'tcm-cfr-ex28')) {
      const sourceBlock = worksheet.blocks[0]
      const breaks = sourceBlock?.tcfPageBreakAfter ?? page.tcfPageBreakAfter
      const items = sourceBlock?.items ?? worksheet.items
      const cutAfter = new Set<number>()
      breaks?.forEach((on, i) => {
        if (on && i < items.length - 1) cutAfter.add(i)
      })
      if (cutAfter.size > 0 && sourceBlock) {
        const segments: number[][] = []
        let current: number[] = []
        items.forEach((_, i) => {
          current.push(i)
          if (cutAfter.has(i)) {
            segments.push(current)
            current = []
          }
        })
        if (current.length) segments.push(current)
        segments.forEach((indexes, part) => {
          const sliceItems = indexes.map((i) => items[i]!)
          const offset = indexes[0] ?? 0
          out.push({
            ...worksheet,
            items: sliceItems,
            blocks: [
              {
                ...sourceBlock,
                ...headingForSlice(sourceBlock, offset, items),
                items: sliceItems,
                itemOffset: offset,
                // Tableaux complets : les callbacks UI rajoutent itemOffset.
                tcfPageBreakAfter: breaks,
                tcfFormModes: sourceBlock.tcfFormModes,
              },
            ],
            configIndex: index,
            // Même bouton de page : feuille physique en plus, pas un onglet « suite ».
            isContinuation: part > 0,
          })
        })
        return
      }
    }

    // Théorie : une feuille, sauf aux blocs `{ kind: 'page' }` (pas de plafond de 6).
    if (isTheory) {
      const sourceBlock = worksheet.blocks[0]
      const items = sourceBlock?.items ?? worksheet.items
      const breaks = sourceBlock?.tcfPageBreakAfter ?? page.tcfPageBreakAfter
      const sheets = theoryPageSlices(items, breaks, page.continueOnNextPage)
      if (!sourceBlock || sheets.length <= 1) {
        const kept = sheets[0] ?? items.filter((item) => item.theoryBlock?.kind !== 'page')
        out.push({
          ...worksheet,
          items: kept,
          blocks: sourceBlock ? [{ ...sourceBlock, items: kept }] : worksheet.blocks,
          configIndex: index,
          isContinuation: false,
        })
        return
      }
      const keptItems = sheets.flat()
      let itemStart = 0
      sheets.forEach((sliceItems, part) => {
        const offset = itemStart
        itemStart += sliceItems.length
        out.push({
          ...worksheet,
          items: sliceItems,
          blocks: [
            {
              ...sourceBlock,
              ...headingForSlice(sourceBlock, offset, keptItems),
              document: part === 0 ? sourceBlock.document : undefined,
              items: sliceItems,
              itemOffset: offset,
            },
          ],
          configIndex: index,
          isContinuation: part > 0,
        })
      })
      return
    }

    const pageCap = 4
    const totalItems = worksheet.items.length
    if (!page.continueOnNextPage || !isCom || totalItems <= pageCap) {
      out.push({ ...worksheet, configIndex: index, isContinuation: false })
      return
    }

    let offset = 0
    let part = 0
    while (offset < totalItems) {
      const sliceEnd = offset + pageCap
      const headBlocks = worksheet.blocks
        .map((block) => ({
          ...block,
          ...headingForSlice(block, offset, block.items),
          document: part === 0 ? block.document : undefined,
          items: block.items.slice(offset, sliceEnd),
          itemOffset: offset,
          oralAnswerModes: block.oralAnswerModes?.slice(offset, sliceEnd),
          problemDraftGrids: block.problemDraftGrids?.slice(offset, sliceEnd),
        }))
        .filter((block) => block.items.length > 0)

      out.push({
        ...worksheet,
        items: headBlocks.flatMap((block) => block.items),
        blocks: headBlocks,
        configIndex: index,
        isContinuation: part > 0,
      })
      offset = sliceEnd
      part++
    }
  })

  return withTcfInformationTotals(out, defaultPoints)
}
