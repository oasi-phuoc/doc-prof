import {useEffect,useLayoutEffect,useRef,useState} from 'react'
import type {MascotKind} from '../../domain/mascot'
import type {FighterPoints,Impact} from '../effects'
import {measureFighters} from '../effects'
import {contactTime,signatureFor,type Power} from './catalog'
import {makeScene,sampleAura,sampleScene} from './model'
import {paintFrame} from './renderer'
import {renderScale,adaptQuality} from './quality'
import './vfx.css'

type Props={left:MascotKind;right:MascotKind;level:Power;questionKey:string;impact?:Impact|null;elapsedMs:number;paused?:boolean;aura:boolean;selector?:string;seekMs?:number;speed?:number;simplified?:boolean}
export function DuelVfx(props:Props){
  const canvas=useRef<HTMLCanvasElement>(null),latest=useRef(props),[failed,setFailed]=useState(false),savedAura=useRef(0)
  useLayoutEffect(()=>{latest.current=props})
  useLayoutEffect(()=>{if(canvas.current)canvas.current.dataset.elapsed=String(props.elapsedMs)},[props.questionKey,props.impact?.kind,props.impact?.variation,props.elapsedMs])
  useEffect(()=>{
    const node=canvas.current;if(!node)return
    let context:CanvasRenderingContext2D|null=null
    try{context=node.getContext('2d',{alpha:true})}catch{ /* harmless fallback below */ }
    if(!context){setFailed(true);return}
    const c=context;let raf=0,disposed=false,points:FighterPoints|null=null,last=performance.now(),auraTime=savedAura.current,sceneTime=latest.current.elapsedMs,sceneKey='',previousElapsed=sceneTime,previousProps=latest.current,frames=0,density=1
    let drawFrame:((stamp:number)=>void)|undefined
    const costs:number[]=[],intervals:number[]=[]
    let viewport={width:innerWidth,height:innerHeight},clip={top:0,bottom:innerHeight},protectedBars:DOMRect[]=[],dpr=renderScale(innerWidth,innerHeight,devicePixelRatio||1)
    const measure=()=>{
      const selector=latest.current.selector??'.ci-duel-player[data-side="SIDE"] .ci-competition-portrait'
      points=measureFighters(document.querySelector(selector.replace('SIDE','left')),document.querySelector(selector.replace('SIDE','right')))
      viewport={width:innerWidth,height:innerHeight};dpr=Math.min(dpr,renderScale(innerWidth,innerHeight,devicePixelRatio||1))
      node.width=Math.round(viewport.width*dpr);node.height=Math.round(viewport.height*dpr);c.setTransform(dpr,0,0,dpr,0,0)
      const question=document.querySelector('.ci-duel-question')?.getBoundingClientRect(),cards=document.querySelector('.ci-duel-cards')?.getBoundingClientRect()
      clip={top:question?.bottom??0,bottom:cards?.top??innerHeight}
      protectedBars=Array.from(document.querySelectorAll('.ci-duel-health-row'),bar=>bar.getBoundingClientRect())
      if(drawFrame){cancelAnimationFrame(raf);raf=requestAnimationFrame(drawFrame)}
    }
    measure();const observer=new ResizeObserver(measure);observer.observe(document.documentElement)
    document.querySelectorAll('.ci-duel-player,.ci-effect-demo').forEach(element=>observer.observe(element))
    window.addEventListener('resize',measure);window.addEventListener('scroll',measure,true)
    const draw=(stamp:number)=>{
      if(disposed)return
      const start=performance.now(),p=latest.current,dt=Math.min(100,Math.max(0,stamp-last));last=stamp
      if(p!==previousProps&&p.elapsedMs!==previousElapsed){sceneTime=p.elapsedMs;previousElapsed=p.elapsedMs}
      previousProps=p
      const key=p.impact?`${p.questionKey}:${p.impact.kind}:${p.impact.target}:${p.impact.multiplier}`:p.questionKey
      if(key!==sceneKey){sceneKey=key;sceneTime=p.elapsedMs}
      if(!p.paused){auraTime+=dt;sceneTime+=dt*(p.speed??1);savedAura.current=auraTime}
      const time=p.seekMs??sceneTime,at=p.seekMs??auraTime
      c.clearRect(0,0,viewport.width,viewport.height)
      try{
        if(points){
          c.save();c.beginPath();c.rect(0,clip.top,viewport.width,Math.max(0,clip.bottom-clip.top));for(const bar of protectedBars)c.rect(bar.x,bar.y,bar.width,bar.height);c.clip('evenodd')
          const amount=p.simplified?.55:density,auraFade=p.aura?1:p.impact?Math.max(0,1-time/230):0
          if(p.level>1&&auraFade)for(const side of ['left','right'] as const)paintFrame(c,sampleAura(p[side],p.level as 2|3,at,points[side],amount),auraFade)
          if(p.impact){
            const hit=p.impact
            if(hit.kind==='timeout')for(const side of ['left','right'] as const)paintFrame(c,sampleScene(makeScene(p[side],1,p.questionKey,side,side,true,true),time,points,amount))
            else paintFrame(c,sampleScene(makeScene(hit.mascot,hit.multiplier,`${p.questionKey}:${hit.variation}`,hit.kind==='attack'?hit.from:hit.target,hit.target,hit.kind==='mistake'),time,points,amount))
          }
          c.restore()
        }
      }catch{setFailed(true);return}
      if(frames++>8){costs.push(performance.now()-start);intervals.push(dt);if(costs.length>180){costs.shift();intervals.shift()}}
      if(frames%45===0&&costs.length){
        const sorted=[...costs].sort((a,b)=>a-b),p95=sorted[Math.floor(sorted.length*.95)]!
        const frameP95=[...intervals].sort((a,b)=>a-b)[Math.floor(intervals.length*.95)]!,quality=adaptQuality({dpr,density},p95,frameP95)
        density=quality.density;if(quality.dpr!==dpr){dpr=quality.dpr;measure()}
        node.dataset.drawP95=p95.toFixed(2);node.dataset.frameP95=frameP95.toFixed(2);node.dataset.density=density.toFixed(2);node.dataset.dpr=String(dpr)
      }
      node.dataset.elapsed=Math.round(time).toString();node.dataset.frames=frames.toString()
      if(!p.paused&&p.seekMs===undefined)raf=requestAnimationFrame(draw)
    }
    drawFrame=draw
    raf=requestAnimationFrame(draw)
    return()=>{disposed=true;cancelAnimationFrame(raf);observer.disconnect();window.removeEventListener('resize',measure);window.removeEventListener('scroll',measure,true);c.clearRect(0,0,viewport.width,viewport.height)}
  },[props.selector,props.seekMs,props.paused,failed])
  const hit=props.impact,id=hit&&hit.kind!=='timeout'?hit.mascot:props.left
  if(failed)return <span className="ci-vfx-fallback" style={{borderColor:signatureFor(id).color}} aria-hidden="true" data-vfx-fallback data-theme={id}/>
  return <canvas ref={canvas} className="ci-vfx-canvas" data-vfx-engine="canvas2d-v1" data-impact-kind={hit?.kind} data-effect={id} data-multiplier={props.level} data-local={props.level===3||hit?.kind==='mistake'||hit?.kind==='timeout'||undefined} data-attacker={hit?.kind==='attack'?hit.from:undefined} data-victim={hit?.target} data-direction={hit?.kind==='attack'?props.level===3?'local':hit.from==='left'?'right':'left':undefined} data-contact={hit?.kind==='timeout'?260:contactTime(id,hit?.multiplier??props.level,hit?.kind==='mistake')} aria-hidden="true"/>
}
