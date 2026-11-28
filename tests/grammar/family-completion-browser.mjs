import assert from 'node:assert/strict'
import {gameControl} from '../interactive/browser-actions.mjs'
import {createRequire} from 'node:module'
import {mkdirSync,writeFileSync} from 'node:fs'
import {join} from 'node:path'
const require=createRequire(import.meta.url),{chromium}=require('playwright')
const {load,root}=require('../../scripts/gattegno-loader.cjs')
const {GRAMMAR_PILOT_BANKS}=load(root+'/src/grammaire/curriculum/registry.ts')
const {resolveGramSubthemeAll,buildGrammairePracticeTypes}=load(root+'/src/grammaire/exercises/catalog-exercises.ts')
const types=buildGrammairePracticeTypes()
const banks=GRAMMAR_PILOT_BANKS.filter(b=>['gram-ex-famille-curriculum-a','gram-ex-famille-curriculum-p','gram-ex-famille-fam-pe'].includes(b.activityId))
const base=process.env.GRAMMAR_TEST_URL??'http://127.0.0.1:5183'
const evidence=process.env.GRAMMAR_QA_DIR??join(root,'docs/grammaire/implementation/famille-20261122-proofs')
mkdirSync(evidence,{recursive:true})
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']})
const results=[],errors=[]
try {
 const context=await browser.newContext({viewport:{width:1440,height:1100},hasTouch:true})
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
  assert.equal(await page.getByRole('button',{name:'Niveau de grammaire',exact:true}).locator('.select-control-value').innerText(),'A1')
  await page.getByRole('button',{name:'Niveau de grammaire',exact:true}).click();assert.deepEqual(await page.getByRole('option').allTextContents(),['A1']);await page.keyboard.press('Escape')
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
  if(p==='match')assert.equal(await page.locator('.a4-frame .grammar-profile-facts').count(),50)
  if(p==='open-written')assert.equal(await page.locator('.a4-frame .grammar-production-lines .answer-line-field').count(),300)
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
 for(const b of banks) {
  await configure(b,b.presentations[0],1);await mediaReady()
  await page.getByRole('button',{name:/^Jouer (?:avec la classe|cette fiche)$/}).click();await page.waitForURL('**/interactif**')
  await page.locator('.ci-launch:enabled').waitFor({timeout:120000});await page.locator('.ci-launch').click();await page.locator('.ci-question-prompt').waitFor()
  assert.equal(await page.locator('.ci-answer').count(),0);assert.equal(await page.locator('.ci-model-answer').count(),0)
  if(b.presentations[0]==='match'){
   await page.locator('.ci-word-sorting').waitFor()
   const names=await page.locator('[data-ci-sort-word] b').allTextContents(),unit=b.units.find(u=>u.pairs.length===names.length&&u.pairs.every(p=>names.includes(p.left)));assert(unit)
   assert.equal(await page.locator('.ci-sort-columns > section').count(),names.length)
   assert((await page.locator('.ci-context').innerText()).includes(unit.prompt.split('\n')[1]))
   assert.equal(await page.locator('.ci-sort-review').count(),0)
   const first=page.locator('[data-ci-sort-word="0"]'),label=unit.pairs.find(p=>p.left===names[0]).right
   const destination=page.getByRole('button',{name:`Déposer dans ${label}`,exact:true})
   await first.scrollIntoViewIfNeeded();const from=await first.boundingBox(),to=await destination.boundingBox()
   await page.mouse.move(from.x+from.width/2,from.y+from.height/2);await page.mouse.down();await page.mouse.move(from.x+from.width/2+14,from.y+from.height/2+14,{steps:3});await page.mouse.move(to.x+to.width/2,to.y+to.height/2,{steps:12});await page.mouse.up()
   assert.equal(await page.locator('.ci-sort-pool .ci-sort-word').count(),names.length-1)
   for(let i=1;i<names.length;i++){await page.locator(`[data-ci-sort-word="${i}"]`).focus();await page.keyboard.press('Enter');await page.getByRole('button',{name:`Déposer dans ${unit.pairs.find(p=>p.left===names[i]).right}`,exact:true}).click()}
   assert.equal(await page.locator('.ci-sort-pool .ci-sort-word').count(),0)
   await gameControl(page,'Annuler le classement').click();assert.equal(await page.locator('.ci-sort-pool .ci-sort-word').count(),1)
   await page.locator(`[data-ci-sort-word="${names.length-1}"]`).click();await page.getByRole('button',{name:`Déposer dans ${unit.pairs.find(p=>p.left===names.at(-1)).right}`,exact:true}).click()
   await gameControl(page,'Quitter la séance').click();await page.locator('.ci-launch:enabled').waitFor();await page.reload();await page.locator('.ci-launch:enabled').waitFor({timeout:120000});await page.locator('.ci-launch').click();await page.locator('.ci-word-sorting').waitFor()
   assert.equal(await page.locator('.ci-sort-pool .ci-sort-word').count(),0)
   await page.screenshot({path:join(evidence,'associations-tableau.png')})
   await page.setViewportSize({width:390,height:844})
   await page.locator('[data-ci-sort-word="0"]').tap();await gameControl(page,'Déposer dans Mots à classer').tap();assert.equal(await page.locator('.ci-sort-pool .ci-sort-word').count(),1)
   await page.locator('[data-ci-sort-word="0"]').tap();await page.getByRole('button',{name:`Déposer dans ${label}`,exact:true}).tap();assert.equal(await page.locator('.ci-sort-pool .ci-sort-word').count(),0)
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false)
   await page.screenshot({path:join(evidence,'associations-mobile.png')})
   await page.setViewportSize({width:1440,height:1100})
   for(const name of ['Commencer l’échange','Discuter','Enseignant : révéler'])await gameControl(page,name).click()
   await page.locator('.ci-sort-review').waitFor();assert((await page.locator('.ci-sort-review').innerText()).includes(`${names.length} / ${names.length}`))
   assert((await page.locator('.ci-model-answer').innerText()).includes('→'))
   results.push({activity:b.activityId,classroom:true,gameQuestions:1,people:names.length,completeProblem:true,nativeMouseDrag:true,nativeTouch:true,keyboard:true,undo:true,resume:true,privateBeforeReveal:true,status:'passed'})
  }else{
   assert((await page.locator('.ci-question-prompt').innerText()).includes('Famille'))
   assert.equal(await page.locator('.ci-sort-word').count(),0)
   results.push({activity:b.activityId,classroom:true,gameQuestions:1,humanAssessment:true,privateBeforeReveal:true,status:'passed'})
   await page.screenshot({path:join(evidence,b.presentations[0]+'-tableau.png')})
  }
  await open()
 }

 assert.deepEqual(errors,[])
 const report={status:'passed',offerings:results.filter(r=>r.printedResponses).length,printedResponses:results.reduce((n,r)=>n+(r.printedResponses??0),0),classroomLaunches:results.filter(r=>r.classroom).length,results,errors}
 writeFileSync(join(evidence,'family-completion-browser-result.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({status:report.status,offerings:report.offerings,printedResponses:report.printedResponses,classroomLaunches:report.classroomLaunches,errors}))
}finally{await browser.close()}
