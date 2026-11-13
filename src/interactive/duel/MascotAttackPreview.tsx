import { useRef, useState } from 'react'
import { CompetitionPortrait } from '../competition/Avatar'
import type { CompetitionAvatar } from '../competition/avatars'
import { DuelImpact } from './DuelImpact'
import { SignatureAttackArt } from './SignatureAttackArt'
import { signatureAttack } from './signature-attacks'
import { impactFor, measureFighters, type FighterPoints, type Impact } from './effects'
import type { Side } from './core'

export function MascotAttackPreview({left,right}:{left:CompetitionAvatar;right:CompetitionAvatar}) {
  const [critical,setCritical]=useState(false)
  const [preview,setPreview]=useState<{id:number;impact:Impact;points:FighterPoints}|null>(null)
  const demo=useRef<HTMLDivElement>(null)
  const play=(side:Side)=>{
    const points=measureFighters(demo.current?.querySelector('[data-demo-side="left"] .ci-competition-portrait'),demo.current?.querySelector('[data-demo-side="right"] .ci-competition-portrait'))
    const impact=impactFor({at:0,side,victim:side==='left'?'right':'left',correct:true,damage:critical?20:10,critical},{left:{avatarId:left,seat:1},right:{avatarId:right,seat:1}},'preview')
    if(points&&impact)setPreview(previous=>({id:(previous?.id??0)+1,impact,points}))
  }
  return <section className="ci-panel ci-mascot-attacks" aria-label="Attaques des mascottes"><h2>Attaques des mascottes</h2>
    <p>Chaque mascotte a sa propre attaque. Un critique enchaîne plusieurs coups lumineux ; une erreur fait tomber des objets sur celui qui s’est trompé.</p>
    <div className="ci-effect-demo" ref={demo}>{(['left','right'] as const).map((side,index)=>{
      const avatar=side==='left'?left:right
      return <div key={side} data-demo-side={side}>
        <CompetitionPortrait avatarId={avatar} seat={index+1} outcome={preview?.impact.target===side?false:preview?.impact.kind==='attack'&&preview.impact.from===side?true:undefined}/>
        <b>Joueur {index+1}</b>
        <svg className="ci-signature-sample" aria-hidden="true" viewBox="-64 -64 128 128"><SignatureAttackArt mascot={avatar}/></svg>
        <span className="ci-signature-name">{signatureAttack(avatar).label}</span>
        <button onClick={()=>play(side)} aria-label={`Attaque du joueur ${index+1}`}>Voir l’attaque</button>
      </div>
    })}</div>
    <label><input type="checkbox" checked={critical} onChange={event=>setCritical(event.target.checked)}/>Prévisualiser un critique</label>
    {preview&&<DuelImpact key={preview.id} impact={preview.impact} points={preview.points}/>}
  </section>
}
