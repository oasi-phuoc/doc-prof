import {useState,type CSSProperties} from 'react'
import {CompetitionPortrait} from '../competition/Avatar'
import {MASCOTS,type MascotKind} from '../domain/mascot'
import {usePreparedMedia} from '../media/prepared-context'
import {combatFrame,combatPoseForHp,type MatchOutcome} from './combat-portraits'
import type {Power} from './vfx/catalog'
import './combat-portraits.css'

export function CombatPortrait({avatarId,hp=100,outcome='ongoing',level=1,hit=false}:{avatarId:MascotKind;hp?:number;outcome?:MatchOutcome;level?:Power;hit?:boolean}){
  const state=combatPoseForHp(hp,outcome,level),resolve=usePreparedMedia(),[failed,setFailed]=useState('')
  const mascot=MASCOTS.find(item=>item.id===avatarId)??MASCOTS[0]
  if(state==='normal'||state==='angry')return <CompetitionPortrait avatarId={avatarId} powerLevel={level} aura outcome={hit?false:undefined}/>
  const frame=combatFrame(avatarId,state),clip='polygon('+frame.mask.map(([x,y])=>`${x}% ${y}%`).join(',')+')'
  return <span data-ci-motion className={`ci-competition-portrait ci-combat-portrait${hit?' ci-combat-hit':''}`} data-combat-state={state} data-power={level}>
    <span className="ci-combat-state" data-ci-motion data-state={state} data-species={avatarId} role="img" aria-label={`${mascot.label} · ${state==='victory'?'victoire':state==='defeat'?'KO':state==='tired'?'fatiguée':'très fatiguée'}`} style={{'--combat-row':frame.row,'--combat-column':frame.column,'--combat-clip':clip,'--combat-phase':`${MASCOTS.indexOf(mascot)%5*.07}s`} as CSSProperties}>
      {failed===frame.src?<CompetitionPortrait avatarId={avatarId}/>:<img key={frame.src} src={resolve(frame.src)} onError={()=>setFailed(frame.src)} alt="" draggable={false}/>}
    </span>
  </span>
}
