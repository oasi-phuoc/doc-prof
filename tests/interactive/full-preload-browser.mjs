import assert from 'node:assert/strict'
import {mkdir,stat,writeFile} from 'node:fs/promises'
import {createServer} from 'vite'
import {chromium} from 'playwright'
import AxeBuilder from '@axe-core/playwright'
import {waitForBrowserValue} from './browser-actions.mjs'

const base='http://127.0.0.1:5182'
process.env.VITE_FICHES_API_URL=base+'/__test_api'
const vite=await createServer({cacheDir:'/tmp/clairfle-full-preload-browser',server:{host:'127.0.0.1',port:5182,strictPort:true}})
await vite.listen()
const {demoRecipe}=await vite.ssrLoadModule('/src/interactive/demo.ts')
const {numberAudioParts}=await vite.ssrLoadModule('/src/tcm-cfr/audio-nombres.ts')
const {cscCalculationParts}=await vite.ssrLoadModule('/src/tcm-csc/items.ts')
const {contractFixture}=await vite.ssrLoadModule('/tests/grammar/fixtures/contracts.ts')
const {convertRecipe}=await vite.ssrLoadModule('/src/interactive/domain/convert.ts')
const {sessionAssets}=await vite.ssrLoadModule('/src/interactive/media/full-preload.ts')
const {canonicalJson,hash}=await vite.ssrLoadModule('/src/interactive/domain/seeds.ts')
const {parseFicheRecipe}=await vite.ssrLoadModule('/src/fiches/recipe.ts')
const images=['/lib/images/tcf/co/objets/5-tomates.webp','/lib/images/tcf/co/objets/10-tomates.webp']
const items=[
  {layout:'select',prompt:'Combien de tomates entendez-vous ?',options:['cinq','dix'],optionImages:images,answer:'cinq',audioSrc:numberAudioParts(5)[0]},
  {layout:'select',prompt:'Quelle image montre dix tomates ?',options:['cinq','dix'],optionImages:images,answer:'dix'},
  {layout:'audio-dictation',audioSrc:numberAudioParts(201)[0],audioParts:numberAudioParts(201),answer:'201'},
  {layout:'audio-dictation',audioParts:cscCalculationParts(12,24,'+'),answer:'36',cscTask:{kind:'calculation-audio',a:12,b:24,operation:'+'}},
]
const grammar=contractFixture('imageChoice','choice')
grammar.grammarSnapshot.seed=839+7919 // The second source page receives this seed in the real generator.
const recipe={...demoRecipe(),seed:839,pages:[{...demoRecipe().pages[0],count:4,libreInstruction:'Il y a 2 écoutes.',libreItems:items},grammar]}
const before=structuredClone(recipe),game=convertRecipe(recipe)
assert.equal(game.questions.length,5)
const assets=sessionAssets(game,{baseUrl:base})
const bytes=(await Promise.all(assets.map(async asset=>(await stat('public'+decodeURIComponent(new URL(asset.url).pathname))).size))).reduce((a,b)=>a+b,0)
const size=bytes<1024?`${bytes} o`:`${(bytes/(bytes<1024*1024?1024:1024*1024)).toFixed(1).replace('.',',')} ${bytes<1024*1024?'ko':'Mo'}`
const saved={id:'full-preload',name:'Écoutes et images hors connexion',domains:['algèbre','grammaire'],recipe,createdAt:'2026-11-13T00:00:00Z',updatedAt:'2026-11-13T00:00:00Z'}
const normalized=parseFicheRecipe(recipe)
assert.ok(normalized)
const runKey=`clairfle.interactive.run.v1.saved-${hash(canonicalJson({recipe:normalized,sourceId:saved.id}))}`
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH||undefined,args:['--no-sandbox']})
const results=[],errors=[],methods=[]
const button=(page,name)=>page.getByRole('button',{name,exact:true})
const preload=page=>page.getByRole('region',{name:'Précharger la séance',exact:true})
const status=page=>preload(page).getByRole('status')
async function setup(width=390,height=844){
  const context=await browser.newContext({viewport:{width,height},acceptDownloads:true})
  await context.addCookies([{name:'clairfle-fiche-access',value:'admin',url:base}])
  await context.addInitScript(()=>{
    localStorage.setItem('clairfle-fiche-sync','full-preload-fixture-only')
    localStorage.setItem('clairfle.interactive.timer.v1',JSON.stringify({enabled:false,seconds:10,feedbackSeconds:1}))
    window.__preloadUrls={created:[],revoked:[]}
    const create=URL.createObjectURL.bind(URL),revoke=URL.revokeObjectURL.bind(URL)
    URL.createObjectURL=blob=>{const url=create(blob);window.__preloadUrls.created.push({url,bytes:blob.size,type:blob.type});return url}
    URL.revokeObjectURL=url=>{window.__preloadUrls.revoked.push(url);revoke(url)}
  })
  await context.addInitScript(key=>sessionStorage.setItem(key,JSON.stringify({seed:839,selectedKeys:null})),runKey)
  await context.route('**/__test_api/fiches',route=>{methods.push(route.request().method());return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({fiches:[saved]})})})
  const page=await context.newPage();page.setDefaultTimeout(30000);page.on('pageerror',error=>errors.push(error.message))
  console.log(`Full preload ${width}x${height}`)
  await page.goto(`${base}/interactif/${saved.id}`);await page.locator('.ci-launch:enabled').waitFor({timeout:120000})
  assert.equal(await page.locator('.ci-question-list fieldset > label').count(),5)
  return {page,context}
}
async function prepare(page){
  const mark=await page.evaluate(()=>window.__preloadUrls.created.length)
  await button(page,'Précharger toute la séance').click()
  await status(page).filter({hasText:'Prêt à jouer sans connexion'}).waitFor()
  assert.ok((await status(page).innerText()).includes(`${assets.length} médias chargés · ${size}`))
  const pack=await page.evaluate(mark=>window.__preloadUrls.created.slice(mark),mark)
  assert.equal(pack.length,assets.length);assert.equal(pack.reduce((sum,item)=>sum+item.bytes,0),bytes)
  assert.ok(await page.evaluate(pack=>pack.every(({url})=>!window.__preloadUrls.revoked.includes(url)),pack))
  return pack
}
async function readyAudio(page){await page.waitForFunction(()=>{const audio=document.querySelector('.ci-header-audio audio');return audio?.src.startsWith('blob:')&&audio.duration>0});return page.locator('.ci-header-audio audio')}
async function play(page){
  const audio=await readyAudio(page)
  assert.ok((await page.locator('.ci-audio-caption [role=status]').innerText()).includes('Écoute 0'))
  await audio.evaluate(async audio=>{audio.muted=true;audio.playbackRate=16;await audio.play()})
  await page.waitForFunction(()=>document.querySelector('.ci-header-audio audio')?.ended)
  await page.locator('.ci-audio-caption [role=status]').filter({hasText:'Écoute 1'}).waitFor()
  return audio.evaluate(audio=>audio.duration)
}
async function axe(page){
  const scan=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()
  assert.deepEqual(scan.violations.map(v=>({id:v.id,targets:v.nodes.map(node=>node.target)})),[])
}
async function current(page,index){await page.locator('.ci-progress').filter({hasText:`Question ${index+1} / 5`}).waitFor();await page.locator('.ci-answer').first().waitFor()}
async function allPictures(page){
  const visible=page.locator('.ci-round-questions img:visible')
  for(const image of await visible.all())assert.ok(await image.evaluate(async image=>{await image.decode();return image.src.startsWith('blob:')&&image.naturalWidth>0}))
  assert.equal(await page.locator('.ci-media-error,.grammar-media-error').count(),0)
}
async function reveal(page,label){
  await button(page,'Signal : levez vos cartes').click();await button(page,'Discuter').click();await button(page,'Enseignant : révéler').click()
  assert.equal((await page.locator('.ci-answer-key .ci-answer-content').innerText()).trim(),label)
}
const labels=['cinq','dix','201','36','des']
try{
  await mkdir('docs/interactive/screenshots',{recursive:true})
  for(const [width,height]of [[390,844],[1366,768],[360,640]]){
    const {page,context}=await setup(width,height),pack=await prepare(page)
    await axe(page)
    await preload(page).screenshot({path:`docs/interactive/screenshots/full-preload-ready-${width}.png`})
    await context.setOffline(true);await page.locator('.ci-launch').click()
    const durations=[]
    for(let index=0;index<5;index++){
      await current(page,index);await allPictures(page)
      assert.equal(await page.locator('.ci-answer:enabled').count(),0)
      assert.ok((await page.locator('.ci-mascot-sprite').first().evaluate(node=>getComputedStyle(node).backgroundImage)).includes('blob:'))
      if([0,2,3].includes(index))durations.push(await play(page))
      if(index===1){
        await button(page,'Mascotte').click()
        const sprites=await page.locator('.ci-mascot-picker .ci-mascot-sprite').evaluateAll(nodes=>nodes.map(node=>getComputedStyle(node).backgroundImage))
        assert.equal(sprites.length,30);assert.ok(sprites.every(src=>src.includes('blob:')))
        await button(page,'Dragon').click()
      }
      if(index===4){
        const image=page.locator('.grammar-support-image img').first();await image.waitFor();await image.evaluate(image=>image.decode());assert.equal(await image.evaluate(image=>image.naturalWidth),1536)
        await page.getByRole('button',{name:/^Agrandir : Cinq tomates/}).click()
        const dialog=page.getByRole('dialog',{name:/^Image agrandie : Cinq tomates/})
        await dialog.waitFor();assert.ok(await dialog.locator('img').evaluate(image=>image.src.startsWith('blob:')&&image.naturalWidth===1536))
        await button(page,'Fermer l’image').click();await axe(page)
        await page.screenshot({path:`docs/interactive/screenshots/full-preload-class-${width}.png`})
      }
      await reveal(page,labels[index])
      if(index<4)await button(page,'Question suivante').click()
    }
    await button(page,'Quitter la séance').click();await page.locator('.ci-launch:enabled').waitFor()
    await status(page).filter({hasText:'Prêt à jouer sans connexion'}).waitFor()
    const downloaded=page.waitForEvent('download');await button(page,'Télécharger la feuille enseignant').click()
    const file=await downloaded,stream=await file.createReadStream(),chunks=[]
    for await(const chunk of stream)chunks.push(chunk)
    const html=Buffer.concat(chunks).toString('utf8');assert.ok(html.includes('data:image/webp;base64,'));assert.ok(!html.includes('blob:'));assert.ok(!html.includes('illustration(s) non incorporée'))
    await page.getByRole('status').filter({hasText:'Feuille enseignant créée.'}).waitFor()
    await button(page,'Reprendre la séance').click();await page.locator('.ci-answer-key').waitFor();assert.equal((await page.locator('.ci-answer-key .ci-answer-content').innerText()).trim(),'des')
    await button(page,'Voir le bilan').click();await page.locator('.ci-summary').waitFor()
    await waitForBrowserValue(page,async()=>{const {requestLocal}=await import('/src/interactive/storage.ts');return(await requestLocal('sessions','readonly',store=>store.getAll())).some(record=>record.checkpoint?.state.finished)})
    const journal=await page.evaluate(async()=>{const {requestLocal}=await import('/src/interactive/storage.ts');return JSON.stringify(await requestLocal('sessions','readonly',store=>store.getAll()))})
    assert.ok(!journal.includes('blob:'));assert.ok(!journal.includes('correctChoiceId'))
    const owned=await page.evaluate(()=>window.__preloadUrls.created.filter(item=>item.type.startsWith('audio/')||item.type.startsWith('image/')).map(item=>item.url))
    await context.setOffline(false);await button(page,'Mes fiches').click()
    await page.waitForFunction(owned=>owned.every(url=>window.__preloadUrls.revoked.includes(url)),owned)
    assert.ok(await page.evaluate(pack=>pack.every(item=>window.__preloadUrls.revoked.includes(item.url)),pack))
    results.push({class:`${width}x${height}`,offline:'five questions complete after network cutoff; two image choices, simple audio, complete dictated number and addition, verified grammar image and zoom',assets:assets.length,bytes,realAudioSeconds:durations,mascots:'all thirty choices and the selected Dragon animate from prepared blobs',return:'original plan and correction retained; offline return, teacher sheet with embedded images and resume succeed',journal:'no blob URLs or answer keys stored',cleanup:'pack, composed recordings and verified image URLs released when leaving the page',axeViolations:0})
    await context.close()
  }
  for(const [width,height]of [[390,844],[1366,768],[360,640]]){
    const {page,context}=await setup(width,height);await prepare(page)
    await button(page,'Mode de jeu').click();await page.locator('.ci-launch:enabled').waitFor()
    await status(page).filter({hasText:'Prêt à jouer sans connexion'}).waitFor()
    await context.setOffline(true);await page.locator('.ci-launch').click()
    for(let index=0;index<5;index++){
      await current(page,index);await allPictures(page)
      if([0,2,3].includes(index))await play(page)
      const card=page.locator('.ci-answer').filter({has:page.locator('.ci-answer-content').getByText(labels[index],{exact:true})})
      await card.click();await page.locator('.ci-answer-key').waitFor()
    }
    await page.locator('.ci-summary').waitFor()
    const history=await waitForBrowserValue(page,async()=>{const {requestLocal}=await import('/src/interactive/storage.ts');return(await requestLocal('sessions','readonly',store=>store.getAll())).find(record=>record.mode==='solo'&&record.checkpoint?.state.finished)?.checkpoint.state.history})
    assert.deepEqual(history.map(answer=>answer.correct),[true,true,true,true,true])
    results.push({solo:`${width}x${height}`,offline:'switching from Class to Solo retains the ready pack; all five answers correct, with real plays, automatic corrections, progression and durable score 5/5'})
    await context.close()
  }
  const {page,context}=await setup()
  const held=numberAudioParts(201).find(src=>src.includes('cent.'))
  assert.ok(held)
  let unlock,entered
  const gate=new Promise(resolve=>{unlock=resolve}),started=new Promise(resolve=>{entered=resolve})
  await context.route(base+held,async route=>{entered();await gate;await route.continue().catch(()=>{})})
  const mark=await page.evaluate(()=>window.__preloadUrls.created.length)
  await button(page,'Précharger toute la séance').click();await started
  await page.waitForFunction(mark=>window.__preloadUrls.created.length>mark,mark)
  assert.equal(await page.locator('.ci-launch').isEnabled(),false)
  await button(page,'Annuler le préchargement').click();unlock();await page.locator('.ci-launch:enabled').waitFor()
  await page.waitForFunction(mark=>window.__preloadUrls.created.slice(mark).every(item=>window.__preloadUrls.revoked.includes(item.url)),mark)
  assert.equal(await status(page).filter({hasText:'Prêt à jouer sans connexion'}).count(),0)
  await context.unroute(base+held)
  let missing=true
  await context.route(base+held,route=>missing?route.fulfill({status:404,body:''}):route.continue())
  await button(page,'Précharger toute la séance').click();await preload(page).getByRole('alert').waitFor()
  assert.equal(await status(page).filter({hasText:'Prêt à jouer sans connexion'}).count(),0)
  missing=false;await button(page,'Réessayer le préchargement').click();await status(page).filter({hasText:'Prêt à jouer sans connexion'}).waitFor()
  const old=await page.evaluate(()=>window.__preloadUrls.created.filter(item=>!window.__preloadUrls.revoked.includes(item.url)))
  await page.locator('.ci-question-list fieldset > label input').nth(2).uncheck();await page.locator('.ci-launch:enabled').waitFor()
  assert.equal(await status(page).filter({hasText:'Prêt à jouer sans connexion'}).count(),0)
  assert.ok(await page.evaluate(old=>old.every(item=>window.__preloadUrls.revoked.includes(item.url)),old))
  await page.locator('.ci-question-list fieldset > label input').nth(2).check();await page.locator('.ci-launch:enabled').waitFor()
  const finalPack=await prepare(page);await button(page,'Libérer les médias chargés').click()
  assert.ok(await page.evaluate(pack=>pack.every(item=>window.__preloadUrls.revoked.includes(item.url)),finalPack))
  await axe(page);await context.close()
  results.push({lifecycle:'cancel restores normal launch and ignores the late response; a missing clip prevents ready; retry recovers; changed selection invalidates and frees the pack; explicit release frees it again'})
  assert.deepEqual(recipe,before);assert.ok(methods.length&&methods.every(method=>method==='GET'));assert.deepEqual(errors,[])
  await writeFile('docs/interactive/full-preload-results.json',JSON.stringify({results,errors,serverWritesToFicheApi:0,scope:'manual memory preload; same page open, no cold-start or offline-reload claim; no service worker'},null,2)+'\n')
  console.log(JSON.stringify(results,null,2))
}finally{await browser.close();await vite.close()}
