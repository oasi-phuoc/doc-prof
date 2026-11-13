import type { CSSProperties } from 'react'
import { ATTACK_EFFECTS, trajectory, type AttackEffect, type FighterPoints, type Impact, type MistakeEffect } from './effects'
import './effects.css'

export function DuelImpact({impact,points}:{impact:Impact;points:FighterPoints}) {
  const target=points[impact.target],path=impact.kind==='attack'?trajectory(points[impact.from],target):undefined
  const length=path?Math.hypot(path.dx,path.dy)||1:1,bend=path?Math.min(60,length*.24):0
  // Portrait fighters share the left edge: bend inward so the coup stays visible.
  const normal=path&&path.dy>0?-1:1
  const bendX=path?-path.dy/length*bend*normal:0,bendY=path?path.dx/length*bend*normal:0
  const css={'--ci-hit-x':`${target.x}px`,'--ci-hit-y':`${target.y}px`} as CSSProperties
  return <div className={`ci-duel-impact${impact.critical?' ci-duel-critical-impact':''}`} data-impact-kind={impact.kind} data-effect={impact.style} data-victim={impact.target} data-direction={path?.direction} data-attacker={impact.kind==='attack'?impact.from:undefined} style={css} aria-hidden="true">
    {impact.kind==='attack'&&path?<>
      {Array.from({length:impact.critical?2:1},(_,index)=><div key={index} className={`ci-duel-flight ci-attack-${impact.style}`} data-ci-motion style={{left:points[impact.from].x,top:points[impact.from].y,'--ci-dx':`${path.dx}px`,'--ci-dy':`${path.dy}px`,'--ci-bend-x':`${bendX}px`,'--ci-bend-y':`${bendY}px`,animationDelay:`${index*160}ms`} as CSSProperties}><svg viewBox="-64 -64 128 128" style={{rotate:`${path.angle}rad`}}><AttackArt style={impact.style}/></svg></div>)}
      {Array.from({length:impact.critical?2:1},(_,index)=><div key={index} className="ci-duel-hit-burst" data-ci-motion style={{animationDelay:`${440+index*160}ms`}}><Burst/></div>)}
    </>:impact.kind==='mistake'?<>
      {Array.from({length:impact.critical?6:3},(_,index)=><div className="ci-mistake-object" data-ci-motion key={index} style={{left:target.x+((index%3)-1)*27,top:target.y-12,'--ci-fall-turn':`${(index%2?1:-1)*(30+index*9)}deg`,animationDelay:`${index*65}ms`} as CSSProperties}><svg viewBox="-32 -32 64 64"><MistakeArt style={impact.style}/></svg></div>)}
      <div className="ci-duel-hit-burst ci-duel-mistake-burst" data-ci-motion><Burst/></div>
    </>:null}
  </div>
}
export function AttackArt({style}:{style:AttackEffect}) {
  const color=ATTACK_EFFECTS.find(effect=>effect.id===style)!.color
  const crescent='M-49 38Q-23-38 52-30Q6-24-49 38Z'
  if(style==='crescent'||style==='twin')return <g fill={color}><path d={crescent}/><path d="M-30 27Q0-12 43-21Q8-5-30 27Z" fill="#fff"/>{style==='twin'&&<path d={crescent} transform="translate(9 21) scale(.72)" opacity=".7"/>}</g>
  if(style==='vortex')return <g fill={color}><path d="M-50 24Q-40-44 17-43Q-14-16-4 1Q-35-13-50 24Z"/><path d="M-20 48Q-10 3 25-4Q47-9 50-31Q55 25 18 41Q24 17 8 12Q-10 17-20 48Z"/><circle cx="3" cy="-4" r="6" fill="#fff"/></g>
  if(style==='leaves')return <g>{[[-34,21,-35],[-14,-12,20],[13,21,-10],[35,-10,40]].map(([x,y,a],index)=><g key={index} transform={`translate(${x} ${y}) rotate(${a})`}><path d="M-14 9Q-20-16 13-20Q23 6-14 9Z" fill={index%2?'#8bbf59':color}/><path d="M-11 7 10-16" stroke="#fff" strokeWidth="2"/></g>)}</g>
  if(style==='petals')return <g fill={color}>{[[-37,18,-30],[-21,-17,25],[2,8,40],[23,-25,-20],[37,14,70]].map(([x,y,a],index)=><path key={index} d="M0 15Q-22-3-7-16Q0-20 0-9Q1-20 8-15Q22-2 0 15Z" transform={`translate(${x} ${y}) rotate(${a})`} opacity={.65+index*.07}/>)}</g>
  if(style==='wave')return <g><path d="M-53 31Q-27 12-20-20Q-3-53 28-32Q47-14 22-2Q33-23 15-22Q2-14 14 4Q30 21 53 12Q25 47-8 24Q-22 17-53 31Z" fill={color}/><path d="M-21 5Q-8-23 12-31Q-13-19-21 5ZM0 18Q21 36 42 20Q20 42 0 18Z" fill="#d6f7ff"/></g>
  if(style==='spiral')return <g><path d="M-52 27Q-50-29-1-41Q47-48 49-7Q47 26 14 27Q-13 26-9 2Q-5-14 12-10Q24-6 17 5Q5 0 7 11Q24 22 32 5Q45-26 10-28Q-26-26-52 27Z" fill={color}/><circle cx="-30" cy="32" r="4" fill="#e6c5f3"/></g>
  if(style==='claws')return <g fill={color}>{[-22,0,22].map((y,index)=><path key={y} d="M-45 21Q-9-24 45-28Q6-8-45 21Z" transform={`translate(${index*6-5} ${y}) scale(.88)`}/>)}</g>
  if(style==='gust')return <g fill={color}><path d="M-53 9Q-22-12 10-4Q43 1 38-19Q34-31 25-22Q28-41 44-28Q65-2 30 10Q-8 0-53 9Z"/><path d="M-40 32Q-1 9 32 24Q50 33 53 16Q58 50 24 35Q-8 24-40 32Z"/><circle cx="-35" cy="-17" r="6" fill="#cce9ed"/></g>
  return <g fill="none" stroke={color}>{[17,32,48].map((r,index)=><ellipse key={r} cx={index*3} rx={r*.46} ry={r} strokeWidth={8-index*2}/>)}<path d="M42-9 56-14 52 1 62 13 47 10 37 22 39 6 29-5Z" fill="#ffe6a0" stroke="none"/></g>
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
