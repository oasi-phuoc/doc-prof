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
  const control=page.getByRole('button',{name:label,exact:true})
  if(await control.locator('.select-control-value').textContent()===option)return
  await control.click();await page.getByRole('option',{name:option,exact:true}).click()
 }
 const open=async()=>{
  await page.goto(base+'/generateur',{waitUntil:'networkidle',timeout:120000})
  await choose('Domaine','Grammaire');await choose('Thème','Entrer en contact')
 }
 await open()
 for(const [sub,subLabel,qLabel,fillLabel] of [
  ['b1','Tu et vous','Choisir tu ou vous','Compléter tu / vous'],
  ['b2','Les salutations','Choisir la salutation',null],
  ['b3','Les remerciements','Remercier et répondre','Compléter merci / s’il vous plaît'],
 ]) {
  await choose('Sous-thème',subLabel);await choose('Type d’exercice',qLabel)
  const level=page.getByLabel('Niveau de grammaire',{exact:true}).locator('.select-control-value')
  assert.equal(await level.textContent(),'Banque actuelle')
  const offers=[]
  if(fillLabel)offers.push(['gap-only',fillLabel])
  offers.push(['choice',qLabel],['gap',qLabel])
  if(sub==='b2')offers.push(['open-written','Écrire une salutation'],['order','Mots dans l’ordre'])
  offers.push(['match','Associer les situations et les formes'],['open-oral','S’exprimer à l’oral'],['scenario-set','Jouer une situation'])
  for(const [presentation,label] of offers) {
   await page.emulateMedia({media:'screen'});await choose('Type d’exercice',label)
   if(await level.textContent()!=='A1 — pilote')await choose('Niveau de grammaire','A1 — pilote')
   if(['choice','gap'].includes(presentation))await page.getByRole('button',{name:presentation==='choice'?'QCM':'Lacune',exact:true}).click()
   if(presentation==='gap-only')assert.equal(await page.getByRole('group',{name:'Réponse grammaticale',exact:true}).count(),0)
   if(presentation==='order')await page.getByRole('group',{name:'Forme des phrases',exact:true}).getByRole('button',{name:'Positive',exact:true}).click()
   const count=page.getByLabel(presentation==='scenario-set'?'Nombre de situations':'Nombre de questions',{exact:true})
   await count.fill('50');await count.blur()
   await page.waitForFunction(()=>document.querySelectorAll('.a4-frame .layout-grammar').length===50)
   assert.equal(await page.getByRole('button',{name:'Sous-thème',exact:true}).locator('.select-control-value').textContent(),subLabel)
   if(presentation==='choice')await page.waitForFunction(()=>document.querySelectorAll('.a4-frame .grammar-choices').length===50)
   if(['gap','gap-only'].includes(presentation))assert.equal(await page.locator('.a4-frame .grammar-choices').count(),0)
   if(presentation==='match')assert.equal(await page.locator('.a4-frame .grammar-match-columns').count(),50)
   if(presentation==='scenario-set')assert.equal(await page.locator('.a4-frame .grammar-scenario-open').count(),50)
   assert.equal(await page.locator('.a4-frame .grammar-production-model,.a4-frame .grammar-explanation,.a4-frame .grammar-rubric').count(),0)
   await page.emulateMedia({media:'print'})
   const boxes=await page.locator('.print-only-sheets .worksheet-sheet').evaluateAll(sheets=>sheets.filter(s=>s.getBoundingClientRect().height>0).map(s=>{
    const r=s.getBoundingClientRect(),body=s.querySelector('.sheet-body').getBoundingClientRect(),footer=s.querySelector('.doc-footer').getBoundingClientRect()
    return {height:r.height,bodyBottom:body.bottom,footerTop:footer.top,items:[...s.querySelectorAll('.exercise-item')].map(i=>({bottom:i.getBoundingClientRect().bottom,text:i.innerText.slice(0,95)})),wide:[...s.querySelectorAll('.grammar-question')].filter(e=>e.scrollWidth>e.clientWidth+2).map(e=>e.className)}
   }))
   for(const b of boxes) {
    assert(Math.abs(b.height-1122.52)<3)
    assert(b.items.every(i=>i.bottom<=b.bodyBottom+2&&i.bottom<=b.footerTop+2),`Clipped ${sub}/${presentation}: ${JSON.stringify(b)}`)
    assert.deepEqual(b.wide,[])
   }
   assert.equal(await page.locator('.print-only-sheets .layout-grammar').count(),100)
   results.push({sub,level:'A1',presentation,sheets:boxes.length,printedQuestions:100,overflow:false})
   console.log(`${sub}/${presentation}: 100 questions imprimées, ${boxes.length} feuilles, aucun débordement.`)
  }
  await page.emulateMedia({media:'screen'})
  for(const [label,matching] of [['Associer les situations et les formes',true],['Jouer une situation',false]]) {
   await choose('Type d’exercice',label)
   const count=page.getByLabel(matching?'Nombre de questions':'Nombre de situations',{exact:true});await count.fill('3');await count.blur()
   await page.waitForFunction(()=>document.querySelectorAll('.a4-frame .layout-grammar').length===3)
   if(!matching)await page.locator('.a4-frame').first().screenshot({path:join(evidence,`${sub}-contact-a1.png`)})
   await page.getByRole('button',{name:'Jouer avec la classe',exact:true}).click();await page.waitForURL('**/interactif**')
   const start=page.getByRole('button',{name:/Commencer la séance/});await start.waitFor({timeout:120000})
   const pairCount=sub==='b1'?2:3
   assert.equal(await page.locator('.ci-question-list fieldset > label').count(),matching?3*pairCount:3)
   await start.click();await page.locator('.ci-question-prompt').waitFor()
   assert.equal(await page.locator('.ci-answer').count(),matching?pairCount:0)
   results.push({sub,classroom:matching?'matching':'scenario',sourceProblems:3,gameQuestions:matching?3*pairCount:3,status:'passed'})
   await open();await choose('Sous-thème',subLabel)
  }
 }
 assert.deepEqual(errors,[])
 writeFileSync(join(evidence,'contact-browser-result.json'),JSON.stringify({results,errors},null,2))
 console.log(JSON.stringify({status:'passed',results,errors}))
} finally {await browser.close()}
