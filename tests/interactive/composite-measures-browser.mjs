import assert from 'node:assert/strict'
import {writeFile} from 'node:fs/promises'
import {createServer} from 'vite'
import {chromium} from 'playwright'
const server=await createServer({cacheDir:'/tmp/accounts-layout-vite',server:{host:'127.0.0.1',port:5194,strictPort:true}})
await server.listen();let browser
try{
 browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']})
 const page=await browser.newPage({viewport:{width:1000,height:1200}}),errors=[],results=[]
 page.on('pageerror',e=>errors.push(e.message))
 await page.goto('http://127.0.0.1:5194/tests/fixtures/measured-figures.html?composites')
 await page.locator('[data-type="composite-36"] .geometry-measure-label').first().waitFor()
 for(const font of [16,20,24]){
  await page.locator('main').evaluate((n,f)=>n.style.fontSize=`${f}px`,font)
  const shapes=await page.locator('section[data-type^="composite-"]').evaluateAll(ns=>ns.map(n=>{
   const svg=n.querySelector('svg'),path=svg.querySelector('path'),inverse=svg.getScreenCTM().inverse(),bounds=n.getBoundingClientRect()
   const elements=[...n.querySelectorAll('.geometry-measure-label')]
   const labels=elements.map(l=>{
    const r=l.getBoundingClientRect();let hits=0
    for(const fx of [.05,.25,.5,.75,.95])for(const fy of [.15,.5,.85]){
     const q=new DOMPoint(r.x+r.width*fx,r.y+r.height*fy).matrixTransform(inverse)
     if(path.isPointInFill(q))hits++
    }
    return{text:l.textContent,font:getComputedStyle(l).fontSize,hits,outsideColumn:r.left<bounds.left-1||r.right>bounds.right+1}
   })
   const overlaps=[]
   for(let i=0;i<elements.length;i++)for(let j=i+1;j<elements.length;j++){
    const a=elements[i].getBoundingClientRect(),b=elements[j].getBoundingClientRect()
    if(Math.min(a.right,b.right)-Math.max(a.left,b.left)>1&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>1)overlaps.push([i,j])
   }
   return{id:n.dataset.type,labels,overlaps,svgText:svg.querySelectorAll('text').length}
  }))
  results.push({font,shapes})
  await page.screenshot({path:`/tmp/composite-measures-${font}.png`,fullPage:true})
 }
 await writeFile('docs/tcm-cfr/formes-composees-20261120-browser.json',JSON.stringify({results,errors},null,2)+'\n')
 const issues=[]
 for(const {font,shapes} of results){assert.equal(shapes.length,37);for(const shape of shapes){assert.equal(shape.svgText,0);for(const label of shape.labels){assert.equal(label.font,`${font}px`);if(label.hits||label.outsideColumn)issues.push({font,id:shape.id,...label})}if(shape.overlaps.length)issues.push({font,id:shape.id,overlaps:shape.overlaps})}}
 assert.deepEqual(issues,[]);assert.deepEqual(errors,[])
 console.log('37 formes composées, cotes à 16/20/24 px : aucun chevauchement de surface, de cote ou de colonne.')
}finally{await browser?.close();await server.close()}
