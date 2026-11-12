import type {PreviewMode} from '@/math/types'
import type {GrammarQuestion} from '@/grammaire/curriculum/types'
import {grammarReadingChild} from '@/grammaire/curriculum/items'
import { GrammarImageSupports } from '@/components/grammar/GrammarImageSupports'

export function GrammarReadingView({question:q,mode}:{question:GrammarQuestion;mode:PreviewMode}) {
  const u=q.unit,corrected=mode==='answers'
  if (u.kind!=='reading') return null
  const child=grammarReadingChild(q)
  if (!child) return <div className="grammar-question grammar-reading-support" data-document-id={u.id}>
    <p className="grammar-reading-genre">Texte {q.readingPart?.kind==='support'?q.readingPart.documentNumber:''} · {u.genre}</p>
    <h3>{u.prompt}{q.readingPart?.kind==='support'&&q.readingPart.continued?' (suite)':''}</h3>
    <div className="grammar-reading-text">{u.text}</div>
    <GrammarImageSupports supports={u.imageSupports}/>
  </div>
  const options=q.readingOptions?.[child.id]
  return <div className="grammar-question grammar-reading-question grammar-two-lines" data-reading-question-id={child.id}>
    <p>{child.prompt}</p>
    {child.response==='choice'?<ul className="grammar-choices" aria-label="Propositions">{options?.map((o,index)=><li key={o.id}>
      <span className="grammar-choice-box" aria-hidden="true">{corrected&&child.answers.includes(o.text)?'✓':'\u00a0'}</span> <b>{String.fromCharCode(65+index)}.</b> {o.text}
    </li>)}</ul>:<div className="grammar-written-response"><span className={`answer-line-field${corrected?' filled':''}`}>{corrected?child.answers.join(' / '):'\u00a0'}</span></div>}
    {corrected?<p className="grammar-explanation">{child.explanation} Dans le texte : {child.evidence.map(quote=>`« ${quote} »`).join(' ; ')}.</p>:null}
  </div>
}
