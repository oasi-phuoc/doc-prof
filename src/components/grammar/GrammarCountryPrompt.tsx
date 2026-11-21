import { GrammarTextHints } from './GrammarTextHints'
import { isProtectedGrammarCo } from '@/grammaire/curriculum/types'

export const isWrittenGrammarPrompt=(type?:string)=>!!type&&type.startsWith('gram-ex-')&&!isProtectedGrammarCo(type)

/** Public grammar clues stay readable in the projection and reading dialog. */
export function GrammarCountryPrompt({text,gender,exerciseType}:{text:string;gender?:'masculin'|'féminin'|'pluriel';exerciseType?:string}) {
  const marker=gender?`(${gender})`:''
  const at=marker?text.indexOf(marker):-1
  const hint=(value:string)=>isWrittenGrammarPrompt(exerciseType)?<GrammarTextHints text={value}/>:value
  if(at<0)return <>{hint(text)}</>
  return <>{hint(text.slice(0,at))}<span className="grammar-country-hint tcf-verbe-theme">{marker}</span>{hint(text.slice(at+marker.length))}</>
}
