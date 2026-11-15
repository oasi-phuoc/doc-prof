// Developer laboratory, imported directly by browser proofs; never in a product route.
import {MASCOTS} from '../../domain/mascot'
import {SIGNATURES,type Power} from './catalog'
import {makeScene,sampleScene,sampleAura} from './model'
import {paintFrame} from './renderer'
import {combatFrame} from '../combat-portraits'
import {renderScale,adaptQuality} from './quality'

const stylesheet=`body{margin:16px;background:#14243b;color:#f5f5ff;font:15px system-ui}h1{font-size:24px;margin:8px}section{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin:10px 0}figure{margin:0;background:#1c304c;border:1px solid #385273;border-radius:12px;overflow:hidden}canvas{width:100%;display:block}figcaption{padding:5px 9px;font-size:12px}.poses{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.pose{clip-path:inset(3%);width:220px;height:220px;position:relative;overflow:hidden;margin:auto}.pose img{position:absolute;width:400%;height:600%;max-width:none}.rowtitle{margin-top:12px;font-weight:700}`
export function setup(){document.head.insertAdjacentHTML('beforeend',`<style>${stylesheet}</style>`);document.body.innerHTML='<h1>Atelier des signatures</h1>'}
export function gallery(group:number,level:Power,auras=false){
 setup()
 for(const p of SIGNATURES.slice(group*6,group*6+6)){
  const label=document.createElement('div');label.className='rowtitle';label.textContent=`${p.id} · ${level===1?'Normal':`×${level}`} · ${p[level===1?'normal':level===2?'double':'triple']}`;document.body.append(label)
  const section=document.createElement('section');document.body.append(section)
  const scene=makeScene(p.id,level,'review-20261115','left','right')
  for(const ratio of [0,.2,.5,.8,.95]){
   const figure=document.createElement('figure'),canvas=document.createElement('canvas');canvas.width=256;canvas.height=145;figure.append(canvas);const caption=document.createElement('figcaption');caption.textContent=auras?`${Math.round(1000+ratio*120000)} ms`:`${Math.round(ratio*100)} %`;figure.append(caption);section.append(figure)
   const context=canvas.getContext('2d')!,points={left:{x:40,y:75,radius:31},right:{x:190,y:75,radius:40}}
   context.fillStyle='#ffffff08';context.beginPath();context.arc(190,75,40,0,Math.PI*2);context.fill()
   if(auras)paintFrame(context,sampleAura(p.id,level as 2|3,1000+ratio*120000,points.right))
   else paintFrame(context,sampleScene(scene,ratio*scene.duration,points))
  }
 }
}
export async function poses(group:number){
 setup()
 for(const p of MASCOTS.slice(group*6,group*6+6)){
  const label=document.createElement('p');label.textContent=p.label;document.body.append(label)
  const row=document.createElement('div');row.className='poses';document.body.append(row)
  for(const state of ['tired','critical-tired','victory','defeat'] as const){const frame=combatFrame(p.id,state),figure=document.createElement('figure'),holder=document.createElement('div');holder.className='pose';const img=new Image();img.src=frame.src;img.style.left=`${-frame.column*100}%`;img.style.top=`${-frame.row*100}%`;holder.append(img);figure.append(holder);const caption=document.createElement('figcaption');caption.textContent=state;figure.append(caption);row.append(figure);await img.decode()}
 }
}
export async function benchmark(width:number,height:number,duration=3500){
 setup();const canvas=document.createElement('canvas');let dpr=renderScale(width,height,devicePixelRatio),density=1;canvas.width=width*dpr;canvas.height=height*dpr;canvas.style.width=`${width}px`;canvas.style.height=`${height}px`;document.body.append(canvas);const c=canvas.getContext('2d')!;c.scale(dpr,dpr)
 const costs:number[]=[],intervals:number[]=[],points={left:{x:width*.25,y:height*.5,radius:Math.min(138,width*.18)},right:{x:width*.75,y:height*.5,radius:Math.min(138,width*.18)}}
 let first=0,last=0,frames=0
 await new Promise<void>(resolve=>{const loop=(at:number)=>{first||=at;if(at-first>duration){resolve();return}const start=performance.now();c.clearRect(0,0,width,height);const id=SIGNATURES[Math.floor((at-first)/500)%SIGNATURES.length]!.id
  paintFrame(c,sampleAura('kitsune',3,at-first,points.left,density));paintFrame(c,sampleAura('koi',3,at-first,points.right,density));const scene=makeScene(id,3,'benchmark','left','right');paintFrame(c,sampleScene(scene,(at-first)%scene.duration,points,density))
  if(frames++>8){costs.push(performance.now()-start);intervals.push(at-last)}
  if(frames%45===0&&costs.length){const costsSorted=[...costs].sort((a,b)=>a-b),intervalSorted=[...intervals].sort((a,b)=>a-b),quality=adaptQuality({dpr,density},costsSorted[Math.floor(costsSorted.length*.95)]!,intervalSorted[Math.floor(intervalSorted.length*.95)]!);density=quality.density;if(quality.dpr!==dpr){dpr=quality.dpr;canvas.width=width*dpr;canvas.height=height*dpr;c.setTransform(dpr,0,0,dpr,0,0)}}
  last=at;requestAnimationFrame(loop)};requestAnimationFrame(loop)})
 costs.sort((a,b)=>a-b);intervals.sort((a,b)=>a-b)
 return{width,height,dpr,density,frames,drawP95:costs[Math.floor(costs.length*.95)],frameP95:intervals[Math.floor(intervals.length*.95)],drawMean:costs.reduce((a,b)=>a+b,0)/costs.length,renderer:'Canvas2D Chromium software/headless, not physical phone hardware'}
}
export async function film(id:string){
 setup();const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=560;document.body.append(canvas);const c=canvas.getContext('2d')!,p=SIGNATURES.find(s=>s.id===id)!
 const scenes=([1,2,3] as const).map(level=>makeScene(p.id,level,'material-video','left','right')),total=scenes.reduce((sum,s)=>sum+s.duration+300,0)
 const stream=canvas.captureStream(30),recorder=new MediaRecorder(stream,{mimeType:'video/webm;codecs=vp9'}),chunks:Blob[]=[];recorder.ondataavailable=e=>chunks.push(e.data)
 const done=new Promise<string>(resolve=>{recorder.onstop=()=>{const blob=new Blob(chunks,{type:'video/webm'}),reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.readAsDataURL(blob)}});recorder.start()
 await new Promise<void>(resolve=>{let start=0;const draw=(at:number)=>{start||=at;const t=at-start;c.fillStyle='#14243b';c.fillRect(0,0,1024,560);let offset=0
  for(const scene of scenes){if(t>=offset&&t<offset+scene.duration+300){c.fillStyle='#eef7ff';c.font='24px system-ui';c.fillText(`${p.id} · ${scene.level===1?'Normal':`×${scene.level}`}`,28,40);paintFrame(c,sampleScene(scene,t-offset,{left:{x:220,y:285,radius:120},right:{x:760,y:285,radius:138}}));break}offset+=scene.duration+300}
  if(t<total)requestAnimationFrame(draw);else resolve()};requestAnimationFrame(draw)})
 recorder.stop();stream.getTracks().forEach(track=>track.stop());return done
}
