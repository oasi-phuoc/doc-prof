import { associationAnswersFromExercise, parseAssociationDocuments } from '@/tcf/association-documents'
import type { TcfCeAnnonce } from '@/tcf/types'
import type { PreviewMode } from '@/math/types'

export function CeAssociationAnswers({ exercise, mode }: { exercise: TcfCeAnnonce; mode: PreviewMode }) {
  const association = parseAssociationDocuments(exercise.support.texte)
  const answers = associationAnswersFromExercise(exercise)
  if (!association) return null
  return <div className="tcf-assoc">
    <p>Associez chaque personne au document qui lui correspond.</p>
    <table className="tcf-assoc-people"><tbody>{association.personnes.map((person) => (
      <tr key={person.lettre}><th scope="row">{person.lettre}. {person.texte}</th><td>
        Document n° <span className="answer-line-field tcf-assoc-num-line">{mode === 'answers' ? answers[person.lettre] : ''}</span>
      </td></tr>
    ))}</tbody></table>
  </div>
}
