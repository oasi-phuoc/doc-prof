import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {writeFileSync,mkdirSync} from 'node:fs'
import {join} from 'node:path'
import {dragSequence} from '../interactive/sequence-drag-actions.mjs'
import {gameControl} from '../interactive/browser-actions.mjs'
import AxeBuilder from '@axe-core/playwright'
const require=createRequire(import.meta.url),{chromium}=require('playwright'),{load,root}=require('../../scripts/gattegno-loader.cjs')
const {GRAMMAR_PILOT_BANKS,defaultGrammarPilot}=load(root+'/src/grammaire/curriculum/registry.ts'),{buildFicheRecipe}=load(root+'/src/fiches/recipe.ts')
const base=process.env.GRAMMAR_TEST_URL??'http://127.0.0.1:5183',evidence=process.env.GRAMMAR_QA_DIR??join(root,'docs/grammaire/implementation/temps-20261123-proofs');mkdirSync(evidence,{recursive:true})
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']}),results=[],errors=[]
try{
 for(const [level,width,height]of [['A1',1366,768],['A2',390,844]]){
  const context=await browser.newContext({viewport:{width,height},hasTouch:true});await context.addCookies([{name:'clairfle-fiche-access',value:'admin',url:base}])
  await context.addInitScript(()=>{localStorage.setItem('clairfle.interactive.timer.v1',JSON.stringify({enabled:false,seconds:30,feedbackSeconds:1}));localStorage.setItem('clairfle.interactive.toolbar-guard.v1',JSON.stringify('none'))})
  const page=await context.newPage();page.setDefaultTimeout(30000);page.on('pageerror',e=>errors.push(e.message))
  const bank=GRAMMAR_PILOT_BANKS.find(b=>b.activityId==='gram-ex-e5-curriculum-o'&&b.level===level),block={domain:'grammaire',topic:bank.topic,exerciseType:bank.activityId,difficulty:'facile',columns:1,count:1,...defaultGrammarPilot(bank.activityId),grammarLevel:bank.level,grammarBankRevision:bank.revision}
  const recipe=buildFicheRecipe({pages:[block],seed:839,institutional:{},evalMode:false,pointsPerQuestion:1,libreMode:false,libreSnapshot:null})
  await page.goto(base+'/generateur',{waitUntil:'domcontentloaded',timeout:120000})
  await page.evaluate(recipe=>{history.pushState({clairfleFiche:{id:'temps-order-fixture',name:'Étapes — essai local',recipe}},'','/generateur');dispatchEvent(new PopStateEvent('popstate'))},recipe)
  await page.locator('.a4-frame .phrase-bubble').first().waitFor()
  assert.equal(await page.getByRole('group',{name:'Forme des phrases',exact:true}).count(),0)
  const colors=await page.locator('.a4-frame .phrase-bubble').evaluateAll(nodes=>nodes.map(n=>getComputedStyle(n).backgroundColor));assert(colors.every(c=>c==='rgb(242, 244, 247)'))
  await page.getByRole('button',{name:/^Jouer (?:avec la classe|cette fiche)$/}).click();await page.waitForURL('**/interactif**');await page.locator('.ci-launch:enabled').waitFor({timeout:120000});await page.locator('.ci-launch').click()
  const zones=page.locator('.ci-word-sequence > button'),positions=()=>zones.evaluateAll(nodes=>nodes.map(n=>Number(n.dataset.ciSourceIndex)));await zones.first().waitFor();const initial=await positions()
  assert.equal(initial.length,level==='A1'?3:4);assert.equal(await page.locator('.ci-model-answer').count(),0)
  await dragSequence(page,zones.first(),zones.last());assert.notDeepEqual(await positions(),initial)
  await page.getByRole('button',{name:'Annuler le déplacement',exact:true}).click();assert.deepEqual(await positions(),initial)
  await dragSequence(page,zones.first(),zones.last(),{touch:true});assert.notDeepEqual(await positions(),initial)
  await page.getByRole('button',{name:'Annuler le déplacement',exact:true}).click();assert.deepEqual(await positions(),initial)
  await zones.first().tap();await zones.last().tap();assert.notDeepEqual(await positions(),initial)
  await page.getByRole('button',{name:'Annuler le déplacement',exact:true}).click();await zones.first().focus();await page.keyboard.press('ArrowRight');assert.notDeepEqual(await positions(),initial)
  assert.equal(await page.locator('.ci-model-answer').count(),0)
  const bounds=await page.evaluate(()=>({width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,controls:document.querySelector('.ci-controls').getBoundingClientRect().bottom,height:innerHeight,zones:[...document.querySelectorAll('.ci-word-sequence > button')].map(n=>({top:n.getBoundingClientRect().top,bottom:n.getBoundingClientRect().bottom,height:n.getBoundingClientRect().height}))}));assert(!bounds.overflow);assert(bounds.controls<=height+2);assert(bounds.zones.every(b=>b.top>=0&&b.bottom<=height+2&&b.height>=44),JSON.stringify(bounds))
  const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();assert.deepEqual(axe.violations.map(v=>v.id),[])
  await page.screenshot({path:join(evidence,`etapes-interactions-${level}-${width}.png`)})
  for(const name of ['Commencer l’échange','Discuter','Enseignant : révéler'])await gameControl(page,name).click()
  await page.locator('.ci-model-answer').waitFor();assert((await page.locator('.ci-model-answer').innerText()).includes('D’abord'))
  assert(await zones.first().isDisabled());results.push({level,width,height,nativePointer:true,nativeTouch:true,tap:true,keyboard:true,undo:true,neutralPaperTokens:true,noIrrelevantFilters:true,privacyBeforeReveal:true,teacherModelAfterReveal:true,axeViolations:0,bounds});await context.close()
 }
 assert.deepEqual(errors,[]);writeFileSync(join(evidence,'etapes-interactions.json'),JSON.stringify({status:'passed',results,errors},null,2)+'\n');console.log(JSON.stringify({status:'passed',viewports:results.length,errors}))
}catch(error){console.error(error);for(const context of browser.contexts())for(const page of context.pages()){await page.screenshot({path:join(evidence,'etapes-failure.png')});console.log(await page.locator('.ci-word-sequence').evaluate(n=>({rect:n.getBoundingClientRect().toJSON(),buttons:[...n.querySelectorAll('button')].map(b=>({class:b.className,rect:b.getBoundingClientRect().toJSON()}))})).catch(()=>null))}throw error}finally{await browser.close()}
