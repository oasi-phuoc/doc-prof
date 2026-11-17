import assert from 'node:assert/strict'
import {mkdir,writeFile} from 'node:fs/promises'
import {createServer} from 'vite'
import {chromium} from 'playwright'
import AxeBuilder from '@axe-core/playwright'

const base='http://127.0.0.1:5194',out='docs/interactive/duel-infinite-proofs'
process.env.VITE_FICHES_API_URL=base+'/__infinite_api'
const vite=await createServer({cacheDir:'/tmp/clairfle-infinite-browser',server:{host:'127.0.0.1',port:5194,strictPort:true,hmr:false}});await vite.listen()
const{demoRecipe}=await vite.ssrLoadModule('/src/interactive/demo.ts'),{defaultPage}=await vite.ssrLoadModule('/src/math/catalog.ts')
const saved={id:'infinite-duel',name:'Bonnes réponses',domains:['algèbre'],recipe:{...demoRecipe(),libreMode:true,pages:[{...defaultPage('algèbre'),count:1,columns:1,extraBlocks:undefined,libreItems:[{layout:'select',prompt:'2 + 2 = ?',options:['4','5','6','7','8','9'],answer:'4'}]}]},createdAt:'2026-11-17T00:00:00Z',updatedAt:'2026-11-17T00:00:00Z'}
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH??'/usr/bin/chromium',args:['--no-sandbox']}),results=[],errors=[],methods=[]
async function enter(page){await page.goto(base+'/interactif/'+saved.id);await page.locator('.ci-launch:enabled').waitFor({timeout:120000});await page.getByRole('button',{name:/^Compétition/}).click();await page.getByRole('button',{name:'Préparer un duel',exact:true}).click();await page.locator('.ci-duel-parameters select:enabled').waitFor()}
async function fit(page){const outputs=await page.locator('.ci-duel-clock output').evaluateAll(nodes=>nodes.map(n=>n.getBoundingClientRect().toJSON()));if(outputs.length===2)assert(outputs[0].right<=outputs[1].x||outputs[1].right<=outputs[0].x,'Timer and progress must not overlap.');assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);const size=page.viewportSize();for(const r of await page.locator('.ci-duel-answer:visible,.ci-duel-health-row:visible,.ci-duel-controls:visible').evaluateAll(nodes=>nodes.map(n=>n.getBoundingClientRect().toJSON())))assert(r.x>=-1&&r.y>=-1&&r.right<=size.width+1&&r.bottom<=size.height+1,JSON.stringify({r,size}))}
async function answer(page,side,correct=true){await page.locator(`.ci-duel-player[data-side="${side}"] .ci-duel-answer`).filter({has:page.locator('.ci-duel-answer-content').getByText(correct?'4':'5',{exact:true})}).click()}
async function scores(page,left,right){assert.deepEqual(await page.locator('.ci-duel-health-row small').allTextContents(),[`✓ ${left}`,`✓ ${right}`]);assert.deepEqual(await page.locator('.ci-duel-hp').allTextContents(),['∞','∞']);assert.equal(await page.locator('.ci-finisher-warning').count(),0)}
try{
 await mkdir(out,{recursive:true})
 for(const[width,height,limit]of[[844,390,10],[1366,768,15]]){
  const context=await browser.newContext({viewport:{width,height}});await context.addCookies([{name:'clairfle-fiche-access',value:'admin',url:base}]);await context.addInitScript(()=>localStorage.setItem('clairfle-fiche-sync','infinite-browser-fixture'))
  await context.route('**/__infinite_api/fiches',route=>{methods.push(route.request().method());return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({fiches:[saved]})})})
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(30000);await enter(page)
  const life=page.getByRole('combobox',{name:'Vie',exact:true});assert.deepEqual(await life.locator('option').evaluateAll(nodes=>nodes.map(n=>n.value)),['100','200','infinite'])
  await life.selectOption('200');await page.getByRole('combobox',{name:'Vie',exact:true}).selectOption('infinite')
  await page.getByRole('spinbutton',{name:'Nombre de questions par duel',exact:true}).fill(String(limit))
  await page.getByRole('checkbox',{name:'Activer le minuteur du duel'}).check();await page.getByRole('spinbutton',{name:'Temps par question (secondes)',exact:true}).fill('5');await page.getByRole('spinbutton',{name:'Temps de correction (secondes)',exact:true}).fill('3')
  for(const level of [2,3])await page.getByRole('spinbutton',{name:`Chance de critique ×${level} (%)`,exact:true}).fill('0')
  await page.getByRole('spinbutton',{name:'Chance de critique ×4 (%)',exact:true}).fill('100')
  const axe=(await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()).violations;assert.deepEqual(axe.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})),[])
  await page.screenshot({path:`${out}/settings-${width}.png`,fullPage:true})
  await page.getByRole('button',{name:'Préparer la partie',exact:true}).click();await page.getByRole('button',{name:'Commencer le duel',exact:true}).waitFor({timeout:120000})
  await page.clock.install();await page.clock.pauseAt(new Date((await page.evaluate(()=>Date.now()))+100));await context.setOffline(true)
  await page.getByRole('button',{name:'Commencer le duel',exact:true}).click();await page.locator('.ci-duel-answer:enabled').first().waitFor();await scores(page,0,0)
  let left=0,right=0
  for(let i=0;i<limit;i++){
   await page.getByLabel('Progression des questions',{exact:true}).filter({hasText:new RegExp(`^${i+1}/${limit}$`)}).waitFor()
   assert.equal(await page.getByLabel('Progression des questions',{exact:true}).innerText(),`${i+1}/${limit}`)
   if(i===3)await page.clock.runFor(5200)
   else {await answer(page,i===1?'right':'left',i!==2);if(i!==2){if(i===1)right++;else left++}}
   await page.locator('.ci-duel-feedback').waitFor();await scores(page,left,right)
   assert.equal(await page.locator('.ci-finisher-warning').count(),0)
   await page.clock.runFor(4100)
   if(i===0){await fit(page);await page.screenshot({path:`${out}/round-${width}.png`})}
   if(i===4){
    // Resume from the real journal, with scores and the exact question count.
    await page.getByRole('button',{name:'Pause',exact:true}).click();await context.setOffline(false);await page.clock.resume();await enter(page);assert.equal(await page.getByRole('combobox',{name:'Vie',exact:true}).inputValue(),'infinite');assert.equal(await page.getByRole('spinbutton',{name:'Nombre de questions par duel',exact:true}).inputValue(),String(limit))
    await page.getByRole('button',{name:'Reprendre la partie',exact:true}).click();await page.locator('.ci-duel-arena').waitFor({timeout:120000})
    await page.clock.pauseAt(new Date((await page.evaluate(()=>Date.now()))+100));await page.locator('.ci-duel-pause').getByRole('button',{name:'Reprendre le duel',exact:true}).click()
    await context.setOffline(true);await scores(page,left,right)
   }
  }
  await page.locator('.ci-duel-finished').waitFor();assert.match(await page.locator('.ci-duel-finished h1').innerText(),/remporte le duel/);assert.equal(await page.locator('.ci-duel-points-summary').innerText(),`Bonnes réponses : ${left} – ${right}`)
  await page.screenshot({path:`${out}/finished-${width}.png`});await page.clock.resume();results.push({viewport:`${width}x${height}`,questions:limit,left,right,checks:['Only 100, 200 and infinite offered','Critical ×4 awards one point and keeps life infinite','Wrong answer and timeout award zero','Counts and original rules survive real reload','Stops at configured count and ranks correct answers','Offline play after preparation'],axeViolations:0});await context.close()
 }
 // Existing intermediate health preferences migrate to a legal new-game choice.
 const context=await browser.newContext({viewport:{width:390,height:844}});await context.addCookies([{name:'clairfle-fiche-access',value:'admin',url:base}]);await context.addInitScript(()=>localStorage.setItem('clairfle-fiche-sync','migration-fixture'));await context.route('**/__infinite_api/fiches',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({fiches:[saved]})}));const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));await enter(page)
 await page.evaluate(async()=>{const{requestLocal}=await import('/src/interactive/storage.ts');await requestLocal('settings','readwrite',s=>s.put({id:'duel-parameters-v1',version:1,combat:{maxHp:150,critical2:25,critical3:10,critical4:5},timer:{enabled:false,seconds:15,feedbackSeconds:3}}))})
 await enter(page);assert.equal(await page.getByRole('combobox',{name:'Vie',exact:true}).inputValue(),'200');assert.equal(await page.getByRole('spinbutton',{name:'Temps par question (secondes)',exact:true}).inputValue(),'15')
 await page.getByRole('combobox',{name:'Vie',exact:true}).selectOption('100');assert.equal(await page.getByRole('spinbutton',{name:'Nombre de questions par duel',exact:true}).count(),0)
 await page.screenshot({path:`${out}/choices-390.png`,fullPage:true});await context.close();results.push({migration:'Legacy 150 HP maps to 200 for new games, then 100 is selectable; timer kept.'})
 assert.deepEqual(errors,[]);assert(methods.every(method=>method==='GET'))
 await writeFile('docs/interactive/duel-infinite-results.json',JSON.stringify({passed:true,results,pageErrors:errors,worksheetMethods:methods},null,2)+'\n');console.log(JSON.stringify(results,null,2))
}catch(error){for(const page of browser.contexts().flatMap(c=>c.pages())){await page.screenshot({path:'/tmp/infinite-error.png',fullPage:true}).catch(()=>{});await writeFile('/tmp/infinite-error.txt',await page.locator('body').innerText()).catch(()=>{})}throw error}finally{await browser.close();await vite.close()}
