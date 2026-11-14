import type {MathItem,PhraseImageClue,PhraseToken} from '@/math/types'
import tcfPictures from './phrase-tcf-pictures.generated.json'
import {ACTION_PICTOGRAMS,PRONOUN_PICTOGRAMS,pictureKey} from './phrase-pictograms'
import {tagged,pronounsForFrame} from './phrase-sentences'
import type {PhraseCategories,PhraseThemeId} from './phrase-themes'
import type {PhraseVerbGroup} from '@/math/types'
import type {ThemedFrame} from './phrase-theme-frames'

export const MAX_PHRASE_IMAGE_CLUES=12
const nouns=new Map<string,string>(),actions=new Map<string,string>()
for(const word of tcfPictures)nouns.set(pictureKey(word.label),word.src)
for(const image of ACTION_PICTOGRAMS)actions.set(pictureKey(image.label),image.src)
const pronouns=new Map(PRONOUN_PICTOGRAMS.map(image=>[image.label,image.src]))
// These TCF objects have a direct, unambiguous counterpart in the source phrase.
for(const noun of ['pomme','tomate','chat','chien'])nouns.set(noun,`/lib/images/tcf/qcm-audit/vocab-${noun}.webp`)

export function nounPicture(word:string):string|undefined {
  const key=pictureKey(word)
  return nouns.get(key)??(key.endsWith('s')||key.endsWith('x')?nouns.get(key.slice(0,-1)):undefined)??(key.endsWith('aux')?nouns.get(key.slice(0,-3)+'al'):undefined)
}
for(const [label,src]of Object.entries({hommes:'qcm-audit/vocab-hommes.webp',femmes:'qcm-audit/vocab-femmes.webp',enfants:'qcm-audit/vocab-enfants.webp',cuisinier:'qcm-audit/vocab-cuisinier.webp',médecin:'qcm-audit/co834-medecin-dessine.webp',jardinier:'catalogue/metiers/jardinier.webp',secrétaire:'qcm-audit/vocab-secretaire-femme.webp',route:'qcm-audit/co306-autoroutes-dessine.webp'}))nouns.set(label,'/lib/images/tcf/'+src)
const colour=/^(?:rouges?|bleus?|bleues?|verts?|vertes?|jaunes?|oranges?|roses?|violets?|violettes?|noirs?|noires?|blancs?|blanches?|bruns?|brunes?|marron|gris|grise|grises)$/i
function nounPictures(tokens:readonly PhraseToken[]):Map<number,string>|undefined {
  const result=new Map<number,string>()
  for(let index=0;index<tokens.length;index++){
    const token=tokens[index]!;if(token.category!=='nom')continue
    const next=tokens[index+1],key=next?.category==='adjectif'?`${token.text} ${next.text}`:token.text
    const src=nounPicture(key)??(next?.category==='adjectif'&&colour.test(next.text)?undefined:nounPicture(token.text))
    if(!src)return undefined
    result.set(index,src)
  }
  return result
}
export function actionPicture(infinitive:string):string|undefined {
  const key=pictureKey(infinitive)
  return actions.get(key)??(['se laver','se choisir'].includes(key)?actions.get(key.slice(3)):key==='s endormir'?actions.get('dormir'):undefined)
}
export function pronounPicture(word:string):string|undefined {
  const key=pictureKey(word)
  return pronouns.get(key==='j'?'je':key)
}

