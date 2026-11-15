import {hash} from '../../domain/seeds'
import type {MascotKind} from '../../domain/mascot'
import type {Point,FighterPoints} from '../effects'
import type {Side} from '../core'
import {signatureFor,sceneDuration,contactTime,SUPER_AURA_COLORS,type Power,type Material,type Signature} from './catalog'

const TAU=Math.PI*2
export const clamp=(x:number,min=0,max=1)=>Math.max(min,Math.min(max,x))
const ease=(x:number)=>{const t=clamp(x);return t*t*(3-2*t)}
const fract=(x:number)=>x-Math.floor(x)
const rand=(seed:number,i:number)=>fract(Math.sin(seed*.0001+i*127.1)*43758.5453)
export type Scene={signature:Signature;level:Power;seed:number;source:Side;target:Side;local:boolean;timeout:boolean;duration:number;contact:number}
export function makeScene(id:MascotKind,level:Power,seed:string,source:Side,target:Side,local=false,timeout=false):Scene{
  return{signature:signatureFor(id),level,seed:hash(seed),source,target,local:local||level===3||timeout,timeout,duration:sceneDuration(id,level,timeout),contact:timeout?260:contactTime(id,level,local)}
}
export type Stroke={points:Point[];width:number;alpha:number;color:string;light:string}
export type Glyph={x:number;y:number;size:number;angle:number;alpha:number;material:Material;color:string;light:string;depth:number}
export type Ring={x:number;y:number;rx:number;ry:number;angle:number;alpha:number;width:number;color:string}
export type Volume={x:number;y:number;radius:number;height:number;phase:number;alpha:number;material:Material;color:string;light:string}
export type Frame={strokes:Stroke[];glyphs:Glyph[];rings:Ring[];volumes:Volume[];glows:{x:number;y:number;radius:number;alpha:number;color:string}[];contact:boolean;local:boolean}
const empty=():Frame=>({strokes:[],glyphs:[],rings:[],volumes:[],glows:[],contact:false,local:false})
function flight(s:Scene,progress:number,lane:number,points:FighterPoints):Point {
  const a=points[s.source],b=points[s.target],u=clamp(progress),dir=Math.sign(b.x-a.x)||1,r=Math.min(b.radius??72,110),phase=s.signature.phase
  const arc=Math.sin(u*Math.PI),double=s.level===2,d=double?(lane%2?1:-1):1
  let x=a.x+(b.x-a.x)*u,y=a.y+(b.y-a.y)*u
  const jitter=(rand(s.seed,lane)-.5)*r*.6
  y+=jitter*arc
  switch(s.signature.id){
    case 'leaf':y+=Math.sin(u*TAU*1.4+lane)*r*.36*arc*d;x+=Math.sin(u*TAU)*12*arc;break
    case 'owl':y-=arc*r*(double?1.1:.65);y+=Math.sin(u*TAU*3+lane)*9*arc;break
    case 'octopus':y+=Math.sin(u*TAU*(double?2:1)+lane*Math.PI)*r*.43*arc;break
    case 'hedgehog':y-=arc*r*(.3+lane*.32);break
    case 'rabbit':y-=Math.abs(Math.sin(u*Math.PI*(double?3:2)))*r*.7;break
    case 'dragon':y+=Math.sin(u*TAU*1.5+lane*Math.PI)*r*.33*arc;break
    case 'rat':y-=Math.abs(Math.sin(u*Math.PI*(double?3:1)))*r*.8;break
    case 'ox':y+=r*.62*arc-Math.abs(Math.sin(u*TAU*2))*r*.12*arc;break
    case 'tiger':y+=(lane-1)*r*.3*arc-d*arc*r*.35;break
    case 'snake':y+=Math.sin(u*TAU*2.5+lane*Math.PI)*r*.48*arc;break
    case 'horse':y-=arc*r*.65;y+=Math.sin(u*TAU*2+lane)*r*.12*arc;break
    case 'goat':y-=arc*r*.35;x+=Math.sin(u*TAU*2+lane)*18*arc;break
    case 'monkey':y-=Math.abs(Math.sin(u*Math.PI*(double?3:1)))*r*(.55+lane*.1);x+=Math.sin(u*TAU)*dir*18*arc;break
    case 'rooster':y+=Math.sin(u*Math.PI+lane)*r*.55*arc*d;break
    case 'dog':y-=Math.abs(Math.sin(u*Math.PI*(double?4:2)))*r*.5;break
    case 'boar':y+=r*.6*arc+Math.sin(u*TAU*2+lane)*r*.1*arc;break
    case 'panda':y-=Math.sin(u*Math.PI)*r*.8*d;x+=Math.sin(u*Math.PI)*dir*15;break
    case 'fox':y+=Math.sin(u*TAU*(double?2:1)+lane*TAU/3)*r*.48*arc;break
    case 'tanuki':y+=Math.sin(u*TAU*1.5+lane*Math.PI)*r*.25*arc+r*.25*arc;break
    case 'otter':y+=Math.sin(u*TAU*1.8+lane*Math.PI)*r*.55*arc;break
    case 'koala':y-=arc*r*(.65+lane*.25);y+=Math.sin(u*TAU)*r*.2*arc;break
    case 'turtle':y+=arc*r*.22*d;break
    case 'axolotl':y-=arc*r*(.35+lane*.35);break
    case 'leopard':y+=(lane-1)*r*.27*arc-arc*r*.4*d;break
    case 'crane':y-=arc*r*(.75+Math.sin(u*TAU+lane)*.4);break
    case 'cat':y+=Math.sin(u*TAU*(double?2:1)+lane*TAU/3)*r*.43*arc;break
    case 'koi':y+=Math.sin(u*TAU*1.2+lane*Math.PI)*r*.32*arc;break
    case 'red-panda':y+=Math.sin(u*TAU*1.6+lane*Math.PI)*r*.55*arc;break
    case 'penguin':y+=arc*r*.47*d;break
    case 'kitsune':y+=Math.sin(u*TAU*2+lane*Math.PI)*r*.52*arc;x+=Math.cos(u*TAU*2+phase)*12*arc;break
  }
  return{x,y}
}
function laneCount(s:Scene){if(s.level===2)return ['tiger','leopard','rooster','panda'].includes(s.signature.id)?6:['fox','axolotl','cat','rat','monkey'].includes(s.signature.id)?3:2;return ['tiger','leopard','hedgehog'].includes(s.signature.id)?3:s.signature.id==='rabbit'?2:1}
function laneTiming(s:Scene,i:number){const stagger=s.level===2?(s.signature.id==='panda'?.085:.045)*i:0;return{start:.08+stagger,end:.63+stagger}}

