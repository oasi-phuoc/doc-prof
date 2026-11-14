import {SafeImage} from './Media'
import {useSequenceOrder} from './useSequenceOrder'
import {SequenceDragGhost} from './SequenceDragGhost'

export function ImageSequence({images,order,onOrder,disabled}:{images:string[];order?:number[];onOrder?:(order:number[])=>void;disabled:boolean}) {
  const {positions,group,help,blocked,drag,selected,announcement,choose,keyDown,pointerProps,zoneClass,canUndo,undo}=useSequenceOrder({length:images.length,order,onOrder,disabled,label:index=>`Scène ${index+1}`})
  return <div className="ci-image-story">
    <p id={help}>Glissez les images vers les zones numérotées.<span className="ci-sr-only"> Vous pouvez aussi toucher deux numéros. Au clavier, utilisez les flèches gauche et droite. Échap annule un déplacement.</span></p>
    <div ref={group} className="ci-sequence" role="group" aria-label="Images à remettre dans l’ordre" aria-describedby={help}>{positions.map((index,place)=><div key={index} className={zoneClass(index,place)} data-ci-order-zone={place} data-ci-source-index={index} {...pointerProps(index)} onKeyDown={event=>{if(event.key==='Escape')keyDown(index,event)}}>
      <SafeImage src={images[index]!} alt={`Scène ${index+1}`} zoom/>
      <button type="button" className="ci-scene-position" aria-label={`Choisir la scène ${index+1}, place ${place+1}`} aria-pressed={selected===index} disabled={blocked} onClick={()=>choose(index)} onKeyDown={event=>keyDown(index,event)}>{place+1}</button>
    </div>)}</div>
    <div className="ci-story-footer"><button type="button" disabled={!canUndo} onClick={undo}>Annuler le déplacement</button></div>
    <span className="ci-sr-only" role="status">{announcement}</span>
    <SequenceDragGhost drag={drag}>{drag&&<SafeImage src={images[drag.source]!} alt=""/>}</SequenceDragGhost>
  </div>
}
