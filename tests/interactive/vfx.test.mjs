import assert from 'node:assert/strict'
import {test} from 'node:test'
import {readFile} from 'node:fs/promises'
import {createHash} from 'node:crypto'
import {PNG} from 'pngjs'
import {createServer} from 'vite'
const vite=await createServer({server:{middlewareMode:true,hmr:false},appType:'custom'})
try{
 const {MASCOTS}=await vite.ssrLoadModule('/src/interactive/domain/mascot.ts')
 const {SIGNATURES,feedbackDuration}=await vite.ssrLoadModule('/src/interactive/duel/vfx/catalog.ts')
 const {makeScene,sampleScene,sampleAura}=await vite.ssrLoadModule('/src/interactive/duel/vfx/model.ts')
 const {COMBAT_STATES,COMBAT_ATLASES,combatFrame,portraitForHp}=await vite.ssrLoadModule('/src/interactive/duel/combat-portraits.ts')
 const {renderScale,adaptQuality}=await vite.ssrLoadModule('/src/interactive/duel/vfx/quality.ts')
 const points={left:{x:200,y:300,radius:110},right:{x:1000,y:300,radius:110}}
 const positions=f=>[...f.glyphs,...f.rings,...f.glows,...f.strokes.flatMap(s=>s.points)]
 await test('all 90 named compositions sample deterministically in both directions without nonfinite geometry',()=>{
  assert.deepEqual(SIGNATURES.map(s=>s.id),MASCOTS.map(s=>s.id));assert.equal(new Set(SIGNATURES.flatMap(s=>[s.normal,s.double,s.triple])).size,90)
  for(const s of SIGNATURES)for(const level of [1,2,3])for(const side of ['left','right']){
   const scene=makeScene(s.id,level,'proof-seed',side,side==='left'?'right':'left')
   assert.ok(scene.duration>=[650,1100,1700][level-1]&&scene.duration<=[1050,1600,2300][level-1])
   for(const ratio of [0,.2,.5,.8,.95,1]){
    const frame=sampleScene(scene,scene.duration*ratio,points)
    assert.deepEqual(frame,sampleScene(scene,scene.duration*ratio,points))
    assert.ok(positions(frame).every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)))
   }
   assert.ok(positions(sampleScene(scene,scene.duration*.5,points)).length>10)
   assert.equal(positions(sampleScene(scene,scene.duration,points)).length,0)
  }
 })
 await test('every triple and every self-mistake is victim-local and independent of the opponent position',()=>{
  for(const s of SIGNATURES)for(const level of [1,2,3])for(const local of [false,true]){
   if(!local&&level!==3)continue
   const scene=makeScene(s.id,level,'local','left','right',local)
   for(const t of [.2,.5,.8]){
    const frame=sampleScene(scene,scene.duration*t,points)
    assert.equal(frame.local,true)
    assert.deepEqual(frame,sampleScene(scene,scene.duration*t,{...points,left:{x:-9999,y:9999,radius:500}}))
    assert.ok(positions(frame).every(p=>Math.abs(p.x-points.right.x)<200&&Math.abs(p.y-points.right.y)<220),s.id)
   }
  }
 })
 await test('directional material heads turn with their actual travel, including right-to-left water and fire',()=>{
  for(const id of ['koi','dragon','kitsune','octopus','snake'])for(const source of ['left','right']){
   const scene=makeScene(id,1,'facing',source,source==='left'?'right':'left'),frame=sampleScene(scene,scene.duration*.4,points)
   const head=frame.glyphs.reduce((a,b)=>a.size>b.size?a:b)
   assert.ok(source==='left'?Math.cos(head.angle)>0:Math.cos(head.angle)<0,`${id}/${source}`)
  }
 })
 await test('a kitsune triple grows in place before impact and water/star/fire trails fade after their head arrives',()=>{
  const scene=makeScene('kitsune',3,'fire','left','right')
  const spread=t=>Math.max(...sampleScene(scene,t*scene.duration,points).glyphs.map(g=>Math.abs(g.x-1000)))
  assert.ok(spread(.42)>spread(.15)*1.3)
  for(const id of ['koi','axolotl','kitsune','dragon']){
   const scene=makeScene(id,1,'history','left','right')
   const during=sampleScene(scene,scene.duration*.5,points),after=sampleScene(scene,scene.duration*.7,points)
   assert.ok(during.strokes.length&&after.strokes.length,id)
   assert.notDeepEqual(during.strokes[0].points,after.strokes[0].points)
   assert.ok(after.strokes[0].alpha<during.strokes[0].alpha,id)
  }
 })
 await test('all sixty persistent auras stay populated, move after two minutes, and differ between levels',()=>{
  const fingerprints=new Set()
  for(const {id} of MASCOTS)for(const level of [2,3]){
   const frame=sampleAura(id,level,1234,points.left),late=sampleAura(id,level,121234,points.left)
   assert.ok(frame.glyphs.length>=20&&late.glyphs.length>=20);assert.notDeepEqual(frame,late)
   fingerprints.add(JSON.stringify(frame));assert.ok(positions(late).every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)))
   if(level===3)assert.notEqual(frame.glyphs[0].color,sampleAura(id,2,1234,points.left).glyphs[0].color)
  }
  assert.equal(fingerprints.size,60)
 })
 await test('HP and match result have explicit priority over any critical energy',()=>{
  for(const [hp,expected] of [[100,'normal'],[51,'normal'],[50,'tired'],[21,'tired'],[20,'critical-tired'],[1,'critical-tired'],[0,'defeat']])assert.equal(portraitForHp(hp),expected)
  assert.equal(portraitForHp(10,'winner'),'victory');assert.equal(portraitForHp(100,'loser'),'defeat');assert.equal(portraitForHp(0,'draw-ko'),'defeat')
 })
 await test('raster quality caps phone DPI and reacts to slow display frames without disabling motion',()=>{
  assert.equal(renderScale(390,844,3),1.5);assert.equal(renderScale(844,390,3),1.5);assert.equal(renderScale(1366,768,3),2)
  assert.deepEqual(adaptQuality({dpr:1.5,density:1},3,49),{dpr:1,density:1})
  assert.deepEqual(adaptQuality({dpr:1,density:1},3,49),{dpr:1,density:.85})
  assert.deepEqual(adaptQuality({dpr:1,density:.5},25,49),{dpr:1,density:.45})
  assert.deepEqual(adaptQuality({dpr:1.5,density:1},3,16.7),{dpr:1.5,density:1})
 })
 await test('120 original physical RGBA sprite cells exist, are distinct, correctly mapped and have transparent margins',async()=>{
  const atlases=new Map(),hashes=new Set()
  for(const src of COMBAT_ATLASES){const png=PNG.sync.read(await readFile(`public${src}`));assert.equal(png.width,1024);assert.equal(png.height,1536);atlases.set(src,png)}
  for(const {id} of MASCOTS)for(const state of COMBAT_STATES){
   const frame=combatFrame(id,state),png=atlases.get(frame.src),pixels=[]
   for(let y=0;y<256;y++)for(let x=0;x<256;x++){const at=((y+frame.row*256)*1024+x+frame.column*256)*4;pixels.push(...png.data.subarray(at,at+4))}
   const cell=Buffer.from(pixels);hashes.add(createHash('sha256').update(cell).digest('hex'))
   assert.ok(cell.some((v,i)=>i%4===3&&v>240),`${id}/${state} must contain actual character pixels`)
   assert.ok(cell[3]<25,`${id}/${state} corner must be transparent`)
  }
  assert.equal(hashes.size,120)
 })
 await test('cinematic deadlines cover the full effect plus safety while preserving teacher preferences',async()=>{
  const {createDuel,stepDuel,duelRoundId,duelRound}=await vite.ssrLoadModule('/src/interactive/duel/core.ts')
  const quiz={id:'q',items:[{question:{id:'x',choices:[{id:'yes'}]},correctChoiceId:'yes'}]},config={mode:'duel',seed:1,left:['kitsune'],right:['koi']},timer={enabled:false,seconds:5,feedbackSeconds:1}
  let state=createDuel(quiz,config,timer,1000);assert.equal(state.version,3)
  state=stepDuel(quiz,state,{type:'start',pairIndex:0},1010)
  const level=duelRound(quiz,state).multiplier
  state=stepDuel(quiz,state,{type:'answer',roundId:duelRoundId(state),side:'left',choiceId:'yes'},1100)
  assert.equal(state.deadline-1100,feedbackDuration(1,'kitsune',level));assert.equal(state.timer.feedbackSeconds,1)
  const paused=stepDuel(quiz,state,{type:'pause',roundId:duelRoundId(state),phase:'feedback'},1200)
  assert.equal(stepDuel(quiz,paused,{type:'tick'},10000),paused)
  const resumed=stepDuel(quiz,paused,{type:'resume',roundId:duelRoundId(state),phase:'feedback'},10000)
  assert.equal(resumed.deadline,10000+paused.remainingMs)
  let legacy=createDuel(quiz,config,timer,1000,2);legacy=stepDuel(quiz,legacy,{type:'start',pairIndex:0},1010);legacy=stepDuel(quiz,legacy,{type:'answer',roundId:duelRoundId(legacy),side:'left',choiceId:'yes'},1100)
  assert.equal(legacy.deadline,2100)
 })
}finally{await vite.close()}
