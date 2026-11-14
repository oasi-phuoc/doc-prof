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
  const control=page.getByRole('button',{name:label,exact:true});if(await control.locator('.select-control-value').textContent()===option)return
  await control.click()
  await page.getByRole('option',{name:option,exact:true}).click()
 }
 await page.goto(base+'/generateur',{waitUntil:'networkidle',timeout:120000})
 await choose('Domaine','Grammaire')
 await choose('Thème','Conjuguer au présent')
 for(const [sub,subLabel,qLabel] of [['ir','Verbes en -ir','Conjuguer en -ir'],['re-oir','Verbes en -re et -oir','Conjuguer en -re et -oir']]) {
 await choose('Sous-thème',subLabel)
 await choose('Type d’exercice',qLabel)
 const level=page.getByLabel('Niveau de grammaire',{exact:true}).locator('.select-control-value')
 assert.equal(await level.textContent(),'Banque actuelle')
 await choose('Niveau de grammaire','A1 — pilote')
 await page.getByRole('button',{name:'Lacune',exact:true}).click()
 await choose('Niveau de grammaire','A2 — pilote')
 assert.equal(await page.getByRole('button',{name:'Lacune',exact:true}).getAttribute('aria-pressed'),'true')
 await choose('Niveau de grammaire','A1 — pilote')
 assert.equal(await page.getByRole('button',{name:'Lacune',exact:true}).getAttribute('aria-pressed'),'true')
 results.push({levelSwitch:'A1 ↔ A2 preserves the response mode'})
 for(const [type,label,grade,presentation] of [
  ['qcm-conj',qLabel,'A1','choice'],
  ['qcm-conj',qLabel,'A1','gap'],
  ['qcm-conj',qLabel,'A2','choice'],
  ['qcm-conj',qLabel,'A2','gap'],
  ['ordre','Mots dans l’ordre','A1','order'],
  ['ordre','Mots dans l’ordre','A2','order'],
  ['corriger-erreur','Corriger l’erreur','A2','correct'],
  ['curriculum-t','Transformer une phrase','A2','transform'],
 ]) {
  await page.emulateMedia({media:'screen'})
  await choose('Type d’exercice',label)
  if(await level.textContent()!==grade+' — pilote')await choose('Niveau de grammaire',grade+' — pilote')
  if(presentation==='choice'||presentation==='gap')await page.getByRole('button',{name:presentation==='choice'?'QCM':'Lacune',exact:true}).click()
  if(presentation==='transform'||presentation==='correct') {
   await page.getByRole('button',{name:'Niveau de grammaire',exact:true}).click()
   assert.equal(await page.getByRole('option',{name:'A1 — pilote',exact:true}).count(),0)
   await page.keyboard.press('Escape')
  }
  if(presentation==='order') {
   const forms=page.getByRole('group',{name:'Forme des phrases',exact:true})
   if(grade==='A2') {
    assert((await page.locator('.grammar-level-note').allTextContents()).some(t=>t.includes('44 positives, 6 négatives')))
    await forms.getByRole('button',{name:'Négative',exact:true}).click()
    assert.equal(await page.getByLabel('Nombre de questions',{exact:true}).getAttribute('max'),'6')
    await forms.getByRole('button',{name:'Mixte',exact:true}).click()
   } else await forms.getByRole('button',{name:'Positive',exact:true}).click()
  }
  await page.getByLabel('Nombre de questions',{exact:true}).fill('50')
  await page.getByLabel('Nombre de questions',{exact:true}).blur()
  assert.equal(await page.getByLabel('Nombre de questions',{exact:true}).inputValue(),'50')
  await page.waitForTimeout(150)
  assert.equal(await page.getByRole('button',{name:'Sous-thème',exact:true}).locator('.select-control-value').textContent(),subLabel)
  if(presentation==='choice'||presentation==='gap') {
   assert(await page.locator('.a4-frame .grammar-answer-inline + .grammar-verb-hint').count()>0,'Verb hint must follow the inline response.')
  } else if(presentation==='order') {
   assert(await page.locator('.a4-frame .phrase-answer-slot .phrase-verb-hint').count()>0)
  } else {
   assert(await page.locator('.a4-frame .grammar-written-response .grammar-verb-hint').count()>0)
  }
  await page.emulateMedia({media:'print'})
  const sheets=page.locator('.print-only-sheets .worksheet-sheet')
  const boxes=await sheets.evaluateAll(sheets=>sheets.filter(s=>s.getBoundingClientRect().height>0).map(s=>{
   const box=e=>{const r=e.getBoundingClientRect();return{top:r.top,bottom:r.bottom,width:r.width,height:r.height}}
   return{sheet:box(s),body:box(s.querySelector('.sheet-body')),footer:box(s.querySelector('.doc-footer')),
    items:[...s.querySelectorAll('.exercise-item')].map(box),
    wide:[...s.querySelectorAll('.grammar-question,.grammar-written-response,.phrase-answer-slot')].filter(e=>e.scrollWidth>e.clientWidth+2).map(e=>({class:e.className,width:e.clientWidth,scroll:e.scrollWidth}))}
  }))
  assert(boxes.length>1)
  for(const b of boxes) {
   assert(Math.abs(b.sheet.height-1122.52)<3,`A4 size: ${JSON.stringify(b.sheet)}`)
   assert(b.items.every(i=>i.bottom<=b.body.bottom+2),`Clipped rows: ${JSON.stringify(b)}`)
   assert(b.items.every(i=>i.bottom<=b.footer.top+2),`Footer overlap: ${JSON.stringify(b)}`)
   assert.deepEqual(b.wide,[],`Horizontal overflow: ${JSON.stringify(b)}`)
  }
  assert.equal(await page.locator('.print-only-sheets .layout-grammar').count(),100)
  if(presentation==='transform') {
   assert.equal(await page.locator('.print-only-sheets .grammar-target-subject').count(),100)
   assert.equal(await page.locator('.print-only-sheets .grammar-two-lines').count(),100)
  }
  results.push({type:`gram-ex-${sub}-${type}`,level:grade,presentation,sheets:boxes.length,printedQuestions:100,overflow:false})
  console.log(`${sub} ${grade} ${presentation}: 50 questions, ${boxes.length} feuilles élève/corrigé, aucun débordement.`)
  if(grade==='A2'&&(presentation==='gap'||presentation==='transform')) {
   await page.emulateMedia({media:'screen'})
   await page.locator('.a4-frame').first().screenshot({path:join(evidence,`${sub}-a2-${presentation}.png`)})
  }
 }
 await page.emulateMedia({media:'screen'})
 await page.getByLabel('Nombre de questions',{exact:true}).fill('3')
 await page.getByLabel('Nombre de questions',{exact:true}).blur()
 const target=await page.locator('.a4-frame .grammar-target-subject strong').first().textContent()
 const source=await page.locator('.a4-frame .grammar-question > p').first().textContent()
 await page.getByRole('button',{name:'Jouer avec la classe',exact:true}).click()
 await page.waitForURL('**/interactif**')
 await page.getByRole('button',{name:/Commencer la séance/}).waitFor({timeout:120000})
 assert.equal(await page.locator('.ci-question-list fieldset > label').count(),3)
 await page.getByRole('button',{name:/Commencer la séance/}).click()
 await page.locator('.ci-question-prompt').filter({hasText:source}).waitFor()
 assert((await page.locator('.ci-question-prompt').innerText()).includes(`Réécrivez avec le sujet « ${target} ».`))
 assert.equal(await page.locator('.ci-answer').count(),0)
 results.push({sub,classroomTransform:'source and target subject preserved',selectedQuestions:3})
 await page.goto(base+'/generateur',{waitUntil:'networkidle',timeout:120000})
 await choose('Domaine','Grammaire');await choose('Thème','Conjuguer au présent')
 }
 assert.deepEqual(errors,[])
 writeFileSync(join(evidence,'ir-re-browser-result.json'),JSON.stringify({results,errors},null,2))
 console.log(JSON.stringify({status:'passed',results,errors}))
} finally {await browser.close()}
