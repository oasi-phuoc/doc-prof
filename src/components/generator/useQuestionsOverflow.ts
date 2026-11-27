import { useEffect, useState, type RefObject } from 'react'
import type { InstitutionalHeader } from '@/components/math/PrintDocumentChrome'
import type { ExerciseBlock, PreviewMode, WorksheetPage } from '@/math/types'
import type { A5WorksheetPair } from './sheet-format'

type OverflowDeps = {
  previewFrameRef: RefObject<HTMLDivElement | null>
  previewWorksheets: WorksheetPage[]
  pageIndex: number
  sheetIndex: number
  mode: PreviewMode
  seed: number
  activeBlock: ExerciseBlock
  extraBlocks: ExerciseBlock[] | undefined
  evalMode: boolean
  institutional: InstitutionalHeader
  physicalSheets?: readonly A5WorksheetPair[] | null
}

/**
 * Observe la fiche A4 et signale si le contenu déborde
 * (grille, corps, pied chevauché).
 */
export function useQuestionsOverflow({
  previewFrameRef,
  previewWorksheets,
  pageIndex,
  sheetIndex,
  mode,
  seed,
  activeBlock,
  extraBlocks,
  evalMode,
  institutional,
  physicalSheets,
}: OverflowDeps): boolean {
  const [questionsOverflow, setQuestionsOverflow] = useState(false)

  useEffect(() => {
    const frame = previewFrameRef.current
    if (!frame) return
    const stage = frame.closest('.sheet-stage') ?? frame

    const measurePanel = (root: HTMLElement) => {
      const body = root.querySelector<HTMLElement>('.sheet-body')
      const grids = root.querySelectorAll<HTMLElement>('.exercise-grid')
      const footer = root.querySelector<HTMLElement>('.doc-footer')
      if (!body || root.clientHeight === 0) return false

      // Hauteur naturelle du contenu (sans compression) vs place disponible sous l'en-tête.
      const bodyLimit = body.clientHeight
      const sheetOverflow = root.scrollHeight > root.clientHeight + 2
      const bodyOverflow = body.scrollHeight > body.clientHeight + 2
      const gridOverflow = Array.from(grids).some((grid) => Math.max(grid.scrollHeight, grid.offsetHeight) > bodyLimit + 2)

      // Pied chevauché / poussé hors feuille si le corps déborde.
      let footerClash = false
      if (footer) {
        const sheetBox = root.getBoundingClientRect()
        const footerBox = footer.getBoundingClientRect()
        footerClash = footerBox.bottom > sheetBox.bottom + 1
      }

      return sheetOverflow || bodyOverflow || gridOverflow || footerClash
    }

    const measure = () => {
      const panels = stage.querySelectorAll<HTMLElement>('.a5-half, .worksheet-sheet:not(.is-a5-double)')
      setQuestionsOverflow(Array.from(panels).some(measurePanel))
    }

    measure()
    const raf = requestAnimationFrame(measure)
    const observer = new ResizeObserver(measure)
    stage.querySelectorAll('.worksheet-sheet, .sheet-body, .exercise-grid, .exercise-block').forEach((node) => observer.observe(node))
    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
    }
  }, [
    previewFrameRef,
    previewWorksheets,
    pageIndex,
    sheetIndex,
    mode,
    seed,
    activeBlock.count,
    activeBlock.columns,
    activeBlock.exerciseType,
    activeBlock.coordLibre,
    activeBlock.coordCols,
    activeBlock.coordRows,
    activeBlock.coordAxis,
    activeBlock.coordRange,
    activeBlock.coordCellMm,
    activeBlock.coordUnitSquares,
    activeBlock.coordOriginCol,
    activeBlock.coordOriginRow,
    activeBlock.coordMarks,
    extraBlocks,
    evalMode,
    institutional,
    physicalSheets,
  ])

  return questionsOverflow
}
