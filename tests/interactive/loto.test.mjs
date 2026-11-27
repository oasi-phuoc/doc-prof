import assert from 'node:assert/strict'
import {test} from 'node:test'
import {createServer} from 'vite'
const vite=await createServer({server:{middlewareMode:true,hmr:false},appType:'custom'})
try{
 const {convertRecipe}=await vite.ssrLoadModule('/src/interactive/domain/convert.ts'),{defaultPage}=await vite.ssrLoadModule('/src/math/catalog.ts'),{defaultThemeGameContent}=await vite.ssrLoadModule('/src/jeux/bank.ts'),{demoRecipe}=await vite.ssrLoadModule('/src/interactive/demo.ts'),{buildWorksheets}=await vite.ssrLoadModule('/src/math/generate.ts')
 const {applyPlanOptions,readPlanOptions,DEFAULT_PLAN_OPTIONS,NEW_PLAN_OPTIONS}=await vite.ssrLoadModule('/src/interactive/domain/plan-options.ts'),{prepareGame,excludeQuestions}=await vite.ssrLoadModule('/src/interactive/domain/plan.ts')
 const {lotoGame,lotoProgress,lotoSummary,lotoGoalMet,lotoSelection}=await vite.ssrLoadModule('/src/interactive/domain/loto.ts'),{positionOf}=await vite.ssrLoadModule('/src/interactive/domain/source-position.ts')
 const {startSession,transition}=await vite.ssrLoadModule('/src/interactive/domain/session.ts'),{questionsForAttempt}=await vite.ssrLoadModule('/src/interactive/domain/round-runtime.ts')
 const {newRecord,replaySession,compactSession,planIdentity}=await vite.ssrLoadModule('/src/interactive/domain/persistence.ts'),{readLocalPreset,presetOptions}=await vite.ssrLoadModule('/src/interactive/presets.ts')
 const {matchingSummary,usedMatchingChoices}=await vite.ssrLoadModule('/src/interactive/domain/matching.ts'),{competitionQuiz}=await vite.ssrLoadModule('/src/interactive/competition/core.ts')
 const {teacherSheetRows}=await vite.ssrLoadModule('/src/interactive/domain/teacher-sheet.ts'),{PALETTE,defaultShapes}=await vite.ssrLoadModule('/src/interactive/domain/palette.ts')
 const recipe=(seed=1,count=9)=>{const page={...defaultPage('jeux'),...defaultThemeGameContent('jeux-loto','fruits'),domain:'jeux',topic:'jeux-fruits',exerciseType:'jeux-loto',count:1,columns:1,extraBlocks:undefined,libreItems:undefined};page.gameEntries=page.gameEntries.slice(0,count);return{...demoRecipe(),seed,libreMode:false,pages:[page]}}
 const source=convertRecipe(recipe()),game=prepareGame(applyPlanOptions(source,{...DEFAULT_PLAN_OPTIONS,loto:'line'})),first=game.questions[0],board=first.lotoBoard
 const reveal=(game,state)=>['CARDS_UP','DISCUSS','REVEAL'].reduce((s,type)=>transition(game,s,{type},1000),state)
 const mark=(game,state,value='success')=>transition(game,state,{type:'TEACHER_MARK_SET',questionId:game.questions[state.index].id,value})
 const extended = { ...NEW_PLAN_OPTIONS, loto: 'line', lotoLayout: 'extended' }
 await test('large Loto keeps all pairs, limits each draw to the requested cards and avoids singleton boards', () => {
   for (const [count, sizes] of [[2, [2]], [7, [7]], [25, [25]], [26, [24, 2]], [27, [25, 2]]]) {
     const raw = convertRecipe(recipe(42, count))
     for (const maxChoices of [2, 3, 6]) {
       const options = readPlanOptions({ ...extended, maxChoices })
       const converted = applyPlanOptions(raw, options)
       const boards = [...new Map(converted.questions.map(q => [q.lotoBoard.groupId, q.lotoBoard])).values()]
       assert.deepEqual(boards.map(board => board.cells.length), sizes)
       assert.deepEqual(converted.questions.map(positionOf).sort(), raw.questions.map(positionOf).sort())
       assert.deepEqual(converted, applyPlanOptions(raw, options))
       for (const question of converted.questions) {
         const { cells } = question.lotoBoard
         assert.equal(question.lotoBoard.layout, 'extended')
         assert.equal(question.choices.length, Math.min(maxChoices, cells.length))
         assert.equal(question.matchingGroup, undefined)
         assert.ok(question.choices.every(choice => cells.some(cell => cell.id === choice.id && cell.text === choice.text)))
         assert.ok(question.choices.some(choice => choice.id === converted.corrections[question.id].choiceId))
       }
     }
   }
   const input = convertRecipe(recipe(42, 27)), converted = applyPlanOptions(input, extended)
   const first = converted.questions[0], selected = prepareGame(converted, [first.id])
   assert.equal(selected.questions.length, 25)
   assert.equal(excludeQuestions(prepareGame(converted), new Set([first.id])).questions.length, 2)
   assert.throws(() => readPlanOptions({ ...extended, loto: undefined }))
   const invalid = structuredClone(input)
   invalid.questions.at(-1).images = invalid.questions[0].images
   const refused = applyPlanOptions(invalid, extended)
   assert.ok(refused.questions.every(question => !question.lotoBoard))
   assert.ok(refused.issues.length > invalid.issues.length)
 })
 await test('large Loto requires a complete row and restores teacher marks and the board after replay', async () => {
   const converted = prepareGame(applyPlanOptions(convertRecipe(recipe(12, 7)), extended))
   const q = converted.questions[0], board = q.lotoBoard
   assert.equal(lotoGoalMet(board, new Set([board.cells.at(-1).id])), false)
   assert.equal(lotoGoalMet(board, new Set(board.cells.slice(0, board.columns).map(cell => cell.id))), true)
   let state = startSession(converted)
   for (const type of ['CARDS_UP', 'DISCUSS', 'REVEAL']) state = transition(converted, state, { type }, 1000)
   assert.equal(lotoProgress(converted, state, q).marked.length, 0)
   state = mark(converted, state)
   assert.deepEqual(lotoProgress(converted, state, q).marked, [converted.corrections[q.id].choiceId])
   const record = { ...await newRecord(converted), updatedAt: 1000 }
   const saved = compactSession(record, state)
   const restored = replaySession(converted, saved, await planIdentity(converted), 1500)
   assert.deepEqual(lotoProgress(converted, restored.state, q), lotoProgress(converted, state, q))
   const solo = prepareGame(applyPlanOptions(convertRecipe(recipe(12, 7)), { ...extended, loto: 'board' }), undefined, 'solo')
   let player = startSession(solo, 'solo')
   const draw = solo.questions[0], correct = solo.corrections[draw.id].choiceId
   player = transition(solo, player, { type: 'SELECT', choiceId: draw.choices.find(choice => choice.id !== correct).id })
   assert.deepEqual(lotoProgress(solo, player, draw).marked, [])
   player = transition(solo, player, { type: 'NEXT' })
   const next = solo.questions[player.index]
   player = transition(solo, player, { type: 'SELECT', choiceId: solo.corrections[next.id].choiceId })
   assert.deepEqual(lotoProgress(solo, player, next).marked, [solo.corrections[next.id].choiceId])
 })
 await test('two hundred real Loto configurations retain every caller pair and unchanged paper, with fixed A–F cases and seeded draws',()=>{
  const orders=new Set()
  for(const count of [9,27])for(let seed=1;seed<=100;seed++){
   const input=recipe(seed,count),original=structuredClone(input),raw=convertRecipe(input),paper=seed===1?structuredClone(buildWorksheets(input.pages,seed)):undefined,converted=lotoGame(raw,'line')
   assert.equal(converted.questions.length,count);assert.deepEqual(lotoGame(raw,'line'),converted);orders.add(JSON.stringify(converted.questions.map(q=>positionOf(q))))
   for(const q of converted.questions){assert.ok(q.lotoBoard);assert.equal(q.choices.length,q.lotoBoard.cells.length);assert.ok(q.choices.length>=2&&q.choices.length<=6);assert.equal(q.choiceOrderPolicy,'fixed');assert.deepEqual(q.choices,q.lotoBoard.cells);assert.deepEqual(q.images,raw.questions.find(old=>old.id===q.id).images);assert.deepEqual(converted.corrections[q.id],raw.corrections[q.id]);assert.equal('correctChoiceId' in q,false)}
   assert.deepEqual(input,original);if(paper)assert.deepEqual(buildWorksheets(input.pages,seed),paper)
  }
  assert.ok(orders.size>70)
 })
 await test('a complete source group is required; ambiguous faces, missing keys and long or contradictory words retain original questions',()=>{
  for(const mutate of [g=>g.questions[0].mode='oral',g=>g.questions[0].images=[],g=>g.questions[1].images=[g.questions[0].images[0]],g=>delete g.corrections[g.questions[0].id].choiceId,g=>g.questions[0].choices[0].text='x'.repeat(25)]){
   const raw=structuredClone(source);mutate(raw);const out=lotoGame(raw,'line'),ids=raw.questions.filter(q=>q.matchingGroup.groupId===raw.questions[0].matchingGroup.groupId).map(q=>q.id)
   assert.ok(out.issues.length);assert.ok(out.questions.filter(q=>ids.includes(q.id)).every(q=>!q.lotoBoard));assert.deepEqual(out.questions.filter(q=>ids.includes(q.id)),raw.questions.filter(q=>ids.includes(q.id)))
  }
 })
 await test('source identity is unchanged by default; presets validate both goals, keep complete grids under caps, and preserve custom or shuffled board clusters',()=>{
  assert.equal(applyPlanOptions(source,DEFAULT_PLAN_OPTIONS),source);assert.deepEqual(readPlanOptions({...DEFAULT_PLAN_OPTIONS,loto:undefined}),DEFAULT_PLAN_OPTIONS);for(const bad of [true,false,'all','',5])assert.throws(()=>readPlanOptions({...DEFAULT_PLAN_OPTIONS,loto:bad}))
  for(const goal of ['line','board'])for(const maxChoices of [2,3,6])for(const orderMode of ['source','custom','shuffled']){
   const out=applyPlanOptions(source,{...DEFAULT_PLAN_OPTIONS,loto:goal,maxChoices,orderMode,customOrder:source.questions.map(positionOf).reverse()})
   const closed=new Set();let current
   for(const q of out.questions){assert.equal(q.choices.length,q.lotoBoard.cells.length);assert.equal(q.lotoBoard.goal,goal);if(q.lotoBoard.groupId!==current){assert.ok(!closed.has(q.lotoBoard.groupId));if(current)closed.add(current);current=q.lotoBoard.groupId}}
  }
  const preset=readLocalPreset({version:2,presetId:'loto',sourceKey:'source',name:'Loto',conversionVersion:2,paletteVersion:1,contentHashAtSave:'1',selectedQuestionIds:source.questions.map(positionOf),...DEFAULT_PLAN_OPTIONS,loto:'board',revealPolicy:'teacher-only',correctionTiming:'deferred',voteBeforeBoard:true,timer:{enabled:false,defaultSec:30,feedbackSec:5},scoring:{mode:'none'},effects:{badges:false},playMode:'class',revision:0,createdAt:1,updatedAt:1});assert.equal(presetOptions(preset).loto,'board')
  assert.equal(presetOptions(preset).lotoLayout, undefined)
  assert.deepEqual(presetOptions(readLocalPreset({ ...preset, ...extended })), extended)
 })
 await test('selections cover whole grids and a missing image excludes its whole grid and rounds, keeping the next grid usable',()=>{
  const expanded=lotoSelection([positionOf(first)],game);assert.deepEqual(new Set(expanded),new Set(board.sourceKeys));const selected=prepareGame(lotoGame(source,'line'),[first.id]);assert.equal(selected.questions.length,board.cells.length)
  const out=excludeQuestions(game,new Set([first.id]));assert.equal(out.questions.length,3);assert.ok(out.questions.every(q=>q.lotoBoard.groupId!==board.groupId));assert.ok(out.rounds.every(round=>round.questionIds.every(id=>out.questions.some(q=>q.id===id))));assert.match(out.issues.at(-1).reason,/tous les tirages/)
 })
 await test('Class never checks automatically: only revealed, explicitly validated cells advance a line, without an individual score',()=>{
  let state=startSession(game)
  for(const id of board.cells.slice(0,board.columns).map(c=>c.id)){
   const index=game.questions.findIndex(q=>game.corrections[q.id].choiceId===id&&q.lotoBoard.groupId===board.groupId);state=transition(game,state,{type:'NAVIGATE',index})
   assert.equal(mark(game,state),state);state=reveal(game,state);const count=lotoProgress(game,state,first).marked.length;assert.equal(state.history.at(-1).correct,undefined)
   state=mark(game,state);assert.equal(lotoProgress(game,state,first).marked.length,count+1);const locked={...state,teacherLocked:true};assert.equal(mark(game,locked),locked)
  }
  const progress=lotoProgress(game,state,first);assert.equal(progress.met,true);assert.equal(lotoGoalMet({...board,goal:'board'},new Set(progress.marked)),false);assert.deepEqual(matchingSummary(game,state),[])
  state=mark(game,state,'unassessed');assert.equal(lotoProgress(game,state,first).met,false);assert.equal(state.history.some(a=>a.correct!==undefined),false)
 })
 await test('Solo checks only correct cells, preserves failure and timeout, and never consumes a future word chosen by mistake',()=>{
  const soloGame=prepareGame(applyPlanOptions(source,{...DEFAULT_PLAN_OPTIONS,loto:'board'}),undefined,'solo');let state=startSession(soloGame,'solo'),q=soloGame.questions[0],correct=soloGame.corrections[q.id].choiceId,wrong=q.choices.find(c=>c.id!==correct).id
  state=transition(soloGame,state,{type:'SELECT',questionId:q.id,choiceId:wrong});assert.equal(state.history[0].correct,false);assert.deepEqual(lotoProgress(soloGame,state,q).marked,[])
  state=transition(soloGame,state,{type:'NEXT'});q=soloGame.questions[1];const used=usedMatchingChoices(soloGame,state,q);assert.ok(used.includes(correct));if(soloGame.corrections[q.id].choiceId!==wrong)assert.ok(!used.includes(wrong))
  state=transition(soloGame,state,{type:'SELECT',questionId:q.id,choiceId:soloGame.corrections[q.id].choiceId});assert.equal(lotoProgress(soloGame,state,q).marked.length,1)
  state=transition(soloGame,state,{type:'NEXT'});state=transition(soloGame,state,{type:'TIMEOUT'});assert.equal(state.history[2].correct,false);assert.equal(lotoSummary(soloGame,state)[0].marked.length,1)
 })
 await test('fixed case letters survive another attempt; its archived judgement cannot count toward the current collective goal',()=>{
  let state=mark(game,reveal(game,startSession(game)));assert.equal(lotoProgress(game,state,first).marked.length,1)
  state=transition(game,state,{type:'RETRY_QUESTION',roundId:game.rounds[0].id});assert.equal(lotoProgress(game,state,first).marked.length,0);assert.equal(state.previousAttempts[0].teacherMarks[first.id],'success');assert.deepEqual(questionsForAttempt(game,0,1)[0].choices,first.choices)
 })
 await test('journals, checkpoints and teacher sheets keep marks, letters and goals without persisting faces or private keys',async()=>{
  let state=startSession(game);const actions=[];for(const type of ['CARDS_UP','DISCUSS','REVEAL'])actions.push({type});actions.push({type:'TEACHER_MARK_SET',questionId:first.id,value:'success'})
  const events=actions.map((action,index)=>({eventId:String(index),at:1000+index,action}));for(const event of events)state=transition(game,state,event.action,event.at)
  const record={...await newRecord(game),updatedAt:1100,events},identity=await planIdentity(game),compacted=compactSession(record,state);assert.deepEqual(replaySession(game,record,identity,1200).state,state);assert.deepEqual(replaySession(game,compacted,identity,1200).state,state);assert.equal(JSON.stringify(compacted).includes('lotoBoard'),false)
  const rows=await teacherSheetRows(game,PALETTE.map(c=>c.color),defaultShapes);assert.equal(rows[0].card.letter,PALETTE[first.choices.findIndex(c=>c.id===game.corrections[first.id].choiceId)].letter)
  assert.equal(competitionQuiz(game,'https://class.example').items.length,0);assert.equal(competitionQuiz(prepareGame(source),'https://class.example').items.length,9)
 })
}finally{await vite.close()}
