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

  return (
    <article className="math-theory-lesson">
      {lesson.heading && <h2>{lesson.title}</h2>}
      <h3>{lesson.heading || lesson.title}</h3>
      {lesson.goal && <p className="math-theory-goal">{lesson.goal}</p>}
      {showVisual ? (
        <figure>
          <img src={image} alt={lesson.visualAlt} />
          {lesson.example && <figcaption>{lesson.example}</figcaption>}
        </figure>
      ) : lesson.example ? (
        <p className="math-theory-example">{lesson.example}</p>
      ) : null}
      {(lesson.words.length > 0 || lesson.steps.length > 0) && <div className="math-theory-sections">
        {lesson.words.length > 0 && <section>
          <h4>Les mots</h4>
          <dl>
            {lesson.words.map(([word, definition, role], index) => (
              <div key={index}>
                <dt className={role && `math-theory-word-${role}`}>{word}</dt>
                <dd>{definition}</dd>
              </div>
            ))}
          </dl>
        </section>}
        {lesson.steps.length > 0 && <section>
          <h4>Les étapes</h4>
          <ol>{lesson.steps.map((step, index) => <li key={index}>{step}</li>)}</ol>
        </section>}
      </div>}
    </article>
  )
}
