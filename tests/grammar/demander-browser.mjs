import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {mkdirSync,writeFileSync} from 'node:fs'
import {join} from 'node:path'
const require=createRequire(import.meta.url),{chromium}=require('playwright')
const {load,root}=require('../../scripts/gattegno-loader.cjs')
const {GRAMMAR_PILOT_BANKS}=load(root+'/src/grammaire/curriculum/registry.ts')
const {resolveGramSubthemeAll,buildGrammairePracticeTypes}=load(root+'/src/grammaire/exercises/catalog-exercises.ts')
const types=buildGrammairePracticeTypes()
const banks=GRAMMAR_PILOT_BANKS.filter(b=>b.topic==='gram-demander')
const base=process.env.GRAMMAR_TEST_URL??'http://127.0.0.1:5183'
const evidence=process.env.GRAMMAR_QA_DIR??join(root,'docs/grammaire/implementation/demander-20261123-proofs')
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
  await choose('Domaine','Grammaire');await choose('Thème',"Demander et proposer")
 }
 const configure=async(b,p,count)=>{
  await choose('Sous-thème',resolveGramSubthemeAll(b.topic,b.activityId).label)
  await choose('Type d’exercice',types.find(t=>t.id===b.activityId).label)
  await choose('Niveau de grammaire',b.level)
  assert.equal(await page.getByRole('button',{name:'Niveau de grammaire',exact:true}).locator('.select-control-value').innerText(),b.level)
  await page.getByRole('button',{name:'Niveau de grammaire',exact:true}).click();assert.deepEqual(await page.getByRole('option').allTextContents(),banks.filter(v=>v.activityId===b.activityId).map(v=>v.level));await page.keyboard.press('Escape')
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
  if(p==='match'){
   assert.equal(await page.locator('.a4-frame .grammar-profile-facts').count(),50)
   const labels=await page.locator('.a4-frame .grammar-match-option-letter').allTextContents()
   assert.equal(labels.length,100);assert(labels.every((label,index)=>label===(index%2?'B.':'A.')))
  }
  if(p==='open-written')assert.equal(await page.locator('.a4-frame .grammar-production-lines .answer-line-field').count(),b.units.reduce((n,u)=>n+u.writeLines,0))
  await page.emulateMedia({media:'print'});await mediaReady()
  const boxes=await page.locator('.print-only-sheets .worksheet-sheet').evaluateAll(ss=>ss.filter(s=>s.getBoundingClientRect().height>0).map(s=>{
   const r=s.getBoundingClientRect(),body=s.querySelector('.sheet-body').getBoundingClientRect(),footer=s.querySelector('.doc-footer').getBoundingClientRect()
   return {height:r.height,bodyBottom:body.bottom,footerTop:footer.top,items:[...s.querySelectorAll('.exercise-item')].map(i=>({bottom:i.getBoundingClientRect().bottom,text:i.innerText.slice(0,130)})),wide:[...s.querySelectorAll('.grammar-question')].filter(e=>e.scrollWidth>e.clientWidth+2).map(e=>e.className)}
  }))
  writeFileSync(join(evidence,`${b.activityId}-${b.level}-${p}-bounds.json`),JSON.stringify(boxes,null,2))
  for(const box of boxes){assert(Math.abs(box.height-1122.52)<3);assert(box.items.every(i=>i.bottom<=box.bodyBottom+2&&i.bottom<=box.footerTop+2),`Overflow ${b.activityId}/${p}: ${JSON.stringify(box)}`);assert.deepEqual(box.wide,[])}
  const responses=p==='document-set'?b.units.reduce((n,u)=>n+u.questions.length,0):50
  assert.equal(await page.locator(p==='document-set'?'.print-only-sheets .grammar-reading-question':'.print-only-sheets .layout-grammar').count(),responses*2)
  const images=await page.locator('.print-only-sheets .grammar-support-image img').count()
  results.push({activity:b.activityId,level:b.level,presentation:p,printedResponses:responses*2,printedAnswerFields:(p==='match'?b.units.reduce((n,u)=>n+u.pairs.length,0):responses)*2,sheets:boxes.length,images,overflow:false})
  console.log(`${b.activityId}/${b.level}/${p}: ${responses*2} unités, ${boxes.length} feuilles A4 vérifiées.`)
 }
 await page.emulateMedia({media:'screen'})
 for(const b of banks)for(const presentation of b.presentations) {
  await configure(b,presentation,1)
  await page.getByRole('button',{name:/^Jouer (?:avec la classe|cette fiche)$/}).click();await page.waitForURL('**/interactif**')
  await page.locator('.ci-launch:enabled').waitFor({timeout:120000});await page.locator('.ci-launch').click();await page.locator('.ci-question-prompt').waitFor()
  assert.equal(await page.locator('.ci-model-answer').count(),0)
  if(presentation==='match'){
   await page.locator('.ci-word-sorting').waitFor()
   const phrases=await page.locator('[data-ci-sort-word] b').allTextContents()
   const unit=b.units.find(u=>u.kind==='match'&&u.pairs.length===phrases.length&&u.pairs.every(p=>phrases.includes(p.left)));assert(unit)
   assert((await page.locator('.ci-context').innerText()).includes(unit.prompt))
   assert.equal(await page.locator('.ci-sort-review').count(),0)
   for(let index=0;index<phrases.length;index++){
    const word=page.locator(`[data-ci-sort-word="${index}"]`),label=unit.pairs.find(p=>p.left===phrases[index]).right
    if(index===0){
     const target=page.getByRole('button',{name:`Déposer dans ${label}`,exact:true});await word.scrollIntoViewIfNeeded()
     const a=await word.boundingBox(),z=await target.boundingBox();assert(a&&z)
     await page.mouse.move(a.x+a.width/2,a.y+a.height/2);await page.mouse.down();await page.mouse.move(z.x+z.width/2,z.y+z.height/2,{steps:12});await page.mouse.up()
    }else{await word.tap();await page.getByRole('button',{name:`Déposer dans ${label}`,exact:true}).tap()}
   }
   assert.equal(await page.locator('.ci-sort-pool .ci-sort-word').count(),0)
  }
  if(b.presentations.includes('document-set')){await page.locator('.ci-context').waitFor();assert((await page.locator('.ci-context').innerText()).length>100)}
  if(b.presentations.includes('order')){
   const tokens=page.locator('.ci-word-sequence [data-ci-order-zone]');assert(await tokens.count()>2)
   const before=await tokens.locator('b').allTextContents();await tokens.nth(0).focus();await page.keyboard.press('ArrowRight');
   assert.notDeepEqual(await tokens.locator('b').allTextContents(),before)
  }
  if(['gram-ex-f1-curriculum-a','gram-ex-f2-curriculum-s','gram-ex-f3-curriculum-a'].includes(b.activityId))await page.screenshot({path:join(evidence,b.activityId+'-'+b.level+'-tableau.png')})
  results.push({activity:b.activityId,level:b.level,presentation,classroom:true,privateBeforeReveal:true,status:'passed'})
  await open()
 }
 assert.deepEqual(errors,[])
 const report={status:'passed',printedMetric:'Rendered question units; a matching unit contains two answer fields.',printedAnswerFields:results.reduce((n,r)=>n+(r.printedAnswerFields??0),0),offerings:results.filter(r=>r.printedResponses).length,printedResponses:results.reduce((n,r)=>n+(r.printedResponses??0),0),classroomLaunches:results.filter(r=>r.classroom).length,results,errors}
 writeFileSync(join(evidence,'demander-browser-result.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({status:report.status,offerings:report.offerings,printedResponses:report.printedResponses,classroomLaunches:report.classroomLaunches,errors}))
}finally{await browser.close()}
