import { editPerimeter, perimeterChoices, perimeterInputs, withPerimeterFigure, type PerimeterValues } from '@/math/mesures'
import { createRng, randomSeed } from '@/math/rng'
import type { Difficulty, MathItem } from '@/math/types'

export function PerimeterEditor({ type, difficulty, items, instruction, fields, writeField, onInstruction, onChange, onRegenerate }: {
  type: string
  difficulty: Difficulty
  items: MathItem[]
  instruction: string
  fields: Record<string, string>
  writeField: (id: string, value: string | null) => void
  onInstruction: (value: string) => void
  onChange: (items: MathItem[]) => void
  onRegenerate: (id?: string) => void
}) {
  const figures = perimeterChoices(type)
  function update(index: number, item: MathItem) {
    onChange(items.map((current, position) => position === index ? item : current))
  }

  function regenerate(id?: string) {
    for (const item of items) {
      if (item.libreLocked || !item.libreId || (id && id !== item.libreId)) continue
      for (const { key } of perimeterInputs(item)) writeField(`${item.libreId}:${key}`, null)
    }
    onRegenerate(id)
  }

  return (
    <section className="quad-libre-block" aria-label="Périmètres">
      <label className="libre-field is-line">
        <span>Consigne</span>
        <textarea className="libre-line-input is-textarea" rows={2} value={instruction}
          onChange={(event) => onInstruction(event.target.value)} />
      </label>
      {items.some(({ libreLocked }) => !libreLocked) && (
        <button type="button" className="button small secondary" onClick={() => regenerate()}>
          Régénérer les questions déverrouillées
        </button>
      )}
      {items.map((item, index) => {
        const inputs = perimeterInputs(item)
        if (!inputs.length) return null
        const id = item.libreId ?? `perimetre-${index}`
        const unit = item.dims?.unit ?? 'cm'
        return (
          <fieldset key={id} className="libre-grid-fields">
            <legend>Question {index + 1}</legend>
            {figures.length > 0 && (
              <label className="libre-field is-line">
                <span>Figure</span>
                <select className="libre-line-input" value={item.figure} onChange={(event) => {
                  const choice = figures.find(({ figure }) => figure === event.target.value)
                  if (!choice) return
                  for (const { key } of inputs) writeField(`${id}:${key}`, null)
                  update(index, withPerimeterFigure(item, choice.figure, createRng(randomSeed()), difficulty))
                }}>
                  {figures.map(({ figure, label }) => <option key={figure} value={figure}>{label}</option>)}
                </select>
              </label>
            )}
            {inputs.map(({ key, label, value }) => {
              const field = `${id}:${key}`
              const error = fields[field] !== undefined
              const read = Number.isFinite(value) ? String(value).replace('.', ',') : ''
              return (
                <div key={key}>
                  <label className="libre-field is-line">
                    <span>{label}</span>
                    <input className="libre-line-input" type="text" inputMode="decimal" value={fields[field] ?? read}
                      aria-invalid={error} aria-describedby={error ? field : undefined} data-applied-value={read}
                      onChange={(event) => {
                        const text = event.target.value
                        const values: PerimeterValues = {}
                        for (const { key: name } of inputs) {
                          const candidate = (name === key ? text : fields[`${id}:${name}`])?.trim()
                          if (candidate === undefined) continue
                          const pattern = name === 'perimeterPi' ? /^\d{1,7}(?:[.,]\d{1,6})?$/ : /^\d{1,7}(?:[.,]\d{1,2})?$/
                          if (pattern.test(candidate)) values[name] = Number(candidate.replace(',', '.'))
                        }
                        const edited = values[key] === undefined ? undefined : editPerimeter(item, values)
                        writeField(field, edited ? null : text)
                        if (edited) {
                          for (const { key: name } of inputs) {
                            if (values[name] !== undefined) writeField(`${id}:${name}`, null)
                          }
                          if (inputs.some(({ key: name, value: applied }) => values[name] !== undefined && values[name] !== applied)) {
                            update(index, edited)
                          }
                        }
                      }} />
                  </label>
                  {error && <span id={field} className="libre-field-error" role="alert">
                    {key === 'perimeterPi' ? 'Pour π, saisissez une valeur de 3 à 4.'
                      : 'Saisissez une mesure positive compatible avec les autres cotes de la figure.'}
                  </span>}
                </div>
              )
            })}
            <label className="libre-field is-line">
              <span>Unité des cotes</span>
              <select className="libre-line-input" value={unit} onChange={(event) => {
                const edited = editPerimeter(item, { unit: event.target.value })
                if (edited) update(index, edited)
              }}>
                {[...new Set(['mm', 'cm', 'dm', 'm', 'km', unit])].map((choice) => <option key={choice} value={choice}>{choice}</option>)}
              </select>
            </label>
            <div className="libre-unit-actions">
              <button type="button" className="button small secondary" aria-pressed={Boolean(item.libreLocked)}
                aria-label={`Verrou de la question ${index + 1}`} onClick={() => update(index, { ...item, libreLocked: !item.libreLocked })}>
                {item.libreLocked ? 'Verrouillée' : 'Verrouiller'}
              </button>
              {item.libreId && !item.libreLocked && (
                <button type="button" className="button small secondary" onClick={() => regenerate(item.libreId)}>Autre question</button>
              )}
            </div>
          </fieldset>
        )
      })}
    </section>
  )
}
