import type {PhraseToken} from '@/math/types'
import {joinPhrase} from './phrase-sentences'
import {startsWithVowelSound} from './phrase-phonetics'
export {passiveFrames,passivePhrase} from './phrase-passive'

export type PhraseSentenceType='declarative'|'interrogative'|'mixed'
export type PhraseVoice='active'|'passive'|'mixed'
export type PhraseSyntaxRole='sujet'|'verbe'|'complement'|null

/** The interrogative particle stays outside word-class tokens. */
export function interrogativePrefix(tokens:readonly PhraseToken[]):string {
  return startsWithVowelSound(tokens[0]?.text??'')?'Est-ce qu’':'Est-ce que '
}
export function phraseSentence(tokens:PhraseToken[],question=false):string {
  if(!question)return joinPhrase(tokens)
  const words=tokens.map((token,index)=>index===0&&token.category!=='nom'?{...token,text:token.text[0]!.toLowerCase()+token.text.slice(1)}:{...token})
  return interrogativePrefix(tokens)+joinPhrase(words).replace(/\.$/,' ?')
}

/** Whole nominal subjects; reflected clitics and negative particles are excluded. */
export function phraseSyntaxRoles(tokens:readonly PhraseToken[]):PhraseSyntaxRole[]{
  const roles:PhraseSyntaxRole[]=tokens.map(()=>null)
  let start=0
  for(let end=0;end<=tokens.length;end++){
    if(end<tokens.length&&tokens[end]!.category!=='conjonction')continue
    const verb=tokens.findIndex((token,index)=>index>=start&&index<end&&token.category==='verbe')
    if(verb>=0){let subjectEnd=verb;while(subjectEnd>start&&(tokens[subjectEnd-1]!.category==='adverbe'||tokens[subjectEnd-1]!.category==='pronom'&&subjectEnd-1>start))subjectEnd--
      for(let index=start;index<end;index++)roles[index]=index<subjectEnd?'sujet':tokens[index]!.category==='verbe'?'verbe':tokens[index]!.category==='adverbe'||tokens[index]!.category==='pronom'?null:'complement'
    }
    start=end+1
  }
  return roles
}
export function syntaxModel(tokens:readonly PhraseToken[]):string {
  const roles=phraseSyntaxRoles(tokens),subjects:string[]=[],verbs:string[]=[]
  let subject:PhraseToken[]=[]
  const flush=()=>{if(subject.length){subjects.push(joinPhrase(subject).replace(/\.$/,''));subject=[]}}
  for(const [index,token]of tokens.entries()){if(roles[index]==='sujet')subject.push(token);else flush();if(roles[index]==='verbe')verbs.push(token.text)}flush()
  return `Sujet${subjects.length>1?'s':''} à entourer : ${subjects.join(' ; ')}. Verbe${verbs.length>1?'s':''} à souligner : ${verbs.join(' ; ')}.`
}
