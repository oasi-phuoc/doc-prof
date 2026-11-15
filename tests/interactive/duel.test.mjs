import assert from 'node:assert/strict'
import {test} from 'node:test'
import {createServer} from 'vite'
const vite=await createServer({server:{middlewareMode:true,hmr:false},appType:'custom'})
const previous=globalThis.sessionStorage,stored=new Map()
globalThis.sessionStorage={getItem:key=>stored.get(key)??null,setItem:(key,value)=>stored.set(key,String(value))}
try{
  const {createDuel,stepDuel,duelRound,duelRoundId,duelPairs,nextDuelSeed,parseDuelConfig,isDuelAction,DUEL_LIFETIME}=await vite.ssrLoadModule('/src/interactive/duel/core.ts')
  const {newDuelRun,readDuel,writeDuel,duelPlanId}=await vite.ssrLoadModule('/src/interactive/duel/storage.ts')
  const {hasDuel,duelStorageKey}=await vite.ssrLoadModule('/src/interactive/duel/storage-key.ts')
  const quiz={id:'duel-source',title:'Calcul',items:[{question:{id:'q1',prompt:'2 + 2 = ?',images:[],choices:[{id:'yes',text:'4'},{id:'no',text:'5'}]},correctChoiceId:'yes'}]}
  const timer={enabled:false,seconds:5,feedbackSeconds:1},config={mode:'duel',seed:42,left:['panda'],right:['fox']}
  const fresh=(seed=42,mode='duel',more={})=>createDuel(quiz,{...config,seed,mode,...more},timer,1000)
  const start=state=>stepDuel(quiz,state,{type:'start',pairIndex:state.pairIndex},1010)
  const hit=(state,side='left',correct=true,at=1020)=>stepDuel(quiz,state,{type:'answer',roundId:duelRoundId(state),side,choiceId:correct?'yes':'no'},at)
  const seedFor=multiplier=>{for(let seed=0;seed<1000;seed++)if(duelRound(quiz,fresh(seed)).multiplier===multiplier)return seed;throw new Error('Missing deterministic branch')}

  await test('normal, double and triple hits apply 10, 20 or 30 percent to the opponent on a correct answer and to oneself on an error',()=>{
    for(const multiplier of [1,2,3])for(const side of ['left','right'])for(const correct of [false,true]){
      const state=start(fresh(seedFor(multiplier))),before=structuredClone(state),next=hit(state,side,correct)
      const victim=correct?(side==='left'?'right':'left'):side,damage=multiplier*10
      assert.equal(next.hp[victim],100-damage);assert.equal(next.hp[victim==='left'?'right':'left'],100)
      assert.equal(next.resolution.critical,multiplier>1);assert.equal(next.resolution.damage,damage);assert.equal(next.resolution.victim,victim)
      assert.equal(next.phase,'feedback');assert.deepEqual(state,before)
    }
  })
  await test('the first valid click resolves the turn exactly once and stale clicks cannot strike the next question',()=>{
    const state=start(fresh(seedFor(1))),first=hit(state)
    assert.equal(hit(first,'right',false,1020),first)
    assert.equal(hit(first,'left',true,1030),first)
    const next=stepDuel(quiz,first,{type:'tick'},first.deadline)
    assert.notEqual(duelRoundId(next),duelRoundId(state))
    const stale=stepDuel(quiz,next,{type:'answer',roundId:duelRoundId(state),side:'right',choiceId:'no'},next.deadline??3000)
    assert.equal(stale,next);assert.deepEqual(stale.hp,{left:100,right:90})
    assert.throws(()=>stepDuel(quiz,next,{type:'answer',roundId:duelRoundId(next),side:'left',choiceId:'forged'},3000),/proposée/)
  })
  await test('critical rolls are deterministic, independent of answer speed and distributed as 65 percent normal, 25 percent double and 10 percent triple',()=>{
    const counts={1:0,2:0,3:0}
    for(let seed=0;seed<2000;seed++){
      const state=start(fresh(seed)),round=duelRound(quiz,state)
      counts[round.multiplier]++
      assert.deepEqual(duelRound(quiz,state),round)
      assert.equal(hit(state,'left',true,1020).resolution.damage,hit(state,'right',false,2000).resolution.damage)
    }
    assert.ok(counts[1]>1180&&counts[1]<1420,JSON.stringify(counts));assert.ok(counts[2]>380&&counts[2]<620,JSON.stringify(counts));assert.ok(counts[3]>120&&counts[3]<280,JSON.stringify(counts))
  })
  await test('a quiz repeats in shuffled cycles until knockout, clamps health at zero and records the winner once',()=>{
    let state=start(fresh(seedFor(2))),at=1100,turns=0
    while(state.phase!=='finished'){
      assert.equal(duelRound(quiz,state).item.correctChoiceId,'yes')
      state=hit(state,'left',true,at);turns++
      assert.ok(state.hp.right>=0)
      state=stepDuel(quiz,state,{type:'tick'},state.deadline);at=state.createdAt+turns*1100+100
    }
    assert.ok(turns>=4&&turns<=10);assert.equal(state.hp.right,0);assert.equal(state.hp.left,100)
    assert.deepEqual(state.wins,{left:1,right:0});assert.equal(state.results.length,1);assert.equal(state.results[0].winner,'left')
    assert.equal(stepDuel(quiz,state,{type:'tick'},at),state)
  })
  await test('team pairing is fixed at the start, gives each member one match and restores both health bars before the next called pair',()=>{
    const cfg={...config,mode:'teams',left:['panda','koala','fox'],right:['tiger','otter','koi']},before=structuredClone(cfg)
    const pairs=duelPairs(cfg)
    assert.deepEqual(duelPairs(cfg),pairs)
    assert.deepEqual(pairs.map(p=>p.left.seat).sort(),[1,2,3]);assert.deepEqual(pairs.map(p=>p.right.seat).sort(),[1,2,3])
    let state=createDuel(quiz,cfg,timer,1000),at=1100
    for(let pairIndex=0;pairIndex<3;pairIndex++){
      assert.equal(state.phase,'ready');assert.equal(state.pairIndex,pairIndex);assert.deepEqual(state.hp,{left:100,right:100})
      state=stepDuel(quiz,state,{type:'start',pairIndex},at++)
      const winner=pairIndex===1?'right':'left'
      while(state.phase==='question'){
        state=hit(state,winner,true,at);at=state.deadline
        state=stepDuel(quiz,state,{type:'tick'},at);at++
      }
    }
    assert.equal(state.phase,'finished');assert.deepEqual(state.wins,{left:2,right:1});assert.deepEqual(state.pairs,pairs)
    assert.deepEqual(state.results.map(result=>result.pairIndex),[0,1,2]);assert.deepEqual(cfg,before)
    const orders=new Set(Array.from({length:12},(_,seed)=>JSON.stringify(duelPairs({...cfg,seed}))))
    assert.ok(orders.size>1)
  })
  await test('timeout removes ten percent from both fighters, pause preserves remaining time and late pause requests do not suspend a new turn',()=>{
    let state=createDuel(quiz,config,{...timer,enabled:true},1000)
    state=stepDuel(quiz,state,{type:'start',pairIndex:0},1100)
    state=stepDuel(quiz,state,{type:'pause',roundId:duelRoundId(state),phase:'question'},2100)
    assert.equal(state.remainingMs,4000)
    assert.equal(stepDuel(quiz,state,{type:'tick'},20000),state)
    const paused=state
    assert.equal(hit(paused,'left',true,20001),paused)
    state=stepDuel(quiz,state,{type:'resume',roundId:duelRoundId(state),phase:'question'},20000)
    assert.equal(state.deadline,24000)
    state=stepDuel(quiz,state,{type:'tick'},24000)
    assert.deepEqual(state.hp,{left:90,right:90});assert.equal(state.resolution.damage,10);assert.equal(state.resolution.timeout,true)
    const id=duelRoundId(state)
    state=stepDuel(quiz,state,{type:'pause',roundId:id,phase:'feedback'},25000)
    assert.equal(state.phase,'question');assert.equal(state.paused,false)
  })
  await test('invalid rosters and forged damage fields cannot create names, unequal teams or arbitrary health changes',()=>{
    for(const change of [v=>{v.nickname='untrusted'},v=>{v.left=['not-a-mascot']},v=>{v.right=[]},v=>{v.left=['panda','fox']},v=>{v.seed=-1},v=>{v.seed=2**32}]){
      const bad=structuredClone(config);change(bad);assert.throws(()=>parseDuelConfig(bad))
    }
    for(const action of [{type:'answer',roundId:'r',side:'left',choiceId:'yes',damage:100},{type:'answer',roundId:'r',side:'left',choiceId:'yes',critical:true},{type:'join',nickname:'untrusted'}])assert.equal(isDuelAction(action),false)
    assert.throws(()=>createDuel({...quiz,items:[]},config,timer,1000))
  })
  await test('an interrupted tournament counts only completed duels, and a balanced completed tournament can end in a tie',()=>{
    const cfg={...config,mode:'teams',left:['panda','fox'],right:['tiger','koala']}
    let state=createDuel(quiz,cfg,timer,1000),at=1100
    const abandoned=stepDuel(quiz,state,{type:'finish'},at)
    assert.equal(abandoned.aborted,true);assert.deepEqual(abandoned.wins,{left:0,right:0})
    for(let pairIndex=0;pairIndex<2;pairIndex++){
      state=stepDuel(quiz,state,{type:'start',pairIndex},at++)
      while(state.phase==='question'){state=hit(state,pairIndex?'right':'left',true,at);at=state.deadline;state=stepDuel(quiz,state,{type:'tick'},at);at++}
    }
    assert.equal(state.phase,'finished');assert.deepEqual(state.wins,{left:1,right:1});assert.equal(state.aborted,undefined)
  })
  await test('a replay journal reconstructs health, criticals and queued teams without storing questions, answer keys or score snapshots',async()=>{
    stored.clear()
    const planId=await duelPlanId(quiz),run=newDuelRun(quiz,planId,config,timer,1000)
    const actions=[{at:1010,action:{type:'start',pairIndex:0}},{at:1020,action:{type:'answer',roundId:duelRoundId(run.state),side:'right',choiceId:'no'}},{at:1030,action:{type:'pause',roundId:duelRoundId(run.state),phase:'feedback'}}]
    const journal={...run.journal,events:actions};let state=run.state
    for(const event of actions)state=stepDuel(quiz,state,event.action,event.at)
    assert.equal(writeDuel(journal),true);assert.equal(hasDuel(quiz.id,'duel'),true)
    const resumed=readDuel(quiz,planId,config,timer,2000)
    assert.deepEqual(resumed.state,state);assert.equal(resumed.warning,'')
    const raw=stored.get(duelStorageKey(quiz.id,'duel'))
    for(const forbidden of ['2 + 2','correctChoiceId','"hp"','"wins"','resolution'])assert.ok(!raw.includes(forbidden))
    const changed=structuredClone(quiz);changed.items[0].correctChoiceId='no'
    assert.notEqual(await duelPlanId(changed),planId)
    const mismatch=readDuel(changed,await duelPlanId(changed),config,timer,2000)
    assert.equal(mismatch.writable,false);assert.equal(stored.get(duelStorageKey(quiz.id,'duel')),raw)
  })
  await test('unique rosters reserve all thirty mascots and reject reuse within or between the teams',async()=>{
    const {COMPETITION_AVATARS}=await vite.ssrLoadModule('/src/interactive/competition/avatars.ts'),ids=COMPETITION_AVATARS.map(avatar=>avatar.id)
    assert.equal(parseDuelConfig({...config,mode:'teams',left:ids.slice(0,15),right:ids.slice(15)}).left.length,15)
    for(const more of [{left:['panda'],right:['panda']},{mode:'teams',left:['panda','panda'],right:['fox','koala']},{mode:'teams',left:['panda','fox'],right:['fox','tiger']}])assert.throws(()=>parseDuelConfig({...config,...more}),/différente/)
  })
  await test('a new setup seed changes the schedule, and remaining matches can be reshuffled without replaying a completed pair',()=>{
    const cfg={...config,mode:'teams',left:['panda','koala','fox'],right:['tiger','otter','koi']},seed=nextDuelSeed(cfg,cfg.seed)
    assert.notEqual(seed,cfg.seed);assert.notDeepEqual(duelPairs({...cfg,seed}),duelPairs(cfg))
    let state=createDuel(quiz,cfg,timer,1000),at=1100
    state=stepDuel(quiz,state,{type:'start',pairIndex:0},at++)
    while(state.phase==='question'){state=hit(state,'left',true,at);at=state.deadline;state=stepDuel(quiz,state,{type:'tick'},at);at++}
    const before=structuredClone(state),action={type:'reshuffle',pairIndex:1,seed}
    state=stepDuel(quiz,state,action,at)
    assert.equal(state.pairIndex,1);assert.equal(state.phase,'ready');assert.deepEqual(state.pairs[0],before.pairs[0]);assert.deepEqual(state.results,before.results);assert.deepEqual(state.wins,before.wins)
    assert.notDeepEqual(state.pairs.slice(1),before.pairs.slice(1))
    for(const side of ['left','right'])assert.deepEqual(state.pairs.map(pair=>pair[side].seat).sort(),[1,2,3])
    assert.equal(stepDuel(quiz,state,{...action,pairIndex:0,seed:seed+1},at),state)
    const playing=stepDuel(quiz,state,{type:'start',pairIndex:1},at+1)
    assert.equal(stepDuel(quiz,playing,{...action,seed:seed+1},at+2),playing)
  })
  await test('timeout damage stays ten percent on a triple question; late and repeated actions cannot apply it twice',()=>{
    let state=createDuel(quiz,{...config,seed:seedFor(3)},{...timer,enabled:true},1000)
    state=stepDuel(quiz,state,{type:'start',pairIndex:0},1100);assert.equal(duelRound(quiz,state).multiplier,3)
    state=hit(state,'left',true,state.deadline)
    assert.deepEqual(state.hp,{left:90,right:90});assert.equal(state.resolution.multiplier,1);assert.equal(state.resolution.timeout,true);assert.equal(state.resolution.side,undefined)
    assert.equal(stepDuel(quiz,state,{type:'tick'},state.resolution.at+1),state)
  })
  await test('simultaneous timeout knockout finishes as a draw without awarding either team a win',()=>{
    let state=createDuel(quiz,config,{...timer,enabled:true},1000)
    state=stepDuel(quiz,state,{type:'start',pairIndex:0},1100)
    for(let turn=0;turn<10;turn++){
      state=stepDuel(quiz,state,{type:'tick'},state.deadline)
      assert.deepEqual(state.hp,{left:90-turn*10,right:90-turn*10})
      state=stepDuel(quiz,state,{type:'tick'},state.deadline)
    }
    assert.equal(state.phase,'finished');assert.equal(state.results.length,1);assert.equal(state.results[0].draw,true);assert.equal(state.results[0].winner,undefined);assert.deepEqual(state.wins,{left:0,right:0})
  })
  await test('asymmetric timeout knockout awards the surviving fighter once, and reshuffle events replay their exact schedule',async()=>{
    const cfg={...config,mode:'teams',seed:seedFor(1),left:['panda','koala','fox'],right:['tiger','otter','koi']},timed={...timer,enabled:true},planId=await duelPlanId(quiz),run=newDuelRun(quiz,planId,cfg,timed,1000)
    let state=run.state;const events=[]
    const act=(action,at)=>{state=stepDuel(quiz,state,action,at);events.push({action,at})}
    act({type:'start',pairIndex:0},1100);act({type:'answer',roundId:duelRoundId(state),side:'left',choiceId:'yes'},1200);act({type:'tick'},state.deadline)
    for(let turn=0;turn<9;turn++){act({type:'tick'},state.deadline);act({type:'tick'},state.deadline)}
    assert.equal(state.phase,'ready');assert.equal(state.pairIndex,1);assert.equal(state.results[0].winner,'left');assert.deepEqual(state.wins,{left:1,right:0})
    act({type:'reshuffle',pairIndex:1,seed:99},events.at(-1).at+1)
    const record={...run.journal,events};assert.equal(writeDuel(record),true)
    const resumed=readDuel(quiz,planId,cfg,timed,events.at(-1).at+1)
    assert.equal(resumed.warning,'');assert.deepEqual(resumed.state,state)
  })
  await test('unknown, old-rule, forged and expired journals are preserved and cannot supply health or critical damage',async()=>{
    const planId=await duelPlanId(quiz),run=newDuelRun(quiz,planId,config,timer,1000),key=duelStorageKey(quiz.id,'duel')
    for(const change of [v=>{v.version=99},v=>{v.version=1},v=>{v.hp={left:900,right:0}},v=>{v.config.left=['untrusted']},v=>{v.events=[{at:1010,action:{type:'answer',roundId:duelRoundId(run.state),side:'left',choiceId:'yes',damage:100}}]},v=>{v.events=[{at:1001,action:{type:'tick'}},{at:1000,action:{type:'tick'}}]}]){
      const value=structuredClone(run.journal);change(value);const raw=JSON.stringify(value);stored.set(key,raw)
      assert.equal(readDuel(quiz,planId,config,timer,2000).writable,false);assert.equal(stored.get(key),raw)
    }
    const raw=JSON.stringify(run.journal);stored.set(key,raw)
    assert.equal(readDuel(quiz,planId,config,timer,1000+DUEL_LIFETIME).writable,false);assert.equal(stored.get(key),raw)
  })
}finally{globalThis.sessionStorage=previous;await vite.close()}
