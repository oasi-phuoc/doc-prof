import assert from 'node:assert/strict'
import {mkdir,readFile,writeFile} from 'node:fs/promises'
import {createServer} from 'vite'
import {chromium} from 'playwright'
import AxeBuilder from '@axe-core/playwright'

const base='http://127.0.0.1:5182'
process.env.VITE_FICHES_API_URL=base+'/__test_api'
const vite=await createServer({cacheDir:'/tmp/clairfle-phrase-images-browser',server:{host:'127.0.0.1',port:5182,strictPort:true}})
await vite.listen()
const {defaultPage}=await vite.ssrLoadModule('/src/math/catalog.ts')
const {buildPage}=await vite.ssrLoadModule('/src/math/generate.ts')
const {PHRASE_COLORS}=await vite.ssrLoadModule('/src/francais/phrase-banks.ts')
const recipe=JSON.parse(await readFile('docs/interactive/demo-source-recipe.json','utf8'))
recipe.pages=[{...defaultPage('gattegno'),topic:'phrase-simple',exerciseType:'phrase-simple-images',count:4,columns:1,verbGroup:'er',phrasePolarity:'positive',phraseCategories:{adverbe:false,preposition:false,conjonction:false,adjectif:false},extraBlocks:undefined}]
recipe.libreMode=false;recipe.libreSnapshot=null;recipe.printCorrections=true
recipe.institutional={...recipe.institutional,course:'Français'}
for(let seed=1;seed<300;seed++){const item=buildPage(recipe.pages[0],seed).blocks[0].items[0];if(item.phraseImages.length===3&&item.phraseImages.map(clue=>clue.category).join(',')==='pronom,verbe,nom'){recipe.seed=seed;break}}
const original=structuredClone(recipe)
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH||undefined,args:['--no-sandbox']})
const results=[],errors=[],requests=[]
const button=(page,name)=>page.getByRole('button',{name,exact:true})
const preview=page=>page.locator('.sheet-stage:not(.print-only-sheets) .worksheet-sheet:visible').first()
const rows=page=>preview(page).locator('.phrase-images-block')
async function pictures(page){for(const image of await preview(page).locator('.phrase-image-clue > img').all())assert.ok(await image.evaluate(async image=>{await image.decode();return image.naturalWidth>0}))}
async function colours(scope){for(const frame of await scope.locator('.phrase-image-clue').all()){const category=await frame.getAttribute('data-category'),hex=PHRASE_COLORS[category],rgb=`rgb(${[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)).join(', ')})`;assert.equal(await frame.evaluate(node=>getComputedStyle(node).borderTopColor),rgb)}}
async function axe(page,selector){let scan=new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']);if(selector)scan=scan.include(selector);const report=await scan.analyze();assert.deepEqual(report.violations.map(issue=>({id:issue.id,targets:issue.nodes.map(node=>node.target)})),[])}
async function checkForms(page){
  assert.equal(await page.getByRole('group',{name:'Nombre de colonnes',exact:true}).count(),0)
  await button(page,'Type d’exercice').click();await page.getByRole('option',{name:'S-V-C : sujet, verbe et complément',exact:true}).click()
  await preview(page).locator('.phrase-svc-block').first().waitFor();assert.equal(await preview(page).locator('.phrase-svc-sujet').count(),0)
  await button(page,'Fiche élève (cliquer pour corrigé)').click();assert.ok(await preview(page).locator('.phrase-svc-sujet').count()>0);assert.ok(await preview(page).locator('.phrase-svc-verbe').count()>0)
  await page.getByRole('group',{name:'Type de phrase',exact:true}).getByRole('button',{name:'Interrogatif',exact:true}).click()
  await page.getByRole('group',{name:'Forme des phrases',exact:true}).getByRole('button',{name:'Négative',exact:true}).click()
  await page.getByRole('group',{name:'Voix de la phrase',exact:true}).getByRole('button',{name:'Passif',exact:true}).click()
  const text=await preview(page).locator('.phrase-svc-block').first().innerText();assert.match(text,/^Est-ce qu/);assert.match(text,/pas/);assert.ok(text.trim().endsWith('?'))
  await page.getByRole('group',{name:'Voix de la phrase',exact:true}).getByRole('button',{name:'Actif',exact:true}).click()
  await page.getByRole('group',{name:'Type de phrase',exact:true}).getByRole('button',{name:'Affirmatif',exact:true}).click()
  await page.getByRole('group',{name:'Forme des phrases',exact:true}).getByRole('button',{name:'Positive',exact:true}).click()
  await button(page,'Corrigé (cliquer pour fiche élève)').click()
  await button(page,'Type d’exercice').click();await page.getByRole('option',{name:'Écrire une phrase en images',exact:true}).click();await rows(page).first().waitFor();await page.getByRole('spinbutton',{name:'Nombre de questions',exact:true}).fill('4')
}
async function pickImage(page,index,label){await button(page,`Changer l’image ${index}, phrase 1`).click();const dialog=page.getByRole('dialog',{name:'Choisir une image vocabulaire',exact:true});await dialog.getByRole('searchbox').fill(label);await dialog.locator('.tcf-vocab-picker-list button').filter({has:page.getByText(label,{exact:true})}).click();await dialog.waitFor({state:'detached'})}
try{
  await mkdir('docs/gattegno/screenshots',{recursive:true})
  for(const [width,height] of [[1366,1000],[390,844],[360,640]]){
    console.log(`Picture sentences ${width}x${height}`)
    const context=await browser.newContext({viewport:{width,height}})
    await context.addCookies([{name:'clairfle-fiche-access',value:'admin',url:base}])
    await context.addInitScript(recipe=>{
      localStorage.setItem('clairfle-fiche-sync','phrase-images-fixture-only')
      localStorage.setItem('clairfle.interactive.timer.v1',JSON.stringify({enabled:false,seconds:30,feedbackSeconds:1}))
      if(location.pathname==='/generateur'&&!sessionStorage.getItem('phrase-images-fixture-ready')){history.replaceState({clairfleFiche:{id:'picture-sentences',name:'Phrases en images',recipe}},'',location.href);sessionStorage.setItem('phrase-images-fixture-ready','1')}
    },recipe)
    let saved=null
    await context.route('**/__test_api/**',async route=>{
      const request=route.request(),method=request.method();requests.push(method)
      if(method==='PUT'||method==='POST'){const body=request.postDataJSON();saved={id:'picture-sentences',name:body.name,recipe:body.recipe,domains:['gattegno'],createdAt:'2026-11-14T00:00:00Z',updatedAt:'2026-11-14T00:00:00Z'};await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({fiche:saved})})}
      else await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({fiches:saved?[saved]:[]})})
    })
    const page=await context.newPage();page.setDefaultTimeout(30000);page.on('pageerror',error=>errors.push(error.message))
    await page.goto(base+'/generateur');await rows(page).first().waitFor({timeout:120000});assert.equal(await rows(page).count(),3)
    await page.evaluate(()=>document.fonts.ready);await checkForms(page);await pictures(page);await colours(preview(page));await axe(page,'.phrase-images-block')
    await button(page,'Type d’exercice').click();const labels=await page.getByRole('option').allTextContents();assert.ok(labels.findIndex(label=>label==='Écrire une phrase en images')<labels.findIndex(label=>label==='Production écrite'));await page.keyboard.press('Escape')
    for(const row of await rows(page).all()){const ys=await row.locator('.phrase-image-clue').evaluateAll(nodes=>nodes.map(node=>node.getBoundingClientRect().top));assert.ok(Math.max(...ys)-Math.min(...ys)<1,'Printed clues remain on one line')}
    assert.equal(await preview(page).locator('.phrase-slot-answer').count(),0)
    await page.getByRole('checkbox',{name:'Afficher les mots sous les images',exact:true}).check();assert.ok(await preview(page).locator('.phrase-image-clue[data-category="verbe"] figcaption').count()>0)
    await page.getByRole('checkbox',{name:'Afficher les mots sous les images',exact:true}).uncheck()
    const before=await preview(page).locator('.phrase-image-clue > img').evaluateAll(images=>images.map(image=>image.src).join('|'))
    await button(page,'Générer').click();await page.waitForFunction(before=>[...document.querySelectorAll('.sheet-stage:not(.print-only-sheets) .phrase-image-clue > img')].map(image=>image.src).join('|')!==before,before)
    await button(page,'Personnaliser les images').click();await page.locator('.phrase-libre-editor').waitFor()
    // Author one exact example, regardless of the current bank draw.
    const firstEditor=page.locator('.phrase-libre-card').first()
    while(await firstEditor.locator('.phrase-image-editor-clue').count()>3)await firstEditor.getByRole('button',{name:/^Supprimer l’indice/}).last().click()
    while(await firstEditor.locator('.phrase-image-editor-clue').count()<3)await firstEditor.getByRole('button',{name:'Ajouter une image',exact:true}).click()
    for(const [index,category]of [[1,'pronom'],[2,'verbe'],[3,'nom']])await page.getByRole('combobox',{name:`Nature de l’indice ${index}, phrase 1`,exact:true}).selectOption(category)
    await pickImage(page,1,'je');await pickImage(page,2,'manger');await pickImage(page,3,'pomme')
    await page.getByRole('textbox',{name:'Phrase exemple 1',exact:true}).fill('Je mange une pomme.')
    await page.getByRole('combobox',{name:'Place de l’indice 3, phrase 1',exact:true}).selectOption({value:'0'});await page.waitForFunction(()=>document.querySelector('.sheet-stage:not(.print-only-sheets) .phrase-images-block .phrase-image-clue')?.dataset.category==='nom')
    await page.getByRole('combobox',{name:'Place de l’indice 1, phrase 1',exact:true}).selectOption({value:'2'});await page.waitForFunction(()=>[...document.querySelector('.sheet-stage:not(.print-only-sheets) .phrase-images-block').querySelectorAll('.phrase-image-clue')].map(node=>node.dataset.category).join(',')==='pronom,verbe,nom')
    assert.deepEqual(await rows(page).first().locator('.phrase-image-clue').evaluateAll(nodes=>nodes.map(node=>node.dataset.category)),['pronom','verbe','nom'])
    assert.ok(!(await preview(page).innerText()).includes('Je mange une pomme.'));await colours(preview(page));await pictures(page);await axe(page,'.phrase-libre-editor')
    await button(page,'Fiche élève (cliquer pour corrigé)').click();assert.ok((await preview(page).innerText()).includes('Exemple : Je mange une pomme.'));await button(page,'Corrigé (cliquer pour fiche élève)').click()
    await preview(page).screenshot({path:`docs/gattegno/screenshots/phrases-images-${width}.png`})
    await page.emulateMedia({media:'print'})
    const sheets=page.locator('.print-only-sheets .worksheet-sheet');assert.equal(await sheets.count(),4)
    const dimensions=await sheets.evaluateAll(nodes=>nodes.map(node=>{const body=node.querySelector('.sheet-body'),footer=node.querySelector('.doc-footer'),last=node.querySelector('.exercise-grid')?.lastElementChild;return {width:node.getBoundingClientRect().width,height:node.getBoundingClientRect().height,overflow:node.scrollHeight-node.clientHeight,bodyOverflow:body.scrollHeight-body.clientHeight,footerGap:footer&&last?footer.getBoundingClientRect().top-last.getBoundingClientRect().bottom:null}}))
    for(const sheet of dimensions){assert.ok(sheet.width>790&&sheet.width<800);assert.ok(sheet.height>1120&&sheet.height<1130);assert.ok(sheet.overflow<=1&&sheet.bodyOverflow<=1&&(sheet.footerGap===null||sheet.footerGap>=0),JSON.stringify(sheet))}
    if(width===1366){await page.pdf({path:'/tmp/clairfle-phrases-images.pdf',preferCSSPageSize:true,printBackground:false});await sheets.first().screenshot({path:'docs/gattegno/screenshots/phrases-images-a4.png'})}
    await page.emulateMedia({media:'screen'})
    await button(page,'Enregistrer').click();const save=page.getByRole('dialog',{name:'Enregistrer la fiche',exact:true});await save.getByRole('button',{name:'Mettre à jour',exact:true}).click();await save.waitFor({state:'detached'})
    assert.ok(saved);assert.equal(saved.recipe.pages[0].phraseItems.length,4);assert.equal(saved.recipe.pages[0].phraseItems[0].responseAnswer,'Je mange une pomme.');const authored=structuredClone(saved.recipe)
    await page.reload();await rows(page).first().waitFor({timeout:120000});assert.deepEqual(await rows(page).first().locator('.phrase-image-clue').evaluateAll(nodes=>nodes.map(node=>node.dataset.category)),['pronom','verbe','nom'])
    await button(page,'Jouer avec la classe').click();await page.locator('.ci-launch:enabled').waitFor({timeout:120000})
    await button(page,'Précharger toute la séance').click();await page.getByRole('status').filter({hasText:'Prêt à jouer sans connexion'}).waitFor()
    await context.setOffline(true);await page.locator('.ci-launch').click();await page.locator('.ci-app .phrase-image-row').waitFor()
    assert.equal(await page.locator('.ci-answer').count(),0);assert.ok(!(await page.locator('body').innerText()).includes('Je mange une pomme.'));await colours(page.locator('.ci-app'))
    await button(page,'Agrandir : manger').click();await page.getByRole('dialog',{name:'Image agrandie : manger',exact:true}).waitFor();await page.keyboard.press('Escape')
    await button(page,'Commencer l’échange').click();await button(page,'Discuter').click();await button(page,'Enseignant : révéler').click();assert.ok((await page.locator('.ci-model-content').innerText()).includes('Je mange une pomme.'))
    await button(page,'Acquis').click();await axe(page)
    assert.deepEqual(saved.recipe,authored)
    results.push({viewport:`${width}x${height}`,menu:'SVC before pastilles; image writing immediately before written production; no columns control; independent polarity, question type and voice',pictures:'TCF-style pronouns and verbs plus existing TCF nouns; word-class borders; one printed row; optional lexical captions',authoring:'Individual image search, category and position changes, teacher example and simulated save/reload preserve the composed sentence',student:'Je + manger + pomme, no complete model in the student preview or game before reveal',paper:dimensions,game:'Prepared images work offline, zoom closes with Escape, teacher reveal and appreciation only',axeViolations:0})
    await context.close()
  }
  assert.deepEqual(recipe,original);assert.deepEqual(errors,[])
  await writeFile('docs/gattegno/phrases-images-browser-results.json',JSON.stringify({results,errors,simulatedWrites:requests.filter(method=>method==='PUT'||method==='POST').length,liveServerWrites:0},null,2)+'\n')
  console.log(JSON.stringify(results,null,2))
}catch(error){const page=browser.contexts().at(-1)?.pages().at(-1);if(page)await page.screenshot({path:'/tmp/clairfle-phrase-images-failure.png'});throw error}finally{await browser.close();await vite.close()}
