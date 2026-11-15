import type {DamageMultiplier} from './core'
import type {CSSProperties} from 'react'
import type {MascotKind} from '../domain/mascot'
import {signatureFor,SUPER_AURA_COLORS} from './vfx/catalog'
import './power-aura.css'

export function PowerAura({level,mascot='leaf'}:{level:DamageMultiplier;mascot?:MascotKind}) {
  if(level===1)return null
  const signature=signatureFor(mascot)
  return <span className={`ci-power-aura ci-power-aura-${level}`} data-power-aura={level} data-aura-mascot={mascot} style={{'--ci-power-outer':level===3?SUPER_AURA_COLORS[mascot]:signature.color,'--ci-power-inner':signature.light} as CSSProperties} aria-hidden="true">
    <svg viewBox="0 0 200 240" className="ci-power-flame" data-ci-motion><path d="M100 230C14 219 11 154 29 115L37 153C19 83 61 56 63 22L84 77L101 3L119 70L147 27L143 95L174 70L165 128L188 111C205 182 165 228 100 230Z" fill="var(--ci-power-outer)" fillOpacity=".55"/><path d="M100 222C37 209 43 171 48 142L66 161L66 101L87 126L103 48L121 128L139 104L136 158L162 142C170 189 143 219 100 222Z" fill="var(--ci-power-inner)" fillOpacity=".65"/></svg>
    {Array.from({length:level===3?12:7},(_,index)=><i key={index} data-ci-motion style={{left:`${10+index*73/(level===3?11:6)}%`,animationDelay:`${index*-.13}s`}}/>)}
    {level===3&&<svg className="ci-power-lightning" data-ci-motion viewBox="0 0 200 240"><path d="m30 50-10 50 20-7-9 45M170 64l13 43-18-7 12 42M65 14l-6 39 17-7M144 19l7 38-18-8" fill="none" stroke="var(--ci-power-inner)" strokeWidth="4" strokeLinejoin="round"/></svg>}
  </span>
}
