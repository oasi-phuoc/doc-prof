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
 await page.goto(base+'/generateur',{waitUntil:'networkidle',timeout:120000})
 await choose('Domaine','Grammaire');await choose('Thème','Conjuguer au présent');await choose('Sous-thème','Avoir')
 await choose('Type d’exercice','Conjuguer avoir')
 const level=page.getByLabel('Niveau de grammaire',{exact:true}).locator('.select-control-value')
 assert.equal(await level.textContent(),'Banque actuelle')
 for(const [suffix,presentation,label] of [
  ['qcm-conj','choice','Conjuguer avoir'],['qcm-conj','gap','Conjuguer avoir'],
  ['corriger-erreur','correct','Corriger l’erreur'],['ordre','order','Mots dans l’ordre'],
  ['curriculum-a','match','Associer les sujets et les formes'],
 ]) {
  await page.emulateMedia({media:'screen'});await choose('Type d’exercice',label)
  if(await level.textContent()!=='A1 — pilote')await choose('Niveau de grammaire','A1 — pilote')
  if(presentation==='choice'||presentation==='gap')await page.getByRole('button',{name:presentation==='choice'?'QCM':'Lacune',exact:true}).click()
  await page.getByLabel('Nombre de questions',{exact:true}).fill('50');await page.getByLabel('Nombre de questions',{exact:true}).blur()
  assert.equal(await page.getByLabel('Nombre de questions',{exact:true}).inputValue(),'50')
  await page.waitForTimeout(150)
  assert.equal(await page.locator('.a4-frame .grammar-verb-hint,.a4-frame .phrase-verb-hint').count(),0)
  assert.equal(await page.locator('.a4-frame .grammar-answer-inline.is-attached').count(),0)
  await page.emulateMedia({media:'print'})
  const boxes=await page.locator('.print-only-sheets .worksheet-sheet').evaluateAll(sheets=>sheets.filter(s=>s.getBoundingClientRect().height>0).map(s=>{
   const r=s.getBoundingClientRect(),body=s.querySelector('.sheet-body').getBoundingClientRect(),footer=s.querySelector('.doc-footer').getBoundingClientRect()
   return {height:r.height,bodyBottom:body.bottom,footerTop:footer.top,items:[...s.querySelectorAll('.exercise-item')].map(i=>({bottom:i.getBoundingClientRect().bottom,text:i.innerText.slice(0,110)})),wide:[...s.querySelectorAll('.grammar-question')].filter(e=>e.scrollWidth>e.clientWidth+2).map(e=>e.className)}
  }))
  for(const b of boxes) {
   assert(Math.abs(b.height-1122.52)<3)
   assert(b.items.every(i=>i.bottom<=b.bodyBottom+2&&i.bottom<=b.footerTop+2),`Clipped items: ${JSON.stringify(b)}`)
   assert.deepEqual(b.wide,[])
  }
  assert.equal(await page.locator('.print-only-sheets .layout-grammar').count(),100)
  if(presentation==='choice'||presentation==='gap') {
   const joined=await page.locator('.print-only-sheets .grammar-answer-inline.is-attached').evaluateAll(es=>es.map(e=>({answer:e.textContent,before:e.previousSibling?.textContent,width:e.getBoundingClientRect().width})))
   assert(joined.length>0&&joined.every(e=>e.answer==='ai'&&e.before?.endsWith('J’')&&e.width<25),'J’ joins ai in the correction; empty student fields stay wide.')
  }
  results.push({type:'gram-ex-avoir-'+suffix,level:'A1',presentation,sheets:boxes.length,printedQuestions:100,overflow:false})
  console.log(`Avoir A1 ${presentation}: 50 unités, ${boxes.length} feuilles élève/corrigé, aucun débordement.`)
 }
 await page.emulateMedia({media:'screen'});await choose('Type d’exercice','Conjuguer avoir');await choose('Niveau de grammaire','A1 — pilote')
 await page.getByRole('button',{name:'QCM',exact:true}).click()
 await page.getByLabel('Nombre de questions',{exact:true}).fill('3');await page.getByLabel('Nombre de questions',{exact:true}).blur()
 await page.locator('.a4-frame').first().screenshot({path:join(evidence,'avoir-a1-qcm.png')})
 await page.getByRole('button',{name:'Jouer avec la classe',exact:true}).click();await page.waitForURL('**/interactif**')
 await page.getByRole('button',{name:/Commencer la séance/}).waitFor({timeout:120000})
 assert.equal(await page.locator('.ci-question-list fieldset > label').count(),3)
 await page.getByRole('button',{name:/Commencer la séance/}).click()
 await page.locator('.ci-question-prompt').waitFor()
 assert.equal(await page.locator('.ci-answer').count(),3)
 results.push({classroomLaunch:'passed',selectedQuestions:3})
 assert.deepEqual(errors,[])
 writeFileSync(join(evidence,'avoir-browser-result.json'),JSON.stringify({results,errors},null,2))
 console.log(JSON.stringify({status:'passed',results,errors}))
} finally {await browser.close()}
