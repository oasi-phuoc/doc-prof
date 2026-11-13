import { useRef, useState } from 'react'
import { CompetitionPortrait } from '../competition/Avatar'
import type { CompetitionAvatar } from '../competition/avatars'
import { AttackArt, DuelImpact, MistakeArt } from './DuelImpact'
import { ATTACK_EFFECTS, DEFAULT_EFFECTS, MISTAKE_EFFECTS, impactFor, measureFighters, type DuelEffects, type FighterPoints, type Impact } from './effects'
import type { Side } from './core'

export function EffectPicker({value=DEFAULT_EFFECTS,onChange,left,right}:{value:DuelEffects;onChange:(effects:DuelEffects)=>void;left:CompetitionAvatar;right:CompetitionAvatar}) {
  const [tab,setTab]=useState<'attack'|'mistake'>('attack'),[critical,setCritical]=useState(false)
  const [preview,setPreview]=useState<{id:number;impact:Impact;points:FighterPoints}|null>(null)
  const demo=useRef<HTMLDivElement>(null)
  const play=(side:Side,next=value)=>{
    const points=measureFighters(demo.current?.querySelector('[data-demo-side="left"] .ci-competition-portrait'),demo.current?.querySelector('[data-demo-side="right"] .ci-competition-portrait'))
    const impact=impactFor({at:0,side,victim:tab==='attack'?(side==='left'?'right':'left'):side,correct:tab==='attack',damage:critical?20:10,critical},next)
    if(points&&impact)setPreview(previous=>({id:(previous?.id??0)+1,impact,points}))
  }
  const choices=tab==='attack'
    ?ATTACK_EFFECTS.map(effect=>({id:effect.id,label:effect.label,art:<AttackArt style={effect.id}/>,select:()=>{const next={...value,attack:effect.id};onChange(next);play('left',next)}}))
    :MISTAKE_EFFECTS.map(effect=>({id:effect.id,label:effect.label,art:<MistakeArt style={effect.id}/>,select:()=>{const next={...value,mistake:effect.id};onChange(next);play('left',next)}}))
  return <section className="ci-panel ci-effect-picker" aria-label="Animations du duel"><h2>Animations du duel</h2>
    <p>Essayez les dix attaques et les dix effets d’erreur. Une erreur fait tomber des objets sur la mascotte qui s’est trompée.</p>
    <div className="ci-toolbar"><button aria-pressed={tab==='attack'} onClick={()=>{setTab('attack');setPreview(null)}}>Attaques</button><button aria-pressed={tab==='mistake'} onClick={()=>{setTab('mistake');setPreview(null)}}>Erreurs</button></div>
    <div className="ci-effect-preview-sticky">
    <div className="ci-effect-demo" ref={demo}>{(['left','right'] as const).map((side,index)=><div key={side} data-demo-side={side}><CompetitionPortrait avatarId={side==='left'?left:right} seat={index+1} outcome={preview?.impact.target===side?false:undefined}/><b>Joueur {index+1}</b></div>)}</div>
    <label><input type="checkbox" checked={critical} onChange={event=>setCritical(event.target.checked)}/>Prévisualiser un critique</label>
    <div className="ci-toolbar"><button onClick={()=>play('left')}>{tab==='attack'?'Attaque':'Erreur'} du joueur 1</button><button onClick={()=>play('right')}>{tab==='attack'?'Attaque':'Erreur'} du joueur 2</button></div>
    </div>
    <div className="ci-effect-options" role="group" aria-label={tab==='attack'?'Animations d’attaque':'Animations d’erreur'}>{choices.map((effect,index)=><button key={effect.id} aria-pressed={value[tab]===effect.id} onClick={effect.select}><svg aria-hidden="true" viewBox={tab==='attack'?'-64 -64 128 128':'-32 -32 64 64'}>{effect.art}</svg><span>{index+1}. {effect.label}</span></button>)}</div>
    {preview&&<DuelImpact key={preview.id} impact={preview.impact} points={preview.points}/>}
  </section>
}
