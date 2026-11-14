import type {MathItem,PreviewMode} from '@/math/types'
import {Fragment} from 'react'
import {interrogativePrefix,phraseSyntaxRoles} from '@/francais/phrase-forms'
import './phrase-svc.css'

export function PhraseSvcBlock({item,mode}:{item:MathItem;mode:PreviewMode}) {
  const tokens=item.tokens??[],roles=phraseSyntaxRoles(tokens),runs:{text:string;role:string|null;before:string}[]=[],legacyQuestion=!!item.phraseQuestion&&!item.phraseQuestionForm
  tokens.forEach((token,index)=>{
    const text=index===0&&legacyQuestion&&token.category!=='nom'?token.text[0]!.toLowerCase()+token.text.slice(1):token.text
    const previous=runs.at(-1),role=roles[index]??null
    const before=index?token.joinBefore??(/[’']$/.test(tokens[index-1]!.text)?'':' '):''
    if(previous&&role==='sujet'&&previous.role===role)previous.text+=before+text
    else runs.push({text,role,before})
  })
  return <div className="phrase-svc-block">{legacyQuestion&&<span>{interrogativePrefix(tokens)}</span>}{runs.map((run,index)=><Fragment key={index}>{run.before}<span className={mode==='answers'&&run.role?`phrase-svc-${run.role}`:undefined}>{run.text}</span></Fragment>)}<span>{item.phraseQuestion?' ?':'.'}</span></div>
}