function localMotion(s:Scene,i:number,count:number,t:number,r:number){
  const p=s.signature,phase=p.phase,turn=t*TAU*(1.1+s.level*.25)
  const charge=ease(t/.48),release=1-ease((t-.58)/.32),grow=p.id==='kitsune'||p.id==='goat'||p.id==='koi',base=grow?(.13+.85*charge)*release:(1-.83*ease((t-.28)/.43))*release
  const q=i/count,noise=rand(s.seed,i),layer=i%4,a=q*TAU*(p.id==='kitsune'?3:2)+turn*(layer%2?1:-1)+phase
  let radius=r*base*(.48+noise*.5),x=Math.cos(a)*radius,y=Math.sin(a)*radius*.53,z=Math.sin(a)
  switch(p.id){
    case 'leaf':case 'crane':radius*=layer%2?1:.7;x=Math.cos(a)*radius;y=Math.sin(a)*radius*.6;break
    case 'owl':x=Math.cos(a)*radius;y=Math.sin(a)*radius;break
    case 'octopus':x=Math.cos(a)*radius*(1+.2*Math.sin(turn+layer));y=Math.sin(a)*radius*.75;break
    case 'hedgehog':case 'tiger':x=Math.cos(q*TAU)*radius;y=Math.sin(q*TAU)*radius;break
    case 'rabbit':x=Math.cos(a)*radius;y=Math.sin(a)*radius*.55-Math.abs(Math.sin(turn*2+q*TAU))*r*.18;break
    case 'dragon':x=Math.cos(a)*radius;y=(noise-.5)*r*1.5*release+Math.sin(a)*radius*.35;break
    case 'rat':x=Math.cos(a)*radius;y=Math.sin(a)*radius*.6-Math.abs(Math.sin(turn+layer))*r*.2;break
    case 'ox':y=r*.55+Math.sin(a)*radius*.25-Math.abs(Math.sin(turn+q*9))*r*.35;break
    case 'snake':x=Math.cos(a)*radius;y=(q-.5)*r*1.8*release;break
    case 'horse':x=Math.cos(a)*radius;y=Math.sin(a)*radius*.8;break
    case 'goat':x=Math.cos(a)*(r*(.25+noise*.65))*base;y=(noise-.5)*r*1.6*release+Math.sin(a)*r*.17;break
    case 'monkey':y=Math.sin(a)*radius-Math.abs(Math.sin(turn+layer))*r*.18;break
    case 'rooster':x=Math.cos(q*TAU)*radius;y=Math.sin(q*TAU)*radius;break
    case 'dog':y=Math.sin(a)*radius*.65-Math.abs(Math.sin(turn+q*6))*r*.12;break
    case 'boar':x=Math.cos(a)*radius;y=r*(layer%2?.15:.55)+Math.sin(a)*radius*.23;break
    case 'panda':x=Math.cos(q*TAU)*radius;y=Math.sin(q*TAU)*radius*.6;break
    case 'fox':x=Math.cos(a+Math.sin(turn+layer)*.5)*radius;y=Math.sin(a)*radius*.65;break
    case 'tanuki':y=r*.25+Math.sin(a)*radius*.3;break
    case 'otter':x*=1+.16*Math.sin(turn+layer);y*=1+.25*Math.cos(turn*2+layer);break
    case 'koala':x=Math.cos(a)*radius;y=Math.sin(a)*radius*.8;break
    case 'turtle':x=Math.cos(a)*radius;y=Math.sin(a)*radius*.45;break
    case 'axolotl':x=Math.cos(q*TAU+turn*.2)*radius;y=Math.sin(q*TAU+turn*.2)*radius*.7;break
    case 'leopard':x=Math.cos(q*TAU)*radius;y=Math.sin(q*TAU)*radius;break
    case 'cat':x=Math.cos(a)*radius;y=Math.sin(a)*radius*.6;break
    case 'koi':x=Math.cos(a)*r*(.25+noise*.55)*base;y=(noise-.5)*r*1.7*release+Math.sin(a)*r*.16;break
    case 'red-panda':x=Math.cos(a)*radius;y=Math.sin(a)*radius*.4+(layer-1.5)*r*.18;break
    case 'penguin':x=Math.cos(a)*radius;y=Math.sin(a)*radius*.4;break
    case 'kitsune':x=Math.cos(a)*r*(.2+noise*.65)*base;y=(noise-.5)*r*1.9*base+Math.sin(a)*r*.19;break
  }
  if(s.local&&s.level<3){y-=r*(1-charge)*.7;x*=.75} // a local signature backfires onto its owner
  return{x,y,a,noise,z,release}
}

