import type { PeEvaluation } from '@/tcf/pe-evaluation'

const score = (n: number) => n.toLocaleString('fr-CH', { maximumFractionDigits: 2 })

/** Page de correction distincte : le barème ne réduit pas la zone d’écriture élève. */
export function PeEvaluationSheet({ evaluation }: { evaluation: PeEvaluation }) {
  return (
    <article className="worksheet-sheet tcf-pe-evaluation-sheet">
      <div className="sheet-body">
        <h2>PE — Grille d’évaluation</h2>
        <p className="tcf-pe-evaluation-title">{evaluation.title}</p>
        <p>Nom / Prénom / Classe : ……………………………………………</p>
        {evaluation.task ? <p className="tcf-pe-evaluation-task">{evaluation.task}</p> : null}
        <table className="tcf-pe-evaluation-table">
          <caption>{evaluation.reference}{evaluation.points !== evaluation.referencePoints ? ` · barème adapté de ${score(evaluation.referencePoints)} à ${score(evaluation.points)} points` : ''}</caption>
          <thead><tr><th scope="col">Critères et indicateurs</th><th scope="col">Points</th><th scope="col">Note</th></tr></thead>
          {evaluation.criteria.map((criterion, i) => (
            <tbody key={i}>
              <tr className="tcf-pe-criterion"><th scope="row">{i + 1}. {criterion.title}</th><td>/{score(criterion.levels[0].points)}</td><td>……</td></tr>
              {criterion.levels.map((level, j) => (
                <tr key={j}><td>{level.description}</td><td>{score(level.points)}</td><td /></tr>
              ))}
            </tbody>
          ))}
          <tfoot><tr><th scope="row">Total</th><td>/{score(evaluation.points)}</td><td>……</td></tr></tfoot>
        </table>
        <p className="tcf-pe-evaluation-note">Les points sont attribués par le correcteur selon la production de l’élève. Une réponse modèle n’est pas la seule réponse possible.</p>
      </div>
    </article>
  )
}
