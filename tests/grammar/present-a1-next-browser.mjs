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
  await choose('Domaine','Grammaire');await choose('Thème','Conjuguer au présent')
 }
 await open()
 for(const [sub,subLabel,qLabel] of [
  ['modaux','Verbes modaux','Conjuguer les trois verbes'],['pronominaux','Verbes pronominaux','Conjuguer avec le pronom'],
  ['a8','La négation ne … pas','Former la négation'],['a9','Autres négations','Choisir une autre négation'],
 ]) {
  if(process.env.GRAMMAR_A1_SUBTHEMES&&!process.env.GRAMMAR_A1_SUBTHEMES.split(',').includes(sub))continue
  await choose('Sous-thème',subLabel);await choose('Type d’exercice',qLabel)
  const level=page.getByLabel('Niveau de grammaire',{exact:true}).locator('.select-control-value')
  assert.equal(await level.textContent(),'Banque actuelle')
  const offers=[['choice',qLabel],['gap',qLabel],['order','Mots dans l’ordre']]
  if(sub!=='a9')offers.push(['correct','Corriger l’erreur'])
  if(['pronominaux','a8'].includes(sub))offers.push(['transform','Transformer une phrase'])
  if(sub==='pronominaux')offers.push(['open-oral','S’exprimer à l’oral'])
  if(sub==='modaux')offers.push(['open-written','Écrire une phrase utile'],['open-oral','Dire une phrase utile'],['scenario-set','Jouer une situation'],['document-set','Lire une situation'])
  for(const [presentation,label] of offers) {
   if(process.env.GRAMMAR_A1_PRESENTATIONS&&!process.env.GRAMMAR_A1_PRESENTATIONS.split(',').includes(presentation))continue
   await page.emulateMedia({media:'screen'});await choose('Type d’exercice',label)
   if(await level.textContent()!=='A1 — pilote')await choose('Niveau de grammaire','A1 — pilote')
   if(['choice','gap'].includes(presentation))await page.getByRole('button',{name:presentation==='choice'?'QCM':'Lacune',exact:true}).click()
   if(presentation==='order')await page.getByRole('group',{name:'Forme des phrases',exact:true}).getByRole('button',{name:['a8','a9'].includes(sub)?'Négative':'Positive',exact:true}).click()
   const input=page.getByLabel(presentation==='document-set'?'Nombre de textes':presentation==='scenario-set'?'Nombre de situations':'Nombre de questions',{exact:true})
   await input.fill(presentation==='document-set'?'20':'50');await input.blur()
   try {
    await page.waitForFunction(({reading})=>document.querySelectorAll(reading?'.a4-frame .grammar-reading-question':'.a4-frame .layout-grammar').length===(reading?60:50),{reading:presentation==='document-set'})
   } catch(e) {
    console.log(JSON.stringify({sub,presentation,count:await input.inputValue(),maximum:await input.getAttribute('max'),controls:await page.locator('.select-shell').allTextContents(),preview:await page.locator('.a4-frame').first().innerText().catch(()=>''),errors}))
    throw e
   }
   assert.equal(await page.getByRole('button',{name:'Sous-thème',exact:true}).locator('.select-control-value').textContent(),subLabel)
   assert.equal(await page.locator('.a4-frame .grammar-production-model,.a4-frame .grammar-rubric,.a4-frame .grammar-explanation').count(),0)
   if(sub==='a9'&&['choice','gap'].includes(presentation))assert.equal(await page.locator('.a4-frame .grammar-cue').count(),50)
   if(presentation==='scenario-set')assert.equal(await page.locator('.a4-frame .grammar-scenario-open').count(),50)
   await page.emulateMedia({media:'print'})
   const boxes=await page.locator('.print-only-sheets .worksheet-sheet').evaluateAll(sheets=>sheets.filter(s=>s.getBoundingClientRect().height>0).map(s=>{
    const r=s.getBoundingClientRect(),body=s.querySelector('.sheet-body').getBoundingClientRect(),footer=s.querySelector('.doc-footer').getBoundingClientRect()
    return {height:r.height,bodyBottom:body.bottom,footerTop:footer.top,items:[...s.querySelectorAll('.exercise-item')].map(i=>({bottom:i.getBoundingClientRect().bottom,text:i.innerText.slice(0,90)})),wide:[...s.querySelectorAll('.grammar-question')].filter(e=>e.scrollWidth>e.clientWidth+2).map(e=>e.className)}
   }))
   for(const b of boxes) {
    assert(Math.abs(b.height-1122.52)<3)
    assert(b.items.every(i=>i.bottom<=b.bodyBottom+2&&i.bottom<=b.footerTop+2),`Clipped ${sub}/${presentation}: ${JSON.stringify(b)}`)
    assert.deepEqual(b.wide,[])
   }
   const printedQuestions=presentation==='document-set'?120:100
   if(presentation==='document-set')assert.equal(await page.locator('.print-only-sheets .grammar-reading-question').count(),120)
   else assert.equal(await page.locator('.print-only-sheets .layout-grammar').count(),100)
   results.push({sub,level:'A1',presentation,sheets:boxes.length,printedQuestions,overflow:false})
   console.log(`${sub} ${presentation}: ${printedQuestions} questions imprimées, ${boxes.length} feuilles, aucun débordement.`)
  }
  await page.emulateMedia({media:'screen'})
  const boardLabel=sub==='modaux'?'Jouer une situation':sub==='pronominaux'?'S’exprimer à l’oral':sub==='a8'?'Transformer une phrase':qLabel
  await choose('Type d’exercice',boardLabel)
  if(await level.textContent()!=='A1 — pilote')await choose('Niveau de grammaire','A1 — pilote')
  const count=page.getByLabel(sub==='modaux'?'Nombre de situations':'Nombre de questions',{exact:true});await count.fill('3');await count.blur()
  await page.waitForFunction(()=>document.querySelectorAll('.a4-frame .layout-grammar').length===3)
  await page.locator('.a4-frame').first().screenshot({path:join(evidence,`${sub}-a1-next.png`)})
  await page.getByRole('button',{name:'Jouer avec la classe',exact:true}).click();await page.waitForURL('**/interactif**')
  const start=page.getByRole('button',{name:/Commencer la séance/});await start.waitFor({timeout:120000})
  assert.equal(await page.locator('.ci-question-list fieldset > label').count(),3)
  await start.click();await page.locator('.ci-question-prompt').waitFor()
  assert.equal(await page.locator('.ci-answer').count(),sub==='a9'?3:0)
  results.push({sub,classroomLaunch:'passed',selectedQuestions:3,teacherLed:sub!=='a9'})
  await open()
 }
 assert.deepEqual(errors,[])
 writeFileSync(join(evidence,'present-a1-next-browser-result.json'),JSON.stringify({results,errors},null,2))
 console.log(JSON.stringify({status:'passed',results,errors}))
} finally {await browser.close()}
