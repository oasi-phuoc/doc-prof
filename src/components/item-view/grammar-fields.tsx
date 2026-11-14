import { Fragment } from 'react'

export function GrammarVerbHint({verb}:{verb?:string}) {
  return verb?<span className="grammar-verb-hint tcf-verbe-theme">({verb})</span>:null
}
export function GrammarSentence({text,answer,givenVerb,countryGender}:{text:string;answer?:string;givenVerb?:string;countryGender?:string}) {
  const parts=text.split('___')
  return <>{parts.map((part,index)=><Fragment key={index}>{index>0?<><span className={`grammar-answer-inline${answer&&(parts[index-1]?.endsWith('’')||answer.endsWith('’')&&part.length>0&&!/^\s/.test(part))?' is-attached':''}`}>{answer??'\u00a0'}</span><GrammarVerbHint verb={givenVerb}/>{countryGender?<span className="grammar-country-hint tcf-verbe-theme">({countryGender})</span>:null}</>:null}{part}</Fragment>)}</>
}
