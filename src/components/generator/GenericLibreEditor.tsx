import { useState } from 'react'
import type { MathItem } from '@/math/types'
import { LogistiqueImageFields, type LogistiquePhotoChoice } from './LogistiqueImageFields'

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
}: {
  instruction: string
  items: MathItem[]
  editableCalculation?: boolean
  logistiquePhotos?: { defaultModule: string; byModule: ReadonlyMap<string, readonly LogistiquePhotoChoice[]> }
  onChangeInstruction: (value: string) => void
  onChangeItems: (items: MathItem[]) => void
  direct?: boolean
}) {
  const [invalidChoice, setInvalidChoice] = useState<{ id: string; index: number; text: string } | null>(null)
  const patchItem = (index: number, patch: Partial<MathItem>) => {
    onChangeItems(items.map((item, i) => (i === index ? { ...item, ...patch } : item)))
  }

  return (
    <div className="quad-libre-block generic-libre-editor">
      <b>Contenu de la fiche</b>
      <p className="type-hint muted">
        La consigne est en haut. Chaque question a son énoncé, puis la réponse du corrigé.
      </p>
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
              <div className="libre-pair">
                <label className="libre-field is-line">
                  <span>Énoncé</span>
                  <input
                    className="libre-line-input"
                    type="text"
                    readOnly={Boolean(item.logistiqueGaps)}
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
                    readOnly={Boolean(item.logistiqueGaps)}
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
              </div>
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
                  {item.options.map((opt, oi) => (
                    <label key={oi} className="libre-field is-line">
                      <span>{`Choix ${String.fromCharCode(65 + oi)}`}</span>
                      <input
                        className="libre-line-input"
                        type="text"
                        value={invalidChoice && invalidChoice.id === item.libreId && invalidChoice.index === oi ? invalidChoice.text : opt}
                        aria-invalid={Boolean(invalidChoice && invalidChoice.id === item.libreId && invalidChoice.index === oi)}
                        data-applied-value={direct ? opt : undefined}
                        onChange={(event) => {
                          const options = [...(item.options ?? [])]
                          const text = event.target.value
                          if (direct && item.libreId && (!text.trim() || options.some((option, i) => i !== oi && option.trim() === text.trim()))) {
                            setInvalidChoice({ id: item.libreId, index: oi, text })
                            return
                          }
                          options[oi] = text
                          setInvalidChoice(null)
                          patchItem(index, { options, ...(direct && item.answer === opt ? { answer: text } : {}) })
                        }}
                      />
                    </label>
                  ))}
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
                  {invalidChoice?.id === item.libreId && invalidChoice ? (
                    <p role="alert" className="questions-overflow-hint">Saisissez un choix distinct et non vide.</p>
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
