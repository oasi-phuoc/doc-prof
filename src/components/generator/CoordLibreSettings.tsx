import { CoordGrid } from '@/components/math/CoordGrid'
import { SelectBox } from '@/components/generator/SelectBox'
import { ReperageAxesFields } from '@/components/generator/FormesPalette'
import { defaultCoordQuestionReply } from '@/components/generator/WorksheetSheet'
import {
  CoordQuestionsLibreEditor,
  resizeCoordQuestionsLibre,
} from '@/math/CoordQuestionsLibreEditor'
import {
  COORD_SHAPES,
  FORMES_CELL_MM_OPTIONS,
  clampFormesCellMm,
  FORMES_MAX_BY_MM,
  maxFormesColsForCell,
  maxFormesRowsForCell,
  resolveAxesGrid,
  resolveFormesGrid,
  sceneFromAxesLibre,
} from '@/math/coord-reperage'
import type { CoordAxis, ExerciseBlock, PageConfig, WorksheetPage } from '@/math/types'
import type { CoordTool } from '@/components/generator/useCoordEditing'
import type { Dispatch, SetStateAction } from 'react'

export type CoordLibreSettingsProps = {
  liveCoordQuestions?: boolean
  activeBlock: ExerciseBlock
  activeAsPage: PageConfig
  updatePage: (patch: Partial<ExerciseBlock>) => void
  isFormes: boolean
  isCadrans: boolean
  isComposer: boolean
  isDroites: boolean
  isConstruire: boolean
  axesGrid: ReturnType<typeof resolveAxesGrid>
  updateAxesGrid: (patch: Partial<ExerciseBlock>) => void
  coordTool: CoordTool
  setCoordTool: Dispatch<SetStateAction<CoordTool>>
  placeCoordMark: (x: number, y: number, kind: import('@/math/types').CoordShape) => void
  placeOrigin: (col: number, row: number) => void
  removeCoordMark: (x: number, y: number) => void
  activeSheet: WorksheetPage | undefined
  safeBlockIndex: number
}

