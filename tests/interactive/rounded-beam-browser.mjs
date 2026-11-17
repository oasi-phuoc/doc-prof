import assert from 'node:assert/strict'
import {mkdir,writeFile} from 'node:fs/promises'
import {createServer} from 'vite'
import {chromium} from 'playwright'

const out='docs/interactive/rounded-beam-proofs',base='http://127.0.0.1:5195'
const vite=await createServer({appType:'custom',cacheDir:'/tmp/clairfle-rounded-beam',server:{host:'127.0.0.1',port:5195,strictPort:true,hmr:false}})
vite.middlewares.use('/__rounded_beam',(_req,res)=>{res.setHeader('content-type','text/html');res.end('<!doctype html><html lang="fr"><meta charset="utf-8"><title>Rayons ×4 arrondis</title><body></body></html>')});await vite.listen()
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH??'/usr/bin/chromium',args:['--no-sandbox']})
try{
 await mkdir(out,{recursive:true});const page=await browser.newPage({viewport:{width:1280,height:1000}}),errors=[]
 page.on('pageerror',error=>errors.push(error.message));await page.goto(base+'/__rounded_beam')
 const results=await page.evaluate(async()=>{
  const {paintFrame}=await import('/src/interactive/duel/vfx/renderer.ts'),{SIGNATURES}=await import('/src/interactive/duel/vfx/catalog.ts'),{makeScene,sampleScene}=await import('/src/interactive/duel/vfx/model.ts')
  document.head.insertAdjacentHTML('beforeend','<style>body{background:#14243b;color:#eef7ff;font:18px system-ui;margin:20px}section{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px}figure{margin:0;background:#1c304c;border-radius:12px}canvas{width:100%;height:auto}figcaption{padding:8px}</style>')
  const canvas=document.createElement('canvas');canvas.width=900;canvas.height=600;const c=canvas.getContext('2d'),results=[]
  for(const p of SIGNATURES)for(const angle of [0,Math.PI,Math.PI/4,-Math.PI/4]){
   c.clearRect(0,0,900,600)
   const dir={x:Math.cos(angle),y:Math.sin(angle)},normal={x:-dir.y,y:dir.x},origin={x:450-dir.x*180,y:300-dir.y*180},tip={x:450+dir.x*180,y:300+dir.y*180},r=75
   const beam={origin,tip,startRadius:7,endRadius:r,alpha:1,color:p.color,light:p.light,phase:1.3+p.phase,material:p.material,identity:p.phase}
   paintFrame(c,{strokes:[],glyphs:[],rings:[],volumes:[],glows:[],beams:[beam],contact:false,local:false})
   const alpha=(forward,side=0)=>c.getImageData(Math.round(tip.x+dir.x*forward+normal.x*side),Math.round(tip.y+dir.y*forward+normal.y*side),1,1).data[3]
   results.push({mascot:p.id,angle,center:alpha(r*.44),upper:alpha(r*.44,-r*.96),lower:alpha(r*.44,r*.96),origin:alpha(-340)})
  }
  // Visual plates use the complete attack, including each mascot's particles.
  for(const id of ['leaf','panda','koi','kitsune','dragon','fox']){
   const section=document.createElement('section');document.body.append(section)
   for(const source of ['left','right']){
    const scene=makeScene(id,4,'rounded-review',source,source==='left'?'right':'left'),figure=document.createElement('figure'),canvas=document.createElement('canvas');canvas.width=600;canvas.height=250
    paintFrame(canvas.getContext('2d'),sampleScene(scene,scene.duration*.7,{left:{x:85,y:125,radius:75},right:{x:510,y:125,radius:75}}))
    const caption=document.createElement('figcaption');caption.textContent=id+' · '+(source==='left'?'vers la droite':'vers la gauche');figure.append(canvas,caption);section.append(figure)
   }
  }
  return results
 })
 assert.equal(results.length,120)
 for(const result of results){assert(result.center>80,JSON.stringify(result));assert(result.upper<60&&result.lower<60,JSON.stringify(result));assert(result.origin>20,JSON.stringify(result))}
 assert.deepEqual(errors,[]);await page.screenshot({path:out+'/rounded-rays.png',fullPage:true})
 await writeFile('docs/interactive/rounded-beam-results.json',JSON.stringify({date:'2026-11-17',passed:true,checks:'Pixel alpha verifies the bright rounded tip extends beyond the former flat edge, while its shoulders curve away; all 30 mascot colours in four directions.',samples:results,errors},null,2)+'\n');console.log('120 rounded tips verified in Chromium; complete-scene visual plate saved.')
}finally{await browser.close();await vite.close()}
