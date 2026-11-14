import {useEffect,useRef} from 'react'

export function GuidedHints({hints,count,disabled,onNext}:{hints:string[];count:number;disabled:boolean;onNext:()=>void}) {
  const history=useRef<HTMLDivElement>(null)
  useEffect(()=>{if(history.current)history.current.scrollTop=history.current.scrollHeight},[count])
  return <div className="ci-oral-hints ci-guided-hints">
    {count>0&&<div ref={history} className="ci-hint-history" role="region" aria-label="Relances déjà proposées" tabIndex={0}>{hints.slice(0,count).map((hint,index)=><p key={index}>{hint}</p>)}</div>}
    <button disabled={disabled||count>=hints.length} onClick={onNext}>Proposer une relance</button>
  </div>
}
