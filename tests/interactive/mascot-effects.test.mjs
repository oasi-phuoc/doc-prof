import assert from 'node:assert/strict'
import {test} from 'node:test'
import {readFile} from 'node:fs/promises'
import {createServer} from 'vite'
const vite=await createServer({server:{middlewareMode:true,hmr:false},appType:'custom'})
try{
  const {MASCOTS,MASCOT_IMAGES,MASCOT_POSES,mascotStyle}=await vite.ssrLoadModule('/src/interactive/domain/mascot.ts')
  const {COMPETITION_AVATARS,validAvatar}=await vite.ssrLoadModule('/src/interactive/competition/avatars.ts')
  const {ATTACK_EFFECTS,MISTAKE_EFFECTS,DEFAULT_EFFECTS,impactFor,trajectory,validEffects}=await vite.ssrLoadModule('/src/interactive/duel/effects.ts')
  const {createDuel,stepDuel,duelRoundId,parseDuelConfig}=await vite.ssrLoadModule('/src/interactive/duel/core.ts')
  const {newDuelRun,readDuel,duelPlanId}=await vite.ssrLoadModule('/src/interactive/duel/storage.ts')
  await test('thirty unique mascots are shared by Class, Solo and competition while all existing identities remain valid',()=>{
    assert.equal(MASCOTS.length,30);assert.equal(new Set(MASCOTS.map(m=>m.id)).size,30);assert.equal(new Set(MASCOTS.map(m=>m.label)).size,30)
    assert.deepEqual(MASCOTS.slice(0,6).map(m=>m.id),['leaf','owl','octopus','hedgehog','rabbit','dragon'])
    assert.deepEqual(COMPETITION_AVATARS,MASCOTS.map(({id,label})=>({id,label})))
    for(const id of ['panda','fox','tanuki','otter','koala','turtle','axolotl','tiger','leopard','crane','cat','koi','rat','ox','rabbit','dragon','snake','horse','goat','monkey','rooster','dog','boar'])assert.equal(validAvatar(id),true,id)
    for(const invalid of ['custom nickname','untrusted','<script>'])assert.equal(validAvatar(invalid),false)
  })
  await test('all 180 poses occupy distinct in-bounds cells across ten real sprite sheets, with all new atlases physically divided into six rows and columns',async()=>{
    assert.equal(MASCOT_IMAGES.length,10);assert.equal(MASCOT_POSES.length,6)
    const frames=new Set()
    for(const mascot of MASCOTS){
      const style=mascotStyle(mascot.id)
      for(const pose of MASCOT_POSES){
        const x=parseFloat(style[`--ci-${pose}-x`]),y=parseFloat(style[`--ci-${pose}-y`])
        assert.ok(x>=0&&x<=100&&y>=0&&y<=100)
        frames.add([mascot.sheet.src,x,y].join(':'))
      }
      assert.equal(mascot.sheet.offset+5<mascot.sheet.columns*mascot.sheet.rows,true)
    }
    assert.equal(frames.size,180)
    for(const src of MASCOT_IMAGES){
      const file=await readFile('public'+src);assert.ok(file.length>50000)
      if(src.endsWith('.png')){assert.equal(file.subarray(1,4).toString(),'PNG');assert.equal(file.readUInt32BE(16)%6,0);assert.equal(file.readUInt32BE(20)%6,0)}
    }
    assert.ok(mascotStyle('kitsune',src=>'blob:https://class.test/'+src.split('/').at(-1))['--ci-mascot-image'].includes('blob:'))
  })
  await test('ten attack and ten mistake presets are fixed safe choices, with no arbitrary resource, damage or direction injected in configuration',()=>{
    assert.equal(ATTACK_EFFECTS.length,10);assert.equal(MISTAKE_EFFECTS.length,10)
    for(const attack of ATTACK_EFFECTS)for(const mistake of MISTAKE_EFFECTS)assert.equal(validEffects({attack:attack.id,mistake:mistake.id}),true)
    for(const bad of [{...DEFAULT_EFFECTS,damage:100},{...DEFAULT_EFFECTS,from:'right'},{attack:'laser',mistake:'stones'},{attack:'crescent',mistake:'https://foreign.test/object.svg'}])assert.equal(validEffects(bad),false)
    const config={mode:'duel',seed:42,left:['leaf'],right:['kitsune']}
    assert.deepEqual(parseDuelConfig(config),config)
    assert.deepEqual(parseDuelConfig({...config,effects:{attack:'leaves',mistake:'bucket'}}).effects,{attack:'leaves',mistake:'bucket'})
    assert.throws(()=>parseDuelConfig({...config,effects:{...DEFAULT_EFFECTS,damage:100}}))
  })
  await test('correct answers attack the opponent; wrong answers create only a local falling-object effect, including critical mistakes',()=>{
    for(const side of ['left','right'])for(const critical of [false,true]){
      const other=side==='left'?'right':'left',damage=critical?20:10
      const good=impactFor({at:1000,side,victim:other,correct:true,damage,critical},{attack:'petals',mistake:'books'})
      assert.deepEqual(good,{kind:'attack',style:'petals',from:side,target:other,critical})
      const bad=impactFor({at:1000,side,victim:side,correct:false,damage,critical},{attack:'petals',mistake:'books'})
      assert.deepEqual(bad,{kind:'mistake',style:'books',target:side,critical});assert.equal(Object.hasOwn(bad,'from'),false)
    }
    assert.equal(impactFor(undefined),null);assert.equal(impactFor({at:1000,damage:0,critical:false}),null)
  })
  await test('trajectories reverse for the other attacker and follow the real vertical arrangement on a phone',()=>{
    const left={x:100,y:220},right={x:900,y:220},top={x:180,y:180},bottom={x:180,y:420}
    assert.deepEqual(trajectory(left,right),{dx:800,dy:0,angle:0,direction:'right'})
    assert.equal(trajectory(right,left).direction,'left');assert.equal(trajectory(right,left).angle,Math.PI)
    assert.equal(trajectory(top,bottom).direction,'down');assert.equal(trajectory(bottom,top).direction,'up')
    assert.equal(trajectory(top,bottom).dy,-trajectory(bottom,top).dy)
  })
  await test('old duel journals keep their results and default effects; chosen effects and all new mascot identities survive replay without changing damage',async()=>{
    const previous=globalThis.sessionStorage,values=new Map();globalThis.sessionStorage={getItem:key=>values.get(key)??null}
    try{
      const quiz={id:'effects-source',title:'Calcul',items:[{question:{id:'q',prompt:'2 + 2 = ?',images:[],choices:[{id:'yes',text:'4'},{id:'no',text:'5'}]},correctChoiceId:'yes'}]},timer={enabled:false,seconds:5,feedbackSeconds:1},planId=await duelPlanId(quiz)
      for(const effects of [undefined,{attack:'wave',mistake:'bucket'}]){
        const config={mode:'duel',seed:42,left:['leaf'],right:['kitsune'],...(effects?{effects}:{})},run=newDuelRun(quiz,planId,config,timer,1000)
        let state=stepDuel(quiz,createDuel(quiz,config,timer,1000),{type:'start',pairIndex:0},1010)
        const action={type:'answer',roundId:duelRoundId(state),side:'right',choiceId:'no'}
        state=stepDuel(quiz,state,action,1020)
        const journal={...run.journal,events:[{at:1010,action:{type:'start',pairIndex:0}},{at:1020,action}]}
        values.set('clairfle.duel.duel.effects-source',JSON.stringify(journal))
        const restored=readDuel(quiz,planId,config,timer,2000)
        assert.deepEqual(restored.state,state);assert.equal(restored.warning,'');assert.equal(impactFor(restored.state.resolution,restored.state.config.effects).kind,'mistake')
        assert.equal(restored.state.hp.left,100);assert.ok([80,90].includes(restored.state.hp.right));assert.deepEqual(restored.state.config.effects,effects)
      }
    }finally{globalThis.sessionStorage=previous}
  })
}finally{await vite.close()}
