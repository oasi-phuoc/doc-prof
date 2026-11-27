import type { GrammarCoStatement } from '../../grammaire/exercises/co-true-false'
import type { PreviewMode } from '../../math/types'

export function GrammarCoTrueFalse({ statements, mode }: { statements: GrammarCoStatement[]; mode: PreviewMode }) {
  const show = mode === 'answers'
  const hasProposedAnswers = statements.some((statement) => statement.proposedAnswer)
  return (
    <table className="grammar-co-true-false">
      <thead>
        <tr><th scope="col">{hasProposedAnswers ? 'Question et réponse proposée' : 'Affirmation'}</th><th scope="col">Vrai</th><th scope="col">Faux</th></tr>
      </thead>
      <tbody>
        {statements.map((statement, index) => (
          <tr key={statement.id}>
            <th scope="row">
              <span>{index + 1}. {statement.text}</span>
              {statement.proposedAnswer && <div><strong>Réponse proposée</strong> · {statement.proposedAnswer}</div>}
              {show && <small>{statement.evidence}</small>}
            </th>
            {[true, false].map((answer) => (
              <td key={String(answer)}>
                <span className="grammar-co-checkbox" aria-label={show && answer === statement.correct ? 'Bonne réponse' : undefined}>
                  {show && answer === statement.correct ? '✓' : ''}
                </span>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
