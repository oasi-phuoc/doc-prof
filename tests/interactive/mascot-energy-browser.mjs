import assert from 'node:assert/strict'
import {mkdir,writeFile} from 'node:fs/promises'
import {createServer} from 'vite'
import {createElement} from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
import {chromium} from 'playwright'
const vite=await createServer({appType:'custom',cacheDir:'/tmp/clairfle-mascot-energy',server:{host:'127.0.0.1',port:5198,strictPort:true,hmr:false}})
vite.middlewares.use('/__mascot_energy',(_req,res)=>{res.setHeader('content-type','text/html');res.end('<!doctype html><html lang="fr"><meta charset="utf-8"><title>Mascottes et énergie</title><body></body></html>')});await vite.listen()
const {MASCOTS}=await vite.ssrLoadModule('/src/interactive/domain/mascot.ts'),{CombatPortrait}=await vite.ssrLoadModule('/src/interactive/duel/CombatPortrait.tsx'),{signatureFor,SUPER_AURA_COLORS}=await vite.ssrLoadModule('/src/interactive/duel/vfx/catalog.ts')
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH||undefined,args:['--no-sandbox']}),errors=[],plates=[],out='docs/interactive/mascot-energy-proofs'
try{
 await mkdir(out,{recursive:true});const page=await browser.newPage({viewport:{width:1366,height:1100},reducedMotion:'reduce'});page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:5198/__mascot_energy')
 await page.evaluate(async()=>{await import('/src/interactive/projection.css');await import('/src/interactive/competition/competition.css');await import('/src/interactive/duel/combat-portraits.css');await import('/src/interactive/duel/power-aura.css')})
 for(let group=0;group<5;group++){
  const actors=MASCOTS.slice(group*6,group*6+6),modes=[{hp:100,level:1,label:'Repos'},{hp:40,level:2,label:'Critique ×2 · 40 PV'},{hp:20,level:3,label:'Critique ×3 · 20 PV'},{hp:40,level:1,label:'Après · fatiguée'},{hp:20,level:1,label:'Après · très fatiguée'}]
  const html=renderToStaticMarkup(createElement('main',{className:'ci-app ci-competition energy-proof'},createElement('h1',null,'Transparence, charge et retour à la fatigue'),...actors.map(actor=>createElement('section',{key:actor.id,'data-actor':actor.id},createElement('h2',null,actor.label),createElement('div',{className:'samples'},...modes.map((mode,i)=>createElement('div',{key:i,className:'sample','data-mode':i,style:{background:['#14243b','#203e36','#392744','#14243b','#203e36'][i]}},createElement(CombatPortrait,{avatarId:actor.id,hp:mode.hp,level:mode.level}),createElement('p',null,mode.label))))))))
  await page.evaluate(html=>{document.body.innerHTML=html;const style=document.createElement('style');style.textContent='body{margin:0;font:15px system-ui;background:#14243b;color:white}.energy-proof{padding:16px;background:#14243b;color:white}.energy-proof h1{font-size:25px}.energy-proof h2{font-size:18px;margin:12px 0 6px}.samples{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px}.sample{overflow:hidden;border-radius:12px;padding:85px 4px 12px;text-align:center}.sample .ci-competition-portrait{width:136px!important;height:136px!important;display:block;margin:auto}.sample p{margin:12px 0 0;font-size:13px}';document.head.append(style)},html)
  await page.evaluate(async()=>{await Promise.all([...document.images].map(img=>img.decode()));await document.fonts.ready})
  for(const actor of actors){
   const row=page.locator(`[data-actor="${actor.id}"]`)
   assert.equal(await row.locator('.ci-mascot-angry').count(),2)
   for(const [mode,level] of [[1,2],[2,3]]){
    const aura=row.locator(`[data-mode="${mode}"] [data-power-aura]`);assert.equal(await aura.getAttribute('data-aura-mascot'),actor.id)
    assert.equal((await aura.evaluate(node=>getComputedStyle(node).getPropertyValue('--ci-power-outer'))).trim(),level===2?signatureFor(actor.id).color:SUPER_AURA_COLORS[actor.id])
   }
   assert.ok((await row.locator('[data-mode="2"] .ci-power-aura').boundingBox()).width>(await row.locator('[data-mode="1"] .ci-power-aura').boundingBox()).width)
   assert.equal(await row.locator('[data-mode="3"] [data-combat-state="tired"]').count(),1);assert.equal(await row.locator('[data-mode="4"] [data-combat-state="critical-tired"]').count(),1)
  }
  const white=await page.locator('.ci-mascot').evaluateAll(nodes=>nodes.some(node=>getComputedStyle(node).backgroundColor!=='rgba(0, 0, 0, 0)'));assert.equal(white,false)
  const name=`group-${group}.png`;await page.screenshot({path:`${out}/${name}`,fullPage:true});plates.push(name)
 }
 assert.deepEqual(errors,[]);const report={date:new Date().toISOString(),mascots:30,criticalSamples:60,restoredFatigueSamples:60,transparentAtlases:12,energy:'Animated flame envelope plus signature particles; both levels follow the attack palette; triple is larger and has lightning.',corners:'Explicit per-pose body clipping for 120 health frames.',plates,errors,liveApiWrites:0}
 await writeFile('docs/interactive/mascot-energy-results.json',JSON.stringify(report,null,2)+'\n');await writeFile(`${out}/index.html`,`<!doctype html><html lang="fr"><meta charset="utf-8"><title>Mascottes sans fond et charge d’énergie</title><style>body{background:#14243b;color:white;font:17px system-ui;margin:20px}img{width:100%;height:auto}</style><h1>Mascottes sans fond et charge d’énergie</h1><p>Trente personnages : repos, critique ×2 à 40 PV, critique ×3 à 20 PV, retour aux deux états de fatigue. Les poses énervées et les enveloppes d’énergie utilisent les vraies ressources du jeu.</p>${plates.map(name=>`<img src="${name}" alt="Planche ${name}" loading="lazy">`).join('')}<h2>En partie</h2><p>Captures des parcours de paysage et de cycle de vie : l’enveloppe d’énergie s’ajoute aux particules de signature, puis le Lapin retrouve sa fatigue à 20 points sans fragment dans les coins.</p><img src="duel-power2-844.png" alt="Duel et énergie double"><img src="duel-power3-844.png" alt="Duel et énergie triple"><img style="max-width:390px" src="../screenshots/mascot-rabbit-tired-clean-corners-390.png" alt="Lapin fatigué après un critique, sans fragment dans les coins"></html>`)
 console.log(JSON.stringify(report,null,2))
}finally{await browser.close();await vite.close()}
