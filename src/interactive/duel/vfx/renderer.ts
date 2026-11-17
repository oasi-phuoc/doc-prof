import type {Frame,Glyph} from './model'
import type {EnergyBeam} from './quadruple'

/** No retained browser state: the same frame can be sought, paused, or exported. */
export function paintFrame(c:CanvasRenderingContext2D,f:Frame,opacity=1) {
  c.save();c.globalAlpha=opacity;c.lineCap='round';c.lineJoin='round'
  for(const g of f.glows){
    if(g.radius<=0)continue
    const gradient=c.createRadialGradient(g.x,g.y,0,g.x,g.y,g.radius)
    gradient.addColorStop(0,g.color);gradient.addColorStop(1,'transparent');c.fillStyle=gradient;c.globalAlpha=opacity*g.alpha
    c.fillRect(g.x-g.radius,g.y-g.radius,g.radius*2,g.radius*2)
  }
  for(const beam of f.beams??[])paintBeam(c,beam,opacity)
  for(const s of f.strokes){
    const n=s.points.length;if(n<2)continue
    // Segment alpha and thickness follow the age of the actual historic sample.
    for(let j=n-1;j>0;j--){
      const a=s.points[j]!,b=s.points[j-1]!,fresh=1-j/n
      c.globalAlpha=opacity*s.alpha*fresh*fresh;c.strokeStyle=s.color;c.lineWidth=s.width*(.18+fresh*.82)
      c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.stroke()
      c.strokeStyle=s.light;c.lineWidth=Math.max(.7,s.width*.2*fresh);c.stroke()
    }
  }
  for(const ring of f.rings){c.save();c.translate(ring.x,ring.y);c.rotate(ring.angle);c.globalAlpha=opacity*ring.alpha;c.strokeStyle=ring.color;c.lineWidth=ring.width;c.beginPath();c.ellipse(0,0,Math.max(.1,ring.rx),Math.max(.1,ring.ry),0,0,Math.PI*2);c.stroke();c.restore()}
  // Project rotating helical sheets at many heights, with independent angular speed,
  // depth shading, taper and turbulence. This is volume, not a rotated cyclone icon.
  for(const v of f.volumes){
    if(v.radius<.2)continue
    const cloud=v.material==='cloud',fire=v.material==='fire'
    const halo=c.createRadialGradient(v.x,v.y,0,v.x,v.y,Math.max(v.radius,v.height*.6))
    halo.addColorStop(0,v.light);halo.addColorStop(.4,v.color);halo.addColorStop(1,'transparent');c.fillStyle=halo;c.globalAlpha=opacity*v.alpha*(fire?.2:.12);c.fillRect(v.x-v.height,v.y-v.height,v.height*2,v.height*2)
    for(let h=0;h<19;h++){
      const q=h/18,rad=v.radius*(.19+q*.81)*(1+.055*Math.sin(v.phase*2+q*14)),y=v.y+v.height*(.48-q),a=v.phase*(1+q*.38)+q*9
      for(let depth=0;depth<2;depth++){
        const gradient=c.createLinearGradient(v.x-rad,y,v.x+rad,y);gradient.addColorStop(0,v.color);gradient.addColorStop(.35,v.light);gradient.addColorStop(.58,fire?'#fff5c9':v.light);gradient.addColorStop(1,v.color)
        c.globalAlpha=opacity*v.alpha*(depth?.8:.25)*(cloud?.65:.7);c.strokeStyle=gradient;c.lineWidth=Math.max(1,v.height*(cloud?.048:.028)*(1-q*.3))
        c.beginPath();for(let j=0;j<=24;j++){const theta=(depth?0:Math.PI)+j/24*Math.PI,noise=Math.sin(theta*3+a)*rad*.055,x=v.x+Math.cos(theta)*rad,yy=y+Math.sin(theta)*rad*.25+noise;if(j===0)c.moveTo(x,yy);else c.lineTo(x,yy)}c.stroke()
      }
    }
  }
  for(const g of f.glyphs){if(g.alpha<=0||g.size<=0)continue;c.save();c.translate(g.x,g.y);c.rotate(g.angle);c.scale(g.size,g.size);c.globalAlpha=opacity*g.alpha;glyph(c,g);c.restore()}
  c.restore()
}
function paintBeam(c:CanvasRenderingContext2D,b:EnergyBeam,opacity:number){
 const dx=b.tip.x-b.origin.x,dy=b.tip.y-b.origin.y,length=Math.hypot(dx,dy)
 if(length<1||b.alpha<=0)return
 c.save();c.translate(b.origin.x,b.origin.y);c.rotate(Math.atan2(dy,dx));c.globalCompositeOperation='screen';c.shadowColor=b.color;c.shadowBlur=12
 const fluid=['water','bubble','ink','ribbon'].includes(b.material),fire=['fire','wisp'].includes(b.material),frequency=fluid?11:fire?19:14
 for(let layer=0;layer<4;layer++){
  const scale=1-layer*.22,gradient=c.createLinearGradient(0,0,length,0);gradient.addColorStop(0,b.light);gradient.addColorStop(.3,layer>1?'#ffffff':b.color);gradient.addColorStop(1,layer>1?b.light:b.color)
  c.fillStyle=gradient;c.globalAlpha=opacity*b.alpha*(layer===0?.34:.64);c.beginPath()
  for(let side=-1;side<=1;side+=2)for(let j=0;j<=34;j++){
   const u=(side===-1?j:34-j)/34,width=(b.startRadius+(b.endRadius-b.startRadius)*u**1.18)*scale,turbulence=1+Math.sin(u*frequency+b.phase+layer+b.identity)*(.08+.04*Math.sin(b.identity)),y=side*width*turbulence
   if(side===-1&&j===0)c.moveTo(u*length,y)
   else if(side===1&&j===0){const radius=Math.abs(y);c.ellipse(length,0,Math.min(radius*.65,length*.4),radius,0,-Math.PI/2,Math.PI/2)}
   else c.lineTo(u*length,y)
  }
  c.closePath();c.fill()
 }
 c.shadowBlur=0;c.strokeStyle=b.light;c.lineWidth=2;c.globalAlpha=opacity*b.alpha*.65
 for(let i=1;i<6;i++){const u=((i/6+b.phase*.08)%1),width=b.startRadius+(b.endRadius-b.startRadius)*u;c.beginPath();c.ellipse(length*u,0,width*.18,width*.92,Math.sin(b.phase+i)*.3,0,Math.PI*2);c.stroke()}
 const cap=c.createRadialGradient(length,0,0,length,0,b.endRadius);cap.addColorStop(0,b.light);cap.addColorStop(.55,b.color);cap.addColorStop(1,'transparent');c.fillStyle=cap;c.globalAlpha=opacity*b.alpha*.65;c.beginPath();c.ellipse(length,0,Math.min(b.endRadius*.65,length*.4),b.endRadius,0,0,Math.PI*2);c.fill()
 c.restore()
}
function glyph(c:CanvasRenderingContext2D,g:Glyph){
  const gradient=c.createLinearGradient(-1,-1,1,1);gradient.addColorStop(0,g.light);gradient.addColorStop(.43,g.color);gradient.addColorStop(1,g.color)
  c.fillStyle=gradient;c.strokeStyle=g.light;c.lineWidth=.1;c.beginPath()
  switch(g.material){
    case 'leaf':
      c.moveTo(-1,0);c.bezierCurveTo(-.2,-1.1,.8,-.7,1,0);c.bezierCurveTo(.4,.8,-.3,.8,-1,0);c.fill();c.moveTo(-.8,0);c.lineTo(.8,0);c.stroke();break
    case 'feather':
      c.moveTo(-1,.1);c.bezierCurveTo(-.2,-.85,1,-.8,1,0);c.bezierCurveTo(.9,.7,-.4,.65,-1,.1);c.fill();c.moveTo(-1.2,.15);c.lineTo(.85,-.1);c.stroke();break
    case 'quill':case 'claw':
      c.moveTo(-1,-.14);c.quadraticCurveTo(.1,-.45,1.4,0);c.quadraticCurveTo(.1,.15,-1,.25);c.closePath();c.fill();break
    case 'water':case 'ink':
      c.moveTo(1.3,0);c.bezierCurveTo(.2,-.12,-.3,-1,-.9,-.5);c.bezierCurveTo(-1.7,.1,-.5,1,1.3,0);c.fill();c.beginPath();c.ellipse(-.65,-.14,.25,.08,-.4,0,Math.PI*2);c.fillStyle=g.light;c.fill();break
    case 'fire':case 'wisp': {
      const heat=c.createRadialGradient(-.45,0,.05,-.4,0,1.7);heat.addColorStop(0,'#fff8cd');heat.addColorStop(.26,g.light);heat.addColorStop(.6,g.color);heat.addColorStop(1,'transparent');c.fillStyle=heat
      c.moveTo(1.8,0);c.bezierCurveTo(.1,-.35,-.2,-1,-.85,-.5);c.bezierCurveTo(-1.8,.25,-.5,1.2,1.8,0);c.fill();break
    }
    case 'star':case 'sun':
      for(let i=0;i<10;i++){const a=i*Math.PI/5,r=i%2?.4:1;c.lineTo(Math.cos(a)*r,Math.sin(a)*r)}c.closePath();c.fill();break
    case 'moon':
      c.arc(0,0,1,-1.2,1.2);c.quadraticCurveTo(-.6,0,Math.cos(-1.2),Math.sin(-1.2));c.fill();break
    case 'rock':case 'dust':
      c.moveTo(-1,-.2);c.lineTo(-.4,-.85);c.lineTo(.5,-.7);c.lineTo(1,.2);c.lineTo(.3,.8);c.lineTo(-.7,.7);c.closePath();c.fill();c.moveTo(-.4,-.85);c.lineTo(.1,0);c.lineTo(1,.2);c.stroke();break
    case 'cheese':
      c.moveTo(-.9,.7);c.lineTo(-.6,-.7);c.lineTo(1,.1);c.lineTo(.9,.8);c.closePath();c.fill();c.fillStyle='#bb812e';for(const [x,y] of [[-.4,.2],[.4,.4],[-.2,.5]]){c.beginPath();c.arc(x!,y!,.13,0,Math.PI*2);c.fill()}break
    case 'banana':
      c.moveTo(-1,-.6);c.bezierCurveTo(-.2,.1,.7,.6,1,-.5);c.bezierCurveTo(1,1.7,-1.4,.9,-1,-.6);c.fill();break
    case 'paw':
      c.ellipse(0,.3,.65,.5,0,0,Math.PI*2);c.fill();for(let i=0;i<4;i++){c.beginPath();c.ellipse(-.7+i*.45,-.5+Math.abs(i-1.5)*.1,.2,.28,(i-1.5)*.2,0,Math.PI*2);c.fill()}break
    case 'bamboo':
      c.roundRect(-.15,-1,.3,2,.1);c.fill();for(let i=-1;i<=1;i++){c.beginPath();c.moveTo(-.3,i*.65);c.lineTo(.3,i*.65);c.stroke()}break
    case 'bubble':
      c.globalAlpha*=.7;c.arc(0,0,1,0,Math.PI*2);c.fill();c.lineWidth=.09;c.stroke();c.beginPath();c.arc(-.2,-.2,.5,Math.PI,Math.PI*1.5);c.lineWidth=.16;c.stroke();break
    case 'cloud':
      c.ellipse(0,0,1,.5,0,0,Math.PI*2);c.fill();c.beginPath();c.ellipse(-.25,-.25,.5,.4,0,0,Math.PI*2);c.fill();break
    case 'ice':
      for(let i=0;i<6;i++){const a=i*Math.PI/3;c.moveTo(0,0);c.lineTo(Math.cos(a),Math.sin(a));c.moveTo(Math.cos(a)*.55-Math.sin(a)*.2,Math.sin(a)*.55+Math.cos(a)*.2);c.lineTo(Math.cos(a)*.7,Math.sin(a)*.7);c.lineTo(Math.cos(a)*.55+Math.sin(a)*.2,Math.sin(a)*.55-Math.cos(a)*.2)}c.lineWidth=.13;c.stroke();break
    case 'coin':
      c.ellipse(0,0,1,.85,0,0,Math.PI*2);c.fill();c.beginPath();c.ellipse(0,0,.72,.6,0,0,Math.PI*2);c.stroke();c.fillStyle=g.light;c.fillRect(-.12,-.3,.24,.6);break
    case 'ribbon':
      c.moveTo(-1,-.1);c.bezierCurveTo(-.3,-.7,.3,.7,1,.1);c.lineTo(1,.3);c.bezierCurveTo(.3,.9,-.3,-.5,-1,.1);c.fill();break
  }
}
