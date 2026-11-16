import catalog from './catalog.generated.json'
import type {Difficulty,Domain} from '@/math/types'

export type PoolType={id:string;domain:Domain;topic:string;type:string;label:string;context:string;complete:boolean;difficulty:Difficulty;numbers:boolean;levels?:Difficulty[];guided?:boolean}
export const POOL_TYPES=catalog.items as PoolType[]
export const POOL_TYPE_BY_ID=new Map(POOL_TYPES.map(type=>[type.id,type]))
export type PoolEntry={id:string;count:number;difficulty:Difficulty;range?:{min:number;max:number;decimals:boolean}}
export type PoolConfig={version:1;entries:PoolEntry[];shuffle:boolean}
const object=(value:unknown):value is Record<string,unknown>=>!!value&&typeof value==='object'&&!Array.isArray(value)
export function newPoolEntry(type:PoolType):PoolEntry{return{id:type.id,count:type.complete?1:5,difficulty:type.difficulty}}
export function readPoolConfig(raw:unknown):PoolConfig{
 if(!object(raw)||Object.keys(raw).some(key=>!['version','entries','shuffle'].includes(key))||raw.version!==1||typeof raw.shuffle!=='boolean'||!Array.isArray(raw.entries)||!raw.entries.length||raw.entries.length>16)throw new Error('Choisissez entre un et seize types d’exercices.')
 const seen=new Set<string>(),entries:PoolEntry[]=[]
 for(const value of raw.entries){
  if(!object(value)||Object.keys(value).some(key=>!['id','count','difficulty','range'].includes(key))||typeof value.id!=='string'||!POOL_TYPE_BY_ID.has(value.id)||seen.has(value.id)||!Number.isInteger(value.count)||Number(value.count)<1||Number(value.count)>20||!['facile','moyen','avance'].includes(value.difficulty as string))throw new Error('Un type ou un réglage du pool n’est plus disponible. Ses données sont conservées.')
  const type=POOL_TYPE_BY_ID.get(value.id)!
  if(type.levels&&!type.levels.includes(value.difficulty as Difficulty))throw new Error('Ce niveau n’est pas disponible pour cet exercice.')
  if(type.complete&&value.count!==1||type.domain==='tcf-csc'&&value.difficulty!=='facile'||type.domain==='tcf-cfr'&&value.difficulty!=='moyen')throw new Error('Le niveau ou la quantité ne correspond pas à cette série.')
  let range:PoolEntry['range']
  if(value.range!==undefined){const r=value.range;if(!type.numbers||!object(r)||Object.keys(r).length!==3||!Object.keys(r).every(key=>['min','max','decimals'].includes(key))||typeof r.min!=='number'||typeof r.max!=='number'||!Number.isFinite(r.min)||!Number.isFinite(r.max)||r.min< -100000||r.max>100000||r.min>r.max||typeof r.decimals!=='boolean'||!r.decimals&&(!Number.isInteger(r.min)||!Number.isInteger(r.max)))throw new Error('La plage de nombres de cet exercice est invalide.');range={min:r.min,max:r.max,decimals:r.decimals}}
  seen.add(value.id);entries.push({id:value.id,count:Number(value.count),difficulty:value.difficulty as Difficulty,...(range?{range}:{})})
 }
 return{version:1,entries,shuffle:raw.shuffle}
}
