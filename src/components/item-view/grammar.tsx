import { Fragment } from 'react'
import type { PreviewMode } from '@/math/types'
import type { GrammarQuestion } from '@/grammaire/curriculum/types'
import { PhraseOrderBlock } from './phrase'
import { GrammarReadingView } from './grammar-reading'
import { GrammarProductionView } from './grammar-production'

function VerbHint({verb}:{verb?:string}) {
  return verb?<span className="grammar-verb-hint tcf-verbe-theme">({verb})</span>:null
}
function Sentence({ text, answer, givenVerb }: {text:string;answer?:string;givenVerb?:string}) {
  return <>{text.split('___').map((part,index)=><Fragment key={index}>{index>0?<><span className="grammar-answer-inline">{answer??'\u00a0'}</span><VerbHint verb={givenVerb}/></>:null}{part}</Fragment>)}</>
}
export function GrammarQuestionView({ question:q, mode }: {question:GrammarQuestion;mode:PreviewMode}) {
  const u=q.unit, corrected=mode==='answers'
  if (u.kind==='reading') return <GrammarReadingView question={q} mode={mode}/>
  if (u.kind==='production') return <GrammarProductionView unit={u} mode={mode}/>
  return <div className={`grammar-question${u.responseLines===2?' grammar-two-lines':''}`}>
    {u.cue?<p className="grammar-cue">{u.cue}</p>:null}
    {u.kind==='completion'?<>
      <p><Sentence text={u.prompt} answer={corrected?u.answers[0]:undefined} givenVerb={u.givenVerb}/></p>
      {q.presentation==='choice'?<ul className="grammar-choices" aria-label="Propositions">
        {q.options?.map((option,index)=><li key={option.id}><span className="grammar-choice-box" aria-hidden="true">{corrected&&u.answers.includes(option.text)?'✓':'\u00a0'}</span> <b>{String.fromCharCode(65+index)}.</b> {option.text}</li>)}
      </ul>:null}
      {corrected&&u.answers.length>1?<p className="grammar-explanation">Autre forme acceptée : {u.answers.slice(1).join(' / ')}.</p>:null}
    </>:u.kind==='match'?<>
      <div className="grammar-match-columns">
        <ol>{u.pairs.map((pair,index)=><li key={pair.id}><Sentence text={pair.left} answer={corrected?pair.right:undefined}/>{corrected?<strong className="grammar-match-answer"> → {String.fromCharCode(65+(q.rightOptions?.findIndex(o=>o.id===pair.id)??0))}</strong>:<span className="grammar-match-slot" aria-label={`Réponse ${index+1}`}>___</span>}</li>)}</ol>
        <ol type="A">{q.rightOptions?.map(o=><li key={o.id}>{o.text}</li>)}</ol>
      </div>
    </>:u.kind==='order'?<PhraseOrderBlock item={{layout:'phrase-order',tokens:q.tokens,answer:u.answers[0]!,responseAnswer:u.answers[0],responseVerb:u.givenVerb}} mode={mode}/>:<>
      <p>{u.prompt}</p>
      {u.kind==='transform'?u.targetSubject?<p className="grammar-target-subject">Sujet à utiliser : <strong>{u.targetSubject}</strong></p>:<p className="grammar-transform-directive">{u.directive}</p>:null}
      <div className="grammar-written-response">
        <span className={`answer-line-field${corrected?' filled':''}`}>{corrected?u.answers.join(' / '):'\u00a0'}</span>
        <VerbHint verb={u.givenVerb}/>
      </div>
    </>}
    {corrected?<p className="grammar-explanation">{u.explanation}</p>:null}
  </div>
}
