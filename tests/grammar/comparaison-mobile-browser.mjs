import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {mkdirSync,writeFileSync} from 'node:fs'
import {join} from 'node:path'
import AxeBuilder from '@axe-core/playwright'
import {gameControl} from '../interactive/browser-actions.mjs'
const require=createRequire(import.meta.url),{chromium}=require('playwright'),{load,root}=require('../../scripts/gattegno-loader.cjs')
const {GRAMMAR_PILOT_BANKS,defaultGrammarPilot}=load(root+'/src/grammaire/curriculum/registry.ts'),{buildFicheRecipe}=load(root+'/src/fiches/recipe.ts'),{createGrammarQuestion}=load(root+'/src/grammaire/curriculum/questions.ts')
const base=process.env.GRAMMAR_TEST_URL??'http://127.0.0.1:5183',evidence=process.env.GRAMMAR_QA_DIR??join(root,'docs/grammaire/implementation/comparaison-20261123-proofs');mkdirSync(evidence,{recursive:true})
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']}),results=[],errors=[]
try{
 for(const [suffix,level,width,height]of [['qcm-verbe','A1',1366,768],['qcm-verbe','A2',390,844],['curriculum-t','A2',1366,768],['curriculum-e','A2',390,844]]){
  const context=await browser.newContext({viewport:{width,height},hasTouch:true});await context.addCookies([{name:'clairfle-fiche-access',value:'admin',url:base}]);await context.addInitScript(()=>{localStorage.setItem('clairfle.interactive.timer.v1',JSON.stringify({enabled:false,seconds:30,feedbackSeconds:1}));localStorage.setItem('clairfle.interactive.toolbar-guard.v1',JSON.stringify('none'))})
  const page=await context.newPage();page.setDefaultTimeout(30000);page.on('pageerror',e=>errors.push(e.message))
  const bank=GRAMMAR_PILOT_BANKS.find(b=>b.activityId==='gram-ex-f9-'+suffix&&b.level===level),block={domain:'grammaire',topic:bank.topic,exerciseType:bank.activityId,difficulty:'facile',columns:1,count:1,...defaultGrammarPilot(bank.activityId),grammarLevel:level,grammarBankRevision:bank.revision},recipe=buildFicheRecipe({pages:[block],seed:839,institutional:{},evalMode:false,pointsPerQuestion:1,libreMode:false,libreSnapshot:null})
  // Use an actual bank unit with the longest context, rather than a short lucky draw.
  const unit=[...bank.units].sort((a,b)=>(b.cue??b.prompt).length-(a.cue??a.prompt).length)[0]
  recipe.pages[0].grammarSnapshot.questions=[createGrammarQuestion(unit,bank.presentations[0],839)]
  await page.goto(base+'/generateur',{waitUntil:'domcontentloaded',timeout:120000});await page.evaluate(recipe=>{history.pushState({clairfleFiche:{id:'comparaison-local-fixture',name:'Comparaisons — essai local',recipe}},'','/generateur');dispatchEvent(new PopStateEvent('popstate'))},recipe)
  await page.locator('.a4-frame .layout-grammar').waitFor();assert.equal(await page.locator('.a4-frame .grammar-production-model,.a4-frame .grammar-rubric').count(),0)
  await page.getByRole('button',{name:/^Jouer (?:avec la classe|cette fiche)$/}).click();await page.waitForURL('**/interactif**');await page.locator('.ci-launch:enabled').waitFor({timeout:120000});await page.locator('.ci-launch').click();await page.locator('.ci-question-prompt').waitFor()
  await page.evaluate(()=>document.fonts.ready)
  assert.equal(await page.locator('.ci-model-answer,.ci-answer-key,.ci-answer-muted').count(),0)
  const prompt=await page.locator('.ci-question-prompt').innerText();if(level==='A2'){assert((await page.locator('.ci-context').innerText()).includes(unit.cue??unit.prompt));assert(prompt.includes(unit.kind==='completion'?unit.prompt.replace('___','').split(' que ')[0].split(' est ')[0]:unit.kind==='production'?unit.task:unit.directive))}
  else assert(prompt.includes(unit.cue??unit.prompt))
  const bounds=await page.evaluate(()=>{const body=document.querySelector('.ci-question-body'),r=body.getBoundingClientRect();const question=document.querySelector('.ci-playing .ci-question').getBoundingClientRect();return{questionTop:question.top,questionBottom:question.bottom,horizontalOverflow:document.documentElement.scrollWidth>innerWidth,controlsBottom:document.querySelector('.ci-controls').getBoundingClientRect().bottom,bodyTop:r.top,bodyBottom:r.bottom,questionScroll:body.scrollHeight>body.clientHeight+2,questionFocusable:body.tabIndex===0,questionRole:body.getAttribute('role'),cards:[...document.querySelectorAll('.ci-answer')].map(n=>({top:n.getBoundingClientRect().top,bottom:n.getBoundingClientRect().bottom,height:n.getBoundingClientRect().height}))}})
  assert(!bounds.horizontalOverflow);assert(bounds.controlsBottom<=height+2);assert(bounds.bodyTop>=0&&bounds.bodyBottom<=height+2);assert(bounds.questionTop>=0&&bounds.questionBottom<=height+2)
  if(bounds.questionScroll){assert(bounds.questionFocusable);assert.equal(bounds.questionRole,'region');await page.locator('.ci-question-body').focus();await page.keyboard.press('End');await page.waitForFunction(()=>document.querySelector('.ci-question-body').scrollTop>0);await page.locator('.ci-question-body').evaluate(n=>n.scrollTo({top:0,behavior:'instant'}))}
  assert(bounds.cards.every(r=>r.height>=44&&r.top>=0&&r.bottom<=height+2),JSON.stringify(bounds))
  const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();assert.deepEqual(axe.violations.map(v=>v.id),[])
  await page.screenshot({path:join(evidence,`${suffix}-${level}-${width}-question.png`)})
  for(const name of [suffix==='qcm-verbe'?'Signal : levez vos cartes':'Commencer l’échange','Discuter','Enseignant : révéler'])await gameControl(page,name).click()
  if(suffix==='qcm-verbe'){await page.locator('.ci-answer-key').waitFor();assert.equal(await page.locator('.ci-answer-key').count(),1);assert.equal(await page.locator('.ci-answer-muted').count(),2);assert.equal(await page.locator('.ci-model-answer').count(),0);assert((await page.locator('.ci-answer-key').innerText()).includes(unit.answers[0]))}
  else{await page.locator('.ci-model-answer').waitFor();assert((await page.locator('.ci-model-answer').innerText()).includes(unit.answers[0]));await page.getByRole('button',{name:'Acquis',exact:true}).click();assert.equal(await page.getByRole('button',{name:'Acquis',exact:true}).getAttribute('aria-pressed'),'true')}
  console.log(`${bank.activityId}/${level}/${width}: question et correction vérifiées.`)
  results.push({activity:bank.activityId,level,width,height,unit:unit.id,longestContext:true,privateBeforeReveal:true,correctAfterReveal:true,axeViolations:0,bounds});await context.close()
 }
 assert.deepEqual(errors,[]);writeFileSync(join(evidence,'mobile-desktop-result.json'),JSON.stringify({status:'passed',results,errors},null,2)+'\n');console.log(JSON.stringify({status:'passed',cases:results.length,errors}))
}catch(error){for(const context of browser.contexts())for(const page of context.pages())await page.screenshot({path:join(evidence,'mobile-desktop-failure.png')});throw error}finally{await browser.close()}
