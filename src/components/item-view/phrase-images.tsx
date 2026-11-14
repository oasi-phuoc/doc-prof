import {interrogativePrefix} from '@/francais/phrase-forms'
import type {MathItem,PreviewMode} from '@/math/types'
import {PhraseImageRow} from '../math/PhraseImageRow'
import {WorksheetImage} from '../WorksheetImage'
import {PhraseAnswerSlot} from './phrase'

export function PhraseImagesBlock({item,mode}:{item:MathItem;mode:PreviewMode}) {
  return <div className="phrase-images-block">
    {item.phraseQuestion&&<span>{interrogativePrefix(item.tokens??[])}</span>}
    <PhraseImageRow clues={item.phraseImages??[]} labels={item.phraseImageLabels} renderImage={clue=><WorksheetImage src={clue.imageSrc} alt={clue.label}/>}/>
    <PhraseAnswerSlot show={mode==='answers'} answer={`Exemple : ${item.responseAnswer??item.answer}`}/>
  </div>
}
