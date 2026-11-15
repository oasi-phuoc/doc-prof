import {useEffect,useRef,useState} from 'react'
import type {CompetitionAvatar} from '../competition/avatars'
import {CombatPortrait} from './CombatPortrait'
import {DuelVfx} from './vfx/DuelVfx'
import {impactFor,type Impact} from './effects'
import {signatureFor,sceneDuration,contactTime,type Power} from './vfx/catalog'
import type {Side} from './core'

export function MascotAttackPreview({left,right}:{left:CompetitionAvatar;right:CompetitionAvatar}){
  const [level,setLevel]=useState<Power>(1),[preview,setPreview]=useState<{id:number;impact:Impact;at:number}|null>(null),serial=useRef(0)
  const [now,setNow]=useState(Date.now),[seek,setSeek]=useState<number|undefined>(),[speed,setSpeed]=useState(1),[hp,setHp]=useState(100)
  useEffect(()=>{const clock=setInterval(()=>setNow(Date.now()),50);return()=>clearInterval(clock)},[])
  const play=(side:Side,correct=true)=>{
    const impact=impactFor({at:0,side,victim:correct?(side==='left'?'right':'left'):side,correct,damage:level*10,critical:level>1,multiplier:level},{left:{avatarId:left,seat:1},right:{avatarId:right,seat:1}},`preview:${serial.current}`)
    if(impact){setSeek(undefined);setPreview({id:serial.current++,impact,at:Date.now()})}
  }
  const elapsed=seek??(preview?(now-preview.at)*speed:0),victim=preview?.impact.target,mascot=preview?.impact.kind!=='timeout'?preview?.impact.mascot:undefined
  const duration=sceneDuration(mascot??left,level),playing=!!preview&&elapsed<duration,contact=contactTime(mascot??left,level,preview?.impact.kind==='mistake')
  return <section className="ci-panel ci-mascot-attacks" aria-label="Attaques des mascottes"><h2>Attaques des mascottes</h2>
    <div role="radiogroup" aria-label="Niveau de l’attaque" className="ci-toolbar">{([1,2,3] as const).map(power=><label key={power}><input type="radio" name="attack-power" checked={level===power} onChange={()=>{setLevel(power);setPreview(null);setSeek(undefined)}}/>{power===1?'Normal':`Critique ×${power}`}</label>)}</div>
    <div className="ci-effect-demo">{(['left','right'] as const).map((side,index)=>{
      const avatar=side==='left'?left:right
      return <div key={side} data-demo-side={side}>
        <CombatPortrait avatarId={avatar} hp={victim===side&&elapsed>=contact?Math.max(0,hp-level*10):hp} level={playing?1:level} hit={playing&&victim===side&&elapsed>=contact&&elapsed<contact+420}/>
        <b>Joueur {index+1}</b><span className="ci-signature-name">{signatureFor(avatar)[level===1?'normal':level===2?'double':'triple']}</span>
        <button onClick={()=>play(side)} aria-label={`Attaque du joueur ${index+1}`}>Voir l’attaque</button>
        <button onClick={()=>play(side,false)} aria-label={`Erreur du joueur ${index+1}`}>Voir une erreur</button>
      </div>
    })}</div>
    <DuelVfx left={left} right={right} level={level} questionKey={`preview:${preview?.id??'idle'}`} impact={playing||seek!==undefined?preview?.impact:undefined} elapsedMs={elapsed} aura={!playing&&seek===undefined} selector={'[data-demo-side="SIDE"] .ci-competition-portrait'} seekMs={seek} speed={speed}/>
    {import.meta.env.DEV&&<details className="ci-vfx-dev"><summary>Atelier d’animation</summary><label>Vitesse<select value={speed} onChange={event=>setSpeed(Number(event.target.value))}><option value="1">1×</option><option value="0.5">0,5×</option></select></label><label>Instant<input aria-label="Instant de l’animation" type="range" min="0" max={duration} value={seek??Math.min(elapsed,duration)} onChange={event=>setSeek(Number(event.target.value))}/></label><button onClick={()=>setSeek(value=>Math.min(duration,(value??elapsed)+1000/60))}>Image suivante</button><label>Vie de démonstration<input type="range" min="0" max="100" step="10" value={hp} onChange={event=>setHp(Number(event.target.value))}/></label></details>}
  </section>
}
