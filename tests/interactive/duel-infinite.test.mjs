import assert from 'node:assert/strict'
import {test} from 'node:test'
import {createServer} from 'vite'
const vite=await createServer({server:{middlewareMode:true,hmr:false},appType:'custom',cacheDir:'/tmp/clairfle-infinite-unit'})
const previous=globalThis.sessionStorage,store=new Map();globalThis.sessionStorage={getItem:key=>store.get(key)??null,setItem:(key,value)=>store.set(key,value)}
try{
 const {parseDuelRules,DEFAULT_DUEL_RULES}=await vite.ssrLoadModule('/src/interactive/duel/rules.ts')
 const {createDuel,stepDuel,duelRoundId}=await vite.ssrLoadModule('/src/interactive/duel/core.ts')
 const {newDuelRun,readDuel,writeDuel,duelPlanId}=await vite.ssrLoadModule('/src/interactive/duel/storage.ts')
 const {impactFor}=await vite.ssrLoadModule('/src/interactive/duel/effects.ts')
 const quiz={id:'infinite-fixture',title:'Calcul',items:Array.from({length:3},(_,i)=>({question:{id:`q${i}`,prompt:`${i} + 1`,images:[],choices:[{id:'yes',text:String(i+1)},{id:'no',text:'9'}]},correctChoiceId:'yes'}))}
 const timer={enabled:false,seconds:5,feedbackSeconds:1},config={mode:'duel',seed:42,left:['leaf'],right:['owl'],combat:{...DEFAULT_DUEL_RULES,questionLimit:10,critical2:0,critical3:0,critical4:100}}
 const start=(state,at=state.createdAt+1)=>stepDuel(quiz,state,{type:'start',pairIndex:state.pairIndex},at)
 const answer=(state,side,correct,at)=>stepDuel(quiz,state,{type:'answer',roundId:duelRoundId(state),side,choiceId:correct?'yes':'no'},at)
 const next=state=>stepDuel(quiz,state,{type:'tick'},state.deadline)
 await test('new health choices are exactly 100 or 200 and infinite limits are bounded integers',()=>{
  for(const maxHp of [100,200])for(const questionLimit of [undefined,1,10,15,20,100])assert.equal(parseDuelRules({...DEFAULT_DUEL_RULES,maxHp,...(questionLimit?{questionLimit}:{})}).maxHp,maxHp)
  for(const maxHp of [0,10,99,101,150,199,201])assert.throws(()=>parseDuelRules({...DEFAULT_DUEL_RULES,maxHp}))
  for(const questionLimit of [0,-1,101,10.5,'10',NaN,null])assert.throws(()=>parseDuelRules({...DEFAULT_DUEL_RULES,questionLimit}))
  assert.throws(()=>parseDuelRules({...DEFAULT_DUEL_RULES,score:100}))
 })
 await test('ten questions finish by correct-answer count, critical ×4 never gives bonus score or removes life',()=>{
  let state=start(createDuel(quiz,config,timer,1000)),at=1010
  for(let i=0;i<10;i++){
   const before=structuredClone(state),id=duelRoundId(state)
   state=answer(state,i<7?'left':'right',true,at)
   assert.deepEqual(before.hp,{left:100,right:100});assert.deepEqual(state.hp,before.hp)
   assert.equal(state.resolution.damage,0);assert.equal(state.resolution.multiplier,4)
   assert.equal(state.scores.left+state.scores.right,i+1)
   assert.equal(stepDuel(quiz,state,{type:'answer',roundId:id,side:'right',choiceId:'yes'},at),state)
   assert.equal(impactFor(state.resolution,state.pairs[0],id).kind,'attack')
   if(i<9)assert.equal(state.results.length,0)
   state=next(state);at=state.deadline??at+10000
  }
  assert.equal(state.phase,'finished');assert.deepEqual(state.scores,{left:7,right:3})
  assert.equal(state.results[0].winner,'left');assert.deepEqual(state.results[0].scores,{left:7,right:3});assert.deepEqual(state.wins,{left:1,right:0})
 })
 await test('errors and timeouts consume questions without points or damage, including a tie after fifteen questions',()=>{
  let state=start(createDuel(quiz,{...config,combat:{...config.combat,questionLimit:15}},{...timer,enabled:true},1000))
  for(let i=0;i<15;i++){
   state=i%2?answer(state,'left',false,state.deadline-1):stepDuel(quiz,state,{type:'tick'},state.deadline)
   assert.deepEqual(state.hp,{left:100,right:100});assert.deepEqual(state.scores,{left:0,right:0});assert.equal(state.resolution.damage,0)
   if(i%2)assert.equal(impactFor(state.resolution,state.pairs[0],duelRoundId(state)).kind,'mistake')
   state=next(state)
  }
  assert.equal(state.phase,'finished');assert.equal(state.results[0].draw,true);assert.deepEqual(state.wins,{left:0,right:0})
 })
 await test('equal scores finish as a draw, and each team pair gets its own question budget and fresh scores',()=>{
  const teams={...config,mode:'teams',left:['leaf','panda'],right:['owl','fox'],combat:{...config.combat,questionLimit:2}}
  let state=start(createDuel(quiz,teams,timer,1000))
  for(const side of ['left','right'])state=next(answer(state,side,true,(state.deadline??1001)+1))
  assert.equal(state.phase,'ready');assert.equal(state.pairIndex,1);assert.deepEqual(state.scores,{left:0,right:0});assert.equal(state.results[0].draw,true)
  state=start(state,20000)
  for(let i=0;i<2;i++)state=next(answer(state,'right',true,(state.deadline??20001)+1))
  assert.equal(state.phase,'finished');assert.equal(state.results.length,2);assert.deepEqual(state.wins,{left:0,right:1});assert.deepEqual(state.results[1].scores,{left:0,right:2})
 })
 await test('scores survive pause and journal replay with their original limit; stop never awards an unfinished match',async()=>{
  const plan=await duelPlanId(quiz),run=newDuelRun(quiz,plan,config,{...timer,enabled:true},1000)
  let state=run.state,events=[]
  const act=(action,at)=>{state=stepDuel(quiz,state,action,at);events.push({action,at})}
  act({type:'start',pairIndex:0},1010)
  act({type:'answer',roundId:duelRoundId(state),side:'right',choiceId:'yes'},1020)
  act({type:'tick'},state.deadline)
  const pausedAt=state.deadline-1000
  act({type:'pause',roundId:duelRoundId(state),phase:state.phase},pausedAt)
  assert.equal(state.paused,true)
  assert(writeDuel({...run.journal,events}))
  const restored=readDuel(quiz,plan,{...config,combat:{...DEFAULT_DUEL_RULES,maxHp:200}},timer,pausedAt+1)
  assert.equal(restored.warning,'');assert.deepEqual(restored.state,state);assert.equal(restored.state.config.combat.questionLimit,10)
  assert.deepEqual(state.scores,{left:0,right:1})
  const ended=stepDuel(quiz,state,{type:'finish'},pausedAt+2);assert.equal(ended.aborted,true);assert.deepEqual(ended.wins,{left:0,right:0});assert.equal(ended.results.length,0)
 })
 await test('old version-four journals keep intermediate health but cannot introduce infinite mode',async()=>{
  const legacy={...config,combat:{maxHp:150,critical2:0,critical3:0,critical4:100}},plan=await duelPlanId(quiz)
  const old=createDuel(quiz,legacy,timer,1000,4);assert.equal(old.scores,undefined)
  const events=[{at:1010,action:{type:'start',pairIndex:0}},{at:1020,action:{type:'answer',roundId:duelRoundId(old),side:'left',choiceId:'yes'}}]
  assert(writeDuel({version:4,quizId:quiz.id,planId:plan,config:legacy,timer,createdAt:1000,events}))
  const resumed=readDuel(quiz,plan,config,timer,1100);assert.equal(resumed.warning,'');assert.deepEqual(resumed.state.hp,{left:150,right:110});assert.equal(resumed.state.version,4)
  assert.throws(()=>createDuel(quiz,legacy,timer,1000));assert.throws(()=>createDuel(quiz,config,timer,1000,4))
 })
}finally{globalThis.sessionStorage=previous;await vite.close()}
