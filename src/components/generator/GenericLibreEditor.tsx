import { Fragment, useState } from 'react'
import type { MathItem } from '@/math/types'
import { newLogistiqueQuestion, reviewableLogistiqueAnswer, type LogistiqueQuestionFormat } from '@/logistique/libre'
import { logistiqueBloomLevels, type LogistiqueAssessment } from '@/logistique/evaluation'
import type { LogistiqueType } from '@/logistique/catalog'
import { LogistiqueImageFields, type LogistiquePhotoChoice } from './LogistiqueImageFields'
import { LogistiqueGapEditor } from './LogistiqueGapEditor'
import { LogistiqueTableEditor } from './LogistiqueTableEditor'
import { SelectBox } from './SelectBox'

/**
 * Éditeur libre générique : consigne + énoncé / réponse / choix pour chaque item.
 * Sert de secours pour tous les domaines sans éditeur spécialisé.
 */
export function GenericLibreEditor({
  instruction,
  items,
  editableCalculation,
  logistique,
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
  logistique?: {
    kind: LogistiqueType['kind']
    evaluation: boolean
    defaultModule: string
    modules: readonly { code: string; label: string }[]
    original: (item: MathItem) => MathItem | undefined
  }
  logistiquePhotos?: { defaultModule: string; byModule: ReadonlyMap<string, readonly LogistiquePhotoChoice[]> }
  onChangeInstruction: (value: string) => void
  onChangeItems: (items: MathItem[]) => void
  direct?: boolean
  fields?: Record<string, string>
  writeField?: (id: string, value: string | null) => void
  onRegenerate?: (itemId: string) => void
}) {
  const [localModule, setLocalModule] = useState(logistique?.defaultModule)
  const [localFormat, setLocalFormat] = useState<LogistiqueQuestionFormat>('open')
  const questionFormat = logistique?.kind === 'verification' || localFormat === 'qcm' && logistique?.kind === 'situation'
    ? localFormat : 'open'
  const module = logistique?.modules.some(({ code }) => code === localModule)
    ? localModule : logistique?.modules[0]?.code
  const TextField = logistique ? 'textarea' : 'input'

  const patchItem = (index: number, patch: Partial<MathItem>) => {
    onChangeItems(items.map((item, i) => i === index ? {
      ...item, ...patch,
      ...(logistique && patch.libreLocked === undefined ? { logistiqueRetained: true } : {}),
    } : item))
  }

  function moveItem(index: number, offset: number) {
    const next = [...items]
    const [item] = next.splice(index, 1)
    next.splice(index + offset, 0, item!)
    onChangeItems(next)
  }

  function changeChoices(index: number, options: string[], edited?: { previous: string; next: string }) {
    const item = items[index]!
    const replace = (answer: string) => edited?.previous && edited.previous === answer ? edited.next : answer
    const choice = item.logistiqueChoice
    if (choice?.kind === 'multiple') {
      const correct = choice.correct.map(replace).filter((text) => text && options.includes(text))
      patchItem(index, { options, answer: correct.join('\n'), logistiqueChoice: { ...choice, correct }, libreCorrectionPending: true })
      return
    }
    const answer = replace(item.answer)
    patchItem(index, { options, answer: options.includes(answer) ? answer : '', libreCorrectionPending: true })
  }

  function patchAssessment(index: number, patch: Partial<LogistiqueAssessment>) {
    patchItem(index, { logistiqueAssessment: { ...items[index]!.logistiqueAssessment, ...patch } })
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
        {items.map((item, index) => {
          const choice = item.logistiqueChoice
          return (
          <li key={item.libreId ?? index} className="libre-item-card is-libre-row">
            <span className="libre-item-num is-accent">{index + 1}.</span>
            <div className="libre-item-body">
              {logistique && <small className="muted">
                Module {item.logistiqueSource?.module ?? item.logistiqueLocalModule ?? logistique.defaultModule}
                {item.logistiqueSource ? ' · Banque' : ' · Question locale'}
              </small>}
              {item.logistiqueGaps ? (
                <LogistiqueGapEditor prompt={item.prompt ?? ''} gaps={item.logistiqueGaps}
                  onChange={(patch) => patchItem(index, patch)} />
              ) : <div className="libre-pair">
                <label className="libre-field is-line">
                  <span>Énoncé</span>
                  <TextField
                    className={logistique ? 'libre-line-input is-textarea' : 'libre-line-input'}
                    {...(logistique ? { rows: 3, 'aria-label': 'Énoncé' } : { type: 'text' })}
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
                {!(direct && item.layout === 'select') && item.logistiqueResponseLines?.kind !== 'numbered' ? <label className="libre-field is-line">
                  <span>Réponse</span>
                  <TextField
                    className={logistique ? 'libre-line-input is-textarea' : 'libre-line-input'}
                    {...(logistique ? { rows: 2, 'aria-label': 'Réponse' } : { type: 'text' })}
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
              {item.logistiqueResponseLines?.kind === 'simple' && (
                <label className="libre-field is-line">
                  <span>Lignes de rédaction</span>
                  <input className="libre-line-input" type="number" min={1} max={8}
                    value={item.logistiqueResponseLines.count} onChange={(event) => {
                      const count = Number(event.target.value)
                      if (Number.isInteger(count) && count >= 1 && count <= 8) {
                        patchItem(index, { logistiqueResponseLines: { kind: 'simple', count } })
                      }
                    }} />
                </label>
              )}
              {item.logistiqueResponseLines?.kind === 'numbered' && item.logistiqueResponseLines.answers.map((answer, position) => (
                <label key={position} className="libre-field is-line">
                  <span>Réponse {position + 1}</span>
                  <input className="libre-line-input" value={answer} onChange={(event) => {
                    const lines = item.logistiqueResponseLines
                    if (lines?.kind !== 'numbered') return
                    const answers = lines.answers.with(position, event.target.value)
                    patchItem(index, { logistiqueResponseLines: { ...lines, answers },
                      answer: answers.join('\n'), libreCorrectionPending: true })
                  }} />
                </label>
              ))}
              {item.logistiqueTable && <LogistiqueTableEditor table={item.logistiqueTable}
                onChange={(logistiqueTable) => patchItem(index, { logistiqueTable, libreCorrectionPending: true })} />}
              {(editableCalculation || direct && item.calcAnswer != null) && (
                <label className="libre-field is-line">
                  <span>Calcul du corrigé</span>
                  <textarea className="libre-line-input is-textarea" rows={2}
                    value={item.calcAnswer ?? ''}
                    onChange={(event) => patchItem(index, {
                      calcAnswer: event.target.value, ...(logistique ? { libreCorrectionPending: true } : {}),
                    })} />
                </label>
              )}
              {item.options && item.options.length > 0 ? (
                <div className="libre-options">
                  <b>Choix</b>
                  {choice?.kind !== 'true-false' && item.options.map((opt, oi) => {
                    const id = `${item.libreId}:choix:${oi}`
                    const invalid = fields?.[id]
                    return <Fragment key={oi}>
                      <label className="libre-field is-line">
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
                            if (logistique) changeChoices(index, options, { previous: opt, next: text })
                            else patchItem(index, { options, ...(direct && item.answer === opt ? { answer: text } : {}) })
                          }}
                        />
                        {invalid !== undefined && <span role="alert" className="libre-field-error">Saisissez un choix distinct et non vide.</span>}
                      </label>
                      {logistique && item.layout === 'select' && item.options!.length > 2 &&
                        <button type="button" className="button small secondary" aria-label={`Retirer le choix ${oi + 1} de la question ${index + 1}`}
                          onClick={() => {
                            item.options!.forEach((_, position) => writeField?.(`${item.libreId}:choix:${position}`, null))
                            changeChoices(index, item.options!.filter((_, position) => position !== oi))
                          }}>Retirer ce choix</button>}
                      {choice?.kind === 'multiple' && <label>
                        <input type="checkbox" disabled={!opt.trim()} checked={choice.correct.includes(opt)}
                          onChange={(event) => {
                            const correct = event.target.checked ? [...choice.correct, opt] : choice.correct.filter((value) => value !== opt)
                            patchItem(index, { logistiqueChoice: { ...choice, correct }, answer: correct.join('\n'), libreCorrectionPending: true })
                          }} />
                        {`Le choix ${String.fromCharCode(65 + oi)} est correct`}
                      </label>}
                    </Fragment>
                  })}
                  {logistique && item.layout === 'select' && choice?.kind !== 'true-false' && item.options.length < 12 &&
                    <button type="button" className="button small secondary"
                      onClick={() => changeChoices(index, [...item.options!, ''])}>Ajouter un choix</button>}
                  {direct && item.layout === 'select' && choice?.kind !== 'multiple' ? (
                    <label className="libre-field is-line">
                      <span>Bonne réponse</span>
                      <select className="libre-line-input" value={item.answer}
                        onChange={(event) => patchItem(index, { answer: event.target.value,
                          ...(choice ? { libreCorrectionPending: true } : {}),
                        })}>
                        <option value="" disabled>Choisir une réponse</option>
                        {item.options.filter(Boolean).map((option) => <option key={option} value={option}>{option}</option>)}
                      </select>
                    </label>
                  ) : null}
                  {choice?.kind === 'true-false' && <>
                    <label>
                      <input type="checkbox" checked={choice.justification !== undefined}
                        onChange={(event) => patchItem(index, {
                          logistiqueChoice: { ...choice, justification: event.target.checked ? '' : undefined },
                          libreCorrectionPending: true,
                        })} /> Demander une justification
                    </label>
                    {choice.justification !== undefined && <label className="libre-field is-line">
                      <span>Justification du corrigé</span>
                      <textarea className="libre-line-input is-textarea" rows={2} maxLength={400} value={choice.justification}
                        onChange={(event) => patchItem(index, {
                          logistiqueChoice: { ...choice, justification: event.target.value }, libreCorrectionPending: true,
                        })} />
                    </label>}
                  </>}
                </div>
              ) : null}
              {direct && item.libreCorrectionPending ? (
                <div className="libre-unit-actions">
                  <span>Corrigé à vérifier</span>
                  <button type="button" className="button" disabled={logistique
                    ? !reviewableLogistiqueAnswer(item)
                    : !item.prompt?.trim() || !item.answer?.trim()}
                    onClick={() => patchItem(index, { libreCorrectionPending: false })}>Corrigé vérifié</button>
                </div>
              ) : null}
              {logistique && <div className="libre-unit-actions">
                <button type="button" className="button small secondary" disabled={index === 0}
                  aria-label={`Monter la question ${index + 1}`} onClick={() => moveItem(index, -1)}>Monter</button>
                <button type="button" className="button small secondary" disabled={index === items.length - 1}
                  aria-label={`Descendre la question ${index + 1}`} onClick={() => moveItem(index, 1)}>Descendre</button>
                <button type="button" className="button small secondary" aria-label={`Dupliquer la question ${index + 1}`}
                  onClick={() => {
                    const copy = { ...item, libreId: `log-question-${crypto.randomUUID()}`, libreLocked: undefined, logistiqueRetained: true }
                    onChangeItems(items.toSpliced(index + 1, 0, copy))
                  }}>Dupliquer</button>
                {item.logistiqueSource && <button type="button" className="button small secondary"
                  aria-label={`Restaurer la question ${index + 1}`}
                  onClick={() => {
                    const original = logistique.original(item)
                    if (!original || !window.confirm('Restaurer la question de la banque et remplacer les retouches de cette question ?')) return
                    item.options?.forEach((_, position) => writeField?.(`${item.libreId}:choix:${position}`, null))
                    onChangeItems(items.with(index, {
                      ...original, libreId: item.libreId, libreLocked: item.libreLocked,
                      logistiqueRetained: item.logistiqueRetained,
                    }))
                  }}>Restaurer</button>}
                <button type="button" className="button small secondary" aria-label={`Supprimer la question ${index + 1}`}
                  onClick={() => {
                    if (!window.confirm('Supprimer cette question de la fiche ?')) return
                    item.options?.forEach((_, position) => writeField?.(`${item.libreId}:choix:${position}`, null))
                    onChangeItems(items.toSpliced(index, 1))
                  }}>Supprimer</button>
              </div>}
              {logistiquePhotos && <LogistiqueImageFields
                photos={logistiquePhotos.byModule.get(item.logistiqueSource?.module ?? item.logistiqueLocalModule ?? logistiquePhotos.defaultModule) ?? []}
                image={item.logistiqueImage}
                onChange={(logistiqueImage) => patchItem(index, { logistiqueImage })} />}
              {logistique?.evaluation && <details>
                <summary>Barème et objectifs</summary>
                <label className="libre-field is-line">
                  <span>Points de la question</span>
                  <input type="number" className="libre-line-input" min={0} max={1000} step={0.5}
                    value={item.points ?? ''} placeholder="Barème de l’activité"
                    onChange={(event) => {
                      const points = event.target.valueAsNumber
                      if (!event.target.value || points >= 0 && points <= 1000 && points * 2 % 1 === 0) {
                        patchItem(index, { points: event.target.value ? points : undefined })
                      }
                    }} />
                </label>
                <SelectBox label="Niveau de Bloom" value={item.logistiqueAssessment?.bloom ?? ''} onChange={(bloom) =>
                  patchAssessment(index, { bloom: bloom ? bloom as LogistiqueAssessment['bloom'] : undefined })}>
                  <option value="">À renseigner</option>
                  {Object.entries(logistiqueBloomLevels).map(([id, label]) => <option key={id} value={id}>{label}</option>)}
                </SelectBox>
                <SelectBox label="Difficulté de la question" value={item.logistiqueAssessment?.difficulty ?? ''} onChange={(difficulty) =>
                  patchAssessment(index, { difficulty: difficulty ? difficulty as LogistiqueAssessment['difficulty'] : undefined })}>
                  <option value="">À renseigner</option>
                  <option value="facile">Facile</option>
                  <option value="moyen">Moyenne</option>
                  <option value="avance">Avancée</option>
                </SelectBox>
                <label className="libre-field is-line">
                  <span>Durée indicative en minutes</span>
                  <input type="number" className="libre-line-input" min={0.5} max={120} step={0.5}
                    value={item.logistiqueAssessment?.minutes ?? ''}
                    onChange={(event) => {
                      const minutes = event.target.valueAsNumber
                      if (!event.target.value || minutes >= 0.5 && minutes <= 120 && minutes * 2 % 1 === 0) {
                        patchAssessment(index, { minutes: event.target.value ? minutes : undefined })
                      }
                    }} />
                </label>
                <label className="libre-field is-line">
                  <span>Objectif de la question</span>
                  <input className="libre-line-input" maxLength={100} value={item.logistiqueAssessment?.objective ?? ''}
                    onChange={(event) => patchAssessment(index, { objective: event.target.value })} />
                </label>
                <label className="libre-field is-line">
                  <span>Critères de correction</span>
                  <textarea className="libre-line-input is-textarea" rows={2} maxLength={400}
                    value={item.logistiqueAssessment?.criteria ?? ''}
                    onChange={(event) => patchAssessment(index, { criteria: event.target.value })} />
                </label>
              </details>}
              {direct && item.libreId && (onRegenerate || logistique) ? (
                <div className="libre-unit-actions">
                  <button type="button" className="button" aria-pressed={Boolean(item.libreLocked)}
                    aria-label={`Verrou de la question ${index + 1}`}
                    onClick={() => patchItem(index, { libreLocked: !item.libreLocked })}>
                    {item.libreLocked ? 'Verrouillée' : 'Verrouiller'}
                  </button>
                  {onRegenerate && <button type="button" className="button" disabled={item.libreLocked}
                    onClick={() => {
                      item.options?.forEach((_, position) => writeField?.(`${item.libreId}:choix:${position}`, null))
                      onRegenerate(item.libreId!)
                    }}>Régénérer la question</button>}
                </div>
              ) : null}
            </div>
          </li>
          )
        })}
      </ul>
      {logistique ? <details>
        <summary>Ajouter une question libre</summary>
        <SelectBox label="Module de la nouvelle question" value={module ?? ''} onChange={setLocalModule}>
          {logistique.modules.map(({ code, label }) => <option key={code} value={code}>{label}</option>)}
        </SelectBox>
        {logistique.kind !== 'maths' && <SelectBox label="Format de la nouvelle question" value={questionFormat}
          onChange={(value) => setLocalFormat(value as LogistiqueQuestionFormat)}>
          <option value="open">Réponse ouverte</option>
          <option value="qcm">QCM à réponse unique</option>
          {logistique.kind === 'verification' && <>
            <option value="qcm-multiple">QCM à réponses multiples</option>
            <option value="vrai-faux">Vrai ou faux</option>
          </>}
        </SelectBox>}
        <button type="button" className="button small secondary" disabled={!module} onClick={() => {
          if (module) onChangeItems([...items, newLogistiqueQuestion(module, logistique.kind, questionFormat)])
        }}>Ajouter à la fiche</button>
      </details> : items.length === 0 ? (
        <p className="type-hint muted">Aucun item sur cette fiche — générez d’abord un contenu.</p>
      ) : null}
    </div>
  )
}
