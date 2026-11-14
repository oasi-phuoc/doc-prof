import assert from 'node:assert/strict'
import {mkdir,readFile,writeFile} from 'node:fs/promises'
import {createServer} from 'vite'
import {chromium} from 'playwright'
import AxeBuilder from '@axe-core/playwright'
import {waitForBrowserValue} from './browser-actions.mjs'
import {dragSequence} from './sequence-drag-actions.mjs'

const base='http://127.0.0.1:5182'
process.env.VITE_FICHES_API_URL=base+'/__test_api'
const vite=await createServer({cacheDir:'/tmp/clairfle-guided-oral-browser',server:{host:'127.0.0.1',port:5182,strictPort:true}})
await vite.listen()
const {demoRecipe}=await vite.ssrLoadModule('/src/interactive/demo.ts')
const {defaultPage}=await vite.ssrLoadModule('/src/math/catalog.ts')
const {convertRecipe}=await vite.ssrLoadModule('/src/interactive/domain/convert.ts')
const oral=(domain,id)=>({...defaultPage(domain),topic:'tcf-po',exerciseType:'tcf-po',tcfBankId:id,count:1,extraBlocks:undefined,libreItems:undefined})
const recipe={...demoRecipe(),seed:20261114,pages:[oral('tcf-csc','tcf-a0a1-po-img-accident-velo'),oral('tcf-cfr','tcf-a1a2-po-img-accident'),{...defaultPage('algèbre'),count:1,libreItems:[{layout:'inline',a:2,b:2,op:'+',missing:'result',answer:'4'}]}]}
const before=structuredClone(recipe),source=convertRecipe(recipe),model=source.corrections[source.questions[0].id].text
assert.equal(source.questions.length,3)
const saved={id:'guided-oral',name:'Récit et interaction',domains:['tcf-csc','tcf-cfr'],recipe,createdAt:'2026-11-14T00:00:00Z',updatedAt:'2026-11-14T00:00:00Z'}
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH||undefined,args:['--no-sandbox']})
const results=[],errors=[],methods=[]
const viewports=[[390,844],[1366,768],[360,640]].filter(([width])=>!process.env.GUIDED_ORAL_TEST_WIDTH||width===Number(process.env.GUIDED_ORAL_TEST_WIDTH))
assert.ok(viewports.length,'A supported guided oral viewport is required')
const button=(page,name)=>page.getByRole('button',{name,exact:true})
const scenes=page=>page.locator('.ci-sequence .ci-image-zoom > img').evaluateAll(images=>images.map(image=>image.alt))
async function setup(width,height,mode='class',fixture=saved){
  const context=await browser.newContext({viewport:{width,height},acceptDownloads:true,hasTouch:width<=700})
  await context.addCookies([{name:'clairfle-fiche-access',value:'admin',url:base}])
  await context.addInitScript(mode=>{
    localStorage.setItem('clairfle-fiche-sync','guided-oral-fixture-only')
    localStorage.setItem('clairfle.interactive.timer.v1',JSON.stringify({enabled:false,seconds:10,feedbackSeconds:1}))
    localStorage.setItem('clairfle.interactive.mode.v1',mode)
  },mode)
  await context.route('**/__test_api/fiches',route=>{methods.push(route.request().method());return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({fiches:[fixture]})})})
  const page=await context.newPage();page.setDefaultTimeout(30000);page.on('pageerror',error=>errors.push(error.message))
  console.log(`Guided oral ${mode} ${width}x${height}`)
  await page.goto(`${base}/interactif/${saved.id}`);await page.locator('.ci-launch:enabled').waitFor({timeout:120000})
  if(mode==='solo'&&await page.locator('.ci-app').getAttribute('data-mode')!=='solo'){
    const toggle=button(page,'Mode de jeu')
    if(await toggle.getAttribute('aria-pressed')!=='true')await toggle.click()
    await page.locator('.ci-launch:enabled').waitFor()
  }
  return {context,page}
}
async function preload(page){await button(page,'Précharger toute la séance').click();await page.getByRole('status').filter({hasText:'Prêt à jouer sans connexion'}).waitFor()}
async function axe(page){const scan=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();assert.deepEqual(scan.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})),[])}
async function navigate(page,index){await page.getByRole('button',{name:/^Choisir une question ·/}).click();await page.getByRole('dialog',{name:'Choisir une question',exact:true}).locator('li button').nth(index).click()}
async function pictures(page){const images=await page.locator('.ci-sequence .ci-image-zoom > img,.ci-oral-gallery .ci-image-zoom > img').all();assert.ok(images.length);for(const image of images)assert.ok(await image.evaluate(async image=>{await image.decode();return image.naturalWidth>0&&image.src.startsWith('blob:')}))}
async function fits(page){
  const vp=page.viewportSize();assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false)
  try{await page.waitForFunction(()=>{const manual=document.querySelector('.ci-manual');return manual&&manual.scrollHeight<=manual.clientHeight+1})}catch(error){
    await page.screenshot({path:'/tmp/clairfle-oral-layout-failure.png'})
    console.log(await page.locator('.ci-question,.ci-manual,.ci-controls,.ci-margin-left,.ci-margin-right').evaluateAll(nodes=>nodes.map(node=>({class:node.className,client:node.clientHeight,scroll:node.scrollHeight,box:node.getBoundingClientRect().toJSON()}))))
    throw error
  }
  for(const node of await page.locator('.ci-controls:visible').all()){const box=await node.boundingBox();assert.ok(box&&box.x>=-1&&box.y>=-1&&box.x+box.width<=vp.width+1&&box.y+box.height<=vp.height+1,JSON.stringify({vp,box}))}
  for(const node of await page.locator('.ci-scene-position:visible').all()){const box=await node.boundingBox();assert.ok(box.width>=44&&box.height>=44)}
}
async function privateUntilReveal(page){assert.equal(await page.locator('.ci-model-answer').count(),0);assert.ok(!(await page.locator('body').textContent()).includes(model));assert.equal(await page.getByRole('dialog',{name:'Exemple de réponse',exact:true}).count(),0)}
async function history(page,mode){const records=await waitForBrowserValue(page,async()=>{const {requestLocal}=await import('/src/interactive/storage.ts');const records=await requestLocal('sessions','readonly',store=>store.getAll());return records.some(record=>record.checkpoint?.state.finished)?records:null});const record=records.find(record=>record.mode===mode&&record.checkpoint?.state.finished);assert.ok(record);return record.checkpoint.state.history}
try{
  await mkdir('docs/interactive/screenshots',{recursive:true})
  for(const [width,height]of viewports){
    const {context,page}=await setup(width,height)
    await preload(page);await context.setOffline(true);await page.locator('.ci-launch').click();await page.locator('.ci-sequence').waitFor()
    assert.deepEqual(await scenes(page),['Scène 1','Scène 2','Scène 3','Scène 4']);await privateUntilReveal(page);await pictures(page);await fits(page)
    await page.locator('.ci-oral-situation summary').click();assert.ok((await page.locator('.ci-oral-situation').innerText()).includes('Votre objectif : expliquer votre accident'));await page.locator('.ci-oral-situation summary').click()
    for(let index=1;index<=4;index++){
      const zoom=button(page,`Agrandir : Scène ${index}`);await zoom.click()
      const dialog=page.getByRole('dialog',{name:`Image agrandie : Scène ${index}`,exact:true});await dialog.waitFor()
      assert.ok(await dialog.locator('.ci-image-pan img').evaluate(async image=>{await image.decode();return image.naturalWidth>0&&image.src.startsWith('blob:')}))
      await dialog.getByRole('button',{name:'Agrandir l’image',exact:true}).click();await page.keyboard.press('Escape');await dialog.waitFor({state:'hidden'})
      assert.equal(await zoom.evaluate(node=>node===document.activeElement),true)
    }
    const zones=page.locator('.ci-sequence > [data-ci-order-zone]')
    await dragSequence(page,zones.nth(0),zones.nth(2),{screenshot:`docs/interactive/screenshots/image-drag-${width}.png`});assert.deepEqual(await scenes(page),['Scène 2','Scène 3','Scène 1','Scène 4'])
    assert.equal(await page.locator('.ci-image-dialog:visible').count(),0)
    await button(page,'Annuler le déplacement').click()
    await dragSequence(page,zones.nth(3),zones.nth(0),{touch:true});assert.deepEqual(await scenes(page),['Scène 4','Scène 1','Scène 2','Scène 3'])
    await button(page,'Annuler le déplacement').click()
    for(const options of [{finish:'escape'},{touch:true,finish:'cancel'},{touch:true,finish:'outside'}]){await dragSequence(page,zones.nth(0),zones.nth(3),options);assert.deepEqual(await scenes(page),['Scène 1','Scène 2','Scène 3','Scène 4'])}
    await button(page,'Choisir la scène 1, place 1').click();await button(page,'Choisir la scène 3, place 3').click()
    assert.deepEqual(await scenes(page),['Scène 2','Scène 3','Scène 1','Scène 4'])
    await button(page,'Annuler le déplacement').click();assert.deepEqual(await scenes(page),['Scène 1','Scène 2','Scène 3','Scène 4'])
    await button(page,'Choisir la scène 1, place 1').focus();await page.keyboard.press('ArrowRight')
    assert.deepEqual(await scenes(page),['Scène 2','Scène 1','Scène 3','Scène 4'])
    assert.equal(await button(page,'Choisir la scène 1, place 2').evaluate(node=>node===document.activeElement),true)
    await button(page,'Choisir la scène 4, place 4').focus();await page.keyboard.press('ArrowLeft');await button(page,'Annuler le déplacement').click()
    await button(page,'Commencer l’échange').click();await button(page,'Proposer une relance').click();await button(page,'Proposer une relance').click()
    const hints=await page.locator('.ci-oral-hints p').allTextContents();assert.deepEqual(hints,source.questions[0].hints.slice(0,2))
    await button(page,'Verrouiller les commandes').click();assert.equal(await button(page,'Proposer une relance').isEnabled(),false);assert.equal(await page.locator('.ci-scene-position:enabled').count(),0)
    await button(page,'Déverrouiller les commandes').click();await button(page,'Pause').click();await page.locator('.ci-pause').waitFor();await button(page,'Reprendre').click()
    await navigate(page,1);assert.equal(await page.locator('.ci-sequence').count(),0);await pictures(page);await privateUntilReveal(page);await fits(page)
    assert.equal(await page.locator('.ci-oral-gallery .ci-image-zoom > img').count(),1)
    await button(page,'Agrandir : Document 1').click();await page.getByRole('dialog',{name:'Image agrandie : Document 1',exact:true}).waitFor();await page.keyboard.press('Escape')
    await navigate(page,0);assert.deepEqual(await scenes(page),['Scène 2','Scène 1','Scène 3','Scène 4']);assert.deepEqual(await page.locator('.ci-oral-hints p').allTextContents(),hints)
    await context.setOffline(false);await page.reload();await page.locator('.ci-launch:enabled').waitFor({timeout:120000});await preload(page);await context.setOffline(true)
    await page.locator('.ci-launch').click();await page.locator('.ci-sequence').waitFor()
    assert.deepEqual(await scenes(page),['Scène 2','Scène 1','Scène 3','Scène 4']);assert.deepEqual(await page.locator('.ci-oral-hints p').allTextContents(),hints);await privateUntilReveal(page)
    await fits(page);await axe(page);await page.screenshot({path:`docs/interactive/screenshots/guided-oral-${width}.png`})
    await button(page,'Discuter').click();await button(page,'Enseignant : révéler').click();await page.locator('.ci-model-answer').waitFor()
    assert.ok((await page.locator('.ci-model-content').innerText()).includes('Exemple d’échange'))
    await button(page,'Acquis').click();assert.equal(await button(page,'Acquis').getAttribute('aria-pressed'),'true')
    const read=button(page,'Lire le modèle');await read.click()
    const dialog=page.getByRole('dialog',{name:'Exemple de réponse',exact:true});await dialog.waitFor();assert.ok((await dialog.innerText()).includes('Non, je crois qu’il va bien.'))
    await axe(page);await page.screenshot({path:`docs/interactive/screenshots/guided-oral-model-${width}.png`})
    await page.keyboard.press('Escape');await dialog.waitFor({state:'detached'});assert.equal(await read.evaluate(node=>node===document.activeElement),true)
    await button(page,'Quitter la séance').click();await page.locator('.ci-launch:enabled').waitFor();await page.locator('.ci-launch').click();await page.locator('.ci-model-answer').waitFor()
    assert.equal(await button(page,'Acquis').getAttribute('aria-pressed'),'true')
    await button(page,'Terminer la séance').click();await button(page,'Terminer et voir le bilan').click();await page.locator('.ci-summary').waitFor()
    assert.ok((await page.locator('.ci-summary').innerText()).includes('Acquis selon l’enseignant'))
    const answers=await history(page,'class');assert.equal(answers.find(answer=>answer.manual==='acquired').correct,undefined)
    const records=await page.evaluate(async()=>{const {requestLocal}=await import('/src/interactive/storage.ts');return JSON.stringify(await requestLocal('sessions','readonly',store=>store.getAll()))})
    assert.ok(!records.includes('Exemple d’échange'));assert.ok(!records.includes('blob:'))
    results.push({class:`${width}x${height}`,source:'Real CSC four-picture cycling incident and CFR single-picture scene',viewer:'All four real images decode from prepared blobs; zoom and Escape restore focus; mouse and native touch drag insert into numbered zones with a following preview; Escape, cancelled touch and outside drops cancel; tap, keyboard, undo, lock and pause work',resume:'Order and staged prompts survive navigation and connected reload; new preparation restores offline operation; teacher appreciation survives returning to preparation',privacy:'Narration and complete dialogue absent before teacher reveal; full model readable afterwards; no model or blob address stored in journals',grading:'Teacher appreciation only; remaining activities skipped without an automatic oral verdict',axeViolations:0})
    await context.close()
  }
  if(viewports.some(([width])=>width===360))for(const count of [2,3]){
    const exercise=JSON.parse(await readFile('src/tcf/content/a0-a1/po.json','utf8')).find(exercise=>exercise.id==='tcf-a0a1-po-img-accident-velo')
    exercise.support.images=exercise.support.images.slice(0,count)
    const edited={...saved,recipe:{...recipe,pages:[{...recipe.pages[0],libreItems:[{layout:'tcf',answer:'',tcf:{kind:'support',exercise}}]}]}}
    assert.equal(convertRecipe(edited.recipe).questions[0].images.length,count)
    const before=structuredClone(edited),{context,page}=await setup(360,640,'class',edited)
    await preload(page);await context.setOffline(true);await page.locator('.ci-launch').click();await page.locator('.ci-oral-gallery').waitFor()
    await pictures(page);await fits(page);assert.equal(await page.locator('.ci-oral-gallery .ci-image-zoom > img').count(),count)
    for(let index=1;index<=count;index++){await button(page,`Agrandir : Document ${index}`).click();await page.getByRole('dialog',{name:`Image agrandie : Document ${index}`,exact:true}).waitFor();await page.keyboard.press('Escape')}
    await axe(page);assert.deepEqual(edited,before)
    await page.screenshot({path:`docs/interactive/screenshots/guided-oral-${count}-images-360.png`})
    results.push({editedImages:count,viewport:'360x640',viewer:'All explicitly edited images decode offline, fill the central gallery, fit without scrolling and open their individual zooms',axeViolations:0})
    await context.close()
  }
  for(const [width,height]of viewports){
    const {context,page}=await setup(width,height,'solo');await preload(page);await context.setOffline(true);await page.locator('.ci-launch').click();await page.locator('.ci-sequence').waitFor()
    for(let index=0;index<2;index++){
      await privateUntilReveal(page);await button(page,'Voir le modèle').click();await button(page,'Lire le modèle').click()
      const dialog=page.getByRole('dialog',{name:'Exemple de réponse',exact:true});await dialog.waitFor()
      await page.waitForTimeout(1300)
      assert.ok((await page.locator('.ci-progress').innerText()).includes(`Question ${index+1} / 3`))
      await page.keyboard.press('Escape');await dialog.waitFor({state:'detached'})
      await page.locator('.ci-progress').filter({hasText:`Question ${index+2} / 3`}).waitFor()
    }
    await page.locator('.ci-answer:enabled').filter({has:page.locator('.ci-answer-content').getByText('4',{exact:true})}).click();await page.locator('.ci-summary').waitFor()
    const answers=await history(page,'solo');assert.deepEqual(answers.map(answer=>answer.correct),[undefined,undefined,true])
    results.push({solo:`${width}x${height}`,reading:'Full narration and dialogue pause the one-second automatic transition until Escape; next scene and numeric question then progress automatically',grading:'Two oral activities remain ungraded, while the real numeric answer retains its automatic verdict'})
    await context.close()
  }
  assert.deepEqual(recipe,before);assert.ok(methods.length&&methods.every(method=>method==='GET'));assert.deepEqual(errors,[])
  await writeFile('docs/interactive/guided-oral-results.json',JSON.stringify({results,errors,serverWritesToFicheApi:0,sourceRecipe:'unchanged',scope:'M14-lite guided oral, not automatic story-order grading'},null,2)+'\n');console.log(JSON.stringify(results,null,2))
}finally{await browser.close();await vite.close()}
