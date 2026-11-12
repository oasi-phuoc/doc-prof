import assert from 'node:assert/strict'
import {readFile,writeFile} from 'node:fs/promises'
import {createServer} from 'vite'
import {chromium} from 'playwright'
import AxeBuilder from '@axe-core/playwright'

const base='http://127.0.0.1:5182'
process.env.VITE_FICHES_API_URL=base+'/__test_api'
const server=await createServer({cacheDir:'/tmp/clairfle-place-value-browser',server:{host:'127.0.0.1',port:5182,strictPort:true}})
await server.listen()
const recipe=JSON.parse(await readFile('docs/interactive/demo-source-recipe.json','utf8'))
const item={layout:'place-value',prompt:'4 070',labels:['milliers','centaines','dizaines','unités'],placeParts:['4000','0','70','0'],answer:'4000 + 0 + 70 + 0'}
recipe.pages=[{...recipe.pages[0],domain:'tcm-csc',topic:'tcm-csc-test',exerciseType:'tcm-csc-ex08',count:2,libreItems:[item,{...item,answer:'4000 + 70 + 0 + 0'}],extraBlocks:[{exerciseType:'tcm-csc-ex09',topic:'tcm-csc-test',count:3,columns:1,libreItems:[['+','plus'],['−','moins'],['=','égal']].map(([symbol,answer])=>({layout:'inline',prompt:symbol,answer,cscTask:{kind:'sign-name',symbol}}))}]}]
const original=structuredClone(recipe)
const saved={id:'place-value-source',name:'Décomposition et signes CSC',domains:['tcm-csc'],recipe,createdAt:'2026-11-12T00:00:00Z',updatedAt:'2026-11-12T00:00:00Z'}
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH||undefined,args:['--no-sandbox']})
const results=[],errors=[],methods=[]
const button=(page,name)=>page.getByRole('button',{name,exact:true})
const numberText=value=>value.replace(/[\s'’]/g,'')
const card=(page,value)=>page.locator('.ci-answer').filter({has:page.getByText(value,{exact:true})})
const equals='Comment se lit le signe « = » ?'
async function setup(width,height) {
 const context=await browser.newContext({viewport:{width,height}})
 await context.addCookies([{name:'clairfle-fiche-access',value:'admin',url:base}])
 await context.addInitScript(()=>localStorage.setItem('clairfle-fiche-sync','place-value-fixture-only'))
 await context.route('**/__test_api/fiches',route=>{methods.push(route.request().method());return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({fiches:[saved]})})})
 const page=await context.newPage();page.setDefaultTimeout(30000);page.on('pageerror',error=>errors.push(error.message))
 await page.goto(base+'/interactif/'+saved.id);await page.locator('.ci-launch:enabled').waitFor({timeout:120000})
 return {context,page}
}
async function navigate(page,text) {
 await page.getByRole('button',{name:/^Choisir une question ·/}).click()
 await page.getByRole('dialog',{name:'Choisir une question',exact:true}).locator('li button').filter({hasText:text}).click()
 await page.waitForFunction(()=>document.querySelector('.ci-round-question')?.dataset.ciReadability!==undefined)
}
async function reveal(page,expected) {
 for(const name of ['Signal : levez vos cartes','Discuter','Enseignant : révéler']) await button(page,name).click()
 assert.equal(numberText(await page.locator('.ci-answer-key .ci-answer-content').innerText()),expected)
 assert.equal(await page.locator('.ci-answer-muted').count(),await page.locator('.ci-answer').count()-1)
 assert.equal(await page.locator('.ci-margin-answer,.ci-model-answer').count(),0)
}
async function fits(page,width,height) {
 const rects=await page.locator('.ci-controls:visible,.ci-answer:visible').evaluateAll(nodes=>nodes.map(node=>({x:node.getBoundingClientRect().x,y:node.getBoundingClientRect().y,right:node.getBoundingClientRect().right,bottom:node.getBoundingClientRect().bottom})))
 for(const rect of rects) assert.ok(rect.x>=-1&&rect.y>=-1&&rect.right<=width+1&&rect.bottom<=height+1,JSON.stringify(rect))
 for(const [index,rect] of rects.entries()) for(const other of rects.slice(index+1)) assert.ok(rect.right<=other.x+1||other.right<=rect.x+1||rect.bottom<=other.y+1||other.bottom<=rect.y+1,'Cards and controls must not overlap')
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false)
 const scan=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()
 assert.deepEqual(scan.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})),[])
}
try {
 for(const [width,height] of [[390,844],[1366,768],[360,640]]) {
  const {context,page}=await setup(width,height)
  assert.equal(await page.locator('.ci-question-list fieldset > label').count(),7)
  await page.getByText(/termes de la décomposition ne correspondent plus/).waitFor({state:'attached'})
  await page.getByRole('checkbox',{name:'Activer le minuteur',exact:true}).uncheck()
  await page.locator('.ci-launch').click();await page.locator('.ci-answer').first().waitFor()
  assert.match(await page.locator('.ci-question-prompt').innerText(),/milliers/)
  assert.equal(await page.locator('.ci-answer:enabled').count(),0)
  await reveal(page,'4000');await fits(page,width,height)
  await navigate(page,'centaines');await reveal(page,'0')
  await button(page,'Quitter la séance').click();await page.locator('.ci-launch:enabled').waitFor()
  await page.reload();await button(page,'Reprendre la séance').click();await page.locator('.ci-answer-key').waitFor()
  assert.equal(await page.locator('.ci-answer-key .ci-answer-content').innerText(),'0')
  assert.match(await page.locator('.ci-question-prompt').innerText(),/centaines/)
  await navigate(page,equals)
  assert.deepEqual((await page.locator('.ci-answer-content').allTextContents()).sort(),['plus','moins','égal'].sort())
  await reveal(page,'égal');await fits(page,width,height)
  if(width!==360) await page.screenshot({path:`docs/interactive/screenshots/place-value-${width}.png`})
  results.push({viewport:`${width}x${height}`,class:'four exact place values including zero, three sign names; collective correction and six numeric cards',resume:'same zero-place correction',layout:'every card and control inside viewport without overlap; axe passes'})
  await context.close()
 }
 const {context,page}=await setup(390,844)
 await button(page,'Tout désélectionner').click()
 for(const prompt of ['centaines','dizaines',equals]) await page.locator('.ci-question-list fieldset > label').filter({hasText:prompt}).locator('input').check()
 await page.getByRole('checkbox',{name:'Ranger les nombres par ordre croissant',exact:true}).check()
 await button(page,'Mode de jeu').click()
 await page.getByRole('spinbutton',{name:'Temps de réflexion (secondes)',exact:true}).fill('5')
 await button(page,'Régler le minuteur').click();await page.getByRole('spinbutton',{name:'Temps entre les questions (secondes)',exact:true}).fill('1');await button(page,'Fermer les réglages').click()
 await page.clock.install();await page.clock.pauseAt(new Date(Date.now()+1000))
 await page.locator('.ci-launch').click();await page.locator('.ci-answer:enabled').first().waitFor()
 const values=(await page.locator('.ci-answer-content').allTextContents()).map(text=>Number(numberText(text)))
 assert.deepEqual(values,[...values].sort((a,b)=>a-b))
 await card(page,'0').click();await page.locator('.ci-answer-correct').waitFor();await page.clock.runFor(1100)
 await page.locator('.ci-question-prompt').filter({hasText:'dizaines'}).waitFor()
 await page.locator('.ci-answer').filter({hasNot:page.getByText('70',{exact:true})}).first().click()
 await page.locator('.ci-answer-incorrect').waitFor();await page.clock.runFor(1100)
 await page.locator('.ci-question-prompt').filter({hasText:equals}).waitFor()
 await page.clock.runFor(5100);await page.locator('.ci-reveal').waitFor()
 assert.equal(await page.locator('.ci-answer-key .ci-answer-content').innerText(),'égal')
 assert.equal((await page.locator('.ci-correction-status').innerText()).trim(),'Temps écoulé')
 await page.clock.runFor(1100);await page.locator('.ci-summary').waitFor()
 assert.equal(await page.locator('.ci-summary-questions > p').count(),3)
 await context.close()
 results.push({solo:'correct zero, incorrect tens value and timeout on sign name; automatic one-second progression; numeric sorting'})
 const local=await setup(390,844)
 await button(local.page,'Tout désélectionner').click()
 await local.page.locator('.ci-question-list fieldset > label').filter({hasText:equals}).locator('input').check()
 await local.page.getByRole('checkbox',{name:'Activer le minuteur',exact:true}).uncheck()
 await button(local.page,'Compétition').click();await button(local.page,'Préparer le défi local').click()
 await button(local.page,'Ajouter cette mascotte').click();await button(local.page,'Renard').click();await button(local.page,'Ajouter cette mascotte').click()
 await button(local.page,'Commencer la compétition').click();await button(local.page,'Je suis prêt').click()
 await local.page.locator('.ci-answer:enabled').first().waitFor();await local.context.setOffline(true)
 await card(local.page,'égal').click();await button(local.page,'Je suis prêt').click();await card(local.page,'plus').click()
 await local.page.locator('.ci-answer-key').waitFor();assert.equal(await local.page.locator('.ci-answer-key .ci-answer-content').innerText(),'égal')
 await fits(local.page,390,844);await local.context.close()
 assert.deepEqual(recipe,original);assert.ok(methods.every(method=>method==='GET'));assert.deepEqual(errors,[])
 results.push({competition:'three sign-name cards, two fixed mascots, offline local turns and correction',sourceTemplate:'unchanged',serverWrites:0,errors})
 await writeFile('docs/interactive/place-value-results.json',JSON.stringify(results,null,2)+'\n')
 console.log(JSON.stringify(results,null,2))
} finally {await browser.close();await server.close()}
