import assert from 'node:assert/strict'
import {mkdir,writeFile} from 'node:fs/promises'
import {createServer} from 'vite'
import {chromium} from 'playwright'
import {gameControl} from './browser-actions.mjs'

const base='http://127.0.0.1:5182',out='docs/interactive/duel-clearance-proofs'
process.env.VITE_FICHES_API_URL=base+'/__test_api'
const vite=await createServer({cacheDir:'/tmp/clairfle-duel-clearance',server:{host:'127.0.0.1',port:5182,strictPort:true,hmr:false}})
await vite.listen()
const {demoRecipe}=await vite.ssrLoadModule('/src/interactive/demo.ts')
const {defaultPage}=await vite.ssrLoadModule('/src/math/catalog.ts')
const prompt='Quel nombre obtient-on en additionnant deux et deux ? Choisissez la bonne réponse.'
const saved={id:'duel-clearance',name:'Place des mascottes',domains:['algèbre'],recipe:{...demoRecipe(),libreMode:true,pages:[{...defaultPage('algèbre'),count:1,extraBlocks:undefined,libreItems:[{layout:'select',prompt,options:['4','5','6','7','8','9'],answer:'4'}]}]},createdAt:'2026-11-16T00:00:00Z',updatedAt:'2026-11-16T00:00:00Z'}
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH||undefined,args:['--no-sandbox']})
const errors=[],methods=[],results=[]
const times=[0,100,150,165,200,240,270,280,300,350,385,400,520,550,560,600,605,750,800,880,1000,1050]
async function measure(page,expectedFlames){
 const bounds=await page.evaluate(()=>{
  const box=node=>{const r=node.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height,top:r.top,bottom:r.bottom,right:r.right}}
  const question=box(document.querySelector('.ci-duel-question'))
  const text=[];const walker=document.createTreeWalker(document.querySelector('.ci-duel-question h1'),NodeFilter.SHOW_TEXT);while(walker.nextNode()){const range=document.createRange();range.selectNodeContents(walker.currentNode);text.push(...[...range.getClientRects()].map(r=>({x:r.x,y:r.y,right:r.right,bottom:r.bottom})))}
  return{question,cards:[...document.querySelectorAll('.ci-duel-cards')].map(box),portraits:[...document.querySelectorAll('.ci-duel-fighter > .ci-competition-portrait')].map(node=>{const art=node.querySelector('.ci-combat-art,.ci-mascot-facing'),transform=getComputedStyle(art).transform;return{...box(node),layoutWidth:parseFloat(getComputedStyle(node).width),side:node.closest('[data-side]').dataset.side,looking:node.dataset.looking,mirror:transform==='none'?1:new DOMMatrix(transform).a}}),flames:[...document.querySelectorAll('.ci-duel-fighter .ci-power-flame')].map(box),targets:[...document.querySelectorAll('.ci-duel-answer,.ci-duel-health-row,.ci-duel-controls')].map(box),buttons:[...document.querySelectorAll('.ci-clean-header .ci-header-tools > button')].filter(n=>n.getBoundingClientRect().width).map(box),text,viewport:{width:innerWidth,height:innerHeight},overflow:document.documentElement.scrollWidth>innerWidth}
 })
 assert.equal(bounds.overflow,false)
 assert.equal(bounds.portraits.length,2)
 assert.equal(bounds.flames.length,expectedFlames)
 const cardsTop=Math.min(...bounds.cards.map(box=>box.top))
 for(const box of bounds.portraits){assert.ok(box.layoutWidth<=160.1,JSON.stringify(bounds));assert.ok(box.top>=bounds.question.bottom+8,JSON.stringify(bounds));assert.ok(box.bottom<=cardsTop-10,JSON.stringify(bounds));assert.equal(box.looking,box.side==='left'?'right':'left');assert.equal(box.mirror,box.side==='left'?1:-1)}
 for(const box of bounds.flames){assert.ok(box.top>=bounds.question.bottom+20,JSON.stringify(bounds));assert.ok(box.bottom<=cardsTop-20,JSON.stringify(bounds))}
 for(const text of bounds.text)for(const button of bounds.buttons)assert.ok(text.right<=button.x||text.x>=button.right||text.bottom<=button.y||text.y>=button.bottom,JSON.stringify({text,button}))
 for(const box of bounds.targets)assert.ok(box.x>=-1&&box.y>=-1&&box.right<=bounds.viewport.width+1&&box.bottom<=bounds.viewport.height+1&&box.height>=44,JSON.stringify(bounds))
 return bounds
}
async function probe(page,expectedFlames=2){
 let minimumBody=Infinity,minimumFlame=Infinity,minimumBelow=Infinity,width=0
 for(const time of times){
  await page.evaluate(time=>{for(const animation of document.getAnimations()){const target=animation.effect?.target;if(target instanceof Element&&target.closest('.ci-duel-fighter')){animation.pause();animation.currentTime=time}}},time)
  const b=await measure(page,expectedFlames)
  minimumBody=Math.min(minimumBody,...b.portraits.map(box=>box.top-b.question.bottom))
  minimumFlame=Math.min(minimumFlame,...b.flames.map(box=>box.top-b.question.bottom))
  minimumBelow=Math.min(minimumBelow,...b.flames.map(box=>Math.min(...b.cards.map(card=>card.top))-box.bottom))
  width=b.portraits[0].layoutWidth
 }
 return{minimumBody,minimumFlame,minimumBelow,width}
}
try{
 await mkdir(out,{recursive:true})
 for(const[width,height]of[[1366,768],[1024,600],[390,844],[640,360]])for(const maxHp of[100,200]){
  const form=maxHp>100?'adult':'mini',level=maxHp>100?4:3
  console.log(`Mascottes ${form}, ${width}×${height}, critique ×${level}`)
  const context=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'})
  await context.addCookies([{name:'clairfle-fiche-access',value:'admin',url:base}])
  await context.addInitScript(()=>{localStorage.setItem('clairfle-fiche-sync','clearance-fixture-only');localStorage.setItem('clairfle.interactive.timer.v1',JSON.stringify({enabled:false,seconds:5,feedbackSeconds:1}))})
  await context.route('**/__test_api/fiches',route=>{methods.push(route.request().method());return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({fiches:[saved]})})})
  const page=await context.newPage();page.setDefaultTimeout(30000);page.on('pageerror',error=>errors.push(error.message))
  await page.goto(base+'/interactif/'+saved.id);await page.locator('.ci-launch:enabled').waitFor({timeout:120000})
  await gameControl(page,'Compétition').click();await page.getByRole('button',{name:'Préparer un duel',exact:true}).click()
  await page.getByRole('region',{name:'Équipe 1',exact:true}).getByRole('button',{name:'Kitsune',exact:true}).click()
  await page.getByRole('region',{name:'Équipe 2',exact:true}).getByRole('button',{name:'Carpe koï',exact:true}).click()
  await page.getByRole('combobox',{name:'Vie',exact:true}).selectOption(String(maxHp))
  for(const n of[2,3,4])await page.getByRole('spinbutton',{name:`Chance de critique ×${n} (%)`,exact:true}).fill('0')
  await page.getByRole('spinbutton',{name:`Chance de critique ×${level} (%)`,exact:true}).fill('100')
  await page.getByRole('checkbox',{name:'Activer le minuteur du duel',exact:true}).uncheck()
  await page.getByRole('spinbutton',{name:'Temps de correction (secondes)',exact:true}).fill('1')
  await page.getByRole('button',{name:'Préparer la partie',exact:true}).click();await page.getByRole('button',{name:'Commencer le duel',exact:true}).waitFor({timeout:120000})
  await page.clock.install();await page.clock.pauseAt(new Date(Date.now()+10000));await context.setOffline(true)
  await page.getByRole('button',{name:'Commencer le duel',exact:true}).click();await page.locator('.ci-duel-answer:enabled').first().waitFor()
  assert.equal(await page.locator('.ci-duel-question h1').textContent(),prompt)
  await page.locator(`.ci-power-aura-${level}`).first().waitFor()
  const charge=await probe(page)
  await page.screenshot({path:`${out}/${form}-${width}.png`})
  await page.locator('.ci-duel-player[data-side="left"] .ci-duel-answer').filter({has:page.getByText('5',{exact:true})}).click()
  const canvas=page.locator('.ci-vfx-canvas');await canvas.waitFor()
  assert.equal(await canvas.getAttribute('data-impact-kind'),'mistake')
  const contact=Number(await canvas.getAttribute('data-contact'))
  await page.clock.runFor(contact+80)
  await page.locator('.ci-duel-player[data-side="left"] .ci-duel-hp').filter({hasText:String(maxHp-level*10)}).waitFor()
  const hurt=await probe(page,1)
  results.push({viewport:`${width}x${height}`,form,critical:level,charge,hurt,keyframes:times.length,checks:['Body and animated aura stay below the question and above the answer cards','Both mascots face inward, including during damage','Question text stays clear of the floating controls','All 12 answer targets and both health bars fit','Layout checked during charge and after self-damage','No network required after preparation']})
  await context.close()
 }
 assert.deepEqual(errors,[]);assert.ok(methods.every(method=>method==='GET'))
 await writeFile('docs/interactive/duel-clearance-results.json',JSON.stringify({results,errors,serverWrites:0,scope:'Chromium viewports with the actual mini/adult battle portraits and a two-line question. CSS animation keyframes are sampled deterministically in the test; the app keeps its animations.'},null,2)+'\n')
 await writeFile(`${out}/index.html`,proofHtml(results))
 console.log(JSON.stringify(results,null,2))
}catch(error){for(const page of browser.contexts().flatMap(context=>context.pages())){await page.screenshot({path:'/tmp/clairfle-clearance-error.png',fullPage:true}).catch(()=>{});await writeFile('/tmp/clairfle-clearance-error.txt',await page.locator('body').innerText()).catch(()=>{})}throw error}
finally{await browser.close();await vite.close()}

function proofHtml(results){return `<!doctype html><html lang="fr"><meta charset="utf-8"><title>Duels : mascottes et animations visibles</title><style>body{font:17px system-ui;background:#f7f8fc;color:#182238;margin:24px}main{max-width:1200px;margin:auto}figure{background:white;border:1px solid #dce0e8;padding:16px;border-radius:12px}img{max-width:100%;height:auto}figcaption{font-weight:700;margin-bottom:12px}</style><main><h1>Duels : mascottes face à face et espace pour leurs animations</h1><p>Personnages réduits, réserves au-dessus et au-dessous. Question et réponses restent visibles.</p>${results.map(result=>`<figure><figcaption>${result.viewport} · ${result.form==='adult'?'Adulte':'Mini'} · critique ×${result.critical}</figcaption><img src="${result.form}-${result.viewport.split('x')[0]}.png" alt="Deux mascottes face à face, séparées de la question et des réponses"></figure>`).join('')}</main></html>`}
