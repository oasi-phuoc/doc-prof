import assert from 'node:assert/strict'
import {mkdir,writeFile} from 'node:fs/promises'
import {createServer} from 'vite'
import {chromium} from 'playwright'
import AxeBuilder from '@axe-core/playwright'
import {dragSequence} from './sequence-drag-actions.mjs'
import {waitForBrowserValue} from './browser-actions.mjs'

const base='http://127.0.0.1:5182'
process.env.VITE_FICHES_API_URL=base+'/__test_api'
const vite=await createServer({cacheDir:'/tmp/clairfle-long-word-browser',server:{host:'127.0.0.1',port:5182,strictPort:true}})
await vite.listen()
const {demoRecipe}=await vite.ssrLoadModule('/src/interactive/demo.ts')
const {defaultPage}=await vite.ssrLoadModule('/src/math/catalog.ts')
const {interrogativeCandidates}=await vite.ssrLoadModule('/src/francais/phrase-interrogatives.ts')
const {tagged}=await vite.ssrLoadModule('/src/francais/phrase-sentences.ts')
const {phraseSentence}=await vite.ssrLoadModule('/src/francais/phrase-forms.ts')
const words='Le petit garçon regarde attentivement les oiseaux dans le grand jardin voisin'.split(' '),model=words.join(' ')+'.'
const question=interrogativeCandidates(tagged('Le/determinant petit/adjectif garçon/nom ne/adverbe regarde/verbe pas/adverbe les/determinant oiseaux/nom du/preposition jardin/nom'),['regarder']).find(q=>q.form==='pourquoi')
const ordered=question.tokens.map(t=>({...t,text:t.text.toLowerCase()})),questionModel=phraseSentence(question.tokens,true,true)
const recipe={...demoRecipe(),seed:91,pages:[{...defaultPage('gattegno'),topic:'phrase-simple',exerciseType:'phrase-simple-ordre',verbGroup:'libre',count:2,extraBlocks:undefined,phraseItems:[
  {layout:'phrase-order',tokens:[...words.slice(1),words[0]].map(text=>({text,category:'nom'})),labels:words,answer:model,responseAnswer:model},
  {layout:'phrase-order',phraseQuestion:true,phraseQuestionForm:question.form,tokens:[...ordered.slice(1),ordered[0]],labels:ordered.map(t=>(t.joinBefore??'')+t.text),answer:questionModel,responseAnswer:questionModel},
]},{...defaultPage('algèbre'),count:1,libreItems:[{layout:'inline',a:2,b:2,op:'+',missing:'result',answer:'4'}]}]}
const before=structuredClone(recipe),saved={id:'long-word-order',name:'Phrases longues',recipe,domains:['gattegno'],createdAt:'2026-11-14T00:00:00Z',updatedAt:'2026-11-14T00:00:00Z'}
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH||undefined,args:['--no-sandbox']})
const results=[],errors=[],methods=[]
let activePage
const button=(page,name)=>page.getByRole('button',{name,exact:true})
const zones=page=>page.locator('.ci-word-sequence > button')
const positions=page=>zones(page).evaluateAll(nodes=>nodes.map(node=>Number(node.dataset.ciSourceIndex)))
async function expectPositions(page,expected){await page.waitForFunction(expected=>JSON.stringify([...document.querySelectorAll('.ci-word-sequence > button')].map(node=>Number(node.dataset.ciSourceIndex)))===JSON.stringify(expected),expected)}
async function fit(page){
  await page.waitForFunction(()=>{
    const manual=document.querySelector('.ci-manual'),controls=document.querySelector('.ci-controls'),zones=[...document.querySelectorAll('.ci-word-sequence > button')],undo=[...document.querySelectorAll('button')].find(n=>n.getAttribute('aria-label')==='Annuler le déplacement')
    if(!manual||!controls||!undo||zones.length!==12||document.documentElement.scrollWidth>innerWidth)return false
    const area=manual.getBoundingClientRect(),c=controls.getBoundingClientRect()
    return c.bottom<=innerHeight+1&&[...zones,undo].every(node=>{const b=node.getBoundingClientRect();return b.width>=44&&b.height>=44&&b.left>=-1&&b.right<=innerWidth+1&&b.top>=area.top-1&&b.bottom<=area.bottom+1&&b.bottom<=innerHeight+1})
  },{},{timeout:10000})
}
async function navigate(page,index){await page.getByRole('button',{name:/^Choisir une question ·/}).click();await page.getByRole('dialog',{name:'Choisir une question',exact:true}).locator('li button').nth(index).click();await zones(page).first().waitFor({state:index===2?'detached':'visible'})}
async function axe(page){const report=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();assert.deepEqual(report.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})),[])}
try{
  await mkdir('docs/interactive/screenshots',{recursive:true})
  for(const [width,height]of [[1920,1080],[1366,768],[390,844],[360,640]].filter(([width])=>!process.env.LONG_WORD_TEST_WIDTH||width===Number(process.env.LONG_WORD_TEST_WIDTH))){
    console.log(`Long word ordering ${width}x${height}`)
    const context=await browser.newContext({viewport:{width,height},hasTouch:width<=700})
    await context.addCookies([{name:'clairfle-fiche-access',value:'admin',url:base}])
    await context.addInitScript(()=>{
      localStorage.setItem('clairfle-fiche-sync','long-word-fixture-only')
      localStorage.setItem('clairfle.interactive.mode.v1','class')
      localStorage.setItem('clairfle.interactive.timer.v1',JSON.stringify({enabled:false,seconds:30,feedbackSeconds:1}))
      localStorage.setItem('clairfle.interactive.toolbar-guard.v1',JSON.stringify('none'))
    })
    await context.route('**/__test_api/fiches',route=>{methods.push(route.request().method());return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({fiches:[saved]})})})
    const page=await context.newPage();activePage=page;page.setDefaultTimeout(30000);page.on('pageerror',error=>errors.push(error.message))
    await page.goto(base+'/interactif/'+saved.id);await page.locator('.ci-launch:enabled').waitFor({timeout:120000})
    assert.equal(await page.locator('.ci-question-list fieldset > label').count(),3)
    await button(page,'Précharger toute la séance').click();await page.getByRole('status').filter({hasText:'Prêt à jouer sans connexion'}).waitFor({timeout:120000})
    await page.locator('.ci-launch').click();await zones(page).nth(11).waitFor();await fit(page)
    if(width<=700){const bounds=await page.locator('.ci-header-tools .ci-icon-button:visible').evaluateAll(nodes=>nodes.map(node=>node.getBoundingClientRect().toJSON()));const tops=bounds.map(b=>b.top);assert.ok(Math.max(...tops)-Math.min(...tops)<1&&bounds.every(b=>b.width>=44&&b.height>=44),'All eight menu icons fit on one mobile row with 44 px targets')}
    assert.equal(await page.locator('.ci-answer,.ci-model-answer').count(),0)
    await context.setOffline(true)
    const initial=await positions(page),last=[...initial.slice(1),initial[0]]
    await dragSequence(page,zones(page).first(),zones(page).last(),{touch:width<=700});await expectPositions(page,last);await fit(page)
    await button(page,'Annuler le déplacement').click();await expectPositions(page,initial)
    if(width<=700)await zones(page).first().tap();else await zones(page).first().click()
    await zones(page).first().and(page.locator('[aria-pressed="true"]')).waitFor()
    if(width<=700)await zones(page).last().tap();else await zones(page).last().click()
    await expectPositions(page,last);await button(page,'Annuler le déplacement').click();await expectPositions(page,initial)
    await zones(page).first().focus();await page.keyboard.press('ArrowRight')
    const moved=[initial[1],initial[0],...initial.slice(2)];await expectPositions(page,moved)
    await button(page,'Lire tous les mots').click()
    const reading=page.getByRole('dialog',{name:'Question et document',exact:true})
    for(const word of words)assert.ok((await reading.innerText()).includes(word))
    assert.equal((await reading.innerText()).includes(model),false)
    await page.keyboard.press('Escape');await reading.waitFor({state:'detached'});assert.equal(await button(page,'Lire tous les mots').evaluate(n=>n===document.activeElement),true)
    await dragSequence(page,zones(page).first(),zones(page).last(),{touch:width<=700,finish:'outside'});await expectPositions(page,moved)
    await button(page,'Verrouiller les commandes').click();assert.equal(await zones(page).and(page.locator(':enabled')).count(),0)
    await button(page,'Déverrouiller les commandes').click()
    await button(page,'Plein écran').click();await page.locator('.ci-immersive').waitFor();await fit(page)
    assert.deepEqual(await page.locator('.ci-header-tools .ci-icon-button:visible').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('aria-label'))),['Quitter le plein écran'])
    await button(page,'Quitter le plein écran').click()
    await navigate(page,2);await navigate(page,0);await expectPositions(page,moved);await fit(page)
    await context.setOffline(false);await button(page,'Quitter la séance').click();await page.locator('.ci-launch:enabled').waitFor();await page.reload();await button(page,'Reprendre la séance').click()
    await zones(page).nth(11).waitFor();await expectPositions(page,moved);await fit(page)
    await page.screenshot({path:`docs/interactive/screenshots/long-word-order-${width}.png`})
    assert.ok(await zones(page).locator('b').evaluateAll(nodes=>nodes.every(n=>{const s=getComputedStyle(n),range=document.createRange();range.selectNodeContents(n);return s.whiteSpace==='nowrap'&&Number.parseFloat(s.fontSize)>=14&&range.getBoundingClientRect().width<=n.parentElement.clientWidth+1})), 'Every source word remains readable on one line')
    await navigate(page,1);await fit(page)
    assert.ok((await zones(page).locator('b').allTextContents()).includes('-t-il'));assert.equal(await page.locator('.ci-model-answer').count(),0)
    await axe(page)
    await button(page,'Commencer l’échange').click();await button(page,'Discuter').click();await button(page,'Enseignant : révéler').click()
    await page.locator('.ci-model-answer').waitFor();assert.ok((await page.locator('.ci-model-content').innerText()).includes(questionModel))
    assert.equal(await page.locator('.ci-word-proposal').count(),1);assert.equal(await zones(page).count(),0)
    if(width<=700)assert.ok(await button(page,'Acquis').evaluate(n=>{const b=n.getBoundingClientRect(),model=n.closest('.ci-model-answer').getBoundingClientRect();return b.top>=model.top&&b.bottom<=Math.min(innerHeight,model.bottom)}), 'Human appreciation remains visible without scrolling after reveal')
    await page.screenshot({path:`docs/interactive/screenshots/long-word-order-review-${width}.png`})
    await button(page,'Acquis').click()
    await waitForBrowserValue(page,async()=>{const{requestLocal}=await import('/src/interactive/storage.ts');return(await requestLocal('sessions','readonly',store=>store.getAll())).some(record=>record.events.some(e=>e.action.type==='ASSESS'&&e.action.value==='acquired'))})
    await axe(page)
    results.push({viewport:`${width}x${height}`,source:'Twelve source elements, repeated words and an inverted question retained completely.',drag:width<=700?'Native Chromium touch from first to twelfth zone; outside release cancels.':'Native mouse drag across rows; outside release cancels.',alternatives:'Touch/click then destination, undo and keyboard movement work.',resume:'All twelve indices survive navigation and a saved-session reload.',privacy:'Source model remains absent before teacher reveal; appreciation is human.',layout:'Twelve zones and undo fit before reveal; each target is at least 44 px; mobile menu stays on one row; fullscreen exit remains available.',offline:'Prepared open page remains manipulable without network.',axeViolations:0})
    await context.close()
  }
  assert.deepEqual(recipe,before);assert.deepEqual(errors,[]);assert.ok(methods.every(method=>method==='GET'))
  await writeFile('docs/interactive/long-word-order-results.json',JSON.stringify({results,errors,apiMethods:methods,liveApiWrites:0,sourceRecipe:'unchanged'},null,2)+'\n');console.log(JSON.stringify(results,null,2))
}catch(error){if(activePage&&!activePage.isClosed()){console.error((await activePage.locator('body').innerText()).slice(-2500));console.error(await activePage.locator('.ci-question,.ci-manual,.ci-word-sequence,.ci-controls,.ci-margin-left').evaluateAll(nodes=>nodes.map(n=>({class:n.className,box:n.getBoundingClientRect().toJSON(),client:n.clientHeight,scroll:n.scrollHeight}))));await activePage.screenshot({path:'/tmp/clairfle-long-word-failure.png',fullPage:true})}throw error}
finally{await browser.close();await vite.close()}
