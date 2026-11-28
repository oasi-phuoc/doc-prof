import type { MathItem } from '@/math/types'

const visuals = import.meta.glob<string>(['../../math/media/theory/*.png', '../../math/media/theory/falc/*.png'], {
  eager: true,
  import: 'default',
  query: '?url',
})

export function MathTheoryView({ lesson }: { lesson: NonNullable<MathItem['mathTheory']> }) {
  const filename = lesson.illustration ? `falc/${lesson.illustration}` : lesson.topic
  const image = lesson.visualSrc || visuals[`../../math/media/theory/${filename}.png`]
  const showVisual = !lesson.hideVisual && Boolean(image)
  const { title, heading } = lesson
  const plainNumbers = lesson.stepNumbering === 'plain'

  return (
    <article className="math-theory-lesson">
      <h2>{title}</h2>
      {heading && heading !== title && <h3 className="math-theory-introduction">{heading}</h3>}
      {lesson.goal && <p className="math-theory-goal">{lesson.goal}</p>}
      {showVisual ? (
        <figure>
          <img src={image} alt={lesson.visualAlt} />
          {lesson.example && <figcaption>{lesson.example}</figcaption>}
        </figure>
      ) : lesson.example ? (
        <p className="math-theory-example">{lesson.example}</p>
      ) : null}
      {(lesson.steps.length > 0 || lesson.words.length > 0) && <div className="math-theory-sections">
        {lesson.steps.length > 0 && <section className="math-theory-panel is-steps">
          <h4>Les étapes</h4>
          <ol role="list" className={`math-theory-panel-body math-theory-steps${plainNumbers ? ' is-plain' : ''}`}>
            {lesson.steps.map((step, index) => (
              <li key={index}>
                <span className="math-theory-step-number">{index + 1}{plainNumbers ? '.' : ''}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>}
        {lesson.words.length > 0 && <section className="math-theory-panel is-words">
          <h4>Les mots</h4>
          <dl className="math-theory-panel-body math-theory-words">
            {lesson.words.map(([word, definition, role], index) => (
              <div key={index}>
                <dt className={role && `math-theory-word-${role}`}>{word}</dt>
                <dd>{definition}</dd>
              </div>
            ))}
          </dl>
        </section>}
      </div>}
    </article>
  )
}
