import type { ExerciseBlock } from '@/math/types'
import { grammarBanksForType } from '@/grammaire/curriculum/registry'
import { clearLibreContentFreeze } from './page-helpers'
import { SelectBox } from './SelectBox'

export function GrammarLevelControl({block,onChange}:{block:ExerciseBlock;onChange:(patch:Partial<ExerciseBlock>)=>void}) {
  const banks=grammarBanksForType(block.exerciseType)
  if (!banks.length) return null
  const bank=banks.find(b=>b.level===block.grammarLevel)
  const change=(patch:Partial<ExerciseBlock>)=>{
    if (block.libreItems?.length && !window.confirm('Ce changement remplacera les modifications manuelles de cet exercice. Continuer ?')) return
    onChange({...clearLibreContentFreeze(),grammarSnapshot:undefined,...patch})
  }
  const newOnly=block.exerciseType==='gram-ex-etre-curriculum-a'
  return <>
    <SelectBox label="Niveau de grammaire" value={block.grammarLevel??'legacy'} onChange={value=>{
      const next=banks.find(b=>b.level===value)
      change(next?{grammarLevel:next.level,grammarActivityId:next.activityId,grammarBankRevision:next.revision,
        grammarPresentation:next.presentations.includes(block.grammarPresentation!)?block.grammarPresentation:next.presentations[0],
        grammarPreview:next.editorialStatus!=='approved',columns:1,tcfExercise:undefined,tcfFormModes:undefined,tcfPageBreakAfter:undefined,
        count:block.grammarLevel?Math.min(50,block.count):Math.min(4,block.count)}:
        {grammarLevel:undefined,grammarActivityId:undefined,grammarPresentation:undefined,grammarBankRevision:undefined,grammarPreview:undefined})
    }}>
      {!newOnly?<option value="legacy">Banque actuelle</option>:null}
      {banks.map(b=><option key={b.level} value={b.level}>{b.level}{b.editorialStatus!=='approved'?' — pilote':''}</option>)}
    </SelectBox>
    {bank?<>
      {bank.presentations.includes('choice')&&bank.presentations.includes('gap')?<div className="mode-toggle-block">
        <b>Réponse</b><div className="mode-toggle" role="group" aria-label="Réponse grammaticale">
          {(['choice','gap'] as const).map(p=><button type="button" key={p} aria-pressed={block.grammarPresentation===p} className={block.grammarPresentation===p?'active':''} onClick={()=>change({grammarPresentation:p,tcfFormModes:undefined})}>{p==='choice'?'QCM':'Lacune'}</button>)}
        </div>
      </div>:null}
      <small className="grammar-level-note">{bank.objective} {bank.editorialStatus!=='approved'?'Banque pilote : à relire avant diffusion.':''}</small>
      {block.grammarPresentation==='order' && bank.editorialStatus!=='approved'?<small className="grammar-level-note">Ce premier pilote contient des phrases affirmatives ; les filtres peuvent réduire le nombre disponible.</small>:null}
      {block.grammarBankRevision!==bank.revision?<button type="button" className="button secondary" onClick={()=>change({grammarBankRevision:bank.revision})}>Utiliser la banque actuelle</button>:null}
    </>:null}
  </>
}
