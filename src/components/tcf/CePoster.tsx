import { WorksheetImage } from '@/components/WorksheetImage'
import { SheetCopy } from '@/components/sheet-copy'
import { ceIllustratedPassages, ceIllustrationsFor } from '@/tcf/ce-illustrations'

/** Affiche composée à partir du texte source : aucune information n’est inventée ou supprimée. */
export function CePoster({ title, text, label = 'À lire', metadata, image, compact = false }: {
  title: string
  text: string
  label?: string
  metadata?: string
  image?: string | null
  compact?: boolean
}) {
  const passages = ceIllustratedPassages(text, title, 180)
  const hero = !compact ? image || passages.find((passage) => passage.illustration)?.illustration?.src : undefined
  const columns = passages.length >= 4
  const extraPictures = !compact ? ceIllustrationsFor(text).filter((picture) => picture.src !== hero && !passages.some((passage) => passage.illustration?.src === picture.src)).slice(0, 2) : []
  return (
    <article className={`tcf-ce-poster${compact ? ' is-compact' : ''}`}>
      <header className="tcf-ce-poster-head">
        <div>
          <p className="tcf-ce-poster-label">{label}</p>
          <h3>{title}</h3>
          {metadata ? <p className="tcf-ce-poster-meta">{metadata}</p> : null}
        </div>
        {hero ? <WorksheetImage src={hero} alt="" className="tcf-ce-poster-hero" /> : null}
      </header>
      {extraPictures.length ? <div className="tcf-ce-poster-visuals">
        {extraPictures.map((picture) => <figure key={picture.src}>
          <WorksheetImage src={picture.src} alt={picture.label} />
          <figcaption>{picture.label}</figcaption>
        </figure>)}
      </div> : null}
      <div className={`tcf-ce-poster-passages tcf-ce-illustrated${columns ? ' is-columns' : ''}`}>
        {passages.map((passage, i) => (
          <section key={i} className={`tcf-ce-poster-passage${passage.illustration && passage.illustration.src !== hero ? ' has-picture' : ''}`}>
            {passage.illustration && passage.illustration.src !== hero ? (
              <WorksheetImage src={passage.illustration.src} alt={passage.illustration.label} className="tcf-ce-poster-picture" />
            ) : null}
            <div className="tcf-ce-poster-text"><SheetCopy text={passage.text} /></div>
          </section>
        ))}
      </div>
    </article>
  )
}
