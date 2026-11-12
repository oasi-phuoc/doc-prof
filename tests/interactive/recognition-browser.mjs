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
recipe.pages=[{...recipe.pages[0],domain:'tcm-csc',topic:'tcm-csc-test',exerciseType:'tcm-csc-ex17',count:2,libreItems:[csc,{...csc,answer:'carré ; carré ; carré ; carré'}]},
 {...recipe.pages[0],domain:'géométrie',topic:'figures',exerciseType:'figures-proprietes',count:1,libreItems:[{layout:'geo',figure:'circle',propertyLines:properties,answer:properties.map(({label,answer})=>`${label} : ${answer}`).join(' · ')}]},
 {...recipe.pages[0],domain:'géométrie',topic:'figures',exerciseType:'figures-nommer',count:1,libreItems:[{layout:'geo',figure:'cube',answer:'cube'}]}]
const original=structuredClone(recipe)
const saved={id:'recognition-source',name:'Formes et propriétés',domains:['tcm-csc','géométrie'],recipe,createdAt:'2026-11-12T00:00:00Z',updatedAt:'2026-11-12T00:00:00Z'}
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
try {
 for(const [width,height] of [[390,844],[1366,768],[360,640]]) {
  const {context,page}=await setup(width,height)
  assert.equal(await page.locator('.ci-question-list fieldset > label').count(),9)
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
  results.push({viewport:`${width}x${height}`,class:'four CSC shape names; circle properties including infinitely many axes; cube name',resume:'same circle correction and public figure',layout:'figure, cards and controls inside viewport without overlap; axe passes'})
  await context.close()
 }
 const {context,page}=await setup(390,844)
 await button(page,'Tout désélectionner').click()
 for(const index of [0,1,2])await page.locator('.ci-question-list fieldset > label').nth(index).locator('input').check()
 await button(page,'Mode de jeu').click()
 await page.getByRole('spinbutton',{name:'Temps de réflexion (secondes)',exact:true}).fill('5')
 await button(page,'Régler le minuteur').click();await page.getByRole('spinbutton',{name:'Temps entre les questions (secondes)',exact:true}).fill('1');await button(page,'Fermer les réglages').click()
 await page.clock.install();await page.clock.pauseAt(new Date(Date.now()+1000))
 await page.locator('.ci-launch').click();await page.locator('.ci-answer:enabled').first().waitFor()
 await card(page,'carré').click();await page.locator('.ci-answer-correct').waitFor();await page.clock.runFor(1100)
 await page.locator('.ci-answer:enabled').first().waitFor();await card(page,'triangle').click();await page.locator('.ci-answer-incorrect').waitFor()
 assert.equal(await page.locator('.ci-answer-key .ci-answer-content').innerText(),'rectangle')
 await page.clock.runFor(1100);await page.locator('.ci-answer:enabled').first().waitFor();await page.clock.runFor(5100);await page.locator('.ci-reveal').waitFor()
 assert.equal(await page.locator('.ci-answer-key .ci-answer-content').innerText(),'cercle')
 assert.equal((await page.locator('.ci-correction-status').innerText()).trim(),'Temps écoulé')
 await page.clock.runFor(1100);await page.locator('.ci-summary').waitFor();assert.equal(await page.locator('.ci-summary-questions > p').count(),3)
 await context.close();results.push({solo:'correct square, incorrect rectangle and timeout on circle; automatic one-second progression'})
 const local=await setup(390,844)
 await button(local.page,'Tout désélectionner').click();await local.page.locator('.ci-question-list fieldset > label').first().locator('input').check()
 await local.page.getByRole('checkbox',{name:'Activer le minuteur',exact:true}).uncheck()
 await button(local.page,'Compétition').click();await button(local.page,'Préparer le défi local').click()
 await button(local.page,'Ajouter cette mascotte').click();await button(local.page,'Renard').click();await button(local.page,'Ajouter cette mascotte').click()
 await button(local.page,'Commencer la compétition').click();await button(local.page,'Je suis prêt').click();await local.page.locator('.ci-answer:enabled').first().waitFor();await local.context.setOffline(true)
 await card(local.page,'carré').click();await button(local.page,'Je suis prêt').click();await card(local.page,'triangle').click();await local.page.locator('.ci-answer-key').waitFor()
 assert.equal(await local.page.locator('.ci-answer-key .ci-answer-content').innerText(),'carré');await fits(local.page,390,844);await local.context.close()
 assert.deepEqual(recipe,original);assert.ok(methods.every(method=>method==='GET'));assert.deepEqual(errors,[])
 results.push({competition:'four shape-name cards, public bare figure, two fixed mascots, offline local turns and correction',sourceTemplate:'unchanged',serverWrites:0,errors})
 await writeFile('docs/interactive/recognition-results.json',JSON.stringify(results,null,2)+'\n');console.log(JSON.stringify(results,null,2))
} finally {await browser.close();await server.close()}
