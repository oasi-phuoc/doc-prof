import assert from 'node:assert/strict'
import {readFile,mkdir,writeFile} from 'node:fs/promises'
import {createServer} from 'vite'
import {chromium} from 'playwright'
import AxeBuilder from '@axe-core/playwright'
import {normalizeEditorialBank} from '../../src/tcf/editorial-json.mjs'
import {gameControl} from './browser-actions.mjs'

const base='http://127.0.0.1:5182',output='/tmp/clairfle-editorial-json-proof'
process.env.VITE_FICHES_API_URL=base+'/__editorial_fixture'
const server=await createServer({cacheDir:'/tmp/clairfle-editorial-json-vite',server:{host:'127.0.0.1',port:5182,strictPort:true}})
await server.listen()
const {demoRecipe}=await server.ssrLoadModule('/src/interactive/demo.ts')
const {defaultPage}=await server.ssrLoadModule('/src/math/catalog.ts')
const runtime=await server.ssrLoadModule('/src/tcf/loader.ts')
const grammar=await server.ssrLoadModule('/src/grammaire/exercises/co-bank.ts')
const runtimeCounts={}
for(const kind of ['ce','co']){
 const expected=[]
 for(const level of ['a0-a1','a1-a2','a2-b1'])expected.push(...normalizeEditorialBank(JSON.parse(await readFile(`src/tcf/content/${level}/${kind}.json`,'utf8'))))
 assert.deepEqual(runtime.tcfBankAllLevels(kind.toUpperCase()),expected)
 runtimeCounts[kind]=expected.length
}
assert.deepEqual(grammar.GRAMMAR_CO_BANK,normalizeEditorialBank(JSON.parse(await readFile('src/grammaire/exercises/co-bank.json','utf8'))))
runtimeCounts.grammarCo=grammar.GRAMMAR_CO_BANK.length
const bank=normalizeEditorialBank(JSON.parse(await readFile('src/tcf/content/a0-a1/co.json','utf8')))
const ex=bank.find(ex=>ex.type_exercice==='complet'&&ex.support.audio&&typeof ex.support.transcription==='string'&&ex.support.transcription.trim()&&ex.questions.length>=2)
assert(ex)
const recipe={...demoRecipe(),libreMode:false,pages:[{...defaultPage('tcf-csc'),topic:'tcf-co',exerciseType:'tcf-co-ex-3',count:1,tcfExercise:{...ex,questions:ex.questions.slice(0,2)},libreItems:undefined,extraBlocks:undefined}]}
const saved={id:'editorial-format-fixture',name:'Lecture du format JSON',recipe,domains:['tcf-csc'],createdAt:'2026-11-23T00:00:00Z',updatedAt:'2026-11-23T00:00:00Z'}
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']})
const results=[],errors=[],methods=[]
try{
 await mkdir(output,{recursive:true})
 for(const [width,height]of [[390,844],[1366,768]]){
  const context=await browser.newContext({viewport:{width,height}})
  await context.addCookies([{name:'clairfle-fiche-access',value:'admin',url:base}])
  await context.addInitScript(()=>{
   localStorage.setItem('clairfle-fiche-sync','editorial-fixture-only')
   localStorage.setItem('clairfle.interactive.timer.v1',JSON.stringify({enabled:false,seconds:30,feedbackSeconds:3}))
  })
  await context.route('**/__editorial_fixture/fiches',async route=>{methods.push(route.request().method());await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({fiches:[saved]})})})
  const page=await context.newPage();page.on('pageerror',error=>errors.push(error.message))
  await page.goto(base+'/interactif/'+saved.id)
  await page.locator('.ci-launch:enabled').waitFor({timeout:120000})
  await page.getByRole('button',{name:/^Préparer la séance/}).click()
  assert.equal(await page.getByRole('checkbox',{name:'Proposer la transcription après les réponses',exact:true}).isChecked(),true)
  await page.getByRole('button',{name:'Fermer · Préparer la séance',exact:true}).click()
  await page.locator('.ci-launch').click()
  const dialog=page.getByRole('dialog',{name:'Transcription de l’écoute',exact:true})
  assert.equal(await dialog.count(),0)
  assert.equal(await page.getByText(ex.support.transcription,{exact:true}).count(),0)
  for(const name of ['Signal : levez vos cartes','Discuter','Enseignant : révéler'])await gameControl(page,name).click()
  await gameControl(page,'Lire la transcription').click()
  await dialog.waitFor()
  assert.equal((await dialog.locator('.ci-text-dialog-body p').innerText()).trim(),ex.support.transcription.trim())
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false)
  const rect=await dialog.boundingBox();assert(rect&&rect.x>=0&&rect.y>=0&&rect.x+rect.width<=width+1&&rect.y+rect.height<=height+1)
  const a11y=await new AxeBuilder({page}).analyze();assert.deepEqual(a11y.violations.map(v=>({id:v.id,impact:v.impact})),[])
  await page.screenshot({path:output+'/transcript-'+width+'.png',fullPage:true})
  await page.keyboard.press('Escape');assert.equal(await dialog.isVisible(),false)
  assert.equal(await page.getByText(ex.support.transcription,{exact:true}).count(),0)
  results.push({viewport:`${width}x${height}`,exactText:true,hiddenBeforeReveal:true,hiddenAfterClose:true,overflow:false,axeViolations:0})
  await context.close()
 }
 assert.deepEqual(errors,[]);assert(methods.length&&methods.every(method=>method==='GET'))
 const report={status:'passed',sourceBanks:{...runtimeCounts,exact:true},exercise:ex.id,results,apiRequests:'GET to local synthetic fixture only',errors}
 await mkdir('docs/tcf/format-json-20261123-proofs',{recursive:true})
 await writeFile('docs/tcf/format-json-20261123-proofs/browser.json',JSON.stringify(report,null,2)+'\n')
 console.log(JSON.stringify(report))
}finally{await browser.close();await server.close()}
