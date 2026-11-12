import assert from 'node:assert/strict'
import test from 'node:test'
import {createElement} from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
import {createServer} from 'vite'

const server=await createServer({cacheDir:'/tmp/clairfle-triangle-recognition-unit',server:{middlewareMode:true,hmr:false},appType:'custom'})
try {
 const {GeometryFigure}=await server.ssrLoadModule('/src/components/math/GeometryFigure.tsx')
 const {tryGenerateFigure}=await server.ssrLoadModule('/src/math/figures-school.ts')
 const {convertRecipe}=await server.ssrLoadModule('/src/interactive/domain/convert.ts')
 const {defaultPage}=await server.ssrLoadModule('/src/math/catalog.ts')
 const {demoRecipe}=await server.ssrLoadModule('/src/interactive/demo.ts')
 const base=demoRecipe(),draw=(kind,extra={})=>renderToStaticMarkup(createElement(GeometryFigure,{type:'triangle',dims:{triangleKind:kind,...extra}}))
 const points=svg=>/<polygon points="([^"]+)"/.exec(svg)[1].split(' ').map(pair=>pair.split(',').map(Number))
 const distance=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1])
 const repeated=values=>Math.max(...values.map(value=>values.filter(other=>Math.abs(other-value)<1e-6).length))>1?Math.max(...values.map(value=>values.filter(other=>Math.abs(other-value)<1e-6).length)):0
 function facts(p) {
  const sides=p.map((point,index)=>distance(point,p[(index+1)%3]))
  const angles=p.map((point,index)=>{const a=p[(index+1)%3],b=p[(index+2)%3],u=[a[0]-point[0],a[1]-point[1]],v=[b[0]-point[0],b[1]-point[1]];return Math.acos(Math.max(-1,Math.min(1,(u[0]*v[0]+u[1]*v[1])/(Math.hypot(...u)*Math.hypot(...v)))))*180/Math.PI})
  const axes=p.filter((origin,index)=>{
   const a=p[(index+1)%3],b=p[(index+2)%3],u=[(a[0]+b[0])/2-origin[0],(a[1]+b[1])/2-origin[1]],norm=u[0]*u[0]+u[1]*u[1]
   return p.every(point=>{const projection=((point[0]-origin[0])*u[0]+(point[1]-origin[1])*u[1])/norm,reflected=[2*(origin[0]+projection*u[0])-point[0],2*(origin[1]+projection*u[1])-point[1]];return p.some(other=>distance(reflected,other)<1e-6)})
  }).length
  return {sides,angles,equalSides:repeated(sides),equalAngles:repeated(angles),rightAngles:angles.filter(angle=>Math.abs(angle-90)<1e-6).length,axes}
 }
 const expected={equilateral:{equalSides:3,equalAngles:3,rightAngles:0,axes:3},isosceles:{equalSides:2,equalAngles:2,rightAngles:0,axes:1},right:{equalSides:0,equalAngles:0,rightAngles:1,axes:0},scalene:{equalSides:0,equalAngles:0,rightAngles:0,axes:0}}
 const recipe=(type,items)=>({...base,pages:[{...defaultPage(type.startsWith('tcm')?'tcm-cfr':'géométrie'),topic:type.startsWith('tcm')?'tcm-cfr-test':'figures',exerciseType:type,count:items.length,extraBlocks:undefined,libreItems:items}]})
 const key=(game,q)=>q.choices.find(choice=>choice.id===game.corrections[q.id].choiceId).text
 await test('the actual bare and unmeasured SVGs have the equal sides, angles and reflection axes of all four triangle kinds',()=>{
  for(const [kind,truth] of Object.entries(expected))for(const extra of [{bare:true},{}]){
   const vertices=points(draw(kind,extra)),measured=facts(vertices)
   assert.equal(vertices.length,3);assert.ok(vertices.every(([x,y])=>x>=2&&x<=258&&y>=2&&y<=188))
   for(const field of Object.keys(truth))assert.equal(measured[field],truth[field],`${kind}: ${field}`)
   assert.ok(Math.abs(measured.angles.reduce((sum,n)=>sum+n,0)-180)<1e-6)
   if(kind==='equilateral')assert.ok(measured.angles.every(angle=>Math.abs(angle-60)<1e-6))
  }
 })
 await test('generic triangle property keys agree with independently measured SVG sides, right angles and symmetry axes',()=>{
  const items=Array.from({length:13},(_,index)=>tryGenerateFigure('figures-proprietes',index)).filter(item=>item.figure==='triangle')
  const before=structuredClone(items),game=convertRecipe(recipe('figures-proprietes',items))
  assert.equal(game.questions.length,16);assert.deepEqual(game.issues,[])
  for(const q of game.questions){const item=items[q.source.item],measured=facts(points(draw(item.dims.triangleKind,{bare:true}))),part=q.source.part;if(part)assert.equal(key(game,q),String([measured.equalSides,measured.rightAngles,measured.axes][part-1]));assert.equal(q.figure.dims.bare,true)}
  assert.deepEqual(items,before)
 })
 await test('triangle naming remains unambiguous under the most-precise-name instruction, including the generic triangle source',()=>{
  const items=Array.from({length:16},(_,index)=>tryGenerateFigure('figures-nommer',index)).filter(item=>item.figure==='triangle')
  for(let seed=1;seed<=100;seed++){
   const input=recipe('figures-nommer',items);input.seed=seed;const game=convertRecipe(input)
   assert.equal(game.questions.length,4);assert.deepEqual(game.issues,[])
   for(const q of game.questions){assert.match(q.prompt,/nom le plus précis/);assert.equal(key(game,q),items[q.source.item].answer);if(key(game,q)==='triangle')assert.ok(!q.choices.some(choice=>choice.text==='triangle quelconque'))}
  }
 })
 await test('measured triangle diagrams and their dimension labels retain their existing layout',()=>{
  const examples=[['equilateral',{side:4},'130,32 220,152 40,152'],['isosceles',{a:5,b:5,c:6},'130,28 235,152 25,152'],['right',{a:3,b:4,c:5},'48,152 210,152 48,42']]
  for(const [kind,dims,outline] of examples){const before=structuredClone(dims),svg=draw(kind,{...dims,unit:'cm'});assert.equal(/<polygon points="([^"]+)"/.exec(svg)[1],outline);assert.equal((svg.match(/<text /g)??[]).length,3);assert.deepEqual(dims,before)}
 })
} finally {await server.close()}
