import { WorksheetImage } from '@/components/WorksheetImage'
import { WorksheetSettings } from '@/components/generator/WorksheetSettings'
import type { WorksheetBlock } from '@/math/types'
import { TheoryInlineContent } from './theory-marks'

export function LogistiqueGlossaryTable({ block, onBreakAfter }: {
  block: WorksheetBlock
  onBreakAfter?: (index: number) => void
}) {
  const offset = block.itemOffset ?? 0
  const count = block.logistiqueGlossaryLength ?? block.items.length
  return (
    <table className="theory-table has-col-head logistique-glossary-table" aria-label="Glossaire">
      <colgroup>
        <col className="logistique-glossary-image-col" />
        <col className="logistique-glossary-term-col" />
        <col />
      </colgroup>
      <thead>
        <tr><th scope="col">Image</th><th scope="col">Notion</th><th scope="col">Explication / définition</th></tr>
      </thead>
      <tbody>
        {block.items.map(({ logistiqueGlossaryEntry: entry, logistiqueGlossaryFigure: figure, theoryPageBreakAfter, prompt }, index) => (
          entry && <tr key={prompt ?? index}>
            <td className="logistique-glossary-figure">
              {figure && <figure>
                <WorksheetImage src={figure.src} alt={figure.alt} editable={false} applyOverrides={false} />
                {figure.caption && <figcaption>{figure.caption}</figcaption>}
              </figure>}
            </td>
            <th scope="row">
              <TheoryInlineContent text={entry.term} />
              {onBreakAfter && offset + index < count - 1 && (
                <WorksheetSettings label={entry.term}>
                  <button type="button" className="draft-grid-chip logistique-glossary-break no-print"
                    aria-pressed={Boolean(block.tcfPageBreakAfter?.[offset + index] ?? theoryPageBreakAfter)}
                    aria-label={`Saut de page après ${entry.term}`} onClick={() => onBreakAfter(index)}>
                    Saut
                  </button>
                </WorksheetSettings>
              )}
            </th>
            <td><TheoryInlineContent text={entry.definition} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
