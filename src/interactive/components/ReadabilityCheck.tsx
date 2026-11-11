import type { ReadabilityResult } from '../layout/preflight'
import type { Question } from '../domain/types'

export function ReadabilityCheck({ questions, complete, done, total, results, error }: { questions: Question[]; complete: boolean; done: number; total: number; results: ReadabilityResult[]; error?: string }) {
  const flagged = questions.flatMap((question, i) => {
    const measures = results.filter((result) => result.questionId === question.id && result.level >= 2)
    return measures.length ? [{ question, number: i + 1, measures }] : []
  })
  return <section className="ci-readability-check" aria-label="Contrôle de lisibilité" aria-busy={!complete}>
    <h3>Lisibilité des questions</h3>
    <p role="status">{error ?? (!complete ? `Contrôle de l’affichage… ${done} / ${total || '…'} écran(s)` : flagged.length ? `${flagged.length} question(s) avec un texte long : vérifiez les adaptations ci-dessous.` : 'Affichage vérifié : aucun texte long signalé.')}</p>
    {!complete && <progress aria-label="Avancement du contrôle de lisibilité" value={done} max={total || 1} />}
    {flagged.length > 0 && <><p>Vous pouvez raccourcir la consigne ou les propositions dans la fiche, ou conserver ces adaptations.</p><ul>{flagged.map(({ question, number, measures }) => <li key={question.id} data-readability-question={question.id}><b>Question {number} : {question.prompt}</b><ul>{measures.map((measure) => <li key={`${measure.width}:${measure.height}`} data-readability-level={measure.level}>{measure.width} × {measure.height} : {measure.level === 2 ? 'propositions en liste verticale' : 'défilement nécessaire, avec accès « Suite » au texte complet'}</li>)}</ul></li>)}</ul></>}
    <small>Mesure dans le navigateur à 1 920 × 1 080 et 1 366 × 768{window.innerWidth <= 700 ? ', ainsi que sur la taille actuelle de cet écran' : ''}. Un essai sur le tableau réel reste nécessaire.</small>
  </section>
}
