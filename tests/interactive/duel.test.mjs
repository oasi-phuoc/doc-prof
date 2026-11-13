import assert from 'node:assert/strict'
import {test} from 'node:test'
import {createServer} from 'vite'
const vite=await createServer({server:{middlewareMode:true,hmr:false},appType:'custom'})
const previous=globalThis.sessionStorage,stored=new Map()
globalThis.sessionStorage={getItem:key=>stored.get(key)??null,setItem:(key,value)=>stored.set(key,String(value))}
try{
  const {createDuel,stepDuel,duelRound,duelRoundId,duelPairs,parseDuelConfig,isDuelAction,DUEL_LIFETIME}=await vite.ssrLoadModule('/src/interactive/duel/core.ts')
  const {newDuelRun,readDuel,writeDuel,duelPlanId}=await vite.ssrLoadModule('/src/interactive/duel/storage.ts')
  const {hasDuel,duelStorageKey}=await vite.ssrLoadModule('/src/interactive/duel/storage-key.ts')
  const quiz={id:'duel-source',title:'Calcul',items:[{question:{id:'q1',prompt:'2 + 2 = ?',images:[],choices:[{id:'yes',text:'4'},{id:'no',text:'5'}]},correctChoiceId:'yes'}]}
  const timer={enabled:false,seconds:5,feedbackSeconds:1},config={mode:'duel',seed:42,left:['panda'],right:['fox']}
  const fresh=(seed=42,mode='duel',more={})=>createDuel(quiz,{...config,seed,mode,...more},timer,1000)
  const start=state=>stepDuel(quiz,state,{type:'start',pairIndex:state.pairIndex},1010)
  const hit=(state,side='left',correct=true,at=1020)=>stepDuel(quiz,state,{type:'answer',roundId:duelRoundId(state),side,choiceId:correct?'yes':'no'},at)
  const seedFor=critical=>{for(let seed=0;seed<1000;seed++)if(duelRound(quiz,fresh(seed)).critical===critical)return seed;throw new Error('Missing deterministic branch')}

  await test('normal and critical hits apply 10 or 20 percent to the opponent on a correct answer and to oneself on an error',()=>{
    for(const critical of [false,true])for(const side of ['left','right'])for(const correct of [false,true]){
      const state=start(fresh(seedFor(critical))),before=structuredClone(state),next=hit(state,side,correct)
      const victim=correct?(side==='left'?'right':'left'):side,damage=critical?20:10
      assert.equal(next.hp[victim],100-damage);assert.equal(next.hp[victim==='left'?'right':'left'],100)
      assert.equal(next.resolution.critical,critical);assert.equal(next.resolution.damage,damage);assert.equal(next.resolution.victim,victim)
      assert.equal(next.phase,'feedback');assert.deepEqual(state,before)
    }
  })
  await test('the first valid click resolves the turn exactly once and stale clicks cannot strike the next question',()=>{
    const state=start(fresh(seedFor(false))),first=hit(state)
    assert.equal(hit(first,'right',false,1020),first)
    assert.equal(hit(first,'left',true,1030),first)
    const next=stepDuel(quiz,first,{type:'tick'},first.deadline)
    assert.notEqual(duelRoundId(next),duelRoundId(state))
    const stale=stepDuel(quiz,next,{type:'answer',roundId:duelRoundId(state),side:'right',choiceId:'no'},next.deadline??3000)
    assert.equal(stale,next);assert.deepEqual(stale.hp,{left:100,right:90})
    assert.throws(()=>stepDuel(quiz,next,{type:'answer',roundId:duelRoundId(next),side:'left',choiceId:'forged'},3000),/proposée/)
  })
  await test('critical rolls are deterministic, independent of answer speed and distributed around one question in four',()=>{
    let criticals=0
    for(let seed=0;seed<2000;seed++){
      const state=start(fresh(seed)),round=duelRound(quiz,state)
      criticals+=Number(round.critical)
      assert.deepEqual(duelRound(quiz,state),round)
      assert.equal(hit(state,'left',true,1020).resolution.damage,hit(state,'right',false,2000).resolution.damage)
    }
    assert.ok(criticals>380&&criticals<620,`${criticals}/2000`)
  })
  await test('a quiz repeats in shuffled cycles until knockout, clamps health at zero and records the winner once',()=>{
    let state=start(fresh(seedFor(true))),at=1100,turns=0
    while(state.phase!=='finished'){
      assert.equal(duelRound(quiz,state).item.correctChoiceId,'yes')
      state=hit(state,'left',true,at);turns++
      assert.ok(state.hp.right>=0)
      state=stepDuel(quiz,state,{type:'tick'},state.deadline);at=state.createdAt+turns*1100+100
    }
    assert.ok(turns>=5&&turns<=10);assert.equal(state.hp.right,0);assert.equal(state.hp.left,100)
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
  await test('timeout causes no damage, pause preserves remaining time and late pause requests do not suspend a new turn',()=>{
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
    assert.deepEqual(state.hp,{left:100,right:100});assert.equal(state.resolution.damage,0)
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
  await test('unknown, forged and expired journals are preserved and cannot supply health or critical damage',async()=>{
    const planId=await duelPlanId(quiz),run=newDuelRun(quiz,planId,config,timer,1000),key=duelStorageKey(quiz.id,'duel')
    for(const change of [v=>{v.version=99},v=>{v.hp={left:900,right:0}},v=>{v.config.left=['untrusted']},v=>{v.events=[{at:1010,action:{type:'answer',roundId:duelRoundId(run.state),side:'left',choiceId:'yes',damage:100}}]},v=>{v.events=[{at:1001,action:{type:'tick'}},{at:1000,action:{type:'tick'}}]}]){
      const value=structuredClone(run.journal);change(value);const raw=JSON.stringify(value);stored.set(key,raw)
      assert.equal(readDuel(quiz,planId,config,timer,2000).writable,false);assert.equal(stored.get(key),raw)
    }
    const raw=JSON.stringify(run.journal);stored.set(key,raw)
    assert.equal(readDuel(quiz,planId,config,timer,1000+DUEL_LIFETIME).writable,false);assert.equal(stored.get(key),raw)
  })
}finally{globalThis.sessionStorage=previous;await vite.close()}
