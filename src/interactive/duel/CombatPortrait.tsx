import {useState,type CSSProperties} from 'react'
import {CompetitionPortrait} from '../competition/Avatar'
import {MASCOTS,type MascotKind} from '../domain/mascot'
import {usePreparedMedia} from '../media/prepared-context'
import {combatFrame,combatPoseForHp,type MatchOutcome} from './combat-portraits'
import type {Power} from './vfx/catalog'
import {evolutionFrame,ADULT_ACTIVITY_STATES,type EvolvedState} from './evolution'
import {isAdultForm} from './rules'
import {PowerAura} from './PowerAura'
import {Mascot} from '../components/Mascot'
import type {Side} from './core'
import './combat-portraits.css'

export function CombatPortrait({avatarId,hp=100,maxHp=100,outcome='ongoing',level=1,hit=false,cast,facing='left',pose,seat}:{avatarId:MascotKind;hp?:number;maxHp?:number;outcome?:MatchOutcome;level?:Power;hit?:boolean;cast?:'charge'|'release';facing?:Side;pose?:EvolvedState;seat?:number}){
  const healthState=combatPoseForHp(hp,outcome,level,maxHp),final=healthState==='victory'||healthState==='defeat',state=final?healthState:pose??cast??healthState,adult=isAdultForm(maxHp),resolve=usePreparedMedia(),[failed,setFailed]=useState('')
  const mascot=MASCOTS.find(item=>item.id===avatarId)??MASCOTS[0]
  const looking=facing==='left'?'right':'left'
  if(!adult&&(state==='normal'||state==='angry'))return <CompetitionPortrait avatarId={avatarId} seat={seat} powerLevel={level} facing={looking} aura outcome={hit?false:undefined}/>
  if(!adult&&ADULT_ACTIVITY_STATES.some(value=>value===state))return <span className="ci-competition-portrait" data-looking={looking}><span className="ci-combat-art" data-facing={facing}><Mascot kind={avatarId} pose={state as typeof ADULT_ACTIVITY_STATES[number]} label={mascot.label}/></span></span>
  const frame=adult||state==='charge'||state==='release'?evolutionFrame(avatarId,state,adult):combatFrame(avatarId,state as 'tired'|'critical-tired'|'victory'|'defeat'),clip='polygon('+frame.mask.map(([x,y])=>`${x}% ${y}%`).join(',')+')'
  const labels:Record<EvolvedState,string>={normal:'prête',angry:'énervée',tired:'fatiguée','critical-tired':'très fatiguée',victory:'victoire',defeat:'KO',charge:'charge d’énergie',release:'tir d’énergie',thinking:'réflexion','cards-up':'réponse',discussion:'discussion',correct:'félicitations',incorrect:'larmes',pause:'pause'}
  return <span data-ci-motion className={`ci-competition-portrait ci-combat-portrait${level>1?` ci-powered-portrait ci-power-${level}`:''}${hit?' ci-combat-hit':''}`} data-combat-state={state} data-power={level} data-evolution={adult?'adult':'mini'} data-looking={looking}>
    <PowerAura level={level} mascot={avatarId}/><span className="ci-combat-art" data-ci-motion data-facing={facing}><span className="ci-combat-state" data-ci-motion data-state={state} data-species={avatarId} role="img" aria-label={`${mascot.label} · ${adult?'adulte · ':''}${labels[state]}`} style={{'--combat-row':frame.row,'--combat-column':frame.column,'--combat-columns':frame.columns,'--combat-rows':frame.rows,'--combat-clip':clip,'--combat-phase':`${MASCOTS.indexOf(mascot)%5*.07}s`} as CSSProperties}>
      {failed===frame.src?<CompetitionPortrait avatarId={avatarId}/>:<img key={frame.src} src={resolve(frame.src)} onError={()=>setFailed(frame.src)} alt="" draggable={false}/>}
    </span></span>{seat!==undefined&&<b className="ci-competition-seat" aria-hidden="true">{seat}</b>}
  </span>
}
