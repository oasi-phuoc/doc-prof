import {useId,type CSSProperties} from 'react'
import type {Question,MemoryRuntime,PlayMode} from '../domain/types'
import {emptyMemory,memoryComplete} from '../domain/memory'
import {PALETTE,defaultShapes,inkForColor,type ShapeId} from '../domain/palette'
import {CardBadge} from './CardBadge'
import {SafeImage} from './Media'
import './memory.css'

/** A hidden face never enters the DOM or its accessible name. */
export function MemoryBoard({question,runtime,mode='class',revealed=false,disabled=false,colors,shapes=defaultShapes,pairs,onFlip,onCheck,onCancel}:{
 question:Question;runtime?:MemoryRuntime;mode?:PlayMode;revealed?:boolean;disabled?:boolean;colors:string[];shapes?:ShapeId[]
 pairs?:[string,string][];onFlip?:(id:string)=>void;onCheck?:()=>void;onCancel?:()=>void
}){
 const help=useId(),board=runtime??emptyMemory(),cards=question.memoryBoard?.cards??[],complete=memoryComplete(question,board)
 const waiting=board.open.length===2&&!board.checked,blocked=disabled||revealed||complete
 const status=complete?'Toutes les paires sont retrouvées.':revealed?'Voici les paires attendues.':board.checked?'Ces deux cartes ne forment pas une paire. Retournez une autre carte pour continuer.':waiting?'Deux cartes retournées. Validez la paire.':board.open.length?'Retournez une deuxième carte.':'Retournez deux cartes.'
 return <section className="ci-memory" tabIndex={0} aria-label="Plateau de Mémory" aria-describedby={help} onKeyDown={event=>{
  if(blocked||event.repeat||event.altKey||event.ctrlKey||event.metaKey||!(event.target instanceof Element)||event.target.closest('input,textarea,select,[contenteditable=true]'))return
  const slot='abcdef'.indexOf(event.key.toLowerCase()),card=cards[slot]
  if(card){event.preventDefault();event.currentTarget.focus({preventScroll:true});onFlip?.(card.id)}
 }}>
  <div className="ci-memory-progress"><span>{board.found.length/2}/{cards.length/2} paires</span><span>{board.turns} {board.turns>1?'essais':'essai'} · {board.misses} {board.misses>1?'erreurs':'erreur'}</span></div>
  <div className={`ci-memory-grid ci-memory-count-${cards.length}`} role="group" aria-label="Cartes A à F">
   {cards.map((card,index)=>{
    const found=board.found.includes(card.id),open=board.open.includes(card.id),visible=revealed||found||open,letter=PALETTE[index]!.letter,color=colors[index]??PALETTE[index]!.color
    const pair=revealed?pairs?.findIndex(ids=>ids.includes(card.id)):undefined
    return <button key={card.id} type="button" className={`ci-memory-card${visible?' ci-memory-open':''}${found?' ci-memory-found':''}${open&&board.checked?' ci-memory-miss':''}`} data-memory-id={card.id} data-memory-visible={visible} data-memory-found={found} style={{'--memory-color':color,'--memory-ink':inkForColor(color)} as CSSProperties}
     disabled={blocked||found||open||waiting} aria-label={`Carte ${letter}${found?' · paire trouvée':visible?card.text?` · ${card.text}`:' · image':' · face cachée'}${revealed&&pair!==undefined&&pair>=0?` · paire ${pair+1}`:''}`} aria-pressed={visible} onClick={()=>onFlip?.(card.id)}>
     <CardBadge letter={letter} shape={shapes[index]!}/>
     {visible?<span className="ci-memory-face">{card.image?<SafeImage src={card.image} alt={`Image de la carte ${letter}`} retryable={false}/>:<span>{card.text}</span>}</span>:<span className="ci-memory-back" aria-hidden="true">?</span>}
     {found&&!revealed&&<span className="ci-memory-mark" aria-hidden="true">✓</span>}
     {revealed&&pair!==undefined&&pair>=0&&<span className="ci-memory-mark">Paire {pair+1}</span>}
    </button>
   })}
  </div>
  <p id={help} className="ci-memory-status" role="status">{status}</p>
  {!revealed&&mode==='class'&&board.open.length>0&&!board.checked&&<div className="ci-memory-actions">{waiting&&<button className="ci-primary" disabled={disabled} onClick={onCheck}>Valider la paire</button>}<button disabled={disabled} onClick={onCancel}>Annuler le choix</button></div>}
 </section>
}
