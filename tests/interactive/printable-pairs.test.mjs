import assert from 'node:assert/strict'
import test from 'node:test'
import {access} from 'node:fs/promises'
import {createServer} from 'vite'

const server=await createServer({cacheDir:'/tmp/clairfle-printable-pairs-unit',server:{middlewareMode:true,hmr:false},appType:'custom'})
try {
 const {convertRecipe}=await server.ssrLoadModule('/src/interactive/domain/convert.ts')
 const {buildPage,buildWorksheets}=await server.ssrLoadModule('/src/math/generate.ts')
 const {defaultPage}=await server.ssrLoadModule('/src/math/catalog.ts')
 const {defaultThemeGameContent}=await server.ssrLoadModule('/src/jeux/bank.ts')
 const {demoRecipe}=await server.ssrLoadModule('/src/interactive/demo.ts')
 const {prepareGame}=await server.ssrLoadModule('/src/interactive/domain/plan.ts')
 const {applyPlanOptions,DEFAULT_PLAN_OPTIONS}=await server.ssrLoadModule('/src/interactive/domain/plan-options.ts')
 const {positionOf}=await server.ssrLoadModule('/src/interactive/domain/source-position.ts')
 const {createGameSource,renewGameSource}=await server.ssrLoadModule('/src/interactive/game-run.ts')
 const {startSession,transition}=await server.ssrLoadModule('/src/interactive/domain/session.ts')
 const {usedMatchingChoices}=await server.ssrLoadModule('/src/interactive/domain/matching.ts')
 const {newRecord,compactSession,replaySession,planIdentity}=await server.ssrLoadModule('/src/interactive/domain/persistence.ts')
 const {competitionQuiz,parseCompetitionQuiz,createCompetition,competitionStep,competitionView}=await server.ssrLoadModule('/src/interactive/competition/core.ts')
 const base=demoRecipe(),types=['jeux-vocabulaire','jeux-memory']
 const config=type=>({...defaultPage('jeux'),...defaultThemeGameContent(type,'fruits'),domain:'jeux',topic:'jeux-fruits',exerciseType:type,count:1,columns:1,extraBlocks:undefined,libreItems:undefined})
 const recipe=(type,seed=1)=>({...base,seed,pages:[config(type)],libreMode:false})
 const key=(game,q)=>q.choices.find(choice=>choice.id===game.corrections[q.id].choiceId)?.text
 const sourceItems=(type,seed=1)=>buildPage(config(type),seed).blocks[0].items
 const custom=(type,items,extra={})=>({...recipe(type),...extra,pages:[{...config(type),libreItems:items,count:items.length}]})
 const normalize=text=>text.normalize('NFC').trim().replace(/\s+/g,' ').toLocaleLowerCase('fr')

 await test('two real printable families over 600 configurations preserve numbered image/word relations and both paper faces',async()=>{
  const assets=new Set()
  for(const type of types)for(const difficulty of ['facile','moyen','avance'])for(let seed=1;seed<=100;seed++){
   const input=recipe(type,seed);input.pages[0].difficulty=difficulty
   const before=structuredClone(input),items=buildPage(input.pages[0],seed).blocks[0].items,paper=seed===1?structuredClone(buildWorksheets(input.pages,seed)):undefined
   const game=convertRecipe(input)
   assert.equal(game.questions.length,type==='jeux-vocabulaire'?9:4,JSON.stringify(game.issues))
   for(const q of game.questions){
    const front=items[q.source.item].gameBoard,card=front.cards[q.source.part]
    const words=type==='jeux-vocabulaire'?items.find(item=>item.gameBoard.side==='verso').gameBoard.cards:front.cards
    const word=words.find(word=>word.variant==='word'&&word.badge===card.badge)
    assert.equal(key(game,q),word.text);assert.deepEqual(q.images,[card.imageSrc]);assets.add(card.imageSrc)
    assert.equal(q.mode,'choice');assert.equal(q.compatibility,'assisted');assert.equal('answer' in q,false)
    assert.ok(q.choices.length>=2&&q.choices.length<=6);assert.equal(new Set(q.choices.map(c=>normalize(c.text))).size,q.choices.length)
    assert.ok(q.choices.every(choice=>words.some(word=>word.text===choice.text)))
   }
   assert.deepEqual(input,before);assert.deepEqual(convertRecipe(input),game)
   if(paper)assert.deepEqual(buildWorksheets(input.pages,seed),paper)
  }
  for(const src of assets)await access('public'+src)
 })
 await test('mirrored or freely reordered cards use pair numbers and empty printed padding never becomes a question',()=>{
  const items=sourceItems(types[0]),initial=convertRecipe(custom(types[0],items));items[1].gameBoard.cards.reverse();items[0].gameBoard.cards.reverse()
  const game=convertRecipe(custom(types[0],items));assert.equal(game.questions.length,9)
  for(const q of game.questions){const image=items[0].gameBoard.cards[q.source.part];assert.equal(key(game,q),items[1].gameBoard.cards.find(card=>card.badge===image.badge).text);assert.equal(game.corrections[q.id].choiceId,initial.corrections[initial.questions.find(other=>other.images[0]===q.images[0]).id].choiceId,'Word IDs are independent of their printed order')}
  for(const type of types){const input=recipe(type);input.pages[0].gameEntries=input.pages[0].gameEntries.slice(0,2);const before=structuredClone(input),game=convertRecipe(input);assert.equal(game.questions.length,2);assert.deepEqual(game.issues,[]);assert.ok(game.questions.every(q=>q.choices.length===2));assert.deepEqual(input,before)}
 })
 await test('missing pictures are excluded, while missing or repeated pair numbers, contradictory boards and unvalidated faces cannot invent matches',()=>{
  for(const type of types){
   const items=sourceItems(type),count=type===types[0]?9:4,image=items[0].gameBoard.cards.find(card=>card.variant==='image')
   delete image.imageSrc
   const partial=convertRecipe(custom(type,items));assert.equal(partial.questions.length,count-1);assert.match(partial.issues[0].reason,/image absente/)
   for(const change of [
    items=>{const images=items[0].gameBoard.cards.filter(c=>c.variant==='image');images[1].badge=images[0].badge},
    items=>{delete items[0].gameBoard.cards.find(c=>c.variant==='image').badge},
    items=>{items[0].gameBoard.side='unknown'},
    items=>{items[0].gameBoard.kind='intrus'},
    items=>{items[0].answer='invented key'},
    items=>{items[0].prompt='Une autre activité à conserver'},
    items=>{items[1].libreError='Face non validée'},
   ]){const bad=sourceItems(type);change(bad);const input=custom(type,bad),before=structuredClone(input),game=convertRecipe(input);assert.equal(game.questions.length,0);assert.ok(game.issues.length);assert.deepEqual(input,before)}
  }
 })
 await test('shared images or image overrides admitting several source words become teacher-led, and replacements are applied only once',()=>{
  const items=sourceItems(types[0]),images=items[0].gameBoard.cards,A=images[0].imageSrc,B=images[1].imageSrc,C=images[2].imageSrc
  const input=custom(types[0],items,{imageOverrides:{[A]:B}}),before=structuredClone(input),game=convertRecipe(input)
  const ambiguous=game.questions.filter(q=>q.source.part===0||q.source.part===1)
  assert.equal(ambiguous.length,2)
  for(const q of ambiguous){assert.equal(q.mode,'oral');assert.equal(q.compatibility,'teacher-led');assert.deepEqual(q.choices,[]);assert.deepEqual(q.images,[B]);assert.equal(game.corrections[q.id].choiceId,undefined);assert.match(game.corrections[q.id].text,/ \/ /)}
  assert.equal(game.questions.filter(q=>q.mode==='choice').length,7);assert.deepEqual(input,before)
  const chained=convertRecipe(custom(types[0],items,{imageOverrides:{[A]:B,[B]:C}}))
  assert.deepEqual(chained.questions.find(q=>q.source.part===0).images,[B])
  const shared=structuredClone(items);shared[0].gameBoard.cards[0].imageSrc=B
  assert.equal(convertRecipe(custom(types[0],shared)).questions.filter(q=>q.mode==='oral').length,2)
 })
 await test('source-only choice caps, numeric-order preference and custom source order retain every paired correction',()=>{
  const game=convertRecipe(recipe(types[0])),before=structuredClone(game)
  for(const maxChoices of [2,3,4,5,6]){
   const plan=prepareGame(applyPlanOptions(game,{...DEFAULT_PLAN_OPTIONS,maxChoices,numericOrder:true,orderMode:'custom',customOrder:game.questions.map(positionOf).reverse()}))
   assert.deepEqual(plan.questions.map(positionOf),game.questions.map(positionOf).reverse())
   for(const q of plan.questions){assert.equal(q.choices.length,Math.min(maxChoices,game.questions.find(source=>source.id===q.id).choices.length));assert.ok(q.choices.some(choice=>choice.id===game.corrections[q.id].choiceId));assert.equal(key(game,q),key(plan,q))}
  }
  assert.deepEqual(game,before)
 })
 await test('renewed generated templates change picture order and cards while preserving their original words and stored recipe',()=>{
  for(const type of types){
   const input=recipe(type),before=structuredClone(input),pictures=new Set(),cards=new Set()
   let source=createGameSource({recipe:input,name:'Paires'},'saved','pairs-'+type)
   for(let i=0;i<8;i++){const game=convertRecipe(source.recipe);pictures.add(JSON.stringify(game.questions.map(q=>q.images)));cards.add(JSON.stringify(game.questions.map(q=>q.choices)));source=renewGameSource(source,null)}
   assert.ok(pictures.size>1);assert.ok(cards.size>1);assert.deepEqual(input,before)
  }
 })
 await test('collective Class and automatic Solo correction and timeout survive durable checkpoints with the same pairs',async()=>{
  const game=prepareGame(convertRecipe(recipe(types[1]))),collective=startSession(game,'class')
  assert.equal(transition(game,collective,{type:'SELECT',choiceId:game.questions[0].choices[0].id}),collective)
  let solo=startSession(game,'solo')
  for(const [index,kind] of ['correct','wrong','timeout','correct'].entries()){
   const q=game.questions[index],id=game.corrections[q.id].choiceId
   solo=transition(game,solo,kind==='timeout'?{type:'TIMEOUT'}:{type:'SELECT',choiceId:kind==='correct'?id:q.choices.find(c=>c.id!==id&&!usedMatchingChoices(game,solo,q).includes(c.id)).id})
   assert.equal(solo.phase,'revealed');assert.equal(solo.history.at(-1).correct,kind==='correct');solo=transition(game,solo,{type:'NEXT'})
  }
  const record=compactSession(await newRecord(game,'solo'),solo);assert.deepEqual(replaySession(game,record,await planIdentity(game),Date.now(),'solo').state,solo)
 })
 await test('competition keeps source images and word cards public without revealing their verified key before correction',()=>{
  const game=convertRecipe(recipe(types[1])),before=structuredClone(game),quiz=parseCompetitionQuiz(competitionQuiz(game,'https://clairfle.example'))
  assert.equal(quiz.items.length,4)
  let room=createCompetition(quiz,{enabled:false,seconds:30,feedbackSeconds:1,speedPoints:false},'online','ABC234',1000)
  room=competitionStep(room,{type:'join',avatarId:'panda'},1100);room=competitionStep(room,{type:'start'},1200)
  const view=competitionView(room,1300,'p1');assert.deepEqual(view.question.images,game.questions[0].images.map(src=>new URL(src,'https://clairfle.example').href));assert.deepEqual(view.question.choices.map(c=>c.text),game.questions[0].choices.map(c=>c.text));assert.equal(view.correctChoiceId,undefined);assert.deepEqual(game,before)
 })
} finally {await server.close()}
