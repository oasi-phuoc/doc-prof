import type {CSSProperties} from 'react'
import type {MascotKind} from '../domain/mascot'
import type {Point} from './effects'
import {signatureAttack} from './signature-attacks'

/** An orbit collapses into a nova, followed by three expanding impact rings. */
export function SuperCriticalSpecials({mascot,origin,target}:{mascot?:MascotKind;origin?:Point;target:Point}) {
  const theme=mascot?signatureAttack(mascot):{color:'#9c63bc',accent:'#ffe7a5'}
  return <div className="ci-super-specials" aria-hidden="true" style={{'--ci-super-color':theme.color,'--ci-super-accent':theme.accent} as CSSProperties}>
    {origin&&<div className="ci-super-charge" data-ci-motion style={{left:origin.x,top:origin.y}}><svg viewBox="-70 -70 140 140"><path d="M0-58 15-18 58 0 15 18 0 58-15 18-58 0-15-18Z" fill="none" stroke="currentColor" strokeWidth="5"/><circle r="43" fill="none" stroke={theme.accent} strokeWidth="3" strokeDasharray="18 10"/></svg></div>}
    <div className="ci-super-nova" data-ci-motion data-super-critical="true" style={{left:target.x,top:target.y}}><svg viewBox="-90 -90 180 180">
      {[0,60,120].map(angle=><g key={angle} transform={`rotate(${angle})`}><ellipse rx="75" ry="23" fill="none" stroke={theme.accent} strokeWidth="4"/><circle cx="75" r="7" fill="currentColor"/></g>)}
      <path d="m0-70 13 41 33-22-18 37 42 14-42 13 18 38-33-23-13 42-13-42-33 23 18-38-42-13 42-14-18-37 33 22Z" fill="currentColor" fillOpacity=".65"/><path d="M0-38 10-10 38 0 10 10 0 38-10 10-38 0-10-10Z" fill="#fff9dc"/>
    </svg></div>
    {[0,1,2].map(index=><div key={index} className="ci-super-ring" data-ci-motion style={{left:target.x,top:target.y,animationDelay:`${260+index*110}ms`,rotate:`${index*30}deg`}}><svg viewBox="-65 -65 130 130"><circle r="48" fill="none" stroke="currentColor" strokeWidth={8-index*2}/><path d="M-56 0H-39M39 0H56M0-56V-39M0 39V56" stroke={theme.accent} strokeWidth="5"/></svg></div>)}
  </div>
}
