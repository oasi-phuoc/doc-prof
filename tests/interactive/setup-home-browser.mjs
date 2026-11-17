import assert from 'node:assert/strict'
import {mkdir, writeFile} from 'node:fs/promises'
import {execFileSync} from 'node:child_process'
import {chromium} from 'playwright'
import AxeBuilder from '@axe-core/playwright'
import {gameControl} from './browser-actions.mjs'

const base=process.env.INTERACTIVE_TEST_URL??'http://127.0.0.1:5180'
const output=process.env.SETUP_TEST_OUTPUT??'/tmp/clairfle-setup-qa'
await mkdir(output,{recursive:true})
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH??'/usr/bin/chromium',args:['--no-sandbox']})
const results=[],errors=[]
const action=(page,title)=>page.getByRole('button',{name:new RegExp('^'+title)})
const dialog=(page,title)=>page.getByRole('dialog',{name:title,exact:true})
async function close(page,title){await dialog(page,title).getByRole('button',{name:'Fermer · '+title,exact:true}).click()}
async function fit(page){assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);const d=page.locator('.ci-setup-dialog[open]');if(await d.count()){const r=await d.boundingBox(),v=page.viewportSize();assert(r.x>=0&&r.y>=0&&r.x+r.width<=v.width+1&&r.y+r.height<=v.height+1,JSON.stringify({r,v}))}}
async function axe(page){const r=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();assert.deepEqual(r.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})),[])}
try{
 for(const[width,height]of[[390,844],[360,640],[1366,768]]){
  const context=await browser.newContext({viewport:{width,height}})
  await context.addCookies([{name:'clairfle-fiche-access',value:'admin',url:base}])
  const page=await context.newPage();page.on('pageerror',error=>errors.push(error.message))
  await page.goto(base+'/interactif');await page.getByRole('heading',{name:'On joue ?'}).waitFor({timeout:120000})
  assert.equal(await page.locator('.ci-pool-layout:visible,.ci-toolbar-options:visible').count(),0)
  assert.equal(await page.locator('.ci-header button').count(),0)
  await fit(page);await axe(page);await page.screenshot({path:`${output}/home-${width}.png`})
  assert.equal(await action(page,'Préparer la séance').count(),0)
  assert.equal(await action(page,'Parties et bilans').count(),0)
  assert.equal(await action(page,'Compétition').count(),0)
  await action(page,'Imprimer les cartes').click()
  await page.getByRole('spinbutton',{name:'Jeux de cartes'}).fill('2')
  await page.emulateMedia({media:'print'});assert.equal(await page.locator('.ci-card-sheet:visible').count(),4)
  if(width===390){await page.pdf({path:`${output}/cartes-accueil.pdf`,preferCSSPageSize:true,printBackground:true});assert.match(execFileSync('pdfinfo',[`${output}/cartes-accueil.pdf`],{encoding:'utf8'}),/Pages:\s+4/)}
  await page.emulateMedia({media:'screen'});await close(page,'Imprimer les cartes')

  await action(page,'Contenu').click();await page.getByRole('combobox',{name:'Domaine des exercices'}).selectOption('algèbre')
  await page.locator('input[data-pool-type="addition-ligne"]').check()
  const entry=page.locator('[data-selected-pool-type="addition-ligne"]');await entry.locator('summary').click();await entry.getByRole('spinbutton',{name:/Nombre d’éléments/}).fill('2')
  await fit(page);await axe(page);await page.screenshot({path:`${output}/pool-${width}.png`})
  await page.keyboard.press('Escape');await action(page,'Contenu').click()
  assert.equal(await page.locator('input[data-pool-type="addition-ligne"]').isChecked(),true)
  await page.locator('[data-selected-pool-type="addition-ligne"] summary').click();assert.equal(await page.locator('[data-selected-pool-type="addition-ligne"]').getByRole('spinbutton',{name:/Nombre d’éléments/}).inputValue(),'2')
  await page.getByRole('button',{name:'Préparer la partie',exact:true}).click();await page.waitForURL(url=>url.searchParams.has('pool'))
  await page.locator('.ci-launch:enabled').waitFor({timeout:120000});const poolId=new URL(page.url()).searchParams.get('pool')
  assert.equal(await page.locator('.ci-question-list:visible,.ci-readability-check,.ci-ritual').count(),0)
  assert.equal(await page.locator('.ci-header button').count(),0)
  await fit(page);await axe(page);await page.screenshot({path:`${output}/ready-${width}.png`})
  const settings=action(page,'Préparer la séance');await settings.click()
  await dialog(page,'Préparer la séance').getByRole('checkbox',{name:'Activer le minuteur'}).uncheck()
  await dialog(page,'Préparer la séance').getByRole('spinbutton',{name:'Temps entre les questions (secondes)',exact:true}).fill('3')
  await page.getByRole('button',{name:'Solo',exact:true}).click()
  await page.locator('.ci-settings-mascots summary').click()
  const mascots=page.locator('.ci-settings-mascot-grid button');const mascotName=await mascots.last().getAttribute('aria-label');await mascots.last().click()
  await fit(page);await axe(page);await page.screenshot({path:`${output}/settings-${width}.png`})
  await page.keyboard.press('Escape');assert.equal(await page.getByRole('dialog').count(),0)
  assert.equal(await settings.evaluate(el=>el===document.activeElement),true)
  await settings.click();assert.equal(await page.getByRole('checkbox',{name:'Activer le minuteur'}).isChecked(),false)
  assert.equal(await page.getByRole('spinbutton',{name:'Temps entre les questions (secondes)',exact:true}).inputValue(),'3')
  assert.equal(await page.getByRole('button',{name:'Solo',exact:true}).getAttribute('aria-pressed'),'true')
  await page.getByRole('button',{name:'Classe',exact:true}).click();await close(page,'Préparer la séance')
  await action(page,'Préparer la séance').click()
  assert.equal(await page.getByRole('checkbox',{name:'Activer le minuteur'}).isChecked(),false)
  assert.equal(await page.getByRole('spinbutton',{name:'Temps entre les questions (secondes)',exact:true}).inputValue(),'3')
  assert.equal(await page.locator('.ci-settings-mascots summary [role="img"]').getAttribute('aria-label'),mascotName)
  await page.locator('summary').filter({hasText:'Ordre des questions et préréglages'}).click()
  await page.getByRole('combobox',{name:'Ordre des questions',exact:true}).selectOption('source')
  await page.getByRole('textbox',{name:'Nom du préréglage',exact:true}).fill('Séance courte')
  await page.getByRole('button',{name:'Enregistrer le préréglage',exact:true}).click()
  await page.getByRole('status').filter({hasText:'Préréglage enregistré sur cet appareil.'}).waitFor()
  await close(page,'Préparer la séance')
  await action(page,'Contenu').click();assert.equal(await page.locator('.ci-question-list fieldset > label').count(),2)
  await page.locator('.ci-question-list fieldset > label').last().locator('input').uncheck()
  await page.getByRole('button',{name:'Valider la sélection'}).click()
  await page.locator('.ci-launch:enabled').waitFor();assert.match(await page.locator('.ci-setup-welcome').innerText(),/1 question/)
  if(width===390){
   await page.getByRole('button',{name:'Supports à imprimer'}).click()
   await page.getByRole('spinbutton',{name:'Jeux de cartes'}).fill('2')
   await page.emulateMedia({media:'print'});assert.equal(await page.locator('.ci-card-sheet:visible').count(),4)
   await page.pdf({path:`${output}/cartes.pdf`,preferCSSPageSize:true,printBackground:true})
   assert.match(execFileSync('pdfinfo',[`${output}/cartes.pdf`],{encoding:'utf8'}),/Pages:\s+4/)
   await page.emulateMedia({media:'screen'});await close(page,'Supports à imprimer')
  }
  await page.locator('.ci-launch:enabled').click();await page.locator('.ci-answer').first().waitFor()
  assert.equal(await page.getByRole('button',{name:'Options du jeu',exact:true}).count(),1)
  await gameControl(page,'Terminer la séance').click();await page.getByRole('button',{name:'Terminer et voir le bilan',exact:true}).click()
  await page.locator('.ci-summary').waitFor();await page.getByRole('button',{name:'Terminer',exact:true}).click()
  await page.locator('.ci-launch:enabled').waitFor();await action(page,'Parties et bilans').click()
  await page.getByRole('button',{name:'Ouvrir ce bilan',exact:true}).waitFor()
  await page.getByRole('button',{name:'Supprimer',exact:true}).click()
  await page.getByRole('dialog',{name:'Supprimer cette partie ?',exact:true}).getByRole('button',{name:'Annuler',exact:true}).click()
  assert.equal(await dialog(page,'Parties et bilans').isVisible(),true)
  await fit(page);await axe(page);await page.screenshot({path:`${output}/history-${width}.png`})
  await page.getByRole('button',{name:'Ouvrir ce bilan',exact:true}).click();await page.locator('.ci-summary').waitFor()
  await page.getByRole('button',{name:'Terminer',exact:true}).click();await page.locator('.ci-launch:enabled').waitFor()
  // The pool's own history is reachable from the clean entry page too.
  await page.goto(base+'/interactif');await action(page,'Contenu').click()
  await page.getByText('Pools enregistrés sur cet appareil',{exact:true}).click();await page.getByRole('link',{name:'Ouvrir',exact:true}).click();await page.locator('.ci-launch:enabled').waitFor();await action(page,'Parties et bilans').click();await dialog(page,'Parties et bilans').waitFor()
  assert.equal(new URL(page.url()).searchParams.get('pool'),poolId)
  await close(page,'Parties et bilans');await action(page,'Compétition').click()
  await page.getByRole('button',{name:'Préparer un duel',exact:true}).waitFor()
  results.push({viewport:`${width}x${height}`,axeViolations:0,checks:['Clean entry and prepared-game home','Settings, mascot and timer retained after dialog closure','Pool edits survive dialog closure','Presets and question selection retained','Saved pool reopens from content; its report is available after selection','Nested archive confirmation preserved','Competition still reachable',...(width===390?['Four duplex A4 pages from the print dialog']:[])]})
  await context.close()
 }
 assert.deepEqual(errors,[]);await writeFile(output+'/results.json',JSON.stringify({passed:true,results,errors},null,2)+'\n');console.log(JSON.stringify(results,null,2))
}catch(error){for(const page of browser.contexts().flatMap(context=>context.pages())){await page.screenshot({path:output+'/error.png',fullPage:true}).catch(()=>{});await writeFile(output+'/error.txt',await page.locator('body').innerText()).catch(()=>{})}throw error}finally{await browser.close()}