export function CoordLibreSettings({
  liveCoordQuestions,
  activeBlock,
  activeAsPage,
  updatePage,
  isFormes,
  isCadrans,
  isComposer,
  isDroites,
  isConstruire,
  axesGrid,
  updateAxesGrid,
  coordTool,
  setCoordTool,
  placeCoordMark,
  placeOrigin,
  removeCoordMark,
  activeSheet,
  safeBlockIndex,
}: CoordLibreSettingsProps) {
  const cfrScene = activeSheet?.blocks?.find((block, index) => (block.sourceBlockIndex ?? index) === safeBlockIndex)
    ?.items[0]?.coordScene
  const composed = Boolean(activeBlock.coordLibre && !activeBlock.libreItems?.length)
  const formGrid = resolveFormesGrid(activeAsPage, activeBlock.difficulty)
  const formAxis = cfrScene?.variant === 'cells' ? cfrScene.axis : activeBlock.coordAxis ?? 'letters'
  function updateFormesGrid(patch: Partial<ExerciseBlock>) {
    const next = resolveFormesGrid({ ...activeAsPage, ...patch }, activeBlock.difficulty)
    const marks = composed ? activeBlock.coordMarks : activeBlock.libreItems?.length && cfrScene?.variant === 'cells' ? cfrScene.marks : undefined
    if (marks?.some(({ x, y }) => x > next.cols || y > next.rows)) {
      window.alert('Le tableau doit contenir toutes les formes déjà placées.')
      return
    }
    updatePage({
      ...patch, coordCols: next.cols, coordRows: next.rows, coordCellMm: next.cellMm,
      ...(marks ? { coordLibre: true, coordMarks: marks } : {}),
    })
  }
  function resetComposition() {
    if (!activeBlock.coordLibre) return
    if (activeBlock.coordMarks?.length && !window.confirm('Revenir à la composition automatique du repère ?')) return
    updatePage({ coordLibre: false, coordMarks: undefined })
  }
  const cfrUnit = activeBlock.coordUnitSquares ?? cfrScene?.unitSquares ?? 1
  const cfrMax = activeBlock.coordRange ?? cfrScene?.rangeX ?? 22 / cfrUnit
  return (
    <>
      {activeBlock.exerciseType === 'tcm-cfr-ex27' && (
        <div className="coord-libre-panel">
          <b>Graduation du repère</b>
          <SelectBox label="Graduation des axes" value={String(cfrUnit)} onChange={value => updatePage({ coordUnitSquares: Number(value) as 1 | 2, coordRange: cfrMax, libreItems: undefined, libreInstruction: undefined })}>
            <option value="1">1 carré = 1 unité</option>
            <option value="2">2 carrés = 1 unité</option>
          </SelectBox>
          <label className="coord-param-label">Valeur maximale des axes
            <input type="number" min={3} max={30} step={1} value={cfrMax}
              onChange={event => { const value = event.currentTarget.valueAsNumber; if (Number.isFinite(value)) updatePage({ coordRange: Math.max(3, Math.min(30, Math.round(value))), coordUnitSquares: cfrUnit, libreItems: undefined, libreInstruction: undefined }) }} />
          </label>
        </div>
      )}
              {isFormes ? (
                <div className="coord-libre-panel">
                  <b>Composition du tableau</b>
                  <div className="mode-toggle" role="group" aria-label="Mode du tableau">
                    <button
                      type="button"
                      className={!composed ? 'active' : ''}
                      onClick={resetComposition}
                    >
                      Automatique
                    </button>
                    <button
                      type="button"
                      className={composed ? 'active' : ''}
                      onClick={() => {
                        if (composed) return
                        const scene = cfrScene?.variant === 'cells' ? cfrScene : undefined
                        updatePage({
                          coordLibre: true,
                          coordCols: scene?.cols ?? formGrid.cols,
                          coordRows: scene?.rows ?? formGrid.rows,
                          coordCellMm: scene?.cellMm ?? formGrid.cellMm,
                          coordAxis: formAxis,
                          coordMarks: scene?.marks ?? [],
                        })
                      }}
                    >
                      Libre
                    </button>
                    </div>
                  <SelectBox
                    label="Axes"
                    value={formAxis}
                    onChange={(value) => updateFormesGrid({ coordAxis: value as CoordAxis })}
                  >
                    <option value="letters">Lettres en bas</option>
                    <option value="letters-y">Lettres à gauche</option>
                    <option value="numeric">Nombres seulement</option>
                  </SelectBox>
                  <div className="coord-size-row">
                    <label>
                      Largeur · max {maxFormesColsForCell(clampFormesCellMm(activeBlock.coordCellMm))}
                      <input
                        className="pill-input"
                        type="number"
                        min={3}
                        max={maxFormesColsForCell(clampFormesCellMm(activeBlock.coordCellMm))}
                        value={formGrid.cols}
                        onChange={(event) => {
                          if (event.currentTarget.value) updateFormesGrid({ coordCols: event.currentTarget.valueAsNumber })
                        }}
                      />
                    </label>
                    <label>
                      Hauteur · max {maxFormesRowsForCell(clampFormesCellMm(activeBlock.coordCellMm))}
                      <input
                        className="pill-input"
                        type="number"
                        min={3}
                        max={maxFormesRowsForCell(clampFormesCellMm(activeBlock.coordCellMm))}
                        value={formGrid.rows}
                        onChange={(event) => {
                          if (event.currentTarget.value) updateFormesGrid({ coordRows: event.currentTarget.valueAsNumber })
                        }}
                      />
                    </label>
                  </div>
                  <div className="coord-param-label">
                    Côté du carré
                    <div className="mode-toggle is-3" role="group" aria-label="Côté du carré">
                      {FORMES_CELL_MM_OPTIONS.map((mm) => (
                        <button
                          key={mm}
                          type="button"
                          className={clampFormesCellMm(activeBlock.coordCellMm) === mm ? 'active' : ''}
                          onClick={() => updateFormesGrid({ coordCellMm: mm })}
                        >
                          {mm} mm
                        </button>
                      ))}
                    </div>
                  </div>
                  {composed ? (
                    <>
                      <p className="type-hint muted">
                        Choisissez une forme puis cliquez sur une case du tableau, ou faites-la glisser sur cette case.
                        Chaque forme n’apparaît qu’une fois.
                      </p>
                      <p className="type-hint muted">
                        {(activeBlock.coordMarks?.length ?? 0)} / {COORD_SHAPES.length} forme
                        {COORD_SHAPES.length > 1 ? 's' : ''}
                        {' · '}
                        {FORMES_MAX_BY_MM[clampFormesCellMm(activeBlock.coordCellMm)].cols} ×{' '}
                        {FORMES_MAX_BY_MM[clampFormesCellMm(activeBlock.coordCellMm)].rows} au plus à{' '}
                        {clampFormesCellMm(activeBlock.coordCellMm)} mm.
                      </p>
                      {(activeBlock.coordMarks?.length ?? 0) > 0 ? (
                        <button
                          type="button"
                          className="button secondary"
                          onClick={() => updatePage({ coordMarks: [] })}
                        >
                          Vider le tableau
                        </button>
                      ) : null}
                    </>
                  ) : (
                    <p className="type-hint muted">
                      Une seule grille centrée. Chaque forme n’apparaît qu’une fois. Le champ Questions ajoute des
                      formes. Maximum : 16 × 12 à 10 mm, 21 × 15 à 8 mm, 26 × 20 à 6 mm. Les colonnes 1 / 2 / 3
                      séparent les questions, pas le tableau.
                    </p>
                  )}
                </div>
              ) : isCadrans ? (
                <div className="coord-libre-panel">
                  <b>{isComposer ? 'Composer les points' : 'Repère (4 cadrans)'}</b>
                  <div className="mode-toggle" role="group" aria-label="Mode du repère">
                    <button
                      type="button"
                      className={!composed ? 'active' : ''}
                      onClick={resetComposition}
                    >
                      Automatique
                    </button>
                    <button
                      type="button"
                      className={composed ? 'active' : ''}
                      onClick={() => {
                        if (composed) return
                        const scene = cfrScene?.variant === 'axes' ? cfrScene : undefined
                        updatePage({
                          coordLibre: true,
                          coordCols: scene?.cols ?? axesGrid.cols,
                          coordRows: scene?.rows ?? axesGrid.rows,
                          coordCellMm: scene?.cellMm ?? axesGrid.cellMm,
                          coordUnitSquares: scene?.unitSquares ?? axesGrid.unitSquares,
                          coordMarks: scene?.marks ?? [],
                          coordOriginCol: scene?.originCol ?? activeBlock.coordOriginCol ?? Math.round(axesGrid.cols / 2),
                          coordOriginRow: scene?.originRow ?? activeBlock.coordOriginRow ?? Math.round(axesGrid.rows / 2),
                        })
                      }}
                    >
                      Libre
                    </button>
                  </div>
                  <ReperageAxesFields
                    cols={activeBlock.coordCols ?? axesGrid.cols}
                    rows={activeBlock.coordRows ?? axesGrid.rows}
                    cellMm={axesGrid.cellMm}
                    unitSquares={axesGrid.unitSquares}
                    onChange={updateAxesGrid}
                  />
                  {composed ? (
                    <>
                      {isComposer ? (
                        <div className="mode-toggle is-3" role="group" aria-label="Outil de placement">
                          <button
                            type="button"
                            className={coordTool === 'origin' ? 'active' : ''}
                            onClick={() => setCoordTool('origin')}
                          >
                            Origine
                          </button>
                          <button
                            type="button"
                            className={coordTool === 'given' ? 'active' : ''}
                            onClick={() => setCoordTool('given')}
                          >
                            Point donné
                          </button>
                          <button
                            type="button"
                            className={coordTool === 'points' ? 'active' : ''}
                            onClick={() => setCoordTool('points')}
                          >
                            Autres points
                          </button>
                        </div>
                      ) : null}
                      <div className="coord-axes-editor">
                        <CoordGrid
                          scene={sceneFromAxesLibre(activeAsPage, activeBlock.difficulty)}
                          editable
                          placingOrigin={isComposer && coordTool === 'origin'}
                          onPlace={(x, y) => placeCoordMark(x, y, 'point')}
                          onPlaceOrigin={placeOrigin}
                          onRemove={removeCoordMark}
                        />
                      </div>
                      <p className="type-hint muted">
                        {isComposer
                          ? 'Placez l’origine (invisible sur la fiche), un point donné avec ses coordonnées, puis les autres points à lire. Le champ Questions limite les points à compléter (26 lettres au plus).'
                          : 'Cliquez une intersection pour poser A, B, C… Le champ Questions limite le nombre de points. Cliquez un point pour le retirer. Colonnes et lignes restent paires.'}
                      </p>
                      <p className="type-hint muted">
                        {isComposer
                          ? `${(activeBlock.coordMarks ?? []).filter((mark) => !mark.given).length} / ${activeBlock.count} point${activeBlock.count > 1 ? 's' : ''} à lire`
                          : `${activeBlock.coordMarks?.length ?? 0} / ${activeBlock.count} point${activeBlock.count > 1 ? 's' : ''}`}
                      </p>
                      {(activeBlock.coordMarks?.length ?? 0) > 0 ? (
                        <button
                          type="button"
                          className="button secondary"
                          onClick={() => updatePage({ coordMarks: [] })}
                        >
                          Vider le repère
                        </button>
                      ) : null}
                    </>
                  ) : (
                    <p className="type-hint muted">
                      {isComposer
                        ? 'Une grille sans axes x / y. L’origine est placée au hasard. Un point est donné avec ses coordonnées ; les autres se complètent comme pour lire les cadrans.'
                        : 'Une seule grille à 4 cadrans, centrée. Colonnes et lignes (nombres pairs) font grandir le tableau ; les carrés restent à 3, 4 ou 5 mm (56, 42 ou 34 colonnes au plus). Les colonnes 1 / 2 / 3 séparent les questions, pas le tableau.'}
                    </p>
                  )}
                </div>
              ) : isDroites || isConstruire ? (
                <div className="coord-libre-panel">
                  <b>{isDroites ? 'Repère (droites)' : 'Repère (construction)'}</b>
                  <div className="mode-toggle" role="group" aria-label="Mode des questions">
                    <button
                      type="button"
                      className={!activeBlock.coordLibre ? 'active' : ''}
                      onClick={() => {
                        if (activeBlock.coordQuestionsLibre?.some((question) => question.libreId) &&
                          !window.confirm('Revenir aux questions automatiques et remplacer les modifications de cette activité ?')) return
                        updatePage({ coordLibre: false, coordQuestionsLibre: undefined })
                      }}
                    >
                      Automatique
                    </button>
                    <button
                      type="button"
                      className={activeBlock.coordLibre ? 'active' : ''}
                      onClick={() => {
                        const fromSheet = activeSheet?.blocks[safeBlockIndex]?.items[0]?.coordQuestions
                        updatePage({
                          coordLibre: true,
                          coordQuestionsLibre: resizeCoordQuestionsLibre(
                            activeBlock.coordQuestionsLibre?.length ? activeBlock.coordQuestionsLibre : fromSheet,
                            activeBlock.count,
                            defaultCoordQuestionReply(activeBlock.exerciseType),
                          ),
                        })
                      }}
                    >
                      Libre
                    </button>
                  </div>
                  <ReperageAxesFields
                    cols={activeBlock.coordCols ?? axesGrid.cols}
                    rows={activeBlock.coordRows ?? axesGrid.rows}
                    cellMm={axesGrid.cellMm}
                    unitSquares={axesGrid.unitSquares}
                    onChange={updateAxesGrid}
                    onLiveCols={(n) => updatePage({ coordCols: n })}
                    onLiveRows={(n) => updatePage({ coordRows: n })}
                  />
                  {activeBlock.coordLibre || liveCoordQuestions ? (
                    <CoordQuestionsLibreEditor
                      questions={
                        activeBlock.coordQuestionsLibre ??
                        resizeCoordQuestionsLibre(
                          activeSheet?.blocks.find((block, index) => (block.sourceBlockIndex ?? index) === safeBlockIndex)
                            ?.items[0]?.coordQuestions,
                          activeBlock.count,
                          defaultCoordQuestionReply(activeBlock.exerciseType),
                        )
                      }
                      defaultReply={defaultCoordQuestionReply(activeBlock.exerciseType)}
                      maxCount={isConstruire ? 8 : 10}
                      onChange={(next) => {
                        const capped = next.slice(0, isConstruire ? 8 : 10)
                        updatePage({
                          coordLibre: true,
                          coordQuestionsLibre: capped,
                          count: Math.max(1, capped.length),
                        })
                      }}
                    />
                  ) : null}
                  <p className="type-hint muted">
                    {isDroites
                      ? activeBlock.coordLibre
                        ? 'Mode libre : le repère (droites) reste généré ; vous rédigez ou modifiez les questions et les réponses du corrigé.'
                        : 'Une seule grille centrée. Colonnes et lignes (nombres pairs) font grandir le tableau ; les carrés restent à 3, 4 ou 5 mm (56, 42 ou 34 colonnes au plus). Chaque droite a une couleur et un tracé distinct, lisible en noir et blanc.'
                      : activeBlock.coordLibre
                          ? 'Mode libre : la figure du repère reste générée ; vous rédigez ou modifiez les questions et les réponses du corrigé.'
                          : 'Une grille vide centrée, avec deux points donnés. Colonnes et lignes (nombres pairs) font grandir le tableau ; les carrés restent à 3, 4 ou 5 mm (56, 42 ou 34 colonnes au plus). Le corrigé montre les tracés.'}
                  </p>
                </div>
              ) : null}

    </>
  )
}
