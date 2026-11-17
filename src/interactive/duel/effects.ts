import type { DamageMultiplier, DuelPair, DuelResolution, Side } from './core'
import { hash } from '../domain/seeds'
import {createRng} from '@/math/rng'

/** Accepted only when reading journals created before mascot-specific attacks. */
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
export type Point = {x:number;y:number;radius?:number}
export type FighterPoints = Record<Side,Point>
export function measureFighters(left:{getBoundingClientRect:()=>{x:number;y:number;width:number;height:number}}|null|undefined,right:{getBoundingClientRect:()=>{x:number;y:number;width:number;height:number}}|null|undefined):FighterPoints|null {
  if(!left||!right)return null
  const a=left.getBoundingClientRect(),b=right.getBoundingClientRect()
  return {left:{x:a.x+a.width/2,y:a.y+a.height/2,radius:Math.min(a.width,a.height)/2},right:{x:b.x+b.width/2,y:b.y+b.height/2,radius:Math.min(b.width,b.height)/2}}
}
export function trajectory(from:Point,to:Point) {
  const dx=to.x-from.x,dy=to.y-from.y
  return {dx,dy,angle:Math.atan2(dy,dx),direction:Math.abs(dx)>=Math.abs(dy)?dx>=0?'right':'left':dy>=0?'down':'up'}
}
/** Each hit chooses its own height and curve while staying aimed at its fighter. */
export function attackTrajectory(from:Point,to:Point,roundKey:string,index=0) {
  const random=createRng(hash(`${roundKey}:${index}:trajectory`)),base=trajectory(from,to),length=Math.hypot(base.dx,base.dy)||1
  const nx=-base.dy/length,ny=base.dx/length,startOffset=(random()-.5)*(from.radius??72)*.7,endOffset=(random()-.5)*(to.radius??72)*.7
  const origin={x:from.x+nx*startOffset,y:from.y+ny*startOffset},target={x:to.x+nx*endOffset,y:to.y+ny*endOffset}
  const bend=(random()<.5?-1:1)*Math.min(145,length*.28)*(.35+random()*.65)
  return {...trajectory(origin,target),origin,target,bendX:nx*bend,bendY:ny*bend}
}
export function impactFor(resolution:DuelResolution|undefined,fighters:DuelPair,roundKey:string) {
  if(resolution?.timeout&&(resolution.damage||resolution.scoreOnly))return {kind:'timeout' as const,style:'cloud' as const,target:'left' as Side,critical:false,multiplier:1 as DamageMultiplier,variation:roundKey}
  if((!resolution?.damage&&!resolution?.scoreOnly)||!resolution.side||!resolution.victim)return null
  const multiplier=resolution.multiplier??(resolution.critical?2:1),common={critical:multiplier>1,multiplier,variation:roundKey,mascot:fighters[resolution.side].avatarId}
  return resolution.correct
    ? {kind:'attack' as const,style:fighters[resolution.side].avatarId,from:resolution.side,target:resolution.victim,...common}
    : {kind:'mistake' as const,style:MISTAKE_EFFECTS[hash(`${roundKey}:${resolution.side}:${fighters[resolution.side].avatarId}`)%MISTAKE_EFFECTS.length]!.id,target:resolution.side,...common}
}
export type Impact = NonNullable<ReturnType<typeof impactFor>>
