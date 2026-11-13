import assert from 'node:assert/strict'
import {mkdir,writeFile} from 'node:fs/promises'
import {createServer} from 'vite'
import {chromium} from 'playwright'
import AxeBuilder from '@axe-core/playwright'

const base='http://127.0.0.1:5182'
process.env.VITE_FICHES_API_URL=base+'/__test_api'
const vite=await createServer({cacheDir:'/tmp/clairfle-duel-browser',server:{host:'127.0.0.1',port:5182,strictPort:true}})
await vite.listen()
const {demoRecipe}=await vite.ssrLoadModule('/src/interactive/demo.ts')
const {defaultPage}=await vite.ssrLoadModule('/src/math/catalog.ts')
const tokens=[{text:'Le',category:'determinant'},{text:'professeur',category:'nom'},{text:'le',category:'pronom'},{text:'félicite',category:'verbe'}]
const numeric={layout:'select',prompt:'2 + 2 = ?',options:['4','5','6','7','8','9'],answer:'4'}
const phrase={layout:'phrase-color',tokens,answer:tokens.map(token=>token.category).join(' · ')}
const makeFiche=(id,item,config)=>({id,name:id,domains:['gattegno'],recipe:{...demoRecipe(),libreMode:true,pages:[{...config,count:1,columns:1,extraBlocks:undefined,libreItems:[item]}]},createdAt:'2026-11-13T00:00:00Z',updatedAt:'2026-11-13T00:00:00Z'})
const fiches=[makeFiche('duel-numeric',numeric,defaultPage('algèbre')),makeFiche('duel-words',phrase,{...defaultPage('gattegno'),topic:'phrase-simple',exerciseType:'phrase-simple-colorier'})]
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH||undefined,args:['--no-sandbox']})
const results=[],errors=[],methods=[]
const button=(page,name)=>page.getByRole('button',{name,exact:true})
const side=(page,value)=>page.locator(`.ci-duel-player[data-side="${value}"]`)
const answer=(page,value,text)=>side(page,value).locator('.ci-duel-answer').filter({has:page.locator('.ci-duel-answer-content').getByText(text,{exact:true})})
const hp=async page=>(await page.locator('.ci-duel-hp').allTextContents()).map(text=>Number(text.replace(/\D/g,'')))
const id=page=>page.locator('.ci-duel-arena').getAttribute('data-duel-round')
async function setup(fiche,width=390,height=844){
  const context=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'})
  await context.addCookies([{name:'clairfle-fiche-access',value:'admin',url:base}])
  await context.addInitScript(()=>{
    localStorage.setItem('clairfle-fiche-sync','duel-fixtures-only')
    localStorage.setItem('clairfle.interactive.timer.v1',JSON.stringify({enabled:false,seconds:5,feedbackSeconds:1}))
  })
  await context.route('**/__test_api/fiches',route=>{methods.push(route.request().method());return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({fiches})})})
  const page=await context.newPage();page.setDefaultTimeout(30000);page.on('pageerror',error=>errors.push(error.message))
  console.log(`Duel fixture ${fiche} ${width}x${height}`)
  await page.goto(`${base}/interactif/${fiche}`);await page.locator('.ci-launch:enabled').waitFor({timeout:120000})
  await button(page,'Compétition').click()
  return {page,context}
}
async function prepare(page){
  await page.getByRole('checkbox',{name:'Activer le minuteur du duel',exact:true}).uncheck()
  await page.getByRole('spinbutton',{name:'Temps de correction (secondes)',exact:true}).fill('1')
  await button(page,'Préparer la partie').click();await button(page,'Commencer le duel').waitFor()
}
async function next(page,previous){
  await page.waitForFunction(old=>{const node=document.querySelector('.ci-duel-arena');return node&&node.dataset.duelRound!==old&&!!document.querySelector('.ci-duel-answer:enabled')},previous)
}
async function fits(page){
  const vp=page.viewportSize()
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false)
  for(const node of await page.locator('.ci-duel-player,.ci-duel-answer,.ci-duel-controls').all()){
    const box=await node.boundingBox();assert.ok(box&&box.x>=-1&&box.y>=-1&&box.x+box.width<=vp.width+1&&box.y+box.height<=vp.height+1,JSON.stringify({vp,box}))
    if(await node.evaluate(el=>el.matches('.ci-duel-answer')))assert.ok(box.height>=44,JSON.stringify(box))
  }
}
async function axe(page){
  const scan=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()
  assert.deepEqual(scan.violations.map(v=>({id:v.id,targets:v.nodes.map(node=>node.target)})),[])
}
async function journal(page,mode='duel'){
  return page.evaluate(mode=>{const key=Object.keys(sessionStorage).find(key=>key.startsWith(`clairfle.duel.${mode}.`));return {key,data:JSON.parse(sessionStorage.getItem(key))}},mode)
}
async function knownCriticalSeed(page){
  return page.evaluate(async()=>{
    const {createDuel,duelRound}=await import('/src/interactive/duel/core.ts')
    const key=Object.keys(sessionStorage).find(key=>key.startsWith('clairfle.duel.duel.')),record=JSON.parse(sessionStorage.getItem(key))
    const quiz={id:record.quizId,title:'Seed fixture',items:[{question:{id:'q',prompt:'?',images:[],choices:[{id:'yes',text:'Oui'},{id:'no',text:'Non'}]},correctChoiceId:'yes'}]}
    for(let seed=1;seed<=1000;seed++){
      const state=createDuel(quiz,{...record.config,seed},record.timer,record.createdAt)
      if(!duelRound(quiz,state).critical&&duelRound(quiz,{...state,turn:1}).critical){record.config.seed=seed;sessionStorage.setItem(key,JSON.stringify(record));return seed}
    }
    throw new Error('A deterministic normal/critical test seed is required.')
  })
}
try{
  await mkdir('docs/interactive/screenshots',{recursive:true})
  for(const [width,height]of [[390,844],[1366,768],[360,640]]){
    const {page,context}=await setup('duel-numeric',width,height)
    await button(page,'Préparer un duel').click();await prepare(page)
    const seed=await knownCriticalSeed(page)
    await button(page,'Quitter la compétition').click();await button(page,'Reprendre la partie').click();await button(page,'Commencer le duel').click()
    await page.locator('.ci-duel-answer:enabled').first().waitFor();assert.deepEqual(await hp(page),[100,100]);await fits(page)
    assert.equal(await page.locator('.ci-duel-critical').count(),0)
    const first=await id(page)
    await page.evaluate(()=>{
      const find=(side,text)=>[...document.querySelectorAll(`.ci-duel-player[data-side="${side}"] .ci-duel-answer`)].find(node=>node.querySelector('.ci-duel-answer-content').textContent===text)
      find('left','4').click();find('right','5').click()
    })
    assert.deepEqual(await hp(page),[100,90]);assert.equal(await page.locator('.ci-duel-flight').count(),1)
    assert.equal(await page.locator('.ci-duel-impact').getAttribute('data-attacker'),'left')
    assert.equal(await page.locator('.ci-duel-impact').getAttribute('data-direction'),width<=700?'down':'right')
    assert.equal(await side(page,'right').locator('.ci-duel-answer-key').count(),1)
    assert.equal(await side(page,'right').locator('.ci-duel-answer-muted').count(),5)
    await next(page,first);assert.equal(await page.locator('.ci-duel-critical').innerText(),'Critique ! 20 %')
    const second=await id(page);await answer(page,'left','5').click()
    assert.deepEqual(await hp(page),[80,90]);assert.equal(await page.locator('.ci-mistake-object').count(),6)
    assert.equal(await page.locator('.ci-duel-flight').count(),0)
    assert.equal(await page.locator('.ci-duel-impact').getAttribute('data-impact-kind'),'mistake')
    assert.equal(await page.locator('.ci-duel-impact').getAttribute('data-attacker'),null)
    assert.equal(await page.locator('.ci-duel-impact').getAttribute('data-victim'),'left')
    assert.equal(await side(page,'left').locator('.ci-competition-portrait').evaluate(node=>getComputedStyle(node).animationName),'ci-duel-super-hurt')
    assert.ok((await page.locator('.ci-mistake-object').evaluateAll(nodes=>nodes.map(node=>getComputedStyle(node).animationName))).every(name=>name==='ci-duel-fall'))
    await page.waitForTimeout(200) // Capture the falling objects during the critical mistake.
    await page.screenshot({path:`docs/interactive/screenshots/duel-critical-${width}.png`})
    await next(page,second);await axe(page)
    await button(page,'Plein écran').click();await fits(page)
    assert.equal(await page.locator('.ci-header button:visible').count(),1)
    await button(page,'Quitter le plein écran').click()
    await button(page,'Contraste').click();await axe(page);await button(page,'Contraste').click()
    if(width===1366){
      const old=await id(page),damage=await page.locator('.ci-duel-critical').count()?20:10
      const index=(await side(page,'right').locator('.ci-duel-answer-content').allTextContents()).indexOf('4')
      await page.keyboard.press(String(index+1));assert.deepEqual(await hp(page),[80-damage,90]);await next(page,old)
    }
    if(width===390){
      await button(page,'Quitter la compétition').click();await button(page,'Quitter la compétition').click();await button(page,'Quitter la compétition').click()
      await page.locator('.ci-launch:enabled').waitFor();await button(page,'Compétition').click();await button(page,'Préparer un duel').click();await button(page,'Reprendre la partie').click()
      await page.getByRole('heading',{name:'Duel en pause',exact:true}).waitFor()
      await page.locator('.ci-duel-pause').getByRole('button',{name:'Reprendre le duel',exact:true}).click()
      assert.deepEqual(await hp(page),[80,90]);assert.ok((await id(page)).startsWith(`${seed}:`))
      let right=90
      for(let turn=0;right>0&&turn<12;turn++){
        await answer(page,'left','4').waitFor();const old=await id(page),damage=await page.locator('.ci-duel-critical').count()?20:10
        await answer(page,'left','4').click();right=Math.max(0,right-damage);assert.deepEqual(await hp(page),[80,right])
        if(right)await next(page,old)
      }
      assert.equal(right,0);await page.getByRole('heading',{name:/Panda 1 remporte le duel !/}).waitFor()
      assert.deepEqual((await page.locator('.ci-duel-final-score b').allTextContents()).map(Number),[1,0])
      const {key:previousKey,data}=await journal(page);assert.equal(data.events.filter(event=>event.action.type==='answer').length>=7,true)
      for(const forbidden of ['correctChoiceId','question','hp','wins','tokens'])assert.equal(Object.hasOwn(data,forbidden),false)
      assert.ok(!JSON.stringify(data).includes('correctChoiceId'))
      await button(page,'Nouvelle partie').click();await page.getByRole('heading',{name:'Jouer en compétition',exact:true}).waitFor()
      await button(page,'Préparer un duel').click();await prepare(page)
      const fresh=await page.evaluate(previousKey=>{const key=Object.keys(sessionStorage).find(key=>key.startsWith('clairfle.duel.duel.')&&key!==previousKey);return key?JSON.parse(sessionStorage.getItem(key)):null},previousKey)
      assert.ok(fresh);assert.notEqual(fresh.quizId,data.quizId);assert.deepEqual(fresh.events,[])
      assert.equal((await page.evaluate(()=>Object.keys(sessionStorage).filter(key=>key.startsWith('clairfle.duel.duel.')).length)),2)
      results.push({duel:'first simultaneous click wins; normal correct answer deals 10%; critical wrong answer deals 20% to oneself; repeated questions continue to zero; one winner',resume:'exit through all setup screens retains source quiz, seed, 80/90 health and progress',restart:'explicit new game renews the source session and creates a separate empty journal; the previous completed duel is preserved',journal:'replayed actions only, without question bodies, private keys or score snapshots'})
    }
    results.push({viewport:`${width}x${height}`,cards:'two players and health bars fit; touch targets at least 44 px; only correct cards retain color',animation:'directional curved attack on a correct answer; critical mistake drops six objects on oneself with stronger hurt; active with reduced-motion preference',fullscreen:'only exit-fullscreen remains in the header',axeViolations:0})
    await context.close()
  }
  for(const [width,height]of [[390,844],[1366,768],[360,640]]){
    const {page,context}=await setup('duel-words',width,height)
    await button(page,'Créer les équipes').click()
    const left=page.getByRole('region',{name:'Équipe 1',exact:true}),right=page.getByRole('region',{name:'Équipe 2',exact:true})
    await left.getByRole('button',{name:'Ajouter à l’équipe 1',exact:true}).click()
    assert.equal(await button(page,'Préparer la partie').isEnabled(),false)
    await left.getByRole('button',{name:'Koala',exact:true}).click();await left.getByRole('button',{name:'Ajouter à l’équipe 1',exact:true}).click()
    await right.getByRole('button',{name:'Ajouter à l’équipe 2',exact:true}).click();await right.getByRole('button',{name:'Tigre',exact:true}).click();await right.getByRole('button',{name:'Ajouter à l’équipe 2',exact:true}).click()
    assert.equal(await page.locator('.ci-duel-pair-preview li').count(),2)
    const preview=await page.locator('.ci-duel-pair-preview li').allTextContents()
    const previewAvatars=await page.locator('.ci-duel-pair-preview .ci-competition-avatar').evaluateAll(nodes=>nodes.map(node=>node.getAttribute('aria-label')))
    await prepare(page)
    const {data}=await journal(page,'teams'),expected=await page.evaluate(async config=>{const {duelPairs}=await import('/src/interactive/duel/core.ts');return duelPairs(config)},data.config)
    await context.setOffline(true)
    for(let pairIndex=0;pairIndex<2;pairIndex++){
      await button(page,'Commencer le duel').waitFor()
      assert.equal(await page.locator('.ci-duel-call .ci-competition-portrait').count(),2)
      const called=await page.locator('.ci-duel-call .ci-competition-seat').allTextContents()
      assert.deepEqual(called.map(Number),[expected[pairIndex].left.seat,expected[pairIndex].right.seat])
      assert.deepEqual(await page.locator('.ci-duel-call .ci-competition-avatar').evaluateAll(nodes=>nodes.map(node=>node.getAttribute('aria-label'))),previewAvatars.slice(pairIndex*2,pairIndex*2+2))
      assert.deepEqual(await page.locator('.ci-duel-call section > b').allTextContents(),['100 %','100 %'])
      await button(page,'Commencer le duel').click();await page.locator('.ci-duel-answer:enabled').first().waitFor();assert.deepEqual(await hp(page),[100,100]);await fits(page)
      if(pairIndex===0){await axe(page);await page.screenshot({path:`docs/interactive/screenshots/duel-teams-${width}.png`})}
      let targetHP=100
      for(let turn=0;targetHP>0&&turn<12;turn++){
        const old=await id(page),target=await page.locator('.ci-classification-target').innerText(),position=Number((await page.locator('.ci-classification-progress').innerText()).match(/Élément (\d+)/)[1])-1
        assert.equal(target,tokens[position].text)
        const label={determinant:'Déterminants',nom:'Noms',pronom:'Pronoms',verbe:'Verbes'}[tokens[position].category]
        const damage=await page.locator('.ci-duel-critical').count()?20:10
        await answer(page,'left',label).click();targetHP=Math.max(0,targetHP-damage);assert.equal((await hp(page))[1],targetHP)
        assert.equal(await page.locator('.ci-duel-impact').getAttribute('data-effect'),expected[pairIndex].left.avatarId)
        if(targetHP)await next(page,old)
      }
      assert.equal(targetHP,0)
    }
    await page.getByRole('heading',{name:'L’équipe 1 remporte le tournoi !',exact:true}).waitFor()
    assert.deepEqual((await page.locator('.ci-duel-final-score b').allTextContents()).map(Number),[2,0])
    results.push({teams:`${width}x${height}`,pairing:'equal rosters required; fixed seed draws every seat once; preview and called order retained; 100% health at each new pair',source:'Gattegno sentence and current word stay neutral; repeated categories remain usable',offline:'network disabled after preparation, two complete duels then team winner 2–0',preview})
    await context.close()
  }
  assert.ok(methods.length&&methods.every(method=>method==='GET'));assert.deepEqual(errors,[])
  await writeFile('docs/interactive/duel-results.json',JSON.stringify({results,errors,serverWritesToFicheApi:0,network:'shared screen, local play after media preparation; no production deployment'},null,2)+'\n')
  console.log(JSON.stringify(results,null,2))
}finally{await browser.close();await vite.close()}