/** Large readable signature gestures sit above the finer material simulation. */
function localSignature(f:Frame,s:Scene,t:number,target:Point,r:number,alpha:number){
  const p=s.signature,turn=t*TAU,fade=1-ease((t-.67)/.25),charge=ease(t/.4),radius=r*(1-.78*ease((t-.3)/.4)),x=target.x,y=target.y
  const glyph=(xx:number,yy:number,size:number,angle:number,material=p.material,a=alpha*fade)=>f.glyphs.push({x:xx,y:yy,size,angle,material,alpha:a,color:p.color,light:p.light,depth:2})
  const stroke=(points:Point[],width:number,a=alpha*fade)=>f.strokes.push({points,width,alpha:a,color:p.color,light:p.light})
  const ring=(rx:number,ry:number,offset=0)=>f.rings.push({x,y:y+offset,rx,ry,angle:0,width:Math.max(1,r*.035),alpha:alpha*fade,color:p.color})
  const orbit=(count:number,material=p.material,ellipticity=.65)=>{for(let i=0;i<count;i++){const a=i*TAU/count+turn;glyph(x+Math.cos(a)*radius,y+Math.sin(a)*radius*ellipticity,r*.12,a,material)}}
  const helix=(count:number,loops:number,height:number)=>{for(let lane=0;lane<count;lane++){const pts:Point[]=[];for(let j=0;j<40;j++){const q=j/39,a=q*TAU*loops+turn*2+lane*TAU/count;pts.push({x:x+Math.cos(a)*radius*.65,y:y+(q-.5)*height+Math.sin(a)*r*.08})}stroke(pts,r*.04)}}
  const radial=(count:number,curve:number)=>{for(let i=0;i<count;i++){const a=i*TAU/count+p.phase,pts:Point[]=[];for(let j=0;j<18;j++){const q=j/17,b=a+q*curve;pts.push({x:x+Math.cos(b)*radius*(1-q*.85),y:y+Math.sin(b)*radius*(1-q*.85)})}stroke(pts,r*.026,alpha*fade*(.5+.5*Math.sin(turn*3+i)**2))}}
  switch(p.id){
    case 'leaf':orbit(12);ring(radius*.75,radius*.4,-r*.18);break
    case 'owl':orbit(8);glyph(x,y,r*.33*charge,turn*.3,'moon');break
    case 'octopus':for(let i=0;i<6;i++){const a=i*TAU/6+turn;glyph(x+Math.cos(a)*radius*.7,y+Math.sin(a)*radius*.5,r*(.12+.08*charge),a,'ink')}break
    case 'hedgehog':radial(16,-.12);break
    case 'rabbit':orbit(3,'moon');ring(radius,radius*.55);break
    case 'dragon':helix(2,1.4,r*1.4*fade);break
    case 'rat':orbit(12,'cheese');break
    case 'ox':ring(radius,radius*.25,r*.55);ring(radius*.7,radius*.18,r*.5);break
    case 'tiger':radial(12,.6);break
    case 'snake':helix(2,1.7,r*1.5*fade);break
    case 'horse': {
      const stars=Array.from({length:5},(_,i)=>({x:x+Math.cos(i*TAU/5+turn*.3)*radius,y:y+Math.sin(i*TAU/5+turn*.3)*radius*.8}));stroke([...stars,stars[0]!],r*.015);stars.forEach(pt=>glyph(pt.x,pt.y,r*.13,turn,'star'));break
    }
    case 'goat':ring(r*.35*charge,r*.1,r*.65);break
    case 'monkey':orbit(3,'banana',.8);break
    case 'rooster':radial(12,-.45);glyph(x,y,r*.23,turn*.4,'sun');break
    case 'dog':orbit(8,'paw');if(t>.55)glyph(x,y,r*.3*charge,0,'paw');break
    case 'boar':ring(radius,radius*.2,r*.1);ring(radius*.9,radius*.15,r*.5);break
    case 'panda':for(let i=0;i<7;i++){const a=i*TAU/7,xx=x+Math.cos(a)*radius*.8,yy=y+Math.sin(a)*radius*.5;glyph(xx,yy,r*.24,a-Math.PI/2+(charge-.5)*.4,'bamboo')}break
    case 'fox':for(let i=0;i<3;i++){const a=i*TAU/3+turn*1.5,pts:Point[]=[];for(let j=0;j<22;j++){const aa=a-j*.045;pts.push({x:x+Math.cos(aa+Math.sin(turn+i)*.25)*radius,y:y+Math.sin(aa)*radius*.7})}stroke(pts,r*.1);glyph(pts[0]!.x,pts[0]!.y,r*.16,a,'wisp')}break
    case 'tanuki':ring(radius,radius*.28,r*.24);orbit(9,'leaf',.35);break
    case 'otter':for(let i=0;i<12;i++){const a=i*TAU/12+turn;glyph(x+Math.cos(a)*radius,y+Math.sin(a)*radius*.6,r*(.055+i%3*.035),a,'bubble')}break
    case 'koala':orbit(8,'leaf',.85);radial(4,.2);break
    case 'turtle':ring(radius,radius*.5);ring(radius*.7,radius*.35);{const pts=Array.from({length:7},(_,i)=>({x:x+Math.cos(i*TAU/6)*r*.25*charge,y:y+Math.sin(i*TAU/6)*r*.2*charge}));stroke(pts,r*.02)}break
    case 'axolotl':for(let i=0;i<8;i++){const a=i*TAU/8+turn*.3,pts:Point[]=[];for(let j=0;j<18;j++){const aa=a-j*.025,rr=radius+j*r*.007;pts.push({x:x+Math.cos(aa)*rr,y:y+Math.sin(aa)*rr*.7})}stroke(pts,r*.045);glyph(pts[0]!.x,pts[0]!.y,r*.13,a,'star')}break
    case 'leopard':radial(6,0);for(let i=0;i<6;i++){const a=i*TAU/6;glyph(x+Math.cos(a)*radius*.6,y+Math.sin(a)*radius*.6,r*.16,a,'ice')}break
    case 'crane':for(let i=0;i<12;i++){const a=i*TAU/6+(i<6?turn:-turn);glyph(x+Math.cos(a)*radius*(i<6?1:.75),y+Math.sin(a)*radius*.6,r*.13,a,'feather')}break
    case 'cat':orbit(8,'coin');if(t>.5)glyph(x,y,r*.25,turn,'paw');break
    case 'koi':ring(r*.4*charge,r*.13,r*.6);break
    case 'red-panda':for(let i=0;i<16;i++){const a=i*TAU/8+(i<8?turn:-turn);glyph(x+Math.cos(a)*radius*.8,y+Math.sin(a)*radius*.4+(i<8?-.23:.23)*r,r*.1,a,'leaf')}break
    case 'penguin':for(let i=0;i<2;i++){const pts:Point[]=[];for(let j=0;j<32;j++){const a=j/31*TAU*.8+turn*(i?-1:1);pts.push({x:x+Math.cos(a)*radius*(i?.75:1),y:y+Math.sin(a)*radius*.45})}stroke(pts,r*.035);glyph(pts[0]!.x,pts[0]!.y,r*.13,turn,'ice')}break
    case 'kitsune':if(t>.48&&t<.8)helix(2,1.8,r*1.5*fade);break
  }
}

