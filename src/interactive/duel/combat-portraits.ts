import {MASCOTS,type MascotKind} from '../domain/mascot'
import type {Power} from './vfx/catalog'
import {COMBAT_CROPS,COMBAT_MASKS} from './combat-crops.generated'
export const COMBAT_STATES=['tired','critical-tired','victory','defeat'] as const
export type CombatPortraitState='normal'|typeof COMBAT_STATES[number]
export type MatchOutcome='ongoing'|'winner'|'loser'|'draw-ko'
export const COMBAT_ATLASES=['classic','zodiac-a','zodiac-b','nature','spirits'].map(group=>`/lib/images/interactive/mascots-health-${group}.png`)
export function portraitForHp(hp:number,outcome:MatchOutcome='ongoing',maxHp=100):CombatPortraitState{
  if(outcome==='winner')return 'victory'
  if(outcome==='loser'||outcome==='draw-ko'||hp<=0)return 'defeat'
  const percent=hp*100/maxHp
  if(percent<=20)return 'critical-tired'
  return percent<=50?'tired':'normal'
}
export function combatPoseForHp(hp:number,outcome:MatchOutcome='ongoing',level:Power=1,maxHp=100):CombatPortraitState|'angry'{
  const state=portraitForHp(hp,outcome,maxHp)
  return level>1&&state!=='victory'&&state!=='defeat'?'angry':state
}
export function combatFrame(id:MascotKind,state:Exclude<CombatPortraitState,'normal'>){
  const index=Math.max(0,MASCOTS.findIndex(mascot=>mascot.id===id))
  const column=COMBAT_STATES.indexOf(state)
  return{src:COMBAT_ATLASES[Math.floor(index/6)]!,column,row:index%6,columns:4,rows:6,crop:COMBAT_CROPS[index*4+column]!,mask:COMBAT_MASKS[index*4+column]!}
}
