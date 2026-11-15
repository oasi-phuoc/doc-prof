import assert from 'node:assert/strict'
import {test} from 'node:test'
import {createServer} from 'vite'
const vite=await createServer({server:{middlewareMode:true,hmr:false},appType:'custom'})
try{
 const {validImageStroke,validImageAnnotations,annotationQuestion,extendImageStroke,MAX_IMAGE_STROKES,MAX_STROKE_POINTS}=await vite.ssrLoadModule('/src/interactive/domain/image-annotations.ts')
 const {startSession,transition}=await vite.ssrLoadModule('/src/interactive/domain/session.ts'),{runtimeFor}=await vite.ssrLoadModule('/src/interactive/domain/round-runtime.ts')
 const {newRecord,compactSession,replaySession,planIdentity}=await vite.ssrLoadModule('/src/interactive/domain/persistence.ts'),{copySession}=await vite.ssrLoadModule('/src/interactive/domain/checkpoint.ts')
 const {competitionQuiz}=await vite.ssrLoadModule('/src/interactive/competition/core.ts')
 const oral={id:'oral',source:{page:0,block:0,item:0,part:0,exerciseType:'tcf-po'},title:'Oral',instruction:'Décrivez.',prompt:'Décrivez la scène.',images:['/oral-a.png'],mode:'oral',choices:[],compatibility:'teacher-led'}
 const story={...oral,id:'story',source:{...oral.source,page:1},images:['/scene-a.png','/scene-b.png','/scene-c.png','/scene-d.png'],mode:'sequence'}
 const choice={...oral,id:'choice',source:{...oral.source,page:2},mode:'choice',compatibility:'auto',choices:[{id:'yes',text:'Oui'},{id:'no',text:'Non'}]}
 const game={id:'annotations',seed:42,title:'Oral',questions:[oral,story,choice],corrections:{oral:{text:'Private oral model, never journalled.'},story:{text:'Private sequence model.'},choice:{text:'Oui',choiceId:'yes'}},issues:[]}
 const stroke={tool:'pen',color:'red',points:[[100,200],[300,400],[700,600]]}
 const add=(q=oral,imageIndex=0,value=stroke,attempt=0)=>({type:'IMAGE_ANNOTATION_ADD',questionId:q.id,imageIndex,attempt,stroke:structuredClone(value),roundId:q.id})
 const operation=(type,q=oral,imageIndex=0,attempt=0)=>({type,questionId:q.id,imageIndex,attempt,roundId:q.id})
 const marks=(state,q=oral,image=0)=>runtimeFor(game,state,game.questions.indexOf(q)).imageAnnotations?.[q.id]?.[image]??[]

 await test('only bounded public vector shapes for manual image activities are accepted; original image positions remain explicit',()=>{
  assert.ok(annotationQuestion(oral)&&annotationQuestion(story));assert.equal(annotationQuestion(choice),false);assert.equal(annotationQuestion({...story,words:['Un','jour']}),false)
  for(const tool of ['pen','highlighter','rectangle','ellipse'])assert.equal(validImageStroke({...stroke,tool}),tool==='pen'||tool==='highlighter')
  assert.equal(validImageStroke({...stroke,tool:'rectangle',points:[[100,200],[700,600]]}),true)
  for(const bad of [{...stroke,color:'__proto__'},{...stroke,tool:'script'},{...stroke,url:'/secret.png'},{...stroke,points:[]},{...stroke,points:Array(3)},{...stroke,points:[[0,-1]]},{...stroke,points:[[1001,0]]},{...stroke,points:[[1.2,2]]},{...stroke,points:[[Infinity,2]]},{...stroke,points:[[1,2,3]]},{...stroke,points:Array(MAX_STROKE_POINTS+1).fill([0,0])},{...stroke,tool:'ellipse',points:[[10,20],[10,50]]}])assert.equal(validImageStroke(bad),false)
  assert.equal(validImageAnnotations(story,{'3':[stroke]}),true)
  for(const data of [{'4':[stroke]},{'00':[stroke]},{'0':[...Array(MAX_IMAGE_STROKES+1)].map(()=>stroke)},{'0':[{...stroke,answer:'private'}]}])assert.equal(validImageAnnotations(story,data),false)
  let long={...stroke,points:[[0,0]]};for(let i=1;i<=1000;i++)long=extendImageStroke(long,[i,i])
  assert.ok(long.points.length<=MAX_STROKE_POINTS);assert.deepEqual(long.points[0],[0,0]);assert.deepEqual(long.points.at(-1),[1000,1000]);assert.equal(validImageStroke(long),true)
 })
 await test('add, undo and clear touch one image only, copy their geometry and leave source data and marking untouched',async()=>{
  const source=structuredClone(game),identity=await planIdentity(game);let state=startSession(game)
  const action=add();state=transition(game,state,action);action.stroke.points[0][0]=999;assert.deepEqual(marks(state),[stroke])
  state=transition(game,state,{type:'NAVIGATE',index:1});state=transition(game,state,add(story,3));state=transition(game,state,add(story,0))
  state=transition(game,state,operation('IMAGE_ANNOTATION_UNDO',story,0));assert.equal(marks(state,story,0).length,0);assert.equal(marks(state,story,3).length,1)
  state=transition(game,state,operation('IMAGE_ANNOTATION_CLEAR',story,3));assert.equal(marks(state,story,3).length,0)
  state=transition(game,state,{type:'NAVIGATE',index:0});assert.deepEqual(marks(state),[stroke]);assert.deepEqual(state.history,[])
  const copied=copySession(state);copied.roundStates.oral.imageAnnotations.oral['0'][0].points[0][0]=900;assert.deepEqual(marks(state),[stroke]);assert.deepEqual(game,source);assert.equal(await planIdentity(game),identity)
 })
 await test('pause, lock, finished state, stale screen or attempt, malformed geometry and full boards forbid changes',()=>{
  const initial=startSession(game),action=add()
  for(const state of [{...initial,paused:true},{...initial,teacherLocked:true},{...initial,finished:true}])assert.equal(transition(game,state,action),state)
  for(const bad of [add(oral,-1),add(oral,1),add(oral,0,{...stroke,points:[[2000,0]]}),add(oral,0,stroke,1),{...action,roundId:'story'}])assert.equal(transition(game,initial,bad),initial)
  let state=initial;for(let i=0;i<MAX_IMAGE_STROKES;i++)state=transition(game,state,action)
  assert.equal(marks(state).length,MAX_IMAGE_STROKES);assert.equal(transition(game,state,action),state)
  state=transition(game,state,{type:'NAVIGATE',index:1});assert.equal(transition(game,state,action),state)
  state=transition(game,state,{type:'NAVIGATE',index:2});assert.equal(transition(game,state,add(choice)),state)
 })
 await test('reveal stays teacher-led, a new attempt starts blank and its stale predecessor cannot draw on it',()=>{
  let state=transition(game,startSession(game),add());assert.equal(state.phase,'thinking')
  for(const type of ['CARDS_UP','DISCUSS','REVEAL'])state=transition(game,state,{type},1000)
  assert.equal(state.history[0].correct,undefined);state=transition(game,state,add());assert.equal(marks(state).length,2)
  state=transition(game,state,{type:'RETRY_QUESTION',roundId:'oral'});assert.equal(runtimeFor(game,state).attempt,1);assert.equal(marks(state).length,0)
  assert.equal(transition(game,state,add()),state);state=transition(game,state,add(oral,0,stroke,1));assert.equal(marks(state).length,1)
  const solo=transition(game,transition(game,startSession(game,'solo'),add()),{type:'TIMEOUT'});assert.equal(solo.history[0].correct,undefined);assert.equal(marks(solo).length,1)
  assert.deepEqual(competitionQuiz(game,'https://class.example').items.map(item=>item.question.id),[choice.id])
 })
 await test('event replay and compacted checkpoints retain only committed shapes; invalid drawings cannot enter restored sessions',async()=>{
  const actions=[add(),{type:'NAVIGATE',index:1},add(story,3),add(story,1),operation('IMAGE_ANNOTATION_UNDO',story,1),{type:'NAVIGATE',index:0}]
  const events=actions.map((action,index)=>({eventId:String(index),at:1000+index,action}));let state=startSession(game)
  for(const event of events)state=transition(game,state,event.action,event.at)
  const record={...await newRecord(game,'class'),updatedAt:1010,events},id=await planIdentity(game)
  assert.deepEqual(replaySession(game,record,id,1020).state,state)
  const compacted=compactSession(record,state);assert.deepEqual(replaySession(game,compacted,id,1020).state,state)
  const serialized=JSON.stringify(compacted);assert.ok(!serialized.includes('/oral-a.png')&&!serialized.includes(game.corrections.oral.text))
  const bad=structuredClone(compacted);bad.checkpoint.state.roundStates.oral.imageAnnotations.oral['0'][0].points[0][0]=1001
  assert.throws(()=>replaySession(game,bad,id,1020))
  const altered=structuredClone(record);altered.events[0].action.stroke={...stroke,color:'__proto__'};assert.throws(()=>replaySession(game,altered,id,1020))
 })
}finally{await vite.close()}
