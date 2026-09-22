import { useMemo, useState } from 'react'

type Exercise = { id: string; prompt: string; answer: string }
type Page = { title: string; instruction?: string; exercises: Exercise[] }

type GenericModuleContentProps = {
  title: string
  subtitle?: string
  pages: Page[]
  showCorrections?: boolean
}

export default function GenericModuleContent({ title, subtitle, pages, showCorrections = false }: GenericModuleContentProps) {
  const [pageIndex, setPageIndex] = useState(0)
  const [corrections, setCorrections] = useState(showCorrections)
  const page = pages[pageIndex]
  const pageCount = pages.length
  const questions = useMemo(() => page?.exercises ?? [], [page])

  if (!page) return null

  return (
    <section className="generic-module-content" aria-label={title}>
      <header className="module-content-header">
        <div>
          <span className="eyebrow">Mathématiques</span>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
        <button type="button" className="button small" onClick={() => setCorrections((value) => !value)}>
          {corrections ? 'Masquer les corrections' : 'Afficher les corrections'}
        </button>
      </header>
      {pageCount > 1 && (
        <nav className="module-page-tabs" aria-label="Pages de la fiche">
          {pages.map((item, index) => (
            <button key={`${item.title}-${index}`} type="button" className={index === pageIndex ? 'active' : ''} onClick={() => setPageIndex(index)}>
              Page {index + 1}<small>{item.title}</small>
            </button>
          ))}
        </nav>
      )}
      <article className="module-exercise-page">
        <h3>{page.title}</h3>
        {page.instruction && <p className="sheet-instruction">{page.instruction}</p>}
        <ol className="module-exercise-list">
          {questions.map((exercise) => (
            <li key={exercise.id}>
              <strong>{exercise.prompt}</strong>
              {corrections && <span className="module-correction">Correction : {exercise.answer}</span>}
            </li>
          ))}
        </ol>
      </article>
    </section>
  )
}
