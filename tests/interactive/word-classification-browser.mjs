import assert from 'node:assert/strict'
import {mkdir,writeFile} from 'node:fs/promises'
import {createServer} from 'vite'
import {chromium} from 'playwright'
import AxeBuilder from '@axe-core/playwright'
import {waitForBrowserValue} from './browser-actions.mjs'

const base='http://127.0.0.1:5182'
process.env.VITE_FICHES_API_URL=base+'/__test_api'
const vite=await createServer({cacheDir:'/tmp/clairfle-word-classification',server:{host:'127.0.0.1',port:5182,strictPort:true}})
await vite.listen()
const {demoRecipe}=await vite.ssrLoadModule('/src/interactive/demo.ts')
const {defaultPage}=await vite.ssrLoadModule('/src/math/catalog.ts')
const {buildPage}=await vite.ssrLoadModule('/src/math/generate.ts')
const {PHRASE_CATEGORY_LABELS}=await vite.ssrLoadModule('/src/francais/phrase-banks.ts')
const config={...defaultPage('gattegno'),topic:'phrase-adjectif',exerciseType:'phrase-adjectif-colorier',count:1,columns:1,verbGroup:'mixte',phrasePolarity:'mixed',libreItems:undefined,extraBlocks:undefined}
let source,seed,pair
for(seed=1;seed<=100;seed++){
  const item=buildPage(config,seed).blocks[0].items[0],cats=[...new Set(item.tokens.map(token=>token.category))]
  const repeated=item.tokens.flatMap((token,index)=>item.tokens.flatMap((other,next)=>next>index&&next<item.tokens.length-2&&other.category===token.category?[[index,next]]:[]))[0]
  if(item.tokens.length<=11&&cats.length>=3&&cats.length<=6&&repeated){source=item;pair=repeated;break}
}
assert.ok(source,'A real source sentence with reusable categories must be available.')
const recipe={...demoRecipe(),seed,libreMode:true,pages:[{...config,libreItems:[source]}]},original=structuredClone(recipe)
const saved={id:'word-classification',name:'Tri Gattegno',recipe,domains:['gattegno'],createdAt:'2026-11-13T00:00:00Z',updatedAt:'2026-11-13T00:00:00Z'}
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH||undefined,args:['--no-sandbox']})
const results=[],errors=[],methods=[]
let readingChecks=0
const button=(page,name)=>page.getByRole('button',{name,exact:true})
const card=(page,text)=>page.locator('.ci-answer').filter({has:page.locator('.ci-answer-content').getByText(text,{exact:true})})
async function setup(width=390,height=844){
  const context=await browser.newContext({viewport:{width,height}})
  await context.addCookies([{name:'clairfle-fiche-access',value:'admin',url:base}])
  await context.addInitScript(()=>{
    localStorage.setItem('clairfle-fiche-sync','classification-fixture-only')
    localStorage.setItem('clairfle.interactive.timer.v1',JSON.stringify({enabled:false,seconds:5,feedbackSeconds:1}))
  })
  await context.route('**/__test_api/fiches',async route=>{methods.push(route.request().method());await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({fiches:[saved]})})})
  const page=await context.newPage();page.on('pageerror',error=>errors.push(error.message))
  await page.goto(`${base}/interactif/${saved.id}`);await page.locator('.ci-launch:enabled').waitFor({timeout:120000})
  return {page,context}
}
async function selection(page,indices){
  await button(page,'Tout désélectionner').click()
  for(const index of indices)await page.locator('.ci-question-list fieldset > label input[type=checkbox]').nth(index).check()
  await page.locator('.ci-launch:enabled').waitFor()
}
async function checkWord(page,target){
  await page.locator('.ci-classification-progress').filter({hasText:`Élément ${target+1}/${source.tokens.length}`}).waitFor()
  assert.equal(await page.locator('.ci-classification-target').innerText(),source.tokens[target].text)
  assert.equal(await page.locator('.ci-classification-target').count(),1)
  assert.deepEqual(await page.locator('.ci-classification-sentence span').allTextContents(),source.tokens.map(token=>token.text))
  const neutral=await page.locator('.ci-classification-sentence span').evaluateAll(nodes=>nodes.map(node=>({color:getComputedStyle(node).color,style:node.getAttribute('style'),category:node.getAttribute('data-category')})))
  assert.equal(new Set(neutral.map(word=>word.color)).size,1)
  assert.ok(neutral.every(word=>word.style===null&&word.category===null))
}
async function fits(page){
  const vp=page.viewportSize()
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false)
  for(const element of await page.locator('.ci-classification-target,.ci-answer,.ci-controls,.ci-competition-host-controls').all()){
    const rect=await element.boundingBox()
    if(rect)assert.ok(rect.x>=-1&&rect.y>=-1&&rect.x+rect.width<=vp.width+1&&rect.y+rect.height<=vp.height+1,JSON.stringify({vp,rect}))
  }
}
async function reveal(page){await button(page,'Signal : levez vos cartes').click();await button(page,'Discuter').click();await button(page,'Enseignant : révéler').click()}
try{
  await mkdir('docs/interactive/screenshots',{recursive:true})
  for(const [width,height]of [[390,844],[1366,768],[360,640]]){
    const {page,context}=await setup(width,height)
    assert.equal(await page.locator('.ci-question-list fieldset > label').count(),source.tokens.length)
    await page.locator('.ci-launch').click();await checkWord(page,0);await fits(page)
    const readMore=page.getByRole('button',{name:/Lire la question et le document/})
    if(await readMore.isVisible()){
      await readMore.click()
      const dialog=page.getByRole('dialog',{name:'Question et document',exact:true})
      await dialog.waitFor()
      assert.deepEqual(await dialog.locator('.ci-classification-sentence span').allTextContents(),source.tokens.map(token=>token.text))
      assert.equal(await dialog.locator('.ci-classification-target').innerText(),source.tokens[0].text)
      const scan=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()
      assert.deepEqual(scan.violations.map(v=>({id:v.id,impact:v.impact})),[])
      await page.keyboard.press('Escape');assert.equal(await readMore.evaluate(node=>node===document.activeElement),true);readingChecks++
    }
    assert.equal(await page.locator('.ci-answer:enabled').count(),0)
    const labels=await page.locator('.ci-answer-content').allTextContents()
    await reveal(page)
    assert.equal((await page.locator('.ci-answer-key .ci-answer-content').innerText()).trim(),PHRASE_CATEGORY_LABELS[source.tokens[0].category])
    assert.equal(await page.locator('.ci-answer-muted').count(),labels.length-1)
    await button(page,'Question suivante').click();await checkWord(page,1)
    assert.deepEqual(await page.locator('.ci-answer-content').allTextContents(),labels)
    assert.equal(await page.locator('.ci-answer-used').count(),0)
    const scan=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()
    assert.deepEqual(scan.violations.map(v=>({id:v.id,impact:v.impact})),[])
    await page.screenshot({path:`docs/interactive/screenshots/word-classification-${width}.png`,fullPage:true})
    await page.reload();await button(page,'Reprendre la séance').click();await checkWord(page,1)
    assert.deepEqual(await page.locator('.ci-answer-content').allTextContents(),labels)
    await page.getByRole('button',{name:/^Choisir une question ·/}).click()
    await page.getByRole('dialog',{name:'Choisir une question',exact:true}).locator('li button').first().click()
    await checkWord(page,0);await page.locator('.ci-answer-key').waitFor()
    results.push({viewport:`${width}x${height}`,class:'one neutral source element highlighted in its complete phrase; fixed category cards; no pupil selection; correction only in the cards',resume:'word position, category slots and revealed state retained after reload and navigation',axeViolations:0})
    await context.close()
  }
  const solo=await setup(),page=solo.page,indices=[...pair,source.tokens.length-2,source.tokens.length-1]
  await selection(page,indices);await button(page,'Mode de jeu').click()
  await page.getByRole('checkbox',{name:'Activer le minuteur',exact:true}).check()
  await page.locator('.ci-launch:enabled').waitFor();await page.locator('.ci-launch').click()
  const reused=PHRASE_CATEGORY_LABELS[source.tokens[pair[0]].category]
  for(const index of pair){
    await checkWord(page,index)
    assert.equal(await card(page,reused).isEnabled(),true)
    await card(page,reused).click();await page.locator('.ci-answer-key').waitFor()
  }
  await checkWord(page,indices[2])
  const wrong=await page.locator('.ci-answer').filter({hasNot:page.locator('.ci-answer-content').getByText(PHRASE_CATEGORY_LABELS[source.tokens[indices[2]].category],{exact:true})}).first()
  await wrong.click();await page.locator('.ci-answer-key').waitFor()
  await checkWord(page,indices[3]);await page.locator('.ci-answer-key').waitFor({timeout:15000})
  assert.ok(!/sans réponse/i.test(await page.locator('.ci-correction-status').innerText()))
  await page.locator('.ci-summary').waitFor()
  await waitForBrowserValue(page,async()=>{const {requestLocal}=await import('/src/interactive/storage.ts');return(await requestLocal('sessions','readonly',store=>store.getAll())).some(record=>record.mode==='solo'&&record.checkpoint?.state.finished)})
  const verdicts=await page.evaluate(async()=>{const {requestLocal}=await import('/src/interactive/storage.ts');return(await requestLocal('sessions','readonly',store=>store.getAll())).find(record=>record.mode==='solo'&&record.checkpoint?.state.finished).checkpoint.state.history.map(attempt=>attempt.correct)})
  assert.deepEqual(verdicts,[true,true,false,false])
  results.push({solo:'same category accepted twice; wrong answer and timeout corrected; automatic next step; durable score 2/4'})
  await solo.context.close()

  for(const [width,height]of [[390,844],[1366,768],[360,640]]){
    const local=await setup(width,height),page=local.page;await selection(page,pair)
    await button(page,'Régler le minuteur').click()
    await page.getByRole('spinbutton',{name:'Temps entre les questions (secondes)',exact:true}).fill('10')
    await button(page,'Fermer les réglages').click();await button(page,'Compétition').click()
    await button(page,'Préparer le défi local').click();await page.getByRole('heading',{name:'Défi sur cet appareil',exact:true}).waitFor()
    await button(page,'Panda').click();await button(page,'Ajouter cette mascotte').click()
    await button(page,'Renard').click();await button(page,'Ajouter cette mascotte').click()
    await local.context.setOffline(true);await button(page,'Commencer la compétition').click()
    for(const [question,target]of pair.entries()){
      for(let player=0;player<2;player++){
        await page.getByRole('heading',{name:'À toi !',exact:true}).waitFor();assert.equal(await page.locator('.ci-word-classification').count(),0)
        await button(page,'Je suis prêt').click();await checkWord(page,target);await fits(page)
        const label=PHRASE_CATEGORY_LABELS[source.tokens[target].category]
        assert.equal(await card(page,label).isEnabled(),true)
        await card(page,label).click()
      }
      await page.locator('.ci-answer-key').waitFor()
      if(question===0)await button(page,'Question suivante').click()
    }
    await page.screenshot({path:`docs/interactive/screenshots/word-classification-local-${width}.png`,fullPage:true})
    await button(page,'Question suivante').click();await page.getByRole('heading',{name:'Bravo à tous !',exact:true}).waitFor()
    const scores=(await page.locator('.ci-competition-score b').allTextContents()).map(text=>text.replace(/\s/g,''))
    assert.deepEqual(scores,['2000points','2000points'])
    const journal=await page.evaluate(()=>Object.keys(sessionStorage).filter(key=>key.startsWith('clairfle.competition.local.')).map(key=>sessionStorage.getItem(key))[0])
    assert.ok(!journal.includes('tokens'));assert.ok(!journal.includes('correctChoiceId'))
    results.push({local:`${width}x${height}`,offline:'two avatars, two occurrences with the same category, complete sentence retained; handoff hides the question; 2000 points each; no source tokens or answer key in the journal'})
    await local.context.close()
  }
  assert.deepEqual(recipe,original);assert.ok(methods.length&&methods.every(method=>method==='GET'));assert.deepEqual(errors,[]);assert.ok(readingChecks>0)
  await writeFile('docs/interactive/word-classification-results.json',JSON.stringify({results,readingChecks,fullReading:'Complete neutral sentence and target retained in the small-screen reading dialog; Escape restores focus; axe passes.',sourceSeed:seed,sourceTokens:source.tokens.map(token=>token.text),errors,serverWritesToFicheApi:0},null,2)+'\n')
  console.log(JSON.stringify(results,null,2))
}catch(error){console.error(error);throw error}
finally{await browser.close();await vite.close()}
