import type { PreviewMode } from '@/math/types'
import type { GrammarQuestion } from '@/grammaire/curriculum/types'
import { grammarScenarioChild } from '@/grammaire/curriculum/scenario'
import { GrammarImageSupports } from '@/components/grammar/GrammarImageSupports'
import { GrammarSentence } from './grammar-fields'

export function GrammarScenarioView({question:q,mode}:{question:GrammarQuestion;mode:PreviewMode}) {
  const u=q.unit,corrected=mode==='answers'
  if(u.kind!=='scenario')return null
  const child=grammarScenarioChild(q)
  if(child) {
    const turn=u.turns.find(t=>t.questionId===child.id)!,role=u.roles.find(r=>r.id===turn.roleId)!
    return <div className="grammar-question grammar-scenario-question" data-scenario-question-id={child.id}>
      <p><b>{role.label} :</b> <GrammarSentence text={turn.text} answer={corrected?child.answers[0]:undefined}/></p>
      {child.response==='choice'?<ul className="grammar-choices" aria-label="Propositions">{q.scenarioOptions?.[child.id]?.map((o,i)=><li key={o.id}>
        <span className="grammar-choice-box" aria-hidden="true">{corrected&&child.answers.includes(o.text)?'✓':'\u00a0'}</span> <b>{String.fromCharCode(65+i)}.</b> {o.text}
      </li>)}</ul>:null}
      {corrected?<p className="grammar-explanation">{child.explanation}</p>:null}
    </div>
  }
  return <div className={`grammar-question grammar-scenario-${u.contract==='open'?'open':'support'}`} data-scenario-id={u.id}>
    <h3>{u.prompt}{q.scenarioPart?.kind==='support'&&q.scenarioPart.continued?' (suite)':''}</h3>
    <p>{u.situation}</p>
    <GrammarImageSupports supports={u.imageSupports}/>
    <ul className="grammar-scenario-roles">{u.roles.map(r=><li key={r.id}><b>{r.label} :</b> {r.goal}</li>)}</ul>
    {u.contract==='closed'||!corrected?<div className="grammar-dialogue">{u.turns.map(t=><p key={t.id}><b>{u.roles.find(r=>r.id===t.roleId)!.label} :</b>{' '}
      <GrammarSentence text={t.text} answer={corrected&&u.contract==='closed'?u.questions.find(c=>c.id===t.questionId)?.answers[0]:undefined}/>
    </p>)}</div>:null}
    {u.contract==='open'?<>
      {!corrected?<>
        <p className="grammar-production-task">{u.task}</p>
        <p><b>Pour poursuivre l’échange :</b></p>
        <ul className="grammar-scenario-follow-ups">{u.followUps.map((s,i)=><li key={i}>{s}</li>)}</ul>
      </>:null}
      {corrected?<>
        <p className="grammar-model-label">Exemple de dialogue — d’autres formulations sont possibles.</p>
        <p className="filled-answer grammar-production-model">{u.answers.join('\n\n')}</p>
        <p className="grammar-explanation">{u.explanation}</p>
        <p><b>Repères pour l’enseignant</b></p>
        <ul className="grammar-rubric">{u.rubric.map(r=><li key={r.id}>□ {r.label}</li>)}</ul>
      </>:<div className="grammar-production-lines">{Array.from({length:u.writeLines},(_,i)=><span className="answer-line-field" key={i} aria-hidden="true">{'\u00a0'}</span>)}</div>}
    </>:null}
  </div>
}
