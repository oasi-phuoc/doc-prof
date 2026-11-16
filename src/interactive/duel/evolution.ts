import {MASCOTS,BASE_MASCOT_POSES,type MascotKind} from '../domain/mascot'
import compiled from './evolution-masks.generated.json'
import {isAdultForm} from './rules'
export const EVOLUTION_GROUPS=['classic','zodiac-a','zodiac-b','nature','spirits']as const
export const ADULT_BASE_STATES=['normal','angry','tired','critical-tired']as const
export const ADULT_ACTION_STATES=['victory','defeat','charge','release']as const
export const ADULT_ACTIVITY_STATES=BASE_MASCOT_POSES
export const ADULT_STATES=[...ADULT_BASE_STATES,...ADULT_ACTION_STATES,...ADULT_ACTIVITY_STATES]as const
export type EvolvedState=typeof ADULT_STATES[number]
export const EVOLUTION_ATLASES=compiled.atlases.map(a=>a.src)
/** Fresh matches need only their roster's combat sheets. A resumed roster may
 * differ from the form, so all battle sheets remain available for restoration. */
export function battleArtwork(config:{left:readonly MascotKind[];right:readonly MascotKind[];combat?:{maxHp:number}},resume=false){
 const groups=resume?[...EVOLUTION_GROUPS]:[...new Set([...config.left,...config.right].map(id=>EVOLUTION_GROUPS[Math.floor(Math.max(0,MASCOTS.findIndex(m=>m.id===id))/6)]!))],adult=isAdultForm(config.combat?.maxHp??100)
 return EVOLUTION_ATLASES.filter(src=>!src.includes('-activities-')&&groups.some(group=>src.endsWith(`-${group}.png`))&&(resume||(adult?!src.includes('-mini-charge-'):src.includes('-mini-charge-'))))
}
export function evolutionFrame(id:MascotKind,state:EvolvedState,adult=true){
 const index=Math.max(0,MASCOTS.findIndex(m=>m.id===id)),group=EVOLUTION_GROUPS[Math.floor(index/6)]!,kind=!adult?'mini-charge':ADULT_BASE_STATES.includes(state as typeof ADULT_BASE_STATES[number])?'adult-base':ADULT_ACTION_STATES.includes(state as typeof ADULT_ACTION_STATES[number])?'adult-action':'adult-activities'
 const states:readonly string[]=!adult?['charge','release']:kind==='adult-base'?ADULT_BASE_STATES:kind==='adult-action'?ADULT_ACTION_STATES:ADULT_ACTIVITY_STATES,column=states.indexOf(state),src=`/lib/images/interactive/mascots-${kind}-${group}.png`,atlas=compiled.atlases.find(a=>a.src===src)
 if(column<0||!atlas)throw new Error('État de mascotte indisponible.')
 const row=index%6,frame=atlas.frames[row*atlas.columns+column]!
 return{src,columns:atlas.columns,rows:atlas.rows,row,column,mask:frame.mask}
}
