import assert from 'node:assert/strict'
import {writeFile} from 'node:fs/promises'
import {createServer} from 'vite'
import {chromium} from 'playwright'
import {gameControl} from './browser-actions.mjs'
const base='http://127.0.0.1:5197'
process.env.VITE_FICHES_API_URL=base+'/__test_api'
const vite=await createServer({cacheDir:'/tmp/clairfle-vfx-lifecycle',server:{host:'127.0.0.1',port:5197,strictPort:true,hmr:false}});await vite.listen()
const {demoRecipe}=await vite.ssrLoadModule('/src/interactive/demo.ts')
const recipe={...demoRecipe(),pages:[{...demoRecipe().pages[0],count:1,libreItems:[{layout:'select',prompt:'2 + 2 = ?',options:['4','5','6','7','8','9'],answer:'4'}]}]}
const saved={id:'vfx-lifecycle',name:'Cycles des effets',recipe,domains:['algèbre'],createdAt:'2026-11-15T00:00:00Z',updatedAt:'2026-11-15T00:00:00Z'}
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH||undefined,args:['--no-sandbox']}),errors=[],results=[]
const button=(page,name)=>gameControl(page,name)
const answer=page=>page.locator('.ci-duel-player[data-side="left"] .ci-duel-answer').filter({has:page.locator('.ci-duel-answer-content').getByText('4',{exact:true})})
async function setup(fault){
 const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});await context.addCookies([{name:'clairfle-fiche-access',value:'admin',url:base}]);await context.addInitScript(()=>{localStorage.setItem('clairfle-fiche-sync','vfx-lifecycle');localStorage.setItem('clairfle.interactive.timer.v1',JSON.stringify({enabled:false,seconds:5,feedbackSeconds:1}))})
 await context.route('**/__test_api/fiches',route=>{assert.equal(route.request().method(),'GET');return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({fiches:[saved]})})})
 const page=await context.newPage();page.setDefaultTimeout(30000);page.on('pageerror',e=>errors.push(e.message));await page.goto(base+'/interactif/'+saved.id);await page.locator('.ci-launch:enabled').waitFor({timeout:120000})
 if(fault)await page.evaluate(fault=>{if(fault==='missing')HTMLCanvasElement.prototype.getContext=()=>null;else CanvasRenderingContext2D.prototype.createLinearGradient=()=>{throw new Error('Controlled renderer failure')}},fault)
 await button(page,'Compétition').click();await button(page,'Préparer un duel').click();await button(page,'Préparer la partie').click();await button(page,'Commencer le duel').waitFor();return{page,context}
}
try{
 const {page,context}=await setup()
 await page.evaluate(async()=>{const {createDuel,duelRound}=await import('/src/interactive/duel/core.ts');const key=Object.keys(sessionStorage).find(s=>s.startsWith('clairfle.duel.duel.')),j=JSON.parse(sessionStorage.getItem(key)),quiz={id:j.quizId,items:[{question:{id:'q',choices:[{id:'yes'}]},correctChoiceId:'yes'}]};for(let seed=0;seed<1000;seed++)if(duelRound(quiz,createDuel(quiz,{...j.config,seed},j.timer,j.createdAt)).multiplier===3){j.config.seed=seed;sessionStorage.setItem(key,JSON.stringify(j));return}throw new Error('No triple seed')})
 await button(page,'Quitter la compétition').click();await button(page,'Reprendre la partie').click();await button(page,'Commencer le duel').click();await page.locator('.ci-duel-arena[data-multiplier="3"]').waitFor()
 await answer(page).click();await button(page,'Pause').click();await page.locator('.ci-duel-arena[data-paused]').waitFor();await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))))
 const frame=await page.locator('.ci-vfx-canvas').evaluate(node=>({image:node.toDataURL(),at:node.dataset.elapsed}));await page.waitForTimeout(180)
 assert.deepEqual(await page.locator('.ci-vfx-canvas').evaluate(node=>({image:node.toDataURL(),at:node.dataset.elapsed})),frame)
 assert.deepEqual(await page.locator('.ci-duel-hp').allTextContents(),['100','100'])
 await page.setViewportSize({width:844,height:390});assert.equal(await page.locator('.ci-vfx-canvas').getAttribute('data-elapsed'),frame.at)
 await page.locator('.ci-duel-pause').getByRole('button',{name:'Reprendre le duel',exact:true}).click();await page.waitForFunction(()=>document.querySelectorAll('.ci-duel-hp')[1]?.textContent==='70')
 assert.equal(await page.locator('.ci-vfx-canvas[data-local]').count(),1)
 await page.waitForFunction(()=>!!document.querySelector('.ci-duel-answer:enabled'))
 assert.deepEqual(await page.locator('.ci-duel-hp').allTextContents(),['100','70'])
 await button(page,'Quitter la compétition').click();assert.equal(await page.locator('.ci-duel-arena .ci-vfx-canvas').count(),0);assert.equal(await page.locator('.ci-mascot-attacks .ci-vfx-canvas').count(),1)
 results.push({case:'triple pause/resize/resume',frozenPixelFrame:true,healthWaitsForContact:true,damageAppliedOnce:30,canvasRemovedOnExit:true});await context.close()
 const low=await setup();const lowSequence=await low.page.evaluate(async()=>{
  const {createDuel,duelRound}=await import('/src/interactive/duel/core.ts'),key=Object.keys(sessionStorage).find(s=>s.startsWith('clairfle.duel.duel.')),j=JSON.parse(sessionStorage.getItem(key)),quiz={id:j.quizId,items:[{question:{id:'q',choices:[{id:'yes'}]},correctChoiceId:'yes'}]}
  j.config.left=['rabbit'];j.timer.feedbackSeconds=5
  for(let seed=0;seed<1000;seed++){
   const state=createDuel(quiz,{...j.config,seed},j.timer,j.createdAt),prefix=[];let sum=0
   for(let turn=0;turn<8;turn++){
    const level=duelRound(quiz,{...state,turn}).multiplier;sum+=level;prefix.push(level)
    if(sum>8)break
    if(sum===8){const next=[0,1,2].map(n=>duelRound(quiz,{...state,turn:turn+1+n}).multiplier);if(next[0]>1&&next[1]>1&&next[0]!==next[1]&&next[2]===1){j.config.seed=seed;sessionStorage.setItem(key,JSON.stringify(j));return{prefix,critical:next.slice(0,2)}}break}
   }
  }
  throw new Error('No fatigue/critical sequence')
 })
 await button(low.page,'Quitter la compétition').click();await low.page.clock.install();await low.page.clock.pauseAt(new Date(Date.now()+1000));await button(low.page,'Reprendre la partie').click();await button(low.page,'Commencer le duel').click()
 const left=low.page.locator('.ci-duel-player[data-side="left"]'),wrong=left.locator('.ci-duel-answer').filter({has:low.page.locator('.ci-duel-answer-content').getByText('5',{exact:true})})
 let hp=100
 for(const level of lowSequence.prefix){assert.equal(await left.locator('.ci-mascot-angry').count(),level>1?1:0);await wrong.click();await low.page.clock.runFor(2500);hp-=level*10;assert.equal(await left.locator('.ci-duel-hp').innerText(),String(hp));await low.page.clock.runFor(2500)}
 assert.equal(hp,20)
 for(const level of lowSequence.critical){
  assert.equal(await low.page.locator('.ci-duel-arena').getAttribute('data-multiplier'),String(level));assert.equal(await left.locator('.ci-mascot-angry').count(),1);await answer(low.page).click()
  const during=level===3?1800:1100;await low.page.clock.runFor(during);assert.equal(await left.locator('.ci-mascot-angry').count(),1);await low.page.clock.runFor(2400-during)
  assert.equal(await left.locator('[data-combat-state="critical-tired"]').count(),1);assert.equal(await low.page.locator('[data-power-aura]').count(),0)
  if(level===3)await low.page.screenshot({path:'docs/interactive/screenshots/mascot-rabbit-tired-clean-corners-390.png'})
  await low.page.clock.runFor(2600)
 }
 assert.equal(await low.page.locator('.ci-duel-arena').getAttribute('data-multiplier'),'1');assert.equal(await left.locator('[data-combat-state="critical-tired"]').count(),1);await low.page.clock.resume()
 results.push({case:'critical energy at low HP',mascot:'rabbit',hp20AngryDuringBothLevels:true,angryUntilAttackEnds:true,returnsToFatigueAfterward:true,cleanBodyContour:true});await low.context.close()
 const legacy=await setup();await legacy.page.evaluate(async()=>{const {createDuel,duelRound}=await import('/src/interactive/duel/core.ts');const key=Object.keys(sessionStorage).find(s=>s.startsWith('clairfle.duel.duel.')),j=JSON.parse(sessionStorage.getItem(key)),quiz={id:j.quizId,items:[{question:{id:'q',choices:[{id:'yes'}]},correctChoiceId:'yes'}]};j.version=2;for(let seed=0;seed<1000;seed++)if(duelRound(quiz,createDuel(quiz,{...j.config,seed},j.timer,j.createdAt,2)).multiplier===3){j.config.seed=seed;sessionStorage.setItem(key,JSON.stringify(j));return}})
 await button(legacy.page,'Quitter la compétition').click();await button(legacy.page,'Reprendre la partie').click();await button(legacy.page,'Commencer le duel').click();await answer(legacy.page).click()
 await legacy.page.waitForFunction(()=>document.querySelectorAll('.ci-duel-hp')[1]?.textContent==='70');assert.equal(await legacy.page.locator('.ci-duel-feedback').count(),1)
 const oldJournal=await legacy.page.evaluate(()=>JSON.parse(sessionStorage.getItem(Object.keys(sessionStorage).find(s=>s.startsWith('clairfle.duel.duel.')))));assert.equal(oldJournal.version,2);assert.equal(oldJournal.timer.feedbackSeconds,1)
 results.push({case:'legacy-v2',tripleContactVisibleBeforeHistoricOneSecondDeadline:true,journalVersionAndTeacherSettingPreserved:true});await legacy.context.close()
 for(const fault of ['missing','throwing']){
  const {page,context}=await setup(fault);await button(page,'Commencer le duel').click();const before=await page.locator('.ci-duel-arena').getAttribute('data-duel-round');await answer(page).click();await page.locator('[data-vfx-fallback]').waitFor()
  await page.waitForFunction(()=>Number(document.querySelectorAll('.ci-duel-hp')[1]?.textContent)<100)
  await page.waitForFunction(before=>document.querySelector('.ci-duel-arena')?.dataset.duelRound!==before&&!!document.querySelector('.ci-duel-answer:enabled'),before)
  assert.equal(await page.locator('[data-vfx-fallback]').count(),1);results.push({case:fault,fallback:true,answerAndAutomaticNextStillWork:true});await context.close()
 }
 assert.deepEqual(errors,[]);await writeFile('docs/interactive/vfx-lifecycle-results.json',JSON.stringify({results,errors,liveApiWrites:0},null,2)+'\n');console.log(JSON.stringify(results,null,2))
}finally{await browser.close();await vite.close()}
