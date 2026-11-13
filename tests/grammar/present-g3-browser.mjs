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
  await control.click()
  await page.getByRole('option',{name:option,exact:true}).click()
 }
 await page.goto(base+'/generateur',{waitUntil:'networkidle',timeout:120000})
 await choose('Domaine','Grammaire');await choose('Thème','Conjuguer au présent')
 for(const [sub,subLabel,qLabel] of [['aller-destination','Aller','Indiquer la destination'],['er','Verbes en -er','Conjuguer en -er']]) {
  await choose('Sous-thème',subLabel)
  await choose('Type d’exercice',qLabel)
  const level=page.getByLabel('Niveau de grammaire',{exact:true}).locator('.select-control-value')
  assert.equal(await level.textContent(),'Banque actuelle')
  const offerings=[['choice',qLabel],['gap',qLabel],['correct','Corriger l’erreur'],['order','Mots dans l’ordre'],['transform','Transformer une phrase']]
  if(sub==='aller-destination')offerings.push(['open-oral','Dire où l’on va'])
  for(const [presentation,label] of offerings) {
   await page.emulateMedia({media:'screen'});await choose('Type d’exercice',label)
   if(await level.textContent()!=='A1 — pilote')await choose('Niveau de grammaire','A1 — pilote')
   if(presentation==='choice'||presentation==='gap')await page.getByRole('button',{name:presentation==='choice'?'QCM':'Lacune',exact:true}).click()
   const count=page.getByLabel('Nombre de questions',{exact:true})
   await count.fill('50');await count.blur()
   await page.waitForTimeout(150)
   assert.equal(await count.inputValue(),'50')
   assert.equal(await page.getByRole('button',{name:'Sous-thème',exact:true}).locator('.select-control-value').textContent(),subLabel)
   assert.equal(await page.getByRole('button',{name:'Type d’exercice',exact:true}).locator('.select-control-value').textContent(),label)
   const hintCount=await page.locator('.a4-frame .grammar-verb-hint,.a4-frame .phrase-verb-hint').count()
   assert(sub==='er'?hintCount>0:hintCount===0,`Infinitive hint contract: ${sub}/${presentation}`)
   await page.emulateMedia({media:'print'})
   const boxes=await page.locator('.print-only-sheets .worksheet-sheet').evaluateAll(sheets=>sheets.filter(s=>s.getBoundingClientRect().height>0).map(s=>{
    const r=s.getBoundingClientRect(),body=s.querySelector('.sheet-body').getBoundingClientRect(),footer=s.querySelector('.doc-footer').getBoundingClientRect()
    return {height:r.height,bodyBottom:body.bottom,footerTop:footer.top,items:[...s.querySelectorAll('.exercise-item')].map(i=>({bottom:i.getBoundingClientRect().bottom,text:i.innerText.slice(0,100)})),wide:[...s.querySelectorAll('.grammar-question')].filter(e=>e.scrollWidth>e.clientWidth+2).map(e=>e.className)}
   }))
   for(const b of boxes) {
    assert(Math.abs(b.height-1122.52)<3)
    assert(b.items.every(i=>i.bottom<=b.bodyBottom+2&&i.bottom<=b.footerTop+2),`Clipped items (${sub}/${presentation}): ${JSON.stringify(b)}`)
    assert.deepEqual(b.wide,[])
   }
   assert.equal(await page.locator('.print-only-sheets .layout-grammar').count(),100)
   results.push({sub,level:'A1',presentation,sheets:boxes.length,printedQuestions:100,overflow:false})
   console.log(`G3 ${sub}/${presentation}: 50 unités, ${boxes.length} feuilles élève/corrigé, aucun débordement.`)
  }
  await page.emulateMedia({media:'screen'})
  await choose('Type d’exercice',sub==='er'?'Transformer une phrase':'Dire où l’on va')
  await countForScreenshot(page)
  await page.locator('.a4-frame').first().screenshot({path:join(evidence,`${sub}-a1-g3.png`)})
  await page.getByRole('button',{name:'Jouer avec la classe',exact:true}).click()
  await page.waitForURL('**/interactif**')
  await page.getByRole('button',{name:/Commencer la séance/}).waitFor({timeout:120000})
  assert.equal(await page.locator('.ci-question-list fieldset > label').count(),3)
  await page.getByRole('button',{name:/Commencer la séance/}).click()
  await page.locator('.ci-question-prompt').waitFor()
  assert.equal(await page.locator('.ci-answer').count(),0,'The new open activities are teacher assessed, without artificial choices.')
  results.push({sub,classroomLaunch:'passed',selectedQuestions:3,automaticScoring:false})
  await page.goto(base+'/generateur',{waitUntil:'networkidle',timeout:120000})
  await choose('Domaine','Grammaire');await choose('Thème','Conjuguer au présent')
 }
 assert.deepEqual(errors,[])
 writeFileSync(join(evidence,'present-g3-browser-result.json'),JSON.stringify({results,errors},null,2))
 console.log(JSON.stringify({status:'passed',results,errors}))
} finally {await browser.close()}

async function countForScreenshot(page) {
 const count=page.getByLabel('Nombre de questions',{exact:true})
 await count.fill('3');await count.blur();await page.waitForTimeout(150)
}
