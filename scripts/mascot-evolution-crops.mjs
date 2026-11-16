import {readFile,writeFile} from 'node:fs/promises'
import {createHash} from 'node:crypto'
import {PNG} from 'pngjs'
const groups=['classic','zodiac-a','zodiac-b','nature','spirits'],atlases=[]
for(const kind of ['adult-base','adult-action','adult-activities','mini-charge'])for(const group of groups){
 const src=`/lib/images/interactive/mascots-${kind}-${group}.png`,bytes=await readFile('public'+src),image=PNG.sync.read(bytes),columns=kind==='adult-activities'?6:kind==='mini-charge'?2:4,rows=6,frames=[]
 for(let row=0;row<rows;row++)for(let column=0;column<columns;column++){
  const x0=Math.floor(column*image.width/columns),y0=Math.floor(row*image.height/rows),w=Math.floor((column+1)*image.width/columns)-x0,h=Math.floor((row+1)*image.height/rows)-y0,seen=new Uint8Array(w*h),queue=new Uint32Array(w*h)
  const opaque=i=>image.data[((y0+Math.floor(i/w))*image.width+x0+i%w)*4+3]>176
  let body=new Uint32Array(),bounds={left:0,right:w-1,top:0,bottom:h-1}
  for(let i=0;i<w*h;i++){
   if(seen[i]||!opaque(i))continue
   let start=0,end=1,left=w,top=h,right=0,bottom=0;queue[0]=i;seen[i]=1
   while(start<end){const at=queue[start++],x=at%w,y=Math.floor(at/w);left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y)
    for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const xx=x+dx,yy=y+dy,next=yy*w+xx;if(xx<0||xx>=w||yy<0||yy>=h||seen[next]||!opaque(next))continue;seen[next]=1;queue[end++]=next}
   }
   if(end>body.length){body=queue.slice(0,end);bounds={left,right,top,bottom}}
  }
  if(body.length<w*h*.025)throw new Error(`Missing sprite body: ${src}/${row}/${column}`)
  const lefts=new Int16Array(h).fill(w),rights=new Int16Array(h).fill(-1)
  for(const at of body){const x=at%w,y=Math.floor(at/w);lefts[y]=Math.min(lefts[y],x);rights[y]=Math.max(rights[y],x)}
  const a=[],b=[]
  for(let y=Math.max(0,bounds.top-3);y<=Math.min(h-1,bounds.bottom+3);y+=4){const end=Math.min(h,y+4);let l=w,r=-1;for(let yy=Math.max(0,y-3);yy<Math.min(h,end+3);yy++){l=Math.min(l,lefts[yy]);r=Math.max(r,rights[yy])}if(r<0)continue;l=Math.max(0,l-3);r=Math.min(w,r+4);a.push([l,y],[l,end]);b.push([r,y],[r,end])}
  const points=[...a,...b.reverse()],simple=points.filter((p,i)=>{const previous=points[(i+points.length-1)%points.length],next=points[(i+1)%points.length];return!((p[0]===previous[0]&&p[0]===next[0])||(p[1]===previous[1]&&p[1]===next[1]))})
  frames.push({row,column,mask:simple.map(([x,y])=>[Number((x/w*100).toFixed(3)),Number((y/h*100).toFixed(3))]),bodyPixels:body.length})
 }
 atlases.push({src,columns,rows,width:image.width,height:image.height,sha256:createHash('sha256').update(bytes).digest('hex'),frames})
}
await writeFile('src/interactive/duel/evolution-masks.generated.json',JSON.stringify({version:1,method:'CSS silhouettes from alpha-connected sprite bodies; original PNG bytes are unchanged.',atlases})+'\n')
console.log(`${atlases.length} atlases, ${atlases.reduce((n,a)=>n+a.frames.length,0)} isolated evolution and charging sprites verified.`)
