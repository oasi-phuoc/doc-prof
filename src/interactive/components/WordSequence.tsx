import {useSequenceOrder} from './useSequenceOrder'
import {SequenceDragGhost} from './SequenceDragGhost'
import {IconButton} from './Icons'

export function WordSequence({words,order,onOrder,disabled,review=false,onRead}:{words:string[];order?:number[];onOrder?:(order:number[])=>void;disabled:boolean;review?:boolean;onRead?:()=>void}) {
  const {positions,group,help,blocked,drag,selected,announcement,choose,keyDown,pointerProps,zoneClass,canUndo,undo}=useSequenceOrder({length:words.length,order,onOrder,disabled,label:index=>`Mot « ${words[index]} »`})
  const long=words.length>6
  if(long&&review){
    const proposal=positions.reduce((text,index)=>text+(words[index]?.startsWith('-')||/[’']$/.test(text)||!text?'':' ')+words[index],'')
    return <section className="ci-word-proposal" aria-label="Ordre proposé"><h2>Ordre proposé</h2><p>{proposal}</p>{onRead&&<IconButton icon="transcript" label="Lire tous les mots" onClick={onRead}/>}</section>
  }
  const instructions=<p id={help}>{long?'Glissez, ou touchez un mot puis sa place.':'Glissez un mot, ou touchez-le puis sa place.'}<span className="ci-sr-only"> Les {words.length} zones sont numérotées. Au clavier, utilisez les flèches gauche et droite. Échap annule un déplacement.</span></p>
  return <div className={`ci-word-order${words.length>6?' ci-word-order-long':''}`}>
    {long?<div className="ci-word-order-tools">{instructions}<div>{onRead&&<IconButton icon="transcript" label="Lire tous les mots" onClick={onRead}/>}<IconButton icon="reset" label="Annuler le déplacement" disabled={!canUndo} onClick={undo}/></div></div>:instructions}
    <div ref={group} className="ci-word-sequence" role="group" aria-label="Mots à remettre dans l’ordre" aria-describedby={help}>{positions.map((index,position)=><button type="button" key={index} className={zoneClass(index,position)} data-ci-order-zone={position} data-ci-source-index={index} {...pointerProps(index)} disabled={blocked} aria-label={`Mot ${position+1} : ${words[index]}`} aria-pressed={selected===index} onClick={()=>choose(index)} onKeyDown={event=>keyDown(index,event)}><small aria-hidden="true">{position+1}</small><b>{words[index]}</b></button>)}</div>
    {!long&&<button type="button" className="ci-word-undo" disabled={!canUndo} onClick={undo}>Annuler le déplacement</button>}
    <span className="ci-sr-only" role="status">{announcement}</span>
    <SequenceDragGhost drag={drag}>{drag&&<b>{words[drag.source]}</b>}</SequenceDragGhost>
  </div>
}
