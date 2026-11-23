import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {mkdirSync,writeFileSync} from 'node:fs'
import {join} from 'node:path'
import {gameControl} from '../interactive/browser-actions.mjs'
import AxeBuilder from '@axe-core/playwright'
const require=createRequire(import.meta.url),{chromium}=require('playwright'),{load,root}=require('../../scripts/gattegno-loader.cjs')
const {GRAMMAR_PILOT_BANKS,defaultGrammarPilot}=load(root+'/src/grammaire/curriculum/registry.ts'),{buildFicheRecipe}=load(root+'/src/fiches/recipe.ts')
const base=process.env.GRAMMAR_TEST_URL??'http://127.0.0.1:5183',evidence=process.env.GRAMMAR_QA_DIR??join(root,'docs/grammaire/implementation/decrire-1-20261123-proofs');mkdirSync(evidence,{recursive:true})
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']}),results=[],errors=[]
async function drag(page,source,target,touch){
 const a=await source.boundingBox(),b=await target.boundingBox();assert(a&&b);const start={x:a.x+a.width/2,y:a.y+a.height/2},end={x:b.x+b.width/2,y:b.y+b.height/2},client=touch?await page.context().newCDPSession(page):null
 try{if(touch)await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[start]});else{await page.mouse.move(start.x,start.y);await page.mouse.down()}
 for(let i=1;i<=10;i++){const point={x:start.x+(end.x-start.x)*i/10,y:start.y+(end.y-start.y)*i/10};if(touch)await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[point]});else await page.mouse.move(point.x,point.y)}
 await page.locator('.ci-order-ghost').waitFor();if(touch)await client.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});else await page.mouse.up();await page.locator('.ci-order-ghost').waitFor({state:'detached'})
 }finally{await client?.detach()}
}
try{
 for(const [type,width,height]of [['gram-ex-f4-curriculum-a',1366,768],['gram-ex-f6-curriculum-a',390,844]]){
  const context=await browser.newContext({viewport:{width,height},hasTouch:true});await context.addCookies([{name:'clairfle-fiche-access',value:'admin',url:base}]);await context.addInitScript(()=>{localStorage.setItem('clairfle.interactive.timer.v1',JSON.stringify({enabled:false,seconds:30,feedbackSeconds:1}));localStorage.setItem('clairfle.interactive.toolbar-guard.v1',JSON.stringify('none'))})
  const page=await context.newPage();page.setDefaultTimeout(30000);page.on('pageerror',e=>errors.push(e.message))
  const bank=GRAMMAR_PILOT_BANKS.find(b=>b.activityId===type),block={domain:'grammaire',topic:bank.topic,exerciseType:type,difficulty:'facile',columns:1,count:1,...defaultGrammarPilot(type)},recipe=buildFicheRecipe({pages:[block],seed:839,institutional:{},evalMode:false,pointsPerQuestion:1,libreMode:false,libreSnapshot:null})
  await page.goto(base+'/generateur',{waitUntil:'domcontentloaded',timeout:120000});await page.evaluate(recipe=>{history.pushState({clairfleFiche:{id:'decrire-local-fixture',name:'Décrire — essai local',recipe}},'','/generateur');dispatchEvent(new PopStateEvent('popstate'))},recipe)
  await page.locator('.a4-frame .grammar-match-columns').waitFor();assert.equal(await page.locator('.a4-frame .grammar-match-option-letter').count(),2)
  await page.getByRole('button',{name:/^Jouer (?:avec la classe|cette fiche)$/}).click();await page.waitForURL('**/interactif**');await page.locator('.ci-launch:enabled').waitFor({timeout:120000});await page.locator('.ci-launch').click();await page.locator('.ci-word-sorting').waitFor()
  const phrases=await page.locator('[data-ci-sort-word] b').allTextContents(),unit=bank.units.find(u=>u.pairs.every(p=>phrases.includes(p.left)));assert(unit);assert((await page.locator('.ci-context').innerText()).includes(unit.prompt));assert.equal(await page.locator('.ci-model-answer,.ci-sort-review').count(),0)
  for(let i=0;i<phrases.length;i++){
   const source=page.locator(`[data-ci-sort-word="${i}"]`),label=unit.pairs.find(p=>p.left===phrases[i]).right,target=page.getByRole('button',{name:`Déposer dans ${label}`,exact:true})
   const b=await target.boundingBox();assert(b&&b.y>=0&&b.y+b.height<=height+2,JSON.stringify({type,width,target:b}))
   await drag(page,source,target,width<700)
  }
  assert.equal(await page.locator('.ci-sort-pool .ci-sort-word').count(),0);await gameControl(page,'Annuler le classement').click();assert.equal(await page.locator('.ci-sort-pool .ci-sort-word').count(),1)
  const last=phrases.length-1;await page.locator(`[data-ci-sort-word="${last}"]`).focus();await page.keyboard.press('Enter');await page.getByRole('button',{name:`Déposer dans ${unit.pairs.find(p=>p.left===phrases[last]).right}`,exact:true}).click();assert.equal(await page.locator('.ci-sort-pool .ci-sort-word').count(),0)
  const bounds=await page.evaluate(()=>({horizontalOverflow:document.documentElement.scrollWidth>innerWidth,controlsBottom:document.querySelector('.ci-controls').getBoundingClientRect().bottom}));assert(!bounds.horizontalOverflow);assert(bounds.controlsBottom<=height+2)
  const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();assert.deepEqual(axe.violations.map(v=>v.id),[]);await page.screenshot({path:join(evidence,`${type}-${width}-interaction.png`)})
  assert.equal(await page.locator('.ci-model-answer').count(),0);for(const name of ['Commencer l’échange','Discuter','Enseignant : révéler'])await gameControl(page,name).click();await page.locator('.ci-sort-review').waitFor();assert((await page.locator('.ci-sort-review').innerText()).includes('2 / 2'));assert((await page.locator('.ci-model-answer').innerText()).includes(unit.answers[0].split('\n')[0]))
  results.push({type,width,height,completeProblem:true,nativePointer:width>700,nativeTouch:width<700,keyboard:true,undo:true,privateUntilReveal:true,modelAfterReveal:true,axeViolations:0,bounds});await context.close()
 }
 assert.deepEqual(errors,[]);writeFileSync(join(evidence,'associations-interactions.json'),JSON.stringify({status:'passed',results,errors},null,2)+'\n');console.log(JSON.stringify({status:'passed',viewports:results.length,errors}))
}catch(error){for(const context of browser.contexts())for(const page of context.pages())await page.screenshot({path:join(evidence,'associations-failure.png')});throw error}finally{await browser.close()}
