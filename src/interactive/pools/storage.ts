import {requestLocal} from '../storage'
import {readPoolConfig,type PoolConfig} from './config'
export type LocalPool={version:1;poolId:string;name:string;seed:number;config:PoolConfig;createdAt:number}
const uuid=/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i
export function readPool(raw:unknown):LocalPool{
 if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new Error('Ce pool est introuvable sur cet appareil.')
 const r=raw as Record<string,unknown>
 if(Object.keys(r).some(key=>!['version','poolId','name','seed','config','createdAt'].includes(key))||r.version!==1||typeof r.poolId!=='string'||!uuid.test(r.poolId)||typeof r.name!=='string'||!r.name.trim()||r.name.length>160||!Number.isInteger(r.seed)||Number(r.seed)<0||Number(r.seed)>0xffffffff||typeof r.createdAt!=='number'||!Number.isFinite(r.createdAt)||r.createdAt<0||r.createdAt>Date.now()+60000)throw new Error('Ce pool n’est pas compatible avec cette version. Ses données sont conservées.')
 return{version:1,poolId:r.poolId,name:r.name,seed:Number(r.seed),config:readPoolConfig(r.config),createdAt:r.createdAt}
}
export async function createPool(config:PoolConfig,name:string,seed:number):Promise<LocalPool>{const pool=readPool({version:1,poolId:crypto.randomUUID(),name:name.trim(),seed,config,createdAt:Date.now()});await requestLocal('pools','readwrite',store=>store.add(pool));return pool}
export async function loadPool(id:string):Promise<LocalPool>{if(!uuid.test(id))throw new Error('Identifiant de pool invalide.');return readPool(await requestLocal('pools','readonly',store=>store.get(id)))}
export async function listPools():Promise<LocalPool[]>{const rows=await requestLocal('pools','readonly',store=>store.getAll());return rows.flatMap(raw=>{try{return[readPool(raw)]}catch{return[]}}).sort((a,b)=>b.createdAt-a.createdAt).slice(0,12)}
