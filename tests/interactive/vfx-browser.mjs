import assert from 'node:assert/strict'
import {mkdir,writeFile} from 'node:fs/promises'
import {createServer} from 'vite'
import {chromium} from 'playwright'
const vite=await createServer({appType:'custom',cacheDir:'/tmp/clairfle-vfx-browser',server:{host:'127.0.0.1',port:5196,strictPort:true}})
vite.middlewares.use('/__vfx_lab',(_req,res)=>{res.setHeader('content-type','text/html');res.end('<!doctype html><html lang="fr"><meta charset="utf-8"><title>Atelier des attaques</title><body></body></html>')})
await vite.listen()
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH||undefined,args:['--no-sandbox']}),errors=[],out='docs/interactive/vfx-proofs'
try{
 await mkdir(out,{recursive:true});const page=await browser.newPage({viewport:{width:1366,height:1200}});page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:5196/__vfx_lab');await page.evaluate(async()=>{window.lab=await import('/src/interactive/duel/vfx/lab.ts')})
 const plates=[]
 for(let group=0;group<5;group++){
  for(const level of [1,2,3]){await page.evaluate(({group,level})=>window.lab.gallery(group,level),{group,level});const name=`attacks-${group}-${level}.png`;await page.screenshot({path:`${out}/${name}`,fullPage:true});plates.push(name)}
  for(const level of [2,3]){await page.evaluate(({group,level})=>window.lab.gallery(group,level,true),{group,level});const name=`auras-${group}-${level}.png`;await page.screenshot({path:`${out}/${name}`,fullPage:true});plates.push(name)}
  await page.evaluate(group=>window.lab.poses(group),group);const name=`portraits-${group}.png`;await page.screenshot({path:`${out}/${name}`,fullPage:true});plates.push(name)
 }
 const benchmarks=[]
 for(const [width,height] of [[1366,768],[390,844],[360,640],[844,390]]){const bench=await browser.newPage({viewport:{width,height},deviceScaleFactor:width<900?3:1});await bench.goto('http://127.0.0.1:5196/__vfx_lab');await bench.evaluate(async()=>{window.lab=await import('/src/interactive/duel/vfx/lab.ts')});const result=await bench.evaluate(({width,height})=>window.lab.benchmark(width,height),{width,height});assert.ok(result.drawP95<33&&result.dpr<=2,JSON.stringify(result));benchmarks.push(result);await bench.close()}
 await page.setViewportSize({width:1200,height:700})
 const films=[];for(const id of ['goat','axolotl','kitsune','koi']){const data=await page.evaluate(id=>window.lab.film(id),id);await writeFile(`${out}/${id}.webm`,Buffer.from(data.split(',')[1],'base64'));films.push(`${id}.webm`)}
 assert.deepEqual(errors,[])
 const report={date:'2026-11-15',attacks:90,attackTimestamps:[0,.2,.5,.8,.95],auras:60,auraTimestampsMs:[1000,25000,61000,97000,115000],physicalDrawings:120,plates,films,benchmarks,errors,physicalHardwareTested:false}
 await writeFile('docs/interactive/vfx-gallery-results.json',JSON.stringify(report,null,2)+'\n')
 await writeFile(`${out}/index.html`,`<!doctype html><html lang="fr"><meta charset="utf-8"><title>Revue des effets de duel</title><style>body{font:17px system-ui;max-width:1400px;margin:24px auto;background:#14243b;color:white}img,video{width:100%;height:auto}details{margin:24px 0}a{color:#b5dcff}</style><h1>Revue des effets de duel</h1><p>90 compositions, cinq instants chacune ; 60 auras persistantes ; 120 dessins physiques. Les films utilisent le même moteur Canvas2D que le jeu. Les performances mesurées concernent Chromium de test, pas un appareil physique.</p>${films.map(name=>`<h2>${name}</h2><video src="${name}" controls loop></video>`).join('')}${plates.map(name=>`<details><summary>${name}</summary><img src="${name}" loading="lazy" alt="Planche ${name}"></details>`).join('')}</html>`)
 console.log(JSON.stringify(report,null,2))
}finally{await browser.close();await vite.close()}
