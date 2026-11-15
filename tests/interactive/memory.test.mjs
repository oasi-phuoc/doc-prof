import assert from 'node:assert/strict'
import {test} from 'node:test'
import {createServer} from 'vite'
const vite=await createServer({server:{middlewareMode:true,hmr:false},appType:'custom'})
try{
 const {convertRecipe}=await vite.ssrLoadModule('/src/interactive/domain/convert.ts'),{defaultPage}=await vite.ssrLoadModule('/src/math/catalog.ts'),{defaultThemeGameContent}=await vite.ssrLoadModule('/src/jeux/bank.ts'),{demoRecipe}=await vite.ssrLoadModule('/src/interactive/demo.ts')
 const {applyPlanOptions,DEFAULT_PLAN_OPTIONS,readPlanOptions}=await vite.ssrLoadModule('/src/interactive/domain/plan-options.ts'),{memoryGame,memorySelection}=await vite.ssrLoadModule('/src/interactive/domain/memory-conversion.ts')
 const {validMemoryQuestion,validMemoryRuntime,emptyMemory,MAX_MEMORY_TURNS}=await vite.ssrLoadModule('/src/interactive/domain/memory.ts'),{prepareGame,roundsFor}=await vite.ssrLoadModule('/src/interactive/domain/plan.ts')
 const {startSession,transition}=await vite.ssrLoadModule('/src/interactive/domain/session.ts'),{runtimeFor,questionsForAttempt}=await vite.ssrLoadModule('/src/interactive/domain/round-runtime.ts')
 const {newRecord,compactSession,replaySession,planIdentity}=await vite.ssrLoadModule('/src/interactive/domain/persistence.ts'),{copySession}=await vite.ssrLoadModule('/src/interactive/domain/checkpoint.ts'),{presetOptions,readLocalPreset}=await vite.ssrLoadModule('/src/interactive/presets.ts')
 const {buildWorksheets}=await vite.ssrLoadModule('/src/math/generate.ts'),{positionOf}=await vite.ssrLoadModule('/src/interactive/domain/source-position.ts')
 const recipe=(type='jeux-vocabulaire',seed=1,n)=>{const page={...defaultPage('jeux'),...defaultThemeGameContent(type,'fruits'),domain:'jeux',topic:'jeux-fruits',exerciseType:type,count:1,columns:1,extraBlocks:undefined,libreItems:undefined};if(n)page.gameEntries=page.gameEntries.slice(0,n);return {...demoRecipe(),seed,pages:[page],libreMode:false}}
 const source=convertRecipe(recipe()),game=prepareGame(applyPlanOptions(source,{...DEFAULT_PLAN_OPTIONS,memory:true})),q=game.questions[0],roundId=roundsFor(game)[0].id,pairs=game.corrections[q.id].memoryPairs
 const action=(type,cardId,attempt=0)=>({type,questionId:q.id,attempt,roundId,...(cardId?{cardId}:{})}),flip=(s,id,attempt=0)=>transition(game,s,action('MEMORY_FLIP',id,attempt)),check=s=>transition(game,s,action('MEMORY_CHECK'))
 const board=s=>runtimeFor(game,s).memoryBoards?.[q.id]??emptyMemory()
 const wrong=[pairs[0][0],pairs[1][0]],reveal=s=>['CARDS_UP','DISCUSS','REVEAL'].reduce((s,type)=>transition(game,s,{type},1000),s)

 await test('real source banks become balanced four/six-card boards with every verified pair, deterministic seeds and unchanged paper',()=>{
  const orders=new Set()
  for(const type of ['jeux-memory','jeux-vocabulaire'])for(let seed=1;seed<=50;seed++){
   const input=recipe(type,seed),before=structuredClone(input),original=convertRecipe(input),paper=seed===1?structuredClone(buildWorksheets(input.pages,seed)):null,converted=memoryGame(original)
   assert.equal(converted.questions.length,type==='jeux-memory'?2:3);assert.deepEqual(memoryGame(original),converted)
   assert.deepEqual(converted.questions.flatMap(q=>q.memoryBoard.sourceKeys).sort(),original.questions.map(positionOf).sort())
   for(const q of converted.questions){assert.ok(validMemoryQuestion(converted,q));assert.ok([4,6].includes(q.memoryBoard.cards.length));assert.deepEqual(q.choices,[]);assert.equal(q.matchingGroup,undefined)
    for(const ids of converted.corrections[q.id].memoryPairs){const pair=ids.map(id=>q.memoryBoard.cards.find(c=>c.id===id)),image=pair.find(c=>c.image),word=pair.find(c=>c.text),old=original.questions.find(old=>old.images[0]===image.image);assert.equal(word.text,old.choices.find(c=>c.id===original.corrections[old.id].choiceId).text)}
   }
   orders.add(JSON.stringify(converted.questions.map(q=>q.memoryBoard.cards.map(c=>c.text??c.image))));assert.deepEqual(input,before);if(paper)assert.deepEqual(buildWorksheets(input.pages,seed),paper)
  }
  assert.ok(orders.size>40)
 })
 await test('small banks keep every pair, while ambiguous, missing, repeated or oversized faces retain their source questions',()=>{
  for(const n of [2,3,4,5,7,8,9]){const original=convertRecipe(recipe('jeux-vocabulaire',7,n)),next=memoryGame(original);assert.equal(next.questions.flatMap(q=>q.memoryBoard.cards).length,n*2)}
  for(const mutate of [g=>{g.questions[1].images=[g.questions[0].images[0]]},g=>{g.questions[1].mode='oral'},g=>{g.questions[0].images=[]},g=>{delete g.corrections[g.questions[0].id].choiceId},g=>{g.questions[0].choices.find(c=>c.id===g.corrections[g.questions[0].id].choiceId).text='x'.repeat(121)}]){const g=structuredClone(source);mutate(g);const next=memoryGame(g);assert.deepEqual(next.questions,g.questions);assert.ok(next.issues.length>g.issues.length)}
  const malformed=structuredClone(game);malformed.questions[0].memoryBoard.cards[0]=null;assert.equal(validMemoryQuestion(malformed,malformed.questions[0]),false)
 })
 await test('option-off identity stays compatible; caps never discard a memory card and selections map entire boards in both directions',()=>{
  assert.equal(applyPlanOptions(source,DEFAULT_PLAN_OPTIONS),source);assert.deepEqual(readPlanOptions({...DEFAULT_PLAN_OPTIONS,memory:false}),DEFAULT_PLAN_OPTIONS)
  for(const maxChoices of [2,3,4,5,6]){const next=applyPlanOptions(source,{...DEFAULT_PLAN_OPTIONS,memory:true,maxChoices});assert.ok(next.questions.every(q=>q.memoryBoard.cards.length===6))}
  const one=source.questions[1],selected=memorySelection([positionOf(one)],source,true);assert.deepEqual(selected,[positionOf(game.questions[0])]);assert.deepEqual(memorySelection(selected,game,false),game.questions[0].memoryBoard.sourceKeys)
  assert.throws(()=>readPlanOptions({...DEFAULT_PLAN_OPTIONS,memory:'true'}))
  const preset=readLocalPreset({version:2,presetId:'memory',sourceKey:'source',name:'Mémory',conversionVersion:1,paletteVersion:1,contentHashAtSave:'1',selectedQuestionIds:selected,...DEFAULT_PLAN_OPTIONS,memory:true,revealPolicy:'teacher-only',correctionTiming:'deferred',voteBeforeBoard:true,timer:{enabled:false,defaultSec:30,feedbackSec:5},scoring:{mode:'none'},effects:{badges:false},playMode:'class',revision:0,createdAt:1,updatedAt:1});assert.equal(presetOptions(preset).memory,true)
 })
 await test('Class keeps two neutral faces until teacher validation, locks a third and permits cancellation without counting an attempt',()=>{
  let state=flip(flip(startSession(game),pairs[0][0]),pairs[0][1]);assert.equal(board(state).found.length,0);assert.equal(board(state).turns,0);assert.equal(state.phase,'thinking')
  assert.equal(flip(state,pairs[1][0]),state);state=transition(game,state,action('MEMORY_CANCEL'));assert.deepEqual(board(state),emptyMemory())
  state=check(flip(flip(state,pairs[0][0]),pairs[0][1]));assert.equal(board(state).found.length,2);assert.equal(board(state).turns,1);assert.equal(state.history.length,0)
  for(const pair of pairs.slice(1))state=check(flip(flip(state,pair[0]),pair[1]));assert.equal(state.phase,'thinking');state=reveal(state);assert.equal(state.history[0].correct,undefined)
 })
 await test('incorrect pairs count once, stay visible for observation and close when the next card is flipped',()=>{
  for(const mode of ['class','solo']){let state=flip(flip(startSession(game,mode),wrong[0]),wrong[1]);if(mode==='class')state=check(state);assert.equal(board(state).checked,true);assert.equal(board(state).misses,1);assert.equal(check(state),state)
   state=flip(state,pairs[0][1]);assert.deepEqual(board(state).open,[pairs[0][1]]);assert.equal(board(state).checked,false);assert.equal(board(state).misses,1)
  }
 })
 await test('Solo automatically checks pairs, completes on the last match and grades unfinished timeout as false',()=>{
  let state=startSession(game,'solo');for(const pair of pairs)state=flip(flip(state,pair[0]),pair[1]);assert.equal(state.phase,'revealed');assert.equal(state.history[0].correct,true);assert.equal(board(state).turns,pairs.length)
  const timed=transition(game,flip(startSession(game,'solo'),pairs[0][0]),{type:'TIMEOUT'});assert.equal(timed.history[0].correct,false);assert.equal(timed.phase,'revealed');assert.equal(transition(game,timed,action('MEMORY_CANCEL')),timed)
  assert.equal(transition(game,state,{type:'ASSESS',value:'acquired'}),state)
 })
 await test('pause, lock, stale round/attempt, missing scope, foreign cards and reveal cannot alter a board',()=>{
  const initial=startSession(game),flipAction=action('MEMORY_FLIP',pairs[0][0]);for(const state of [{...initial,paused:true},{...initial,teacherLocked:true},{...initial,finished:true},reveal(initial)])assert.equal(transition(game,state,flipAction),state)
  for(const a of [{...flipAction,attempt:1},{...flipAction,roundId:'other'},{...flipAction,roundId:undefined},{...flipAction,cardId:'private'},action('MEMORY_CHECK'),action('MEMORY_CANCEL')])assert.equal(transition(game,initial,a),initial)
  const full={...emptyMemory(),turns:MAX_MEMORY_TURNS,misses:MAX_MEMORY_TURNS};const state={...initial,roundStates:{[roundId]:{...runtimeFor(game,initial),memoryBoards:{[q.id]:full}}}};assert.equal(transition(game,state,flipAction),state)
 })
 await test('new attempts archive the previous board, reset counters, reshuffle faces reproducibly and reject late flips',()=>{
  let state=reveal(check(flip(flip(startSession(game),pairs[0][0]),pairs[0][1])));state=transition(game,state,{type:'RETRY_QUESTION',roundId});assert.equal(board(state).turns,0);assert.equal(state.previousAttempts[0].memoryBoards[q.id].found.length,2)
  assert.equal(transition(game,state,action('MEMORY_FLIP',pairs[0][0])),state);assert.equal(board(flip(state,pairs[0][0],1)).open.length,1)
  const next=questionsForAttempt(game,0,1)[0];assert.notDeepEqual(next.memoryBoard.cards,q.memoryBoard.cards);assert.deepEqual(questionsForAttempt(game,0,1)[0],next);assert.deepEqual(next.memoryBoard.cards.map(c=>c.id).sort(),q.memoryBoard.cards.map(c=>c.id).sort())
  const copied=copySession(state);copied.previousAttempts[0].memoryBoards[q.id].found.length=0;assert.equal(state.previousAttempts[0].memoryBoards[q.id].found.length,2)
 })
 await test('journals and compacted snapshots resume Class and Solo with counters and grades, but contain no faces or private pair keys',async()=>{
  for(const mode of ['class','solo']){
   const actions=pairs.flatMap(pair=>[action('MEMORY_FLIP',pair[0]),action('MEMORY_FLIP',pair[1]),...(mode==='class'?[action('MEMORY_CHECK')]:[])]);if(mode==='class')actions.push(...['CARDS_UP','DISCUSS','REVEAL'].map(type=>({type})),{type:'RETRY_QUESTION',roundId})
   let state=startSession(game,mode);const events=actions.map((action,index)=>({eventId:String(index),at:1000+index,action}));for(const event of events)state=transition(game,state,event.action,event.at)
   const record={...await newRecord(game,mode),updatedAt:1100,events},identity=await planIdentity(game),compact=compactSession(record,state);assert.deepEqual(replaySession(game,record,identity,1200,mode).state,state);assert.deepEqual(replaySession(game,compact,identity,1200,mode).state,state)
   const text=JSON.stringify(compact);assert.ok(!text.includes('memoryPairs')&&!q.memoryBoard.cards.some(c=>text.includes(c.image??c.text)))
   if(mode==='solo'){const copy=copySession(state);copy.roundStates[roundId].memoryBoards[q.id].found.length=0;assert.equal(board(state).found.length,6)}
  }
 })
 await test('forged matches, impossible counters, automatic grades and action payloads are rejected on restore',async()=>{
  let state=startSession(game,'solo');for(const pair of pairs)state=flip(flip(state,pair[0]),pair[1]);const record=compactSession({...await newRecord(game,'solo'),updatedAt:1100},state),identity=await planIdentity(game)
  for(const mutate of [s=>{s.history[0].correct=false},s=>{s.roundStates[roundId].memoryBoards[q.id].found=wrong},s=>{s.roundStates[roundId].memoryBoards[q.id].turns=0},s=>{s.roundStates[roundId].memoryBoards[q.id].open=[pairs[0][0]]},s=>{s.roundStates[roundId].memoryBoards[q.id].answer='private'}]){const bad=structuredClone(record);mutate(bad.checkpoint.state);assert.throws(()=>replaySession(game,bad,identity,1200,'solo'))}
  const bad={...await newRecord(game,'class'),updatedAt:1100,events:[{eventId:'bad',at:1000,action:{...action('MEMORY_FLIP',pairs[0][0]),answer:true}}]};assert.throws(()=>replaySession(game,bad,identity,1200))
  assert.equal(validMemoryRuntime(game,q,{...emptyMemory(),open:wrong},'solo'),false);assert.equal(validMemoryRuntime(game,q,{...emptyMemory(),open:wrong},'class'),true)
 })
}finally{await vite.close()}
