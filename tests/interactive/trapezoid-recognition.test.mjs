import assert from 'node:assert/strict'
import test from 'node:test'
import {createElement} from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
import {createServer} from 'vite'

const server=await createServer({cacheDir:'/tmp/clairfle-trapezoid-unit',server:{middlewareMode:true,hmr:false},appType:'custom'})
try {
 const {GeometryFigure}=await server.ssrLoadModule('/src/components/math/GeometryFigure.tsx')
 const {tryGenerateFigure}=await server.ssrLoadModule('/src/math/figures-school.ts')
 const {convertRecipe}=await server.ssrLoadModule('/src/interactive/domain/convert.ts')
 const {demoRecipe}=await server.ssrLoadModule('/src/interactive/demo.ts')
 const {defaultPage}=await server.ssrLoadModule('/src/math/catalog.ts')
 const {prepareGame}=await server.ssrLoadModule('/src/interactive/domain/plan.ts')
 const {startSession,transition}=await server.ssrLoadModule('/src/interactive/domain/session.ts')
 const {competitionQuiz,parseCompetitionQuiz}=await server.ssrLoadModule('/src/interactive/competition/core.ts')
 const items=Array.from({length:13},(_,i)=>tryGenerateFigure('figures-proprietes',i)).filter(item=>item.figure==='trapezoid')
 const recipe=(entries=items,seed=1)=>({...demoRecipe(),seed,pages:[{...defaultPage('géométrie'),topic:'figures',exerciseType:'figures-proprietes',count:entries.length,libreItems:entries,extraBlocks:undefined}]})
 const draw=kind=>renderToStaticMarkup(createElement(GeometryFigure,{type:'trapezoid',dims:{bare:true,trapezoidKind:kind}}))
 const points=svg=>/<polygon points="([^"]+)"/.exec(svg)[1].split(' ').map(p=>p.split(',').map(Number))
 const distance=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1])
 function measure(p) {
  const edges=p.map((a,i)=>[p[(i+1)%4][0]-a[0],p[(i+1)%4][1]-a[1]])
  const parallel=[[0,2],[1,3]].filter(([a,b])=>Math.abs(edges[a][0]*edges[b][1]-edges[a][1]*edges[b][0])<1e-7).length
  const right=p.filter((a,i)=>{const b=p[(i+3)%4],c=p[(i+1)%4];return Math.abs((b[0]-a[0])*(c[0]-a[0])+(b[1]-a[1])*(c[1]-a[1]))<1e-7}).length
  const center=[p.reduce((s,a)=>s+a[0],0)/4,p.reduce((s,a)=>s+a[1],0)/4]
  const candidates=[...p,...p.map((a,i)=>[(a[0]+p[(i+1)%4][0])/2,(a[1]+p[(i+1)%4][1])/2])]
  const directions=[]
  for(const point of candidates){const angle=(Math.atan2(point[1]-center[1],point[0]-center[0])+Math.PI)%Math.PI;if(!directions.some(other=>Math.abs(other-angle)<1e-7))directions.push(angle)}
  const axes=directions.filter(angle=>p.every(point=>{const u=[Math.cos(angle),Math.sin(angle)],dot=(point[0]-center[0])*u[0]+(point[1]-center[1])*u[1],reflected=[2*(center[0]+dot*u[0])-point[0],2*(center[1]+dot*u[1])-point[1]];return p.some(other=>distance(reflected,other)<1e-6)})).length
  return {parallel,right,axes,equalLegs:Math.abs(distance(p[1],p[2])-distance(p[3],p[0]))<1e-7}
 }
 const correct=(game,q)=>q.choices.find(choice=>choice.id===game.corrections[q.id].choiceId).text
 await test('actual bare trapezoid SVGs have one parallel pair and their exact right angles, leg lengths and reflection axes',()=>{
  const facts={rectangle:{parallel:1,right:2,axes:0,equalLegs:false},isosceles:{parallel:1,right:0,axes:1,equalLegs:true},scalene:{parallel:1,right:0,axes:0,equalLegs:false}}
  for(const [kind,expected] of Object.entries(facts)){const svg=draw(kind),p=points(svg);assert.equal(p.length,4);assert.ok(p.every(([x,y])=>x>0&&x<260&&y>0&&y<190));assert.deepEqual(measure(p),expected);assert.doesNotMatch(svg,/<text|<polyline/)}
 })
 await test('thirteen trapezoid property questions over 100 seeds use the measured geometry and relevant pair or side choices',()=>{
  for(let seed=1;seed<=100;seed++){
   const source=recipe(items,seed),before=structuredClone(source),game=convertRecipe(source)
   assert.equal(game.questions.length,13);assert.deepEqual(game.issues,[])
   for(const q of game.questions){
    const item=items[q.source.item],property=item.propertyLines[q.source.part],truth=measure(points(draw(item.dims.trapezoidKind)))
    assert.equal(correct(game,q),property.answer);assert.equal(q.figure.dims.bare,true)
    if(property.label==='Côtés parallèles'){assert.match(q.prompt,/paires de côtés parallèles/);assert.equal(correct(game,q),`${truth.parallel} paire`);assert.deepEqual(q.choices.map(c=>c.text).sort(),['1 paire','2 paires','3 paires','aucune paire'].sort())}
    if(property.label==='Angles droits')assert.equal(correct(game,q),String(truth.right))
    if(property.label==='Axes de symétrie')assert.equal(correct(game,q),String(truth.axes))
    if(property.label==='Côtés non parallèles'){assert.match(q.prompt,/deux côtés non parallèles/);assert.equal(truth.equalLegs,true);assert.deepEqual(q.choices.map(c=>c.text).sort(),['différents','égaux'])}
   }
   assert.deepEqual(source,before)
  }
 })
 await test('changed trapezoid keys, reordered facts, invented kinds and measurements are rejected without changing a worksheet',()=>{
  const source=items[1]
  for(const item of [{...source,answer:'trapèze isocèle'},{...source,propertyLines:[...source.propertyLines].reverse()},{...source,dims:{trapezoidKind:'unknown'}},{...source,dims:{trapezoidKind:'isosceles',top:4}}]){
   const input=recipe([item]),before=structuredClone(input),game=convertRecipe(input);assert.equal(game.questions.length,0);assert.equal(game.issues.length,1);assert.deepEqual(input,before)
  }
 })
 await test('collective Class, Solo and the competition contract preserve the verified pair and equal-leg facts',()=>{
  const game=prepareGame(convertRecipe(recipe())),before=structuredClone(game)
  const collective=startSession(game,'class');assert.equal(transition(game,collective,{type:'SELECT',choiceId:game.questions[0].choices[0].id}),collective)
  let solo=startSession(game,'solo')
  for(const q of game.questions){solo=transition(game,solo,{type:'SELECT',choiceId:game.corrections[q.id].choiceId});assert.equal(solo.phase,'revealed');assert.equal(solo.history.at(-1).correct,true);solo=transition(game,solo,{type:'NEXT'})}
  const quiz=parseCompetitionQuiz(competitionQuiz(game,'https://clairfle.example'))
  assert.equal(quiz.items.length,13);assert.deepEqual(quiz.items.map(item=>item.question.figure),game.questions.map(q=>q.figure));assert.deepEqual(game,before)
 })
} finally {await server.close()}
