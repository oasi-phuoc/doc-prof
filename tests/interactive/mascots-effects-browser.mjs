import {gameControl} from './browser-actions.mjs'
import assert from 'node:assert/strict'
import {mkdir,writeFile} from 'node:fs/promises'
import {createServer} from 'vite'
import {chromium} from 'playwright'
import AxeBuilder from '@axe-core/playwright'

const base='http://127.0.0.1:5182'
process.env.VITE_FICHES_API_URL=base+'/__test_api'
const vite=await createServer({cacheDir:'/tmp/clairfle-mascots-effects',server:{host:'127.0.0.1',port:5182,strictPort:true,hmr:false}})
await vite.listen()
const {demoRecipe}=await vite.ssrLoadModule('/src/interactive/demo.ts')
const {MASCOTS,mascotStyle}=await vite.ssrLoadModule('/src/interactive/domain/mascot.ts')
const {signatureFor}=await vite.ssrLoadModule('/src/interactive/duel/vfx/catalog.ts')
const recipe={...demoRecipe(),pages:[{...demoRecipe().pages[0],count:1,libreItems:[{layout:'select',prompt:'2 + 2 = ?',options:['4','5','6','7','8','9'],answer:'4'}]}]}
const saved={id:'mascot-effects',name:'Mascottes et animations',recipe,domains:['algèbre'],createdAt:'2026-11-13T00:00:00Z',updatedAt:'2026-11-13T00:00:00Z'}
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH||undefined,args:['--no-sandbox']})
const button=(page,name)=>gameControl(page,name),results=[],errors=[],methods=[]
async function setup(width,height){
  const context=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'})
  await context.addCookies([{name:'clairfle-fiche-access',value:'admin',url:base}])
  await context.addInitScript(()=>{localStorage.setItem('clairfle-fiche-sync','mascot-fixture-only');localStorage.setItem('clairfle.interactive.timer.v1',JSON.stringify({enabled:false,seconds:5,feedbackSeconds:1}))})
  await context.route('**/__test_api/fiches',route=>{methods.push(route.request().method());return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({fiches:[saved]})})})
  const page=await context.newPage();page.setDefaultTimeout(30000);page.on('pageerror',error=>errors.push(error.message))
  await page.goto(`${base}/interactif/${saved.id}`);await page.locator('.ci-launch:enabled').waitFor({timeout:120000})
  return {context,page}
}
async function axe(page){const scan=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();assert.deepEqual(scan.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})),[])}
async function next(page,old){await page.waitForFunction(old=>document.querySelector('.ci-duel-arena')?.dataset.duelRound!==old&&!!document.querySelector('.ci-duel-answer:enabled'),old)}
const answer=(page,side,label)=>page.locator(`.ci-duel-player[data-side="${side}"] .ci-duel-answer`).filter({has:page.locator('.ci-duel-answer-content').getByText(label,{exact:true})})
try{
  await mkdir('docs/interactive/screenshots',{recursive:true})
  for(const [width,height]of [[390,844],[1366,768],[360,640]]){
    console.log(`Mascots and effects ${width}x${height}`)
    const {context,page}=await setup(width,height)
    await page.locator('.ci-launch').click();await page.locator('.ci-controls').waitFor()
    for(const mascot of MASCOTS){
      await button(page,'Mascotte').click()
      const picker=page.getByRole('dialog',{name:'Choisir la mascotte',exact:true})
      assert.equal(await picker.getByRole('button').count(),30);assert.equal((await picker.innerText()).trim(),'')
      await picker.getByRole('button',{name:mascot.label,exact:true}).click()
      assert.equal(await page.locator('.ci-app').getAttribute('data-mascot'),mascot.id)
      const sprite=page.locator('.ci-phase-art .ci-mascot-sprite'),style=await sprite.evaluate(node=>({image:getComputedStyle(node).backgroundImage,x:getComputedStyle(node).backgroundPositionX,y:getComputedStyle(node).backgroundPositionY,animation:getComputedStyle(node).animationName}))
      const expected=mascotStyle(mascot.id)
      assert.ok(style.image.includes(mascot.sheet.src));assert.equal(style.x,expected['--ci-thinking-x']);assert.equal(style.y,expected['--ci-thinking-y']);assert.notEqual(style.animation,'none')
    }
    await button(page,'Mascotte').click();const picker=page.getByRole('dialog',{name:'Choisir la mascotte',exact:true})
    const box=await picker.boundingBox();assert.ok(box.x>=0&&box.y>=0&&box.x+box.width<=width&&box.y+box.height<=height)
    assert.equal(await picker.evaluate(node=>node.scrollHeight>node.clientHeight),true)
    await axe(page);await page.screenshot({path:`docs/interactive/screenshots/mascots-menu-${width}.png`});await page.keyboard.press('Escape')
    await button(page,'Quitter la séance').click();await page.locator('.ci-launch:enabled').waitFor()
    await button(page,'Compétition').click();await button(page,'Préparer un duel').click()
    await page.getByRole('heading',{name:'Préparer le duel',exact:true}).waitFor()
    const left=page.getByRole('region',{name:'Équipe 1',exact:true}),right=page.getByRole('region',{name:'Équipe 2',exact:true})
    assert.equal(await left.getByRole('group',{name:'Choisir ta mascotte'}).getByRole('button').count(),29)
    const previews=page.getByRole('region',{name:'Attaques des mascottes',exact:true})
    assert.equal(await page.locator('.ci-effect-options').count(),0)
    assert.equal(await page.getByRole('group',{name:'Animations d’attaque',exact:true}).count(),0)
    const motions=[]
    for(const mascot of MASCOTS){
      const attack=signatureFor(mascot.id)
      if(!await left.getByRole('button',{name:mascot.label,exact:true}).count()){const occupied=await left.getByRole('button',{pressed:true}).getAttribute('aria-label'),substitute=MASCOTS.find(avatar=>avatar.id!==mascot.id&&avatar.label!==occupied);await right.getByRole('button',{name:substitute.label,exact:true}).click()}
      await left.getByRole('button',{name:mascot.label,exact:true}).click()
      assert.equal(await previews.locator('[data-demo-side="left"] .ci-signature-name').innerText(),attack.normal)
      await previews.getByRole('button',{name:'Attaque du joueur 1',exact:true}).click()
      const impact=page.locator('.ci-vfx-canvas')
      assert.equal(await impact.getAttribute('data-effect'),mascot.id);assert.equal(await impact.getAttribute('data-direction'),'right')
      await previews.getByText('Atelier d’animation',{exact:true}).click()
      await previews.getByRole('slider',{name:'Instant de l’animation',exact:true}).evaluate(node=>{
        // Move away first: a running 50 ms clock can already show 350, which
        // correctly makes React ignore an unchanged native input value.
        for(const value of ['349','350']){Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(node,value);node.dispatchEvent(new Event('input',{bubbles:true}));node.dispatchEvent(new Event('change',{bubbles:true}))}
      })
      await page.waitForFunction(()=>document.querySelector('.ci-vfx-canvas')?.dataset.elapsed==='350')
      if(mascot.id==='leaf'){await page.waitForTimeout(150);assert.equal(await impact.getAttribute('data-elapsed'),'350')}
      await previews.locator('.ci-effect-demo').scrollIntoViewIfNeeded();await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))))
      const fingerprint=await impact.evaluate(async node=>{const data=node.getContext('2d').getImageData(0,0,node.width,node.height).data;if(!data.some((v,i)=>i%4===3&&v>0))throw new Error('Preview frame is outside viewport or empty');const bytes=new TextEncoder().encode(node.toDataURL());return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),x=>x.toString(16).padStart(2,'0')).join('')})
      motions.push({mascot:mascot.id,name:attack.normal,duration:attack.durations[0],fingerprint})
      await previews.getByRole('radio',{name:'Critique ×3',exact:true}).check()
      const angry=previews.locator('[data-demo-side="left"] .ci-mascot-angry');await angry.waitFor()
      assert.ok((await angry.evaluate(node=>getComputedStyle(node).backgroundImage)).includes('mascots-angry-'))
      const angryStyle=mascotStyle(mascot.id),position=await angry.evaluate(node=>[getComputedStyle(node).backgroundPositionX,getComputedStyle(node).backgroundPositionY]);assert.deepEqual(position,[angryStyle['--ci-angry-x'],angryStyle['--ci-angry-y']].map(value=>`${Number(parseFloat(value).toFixed(4))}%`))
      const reserved=await right.getByRole('button',{pressed:true}).getAttribute('aria-label'),replacement=MASCOTS.find(avatar=>avatar.id!==mascot.id&&avatar.label!==reserved)
      await left.getByRole('button',{name:replacement.label,exact:true}).click();await right.getByRole('button',{name:mascot.label,exact:true}).click()
      await previews.getByRole('button',{name:'Attaque du joueur 2',exact:true}).click()
      assert.equal(await impact.getAttribute('data-direction'),'left');assert.equal(await impact.getAttribute('data-attacker'),'right');assert.equal(await impact.getAttribute('data-effect'),mascot.id)
    }
    assert.equal(new Set(motions.map(motion=>motion.fingerprint)).size,30)
    await left.getByRole('button',{name:'Carpe koï',exact:true}).click();await right.getByRole('button',{name:'Kitsune',exact:true}).click()
    await previews.getByRole('radio',{name:'Critique ×2',exact:true}).check();await previews.getByRole('button',{name:'Attaque du joueur 2',exact:true}).click()
    assert.equal(await page.locator('.ci-vfx-canvas[data-multiplier="2"]').count(),1);await axe(page);await page.screenshot({path:`docs/interactive/screenshots/mascot-attacks-${width}.png`})
    await previews.getByRole('radio',{name:'Critique ×3',exact:true}).check();await previews.getByRole('button',{name:'Attaque du joueur 2',exact:true}).click()
    assert.equal(await page.locator('.ci-vfx-canvas[data-local]').count(),1);assert.equal(await page.locator('.ci-vfx-canvas').getAttribute('data-direction'),'local')
    await page.waitForTimeout(450);await page.screenshot({path:`docs/interactive/screenshots/mascot-super-critical-v2-${width}.png`})
    await page.getByRole('spinbutton',{name:'Temps de correction (secondes)',exact:true}).fill('1')
    await button(page,'Préparer la partie').click();await button(page,'Commencer le duel').waitFor()
    await page.evaluate(async()=>{
      const {createDuel,duelRound}=await import('/src/interactive/duel/core.ts')
      const key=Object.keys(sessionStorage).find(key=>key.startsWith('clairfle.duel.duel.')),record=JSON.parse(sessionStorage.getItem(key))
      const quiz={id:record.quizId,title:'Critical fixture',items:[{question:{id:'q',prompt:'?',images:[],choices:[{id:'yes',text:'Oui'},{id:'no',text:'Non'}]},correctChoiceId:'yes'}]}
      for(let seed=1;seed<=1000;seed++){
        const state=createDuel(quiz,{...record.config,seed},record.timer,record.createdAt)
        if(!duelRound(quiz,state).critical&&duelRound(quiz,{...state,turn:1}).multiplier===2&&duelRound(quiz,{...state,turn:2}).multiplier===2){record.config.seed=seed;sessionStorage.setItem(key,JSON.stringify(record));return}
      }
      throw new Error('Need one normal turn followed by two critical signature attacks.')
    })
    await button(page,'Quitter la compétition').click();await button(page,'Reprendre la partie').click();await button(page,'Commencer le duel').waitFor()
    await context.setOffline(true);await button(page,'Commencer le duel').click();await page.locator('.ci-duel-answer:enabled').first().waitFor()
    const portraits=await page.locator('.ci-duel-player .ci-mascot-sprite').evaluateAll(nodes=>nodes.map(node=>getComputedStyle(node).backgroundImage))
    assert.equal(portraits.length,2);assert.ok(portraits.every(src=>src.includes('blob:')))
    let old=await page.locator('.ci-duel-arena').getAttribute('data-duel-round')
    await answer(page,'left','5').click();const hit=page.locator('.ci-vfx-canvas'),pageEffect=await hit.getAttribute('data-effect')
    assert.equal(await hit.getAttribute('data-impact-kind'),'mistake');assert.equal(pageEffect,'koi');assert.equal(await hit.getAttribute('data-local'),'true');assert.equal(await hit.getAttribute('data-victim'),'left');assert.equal(await hit.getAttribute('data-attacker'),null)
    assert.equal(await page.locator('.ci-duel-flight').count(),0);assert.equal(await page.locator('.ci-critical-specials').count(),0)
    await page.waitForTimeout(200);await page.screenshot({path:`docs/interactive/screenshots/duel-automatic-error-${width}.png`})
    await next(page,old)
    old=await page.locator('.ci-duel-arena').getAttribute('data-duel-round')
    await answer(page,'left','4').click()
    await page.waitForFunction(()=>document.querySelector('.ci-duel-hp')?.textContent==='90'&&document.querySelectorAll('.ci-duel-hp')[1]?.textContent==='80');assert.equal(await hit.getAttribute('data-multiplier'),'2')
    assert.deepEqual((await page.locator('.ci-duel-hp').allTextContents()).map(text=>Number(text.replace(/\D/g,''))),[90,80])
    assert.equal(await hit.getAttribute('data-effect'),'koi');assert.equal(await hit.getAttribute('data-attacker'),'left');assert.equal(await hit.getAttribute('data-direction'),'right')
    await page.waitForTimeout(200);await page.screenshot({path:`docs/interactive/screenshots/duel-water-${width}.png`})
    await next(page,old)
    await answer(page,'right','4').click()
    await page.waitForFunction(()=>document.querySelector('.ci-duel-hp')?.textContent==='70');assert.equal(await hit.getAttribute('data-multiplier'),'2')
    assert.deepEqual((await page.locator('.ci-duel-hp').allTextContents()).map(text=>Number(text.replace(/\D/g,''))),[70,80])
    assert.equal(await hit.getAttribute('data-effect'),'kitsune');assert.equal(await hit.getAttribute('data-attacker'),'right');assert.equal(await hit.getAttribute('data-victim'),'left');assert.equal(await hit.getAttribute('data-direction'),'left')
    await page.waitForTimeout(200);await page.screenshot({path:`docs/interactive/screenshots/duel-fire-${width}.png`})
    await button(page,'Quitter la compétition').click();await context.setOffline(false);await button(page,'Reprendre la partie').click()
    await page.getByRole('heading',{name:'Duel en pause',exact:true}).waitFor()
    const saved=await page.evaluate(()=>JSON.parse(sessionStorage.getItem(Object.keys(sessionStorage).find(key=>key.startsWith('clairfle.duel.duel.')))))
    assert.equal(saved.config.effects,undefined);assert.deepEqual(saved.config.left,['koi']);assert.deepEqual(saved.config.right,['kitsune'])
    results.push({viewport:`${width}x${height}`,mascots:'30 shared animated mascots, with image-only selection retained',previews:'Each of the thirty chosen mascots automatically provides its own named attack and distinct intermediate motion; both directions reach the correct target; no attack selector or effect setting',attackMotions:motions.map(({mascot,name,duration})=>({mascot,name,duration})),duel:'Offline Koi sends a water jet from left to right on phones and desktop; Kitsune sends a fire tornado in the reverse direction; errors use only the mistaken player’s local signature',critical:'Distinct double and local triple choreography with themed materials, historical trails and duration-aware correction',resume:'Koi and Kitsune identities survive replay; the new journal has no configurable effects',axeViolations:0})
    await context.close()
  }
  assert.ok(methods.length&&methods.every(method=>method==='GET'));assert.deepEqual(errors,[])
  await writeFile('docs/interactive/mascots-effects-results.json',JSON.stringify({results,errors,serverWritesToFicheApi:0},null,2)+'\n');console.log(JSON.stringify(results,null,2))
}finally{await browser.close();await vite.close()}
