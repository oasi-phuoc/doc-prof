import {test} from 'node:test'
import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'
import {PNG} from 'pngjs'
import {createElement} from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
import {createServer} from 'vite'
const vite=await createServer({server:{middlewareMode:true,hmr:false},appType:'custom'})
try{
 const {MASCOTS,MASCOT_IMAGES}=await vite.ssrLoadModule('/src/interactive/domain/mascot.ts')
 const {CombatPortrait}=await vite.ssrLoadModule('/src/interactive/duel/CombatPortrait.tsx')
 const {combatPoseForHp,combatFrame}=await vite.ssrLoadModule('/src/interactive/duel/combat-portraits.ts')
 const {signatureFor,SUPER_AURA_COLORS}=await vite.ssrLoadModule('/src/interactive/duel/vfx/catalog.ts')
 await test('all twelve active sprite atlases have real transparent margins and retain visible foreground',async()=>{
  assert.equal(MASCOT_IMAGES.length,12)
  for(const source of MASCOT_IMAGES){
   assert.ok(source.endsWith('-transparent.png'));const png=PNG.sync.read(await readFile('public'+source)),alpha=png.data.filter((_value,index)=>index%4===3)
   assert.ok(alpha.some(v=>v<10)&&alpha.some(v=>v>240),source)
   for(const index of [3,(png.width-1)*4+3,(png.height-1)*png.width*4+3,(png.width*png.height-1)*4+3])assert.ok(png.data[index]<20,`${source} corner`)
  }
 })
 await test('critical energy temporarily overrides both fatigue thresholds for all thirty mascots, then restores HP state',()=>{
  for(const {id} of MASCOTS)for(const level of [2,3])for(const hp of [1,10,20,40,50,100]){
   assert.equal(combatPoseForHp(hp,'ongoing',level),'angry');const html=renderToStaticMarkup(createElement(CombatPortrait,{avatarId:id,hp,level}))
   assert.ok(html.includes('ci-mascot-angry'));assert.ok(html.includes(`data-power-aura="${level}"`));assert.ok(html.includes(`data-aura-mascot="${id}"`))
   assert.ok(html.includes(`--ci-power-outer:${level===2?signatureFor(id).color:SUPER_AURA_COLORS[id]}`))
   if(hp<=50)assert.equal(combatPoseForHp(hp,'ongoing',1),hp<=20?'critical-tired':'tired')
  }
  assert.equal(combatPoseForHp(0,'ongoing',3),'defeat');assert.equal(combatPoseForHp(10,'winner',2),'victory')
 })
 await test('each health sprite has explicit isolated body bounds, excluding neighbouring-cell fragments',()=>{
  for(const {id} of MASCOTS)for(const state of ['tired','critical-tired','victory','defeat']){
   const frame=combatFrame(id,state);assert.equal(frame.crop.length,4);assert.ok(frame.crop.every(v=>v>=0&&v<90))
   assert.ok(frame.crop[0]+frame.crop[2]<95&&frame.crop[1]+frame.crop[3]<95)
   const html=renderToStaticMarkup(createElement(CombatPortrait,{avatarId:id,hp:state==='critical-tired'?20:state==='tired'?40:100,outcome:state==='victory'?'winner':state==='defeat'?'loser':'ongoing'}))
   assert.ok(html.includes('--combat-clip:polygon('))
  }
  const mask=combatFrame('rabbit','critical-tired').mask;let inside=false;for(let i=0,j=mask.length-1;i<mask.length;j=i++){const [x,y]=mask[i],[xx,yy]=mask[j];if((y>45)!==(yy>45)&&98<(xx-x)*(45-y)/(yy-y)+x)inside=!inside}assert.equal(inside,false,'the reported top-right fragment is outside the body contour')
 })
}finally{await vite.close()}
