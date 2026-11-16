import type {Point,FighterPoints} from '../effects'
import type {Side} from '../core'
import type {MascotKind} from '../../domain/mascot'
import type {Frame,Scene} from './model'
import {signatureFor,type Material} from './catalog'

export type EnergyBeam={origin:Point;tip:Point;startRadius:number;endRadius:number;alpha:number;color:string;light:string;phase:number;material:Material;identity:number}
const TAU=Math.PI*2,clamp=(n:number)=>Math.max(0,Math.min(1,n)),ease=(n:number)=>{const t=clamp(n);return t*t*(3-2*t)}
const frame=():Frame=>({strokes:[],glyphs:[],rings:[],volumes:[],glows:[],beams:[],contact:false,local:false})
export function energyHands(point:Point,side:Side,release=false):Point{const r=point.radius??72,dir=side==='left'?1:-1;return{x:point.x+dir*r*(release?.51:-.48),y:point.y+r*.14}}
/** The sphere is separate from the portrait so it pulses at the cupped hands. */
export function sampleChargeOrb(id:MascotKind,at:number,point:Point,side:Side,amount=1):Frame{
 const f=frame(),p=signatureFor(id),origin=energyHands(point,side),r=Math.max(18,(point.radius??72)*.3)*amount,t=at/1000
 f.glows.push({x:origin.x,y:origin.y,radius:r*2,alpha:.36,color:p.color},{x:origin.x,y:origin.y,radius:r*(.82+.12*Math.sin(t*7)),alpha:.95,color:p.light})
 for(let i=0;i<4;i++)f.rings.push({x:origin.x,y:origin.y,rx:r*(1+i*.13),ry:r*(.3+i*.12),angle:t*(i%2?-1:1)*(2+i*.4)+p.phase+i,alpha:.65,width:2,color:i%2?p.color:p.light})
 for(let i=0;i<12;i++){const a=i*TAU/12+t*(1.8+i%3*.25),rr=r*(1.25+.4*Math.sin(t*3+i));f.glyphs.push({x:origin.x+Math.cos(a)*rr,y:origin.y+Math.sin(a)*rr*.7,size:Math.max(2,r*.13),angle:a,alpha:.8,material:p.material,color:p.color,light:p.light,depth:0})}
 return f
}
/** A fourth critical is directional from the hands; a mistake reads only its owner. */
export function sampleQuadruple(s:Scene,at:number,points:FighterPoints,density=1):Frame{
 const f=frame(),t=clamp(at/s.duration),p=s.signature,owner=s.local?s.target:s.source,body=points[owner],r=Math.max(24,Math.min(body.radius??72,138))
 f.local=s.local;f.contact=at>=s.contact
 if(at<0||at>=s.duration)return f
 if(t<.28){const charge=sampleChargeOrb(p.id,at,body,owner,.72+ease(t/.28)*.55);return{...charge,local:s.local,contact:false}}
 const fade=1-ease((t-.81)/.19)
 if(s.local){
  const u=ease((t-.28)/.34),origin=energyHands(body,owner),x=origin.x+(body.x-origin.x)*u,y=origin.y+(body.y-origin.y)*u,rr=r*(.45*(1-u)+.03)
  f.glows.push({x,y,radius:rr*2,alpha:.8*fade,color:p.light})
  for(let i=0;i<Math.round(34*density);i++){const a=i*TAU/17+t*19+Math.floor(i/17),radius=r*(1-u)*(1+i%3*.18);f.glyphs.push({x:x+Math.cos(a)*radius,y:y+Math.sin(a)*radius*.8,size:3+r*.06*(1-u),angle:a,alpha:fade,material:p.material,color:p.color,light:p.light,depth:0})}
  for(let i=0;i<3;i++)f.rings.push({x,y,rx:rr*(1+i*.3),ry:rr*(.6+i*.2),angle:t*10+i,alpha:fade,width:3,color:p.color})
 }else{
  const origin=energyHands(body,owner,true),target=points[s.target],progress=ease((t-.28)/.34),tip={x:origin.x+(target.x-origin.x)*progress,y:origin.y+(target.y-origin.y)*progress}
  f.beams!.push({origin,tip,startRadius:r*.1,endRadius:r*(.15+.65*progress),alpha:fade,color:p.color,light:p.light,phase:at/1000*8+p.phase,material:p.material,identity:p.phase})
  f.glows.push({x:origin.x,y:origin.y,radius:r*.5,alpha:.6*fade,color:p.light})
  const dx=tip.x-origin.x,dy=tip.y-origin.y,length=Math.hypot(dx,dy)||1,nx=-dy/length,ny=dx/length
  for(let i=0;i<Math.round(42*density);i++){const u=((i*.618+at/850)%1),a=u*TAU*3+at/120+p.phase,spread=r*(.08+.56*u)*Math.sin(a);f.glyphs.push({x:origin.x+dx*u+nx*spread,y:origin.y+dy*u+ny*spread,size:r*(.035+u*.035),angle:Math.atan2(dy,dx)+a,alpha:fade*.8,material:p.material,color:p.color,light:p.light,depth:0})}
 }
 const hit=(at-s.contact)/650
 if(hit>=0&&hit<1){const target=points[s.target],spread=r*(.15+ease(hit)*1.2),alpha=(1-hit)**2;f.glows.push({x:target.x,y:target.y,radius:spread,alpha:alpha*.9,color:p.light});for(let i=0;i<4;i++)f.rings.push({x:target.x,y:target.y,rx:spread*(.5+i*.25),ry:spread*(.5+i*.12),angle:i*.65,alpha:alpha*.7,width:3,color:p.color})}
 return f
}
export function sampleQuadAura(id:MascotKind,at:number,point:Point,density=1):Frame{
 const f=frame(),p=signatureFor(id),r=Math.max(24,Math.min(point.radius??72,138)),t=at/1000
 for(let i=0;i<3;i++)f.rings.push({x:point.x,y:point.y,rx:r*(1.1+i*.12),ry:r*(.35+i*.55),angle:t*(i%2?-1:1)+p.phase+i,alpha:.4,width:2.5,color:i%2?p.light:p.color})
 for(let i=0;i<Math.round(64*density);i++){const q=i/64,a=q*TAU+t*(i%2?1.6:-1.9)+p.phase,x=point.x+Math.cos(a)*r*(1.15+.18*Math.sin(t*3+q*10)),y=point.y+Math.sin(a)*r*1.65;f.glyphs.push({x,y,size:r*(.025+.025*(i%3)),angle:a,alpha:.3+.35*Math.sin(a)**2,material:p.material,color:p.color,light:p.light,depth:Math.sin(a)})}
 f.glows.push({x:point.x,y:point.y,radius:r*1.5,alpha:.13+.035*Math.sin(t*8),color:p.color});return f
}