/** Pure time sampling. Reconstructs actual earlier head positions, never a pre-drawn trail. */
export function sampleScene(s:Scene,at:number,points:FighterPoints,density=1):Frame {
  const f=empty(),t=clamp(at/s.duration),p=s.signature,target=points[s.target],r=Math.max(24,Math.min(target.radius??72,138)),phase=p.phase
  f.local=s.local;f.contact=at>=s.contact
  if(at<0||at>=s.duration)return f
  const envelope=Math.min(ease(t/.09),1-ease((t-.82)/.18))
  const color=p.color,light=p.light
  const glyph=(x:number,y:number,size:number,angle:number,alpha:number,depth=0,material=p.material)=>f.glyphs.push({x,y,size,angle,alpha:clamp(alpha),material,color,light,depth})
  const ring=(x:number,y:number,rx:number,ry:number,alpha:number,angle=0)=>f.rings.push({x,y,rx,ry,angle,alpha:clamp(alpha),width:Math.max(1,r*.025),color})
  if(s.timeout){
    const burst=ease(t/.28),fade=1-ease((t-.35)/.65)
    for(let i=0;i<12;i++){const a=i*TAU/12;glyph(target.x+Math.cos(a)*r*burst*.6,target.y+Math.sin(a)*r*burst*.5,4,0,fade*.6,i,'cloud')}
    ring(target.x,target.y,r*(.25+burst*.5),r*.25,fade*.4);return f
  }
  if(s.local){
    // All triple/backfire geometry uses the victim only. No source coordinate is read here.
    const charge=ease(t/.48),release=1-ease((t-.58)/.32),grow=p.id==='kitsune'||p.id==='goat'||p.id==='koi',base=grow?(.13+.85*charge)*release:(1-.83*ease((t-.28)/.43))*release
    const count=Math.round((s.level===3?90:48)*density),turn=t*TAU*(1.1+s.level*.25)
    for(let i=0;i<count;i++){
      const {x,y,a,noise,z}=localMotion(s,i,count,t,r)
      const size=r*(.025+noise*(p.material==='rock'?.09:.055))
      glyph(target.x+x,target.y+y,size*(.65+.35*release),a+noise*TAU,envelope*(.4+.6*(z+1)/2),z)
      if(['fire','water','star','wisp','ribbon'].includes(p.material)&&i%3===0){
        const trail:Point[]=[];for(let j=0;j<10;j++){const earlier=Math.max(0,t-j*.008),past=localMotion(s,i,count,earlier,r);trail.push({x:target.x+past.x,y:target.y+past.y})}
        f.strokes.push({points:trail,width:size*.65,alpha:envelope*.3,color,light})
      }
    }
    if(['goat','koi','kitsune','boar'].includes(p.id))for(let h=0;h<6;h++){
      const rr=r*(.27+h*.095)*base;ring(target.x,target.y+(h-2.5)*r*.21*release,rr,rr*.28,envelope*.35,Math.sin(turn+h)*.12)
    }
    if(['goat','koi','kitsune'].includes(p.id))f.volumes.push({x:target.x,y:target.y,radius:r*.86*base,height:r*(p.id==='kitsune'?1.85:1.6)*base,phase:turn,alpha:envelope*.85,material:p.material,color,light})
    localSignature(f,s,t,target,r*(s.level===3?1:.72),envelope*.8)
  }else{
    const lanes=laneCount(s)
    for(let lane=0;lane<lanes;lane++){
      const timing=laneTiming(s,lane),u=(t-timing.start)/(timing.end-timing.start)
      const head=flight(s,u,lane,points),tail=.25,fade=1-ease((t-timing.end)/.24)
      if(u<0||t>timing.end+.25)continue
      const trail:Point[]=[];const samples=Math.round(24+20*density)
      for(let j=0;j<samples;j++){const historic=u-j/(samples-1)*tail;if(historic<0||historic>1)continue;trail.push(flight(s,historic,lane,points))}
      const flowing=['fire','water','ink','ribbon','wisp','star','ice','cloud'].includes(p.material)
      if(flowing&&trail.length>1)f.strokes.push({points:trail,width:r*(p.material==='water'?.25:p.material==='cloud'?.2:.12),alpha:fade*.8,color,light})
      const before=flight(s,u-.01,lane,points),after=flight(s,u+.01,lane,points),heading=Math.atan2(after.y-before.y,after.x-before.x)
      const spin=['leaf','moon','cheese','rock','banana','coin','star','paw','bamboo'].includes(p.material)?u*TAU*(p.material==='coin'?3:1)+phase:0
      if(u<=1)glyph(head.x,head.y,r*(flowing?.2:.27),heading+spin,fade,lane)
      const n=Math.round((s.level===2?18:32)*density)
      for(let i=0;i<n;i++){
        const lag=rand(s.seed,i+lane*101)*.38,pu=u-lag;if(pu<0||pu>1)continue
        const pos=flight(s,pu,lane,points),noise=rand(s.seed,i*7+lane),age=clamp(lag/.38),spread=(noise-.5)*r*(flowing?.45:.6)*age
        const lift=['leaf','feather'].includes(p.material)?Math.sin(t*11+i)*r*.15:0
        glyph(pos.x+spread,pos.y+spread+lift+(p.material==='rock'?age*age*r*.7:0),r*(flowing?.028:.06)*(1-age*.65)+2,t*(2+noise*3)+i,fade*(1-age)*.8,noise)
      }
      if(p.id==='goat'||p.id==='kitsune'){
        for(let h=0;h<7;h++){const a=t*TAU*(2+h*.12)+h,rr=r*(.1+h*.025);ring(head.x+Math.cos(a)*rr*.2,head.y+(h-3)*r*.09,rr,rr*.3,fade*.5,Math.sin(a)*.15)}
        if(u<1)f.volumes.push({x:head.x,y:head.y,radius:r*.32,height:r*.75,phase:t*TAU*3+lane,alpha:fade*.85,material:p.material,color,light})
      }
      if(p.id==='panda'&&u<1)for(let k=0;k<3;k++)glyph(head.x+(k-1)*12,head.y-(k-1)*14,r*.2,u*2+(k-1)*.4,fade,k,'bamboo')
      if(p.id==='rooster'&&u<1)for(let k=0;k<8;k++){const a=k*TAU/8+t;ring(head.x+Math.cos(a)*r*.15,head.y+Math.sin(a)*r*.15,r*.3,r*.05,fade*.25,a)}
    }
  }
  const shock=(at-s.contact)/440
  if(shock>=0&&shock<1){
    const fade=(1-shock)**2,scale=r*(.15+shock*.8)
    f.glows.push({x:target.x,y:target.y,radius:scale,alpha:fade*.65,color:light})
    ring(target.x,target.y,scale,scale*.6,fade*.6)
    for(let i=0;i<Math.round(18*density);i++){const a=i*TAU/18+phase;glyph(target.x+Math.cos(a)*scale,target.y+Math.sin(a)*scale*.7,3+fade*4,a,fade,i)}
  }
  f.glyphs.sort((a,b)=>a.depth-b.depth)
  return f
}

