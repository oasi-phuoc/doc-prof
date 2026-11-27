import type { PreviewMode } from '@/math/types'
import { isContextualGrammarMatch, type GrammarQuestion } from '@/grammaire/curriculum/types'
import { PhraseOrderBlock } from './phrase'
import { GrammarReadingView } from './grammar-reading'
import { GrammarProductionView } from './grammar-production'
import { GrammarScenarioView } from './grammar-scenario'
import { GrammarImageSupports } from '@/components/grammar/GrammarImageSupports'
import { GrammarSentence as Sentence, GrammarVerbHint as VerbHint, GrammarTextHints } from './grammar-fields'
import { GrammarPersonalView, GrammarFormView } from './grammar-personal'

export function GrammarQuestionView({ question:q, mode }: {question:GrammarQuestion;mode:PreviewMode}) {
  const u=q.unit, corrected=mode==='answers'
  if (u.kind==='personal-gap') return <GrammarPersonalView unit={u} mode={mode}/>
  if (u.kind==='form') return <GrammarFormView unit={u} mode={mode}/>
  if (u.kind==='reading') return <GrammarReadingView question={q} mode={mode}/>
  if (u.kind==='production') return <GrammarProductionView unit={u} mode={mode}/>
  if (u.kind==='scenario') return <GrammarScenarioView question={q} mode={mode}/>
  const comparisonGap=u.kind==='completion'&&u.source.typeId==='gram-ex-f9-qcm-verbe'&&q.presentation==='gap'
  const pastGap=u.kind==='completion'&&q.presentation==='gap'&&/^gram-ex-(?:pc-idee|pc-avoir|pc-etre|imparfait|pqp|double-aux|pc-pronominaux|accord-pp)-qcm-/.test(u.source.typeId)
  const pronounGap=u.kind==='completion'&&q.presentation==='gap'&&/^gram-ex-i[12356789]-qcm-/.test(u.source.typeId)
  const actionGap=u.kind==='completion'&&q.presentation==='gap'&&/^gram-ex-j[123]-qcm-/.test(u.source.typeId)
  const futureGap=u.kind==='completion'&&q.presentation==='gap'&&/^gram-ex-(?:futur-proche|futur-simple|futur-proche-ou-simple|futur-anterieur|hypothese-futur)-qcm-/.test(u.source.typeId)
  const nounGap=u.kind==='completion'&&(['gram-ex-f12-qcm-verbe','gram-ex-f13-qcm-verbe','gram-ex-g4-qcm-verbe'].includes(u.source.typeId)||['gram-ex-f11-qcm-conj','gram-ex-g6-qcm-verbe'].includes(u.source.typeId)&&u.source.partition==='a2')&&q.presentation==='gap'
  return <div className={`grammar-question${u.responseLines===2?' grammar-two-lines':''}${comparisonGap?' grammar-comparison-gap'+(u.source.partition==='a2'?' grammar-comparison-gap-a2':''):''}${nounGap||pastGap||pronounGap||actionGap||futureGap?' grammar-noun-group-gap':''}`}>
    <GrammarImageSupports supports={u.imageSupports}/>
    {u.cue?<p className="grammar-cue">{u.cue}</p>:null}
    {u.kind==='completion'?<>
      <p><Sentence text={u.prompt} answer={corrected?u.answers[0]:undefined} givenVerb={u.givenVerb} countryGender={u.countryGender} agreementHint={u.agreementHint}/></p>
      {q.presentation==='choice'?<ul className="grammar-choices" aria-label="Propositions">
        {q.options?.map((option,index)=><li key={option.id}><span className="grammar-choice-box" aria-hidden="true">{corrected&&u.answers.includes(option.text)?'✓':'\u00a0'}</span> <b>{String.fromCharCode(65+index)}.</b> {option.text}</li>)}
      </ul>:null}
      {corrected&&u.answers.length>1?<p className="grammar-explanation">Autre forme acceptée : {u.answers.slice(1).join(' / ')}.</p>:null}
    </>:u.kind==='match'?<>
      {isContextualGrammarMatch(u.source.typeId)?<p className="grammar-profile-facts"><GrammarTextHints text={u.prompt}/></p>:null}
      <div className="grammar-match-columns">
        <ol>{u.pairs.map((pair,index)=><li key={pair.id}><Sentence text={pair.left} answer={corrected?pair.right:undefined}/>{corrected?<strong className="grammar-match-answer"> → {String.fromCharCode(65+(q.rightOptions?.findIndex(o=>o.id===pair.id)??0))}</strong>:<span className="grammar-match-slot" aria-label={`Lettre de la réponse ${index+1}`}>→ ___</span>}</li>)}</ol>
        <ol type="A">{q.rightOptions?.map((o,index)=><li key={o.id}><b className="grammar-match-option-letter">{String.fromCharCode(65+index)}.</b> {o.text}</li>)}</ol>
      </div>
    </>:u.kind==='order'?<PhraseOrderBlock item={{layout:'phrase-order',tokens:q.tokens,answer:u.answers[0]!,responseAnswer:u.answers[0],responseVerb:u.givenVerb}} mode={mode} colorTokens={u.tokenUnit!=='clause'&&u.source.typeId!=='gram-ex-f11-curriculum-o'}/>:<>
      <p>{corrected&&q.libreSegmentShown&&u.kind==='correct'&&u.error?<><GrammarTextHints text={u.prompt.slice(0,u.error.start)}/><mark>{u.error.text}</mark><GrammarTextHints text={u.prompt.slice(u.error.end)}/></>:<GrammarTextHints text={u.prompt}/>}</p>
      {u.kind==='transform'&&u.directiveDisplay!=='heading'?u.targetSubject?<p className="grammar-target-subject">Sujet à utiliser : <strong>{u.targetSubject}</strong></p>:<p className="grammar-transform-directive"><GrammarTextHints text={u.directive??''}/></p>:null}
      <div className="grammar-written-response">
        <span className={`answer-line-field${corrected?' filled':''}`}>{corrected?u.answers.join(' / '):'\u00a0'}</span>
        <VerbHint verb={u.givenVerb}/>
      </div>
    </>}
    {corrected?<p className="grammar-explanation">{u.explanation}</p>:null}
  </div>
}
