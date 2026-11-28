import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {mkdirSync,writeFileSync} from 'node:fs'
import {join} from 'node:path'
const require=createRequire(import.meta.url),{chromium}=require('playwright')
const {load,root}=require('../../scripts/gattegno-loader.cjs')
const {GRAMMAR_PILOT_BANKS}=load(root+'/src/grammaire/curriculum/registry.ts')
const {resolveGramSubthemeAll,buildGrammairePracticeTypes}=load(root+'/src/grammaire/exercises/catalog-exercises.ts')
const types=buildGrammairePracticeTypes()
const subthemes=(process.env.GRAMMAR_QA_SUBTHEMES??'futur-proche,futur-simple,futur-proche-ou-simple,futur-anterieur,hypothese-futur').split(',')
const banks=GRAMMAR_PILOT_BANKS.filter(b=>b.topic==='gram-avenir'&&subthemes.includes(b.subthemeId))
const base=process.env.GRAMMAR_TEST_URL??'http://127.0.0.1:5191'
const evidence=process.env.GRAMMAR_QA_DIR??join(root,'docs/grammaire/implementation/avenir-20261124-proofs')
mkdirSync(evidence,{recursive:true})
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']})
const results=[],errors=[],layoutFailures=[]
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
  await choose('Domaine','Grammaire');await choose('Thème',"Parler de l’avenir");const count=page.getByLabel('Nombre de questions',{exact:true});if(await count.count()){await count.fill('1');await count.blur()}
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
  try {
  await page.emulateMedia({media:'screen'});await open();const count=p==='document-set'?20:50
  await configure(b,p,count);await mediaReady()
  assert.equal(await page.locator('.a4-frame .grammar-production-model,.a4-frame .grammar-form-model,.a4-frame .grammar-rubric,.a4-frame .grammar-explanation,.a4-frame .grammar-model-label').count(),0,'No correction in the student preview')
  if(p==='gap'){const widths=await page.locator('.a4-frame .grammar-answer-inline').evaluateAll(nodes=>nodes.map(n=>parseFloat(getComputedStyle(n).minWidth)));assert.equal(widths.length,50);assert(widths.every(w=>w>=283))}
  if(p==='open-written')assert.equal(await page.locator('.a4-frame .grammar-production-lines .answer-line-field').count(),b.units.reduce((n,u)=>n+u.writeLines,0))
  await page.emulateMedia({media:'print'});await mediaReady()
  const boxes=await page.locator('.print-only-sheets .worksheet-sheet').evaluateAll(ss=>ss.filter(s=>s.getBoundingClientRect().height>0).map(s=>{
   const r=s.getBoundingClientRect(),body=s.querySelector('.sheet-body').getBoundingClientRect(),footer=s.querySelector('.doc-footer').getBoundingClientRect()
   return {height:r.height,bodyBottom:body.bottom,footerTop:footer.top,items:[...s.querySelectorAll('.exercise-item')].map(i=>({support:Boolean(i.querySelector('.grammar-reading-support')),top:i.getBoundingClientRect().top,height:i.getBoundingClientRect().height,bottom:i.getBoundingClientRect().bottom,text:i.innerText.slice(0,130)})),wide:[...s.querySelectorAll('.grammar-question')].filter(e=>e.scrollWidth>e.clientWidth+2).map(e=>e.className)}
  }))
  writeFileSync(join(evidence,`${b.activityId}-${b.level}-${p}-bounds.json`),JSON.stringify(boxes,null,2))
  for(const box of boxes){assert(Math.abs(box.height-1122.52)<3);assert(box.items.every(i=>i.bottom<=box.bodyBottom+2&&i.bottom<=box.footerTop+2),`Overflow ${b.activityId}/${p}: ${JSON.stringify(box)}`);assert.deepEqual(box.wide,[])}
  if(boxes.length%2===0&&boxes.every(box=>box.items.length===boxes[0].items.length))for(const part of [boxes.slice(0,boxes.length/2),boxes.slice(boxes.length/2)]){
   const first=part[0],available=first.footerTop-first.items[0].top,number=first.items.length,all=part.flatMap(box=>box.items),heights=all.map(i=>i.height).sort((a,b)=>b-a),gaps=first.items.slice(1).reduce((sum,item,index)=>sum+item.top-first.items[index].bottom,0),worst=(p==='document-set'?first.items.reduce((sum,item)=>sum+Math.max(...all.filter(i=>i.support===item.support).map(i=>i.height)),0):heights.slice(0,number).reduce((a,b)=>a+b,0))+gaps
   assert(worst<=available+2,`A4 first-page budget ${b.activityId}/${b.level}/${p}: ${worst} > ${available}`)
  }
  const responses=p==='document-set'?b.units.reduce((n,u)=>n+u.questions.length,0):50
  assert.equal(await page.locator(p==='document-set'?'.print-only-sheets .grammar-reading-question':'.print-only-sheets .layout-grammar').count(),responses*2)
  if((p==='choice'||p==='gap')){const elisions=await page.locator('.print-only-sheets .grammar-answer-inline').evaluateAll(nodes=>nodes.filter(n=>n.textContent.endsWith('’')).map(n=>n.classList.contains('is-attached')));assert(elisions.every(Boolean),'Elided answers are visibly attached to the following word')}
  const images=await page.locator('.print-only-sheets .grammar-support-image img').count()
  results.push({activity:b.activityId,level:b.level,presentation:p,printedResponses:responses*2,printedAnswerFields:(p==='match'?b.units.reduce((n,u)=>n+u.pairs.length,0):responses)*2,sheets:boxes.length,images,overflow:false})
  console.log(`${b.activityId}/${b.level}/${p}: ${responses*2} unités, ${boxes.length} feuilles A4 vérifiées.`)
  }catch(error){layoutFailures.push({activity:b.activityId,level:b.level,presentation:p,error:error.message});console.error(`${b.activityId}/${b.level}/${p}: ${error.message}`)}
 }
 writeFileSync(join(evidence,'layout-failures.json'),JSON.stringify(layoutFailures,null,2)+'\n')
 assert.deepEqual(layoutFailures,[])
 assert.deepEqual(errors,[])
 const report={status:'passed',printedMetric:'Rendered question units; a matching unit contains two answer fields.',printedAnswerFields:results.reduce((n,r)=>n+(r.printedAnswerFields??0),0),offerings:results.filter(r=>r.printedResponses).length,printedResponses:results.reduce((n,r)=>n+(r.printedResponses??0),0),results,errors}
 writeFileSync(join(evidence,'avenir-browser-result.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({status:report.status,offerings:report.offerings,printedResponses:report.printedResponses,errors}))
}catch(error){for(const context of browser.contexts())for(const page of context.pages())await page.screenshot({path:join(evidence,'full-bank-failure.png')});throw error}finally{await browser.close()}
