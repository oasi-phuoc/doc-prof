import {requestLocal} from '../storage'
import {parseDuelTimer} from './core'
import {DEFAULT_DUEL_RULES,parseDuelRules,type DuelRules} from './rules'
import type {TimerSettings} from '../domain/settings'
const id='duel-parameters-v1'
export type DuelParameters={combat:DuelRules;timer:TimerSettings}
export async function loadDuelParameters(timer:TimerSettings):Promise<DuelParameters>{
 const raw=await requestLocal('settings','readonly',store=>store.get(id))
 if(raw===undefined)return{combat:{...DEFAULT_DUEL_RULES},timer:{...timer}}
 if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new Error('Les paramètres enregistrés sont indisponibles ; ils sont conservés.')
 const r=raw as Record<string,unknown>
 if(r.version!==1||r.id!==id||Object.keys(r).some(key=>!['id','version','combat','timer'].includes(key)))throw new Error('Ces paramètres appartiennent à une autre version ; ils sont conservés.')
 return{combat:parseDuelRules(r.combat),timer:parseDuelTimer(r.timer)}
}
let pending:Promise<unknown>=Promise.resolve()
export function saveDuelParameters(parameters:DuelParameters){
 const record={id,version:1,combat:parseDuelRules(parameters.combat),timer:parseDuelTimer(parameters.timer)}
 pending=pending.catch(()=>{}).then(()=>requestLocal('settings','readwrite',store=>store.put(record)))
 return pending
}
