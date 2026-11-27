import type { MathItem } from '@/math/types'
import { gridCells, withGridCells } from './word-list'

export function LetterGridEditor({ items, onChange, instruction, onInstruction, activityId, fields, writeField }: {
  items: MathItem[]
  onChange: (items: MathItem[]) => void
  instruction: string
  onInstruction: (text: string) => void
  activityId: string
  fields: Record<string, string>
  writeField: (key: string, text: string | null) => void
}) {
  return (
    <div className="quad-libre-block">
      <b>Contenu de l’activité</b>
      <label className="libre-field is-line">
        <span>Consigne</span>
        <textarea className="libre-line-input is-textarea" rows={2} value={instruction}
          onChange={(event) => onInstruction(event.target.value)} />
      </label>
      {items.map((item, index) => {
        const words = item.layout === 'mark-letter'
        const letters = item.layout === 'letter-grid'
        const label = item.layout === 'read-phrases' ? 'Phrase' : item.layout === 'dictee-grid' ? 'Mot dicté' : 'Case'
        const cells = gridCells(item)
        const targets = letters ? item.labels : words ? item.themeGraphemes : undefined
        const columns = item.letterGridCols ?? (label === 'Phrase' ? 1 : label === 'Mot dicté' ? 2 : 4)
        const updateItem = (next: MathItem) => onChange(items.map((current, i) => i === index ? next : current))
        const currentCase = letters && cells.every((cell) => cell === cell.toLocaleUpperCase('fr')) ? 'upper'
          : letters && cells.every((cell) => cell === cell.toLocaleLowerCase('fr')) ? 'lower' : null
        function editCell(position: number, raw: string) {
          const key = `${activityId}:grille-${index}:${position}`
          const text = raw.trim().normalize('NFC')
          if (!text || letters && !/^\p{L}{1,3}$/u.test(text)) {
            writeField(key, raw)
            return
          }
          const next = currentCase === 'upper' ? text.toLocaleUpperCase('fr')
            : currentCase === 'lower' ? text.toLocaleLowerCase('fr') : text
          writeField(key, null)
          updateItem(withGridCells(item, cells.map((cell, i) => i === position ? next : cell)))
        }
        return (
          <fieldset key={index} className="libre-grid-fields">
            <legend>{items.length === 1 ? (label === 'Phrase' ? 'Phrases à lire' : label === 'Mot dicté' ? 'Mots dictés' : 'Cases') : `Grille ${index + 1}`}</legend>
            {targets?.length ? <p>Cible imprimée {targets.join(', ')}</p> : null}
            <div className="libre-grid-inputs" style={{ gridTemplateColumns: `repeat(${Math.min(4, columns)}, minmax(0, 1fr))` }}>
              {cells.map((cell, position) => {
                const key = `${activityId}:grille-${index}:${position}`
                const raw = fields[key]
                return (
                  <label key={position} className="libre-field is-line">
                    <span>{label} {position + 1}</span>
                    <input className="libre-line-input" type="text" value={raw ?? cell}
                      aria-label={`${label} ${position + 1}`} data-applied-value={cell} aria-invalid={raw !== undefined}
                      onChange={(event) => editCell(position, event.target.value)} />
                    {raw !== undefined && <span className="libre-field-error" role="alert">{letters ? 'Saisissez une à trois lettres.' : 'Indiquez le texte à imprimer.'}</span>}
                  </label>
                )
              })}
            </div>
          </fieldset>
        )
      })}
    </div>
  )
}
