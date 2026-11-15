import {MASCOTS,type MascotKind} from '../domain/mascot'
export const COMBAT_STATES=['tired','critical-tired','victory','defeat'] as const
export type CombatPortraitState='normal'|typeof COMBAT_STATES[number]
export type MatchOutcome='ongoing'|'winner'|'loser'|'draw-ko'
export const COMBAT_ATLASES=['classic','zodiac-a','zodiac-b','nature','spirits'].map(group=>`/lib/images/interactive/mascots-health-${group}.png`)
export function portraitForHp(hp:number,outcome:MatchOutcome='ongoing'):CombatPortraitState{
  if(outcome==='winner')return 'victory'
  if(outcome==='loser'||outcome==='draw-ko'||hp<=0)return 'defeat'
  if(hp<=20)return 'critical-tired'
  return hp<=50?'tired':'normal'
}
export function combatFrame(id:MascotKind,state:Exclude<CombatPortraitState,'normal'>){
  const index=Math.max(0,MASCOTS.findIndex(mascot=>mascot.id===id))
  return{src:COMBAT_ATLASES[Math.floor(index/6)]!,column:COMBAT_STATES.indexOf(state),row:index%6,columns:4,rows:6}
}
