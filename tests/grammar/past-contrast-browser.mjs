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
 const setCount=async(label,n)=>{
  const input=page.getByLabel(label,{exact:true});await input.fill(String(n));await input.blur()
  assert.equal(await input.inputValue(),String(n));await page.waitForTimeout(150)
 }
 const checkPrint=async(expected)=>{
  await page.emulateMedia({media:'print'})
  const boxes=await page.locator('.print-only-sheets .worksheet-sheet').evaluateAll(sheets=>sheets.filter(s=>s.getBoundingClientRect().height>0).map(s=>{
   const r=s.getBoundingClientRect(),body=s.querySelector('.sheet-body').getBoundingClientRect(),footer=s.querySelector('.doc-footer').getBoundingClientRect()
   return {height:r.height,bodyBottom:body.bottom,footerTop:footer.top,items:[...s.querySelectorAll('.exercise-item')].map(i=>({bottom:i.getBoundingClientRect().bottom,text:i.innerText.slice(0,80)})),wide:[...s.querySelectorAll('.grammar-question')].filter(e=>e.scrollWidth>e.clientWidth+2).map(e=>e.className)}
  }))
  for(const b of boxes) {
   assert(Math.abs(b.height-1122.52)<3)
   assert(b.items.every(i=>i.bottom<=b.bodyBottom+2&&i.bottom<=b.footerTop+2),`Clipped items: ${JSON.stringify(b)}`)
   assert.deepEqual(b.wide,[])
  }
  const printed=await page.locator('.print-only-sheets .layout-grammar:not(:has(.grammar-reading-support))').count()
  assert.equal(printed,expected)
  await page.emulateMedia({media:'screen'})
  return boxes.length
 }
 await page.goto(base+'/generateur',{waitUntil:'networkidle',timeout:120000})
 await choose('Domaine','Grammaire');await choose('Thème','Parler du passé');await choose('Sous-thème','Imparfait ou passé composé')
 for(const [type,presentation,label] of [
  ['qcm-verbe','choice','Choisir le temps du récit'],['qcm-verbe','gap','Choisir le temps du récit'],
  ['curriculum-t','transform','Transformer une phrase'],['communication-pe','open-written','Écrire une phrase utile'],
  ['communication-po','open-oral','Dire une phrase utile'],
 ]) {
  await choose('Type d’exercice',label)
  const level=page.getByLabel('Niveau de grammaire',{exact:true}).locator('.select-control-value')
  if(await level.textContent()!=='A2 — pilote')await choose('Niveau de grammaire','A2 — pilote')
  if(presentation==='choice'||presentation==='gap')await page.getByRole('button',{name:presentation==='choice'?'QCM':'Lacune',exact:true}).click()
  await setCount('Nombre de questions',50)
  const sheets=await checkPrint(100)
  if(presentation.startsWith('open-')) {
   assert.equal(await page.locator('.print-only-sheets .grammar-rubric').count(),50)
   assert.equal(await page.locator('.print-only-sheets .grammar-model-label').count(),50)
   assert.equal(await page.locator('.a4-frame .grammar-production-model').count(),0,'Student sheets must not show the model.')
  }
  results.push({type:'gram-ex-imparfait-ou-pc-'+type,level:'A2',presentation,sheets,printedQuestions:100,overflow:false})
  console.log(`A2 ${presentation}: 50 unités, ${sheets} feuilles élève/corrigé, aucun débordement.`)
  if(presentation==='open-written')await page.locator('.a4-frame').first().screenshot({path:join(evidence,'h8-a2-production-ecrite.png')})
 }
 await choose('Type d’exercice','Lire une situation');await choose('Niveau de grammaire','A2 — pilote')
 assert.equal(await page.getByLabel('Nombre de questions',{exact:true}).count(),0)
 assert.equal(await page.getByLabel('Nombre de textes',{exact:true}).inputValue(),'1')
 await setCount('Nombre de textes',20)
 const sheets=await checkPrint(120)
 const printedIds=await page.locator('.print-only-sheets .grammar-reading-question').evaluateAll(es=>es.map(e=>e.dataset.readingQuestionId))
 assert.equal(new Set(printedIds).size,60)
 assert([...new Set(printedIds)].every(id=>printedIds.filter(v=>v===id).length===2))
 results.push({type:'gram-ex-imparfait-ou-pc-communication-ce',level:'A2',presentation:'document-set',documents:20,questions:60,sheets,printedQuestions:120,overflow:false})
 console.log(`A2 CE: 20 textes, 60 questions, ${sheets} feuilles élève/corrigé, aucun débordement.`)
 await setCount('Nombre de textes',2)
 const before=await page.locator('.a4-frame .grammar-reading-question').evaluateAll(es=>es.map(e=>e.dataset.readingQuestionId))
 assert.equal(before.length,6)
 const frames=page.locator('.a4-frame')
 let targetFrame
 for(let i=0;i<await frames.count();i++)if(await frames.nth(i).locator('.grammar-reading-question').count()>1){targetFrame=frames.nth(i);break}
 assert(targetFrame,'One continuation must contain two questions before the manual split.')
 const splitId=await targetFrame.locator('.grammar-reading-question').first().getAttribute('data-reading-question-id')
 await targetFrame.getByRole('button',{name:'Ajouter un saut de page après cette question',exact:true}).first().click()
 await page.waitForTimeout(150)
 const first=page.locator('.a4-frame').first()
 const splitQuestion=page.locator(`.a4-frame [data-reading-question-id="${splitId}"]`)
 await splitQuestion.waitFor()
 const splitFrame=splitQuestion.locator('xpath=ancestor::div[contains(concat(" ",normalize-space(@class)," ")," a4-frame ")]')
 assert.equal(await splitFrame.locator('.grammar-reading-question').count(),1)
 const after=await page.locator('.a4-frame .grammar-reading-question').evaluateAll(es=>es.map(e=>e.dataset.readingQuestionId))
 assert.deepEqual(after,before)
 assert(await page.locator('.a4-frame .grammar-reading-support h3').filter({hasText:'(suite)'}).count()>0)
 await checkPrint(12)
 await splitFrame.screenshot({path:join(evidence,'h8-a2-ce-saut-de-page.png')})
 await splitFrame.getByRole('button',{name:'Annuler le saut de page après cette question',exact:true}).click()
 await page.waitForTimeout(150)
 assert.equal(await page.locator(`.a4-frame [data-reading-question-id="${splitId}"]`).locator('xpath=ancestor::div[contains(concat(" ",normalize-space(@class)," ")," a4-frame ")]').locator('.grammar-reading-question').count(),2)
 results.push({manualPageBreak:'question IDs and order unchanged; support repeated; toggle reversible'})
 const title=await first.locator('.grammar-reading-support h3').textContent()
 const question=await first.locator('.grammar-reading-question > p').first().textContent()
 await page.getByRole('button',{name:'Jouer avec la classe',exact:true}).click();await page.waitForURL('**/interactif**')
 await page.getByRole('button',{name:/Commencer la séance/}).waitFor({timeout:120000})
 assert.equal(await page.locator('.ci-question-list fieldset > label').count(),6)
 await page.getByRole('button',{name:/Commencer la séance/}).click()
 await page.locator('.ci-question-prompt').filter({hasText:question}).waitFor()
 assert((await page.locator('body').innerText()).includes(title))
 results.push({classroomCE:'two documents and six linked questions; selected text visible'})
 assert.deepEqual(errors,[])
 writeFileSync(join(evidence,'h8-browser-result.json'),JSON.stringify({results,errors},null,2))
 console.log(JSON.stringify({status:'passed',results,errors}))
} finally {await browser.close()}
