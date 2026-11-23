import assert from 'node:assert/strict'
import {createHash} from 'node:crypto'
import {mkdir,readFile,writeFile} from 'node:fs/promises'
import {createServer} from 'vite'
import {chromium} from 'playwright'
const base='http://127.0.0.1:5182',evidence='docs/tcm-csc/consignes-score-grilles-20261123-proofs'
const server=await createServer({cacheDir:'/tmp/clairfle-csc-consignes',server:{host:'127.0.0.1',port:5182,strictPort:true}});await server.listen()
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']}),errors=[],results=[]
const button=(page,name)=>page.getByRole('button',{name,exact:true})
const preview=page=>page.locator('.sheet-stage:not(.print-only-sheets) .worksheet-sheet:visible').first()
function zipEntries(buffer) {
  const entries = []; let offset = 0
  while (buffer.readUInt32LE(offset) === 0x04034b50) {
    assert.equal(buffer.readUInt16LE(offset + 8), 0)
    const length = buffer.readUInt32LE(offset + 18), nameLength = buffer.readUInt16LE(offset + 26), extra = buffer.readUInt16LE(offset + 28)
    const name = buffer.toString('utf8', offset + 30, offset + 30 + nameLength), start = offset + 30 + nameLength + extra
    entries.push({ name, data: buffer.subarray(start, start + length) }); offset = start + length
  }
  return entries
}
async function checkPlayers(page, type, label, multipart) {
  const block=preview(page).locator(`[data-exercise-type="${type}"]`)
  const players=block.locator('.math-exercise-audios audio[aria-label^="Nombre"], .math-exercise-audios audio[aria-label^="Calcul"]')
  assert.equal(await players.count(),5)
  assert.equal(await block.locator('.exercise-heading-audio').count(),0)
  for(let index=0;index<5;index++) {
    const player=players.nth(index)
    const lettered=/^tcm-(?:csc-ex0[12]|cfr-ex0[12])$/.test(type)
    assert.equal(await player.getAttribute('aria-label'),`${label} ${lettered?String.fromCharCode(65+index):index+1}`)
    const parts=JSON.parse(await player.getAttribute('data-audio-parts'))
    assert.ok(parts.every(src=>!src.includes('silence')))
    if(lettered) assert.match(parts[0], new RegExp(`/lettre-${String.fromCharCode(97+index)}\\.mp3$`))
    if(multipart) { assert.equal(parts.length, lettered?4:3); assert.match(parts[lettered?2:1], /\/(?:plus|moins|fois)\.mp3$/) }
    else assert.equal(parts.length, lettered?2:1)
    await player.scrollIntoViewIfNeeded()
    if(parts.length>1) await player.evaluate(node=>new Promise((resolve,reject)=>{const check=()=>{if(node.readyState>=1&&node.src.startsWith('blob:'))resolve();else setTimeout(check,100)};setTimeout(()=>reject(new Error('Composed audio not ready')),30000);check()}))
  }
  await players.first().evaluate(async node=>{await node.play()})
  await page.waitForFunction(type=>{const audio=document.querySelector(`.sheet-stage:not(.print-only-sheets) [data-exercise-type="${type}"] audio[aria-label^="Nombre"],.sheet-stage:not(.print-only-sheets) [data-exercise-type="${type}"] audio[aria-label^="Calcul"]`);return audio?.currentTime>0.1},type)
  await players.first().evaluate(node=>node.pause())
}
async function checkFullPlayer(page,type) {
  const full=preview(page).locator(`[data-exercise-type="${type}"] audio[data-audio-sequence]`)
  assert.equal(await full.count(),1);await full.scrollIntoViewIfNeeded()
  await full.evaluate(node=>new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('Full listening audio not ready')),60000);const check=()=>{if(node.readyState>=1&&node.currentSrc.startsWith('blob:')){clearTimeout(timer);resolve()}else setTimeout(check,100)};check()}))
  const plan=JSON.parse(await full.getAttribute('data-audio-sequence')),clips=plan.filter(s=>s.kind==='clip').map(s=>s.src)
  assert.equal(clips.filter(s=>s.includes('/consigne-')).length,1);assert.equal(clips.filter(s=>s.includes('/ecoute-')).length,2);assert.equal(clips.filter(s=>s.endsWith('/bip-d-annonce.mp3')).length,3)
  assert.equal(clips.filter(s=>s.includes('/lettre-')).length,type.endsWith('03')?0:10)
  const details=await full.evaluate(async node=>{const bytes=await(await fetch(node.currentSrc)).arrayBuffer(),view=new DataView(bytes),digest=await crypto.subtle.digest('SHA-256',bytes);await node.play();return {sha256:[...new Uint8Array(digest)].map(v=>v.toString(16).padStart(2,'0')).join(''),sampleRate:view.getUint32(24,true),channels:view.getUint16(22,true),duration:node.duration}})
  await page.waitForFunction(type=>document.querySelector(`.sheet-stage:not(.print-only-sheets) [data-exercise-type="${type}"] audio[data-audio-sequence]`)?.currentTime>.1,type)
  await full.evaluate(node=>node.pause());assert.equal(details.sampleRate,24000);assert.equal(details.channels,1);assert(details.duration>60)
  return {type,...details,consignes:1,listens:2,bips:3}
}
try{
 await mkdir(evidence,{recursive:true});const context=await browser.newContext({viewport:{width:1440,height:1100}});await context.addCookies([{name:'clairfle-fiche-access',value:'admin',url:base}])
 const page=await context.newPage();page.setDefaultTimeout(60000);page.on('pageerror',e=>errors.push(e.message));await page.goto(base+'/generateur',{waitUntil:'domcontentloaded',timeout:120000});await page.getByLabel('Domaine',{exact:true}).click();await page.getByRole('option',{name:'TCM CSC',exact:true}).click();await page.getByLabel('Page 17',{exact:true}).waitFor()
 assert.match(await preview(page).innerText(),/Le score maximum est de 100 points\./);await preview(page).screenshot({path:evidence+'/premiere-page-100-points.png'})
 await page.getByLabel('Page 2',{exact:true}).click();await button(page,'Fiche élève (cliquer pour corrigé)').click();await checkPlayers(page,'tcm-csc-ex03','Nombre',false);const fullAudios=[await checkFullPlayer(page,'tcm-csc-ex03')]
 await page.getByLabel('Page 3',{exact:true}).click();await checkPlayers(page,'tcm-csc-ex01','Nombre',false);fullAudios.push(await checkFullPlayer(page,'tcm-csc-ex01'));await checkPlayers(page,'tcm-csc-ex02','Calcul',true);fullAudios.push(await checkFullPlayer(page,'tcm-csc-ex02'));await preview(page).screenshot({path:evidence+'/lecteurs-audios-complets.png'})
 console.log('CSC: three complete narrated players decoded and played.')
 const [download]=await Promise.all([page.waitForEvent('download',{timeout:120000}),button(page,'Télécharger tous les audios de la fiche').click()]);assert.equal(download.suggestedFilename(),'TCM-CSC_AUDIOS.zip');const entries=zipEntries(await readFile(await download.path()));assert.equal(entries.length,3)
 const files=entries.map(({name,data})=>{const type=name.includes('ENTOURER')?'tcm-csc-ex03':name.includes('NOMBRES')?'tcm-csc-ex01':'tcm-csc-ex02',reference=fullAudios.find(a=>a.type===type);assert(reference);const sha256=createHash('sha256').update(data).digest('hex');assert.equal(sha256,reference.sha256);return{name,sha256,bytes:data.length,duration:reference.duration}})
 console.log('CSC: each downloaded WAV matches its complete on-screen player byte for byte.')
 await page.getByRole('dialog',{name:'Préparation audio',exact:true}).getByRole('button',{name:'Fermer',exact:true}).click()
 const points=page.getByRole('spinbutton',{name:'Points par question de l’exercice sélectionné',exact:true});assert.equal(await points.count(),1);await points.fill('3');await points.blur();await page.getByLabel('Page 1',{exact:true}).click();assert.match(await preview(page).innerText(),/Le score maximum est de 100 points\./)
 await page.getByLabel('Page 16',{exact:true}).click();await button(page,'Corrigé (cliquer pour fiche élève)').click();const pads=preview(page).locator('.csc-problem-text .draft-pad');assert.equal(await pads.count(),2);assert((await pads.evaluateAll(nodes=>nodes.map(n=>getComputedStyle(n).backgroundImage))).every(s=>s.includes('linear-gradient')))
 const gridButton=preview(page).locator('[data-exercise-type="tcm-csc-ex22"]').getByRole('button',{name:'Grille',exact:true});await gridButton.click();assert.equal(await pads.first().evaluate(n=>getComputedStyle(n).backgroundImage),'none');await preview(page).locator('[data-exercise-type="tcm-csc-ex22"]').getByRole('button',{name:'Sans',exact:true}).click();assert((await pads.evaluateAll(nodes=>nodes.map(n=>getComputedStyle(n).backgroundImage))).every(s=>s.includes('linear-gradient')));await preview(page).screenshot({path:evidence+'/problemes-grilles-ecran.png'})
 await page.emulateMedia({media:'print'});await page.evaluate(()=>document.fonts.ready);const printed=page.locator('.print-only-sheets .worksheet-sheet'),printedPads=printed.locator('.csc-problem-text .draft-pad');assert([3,6].includes(await printedPads.count()))
 const styles=await printedPads.evaluateAll(nodes=>nodes.map(n=>({background:getComputedStyle(n).backgroundImage,border:getComputedStyle(n).borderWidth,bottom:n.getBoundingClientRect().bottom,footer:n.closest('.worksheet-sheet').querySelector('.doc-footer').getBoundingClientRect().top})));assert(styles.every(s=>s.background==='none'&&s.border==='1px'&&s.bottom<=s.footer+1))
 const indexes=await printed.evaluateAll(nodes=>nodes.flatMap((n,i)=>n.querySelector('[data-exercise-type="tcm-csc-consignes"],.csc-problem-text')?[i+1]:[]));assert([3,6].includes(indexes.length));const text=await printed.first().innerText();assert.match(text,/Le score maximum est de 100 points\./)
 await page.pdf({path:evidence+'/csc-100-points-cadres-sans-grille.pdf',format:'A4',preferCSSPageSize:true,printBackground:true,pageRanges:indexes.join(',')})
 assert.deepEqual(errors,[]);results.push({fullAudios,files,fixedScoreAfterChangingPointsPerQuestion:100,screenProblemGrids:2,toggleWorksOnScreen:true,printedProblemZones:styles.length,printBackgroundsEnabled:true,printedGridBackgrounds:styles.map(s=>s.background),printBordersPreserved:true,pdfPages:indexes.length,errors})
 await writeFile(evidence+'/browser-results.json',JSON.stringify({status:'passed',results},null,2)+'\n');console.log(JSON.stringify({status:'passed',completeAudioPlayers:3,identicalDownloadedWavs:3,fixedScore:100,blankPrintedProblemZones:styles.length,pdfPages:indexes.length,errors}));await context.close()
}finally{await browser.close();await server.close()}
