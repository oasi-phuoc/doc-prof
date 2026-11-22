import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {mkdirSync,writeFileSync} from 'node:fs'
import {tmpdir} from 'node:os'
import {join} from 'node:path'
const require=createRequire(import.meta.url),{chromium}=require('playwright')
const {load,root}=require('../../scripts/gattegno-loader.cjs')
const {GRAMMAR_PILOT_BANKS}=load(root+'/src/grammaire/curriculum/registry.ts')
const {resolveGramSubthemeAll,buildGrammairePracticeTypes}=load(root+'/src/grammaire/exercises/catalog-exercises.ts')
const types=buildGrammairePracticeTypes()
const completion=new Set(['gram-ex-famille-curriculum-a','gram-ex-famille-curriculum-p','gram-ex-famille-fam-pe'])
const banks=GRAMMAR_PILOT_BANKS.filter(b=>!completion.has(b.activityId)&&b.topic==='gram-se-presenter'&&['a1','a3','famille'].includes(b.subthemeId)&&(!process.env.GRAMMAR_QA_ACTIVITY||b.activityId===process.env.GRAMMAR_QA_ACTIVITY))
const base=process.env.GRAMMAR_TEST_URL??'http://127.0.0.1:5183'
const evidence=process.env.GRAMMAR_QA_DIR??join(tmpdir(),'grammar-presentation-extension-qa')
mkdirSync(evidence,{recursive:true})
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']})
const results=[],errors=[]
try {
 const context=await browser.newContext({viewport:{width:1440,height:1100}})
 await context.addCookies([{name:'clairfle-fiche-access',value:'admin',url:base}])
 const page=await context.newPage();page.setDefaultTimeout(60000)
 page.on('pageerror',e=>errors.push(e.message))
 const choose=async(label,value)=>{
  const button=page.getByRole('button',{name:label,exact:true});await button.waitFor()
  if(await button.locator('.select-control-value').textContent()===value)return
  await button.click();await page.getByRole('option',{name:value,exact:true}).click()
 }
 const open=async()=>{
  await page.goto(base+'/generateur',{waitUntil:'domcontentloaded',timeout:120000})
  await choose('Domaine','Grammaire');await choose('Thème','Se présenter')
 }
 const configure=async(b,p,count)=>{
  await choose('Sous-thème',resolveGramSubthemeAll(b.topic,b.activityId).label)
  await choose('Type d’exercice',types.find(t=>t.id===b.activityId).label)
  await choose('Niveau de grammaire','A1 — pilote')
  if(b.presentations.includes('choice')&&b.presentations.includes('gap'))await page.getByRole('button',{name:p==='choice'?'QCM':'Lacune',exact:true}).click()
  const label=p==='document-set'?'Nombre de textes':p==='scenario-set'?'Nombre de situations':'Nombre de questions'
  const input=page.getByLabel(label,{exact:true});await input.fill(String(count));await input.blur()
  const expected=p==='document-set'?b.units.slice(0,count).reduce((n,u)=>n+u.questions.length,0):count
  await page.waitForFunction(({expected,reading})=>document.querySelectorAll(reading?'.a4-frame .grammar-reading-question':'.a4-frame .layout-grammar').length===expected,{expected,reading:p==='document-set'})
  await page.evaluate(()=>document.fonts.ready)
 }
 const mediaReady=async()=>{
  await page.waitForFunction(()=>!document.querySelector('.grammar-media-status'),null,{timeout:120000})
  assert.equal(await page.locator('.grammar-media-error').count(),0)
  await page.locator('.grammar-support-image img').evaluateAll(imgs=>Promise.all(imgs.map(i=>i.decode())))
 }
 await open()
 for(const b of banks)for(const p of b.presentations) {
  await page.emulateMedia({media:'screen'});const count=p==='document-set'?20:50
  await configure(b,p,count);await mediaReady()
  assert.equal(await page.locator('.a4-frame .grammar-production-model,.a4-frame .grammar-form-model,.a4-frame .grammar-rubric,.a4-frame .grammar-explanation,.a4-frame .grammar-model-label').count(),0,'No correction in the student preview')
  if(b.activityId.endsWith('infos-perso')) {
   assert.equal(await page.locator('.a4-frame .grammar-personal-gap').count(),50)
   assert.equal(await page.locator('.a4-frame .grammar-choices').count(),0)
  }
  if(b.activityId.endsWith('formulaire')) {
   assert.equal(await page.locator('.a4-frame .grammar-form').count(),50)
   assert.equal(await page.locator('.a4-frame .grammar-form-field').count(),b.units.reduce((n,u)=>n+u.fields.length,0))
  }
  if(b.subthemeId==='a3') {
   assert((await page.locator('.a4-frame .grammar-agreement-hint').count())>=50)
   const colors=await page.locator('.a4-frame .grammar-agreement-hint').first().evaluate(e=>({hint:getComputedStyle(e).color,parent:getComputedStyle(e.parentElement).color}))
   assert.notEqual(colors.hint,colors.parent)
  }
  if(b.activityId.endsWith('fam-faire-part')) {
   assert((await page.locator('.a4-frame .grammar-reading-image-left').count())>=20)
   const lucas=page.locator('.a4-frame [data-document-id="famille-faire-part-lucas"]').first()
   assert((await lucas.locator('.grammar-reading-text').innerText()).includes('Julie et Thomas annoncent'))
   const box=await lucas.locator('.grammar-reading-image-left').evaluate(e=>({image:e.querySelector('.grammar-support-images').getBoundingClientRect().right,text:e.querySelector('.grammar-reading-text').getBoundingClientRect().left}))
   assert(box.image<box.text)
  }
  await page.emulateMedia({media:'print'});await mediaReady()
  const boxes=await page.locator('.print-only-sheets .worksheet-sheet').evaluateAll(ss=>ss.filter(s=>s.getBoundingClientRect().height>0).map(s=>{
   const r=s.getBoundingClientRect(),body=s.querySelector('.sheet-body').getBoundingClientRect(),footer=s.querySelector('.doc-footer').getBoundingClientRect()
   return {height:r.height,bodyBottom:body.bottom,footerTop:footer.top,items:[...s.querySelectorAll('.exercise-item')].map(i=>({bottom:i.getBoundingClientRect().bottom,text:i.innerText.slice(0,130)})),wide:[...s.querySelectorAll('.grammar-question')].filter(e=>e.scrollWidth>e.clientWidth+2).map(e=>e.className)}
  }))
  writeFileSync(join(evidence,`${b.activityId}-${p}-bounds.json`),JSON.stringify(boxes,null,2))
  for(const box of boxes){assert(Math.abs(box.height-1122.52)<3);assert(box.items.every(i=>i.bottom<=box.bodyBottom+2&&i.bottom<=box.footerTop+2),`Overflow ${b.activityId}/${p}: ${JSON.stringify(box)}`);assert.deepEqual(box.wide,[])}
  const responses=p==='document-set'?b.units.reduce((n,u)=>n+u.questions.length,0):50
  assert.equal(await page.locator(p==='document-set'?'.print-only-sheets .grammar-reading-question':'.print-only-sheets .layout-grammar').count(),responses*2)
  const images=await page.locator('.print-only-sheets .grammar-support-image img').count()
  results.push({activity:b.activityId,presentation:p,printedResponses:responses*2,sheets:boxes.length,images,overflow:false})
  console.log(`${b.activityId}/${p}: ${responses*2} réponses, ${boxes.length} feuilles A4 vérifiées.`)
 }
 await page.emulateMedia({media:'screen'})
 for(const id of ['gram-ex-a1-infos-perso','gram-ex-a1-formulaire','gram-ex-a1-ecrire-question','gram-ex-a1-po-images','gram-ex-a1-curriculum-s','gram-ex-a1-ce-texte','gram-ex-a3-nat-image','gram-ex-a3-nat-accorder','gram-ex-a3-nat-pluriel','gram-ex-famille-fam-det','gram-ex-famille-fam-faire-part','gram-ex-famille-fam-photo','gram-ex-famille-fam-email']) {
  const b=banks.find(b=>b.activityId===id);if(!b)continue
  console.log('Lancement tableau : '+id)
  await configure(b,b.presentations[0],1);await mediaReady()
  await page.getByRole('button',{name:/^Jouer (?:avec la classe|cette fiche)$/}).click();await page.waitForURL('**/interactif**')
  await page.getByRole('button',{name:/Commencer la séance/}).waitFor({timeout:120000})
  const content=page.getByRole('button',{name:/^Contenu\b/})
  if(await content.count())await content.click()
  const children=b.presentations[0]==='document-set'?b.units[0].questions.length:1
  assert.equal(await page.locator('.ci-question-list fieldset > label').count(),children)
  const close=page.getByRole('button',{name:'Fermer · Contenu',exact:true})
  if(await close.count())await close.click()
  await page.getByRole('button',{name:/Commencer la séance/}).click();await page.locator('.ci-question-prompt').waitFor();await mediaReady()
  assert.equal(await page.locator('.ci-answer').count(),b.presentations[0]==='choice'||b.presentations[0]==='document-set'?3:0)
  if(['gram-ex-a3-nat-image','gram-ex-a3-nat-accorder','gram-ex-famille-fam-det'].includes(id))assert.equal(await page.locator('.ci-word-blank > span').first().innerText(),'___')
  results.push({activity:id,classroom:true,gameQuestions:children,status:'passed'})
  await open()
 }
 assert.deepEqual(errors,[])
 const report={status:'passed',offerings:results.filter(r=>r.printedResponses).length,printedResponses:results.reduce((n,r)=>n+(r.printedResponses??0),0),classroomLaunches:results.filter(r=>r.classroom).length,results,errors}
 writeFileSync(join(evidence,'presentation-extension-browser-result.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({status:report.status,offerings:report.offerings,printedResponses:report.printedResponses,classroomLaunches:report.classroomLaunches,errors}))
}finally{await browser.close()}
