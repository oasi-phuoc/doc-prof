import assert from 'node:assert/strict'
import {mkdir,writeFile} from 'node:fs/promises'
import {createServer} from 'vite'
import {chromium} from 'playwright'
import AxeBuilder from '@axe-core/playwright'
import {gameControl,waitForBrowserValue} from './browser-actions.mjs'

const base='http://127.0.0.1:5188',out='docs/interactive/tpm-fraction-proofs'
process.env.VITE_FICHES_API_URL=base+'/__unused_fiches'
const vite=await createServer({cacheDir:'/tmp/clairfle-tpm-fractions-browser',server:{host:'127.0.0.1',port:5188,strictPort:true,hmr:false}});await vite.listen()
const {poolRecipe,convertPoolRecipe}=await vite.ssrLoadModule('/src/interactive/pools/recipe.ts')
const {applyPlanOptions}=await vite.ssrLoadModule('/src/interactive/domain/plan-options.ts'),{prepareGame}=await vite.ssrLoadModule('/src/interactive/domain/plan.ts')
const {playPrompt}=await vite.ssrLoadModule('/src/interactive/domain/presentation.ts')
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH??'/usr/bin/chromium',args:['--no-sandbox']})
const errors=[],requests=[],results=[]
async function setup(width,height,mode='class'){
 const context=await browser.newContext({viewport:{width,height},hasTouch:width<700})
 await context.addCookies([{name:'clairfle-fiche-access',value:'admin',url:base}])
 await context.addInitScript(mode=>{sessionStorage.setItem('clairfle.interactive.mode.v1',mode);localStorage.setItem('clairfle.interactive.timer.v1',JSON.stringify({enabled:mode==='solo',seconds:5,feedbackSeconds:1}))},mode)
 await context.route('**/__unused_fiches/**',route=>{if(!route.request().url().endsWith('/competition/status'))requests.push(route.request().method());return route.fulfill({status:503,contentType:'application/json',body:'{}'})})
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(30000)
 await page.goto(base+'/interactif');await page.getByRole('button',{name:/^Exercices ou fiche/}).click()
 await page.getByRole('combobox',{name:'Domaine des exercices'}).selectOption('tpm')
 await page.locator('input[data-pool-type="tpm-fractions-mixte"]').check()
 const entry=page.locator('[data-selected-pool-type="tpm-fractions-mixte"]');await entry.locator('summary').click()
 const count=entry.getByRole('spinbutton',{name:/Nombre d’éléments/});assert.equal(await count.inputValue(),'6');assert.equal(await count.getAttribute('max'),'6')
 assert.equal(await entry.getByRole('checkbox',{name:'Choisir la plage de nombres'}).count(),0)
 await page.getByRole('checkbox',{name:'Mélanger les questions des différents types'}).uncheck()
 await page.getByRole('button',{name:'Préparer la partie',exact:true}).click();await page.waitForURL(url=>url.searchParams.has('pool'))
 await page.locator('.ci-launch:enabled').waitFor({timeout:120000})
 const pool=await page.evaluate(async id=>{const{requestLocal}=await import('/src/interactive/storage.ts');return requestLocal('pools','readonly',s=>s.get(id))},new URL(page.url()).searchParams.get('pool'))
 return{context,page,pool}
}
async function gameFor(page,pool,mode){
 const record=await waitForBrowserValue(page,async()=>{const{requestLocal}=await import('/src/interactive/storage.ts');return(await requestLocal('sessions','readonly',s=>s.getAll())).find(r=>r.source?.reference.kind==='pool')??null})
 const game=prepareGame(applyPlanOptions(convertPoolRecipe(poolRecipe(pool.config,record.source.seed),pool.name),record.source.options),undefined,mode)
 assert.equal(game.id,record.gameId);return{game,record}
}
async function reveal(page){for(const name of ['Signal : levez vos cartes','Discuter','Enseignant : révéler'])await gameControl(page,name).click()}
async function navigate(page,index){await gameControl(page,/^Choisir une question ·/).click();await page.getByRole('dialog',{name:'Choisir une question',exact:true}).locator('li button').nth(index).click()}
async function fits(page){
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false)
 const size=page.viewportSize()
 for(const r of await page.locator('.ci-answer:visible,.ci-controls:visible,.ci-duel-answer:visible').evaluateAll(nodes=>nodes.map(n=>n.getBoundingClientRect().toJSON())))assert(r.x>=-1&&r.y>=-1&&r.right<=size.width+1&&r.bottom<=size.height+1,JSON.stringify({size,r}))
}
try{
 await mkdir(out,{recursive:true})
 for(const[width,height]of[[390,844],[1366,768],[360,640]]){
  const{page,context,pool}=await setup(width,height)
  await page.getByRole('button',{name:/^Préparer la séance/}).click();await page.getByText('Jouer sans connexion',{exact:true}).first().click()
  await page.getByRole('button',{name:'Précharger toute la séance',exact:true}).click();await page.getByRole('status').filter({hasText:'Prêt à jouer sans connexion'}).waitFor({timeout:120000});await page.keyboard.press('Escape')
  await context.setOffline(true);await page.locator('.ci-launch:enabled').click();await page.locator('.ci-answer').first().waitFor()
  const{game}=await gameFor(page,pool,'class');assert.equal(game.questions.length,6)
  for(let index=0;index<6;index++){
   if(index)await navigate(page,index)
   assert.equal(await page.locator('.ci-question-prompt').textContent(),playPrompt(game.questions[index].prompt))
   assert.ok(!/=\s*(?:[?□▢]|_+)/u.test(await page.locator('.ci-question-prompt').textContent()))
   assert.ok(await page.locator('.ci-question-prompt .ci-fraction-digits').count())
   assert.equal(await page.locator('.ci-answer-key').count(),0);await reveal(page)
   const q=game.questions[index],correct=q.choices.find(c=>c.id===game.corrections[q.id].choiceId).text
   assert.equal(await page.locator('.ci-answer-key .ci-answer-content').textContent(),correct);assert.equal(await page.locator('.ci-answer-muted').count(),5)
   await fits(page)
  }
  const axe=(await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()).violations;assert.deepEqual(axe.map(v=>v.id),[])
  await page.screenshot({path:`${out}/division-${width}.png`})
  await context.setOffline(false);await page.evaluate(()=>sessionStorage.clear());await page.reload();await page.locator('.ci-launch:enabled').waitFor({timeout:120000});await page.locator('.ci-launch').click();await page.locator('.ci-answer-key').waitFor()
  assert.equal(await page.locator('.ci-question-prompt').textContent(),playPrompt(game.questions[5].prompt))
  results.push({mode:'class',viewport:`${width}x${height}`,questions:6,offline:true,resume:true,axeViolations:0});await context.close()
 }
 {
  const{page,context,pool}=await setup(390,844,'solo');await page.clock.install();await page.locator('.ci-launch').click();await page.locator('.ci-answer:enabled').first().waitFor();await page.clock.pauseAt(new Date((await page.evaluate(()=>Date.now()))+200))
  const{game,record}=await gameFor(page,pool,'solo')
  for(let index=0;index<6;index++){
   if(index===2)await page.clock.runFor(5200)
   else{const q=game.questions[index],correct=game.corrections[q.id].choiceId;await page.locator('.ci-answer').nth(q.choices.findIndex(c=>index===1?c.id!==correct:c.id===correct)).click()}
   await page.locator('.ci-answer-key').waitFor();await page.clock.runFor(1300)
  }
  await page.locator('.ci-summary').waitFor();await page.clock.resume();await page.getByRole('button',{name:'Nouvelle partie',exact:true}).click();await page.locator('.ci-answer:enabled').first().waitFor()
  const renewed=await waitForBrowserValue(page,async()=>{const{requestLocal}=await import('/src/interactive/storage.ts');const rows=(await requestLocal('sessions','readonly',s=>s.getAll())).filter(r=>r.source?.reference.kind==='pool');return rows.length>=2?rows.map(r=>r.source.seed):null})
  assert(renewed.some(seed=>seed!==record.source.seed));results.push({mode:'solo',questions:6,correct:true,wrong:true,timeout:true,automaticSummary:true,newSeed:true});await context.close()
 }
 {
  const{page,context}=await setup(844,390);await page.getByRole('button',{name:/^Compétition/}).click();await page.getByRole('button',{name:'Préparer un duel',exact:true}).click()
  await page.getByRole('spinbutton',{name:'Vie maximale',exact:true}).fill('10')
  for(const multiplier of [2,3,4])await page.getByRole('spinbutton',{name:`Chance de critique ×${multiplier} (%)`,exact:true}).fill('0')
  await page.getByRole('button',{name:'Préparer la partie',exact:true}).click();await page.getByRole('button',{name:'Commencer le duel',exact:true}).waitFor({timeout:120000});await context.setOffline(true)
  await page.getByRole('button',{name:'Commencer le duel',exact:true}).click();await page.locator('.ci-duel-answer:enabled').first().waitFor()
  assert.equal(await page.locator('.ci-duel-answer').count(),12);assert.ok(await page.locator('.ci-duel-question .ci-fraction-digits').count());await fits(page)
  await page.screenshot({path:`${out}/duel.png`})
  // Either verdict completes this 10-point duel, exercising the shared exact grading in competition.
  await page.locator('.ci-duel-answer:enabled').first().click();await page.locator('.ci-duel-finished').waitFor({timeout:30000})
  results.push({mode:'duel',viewport:'844x390',offline:true,cards:12,completed:true});await context.close()
 }
 assert.deepEqual(errors,[]);assert.deepEqual(requests,[])
 await writeFile('docs/interactive/tpm-fractions-results.json',JSON.stringify({passed:true,results,worksheetRequests:requests,pageErrors:errors},null,2)+'\n');console.log(JSON.stringify(results,null,2))
}catch(error){for(const page of browser.contexts().flatMap(c=>c.pages())){await page.screenshot({path:'/tmp/tpm-fractions-error.png',fullPage:true}).catch(()=>{});await writeFile('/tmp/tpm-fractions-error.txt',await page.locator('body').innerText()).catch(()=>{})}throw error}finally{await browser.close();await vite.close()}
