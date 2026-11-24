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
const banks=GRAMMAR_PILOT_BANKS.filter(b=>b.topic==='gram-action'&&['j1','j2','j3'].includes(b.subthemeId))
const scope=process.env.GRAMMAR_QA_SUBTHEMES?.split(',')
const base=process.env.GRAMMAR_TEST_URL??'http://127.0.0.1:5190'
const evidence=process.env.GRAMMAR_QA_DIR??join(root,'docs/grammaire/implementation/action-20261124-proofs')
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
  await choose('Domaine','Grammaire');await choose('Thème',"Parler d’une action")
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
 for(const [id,level,presentation,correction=false]of [['gram-ex-j1-qcm-verbe','A1','choice'],['gram-ex-j1-qcm-verbe','A1','gap',true],['gram-ex-j1-communication-ce','A1'],['gram-ex-j1-communication-pe','A1'],['gram-ex-j1-qcm-verbe','A2','gap'],['gram-ex-j1-curriculum-t','A2',undefined,true],['gram-ex-j1-communication-ce','A2'],['gram-ex-j1-communication-po','A2',undefined,true],['gram-ex-j2-qcm-verbe','A1','gap'],['gram-ex-j2-curriculum-p','A1',undefined,true],['gram-ex-j2-qcm-verbe','A2','choice'],['gram-ex-j2-curriculum-t','A2',undefined,true],['gram-ex-j2-curriculum-e','A2'],['gram-ex-j3-qcm-verbe','A2','gap'],['gram-ex-j3-curriculum-c','A2',undefined,true],['gram-ex-j3-curriculum-p','A2',undefined,true]]){
  await page.emulateMedia({media:'screen'});await open();const b=banks.find(b=>b.activityId===id&&b.level===level);if(scope&&!scope.includes(b.subthemeId))continue;await configure(b,presentation??b.presentations[0],1);await mediaReady();await page.emulateMedia({media:'print'})
  const target=join(evidence,id+'-'+level+'-'+(presentation??b.presentations[0])+(correction?'-correction':'')+'-a4');await page.pdf({path:target+'.pdf',format:'A4',preferCSSPageSize:true,printBackground:true,pageRanges:correction?'2':'1'})
  execFileSync('pdftoppm',['-singlefile','-png','-r','96',target+'.pdf',target]);results.push({activity:id,level,presentation:presentation??b.presentations[0],pdfPage:correction?2:1,status:'passed'})
 }
 // Inspect the two constructions that a single random situation may miss.
 for(const [id,label,needle]of [['gram-ex-j3-curriculum-c','subject','le visiteur consulte le plan'],['gram-ex-j2-curriculum-t','past','venais de terminer le rapport']]){
  await page.emulateMedia({media:'screen'});await open();const b=banks.find(b=>b.activityId===id&&b.level==='A2');if(scope&&!scope.includes(b.subthemeId))continue
  await configure(b,b.presentations[0],50);await mediaReady();await page.emulateMedia({media:'print'})
  const index=await page.locator('.print-only-sheets .worksheet-sheet').evaluateAll((ss,needle)=>ss.filter(s=>s.getBoundingClientRect().height>0).findIndex(s=>s.querySelector('.grammar-explanation')&&s.textContent.includes(needle)),needle)
  assert(index>=0,'The targeted construction appears in its actual correction sheet')
  const target=join(evidence,id+'-A2-'+label+'-correction-a4');await page.pdf({path:target+'.pdf',format:'A4',preferCSSPageSize:true,printBackground:true,pageRanges:String(index+1)})
  execFileSync('pdftoppm',['-singlefile','-png','-r','96',target+'.pdf',target]);results.push({activity:id,level:'A2',presentation:b.presentations[0],target:label,pdfPage:index+1,status:'passed'})
 }
 assert.deepEqual(errors,[]);writeFileSync(join(evidence,'pdf-previews.json'),JSON.stringify({status:'passed',results,errors},null,2)+'\n');console.log(`${results.length} actual PDF previews rendered.`)
}catch(error){for(const context of browser.contexts())for(const page of context.pages())await page.screenshot({path:join(evidence,'pdf-failure.png')});throw error}finally{await browser.close()}