/** Determiners are supplied by the learner; abstract relations remain explicit word clues. */
export function phraseImageClues(tokens:readonly PhraseToken[],verbIds:readonly string[]):PhraseImageClue[]|undefined {
  const clues:PhraseImageClue[]=[]
  const pictures=nounPictures(tokens);if(!pictures)return undefined
  let verb=0,subject=true
  for(const [index,token] of tokens.entries()){
    if(token.category==='determinant')continue
    if(token.category==='verbe'){
      if(token.verbPart==='auxiliary'){clues.push({category:'verbe',label:token.text});continue}
      const label=verbIds[verb++],imageSrc=label?actionPicture(label):undefined
      if(!imageSrc)return undefined
      clues.push({category:'verbe',label:label!,imageSrc});subject=false
    }else if(token.category==='nom'){
      const imageSrc=pictures.get(index);if(!imageSrc)return undefined
      clues.push({category:'nom',label:token.text,imageSrc})
    }else if(token.category==='pronom'&&subject&&pronounPicture(token.text)){
      clues.push({category:'pronom',label:token.text,imageSrc:pronounPicture(token.text)});subject=false
    }else{
      clues.push({category:token.category,label:token.text})
      if(token.category==='conjonction')subject=true
    }
  }
  return verb===verbIds.length&&clues.length>=2&&clues.length<=MAX_PHRASE_IMAGE_CLUES?clues:undefined
}
export function newPictureSentence():MathItem {
  const tokens:PhraseToken[]=[{text:'Je',category:'pronom'},{text:'mange',category:'verbe'},{text:'une',category:'determinant'},{text:'pomme',category:'nom'}]
  return {layout:'phrase-images',tokens,phraseImages:phraseImageClues(tokens,['manger'])!,answer:'Je mange une pomme.',responseAnswer:'Je mange une pomme.'}
}

const selections=new WeakMap<readonly ThemedFrame[],readonly ThemedFrame[]>()
/** Keep whole source predicates; never substitute an unrelated picture for a missing noun. */
export function illustratedFrames(frames:readonly ThemedFrame[]):readonly ThemedFrame[] {
  const cached=selections.get(frames);if(cached)return cached
  const accepts=(pred:string,id:string)=>!!actionPicture(id)&&!!nounPictures(tagged(pred))
  const result=frames.flatMap(frame=>{
    if(!actionPicture(frame.id))return []
    if(frame.contexts){
      const contexts=frame.contexts.filter(context=>accepts(context.pred,frame.id)&&(!context.rightPred||!!context.rightId&&accepts(context.rightPred,context.rightId)))
      return contexts.length?[{...frame,contexts,preds:[...new Set(contexts.map(context=>context.pred))]}]:[]
    }
    const preds=frame.preds.filter(pred=>accepts(pred,frame.id)),rightPreds=frame.rightPreds?.filter(pred=>accepts(pred,frame.rightId??frame.id))
    return preds.length&&(!rightPreds||rightPreds.length)?[{...frame,preds,...(rightPreds?{rightPreds}:{})}]:[]
  })
  selections.set(frames,result);return result
}

/** Subjects have explicit images and compatible actions; objects never inherit a human-only verb. */
export function imageSubjectsForFrame(frame:Pick<ThemedFrame,'id'|'preds'>):string[]{
  const vehicles:Record<string,string>={rouler:'La/determinant voiture/nom',circuler:'La/determinant voiture/nom',stationner:'La/determinant voiture/nom',naviguer:'Le/determinant bateau/nom',décoller:'L’/determinant avion/nom'}
  if(vehicles[frame.id])return [vehicles[frame.id]!]
  const pronouns=[...pronounsForFrame(frame.id,frame.preds)].filter(subject=>!!pronounPicture(subject.split('/')[0]!))
  const nominal=['Le/determinant cuisinier/nom','Le/determinant médecin/nom','Le/determinant jardinier/nom','La/determinant secrétaire/nom',...(pronouns.includes('Ils/pronom')?['Les/determinant hommes/nom','Les/determinant femmes/nom','Les/determinant enfants/nom']:[])]
  if(['courir','dormir'].includes(frame.id)&&frame.preds.every(pred=>/(?:parc|jardin|lit|coussin)\/nom/.test(pred)))nominal.push('Le/determinant chat/nom','Le/determinant chien/nom')
  return [...pronouns,...nominal]
}
export function imageExtraFrames(frames:readonly ThemedFrame[],theme:PhraseThemeId,group:PhraseVerbGroup,categories?:PhraseCategories):readonly ThemedFrame[]{
  if(!['phrase-simple','phrase-determinants','phrase-preposition','phrase-adverbe'].includes(theme)||!['er','mixte','libre'].includes(group))return frames
  const pred=theme==='phrase-preposition'&&categories?.preposition!==false?'roule/verbe sur/preposition la/determinant route/nom':theme==='phrase-adverbe'&&categories?.adverbe!==false?'roule/verbe lentement/adverbe':'roule/verbe'
  return [...frames,{id:'rouler',preds:[pred]}]
}
