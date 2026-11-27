import { useState } from 'react'
import {
  COORD_LETTER_MAX,
  COORD_SHAPES,
  clampFormesCellMm,
  clampFormesCols,
  clampFormesRows,
  clampOrigin,
  coordSizeFor,
  ensureGivenMark,
  markOnGrid,
  nextPointLabel,
  remapMarksToOrigin,
  resolveAxesGrid,
} from '@/math/coord-reperage'
import {
  TRANSFORM_LABELS,
  TRANSFORM_MAX_POINTS,
  transformationAxis,
  transformationPoints,
  validTransformationPoints,
} from '@/math/coord-transformations'
import type {
  CoordMark,
  CoordShape,
  MathItem,
  Difficulty,
  ExerciseBlock,
  PageConfig,
} from '@/math/types'

export type CoordTool = 'origin' | 'given' | 'points' | 'center'

export type UseCoordEditingParams = {
  activeBlock: ExerciseBlock
  activeAsPage: PageConfig
  updatePage: (patch: Partial<ExerciseBlock>) => void
  isCadrans: boolean
  isComposer: boolean
  isTransform: boolean
  transformItem?: MathItem
  isTransformCentrale: boolean
}

export function useCoordEditing({
  activeBlock,
  activeAsPage,
  updatePage,
  isCadrans,
  isComposer,
  isTransform,
  transformItem,
  isTransformCentrale,
}: UseCoordEditingParams) {
  const [coordTool, setCoordTool] = useState<CoordTool>('origin')

  const axesGrid = resolveAxesGrid(activeAsPage, activeBlock.difficulty)

  const updateAxesGrid = (patch: Partial<ExerciseBlock>) => {
    const next = { ...activeBlock, ...patch }
    const grid = resolveAxesGrid({ ...activeAsPage, ...next }, next.difficulty)
    updatePage({
      ...patch,
      coordCols: grid.cols,
      coordRows: grid.rows,
      coordCellMm: grid.cellMm,
      coordUnitSquares: grid.unitSquares,
      coordMarks: isCadrans
        ? (next.coordMarks ?? []).filter((mark) =>
            markOnGrid(
              mark,
              {
                col: next.coordOriginCol ?? grid.cols / 2,
                row: next.coordOriginRow ?? grid.rows / 2,
              },
              grid.cols,
              grid.rows,
              grid.unitSquares,
            ),
          )
        : next.coordMarks,
    })
  }

  const placeOrigin = (col: number, row: number) => {
    const grid = resolveAxesGrid(activeAsPage, activeBlock.difficulty)
    const from = {
      col: activeBlock.coordOriginCol ?? grid.cols / 2,
      row: activeBlock.coordOriginRow ?? grid.rows / 2,
    }
    const to = clampOrigin(col, row, grid.cols, grid.rows)
    const remapped = remapMarksToOrigin(activeBlock.coordMarks ?? [], from, to, grid.unitSquares).filter((mark) =>
      markOnGrid(mark, to, grid.cols, grid.rows, grid.unitSquares),
    )
    updatePage({
      coordLibre: true,
      coordOriginCol: to.col,
      coordOriginRow: to.row,
      coordCols: grid.cols,
      coordRows: grid.rows,
      coordCellMm: grid.cellMm,
      coordUnitSquares: grid.unitSquares,
      coordMarks: isComposer ? ensureGivenMark(remapped) : remapped,
    })
  }

  function updateTransformation(points: CoordMark[]) {
    if (!transformItem) return
    const axis = transformationAxis(activeBlock.exerciseType, transformItem)
    if (!validTransformationPoints(points, axis, axesGrid)) return
    updatePage({
      coordLibre: true,
      coordMarks: points,
      coordSymmetryAxis: axis,
      count: points.filter(({ label }) => label !== 'Ω').length,
    })
  }

  const placeCoordMark = (x: number, y: number, kind: CoordShape) => {
    if (isTransform) {
      const scene = transformItem?.coordScene
      if (!scene) return
      const current = transformationPoints(scene)
      if (isTransformCentrale && coordTool === 'center') {
        if (current.some((mark) => mark.label !== 'Ω' && mark.x === x && mark.y === y)) return
        updateTransformation(current.map((mark) => mark.label === 'Ω' ? { ...mark, x, y } : mark))
        return
      }
      const vertices = current.filter(({ label }) => label !== 'Ω')
      if (vertices.length >= TRANSFORM_MAX_POINTS || current.some((mark) => mark.x === x && mark.y === y)) return
      const point = { x, y, kind: 'point' as const, label: TRANSFORM_LABELS[vertices.length] }
      updateTransformation([...current, point])
      return
    }
    if (isCadrans) {
      const grid = resolveAxesGrid(activeAsPage, activeBlock.difficulty)
      const origin = {
        col: activeBlock.coordOriginCol ?? grid.cols / 2,
        row: activeBlock.coordOriginRow ?? grid.rows / 2,
      }
      if (!markOnGrid({ x, y, kind: 'point' }, origin, grid.cols, grid.rows, grid.unitSquares)) return
      if (x === 0 && y === 0 && isComposer) return
      const without = (activeBlock.coordMarks ?? []).filter((mark) => !(mark.x === x && mark.y === y))
      const current = (activeBlock.coordMarks ?? []).find((mark) => mark.x === x && mark.y === y)
      const others = without.filter((mark) => !mark.given)
      const asGiven = isComposer && (coordTool === 'given' || !without.some((mark) => mark.given))
      if (!current && !asGiven && others.length >= activeBlock.count) return
      if (!current && asGiven && without.length + 1 > COORD_LETTER_MAX) return
      const nextMarks = [
        ...without.map((mark) => (asGiven ? { ...mark, given: false, showCoord: false } : mark)),
        {
          x,
          y,
          kind: 'point' as const,
          label: current?.label ?? nextPointLabel(without),
          given: asGiven,
          showCoord: asGiven,
        },
      ]
      updatePage({
        coordLibre: true,
        coordCols: grid.cols,
        coordRows: grid.rows,
        coordCellMm: grid.cellMm,
        coordUnitSquares: grid.unitSquares,
        coordOriginCol: isComposer ? origin.col : activeBlock.coordOriginCol,
        coordOriginRow: isComposer ? origin.row : activeBlock.coordOriginRow,
        coordMarks: isComposer ? ensureGivenMark(nextMarks) : nextMarks,
      })
      return
    }
    const cellMm = clampFormesCellMm(activeBlock.coordCellMm)
    const cols = clampFormesCols(activeBlock.coordCols ?? coordSizeFor(activeBlock.difficulty as Difficulty).cols, cellMm)
    const rows = clampFormesRows(activeBlock.coordRows ?? coordSizeFor(activeBlock.difficulty as Difficulty).rows, cellMm)
    if (x < 1 || y < 1 || x > cols || y > rows) return
    const without = (activeBlock.coordMarks ?? []).filter(
      (mark) => !(mark.x === x && mark.y === y) && mark.kind !== kind,
    )
    if (without.length >= COORD_SHAPES.length) return
    const nextMarks = [...without, { x, y, kind }]
    updatePage({
      coordLibre: true,
      coordCols: cols,
      coordRows: rows,
      coordCellMm: cellMm,
      coordAxis: activeBlock.coordAxis ?? 'letters',
      coordMarks: nextMarks,
      count: Math.max(activeBlock.count, nextMarks.length),
    })
  }

  const removeCoordMark = (x: number, y: number) => {
    if (isTransform) {
      const scene = transformItem?.coordScene
      if (!scene || (isTransformCentrale && coordTool === 'center')) return
      const points = transformationPoints(scene)
      const vertices = points.filter((mark) => mark.label === 'Ω' || mark.x !== x || mark.y !== y)
      if (points.length === vertices.length) return
      let index = 0
      updateTransformation(vertices.map((mark) => mark.label === 'Ω' ? mark : { ...mark, label: TRANSFORM_LABELS[index++] }))
      return
    }
    updatePage({
      coordMarks: (activeBlock.coordMarks ?? []).filter((mark) => !(mark.x === x && mark.y === y)),
    })
  }

  const placingOrigin = isComposer && coordTool === 'origin'

  return {
    coordTool,
    setCoordTool,
    placingOrigin,
    axesGrid,
    updateAxesGrid,
    placeOrigin,
    placeCoordMark,
    removeCoordMark,
  }
}
