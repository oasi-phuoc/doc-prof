import assert from 'node:assert/strict'
import test from 'node:test'
import {createServer} from 'vite'

const server=await createServer({cacheDir:'/tmp/clairfle-cfr-recognition-unit',server:{middlewareMode:true,hmr:false},appType:'custom'})
try {
 const {convertRecipe}=await server.ssrLoadModule('/src/interactive/domain/convert.ts')
 const {buildPage,buildWorksheets}=await server.ssrLoadModule('/src/math/generate.ts')
 const {defaultPage}=await server.ssrLoadModule('/src/math/catalog.ts')
 const {demoRecipe}=await server.ssrLoadModule('/src/interactive/demo.ts')
 const {prepareGame}=await server.ssrLoadModule('/src/interactive/domain/plan.ts')
 const {applyPlanOptions,DEFAULT_PLAN_OPTIONS}=await server.ssrLoadModule('/src/interactive/domain/plan-options.ts')
 const {positionOf}=await server.ssrLoadModule('/src/interactive/domain/source-position.ts')
 const {startSession,transition}=await server.ssrLoadModule('/src/interactive/domain/session.ts')
 const {newRecord,compactSession,replaySession,planIdentity}=await server.ssrLoadModule('/src/interactive/domain/persistence.ts')
 const {createGameSource,renewGameSource}=await server.ssrLoadModule('/src/interactive/game-run.ts')
 const {competitionQuiz,parseCompetitionQuiz,createCompetition,competitionStep,competitionView}=await server.ssrLoadModule('/src/interactive/competition/core.ts')
 const base=demoRecipe(),config=type=>({...defaultPage('tcm-cfr'),topic:'tcm-cfr-test',exerciseType:type,count:3,extraBlocks:undefined,libreItems:undefined})
 const recipeFor=(type,items,seed=14)=>({...base,seed,pages:[{...config(type),...(items?{libreItems:items,count:items.length}:{})}],libreMode:!!items})
 const key=(game,q)=>q.choices.find(choice=>choice.id===game.corrections[q.id].choiceId).text
 const names={square:'carré',rectangle:'rectangle',rhombus:'losange',parallelogram:'parallélogramme',circle:'cercle',trapezoid:'trapèze',pentagon:'pentagone'}
 const answers={square:['4','4'],rectangle:['côtés opposés','4'],rhombus:['4','égaux'],parallelogram:['côtés opposés','côtés opposés'],circle:['égales','0'],trapezoid:['1','4'],pentagon:['5','5']}
 const sourceFacts={square:['4 côtés égaux','4 angles droits'],rectangle:['côtés opposés égaux','4 angles droits'],rhombus:['4 côtés égaux','angles opposés égaux'],parallelogram:['côtés opposés parallèles','côtés opposés égaux'],circle:['tous les points à égale distance du centre','pas de côté'],trapezoid:['une paire de côtés parallèles','4 côtés'],pentagon:['5 côtés','5 sommets']}
 const card=(figure,properties)=>({layout:'geo',figure,dims:{bare:true,...(figure==='trapezoid'?{trapezoidKind:'isosceles'}:{})},geoNameCard:true,propertyLines:[{label:'Nom',answer:names[figure]},...(properties?sourceFacts[figure].map((answer,index)=>({label:`Propriété ${index+1}`,answer})):[])],answer:properties?[names[figure],...sourceFacts[figure]].join(' ; '):names[figure]})
 await test('two CFR figure types across 600 real configurations retain their verified source cards and paper',()=>{
  for(const type of ['tcm-cfr-ex16','tcm-cfr-ex17'])for(const difficulty of ['facile','moyen','avance'])for(let seed=1;seed<=100;seed++){
   const recipe=recipeFor(type,undefined,seed);recipe.pages[0].difficulty=difficulty
   const before=structuredClone(recipe),items=buildPage(recipe.pages[0],seed).blocks[0].items,paper=seed===1?buildWorksheets(recipe.pages,seed):undefined
   const game=convertRecipe(recipe)
   assert.equal(game.questions.length,type.endsWith('16')?6:3);assert.equal(game.issues.length,type.endsWith('16')?1:0)
   for(const q of game.questions){const item=items[q.source.item],part=q.source.part??0;assert.equal(key(game,q),part===0?names[item.figure]:answers[item.figure][part-1]);assert.equal(q.figure.type,item.figure);assert.equal(q.figure.dims.bare,true);assert.equal(q.compatibility,'assisted');assert.ok(!('propertyLines' in q));assert.ok(!('answer' in q.figure.dims));assert.equal(new Set(q.choices.map(choice=>choice.text)).size,q.choices.length)}
   assert.deepEqual(recipe,before);assert.deepEqual(convertRecipe(recipe),game)
   if(paper)assert.deepEqual(buildWorksheets(recipe.pages,seed),paper)
  }
 })
 await test('seven reviewed freely chosen CFR figures keep independent side, vertex, angle and distance facts',()=>{
  for(const figure of Object.keys(names)){
   const item=card(figure,true),recipe=recipeFor('tcm-cfr-ex16',[item]),before=structuredClone(recipe),game=convertRecipe(recipe)
   assert.deepEqual(game.questions.map(q=>key(game,q)),[names[figure],...answers[figure]]);assert.deepEqual(game.issues,[]);assert.deepEqual(recipe,before)
   const naming=convertRecipe(recipeFor('tcm-cfr-ex17',[card(figure,false)]));assert.equal(naming.questions.length,1);assert.equal(key(naming,naming.questions[0]),names[figure])
  }
 })
 await test('stale names, reversed or unreviewed properties, measured cards and triangle subtypes cannot invent a verdict',()=>{
  const good=card('rectangle',true)
  const bad=[{...good,answer:'rectangle ; 4 côtés égaux ; 4 angles droits'},{...good,propertyLines:[...good.propertyLines].reverse()},{...good,propertyLines:good.propertyLines.map((line,index)=>index===2?{...line,answer:'3 angles droits'}:line)},{...good,dims:{bare:true,length:7}},{...good,dims:{bare:false}},{...good,geoNameCard:false},{...good,prompt:'La réponse est rectangle.'},{...good,geoDualPads:true},{...good,figure:'triangle',dims:{bare:true,triangleKind:'right'}},{...good,figure:'triangle',dims:{bare:true,triangleKind:'equilateral'}},{...good,figure:'triangle',dims:{bare:true,triangleKind:'isosceles'}}]
  for(const item of bad){const before=structuredClone(item),game=convertRecipe(recipeFor('tcm-cfr-ex16',[item]));assert.equal(game.questions.length,0);assert.equal(game.issues.length,1);assert.deepEqual(item,before)}
  const wrongName={...card('pentagon',false),propertyLines:[{label:'Nom',answer:'cercle'}]}
  assert.equal(convertRecipe(recipeFor('tcm-cfr-ex17',[wrongName])).questions.length,0)
  for(const figure of ['constructor','toString','__proto__'])assert.equal(convertRecipe(recipeFor('tcm-cfr-ex17',[{...card('pentagon',false),figure,answer:'Object',propertyLines:[{label:'Nom',answer:'Object'}]}])).questions.length,0)
 })
 await test('choice caps, numeric order and custom question order keep every CFR fact associated with its correction',()=>{
  const game=convertRecipe(recipeFor('tcm-cfr-ex16',Object.keys(names).map(figure=>card(figure,true)))),before=structuredClone(game)
  for(const maxChoices of [2,3,4,5,6]){
   const plan=prepareGame(applyPlanOptions(game,{...DEFAULT_PLAN_OPTIONS,maxChoices,numericOrder:true,orderMode:'custom',customOrder:game.questions.map(positionOf).reverse()}))
   assert.deepEqual(plan.questions.map(positionOf),game.questions.map(positionOf).reverse())
   for(const q of plan.questions){assert.ok(q.choices.length<=maxChoices);assert.ok(q.choices.some(choice=>choice.id===game.corrections[q.id].choiceId));if(q.choices.every(choice=>/^\d+$/.test(choice.text))){const values=q.choices.map(choice=>Number(choice.text));assert.deepEqual(values,[...values].sort((a,b)=>a-b))}}
  }
  assert.deepEqual(game,before)
 })
 await test('new CFR runs renew the selected figures and card order without changing the saved template or linked quadrilaterals',()=>{
  const recipe={...base,libreMode:false,pages:[config('tcm-cfr-ex16'),config('tcm-cfr-ex17')]},before=structuredClone(recipe),figures=new Set(),choices=new Set()
  let source=createGameSource({recipe,name:'Formes CFR'},'saved','cfr-figures')
  for(let run=0;run<12;run++){
   const game=convertRecipe(source.recipe);assert.equal(game.questions.length,9);assert.equal(game.issues.length,1)
   figures.add(JSON.stringify(game.questions.filter(q=>(q.source.part??0)===0).map(q=>q.figure.type)));choices.add(JSON.stringify(game.questions.map(q=>q.choices)))
   const first=game.questions.filter(q=>q.source.page===0).map(q=>q.figure.type),second=game.questions.filter(q=>q.source.page===1).map(q=>q.figure.type)
   assert.equal(first.includes('rhombus'),second.includes('parallelogram'));assert.equal(first.includes('parallelogram'),second.includes('rhombus'))
   source=renewGameSource(source,null)
  }
  assert.ok(figures.size>1);assert.ok(choices.size>1);assert.deepEqual(recipe,before)
 })
 await test('Class, Solo, durable checkpoints and competition share the same verified CFR figures and facts',async()=>{
  const game=prepareGame(convertRecipe(recipeFor('tcm-cfr-ex16',[card('rectangle',true)]))),q=game.questions[0],correct=game.corrections[q.id].choiceId
  const collective=startSession(game,'class');assert.equal(transition(game,collective,{type:'SELECT',choiceId:correct}),collective)
  let solo=startSession(game,'solo')
  for(const [index,kind] of ['correct','wrong','timeout'].entries()){
   const question=game.questions[index],id=game.corrections[question.id].choiceId
   solo=transition(game,solo,kind==='timeout'?{type:'TIMEOUT'}:{type:'SELECT',choiceId:kind==='correct'?id:question.choices.find(choice=>choice.id!==id).id});assert.equal(solo.phase,'revealed');assert.equal(solo.history.at(-1).correct,kind==='correct');solo=transition(game,solo,{type:'NEXT'})
  }
  const record=compactSession(await newRecord(game,'solo'),solo);assert.deepEqual(replaySession(game,record,await planIdentity(game),Date.now(),'solo').state,solo)
  const quiz=parseCompetitionQuiz(competitionQuiz(game,'https://clairfle.example'));assert.deepEqual(quiz.items.map(item=>item.question.figure),game.questions.map(question=>question.figure))
  let room=createCompetition(quiz,{enabled:false,seconds:30,feedbackSeconds:1,speedPoints:false},'online','ABC234',1000)
  room=competitionStep(room,{type:'join',avatarId:'panda'},1100);room=competitionStep(room,{type:'start'},1200)
  const view=competitionView(room,1300,'p1');assert.deepEqual(view.question.figure,q.figure);assert.equal(view.correctChoiceId,undefined)
 })
} finally {await server.close()}
