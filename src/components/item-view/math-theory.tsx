import type { MathItem } from '@/math/types'

const visuals = import.meta.glob<string>('../../math/media/theory/*.png', {
  eager: true,
  import: 'default',
  query: '?url',
})

export function MathTheoryView({ lesson }: { lesson: NonNullable<MathItem['mathTheory']> }) {
  return (
    <article className="math-theory-lesson">
      <h3>{lesson.title}</h3>
      <p className="math-theory-goal">{lesson.goal}</p>
      {lesson.hideVisual ? (
        <p className="math-theory-example">{lesson.example}</p>
      ) : (
        <figure>
          <img src={lesson.visualSrc || visuals[`../../math/media/theory/${lesson.topic}.png`]} alt={lesson.visualAlt} />
          <figcaption>{lesson.example}</figcaption>
        </figure>
      )}
      <div className="math-theory-sections">
        <section>
          <h4>Les mots</h4>
          <dl>
            {lesson.words.map(([word, definition], index) => (
              <div key={index}><dt>{word}</dt><dd>{definition}</dd></div>
            ))}
          </dl>
        </section>
        <section>
          <h4>Les étapes</h4>
          <ol>{lesson.steps.map((step, index) => <li key={index}>{step}</li>)}</ol>
        </section>
      </div>
    </article>
  )
}
