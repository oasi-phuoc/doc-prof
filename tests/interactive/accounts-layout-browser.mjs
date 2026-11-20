import assert from 'node:assert/strict'
import {readFile,writeFile} from 'node:fs/promises'
import {createServer} from 'vite'
import {chromium} from 'playwright'
const base='http://127.0.0.1:5194',server=await createServer({cacheDir:'/tmp/accounts-layout-vite',server:{host:'127.0.0.1',port:5194,strictPort:true},define:{'import.meta.env.VITE_FICHES_API_URL':JSON.stringify('/__test_api')}})
await server.listen();let browser
try{
 const {buildTcmCfrTestPages}=await server.ssrLoadModule('/src/tcm-cfr/test.ts'),template=JSON.parse(await readFile('docs/interactive/demo-source-recipe.json','utf8'))
 const all=buildTcmCfrTestPages(),has=(p,id)=>[p,...p.extraBlocks??[]].some(b=>b.exerciseType===id)
 const pages=[all[0],...all.filter(p=>['tcm-cfr-ex22','tcm-cfr-ex23','tcm-cfr-ex24','tcm-cfr-ex25','tcm-cfr-ex26','tcm-cfr-ex28'].some(id=>has(p,id)))]
 browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});const context=await browser.newContext({viewport:{width:1440,height:1200}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await context.addCookies([{name:'clairfle-fiche-access',value:'admin',url:base}]);await context.addInitScript(f=>{if(location.pathname==='/generateur')history.replaceState({clairfleFiche:f},'',location.href)},{id:'cfr-latest',name:'CFR',recipe:{...template,pages,libreMode:false,libreSnapshot:null,evalMode:true}})
 await page.goto(base+'/generateur');const stage=page.locator('.sheet-stage:not(.print-only-sheets)');await stage.locator('.exercise-block').first().waitFor({timeout:120000})
 const cfr=[]
 for(let i=0;i<pages.length;i++){
  if(i)await page.getByLabel(`Page ${i+1}`,{exact:true}).click()
  const info=await stage.locator('.exercise-block').evaluateAll(ns=>ns.map(n=>({type:n.dataset.exerciseType,instruction:n.querySelector('.exercise-instruction')?.textContent,font:n.querySelector('.exercise-instruction')?getComputedStyle(n.querySelector('.exercise-instruction')).fontSize:null,bold:[...n.querySelectorAll('.exercise-instruction strong')].map(x=>x.textContent),overflow:n.getBoundingClientRect().bottom-n.closest('.worksheet-sheet').querySelector('.sheet-body').getBoundingClientRect().bottom})))
  await stage.screenshot({path:`/tmp/accounts-cfr-${i}.png`});
  for(const x of info){if(x.font)assert.equal(x.font,'20px',x.type);assert(x.overflow<=1,`${x.type} déborde de ${x.overflow}`)}
  const replies=await stage.locator('.geo-dual-answers.is-single .geo-phrase-answer').evaluateAll(ns=>ns.map(n=>{const l=n.querySelector('.geo-answer-label'),b=n.querySelector('.answer-line-field'),r=n.getBoundingClientRect(),br=b?.getBoundingClientRect();return{bold:l?getComputedStyle(l).fontWeight:null,label:l?.textContent,lineBelow:br&&br.top>=l.getBoundingClientRect().bottom-1,width:br?.width,available:r.width}}))
  for(const x of replies){assert.equal(x.label,'Phrase réponse :');assert.equal(x.bold,'700');assert(x.lineBelow);assert(Math.abs(x.width-x.available)<1)}
  if(has(pages[i],'tcm-cfr-ex28')){assert(info[0].instruction.includes('questions. Écrivez'));assert.deepEqual(info[0].bold,['Répondez','Écrivez'])}
  await stage.screenshot({path:`/tmp/accounts-cfr-${i}.png`});cfr.push({info,replies})
 }
 await page.emulateMedia({media:'print'});const printOverflow=await page.locator('.print-only-sheets .exercise-block').evaluateAll(ns=>ns.map(n=>({type:n.dataset.exerciseType,overflow:n.getBoundingClientRect().bottom-n.closest('.worksheet-sheet').querySelector('.sheet-body').getBoundingClientRect().bottom})).filter(x=>x.overflow>1));assert.deepEqual(printOverflow,[]);await page.pdf({path:'/tmp/accounts-cfr-print.pdf',format:'A4',printBackground:true});await page.emulateMedia({media:'screen'})
 await page.goto(base+'/tests/fixtures/measured-figures.html');await page.locator('[data-type="sphere"] .geometry-measure-label').waitFor();const measures=await page.locator('section[data-type]').evaluateAll(ns=>ns.map(n=>({type:n.dataset.type,text:n.querySelector('h2').textContent,labels:[...n.querySelectorAll('.geometry-measure-label')].map(l=>({text:l.textContent,font:getComputedStyle(l).fontSize,svg:!!l.closest('svg')})),svgText:n.querySelectorAll('svg text').length,overflow:n.scrollWidth-n.clientWidth})))
 for(const x of measures){assert(x.labels.length,x.type);assert.equal(x.svgText,0);for(const l of x.labels){assert.equal(l.font,'20px',x.type);assert(!l.svg)}}
 await page.screenshot({path:'/tmp/accounts-all-figures.png',fullPage:true})
 // Accès existant admin et formulaire de création de compte.
 await context.clearCookies();await page.goto(base+'/acces');await page.getByRole('button',{name:'Créer un compte',exact:true}).click();await page.getByLabel('Prénom',{exact:true}).fill('Camille');await page.getByLabel('Nom',{exact:true}).fill('Exemple');assert.equal(await page.getByLabel('Adresse e-mail professionnelle').getAttribute('type'),'email');await page.screenshot({path:'/tmp/accounts-registration.png'})
 await page.getByRole('button',{name:'Admin / accès existant'}).click();await page.getByLabel('Mot de passe',{exact:true}).fill('jesuisleboss');await page.getByRole('button',{name:'Continuer vers les fiches',exact:true}).click();await page.waitForURL('**/generateur');await stage.locator('.exercise-block').first().waitFor()
 // Enregistrement legacy : nom requis et conservé dans la recette.
 let stored=null;await page.route('**/__test_api/fiches',async route=>{const req=route.request();if(req.method()==='POST'){const body=req.postDataJSON();stored={id:'11111111-1111-4111-8111-111111111111',...body,domains:['algèbre'],createdAt:'2026-11-20',updatedAt:'2026-11-20'};await route.fulfill({status:201,json:{fiche:stored}})}else await route.fulfill({status:200,json:{fiches:stored?[stored]:[]}})})
 await page.getByRole('button',{name:'Enregistrer',exact:true}).click();const dialog=page.getByRole('dialog',{name:'Enregistrer la fiche'});await dialog.getByLabel('Nom de la fiche').fill('Test auteur');await dialog.getByLabel('Enregistré par').fill('Prénom Nom');await dialog.getByRole('button',{name:'Enregistrer',exact:true}).click();await dialog.waitFor({state:'hidden'});assert.equal(stored.recipe.savedBy,'Prénom Nom');assert.equal(await page.evaluate(()=>localStorage.getItem('clairfle-fiche-saved-by')),'Prénom Nom')
 await page.goto(base+'/fiches');await page.getByText('Enregistré par Prénom Nom',{exact:true}).waitFor()
 assert.deepEqual(errors,[]);await writeFile('docs/tcm-cfr/comptes-mesures-20261120-browser.json',JSON.stringify({cfr,printOverflow,measures,adminAccessPreserved:true,authorSaved:true,errors},null,2)+'\n');console.log('CFR, 14 formes, compte admin et nom d’enregistrement : vérifiés.')
}finally{await browser?.close();await server.close()}
