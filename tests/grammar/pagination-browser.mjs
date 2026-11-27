import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {mkdirSync,writeFileSync} from 'node:fs'
import {join} from 'node:path'
const require=createRequire(import.meta.url),{chromium}=require('playwright')
const {load,root}=require('../../scripts/gattegno-loader.cjs')
const {resolveGramSubthemeAll,buildGrammairePracticeTypes}=load(root+'/src/grammaire/exercises/catalog-exercises.ts')
const types=buildGrammairePracticeTypes()
const {GRAMMAIRE_TOPICS}=load(root+'/src/grammaire/catalog.ts')
const base=process.env.GRAMMAR_TEST_URL??'http://127.0.0.1:5192'
const evidence=process.env.GRAMMAR_QA_DIR??join(root,'docs/grammaire/implementation/pagination-manuelle-20261124-proofs')
mkdirSync(evidence,{recursive:true})
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']})
const errors=[],results=[]
try{
 const context=await browser.newContext({viewport:{width:1440,height:1100},hasTouch:true})
 await context.addCookies([{name:'clairfle-fiche-access',value:'admin',url:base}])
 const page=await context.newPage();page.setDefaultTimeout(45000);page.on('pageerror',e=>errors.push(e.message))
 const choose=async(label,value)=>{
  const button=page.getByRole('button',{name:label,exact:true});await button.waitFor()
  if(await button.locator('.select-control-value').textContent()===value)return
  await button.click();await page.getByRole('option',{name:value,exact:true}).click()
 }
 const frames=()=>page.locator('.a4-frame')
 const chips=()=>page.locator('.a4-frame button[aria-label$="le saut de page après cette question"],.a4-frame button[aria-label="Ajouter un saut de page après cette question"]')
 const content=async(reading)=>page.locator(reading?'.a4-frame .grammar-reading-question':'.a4-frame .exercise-item').evaluateAll(nodes=>nodes.map(n=>n.innerText.replace(/^\d+\.\s*/,'')))
 const numbers=async()=>page.locator('.a4-frame .item-number').allTextContents()
 for(const [id,topic,level,p,reading=false]of [
  ['gram-ex-futur-proche-qcm-verbe','gram-avenir','A1','gap'],
  ['gram-ex-j1-qcm-verbe','gram-action','A1','gap'],
  ['gram-ex-futur-proche-curriculum-s','gram-avenir','A1','scenario-set'],
  ['gram-ex-futur-proche-communication-ce','gram-avenir','A1','document-set',true],
  ['gram-ex-k1-qcm-verbe','gram-argumenter','A2','gap']
 ]){
  await page.emulateMedia({media:'screen'});await page.goto(base+'/generateur',{waitUntil:'domcontentloaded',timeout:120000})
  await choose('Domaine','Grammaire');await choose('Thème',GRAMMAIRE_TOPICS.find(t=>t.id===topic).label)
  await choose('Sous-thème',resolveGramSubthemeAll(topic,id).label);await choose('Type d’exercice',types.find(t=>t.id===id).label)
  if(level)await choose('Niveau de grammaire',level+' — pilote')
  if(p==='gap')await page.getByRole('button',{name:'Lacune',exact:true}).click()
  const count=page.getByLabel(reading?'Nombre de textes':p==='scenario-set'?'Nombre de situations':'Nombre de questions',{exact:true});await count.fill(reading?'2':'6');await count.blur()
  await page.waitForFunction(()=>document.querySelectorAll('.a4-frame button[aria-label="Ajouter un saut de page après cette question"]').length===6)
  await page.waitForFunction(()=>!document.querySelector('.grammar-media-status'))
  await page.locator('.grammar-support-image img').evaluateAll(imgs=>Promise.all(imgs.map(i=>i.decode())))
  assert.equal(await frames().count(),1,id+' stays grouped by default');assert.equal(await chips().count(),6)
  const original=await content(reading),originalNumbers=await numbers();assert.equal(original.length,6)
  const exceedsA4=await frames().first().evaluate(f=>{const s=f.querySelector('.worksheet-sheet'),r=s.getBoundingClientRect();return [...s.querySelectorAll('.exercise-item')].some(i=>i.getBoundingClientRect().bottom>r.bottom)})
  const target=reading||p==='scenario-set'||id.includes('-j1-')?0:2
  await chips().nth(target).click();await page.waitForFunction(()=>document.querySelectorAll('.a4-frame').length===2)
  assert.deepEqual(await content(reading),original,'A cut never redraws questions or options');assert.deepEqual(await numbers(),originalNumbers,'Question numbering survives the cut')
  assert.equal(await page.locator('.a4-frame button[aria-label="Annuler le saut de page après cette question"]').count(),1)
  if(reading){assert.equal(await page.locator('.a4-frame .grammar-reading-support').count(),3);assert.equal(await page.locator('.a4-frame').nth(1).locator('.grammar-reading-support').first().count(),1)}
  await page.screenshot({path:join(evidence,id+'-manual-cut.png')})
  await page.emulateMedia({media:'print'})
  assert.equal(await page.locator('.print-only-sheets .worksheet-sheet').count(),4,'Two student sheets and two correction sheets')
  assert.equal(await page.locator('.print-only-sheets button[aria-label*="saut de page"]').filter({visible:true}).count(),0,'Editing controls stay off the printed sheet')
  if(id==='gram-ex-futur-proche-qcm-verbe')await page.pdf({path:join(evidence,'six-questions-manual-cut.pdf'),format:'A4',preferCSSPageSize:true,printBackground:true})
  await page.emulateMedia({media:'screen'})
  await page.getByRole('button',{name:'Annuler le saut de page après cette question',exact:true}).click();await page.waitForFunction(()=>document.querySelectorAll('.a4-frame').length===1)
  assert.deepEqual(await content(reading),original);assert.equal(await chips().count(),6)
  results.push({activity:id,questions:6,defaultSheets:1,manualSheets:2,undoSheets:1,numberingPreserved:true,exceedsA4,readingSupportRepeated:reading})
 }
 assert.deepEqual(errors,[])
 writeFileSync(join(evidence,'browser-result.json'),JSON.stringify({status:'passed',results,errors},null,2)+'\n')
 console.log(JSON.stringify({status:'passed',cases:results.length,groupedQuestions:6,manualCutAndUndo:true,printControlsHidden:true,errors}))
}catch(error){for(const context of browser.contexts())for(const page of context.pages())await page.screenshot({path:join(evidence,'failure.png')});throw error}finally{await browser.close()}
