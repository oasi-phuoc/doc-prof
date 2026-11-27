import { SelectBox } from '@/components/generator/SelectBox'
import { defaultCalliWordCount } from '@/calligraphie/defaults'
import {
  CALLI_FONTS,
  CALLI_SIZES,
  DEFAULT_CALLI_FONT,
  DEFAULT_CALLI_SIZE,
} from '@/calligraphie/fonts'
import { initialCalliText } from '@/calligraphie/generate'
import type { Difficulty, ExerciseBlock } from '@/math/types'

export type CalliSettingsPanelProps = {
  isCalliDomain: boolean
  libreMode: boolean
  activeBlock: ExerciseBlock
  updatePage: (patch: Partial<ExerciseBlock>) => void
  calliIsPhrases: boolean
  calliIsLibre: boolean
  calliFields: string[]
  vocabDifficultyOptions: Array<{ value: Difficulty; label: string }>
  vocabSubgroups: Array<{ id: string; label: string }>
  activeVocabSubgroup: string | undefined
}

export function CalliSettingsPanel({
  isCalliDomain,
  libreMode,
  activeBlock,
  updatePage,
  calliIsPhrases,
  calliIsLibre,
  calliFields,
  vocabDifficultyOptions,
  vocabSubgroups,
  activeVocabSubgroup,
}: CalliSettingsPanelProps) {
  if (!isCalliDomain) return null
  return (
    <>
      <div className="mode-toggle-block">
        <b>Écriture</b>
        <div className="mode-toggle" role="group" aria-label="Police d’écriture">
          {CALLI_FONTS.map((font) => (
            <button
              key={font.id}
              type="button"
              className={(activeBlock.calliFont ?? DEFAULT_CALLI_FONT) === font.id ? 'active' : ''}
              onClick={() => updatePage({ calliFont: font.id })}
            >
              {font.label}
            </button>
          ))}
        </div>
      </div>
      <div className="mode-toggle-block">
        <b>Taille</b>
        <div className="mode-toggle is-3" role="group" aria-label="Taille d’écriture">
          {CALLI_SIZES.map((size) => (
            <button
              key={size.id}
              type="button"
              className={(activeBlock.calliSize ?? DEFAULT_CALLI_SIZE) === size.id ? 'active' : ''}
              onClick={() => {
                if (libreMode) {
                  updatePage({ calliSize: size.id })
                  return
                }
                const nextText = initialCalliText({
                  exerciseType: activeBlock.exerciseType,
                  topic: activeBlock.topic,
                  difficulty: activeBlock.difficulty,
                  calliSize: size.id,
                  vocabSubgroup: activeBlock.vocabSubgroup,
                })
                updatePage({ calliSize: size.id, calliText: nextText })
              }}
            >
              {size.label}
            </button>
          ))}
        </div>
        {libreMode && <small className="muted">
          {calliIsPhrases
            ? 'Phrases : Petit 6 · Moyen 5 · Grand 4 blocs (vous pouvez en ajouter).'
            : `Mots : Petit ${defaultCalliWordCount('petit')} · Moyen ${defaultCalliWordCount('moyen')} · Grand ${defaultCalliWordCount('grand')} (hauteur d’une bande 4 lignes).`}
        </small>}
      </div>
      {calliIsPhrases ? (
        <SelectBox
          label="Niveau"
          value={activeBlock.difficulty ?? 'moyen'}
          onChange={(value) => updatePage({ difficulty: value as Difficulty })}
        >
          {vocabDifficultyOptions.map((opt) => (
            <option value={opt.value} key={opt.value}>
              {opt.label}
            </option>
          ))}
        </SelectBox>
      ) : null}
      {!calliIsLibre && vocabSubgroups.length > 1 ? (
        <SelectBox
          label="Liste"
          value={activeVocabSubgroup ?? ''}
          onChange={(value) => {
            const nextText = initialCalliText({
              exerciseType: activeBlock.exerciseType,
              topic: activeBlock.topic,
              difficulty: activeBlock.difficulty,
              calliSize: activeBlock.calliSize,
              vocabSubgroup: value,
              countHint: calliFields.length,
            })
            updatePage({ vocabSubgroup: value, calliText: nextText })
          }}
        >
          {vocabSubgroups.map((group) => (
            <option value={group.id} key={group.id}>
              {group.label}
            </option>
          ))}
        </SelectBox>
      ) : null}
    </>
  )
}
