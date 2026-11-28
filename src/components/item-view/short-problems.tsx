import { Fragment } from 'react'
import { shortProblemExample, type ShortProblem, type ShortProblemDiagram as Diagram } from '@/math/short-problems'

export function ShortProblemDiagram({ diagram }: { diagram: Diagram }) {
  return (
    <div className="short-problem-diagram">
      {diagram.rows.map(({ label, facts }) => (
        <div key={label ?? facts[0]?.label} className="short-problem-diagram-row">
          {label && <strong className="short-problem-route-label">{label}</strong>}
          {facts.map((fact, index) => (
            <Fragment key={fact.label}>
              {index > 0 && <span className="short-problem-connector" aria-hidden="true">{diagram.connector}</span>}
              <div className="short-problem-fact"><span>{fact.label}</span><strong>{fact.value}</strong></div>
            </Fragment>
          ))}
        </div>
      ))}
    </div>
  )
}

export function ShortProblemExample({ problem }: { problem: ShortProblem }) {
  const example = shortProblemExample(problem)
  return (
    <figure className="math-worked-example short-problem-example">
      <figcaption><strong>Exemple.</strong> {example.prompt.at(-1)}</figcaption>
      <ShortProblemDiagram diagram={example.exampleDiagram ?? example.diagram} />
      <p className="short-problem-example-calculation">{example.calculation}</p>
      <p><strong>{example.response}</strong></p>
    </figure>
  )
}
