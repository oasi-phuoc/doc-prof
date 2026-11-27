import { logiqueBankOptions, logiqueItemById } from '@/logique/generate'
import { createRng, randomSeed } from '@/math/rng'
import type { MathItem } from '@/math/types'

export function LogicEditor({ items, type, instruction, onInstruction, onChange, onRegenerate }: {
  items: MathItem[]
  type: string
  instruction: string
  onInstruction: (instruction: string) => void
  onChange: (items: MathItem[]) => void
  onRegenerate: (id?: string) => void
}) {
  const bank = logiqueBankOptions(type)
  const update = (position: number, item: MathItem) => onChange(items.map((current, i) => i === position ? item : current))
  return (
    <div className="quad-libre-block">
      <label className="libre-field is-line">
        <span>Consigne</span>
        <textarea className="libre-line-input is-textarea" rows={2} value={instruction}
          onChange={(event) => onInstruction(event.target.value)} />
      </label>
      {items.some((item) => !item.libreLocked) && (
        <button type="button" className="button secondary small" onClick={() => onRegenerate()}>
          Régénérer les questions déverrouillées
        </button>
      )}
      <ul className="libre-item-list" aria-label="Questions de logique">
        {items.map((item, position) => {
          const puzzle = item.logique
          if (!puzzle) return null
          return (
            <li key={item.libreId ?? position} className="libre-item-card is-libre-row">
              <span className="libre-item-num is-accent">{position + 1}.</span>
              <div className="libre-item-body" role="group" aria-label={`Question ${position + 1}`}>
                <label className="libre-field is-line">
                  <span>Question de la banque</span>
                  <select className="libre-line-input" value={puzzle.id ?? ''} onChange={(event) => {
                    const id = event.target.value
                    if (!id || id === puzzle.id) return
                    const replacement = logiqueItemById(type, id, createRng(randomSeed()))
                    update(position, { ...replacement, libreId: item.libreId, libreLocked: item.libreLocked })
                  }}>
                    <option value="" disabled>Choisir dans la banque</option>
                    {bank.map(({ id }, index) => <option key={id} value={id}>Question {index + 1}</option>)}
                  </select>
                </label>
                {puzzle.correctIndex !== undefined && puzzle.choices.length > 1 && (
                  <label className="libre-field is-line">
                    <span>Bonne réponse</span>
                    <select className="libre-line-input" value={puzzle.correctIndex} onChange={(event) => {
                      const correctIndex = Number(event.target.value)
                      const answer = puzzle.choiceLabels?.[correctIndex] ?? String.fromCharCode(65 + correctIndex)
                      update(position, { ...item, answer, logique: { ...puzzle, correctIndex } })
                    }}>
                      {puzzle.choices.map((_, index) => <option key={index} value={index}>{puzzle.choiceLabels?.[index] ?? String.fromCharCode(65 + index)}</option>)}
                    </select>
                  </label>
                )}
                <div className="libre-unit-actions">
                  <button type="button" className="button secondary small" aria-pressed={Boolean(item.libreLocked)}
                    aria-label={`Verrou de la question ${position + 1}`} onClick={() => update(position, { ...item, libreLocked: !item.libreLocked })}>
                    {item.libreLocked ? 'Verrouillée' : 'Verrouiller'}
                  </button>
                  {item.libreId && !item.libreLocked && (
                    <button type="button" className="button secondary small" onClick={() => onRegenerate(item.libreId)}>Autre question</button>
                  )}
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
