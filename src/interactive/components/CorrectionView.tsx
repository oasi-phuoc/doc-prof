import type { Correction, Question } from '../domain/types'
import { ResultFeedback } from './ResultFeedback'

/** Mounted only after the teacher reveals. Every proposed answer stays visible. */
export function CorrectionView({
  question,
  correction,
  selected,
  onAssess,
  onReadModel,
  assessment,
  placement = 'model',
  number,
  collective = false,
  disabled = false,
  automaticCorrect,
}: {
  automaticCorrect?:boolean
  collective?: boolean
  disabled?: boolean
  question: Question
  correction: Correction
  selected?: string
  onAssess: (value: 'acquired' | 'retry') => void
  onReadModel?: () => void
  assessment?: 'acquired' | 'retry'
  placement?: 'right' | 'model'
  number?: number
}) {
  const correct = question.choices.find(
    (choice) => choice.id === correction.choiceId,
  )
  if (question.mode === 'choice') {
    if (!correct) return null
    const isCorrect = correct.id === selected
    if (placement === 'right')
      return collective ? null : (
        <div
          className="ci-correction-status"
          role="status"
          aria-label={`${number !== undefined ? `Question ${number} : ` : ''}${isCorrect ? 'Réponse correcte' : 'Réponse incorrecte'}`}
        >
          {number !== undefined && (
            <b className="ci-result-number">{number}.</b>
          )}
          <ResultFeedback correct={isCorrect} />
          <b>{isCorrect ? 'Félicitations, c’est juste !' : selected ? 'Faux · essaie encore' : 'Temps écoulé'}</b>
        </div>
      )
    return null
  }
  if(question.mode==='memory')return placement==='right'&&!collective&&automaticCorrect!==undefined?<div className="ci-correction-status" role="status"><ResultFeedback correct={automaticCorrect}/><b>{automaticCorrect?'Toutes les paires sont retrouvées !':'Temps écoulé'}</b></div>:null
  if (placement !== 'model') return null
  const readableModel=correction.text.length>240||!!question.wordSorting
  return (
    <div className="ci-model-answer">
      <div className="ci-model-head"><b>{question.wordSorting?'Classement attendu':'Exemple de réponse'}</b>{onReadModel&&readableModel&&<button disabled={disabled} onClick={onReadModel}>{question.wordSorting?'Lire le classement':'Lire le modèle'}</button>}</div>
      <div className="ci-model-content" tabIndex={readableModel?0:undefined} role={readableModel?'region':undefined} aria-label={readableModel?'Exemple de réponse à faire défiler':undefined}><p>{correction.text}</p></div>
      <p>
        {question.wordSorting?'L’enseignant apprécie le travail.':'D’autres réponses peuvent convenir. L’enseignant apprécie la production.'}
      </p>
      <div className="ci-toolbar">
        <button
          disabled={disabled}
          aria-pressed={assessment === 'acquired'}
          onClick={() => onAssess('acquired')}
        >
          Acquis
        </button>
        <button
          disabled={disabled}
          aria-pressed={assessment === 'retry'}
          onClick={() => onAssess('retry')}
        >
          À retravailler
        </button>
      </div>
    </div>
  )
}
