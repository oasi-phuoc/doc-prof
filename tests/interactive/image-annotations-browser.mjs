import assert from 'node:assert/strict'
import {mkdir,writeFile} from 'node:fs/promises'
import {createServer} from 'vite'
import {chromium} from 'playwright'
import AxeBuilder from '@axe-core/playwright'
import {gameControl,waitForBrowserValue} from './browser-actions.mjs'
const base='http://127.0.0.1:5182',out='docs/interactive/annotation-proofs'
process.env.VITE_FICHES_API_URL=base+'/__test_api'
const vite=await createServer({cacheDir:'/tmp/clairfle-image-annotations',server:{host:'127.0.0.1',port:5182,strictPort:true,hmr:false}});await vite.listen()
const {demoRecipe}=await vite.ssrLoadModule('/src/interactive/demo.ts'),{defaultPage}=await vite.ssrLoadModule('/src/math/catalog.ts')
const oral=(domain,id)=>({...defaultPage(domain),topic:'tcf-po',exerciseType:'tcf-po',tcfBankId:id,count:1,extraBlocks:undefined,libreItems:undefined})
const recipe={...demoRecipe(),seed:20261114,pages:[oral('tcf-csc','tcf-a0a1-po-img-accident-velo'),oral('tcf-cfr','tcf-a1a2-po-img-accident'),{...defaultPage('algèbre'),count:1,libreItems:[{layout:'inline',a:2,b:2,op:'+',missing:'result',answer:'4'}]}]},original=structuredClone(recipe)
const saved={id:'image-annotations',name:'Annoter les situations orales',domains:['tcf-csc','tcf-cfr'],recipe,createdAt:'2026-11-15T00:00:00Z',updatedAt:'2026-11-15T00:00:00Z'}
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH||undefined,args:['--no-sandbox']}),errors=[],methods=[],results=[]
const button=(page,name)=>gameControl(page,name)
async function setup(width,height,mode='class',timer=false){
 const context=await browser.newContext({viewport:{width,height},hasTouch:width<=700,reducedMotion:'reduce'});await context.addCookies([{name:'clairfle-fiche-access',value:'admin',url:base}])
 await context.addInitScript(({mode,timer})=>{localStorage.setItem('clairfle-fiche-sync','annotations-fixture-only');sessionStorage.setItem('clairfle.interactive.mode.v1',mode);localStorage.setItem('clairfle.interactive.timer.v1',JSON.stringify({enabled:timer,seconds:5,feedbackSeconds:3}))},{mode,timer})
 await context.route('**/__test_api/fiches',route=>{methods.push(route.request().method());return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({fiches:[saved]})})})
 const page=await context.newPage();page.setDefaultTimeout(30000);page.on('pageerror',e=>errors.push(e.message));await page.goto(base+'/interactif/'+saved.id);await page.locator('.ci-launch:enabled').waitFor({timeout:120000})
 assert.equal(await button(page,'Mode de jeu').getAttribute('aria-pressed'),String(mode==='solo'))
 await button(page,'Précharger toute la séance').click();await page.getByRole('status').filter({hasText:'Prêt à jouer sans connexion'}).waitFor();await context.setOffline(true);if(timer)await page.clock.install();await page.locator('.ci-launch').click();await page.locator('.ci-sequence').waitFor();return{page,context}
}
async function open(page,label='Scène 1'){
 await button(page,`Agrandir : ${label}`).click();const dialog=page.getByRole('dialog',{name:`Image agrandie : ${label}`,exact:true});await dialog.locator('.ci-annotation-surface[data-ready]').waitFor();return dialog
}
const count=dialog=>dialog.locator('.ci-annotation-surface').getAttribute('data-annotation-count').then(Number)
async function draw(page,dialog,tool='Stylo',touch=false,cancel=false){
 await dialog.getByRole('button',{name:tool,exact:true}).click();const box=await dialog.locator('.ci-annotation-surface').boundingBox();assert.ok(box.width>40&&box.height>40)
 const from={x:box.x+box.width*.2,y:box.y+box.height*.25},to={x:box.x+box.width*.7,y:box.y+box.height*.65},client=touch?await page.context().newCDPSession(page):null
 try{
  if(client)await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[from]});else{await page.mouse.move(from.x,from.y);await page.mouse.down()}
  for(let i=1;i<=8;i++){const point={x:from.x+(to.x-from.x)*i/8,y:from.y+(to.y-from.y)*i/8};if(client)await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[point]});else await page.mouse.move(point.x,point.y)}
  if(cancel){if(client)await client.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});else{await page.keyboard.press('Escape');await page.mouse.up()}}
  else if(client)await client.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});else await page.mouse.up()
 }finally{await client?.detach()}
}
async function navigate(page,index){await button(page,/^Choisir une question ·/).click();await page.getByRole('dialog',{name:'Choisir une question',exact:true}).locator('li button').nth(index).click()}
async function axe(page){const scan=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();assert.deepEqual(scan.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})),[])}
async function fit(page,dialog){
 const vp=page.viewportSize(),box=await dialog.boundingBox();assert.ok(box.x>=0&&box.y>=0&&box.x+box.width<=vp.width+1&&box.y+box.height<=vp.height+1,JSON.stringify({box,vp}))
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false)
 for(const target of await dialog.locator('button:visible').all()){const b=await target.boundingBox();assert.ok(b.width>=44&&b.height>=44,JSON.stringify(b))}
}
try{
 await mkdir(out,{recursive:true})
 for(const [width,height]of [[390,844],[1366,768],[360,640]]){
  console.log(`Annotations ${width}x${height}`);const {page,context}=await setup(width,height)
  let dialog=await open(page);await draw(page,dialog,'Stylo',width<=700);assert.equal(await count(dialog),1)
  await dialog.getByRole('button',{name:'Couleur bleue',exact:true}).click();await draw(page,dialog,'Surligneur');assert.equal(await count(dialog),2)
  await dialog.getByRole('button',{name:'Couleur verte',exact:true}).click();await draw(page,dialog,'Cadre');assert.equal(await count(dialog),3)
  await dialog.getByRole('button',{name:'Couleur jaune',exact:true}).click();await draw(page,dialog,'Ovale');assert.equal(await count(dialog),4)
  await fit(page,dialog);await axe(page);await page.screenshot({path:`${out}/editor-${width}.png`})
  await dialog.getByRole('button',{name:'Annuler',exact:true}).click();assert.equal(await count(dialog),3)
  await dialog.getByRole('button',{name:'Tout effacer',exact:true}).click();assert.equal(await count(dialog),0)
  await dialog.getByRole('button',{name:'Cadre',exact:true}).click();const canvas=dialog.locator('.ci-annotation-surface');await canvas.focus();await page.keyboard.press('Enter');await page.keyboard.press('Shift+ArrowRight');await page.keyboard.press('Shift+ArrowDown');await page.keyboard.press('Enter');assert.equal(await count(dialog),1)
  const before=await dialog.locator('[data-annotation-stroke="rectangle"] rect').boundingBox();await dialog.getByRole('button',{name:'Agrandir l’image',exact:true}).click();await dialog.getByRole('button',{name:'Agrandir l’image',exact:true}).click();const after=await dialog.locator('[data-annotation-stroke="rectangle"] rect').boundingBox();assert.ok(Math.abs(after.width-before.width*2)<2)
  await dialog.getByRole('button',{name:'Déplacer l’image',exact:true}).click();const pan=dialog.locator('.ci-annotation-pan'),panBox=await pan.boundingBox(),scrollBefore=await pan.evaluate(n=>n.scrollLeft)
  await page.mouse.move(panBox.x+panBox.width*.7,panBox.y+panBox.height*.5);await page.mouse.down();await page.mouse.move(panBox.x+panBox.width*.3,panBox.y+panBox.height*.5,{steps:8});await page.mouse.up();assert.ok(await pan.evaluate(n=>n.scrollLeft)>scrollBefore)
  await dialog.getByRole('button',{name:'Réduire l’image',exact:true}).click();await dialog.getByRole('button',{name:'Réduire l’image',exact:true}).click()
  await draw(page,dialog,'Stylo',width<=700,true);assert.equal(await count(dialog),1);assert.equal(await dialog.isVisible(),true)
  await page.keyboard.press('Escape');await dialog.waitFor({state:'hidden'});assert.equal(await page.getByRole('button',{name:'Agrandir : Scène 1',exact:true}).evaluate(node=>node===document.activeElement),true)
  dialog=await open(page,'Scène 2');assert.equal(await count(dialog),0);await draw(page,dialog);await page.keyboard.press('Escape');await dialog.waitFor({state:'hidden'})
  await button(page,'Choisir la scène 1, place 1').click();await button(page,'Choisir la scène 3, place 3').click();dialog=await open(page);assert.equal(await count(dialog),1);await page.keyboard.press('Escape');await dialog.waitFor({state:'hidden'})
  await navigate(page,1);dialog=await open(page,'Document 1');assert.equal(await count(dialog),0);await draw(page,dialog);await page.keyboard.press('Escape');await dialog.waitFor({state:'hidden'});await navigate(page,0)
  const stored=await waitForBrowserValue(page,async()=>{const{requestLocal}=await import('/src/interactive/storage.ts');const records=await requestLocal('sessions','readonly',store=>store.getAll());return records.find(r=>r.mode==='class'&&r.events.filter(e=>e.action.type==='IMAGE_ANNOTATION_ADD').length>=7)??null})
  assert.ok(!JSON.stringify(stored).includes('blob:'));assert.equal(stored.events.filter(e=>e.action.type==='IMAGE_ANNOTATION_ADD').every(e=>Object.keys(e.action.stroke).sort().join(',')==='color,points,tool'),true)
  await context.setOffline(false);await page.reload();await page.locator('.ci-launch:enabled').waitFor({timeout:120000});await page.locator('.ci-launch').click();await page.locator('.ci-sequence').waitFor()
  dialog=await open(page);assert.equal(await count(dialog),1);await page.keyboard.press('Escape');await dialog.waitFor({state:'hidden'})
  await button(page,'Verrouiller les commandes').click();dialog=await open(page);assert.equal(await dialog.getByRole('button',{name:'Stylo',exact:true}).isDisabled(),true);assert.equal(await dialog.getByRole('button',{name:'Tout effacer',exact:true}).isDisabled(),true);await page.keyboard.press('Escape');await dialog.waitFor({state:'hidden'});await button(page,'Déverrouiller les commandes').click()
  results.push({viewport:`${width}x${height}`,input:width<=700?'Real CDP touch drawing and cancellation, plus mouse and keyboard':'Mouse, keyboard and Escape cancellation',tools:'Pen, highlighter, rectangle, ellipse; four colours; per-image undo and clearing',persistence:'Committed vectors survive picture reorder, other questions, reload and explicit resume; no blob URLs in the journal',protection:'Teacher lock keeps images viewable but annotations read-only',zoom:'Normalized geometry doubles correctly when zoom changes from 1 to 2',axeViolations:0});await context.close()
 }
 console.log('Annotations Solo timers');const {page,context}=await setup(390,844,'solo',true);await page.clock.pauseAt(new Date((await page.evaluate(()=>Date.now()))+200))
 let dialog=await open(page);await page.clock.runFor(6500);assert.equal(await page.locator('.ci-session.ci-is-revealed').count(),0);assert.equal(await page.locator('.ci-progress').innerText().then(t=>t.includes('Question 1 / 3')),true)
 await page.keyboard.press('Escape');await dialog.waitFor({state:'hidden'});await page.clock.runFor(5000);assert.equal(await page.locator('.ci-session.ci-is-revealed').count(),1)
 dialog=await open(page);await page.clock.runFor(5000);assert.equal(await page.locator('.ci-progress').innerText().then(t=>t.includes('Question 1 / 3')),true)
 await page.keyboard.press('Escape');await dialog.waitFor({state:'hidden'});await page.clock.runFor(3500);assert.equal(await page.locator('.ci-progress').innerText().then(t=>t.includes('Question 2 / 3')),true)
 dialog=await open(page,'Document 1');await page.locator('.ci-oral-gallery .ci-image-zoom > img').dispatchEvent('error');await dialog.waitFor({state:'detached'});await page.clock.runFor(5000);assert.equal(await page.locator('.ci-session.ci-is-revealed').count(),1)
 await page.clock.resume();await context.close()
 results.push({solo:'Both thinking and automatic-next timers freeze while an annotated image is open, then resume; the oral activity stays ungraded. A failed image also closes the editor and allows the clock to continue.'})
 assert.deepEqual(recipe,original);assert.deepEqual(errors,[]);assert.ok(methods.length&&methods.every(method=>method==='GET'))
 await writeFile('docs/interactive/image-annotations-results.json',JSON.stringify({results,errors,liveApiWrites:0},null,2)+'\n');console.log(JSON.stringify(results,null,2))
 await writeFile(`${out}/index.html`,`<!doctype html><html lang="fr"><meta charset="utf-8"><title>Annotations des images orales</title><style>body{font:17px system-ui;background:#f7f8fc;color:#182238;margin:24px}img{display:block;max-width:100%;height:auto;margin:16px auto}figure{margin:24px 0;padding:16px;background:white;border:1px solid #dce1ed;border-radius:12px}</style><h1>Annotations des images orales</h1><p>Banque PO existante, sans modification des fichiers images. Stylo, surligneur, cadre et ovale, utilisables au doigt, à la souris et au clavier. Les tracés suivent leurs images après déplacement, zoom et reprise.</p>${[390,1366,360].map(width=>`<figure><figcaption>Visionneuse à ${width} px — outils et quatre couleurs</figcaption><img src="editor-${width}.png" alt="Annotations d’une scène orale à ${width} pixels de large"></figure>`).join('')}<p>Les essais natifs vérifient aussi le verrou, l’annulation d’un geste tactile, la conservation après rechargement et la suspension des minuteurs Solo.</p></html>`)
}finally{await browser.close();await vite.close()}
