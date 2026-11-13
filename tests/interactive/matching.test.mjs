import assert from 'node:assert/strict'
import test from 'node:test'
import {createServer} from 'vite'

const server=await createServer({cacheDir:'/tmp/clairfle-matching-unit',server:{middlewareMode:true,hmr:false},appType:'custom'})
try {
 const {convertRecipe}=await server.ssrLoadModule('/src/interactive/domain/convert.ts')
 const {demoRecipe}=await server.ssrLoadModule('/src/interactive/demo.ts')
 const {defaultPage}=await server.ssrLoadModule('/src/math/catalog.ts')
 const {defaultThemeGameContent}=await server.ssrLoadModule('/src/jeux/bank.ts')
 const {prepareGame,roundsFor}=await server.ssrLoadModule('/src/interactive/domain/plan.ts')
 const {buildPage}=await server.ssrLoadModule('/src/math/generate.ts')
 const {positionOf}=await server.ssrLoadModule('/src/interactive/domain/source-position.ts')
 const {startSession,transition}=await server.ssrLoadModule('/src/interactive/domain/session.ts')
 const {usedMatchingChoices,matchingSummary}=await server.ssrLoadModule('/src/interactive/domain/matching.ts')
 const {applyPlanOptions,DEFAULT_PLAN_OPTIONS}=await server.ssrLoadModule('/src/interactive/domain/plan-options.ts')
 const {compactSession,newRecord,replaySession,planIdentity}=await server.ssrLoadModule('/src/interactive/domain/persistence.ts')
 const {competitionQuiz,parseCompetitionQuiz,createCompetition,competitionStep,competitionView}=await server.ssrLoadModule('/src/interactive/competition/core.ts')
 const base=demoRecipe(),content=defaultThemeGameContent('jeux-vocabulaire','fruits')
 const recipe=(count=9,seed=1)=>({...base,seed,pages:[{...defaultPage('jeux'),...content,gameEntries:content.gameEntries.slice(0,count),domain:'jeux',topic:'jeux-fruits',exerciseType:'jeux-vocabulaire',count:1,columns:1,extraBlocks:undefined,libreItems:undefined}]})
 const gameFor=(count=9,seed=1)=>prepareGame(convertRecipe(recipe(count,seed)))
 const correct=(game,q)=>game.corrections[q.id].choiceId
 const reveal=(game,state,at=1000)=>['CARDS_UP','DISCUSS','REVEAL'].reduce((state,type)=>transition(game,state,{type},at),state)

 await test('all two-to-nine-pair templates over 100 seeds use complete, disjoint groups of at most six without singleton leftovers',()=>{
  for(let count=2;count<=9;count++)for(let seed=1;seed<=100;seed++){
   const source=recipe(count,seed),before=structuredClone(source),game=prepareGame(convertRecipe(source))
   assert.equal(game.questions.length,count);assert.deepEqual(source,before)
   const groups=new Map()
   for(const q of game.questions){assert.ok(q.matchingGroup);groups.set(q.matchingGroup.groupId,[...(groups.get(q.matchingGroup.groupId)??[]),q])}
   assert.equal(groups.size,Math.ceil(count/6))
   for(const members of groups.values()){
    assert.ok(members.length>=2&&members.length<=6)
    const keys=members.map(q=>correct(game,q)).sort()
    for(const q of members){assert.deepEqual(q.choices.map(c=>c.id).sort(),keys);assert.equal(q.matchingGroup.total,groups.size)}
   }
   assert.deepEqual([...groups.values()].map(group=>group.length),count===7?[5,2]:count>6?[6,count-6]:[count])
  }
 })
 await test('Solo consumes only corrected pairs, rejects an already used word, and keeps skipped pairs and other groups available',()=>{
  const game=gameFor(),before=structuredClone(game),[first,second,third]=game.questions
  let state=startSession(game,'solo')
  assert.deepEqual(usedMatchingChoices(game,state,first),[])
  state=transition(game,state,{type:'SELECT',choiceId:correct(game,first)});state=transition(game,state,{type:'NEXT'})
  assert.deepEqual(usedMatchingChoices(game,state,second),[correct(game,first)])
  assert.equal(transition(game,state,{type:'SELECT',choiceId:correct(game,first)}),state)
  state=transition(game,state,{type:'SKIP'})
  assert.deepEqual(usedMatchingChoices(game,state,third),[correct(game,first)])
  state=transition(game,state,{type:'TIMEOUT'});state=transition(game,state,{type:'NEXT'})
  assert.equal(usedMatchingChoices(game,state,game.questions[3]).length,2)
  state=transition(game,state,{type:'NAVIGATE',index:6})
  assert.deepEqual(usedMatchingChoices(game,state,game.questions[6]),[])
  state=transition(game,state,{type:'NAVIGATE',index:0})
  assert.ok(!usedMatchingChoices(game,state,first).includes(correct(game,first)))
  assert.deepEqual(game,before)
 })
 await test('Class retraction and retry release the pair; letters, colors, original choices and archived attempts remain intact',()=>{
  const game=gameFor(4),before=structuredClone(game),first=game.questions[0],next=game.questions[1],round=roundsFor(game)[0]
  let state=reveal(game,startSession(game,'class'))
  assert.deepEqual(usedMatchingChoices(game,state,next),[correct(game,first)])
  state=transition(game,state,{type:'UNREVEAL',roundId:round.id},1100)
  assert.deepEqual(usedMatchingChoices(game,state,next),[])
  state=transition(game,state,{type:'REVEAL'},1200)
  state=transition(game,state,{type:'RETRY_QUESTION',roundId:round.id})
  assert.deepEqual(usedMatchingChoices(game,state,next),[])
  assert.equal(state.previousAttempts.length,1)
  state=reveal(game,state,1300)
  assert.equal(usedMatchingChoices(game,state,next).length,1)
  assert.deepEqual(game,before)
 })
 await test('custom order, selected questions, capped cards and compacted durable sessions preserve matching state and per-group Solo results',async()=>{
  const original=convertRecipe(recipe()),options={...DEFAULT_PLAN_OPTIONS,maxChoices:3,orderMode:'custom',customOrder:original.questions.map(positionOf).reverse()}
  const game=prepareGame(applyPlanOptions(original,options)),before=structuredClone(game)
  let state=startSession(game,'solo')
  for(let i=0;i<game.questions.length;i++){
   const q=game.questions[i],used=usedMatchingChoices(game,state,q)
   assert.ok(!used.includes(correct(game,q)));assert.ok(q.choices.length<=3)
   state=transition(game,state,i%3===0?{type:'TIMEOUT'}:{type:'SELECT',choiceId:correct(game,q)})
   state=transition(game,state,{type:'NEXT'})
  }
  const summary=matchingSummary(game,state)
  assert.equal(summary.reduce((n,g)=>n+g.size,0),9);assert.equal(summary.reduce((n,g)=>n+g.correct,0),6)
  const record=compactSession(await newRecord(game,'solo'),state),restored=replaySession(game,record,await planIdentity(game),Date.now(),'solo').state
  assert.deepEqual(matchingSummary(game,restored),summary);assert.deepEqual(restored,state);assert.deepEqual(game,before)
  const partial=prepareGame(original,[original.questions[1].id,original.questions[4].id]),classState=reveal(partial,startSession(partial,'class'))
  assert.equal(matchingSummary(partial,classState)[0].size,2);assert.equal(matchingSummary(partial,classState)[0].correct,0)
 })
 await test('a shared source word or image becomes teacher-led and cannot consume an automatic matching card',()=>{
  const input=recipe(4),items=buildPage(input.pages[0],input.seed).blocks[0].items
  const words=items[1].gameBoard.cards.filter(card=>card.text?.trim())
  words[1].text=words[0].text
  input.pages[0].libreItems=items;input.libreMode=true
  const game=convertRecipe(input)
  assert.equal(game.questions.filter(q=>q.mode==='oral').length,2)
  for(const q of game.questions.filter(q=>q.mode==='oral')){assert.equal(q.matchingGroup,undefined);assert.equal(game.corrections[q.id].choiceId,undefined)}
 })
 await test('competition validates matching metadata and rejects duplicate targets, duplicate images and groups larger than six',()=>{
  const source=competitionQuiz(gameFor(4),'https://clairfle.example'),parsed=parseCompetitionQuiz(source)
  assert.ok(parsed.items.every(item=>item.question.matchingGroup.groupId==='m1'))
  for(const change of [
   quiz=>{quiz.items[0].question.matchingGroup.answer='hidden'},
   quiz=>{quiz.items[0].question.matchingGroup.number=0},
   quiz=>{quiz.items[0].question.matchingGroup.total=101},
   quiz=>{quiz.items[1].question.matchingGroup.number=2;quiz.items[1].question.matchingGroup.total=2},
   quiz=>{quiz.items[1].correctChoiceId=quiz.items[0].correctChoiceId},
   quiz=>{quiz.items[1].question.images=quiz.items[0].question.images},
  ]){const bad=structuredClone(source);change(bad);assert.throws(()=>parseCompetitionQuiz(bad))}
  const oversized=competitionQuiz(gameFor(),'https://clairfle.example');for(const item of oversized.items)item.question.matchingGroup={groupId:'all',number:1,total:1}
  assert.throws(()=>parseCompetitionQuiz(oversized))
 })
 await test('online and offline local competition consume the same previously revealed words, enforce them on the server, and never leak the current key between players',()=>{
  const quiz=parseCompetitionQuiz(competitionQuiz(gameFor(4),'https://clairfle.example')),settings={enabled:false,seconds:30,feedbackSeconds:1,speedPoints:false}
  for(const mode of ['online','local']){
   let now=1000,room=createCompetition(quiz,settings,mode,'ABC234',now)
   const step=action=>room=competitionStep(room,action,++now)
   step({type:'join',avatarId:'panda'});step({type:'join',avatarId:'fox'});step({type:'start'})
   for(let i=0;i<4;i++){
    if(mode==='local')step({type:'begin-turn'})
    const before=competitionView(room,now,'p1'),q=before.question
    assert.equal(before.unavailableChoiceIds.length,i);assert.equal(before.correctChoiceId,undefined)
    const usedWords=before.unavailableChoiceIds.map(id=>q.choices.find(choice=>choice.id===id).text).sort()
    const previousWords=quiz.items.slice(0,i).map(item=>item.question.choices.find(choice=>choice.id===item.correctChoiceId).text).sort()
    assert.deepEqual(usedWords,previousWords,'Word identity is retained after per-question choice IDs are remapped')
    assert.ok(!before.unavailableChoiceIds.includes(quiz.items[i].correctChoiceId))
    if(i)assert.throws(()=>step({type:'answer',playerId:'p1',questionId:q.id,choiceId:before.unavailableChoiceIds[0]}),/pas proposée/)
    step({type:'answer',playerId:'p1',questionId:q.id,choiceId:quiz.items[i].correctChoiceId})
    if(mode==='local')step({type:'begin-turn'})
    const peer=competitionView(room,now,'p2');assert.deepEqual(peer.unavailableChoiceIds,before.unavailableChoiceIds);assert.equal(peer.correctChoiceId,undefined);assert.equal(peer.self.selected,undefined)
    step({type:'answer',playerId:'p2',questionId:q.id,choiceId:quiz.items[i].correctChoiceId})
    assert.equal(room.phase,'correction');assert.equal(competitionView(room,now).correctChoiceId,quiz.items[i].correctChoiceId)
    step({type:'next'})
   }
   assert.equal(room.phase,'finished');assert.deepEqual(room.players.map(p=>p.score),[4000,4000])
  }
 })
} finally {await server.close()}
