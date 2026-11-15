import assert from 'node:assert/strict'
import {mkdir,writeFile} from 'node:fs/promises'
import {createServer} from 'vite'
import {chromium} from 'playwright'
import AxeBuilder from '@axe-core/playwright'
import {gameControl,waitForBrowserValue} from './browser-actions.mjs'
const base='http://127.0.0.1:5182',out='docs/interactive/memory-proofs'
process.env.VITE_FICHES_API_URL=base+'/__test_api'
const vite=await createServer({cacheDir:'/tmp/clairfle-memory-browser',server:{host:'127.0.0.1',port:5182,strictPort:true,hmr:false}});await vite.listen()
const {demoRecipe}=await vite.ssrLoadModule('/src/interactive/demo.ts'),{defaultPage}=await vite.ssrLoadModule('/src/math/catalog.ts'),{defaultThemeGameContent}=await vite.ssrLoadModule('/src/jeux/bank.ts'),{buildPage}=await vite.ssrLoadModule('/src/math/generate.ts')
const {convertRecipe}=await vite.ssrLoadModule('/src/interactive/domain/convert.ts'),{applyPlanOptions}=await vite.ssrLoadModule('/src/interactive/domain/plan-options.ts')
const {parseFicheRecipe}=await vite.ssrLoadModule('/src/fiches/recipe.ts')
let recipe={...demoRecipe(),libreMode:true,pages:['jeux-vocabulaire','jeux-memory'].map(type=>({...defaultPage('jeux'),...defaultThemeGameContent(type,'fruits'),domain:'jeux',topic:'jeux-fruits',exerciseType:type,count:1,columns:1,extraBlocks:undefined,libreItems:undefined}))}
recipe.pages=recipe.pages.map((page,index)=>({...page,libreItems:buildPage(page,recipe.seed+index*7919).blocks[0].items}))
recipe=parseFicheRecipe(recipe)
const original=structuredClone(recipe),saved={id:'memory-fixture',name:'Mémory des fruits',domains:['jeux'],recipe,createdAt:'2026-11-15T00:00:00Z',updatedAt:'2026-11-15T00:00:00Z'}
let game,q,pairs,wrong
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH||undefined,args:['--no-sandbox']}),errors=[],methods=[],results=[]
const button=(page,name)=>gameControl(page,name),card=(page,id)=>page.locator(`.ci-memory-card[data-memory-id="${id}"]`)
async function setup(width,height,mode='class',timer=false){
 const context=await browser.newContext({viewport:{width,height},hasTouch:width<=700});await context.addCookies([{name:'clairfle-fiche-access',value:'admin',url:base}])
 await context.addInitScript(({mode,timer})=>{localStorage.setItem('clairfle-fiche-sync','memory-fixture-only');sessionStorage.setItem('clairfle.interactive.mode.v1',mode);localStorage.setItem('clairfle.interactive.timer.v1',JSON.stringify({enabled:timer,seconds:5,feedbackSeconds:2}))},{mode,timer})
 await context.route('**/__test_api/fiches',route=>{methods.push(route.request().method());return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({fiches:[saved]})})})
 const page=await context.newPage();page.setDefaultTimeout(30000);page.on('pageerror',e=>errors.push(e.message));await page.goto(base+'/interactif/'+saved.id);await page.locator('.ci-launch:enabled').waitFor({timeout:120000})
 assert.equal(await page.locator('.ci-question-list fieldset > label').count(),13)
 await page.getByRole('checkbox',{name:'Mémory : cartes retournées'}).check();await page.waitForFunction(()=>document.querySelectorAll('.ci-question-list fieldset > label').length===5)
 await button(page,'Précharger toute la séance').click();await page.getByRole('status').filter({hasText:'Prêt à jouer sans connexion'}).waitFor();if(timer)await page.clock.install();await context.setOffline(true);await page.locator('.ci-launch').click();await page.locator('.ci-memory-card').first().waitFor()
 const record=await waitForBrowserValue(page,async()=>{const{requestLocal}=await import('/src/interactive/storage.ts');return(await requestLocal('sessions','readonly',s=>s.getAll())).find(r=>r.source?.options?.memory)??null})
 game=applyPlanOptions(convertRecipe({...recipe,seed:record.source.seed},saved.name),record.source.options);q=game.questions[0];pairs=game.corrections[q.id].memoryPairs;wrong=[pairs[0][0],pairs[1][0]]
 assert.deepEqual(await page.locator('.ci-memory-card').evaluateAll(nodes=>nodes.map(n=>n.dataset.memoryId)),q.memoryBoard.cards.map(c=>c.id));console.log('Prepared actual seed',record.source.seed)
 return{page,context}
}
async function fit(page,frozen=false){
 await page.waitForFunction(()=>document.querySelector('.ci-round-question')?.dataset.ciReadability!==undefined);if(!frozen)await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))))
 const vp=page.viewportSize(),boxes=await page.locator('.ci-memory-card:visible,.ci-memory-actions button:visible,.ci-controls:visible').evaluateAll(nodes=>nodes.map(n=>({class:n.className,...n.getBoundingClientRect().toJSON()})))
 for(const box of boxes)assert.ok(box.x>=-1&&box.y>=-1&&box.right<=vp.width+1&&box.bottom<=vp.height+1&&box.height>=44,JSON.stringify({vp,box}))
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false)
 if(!frozen){const violations=(await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()).violations
 assert.deepEqual(violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})),[])}
}
async function choose(page,id,touch=false){const target=card(page,id);if(touch){const box=await target.boundingBox(),client=await page.context().newCDPSession(page);try{await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:box.x+box.width/2,y:box.y+box.height/2}]});await client.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]})}finally{await client.detach()}}else await target.click()}
async function navigate(page,index){await button(page,/^Choisir une question ·/).click();await page.getByRole('dialog',{name:'Choisir une question',exact:true}).locator('li button').nth(index).click()}
try{
 await mkdir(out,{recursive:true})
 for(const [width,height]of [[390,844],[1366,768],[360,640]]){
  console.log(`Mémory ${width}x${height}`);const {page,context}=await setup(width,height)
  assert.equal(await page.locator('.ci-memory-card').count(),6);assert.equal(await page.locator('.ci-memory-face').count(),0);assert.equal(await page.locator('.ci-stimulus-images').count(),0);await fit(page)
  await choose(page,wrong[0],width<=700);await choose(page,wrong[1]);assert.equal(await page.locator('.ci-memory-face').count(),2);assert.equal(await page.locator('.ci-memory-miss,.ci-memory-found').count(),0)
  assert.equal(await page.locator('.ci-memory-card:enabled').count(),0);await page.getByRole('button',{name:'Valider la paire',exact:true}).click();assert.equal(await page.locator('.ci-memory-miss').count(),2)
  await choose(page,pairs[0][1]);assert.equal(await page.locator('.ci-memory-face').count(),1);await page.getByRole('button',{name:'Annuler le choix',exact:true}).click();assert.equal(await page.locator('.ci-memory-face').count(),0)
  const slot=q.memoryBoard.cards.findIndex(c=>c.id===pairs[0][0]);await page.locator('.ci-memory-card:enabled').first().focus();await page.keyboard.press('abcdef'[slot]);await choose(page,pairs[0][1]);await fit(page);await page.screenshot({path:`${out}/two-cards-${width}.png`});await page.getByRole('button',{name:'Valider la paire',exact:true}).click();assert.equal(await page.locator('.ci-memory-found').count(),2)
  await button(page,'Verrouiller les commandes').click();assert.equal(await page.locator('.ci-memory-card:enabled').count(),0);await button(page,'Déverrouiller les commandes').click()
  await navigate(page,3);assert.equal(await page.locator('.ci-memory-card').count(),4);await navigate(page,0);assert.equal(await page.locator('.ci-memory-found').count(),2)
  const stored=await waitForBrowserValue(page,async()=>{const{requestLocal}=await import('/src/interactive/storage.ts');return(await requestLocal('sessions','readonly',s=>s.getAll())).find(r=>r.mode==='class'&&r.events.some(e=>e.action.type==='MEMORY_CHECK'))??null});assert.ok(!JSON.stringify(stored).includes('memoryPairs'))
  await context.setOffline(false);await page.reload();await page.locator('.ci-launch:enabled').waitFor({timeout:120000});assert.equal(await page.getByRole('checkbox',{name:'Mémory : cartes retournées'}).isChecked(),true);await page.locator('.ci-launch').click();await page.locator('.ci-memory-found').first().waitFor();assert.equal(await page.locator('.ci-memory-found').count(),2)
  for(const pair of pairs.slice(1)){await choose(page,pair[0]);await choose(page,pair[1]);await page.getByRole('button',{name:'Valider la paire',exact:true}).click()}
  assert.equal(await page.locator('.ci-memory-found').count(),6);assert.equal(await page.locator('.ci-session.ci-is-revealed').count(),0)
  for(const name of ['Commencer l’échange','Discuter','Enseignant : révéler'])await button(page,name).click();assert.equal(await page.locator('.ci-memory-mark').count(),6);assert.equal(await page.locator('.ci-model-answer').count(),0);await fit(page)
  await button(page,/^Choisir une question ·/).click();await page.getByRole('button',{name:'Réessayer cette question',exact:true}).click();await page.getByRole('dialog',{name:'Réessayer cette question ?',exact:true}).getByRole('button',{name:'Nouvelle tentative',exact:true}).click();assert.equal(await page.locator('.ci-memory-face').count(),0)
  assert.notDeepEqual(await page.locator('.ci-memory-card').evaluateAll(nodes=>nodes.map(n=>n.dataset.memoryId)),q.memoryBoard.cards.map(c=>c.id))
  results.push({viewport:`${width}x${height}`,input:width<=700?'Real CDP touch, mouse and scoped A–F keyboard':'Mouse and scoped A–F keyboard',class:'Neutral flip before teacher check; wrong pair, cancellation, found pairs, lock, navigation, reload, reveal and reshuffled retry',offline:'Full preload then native flips/checks with network disabled',axeViolations:0});await context.close()
 }
 console.log('Mémory Solo');const {page,context}=await setup(390,844,'solo',true);await page.clock.pauseAt(new Date((await page.evaluate(()=>Date.now()))+200))
 await choose(page,wrong[0]);await choose(page,wrong[1]);assert.equal(await page.locator('.ci-memory-miss').count(),2)
 await button(page,'Pause').click();await page.clock.runFor(7000);assert.equal(await page.locator('.ci-is-revealed').count(),0);await page.getByRole('button',{name:'Reprendre la séance',exact:true}).click()
 for(const pair of pairs){await choose(page,pair[1]);await choose(page,pair[0])}
 await page.locator('.ci-is-revealed').waitFor();assert.equal(await page.locator('.ci-memory-found').count(),6);await fit(page,true)
 await page.clock.runFor(2300);await page.waitForFunction(()=>document.querySelector('.ci-progress')?.textContent.includes('Question 2 / 5'));assert.equal(await page.locator('.ci-memory-face').count(),0)
 await page.clock.runFor(5200);assert.equal(await page.locator('.ci-is-revealed').count(),1);assert.equal(await page.locator('.ci-memory-found').count(),0)
 const record=await waitForBrowserValue(page,async()=>{const{requestLocal}=await import('/src/interactive/storage.ts');return(await requestLocal('sessions','readonly',s=>s.getAll())).find(r=>r.mode==='solo'&&r.events.some(e=>e.action.type==='TIMEOUT'))??null})
 const {replaySession,planIdentity}=await vite.ssrLoadModule('/src/interactive/domain/persistence.ts'),{prepareGame}=await vite.ssrLoadModule('/src/interactive/domain/plan.ts');const resolved=prepareGame(game,undefined,'solo');assert.equal(resolved.id,record.gameId);assert.equal(await planIdentity(resolved),record.planId);const resumed=replaySession(resolved,record,record.planId,Date.now(),'solo');assert.equal(resumed.state.history[0].correct,true);assert.equal(resumed.state.history[1].correct,false)
 await page.clock.resume();await context.close();results.push({solo:'Automatic pair validation; whole-board completion with earlier mistakes is true; pause freezes reflection; configured two-second feedback advances; incomplete timeout is false'})
 const untimed=await setup(360,640,'solo',false);await untimed.page.waitForTimeout(5200);assert.equal(await untimed.page.locator('.ci-is-revealed').count(),0)
 await untimed.page.locator('.ci-memory').focus();for(const pair of pairs)for(const id of pair){const index=q.memoryBoard.cards.findIndex(c=>c.id===id);await untimed.page.keyboard.press('abcdef'[index])}
 await untimed.page.locator('.ci-is-revealed').waitFor();assert.equal(await untimed.page.locator('.ci-memory-found').count(),6);await fit(untimed.page);await untimed.context.close();results.push({untimedSolo:'Six successive A–F keyboard flips complete the board without a reflection timer; the feedback timer remains available'})
 assert.deepEqual(recipe,original);assert.deepEqual(errors,[]);assert.ok(methods.length&&methods.every(m=>m==='GET'))
 await writeFile('docs/interactive/memory-results.json',JSON.stringify({results,errors,liveApiWrites:0},null,2)+'\n')
 await writeFile(`${out}/index.html`,`<!doctype html><html lang="fr"><meta charset="utf-8"><title>Mémory Classe et Solo</title><style>body{font:17px system-ui;max-width:1200px;margin:24px auto;padding:16px;background:#f7f8fc;color:#182238}img{max-width:100%;height:auto}figure{padding:16px;background:white;border-radius:12px}</style><h1>Mémory : cartes retournées</h1><p>Banques Vocabulaire et Mémory, quatre à six cartes repérées A–F. Deux faces neutres avant validation en Classe ; vérification et suite automatiques en Solo.</p>${[390,1366,360].map(width=>`<figure><figcaption>${width} px : deux cartes retournées avant validation</figcaption><img src="two-cards-${width}.png" alt="Plateau de Mémory à ${width} pixels"></figure>`).join('')}<p>Parcours vérifiés avec préchargement, réseau coupé, reprise et nouvelle tentative.</p></html>`)
 console.log(JSON.stringify(results,null,2))
}catch(error){const pages=browser.contexts().flatMap(c=>c.pages());for(const page of pages)await page.screenshot({path:'/tmp/clairfle-memory-error.png'}).catch(()=>{});throw error}finally{await browser.close();await vite.close()}
