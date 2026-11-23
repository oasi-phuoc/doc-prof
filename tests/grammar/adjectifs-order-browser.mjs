import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {writeFileSync,mkdirSync} from 'node:fs'
import {join} from 'node:path'
import {dragSequence} from '../interactive/sequence-drag-actions.mjs'
import {gameControl} from '../interactive/browser-actions.mjs'
import AxeBuilder from '@axe-core/playwright'
const require=createRequire(import.meta.url),{chromium}=require('playwright'),{load,root}=require('../../scripts/gattegno-loader.cjs')
const {createGrammarQuestion}=load(root+'/src/grammaire/curriculum/questions.ts')
const {GRAMMAR_PILOT_BANKS,defaultGrammarPilot}=load(root+'/src/grammaire/curriculum/registry.ts'),{buildFicheRecipe}=load(root+'/src/fiches/recipe.ts')
const base=process.env.GRAMMAR_TEST_URL??'http://127.0.0.1:5183',evidence=process.env.GRAMMAR_QA_DIR??join(root,'docs/grammaire/implementation/adjectifs-20261123-proofs');mkdirSync(evidence,{recursive:true})
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']}),results=[],errors=[]
try{
 for(const [level,width,height]of [['A1',1366,768],['A2',390,844]]){
  const context=await browser.newContext({viewport:{width,height},hasTouch:true});await context.addCookies([{name:'clairfle-fiche-access',value:'admin',url:base}])
  await context.addInitScript(()=>{localStorage.setItem('clairfle.interactive.timer.v1',JSON.stringify({enabled:false,seconds:30,feedbackSeconds:1}));localStorage.setItem('clairfle.interactive.toolbar-guard.v1',JSON.stringify('none'))})
  const page=await context.newPage();page.setDefaultTimeout(30000);page.on('pageerror',e=>errors.push(e.message))
  const bank=GRAMMAR_PILOT_BANKS.find(b=>b.activityId==='gram-ex-f12-curriculum-o'&&b.level===level),block={domain:'grammaire',topic:bank.topic,exerciseType:bank.activityId,difficulty:'facile',columns:1,count:1,...defaultGrammarPilot(bank.activityId),grammarLevel:bank.level,grammarBankRevision:bank.revision}
  const recipe=buildFicheRecipe({pages:[block],seed:839,institutional:{},evalMode:false,pointsPerQuestion:1,libreMode:false,libreSnapshot:null})
  const wanted=bank.units.find(u=>u.id.endsWith(level==='A1'?'-bel-hotel':'-annee-derniere'))
  recipe.pages[0].grammarSnapshot.questions=[createGrammarQuestion(wanted,'order',839)]
  await page.goto(base+'/generateur',{waitUntil:'domcontentloaded',timeout:120000})
  await page.evaluate(recipe=>{history.pushState({clairfleFiche:{id:'adjectifs-order-fixture',name:'Groupes nominaux — essai local',recipe}},'','/generateur');dispatchEvent(new PopStateEvent('popstate'))},recipe)
  await page.locator('.a4-frame .phrase-bubble').first().waitFor()
  assert.equal(await page.getByRole('group',{name:'Forme des phrases',exact:true}).count(),0)
  assert(!(await page.locator('body').innerText()).includes('Phrases disponibles :'))
  await page.getByRole('button',{name:/^Jouer (?:avec la classe|cette fiche)$/}).click();await page.waitForURL('**/interactif**');await page.locator('.ci-launch:enabled').waitFor({timeout:120000});await page.locator('.ci-launch').click()
  const zones=page.locator('.ci-word-sequence > button'),positions=()=>zones.evaluateAll(nodes=>nodes.map(n=>Number(n.dataset.ciSourceIndex)));await zones.first().waitFor();const initial=await positions()
  assert.equal(initial.length,3);assert((await page.locator('.ci-context').innerText()).includes(wanted.cue));assert.equal(await page.locator('.ci-model-answer').count(),0)
  await dragSequence(page,zones.first(),zones.last());assert.notDeepEqual(await positions(),initial)
  await page.getByRole('button',{name:'Annuler le déplacement',exact:true}).click();assert.deepEqual(await positions(),initial)
  await dragSequence(page,zones.first(),zones.last(),{touch:true});assert.notDeepEqual(await positions(),initial)
  await page.getByRole('button',{name:'Annuler le déplacement',exact:true}).click();assert.deepEqual(await positions(),initial)
  await zones.first().tap();await zones.last().tap();assert.notDeepEqual(await positions(),initial)
  await page.getByRole('button',{name:'Annuler le déplacement',exact:true}).click();await zones.first().focus();await page.keyboard.press('ArrowRight');assert.notDeepEqual(await positions(),initial)
  assert.equal(await page.locator('.ci-model-answer').count(),0)
  const bounds=await page.evaluate(()=>({width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,controls:document.querySelector('.ci-controls').getBoundingClientRect().bottom,height:innerHeight,zones:[...document.querySelectorAll('.ci-word-sequence > button')].map(n=>({top:n.getBoundingClientRect().top,bottom:n.getBoundingClientRect().bottom,height:n.getBoundingClientRect().height}))}));assert(!bounds.overflow);assert(bounds.controls<=height+2);assert(bounds.zones.every(b=>b.top>=0&&b.bottom<=height+2&&b.height>=44),JSON.stringify(bounds))
  const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();assert.deepEqual(axe.violations.map(v=>v.id),[])
  await page.screenshot({path:join(evidence,`groupes-interactions-${level}-${width}.png`)})
  for(const name of ['Commencer l’échange','Discuter','Enseignant : révéler'])await gameControl(page,name).click()
  await page.locator('.ci-model-answer').waitFor();assert((await page.locator('.ci-model-answer').innerText()).includes(wanted.answers[0]))
  assert(await zones.first().isDisabled());results.push({level,width,height,nativePointer:true,nativeTouch:true,tap:true,keyboard:true,undo:true,nounGroup:true,apostrophe:level==='A2',noIrrelevantFilters:true,privacyBeforeReveal:true,teacherModelAfterReveal:true,axeViolations:0,bounds});await context.close()
 }
 assert.deepEqual(errors,[]);writeFileSync(join(evidence,'groupes-interactions.json'),JSON.stringify({status:'passed',results,errors},null,2)+'\n');console.log(JSON.stringify({status:'passed',viewports:results.length,errors}))
}catch(error){console.error(error);for(const context of browser.contexts())for(const page of context.pages()){await page.screenshot({path:join(evidence,'groupes-failure.png')});console.log(await page.locator('.ci-word-sequence').evaluate(n=>({rect:n.getBoundingClientRect().toJSON(),buttons:[...n.querySelectorAll('button')].map(b=>({class:b.className,rect:b.getBoundingClientRect().toJSON()}))})).catch(()=>null))}throw error}finally{await browser.close()}
