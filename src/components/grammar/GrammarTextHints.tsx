import { Fragment } from 'react'

/** Gender is explicit text as well as color, on paper and in the classroom. */
export function GrammarTextHints({text}:{text:string}) {
  return <>{text.split(/(\([^()]*(?:masculin|féminin)[^()]*\))/gu).map((s,i)=>
    /\([^()]*(?:masculin|féminin)/u.test(s)?<span className="grammar-agreement-hint tcf-verbe-theme" key={i}>{s}</span>:<Fragment key={i}>{s}</Fragment>)}</>
}
