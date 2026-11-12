import type {PreviewMode} from '@/math/types'
import type {GrammarUnit} from '@/grammaire/curriculum/types'

export function GrammarProductionView({unit:u,mode}:{unit:Extract<GrammarUnit,{kind:'production'}>;mode:PreviewMode}) {
  const corrected=mode==='answers'
  const [title,...facts]=u.prompt.split('\n')
  return <div className="grammar-question grammar-production">
    {facts.length?<><h3>{title}</h3><p>{facts.join('\n')}</p></>:<p>{u.prompt}</p>}
    <p className="grammar-production-task">{u.task}</p>
    {corrected?<>
      <p className="grammar-model-label">Exemple de réponse — d’autres formulations sont possibles.</p>
      <p className="filled-answer grammar-production-model">{u.answers.join('\n\n')}</p>
      <p className="grammar-explanation">{u.explanation}</p>
      <p><b>Repères pour l’enseignant</b></p>
      <ul className="grammar-rubric">{u.rubric.map(r=><li key={r.id}>□ {r.label}</li>)}</ul>
    </>:u.mode==='written'?<div className="grammar-production-lines">{Array.from({length:u.writeLines},(_,i)=><span className="answer-line-field" key={i} aria-hidden="true">{'\u00a0'}</span>)}</div>:null}
  </div>
}
