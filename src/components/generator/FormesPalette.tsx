import { CoordShapeButton } from '@/components/math/CoordGrid'
import {
  CELL_MM_OPTIONS,
  COORD_SHAPES,
  COORD_SHAPE_LABEL,
  clampAxesCols,
  clampAxesRows,
  maxAxesColsForCell,
  maxAxesRowsForCell,
} from '@/math/coord-reperage'
import type {
  CoordCellMm,
  CoordShape,
  CoordUnitSquares,
  ExerciseBlock,
} from '@/math/types'

export function FormesPalette({
  marks,
  selectedKind,
  onSelect,
}: {
  marks: { kind: string }[]
  selectedKind: CoordShape | null
  onSelect: (kind: CoordShape) => void
}) {
  return (
    <div className="coord-palette" role="listbox" aria-label="Formes à placer">
      {COORD_SHAPES.map((kind) => {
        const used = marks.some((mark) => mark.kind === kind)
        return (
          <button
            key={kind}
            type="button"
            role="option"
            draggable
            aria-selected={selectedKind === kind}
            className={`coord-palette-item${selectedKind === kind ? ' selected' : ''}${used ? ' used' : ''}`}
            title={used ? `${COORD_SHAPE_LABEL[kind]} (déjà sur le tableau)` : COORD_SHAPE_LABEL[kind]}
            onClick={() => onSelect(kind)}
            onDragStart={(event) => {
              event.dataTransfer.setData('coord-kind', kind)
              event.dataTransfer.effectAllowed = 'copy'
              onSelect(kind)
            }}
          >
            <CoordShapeButton kind={kind} />
            <span>{COORD_SHAPE_LABEL[kind]}</span>
          </button>
        )
      })}
    </div>
  )
}

export function ReperageAxesFields({
  cols,
  rows,
  cellMm,
  unitSquares,
  onChange,
  onLiveCols,
  onLiveRows,
}: {
  cols: number
  rows: number
  cellMm: CoordCellMm
  unitSquares: CoordUnitSquares
  onChange: (patch: Partial<ExerciseBlock>) => void
  onLiveCols?: (n: number) => void
  onLiveRows?: (n: number) => void
}) {
  const maxCols = maxAxesColsForCell(cellMm)
  const maxRows = maxAxesRowsForCell(cellMm)
  return (
    <>
      <div className="coord-size-row">
        <label>
          Colonnes · max {maxCols}
          <input
            className="pill-input"
            type="number"
            min={2}
            max={maxCols}
            step={2}
            value={cols}
            title={`Maximum ${maxCols} colonnes à ${cellMm} mm`}
            onChange={(event) => {
              const raw = Number(event.target.value)
              if (!Number.isFinite(raw)) return
              const next = Math.max(2, Math.min(maxCols, Math.round(raw)))
              if (onLiveCols) onLiveCols(next)
              else onChange({ coordCols: next })
            }}
            onBlur={() => onChange({ coordCols: clampAxesCols(cols, cellMm) })}
          />
        </label>
        <label>
          Lignes
          <input
            className="pill-input"
            type="number"
            min={2}
            max={maxRows}
            step={2}
            value={rows}
            onChange={(event) => {
              const raw = Number(event.target.value)
              if (!Number.isFinite(raw)) return
              const next = Math.max(2, Math.min(maxRows, Math.round(raw)))
              if (onLiveRows) onLiveRows(next)
              else onChange({ coordRows: next })
            }}
            onBlur={() => onChange({ coordRows: clampAxesRows(rows, cellMm) })}
          />
        </label>
      </div>
      <div className="coord-param-label">
        Graduation
        <div className="mode-toggle" role="group" aria-label="Graduation">
          <button
            type="button"
            className={unitSquares === 1 ? 'active' : ''}
            onClick={() => onChange({ coordUnitSquares: 1 })}
          >
            1 carré = 1 unité
          </button>
          <button
            type="button"
            className={unitSquares === 2 ? 'active' : ''}
            onClick={() => onChange({ coordUnitSquares: 2 })}
          >
            2 carrés = 1 unité
          </button>
        </div>
      </div>
      <div className="coord-param-label">
        Côté du carré
        <div className="mode-toggle is-3" role="group" aria-label="Côté du carré">
          {CELL_MM_OPTIONS.map((mm) => (
            <button
              key={mm}
              type="button"
              className={cellMm === mm ? 'active' : ''}
              onClick={() =>
                onChange({
                  coordCellMm: mm,
                  coordCols: clampAxesCols(cols, mm),
                  coordRows: clampAxesRows(rows, mm),
                })
              }
            >
              {mm} mm
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
