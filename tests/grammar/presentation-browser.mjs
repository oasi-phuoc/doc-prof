import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {mkdirSync,writeFileSync} from 'node:fs'
import {tmpdir} from 'node:os'
import {join} from 'node:path'
const require=createRequire(import.meta.url),{chromium}=require('playwright')
const {load,root}=require('../../scripts/gattegno-loader.cjs')
const {GRAMMAR_PILOT_BANKS}=load(root+'/src/grammaire/curriculum/registry.ts')
const {resolveGramSubthemeAll}=load(root+'/src/grammaire/exercises/catalog-exercises.ts')
const banks=GRAMMAR_PILOT_BANKS.filter(b=>b.topic==='gram-se-presenter'&&['a2','a6'].includes(b.subthemeId)&&(!process.env.GRAMMAR_QA_ACTIVITY||b.activityId===process.env.GRAMMAR_QA_ACTIVITY))
const base=process.env.GRAMMAR_TEST_URL??'http://127.0.0.1:5183'
const evidence=process.env.GRAMMAR_QA_DIR??join(tmpdir(),'grammar-presentation-qa')
mkdirSync(evidence,{recursive:true})
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']})
const results=[],errors=[]
try {
 const context=await browser.newContext({viewport:{width:1440,height:1100}})
 await context.addCookies([{name:'clairfle-fiche-access',value:'admin',url:base}])
 const page=await context.newPage();page.setDefaultTimeout(60000)
 page.on('pageerror',e=>errors.push(e.message))
 const choose=async(label,option)=>{
  const control=page.getByRole('button',{name:label,exact:true})
  if(await control.locator('.select-control-value').textContent()===option)return
  await control.click();await page.getByRole('option',{name:option,exact:true}).click()
 }
 const open=async()=>{await page.goto(base+'/generateur',{waitUntil:'networkidle',timeout:120000});await choose('Domaine','Grammaire');await choose('Thème','Se présenter')}
 const images=async(selector,count)=>{
  if(!count)return
  await page.waitForFunction(({selector,count})=>{
   if(!document.querySelector(selector)||document.querySelector(`${selector} .grammar-media-error,${selector} .grammar-media-status`))return false
   // Zoom dialogs contain a second, hidden copy of each classroom image.
   const all=[...document.querySelectorAll(`${selector} .grammar-support-image img`)].filter(i=>!i.closest('dialog'));return all.length===count&&all.every(i=>i.complete&&i.naturalWidth>0)
  },{selector,count},{timeout:120000})
 }
 const configure=async(b,p,count)=>{
  await choose('Sous-thème',resolveGramSubthemeAll(b.topic,b.activityId).label)
  // The new matching/transform types use their editorial label; legacy labels are retained.
  await choose('Type d’exercice',b.label)
  if(await page.getByLabel('Niveau de grammaire',{exact:true}).locator('.select-control-value').textContent()!=='A1 — pilote')await choose('Niveau de grammaire','A1 — pilote')
  if(b.presentations.length>1)await page.getByRole('button',{name:p==='choice'?'QCM':'Lacune',exact:true}).click()
  const field=page.getByLabel('Nombre de questions',{exact:true});await field.fill(String(count));await field.blur()
  await page.waitForFunction(n=>document.querySelectorAll('.a4-frame .layout-grammar').length===n,count)
 }
 await open()
 for(const b of banks)for(const p of b.presentations) {
  await page.emulateMedia({media:'screen'});await configure(b,p,50)
  const per=b.units[0].imageSupports?.length??0
  await images('.a4-frame',50*per)
  assert.equal(await page.locator('.a4-frame .grammar-production-model,.a4-frame .grammar-explanation,.a4-frame .grammar-rubric').count(),0)
  if(b.activityId.endsWith('prov-prep')) {
   assert.equal(await page.locator('.a4-frame .grammar-country-hint').count(),50)
   const colors=await page.locator('.a4-frame .grammar-country-hint').first().evaluate(e=>({hint:getComputedStyle(e).color,body:getComputedStyle(e.parentElement).color}))
   assert.notEqual(colors.hint,colors.body,'Gender clue is colored')
  }
  await page.emulateMedia({media:'print'});await images('.print-only-sheets',100*per)
  const boxes=await page.locator('.print-only-sheets .worksheet-sheet').evaluateAll(ss=>ss.filter(s=>s.getBoundingClientRect().height>0).map(s=>{
   const r=s.getBoundingClientRect(),body=s.querySelector('.sheet-body').getBoundingClientRect(),footer=s.querySelector('.doc-footer').getBoundingClientRect()
   return {height:r.height,bodyBottom:body.bottom,footerTop:footer.top,items:[...s.querySelectorAll('.exercise-item')].map(i=>({bottom:i.getBoundingClientRect().bottom,text:i.innerText.slice(0,95)})),wide:[...s.querySelectorAll('.grammar-question')].filter(e=>e.scrollWidth>e.clientWidth+2).map(e=>e.className)}
  }))
  writeFileSync(join(evidence,`${b.activityId}-${p}-bounds.json`),JSON.stringify(boxes,null,2))
  const worst=boxes.reduce((a,b,i)=>Math.max(...b.items.map(x=>x.bottom-b.bodyBottom))>a.over?{index:i,over:Math.max(...b.items.map(x=>x.bottom-b.bodyBottom))}:a,{index:0,over:0})
  if(worst.over>2)await page.locator('.print-only-sheets .worksheet-sheet').nth(worst.index).screenshot({path:join(evidence,'overflow.png')})
  for(const box of boxes){assert(Math.abs(box.height-1122.52)<3);assert(box.items.every(i=>i.bottom<=box.bodyBottom+2&&i.bottom<=box.footerTop+2),`Clipped ${b.activityId}/${p}: ${JSON.stringify(box)}; max overflow=${worst.over}`);assert.deepEqual(box.wide,[])}
  assert.equal(await page.locator('.print-only-sheets .layout-grammar').count(),100)
  results.push({activity:b.activityId,presentation:p,printedQuestions:100,sheets:boxes.length,images:100*per,overflow:false})
  console.log(`${b.activityId}/${p} : 100 unités imprimées, ${100*per} images chargées, ${boxes.length} feuilles sans débordement.`)
 }
 await page.emulateMedia({media:'screen'})
 for(const id of ['gram-ex-a2-curriculum-a','gram-ex-a2-curriculum-t','gram-ex-a6-prov-pays','gram-ex-a6-prov-prep','gram-ex-a6-prov-phrases','gram-ex-a6-curriculum-p']) {
  const b=banks.find(b=>b.activityId===id);if(!b)continue;await configure(b,b.presentations[0],3)
  console.log('Lancement tableau : '+id)
  await images('.a4-frame',3*(b.units[0].imageSupports?.length??0))
  if(id.endsWith('prov-phrases'))await page.locator('.a4-frame').first().screenshot({path:join(evidence,'a6-two-images-a1.png')})
  await page.getByRole('button',{name:'Jouer avec la classe',exact:true}).click();await page.waitForURL('**/interactif**')
  const start=page.getByRole('button',{name:/Commencer la séance/});await start.waitFor({timeout:120000})
  const matching=id.endsWith('curriculum-a');assert.equal(await page.locator('.ci-question-list fieldset > label').count(),matching?9:3)
  await start.click();await page.locator('.ci-question-prompt').waitFor()
  const interactiveImages=b.units[0].imageSupports?.length??0
  await images('.ci-question',interactiveImages)
  if(id.endsWith('prov-prep'))assert.equal(await page.locator('.ci-question-prompt .grammar-country-hint').count(),1)
  assert.equal(await page.locator('.ci-answer').count(),matching||b.presentations[0]==='choice'?3:0)
  results.push({activity:id,classroom:true,sourceProblems:3,gameQuestions:matching?9:3,images:interactiveImages,status:'passed'})
  await open()
 }
 assert.deepEqual(errors,[])
 writeFileSync(join(evidence,'presentation-browser-result.json'),JSON.stringify({status:'passed',results,errors},null,2))
 console.log(JSON.stringify({status:'passed',offerings:results.filter(x=>x.printedQuestions).length,classroomLaunches:results.filter(x=>x.classroom).length,errors}))
}finally{await browser.close()}
