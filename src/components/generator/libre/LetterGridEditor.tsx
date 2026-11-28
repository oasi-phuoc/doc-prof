import type { MathItem } from '@/math/types'
import { gridCells, withGridCells } from './word-list'

function matchesWord(value: string, target: string): boolean {
  return value.normalize('NFC').toLocaleLowerCase('fr') === target.normalize('NFC').toLocaleLowerCase('fr')
}

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
        const reading = item.letterGridPurpose === 'reading'
        const circling = item.letterGridPurpose === 'circle'
        const wordGrid = reading || circling
        const letters = item.layout === 'letter-grid' && !wordGrid
        const singleText = item.layout === 'text'
        const label = item.layout === 'read-phrases' || item.readingText ? 'Phrase'
          : item.layout === 'dictee-grid' || singleText ? 'Mot dicté' : 'Case'
        const cells = gridCells(item)
        const targets = letters ? item.labels : words ? item.themeGraphemes : undefined
        const columns = item.letterGridCols ?? (wordGrid ? 8 : label === 'Phrase' || singleText ? 1 : label === 'Mot dicté' ? 2 : 4)
        const target = circling ? item.labels?.[0] ?? item.answer : ''
        const targetField = `${activityId}:grille-${index}:cible`
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
          const nextCells = cells.map((cell, i) => i === position ? next : cell)
          if (circling && !nextCells.some((cell) => matchesWord(cell, target))) {
            writeField(key, raw)
            return
          }
          writeField(key, null)
          updateItem(withGridCells(item, nextCells))
        }
        function editTarget(raw: string) {
          const value = raw.trim().normalize('NFC')
          if (!/\p{L}/u.test(value)) {
            writeField(targetField, raw)
            return
          }
          writeField(targetField, null)
          const hasTarget = cells.some((cell) => matchesWord(cell, target))
          const nextCells = cells.map((cell, position) => (hasTarget ? matchesWord(cell, target) : position === 0) ? value : cell)
          updateItem({ ...item, options: nextCells, labels: [value], answer: value, prompt: `Entourez « ${value} ».` })
        }
        return (
          <fieldset key={index} className="libre-grid-fields">
            <legend>{singleText ? `${label} ${index + 1}`
              : items.length === 1 ? (label === 'Phrase' ? 'Phrases à lire' : label === 'Mot dicté' ? 'Mots dictés' : 'Cases') : `Grille ${index + 1}`}</legend>
            {targets?.length ? <p>Cible imprimée {targets.join(', ')}</p> : null}
            {reading && (
              <>
                <label className="libre-field is-line">
                  <span>Titre de la grille</span>
                  <input className="libre-line-input" value={item.prompt ?? ''} onChange={(event) => updateItem({ ...item, prompt: event.target.value })} />
                </label>
                <label className="libre-field is-line">
                  <span>Écriture de la grille</span>
                  <select className="libre-line-input" value={item.letterGridFont ?? 'script'} onChange={(event) =>
                    updateItem({ ...item, letterGridFont: event.target.value === 'cursive' ? 'cursive' : 'script' })}>
                    <option value="script">Script</option>
                    <option value="cursive">Cursive</option>
                  </select>
                </label>
                <div className="mode-toggle is-2" role="group" aria-label="Casse des mots">
                  <button type="button" onClick={() => updateItem(withGridCells(item, cells.map((cell) => cell.toLocaleUpperCase('fr'))))}>Majuscules</button>
                  <button type="button" onClick={() => updateItem(withGridCells(item, cells.map((cell) => cell.toLocaleLowerCase('fr'))))}>Minuscules</button>
                </div>
              </>
            )}
            {circling && (
              <>
                <label className="libre-field is-line">
                  <span>Mot ou syllabe à entourer</span>
                  <input className="libre-line-input" value={fields[targetField] ?? target}
                    aria-invalid={fields[targetField] !== undefined} data-applied-value={target}
                    onChange={(event) => editTarget(event.target.value)} />
                </label>
                {fields[targetField] !== undefined && <p className="libre-field-error" role="alert">Indiquez le texte à entourer.</p>}
              </>
            )}
            {wordGrid && (
              <label className="libre-field is-line">
                <span>Colonnes de la grille</span>
                <select className="libre-line-input" value={columns} onChange={(event) => updateItem({ ...item, letterGridCols: Number(event.target.value) })}>
                  {[...new Set([1, 2, 3, 4, 5, 6, 7, 8, columns])].map((value) => <option key={value} value={value}>{value}</option>)}
                </select>
              </label>
            )}
            <div className="libre-grid-inputs" style={{ gridTemplateColumns: `repeat(${Math.min(4, columns)}, minmax(0, 1fr))` }}>
              {cells.map((cell, position) => {
                const key = `${activityId}:grille-${index}:${position}`
                const raw = fields[key]
                const cellLabel = `${label} ${singleText ? index + 1 : position + 1}`
                return (
                  <label key={position} className="libre-field is-line">
                    <span>{cellLabel}</span>
                    <input className="libre-line-input" type="text" value={raw ?? cell}
                      aria-label={cellLabel} data-applied-value={cell} aria-invalid={raw !== undefined}
                      onChange={(event) => editCell(position, event.target.value)} />
                    {raw !== undefined && <span className="libre-field-error" role="alert">{letters ? 'Saisissez une à trois lettres.'
                      : circling && raw.trim() ? 'Gardez la cible dans au moins une case.' : 'Indiquez le texte à imprimer.'}</span>}
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
