import { Fragment } from 'react'
import type { PreviewMode } from '@/math/types'
import type { GrammarQuestion } from '@/grammaire/curriculum/types'
import { PhraseOrderBlock } from './phrase'

function Sentence({ text, answer }: {text:string;answer?:string}) {
  return <>{text.split('___').map((part,index)=><Fragment key={index}>{index>0?<span className="grammar-answer-inline">{answer??'\u00a0'}</span>:null}{part}</Fragment>)}</>
}
export function GrammarQuestionView({ question:q, mode }: {question:GrammarQuestion;mode:PreviewMode}) {
  const u=q.unit, corrected=mode==='answers'
  return <div className="grammar-question">
    {u.kind==='completion'?<>
      <p><Sentence text={u.prompt} answer={corrected?u.answers[0]:undefined}/></p>
      {q.presentation==='choice'?<ul className="grammar-choices" aria-label="Propositions">
        {q.options?.map((option,index)=><li key={option.id}><span className="grammar-choice-box" aria-hidden="true">{corrected&&u.answers.includes(option.text)?'✓':'\u00a0'}</span> <b>{String.fromCharCode(65+index)}.</b> {option.text}</li>)}
      </ul>:null}
    </>:u.kind==='match'?<>
      <div className="grammar-match-columns">
        <ol>{u.pairs.map((pair,index)=><li key={pair.id}><Sentence text={pair.left} answer={corrected?pair.right:undefined}/>{corrected?<strong className="grammar-match-answer"> → {String.fromCharCode(65+(q.rightOptions?.findIndex(o=>o.id===pair.id)??0))}</strong>:<span className="grammar-match-slot" aria-label={`Réponse ${index+1}`}>___</span>}</li>)}</ol>
        <ol type="A">{q.rightOptions?.map(o=><li key={o.id}>{o.text}</li>)}</ol>
      </div>
    </>:u.kind==='order'?<PhraseOrderBlock item={{layout:'phrase-order',tokens:q.tokens,answer:u.answers[0]!,responseAnswer:u.answers[0]}} mode={mode}/>:<>
      <p>{u.prompt}</p>
      <span className={`answer-line-field${corrected?' filled':''}`}>{corrected?u.answers.join(' / '):'\u00a0'}</span>
    </>}
    {corrected?<p className="grammar-explanation">{u.explanation}</p>:null}
  </div>
}
