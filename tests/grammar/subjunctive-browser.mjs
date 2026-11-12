import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {mkdirSync,writeFileSync} from 'node:fs'
import {tmpdir} from 'node:os'
import {join} from 'node:path'

const {chromium}=createRequire(import.meta.url)('playwright')
const base=process.env.GRAMMAR_TEST_URL??'http://127.0.0.1:5183'
const evidence=process.env.GRAMMAR_QA_DIR??join(tmpdir(),'grammar-qa')
mkdirSync(evidence,{recursive:true})
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']})
const results=[]
try {
 const context=await browser.newContext({viewport:{width:1440,height:1100}})
 await context.addCookies([{name:'clairfle-fiche-access',value:'admin',url:base}])
 const page=await context.newPage(),errors=[]
 page.on('pageerror',e=>errors.push(e.message))
 const choose=async(label,option)=>{
  await page.getByRole('button',{name:label,exact:true}).click()
  await page.getByRole('option',{name:option,exact:true}).click()
 }
 const setCount=async(n)=>{
  const input=page.getByLabel('Nombre de questions',{exact:true})
  await input.fill(String(n));await input.blur()
  assert.equal(await input.inputValue(),String(n));await page.waitForTimeout(150)
 }
 await page.goto(base+'/generateur',{waitUntil:'networkidle',timeout:120000})
 await choose('Domaine','Grammaire');await choose('Thème','Exprimer quelque chose')
 await choose('Sous-thème','Le subjonctif (emplois principaux)')
 await choose('Type d’exercice','Employer le subjonctif')
 const level=page.getByLabel('Niveau de grammaire',{exact:true}).locator('.select-control-value')
 assert.equal(await level.textContent(),'Banque actuelle')
 for(const [type,presentation,label] of [
  ['qcm-conj','choice','Employer le subjonctif'],['qcm-conj','gap','Employer le subjonctif'],
  ['curriculum-t','transform','Transformer une phrase'],['curriculum-c','correct','Corriger l’erreur'],
  ['curriculum-e','open-written','Produire à l’écrit'],
 ]) {
  await page.emulateMedia({media:'screen'});await choose('Type d’exercice',label)
  if(await level.textContent()!=='B1 — pilote')await choose('Niveau de grammaire','B1 — pilote')
  await page.getByRole('button',{name:'Niveau de grammaire',exact:true}).click()
  assert.equal(await page.getByRole('option',{name:'A2 — pilote',exact:true}).count(),0)
  await page.keyboard.press('Escape')
  if(presentation==='choice'||presentation==='gap')await page.getByRole('button',{name:presentation==='choice'?'QCM':'Lacune',exact:true}).click()
  if(presentation==='open-written')assert.equal(await page.getByLabel('Nombre de questions',{exact:true}).inputValue(),'1','Writing starts with one task.')
  await setCount(50)
  assert.equal(await page.locator('.a4-frame .grammar-explanation,.a4-frame .grammar-production-model,.a4-frame .grammar-rubric').count(),0,'Corrections stay off student sheets.')
  if(presentation==='choice'||presentation==='gap')assert.equal(await page.locator('.a4-frame .grammar-answer-inline + .grammar-verb-hint').count(),50)
  if(presentation==='transform')assert.equal(await page.locator('.a4-frame .grammar-transform-directive').count(),50)
  if(presentation==='open-written')assert.equal(await page.locator('.a4-frame .grammar-production-lines .answer-line-field').count(),300)
  await page.emulateMedia({media:'print'})
  const boxes=await page.locator('.print-only-sheets .worksheet-sheet').evaluateAll(sheets=>sheets.filter(s=>s.getBoundingClientRect().height>0).map(s=>{
   const r=s.getBoundingClientRect(),body=s.querySelector('.sheet-body').getBoundingClientRect(),footer=s.querySelector('.doc-footer').getBoundingClientRect()
   return {height:r.height,bodyBottom:body.bottom,footerTop:footer.top,items:[...s.querySelectorAll('.exercise-item')].map(i=>({bottom:i.getBoundingClientRect().bottom,text:i.innerText.slice(0,110)})),wide:[...s.querySelectorAll('.grammar-question,.grammar-written-response')].filter(e=>e.scrollWidth>e.clientWidth+2).map(e=>e.className)}
  }))
  assert(boxes.length>1)
  for(const b of boxes) {
   assert(Math.abs(b.height-1122.52)<3)
   assert(b.items.every(i=>i.bottom<=b.bodyBottom+2&&i.bottom<=b.footerTop+2),`Clipped items: ${JSON.stringify(b)}`)
   assert.deepEqual(b.wide,[])
  }
  assert.equal(await page.locator('.print-only-sheets .layout-grammar').count(),100)
  if(presentation==='open-written')assert.equal(await page.locator('.print-only-sheets .grammar-rubric').count(),50)
  results.push({type:'gram-ex-k10-'+type,level:'B1',presentation,sheets:boxes.length,printedQuestions:100,overflow:false})
  console.log(`Subjonctif B1 ${presentation}: 50 unités, ${boxes.length} feuilles élève/corrigé, aucun débordement.`)
  await page.emulateMedia({media:'screen'})
  if(presentation==='transform'||presentation==='open-written')await page.locator('.a4-frame').first().screenshot({path:join(evidence,`k10-b1-${presentation}.png`)})
 }
 await choose('Type d’exercice','Transformer une phrase');await setCount(3)
 const source=await page.locator('.a4-frame .grammar-question > p').first().textContent()
 const directive=await page.locator('.a4-frame .grammar-transform-directive').first().textContent()
 await page.getByRole('button',{name:'Jouer avec la classe',exact:true}).click()
 await page.waitForURL('**/interactif**')
 await page.getByRole('button',{name:/Commencer la séance/}).waitFor({timeout:120000})
 assert.equal(await page.locator('.ci-question-list fieldset > label').count(),3)
 await page.getByRole('button',{name:/Commencer la séance/}).click()
 await page.locator('.ci-question-prompt').filter({hasText:source}).waitFor()
 assert((await page.locator('.ci-question-prompt').innerText()).includes(directive))
 assert((await page.locator('.ci-manual').innerText()).includes('L’enseignant guide l’activité'))
 results.push({classroomTransform:'source, required introductory expression and human assessment visible',selectedQuestions:3})
 assert.deepEqual(errors,[])
 writeFileSync(join(evidence,'k10-browser-result.json'),JSON.stringify({results,errors},null,2))
 console.log(JSON.stringify({status:'passed',results,errors}))
} finally {await browser.close()}
