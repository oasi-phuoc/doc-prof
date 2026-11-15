import type {CSSProperties} from 'react'
import type {Question,Phase,PlayMode} from '../domain/types'
import {PALETTE,defaultShapes,inkForColor,type ShapeId} from '../domain/palette'
import {lotoGoalLabel} from '../domain/loto'
import {CardBadge} from './CardBadge'
import './loto.css'

export function LotoBoard({question,phase,mode='class',marked=[],called=[],met=false,correctChoiceId,selected,disabled=false,colors,shapes=defaultShapes,onSelect,onMark}:{
 question:Question;phase:Phase;mode?:PlayMode;marked?:string[];called?:string[];met?:boolean;correctChoiceId?:string;selected?:string;disabled?:boolean;colors:string[];shapes?:ShapeId[];onSelect?:(id:string)=>void;onMark?:(checked:boolean)=>void
}){
 const board=question.lotoBoard!
 const revealed=phase==='revealed',enabled=(id:string)=>!disabled&&(mode==='solo'?phase==='thinking'&&!called.includes(id):revealed&&id===correctChoiceId)
 const choose=(id:string)=>{if(enabled(id)){if(mode==='solo')onSelect?.(id);else onMark?.(!marked.includes(id))}}
 return <section className="ci-loto" tabIndex={0} aria-label="Grille de Loto" onKeyDown={event=>{
  if(event.repeat||event.altKey||event.ctrlKey||event.metaKey||!(event.target instanceof Element)||event.target.closest('input,textarea,select,[contenteditable=true]'))return
  const cell=board.cells['abcdef'.indexOf(event.key.toLowerCase())];if(cell&&enabled(cell.id)){event.preventDefault();event.currentTarget.focus({preventScroll:true});choose(cell.id)}
 }}>
  <div className="ci-loto-progress" role="status"><b>{marked.length}/{board.cells.length} cases cochées</b><span>{met?'✓ Objectif atteint':lotoGoalLabel(board.goal)}</span></div>
  <div className={`ci-answer-grid ci-count-${board.cells.length} ci-loto-grid`} tabIndex={0} style={{'--loto-columns':board.columns} as CSSProperties} role="group" aria-label="Cases du Loto">
   {board.cells.map((cell,index)=>{
    const checked=marked.includes(cell.id),past=called.includes(cell.id),correct=revealed&&cell.id===correctChoiceId,color=colors[index]??PALETTE[index]!.color,letter=PALETTE[index]!.letter
    return <button type="button" key={cell.id} className={`ci-answer ci-loto-card${cell.text.length>16?' ci-loto-long':''}${checked?' ci-loto-checked':''}${past&&!checked&&!correct?' ci-loto-called':''}${revealed?(correct?' ci-answer-key':' ci-answer-muted'):''}${selected===cell.id?' ci-chosen':''}`} style={{'--card-color':color,'--card-ink':inkForColor(color)} as CSSProperties} data-loto-id={cell.id} data-loto-checked={checked} disabled={!enabled(cell.id)} aria-pressed={checked} aria-label={`${mode==='class'&&correct?(checked?'Décocher pour la classe':'Cocher pour la classe'):'Case'} ${letter}. ${cell.text}${checked?' · cochée':past?' · déjà tirée':''}`} onClick={()=>choose(cell.id)}>
     <CardBadge letter={letter} shape={shapes[index]!}/><span className="ci-answer-content"><span>{cell.text}</span></span><span className="ci-loto-checkbox" aria-hidden="true">{checked?'✓':''}</span>
    </button>
   })}
  </div>
  {revealed&&mode==='class'&&<p className="ci-loto-instruction">L’enseignant coche si la classe a trouvé.</p>}
 </section>
}
