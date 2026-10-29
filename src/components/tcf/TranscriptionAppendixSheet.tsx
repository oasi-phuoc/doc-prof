import { Paragraphs } from '@/components/tcf/TexteSupport'
import {
  DocumentFooter,
  InstitutionalDocumentHeader,
  SheetBody,
  type InstitutionalHeader,
} from '@/components/math/PrintDocumentChrome'
import type { TranscriptionEntry } from '@/tcf/transcriptions'

/** Page(s) de fin du corrigé : toutes les transcriptions audio. */
export function TranscriptionAppendixSheet({
  entries,
  pageNumber,
  totalPages,
  institutional,
  appendixIndex,
  appendixTotal,
}: {
  entries: TranscriptionEntry[]
  pageNumber: number
  totalPages: number
  institutional: InstitutionalHeader
  /** 1-based index among transcription sheets only. */
  appendixIndex: number
  appendixTotal: number
}) {
  const title =
    appendixTotal > 1
      ? `Transcriptions (${appendixIndex}/${appendixTotal})`
      : 'Transcriptions'
  return (
    <article className={`worksheet-sheet ${pageNumber % 2 === 1 ? 'sheet-odd' : 'sheet-even'}`}>
      {appendixIndex === 1 ? (
        <InstitutionalDocumentHeader
          config={institutional}
          evalMode={false}
          totalPoints={0}
          fallbackTitle={title}
        />
      ) : null}
      <SheetBody>
        <div className="tcf-transcriptions-body">
          <header className="exercise-heading">
            <div className="exercise-heading-main">
              <h3>{title}</h3>
              <p className="exercise-instruction">
                Transcriptions des documents audio — à consulter après les corrigés des exercices.
              </p>
            </div>
          </header>
          <div className="tcf-transcriptions">
            {entries.map((entry, i) => (
              <section
                key={`${entry.exerciseNo}-${i}-${entry.title}`}
                className="tcf-transcription-block"
              >
                <h4>
                  Exercice {entry.exerciseNo}
                  {entry.title ? ` — ${entry.title}` : ''}
                </h4>
                <Paragraphs text={entry.text} />
              </section>
            ))}
          </div>
        </div>
      </SheetBody>
      <DocumentFooter
        pageNumber={pageNumber}
        total={totalPages}
        reference={institutional.reference}
      />
    </article>
  )
}