/** Periodic by construction, so two minutes or a seek do not exhaust an aura. */
export function sampleAura(id:MascotKind,level:2|3,at:number,point:Point,density=1):Frame{
  const base=signatureFor(id),p=level===3?{...base,color:SUPER_AURA_COLORS[id]}:base,f=empty(),r=(point.radius??72)*(level===3?1.38:1.06),t=at/1000,n=Math.round((level===3?42:26)*density),phase=p.phase
  for(let i=0;i<n;i++){
    const q=i/n,a=q*TAU+t*(.45+(i%4)*.18)*(i%2?1:-1)+phase,lift=fract(q+t*(.12+(i%3)*.015)),depth=Math.sin(a)
    let x=Math.cos(a)*r*(.78+.18*Math.sin(t+q*9)),y=Math.sin(a)*r*.28-r*.18
    if(['fire','cloud','dust','water'].includes(p.material)){x=Math.cos(a)*r*(.3+lift*.65);y=r*.65-lift*r*1.9+Math.sin(a)*r*.13}
    else if(['leaf','feather','quill','bamboo'].includes(p.material)){y=r*.8-lift*r*1.8+Math.sin(a)*r*.15}
    else if(['star','moon','coin','paw'].includes(p.material)){y=Math.sin(a)*r*.83}
    else if(p.material==='ribbon'){x=Math.cos(a)*r*.75;y=r*.8-lift*r*1.8}
    // Species-specific circulation, including different depth and lift for shared materials.
    switch(id){
      case 'leaf':if(level===3){x=Math.cos(a)*r*(i%2?.95:.72);y=Math.sin(a)*r*.43+(i%2?-.2:.2)*r}break
      case 'owl':y=Math.sin(a)*r*.88;x=Math.cos(a)*r*(level===3?1:.8);break
      case 'octopus':x*=1+.14*Math.sin(t*1.8+i);y+=Math.sin(t*2+q*12)*r*.1;break
      case 'hedgehog':x=Math.cos(q*TAU)*r*(.82+.09*Math.sin(t*3+i));y=Math.sin(q*TAU)*r*.8;break
      case 'rabbit':y=Math.sin(a)*r*.7-Math.abs(Math.sin(t*1.3+i))*r*.12;break
      case 'dragon':x=Math.cos(a)*r*.8;y=r*.65-lift*r*1.9+Math.sin(t*3+q*8)*r*.12;break
      case 'rat':y=Math.sin(a)*r*.65-Math.abs(Math.sin(t*2+i))*r*.14;break
      case 'ox':y=r*.65-Math.abs(Math.sin(t*.6+q*7))*r*.55;x=Math.cos(a*.4)*r*.85;break
      case 'tiger':x=Math.cos(q*TAU)*r*(.85+.08*Math.sin(t*2+i%3));y=Math.sin(q*TAU)*r*.9;break
      case 'snake':x=Math.cos(a)*r*.8;y=r*.85-lift*r*1.9;break
      case 'horse':y=r*.7-lift*r*1.8;x=Math.cos(a)*r*.85;break
      case 'goat':x=Math.cos(a)*r*(.3+lift*.7);y=r*.7-lift*r*1.8+Math.sin(a)*r*.13;break
      case 'monkey':y=Math.sin(a)*r*.6-Math.abs(Math.sin(t*2+q*8))*r*.24;break
      case 'rooster':x=Math.cos(q*TAU)*r*(.85+.05*Math.sin(t*2));y=Math.sin(q*TAU)*r*.86;break
      case 'dog':x=Math.cos(a)*r*.9;y=Math.sin(a)*r*.5-Math.abs(Math.sin(t*2+i))*r*.12;break
      case 'boar':y=r*.6+Math.sin(a)*r*(i%2?.12:.25);x=Math.cos(a)*r*.95;break
      case 'panda':y=r*.8-lift*r*1.7;x=Math.sin(q*TAU+t*.6)*r*.88;break
      case 'fox':x=Math.cos(a+Math.sin(t+q*9)*.3)*r*.87;y=Math.sin(a)*r*.66;break
      case 'tanuki':y=Math.sin(a)*r*.35+r*.3;x=Math.cos(a)*r*.9;break
      case 'otter':x*=1+.12*Math.sin(t*2+i);y=Math.sin(a)*r*.6;break
      case 'koala':y=r*.85-lift*r*1.9+Math.sin(t+q*9)*r*.13;x=Math.cos(a*.6)*r*.88;break
      case 'turtle':x=Math.cos(a)*r*.92;y=Math.sin(a)*r*.5;break
      case 'axolotl':x=Math.cos(a)*r*.9;y=Math.sin(a)*r*.75;break
      case 'leopard':y=Math.sin(a)*r*.7+Math.sin(t+q*8)*r*.1;break
      case 'crane':x=Math.cos(a)*r*(.8+.15*Math.sin(t+i));y=Math.sin(a)*r*.68;break
      case 'cat':y=Math.sin(a)*r*.75-Math.abs(Math.sin(t+q*8))*r*.12;break
      case 'koi':x=Math.cos(a)*r*(.7+lift*.2);y=r*.7-lift*r*1.8+Math.sin(a)*r*.2;break
      case 'red-panda':x=Math.cos(a)*r*(i%2?.9:.7);y=Math.sin(a)*r*.42+(i%2?-.28:.28)*r;break
      case 'penguin':y=r*.5+Math.sin(a)*r*.3;x=Math.cos(a)*r*.95;break
      case 'kitsune':x=Math.cos(a)*r*(.7+lift*.25);y=r*.75-lift*r*2+Math.sin(t*3+q*14)*r*.1;break
    }
    f.glyphs.push({x:point.x+x,y:point.y+y,size:r*(.035+(level===3?.045:.025)*fract(q*7)),angle:a+t*.3,alpha:.28+.3*(depth+1)/2,material:p.material,color:p.color,light:p.light,depth})
    if(level===3&&['horse','axolotl','fox'].includes(id)&&i%4===0){
      const tail:Point[]=[];for(let k=0;k<9;k++){const earlier=a-k*.045;tail.push({x:point.x+Math.cos(earlier)*r*.9,y:point.y+Math.sin(earlier)*r*(id==='axolotl'?.75:.65)})}
      f.strokes.push({points:tail,width:3,alpha:.5,color:p.color,light:p.light})
    }
  }
  if(['water','ink','ribbon','fire','cloud','bubble'].includes(p.material))for(let h=0;h<(level===3?4:2);h++)f.rings.push({x:point.x,y:point.y+r*(.55-h*.35),rx:r*(.8-h*.08),ry:r*.19,angle:Math.sin(t+h)*.1,alpha:.2,width:2,color:p.color})
  if(level===3&&['goat','koi','kitsune'].includes(id))f.volumes.push({x:point.x,y:point.y,radius:r*.82,height:r*1.8,phase:t*2.4,alpha:.2,material:p.material,color:p.color,light:p.light})
  f.glows.push({x:point.x,y:point.y,radius:r*1.1,alpha:level===3?.12:.07,color:p.color})
  f.glyphs.sort((a,b)=>a.depth-b.depth);return f
}
