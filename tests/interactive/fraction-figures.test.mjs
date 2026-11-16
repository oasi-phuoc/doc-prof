import assert from 'node:assert/strict'
import {test} from 'node:test'
import {createElement} from 'react'
import {renderToStaticMarkup,renderToReadableStream} from 'react-dom/server'
import {createServer} from 'vite'
const vite=await createServer({server:{middlewareMode:true,hmr:false},appType:'custom',cacheDir:'/tmp/clairfle-fraction-figures-unit'})
try{
 const {convertRecipe}=await vite.ssrLoadModule('/src/interactive/domain/convert.ts')
 const {readFractionFigure}=await vite.ssrLoadModule('/src/interactive/domain/read-fraction-figure.ts')
 const {validFractionFigure}=await vite.ssrLoadModule('/src/interactive/domain/fraction-figure.ts')
 const {FractionFigureView}=await vite.ssrLoadModule('/src/interactive/components/FractionFigureView.tsx')
 const warm=await renderToReadableStream(createElement(FractionFigureView,{figure:{kind:'square',colored:[true,false]}}));await warm.allReady
 const {QuestionStage}=await vite.ssrLoadModule('/src/interactive/components/QuestionStage.tsx')
 const {buildPage,buildWorksheets}=await vite.ssrLoadModule('/src/math/generate.ts')
 const {defaultPage}=await vite.ssrLoadModule('/src/math/catalog.ts')
 const {demoRecipe}=await vite.ssrLoadModule('/src/interactive/demo.ts')
 const {prepareGame}=await vite.ssrLoadModule('/src/interactive/domain/plan.ts')
 const {applyPlanOptions,DEFAULT_PLAN_OPTIONS}=await vite.ssrLoadModule('/src/interactive/domain/plan-options.ts')
 const {startSession,transition}=await vite.ssrLoadModule('/src/interactive/domain/session.ts')
 const {newRecord,compactSession,replaySession,planIdentity}=await vite.ssrLoadModule('/src/interactive/domain/persistence.ts')
 const {createGameSource,renewGameSource}=await vite.ssrLoadModule('/src/interactive/game-run.ts')
 const {competitionQuiz,parseCompetitionQuiz,createCompetition,competitionStep,competitionView}=await vite.ssrLoadModule('/src/interactive/competition/core.ts')
 const {teacherSheetRows}=await vite.ssrLoadModule('/src/interactive/domain/teacher-sheet.ts')
 const {PALETTE,defaultShapes}=await vite.ssrLoadModule('/src/interactive/domain/palette.ts')
 const colors=PALETTE.map(slot=>slot.color),base=demoRecipe()
 const configs=[['tpm','tpm-info','tpm-frac-read'],['tcm-cfr','tcm-cfr-test','tcm-cfr-ex13']]
 const config=([domain,topic,exerciseType],difficulty='moyen')=>({...defaultPage(domain),topic,exerciseType,difficulty,count:7,extraBlocks:undefined,libreItems:undefined})
 const item=(kind,n,d,extra={})=>({layout:'fraction-shape',fracShape:{kind,n,d,copies:1,multi:false,mode:'read',...extra},answer:`${n}/${d}`})
 const fixture=(...items)=>({...base,libreMode:true,pages:[{...config(configs[0]),count:items.length,libreItems:items}]})
 const ratio=text=>{const [n,d='1']=text.replace('−','-').split('/');assert.match(n,/^-?\d+$/);assert.match(d,/^\d+$/);return[BigInt(n),BigInt(d)]}
 const equal=(a,b)=>a[0]*b[1]===b[0]*a[1]
 const areas=svg=>[...svg.matchAll(/<polygon[^>]*points="([^"]+)"[^>]*fill="(?:var\(--purple\)|#fff)"/g)].map(match=>{const p=match[1].split(' ').map(pair=>pair.split(',').map(Number));return Math.abs(p.reduce((sum,[x,y],i)=>{const [nx,ny]=p[(i+1)%p.length];return sum+x*ny-y*nx},0))/2})

 await test('both generated reading families preserve source figures and keys through 600 configurations, without changing print data',()=>{
  for(const family of configs)for(const difficulty of['facile','moyen','avance'])for(let seed=1;seed<=100;seed++){
   const page=config(family,difficulty),recipe={...base,pages:[page],seed,libreMode:false},before=structuredClone(recipe),paper=seed===1?buildWorksheets(recipe.pages,seed):undefined
   const source=buildPage(page,seed).blocks.flatMap(block=>block.items),game=convertRecipe(recipe)
   assert.equal(game.questions.length,source.length,JSON.stringify(game.issues));assert.deepEqual(game.issues,[])
   for(const[qIndex,q]of game.questions.entries()){
    const raw=source[qIndex],figure=q.fractionFigure,correct=q.choices.find(choice=>choice.id===game.corrections[q.id].choiceId)
    assert.equal(figure.kind,raw.fracShape.kind);assert.equal(figure.colored.length,raw.fracShape.d);assert.equal(figure.colored.filter(Boolean).length,raw.fracShape.n);assert.equal(correct.text,raw.answer)
    assert.equal(q.choices.length,6);assert.equal(q.mode,'choice');assert.equal(q.compatibility,'assisted');assert.equal(q.source.exerciseType,family[2])
    const values=q.choices.map(choice=>ratio(choice.text));for(let a=0;a<values.length;a++){assert.ok(values[a][0]>=0n&&values[a][0]<=values[a][1]);for(let b=a+1;b<values.length;b++)assert.ok(!equal(values[a],values[b]))}
    assert.ok(equal(ratio(correct.text),[BigInt(raw.fracShape.n),BigInt(raw.fracShape.d)]))
    assert.deepEqual(Object.keys(figure).sort(),['colored','kind']);assert.ok(!('correct' in q||'answer' in q))
   }
   assert.deepEqual(recipe,before);assert.deepEqual(convertRecipe(recipe),game)
   if(paper)assert.deepEqual(buildWorksheets(recipe.pages,seed),paper)
  }
 })
 await test('every supported subdivision draws exactly its denominator and colored numerator, with equal polygon areas',()=>{
  const denominators={rect:Array.from({length:19},(_,i)=>i+2),square:Array.from({length:9},(_,i)=>i+2),triangle:[1,2,3,4,6,9],circle:Array.from({length:19},(_,i)=>i+2),semicircle:Array.from({length:9},(_,i)=>i+2),quartercircle:Array.from({length:9},(_,i)=>i+2),hexagon:[2,3,4,6,12]}
  for(const[kind,ds]of Object.entries(denominators))for(const d of ds)for(let n=0;n<=d;n++){
   const adapted=readFractionFigure(item(kind,n,d),'tpm-frac-read',31);assert.ok(adapted&&!adapted.reason,JSON.stringify({kind,n,d,adapted}))
   const svg=renderToStaticMarkup(createElement(FractionFigureView,{figure:adapted.figure}))
   assert.equal((svg.match(/fill="var\(--purple\)"/g)??[]).length,n,`${kind}/${n}/${d}`)
   assert.equal((svg.match(/fill="(?:var\(--purple\)|#fff)"/g)??[]).length,d)
   assert.ok(!svg.includes('onClick')&&!svg.includes('tabindex'))
   assert.ok(!svg.includes(`${n}/${d}`),'accessible description provides the visible facts, not a prewritten fraction')
   const polygonAreas=areas(svg);if(polygonAreas.length){assert.equal(polygonAreas.length,d);assert.ok(Math.max(...polygonAreas)/Math.min(...polygonAreas)<1.01,JSON.stringify({kind,d,polygonAreas}))}
  }
 })
 await test('invalid or contradictory source drawings are excluded, while coloring and multiple figures retain their existing fallback',()=>{
  const good=item('circle',2,5)
  for(const bad of[
   {...good,answer:'3/5'},{...good,answer:'1/0'},{...good,answer:'2/5; alert(1)'},{...good,fracShape:undefined},
   item('square',-1,4),item('square',5,4),item('square',1.5,4),item('square',1,0),item('circle',1,21),item('triangle',1,5),item('hexagon',1,9),item('grid',1,100),item('sphere',1,4),item('circle',1,3,{copies:2}),item('circle',1,3,{multi:true}),item('circle',1,3,{mode:'color'})
  ]){const result=readFractionFigure(bad,'tpm-frac-read',1);assert.ok(result?.reason,JSON.stringify(bad));assert.equal(convertRecipe(fixture(bad)).questions.length,0)}
  assert.equal(readFractionFigure(item('square',1,4,{mode:'color'}),'tpm-frac-color',1),undefined)
  assert.equal(readFractionFigure(good,'unknown-type',1),undefined)
 })
 await test('six choices remain exact under every cap, Class and Solo replay, and a new seed renews figures without changing their template',async()=>{
  const recipe={...base,seed:18,pages:[config(configs[0])],libreMode:false},game=convertRecipe(recipe),before=structuredClone(recipe)
  for(const choiceCap of[2,3,4,5,6]){
   const plan=prepareGame(applyPlanOptions(game,{...DEFAULT_PLAN_OPTIONS,maxChoices:choiceCap,numericOrder:true}))
   for(const q of plan.questions){assert.equal(q.choices.length,choiceCap);assert.ok(q.choices.some(c=>c.id===plan.corrections[q.id].choiceId));for(let i=1;i<q.choices.length;i++){const a=ratio(q.choices[i-1].text),b=ratio(q.choices[i].text);assert.ok(a[0]*b[1]<b[0]*a[1])}}
   for(const mode of['class','solo']){
    let state=startSession(plan,mode);const q=plan.questions[0],choiceId=plan.corrections[q.id].choiceId
    const actions=mode==='solo'?[{type:'SELECT',choiceId}]:[{type:'CARDS_UP'},{type:'DISCUSS'},{type:'REVEAL'}];for(const action of actions)state=transition(plan,state,action)
    assert.equal(state.phase,'revealed');if(mode==='solo')assert.equal(state.history[0].correct,true)
    const record=compactSession(await newRecord(plan,mode),state);assert.deepEqual(replaySession(plan,record,await planIdentity(plan),Date.now(),mode).state,state)
   }
  }
  const source=createGameSource({recipe,name:'Fractions en images'},'pool','aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee')
  const renewed=renewGameSource(source,null)
  assert.notDeepEqual(convertRecipe(renewed.recipe).questions.map(q=>q.fractionFigure),game.questions.map(q=>q.fractionFigure))
  assert.equal(renewed.recipe.pages[0].exerciseType,'tpm-frac-read');assert.deepEqual(recipe,before)
  assert.ok(teacherSheetRows(game,colors,defaultShapes).every(row=>row.notes.includes('coloriée')))
 })
 await test('rooms sanitize public partitions, hide the answer until correction, grade exactly and reject malformed drawing payloads',()=>{
  const game=convertRecipe(fixture(item('triangle',6,9))),quiz=competitionQuiz(game,'https://class.example'),parsed=parseCompetitionQuiz(quiz,['https://class.example'])
  assert.deepEqual(parsed.items[0].question.fractionFigure,game.questions[0].fractionFigure);assert.ok(parsed.items[0].question.choices.every(c=>/^c\d$/.test(c.id)))
  const settings={enabled:false,seconds:10,feedbackSeconds:1,speedPoints:false}
  let room=createCompetition(parsed,settings,'online','123456',1000)
  room=competitionStep(room,{type:'join',avatarId:'leaf'},1000);room=competitionStep(room,{type:'join',avatarId:'owl'},1001);const player=room.players[0].id
  room=competitionStep(room,{type:'start'},1100);const before=competitionView(room,1200,player)
  assert.equal(before.correctChoiceId,undefined);assert.ok(!JSON.stringify(before.question).includes('correctChoiceId'))
  room=competitionStep(room,{type:'answer',questionId:before.question.id,playerId:player,choiceId:room.quiz.items[0].correctChoiceId},1300)
  assert.equal(competitionView(room,1350,player).self.correct,undefined);room=competitionStep(room,{type:'answer',questionId:before.question.id,playerId:room.players[1].id,choiceId:room.quiz.items[0].correctChoiceId},1400);assert.equal(competitionView(room,1401,player).self.correct,true)
  for(const figure of[{kind:'square',colored:[true,false],answer:'1/2'},{kind:'triangle',colored:Array(5).fill(false)},{kind:'square',colored:[1,0]},{kind:'grid',colored:Array(100).fill(true)},{kind:'circle',colored:Array(21).fill(true)},{kind:'circle',colored:Array(2)},{kind:'circle',colored:[]},{kind:'<svg onload=alert(1)>',colored:[true,false]}]){
   const edited=structuredClone(quiz);edited.items[0].question.fractionFigure=figure;assert.equal(validFractionFigure(figure),false);assert.throws(()=>parseCompetitionQuiz(edited,['https://class.example']),/Fraction illustrée invalide/)
  }
  const q=game.questions[0],thinking=renderToStaticMarkup(createElement(QuestionStage,{q,phase:'thinking',colors,correctChoiceId:game.corrections[q.id].choiceId,onSelect:()=>{}}))
  assert.ok(thinking.includes('ci-fraction-figure'));assert.equal((thinking.match(/class="ci-fraction-digits"/g)??[]).length,4);assert.ok(!thinking.includes('ci-correct'))
 })
 await test('online creation refuses an older server before sending a drawing or teacher credential, while ordinary rooms remain compatible',async()=>{
  const {createRoom}=await vite.ssrLoadModule('/src/interactive/competition/client.ts')
  const quiz=competitionQuiz(convertRecipe(fixture(item('square',2,4))),'https://class.example')
  const settings={enabled:false,seconds:10,feedbackSeconds:1,speedPoints:false},original=globalThis.fetch,calls=[]
  let features=[]
  globalThis.fetch=async(url,options={})=>{calls.push({url,options});return Response.json(String(url).endsWith('/status')?{available:true,features}:{code:'123456',token:'fixture-only',view:{}})}
  try{
   await assert.rejects(createRoom(quiz,settings,colors,defaultShapes,'fixture-only'),/serveur des salles doit être mis à jour/)
   assert.equal(calls.length,1);assert.ok(calls[0].url.endsWith('/status'));assert.equal(calls[0].options.headers,undefined)
   features=['fraction-figures-v1'];await createRoom(quiz,settings,colors,defaultShapes,'fixture-only')
   assert.equal(calls.length,3);assert.ok(calls[2].url.endsWith('/rooms'));assert.deepEqual(JSON.parse(calls[2].options.body).quiz,quiz)
   const ordinary=structuredClone(quiz);delete ordinary.items[0].question.fractionFigure
   await createRoom(ordinary,settings,colors,defaultShapes,'fixture-only');assert.equal(calls.length,4);assert.ok(calls[3].url.endsWith('/rooms'))
  }finally{globalThis.fetch=original}
 })
}finally{await vite.close()}
