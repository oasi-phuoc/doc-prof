import type {PreviewMode} from '@/math/types'
import type {GrammarUnit} from '@/grammaire/curriculum/types'
import { GrammarImageSupports } from '@/components/grammar/GrammarImageSupports'
import { GrammarTextHints } from './grammar-fields'

export function GrammarProductionView({unit:u,mode}:{unit:Extract<GrammarUnit,{kind:'production'}>;mode:PreviewMode}) {
  const corrected=mode==='answers'
  const [title,...facts]=u.prompt.split('\n')
  const profile=facts.length>0&&u.imageSupports?.length===1
  return <div className={`grammar-question grammar-production${(u.imageSupports?.length??0)>1?' grammar-production-paired-images':''}`}>
    {profile?<><h3><GrammarTextHints text={title}/></h3><div className="grammar-production-profile">
      <GrammarImageSupports supports={u.imageSupports}/><p className="grammar-profile-facts"><GrammarTextHints text={facts.join('\n')}/></p>
    </div></>:<>
      {facts.length?<><h3><GrammarTextHints text={title}/></h3><p className="grammar-profile-facts"><GrammarTextHints text={facts.join('\n')}/></p></>:<p><GrammarTextHints text={u.prompt}/></p>}
      <GrammarImageSupports supports={u.imageSupports}/>
    </>}
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
