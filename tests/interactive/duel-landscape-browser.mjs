import {gameControl} from './browser-actions.mjs'
import assert from 'node:assert/strict'
import {mkdir,writeFile} from 'node:fs/promises'
import {createServer} from 'vite'
import {chromium} from 'playwright'
import AxeBuilder from '@axe-core/playwright'

const base='http://127.0.0.1:5182';process.env.VITE_FICHES_API_URL=base+'/__test_api'
const vite=await createServer({cacheDir:'/tmp/clairfle-duel-landscape-browser',server:{host:'127.0.0.1',port:5182,strictPort:true}});await vite.listen()
const {demoRecipe}=await vite.ssrLoadModule('/src/interactive/demo.ts'),{defaultPage}=await vite.ssrLoadModule('/src/math/catalog.ts')
const recipe={...demoRecipe(),libreMode:true,pages:[{...defaultPage('algèbre'),count:1,extraBlocks:undefined,libreItems:[{layout:'select',prompt:'2 + 2 = ?',options:['4','5','6','7','8','9'],answer:'4'}]}]}
const saved={id:'duel-landscape',name:'Duel en paysage',domains:['algèbre'],recipe,createdAt:'2026-11-15T00:00:00Z',updatedAt:'2026-11-15T00:00:00Z'}
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH||undefined,args:['--no-sandbox']})
const results=[],errors=[],methods=[];let activePage
const button=(page,name)=>gameControl(page,name),hp=page=>page.locator('.ci-duel-hp').allTextContents()
const answer=(page,side)=>page.locator(`.ci-duel-player[data-side="${side}"] .ci-duel-answer`).filter({has:page.locator('.ci-duel-answer-content').getByText('4',{exact:true})})
async function setup(mode='denied',width=390,height=844){
  console.log(`Landscape fixture ${mode} ${width}x${height}`)
  const context=await browser.newContext({viewport:{width,height},hasTouch:true,isMobile:true,reducedMotion:'reduce'});await context.addCookies([{name:'clairfle-fiche-access',value:'admin',url:base}])
  await context.addInitScript(mode=>{
    localStorage.setItem('clairfle-fiche-sync','landscape-fixture-only');localStorage.setItem('clairfle.interactive.timer.v1',JSON.stringify({enabled:true,seconds:5,feedbackSeconds:1}));window.__locks=[];window.__unlocks=0
    Object.defineProperty(screen.orientation,'lock',{configurable:true,value:async value=>{window.__locks.push(value);if(mode==='success'){await window.__rotate();return}throw new DOMException('Unavailable','NotSupportedError')}})
    Object.defineProperty(screen.orientation,'unlock',{configurable:true,value:()=>{window.__unlocks++}})
    if(mode==='unsupported')Object.defineProperty(Element.prototype,'requestFullscreen',{configurable:true,value:async()=>{throw new DOMException('Unavailable','NotSupportedError')}})
  },mode)
  await context.route('**/__test_api/fiches',route=>{methods.push(route.request().method());return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({fiches:[saved]})})})
  const page=await context.newPage();activePage=page;page.setDefaultTimeout(30000);page.on('pageerror',error=>errors.push(error.message));await page.exposeFunction('__rotate',()=>page.setViewportSize({width:844,height:390}))
  await page.goto(base+'/interactif/'+saved.id);await page.locator('.ci-launch:enabled').waitFor({timeout:120000});await button(page,'Compétition').click();await button(page,'Préparer un duel').click();await button(page,'Préparer la partie').click();await button(page,'Commencer le duel').waitFor()
  await page.evaluate(async()=>{
    const {createDuel,duelRound}=await import('/src/interactive/duel/core.ts'),key=Object.keys(sessionStorage).find(key=>key.startsWith('clairfle.duel.duel.')),record=JSON.parse(sessionStorage.getItem(key)),quiz={id:record.quizId,title:'Fixture',items:[{question:{id:'q',prompt:'?',images:[],choices:[{id:'yes',text:'Oui'},{id:'no',text:'Non'}]},correctChoiceId:'yes'}]}
    for(let seed=0;seed<5000;seed++){const state=createDuel(quiz,{...record.config,seed},record.timer,record.createdAt);if([1,2,3].every((value,turn)=>duelRound(quiz,{...state,turn}).multiplier===value)){record.config.seed=seed;sessionStorage.setItem(key,JSON.stringify(record));return}}
    throw new Error('No critical sequence')
  })
  await button(page,'Quitter la compétition').click();await page.clock.install();await page.clock.pauseAt(new Date(Date.now()+1000));await button(page,'Reprendre la partie').click();await button(page,'Commencer le duel').waitFor();return {page,context}
}
async function fit(page){
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false)
  for(const node of await page.locator('.ci-duel-answer,.ci-duel-controls,.ci-duel-fighter').all()){
    const bounds=await node.boundingBox(),vp=page.viewportSize();assert.ok(bounds.x>=-1&&bounds.y>=-1&&bounds.x+bounds.width<=vp.width+1&&bounds.y+bounds.height<=vp.height+1,JSON.stringify({bounds,vp}))
    if(await node.evaluate(node=>node.matches('.ci-duel-answer')))assert.ok(bounds.width>=44&&bounds.height>=44)
  }
  for(const side of ['left','right']){
    const fighter=page.locator(`.ci-duel-player[data-side="${side}"]`),portrait=await fighter.locator('.ci-competition-portrait').boundingBox(),bar=await fighter.getByRole('progressbar').boundingBox(),text=await fighter.locator('.ci-duel-hp').boundingBox()
    assert.ok(side==='left'?bar.x+bar.width<=portrait.x+1:bar.x>=portrait.x+portrait.width-1);assert.ok(text.x>=bar.x&&text.x+text.width<=bar.x+bar.width&&text.y>=bar.y&&text.y+text.height<=bar.y+bar.height)
  }
}
async function axe(page){const report=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();assert.deepEqual(report.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[])}
try{
  await mkdir('docs/interactive/screenshots',{recursive:true})
  const manual=await setup();let {page}=manual
  await button(page,'Commencer le duel').tap();await page.getByRole('heading',{name:'Tournez votre téléphone',exact:true}).waitFor();await page.clock.fastForward(7000)
  assert.equal(await page.locator('.ci-duel-arena').count(),0);assert.deepEqual(await page.evaluate(()=>window.__locks),['landscape'])
  await page.setViewportSize({width:844,height:390});await page.locator('.ci-duel-arena[data-multiplier="1"]').waitFor();await fit(page);assert.deepEqual(await hp(page),['100','100']);assert.equal(await page.locator('.ci-duel-round-meta strong').count(),0);assert.equal(await page.locator('[data-power-aura]').count(),0)
  await page.screenshot({path:'docs/interactive/screenshots/duel-landscape-normal-844.png'})
  console.log('Normal round checked');await answer(page,'left').tap();await page.clock.fastForward(2500);await page.locator('.ci-duel-arena[data-multiplier="2"]').waitFor();assert.deepEqual(await hp(page),['100','90']);assert.equal(await page.locator('.ci-vfx-canvas[data-multiplier="2"]').count(),1);assert.equal(await page.locator('.ci-mascot-angry').count(),2);await fit(page)
  await page.screenshot({path:'docs/interactive/screenshots/duel-landscape-power2-844.png'})
  console.log('Golden aura checked');await answer(page,'right').tap();console.log('Second answer accepted');await page.clock.fastForward(2500);await page.locator('.ci-duel-arena[data-multiplier="3"]').waitFor();assert.deepEqual(await hp(page),['80','90']);assert.equal(await page.locator('.ci-vfx-canvas[data-multiplier="3"]').count(),1);assert.equal(await page.locator('.ci-mascot-angry').count(),2);await fit(page)
  console.log('Triple round displayed');assert.equal(await page.locator('.ci-vfx-canvas').getAttribute('data-vfx-engine'),'canvas2d-v1')
  assert.ok((await page.locator('.ci-mascot-angry').evaluateAll(nodes=>nodes.map(node=>getComputedStyle(node).animationName))).every(name=>name!=='none'));await page.clock.resume();await axe(page);assert.deepEqual(await hp(page),['80','90']);await page.screenshot({path:'docs/interactive/screenshots/duel-landscape-power3-844.png'})
  results.push({phone:'844x390',orientation:'Rejected native lock requests manual rotation; seven seconds waiting never start the timer; rotation starts the duel automatically.',health:'Outer vertical bars and digits without percent signs inside; all twelve answer targets stay at least 44 px.',powers:'Normal has no damage badge or aura; double and triple use the persistent themed Canvas engine; triple retains actual angry sprites.',axeViolations:0});await manual.context.close()
  const fallback=await setup('unsupported',360,640);page=fallback.page;await button(page,'Commencer le duel').tap();await page.getByRole('heading',{name:'Tournez votre téléphone',exact:true}).waitFor();await button(page,'Jouer en portrait').tap();await page.locator('.ci-duel-arena').waitFor();await fit(page);await page.clock.resume();await axe(page);await page.screenshot({path:'docs/interactive/screenshots/duel-portrait-fallback-360.png'});results.push({phone:'360x640',orientation:'Missing fullscreen/lock support preserves an explicit playable portrait fallback.',axeViolations:0});await fallback.context.close()
  const automatic=await setup('success');page=automatic.page;await button(page,'Commencer le duel').tap();await page.locator('.ci-duel-arena').waitFor();assert.equal(page.viewportSize().width,844);assert.deepEqual(await page.evaluate(()=>window.__locks),['landscape']);await fit(page);await button(page,'Quitter le plein écran').tap();await page.waitForFunction(()=>window.__unlocks===1);results.push({phone:'844x390',orientation:'Capability fixture accepts landscape and rotates automatically after the user gesture; leaving fullscreen releases the acquired lock.'});await automatic.context.close()
  assert.deepEqual(errors,[]);assert.ok(methods.every(method=>method==='GET'));await writeFile('docs/interactive/duel-landscape-results.json',JSON.stringify({results,errors,liveApiWrites:0,scope:'Real Chromium touch/layout plus controlled Screen Orientation support/denial; physical Android/iOS validation remains open.'},null,2)+'\n');console.log(JSON.stringify(results,null,2))
}catch(error){if(activePage&&!activePage.isClosed()){console.error((await activePage.locator('body').innerText()).slice(-1600));await activePage.screenshot({path:'/tmp/clairfle-duel-landscape-failure.png',fullPage:true})}throw error}
finally{await browser.close();await vite.close()}
