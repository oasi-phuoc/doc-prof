import assert from 'node:assert/strict'
import {mkdir,writeFile} from 'node:fs/promises'
import {createServer} from 'vite'
import {chromium} from 'playwright'
import AxeBuilder from '@axe-core/playwright'

const base='http://127.0.0.1:5182'
process.env.VITE_FICHES_API_URL=base+'/__test_api'
const vite=await createServer({cacheDir:'/tmp/clairfle-mascots-effects',server:{host:'127.0.0.1',port:5182,strictPort:true}})
await vite.listen()
const {demoRecipe}=await vite.ssrLoadModule('/src/interactive/demo.ts')
const {MASCOTS,mascotStyle}=await vite.ssrLoadModule('/src/interactive/domain/mascot.ts')
const {MISTAKE_EFFECTS}=await vite.ssrLoadModule('/src/interactive/duel/effects.ts')
const {signatureAttack,attackSequence}=await vite.ssrLoadModule('/src/interactive/duel/signature-attacks.ts')
const recipe={...demoRecipe(),pages:[{...demoRecipe().pages[0],count:1,libreItems:[{layout:'select',prompt:'2 + 2 = ?',options:['4','5','6','7','8','9'],answer:'4'}]}]}
const saved={id:'mascot-effects',name:'Mascottes et animations',recipe,domains:['algèbre'],createdAt:'2026-11-13T00:00:00Z',updatedAt:'2026-11-13T00:00:00Z'}
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH||undefined,args:['--no-sandbox']})
const button=(page,name)=>page.getByRole('button',{name,exact:true}),results=[],errors=[],methods=[]
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
    assert.equal(await left.getByRole('group',{name:'Choisir ta mascotte'}).getByRole('button').count(),30)
    const previews=page.getByRole('region',{name:'Attaques des mascottes',exact:true})
    assert.equal(await page.locator('.ci-effect-options').count(),0)
    assert.equal(await page.getByRole('group',{name:'Animations d’attaque',exact:true}).count(),0)
    const motions=[]
    for(const mascot of MASCOTS){
      const attack=signatureAttack(mascot.id)
      await left.getByRole('button',{name:mascot.label,exact:true}).click()
      assert.equal(await previews.locator('[data-demo-side="left"] .ci-signature-name').innerText(),attack.label)
      await previews.getByRole('button',{name:'Attaque du joueur 1',exact:true}).click()
      const impact=page.locator('.ci-duel-impact')
      assert.equal(await impact.getAttribute('data-effect'),mascot.id);assert.equal(await impact.getAttribute('data-direction'),'right')
      assert.equal(await page.locator('.ci-duel-flight').count(),1)
      assert.equal(await page.locator('.ci-duel-flight').getAttribute('data-attack-mascot'),mascot.id)
      const motion=await page.locator('.ci-duel-flight').evaluate(node=>{
        const animation=node.getAnimations()[0],duration=Number(animation.effect.getTiming().duration)
        animation.pause();animation.currentTime=duration*.5
        const middle=getComputedStyle(node).transform,name=getComputedStyle(node).animationName
        animation.currentTime=duration
        const end=new DOMMatrix(getComputedStyle(node).transform),style=getComputedStyle(node)
        return {name,middle,duration,endX:end.m41,endY:end.m42,dx:parseFloat(style.getPropertyValue('--ci-dx')),dy:parseFloat(style.getPropertyValue('--ci-dy'))}
      })
      assert.equal(motion.name,`ci-attack-${attack.motion}`);assert.equal(motion.duration,attack.duration)
      assert.ok(Math.abs(motion.endX-motion.dx)<.01&&Math.abs(motion.endY-motion.dy)<.01)
      motions.push({...motion,mascot:mascot.id})
      await right.getByRole('button',{name:mascot.label,exact:true}).click()
      await previews.getByRole('button',{name:'Attaque du joueur 2',exact:true}).click()
      assert.equal(await impact.getAttribute('data-direction'),'left');assert.equal(await impact.getAttribute('data-attacker'),'right')
      assert.equal(await impact.getAttribute('data-effect'),mascot.id)
    }
    assert.equal(new Set(motions.map(motion=>motion.middle)).size,30)
    await left.getByRole('button',{name:'Carpe koï',exact:true}).click();await right.getByRole('button',{name:'Kitsune',exact:true}).click()
    assert.deepEqual(await previews.locator('.ci-signature-name').allTextContents(),['Jet d’eau','Tourbillon de flammes'])
    await previews.getByRole('checkbox',{name:'Prévisualiser un critique',exact:true}).check();await previews.getByRole('button',{name:'Attaque du joueur 2',exact:true}).click()
    assert.equal(await page.locator('.ci-duel-flight').count(),5);assert.equal(await page.locator('.ci-duel-hit-burst').count(),5)
    assert.equal(await page.locator('.ci-critical-spark').count(),20);assert.equal(await page.locator('.ci-critical-aura').count(),2)
    assert.ok((await page.locator('.ci-duel-flight svg').first().evaluate(node=>getComputedStyle(node).filter)).includes('drop-shadow'))
    assert.ok((await page.locator('.ci-critical-spark').evaluateAll(nodes=>nodes.map(node=>getComputedStyle(node).animationName))).every(name=>name==='ci-critical-spark'))
    const critical=await page.locator('.ci-duel-flight').evaluateAll(nodes=>nodes.map(node=>({duration:parseFloat(getComputedStyle(node).animationDuration)*1000,delay:parseFloat(getComputedStyle(node).animationDelay)*1000})))
    assert.ok(critical.every(motion=>motion.duration+motion.delay<=1000))
    assert.notEqual(await page.locator('.ci-signature-fire').first().evaluate(node=>getComputedStyle(node).animationName),'none')
    assert.notEqual(await page.locator('.ci-signature-water').first().evaluate(node=>getComputedStyle(node).animationName),'none')
    await previews.getByRole('button',{name:'Attaque du joueur 1',exact:true}).click()
    assert.equal(await page.locator('.ci-duel-flight').count(),attackSequence('koi',true).length)
    await axe(page);await previews.screenshot({path:`docs/interactive/screenshots/mascot-attacks-${width}.png`})
    await page.getByRole('spinbutton',{name:'Temps de correction (secondes)',exact:true}).fill('1')
    await button(page,'Préparer la partie').click();await button(page,'Commencer le duel').waitFor()
    await page.evaluate(async()=>{
      const {createDuel,duelRound}=await import('/src/interactive/duel/core.ts')
      const key=Object.keys(sessionStorage).find(key=>key.startsWith('clairfle.duel.duel.')),record=JSON.parse(sessionStorage.getItem(key))
      const quiz={id:record.quizId,title:'Critical fixture',items:[{question:{id:'q',prompt:'?',images:[],choices:[{id:'yes',text:'Oui'},{id:'no',text:'Non'}]},correctChoiceId:'yes'}]}
      for(let seed=1;seed<=1000;seed++){
        const state=createDuel(quiz,{...record.config,seed},record.timer,record.createdAt)
        if(!duelRound(quiz,state).critical&&duelRound(quiz,{...state,turn:1}).critical&&duelRound(quiz,{...state,turn:2}).critical){record.config.seed=seed;sessionStorage.setItem(key,JSON.stringify(record));return}
      }
      throw new Error('Need one normal turn followed by two critical signature attacks.')
    })
    await button(page,'Quitter la compétition').click();await button(page,'Reprendre la partie').click();await button(page,'Commencer le duel').waitFor()
    await context.setOffline(true);await button(page,'Commencer le duel').click();await page.locator('.ci-duel-answer:enabled').first().waitFor()
    const portraits=await page.locator('.ci-duel-player .ci-mascot-sprite').evaluateAll(nodes=>nodes.map(node=>getComputedStyle(node).backgroundImage))
    assert.equal(portraits.length,2);assert.ok(portraits.every(src=>src.includes('blob:')))
    let old=await page.locator('.ci-duel-arena').getAttribute('data-duel-round')
    await answer(page,'left','5').click();const hit=page.locator('.ci-duel-impact'),pageEffect=await hit.getAttribute('data-effect')
    assert.equal(await hit.getAttribute('data-impact-kind'),'mistake');assert.ok(MISTAKE_EFFECTS.some(effect=>effect.id===pageEffect));assert.equal(await hit.getAttribute('data-victim'),'left');assert.equal(await hit.getAttribute('data-attacker'),null)
    assert.equal(await page.locator('.ci-duel-flight').count(),0);assert.equal(await page.locator('.ci-critical-specials').count(),0)
    await page.waitForTimeout(200);await page.screenshot({path:`docs/interactive/screenshots/duel-automatic-error-${width}.png`})
    await next(page,old)
    old=await page.locator('.ci-duel-arena').getAttribute('data-duel-round')
    await answer(page,'left','4').click()
    assert.equal(await page.locator('.ci-duel-flight').count(),4);assert.equal(await page.locator('.ci-critical-spark').count(),20)
    assert.deepEqual((await page.locator('.ci-duel-hp').allTextContents()).map(text=>Number(text.replace(/\D/g,''))),[90,80])
    assert.equal(await hit.getAttribute('data-effect'),'koi');assert.equal(await hit.getAttribute('data-attacker'),'left');assert.equal(await hit.getAttribute('data-direction'),width<=700?'down':'right')
    await page.waitForTimeout(200);await page.screenshot({path:`docs/interactive/screenshots/duel-water-${width}.png`})
    await next(page,old)
    await answer(page,'right','4').click()
    assert.equal(await page.locator('.ci-duel-flight').count(),5);assert.equal(await page.locator('.ci-critical-spark').count(),20)
    assert.deepEqual((await page.locator('.ci-duel-hp').allTextContents()).map(text=>Number(text.replace(/\D/g,''))),[70,80])
    assert.equal(await hit.getAttribute('data-effect'),'kitsune');assert.equal(await hit.getAttribute('data-attacker'),'right');assert.equal(await hit.getAttribute('data-victim'),'left');assert.equal(await hit.getAttribute('data-direction'),width<=700?'up':'left')
    await page.waitForTimeout(200);await page.screenshot({path:`docs/interactive/screenshots/duel-fire-${width}.png`})
    await button(page,'Quitter la compétition').click();await context.setOffline(false);await button(page,'Reprendre la partie').click()
    await page.getByRole('heading',{name:'Duel en pause',exact:true}).waitFor()
    const saved=await page.evaluate(()=>JSON.parse(sessionStorage.getItem(Object.keys(sessionStorage).find(key=>key.startsWith('clairfle.duel.duel.')))))
    assert.equal(saved.config.effects,undefined);assert.deepEqual(saved.config.left,['koi']);assert.deepEqual(saved.config.right,['kitsune'])
    results.push({viewport:`${width}x${height}`,mascots:'30 shared animated mascots, with image-only selection retained',previews:'Each of the thirty chosen mascots automatically provides its own named attack and distinct intermediate motion; both directions reach the correct target; no attack selector or effect setting',attackMotions:motions.map(({mascot,name,duration})=>({mascot,name,duration})),duel:'Offline Koi sends a water jet from left to right (down on portrait phones); Kitsune sends a fire tornado in the reverse direction; errors drop automatically selected objects only on the mistaken player',critical:'Mascot-specific three-to-five-hit sequence, glowing attack, two auras and twenty themed sparkles; all finish inside the minimum one-second correction',resume:'Koi and Kitsune identities survive replay; the new journal has no configurable effects',axeViolations:0})
    await context.close()
  }
  assert.ok(methods.length&&methods.every(method=>method==='GET'));assert.deepEqual(errors,[])
  await writeFile('docs/interactive/mascots-effects-results.json',JSON.stringify({results,errors,serverWritesToFicheApi:0},null,2)+'\n');console.log(JSON.stringify(results,null,2))
}finally{await browser.close();await vite.close()}
