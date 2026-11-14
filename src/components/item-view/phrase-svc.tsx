import type {MathItem,PreviewMode} from '@/math/types'
import {interrogativePrefix,phraseSyntaxRoles} from '@/francais/phrase-forms'
import './phrase-svc.css'

export function PhraseSvcBlock({item,mode}:{item:MathItem;mode:PreviewMode}) {
  const tokens=item.tokens??[],roles=phraseSyntaxRoles(tokens),runs:{text:string;role:string|null}[]=[]
  tokens.forEach((token,index)=>{
    const text=index===0&&item.phraseQuestion&&token.category!=='nom'?token.text[0]!.toLowerCase()+token.text.slice(1):token.text
    const previous=runs.at(-1),role=roles[index]??null
    if(previous&&role==='sujet'&&previous.role===role)previous.text+=(/[’']$/.test(previous.text)?'':' ')+text
    else runs.push({text,role})
  })
  return <div className="phrase-svc-block">{item.phraseQuestion&&<span>{interrogativePrefix(tokens)}</span>}{runs.map((run,index)=><span className={mode==='answers'&&run.role?`phrase-svc-${run.role}`:undefined} key={index}>{index&&!/[’']$/.test(runs[index-1]!.text)?' ':''}{run.text}</span>)}<span>{item.phraseQuestion?' ?':'.'}</span></div>
}
