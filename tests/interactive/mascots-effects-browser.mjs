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
const {ATTACK_EFFECTS,MISTAKE_EFFECTS}=await vite.ssrLoadModule('/src/interactive/duel/effects.ts')
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
    await left.getByRole('button',{name:'Esprit feuille',exact:true}).click();await right.getByRole('button',{name:'Kitsune',exact:true}).click()
    const effects=page.getByRole('region',{name:'Animations du duel',exact:true})
    const motions=[]
    for(const [index,effect]of ATTACK_EFFECTS.entries()){
      await effects.getByRole('group',{name:'Animations d’attaque',exact:true}).getByRole('button',{name:`${index+1}. ${effect.label}`,exact:true}).click()
      const impact=page.locator('.ci-duel-impact')
      assert.equal(await impact.getAttribute('data-effect'),effect.id);assert.equal(await impact.getAttribute('data-direction'),'right');assert.equal(await page.locator('.ci-duel-flight').count(),1)
      const motion=await page.locator('.ci-duel-flight').evaluate(node=>{
        const animation=node.getAnimations()[0],duration=Number(animation.effect.getTiming().duration)
        animation.pause();animation.currentTime=duration*.5
        const middle=getComputedStyle(node).transform,name=getComputedStyle(node).animationName
        animation.currentTime=duration
        const end=new DOMMatrix(getComputedStyle(node).transform),style=getComputedStyle(node)
        return {name,middle,endX:end.m41,endY:end.m42,dx:parseFloat(style.getPropertyValue('--ci-dx')),dy:parseFloat(style.getPropertyValue('--ci-dy'))}
      })
      assert.equal(motion.name,`ci-attack-${effect.id}`);assert.ok(Math.abs(motion.endX-motion.dx)<.01&&Math.abs(motion.endY-motion.dy)<.01)
      motions.push(motion)
      await effects.getByRole('button',{name:'Attaque du joueur 2',exact:true}).click()
      assert.equal(await impact.getAttribute('data-direction'),'left');assert.equal(await impact.getAttribute('data-attacker'),'right')
    }
    assert.equal(new Set(motions.map(motion=>motion.name)).size,10)
    assert.equal(new Set(motions.map(motion=>motion.middle)).size,10)
    await effects.screenshot({path:`docs/interactive/screenshots/attack-choices-${width}.png`})
    await effects.getByRole('checkbox',{name:'Prévisualiser un critique',exact:true}).check();await effects.getByRole('button',{name:'Attaque du joueur 1',exact:true}).click()
    assert.equal(await page.locator('.ci-duel-flight').count(),2)
    assert.ok((await page.locator('.ci-duel-flight').evaluateAll(nodes=>nodes.map(node=>getComputedStyle(node).animationName))).every(name=>name==='ci-attack-shockwave'))
    assert.equal(await page.locator('.ci-duel-hit-burst').count(),2)
    await effects.getByRole('group',{name:'Animations d’attaque',exact:true}).getByRole('button',{name:'4. Feuilles',exact:true}).click()
    await effects.getByRole('button',{name:'Erreurs',exact:true}).click();await effects.getByRole('checkbox',{name:'Prévisualiser un critique',exact:true}).uncheck()
    for(const [index,effect]of MISTAKE_EFFECTS.entries()){
      await effects.getByRole('group',{name:'Animations d’erreur',exact:true}).getByRole('button',{name:`${index+1}. ${effect.label}`,exact:true}).click()
      const impact=page.locator('.ci-duel-impact')
      assert.equal(await impact.getAttribute('data-effect'),effect.id);assert.equal(await impact.getAttribute('data-impact-kind'),'mistake');assert.equal(await impact.getAttribute('data-attacker'),null)
      assert.equal(await page.locator('.ci-duel-flight').count(),0);assert.equal(await page.locator('.ci-mistake-object').count(),3)
      await effects.getByRole('button',{name:'Erreur du joueur 2',exact:true}).click();assert.equal(await impact.getAttribute('data-victim'),'right')
    }
    await effects.getByRole('group',{name:'Animations d’erreur',exact:true}).getByRole('button',{name:'2. Seau d’eau',exact:true}).click()
    await effects.getByRole('checkbox',{name:'Prévisualiser un critique',exact:true}).check();await effects.getByRole('button',{name:'Erreur du joueur 1',exact:true}).click()
    assert.equal(await page.locator('.ci-mistake-object').count(),6);await axe(page)
    await effects.screenshot({path:`docs/interactive/screenshots/effects-choices-${width}.png`})
    await page.getByRole('spinbutton',{name:'Temps de correction (secondes)',exact:true}).fill('1')
    await button(page,'Préparer la partie').click();await button(page,'Commencer le duel').waitFor()
    await context.setOffline(true);await button(page,'Commencer le duel').click();await page.locator('.ci-duel-answer:enabled').first().waitFor()
    const portraits=await page.locator('.ci-duel-player .ci-mascot-sprite').evaluateAll(nodes=>nodes.map(node=>getComputedStyle(node).backgroundImage))
    assert.equal(portraits.length,2);assert.ok(portraits.every(src=>src.includes('blob:')))
    const old=await page.locator('.ci-duel-arena').getAttribute('data-duel-round')
    await answer(page,'left','5').click();const hit=page.locator('.ci-duel-impact')
    assert.equal(await hit.getAttribute('data-impact-kind'),'mistake');assert.equal(await hit.getAttribute('data-effect'),'bucket');assert.equal(await hit.getAttribute('data-victim'),'left');assert.equal(await hit.getAttribute('data-attacker'),null)
    assert.equal(await page.locator('.ci-duel-flight').count(),0)
    await page.waitForTimeout(200);await page.screenshot({path:`docs/interactive/screenshots/duel-falling-bucket-${width}.png`})
    await next(page,old)
    await answer(page,'right','4').click()
    assert.equal(await hit.getAttribute('data-effect'),'leaves');assert.equal(await hit.getAttribute('data-attacker'),'right');assert.equal(await hit.getAttribute('data-victim'),'left');assert.equal(await hit.getAttribute('data-direction'),width<=700?'up':'left')
    await page.waitForTimeout(200);await page.screenshot({path:`docs/interactive/screenshots/duel-direction-${width}.png`})
    await button(page,'Quitter la compétition').click();await context.setOffline(false);await button(page,'Reprendre la partie').click()
    await page.getByRole('heading',{name:'Duel en pause',exact:true}).waitFor()
    const saved=await page.evaluate(()=>JSON.parse(sessionStorage.getItem(Object.keys(sessionStorage).find(key=>key.startsWith('clairfle.duel.duel.')))))
    assert.deepEqual(saved.config.effects,{attack:'leaves',mistake:'bucket'});assert.deepEqual(saved.config.left,['leaf']);assert.deepEqual(saved.config.right,['kitsune'])
    results.push({viewport:`${width}x${height}`,mascots:'30 image-only choices, each selectable and animated in Class; same 30 in each competition picker; legacy six and new atlas rows verified',previews:'all ten attacks have distinct motion curves and measured intermediate transforms, reach their target and work in both directions; all ten falling-object errors tested on both players; critical doubles attacks and impact flashes or falling objects',attackMotions:motions.map(motion=>motion.name),duel:'offline leaf versus Kitsune uses prepared shared sprite sheets; wrong answer triggers a bucket drop on oneself, correct answer flies from right player to left, upward on portrait phones',resume:'chosen effects and both mascot identities survive the paused journal replay',axeViolations:0})
    await context.close()
  }
  assert.ok(methods.length&&methods.every(method=>method==='GET'));assert.deepEqual(errors,[])
  await writeFile('docs/interactive/mascots-effects-results.json',JSON.stringify({results,errors,serverWritesToFicheApi:0},null,2)+'\n');console.log(JSON.stringify(results,null,2))
}finally{await browser.close();await vite.close()}
