import assert from 'node:assert/strict'
import {readFile,writeFile} from 'node:fs/promises'
import {createServer} from 'vite'
import {chromium} from 'playwright'
import AxeBuilder from '@axe-core/playwright'

const base='http://127.0.0.1:5182'
process.env.VITE_FICHES_API_URL=base+'/__test_api'
const server=await createServer({cacheDir:'/tmp/clairfle-recognition-browser',server:{host:'127.0.0.1',port:5182,strictPort:true}})
await server.listen()
const recipe=JSON.parse(await readFile('docs/interactive/demo-source-recipe.json','utf8'))
const properties=[['Nom','cercle'],['Côtés','0'],['Angles droits','0'],['Axes de symétrie','une infinité']].map(([label,answer])=>({label,answer}))
const csc={layout:'csc-task',answer:'carré ; rectangle ; cercle ; triangle',cscTask:{kind:'shape-names',figures:['square','rectangle','circle','triangle']}}
const cfrRectangle={layout:'geo',figure:'rectangle',dims:{bare:true},geoNameCard:true,propertyLines:[{label:'Nom',answer:'rectangle'},{label:'Propriété 1',answer:'côtés opposés égaux'},{label:'Propriété 2',answer:'4 angles droits'}],answer:'rectangle ; côtés opposés égaux ; 4 angles droits'}
const cfrPentagon={layout:'geo',figure:'pentagon',dims:{bare:true},geoNameCard:true,propertyLines:[{label:'Nom',answer:'pentagone'}],answer:'pentagone'}
const triangles=[['equilateral','triangle équilatéral','3 côtés égaux','3 angles égaux'],['isosceles','triangle isocèle','2 côtés égaux','2 angles égaux'],['right','triangle rectangle','un angle droit','3 côtés']].map(([triangleKind,name,first,second])=>({layout:'geo',figure:'triangle',dims:{bare:true,triangleKind},geoNameCard:true,propertyLines:[{label:'Nom',answer:name},{label:'Propriété 1',answer:first},{label:'Propriété 2',answer:second}],answer:`${name} ; ${first} ; ${second}`}))
recipe.pages=[{...recipe.pages[0],domain:'tcm-csc',topic:'tcm-csc-test',exerciseType:'tcm-csc-ex17',count:2,libreItems:[csc,{...csc,answer:'carré ; carré ; carré ; carré'}]},
 {...recipe.pages[0],domain:'géométrie',topic:'figures',exerciseType:'figures-proprietes',count:1,libreItems:[{layout:'geo',figure:'circle',propertyLines:properties,answer:properties.map(({label,answer})=>`${label} : ${answer}`).join(' · ')}]},
 {...recipe.pages[0],domain:'géométrie',topic:'figures',exerciseType:'figures-nommer',count:1,libreItems:[{layout:'geo',figure:'cube',answer:'cube'}]},
 {...recipe.pages[0],domain:'tcm-cfr',topic:'tcm-cfr-test',exerciseType:'tcm-cfr-ex16',count:1,libreItems:[cfrRectangle],extraBlocks:[{topic:'tcm-cfr-test',exerciseType:'tcm-cfr-ex17',count:2,columns:1,libreItems:[cfrPentagon,{...cfrPentagon,answer:'trapèze'}]}]},
 {...recipe.pages[0],domain:'tcm-cfr',topic:'tcm-cfr-test',exerciseType:'tcm-cfr-ex16',count:3,libreItems:triangles}]
