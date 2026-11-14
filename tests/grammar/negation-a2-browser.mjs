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
 await page.goto(base+'/generateur',{waitUntil:'networkidle',timeout:120000})
 await choose('Domaine','Grammaire');await choose('Thème','Conjuguer au présent');await choose('Sous-thème','Autres négations')
 await choose('Type d’exercice','Choisir une autre négation')
 const level=page.getByLabel('Niveau de grammaire',{exact:true}).locator('.select-control-value')
 assert.equal(await level.textContent(),'Banque actuelle')
 await choose('Niveau de grammaire','A1 — pilote');await page.getByRole('button',{name:'Lacune',exact:true}).click()
 await choose('Niveau de grammaire','A2 — pilote')
 assert.equal(await page.getByRole('button',{name:'Lacune',exact:true}).getAttribute('aria-pressed'),'true')
 await choose('Niveau de grammaire','A1 — pilote')
 assert.equal(await page.getByRole('button',{name:'Lacune',exact:true}).getAttribute('aria-pressed'),'true')
 results.push({levelSwitch:'A1 ↔ A2 keeps the presentation; legacy remains available'})
 for(const [grade,presentation,label] of [
  ['A1','choice','Choisir une autre négation'],['A1','gap','Choisir une autre négation'],['A1','order','Mots dans l’ordre'],
  ['A2','choice','Choisir une autre négation'],['A2','gap','Choisir une autre négation'],['A2','order','Mots dans l’ordre'],
  ['A2','correct','Corriger l’erreur'],['A2','transform','Transformer une phrase'],
 ]) {
  await page.emulateMedia({media:'screen'});await choose('Type d’exercice',label)
  if(await level.textContent()!==grade+' — pilote')await choose('Niveau de grammaire',grade+' — pilote')
  if(['choice','gap'].includes(presentation))await page.getByRole('button',{name:presentation==='choice'?'QCM':'Lacune',exact:true}).click()
  if(presentation==='order')await page.getByRole('group',{name:'Forme des phrases',exact:true}).getByRole('button',{name:'Négative',exact:true}).click()
  if(['correct','transform'].includes(presentation)) {
   await page.getByRole('button',{name:'Niveau de grammaire',exact:true}).click()
   assert.equal(await page.getByRole('option',{name:'A1 — pilote',exact:true}).count(),0)
   await page.keyboard.press('Escape')
  }
  const count=page.getByLabel('Nombre de questions',{exact:true});await count.fill('50');await count.blur()
  await page.waitForFunction(()=>document.querySelectorAll('.a4-frame .layout-grammar').length===50)
  assert.equal(await page.getByRole('button',{name:'Sous-thème',exact:true}).locator('.select-control-value').textContent(),'Autres négations')
  if(['choice','gap'].includes(presentation))assert.equal(await page.locator('.a4-frame .grammar-cue').count(),50)
  await page.emulateMedia({media:'print'})
  const boxes=await page.locator('.print-only-sheets .worksheet-sheet').evaluateAll(sheets=>sheets.filter(s=>s.getBoundingClientRect().height>0).map(s=>{
   const r=s.getBoundingClientRect(),body=s.querySelector('.sheet-body').getBoundingClientRect(),footer=s.querySelector('.doc-footer').getBoundingClientRect()
   return {height:r.height,bodyBottom:body.bottom,footerTop:footer.top,items:[...s.querySelectorAll('.exercise-item')].map(i=>({bottom:i.getBoundingClientRect().bottom,text:i.innerText.slice(0,100)})),wide:[...s.querySelectorAll('.grammar-question')].filter(e=>e.scrollWidth>e.clientWidth+2).map(e=>e.className)}
  }))
  for(const b of boxes) {
   assert(Math.abs(b.height-1122.52)<3)
   assert(b.items.every(i=>i.bottom<=b.bodyBottom+2&&i.bottom<=b.footerTop+2),`Clipped ${grade}/${presentation}: ${JSON.stringify(b)}`)
   assert.deepEqual(b.wide,[])
  }
  assert.equal(await page.locator('.print-only-sheets .layout-grammar').count(),100)
  results.push({level:grade,presentation,sheets:boxes.length,printedQuestions:100,overflow:false})
  console.log(`a9 ${grade}/${presentation}: 100 questions imprimées, ${boxes.length} feuilles, aucun débordement.`)
 }
 await page.emulateMedia({media:'screen'})
 const count=page.getByLabel('Nombre de questions',{exact:true});await count.fill('3');await count.blur()
 await page.waitForFunction(()=>document.querySelectorAll('.a4-frame .layout-grammar').length===3)
 const source=await page.locator('.a4-frame .grammar-question > p:not(.grammar-cue):not(.grammar-transform-directive)').first().textContent()
 const directive=await page.locator('.a4-frame .grammar-transform-directive').first().textContent()
 await page.locator('.a4-frame').first().screenshot({path:join(evidence,'a9-a2-transform.png')})
 await page.getByRole('button',{name:'Jouer avec la classe',exact:true}).click();await page.waitForURL('**/interactif**')
 const start=page.getByRole('button',{name:/Commencer la séance/});await start.waitFor({timeout:120000})
 assert.equal(await page.locator('.ci-question-list fieldset > label').count(),3)
 await start.click();await page.locator('.ci-question-prompt').waitFor()
 const prompt=await page.locator('.ci-question-prompt').innerText()
 assert(prompt.includes(source.trim()));assert(prompt.includes(directive.trim()))
 assert.equal(await page.locator('.ci-answer').count(),0)
 results.push({classroomTransform:'source, context and directive preserved; teacher assessed',selectedQuestions:3})
 assert.deepEqual(errors,[])
 writeFileSync(join(evidence,'negation-a2-browser-result.json'),JSON.stringify({results,errors},null,2))
 console.log(JSON.stringify({status:'passed',results,errors}))
} finally {await browser.close()}
