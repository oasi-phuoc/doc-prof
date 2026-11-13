import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {mkdirSync,writeFileSync} from 'node:fs'
import {tmpdir} from 'node:os'
import {join} from 'node:path'
const require=createRequire(import.meta.url)
const {chromium}=require('playwright')
const {load,root}=require('../../scripts/gattegno-loader.cjs')
const {contractFixture}=load(root+'/tests/grammar/fixtures/contracts.ts')
const {buildFicheRecipe}=load(root+'/src/fiches/recipe.ts')
const base=process.env.GRAMMAR_TEST_URL??'http://127.0.0.1:5183'
const evidence=process.env.GRAMMAR_QA_DIR??join(tmpdir(),'grammar-qa')
mkdirSync(evidence,{recursive:true})
const recipeFor=(name,presentation)=>buildFicheRecipe({pages:[contractFixture(name,presentation)],seed:839,institutional:{},evalMode:false,pointsPerQuestion:1,libreMode:false,libreSnapshot:null})
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']})
const results=[],errors=[]
const newPage=async()=>{
 const context=await browser.newContext({viewport:{width:1440,height:1100}})
 await context.addCookies([{name:'clairfle-fiche-access',value:'admin',url:base}])
 const page=await context.newPage();page.setDefaultTimeout(30000)
 page.on('pageerror',e=>errors.push(e.message))
 return page
}
const openRecipe=async(page,recipe)=>{
 await page.goto(base+'/',{waitUntil:'networkidle',timeout:120000})
 await page.evaluate(recipe=>{
  history.pushState({clairfleFiche:{id:'grammar-technical-fixture',name:'Essai technique de grammaire',recipe}},'','/generateur')
  dispatchEvent(new PopStateEvent('popstate'))
 },recipe)
 await page.locator('.a4-frame .layout-grammar').first().waitFor()
 await page.evaluate(()=>document.fonts.ready)
}
const launch=async(page,total)=>{
 await page.getByRole('button',{name:'Jouer avec la classe',exact:true}).click()
 await page.waitForURL('**/interactif**')
 await page.getByRole('button',{name:/Commencer la séance/}).waitFor({timeout:120000})
 assert.equal(await page.locator('.ci-question-list fieldset > label').count(),total)
 await page.getByRole('button',{name:/Commencer la séance/}).click()
 await page.locator('.ci-question-prompt').waitFor()
}
try {
 for(const [name,presentation,responses] of [['closed',undefined,4],['open',undefined,1],['imageChoice','choice',1],['imageChoice','gap',1],['imageWriting',undefined,1]]) {
  const page=await newPage(),recipe=recipeFor(name,presentation)
  await openRecipe(page,recipe)
  assert.equal(await page.locator('.a4-frame .grammar-rubric,.a4-frame .grammar-production-model,.a4-frame .grammar-explanation').count(),0)
  if(name==='closed')assert.equal(await page.getByLabel('Nombre de situations',{exact:true}).inputValue(),'2')
  if(name==='open') {
   assert.equal(await page.locator('.a4-frame .grammar-scenario-roles li').count(),2)
   assert.equal(await page.locator('.a4-frame .grammar-scenario-follow-ups li').count(),2)
  }
  if(name.startsWith('image')) {
   const image=page.locator('.a4-frame .grammar-support-image img').first()
   await image.waitFor();await image.evaluate(e=>e.decode())
   assert((await image.getAttribute('src')).startsWith('blob:'))
   assert.equal(await image.getAttribute('alt'),'Cinq tomates entières sur un fond blanc.')
   assert.equal(await image.evaluate(e=>e.naturalWidth),1536)
  }
  await page.emulateMedia({media:'print'})
  await page.locator('.print-only-sheets .grammar-support-image img').evaluateAll(images=>Promise.all(images.map(i=>i.decode())))
  if(name.startsWith('image'))assert.equal(await page.locator('.print-only-sheets .grammar-support-image img').count(),2)
  const boxes=await page.locator('.print-only-sheets .worksheet-sheet').evaluateAll(sheets=>sheets.filter(s=>s.getBoundingClientRect().height>0).map(s=>{
   const r=s.getBoundingClientRect(),body=s.querySelector('.sheet-body').getBoundingClientRect(),footer=s.querySelector('.doc-footer').getBoundingClientRect()
   return {height:r.height,bodyBottom:body.bottom,footerTop:footer.top,items:[...s.querySelectorAll('.exercise-item')].map(i=>({bottom:i.getBoundingClientRect().bottom,text:i.innerText.slice(0,130)})),wide:[...s.querySelectorAll('.grammar-question')].filter(e=>e.scrollWidth>e.clientWidth+2).map(e=>e.className)}
  }))
  for(const b of boxes) {
   assert(Math.abs(b.height-1122.52)<3)
   assert(b.items.every(i=>i.bottom<=b.bodyBottom+2&&i.bottom<=b.footerTop+2),`Clipped items: ${JSON.stringify(b)}`)
   assert.deepEqual(b.wide,[])
  }
  assert.equal(await page.locator('.print-only-sheets .layout-grammar:not(:has(.grammar-scenario-support))').count(),responses*2)
  assert.equal(await page.locator('.grammar-media-error').count(),0)
  results.push({case:name,presentation:recipe.pages[0].grammarPresentation,responses,printedResponses:responses*2,sheets:boxes.length,overflow:false})
  await page.emulateMedia({media:'screen'})
  await page.waitForTimeout(200)
  await page.locator('.a4-frame').first().screenshot({path:join(evidence,`contracts-${name}-${presentation??'default'}.png`)})
  if(name==='closed') {
   const before=await page.locator('.a4-frame .grammar-scenario-question').evaluateAll(es=>es.map(e=>e.dataset.scenarioQuestionId))
   let frame
   for(const f of await page.locator('.a4-frame').all())if(await f.locator('.grammar-scenario-question').count()>1){frame=f;break}
   assert(frame)
   await frame.getByRole('button',{name:'Ajouter un saut de page après cette question',exact:true}).first().click()
   assert.deepEqual(await page.locator('.a4-frame .grammar-scenario-question').evaluateAll(es=>es.map(e=>e.dataset.scenarioQuestionId)),before)
   await page.getByRole('button',{name:'Annuler le saut de page après cette question',exact:true}).first().click()
   results.push({scenarioBreak:'reversible; all four child IDs preserved'})
  }
  if(name==='closed'||name==='open'||name==='imageChoice'&&presentation==='choice') {
   await launch(page,responses)
   if(name==='closed') {
    assert((await page.locator('.ci-context').innerText()).includes('Maël'))
    assert((await page.locator('.ci-context').innerText()).includes('Vérifier le rendez-vous'))
    assert.equal(await page.locator('.ci-answer').count(),3)
   } else if(name==='open') {
    assert((await page.locator('.ci-question-prompt').innerText()).includes('Confirmez le jour et l’heure'))
    assert((await page.locator('.ci-context').innerText()).includes('Le secrétariat'))
    assert.equal(await page.locator('.ci-answer').count(),0)
    assert((await page.locator('.ci-manual').innerText()).includes('L’enseignant guide l’activité'))
   } else {
    const image=page.locator('.ci-question .grammar-support-image .ci-image-zoom img')
    await image.waitFor();assert((await image.getAttribute('src')).startsWith('blob:'))
    await page.getByRole('button',{name:'Agrandir : Cinq tomates entières sur un fond blanc.',exact:true}).click()
    await page.getByRole('dialog',{name:'Image agrandie : Cinq tomates entières sur un fond blanc.',exact:true}).waitFor()
    await page.keyboard.press('Escape')
   }
   results.push({classroom:name,status:'passed'})
  }
  await page.context().close()
 }
 for(const failure of ['changed','missing']) {
  const page=await newPage(),recipe=recipeFor('imageChoice','choice'),src=recipe.pages[0].grammarSnapshot.questions[0].unit.imageSupports[0].src
  await page.route('**'+src,route=>failure==='changed'?route.fulfill({status:200,contentType:'image/webp',body:Buffer.from('changed image bytes')}):route.fulfill({status:404,body:''}))
  await openRecipe(page,recipe)
  await page.locator('.a4-frame .grammar-media-error').waitFor()
  assert.equal(await page.locator('.a4-frame .grammar-support-image img').count(),0,'A missing or changed file must never silently replace the saved image.')
  assert((await page.locator('.a4-frame .grammar-media-error').innerText()).includes(failure==='changed'?'ne correspond plus':'indisponible'))
  await page.evaluate(()=>{window.__grammarPrintCalls=0;window.print=()=>window.__grammarPrintCalls++})
  const notice=page.waitForEvent('dialog').then(async d=>{const message=d.message();await d.accept();return message})
  await page.getByRole('button',{name:'Imprimer la fiche et le corrigé',exact:true}).click()
  assert((await notice).includes(failure==='changed'?'ne correspond plus':'indisponible'))
  assert.equal(await page.evaluate(()=>window.__grammarPrintCalls),0)
  results.push({imageFailure:failure,status:'diagnostic shown; no replacement image'})
  await page.context().close()
 }
 const pending=await newPage(),recipe=recipeFor('imageChoice','choice'),src=recipe.pages[0].grammarSnapshot.questions[0].unit.imageSupports[0].src
 let release
 const gate=new Promise(resolve=>{release=resolve})
 await pending.route('**'+src,async route=>{await gate;await route.continue()})
 await openRecipe(pending,recipe)
 await pending.locator('.a4-frame .grammar-media-status').waitFor()
 await pending.evaluate(()=>{window.__grammarPrintCalls=0;window.print=()=>window.__grammarPrintCalls++})
 await pending.getByRole('button',{name:'Imprimer la fiche et le corrigé',exact:true}).click()
 assert.equal(await pending.evaluate(()=>window.__grammarPrintCalls),0)
 release()
 await pending.waitForFunction(()=>window.__grammarPrintCalls===1)
 assert.equal(await pending.locator('.grammar-media-status').count(),0)
 results.push({printReadiness:'waits for verified and decoded image bytes; changed/missing images block the print button'})
 await pending.context().close()
 assert.deepEqual(errors,[])
 writeFileSync(join(evidence,'contracts-browser-result.json'),JSON.stringify({results,errors},null,2))
 console.log(JSON.stringify({status:'passed',results,errors}))
} finally {await browser.close()}