const {tryGenerateFigure}=await server.ssrLoadModule('/src/math/figures-school.ts')
const trapezoids=Array.from({length:13},(_,i)=>tryGenerateFigure('figures-proprietes',i)).filter(item=>item.figure==='trapezoid')
recipe.pages.push({...recipe.pages[0],domain:'géométrie',topic:'figures',exerciseType:'figures-proprietes',count:3,libreItems:trapezoids})
const original=structuredClone(recipe)
const saved={id:'recognition-source',name:'Formes et propriétés',domains:['tcm-csc','géométrie','tcm-cfr'],recipe,createdAt:'2026-11-12T00:00:00Z',updatedAt:'2026-11-12T00:00:00Z'}
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH||undefined,args:['--no-sandbox']})
const results=[],errors=[],methods=[]
const button=(page,name)=>page.getByRole('button',{name,exact:true})
const card=(page,value)=>page.locator('.ci-answer').filter({has:page.getByText(value,{exact:true})})
async function setup(width,height) {
 const context=await browser.newContext({viewport:{width,height}})
 await context.addCookies([{name:'clairfle-fiche-access',value:'admin',url:base}])
 await context.addInitScript(()=>localStorage.setItem('clairfle-fiche-sync','recognition-fixture-only'))
 await context.route('**/__test_api/fiches',route=>{methods.push(route.request().method());return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({fiches:[saved]})})})
 const page=await context.newPage();page.setDefaultTimeout(30000);page.on('pageerror',error=>errors.push(error.message))
 await page.goto(base+'/interactif/'+saved.id);await page.locator('.ci-launch:enabled').waitFor({timeout:120000})
 return {context,page}
}
async function navigate(page,index) {
 await page.getByRole('button',{name:/^Choisir une question ·/}).click()
 await page.getByRole('dialog',{name:'Choisir une question',exact:true}).locator('li button').nth(index).click()
 await page.waitForFunction(()=>document.querySelector('.ci-round-question')?.dataset.ciReadability!==undefined)
}
async function reveal(page,expected) {
 for(const name of ['Signal : levez vos cartes','Discuter','Enseignant : révéler'])await button(page,name).click()
 assert.equal(await page.locator('.ci-answer-key .ci-answer-content').innerText(),expected)
 assert.equal(await page.locator('.ci-answer-muted').count(),await page.locator('.ci-answer').count()-1)
 assert.equal(await page.locator('.ci-margin-answer,.ci-model-answer').count(),0)
}
async function fits(page,width,height) {
 await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))))
 const rects=await page.locator('.ci-controls:visible,.ci-answer:visible,.ci-figure:visible').evaluateAll(nodes=>nodes.map(node=>({x:node.getBoundingClientRect().x,y:node.getBoundingClientRect().y,right:node.getBoundingClientRect().right,bottom:node.getBoundingClientRect().bottom})))
 for(const rect of rects)assert.ok(rect.x>=-1&&rect.y>=-1&&rect.right<=width+1&&rect.bottom<=height+1,JSON.stringify(rect))
 for(const [index,rect] of rects.entries())for(const other of rects.slice(index+1)) {
  const separated=rect.right<=other.x+1||other.right<=rect.x+1||rect.bottom<=other.y+1||other.bottom<=rect.y+1
  if(!separated)await page.screenshot({path:'/tmp/clairfle-recognition-overlap.png'})
  assert.ok(separated,`Figure, cards and controls must not overlap at ${width}x${height}: ${JSON.stringify({rect,other})}`)
 }
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false)
 assert.equal(await page.locator('.ci-figure svg text').count(),0,'A bare figure must not disclose its name or properties')
 const bounds=await page.locator('.ci-figure').evaluate(node=>{const figure=node.getBoundingClientRect(),body=node.closest('.ci-question-body').getBoundingClientRect(),question=node.closest('.ci-question').getBoundingClientRect();return {figure:figure.toJSON(),body:body.toJSON(),question:question.toJSON()}})
 const inside=container=>bounds.figure.top>=container.top-1&&bounds.figure.bottom<=container.bottom+1
 const wholeFigure=inside(bounds.question)&&(!bounds.body.height||inside(bounds.body))
 if(!wholeFigure)await page.screenshot({path:'/tmp/clairfle-recognition-clipping.png'})
 assert.equal(wholeFigure,true,`The full figure remains visible at ${width}x${height}: ${JSON.stringify(bounds)}`)
 const scan=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()
 assert.deepEqual(scan.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})),[])
}
async function checkTriangle(page,kind,target=page.locator('.ci-figure polygon')) {
 const measured=await target.evaluate(polygon=>{
  const matrix=polygon.getScreenCTM(),points=[...polygon.points].map(p=>new DOMPoint(p.x,p.y).matrixTransform(matrix))
  const length=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y),sides=points.map((p,i)=>length(p,points[(i+1)%3])),epsilon=Math.max(...sides)*1e-6
  const equal=Math.max(...sides.map(value=>sides.filter(other=>Math.abs(other-value)<epsilon).length))
  const right=points.filter((p,i)=>{const a=points[(i+1)%3],b=points[(i+2)%3];return Math.abs((a.x-p.x)*(b.x-p.x)+(a.y-p.y)*(b.y-p.y))<epsilon*epsilon}).length
  return {equal:equal===1?0:equal,right}
 })
 assert.deepEqual(measured,kind==='equilateral'?{equal:3,right:0}:kind==='isosceles'?{equal:2,right:0}:{equal:0,right:1})
}
async function checkTrapezoid(page,kind) {
 const facts=await page.locator('.ci-figure polygon').evaluate(polygon=>{
  const matrix=polygon.getScreenCTM(),p=[...polygon.points].map(point=>new DOMPoint(point.x,point.y).matrixTransform(matrix))
  const e=p.map((a,i)=>({x:p[(i+1)%4].x-a.x,y:p[(i+1)%4].y-a.y}))
  return {parallel:[[0,2],[1,3]].filter(([a,b])=>Math.abs(e[a].x*e[b].y-e[a].y*e[b].x)<1e-6).length,right:p.filter((a,i)=>{const b=p[(i+3)%4],c=p[(i+1)%4];return Math.abs((b.x-a.x)*(c.x-a.x)+(b.y-a.y)*(c.y-a.y))<1e-6}).length}
 })
 assert.deepEqual(facts,{parallel:1,right:kind==='rectangle'?2:0})
}
try {
 if(process.env.RECOGNITION_PRINT_ONLY!=='1') {
 for(const [width,height] of [[390,844],[1366,768],[360,640]]) {
  const {context,page}=await setup(width,height)
  assert.equal(await page.locator('.ci-question-list fieldset > label').count(),35)
  await page.getByText(/formes CSC et leur corrigé ne correspondent plus/).waitFor({state:'attached'})
  await page.getByRole('checkbox',{name:'Activer le minuteur',exact:true}).uncheck()
  await page.locator('.ci-launch').click();await page.locator('.ci-answer').first().waitFor()
  assert.equal(await page.locator('.ci-answer').count(),4);assert.equal(await page.locator('.ci-answer:enabled').count(),0)
  await reveal(page,'carré');await fits(page,width,height)
  await navigate(page,7);await reveal(page,'une infinité');await fits(page,width,height)
  if(width===360)await page.screenshot({path:'docs/interactive/screenshots/recognition-360.png'})
  await button(page,'Quitter la séance').click();await page.locator('.ci-launch:enabled').waitFor()
  await page.reload();await button(page,'Reprendre la séance').click();await page.locator('.ci-answer-key').waitFor()
  assert.equal(await page.locator('.ci-answer-key .ci-answer-content').innerText(),'une infinité')
  await navigate(page,8);await reveal(page,'cube');await fits(page,width,height)
  if(width!==360)await page.screenshot({path:`docs/interactive/screenshots/recognition-${width}.png`})
  await navigate(page,10);await reveal(page,'côtés opposés');await fits(page,width,height)
  await navigate(page,11);await reveal(page,'4');await fits(page,width,height)
  await navigate(page,12);await reveal(page,'pentagone');await fits(page,width,height)
  await page.screenshot({path:`docs/interactive/screenshots/cfr-recognition-${width}.png`})
  for(const [index,kind,name,angleIndex,angles] of [[13,'equilateral','triangle équilatéral',15,'3'],[16,'isosceles','triangle isocèle',18,'2'],[19,'right','triangle rectangle',20,'1']]) {
   await navigate(page,index);await reveal(page,name);await checkTriangle(page,kind);await fits(page,width,height)
   if(kind==='equilateral')await page.screenshot({path:`docs/interactive/screenshots/triangles-${width}.png`})
   await navigate(page,angleIndex);await reveal(page,angles);await fits(page,width,height)
  }
  for(const [nameIndex,kind,name,pairIndex,axisIndex,axes] of [[22,'rectangle','trapèze rectangle',23,25,'0'],[26,'isosceles','trapèze isocèle',27,30,'1'],[31,'scalene','trapèze quelconque',32,34,'0']]) {
   await navigate(page,nameIndex);await reveal(page,name);await checkTrapezoid(page,kind);await fits(page,width,height)
   await navigate(page,pairIndex);assert.match(await page.locator('.ci-question-prompt').innerText(),/paires de côtés parallèles/);await reveal(page,'1 paire');await fits(page,width,height)
   await navigate(page,axisIndex);await reveal(page,axes);await fits(page,width,height)
  }
  await navigate(page,28);assert.match(await page.locator('.ci-question-prompt').innerText(),/deux côtés non parallèles/);await reveal(page,'égaux');await fits(page,width,height)
  await page.screenshot({path:`docs/interactive/screenshots/trapezoids-${width}.png`})
  results.push({viewport:`${width}x${height}`,class:'CSC, generic shapes, CFR, triangles and the three trapezoid names, parallel pairs, equal legs and symmetry axes',geometry:'projected SVG side lengths and right angles verified at actual screen size',resume:'same circle correction and public figure',layout:'figure, cards and controls inside viewport without overlap; axe passes'})
  await context.close()
 }
 const {context,page}=await setup(390,844)
 await button(page,'Tout désélectionner').click()
 for(const index of [23,28,33])await page.locator('.ci-question-list fieldset > label').nth(index).locator('input').check()
 await button(page,'Mode de jeu').click()
 await page.getByRole('spinbutton',{name:'Temps de réflexion (secondes)',exact:true}).fill('5')
 await button(page,'Régler le minuteur').click();await page.getByRole('spinbutton',{name:'Temps entre les questions (secondes)',exact:true}).fill('1');await button(page,'Fermer les réglages').click()
 await page.clock.install();await page.clock.pauseAt(new Date(Date.now()+1000))
 await page.locator('.ci-launch').click();await page.locator('.ci-answer:enabled').first().waitFor()
 await card(page,'1 paire').click();await page.locator('.ci-answer-correct').waitFor();await page.clock.runFor(1100)
 await page.locator('.ci-answer:enabled').first().waitFor();await page.locator('.ci-answer').filter({hasNot:page.getByText('égaux',{exact:true})}).first().click();await page.locator('.ci-answer-incorrect').waitFor()
 assert.equal(await page.locator('.ci-answer-key .ci-answer-content').innerText(),'égaux')
 await page.clock.runFor(1100);await page.locator('.ci-answer:enabled').first().waitFor();await page.clock.runFor(5100);await page.locator('.ci-reveal').waitFor()
 assert.equal(await page.locator('.ci-answer-key .ci-answer-content').innerText(),'0')
 assert.equal((await page.locator('.ci-correction-status').innerText()).trim(),'Temps écoulé')
 await page.clock.runFor(1100);await page.locator('.ci-summary').waitFor();assert.equal(await page.locator('.ci-summary-questions > p').count(),3)
 await context.close();results.push({solo:'one parallel pair accepted, wrong equal-leg relation corrected, timeout on zero right angles; automatic one-second progression'})
 const local=await setup(390,844)
 await button(local.page,'Tout désélectionner').click();await local.page.locator('.ci-question-list fieldset > label').nth(28).locator('input').check()
 await local.page.getByRole('checkbox',{name:'Activer le minuteur',exact:true}).uncheck()
 await button(local.page,'Compétition').click();await button(local.page,'Préparer le défi local').click()
 await button(local.page,'Ajouter cette mascotte').click();await button(local.page,'Renard').click();await button(local.page,'Ajouter cette mascotte').click()
 await button(local.page,'Commencer la compétition').click();await button(local.page,'Je suis prêt').click();await local.page.locator('.ci-answer:enabled').first().waitFor();await local.context.setOffline(true)
 await card(local.page,'égaux').click();await button(local.page,'Je suis prêt').click();await local.page.locator('.ci-answer').filter({hasNot:local.page.getByText('égaux',{exact:true})}).first().click();await local.page.locator('.ci-answer-key').waitFor()
 assert.equal(await local.page.locator('.ci-answer-key .ci-answer-content').innerText(),'égaux');await checkTrapezoid(local.page,'isosceles');await fits(local.page,390,844);await local.context.close()
 assert.deepEqual(recipe,original);assert.ok(methods.every(method=>method==='GET'));assert.deepEqual(errors,[])
 results.push({competition:'two leg-relation cards, verified isosceles trapezoid, two fixed mascots, offline local turns and correction',sourceTemplate:'unchanged',serverWrites:0,errors})
 await writeFile('docs/interactive/recognition-results.json',JSON.stringify(results,null,2)+'\n');console.log(JSON.stringify(results,null,2))
 }
 const paper=await setup(1366,1000)
 const paperRecipe={...recipe,pages:[{...recipe.pages.find(page=>page.libreItems?.[0]?.dims?.triangleKind==='equilateral'),columns:1,exerciseNo:16}],printCorrections:true,hideChrome:false}
 await paper.page.evaluate(source=>{history.pushState({clairfleFiche:{id:'triangles-paper',name:'Triangles CFR vérifiés',recipe:source}},'','/generateur');window.dispatchEvent(new PopStateEvent('popstate'))},paperRecipe)
 await paper.page.locator('.a4-frame .worksheet-sheet').first().waitFor({timeout:120000})
 await paper.page.evaluate(()=>document.fonts.ready)
 await paper.page.emulateMedia({media:'print'})
 const printed=paper.page.locator('.print-only-sheets .worksheet-sheet')
 assert.equal(await printed.count(),2)
 for(const sheet of await printed.all())for(const [index,kind] of ['equilateral','isosceles','right'].entries())await checkTriangle(paper.page,kind,sheet.locator('.geometry-figure polygon').nth(index))
 const overflow=await printed.evaluateAll(sheets=>sheets.flatMap((sheet,index)=>{const bottom=sheet.querySelector('.doc-footer').getBoundingClientRect().top;return [...sheet.querySelectorAll('.exercise-block')].filter(block=>block.getBoundingClientRect().bottom>bottom+1).map(()=>index+1)}))
 assert.deepEqual(overflow,[])
 const pdf=await paper.page.pdf({path:'docs/interactive/triangles-a4-exemple.pdf',preferCSSPageSize:true,printBackground:true})
 assert.equal([...pdf.toString('latin1').matchAll(/\/Type\s*\/Page\b/g)].length,2)
 assert.deepEqual(recipe,original);assert.ok(methods.every(method=>method==='GET'));assert.deepEqual(errors,[])
 await paper.context.close()
 await writeFile('docs/interactive/triangles-print-results.json',JSON.stringify({pages:2,figures:'three mathematically checked triangle kinds on student and answer sheets',overflow,sourceTemplate:'unchanged',errors},null,2)+'\n')
} finally {await browser.close();await server.close()}
