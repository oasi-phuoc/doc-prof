import type { CSSProperties } from 'react'
import { trajectory, type FighterPoints, type Impact, type MistakeEffect } from './effects'
import { SignatureAttackArt } from './SignatureAttackArt'
import { attackSequence, signatureAttack } from './signature-attacks'
import { CriticalSpecials } from './CriticalSpecials'
import './effects.css'

export function DuelImpact({impact,points}:{impact:Impact;points:FighterPoints}) {
  const target=points[impact.target],path=impact.kind==='attack'?trajectory(points[impact.from],target):undefined
  const signature=impact.kind==='attack'?signatureAttack(impact.style):undefined
  const sequence=impact.kind==='attack'?attackSequence(impact.style,impact.critical):[]
  const length=path?Math.hypot(path.dx,path.dy)||1:1,bend=path?Math.min(60,length*.24)*(signature?.bend??1):0
  // Portrait fighters share the left edge: bend inward so the coup stays visible.
  const normal=path&&path.dy>0?-1:1
  const bendX=path?-path.dy/length*bend*normal:0,bendY=path?path.dx/length*bend*normal:0
  const css={'--ci-hit-x':`${target.x}px`,'--ci-hit-y':`${target.y}px`,'--ci-critical-color':signature?.color,'--ci-critical-accent':signature?.accent} as CSSProperties
  return <div className={`ci-duel-impact${impact.critical?' ci-duel-critical-impact':''}`} data-impact-kind={impact.kind} data-effect={impact.style} data-victim={impact.target} data-direction={path?.direction} data-attacker={impact.kind==='attack'?impact.from:undefined} style={css} aria-hidden="true">
    {impact.kind==='attack'&&path?<>
      {sequence.map(hit=><div key={hit.index} className={`ci-duel-flight ci-attack-${signature!.motion}`} data-ci-motion data-attack-mascot={impact.style} style={{left:points[impact.from].x,top:points[impact.from].y,'--ci-dx':`${path.dx}px`,'--ci-dy':`${path.dy}px`,'--ci-bend-x':`${bendX}px`,'--ci-bend-y':`${bendY}px`,'--ci-hit-scale':signature!.scale,animationDuration:`${hit.duration}ms`,animationDelay:`${hit.delay}ms`} as CSSProperties}><svg viewBox="-64 -64 128 128" style={{rotate:`${path.angle+(impact.critical?(hit.index%3-1)*.12:0)}rad`}}><SignatureAttackArt mascot={impact.style}/></svg></div>)}
      {sequence.map(hit=><div key={hit.index} className="ci-duel-hit-burst" data-ci-motion style={{animationDelay:`${hit.impactDelay}ms`}}><Burst/></div>)}
      {impact.critical&&<CriticalSpecials mascot={impact.style} origin={points[impact.from]} target={target}/>}
    </>:impact.kind==='mistake'?<>
      {Array.from({length:impact.critical?6:3},(_,index)=><div className="ci-mistake-object" data-ci-motion key={index} style={{left:target.x+((index%3)-1)*27,top:target.y-12,'--ci-fall-turn':`${(index%2?1:-1)*(30+index*9)}deg`,animationDelay:`${index*65}ms`} as CSSProperties}><svg viewBox="-32 -32 64 64"><MistakeArt style={impact.style}/></svg></div>)}
      <div className="ci-duel-hit-burst ci-duel-mistake-burst" data-ci-motion><Burst/></div>
    </>:null}
  </div>
}
export function MistakeArt({style}:{style:MistakeEffect}) {
  if(style==='stones')return <g><path d="M-24 7-15-19 4-25 24-9 21 15 1 26-21 20Z" fill="#91a0ac" stroke="#4c6271" strokeWidth="3"/><path d="M-15-17 1-4 21-8M1-4-1 22" stroke="#cdd8de" strokeWidth="3" fill="none"/></g>
  if(style==='bucket')return <g><path d="M-20-11-14 23 14 23 20-11Z" fill="#72b8d7" stroke="#356886" strokeWidth="3"/><ellipse cy="-11" rx="20" ry="6" fill="#c8edfa" stroke="#356886" strokeWidth="3"/><path d="M-13-12V-20Q0-38 13-20V-12" fill="none" stroke="#356886" strokeWidth="4"/><path d="M-26 19Q-34 31-24 31Q-17 31-26 19Z" fill="#5daed2"/></g>
  if(style==='books')return <g transform="rotate(-13)"><path d="M-23-23H18L25-17V24H-18L-23 18Z" fill="#b58fe3" stroke="#6f4d99" strokeWidth="3"/><path d="M-18 15H22V21H-18Z" fill="#fff9e9"/><path d="M-15-22V15M-10-10H12M-10-3H6" stroke="#e6d6f7" strokeWidth="3"/></g>
  if(style==='pillows')return <g><path d="M-25-22Q0-15 25-22Q17 0 25 22Q0 15-25 22Q-17 0-25-22Z" fill="#f2b6c7" stroke="#c17b92" strokeWidth="3"/><path d="M-17-14Q0-8 17-14M-17 14Q0 8 17 14" fill="none" stroke="#ffe1e9" strokeWidth="3"/></g>
  if(style==='apples')return <g><path d="M0-12Q-29-30-24 3Q-18 30 0 24Q17 31 25 3Q29-26 0-12Z" fill="#df7680" stroke="#9d4559" strokeWidth="2"/><path d="M0-13Q-3-26 7-30" fill="none" stroke="#775b3a" strokeWidth="4"/><path d="M4-18Q22-34 24-17Q13-13 4-18Z" fill="#8ab96e"/><path d="M-15-5Q-20 2-14 11" fill="none" stroke="#ffb6b9" strokeWidth="4"/></g>
  if(style==='cones')return <g><path d="M0-28Q-26-4-18 15Q0 35 18 15Q26-4 0-28Z" fill="#b98c65" stroke="#7f5b42" strokeWidth="3"/>{[-12,0,12].map(y=><path key={y} d={`M-15 ${y}Q0 ${y+17}15 ${y}`} fill="none" stroke="#e2ba92" strokeWidth="4"/>)}</g>
  if(style==='snow')return <g stroke="#6fadc8" strokeWidth="4" strokeLinecap="round">{[0,60,120].map(angle=><g key={angle} transform={`rotate(${angle})`}><path d="M0-27V27M-8-20 0-12 8-20M-8 20 0 12 8 20" fill="none"/></g>)}<circle r="5" fill="#e5faff"/></g>
  if(style==='feathers')return <g transform="rotate(20)"><path d="M0 25Q-33 4-18-20Q-2-41 15-19Q34 7 0 25Z" fill="#e9d6ef" stroke="#ac85b7" strokeWidth="2"/><path d="M0-26V31M-13-10 0 0 13-10M-11 5 0 14 11 5" fill="none" stroke="#fff" strokeWidth="3"/></g>
  if(style==='bubbles')return <g><circle r="23" fill="#b3deed" fillOpacity=".7" stroke="#6ca7c9" strokeWidth="3"/><path d="M-14-6Q-10-18 2-16" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round"/><circle cx="23" cy="23" r="6" fill="#c3c8ef"/></g>
  return <g><path d="M-25 4Q-35-13-16-17Q-7-38 12-21Q32-24 29-5Q40 12 18 15H-18Q-32 15-25 4Z" fill="#d4ddec" stroke="#849ab6" strokeWidth="2"/>{[-13,2,17].map((x,index)=><path key={x} d="M0 0Q-9 13 0 13Q9 13 0 0Z" transform={`translate(${x} ${17-index*4})`} fill="#77aaca"/>)}</g>
}
function Burst(){return <svg viewBox="-60 -60 120 120"><path d="m0-50 9 31 29-17-16 28 32 9-32 7 17 28-30-15-9 30-8-30-29 16 17-28-31-8 31-8-17-28 29 15Z" fill="#ffdd87"/><path d="m0-26 7 20 19 6-19 7-7 19-6-19-20-7 20-6Z" fill="#fff9dc"/></svg>}
