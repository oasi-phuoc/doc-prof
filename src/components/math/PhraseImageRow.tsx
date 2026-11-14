import type {CSSProperties,ReactNode} from 'react'
import type {PhraseImageClue} from '@/math/types'
import {PHRASE_COLORS,PHRASE_CATEGORY_LABELS} from '@/francais/phrase-banks'
import './phrase-images.css'

export function PhraseImageRow({clues,labels=false,renderImage}:{clues:readonly PhraseImageClue[];labels?:boolean;renderImage?:(clue:PhraseImageClue,index:number)=>ReactNode}) {
  return <div className="phrase-image-row" role="group" aria-label="Images et indices pour créer une phrase" style={{'--phrase-image-count':clues.length,'--phrase-game-columns':Math.min(4,clues.length),'--phrase-game-rows':Math.ceil(clues.length/4)||1} as CSSProperties}>{clues.map((clue,index)=><figure className={`phrase-image-clue${clue.imageSrc?'':' phrase-image-word'}`} data-category={clue.category} key={index} style={{borderColor:PHRASE_COLORS[clue.category]}} aria-label={`${PHRASE_CATEGORY_LABELS[clue.category]} : ${clue.label}`}>
    {clue.imageSrc ? <>{renderImage?renderImage(clue,index):<img src={clue.imageSrc} alt={clue.label}/ >}{(labels||clue.category==='pronom')&&<figcaption>{clue.label}</figcaption>}</> : <span>{clue.label||'Mot à compléter'}</span>}
  </figure>)}</div>
}
