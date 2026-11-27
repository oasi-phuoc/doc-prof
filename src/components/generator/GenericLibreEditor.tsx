import type { MathItem } from '@/math/types'
import { LogistiqueImageFields, type LogistiquePhotoChoice } from './LogistiqueImageFields'
import { LogistiqueGapEditor } from './LogistiqueGapEditor'
import { LogistiqueTableEditor } from './LogistiqueTableEditor'

/**
 * Éditeur libre générique : consigne + énoncé / réponse / choix pour chaque item.
 * Sert de secours pour tous les domaines sans éditeur spécialisé.
 */
export function GenericLibreEditor({
  instruction,
  items,
  editableCalculation,
  logistiquePhotos,
  onChangeInstruction,
  onChangeItems,
  direct = false,
  fields,
  writeField,
  onRegenerate,
}: {
  instruction: string
  items: MathItem[]
  editableCalculation?: boolean
  logistiquePhotos?: { defaultModule: string; byModule: ReadonlyMap<string, readonly LogistiquePhotoChoice[]> }
  onChangeInstruction: (value: string) => void
  onChangeItems: (items: MathItem[]) => void
  direct?: boolean
  fields?: Record<string, string>
  writeField?: (id: string, value: string | null) => void
  onRegenerate?: (itemId: string) => void
}) {
  const patchItem = (index: number, patch: Partial<MathItem>) => {
    onChangeItems(items.map((item, i) => (i === index ? { ...item, ...patch } : item)))
  }

  return (
    <div className="quad-libre-block generic-libre-editor">
      <b>Contenu de la fiche</b>
      {!direct && <p className="type-hint muted">
        La consigne est en haut. Chaque question a son énoncé, puis la réponse du corrigé.
      </p>}
      <label className="libre-field is-line">
        <span>Consigne</span>
        <textarea
          className="libre-line-input is-textarea"
          rows={2}
          value={instruction}
          onChange={(event) => onChangeInstruction(event.target.value)}
        />
      </label>
      <ul className="libre-item-list" aria-label="Questions">
        {items.map((item, index) => (
          <li key={item.libreId ?? index} className="libre-item-card is-libre-row">
            <span className="libre-item-num is-accent">{index + 1}.</span>
            <div className="libre-item-body">
              {item.logistiqueGaps ? (
                <LogistiqueGapEditor prompt={item.prompt ?? ''} gaps={item.logistiqueGaps}
                  onChange={(patch) => patchItem(index, patch)} />
              ) : <div className="libre-pair">
                <label className="libre-field is-line">
                  <span>Énoncé</span>
                  <input
                    className="libre-line-input"
                    type="text"
                    value={item.prompt ?? item.left ?? ''}
                    onChange={(event) =>
                      patchItem(index, {
                        prompt: event.target.value,
                        ...(direct ? { libreCorrectionPending: true } : {}),
                        ...(item.left != null ? { left: event.target.value } : {}),
                      })
                    }
                  />
                </label>
                {!(direct && item.layout === 'select') ? <label className="libre-field is-line">
                  <span>Réponse</span>
                  <input
                    className="libre-line-input"
                    type="text"
                    value={item.answer ?? ''}
                    onChange={(event) => {
                      const answer = event.target.value
                      patchItem(index, {
                        answer,
                        ...(item.responseAnswer != null ? { responseAnswer: answer } : {}),
                      })
                    }}
                  />
                </label> : null}
              </div>}
              {item.logistiqueTable && <LogistiqueTableEditor table={item.logistiqueTable}
                onChange={(logistiqueTable) => patchItem(index, { logistiqueTable })} />}
              {(editableCalculation || direct && item.calcAnswer != null) && (
                <label className="libre-field is-line">
                  <span>Calcul du corrigé</span>
                  <textarea className="libre-line-input is-textarea" rows={2}
                    value={item.calcAnswer ?? ''}
                    onChange={(event) => patchItem(index, { calcAnswer: event.target.value })} />
                </label>
              )}
              {item.options && item.options.length > 0 ? (
                <div className="libre-options">
                  <b>Choix</b>
                  {item.options.map((opt, oi) => {
                    const id = `${item.libreId}:choix:${oi}`
                    const invalid = fields?.[id]
                    return <label key={oi} className="libre-field is-line">
                      <span>{`Choix ${String.fromCharCode(65 + oi)}`}</span>
                      <input
                        className="libre-line-input"
                        type="text"
                        value={invalid ?? opt}
                        aria-invalid={invalid !== undefined}
                        data-applied-value={direct ? opt : undefined}
                        onChange={(event) => {
                          const options = [...(item.options ?? [])]
                          const text = event.target.value
                          if (direct && item.libreId && (!text.trim() || options.some((option, i) => i !== oi && option.trim() === text.trim()))) {
                            writeField?.(id, text)
                            return
                          }
                          options[oi] = text
                          writeField?.(id, null)
                          patchItem(index, { options, ...(direct && item.answer === opt ? { answer: text } : {}) })
                        }}
                      />
                      {invalid !== undefined && <span role="alert" className="libre-field-error">Saisissez un choix distinct et non vide.</span>}
                    </label>
                  })}
                  {direct && item.layout === 'select' ? (
                    <label className="libre-field is-line">
                      <span>Bonne réponse</span>
                      <select className="libre-line-input" value={item.answer}
                        onChange={(event) => patchItem(index, { answer: event.target.value })}>
                        <option value="" disabled>Choisir une réponse</option>
                        {item.options.map((option) => <option key={option} value={option}>{option}</option>)}
                      </select>
                    </label>
                  ) : null}
                </div>
              ) : null}
              {direct && item.libreCorrectionPending ? (
                <div className="libre-unit-actions">
                  <span>Corrigé à vérifier</span>
                  <button type="button" className="button" disabled={!item.prompt?.trim() || !item.answer?.trim()}
                    onClick={() => patchItem(index, { libreCorrectionPending: false })}>Corrigé vérifié</button>
                </div>
              ) : null}
              {logistiquePhotos && <LogistiqueImageFields
                photos={logistiquePhotos.byModule.get(item.logistiqueSource?.module ?? logistiquePhotos.defaultModule) ?? []}
                image={item.logistiqueImage}
                onChange={(logistiqueImage) => patchItem(index, { logistiqueImage })} />}
              {direct && item.libreId && onRegenerate ? (
                <div className="libre-unit-actions">
                  <button type="button" className="button" aria-pressed={Boolean(item.libreLocked)}
                    aria-label={`Verrou de la question ${index + 1}`}
                    onClick={() => patchItem(index, { libreLocked: !item.libreLocked })}>
                    {item.libreLocked ? 'Verrouillée' : 'Verrouiller'}
                  </button>
                  <button type="button" className="button" disabled={item.libreLocked}
                    onClick={() => {
                      item.options?.forEach((_, position) => writeField?.(`${item.libreId}:choix:${position}`, null))
                      onRegenerate(item.libreId!)
                    }}>Régénérer la question</button>
                </div>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
      {items.length === 0 ? (
        <p className="type-hint muted">Aucun item sur cette fiche — générez d’abord un contenu.</p>
      ) : null}
    </div>
  )
}
