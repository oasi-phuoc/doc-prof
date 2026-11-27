import { useId, useState } from 'react'
import { ReperageAxesFields } from '@/components/generator/FormesPalette'
import type { CoordTool } from '@/components/generator/useCoordEditing'
import { resolveAxesGrid } from '@/math/coord-reperage'
import { transformationAxis, transformationPoints, validTransformationPoints } from '@/math/coord-transformations'
import type { CoordMark, ExerciseBlock, MathItem, PageConfig } from '@/math/types'

export function TransformationEditor({ config, item, tool, onTool, update, id, fields, writeField }: {
  config: PageConfig
  item: MathItem
  tool: CoordTool
  onTool: (value: CoordTool) => void
  update: (patch: Partial<ExerciseBlock>) => void
  id: string
  fields: Record<string, string>
  writeField: (key: string, value: string | null) => void
}) {
  const [gridError, setGridError] = useState(false)
  const fieldsId = useId()
  const scene = item.coordScene
  if (!scene) return null
  const grid = resolveAxesGrid(config)
  const marks = transformationPoints(scene)
  const axis = transformationAxis(config.exerciseType, item)

  function edit(next: CoordMark[], nextAxis = axis, patch: Partial<ExerciseBlock> = {}) {
    if (!validTransformationPoints(next, nextAxis, resolveAxesGrid({ ...config, ...patch }))) return false
    setGridError(false)
    update({ ...patch, coordLibre: true, coordMarks: next, coordSymmetryAxis: nextAxis })
    return true
  }

  return (
    <section className="coord-libre-panel" aria-label="Figure et symétrie">
      <b>Figure et symétrie</b>
      {axis && (
        <div className="mode-toggle is-2" role="group" aria-label="Axe de symétrie">
          <button type="button" aria-pressed={axis === 'x'} className={axis === 'x' ? 'active' : ''} onClick={() => { if (axis !== 'x') edit(marks, 'x') }}>Abscisses (Ox)</button>
          <button type="button" aria-pressed={axis === 'y'} className={axis === 'y' ? 'active' : ''} onClick={() => { if (axis !== 'y') edit(marks, 'y') }}>Ordonnées (Oy)</button>
        </div>
      )}
      {!axis && (
        <div className="mode-toggle is-2" role="group" aria-label="Outil de placement">
          <button type="button" aria-pressed={tool !== 'center'} className={tool !== 'center' ? 'active' : ''} onClick={() => onTool('points')}>Sommets</button>
          <button type="button" aria-pressed={tool === 'center'} className={tool === 'center' ? 'active' : ''} onClick={() => onTool('center')}>Centre Ω</button>
        </div>
      )}
      <p className="type-hint muted">Cliquez sur le repère pour placer un point. Cliquez sur un sommet pour le retirer.</p>
      {marks.map((mark, index) => (
        <fieldset key={mark.label} className="libre-grid-fields coord-size-row">
          <legend>{mark.label === 'Ω' ? 'Centre Ω' : `Sommet ${mark.label}`}</legend>
          {(['x', 'y'] as const).map((component) => {
            const key = `${id}:point:${mark.label}:${component}`
            const invalid = fields[key] !== undefined
            const errorId = `${fieldsId}-${index}-${component}`
            const label = component === 'x' ? 'Abscisse' : 'Ordonnée'
            return (
              <label key={component}>
                {label}
                <input className="pill-input" type="text" aria-label={label}
                  value={fields[key] ?? String(mark[component])} data-applied-value={mark[component]}
                  aria-invalid={invalid} aria-describedby={invalid ? errorId : undefined}
                  onChange={(event) => {
                    const value = event.target.value
                    const coordinate = Number(value.trim().replace(',', '.'))
                    const next = marks.map((point, row) => index === row ? { ...point, [component]: coordinate } : point)
                    const valid = /^[-+]?\d+(?:[.,]\d+)?$/.test(value.trim()) &&
                      Number.isInteger(coordinate * grid.unitSquares) &&
                      (coordinate === mark[component] || edit(next))
                    writeField(key, valid ? null : value)
                  }} />
                {invalid && <span id={errorId} className="libre-field-error" role="alert">Placez le point et son image sur le repère en gardant une figure valide.</span>}
              </label>
            )
          })}
        </fieldset>
      ))}
      <details className="libre-theory-block">
        <summary>Dimensions et graduation du repère</summary>
        <ReperageAxesFields cols={grid.cols} rows={grid.rows} cellMm={grid.cellMm} unitSquares={grid.unitSquares}
          onChange={(patch) => {
            const next = resolveAxesGrid({ ...config, ...patch })
            if (next.cols === grid.cols && next.rows === grid.rows &&
                next.cellMm === grid.cellMm && next.unitSquares === grid.unitSquares) return
            setGridError(!edit(marks, axis, {
              coordCols: next.cols, coordRows: next.rows, coordCellMm: next.cellMm, coordUnitSquares: next.unitSquares,
            }))
          }} />
        {gridError && <p className="libre-field-error" role="alert">Gardez assez de place pour la figure et son image dans le repère.</p>}
      </details>
      {config.coordLibre && (
        <button className="button small secondary" type="button" onClick={() => {
          if (window.confirm('Revenir au tirage automatique de la figure ?')) {
            for (const key of Object.keys(fields)) {
              if (key.startsWith(`${id}:point:`)) writeField(key, null)
            }
            setGridError(false)
            update({ coordLibre: false, coordMarks: undefined, coordSymmetryAxis: undefined })
          }
        }}>Revenir à la figure automatique</button>
      )}
    </section>
  )
}
