import assert from 'node:assert/strict'
import {readFile,writeFile,mkdir} from 'node:fs/promises'
import {createServer} from 'vite'
import {chromium} from 'playwright'
import AxeBuilder from '@axe-core/playwright'

const base='http://127.0.0.1:5187',out='/tmp/clairfle-source-chooser'
process.env.VITE_FICHES_API_URL=base+'/__source_api'
const vite=await createServer({cacheDir:'/tmp/clairfle-source-vite',server:{host:'127.0.0.1',port:5187,strictPort:true,hmr:false}});await vite.listen()
const {defaultPage}=await vite.ssrLoadModule('/src/math/catalog.ts')
const recipe=JSON.parse(await readFile('docs/interactive/demo-source-recipe.json','utf8'))
recipe.pages=[{...recipe.pages[0],count:2,libreItems:undefined}];recipe.libreMode=false
const saved=(id,name,value=recipe)=>({id,name,recipe:value,domains:value.pages.map(p=>p.domain),createdAt:'2026-11-17T08:00:00Z',updatedAt:'2026-11-17T08:00:00Z'})
const fiches=[saved('source-nombres','Écoute des nombres'),saved('source-calcul','Calcul des nombres'),...Array.from({length:21},(_,i)=>saved('source-'+i,`Autre fiche ${String(i).padStart(2,'0')}`)),saved('source-tpm','Accès TPM',{...recipe,pages:[{...defaultPage('tpm'),count:2}]})]
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH??'/usr/bin/chromium',args:['--no-sandbox']})
const requests=[],errors=[],results=[]
try{
 await mkdir(out,{recursive:true})
 for(const [width,height]of[[390,844],[1366,768]]){
  const context=await browser.newContext({viewport:{width,height}})
  await context.addCookies([{name:'clairfle-fiche-access',value:'partial',url:base}])
  await context.addInitScript(()=>localStorage.setItem('clairfle-fiche-sync','local-source-fixture'))
  let state='ready'
  await context.route('**/__source_api/fiches',route=>{requests.push(route.request().method());return route.fulfill({status:state==='error'?503:200,contentType:'application/json',body:JSON.stringify({fiches:state==='empty'?[]:fiches})})})
  const page=await context.newPage();page.on('pageerror',error=>errors.push(error.message))
  await page.goto(base+'/interactif');await page.getByRole('heading',{name:'On joue ?'}).waitFor({timeout:120000})
  const before=requests.length
  await page.getByRole('button',{name:/^Contenu/}).click()
  await page.getByRole('combobox',{name:'Domaine des exercices'}).selectOption('algèbre')
  await page.locator('input[data-pool-type="addition-ligne"]').check()
  assert.equal(requests.length,before,'The pool chooser must not request worksheets.')
  await page.getByRole('button',{name:'Fiches enregistrées',exact:true}).click()
  await page.getByRole('button',{name:'Afficher les fiches suivantes'}).waitFor({timeout:120000})
  const list=page.getByRole('region',{name:'Fiches enregistrées disponibles'})
  assert.equal(await list.locator('li').count(),20)
  assert.equal(await list.getByRole('heading',{name:'Accès TPM',exact:true}).count(),0)
  await page.getByRole('button',{name:'Afficher les fiches suivantes'}).click();assert.equal(await list.locator('li').count(),23)
  await page.getByRole('searchbox',{name:'Rechercher une fiche'}).fill('ecoute')
  assert.equal(await list.locator('li').count(),1)
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false)
  const axe=(await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()).violations
  assert.deepEqual(axe.map(v=>v.id),[])
  await page.screenshot({path:`${out}/fiches-${width}.png`})
  await page.getByRole('button',{name:'Exercices',exact:true}).click()
  assert.equal(await page.locator('input[data-pool-type="addition-ligne"]').isChecked(),true)
  await page.getByRole('button',{name:'Fiches enregistrées',exact:true}).click()
  await page.getByRole('button',{name:'Préparer la fiche : Écoute des nombres',exact:true}).click()
  await page.waitForURL('**/interactif/source-nombres');await page.locator('.ci-launch:enabled').waitFor({timeout:120000})
  assert.equal(await page.locator('.ci-setup-welcome h1').innerText(),'Écoute des nombres')
  await page.getByRole('button',{name:/^Compétition/}).waitFor()
  await page.getByRole('button',{name:'Supports à imprimer',exact:true}).click()
  await page.getByRole('spinbutton',{name:'Jeux de cartes'}).waitFor();await page.keyboard.press('Escape')
  // Errors, retries and empty libraries stay inside the chooser.
  state='error';await page.goto(base+'/interactif');await page.getByRole('button',{name:/^Contenu/}).click();await page.getByRole('button',{name:'Fiches enregistrées',exact:true}).click()
  await page.getByRole('alert').waitFor();state='empty';await page.getByRole('button',{name:'Réessayer le chargement des fiches'}).click()
  await page.getByRole('status').filter({hasText:'Aucune fiche enregistrée.'}).waitFor()
  results.push({viewport:`${width}x${height}`,checks:['No worksheet fetch in Exercises','Direct server worksheet list','Domain access checked against recipe pages','Pagination and accent-insensitive search','Exercise selection retained across source changes','Saved worksheet preparation, competition and print remain reachable','Error, retry and empty-library states'],axeViolations:0})
  await context.close()
 }
 assert.deepEqual(errors,[]);assert(requests.length>0);assert(requests.every(method=>method==='GET'))
 await writeFile('docs/interactive/source-chooser-results.json',JSON.stringify({date:'2026-11-17',passed:true,results,requests,errors},null,2)+'\n');console.log(JSON.stringify(results,null,2))
}catch(error){for(const page of browser.contexts().flatMap(c=>c.pages())){await page.screenshot({path:out+'/error.png',fullPage:true}).catch(()=>{});await writeFile(out+'/error.txt',await page.locator('body').innerText()).catch(()=>{})}throw error}finally{await browser.close();await vite.close()}
