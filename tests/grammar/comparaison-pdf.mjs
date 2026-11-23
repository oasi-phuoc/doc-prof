import {execFileSync} from 'node:child_process'
import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {mkdirSync,writeFileSync} from 'node:fs'
import {join} from 'node:path'
const require=createRequire(import.meta.url),{chromium}=require('playwright')
const {load,root}=require('../../scripts/gattegno-loader.cjs')
const {GRAMMAR_PILOT_BANKS}=load(root+'/src/grammaire/curriculum/registry.ts')
const {resolveGramSubthemeAll,buildGrammairePracticeTypes}=load(root+'/src/grammaire/exercises/catalog-exercises.ts')
const types=buildGrammairePracticeTypes()
const banks=GRAMMAR_PILOT_BANKS.filter(b=>b.topic==='gram-decrire'&&b.subthemeId==='f9')
const base=process.env.GRAMMAR_TEST_URL??'http://127.0.0.1:5183'
const evidence=process.env.GRAMMAR_QA_DIR??join(root,'docs/grammaire/implementation/comparaison-20261123-proofs')
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
  await choose('Domaine','Grammaire');await choose('Thème',"Décrire")
 }
 const configure=async(b,p,count)=>{
  await choose('Sous-thème',resolveGramSubthemeAll(b.topic,b.activityId).label)
  await choose('Type d’exercice',types.find(t=>t.id===b.activityId).label)
  await choose('Niveau de grammaire',b.level+' — pilote')
  assert.equal(await page.getByRole('button',{name:'Niveau de grammaire',exact:true}).locator('.select-control-value').innerText(),b.level+' — pilote')
  await page.getByRole('button',{name:'Niveau de grammaire',exact:true}).click();assert.deepEqual(await page.getByRole('option').allTextContents(),banks.filter(v=>v.activityId===b.activityId).map(v=>v.level+' — pilote'));await page.keyboard.press('Escape')
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
 for(const [id,level,presentation]of [['gram-ex-f9-qcm-verbe','A1'],['gram-ex-f9-qcm-verbe','A2'],['gram-ex-f9-curriculum-t','A2'],['gram-ex-f9-curriculum-e','A2'],['gram-ex-f9-qcm-verbe','A2','gap']]){
  await page.emulateMedia({media:'screen'});await open();const b=banks.find(b=>b.activityId===id&&b.level===level);await configure(b,presentation??b.presentations[0],1);await mediaReady();await page.emulateMedia({media:'print'})
  const target=join(evidence,id+'-'+level+'-'+(presentation??b.presentations[0])+'-a4');await page.pdf({path:target+'.pdf',format:'A4',preferCSSPageSize:true,printBackground:true,pageRanges:'1'})
  execFileSync('pdftoppm',['-singlefile','-png','-r','96',target+'.pdf',target]);results.push({activity:id,level,presentation:presentation??b.presentations[0],pdfPage:1,status:'passed'})
 }
 assert.deepEqual(errors,[]);writeFileSync(join(evidence,'pdf-previews.json'),JSON.stringify({status:'passed',results,errors},null,2)+'\n');console.log('5 actual PDF previews rendered.')
}catch(error){for(const context of browser.contexts())for(const page of context.pages())await page.screenshot({path:join(evidence,'pdf-failure.png')});throw error}finally{await browser.close()}
