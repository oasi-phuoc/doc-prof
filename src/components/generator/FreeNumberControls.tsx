import { SelectBox } from './SelectBox'
import { freeArithmeticType } from '@/math/free-arithmetic'
import { freeDecimalPlaces, MAX_FREE_DECIMAL_PLACES } from '@/math/difficulty'
import type { ExerciseBlock } from '@/math/types'

const decimalPlaceOptions = Array.from({ length: MAX_FREE_DECIMAL_PLACES + 1 }, (_, i) => i)

export function FreeNumberControls({
  activeBlock,
  updatePage,
}: {
  activeBlock: ExerciseBlock
  updatePage: (patch: Partial<ExerciseBlock>) => void
}) {
  const hasTwoFreeOperands = freeArithmeticType(activeBlock.exerciseType) !== undefined
  return (
    <div className="number-libre-fields">
      <label className="select-shell">
        <span>De</span>
        <input
          className="pill-input"
          type="number"
          inputMode="decimal"
          step={activeBlock.numberDecimals ? 'any' : 1}
          value={activeBlock.numberMin ?? 1}
          onChange={(event) => updatePage({ numberMin: Number(event.target.value) })}
        />
      </label>
      <label className="select-shell">
        <span>À</span>
        <input
          className="pill-input"
          type="number"
          inputMode="decimal"
          step={activeBlock.numberDecimals ? 'any' : 1}
          value={activeBlock.numberMax ?? 100}
          onChange={(event) => updatePage({ numberMax: Number(event.target.value) })}
        />
      </label>
      <div className="mode-toggle-block">
        <b>Décimales</b>
        <div className="mode-toggle">
          <button
            type="button"
            className={!activeBlock.numberDecimals ? 'active' : ''}
            onClick={() => updatePage({ numberDecimals: false })}
          >
            Sans
          </button>
          <button
            type="button"
            className={activeBlock.numberDecimals ? 'active' : ''}
            onClick={() => updatePage({ numberDecimals: true })}
          >
            Avec
          </button>
        </div>
      </div>
      {activeBlock.numberDecimals && (
        <>
          <SelectBox
            label={hasTwoFreeOperands ? 'Décimales du 1er nombre' : 'Chiffres après la virgule'}
            value={String(freeDecimalPlaces(activeBlock.numberDecimalPlaces))}
            onChange={(value) => updatePage({ numberDecimalPlaces: Number(value) })}
          >
            {decimalPlaceOptions.map((places) => <option key={places} value={places}>{places}</option>)}
          </SelectBox>
          {hasTwoFreeOperands && (
            <SelectBox
              label="Décimales du 2e nombre"
              value={String(freeDecimalPlaces(activeBlock.numberSecondDecimalPlaces))}
              onChange={(value) => updatePage({ numberSecondDecimalPlaces: Number(value) })}
            >
              {decimalPlaceOptions.map((places) => <option key={places} value={places}>{places}</option>)}
            </SelectBox>
          )}
        </>
      )}
    </div>
  )
}
