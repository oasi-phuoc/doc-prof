import assert from 'node:assert/strict'
import test from 'node:test'
import {createElement} from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
import {createServer} from 'vite'

const server=await createServer({cacheDir:'/tmp/clairfle-csc-axes-unit',server:{middlewareMode:true,hmr:false},appType:'custom'})
try {
 const {generateCscExercise}=await server.ssrLoadModule('/src/tcm-csc/items.ts')
 const {recalculateCsc}=await server.ssrLoadModule('/src/tcm-csc/recalculate.ts')
 const {recalcTpmLibreItem}=await server.ssrLoadModule('/src/tpm/libre-recalc.ts')
 const {CoordBlock}=await server.ssrLoadModule('/src/components/item-view/geo-coord.tsx')
 const field=(svg,axis,value)=>{
  const tag=new RegExp(`<text data-axis="${axis}" data-coordinate="${value}"[^>]*>`).exec(svg)[0]
  return {x:Number(/ x="([^"]+)"/.exec(tag)[1]),y:Number(/ y="([^"]+)"/.exec(tag)[1]),anchor:/text-anchor="([^"]+)"/.exec(tag)[1]}
 }
 await test('both CSC coordinate exercises keep deterministic data and sample all four independent axis directions over 100 seeds',()=>{
  for(const type of ['tcm-csc-ex19','tcm-csc-ex20']){
   const directions=new Set()
   for(let seed=1;seed<=100;seed++){
    const items=generateCscExercise(type,1,seed),item=items[0]
    directions.add(item.cscTask.xDirection+'/'+item.cscTask.yDirection)
    assert.deepEqual(generateCscExercise(type,1,seed),items)
    assert.equal(item.coordScene.marks.length,6);assert.equal(item.coordQuestions.length,6)
   }
   assert.equal(directions.size,4)
  }
 })
 await test('free-mode axis choices survive recalculation without moving logical coordinates or changing the answer key',()=>{
  for(const type of ['tcm-csc-ex19','tcm-csc-ex20']){
   const source=generateCscExercise(type,1,7)[0],before=structuredClone(source)
   for(const xDirection of ['left-to-right','right-to-left'])for(const yDirection of ['bottom-to-top','top-to-bottom']){
    const input={...source,cscTask:{...source.cscTask,xDirection,yDirection}},result=recalcTpmLibreItem(input,type)
    assert.equal(result.cscTask.xDirection,xDirection);assert.equal(result.cscTask.yDirection,yDirection)
    assert.deepEqual(result.coordScene,source.coordScene);assert.deepEqual(result.coordQuestions,source.coordQuestions);assert.equal(result.answer,source.answer);assert.equal(result.libreError,undefined)
   }
   const invalid=recalculateCsc({...source,cscTask:{...source.cscTask,xDirection:'unknown'}},type)
   assert.ok(invalid.libreError);assert.equal(invalid.answer,'');assert.deepEqual(source,before)
  }
 })
 await test('actual SVG labels and the A1 shape agree at each of the four physical corners, with row numbers outside the right edge',()=>{
  const source=generateCscExercise('tcm-csc-ex20',1,4)[0]
  for(const xDirection of ['left-to-right','right-to-left'])for(const yDirection of ['bottom-to-top','top-to-bottom']){
   const item={...source,coordScene:{...source.coordScene,marks:[{kind:'circle',x:1,y:1}]},coordQuestions:[],cscTask:{...source.cscTask,xDirection,yDirection}}
   const svg=renderToStaticMarkup(createElement(CoordBlock,{item,mode:'answers'}))
   const cell=/<g[^>]*data-coord-cell="1;1"[\s\S]*?<circle cx="([^"]+)" cy="([^"]+)"/.exec(svg)
   const cx=Number(cell[1]),cy=Number(cell[2]),a=field(svg,'x',1),one=field(svg,'y',1)
   assert.equal(cx,xDirection==='right-to-left'?122:10);assert.equal(cy,yDirection==='top-to-bottom'?12:124)
   assert.equal(a.x,cx);assert.equal(one.y,cy);assert.equal(one.x,133);assert.equal(one.anchor,'start')
   assert.ok(one.x>130&&a.y>132)
  }
 })
 await test('every regenerated measuring exercise includes cm and mm, exact displays and unchanged physical longest/shortest answers',()=>{
  const variants=new Set()
  for(let seed=1;seed<=100;seed++){
   const item=generateCscExercise('tcm-csc-ex14',1,seed)[0],segments=item.segments
   assert.equal(segments.length,3);assert.deepEqual([...new Set(segments.map(s=>s.unit))].sort(),['cm','mm']);variants.add(segments.map(s=>s.unit).join('/'))
   for(const segment of segments){const value=Number(segment.display.replace(',','.'));assert.ok(Math.abs(value*(segment.unit==='cm'?10:1)-segment.mm)<1e-7)}
   const lengths=segments.map(s=>s.mm),expected=[Math.max(...lengths),Math.min(...lengths)].map(length=>String.fromCharCode(65+lengths.indexOf(length))).join(' ; ')
   assert.equal(item.answer,expected)
   const edited=recalculateCsc(item,'tcm-csc-ex14');assert.deepEqual(edited.segments,segments);assert.equal(edited.answer,expected)
  }
  assert.ok(variants.size>=4)
 })
} finally {await server.close()}
