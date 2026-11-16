import assert from 'node:assert/strict'
import {mkdir,writeFile} from 'node:fs/promises'
import {createServer} from 'vite'
import {chromium} from 'playwright'
import AxeBuilder from '@axe-core/playwright'
import {gameControl,waitForBrowserValue} from './browser-actions.mjs'
const base='http://127.0.0.1:5182',out='docs/interactive/fraction-figure-proofs'
process.env.VITE_FICHES_API_URL=base+'/__forbidden_fiches'
const vite=await createServer({cacheDir:'/tmp/clairfle-fraction-figures-browser',server:{host:'127.0.0.1',port:5182,strictPort:true,hmr:false}})
await vite.listen()
const {poolRecipe,convertPoolRecipe}=await vite.ssrLoadModule('/src/interactive/pools/recipe.ts')
const {applyPlanOptions}=await vite.ssrLoadModule('/src/interactive/domain/plan-options.ts')
const {prepareGame}=await vite.ssrLoadModule('/src/interactive/domain/plan.ts')
const {fractionFigureDescription}=await vite.ssrLoadModule('/src/interactive/domain/fraction-figure.ts')
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH||undefined,args:['--no-sandbox']})
const results=[],errors=[],api=[]
async function setup(width,height,mode='class'){
 const context=await browser.newContext({viewport:{width,height},hasTouch:width<700})
 await context.addCookies([{name:'clairfle-fiche-access',value:'admin',url:base}])
 await context.addInitScript(mode=>{sessionStorage.setItem('clairfle.interactive.mode.v1',mode);localStorage.setItem('clairfle.interactive.timer.v1',JSON.stringify({enabled:mode==='solo',seconds:5,feedbackSeconds:mode==='solo'?1:10}))},mode)
 await context.route('**/__forbidden_fiches/**',route=>{const r=route.request(),path=new URL(r.url()).pathname;if(path!=='/__forbidden_fiches/competition/status')api.push({method:r.method(),path});return route.fulfill({status:503,contentType:'application/json',body:'{"available":false}'})})
 const page=await context.newPage();page.setDefaultTimeout(30000);page.on('pageerror',error=>errors.push(error.message))
 await page.goto(base+'/interactif');await page.getByRole('heading',{name:'Composez votre pool d’exercices'}).waitFor({timeout:120000})
 return{page,context}
}
async function choose(page,mixed=true,count=2){
 await page.getByRole('combobox',{name:'Domaine des exercices'}).selectOption('tpm')
 await page.locator('input[data-pool-type="tpm-frac-read"]').check()
 const selected=page.locator('[data-selected-pool-type="tpm-frac-read"]');await selected.locator('summary').click()
 await selected.getByRole('spinbutton',{name:/Nombre d’éléments/}).fill(String(count))
 assert.equal(await selected.getByRole('checkbox',{name:'Choisir la plage de nombres'}).count(),0)
 if(mixed){
  await page.getByRole('combobox',{name:'Domaine des exercices'}).selectOption('tcm-cfr');await page.locator('input[data-pool-type="tcm-cfr-ex13"]').check()
  await page.getByRole('combobox',{name:'Domaine des exercices'}).selectOption('algèbre');await page.locator('input[data-pool-type="addition-ligne"]').check()
  const addition=page.locator('[data-selected-pool-type="addition-ligne"]');await addition.locator('summary').click();await addition.getByRole('spinbutton',{name:/Nombre d’éléments/}).fill('1')
 }
 await page.getByRole('checkbox',{name:'Mélanger les questions des différents types'}).uncheck()
 await page.getByRole('button',{name:'Préparer la partie',exact:true}).click();await page.waitForURL(url=>url.searchParams.has('pool'));await page.locator('.ci-launch:enabled').waitFor({timeout:120000})
 const id=new URL(page.url()).searchParams.get('pool')
 return page.evaluate(async id=>{const {requestLocal}=await import('/src/interactive/storage.ts');return requestLocal('pools','readonly',s=>s.get(id))},id)
}
async function runGame(page,pool,mode='class'){
 const record=await waitForBrowserValue(page,async()=>{const{requestLocal}=await import('/src/interactive/storage.ts');return(await requestLocal('sessions','readonly',s=>s.getAll())).find(r=>r.source?.reference.kind==='pool')??null})
 const game=prepareGame(applyPlanOptions(convertPoolRecipe(poolRecipe(pool.config,record.source.seed),pool.name),record.source.options),undefined,mode)
 assert.equal(game.id,record.gameId);return{game,record}
}
async function competitionGame(page,pool){
 const metadata=await waitForBrowserValue(page,()=>{const key=Object.keys(sessionStorage).find(k=>k.startsWith('clairfle.interactive.run.v1.pool-'));return key?JSON.parse(sessionStorage.getItem(key)):null})
 return prepareGame(applyPlanOptions(convertPoolRecipe(poolRecipe(pool.config,metadata.seed),pool.name),metadata.options))
}
const answer=(game,index=0)=>{const q=game.questions[index];return q.choices.find(c=>c.id===game.corrections[q.id].choiceId).text}
const card=(page,text)=>page.locator('.ci-answer').filter({has:page.getByText(text,{exact:true})})
async function launch(page){await page.locator('.ci-launch:enabled').click();await page.locator('.ci-answer').first().waitFor()}
async function reveal(page){for(const name of['Signal : levez vos cartes','Discuter','Enseignant : révéler'])await gameControl(page,name).click()}
async function navigate(page,index){await gameControl(page,/^Choisir une question ·/).click();await page.getByRole('dialog',{name:'Choisir une question',exact:true}).locator('li button').nth(index).click()}
async function diagram(page,figure,clock=false){
 if(clock)await page.clock.runFor(100)
 const node=page.getByRole('img',{name:fractionFigureDescription(figure),exact:true});await node.waitFor();await node.locator('svg').waitFor()
 const painted=await node.locator('svg > [fill]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('fill')).filter(fill=>fill==='#fff'||fill==='var(--purple)'))
 assert.equal(painted.length,figure.colored.length);assert.equal(painted.filter(fill=>fill==='var(--purple)').length,figure.colored.filter(Boolean).length)
 if(await page.locator('.ci-round-question').count())await page.waitForFunction(()=>document.querySelector('.ci-round-question')?.dataset.ciReadability!==undefined)
 const bounds=await node.boundingBox(),size=page.viewportSize();assert.ok(bounds.x>=0&&bounds.y>=0&&bounds.x+bounds.width<=size.width+1&&bounds.y+bounds.height<=size.height+1)
 const clip=await node.evaluate(n=>{const body=n.closest('.ci-question-body');if(!body||getComputedStyle(body).display==='contents')return null;const r=body.getBoundingClientRect();return{top:r.top,bottom:r.bottom}});if(clip)assert.ok(bounds.y>=clip.top-1&&bounds.y+bounds.height<=clip.bottom+1,JSON.stringify({bounds,clip}))
 return node
}
async function fits(page,duel=false){
 if(!duel&&await page.locator('.ci-round-question').count())await page.waitForFunction(()=>document.querySelector('.ci-round-question')?.dataset.ciReadability!==undefined)
 const size=page.viewportSize();assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false)
 const selector=duel?'.ci-duel-answer,.ci-duel-controls':'.ci-answer:visible,.ci-controls:visible'
 for(const b of await page.locator(selector).evaluateAll(nodes=>nodes.map(n=>n.getBoundingClientRect().toJSON())))assert.ok(b.x>=-1&&b.y>=-1&&b.right<=size.width+1&&b.bottom<=size.height+1&&b.height>=44,JSON.stringify({size,b}))
 const figure=await page.locator('.ci-fraction-figure').first().boundingBox(),cards=await page.locator(duel?'.ci-duel-cards':'.ci-answer-grid').first().boundingBox()
 assert.ok(figure.y+figure.height<=cards.y+1,JSON.stringify({figure,cards}))
}
async function axe(page){const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();assert.deepEqual(audit.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})),[])}
try{
 await mkdir(out,{recursive:true})
 for(const[width,height]of[[1366,768],[390,844],[360,640]]){
  console.log(`Figures fractionnaires, Classe ${width}×${height}`)
  const{page,context}=await setup(width,height),pool=await choose(page)
  assert.equal(pool.config.entries.length,3)
  await page.getByRole('checkbox',{name:'Ranger les nombres par ordre croissant',exact:true}).check()
  await gameControl(page,'Précharger toute la séance').click();await page.getByRole('status').filter({hasText:'Prêt à jouer sans connexion'}).waitFor()
  await context.setOffline(true);await launch(page);const{game}=await runGame(page,pool)
  assert.equal(game.questions.filter(q=>q.fractionFigure).length,3)
  for(let i=0;i<3;i++){
   if(i)await navigate(page,i);await diagram(page,game.questions[i].fractionFigure)
   assert.equal(await page.locator('.ci-answer:enabled').count(),0);assert.equal(await page.locator('.ci-answer-key').count(),0)
   assert.ok(await page.locator('.ci-answer .ci-fraction-digits').count());await fits(page);if(i===0)await page.screenshot({path:`${out}/thinking-${width}.png`})
   await reveal(page);assert.equal(await page.locator('.ci-answer-key .ci-answer-content').textContent(),answer(game,i));assert.equal(await page.locator('.ci-answer-muted').count(),5)
   assert.equal(await page.locator('.ci-margin-answer,.ci-model-answer').count(),0);await fits(page)
   if(i===0){await axe(page);await page.screenshot({path:`${out}/class-${width}.png`})}
  }
  const before=await page.locator('.ci-fraction-figure').innerHTML(),key=await page.locator('.ci-answer-key .ci-answer-content').textContent()
  await context.setOffline(false);await page.evaluate(()=>sessionStorage.clear());await page.reload();await page.locator('.ci-launch:enabled').waitFor({timeout:120000});await launch(page);await page.locator('.ci-answer-key').waitFor()
  assert.equal(await page.locator('.ci-fraction-figure').innerHTML(),before);assert.equal(await page.locator('.ci-answer-key .ci-answer-content').textContent(),key)
  results.push({mode:'class',viewport:`${width}x${height}`,pool:'TPM and TCM CFR figure reading plus algebra addition; no worksheet service.',checks:['All source partitions and colored parts retained','Fractions stacked, teacher-only correction in one colored card','All other cards gray; no duplicated answer','Offline after full preparation; identical drawing and correction after durable reload','Figure, cards and controls fit; automated axe passes']});await context.close()
 }
 {
  console.log('Figures fractionnaires, Solo')
  const{page,context}=await setup(390,844,'solo'),pool=await choose(page,false,3)
  await page.clock.install();await page.clock.pauseAt(new Date(Date.now()+10000));await launch(page);const{game}=await runGame(page,pool,'solo')
  await diagram(page,game.questions[0].fractionFigure,true);await card(page,answer(game)).click();await page.locator('.ci-answer-correct').waitFor()
  await page.clock.runFor(1200);await diagram(page,game.questions[1].fractionFigure,true)
  const q=game.questions[1],wrong=q.choices.find(c=>c.id!==game.corrections[q.id].choiceId).text
  await card(page,wrong).click();await page.locator('.ci-answer-incorrect').waitFor();assert.equal(await page.locator('.ci-answer-key .ci-answer-content').textContent(),answer(game,1))
  await page.clock.runFor(1200);await diagram(page,game.questions[2].fractionFigure,true);await page.clock.runFor(5200);await page.locator('.ci-reveal').waitFor();assert.equal((await page.locator('.ci-correction-status').innerText()).trim(),'Temps écoulé')
  await page.clock.runFor(1200);await page.locator('.ci-summary').waitFor();await page.clock.resume()
  assert.equal(await page.locator('.ci-summary-questions > p').count(),3)
  await gameControl(page,'Nouvelle partie').click();await page.locator('.ci-answer:enabled').first().waitFor()
  const next=await waitForBrowserValue(page,async()=>{const{requestLocal}=await import('/src/interactive/storage.ts');return(await requestLocal('sessions','readonly',s=>s.getAll())).length>1})
  assert.equal(next,true);results.push({mode:'solo',checks:['Correct, wrong and timer expiration graded automatically','One-second automatic feedback to the next drawing','Complete three-question report and renewed part']});await context.close()
 }
 {
  console.log('Figures fractionnaires, défi local')
  const{page,context}=await setup(390,844),pool=await choose(page,false,1)
  await gameControl(page,'Compétition').click();await gameControl(page,'Préparer le défi local').click();await gameControl(page,'Ajouter cette mascotte').click();await gameControl(page,'Renard').click();await gameControl(page,'Ajouter cette mascotte').click()
  const game=await competitionGame(page,pool),correct=answer(game)
  await gameControl(page,'Commencer la compétition').click();await gameControl(page,'Je suis prêt').click();await page.locator('.ci-answer:enabled').first().waitFor();await diagram(page,game.questions[0].fractionFigure);await context.setOffline(true);await card(page,correct).click()
  await gameControl(page,'Je suis prêt').click();await page.locator('.ci-answer:enabled').first().waitFor();await diagram(page,game.questions[0].fractionFigure)
  const wrong=game.questions[0].choices.find(c=>c.text!==correct).text;await card(page,wrong).click();await page.locator('.ci-answer-key').waitFor();await fits(page);await axe(page);await page.screenshot({path:`${out}/competition-390.png`})
  await gameControl(page,'Voir le classement').click();assert.match(await page.getByRole('dialog',{name:'Classement',exact:true}).innerText(),/1[\s’']?000/);results.push({mode:'local',checks:['Same public drawing for both mascots','Offline answers and server-model scores','Correct fraction highlighted once; mobile layout and axe pass']});await context.close()
 }
 for(const[width,height]of[[1366,768],[640,360]]){
  console.log(`Figures fractionnaires, duel ${width}×${height}`)
  const{page,context}=await setup(width,height),pool=await choose(page,false,1)
  await gameControl(page,'Compétition').click();await gameControl(page,'Préparer un duel').click()
  await page.getByRole('region',{name:'Équipe 1',exact:true}).getByRole('button',{name:'Kitsune',exact:true}).click();await page.getByRole('region',{name:'Équipe 2',exact:true}).getByRole('button',{name:'Carpe koï',exact:true}).click()
  await page.getByRole('spinbutton',{name:'Vie maximale',exact:true}).fill('200')
  for(const level of[2,3])await page.getByRole('spinbutton',{name:`Chance de critique ×${level} (%)`,exact:true}).fill('0')
  await page.getByRole('spinbutton',{name:'Chance de critique ×4 (%)',exact:true}).fill('100');await page.getByRole('checkbox',{name:'Activer le minuteur du duel',exact:true}).uncheck()
  const game=await competitionGame(page,pool);await page.getByRole('button',{name:'Préparer la partie',exact:true}).click();await page.getByRole('button',{name:'Commencer le duel',exact:true}).waitFor({timeout:120000})
  await page.clock.install();await page.clock.pauseAt(new Date(Date.now()+10000));await context.setOffline(true);await page.getByRole('button',{name:'Commencer le duel',exact:true}).click();await page.locator('.ci-duel-answer:enabled').first().waitFor();await diagram(page,game.questions[0].fractionFigure)
  for(const time of[0,165,280,385,550,560,605,750,880,1000]){
   await page.evaluate(time=>{for(const a of document.getAnimations()){if(a.effect?.target instanceof Element&&a.effect.target.closest('.ci-duel-fighter')){a.pause();a.currentTime=time}}},time)
   await fits(page,true)
   const b=await page.evaluate(()=>({question:document.querySelector('.ci-duel-question').getBoundingClientRect().bottom,cards:Math.min(...[...document.querySelectorAll('.ci-duel-cards')].map(n=>n.getBoundingClientRect().top)),auras:[...document.querySelectorAll('.ci-duel-fighter .ci-power-flame')].map(n=>{const r=n.getBoundingClientRect();return{top:r.top,bottom:r.bottom}})}))
   assert.equal(b.auras.length,2);for(const aura of b.auras){assert.ok(aura.top>=b.question+20,JSON.stringify(b));assert.ok(aura.bottom<=b.cards-20,JSON.stringify(b))}
  }
  await page.screenshot({path:`${out}/duel-${width}.png`});assert.ok(await page.locator('.ci-duel-answer .ci-fraction-digits').count());await page.clock.resume();await axe(page)
  results.push({mode:'duel',viewport:`${width}x${height}`,checks:['Source figure visible beside the question on short landscape screens','Adult mascots and critical ×4 aura stay at least 20 px from question and cards at ten animation times','All twelve responses fit and use stacked fractions','Offline after preparation; automated axe passes']});await context.close()
 }
 assert.deepEqual(errors,[]);assert.deepEqual(api,[])
 await writeFile('docs/interactive/fraction-figures-results.json',JSON.stringify({results,errors,worksheetApiCalls:api,physicalDevicesTested:false},null,2)+'\n')
 await writeFile(out+'/index.html',`<!doctype html><html lang="fr"><meta charset="utf-8"><title>Lire les fractions illustrées</title><style>body{font:17px system-ui;background:#f6f7fb;color:#182238;margin:24px}main{max-width:1200px;margin:auto}figure{background:white;padding:16px;border:1px solid #ccd0dd;border-radius:12px}img{max-width:100%;height:auto}figcaption{font-weight:700;margin-bottom:12px}</style><main><h1>Fractions illustrées en jeu</h1><p>Figures source, fractions verticales, correction dans les cartes.</p>${['thinking-1366','thinking-390','thinking-360','class-1366','class-390','class-360','competition-390','duel-1366','duel-640'].map(name=>`<figure><figcaption>${name}</figcaption><img src="${name}.png" alt="Figure fractionnaire et cartes de réponse"></figure>`).join('')}</main></html>`)
 console.log(JSON.stringify(results,null,2))
}catch(error){for(const page of browser.contexts().flatMap(c=>c.pages())){await page.screenshot({path:'/tmp/clairfle-fraction-figures-error.png',fullPage:true}).catch(()=>{});await writeFile('/tmp/clairfle-fraction-figures-error.txt',await page.locator('body').innerText()).catch(()=>{})}throw error}
finally{await browser.close();await vite.close()}
