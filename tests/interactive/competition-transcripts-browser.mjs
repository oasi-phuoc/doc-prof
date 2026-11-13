import assert from 'node:assert/strict'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { createServer } from 'vite'
import { chromium } from 'playwright'
import AxeBuilder from '@axe-core/playwright'
import { serveCompetition } from './competition-server.mjs'

const base='http://127.0.0.1:5182',apiBase='http://127.0.0.1:5193',teacherKey=`fixture-only-${crypto.randomUUID()}`
process.env.VITE_FICHES_API_URL=base+'/__test_api'
process.env.VITE_COMPETITION_API_URL=apiBase+'/competition'
const vite=await createServer({cacheDir:'/tmp/clairfle-competition-transcripts',server:{host:'127.0.0.1',port:5182,strictPort:true}})
await vite.listen()
const service=await serveCompetition(vite,{origin:base,teacherKey})
const {demoRecipe}=await vite.ssrLoadModule('/src/interactive/demo.ts')
const {defaultPage}=await vite.ssrLoadModule('/src/math/catalog.ts')
const bank=JSON.parse(await readFile('src/tcf/content/a0-a1/co.json','utf8'))
const candidates=bank.filter(ex=>ex.type_exercice==='complet'&&ex.support.audio&&typeof ex.support.transcription==='string'&&ex.support.transcription.trim()&&ex.questions.length>=2)
const first=candidates[0],second=candidates.find(ex=>ex.support.audio!==first.support.audio),text=first.support.transcription.trim()
const recipe={...demoRecipe(),libreMode:false,pages:[first,second].map((ex,index)=>({...defaultPage('tcf-csc'),topic:'tcf-co',exerciseType:'tcf-co-ex-3',count:1,tcfExercise:{...ex,questions:ex.questions.slice(0,index?1:2)},libreItems:undefined,extraBlocks:undefined}))}
const original=structuredClone(recipe),saved={id:'competition-transcripts',name:'Écoutes en compétition',recipe,domains:['tcf-csc'],createdAt:'2026-11-13T00:00:00Z',updatedAt:'2026-11-13T00:00:00Z'}
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH||undefined,args:['--no-sandbox']})
const results=[],errors=[],methods=[],contexts=[]
const button=(page,name)=>page.getByRole('button',{name,exact:true})
const review=page=>button(page,'Lire la transcription')
const dialog=page=>page.getByRole('dialog',{name:'Transcription de l’écoute',exact:true})
async function context(width=390,height=844){
  const ctx=await browser.newContext({viewport:{width,height}});contexts.push(ctx)
  await ctx.addCookies([{name:'clairfle-fiche-access',value:'admin',url:base}])
  await ctx.addInitScript(()=>{
    localStorage.setItem('clairfle-fiche-sync','competition-transcripts-fixture')
    localStorage.setItem('clairfle.interactive.timer.v1',JSON.stringify({enabled:false,seconds:30,feedbackSeconds:10}))
  })
  await ctx.route('**/__test_api/fiches',async route=>{methods.push(route.request().method());await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({fiches:[saved]})})})
  const page=await ctx.newPage();page.on('pageerror',error=>errors.push(error.message))
  page.setDefaultTimeout(30000)
  return {ctx,page}
}
async function setup(page){
  await page.goto(`${base}/interactif/${saved.id}`)
  await page.locator('.ci-launch:enabled').waitFor({timeout:120000})
  await button(page,'Compétition').click()
  await page.getByRole('heading',{name:'Jouer en compétition',exact:true}).waitFor()
}
async function wire(page,code){return page.evaluate(async({apiBase,code})=>{
  const access=JSON.parse(sessionStorage.getItem(`clairfle.competition.player.${code}`))
  return (await(await fetch(`${apiBase}/competition/rooms/${code}`,{headers:{Authorization:`Bearer ${access.token}`}})).json()).view
},{apiBase,code})}
async function noText(page){assert.equal(await page.getByText(text,{exact:true}).count(),0);assert.equal(await dialog(page).count(),0)}
async function fits(page){
  const vp=page.viewportSize()
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false)
  for(const element of await page.locator('.ci-competition-host-controls,.ci-competition-review-controls,.ci-answer,[aria-label="Lire la transcription"]').all()){
    const rect=await element.boundingBox()
    if(rect)assert.ok(rect.x>=-1&&rect.y>=-1&&rect.x+rect.width<=vp.width+1&&rect.y+rect.height<=vp.height+1,JSON.stringify({vp,rect}))
  }
}
async function closeReading(page){await page.keyboard.press('Escape');await noText(page);assert.equal(await review(page).evaluate(node=>node===document.activeElement),true)}
async function inspectReading(page,file){
  assert.equal((await dialog(page).locator('.ci-text-dialog-body p').innerText()).trim(),text)
  const scan=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()
  assert.deepEqual(scan.violations.map(v=>({id:v.id,impact:v.impact})),[])
  await page.screenshot({path:`docs/interactive/screenshots/${file}.png`,fullPage:true})
}
try{
  await mkdir('docs/interactive/screenshots',{recursive:true})
  const host=await context(1366,768);await setup(host.page)
  assert.equal(await host.page.getByRole('checkbox',{name:'Proposer la transcription après les réponses',exact:true}).isChecked(),true)
  await host.page.getByLabel('Accès enseignant aux salles',{exact:true}).fill(teacherKey)
  await button(host.page,'Créer la salle').click();await host.page.locator('.ci-competition-code').waitFor()
  const code=(await host.page.locator('.ci-competition-code').innerText()).trim(),learners=[]
  for(const [width,height,avatar]of [[390,844,'Panda'],[360,640,'Renard']]){
    const learner=await context(width,height);learners.push(learner)
    await learner.page.goto(`${base}/interactif/rejoindre/${code}`)
    await button(learner.page,avatar).click();await button(learner.page,'Rejoindre la salle').click()
    await learner.page.getByText('Tu es dans la salle. Attends le départ.',{exact:true}).waitFor()
    assert.equal((await wire(learner.page,code)).transcript,undefined)
  }
  await host.page.getByRole('status').filter({hasText:'2 joueur(s)'}).waitFor()
  await button(host.page,'Commencer la compétition').click()
  for(let index=0;index<2;index++){
    const item=service.snapshot(code).room.quiz.items[index],correctIndex=item.question.choices.findIndex(c=>c.id===item.correctChoiceId)
    assert.equal(item.transcript,text)
    for(const learner of learners){
      await learner.page.locator('.ci-competition-round-head').filter({hasText:`Question ${index+1} / 3`}).waitFor()
      await learner.page.locator('.ci-answer:enabled').first().waitFor()
      assert.equal(await review(learner.page).count(),0);await noText(learner.page)
      assert.equal((await wire(learner.page,code)).transcript,undefined)
    }
    await learners[0].page.locator('.ci-answer').nth(correctIndex).click()
    await learners[0].page.getByRole('status').filter({hasText:'Réponse envoyée.'}).waitFor()
    assert.equal((await wire(learners[0].page,code)).transcript,undefined)
    await learners[1].page.locator('.ci-answer').nth(correctIndex).click()
    for(const learner of learners)await learner.page.locator('.ci-answer-key').waitFor()
    await button(host.page,'Question suivante').waitFor()
    if(index===0){
      for(const page of [host.page,...learners.map(l=>l.page)]){assert.equal(await review(page).count(),0);await noText(page)}
      await button(host.page,'Question suivante').click()
    }
  }
  for(const learner of learners){await review(learner.page).waitFor();await fits(learner.page);assert.equal((await wire(learner.page,code)).transcript,text)}
  await review(learners[0].page).click()
  assert.equal(service.snapshot(code).room.paused,false,'A learner cannot pause the whole room by reading.')
  await closeReading(learners[0].page)
  await review(host.page).click();await dialog(host.page).waitFor()
  console.log('Lecture enseignant ouverte ; contrôle de la pause partagée.')
  assert.equal(service.snapshot(code).room.paused,true)
  const paused=structuredClone(service.snapshot(code).room)
  await inspectReading(host.page,'competition-transcript-host')
  for(const learner of learners){
    await learner.page.getByRole('heading',{name:'Pause',exact:true}).waitFor()
    await review(learner.page).click()
    await inspectReading(learner.page,`competition-transcript-online-${learner.page.viewportSize().width}`)
    await closeReading(learner.page)
  }
  await new Promise(resolve=>setTimeout(resolve,11000))
  assert.equal(service.snapshot(code).room.index,1);assert.equal(service.snapshot(code).room.remainingMs,paused.remainingMs)
  assert.deepEqual(service.snapshot(code).room.players,paused.players)
  await closeReading(host.page)
  console.log('Pause conservée ; redémarrage et reprise des navigateurs.')
  assert.equal(service.snapshot(code).room.paused,true,'Closing reading leaves the teacher in control of resuming.')
  service.restart(code)
  await host.page.reload();await host.page.getByRole('heading',{name:'Pause',exact:true}).waitFor()
  await noText(host.page);await review(host.page).waitFor()
  await learners[0].page.reload();await learners[0].page.getByRole('heading',{name:'Pause',exact:true}).waitFor()
  await noText(learners[0].page);assert.equal((await wire(learners[0].page,code)).transcript,text)
  await review(learners[0].page).click()
  await host.page.locator('.ci-competition-host-controls').getByRole('button',{name:'Reprendre',exact:true}).click()
  await button(host.page,'Question suivante').click()
  await learners[0].page.locator('.ci-competition-round-head').filter({hasText:'Question 3 / 3'}).waitFor()
  await noText(learners[0].page);assert.equal((await wire(learners[0].page,code)).transcript,undefined)
  results.push({online:'two real TCF questions and two learner browsers; raw API responses withhold the transcript until the final shared correction; the next recording removes it',teacherReading:'opening pauses the authoritative correction; eleven seconds do not consume the remaining time or change scores; explicit resume required',learnerReading:'read-only; cannot pause everyone; closes on next question',restart:'room restart and browser reload retain eligible text and pause, with reading window closed',viewports:['1366x768','390x844','360x640'],axeViolations:0})
  await host.ctx.close();for(const learner of learners)await learner.ctx.close()
  console.log('Salle en ligne et reprise validées ; vérification de la désactivation.')

  const disabled=await context(1366,768);await setup(disabled.page)
  await disabled.page.getByRole('checkbox',{name:'Proposer la transcription après les réponses',exact:true}).uncheck()
  await disabled.page.getByLabel('Accès enseignant aux salles',{exact:true}).fill(teacherKey)
  await button(disabled.page,'Créer la salle').click();await disabled.page.locator('.ci-competition-code').waitFor()
  const disabledCode=(await disabled.page.locator('.ci-competition-code').innerText()).trim(),disabledRoom=service.snapshot(disabledCode).room
  assert.equal(disabledRoom.settings.showTranscripts,false)
  assert.ok(disabledRoom.quiz.items.every(item=>!('transcript'in item)))
  results.push({disabled:'unchecked preparation option sends no private transcripts to the server'})
  await disabled.ctx.close()

  for(const [width,height]of [[390,844],[1366,768],[360,640]]){
    console.log(`Défi local ${width} × ${height}.`)
    const local=await context(width,height),page=local.page;await setup(page)
    console.log('Préparation des médias du défi local.')
    await button(page,'Préparer le défi local').click();await page.getByRole('heading',{name:'Défi sur cet appareil',exact:true}).waitFor()
    console.log('Médias prêts ; inscription des deux mascottes.')
    await button(page,'Panda').click();await button(page,'Ajouter cette mascotte').click()
    await button(page,'Renard').click();await button(page,'Ajouter cette mascotte').click()
    await local.ctx.setOffline(true);await button(page,'Commencer la compétition').click()
    console.log('Compétition locale lancée sans réseau.')
    for(let index=0;index<2;index++){
      for(let player=0;player<2;player++){
        await page.getByRole('heading',{name:'À toi !',exact:true}).waitFor()
        assert.equal(await review(page).count(),0);await noText(page)
        await button(page,'Je suis prêt').click();await page.locator('.ci-answer:enabled').first().waitFor()
        await page.locator('.ci-answer').first().click()
        if(player===0){await page.getByRole('heading',{name:'À toi !',exact:true}).waitFor();assert.equal(await review(page).count(),0);await noText(page)}
      }
      await page.locator('.ci-answer-key').waitFor()
      if(index===0){assert.equal(await review(page).count(),0);await button(page,'Question suivante').click()}
      console.log(`Question locale ${index+1} corrigée.`)
    }
    await review(page).waitFor();await fits(page);await review(page).click();await dialog(page).waitFor()
    await new Promise(resolve=>setTimeout(resolve,12000))
    assert.match(await page.locator('.ci-competition-round-head').innerText(),/Question 2 \/ 3/)
    await inspectReading(page,`competition-transcript-local-${width}`)
    await closeReading(page);await page.getByRole('heading',{name:'Pause',exact:true}).waitFor()
    const journal=await page.evaluate(()=>Object.keys(sessionStorage).filter(key=>key.startsWith('clairfle.competition.local.')).map(key=>sessionStorage.getItem(key))[0])
    assert.ok(!journal.includes(text));assert.ok(!journal.includes('readingAt'));assert.ok(!journal.includes('correctChoiceId'))
    await page.locator('.ci-competition-host-controls').getByRole('button',{name:'Reprendre',exact:true}).click()
    await button(page,'Question suivante').click();await page.getByRole('heading',{name:'À toi !',exact:true}).waitFor()
    assert.equal(await review(page).count(),0);await noText(page)
    results.push({local:`${width}x${height}`,offline:'two mascots complete the shared recording with network disabled after full media preparation',privacy:'handoff and first correction hide the text; last correction permits review',pause:'twelve seconds of reading cannot advance; explicit resume preserves control',journal:'no transcript, reading window or answer key stored',axeViolations:0})
    await local.ctx.close()
  }
  assert.deepEqual(recipe,original);assert.ok(methods.length&&methods.every(method=>method==='GET'));assert.deepEqual(errors,[])
  await writeFile('docs/interactive/competition-transcripts-results.json',JSON.stringify({results,errors,serverWritesToFicheApi:0,productionDeployment:false},null,2)+'\n')
  console.log(JSON.stringify(results,null,2))
}catch(error){console.error(error);throw error}
finally{await service.close();await browser.close();await vite.close()}
