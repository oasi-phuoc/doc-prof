import type {PhraseToken} from '@/math/types'
import type {ThemedFrame} from './phrase-theme-frames'
import {tagged} from './phrase-sentences'
import {isReflexiveFrame} from './phrase-conjugate'
import {TRANSITIVE,PARTICIPLES,FEMALE,MALE} from './phrase-passive-data'
const uncap=(tokens:readonly PhraseToken[])=>tokens.map((token,index)=>index===0&&token.category!=='nom'?{...token,text:token.text[0]!.toLowerCase()+token.text.slice(1)}:{...token})
const cap=(tokens:PhraseToken[])=>tokens.map((token,index)=>index===0?{...token,text:token.text[0]!.toUpperCase()+token.text.slice(1)}:token)
function objectOf(tokens:readonly PhraseToken[],infinitive:string){
  if(isReflexiveFrame(infinitive)||!TRANSITIVE.has(infinitive))return undefined
  const verb=tokens.findIndex(token=>token.category==='verbe');if(verb<0)return undefined
  let start=verb+1;while(tokens[start]?.category==='adverbe')start++
  if(tokens[start]?.category!=='determinant')return undefined
  let end=start+1;while(tokens[end]&&['nom','adjectif'].includes(tokens[end]!.category))end++
  const object=tokens.slice(start,end),noun=object.find(token=>token.category==='nom');if(!noun||object.filter(token=>token.category==='nom').length!==1)return undefined
  const article=object[0]!.text.toLowerCase(),plural=/^(?:les|des|ces|mes|tes|ses|nos|vos|leurs|quelques|plusieurs)$/.test(article)
  const key=noun.text.toLowerCase().replace(/s$/,'')
  const gender=/^(?:la|une|cette|ma|ta|sa|de la)$/.test(article)?'f':/^(?:le|un|ce|cet|du)$/.test(article)?'m':FEMALE.has(key)?'f':MALE.has(key)?'m':undefined
  if(!gender)return undefined
  const pp=PARTICIPLES[infinitive]??(infinitive.endsWith('er')?infinitive.slice(0,-2)+'é':infinitive.endsWith('ir')?infinitive.slice(0,-2)+'i':infinitive.endsWith('dre')?infinitive.slice(0,-3)+'du':undefined)
  return pp?{verb,start,end,object,gender,plural,pp}:undefined
}
function passiveClause(tokens:readonly PhraseToken[],infinitive:string,includeAgent=true):PhraseToken[]|undefined {
  const object=objectOf(tokens,infinitive);if(!object)return undefined
  const {verb,start,end,gender,plural,pp}=object
  const subject=tokens.slice(0,verb);if(!subject.length||subject.some(token=>!['nom','pronom','determinant','adjectif'].includes(token.category)))return undefined
  const tonic:Record<string,string>={je:'moi','j’':'moi',tu:'toi',il:'lui',elle:'elle',nous:'nous',vous:'vous',ils:'eux',elles:'elles'}
  const head=subject[0]!.text.toLowerCase(),agent=head==='on'?[]:subject.length===1&&tonic[head]?[{text:tonic[head]!,category:'pronom' as const}]:uncap(subject)
  const agreed=pp+(gender==='f'&&!pp.endsWith('e')?'e':'')
  const participle=agreed+(plural&&!agreed.endsWith('s')?'s':'')
  return cap([...uncap(object.object),{text:plural?'sont':'est',category:'verbe',verbPart:'auxiliary'},...tokens.slice(verb+1,start),{text:participle,category:'verbe',verbPart:'participle'},...tokens.slice(end),...(includeAgent&&agent.length?[{text:'par',category:'preposition' as const},...agent]:[])])
}
/** Complete positive clauses are transformed before negation. */
export function passivePhrase(tokens:readonly PhraseToken[],infinitives:readonly string[],includeAgent=true):PhraseToken[]|undefined {
  const clauses:PhraseToken[][]=[[]],links:PhraseToken[]=[]
  for(const token of tokens){if(token.category==='conjonction'){links.push(token);clauses.push([])}else clauses.at(-1)!.push(token)}
  if(clauses.length!==infinitives.length)return undefined
  const result:PhraseToken[]=[]
  for(const [index,clause]of clauses.entries()){
    const passive=passiveClause(clause,infinitives[index]!,includeAgent);if(!passive)return undefined
    if(index)result.push({...links[index-1]!},...uncap(passive));else result.push(...passive)
  }
  return result
}
const filtered=new WeakMap<readonly ThemedFrame[],readonly ThemedFrame[]>()
export function passiveFrames(frames:readonly ThemedFrame[]):readonly ThemedFrame[]{
  const cached=filtered.get(frames);if(cached)return cached
  const accepts=(pred:string,id:string)=>!!objectOf(tagged(pred),id)
  const result=frames.flatMap(frame=>{
    if(!TRANSITIVE.has(frame.id)||isReflexiveFrame(frame.id))return []
    if(frame.contexts){const contexts=frame.contexts.filter(context=>accepts(context.pred,frame.id)&&(!context.rightPred||!!context.rightId&&accepts(context.rightPred,context.rightId)));return contexts.length?[{...frame,contexts,preds:[...new Set(contexts.map(context=>context.pred))]}]:[]}
    const preds=frame.preds.filter(pred=>accepts(pred,frame.id)),rightPreds=frame.rightPreds?.filter(pred=>accepts(pred,frame.rightId??frame.id))
    return preds.length&&(!rightPreds||rightPreds.length)?[{...frame,preds,...(rightPreds?{rightPreds}:{})}]:[]
  });filtered.set(frames,result);return result
}
