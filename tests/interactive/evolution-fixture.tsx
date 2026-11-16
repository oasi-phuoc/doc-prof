import {createRoot,type Root} from 'react-dom/client'
import {CombatPortrait} from '../../src/interactive/duel/CombatPortrait'
import {MASCOTS} from '../../src/interactive/domain/mascot'
import {ADULT_BASE_STATES,ADULT_ACTION_STATES,ADULT_ACTIVITY_STATES} from '../../src/interactive/duel/evolution'
let root:Root|undefined
export function gallery(group:number,kind:'combat'|'activities'|'mini'='combat'){
 document.getElementById('root')?.setAttribute('hidden','')
 let host=document.getElementById('evolution-gallery');if(!host){host=document.createElement('div');host.id='evolution-gallery';document.body.append(host);root=createRoot(host)}
 const states=kind==='combat'?[...ADULT_BASE_STATES,...ADULT_ACTION_STATES]:kind==='activities'?ADULT_ACTIVITY_STATES:['charge','release']as const
 root!.render(<div className="ci-app" style={{background:'#17233b',color:'#fff',padding:20}}><h1>Les mascottes {kind==='mini'?'mini':'adultes'} · {group+1}/5</h1><div style={{display:'grid',gridTemplateColumns:`repeat(${states.length},minmax(0,1fr))`,gap:8}}>{MASCOTS.slice(group*6,group*6+6).flatMap(mascot=>states.map(state=><figure key={`${mascot.id}:${state}`} style={{margin:0,padding:8,background:'#243853',borderRadius:12,display:'grid',justifyItems:'center'}}><CombatPortrait avatarId={mascot.id} hp={kind==='mini'?100:200} maxHp={kind==='mini'?100:200} pose={state} cast={state==='charge'||state==='release'?state:undefined}/><figcaption style={{fontSize:12,textAlign:'center'}}>{mascot.label} · {state}</figcaption></figure>))}</div><style>{`#evolution-gallery .ci-competition-portrait{width:130px;height:130px}#evolution-gallery .ci-app{min-height:100vh}#evolution-gallery h1{font-size:25px;margin:0 0 18px}`}</style></div>)
}
