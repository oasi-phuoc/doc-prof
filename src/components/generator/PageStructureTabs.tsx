import { TabRemoveButton } from '@/components/generator/TabRemoveButton'
import { removePageBlock } from '@/math/page-model'
import type { Dispatch, SetStateAction } from 'react'
import type { ExerciseBlock, PageConfig, WorksheetPage } from '@/math/types'

export type PageStructureTabsProps = {
  worksheets: WorksheetPage[]
  pages: PageConfig[]
  safeSheetIndex: number
  setSheetIndex: Dispatch<SetStateAction<number>>
  setBlockIndex: Dispatch<SetStateAction<number>>
  setPages: Dispatch<SetStateAction<PageConfig[]>>
  pageIndex: number
  pageExerciseBlocks: ExerciseBlock[]
  safeBlockIndex: number
  activeSheet: WorksheetPage | undefined
  firstExerciseNo: number
  isTpmLike: boolean
  addPage: () => void
  addExerciseOnPage: () => void
  removePage: (configIdx: number) => void
}

export function PageStructureTabs({
  worksheets,
  pages,
  safeSheetIndex,
  setSheetIndex,
  setBlockIndex,
  setPages,
  pageIndex,
  pageExerciseBlocks,
  safeBlockIndex,
  activeSheet,
  firstExerciseNo,
  isTpmLike,
  addPage,
  addExerciseOnPage,
  removePage,
}: PageStructureTabsProps) {
  return (
    <>
            <div className="panel-title">
              <h3>Paramètres de l’activité</h3>
            </div>
            <div className="mode-toggle is-tabs page-tabs" role="tablist" aria-label="Feuilles">
              {worksheets.map((sheet, index) => {
                if (sheet.isContinuation) return null
                const config = sheet.configIndex ?? index
                const isJeux = sheet.domain === 'jeux'
                const sideLabel = sheet.title?.includes('—')
                  ? sheet.title.split('—').pop()?.trim()
                  : undefined
                const activeConfig = activeSheet?.configIndex ?? safeSheetIndex
                const tabLabel = isJeux && sideLabel ? sideLabel : isJeux ? String(index + 1) : String(config + 1)
                const active = isJeux ? safeSheetIndex === index : config === activeConfig
                return (
                <button
                  key={`${config}-main-${index}`}
                  type="button"
                  className={active ? 'active' : ''}
                  onClick={() => {
                    setSheetIndex(index)
                    setBlockIndex(0)
                  }}
                  aria-label={isJeux && sideLabel ? sideLabel : `Page ${config + 1}`}
                >
                  <span className="tab-number">{tabLabel}</span>
                  {!isTpmLike &&
                  pages.length > 1 &&
                  (isJeux ? safeSheetIndex === index : config === pageIndex) ? (
                    <TabRemoveButton
                      label="Retirer cette page"
                      onRemove={() => removePage(sheet.configIndex ?? index)}
                    />
                  ) : null}
                </button>
                )
              })}
            </div>
            {isTpmLike ? null : (
              <div className="page-structure-actions">
                <button className="button secondary" type="button" onClick={addPage}>
                  + Page
                </button>
                <button className="button secondary" type="button" onClick={addExerciseOnPage}>
                  + Exercice
                </button>
              </div>
            )}
            {pageExerciseBlocks.length > 1 ? (
              <div className="mode-toggle is-tabs page-tabs exercise-tabs" role="tablist" aria-label="Exercices de la page">
                {pageExerciseBlocks.map((_, index) => {
                  const tabNo =
                    activeSheet?.blocks?.[index]?.exerciseIndex ?? firstExerciseNo + index
                  return (
                  <button
                    key={index}
                    type="button"
                    className={safeBlockIndex === index ? 'active' : ''}
                    onClick={() => setBlockIndex(index)}
                    aria-label={`Exercice ${tabNo}`}
                  >
                    <span className="tab-number">{tabNo}</span>
                    {!isTpmLike && pageExerciseBlocks.length > 1 && index === safeBlockIndex ? (
                      <TabRemoveButton
                        label="Retirer cet exercice"
                        onRemove={() => {
                          const blockIdx = index
                          const numbers = pageExerciseBlocks.map(
                            (block, i) =>
                              activeSheet?.blocks?.[i]?.exerciseIndex ??
                              block.exerciseNo ??
                              firstExerciseNo + i,
                          )
                          setPages((current) =>
                            current.map((page, pageIdx) =>
                              pageIdx === pageIndex ? removePageBlock(page, blockIdx, numbers) : page,
                            ),
                          )
                          setBlockIndex(Math.max(0, blockIdx - 1))
                        }}
                      />
                    ) : null}
                  </button>
                  )
                })}
              </div>
            ) : null}

    </>
  )
}
