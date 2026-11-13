import type { DuelResolution, Side } from './core'

export const ATTACK_EFFECTS = [
  {id:'crescent',label:'Croissant',color:'#7953d6'}, {id:'twin',label:'Double entaille',color:'#d16b27'},
  {id:'vortex',label:'Tourbillon',color:'#2787a1'}, {id:'leaves',label:'Feuilles',color:'#4a9857'},
  {id:'petals',label:'Pétales',color:'#d66b9a'}, {id:'wave',label:'Vague',color:'#318dbb'},
  {id:'spiral',label:'Spirale',color:'#9c63bc'}, {id:'claws',label:'Griffes',color:'#c96836'},
  {id:'gust',label:'Coup de vent',color:'#5596a8'}, {id:'shockwave',label:'Onde de choc',color:'#bc852a'},
] as const
export const MISTAKE_EFFECTS = [
  {id:'stones',label:'Cailloux'}, {id:'bucket',label:'Seau d’eau'}, {id:'books',label:'Livres'},
  {id:'pillows',label:'Coussins'}, {id:'apples',label:'Pommes'}, {id:'cones',label:'Pommes de pin'},
  {id:'snow',label:'Flocons'}, {id:'feathers',label:'Plumes'}, {id:'bubbles',label:'Bulles'}, {id:'cloud',label:'Petit nuage'},
] as const
export type AttackEffect = typeof ATTACK_EFFECTS[number]['id']
export type MistakeEffect = typeof MISTAKE_EFFECTS[number]['id']
export type DuelEffects = {attack:AttackEffect;mistake:MistakeEffect}
export const DEFAULT_EFFECTS: DuelEffects = {attack:'crescent',mistake:'stones'}
export function validEffects(value: unknown): value is DuelEffects {
  if(!value||typeof value!=='object'||Array.isArray(value))return false
  const v=value as Record<string,unknown>
  return Object.keys(v).every(key=>['attack','mistake'].includes(key))&&ATTACK_EFFECTS.some(effect=>effect.id===v.attack)&&MISTAKE_EFFECTS.some(effect=>effect.id===v.mistake)
}
export type Point = {x:number;y:number}
export type FighterPoints = Record<Side,Point>
export function measureFighters(left:{getBoundingClientRect:()=>{x:number;y:number;width:number;height:number}}|null|undefined,right:{getBoundingClientRect:()=>{x:number;y:number;width:number;height:number}}|null|undefined):FighterPoints|null {
  if(!left||!right)return null
  const a=left.getBoundingClientRect(),b=right.getBoundingClientRect()
  return {left:{x:a.x+a.width/2,y:a.y+a.height/2},right:{x:b.x+b.width/2,y:b.y+b.height/2}}
}
export function trajectory(from:Point,to:Point) {
  const dx=to.x-from.x,dy=to.y-from.y
  return {dx,dy,angle:Math.atan2(dy,dx),direction:Math.abs(dx)>=Math.abs(dy)?dx>=0?'right':'left':dy>=0?'down':'up'}
}
export function impactFor(resolution:DuelResolution|undefined,effects:DuelEffects=DEFAULT_EFFECTS) {
  if(!resolution?.damage||!resolution.side||!resolution.victim)return null
  return resolution.correct
    ? {kind:'attack' as const,style:effects.attack,from:resolution.side,target:resolution.victim,critical:resolution.critical}
    : {kind:'mistake' as const,style:effects.mistake,target:resolution.side,critical:resolution.critical}
}
export type Impact = NonNullable<ReturnType<typeof impactFor>>
