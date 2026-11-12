import assert from 'node:assert/strict'
import test from 'node:test'
import {createServer} from 'vite'

const server=await createServer({cacheDir:'/tmp/clairfle-recognition-unit',server:{middlewareMode:true,hmr:false},appType:'custom'})
try {
 const {convertRecipe}=await server.ssrLoadModule('/src/interactive/domain/convert.ts')
 const {buildPage,buildWorksheets}=await server.ssrLoadModule('/src/math/generate.ts')
 const {tryGenerateFigure}=await server.ssrLoadModule('/src/math/figures-school.ts')
 const {generateCscExercise}=await server.ssrLoadModule('/src/tcm-csc/items.ts')
 const {defaultPage,exerciseTypes}=await server.ssrLoadModule('/src/math/catalog.ts')
 const {demoRecipe}=await server.ssrLoadModule('/src/interactive/demo.ts')
 const {prepareGame}=await server.ssrLoadModule('/src/interactive/domain/plan.ts')
 const {applyPlanOptions,DEFAULT_PLAN_OPTIONS}=await server.ssrLoadModule('/src/interactive/domain/plan-options.ts')
 const {positionOf}=await server.ssrLoadModule('/src/interactive/domain/source-position.ts')
 const {createGameSource,renewGameSource}=await server.ssrLoadModule('/src/interactive/game-run.ts')
 const {startSession,transition}=await server.ssrLoadModule('/src/interactive/domain/session.ts')
 const {newRecord,compactSession,replaySession,planIdentity}=await server.ssrLoadModule('/src/interactive/domain/persistence.ts')
 const {competitionQuiz,parseCompetitionQuiz,createCompetition,competitionStep,competitionView}=await server.ssrLoadModule('/src/interactive/competition/core.ts')
 const base=demoRecipe()
 const families=[['géométrie','figures-nommer',16],['géométrie','figures-proprietes',13],['tcm-csc','tcm-csc-ex17',2]]
 const configFor=(domain,type,count)=>({...defaultPage(domain),topic:exerciseTypes.find(entry=>entry.id===type).topic,exerciseType:type,count,extraBlocks:undefined,libreItems:undefined})
 const supportedProperties=new Set(['square','rectangle','rhombus','parallelogram','circle','oval','triangle','trapezoid'])
 const gameFor=(type,...items)=>convertRecipe({...base,pages:[{...configFor(type.startsWith('tcm')?'tcm-csc':'géométrie',type,items.length),libreItems:items}]})
 const keyOf=(game,q)=>q.choices.find(choice=>choice.id===game.corrections[q.id].choiceId).text

 await test('three recognition types across 900 configurations preserve source figures, positions, answers and paper',()=>{
  for(const [domain,type,count] of families) for(const difficulty of ['facile','moyen','avance']) for(let seed=1;seed<=100;seed++) {
   const config={...configFor(domain,type,count),difficulty},recipe={...base,pages:[config],seed,libreMode:false},before=structuredClone(recipe)
   const items=buildPage(config,seed).blocks.flatMap(block=>block.items),paper=seed===1?structuredClone(buildWorksheets(recipe.pages,seed)):undefined
   const game=convertRecipe(recipe)
   const expected=type==='figures-nommer'?16:type==='figures-proprietes'?52:8
   assert.equal(game.questions.length,expected,JSON.stringify(game.issues))
   assert.equal(game.issues.length,0)
   for(const q of game.questions) {
    const item=items[q.source.item],part=q.source.part
    assert.equal(q.figure.type,type==='tcm-csc-ex17'?item.cscTask.figures[part]:item.figure)
    assert.equal(q.figure.dims.bare,true)
    assert.ok(Object.keys(q.figure.dims).every(key=>['bare','triangleKind','trapezoidKind'].includes(key)))
    const expectedAnswer=type==='tcm-csc-ex17'?item.answer.split(' ; ')[part]:type==='figures-proprietes'?item.propertyLines[part].answer:item.answer
    assert.equal(keyOf(game,q),expectedAnswer)
    assert.equal(new Set(q.choices.map(choice=>choice.id)).size,q.choices.length)
    assert.equal(new Set(q.choices.map(choice=>choice.text)).size,q.choices.length)
    assert.ok(q.choices.length>=2&&q.choices.length<=6)
    assert.equal(q.compatibility,'assisted');assert.equal('answer' in q,false)
   }
   assert.deepEqual(recipe,before)
   if(seed===1){assert.deepEqual(convertRecipe(recipe),game);assert.deepEqual(buildWorksheets(recipe.pages,seed),paper)}
  }
 })
 await test('reviewed simple property facts include zero, four equal sides, opposite sides and infinitely many circle axes',()=>{
  const facts={square:['carré','4','4','4'],rectangle:['rectangle','côtés opposés','4','2'],rhombus:['losange','4','égaux','2'],parallelogram:['parallélogramme','côtés opposés','0','0'],circle:['cercle','0','0','une infinité'],oval:['ovale','0','2'],'triangle:equilateral':['triangle équilatéral','3','0','3'],'triangle:isosceles':['triangle isocèle','2','0','1'],'triangle:right':['triangle rectangle','0','1','0'],'triangle:scalene':['triangle quelconque','0','0','0']}
  for(let index=0;index<13;index++) {
   const item=tryGenerateFigure('figures-proprietes',index)
   if(!supportedProperties.has(item.figure))continue
   const game=gameFor('figures-proprietes',item)
   const trapezoidFacts={rectangle:['trapèze rectangle','1 paire','2','0'],isosceles:['trapèze isocèle','1 paire','égaux','0','1'],scalene:['trapèze quelconque','1 paire','0','0']}
   assert.deepEqual(game.questions.map(q=>keyOf(game,q)),item.figure==='trapezoid'?trapezoidFacts[item.dims.trapezoidKind]:facts[item.figure==='triangle'?`triangle:${item.dims.triangleKind}`:item.figure])
   for(const q of game.questions)assert.equal(q.figure.dims.answer,undefined)
  }
 })
 await test('edited keys, measured figures, unknown kinds, duplicate CSC shapes and unsupported subtype drawings cannot invent a verdict',()=>{
  const name=tryGenerateFigure('figures-nommer',0),properties=tryGenerateFigure('figures-proprietes',0),csc=generateCscExercise('tcm-csc-ex17',1,1)[0]
  const bad=[
   ['figures-nommer',{...name,answer:'rectangle'}],['figures-nommer',{...name,dims:{side:3}}],
   ['figures-nommer',{...name,dims:{triangleKind:'equilateral'}}],['figures-nommer',{...name,prompt:'Le nom est carré.'}],
   ['figures-nommer',{...name,figure:'untrusted'}],['figures-nommer',{...tryGenerateFigure('figures-nommer',3),dims:{triangleKind:'unverified'}}],
   ['figures-proprietes',{...properties,answer:'Nom : rectangle'}],
   ['figures-proprietes',{...properties,propertyLines:properties.propertyLines.map((line,index)=>index===2?{...line,answer:'3'}:line)}],
   ['figures-proprietes',{...properties,propertyLines:[...properties.propertyLines].reverse()}],
   ['tcm-csc-ex17',{...csc,answer:'carré ; carré ; carré ; carré'}],
   ['tcm-csc-ex17',{...csc,cscTask:{kind:'shape-names',figures:['square','square','circle','triangle']}}],
   ['tcm-csc-ex17',{...csc,cscTask:{kind:'shape-names',figures:['square','rectangle','circle','sphere']}}],
  ]
  for(const [type,item] of bad){const before=structuredClone(item),game=gameFor(type,item);assert.equal(game.questions.length,0);assert.ok(game.issues.length);assert.deepEqual(item,before)}
 })
 await test('imported logic default keys remain explicitly unavailable for automatic scoring',()=>{
  const item={layout:'logique',prompt:'',answer:'A',logique:{id:'unverified',mode:'suite',stem:['/lib/images/model.webp'],choices:['/lib/images/a.webp','/lib/images/b.webp'],choiceLabels:['A','B'],correctIndex:0,answerLine:false}}
  const game=gameFor('tcm-csc-ex17',item)
  assert.equal(game.questions.length,0);assert.match(game.issues[0].reason,/corrigés importés/)
 })
 await test('choice caps, numeric order, infinity and custom source order retain every correction',()=>{
  const items=Array.from({length:6},(_,index)=>tryGenerateFigure('figures-proprietes',index))
  const game=gameFor('figures-proprietes',...items),before=structuredClone(game)
  for(const maxChoices of [2,3,4,5,6]) {
   const plan=prepareGame(applyPlanOptions(game,{...DEFAULT_PLAN_OPTIONS,maxChoices,numericOrder:true,orderMode:'custom',customOrder:game.questions.map(positionOf).reverse()}))
   assert.deepEqual(plan.questions.map(positionOf),game.questions.map(positionOf).reverse())
   for(const q of plan.questions) {
    assert.equal(q.choices.length,Math.min(maxChoices,game.questions.find(source=>source.id===q.id).choices.length))
    assert.ok(q.choices.some(choice=>choice.id===game.corrections[q.id].choiceId))
    if(q.choices.every(choice=>/^\d+$/.test(choice.text))){const values=q.choices.map(choice=>Number(choice.text));assert.deepEqual(values,[...values].sort((a,b)=>a-b))}
   }
  }
  assert.deepEqual(game,before)
 })
 await test('renewed CSC templates change figure order while generic sources retain their pictures and vary their cards',()=>{
  for(const [domain,type,count] of families) {
   const recipe={...base,pages:[configFor(domain,type,type==='tcm-csc-ex17'?1:count)],libreMode:false},before=structuredClone(recipe)
   let source=createGameSource({recipe,name:type},'saved',type)
   const orders=new Set(),cards=new Set()
   for(let draw=0;draw<8;draw++) {
    const game=convertRecipe(source.recipe)
    orders.add(JSON.stringify(game.questions.map(q=>q.figure)))
    cards.add(JSON.stringify(game.questions.map(q=>q.choices)))
    source=renewGameSource(source,null)
   }
   assert.ok(cards.size>1,type)
   if(type==='tcm-csc-ex17')assert.ok(orders.size>1)
   else assert.equal(orders.size,1,'The original figure generator is indexed, not random; conversion preserves its source drawings.')
   assert.deepEqual(recipe,before)
  }
 })
 await test('Class is collective and Solo correct, incorrect and timeout verdicts survive durable checkpoints',async()=>{
  const item=generateCscExercise('tcm-csc-ex17',1,7)[0],game=prepareGame(gameFor('tcm-csc-ex17',item))
  let state=startSession(game,'class')
  assert.equal(transition(game,state,{type:'SELECT',choiceId:game.questions[0].choices[0].id}),state)
  state=startSession(game,'solo')
  for(const [index,kind] of ['correct','wrong','timeout','correct'].entries()) {
   const q=game.questions[index],correctId=game.corrections[q.id].choiceId
   state=transition(game,state,kind==='timeout'?{type:'TIMEOUT'}:{type:'SELECT',choiceId:kind==='correct'?correctId:q.choices.find(choice=>choice.id!==correctId).id})
   assert.equal(state.phase,'revealed');assert.equal(state.history.at(-1).correct,kind==='correct')
   state=transition(game,state,{type:'NEXT'})
  }
  const record=compactSession(await newRecord(game,'solo'),state)
  assert.deepEqual(replaySession(game,record,await planIdentity(game),Date.now(),'solo').state,state)
 })
 await test('competition keeps the public bare figures and choices but does not send their verified keys before reveal',()=>{
  const game=gameFor('figures-proprietes',tryGenerateFigure('figures-proprietes',4)),before=structuredClone(game)
  const quiz=parseCompetitionQuiz(competitionQuiz(game,'https://clairfle.example'))
  assert.equal(quiz.items.length,4)
  for(const [index,item] of quiz.items.entries())assert.deepEqual(item.question.figure,game.questions[index].figure)
  let room=createCompetition(quiz,{enabled:false,seconds:30,feedbackSeconds:1,speedPoints:false},'online','ABC234',1000)
  room=competitionStep(room,{type:'join',avatarId:'panda'},1100);room=competitionStep(room,{type:'start'},1200)
  const view=competitionView(room,1250,'p1')
  assert.deepEqual(view.question.figure,game.questions[0].figure);assert.equal(view.correctChoiceId,undefined);assert.equal('answer' in view.question.figure.dims,false)
  assert.deepEqual(game,before)
 })
} finally {await server.close()}
