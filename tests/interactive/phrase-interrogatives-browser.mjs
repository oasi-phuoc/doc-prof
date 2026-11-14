import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { createServer } from 'vite'
import { chromium } from 'playwright'
import AxeBuilder from '@axe-core/playwright'

const base = 'http://127.0.0.1:5182'
process.env.VITE_FICHES_API_URL = base + '/__test_api'
const vite = await createServer({ cacheDir: '/tmp/clairfle-interrogatives-browser', server: { host: '127.0.0.1', port: 5182, strictPort: true } })
await vite.listen()
const { interrogativeCandidates } = await vite.ssrLoadModule('/src/francais/phrase-interrogatives.ts')
const { tagged } = await vite.ssrLoadModule('/src/francais/phrase-sentences.ts')
const { phraseSentence, syntaxModel } = await vite.ssrLoadModule('/src/francais/phrase-forms.ts')
const { phraseImageClues } = await vite.ssrLoadModule('/src/francais/phrase-images.ts')
const { defaultPage } = await vite.ssrLoadModule('/src/math/catalog.ts')
const { demoRecipe } = await vite.ssrLoadModule('/src/interactive/demo.ts')
const { convertRecipe } = await vite.ssrLoadModule('/src/interactive/domain/convert.ts')
const make = (source, lemma, form) => {
  const q = interrogativeCandidates(tagged(source), [lemma]).find(q => q.form === form)
  assert.ok(q); return { ...q, lemma, model: phraseSentence(q.tokens, true, true) }
}
const color = [
  make('Il/pronom mange/verbe une/determinant pomme/nom','manger','est-ce-que'),
  make('Tu/pronom portes/verbe des/determinant livres/nom','porter','quel'),
  make('La/determinant voisine/nom chante/verbe une/determinant chanson/nom','chanter','qui'),
  make('Tu/pronom penses/verbe à/preposition une/determinant histoire/nom','penser','quoi'),
  make('La/determinant fille/nom joue/verbe dans/preposition le/determinant parc/nom','jouer','où'),
  make('Il/pronom mange/verbe une/determinant pomme/nom','manger','inversion'),
]
const svc = [make('La/determinant petite/adjectif fille/nom ne/adverbe mange/verbe pas/adverbe de/determinant pain/nom','manger','pourquoi'),make('Tu/pronom ne/adverbe finis/verbe pas/adverbe ton/determinant exercice/nom','finir','inversion'),color[2]]
const ordering = [color[5],color[2],make('Tu/pronom écris/verbe une/determinant lettre/nom','écrire','que')]
const pictures = [color[0],make('Tu/pronom manges/verbe des/determinant pommes/nom','manger','quel'),color[5]]
const fields = q => ({ phraseQuestion: true, phraseQuestionForm: q.form, tokens: q.tokens, responseAnswer: q.model })
const config = (kind, items, instruction) => ({ ...defaultPage('gattegno'), topic: 'phrase-simple', exerciseType: 'phrase-simple-' + kind, verbGroup: 'libre', count: items.length, phraseItems: items, phraseInstruction: instruction, extraBlocks: undefined })
const recipe = { ...demoRecipe(), seed: 20261114, printCorrections: true, libreMode: false, libreSnapshot: null, pages: [
  config('colorier',color.map(q=>({...fields(q),layout:'phrase-color',answer:q.tokens.map(t=>t.category).join(' · ')})),'Coloriez chaque mot selon sa catégorie.'),
  config('svc',svc.map(q=>({...fields(q),layout:'phrase-svc',answer:syntaxModel(q.tokens)})),'Entourez le sujet et soulignez le verbe.'),
  config('ordre',ordering.map(q=>{const tokens=q.tokens.map(t=>({...t,text:t.text.toLocaleLowerCase('fr')}));return {...fields(q),layout:'phrase-order',tokens:[...tokens.slice(1),tokens[0]],labels:tokens.map(t=>(t.joinBefore??'')+t.text),answer:q.model}}),'Mettez les mots dans l’ordre.'),
  config('images',pictures.map(q=>({...fields(q),layout:'phrase-images',phraseImages:phraseImageClues(q.tokens,[q.lemma]),writeLines:1,answer:q.model})),'Écrivez une question à partir des images.'),
] }
const original = structuredClone(recipe), converted = convertRecipe(recipe)
const linked = converted.questions.findIndex(q => q.wordClassification?.joins?.includes('-t-') && q.wordClassification.tokens[q.wordClassification.target] === 'il')
assert.ok(linked >= 0)
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, args: ['--no-sandbox'] })
const button = (page,name) => page.getByRole('button',{name,exact:true})
const results = [], errors = [], methods = []
let activePage
async function axe(page, selector) {
  const report = await new AxeBuilder({page}).include(selector).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()
  assert.deepEqual(report.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})),[])
}
try {
  await mkdir('docs/gattegno/screenshots',{recursive:true})
  for(const [width,height] of [[1366,1000],[390,844],[360,640]]){
    console.log(`Interrogatives ${width}x${height}`)
    const context=await browser.newContext({viewport:{width,height}})
    await context.addCookies([{name:'clairfle-fiche-access',value:'admin',url:base}])
    await context.addInitScript(recipe=>{
      localStorage.setItem('clairfle-fiche-sync','interrogatives-fixture-only')
      localStorage.setItem('clairfle.interactive.timer.v1',JSON.stringify({enabled:false,seconds:30,feedbackSeconds:1}))
      localStorage.setItem('clairfle.interactive.toolbar-guard.v1',JSON.stringify('none'))
      localStorage.setItem('clairfle.interactive.mode.v1','class')
      if(location.pathname==='/generateur')history.replaceState({clairfleFiche:{id:'interrogatives',name:'Questions variées',recipe}},'',location.href)
    },recipe)
    await context.route('**/__test_api/**',route=>{methods.push(route.request().method());return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({fiches:[]})})})
    const page=await context.newPage();activePage=page;page.setDefaultTimeout(30000);page.on('pageerror',error=>errors.push(error.message))
    await page.goto(base+'/generateur')
    const preview=page.locator('.sheet-stage:not(.print-only-sheets) .worksheet-sheet:visible').first()
    await preview.locator('.phrase-color-block').first().waitFor({timeout:120000})
    assert.deepEqual(await preview.locator('.phrase-color-block').first().locator('.phrase-word').allTextContents(),color[0].tokens.map(t=>(t.joinBefore??'')+t.text))
    assert.equal(await preview.locator('.phrase-pastille.filled').count(),0)
    await button(page,'Fiche élève (cliquer pour corrigé)').click()
    assert.equal(await preview.locator('.phrase-pastille.filled').count(),color.reduce((n,q)=>n+q.tokens.length,0))
    const adverb=preview.locator('.phrase-color-block').first().locator('.phrase-pastille').first()
    assert.equal(await adverb.evaluate(node=>getComputedStyle(node).backgroundColor),'rgb(61, 155, 201)')
    assert.equal((await preview.locator('.phrase-color-block').first().innerText()).split('Est-ce').length-1,1)
    await preview.screenshot({path:`docs/gattegno/screenshots/interrogatives-${width}.png`})
    await axe(page,'.sheet-stage:not(.print-only-sheets)')
    await button(page,'Corrigé (cliquer pour fiche élève)').click()
    await page.emulateMedia({media:'print'})
    const sheets=page.locator('.print-only-sheets .worksheet-sheet')
    assert.equal(await sheets.count(),8)
    const dimensions=await sheets.evaluateAll(nodes=>nodes.map(node=>{const body=node.querySelector('.sheet-body');return{width:node.getBoundingClientRect().width,height:node.getBoundingClientRect().height,overflow:node.scrollHeight-node.clientHeight,bodyOverflow:body.scrollHeight-body.clientHeight}}))
    for(const d of dimensions)assert.ok(d.width>790&&d.width<800&&d.height>1120&&d.height<1130&&d.overflow<=1&&d.bodyOverflow<=1,JSON.stringify(d))
    const syntax=page.locator('.print-only-sheets .phrase-svc-block')
    assert.equal(await syntax.first().locator('.phrase-svc-sujet').count(),0)
    assert.ok((await syntax.nth(3).locator('.phrase-svc-sujet').allTextContents()).includes('la petite fille'))
    assert.ok((await syntax.nth(4).locator('.phrase-svc-sujet').allTextContents()).includes('tu'))
    const images=page.locator('.print-only-sheets .phrase-images-block')
    assert.ok((await images.nth(1).innerText()).includes('Quelles'))
    for(const image of await images.locator('img').all())assert.ok(await image.evaluate(async image=>{await image.decode();return image.naturalWidth>0}))
    await page.emulateMedia({media:'screen'})
    if(width===1366){
      await button(page,'Page 2').click();await button(page,'Fiche élève (cliquer pour corrigé)').click()
      await preview.locator('.phrase-svc-sujet').first().waitFor()
      await preview.screenshot({path:'docs/gattegno/screenshots/interrogatives-svc.png'})
      await button(page,'Corrigé (cliquer pour fiche élève)').click();await button(page,'Page 1').click()
    }
    await button(page,'Jouer avec la classe').click();await page.locator('.ci-launch:enabled').waitFor({timeout:120000});await page.locator('.ci-launch').click()
    await page.locator('.ci-classification-sentence').waitFor()
    assert.equal(await page.locator('.ci-classification-sentence').innerText(),color[0].model)
    assert.equal(await page.locator('.ci-classification-target').innerText(),color[0].tokens[0].text)
    assert.equal(await page.locator('.ci-answer:enabled').count(),0)
    assert.equal(await page.locator('.ci-answer-key').count(),0)
    await button(page,'Signal : levez vos cartes').click();await button(page,'Discuter').click();await button(page,'Enseignant : révéler').click()
    assert.match(await page.locator('.ci-answer-key').innerText(),/Adverbes/)
    await page.getByRole('button',{name:/^Choisir une question ·/}).click()
    await page.getByRole('dialog',{name:'Choisir une question',exact:true}).locator('li button').nth(linked).click()
    await page.locator('.ci-classification-sentence').filter({hasText:'Mange-t-il'}).waitFor()
    assert.equal(await page.locator('.ci-classification-target').innerText(),'il')
    assert.equal(await page.locator('.ci-classification-sentence [data-category]').count(),0)
    if(await page.locator('.ci-question > .ci-read-more').isVisible()){
      await page.locator('.ci-question > .ci-read-more').click()
      const reading=page.getByRole('dialog',{name:'Question et document',exact:true})
      assert.equal(await reading.locator('.ci-classification-sentence').innerText(),color[5].model)
      await page.keyboard.press('Escape')
    }
    await axe(page,'.ci-app')
    await page.screenshot({path:`docs/gattegno/screenshots/interrogatives-game-${width}.png`})
    if(width===390){
      await button(page,'Quitter la séance').click();await page.locator('.ci-launch:enabled').waitFor()
      await button(page,'Mode de jeu').click();await page.locator('.ci-launch:enabled').waitFor();await page.locator('.ci-launch').click()
      await page.locator('.ci-solo-session .ci-classification-target').filter({hasText:'Est-ce'}).waitFor()
      await page.locator('.ci-answer:enabled').filter({hasText:'Adverbes'}).click();await page.locator('.ci-answer-key').waitFor()
      await page.locator('.ci-classification-target').filter({hasText:/^il$/}).waitFor()
      await page.locator('.ci-answer:enabled').filter({hasText:'Pronoms'}).click();await page.locator('.ci-answer-key').waitFor()
    }
    results.push({viewport:`${width}x${height}`,worksheet:'Interrogative locution classified as an adverb; determinants and pronouns retain individual pastilles; questions appear once.',paper:dimensions,syntax:'Whole nominal subject circled; inverted subject pronoun circled after the finite verb; no marks in pupil version.',pictures:'Interrogative determiner remains an explicit clue; source images decode.',game:'Class keeps collective vote; new interrogative word categories and inversion links stay neutral before reveal.',solo:width===390?'Adverbial locution and following pronoun both accept an answer and advance automatically.':'covered at 390 px',axeViolations:0})
    await context.close()
  }
  assert.deepEqual(recipe,original);assert.deepEqual(errors,[]);assert.ok(methods.every(method=>method==='GET'))
  await writeFile('docs/gattegno/interrogatives-browser-results.json',JSON.stringify({results,errors,apiMethods:methods,liveApiWrites:0,sourceRecipe:'unchanged'},null,2)+'\n')
  console.log(JSON.stringify(results,null,2))
}catch(error){if(activePage&&!activePage.isClosed()){console.error((await activePage.locator('body').innerText()).slice(-4000));await activePage.screenshot({path:'/tmp/clairfle-interrogatives-failure.png',fullPage:true})}throw error}
finally{await browser.close();await vite.close()}
