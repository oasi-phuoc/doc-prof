import assert from 'node:assert/strict'
import {test} from 'node:test'
import {readFile} from 'node:fs/promises'
import {createHash} from 'node:crypto'
import {PNG} from 'pngjs'
import {createServer} from 'vite'
const vite=await createServer({server:{middlewareMode:true,hmr:false},appType:'custom',cacheDir:'/tmp/clairfle-duel-settings-unit'})
const previous=globalThis.sessionStorage,stored=new Map();globalThis.sessionStorage={getItem:id=>stored.get(id)??null,setItem:(id,value)=>stored.set(id,String(value))}
try{
 const {parseDuelRules,DEFAULT_DUEL_RULES,isAdultForm}=await vite.ssrLoadModule('/src/interactive/duel/rules.ts'),{createDuel,stepDuel,duelRound,duelRoundId}=await vite.ssrLoadModule('/src/interactive/duel/core.ts'),{newDuelRun,readDuel,writeDuel,duelPlanId}=await vite.ssrLoadModule('/src/interactive/duel/storage.ts')
 const {combatPoseForHp,portraitForHp}=await vite.ssrLoadModule('/src/interactive/duel/combat-portraits.ts'),{MASCOTS}=await vite.ssrLoadModule('/src/interactive/domain/mascot.ts'),{ADULT_STATES,ADULT_BASE_STATES,ADULT_ACTION_STATES,EVOLUTION_ATLASES,evolutionFrame,battleArtwork}=await vite.ssrLoadModule('/src/interactive/duel/evolution.ts')
 const {SIGNATURES,feedbackDuration,releaseTime}=await vite.ssrLoadModule('/src/interactive/duel/vfx/catalog.ts'),{makeScene,sampleScene,sampleAura}=await vite.ssrLoadModule('/src/interactive/duel/vfx/model.ts'),{energyHands,sampleChargeOrb}=await vite.ssrLoadModule('/src/interactive/duel/vfx/quadruple.ts')
 const quiz={id:'configured-duel',title:'Calcul',items:[{question:{id:'q',prompt:'2 + 2',images:[],choices:[{id:'yes',text:'4'},{id:'no',text:'5'}]},correctChoiceId:'yes'}]},timer={enabled:false,seconds:5,feedbackSeconds:1},config={mode:'duel',seed:42,left:['kitsune'],right:['koi'],combat:{maxHp:200,critical2:0,critical3:0,critical4:100}}
 const start=s=>stepDuel(quiz,s,{type:'start',pairIndex:s.pairIndex},s.createdAt+10),hit=(s,side='left',correct=true,at=s.createdAt+20)=>stepDuel(quiz,s,{type:'answer',roundId:duelRoundId(s),side,choiceId:correct?'yes':'no'},at)
 await test('health and critical configuration is strict, each probability can reach zero or 100, and the total cannot exceed 100',()=>{
  assert.deepEqual(parseDuelRules(DEFAULT_DUEL_RULES),DEFAULT_DUEL_RULES)
  for(const critical of [2,3,4])for(const maxHp of [10,100,101,200])assert.equal(parseDuelRules({maxHp,critical2:0,critical3:0,critical4:0,[`critical${critical}`]:100}).maxHp,maxHp)
  for(const patch of [{maxHp:0},{maxHp:201},{maxHp:20.5},{critical2:-1},{critical3:101},{critical4:NaN},{critical4:1.5},{critical2:60,critical3:30,critical4:11},{extra:1}])assert.throws(()=>parseDuelRules({...DEFAULT_DUEL_RULES,...patch}))
 })
 await test('zero and certain critical rates take effect on every seeded turn, independently of who answers first',()=>{
  for(const multiplier of [1,2,3,4])for(let seed=0;seed<120;seed++){
   const combat={maxHp:200,critical2:0,critical3:0,critical4:0,...(multiplier>1?{[`critical${multiplier}`]:100}:{})},s=start(createDuel(quiz,{...config,seed,combat},timer,1000)),before=structuredClone(s)
   assert.equal(s.version,4);assert.equal(duelRound(quiz,s).multiplier,multiplier);assert.deepEqual(s.hp,{left:200,right:200})
   for(const side of ['left','right'])for(const correct of [true,false]){const result=hit(s,side,correct),victim=correct?(side==='left'?'right':'left'):side;assert.equal(result.hp[victim],200-10*multiplier);assert.equal(result.resolution.damage,10*multiplier);assert.deepEqual(result.resolution.previousHp,{left:200,right:200})}assert.deepEqual(s,before)
  }
 })
 await test('custom probabilities are exclusive, reproducible and follow the configured distribution',()=>{
  const counts={1:0,2:0,3:0,4:0},combat={maxHp:150,critical2:15,critical3:20,critical4:10}
  for(let seed=0;seed<4000;seed++){const s=createDuel(quiz,{...config,seed,combat},timer,1000),round=duelRound(quiz,s);counts[round.multiplier]++;assert.deepEqual(duelRound(quiz,s),round)}
  for(const[level,expected]of[[1,.55],[2,.15],[3,.2],[4,.1]])assert.ok(Math.abs(counts[level]/4000-expected)<.035,JSON.stringify(counts))
 })
 await test('200-point matches apply exact damage once, preserve actual pre-lethal HP and finish at zero',()=>{
  let s=start(createDuel(quiz,config,timer,1000)),at=1100
  for(let n=0;n<5;n++){s=hit(s,'left',true,at);assert.equal(s.hp.right,Math.max(0,200-(n+1)*40));assert.equal(s.resolution.previousHp.right,200-n*40);assert.equal(hit(s,'right',false,at),s);at=s.deadline;s=stepDuel(quiz,s,{type:'tick'},at);at++}
  assert.equal(s.phase,'finished');assert.deepEqual(s.wins,{left:1,right:0});assert.equal(s.results.length,1)
  const low=start(createDuel(quiz,{...config,combat:{...config.combat,maxHp:10}},timer,1000)),final=hit(low,'left',false);assert.equal(final.hp.left,0);assert.equal(final.resolution.previousHp.left,10);assert.equal(final.resolution.damage,40)
 })
 await test('timeouts still remove ten points from both sides, and the next team pair starts at the configured maximum',()=>{
  const timed=start(createDuel(quiz,config,{...timer,enabled:true},1000)),expired=stepDuel(quiz,timed,{type:'tick'},timed.deadline);assert.deepEqual(expired.hp,{left:190,right:190});assert.equal(expired.resolution.damage,10);assert.equal(expired.resolution.multiplier,1)
  const teams={...config,mode:'teams',left:['kitsune','leaf'],right:['koi','owl']};let s=start(createDuel(quiz,teams,timer,1000)),at=1100
  while(s.phase==='question'){s=hit(s,'left',true,at);at=s.deadline;s=stepDuel(quiz,s,{type:'tick'},at);at++}
  assert.equal(s.phase,'ready');assert.equal(s.pairIndex,1);assert.deepEqual(s.hp,{left:200,right:200})
 })
 await test('fourth-critical journals restore their own rules and health, while legacy versions retain their original chances',async()=>{
  const plan=await duelPlanId(quiz),run=newDuelRun(quiz,plan,config,timer,1000),events=[{at:1010,action:{type:'start',pairIndex:0}},{at:1020,action:{type:'answer',roundId:duelRoundId(run.state),side:'left',choiceId:'no'}}],journal={...run.journal,events};assert.equal(journal.version,4);assert.ok(writeDuel(journal))
  const restored=readDuel(quiz,plan,{...config,combat:{...DEFAULT_DUEL_RULES}},timer,1100);assert.equal(restored.warning,'');assert.deepEqual(restored.state.hp,{left:160,right:200});assert.deepEqual(restored.state.config.combat,config.combat)
  for(const version of [2,3]){const legacy={...config};delete legacy.combat;const s=createDuel(quiz,legacy,timer,1000,version);assert.equal(s.version,version);assert.deepEqual(s.hp,{left:100,right:100});assert.notEqual(duelRound(quiz,s).multiplier,4);assert.throws(()=>createDuel(quiz,config,timer,1000,version))}
 })
 await test('adult evolution depends on maximum health, persists after damage and keeps fatigue, critical and outcome priorities',()=>{
  assert.equal(isAdultForm(200),true);assert.equal(isAdultForm(100),false)
  assert.equal(portraitForHp(101,'ongoing',200),'normal');assert.equal(portraitForHp(100,'ongoing',200),'tired');assert.equal(portraitForHp(40,'ongoing',200),'critical-tired')
  for(const level of [2,3,4])for(const hp of [1,40,100,200])assert.equal(combatPoseForHp(hp,'ongoing',level,200),'angry')
  assert.equal(combatPoseForHp(40,'ongoing',1,200),'critical-tired');assert.equal(combatPoseForHp(0,'ongoing',4,200),'defeat');assert.equal(combatPoseForHp(10,'winner',4,200),'victory')
 })
 await test('all thirty adults have fourteen mapped states and both mini charging poses, backed by 480 real isolated sprite cells',async()=>{
  assert.equal(ADULT_STATES.length,14);assert.equal(EVOLUTION_ATLASES.length,20);const compiled=JSON.parse(await readFile('src/interactive/duel/evolution-masks.generated.json')),images=new Map(),addresses=new Set(),hashes=new Set()
  for(const a of compiled.atlases){const bytes=await readFile('public'+a.src);assert.equal(createHash('sha256').update(bytes).digest('hex'),a.sha256);images.set(a.src,PNG.sync.read(bytes))}
  for(const{id}of MASCOTS)for(const[adult,states]of[[true,ADULT_STATES],[false,['charge','release']]])for(const state of states){const f=evolutionFrame(id,state,adult),png=images.get(f.src),x0=Math.floor(f.column*png.width/f.columns),y0=Math.floor(f.row*png.height/f.rows),x1=Math.floor((f.column+1)*png.width/f.columns),y1=Math.floor((f.row+1)*png.height/f.rows),bytes=[];for(let y=y0;y<y1;y++)bytes.push(png.data.subarray((y*png.width+x0)*4,(y*png.width+x1)*4));const pixels=Buffer.concat(bytes);assert.ok(pixels.some((v,i)=>i%4===3&&v>240),`${id}/${state}/${adult}`);assert.ok(f.mask.length>=8);assert.ok(f.mask.every(([x,y])=>x>=0&&x<=100&&y>=0&&y<=100));addresses.add(`${f.src}:${f.row}:${f.column}`);hashes.add(createHash('sha256').update(pixels).digest('hex'))}
  assert.equal(addresses.size,480);assert.equal(hashes.size,480)
  for(const {id} of MASCOTS)for(const adult of [true,false]){const roster={left:[id],right:[id==='leaf'?'koi':'leaf'],combat:{maxHp:adult?200:100}},art=battleArtwork(roster);for(const state of adult?[...ADULT_BASE_STATES,...ADULT_ACTION_STATES]:['charge','release'])assert.ok(art.includes(evolutionFrame(id,state,adult).src));assert.ok(art.every(src=>!src.includes('-activities-')));const resumed=battleArtwork(roster,true);assert.ok(resumed.includes(evolutionFrame(id,'charge',!adult).src));assert.equal(resumed.length,15)}
 })
 const points={left:{x:200,y:300,radius:110},right:{x:1000,y:300,radius:110}},positions=f=>[...f.glyphs,...f.rings,...f.glows,...f.strokes.flatMap(s=>s.points),...(f.beams??[]).flatMap(b=>[b.origin,b.tip])]
 await test('each fourth critical charges at the hands and projects a widening themed beam in either direction',()=>{
  const signatures=new Set()
  for(const{id}of MASCOTS)for(const source of ['left','right']){const target=source==='left'?'right':'left',scene=makeScene(id,4,'fourth',source,target);assert.ok(releaseTime(id)<scene.contact);const charged=sampleScene(scene,scene.duration*.15,points),during=sampleScene(scene,scene.duration*.55,points),beam=during.beams[0];assert.equal(scene.local,false);assert.ok(charged.glows.length>0);assert.equal(charged.beams.length,0);assert.deepEqual(beam.origin,energyHands(points[source],source,true));assert.ok(beam.endRadius>beam.startRadius*3);assert.ok(source==='left'?beam.tip.x>beam.origin.x:beam.tip.x<beam.origin.x);assert.ok(positions(during).every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)));assert.deepEqual(during,sampleScene(scene,scene.duration*.55,points));signatures.add(JSON.stringify(during));assert.equal(positions(sampleScene(scene,scene.duration,points)).length,0);assert.ok(feedbackDuration(1,id,4)>=scene.duration+140)}
  assert.equal(signatures.size,60)
  const geometry=MASCOTS.map(({id})=>{const scene=makeScene(id,4,'same-geometry-seed','left','right');scene.signature={...scene.signature,color:'#111111',light:'#ffffff',phase:0};return JSON.stringify(sampleScene(scene,scene.duration*.55,points),(key,value)=>['color','light','identity','phase'].includes(key)?undefined:value)});assert.equal(new Set(geometry).size,30,'Each mascot keeps distinct fourth-critical geometry even without its colours or identity phase')
 })
 await test('a fourth-critical mistake implodes only on its owner and never creates an opponent attack',()=>{
  for(const{id}of MASCOTS)for(const side of ['left','right']){const scene=makeScene(id,4,'backfire',side,side,true),other=side==='left'?'right':'left';for(const t of [.15,.4,.62,.8]){const f=sampleScene(scene,scene.duration*t,points);assert.equal(f.local,true);assert.equal(f.beams.length,0);assert.deepEqual(f,sampleScene(scene,scene.duration*t,{...points,[other]:{x:-9999,y:9999,radius:500}}));assert.ok(positions(f).every(p=>Math.abs(p.x-points[side].x)<250&&Math.abs(p.y-points[side].y)<250))}}
 })
 await test('the new aura and charged sphere stay animated, match mascot colours and differ from earlier critical levels',()=>{
  const unique=new Set()
  for(const{id}of MASCOTS){const f=sampleAura(id,4,1234,points.left),late=sampleAura(id,4,121234,points.left);assert.notDeepEqual(f,late);assert.notDeepEqual(f,sampleAura(id,3,1234,points.left));assert.ok(f.rings.length>=3&&f.glyphs.length>=32);assert.notDeepEqual(sampleChargeOrb(id,1000,points.left,'left'),sampleChargeOrb(id,1200,points.left,'left'));unique.add(JSON.stringify(f));assert.ok(f.glyphs.every(g=>g.color===SIGNATURES.find(s=>s.id===id).color))}assert.equal(unique.size,30)
 })
}finally{await vite.close();if(previous===undefined)delete globalThis.sessionStorage;else globalThis.sessionStorage=previous}
