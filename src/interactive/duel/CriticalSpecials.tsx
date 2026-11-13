import type { CSSProperties } from 'react'
import type { MascotKind } from '../domain/mascot'
import type { Point } from './effects'
import { signatureAttack } from './signature-attacks'

/** Small, themed lights around both fighters; never a screen-wide flash. */
export function CriticalSpecials({mascot,origin,target}:{mascot:MascotKind;origin:Point;target:Point}) {
  const {color,accent}=signatureAttack(mascot)
  return <div className="ci-critical-specials" data-signature={mascot} aria-hidden="true">
    {[origin,target].map((point,index)=><div key={index} className={`ci-critical-aura${index?' ci-critical-target-aura':''}`} data-ci-motion style={{left:point.x,top:point.y,animationDelay:`${index*80}ms`,color}}><svg viewBox="-60 -60 120 120"><circle r="39" fill="none" stroke="currentColor" strokeWidth="5"/><path d="M-44-16A47 47 0 0 1 22-41M43 20A47 47 0 0 1-21 42" fill="none" stroke={accent} strokeWidth="7" strokeLinecap="round"/></svg></div>)}
    {Array.from({length:20},(_,index)=>{
      const angle=index*Math.PI*2/20,distance=45+(index%4)*15
      return <div key={index} className="ci-critical-spark" data-ci-motion style={{left:target.x,top:target.y,'--ci-spark-x':`${Math.cos(angle)*distance}px`,'--ci-spark-y':`${Math.sin(angle)*distance}px`,animationDelay:`${index*18}ms`,color:index%3===0?'#fff4ae':index%3===1?accent:color} as CSSProperties}><svg viewBox="-16 -16 32 32">{mascot==='koi'?<path d="M0-14Q-15 1-9 10Q0 19 10 9Q16 1 0-14Z" fill="currentColor"/>:mascot==='kitsune'||mascot==='dragon'?<path d="M0-16Q2-6 10-8Q6-1 12 5Q8 17-3 13Q-18 9-9-3Q-7 6-3 3Q-7-6 0-16Z" fill="currentColor"/>:<path d="m0-15 4 11 11 4-11 4-4 11-4-11-11-4 11-4Z" fill="currentColor"/>}</svg></div>
    })}
  </div>
}
