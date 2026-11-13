import assert from 'node:assert/strict'
import {readFile,writeFile} from 'node:fs/promises'
import {createHash} from 'node:crypto'
import {createServer} from 'vite'
import {chromium} from 'playwright'
import AxeBuilder from '@axe-core/playwright'

const base='http://127.0.0.1:5182'
process.env.VITE_FICHES_API_URL=base+'/__test_api'
const server=await createServer({cacheDir:'/tmp/clairfle-printable-pairs-browser',server:{host:'127.0.0.1',port:5182,strictPort:true}})
await server.listen()
const {demoRecipe}=await server.ssrLoadModule('/src/interactive/demo.ts')
const {defaultPage}=await server.ssrLoadModule('/src/math/catalog.ts')
const {defaultThemeGameContent}=await server.ssrLoadModule('/src/jeux/bank.ts')
const {convertRecipe}=await server.ssrLoadModule('/src/interactive/domain/convert.ts')
const {buildPage}=await server.ssrLoadModule('/src/math/generate.ts')
const recipe={...demoRecipe(),libreMode:true,pages:['jeux-vocabulaire','jeux-memory'].map(type=>({...defaultPage('jeux'),...defaultThemeGameContent(type,'fruits'),domain:'jeux',topic:'jeux-fruits',exerciseType:type,count:1,columns:1,libreItems:undefined,extraBlocks:undefined}))}
// Freeze authored boards for UI assertions; generated relaunches are covered in the domain suite.
recipe.pages=recipe.pages.map((page,index)=>({...page,libreItems:buildPage(page,recipe.seed+index*7919).blocks[0].items}))
const original=structuredClone(recipe),game=convertRecipe(recipe)
assert.equal(game.questions.length,13)
const key=index=>{const q=game.questions[index];return q.choices.find(choice=>choice.id===game.corrections[q.id].choiceId).text}
const saved={id:'printable-pairs-source',name:'Paires image et mot',recipe,domains:['jeux'],createdAt:'2026-11-13T00:00:00Z',updatedAt:'2026-11-13T00:00:00Z'}
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH||undefined,args:['--no-sandbox']})
const results=[],errors=[],methods=[]
const button=(page,name)=>page.getByRole('button',{name,exact:true})
const card=(page,text)=>page.locator('.ci-answer').filter({has:page.getByText(text,{exact:true})})
async function setup(width,height){
 const context=await browser.newContext({viewport:{width,height}})
 await context.addCookies([{name:'clairfle-fiche-access',value:'admin',url:base}])
 await context.addInitScript(()=>localStorage.setItem('clairfle-fiche-sync','printable-pairs-fixture'))
 await context.route('**/__test_api/fiches',route=>{methods.push(route.request().method());return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({fiches:[saved]})})})
 const page=await context.newPage();page.setDefaultTimeout(30000);page.on('pageerror',e=>errors.push(e.message))
 await page.goto(base+'/interactif/'+saved.id);await page.locator('.ci-launch:enabled').waitFor({timeout:120000})
 return {context,page}
}
async function navigate(page,index){
 await page.getByRole('button',{name:/^Choisir une question ·/}).click()
 await page.getByRole('dialog',{name:'Choisir une question',exact:true}).locator('li button').nth(index).click()
}
async function picture(page,index){
 const image=page.locator('.ci-stimulus-images img:visible')
 await image.waitFor();await image.evaluate(node=>node.decode())
 const src=await image.getAttribute('src'),expected=game.questions[index].images[0]
 if(src.startsWith('blob:')){
  const bytes=await image.evaluate(async node=>Array.from(new Uint8Array(await (await fetch(node.src)).arrayBuffer())))
  const digest=bytes=>createHash('sha256').update(bytes).digest('hex')
  assert.equal(digest(Buffer.from(bytes)),digest(await readFile('public'+expected)),'Offline blobs preserve the exact source picture')
 }else assert.equal(new URL(src,base).pathname,expected)
 assert.ok(await image.evaluate(node=>node.naturalWidth>0))
}
async function reveal(page,index){
 for(const name of ['Signal : levez vos cartes','Discuter','Enseignant : révéler'])await button(page,name).click()
 assert.equal(await page.locator('.ci-answer-key .ci-answer-content').innerText(),key(index))
 assert.equal(await page.locator('.ci-answer-muted').count(),await page.locator('.ci-answer').count()-1)
 assert.equal(await page.locator('.ci-margin-answer,.ci-model-answer').count(),0)
}
async function fits(page,width,height){
 if(await page.locator('.ci-round-question').count())await page.waitForFunction(()=>document.querySelector('.ci-round-question')?.dataset.ciReadability!==undefined)
 await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))))
 const details=await page.locator('.ci-stimulus-images img:visible,.ci-answer:visible,.ci-controls:visible,.ci-competition-host-controls:visible').evaluateAll(nodes=>nodes.map(node=>({tag:node.tagName,...node.getBoundingClientRect().toJSON()})))
 if(details.some(box=>box.x< -1||box.y< -1||box.right>width+1||box.bottom>height+1)){
  await page.screenshot({path:'/tmp/clairfle-matching-overflow.png'})
  const measured=await page.locator('.ci-round-question,.ci-question,.ci-question-body,.ci-answer-grid,.ci-session,.ci-stage-visual,.ci-controls').evaluateAll(nodes=>nodes.map(node=>({class:node.className,data:{...node.dataset},style:getComputedStyle(node).cssText,rect:node.getBoundingClientRect().toJSON()})))
  await writeFile('/tmp/clairfle-matching-overflow.json',JSON.stringify(measured,null,2))
 }
 for(const box of details)assert.ok(box.x>=-1&&box.y>=-1&&box.right<=width+1&&box.bottom<=height+1,JSON.stringify(box))
 for(const [i,a] of details.entries())for(const b of details.slice(i+1))assert.ok(a.right<=b.x+1||b.right<=a.x+1||a.bottom<=b.y+1||b.bottom<=a.y+1,JSON.stringify({a,b}))
 const clipping=await page.locator('.ci-stimulus-images img:visible').evaluate(image=>{const a=image.getBoundingClientRect(),b=image.closest('.ci-question').getBoundingClientRect();return a.top<b.top-1||a.bottom>b.bottom+1})
 if(clipping)await page.screenshot({path:'/tmp/clairfle-pair-image-clipping.png'})
 assert.equal(clipping,false,'The complete source picture remains visible')
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false)
 assert.deepEqual((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()).violations,[])
}
async function zoomPicture(page){
 const thumbnail=await page.locator('.ci-stimulus-images > .ci-image-zoom img').boundingBox()
 const trigger=button(page,'Agrandir : Document 1');await trigger.click()
 const dialog=page.getByRole('dialog',{name:'Image agrandie : Document 1',exact:true});await dialog.waitFor()
 const expanded=await dialog.locator('img').boundingBox()
 assert.ok(expanded.height>thumbnail.height+40&&expanded.width>thumbnail.width+40,JSON.stringify({thumbnail,expanded}))
 await button(page,'Agrandir l’image').click()
 await page.waitForFunction(width=>document.querySelector('.ci-image-dialog[open] img').getBoundingClientRect().width>width*1.45,expanded.width)
 await page.keyboard.press('Escape');await dialog.waitFor({state:'hidden'})
 assert.equal(await trigger.evaluate(node=>node===document.activeElement),true)
 assert.equal(await page.locator('.ci-answer-key,.ci-chosen').count(),0)
}
try {
 for(const [width,height] of [[390,844],[1366,768],[360,640]]){
  if(process.env.PAIRS_VIEWPORT&&width!==Number(process.env.PAIRS_VIEWPORT))continue
  const {context,page}=await setup(width,height)
  assert.equal(await page.locator('.ci-question-list fieldset > label').count(),13)
  await page.getByRole('checkbox',{name:'Activer le minuteur',exact:true}).uncheck();await page.locator('.ci-launch').click();await page.locator('.ci-answer').first().waitFor()
  assert.equal(await page.locator('.ci-answer').count(),6);assert.equal(await page.locator('.ci-answer:enabled').count(),0)
  await picture(page,0);assert.equal(await page.locator('.ci-answer-key').count(),0);await fits(page,width,height);await zoomPicture(page);await reveal(page,0);await fits(page,width,height)
  await navigate(page,1);await picture(page,1)
  assert.equal(await page.locator('.ci-answer-used').count(),1);assert.equal(await card(page,key(0)).isDisabled(),true)
  const slots=await page.locator('.ci-answer-content').allTextContents()
  assert.match(await page.locator('.ci-matching-progress').innerText(),/Groupe 1\/2 · 5 mot/)
  await fits(page,width,height)
  await page.screenshot({path:`docs/interactive/screenshots/matching-used-${width}.png`})
  await reveal(page,1);await fits(page,width,height)
  await navigate(page,2);assert.equal(await page.locator('.ci-answer-used').count(),2)
  await navigate(page,1);assert.deepEqual(await page.locator('.ci-answer-content').allTextContents(),slots)
  await navigate(page,8);await picture(page,8);await reveal(page,8);await fits(page,width,height)
  await navigate(page,9);assert.equal(await page.locator('.ci-answer').count(),4);await picture(page,9);await reveal(page,9);await fits(page,width,height)
  await button(page,'Quitter la séance').click();await page.locator('.ci-launch:enabled').waitFor();await page.reload();await button(page,'Reprendre la séance').click();await page.locator('.ci-answer-key').waitFor()
  await picture(page,9);assert.equal(await page.locator('.ci-answer-key .ci-answer-content').innerText(),key(9));await fits(page,width,height)
  await navigate(page,2);assert.equal(await page.locator('.ci-answer-used').count(),2);await navigate(page,9)
  await page.screenshot({path:`docs/interactive/screenshots/printable-pairs-${width}.png`})
  results.push({viewport:`${width}x${height}`,class:'Nine vocabulary pairs split into groups of six and three; four memory-source pairs; already associated words disabled and grayed, other groups independent',resume:'Same source picture and verified word after reloading; card slots retained after navigation',layout:'Picture, cards, matching progress and controls visible before and after correction; image expands and zooms without selecting an answer, Escape restores focus; axe passes'})
  await context.close()
 }
 const {context,page}=await setup(390,844)
 await button(page,'Tout désélectionner').click();for(const index of [9,10,11])await page.locator('.ci-question-list fieldset > label').nth(index).locator('input').check()
 await button(page,'Mode de jeu').click();await page.getByRole('spinbutton',{name:'Temps de réflexion (secondes)',exact:true}).fill('5')
 await button(page,'Régler le minuteur').click();await page.getByRole('spinbutton',{name:'Temps entre les questions (secondes)',exact:true}).fill('1');await button(page,'Fermer les réglages').click()
 await page.clock.install();await page.clock.pauseAt(new Date(Date.now()+1000));await page.locator('.ci-launch').click();await page.locator('.ci-answer:enabled').first().waitFor()
 await card(page,key(9)).click();await page.locator('.ci-answer-correct').waitFor();await page.clock.runFor(1100)
 await page.locator('.ci-answer:enabled').first().waitFor();assert.equal(await page.locator('.ci-answer:enabled').count(),3);assert.equal(await card(page,key(9)).isDisabled(),true);await page.locator('.ci-answer:enabled').filter({hasNot:page.getByText(key(10),{exact:true})}).first().click();await page.locator('.ci-answer-incorrect').waitFor()
 assert.equal(await page.locator('.ci-answer-key .ci-answer-content').innerText(),key(10));await page.clock.runFor(1100);await page.locator('.ci-answer:enabled').first().waitFor();await page.clock.runFor(5100);await page.locator('.ci-reveal').waitFor()
 assert.equal(await page.locator('.ci-answer-key .ci-answer-content').innerText(),key(11));assert.equal((await page.locator('.ci-correction-status').innerText()).trim(),'Temps écoulé')
 await page.clock.runFor(1100);await page.locator('.ci-summary').waitFor();assert.equal(await page.locator('.ci-summary-questions > p').count(),3);assert.match(await page.locator('.ci-matching-summary').innerText(),/1 paire réussie sur 3/);await page.screenshot({path:'docs/interactive/screenshots/matching-solo-summary.png'});await context.close()
 results.push({solo:'Correct word, incorrect word and timeout; used words cannot be selected; one-second automatic progression and a 1/3 matching summary'})
 const local=await setup(390,844)
 await button(local.page,'Tout désélectionner').click();for(const index of [9,10])await local.page.locator('.ci-question-list fieldset > label').nth(index).locator('input').check();await local.page.getByRole('checkbox',{name:'Activer le minuteur',exact:true}).uncheck()
 await button(local.page,'Compétition').click();await button(local.page,'Préparer le défi local').click();await button(local.page,'Ajouter cette mascotte').click();await button(local.page,'Renard').click();await button(local.page,'Ajouter cette mascotte').click()
 await button(local.page,'Commencer la compétition').click();await button(local.page,'Je suis prêt').click();await local.page.locator('.ci-answer:enabled').first().waitFor();await picture(local.page,9);await local.context.setOffline(true)
 await card(local.page,key(9)).click();await button(local.page,'Je suis prêt').click();assert.equal(await card(local.page,key(9)).isEnabled(),true);assert.equal(await local.page.locator('.ci-answer-used').count(),0);await local.page.locator('.ci-answer:enabled').filter({hasNot:local.page.getByText(key(9),{exact:true})}).first().click();await local.page.locator('.ci-answer-key').waitFor()
 await picture(local.page,9);assert.equal(await local.page.locator('.ci-answer-key .ci-answer-content').innerText(),key(9));await fits(local.page,390,844)
 await button(local.page,'Question suivante').click();await button(local.page,'Je suis prêt').click();await local.page.locator('.ci-answer:enabled').first().waitFor();await picture(local.page,10)
 assert.equal(await card(local.page,key(9)).isDisabled(),true);assert.equal(await local.page.locator('.ci-answer-used').count(),1);assert.equal(await local.page.locator('.ci-answer:enabled').count(),3);await fits(local.page,390,844)
 await card(local.page,key(10)).click();await button(local.page,'Je suis prêt').click();assert.equal(await card(local.page,key(9)).isDisabled(),true);assert.equal(await card(local.page,key(10)).isEnabled(),true);await card(local.page,key(10)).click();await local.page.locator('.ci-answer-key').waitFor();await local.context.close()
 assert.deepEqual(recipe,original);assert.ok(methods.every(method=>method==='GET'));assert.deepEqual(errors,[])
 results.push({competition:'Two fixed mascots and two successive source pairs offline after media preparation; a previously corrected word is unavailable for both players, without revealing the current answer to the second player',sourceTemplate:'unchanged',serverWrites:0,errors})
 await writeFile('docs/interactive/printable-pairs-results.json',JSON.stringify(results,null,2)+'\n');console.log(JSON.stringify(results,null,2))
} finally {await browser.close();await server.close()}
