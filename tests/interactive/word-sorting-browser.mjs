import assert from 'node:assert/strict'
import {mkdir,writeFile} from 'node:fs/promises'
import {createServer} from 'vite'
import {chromium} from 'playwright'
import AxeBuilder from '@axe-core/playwright'
import {waitForBrowserValue} from './browser-actions.mjs'

const base='http://127.0.0.1:5182'
process.env.VITE_FICHES_API_URL=base+'/__test_api'
const vite=await createServer({cacheDir:'/tmp/clairfle-word-sorting-browser',server:{host:'127.0.0.1',port:5182,strictPort:true}});await vite.listen()
const {demoRecipe}=await vite.ssrLoadModule('/src/interactive/demo.ts')
const {defaultPage}=await vite.ssrLoadModule('/src/math/catalog.ts')
const {tagged}=await vite.ssrLoadModule('/src/francais/phrase-sentences.ts')
const {MODE_KEY}=await vite.ssrLoadModule('/src/interactive/legacy-preferences.ts')
const source=tokens=>({layout:'phrase-color',tokens,answer:tokens.map(token=>token.category).join(' · ')})
const items=[source(tagged('Il/pronom la/pronom regarde/verbe dans/preposition la/determinant cour/nom')),source(tagged('Ah,/interjection tu/pronom prends/verbe vraiment/adverbe le/determinant petit/adjectif train/nom vers/preposition la/determinant gare/nom et/conjonction tu/pronom souris/verbe'))]
const recipe={...demoRecipe(),seed:84,libreMode:true,pages:[{...defaultPage('gattegno'),topic:'phrase-simple',exerciseType:'phrase-simple-colorier',count:2,libreItems:items,extraBlocks:undefined},{...defaultPage('algèbre'),count:1,libreItems:[{layout:'inline',a:2,b:2,op:'+',missing:'result',answer:'4'}]}]},before=structuredClone(recipe)
const saved={id:'word-sorting',name:'Tri dans les colonnes',recipe,domains:['gattegno'],createdAt:'2026-11-14T00:00:00Z',updatedAt:'2026-11-14T00:00:00Z'}
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH||undefined,args:['--no-sandbox']})
const results=[],errors=[],methods=[];let activePage
const button=(page,name)=>page.getByRole('button',{name,exact:true}),word=(page,index)=>page.locator(`[data-ci-sort-word="${index}"]`)
const option=page=>page.getByRole('checkbox',{name:/^Trier les mots dans des colonnes/})
const bucket=(page,index)=>page.locator(`[data-ci-sort-destination="${index}"]`)
async function setup(width,height,mode='class',timed=false){
  const context=await browser.newContext({viewport:{width,height},hasTouch:width<=700})
  await context.addCookies([{name:'clairfle-fiche-access',value:'admin',url:base}])
  await context.addInitScript(({mode,timed,key})=>{localStorage.setItem('clairfle-fiche-sync','word-sorting-fixture-only');sessionStorage.setItem(key,mode);localStorage.setItem('clairfle.interactive.timer.v1',JSON.stringify({enabled:timed,seconds:5,feedbackSeconds:1}));localStorage.setItem('clairfle.interactive.toolbar-guard.v1',JSON.stringify('none'))},{mode,timed,key:MODE_KEY})
  await context.route('**/__test_api/fiches',route=>{methods.push(route.request().method());return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({fiches:[saved]})})})
  const page=await context.newPage();activePage=page;page.setDefaultTimeout(30000);page.on('pageerror',error=>errors.push(error.message))
  await page.goto(base+'/interactif/'+saved.id);await page.locator('.ci-launch:enabled').waitFor({timeout:120000});return {context,page}
}
async function placements(page){return page.locator('.ci-sort-word').evaluateAll(nodes=>nodes.map(node=>({source:Number(node.dataset.ciSortWord),target:Number(node.closest('[data-ci-sort-destination]').dataset.ciSortDestination)})).sort((a,b)=>a.source-b.source).map(row=>row.target))}
async function expectPlacements(page,expected){await page.waitForFunction(expected=>JSON.stringify([...document.querySelectorAll('.ci-sort-word')].map(node=>({source:Number(node.dataset.ciSortWord),target:Number(node.closest('[data-ci-sort-destination]').dataset.ciSortDestination)})).sort((a,b)=>a.source-b.source).map(row=>row.target))===JSON.stringify(expected),expected)}
async function tapPlace(page,index,label,touch){if(touch)await word(page,index).tap();else await word(page,index).click();await word(page,index).and(page.locator('[aria-pressed="true"]')).waitFor();const destination=button(page,`Déposer dans ${label}`);if(touch)await destination.tap();else await destination.click()}
async function navigate(page,index){await page.getByRole('button',{name:/^Choisir une question ·/}).click();await page.getByRole('dialog',{name:'Choisir une question',exact:true}).locator('li button').nth(index).click();await page.locator(index===2?'.ci-answer-grid':'.ci-word-sorting').waitFor()}
async function fit(page){await page.waitForFunction(()=>{const footer=document.querySelector('.ci-controls');return footer&&footer.getBoundingClientRect().bottom<=innerHeight+1&&document.documentElement.scrollWidth<=innerWidth});for(const control of await page.locator('.ci-sort-word,.ci-sort-destination,.ci-sort-tools .ci-icon-button').all()){const box=await control.boundingBox();assert.ok(box.width>=44&&box.height>=44)}}
async function axe(page){const report=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();assert.deepEqual(report.violations.map(v=>({id:v.id,nodes:v.nodes.map(node=>node.target)})),[])}
async function drag(page,index,target,touch,finish='drop'){
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))))
  await word(page,index).scrollIntoViewIfNeeded();const from=await word(page,index).boundingBox(),to=await bucket(page,target).locator('.ci-sort-destination').boundingBox();assert.ok(from&&to)
  const start={x:from.x+from.width/2,y:from.y+from.height/2},end={x:to.x+to.width/2,y:to.y+to.height/2},before=await placements(page),client=touch?await page.context().newCDPSession(page):null
  assert.equal(await page.evaluate(({x,y,target})=>Number(document.elementFromPoint(x,y)?.closest('[data-ci-sort-destination]')?.getAttribute('data-ci-sort-destination'))===target,{...end,target}),true,'The destination must be visible at the native pointer coordinates')
  try{
    if(touch)await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[start]});else{await page.mouse.move(start.x,start.y);await page.mouse.down()}
    for(let step=1;step<=8;step++){const point={x:start.x+(end.x-start.x)*step/8,y:start.y+(end.y-start.y)*step/8};if(touch)await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[point]});else await page.mouse.move(point.x,point.y)}
    await page.locator('.ci-order-ghost').waitFor();assert.equal(await bucket(page,target).evaluate(node=>node.classList.contains('ci-sort-target')),true);assert.deepEqual(await placements(page),before)
    if(finish==='outside'){if(touch)await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:1,y:1}]});else await page.mouse.move(1,1)}
    if(touch)await client.send('Input.dispatchTouchEvent',{type:finish==='cancel'?'touchCancel':'touchEnd',touchPoints:[]});else await page.mouse.up()
    await page.locator('.ci-order-ghost').waitFor({state:'detached'})
  }finally{await client?.detach()}
}
try{
  await mkdir('docs/interactive/screenshots',{recursive:true})
  for(const [width,height]of [[1366,900],[390,844],[360,640]].filter(([width])=>!process.env.WORD_SORTING_SOLO_ONLY&&(!process.env.WORD_SORTING_TEST_WIDTH||width===Number(process.env.WORD_SORTING_TEST_WIDTH)))){
    console.log(`Word sorting Class ${width}x${height}`)
    const {context,page}=await setup(width,height)
    assert.equal(await page.locator('.ci-question-list fieldset > label').count(),20)
    await button(page,'Tout désélectionner').click();await page.locator('.ci-question-list fieldset > label input').nth(1).check();await page.locator('.ci-question-list fieldset > label input').last().check()
    await option(page).check();await page.waitForFunction(()=>document.querySelectorAll('.ci-question-list fieldset > label').length===3)
    assert.deepEqual(await page.locator('.ci-question-list fieldset > label input').evaluateAll(nodes=>nodes.map(n=>n.checked)),[true,false,true])
    await option(page).uncheck();await page.waitForFunction(()=>document.querySelectorAll('.ci-question-list fieldset > label').length===20)
    assert.equal(await page.locator('.ci-question-list fieldset > label input:checked').count(),7)
    await option(page).check();await page.waitForFunction(()=>document.querySelectorAll('.ci-question-list fieldset > label').length===3);await button(page,'Tout sélectionner').click()
    await page.getByRole('textbox',{name:'Nom du préréglage',exact:true}).fill('Tri grammatical');await button(page,'Enregistrer le préréglage').click();await page.getByRole('status').filter({hasText:'Préréglage enregistré sur cet appareil.'}).waitFor()
    await option(page).uncheck();await button(page,'Charger le préréglage').click();await page.waitForFunction(()=>document.querySelectorAll('.ci-question-list fieldset > label').length===3);assert.equal(await option(page).isChecked(),true)
    await button(page,'Précharger toute la séance').click();await page.getByRole('status').filter({hasText:'Prêt à jouer sans connexion'}).waitFor({timeout:120000});await page.locator('.ci-launch').click();await page.locator('.ci-word-sorting').waitFor();await fit(page)
    assert.equal(await page.locator('.ci-sorting-sentence').innerText(),'Il la regarde dans la cour.');assert.equal(await page.locator('.ci-model-answer').count(),0);assert.ok(!(await page.locator('body').innerText()).includes('1. Il →'))
    if(width<=700){await button(page,'Plein écran').click();await page.locator('.ci-immersive').waitFor()}
    await context.setOffline(true)
    await drag(page,0,0,width<=700);await expectPlacements(page,[0,-1,-1,-1,-1,-1]);await button(page,'Annuler le classement').click();await expectPlacements(page,[-1,-1,-1,-1,-1,-1])
    await tapPlace(page,0,'Pronoms',width<=700);await expectPlacements(page,[0,-1,-1,-1,-1,-1]);await button(page,'Annuler le classement').click();await expectPlacements(page,[-1,-1,-1,-1,-1,-1])
    await word(page,0).focus();await page.keyboard.press('Enter');await button(page,'Déposer dans Pronoms').focus();await page.keyboard.press('Enter');await expectPlacements(page,[0,-1,-1,-1,-1,-1])
    await tapPlace(page,1,'Pronoms',width<=700);await tapPlace(page,2,'Verbes',width<=700);await tapPlace(page,3,'Prépositions',width<=700);await tapPlace(page,4,'Noms',width<=700)
    const proposed=[0,0,1,4,2,-1];await expectPlacements(page,proposed)
    await drag(page,5,0,width<=700,'outside');await expectPlacements(page,proposed)
    if(width<=700)await button(page,'Quitter le plein écran').click()
    await button(page,'Verrouiller les commandes').click();assert.equal(await page.locator('.ci-sort-word:enabled').count(),0);await button(page,'Déverrouiller les commandes').click();await expectPlacements(page,proposed)
    await navigate(page,2);await navigate(page,0);await expectPlacements(page,proposed)
    await navigate(page,1);assert.equal(await page.locator('.ci-sort-columns > section').count(),9);assert.equal(await page.locator('.ci-sort-word').count(),13)
    await button(page,'Lire la phrase et les catégories').click();const reader=page.getByRole('dialog',{name:'Question et document',exact:true});await reader.waitFor();for(const token of items[1].tokens)assert.ok((await reader.innerText()).includes(token.text));assert.ok(!(await reader.innerText()).includes('→'));await page.keyboard.press('Escape');await reader.waitFor({state:'detached'})
    await navigate(page,0);await expectPlacements(page,proposed);await fit(page);await axe(page)
    await context.setOffline(false);await button(page,'Quitter la séance').click();await page.locator('.ci-launch:enabled').waitFor();await page.reload();await page.locator('.ci-launch:enabled').waitFor({timeout:120000});assert.equal(await option(page).isChecked(),true);await page.locator('.ci-launch').click();await page.locator('.ci-word-sorting').waitFor();await expectPlacements(page,proposed)
    await page.locator('.ci-manual').evaluate(n=>n.scrollTop=0);await page.screenshot({path:`docs/interactive/screenshots/word-sorting-${width}.png`})
    await button(page,'Commencer l’échange').click();await button(page,'Discuter').click();await button(page,'Enseignant : révéler').click();await page.locator('.ci-sort-review').waitFor();assert.match(await page.locator('.ci-sort-review').innerText(),/4 \/ 6/)
    assert.ok((await page.locator('.ci-model-answer').innerText()).includes('5. la → Déterminants'));await button(page,'À retravailler').click();assert.equal(await button(page,'À retravailler').getAttribute('aria-pressed'),'true');await axe(page)
    if(width<=700)assert.ok(await button(page,'À retravailler').evaluate(n=>{const b=n.getBoundingClientRect(),p=n.closest('.ci-model-answer').getBoundingClientRect();return b.bottom<=Math.min(innerHeight,p.bottom)&&b.top>=p.top}),'Appreciation remains visible inside the correction panel')
    await page.getByText('Voir le classement proposé',{exact:true}).click();assert.ok((await page.locator('.ci-sort-review').innerText()).includes('5. la → Noms · À corriger'));await axe(page);await page.getByText('Voir le classement proposé',{exact:true}).click()
    await button(page,'Lire le classement').click();const modelReader=page.getByRole('dialog',{name:'Classement attendu',exact:true});await modelReader.waitFor();assert.ok((await modelReader.innerText()).includes('5. la → Déterminants'));await page.keyboard.press('Escape');await modelReader.waitFor({state:'detached'});assert.equal(await button(page,'Lire le classement').evaluate(n=>n===document.activeElement),true)
    await page.screenshot({path:`docs/interactive/screenshots/word-sorting-review-${width}.png`})
    await waitForBrowserValue(page,async()=>{const{requestLocal}=await import('/src/interactive/storage.ts');return(await requestLocal('sessions','readonly',store=>store.getAll())).some(record=>record.events.some(event=>event.action.type==='WORD_SORT_SET')&&record.events.some(event=>event.action.type==='ASSESS'))})
    results.push({class:`${width}x${height}`,preparation:'Optional whole-phrase columns preserve selected phrases and saved local presets; legacy word cards remain available.',source:'Repeated la retains separate pronoun and determiner targets; all thirteen elements and nine categories remain available in the longer phrase.',gestures:width<=700?'Native Chromium touch, tap then category, keyboard, undo and outside cancellation work offline.':'Native mouse, click then category, keyboard, undo and outside cancellation work offline.',resume:'Placements survive lock, question navigation, preparation and connected reload.',correction:'Expected tags are absent before reveal; partial 4/6 result and one missing element appear after deliberate reveal; human appreciation is saved.',axeViolations:0})
    await context.close()
  }
  if(!process.env.WORD_SORTING_TEST_WIDTH||process.env.WORD_SORTING_TEST_WIDTH==='390'){
    console.log('Word sorting Solo 390x844')
    const {context,page}=await setup(390,844,'solo',true);await option(page).check();await page.getByRole('spinbutton',{name:'Temps de réflexion (secondes)',exact:true}).fill('5');await page.locator('.ci-launch:enabled').waitFor();await page.clock.install();await page.clock.pauseAt(new Date(Date.now()+1000));await page.locator('.ci-launch').click();await page.locator('.ci-word-sorting').waitFor()
    await tapPlace(page,0,'Pronoms',true);assert.equal(await page.locator('.ci-model-answer').count(),0)
    await page.clock.runFor(5100);await page.locator('.ci-sort-review').waitFor();assert.match(await page.locator('.ci-sort-review').innerText(),/1 \/ 6/)
    assert.equal(await page.locator('.ci-answer-correct,.ci-answer-incorrect').count(),0);await button(page,'À retravailler').click();await page.clock.runFor(1100);await page.locator('.ci-progress').filter({hasText:'Question 2 / 3'}).waitFor()
    assert.equal(await page.locator('.ci-sort-word').count(),13);results.push({solo:'390x844',timer:'Partial placement remains private until timeout, then the model is shown and the next phrase starts automatically after the configured delay; no automatic correctness score.'});await context.close()
  }
  assert.deepEqual(recipe,before);assert.deepEqual(errors,[]);assert.ok(methods.every(method=>method==='GET'))
  await writeFile('docs/interactive/word-sorting-results.json',JSON.stringify({results,errors,apiMethods:methods,liveApiWrites:0,sourceRecipe:'unchanged',scope:'M08 optional guided whole-phrase sorting, not scored room competition'},null,2)+'\n');console.log(JSON.stringify(results,null,2))
}catch(error){if(activePage&&!activePage.isClosed()){console.error((await activePage.locator('body').innerText()).slice(-2200));await activePage.screenshot({path:'/tmp/clairfle-word-sorting-failure.png',fullPage:true})}throw error}
finally{await browser.close();await vite.close()}
