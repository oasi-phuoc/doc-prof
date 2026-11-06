import type { PeEvaluation } from '@/tcf/pe-evaluation'

const score = (n: number) => n.toLocaleString('fr-CH', { maximumFractionDigits: 2 })

/** Page de correction distincte : le barème ne réduit pas la zone d’écriture élève. */
export function PeEvaluationSheet({ evaluation }: { evaluation: PeEvaluation }) {
  return (
    <article className="worksheet-sheet tcf-pe-evaluation-sheet">
      <div className="sheet-body">
        <header className="tcf-pe-evaluation-top">
          <div>
            <h2>PE — Grille d’évaluation</h2>
            <p className="tcf-pe-evaluation-title">{evaluation.title}</p>
          </div>
          <p className="tcf-pe-evaluation-total">
            Total …… /{score(evaluation.points)}
          </p>
        </header>
        <ul className="tcf-pe-identity">
          <li>
            <span>Nom :</span>
            <span className="tcf-pe-identity-line" />
          </li>
          <li>
            <span>Prénom :</span>
            <span className="tcf-pe-identity-line" />
          </li>
          <li>
            <span>Classe :</span>
            <span className="tcf-pe-identity-line" />
          </li>
        </ul>
        <div className="tcf-pe-criteria">
          {evaluation.criteria.map((criterion, i) => (
            <section key={i} className="tcf-pe-criterion-frame">
              <div className="tcf-pe-criterion-head">
                <span>
                  {i + 1}. {criterion.title}
                </span>
              </div>
              <div className="tcf-pe-levels">
                {criterion.levels.map((level, j) => (
                  <div key={j} className="tcf-pe-level">
                    <span>{level.description}</span>
                    <span className="tcf-pe-level-points">{score(level.points)}</span>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
        <p className="tcf-pe-evaluation-note">
          Les points sont attribués par le correcteur selon la production de l’élève. Une réponse modèle n’est pas la seule réponse possible.
        </p>
      </div>
    </article>
  )
}
