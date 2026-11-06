import type { Dispatch, SetStateAction } from 'react'
import { isPhraseLibreEditable } from '@/francais/PhraseLibreEditor'
import { buildAlphaSeriesPages } from '@/alphabetisation/series'
import { alphaFicheTitle, resolveAlphaSelection } from '@/alphabetisation/themes'
import { buildSoutienSeriesPages, soutienFicheTitle } from '@/francais/soutien/series'
import { resolveSoutienSelection } from '@/francais/soutien/themes'
import {
  isCalligraphieType,
  reshuffleCalliContent,
} from '@/calligraphie/generate'
import { parseCalliLines } from '@/calligraphie/defaults'
import { reshuffleGameContent } from '@/jeux/bank'
import { isJeuxType } from '@/jeux/templates'
import { tcfNiveauForConfig } from '@/tcf/catalog'
import { buildTpfFamilyTestPages, nextLastPoExercise } from '@/tcf/generate'
import { buildWorksheets } from '@/math/generate'
import { pageBlocks, setPageBlock } from '@/math/page-model'
import { randomSeed } from '@/math/rng'
import type {
  ExerciseBlock,
  PageConfig,
  PreviewMode,
} from '@/math/types'
import type { InstitutionalHeader } from '@/components/math/PrintDocumentChrome'
import { clearLibreContentFreeze } from '@/components/generator/page-helpers'
import { blockItemsForConfig } from '@/components/generator/sheet-items'
import { patchBlockSeedForHalf } from '@/components/generator/sheet-format'
import { isTpmFamilyExercise, recalcTpmLibreItems } from '@/tpm/libre-recalc'

export type UseGenerateActionsParams = {
  pages: PageConfig[]
  setPages: Dispatch<SetStateAction<PageConfig[]>>
  setSeed: Dispatch<SetStateAction<number>>
  setMode: Dispatch<SetStateAction<PreviewMode>>
  setEvalMode: Dispatch<SetStateAction<boolean>>
  setSheetIndex: Dispatch<SetStateAction<number>>
  setBlockIndex: Dispatch<SetStateAction<number>>
  setInstitutional: Dispatch<SetStateAction<InstitutionalHeader>>
  setLibreSnapshot: Dispatch<SetStateAction<PageConfig[] | null>>
  pageIndex: number
  safeBlockIndex: number
  seed: number
  libreMode: boolean
  activeBlock: ExerciseBlock
  calliFieldsLength: number
  isPhraseDomain: boolean
  isCalliDomain: boolean
  isJeuxDomain: boolean
  isTcf: boolean
  isGrammaireExercise?: boolean
  updatePage: (patch: Partial<PageConfig>) => void
}

