import assert from 'node:assert/strict'
import {readFile,mkdir,writeFile} from 'node:fs/promises'
import {createServer} from 'vite'
import {chromium} from 'playwright'
import AxeBuilder from '@axe-core/playwright'
import {waitForBrowserValue} from './browser-actions.mjs'

const base='http://127.0.0.1:5182';process.env.VITE_FICHES_API_URL=base+'/__test_api'
const vite=await createServer({cacheDir:'/tmp/clairfle-word-drop-browser',server:{host:'127.0.0.1',port:5182,strictPort:true}});await vite.listen()
const {demoRecipe}=await vite.ssrLoadModule('/src/interactive/demo.ts')
const {defaultPage}=await vite.ssrLoadModule('/src/math/catalog.ts')
const {createGrammarQuestion}=await vite.ssrLoadModule('/src/grammaire/curriculum/questions.ts')
const {grammarItems}=await vite.ssrLoadModule('/src/grammaire/curriculum/items.ts')
const {MODE_KEY}=await vite.ssrLoadModule('/src/interactive/legacy-preferences.ts')
const banks=JSON.parse(await readFile('src/grammaire/curriculum/data/er.json','utf8')),bank=banks.find(bank=>bank.activityId==='gram-ex-er-qcm-conj'&&bank.level==='A1'),unit=bank.units[0]
const right=unit.answers[0],wrong=unit.options.find(option=>option.text!==right).text,item=grammarItems({questions:[createGrammarQuestion(unit,'choice',14)]})[0]
const syllables={layout:'vocab-match',labels:['ma','vo'],options:['ison','iture','ble','me','l','son'],vocabMatchMode:'syllables',vocabPairs:[{left:'ma',right:'ison'},{left:'vo',right:'iture'}],answer:'ma + ison → maison · vo + iture → voiture'}
const recipe={...demoRecipe(),libreMode:true,seed:14,pages:[{...defaultPage('grammaire'),count:1,extraBlocks:undefined,libreItems:[item]},{...defaultPage('soutien-fr'),count:1,extraBlocks:undefined,libreItems:[syllables]},{...defaultPage('algèbre'),count:1,extraBlocks:undefined,libreItems:[{layout:'inline',a:2,b:2,op:'+',missing:'result',answer:'4'}]}]},before=structuredClone(recipe)
const saved={id:'word-drop',name:'Phrases et syllabes à compléter',recipe,domains:['grammaire','soutien-fr'],createdAt:'2026-11-15T00:00:00Z',updatedAt:'2026-11-15T00:00:00Z'}
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH||undefined,args:['--no-sandbox']})
const results=[],errors=[],methods=[];let activePage
const button=(page,name)=>page.getByRole('button',{name,exact:true}),blank=page=>page.locator('.ci-word-blank'),value=page=>blank(page).locator('> span').first().innerText()
const card=(page,text)=>page.locator('.ci-answer').filter({has:page.locator('.ci-answer-content').getByText(text,{exact:true})})
async function setup(width,height,mode='class',timed=false){
  const context=await browser.newContext({viewport:{width,height},hasTouch:width<=700});await context.addCookies([{name:'clairfle-fiche-access',value:'admin',url:base}])
  await context.addInitScript(({key,mode,timed})=>{sessionStorage.setItem(key,mode);localStorage.setItem('clairfle-fiche-sync','word-drop-fixture-only');localStorage.setItem('clairfle.interactive.timer.v1',JSON.stringify({enabled:timed,seconds:5,feedbackSeconds:1}));localStorage.setItem('clairfle.interactive.toolbar-guard.v1',JSON.stringify('none'))},{key:MODE_KEY,mode,timed})
  await context.route('**/__test_api/fiches',route=>{methods.push(route.request().method());return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({fiches:[saved]})})})
  const page=await context.newPage();activePage=page;page.setDefaultTimeout(30000);page.on('pageerror',error=>errors.push(error.message));await page.goto(base+'/interactif/'+saved.id);await page.locator('.ci-launch:enabled').waitFor({timeout:120000})
  const timer=page.getByRole('checkbox',{name:'Activer le minuteur',exact:true});if(timed)await timer.check();else await timer.uncheck()
  if(timed)await page.getByRole('spinbutton',{name:'Temps de réflexion (secondes)',exact:true}).fill('5')
  if(mode==='solo'){await button(page,'Régler le minuteur').click();await page.getByRole('spinbutton',{name:'Temps entre les questions (secondes)',exact:true}).fill('1');await button(page,'Fermer les réglages').click()}
  return {context,page}
}
async function preload(page){await button(page,'Précharger toute la séance').click();await page.getByRole('status').filter({hasText:'Prêt à jouer sans connexion'}).waitFor({timeout:120000})}
async function fit(page){await page.waitForFunction(()=>{const footer=document.querySelector('.ci-controls');return footer&&footer.getBoundingClientRect().bottom<=innerHeight+1&&document.documentElement.scrollWidth<=innerWidth});const bounds=await blank(page).boundingBox();assert.ok(bounds.width>=44&&bounds.height>=44)}
async function axe(page){const report=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();assert.deepEqual(report.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[])}
async function navigate(page,index){await page.getByRole('button',{name:/^Choisir une question ·/}).click();await page.getByRole('dialog',{name:'Choisir une question',exact:true}).locator('li button').nth(index).click();await page.waitForFunction(index=>document.querySelector('.ci-progress')?.textContent.includes(`Question ${index+1} /`),index)}
async function reveal(page){await page.getByRole('button',{name:/^Signal :/}).click();await button(page,'Discuter').click();await button(page,'Enseignant : révéler').click();await page.locator('.ci-answer-key').waitFor()}
async function drag(page,text,{touch=false,finish='drop'}={}){
  const source=card(page,text);await source.click({trial:true});const a=await source.boundingBox(),b=await blank(page).boundingBox();assert.ok(a&&b)
  const start={x:a.x+a.width/2,y:a.y+a.height/2},end={x:b.x+b.width/2,y:b.y+b.height/2},previous=await value(page),client=touch?await page.context().newCDPSession(page):null
  assert.equal(await source.evaluate((node,{x,y})=>node.contains(document.elementFromPoint(x,y)),start),true,'The source must be stable and visible at the native pointer coordinates')
  assert.equal(await source.locator('.ci-answer-content').evaluate(node=>getComputedStyle(node).touchAction),'none','Fitted text must retain native drag gestures inside its overflow boundary')
  try{
    if(touch)await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[start]});else{await page.mouse.move(start.x,start.y);await page.mouse.down()}
    for(let step=1;step<=8;step++){const point={x:start.x+(end.x-start.x)*step/8,y:start.y+(end.y-start.y)*step/8};if(touch)await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[point]});else await page.mouse.move(point.x,point.y)}
    await page.locator('.ci-order-ghost').waitFor();await page.locator('.ci-word-blank-hover').waitFor();assert.equal(await page.locator('.ci-word-blank-preview').innerText(),text);assert.equal(await value(page),previous,'Hover must not commit a proposal')
    if(finish==='outside'){if(touch)await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:1,y:1}]});else await page.mouse.move(1,1)}
    if(finish==='escape')await page.keyboard.press('Escape')
    if(touch)await client.send('Input.dispatchTouchEvent',{type:finish==='cancel'?'touchCancel':'touchEnd',touchPoints:[]});else await page.mouse.up()
    await page.locator('.ci-order-ghost').waitFor({state:'detached'})
  }finally{await client?.detach()}
}
try{
  await mkdir('docs/interactive/screenshots',{recursive:true})
  for(const [width,height]of [[1366,900],[390,844],[360,640]].filter(([width])=>!process.env.WORD_DROP_SOLO_ONLY&&(!process.env.WORD_DROP_TEST_WIDTH||width===Number(process.env.WORD_DROP_TEST_WIDTH)))){
    console.log(`Word drop Class ${width}x${height}`)
    const {context,page}=await setup(width,height);await preload(page);await page.locator('.ci-launch').click();await blank(page).waitFor();await fit(page);assert.equal(await value(page),'…');assert.equal(await page.locator('.ci-answer:enabled').count(),3)
    await context.setOffline(true)
    await drag(page,wrong,{touch:width<=700});await blank(page).filter({hasText:wrong}).waitFor();assert.equal(await page.locator('.ci-reveal,.ci-answer-key').count(),0)
    await blank(page).click();assert.equal(await value(page),'…')
    await drag(page,wrong,{touch:width<=700,finish:'outside'});assert.equal(await value(page),'…');assert.equal(await page.locator('.ci-word-drop-pending').count(),0)
    await drag(page,wrong,{touch:width<=700,finish:'escape'});assert.equal(await value(page),'…')
    if(width<=700){await drag(page,wrong,{touch:true,finish:'cancel'});assert.equal(await value(page),'…')}
    if(width<=700)await card(page,right).tap();else await card(page,right).click();await card(page,right).and(page.locator('[aria-pressed="true"]')).waitFor();assert.equal(await value(page),'…');if(width<=700)await blank(page).tap();else await blank(page).click();assert.equal(await value(page),right)
    await blank(page).click();await card(page,wrong).focus();await page.keyboard.press('Enter');await blank(page).focus();await page.keyboard.press('Enter');assert.equal(await value(page),wrong)
    await button(page,'Verrouiller les commandes').click();assert.equal(await blank(page).isDisabled(),true);assert.equal(await page.locator('.ci-answer:enabled').count(),0);await button(page,'Déverrouiller les commandes').click();assert.equal(await value(page),wrong)
    await navigate(page,1);await blank(page).waitFor();assert.equal(await page.locator('.ci-answer').count(),6);await drag(page,'iture',{touch:width<=700});assert.equal(await value(page),'iture')
    await navigate(page,3);assert.equal(await blank(page).count(),0);assert.equal(await page.locator('.ci-answer:enabled').count(),0)
    await navigate(page,0);assert.equal(await value(page),wrong);await fit(page);await axe(page)
    await context.setOffline(false);await button(page,'Quitter la séance').click();await page.locator('.ci-launch:enabled').waitFor();await page.reload();await page.locator('.ci-launch:enabled').waitFor({timeout:120000});await page.locator('.ci-launch').click();await blank(page).waitFor();assert.equal(await value(page),wrong)
    await page.screenshot({path:`docs/interactive/screenshots/word-drop-${width}.png`})
    await reveal(page);assert.equal(await card(page,right).evaluate(node=>node.classList.contains('ci-answer-key')),true);assert.equal(await page.locator('.ci-answer-muted').count(),2);assert.equal(await value(page),wrong);assert.equal(await page.locator('.ci-round-question .ci-model-answer,.ci-margin-answer').count(),0);await axe(page)
    await page.screenshot({path:`docs/interactive/screenshots/word-drop-review-${width}.png`})
    await page.getByRole('button',{name:/^Choisir une question ·/}).click();await button(page,'Réessayer cette question').click();await button(page,'Nouvelle tentative').click();await blank(page).waitFor();assert.equal(await value(page),'…');assert.equal(await page.locator('.ci-word-drop-pending').count(),0)
    await navigate(page,1);assert.equal(await value(page),'iture');await reveal(page);assert.equal(await card(page,'ison').evaluate(node=>node.classList.contains('ci-answer-key')),true);assert.equal(await page.locator('.ci-answer-muted').count(),5)
    await waitForBrowserValue(page,async()=>{const{requestLocal}=await import('/src/interactive/storage.ts');return(await requestLocal('sessions','readonly',store=>store.getAll())).some(record=>record.events.some(event=>event.action.type==='WORD_DROP_SET')&&record.events.some(event=>event.action.type==='RETRY_QUESTION'))})
    results.push({class:`${width}x${height}`,source:'Real curriculum completion and verified source syllable pairs; phrase hints and six source choices preserved.',gestures:width<=700?'Native Chromium touch, two taps, keyboard, removal, Escape, touch interruption and outside cancellation.':'Native mouse, click then blank, keyboard, removal, Escape and outside cancellation.',privacy:'Drop preview stays ungraded; only deliberate teacher reveal identifies the source answer; ordinary Class cards stay passive.',resume:'Independent proposals survive lock, navigation and connected reload; retry clears both proposal and pending local choice.',correction:'Only correct response card remains coloured, with two or five grey alternatives and no duplicate answer below the cards.',offline:'Prepared open page remains manipulable without network.',axeViolations:0});await context.close()
  }
  if(!process.env.WORD_DROP_TEST_WIDTH||process.env.WORD_DROP_TEST_WIDTH==='390'){
    console.log('Word drop Solo 390x844')
    const {context,page}=await setup(390,844,'solo');await page.clock.install();await page.clock.pauseAt(new Date(Date.now()+1000));await page.locator('.ci-launch').click();await blank(page).waitFor()
    await drag(page,right,{touch:true});await page.locator('.ci-answer-key').waitFor();assert.equal(await card(page,right).evaluate(node=>node.classList.contains('ci-answer-key')),true);assert.equal(await page.locator('.ci-confetti > i').count(),24)
    await page.clock.runFor(1100);await page.locator('.ci-progress').filter({hasText:'Question 2 / 4'}).waitFor();await drag(page,'iture',{touch:true});await page.locator('.ci-answer-key').waitFor();assert.equal(await card(page,'ison').evaluate(node=>node.classList.contains('ci-answer-key')),true);assert.equal(await page.locator('.ci-tears > i').count(),4)
    await page.clock.runFor(1100);await page.locator('.ci-progress').filter({hasText:'Question 3 / 4'}).waitFor();await drag(page,'iture',{touch:true,finish:'outside'});assert.equal(await page.locator('.ci-reveal').count(),0);await card(page,'iture').tap();await page.locator('.ci-answer-key').waitFor()
    await page.clock.runFor(1100);await page.locator('.ci-progress').filter({hasText:'Question 4 / 4'}).waitFor();assert.equal(await blank(page).count(),0);await card(page,'4').tap();await page.clock.runFor(1100);await page.locator('.ci-summary').waitFor()
    results.push({solo:'390x844',grading:'Correct drag, wrong drag and direct touch retain automatic grading, confetti or tears and one-second transitions; outside release never submits.',compatibility:'The final ordinary arithmetic question retains direct card selection.'});await context.close()
    const timed=await setup(390,844,'solo',true);await timed.page.clock.install();await timed.page.clock.pauseAt(new Date(Date.now()+1000));await timed.page.locator('.ci-launch').click();await blank(timed.page).waitFor();await timed.page.clock.runFor(5100);await timed.page.locator('.ci-answer-key').waitFor();assert.match(await timed.page.locator('.ci-correction-status').innerText(),/Temps écoulé/);assert.equal(await value(timed.page),'…');await timed.page.clock.runFor(1100);await timed.page.locator('.ci-progress').filter({hasText:'Question 2 / 4'}).waitFor();await card(timed.page,'ison').tap();await timed.page.locator('.ci-answer-key').waitFor()
    results.push({timedSolo:'390x844',timer:'No response times out as false and advances automatically; a touch during the next timer still answers immediately.'});await timed.context.close()
  }
  assert.deepEqual(recipe,before);assert.deepEqual(errors,[]);assert.ok(methods.every(method=>method==='GET'))
  await writeFile('docs/interactive/word-drop-results.json',JSON.stringify({results,errors,apiMethods:methods,liveApiWrites:0,sourceRecipe:'unchanged',scope:'M05 explicit source word gaps in Classe and Solo; no automatic gap inferred in an ordinary QCM.'},null,2)+'\n');console.log(JSON.stringify(results,null,2))
}catch(error){if(activePage&&!activePage.isClosed()){console.error((await activePage.locator('body').innerText()).slice(-2200));await activePage.screenshot({path:'/tmp/clairfle-word-drop-failure.png',fullPage:true})}throw error}
finally{await browser.close();await vite.close()}
