export type DuelRules={maxHp:number;critical2:number;critical3:number;critical4:number}
export const DEFAULT_DUEL_RULES:DuelRules={maxHp:100,critical2:25,critical3:10,critical4:5}
export const LEGACY_DUEL_RULES:DuelRules={...DEFAULT_DUEL_RULES,critical4:0}
export function parseDuelRules(value:unknown):DuelRules{
 if(!value||typeof value!=='object'||Array.isArray(value))throw new Error('Paramètres de combat invalides.')
 const r=value as Record<string,unknown>
 if(Object.keys(r).length!==4||Object.keys(r).some(key=>!['maxHp','critical2','critical3','critical4'].includes(key))||!Number.isInteger(r.maxHp)||Number(r.maxHp)<10||Number(r.maxHp)>200)throw new Error('La vie maximale doit être comprise entre 10 et 200 points.')
 for(const key of ['critical2','critical3','critical4'])if(!Number.isInteger(r[key])||Number(r[key])<0||Number(r[key])>100)throw new Error('Chaque chance de critique doit être comprise entre 0 et 100 %.')
 const result={maxHp:Number(r.maxHp),critical2:Number(r.critical2),critical3:Number(r.critical3),critical4:Number(r.critical4)}
 if(result.critical2+result.critical3+result.critical4>100)throw new Error('Le total des chances de critiques ne peut pas dépasser 100 %.')
 return result
}
export const isAdultForm=(maxHp:number)=>maxHp>100
