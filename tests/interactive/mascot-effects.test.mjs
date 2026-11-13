import assert from 'node:assert/strict'
import {test} from 'node:test'
import {readFile} from 'node:fs/promises'
import {createServer} from 'vite'
import {createElement} from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
const vite=await createServer({server:{middlewareMode:true,hmr:false},appType:'custom'})
try{
  const {MASCOTS,MASCOT_IMAGES,MASCOT_POSES,mascotStyle}=await vite.ssrLoadModule('/src/interactive/domain/mascot.ts')
  const {COMPETITION_AVATARS,validAvatar}=await vite.ssrLoadModule('/src/interactive/competition/avatars.ts')
  const {ATTACK_EFFECTS,MISTAKE_EFFECTS,DEFAULT_EFFECTS,impactFor,trajectory,validEffects}=await vite.ssrLoadModule('/src/interactive/duel/effects.ts')
  const {SIGNATURE_ATTACKS,signatureAttack,attackSequence}=await vite.ssrLoadModule('/src/interactive/duel/signature-attacks.ts')
  const {SignatureAttackArt}=await vite.ssrLoadModule('/src/interactive/duel/SignatureAttackArt.tsx')
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
  await test('legacy effect fields remain strictly validated when reading an old journal',()=>{
    assert.equal(ATTACK_EFFECTS.length,10);assert.equal(MISTAKE_EFFECTS.length,10)
    for(const attack of ATTACK_EFFECTS)for(const mistake of MISTAKE_EFFECTS)assert.equal(validEffects({attack:attack.id,mistake:mistake.id}),true)
    for(const bad of [{...DEFAULT_EFFECTS,damage:100},{...DEFAULT_EFFECTS,from:'right'},{attack:'laser',mistake:'stones'},{attack:'crescent',mistake:'https://foreign.test/object.svg'}])assert.equal(validEffects(bad),false)
    const config={mode:'duel',seed:42,left:['leaf'],right:['kitsune']}
    assert.deepEqual(parseDuelConfig(config),config)
    assert.deepEqual(parseDuelConfig({...config,effects:{attack:'leaves',mistake:'bucket'}}).effects,{attack:'leaves',mistake:'bucket'})
    assert.throws(()=>parseDuelConfig({...config,effects:{...DEFAULT_EFFECTS,damage:100}}))
  })
  await test('each of the thirty mascots has a fixed named attack, including a water jet for Koi and a fire tornado for Kitsune',()=>{
    assert.deepEqual(Object.keys(SIGNATURE_ATTACKS).sort(),MASCOTS.map(m=>m.id).sort())
    assert.equal(new Set(Object.values(SIGNATURE_ATTACKS).map(attack=>attack.label)).size,30)
    assert.equal(signatureAttack('koi').label,'Jet d’eau');assert.equal(signatureAttack('kitsune').label,'Tourbillon de flammes')
    for(const mascot of MASCOTS){
      const attack=signatureAttack(mascot.id)
      assert.ok(ATTACK_EFFECTS.some(effect=>effect.id===attack.motion));assert.ok(attack.duration<=1000&&attack.duration>=600)
    }
  })
  await test('critical signatures combine three to five visible hits inside one second without changing the normal attack',()=>{
    const counts=new Set()
    for(const mascot of MASCOTS){
      const normal=attackSequence(mascot.id,false),critical=attackSequence(mascot.id,true)
      assert.equal(normal.length,1);assert.equal(normal[0].delay,0);assert.equal(normal[0].duration,signatureAttack(mascot.id).duration)
      assert.ok(critical.length>=3&&critical.length<=5);counts.add(critical.length)
      for(const hit of critical){assert.ok(hit.delay+hit.duration<=1000);assert.ok(hit.impactDelay+340<=1000)}
      assert.deepEqual(attackSequence(mascot.id,true),critical)
    }
    assert.deepEqual([...counts].sort(),[3,4,5]);assert.equal(attackSequence('koi',true).length,4);assert.equal(attackSequence('kitsune',true).length,5)
  })
  await test('all thirty attack illustrations have different geometry, without external media, even if their colours and identity attributes are removed',()=>{
    const geometry=MASCOTS.map(mascot=>renderToStaticMarkup(createElement(SignatureAttackArt,{mascot:mascot.id})).replace(/ (?:fill|stroke|data-signature)="[^"]*"/g,''))
    assert.equal(new Set(geometry).size,30)
    assert.ok(geometry.every(svg=>!/<(?:image|script|foreignObject)\b/.test(svg)&&!svg.includes('href=')))
  })
  await test('correct answers always use the responding mascot; wrong answers produce only local falling objects, with deterministic automatic variety',()=>{
    const mistakes=new Set()
    for(const mascot of MASCOTS)for(const side of ['left','right'])for(const critical of [false,true]){
      const other=side==='left'?'right':'left',damage=critical?20:10
      const fighters={left:{avatarId:mascot.id,seat:1},right:{avatarId:mascot.id,seat:1}}
      const good=impactFor({at:1000,side,victim:other,correct:true,damage,critical},fighters,'round')
      assert.deepEqual(good,{kind:'attack',style:mascot.id,from:side,target:other,critical})
      for(let turn=0;turn<20;turn++){
        const resolution={at:1000,side,victim:side,correct:false,damage,critical}
        const bad=impactFor(resolution,fighters,`seed:pair:${turn}`)
        assert.equal(bad.kind,'mistake');assert.equal(bad.target,side);assert.equal(Object.hasOwn(bad,'from'),false)
        assert.ok(MISTAKE_EFFECTS.some(effect=>effect.id===bad.style));assert.deepEqual(impactFor(resolution,fighters,`seed:pair:${turn}`),bad)
        mistakes.add(bad.style)
      }
    }
    assert.equal(mistakes.size,10)
    assert.equal(impactFor(undefined,{},'round'),null);assert.equal(impactFor({at:1000,damage:0,critical:false},{},'round'),null)
  })
  await test('trajectories reverse for the other attacker and follow the real vertical arrangement on a phone',()=>{
    const left={x:100,y:220},right={x:900,y:220},top={x:180,y:180},bottom={x:180,y:420}
    assert.deepEqual(trajectory(left,right),{dx:800,dy:0,angle:0,direction:'right'})
    assert.equal(trajectory(right,left).direction,'left');assert.equal(trajectory(right,left).angle,Math.PI)
    assert.equal(trajectory(top,bottom).direction,'down');assert.equal(trajectory(bottom,top).direction,'up')
    assert.equal(trajectory(top,bottom).dy,-trajectory(bottom,top).dy)
  })
  await test('old journals with or without former effect settings retain their results, while the mascot now determines the attack',async()=>{
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
        assert.deepEqual(restored.state,state);assert.equal(restored.warning,'');assert.equal(impactFor(restored.state.resolution,restored.state.pairs[restored.state.pairIndex],duelRoundId(restored.state)).kind,'mistake')
        assert.equal(restored.state.hp.left,100);assert.ok([80,90].includes(restored.state.hp.right));assert.deepEqual(restored.state.config.effects,effects)
        const good={...restored.state.resolution,side:'right',victim:'left',correct:true}
        assert.equal(impactFor(good,restored.state.pairs[restored.state.pairIndex],duelRoundId(restored.state)).style,'kitsune')
      }
    }finally{globalThis.sessionStorage=previous}
  })
}finally{await vite.close()}