export function useGenerateActions({
  pages,
  setPages,
  setSeed,
  setMode,
  setEvalMode,
  setSheetIndex,
  setBlockIndex,
  setInstitutional,
  setLibreSnapshot,
  pageIndex,
  safeBlockIndex,
  seed,
  libreMode,
  activeBlock,
  calliFieldsLength,
  isPhraseDomain,
  isCalliDomain,
  isJeuxDomain,
  isTcf,
  isGrammaireExercise,
  updatePage,
}: UseGenerateActionsParams) {
  /** Applique les changements manuels (mode libre / réglages) à la fiche. */
  function validateManual() {
    const phraseEditable = isPhraseDomain && isPhraseLibreEditable(activeBlock.exerciseType)
    const ownEditor = phraseEditable || isCalliDomain || isJeuxDomain || isTcf || Boolean(isGrammaireExercise)
    const apply = (current: PageConfig[]): PageConfig[] => {
      const page = current[pageIndex]
      if (!page) return current
      const block = pageBlocks(page)[safeBlockIndex]
      if (!block) return current
      const nextLocal = (block.contentSeed ?? 0) + 1

      if (libreMode && phraseEditable && Array.isArray(block.phraseItems) && block.phraseItems.length > 0) {
        return current.map((p, i) =>
          i !== pageIndex
            ? p
            : setPageBlock(p, safeBlockIndex, {
                contentSeed: nextLocal,
                phraseItems: block.phraseItems!.map((item) => ({ ...item })),
                phraseInstruction: block.phraseInstruction,
                libreItems: undefined,
                libreInstruction: undefined,
              }),
        )
      }

      // Éditeur dédié (TCF, calligraphie, jeux, phrases) : ses valeurs sont déjà dans la page ;
      // on retire tout contenu figé pour que l’aperçu se reconstruise à partir d’elles.
      if (libreMode && ownEditor) {
        return current.map((p, i) =>
          i !== pageIndex ? p : setPageBlock(p, safeBlockIndex, { libreItems: undefined, libreInstruction: undefined }),
        )
      }

      // Contenu libre déjà saisi : on le fige explicitement (nouvelles refs) pour forcer l’aperçu.
      // TPM / TCM CFR : recalcule les réponses à partir des valeurs éditées.
      if (libreMode && Array.isArray(block.libreItems) && block.libreItems.length > 0) {
        const frozen =
          isTpmFamilyExercise(block.exerciseType) ||
          page.domain === 'algèbre' ||
          page.domain === 'géométrie'
            ? recalcTpmLibreItems(block.libreItems, block.exerciseType)
            : block.libreItems.map((item) => ({ ...item }))
        return current.map((p, i) =>
          i !== pageIndex
            ? p
            : setPageBlock(p, safeBlockIndex, {
                contentSeed: nextLocal,
                libreItems: frozen,
                libreInstruction: block.libreInstruction,
              }),
        )
      }
      if (libreMode && Array.isArray(block.phraseItems) && block.phraseItems.length > 0) {
        return current.map((p, i) =>
          i !== pageIndex
            ? p
            : setPageBlock(p, safeBlockIndex, {
                contentSeed: nextLocal,
                phraseItems: block.phraseItems!.map((item) => ({ ...item })),
                phraseInstruction: block.phraseInstruction,
              }),
        )
      }

      // Sinon : régénère avec les paramètres courants, puis reprend le résultat en overlay libre.
      const cleared = setPageBlock(page, safeBlockIndex, {
        contentSeed: nextLocal,
        libreItems: undefined,
        libreInstruction: undefined,
      })
      if (!libreMode) {
        return current.map((p, i) => (i !== pageIndex ? p : cleared))
      }
      const builtSheets = buildWorksheets(
        current.map((p, i) => (i !== pageIndex ? p : cleared)),
        seed,
      )
      const builtBlock = blockItemsForConfig(builtSheets, pageIndex, safeBlockIndex)
      if (!builtBlock || builtBlock.items.length === 0) {
        return current.map((p, i) => (i !== pageIndex ? p : cleared))
      }
      return current.map((p, i) =>
        i !== pageIndex
          ? p
          : setPageBlock(cleared, safeBlockIndex, {
              libreItems: builtBlock.items.map((item) => ({ ...item })),
              libreInstruction: builtBlock.instruction,
            }),
      )
    }
    const next = apply(pages)
    setPages(next)
    if (libreMode) setLibreSnapshot(next)
  }

  /** TPF / TCF : Générer tire un test complet (niveaux du domaine, banque commune). */
  function drawTcfTest() {
    const nextSeed = randomSeed()
    setSeed(nextSeed)
    setMode('student')
    setSheetIndex(0)
    setBlockIndex(0)
    const domain = pages[pageIndex]?.domain ?? pages[0]?.domain ?? 'tpf'
    setPages(buildTpfFamilyTestPages(domain, nextSeed))
  }

  /** Soutien FR : Générer prépare les 12 fiches du son sélectionné. */
  function drawSoutienSeries() {
    const sel = resolveSoutienSelection(activeBlock.topic, activeBlock.exerciseType)
    if (!sel) {
      generate()
      return
    }
    const nextSeed = randomSeed()
    setSeed(nextSeed)
    setMode('student')
    setEvalMode(false)
    setSheetIndex(0)
    setBlockIndex(0)
    setInstitutional((current) => ({
      ...current,
      course: 'Français',
      documentTitle: soutienFicheTitle(sel.letter),
    }))
    setPages(buildSoutienSeriesPages(sel.sound.bankId, sel.theme.id))
  }

  /** Alphabétisation : Générer prépare toutes les fiches de la leçon / du son. */
  function drawAlphaSeries() {
    const sel = resolveAlphaSelection(activeBlock.topic, activeBlock.exerciseType)
    if (!sel) {
      generate()
      return
    }
    const nextSeed = randomSeed()
    setSeed(nextSeed)
    setMode('student')
    setEvalMode(false)
    setSheetIndex(0)
    setBlockIndex(0)
    setInstitutional((current) => ({
      ...current,
      course: 'Français',
      documentTitle: alphaFicheTitle(sel.letter),
    }))
    setPages(buildAlphaSeriesPages(sel.sound.bankId, sel.theme.id))
  }

  function generate() {
    const nextSeed = randomSeed()
    setSeed(nextSeed)
    setMode('student')
    const release = clearLibreContentFreeze()
    if (isCalligraphieType(activeBlock.exerciseType)) {
      const nextText = reshuffleCalliContent(nextSeed, {
        exerciseType: activeBlock.exerciseType,
        topic: activeBlock.topic,
        difficulty: activeBlock.difficulty,
        calliText: activeBlock.calliText,
        calliFont: activeBlock.calliFont,
        calliSize: activeBlock.calliSize,
        vocabSubgroup: activeBlock.vocabSubgroup,
        countHint: Math.max(parseCalliLines(activeBlock.calliText).length, calliFieldsLength),
      })
      updatePage({ ...release, calliText: nextText, contentSeed: nextSeed, coordLibre: false })
      return
    }
    if (activeBlock.verbGroup === 'libre' && isPhraseLibreEditable(activeBlock.exerciseType)) {
      // Nouveau tirage banque → l’effet resynchronise phraseItems.
      updatePage({
        ...release,
        phraseItems: undefined,
        phraseInstruction: undefined,
        contentSeed: nextSeed,
        coordLibre: false,
      })
      return
    }
    if (isJeuxType(activeBlock.exerciseType)) {
      const reshuffled = reshuffleGameContent(activeBlock.exerciseType, nextSeed, {
        gameSource: activeBlock.gameSource,
        gameTopic: activeBlock.gameTopic,
        gameSelectedIds: activeBlock.gameSelectedIds,
        gameEntries: activeBlock.gameEntries,
      })
      updatePage({
        ...release,
        gameEntries: reshuffled.gameEntries,
        gameText: reshuffled.gameText,
        gameSelectedIds: reshuffled.gameSelectedIds,
        contentSeed: nextSeed,
        coordLibre: false,
      })
      return
    }
    // Tous domaines : lève l’overlay libre (sinon la graine / le type ne s’appliquent plus).
    updatePage({
      ...release,
      contentSeed: nextSeed,
      coordLibre: false,
    })
  }

  /** Régénère uniquement l’exercice ciblé (les autres blocs / pages restent inchangés). */
  function regenerateBlock(targetBlock: number, half?: 'left' | 'right') {
    const nextSeed = randomSeed()
    setMode('student')
    setBlockIndex(targetBlock)
    setPages((current) =>
      current.map((page, index) => {
        if (index !== pageIndex) return page
        const block = pageBlocks(page)[targetBlock]
        if (!block) return page
        const release = clearLibreContentFreeze()
        const seedPatch = half
          ? patchBlockSeedForHalf(block, half, nextSeed)
          : { contentSeed: nextSeed, contentSeedTwin: undefined }
        let patch: Partial<ExerciseBlock> = {
          ...release,
          ...seedPatch,
          // Repérage : reprend un tirage banque (les marques figées bloqueraient le refresh).
          coordLibre: false,
        }
        const isLastCscCfrPo =
          !half &&
          (page.domain === 'tcf-csc' || page.domain === 'tcf-cfr') &&
          block.exerciseType === 'tcf-po' &&
          !current.some(
            (other, otherIndex) =>
              otherIndex > index && other.domain === page.domain && other.exerciseType === 'tcf-po',
          )
        if (isLastCscCfrPo) {
          const avoid = current.flatMap((other, otherIndex) =>
            otherIndex === index || !other.tcfBankId ? [] : [other.tcfBankId],
          )
          if (block.tcfBankId) avoid.push(block.tcfBankId)
          const next = nextLastPoExercise(
            tcfNiveauForConfig(page.domain, block.difficulty),
            nextSeed,
            avoid,
          )
          if (next) {
            patch = {
              ...patch,
              tcfBankId: next.id,
              tcfScenario: next.scenario,
              tcfExercise: undefined,
            }
          }
        }
        // Contenu figé (calli / jeux / phrase libre) : ne retirer que la moitié touchée.
        const shouldReshuffleContent = !half || half === 'left'
        if (shouldReshuffleContent && isCalligraphieType(block.exerciseType)) {
          patch = {
            ...patch,
            calliText: reshuffleCalliContent(nextSeed, {
              exerciseType: block.exerciseType,
              topic: block.topic,
              difficulty: block.difficulty,
              calliText: block.calliText,
              calliFont: block.calliFont,
              calliSize: block.calliSize,
              vocabSubgroup: block.vocabSubgroup,
              countHint: Math.max(parseCalliLines(block.calliText).length, 1),
            }),
          }
        } else if (shouldReshuffleContent && block.verbGroup === 'libre' && isPhraseLibreEditable(block.exerciseType)) {
          patch = {
            ...patch,
            phraseItems: undefined,
            phraseInstruction: undefined,
          }
        } else if (shouldReshuffleContent && isJeuxType(block.exerciseType)) {
          const reshuffled = reshuffleGameContent(block.exerciseType, nextSeed, {
            gameSource: block.gameSource,
            gameTopic: block.gameTopic,
            gameSelectedIds: block.gameSelectedIds,
            gameEntries: block.gameEntries,
          })
          patch = {
            ...patch,
            gameEntries: reshuffled.gameEntries,
            gameText: reshuffled.gameText,
            gameSelectedIds: reshuffled.gameSelectedIds,
          }
        }
        return setPageBlock(page, targetBlock, patch)
      }),
    )
  }

  return {
    validateManual,
    drawTcfTest,
    drawSoutienSeries,
    drawAlphaSeries,
    generate,
    regenerateBlock,
  }
}
