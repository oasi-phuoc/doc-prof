import type { PreviewMode } from '@/math/types'
import type { GrammarUnit, GrammarCriterion } from '@/grammaire/curriculum/types'
import { GrammarSentence } from './grammar-fields'

function Review({criteria,explanation}:{criteria:GrammarCriterion[];explanation:string}) {
  return <><p className="grammar-explanation">{explanation}</p><p><b>Repères pour l’enseignant</b></p>
    <ul className="grammar-rubric">{criteria.map(c=><li key={c.id}>□ {c.label}</li>)}</ul></>
}

export function GrammarPersonalView({unit:u,mode}:{unit:Extract<GrammarUnit,{kind:'personal-gap'}>;mode:PreviewMode}) {
  const corrected=mode==='answers'
  return <div className="grammar-question grammar-personal-gap">
    {u.cue?<p className="grammar-cue">{u.cue}</p>:null}
    <p>{u.task}</p>
    {corrected?<p className="grammar-model-label">Exemple possible — vos informations peuvent être différentes.</p>:null}
    <p><GrammarSentence text={u.prompt} answer={corrected?u.answers[0]:undefined}/><span className="grammar-personal-hint tcf-verbe-theme"> ({u.information})</span></p>
    {corrected?<Review criteria={u.rubric} explanation={u.explanation}/>:null}
  </div>
}

export function GrammarFormView({unit:u,mode}:{unit:Extract<GrammarUnit,{kind:'form'}>;mode:PreviewMode}) {
  const corrected=mode==='answers'
  return <div className="grammar-question grammar-form">
    <h3>{u.prompt}</h3><p>{u.task}</p>
    {corrected?<p className="grammar-model-label">Exemple de formulaire — une identité fictive différente est recevable.</p>:null}
    <dl className="grammar-form-fields">{u.fields.map(f=><div key={f.id} className="grammar-form-field" data-field-id={f.id}>
      <dt>{f.label}{f.required?' *':''}{f.hint?<small>{f.hint}</small>:null}</dt>
      <dd><span className={`answer-line-field${corrected?' filled grammar-form-model':''}`}>{corrected?f.model:'\u00a0'}</span></dd>
    </div>)}</dl>
    <p className="grammar-form-note">* Champ à compléter. Vous pouvez inventer les informations.</p>
    {corrected?<Review criteria={u.rubric} explanation={u.explanation}/>:null}
  </div>
}
