import type { ExerciseBlock } from '@/math/types'
import { grammarBanksForType, isNewGrammarPilotType } from '@/grammaire/curriculum/registry'
import { clearLibreContentFreeze } from './page-helpers'
import { SelectBox } from './SelectBox'

export function GrammarLevelControl({block,onChange}:{block:ExerciseBlock;onChange:(patch:Partial<ExerciseBlock>)=>void}) {
  const banks=grammarBanksForType(block.exerciseType)
  if (!banks.length) return null
  const bank=banks.find(b=>b.level===block.grammarLevel)
  const orderUnits=bank?.units.filter(u=>u.kind==='order')??[]
  const negativeCount=orderUnits.filter(u=>u.kind==='order'&&u.tokens.some(t=>t.category==='negation')).length
  const change=(patch:Partial<ExerciseBlock>)=>{
    if (block.libreItems?.length && !window.confirm('Ce changement remplacera les modifications manuelles de cet exercice. Continuer ?')) return
    onChange({...clearLibreContentFreeze(),grammarSnapshot:undefined,grammarPageBreakAfterQuestionIds:undefined,...patch})
  }
  const newOnly=isNewGrammarPilotType(block.exerciseType)
  return <>
    <SelectBox label="Niveau de grammaire" value={block.grammarLevel??'legacy'} onChange={value=>{
      const next=banks.find(b=>b.level===value)
      change(next?{grammarLevel:next.level,grammarActivityId:next.activityId,grammarBankRevision:next.revision,
        grammarPresentation:next.presentations.includes(block.grammarPresentation!)?block.grammarPresentation:next.presentations[0],
        grammarPreview:next.editorialStatus!=='approved',columns:1,tcfExercise:undefined,tcfFormModes:undefined,tcfPageBreakAfter:undefined,
        grammarDocumentCount:next.presentations.includes('document-set')?block.grammarDocumentCount??1:undefined,
        count:block.grammarLevel?Math.min(50,block.count):next.presentations.some(p=>p==='open-written'||p==='open-oral')?1:Math.min(4,block.count)}:
        {grammarLevel:undefined,grammarActivityId:undefined,grammarPresentation:undefined,grammarBankRevision:undefined,grammarPreview:undefined,grammarDocumentCount:undefined})
    }}>
      {!newOnly?<option value="legacy">Banque actuelle</option>:null}
      {banks.map(b=><option key={b.level} value={b.level}>{b.level}{b.editorialStatus!=='approved'?' — pilote':''}</option>)}
    </SelectBox>
    {bank?<>
      {block.grammarPresentation==='document-set'?<label className="select-shell">
        <span>Textes</span>
        <input className="pill-input" type="number" aria-label="Nombre de textes" min={1} max={Math.min(20,bank.units.length)} value={block.grammarDocumentCount??1}
          onChange={event=>change({grammarDocumentCount:Math.max(1,Math.min(20,bank.units.length,Number(event.target.value)||1))})}/>
        <small className="grammar-level-note">Chaque texte conserve toutes ses questions.</small>
      </label>:null}
      {bank.presentations.includes('choice')&&bank.presentations.includes('gap')?<div className="mode-toggle-block">
        <b>Réponse</b><div className="mode-toggle" role="group" aria-label="Réponse grammaticale">
          {(['choice','gap'] as const).map(p=><button type="button" key={p} aria-pressed={block.grammarPresentation===p} className={block.grammarPresentation===p?'active':''} onClick={()=>change({grammarPresentation:p,tcfFormModes:undefined})}>{p==='choice'?'QCM':'Lacune'}</button>)}
        </div>
      </div>:null}
      <small className="grammar-level-note">{bank.objective} {bank.editorialStatus!=='approved'?'Banque pilote : à relire avant diffusion.':''}</small>
      {block.grammarPresentation==='order' && bank.editorialStatus!=='approved'?<small className="grammar-level-note">Phrases disponibles : {orderUnits.length-negativeCount} positives, {negativeCount} négatives. Les autres filtres peuvent réduire ces nombres.</small>:null}
      {block.grammarBankRevision!==bank.revision?<button type="button" className="button secondary" onClick={()=>change({grammarBankRevision:bank.revision})}>Utiliser la banque actuelle</button>:null}
    </>:null}
  </>
}
