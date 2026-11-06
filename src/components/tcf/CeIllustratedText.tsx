import { WorksheetImage } from '@/components/WorksheetImage'
import { SheetCopy } from '@/components/sheet-copy'
import { ceIllustratedPassages } from '@/tcf/ce-illustrations'

export function CeIllustratedText({ text, context = '' }: { text: string; context?: string }) {
  return (
    <div className="tcf-ce-illustrated">
      {ceIllustratedPassages(text, context).map((passage, i) => (
        <div key={i} className={`tcf-ce-passage${passage.illustration ? ' has-illustration' : ''}`}>
          {passage.illustration ? <WorksheetImage className="tcf-ce-illustration" src={passage.illustration.src} alt={passage.illustration.label} /> : null}
          <p className="tcf-text"><SheetCopy text={passage.text} /></p>
        </div>
      ))}
    </div>
  )
}
