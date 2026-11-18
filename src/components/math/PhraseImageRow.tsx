import type {CSSProperties,ReactNode} from 'react'
import type {PhraseCategory,PhraseImageClue} from '@/math/types'
import {showsPhraseImageWord} from '@/francais/phrase-images'
import {PHRASE_COLORS,PHRASE_CATEGORY_LABELS} from '@/francais/phrase-banks'
import './phrase-images.css'

export function PhraseImageRow({clues,labels=false,shown,renderImage}:{clues:readonly PhraseImageClue[];labels?:boolean;shown?:readonly PhraseCategory[];renderImage?:(clue:PhraseImageClue,index:number,showWord:boolean)=>ReactNode}) {
  return <div className="phrase-image-row" role="group" aria-label="Images et indices pour créer une phrase" style={{'--phrase-image-count':clues.length,'--phrase-game-columns':Math.min(4,clues.length),'--phrase-game-rows':Math.ceil(clues.length/4)||1} as CSSProperties}>{clues.map((clue,index)=>{
    const showWord=showsPhraseImageWord(clue.category,labels,shown)
    return <figure className={`phrase-image-clue${clue.imageSrc?'':' phrase-image-word'}`} data-category={clue.category} key={index} style={{borderColor:PHRASE_COLORS[clue.category]}} aria-label={showWord?`${PHRASE_CATEGORY_LABELS[clue.category]} : ${clue.label}`:PHRASE_CATEGORY_LABELS[clue.category]}>
      {clue.imageSrc ? <>{renderImage?renderImage(clue,index,showWord):<img src={clue.imageSrc} alt={clue.label}/>}{showWord&&<figcaption>{clue.label}</figcaption>}</> : showWord ? <span>{clue.label||'Mot à compléter'}</span> : <span className="phrase-image-blank"/>}
    </figure>
  })}</div>
}
