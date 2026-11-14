import {useSequenceOrder} from './useSequenceOrder'
import {SequenceDragGhost} from './SequenceDragGhost'

export function WordSequence({words,order,onOrder,disabled}:{words:string[];order?:number[];onOrder?:(order:number[])=>void;disabled:boolean}) {
  const {positions,group,help,blocked,drag,selected,announcement,choose,keyDown,pointerProps,zoneClass,canUndo,undo}=useSequenceOrder({length:words.length,order,onOrder,disabled,label:index=>`Mot « ${words[index]} »`})
  return <div className="ci-word-order">
    <p id={help}>Glissez un mot, ou touchez-le puis sa place.<span className="ci-sr-only"> Les zones sont numérotées. Au clavier, utilisez les flèches gauche et droite. Échap annule un déplacement.</span></p>
    <div ref={group} className="ci-word-sequence" role="group" aria-label="Mots à remettre dans l’ordre" aria-describedby={help}>{positions.map((index,position)=><button type="button" key={index} className={zoneClass(index,position)} data-ci-order-zone={position} data-ci-source-index={index} {...pointerProps(index)} disabled={blocked} aria-label={`Mot ${position+1} : ${words[index]}`} aria-pressed={selected===index} onClick={()=>choose(index)} onKeyDown={event=>keyDown(index,event)}><small aria-hidden="true">{position+1}</small><b>{words[index]}</b></button>)}</div>
    <button type="button" className="ci-word-undo" disabled={!canUndo} onClick={undo}>Annuler le déplacement</button>
    <span className="ci-sr-only" role="status">{announcement}</span>
    <SequenceDragGhost drag={drag}>{drag&&<b>{words[drag.source]}</b>}</SequenceDragGhost>
  </div>
}
