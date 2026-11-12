import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
const { chromium } = createRequire(import.meta.url)('playwright')
import { mkdirSync,writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
const base=process.env.GRAMMAR_TEST_URL??'http://127.0.0.1:5183'
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']})
const evidence=process.env.GRAMMAR_QA_DIR??join(tmpdir(),'grammar-qa')
mkdirSync(evidence,{recursive:true})
const results=[]
try {
 const context=await browser.newContext({viewport:{width:1440,height:1100}})
 await context.addCookies([{name:'clairfle-fiche-access',value:'admin',url:base}])
 const page=await context.newPage();const errors=[]
 const choose=async(label,option)=>{
  await page.getByRole('button',{name:label,exact:true}).click()
  await page.getByRole('option',{name:option,exact:true}).click()
 }
 page.on('pageerror',e=>errors.push(e.message))
 await page.goto(base+'/generateur',{waitUntil:'networkidle',timeout:120000})
 await choose('Domaine','Grammaire')
 await choose('Thème','Conjuguer au présent')
 await choose('Sous-thème','Être')
 await choose('Type d’exercice','Conjuguer être')
 const level=page.getByLabel('Niveau de grammaire',{exact:true})
 assert.equal(await level.locator('.select-control-value').textContent(),'Banque actuelle')
 await choose('Niveau de grammaire','A1 — pilote')
 await page.locator('.a4-frame .grammar-choices').first().waitFor()
 await page.getByRole('button',{name:'Lacune',exact:true}).click()
 assert.equal(await page.locator('.a4-frame .grammar-choices').count(),0)
 await page.getByRole('button',{name:'QCM',exact:true}).click()
 for (const [type,presentation,label] of [['gram-ex-etre-qcm-conj','choice','Conjuguer être'],['gram-ex-etre-qcm-conj','gap','Conjuguer être'],['gram-ex-etre-corriger-erreur','correct','Corriger l’erreur'],['gram-ex-etre-ordre','order','Mots dans l’ordre'],['gram-ex-etre-curriculum-a','match','Associer les sujets et les formes']]) {
  await page.emulateMedia({media:'screen'})
  await choose('Type d’exercice',label)
  if(await level.locator('.select-control-value').textContent()!=='A1 — pilote')await choose('Niveau de grammaire','A1 — pilote')
  if(presentation==='choice')await page.getByRole('button',{name:'QCM',exact:true}).click()
  if(presentation==='gap')await page.getByRole('button',{name:'Lacune',exact:true}).click()
  await page.getByLabel('Nombre de questions',{exact:true}).fill('50')
  await page.getByLabel('Nombre de questions',{exact:true}).blur()
  assert.equal(await page.getByLabel('Nombre de questions',{exact:true}).inputValue(),'50')
  await page.waitForTimeout(250)
  await page.emulateMedia({media:'print'})
  const sheets=page.locator('.print-only-sheets .worksheet-sheet')
  assert(await sheets.count()>1,'Expected continuation sheets')
  const boxes=await sheets.evaluateAll(sheets=>sheets.filter(s=>s.getBoundingClientRect().height>0).map(s=>{
   const box=e=>{const r=e.getBoundingClientRect();return{top:r.top,bottom:r.bottom,width:r.width,height:r.height}}
   return{sheet:box(s),body:box(s.querySelector('.sheet-body')),footer:box(s.querySelector('.doc-footer')),items:[...s.querySelectorAll('.exercise-item')].map(box)}
  }))
  assert(boxes.length>1)
  for(const b of boxes) {
   assert(Math.abs(b.sheet.height-1122.52)<3,`A4 size: ${JSON.stringify(b.sheet)}`)
   assert(b.items.every(i=>i.bottom<=b.body.bottom+2),`Clipped grammar rows: ${JSON.stringify(b)}`)
   assert(b.items.every(i=>i.bottom<=b.footer.top+2),`Rows overlap footer: ${JSON.stringify(b)}`)
  }
  const visibleQuestionIds=await page.locator('.print-only-sheets .layout-grammar').count()
  assert.equal(visibleQuestionIds,100,'All fifty questions must be present on student and correction sheets.')
  results.push({type,presentation,sheets:boxes.length,printedQuestions:visibleQuestionIds,overflow:false})
  if(presentation==='choice') {
   await page.emulateMedia({media:'screen'})
   await page.locator('.a4-frame').first().screenshot({path:evidence+'/etre-a1-qcm.png'})
  }
 }
 await page.emulateMedia({media:'screen'})
 await choose('Type d’exercice','Mots dans l’ordre')
 await choose('Niveau de grammaire','A1 — pilote')
 await page.getByRole('button',{name:'Négative',exact:true}).click()
 const unavailable=page.waitForEvent('dialog').then(async notice=>{
  assert.match(notice.message(),/0 question/)
  await notice.dismiss()
 })
 await page.getByRole('button',{name:'Jouer avec la classe',exact:true}).click()
 await unavailable
 assert(new URL(page.url()).pathname==='/generateur')
 results.push({unavailableFilters:'clear notice, no broken session'})
 await choose('Type d’exercice','Conjuguer être')
 await choose('Niveau de grammaire','A1 — pilote')
 await page.getByLabel('Nombre de questions',{exact:true}).fill('3')
 await page.getByLabel('Nombre de questions',{exact:true}).blur()
 await page.getByRole('button',{name:'Jouer avec la classe',exact:true}).click()
 await page.waitForURL('**/interactif**')
 await page.getByRole('button',{name:/Commencer la séance/}).waitFor({timeout:120000})
 assert.equal(await page.locator('.ci-question-list fieldset > label').count(),3)
 results.push({classroomLaunch:'passed',selectedQuestions:3})
 assert.deepEqual(errors,[])
 writeFileSync(evidence+'/browser-result.json',JSON.stringify({results,errors},null,2))
 console.log(JSON.stringify({status:'passed',results,errors}))
} finally {await browser.close()}
