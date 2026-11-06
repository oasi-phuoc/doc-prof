import type { TcfPoTroisThemes } from '@/tcf/types'

/** Deuxième page de l’exercice PO : les questions suivent l’ordre des trois thèmes. */
export function ThreeThemesCorrigeSheet({ exercise }: { exercise: TcfPoTroisThemes }) {
  return (
    <article className="worksheet-sheet sheet-even tcf-themes-corrige-sheet">
      <div className="sheet-body">
        <h2>Production orale — Poser des questions</h2>
        <p className="tcf-text">Corrigé — Exemples de questions possibles</p>
        {exercise.support.themes.map((theme, i) => (
          <section key={i}>
            <h3>Thème {i + 1} — {theme.theme}</h3>
            {theme.exemples_questions.some((question) => question.trim()) ? (
              <ul>
                {theme.exemples_questions.filter((question) => question.trim()).slice(0, 8).map((question, j) => (
                  <li key={j}>{question}</li>
                ))}
              </ul>
            ) : <p>Aucun exemple de question renseigné pour ce thème.</p>}
          </section>
        ))}
      </div>
    </article>
  )
}
